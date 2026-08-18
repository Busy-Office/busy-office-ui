// Gate: the docs' BEHAVIOURAL claims must be true.
//
// Why this exists: on 2026-08-17 a dogfood spike proved that published
// guidance — "return a 409 with the re-rendered record and a banner" —
// did nothing at all under htmx, which discards non-2xx responses. The
// prose was confident, reviewed, and wrong, because nobody had ever run
// it. Prose that asserts runtime behaviour is a hypothesis until it is
// executed; this file executes the load-bearing ones.
//
// Add a case whenever a page claims something a browser can check.
// Drive REAL key/mouse events: an early version dispatched a synthetic
// keydown on `document`, which no delegated handler matches, and
// reported a false failure against a feature that worked.
import { serveDist } from './serve-dist.mjs';
import { gate } from './gate-report.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { DIST } from './paths.mjs';

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const url = (p) => `http://localhost:${port}${base}${p}`;
const g = gate('claims check', 'documented behaviours');
const check = g.check;

/* Every sticky per-page setting, reset on EVERY navigation.
   emulateMediaType, emulateMediaFeatures and the viewport all persist across
   goto, and three separate bugs in this file came from a claim silently
   inheriting a previous claim's state — print media hiding a toolbar a
   keyboard claim was counting, and a viewport left at 390. Each was patched
   with another reactive reset; this removes the class instead. Pass the
   emulation a claim NEEDS; anything unset returns to the default. */
const cdp = await page.createCDPSession();

async function visit(path, { media = 'screen', features = [], width = 1440, height = 1000 } = {}) {
  /* ONE CDP call for both. puppeteer's emulateMediaType and
     emulateMediaFeatures each map onto Emulation.setEmulatedMedia, so calling
     them in sequence makes the second WIPE the first — print claims fell back
     to screen one way round, reduced-motion stopped applying the other. That
     interaction is exactly why this file kept needing reactive resets.
     Setting media and features together removes the ambiguity. */
  await cdp.send('Emulation.setEmulatedMedia', { media, features });
  await page.setViewport({ width, height });
  await page.goto(url(path), { waitUntil: 'networkidle0' });
}


