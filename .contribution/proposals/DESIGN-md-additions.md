# Proposed additions to DESIGN.md

Distilled from DESIGN.md, the component sheets and behaviour headers by an
outside reader. Where this restates what DESIGN.md already says, drop it; where
it says something DESIGN.md implies but does not state, that is the point.

## Content fundamentals

The framework's own voice is unusually distinct, and it is the voice to write in.

**Sentence case everywhere.** "New invoice", not "New Invoice". Titles, buttons, nav
labels, dialog headings, table headers (which are then uppercased by CSS, never by the
author). No Title Case anywhere in the product.

**Say what the thing is, then what it costs.** The house move is a claim followed by its
consequence or its evidence: "Density is a first-class dimension. ERP users live in dense
grids." · "A minimum is also the WCAG 1.4.12 answer — text that grows must be able to push
the bar taller instead of being clipped by it."

**Decisions are recorded, including refusals.** The docs carry a "What it is not" list and
a "Deliberately absent (and what to use instead)" table, because "an absence is invisible:
a reader — or an assistant — asked for a data grid will build one unless something says it
was considered and declined." When you write UI copy that removes an option, say so and say
what to use instead.

**Numbers are measured, not rounded.** "14 of 20 badges rendered 'Approv/ed'" · "30/40/48px
rows" · "compact 30px · comfortable 40px · spacious 48px". If a figure appears, it came from
a measurement — never invent one, and never round 5px to 4px to make a grid look tidy.

**Second person for instructions, never first person for the product.** "Copy `dist/` into
your asset pipeline" · "your app owns the data layer". The framework is "the framework" or
"core", never "we".

**Errors name the cause, not the failure.** "Cost center is closed for posting", not
"Invalid input". "3 line items failed validation. Fix the flagged rows and post again." The
message that ships with a state is the state's non-colour channel, so it has to carry the
information.

**Empty states are a sentence and an action.** "No invoices match these filters." + "Clear
the cost-center filter to widen the search." + a Clear filters button. Never an
illustration — the framework deliberately ships no spot art, because "empty states are
fixed by a clear sentence and the action that resolves them, not by a drawing that must be
redrawn per brand and downloaded on a warehouse tablet."

**ERP nouns, in full.** Cost center, goods receipt, posting period, purchase order, line
item, master data, saved view, value help, bin, unit of measure. Codes appear as codes
(`INV-10234`, `CC-4021`, `SKU-88213`, `100042`) and are set in mono.

**No emoji. Anywhere.** Not in docs, not in UI, not in commit-adjacent copy. Glyphs come
from the icon set; state cues are glyphs or words.

**No exclamation marks, no encouragement, no personality.** "Posted." is the whole
confirmation. The tone is a colleague who is precise and slightly tired.

## Visual foundations

