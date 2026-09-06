/**
 * Render the social card image from the framework's OWN shipped CSS
 * (roadmap 249.15, the image half — 249.17 shipped the tags).
 *
 * WHY GENERATED AND NOT DRAWN. 249.16's README screenshot is hand-made and
 * says so in its alt text, because it photographs a real docs page and no
 * script can judge whether that page looks right. This is the other case: the
 * card is a fixed 1200x630 composition of this framework's own tokens and its
 * own `.bo-data-table`, so it can be rebuilt from the artifact instead of
 * maintained by hand. If a token moves, re-running this moves the card with
 * it — which is the whole reason the repo prefers generated over drawn.
 *
 * It imports `packages/core/dist/css/index.css`, so the card is literally made
 * of the thing it advertises. A card mocked up in bespoke CSS would be a
 * picture of a design idea; this is a picture of the shipped artifact.
 *
 * 1200x630 is the size every major platform crops from, and `og:image:width`
 * / `:height` are emitted alongside so a platform need not fetch the file to
 * lay the card out.
 *
 * NOT a gate and not wired into `build` — the output is committed to
 * `public/`, the same way `favicon.svg` and `robots.txt` are, because a build
 * that needs a browser to produce a static asset would put Chrome on the
 * critical path of every `docs:build`. `check-metadata.mjs` asserts the file
 * the built pages point at actually resolves in `dist/`; this script is how
 * you regenerate it when a token moves.
 *
 *   node apps/docs/scripts/gen-og-card.mjs
 */
