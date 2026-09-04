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
at hand-off. Two commits this wake, both pushed: Slice 270 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ RULE 4 HAS A DISPATCHABLE ITEM FOR THE FIRST TIME IN SIX WAKES — `270.1`

This is the one thing that changed about the dispatcher's state this wake, and
it is why the next wake should NOT expect to fall through to rule 6 again.

`270.1` — **`check:slice-refs` cannot see `.ts` or `.json`** — is filed OPEN,
with Accept criteria, and is **neither owner-blocked nor browser-blocked**: it
is a file-filter widening plus a red-proof, entirely takeable in a cloud
container. It is also now the OLDEST open item that is not blocked, so rule 4
selects it.

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15, `112.3`/`112.4`, **and `270.1`** — **12 open**, one more than
last wake.

**`check:resume-slice-ids` will report the closed ids named below, and all are
deliberate** — `269.1`, `240.1`, `231.2`, `267.1`, `249.18`, `249.20` appear
here only as history. Nothing here queues or blocks on a closed id.

## The counters, read immediately after recording — re-run them, this is a snapshot

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Polish**, which adds no Continue round, so the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok`. Slice 270 closed nothing and the
  counter stays 0, which is correct rather than a bug: 161.4 admits only
  `Continue` and `Standardize` rows as slice-closers and this wake's row is
  `Polish`. This is the **sixth** consecutive wake in that state.
- **Rule 5 (Optimize)** — read the line, do not assume. Its TREND clause was
  STALE again, so it was reported *could not be evaluated*, not clear. Do not
  "fix" that by recording a guessed value (see the bottom of this file). **Its
  SECOND clause is separately evaluable and was clear** — 184.2's "a size budget
  breached outright": `check-size.mjs` passed at *376.2 kB gz over 139 payload
  files, tightest headroom 110 bytes* (`css/brand-navy.min.css`), the identical
  reading for the fourth wake running. Answer both clauses.

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

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly blocked.
GitHub intake is empty (`list_issues` → `totalCount: 0`). The two standing owner
blocks are unchanged: Slice 15's `AT runtime evidence` (owner hardware) and
`112.3`/`112.4` (owner briefs, then 112.3's verdict).

**Rule 4's open set, classified by WHICH KIND of blocked** (`LOOPS.md` 186.2's
vocabulary), re-read from `ROADMAP.md` this wake rather than copied:

- **owner-blocked:** Slice 15, `112.3`, `112.4`, `249.10`, `249.11`, `249.12`,
  `249.13` — and `249.7`, a cost question its own text says should not be
  settled before the owner answers `249.10`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.
- **NOT BLOCKED:** `270.1` — new this wake, and the reason rule 4 is live again.

The clause-level re-read found no cloud-takeable half in the three
screenshot-blocked items, for the fourth wake running, and the readings behind
that are unchanged from last wake's hand-off.

## The archive sweep: closer, but still not due

`roadmap_scope.py` read closed-history share **3,388 / 6,186 = 54.8%** at wake
start — up from 53.3% last wake, still under the **55.1%** at which 252.1
dispatched the tenth sweep on 2026-09-03.

**Re-read after Slice 270 landed it is 3,388 / 6,346 = 53.4%, i.e. it went
DOWN, and that is worth stating because the obvious inference is wrong.** Every
recent wake's hand-off recorded a slice *closing* and so pushing the share up.
Slice 270 files an item that stays **OPEN**, so its ~160 lines are live backlog,
not closed history: the numerator is unchanged and only the denominator grew.
The first draft of this paragraph said 270 "adds its own body to the live file"
and implied the share rose; the script says otherwise, and the script is the
instrument. **Re-run it rather than quoting either figure** — fourteen wakes
running now. Note `roadmap_scope.py` also reports targets NAMED by the
still-open Slice 249 (four of them), which stay put per 236.2.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear; Step 1 triaged and committed
nothing — no new input. Rule 2 `1 / 4 … ok`; rule 3 `0 / 3 … ok`; **rule 4 found
nothing dispatchable** (all eleven open items blocked in the kinds above); rule 5
trend STALE and size budget clear. Rule 6 fired — `polish_requeue.py --apply`
re-queued **16** surfaces and printed 267.1's steady-state pair over an unchanged
ledger, so that fix holds a third wake on. Step 0 hit **trap 1** again — the
container started DETACHED with a stale local `main` at `26447ba9` against a
pushed `e3a08f9` — fixed with `git checkout -B main origin/main` before any work.
`--unshallow` was clean in one attempt (**1,871** commits) and brought all seven
tags, so trap 2 did not bite.

### Slice 270 — Polish round 2 on `component/tree`

Full entry: `.roundtable/polish-state.md`, *"Round 2: tree (2026-09-04)"*.
Four things worth carrying:

1. **The pick needed no invented discriminator, fifth wake running** — and the
   ranking instrument was **reconciled against 269's published table before it
   was used**, reproducing it 5 of 5 exactly at `a783a08^`. `tree` won on 808
   cite characters and is the only one of the three candidates carrying unit
   literals.
2. **All six of tree's cites hold**, including the `1.25em`/`1em` pair no arm
   had read. The `colour` cite was checked on BOTH halves — not just "zero raw
   hex" but "reuses gated sidebar pairings", which is the clause 240.1's defect
   lived in.
3. **The finding is in a GATE, not on the surface.** A new arm 12 reads
   `check-slice-refs.mjs`'s file filter: `.ts` and `.json` are absent, so the
   shipped behaviour sources, the core tests and `dsa-scores.json` are invisible
   to it. **11 slice references are cited from nowhere the gate looks** (282
   covered / 38 appearing in unscanned files / 11 with zero coverage), base rate
   **11 of 293 = 3.8%**. Nothing is broken today — all 11 resolve — so the defect
   is *reach*, which is exactly what the gate exists for.
4. **Filed as `270.1`, deliberately not fixed inside Polish.** 101.3 confines
   Polish to the existing ratchet; 231.2 and 240.1 are the precedents. The side
   effect is the useful one: rule 4 has a dispatchable item again.

**The red-proof is two-sided, and that is the part to carry into the next arm.**
Injecting a dangling citation into a behaviour `.ts` left the gate **green** at a
byte-identical run line. A green result is a defect in the injection until proven
otherwise — so the *same* string was injected into `tree.css`, where the gate
went **red, exit 1**. One injection alone would have proved nothing; the second
is what turns "the gate did not fire" into "the gate cannot see this file type".
Both files reverted, `git status` clean, `redproof` in neither.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/` changed and **0** docs page markup changed — the wake's
entire diff is `ROADMAP.md`, `.roundtable/polish-state.md`, this hand-off and the
loop ledger, so nothing in it rests on a rendered image. All **17** CI entry
points were re-derived from `ci.yml` and run green. `check:claims`'s
`3 NOT VERIFIED` is ENVIRONMENT 6b's container property, not a regression.

**One thing weighed and NOT filed:** an arm asserting that the **56** slice
numbers inside `dsa-scores.json` cites resolve. All 56 do, and widening the gate
per `270.1` makes such an arm redundant by construction — adding it would be a
twelfth thing to re-measure by hand every round.

**`bundle-gz-kb` still cannot be sampled, unchanged for an eleventh wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
