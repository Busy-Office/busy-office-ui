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

**The seeded queue emptied 2026-08-23, 14 rounds in:** every seeded surface
landed its clause in one round and passed blind re-score; none needed a second
round, so no surface ever reached the 3-round ceiling or the dry-round exit.
`check:wrong-choice`'s TODO holds only the deliberately-skipped `date`
(re-run it — it read 1 outstanding on 2026-08-28).

**This file said "QUEUE DRY" while its own table listed ten queued rows, and
it said so for three days.** Corrected 2026-08-28. `polish_requeue.py` landed
2026-08-25 and has been marking surfaces `RE-QUEUED — source changed` ever
since; `grep -c 'RE-QUEUED' .roundtable/polish-state.md` reads **10** as this
was written, against a header claiming the queue was dry and that "the next
clear-queue wake dispatches Research". A ledger that contradicts itself at
opposite ends of one screen cannot answer dispatcher rule 6, which is the one
question it exists to answer.

**And the paragraph naming Polish's drivers was refuted five days ago in
`LOOPS.md` and never corrected here.** It read: *"Polish drives on `content`,
`fit` and `interaction` ONLY."* Roadmap 171.1 (2026-08-28) measured those three
and none can rank — re-measured this wake, now over 40 components:

```
node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components;
const a={}; for (const c of Object.values(d))
  for (const [k,v] of Object.entries(c.dimensions||{})) (a[k]=a[k]||{})[v.score]=(a[k][v.score]||0)+1;
console.log(a)"
# typography {3:40} · colour {3:40} · spacing {3:40}
# interaction {3:22, na:18} · content {2:1, 3:39} · fit {0:1, 3:39}
```

`content` is 2 on exactly one component and `fit` is 0 on exactly one — both
are `date`, which this file SKIPS as deprecated. `interaction` is 3-or-`na`.
So all three "drivers" rank nothing that is not already skipped. That is not a
broken rubric: the uniformity is the gates holding (94.7/94.9), and `spacing`'s
own definition calls it a debt marker rather than a quality signal. It is a
broken *ranking rule*, and `LOOPS.md` §3b already says so — **the queue is
`check:wrong-choice`'s TODO set, and only that.** This file is where the
sentence it retired was still being read from.

**`polish_requeue.py` and §3b's queue definition contradict each other —
CLOSED BENIGN 2026-08-28 (ROADMAP 176.2).** The script re-queues a surface
whenever its source blob SHAs move; §3b admits only the wrong-choice TODO.
Every one of the 10 re-queued rows scores `content: 3` and is off the TODO.
Both sides are deliberate, measured decisions three days apart — 2026-08-25
added the re-queue precisely so the loop would STOP falling through to
Research, and 2026-08-28 narrowed the queue to the one instrument that can
rank — and neither names the other.

**It is benign because dispatcher rule 6 reads neither of them.** Rule 6's
predicate is *"below its round budget and not marked dry"*, and `--apply`
writes only into this table's `status` column — it moves neither `rounds` nor
`dry`. §3b's TODO narrows which surface a round **picks**, not whether rule 6
**fires**. So resolving the contradiction either way changes the firing rate by
**zero**, by construction. Measured over the table's whole history, not just
today: `budget_spent = 0` and `marked_dry = 0` in **11 of 11** revisions of
this file, so every non-skipped row has always satisfied rule 6.

**What is still open is different, and it is an OWNER CALL — ROADMAP 176.3.**
§3b's Exit (*"every surface dry or budget-spent → hands to Research"*) has
never been satisfiable for the same reason, so rule 7 has never been
dispatched (**0** `Research` rows in 1065). Do not resolve THAT by editing
this file either.

**What a round on one of these `content: 3` rows is for** is written in
`LOOPS.md` §3b: reconcile the surface's published artefact against this
ledger's record of it (176.1's job), and if that finds nothing, the round is
a no-op recorded in one line.

