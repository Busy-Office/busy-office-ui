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
at hand-off. **No collision this wake** — the pre-commit `git fetch origin main`
found `origin/main` unmoved at `dd69b3e5`. One iteration recorded
(`Continue · build · 322.3`, `refused`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 343 — `322.3` REFUSED, and the caller count is what settled it

The Accept set the fork on the base rate. **Few change — 1 of 14** re-derivable
published phrase-counts over the roadmap corpus, and it is the known defect the
item was filed for. But the second half of the Accept's sentence turned out to
be the stronger refusal: *"ship one shared normaliser and **name its callers**"*
— **there are none.**

```
base rate      1 of 14 change   (9 of the 14 count an identifier with no
                                 whitespace and provably cannot differ;
                                 5 could differ, 1 does)
callers        0                 every machine consumer is either a line-anchored
                                 structural parse — where line-based IS correct —
                                 or already whole-text
severity       12 vs 19          on the one case that changes, the per-line form
                                 misses 7 slices, 37%
```

**`check-slice-refs.mjs` is the reason the caller count is zero rather than
one.** It matches `/\broadmap\s+(\d{1,3}…)/gi` against whole-file text, and
`\s` spans a newline — it demonstrably catches the **7 of 149** citations a
per-line form misses (`ROADMAP-archive.md` 66→68, `LOOPS.md` 48→53). It is not
accidentally safe. `report_reopen_conditions.py`'s needle is four single words
and cannot straddle anything.

**The command is recorded in Slice 343**, which is the thing both motivating
defects lacked. The sharper rule that falls out of the table: a count of an
**identifier** (page path, class, slice id) is safe per-line; a count of a
**phrase with a space in it** is not, and is the only case worth a second
reading.

## Two figures in this slice are self-contaminated, and both are named as such

`327.2`'s effect fired twice inside one write-up, which is worth carrying:

- the lane-C row reads **3 / 8** at `dd69b3e5` and **5 / 10** at the commit
  carrying it, because the table adds two occurrences of its own phrase;
- the recorded-grep split reads **41 of 62** at `dd69b3e5` and **42 of 63**
  here, because the dispatcher trace adds one more `^…P0` grep.

**Both Δs and every verdict are unchanged.** The revision is named beside each
per `ENVIRONMENT.md`'s rule, so a wake re-running the command and getting the
larger number can tell a moved corpus from a mistake.

## The instrument was wrong first — mine, again, and it is the third instance in three days

The first harvest was a **per-line** scan for recorded greps and read **58**
sites; the same regex over whitespace-normalised text reads **62**. It missed
**4 of 62 (6.5%)** — the two `^## Slice … Objective grill of …` heading greps
and two rule-1 P0 greps, each wrapping between the pattern and its target list.
**The harvester built to measure the wrapped-phrase bug had the wrapped-phrase
bug**, and it was caught the way `LOOPS.md` says this class always is: the
filtered output showed a continuation line whose command started above it.

**The comparator is red-proved by discrimination, not by a bare pass:**
`DIFFERS +5` on the known positive (`1,433 live inline declarations`), `same`
on two negatives — a wrappable phrase that happens not to wrap (`closed slices
carrying`, 7/7) and a phrase with no whitespace (`ROADMAP-archive.md`,
409/409). A comparator returning "same" everywhere would have been
indistinguishable from a passing run.

**One claim was deliberately NOT made.** An independently-shaped re-derivation
of Slice 322's "17 slices" returns 19 normalised / 12 line-based, with a
different membership. That does **not** contradict 322 — the window is wider
and now includes the corrective slices themselves, which is exactly `327.2`.
The write-up says so rather than publishing a disagreement it cannot support.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across the 32 open items at `dd69b3e5`. Rule 2 `Standardize 2 / 4` no. Rule 3
`Objective 1 / 3 [320]` no. **Rule 4 matched** on `322.3`, the oldest
cloud-takeable open item, exactly what the previous hand-off predicted. Rules
5-8 not reached.

```
Standardize   2 / 4 Continue rounds  since 2026-09-07 21:52   ok
Objective     1 / 3 slice            since 2026-09-08 00:17   ok  [320]
Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok
```

**Rule 5 was not reached and would not have fired.** Its line read `ok` (not
STALE, not SKEW), and the comparable set's only movers are `claims` (+7, rising
is the goal) and `dispatch-region-words` (+194, one day-pair) — neither is two
consecutive runs the wrong way. **No metric was recorded this wake**: this slice
measures the roadmap corpus, not a tracked name, and `dispatch_status.py` pairs
by DISTINCT DAY, so a same-day sample of an existing name adds no pair.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` at `dd69b3e5`: closed-history share **2,946 / 9,079 =
32.4%**, 13 eligible targets, **13 of them named by a still-open item** (236.2 —
read each before moving it). The trigger the last sweeps actually used: 252.1
dispatched the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, and 279.3
declined the twelfth at **40.6%**. 32.4% is below all three, so sweeping here
would be a wake lowering the threshold by its own initiative — which is what
`249.12`, the open **OWNER OR ARCHITECTURE CALL** on the archival trigger,
exists to prevent. Re-run the script; this commit moves the numbers.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this commit**, and that is structural rather than a
judgement call: the diff is **markdown only** — `ROADMAP.md` and this file. No
CSS, no `.astro`, no script and no docs page changed, so no rendering can move.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree — core `build`, core `test` (29 files, 165 tests), `lint:css`,
`docs:build`, `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:scroll` (914 containers), `check:layout` (128 pages), `check:forced-colors`,
`test:axe` (128 × 2, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (20 behaviours),
`check -w create-ui`, `npm run suite` (28 screens × 2). Plus `check:selftests`
(55 gates: 21 heuristic, 34 exact) and `check:viewport-forks`.
`check:vendor-names` was run **directly** (`node scripts/check-vendor-names.mjs`
→ 614 files against 7 denied names) because it is not a docs-workspace npm
script; it reaches CI through `check:repo`. **`docs:build` was re-run after this
file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught, all three in this wake's own output: a stale `ROADMAP.md:NN` citation
that this slice's own insertion would have invalidated (replaced with a
description of the two sites); and the two self-contaminated figures above,
which were published bare before the re-run caught them.

## The open set is 31 — no P0, and 20 are cloud-takeable

`roadmap_scope.py` reported **32 open** at `dd69b3e5` and the raw checkbox count
agreed. This commit closes `322.3` and opens nothing, so the count is **31**.
**Re-run the script** rather than quoting this — it refuses to print figures for
an uncommitted tree.

- **cloud-takeable: 20** — `323.1`, `324.1`, `324.2`, `325.1`, `325.2`,
  `326.3`, `327.3`, `328.1`, `330.1`, `331.1`, `332.1`, `333.1`, `334.1`,
  `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `342.1`.
  **`323.1` is now the oldest of these** and is what rule 4 reaches for next.
  **`335.1` still carries its caveat**: settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3` — still the only item
  left open on Slice 320.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a NINTH
consecutive hand-off.** See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...dd69b3e` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit. Trap 2 was clean in
one `--unshallow` (no `shallow.lock`) and again brought the tags; `git tag |
wc -l` → **8**, §2's mandated count, run rather than assumed. **No ordinal is
claimed for that streak** — two incompatible counters are in circulation, and
running the count is the check §2 asks for. Trap 1c was respected:
`CHROME_PATH` was exported **in the same command** as every browser gate. Trap
1b was handled by anchoring with an absolute `cd` after the one `cd apps/docs`.
No `git stash` was used at any point.

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
   score does not move should increment `dry`. Not touched this wake; rule 6
   was never reached, so `polish_requeue.py --apply` was correctly not run.

**`249.12` is named for a third consecutive wake, and the drift is now
measured rather than asserted.** Three consecutive wakes have declined an
archive sweep on the absence of a stated trigger (279.3 at 40.6%, the previous
wake at 33.1%, this one at 32.4%). The item is filed as low urgency because
"the sweep keeps happening regardless"; that sentence has now been false three
times running. **Nothing is proposed here** — the point is only that the item's
own urgency note has drifted further from the practice.

**What the next wake should reach for: rule 4 on `323.1`**, unless rule 2
(`2 / 4`) or rule 3 (`1 / 3`, and this wake's Slice 343 makes it 2 / 3) has
moved. Read the counters rather than trusting this line.
