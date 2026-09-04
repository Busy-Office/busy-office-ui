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
at hand-off. Two commits this wake, both pushed: Slice 267 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because Slice 267's
item was filed already closed, the way 263.1, 264's item, 265's three and 266's
three were.

**`check:resume-slice-ids` will report the closed ids named below, and all are
deliberate** — `267.1`, `266.1`, `249.8`, `249.2`, `249.17` appear here only as
history. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4 — re-run it, this is a snapshot

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Polish**, which adds no Continue round, so the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok`. **Slice 267 closed and the
  counter still reads 0, which is correct, not a bug**: 161.4 admits only
  `Continue` and `Standardize` rows as slice-closers, and this wake's row is
  `Polish`. Expect rule 3 to stay at 0 while Polish is the loop that runs.
- **Rule 5 (Optimize)** — read the line, do not assume. Its TREND clause was
  STALE this wake, so it was reported *could not be evaluated*, not clear. Do
  not "fix" that by recording a guessed value (see the bottom of this file).
  **Its SECOND clause is separately evaluable and was clear** — 184.2's "a size
  budget breached outright": `check-size.mjs` passed at *376.2 kB gz over 139
  payload files, tightest headroom 110 bytes* (`css/brand-navy.min.css`).
  Answering rule 5 as "no input at all" under-reports it; answer both clauses.

So the next wake reaches **rule 4**, finds every open item blocked, and falls
through to **rule 6**, which is what dispatched this wake. A cloud wake reaching
rule 4 should say which KIND of blocked, per `LOOPS.md` 186.2 — the
classification is under Direction below.

## ⚠ The correction most likely to be re-broken

**A script that reports on its own write must read the write, not its argument.**
`polish_requeue.py --apply` — §3b step 0, run at the top of every Polish round —
printed `ledger updated — 19 surface(s) marked for re-score` over a file it left
**byte-identical**, because the `RE-QUEUED` marker is sticky and all 19 rows
already carried it. The number was right; the verb was not.

It survived because the steady state is the common case: the message reads
plausible exactly when nothing happened. The red-proof is the part to keep — it
discriminates rather than merely going red:

```
# strip the marker from ONE row, assert the count moved, then run --apply
grep -c '^| component/.*RE-QUEUED' .roundtable/polish-state.md   # 19 -> 18 after the strip
python3 scripts/loops/polish_requeue.py --apply                  # must now say "1 row(s) newly marked"
```

**If a future edit makes both runs print the same sentence again, the fix has
been undone.** The steady-state reading a healthy tree gives is:

```
0 row(s) newly marked for re-score; 18 already carried the marker; 18 re-queued in total
ledger UNCHANGED — nothing to write
```

**And the trap the fix itself walked into:** `grep -rn 'surface(s) marked for
re-score'` still returns **1** hit — the comment this change wrote to explain the
old wording. That is CLAUDE.md's removal rule arriving on schedule; the check
that matters is that **no parser** reads the string (0 hits in any `*.md`, and
the one `*.py` hit is the explanation itself), not that the substring is gone.

**The standing shape, fifth grill/round running:** the claim a slice spends its
red-proof on is the one that holds; the claims it ships **alongside** go out on
credibility. This round's near-miss was beside the finding — **arm 8 was
reinvented rather than run**, and the loose reinvention (behaviour names as bare
substrings of the built HTML) flagged `stepper :: initWizard`, which is ApiTable
prose. The canonical arm reads the page's own **import** and returns 0 of 17.
The dashboard round had already measured and discarded four looser definitions.
**Run the arm the ledger carries; do not re-derive it.**

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

`249.6` has been declined twice at the CLAUSE level, `249.9`'s remaining clause
is the catalogue PAGE whose point is rendered miniatures, and `249.15` is the OG
image. All three want a rendered image a human compares.

**What landed needs no owner decision.** One report line in a loop script, and
the bookkeeping around it.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **2,896 / 5,692 = 50.9%** at
hand-off (49.1% at wake start), under the **55.1%** at which 252.1 dispatched
the tenth sweep on 2026-09-03. The rise is arithmetic, not a backlog signal:
Slice 267 closed fully, so its whole body is closed history the moment it lands
— the same mechanic 264, 265 and 266 recorded. **Re-run the script rather than
quoting this line**; eleven wakes running now. Note `roadmap_scope.py` also
reports targets NAMED by the still-open Slice 249 which stay put per 236.2.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear (no open P0; GitHub intake
`totalCount: 0`); Step 1 triaged and committed nothing — no new input. Rule 2
`1 / 4 … ok`; rule 3 `0 / 3 … ok`; **rule 4 found nothing dispatchable**, all
eleven open items blocked in the kinds above; rule 5 trend STALE and size budget
clear. Rule 6 fired — `polish_requeue.py --apply` re-queued **19** surfaces.
Step 0 hit **trap 1** again — the container started DETACHED on `8962c09` with
no local branch — fixed with `git checkout -B main origin/main` before any work.
`--unshallow` was clean in one attempt (**1,865** commits) and
`git fetch --tags origin` brought all seven, so trap 2 did not bite.

### Slice 267 — Polish round 2 on `component/progress`

Full entry: `.roundtable/polish-state.md`, *"Round 2: progress (2026-09-04)"*.
Four things worth carrying:

1. **The pick needed no invented discriminator.** 266's falsifiable-assertion
   table already ranked `progress` second behind `avatar`; re-derived this wake,
   it reproduces with `avatar` removed. `progress` leads on cite characters
   (926), unit literals (2) and quotes among the six eligible `1/3` candidates.
2. **`progress` itself is clean on all six cites, and all eight arms
   reproduce** — arm 3 in particular has not regrown since 266 emptied it.
3. **The finding is in the loop's own step 0**, not on the surface — see the
   correction block above.
4. **A gate was refused a seventh time**, and for the first time because the
   predicate is *semantic* (does a report line match what it did) rather than
   structural — 94.11's distinction, with a class of exactly one member.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/` changed and **0** docs pages changed; the only
non-markdown edit is a Python report line in `scripts/loops/` that no built
artefact reads. All **17** CI entry points were re-derived from `ci.yml` and run
green here. `check:claims`'s `3 NOT VERIFIED` is ENVIRONMENT 6b's container
property, and its live count read **162** (158 previously) — prose landing, not
claims being skipped.

**`bundle-gz-kb` still cannot be sampled, unchanged for an eighth wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
