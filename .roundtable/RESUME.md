# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids` and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3).
> `check_correction_sites.py` is run on purpose before a correcting commit
> (381.1 unwired it). Run
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
  Step 0b). Before choosing, read CI for main's HEAD (`gh run list --branch
  main --limit 2`); a red main is rule 1.
- **No standing GOAL.** M0 ended with `398.5` (FAILED, 2.375); M1 stays DRAFT.
- **Rule 4's pick is `386.1`, started, not landed** (nothing in the checkout).
  Base rate: 0 of 312 print readings off `#fff`/`#000` (128 `distPages` + 28
  `suitePages`, both themes, `23a22cce`). Shape chosen: a print probe in
  `check-layout.mjs` on each page it already loads (a shared source would not
  catch a NEW page). **Red-proof not done:** the first injection removed 0 rules;
  delete the unlayered `@media print` `body` rule from ANY sheet (href or not),
  assert 1 removed, then read. Script: `~/Projects/busy-office-ui-handoff/386.1-base-rate.mjs`.
- **Jev reviews are UNVERIFIED until the owner lands the migration below.**
  CLAUDE.md still names `mcp__jev__*`; the owner removed that server and the
  old `jev-*` skills on 2026-09-27. Never fall back to MCP; do not use the
  `jev` CLI for loop reviews until CLAUDE.md says so.

## Direction — 2026-09-26

**2026-09-27 — the Jev 0.10/0.11 migration waits on the owner.** Proposal
(6 files, +589 −118, applies to `107e4a49`, reviewed clean) is outside the repo,
uncommitted by instruction: `~/Projects/busy-office-ui-handoff/jev-0.11-proposal/`
(`proposal-final.diff`, `hit_table.md`, `evidence.md`, `flags.json`). Landing it
turns Jev back on for every wake. Owner has allowed the repo, set the key, and
removed the MCP server and old `jev-*` skills; left: `~/.zshrc:93`,
`/plugin configure busy-office`, and busy-office-erp's AGENTS.md/ADR-0022.

Owner decisions and actions waiting. **A recommendation for every item below,
with its re-measured evidence and a validated field block to paste, is in
`.roundtable/owner-recs-2026-09-26.md`** (start at "Start here").

0. **M0 failed twice** (`393.10` and `398.5`, both 2.375). Each fresh
   scorer finds a new 5-7 stale statements, so patching sites does not
   converge. The choice is yours:
   - set `Status: ACTIVE` without the test (the O-fields still come first);
   - or have the loop shrink what a wake must trust: move the
     cloud-container history out of `ENVIRONMENT.md`, and out of `LOOPS.md`,
     the way RESUME's history moved to `resume-history.md`. Then re-score.

   The activation sentence at ROADMAP.md:148 still names `393.10`. That is
   your section, and both scorers flagged it. Suggested wording: "393.10, or
   its one retry 398.5, reports …".
   **Archive the cloud sessions** (O1): 302 of 307 are still active.
   **0.9.0 is released** (owner: "Can you publish the 0.9.0?"), and the
   tarballs are verified; 377.5 and 394.3 are closed. **A 0.9.1 decision is
   yours:** Slice 401's grill found that 0.9.0's `bo-check-markup` passes when
   one of several paths is missing, where 0.8.0 failed closed (`401.1`). The fix
   is small. `401.2` corrects four statements in the released notes; the
   GitHub Release body is yours to update.
   **Firefox** (375.11's half): installing it was not enough. The launch fails
   even outside the sandbox. Open Firefox.app once, which should create
   `~/Library/Application Support/Firefox` (unverified), and the loop retries.
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
