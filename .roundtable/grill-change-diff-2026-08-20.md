# Scored before building — Change/audit diff (2026-08-20)

53.3's own Accept: score on the NEED/COST rubric (Slice 53) **before** writing
any CSS; it must clear NET ≥ +4 with citations. Scored as two candidates,
because the last two times this project asked "does this need a new
component," the answer was no — `value-help` and `object-page` both composed
from shipped primitives, and the same discipline applies here before assuming
otherwise.

## What's missing, stated precisely

`timeline`/`.bo-audit` show **that** something happened — *"M. Okafor received
5 of 8 monitor arms."* Nothing shows **what changed**: old value, new value,
per field. Change documents are a real ERP requirement (who changed what,
from what, to what, when) — not a nicety.

## Candidate A — a new component (`bo-change-diff` or similar)

| | N1 | N2 | N3 | N4 | NEED | C1 | C2 | C3 | C4 | COST | NET |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| new component | 0 | 1 | 1 | 2 | 4 | 3 | 1 | 0 | 2 | 6 | **−2** |

- **N1=0**: doesn't exist, no screen uses it — honest for a pre-build score.
- **N2=1**: the correctness a component *could* absorb (two-channel
  add/remove/modify, not colour-only) is genuinely useful, but it isn't hard
  to get right by hand — it's one convention, not a hard problem like focus
  management or precision arithmetic.
- **C1=3**: trivially composable — see Candidate B. Any new component built
  anyway would be pure surface with no correctness gain over composition,
  which is exactly what C1=3, C4>0 means: shipping it would be decoration on
  top of an already-solved problem.
- **NET −2 → refuse.** Same shape as the object-page and value-help
  decisions, and the Objective's own §2 test: refuse a second way to do
  something that already works.

## Candidate B — a documented recipe, composed from shipped primitives

A field-level diff is `.bo-data-table` (Field / Old / New) — badges already
carry Added/Removed/Modified as **text**, which is the two-channel signal
this project's own rubric keeps returning to (Amount's `--negative`,
Calendar's `data-day="closed"`). `.bo-audit__detail` already accepts
arbitrary content in its content column (`grid-column: 2`), so a diff table
nests inside an existing audit entry without new CSS.

| | N1 | N2 | N3 | N4 | NEED | C1 | C2 | C3 | C4 | COST | NET |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| documented recipe | 0 | 1 | 1 | 2 | 4 | 3 | 0 | 0 | 0 | 3 | **+1** |

Still modest — a recipe earns less than a component would if the component
were actually necessary, and it is not. **+1, not the ≥+4 bar the item set**,
which the item's own Accept requires stating honestly rather than rounding up.

## Verdict: refuse the component, and the recipe alone doesn't clear the bar either — so demand it the way this project always has

Neither candidate reaches NET ≥ +4 in isolation. The gap is N1: a recipe
demonstrated nowhere is still speculative. **The bar this item actually needs
to clear is Reusability (Objective §3): survive in a REAL composition, not a
standalone demo.** `record-detail` already has an audit trail with exactly
the right slot (`.bo-audit__detail`) and exactly the right worked example —
its own third entry, *"M. Okafor received 5 of 8 monitor arms,"* is a partial
receipt, which is precisely a multi-field change (quantity received, status)
that today has no structured expression.

**Accept, revised:** add the diff as a real composition inside
`record-detail`'s existing audit trail (not a new page, not a new component),
and cross-reference it from `/concepts/review-anatomy`'s History region —
that page already exists and already names this exact region. With a real
worked composition, N1 moves from 0 to a measured 1, which brings the
recipe's NET to **+2** — still short of +4, and that shortfall is recorded
rather than hidden: **this stays a documented convention, not a claim that
it clears the bar for a shipped surface**, because it doesn't have one — it
adds no CSS or classes to score against.
