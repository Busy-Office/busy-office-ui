# busy-office-ui — Design Document

A CSS-first ERP UI framework. Semantic components, not utility soup. Pure HTML + CSS
foundation with minimal TypeScript behaviors, built on modern CSS (`@layer`, `:has()`,
container queries, native `<dialog>`), designed to stay maintainable across hundreds of
ERP screens.

## Principles

1. **CSS-first.** Every component's VISUALS work with plain HTML + a class. Small
   optional JS behaviors exist where the platform has a gap (dialog focus-loop) or
   where accessibility demands state the CSS can't announce (table selection: live
   "n selected" count, functional select-all). CSS-only patterns cover visuals, never
   semantics — the docs recipes always show both halves.
2. **Semantic components over utilities.** `.bo-data-table`, not forty utility classes
   per cell. A tiny curated utility set (`.bo-u-*`) exists as an escape hatch.
3. **Native elements first.** `<dialog>`, `<button>`, real `<form>`s, ARIA attributes
   styled directly (`aria-invalid`, `aria-sort`, `aria-busy`) — no parallel state-class
   system.
4. **Dependency-free core.** No runtime dependencies. HTMX support is an opt-in
   stylesheet, never a coupling.
5. **Density is a first-class dimension.** ERP users live in dense grids; density is a
   cascading token remap, adjustable globally or per-region with one attribute.

## Package layout

npm workspaces monorepo:

- `packages/core` — published as `@busy-office/ui`. Source in `src/css` + `src/js`,
  published `dist/` only.
- `apps/docs` — Astro gallery site consuming the package exactly like an external user.

Granular dist files (`tokens.css`, `reset.css`, `primitives.css`, `components/*.css`,
`htmx.css`, each with a `.min` variant) let consumers ship only what they use. Import
order is a documented contract: **tokens → reset → components** — component files carry
only their own layer and depend on tokens/reset being imported first. The all-in-one
`index.css` remains the simplest path and is cheaper once you use most components.

**Browser floor: <!-- stat:floor -->Chrome/Edge 119 · Firefox 128 · Safari 17.4<!-- /stat -->** (declared in
browserslist; FF 128 is required by `content` alt-text syntax and comfortably covers
the `popover` attribute). `:has()`-driven reveals are fail-closed below the floor;
server-set `aria-invalid` error messages have a non-`:has()` fallback rule.

## Token system (4 tiers)

Prefix `--bo-`.

| Tier | Example | Rule |
|------|---------|------|
| Raw palette | `--bo-palette-blue-500` | never consumed by components |
| Semantic global | `--bo-color-bg-surface`, `--bo-space-4`, `--bo-radius-md` | what components reference; dark theme redefines this tier under `[data-theme="dark"]` |
| Density aliases | `--bo-density-row-height`, `--bo-density-cell-padding-x` | remapped by `[data-density="compact|comfortable|spacious"]`; components use ONLY these for internal sizing |
| Component-local | `--bo-btn-bg` | declared on the component root, defaulting to globals; variants override locally |

Density row heights: compact 30px · comfortable 40px · spacious 48px (matches published
enterprise-table guidance; fixed heights keep rows virtualization-friendly).

## Cascade architecture

```css
@layer bo-reset, bo-tokens, bo-primitives, bo-components, bo-utilities;
```

Declared once in `layers.css`. Every framework rule lives in its layer. Consumer CSS
written outside any layer always wins — that is the official override escape hatch.

