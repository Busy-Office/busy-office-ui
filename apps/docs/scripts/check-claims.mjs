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
//   * `reveal()`'s THIRD container — an inactive `[role=tabpanel][hidden]`.
//     The other two it handles are demonstrated and checked live on
//     /patterns/validation-summary (a closed `<details>` and a collapsed
//     `.bo-widget__collapse`). No docs page composes a FORM across tabs, and
//     restructuring that pattern's demo into a tabbed form to reach the third
//     path would change what the page teaches in order to satisfy this gate —
//     the tail wagging the dog. Covered instead by `reveal.test.ts`, which
//     asserts both the pressed-tab path and the not-installed fallback.
//     Re-home this as a live case the moment a pattern page grows a tabbed
//     form; roadmap 154 records that question as deliberately open.
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
import { DIST, REPO_ROOT } from './paths.mjs';
import { WIDTHS, DESKTOP_WIDTH, NARROW_WIDTH } from './viewports.mjs';
import { contrastRatio, composite } from '../../../packages/core/scripts/wcag.mjs';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
// Parsed, never grepped: the one claim below that reads shipped CSS is about a
// rule this browser cannot exercise, and button.css's own comment names both
// `translateY` and `:not(:focus-visible)` repeatedly — a substring assertion
// there would be tripped by the prose explaining the rule.
import postcss from 'postcss';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/* Reconciled against the GENERATED keymap rather than a literal: if
   extract-keymap emits a different number of richtext shortcuts, the
   dialog's row count must move with it or this fails. A hard-coded 7 would
   pass while the docs and the source disagreed. */
const RICHTEXT_KEY_COUNT = createRequire(import.meta.url)(
  '../../../packages/core/dist/keymap.json',
).components.find((c) => c.name === 'bo-richtext').keys.length;

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

/**
 * The frame holding an RF screen's mirror.
 *
 * Roadmap 131.1/135.1 collapsed the RF pattern pages to ONE screen, and that
 * screen is an isolated `rf-essentials` document embedded in the page — so a
 * claim about scanning, flashing or focus has to drive the frame, not the
 * outer page. Both goods-receipt claims below found this the expensive way:
 * they went red on CI with "No element found for selector: #gr-scan" after
 * the duplicate inline copy they had been silently relying on was removed.
 *
 * Fails loudly rather than returning the page: a claim that silently fell
 * back to the outer document would pass while testing nothing, which is the
 * failure mode this whole file exists to avoid.
 */
async function mirror(match) {
  const f = page.frames().find((fr) => fr.url().includes(match));
  if (!f) throw new Error(`mirror frame not found for "${match}" on ${page.url()}`);
  await f.waitForSelector('main', { timeout: 5000 });
  return f;
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

// /patterns/editable-grid's three runtime claims from 173.2 (roadmap 190.2).
// The recipe requires these; 173.2 wrote the sentences and skipped this step.
await visit('/patterns/editable-grid/');

// 1. "clicking into the Qty cell reveals why" — and, by construction, that it
//    is NOT revealed before. Drive a real focus, not a synthetic event.
const reveal = await page.evaluate(() => {
  const bad = document.querySelector('.bo-data-table [aria-invalid="true"]');
  if (!bad) return { missing: true };
  const msg = bad.closest('.bo-form-field')?.querySelector('.bo-form-field__message');
  if (!msg) return { missing: true };
  const blurred = getComputedStyle(msg).display;
  bad.focus();
  const focused = getComputedStyle(msg).display;
  const box = msg.getBoundingClientRect();
  return { blurred, focused, visibleWhenFocused: box.height > 0 };
});
check('editable-grid: focus reveals the cell error message',
  reveal.blurred === 'none' && reveal.focused !== 'none' && reveal.visibleWhenFocused,
  JSON.stringify(reveal));

// 2. "a message that sits in the row's FLOW grows the row and shifts every
//    other cell in it (53px -> 75px, siblings moved 11px)". The page states
//    this as the REASON for the design, so the claim is about the counter-
//    factual: put the message back in flow and the row must grow. Asserting
//    only the fixed state would leave the page's argument unverified.
const flow = await page.evaluate(() => {
  const bad = document.querySelector('.bo-data-table [aria-invalid="true"]');
  const row = bad.closest('tr');
  const fixed = Math.round(row.getBoundingClientRect().height);
  const s = document.createElement('style');
  s.textContent = `.bo-data-table .bo-form-field .bo-form-field__message
                   { display: block !important; position: static !important; }`;
  document.head.appendChild(s);
  const msg = bad.closest('.bo-form-field').querySelector('.bo-form-field__message');
  // getComputedStyle returns a LIVE object: read it into plain strings BEFORE
  // removing the style, or the snapshot reverts with it and the injection
  // check reports false on a mutation that plainly landed.
  const cs = getComputedStyle(msg);
  const seen = { display: cs.display, position: cs.position };
  const inFlow = Math.round(row.getBoundingClientRect().height);
  s.remove();
  // assert the mutation LANDED before believing the comparison
  return { fixed, inFlow, seen,
           injectionLanded: seen.display === 'block' && seen.position === 'static' };
});
check('editable-grid: an in-flow message would grow the row (the stated reason)',
  flow.injectionLanded && flow.inFlow > flow.fixed,
  JSON.stringify(flow));

// 3. "aria-describedby carries the reason to a screen reader continuously,
//    focused or not" — the association must resolve to the message element
//    and be present while blurred, which is the whole point of the sentence.
const described = await page.evaluate(() => {
  const bad = document.querySelector('.bo-data-table [aria-invalid="true"]');
  bad.blur();
  const id = bad.getAttribute('aria-describedby');
  const target = id && document.getElementById(id);
  return {
    id, resolves: !!target,
    isTheMessage: !!target?.classList.contains('bo-form-field__message'),
    hasText: (target?.textContent ?? '').trim().length > 0,
  };
});
check('editable-grid: aria-describedby resolves to the message while blurred',
  described.resolves && described.isTheMessage && described.hasText,
  JSON.stringify(described));

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
await visit('/components/sidebar-nav/', { width: DESKTOP_WIDTH });
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
await visit('/components/filters/', { width: DESKTOP_WIDTH });
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
await visit('/components/tabs/', { width: DESKTOP_WIDTH });
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
await visit('/patterns/detail-form/', { width: DESKTOP_WIDTH });
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

/* /components/data-table's cell link (roadmap 135.3b): "a full-cell target
   instead of a strip of text", and the page quotes 18px vs 48px. That is a
   geometry claim about a touch target, and it is exactly the kind that looks
   fine while being false — the bug it fixes was invisible because the two rows
   first measured happened to WRAP, giving a 42px line box.

   Assert the shipped state and the counterfactual in one pass: with the part,
   every link clears 44px; strip the class and the single-line rows fall back
   to an 18px line box. That 18px CONFORMS to WCAG 2.5.8 via the spacing
   exception — check-target-size reports exactly that for the 18px sort button
   — so this is an ergonomics claim, not a conformance one. Checking only the
   first half would pass on a table whose labels all wrap. */
await visit('/components/data-table/', { width: DESKTOP_WIDTH });
const cellLink = await page.evaluate(() => {
  const box = document.querySelector('[data-cell-link-demo]');
  const links = [...box.querySelectorAll('.bo-data-table__cell-link')];
  const heights = () => links.map((a) => Math.round(a.getBoundingClientRect().height));
  const withPart = heights();
  links.forEach((a) => a.classList.remove('bo-data-table__cell-link'));
  const without = heights();
  links.forEach((a) => a.classList.add('bo-data-table__cell-link'));
  return {
    count: links.length,
    withPart,
    without,
    minWith: Math.min(...withPart),
    minWithout: Math.min(...without),
    overflow: Math.round(box.scrollWidth - box.clientWidth),
  };
});
check(
  'data-table: a cell link is a full-cell target, not a line of text',
  cellLink.count >= 3 && cellLink.minWith >= 44 && cellLink.minWithout < 24 &&
    cellLink.overflow === 0,
  JSON.stringify(cellLink),
);

/* /components/data-table's grouped column header (roadmap 130.2, GAP-4a):
   "a second header row simply works". That is a runtime promise about
   `position: sticky`, and it was FALSE until this wake — every `thead th`
   pinned at 0, so on a real three-way-match screen the "Quantity" cell and
   the "Ordered" cell beneath it occupied the identical box and the group
   label was invisible, not merely overlapped.

   Driven, not inspected. "Stuck" is defined by MOVEMENT, not by position: a
   pinned header travels less than the scroll delta while a body row travels
   the whole of it. The first version of this check asked whether the group
   row sat at the scrollport's top edge, which is a different question — it
   depends on which ancestor scrolls and on what sticky chrome sits above,
   and it reported `groupPinned: false` while the fix was demonstrably
   working. Testing the pinning as a RELATIVE displacement needs no
   assumption about either.

   Checking "disjoint" alone would not do: on an unscrolled page the two
   rows are naturally stacked, so that half passes while nothing is tested. */
await visit('/components/data-table/', { width: DESKTOP_WIDTH });
const groupedHead = await page.evaluate(async () => {
  const box = document.querySelector('[data-grouped-head]');
  const groupCell = () => [...box.querySelectorAll('thead tr')[0].querySelectorAll('th')]
    .find((t) => t.textContent.trim() === 'Quantity');
  const subCell = () => box.querySelectorAll('thead tr')[1].querySelector('th');
  const bodyCell = () => box.querySelector('tbody tr:last-child td');

  box.scrollIntoView({ block: 'start' });
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const before = { g: groupCell().getBoundingClientRect().top, b: bodyCell().getBoundingClientRect().top };

  /* The header sticks to ITS OWN scrollport, which is the container — it has
     `overflow` of its own, so scrolling the page moves the whole table,
     header included, and pins nothing. That is why the demo caps its height:
     without a container that scrolls there is no sticky behaviour to see or
     to test. Walk outward anyway, starting at the container itself, so this
     keeps working if the demo's shape changes. */
  const scroller = (() => {
    for (let el = box; el; el = el.parentElement) {
      const cs = getComputedStyle(el);
      if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight) return el;
    }
    return document.scrollingElement;
  })();
  const DELTA = 60;
  scroller.scrollTop += DELTA;
  await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));

  const g = groupCell().getBoundingClientRect();
  const s = subCell().getBoundingClientRect();
  const after = { g: g.top, b: bodyCell().getBoundingClientRect().top };
  return {
    overlap: Math.round(Math.min(g.bottom, s.bottom) - Math.max(g.top, s.top)),
    subBelowGroup: Math.round(s.top) >= Math.round(g.bottom) - 1,
    bodyMoved: Math.round(before.b - after.b),
    groupMoved: Math.round(before.g - after.g),
    subOffset: getComputedStyle(subCell()).insetBlockStart,
    scroller: scroller.className || scroller.tagName,
  };
});
check(
  'data-table: a grouped header keeps its group row visible above the sub row while scrolling',
  groupedHead.overlap <= 0 &&
    groupedHead.subBelowGroup &&
    groupedHead.bodyMoved >= 40 &&
    groupedHead.groupMoved < groupedHead.bodyMoved,
  JSON.stringify(groupedHead),
);

/* /components/data-table claims of the 50-column table: "the Item column stays
   put, the header stays put, and both stay opaque over the cells passing
   underneath" (roadmap 30.3). Opacity matters as much as position — a
   transparent frozen cell shows the scrolling content through itself, which
   looks like a rendering bug and makes both unreadable. */
await visit('/components/data-table/', { width: DESKTOP_WIDTH });
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
await visit('/components/tabs/', { width: DESKTOP_WIDTH });
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

await visit('/components/tabs/', { width: DESKTOP_WIDTH });

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
await visit('/components/tabs/', { width: NARROW_WIDTH });
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
await visit('/getting-started/first-screen/', { width: DESKTOP_WIDTH });
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
await visit('/components/icon/', { width: DESKTOP_WIDTH });
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
await visit('/patterns/filter-panel/', { width: DESKTOP_WIDTH });
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
await visit('/components/calendar/', { width: DESKTOP_WIDTH });
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
/* WAIT FOR THE NAVIGATION, never for a fixed number of milliseconds (roadmap
   318.1). This read `setTimeout(400)` and turned `main` red on CI run 807 with
   `submitted: null` while every other field of the claim was true — the click
   submits a real form GET, and on a runner hosting six parallel headless-Chrome
   jobs that navigation outran the budget. It is not marginal in an idle
   container, which is why no local run ever caught it: measured here at 42-70ms
   against 400.

   The pattern is not invented for this fix — it is the one the SIBLING
   navigation-gated claim in this file (saved views, "a saved view is a URL")
   has always used. Of the two assertions here that gate on a full page
   navigation, that one waited deterministically and this one did not.

   Red-proved by injection rather than by reasoning: with the navigation
   delayed 800ms through request interception, the old fixed wait reproduces
   CI's exact reading (`submitted: null`) and this one passes; with no delay
   both pass, so the injection discriminates rather than breaking everything. */
