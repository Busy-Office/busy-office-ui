# Design grill — /patterns/bulk-actions (2026-08-20)

Batch 3 of the /design-grill sweep (roadmap 58.1), alphabetical from here
per the item's own note (no more worst-suspect ranking signal once the
accumulation-prone screens are through). Measured live, bind-mounted
container, both themes.

## Step 1 — the decision

**Already correct.** *"Who uses it: an AP clerk clearing a queue — select
many, act once. What 'done' looks like: every selected record either
changed or explained why it didn't."* States the failure mode it exists to
prevent (a silent partial success) directly in the opener — not a finding.

## Findings

**Anatomy's first two items ("Selection," "Toolbar action") are not shown
in the live demo.** Confirmed via curl on the rendered page: zero
`type="checkbox"` and no `.bo-data-table__bulk-actions` toolbar anywhere
before the Anatomy section — the demo opens directly on "The state after a
partial failure," a static result table with no interactive selection.
Reworded rather than built: pointed both items to `/patterns/invoice-list`,
confirmed live first (1 checkbox present, `bo-data-table__bulk-actions`
present) before citing it, so the pointer is real, not assumed.

**Everything else is unusually well-argued for a pattern page** — this is
one of the strongest documents in the sweep so far:
- **"The rule that makes it honest"** section states a real bug found
  building the reference app (a stale "needs a second approver" surviving a
  colleague's approval) and the one-line fix (`delete r.bulkError` before
  recomputing) — a documented incident, not a hypothetical.
- **Mass change's four sub-rules are independently falsifiable and
  reasoned**: a bad target value is a 422 (whole-request failure, not 200
  identical row errors); per-row rules still apply per row; the response
  states count AND value; no-op rows are reported, not silently counted as
  success. Each has a one-line "why," not just a rule.
- **The keyboard walkthrough traces a real accessibility fix**: rows and
  bulk buttons share one `<form>` so implicit submission works from
  anywhere in the list, and focus-restoration by matching `id` is called
  out as load-bearing (without it, "the clerk is dropped on `<body>`").

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done, with the specific failure mode named |
| Anatomy "Selection" / "Toolbar action" | **reword** | not shown live; pointed to invoice-list, verified present there |
| "The rule that makes it honest" | **keep** | a real found-and-fixed incident, not a hypothetical |
| Mass change's 4 sub-rules | **keep** | each independently reasoned, not a bare list |
| Keyboard walkthrough | **keep** | traces a real focus-restoration fix, not generic advice |
| Two-channel row errors | **keep** | tint + badge word, checked on all 4 rows |

## Recommendation

One small reword (Anatomy pointer), landed. No removal, no new surface.
