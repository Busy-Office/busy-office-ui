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

- **Slice 8 (in progress) — editable table, multi-select dropdown, searchable
  dropdown**: multi-row inline edit (`data-row-edit` + opt-in
  `initRowEdit()`) — per-row dirty state (reuses the error-row visual
  channel, amber instead of red) with Save/Cancel, `bo:row-save` event for
  the consumer to persist. Multi-select dropdown (`data-multiselect` on
  `.bo-dropdown__menu` + real checkbox items) — stays open across
  selections, trigger label reflects a live selection count, no new init
  function (folded into `initDropdowns()`).

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

### Design reviews
- `.roundtable/grill-2026-08-11.md` (slice 1), `grill-2026-08-12.md` (slice 2),
  `grill-2026-08-12-slice3.md` (slice 3) — findings, gates, and fix outcomes.