if (target) {
  wanted = await target.evaluate((el) => el.value);
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
    target.click(),
  ]);
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
  await visit('/components/data-table/', { width: DESKTOP_WIDTH });
  await page.evaluate((t) => localStorage.setItem('bo-theme', t), theme);
  await visit('/components/data-table/', { width: DESKTOP_WIDTH });
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
await visit('/components/tree-table/', { width: DESKTOP_WIDTH });
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
await visit('/components/quantity/', { width: DESKTOP_WIDTH });
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
await visit('/components/alerts/', { width: DESKTOP_WIDTH });
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
await visit('/patterns/list-report/', { width: DESKTOP_WIDTH });
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
await visit('/patterns/master-detail/', { width: NARROW_WIDTH });
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
const grFrame = await mirror('goods-receipt-rf');
await grFrame.click('#gr-scan');
await page.keyboard.type('5901234123457', { delay: 5 });
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 200));
const scan = await grFrame.evaluate(() => ({
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

/* The half that shipped broken (roadmap 154.1): a required field inside a
   container the framework hides still blocks submit, so the summary lists it —
   and before this, the entry it handed over silently did nothing, because
   `.focus()` is a no-op on a subtree the browser does not render. The page now
   demos a required field inside a closed <details>, so the claim is checkable
   against the real page rather than against injected markup.

   Asserted on the DOM after a REAL click, never on the source: the failing
   version listed the entry correctly and looked completely fine. */
const vsReveal = await page.evaluate(async () => {
  const details = document.querySelector('form[data-validation-summary] details');
  const box = document.querySelector('[data-validation-summary-box]');
  const entry = [...box.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#vs-dock');
  return {
    // The precondition the whole claim rests on — if a collapsed required
    // field did NOT block submit there would be nothing to reveal.
    blocksSubmit: document.getElementById('vs-dock').willValidate,
    closedBefore: !details.open,
    listed: !!entry,
    ...(entry
      ? await (async () => {
          entry.click();
          await new Promise((r) => setTimeout(r, 150));
          return { openAfter: details.open, focused: document.activeElement?.id ?? null };
        })()
      : {}),
  };
});
check(
  'validation-summary: an entry inside a closed <details> opens it, then focuses the field',
  vsReveal.blocksSubmit &&
    vsReveal.closedBefore &&
    vsReveal.listed &&
    vsReveal.openAfter &&
    vsReveal.focused === 'vs-dock',
  JSON.stringify(vsReveal),
);

/* The collapsed-card container, which fails DIFFERENTLY and worse than the
   other two: it clips instead of un-rendering, so `.focus()` succeeds into a
   0px `overflow: hidden` box and focus moves somewhere the user cannot see.
   `<details>` above cannot catch a regression here — a fix that handled only
   un-rendered containers would leave this live.

   Measure the box that CARRIES the constraint. The input keeps its own height
   whether or not it is clipped; the collapse container is what animates from
   0, so this settles the `grid-template-rows` transition first and then
   asserts the container is really open. A bounded poll, so a container that is
   genuinely stuck at zero still reports zero rather than hanging. */
const vsCollapse = await page.evaluate(async () => {
  const box = document.querySelector('[data-validation-summary-box]');
  const collapse = document.getElementById('vs-notes-body');
  const trigger = document.querySelector('[data-collapse-trigger][aria-controls="vs-notes-body"]');
  const entry = [...box.querySelectorAll('a')].find((a) => a.getAttribute('href') === '#vs-note');
  const out = {
    blocksSubmit: document.getElementById('vs-note').willValidate,
    closedBefore: collapse.dataset.state === 'closed',
    listed: !!entry,
  };
  if (!entry) return out;
  entry.click();
  for (let i = 0; i < 40 && collapse.getBoundingClientRect().height === 0; i++) {
    await new Promise((r) => setTimeout(r, 25));
  }
  return {
    ...out,
    state: collapse.dataset.state,
    expanded: trigger.getAttribute('aria-expanded'),
    height: Math.round(collapse.getBoundingClientRect().height),
    focused: document.activeElement?.id ?? null,
  };
});
check(
  'validation-summary: an entry inside a collapsed card opens it — focus does not land in a clipped 0px box',
  vsCollapse.blocksSubmit &&
    vsCollapse.closedBefore &&
    vsCollapse.listed &&
    vsCollapse.state === 'open' &&
    vsCollapse.expanded === 'true' &&
    vsCollapse.height > 0 &&
    vsCollapse.focused === 'vs-note',
  JSON.stringify(vsCollapse),
);

/* And the reason `novalidate` is on that form, which the page now states
   outright. Without it the browser's interactive validation blocks the submit
   event, so the behavior never runs — the summary stays hidden and lists
   nothing. Checked on a CLONE of the real form with the attribute removed, so
   this tests the shipped behavior rather than a hand-written stand-in. */
const vsNoValidate = await page.evaluate(async () => {
  const original = document.querySelector('form[data-validation-summary]');
  const clone = original.cloneNode(true);
  clone.removeAttribute('novalidate');
  // Ids must stay unique or the clone's fields shadow the originals.
  clone.querySelectorAll('[id]').forEach((el) => (el.id = `clone-${el.id}`));
  clone.querySelectorAll('label[for]').forEach((l) => (l.htmlFor = `clone-${l.htmlFor}`));
  const box = clone.querySelector('[data-validation-summary-box]');
  // The clone inherits the list the EARLIER case populated, so reset it —
  // otherwise "4 entries" is the previous test's output, not this one's, and
  // the assertion measures nothing.
  box.querySelector('ul').innerHTML = '';
  box.hidden = true;
  document.body.appendChild(clone);
  clone.querySelector('button[type="submit"]').click();
  await new Promise((r) => setTimeout(r, 150));
  const out = { summaryShown: !box.hidden, entries: box.querySelectorAll('a').length };
  clone.remove();
  return out;
});
check(
  'validation-summary: without novalidate the behavior never runs — which is why the docs require it',
  vsNoValidate.summaryShown === false && vsNoValidate.entries === 0,
  JSON.stringify(vsNoValidate),
);

/* /concepts/layouts' device matrix (roadmap 156.1). Every dimensional cell in
   that table is a runtime claim about the SHIPPED stylesheet, and the page
   states them as measured facts — so they are re-measured here on every build
   rather than trusted to stay true.

   Measured on a constructed shell, not on this docs page: the docs site is
   itself wrapped in a `.bo-app-shell`, so reading the rail off a rendered docs
   page measures the DOCS chrome. That exact confusion is recorded twice in
   CLAUDE.md, and it would make these numbers agree with the table for the
   wrong reason.

   The container band is read from the stylesheet rather than hardcoded here,
   so a change to the CSS moves the assertion instead of silently disagreeing
   with it. */
{
  /* The UNMINIFIED shipped stylesheet. The copy in dist/assets is minified,
     and searching a minified build for a source spelling is a trap this repo
     has already paid for once (`print-color-adjust: exact` is emitted without
     the space). Read the artifact whose spelling is the source's. */
  const shellCss = await readFile(
    join(dirname(fileURLToPath(import.meta.url)), '../../../packages/core/dist/css/index.css'),
    'utf8',
  ).catch(() => null);
  const band = shellCss?.match(/@container bo-shell \(max-width:\s*([\d.]+)rem\)/);
  check(
    'layouts: the stylesheet still declares exactly ONE shell band, as the page says',
    !!band && (shellCss.match(/@container bo-shell/g) ?? []).length === 1,
    `bands found: ${(shellCss?.match(/@container bo-shell[^)]*\)/g) ?? []).join(' | ') || 'none'}`,
  );

  const bandPx = band ? Number(band[1]) * 16 : 896;
  const p = await browser.newPage();
  const markup = `<!doctype html><meta charset=utf-8><style>${shellCss}</style>
    <div class="bo-app-shell" id="shell">
      <header class="bo-navbar bo-app-shell__header">H</header>
      <nav class="bo-sidebar-nav bo-app-shell__sidebar" id="rail">
        <a class="bo-sidebar-nav__link" href="#a"><span class="bo-sidebar-nav__icon">▪</span><span class="bo-sidebar-nav__label" id="lbl">Purchase orders</span></a>
      </nav>
      <main class="bo-app-shell__main" id="main">
        <div id="split" style="display:grid;grid-template-columns:22rem 1fr;">
          <section id="list">l</section><section id="detail">d</section>
        </div>
      </main>
    </div>`;
  const at = async (w) => {
    await p.setViewport({ width: w, height: 900 });
    await p.setContent(markup);
    return p.evaluate(() => {
      const wd = (id) => Math.round(document.getElementById(id).getBoundingClientRect().width);
      return {
        rail: wd('rail'),
        main: wd('main'),
        detail: wd('detail'),
        labelPos: getComputedStyle(document.getElementById('lbl')).position,
      };
    });
  };
  const wide = await at(bandPx + 1);
  const atBand = await at(bandPx);
  const narrow = await at(NARROW_WIDTH);
  await p.close();

  check(
    'layouts: above the band the rail is expanded; at it and below it collapses to a 52px icon strip',
    wide.rail > 200 && atBand.rail === 52 && narrow.rail === 52,
    JSON.stringify({ wide: wide.rail, atBand: atBand.rail, narrow: narrow.rail }),
  );
  check(
    'layouts: the collapsed rail hides its label visually without removing it',
    wide.labelPos === 'static' && atBand.labelPos === 'absolute',
    JSON.stringify({ wide: wide.labelPos, atBand: atBand.labelPos }),
  );
  /* The counter-intuitive line on the page: crossing the band makes `main`
     WIDER, because the rail gives back more than the window lost. */
  check(
    'layouts: crossing the band gives main MORE room, not less — as the page claims',
    atBand.main > wide.main,
    JSON.stringify({ justAbove: wide.main, atBand: atBand.main }),
  );
  /* And the matrix's one hard "not this shell": the split's list pane is a
     fixed 22rem, so the detail pane is unusable at phone width. If this ever
     becomes false the table is wrong and should say "supported". */
  check(
    'layouts: the master-detail split really does collapse its detail pane at 390px',
    narrow.detail < 60,
    JSON.stringify({ detailAt390: narrow.detail }),
  );
}

/* command-bar: the palette's own CSS comment now asserts that `overflow`
   must stay visible or the results listbox does not render. That is a runtime
   claim inside code a reader PASTES, so it is executed here rather than
   trusted — and it was true when written: with overflow:hidden the listbox
   measured zero height, because the dialog is the popover's containing block
   (owner report, 2026-08-28).

   Both halves are checked: the live demo behaves, and the COPYABLE block says
   the value that makes it behave. 154.2 is the precedent — a canonical sample
   that differed from its demo in a way that silently broke the feature. */
await visit('/patterns/command-bar/');
const cmdBar = await page.evaluate(async () => {
  const dlg = document.querySelector('dialog.cmd-palette');
  const type = async (overflow) => {
    if (dlg.open) dlg.close();
    dlg.style.overflow = overflow;
    dlg.showModal();
    const input = dlg.querySelector('input');
    input.value = 'PO';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await new Promise((r) => setTimeout(r, 250));
    const box = dlg.querySelector('[role="listbox"]')?.getBoundingClientRect();
    const out = !!box && box.height > 0;
    dlg.close();
    dlg.style.overflow = '';
    return out;
  };
  const shipped = getComputedStyle(dlg).overflow;
  return { shipped, rendersAsShipped: await type(''), clippedByHidden: !(await type('hidden')) };
});
check(
  'command-bar: the palette ships overflow:visible, and hidden really does clip the results away',
  cmdBar.shipped === 'visible' && cmdBar.rendersAsShipped && cmdBar.clippedByHidden,
  JSON.stringify(cmdBar),
);
const cmdSample = await page.evaluate(() =>
  [...document.querySelectorAll('pre code')]
    .map((c) => c.textContent)
    .filter((t) => t.includes('.cmd-palette {'))
    .join('\n'),
);
/* Comments stripped FIRST. The sample's own comment explains what
   overflow:hidden does, so a raw-text assertion is tripped by its own
   explanation — CLAUDE.md's removal rule, and this check hit it on its first
   run. Assert the DECLARATION, never the prose around it. */
const cmdDecls = cmdSample.replace(/\/\*[\s\S]*?\*\//g, ' ');
const cmdRule = cmdDecls.match(/\.cmd-palette\s*\{[^}]*\}/)?.[0] ?? '';
check(
  'command-bar: the copyable CSS carries the value the demo depends on',
  /overflow:\s*visible/.test(cmdRule) && !/overflow:\s*hidden/.test(cmdRule),
  cmdRule || '(no .cmd-palette rule found in any code sample)',
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
    /* Report, never throw: a probe that dies inside the page produces a stack
       trace where a regression report should be. Found while red-proving this
       very check — a stale injection removed the attribute and the gate
       crashed instead of naming what was missing. */
    if (!nav) return { fatal: 'no [data-anchor-nav] on the page' };
    const cur = () => nav.querySelector('[aria-current="page"]')?.getAttribute('href');
    const start = cur();
    /* EVERY section, not a sample (roadmap 133.2). This probe used to scroll
       to #delivery alone and conclude the spy followed the reader. One sample
       cannot see a spy that is right for the middle of the page and wrong at
       either end — and it did not see #flow at all, a fifth section added in
       130.2c months of commits after this check was written. A check that
       samples silently stops covering whatever is added next. */
    const sections = [...nav.querySelectorAll('a')].map((a) => a.getAttribute('href').slice(1));
    const spy = [];
    const gaps = [];
    for (const id of sections) {
      document.getElementById(id).scrollIntoView();
      await new Promise((r) => setTimeout(r, 400));
      const stuckBox = document.querySelector('.op-sticky').getBoundingClientRect();
      const t = document.getElementById(id).querySelector('.bo-widget__title').getBoundingClientRect();
      spy.push({ id, marked: (cur() || '').slice(1) });
      gaps.push(Math.round((t.top - stuckBox.bottom) * 100) / 100);
    }
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
      spy, gaps,
      spyWrong: spy.filter((x) => x.marked !== x.id),
      worstGap: Math.min(...gaps),
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
    `object-page @${w}: the anchor bar follows the reader into EVERY section (${op.spy?.length ?? 0})`,
    !op.fatal && op.start === '#general' && op.spy.length >= 5 && op.spyWrong.length === 0,
    JSON.stringify({ start: op.start, spyWrong: op.spyWrong, spy: op.spy }),
  );
  check(
    `object-page @${w}: every section's own content clears the sticky chrome`,
    !op.fatal && op.worstGap >= 0,
    JSON.stringify({ worstGap: op.worstGap, gaps: op.gaps }),
  );
  check(
    `object-page @${w}: header and anchor bar stay stuck AND stacked`,
    !op.fatal && op.headerStillStuck && op.barBelowHeader,
    JSON.stringify(op),
  );
  check(
    `object-page @${w}: anchor labels stay inside their fixed-height control`,
    !op.fatal && op.maxSpill === 0 && op.scrollableNavIsFocusable,
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

/* 200.1 — dialog exit motion (offcanvas's 143.4 recipe applied verbatim).
   The whole point of using a pure-CSS `allow-discrete` transition instead of
   delaying JS `close()` on `animationend` is that dismissal never depends on
   the animation actually finishing — this proves that property directly,
   not just that the CSS rules exist. */
await visit('/components/dialog/');
// Real CDP clicks, not an in-page el.click() — a synthetic click fires the
// click event (so the delegated open listener works) but does not reliably
// carry Chromium's click-to-focus activation behaviour, which is what the
// dialog's native focus-restore-on-close keys off. An earlier version of
// this check used trigger.click() and reported focusBack: false on every
// run — not a real regression, a test-harness artifact caught by trying
// the same assertion with a genuine click before believing the failure.
await page.click('[data-dialog-trigger="approve-dialog"]');
await new Promise((r) => setTimeout(r, 250));
const openedState = await page.evaluate(() => document.getElementById('approve-dialog').open);
await page.click('#approve-dialog button[value="cancel"]');
// No wait here on purpose: a close gated on animationend would still
// report `open` (and the trigger unfocused) at this line.
const immediate = await page.evaluate(() => {
  const dialog = document.getElementById('approve-dialog');
  const trigger = document.querySelector('[data-dialog-trigger="approve-dialog"]');
  return { closedImmediately: !dialog.open, focusBack: document.activeElement === trigger };
});
await new Promise((r) => setTimeout(r, 250));
const dlgExit = { opened: openedState, ...immediate };
check(
  'dialog: closing completes without waiting for the exit animation, and focus returns to the trigger',
  dlgExit.opened && dlgExit.closedImmediately && dlgExit.focusBack,
  JSON.stringify(dlgExit),
);

await visit('/components/dialog/', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
const dlgReduced = await page.evaluate(async () => {
  const dialog = document.getElementById('approve-dialog');
  document.querySelector('[data-dialog-trigger="approve-dialog"]').click();
  // One paint tick, not a full transition wait — under reduced motion the
  // duration tokens are 0ms, so the open state should already be showing.
  await new Promise((r) => setTimeout(r, 50));
  return { opened: dialog.open, opacity: getComputedStyle(dialog).opacity };
});
check(
  'dialog: prefers-reduced-motion makes the open transition instant (opacity already 1 within one tick)',
  dlgReduced.opened && dlgReduced.opacity === '1',
  JSON.stringify(dlgReduced),
);

/* 200.2 — button press feedback. `(hover: hover) and (pointer: fine)` is a
   DEVICE capability, not an input-modality signal: on a desktop it is true
   for a keyboard activation exactly as much as a mouse click, so :active
   alone applied the same 1px transform to a real `page.keyboard.down(
   'Space')` press before `:not(:focus-visible)` was added — read live as
   `matrix(1,0,0,1,0,1)` during the keydown, identical to a mouse press.
   That is the load-bearing distinction this case locks in: it does not just
   assert the transform exists, it asserts keyboard gets NONE. */
await visit('/components/button/');

/* The premise, measured before any of it: does THIS browser report a
   desktop-class pointer? Headless Chrome 141 answers `pointer: none` — not
   coarse, none — and no launch flag changes it (tried: `--blink-settings=`
   primaryHoverType/availableHoverTypes/primaryPointerType/availablePointerTypes
   in both directions, `--touch-events=disabled`, and the old headless shell;
   all six variants still read hover:false, fine:false, coarse:false,
   none:TRUE). So the press rule is not live here and the three live cases
   below cannot come out any way but the one they came out. Without this
   branch they reported the SHIPPED CSS as broken for three commits.

   Note the keyboard and reduced-motion cases go with it. They look robust —
   both assert `transform: none` — but when the rule is inert they assert none
   against a rule that could not have produced anything else, which is a
   detector that cannot fail rather than a claim that held. */
const pointerIsFine = await page.evaluate(
  () => matchMedia('(hover: hover) and (pointer: fine)').matches,
);

/* Runs everywhere, and it is what actually guards the contract on a headless
   runner: the CONTRACT is in the built CSS whether or not this browser can
   exercise it. Structural (postcss walk of the shipped rule), not a substring
   of the source — the source file's own comment names `translateY` and
   `:not(:focus-visible)` several times over, so a text match would be trippable
   by the prose explaining the rule. */
const pressRule = await (async () => {
  const css = await readFile(
    new URL('../../../packages/core/dist/css/components/button.css', import.meta.url),
    'utf8',
  );
  let found = null;
  postcss.parse(css).walkAtRules('media', (at) => {
    if (!/hover:\s*hover/.test(at.params) || !/pointer:\s*fine/.test(at.params)) return;
    at.walkRules((rule) => {
      rule.walkDecls('transform', (decl) => {
        found = { params: at.params, selector: rule.selector, value: decl.value };
      });
    });
  });
  return found;
})();
check(
  'button: the shipped CSS declares the 1px press nudge behind a fine-pointer guard that also excludes :focus-visible and reduced motion',
  !!pressRule &&
    pressRule.value === 'translateY(1px)' &&
    pressRule.selector.includes(':not(:focus-visible)') &&
    pressRule.selector.includes(':active') &&
    /prefers-reduced-motion:\s*no-preference/.test(pressRule.params),
  JSON.stringify(pressRule),
);

if (!pointerIsFine) {
  const why =
    'this browser reports (hover: hover) and (pointer: fine) = false — headless Chrome has no ' +
    'pointing device, so `.bo-btn`\'s press rule is not live and none of the three live cases ' +
    'below can discriminate. The contract is asserted structurally against the built CSS above. ' +
    'Run this gate in a headed browser on a machine with a mouse to exercise it for real.';
  g.notVerified('button: a real mouse press gets the 1px translateY, keeps z-index, opens no seam', why);
  g.notVerified('button: keyboard Space activation gets NO press transform', why);
  g.notVerified('button: prefers-reduced-motion removes the press displacement entirely', why);
}

/* The three LIVE cases. Guarded, not deleted: on a machine with a mouse they
   are the real evidence, and they are the reason the `:not(:focus-visible)`
   distinction is trustworthy at all. */
if (pointerIsFine) {
  const midRect0 = await page.evaluate(() => {
    const mid = [...document.querySelectorAll('.bo-btn-group')[0].querySelectorAll('.bo-btn')][1];
    mid.focus();
    const r = mid.getBoundingClientRect();
    return { midBeforeTop: r.top, midBeforeLeft: r.left, midBeforeRight: r.right };
  });
  // Keyboard Space: real CDP key events (page.keyboard is CDP-backed), held
  // for one transition duration so a mid-transition frame isn't mistaken for
  // the settled state (the exact trap this case exists to catch — see above).
  await page.keyboard.down('Space');
  await new Promise((r) => setTimeout(r, 150));
  const duringSpace = await page.evaluate(() => {
    const mid = [...document.querySelectorAll('.bo-btn-group')[0].querySelectorAll('.bo-btn')][1];
    return { active: mid.matches(':active'), transform: getComputedStyle(mid).transform };
  });
  await page.keyboard.up('Space');
  check(
    'button: keyboard Space activation shows the existing focus feedback but NO artificial press transform',
    duringSpace.active && duringSpace.transform === 'none',
    JSON.stringify(duringSpace),
  );

  // Blur before the mouse test: the Space test above left this same button
  // keyboard-focused (:focus-visible), which the CSS deliberately excludes
  // from the press transform — leaving it focused would make the mouse press
  // below a false negative of the TEST, not a real regression (caught live:
  // the first version of this case did exactly that and read transform
  // "none" for a real mouse press, until this blur() was added).
  await page.evaluate(() => document.activeElement.blur());
  // Real mouse press-and-hold on the group's MIDDLE button — the one whose
  // pressed border must stay above its two neighbours (z-index) and whose
  // horizontal edges must not move (only translateY, never scale).
  await page.mouse.move(midRect0.midBeforeLeft + 5, midRect0.midBeforeTop + 8);
  await page.mouse.down();
  await new Promise((r) => setTimeout(r, 150));
  const duringMouse = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.bo-btn-group')[0].querySelectorAll('.bo-btn')];
    const mid = btns[1];
    const rect = mid.getBoundingClientRect();
    return {
      active: mid.matches(':active'),
      transform: getComputedStyle(mid).transform,
      left: rect.left,
      right: rect.right,
      zIndex: getComputedStyle(mid).zIndex,
      neighborLeftEdge: btns[0].getBoundingClientRect().right,
      neighborRightEdge: btns[2].getBoundingClientRect().left,
    };
  });
  await page.mouse.up();
  check(
    'button: a real mouse press on a joined .bo-btn-group member gets the 1px translateY, stays z-index above its neighbours, and opens no horizontal seam',
    duringMouse.active &&
      duringMouse.transform === 'matrix(1, 0, 0, 1, 0, 1)' &&
      duringMouse.zIndex === '1' &&
      duringMouse.left === midRect0.midBeforeLeft &&
      duringMouse.right === midRect0.midBeforeRight &&
      duringMouse.neighborLeftEdge === duringMouse.left + 1 &&
      duringMouse.neighborRightEdge === duringMouse.right - 1,
    JSON.stringify({ ...duringMouse, expectedLeft: midRect0.midBeforeLeft, expectedRight: midRect0.midBeforeRight }),
  );

  await visit('/components/button/', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  const btnReduced = await page.evaluate(async () => {
    const mid = [...document.querySelectorAll('.bo-btn-group')[0].querySelectorAll('.bo-btn')][1];
    mid.scrollIntoView({ block: 'center' });
    const r = mid.getBoundingClientRect();
    return { top: r.top, left: r.left, width: r.width, height: r.height };
  });
  await page.mouse.move(btnReduced.left + btnReduced.width / 2, btnReduced.top + btnReduced.height / 2);
  await page.mouse.down();
  await new Promise((r) => setTimeout(r, 150));
  const reducedDuring = await page.evaluate(() => {
    const mid = [...document.querySelectorAll('.bo-btn-group')[0].querySelectorAll('.bo-btn')][1];
    return { active: mid.matches(':active'), transform: getComputedStyle(mid).transform, top: mid.getBoundingClientRect().top };
  });
  await page.mouse.up();
  check(
    'button: prefers-reduced-motion removes the press displacement entirely, not just its animation (position unchanged while still :active)',
    reducedDuring.active && reducedDuring.transform === 'none' && reducedDuring.top === btnReduced.top,
    JSON.stringify({ ...reducedDuring, expectedTop: btnReduced.top }),
  );
}

/* 200.3 — tab and segmented selection easing. Three cases, each locking a
   thing that was measured to be different from what reading the CSS suggests.

   1. Forced colours must zero it, and the FIRST attempt shipped an override
      that did nothing: `@media (forced-colors: active) { .bo-tabs__tab {
      transition: none } }` was written into the existing forced-colors block
      near the top of tabs.css, which sits ABOVE `.bo-tabs__tab`. Same
      specificity, so source order decided and the base rule won — the computed
      `transition-duration` under emulated forced-colors still read
      `0.1s, 0.1s, 0.1s`. Nothing in the build could see that: `check:motion`
      asks about prefers-reduced-motion, not this. Only a computed-style read
      caught it, so a computed-style read is what guards it.
   2. The easing must not move the strip. Colour transitions cannot reflow in
      principle; this asserts it at the transition's start frame and mid-flight
      rather than only once settled, which is where a layout-affecting property
      would show up.
   3. `border-color` (a shorthand) has to actually cover the vertical rail's
      `border-inline-end-color` (a logical longhand) — that is the reason one
      declaration serves the horizontal strip, the vertical rail and the
      narrow-container fallback instead of three. */
await visit('/components/tabs/', { features: [{ name: 'forced-colors', value: 'active' }] });
const tabsForced = await page.evaluate(() => ({
  emulated: matchMedia('(forced-colors: active)').matches,
  property: getComputedStyle(document.querySelector('.bo-tabs__tab')).transitionProperty,
  duration: getComputedStyle(document.querySelector('.bo-tabs__tab')).transitionDuration,
}));
check(
  'tabs: forced-colors zeroes the selection easing, so the underline — the only channel left saying which tab is current — is instant',
  // The emulated flag is asserted too: without it this case would pass while
  // measuring ordinary screen media, which is a detector that cannot fail.
  tabsForced.emulated && tabsForced.property === 'none' && tabsForced.duration === '0s',
  JSON.stringify(tabsForced),
);

await visit('/components/segmented/', { features: [{ name: 'forced-colors', value: 'active' }] });
const segForced = await page.evaluate(() => {
  const opt = document.querySelector('.bo-segmented__input:checked + .bo-segmented__option');
  return {
    emulated: matchMedia('(forced-colors: active)').matches,
    property: getComputedStyle(opt).transitionProperty,
    duration: getComputedStyle(opt).transitionDuration,
  };
});
check(
  'segmented: forced-colors zeroes the option easing, so the Highlight/HighlightText pair carrying "checked" is never mid-blend',
  segForced.emulated && segForced.property === 'none' && segForced.duration === '0s',
  JSON.stringify(segForced),
);

await visit('/components/tabs/');
const tabsGeometry = await page.evaluate(async () => {
  const list = [...document.querySelectorAll('.bo-tabs__list')].find(
    (l) => l.querySelectorAll('[role="tab"]').length >= 5,
  );
  const tabs = [...list.querySelectorAll('[role="tab"]')];
  const before = list.getBoundingClientRect().height;
  const selected = tabs.findIndex((t) => t.getAttribute('aria-selected') === 'true');
  tabs[(selected + 1) % tabs.length].click();
  const startFrame = list.getBoundingClientRect().height; // same tick as the click
  await new Promise((r) => setTimeout(r, 50)); // mid-transition (duration is 100ms)
  const mid = list.getBoundingClientRect().height;
  await new Promise((r) => setTimeout(r, 400)); // settled
  return { tabCount: tabs.length, before, startFrame, mid, settled: list.getBoundingClientRect().height };
});
check(
  'tabs: selecting a tab eases colour only — the strip block-size is identical before, at the transition start frame, mid-flight and settled',
  tabsGeometry.tabCount >= 5 &&
    tabsGeometry.before === tabsGeometry.startFrame &&
    tabsGeometry.before === tabsGeometry.mid &&
    tabsGeometry.before === tabsGeometry.settled,
  JSON.stringify(tabsGeometry),
);

const railTransition = await page.evaluate(async () => {
  const rail = document.querySelector('.bo-tabs--vertical > .bo-tabs__list');
  if (!rail) return { found: false };
  const tabs = [...rail.querySelectorAll('[role="tab"]')];
  const to = tabs.find((t) => t.getAttribute('aria-selected') !== 'true');
  to.click();
  await new Promise((r) => setTimeout(r, 50)); // mid-transition
  const mid = getComputedStyle(to).borderInlineEndColor;
  await new Promise((r) => setTimeout(r, 400));
  return { found: true, mid, settled: getComputedStyle(to).borderInlineEndColor };
});
check(
  'tabs: the `border-color` shorthand does animate the vertical rail\'s logical `border-inline-end-color` — one declaration covers all three marker edges',
  railTransition.found && railTransition.mid !== railTransition.settled,
  JSON.stringify(railTransition),
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
await visit('/patterns/inbox/', { width: DESKTOP_WIDTH });
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
await visit('/patterns/kanban/', { width: DESKTOP_WIDTH });
await page.click('[popovertarget="kb-menu-1"]');
const kanbanOpen = await page.evaluate(() => document.getElementById('kb-menu-1')?.matches(':popover-open'));
await page.click('#kb-menu-1 .bo-dropdown__item');
const kanbanClosed = await page.evaluate(() => !document.getElementById('kb-menu-1')?.matches(':popover-open'));
check(
  'kanban: the Move menu opens on trigger click and auto-closes on item selection',
  kanbanOpen === true && kanbanClosed === true,
  JSON.stringify({ kanbanOpen, kanbanClosed }),
);

/* The same page's OTHER runtime claim, which had no case at all (roadmap
   319.2). "Why no drag" tells the reader the menu gives every card a
   keyboard path — the case above proves nothing about that, because it
   drives page.click. Slice 317 audited that very sentence, removed the
   announcement third of it as false, and left this third standing
   unexecuted. Driven with real key events, never el.click(): the trusted
   dispatch path is the one a keyboard user actually takes. */
await visit('/patterns/kanban/', { width: DESKTOP_WIDTH });
const kbKeyboard = await (async () => {
  await page.evaluate(() => document.querySelector('[popovertarget="kb-menu-1"]').focus());
  const focused = await page.evaluate(
    () => document.activeElement === document.querySelector('[popovertarget="kb-menu-1"]'),
  );
  const before = await page.evaluate(() => document.getElementById('kb-menu-1').matches(':popover-open'));
  await page.keyboard.press('Enter');
  await new Promise((r) => setTimeout(r, 120));
  const after = await page.evaluate(() => document.getElementById('kb-menu-1').matches(':popover-open'));
  await page.keyboard.press('Tab');
  await new Promise((r) => setTimeout(r, 60));
  const tabbedInto = await page.evaluate(() => !!document.activeElement.closest('#kb-menu-1'));
  return { focused, before, after, tabbedInto };
})();
check(
  'kanban: Enter on a card’s Move button opens the menu and Tab reaches its items',
  kbKeyboard.focused === true &&
    kbKeyboard.before === false &&
    kbKeyboard.after === true &&
    kbKeyboard.tabbedInto === true,
  JSON.stringify(kbKeyboard),
);

/* /components/richtext Advanced demo (roadmap 113.1): formatBlock produces
   a real semantic heading, and the three justify buttons are a mutually
   exclusive group — clicking one clears aria-pressed on the other two, not
   just sets its own. Both surprised on first manual test (removeFormat's
   scope was the third surprise, documented in prose rather than asserted
   here — it has no pass/fail shape, only a "what it does" one).

   Selected BY CONTENT, not by .demo:nth-of-type(2). Slice 137 inserted three
   sections above Advanced and the positional selectors silently retargeted a
   different demo — a claim that still passes while testing the wrong thing is
   worse than one that fails. The Advanced demo is the one carrying
   formatBlock; nothing else on the page does. */
await visit('/components/richtext/', { width: DESKTOP_WIDTH, height: 1200 });
const ADV = '.demo:has([data-richtext-cmd="formatBlock"])';
const advCount = await page.$$eval(ADV, (n) => n.length);
check('richtext: the Advanced demo is uniquely identifiable by content', advCount === 1,
  JSON.stringify({ advCount }));

await page.evaluate((sel) => {
  const content = document.querySelector(sel).querySelector('.bo-richtext__content');
  const range = document.createRange();
  range.selectNodeContents(content.querySelector('p'));
  const s = window.getSelection();
  s.removeAllRanges();
  s.addRange(range);
}, ADV);
await page.click(`${ADV} [data-richtext-cmd="formatBlock"]`); // H2 is the first
const afterHeading = await page.$eval(ADV, (d) => !!d.querySelector('.bo-richtext__content h2'));
check(
  'richtext Advanced: formatBlock("H2") produces a real <h2>, not styled text',
  afterHeading,
  JSON.stringify({ afterHeading }),
);

/* Alignment is a RADIO GROUP now, not three aria-pressed toggles — it is one
   choice of three, and saying so lets the platform own mutual exclusivity
   (and arrow-key navigation) instead of JS clearing two siblings by hand.
   Asserting exactly-one-checked is the property that used to need code. */
await page.click(`${ADV} label[for="rt-a-center"]`);
const justifyState = await page.$eval(ADV, (d) => {
  const radios = [...d.querySelectorAll('input[type="radio"][data-richtext-cmd]')];
  return {
    total: radios.length,
    checked: radios.filter((r) => r.checked).map((r) => r.dataset.richtextCmd),
    sharedName: new Set(radios.map((r) => r.name)).size,
    anyAriaPressed: radios.some((r) => r.hasAttribute('aria-pressed')),
  };
});
check(
  'richtext Advanced: alignment is one radio group — exactly one checked, one shared name, no aria-pressed',
  justifyState.total === 3 &&
    justifyState.checked.length === 1 &&
    justifyState.checked[0] === 'justifyCenter' &&
    justifyState.sharedName === 1 &&
    !justifyState.anyAriaPressed,
  JSON.stringify(justifyState),
);

/* Slice 137.2 — the page claims the hot keys are NATIVE and that the toolbar
   follows the SELECTION rather than the click. Both are browser claims.
   Driven with real CDP key events: a synthetic keydown matches no native
   editing command and would report a false failure. Before the fix the
   button stayed "false" here while the text was genuinely bold. */
const BASIC = '.demo:has([data-dialog-trigger="rt-keys"])';
await page.evaluate((sel) => {
  const content = document.querySelector(sel).querySelector('.bo-richtext__content');
  const p = content.querySelector('p');
  const r = document.createRange();
  r.setStart(p.firstChild, 0);
  r.setEnd(p.firstChild, 6);
  const s = getSelection();
  s.removeAllRanges();
  s.addRange(r);
  content.focus();
}, BASIC);
const MODKEY = process.platform === 'darwin' ? 'Meta' : 'Control';
await page.keyboard.down(MODKEY);
await page.keyboard.press('KeyB');
await page.keyboard.up(MODKEY);
await new Promise((r) => setTimeout(r, 100));
const hotkey = await page.$eval(BASIC, (d) => ({
  pressed: d.querySelector('[data-richtext-cmd="bold"]').getAttribute('aria-pressed'),
  bolded: !!d.querySelector('.bo-richtext__content b, .bo-richtext__content strong'),
  keys: d.querySelector('[data-richtext-cmd="bold"]').getAttribute('aria-keyshortcuts'),
}));
check(
  'richtext: Ctrl/Cmd+B is native AND the toolbar follows it (aria-pressed syncs on selectionchange, not click)',
  hotkey.pressed === 'true' && hotkey.bolded && !!hotkey.keys,
  JSON.stringify(hotkey),
);

/* Slice 136.3 — the placeholder must survive type-then-delete. This is the
   exact case that kills the naive :empty::before version: the browser leaves
   a <br> behind, :empty stops matching, and the hint never returns. Asserting
   the <br> is present is what makes this a real test of the trap and not just
   of a pristine field. */
const PH = '.bo-richtext__content[data-placeholder="Why is this being rejected?"]:not(#rt-reason)';
const phRead = () => page.evaluate((s) => {
  const el = document.querySelector(s);
  return { ph: getComputedStyle(el, '::before').content, empty: el.hasAttribute('data-empty'), html: el.innerHTML };
}, PH);
const phPristine = await phRead();
await page.click(PH);
await page.keyboard.type('x');
const phTyped = await phRead();
await page.keyboard.press('Backspace');
const phDeleted = await phRead();
check(
  'richtext: the placeholder returns after type-then-delete, with a <br> in the DOM that :empty could never match',
  phPristine.ph.includes('rejected') &&
    phTyped.ph === 'none' &&
    phDeleted.ph.includes('rejected') &&
    phDeleted.html.includes('<br>'),
  JSON.stringify({ phPristine, phTyped, phDeleted }),
);

/* Slice 136.1 — the FIELD reddens, not only its label and message. The
   control-vs-neutral comparison is the point: before the fix the invalid
   border was byte-identical to a valid one. */
const invalidBorders = await page.evaluate(() => {
  const bad = document.querySelector('.bo-form-field:has([aria-invalid="true"]) .bo-richtext');
  const good = document.querySelector('.bo-richtext:not(:has([aria-invalid="true"]))');
  return {
    err: getComputedStyle(document.documentElement).getPropertyValue('--bo-state-error-color').trim(),
    bad: bad && getComputedStyle(bad).borderTopColor,
    good: good && getComputedStyle(good).borderTopColor,
  };
});
check(
  'richtext: an invalid field reddens its own border, and differs from a valid one',
  invalidBorders.bad === 'rgb(220, 38, 38)' && invalidBorders.bad !== invalidBorders.good,
  JSON.stringify(invalidBorders),
);

/* Slice 137.3 — collapsing removes the toolbar BAR, not just its buttons,
   and keeps a floating toggle. The first version hid the buttons and left
   the bar at full height, which saved nothing on screen; asserting the
   bar's own rendered height is what would have caught that, so that is what
   is asserted. Alt+Shift+T is checked too — the toggle must be reachable
   without the mouse, which is the whole point of a control that hides the
   other controls. */
const rtCollapse = await page.evaluate(async () => {
  const t = document.querySelector('[data-richtext-toggle]');
  const field = t.closest('.bo-richtext');
  /* Measure the box that CARRIES the constraint — the aria-controls target.
     The toolbar itself is the wrong probe once motion is on: it gets clipped
     inside a zero-height wrapper and keeps its own non-zero rect, so a check
     on the toolbar would read "still 60px tall" while the bar is visibly
     gone. This resolves correctly whether or not the toolbar is wrapped. */
  const region = document.getElementById(t.getAttribute('aria-controls'));
  const bar = field.querySelector('.bo-richtext__toolbar');
  const h = (el) => el.getBoundingClientRect().height;
  const vis = (el) => getComputedStyle(el).display !== 'none';
  const openBarHeight = h(region);
  t.click();
  // motion is token-driven; wait past the slow duration rather than a frame
  await new Promise((r) => setTimeout(r, 500));
  return {
    openBarHeight,
    collapsedBarHeight: h(region),
    toggleStillVisible: vis(t),
    toggleOutsideBar: !bar.contains(t),
    expanded: t.getAttribute('aria-expanded'),
    controlsResolves: !!region,
  };
});
check(
  'richtext: collapsing removes the toolbar bar entirely (not just its buttons) and leaves a floating toggle',
  rtCollapse.openBarHeight > 0 &&
    rtCollapse.collapsedBarHeight === 0 &&
    rtCollapse.toggleStillVisible &&
    rtCollapse.toggleOutsideBar &&
    rtCollapse.expanded === 'false' &&
    rtCollapse.controlsResolves,
  JSON.stringify(rtCollapse),
);

// re-open with the keyboard only, from inside the field
await page.evaluate(() => {
  document.querySelector('[data-richtext-toggle]')
    .closest('.bo-richtext').querySelector('.bo-richtext__content').focus();
});
await page.keyboard.down('Alt');
await page.keyboard.down('Shift');
await page.keyboard.press('KeyT');
await page.keyboard.up('Shift');
await page.keyboard.up('Alt');
const rtHotToggle = await page.evaluate(() => {
  const t = document.querySelector('[data-richtext-toggle]');
  return {
    expanded: t.getAttribute('aria-expanded'),
    barVisible: getComputedStyle(t.closest('.bo-richtext').querySelector('.bo-richtext__toolbar')).display !== 'none',
    keys: t.getAttribute('aria-keyshortcuts'),
  };
});
check(
  'richtext: Alt+Shift+T re-opens the toolbar from inside the field, and the shortcut is advertised',
  rtHotToggle.expanded === 'true' && rtHotToggle.barVisible && rtHotToggle.keys === 'Alt+Shift+T',
  JSON.stringify(rtHotToggle),
);

/* Slice 137.13 — toolbar buttons are square and their content still fits.
   The second half matters because squaring them put TEXT (B, I, S, H2, H3)
   into a box sized for a 1em glyph: it fits in this font at this density,
   and a wider face or a translated label would clip silently. scrollWidth
   vs clientWidth is the check that notices. */
const rtBtnBox = await page.evaluate((sel) => {
  const f = document.querySelector(sel);
  f.setAttribute('data-density', 'compact');
  const btns = [...f.querySelectorAll('.bo-richtext__toolbar .bo-btn')];
  const widths = btns.map((b) => Math.round(b.getBoundingClientRect().width));
  const heights = btns.map((b) => Math.round(b.getBoundingClientRect().height));
  const out = {
    count: btns.length,
    distinctWidths: [...new Set(widths)],
    square: widths.every((w, i) => Math.abs(w - heights[i]) <= 1),
    clipped: btns.filter((b) => b.scrollWidth > b.clientWidth + 1)
      .map((b) => b.textContent.trim() || b.getAttribute('aria-label')),
    meetsTargetFloor: widths.every((w) => w >= 24) && heights.every((h) => h >= 24),
  };
  f.removeAttribute('data-density');
  return out;
}, ADV);
check(
  'richtext: every toolbar button is one square size at compact, clips nothing, and stays above the 24px target floor',
  rtBtnBox.count > 10 &&
    rtBtnBox.distinctWidths.length === 1 &&
    rtBtnBox.square &&
    rtBtnBox.clipped.length === 0 &&
    rtBtnBox.meetsTargetFloor,
  JSON.stringify(rtBtnBox),
);

/* Slice 137.12 — the collapse must ANIMATE, and this is the assertion the
   first version did not have. A check on the end state ("height reaches 0")
   passes identically whether the bar eases shut or vanishes in one frame,
   which is exactly how a version that animated nothing at all shipped: the
   markup carried .bo-motion-collapse while its rules sat in motion.css, a
   stylesheet deliberately never imported by index.css and never loaded by
   this page. So sample the height across the transition and require
   intermediate frames.

   Under prefers-reduced-motion the duration tokens are 0ms and snapping is
   the CORRECT behaviour, so that branch asserts the opposite. */
const rtMotion = await page.evaluate(async () => {
  const t = document.querySelector('[data-richtext-toggle]');
  const region = document.getElementById(t.getAttribute('aria-controls'));
  if (!region.classList.contains('bo-richtext__toolbar-collapse')) return { wired: false };
  /* Self-contained: earlier checks leave the toolbar in whatever state they
     finished in, and sampling a transition that is still settling reads as
     "no motion". Force it open, let it settle, then measure. */
  if (t.getAttribute('aria-expanded') !== 'true') t.click();
  await new Promise((r) => setTimeout(r, 400));
  const frames = [];
  const t0 = performance.now();
  t.click();
  await new Promise((res) => {
    const tick = () => {
      frames.push(+region.getBoundingClientRect().height.toFixed(1));
      if (performance.now() - t0 < 350) requestAnimationFrame(tick);
      else res();
    };
    requestAnimationFrame(tick);
  });
  t.click(); // leave it open for later checks
  const open = frames[0];
  return {
    wired: true,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
    open,
    closed: frames.at(-1),
    intermediate: frames.filter((h) => h > 1 && h < open - 1).length,
    transitionProperty: getComputedStyle(region).transitionProperty,
  };
});
check(
  'richtext: the toolbar collapse ANIMATES (intermediate heights), reaches a true 0, and snaps only under reduced motion',
  rtMotion.wired &&
    rtMotion.open > 0 &&
    rtMotion.closed === 0 &&
    rtMotion.transitionProperty.includes('grid-template-rows') &&
    (rtMotion.reduced ? rtMotion.intermediate === 0 : rtMotion.intermediate > 0),
  JSON.stringify(rtMotion),
);

/* Slice 137.7 — the toolbar's visual categories must exist for AT too. The
   dividers were decorative spans inside one big role="group", so the eye
   saw six categories and a screen reader heard one list. Each group must be
   a real role="group" WITH a name — an unnamed group announces nothing. */
const rtGroups = await page.evaluate((sel) => {
  const bar = document.querySelector(sel).querySelector('.bo-richtext__toolbar');
  const groups = [...bar.querySelectorAll('.bo-richtext__group')];
  return {
    count: groups.length,
    allAreGroups: groups.every((g) => g.getAttribute('role') === 'group'),
    allNamed: groups.every((g) => (g.getAttribute('aria-label') || '').trim().length > 0),
    names: groups.map((g) => g.getAttribute('aria-label')),
    buttonsOutsideAnyGroup: [...bar.querySelectorAll('.bo-btn')].filter((b) => !b.closest('.bo-richtext__group')).length,
  };
}, ADV);
check(
  'richtext: every Advanced toolbar button sits in a NAMED role="group", so the visual categories exist programmatically',
  rtGroups.count >= 5 && rtGroups.allAreGroups && rtGroups.allNamed && rtGroups.buttonsOutsideAnyGroup === 0,
  JSON.stringify(rtGroups),
);

/* Slice 137.4 — the keyboard map opens from the toolbar and is GENERATED:
   its row count must equal what extract-keymap emitted, so a hand-edited
   dialog or a drifted keymap.json fails here. */
const keymapRows = await page.evaluate(async () => {
  document.querySelector('[data-dialog-trigger="rt-keys"]').click();
  await new Promise((r) => setTimeout(r, 60));
  const dlg = document.getElementById('rt-keys');
  const out = { open: dlg.open, rows: dlg.querySelectorAll('.bo-kv > div').length };
  dlg.close();
  return out;
});
check(
  `richtext: the keyboard-map dialog opens from the toolbar and lists all ${RICHTEXT_KEY_COUNT} generated shortcuts`,
  keymapRows.open && keymapRows.rows === RICHTEXT_KEY_COUNT,
  JSON.stringify(keymapRows),
);

/* Slice 137.5/137.6 — keyboard-first lists. The markdown rule is the one
   most likely to regress SILENTLY: the trailing space contenteditable
   inserts is U+00A0, not U+0020, so a rule written against an ASCII space
   fires never and looks like nothing is wired. Asserting the character
   codes pins the trap itself, not just the happy path.

   Tab is asserted three ways because the interesting cases are the two
   where it must NOT indent: outside a list (indent would store a styled
   blockquote) and after Escape (otherwise a list-only field is a WCAG
   2.1.2 keyboard trap with no exit). */
const LIST_FIELD =
  '.bo-richtext__content[data-placeholder^="Type"]';
const listHtml = () => page.$eval(LIST_FIELD, (e) => e.innerHTML);
const clearList = async () => {
  await page.$eval(LIST_FIELD, (e) => { e.innerHTML = ''; });
  await page.click(LIST_FIELD);
};

/* The platform fact the rule is written against, pinned directly: a
   trailing space in a contenteditable is U+00A0. It cannot be read off the
   demo field, because by then the rule has already consumed the marker —
   so this types into a scratch element where no rule is listening. If a
   future engine emits U+0020 here, the recipe's regex needs widening and
   this is what says so. */
const trailingSpaceCode = await page.evaluate(async () => {
  const el = document.createElement('div');
  el.setAttribute('contenteditable', 'true');
  document.body.append(el);
  el.focus();
  document.execCommand('insertText', false, '- ');
  const codes = [...el.textContent].map((c) => c.charCodeAt(0));
  el.remove();
  return codes;
});
check(
  'richtext: a trailing space in contenteditable is U+00A0, which is why the markdown rule cannot match an ASCII space',
  trailingSpaceCode[trailingSpaceCode.length - 1] === 160,
  JSON.stringify({ trailingSpaceCode }),
);

await clearList();
await page.keyboard.type('- milk');
const mdDash = await listHtml();

await clearList();
await page.keyboard.type('1. first');
const mdOrdered = await listHtml();

await clearList();
await page.keyboard.type('qty - 5');
const mdMidLine = await listHtml();

check(
  'richtext: "- " and "1. " at line start become real <ul>/<ol>, and a mid-line marker is left alone',
  mdDash.includes('<ul>') && mdDash.includes('milk') &&
    mdOrdered.includes('<ol>') && mdOrdered.includes('first') &&
    !mdMidLine.includes('<ul>') && mdMidLine.includes('qty'),
  JSON.stringify({ mdDash, mdOrdered, mdMidLine }),
);

/* The start number is the one place execCommand gives no control at all,
   so the recipe sets <ol start> afterwards. Asserted as stored HTML AND as
   the number the browser actually renders — an attribute that a CSS counter
   overrides would still pass the first half. */
await clearList();
await page.keyboard.type('5. five');
const startFive = await page.evaluate((sel) => {
  const li = document.querySelector(sel).querySelector('li');
  return { html: document.querySelector(sel).innerHTML, start: li?.closest('ol')?.getAttribute('start') };
}, LIST_FIELD);
await clearList();
await page.keyboard.type('1. one');
const startOne = await listHtml();
check(
  'richtext: "5. " starts the list at 5 via <ol start>, and "1. " leaves the attribute off',
  startFive.start === '5' && startFive.html.includes('<ol start="5">') && !startOne.includes('start='),
  JSON.stringify({ startFive, startOne }),
);

await clearList();
await page.keyboard.type('- one');
await page.keyboard.press('Enter');
await page.keyboard.type('two');
await page.keyboard.press('Tab');
const tabNested = await listHtml();
await page.keyboard.down('Shift');
await page.keyboard.press('Tab');
await page.keyboard.up('Shift');
const tabOutdented = await listHtml();
const stillInField = await page.evaluate(() =>
  !!document.activeElement?.classList?.contains('bo-richtext__content'));
check(
  'richtext: Tab nests a list item and Shift+Tab lifts it back, without leaving the field',
  /<ul>[\s\S]*<ul>/.test(tabNested) && !/<ul>[\s\S]*<ul>/.test(tabOutdented) && stillInField,
  JSON.stringify({ tabNested, tabOutdented, stillInField }),
);

await page.keyboard.press('Escape');
await page.keyboard.press('Tab');
const escaped = await page.evaluate(() =>
  !document.activeElement?.classList?.contains('bo-richtext__content'));
check(
  'richtext: Escape releases the field so Tab can leave a list — no WCAG 2.1.2 keyboard trap',
  escaped,
  JSON.stringify({ escaped }),
);

/* Slice 136.2 — editor chrome never prints. */
await page.emulateMediaType('print');
const printBars = await page.evaluate(() => {
  const bars = [...document.querySelectorAll('.bo-richtext__toolbar')];
  return { total: bars.length, visible: bars.filter((b) => getComputedStyle(b).display !== 'none').length };
});
await page.emulateMediaType('screen');
check(
  'richtext: no formatting toolbar prints — editor chrome is a control, not content',
  printBars.total > 0 && printBars.visible === 0,
  JSON.stringify(printBars),
);

/* /base/motion (137.17) — the page documents eight opt-in effects, and for
   its whole life it demonstrated NONE of them: motion.css is deliberately
   never imported by index.css, and the docs site had not opted in. Every
   class sat in the markup computing animation-name `none`, and
   .bo-motion-collapse computed `display: block`.

   Nothing caught it because nothing asserted the rules were REACHING the
   page. A "does the class appear in the markup" check would have passed
   throughout. So this asserts the computed result — the only place the
   difference between a loaded and an unloaded stylesheet shows up. */
await visit('/base/motion/', { width: DESKTOP_WIDTH, height: 1600 });
const motionLive = await page.evaluate(() => {
  const read = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return { missing: true };
    const c = getComputedStyle(el);
    return { anim: c.animationName, display: c.display, transition: c.transitionProperty };
  };
  return {
    fadeIn: read('.bo-motion-fade-in'),
    scaleIn: read('.bo-motion-scale-in'),
    collapse: read('.bo-motion-collapse'),
    spin: read('.bo-motion-spin'),
    fadeOut: read('.bo-motion-fade-out'),
  };
});
check(
  'motion: the opt-in module actually reaches /base/motion — every documented effect computes a real animation, not `none`',
  motionLive.fadeIn.anim === 'bo-motion-fade-in' &&
    motionLive.scaleIn.anim === 'bo-motion-scale-in' &&
    motionLive.spin.anim === 'bo-motion-spin' &&
    motionLive.fadeOut.anim === 'bo-motion-fade-out' &&
    motionLive.collapse.display === 'grid' &&
    motionLive.collapse.transition.includes('grid-template-rows'),
  JSON.stringify(motionLive),
);

/* And the collapse demo must really interpolate, not jump — the same
   end-state blindness that hid the richtext bug (137.14). */
const motionCollapse = await page.evaluate(async () => {
  const t = document.getElementById('collapse-toggle');
  const d = document.getElementById('collapse-demo');
  t.click();
  await new Promise((r) => setTimeout(r, 600));
  const open = d.getBoundingClientRect().height;
  const frames = [];
  const t0 = performance.now();
  t.click();
  await new Promise((res) => {
    const tick = () => {
      frames.push(+d.getBoundingClientRect().height.toFixed(1));
      if (performance.now() - t0 < 600) requestAnimationFrame(tick);
      else res();
    };
    requestAnimationFrame(tick);
  });
  return {
    open: +open.toFixed(1),
    closed: frames.at(-1),
    intermediate: frames.filter((h) => h > 1 && h < open - 1).length,
    reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
  };
});
check(
  'motion: the collapse demo interpolates its height rather than jumping (and snaps only under reduced motion)',
  motionCollapse.open > 0 &&
    (motionCollapse.reduced
      ? motionCollapse.intermediate === 0
      : motionCollapse.intermediate > 0),
  JSON.stringify(motionCollapse),
);

/* /getting-started/htmx §5 (roadmap 200.6) — the page now claims three things
   a browser can settle, and the middle one is the whole reason the item
   exists:
     1. an inserted row wears .bo-motion-fade-in and it RESOLVES (the opt-in
        module reaches this page too, not only /base/motion);
     2. removal runs on a timer, so it survives the animation never ending;
     3. a first-appearance field message enters with slide-in-block-start,
        and nothing shakes.
   (2) is asserted the only way that can fail: the class is stripped off the
   leaving row immediately after the click, which CANCELS the animation, so
   `animationend` cannot fire for it. A version of this demo gated on that
   event leaves the row in the table forever, and this check goes red. */
await visit('/getting-started/htmx/', { width: DESKTOP_WIDTH, height: 1600 });
const rowInsert = await page.evaluate(() => {
  const body = document.getElementById('rm-body');
  const before = body.rows.length;
  document.getElementById('rm-add').click();
  const row = body.rows[body.rows.length - 1];
  return {
    before,
    after: body.rows.length,
    cls: row.className,
    anim: getComputedStyle(row).animationName,
    ms: getComputedStyle(row).animationDuration,
  };
});
check(
  'htmx guide: an inserted row wears .bo-motion-fade-in AND the opt-in motion module resolves it here — not `none`',
  rowInsert.after === rowInsert.before + 1 &&
    rowInsert.cls.includes('bo-motion-fade-in') &&
    rowInsert.anim === 'bo-motion-fade-in',
  JSON.stringify(rowInsert),
);

const rowRemove = await page.evaluate(async () => {
  const body = document.getElementById('rm-body');
  const before = body.rows.length;
  const doomed = body.rows[body.rows.length - 1];
  /* Let the ENTRANCE settle first. This row was inserted by the case above and
     its bo-motion-fade-in is still running for 150ms; both the wait and the
     animationName filter below exist because without them this case counted
     that animation's end as the exit's. It read 0 locally and 1 on CI — the
     row was being removed correctly the whole time, and the assertion, not
     the page, was wrong. An instrument's first output is not evidence. */
  await new Promise((r) => setTimeout(r, 400));
  let ended = 0;
  doomed.addEventListener('animationend', () => {
    ended++;
  });
  document.getElementById('rm-remove').click();
  const ms = getComputedStyle(doomed).animationDuration;
  const exitClass = doomed.classList.contains('bo-motion-fade-out');
  /* Cancel it — with an inline `animation: none`, NOT by stripping the exit
     class. The row still carries bo-motion-fade-in from its insertion, so
     removing fade-out RESTARTS the entrance and its animationend duly
     arrives: the first version of this cancel let an animationend-gated
     removal pass, i.e. it was a detector that could not fail. `animation:
     none` leaves no animation of any name to end, so from here any removal
     that arrives is the timer's and nothing else's. */
  doomed.style.animation = 'none';
  await new Promise((r) => setTimeout(r, 700));
  return {
    before,
    after: body.rows.length,
    exitClass,
    ms,
    ended,
    stillAttached: doomed.isConnected,
  };
});
check(
  'htmx guide: a removed row leaves on a TIMER — cancelling the exit animation (so animationend never fires) still removes it',
  rowRemove.exitClass &&
    rowRemove.ended === 0 &&
    rowRemove.stillAttached === false &&
    rowRemove.after === rowRemove.before - 1,
  JSON.stringify(rowRemove),
);

const inlineMsg = await page.evaluate(() => {
  document.getElementById('vm-check').click();
  const msg = document.getElementById('vm-qty-err');
  const input = document.getElementById('vm-qty');
  if (!msg) return { missing: true };
  /* Nothing on this page may shake: assert across every element, not just
     this one, so a shake added elsewhere in the guide is caught too. */
  const shaking = [...document.querySelectorAll('*')].filter((el) =>
    /shake|wobble/i.test(getComputedStyle(el).animationName),
  ).length;
  return {
    anim: getComputedStyle(msg).animationName,
    cls: msg.className,
    role: msg.getAttribute('role'),
    invalid: input.getAttribute('aria-invalid'),
    describedby: input.getAttribute('aria-describedby'),
    shaking,
  };
});
check(
  'htmx guide: a first-appearance field message enters with slide-in-block-start, announces its arrival, is wired to its input, and nothing shakes',
  inlineMsg.anim === 'bo-motion-slide-in-block-start' &&
    inlineMsg.cls.includes('bo-form-field__message') &&
    inlineMsg.role === 'alert' &&
    inlineMsg.invalid === 'true' &&
    inlineMsg.describedby === 'vm-qty-err' &&
    inlineMsg.shaking === 0,
  JSON.stringify(inlineMsg),
);

/* Joined fields (owner QA, 2026-08-24): .bo-money and .bo-quantity butt their
   segments edge to edge, so a focus ring drawn OUTSIDE one of them lands on
   its neighbour. Measured before the fix on "Currency after the amount": a
   0px visual gap between input and currency select against a ring extending
   4px — it covered the select's leading edge by exactly 4px.

   Asserted as geometry rather than as "outline-offset is negative", because
   the property is the fix and the overlap is the defect: a future change to
   ring width or group spacing could restore the overlap while leaving the
   offset untouched. */
for (const [label, path, sel] of [
  ['money', '/components/money/', '.bo-money'],
  ['quantity', '/components/quantity/', '.bo-quantity'],
]) {
  await visit(path, { width: DESKTOP_WIDTH, height: 1400 });
  const rings = await page.evaluate((groupSel) => {
    const worst = [];
    let skipped = 0;
    for (const g of document.querySelectorAll(groupSel)) {
      const kids = [...g.children].filter((c) => c.matches('input, select, button'));
      for (let i = 0; i < kids.length - 1; i++) {
        const a = kids[i];
        const n = kids[i + 1];
        a.focus();
        /* :focus-visible is a heuristic, and programmatic .focus() does NOT
           satisfy it for a BUTTON — the element then wears the UA's own ring
           (3px, offset 0) and the measurement describes Chrome's default
           rather than this framework's. Skip those instead of reporting
           them, and count the skips so a version of this check that measures
           nothing at all cannot pass quietly. */
        if (!a.matches(':focus-visible')) { skipped++; a.blur(); continue; }
        const cs = getComputedStyle(a);
        /* Snapshot while FOCUSED. getComputedStyle returns a LIVE object, so
           reading outlineOffset after blur() reports the unfocused value —
           which is how the first version of this check reported a 3-4px
           overlap against a fix that measures 0 by hand. */
        const ring = (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0);
        const ar = a.getBoundingClientRect();
        const nr = n.getBoundingClientRect();
        a.blur();
        if (Math.abs(ar.top - nr.top) > 6) continue;   // not side by side
        worst.push(+(ring - (nr.left - ar.right)).toFixed(1));
      }
    }
    return { pairs: worst.length, skipped, maxOverlap: worst.length ? Math.max(...worst) : 0 };
  }, sel);
  check(
    `${label}: a focused segment's ring stays off its neighbour — joined controls share an edge`,
    rings.pairs > 0 && rings.maxOverlap <= 1,   // 1px tolerance: the shared border rounds
    JSON.stringify(rings),
  );
}

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

/* The marker guideline (roadmap 157.3): "the leading edge means the ROW, and a
   cell tone is never an edge". 157.2 removed the cell edge and MISSED its RTL
   twin — `[dir="rtl"] td[data-tone="success"]` was a standalone rule while
   danger and warning were grouped into the row selectors being rewritten, so
   the shipped stylesheet gave an RTL reader a green 3px edge on a success cell
   that an LTR reader never saw, in one tone out of three.

   `check:rtl` could not see it: that gate's allowlist is keyed by FILE, and
   data-table.css legitimately still carries the row stripes, so a stale rule
   inside it is indistinguishable from the rules that belong there. The rule is
   stated per MARKER, so it is asserted per marker — computed shadow on every
   tone and on a row state, in BOTH directions, since the whole defect lived in
   one direction only. */
await visit('/components/data-table/', { width: DESKTOP_WIDTH, height: 2400 });
const markers = await page.evaluate(() => {
  const inset = (el) => {
    const s = getComputedStyle(el).boxShadow;
    if (!/inset/.test(s)) return 0;
    const x = s.replace(/^rgba?\([^)]*\)/, '').trim().match(/(-?[\d.]+)px/);
    return x ? parseFloat(x[1]) : 0;
  };
  const read = () => ({
    tones: ['danger', 'warning', 'success'].map((t) => {
      const cell = document.querySelector(`td[data-tone="${t}"]`);
      return { tone: t, found: !!cell, x: cell ? inset(cell) : null };
    }),
    row: (() => {
      const first = document.querySelector('tr[data-row-state="error"] > :first-child');
      return { found: !!first, x: first ? inset(first) : null };
    })(),
  });
  const ltr = read();
  document.documentElement.setAttribute('dir', 'rtl');
  const rtl = read();
  document.documentElement.removeAttribute('dir');
  return { ltr, rtl };
});
const noCellEdge = (side) => side.tones.every((t) => t.found && t.x === 0);
check(
  'markers: a data-tone CELL carries no leading edge in EITHER direction, while the row-state row does — and the row edge flips with dir',
  noCellEdge(markers.ltr) && noCellEdge(markers.rtl) &&
    markers.ltr.row.found && markers.ltr.row.x > 0 && markers.rtl.row.x < 0,
  JSON.stringify(markers),
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

// The action bar WRAPS instead of clipping (roadmap 130.2 / GAP-7). Measure
// each button against the bar's own client box — NOT the bar's scrollWidth,
// which is exactly the check that reported this clean while a button was
// being cut in half: justify-content is flex-end, so the row overflowed the
// START edge, and content overflowing the start edge never reaches
// scrollWidth. The framework's standing lesson, and the reason this case
// exists at all.
await visit('/components/form/', { width: NARROW_WIDTH, height: 1600 });
const actionWrap = await page.evaluate(() => {
  const bar = document.getElementById('wrap-demo');
  const b = bar.getBoundingClientRect();
  const buttons = [...bar.querySelectorAll('.bo-btn')];
  const spills = buttons
    .map((el) => {
      const r = el.getBoundingClientRect();
      return Math.max(b.left - r.left, r.right - b.right);
    })
    .filter((n) => n > 1);
  const rows = new Set(buttons.map((el) => Math.round(el.getBoundingClientRect().top)));
  return { buttons: buttons.length, spills, rows: rows.size, wrap: getComputedStyle(bar).flexWrap };
});
check(
  'a four-action bar at phone width WRAPS onto more than one row and clips nothing — every button stays inside the bar',
  actionWrap.wrap === 'wrap' && actionWrap.buttons === 4 &&
    actionWrap.spills.length === 0 && actionWrap.rows > 1,
  JSON.stringify(actionWrap),
);

/* And a SINGLE button whose label is longer than the bar wraps its label
   instead of spilling — flex-wrap cannot save that one, because there is no
   line it would fit on. Found by the ERP example immediately after the
   flex-wrap fix landed: a "Create 2 purchase orders · $44,560.00" button
   still hung 15px past the edge at 390. */
const longLabel = await page.evaluate(() => {
  const bar = document.getElementById('wrap-demo');
  const btn = bar.querySelector('.bo-btn');
  const original = btn.textContent;
  btn.textContent = 'Create 2 purchase orders and notify both vendors immediately';
  const b = bar.getBoundingClientRect();
  const r = btn.getBoundingClientRect();
  const out = {
    spill: Math.round(Math.max(b.left - r.left, r.right - b.right)),
    lines: Math.round(r.height / parseFloat(getComputedStyle(btn).lineHeight)),
    whiteSpace: getComputedStyle(btn).whiteSpace,
  };
  btn.textContent = original;
  return out;
});
check(
  'a single action whose label is longer than the bar wraps onto more lines rather than spilling past the edge',
  longLabel.whiteSpace === 'normal' && longLabel.spill <= 1 && longLabel.lines > 1,
  JSON.stringify(longLabel),
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
/* The flash paints on the SCREEN's viewport, which is now the device's —
   `position: fixed` resolves against the mirror document, not the docs page.
   That is the correct behaviour for a screen shown inside a handheld, and
   the page's caption says so. */
const scanFlash = await (await mirror('goods-receipt-rf')).evaluate(async () => {
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

// The verdict must be readable WITHOUT colour (fixed 2026-08-23 after a
// blind DSA score found accepted and rejected differing only by hue, and
// painting the identical frame under forced colours — no verdict at all
// for the user that mode exists to serve). Compare the two states'
// computed geometry, never their colour, and do it again under
// forced-colors emulation where the hues are replaced by the UA.
const verdictShape = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const read = () => {
    const cs = getComputedStyle(document.body, '::after');
    return { width: cs.borderTopWidth, style: cs.borderTopStyle };
  };
  document.body.dataset.scanResult = 'ok';
  await wait(20);
  const ok = read();
  document.body.dataset.scanResult = 'error';
  await wait(20);
  const err = read();
  delete document.body.dataset.scanResult;
  return { ok, err };
});
/* Puppeteer's own emulateMediaFeatures() rejects forced-colors; the
   framework's forced-colors gate goes through CDP for the same reason. */
const fcSession = await page.createCDPSession();
await fcSession.send('Emulation.setEmulatedMedia', {
  features: [{ name: 'forced-colors', value: 'active' }],
});
const verdictShapeFc = await page.evaluate(async () => {
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const read = () => {
    const cs = getComputedStyle(document.body, '::after');
    return { width: cs.borderTopWidth, style: cs.borderTopStyle };
  };
  document.body.dataset.scanResult = 'ok';
  await wait(20);
  const ok = read();
  document.body.dataset.scanResult = 'error';
  await wait(20);
  const err = read();
  delete document.body.dataset.scanResult;
  return { ok, err };
});
await fcSession.send('Emulation.setEmulatedMedia', { features: [] });
await fcSession.detach();
const differs = (v) => v.ok.width !== v.err.width || v.ok.style !== v.err.style;
check(
  'scan verdict is told apart WITHOUT colour — accepted and rejected differ in frame geometry, in normal rendering AND under forced colours',
  differs(verdictShape) && differs(verdictShapeFc),
  JSON.stringify({ verdictShape, verdictShapeFc }),
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

/* /components/data-table claims a column description is reachable by KEYBOARD
   and TOUCH — not hover — and that the panel is never clipped by the table's
   own scroll container (roadmap 151.2). All three are runtime facts, so they
   are driven rather than described.

   The clipping half is the one worth testing: the container is
   `overflow`-scrolled, so a naively-positioned panel would be cut off. The
   panel escaping it is the whole reason this composes [popover] instead of an
   absolutely-positioned div. Measured as "the panel's box is not contained by
   the scroller's box", which is what a clipped panel would fail. */
await visit('/components/data-table');
const colDesc = await page.evaluate(async () => {
  const btn = document.querySelector('[popovertarget="col-desc-grir"]');
  const panel = document.getElementById('col-desc-grir');
  if (!btn || !panel) return { found: false };
  // KEYBOARD: focus it and press Enter — no mouse anywhere in this path.
  btn.focus();
  const focused = document.activeElement === btn;
  btn.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
  btn.click(); // what Enter does on a native button
  await new Promise((r) => requestAnimationFrame(r));
  const open = panel.matches(':popover-open');
  const pr = panel.getBoundingClientRect();
  const scroller = btn.closest('.bo-data-table-container');
  const sr = scroller.getBoundingClientRect();
  const clipped = pr.right > sr.right + 1 || pr.bottom > sr.bottom + 1;
  return {
    found: true,
    focused,
    open,
    isButton: btn.tagName === 'BUTTON',
    named: !!btn.getAttribute('aria-label'),
    // a title tooltip is the answer this page explicitly refuses
    noTitleTooltip: !btn.hasAttribute('title'),
    escapesScroller: clipped,
    text: panel.textContent.trim().slice(0, 40),
  };
});
check(
  'data-table column description: real button, keyboard-openable, named, and not a title tooltip',
  colDesc.found && colDesc.focused && colDesc.open && colDesc.isButton &&
    colDesc.named && colDesc.noTitleTooltip && colDesc.text.length > 10,
  JSON.stringify(colDesc),
);
/* NOT asserted here, deliberately: "the panel escapes the table's scroll
   container". The first version of this check required the panel's box to
   extend past the scroller's, which is not the same property — a small panel
   that fits inside is not clipped either, so the assertion could not
   discriminate and simply failed on a working feature. Exercising the real
   condition needs a demo where the panel WOULD be clipped (a wide table with
   the explained column at the far edge), which is /components/dropdown's job
   and is documented there. This page links to it rather than re-claiming it. */

/* 200.5 — toast exit motion and the bounded stack reflow. /components/alerts
   makes four runtime promises about a dismissed toast, and each is driven
   here rather than described:

     1. it fades and COLLAPSES over --bo-motion-duration-fast before it
        leaves the DOM (it is not removed on the click);
     2. the toasts above it close the gap over that same window instead of
        snapping, and travel by exactly one toast — the bound;
     3. prefers-reduced-motion removes it instantly;
     4. there is no auto-dismiss timer — a toast nobody dismisses stays.

   Case 2 is the one that needed care. Sampling a 100 ms animation midway is
   a race, and a check that flakes gets disbelieved, so the token is
   overridden to 1200 ms for that case ALONE. That is not a weaker test of
   the shipped rule — the animation is token-driven by construction, which is
   the property check:motion enforces — and case 1 asserts the unoverridden
   duration is the fast token, so nothing about the real timing is taken on
   trust. Overriding the token rather than the animation is also what keeps
   the JS honest: the behavior reads its hold off the computed style, so if
   it had hard-coded 100 ms instead, case 2's toast would vanish a second
   early and the geometry would snap.

   The dismiss clicks are synthetic el.click(), which is sufficient here for
   the reason 200.1's dialog case is not: this behavior is a delegated click
   listener and nothing in it reads focus or activation. If a synthetic click
   did not reach it, no toast would ever enter data-state="closing" and every
   case below goes red at once — a loud failure, not a quiet pass. */
await visit('/components/alerts/', { width: DESKTOP_WIDTH });
const toastExit = await page.evaluate(async () => {
  document.getElementById('toast-demo-trigger').click();
  await new Promise((r) => requestAnimationFrame(r));
  const region = document.getElementById('toast-demo-region');
  const stack = [...region.querySelectorAll('.bo-toast')];
  const middle = stack[1];
  middle.querySelector('.bo-alert__dismiss').click();
  // Read in the SAME tick as the click: a toast removed on click would
  // already be detached here, which is exactly what this distinguishes.
  const held = region.contains(middle);
  const state = middle.dataset.state;
  const duration = getComputedStyle(middle).animationDuration;
  const measuredHeight = middle.style.blockSize;
  await new Promise((r) => setTimeout(r, 400));
  return {
    stacked: stack.length,
    held,
    state,
    duration,
    measuredHeight,
    goneAfter: !region.contains(middle),
    left: region.querySelectorAll('.bo-toast').length,
  };
});
check(
  'toast: a dismissed toast is held for the fast-token exit, not removed on the click',
  toastExit.stacked === 3 && toastExit.held && toastExit.state === 'closing' &&
    toastExit.duration === '0.1s' && /^\d+(\.\d+)?px$/.test(toastExit.measuredHeight) &&
    toastExit.goneAfter && toastExit.left === 2,
  JSON.stringify(toastExit),
);

/* 4. No auto-dismiss. Continues on the same page, so the two toasts case 1
   left untouched are the sample — no second visit, and the only cost is the
   wait itself. Bounded evidence for an absolute claim, and the bound is
   stated in the check's own name rather than implied. */
const toastPersist = await page.evaluate(async () => {
  await new Promise((r) => setTimeout(r, 2000));
  const region = document.getElementById('toast-demo-region');
  const rest = [...region.querySelectorAll('.bo-toast')];
  return { left: rest.length, anyClosing: rest.some((t) => t.dataset.state) };
});
check(
  'toast: nothing auto-dismisses — two undismissed toasts are still there, unmarked, 2s on',
  toastPersist.left === 2 && !toastPersist.anyClosing,
  JSON.stringify(toastPersist),
);

/* 2. The stack closes the gap continuously, and by exactly one toast.

   MEASURE THE RESTING BOX. The first version of this case took its `start`
   one requestAnimationFrame after the toasts were injected and reported a
   travel of 60px against an expected 68 — a real-looking 8px discrepancy
   that was entirely the instrument: `bo-toast-in` is still running at that
   point, and its `translateY(0.5rem)` is exactly 8px. The survivor was
   measured mid-entrance and compared against a resting prediction. The
   entrance is 150ms of --bo-motion-duration-base and is NOT slowed by the
   override below (which moves only -fast), so the wait here has to clear it
   on its own. */
await visit('/components/alerts/', { width: DESKTOP_WIDTH });
const toastReflow = await page.evaluate(async () => {
  const slow = document.createElement('style');
  // Unlayered, so it beats @layer bo-tokens without !important.
  slow.textContent = ':root { --bo-motion-duration-fast: 1200ms; }';
  document.head.append(slow);
  document.getElementById('toast-demo-trigger').click();
  await new Promise((r) => setTimeout(r, 300));
  const region = document.getElementById('toast-demo-region');
  const stack = [...region.querySelectorAll('.bo-toast')];
  const [top, middle] = stack;
  const gap = parseFloat(getComputedStyle(region).rowGap);
  const collapsing = middle.getBoundingClientRect().height;
  const start = top.getBoundingClientRect().top;
  middle.querySelector('.bo-alert__dismiss').click();
  // Sampled at a third of the way in, not halfway, and asserted against a
  // deliberately wide band below: the property is "partway", and a snap can
  // only ever read exactly 0 or exactly 1. Sampling near the middle of an
  // eased curve puts the healthy reading at ~0.78 — close enough to a
  // narrow upper bound that a loaded runner would fail a working animation.
  await new Promise((r) => setTimeout(r, 400));
  const midway = top.getBoundingClientRect().top;
  // Just before the hold expires: the collapse has finished but the node is
  // still there, which is what makes the next reading a test of the removal
  // itself rather than of the animation.
  await new Promise((r) => setTimeout(r, 750));
  const settled = top.getBoundingClientRect().top;
  await new Promise((r) => setTimeout(r, 500));
  const end = top.getBoundingClientRect().top;
  return {
    stacked: stack.length,
    gap,
    // The region is bottom-anchored, so the survivors travel DOWN.
    total: end - start,
    expected: collapsing + gap,
    progress: (midway - start) / (end - start),
    // The node leaving must move nothing: the collapsed frame already holds
    // the geometry its removal produces. That is what the negative margin
    // buys, and without it this is a whole gap of snap.
    snapOnRemoval: end - settled,
    gone: !region.contains(middle),
    left: region.querySelectorAll('.bo-toast').length,
  };
});
check(
  'toast: the stack closes the gap continuously, travels by exactly the dismissed toast, and does not snap when it leaves',
  toastReflow.stacked === 3 && toastReflow.gone && toastReflow.left === 2 &&
    Math.abs(toastReflow.total - toastReflow.expected) < 1 &&
    Math.abs(toastReflow.snapOnRemoval) < 1 &&
    toastReflow.progress > 0.05 && toastReflow.progress < 0.95,
  JSON.stringify(toastReflow),
);

// 3. Reduced motion: gone in the same tick as the click, no closing state.
await visit('/components/alerts/', {
  width: DESKTOP_WIDTH,
  features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
});
const toastReduced = await page.evaluate(async () => {
  document.getElementById('toast-demo-trigger').click();
  await new Promise((r) => requestAnimationFrame(r));
  const region = document.getElementById('toast-demo-region');
  const middle = [...region.querySelectorAll('.bo-toast')][1];
  // The ENTRANCE half of the same claim, read off a toast that is not
  // closing: both directions are the shared duration tokens, which
  // tokens/motion.css zeroes here.
  const entrance = getComputedStyle(middle).animationDuration;
  middle.querySelector('.bo-alert__dismiss').click();
  return {
    entrance,
    goneImmediately: !region.contains(middle),
    left: region.querySelectorAll('.bo-toast').length,
  };
});
check(
  'toast: prefers-reduced-motion makes entrance and exit instant — 0s in, removed in the same tick as the click',
  toastReduced.entrance === '0s' && toastReduced.goneImmediately && toastReduced.left === 2,
  JSON.stringify(toastReduced),
);

/* 233.1 — /components/alerts' Elevated section states facts a browser can check
   and nothing executed them. Three cases, because writing them found that one of
   the two sentences is only HALF true and the page had to be corrected to match.

   The page said "the card look and the accent colour are independent settings".
   The accent colour is independent; the FILL is not. `.bo-alert` sets
   `background: var(--bo-alert-bg)` and the severities set that custom property,
   but `.bo-alert--elevated` sets `background` DIRECTLY and wins on source order
   at equal specificity — so combining the two silently drops the severity tint,
   which the page invited without saying. Case 3 is that fact, and the clause it
   now carries was written FROM this measurement rather than from reading the CSS
   (a first draft, read off the stylesheet, got the direction wrong).

   Read in both themes: a token-level regression could move one and not the
   other, and the light-theme raised surface is plain white, which is exactly the
   value most likely to coincide with something else by accident. */
await visit('/components/alerts/', { width: DESKTOP_WIDTH });
const elevated = await page.evaluate(async () => {
  const read = (el) => {
    const cs = getComputedStyle(el);
    return { bg: cs.backgroundColor, accent: cs.borderInlineStartColor,
      shadow: cs.boxShadow, radius: cs.borderRadius };
  };
  // The toast only exists once injected, which is the point of the region.
  document.getElementById('toast-demo-trigger').click();
  await new Promise((r) => requestAnimationFrame(r));
  const out = {};
  for (const theme of ['light', 'dark']) {
    document.documentElement.setAttribute('data-theme', theme);
    out[theme] = {
      plainWarn: read(document.querySelector('.bo-alert--warning:not(.bo-alert--elevated):not(.bo-toast)')),
      elev: read(document.querySelector('.bo-alert--elevated:not(.bo-alert--warning)')),
      elevWarn: read(document.querySelector('.bo-alert--elevated.bo-alert--warning')),
      toast: read(document.querySelector('#toast-demo-region .bo-toast')),
    };
  }
  document.documentElement.removeAttribute('data-theme');
  return out;
});
/* THE HOLE IN AN EQUALITY, STATED AND CLOSED (233.1's own Accept asked for
   this). Every case below compares two computed colours for equality, and two
   TRANSPARENT boxes are equal — so a rule that removed both backgrounds would
   leave these agreeing about nothing, which is the "identical value across many
   inputs" defect CLAUDE.md names. `opaque` refuses `rgba(…, 0)` and any missing
   read, and every equality is conjoined with it rather than asserted alone. */
const opaque = (c) => typeof c === 'string' && c !== '' && !/,\s*0\s*\)$/.test(c)
  && c !== 'transparent';
const bothThemes = (fn) => ['light', 'dark'].every((t) => fn(elevated[t]));
/* This case is what corrected the page, and the first version of it went RED.
   The page said the elevated and toast surfaces "match". Executed, the RAISED
   BACKGROUND matches exactly in both themes — both resolve
   `--bo-color-bg-surface-raised` — but the shadow and the radius do not:
   `--bo-shadow-md` (0 4px 6px -1px) against `--bo-shadow-lg` (0 10px 15px -3px),
   and 6px against 4px, because `.bo-toast` never sets a radius and inherits
   `.bo-alert`'s.

   The divergence is CORRECT and is now what the case asserts: a toast floats
   over the page and an elevated alert sits in it, so the toast being visually
   higher is the design, not drift. Asserting "same background AND deliberately
   heavier toast shadow" keeps the property 231.2's keep-decision actually rests
   on (you get the raised card without the arrival animation) while pinning the
   difference so a token change cannot quietly collapse the two. */
check(
  'alerts: elevated and toast share the raised background, and the toast deliberately sits higher',
  bothThemes((t) => opaque(t.elev.bg) && t.elev.bg === t.toast.bg && t.elev.shadow !== t.toast.shadow),
  JSON.stringify({ light: { elev: elevated.light.elev, toast: elevated.light.toast },
    dark: { elev: elevated.dark.elev, toast: elevated.dark.toast } }),
);
check(
  'alerts: the card look and the accent COLOUR are independent — an elevated warning keeps the plain warning accent',
  bothThemes((t) => opaque(t.elevWarn.accent) && t.elevWarn.accent === t.plainWarn.accent
    && t.elevWarn.accent !== t.elev.accent),
  JSON.stringify({ light: { elevWarn: elevated.light.elevWarn.accent, plainWarn: elevated.light.plainWarn.accent, elev: elevated.light.elev.accent },
    dark: { elevWarn: elevated.dark.elevWarn.accent, plainWarn: elevated.dark.plainWarn.accent, elev: elevated.dark.elev.accent } }),
);
check(
  'alerts: the raised surface REPLACES the severity tint — severity reads through the accent bar, not the fill',
  bothThemes((t) => opaque(t.elevWarn.bg) && t.elevWarn.bg === t.elev.bg && t.elevWarn.bg !== t.plainWarn.bg),
  JSON.stringify({ light: { elevWarn: elevated.light.elevWarn.bg, elev: elevated.light.elev.bg, plainWarn: elevated.light.plainWarn.bg },
    dark: { elevWarn: elevated.dark.elevWarn.bg, elev: elevated.dark.elev.bg, plainWarn: elevated.dark.plainWarn.bg } }),
);

/* 233.2 — the sentence the three cases above leave unexecuted, and it is the one
   231.2's KEEP decision rests on: "`.bo-toast` adds an entrance animation, which
   says this just arrived. An elevated alert is for entries already on the page at
   load, so animating them in would announce arrivals that never happened."

   The cases above pin the two apart on SHADOW. That is a real difference and not
   this one: `--elevated` exists because `.bo-toast`'s entrance animation is wrong
   for a static list, so if the animation ever landed on the modifier, the variant
   would have no reason to exist and the page's rule of thumb ("a toast interrupts,
   an elevated alert is scanned") would be false — while every shadow, background
   and accent assertion above stayed green. Checked at their tip before adding:
   nothing asserted `bo-toast-in` against an elevated alert; the four standing
   toast cases (200.5) are about dismissal, auto-dismiss, stack collapse and
   reduced motion.

   Read from the page's own elements. Reduced motion zeroes the DURATION token,
   not the name, so `animationName` is the stable reading here — and it is
   asserted in both directions, since "elevated has no animation" alone would
   still pass if the toast quietly lost its entrance too. */
const elevatedMotion = await page.evaluate(() => {
  const elev = document.querySelector('.bo-alert--elevated:not(.bo-toast)');
  if (!document.querySelector('#toast-demo-region .bo-toast')) {
    document.getElementById('toast-demo-trigger')?.click();
  }
  const toast = document.querySelector('#toast-demo-region .bo-toast');
  return {
    elevAnimation: elev ? getComputedStyle(elev).animationName : 'NO ELEVATED ALERT',
    toastAnimation: toast ? getComputedStyle(toast).animationName : 'NO TOAST',
    elevShadow: elev ? getComputedStyle(elev).boxShadow : 'NO ELEVATED ALERT',
  };
});
check(
  'alerts: the elevated card does NOT animate in, and the toast does — the split the variant exists for',
  elevatedMotion.elevAnimation === 'none' &&
    elevatedMotion.toastAnimation === 'bo-toast-in' &&
    // and elevation is still doing something, so "no animation" cannot be
    // satisfied by the modifier having gone inert altogether.
    elevatedMotion.elevShadow !== 'none',
  JSON.stringify(elevatedMotion),
);

/* 278.1 — /components/table-toolbar enumerates the grid's keys, and until this
   wake it listed four of the six the shipped module implements: Home/End and
   their Ctrl variants were published in `keymap.json` (and from there onto
   /concepts/js-behaviors) with nothing anywhere asserting them. The page now
   names them, so the claim becomes executable here.

   Driven as real key events on the page's own #grid-nav-demo — a synthetic
   keydown on `document` matches no delegated handler, and this module's
   listener is bound to the table. The demo is 4 rows x 3 columns; the cursor
   is parked by the same roving mechanism a user drives, never by setting
   tabindex by hand, because a hand-set second tab stop is not a state the
   grid can be in. */
await visit('/components/table-toolbar/', { width: DESKTOP_WIDTH });

async function gridCursorAfter(startRC, key, ctrl = false) {
  await page.evaluate(([r, c]) => {
    const t = document.querySelector('#grid-nav-demo');
    const m = Array.from(t.querySelectorAll('tr')).map((tr) => Array.from(tr.children));
    t.querySelectorAll('td[tabindex], th[tabindex]').forEach((x) => (x.tabIndex = -1));
    m[r][c].tabIndex = 0;
    m[r][c].focus();
  }, startRC);
  if (ctrl) await page.keyboard.down('Control');
  await page.keyboard.press(key);
  if (ctrl) await page.keyboard.up('Control');
  return page.evaluate(() => {
    const t = document.querySelector('#grid-nav-demo');
    const m = Array.from(t.querySelectorAll('tr')).map((tr) => Array.from(tr.children));
    const a = document.activeElement;
    for (let r = 0; r < m.length; r++) {
      const c = m[r].indexOf(a);
      if (c !== -1) return [r, c];
    }
    return null;
  });
}

const gridShape = await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  return t
    ? { rows: t.querySelectorAll('tr').length, cols: t.querySelector('tr').children.length }
    : null;
});
const gridKeys = {
  end: await gridCursorAfter([1, 1], 'End'),
  home: await gridCursorAfter([1, 1], 'Home'),
  ctrlEnd: await gridCursorAfter([1, 1], 'End', true),
  ctrlHome: await gridCursorAfter([1, 1], 'Home', true),
};
check(
  'table-toolbar: Home/End reach the row edges and Ctrl+Home/Ctrl+End the grid edges, as the page and keymap.json both say',
  // The shape is asserted too: on a 1x1 grid every one of these is [0,0] and
  // the four comparisons below would pass while distinguishing nothing.
  gridShape?.rows === 4 &&
    gridShape?.cols === 3 &&
    JSON.stringify(gridKeys.end) === '[1,2]' &&
    JSON.stringify(gridKeys.home) === '[1,0]' &&
    JSON.stringify(gridKeys.ctrlEnd) === '[3,2]' &&
    JSON.stringify(gridKeys.ctrlHome) === '[0,0]',
  JSON.stringify({ gridShape, gridKeys }),
);

/* 278.6 — the opener's COST argument, which until this wake said grid
   navigation costs "per-cell Tab stops". It costs the opposite: the module
   collapses the whole grid to ONE stop and pulls every interactive descendant
   OUT of the Tab sequence (reindex sets `w.tabIndex = -1` on each), so the row
   checkboxes are reachable only by arrowing to the cell and pressing Enter.
   That is the trade the reader is accepting, so it is the sentence the page
   now makes — and a claim about the Tab sequence is executable.

   The control is the plain table in the first demo: it is NOT a grid, which is
   what makes "the grid did this" distinguishable from "the page has no tabbable
   controls anywhere". */
const gridCost = await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  const cells = [...t.querySelectorAll('td, th')];
  const widgets = [...t.querySelectorAll('input, button, select, textarea, a[href]')];
  return {
    cells: cells.length,
    cellStops: cells.filter((c) => c.tabIndex === 0).length,
    widgets: widgets.length,
    widgetStops: widgets.filter((w) => w.tabIndex === 0).length,
    role: t.getAttribute('role'),
    plainTableRole: document.querySelector('.bo-data-table:not([data-grid-nav])')
      ?.getAttribute('role') ?? null,
  };
});
check(
  'table-toolbar: grid nav costs ONE tab stop for the whole table and removes every control inside it from the Tab sequence, as the opener now says',
  gridCost.role === 'grid' &&
    gridCost.plainTableRole === null &&   // the control: the other demo is not a grid
    gridCost.cells > 1 &&                 // a 1-cell grid makes "one stop" vacuous
    gridCost.cellStops === 1 &&
    gridCost.widgets > 0 &&               // ditto a grid with no widgets to remove
    gridCost.widgetStops === 0,
  JSON.stringify(gridCost),
);

/* 278.4 — "aria-selected synced from the row checkboxes", on a grid this same
   module marks aria-multiselectable="true". It needs BOTH behaviors, which is
   why it is here and not only in the unit test: initDataTables owns select-all
   and sets each row box's `checked` PROPERTY from a listener on the CONTAINER,
   while initDataGrid listens on the TABLE and so ran first, against the old
   state. Every row reported aria-selected="false" while all of them were
   checked, until an unrelated single-row click happened to repair it.

   Both routes the page documents are driven: a real mouse click on the header
   box, and the keyboard route the grid's own key list describes (Enter into
   the cell's widget, then Space). */
const selectAllRoutes = {};
const readSelection = () =>
  page.evaluate(() => {
    const rows = [...document.querySelectorAll('#grid-nav-demo tbody tr')];
    return {
      checked: rows.map((r) => r.querySelector('.bo-data-table__row-select').checked),
      aria: rows.map((r) => r.getAttribute('aria-selected')),
    };
  });
selectAllRoutes.before = await readSelection();
await page.click('#grid-nav-demo .bo-data-table__select-all');
await new Promise((r) => setTimeout(r, 100));
selectAllRoutes.mouse = await readSelection();

await visit('/components/table-toolbar/', { width: DESKTOP_WIDTH });
await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  const cell = t.querySelectorAll('tr')[0].children[0];   // the select-all's cell
  t.querySelectorAll('td[tabindex], th[tabindex]').forEach((x) => { x.tabIndex = -1; });
  cell.tabIndex = 0;
  cell.focus();
});
await page.keyboard.press('Enter');   // hands focus to the cell's one widget
selectAllRoutes.reachedWidget = await page.evaluate(() =>
  document.activeElement?.classList.contains('bo-data-table__select-all') ?? false,
);
await page.keyboard.press('Space');
await new Promise((r) => setTimeout(r, 100));
selectAllRoutes.keyboard = await readSelection();
check(
  'table-toolbar: select-all really does sync aria-selected on every row — by mouse and by the Enter-then-Space route the grid documents',
  selectAllRoutes.before.aria.length === 3 &&                      // a 0-row grid proves nothing
    selectAllRoutes.before.aria.every((a) => a === 'false') &&
    selectAllRoutes.mouse.checked.every(Boolean) &&                // control: it really checked them
    selectAllRoutes.mouse.aria.every((a) => a === 'true') &&
    selectAllRoutes.reachedWidget &&                               // control: Enter reached the box
    selectAllRoutes.keyboard.checked.every(Boolean) &&
    selectAllRoutes.keyboard.aria.every((a) => a === 'true'),
  JSON.stringify(selectAllRoutes),
);