| surface | dimension | score | rounds | dry | src | status |
|---|---|---|---|---|---|---|
| component/alerts | content | **3** | 1/3 | 0 | 20c2fe2c | round 1 landed — blind re-score 2→3, off the gate's TODO |
| component/avatar | content | **3** | 1/3 | 0 | a21b88a7 | round 1 landed — blind 2→3, "not the only way to name someone" |
| component/badge | content | **3** | 2/3 | 0 | 1f69e677 | round 1 landed — blind 2→3, "not for anything actionable"; **round 2 (2026-08-28) NO-OP — reconciliation clean on all four arms, see below** |
| component/byline | content | **3** | 1/3 | 0 | 29ededaf | round 1 landed — blind 2→3; scorer caught the boundary, redrawn |
| component/calendar | content | **3** | 1/3 | 0 | e1dec38b | round 1 landed — blind 2→3, "not for a plain date field" · **RE-QUEUED — source changed**|
| component/dashboard | content | **3** | 1/3 | 0 | 2c8fde4c | round 1 landed — blind 2→3, "not a wrapper round every section" · **RE-QUEUED — source changed**|
| component/data-table | content | **3** | 1/3 | 0 | 42b426c7 | round 1 landed — blind 2→3, "not for laying out a page" · **RE-QUEUED — source changed**|
| component/date | content | 2 | — | — | 399709aa | **SKIPPED** — deprecated, see note below |
| component/icon | content | **3** | 1/3 | 0 | 75de0dee | round 1 landed — blind 2→3; scorer caught the demo contradiction, clause narrowed · **RE-QUEUED — source changed**|
| component/inline-editing | content | **3** | 1/3 | 0 | eadd116a | round 1 landed — blind 3, "not for creating a record" (unscored in DSA) · **RE-QUEUED — source changed** |
| component/navbar | content | **3** | 1/3 | 0 | 1e50d24a | round 1 landed — blind 2→3, "not the page's own title or actions" |
| component/pagination | content | **3** | 1/3 | 0 | 2a48579c | round 1 landed — blind 2→3, "not for stepping through a process" |
| component/progress | content | **3** | 1/3 | 0 | ab66183b | round 1 landed — blind 2→3, "not for work of unknown duration" |
| component/scan | colour+interaction+fit | **3** | 2/3 | 0 | e1c34049 | round 1 (2026-08-23) fixed all three; **round 2 (2026-08-28) discovered the round-1 score was never written to `dsa-scores.json` at all** — see below |
| component/sidebar-nav | content | **3** | 1/3 | 0 | 465e2954 | round 1 landed — blind 2→3, "not for navigating within one screen" · **RE-QUEUED — source changed**|
| component/state-patterns | content | **3** | 2/3 | 0 | 7d3f0e38 | round 1 landed — blind 2→3 (clears skeleton AND state); **round 2 (2026-08-28) FOUND A DEFECT — `skeleton · colour` cited the removed token pairing, see below** |
| component/stepper | content | **3** | 1/3 | 0 | 4b8a288e | round 1 landed — blind 2→3, "not for independent sections" · **RE-QUEUED — source changed**|
| component/table-toolbar | content | **3** | 1/3 | 0 | f7950a7f | round 1 landed — blind 3, "do not add to a read-mostly list" (unscored in DSA) |
| component/tree | content | **3** | 1/3 | 0 | b92740e4 | round 1 landed — blind 2→3, pair-coherent with tree-table |
| component/tree-table | content | **3** | 1/3 | 0 | f0b3ed9e | round 1 landed — blind 2→3, pair-coherent with tree · **RE-QUEUED — source changed** |

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

### Round 2 (2026-08-28) — the round-1 score existed only in this paragraph

The line here used to read *"Re-score pending: next Polish pass blind-re-scores
scan (2 → ?) on all three."* It could not be executed, and the reason is worse
than a stale note: **`dsa-scores.json` had no `scan` entry at all**, so there
was no 2 to re-score from. Measured, not inferred —

```
node -e "console.log('scan' in require('./apps/docs/src/data/dsa-scores.json').components)"   # false
npm run check:dsa-scores -w docs   # "39 scored components (40 requested by a page)"
```

`DsaScore.astro` renders `Not yet scored — alignment scoring is proceeding in
batches` for a missing entry. That is right when nobody has scored a component
and false once somebody has: **`/components/scan` published it for five days**
while this ledger, the loop log (`bfe9798`) and `scan.css`'s own header comment
all recorded a completed scoring pass and a fix round.

`check:dsa-scores` **printed the discrepancy in its own report line the whole
time and passed on it** — the mirror of its assertion 5 (a scored entry no page
renders) was never written. Assertion 7 now asserts it per name, and was
red-proved twice: once by the real defect (`FAIL scan: … dsa-scores.json has no
"scan" entry`) before the entry was written, and once by deleting an unrelated
entry (`FAIL kv: …`) with the injection confirmed absent from the parsed JSON
before the result was believed.

Round 2's work was recording the score, with every citation re-verified against
the shipped artifacts this wake — no `font-size` and no raw colour in
`scan.css`; the 6px/18px frame geometry asserted by `check:claims` in normal
rendering *and* under CDP forced-colors emulation; the platform-vs-behavior
table on the page; `data-scan-flash` adopted in `examples/po-app/server.mjs`.

