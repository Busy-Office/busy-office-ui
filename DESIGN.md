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

**Browser floor: Chrome/Edge 119 · Firefox 128 · Safari 17.4** (declared in
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

## Two standing build rules (grill-derived)

1. **Never-color-alone has two audiences.** Every state signal ships BOTH a visible
   non-color cue (glyph, text) for sighted colorblind users AND a programmatic
   channel (visually-hidden text, `aria-current`, ARIA state) for assistive tech.
   Satisfying one audience is a defect (see slice-3 grill: stat deltas vs timeline).
2. **Every `@container` query is named.** Bare queries resolve against surprise
   ancestor containers (or the viewport) — the one bug class that recurred across
   reviews. Enforced at build time by `scripts/build-component-css.mjs`.

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
  (including the HTMX settle flash). Logical properties throughout; the one physical
  exception (select chevron `background-position`) ships an explicit `[dir="rtl"]`
  override because background-position has no logical keywords.

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

## Component inventory (slices 1–3)

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
