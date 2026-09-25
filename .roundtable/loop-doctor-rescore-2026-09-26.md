# Loop-doctor re-score — 393.10, M0's exit test (2026-09-26)

Scored at HEAD `8575c98b` by a fresh-context subagent that built none of
393.1-393.9 and was not shown the 2026-09-25 per-dimension scores (393.10's
"who scores"). Method: `busy-office:loop-doctor` 0.9.4. The report below is the
scorer's, verbatim except for line wrapping. The closes-on-HEAD run that
preceded it (all 17 named commands of 393.1-393.9 pass on a clean worktree of
`8575c98b`) is quoted in ROADMAP 393.10's DONE note.

**Verdict: FAIL — mean 2.375, Correctness 1 and Maintainability 1.** The exit
test needs a mean of 3.0 or more with no dimension at 1, so M1 stays DRAFT.
N1 was fixed in the RESUME.md this item wrote; N2-N7, the two Redundants and
the in-flight fail-open (Safety b) are filed as Slice 398.

| Dimension | 2026-09-25 | 2026-09-26 | Ceiling from Invalids |
|---|---|---|---|
| Correctness | 1 | 1 | N5, N6 |
| Safety | 2 | 3 | — |
| Reliability | 2 | 3 | — |
| Cost | 2 | 3 | — |
| Maintainability | 3 | 1 | N2, N3, N4, N7 |
| Understandability | 2 | 2 | N1 |
| Observability | 2 | 3 | — |
| Purpose | 3 | 3 | — |
| **Mean** | **2.1** | **2.375** | |

The 2026-09-25 column is the loop-doctor run reported in the owner session
(transcript `1dbfe40a…`); only its mean, 2.1, is in the repo (Slice 393's
heading). The scorer did not see either. Maintainability fell from 3 to 1 on
four stale sentences. All four were written before M0 (`git log -S`: 2026-08-13,
08-14, 08-19, 08-28), but three went stale or were touched during it: M0
changed a rule and did not sweep the rule's other statements.
- N2: 393.1 reversed O1's "collisions accepted" at LOOPS.md:217, and not at :2269.
- N3: 393.4 retired the RESUME in-progress override, and not at :1047.
- N4: 393.5 edited the CLAUDE.md sentence that still carries the old router
  order (`git blame` a4f4fd13).

---

## The scorer's report

LOOP-DOCTOR RE-SCORE, busy-office-ui at HEAD 8575c98b (independent scorer, read-only)

VERDICT: FAIL. The mean is 2.375, below 3.0, and two dimensions score 1:
Correctness and Maintainability. Health label: treat.

The result is robust. If you drop the most arguable Invalid (N6), Correctness
becomes 2 but Maintainability still has three Invalids and stays at 1; the mean
becomes 2.5 and it is still a FAIL. Every Invalid below is a text edit; none
needs code.

Method: I followed loop-doctor 0.9.4. inventory.mjs ran in 1.43 s and its
self-test passed 21/21. I read the checklist, scorecard and tick-model, applied
the ceiling rule (one Invalid caps a dimension at 2, two or more at 1), and
scored each reason before its number.

### Scores

Mean = (1+3+3+3+1+2+3+3)/8 = 19/8 = 2.375 → treat.

1. **Correctness: 1.** Two Invalids, N5 and N6 (see New Invalids).
   Risks:
   - LOOPS.md:21 and :1032 state a "20 min" cadence. The real trigger is a
     self-paced /loop in the owner's session (per the memory note), so nothing
     enforces that number.
   - `inflight.py` crashes with exit 1 when RESUME.md is missing (it uses
     os.getcwd). LOOPS.md Step 0 defines only exits 0, 3 and 4.
   Passes:
   - No tripped sentinel (inventory).
   - `step0_guard.py` exits 0/2/3/4/5 exactly as its docstring says.
   - The thresholds 4 (Standardize) and 3 (Objective) agree everywhere they are
     stated.