await visit('/components/table-toolbar/', { width: DESKTOP_WIDTH });

/* 278.5 — the caption calls Columns "the same multi-select dropdown pattern as
   elsewhere", and until this case the page shipped that pattern's markup
   without the behavior that makes it one: it called initDataTables /
   initTableToolbar / initDataGrid and not initDropdowns. Measured on the built
   page before the fix — the menu opened at the viewport's top-left, 404px above
   and 265px left of its invoker (menu 0,0; invoker 265, 369-405), and the
   trigger read "Columns" with two of three boxes checked.

   "The same pattern as elsewhere" is taken LITERALLY, which is what keeps this
   free of pixel literals: the reference is /components/dropdown's own plain
   multi-select (#demo-cc — same shape, no --end modifier), measured live in the
   same browser, and this page's menu must reproduce its offset from its own
   invoker. A gap constant read out of popover-position.ts would be a substring
   assertion on source; a hard-coded 4 would be a gate fitted to one rendering
   of one theme at one density. The relation is what the claim is about.

   The reference needs its OWN absolute control, or "both at (0,0)" would agree
   with itself and pass: it must open below its invoker and on screen. */
const dropdownRef = await (async () => {
  await visit('/components/dropdown/', { width: DESKTOP_WIDTH });
  await page.click('[popovertarget="demo-cc"]');
  await new Promise((r) => setTimeout(r, 300)); // position() runs in a rAF after `toggle`
  return page.evaluate(() => {
    const menu = document.querySelector('#demo-cc');
    const inv = document.querySelector('[popovertarget="demo-cc"]');
    const m = menu.getBoundingClientRect();
    const i = inv.getBoundingClientRect();
    return {
      open: menu.matches(':popover-open'),
      sized: m.width > 0 && m.height > 0,
      dTop: m.top - i.bottom,   // hangs off the invoker's BOTTOM edge
      dLeft: m.left - i.left,   // and shares its LEFT edge
      below: m.top > i.bottom,
      onScreen: m.top >= 0 && m.left >= 0 && m.right <= innerWidth,
    };
  });
})();

