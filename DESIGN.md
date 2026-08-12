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
2. **Semantic components over utilities.** `.eof-data-table`, not forty utility classes
   per cell. A tiny curated utility set (`.eof-u-*`) exists as an escape hatch.
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

Prefix `--eof-`.

| Tier | Example | Rule |
|------|---------|------|
| Raw palette | `--eof-palette-blue-500` | never consumed by components |
| Semantic global | `--eof-color-bg-surface`, `--eof-space-4`, `--eof-radius-md` | what components reference; dark theme redefines this tier under `[data-theme="dark"]` |
| Density aliases | `--eof-density-row-height`, `--eof-density-cell-padding-x` | remapped by `[data-density="compact|comfortable|spacious"]`; components use ONLY these for internal sizing |
| Component-local | `--eof-btn-bg` | declared on the component root, defaulting to globals; variants override locally |

Density row heights: compact 30px · comfortable 40px · spacious 48px (matches published
enterprise-table guidance; fixed heights keep rows virtualization-friendly).

## Cascade architecture

```css
@layer eof-reset, eof-tokens, eof-primitives, eof-components, eof-utilities;
```

Declared once in `layers.css`. Every framework rule lives in its layer. Consumer CSS
written outside any layer always wins — that is the official override escape hatch.

Class naming: `.eof-<block>`, `.eof-<block>--<variant>`, `.eof-<block>__<part>` (parts
only when a bare element selector isn't enough; a table row is `tr`, not a class).
Behavioral state via `data-state` / `data-loading` attributes and native ARIA.

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
  `.eof-form-field:has([aria-invalid="true"])` and
  `.eof-form-field:has(input:user-invalid, …)` — kept apart so browsers without
  `:user-invalid` still honor the aria path; a sibling-selector fallback covers
  non-`:has()` browsers for server-rendered errors.
- **Bulk-action toolbar**: revealed by `data-any-selected` (set by the optional
  `initDataTables()`, O(1), plus live count) or by a pure-CSS `:has(:checked)`
  fallback for zero-JS pages (documented as O(rows) on uncheck — fine for hundreds
  of rows, use the behavior for thousands).
- **Table auto-compaction**: container query on `.eof-data-table-container` tightens
  ALL density tokens coherently and hides `.eof-data-table__col--secondary` under
  480px. Precedence: an explicit `data-density` on the table or its container always
  wins — compaction only applies when neither declares one.
- **Sidebar collapse**: container query on `.eof-app-shell` collapses nav to icon-only
  under 900px of shell width (not viewport width).

## ERP optimizations (acceptance criteria)

- Sticky `<thead>`; opt-in frozen first column (`--sticky-col`); 1px low-contrast row
  dividers; `--striped` variant.
- `font-variant-numeric: tabular-nums` in tables; `__col--numeric` right-aligned;
  mono token for IDs.
- User-adjustable density: 3-line toggle recipe (attribute + localStorage) in docs.
- Keyboard-first: `:focus-visible` rings from `--eof-focus-ring-*`,
  `scrollbar-gutter: stable` on scroll containers.
- `.eof-badge` status tones (success/warning/danger/accent/neutral); foregrounds use
  `--eof-color-*-text` tokens that remap in dark mode to hold 4.5:1. Solid control
  backgrounds (`--eof-color-accent-solid`/`-danger-solid`) never theme-remap, so white
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
drawer, dialog, dashboard (widget grid — named containers `eof-widget-grid`/
`eof-widget` — and stat tiles with two-channel delta valence), approval timeline,
audit trail, wizard stepper. Named container registry: `eof-shell`, `eof-table`,
`eof-widget-grid`, `eof-widget`, `eof-stepper`.

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
postcss-custom-media, autoprefixer; cssnano for `.min`). Stylelint enforces the `eof-`
prefix for class names and custom properties (`@layer` wrapping is convention, not yet
lint-enforced). `scripts/build-component-css.mjs` emits the per-file dist.
