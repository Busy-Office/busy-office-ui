# Changelog

Pre-1.0: minor versions may include breaking changes; each is listed here.
Per the versioning policy (docs → Theming guide): semantic tokens, documented class
names, and `data-*`/ARIA contracts are the public API. **Per-component dist file
placement is explicitly NOT API until v1.0** — import granular files at your own
pin.

## Unreleased (0.1.0 development)

### Breaking (pre-release churn)
- **Prefix renamed `eof-` → `bo-`** (classes, custom properties, layer names,
  container names, keyframes). "eof" was a placeholder ("Enterprise/Office
  Framework") that read as End-Of-File; `bo-` matches the busy-office brand and
  is shorter in dense markup. Historical documents (.roundtable/, older CHANGELOG
  entries) intentionally keep the old spelling.
- `.eof-data-table__footer` moved from `pagination.css` to `data-table.css` (its
  namespace owner). Pagination-only importers must also import the data-table file
  to style the footer.
- Dropdown rebuilt from `<details>` disclosure to native `[popover]` (top layer);
  markup contract changed — see the Dropdown docs page.
- `initDialogs()` no longer accepts a root argument (delegation made it a no-op).
- Firefox floor raised 121 → 128 (`content` alt-text syntax).

### Fixed (consumer-gauntlet findings, examples/po-app)
- `./package.json` added to the exports map (`require.resolve` from consumers
  failed with ERR_PACKAGE_PATH_NOT_EXPORTED).
- Canonical table recipe now shows `name`/`value` on row checkboxes so
  selections are actually POSTable via `hx-include` or a form.

### Added
- Behaviors manifest (`dist/behaviors.json`, `./behaviors-manifest` export):
  the JS API surface — exports, contracts, DOM hooks — generated from source and
  asserted against `dist/js/index.d.ts`; drives llms.txt and the landing count
  (closes the CSS-true-but-not-JS-true gap).
- Contrast coverage guard: build fails if a component pairs text on a background
  token (incl. via `--bo-cell-bg` indirection) not in the checked PAIRS list.
- Slices 1–3: tokens/density/dark theme, primitives, button, badge, forms
  (fields/sections/inline edit), dense data table (selection/pagination/filters/
  saved views), tabs, dropdown, alerts/toasts, navigation (sidebar/off-canvas),
  dialog, dashboard (widgets/stat tiles), approval timeline, audit trail, stepper.
- JS behaviors (delegation, call-once): dialogs, data tables (+`refreshDataTable`),
  tabs, dropdowns, alerts.
- Build rule: every `@container` query is named (enforced at build time).
- **Slice 4 — Records & approval**: byline, ordered list (mono/`--plain`/
  editable rows), record-type badge, small & danger-ghost button variants,
  widget band footer; `.bo-composer` for approval-thread comments.
- **Slice 5 — Docs UX + ERP data-entry**: Amount field (`.bo-amount`); Cmd/Ctrl+K
  command palette; opt-in Motion module (8 reduced-motion-safe animations);
  the `new:component` scaffold generator + page-shape build gate (gate 7).
- **Slice 6 — Component depth + a11y hardening**: Skeleton/State (empty/error)
  components; ARIA-grid keyboard nav (opt-in `initDataGrid()`/`refreshDataGrid`
  on `.bo-data-table`); Quantity field (`.bo-quantity`, opt-in `initQuantity()`);
  Breadcrumb (`.bo-breadcrumb`); Multi-step wizard (opt-in `initWizard()`);
  Saved-view URL persistence (opt-in `initSavedViews()`); RF-scanner scan-input
  (opt-in `initScanInput()`, `bo:scan` event); `forced-colors` (Windows High
  Contrast Mode) fallbacks on button/badge/dialog/offcanvas/data-table.
- **Slice 7 — docs IA + polish**: Date field (`.bo-date`, display-only, mirrors
  Amount/Quantity); inline validation summary (opt-in `initValidationSummary()`);
  first real theme preset (`@busy-office/ui/css/brand-indigo`) with its own
  contrast-gate validation; "Data display" docs grouping.

- **Slice 8 — editable table, multi-select dropdown, searchable dropdown**:
  multi-row inline edit (`data-row-edit` + opt-in `initRowEdit()`) —
  per-row dirty state (reuses the error-row visual channel, amber instead
  of red) with Save/Cancel, `bo:row-save` event for the consumer to
  persist. Multi-select dropdown (`data-multiselect` on
  `.bo-dropdown__menu` + real checkbox items) — stays open across
  selections, trigger label reflects a live selection count, no new init
  function (folded into `initDropdowns()`). Combobox (`.bo-combobox` +
  opt-in `initCombobox()`) — WAI-ARIA APG combobox pattern, single-select
  list autocomplete with a top-layer `[popover]` listbox, `bo:combobox-
  select` event on commit.

- **Slice 9 (in progress) — Objective-review scoping follow-ups**: `bo:scan`
  live-region announcement — opt-in `aria-describedby` + `data-scan-status`
  markup contract, `initScanInput()` announces "Scanned {value}" on each
  scan for screen-reader/low-vision RF users; fully backward compatible.
  Data-table toolbar — column visibility + export (`initTableToolbar()`):
  `data-col-toggle` checkboxes (composed with the existing multi-select
  dropdown) show/hide matching `data-col` cells; `data-table-export`
  dispatches `bo:table-export {format}` for the consumer to persist. Zero
  new CSS. Load-more pagination (`initLoadMore()`): `[data-table-load-more]`
  dispatches `bo:table-load-more` on click, or on scroll-into-view with
  `data-load-more-auto` — consumer fetches/appends; zero new CSS. Login
  and App Launch pattern pages (both zero new CSS). Nine ultrareview
  findings fixed in one batch (see that commit for the list). Grouped
  rows + subtotals documented as a composition (no component needed —
  proven in po-app's `/spend`). `.bo-progress` — styled NATIVE
  `<progress>` (platform value/max + progressbar role, zero JS/ARIA),
  base + `--warning`/`--danger` tones, three new 3:1 fill-on-track
  contrast pairs (which caught a latent dark-theme `warning-strong`
  token gap, now remapped). `.bo-tree` — hierarchy navigation on native
  `<details>/<summary>` (zero JS/ARIA), explicitly navigation rather
  than an APG TreeView.

### API freeze audit (2026-08-15)

Prompted by the 1.0 exit checklist's own finding — the public API had never
had a deliberate "diff the surface, decide what's still churning" pass; this
is that pass. Result: 21 components / 165 CSS classes / 56 semantic color
tokens / 12 JS behaviors reviewed. **No renames, no removals — additive
only** since the `eof-`→`bo-` rename above (the one real breaking change
this project has made). Per-item calls on everything added in Slices 6-7
(the newest, least battle-tested surface):

- **Stable, freeze now**: Quantity (`.bo-quantity`, `initQuantity()`) and
  Date (`.bo-date`) — both deliberately mirror Amount's already-stable
  shape, already used in 2+ real docs/pattern pages each, no open design
  questions.
- **Stable, freeze now**: ARIA-grid (`initDataGrid()`), Wizard
  (`initWizard()`), Saved-views (`initSavedViews()`) — each is additive
  (opt-in, doesn't change `initDataTables()`'s existing contract), verified
  against real DOM (not just jsdom) during their own build rounds.
- **Freeze the mechanism, not the specific values**: theme presets
  (`src/css/brand/*.css`) — the FILE FORMAT and build/validation wiring are
  stable (proven this session, reusable for any future hue), but the one
  shipped preset (`brand-indigo`) is a demonstration, not a commitment to
  keep exactly that hue forever — presets are additive opt-in files, so this
  is low-risk regardless.
- **Hold one more cycle before hard-freezing**: `initScanInput()` (`bo:scan`
  event name, `data-scan-terminator` attribute) and `initValidationSummary()`
  (`data-validation-summary`/`data-validation-summary-box` attributes) — both
  are only proven on ONE real pattern page each so far (goods-receipt,
  validation-summary). The *shape* (document-delegation, same as every other
  behavior) is consistent with the frozen set, but the specific attribute/
  event names have had zero real-world usage pressure yet. Recommendation:
  treat as stable-but-not-yet-guaranteed for one more slice; revisit at the
  next freeze pass or before 1.0, whichever comes first.
- **Explicitly NOT API** (per the existing versioning policy, restated here
  for the audit's completeness): per-component dist file paths, the raw
  palette tier (`--bo-palette-*`), component-internal custom properties
  (`--bo-btn-*` etc.).

No code changed by this audit — it's a documentation/decision pass. If a
1.0 push happens before `initScanInput`/`initValidationSummary` get a real
second consumer, that's an acceptable risk to accept explicitly, not a
blocker — noting it here so it's a deliberate choice, not an oversight.

### API freeze audit — addendum (2026-08-15, post-Slices 8-9)

The first audit's own revisit condition fired: it held two items "pending
a second real consumer; revisit at the next freeze pass," and Slices 8-9
shipped both a second consumer for one of them and a batch of new surface
(4 behaviors, 1 component, several attribute contracts) the audit never
covered. Per-item calls, same honesty bar as the original:

- **Graduated to frozen**: `initValidationSummary()` — the condition was
  met exactly as stated: the Login pattern (`/patterns/login`) is now a
  second real consumer of the `data-validation-summary`/
  `data-validation-summary-box` contract, exercised live during its own
  build round. The attribute names survived a second composition without
  needing changes; freeze them.
- **Still held, one more cycle**: `initScanInput()` — goods-receipt
  remains its only real consumer. The contract was *hardened* since the
  first audit (the `data-scan-status` live-region addition, and the
  multi-ID `aria-describedby` fix from the ultrareview) — both additive,
  neither breaking — but hardening under review pressure is not the same
  as a second consumer exercising it. Same recommendation as before,
  unchanged.
- **Stable, freeze now**: multi-select dropdown (`data-multiselect`,
  `data-multiselect-label`, `data-multiselect-count`) — already TWO real
  consumers (the dropdown page's cost-center picker and the data-table
  toolbar's Columns menu), and the contract survived an ultrareview
  finding (icon-children triggers) with an additive fix.
- **Stable, freeze now**: `initRowEdit()` (`data-row-edit`,
  `data-row-state="dirty"`, `bo:row-save`) — deliberately reuses the
  already-frozen error-row-state channel, and the "behavior tracks
  intent, consumer persists" event split is now the established pattern
  across four behaviors; the shape has real precedent pressure even
  where the consumer count is one.
- **Freeze the mechanism, hold the names one cycle**: `initTableToolbar()`
  (`data-col-toggle`/`data-col`, `bo:table-export`) and `initLoadMore()`
  (`data-table-load-more`, `data-load-more-auto`, `bo:table-load-more`)
  — both mirror the frozen intent-event split, but each has exactly one
  docs demo and zero external usage pressure; same "stable-but-not-yet-
  guaranteed" bucket `initScanInput` sits in, same revisit condition.
- **Stable, freeze now**: `.bo-combobox` + `initCombobox()`
  (`bo:combobox-select`, `data-value`, `data-bo-open` is internal) — the
  markup contract is the WAI-ARIA APG combobox pattern, i.e. externally
  specified rather than invented here; the framework-specific surface is
  small and mirrors the dropdown's popover mechanics. `data-bo-open` is
  explicitly INTERNAL state, not API — consumers must not style or read
  it (restated under "Explicitly NOT API").

Net: 16 behaviors, 13 frozen, 3 held (`initScanInput`,
`initTableToolbar`, `initLoadMore`) on the same explicit, dated revisit
condition. No code changed by this addendum.

### Design reviews
- `.roundtable/grill-2026-08-11.md` (slice 1), `grill-2026-08-12.md` (slice 2),
  `grill-2026-08-12-slice3.md` (slice 3) — findings, gates, and fix outcomes.
