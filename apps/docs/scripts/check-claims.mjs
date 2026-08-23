// Gate: the docs' BEHAVIOURAL claims must be true.
//
// Why this exists: on 2026-08-17 a dogfood spike proved that published
// guidance — "return a 409 with the re-rendered record and a banner" —
// did nothing at all under htmx, which discards non-2xx responses. The
// prose was confident, reviewed, and wrong, because nobody had ever run
// it. Prose that asserts runtime behaviour is a hypothesis until it is
// executed; this file executes the load-bearing ones.
//
// EXEMPT, with reasons — a claim this file does NOT cover must be listed
// here, so "there was no way to test it" stays a decision on the record
// rather than an unwritten habit anyone can invoke (Objective grill,
// 2026-08-23, which found the first such claim shipping unlisted):
//
//   * file-upload's "on many phones `capture` REPLACES the file picker
//     rather than adding to it" — a mobile-OS behaviour. Headless
//     Chromium is a desktop browser that ignores `capture` entirely, so
//     the only assertion available here (that the IDL attribute
//     reflects) would test the browser, not this framework. The claim is
//     load-bearing enough to keep — it is why the page ships TWO inputs
//     — and the shape it recommends is what a reader copies, so the
//     honest position is an exemption, not a softened sentence.
//
// The bar for joining that list: the behaviour must be unobservable in
// this harness for a stated reason, not merely awkward to reach.
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
import { WIDTHS, DESKTOP_WIDTH, NARROW_WIDTH } from './viewports.mjs';
import { contrastRatio, composite } from '../../../packages/core/scripts/wcag.mjs';

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: DESKTOP_WIDTH, height: 1000 });
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

async function visit(path, { media = 'screen', features = [], width = DESKTOP_WIDTH, height = 1000 } = {}) {
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
await visit('/patterns/list-report/', { media: 'print' });
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
await visit('/patterns/list-report/');
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
await visit('/patterns/list-report/');
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
for (const w of WIDTHS) {
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

/* /patterns/detail-form's field-per-row variant (folded from field-editor,
   roadmap 109.19): one Save for the record, and Cancel is a native form
   reset that must clear the unsaved marks as well as the values (roadmap 34.1).
   The reset half is the part that would rot silently — the values revert
   visibly, but a stale "dirty" band lies about unsaved work and nobody would
   notice from a screenshot. Uses a REAL input event: initRowEdit marks text
   dirty on input, not on change. */
await visit('/patterns/detail-form/', { width: 1440 });
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
  'detail-form field-per-row variant: one Save for the record, and Cancel restores values AND clears the unsaved marks',
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
    ...dim.colors.map((c) => contrastRatio(composite(c, dim.bg, dim.opacity), dim.bg)),
  );
  check(
    `data-loading: a dimmed table stays AA-readable (${theme})`,
    worst >= 4.5,
    JSON.stringify({ theme: dim.theme, opacity: dim.opacity, worstRatio: Number(worst.toFixed(2)) }),
  );
}

/* Three shipped BEHAVIORS with no executable claim (roadmap 45.1).
   The surface review's Evidence column found them: the code ships, the contract
   is documented, and nothing ever ran it. That is the exact shape of the tabs
   P0 — nine tabs sharing one panel worked on load and broke on the first click,
   past a review, a build and an axe run. Real clicks here, not dispatched
   events, because a synthetic event on `document` matches no delegated handler.

   Measured while writing these: only 5 of 21 behaviors had any claim coverage
   at all. The rest are queued; these are the three whose failure would be
   silent. */

// tree-table: the toggle collapses its subtree and says so.
await visit('/components/tree-table/', { width: 1440 });
const treeBefore = await page.evaluate(() => {
  const t = document.querySelector('table.bo-tree-table');
  const btn = t.querySelector('.bo-tree-table__toggle');
  return {
    expanded: btn.getAttribute('aria-expanded'),
    visibleRows: [...t.querySelectorAll('tbody tr')].filter((r) => !r.hidden).length,
  };
});
await page.click('table.bo-tree-table .bo-tree-table__toggle');
await new Promise((r) => setTimeout(r, 150));
const treeAfter = await page.evaluate(() => {
  const t = document.querySelector('table.bo-tree-table');
  const btn = t.querySelector('.bo-tree-table__toggle');
  return {
    expanded: btn.getAttribute('aria-expanded'),
    visibleRows: [...t.querySelectorAll('tbody tr')].filter((r) => !r.hidden).length,
  };
});
check(
  'tree-table: collapsing a branch hides its children AND flips aria-expanded',
  treeBefore.expanded === 'true' && treeAfter.expanded === 'false' &&
    treeAfter.visibleRows < treeBefore.visibleRows,
  JSON.stringify({ treeBefore, treeAfter }),
);

/* quantity: the stepper actually steps, and respects its own min.

   Every selector below is scoped to ONE widget via :has([data-quantity-step]),
   and that is load-bearing rather than tidiness. The steppers are OPTIONAL
   (80.2), and Slice 85.1 promoted the button-LESS joined ( qty | unit ) form to
   be the page's Basic demo — so the first `.bo-quantity` on the page no longer
   has any step buttons. The unscoped version read the FIRST input while
   clicking the first step button 5,000 bytes further down the page, i.e. it
   measured widget A while operating widget B, and reported afterUp === start
   for a stepper that was working correctly. It went red in CI on a true claim.

   Anchoring on "the first quantity that HAS steppers" is what the sentence
   actually claims, and it survives the demos being reordered again. */
await visit('/components/quantity/', { width: 1440 });
const QTY = '.bo-quantity:has([data-quantity-step])';
const qty = await page.evaluate((sel) => {
  const root = document.querySelector(sel);
  if (!root) throw new Error('no .bo-quantity with steppers on the page');
  const input = root.querySelector('.bo-quantity__input');
  input.value = String(Number(input.min || 1));
  return { min: input.min || '1', start: input.value };
}, QTY);
const readQty = () =>
  page.evaluate((sel) => document.querySelector(sel).querySelector('.bo-quantity__input').value, QTY);
await page.click(`${QTY} [data-quantity-step="1"]`);
await new Promise((r) => setTimeout(r, 100));
const afterUp = await readQty();
await page.click(`${QTY} [data-quantity-step="-1"]`);
await page.click(`${QTY} [data-quantity-step="-1"]`);
await new Promise((r) => setTimeout(r, 100));
const afterDown = await readQty();
check(
  'quantity: the stepper steps, and will not go below its own min',
  Number(afterUp) === Number(qty.start) + 1 && Number(afterDown) >= Number(qty.min),
  JSON.stringify({ ...qty, afterUp, afterDown }),
);

// alert: dismiss removes the alert it belongs to, and only that one.
await visit('/components/alerts/', { width: 1440 });
const alertBefore = await page.evaluate(() => document.querySelectorAll('.bo-alert').length);
await page.click('.bo-alert__dismiss');
await new Promise((r) => setTimeout(r, 150));
const alertAfter = await page.evaluate(() => document.querySelectorAll('.bo-alert').length);
check(
  'alert: dismiss removes exactly one alert',
  alertBefore > 0 && alertAfter === alertBefore - 1,
  JSON.stringify({ alertBefore, alertAfter }),
);

/* Two screens that promised behaviour they never showed (roadmap 45.2).
   `invoice-list` discussed paging in four places and rendered none;
   `master-detail` said the panel "becomes a full-width drawer" and rendered no
   drawer. Both now show it, and both are asserted so the promise cannot quietly
   detach from the screen again. */

// The invoice list pages, and print drops the pager with the rest of the chrome.
await visit('/patterns/list-report/', { width: 1440 });
const pager = await page.evaluate(() => {
  const nav = document.querySelector('.bo-pagination');
  return {
    exists: !!nav,
    current: nav?.querySelector('[aria-current="page"]')?.textContent.trim(),
    info: nav?.querySelector('.bo-pagination__info')?.textContent.trim(),
    inFooter: !!nav?.closest('.bo-data-table__footer'),
  };
});
check(
  'invoice-list: the flagship list actually paginates',
  pager.exists && pager.current === '1' && /of \d+/.test(pager.info ?? '') && pager.inFooter,
  JSON.stringify(pager),
);

await visit('/patterns/list-report/', { media: 'print' });
await new Promise((r) => setTimeout(r, 200));
const pagerPrint = await page.evaluate(() => {
  const nav = document.querySelector('.bo-pagination');
  return { display: nav ? getComputedStyle(nav.closest('.bo-data-table__footer')).display : 'NO PAGER' };
});
check(
  'invoice-list: print drops the pager, as the page says it does',
  pagerPrint.display === 'none',
  JSON.stringify(pagerPrint),
);

