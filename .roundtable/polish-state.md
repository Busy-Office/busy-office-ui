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
| component/alerts | content | **3** | 2/3 | 0 | 4ee5ad51 | round 1 landed — blind re-score 2→3, off the gate's TODO; **round 2 (2026-08-31) NO-OP — reconciliation clean on all four arms; the sweep around it filed ROADMAP 231.2, see below** · **RE-QUEUED — source changed** |
| component/avatar | content | **3** | 2/3 | 0 | 3147e6c1 | round 1 landed — blind 2→3, "not the only way to name someone"; **round 2 (2026-09-04) FOUND A DEFECT, and it is arm 3's WHOLE class at once — 249.8's 3-line header moved every line-number pointer in the framework; all four live ones were published or printed. ROADMAP 266, see below** |
| component/badge | content | **3** | 2/3 | 0 | 1f69e677 | round 1 landed — blind 2→3, "not for anything actionable"; **round 2 (2026-08-28) NO-OP — reconciliation clean on all four arms, see below** · **RE-QUEUED — source changed** |
| component/breadcrumb | content | **3** | 1/3 | 0 | dcbde565 | **round 1 (2026-08-30) FOUND A DEFECT — `fit` counted "2 of 19 pattern screens" against 39; re-entry from 217.2's filing, see below** · **RE-QUEUED — source changed** |
| component/byline | content | **3** | 1/3 | 0 | 29ededaf | round 1 landed — blind 2→3; scorer caught the boundary, redrawn · **RE-QUEUED — source changed** |
| component/calendar | content | **3** | 2/3 | 0 | 6b36b863 | round 1 landed — blind 2→3, "not for a plain date field"; **round 2 (2026-09-02) six arms clean on calendar itself, and a NEW arm 7 FOUND A DEFECT elsewhere — `form · colour` claimed "zero raw hex" against two painted ones; cite corrected, CSS left open as 240.1, see below** · **RE-QUEUED — source changed** |
| component/dashboard | content | **3** | 2/3 | 0 | 3780542a | round 1 landed — blind 2→3, "not a wrapper round every section"; **round 2 (2026-09-02) FOUND TWO DEFECTS, and the first is the only one in this ledger where the SCORE was wrong rather than the cite — `interaction: na` on a component that ships `initCollapsibleCards`; blind re-scored to 3 by a second agent, the first blind re-score this ledger has actually run. See below** · **RE-QUEUED — source changed** |
| component/data-table | content | **3** | 2/3 | 0 | 36c4bbe3 | round 1 landed — blind 2→3, "not for laying out a page"; **round 2 (2026-08-30) FOUND A DEFECT — the `spacing` cite named a literal 94.3 had removed two days before the score was taken, see below** · **RE-QUEUED — source changed** |
| component/date | content | 2 | — | — | 399709aa | **SKIPPED** — deprecated, see note below |
| component/icon | content | **3** | 2/3 | 0 | f0d9f50b | round 1 landed — blind 2→3; scorer caught the demo contradiction, clause narrowed; **round 2 (2026-08-30) FOUND A DEFECT — `fit` cited "12 ERP glyphs" against 26 shipped, and the same 12 was hard-coded as the DIVISOR of the page's published size projection, see below** · **RE-QUEUED — source changed** |
| component/inline-editing | content | **3** | 1/3 | 0 | eadd116a | round 1 landed — blind 3, "not for creating a record" (unscored in DSA) · **RE-QUEUED — source changed** |
| component/navbar | content | **3** | 1/3 | 0 | 1e50d24a | round 1 landed — blind 2→3, "not the page's own title or actions" · **RE-QUEUED — source changed** |
| component/pagination | content | **3** | 1/3 | 0 | 2a48579c | round 1 landed — blind 2→3, "not for stepping through a process" · **RE-QUEUED — source changed** |
| component/progress | content | **3** | 2/3 | 0 | 1154a4d7 | round 1 landed — blind 2→3, "not for work of unknown duration"; **round 2 (2026-09-04) NO-OP on the surface — six cites and all eight arms clean — and the finding is in this loop's own step 0: `polish_requeue.py --apply` announced a write over a byte-identical file. ROADMAP 267, see below** · **RE-QUEUED — source changed** |
| component/scan | colour+interaction+fit | **3** | 2/3 | 0 | e1c34049 | round 1 (2026-08-23) fixed all three; **round 2 (2026-08-28) discovered the round-1 score was never written to `dsa-scores.json` at all** — see below · **RE-QUEUED — source changed** |
| component/sidebar-nav | content | **3** | 2/3 | 0 | 904b544f | round 1 landed — blind 2→3, "not for navigating within one screen"; **round 2 (2026-08-30) FOUND A DEFECT — the `fit` cite's usage count was EXACT when written and decayed two days later, see below** · **RE-QUEUED — source changed** |
| component/state-patterns | content | **3** | 2/3 | 0 | 7d3f0e38 | round 1 landed — blind 2→3 (clears skeleton AND state); **round 2 (2026-08-28) FOUND A DEFECT — `skeleton · colour` cited the removed token pairing, see below** · **RE-QUEUED — source changed** |
| component/stepper | content | **3** | 2/3 | 0 | efba2799 | round 1 landed — blind 2→3, "not for independent sections"; **round 2 (2026-09-01) NO-OP — reconciliation clean on five arms; arm 4 re-measured 20/20 and a new arm 5 reads 81/81, see below** · **RE-QUEUED — source changed** |
| component/table-toolbar | content | **3** | 1/3 | 0 | f7950a7f | round 1 landed — blind 3, "do not add to a read-mostly list" (unscored in DSA) · **RE-QUEUED — source changed** |
| component/tree | content | **3** | 1/3 | 0 | b92740e4 | round 1 landed — blind 2→3, pair-coherent with tree-table · **RE-QUEUED — source changed** |
| component/tree-table | content | **3** | 2/3 | 0 | 298374cc | round 1 landed — blind 2→3, pair-coherent with tree; **round 2 (2026-09-01) NO-OP — reconciliation clean on six arms; a new arm 6 reads 8/8 and corrects this ledger's own base rate for the class, see below** · **RE-QUEUED — source changed** |

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

## Re-entry: data-table — round 2 (2026-08-30), and it is NOT a no-op

Rule 6 re-queued **10** surfaces, all `content: 3`, nine at 1/3 rounds and
`scan` at 2/3 — so neither the score (171.1: no DSA dimension can rank) nor the
ledger's tie-break discriminates. Picked by which surface's SOURCE actually
moved, since that is the property that makes a cited artefact go stale, and
182.1 is the precedent that exactly this happens:

```
BASE=$(git rev-list -1 --before=2026-08-28T21:00:00 HEAD)   # 52a50b58
git diff --numstat $BASE HEAD -- <each surface's paths>
#  data-table  5 commits  +157/-0     <- picked (200.4, 196.1, 190.1, 190.3, 173.2b)
#  alerts      1 commit    +71/-5
#  the other seven          0/0
```

**The first draft of that instrument reported `244 commits` for all nine** — an
identical value across every input, which is a defect until proven otherwise. It
was: a stray `"*"` pathspec. Caught before the pick.

**The finding.** The `spacing` cite read *"the 1.75rem compaction heights now
state why they are literals … reconciliation queued as 94.3"*. `1.75rem` occurs
**0 times** in `data-table.css`, and 94.3 was not queued — it landed:

```
grep -c '1\.75rem' packages/core/src/css/components/data-table/data-table.css   # 0
#  walked all 40 revisions of that file:
#   bafdb41f  2026-08-21  3      79f7fec9  2026-08-21  0
#   79f7fec9 = "94.3: the fourth density gets a name and a reason"
```

94.3 moved both heights into `--bo-density-auto-{row,control}-height` in
`tokens/density.css`; `data-table.css` reads them through `var()` and its own
comment says so, in the same block the cite describes. The entry is stamped
`"scored": "2026-08-23"` — **the cite was already two days stale when written**,
and the page has published it since.

**The score does not move, so no blind re-score is owed.** `spacing` is a debt
marker, not a quality signal, and naming the heights is less debt than
hard-coding them: 3 was and remains right. The evidence record was wrong, which
is 176.1's shape. Corrected, with every literal the replacement names verified
present first (`390px` ×4, `68px`, `87px`, `28px`, `30px`), and checked in the
BUILT html: `1.75rem compaction heights` → **0**, new sentence renders.

The other five cites reconciled clean — mono-inline/`__col--code`/`0.03em` ×1
each; 3 hex literals all inside `@media print`, confirmed by brace depth rather
than by eye; `:has(` ×9 and one native `popover`; the wrong-choice clause on the
page; the split-column rule present.

**Refused: a gate for the class** (roadmap 216.2). Base rate says it would
distinguish — 74 cites name a CSS length literal, 73 find it in that component's
own CSS, 1 does not, and that 1 is this defect — but 101.3 forbids Polish adding
gates, and the obvious widening (also search `tokens/`) would have PASSED on this
defect, because `1.75rem` is in `density.css`. Measurement recorded there for
whoever may decide.

## Re-entry: sidebar-nav — round 2 (2026-08-30, cloud wake) — NOT a no-op (ROADMAP 217)

Rule 6 re-queued **9** surfaces. Eight at 1/3 rounds, `scan` at 2/3, all
`content: 3` in this table — the same unbroken tie 176.1, 182.1 and 216.1 each
faced. `inline-editing` drops out of the eight for a stated reason: it has no
`dsa-scores.json` entry at all (176.2's false gap — a behaviour-documentation
page with no CSS component under it), so the reconciliation arms have nothing to
disagree with. Picked from the remaining seven by source movement since each
surface's own `scored` date, 216.1's discriminator: `sidebar-nav` **4 commits
+120/-2**, tied with `icon` on commits and ahead on lines, and broken on the
property — its `fit` cite carries a **bare count of usages**, the most
decay-prone claim shape in the rubric.

**The instrument's first reading was wrong and the defect was the day
boundary.** `--before=2026-08-23T23:59:59` with no offset is read in the
container's UTC while every commit here is authored `+0800`, so it cut eight
hours late and reported `icon` at 3 commits +43 and `calendar` at 0/0 — the
latter being "did not move at all", which is exactly what a pick would have
turned on. The tell was not a tidy number: the base commit it resolved to was
stamped a day *after* the boundary asked for.

