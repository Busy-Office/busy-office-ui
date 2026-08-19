# Design grill — /patterns/filter-panel (2026-08-20)

Batch 4 of the /design-grill sweep (roadmap 58.1), alphabetical order.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"A finance or purchasing user opens the same list a
dozen times a day and narrows it a different way each time... 'Done' means
the list reloads and what is currently filtering it stays visible."* Not a
finding.

## Findings

**Anatomy's "The list" item is not shown live** — this page is scoped to
the filter bar itself, and the live demo ends at the applied-chips row with
no table underneath. Reworded to say so explicitly and point to
`invoice-list` for the paired table, rather than adding a table here (which
would duplicate `invoice-list`'s own job).

**Checked and NOT a defect, though it looked like one at first**: the live
filter bar's controls (status select, cost-centre checkboxes) are all
unselected, while the "Applied filters, always visible" chips below claim
Status: Pending / CC-4021 / Overdue are active — an apparent mismatch.
Before flagging this, checked whether the trigger-count claim ("the trigger
counts what you picked: 'Cost centre (2)'") is actually gated —
`check-claims.mjs`'s `filter panel` check does real `page.mouse` clicks on
two checkboxes and asserts `/\(2\)/` against the live trigger label. The
interactive behavior IS proven correct at the click level; the static
"Applied filters" chip row is a deliberately separate illustration of what
a filtered state looks like, not a claim that the form above is
pre-filled. Not a bug — retracted before writing it up as one.

## What's already strong

- **"An unknown key stays free text" is a real design decision with a
  named failure mode averted**: a vendor literally called `ref:99` must
  stay findable, so the page argues explicitly for NOT guessing at
  tokenization — Objective §6 (details taken seriously) done in prose.
- **The 422 handling for filters keeps values, not just fields**: "an
  impossible combination... re-render the bar WITH THE VALUES KEPT" — the
  same discipline this project applies to every other form on the site.
- **Native `[popover]` behavior is credited rather than reimplemented**:
  Escape/click-away/focus-return are stated as "none of that is our code,"
  and `check-claims.mjs` proves it live rather than trusting the claim.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done |
| Anatomy "The list" | **reword** | not in this demo, scoped intentionally; pointed to invoice-list |
| Applied-chips vs form-state "mismatch" | **not a bug** | checked against check-claims.mjs first; the interactive count behavior is proven, the static chips are a deliberate separate illustration |
| Unknown-key-stays-free-text | **keep** | named failure mode, reasoned |
| 422 handling | **keep** | values kept, consistent with every other form |
| Native popover behavior | **keep** | credited to the platform, proven by check-claims.mjs |

## Recommendation

One small reword. No removal, no new surface. One suspected defect checked
against the existing claims gate and retracted before it was written up.
