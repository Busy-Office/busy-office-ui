# Changelog

Pre-1.0: minor versions may include breaking changes; each is listed here.
Per the versioning policy (docs → Theming guide): semantic tokens, documented class
names, and `data-*`/ARIA contracts are the public API. **Per-component dist file
placement is explicitly NOT API until v1.0** — import granular files at your own
pin.

## Unreleased (0.1.0 development)

### Breaking (pre-release churn)
- `.eof-data-table__footer` moved from `pagination.css` to `data-table.css` (its
  namespace owner). Pagination-only importers must also import the data-table file
  to style the footer.
- Dropdown rebuilt from `<details>` disclosure to native `[popover]` (top layer);
  markup contract changed — see the Dropdown docs page.
- `initDialogs()` no longer accepts a root argument (delegation made it a no-op).
- Firefox floor raised 121 → 128 (`content` alt-text syntax).

### Added
- Slices 1–3: tokens/density/dark theme, primitives, button, badge, forms
  (fields/sections/inline edit), dense data table (selection/pagination/filters/
  saved views), tabs, dropdown, alerts/toasts, navigation (sidebar/off-canvas),
  dialog, dashboard (widgets/stat tiles), approval timeline, audit trail, stepper.
- JS behaviors (delegation, call-once): dialogs, data tables (+`refreshDataTable`),
  tabs, dropdowns, alerts.
- Build rule: every `@container` query is named (enforced at build time).

### Design reviews
- `.roundtable/grill-2026-08-11.md` (slice 1), `grill-2026-08-12.md` (slice 2),
  `grill-2026-08-12-slice3.md` (slice 3) — findings, gates, and fix outcomes.
