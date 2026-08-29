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

const COMPLEXITY_RE = /complexity (\d) of 4/;
const BADGE_RE = /class="bo-badge bo-badge--type" href=\{base \+ '([^']+)'\}>([^<]+)</g;

/**
 * Strip markup, collapse runs of whitespace, trim — the normalisation both
 * generators apply to text pulled out of a `.astro` page before it becomes
 * JSON a reader sees.
 *
 * Hoisted here by the Standardize sweep of 2026-08-29, which is the same
 * finding this file was created for: `gen-patterns.mjs` had it as a named
 * local `stripTags`, and `gen-patterns-index.mjs` had the identical three
 * steps written inline on the opener. Byte-identical logic, two homes, both
 * feeding text into published JSON — exactly the "two generators reading a
 * page differently" defect the header above warns about.
 *
 * NOT applied to `wrong-choice-rule.mjs`'s tag strip, which is deliberately
 * only the first step: it feeds a `/^\s*(Not|Never|…)/` test that needs the
 * ORIGINAL leading whitespace, so collapsing and trimming there would change
 * what the clause detector matches.
 */
export const stripTags = (s) => s.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/** @throws if the page has no "complexity N of 4" badge — check-page-shape should have caught this first. */
export function extractComplexity(src, slug) {
  const m = COMPLEXITY_RE.exec(src);
  if (!m) throw new Error(`${slug}.astro has no "complexity N of 4" badge — check-page-shape should have caught this`);
  return Number(m[1]);
}

export function extractComponents(src) {
  return [...src.matchAll(BADGE_RE)].map(([, href, label]) => ({ href, label }));
}
