# Polish state — the round ledger

Source of truth for the Polish loop (LOOPS.md §3b, owner decision
2026-08-23). Markdown is the record; `loops.db` mirrors it for querying.
Rebuildable from `.roundtable/loop-log.md`.

**Budgets are CEILINGS, not quotas** — components 3 rounds, patterns 10.
Two consecutive rounds that fail to move the blind re-score mark a surface
`dry` and forfeit the rest of its budget.

**A surface re-enters the queue only when its SOURCE changes** (its CSS,
its docs page, or its rubric definition) — never on a timer.

Seeded 2026-08-23 from `check:wrong-choice`'s TODO set — the 19
component pages with no wrong-choice clause, which is the executable form
of the DSA rubric's `content` dimension (the two agree by construction).
Patterns are not seeded: all 35 already carry the clause and score at the
sweep bar, so they enter only when a sweep or a source change flags one.

Polish drives on `content`, `fit` and `interaction` ONLY.
`typography`/`colour`/`spacing` read 3 on all 39 components — documented as
expected (94.7/94.9), and `spacing` is explicitly a debt marker, not a
quality signal. A dimension that cannot fail must never drive a round.

| surface | dimension | score | rounds | dry | status |
|---|---|---|---|---|---|
| component/alerts | content | **3** | 1/3 | 0 | round 1 landed — blind re-score 2→3, off the gate's TODO |
| component/avatar | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not the only way to name someone" |
| component/badge | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for anything actionable" |
| component/byline | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3; scorer caught the boundary, redrawn |
| component/calendar | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for a plain date field" |
| component/dashboard | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not a wrapper round every section" |
| component/data-table | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for laying out a page" |
| component/date | content | 2 | — | — | **SKIPPED** — deprecated, see note below |
| component/icon | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3; scorer caught the demo contradiction, clause narrowed |
| component/inline-editing | content | **3** | 1/3 | 0 | round 1 landed — blind 3, "not for creating a record" (unscored in DSA) |
| component/navbar | content | 2 | 0/3 | 0 | queued |
| component/pagination | content | 2 | 0/3 | 0 | queued |
| component/progress | content | 2 | 0/3 | 0 | queued |
| component/sidebar-nav | content | 2 | 0/3 | 0 | queued |
| component/state-patterns | content | 2 | 0/3 | 0 | queued |
| component/stepper | content | 2 | 0/3 | 0 | queued |
| component/table-toolbar | content | 2 | 0/3 | 0 | queued |
| component/tree | content | 2 | 0/3 | 0 | queued |
| component/tree-table | content | 2 | 0/3 | 0 | queued |

## Not in the queue, with reasons

- **component/date — `fit: 0`, the single lowest score in the rubric.**
  Deliberately NOT queued: it is DEPRECATED (45.3) and prescribed in no
  context because its own source says compose `.bo-cluster` + two utilities
  instead. The honest fix is removal at the next breaking change, not
  polish. Worst-first ordering would have picked it first — recording why
  it is skipped so no future wake re-picks it.

- **component/inline-editing and component/table-toolbar are NOT scored.**
  Both are on `check:wrong-choice`'s queue but neither page renders
  `<DsaScore>`, so the DSA rubric covers 39 of the 41 component pages and
  the polish loop's own instrument is blind to these two. Recorded as an
  observation, deliberately not acted on: extending the rubric's coverage
  is scoring apparatus, and roadmap 101.3's stop rule keeps that out of
  scope until a live grill finds a defect the six dimensions cannot see.
  A Research round is the right place to decide whether the gap is real
  (these may be sub-surfaces of data-table rather than components in their
  own right) or worth closing.