**The finding.** `fit` read *"po-app uses it at 6 sites"*. `6` was **exact** on
the day it was written (`37a1143a`, 2026-08-21) — one `<nav class="bo-sidebar-nav">`
plus five links. po-app then grew two screens on 2026-08-22 (`40a18f1e` /inbox,
`b5a3081b` movements) and the same command now reads **8**. Published stale for
eight days, and the entry is stamped `"scored": "2026-08-23"` — the day after it
stopped being true.

**A different class from 216.1, which is why it is recorded rather than just
fixed.** 216.1's cite was wrong on the day it was written, so re-reading the
file it describes catches it. This one was right when written and was falsified
by a change **somewhere else entirely** — a new screen in the reference app,
which nobody reviewing `sidebar-nav` would think to open. It has no wrong moment
to catch, only an expiry nobody is watching.

**The score does not move and no blind re-score is owed.** Six usages becoming
eight is *more* placement, not less, so `fit: 3` was and remains right; the
evidence got stronger while the sentence reporting it went wrong. `scored` stays
`2026-08-23` — moving it would claim the independent second opinion §3b step 4
requires, and this wake cannot run one. `rounds` moved 1→2 because the round
produced a measured change to the published artefact, per 182.1's precedent.

**The fix removes the quantity rather than refreshing it** — a refreshed count
decays on the next dogfooded screen, and this item is the proof. The replacement
states two properties of the code, both verified present first: po-app renders
the rail from ONE shared shell (the `page()` template in
`examples/po-app/server.mjs`; exactly 1
`<nav class="bo-sidebar-nav` in the file), and it composes inside `.bo-offcanvas`
(the `<dialog class="bo-offcanvas">` block in
`apps/docs/src/pages/components/offcanvas.astro`). Verified in the BUILT html —
`uses it at 6 sites` → 0 across all of `apps/docs/dist`, new sentence renders 1.

> **Line numbers dropped 2026-09-03, Slice 253 finding B.** This entry cited
> `server.mjs:105`, correct when written (`72e7021f`) and now line **106** —
> `5e5ede6d` and `f1be2485` each inserted above it. `offcanvas.astro:20` still
> resolves and was restated for the same reason rather than because it had
> drifted. This file already calls line-number cites "the most decay-prone
> shape"; Slice 247.1's audit of that shape scoped only `ROADMAP.md` and
> `RESUME.md` and so never read this ledger's twelve.

**Base rate for the class: 6 of 240 cites carry a bare count; 4 are exact, 2 are
stale.** `navbar · fit` 3→3, `dialog · fit` 13→13, `offcanvas · fit` 1→1,
`tabs · fit` 2→2 all hold; `breadcrumb · fit`'s denominator says "2 of 19
pattern screens" against **39** today (its numerator, 2, still holds). Not a
uniform predicate — a detector here would distinguish, unlike 94.11's. **A gate
is still refused**: 101.3 forbids Polish adding gates, and this class is not
writable in the form the other cite-checkers take — they ask *is this string in
that file*, this needs *does this number still equal a count over a different
tree*, which would require the cite to carry its own command. That is a rubric
change, not maintenance of the existing ratchet. Full table and commands in
ROADMAP 217.2.

`breadcrumb` is **filed, not fixed** — one round, one surface — and it gives the
next round the thing no round since 176.1 has had: a pick with a measured reason
rather than a tie. It is not a queue entry; it is not in this table, and rule 6
reads only `rounds` and `dry`.

## Re-entry: breadcrumb — round 1 (2026-08-30, cloud wake) — NOT a no-op (ROADMAP 220)

**The first round since 176.1 that needed no invented tie-break.** Rule 6
re-queued **8** surfaces, all `content: 3`, so neither the score (171.1) nor the
ledger's "fewest rounds" tie-break discriminates — the same wall 176.1, 182.1,
216.1 and 217.1 each hit. 217.2 had already broken it in advance by *filing* a
defect it did not fix: `breadcrumb · fit`, one of the 2 stale cites in the class
of 6 it measured at 6 of 240. So the pick was a measured, pre-existing finding
rather than a discriminator invented for the occasion.

`breadcrumb` was not a row in this table; rule 6 reads only `rounds` and `dry`,
so this is a **re-entry**, the shape `scan` and `data-table` took.

**The premise was re-measured before it was acted on** — 217.2 recorded no
command beside its claim, which is the gap CLAUDE.md's criterion rule names:

```
grep -l  'bo-breadcrumb' apps/docs/src/pages/patterns/*.astro | wc -l   # 2  numerator holds
grep -rl 'bo-breadcrumb' apps/docs/src/pages/patterns/       | wc -l    # 2  recursive, agrees
```

**The denominator was reconciled against four independent sources** before being
called wrong: top-level `.astro` minus `index.astro` → 39; `patterns.json`'s
generated `count` → 39; `gen-patterns-index.mjs`'s report line → 39; and
`check:wrong-choice`'s → "patterns: 39 carry". A **recursive** glob returns
**47**, because `rf/` and `schedule/` hold sub-screens `patterns.json` does not
count as patterns — a wake reaching for the obvious recursive count would have
replaced one wrong figure with another.

**The fix removes the quantity rather than refreshing it**, which is 217.2's
precedent and now has two confirmations rather than one: the corpus went 19 → 39
in nine days, so any refreshed denominator is already decaying. The replacement
states two properties of the code, both verified present first — the ERP suite
emits every trail from ONE shared `crumbs()` helper (`grep -rc bo-breadcrumb
examples/erp-suite` → `_shell.mjs:1`, the only literal in the suite), and
create-ui's starter screen ships one (`template/screen.html`, 1). **No line
number**: this table records line-number cites as the most decay-prone shape
there is, at 1 of 40 components, and adding a second in the round whose finding
IS decay would be the wrong lesson.

**The score does not move and no blind re-score is owed.** One shared helper
plus the scaffolder's starter screen is *stronger* placement evidence than a
count of demo pages, so `fit: 3` was and remains right — the sentence reporting
it went wrong while the thing it reported got better. `scored` stays
**2026-08-21**; moving it would claim the independent second opinion §3b step 4
requires, which this wake could not run.

**The other five cites reconciled clean** against `breadcrumb.css` as shipped:
`font-size` occurs once and is the `var()`; zero raw colour literals, and
`[aria-current="page"]` sets `color` **and** `font-weight`, so the two-channel
claim holds; zero raw dimension literals; `content: "/" / ""` present verbatim;
and `interaction: na` holds — **0 of 33** names in `behaviors.json` match
`/crumb/i`. Arm 1 (clause present, *"Not for progress through a flow"*) and arm
2 (entry rendered by its page, 360 assertions over 40 components) are both
gate-ratcheted.

**One instrument was wrong on its first output, which is the base rate holding
rather than an anecdote.** The behaviors check first read `0 of 4` — it had
counted `Object.keys(behaviors.json)`, whose top level is
`generated`/`initCount`/`exports`/`behaviors`. The real array holds **33**. The
answer it gave was *correct* (no breadcrumb behavior), which is what makes it
worth recording: a right conclusion from a broken instrument, caught only
because a denominator of 4 was too tidy to be true.

**Verified against the RENDERED artefact, not the diff:** `used in 2 of 19
pattern screens` → **0 files across all of `apps/docs/dist`**; the replacement
renders on `/components/breadcrumb`. The one surviving source copy of the old
string is this file's record of 217.2 filing it — a quotation, and correct.

**A gate for the class is refused a second time (ROADMAP 220.2)**, with a third
reason 217.2 did not have: the two stale cites failed against **different
trees** — `sidebar-nav`'s numerator counted `examples/po-app`, `breadcrumb`'s
denominator counted `apps/docs/src/pages/patterns`. A gate would need each cite
to carry its own command, which is a rubric change, not maintenance of the
ratchet 101.3 confines Polish to. And the class is now **shrinking by
construction**: both repairs replaced a count with a property, so 6 of 240 is
down to **4 of 240**, all four re-verified exact by 217.2.

## Re-entry: icon — round 2 (2026-08-30, cloud wake) — NOT a no-op (ROADMAP 227)

