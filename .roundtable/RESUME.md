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
at hand-off. **No collision this wake** — `origin/main` read `ada0f384` at Step
0 and `ada0f384` again immediately before the first commit, and it arrived as a
plain fast-forward.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against the PREVIOUS revision of this file
and the report was read, not deferred.** It named `312.2` as absent and `330.1`,
`324.3`, `310.1`, `297.1` as closed — every one a historical reference in the
previous hand-off, and `330.1` is closed *by this wake*. Every id below is
either named as OPEN with its blocking kind, or cited as closed precedent and
said to be closed. **Nothing here claims an open item that is not.** Re-run the
check against this file rather than trusting that sentence.

## ⚠ RULE 3 IS OVERDUE. EXPECT AN OBJECTIVE GRILL of **330, 356, 357**

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   1 / 4 Continue round    ok
Objective     3 / 3 slices  OVERDUE   [330, 356, 357]
Optimize      0 wake-date(s) newer    ok
```

Rule 1 has no open P0, rule 2 is 1 of 4. **So rule 3 matches**, and rules 4-8
are not reached. **Re-run the script** — a collision could land a row between
this line and your wake.

**A clean data point for the open `349.1`, recorded because it is the item's own
question:** rule 3's counter armed on `330` because this wake's Continue row
*names* it, which is the "touched" reading 349.1 says the counter actually
implements. Here touched and closed **agree** — Slice 330 now has 0 open and 1
closed item, so it really did close. That is one observation on the side 349.1
is missing, not a resolution of it.

## What landed: Slice 358 — `330.1` closed by the census it asked for

**Dispatched by rule 4**, whose oldest cloud-takeable item was `330.1` exactly
as the previous hand-off predicted — re-derived this wake rather than trusted.

`330.1` asks one count over two populations, and only one is censusable:

| population | size | method |
|---|---|---|
| the whole live `ROADMAP.md` | **8,573** numeric tokens on **4,000** of 11,809 lines | candidate filter + a hand verdict on every hit |
| the open set | **31** items, **1,155** body lines | read **whole** — an item about sampling is not answered by a sample |

- **Whole file: 153 candidates (3.8% of figure-carrying lines). 32 rest on a
  sample or an extrapolation; 57 (37.3%) are the instrument's own noise.**
  Reconciled by the generator: 0 candidates unverdicted, 0 verdicts for
  non-candidates.
- **The named failure mode is not "a sample was used" but "a sample quoted AS a
  population", and on that predicate the live file holds ONE** — 329's,
  published there as its own correction, so the number still *resting* on one is
  **zero**. **The second motivating instance has left the population**: Slice
  301's body is **82** lines in `ROADMAP-archive.md`, and `ROADMAP.md` keeps a
  **4-line** pointer.
- **Open set: 7 of 31 carry a sample-derived figure, all 7 name their n**, and
  four put the caution or a re-measure instruction *inside the Accept*. **Zero
  open decisions rest on an undisclosed sample.** `249.7` looked worst and is
  not one: it reads as a *spot-check* but greps **all five** declared seed rows,
  i.e. a census of the seed.

Closed on the Accept's own stated branch, by a route the item could not have
foreseen (an instance leaving the file). Per-line verdicts, the controls and the
instrument's defects are in
`.roundtable/measure-330.1-sampling-census-2026-09-08.md`.

## The controls, and the four instrument defects

Base rate **3.8%** — not 0, not 100. Recall confirmed on 329's instance. Three
injections into a **copy**, each asserted to land exactly once and outside every
fenced block *before* the result was read, and the file on disk asserted
unchanged afterwards:

| injected | delta | expected |
|---|---|---|
| a sample **with** sampling vocabulary | +1 | +1 |
| a **census** with the SAME vocabulary | +1 | +1 |
| a real sample with **no** vocabulary | **+0** | +0 |

**Rows 2 and 3 are the limits, demonstrated rather than asserted** — row 2 is
why this is a candidate filter and never a verdict (94.11's wall, which is the
item's own **Refused** block measured instead of argued), and row 3 is the
recall gap the open-set census exists to bound.

Four defects, on schedule: `~\d` matched git revision syntax; `\bmean\b` matched
the **English verb** (the largest FP class, and it fires on the intake-control
sentence every wake copies forward); *"sample"* has **three** unrelated senses
here and only one is statistical; and the first marker set **missed
`over N runs`**, which `352.2`'s own figure uses — found by the bounded census,
not by review.

## Two of this wake's own outputs were wrong first, and both were caught before the push

1. **The new slice's item was numbered `330.1`, not `358.1`** — a duplicate id
   under a second heading. Caught by `record_iteration.py`'s advisory
   `check:resume-slice-ids`, which reported the closed-id count moving by two
   where one was expected. Read the advisory output; it is not decoration.
2. **"One live instance" over-claimed.** The one instance is *already
   corrected*, so the count of figures still resting on a sample is **zero**;
   the entry now says both readings rather than the flattering one. Caught by
   the by-hand verifier pass.

## ⚠ The archive sweep: 48.9%, the highest reading since the last taken sweep

`roadmap_scope.py` read **5,531 / 11,808 = 46.8%** at `ada0f384` (Step 0) and
**5,858 / 11,990 = 48.9%** at this wake's slice commit — the rise comes from
Slice 358 closing its only item in the same commit, so all its lines are closed
history.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. **48.9% is
7.4pp above the last taken sweep** and above every declined reading on record.

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake
was rule 4's item end to end. `249.12` is named for an **EIGHTEENTH**
consecutive wake. It is a live candidate — but next wake is **rule 3**, an
Objective grill.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is `ROADMAP.md`, one new `.roundtable/`
report, this hand-off and the recorder's own files. No `.astro`, no CSS, no
script and no generated artefact changed — `git diff --stat` was read to confirm
that rather than assumed, and `docs:build` ran green on the same **128** pages.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**, in
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size`
**139** files / **382.7 kB** gz, `check:readme-facts`, `check:package` **185**
files), core `test` (**165** passed), `lint:css`, `docs:build` (carrying
`check:slice-refs` **1,003** assertions / **379** citations / **340** slice
numbers, `check:floor` **596** files, `check:vendor-names` **617**,
`check:imports`, `check:selftests`, `check:page-shape`, `check:wrong-choice`
**158**, `check:metadata` **1,159**), `check:claims` (**176** live · 3 NOT
VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (**914** containers / 118 pages),
`check:layout` (**128** pages), `check:forced-colors`, `test:axe` (128 × 2, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit, and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. It earned its keep —
correction 2 above was made by that re-read, before the push.

## No metric was recorded this wake, and here is the reason for each candidate

- **`dispatch-region-words`** — not sampled. `LOOPS.md` is byte-for-byte
  unchanged this wake, so a second sample of the same region moves nothing;
  `353.2` is open about exactly this name and its convention.
- **`claims` = 176** (`check:claims`). **Identical** to the previous three wakes.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139** payload files / **382.7 kB** gz, tightest headroom 110 bytes,
  unchanged.

## The open set is 30 — no P0

`roadmap_scope.py` reports **30 open** at the slice commit; the raw checkbox
count agrees. Slice 358 closed `330.1` and filed `358.1` closed in the same
commit, so the open set fell **31 → 30** and Slice 330 is now fully closed
(0 open / 1 closed item).

- **cloud-takeable: 19** — `331.1`, `332.1`, `333.1`, `334.1`, `335.1`,
  `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`, `348.1`,
  `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`331.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached. `335.1` still carries its caveat — settling it may mean filing a
  throwaway Q&A discussion, an outward-facing write to a public repo whose
  permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
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
TWENTY-FOURTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 31 open items at dispatch. Rule 2 read `Standardize 0 / 4 ok`. Rule 3
read `Objective 2 / 3 ok [356, 357]` — one slice short at dispatch, and
**OVERDUE after this wake's recording**. **Rule 4 matched**: the oldest open
item is Slice 15, owner-blocked (a human listening to a screen reader), so the
oldest a cloud wake can take was `330.1`. Rules 5-8 not reached.

**Rule 5 would not have fired.** Its line read `ok`, not `STALE` and not `SKEW`:
**0** wake-dates newer than the newest pair, 8 of 47 names paired across days,
and no name in the comparable set regresses on two consecutive runs.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `ada0f384` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any
figure was taken** — **2,083** commits at `HEAD`, no `shallow.lock`, and the
unshallow again brought the tags (`git tag | wc -l` → **8**, run rather than
assumed). **It was load-bearing, not precautionary**: the census reads Slice
301's archived body against its live pointer, which a 50-commit clone's
`ROADMAP-archive.md` history cannot support.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `ada0f384` (the Step 0 tip) or the slice commit.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention, all unchanged, all thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached, so
   `polish_requeue.py --apply` was correctly not run. **This wake's census adds
   one input to it**: 273.2's own `8 of 10` tally is one of the seven
   sample-derived figures in the open set, and the item already says to re-run
   the command before quoting it to the owner. It goes stale every Polish round,
   which is itself an argument for deciding it.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. The share it governs is now **7.4pp above the
   last sweep anyone actually took**, and eighteen consecutive wakes have
   declined a sweep for want of the trigger this item would supply. It is filed
   *low urgency* on the grounds that "the sweep keeps happening regardless" —
   that premise is what has weakened.

**The loop-mechanics question is still FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and added none. `349.1`
DID reproduce this wake, cleanly and on its agreeing side: see the ⚠ block
above.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is
`ROADMAP.md`, one new `.roundtable/` report, and `.roundtable/**`. `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged** —
deliberately: the item's Accept asked to measure before proposing anything, and
nothing is proposed.
