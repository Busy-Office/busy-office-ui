# Surface review — batch 1 (2026-08-19)

Rubric: [`surface-review-rubric.md`](./surface-review-rubric.md). Measured
signals: [`surface-baseline.md`](./surface-baseline.md).

**This is a PILOT.** 37.2 was gated on owner sign-off of the rubric, which has
not come. Scoring 55 items against an unagreed rubric risks doing it twice, but
blocking indefinitely delivers nothing — so this is one batch. If the rubric is
wrong, nine rows are wasted rather than fifty-five, and a pilot exposes rubric
problems better than more waiting does.

**Batch chosen worst-signal-first**: the seven components no shipped screen uses,
plus **two controls** (`data-table`, `badge`). The controls are not padding —
a rubric that scores everything "keep" would be as useless as a detector that
cannot fail, and the controls are how that gets checked.

Scores are Demand / Composition / Contracts / Evidence, 0-3 each.

| component | D | C | Ct | E | total | outcome |
|---|--:|--:|--:|--:|--:|---|
| `data-table` *(control)* | 3 | 3 | 3 | 3 | **12** | keep |
| `badge` *(control)* | 3 | 2 | 2 | 2 | **9** | keep |
| `calendar` | 0 | 3 | 3 | 3 | **9** | improve |
| `tree-table` | 0 | 3 | 2 | 0 | **5** | improve |
| `pagination` | 0 | 2 | 1 | 0 | **3** | improve *(the finding is about `invoice-list`)* |
| `offcanvas` | 0 | 2 | 1 | 0 | **3** | improve *(contradicts `master-detail`'s own prose)* |
| `tree` | 0 | 2 | 1 | 0 | **3** | improve |
| `skeleton` | 0 | 2 | 2 | 1 | **5** | keep |
| `date` | 0 | 1 | 0 | 0 | **1** | **merge** |

The controls score 12 and 9 against a low of 1. **The rubric discriminates.**

---

## Citations

**`data-table` — 12, keep.** D3: 18 of 18 screens. C3: absorbs density remapping,
sticky headers, selection counting and container-query compaction — a consumer
re-implementing it gets it wrong. Ct3: all four measured contracts present, and
`data-loading` is now claim-asserted for composited contrast (43.1). E3: JS
behavior plus multiple claims.

**`badge` — 9, keep.** D3: 18 of 18. C2: a bordered span *is* composable, but the
two-channel state contract (colour never alone) is the part consumers skip.
Ct2: forced-colors yes, density not applicable — it sizes from `em`. E2: claim
covered, no behavior needed.

**`calendar` — 9, improve.** C3/Ct3/E3 are strong: it does what the native input
cannot (mark a SET of dates), pairs every state with a shape as well as a
colour, and carries three claims including no-JS picking. **D0 is the problem,
and it is mine** — I shipped it two days ago and no *screen* uses it, only its
own component page. A component demonstrated but never used in a pattern is
documentation, not evidence.
→ **Improve:** put it in a screen where the marks matter (a goods-receipt or
delivery-scheduling pattern), or it becomes the best-built dead weight here.

**`tree-table` — 5, improve.** C3: hierarchical rows with `data-tree-level` is a
genuinely hard thing to hand-roll, and it has a recorded ADR. E0: **no
executable claim at all**, despite shipping a JS behavior — the expand/collapse
contract is asserted in prose only. That is the cheapest and most urgent gap in
this batch.

**`pagination` — 3, improve, and the finding is about `invoice-list`.** D0 does
not mean paging is unwanted; it means **the flagship list pattern does not
page**, which is implausible for an ERP invoice list of any size. Reading (c)
from the rubric: a screen that should use it is quietly doing without.
→ **Improve `invoice-list`**, not `pagination`.

**`offcanvas` — 3, improve, and it contradicts our own prose.**
`/patterns/master-detail` states that below the shell breakpoint the panel
"becomes a full-width drawer over the list" and links here — but no screen
renders one. The documentation promises behaviour the patterns never show.
→ **Improve:** make master-detail actually use it at narrow width, which is what
the page already claims.

**`tree` — 3, improve.** C2: a disclosure hierarchy is composable from
`<details>`, and the value is the roving-focus behavior. E0: no claim, despite
shipping JS. Same gap as `tree-table`.

**`skeleton` — 5, keep.** D0 but **not** overlapping `data-loading`: skeleton
stands in for content that is *absent*, `data-loading` dims content that is
*present*. Distinct states, correctly separate. Ct2: `aria-busy` plus an explicit
`prefers-reduced-motion` override (the shimmer is a continuous loop, so a
duration token would not stop it). Keep as-is; its absence from screens is
honest — the docs' screens all have data.

**`date` — 1, merge.** The weakest thing in the framework by this rubric. C1: it
is `display: inline-flex`, `gap`, `tabular-nums`, and a muted span — a
`.bo-cluster` with two utilities. Ct0/E0: no forced-colors rule, not
density-aware, no claim, no behavior. The one real decision inside it is
`--overdue`, whose two-channel contract (the word "Overdue" must be in the text)
is genuine.
→ **Merge** the two-channel overdue guidance into `/components/amount`, which
already documents exactly that pattern for negative amounts, and **deprecate**
`.bo-date`. Deprecation, not deletion: `@busy-office/ui` is published, so it is a
CHANGELOG entry plus a documented replacement, with removal at the next major.

---

## What the pilot says about the rubric

1. **It discriminates** — 12 and 9 for the controls, 1 for the weakest.
2. **"Demand 0" was the right thing to make loud.** Four of seven zero-demand
   rows turned out to be findings about *screens*, not components — `pagination`
   and `offcanvas` most sharply, where the docs promise behaviour no screen
   shows.
3. **The Evidence column is doing the most work.** Three components ship a JS
   behavior with **no executable claim** (`tree`, `tree-table`, and until 40.3
   `calendar`). That is a concrete, cheap backlog the review found on its first
   batch.
4. **One weakness:** the rubric has no column for "how much would removing it
   cost a consumer who already uses it". `date` scores 1, but it is in the
   published 0.1.1, so the outcome is bounded by the deprecation rule regardless
   of score. Worth adding before batch 2.
