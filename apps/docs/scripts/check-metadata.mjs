/**
 * Every SHIPPED page carries a description, and the sitemap lists exactly the
 * pages that shipped (roadmap 249.2).
 *
 * @exact — set membership and string length on the built artifact. There is no
 *   judgement to get wrong: a page either carries the tag or it does not, and
 *   the two URL sets are either equal or they are not. Exempt from
 *   `--self-test` per check-selftests.mjs, and stated so nobody wraps ceremony
 *   around a `readdir`.
 *
 * WHY A SECOND GATE, when check-page-shape.mjs already refuses a source page
 * with no description and Gallery.astro throws without one. Those two read the
 * SOURCE; this reads what a browser gets. The distinction is not theoretical
 * here — 11 of the 127 source pages own their own `<head>` and never touch
 * Gallery, `astro build` is what turns a prop into a tag, and the sitemap does
 * not exist in source at all. CLAUDE.md's standing rule: when something
 * downstream can rewrite the artefact, its output IS the artefact.
 *
 * THE SITEMAP CHECK IS A RECONCILIATION BETWEEN TWO INDEPENDENT DERIVATIONS,
 * and that is the whole reason it can fail. `@astrojs/sitemap` builds its list
 * from Astro's route table; `distPages()` builds its list by walking `dist/`
 * for `index.html`. Neither can see the other. Had the sitemap been generated
 * here from `distPages()` — the obvious cheaper design — this gate would be
 * comparing a list against itself, which is CLAUDE.md's "reconcile against the
 * SOURCE, not against the argument": self-consistent by construction, and green
 * no matter what broke.
 *
 * The two sets agree on the same two exclusions, each reached separately:
 * redirect stubs (`dist-pages.mjs` skips a `<meta http-equiv="refresh">`;
 * `astro.config.mjs` filters the same paths, derived from its own `redirects`
 * object) and `suite/` (an app, not documentation — `dist-pages.mjs` carries
 * the reason, and Astro never had it as a route because `copy-suite.mjs` puts
 * it there after the build).
 */
import { readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, SITE_ORIGIN, SITE_URL } from './paths.mjs';
import { distPages } from './dist-pages.mjs';
import { gate, assertScanned } from './gate-report.mjs';

/* Same expression astro.config.mjs uses, for the same env var — the built URLs
   carry the base, and the local build and CI's differ. */
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');

/* Below this, a description is not a summary of the page — it is a label. The
   floor is asserted rather than left to taste because the failure it catches is
   a page shipping `content=""`, which reads as present to a `grep` and as
   absent to every consumer. Gallery.astro throws on the same number. */
const MIN_LENGTH = 40;

const g = gate('metadata check', 'page metadata assertions');
const pages = await distPages(DIST);
assertScanned(pages.length, 'built docs pages', 'run the docs build first');

/* ---------- 1. every built page describes itself ---------- */
const byDescription = new Map();
for (const p of pages) {
  const m = p.html.match(/<meta\s+name="description"\s+content="([^"]*)"/);
  const content = m ? m[1].trim() : null;
  g.check(
    `${p.url} carries a meta description of at least ${MIN_LENGTH} characters`,
    content !== null && content.length >= MIN_LENGTH,
    content === null
      ? 'no <meta name="description"> in the built page'
      : `description is ${content.length} characters: ${JSON.stringify(content)}`,
  );
  if (content) byDescription.set(content, [...(byDescription.get(content) ?? []), p.url]);
}

/* ---------- 2. no two pages share one description ----------
   The bulk edit that seeded these touched 127 files in one pass, and
   CLAUDE.md's rule for exactly that is to assert the property that matters —
   every row's label belongs to THAT row. A copy-paste is the failure mode a
   presence check cannot see: 127 identical descriptions pass arm 1 in full. */
for (const [content, urls] of byDescription) {
  if (urls.length > 1) {
    g.check(
      `the description on ${urls[0]} is not reused elsewhere`,
      false,
      `${urls.length} pages share it — ${urls.join(', ')} — ${JSON.stringify(content)}`,
    );
  }
}
g.check(
  'every built page has a distinct description',
  byDescription.size === pages.length,
  `${byDescription.size} distinct description(s) across ${pages.length} page(s)`,
);

/* ---------- 3. the sitemap lists exactly the built pages ---------- */
const indexPath = join(DIST, 'sitemap-index.xml');
let sitemapUrls = null;
try {
  const index = await readFile(indexPath, 'utf8');
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, u]) => u);
  g.check(
    'sitemap-index.xml names at least one child sitemap',
    children.length > 0,
    `sitemap-index.xml holds ${children.length} <loc> entries`,
  );
  sitemapUrls = new Set();
  for (const child of children) {
    /* The child <loc> is an absolute URL; the file sits beside the index. */
    const name = child.slice(child.lastIndexOf('/') + 1);
    const xml = await readFile(join(DIST, name), 'utf8');
    for (const [, u] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) sitemapUrls.add(u);
  }
} catch (err) {
  g.check('sitemap-index.xml is present and readable', false, String(err));
}

if (sitemapUrls) {
  const expected = new Set(pages.map((p) => `${SITE_ORIGIN}${base}${p.url}`));
  const missing = [...expected].filter((u) => !sitemapUrls.has(u));
  const extra = [...sitemapUrls].filter((u) => !expected.has(u));
  g.check(
    `the sitemap lists every one of the ${expected.size} built docs pages`,
    missing.length === 0,
    `${missing.length} built page(s) absent from the sitemap: ${missing.slice(0, 8).join(', ')}`,
  );
  g.check(
    'the sitemap lists nothing that was not built',
    extra.length === 0,
    `${extra.length} sitemap URL(s) with no built page: ${extra.slice(0, 8).join(', ')}`,
  );
}

/* ---------- 4. robots.txt points a crawler at that sitemap ---------- */
const robotsPath = join(DIST, 'robots.txt');
let robots = null;
try {
  await stat(robotsPath);
  robots = await readFile(robotsPath, 'utf8');
} catch {
  /* left null — the assertion below reports it */
}
g.check('robots.txt is shipped', robots !== null, 'no robots.txt in dist/');
if (robots !== null) {
  /* `robots.txt` is a static file in `public/`, so the published URL is spelled
     there a second time — it cannot import `SITE_URL`. That is a copy, and the
     answer to a copy this repo cannot delete is a gate that reconciles it: the
     line must be the SAME url paths.mjs exports, not merely a plausible one. */
  const expectedSitemap = `${SITE_URL}/sitemap-index.xml`;
  const declared = robots.match(/^Sitemap:\s*(\S+)\s*$/m)?.[1] ?? null;
  g.check(
    `robots.txt points at ${expectedSitemap}`,
    declared === expectedSitemap,
    declared === null
      ? `robots.txt carries no Sitemap: line — ${JSON.stringify(robots)}`
      : `robots.txt declares ${declared}, which is not paths.mjs's SITE_URL + /sitemap-index.xml`,
  );
}

g.report(`checked across ${pages.length} built page(s)`);
