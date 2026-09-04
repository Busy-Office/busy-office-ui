/**
 * Shared pattern-page extraction primitives — the complexity badge and the
 * "Components used" badge list — used by BOTH `gen-patterns-index.mjs` and
 * `gen-patterns.mjs` (Standardize finding, 2026-08-22, sweep #6).
 *
 * Before this, `COMPLEXITY_RE`/`BADGE_RE` were byte-identical copies in
 * each file, and `gen-patterns-index.mjs` carried a third independent copy
 * of the opener regex `wrong-choice-rule.mjs`'s `opener()` already owns.
 * Two generators reading a page differently is the same "two accounts
 * disagreeing" defect 94.12 and `wrong-choice-rule.mjs`'s own header warn
 * about — a third copy makes it worse, not better. The opener extraction
 * itself stays in `wrong-choice-rule.mjs` (its original home); this file
 * only holds the two regexes that had no home yet.
 */

import { readFile } from 'node:fs/promises';
import { PATTERN_GROUPS } from '../src/data/pattern-groups.mjs';
import { opener as extractOpener } from './wrong-choice-rule.mjs';
import { decodeEntities } from './html-entities.mjs';

const COMPLEXITY_RE = /complexity (\d) of 4/;
const BADGE_RE = /class="bo-badge bo-badge--type" href=\{base \+ '([^']+)'\}>([^<]+)</g;

/**
 * Turn a fragment of a page's HTML SOURCE into the TEXT it stands for: strip
 * markup, decode entity references, collapse runs of whitespace, trim. The
 * normalisation both generators apply to text pulled out of a `.astro` page
 * before it becomes JSON a reader sees.
 *
 * Hoisted here by the Standardize sweep of 2026-08-29, which is the same
 * finding this file was created for: `gen-patterns.mjs` had it as a named
 * local `stripTags`, and `gen-patterns-index.mjs` had the identical three
 * steps written inline on the opener. Byte-identical logic, two homes, both
 * feeding text into published JSON — exactly the "two generators reading a
 * page differently" defect the header above warns about.
 *
 * WHY IT DECODES, AND WHY IT IS NO LONGER CALLED `stripTags` (roadmap 265.2).
 * Stripping tags is half of "read the text out of markup"; the other half is
 * the entity references, and leaving them raw published the SOURCE spelling as
 * if it were content. It reached a reader: `/patterns/` rendered a badge whose
 * visible text was `Dashboard &amp; widgets`, because `kanban.astro` writes the
 * correct `Dashboard &amp; widgets` markup, this file captured those nine
 * characters verbatim, and Astro then escaped the `&` again on the way out.
 * Measured in the DOM over all 127 built pages: 33 text nodes on 7 pages
 * contained an entity reference, 32 of them inside `pre`/`code` where the
 * reference IS the content, and exactly that one outside.
 *
 * The rename is the point of the rename: `packages/core/scripts/
 * derive-readme-facts.mjs` holds a byte-identical `stripTags` that does NOT
 * decode, logged as a deliberate non-consolidation by 263.1 (opposite sides of
 * a package boundary — core must not import from the docs app). That entry
 * says to reopen "if either copy grows a case the other does not have". This
 * is that case, so the two must not keep sharing a name that says they still
 * agree. Core's copy is correct as it stands: `readme-facts.json` carries **0**
 * entity references, so it has nothing to decode
 * (`python3 -c "import json,re; print(len(re.findall(r'&(?:[a-zA-Z]+|#\\d+|#x[0-9a-fA-F]+);',
 * open('packages/core/src/data/readme-facts.json').read())))"`).
 *
 * ORDER IS LOAD-BEARING: strip, THEN decode. Decoding first turns `&lt;b&gt;`
 * into `<b>`, which the tag strip then deletes as if it had been markup —
 * losing text instead of reading it.
 *
 * NOT applied to `wrong-choice-rule.mjs`'s tag strip, which is deliberately
 * only the first step: it feeds a `/^\s*(Not|Never|…)/` test that needs the
 * ORIGINAL leading whitespace, so collapsing and trimming there would change
 * what the clause detector matches.
 */
export const textOf = (s) => decodeEntities(s.replace(/<[^>]+>/g, '')).replace(/\s+/g, ' ').trim();

/** @throws if the page has no "complexity N of 4" badge — check-page-shape should have caught this first. */
export function extractComplexity(src, slug) {
  const m = COMPLEXITY_RE.exec(src);
  if (!m) throw new Error(`${slug}.astro has no "complexity N of 4" badge — check-page-shape should have caught this`);
  return Number(m[1]);
}

/* The badge label is captured as `([^<]+)` — page SOURCE, so it carries the
   page's entity references. It goes straight into `patterns-index.json`, which
   `/patterns/index.astro` renders as a text node, so it is decoded here for the
   same reason `textOf` decodes; it cannot use `textOf` itself because the
   capture already excludes tags and this must not collapse a label's own
   spacing. */
export function extractComponents(src) {
  return [...src.matchAll(BADGE_RE)].map(([, href, label]) => ({ href, label: decodeEntities(label) }));
}

/**
 * The walk both generators do: every group, every pattern page in it, read and
 * normalised the same way. `buildTile` receives the per-page context and
 * returns whatever that generator's tile shape is — which is the ONLY thing
 * the two differ in.
 *
 * Hoisted by the Standardize sweep of 2026-08-29, and the sweep before it is
 * why: consolidating `textOf` made the two walks share one MORE identical
 * line, which took the duplicate detector from one window to two over the same
 * region. A fix that lengthens a duplicated run is a signal to extract the run,
 * not to stop at the line.
 */
export async function patternGroups(patternsDir, buildTile) {
  const groups = [];
  for (const { label, items } of PATTERN_GROUPS) {
    const tiles = [];
    for (const { href, label: title } of items) {
      const slug = href.replace('/patterns/', '');
      const src = await readFile(new URL(`${slug}.astro`, patternsDir), 'utf8');
      tiles.push(buildTile({ href, title, group: label, slug, src,
                             opener: textOf(extractOpener(src)) }));
    }
    groups.push({ label, tiles });
  }
  return groups;
}