Rule 6 re-queued **8** surfaces. `inline-editing` drops out for 217.1's stated
reason (no `dsa-scores.json` entry — 176.2's false gap), leaving seven, all
`content: 3` — the same unbroken tie 176.1, 182.1, 216.1, 217.1 and 220.1 each
faced. Picked on 216.1's discriminator, source movement since each surface's own
`scored` date, with 217.1's `+08:00` boundary: `icon` **4 commits +113/-2**,
ahead of every other candidate on both measures.

**`dashboard`'s 0/0 was checked before the pick, not after.** A zero is a defect
until proven otherwise, and `polish_requeue.py` had just reported its source
moved. Both readings are right: its last touch (`e034a6eb`) is *earlier the same
day* than the boundary commit, while the ledger's recorded `src` predates it.

**The finding — a third class, and the first that was catchable by re-reading
the cite's own subject.** `fit` read *"12 ERP glyphs"*. Walking all ten
revisions of `icon.css`: 12 held 2026-08-15 → 08-21, became **23** on 08-24
(137.1's toolbar set), then 24, then **26** on 08-27. The entry is stamped
`"scored": "2026-08-23"`, so the count was exact on the day it was taken and
wrong the next — 217.2's shape. But sidebar-nav and breadcrumb were falsified by
a *different* tree (po-app; the pattern corpus), and this one was falsified
**inside the very file the cite describes**. Published stale six days.

**The cite was concealing a live defect.** `icon.astro` carried
`const glyphCount = 12` as the **divisor** of a byte count read fresh from the
shipped stylesheet, so the page published a 200-icon catalogue at **148 kB**
against a shipped per-glyph rate of **68**. That figure is the published
arithmetic behind roadmap 40.1's refusal of an icon catalogue — the framework
was overstating the case for its own decision by **2.17x**. The comment three
lines above it already warned about exactly this decay ("the hand-typed 10.3%
had drifted to a real 6.0% … Same projection, live numbers"): that fix made the
numerator live and left the denominator hand-typed, and the denominator is the
worse one to get wrong, because it *scales*.

**192.1 arrived on cue: the claim beside the number failed too.** *"more than
everything else we ship"* was true at 148 kB and **false** at 68 (everything but
icons is 83.9 kB), so correcting the number alone would have shipped a fresh
falsehood. It now states two live quantities and draws no adjective from them.

**Red-proved by injection, injection confirmed twice** — a 27th glyph rule
appended to the min CSS the page resolves showed in the file *and* moved the
**rendered** page `26 → 27` / `9.6% → 9.7%`. The hard-coded 12 could not have
moved. Reverted; `redproof` appears nowhere in either dist.

**The score does not move and no blind re-score is owed.** One custom property
carrying every glyph is *stronger* mechanism evidence than a count of how many
shipped, so `fit: 3` was and remains right. `scored` stays **2026-08-23** —
moving it would claim the independent second opinion §3b step 4 requires, which
this wake could not run. `rounds` moved 1→2 because the round changed the
published artefact, per 182.1.

**The other five cites reconciled**, four clean and `colour` narrowed (it said
the `%23000` is "SVG stroke"; `--settings` also uses `fill`). `interaction: na`
holds at **0 of 33** behaviours — the denominator re-derived rather than read off
`Object.keys`, which is 220.1's instrument trap reproducing here.

**A gate is refused a fourth time, but on a NEW predicate** (ROADMAP 227.2, left
open). 216.2/217.2/220.2 all refused gating a decaying *cite*. This is a
hand-typed literal used in arithmetic whose other operands come from a live read
— a shape a detector can actually see. Its base rate is unmeasured, and if it is
1-of-1 it is 94.11 ceremony and should be refused again.

## Round 2 on alerts (2026-08-31, cloud wake) — NO-OP, and the sweep beside it found one thing (ROADMAP 231)

Dispatcher rule 6; `polish_requeue.py --check` re-queued **eight** surfaces, six
of them `content: 3` at `1/3` — the same unbroken tie §3b's "lowest score, then
fewest rounds" cannot break, for the fourth time. Broken the way `badge`'s round
did: by asking where a defect could actually be, given that the last four
non-no-op rounds (breadcrumb, data-table, icon, sidebar-nav) all found **the same
shape** — a cite naming a literal or a count that the source had since moved.

§3b's reconciliation, four arms, all clean:

1. **The entry exists** — `alert`, `content: 3`, `scored: 2026-08-23`, matching
   the ledger's round-1 row.
2. **It is published** — all **40** entries render on a built page (40 → 39
   pages; `alert`→`alerts`, `skeleton`+`state`→`state-patterns`). **Zero**
   `Not yet scored`, zero `NaN`/`undefined / 3`. Redundant with assertion 7's
   per-name gate since 176.1, but taken independently off the built HTML rather
   than read off the gate's own verdict. Three component pages carry no
   `DsaScore` section at all — `inline-editing` and `table-toolbar`, both already
   annotated *"(unscored in DSA)"* in this table, and `nav`, never seeded here.
3. **The cited literals hold** — **17 of 17** present across the seven re-queued
   surfaces that have DSA entries, 0 absent. The only *countable* cite,
   `dashboard · typography` (`3rem` "has exactly one caller"), reads **exactly 1**
   comment-stripped against 2 raw occurrences — the second being its own
   explanation, which is CLAUDE.md's "assertion tripped by its own explanation"
   trap avoided rather than hit.
4. **No silent NaN path** — `DsaScore.astro` spreads `entry.dimensions[d]` for
   every `d` in `rubric.dimensions`, so a missing key publishes `NaN%` with
   nothing throwing. **6 of 6** dimensions on **40 of 40** entries, zero extra
   keys, zero non-integer non-`na` scores.

**So the round is a NO-OP and no blind re-score is owed** — nothing in the
published artefact changed, `scored` stays **2026-08-23**, and `dry` stays **0**
because there was no re-score to fail. `rounds` moved 1→2 on `badge`'s
precedent, not 182.1's: this round changed no artefact.

**One instrument error, caught and corrected mid-round, worth recording because
it inverted a verdict.** The variant sweep was first run against page *source*
and reported icon's 19 glyph classes as a false positive, on the reasoning that
`icon.astro:39` builds glyph classes by regex over the CSS and a source grep
cannot see them. Re-run against the **built** page — the artefact, per CLAUDE.md's
bulk-edit rule — it is not a false positive at all: the page renders **12 of 26**,
and the 14 missing ones genuinely appear only in the generated tables. The
source-grep reading was the wrong instrument, and believing it would have thrown
away the one real finding's whole base rate.

**What the sweep found is filed as ROADMAP 231.2, not fixed here** — 101.3's stop
rule confines Polish to the existing ratchet and no DSA dimension flags it.
`bo-alert--elevated` is published twice on `/components/alerts` (both inside the
generated `ClassRef`/`ApiTable`) and explained nowhere, while `--success` reads 5,
`--warning` 5 and `--danger` 3 on the same page — the discrimination that makes
the count a signal. It is **1 of 17** such variants and the only one with no
recorded reason: 14 are icon glyphs, covered by icon's own `fit` cite (*"the set
is an example of the mechanism rather than a catalogue"*), and the two
`--seamless` are scoped in prose on `/patterns/editable-grid`. Its three call
sites are all the notification screen, so Objective §3's "≥2 real, independent
compositions" is the actual question.

**No gate proposed.** That would be the fifth refusal in this ledger and the
predicate's base rate here is **1 of 89** — 94.11 ceremony by the same test
227.2 named.

## Round 2: stepper (2026-09-01, cloud wake) — NO-OP, and a fifth arm

Dispatcher rule 6, reached because rules 1-5 were all clear: no P0, Standardize
at `1 / 4`, Objective at `1 / 3`, rule 4's three open items all blocked (two
owner, one owner-hardware), and rule 5 `ok` with its newest pair
`axe-violations 0.0 -> 0.0`. `polish_requeue.py --apply` re-queued **8**
surfaces.

**The pick was measured, not alphabetical.** §3b breaks ties by fewest rounds
used, which left five re-queued surfaces level at `1/3` — calendar, dashboard,
inline-editing, stepper, tree-table. Two further readings settled it:

```
git log -1 --format='%ai %h' -- packages/core/src/css/components/<s> \
    apps/docs/src/pages/components/<s>.astro
# calendar 2026-08-24 · dashboard 2026-08-23 · tree-table 2026-08-25
# inline-editing 2026-08-27 17:57:55 · stepper 2026-08-27 18:55:14
```

stepper's source is the most recently changed, and it is the only one of the
five with a full `dsa-scores.json` entry, so all five arms are falsifiable on
it — `inline-editing` has no entry at all (correctly: its page makes no
`DsaScore` call, and `check:dsa-scores` reads `40 requested by a page, all
scored`, so this is the ledger's recorded "unscored in DSA", not scan's defect
repeating).

**What re-queued it** was real CSS, not a whitespace move: `2a47d4eb..HEAD`
adds GAP-17's wrap fix (`flex-wrap`, `row-gap`, `min-inline-size: auto`, a
tightened connector under `@container bo-stepper (max-width: 30rem)`) and the
third copy of the visually-hidden recipe. So the cites had something to decay
against.

### The five arms

1. **Wrong-choice clause present** — `check:wrong-choice` passed, `156
   assertion(s) across 80 pages (components: 37 carry / 1 outstanding / 3
   exempt)`. The one outstanding is the skipped `date`.
2. **`dsa-scores.json` entry rendered by its page** — `check:dsa-scores`
   passed, `360 assertion(s) across 40 scored components (40 requested by a
   page, all scored)`, and `grep -rlo 'Not yet scored' apps/docs/dist/components/`
   returns nothing.
3. **Line-number citations into shipped CSS: still 1 of 40**, still
   `badge · spacing -> badge.css:42`, and re-read at the line rather than
   trusted: line 42 reads `pushed the whole PAGE sideways: measured 373px wide
   against a 390px`, bare numbers inside a comment, exactly as the cite claims.
4. **`content` cites quoting a page clause verbatim — 20 of 20 present.**
5. **NEW — css dimension literals quoted in ANY cite, against the shipped css:
   81 of 81 present.**

Arm 5 exists because arm 4 covers `content` prose only, while **all four
defects this ledger has ever recorded were numbers in other dimensions** —
icon's `fit` "12 ERP glyphs", breadcrumb's `fit` "2 of 19 pattern screens",
data-table's `spacing` literal removed by 94.3, sidebar-nav's `fit` usage
count. Arm 4 could not have caught one of them.

Both arms are one probe, and **both were red-proved by injection, three times,
each injection confirmed present before the run** — a cite literal mutated
(`1.75rem` -> `1.77rem`), the css mutated instead (`1.75rem` -> `1.8rem` in a
copy of the tree), and a `content` clause reworded. Each went red on exactly
the injected item and nothing else; the clean tree returns `20/20` and `81/81`.

