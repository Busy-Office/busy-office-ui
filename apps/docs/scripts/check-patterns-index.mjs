/**
 * Gate: the generated `/patterns/` tile index (roadmap 104.1) lists exactly
 * the pattern pages that exist — never one short, never a stale tile
 * pointing at a page that's gone.
 *
 * Three cross-checks. The first two are against `pattern-groups.mjs` (the same
 * source `Gallery.astro`'s sidebar and `gen-patterns-index.mjs` read, so all
 * three cannot silently disagree); the third is against the built pattern
 * pages themselves:
 *
 *  1. Source-level: every `.astro` file under `src/pages/patterns/` (besides
 *     the index itself) is listed in `pattern-groups.mjs`, and vice versa.
 *     Catches a page added to disk but never wired into a group, or a group
 *     entry whose file was deleted/renamed.
 *  2. Built-output-level: the BUILT `/patterns/` page actually renders a
 *     tile linking to every one of those pages, and renders no tile linking
 *     anywhere else. Catches the index template silently dropping or
 *     duplicating a tile even when the source-level list is correct — the
 *     failure `check-components-used.mjs` exists to catch for a sibling
 *     claim (roadmap docs' "verify the RENDERED artefact" rule).
 *  3. `byComponent` (roadmap 249.18): the component→patterns inversion the
 *     same generator emits, re-derived here from the BUILT pages' rendered
 *     "Components used" hrefs. Deliberately NOT compared against the `groups`
 *     sitting beside it in the same JSON — one script writes both, so that
 *     comparison is self-consistent by construction and could never fail.
 *
 * @exact — every check here is set membership on file names and hrefs, not
 * a judgement call. Exempt from --self-test: there is no heuristic to fool.
 */
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, DOCS_ROOT } from './paths.mjs';
import { distPages, demoRegion } from './dist-pages.mjs';
import { assertScanned } from './gate-report.mjs';
import { PATTERN_GROUPS } from '../src/data/pattern-groups.mjs';
import { REDIRECTS, resolveHref } from '../src/data/redirects.mjs';

const patternsDir = join(DOCS_ROOT, 'src/pages/patterns');
const failures = [];
let builtBadgeLinks = 0;

// ---------- 1. source-level: disk vs. pattern-groups.mjs ----------
const diskSlugs = new Set(
  (await readdir(patternsDir))
    .filter((f) => f.endsWith('.astro') && f !== 'index.astro')
    .map((f) => f.replace(/\.astro$/, '')),
);
const expectedHrefs = new Set(PATTERN_GROUPS.flatMap((g) => g.items.map((i) => i.href)));
const groupSlugs = new Set([...expectedHrefs].map((h) => h.replace('/patterns/', '')));

assertScanned(diskSlugs.size, 'pattern page files', 'src/pages/patterns/ is empty or moved');
assertScanned(groupSlugs.size, 'pattern-groups.mjs entries', 'pattern-groups.mjs listed nothing');

for (const slug of diskSlugs) {
  if (!groupSlugs.has(slug)) {
    failures.push(`patterns/${slug}.astro exists but pattern-groups.mjs does not list it — it will never get a sidebar entry or an index tile`);
  }
}
for (const slug of groupSlugs) {
  if (!diskSlugs.has(slug)) {
    failures.push(`pattern-groups.mjs lists /patterns/${slug}, but src/pages/patterns/${slug}.astro does not exist`);
  }
}

// ---------- 2. built-output-level: the rendered index page ----------
const pages = await distPages(DIST);
const indexPage = pages.find((p) => p.url === '/patterns/');
if (!indexPage) {
  failures.push('no built /patterns/ page found at dist/patterns/index.html — did the index route get removed?');
} else {
  const region = demoRegion(indexPage.html);
  const renderedSlugs = new Set(
    [...region.matchAll(/\/patterns\/([a-z-]+)/g)].map((m) => m[1]),
  );
  for (const slug of groupSlugs) {
    if (!renderedSlugs.has(slug)) {
      failures.push(`/patterns/ index has no tile linking to /patterns/${slug}`);
    }
  }
  for (const slug of renderedSlugs) {
    if (!groupSlugs.has(slug)) {
      failures.push(`/patterns/ index has a tile linking to /patterns/${slug}, which pattern-groups.mjs does not list`);
    }
  }
}

