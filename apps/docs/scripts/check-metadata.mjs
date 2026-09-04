/**
 * Every SHIPPED page carries a description, and the sitemap lists exactly the
 * pages that shipped (roadmap 249.2) — and says what a shared link should show
 * (roadmap 249.17, arm 5).
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

/* ---------- 5. every built page says what a shared link should show ----------
   Roadmap 249.17, split out of 249.15. Before this the built site carried ZERO
   `og:` and ZERO `twitter:` tags — 0 of the 138 built `index.html` files, on a
   full build of `3e1dac1` — so a link pasted into a chat rendered as a bare URL.

   THE THREE EQUALITIES ARE THE POINT, not the presence checks. A presence
   check passes in full on a site where every page claims to be the home page —
   the same failure arm 2 exists for. So:

     og:title       === the page's own <title>
     og:description === the page's own <meta name="description">
     og:url         === SITE_ORIGIN + base + the url dist-pages.mjs walked to

   The first two reconcile the card against what the page already publishes
   about itself; the third reconciles two independent derivations, Astro's
   route table (SocialMeta.astro builds it from `Astro.url`) against a walk of
   `dist/` — neither can see the other, which is what arm 3's header says makes
   a reconciliation able to fail at all.

   NO og:image ARM. The card image is the half of 249.15 that stays open —
   its evidence is a rendered image a human compares — and the wake that adds
   it adds the arm that checks the file resolves in `dist/`. An arm asserting
   the absence of og:image would have to be deleted by that wake, so it would
   be ceremony, not a gate. */
const OG_REQUIRED = ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url'];
const TWITTER_REQUIRED = ['twitter:card', 'twitter:title', 'twitter:description'];

/* Both sides of every comparison go through this. The two sides are an
   attribute value and element text, which Astro escapes by DIFFERENT rules, so
   comparing raw would report a difference in ESCAPING as a difference in
   CONTENT. Decoding both with one function cannot invent an agreement: two
   different strings stay different.

   MEASURED, not anticipated. The first version of this decoder handled only the
   five named entities and the arm went red on exactly 10 of the 127 pages, all
   of them titles containing `&`: Astro writes `&` unescaped inside <title> and
   as the NUMERIC `&#38;` inside an attribute. So the numeric forms are not
   defensive coding — they are the case this repo actually has, and the ten
   pages are also this arm's unforced proof that the equality can fail.

   ONE PASS over every entity form, not a chain of replaces: a chain that
   resolves `&amp;` first would then re-read the `&#38;` it just produced and
   decode it a second time, turning a literal "&#38;" into "&". */
const NAMED = { lt: '<', gt: '>', quot: '"', apos: "'", amp: '&', nbsp: ' ' };
const decode = (s) =>
  s.replace(/&(?:#(\d+)|#[xX]([0-9a-fA-F]+)|([a-zA-Z]+));/g, (whole, dec, hex, name) => {
    if (dec !== undefined) return String.fromCodePoint(Number(dec));
    if (hex !== undefined) return String.fromCodePoint(parseInt(hex, 16));
    return name in NAMED ? NAMED[name] : whole;
  });

/** every <meta> in a built page's HEAD, keyed by its name= or property=.
 *  Scoped to the head on purpose: this is a docs site whose pages render HTML
 *  samples, and a page that ever shows a `<meta>` in its body would otherwise
 *  overwrite the real one in this map — a parse that reads the wrong element
 *  and reports confidently, which is the failure this repo keeps paying for. */
function metaMap(head) {
  const out = new Map();
  for (const [tag] of head.matchAll(/<meta\b[^>]*>/g)) {
    const key = tag.match(/\b(?:property|name)="([^"]*)"/)?.[1];
    const content = tag.match(/\bcontent="([^"]*)"/)?.[1];
    if (key !== undefined && content !== undefined) out.set(key, decode(content));
  }
  return out;
}

for (const p of pages) {
  const headEnd = p.html.indexOf('</head>');
  g.check(`${p.url} has a </head>`, headEnd !== -1, 'no </head> in the built page');
  if (headEnd === -1) continue;
  const head = p.html.slice(0, headEnd);

  const meta = metaMap(head);
  const missing = [...OG_REQUIRED, ...TWITTER_REQUIRED].filter((k) => !meta.has(k));
  g.check(
    `${p.url} carries the social-card tags`,
    missing.length === 0,
    `absent: ${missing.join(', ')}`,
  );
  if (missing.length > 0) continue;

  const titleText = head.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  g.check(
    `${p.url} og:title repeats the page's own <title>`,
    titleText !== undefined && meta.get('og:title') === decode(titleText),
    titleText === undefined
      ? 'the built page has no <title> at all'
      : `<title> is ${JSON.stringify(decode(titleText))}, og:title is ${JSON.stringify(meta.get('og:title'))}`,
  );

  const description = head.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
  g.check(
    `${p.url} og:description repeats the page's own meta description`,
    description !== undefined && meta.get('og:description') === decode(description),
    description === undefined
      ? 'the built page has no meta description at all'
      : `description is ${JSON.stringify(decode(description))}, og:description is ${JSON.stringify(meta.get('og:description'))}`,
  );

  /* The same expression arm 3 builds `expected` from, for the same reason: the
     published URL of a built page has one definition here, not two. */
  const canonical = `${SITE_ORIGIN}${base}${p.url}`;
  g.check(
    `${p.url} og:url is the page's published URL`,
    meta.get('og:url') === canonical,
    `og:url is ${JSON.stringify(meta.get('og:url'))}, the dist walk says ${JSON.stringify(canonical)}`,
  );

  g.check(
    `${p.url} twitter:title and twitter:description repeat the og: pair`,
    meta.get('twitter:title') === meta.get('og:title') &&
      meta.get('twitter:description') === meta.get('og:description'),
    `twitter: pair is ${JSON.stringify([meta.get('twitter:title'), meta.get('twitter:description')])}`,
  );

  /* `summary_large_image` promises a card this site cannot fill until 249.15
     ships the image. Asserted rather than left to the author, because the
     wrong value here degrades to a broken card rather than to an error. */
  g.check(
    `${p.url} twitter:card is summary while no og:image ships`,
    meta.has('og:image') || meta.get('twitter:card') === 'summary',
    `twitter:card is ${JSON.stringify(meta.get('twitter:card'))} and the page ships no og:image`,
  );
}

g.report(`checked across ${pages.length} built page(s)`);