**Colour.** A teal accent — the "ledger ink" brand — kept deliberately cyan-teal so it can
never be confused with the reserved success green. `--bo-color-accent` is teal-700
(#0f766e); solid controls use `--bo-color-accent-solid` (also #0f766e) and never remap in
dark mode, so white button text stays AA in both themes. Neutrals are the gray ramp
(#f9fafb canvas → #111827 primary ink). Status is green/amber/red, each with a `-subtle`
fill and a separate `-text` tone that remaps in dark mode to hold 4.5:1. Raw palette steps
(`--bo-palette-*`) are never consumed by a component; components read the semantic tier.
Re-branding means remapping that one tier — six shipped brand files (cobalt, navy, indigo,
violet, forest, graphite) do exactly that and touch nothing else.

**Type.** System stacks, no webfonts: `system-ui, -apple-system, "Segoe UI", Roboto,
sans-serif` and `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, monospace`. Six absolute
size steps, and the ERP body default is **14px**, not 16px. Three weights (400/500/600) —
600 is as heavy as this system goes. Two line heights: 1.25 tight for headings and stat
values, 1.5 for everything else. One ratio exists in the whole scale
(`--bo-font-size-mono-inline: 0.9em`) because inline mono renders optically larger than the
sans and must track its host. `font-variant-numeric: tabular-nums` on every table and every
amount.

**Space and density.** Ten space steps, 0 → 3rem. rem for space and size, px only for
hairlines (borders, focus rings, connectors, shadow offsets — an integer px border is also
the 125%-display-scaling mitigation; `0.0625rem` smears). Density is the headline idea:
`data-density="compact|comfortable|spacious"` on `<html>` or any wrapper remaps
`--bo-density-*` — 30/40/48px rows, 28/36/44px controls, 13/14/16px text — cascading and
overridable per region. Control heights are always `min-height`, never fixed, so text that
grows pushes rather than clips. A fourth, tighter auto tier exists for a table narrower than
30rem.

**Backgrounds.** Flat colour, full stop. `--bo-color-bg-canvas` behind the page,
`--bo-color-bg-surface` for panels and tables, `--bo-color-bg-muted` for table headers and
dialog footers. **No gradients, no imagery, no patterns, no textures, no illustration.** The
only image in the entire repository is one documentation screenshot. There is no photography
direction because there is no photography.

**Borders and radii.** One hairline width (1px) and one border colour tier
(`--bo-color-border-default`), with `-strong` for emphasis and `-control` (gray-500, ~4.8:1)
where a border is the only affordance an input has. Four radii: 4px for messages and
in-cell chips, 6px for buttons, inputs, cards and tables, 8px for dialogs, and `9999px` for
badges, chips and avatars. Nothing is softer than 8px.

**Cards.** A card is `background: bg-surface` + `1px solid border-default` +
`radius-md` — **no shadow**. Elevation is reserved for things that actually float. A
`Widget` adds an optional header separated by a hairline and an optional muted footer band.

**Shadows.** Five, all subtle, all pointing down except one: `sm` (0 1px 2px / 5%) for a
table message, `md` for dropdowns and toasts, `lg` for the toast region, `dialog` (0 20px
25px / 15%) for modals, and `up` (0 -4px 6px / 10%) for a bar docked to the bottom, whose
content sits above it. No inner shadows except two functional ones: the 3px inset
inline-start stripe marking a dirty or errored table row.

**Transparency and blur.** Interaction overlays only: `rgb(0 0 0 / 0.04)` hover and
`rgb(0 0 0 / 0.08)` active, inverted to white in dark mode. The modal scrim is
`rgb(0 0 0 / 0.4)` and deliberately *not* remapped for dark. **No backdrop-filter, no
frosted glass, anywhere.** Translucency is never used for a sticky table cell, which must
stay opaque over scrolled content — that is what `--bo-color-bg-hover` (an opaque hover
surface) exists for.

**Motion.** Three durations (100/150/300ms) and exactly one easing curve,
`cubic-bezier(.4, 0, .2, 1)`. No bounce, no spring, no overshoot, no attention-seeking
animation. Everything is token-driven, and under `prefers-reduced-motion` the three
duration tokens go to 0ms at the root, stopping every transition at once — a build gate
refuses any animation with a literal duration and no override.

**Hover, press, focus.** Hover is the overlay tint plus ink promoted from secondary to
primary; secondary buttons go to `bg-muted`. Press is a **1px downward nudge**, pointer-only
and skipped for keyboard activation — never `scale`, which would shrink a grouped button off
its shared border. Focus is a 2px `--bo-color-focus-ring` (teal-600) ring at 2px offset from
`:focus-visible`, on everything, with `scrollbar-gutter: stable` on scroll containers.
Disabled is 0.5 opacity plus `pointer-events: none` — except on a loading button, where
dimming a solid fill would drop white text under 4.5:1, so the loading channel is
`aria-busy` + `cursor: progress` + the consumer's own label change.

**Selection.** `--bo-color-bg-selected` (teal-50, or #0b3b37 in dark) with
`accent-text` ink — the same pairing for a selected table row, a checked dropdown item, a
chosen combobox option and a pressed toggle button.

**Layout rules.** The app shell is a `100dvh` grid: fixed header, independently scrolling
sidebar and main. The nav rail is a fixed 14rem, not a fraction. Sticky things: table
`<thead>`, an opt-in frozen first column (up to three), the table toolbar and footer, and
the form-actions bar — all on a named `--bo-z-*` scale. Responsiveness is **container
queries, named without exception** (`bo-shell`, `bo-table`, `bo-widget-grid`, `bo-widget`,
`bo-stepper`, `bo-tabs`, `bo-form-section`), because a bare query resolves against a
surprise ancestor. Compaction may compact but never delete: a container query may tighten
padding, and may hide a `col--secondary` column only if the data stays reachable elsewhere.

**Two channels, always.** Every state signal ships a visible non-colour cue *and* a
programmatic one — a badge carries the word, a sorted column carries an arrow driven off
`aria-sort`, a done step carries a ✓ plus visually-hidden "(completed)", a dirty row carries
a stripe as well as a tint, an accepted scan carries a 6px frame against a rejected scan's
18px doubled one. Satisfying only one audience is treated as a defect.

**Print.** A real layer, not an afterthought: chrome disappears (navbar, sidebar,
breadcrumb, filter bar, toolbar, footer, form actions, toasts), the shell flattens to a
block, widgets force open, badges lose their fill for a 1px black border, and tables go
black-on-white with 2px header rules. Inside `@media print` a raw `#000`/`#999` is correct
and a colour token is the bug, because tokens resolve against the reader's theme.

## Iconography

- **26 CSS mask glyphs ship in `components/icon/icon.css`** and are already in this project.
  Each is an inline SVG data URI assigned to `--bo-icon-src` and painted with
  `background-color: currentcolor` through `mask-image`. 1em square, `vertical-align:
  -0.125em`, so a glyph tracks its host's font size and therefore density. Drawn on a 24×24
  grid, stroke 2, round caps, no fills.
- The set: `doc invoice cart check-circle save close truck box chart settings grid barcode
  building user list-bullet list-numbered link quote indent outdent align-left align-center
  align-right clear-format format keyboard`.
- **There is no icon font, no sprite sheet, no PNG icons, and deliberately no catalogue.**
  "An icon catalogue — the hundreds-of-glyphs set" is on the framework's refused list: every
  glyph is inlined, so cost grows strictly with set size, and a 200-icon set would cost most
  of what the rest of the framework costs.
- **Extend with `--bo-icon-src`, not with a new class.** Point it at Lucide, Heroicons or
  your own SVG and `.bo-icon` supplies sizing, `currentColor`, density tracking and
  forced-colors handling. `<Icon src="…" />` does this for you. Pasting an inline
  `<svg fill="currentColor">` is an equally first-class answer.
- **No emoji, ever**, and no unicode-as-icon except four deliberate typographic marks the
  CSS itself generates: the sort arrows (↕ ↑ ↓) on `aria-sort`, the breadcrumb `/`, the tree
  disclosure ▸ (with a ◂ RTL flip), and the select chevron (an SVG data URI in
  `background-image`). Each is generated content with empty alt text so it is never read
  aloud.
- Decorative icons take `aria-hidden="true"`; an icon-only control names *itself* with
  `aria-label`, never the icon.
- **The source repository ships no logo.** One was designed in this project on
  2026-09-06 — "Tall BO", two condensed stroke letters in the icon set's own grammar —
  and chosen from `brand/logo-directions.html`. Files and rules: `assets/README.md`.
  It is a project asset, not an upstream one; treat it as a proposal to Busy-Office.

