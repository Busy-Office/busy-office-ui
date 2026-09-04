# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-04 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 269 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because Slice 269's
two items were filed already closed, the way 263.1, 264's, 265's three, 266's
three, 267's and 268's were.

**`check:resume-slice-ids` will report the closed ids named below, and all are
deliberate** — `269.1`, `269.2`, `268.2`, `249.18`, `249.20` appear here only as
history. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4 — re-run it, this is a snapshot

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Polish**, which adds no Continue round, so the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok`. Slice 269 closed and the counter
  stays 0, which is correct rather than a bug: 161.4 admits only `Continue` and
  `Standardize` rows as slice-closers and this wake's row is `Polish`. This is
  the **fifth** consecutive wake in that state.
- **Rule 5 (Optimize)** — read the line, do not assume. Its TREND clause was
  STALE again, so it was reported *could not be evaluated*, not clear. Do not
  "fix" that by recording a guessed value (see the bottom of this file). **Its
  SECOND clause is separately evaluable and was clear** — 184.2's "a size budget
  breached outright": `check-size.mjs` passed at *376.2 kB gz over 139 payload
  files, tightest headroom 110 bytes* (`css/brand-navy.min.css`), the identical
  reading for the third wake running. Answer both clauses.

So the next wake reaches **rule 4**, finds every open item blocked, and falls
through to **rule 6**, which is what dispatched this wake.

## ⚠ The correction most likely to be re-broken

**A blind re-score is not blind because you withheld the score file.** §3b step
4's instruction named `dsa-scores.json`, `polish-state.md`, `ROADMAP.md` and
`.roundtable/**` — every place the score lives **except the built page the agent
was sent to read**, where `DsaScore.astro` renders it. `LOOPS.md` §3b step 4
carries the fix; the part to keep is the reasoning:

> a leaked prior can only pull a scorer **toward** the published value, so a
> re-score that AGREES with it is weak evidence and one that CONTRADICTS it is
> not weakened at all.

**If a future round reports a blind re-score that confirmed the existing score
and says nothing about the leak, it has been undone.**

**The standing shape, seventh round running — and this wake used it as the PICK
rather than finding it in the postscript.** The claim a round spends its
red-proof on is the one that holds; the claims shipped **alongside** go out on
credibility. 268 spent its red-proof on the `na`→3 correction (which holds) and
wrote five fresh assertions into `breadcrumb · interaction` beside it that no arm
covered. This wake read all five: **all five hold.** So the shape predicts where
to LOOK, not what will be found — worth stating, because four consecutive wakes
have found a defect there and this one did not.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly blocked.
GitHub intake is empty (`list_issues` → `totalCount: 0`). The two standing owner
blocks are unchanged: Slice 15's `AT runtime evidence` (owner hardware) and
`112.3`/`112.4` (owner briefs, then 112.3's verdict).

**Rule 4's open set, classified by WHICH KIND of blocked** (`LOOPS.md` 186.2's
vocabulary), re-read this wake rather than copied:

- **owner-blocked:** Slice 15, `112.3`, `112.4`, `249.10`, `249.11`, `249.12`,
  `249.13` — and `249.7`, a cost question its own text says should not be
  settled before the owner answers `249.10`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.

The clause-level re-read found **no cloud-takeable half left in any of the
three**, for the third wake running. `249.6` is declined a third time on its own
open question — its Accept cannot go green until three terminal pages gain a
`Demo` (a rendered screen) or a bare pattern link, and choosing between those is
the item's own *"or three of the six rows cut"*, not a wake's to settle by
padding. `249.9`'s two derivation halves are landed (`249.18`, `249.20`) and what
remains is the rendered miniatures plus Slice 15's owner hardware. `249.15` is
the OG image itself.

**What landed needs no owner decision.** One `$comment` string in
`dsa-scores.json` — the file's own contract — plus this hand-off and the ledger.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` read closed-history share **3,198 / 5,995 = 53.3%** at wake
start, still under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. Slice 269 closed fully, so its whole body becomes closed history the
moment it lands — the same arithmetic 264-268 each recorded, and it pushes the
share up without being a backlog signal. **Re-run the script rather than quoting
this line**; thirteen wakes running now, and the share is within two points of
the trigger, so the next wake or two may genuinely reach it. Note
`roadmap_scope.py` also reports targets NAMED by the still-open Slice 249, which
stay put per 236.2.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear; Step 1 triaged and committed
nothing — no new input. Rule 2 `1 / 4 … ok`; rule 3 `0 / 3 … ok`; **rule 4 found
nothing dispatchable**, all eleven open items blocked in the kinds above; rule 5
trend STALE and size budget clear. Rule 6 fired — `polish_requeue.py --apply`
re-queued **17** surfaces and printed 267.1's steady-state pair over an unchanged
ledger, so that fix holds a second wake on. Step 0 hit **trap 1** again — the
container started DETACHED with a stale local `main` at `26447ba9` against a
pushed `f538a24` — fixed with `git checkout -B main origin/main` before any work.
`--unshallow` was clean in one attempt (**1,869** commits) and brought all seven
tags unprompted, so trap 2 did not bite.

### Slice 269 — Polish round 2 on `component/breadcrumb`

Full entry: `.roundtable/polish-state.md`, *"Round 2: breadcrumb (2026-09-04)"*.
Four things worth carrying:

1. **The pick needed no invented discriminator, fourth wake running** — and the
   ranking instrument was **reconciled against 268's published table before it
   was used**, reproducing it 5 of 5 exactly at `a783a08^`. `breadcrumb` is the
   only one of the five that moved (511 → 1049 cite characters), entirely
   because 268 rewrote its `interaction` cite.
2. **All six of breadcrumb's cites hold**, including the five new assertions
   268 wrote and no arm covered. The most precise of them is exact rather than
   approximately right: `behaviors.json`'s `byComponent.breadcrumb` is
   **present with value `[]`**, so "empty" is the correct word and "absent"
   would not have been.
3. **The finding is in the file's own contract, not on the surface.** A new
   arm 11 reads **17/19**; the two dissenters are exactly the only two blind
   re-scores this ledger has ever run that MOVED a score, and both left the
   entry's `scored` stamp behind. They were right to — moving a per-entry date
   for a single-dimension re-score claims five opinions nobody gave — but
   `dsa-scores.json`'s `$comment` mandated the opposite. The contract was fixed;
   the two entries were not touched.
4. **A gate was refused a ninth time**, and for the same reason as 268's:
   arm 11 is red on a **correct** tree even after the fix, which is 243's
   ground. Base rate recorded anyway (2 of 40 entries, 2 of 19 re-score cites —
   it would discriminate) as a measurement, not a recommendation.

**The red-proof caught a defect in the DETECTOR, and it is worth carrying into
the next arm anyone writes here.** `RE.exec` returns the FIRST match, and a cite
can carry more than one re-score date — `tree · content` carries two. The
cite-side injection came back **green** and the reflex ("the injection must have
missed") was wrong: the injection had landed, and the arm was judging the earlier
date. Read **all** matches and compare the latest. The third injection was
re-run only after that fix, because a non-firing check proves nothing about
discrimination while a firing-suppression bug is live.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/` changed and **0** docs page markup changed; the only
non-markdown edit is one `$comment` string in `dsa-scores.json`, which renders on
**0** built files (`grep -rl 'SOURCE OF TRUTH for what renders' apps/docs/dist`)
— which is also why the item was takeable here at all. All **17** CI entry points
were re-derived from `ci.yml` and run green. `check:claims`'s `3 NOT VERIFIED` is
ENVIRONMENT 6b's container property, and its live count read **162**, unchanged
from last wake.

**One thing was weighed and NOT filed:** relabelling `Maturity.astro`'s
`Alignment scored` to say "last full pass". It is page markup — a rendered change
this wake cannot verify — and the amended `$comment` already makes the published
pairing correct rather than contradictory.

**`bundle-gz-kb` still cannot be sampled, unchanged for a tenth wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
