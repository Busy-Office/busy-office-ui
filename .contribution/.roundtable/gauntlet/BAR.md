# The bar

The gauntlet loop only works against something concrete. Vague bars let the
builder argue its way past the critic. These are the bars for each artifact
class in this project, with the reference each is measured against.

## Class A — recreations (`ui_kits/`)

**Bar: indistinguishable from the reference at a glance, and exact on measurement.**

Reference: `assets/list-report-compact.png` — the one product screenshot in the
source repository (`/patterns/list-report`, `data-density="compact"`, 1440px,
light). For screens without a screenshot, the reference is the component CSS
plus the reference app's asserted markup (`apps/docs/scripts/check-po-app.mjs`).

Pass requires ALL of:
1. Blind A/B: a critic shown the reference and the render, unlabelled, cannot
   say which is which with confidence — or names only differences that are
   data, not design.
2. Every class on every element exists in `components/**/*.css`. No invented
   classes, no inline styles that restate a framework value.
3. Measured, not eyeballed: row height, control height, cell padding, font
   size at the declared density match `tokens/density.css` exactly
   (compact = 30 / 28 / 4·8 / 13px).
4. Two channels on every state signal: word or glyph AND ARIA/data attribute.
5. Contrast: `text-muted` on `bg-muted` ≥ 4.5:1; `border-control` on
   `bg-surface` ≥ 3:1; every badge ≥ 4.5:1 — measured in BOTH themes.
6. Works with JavaScript disabled to the extent the reference does (filters
   removable by href; forms submit natively).
7. No console errors. No CDN resource that fails to load.

## Class B — explorations (`explorations/`)

**Bar: a stranger to this project can operate it and can say what it improves
over the recreation it extends.**

Reference: the recreation it extends, plus DESIGN.md's principles.

Pass requires:
1. Every new visual value is a published token. Zero new hex, zero new px
   spacing, zero new font sizes. New layout classes only.
2. A five-minute blind task test: the critic is given one task ("find out why
   PO-88214 can't post", "clear everything that is yours") and completes it
   without instructions.
3. The improvement over the recreation is stated in one sentence, and the
   critic agrees it is an improvement rather than a restyle.
4. Everything in Class A items 4, 5 and 7.

## Class C — the modern platform layer (`modern/`)

**Bar: byte-identical behaviour where the feature is missing; measured
improvement where it is present; upstream-mergeable.**

Reference: stock upstream with the `modern/` import removed.

Pass requires:
1. Every rule sits behind a correct `@supports` / `@media` gate and degrades to
   stock behaviour, verified by disabling the feature.
2. Colour: ΔE00 < 1 per palette step against the hex it replaces; the full
   contrast grill passes in both themes; the two zero-headroom pairs are
   checked by hand.
3. No explicit author decision is overridden: `data-theme` and
   `data-density` set anywhere still win.
4. A PR description exists that a maintainer could merge from (`modern/PR.md`).

## Class D — foundation cards and docs

**Bar: nothing stated that the source does not support.**

Pass requires: every value traceable to a file in the repo; every claim about
tone, motion or behaviour quotable from DESIGN.md, a component sheet or a
behaviour's header comment. "Deliberately absent" is stated, never inferred.

## Budget

Three rounds per artifact. If it has not passed by round three, stop and report
the gap rather than lowering the bar.
