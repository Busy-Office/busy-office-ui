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
| component/avatar | content | 2 | 0/3 | 0 | queued |
| component/badge | content | 2 | 0/3 | 0 | queued |
| component/byline | content | 2 | 0/3 | 0 | queued |
| component/calendar | content | 2 | 0/3 | 0 | queued |
| component/dashboard | content | 2 | 0/3 | 0 | queued |
| component/data-table | content | 2 | 0/3 | 0 | queued |
| component/date | content | 2 | 0/3 | 0 | queued |
| component/icon | content | 2 | 0/3 | 0 | queued |
| component/inline-editing | content | 2 | 0/3 | 0 | queued |
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
