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
at hand-off. Two commits this wake, both pushed: Slice 266 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because Slice 266's
three items were all filed already closed, the way 263.1, 264's item and 265's
three were.

**`check:resume-slice-ids` will report the closed ids named below, and all are
deliberate** — `266.1`, `266.2`, `266.3`, `249.8`, `249.2`, `249.18`, `249.20`
appear here only as history. Nothing here queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 4 — re-run it, this is a snapshot

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 Continue round … ok` — this wake ran
  **Polish**, which adds no Continue round, so the counter did not move.
- **Rule 3 (Objective)** `0 / 3 slices … ok`. **Slice 266 closed and the
  counter still reads 0, which is correct, not a bug**: 161.4 admits only
  `Continue` and `Standardize` rows as slice-closers, and this wake's row is
  `Polish`. Expect rule 3 to stay at 0 while Polish is the loop that runs.
- **Rule 5 (Optimize)** `1 wake-date(s) newer … STALE` — no input, so it is
  *could not be evaluated*, not clear. Do not "fix" that by recording a guessed
  value (see the bottom of this file).

So the next wake reaches **rule 4**, finds every open item blocked, and falls
through to **rule 6**, which is what dispatched this wake. A cloud wake reaching
rule 4 should say which KIND of blocked, per `LOOPS.md` 186.2 — the
classification is under Direction below.

## ⚠ The correction most likely to be re-broken

**A pointer that names a line decays when a bulk edit inserts above it, and
nothing in the repo can see that happen.** 249.8 prepended a 3-line
`@tagline` header to **40 of 40** component stylesheets in one commit
(`4dbec5bd`, `+3` on 27 files, `+4` on the 13 carrying `@label`/`@order`).
Every pointer into a component stylesheet authored before it went stale by
construction — **4 of 4 live ones**, two of them PUBLISHED in the DSA table on
`/components/badge` and `/components/dashboard`, one PRINTED by the reach report
on every `docs:build`.

The fix names the property (the `WRAP` comment on `.bo-badge`,
`.bo-widget-grid`'s `grid-template-columns`, avatar's stack comment,
breadcrumb's opening comment) rather than refreshing the number, which is 217.2,
220.1 and Slice 253 finding B all landing again. **A live-surface sweep for
`<component>.css:NN` now returns 0** — so if that ever reads non-zero, a new
pointer has been written and it will decay the same way:

```
COMP=$(ls packages/core/src/css/components | tr '\n' '|' | sed 's/|$//')
git grep -nE "(${COMP})\.css:[0-9]+" -- apps/docs/src apps/docs/scripts \
  packages/core/src packages/core/scripts scripts examples \
  LOOPS.md CLAUDE.md DESIGN.md README.md ':!apps/docs/versions'
# 0 hits. A non-zero reading means a new pointer was written; it will decay.
```

**The scoping is load-bearing and the first version of this command was wrong,
which is the same trap arriving one level up.** Run over `ROADMAP.md` and
`apps/docs/versions` as well, it returns **14 hits across 3 files** — every one
of them either Slice 266's own description of the defect or a frozen release
snapshot. A sweep that reads the write-up explaining the fix reports the bug as
unfixed forever. Exclude narrative and frozen snapshots; sweep only where a
pointer would be USED as a pointer.

**And the trap the fix itself fell into first:** the correction quoted the old
pointer while explaining it, so `badge.css:42` was still in the built page after
a full rebuild and arm 3 still read `2 of 40`. CLAUDE.md names this for
assertions; it applies to corrections. **The narrative goes in the ledger, never
inside the published evidence.**

**The standing shape, fourth grill/round running:** the claim a slice spends its
red-proof on is the one that holds; the claims it ships **alongside** go out on
credibility. This round's near-misses were all beside the finding — three
instrument defects (taglines read off the wrong `api.json` path, reporting a
plain **0 of 40** when they live at `meta.tagline`; `behaviors.json.behaviors`
being an object of 33 rather than an array; `'avatar' in byComponent` reading
**true** when the key exists for all 40 and 22 hold `[]`) and an arm-6 `CLAIMS`
table copied at **8** rows when the ledger's later rounds record **9/9**.

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

**What landed needs no owner decision.** Two cite strings, two source comments,
and the bookkeeping around them.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **2,680 / 5,475 = 48.9%** at
hand-off (47.6% at wake start), under the **55.1%** at which 252.1 dispatched
the tenth sweep on 2026-09-03. The rise is arithmetic, not a backlog signal:
Slice 266 closed fully, so its whole body is closed history the moment it lands
— the same mechanic 264 and 265 recorded. **Re-run the script rather than
quoting this line**; ten wakes running now. Note `roadmap_scope.py` also reports
targets NAMED by the still-open Slice 249 which stay put per 236.2.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear (no open P0; GitHub intake
`totalCount: 0`); Step 1 triaged and committed nothing — no new input. Rule 2
`1 / 4 … ok`; rule 3 `0 / 3 … ok`; **rule 4 found nothing dispatchable**, all
eleven open items blocked in the kinds above; rule 5 STALE, so reported as
*could not be evaluated*. Rule 6 fired — `polish_requeue.py --apply` re-queued
**20** surfaces, the widest re-queue the ledger records. Step 0 hit **trap 1**
again — the container started DETACHED on `2d01c25` with no local branch —
fixed with `git checkout -B main origin/main` before any work. `--unshallow`
was clean in one attempt (**1,863** commits) and brought all seven tags, so
trap 2 did not bite.

### Slice 266 — Polish round 2 on `component/avatar`

Full entry: `.roundtable/polish-state.md`, *"Round 2: avatar (2026-09-04)"*.
Four things worth carrying:

1. **The tie-break five rounds have used stopped discriminating**, and that is
   measured rather than shrugged at: source movement read `+4/-1 across 2
   commits` for **all seven** fewest-rounds candidates. Not an instrument
   defect — 249.8 touched every component stylesheet and 249.2 every docs page.
   Picked on falsifiable-assertion count instead (avatar: 4 unit literals, 4
   absence claims, 1 quoted clause, 949 cite characters).
2. **Arm 3 disagreed with the ledger on both count and content**, and both
   halves of the disagreement were real — see the correction block above.
3. **A gate was refused a sixth time, and for the first time on an empty
   class**: after the fix nothing matches the predicate, so it would be 94.11
   ceremony.
4. **avatar's own six cites all reconcile clean**, as does the newly published
   `@tagline`'s *"em-sized"* claim.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. **0** files under
`packages/core/src/css/` changed and no page markup changed; what changed on a
rendered page is the **text of two cells** inside the existing DSA table on two
component pages, established by grepping the rebuilt `dist/` (old pointers 0
files, the two replacements on exactly those two pages) and by whole-tree
`check:layout` and `test:axe` at both widths. All **17** CI entry points were
re-derived from `ci.yml` and run green here.

**`bundle-gz-kb` still cannot be sampled, unchanged for a seventh wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
