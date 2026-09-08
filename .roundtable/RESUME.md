# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **No collision this wake** — `origin/main` read `5543979` at Step 0
and `5543979` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 347 — `324.1` closed, and the refusal is stronger than its Accept anticipated

**Rule 4 dispatched this** on `324.1`, the oldest still-open item no other kind
of block covers. The item asked whether a metric sample should carry a
DIRECTION so rule 5 could state a verdict.

**The measure-first branch the item wrote for itself came back 1 of 8, which
kept the item alive.** Only `bundle-gz-kb` (`kB`) is directional from its unit;
`count` is carried by **14** names spanning both directions (`axe-violations`
lower-better and pinned at 0 by `test:axe`; `claims` higher-better, which the
item's own text calls "the goal"), and `axe-violations` even changed unit
mid-series (`pages` → `count` on 2026-08-31). So the cheap unit-convention fix
is dead.

**What actually closed it is not the direction question.** Supplying a
direction makes rule 5 **fire** on `bundle-gz-kb` — four consecutive day-pair
rises, 7.2 → 9.6 → 10.8 → 11.7 → 15.1 kB, satisfiable since 2026-08-16 — and
that verdict is wrong. The same wakes recorded `components` at the **same
timestamps**, and per-component cost falls:

```
2026-08-13 23:06    7.20 kB / 18 = 0.400 kB per component
2026-08-15 19:05    9.60 kB / 25 = 0.384
2026-08-16 02:24    9.93 kB / 28 = 0.355
2026-09-08 live    15.10 kB / 40 = 0.378   check:size at HEAD
```

Absolute **+110%**, normalised **−5.6%** and not monotone. **Robustness
control:** using 2026-08-16's LAST values instead of the co-located ones
(10.8 / 30 = 0.360) leaves the fall intact, so it is not an artifact of which
same-day sample was picked. **Denominator caveat, stated in the slice:**
`index.min.css` also carries primitives, utilities and tokens, so 0.378 is a
rough per-component cost — a control on the trend's direction, not a budget.
Today's 40 is two independent instruments agreeing (`ls
packages/core/src/css/components` and `api.json`'s `components` key).

**Verdict: no `--direction` flag and no per-name registry**, on the Accept's
explicitly-satisfying second branch. Base rate — a registry would cover 8 names,
one of which can currently satisfy "two consecutive", and that one is better
served by rule 5's OTHER clause: `check:size` gates `css/index.min.css` at
16.7 kB gz and reads 15.10 today. A budget knows the threshold; a delta does
not. The reason is written where the two wakes who need it read it:
`report_comparable`'s closing note (printed at Step 0b **every** wake) and
`record_metric.py`'s docstring (read by a wake recording a sample).

**What would reopen it**, recorded in `324.1` rather than as a new open item: a
day-paired name with two or more consecutive same-direction pairs, a
lower-better direction, and **no budget gate covering it**.
`dispatch-region-words` is the live candidate — `326.3` treats its growth as the
concern — and it has one day-pair, so a third day of sampling makes it the
first such name.

## Second thing that landed: `347.1` — the wake's own recording step crashed

`record_iteration.py` ran the three advisory checks after the commit and the
**third** one, `polish_requeue.py --verify-stamps`, died with an unhandled
`CalledProcessError` out of `git ls-tree -r 4beb4b86 -- …/alerts.astro`.
Nothing was lost — the check runs *after* the log append, and the three rows
and `STATUS.md` all landed — but `LOOPS.md` Step 0 says all three REPORT, and a
traceback is not a report.

**The cause is the shallow clone, and its own docstring claimed that case was
handled.** `unknown` is only reachable when a stamp carries no revision; every
stamp `--stamp` writes carries one, so the `if at:` branch reads at that
revision through `git(…, check=True)` and raises. **Diagnosed by
discrimination:** shallow (`true`, 51 commits) → traceback; after
`git fetch --unshallow origin` (2,056 commits, no `shallow.lock`) the *same
tree* and *same command* → `21 row(s), every stamp describes a real tree`,
exit 0.

**Fixed with a fourth verdict, `absent`** — returned before any read at the
stamp's revision, counted separately from genuinely broken stamps, and naming
the remedy. **Red-proved by injection with a control**, per CLAUDE.md: same row,
same digest, revision swapped for one no clone holds, and the substitution,
the unchanged digest, the changed revision and the bogus revision's absence
each asserted *before* the call so a green result could not come from an
injection that never landed. `component/alerts` reads `reproducible` on its
real stamp and `absent` on the bogus one — it discriminates, and neither
raises.

**Every wake on a fresh cloud container hits this** unless it happens to
unshallow for other reasons. This one did not need history, which is why it was
the wake that found it.

## No metric was recorded this wake, and that is deliberate

`324.2` says outright *"do not record a sample to un-STALE the line before the
convention is written down"*. The numbers this wake measured (0.400 → 0.378 kB
per component) are a **control**, not a series anyone should start; recording
them would create a 48th name with one day and no denominator discipline, which
is the shape this slice just refused.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, structurally rather than by judgement: the diff is `ROADMAP.md`,
`scripts/loops/dispatch_status.py`, `scripts/loops/record_metric.py`,
`scripts/loops/polish_requeue.py` and this file. No CSS rule, no docs page and no component changed, so nothing rendered
can move. None of the three scripts is a build step or a gate — `dispatch_status.py` is run
by hand at Step 0b and by `record_iteration.py`; `record_metric.py` is a CLI;
`polish_requeue.py` is advisory and run from the recorder.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points — core `build` (incl.
`check:size`, `check:readme-facts`, `check:package`), core `test` (165 tests),
`lint:css`, `docs:build`, `check:claims` (**176** live · 3 NOT VERIFIED, which
is `ENVIRONMENT.md` §6b's container fact), `check:formatting`, `check:scroll`
(914 containers), `check:layout` (128 pages), `check:forced-colors`, `test:axe`
(128 × 2, zero violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (20 behaviours), `check -w create-ui`,
`npm run suite` (28 screens × 2). Plus `check:selftests` (55 gates: 21
heuristic, 34 exact), `check:viewport-forks` (76 docs scripts) and
`check:loop-vocab`. `dispatch_status.py --self-test` passes 14 slice-reference,
6 clock-skew and 5 metric-pairing cases. **`docs:build` was re-run after this
file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught: the write-up had carried the item's own *"132 existing samples"*
figure forward, and the file holds **140** at `5543979`; the claim was rewritten
as the property (*no sample already recorded could ever carry it*) rather than
re-stating a number that moves. It also caught a "six printed lines" count that
is one printed line from six source lines.

## The open set is 30 — no P0, and 19 are cloud-takeable

`roadmap_scope.py` reports **30 open / 81 closed**, and the raw checkbox count
agrees (`30` open; `83` raw `[x]` = 81 + the 2 under the non-slice `## STATE`
heading, which the script reports separately). This wake closed `324.1` and
filed `347.1` already closed, so open moved 31 → 30 and closed 79 → 81. **Re-run the script** rather than
quoting this.

