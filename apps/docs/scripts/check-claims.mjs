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
import { resolveChrome } from './resolve-chrome.mjs';
import { serveDist } from './serve-dist.mjs';

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const { server, port, base } = await serveDist(dist);
const browser = await puppeteer.launch({ executablePath: resolveChrome(), headless: 'new', protocolTimeout: 60000 });
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

await browser.close();
server.close();

const failed = results.filter((r) => !r.pass);
for (const r of failed) console.log(`FAIL ${r.claim}\n     ${r.detail}`);
if (failed.length) {
  console.error(`claims check FAILED — ${failed.length} of ${results.length} documented behaviours do not hold`);
  process.exit(1);
}
console.log(`claims check passed — ${results.length} documented behaviours verified live`);