```js
// save as a scratch .mjs and run with node; ARM_SCORES / ARM_CSS / ARM_DIST
// point at mutated copies, which is how the red-proof is re-run.
import fs from 'node:fs';
import path from 'node:path';
const R = process.cwd();
const SCORES = process.env.ARM_SCORES || `${R}/apps/docs/src/data/dsa-scores.json`;
const CSS = process.env.ARM_CSS || `${R}/packages/core/src/css/components`;
const DIST = process.env.ARM_DIST || `${R}/apps/docs/dist/components`;
const S = JSON.parse(fs.readFileSync(SCORES, 'utf8')).components;
const A = JSON.parse(fs.readFileSync(`${R}/packages/core/dist/api.json`, 'utf8'));
const slug = (k) => (A.pageSlug || {})[k] || k;
const norm = (s) => s.replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&quot;/g,'"')
  .replace(/&#39;/g,"'").replace(/[‘’]/g,"'").replace(/[“”]/g,'"')
  .replace(/[–—]/g,'-').replace(/\s+/g,' ').trim();
let q4 = 0; const m4 = [];
for (const [k, e] of Object.entries(S)) {
  const cite = e.dimensions?.content?.cite; if (!cite) continue;
  const quotes = [...cite.matchAll(/"([^"]{6,})"/g)].map((x) => x[1]);
  if (!quotes.length) continue;
  const f = `${DIST}/${slug(k)}/index.html`;
  if (!fs.existsSync(f)) { m4.push(`${k} NOPAGE`); continue; }
  const text = norm(fs.readFileSync(f, 'utf8').replace(/<[^>]+>/g, ' '));
  for (const x of quotes) { q4++; if (!text.includes(norm(x))) m4.push(`${k} :: "${x}"`); }
}
// `form/` is the ONE dir with no canonical form.css — select dirs by
// isDirectory, never by the existence of <dir>/<dir>.css (see below).
const dirs = fs.readdirSync(CSS).filter((d) => fs.statSync(path.join(CSS, d)).isDirectory());
const readDir = (d) => fs.readdirSync(path.join(CSS, d)).filter((f) => f.endsWith('.css'))
  .map((f) => fs.readFileSync(path.join(CSS, d, f), 'utf8')).join('\n');
const LIT = /\b\d+(?:\.\d+)?(?:px|rem|em|ms|s|ch|vw|vh|%)\b/g; // unit-bearing only
let q5 = 0; const m5 = [];
for (const [k, e] of Object.entries(S)) {
  const d = [k, slug(k)].find((x) => dirs.includes(x));
  if (!d) { m5.push(`${k} NODIR`); continue; }
  const css = readDir(d);
  for (const [dim, v] of Object.entries(e.dimensions || {}))
    for (const lit of new Set(String(v.cite || '').match(LIT) || [])) {
      q5++; if (!css.includes(lit)) m5.push(`${k} · ${dim} :: ${lit}`);
    }
}
console.log(`arm 4 ${q4 - m4.length}/${q4}`, m4);
console.log(`arm 5 ${q5 - m5.length}/${q5}`, m5);
```

### Two instrument defects, both caught before they became findings

- **Arm 5's first run reported `form · spacing :: 1rem` UNRESOLVED** — a
  slug-to-directory failure, not a decayed cite. The resolver required
  `<dir>/<dir>.css`, and `form/` is the **only** component dir with no such
  file (it holds `input.css`, `select.css`, `form-field.css`,
  `form-section.css`, `checkbox-radio.css`), so `form` fell through to a block
  match and was searched against `data-table,quantity,richtext`. Command that
  finds it: `for d in packages/core/src/css/components/*/; do n=$(basename $d);
  [ -f "$d$n.css" ] || echo $n; done` -> `form`, and nothing else. The fix
  reports *fewer* unresolved, which is this ledger's own "a parser change that
  reports MORE is not self-evidently a fix" inverted — hence the css-side
  red-proof, which is the only thing that distinguishes a real fix here from a
  detector that stopped being able to fail.
- **A negative check that matched everything.** Verifying stepper's
  `typography` cite (*"no raw font-size"*),
  `grep -nP 'font-size\s*:\s*(?!var\()'` reported **2** on the clean file and
  **2** on a copy with `font-size: 13px` injected — it discriminated nothing,
  because `\s*` backtracks to zero width and the lookahead then succeeds one
  space before `var(`. A possessive `\s*+` fixes it: **0** clean, **1**
  injected. Across the whole component tree it reads **8** raw font-size
  declarations, one of which is `dashboard.css:185 font-size: 3rem` —
  corroborating dashboard's own typography cite rather than contradicting it.
  The first form was also *fail-open*: it sat in a `grep ... || echo "none"`
  pipeline, so its error message (`conflicting matchers specified`) printed a
  reassuring "none".

### One thing recorded and deliberately NOT called a defect

`dashboard · spacing` says *"zero uncommented dimension literals — the 32px and
20rem/1rem a scan flags are numbers quoted INSIDE the comments that explain
them"*. `dashboard.css:16` carries a live `20rem`:
`minmax(min(var(--bo-widget-min, 20rem), 100%), 1fr)`. It is not a decay —
`git blame -L 16,16` dates it to **2026-08-12**, eleven days before the
2026-08-23 score, so the scorer had it in front of them — and it reads as the
fallback of a documented consumer-override hook (`check:token-refs`: *"11
consumer-override hook(s) carrying a fallback"*), which is a blessed category
rather than a bare literal. Calling it a defect would require re-running "a
scan" the cite names and this repo does not ship — 94.11's dimension-literal
gate was measured at a 155/155 base rate and refused. Recorded so a later wake
does not re-derive it; **not fixed, and not counted as a finding.**

### No gate proposed — and this time the base rate says so outright

Arm 4 reads **20/20** and arm 5 **81/81**. Both predicates are uniformly true
of the corpus today, which is exactly 94.11's test for ceremony: a detector
whose predicate already holds for 100% of the tree distinguishes nothing, however
carefully written. 101.3's stop rule independently forbids Polish adding gates.
So both stay **recorded, not gated**, and the numbers are here to be
re-measured — arm 4 was **18/18** when 176.1 wrote it and is **20/20** now, the
corpus having gained two quotes, so the base rate is stable across a real
change rather than merely unexamined.

**No blind re-score is owed**: the round changed no artefact, so `scored` stays
**2026-08-23** and `dry` stays **0** — there was no re-score to fail. `rounds`
moves 1→2 on badge's and alerts' precedent.

**Not verified, said plainly.** This was a cloud wake: no Podman, no
`localhost:8081`, so the 1440/390 light-and-dark screenshot lane could not run.
Nothing in this round rests on a rendered image — the diff is this ledger and
no CSS or page markup changed — and every browser-derived number quoted above
came from a gate executing in this container.

## Round 2: tree-table (2026-09-01, cloud wake) — NO-OP, and a sixth arm

Dispatcher rule 6, reached because rules 1-5 were all clear: no P0, Standardize
at `1 / 4`, Objective at `1 / 3`, rule 4's three open items all blocked (two
owner, one owner-hardware), and rule 5 `ok` with its newest pair
`axe-violations 0.0 -> 0.0`. `polish_requeue.py --apply` re-queued **7**
surfaces.

**The pick was measured.** §3b's tie-break left four re-queued surfaces at
`1/3`; `inline-editing` drops out for 217.1's stated reason (no
`dsa-scores.json` entry, so no arm can disagree with it), leaving calendar,
dashboard and tree-table. Source movement since each surface's own `scored`
date, with 217.1's `+08:00` boundary:

```
BASE=$(git rev-list -1 --before=2026-08-23T23:59:59+08:00 HEAD)   # a9ba5c7e
# calendar    2 commits +18/-2   last touch 2026-08-24 05:08
# dashboard   0 commits    0/0   last touch 2026-08-23 21:04  (227.1's reading, unchanged)
# tree-table  1 commit  +20/-12  last touch 2026-08-25 22:07   <- picked
```

**What re-queued it was real CSS**: `td` -> `:is(td, th)` across the eleven-rule
indent ladder, so a `<th scope="row">` first column keeps its indentation. The
cites had something to decay against.

### The six arms

1. **Wrong-choice clause present** — `check:wrong-choice` passed, `156
   assertion(s) across 80 pages (components: 37 carry / 1 outstanding / 3
   exempt)`; the one outstanding is the skipped `date`.
2. **`dsa-scores.json` entry rendered by its page** — `check:dsa-scores`
   passed, `360 assertion(s) across 40 scored components (40 requested by a
   page, all scored)`.
3. **Line-number citations into shipped CSS: still 1 of 40**, still
   `badge · spacing -> badge.css:42`, re-read at the line rather than trusted.
4. **`content` cites quoting a page clause verbatim — 20 of 20 present.**
5. **CSS dimension literals quoted in any cite — 81 of 81 present.**
6. **NEW — bare (unitless) counts in any cite, re-verified against the tree
   each one names: 8 of 8.**

Arm 6 exists because **arm 5's literal regex is unit-bearing only**, so a cite
claiming *"po-app uses it at 13 sites"* is invisible to it — and that is where
**3 of the 5 defects this ledger has recorded** lived: `sidebar-nav · fit`,
`breadcrumb · fit`, `icon · fit`. Arms 4 and 5 could not have caught one of
them.

**The claimed number is parsed FROM THE CITE, never hard-coded** — a probe with
the expectation baked in only sees the tree move, and 227.1's defect was on the
cite side. **Red-proved three times, each injection confirmed present in the
parsed JSON or the measured tree before the run**, each going red on exactly
the injected row: a tree-side mutation (a fourth `bo-navbar` line ->
`cite says 3, tree reads 4`), a cite-side mutation (`13 sites` -> `12`), and a
cite-SHAPE mutation (`across its 5 CSS files` -> `across its CSS files` ->
`CITE NO LONGER MATCHES`). Clean tree: 8/8.

