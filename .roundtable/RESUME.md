# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **four** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, `polish_requeue.py
> --verify-stamps`, and `check_correction_sites.py` (346.1). All four REPORT;
> none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and clear
its In flight and Uncommitted sections the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight

## Uncommitted

Nothing in this checkout. The owner's own uncommitted work of 2026-09-20 is parked
on `park/owner-checkpoint-2026-09-20` (`a9a2d9bb`, decision O2); pushing or merging
that branch is the owner's call.

## Next rule

- **Step 0:** `step0_guard.py`, then `inflight.py hold`, then
  `dispatch_status.py` (a REFUSED milestone line stops the wake; see LOOPS.md
  Step 0b).
- **No standing GOAL.** The owner's M0 bootstrap (O3: *"bootstrap
  393.1-393.10 approved; rules 2 and 3 paused until 393.10; cap 12 wakes"*)
  ran to its end: `393.1`-`393.10` are closed. **Used: 10 of 12**, counted as
  distinct loop-log timestamps of 393.x rows; the one hold is counted
  separately (`hold-wakes`).
- **Then Step 2 from rule 1.** Rules 2 and 3 resume, and both counters read
  OVERDUE (`dispatch_status.py`), so with no open P0 the next dispatch is
  rule 2, Standardize. Rule 4's oldest dispatchable item (`375.11` at the time
  of writing) comes after them. M1 is DRAFT, so rules M and D do not run.

## Direction — 2026-09-26

Owner decisions and actions waiting. **A recommendation for every item below,
with its re-measured evidence and a validated field block to paste, is in
`.roundtable/owner-recs-2026-09-26.md`** (start at "Start here").

0. **M0 failed its exit test** (`393.10`: mean 2.375, Correctness 1 and
   Maintainability 1; `.roundtable/loop-doctor-rescore-2026-09-26.md`). Either
   extend the bootstrap to `398.1` plus a second re-score (2 wakes remain), or
   set `Status: ACTIVE` without the test. Slice 398's preamble has both paths.
1. **O5-O18** in `.roundtable/milestone-draft-2026-09-25/5-open-decisions.md`,
   the fields M1 needs before ACTIVE.
2. **Three readings to confirm or reverse:**
   - `393.6`: a tier set to `none` runs on `top` (§5 and O14), not refused
     (`393.6`'s Accept);
   - four fields are loop-written while their decisions are blank: Precedence
     (O11), Rules-2-3 (O12), Planner (O14), Direction-drift (O16); `398.3`;
   - D4 (`Direction-drift`): the measured framework share has a median of
     4.9%, so any X of 10% or more would fire almost daily (`393.7`).
3. **Archive the cloud sessions** of the disabled routine (O1).
4. **`377.5`** — release: eight P0 fixes are unreleased (377.5's seven, plus
   `392.1`).
   **`377.6`** — is busy-office-erp the first user?
5. **Issue #2** has had only the triage comment for weeks; replying is the
   owner's action (Slice 317 refused the component).
6. **`369.1`** (print from the dark theme), **`249.12`** (the archive-sweep
   trigger) and **`273.2`** (Polish `dry`) are owner calls, unchanged.
7. **The wake prompt still says "Read `LOOPS.md` and `ROADMAP.md` fresh"**,
   while the milestone's read set (prompt §4) reads neither whole. Real wakes
   already read far less (measured: 12.4k words at a cold start, 3.8k on a
   bootstrap wake; `393.8`). Whether the prompt should say "read what they point
   at" is the owner's wording to change; `393.13` re-measures on the first ACTIVE wake.
8. **`375.11`'s Firefox half** is blocked: Playwright's Firefox does not
   launch here ("Could not find profile folder").

History lives in `.roundtable/resume-history.md` (`393.8`), never here.
