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
//
// @exact — drives a real browser and asserts DOM facts. Exempt from --self-test: there is no
// judgement to get wrong, and ceremony around a lookup is noise.
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

/* /patterns/field-editor: one Save for the record, and Cancel is a native form
   reset that must clear the unsaved marks as well as the values (roadmap 34.1).
   The reset half is the part that would rot silently — the values revert
   visibly, but a stale "dirty" band lies about unsaved work and nobody would
   notice from a screenshot. Uses a REAL input event: initRowEdit marks text
   dirty on input, not on change. */
await visit('/patterns/field-editor/', { width: 1440 });
const fe = await page.evaluate(async () => {
  const row = document.querySelector('tr[data-row-id="name"]');
  const input = row.querySelector('input');
  const read = () => ({
    dirty: row.getAttribute('data-row-state'),
    value: input.value,
    perRowSaveButtons: document.querySelectorAll('[data-row-edit-save]').length,
  });
  const before = read();
  input.value = 'Changed Ltd';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  const dirty = read();
  document.querySelector('button[type="reset"]').click();
  await new Promise((r) => setTimeout(r, 250));
  return { before, dirty, after: read() };
});
check(
  'field editor: one Save for the record, and Cancel restores values AND clears the unsaved marks',
  fe.before.dirty === null && fe.before.perRowSaveButtons === 0 &&
    fe.dirty.dirty === 'dirty' &&
    fe.after.dirty === null && fe.after.value === fe.before.value,
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

/* The vertical rail, one claim per DIRECTION (roadmap 36.1). Both are needed:
   the page promises Up/Down in the rail AND Left/Right in the strip, and a
   behavior that merely swapped the keys would satisfy either claim alone while
   breaking the other. 35.1 is why this presses keys rather than reading CSS — a
   tab demo can look right and work exactly once.

   Real `page.keyboard` events, not `dispatchEvent`: these handlers are
   delegated on `document`, and a hand-built KeyboardEvent is the shortcut that
   has produced false results here before. */
const selectedIn = (label) =>
  page.evaluate((l) => document.querySelector(`div[aria-label="${l}"] [role=tab][aria-selected="true"]`)?.textContent.trim(), label);
const focusSelected = (label) =>
  page.evaluate((l) => {
    const list = document.querySelector(`div[aria-label="${l}"]`);
    (list.querySelector('[role=tab][tabindex="0"]') ?? list.querySelector('[role=tab]')).focus();
  }, label);
async function pressIn(label, key) {
  await focusSelected(label);
  await page.keyboard.press(key);
  await new Promise((r) => setTimeout(r, 60));
  return selectedIn(label);
}
const orientationOf = (label) =>
  page.evaluate((l) => {
    const list = document.querySelector(`div[aria-label="${l}"]`);
    return { orientation: list.getAttribute('aria-orientation'), flexDirection: getComputedStyle(list).flexDirection };
  }, label);

await visit('/components/tabs/', { width: 1440 });

const vRail = { ...(await orientationOf('Vendor settings')), start: await selectedIn('Vendor settings') };
vRail.afterDown = await pressIn('Vendor settings', 'ArrowDown');
vRail.afterUp = await pressIn('Vendor settings', 'ArrowUp');
vRail.afterRight = await pressIn('Vendor settings', 'ArrowRight');
check(
  'tabs (vertical): Up/Down drive the rail, Left/Right do not, aria-orientation is set',
  vRail.orientation === 'vertical' &&
    vRail.flexDirection === 'column' &&
    vRail.afterDown !== vRail.start &&
    vRail.afterUp === vRail.start &&
    // Left/Right must NOT drive a vertical tablist — that is the APG contract.
    vRail.afterRight === vRail.start,
  JSON.stringify(vRail),
);

const hStrip = { ...(await orientationOf('Module areas')), start: await selectedIn('Module areas') };
hStrip.afterRight = await pressIn('Module areas', 'ArrowRight');
hStrip.afterLeft = await pressIn('Module areas', 'ArrowLeft');
hStrip.afterDown = await pressIn('Module areas', 'ArrowDown');
check(
  'tabs (horizontal): Left/Right still drive the strip, Up/Down do not',
  hStrip.orientation === 'horizontal' &&
    hStrip.afterRight !== hStrip.start &&
    hStrip.afterLeft === hStrip.start &&
    hStrip.afterDown === hStrip.start,
  JSON.stringify(hStrip),
);

/* "The rail scrolls when it is taller than its box, and the fade moves to the
   top and bottom edges." That was FALSE when first written and the page said it
   anyway: `align-content` only distributes spare space, so a flex line taller
   than its container overflows instead of being clipped and `overflow-y: auto`
   had nothing to scroll — measured 0px of scrollable height with twelve tabs in
   a 15rem box. Exactly 30.1's three-tab demo that could never overflow, which is
   why the scrollability is asserted rather than described. */
const railScroll = await page.evaluate(() => {
  const list = document.querySelector('.bo-tabs--vertical .bo-tabs__list');
  return {
    scrollable: list.scrollHeight - list.clientHeight,
    overflow: list.dataset.overflow ?? 'none',
    // A block-axis gradient has no "to <side>" prefix; an inline one says "to right/left".
    maskIsBlockAxis: !/to (right|left)/.test(getComputedStyle(list).maskImage),
  };
});
check(
  'tabs (vertical): the rail actually scrolls, and the fade is on the block axis',
  railScroll.scrollable > 20 && railScroll.overflow === 'end' && railScroll.maskIsBlockAxis,
  JSON.stringify(railScroll),
);

/* The narrow collapse — the part a class-based orientation check gets wrong.
   Below 30rem of the tab set's OWN width the rail becomes a strip, so the
   keyboard axis has to follow the rendered layout, not the modifier class. */
await visit('/components/tabs/', { width: 390 });
const narrow = { ...(await orientationOf('Vendor settings')), start: await selectedIn('Vendor settings') };
narrow.afterRight = await pressIn('Vendor settings', 'ArrowRight');
check(
  'tabs (vertical, narrow): the rail collapses to a strip and Left/Right drive it again',
  narrow.flexDirection === 'row' &&
    narrow.orientation === 'horizontal' &&
    narrow.afterRight !== narrow.start,
  JSON.stringify(narrow),
);

/* "This is what you will have in four steps... It is live: check a row and the
   bulk bar appears." (/getting-started/first-screen, roadmap 39.1)

   The tutorial now OPENS with a rendered screen instead of a code block, and
   that screen is composed from the same strings steps 2 and 3 teach. If the
   behaviors are not initialised on this page, the hero is a dead mock-up making
   a live promise — which is exactly the first impression the rebuild exists to
   fix, only worse. */
await visit('/getting-started/first-screen/', { width: 1440 });
const hero = await page.evaluate(async () => {
  const preview = document.querySelector('.demo-pair__preview');
  const firstPre = document.querySelector('pre');
  const box = preview.getBoundingClientRect();
  const count = preview.querySelector('.bo-data-table__selection-count');
  const before = count?.textContent.trim() ?? null;
  preview.querySelector('.bo-data-table__row-select').click();
  await new Promise((r) => setTimeout(r, 150));
  return {
    resultBeforeCode: box.top < firstPre.getBoundingClientRect().top,
    before,
    after: count?.textContent.trim() ?? null,
  };
});
check(
  'first screen: opens with a LIVE result before any code block',
  hero.resultBeforeCode && hero.before === '' && /1 selected/.test(hero.after ?? ''),
  JSON.stringify(hero),
);

/* "Point --bo-icon-src at any SVG and the element gets the framework's sizing,
   currentColor painting and forced-colors handling with no new class from us."
   (/components/icon, roadmap 40.1)

   The whole justification for refusing an icon catalogue is that this mechanism
   replaces it. If it does not actually work for a consumer-authored glyph, the
   refusal is not a trade — it is just twelve icons and a shrug. Asserted here
   rather than described, and against a glyph this repo does not ship. */
await visit('/components/icon/', { width: 1440 });
const iconSrc = await page.evaluate(() => {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23000' stroke-width='2'><path d='M12 5v14M5 12h14'/></svg>";
  const el = document.createElement('span');
  el.className = 'bo-icon';
  el.setAttribute('aria-hidden', 'true');
  el.style.setProperty('--bo-icon-src', `url("data:image/svg+xml,${svg}")`);
  document.querySelector('main').append(el);
  const cs = getComputedStyle(el);
  const box = el.getBoundingClientRect();
  const shipped = document.querySelector('.bo-icon--doc');
  return {
    consumerGlyphPaints: cs.maskImage !== 'none' && cs.maskImage.includes('M12 5v14'),
    paintedWithCurrentColor: cs.backgroundColor === getComputedStyle(el.parentElement).color,
    sizedToFont: Math.round(box.width) === Math.round(box.height) && box.width > 0,
    shippedStillWorks: shipped ? getComputedStyle(shipped).maskImage !== 'none' : false,
  };
});
check(
  'icon: --bo-icon-src renders a consumer glyph with no new class',
  iconSrc.consumerGlyphPaints && iconSrc.paintedWithCurrentColor &&
    iconSrc.sizedToFont && iconSrc.shippedStillWorks,
  JSON.stringify(iconSrc),
);

/* /patterns/filter-panel promises four runtime behaviours, and the whole
   argument for it being a PATTERN rather than a component is that the platform
   and the shipped dropdown already provide them (roadmap 40.4):
     - Escape closes the panel and focus returns to its trigger
     - checking a box does NOT close it (you are picking several)
     - the trigger counts what you picked, as TEXT
   If any of that were untrue the page would be recommending a screen that does
   not work, which is worse than shipping the component it declined to build.

   REAL clicks via page.mouse, not element.click(): a programmatic click does
   not move focus, so the first version of this check asked whether focus
   returned to a trigger that had never held it, and reported a failure against
   behaviour that works. */
await visit('/patterns/filter-panel/', { width: 1440 });
const TRIGGER = '[popovertarget="fp-cc"]';
await page.click(TRIGGER);
await new Promise((r) => setTimeout(r, 150));
const panel = await page.evaluate(() => {
  const menu = document.getElementById('fp-cc');
  return { opened: menu.matches(':popover-open'), triggerFocused: document.activeElement === document.querySelector('[popovertarget="fp-cc"]') };
});
const boxes = await page.$$('#fp-cc input[type=checkbox]');
await boxes[0].click();
await boxes[1].click();
await new Promise((r) => setTimeout(r, 150));
const afterChecking = await page.evaluate(() => ({
  stillOpen: document.getElementById('fp-cc').matches(':popover-open'),
  triggerLabel: document.querySelector('[popovertarget="fp-cc"]').textContent.trim(),
}));
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 200));
const afterEscape = await page.evaluate(() => ({
  closed: !document.getElementById('fp-cc').matches(':popover-open'),
  focusBackOnTrigger: document.activeElement === document.querySelector('[popovertarget="fp-cc"]'),
}));
check(
  'filter panel: opens, stays open while multi-selecting, counts in text, Escape closes and restores focus',
  panel.opened && afterChecking.stillOpen && /\(2\)/.test(afterChecking.triggerLabel) &&
    afterEscape.closed && afterEscape.focusBackOnTrigger,
  JSON.stringify({ ...panel, ...afterChecking, ...afterEscape }),
);