Class naming: `.bo-<block>`, `.bo-<block>--<variant>`, `.bo-<block>__<part>` (parts
only when a bare element selector isn't enough; a table row is `tr`, not a class).
Behavioral state via `data-state` / `data-loading` attributes and native ARIA.

## Unit doctrine (grill-audited 2026-08-12)

1. **`rem` for space and size** — spacing, density aliases, component dimensions.
   Density is rem-only and px overrides of density tokens are UNSUPPORTED: anchored
   rows clip when a low-vision user raises the root font (the failure users
   escalate); the `data-density` toggle is the density lever, giving that user
   compact rows at their readable text size. Control/row heights are MINIMUMS
   (`min-height`, or table-cell `height` — a minimum by spec) — never fixed heights
   on wrappable content (WCAG 1.4.12).
2. **`px` only for hairlines** — borders, focus rings, connectors, shadow offsets.
   Integer px + single-edge borders is also the 125% display-scaling mitigation; a
   `0.0625rem` border smears. `9999px` radius is an allowed sentinel.
3. **`ch` for character-measured mono content and docs prose only** — always a
   minimum width, never a clipping width; +1ch slack (fleet mono fonts differ);
   NEVER stored in a custom property consumed across font contexts (ch resolves per
   consuming element). The docs prose measure (~70ch) is documentation typography —
   never inside application screens.
4. **Container-query thresholds in `rem`** — beyond-conformance support for
   text-only scaling (~3% of users set a non-default browser font size; full-page
   zoom scales px and rem identically, so this is NOT a WCAG 1.4.4 mechanism).
   Never suppress zoom (`user-scalable=no`) — that IS the 1.4.4 kill switch.
   Constraint this introduces: the framework assumes an unmodified root font-size;
   injection into a host document that rescales `html` (legacy 62.5% hacks) rescales
   every rem — embed via iframe (safe: own root) instead. Email templates: out of
   scope.
5. **Compaction may compact, not delete** — container queries may tighten padding
   and density but may not `display:none` data columns unless an in-page reveal
   exists (WCAG 1.4.10 Reflow); the `col--secondary` hide requires the consumer to
   keep hidden data reachable (e.g. the row's detail view).
6. **`pt` only inside `@media print`** (10-11pt body); no `ch` widths in print
   (font substitution wraps amounts on signed approvals) — nowrap numeric/time
   columns instead. Unitless `line-height` only. `100dvh` accepted for shells
   (svh trade-off recorded). Interactive target floor: 1.5rem in every density
   tier; bare checkboxes/radios sit in a padded label or cell restoring 24px.

## State attributes: when to add one, and why there are three

`data-state`, `data-row-state`, `data-day`. That looks like drift and was
checked as such (Standardize sweep, 2026-08-19); it is not, and the reason is
worth writing down before a fourth spelling appears by accident.

**`check-markup` validates attribute VALUES from a GLOBAL map.** Merging the
calendar's day states into `data-state` would widen that set from six values to
nine — and a stepper marked `data-state="holiday"` would start passing the
checker. A separate attribute per state domain is what keeps the value check
tight. Measured, not assumed: `dataAttrValues` in `api.json` is one map keyed by
attribute name, and `check-markup.mjs` reads it directly.

So the rule:

- **Reuse `data-state`** when the values are the ones it already carries
  (`open`, `closed`, `current`, `done`, `pending`, `rejected`) — a lifecycle.
- **Add `data-<thing>-state`** when the element has its own vocabulary that
  would pollute the shared one. `data-row-state` (`dirty`/`error`/`warning`) is
  the precedent.
- **Never** add an attribute whose values duplicate an existing set under a new
  name.

`data-day` is the one that does not follow the naming half of that rule — it
should be `data-day-state`. It is left as-is deliberately, and the reason
CHANGED at the 0.3.0 release (2026-08-21): until then it had only shipped in
unreleased slices, so renaming it was merely churn. `data-day` is in the 0.3.0
tarball, so it is now published API on exactly the same footing as `data-state`
and `data-row-state` (both published since 0.1.1) — renaming any of the three is
a breaking change owed a deprecation cycle, not a sweep. The window in which
`data-day` could have been renamed for free closed when 0.3.0 was cut.

## Three standing build rules (grill-derived)

1. **Never-color-alone has two audiences.** Every state signal ships BOTH a visible
   non-color cue (glyph, text) for sighted colorblind users AND a programmatic
   channel (visually-hidden text, `aria-current`, ARIA state) for assistive tech.
   Satisfying one audience is a defect (see slice-3 grill: stat deltas vs timeline).
2. **Every `@container` query is named.** Bare queries resolve against surprise
   ancestor containers (or the viewport) — the one bug class that recurred across
   reviews. Enforced at build time by `scripts/build-component-css.mjs`.
3. **`overflow-wrap: anywhere` vs `break-word` is a decision, not a default.**
   `anywhere` also collapses the element's **min-content width to one
   character**, so its container can shrink without limit. That is the whole
   point of it in some places and a bug in others, and the framework uses both
   values — so the rule is written down rather than guessed (Standardize sweep,
   2026-08-21):

   - **`anywhere`** when the content can legitimately be ONE unbreakable token
     that must be shown whole — a filename, an ID, a URL, a filter value — and
     the container should absorb it. `.bo-file-list__name` is the worked
     example: at 390px a filename breaks across two lines, which is right,
     because truncating would hide the extension that says what the file is.
   - **`break-word`, or nothing at all,** when the content is short words in a
     container that is free to collapse. `break-word` breaks only what would
     otherwise overflow and leaves min-content at the longest WORD.

   The cost of getting this backwards was measured: `.bo-badge` copied
   `.bo-chip`'s `anywhere`, and because a table column will take every inch you
   let it, **14 of 20 badges** on `/patterns/invoice-list` @390 rendered
   "Approv/ed". A chip sits in a flex-wrap row with room; a badge sits in a
   cell. Swept afterwards: of 30 single-word elements carrying `anywhere`,
   exactly one breaks mid-word, and it is the filename that should.

## Signature modern-CSS patterns

Every `:has()` pattern below covers the VISUALS only; the docs recipe for each names
the mandatory semantic counterpart (aria-describedby + role=alert for errors, a live
selection count for bulk actions).

- **Form error visuals, CSS-only**: two separate rules —
  `.bo-form-field:has([aria-invalid="true"])` and
  `.bo-form-field:has(input:user-invalid, …)` — kept apart so browsers without
  `:user-invalid` still honor the aria path; a sibling-selector fallback covers
  non-`:has()` browsers for server-rendered errors.
- **Bulk-action toolbar**: revealed by `data-any-selected` (set by the optional
  `initDataTables()`, O(1), plus live count) or by a pure-CSS `:has(:checked)`
  fallback for zero-JS pages (documented as O(rows) on uncheck — fine for hundreds
  of rows, use the behavior for thousands).
- **Table auto-compaction**: container query on `.bo-data-table-container` tightens
  ALL density tokens coherently and hides `.bo-data-table__col--secondary` under
  480px. Precedence: an explicit `data-density` on the table or its container always
  wins — compaction only applies when neither declares one.
- **Sidebar collapse**: container query on `.bo-app-shell` collapses nav to icon-only
  under 900px of shell width (not viewport width).

## ERP optimizations (acceptance criteria)

- Sticky `<thead>`; opt-in frozen first column (`--sticky-col`); 1px low-contrast row
  dividers; `--striped` variant.
- `font-variant-numeric: tabular-nums` in tables; `__col--numeric` right-aligned;
  mono token for IDs.
- User-adjustable density: 3-line toggle recipe (attribute + localStorage) in docs.
- Keyboard-first: `:focus-visible` rings from `--bo-focus-ring-*`,
  `scrollbar-gutter: stable` on scroll containers.
- `.bo-badge` status tones (success/warning/danger/accent/neutral); foregrounds use
  `--bo-color-*-text` tokens that remap in dark mode to hold 4.5:1. Solid control
  backgrounds (`--bo-color-accent-solid`/`-danger-solid`) never theme-remap, so white
  button text stays AA in both themes.
- `@media print` rules: hide nav/toolbars, full-width black-on-white tables.
- All animations are token-duration-driven and zeroed under `prefers-reduced-motion`
  (including the HTMX settle flash) — `check:motion` refuses any animation with a
  literal duration and no override. Logical properties throughout, with **five**
  physical exceptions that each ship an explicit `[dir="rtl"]` flip, because CSS
  offers no logical form for what they use: the select chevron and tree/tree-table
  disclosure glyphs (`background-position` and `content` have no logical keywords),
  the off-canvas slide direction, and the `slide-in-inline-start` animation
  (`transform` is physical). `check:rtl` gates that count — a sixth unflipped case
  fails the build. (This bullet said "the one physical exception" until 2026-08-17,
  when executing the claim found the other four.)

## Data maintenance: four patterns, no grid (2026-08-17)

"How do I let users maintain this data?" kept resolving to "we need an editable
grid", which is the most expensive answer available and the wrong one for most
screens. A grid conflates two needs — **viewing** many rows, which the dense
data table already does, and **editing** many rows, which splits four ways.
Naming the four is what stops the question recurring:

| | Pattern | Use when | Status |
|---|---|---|---|
| **M1** | **Row-swap inline edit.** Edit swaps a display `<tr>` for a form `<tr>`; save swaps it back. One row in edit mode at a time. **A table of RECORDS** — each row is independently savable, which is what earns it a per-row Save. A table whose rows are the FIELDS of one record is a form wearing a table's layout: it commits once, at the bottom (`/patterns/field-editor`). Getting this backwards puts a Save button 228px from the field it saves. | Config and lookup tables, master-data upkeep — the SM30 case. | **Ships.** `initRowEdit()`, `data-row-state="dirty"`, `/components/inline-editing`, `/patterns/editable-grid`. |
| **M2** | **Master-detail.** Row opens the record in a dialog or side panel. | A record has more fields than fit a row, or has dependent fields and value helps. Most master-data maintenance in practice. | **Ships** (2026-08-18). `/patterns/master-detail` — the list, the panel-vs-dialog-vs-page decision, and the swap contract that keeps the list from re-rendering. |
| **M3** | **Mass change.** Select N rows, set field X = Y in one validated operation. | "Update 200 records" — the request people reach for cell editing to satisfy. | **Ships** (2026-08-17). `/patterns/bulk-actions`, the `/pos/mass-change` flow in `examples/po-app`, and two `check:po-app` assertions — an invalid target returns 422 and changes nothing. |
| **M4** | **Excel round-trip.** Download, edit in real Excel, upload, validate every row, apply the valid ones. | True bulk work. Excel beats any web grid at being Excel; the web's job is to validate and report. | **Ships.** `/patterns/staging` + the `/import` flow in `examples/po-app` (roadmap 24.3). |

Two consequences worth stating plainly:

- **M3 is the honest answer to the grid request.** One validated operation over
  200 rows is simpler *and* safer than 200 hand-edits, and it leaves an audit
  trail a grid does not.
- **Residual grid cases are real but rare** — planning layouts, price matrices,
  allocation grids, where a user tabs across cells all day. Roughly one screen
  in twenty. Those get a **token-themed AG Grid recipe** in the docs
  (`/concepts/scale`, written 2026-08-18 — the promise sat unwritten for a day,
  which is exactly how a documented decision quietly becomes no answer at all),
  never a grid engine of our own: owning virtual scroll and cell editing would double
  the maintenance surface for a solved problem. Same reasoning as charts
  (tokens → ECharts theme, documented, not owned).

## Deliberately absent (and what to use instead)

The canonical list of component-shaped things this framework refuses to ship.
It exists because an absence is invisible: a reader — or an assistant — asked
for a data grid will build one unless something says it was considered and
declined, and what to reach for instead. `gen-llms.mjs` publishes this table
into `llms.txt`, so the answer travels with the package rather than living only
in a commit message.

Process decisions and one-off naming calls stay in ROADMAP's "REFUSED, with
reasons"; this table is only for things someone would otherwise try to build.

| Deliberately absent | Use instead | Decided |
|---|---|---|
| A grid engine — virtual scroll, column virtualisation, cell editing | Server-side paging or load-more for lists; the token-themed AG Grid recipe on `/concepts/scale` for the one screen in twenty that is genuinely a spreadsheet | 2026-08-17, "four patterns, no grid" |
| An icon catalogue — the hundreds-of-glyphs set | The 12 shipped ERP glyphs, then `--bo-icon-src` for anything else: point it at Lucide, Heroicons or your own SVG and `.bo-icon` supplies sizing, `currentColor`, density and forced-colors. Measured: 12 glyphs are 10.3% of the framework, so 200 would add ~129 kB — twice everything else we ship | 2026-08-19, roadmap 40.1 |
| An illustration / spot-art set | An `<img>` you supply with `alt=""`; for glyphs `--bo-icon-src`, for a person or org `.bo-avatar`, for a tenant app tile the launcher's inline `svg` slot. Empty states are fixed by a clear sentence and the action that resolves them, not by a drawing that must be redrawn per brand and downloaded on a warehouse tablet | 2026-08-19, roadmap 40.2 |
| A client-side row virtualiser | Filter server-side and paginate; fixed row heights are maintained so a third-party virtualiser drops in cleanly | 2026-08-17 |
| Tab overflow arrow buttons | The edge fade ships and is conditional on actual overflow; add two buttons calling `scrollBy` if your users expect them | roadmap 30.1b |
| An app-icon library inside `.bo-icon` | Inline `<svg>` per tenant, or an initials chip — app icons are product content, and every consumer would ship glyphs they never use | roadmap 27.7 |
| A "field editor" component | `.bo-data-table` + `data-row-edit` + the typed inputs; see `/patterns/field-editor` | roadmap 30.2 |
| A master-detail component | `.bo-data-table` + a card, dialog or offcanvas; see `/patterns/master-detail` | roadmap 31.2 |
| `.bo-value-help` and `.bo-staging-table` | Compose combobox + dialog, and the staging pattern | Slice 24 triage |
| A second toolbar idiom | `.bo-cluster` already does it | roadmap 5a |

## HTMX integration

`@busy-office/ui/css/htmx` styles what HTMX itself sets (`.htmx-indicator`,
`.htmx-request`, `.htmx-swapping`, `.htmx-settling` flash-on-update, `[aria-busy]`).
Core CSS never references HTMX; core JS's only HTMX awareness is listening for the
`htmx:afterSwap` event *name* (a string — no dependency). `data-loading`/`data-state`
conventions work identically for HTMX, Alpine, or vanilla JS.

Swap-proofness has two distinct layers, and the contract distinguishes them:
- **Event wiring** is swap-proof by construction (document/container delegation — call
  each `init*()` once, no re-binding ever).
- **Derived state** (the `data-any-selected` attribute, the live "n selected" count) is
  recomputed automatically when an `htmx:afterSwap` bubbles through a bound table
  container; for any other swap mechanism call `refreshDataTable(container)`. Only
  newly swapped-in *containers* need an `initDataTables(e.target)` call.

## Component inventory (slices 1–3 snapshot)

> **Historical snapshot.** These two inventory sections describe the
> surface as of slice 3 and are kept for design rationale, not as a
> current census — the live inventory is GENERATED from the shipped
> artifact: `dist/behaviors.json` (16 behaviors as of 2026-08-15), the
> docs ClassRef/ApiTable tables, and `llms.txt` (24 component pages).
> Adding a component/behavior updates those automatically; this file
> only changes when the *architecture* changes.

Foundation: tokens (4 tiers + density + dark), reset, primitives (stack/cluster/grid/
app-shell/visually-hidden). Components: button, badge, form (field/input incl.
seamless inline-edit/select/checkbox-radio/section+sticky actions), data table
(selection, sticky header/column, footer), pagination, filters (bar/chips/saved
views), tabs, dropdown (popover), alerts/toasts, navbar, sidebar nav, off-canvas
drawer, dialog, dashboard (widget grid — named containers `bo-widget-grid`/
`bo-widget` — and stat tiles with two-channel delta valence), approval timeline,
audit trail, wizard stepper. Named container registry: `bo-shell`, `bo-table`,
`bo-widget-grid`, `bo-widget`, `bo-stepper`.

## JS surface

`tsc`-compiled ESM, no bundler:
- `behaviors/dialog.ts` — `initDialogs()`: document-level click delegation resolves the
  target dialog at click time; dialog-level listeners (close→`data-state`, focus trap,
  backdrop dismiss) bind lazily on first open, tracked in a WeakSet. No per-element
  binding, no serialized DOM flags — swap/clone-proof by design.
- `behaviors/data-table.ts` — `initDataTables(root?)`: select-all (with indeterminate),
  live `"n selected"` count (`aria-live` added if absent), `data-any-selected` on the
  container for the O(1) toolbar reveal; re-derives on `htmx:afterSwap` and exports
  `refreshDataTable(container)` for other swap mechanisms.
- `behaviors/tabs.ts` / `behaviors/dropdown.ts` / `behaviors/alert.ts` — tabs (roving
  tabindex, RTL-aware arrows), popover dropdown anchoring + close-on-select, alert/toast
  dismiss. All document-delegated, call-once.
- `utils/focus-trap.ts` — Tab loop that filters to visible focusables
  (`checkVisibility()` with `offsetParent` fallback).

## Tooling

PostCSS (postcss-import, postcss-nesting as polyfill only — native syntax authored,
postcss-custom-media, autoprefixer; cssnano for `.min`). Stylelint enforces the `bo-`
prefix for class names and custom properties (`@layer` wrapping is convention, not yet
lint-enforced). `scripts/build-component-css.mjs` emits the per-file dist.
