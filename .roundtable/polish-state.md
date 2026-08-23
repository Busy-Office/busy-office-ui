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

**QUEUE DRY as of 2026-08-23, 14 rounds in:** every seeded surface landed
its clause in one round and passed blind re-score; none needed a second
round, so no surface ever reached the 3-round ceiling or the dry-round
exit. The gate's TODO holds only the deliberately-skipped `date`. Per
dispatcher rule 7, the next clear-queue wake dispatches **Research**.

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
| component/navbar | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not the page's own title or actions" |
| component/pagination | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for stepping through a process" |
| component/progress | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for work of unknown duration" |
| component/sidebar-nav | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for navigating within one screen" |
| component/state-patterns | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3 (clears skeleton AND state) |
| component/stepper | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, "not for independent sections" |
| component/table-toolbar | content | **3** | 1/3 | 0 | round 1 landed — blind 3, "do not add to a read-mostly list" (unscored in DSA) |
| component/tree | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, pair-coherent with tree-table |
| component/tree-table | content | **3** | 1/3 | 0 | round 1 landed — blind 2→3, pair-coherent with tree |

## Re-entry: scan (2026-08-23) — the queue's first source-change entry

`scan` shipped in 126.2 and had never been scored (it was also invisible to
`check-page-shape` until Slice 129 fixed that). Blind-scored on entry:
**colour 2, interaction 2, fit 2** — three below 3, the first colour<3 in the
rubric. Round 1 fixed all three:

- **colour**: accepted vs rejected differed by HUE ALONE in the visible
  channel (`--bo-color-success` vs `--bo-color-danger`, identical geometry),
  and under forced-colors both painted the SAME `8px solid Highlight` frame —
  so the user that mode exists for got no verdict at all. The file's own
  header had claimed "two-channel by construction"; the second channel was
  the live region, which serves a screen-reader user and does nothing for a
  sighted colour-blind one. Now the FRAME carries the verdict (accepted 6px
  solid, rejected 18px double) and forced-colors only recolours it. Claim 105
  compares the two states' geometry and never their colour, in normal
  rendering AND under CDP forced-colors emulation; red-proved by collapsing
  the two borders in the built CSS.
- **interaction**: the page never drew the platform-vs-behavior line every
  other behavior-backed page draws. It has no native element underneath —
  a scanner is a keyboard — which makes the line more important, not less.
  Added as a table plus the no-JS path.
- **fit**: po-app's own receive screen used `data-scan-input` without
  `data-scan-flash`, i.e. the framework's only real consumer had
  half-adopted the surface it ships. One attribute.

Re-score pending: next Polish pass blind-re-scores scan (2 → ?) on all three.

## Not in the queue, with reasons

- **component/date — `fit: 0`, the single lowest score in the rubric.**
  Deliberately NOT queued: it is DEPRECATED (45.3) and prescribed in no
  context because its own source says compose `.bo-cluster` + two utilities
  instead. The honest fix is removal at the next breaking change, not
  polish. Worst-first ordering would have picked it first — recording why
  it is skipped so no future wake re-picks it.

- **component/inline-editing and component/table-toolbar NOT scored —
  RESOLVED 2026-08-23 (Research round 1): FALSE GAP.** Two independent
  proofs, both from the repo: (1) neither has a directory under
  `packages/core/src/css/components/` — there is no CSS component to
  score; (2) every `bo-*` class on both pages belongs to `data-table`,
  and what they document is BEHAVIORS on that surface (`initRowEdit`;
  `initTableToolbar`/`initDataGrid`). They are behavior-documentation
  pages, which the CSS-design rubric correctly does not score — the same
  reason `/concepts/js-behaviors` is unscored. No rubric change needed,
  which also keeps roadmap 101.3's stop rule intact. Do not re-raise.