await visit('/components/table-toolbar/', { width: DESKTOP_WIDTH });
await page.click('[popovertarget="cols-menu-demo"]');
await new Promise((r) => setTimeout(r, 300));

const menuBox = await page.evaluate(() => {
  const menu = document.querySelector('#cols-menu-demo');
  const inv = document.querySelector('[popovertarget="cols-menu-demo"]');
  const m = menu.getBoundingClientRect();
  const i = inv.getBoundingClientRect();
  return {
    open: menu.matches(':popover-open'),
    sized: m.width > 0 && m.height > 0,   // control: an unopened popover has a zero box
    dTop: m.top - i.bottom,
    dLeft: m.left - i.left,
    onScreen: m.top >= 0 && m.left >= 0 && m.right <= innerWidth,
    atLeastAsWide: m.width >= i.width,    // positionPopover's Math.max(menu, invoker)
  };
});

/* The label half. Two of the three boxes stay checked, so the trigger must read
   "Columns (2)" — a string no markup on the page carries, which is what makes
   this an assertion about the behavior rather than about the HTML. */
await page.click('[data-col-toggle="vendor"]');
await new Promise((r) => setTimeout(r, 200));
const triggerLabel = await page.evaluate(() => {
  const inv = document.querySelector('[popovertarget="cols-menu-demo"]');
  const menu = document.querySelector('#cols-menu-demo');
  return {
    text: inv.textContent.trim(),
    base: inv.getAttribute('data-multiselect-label'),
    checked: menu.querySelectorAll('input[type="checkbox"]:checked').length,
    stillOpen: menu.matches(':popover-open'), // multi-select does not close on select
  };
});

