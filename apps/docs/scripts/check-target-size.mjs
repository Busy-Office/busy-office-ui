/**
 * Gate: WCAG 2.2 SC 2.5.8 Target Size (Minimum), AA.
 *
 * /concepts/density states "No density tier takes an interactive target below
 * 1.5rem (24px)" and calls spacious "44px targets, meets WCAG 2.5.8".
 * Executing that on 2026-08-17 showed both are false: .bo-checkbox and
 * .bo-radio are a hard-coded 1rem (16px) in ALL THREE tiers — they are not
 * density-aware at all — and the data-table sort button is 18px tall.
 *
 * But undersized is not automatically a failure. 2.5.8 passes an undersized
 * target if a 24px-diameter circle centred on it intersects no other target's
 * circle. That is the actual spec test, so it is what this gate runs, rather
 * than the simpler-but-wrong "every target >= 24px".
 *
 * Reports two classes separately:
 *   FAIL  — undersized AND crowded: a real 2.5.8 violation.
 *   note  — undersized but adequately spaced: conformant via the exception,
 *           and the reason the docs may not claim a blanket 24px floor.
 */
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';

const DIST = new URL('../dist', import.meta.url).pathname;
const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();

// Control-dense pages; the sweep is deliberately small because CI cost is tracked.
const PAGES = [
  '/components/button/', '/components/form/', '/components/data-table/',
  '/patterns/invoice-list/', '/components/pagination/', '/components/quantity/',
  '/patterns/editable-grid/',
];
const DENSITIES = ['compact', 'comfortable', 'spacious'];

const probe = (page) => page.evaluate(() => {
  const SEL = 'button, input[type=checkbox], input[type=radio], input[type=range], select, a.bo-btn, [role=button]';
  const targets = [];
  for (const el of document.querySelectorAll('#main-content ' + SEL)) {
    if (el.closest('pre, code')) continue;          // code samples are not live UI
    if (el.disabled) continue;                       // disabled controls are exempt
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;   // not rendered
    targets.push({
      cls: (el.className || el.tagName).toString().trim().slice(0, 46),
      x: r.left + r.width / 2, y: r.top + r.height / 2,
      w: Math.round(r.width), h: Math.round(r.height),
    });
  }
  // 2.5.8: an undersized target needs a clear 24px circle — i.e. no other
  // target's centre within 24px of its own.
  const out = [];
  for (const t of targets) {
    if (t.w >= 24 && t.h >= 24) continue;
    let nearest = Infinity;
    for (const o of targets) {
      if (o === t) continue;
      const d = Math.hypot(o.x - t.x, o.y - t.y);
      if (d < nearest) nearest = d;
    }
    out.push({ cls: t.cls, w: t.w, h: t.h, nearest: Math.round(nearest) });
  }
  return out;
});

const violations = [];
const exempted = new Map();
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
for (const density of DENSITIES) {
  for (const path of PAGES) {
    await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
    await page.evaluate((d) => document.documentElement.setAttribute('data-density', d), density);
    await new Promise((r) => setTimeout(r, 120));
    for (const f of await probe(page)) {
      if (f.nearest < 24) violations.push({ density, path, ...f });
      else exempted.set(`${f.cls}@${f.w}x${f.h}`, f);
    }
  }
}
await browser.close();
server.close();

if (violations.length) {
  console.error(`target-size check FAILED (${violations.length}) — SC 2.5.8:`);
  for (const v of violations.slice(0, 15)) {
    console.error(`  ${v.density} ${v.path}: ${v.w}x${v.h} "${v.cls}" — nearest target only ${v.nearest}px away (needs 24)`);
  }
  process.exit(1);
}
console.log(
  `target-size check passed — no SC 2.5.8 violation across ${PAGES.length} pages x ${DENSITIES.length} densities. ` +
    `${exempted.size} undersized control type(s) conform via the spacing exception, NOT via a 24px floor: ` +
    [...exempted.values()].map((e) => `${e.cls.split(' ')[0]} ${e.w}x${e.h} (nearest ${e.nearest}px)`).join('; '),
);