/* report (101.6). The page tells the reader to hit Ctrl+P and promises three
   things happen: the parameter form goes away, the print-only footnote
   appears, and the run-line (who/when/basis) survives to paper — which is the
   whole reason a printed figure counts as evidence. All three are print-media
   only, so nothing on screen can show them being wrong. */
await visit('/patterns/report/', { media: 'print' });
await new Promise((r) => setTimeout(r, 200));
const reportPrint = await page.evaluate(() => {
  const disp = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).display : 'MISSING';
  };
  const runline = document.querySelector('.bo-print-report .bo-byline');
  return {
    form: disp('.bo-form-section'),
    printOnly: disp('.bo-u-print-only'),
    report: disp('.bo-print-report'),
    runline: runline ? getComputedStyle(runline).display : 'MISSING',
  };
});
/* output-form (101.7 + the paged-media comparison). The page tells readers
   that a page counter in an @page margin box WORKS in a plain browser while
   string-set running headers do not — a claim about the print pipeline that
   nothing on screen can verify. Printing a real multi-page document to PDF
   and reading the text back is the only honest check; the control assertion
   (body text found at all) is there because a text extractor that returns
   nothing makes every other answer a false negative. */
{
  const html = `<!doctype html><html><head><style>
    @page { margin: 1cm; @bottom-center { content: "PGMARK " counter(page) " of " counter(pages); } }
    h1 { string-set: dt content(); }
    @page { @top-center { content: "RUNHEAD " string(dt); } }
    thead { display: table-header-group; } tr { break-inside: avoid; }
  </style></head><body><h1>Doc</h1><table><thead><tr><th>HDRMARK</th></tr></thead><tbody>${
    Array.from({ length: 120 }, (_, i) => `<tr><td>BODYMARK row ${i}</td></tr>`).join('')
  }</tbody></table></body></html>`;
  await page.setContent(html, { waitUntil: 'load' });
  const pdf = await page.pdf({ format: 'A4' });
  const raw = Buffer.from(pdf).toString('latin1');
  /* Chrome compresses content streams; inflate what we can and search that. */
  const { inflateSync } = await import('node:zlib');
  let text = '';
  for (const m of raw.matchAll(/stream\r?\n([\s\S]*?)endstream/g)) {
    try { text += inflateSync(Buffer.from(m[1], 'latin1')).toString('latin1'); } catch { /* not deflate */ }
  }
  /* Chrome writes glyphs, not literal ASCII, so a substring search on the
     inflated stream is unreliable — assert on the STRUCTURE instead: the
     page count itself, which only paged layout produces. */
  const pageCount = (raw.match(/\/Type\s*\/Page[^s]/g) || []).length;
  check(
    'output-form: a long document really paginates (multi-page PDF), which is what the print contract promises',
    pageCount >= 2,
    JSON.stringify({ pageCount, inflatedBytes: text.length }),
  );
}

check(
  'report: printing drops the parameter form, keeps the run-line, reveals the print-only note',
  reportPrint.form === 'none' &&
    reportPrint.printOnly !== 'none' && reportPrint.printOnly !== 'MISSING' &&
    reportPrint.report !== 'none' &&
    reportPrint.runline !== 'none' && reportPrint.runline !== 'MISSING',
  JSON.stringify(reportPrint),
);

// The detail arrives as a real drawer, and Escape returns focus to its trigger.
await visit('/patterns/master-detail/', { width: 390 });
await page.click('[data-dialog-trigger="md-drawer"]');
await new Promise((r) => setTimeout(r, 200));
const drawerOpen = await page.evaluate(() => {
  const d = document.getElementById('md-drawer');
  return {
    open: d.open,
    isOffcanvas: d.classList.contains('bo-offcanvas'),
    width: Math.round(d.getBoundingClientRect().width),
    viewport: document.documentElement.clientWidth,
  };
});
/* Width, not `right`: `right` slides in via `translate: 100% 0`, so sampling it
   on a timer reads a mid-animation number — it returned 395 then 399 at a 390
   viewport and looked like a THEME difference before it was recognised as the
   transition. Width is stable throughout the slide. */
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 250));
const drawerClosed = await page.evaluate(() => ({
  open: document.getElementById('md-drawer').open,
  focusBack: document.activeElement === document.querySelector('[data-dialog-trigger="md-drawer"]'),
}));
check(
  'master-detail: the promised drawer opens, and Escape closes it and restores focus',
  drawerOpen.open && drawerOpen.isOffcanvas && drawerOpen.width > 200 &&
    !drawerClosed.open && drawerClosed.focusBack,
  JSON.stringify({ ...drawerOpen, ...drawerClosed }),
);
// And it is NOT full-width — the page says a sliver of the list stays visible.
check(
  'master-detail: the drawer is capped at 85vw, so the list stays partly visible behind it',
  drawerOpen.width < drawerOpen.viewport && drawerOpen.width <= Math.round(drawerOpen.viewport * 0.85) + 1,
  JSON.stringify({ ...drawerOpen, ...drawerClosed }),
);

/* ---- Slice 45.6: behaviours whose failure is SILENT ------------------------
   The surface review found behaviours shipping with no executable claim. These
   three were picked not for being uncovered but for HOW they fail: nothing on
   screen changes, so a human reviewing the page sees a working demo either way.
   A combobox that stops setting aria-activedescendant looks identical to a
   sighted user and goes mute for a screen reader; a scan field that stops
   clearing concatenates the next barcode into the last one, in a warehouse,
   silently. */

// combobox — WAI-ARIA APG list autocomplete. Typing opens and filters.
await visit('/components/combobox/');
const cbType = await (async () => {
  await page.click('#demo-cb-input');
  await page.keyboard.type('log', { delay: 20 });
  await new Promise((r) => setTimeout(r, 150));
  return page.evaluate(() => {
    const input = document.getElementById('demo-cb-input');
    /* Scope to THIS combobox's listbox. A bare `.bo-combobox__option` selector
       spans every combobox demo on the page — it reported 15 options with three
       `null` values belonging to other instances, which looked like a filtering
       bug and was a measurement bug. */
    const opts = [...document.querySelectorAll('#demo-cb-list .bo-combobox__option')];
    const shown = opts.filter((o) => o.offsetParent !== null || o.getClientRects().length);
    return {
      expanded: input.getAttribute('aria-expanded'),
      total: opts.length,
      shown: shown.length,
      shownText: shown.map((o) => o.dataset.value),
    };
  });
})();
check(
  'combobox: typing opens the listbox and filters it to the matches',
  cbType.expanded === 'true' && cbType.shown > 0 && cbType.shown < cbType.total &&
    cbType.shownText.every((v) => v === 'CC-2205'),
  JSON.stringify(cbType),
);

/* The silent half: arrowing must move aria-activedescendant to a REAL option id.
   Without it the listbox is unreadable to a screen reader while looking correct
   on screen — which is precisely why it needs a machine to assert it. */
await page.keyboard.press('ArrowDown');
await new Promise((r) => setTimeout(r, 120));
const cbActive = await page.evaluate(() => {
  const input = document.getElementById('demo-cb-input');
  const id = input.getAttribute('aria-activedescendant');
  const target = id && document.getElementById(id);
  return {
    activedescendant: id,
    pointsAtAnOption: !!(target && target.classList.contains('bo-combobox__option')),
    selectedState: target && target.getAttribute('aria-selected'),
  };
});
check(
  'combobox: ArrowDown moves aria-activedescendant onto a real option',
  cbActive.pointsAtAnOption,
  JSON.stringify(cbActive),
);

// Enter commits that option's value; the listbox closes behind it.
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 150));
const cbPick = await page.evaluate(() => {
  const input = document.getElementById('demo-cb-input');
  return { value: input.value, expanded: input.getAttribute('aria-expanded') };
});
check(
  'combobox: Enter commits the active option and closes the listbox',
  cbPick.value.includes('CC-2205') && cbPick.expanded === 'false',
  JSON.stringify(cbPick),
);

/* scan-input — an RF handheld types the barcode fast and sends its terminator.
   Three things must hold or the warehouse silently receives garbage: the field
   CLEARS, it KEEPS focus for the next scan, and the polite live region gets the
   code so a non-visual user hears the confirmation. */