// "Cancel restores the row's values and re-fires input events, so
//  derived totals revert with it." — editable-grid / concurrency
await visit('/patterns/editable-grid/');
const cancel = await page.evaluate(async () => {
  const table = document.querySelector('#eg-adv-table');
  const total = table.querySelector('[data-sum-of="qty"]');
  const before = total.textContent.trim();
  const qty = table.querySelector('input[name="qty"]');
  qty.focus(); qty.value = '99';
  qty.dispatchEvent(new Event('input', { bubbles: true }));
  qty.dispatchEvent(new Event('change', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  const during = total.textContent.trim();
  qty.closest('tr').querySelector('[data-row-edit-cancel]').click();
  await new Promise((r) => setTimeout(r, 200));
  return { before, during, after: total.textContent.trim() };
});
check('Cancel reverts derived totals', cancel.after === cancel.before && cancel.during !== cancel.before, JSON.stringify(cancel));

// "data-loading=true dims the table and blocks interaction mid-swap."
await visit('/components/data-table/');
const loading = await page.evaluate(() => {
  const t = document.querySelector('table[data-loading="true"]');
  return t ? { pointerEvents: getComputedStyle(t).pointerEvents, ariaBusy: t.getAttribute('aria-busy') } : { missing: true };
});
check('data-loading blocks interaction', loading.pointerEvents === 'none', JSON.stringify(loading));

// "Skip the swatch grid" — the 264-button bypass must land after the grid.
await visit('/base/colors/');
const skip = await page.evaluate(() => {
  const link = document.querySelector('.scale-skip');
  const target = document.getElementById(link?.getAttribute('href')?.slice(1) ?? '');
  const grid = document.querySelector('.scale-grid');
  return { hasLink: !!link, targetExists: !!target, after: !!(target && grid && grid.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) };
});
check('Skip link bypasses the swatch grid', skip.hasLink && skip.targetExists && skip.after, JSON.stringify(skip));

// "Read-only content needs tabindex=0 to stay reachable and scrollable."
await visit('/components/richtext/');
const ro = await page.evaluate(() => ({
  tabindex: document.querySelector('.bo-richtext--readonly .bo-richtext__content')?.getAttribute('tabindex'),
}));
check('Read-only rich text is keyboard-reachable', ro.tabindex === '0', JSON.stringify(ro));

// "? opens the shortcuts dialog — and never steals the key while typing."
await visit('/reference/keyboard/');
await page.evaluate(() => { const i = document.createElement('input'); i.id = 'probe-field'; document.querySelector('main').append(i); i.focus(); });
await page.keyboard.press('?');
await new Promise((r) => setTimeout(r, 150));
const whileTyping = await page.evaluate(() => document.getElementById('shortcuts-dlg').open);
await page.evaluate(() => {
  document.getElementById('probe-field').remove();
  const h = document.querySelector('h1'); h.setAttribute('tabindex', '-1'); h.focus();
});
await page.keyboard.press('?');
await new Promise((r) => setTimeout(r, 150));
const otherwise = await page.evaluate(() => document.getElementById('shortcuts-dlg').open);
check('"?" opens shortcuts, never while typing', whileTyping === false && otherwise === true, JSON.stringify({ whileTyping, otherwise }));

// ---- the print layer, executed under print media emulation ----
// Claims from /base/print and the pattern pages: headers repeat, rows
// never split, chrome disappears, badges print as outlines (NOT as
// forced colour — that claim was wrong until 2026-08-17), and markers
// keep the fill that carries their meaning.
await visit('/patterns/invoice-list/', { media: 'print' });
await new Promise((r) => setTimeout(r, 200));
const print = await page.evaluate(() => {
  const g = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : 'NO ELEMENT'; };
  return {
    thead: g('.bo-data-table thead', 'display'),
    row: g('.bo-data-table tbody tr', 'breakInside'),
    toolbar: g('.bo-data-table__toolbar', 'display'),
    sidebar: g('.bo-app-shell__sidebar', 'display'),
    badgeBg: g('.bo-badge', 'backgroundColor'),
    badgeBorder: g('.bo-badge', 'borderTopWidth'),
  };
});
check('print: table header repeats per page', print.thead === 'table-header-group', print.thead);
check('print: rows never split', print.row === 'avoid', print.row);
check('print: app chrome and toolbars are dropped', print.toolbar === 'none' && print.sidebar === 'none', `${print.toolbar}/${print.sidebar}`);
check('print: badges are outlined, not filled', print.badgeBg === 'rgba(0, 0, 0, 0)' && print.badgeBorder !== '0px', `bg ${print.badgeBg}, border ${print.badgeBorder}`);

/* Icons are a mask painted with background-color, and a UA drops backgrounds
   when printing unless told the colour IS the content — so every icon used to
   vanish on paper, leaving its layout box behind (2026-08-18). Confirmed the
   fix in a real print preview, not just here: rendering the launcher to PDF at
   printBackground:false shows the glyphs, and neutralising this one rule to
   `economy` makes all five mask icons disappear while the badge and inline
   <svg> marks still print. This assertion guards the rule that makes that
   true. */
const iconPrint = await page.evaluate(() => {
  const el = document.querySelector('.bo-icon');
  return el ? getComputedStyle(el).printColorAdjust || getComputedStyle(el).webkitPrintColorAdjust : 'NO ELEMENT';
});
check('print: mask icons keep their paint', iconPrint === 'exact', String(iconPrint));

await visit('/components/approval-workflow/', { media: 'print' });
await new Promise((r) => setTimeout(r, 200));
const marker = await page.evaluate(() => {
  const m = document.querySelector('.bo-timeline__marker');
  return m ? { bg: getComputedStyle(m).backgroundColor, adjust: getComputedStyle(m).printColorAdjust } : { bg: 'NO ELEMENT' };
});
check('print: timeline markers keep their fill', marker.bg !== 'rgba(0, 0, 0, 0)' && marker.adjust === 'exact', JSON.stringify(marker));

// (The reactive `emulateMediaType('screen')` reset that used to live here is
// gone: visit() resets media on every navigation, so it cannot leak.)

/* ---------- Keyboard walkthroughs (2026-08-17) ----------
   Pattern pages narrate a keyboard path step by step. Every step is a
   runtime assertion, and none had ever been executed: the sweep that
   added these found two of five steps on the exemplar page flatly
   wrong — "Shift+Tab back to the toolbar" actually lands on the
   previous row checkbox, and "Enter sorts and aria-sort announces the
   new direction" described sorting the framework does not ship at all.
   A walkthrough is a promise a keyboard-only clerk depends on; it gets
   executed like any other claim. */

// "Space on select-all toggles the page's rows and announces the count
//  via the live region." — invoice-list step 2
await visit('/patterns/invoice-list/');
const selectAll = await page.evaluate(async () => {
  document.querySelector('.bo-data-table__select-all').focus();
  return { focused: document.activeElement.classList.contains('bo-data-table__select-all') };
});
await page.keyboard.press('Space');            // a REAL key, not a synthetic event
await new Promise((r) => setTimeout(r, 250));
const selected = await page.evaluate(() => {
  const boxes = [...document.querySelectorAll('tbody .bo-data-table__row-select')];
  const region = [...document.querySelectorAll('[aria-live],[role="status"]')]
    .map((n) => n.textContent.trim()).filter(Boolean);
  return { checked: boxes.filter((b) => b.checked).length, total: boxes.length, region };
});
check(
  'select-all checks every row and announces the count',
  selected.total > 0 && selected.checked === selected.total &&
    selected.region.some((t) => t.includes(String(selected.total))),
  JSON.stringify({ ...selectAll, ...selected }),
);

// "The first selection reveals the bulk actions." — the display flip is
// real even though the Shift+Tab step above it was not.
const revealed = await page.evaluate(() => {
  const g = document.querySelector('.bo-data-table__bulk-actions');
  return { display: getComputedStyle(g).display };
});
check('selection reveals the bulk actions', revealed.display !== 'none', JSON.stringify(revealed));

// "Shift+Tab steps back one checkbox at a time" — the CORRECTED claim.
// Gated because the wrong version ("back to the toolbar") shipped on two
// pages and read as plausible to every reviewer who never pressed the key.
await page.evaluate(() => document.querySelectorAll('tbody .bo-data-table__row-select')[1].focus());
await page.keyboard.down('Shift');
await page.keyboard.press('Tab');
await page.keyboard.up('Shift');
const back = await page.evaluate(() => {
  const a = document.activeElement;
  const boxes = [...document.querySelectorAll('tbody .bo-data-table__row-select')];
  return { isRowCheckbox: boxes.includes(a), index: boxes.indexOf(a), label: a.getAttribute('aria-label') };
});
check(
  'Shift+Tab from a row checkbox lands on the previous row checkbox, not the toolbar',
  back.isRowCheckbox && back.index === 0,
  JSON.stringify(back),
);

/* "Enter from any row checkbox runs the bulk action" (roadmap item 13).
   The Shift+Tab distance above is what the page USED to have to explain;
   the answer was native implicit submission, so what gets gated now is the
   mechanism itself. Fresh load: the assertions above leave selection and
   focus state behind, and this one depends on both. */
await visit('/patterns/invoice-list/');
const enterActs = await page.evaluate(() => {
  const form = document.getElementById('il-bulk');
  if (!form) return { error: 'no bulk form' };
  window.__submits = [];
  form.addEventListener('submit', () => window.__submits.push(document.activeElement?.getAttribute('aria-label')));
  const boxes = [...document.querySelectorAll('tbody .bo-data-table__row-select')];
  const last = boxes[boxes.length - 1];
  last.focus();
  return { rows: boxes.length, focused: last.getAttribute('aria-label') };
});
await page.keyboard.press('Space');
await page.keyboard.press('Enter');          // zero Shift+Tabs, from the LAST row
await new Promise((r) => setTimeout(r, 250));
const acted = await page.evaluate(() => ({
  // Default to [] so a MISSING form fails this check cleanly instead of
  // throwing — a gate that crashes hides which claim actually broke.
  submits: window.__submits ?? [],
  stillFocused: document.activeElement?.getAttribute('aria-label'),
}));
check(
  'Enter from the last row checkbox runs the bulk action, focus unmoved',
  !enterActs.error && acted.submits.length === 1 && acted.stillFocused === enterActs.focused,
  JSON.stringify({ ...enterActs, ...acted }),
);

// The safe action is the ONLY submit button, so implicit submission can never
// fire a destructive bulk action. This is the guard on that contract.
const buttonTypes = await page.evaluate(() =>
  [...document.querySelectorAll('#il-bulk .bo-data-table__bulk-actions button')]
    .map((b) => ({ text: b.textContent.trim(), type: b.type })));
check(
  'only the safe bulk action is type=submit',
  buttonTypes.filter((b) => b.type === 'submit').length === 1 &&
    !/reject|delete|remove/i.test(buttonTypes.find((b) => b.type === 'submit').text),
  JSON.stringify(buttonTypes),
);

// "Sorting is your code — the framework ships none." Guards the corrected
// text: if a sort behaviour is ever added, this fails and the page that
// says "the framework ships none" must be rewritten in the same commit.
const sortInert = await page.evaluate(async () => {
  const th = document.querySelector('.bo-data-table__sort-btn').closest('th');
  const before = th.getAttribute('aria-sort');
  document.querySelector('.bo-data-table__sort-btn').focus();
  return { before };
});
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 250));
const sortAfter = await page.evaluate(() =>
  document.querySelector('.bo-data-table__sort-btn').closest('th').getAttribute('aria-sort'));
