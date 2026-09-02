/**
 * Shared walker for the AUTHORED stylesheet tree — `src/css`, the input the
 * CSS-invariant gates and reports read.
 *
 * check-contrast.mjs, check-sticky-layers.mjs and report-css-repeats.mjs had
 * BYTE-IDENTICAL copies of this generator (Standardize sweep, 2026-09-02 —
 * three md5-identical bodies, plus a fourth in generate-scales.mjs that is
 * deliberately different, see below). It is the same drift dist-pages.mjs was
 * extracted to end on the docs side, and that gate's header records the cost
 * of leaving it: the convention regrew twice, and "a script with its own
 * walker works fine right up until its hand-copied exclusion set disagrees
 * with everyone else's."
 *
 * WHY THIS IS A SECOND CHOKEPOINT AND NOT AN OPTION ON dist-css.mjs.
 * That module's header refuses exactly that fold — "those walk different
 * trees with different filters, and folding four different rules behind one
 * options bag would be a worse abstraction than two honest copies"
 * (2026-08-17). It is right, and this module obeys it rather than reversing
 * it: dist walks `dist/css` and drops `.min.css`; this walks `src/css` and
 * drops nothing. Two trees, two rules, two modules — what is consolidated
 * here is only the three copies that were already the SAME rule.
 *
 * DELIBERATELY NOT USED BY generate-scales.mjs, for that same reason. Its
 * copy excludes `/scales/` and `scales*` because it must not read its own
 * generated output back as input; that is a third rule, and it stays an
 * honest copy carrying its own reason.
 */
import { readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const srcCssRoot = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'css');

/** Every stylesheet under `dir` (default: the whole authored tree),
 *  recursively. No exclusions — src/css holds no minified twins, and the two
 *  generated files under it (tokens/scales.css, scales/extended.css) both
 *  SHIP, so a report over "the authored tree" is right to include them. */
export async function* srcCssFiles(dir = srcCssRoot) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* srcCssFiles(p);
    else if (e.name.endsWith('.css')) yield p;
  }
}
