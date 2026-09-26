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
- **The one standing GOAL — the owner's M0 retry** (O3's cell, extended
  2026-09-26 after `393.10`'s FAIL): *"one retry, 398.1 → 398.2 → re-score
  398.5; rules 2 and 3 paused until 398.5; cap 13"*. **Used: 12 of 13**,
  counted as distinct loop-log timestamps of M0 dispatch rows; holds are
  counted separately (`hold-wakes`). `398.1` and `398.2` landed. **Next:
  `398.5`**, the re-score, the last M0 wake. A P0 still preempts. Rules 2 and 3 print OVERDUE and stay paused.
- **After `398.5`:** on PASS, the owner sets `Status: ACTIVE`. On FAIL, M1
  stays DRAFT, and the loop does not extend M0 again. Either way the GOAL
  ends: Step 2 from rule 1, with rules 2 and 3 resuming.

## Direction — 2026-09-26

Owner decisions and actions waiting. **A recommendation for every item below,
with its re-measured evidence and a validated field block to paste, is in
`.roundtable/owner-recs-2026-09-26.md`** (start at "Start here").

0. **Archive the cloud sessions before `398.5`** (O1): 302 of 307 sessions of
   the disabled routine are still active. The loop can list them but has no
   archive action. `398.5` re-lists them and quotes the count, and is not held
   for it. (M0's FAIL was answered on 2026-09-26: one retry, above.)
1. **O5-O18** in `.roundtable/milestone-draft-2026-09-25/5-open-decisions.md`,
   the fields M1 needs before ACTIVE.
2. **Three readings to confirm or reverse:**
   - `393.6`: a tier set to `none` runs on `top` (§5 and O14), not refused
     (`393.6`'s Accept);
   - four fields are loop-written while their decisions are blank: Precedence
     (O11), Rules-2-3 (O12), Planner (O14), Direction-drift (O16); `398.3`;
   - D4 (`Direction-drift`): the measured framework share has a median of
     4.9%, so any X of 10% or more would fire almost daily (`393.7`).
3. **Push `park/owner-checkpoint-2026-09-20`** to origin as a backup (it has no
   upstream). Its four `.roundtable` records were copied to main on 2026-09-26;
   the journey code stays parked until O5 decides RF.
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
