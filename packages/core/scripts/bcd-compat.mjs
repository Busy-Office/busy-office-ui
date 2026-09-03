/**
 * Shared BCD path walk — the one lookup both floor scripts do into
 * `@mdn/browser-compat-data`.
 *
 * derive-floor.mjs and check-rf-floor.mjs each carried their own `compatOf`
 * (Standardize sweep, 2026-09-03). Not byte-identical, but diverged only in
 * WHERE they threw — derive-floor at the first missing key, check-rf-floor
 * after the loop — while producing the same message about the same full path.
 * Two spellings of one rule, which is the drift src-css-files.mjs was
 * extracted to end on the stylesheet side.
 *
 * WHY THIS ONE IS WORTH A MODULE WHEN TWO COPIES USUALLY ARE NOT.
 * check-rf-floor.mjs's own header records the cost of the general shape, paid
 * in that file: its `--self-test` "used its own copy of the walk logic and
 * happened not to exercise this exact call, so it stayed green while the real
 * gate was inert", against a build with an unguarded `color-mix()` injected
 * straight into it. Its conclusion — *"Sharing one function is what makes a
 * bug in it show up in --self-test too"* — is the argument for this module,
 * written by the file that learned it.
 *
 * The two scripts stay deliberately different in TECHNIQUE (derive-floor asks
 * what floor the CSS supports; check-rf-floor asks whether it ever requires
 * more, unguarded). Nothing here folds that: what is shared is only the
 * dictionary lookup both do identically, never the question either asks.
 */
import bcd from '@mdn/browser-compat-data' with { type: 'json' };

/** The `__compat.support` object at `path` in BCD.
 *  `who` is the calling script's name — it leads the error, so a moved BCD
 *  key still names which gate went looking for it. */
export function compatOf(path, who) {
  let node = bcd;
  for (const k of path) node = node?.[k];
  if (!node) throw new Error(`${who}: no BCD entry at ${path.join('.')} — has the key moved?`);
  return node.__compat.support;
}
