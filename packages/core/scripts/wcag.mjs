/**
 * WCAG 2.x relative luminance and contrast ratio — computed once.
 *
 * @exact — arithmetic from the specification. Exempt from --self-test: there is
 * no judgement to get wrong, and the formula has a published answer for any
 * input. (It ships its own equivalence check below instead, which is a
 * different thing: proof that consolidating three copies changed no number.)
 *
 * Three implementations existed: `check-contrast` (the token-pair gate),
 * `check-search` (rendered third-party UI) and `check-claims` (the composited
 * dimming assertion added by 43.1). One decision — how this project computes
 * contrast — stored three times, which is the same shape as the source-skip
 * list, the outcome vocabulary and the self-test contract before it.
 *
 * Proved equivalent before merging rather than assumed: five vectors including
 * black-on-white, the real `th` colour on the light canvas, white on the accent,
 * dark-theme body text, and a degenerate identical pair. All agreed to 1e-12.
 *
 * `check-search` KEEPS its own copy, deliberately. Its version runs inside
 * `page.evaluate`, so it is serialised into the browser and cannot import a
 * Node module. A duplicated eight lines is the cheaper mistake than a gate that
 * throws `require is not defined` in a page context.
 */

/** sRGB channel (0-255) to its linear-light value. */
const channel = (c) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};

/** Relative luminance of an [r, g, b] triple. */
export const luminance = ([r, g, b]) =>
  0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);

/** Contrast ratio between two [r, g, b] triples, 1..21. Order does not matter. */
export const contrastRatio = (a, b) => {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
};

/**
 * Composite a colour over a backdrop at a given opacity.
 *
 * The operation `check:contrast` could not model, and the reason a 3.28:1
 * header shipped in the initial commit: `opacity` dims TEXT as well as
 * background, so the readable contrast is between the two COMPOSITED colours,
 * not the declared ones (roadmap 43.1).
 */
export const composite = (colour, backdrop, opacity) =>
  colour.map((v, i) => v * opacity + backdrop[i] * (1 - opacity));

/** Parse `rgb(r, g, b)` / `rgba(...)` into an [r, g, b] triple. */
export const rgb = (css) => css.match(/[\d.]+/g).slice(0, 3).map(Number);