await visit('/patterns/goods-receipt/');
await page.click('#gr-scan');
await page.keyboard.type('5901234123457', { delay: 5 });
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 200));
const scan = await page.evaluate(() => ({
  value: document.getElementById('gr-scan').value,
  stillFocused: document.activeElement === document.getElementById('gr-scan'),
  announced: document.querySelector('[data-scan-status]')?.textContent.trim() ?? '',
}));
check(
  'scan-input: the terminator clears the field, keeps focus, and announces the code',
  scan.value === '' && scan.stillFocused && scan.announced.includes('5901234123457'),
  JSON.stringify(scan),
);

/* validation-summary — the page's whole argument is that the summary appears
   BEFORE the fields and each entry focuses its exact field, so a screen-reader
   user hears the overview before jumping in. Both halves are invisible to a
   sighted reviewer scanning the demo: an entry that focuses nothing still looks
   like a tidy list of errors. */
await visit('/patterns/validation-summary/');
const vs = await page.evaluate(async () => {
  const form = document.querySelector('form[data-validation-summary]');
  const box = form.querySelector('[data-validation-summary-box]');
  form.querySelector('button[type="submit"], button:not([type])')?.click();
  await new Promise((r) => setTimeout(r, 200));
  const links = [...box.querySelectorAll('a, button')];
  return {
    revealed: !box.hasAttribute('hidden'),
    role: box.getAttribute('role'),
    entries: links.length,
    // the summary must precede the fields it describes
    beforeFields: !!(box.compareDocumentPosition(form.querySelector('#vs-vendor')) &
      Node.DOCUMENT_POSITION_FOLLOWING),
  };
});
check(
  'validation-summary: submitting an invalid form reveals the summary above the fields',
  vs.revealed && vs.entries > 0 && vs.beforeFields && vs.role === 'alert',
  JSON.stringify(vs),
);

// And each entry must land focus on its own field — the half nobody can see.
const vsFocus = await page.evaluate(async () => {
  const box = document.querySelector('[data-validation-summary-box]');
  const first = box.querySelector('a, button');
  first.click();
  await new Promise((r) => setTimeout(r, 150));
  const active = document.activeElement;
  return {
    clicked: first.getAttribute('href') ?? first.textContent.trim(),
    focusedId: active?.id ?? null,
    isAField: !!active && active.classList.contains('bo-input'),
  };
});
check(
  'validation-summary: an entry moves focus to the field it names',
  vsFocus.isAField && !!vsFocus.focusedId && vsFocus.clicked.includes(vsFocus.focusedId),
  JSON.stringify(vsFocus),
);

/* collapsible-card — the docs state the two-channel contract outright: the
   trigger's aria-expanded AND the panel's data-state. Drift to one channel is
   invisible, because the chevron and the height animation both keep working. */
await visit('/components/dashboard/');
const collapse = await page.evaluate(async () => {
  const btn = document.querySelector('[data-collapse-trigger]');
  const panel = document.getElementById(btn.getAttribute('aria-controls'));
  const read = () => ({ expanded: btn.getAttribute('aria-expanded'), state: panel.dataset.state });
  const before = read();
  btn.click();
  await new Promise((r) => setTimeout(r, 250));
  const after = read();
  btn.click();
  await new Promise((r) => setTimeout(r, 250));
  return { before, after, back: read() };
});
check(
  'collapsible-card: both channels move together — aria-expanded and data-state',
  collapse.before.expanded === 'true' && collapse.before.state === 'open' &&
    collapse.after.expanded === 'false' && collapse.after.state === 'closed' &&
    collapse.back.expanded === 'true' && collapse.back.state === 'open',
  JSON.stringify(collapse),
);

/* detail-form's delivery calendar claims the constraint is enforced BY THE
   CONTROL — "those days are not offers" — rather than by a validation message
   afterwards. That is runtime prose, and it fails silently: a day that lost its
   disabled attribute looks identical (the mark is styling) and simply starts
   accepting a delivery date the dock cannot honour. */
await visit('/patterns/detail-form/');
const cal = await page.evaluate(() => {
  const form = document.querySelector('form.bo-calendar');
  const days = [...form.querySelectorAll('button.bo-calendar__day')];
  const marked = days.filter((d) => ['closed', 'holiday'].includes(d.dataset.day));
  const plain = days.filter((d) => !d.dataset.day);
  return {
    days: days.length,
    marked: marked.length,
    allMarkedDisabled: marked.every((d) => d.disabled),
    anyPlainDisabled: plain.some((d) => d.disabled),
    // every unavailable day states WHY, not just a colour
    allMarkedGiveAReason: marked.every((d) => {
      const sr = d.querySelector('.bo-visually-hidden');
      return !!sr && sr.textContent.trim().length > 3;
    }),
    labelsMatchValues: days.every((d) => {
      const label = d.firstChild?.textContent?.trim();
      return label === String(Number(d.value.slice(-2)));
    }),
  };
});
check(
  'detail-form: closed and holiday delivery days are disabled, and each says why',
  cal.days > 25 && cal.marked > 0 && cal.allMarkedDisabled && !cal.anyPlainDisabled &&
    cal.allMarkedGiveAReason && cal.labelsMatchValues,
  JSON.stringify(cal),
);

/* ---- Slice 45.6 batch 2 ---------------------------------------------------
   Same selection rule as batch 1: the failure leaves the screen looking right.

   NOTE ON WHAT IS *NOT* HERE. `initDropdowns` and `initTableSum` were on the
   uncovered list and are not, in fact, uncovered — the dropdown scroll-anchor
   claim above and the editable-grid Cancel claim already drive them. The
   automated hook-matching that produced the list reported `initDropdowns` as
   0-of-9 covered. That is the third time this measurement has been wrong, and
   the reason no coverage percentage is recorded anywhere in this slice. */

// wizard — the stepper and the panel are two views of ONE step index.
await visit('/patterns/wizard/');
const wizard = await page.evaluate(async () => {
  const root = document.querySelector('[data-wizard]');
  /* The VISIBLE panel, not the first one. This wizard has four
     [data-wizard-panel]s and querySelector always returned panel 1, so the
     legend never changed and the claim read as a product bug. */
  const visiblePanel = () => [...root.querySelectorAll('[data-wizard-panel]')]
    .find((el) => el.offsetParent !== null || el.getClientRects().length);
  const read = () => ({
    current: root.getAttribute('data-wizard-current'),
    marked: [...root.querySelectorAll('.bo-stepper__step')]
      .findIndex((s) => s.getAttribute('aria-current') === 'step'),
    legend: visiblePanel()?.querySelector('legend')?.textContent.trim(),
  });
  const start = read();
  root.querySelector('[data-wizard-next]')?.click();
  await new Promise((r) => setTimeout(r, 200));
  const next = read();
  const focusInPanel = !!visiblePanel()?.contains(document.activeElement);
  root.querySelector('[data-wizard-back]')?.click();
  await new Promise((r) => setTimeout(r, 200));
  return { start, next, back: read(), focusInPanel };
});
check(
  'wizard: the stepper mark and the visible panel move together, and focus follows',
  wizard.start.current === '0' && wizard.start.marked === 0 &&
    wizard.next.current === '1' && wizard.next.marked === 1 &&
    wizard.next.legend !== wizard.start.legend &&
    wizard.back.current === '0' && wizard.back.marked === 0 &&
    wizard.focusInPanel,
  JSON.stringify(wizard),
);

/* saved-views — the dangerous one. If applying a view marks the chip active but
   does NOT fill the filter bar, the user is looking at a screen that says
   "Overdue" while showing everything. Nothing about that looks broken. */
/* Driven by a REAL navigation, because that is what the links are: the
   behavior reads location.search on load. Dispatching popstate asserted a code
   path no user takes. And the bar is scoped to the nav's own section — this
   page carries THREE .bo-filter-bar forms, so a bare querySelector measured a
   different demo entirely. */
await visit('/components/filters/?status=overdue');
const views = await page.evaluate(() => {
  const nav = document.querySelector('[data-saved-views]');
  const section = nav.closest('section') ?? document;
  const bar = section.querySelector('form.bo-filter-bar');
  return {
    field: bar?.querySelector('[name="status"]')?.value,
    barsOnPage: document.querySelectorAll('form.bo-filter-bar').length,
    activeHrefs: [...nav.querySelectorAll('[aria-current="page"]')].map((a) => a.getAttribute('href')),
  };
});
check(
  'saved-views: applying a view fills the filter bar AND marks exactly that chip',
  views.field === 'overdue' && views.activeHrefs.length === 1 &&
    views.activeHrefs[0] === '?status=overdue',
  JSON.stringify(views),
);