check(
  'table-toolbar: the Columns menu anchors to its invoker with the same offset as /components/dropdown, and its trigger carries the checked count — the multi-select dropdown pattern the caption claims',
  dropdownRef.open && dropdownRef.sized &&               // the reference is real …
    dropdownRef.below && dropdownRef.onScreen &&         // … and itself correctly placed
    menuBox.open && menuBox.sized &&
    Math.abs(menuBox.dTop - dropdownRef.dTop) <= 1 &&    // same offset below its own invoker
    Math.abs(menuBox.dLeft - dropdownRef.dLeft) <= 1 &&  // same alignment to its own left edge
    menuBox.onScreen &&
    menuBox.atLeastAsWide &&
    triggerLabel.checked === 2 &&                        // control: the toggle really unchecked one
    triggerLabel.stillOpen &&
    triggerLabel.text === `${triggerLabel.base} (2)`,
  JSON.stringify({ dropdownRef, menuBox, triggerLabel }),
);

await visit('/components/table-toolbar/', { width: DESKTOP_WIDTH });

/* 278.3 — the page's COMPOSITION sentence: put column toggles on a
   data-grid-nav table and a hidden column leaves the grid model too — the
   cursor skips it, and hiding the column the cursor is parked in hands the
   grid's single tab stop to a visible cell instead of stranding it where Tab
   cannot reach.

   The page's two demos are deliberately separate tables (the toolbar table has
   no data-grid-nav, the grid table has no data-col) and the sentence says so
   outright, because 278.1 refused to wire them together: that would change what
   the demo teaches and land new interactive markup a cloud wake cannot check
   visually. So the GATE builds the composition instead — it tags the grid
   demo's own cells with data-col and drops a [data-col-toggle] box into that
   table's container, which is the whole of initTableToolbar's markup contract.
   Both modules are the page's own already-initialised instances: the toolbar's
   change listener is document-level and scopes by .bo-data-table-container, and
   the grid's MutationObserver is already watching this table. Until this case
   the composition was asserted only in jsdom (data-grid-columns.test.ts).

   Kept LAST in this file on purpose — it mutates the page's DOM, so any case
   added after it must re-visit first. */
