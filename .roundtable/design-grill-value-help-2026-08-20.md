# Design grill — /patterns/value-help (2026-08-20)

Batch 5 of the /design-grill sweep (roadmap 58.1) — final batch. Measured
live, bind-mounted container, both themes.

## Step 1 — the decision

**Already correct.** *"Who uses it: anyone typing a code they cannot
remember — a buyer picking a material out of forty thousand, a clerk
choosing a cost centre; dozens of times a day, inside a form they are
part-way through. What 'done' looks like: the right code is in the field,
and the reader is back where they were with nothing else lost."* Not a
finding.

## Findings

**None.** Every Anatomy claim checked against the live dialog and against
`check-claims.mjs`'s coverage:

- **Search narrows the results and the count follows** — verified by the
  gate with a real typed search, not eyeballed.
- **Filtering to nothing shows the FILTERED empty, not a bare header row**
  — verified live; the table container hides alongside the header when the
  result count is zero, matching the States table's own distinction between
  "no data at all" and "filtered out."
- **Picking fills the field, closes the dialog, and returns focus to the
  field** — verified by the gate, and the JS comment explains WHY focus
  goes to the field rather than the trigger button: *"they just chose a
  value and the next thing they do is carry on through the form"* — a
  measured UX reason (closing a modal from an inner button click leaves
  focus on `<body>` otherwise), not a default.

## What's already strong

- **The empty state's own copy states the real number**: *"Six materials
  exist — none of them match"* — proving the filtered-empty distinction
  with an actual count rather than a generic "no results" message.
- **The Data contract explicitly rejects the naive approach**: *"Forty
  thousand materials never reach the browser"* and *"picking returns the
  whole record, not just the code... a second request to fetch what the
  picker already had is a wasted round trip"* — two specific over-
  engineering traps named and avoided.
- **Debounce is stated as server-side of the keystroke**, with the demo's
  own client-side filtering explicitly caveated as a simplification ("only
  because six rows fit in the page") — the docs don't let the simplified
  demo imply a simplified real contract.
- **The picker button reads "Find…" not a bare icon**, keeping the trigger
  self-explanatory without relying on an icon-only affordance a screen
  reader would need `aria-label` to rescue (which it also has, redundantly
  correct).

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener | **keep** | already states who/what-done |
| Search narrows + count | **keep** | verified by check-claims.mjs |
| Filtered empty vs no-data empty | **keep** | verified live, matches States table |
| Focus returns to field after pick | **keep** | verified, with a measured UX reason stated in the JS comment |
| Data-volume / round-trip avoidance | **keep** | two specific traps named and avoided in the contract |
| Debounce server-side caveat | **keep** | demo's simplification explicitly flagged, not left to imply the real contract |

## Recommendation

All-keep. The strongest closing page in the sweep — every claim traces to
either a live verification or a stated measurement, and the framework's own
`check-claims.mjs` proves the three most load-bearing interactions rather
than asking a reader to trust prose.