import { writeFile, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { REPO_ROOT } from './paths.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';

const OUT = join(REPO_ROOT, 'apps/docs/public/og-card.png');
const FRAMEWORK_CSS = join(REPO_ROOT, 'packages/core/dist/css/index.css');

const css = await readFile(FRAMEWORK_CSS, 'utf8');

/* The card's own layout only. Every colour, radius, font-size and border below
   comes from a `--bo-*` token defined by the stylesheet above — nothing here
   invents a value, which is what keeps the card honest when a token moves. */
const page = `<!doctype html>
<html lang="en" data-density="compact">
<head><meta charset="utf-8"><style>
${css}
html, body { margin: 0; padding: 0; }
body {
  inline-size: 1200px; block-size: 630px; overflow: hidden;
  background: var(--bo-color-bg-canvas);
  color: var(--bo-color-text-primary);
  font-family: var(--bo-font-sans);
  /* Two columns, full bleed. The table column runs off the bottom edge on
     purpose: a dense grid that continues past the frame says "there is more
     of this" better than a shorter table floating in white space. */
  display: grid; grid-template-columns: 1fr 1.15fr;
  gap: var(--bo-space-8); align-items: center;
  padding: 0 0 0 var(--bo-space-8);
  box-sizing: border-box;
}
.left { padding-block: var(--bo-space-8); }
.wordmark { display: flex; align-items: center; gap: var(--bo-space-3); }
.dot {
  inline-size: 2.6rem; block-size: 2.6rem; border-radius: var(--bo-radius-md);
  background: var(--bo-color-accent); display: grid; place-items: center;
  color: #fff; font-size: 1.6rem; font-weight: 700; line-height: 1;
}
h1 { font-size: 2.9rem; margin: 0; letter-spacing: -0.025em; font-weight: 700; }
p.lede {
  font-size: 1.5rem; line-height: 1.35; margin: var(--bo-space-6) 0 0;
  color: var(--bo-color-text-secondary); max-inline-size: 24ch;
  text-wrap: balance;
}
.right { align-self: stretch; overflow: hidden; padding-block-start: 4.25rem; }
.screen {
  border: var(--bo-border-width) solid var(--bo-color-border-default);
  border-inline-end: 0; border-block-end: 0;
  border-radius: var(--bo-radius-md) 0 0 0;
  background: var(--bo-color-bg-surface); overflow: hidden;
  box-shadow: var(--bo-shadow-lg);
  font-size: 1.05rem;
  block-size: 100%;
}
.screen th, .screen td { padding-block: 0.85rem; }
</style></head>
<body>
  <div class="left">
    <div class="wordmark">
      <span class="dot">B</span>
      <h1>busy-office-ui</h1>
    </div>

    <p class="lede">CSS for screens that do work — semantic components and
    density-aware tokens for ERP and back-office applications.</p>

    <div class="bo-cluster" style="margin-block-start: var(--bo-space-6)">
      <span class="bo-badge">No framework</span>
      <span class="bo-badge">Cascade is the API</span>
      <span class="bo-badge bo-badge--success">AA gated</span>
    </div>
  </div>

  <div class="right">
    <div class="screen">
      <table class="bo-data-table">
        <thead>
          <tr>
            <th scope="col">Invoice #</th><th scope="col">Vendor</th>
            <th scope="col" class="bo-u-text-end">Amount</th><th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>INV-10234</td><td>Acme Supply Co.</td><td class="bo-u-tabular bo-u-text-end">$ 17,329.42</td><td><span class="bo-badge bo-badge--warning">Pending</span></td></tr>
          <tr><td>INV-10235</td><td>Globex Industrial</td><td class="bo-u-tabular bo-u-text-end">$ 18,685.95</td><td><span class="bo-badge bo-badge--success">Approved</span></td></tr>
          <tr><td>INV-10236</td><td>Initech GmbH</td><td class="bo-u-tabular bo-u-text-end">$ 3,322.40</td><td><span class="bo-badge bo-badge--danger">Rejected</span></td></tr>
          <tr><td>INV-10237</td><td>Umbrella Logistics</td><td class="bo-u-tabular bo-u-text-end">$ 15,636.05</td><td><span class="bo-badge bo-badge--warning">Pending</span></td></tr>
          <tr><td>INV-10238</td><td>Stark Components</td><td class="bo-u-tabular bo-u-text-end">$ 19,678.49</td><td><span class="bo-badge bo-badge--success">Approved</span></td></tr>
          <tr><td>INV-10239</td><td>Acme Supply Co.</td><td class="bo-u-tabular bo-u-text-end">$ 6,088.31</td><td><span class="bo-badge bo-badge--danger">Rejected</span></td></tr>
          <tr><td>INV-10240</td><td>Globex Industrial</td><td class="bo-u-tabular bo-u-text-end">$ 13,639.73</td><td><span class="bo-badge bo-badge--warning">Pending</span></td></tr>
          <tr><td>INV-10241</td><td>Initech GmbH</td><td class="bo-u-tabular bo-u-text-end">$ 20,287.16</td><td><span class="bo-badge bo-badge--success">Approved</span></td></tr>
          <tr><td>INV-10242</td><td>Umbrella Logistics</td><td class="bo-u-tabular bo-u-text-end">$ 8,742.37</td><td><span class="bo-badge bo-badge--danger">Rejected</span></td></tr>
          <tr><td>INV-10243</td><td>Stark Components</td><td class="bo-u-tabular bo-u-text-end">$ 11,380.42</td><td><span class="bo-badge bo-badge--warning">Pending</span></td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body></html>`;

const browser = await launchDocsBrowser();
const p = await browser.newPage();
await p.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await p.setContent(page, { waitUntil: 'load' });

/* Assert the framework's CSS actually applied before writing the file. A card
   rendered with the stylesheet silently missing would still screenshot — it
   would just be unstyled text, which is exactly the "the injection never
   landed" failure this repo names. */
const applied = await p.evaluate(() => {
  const cs = getComputedStyle(document.querySelector('.bo-data-table'));
  const badge = document.querySelector('.bo-badge--success');
  return {
    tableDisplay: cs.display,
    accent: getComputedStyle(document.documentElement).getPropertyValue('--bo-color-accent').trim(),
    badgeBg: getComputedStyle(badge).backgroundColor,
    rows: document.querySelectorAll('.bo-data-table tbody tr').length,
  };
});
if (!applied.accent || applied.rows !== 10) {
  console.error('gen-og-card FAILED — the framework stylesheet did not apply:', applied);
  process.exit(1);
}

await p.screenshot({ path: OUT, type: 'png' });
await browser.close();

console.log(
  `og-card written — 1200x630, from packages/core/dist/css/index.css\n` +
    `  --bo-color-accent resolved to ${applied.accent}, ${applied.rows} table rows rendered`,
);
