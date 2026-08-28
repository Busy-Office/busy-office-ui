/**
 * Gate: the generated `/patterns/` tile index (roadmap 104.1) lists exactly
 * the pattern pages that exist — never one short, never a stale tile
 * pointing at a page that's gone.
 *
 * Two independent cross-checks, both against `pattern-groups.mjs` (the same
 * source `Gallery.astro`'s sidebar and `gen-patterns-index.mjs` read, so all
 * three cannot silently disagree):
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
 *
 * @exact — every check here is set membership on file names and hrefs, not
 * a judgement call. Exempt from --self-test: there is no heuristic to fool.
 */
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { DIST, DOCS_ROOT } from './paths.mjs';
import { distPages, demoRegion } from './dist-pages.mjs';
import { assertScanned } from './gate-report.mjs';
import { PATTERN_GROUPS } from '../src/data/pattern-groups.mjs';

const patternsDir = join(DOCS_ROOT, 'src/pages/patterns');
const failures = [];

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

if (failures.length) {
  console.error(`patterns-index check FAILED — ${failures.length} pattern(s) disagree across disk, pattern-groups.mjs and the tile index:`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}
console.log(`patterns-index check passed: ${groupSlugs.size} pattern page(s) match exactly between disk, pattern-groups.mjs, and the built /patterns/ tile index`);
