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
import { decodeEntities } from './html-entities.mjs';

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

   THE og:image ARM (added by 249.15, Slice 295). Two halves, because presence
   alone is the weaker one: every page must carry `og:image`, AND the path it
   carries must RESOLVE to a file inside `dist/`. A tag pointing at a 404 is
   the failure this arm exists for — it unfurls as no card at all, silently,
   which is exactly the class of defect that cannot be seen from the source.
   The url is resolved back to a dist-relative path rather than fetched: the
   gate has the built tree in hand, and a network fetch would make the gate
   fail when the network does.

   The old arm here asserted `og:image is absent OR twitter:card is summary`.
   It was correct while no image shipped and is DELETED rather than kept,
   because its left disjunct is now always true — it would pass on every tree,
   including one where `twitter:card` had been left at `summary`. A detector
   that cannot fail is worse than no detector, so the replacement asserts the
   NEW invariant in the positive: the card is `summary_large_image` and the
   image is present. */
const OG_REQUIRED = ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'og:image'];
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
/* The implementation MOVED to html-entities.mjs (Standardize sweep, roadmap
   263.1). It was one of three decoders in this directory, under three names,
   and that file's header carries the measured disagreement — 8 of 11 inputs —
   plus the reason no chained order can be right in both directions. The
   paragraphs above stay here because they are about THIS gate's two sides. */

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
    if (key !== undefined && content !== undefined) out.set(key, decodeEntities(content));
  }
  return out;
}

/* Every distinct og:image url the built pages carry. Collected in the page
   loop, resolved against `dist/` after it — see the loop's own comment. */
const ogImagePaths = new Set();

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
    titleText !== undefined && meta.get('og:title') === decodeEntities(titleText),
    titleText === undefined
      ? 'the built page has no <title> at all'
      : `<title> is ${JSON.stringify(decodeEntities(titleText))}, og:title is ${JSON.stringify(meta.get('og:title'))}`,
  );

  const description = head.match(/<meta\s+name="description"\s+content="([^"]*)"/)?.[1];
  g.check(
    `${p.url} og:description repeats the page's own meta description`,
    description !== undefined && meta.get('og:description') === decodeEntities(description),
    description === undefined
      ? 'the built page has no meta description at all'
      : `description is ${JSON.stringify(decodeEntities(description))}, og:description is ${JSON.stringify(meta.get('og:description'))}`,
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

  /* The card form must match the asset that ships. Asserted rather than left
     to the author, because the wrong value here degrades to a broken card
     rather than to an error — the page still builds, and the defect is only
     visible when someone pastes a link. */
  g.check(
    `${p.url} twitter:card matches the shipped 1200x630 image`,
    meta.get('twitter:card') === 'summary_large_image',
    `twitter:card is ${JSON.stringify(meta.get('twitter:card'))}, want "summary_large_image"`,
  );

  /* og:image RESOLVES. Presence is already covered by OG_REQUIRED; this is
     the half that catches a tag pointing at a file that is not there. */
  const img = meta.get('og:image') ?? '';
  g.check(
    `${p.url} og:image is absolute and on this site`,
    img.startsWith(`${SITE_URL}/`) || img.startsWith(`${SITE_ORIGIN}/`),
    `og:image is ${JSON.stringify(img)} — a platform fetches it with no document base to resolve against`,
  );
  ogImagePaths.add(img);
}

/* Resolved once, after the page loop: every page points at the same asset, so
   127 identical stat() calls would measure the filesystem, not the site. The
   SET is what makes that safe — if any page ever points somewhere else, this
   checks that path too rather than silently only checking the first. */
for (const img of ogImagePaths) {
  const rel = img.startsWith(SITE_ORIGIN) ? img.slice(SITE_ORIGIN.length) : img;
  /* base is part of the published url and not of the dist tree, so it comes
     off before the path is joined onto DIST. */
  const basePath = SITE_URL.slice(SITE_ORIGIN.length);
  const inDist = rel.startsWith(basePath) ? rel.slice(basePath.length) : rel;
  const file = join(DIST, inDist.replace(/^\//, ''));
  let bytes = null;
  try {
    bytes = (await stat(file)).size;
  } catch {
    /* left null — the check below reports it */
  }
  g.check(
    `og:image resolves in dist (${inDist})`,
    bytes !== null && bytes > 0,
    bytes === null
      ? `${file} does not exist — the tag unfurls as no card at all`
      : `${file} is empty`,
  );
}

g.report(`checked across ${pages.length} built page(s)`);
