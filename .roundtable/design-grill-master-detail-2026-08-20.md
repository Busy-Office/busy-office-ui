# Design grill — /patterns/master-detail (2026-08-20)

Batch 5 of the /design-grill sweep (roadmap 58.1) — the final batch, 19/19.
Measured live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"A back-office user uses this all day — find the
vendor, fix two fields, move on — and 'done' means the list stays put,
keeping their scroll position, filters and sort, while only the detail
changes."* Not a finding.

## Findings

**A real, confirmed self-contradiction within the page itself — the
strongest-confidence finding of the whole sweep.** The prose right below
the live demo states plainly: *"the framework ships no tint for [selection]
... `data-row-state` covers `dirty`, `error` and `warning` — the states the
framework owns — and a 'currently open record' is application state, so
there is no `data-row-state="selected"` to reach for."* Yet Anatomy item 2,
lower on the same page, claimed the opposite: *"Selection state —
`aria-selected` plus `data-row-state="selected"` on the `<tr>`. Two
channels: the tint is visible, the attribute is programmatic."* Checked the
live markup to settle which is true: every row carries only
`aria-selected`, never `data-row-state` — the prose was right, the Anatomy
item was flatly wrong. Fixed by rewriting Anatomy item 2 to match the
page's own honest disclosure rather than contradict it.

## What's already strong

- **The gap itself (no shipped selection tint) is stated as a real
  limitation, not glossed over** — "That is a real gap, stated rather than
  papered over," with the exact workaround (`[aria-current]` custom rule)
  given rather than left to guesswork.
- **"The same record on a narrow screen" opens by naming its own past
  failure**: *"This page used to say that and show nothing — here it is,
  at any width, so the promise is inspectable."* A page explicitly
  correcting its own prior shortcut is rare and worth crediting.
- **The offcanvas width is measured and reasoned, not just described**:
  `min(18rem, 85vw)`, deliberately not full-width, "so a sliver of the list
  stays visible... and the user keeps their place."
- **"Which container" table gives a reason to avoid the others for each
  choice**, not just a reason to pick one — including redirecting a
  same-shape-different-need ask ("record has its own tabs, attachments and
  audit trail") to `record-detail` by name.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done |
| Anatomy "Selection state" | **fixed** | directly contradicted the page's own prose; corrected to match |
| Stated selection-tint gap | **keep** | a real limitation disclosed honestly, with a workaround given |
| Narrow-screen drawer (self-correction) | **keep** | the page names and fixes its own prior gap |
| Offcanvas width (85vw cap) | **keep** | measured, reasoned |
| "Which container" comparison table | **keep** | gives a reason against each alternative, not just for the choice |

## Recommendation

One real bug fixed (an Anatomy claim contradicting the page's own prose).
No removal, no new surface.
