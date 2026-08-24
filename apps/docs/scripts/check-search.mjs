/**
 * Gate: the docs search is readable AND its index is scoped.
 *
 * Two concerns, one widget, one browser boot — renamed from
 * check-vendor-contrast when index-quality assertions landed (roadmap 27.3).
 *
 * `check:contrast` in the core package is static analysis over our own token
 * pairs — 35 pairs x 2 themes, and it passed on the very page where the docs
 * search rendered result text at 1.46:1 in dark (owner QA review, 2026-08-17).
 * Both statements were true at once: the gate was correct about everything it
 * covers, and blind to vendored CSS. Pagefind ships its own stylesheet with a
 * theme-blind `#393939` default, so the only way to know is to render it and
 * measure.
 *
 * Scope is deliberately narrow — the search widget is the only third-party UI
 * the docs site renders. If another vendored component arrives, add it to
 * REGIONS rather than widening this into a whole-page sweep: whole-page
 * rendered contrast overlaps `check:contrast` and drowns real findings in
 * decorative text.
  *
 * @exact — measures rendered contrast in a real browser. Exempt from --self-test: there is no
 * judgement to get wrong, and ceremony around a lookup is noise.
*/
import { serveDist } from './serve-dist.mjs';
import { gate } from './gate-report.mjs';
import { launchDocsBrowser } from './browser-harness.mjs';
import { DIST } from './paths.mjs';
import { DESKTOP_WIDTH } from './viewports.mjs';

const { server, port, base } = await serveDist(DIST);
const browser = await launchDocsBrowser();
const page = await browser.newPage();
await page.setViewport({ width: DESKTOP_WIDTH, height: 900 });

const g = gate('search check', 'search assertions');

/* Third-party regions to measure, and how to bring them on screen. */
const REGIONS = [
  {
    name: 'Pagefind search results',
    selector: '.pagefind-ui',
    async open() {
      await this.openWith('invoice');
    },
    async openWith(query) {
      await page.click('.docs-searchbtn');
      await new Promise((r) => setTimeout(r, 300));
      await page.type('#cmdk .pagefind-ui__search-input', query);
      /* Wait for the SETTLED state, not merely for results to exist.
         Pagefind renders skeleton placeholders first whose text colour equals
         their background on purpose (invisible text inside a loading block) —
         measuring then reports 1:1 on every row, which is a false positive
         about a real technique. */
      await page.waitForFunction(
        () => document.querySelectorAll('.pagefind-ui__result').length > 0
          && document.querySelectorAll('.pagefind-ui__loading').length === 0,
        { timeout: 15000 },
      );
    },
  },
];

/* WCAG 1.4.3: 4.5:1 for normal text, 3:1 for large (>=24px, or >=18.66px bold). */
const measure = (selector) =>
  page.evaluate((sel) => {
    const srgb = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
    /* NOT the shared wcag.mjs, deliberately: this runs inside page.evaluate,
       so it is serialised into the BROWSER and cannot import a Node module.
       Eight duplicated lines is the cheaper mistake than a gate that throws in
       a page context. Equivalent by construction — both are the published WCAG
       formula, and wcag.mjs records the five vectors they were checked on. */
    const lum = (c) => { const [r, g, b] = c.match(/[\d.]+/g).map(Number); return 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b); };
    const ratio = (a, b) => { const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };
    const opaqueBg = (el) => {
      for (let n = el; n; n = n.parentElement) {
        const bg = getComputedStyle(n).backgroundColor;
        if (bg && !/rgba\(\s*0,\s*0,\s*0,\s*0\s*\)|transparent/.test(bg)) return bg;
      }
      return getComputedStyle(document.body).backgroundColor;
    };
    const out = [];
    const root = document.querySelector(sel);
    if (!root) return out;
    for (const el of root.querySelectorAll('*')) {
      // Only elements with their OWN visible text.
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!own) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') continue;
      // Skeleton/placeholder text deliberately matches its background.
      if (/loading|placeholder|skeleton/i.test(el.className)) continue;
      const px = parseFloat(cs.fontSize);
      const bold = parseInt(cs.fontWeight, 10) >= 700;
      const large = px >= 24 || (bold && px >= 18.66);
      out.push({
        cls: (el.className || el.tagName).toString().trim().slice(0, 44),
        fg: cs.color,
        bg: opaqueBg(el),
        ratio: +ratio(cs.color, opaqueBg(el)).toFixed(2),
        required: large ? 3 : 4.5,
      });
    }
    return out;
  }, selector);