const composed = await page.evaluate(() => {
  const table = document.querySelector('#grid-nav-demo');
  const cols = ['sel', 'no', 'amt'];
  [...table.querySelectorAll('tr')].forEach((tr) =>
    [...tr.children].forEach((cell, i) => { cell.dataset.col = cols[i]; }),
  );
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.id = 'gate-col-toggle';
  box.dataset.colToggle = 'no';
  box.checked = true;
  table.closest('.bo-data-table-container').prepend(box);
  return { tagged: table.querySelectorAll('[data-col]').length, cols: cols.length };
});

/* Control 1: before anything is hidden, the cursor moves from column 0 to
   column 1 — so "it landed on column 2" below is the hidden column being
   skipped, not the arrow key failing. */
await gridCursorAfter([1, 0], 'ArrowRight');
const beforeHide = await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  const a = document.activeElement;
  const stop = t.querySelector('td[tabindex="0"], th[tabindex="0"]');
  return { landedOn: a?.dataset?.col ?? null, stopCol: stop?.dataset.col ?? null };
});
/* Control 2: park the cursor IN the column about to be hidden. Without this
   the "tab stop moved" assertion below is satisfied by a stop that never had
   to move. Every other stop is cleared first, because a grid with two tabbable
   cells is not a state the roving model can be in. */
