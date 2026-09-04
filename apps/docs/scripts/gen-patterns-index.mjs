/**
 * Generates `src/data/patterns-index.json` — the tile copy for `/patterns/`
 * (roadmap 104.1) — by reading it back out of each pattern page's own
 * source, never authoring it by hand.
 *
 * Every pattern page already carries the three ingredients a tile needs,
 * each gate-guaranteed by `check-page-shape.mjs` / `check-components-used.mjs`:
 * the `demo-note` opener (who uses it / what "done" looks like), a
 * `complexity N of 4` badge, and a "Components used" list of
 * `bo-badge bo-badge--type` links. This just reads them, the same way
 * `wrong-choice-rule.mjs`'s `opener()` does for the content-score gate.
 *
 * Grouping and page membership come from `pattern-groups.mjs` — the SAME
 * list the sidebar renders from — so a pattern this script can't find is a
 * build failure here, not a silently-missing tile (the red-proved half of
 * 104.1's Accept lives in `check-patterns-index.mjs`, which checks the
 * BUILT output against the same source list).
 *
 * Same rule as api.json/rf-profile.json: never hand-edit the output.
 */
import { writeFile } from 'node:fs/promises';
import { ALL_ITEMS } from '../src/data/component-nav.mjs';
import { resolveHref } from '../src/data/redirects.mjs';
import { extractComplexity, extractComponents, patternGroups } from './pattern-extract.mjs';

const patternsDir = new URL('../src/pages/patterns/', import.meta.url);

const groups = await patternGroups(patternsDir, ({ href, title, src, opener }) => {
  // The tile shows a truncation of the same text, at a sentence boundary where
  // one exists within budget — never re-worded, so it stays extraction rather
  // than a second, driftable summary.
  const openerShort = opener.length <= 140
    ? opener
    : `${(opener.slice(0, 140).match(/^[\s\S]*[.!?](?=\s|$)/)?.[0] ?? opener.slice(0, 137).replace(/\s+\S*$/, '')).trim()}…`;
  return { href, title, opener, openerShort,
           complexity: extractComplexity(src, href.replace('/patterns/', '')),
           components: extractComponents(src) };
});
for (const g of groups) g.tiles.sort((a, b) => a.complexity - b.complexity);

const count = groups.reduce((n, g) => n + g.tiles.length, 0);

/* ---------- byComponent: the same relation, inverted (roadmap 249.18) ----------
   Every tile above already carries the components its screen is built from, so
   "which patterns use this component" is an inversion of data this file emits,
   NOT a new page-parsing generator. Roadmap 249.9's badge audit recorded the
   opposite ("a generator that does not exist, and it cannot read dist/") and
   that premise is what this key refutes; see 249.18.

   Keyed by DOCS PAGE SLUG, not component name, because a pattern links a page:
   `skeleton` and `state` share /components/state-patterns, so a name-keyed map
   would have to invent which of the two a link meant. Consumers hold
   `api.pageSlug` already.

   The key set is `component-nav.mjs`'s ALL_ITEMS, not api.json's component
   list. That module is where the generated set and the four editorial
   exceptions are already reconciled, and using api.json alone was wrong on its
   first run: `inline-editing` and `table-toolbar` are component docs pages
   that patterns DO cite and that have no CSS dir, so api.json does not list
   them and they came out as cited-but-unkeyed. The two anchor entries
   (`/components/form#dates`, `/components/dashboard#card`) collapse onto their
   own pages under resolveHref, so they add no keys.

   Every component page gets an entry, including the ones no pattern names — an
   absence has to be renderable as "no pattern uses this" rather than as a
   missing key (249.3's "absence is rendered, never blank").

   Hrefs are resolved through redirects.mjs first. Matching them literally
   reports sidebar-nav as used by zero patterns, because app-frame and
   suite-home both cite it as /components/nav; that false zero is in 249.9's
   audit, and resolving is what removes it. */
const pageSlugs = [
  ...new Set(
    ALL_ITEMS.map((i) => resolveHref(i.href))
      .filter((h) => h.startsWith('/components/'))
      .map((h) => h.slice('/components/'.length)),
  ),
].sort();
if (!pageSlugs.length) {
  throw new Error('component-nav.mjs listed no /components/* entries — core is unbuilt or api.nav changed shape; refusing to emit an empty byComponent');
}

const tiles = groups.flatMap((g) => g.tiles);
const pairs = tiles.flatMap((t) => t.components.map((c) => [resolveHref(c.href), t.href]));
if (!pairs.length) {
  throw new Error('no "Components used" links found on any pattern page — extractComponents matched nothing; refusing to emit a byComponent of all-zeros');
}
const byComponent = Object.fromEntries(
  pageSlugs.map((slug) => [
    slug,
    [...new Set(pairs.filter(([href]) => href === `/components/${slug}`).map(([, p]) => p))].sort(),
  ]),
);
const reached = pageSlugs.filter((s) => byComponent[s].length).length;

await writeFile(
  new URL('../src/data/patterns-index.json', import.meta.url),
  JSON.stringify(
    { $comment: 'GENERATED by scripts/gen-patterns-index.mjs from src/pages/patterns/*.astro — never hand-edit.', count, byComponent, groups },
    null,
    2,
  ) + '\n',
);
console.log(
  `patterns-index.json generated — ${count} pattern tile(s) across ${groups.length} group(s); ` +
    `byComponent covers ${pageSlugs.length} component page(s), ${reached} named by >=1 pattern, ` +
    `${pageSlugs.length - reached} by none, from ${pairs.length} link(s)`,
);