/* "Click one and the date is in the URL... the server decides what is
   selectable" (/components/calendar, roadmap 42.2).

   This is the half the original date-picker refusal left out, so it is asserted
   rather than described: a real submit button must actually submit its ISO date
   with scripting doing nothing, and a day the server marked unavailable must be
   unclickable rather than merely styled. A calendar that only LOOKS pickable is
   the failure this claim exists to prevent. */
await visit('/components/calendar/', { width: 1440 });
const pickable = await page.evaluate(() => {
  const form = document.querySelector('form.bo-calendar');
  const days = [...form.querySelectorAll('button.bo-calendar__day')];
  const blocked = days.filter((d) => d.disabled);
  return {
    isForm: form.method === 'get',
    dayCount: days.length,
    blockedCount: blocked.length,
    // every blocked day is a marked day — disabled and unmarked would be a lie
    blockedAllMarked: blocked.every((d) => d.hasAttribute('data-day')),
    // and every day carries a real ISO value, not an index
    allIso: days.every((d) => /^\d{4}-\d{2}-\d{2}$/.test(d.value) && d.name === 'date'),
  };
});
/* Guarded: if the days stop being buttons this must report a FAILED CLAIM, not
   crash the whole gate on a null. The first version threw here when the days
   were replaced with spans — a red result either way, but one that names the
   claim and one that just dies. */