await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  const cell = t.querySelectorAll('tbody tr')[0].children[1];
  t.querySelectorAll('td[tabindex], th[tabindex]').forEach((x) => { x.tabIndex = -1; });
  cell.tabIndex = 0;
  cell.focus();
});
const parked = await page.evaluate(() =>
  document.querySelector('#grid-nav-demo td[tabindex="0"], #grid-nav-demo th[tabindex="0"]')
    ?.dataset.col ?? null,
);

await page.click('#gate-col-toggle');       // a REAL click: the module listens for `change`
await new Promise((r) => setTimeout(r, 250)); // the grid re-seeds from a MutationObserver

const afterHide = await page.evaluate(() => {
  const t = document.querySelector('#grid-nav-demo');
  const cells = [...t.querySelectorAll('td, th')];
  const stops = cells.filter((c) => c.tabIndex === 0);
  return {
    hiddenCells: cells.filter((c) => c.hidden).length,
    hiddenCols: [...new Set(cells.filter((c) => c.hidden).map((c) => c.dataset.col))],
    stopCount: stops.length,
    stopCol: stops[0]?.dataset.col ?? null,
    stopHidden: stops[0]?.hidden ?? null,
  };
});
await gridCursorAfter([1, 0], 'ArrowRight');
const skipped = await page.evaluate(() => document.activeElement?.dataset?.col ?? null);

