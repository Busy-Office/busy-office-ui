# Design grill — components batch 6 (stepper, tabs, tag-input, tree, tree-table)

2026-08-31. Live at http://localhost:8081 (podman `bo-docs-review`), chrome-devtools-mcp,
1440px light + 390px dark (theme forced via `localStorage['bo-theme-pref']` + reload,
viewport forced via `emulate({viewport:"390x844x2,mobile,touch"})` — `resize_page` floors
at 500px and cannot produce a true mobile width, per batch 5's finding).

**Result: 5 of 5 pass.** Final batch of the 40-component sweep. No removals, no
rewording forced, no rendering defects found.

## Stepper

**Decision:** wizard progress for a multi-step document — the order is asserted
(earlier steps done, later ones not yet reachable). Opener's "Not for switching
between independent sections" clause correctly routes free-order navigation to
Tabs, with a sharp tell ("if the steps can be done in any order, the numbers are
a lie").

**Step 2 — measured inputs:** 2 demo steppers (a 4-step "wide" one, a 3-step
"narrow container" one). 0 primary actions (status display, not interactive).
State is two-channel by construction and the copy says so explicitly: marker
glyph (`aria-hidden`) plus visually-hidden state text / `aria-current`.

**Checked rather than assumed:** the "labels collapse, names retained" claim —
at 1440px the wide demo's container is 640px (labels visible, widths 45–68px)
and the narrow demo's container is 352px (labels collapsed to 1px,
visually-hidden). At 390px viewport, *both* demos' containers narrow below the
collapse threshold and both show collapsed labels — this is correct
container-query behavior given the demo containers are genuinely narrower than
their own collapse breakpoint at phone width, not a doc/reality mismatch.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Tabs

**Decision:** ARIA tabs pattern — swap panels within one screen, URL and
browser Back stay put. Opener's "Not for moving between pages" clause is sharp
and gives the tell (a Back that skips the whole screen means it should have
been a real navigation, i.e. Sidebar/Breadcrumb).

**Step 2 — measured inputs:** two demos — a normal ≤5-tab strip, and a
stress-test 9-tab strip in a 34rem-capped container that intentionally
overflows and scrolls sideways with an edge fade (`mask`, not a background
gradient — the page explains why: works over any surface, respects
`forced-colors`).

**Checked rather than assumed:** at 390px, the 9-tab strip's `.bo-tabs__list`
measures `scrollWidth: 858` vs `clientWidth: 342` (516px of intentional
internal overflow) while `document.body`'s own overflow is 0 — the horizontal
scroll is contained exactly where the docs say it is, not leaking into the
page.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Tag input

**Decision:** multiple discrete values on one field with no native element to
back it (cost centers, approval-routing recipients) — same JS class as
Combobox, framework owns removal, consumer owns validated addition. Opener's
"Not for a small fixed set" clause routes 3-4 known options to checkboxes and
single-value-only to Combobox — both real, distinct wrong-choice tests.

**Step 2 — measured inputs:** 3 demos (multi-tag with dedupe, single-tag email
recipient, empty state with "no special empty-state markup needed" stated
directly). 0 primary actions.

**Checked rather than assumed:** the long email chip
(`j.kim@busy-office.example`) at 390px — `.bo-tag-input` containers measure
`scrollWidth === clientWidth` (0 overflow) in all three demos; the chip wraps
inside its field rather than forcing horizontal scroll.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Tree

**Decision:** hierarchy *navigation* (links + disclosures) for going
somewhere — cost-center trees, org drill-downs — built on native
`<details>/<summary>`, zero JS, zero ARIA wiring. Opener's "Not for rows that
carry data columns" clause draws a sharp, correct line to Tree table, naming
the actual failure mode (screen readers lose column relationships if a list of
links grows data columns).

**Checked rather than assumed:** the demo shows a `"12 open"` badge on one row
(the active `CC-4021 — Warehouse` node). Queried every badge-like element
inside `.bo-tree`: exactly one exists in the whole tree, scoped to the single
active/current node, not repeated as a per-row data column. This does not
contradict the component's own wrong-choice clause — it's a single contextual
annotation on the current position, the same category of thing as
`aria-current`, not tabular data across siblings. Worth stating explicitly
rather than leaving as an unexamined tension, since a superficial read of the
screenshot could mistake it for a data column creeping in.

390px: `document.body` overflow is 0.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Tree table

**Decision:** hierarchical rows *inside* a real data table — BOM explosions,
account rollups, org-unit budgets — where every row keeps real table columns
and screen readers keep native table browse mode. Opener's "Not for hierarchy
navigation" clause is the exact mirror of Tree's own clause, cross-linked both
directions, and states the without-JS story plainly: `data-tree-level` drives
indentation, `aria-expanded` + `hidden` drive collapse, `initTreeTable()` only
adds the toggle behavior — a server-rendered tree table is fully readable
without any JS running.

**Extra scrutiny given per this batch's brief** (framework's most structurally
complex component, per its own ADR at
`.roundtable/adr-tree-table-2026-08-16.md`): measured both demos directly
rather than trusting the page's own restraint claim —

- Demo 1 (BOM): 2 columns (`Component`, `Qty`), 4 rows, 1 disclosure toggle.
- Demo 2 (cost-center budget): 2 columns (`Cost center`, `Budget`), 5 rows, 2
  disclosure toggles.

Both demos are genuinely minimal — 2 columns each, not a kitchen-sink
demonstration of every column type the component could theoretically carry.
For the component the project's own ADR calls out as the heaviest tool in the
tables family, the docs page does not compound that weight with a
maximally-loaded demo; it shows the minimum table that motivates the
component's existence (indentation + one disclosure + real columns).

**Checked rather than assumed:** at 390px, both demo tables measure
`scrollWidth === clientWidth` (308px, 0 overflow) — no horizontal scroll
forced by column count, and screenshot confirms indentation, chevron
disclosure, and column alignment all survive the width squeeze without
truncation.

Ten questions: all yes. Q3 (can something be removed without reducing the
user's ability to decide) is worth answering explicitly given the complexity
concern: no — both demos already carry the minimum columns needed to justify
choosing this over Tree, and removing either demo would leave one of the two
real ERP shapes (BOM explosion, budget rollup) unillustrated.

**Verdict:** keep everything. No findings.

## Summary table

| Component | Verdict | Finding |
|---|---|---|
| Stepper | pass | none |
| Tabs | pass | none |
| Tag input | pass | none |
| Tree | pass | none (the "12 open" badge checked and confirmed scoped to the active node only, not a data column) |
| Tree table | pass | none (extra scrutiny for complexity confirmed both demos stay minimal — 2 columns, 4-5 rows) |
