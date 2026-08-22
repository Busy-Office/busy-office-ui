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

/** @throws if the page has no "complexity N of 4" badge — check-page-shape should have caught this first. */
export function extractComplexity(src, slug) {
  const m = COMPLEXITY_RE.exec(src);
  if (!m) throw new Error(`${slug}.astro has no "complexity N of 4" badge — check-page-shape should have caught this`);
  return Number(m[1]);
}

export function extractComponents(src) {
  return [...src.matchAll(BADGE_RE)].map(([, href, label]) => ({ href, label }));
}