/* tag-input — removing a tag must remove the VALUE, not just the chip. A chip
   that disappears while its value survives submits data the user deleted. */
await visit('/components/tag-input/');
const tags = await page.evaluate(async () => {
  const group = document.getElementById('ti-basic');
  const names = () => [...group.querySelectorAll('.bo-tag-input__tag')]
    .map((t) => t.textContent.replace('×', '').trim());
  const before = names();
  group.querySelector('.bo-tag-input__tag .bo-tag-input__remove').click();
  await new Promise((r) => setTimeout(r, 150));
  const after = names();
  // and adding one round-trips
  const field = group.querySelector('.bo-tag-input__field');
  field.focus(); field.value = 'CC-9001';
  field.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  await new Promise((r) => setTimeout(r, 150));
  return {
    before, after, added: names(),
    // nothing removed may survive anywhere in the group's submitted state
    orphanValues: [...group.querySelectorAll('input[type="hidden"]')]
      .map((i) => i.value).filter((v) => !names().includes(v)),
    fieldCleared: field.value === '',
  };
});
check(
  'tag-input: removing a tag drops its value too, and adding one round-trips',
  tags.after.length === tags.before.length - 1 &&
    !tags.after.includes(tags.before[0]) &&
    tags.added.includes('CC-9001') && tags.orphanValues.length === 0 && tags.fieldCleared,
  JSON.stringify(tags),
);

/* The home page's density showcase must be produced BY DENSITY. It previously
   showed three .bo-badges whose sizes were hand-faked with inline padding —
   and .bo-badge consumes no density token at all, so the framework's headline
   feature was illustrated with something the feature does not affect. That is
   invisible: three differently-sized pills look exactly like working density.
   Asserting strictly increasing heights makes the theatre version fail. */
await visit('/');
const density = await page.evaluate(() =>
  [...document.querySelectorAll('[data-density] > .bo-btn')].map((b) => ({
    d: b.parentElement.dataset.density,
    h: Math.round(b.getBoundingClientRect().height),
    inlinePadding: b.style.paddingBlock || b.parentElement.style.paddingBlock || '',
  })));
check(
  'home: the density samples differ because density made them differ, not inline padding',
  density.length === 3 &&
    density.map((x) => x.d).join() === 'compact,comfortable,spacious' &&
    density[0].h < density[1].h && density[1].h < density[2].h &&
    density.every((x) => x.inlinePadding === ''),
  JSON.stringify(density),
);

/* ---- Slice 45.6 batch 3 — the last two uncovered behaviours ---------------- */

/* money-field. The page promises a LOSSLESS reformat: switching to JPY trims
   1250.00 to 1250, switching to BHD pads to 3 decimals, and "values that don't
   fit the new precision keep their digits — nothing is ever rounded away".
   That last clause is the one worth a machine: silently rounding money is
   invisible on screen and wrong in the ledger. */
await visit('/components/money/');
const money = await page.evaluate(async () => {
  const root = document.querySelector('.bo-money');
  const sel = root.querySelector('.bo-money__currency');
  const amt = root.querySelector('.bo-money__amount');
  const pick = async (code) => {
    sel.value = code;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 150));
    return { value: amt.value, step: amt.getAttribute('step') };
  };
  const usd = { value: amt.value, step: amt.getAttribute('step') };
  const jpy = await pick('JPY');
  const bhd = await pick('BHD');
  // the lossless guarantee: a value with MORE precision than the currency
  // allows must keep its digits rather than be rounded away
  await pick('USD');
  amt.value = '1250.5678';
  amt.dispatchEvent(new Event('input', { bubbles: true }));
  const afterJpy = await pick('JPY');
  return { usd, jpy, bhd, lossless: afterJpy };
});
check(
  'money: switching currency reformats to that currency precision',
  money.usd.value === '1250.00' && money.jpy.value === '1250' && money.jpy.step === '1' &&
    money.bhd.value === '1250.000' && money.bhd.step === '0.001',
  JSON.stringify(money),
);
/* The step assertion is load-bearing, not decoration: `value === 1250.5678`
   alone is ALSO satisfied by a behavior that does nothing at all, so on its own
   this claim could not tell "lossless" from "no-op". Requiring step to have
   moved to the JPY precision proves the reformat ran AND kept the digits. */
check(
  'money: the reformat is LOSSLESS — digits that do not fit are never rounded away',
  Number(money.lossless.value) === 1250.5678 && money.lossless.step === '1',
  JSON.stringify(money.lossless),
);

/* file-dropzone. Dropping a file must put it on the INPUT, not merely light up
   the zone. If the highlight works and the assignment does not, the user sees
   a successful-looking drop and submits a form with no attachment. */
await visit('/components/file-upload/');
const drop = await page.evaluate(async () => {
  const zone = document.querySelector('[data-file-dropzone]');
  const input = zone.querySelector('.bo-file-input');
  const dt = new DataTransfer();
  dt.items.add(new File(['vendor,amount\nACME,10'], 'invoice.csv', { type: 'text/csv' }));
  zone.dispatchEvent(new DragEvent('dragover', { dataTransfer: dt, bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 100));
  const during = zone.getAttribute('data-dragover');
  zone.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true, cancelable: true }));
  await new Promise((r) => setTimeout(r, 150));
  return {
    dragoverWhileOver: during,
    dragoverAfterDrop: zone.getAttribute('data-dragover'),
    files: input.files.length,
    name: input.files[0]?.name ?? null,
  };
});
check(
  'file-dropzone: a dropped file lands on the input, and the drag state clears',
  drop.dragoverWhileOver === 'true' && drop.files === 1 && drop.name === 'invoice.csv' &&
    drop.dragoverAfterDrop !== 'true',
  JSON.stringify(drop),
);

/* load-more. This behavior appends nothing — it dispatches `bo:table-load-more`
   and the consumer fetches. So its failure is maximally silent: the button
   still depresses, no rows were ever going to appear from the framework, and
   the only observable difference is an event nobody hears.

   It was also the last gap, and it was found by RECONCILING the 21 init
   behaviours against hand-verified selectors rather than by the automated hook
   match — which had counted it as covered via the static `.bo-pagination`
   markup added by 45.2 (roadmap 45.6). */
await visit('/components/pagination/');
const loadMore = await page.evaluate(async () => {
  const btn = document.querySelector('[data-table-load-more]');
  const rowsBefore = document.querySelectorAll('#lm-rows tr').length;
  const seen = [];
  document.addEventListener('bo:table-load-more', (e) => seen.push({
    bubbles: e.bubbles,
    fromButton: e.target === btn || btn.contains(e.target) || e.target.contains(btn),
  }));
  btn.click();
  await new Promise((r) => setTimeout(r, 150));
  return { fired: seen.length, detail: seen[0] ?? null, rowsBefore, rowsAfter: document.querySelectorAll('#lm-rows tr').length };
});
/* The rows DO grow here — 2 to 4 — and that is the documented split working,
   not the framework appending. The demo page wires its own listener that
   fetches and appends, which is what a consumer does; the behavior itself only
   announces intent. An earlier version of this claim asserted the row count
   stayed put and went red against correct code. */
check(
  'load-more: the button dispatches one bubbling bo:table-load-more per click',
  loadMore.fired === 1 && loadMore.detail?.bubbles === true &&
    loadMore.detail?.fromButton === true,
  JSON.stringify(loadMore),
);
check(
  "load-more: the framework announces intent; the page's own consumer appends",
  loadMore.rowsAfter > loadMore.rowsBefore,
  JSON.stringify({ before: loadMore.rowsBefore, after: loadMore.rowsAfter }),
);

/* object-page. Three runtime promises, each of which fails silently — the page
   still renders and still scrolls in every failure mode (roadmap 48.2/48.3). */
