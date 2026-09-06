/**
 * The one place this repo derives WHICH `bo-icon--*` glyphs are deprecated.
 *
 * Two consumers now ask that question — `/components/icon`'s own page-local
 * guard (roadmap 292.4) and the tree-wide `check:deprecated-icons` (292.9) —
 * and the answer is a parse of a comment structure in the shipped stylesheet,
 * not a constant. Two copies of that parse is the drift the Standardize
 * playbook's lane 2 exists to catch, and here it would drift into two gates
 * disagreeing about which glyphs a reader should stop being handed, with
 * nothing to say so.
 *
 * DERIVED, never hand-typed. The list was `['settings','barcode','building',
 * 'user']` against four `/* DEPRECATED` blocks in the same stylesheet, so
 * deprecating a fifth would have left every consumer of that constant silently
 * one glyph short.
 *
 * Read from the UNMINIFIED shipped css — minification drops the comments that
 * carry the deprecation, so the minified file cannot answer this at all.
 */
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);

/**
 * Parse a stylesheet's deprecated glyph names, reconciled against a raw count
 * of the markers themselves.
 *
 * The reconciliation is the point: a regex that silently stopped matching would
 * report an EMPTY deprecated set, and an empty set makes every consumer report
 * a clean tree. Counting the raw thing is CLAUDE.md's mirror rule — a derived
 * artefact may not decide, on its own, what it failed to see.
 *
 * The trade, named rather than discovered: the marker count is a raw text
 * count, so prose in `icon.css` that merely NAMES the word DEPRECATED breaks
 * the build. That is the assertion-trips-on-its-own-explanation shape CLAUDE.md
 * warns about — but it fails LOUDLY with both counts in the message, which is
 * the safe direction of that trap, and the alternative (matching only the
 * structural form) is what would silently under-report. Accepted deliberately,
 * carried over verbatim from the guard this was lifted out of.
 *
 * @param {string} css  unminified stylesheet source
 * @returns {{glyphs: string[], markers: number}}
 */
export function parseDeprecatedGlyphs(css) {
  const glyphs = [...css.matchAll(/\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*\.bo-icon--([a-z0-9-]+)/g)]
    .filter((m) => m[0].includes('DEPRECATED'))
    .map((m) => m[1]);
  const markers = (css.match(/DEPRECATED/g) ?? []).length;
  if (glyphs.length !== markers)
    throw new Error(
      `icon: parsed ${glyphs.length} deprecated glyph(s) from the shipped css, but it carries ` +
        `${markers} DEPRECATED marker(s). Consumers publish that set as the answer to "which glyphs ` +
        'should I stop using", so a partial parse must fail rather than under-report.',
    );
  return { glyphs, markers };
}

/** The shipped, unminified `icon.css` source. */
export function readIconCss() {
  return readFileSync(require.resolve('@busy-office/ui/css/components/icon'), 'utf8');
}

/** Convenience: the reconciled deprecated glyph names from the shipped css. */
export function deprecatedGlyphs() {
  return parseDeprecatedGlyphs(readIconCss()).glyphs;
}