```js
// save as a scratch .mjs and run with node; ARM_ROOT / ARM_SCORES point at
// mutated copies, which is how the red-proof is re-run. A shadow ARM_ROOT with
// symlinks for what is not mutated is enough.
import fs from 'node:fs';
import path from 'node:path';
const R = process.env.ARM_ROOT || process.cwd();
const SCORES = process.env.ARM_SCORES || `${R}/apps/docs/src/data/dsa-scores.json`;
const S = JSON.parse(fs.readFileSync(SCORES, 'utf8')).components;
const read = (p) => fs.readFileSync(path.join(R, p), 'utf8');
// LINES containing the token, not occurrences: the revision walk shows `grep -c`
// is what produced navbar's 3 and dialog's 13 (13 lines / 14 occurrences since
// 4d9014d2, 2026-08-20). Chosen from that history, NOT because it is the reading
// that passes — see "the ambiguity" below.
const count = (p, needle) => read(p).split('\n').filter((l) => l.includes(needle)).length;
// top-level pattern pages only: patterns.json counts 39, a recursive glob returns 47 (220.1)
const patternPages = () => fs.readdirSync(path.join(R, 'apps/docs/src/pages/patterns'))
  .filter((f) => f.endsWith('.astro') && f !== 'index.astro');
const filesWith = (needle) => patternPages()
  .filter((f) => read(`apps/docs/src/pages/patterns/${f}`).includes(needle)).length;

const CLAIMS = [
  { k: 'navbar',   d: 'fit', re: /po-app uses it at (\d+) sites/,     live: () => count('examples/po-app/server.mjs', 'bo-navbar') },
  { k: 'dialog',   d: 'fit', re: /po-app uses it at (\d+) sites/,     live: () => count('examples/po-app/server.mjs', 'bo-dialog') },
  { k: 'offcanvas',d: 'fit', re: /used in (\d+) pattern screens?/,    live: () => filesWith('bo-offcanvas') },
  { k: 'tabs',     d: 'fit', re: /used in (\d+) pattern screens?/,    live: () => filesWith('bo-tabs') },
  { k: 'form', d: 'typography', re: /across its (\d+) CSS files/,     live: () => fs.readdirSync(path.join(R, 'packages/core/src/css/components/form')).filter((f) => f.endsWith('.css')).length },
  { k: 'scan',     d: 'fit', re: /rf-essentials' (\d+) kB RF budget/, live: () => Number(/RF_BUDGET_KB = (\d+)/.exec(read('packages/core/scripts/build-rf-essentials.mjs'))[1]) },
  { k: 'date', d: 'fit', re: /(\d+) prose mention on \/components\/amount is the only occurrence outside its own page/,
    live: () => fs.readdirSync(path.join(R, 'apps/docs/src/pages/components'))
      .filter((f) => f.endsWith('.astro') && f !== 'date.astro')
      .reduce((n, f) => n + count(`apps/docs/src/pages/components/${f}`, 'bo-date'), 0) },
  { k: 'date', d: 'fit', re: /and (zero) screens use it/,
    live: () => (count('examples/po-app/server.mjs', 'bo-date') === 0 ? 'zero' : 'some') },
];

let ok = 0; const bad = [];
for (const c of CLAIMS) {
  const cite = String(S[c.k]?.dimensions?.[c.d]?.cite || '');
  const m = c.re.exec(cite);
  if (!m) { bad.push(`${c.k} · ${c.d} :: CITE NO LONGER MATCHES ${c.re}`); continue; }
  const live = String(c.live());
  if (m[1] === live) ok++; else bad.push(`${c.k} · ${c.d} :: cite says ${m[1]}, tree reads ${live}`);
}
console.log(`arm 6 ${ok}/${CLAIMS.length}`, bad);
process.exitCode = bad.length ? 1 : 0;
```

### The class is 8 claims, not the 4 this ledger records

217.2 measured it at **6 of 240 cites** and 220.2 recorded it shrinking "by
construction" to **4 of 240** once the two stale ones were repaired.
Re-measured this wake — which CLAUDE.md makes part of the criterion rather than
a courtesy, the premise being an earlier wake's measurement with **no command
recorded beside it**.

A bare-integer regex over all 240 cites returns **31**, and most are noise:
dates (`2026`), Polish round numbers, roadmap slice refs (`73.2`, `45.3`,
`36.1`), badge's line number (arm 3's business), and icon's `%23000` hex
fragment. Hand-classified down to checkable quantitative claims about the tree:
**8, across 7 cites**, every one exact today —

| cite | claim | live |
|---|---|---|
| `navbar · fit` | po-app uses it at **3** sites | 3 |
| `dialog · fit` | po-app uses it at **13** sites | 13 |
| `offcanvas · fit` | used in **1** pattern screen | 1 |
| `tabs · fit` | used in **2** pattern screens | 2 |
| `form · typography` | zero raw font-size across its **5** CSS files | 5 |
| `scan · fit` | rf-essentials' **40** kB RF budget gate | `RF_BUDGET_KB = 40` |
| `date · fit` | **1** prose mention on `/components/amount`, the only one off its own page | 1 |
| `date · fit` | **zero** screens use it | 0 in `examples/` |

**217.2's six were all in `fit`**, so `form · typography`, `scan · fit` and
`date · fit` were never in the class. Nothing published is wrong; the ledger's
own figure was, for the reason 220.1 gave about a different figure — a count
recorded without its command.

### The ambiguity, and why arm 6 counts lines

**Arm 6's first run reported `dialog · fit :: cite says 13, tree reads 14`.**
Neither number is wrong:

```
grep -c 'bo-dialog' examples/po-app/server.mjs           # 13  lines containing
grep -o 'bo-dialog' examples/po-app/server.mjs | wc -l   # 14  occurrences
#  line 470 carries bo-dialog__header AND bo-dialog__title
```

Walking every revision of `server.mjs`, both readings have been stable at 13/14
since `4d9014d2` (2026-08-20), three days **before** the 2026-08-23 score — so
`13` is exact under the instrument that produced it and has not decayed.
`navbar`'s 3 agrees under both readings, which is why the ambiguity stayed
hidden until a second cite of the same shape was checked.

So arm 6 counts lines, **chosen from that revision history and not because it
is the reading that passes** — a detector fitted to whichever method makes the
number match is exactly the detector-that-cannot-fail this repo's doctrine
names. The occurrence count is written down here so the next divergence is
visible rather than re-litigated.

**The claim beside the number was checked too, per 192.1.** `dialog · fit` also
says *"the heaviest real usage in this family"*: within the overlay family in
po-app it is 13 against `bo-offcanvas`, `bo-popover`, `bo-tooltip` and
`bo-drawer` all at **0**, so it holds as scoped. It is not the heaviest usage
in po-app overall (`bo-data-table` 53, `bo-btn` 40) — but the cite says
*family*.

### No gate proposed — the fifth refusal, and this time the table IS the gate's body

101.3's stop rule forbids Polish adding gates. 217.2, 220.2 and 227.2 each
refused this class on the ground that a gate would need every cite to carry its
own command — and arm 6's `CLAIMS` table is precisely that, hand-maintained,
eight rows long, with no rule a detector could derive from a cite it has not
seen. 8 of 8 is also uniformly true today, 94.11's own test for ceremony. So it
stays a probe recorded here, re-runnable, not a build gate.

**No blind re-score is owed**: the round changed no artefact, so `scored` stays
**2026-08-23** and `dry` stays **0** — there was no re-score to fail. `rounds`
moves 1->2 on badge's and alerts' precedent.

**Not verified, said plainly.** Cloud wake: no Podman, no `localhost:8081`, so
the 1440/390 light-and-dark screenshot lane could not run. Nothing in this
round rests on a rendered image — no CSS and no page markup changed — and every
browser-derived number quoted came from a gate executing in this container.


---

## Round 2 — calendar (2026-09-02): six arms clean, and a seventh finds the sixth defect

Dispatched by rule 6. Picked over `dashboard` on source movement since the
ledger's own stamp (+18/-2 across 2 commits vs +7/-1 across 1); `inline-editing`
dropped for 217.1's reason, **verified** — `dsa-scores.json` has no entry for it.
The two tie-break instruments this ledger has used disagree on dashboard and
agree on the pick; ROADMAP 240 carries both readings and why neither is wrong.

### calendar's own cites: all six hold

Checked at the source, not inferred. `typography` *"no raw font-size"* — both
`font-size` declarations in `calendar.css` are `var(--bo-…)`. `colour` *"zero
raw colour"* — no hex/rgb/hsl in the dir. `spacing` *"all three numbers are em"*
— the holiday dot is `inset-block-end: 0.15em`, `inline-size: 0.3em`,
`block-size: 0.3em`; three numbers, three `em`. `content`'s quoted clause
*"Not for a plain date field"* is present in the built page (arm 4).

The `+15/-0` that re-queued it (`16ed66dd`, the RANGE paragraph) added a link to
`/components/form#dates`. **The fragment resolves** — `id="dates"` is present
exactly once on the built form page — which the link checker does not verify.

### The six standing arms, all reproducing