**Stated exactly: this is a CITED re-score, not a blind one.** The wake that
took it had read this section first, so it is not the independent second
opinion §3b's step 4 requires, and it is not counted as one. The blind
re-score of scan's three fixed dimensions is still owed; it now has a baseline
to be blind against, which it did not have before.

## Round 2 on badge (2026-08-28, cloud wake) — NO-OP, and what the arms measured

Dispatcher rule 6, ten surfaces re-queued, all `content: 3` at `1/3` — an
unbroken tie that §3b's "lowest score, then fewest rounds" cannot break. Picked
`badge` on the one discriminator that exists: it carries **the rubric's only
line-number citation**, the most staleness-prone kind there is, and its source
had moved. §3b's reconciliation, four arms:

1. **Wrong-choice clause present** on all 10 re-queued pages. Redundant —
   `check:wrong-choice` ratchets it (`1 outstanding`, the skipped `date`).
2. **`dsa-scores.json` entry rendered by its page** — gated per name by
   assertion 7 since 176.1 (`40 requested by a page, all scored`).
3. **Line-number citations into shipped CSS: 1 of 40 components.** Only
   `badge · spacing -> badge.css:42`. Still holds — line 42 reads
   `measured 373px wide against a 390px`, bare numbers inside a comment,
   which is exactly what the cite claims. A gate for a 1-of-40 predicate
   would be ceremony (94.11).
4. **`content` cites quoting a page clause verbatim: 18 of 40, and 18 of 18
   still present.** This arm is **not gated** — `check:wrong-choice` requires
   only that *a* clause exists, so a reword would leave the rubric quoting
   wording the page no longer carries. Recorded, **not gated**: roadmap 101.3's
   stop rule forbids Polish adding gates, and 18/18 is a base rate a later
   wake should re-measure before deciding it is worth one.

Two instrument defects were caught before either became a finding, both
textbook: a single-line `<strong>Not …</strong>` grep reported `icon` as having
no clause (it wraps across lines — a position filter, CLAUDE.md's own trap),
and a slug-guess reported 3 mismatches that were `alert`→`alerts` and
`skeleton`/`state`→`state-patterns`. The second run reads the map off the
generated `api.json` (`api.pageSlug`) rather than guessing.

```
node -e "const d=require('./apps/docs/src/data/dsa-scores.json').components;
const re=/([a-z0-9-]+\.(?:css|astro|ts|mjs|json)):(\d+)/g; let n=0;
for(const c of Object.values(d)) for(const v of Object.values(c.dimensions||{}))
  { re.lastIndex=0; while(re.exec(String(v.cite||''))) n++; } console.log(n)"
```

## Round 2 on state-patterns (2026-08-28, cloud wake) — NOT a no-op (ROADMAP 182)

Dispatcher rule 6, nine surfaces re-queued, all `content: 3` at `1/3` — the same
unbroken tie 176.1 faced. Picked `state-patterns` on the one discriminator that
is measurable rather than argued: it is the **only** page carrying two rubric
entries (`skeleton` and `state` — 39 pages, 40 entries), so every per-component
arm gets two chances to disagree with a ledger row written as one.

Arms 1, 2 and 4 clean. **Arm 3 — "do the citations still hold against the
shipped CSS?" — failed**, and it is the arm §3b names first:

- `skeleton · colour` cited *"gradient built from bg-muted/bg-hover tokens"*.
  The shipped CSS sweeps `--bo-color-bg-muted` to
  `--bo-color-skeleton-highlight`. `bg-muted/bg-hover` is the pairing that was
  **removed** on 2026-08-25 (`ef64c745`), because those two tokens are
  byte-identical in both themes — the shimmer swept from a colour to itself and
  nothing moved on screen. The cite dates to 2026-08-21 (`479cc6a9`).
- So the evidence for `colour: 3` described the *bug*, published verbatim on
  `/components/state-patterns` for three days, while this file and
  `dsa-scores.json`'s own `$comment` both say a score is re-taken when the
  design changes.

**Stated exactly: the cite was repaired, the score was NOT re-taken, and
`scored` stays `2026-08-23`.** §3b step 4 requires a blind re-score by a second
agent and this wake could not run one; moving the date would claim an
independent opinion that does not exist. **`skeleton · colour` is owed a blind
re-score** — the same debt `scan`'s three dimensions carry, and for the same
reason. `rounds` moved 1→2 because the round produced a measured change to the
published artefact, not because a score moved.

A gate for this predicate was measured and **refused** — base rate 1 of 28
token references, and the first repair tripped the detector by explaining what
the removed token had been. Full reasoning and the red-proof in ROADMAP 182.2.

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