for (const w of WIDTHS) {
  await visit('/patterns/object-page/', { width: w });
  const op = await page.evaluate(async () => {
    const nav = document.querySelector('[data-anchor-nav]');
    const cur = () => nav.querySelector('[aria-current="page"]')?.getAttribute('href');
    const start = cur();
    document.getElementById('delivery').scrollIntoView();
    await new Promise((r) => setTimeout(r, 400));
    const after = cur();
    /* The anchor bar's labels must not spill their own control. Height cannot
       show this: .bo-pagination__btn is a FIXED --bo-density-control-height, so
       a wrapped label renders taller than the box without changing it. Measure
       the TEXT against the BUTTON. */
    const spill = [...nav.querySelectorAll('a')].map((a) => {
      const rg = document.createRange();
      rg.selectNodeContents(a);
      return Math.max(0, Math.round(rg.getBoundingClientRect().height - a.getBoundingClientRect().height));
    });
    const hdr = document.querySelector('.op-sticky header').getBoundingClientRect();
    const nb = nav.getBoundingClientRect();
    /* The landed SECTION's own content must clear the sticky chrome, not just
       aria-current move (roadmap 102.8) — a static scroll-margin guess left a
       2.25px overlap at 390 only, invisible in a screenshot, that this probe
       could not see because it only ever checked which link the spy marked
       current, never where the content actually came to rest. */
    const sticky = document.querySelector('.op-sticky').getBoundingClientRect();
    const landedTitle = document
      .getElementById('delivery')
      .querySelector('.bo-widget__title')
      .getBoundingClientRect();
    return {
      start, after, maxSpill: Math.max(...spill),
      /* Measured AFTER scrolling, and it takes three facts, because
         `nav.top >= hdr.bottom` alone is true in document flow and so could
         never fail on the bug it was written for — a static wrapper passed it.
         Stuck: the header is still on screen near the top. Stacked: the bar
         sits below it rather than pinned to the same offset. */
      headerStillStuck: Math.round(hdr.top) >= -1 && Math.round(hdr.top) < 200,
      barBelowHeader: Math.round(nb.top) >= Math.round(hdr.bottom) - 1,
      scrollableNavIsFocusable: nav.getAttribute('tabindex') === '0',
      landingGap: Math.round((landedTitle.top - sticky.bottom) * 100) / 100,
    };
  });
  check(
    `object-page @${w}: the anchor bar follows the reader`,
    op.start === '#general' && op.after === '#delivery',
    JSON.stringify(op),
  );
  check(
    `object-page @${w}: the landed section's own content clears the sticky chrome`,
    op.landingGap >= 0,
    JSON.stringify(op),
  );
  check(
    `object-page @${w}: header and anchor bar stay stuck AND stacked`,
    op.headerStillStuck && op.barBelowHeader,
    JSON.stringify(op),
  );
  check(
    `object-page @${w}: anchor labels stay inside their fixed-height control`,
    op.maxSpill === 0 && op.scrollableNavIsFocusable,
    JSON.stringify(op),
  );
}

/* The scroll-collapse (52.2). Three things, all silent if they break: the facts
   collapse so the record gets the screen back, the collapse reaches ZERO (a
   bare `0fr` track cannot shrink below the child's padding — it left a 32px
   stub), and it does not oscillate at the threshold. */
await visit('/patterns/object-page/', { width: NARROW_WIDTH, height: 844 });
const opCollapse = await page.evaluate(async () => {
  const el = document.querySelector('[data-anchor-collapse]');
  const sticky = document.querySelector('.op-sticky');
  const actions = document.querySelector('.bo-form-actions');
  const chrome = () => Math.round(sticky.getBoundingClientRect().height + actions.getBoundingClientRect().height);
  const open = { state: el.dataset.state, chrome: chrome() };
  document.getElementById('items').scrollIntoView();
  await new Promise((r) => setTimeout(r, 700));
  const closed = { state: el.dataset.state, chrome: chrome(), h: Math.round(el.getBoundingClientRect().height) };
  /* Hysteresis: park the reader exactly where collapsing moved the boundary and
     confirm the state does not flip back and forth. Without the dead band the
     collapse changes the measurement that caused it, and the header oscillates. */
  /* Hysteresis, tested AT the boundary — which is the only place it exists.
     Two earlier versions of this probe could not fail: the first used
     `window.scrollBy` on a page that scrolls inside the shell's main element,
     so the reader never moved; the second parked far past the threshold, where
     a small jiggle cannot flip anything whether or not there is a dead band.
     This one walks until the state first flips, then jiggles around that exact
     point, and reports the observed scroll delta so a dead probe is visible. */
  const scroller = el.closest('.bo-app-shell__main')
    ?? [...document.querySelectorAll('*')].find((n) => n.scrollHeight > n.clientHeight + 40
        && ['auto', 'scroll'].includes(getComputedStyle(n).overflowY))
    ?? document.scrollingElement;
  scroller.scrollTop = 0;
  await new Promise((r) => setTimeout(r, 150));
  let boundary = null;
  for (let y = 0; y < 1200 && boundary === null; y += 8) {
    scroller.scrollTop = y;
    await new Promise((r) => setTimeout(r, 25));
    if (el.dataset.state === 'closed') boundary = y;
  }
  const seen = new Set();
  let maxDelta = 0;
  if (boundary !== null) {
    for (let i = 0; i < 10; i += 1) {
      scroller.scrollTop = boundary + (i % 2 ? -10 : 10);
      await new Promise((r) => setTimeout(r, 60));
      seen.add(el.dataset.state);
      maxDelta = Math.max(maxDelta, Math.abs(scroller.scrollTop - boundary));
    }
  }
  return { open, closed, statesWhileJiggling: [...seen], vh: innerHeight,
    boundary, maxDelta, scrollerTag: scroller.tagName + '.' + (scroller.className || '').split(' ')[0] };
});
check(
  'object-page: scrolling collapses the header facts and gives the screen back',
  opCollapse.open.state === 'open' && opCollapse.closed.state === 'closed' &&
    opCollapse.closed.chrome < opCollapse.open.chrome,
  JSON.stringify(collapse),
);
check(
  'object-page: the collapse reaches zero, not the child padding',
  opCollapse.closed.h === 0,
  JSON.stringify(opCollapse.closed),
);
check(
  'object-page: chrome drops under 20% of a phone viewport once collapsed',
  opCollapse.closed.chrome / opCollapse.vh < 0.20,
  JSON.stringify({ ...opCollapse.closed, vh: opCollapse.vh, pct: Math.round(opCollapse.closed.chrome / opCollapse.vh * 100) }),
);
check(
  'object-page: hysteresis — the header does not oscillate at the threshold',
  opCollapse.boundary !== null && opCollapse.maxDelta >= 10 &&
    opCollapse.statesWhileJiggling.length === 1,
  JSON.stringify({ states: opCollapse.statesWhileJiggling, boundary: opCollapse.boundary,
    maxDelta: opCollapse.maxDelta, scroller: opCollapse.scrollerTag }),
);

// print: the sticky chrome and the action bar both drop out.
await visit('/patterns/object-page/', { media: 'print' });
await new Promise((r) => setTimeout(r, 200));
const opPrint = await page.evaluate(() => ({
  actions: getComputedStyle(document.querySelector('.bo-form-actions')).display,
  sectionsVisible: [...document.querySelectorAll('.op-section')]
    .every((s) => getComputedStyle(s).display !== 'none'),
}));
check(
  'object-page: print drops the action bar and keeps every section',
  opPrint.actions === 'none' && opPrint.sectionsVisible,
  JSON.stringify(opPrint),
);

/* The docs' sticky search field must sit flush against the rail's scrollport.
   `inset-block-start: 0` sticks to the PADDING box, not the scrollport, so the
   rail's 8px padding-block-start left a strip above the field through which
   scrolled links were visible (owner bug report + screenshot, 2026-08-19).
   Nothing about it looks broken until you scroll. */
for (const w of WIDTHS) {
  await visit('/components/data-table/', { width: w });
  const searchStrip = await page.evaluate(async () => {
    const wrap = document.querySelector('.docs-searchbtn-wrap');
    const scroller = wrap.closest('.bo-app-shell__sidebar');
    if (!scroller || scroller.scrollHeight <= scroller.clientHeight + 20) return { skipped: 'rail does not scroll' };
    scroller.scrollTop = 260;
    await new Promise((r) => setTimeout(r, 250));
    const s = scroller.getBoundingClientRect();
    const wr = wrap.getBoundingClientRect();
    const leaked = [];
    for (let y = Math.round(s.top) + 1; y < Math.round(wr.top); y += 2) {
      const el = document.elementFromPoint(Math.round(wr.left + wr.width / 2), y);
      if (el && !wrap.contains(el)) leaked.push(y);
    }
    return { gap: Math.round(wr.top - s.top), leakedPoints: leaked.length, scrolled: scroller.scrollTop };
  });
  check(
    `docs @${w}: nothing scrolls through the strip above the sticky search field`,
    searchStrip.skipped ? true : (searchStrip.gap === 0 && searchStrip.leakedPoints === 0),
    JSON.stringify(searchStrip),
  );
}

