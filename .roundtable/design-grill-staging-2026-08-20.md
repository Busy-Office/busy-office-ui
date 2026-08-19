# Design grill — /patterns/staging (2026-08-20)

Batch 2 of the /design-grill sweep (roadmap 58.1). Measured live, bind-mounted
container, light + dark. Same width caveat as this batch's other two reports
(`resize_window` stuck at ~606px this wake); nothing found here depends on
exact viewport width.

## Step 1 — the decision

**The only page in this batch — and one of the few in the whole sweep so
far — whose opener already states it correctly**: *"Who uses it: whoever
maintains data in bulk... How often: month-end and whenever a supplier
sends a spreadsheet. What 'done' looks like: every submitted row either
became a record or is still on screen saying why it didn't."* Exactly the
format `record-detail`, `object-page`, and `value-help` use, and the format
this batch's other two openers (settings-admin, approval) were just found
missing. Not a finding — credited as the example the reword triage (58.2)
should match.

## Step 2 — measured inputs

```
primary buttons:  1 of 2 ("Apply 2 valid rows"; "Start over" is a ghost link)
badges:           3 (Ready / Check / Cannot import — text, not colour alone)
row tints:        2 of 4 rows (warning + error only; the "ok" row is untinted)
data table:       1 (4 rows, the validated batch)
```

## Findings

**None that rise to defect.** The one soft spot: Anatomy item 1 ("Intake —
a paste box or file upload") is described but not shown live — the page
opens directly on "The state after validation." Checked against house
style first, per the base-rate rule (don't flag a pattern this project has
already accepted elsewhere): `record-detail` and `invoice-list`'s States
tables are prose-only the same way, established as intentional in the
batch-1 grill. Here it's mirrored in Anatomy rather than States, but the
reasoning holds — showing the *result* of intake is more useful to a reader
deciding whether this pattern fits their screen than showing an empty paste
box would be. Not flagged.

## What's already strong, credited rather than searched past

- **"There is no 'ok' tint" is stated as a deliberate choice, with the
  reason**: *"a row with nothing wrong is a normal row, and a third colour
  would make the two that need attention harder to find."* This is
  Objective §7 (no decoration without state) argued explicitly in the
  page's own copy, not left for a reader to infer.
- **Two-channel verdict on every non-ok row**: tint (`data-row-state`) +
  badge word (Ready/Check/Cannot import) + a plain-language reason in the
  same cell. Checked all 4 rows; none relies on colour alone.
- **The apply button names its own count** ("Apply 2 valid rows") and the
  States table says it's `disabled`, not merely hidden, when that count is
  zero — "the control's whole job is to tell you the count is zero" is
  Objective §5 (self-explaining interface) stated as the actual reason, not
  a convention applied silently.
- **"Why this instead of an editable grid"** section pre-empts the most
  likely wrong tool reflexively reached for (a spreadsheet-style grid) with
  a real taxonomy of the four bulk-maintenance shapes and where each
  belongs — this is Q10 (would today's team build it this way from zero)
  answered in the page itself.
- **Re-validation is stated as computing verdicts from scratch**, explicitly
  because a stale "cannot import" on an already-fixed row is worse than no
  message — the same transient-state discipline `bulk-actions` already
  established, reapplied correctly here.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep — reference example** | already the "Who/How often/What done" format the rest of the sweep is reworded toward |
| Row tints + badges | **keep** | two-channel on every non-ok row, checked |
| "No ok tint" | **keep** | deliberate, reasoned, stated in copy |
| Apply button (named count, disabled at zero) | **keep** | self-explaining control, reasoned in States table |
| "Why not a grid" section | **keep** | pre-empts the likely wrong tool with a real taxonomy |
| Anatomy "Intake" (not demoed live) | **keep** | matches established house style (prose-only for the less load-bearing state) |

## Recommendation

All-keep. No prose reword, no removal, no new surface. The strongest page
in this batch — worth pointing to as the target shape when 58.2's opener
rewording touches the other two.
