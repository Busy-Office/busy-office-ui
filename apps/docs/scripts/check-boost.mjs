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
//
// @heuristic — detects "inline layout styles" by pattern, so it can misread what an attribute is for.
// OWES a --self-test (roadmap 42.3): a detector this easy to fool must prove it can fail.
import { assertScanned, selfTest } from './gate-report.mjs';
import { distPages } from './dist-pages.mjs';
import { serveDist } from './serve-dist.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { DIST } from './paths.mjs';
import { DESKTOP_WIDTH } from './viewports.mjs';

/* ---------- 1. static: no layout-bearing inline styles ---------- */
// Astro's own tiny runtime styles are fine; LAYOUT rules are not.
const LAYOUT = /(display\s*:\s*(grid|flex)|grid-template|position\s*:\s*sticky)/;

if (process.argv.includes('--self-test')) {
  /* The detector decides whether an inline <style> block does LAYOUT. It can be
     fooled in both directions: miss a layout rule written with odd spacing, or
     flag a block that only sets colour. Both are checked, because a boost gate
     that flags everything is as useless as one that flags nothing. */
  selfTest([
    ['display:grid is layout', LAYOUT.test('.a{display:grid}'), true],
    ['odd spacing still matches', LAYOUT.test('.a{ display : flex }'), true],
    ['grid-template is layout', LAYOUT.test('.a{grid-template-columns:1fr}'), true],
    ['position:sticky is layout', LAYOUT.test('.a{position:sticky;top:0}'), true],
    ['paint alone is not layout', LAYOUT.test('.a{color:red;font-weight:600}'), false],
    ['a token background is not layout', LAYOUT.test('.a{background:var(--bo-color-bg-surface)}'), false],
  ]);
}
let staticFails = 0;
let scanned = 0;
for (const page of await distPages(DIST)) {
  const file = page.file;
  const html = page.html;
  scanned++;
  const head = html.slice(0, html.indexOf('</head>'));
  for (const [, css] of head.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) {
    if (LAYOUT.test(css)) {
      staticFails++;
      console.log(`FAIL inline layout style in head: ${file.replace(DIST, '')} (${css.length} chars)`);
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
const { server, port, base } = await serveDist(DIST);

const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: DESKTOP_WIDTH, height: 1000 });
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
  /* Nav groups are collapsible since 27.6, so the target link may sit inside a
     closed <details> and not be clickable. Open its group first — which is what
     a reader does — rather than weakening the probe into a direct goto, since
     the whole point is to exercise a BOOSTED click. */
  await page.evaluate((h) => {
    const link = document.querySelector(`a[href="${h}"]`);
    for (let n = link?.parentElement; n; n = n.parentElement) {
      if (n.tagName === 'DETAILS') n.open = true;
    }
  }, href);
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
/* ---------- 3. live: leaving the shell (docs -> landing) must be a REAL
   navigation, not a broken boosted swap ---------- */
// The landing page (/) uses a completely different layout — its own navbar,
// no sidebar, no #main-content — so it was never a candidate for the boosted
// swap every other in-shell link gets. hx-select="#main-content > *" found
// nothing in the landing page's response to swap, so the URL and <title>
// updated while the docs shell stayed on screen with STALE content —
// reproduced live and fixed 2026-08-22 by giving both links to `/` an
// explicit hx-boost="false". This probe is the opposite assertion of the
// PROBES loop above: it must find boosted === false.
await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
await page.evaluate(() => { window.__boostMarker = true; });
await page.click('.bo-navbar__brand');
await page.waitForFunction(
  () => location.pathname.replace(/\/$/, '') === '' || location.pathname === '/',
  { timeout: 10000 },
).catch(() => {});
await page.waitForNetworkIdle({ idleTime: 300 }).catch(() => {});
const landing = await page.evaluate(() => ({
  boosted: window.__boostMarker === true,
  landingRendered: !!document.querySelector('main.landing'),
  sidebarGone: !document.querySelector('[data-navgroup]'),
}));
if (landing.boosted) {
  liveFails++;
  console.log('FAIL landing-nav: brand link was boosted — hx-boost="false" regressed, the docs shell will show stale content on arrival at "/"');
} else if (!landing.landingRendered || !landing.sidebarGone) {
  liveFails++;
  console.log(`FAIL landing-nav: arrived at "/" but landing content did not render (landingRendered=${landing.landingRendered}, sidebarGone=${landing.sidebarGone})`);
}

await browser.close();
server.close();

if (staticFails || liveFails) {
  console.error(`boost check FAILED — ${staticFails} inline-layout-style page(s), ${liveFails} boosted-layout probe(s)`);
  process.exit(1);
}
assertScanned(scanned, 'built pages', 'dist has no pages — run the docs build first');
console.log(`boost check passed — ${scanned} pages scanned for inline layout styles, ${PROBES.length} boosted probes rendered correctly, 1 landing-navigation probe confirmed unboosted`);