2. **Safety: 3.** No Invalid; the risks are listed below.
   Passes:
   - A kill switch exists: `.roundtable/HALT` gives exit 3, and the self-test
     proves it.
   - There are escalation channels: the RESUME Direction block, STATUS
     Owner-blocked, and PushNotification.
   - Self-approval is forbidden in prose at ROADMAP.md:139-141 ("The loop reads
     it and never edits it"), and no commit after c8d2ccb7 touched the
     Milestone M1 section (`git log -L`).
   Risks:
   - (a) The cloud routine's sessions are dormant but not archived. That is an
     owner action, still open at RESUME Direction #3.
   - (b) `inflight.py` fails open. I fed it five malformed In-flight lines
     (trailing space, space in paths, fields reordered, cap=60m,
     bullet-prefixed) and all five returned exit 0, "nothing in flight". A
     valid line returns 3.
   - (c) There is no agents-per-wake or wake wall-time cap:
     `Budget: agents/wake OWNER · workflow-wall OWNERm`. The m0-wakes cap of 12
     is counted by hand.
   - (d) The loop pre-filled O11, O12, O14 and O16 (Precedence, Rules-2-3,
     Planner, Direction-drift) while those decisions are still blank at
     ROADMAP.md:371. `milestone.py` counts them as filled: it prints
     "unfilled: App, Modules, Devices, Tiers, Budget". RESUME flags only O12.
   - (e) One-way-door stop classes exist only in the DRAFT prompt, and it
     contradicts itself. 4-prompt.md:640 says the dispatcher "stops … and does
     not continue"; 4-prompt.md:655 says a one-way door is "logged … and worked
     around". This becomes Invalid at activation.
   - (f) DISPATCHER names a checkout, not a session, so two local sessions in
     the same checkout both pass the guard. This has happened before
     (ROADMAP.md:397-401).

3. **Reliability: 3.**
   Passes:
   - CI is green on HEAD 8575c98b and on the 7 CI runs before it
     (`gh run list`).
   - `record_iteration` refuses a log it cannot parse.
   - The rebuild_from_log self-test passes.
   Risks:
   - Closes are not verified on HEAD by code. 393.11 is open, and ROADMAP
     393.10 records that "2 of 30 closes … were false at HEAD". The M0 closes
     were re-run by hand (closes-on-head.txt).
   - The no-progress and repeat-failure stops exist only in the M1 `Stop`
     field, so none is active while M1 is DRAFT.
   - Steady state (rule 8) cannot be reached while any Polish surface exists,
     because rule 6 is always true (LOOPS.md:925-967). The owner accepted this
     in 176.3.
   - The in-flight fail-open from Safety (b).

4. **Cost: 3.**
   Risks:
   - The wake prompt (LOOPS.md:49-59) says to read LOOPS.md fresh (2,291
     lines, 22,827 words) and ROADMAP.md fresh (10,148 lines, 92,981 words).
     With CLAUDE.md (3,673 words), ENVIRONMENT.md (8,596), STATUS (3,571) and
     RESUME (594), that is about 132k words per wake as declared. The real
     reads (12.4k words cold, 3.8k on a bootstrap wake, from 393.8) are claims
     I could not verify; that work is 393.13.
   - ROADMAP.md has regrown from 1,094 lines (CLAUDE.md:15) to 10,148. Only
     12% of it is closed history (`roadmap_scope.py`), and the archive trigger
     is an owner call (249.12).
   - There is no per-wake agent or wall-time cap.

5. **Maintainability: 1.** Four Invalids: N2, N3, N4 and N7.

6. **Understandability: 2.** One Invalid, N1.
   Pass: hand-off and history are now separate. RESUME is 75 lines by the
   charter's count, and the history is in resume-history.md (1,031 lines).
   Risks:
   - The tick was hard to draw from the files. LOOPS.md's Step 2 alone runs
     from line 492 to 1025.
   - "Used: 9 of 12" counts items, not wakes.

7. **Observability: 3.**
   Passes:
   - The outcome and loop vocabulary is closed and enforced:
     `check:loop-vocab` reports "2 document(s) match the 6 outcomes and the 10
     loop names".
   - There is one record per item, after the commit.
   - Holds are visible: 1 row in hold-wakes.jsonl, printed by
     `dispatch_status`.
   - Route and model telemetry is recorded since 393.6.
   Risks:
   - The M0 wake budget has no counter. The log shows 10 distinct bootstrap
     dispatch timestamps plus 1 hold, against the hand-written "9".
   - Rule 5 is STALE: only 8 of 51 metric names are sampled on two or more
     days.
   - `dispatch_status` prints "OVERDUE … the dispatcher should pick it" for the
     rules O3 paused, so the pause is visible only in prose.
   - Log timestamps are naive local times, and cloud rows at +0000 sit out of
     order (a 12:20 row is followed by a 04:42 row).

8. **Purpose: 3.**
   Passes:
   - The intent is ROADMAP.md:8 `## Objective`, named in CLAUDE.md and in
     LOOPS.md triage.
   - There is a periodic review: rule 3 plus the thesis gate.
   - There is a goal-level exit: the M1 Done-test at ROADMAP.md:309-337.
   - Queue sharpness is good: 91 of 102 open items (89%) carry an Accept
     label, and the 11 without one are all owner calls.
   Risks:
   - The re-plan rung (rule D) exists only while a milestone is ACTIVE.
   - The Objective was edited by agent-co-authored commits 1c057a44, 52035917,
     45343084 and f6c5e766 (last on 2026-08-23). Each commit body cites owner
     direction, so these are scribe edits, but read-only intent is prose only.
   - One-way doors are not named in the loaded playbook.

### The four 2026-09-25 Invalids, re-checked

1. **The hand-off contradicts itself: STILL INVALID, but narrower.**
   `node apps/docs/scripts/check-resume-charter.mjs` → "resume charter passed —
   16 charter rules hold", exit 0. `--self-test` → "resume charter self-test
   passed — 23 cases classified correctly", exit 0.
   The history half is fixed:
   - RESUME.md is 75 lines in four sections.
   - I red-proved the charter on a scratch copy: adding a fifth section gave
     "FAIL RESUME.md holds only In flight, Uncommitted, Next rule and a dated
     Direction", exit 1; a 124-line file over the 120 cap gave exit 1.
   - The charter is still advisory only (LOOPS.md:120-131), so it reports a
     breach and blocks nothing.
   The agreement check fails on the Next rule:
   - RESUME.md:43-45 says "After 393.10: … rule 4 dispatches the oldest
     dispatchable item that STATUS.md names (375.11)".
   - O3 (ROADMAP.md:371) pauses rules 2 and 3 only "until 393.10".
   - `dispatch_status.py` prints "Standardize 13 / 4 … OVERDUE" and "Objective
     3 / 3 slices … OVERDUE [375, 392, 393] -> … the dispatcher should pick
     it".
   - There is no open P0, and LOOPS.md:497-513 puts rules 2 and 3 above rule 4.
   - So the hand-off sends the next wake to rule 4 past two overdue counters.
     This is new finding N1.
   The M0 count (9 = items 393.1-393.9, matching STATUS "Phase 0: 9 of 13
   closed") and the in-flight state (`inflight.py status` gives exit 3 on this
   scorer's line) do agree.

2. **A design-grill resets rule 3: CLOSED.**
   `--thesis-replay` output:
   - "2026-09-24 17:08 REFUSED 382 … no `## Thesis section`"
   - "… 21:22 REFUSED 384 … no `## Thesis section`"
   - "2026-09-25 02:49 REFUSED Slice 386 … the adoption part was skipped
     without naming the error…"
   - "… 08:13 REFUSED 388.2 … commit e76a8f90 carries only a design-grill
     report (.roundtable/design-grill-flow-rf-2026-09-25.md)"
   - "… 13:32 RESETS Slice 392 … grill-objective-388-389-390-2026-09-25.md"
   (closes-on-head.txt quoted only the last line.)
   `--self-test` → "14 slice-reference case(s), 6 clock-skew case(s), 5
   metric-pairing case(s) and 17 thesis case(s) classified correctly", exit 0.
   My own red-proof, calling `objective_resets()` on synthetic rows:
   - mode=design-grill with a valid report → False.
   - grill rows pointing at e76a8f90, "-", or a missing sha → False.
   - e8ac9844 → True.
   `since_last()` uses this check (dispatch_status.py:291-301).
   LOOPS.md:1757-1762 and :515-519 agree with the code.

3. **Two live dispatchers and no kill switch: NO LONGER INVALID AS STATED; a
   Risk plus new Invalid N6.**
   `step0_guard.py --self-test` → "6 cases (pass, cloud checkout, HALT, foreign
   commit, allowed author, missing topology) behave", exit 0.
   `step0_guard.py` → "ok — /Users/thepfmind/Projects/busy-office-ui is the
   dispatcher; no HALT; no foreign commits upstream.", exit 0.
   What is fixed:
   - The kill switch exists.
   - DISPATCHER names one root and the author ThePFMind. Cloud commits are
     authored "Claude <noreply@anthropic.com>", so exit 5 does detect them.
   - The last +0000 cloud commit is 9669b24f at 2026-09-25 05:15 UTC. There
     has been none in the roughly 13 hours since the guard landed.
   What still depends on the owner: archiving the cloud sessions (O1; RESUME
   Direction #3).
   Does the guard stop a cloud session regardless? No:
   - It stops only a session that runs the current Step 0.
   - A revived stale session would not. The script is absent at 9669b24f
     ("fatal: path 'scripts/loops/step0_guard.py' exists on disk, but not in
     '9669b24f'"), and LOOPS.md at 9669b24f mentions step0_guard 0 times.
   - Collision 6 was exactly this case: a revived 09-09 session on a checkout
     159 commits stale.
   - The backstop is that exit 5 halts the local loop after such a session
     pushes.
   - I could NOT verify that the routine itself is disabled, because I have no
     RemoteTrigger access.

4. **Nothing tells a wake what to do while a workflow is in flight: CLOSED,
   with a Risk.**
   `inflight.py --self-test` → "11 cases behave (status 0/3/4, open, refused
   second open, hold row, close, reopen)", exit 0.
   `inflight.py status` → "IN FLIGHT 4/60 min — hold (dispatch nothing):
   wf=scorer-393.10 item=393.10 started=2026-09-25T18:03:00Z cap=60 …", exit 3.
   LOOPS.md:84-97 defines exits 0, 3 and 4. hold-wakes.jsonl has 1 row
   (2026-09-25T13:42:07Z, for the 393.3 workflow).
   The residual Risk is the fail-open on a malformed line (Safety b).

### New Invalids

- **N1:** The hand-off's rule for after 393.10 skips rules 2 and 3, which are
  both OVERDUE.
  Where: RESUME.md:43-45 against `dispatch_status` and LOOPS.md:497-513.
  Fix: say "then Step 2 from rule 1; rules 2-3 resume".
- **N2:** An operating rule still says "an hourly cloud routine now dispatches
  … Collisions are accepted" as current. O1 reversed that (LOOPS.md:217).
  Where: LOOPS.md:2266-2272.
  Fix: mark it reversed and point to Step 0c.
- **N3:** The Continue input still allows "unless RESUME.md names a genuinely
  in-progress slice", an override retired by 393.4.
  Where: LOOPS.md:1045-1047, against LOOPS.md:850-857.
  Fix: delete the clause.
- **N4:** The always-loaded CLAUDE.md gives the router order as "(P0 bug >
  build > tidy > explore > grill)". The real Step 2 order is P0 > Standardize
  > Objective > [M/D] > build > Optimize > Polish > Research > halt, and
  Explore is never dispatched.
  Where: CLAUDE.md:62-64.
  Fix: replace it with a pointer to LOOPS.md Step 2.
- **N5:** Two dead references in ROADMAP.md, which is read every wake. Neither
  file exists in any commit on any branch.
  - ROADMAP.md:570 cites `.roundtable/milestone-m1-prompt.md` §9; it is
    actually `.roundtable/milestone-draft-2026-09-25/4-prompt.md` §9 (line
    504).
  - ROADMAP.md:1405 cites `.roundtable/grill-milestone-m1-2026-09-25.md`; it is
    actually `.roundtable/milestone-draft-2026-09-25/1-grill-report.md`.
- **N6:** The playbook claims more than the guard does.
  Where: LOOPS.md:76-77 ("every cloud session stops here, whoever sends it the
  wake prompt") and step0_guard.py:15-17.
  Fix: state that the owner's archive of the sessions is the prevention and
  exit 5 is the backstop.
- **N7:** The Objective loop's trigger is still described as "dispatched at
  milestones / on demand", although rule 3 is a counter (LOOPS.md:510-513)
  that has fired repeatedly.
  Where: LOOPS.md:28 and :1643.

Also found, Redundant:
- LOOPS.md:211's heading still says "collisions are ACCEPTED", though the body
  marks the reversal.
- ROADMAP.md:352-353 orders Step 0 as HALT → in-flight → foreign commits, while
  the code and LOOPS.md run HALT → checkout → foreign commits → in-flight. This
  is latent: that section applies only while M1 is ACTIVE.

### What these measurements do not cover

- I read no session transcripts. So words actually read per wake, whether
  wakes really run the guard each time, and wakes used against the m0 cap are
  NOT MEASURED.
- The cloud routine's state could not be checked.
- The reference scan covered only backticked paths with file extensions in
  LOOPS.md, CLAUDE.md, RESUME.md, STATUS.md and ROADMAP.md:136-2440. Many
  unresolved hits were future deliverables or basename shorthand, which I did
  not count.
- I did not read LOOPS.md:1178-1641 and :1841-2164; I only keyword-scanned
  them for dispatcher, cloud and RESUME claims, and found nothing new.

### Receipt

- No repo file was edited, created or committed by the scorer.
- The working tree's one modification, the in-flight line in RESUME.md, was
  already there when it started (its registration line).
- `step0_guard.py` ran its `git fetch`, which updates origin refs but not the
  working tree.
- Commands run: the named self-tests and status reports, `milestone.py`
  (read-only report), `check-loop-vocab`, `roadmap_scope.py`, and
  `gh run list`. It did not run `record_iteration`, `rebuild_from_log` or
  `generate_status` in write mode.