- **cloud-takeable: 19** — `324.2`, `325.1`, `325.2`, `326.3`, `327.3`,
  `328.1`, `330.1`, `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`,
  `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`.
  **`324.2` is now the oldest of these**, and is what rule 4 reaches for next.
  It is this wake's sibling and its "measure first" step is already half done
  here: `bundle-gz-kb` is `check:size`'s `css/index.min.css` gz figure (15.10
  today, budget 16.7), and this slice records why its *trend* is the wrong
  instrument for it. What `324.2` still owes is the blame-offset census of its
  11 samples. `335.1` still carries its caveat: settling it may mean filing a
  throwaway Q&A discussion, an outward-facing write to a public repo whose
  permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

19 + 10 + 1 = 30, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
THIRTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
Rule 2 `Standardize 0 / 4 ok` did not match. Rule 3 `Objective 0 / 3 ok` did not
match. **Rule 4 matched** on `324.1`, the oldest still-open item no other kind
of block covers — every older open item re-checked **in the file**, not carried
from the previous hand-off. Rules 5-8 not reached.

**Rule 5 was not reached and would not have fired**, and this wake is the reason
that statement is now checkable rather than a judgement: its line reads `ok`,
and the one name whose movement would read as a regression under a direction is
`bundle-gz-kb`, which `324.1` now records as growth rather than regression, with
`check:size`'s budget as the instrument that actually answers it.

## What the next wake should reach for: rule 4 on `324.2`

Measured immediately after `record_iteration.py`, which is the comparison
`LOOPS.md` says finds the counter bugs — not predicted:

```
Standardize   1 / 4 Continue rounds  since 2026-09-08 06:5x   ok
Objective     1 / 3 slices           since 2026-09-08 05:54   ok
```

This wake was a Continue round and closed a slice, so it advances **both** rule
2 and rule 3 by one. Neither reaches its threshold, so **rule 4 is the first
match** again, on `324.2`. Re-run the counters — a collision could land a row
between this line and your wake.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py`: closed-history share **38.4%** at `5543979`, and this commit
adds **+138 / −2** lines to `ROADMAP.md` (`git diff --numstat`, read pre-commit
from the index per `ENVIRONMENT.md`'s figure rule). Those lines are split
between a new open-slice section and the closed `324.1` body, so the share moves
by little in either direction; re-run the script at the commit rather than
inferring it from here. The trigger the last sweeps actually used: 252.1 dispatched the
tenth at **55.1%**, 272.1 the eleventh at **56.7%**, and 279.3 declined the
twelfth at **40.6%**. Below all three. Re-run the script; this commit moves the
numbers.

**`249.12` is named for a SEVENTH consecutive wake.** Seven consecutive wakes
have now declined an archive sweep on the absence of a stated trigger (279.3 at
40.6%, then 33.1%, 32.4%, 35.6%, 38.5%, 38.4%, and this one). The item is filed
as low urgency because *"the sweep keeps happening regardless"*; that sentence
has now been false seven times running. **Nothing is proposed here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...5543979` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit. **Trap 1's own
footnote bit for real**: `git rev-parse --short origin/main HEAD` exited 128
with *"Needed a single revision"* mid-way through the pre-commit collision
check, exactly as `ENVIRONMENT.md` §1 says it does on every container; the
two-argument form without `--short` answered immediately. Trap 1c was respected:
`CHROME_PATH` was exported **in the same command** as every browser gate. No
`git stash` at any point. **Trap 2 was exercised for real, and by a
crash rather than a measurement** — the clone was left shallow (no history
measurement was needed) until `polish_requeue.py --verify-stamps` died on it,
which is `347.1`. The unshallow then ran clean in one go (**2,056** commits, no
`shallow.lock`) and again brought the tags; `git tag | wc -l` → **8**, run
rather than assumed.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6 was
   never reached, so `polish_requeue.py --apply` was correctly not run.
