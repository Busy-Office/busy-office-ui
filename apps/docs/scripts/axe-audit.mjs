// axe-core scan of every docs page, at both harness widths, PLUS one rule axe
// cannot express: an input whose only accessible name comes from `placeholder`
// (see the in-page comment below — placeholder feeds the name computation, so
// axe passes it).
//   npm run build -w docs && npm run test:axe -w docs
// Exits 1 on any violation. First run 2026-08-15 found 7 pages; all fixed.
//
// Serves dist itself via the shared base-aware server. It used to require a
// hand-started container on :8081, which is why it could only ever be run by
// hand — and it duly drifted red unnoticed (2026-08-17). It is a CI gate now,
// and a gate may not depend on a human having started something.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { distPages } from './dist-pages.mjs';
import { DIST } from './paths.mjs';
import { WIDTHS } from './viewports.mjs';

const AXE = readFileSync(new URL('../../../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8');

const pages = (await distPages(DIST)).map((p) => p.url);

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const summary = {};
// Both harness widths — see viewports.mjs for why these two.

async function scan(path, page) {
  for (const [i, width] of WIDTHS.entries()) {
    await page.setViewport({ width, height: 900 });
    // networkidle0 on the FIRST width only. Dropping it entirely (waitUntil
    // 'load') looked like a free 2x once and made the gate FLAKY: axe's
    // color-contrast rule needs rendered styles settled, and on JS-styled
    // controls (the wizard's next button) it fired a false serious violation
    // in 1 run out of 8. So the load wait stays exactly as strict as it was.
    //
    // What changed (roadmap 28.1) is that the SECOND width no longer reloads
    // the same URL: styles are already settled, resizing only reflows, and a
    // frame to let container queries land is enough. Same 81 pages at the same
    // two widths — this is not sampling. Stability was checked rather than
    // assumed: 3 consecutive local runs, identical results each time.
    let res = null;
    if (i === 0) {
      res = await page.goto(`http://localhost:${port}${base}${path}`, { waitUntil: 'networkidle0', timeout: 20000 });
    } else {
      await new Promise((r) => setTimeout(r, 80));
    }
    // 304 = browser cache revalidation (legitimate on a repeat same-session
    // navigation, e.g. re-running the scan after a fix) — only a real
    // non-2xx/304 status means the page didn't actually load.
    // Only the navigating pass has a response to judge; the resize pass is
    // looking at a page whose status was already accepted above.
    if (i === 0 && (!res || ![200, 304].includes(res.status()))) {
      summary[`${path}@${width}`] = [{ id: 'HTTP-' + (res && res.status()) }];
      continue;
    }
    const r = await page.evaluate(async () => {
      const out = (await window.axe.run(document, { resultTypes: ['violations'] })).violations
        .map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length,
                     sample: v.nodes[0]?.target?.join(' ') }));
      /* One rule axe cannot express (roadmap 27.5). `placeholder` CONTRIBUTES
         to the accessible name computation, so axe's label rule passes an
         input whose only name is a placeholder — and it did, on four inputs
         across two component pages, one of which I had shipped myself. A
         placeholder is not a label: it is not reliably announced and it
         disappears the moment the user types (WCAG 3.3.2, 4.1.2). */
      const unnamed = [];
      for (const el of document.querySelectorAll('#main-content input, #main-content textarea, #main-content select')) {
        if (el.closest('pre')) continue;                 // code samples are text
        if (el.type === 'hidden' || el.type === 'submit' || el.type === 'button') continue;
        const named =
          el.getAttribute('aria-label')?.trim() ||
          el.getAttribute('aria-labelledby') ||
          el.closest('label') ||
          (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`));
        if (named) continue;
        const leaning = el.getAttribute('placeholder') || el.getAttribute('title');
        unnamed.push({
          id: 'placeholder-only-name',
          impact: 'serious',
          nodes: 1,
          sample: `${el.className || el.tagName}${leaning ? ` (placeholder: "${leaning}")` : ' (no name at all)'}`,
        });
      }
      return [...out, ...unnamed];
    });
    if (r.length) summary[`${path}@${width}`] = r;
    process.stderr.write('.');
  }
}

/* Same tab pool the layout sweep uses — this gate was written serially and
   became the single most expensive step in CI (178s of a 348s run, over half
   the total, and the reason CI went 2m50s -> 5m55s when it landed). One
   pattern for both browser sweeps, not a second invention.
   axe-core is also injected via evaluateOnNewDocument ONCE PER TAB instead of
   re-parsing ~500kB on all 162 navigations. */
const POOL = 4;
const queue = [...pages.sort()];
await Promise.all(Array.from({ length: POOL }, async () => {
  const page = await browser.newPage();
  await page.evaluateOnNewDocument(AXE);
  while (queue.length) {
    const path = queue.shift();
    if (path) await scan(path, page);
  }
  await page.close();
}));

await browser.close();
server.close();

/* Every sibling gate ends with an explicit "FAILED — n" or "passed — n" line.
   This one used to print `pages scanned: 82` followed by a bare `{}` and exit,
   so a clean run's only evidence of success was an empty JSON object — you had
   to know that meant "no violations" rather than "the scan produced nothing"
   (Standardize sweep, 2026-08-18). */
const failedPages = Object.keys(summary);
if (failedPages.length) {
  console.log(JSON.stringify(summary, null, 1));
  console.error(
    `axe audit FAILED — violations on ${failedPages.length} of ${pages.length} page/width combination(s)`,
  );
  process.exit(1);
}
console.log(`axe audit passed — ${pages.length} pages x 2 widths, zero violations`);