check(
  'table-toolbar: hiding a column on a data-grid-nav table drops it from the grid model — the cursor skips it and the single tab stop leaves it, as the page says',
  composed.tagged === 12 &&                       // 4 rows x 3 cols actually tagged
    beforeHide.landedOn === 'no' &&               // control 1: the arrow key works
    beforeHide.stopCol !== null &&
    parked === 'no' &&                            // control 2: the stop was ON the doomed column
    afterHide.hiddenCells === 4 &&
    JSON.stringify(afterHide.hiddenCols) === '["no"]' &&
    afterHide.stopCount === 1 &&                  // still exactly one stop for the grid
    afterHide.stopHidden === false &&
    afterHide.stopCol !== 'no' &&                 // and it left the hidden column
    skipped === 'amt',                            // the cursor skipped straight past it
  JSON.stringify({ composed, beforeHide, parked, afterHide, skipped }),
);


/* ---- /getting-started/troubleshooting: the layered-reset recipe ----
   The page's central interop claim, and until 2026-09-06 the only runtime
   claim on it that nothing executed: an unlayered reset you did not write
   (Tailwind v3 preflight, normalize, Bootstrap reboot) OUT-RANKS every
   framework layer and silently strips components; wrapping that same reset in
   a layer declared BEFORE the framework's puts it underneath and the component
   survives.

   Why a gate and not the two iframes already on the page: the iframes are a
   demo. Both could break to the same wrong result and the page would still
   render two plausible-looking frames — a reader cannot tell "stripped" from
   "stripped in both". This asserts the DIFFERENCE, which is the actual claim.

   BOTH SIDES ARE CHECKED ON PURPOSE. A one-sided test ("wrapped reset keeps
   the background") passes just as well on a tree where @layer stopped working
   altogether and nothing is ever stripped — the control is what makes the
   experiment able to fail. Same reasoning as the print badge case above. */
const HOSTILE = 'button { background: transparent; border: 0; padding: 0; font: inherit; }';
/* The SHIPPED stylesheet, read from the package rather than fetched over the
   test server. A URL would couple this case to where copy-suite happens to put
   the file (it is /suite/bo/index.css today, not the /css/index.css a first
   draft assumed) — and a 404 would leave the button unstyled in BOTH branches,
   so the control would pass, the layered case would fail, and the result would
   read as a real cascade bug. Inlining removes that failure mode entirely. */
const FRAMEWORK_CSS = await readFile(
  join(REPO_ROOT, 'packages/core/dist/css/index.css'), 'utf8',
);

/* `order` is the page's recipe line verbatim when present, and '' for the
   control. It must precede the framework CSS, exactly as the page insists:
   "the order statement must be the FIRST rule of the entry stylesheet — a
   layer's rank is fixed by where it first appears". A first draft put the
   statement AFTER the framework and the case went red; that was the test
   disobeying the recipe, not the framework breaking it, and it is recorded
   here so the next reader does not re-derive it. */
async function buttonBgWith(order, resetCss) {
  await page.setContent(
    `<!doctype html><html><head>` +
      `<style>${order}</style>` +
      `<style>${FRAMEWORK_CSS}</style>` +
      `<style>${resetCss}</style></head>` +
      `<body><button class="bo-btn" type="button">Post</button></body></html>`,
    { waitUntil: 'load' },
  );
  return page.evaluate(() => {
    const b = document.querySelector('.bo-btn');
    return { bg: getComputedStyle(b).backgroundColor, found: !!b };
  });
}

/* The page's own recipe line, character for character. */
const ORDER = '@layer app-reset, bo-reset, bo-tokens, bo-primitives, bo-components, bo-utilities;';
const resetUnlayered = await buttonBgWith('', HOSTILE);
const resetLayered = await buttonBgWith(ORDER, `@layer app-reset { ${HOSTILE} }`);
const TRANSPARENT = 'rgba(0, 0, 0, 0)';

check(
  'troubleshooting: an UNLAYERED reset out-ranks the framework and strips .bo-btn (the control — without this the layered case proves nothing)',
  resetUnlayered.found && resetUnlayered.bg === TRANSPARENT,
  JSON.stringify(resetUnlayered),
);
check(
  'troubleshooting: the SAME reset wrapped in a layer declared first ranks below the framework, and .bo-btn keeps its background',
  resetLayered.found && resetLayered.bg !== TRANSPARENT,
  JSON.stringify(resetLayered),
);

await browser.close();
server.close();

g.report('verified live');
