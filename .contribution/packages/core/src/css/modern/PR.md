# PR draft — modern CSS platform adoption

Written to be sent to **Busy-Office/busy-office-ui**. Everything described here
currently lives in `modern/` in the consuming design-system project as an
additive `bo-modern` cascade layer, so it can be evaluated in isolation before
any of it touches `packages/core`. Upstream, these should land as edits to the
files named below, not as a new layer.

Suggested split: **seven PRs**, in this order. Each is independently
revertable, and the first two are the only ones that touch shipped colour.

---

## 1. Restate the palette in OKLCH

**File:** `packages/core/src/css/tokens/scales.css` (generated — change
`scripts/generate-scales.mjs`, not the output)

Hex is fine to store and bad to compute with: `color-mix()`, gradient stops and
relative-colour derivations all interpolate in a space where equal numeric
steps are not equal perceptual steps, which is why hand-tuned ramps drift in
the middle. In OKLCH, L *is* the contrast axis, so a ramp can be generated and
audited arithmetically instead of hand-corrected.

**Blocker before merge — this is the one item that is not yet up to the
repository's standard.** The values in `modern/color-oklch.css` are the
published OKLCH equivalents of the current hexes. They round-trip to within
~1% per channel, which is invisible, but they are *not measured*, and this
repository's rule is measured-not-rounded. Required before landing:

- sRGB round-trip per step, asserting ΔE00 < 1 against the current hex.
- Re-run the sign-off grill's contrast pairs. Two have no headroom and must be
  checked by hand: `text-muted` on `bg-muted` (documented at exactly ≥4.5:1)
  and `border-control` on `bg-surface` (~4.8:1).

If any pair moves, the hex is right and the OKLCH value is wrong.

## 2. Wide-gamut upgrade for accent and status

**File:** `tokens/scales.css`

Raises chroma on teal, green, amber and red under
`@supports (color: oklch(…))` **and** `@media (color-gamut: p3)`.

- **Lightness is not touched by a single step.** L is the contrast axis, so
  every asserted ratio is mathematically unchanged — raising C alone cannot
  move a contrast pair. This is what makes the change auditable.
- **The neutral ramp is deliberately excluded.** A wide-gamut grey is a grey
  with a colour cast.
- **Both gates are required.** Safari reports support for wide-gamut colour on
  hardware that cannot display it, so `@supports` alone pushes out-of-gamut
  chroma at an sRGB panel and gets it clipped into flat, posterised status
  fills. Feature query *and* media query, or neither.

## 3. `light-dark()` as the no-preference default

**File:** `tokens/color.css`

The note in that file argues correctly that the *library* default must be
`color-scheme: light`, because a CSS-only consumer with no theme-setter JS
under a dark OS would otherwise get a light page wearing dark scrollbars and a
dark date picker. This PR does not change that conclusion — it adds the
opt-in path the same note describes as the app's decision to make.

Mechanism: a `:root:not([data-theme])` block using `light-dark()`. The guard is
the whole design. The moment an app writes an explicit theme, every rule stops
matching and the existing `[data-theme]` blocks take over untouched, so the
documented theme-setter contract is unchanged.

Side benefit worth noting against the 2026-08-14 flicker report: for the
default case there is now **no JS in the path at all**, so the pre-paint gap
that report describes cannot exist. It does not fix the explicit-theme path.

Suggest shipping it as `tokens/color-auto.css`, imported by the app rather than
by `index.css`, so the library default stays exactly as documented.

## 4. Anchor positioning for menus and listboxes

**Files:** `components/dropdown/dropdown.css`, `components/combobox/combobox.css`

Fixes a real bug rather than a style: a dropdown on the last row of a scrolled
table opens downward and off the viewport. `position-try-fallbacks` moves that
decision to the compositor.

- `.bo-dropdown__menu` needs **no** `anchor-name` — a popover invoked via
  `popovertarget` gets its invoker as an implicit anchor, so `position-area`
  alone is enough.
- `.bo-combobox__listbox` is not a popover and needs a named anchor.
  **`anchor-scope` on `.bo-combobox` is required**, not optional: without it
  every listbox on a detail form resolves to whichever input the browser saw
  first.
- `anchor-size(width)` lets the listbox track its input, replacing a JS width
  sync.