for (const region of REGIONS) {
  for (const theme of ['dark', 'light']) {
    await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
    await page.evaluate((t) => { document.documentElement.dataset.theme = t; }, theme);
    await region.open();
    const found = await measure(region.selector);
    const failing = found.filter((f) => f.ratio < f.required);
    g.check(
      `${region.name}: every rendered text element meets AA in ${theme}`,
      found.length > 0 && failing.length === 0,
      found.length === 0
        ? `no text measured — the region never rendered, so this proves nothing`
        : failing.map((f) => `${f.cls} ${f.fg} on ${f.bg} = ${f.ratio}:1 (needs ${f.required})`).join(' | '),
    );
  }
}

/* ---- index scope (roadmap 27.3) ----
   Pagefind indexed whole page bodies, so every excerpt began with the app
   shell and code samples surfaced as prose. The ASSERTION here is the chrome
   prefix, because that is unambiguous. Deliberately NOT asserted: a raw-HTML
   pattern like /<[a-z]+>/ flags legitimate prose — the first-screen page says
   "the filter bar (into <main>)" — and a result COUNT, because "table"
   returning ~52 turned out to be honest prose across the pages that discuss
   tables, not code-block inflation. */
for (const q of ['invoice', 'table', 'approve']) {
  await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
  await REGIONS[0].openWith(q);
  const r = await page.evaluate(() => {
    const ex = [...document.querySelectorAll('.pagefind-ui__result-excerpt')].map((e) => e.textContent.trim());
    const titles = [...document.querySelectorAll('.pagefind-ui__result-title')].map((e) => e.textContent.trim());
    return { n: ex.length, chrome: ex.filter((t) => /^busy-office-ui|^Menu\b/.test(t)), titles };
  });
  g.check(
    `"${q}": no excerpt starts at the app shell instead of the content`,
    r.n > 0 && r.chrome.length === 0,
    r.n === 0 ? 'no results — proves nothing' : `chrome-prefixed: ${r.chrome.slice(0, 2).join(' | ')}`,
  );
}

/* Short-query guard: a 1-char query ("s") used to return "113 results for s"
   ranked by term-frequency noise — nearly every page has SOME word starting
   with any single letter, so there is no real relevance signal below
   MIN_QUERY_LENGTH (Gallery.astro). Asserted on the RENDERED message and
   result count, not on the presence of a processTerm string in source —
   Gallery.astro's script is inline JS, easy to edit without touching a
   detectable marker, so the only trustworthy signal is what the dialog
   actually shows. Red-proved by temporarily reverting the processTerm/
   MutationObserver change and re-running this file: this check went from
   pass to fail on "0 result(s), message: 113 results for s".  */
await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
await page.click('.docs-searchbtn');
await new Promise((r) => setTimeout(r, 300));
await page.type('#cmdk .pagefind-ui__search-input', 's');
await new Promise((r) => setTimeout(r, 500));
const shortQuery = await page.evaluate(() => ({
  message: document.querySelector('#cmdk-search .pagefind-ui__message')?.textContent.trim() ?? '',
  results: document.querySelectorAll('#cmdk-search .pagefind-ui__result').length,
}));
g.check(
  '1-char query ("s") is suppressed instead of returning noise-ranked results',
  shortQuery.results === 0 && !/^\d+ results? for/.test(shortQuery.message),
  `${shortQuery.results} result(s), message: "${shortQuery.message}"`,
);