| arm | reading | note |
|---|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` | the outstanding is the skipped `date` |
| 2 score rendered by its page | `360 assertions / 40 scored` | `Not yet scored` absent from dist |
| 3 line-number cites | **1 of 40**, `badge · spacing -> badge.css:42` | re-read AT the line: *"pushed the whole PAGE sideways: measured 373px wide against a 390px"* — bare numbers in a comment, as cited |
| 4 content quotes in built pages | **20/20** | |
| 5 css dimension literals (unit-bearing) | **81/81** | |
| 6 bare counts in any cite | **8/8**, now **9/9** | a row added this round, below |

### Arm 7 — absence claims

The full measurement, the two definitional choices, the three red-proofs and the
refusal of a gate are in ROADMAP 240.2. In short: **43 checkable absence claims
across 27 components, 42 exact, and the 43rd is 240.1.** Arms 4-6 all verify
that something a cite NAMES is present; an absence claim names nothing, so all
three are blind to it by construction.

**Arm 7 read `42/43` before the fix and `42/42` after** — the corrected claim
left the class rather than joining the passing set, because arm 7 derives its
set from the cites. The delta and its reason are the finding; the ratio is not.

```js
// save as a scratch .mjs and run with node; ARM_CSS / ARM_SCORES point at
// mutated copies, which is how the red-proof is re-run.
// arm 7 — ABSENCE claims in cites, verified against the shipped CSS.
// ARM_SCORES / ARM_CSS point at mutated copies, which is how the red-proof re-runs.
import fs from 'node:fs';
import path from 'node:path';
const R = process.env.ARM_ROOT || process.cwd();
const SCORES = process.env.ARM_SCORES || `${R}/apps/docs/src/data/dsa-scores.json`;
const CSS = process.env.ARM_CSS || `${R}/packages/core/src/css/components`;
const S = JSON.parse(fs.readFileSync(SCORES, 'utf8')).components;
const A = JSON.parse(fs.readFileSync(`${R}/packages/core/dist/api.json`, 'utf8'));
const slug = (k) => (A.pageSlug || {})[k] || k;
// select dirs by isDirectory, never by <dir>/<dir>.css — `form/` has no form.css (arm 5)
const dirs = fs.readdirSync(CSS).filter((d) => fs.statSync(path.join(CSS, d)).isDirectory());
// Comments are STRIPPED before every test: badge.css:42 is bare numbers inside a
// comment, and the cite there says outright they are "not declarations".
const strip = (s) => s.replace(/\/\*[\s\S]*?\*\//g, ' ');
const readDir = (d) => fs.readdirSync(path.join(CSS, d)).filter((f) => f.endsWith('.css'))
  .map((f) => strip(fs.readFileSync(path.join(CSS, d, f), 'utf8'))).join('\n');

// Each claim is PARSED FROM THE CITE, never hard-coded: a probe carrying the
// expectation only ever sees the tree move (227.1's defect was on the cite side).
const KINDS = [
  { kind: 'font-size', re: /\b(?:no|zero) raw font-size\b/i,
    // a font-size declaration whose value is not purely var()/keyword
    find: (css) => [...css.matchAll(/font-size\s*:\s*([^;}]+)/gi)]
      .map((m) => m[1].trim())
      .filter((v) => /\d/.test(v.replace(/var\([^)]*\)/g, ''))) },
  { kind: 'hex', re: /\bzero raw hex\b/i,
    // %23 is a '#' inside a data: URI — an encoded hex is still a raw hex
    find: (css) => [...css.matchAll(/#[0-9a-fA-F]{3,8}\b|%23[0-9a-fA-F]{3,6}\b/g)].map((m) => m[0]) },
  { kind: 'dimension', re: /\bzero raw dimension literals\b/i,
    // LENGTH units only: s/ms are time and % is a ratio, neither is a "dimension
    // literal" in the sense the spacing cites use (they are about space tokens).
    find: (css) => [...css.matchAll(/\b\d+(?:\.\d+)?(?:px|rem|em|ch|vw|vh)\b/g)].map((m) => m[0]) },
];

let ok = 0; const bad = []; let claims = 0;
for (const [k, e] of Object.entries(S)) {
  const d = [k, slug(k)].find((x) => dirs.includes(x));
  for (const [dim, v] of Object.entries(e.dimensions || {})) {
    const cite = String(v.cite || '');
    for (const K of KINDS) {
      if (!K.re.test(cite)) continue;
      claims++;
      if (!d) { bad.push(`${k} · ${dim} :: NODIR`); continue; }
      const hits = K.find(readDir(d));
      if (hits.length === 0) ok++;
      else bad.push(`${k} · ${dim} :: cite claims no ${K.kind}, css has ${hits.length}: ${[...new Set(hits)].slice(0, 6).join(' ')}`);
    }
  }
}
console.log(`arm 7 ${ok}/${claims}`);
for (const b of bad) console.log('   ', b);
process.exitCode = bad.length ? 1 : 0;
```

### The row this round added to arm 6

240.1's corrected cite was kept checkable by moving it here, where a fixed
`CLAIMS` table reports `CITE NO LONGER MATCHES` if the wording shifts — the
weakness arm 7 has by construction. Red-proved by injecting a third hex into an
isolated copy of the tree (`8/9`, *"cite says two, tree reads 3"*), injection
confirmed present in the copy and absent from the real tree; clean control
`9/9`.

```js
  { k: 'form', d: 'colour', re: /the (two) select-chevron greys/,
    live: () => { const d = `${R}/packages/core/src/css/components/form`;
      const n = fs.readdirSync(d).filter((f) => f.endsWith('.css'))
        .map((f) => fs.readFileSync(path.join(d, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, ' '))
        .join('\n').match(/%23[0-9a-fA-F]{3,6}\b|#[0-9a-fA-F]{3,8}\b/g)?.length || 0;
      return n === 2 ? 'two' : String(n); } },
```

### Not verified, said plainly

Cloud wake: no Podman, no `localhost:8081`, so the 1440/390 light-and-dark
screenshot lane could not run. **This round changed no CSS and no page markup** —
the diff is `dsa-scores.json`'s one cite string, `ROADMAP.md`, this ledger and
the bookkeeping files — so nothing in it rests on a rendered image. Every
browser-derived number quoted came from a gate executing in this container.
**240.1, which does need that lane, was deliberately NOT attempted and is left
open for a local wake.**

---

## Round 2 — dashboard (2026-09-02): two defects, and the first blind re-score this ledger has run

Dispatched by rule 6, reached because rules 1-5 were all clear — no P0, no
GitHub intake, `Standardize 3 / 4`, `Objective 2 / 3 [238, 241]`, rule 4's three
open items all blocked (two owner, one owner-hardware, **none** browser-blocked),
and rule 5 `ok` with `axe-violations 0.0 → 0.0 → 0.0` plus `RF_BUDGET_KB = 40`
passing at `min 38.0 kB`. Full trace and both findings in ROADMAP 242.

**The pick needed no invented discriminator — the first time since 176.1.**
`polish_requeue.py --apply` re-queued **5**. §3b's own tie-break settled it:
`alert`, `icon` and `scan` are at `2/3`; of the two at `1/3`, `inline-editing`
drops for 217.1's reason, verified not inherited
(`'inline-editing' in dsa-scores.json.components` → **false**). `dashboard` was
the only re-queued surface at `1/3` with an entry.

### Defect 1 — `interaction: na`, and the score was the wrong part

Every defect this ledger has recorded was a right score with a wrong cite. This
one is not. `initCollapsibleCards` is a shipped behaviour whose three hooks —
`bo-widget__collapse`, `data-collapse-trigger`, `data-state` — are all on
dashboard's own `api.json` surface, and the docs page demos it with two copies
of the import. The rubric admits `na` *"only when there is no interaction
surface at all"*, and says a component shipping **no** behaviour earns **3 by
saying so** — so `na` was unjustifiable even under the cite's own false premise.

Wrong when written, not decayed: `collapsible-card.ts` and the CSS part landed
in the same commit `055a706a` (**2026-08-14**), nine days before the
`2026-08-23` score.

**§3b step 4 ran for real.** A second agent was given the surface, the dimension
and the rubric text, told not to open `dsa-scores.json`, `polish-state.md`,
`ROADMAP.md` or `ROADMAP-archive.md`, and told nothing about the old score or
that anything was suspected. It returned **3** and ruled out `na` on its own
reading. Every round since 182.1 has correctly recorded this step as *owed*; it
is now discharged for this one dimension.

**`scored` stays `2026-08-23`.** One dimension was blind re-scored, not six —
moving the entry stamp would claim an opinion on the other five that nobody
gave. The 2026-09-02 date is stamped inside the `interaction` cite instead,
which is the form `content`'s cite already uses. `rounds` 1→2; `dry` stays 0, a
score having moved.

### Defect 2 — the `spacing` cite misstates which literals are live

Three live length literals comment-stripped, not one: `20rem` at `:16` (the cite
lists it among the comment-only numbers — it is live), `41rem` at `:145` (the
cite never mentions it), and the `3rem` font-size it correctly defers to
typography. Stable at `20rem 41rem 3rem` across **9 of 9 revisions**, newest
2026-08-21 — before the score. Score stays 3: both live literals carry their
reason in place (`--bo-widget-min`'s documented override fallback; `41rem`
derived in the comment above it), so 216.1's shape.

This **supersedes** the stepper round's *"recorded and deliberately NOT called a
defect"*. That reasoning holds for the score and is why the score does not move,
but it examined `20rem` alone and never saw `41rem`, and it does not reach the
cite's locational claim.

### Arm 8 — new, and four discarded definitions are the record worth keeping

**A component scored `interaction: na` whose own docs page imports a behaviour:
1 of 18 before the fix, 0 of 17 after.** Arms 1-7 verify that something a cite
NAMES resolves, so all seven are blind to a wrong score by construction.

> ⚠ **Read "No gate" below before using this arm.** That sentence is wrong about
> the mechanism — nothing here reads a page *import*; 21 of 21 matches are demo
> content — and 242.1 was answered **REFUSED** on 2026-09-02 (ROADMAP 243): the
> arm goes red on a correct tree, so it stays a probe a human reads.

Four ownership definitions were measured and discarded before one discriminated:
a CSS grep (flagged 7 on `.bo-btn` noise, **missed** the true positive — its hook
regex dropped `__` parts); "every hook in the api.json surface" (`initCombobox`
also drives the shared `bo-visually-hidden`, so an injected combobox escaped);
"a hook on an exclusively-owned block" (`api.json`'s `blocks` records blocks a
component *references* — `bo-widget` is listed by both `dashboard` and `form` —
so dashboard escaped); and data-attribute hooks (right on dashboard, but
combobox's own `data-name`/`data-open-on-focus`/`data-value` are not in its
recorded `dataAttrs`). Only reading the **page's own import** — what the rubric
actually scores — works. This reproduces, independently, the rubric's own note
that 94.9 applied this dimension *"by READING all 14 behaviour-backed pages, not
by grep — an earlier regex was wrong on 4 of 7"*.

**Red-proved three ways, each injection confirmed:** combobox forced to `na` is
flagged; dashboard set to 3 flags nothing; the import removed from a page copy
makes dashboard clean. The page-side proof needed **two passes** — the first
`sed` left one of the **two** copies of the import standing — which is "count
the matches before replacing" landing for real.

**What the 17 does NOT cover.** Arm 8 clears a component when its docs page
imports no behaviour. That is not the same as confirming `na` is the right score
for it. `kbd · interaction` is the live illustration: its cite also says *"ships
no behavior"*, the same words this round just found false on dashboard, and for
`kbd` it is true — a `<kbd>` paints native text and has no interaction surface,
so `na` holds. But the rubric's *"a component that ships NO behavior earns 3 by
saying so"* means the boundary between `3` and `na` is a **reading**, not an
import, and arm 8 cannot see it. Sixteen of the seventeen are unexamined on that
question; **not re-scored here, and not asserted to be right.**

```js
// arm 8 — save as a scratch .mjs and run with node.
// ARM_SCORES / ARM_PAGES point at mutated copies, which is how the red-proof re-runs.
import fs from 'node:fs';
const R = process.env.ARM_ROOT || process.cwd();
const SCORES = process.env.ARM_SCORES || `${R}/apps/docs/src/data/dsa-scores.json`;
const PAGES = process.env.ARM_PAGES || `${R}/apps/docs/src/pages/components`;
const S = JSON.parse(fs.readFileSync(SCORES, 'utf8')).components;
const A = JSON.parse(fs.readFileSync(`${R}/packages/core/dist/api.json`, 'utf8'));
const slug = (k) => (A.pageSlug || {})[k] || k;   // page slugs are NOT class names
const IMPORT = /from\s+['"]@busy-office\/ui\/js['"]/;
let na = 0; const flagged = []; const clean = []; const missing = [];
for (const [k, e] of Object.entries(S)) {
  if (e.dimensions?.interaction?.score !== 'na') continue;
  na++;
  const f = `${PAGES}/${slug(k)}.astro`;
  if (!fs.existsSync(f)) { missing.push(`${k} (${slug(k)}.astro)`); continue; }
  const src = fs.readFileSync(f, 'utf8');
  if (IMPORT.test(src)) {
    const fns = [...src.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"]@busy-office\/ui\/js['"]/g)]
      .flatMap((m) => m[1].split(',').map((s) => s.trim())).filter(Boolean);
    flagged.push(`${k} :: page imports ${[...new Set(fns)].join(', ')}`);
  } else clean.push(k);
}
console.log(`arm 8 — ${na} scored interaction:na; ${flagged.length} whose docs page imports a behaviour`);
for (const f of flagged) console.log('   FLAG', f);
console.log(`   no page of their own (${missing.length}): ${missing.join(' ') || '-'}`);
console.log(`   clean (${clean.length}): ${clean.join(' ')}`);
process.exitCode = flagged.length ? 1 : 0;
```

### The seven standing arms all reproduce

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` absent from dist |
| 3 line-number cites | **1 of 40**, `badge · spacing -> badge.css:42`, re-read AT the line |
| 4 content quotes in built pages | **20/20** |
| 5 css dimension literals | **81/81** → **82/82** after the fix |
| 6 bare counts in any cite | **9/9** |
| 7 absence claims | **42/42** |

Arm 5's move is the reconciliation for this round's added citation, not a
coincidence: the new `spacing` cite quotes `41rem` and the old one did not.

### No gate — filed as ROADMAP 242.1, and deliberately NOT decided here

101.3 confines Polish to the existing ratchet. **Arm 8 is the first member of
this class that is mechanically writable** — 216.2/217.2/220.2/227.2 each
refused a gate because it would need every cite to carry its own command, and
arm 8 needs none. Against it: post-fix the predicate is true of **0 of 17**,
94.11's own ceremony test. `check:wrong-choice` is equally uniform and is valued
because it ratchets, so the two arguments are genuinely opposed and the decision
is not Polish's to take.

> **ANSWERED 2026-09-02 (ROADMAP 243, dispatched by rule 4): REFUSED — no gate,
> and the paragraph above is withdrawn on two counts.**
>
> - **"Mechanically writable" was true of the unsound version only.** The
>   narrowing that would make the predicate sound — require the named behaviour
>   to be the component's OWN — needs an ownership map, which is exactly what the
>   four discarded definitions above failed to produce. Its cheapest proxy
>   (behaviour name contains the page slug) **misses `dashboard`/
>   `initCollapsibleCards`, the only defect arm 8 has ever found.** So arm 8 is
>   in the same class as the four earlier refusals after all: a different missing
>   datum, an identical shape.
> - **Neither of the two opposed arguments decided it.** A third one did, and it
>   did not exist until the false-positive direction was injected: **the arm goes
>   red on a correct tree.** `navbar` scores `interaction: na` with the cite *"a
>   container: it holds controls but introduces none of its own"*; give its page
>   the same `initDropdowns()` demo `button.astro` already carries and the arm
>   flags it (`rc=1`) while the score stays right by its own words. All three
>   original injections varied the true positive; none tested this. 236.2's
>   precedent applies — a shape that fires on healthy states is a report, not a
>   gate.
>
> **Correction to this arm's own description.** *"whose docs page imports a
> behaviour"* misstates what it reads. Astro frontmatter runs on the server, so a
> page cannot wire a browser behaviour there and none tries: **21 of 21** matches
> sit inside a demo template literal or a body `<script type="module">`. The arm
> is a text scan of what a page DEMONSTRATES — which is why it cannot tell whose
> behaviour it found, and why **4 of 21** pages (`button`, `offcanvas`,
> `richtext`, `form`) name only a neighbour's.
>
> **Arm 8 is kept, as a probe a round runs and a human reads.** That is how it
> found dashboard, and it is what the rubric's own note prescribes for this
> dimension. Do not re-file it as a gate.

### Not verified, said plainly

Cloud wake: no Podman, no `localhost:8081`, so the 1440/390 light-and-dark
screenshot lane could not run. **This round changed no CSS and no page markup** —
the diff is `dsa-scores.json`'s two cite strings and one score, `ROADMAP.md`,
this ledger and the bookkeeping files — so nothing rests on a rendered image.
Every browser-derived number quoted came from a gate executing in this container.

---

## Round 2: avatar (2026-09-04, cloud wake) — NOT a no-op, and the finding is arm 3's whole class (ROADMAP 266)

Dispatcher rule 6, reached because rules 1-5 were clear or had no input: no open
P0, Standardize `1 / 4`, Objective `0 / 3`, rule 4's eleven open items all
blocked (eight owner, three browser-blocked in the SCREENSHOT sense), and rule 5
**STALE** — reported as *could not be evaluated*, per `LOOPS.md`, rather than
clear. `polish_requeue.py --apply` re-queued **20** surfaces, the widest re-queue
this ledger has recorded.

### The pick, and the tie-break that stopped working

§3b's "fewest rounds used" discriminated for the first time in seven rounds:
nine surfaces sat at `1/3` against eleven at `2/3`. `inline-editing` and
`table-toolbar` drop for 217.1's stated reason (no `dsa-scores.json` entry, so
no arm can disagree with them), leaving seven.

**216.1's discriminator — source movement since each surface's own `scored`
date — then returned the same value for all seven**, which this repo treats as a
defect in the instrument until proven otherwise:

```
# per candidate, with 217.1's +08:00 boundary
BASE=$(git rev-list -1 --before=<scored>T23:59:59+08:00 HEAD)
git diff --numstat $BASE HEAD -- <page> <css dir>
#  avatar breadcrumb byline navbar pagination progress tree  ->  +4/-1, 2 commits, ALL
```

It is not a defect. The two commits are `4dbec5bd` (249.8 — a `@tagline` header
on **40 of 40** component stylesheets) and `01fd7fc5` (249.2 — a `description`
on every docs page), so a repo-wide edit is *supposed* to move every surface by
the same amount. The instrument is fine and simply has nothing to say about a
round whose re-queue was caused by one commit touching everything.

Picked instead on the count of falsifiable assertions each entry carries, which
is the property the arms actually consume:

| surface | quotes | unit literals | bare counts | absence claims | cite chars |
|---|---|---|---|---|---|
| **avatar** | 1 | **4** | 0 | **4** | **949** |
| progress | 1 | 2 | 1 | 4 | 926 |
| navbar | 1 | 1 | 1 | 3 | 868 |
| tree | 1 | 2 | 0 | 3 | 808 |
| byline | 2 | 0 | 0 | 4 | 800 |
| pagination | 1 | 0 | 0 | 3 | 689 |
| breadcrumb | 0 | 0 | 0 | 5 | 511 |

### avatar's own six cites all hold

Checked at the source, not inferred. `typography` — `font-size: 0.7em` ×1 and
`1.8em` ×2 (`inline-size`/`block-size`), present. `colour` *"zero raw colour"* —
**0** hex/`rgb(`/`hsl(` outside comments, and the `forced-colors: active` block
does add `border: 1px solid CanvasText`. `spacing` — the `2px` ring
(`border: 2px solid var(--bo-color-bg-surface)`) and the `-0.5em` overlap
(`margin-inline-start`) both present, one each. `interaction: na` — **0 of 33**
behaviours match `/avatar/i` and the page imports none. `content`'s quoted clause
is in the built page (arm 4). `fit` *"em-sized … instead of shipping size
modifiers"* — `api.json` records `variants: []`, and the only `px` in the file
are the `1px` forced-colors border and the `2px` ring, neither a size.

The newly published `@tagline` makes the same claim in the sidebar and
`llms.txt` — *"em-sized so it tracks the text beside it"* — and it holds for the
same reading.

### The finding: arm 3 read 2 of 40, and neither pointer resolved

This ledger has recorded arm 3 as *"**1 of 40**, `badge · spacing ->
badge.css:42`, re-read AT the line"* in four consecutive rounds, most recently
2026-09-02. Both halves were wrong by the time this round ran.

- The **count** is 2: the 2026-09-02 dashboard round added `dashboard.css:16`
  to a cite without updating the arm's headline.
- The **content** decayed on **2026-09-03 23:16Z**, when `4dbec5bd` prepended
  the `@tagline` header to every component stylesheet — `+3/-0` on 27 files,
  `+4/-0` on the 13 carrying `@label` or `@order`.

Four live pointers into a component stylesheet existed; **all four were stale**,
and `git blame` puts every one of them before `4dbec5bd`:

| pointer | authored | claims | line now reads | actual |
|---|---|---|---|---|
| `badge · spacing` cite | 2026-08-20 | bare numbers at `badge.css:42` | *"the fix simply had not been propagated…"* | **45** |
| `dashboard · spacing` cite | 2026-09-02 | `20rem` live at `dashboard.css:16` | `.bo-widget-grid {` | **19** |
| `report-reach.mjs:130` | 2026-08-27 | `avatar.css:40` reads the stack comment | `object-fit: cover;` | **43** |
| `_shell.mjs:134` | 2026-08-23 | `breadcrumb.css:3` documents the `<ol>` | `@order 30 */` | **6-7** |

**4 of 4 is a reconciliation, not a surprising 100%**: every component
stylesheet gained a header, so every pre-249.8 pointer into one is stale by
construction. The first two are **published** in the DSA table on
`/components/badge` and `/components/dashboard`; the third is **printed by the
reach report on every `docs:build`**; only the fourth is a plain source comment.

**A fifth class, and it is different from the three this ledger already has.**
216.1's cite was wrong the day it was written; 217.2's and 220.1's were right
then and falsified by a change in **another tree**; 227.1's was falsified inside
the very file it described. This one was falsified in the file it describes, by
an edit that changed **nothing the cite was about** — the header carries no
declaration and no measurement. There is no wrong moment to catch and no
content change to notice; only a line count moved.

### Fixed by naming the property, not by refreshing the number

217.2 and 220.1 both replaced a decaying count with a property, and Slice 253
finding B dropped line numbers from *this ledger* for the same reason. A
refreshed 45/19/43/6 decays on the next header the build asks for — and 249.8 is
the proof that such a header can arrive across 40 files in one commit. Each
replacement was verified present before being written: the enclosing selector for
badge's `WRAP` comment was found by walking the braces (`.bo-badge`, opened at
line 6) rather than by eye.

**The first attempt was tripped by its own explanation.** Writing *"this cite
pointed at badge.css:42 and the measurements now sit at line 45"* into the cite
left the stale pointer in the **built page**: after a full rebuild
`grep -rl 'badge.css:42' apps/docs/dist` still returned **1**, and arm 3 still
read **2 of 40**. CLAUDE.md names this trap for assertions; it applies to
corrections too, and the rule is that the narrative belongs here rather than
inside the published evidence.

### Verified against the RENDERED artefact

| check | before | after |
|---|---|---|
| `badge.css:42` in `apps/docs/dist` | 1 file | **0** |
| `dashboard.css:16` in `apps/docs/dist` | 1 file | **0** |
| `avatar.css:40` in the reach report | printed every build | **0** |
| replacement text | 0 files | **1 each**, on `components/badge/` and `components/dashboard/` |
| arm 3 | 2 of 40 | **0 of 40** |

### The eight arms

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` absent from dist |
| 3 line-number cites | **2 of 40, both stale — the finding.** After the fix, **0 of 40**, so the arm now has no members |
| 4 content quotes in built pages | **20/20** |
| 5 css dimension literals | **82/82** |
| 6 bare counts in any cite | **9/9** |
| 7 absence claims | **42/42** |
| 8 `interaction: na` pages demonstrating a behaviour | **0 of 17** |

**Arm 3 is now empty and that is worth saying rather than reporting a clean
`0/0`.** It was the only arm whose subject this round removed entirely; it stays
in the list so a regrown pointer is visible, and its sweep is one `git grep`.

### Three instrument defects, caught before any became a finding

- Reading taglines off `api.json.components[n].tagline` reported **0 of 40**.
  A plain zero is a defect in the instrument until proven otherwise, and it was:
  they live at `meta.tagline`.
- `behaviors.json.behaviors` is an **object of 33**, not an array. `.filter`
  threw — the lucky version of 220.1's identical trap, which returned a quiet
  wrong number instead.
- The tempting confirmation that `avatar` has a behaviour, `'avatar' in
  byComponent` → **true**, is a false positive: the key exists for **40 of 40**
  components and **22** of them hold `[]`, `avatar` among them.

**And one caught by a number disagreeing with what a human wrote down.** The
arm-6 `CLAIMS` table copied from the tree-table round holds **8** rows, while
the two rounds after it record **9/9**. Reporting `8/8` would have under-counted
the class by one and looked clean doing it. The ninth row (`form · colour`,
added by the calendar round) was recovered from that round's own entry, and arm
6 reads **9/9**.

### No gate — the sixth refusal, and the first decided on an empty class

216.2, 217.2, 220.2, 227.2 and 240.2 each refused a gate for a decaying cite
because it would need every cite to carry its own command. That still holds, and
101.3 independently confines Polish to the existing ratchet. The decisive
reading here is simpler: **after the fix the class has no members** — a
live-surface sweep for `<component>.css:NN` returns **0** — so a gate would be
94.11 ceremony by that rule's own test.

### What this does NOT cover

The same shift invalidated **21** such citations in `ROADMAP-archive.md`, **24**
in `.roundtable/*.md` (this ledger's own past rounds among them) and **2** inside
the frozen `apps/docs/versions/0.3.0` and `0.4.0` docs snapshots. **None is
touched.** A figure describing a commit is read from that commit, and a released
snapshot is the record of what that release published. Only the surfaces a
reader meets today were repaired.

### Score, and what is owed

**The score does not move and no blind re-score is owed.** Naming a comment is
stronger evidence than naming a line that moves under it, so `badge · spacing`
and `dashboard · spacing` were and remain 3; `avatar`'s own six cites all
reconciled clean. `scored` stays as recorded on each entry — moving a date would
claim the independent second opinion §3b step 4 requires, which this wake could
not run. `rounds` moves 1→2 for `avatar` on 182.1's precedent: the round changed
the published artefact.

### Not verified, said plainly

Cloud wake: no Podman, no `localhost:8081`, so the 1440/390 light-and-dark
screenshot lane could not run. **0** files under `packages/core/src/css/`
changed and no page markup changed; what changed on a rendered page is the
**text of two cells** inside the existing DSA table on two component pages,
established by grepping the rebuilt `dist/` and by the whole-tree `check:layout`
and `test:axe` sweeps at both widths. Every browser-derived number quoted above
came from a gate executing in this container.

## Round 2: progress (2026-09-04, cloud wake) — NO-OP on the surface; the finding is in step 0 (ROADMAP 267)

Dispatcher rule 6, reached because rules 1-5 were clear or had no input: no open
P0, Standardize `1 / 4`, Objective `0 / 3`, rule 4's eleven open items all
blocked (eight owner, three browser-blocked in the SCREENSHOT sense), and rule 5
**STALE** on its trend clause — reported as *could not be evaluated*. Rule 5's
**second** clause was evaluable and clear: `check-size.mjs` passed at *376.2 kB
gz over 139 payload files, tightest headroom 110 bytes*.

### The pick

`--apply` re-queued **19** surfaces — every non-skipped row but `avatar`, which
266 stamped. §3b's "fewest rounds" discriminated: **8** rows at `1/3` against 11
at `2/3`; `inline-editing` and `table-toolbar` drop for 217.1's reason (no
`dsa-scores.json` entry), leaving six. Picked on 266's falsifiable-assertion
count, **re-derived rather than copied**, and it reproduces 266's table with
`avatar` removed:

| surface | quotes | unit literals | bare counts | absence claims | cite chars |
|---|---|---|---|---|---|
| **progress** | 1 | **2** | 7 | 5 | **926** |
| navbar | 1 | 1 | 9 | 5 | 868 |
| tree | 1 | 2 | 6 | 5 | 808 |
| byline | 2 | 0 | 4 | 5 | 800 |
| pagination | 1 | 0 | 5 | 4 | 689 |
| breadcrumb | 0 | 0 | 0 | 7 | 511 |

`progress` was 266's own second-ranked candidate, so the ranking pre-dates this
round.

### progress's own six cites all hold

`typography` *"no font-size at all"* — **0** declarations, comment-stripped.
`colour` — `--bo-color-accent` ×2, `--bo-color-warning-strong` ×2,
`--bo-color-danger` ×2 across `::-webkit-progress-value` ×3 and
`::-moz-progress-bar` ×3, and the `@media (forced-colors: active)` block does
set `appearance: auto`. `spacing` — `10rem` ×1 and `0.5rem` ×1, with the comment
that states why they are intrinsic. `interaction: na` — **0 of 33** behaviours
match `/progress/i` and arm 8 confirms the page imports none. `content` — the
quoted clause renders on the built page ×2, and the near-miss the cite records
is there too (`93%` ×4, `freeze` ×2, `stalled` ×2). `fit` — `.bo-stepper` named
once, in the header comment.

### The eight arms

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` in **0** dist files |
| 3 line-number cites | **0 found** — the arm 266 emptied has not regrown |
| 4 content quotes in built pages | **20/20** |
| 5 css dimension literals | **82/82** |
| 6 bare counts in any cite | **9/9** |
| 7 absence claims | **42/42** |
| 8 `interaction: na` pages importing a behaviour | **0 of 17** |

### The finding — step 0 announced a write it did not make

`--apply` printed `ledger updated — 19 surface(s) marked for re-score` while
`git status` came back clean and the md5 was unchanged. The marker is **sticky**
— line 277 is the only write to the status column and it only appends, `--stamp`
writes `parts[-2]` instead, and no other script writes this ledger — so all 19
rows already carried it and **0** were written. `len(names)` is the size of the
re-queue set; the sentence attached it to a write.

**Red-proved by discrimination, injection asserted before each run:**

| run | marker rows before | printed | rows written |
|---|---|---|---|
| steady state | 19 | `ledger updated — 19 surface(s) marked…` | **0** (md5 identical) |
| one marker stripped from `component/tree` | **18** | `ledger updated — 19 surface(s) marked…` | **1** |

Same sentence for 0 and for 1. Fixed to report rows newly marked, rows that
already carried the marker, and the re-queue total separately, with the
updated/UNCHANGED verb read off whether the text actually differs. Full trace,
the no-consumer check and the seventh gate refusal are in ROADMAP 267.

### One instrument defect, caught before it became a finding

Arm 8 was **reinvented rather than run**. Matching behaviour names as bare
substrings of the built HTML flagged `stepper :: initWizard` — ApiTable prose
(*"`initWizard()` is opt-in…"*), not a demonstration. The canonical arm above
reads the page's own import and returns **0 of 17**. The dashboard round already
measured and discarded four looser ownership definitions; re-deriving one by hand
reproduced the same error in a minute. **Run the arm this ledger carries.**

### Score, and what is owed

No score moves and no blind re-score is owed: the cites reconciled clean and no
published artefact about `progress` changed, so `scored` stays **2026-08-23**.
`rounds` moves 1→2 on badge's and alerts' precedent.

### Not verified, said plainly

Cloud wake: no Podman, no `localhost:8081`, so the 1440/390 light-and-dark
screenshot lane could not run. **0** files under `packages/core/src/` and **0**
docs pages changed; the only non-markdown edit is a Python report line no built
artefact reads. All **17** CI entry points, re-derived from `ci.yml`, ran green
in this container.
