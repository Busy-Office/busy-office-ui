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
import puppeteer from 'puppeteer-core';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveChrome, chromeArgs } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const { server, port, base } = await serveDist(dist);
const browser = await puppeteer.launch({ executablePath: resolveChrome(), args: chromeArgs(), headless: 'new', protocolTimeout: 60000 });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
const url = (p) => `http://localhost:${port}${base}${p}`;
const results = [];
const check = (claim, pass, detail) => results.push({ claim, pass, detail });

// "Cancel restores the row's values and re-fires input events, so
//  derived totals revert with it." — editable-grid / concurrency
await page.goto(url('/patterns/editable-grid/'), { waitUntil: 'networkidle0' });
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
await page.goto(url('/components/data-table/'), { waitUntil: 'networkidle0' });
const loading = await page.evaluate(() => {
  const t = document.querySelector('table[data-loading="true"]');
  return t ? { pointerEvents: getComputedStyle(t).pointerEvents, ariaBusy: t.getAttribute('aria-busy') } : { missing: true };
});
check('data-loading blocks interaction', loading.pointerEvents === 'none', JSON.stringify(loading));

// "Skip the swatch grid" — the 264-button bypass must land after the grid.
await page.goto(url('/base/colors/'), { waitUntil: 'networkidle0' });
const skip = await page.evaluate(() => {
  const link = document.querySelector('.scale-skip');
  const target = document.getElementById(link?.getAttribute('href')?.slice(1) ?? '');
  const grid = document.querySelector('.scale-grid');
  return { hasLink: !!link, targetExists: !!target, after: !!(target && grid && grid.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) };
});
check('Skip link bypasses the swatch grid', skip.hasLink && skip.targetExists && skip.after, JSON.stringify(skip));

// "Read-only content needs tabindex=0 to stay reachable and scrollable."
await page.goto(url('/components/richtext/'), { waitUntil: 'networkidle0' });
const ro = await page.evaluate(() => ({
  tabindex: document.querySelector('.bo-richtext--readonly .bo-richtext__content')?.getAttribute('tabindex'),
}));
check('Read-only rich text is keyboard-reachable', ro.tabindex === '0', JSON.stringify(ro));

// "? opens the shortcuts dialog — and never steals the key while typing."
await page.goto(url('/reference/keyboard/'), { waitUntil: 'networkidle0' });
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
await page.goto(url('/patterns/invoice-list/'), { waitUntil: 'networkidle0' });
await page.emulateMediaType('print');
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

await page.goto(url('/components/approval-workflow/'), { waitUntil: 'networkidle0' });
await page.emulateMediaType('print');
await new Promise((r) => setTimeout(r, 200));
const marker = await page.evaluate(() => {
  const m = document.querySelector('.bo-timeline__marker');
  return m ? { bg: getComputedStyle(m).backgroundColor, adjust: getComputedStyle(m).printColorAdjust } : { bg: 'NO ELEMENT' };
});
check('print: timeline markers keep their fill', marker.bg !== 'rgba(0, 0, 0, 0)' && marker.adjust === 'exact', JSON.stringify(marker));

// Media emulation is per-PAGE and sticky: leaving it on 'print' silently
// corrupts every claim added below. It cost a real debugging round —
// @media print hides .bo-data-table__toolbar, so a keyboard claim counting
// tab stops to the bulk actions measured zero and looked like a page bug.
await page.emulateMediaType('screen');

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
await page.goto(url('/patterns/invoice-list/'), { waitUntil: 'networkidle0' });
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

// "Measured from the first row: three presses" — the page states a NUMBER,
// so the number is gated. Adding any focusable control to the toolbar or the
// header row changes it, and a stale count in a keyboard walkthrough is the
// same defect as a stale sort direction. (My first version of this sentence
// said "two, the scroll container is a stop" — inferred from the CSS and
// wrong; the real path is sort button → select-all → toolbar.)
// Fresh load: the assertions above leave selection and focus state behind,
// and this one counts tab stops, which that state changes.
await page.goto(url('/patterns/invoice-list/'), { waitUntil: 'networkidle0' });
await page.evaluate(() => {
  document.querySelectorAll('tbody .bo-data-table__row-select')[0].click();
});
await new Promise((r) => setTimeout(r, 200));
await page.evaluate(() => document.querySelectorAll('tbody .bo-data-table__row-select')[0].focus());
let presses = 0;
for (let i = 1; i <= 10; i++) {
  await page.keyboard.down('Shift');
  await page.keyboard.press('Tab');
  await page.keyboard.up('Shift');
  const inBulk = await page.evaluate(() => !!document.activeElement.closest('.bo-data-table__bulk-actions'));
  if (inBulk) { presses = i; break; }
}
check('first row is three Shift+Tabs from the bulk actions, as documented', presses === 3, `presses=${presses}`);

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
await page.goto(url('/patterns/detail-form/'), { waitUntil: 'networkidle0' });
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

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
for (const r of failed) console.log(`FAIL ${r.claim}\n     ${r.detail}`);
if (failed.length) {
  console.error(`claims check FAILED — ${failed.length} of ${results.length} documented behaviours do not hold`);
  process.exit(1);
}
console.log(`claims check passed — ${results.length} documented behaviours verified live`);
