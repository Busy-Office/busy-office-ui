// Gate: long translations must wrap, never clip.
//
// /concepts/i18n claims "table headers wrap, they do not truncate" and
// "buttons size to content", and names compact density in the longest
// locale as the combination that breaks first. This runs that exact
// combination: every visible string expanded (the German/Finnish worst case;
// the per-word factor is deliberately higher than 35% because pages
// heavy in short words and code blocks dilute the page-level ratio), density forced to compact, at desktop and
// phone width. A failure is either real clipping (content wider than a
// box that hides its overflow) or the shell scroller overflowing.
//
// Red-proved when written: injecting one max-inline-size:20px button
// produced 10 findings. Note that auto table layout IGNORES max-width on
// cells — an early red test injected there, saw nothing, and would have
// shipped a detector that could not fail.
//
// @exact — measures rendered expansion in a real browser. Exempt from --self-test: there is no
// judgement to get wrong, and ceremony around a lookup is noise.
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { DIST } from './paths.mjs';

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();

// Text-dense screens where expansion bites: tables, forms, toolbars, nav.
// Widened after a full-site sweep (Standardize 2026-08-17) found a
// SECOND instance of the class on a page this list did not cover —
// .bo-segmented could not wrap. A hand-picked list only guards the
// pages someone thought of; these are the component/pattern families
// where expansion actually bites, plus the two that already failed.
const PAGES = [
  '/components/data-table/', '/components/form/', '/patterns/invoice-list/',
  '/components/dashboard/', '/components/navbar/', '/patterns/approval/',
  '/reference/tokens/', '/components/kv/', '/components/segmented/',
  '/components/filters/', '/components/tabs/', '/components/stepper/',
  '/patterns/settings-admin/', '/patterns/record-detail/',
];
const findings = [];
let minExpansion = Infinity;

for (const path of PAGES) {
  for (const width of [1440, 390]) {
    await page.setViewport({ width, height: 1000 });
    await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0' });
    const before = await page.evaluate(() => document.querySelector('main')?.innerText.length ?? 0);
    const after = await page.evaluate(() => {
      document.documentElement.setAttribute('data-density', 'compact');
      const EXPAND = (t) => t.replace(/\b(\w{3,})\b/g, (w) => w + 'ë' + w.slice(0, Math.ceil(w.length * 0.55)));
      const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      for (const n of nodes) {
        if (n.parentElement?.closest('pre, code, script, style')) continue;
        if (n.textContent.trim().length > 1) n.textContent = EXPAND(n.textContent);
      }
      return document.querySelector('main').innerText.length;
    });
    if (before > 0) minExpansion = Math.min(minExpansion, after / before - 1);
    await new Promise((r) => setTimeout(r, 250));
    const probe = await page.evaluate(() => {
      const scroller = document.querySelector('.bo-app-shell__main') ?? document.documentElement;
      const clipped = [];
      for (const el of scroller.querySelectorAll('th, td, button, .bo-badge, label, .bo-sidebar-nav__label, .bo-navbar__brand, dt, dd')) {
        const cs = getComputedStyle(el);
        if ((cs.overflowX === 'hidden' || cs.textOverflow === 'ellipsis') && el.scrollWidth > el.clientWidth + 1) {
          clipped.push({ cls: (el.className || el.tagName).toString().slice(0, 40), text: el.textContent.trim().slice(0, 25), by: el.scrollWidth - el.clientWidth });
        }
      }
      // name the widest offender — "28px of overflow" is unactionable
      // without it (CI found one my machine's narrower fonts did not).
      let widest = null;
      const edge = scroller.getBoundingClientRect().right;
      for (const el of scroller.querySelectorAll('*')) {
        const r = el.getBoundingClientRect();
        if (r.right > edge + 1 && (!widest || r.right > widest.right)) {
          if (!el.closest('.bo-data-table-container, .scale-scroll, pre')) {
            widest = { right: Math.round(r.right), cls: (el.className || el.tagName).toString().slice(0, 50), text: el.textContent.trim().slice(0, 30) };
          }
        }
      }
      return { overflow: scroller.scrollWidth - scroller.clientWidth, clipped, widest };
    });
    if (probe.overflow > 2 || probe.clipped.length) findings.push({ path, width, ...probe });
  }
}
await browser.close();
server.close();

for (const f of findings) {
  console.log(`FAIL ${f.path} @${f.width}: overflow ${f.overflow}px, ${f.clipped.length} clipped element(s)`);
  if (f.widest) console.log(`     widest: ${f.widest.cls} "${f.widest.text}" reaching ${f.widest.right}px`);
  for (const c of f.clipped.slice(0, 3)) console.log(`     ${c.cls} "${c.text}" clipped by ${c.by}px`);
}
if (findings.length) {
  console.error(`pseudo-locale check FAILED — ${findings.length} page/width combination(s) clip or overflow`);
  process.exit(1);
}
console.log(`pseudo-locale check passed — ${PAGES.length} pages x 2 widths at compact density, text expanded ≥${Math.round(minExpansion * 100)}%, nothing clipped`);
