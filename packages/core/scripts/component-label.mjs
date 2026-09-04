/**
 * Shared default-label derivation — the one rule that turns a component's CSS
 * directory name into the sidebar label it gets when its header declares no
 * `@label`.
 *
 * extract-api.mjs and new-component.mjs each carried their own copy
 * (Standardize sweep, 2026-09-04). Byte-identical apart from the parameter
 * name, and kept that way by a comment in new-component.mjs instructing the
 * next editor to spell it "the SAME way extract-api.mjs's defaultLabel()
 * spells it".
 *
 * WHY THIS ONE IS WORTH A MODULE WHEN TWO COPIES USUALLY ARE NOT.
 * bcd-compat.mjs's header asks that question of itself and answers it from the
 * cost its own gate paid. The answer here is different, and stronger: these two
 * copies are not merely alike, they are COMPARED AGAINST EACH OTHER at runtime.
 * new-component.mjs stamps an `@label` into the new CSS header only when the
 * requested label differs from the derived default —
 *
 *     `@category ${group}${label === derivedLabel ? '' : `\n   @label ${label}`}`
 *
 * — so the two spellings meet in an equality test, and any disagreement between
 * them is silently written into a shipped file. That is not a hypothetical: it
 * happened on 2026-09-03, inside the wake that introduced the second copy.
 * `pascal` (`(^|-)([a-z])` → upper) derived "Probe Widget" where the extractor
 * derives "Probe widget", so a probe run stamped a redundant `@label` saying
 * exactly what the default already said. That wake fixed it by hand-copying the
 * extractor's derivation instead of sharing it, which removes the symptom and
 * leaves the mechanism.
 *
 * Nothing else folds. The two scripts stay different in what they ASK — the
 * extractor reads a header that exists, the scaffolder decides whether to write
 * one — and only the derivation both perform identically lives here.
 */

/** Title-case a component's CSS directory name the way the sidebar reads it:
 *  hyphens become spaces and only the FIRST letter is capitalised, so
 *  `tree-table` → "Tree table", never "Tree Table". */
export function defaultLabel(dir) {
  const words = dir.replace(/-/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}
