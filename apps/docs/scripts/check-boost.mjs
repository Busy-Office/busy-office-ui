// Build gate: BOOSTED navigation must deliver page layout CSS.
//
// The class of bug this exists for (owner P0, 2026-08-16 + root-cause
// doc): the docs shell navigates with hx-boost, which swaps
// #main-content and leaves <head> alone. Any page whose layout rules
// live in an INLINE <head> style therefore renders unstyled on arrival
// unless the head-support merge runs. Two structural checks, both
// cheap, both red-capable:
//
//   1. STATIC — no page may ship layout-bearing inline <style> in head
//      (inlineStylesheets: 'never' guarantees this; the check fails
//      loudly if the config regresses or a page hand-writes one).
//   2. LIVE — click through the shell to the layout-heaviest pages and
//      assert computed layout, i.e. what the user actually sees.
import { readFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { serveDist } from './serve-dist.mjs';
import puppeteer from 'puppeteer-core';
import { resolveChrome, chromeArgs } from './resolve-chrome.mjs';

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(docsRoot, 'dist');

/* ---------- 1. static: no layout-bearing inline styles ---------- */
async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name === 'index.html') yield p;
  }
}
// Astro's own tiny runtime styles are fine; LAYOUT rules are not.
const LAYOUT = /(display\s*:\s*(grid|flex)|grid-template|position\s*:\s*sticky)/;
let staticFails = 0;
let scanned = 0;
for await (const file of htmlFiles(dist)) {
  if (file.includes('/v/')) continue; // frozen version snapshots
  const html = await readFile(file, 'utf8');
  scanned++;
  const head = html.slice(0, html.indexOf('</head>'));
  for (const [, css] of head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    if (LAYOUT.test(css)) {
      staticFails++;
      console.log(`FAIL inline layout style in head: ${file.replace(dist, '')} (${css.length} chars)`);
    }
  }
}

/* ---------- 2. live: boosted arrival keeps layout ---------- */
const PROBES = [
  ['/base/colors/', '.scale-grid', 'grid'],
  ['/base/colors/', '.scale-row', 'grid'],
  ['/base/palettes/', '.pal-cards', 'grid'],
  ['/components/kv/', '.bo-kv', 'grid'],
];
const { server, port, base } = await serveDist(dist);

const browser = await puppeteer.launch({ executablePath: resolveChrome(), args: chromeArgs(), headless: 'new' });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 1000 });
let liveFails = 0;
for (const [path, selector, expected] of PROBES) {
  // arrive via an in-shell LINK CLICK (the boosted path), not a load
  await page.goto(`http://localhost:${port}${base}/concepts/tokens/`, { waitUntil: 'networkidle0' });
  const href = base + path.replace(/\/$/, '');
  // A BOOSTED click is an ajax swap + pushState, not a document
  // navigation — wait for the URL to change and the swap to settle,
  // never on waitForNavigation (it races and yields false greens).
  // Mark the document: if this survives the click, the swap was BOOSTED
  // (same document). If it's gone, the click fell back to a full page
  // load — which always ships correct styles and would make this probe
  // pass while testing nothing (the fail-open trap this project keeps
  // finding). That's a FAIL, not a pass.
  await page.evaluate(() => { window.__boostMarker = true; });
  await page.click(`a[href="${href}"]`);
  await page.waitForFunction(
    (want) => location.pathname.replace(/\/$/, '') === want,
    { timeout: 10000 }, href,
  ).catch(() => {});
  await page.waitForNetworkIdle({ idleTime: 300 }).catch(() => {});
  const { got, boosted } = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    return {
      got: el ? getComputedStyle(el).display : 'ELEMENT MISSING',
      boosted: window.__boostMarker === true,
    };
  }, selector);
  if (!boosted) {
    liveFails++;
    console.log(`FAIL boosted ${path}: navigation was NOT boosted (full document load) — probe proves nothing`);
    continue;
  }
  if (got !== expected) {
    liveFails++;
    console.log(`FAIL boosted ${path} ${selector}: display=${got} (expected ${expected})`);
  }
}
await browser.close();
server.close();

if (staticFails || liveFails) {
  console.error(`boost check FAILED — ${staticFails} inline-layout-style page(s), ${liveFails} boosted-layout probe(s)`);
  process.exit(1);
}
console.log(`boost check passed — ${scanned} pages scanned for inline layout styles, ${PROBES.length} boosted probes rendered correctly`);