/* Relevance guard: ignoring code samples must not take the GENERATED reference
   tables with it. An earlier version of scope-search-index.mjs ignored every
   <table>, which dropped `bo-data-table` from 9 hits to 3 and put Pagination
   above the data-table page. */
await page.goto(`http://localhost:${port}${base}/components/button/`, { waitUntil: 'networkidle0' });
await REGIONS[0].openWith('bo-data-table');
const cls = await page.evaluate(() =>
  [...document.querySelectorAll('.pagefind-ui__result-title')].slice(0, 3).map((e) => e.textContent.trim()));
g.check(
  'a class name still finds the class index or its own component page in the top 3',
  cls.some((t) => /class index|data table|table/i.test(t)),
  `top 3: ${cls.join(' | ')}`,
);

/* Static guard for scope-search-index.mjs itself. The rendered assertions
   above are carried by `data-pagefind-body` on <main>, so they stay green even
   if the post-build ignore step is removed — verified by removing it. Every
   <pre> carrying the attribute is the exact, tokenization-proof signal that the
   step ran; searching for code-only strings is not, because Pagefind splits
   camelCase and matches sub-tokens. */
{
  /* distPages: this block carried a fourth half-copy of the exclusion set —
     `_astro`/`pagefind` but not `/v/` (Standardize, 2026-08-21). */
  const { distPages } = await import('./dist-pages.mjs');
  let pre = 0, ignored = 0, fixtureTables = 0, keptTables = 0, conflictTables = 0, referenceIgnored = 0;
  for (const page of await distPages(DIST)) {
    const file = page.file;
    const html = page.html;
    for (const m of html.matchAll(/<pre([^>]*)>/g)) {
      pre += 1;
      if (/data-pagefind-ignore/.test(m[1])) ignored += 1;
    }
    /* The other half of the same trade (roadmap 27.3b): fixture tables are
       ignored, generated reference tables are kept. Checked statically rather
       than through the UI, because the DESIRED result for a fixture term is
       ZERO results — and the settle helper above requires at least one, so a
       rendered assertion could never express it. */
    const isReference = /\/reference\//.test(file);
    for (const m of html.matchAll(/<table([^>]*)>/g)) {
      /* A reference page IS its tables. When the fixture rule shipped it
         swallowed /reference/tokens, /reference/events and /reference/acr, and
         the counts below still looked healthy — searching `bo:row-save`
         returned five pages without the intent-event index among them. Counting
         kept-vs-ignored could not see it, so this counts the thing that
         actually broke. */
      if (isReference && /data-pagefind-ignore/.test(m[1])) referenceIgnored += 1;
      const keep = /data-search-keep/.test(m[1]);
      const ignored = /data-pagefind-ignore/.test(m[1]);
      if (keep && ignored) conflictTables += 1;   // a kept table that got ignored anyway
      else if (keep) keptTables += 1;
      else if (ignored) fixtureTables += 1;
    }
  }
  g.check(
    'every code sample in the built output is excluded from the search index',
    pre > 0 && ignored === pre,
    `${ignored}/${pre} <pre> elements carry data-pagefind-ignore`,
  );
  /* Deliberately fails in BOTH directions, because this trade has two ways to
     go wrong and fixing one by breaking the other is what 27.3b exists to
     prevent: `fixtureTables > 0` dies if the ignore rule is dropped, and
     `conflictTables === 0` dies if the rule goes blanket again and swallows the
     generated reference tables (which is how `bo-data-table` once fell from 9
     hits to 3). */
  g.check(
    'no table on a /reference/ page is excluded from the index',
    referenceIgnored === 0,
    `reference tables ignored: ${referenceIgnored}`,
  );

  g.check(
    'fixture tables are ignored AND generated reference tables survive',
    fixtureTables > 0 && keptTables > 0 && conflictTables === 0,
    `ignored fixtures: ${fixtureTables}, kept: ${keptTables}, kept-but-ignored: ${conflictTables}`,
  );
}

await browser.close();
server.close();
g.report('verified on rendered output');