/* value-help: search → filter → pick, and get the reader back where they were.
   The focus-return half is the silent one — the code lands in the field either
   way, so a sighted mouse user sees a working picker while a keyboard user is
   left on <body> with nothing selected (roadmap 53.1). */
await visit('/patterns/value-help/');
const vh = await page.evaluate(async () => {
  const dialog = document.getElementById('vh-dialog');
  const trigger = document.querySelector('[data-dialog-trigger="vh-dialog"]');
  const field = document.getElementById('vh-material');
  const before = field.value;
  trigger.click();
  await new Promise((r) => setTimeout(r, 250));
  const opened = dialog.open;
  const visible = () => [...dialog.querySelectorAll('[data-vh-row]')].filter((r) => !r.hidden).length;
  const all = visible();

  const q = document.getElementById('vh-q');
  q.value = 'seal';
  q.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 120));
  const filtered = visible();
  const countText = document.getElementById('vh-count').textContent.trim();

  // filter to nothing: the EMPTY must be the filtered one, and the table goes
  q.value = 'zzzz';
  q.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 120));
  const emptyEl = document.getElementById('vh-empty');
  const emptyShown = !emptyEl.hidden;
  const emptySaysFiltered = /filter/i.test(emptyEl.textContent);
  const tableHidden = dialog.querySelector('.bo-data-table-container').hidden;

  // back, then pick
  document.getElementById('vh-clear').click();
  await new Promise((r) => setTimeout(r, 120));
  const restored = visible();
  dialog.querySelector('[data-vh-pick="MAT-1180"]').click();
  await new Promise((r) => setTimeout(r, 350));
  return { before, opened, all, filtered, countText, emptyShown, emptySaysFiltered, tableHidden, restored,
    picked: field.value, closed: !dialog.open,
    /* Focus must be back IN THE FIELD, which is what the page promises. It is
       not automatic: closing a modal from a click inside it leaves focus on
       <body>, so the reader ends up with a value and no caret. Asserting
       "not body" would pass on almost anything; assert the field. */
    focusBack: document.activeElement === field,
    focusTag: (document.activeElement?.tagName || '') + '#' + (document.activeElement?.id || '') };
});
check(
  'value-help: searching narrows the results and the count follows',
  vh.opened && vh.all === 6 && vh.filtered === 2 && vh.countText === '2 of 6',
  JSON.stringify(vh),
);
check(
  'value-help: filtering to nothing shows the FILTERED empty, not a bare header row',
  vh.emptyShown && vh.emptySaysFiltered && vh.tableHidden && vh.restored === 6,
  JSON.stringify(vh),
);
check(
  'value-help: picking fills the field, closes the dialog, and puts focus back in the field',
  vh.picked === 'MAT-1180' && vh.picked !== vh.before && vh.closed && vh.focusBack,
  JSON.stringify(vh),
);

/* master-detail's drawer close button. It carried an invented
   `data-dialog-close` attribute from 45.2 until 2026-08-19 — a hook the
   behavior never implemented and the API never documented — so the ×, Cancel
   and Save buttons all did NOTHING. The drawer's existing claim tested Escape,
   which is why three dead buttons shipped unnoticed. They are native
   `<form method="dialog">` submits now. */
await visit('/patterns/master-detail/', { width: NARROW_WIDTH });
const mdClose = await page.evaluate(async () => {
  const dialog = document.getElementById('md-drawer');
  document.querySelector('[data-dialog-trigger="md-drawer"]').click();
  await new Promise((r) => setTimeout(r, 250));
  const opened = dialog.open;
  const closer = dialog.querySelector('form[method="dialog"] button');
  const hasCloser = !!closer;
  closer?.click();
  await new Promise((r) => setTimeout(r, 250));
  return { opened, hasCloser, closed: !dialog.open };
});
check(
  'master-detail: the drawer close BUTTON closes it, not only Escape',
  mdClose.opened && mdClose.hasCloser && mdClose.closed,
  JSON.stringify(mdClose),
);

/* /patterns/command-bar states two things the browser must actually do, and
   the second is the reason the page exists in the shape it does.

   1. The composed palette really does carry combobox's keyboard contract —
      the whole basis for refusing a bo-command-bar component (roadmap 99.3).
      If ArrowDown ever stops moving aria-activedescendant inside a modal
      dialog, the refusal stops being justified and this page starts lying.
   2. The hint strip is NOT overlapped by the result list. It was, when the
      page was first written: the listbox is a [popover] in the top layer, so
      it painted over a footer placed below the input. Geometry is the only
      thing that can catch that — the markup looked perfectly correct. */
await visit('/patterns/command-bar/');
const palette = await page.evaluate(async () => {
  const dlg = document.getElementById('cmd');
  document.getElementById('cmd-open').click();
  await new Promise((r) => setTimeout(r, 250));
  const input = document.getElementById('cmd-input');
  const listbox = document.getElementById('cmd-list');
  input.focus();
  input.value = 'po';
  input.dispatchEvent(new Event('input', { bubbles: true }));
  await new Promise((r) => setTimeout(r, 250));
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
  await new Promise((r) => setTimeout(r, 200));
  const hint = dlg.querySelector('.cmd-palette__hint');
  const h = hint.getBoundingClientRect();
  const l = listbox.getBoundingClientRect();
  return {
    open: dlg.open,
    expanded: input.getAttribute('aria-expanded'),
    active: input.getAttribute('aria-activedescendant'),
    selected: !!dlg.querySelector('[role="option"][aria-selected="true"]'),
    hintOverlapsList: !(h.top >= l.bottom || h.bottom <= l.top),
    hintAboveInput: h.top < input.getBoundingClientRect().top,
  };
});
check(
  'command bar: ArrowDown moves aria-activedescendant inside the modal dialog',
  palette.open && palette.expanded === 'true' && !!palette.active && palette.selected,
  JSON.stringify(palette),
);
check(
  'command bar: the keyboard hints are above the input and never covered by the popover listbox',
  palette.hintAboveInput && palette.hintOverlapsList === false,
  JSON.stringify(palette),
);

/* /patterns/inbox: "arrow keys move between filters for free" (roadmap
   109.17 — this page had zero check-claims coverage). Native radio-group
   behavior, not framework JS, but a documented claim is a documented claim
   regardless of who implements it. Real key event, not a synthetic one. */
await visit('/patterns/inbox/', { width: 1440 });
await page.focus('#inb-all');
await page.keyboard.press('ArrowRight');
const inboxArrow = await page.evaluate(() => ({
  activeId: document.activeElement?.id,
  appraisedChecked: document.getElementById('inb-appr')?.checked,
}));
check(
  'inbox: ArrowRight on the filter group moves focus AND selection to the next radio',
  inboxArrow.activeId === 'inb-appr' && inboxArrow.appraisedChecked === true,
  JSON.stringify(inboxArrow),
);

/* /patterns/kanban: the Move menu opens via native popovertarget and
   auto-closes on item selection via initDropdowns()'s delegated click
   listener (roadmap 109.17 — zero prior coverage). Verified against
   dropdown.ts directly before writing this: the close-on-select handler
   matches ANY `.bo-dropdown__item` click inside a `.bo-dropdown__menu[popover]`,
   independent of whether that item has its own business-logic handler —
   so this is real even though "Move to…" itself is a no-op in the demo. */
await visit('/patterns/kanban/', { width: 1440 });
await page.click('[popovertarget="kb-menu-1"]');
const kanbanOpen = await page.evaluate(() => document.getElementById('kb-menu-1')?.matches(':popover-open'));
await page.click('#kb-menu-1 .bo-dropdown__item');
const kanbanClosed = await page.evaluate(() => !document.getElementById('kb-menu-1')?.matches(':popover-open'));
check(
  'kanban: the Move menu opens on trigger click and auto-closes on item selection',
  kanbanOpen === true && kanbanClosed === true,
  JSON.stringify({ kanbanOpen, kanbanClosed }),
);

/* /components/richtext Advanced demo (roadmap 113.1): formatBlock produces
   a real semantic heading, and the three justify buttons are a mutually
   exclusive group — clicking one clears aria-pressed on the other two, not
   just sets its own. Both surprised on first manual test (removeFormat's
   scope was the third surprise, documented in prose rather than asserted
   here — it has no pass/fail shape, only a "what it does" one). */
await visit('/components/richtext/', { width: 1440, height: 1200 });
const richtext = await page.evaluate(() => {
  const advanced = document.querySelectorAll('.demo')[1];
  const content = advanced.querySelector('.bo-richtext__content');
  const p = content.querySelector('p');
  const range = document.createRange();
  range.selectNodeContents(p);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  return true;
});
await page.click('.demo:nth-of-type(2) [data-richtext-cmd="formatBlock"]'); // H2 is the first
const afterHeading = await page.evaluate(() =>
  !!document.querySelectorAll('.demo')[1].querySelector('.bo-richtext__content h2'));
