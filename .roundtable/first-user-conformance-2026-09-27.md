# First-user conformance: `/patterns/kanban` and `/patterns/report` against RUNTIME_UI_CONTRACT_V0 (2026-09-27)

Contract: busy-office-erp `docs/specs/RUNTIME_UI_CONTRACT_V0.md` (§2.1, §5.1-5.3, §6.1),
read at its `e23a358`. Instrument: a Puppeteer script over the built docs (`apps/docs/dist`,
served by `serveDist`), Chrome, 1440 and 390 px, real key events; `check-markup` on the two
built pages. The script is in the session scratchpad, not the repo.

| # | Clause | Kanban | Report |
|---|---|---|---|
| 2.1 | required structure | **FAIL**: 4 stage columns, each a `<section class="bo-widget">` holding a `ul`, but the column title is `<span class="bo-widget__title">`, not a heading, and the section has no accessible name (no `aria-labelledby`), so it is not a navigable region | **PARTIAL**: one table with a caption, `th scope="col"` and a `tfoot` totals row (an ungrouped report renders as `list` per 2.1, so this is compliant); **no grouped demo**: "one table per group, each with a caption naming the group key" is not shown anywhere |
| 5.1 | state not by colour alone | PASS: the stage is the column's title text, and each card sits under it | PASS: no state is carried by colour on the page |
| 5.2 | label and `scope` | PASS: `th` not applicable; buttons have visible text | PASS: `th scope="col"` on all header cells (measured), every form control has a `label` |
| 5.3 | keyboard | **PASS with a limit**: the `Move ▾` trigger is a native button; Enter opened its popover at 1440 px (`:popover-open` true); the items are native buttons. **Not verified**: that choosing an item moves the card, because the demo is static and only closes the menu; and the page itself says the screen-reader announcement is "yours to wire" | PASS: the table's scroller is focusable (`tabindex=0`); no action needing a pointer |
| 6.1 | classes exist | PASS (`check-markup`: 1396 `bo-*` class uses, every class and attribute value exists) | PASS (same run) |

At 390 px the region and heading counts are the same; layout was not screenshot-reviewed
this wake.

## Reading
- The first user's premise "kanban does not satisfy 5.3" is **not supported** for the
  pattern as documented: a keyboard path exists. What fails is 2.1 (a heading per region),
  which their contract also requires of `dashboard`.
- The heading defect is not kanban's alone: `bo-widget__title` is a `<span>` in all 5 uses
  across the dashboard component page (3), the kanban pattern (1) and the reporting-dashboard
  pattern (1). A dashboard card has no heading and no name.
- The report gap is documentation: a grouped report is a sequence of the tables we already
  ship, but no page shows it, and the contract's rule is about exactly that.

## Not covered
Moving a card end to end (no implementation to drive); grouped report rendering; Firefox and
Safari; 390 px visual review; the screen-reader announcement (documented as the app's job).