check(
  'the sort header is inert without app code (docs say so)',
  sortInert.before === sortAfter,
  JSON.stringify({ ...sortInert, after: sortAfter }),
);

// "The sticky action bar never hides the focused field." — detail-form
await visit('/patterns/detail-form/');
const hidden = await page.evaluate(() => {
  const bar = document.querySelector('.bo-form-actions');
  if (!bar || !['sticky', 'fixed'].includes(getComputedStyle(bar).position)) return ['bar not sticky'];
  const out = [];
  for (const f of document.querySelectorAll('#main-content form input, #main-content form select')) {
    f.focus();
    const a = f.getBoundingClientRect(), b = bar.getBoundingClientRect();
    if (a.bottom > b.top && a.top < b.bottom && a.right > b.left && a.left < b.right)
      out.push(f.name || f.id || f.className);
  }
  return out;
});
check('sticky action bar never covers the focused field', Array.isArray(hidden) && hidden.length === 0, JSON.stringify(hidden));

/* "reduced-motion zeroing on all animations" — /concepts/accessibility.
   The mechanism is that prefers-reduced-motion zeroes the duration TOKENS,
   so both halves get asserted: the token really is 0ms under emulation, and
   the one animation that cannot use a token (the skeleton shimmer, which is
   infinite and literal) is switched off outright. check-motion.mjs guards
   the CSS structure statically; this proves the browser actually honours it. */
