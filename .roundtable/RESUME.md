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
found `origin/main` unmoved at `c03835ea`. One iteration recorded
(`Continue · build · 323.1`, `landed`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 344 — `323.1` closed on the outcome its own Accept named

`323.1` asked whether `dispatch_status.py`'s two base-rate replays should be
reconciled, and named *"a sentence naming the difference is the whole fix"* as a
satisfying outcome **provided the date replay was measured on the seven SKEW
occasions first**. Both replays were re-run at `c03835ea` rather than quoted:

```
commit replay   980 revisions -> 589 STALE, 335 ok, 54 SKEW, 2 NO LIVE INPUT
                the recorded SEVEN occasions REPRODUCE EXACTLY — same dates,
                same metric names, 51 of the 54 revisions; two new since
                (2026-09-07 `claims` 1, `gates` 2)
date replay     SKEW on 0 of the 9 — `ok` on six of the eight wake-dates they
                land on, STALE on two (2026-08-14, 2026-08-20)
```

**The two STALEs are the part worth carrying.** "An as-of-DATE replay reports
zero of them" was already in the file and reproduces; what it never said is what
the date replay reports *instead*. On those two dates it reports the one verdict
the SKEW envelope exists to soften, and the remedy a wake reads off a STALE —
record another metric — is precisely what cannot help when the residual is the
clock. That is Slice 306's original failure, reproduced by the coarser
instrument.

**The property that reconciles them, written as a property:** both predicates
compare dates; the unit each REPLAY needs follows the **lifetime of the state
being counted**. Measured, not asserted — the liveness question replayed at
commit granularity reads **335 live / 645 not live over 980 revisions** against
the date replay's **15 of 27** wake-dates. Both discriminate, so folding the two
commands into one changes no conclusion: **refused on that measurement.** No
gate — 94.11, "the right granularity was chosen" is not a checkable shape.

## The recorded command did not run, and the first fix for that was withdrawn

Command B is the file's whole evidence for the SKEW envelope and, pasted
verbatim, died with `NameError: MAX_CLOCK_SKEW` — the module constant is defined
120 lines BELOW the snippet. **The first fix restated `timedelta(hours=8)` in
the snippet and was withdrawn mid-slice**: a constant copied into prose is the
exact drift `observed_skew()` twelve lines down exists to catch. It now imports
the module's own.

**Red-proved by discrimination, not by a bare pass** — extracted from the file
by a prefix-stripping script and executed: before → `NameError`, after → exit 0
reporting `Counter({'STALE': 589, 'ok': 335, 'SKEW': 54, 'NO LIVE INPUT': 2})`,
which reconciles with the independent probe to the revision (980 = 589+335+54+2,
the 981st skipped by the snippet's own `continue`).

## The instrument was wrong first — a keying disagreement, caught by the record

The first harvest keyed each SKEW occasion by **the log's newest date at that
revision** and reported eight; the file's recorded seven are keyed by **the
newest metric's date and name**. Neither is wrong — they are one day apart by
construction, because the SKEW state IS a log row naive-later than the metric —
but quoting the first against the file's list would have published a
disagreement that does not exist. **What caught it was the recorded list**,
which is the case for keeping a derivation beside its figure: the re-derivation
had nothing else to reconcile against, and the record won.

## ⚠ A NEW ENVIRONMENT FACT, and it cost most of this wake: BACKGROUND WAITS DO NOT ELAPSE HERE

`ENVIRONMENT.md` §6 says an empty background output file means *still running*,
never *finished*. **This container is stronger than that: container wall clock
barely advances between tool calls.** Two browser-gate batches were launched
with `run_in_background` and then waited on with backgrounded
`sleep 150/200/240/420/500/540` — every sleep reported complete, and the gates
had progressed by **seconds**. `date -u` against the process table is what
settled it: `ps -eo pid,etime` showed `check-claims.mjs` at **1m45s of elapsed
time** after what looked like ~25 minutes of waiting.

**So a long gate must be run in the FOREGROUND**, with the tool's own `timeout`
(600000 ms is ample for every gate here). This is not §6's trap — the completion
marker was read correctly — it is one level under it. Two further costs, both
self-inflicted and both worth naming:

- **`pkill -f '<pattern>'` matches its own shell.** `pkill -f 'check-claims.mjs'`
  killed the bash process whose command line contained that string. Kill by PID
  from `ps`, never by `-f` on a string you just typed.
- **`node scripts/check-vendor-names.mjs` from the repo root does not exist** —
  it is `apps/docs/scripts/check-vendor-names.mjs`. The previous hand-off's
  "run directly" line is right about the mechanism and wrong about the path;
  from the root it MODULE_NOT_FOUNDs, which in a batched `for` loop looks
  exactly like a gate failing. It passes at the real path.
- **Its file count is not stable within a wake, and that is not cwd.** The
  direct run read **613** mid-wake and **614** afterwards, from the repo root
  both times (checked, after trap 1b had made it look cwd-dependent — a
  persisted `cd apps/docs` from an earlier command). The runs straddle
  `check:po-app` and `check:quickstart`, which install into `examples/`, so the
  walk includes generated files. **Quote it as a passing gate, not as a census
  of the source tree**; the commit message for Slice 344 carries the 613 that
  was true when it was taken.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this commit**, and that is structural rather than a
judgement call: the diff is a **Python comment block plus `ROADMAP.md`**. No
CSS, no `.astro`, no template and no docs page changed, so no rendering can
move.

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
`check:vendor-names` was run **directly** at its real path (see above) and also
reaches CI through `check:repo`. **`docs:build` was re-run after this file was
written**, per `ENVIRONMENT.md` §3b — green, and that run is where the 614
reading above comes from.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught: the duplicated `MAX_CLOCK_SKEW` literal described above, replaced
with an import before the commit.

## The open set is 30 — no P0, and 19 are cloud-takeable

`roadmap_scope.py` reported **31 open** at `c03835ea` and the raw checkbox count
agreed. This commit closes `323.1` and opens nothing, so the count is **30**.
**Re-run the script** rather than quoting this — it refuses to print figures for
an uncommitted tree.

- **cloud-takeable: 19** — `324.1`, `324.2`, `325.1`, `325.2`, `326.3`,
  `327.3`, `328.1`, `330.1`, `331.1`, `332.1`, `333.1`, `334.1`, `335.1`,
  `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `342.1`.
  **`324.1` is now the oldest of these** and is what rule 4 reaches for next.
  **`335.1` still carries its caveat**: settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3` — still the only item
  left open on Slice 320.

19 + 10 + 1 = 30, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a TENTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across the 31 open items at `c03835ea`. Rule 2 `Standardize 3 / 4` no. Rule 3
`Objective 2 / 3 [320, 322]` no. **Rule 4 matched** on `323.1`, the oldest
cloud-takeable open item, exactly what the previous hand-off predicted. Rules
5-8 not reached.

```
Standardize   3 / 4 Continue rounds  since 2026-09-07 21:52   ok
Objective     2 / 3 slice            since 2026-09-08 00:17   ok  [320, 322]
Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok
```

**Rule 5 was not reached and would not have fired.** Its line read `ok` (not
STALE, not SKEW), and the comparable set's only movers are `claims` (+7, rising
is the goal) and `dispatch-region-words` (+194, one day-pair) — neither is two
consecutive runs the wrong way. **No metric was recorded this wake**: this slice
measures the replay history of `loop-log.md`, not a tracked name, and
`dispatch_status.py` pairs by DISTINCT DAY, so a same-day sample of an existing
name adds no pair.

**Rule 2 is at `3 / 4` and the next Continue round arms it.** A wake reading
`4 / 4` should expect Standardize, not rule 4 on `324.1`.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` at `c03835ea`: closed-history share **3,282 / 9,209 =
35.6%**, 15 eligible targets, **11 of them named by a still-open item** (236.2 —
read each before moving it). The trigger the last sweeps actually used: 252.1
dispatched the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, and 279.3
declined the twelfth at **40.6%**. 35.6% is below all three, so sweeping here
would be a wake lowering the threshold by its own initiative — which is what
`249.12`, the open **OWNER OR ARCHITECTURE CALL** on the archival trigger,
exists to prevent. Re-run the script; this commit moves the numbers.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...c03835e` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit. Trap 2 was clean in
one `--unshallow` (no `shallow.lock`) and again brought the tags; `git tag |
wc -l` → **8**, §2's mandated count, run rather than assumed. **No ordinal is
claimed for that streak** — two incompatible counters are in circulation, and
running the count is the check §2 asks for. Trap 1c was respected:
`CHROME_PATH` was exported **in the same command** as every browser gate. No
`git stash` was used at any point. The new fact above — background waits do not
elapse — belongs beside these; it is proposed for `ENVIRONMENT.md` §6 rather
than written there by this wake, because §6 is durable content and this is its
first observation.

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

**`249.12` is named for a FOURTH consecutive wake, and the drift is measured
rather than asserted.** Four consecutive wakes have now declined an archive
sweep on the absence of a stated trigger (279.3 at 40.6%, then 33.1%, 32.4%, and
this one at 35.6% — the share rose because the closed-history denominator moved,
not because anything was archived). The item is filed as low urgency because
"the sweep keeps happening regardless"; that sentence has now been false four
times running. **Nothing is proposed here** — the point is only that the item's
own urgency note has drifted further from the practice.

**What the next wake should reach for: rule 2, Standardize — BOTH counters
crossed on this wake's own row, and that is measured after recording, not
predicted.** `dispatch_status.py` immediately after `record_iteration.py`:

```
Standardize   4 / 4 Continue rounds  since 2026-09-07 21:52   OVERDUE
Objective     3 / 3 slices           since 2026-09-08 00:17   OVERDUE  [320, 322, 323]
-> a counter is at or past its threshold; the dispatcher should pick it
```

**Rule 2 is evaluated before rule 3**, so Standardize wins the tie and the
Objective grill of `[320, 322, 323]` waits one wake. Rule 4 on `324.1` is not
reached. **This is the comparison `LOOPS.md` says finds the counter bugs** —
reading the counter right after recording, against what a human just wrote
down — so it was run rather than inferred; re-run it, because a collision could
land a row between this line and your wake.

**Standardize's four lanes are in `LOOPS.md` §3, and a cloud wake can run all
four**: `scan:dead-style` (needs `CHROME_PATH`), `report:css-repeats`,
`report:prose` (its verdict set is an ENUMERATION, not a grep — see the lane's
own warning) and lane 4, the roadmap-regrowth signal. Say `n of 4`.