const target = await page.$('form.bo-calendar button.bo-calendar__day:not([disabled])');
let wanted = null;
let submitted = null;
if (target) {
  wanted = await target.evaluate((el) => el.value);
  await target.click();
  await new Promise((r) => setTimeout(r, 400));
  submitted = new URL(page.url()).searchParams.get('date');
}
check(
  'calendar: a day is a real submit button that puts its ISO date in the URL, with blocked days disabled',
  pickable.isForm && pickable.allIso && pickable.dayCount > 27 &&
    pickable.blockedCount > 0 && pickable.blockedAllMarked &&
    submitted !== null && submitted === wanted,
  JSON.stringify({ ...pickable, wanted, submitted }),
);

/* A dimmed table must still be READABLE (roadmap 43.1).
   `data-loading="true"` dims with opacity, and opacity composites TEXT as well
   as background — so the contrast gate, which computes token pairs, cannot see
   the result. It shipped at 0.6 for months: header text composited to 3.28:1
   against a 4.5:1 requirement, while body text passed at 4.61:1, which is why
   nobody noticed by looking. Measured here, in both themes, on the real thing. */
const luminance = (r, g, b) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrastOf = (fg, bg) => {
  const L1 = luminance(...fg); const L2 = luminance(...bg);
  return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
};
for (const theme of ['light', 'dark']) {
  await visit('/components/data-table/', { width: 1440 });
  await page.evaluate((t) => localStorage.setItem('bo-theme', t), theme);
  await visit('/components/data-table/', { width: 1440 });
  const dim = await page.evaluate(() => {
    const t = document.querySelector('table[data-loading="true"]');
    const bg = getComputedStyle(document.body).backgroundColor.match(/\d+/g).map(Number);
    const o = Number(getComputedStyle(t).opacity);
    return {
      theme: document.documentElement.getAttribute('data-theme'),
      opacity: o,
      bg,
      colors: [...new Set([...t.querySelectorAll('th,td')].map((c) => getComputedStyle(c).color))]
        .map((c) => c.match(/\d+/g).map(Number)),
    };
  });
  const worst = Math.min(
    ...dim.colors.map((c) => contrastOf(c.map((v, i) => v * dim.opacity + dim.bg[i] * (1 - dim.opacity)), dim.bg)),
  );
  check(
    `data-loading: a dimmed table stays AA-readable (${theme})`,
    worst >= 4.5,
    JSON.stringify({ theme: dim.theme, opacity: dim.opacity, worstRatio: Number(worst.toFixed(2)) }),
  );
}

await browser.close();
server.close();

g.report('verified live');