/* The document frame (roadmap 24.6). /patterns/record-detail states a
   measured chrome budget, so the budget is gated rather than the exact
   pixels: an identity line that creeps past 80px is the regression the
   measurement existed to prevent. Also asserts status is not duplicated
   between the line and the facts strip — it was, and cost 54px at phone
   width for a fact the reader had already seen. */
for (const w of [1440, 390]) {
  await page.setViewport({ width: w, height: 900 });
  for (const pat of ['record-detail', 'detail-form']) {
    await visit(`/patterns/${pat}/`, { width: w, height: 900 });
    const frame = await page.evaluate(() => {
      const demo = document.querySelector('section.demo');
      const line = demo?.querySelector('.bo-cluster--split');
      if (!line) return { missing: true };
      const kv = demo.querySelector('.bo-kv');
      return {
        h: Math.round(line.getBoundingClientRect().height),
        type: !!line.querySelector('.bo-badge--type'),
        status: !!line.querySelector('.bo-badge--success, .bo-badge--warning, .bo-badge--danger'),
        statusInFacts: kv ? /status/i.test(kv.textContent || '') : false,
      };
    });
    check(
      `${pat} identity line is within the 80px chrome budget at ${w} (type + status, status not duplicated in facts)`,
      !frame.missing && frame.h > 0 && frame.h <= 80 && frame.type && frame.status && !frame.statusInFacts,
      JSON.stringify({ width: w, ...frame }),
    );
  }
}
await visit('/components/state-patterns/', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
const reduced = await page.evaluate(() => {
  const root = getComputedStyle(document.documentElement);
  const sk = document.querySelector('.bo-skeleton');
  return {
    base: root.getPropertyValue('--bo-motion-duration-base').trim(),
    slow: root.getPropertyValue('--bo-motion-duration-slow').trim(),
    skeleton: sk ? getComputedStyle(sk).animationName : 'MISSING',
  };
});
check(
  'prefers-reduced-motion zeroes the duration tokens and stops the infinite shimmer',
  reduced.base === '0ms' && reduced.slow === '0ms' && reduced.skeleton === 'none',
  JSON.stringify(reduced),
);
/* /components/sidebar-nav claims a long label "wraps onto another line… is not
   truncated and does not widen the rail". That is a runtime assertion about the
   rendered box, so it is executable here rather than trusted. Checked at 1440:
   at narrow widths the docs shell collapses the rail to icon-only and there is
   no label to wrap, which the page itself now says. */
await visit('/components/sidebar-nav/', { width: 1440 });
const rail = await page.evaluate(() => {
  const nav = document.querySelector('nav[aria-label="Long labels"]');
  if (!nav) return { missing: true };
  const label = nav.querySelector('.bo-sidebar-nav__label');
  const r = label.getBoundingClientRect();
  const line = parseFloat(getComputedStyle(label).lineHeight) || 21;
  return {
    lines: Math.round(r.height / line),
    railOverflow: nav.scrollWidth - nav.clientWidth,
    truncated: label.scrollWidth > label.clientWidth + 1,
  };
});
/* `lines >= 2`, NOT `=== 2`. The first version asserted exactly two lines and
   was green locally and red in CI: Linux font metrics wrap the same label onto
   three. The page claims the label WRAPS, is not truncated, and does not widen
   the rail — it never claims a line count, and a count is a property of the
   font, not of the behaviour being documented. */
check(
  'sidebar-nav: an over-long label wraps, untruncated, without widening the rail',
  !rail.missing && rail.lines >= 2 && rail.railOverflow <= 0 && rail.truncated === false,
  JSON.stringify(rail),
);

/* An open dropdown must FOLLOW its trigger through scroll and resize (owner
   bug report, 2026-08-18). The menu is `position: fixed` in the top layer with
   viewport coordinates written by JS, and those coordinates used to be written
   once, on open — so scrolling left the menu nailed to the screen while its
   trigger moved away underneath it. Real events, and MORE THAN ONE movement:
   with the bug present a single scroll happened to land within 6px of correct,
   which would have read as a pass. */
await visit('/components/filters/', { width: 1440 });
await page.click('[popovertarget="view-menu"]');
await new Promise((r) => setTimeout(r, 200));
const anchored = [];
for (const by of [250, -120]) {
  await page.evaluate((by) => { document.querySelector('.bo-app-shell__main').scrollTop += by; }, by);
  await new Promise((r) => setTimeout(r, 200));
  anchored.push(await page.evaluate(() => {
    const t = document.querySelector('[popovertarget="view-menu"]').getBoundingClientRect();
    const m = document.getElementById('view-menu').getBoundingClientRect();
    // the menu may sit above or below its trigger (it flips when short of room)
    return Math.round(Math.min(Math.abs(m.top - t.bottom), Math.abs(t.top - m.bottom)));
  }));
}
check(
  'an open dropdown stays anchored to its trigger while the page scrolls',
  anchored.every((gap) => gap <= 8),
  `gaps after each scroll: ${JSON.stringify(anchored)}`,
);

/* /components/tabs claims an over-long strip "scrolls sideways… never wraps and
   never clips, so no tab is unreachable", and that arrow keys bring an
   off-screen tab into view. Both are runtime behaviour (roadmap 30.1). The
   second is the one that matters: it is what makes the missing macOS scrollbar
   an inconvenience rather than a keyboard trap. */
await visit('/components/tabs/', { width: 1440 });
const strip = 'div[aria-label="Module areas"]';
const overflows = await page.evaluate((s) => {
  const l = document.querySelector(s);
  return { over: l.scrollWidth - l.clientWidth, wraps: l.offsetHeight > 80 };
}, strip);
check(
  'tabs: an over-long strip scrolls rather than wrapping or clipping',
  overflows.over > 0 && !overflows.wraps,
  JSON.stringify(overflows),
);
await page.click(`${strip} [role=tab]`);
for (let i = 0; i < 8; i += 1) await page.keyboard.press('ArrowRight');
await new Promise((r) => setTimeout(r, 250));
const reached = await page.evaluate((s) => {
  const l = document.querySelector(s), f = document.activeElement;
  const lr = l.getBoundingClientRect(), fr = f.getBoundingClientRect();
  return { focused: f.textContent.trim(), visible: fr.left >= lr.left - 1 && fr.right <= lr.right + 1 };
}, strip);
/* "The edge fades when there is more to reach… only when the strip actually
   overflows, so a strip that fits is never dimmed." Both halves matter: the
   gating is what stops a fitting strip being permanently dimmed, which would be
   worse than no affordance at all (roadmap 30.1b).

   Two traps this claim hit while being written, both already documented at the
   top of this file and both worth re-stating: it must RESET the scroll position,
   because the keyboard claim above leaves the strip scrolled to the end; and it
   must wait between setting scrollLeft and reading, because the attribute is
   written by a scroll handler that has not run yet in the same synchronous
   block. */
const readFade = (sel) => page.evaluate((s) => {
  const l = document.querySelector(s);
  return { attr: l.dataset.overflow ?? null, masked: getComputedStyle(l).maskImage !== 'none' };
}, sel);
const setScroll = async (sel, x) => {
  await page.evaluate((s, x) => { const l = document.querySelector(s); l.scrollLeft = x; }, sel, x);
  await new Promise((r) => setTimeout(r, 150));
};
const fits = await readFade('div[aria-label="Purchase order"]');
await setScroll(strip, 0);
const atStart = await readFade(strip);
await setScroll(strip, 99999);
const atEnd = await readFade(strip);
await setScroll(strip, 150);
const midway = await readFade(strip);
check(
  'tabs: the overflow fade appears only where there is more to reach',
  fits.attr === null && fits.masked === false &&
    atStart.attr === 'end' && atStart.masked === true &&
    atEnd.attr === 'start' && midway.attr === 'both',
  JSON.stringify({ fits, atStart, atEnd, midway }),
);

check(
  'tabs: arrow keys bring an off-screen tab fully into view',
  reached.focused === 'Settings' && reached.visible,
  JSON.stringify(reached),
);

/* /patterns/field-editor claims "the row marks itself unsaved and offers
   Save/Cancel. Cancel restores the original value". Runtime behaviour, so it is
   executed rather than trusted (roadmap 30.2). Uses a REAL change event: the
   dirty state is committed on change, not on keystroke. */
await visit('/patterns/field-editor/', { width: 1440 });
const fe = await page.evaluate(async () => {
  const tr = document.querySelector('tr[data-row-id="name"]');
  const input = tr.querySelector('input');
  const read = () => ({ state: tr.dataset.rowState ?? null, save: !tr.querySelector('[data-row-edit-save]').hidden });
  const before = { ...read(), value: input.value };
  input.value = 'Changed Ltd';
  /* `input`, not `change`: initRowEdit marks a TEXT field dirty on input and
     only marks SELECTS on change. Dispatching change alone left the row clean
     and read as a failure of the page rather than of the probe. */
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  const dirty = read();
  tr.querySelector('[data-row-edit-cancel]').click();
  await new Promise((r) => setTimeout(r, 200));
  return { before, dirty, after: { ...read(), value: input.value } };
});
check(
  'field editor: a changed row goes dirty with Save/Cancel, and Cancel restores the value',
  fe.before.state === null && fe.dirty.state === 'dirty' && fe.dirty.save === true &&
    fe.after.state === null && fe.after.value === fe.before.value,
  JSON.stringify(fe),
);

/* /components/data-table claims of the 50-column table: "the Item column stays
   put, the header stays put, and both stay opaque over the cells passing
   underneath" (roadmap 30.3). Opacity matters as much as position — a
   transparent frozen cell shows the scrolling content through itself, which
   looks like a rendering bug and makes both unreadable. */
await visit('/components/data-table/', { width: 1440 });
const wide = await page.evaluate(() => {
  const table = document.querySelector('table.bo-data-table--sticky-col');
  const box = table.parentElement;
  const firstCell = table.querySelector('tbody th[scope="row"]');
  const head = table.querySelector('thead th');
  const leftAt = (x) => {
    box.scrollLeft = x;
    return Math.round(firstCell.getBoundingClientRect().left - box.getBoundingClientRect().left);
  };
  const transparent = (el) => {
    const bg = getComputedStyle(el).backgroundColor;
    return bg === 'transparent' || /rgba\(.*,\s*0\)$/.test(bg);
  };
  return {
    cols: table.querySelector('thead tr').children.length,
    overflow: box.scrollWidth - box.clientWidth,
    left0: leftAt(0), left1200: leftAt(1200), leftEnd: leftAt(999999),
    cellTransparent: transparent(firstCell), headTransparent: transparent(head),
    headSticky: getComputedStyle(head).position === 'sticky',
  };
});
check(
  'data-table: the frozen column and header hold, opaque, across 50 columns of scroll',
  wide.cols === 50 && wide.overflow > 1000 &&
    wide.left0 === wide.left1200 && wide.left1200 === wide.leftEnd &&
    wide.cellTransparent === false && wide.headTransparent === false && wide.headSticky,
  JSON.stringify(wide),
);

/* Every tab shows ITS panel — not just the first one (owner report, 2026-08-18).
   The 9-tab demo shipped with all tabs pointing at one panel: it worked on load
   and broke on the first click, because initTabs() loops the tabs setting
   `panel.hidden = !selected` and the last tab in DOM order wins. The static
   check in bo-check-markup catches the STRUCTURE; this catches the BEHAVIOUR,
   and the two fail independently. */
await visit('/components/tabs/', { width: 1440 });
const tabbing = [];
for (const n of [1, 3, 9]) {
  await page.click(`div[aria-label="Module areas"] [role=tab]:nth-child(${n})`);
  await new Promise((r) => setTimeout(r, 150));
  tabbing.push(await page.evaluate(() => {
    const sel = [...document.querySelectorAll('div[aria-label="Module areas"] [role=tab]')]
      .find((t) => t.getAttribute('aria-selected') === 'true');
    const panel = document.getElementById(sel.getAttribute('aria-controls'));
    const showing = [...document.querySelectorAll('[role=tabpanel][id^="ov-p-"]')].filter((x) => !x.hidden).length;
    return { tab: sel.textContent.trim(), visible: panel ? !panel.hidden : false, showing };
  }));
}
check(
  'tabs: every tab reveals its own panel, and exactly one is visible',
  tabbing.every((t) => t.visible && t.showing === 1),
  JSON.stringify(tabbing),
);

await browser.close();
server.close();

g.report('verified live');