// ---------- 3. byComponent: the shipped inversion vs. the BUILT pattern pages ----------
/* Roadmap 249.18. `gen-patterns-index.mjs` builds `byComponent` from the
   `.astro` SOURCE, via pattern-extract.mjs's `href={base + '…'}` regex. This
   arm rebuilds it from the BUILT pages' rendered hrefs, which that regex never
   sees — so a stale committed JSON, a source badge the regex missed, and a
   hand-edit of the generated file each show up as a disagreement. Checking the
   key against the `groups` in the same file would be self-consistent by
   construction, which is the reconciliation trap CLAUDE.md names: reconcile
   against the SOURCE, not against the argument.

   Both sides resolve through redirects.mjs. A redirect is a stub page, not a
   rewrite, so the built markup still says `/components/nav` — matching hrefs
   literally is what produced the false `sidebar-nav` zero in 249.9's audit. */
const base = (process.env.DOCS_BASE ?? '').replace(/\/$/, '');
const shipped = JSON.parse(await readFile(join(DOCS_ROOT, 'src/data/patterns-index.json'), 'utf8')).byComponent;
if (!shipped) {
  failures.push('patterns-index.json has no byComponent key — gen-patterns-index.mjs did not run, or ran an older version');
} else {
  const BUILT_BADGE_RE = /class="bo-badge bo-badge--type"[^>]*href="([^"]+)"/g;
  const built = {};
  for (const slug of groupSlugs) {
    const page = pages.find((p) => p.url === `/patterns/${slug}/`);
    if (!page) {
      failures.push(`no built page at dist/patterns/${slug}/ to re-derive byComponent from`);
      continue;
    }
    for (const [, href] of page.html.matchAll(BUILT_BADGE_RE)) {
      builtBadgeLinks++;
      const target = resolveHref(base && href.startsWith(base) ? href.slice(base.length) : href);
      (built[target] ??= new Set()).add(`/patterns/${slug}`);
    }
  }
  assertScanned(builtBadgeLinks, '"Components used" links in built pattern pages', 'the badge markup changed — this arm is matching nothing');

  for (const [slug, patterns] of Object.entries(shipped)) {
    const fromBuilt = [...(built[`/components/${slug}`] ?? [])].sort();
    const a = patterns.join(' '), b = fromBuilt.join(' ');
    if (a !== b) {
      failures.push(
        `byComponent["${slug}"] disagrees with the built pattern pages — ` +
          `patterns-index.json says [${a || '(none)'}], the built pages say [${b || '(none)'}]; ` +
          're-run gen-patterns-index.mjs',
      );
    }
  }
  // A component page cited by a built page but absent from the key is a
  // silently-dropped badge, which the loop above cannot see.
  for (const href of Object.keys(built)) {
    const slug = href.startsWith('/components/') && href.slice('/components/'.length);
    if (slug && !(slug in shipped)) {
      failures.push(`built pattern pages cite /components/${slug}, which byComponent has no entry for — component-nav.mjs's ALL_ITEMS does not reach it, so no card would ever show it`);
    }
  }
  // Single-hop resolution is an assumption redirects.mjs states; hold it here.
  for (const [from, to] of Object.entries(REDIRECTS)) {
    if (to in REDIRECTS) failures.push(`redirects.mjs chains ${from} -> ${to} -> ${REDIRECTS[to]}; resolveHref follows one hop only`);
  }
}

if (failures.length) {
  console.error(`patterns-index check FAILED — ${failures.length} pattern(s) disagree across disk, pattern-groups.mjs and the tile index:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(
  `patterns-index check passed: ${groupSlugs.size} pattern page(s) match exactly between disk, pattern-groups.mjs, and the built /patterns/ tile index; ` +
    `byComponent's ${Object.keys(shipped ?? {}).length} entries agree with the built pages' ${builtBadgeLinks} "Components used" link(s)`,
);
