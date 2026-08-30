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
| component/alerts | content | **3** | 1/3 | 0 | 20c2fe2c | round 1 landed — blind re-score 2→3, off the gate's TODO · **RE-QUEUED — source changed** |
| component/avatar | content | **3** | 1/3 | 0 | a21b88a7 | round 1 landed — blind 2→3, "not the only way to name someone" |
| component/badge | content | **3** | 2/3 | 0 | 1f69e677 | round 1 landed — blind 2→3, "not for anything actionable"; **round 2 (2026-08-28) NO-OP — reconciliation clean on all four arms, see below** |
| component/breadcrumb | content | **3** | 1/3 | 0 | dcbde565 | **round 1 (2026-08-30) FOUND A DEFECT — `fit` counted "2 of 19 pattern screens" against 39; re-entry from 217.2's filing, see below** |
| component/byline | content | **3** | 1/3 | 0 | 29ededaf | round 1 landed — blind 2→3; scorer caught the boundary, redrawn |
| component/calendar | content | **3** | 1/3 | 0 | e1dec38b | round 1 landed — blind 2→3, "not for a plain date field" · **RE-QUEUED — source changed**|
| component/dashboard | content | **3** | 1/3 | 0 | 2c8fde4c | round 1 landed — blind 2→3, "not a wrapper round every section" · **RE-QUEUED — source changed**|
| component/data-table | content | **3** | 2/3 | 0 | 36c4bbe3 | round 1 landed — blind 2→3, "not for laying out a page"; **round 2 (2026-08-30) FOUND A DEFECT — the `spacing` cite named a literal 94.3 had removed two days before the score was taken, see below** |
| component/date | content | 2 | — | — | 399709aa | **SKIPPED** — deprecated, see note below |
| component/icon | content | **3** | 2/3 | 0 | f0d9f50b | round 1 landed — blind 2→3; scorer caught the demo contradiction, clause narrowed; **round 2 (2026-08-30) FOUND A DEFECT — `fit` cited "12 ERP glyphs" against 26 shipped, and the same 12 was hard-coded as the DIVISOR of the page's published size projection, see below** |
| component/inline-editing | content | **3** | 1/3 | 0 | eadd116a | round 1 landed — blind 3, "not for creating a record" (unscored in DSA) · **RE-QUEUED — source changed** |
| component/navbar | content | **3** | 1/3 | 0 | 1e50d24a | round 1 landed — blind 2→3, "not the page's own title or actions" |
| component/pagination | content | **3** | 1/3 | 0 | 2a48579c | round 1 landed — blind 2→3, "not for stepping through a process" |
| component/progress | content | **3** | 1/3 | 0 | ab66183b | round 1 landed — blind 2→3, "not for work of unknown duration" |
| component/scan | colour+interaction+fit | **3** | 2/3 | 0 | e1c34049 | round 1 (2026-08-23) fixed all three; **round 2 (2026-08-28) discovered the round-1 score was never written to `dsa-scores.json` at all** — see below · **RE-QUEUED — source changed** |
| component/sidebar-nav | content | **3** | 2/3 | 0 | 904b544f | round 1 landed — blind 2→3, "not for navigating within one screen"; **round 2 (2026-08-30) FOUND A DEFECT — the `fit` cite's usage count was EXACT when written and decayed two days later, see below** |
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
the rail from ONE shared shell (`page()`, server.mjs:105; exactly 1
`<nav class="bo-sidebar-nav` in the file), and it composes inside `.bo-offcanvas`
(offcanvas.astro:20). Verified in the BUILT html — `uses it at 6 sites` → 0
across all of `apps/docs/dist`, new sentence renders 1.

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