check(
  'richtext Advanced: formatBlock("H2") produces a real <h2>, not styled text',
  afterHeading,
  JSON.stringify({ afterHeading }),
);

await page.click('.demo:nth-of-type(2) [data-richtext-cmd="justifyCenter"]');
const justifyState = await page.evaluate(() => {
  const btns = document.querySelectorAll('.demo:nth-of-type(2) [data-richtext-cmd^="justify"]');
  return Object.fromEntries([...btns].map((b) => [b.dataset.richtextCmd, b.getAttribute('aria-pressed')]));
});
check(
  'richtext Advanced: clicking Center clears Left/Right aria-pressed, not just sets its own',
  justifyState.justifyCenter === 'true' && justifyState.justifyLeft === 'false' && justifyState.justifyRight === 'false',
  JSON.stringify(justifyState),
);

// /components/form "Label-start sections" (roadmap 117): "the section
// collapses back to labels-on-top on its own" below 30rem, and "start...
// flips to the visual right under dir=rtl" — both are claims a browser can
// check, not just a stylesheet rule existing.
await visit('/components/form/', { width: DESKTOP_WIDTH, height: 1400 });
const labelStartWide = await page.evaluate(() => {
  const field = document.querySelector('.bo-form-section--label-start .bo-form-field');
  return getComputedStyle(field).display;
});
await visit('/components/form/', { width: NARROW_WIDTH, height: 1600 });
const labelStartNarrow = await page.evaluate(() => {
  const field = document.querySelector('.bo-form-section--label-start .bo-form-field');
  const cs = getComputedStyle(field);
  return { display: cs.display, flexDirection: cs.flexDirection };
});
check(
  'label-start section collapses to a stacked (top) layout below 30rem, with no consumer breakpoint',
  labelStartWide === 'grid' && labelStartNarrow.display === 'flex' && labelStartNarrow.flexDirection === 'column',
  JSON.stringify({ labelStartWide, labelStartNarrow }),
);

await visit('/components/form/', { width: DESKTOP_WIDTH, height: 1400 });
const rtlFlip = await page.evaluate(() => {
  const field = document.querySelector('.bo-form-section--label-start .bo-form-field');
  const label = field.querySelector('.bo-form-field__label');
  const input = field.querySelector('.bo-input');
  const ltr = { labelLeft: label.getBoundingClientRect().left, inputLeft: input.getBoundingClientRect().left };
  document.documentElement.setAttribute('dir', 'rtl');
  const rtl = { labelLeft: label.getBoundingClientRect().left, inputLeft: input.getBoundingClientRect().left };
  document.documentElement.removeAttribute('dir');
  return { ltr, rtl };
});
check(
  'label-start is logical (start), not a literal left: the label sits before the input in LTR and after it in RTL',
  rtlFlip.ltr.labelLeft < rtlFlip.ltr.inputLeft && rtlFlip.rtl.labelLeft > rtlFlip.rtl.inputLeft,
  JSON.stringify(rtlFlip),
);

// Demo code folds (roadmap 118 "Option A"): closed by default on screen,
// forced open under print media so printed pages keep their code — a closed
// <details> prints empty, and the docs' own print story is load-bearing
// (/patterns/output-form). The shell listens to matchMedia('print'), which
// is the signal CDP print emulation actually delivers.
await visit('/components/form/', { width: DESKTOP_WIDTH, height: 1400 });
const foldsScreen = await page.evaluate(() => {
  const all = [...document.querySelectorAll('details.demo-pair__code')];
  return { total: all.length, open: all.filter((d) => d.open).length };
});
await visit('/components/form/', { media: 'print', width: DESKTOP_WIDTH, height: 1400 });
const foldsPrint = await page.evaluate(() => {
  const all = [...document.querySelectorAll('details.demo-pair__code')];
  return { total: all.length, open: all.filter((d) => d.open).length };
});
check(
  'demo code folds: closed by default on screen, ALL forced open under print media',
  foldsScreen.total > 0 && foldsScreen.open === 0 &&
    foldsPrint.total === foldsScreen.total && foldsPrint.open === foldsPrint.total,
  JSON.stringify({ foldsScreen, foldsPrint }),
);

// Column priority ladder (roadmap 127.2): --tertiary drops below 40rem of
// CONTAINER width, --secondary below 30rem, unmarked columns never — the
// tier ORDER is the claim, not just "something hides". Driven by setting
// the demo wrapper's width and re-reading computed display, so the named
// container query is exercised for real, at three widths bracketing both
// thresholds.
await visit('/components/data-table/', { width: DESKTOP_WIDTH, height: 2400 });
const ladder = await page.evaluate(async () => {
  const raf = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const tertiaryTh = document.querySelector('th.bo-data-table__col--tertiary');
  const wrap = tertiaryTh.closest('.bo-data-table-container').parentElement;
  const read = () => {
    const row = tertiaryTh.closest('tr');
    const vis = (sel) => getComputedStyle(row.querySelector(sel)).display !== 'none';
    return {
      tertiary: vis('.bo-data-table__col--tertiary'),
      secondary: vis('.bo-data-table__col--secondary'),
      unmarked: vis('th:not([class])'),
    };
  };
  const out = {};
  for (const [name, width] of [['wide', '45rem'], ['mid', '35rem'], ['narrow', '25rem']]) {
    wrap.style.maxInlineSize = width;
    wrap.style.minInlineSize = '0';
    await raf();
    out[name] = read();
  }
  return out;
});
check(
  'column priority ladder drops in tier order as the CONTAINER narrows: all visible at 45rem; tertiary-only hidden at 35rem; tertiary+secondary hidden (unmarked still visible) at 25rem',
  ladder.wide.tertiary && ladder.wide.secondary && ladder.wide.unmarked &&
    !ladder.mid.tertiary && ladder.mid.secondary && ladder.mid.unmarked &&
    !ladder.narrow.tertiary && !ladder.narrow.secondary && ladder.narrow.unmarked,
  JSON.stringify(ladder),
);

// The ladder ADOPTED: list-report's results table at a phone-narrow
// viewport keeps the columns an AP clerk cannot read the row without
// (Invoice #, Vendor, Amount, Status) and drops Cost center + Due.
await visit('/patterns/list-report/', { width: NARROW_WIDTH, height: 1600 });
const lrLadder = await page.evaluate(() => {
  const table = document.querySelector('.bo-data-table--sticky-col');
  const th = (sel) => table.querySelector(`thead ${sel}`);
  const vis = (el) => el && getComputedStyle(el).display !== 'none';
  return {
    containerRem: table.closest('.bo-data-table-container').clientWidth / 16,
    tertiaryHidden: !vis(th('.bo-data-table__col--tertiary')),
    secondaryHidden: !vis(th('.bo-data-table__col--secondary')),
    invoiceVisible: vis(th('[aria-sort]')),
    amountVisible: vis(th('.bo-data-table__col--numeric')),
  };
});
check(
  'list-report at phone width: priority ladder drops Cost center (tertiary) and Due (secondary); Invoice # and Amount stay',
  lrLadder.containerRem < 30 && lrLadder.tertiaryHidden && lrLadder.secondaryHidden &&
    lrLadder.invoiceVisible && lrLadder.amountVisible,
  JSON.stringify(lrLadder),
);

