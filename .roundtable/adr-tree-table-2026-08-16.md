# ADR: tree table — plain table + disclosure buttons, NOT role="treegrid"

2026-08-16, Slice 20 item 4. Decision recorded before implementation, per
the item's Accept ("decide with evidence, record the ADR").

## Context

Hierarchical ROWS in a data table — BOM explosion, account rollups,
org-unit budgets: expand/collapse parent rows, per-level indent, normal
table columns (numeric, badges) on every row. Two candidate ARIA shapes:

1. **APG treegrid**: `role="treegrid"` + `aria-level`/`aria-expanded` on
   rows + the full grid keyboard model (roving tabindex, 2-D arrow
   navigation, Enter/collapse key semantics).
2. **Plain `<table>` + a disclosure `<button aria-expanded>`** in the
   parent row's first cell; child rows toggle `hidden`; hierarchy is
   conveyed by visible indent + the button's name/state.

## Evidence

- **Screen-reader support**: treegrid is the weakest-supported composite
  APG pattern; a plain table keeps native table browse mode (column/row
  header announcement, table navigation commands) fully working — the
  exact capability whose loss killed this project's j/k roving-tabindex
  spike ("breaks screen-reader table browse mode", Ideas log 2026-08-14).
- **Project precedent ×2**: `.bo-tree` chose native `<details>` NAVIGATION
  over APG TreeView with recorded reasoning ("reach for that heavier
  single-tab-stop composite only for file-manager-style selection
  trees"); `initDataGrid` made the grid keyboard model OPT-IN precisely
  because most ERP tables are read-mostly.
- **The use cases are read-mostly**: BOM/account-rollup screens are
  scan-and-drill, not cell-editing grids. A disclosure button is a
  bog-standard, universally-supported widget; every keyboard/SR user
  already knows it.
- **Objective check**: option 2 is the simple thing (native semantics,
  zero focus management, one small delegation behavior); option 1 is a
  large keyboard/focus surface serving no named requirement.

## Decision

Plain `<table class="bo-data-table bo-tree-table">`. Parent rows carry a
first-cell disclosure `<button class="bo-tree-table__toggle"
aria-expanded>` naming its branch; every row carries
`data-tree-level="1..6"` (explicit CSS indent rules — `attr()`-driven
calc isn't safe at the FF128 floor; 6 levels documented, deeper is a
smell). `initTreeTable()` (document delegation): toggle collapses/expands
by the document-order level model — collapse hides ALL descendants;
expand reveals direct children and only those deeper branches whose own
parents are expanded (nested collapsed state is preserved).

Two-channel: indent + chevron rotation (visible) / `aria-expanded` +
rows genuinely `hidden` (programmatic). NOT faked: no `aria-level` on
`role="row"`-in-plain-table (invalid), no treegrid semantics claimed —
the docs state plainly that programmatic level semantics require
treegrid and why we don't ship it (revisit if a real adopter's AT
workflow needs it — recorded reopen condition).

Totals interplay (documented): `data-sum-of` keeps counting collapsed
rows — collapse is a VIEW state, not a filter; totals over a hierarchy
don't change because a branch is folded.

## Amendment — 2026-08-16 (same day, post-grill)

The Slice 20 close-out grill (Consumer seat) successfully challenged two
parts of this decision's periphery, and Slice 21 item 3 amended them:
indent levels extended 6 → 12 (real engineering BOMs run 8-12 deep; the
"deeper nesting is a modelling smell" line is RETRACTED — depth is the
customer's data, not the UI's judgment), and `bo:tree-toggle` now
dispatches on every expand/collapse (the lazy-load / expand-all hook
this record originally omitted). The core decision — plain table, not
treegrid — was re-attacked by all four seats and HELD.
