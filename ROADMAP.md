# busy-office-ui — Roadmap

## Slice 1 — Foundation + core components (current)

- Workspace scaffolding, PostCSS + tsc tooling, `@layer` skeleton
- Tokens: palette, semantic, density (compact/comfortable/spacious), dark theme hooks
- Reset, layout primitives (stack, cluster, grid, app shell, visually-hidden)
- Components: button, form (field/input/select/checkbox-radio), badge, dense data table
  (sticky header, frozen column, `:has()` bulk actions, container-query compaction,
  tabular-nums, print styles), navbar + sidebar nav (container-query collapse), dialog
  (native `<dialog>` + focus-trap behavior)
- Opt-in `htmx.css` integration layer
- Astro docs gallery: tokens page, one page per component, composed invoice-list pattern,
  density toggle recipe

## Slice 2 — Interaction & filtering (in progress)

- [x] Tabs (roving tabindex behavior), dropdown (details-disclosure + light dismiss),
      toast/inline alerts (aria-live region recipe)
- [x] Filter bar + filter chips (saved-view pattern still open)
- [x] Pagination + table footer
- [x] Form sections (fieldset/legend) + sticky action bar
- [x] Design-grill gate fixes: swap-proof dialog delegation, initDataTables
      (select-all/live count/O(1) reveal), dark-theme text tokens, à-la-carte dist
      restructure + browser floor, control-border/muted-text contrast
- [x] Off-canvas drawer nav (native dialog variant, inherits initDialogs wiring)
- [x] Dark theme toggle in docs (light/dark, localStorage; same recipe as density)
- [x] Inline edit (.eof-input--seamless, always-a-real-input pattern) + saved-views
      pattern (chips + aria-current + dropdown, zero new CSS)
- [x] Post-grill gate 2 (2026-08-12): popover dropdown, htmx:afterSwap re-derive +
      refreshDataTable, FF 128 floor, error-row specificity, scroll-padding for sticky
      actions, live dismiss behavior, density guards — see .roundtable/grill-2026-08-12.md

## Slice 3 — ERP workflows & dashboards (in progress)

- [x] Approval workflow: status timeline (.eof-timeline), audit trail (.eof-audit);
      queue + action bar reuse the table/bulk patterns (documented)
- [x] Dashboard: stat tile (.eof-stat, proportional figures + direction×goodness
      deltas), widget grid with per-widget container queries
- [x] Wizard stepper (.eof-stepper, aria-current="step", real ✓ glyphs)
- [x] Theming guide (semantic-tier re-skin contract) + versioning policy page
- [x] Print/report layer: @page + break control + header repetition + print-only
      utilities + .eof-print-report link URLs + forced status colors; docs page
- [x] Grill slice 3 + gate worked (see .roundtable/grill-2026-08-12-slice3.md
      outcome — all 7 gate items + fast-follows fixed; container-naming build rule
      now enforced; CHANGELOG started)

## Infrastructure (parallel)

- Graphify knowledge graph of this repo with SQLite mirror (`graphify-out/graph.db`)
- Stylelint CI, visual regression harness (later), npm publish pipeline (later)