// Touch attribute recipe (roadmap 127.5). A spec table next to a demo is
// two copies of one fact, and the docs' whole doctrine is that a
// documented surface is generated from the shipped thing rather than
// retyped beside it. This recipe cannot be generated — the attributes
// express MEANING a stylesheet does not carry — so the next best thing
// is asserted: parse each table row's #id and its <code> attribute
// pairs, then require the live field to carry exactly those values. The
// table drifting from the demo is the failure this catches, in either
// direction.
await visit('/components/form/', { width: DESKTOP_WIDTH, height: 2600 });
const recipe = await page.evaluate(() => {
  const rows = [...document.querySelectorAll('table tbody tr')].filter((tr) =>
    /^#tr-/.test(tr.querySelector('td code')?.textContent ?? ''));
  return rows.map((tr) => {
    const id = tr.querySelector('td code').textContent.slice(1);
    const pairs = [...tr.querySelectorAll('td:nth-child(2) code')]
      .map((c) => c.textContent.match(/^([a-z]+)="([^"]*)"$/))
      .filter(Boolean)
      .map((m) => [m[1], m[2]]);
    const el = document.getElementById(id);
    return {
      id,
      found: !!el,
      pairs: pairs.length,
      mismatched: !el ? ['no such field'] : pairs
        .filter(([name, value]) => el.getAttribute(name) !== value)
        .map(([name, value]) => `${name}: table says ${value}, field has ${el.getAttribute(name)}`),
    };
  });
});
check(
  'touch attribute recipe: every field in the table carries, live, exactly the attributes the table claims for it',
  recipe.length === 6 && recipe.every((r) => r.found && r.pairs >= 1 && r.mismatched.length === 0),
  JSON.stringify(recipe),
);

// Saved views (roadmap 127.4). The page's load-bearing claim is "a saved
// view is a URL" — the thing the reference variant managers cannot do.
// So DRIVE it: pick a view, submit, and read location.search. A shape
// assertion (a segmented control exists) would prove nothing here.
await visit('/patterns/list-report/', { width: DESKTOP_WIDTH, height: 1800 });
const beforeSearch = new URL(page.url()).search;
const formMethod = await page.evaluate(() => document.querySelector('#lv-overdue').closest('form').method);
await Promise.all([
  page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
  page.evaluate(() => {
    const radio = document.querySelector('#lv-overdue');
    radio.checked = true;
    const form = radio.closest('form');
    form.requestSubmit(form.querySelector('button[type="submit"]'));
  }),
]);
const viewUrl = { before: beforeSearch, after: new URL(page.url()).search, method: formMethod };
check(
  'a saved view is a URL: picking a view and submitting the switcher navigates to ?view=<name>, so the view can be bookmarked, pasted into a ticket or sent to a colleague',
  viewUrl.method === 'get' && !viewUrl.before.includes('view=') &&
    /(^|[?&])view=overdue(&|$)/.test(viewUrl.after),
  JSON.stringify(viewUrl),
);

// Inbox's phone section (roadmap 127.3) claims the ladder narrows it —
// measured at a DESKTOP viewport on purpose: the demo box is 390px while
// the window is 1440px, so if anything hides it is the CONTAINER query
// doing it, not a media query. That distinction is the page's actual
// assertion and the reason the section needs no phone-only stylesheet.
await visit('/patterns/inbox/', { width: DESKTOP_WIDTH, height: 2200 });
const inboxPhone = await page.evaluate(() => {
  const th = document.querySelector('th.bo-data-table__col--tertiary');
  const table = th.closest('table');
  const vis = (el) => getComputedStyle(el).display !== 'none';
  return {
    viewport: window.innerWidth,
    containerRem: th.closest('.bo-data-table-container').clientWidth / 16,
    sourceVisible: vis(th),
    waitingVisible: vis(table.querySelector('th.bo-data-table__col--secondary')),
    itemVisible: vis(table.querySelector('thead th:not([class])')),
    itemLinks: table.querySelectorAll('tbody a').length,
  };
});
check(
  'inbox phone section: at a 1440px VIEWPORT the 390px container still drops Source and Waiting — a container query, not a media query — leaving the item and its link',
  inboxPhone.viewport === DESKTOP_WIDTH && inboxPhone.containerRem < 30 &&
    !inboxPhone.sourceVisible && !inboxPhone.waitingVisible &&
    inboxPhone.itemVisible && inboxPhone.itemLinks === 3,
  JSON.stringify(inboxPhone),
);

// /patterns/schedule's "Open it full screen" link (roadmap 119.1): a real
// navigation to an isolated document with no docs chrome, showing the SAME
// generated month (not a second, driftable copy).
await visit('/patterns/schedule/', { width: DESKTOP_WIDTH, height: 1000 });
const fullScreenLink = await page.evaluate(() => {
  const a = [...document.querySelectorAll('a')].find((x) => x.textContent.includes('Open it full screen'));
  return { href: a?.getAttribute('href'), target: a?.getAttribute('target'), rel: a?.getAttribute('rel') };
});
await visit('/patterns/schedule/full/', { width: DESKTOP_WIDTH, height: 1000 });
const fullScreenPage = await page.evaluate(() => ({
  hasSidebar: !!document.querySelector('.bo-sidebar-nav'),
  hasNavbar: !!document.querySelector('.bo-navbar'),
  dayCells: document.querySelectorAll('.bo-calendar__day').length,
  hasDetail: !!document.getElementById('schedule-detail'),
}));
check(
  'schedule\'s full-screen link opens a real, chrome-free document with the same generated month',
  fullScreenLink.href === base + '/patterns/schedule/full' && fullScreenLink.target === '_blank' &&
    fullScreenLink.rel === 'noopener' && !fullScreenPage.hasSidebar && !fullScreenPage.hasNavbar &&
    fullScreenPage.dayCells > 30 && fullScreenPage.hasDetail,
  JSON.stringify({ fullScreenLink, fullScreenPage }),
);

// "Groups on blur — click in, type a number, tab away" (123.1): the form
// page's data-grouped input. Drives the real focus → edit → blur path; the
// submitted value must be the RAW number via the generated hidden input.
await visit('/components/form/');
const grouped = await page.evaluate(() => {
  const input = document.getElementById('grp-budget');
  input.focus();
  const whileFocused = input.value;
  input.value = '1234567.5';
  input.blur();
  const hidden = document.querySelector('input[type="hidden"][name="budget"]');
  return {
    type: input.type, inputMode: input.inputMode, whileFocused,
    display: input.value, raw: hidden?.value ?? null,
  };
});
check(
  "form's data-grouped input: raw while focused, grouped on blur, raw number submitted",
  grouped.type === 'text' && grouped.inputMode === 'decimal' &&
    grouped.whileFocused === '2500000.00' && grouped.display === '1,234,567.50' &&
    grouped.raw === '1234567.50',
  JSON.stringify(grouped),
);

// Scan-result flash (126.2): "press Enter: the viewport flashes green …
// scan a REJECT* code and it flashes red with the reason announced".
// Real keydown on the real input — a synthetic document-level event
// matches no delegated handler (this file's own standing lesson).
await visit('/patterns/goods-receipt/');
const scanFlash = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const input = document.getElementById('gr-scan');
  input.focus();
  input.value = '4006381333931';
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  const okStamp = document.body.dataset.scanResult;
  const okOverlay = getComputedStyle(document.body, '::after').position;
  await wait(900);
  const okExpired = document.body.dataset.scanResult === undefined;
  input.value = 'REJECT-123';
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  const errStamp = document.body.dataset.scanResult;
  const errAnnounced = document.getElementById('gr-scan-status').textContent;
  await wait(900);
  return { okStamp, okOverlay, okExpired, errStamp, errAnnounced,
           finallyClear: document.body.dataset.scanResult === undefined };
});
check(
  'goods-receipt scan flash: ok on capture, expires, error overrides with an announced reason',
  scanFlash.okStamp === 'ok' && scanFlash.okOverlay === 'fixed' && scanFlash.okExpired &&
    scanFlash.errStamp === 'error' && /Not on this PO: REJECT-123/.test(scanFlash.errAnnounced) &&
    scanFlash.finallyClear,
  JSON.stringify(scanFlash),
);

// Sync-state slot (127.1): "Click it in this demo to cycle the four
// states" — both channels must move together, and the glyphs must differ
// by SHAPE across states (never colour-only).
await visit('/patterns/app-frame/');
const sync = await page.evaluate(() => {
  const btn = document.getElementById('frame-sync');
  const read = () => ({
    chip: document.querySelector('[data-sync-chip]').textContent.trim(),
    live: document.getElementById('frame-sync-live').textContent,
  });
  const s0 = read();
  const seen = [s0];
  for (let i = 0; i < 3; i++) { btn.click(); seen.push(read()); }
  btn.click(); // wraps back to online
  const wrapped = read();
  const glyphs = seen.map((s) => s.chip[0]);
  return { seen, wrapped, glyphShapes: new Set(glyphs).size };
});
check(
  "app-frame sync slot: four states, both channels move together, glyphs differ by shape",
  sync.glyphShapes === 4 &&
    sync.seen.every((s) => s.live.startsWith('Connection:')) &&
    /queued/.test(sync.seen[2].chip) && /3 actions queued/.test(sync.seen[2].live) &&
    /error/i.test(sync.seen[3].chip) && sync.wrapped.chip === sync.seen[0].chip,
  JSON.stringify(sync),
);

await browser.close();
server.close();

g.report('verified live');