This is the PR that lets `initCombobox` drop its positioning code and keep only
the ARIA and keyboard work, which is the part that should have been its whole
job.

## 5. `field-sizing`, `interpolate-size`, `text-box-trim`

**Files:** `components/form/input.css`, `components/dashboard/dashboard.css`,
`components/badge/badge.css` and the other dense single-line components

- **`field-sizing: content`** on `textarea.bo-input` — `rows=` is a guess made
  before the data exists. Bounded with `min/max-block-size` in `lh`, because
  the ceiling is the important half: an unbounded textarea pushes the sticky
  form actions off screen. Also applied to `--seamless` inputs, so an in-cell
  edit occupies the width of its value and does not reflow its row.
- **`interpolate-size: allow-keywords`** retires the `grid-template-rows`
  workaround behind widget collapse — a wrapper element and a rule whose
  intent is unreadable. Must be declared on `:root` (it inherits), so it needs
  a deliberate decision: it makes *every* auto-sized transition in the
  document animate.
- **`text-box-trim`** removes the font's built-in leading that makes a 12px
  uppercase label sit 1–2px high in a 30px row — currently only fixable with a
  per-component magic-number margin. Single-line boxes only: trimming both
  edges of a wrapping block collapses its interline space.

## 6. `scroll-state()` for sticky affordances

**Files:** `components/data-table/data-table.css`, `components/form/form-field.css`

The sticky `<thead>` either always casts a shadow or never does. Always is
wrong — an unscrolled table gets a shadow over nothing, which is exactly the
visual noise a dense grid cannot afford. `scroll-state(stuck: top)` asks the
only correct question, in CSS, with no scroll listener and no
IntersectionObserver sentinel. Same for the form-actions bar with
`stuck: bottom`.

`container-type` accepts both values, so `bo-table`'s existing `inline-size`
query keeps resolving alongside it.

Degrades to *no* shadow, which is deliberately the quieter failure of the two.

## 7. Pointer-aware density default

**File:** `tokens/density.css`

`comfortable` is the right default for a library that cannot know its host. An
app does know: a coarse primary pointer is a finger and needs the 44px tier.

Guarded with `:not([data-density])`, so every explicit declaration still wins —
including one compact table inside a comfortable page.

**`pointer`, not `any-pointer`, and not a width query.** A 1280px kiosk with a
touchscreen needs the glove tier and a 1280px laptop does not, so width cannot
distinguish them. `any-pointer` would flip a touchscreen laptop to spacious
even though it is mostly driven by trackpad; primary `pointer` keeps it
compact, which is correct.

Same recommendation as #3: ship as an app-imported `tokens/density-auto.css`
so the library default stays as documented.

---

## Not proposed

- **A webfont.** The system-stack decision is deliberate and correct for
  warehouse tablets on poor connections.
- **backdrop-filter / glass surfaces.** Translucency cannot be used on a
  sticky cell that must stay opaque over scrolled content, and the framework's
  flat-colour rule is what keeps a 300-row table legible.
- **Gradients, imagery, illustration.** On the refused list already.
- **Scroll-driven animations.** No honest use here; a list report is not a
  narrative scroll.
- **Softening the dense default.** Density is the product thesis. The surface
  refresh in `modern/surface.css` (radii 4/6/8 → 6/8/12, tonal separation in
  place of a universal hairline) is a consuming-project choice and is **not**
  proposed upstream — it changes shipped visuals for every consumer, which is
  a brand decision for Busy-Office, not a platform one.

## Verification checklist

- [ ] ΔE00 < 1 per palette step, hex vs OKLCH
- [ ] Full sign-off grill contrast pass, both themes
- [ ] `text-muted` on `bg-muted` and `border-control` on `bg-surface` by hand
- [ ] P3 clipping check on an sRGB panel with the media query forced on
- [ ] Explicit `[data-theme]` still overrides `light-dark()` in both directions
- [ ] Explicit `[data-density]` still overrides the pointer query
- [ ] Dropdown on the last row of a scrolled table flips instead of clipping
- [ ] Two comboboxes on one form anchor to their own inputs
- [ ] Reduced-motion zeroes the view transition and the root cross-fade
- [ ] Print layer unaffected (it must keep using raw `#000`/`#999`, not tokens)
- [ ] Gzipped size delta reported against the 15.0 kB baseline
