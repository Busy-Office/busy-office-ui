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
 * the scaffolder's own default derived "Probe Widget" where the extractor
 * derives "Probe widget", so a probe run stamped a redundant `@label` saying
 * exactly what the default already said. That wake fixed it by hand-copying the
 * extractor's derivation instead of sharing it, which removes the symptom and
 * leaves the mechanism.
 *
 * The expression that produced "Probe Widget" was
 * `pascal.replace(/([a-z])([A-Z])/g, '$1 $2')` — pascal-case, then split back
 * apart on the case change. `pascal` ALONE gives "ProbeWidget", and it is still
 * live in new-component.mjs for `init${pascal}`, so naming it as the source of
 * the spaced value (as this comment and roadmap 257.1 first did) points at an
 * identifier that does not produce it. Corrected by the Objective grill,
 * roadmap 258.1: `node -e` on both spellings gives "ProbeWidget" and
 * "Probe Widget" respectively.
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
