# Loop-doctor re-score, second run — 398.5, M0 exit test (2026-09-26)

Pre-registered in `b07ff571` before the run: scorer A's verdict is the verdict; scorer B is a variance check. Both are fresh-context subagents at HEAD `b07ff571`, following loop-doctor 0.9.4, not given an earlier score. Both disclose that the earlier result reached them incidentally, through the Slice 398 heading and the loop-log tail, before they scored. A third agent listed the cloud routine's sessions read-only. The three reports follow verbatim.

| | Correctness | Safety | Reliability | Cost | Maintainability | Understandability | Observability | Purpose | Mean | Verdict |
|---|---|---|---|---|---|---|---|---|---|---|
| A (verdict) | 2 | 2 | 2 | 3 | 1 | 3 | 3 | 3 | 2.375 | FAIL |
| B (variance) | 1 | 2 | 3 | 3 | 1 | 3 | 3 | 3 | 2.375 | FAIL |

**The two agree on the verdict, the mean, and Maintainability at 1, but not on the Invalids behind them.** Of the 2026-09-26 set, N1-N7 are closed in both, except for one leftover at `.roundtable/DISPATCHER:4`. Each scorer then found its own 5-7 stale statements elsewhere, and the two sets overlap in only three places: DISPATCHER:4, the activation rule at ROADMAP.md:148, and the owner fields the loop wrote itself (398.3; B calls it S1). Both scorers had seen the earlier mean, so their agreement on 2.375 is weak evidence.

---

## Scorer A (the verdict)

**Loop-doctor re-score (scorer A) at HEAD b07ff571: busy-office-ui autonomous loop**

Method: busy-office:loop-doctor 0.9.4. I read SKILL.md, scorecard.md, checklist.md and tick-model.md, and ran inventory.mjs (1,447 files scanned, 0 state files read whole).

**Built vs declared.** These are built and work: `step0_guard.py` (HALT, one checkout, foreign author), `inflight.py` (hold and exit 5), the `dispatch_status.py` counters, `record_iteration.py` (closed vocabulary, mirrors, STATUS), and the oldest-dispatchable pick. These are declared but not in force: rule M, rule D, the milestone Stop classes, and the wakes, agents/wake and workflow-wall budgets. They are dormant while M1 is DRAFT, and three of those budget values still read OWNER. M0's pause of rules 2 and 3, and its cap of 13, exist only as prose. No code computes `m0-wakes`: it is parsed in `milestone.py:92` and counted nowhere.

Tick, from the files:
- **Trigger:** the owner's self-paced /loop. `.claude/scheduled_tasks.lock` is held by session 1dbfe40a. The cloud routine `trig_019aw8t…` shows `"enabled":false`.
- **Wake:** guard, then `inflight.py hold`, then RESUME (86 lines), ENVIRONMENT (992) and git status, then `dispatch_status.py`. The wake prompt also says to read LOOPS.md (2,318 lines) and ROADMAP.md (10,465 lines) fresh.
- **Select:** Step 2 rules 1, 2, 3, [M, D], 4, then 5-8. M0 runs through RESUME's Next rule.
- **Verify:** the gates, plus `verifier`, plus advisory Jev.
- **Record:** `record_iteration.py` after the commit.
- **Stop:** HALT, the guard's exits and inflight exit 5. Rule 8 can never be reached (see Reliability).

The tick was hard to draw: the dispatch region is about 1,050 lines, with rules interleaved with forensics.

**Re-check of the earlier Invalids**

- **N1: the hand-off's next rule. No longer Invalid; one residual Risk.**
  - RESUME.md:38-46 says: "Used: 12 of 13 … Next: `398.5` … Rules 2 and 3 print OVERDUE and stay paused."
  - This agrees with LOOPS.md:879-886, Step 2 rule 4's standing exception ("398.1 → 398.2 → the re-score 398.5, cap 13, with rules 2 and 3 still paused until 398.5 closes").
  - It also agrees with O3's cell at ROADMAP.md:373 ("Extended 2026-09-26 … re-score 398.5; rules 2 and 3 paused until 398.5; cap 13").
  - `python3 scripts/loops/dispatch_status.py` (exit 0) prints "Standardize 16 / 4 … OVERDUE", "Objective 4 / 3 slices … OVERDUE [375, 392, 393, 398]" and "-> a counter is at or past its threshold; the dispatcher should pick it". The hand-off names that disagreement itself.
  - I counted 12 by hand from distinct M0 row timestamps in the loop-log tail (09-25 20:34 through 09-26 10:08). There is no open P0.
  - Residual Risk R1: the pause and the cap live only in prose. A wake that trusts the tool over RESUME would dispatch Standardize.
- **N2: the hourly routine and "collisions are accepted". Closed.**
  - LOOPS.md:2292-2299 is now past tense ("an hourly cloud routine dispatched … Reversed by the owner on 2026-09-25 (O1)").
  - The Step 0c heading at LOOPS.md:225 reads "the earlier 'accept collisions' decision is kept below as the record".
  - Residual, not Invalid: LOOPS.md:984's "keep the routine running hourly" is past-perfect narrative, but rule 6's accepted no-exit still rests on that premise.
- **N3: the Continue input's in-flight override. Closed.** LOOPS.md:1068-1072 reads "`RESUME.md`'s In flight section is not an override (retired by 393.4); a workflow in flight is a hold at Step 0." The old override at LOOPS.md:865-868 is struck through.
- **N4: CLAUDE.md restating the dispatch order. Closed at HEAD.** CLAUDE.md:63 reads "chosen per wake by the dispatcher's rules in `LOOPS.md` Step 2 (not restated here: restatements drift)". Residual Risk R8: the CLAUDE.md copy delivered to this subagent still says "router (P0 bug > build > tidy > explore > grill)". Commit 08ca48f0 removed that at 10:00 +0800, so the running /loop session carries the old order until it restarts.
- **N5: dead citations in ROADMAP.md. Closed.**
  - `test -e` gives MISS for `.roundtable/milestone-m1-prompt.md` and `.roundtable/grill-milestone-m1-2026-09-25.md`, but ROADMAP.md no longer cites either one (grep count 0).
  - The bare filename `grill-kev-in-the-loop-2026-09-21.md` (ROADMAP.md:601, 634, 1574) resolves to `.roundtable/grill-kev-in-the-loop-2026-09-21.md`: OK.
  - My scan of backticked paths in LOOPS.md, CLAUDE.md, RESUME.md, ENVIRONMENT.md, STATUS.md and ROADMAP.md:1-2757 found nothing unresolved except generated artefacts (`api.json`, `graph.db`) and future deliverables named in open Accepts (`jobs.json`, `queue_screen.json`, `ab-module-sets-protocol.md`, the ADR).
  - Not covered by the scan: unbackticked paths, the archives, ROADMAP beyond line 2757, and agent or npm-script names.
- **N6: the guard's claims. Fixed at both named sites; still Invalid at one other.**
  - LOOPS.md:76-79 and step0_guard.py:16-20 now say "a revived stale session runs its own older copy … which has no guard … archive is the prevention and exit 5 is the backstop".
  - The backstop is real. The cloud commits are authored `Claude <noreply@anthropic.com>` (318 since 09-01), and DISPATCHER allows only `ThePFMind <thepfmind@gmail.com>`.
  - Still wrong: `.roundtable/DISPATCHER:4` says "A cloud session is never this checkout, so it stops at Step 0." Impact is low, because the guard strips comments.
- **N7: the Objective trigger. Closed.** LOOPS.md:1668-1669 ("once three distinct slices have been named since the last Objective row that reset the count") matches LOOPS.md:28, rule 3 at :530-541 and the counter. The 4 slices [375, 392, 393, 398] after the 13:32 reset row check out against the log's file order.

**In-flight check**

- `python3 scripts/loops/inflight.py --self-test` gives exit 0: "25 cases behave (… 398.2: the five malformed lines, two lines, bad started, hold/open/close over an unparsed line, a missing RESUME.md, the root)".
- `python3 scripts/loops/inflight.py status` gives exit 3: "IN FLIGHT 3/90 min — hold (dispatch nothing): wf=rescore-398.5 item=398.5 …".
- I then tried 17 variants on a scratch copy (scripts/loops/inflight.py plus .roundtable/RESUME.md under scorer-A/inflight-sandbox).
- These are correctly refused with exit 5:
  - a `(none)` placeholder or an HTML comment;
  - a tab between fields, or an extra field;
  - a `###` line inside the section ("2 lines under ## In flight");
  - RESUME.md being a directory.
- These behave correctly: CRLF line endings exit 3, and an empty section exits 0.
- These read "nothing in flight", **exit 0**, with a valid live line present (Risk R2):
  - a decorated heading, `## In flight (393.2)`;
  - `## In Flight`;
  - `### In flight`;
  - `## In-flight`;
  - the heading missing, with the line under `## Uncommitted`;
  - the line in a second `## In flight` section.
- `started=2027-…` gives exit 3 "IN FLIGHT -525459/60 min", which holds forever. `cap=99999999` is accepted (Risk R3).
- A non-UTF-8 byte gives **exit 1** with a `UnicodeDecodeError` traceback. The docstring says exit 5 for "cannot be read". This fails loudly, so I count it as Risk R4.
- Verdict: 398.2's five named cases are fixed. The check still reads state it cannot parse as "nothing in flight" when the heading drifts, and RESUME.md is rewritten every wake. `check-resume-charter` does report a missing section, but only as advice, after the commit.

**New Invalids (with one-line fixes)**

- **NI-1, LOOPS.md:2264-2271.** The operating rule says "Routine ticks: run a **bind-mounted** nginx … no image rebuild". That contradicts the wake prompt at LOOPS.md:55-56 ("rebuilt with `-p 8081:80`"), LOOPS.md:45-47 (which calls the "bind-mounted" wording drift), and CLAUDE.md's quality bar (`podman build && podman run`). Fix: replace that paragraph with the wake prompt's method, rebuilding the image and confirming one listener as ENVIRONMENT.md §6e says.
- **NI-2, LOOPS.md:136.** It says "`.roundtable/**` is in CI's `paths-ignore`". But `.github/workflows/ci.yml:6,54` says "There is no paths-ignore", and so does ENVIRONMENT.md:350-351. Both files are read at Step 0 and they disagree. Fix: "was then in CI's paths-ignore (removed by 312.2; CI now builds every commit)".
- **NI-3, LOOPS.md:1657.** Explore's trigger says "dispatched when the backlog is empty". No Step 2 rule does that, rule 8 at LOOPS.md:1039 says "Do NOT re-dispatch Explore here", and the table at LOOPS.md:27 says "on demand". Fix: "Trigger: on demand only (no Step 2 rule; rule 8)".
- **NI-4, ROADMAP.md:148.** The activation rule names "393.10 reports a loop-doctor mean of at least 3.0", but ROADMAP.md:138, O3's cell at :373 and RESUME.md:44 name 398.5. Fix (the owner's edit): "393.10, or its one retry 398.5, reports …".
- **NI-5, ROADMAP.md:4797-4800.** The only open half of 375.11 is "STILL OPEN — Firefox … Needs another machine", and the item has no marker. STATUS.md:7 still computes it as "oldest dispatchable: 375.11". RESUME.md:82-83 calls it blocked, and LOOPS.md:789 says "An item that is blocked must carry a marker". Once M0 ends, rule 4 (and M1's defect interleave) would pick an item this machine cannot finish. Fix: add an own-line `NEEDS-RUNTIME`, or split the Firefox half into its own item carrying that marker.
- **N6 residual, `.roundtable/DISPATCHER:4`.** Fix: "a cloud session that runs the guard stops at Step 0; a revived stale session does not run it (LOOPS.md Step 0)".
- **Counted, but not new: 398.3** (open, parked). The loop wrote Precedence, Rules-2-3, Planner and Direction-drift into the owner's field block (`git blame` gives c8d2ccb7, a loop triage commit). O11, O12, O14 and O16 are still `___` at ROADMAP.md:373. `milestone.py` still prints only "unfilled: App, Modules, Devices, Tiers, Budget", so it counts the loop's own values as owner decisions. That is a gate precondition the loop has satisfied for itself.

**Scores (reason first, Invalids counted, then the number)**

1. **Correctness.** References resolve, as re-scanned under N5. There is no terminal sentinel, and HALT is absent. Guard and in-flight exits match their documented meaning apart from R4, which fails loudly. The M0 cap is 13 in the field block, O3's cell, RESUME and LOOPS rule 4. One Invalid: the N6 residual at DISPATCHER:4. **Ceiling 2, score 2.**
2. **Safety.**
   - What works: the cloud routine is disabled (`enabled:false`, confirmed via RemoteTrigger). Kill switch and one-dispatcher guard: the guard's self-test passes 6 cases, and a `--no-fetch` run printed "ok". Owner items are escalated asynchronously in RESUME Direction.
   - One Invalid: 398.3's self-filled owner fields.
   - Risks:
     - R1: the pause and cap are prose only.
     - R2 and R3: heading drift reads "nothing in flight"; `started` and `cap` are unbounded.
     - R5: DISPATCHER names a checkout, not a session (LOOPS.md:241-243).
     - R9: on page 1 of list_runs, 8 of 10 sessions are still status "active". The newest last_event is 2026-09-25T05:20:50Z, before O1.
     - The agents/wake and workflow-wall budgets read OWNER.

   **Ceiling 2, score 2.**
3. **Reliability.**
   - What works: commit per item, an append-only log, the recorder refusing a log it cannot parse, and rebuildable mirrors.
   - One Invalid: NI-5, since the computed pick is a blocked item.
   - Risks:
     - Rule 6 is always true, so rules 7-8 are unreachable (LOOPS.md:980-989, 1596-1607, accepted by the owner in 176.3).
     - There is no no-progress or repeat-failure stop outside M1's dormant Stop field.
     - R3: `started`/`cap` accept values that hold a wake indefinitely.

   **Ceiling 2, score 2.**
4. **Cost.**
   - The wake prompt mandates reading LOOPS.md (2,318 lines) and ROADMAP.md (10,465 lines) fresh. roadmap_scope gives 104 open and 87 closed items, and a closed-history share of 1222/10465 = 11.7%, so the size is open work. The archive trigger (249.12) is an owner call.
   - ENVIRONMENT.md (992 lines) is read every wake with no archive rule. About 525 of those lines sit under headings about the cloud container, which can no longer dispatch. That estimate goes by headings only.
   - RESUME is bounded at 120 lines and charter-checked: good.
   - There is no agents-per-wake or wall-time cap.
   - Three Risks, no Invalid. **Score 3.**
5. **Maintainability.**
   - Four Invalids: NI-1, NI-2, NI-3 and NI-4 (copies that disagree, or a superseded fact still stated as current).
   - Plus R8, the loaded CLAUDE.md being stale.

   **Ceiling 1, score 1.**
6. **Understandability.**
   - Resume is separate from history (resume-history.md), and every file has a stated role.
   - Risks:
     - One tick is hard to draw: the dispatch region is 7,775 words by the metric, mixed with forensics.
     - Who owns "done" is answered in three places: CLAUDE.md's quality bar, LOOPS.md:1133 and LOOPS.md:2248.
     - The M0 exception that pauses rules 2 and 3 is written under rule 4, below the rules it pauses.

   **Score 3.**
7. **Observability.**
   - What works: closed vocabularies enforced (check-loop-vocab: "passed — … 6 outcomes and the 10 loop names"). One row per item, written after the commit. `generate_status.py --check` prints "STATUS.md is current". Counters, holds (1 row) and route telemetry.
   - Risks:
     - Rule 5 is STALE, and 43 of 51 metric names have a sample on one day only.
     - A stopped wake (guard exit or inflight exit 5) writes nothing, so repeated stops are invisible in state.
     - Row stamps are not chronological; this is accepted in 164.2.

   **Score 3.**
8. **Purpose.**
   - What works: the Objective exists and is named in triage (LOOPS.md:494). Git history shows no Objective edit since 08-23; c8d2ccb7 only inserted below it. Rule 3's periodic review is checked by code for the thesis shape. M1 has a goal-level Done-test and a one-way-door stop.
   - Risks:
     - The re-plan rung (rule D) exists only while a milestone is ACTIVE. Otherwise the ladder is Polish forever.
     - Items do not record the Objective clause they serve.
     - "Intent read-only" cannot be enforced: the loop commits as the owner.

   **Score 3.**

Mean = (2 + 2 + 2 + 3 + 1 + 3 + 3 + 3) / 8 = 19 / 8 = **2.375**, label TREAT.

**Verdict against the activation rule: FAIL.** The mean is 2.375, below 3.0, and Maintainability is at 1.

**RECEIPT**

What I read:
- The skill's SKILL.md, scorecard.md, checklist.md and tick-model.md.
- In full: LOOPS.md and RESUME.md.
- In part: CLAUDE.md (lines 55-100 plus greps), ROADMAP.md (1-375, 562-617, 767-831, and the item lines of 375.11), ENVIRONMENT.md (headings, 1-20, 321-368, 593-607, 686-700), and the first screen of STATUS.md.
- `.roundtable/DISPATCHER`, `inflight.py`, `step0_guard.py`, and the last screen of the loop log.
- The context file `closes-on-head.txt`.

What I ran:
- `inventory.mjs`.
- `inflight.py --self-test` and `inflight.py status`, plus 17 probes on the scratch copy.
- `step0_guard.py --self-test` and `step0_guard.py --no-fetch`.
- `dispatch_status.py`, and `dispatch_status.py --self-test`.
- `milestone.py`, and `milestone.py --self-test`.
- `generate_status.py --check`.
- `roadmap_scope.py`.
- `check-resume-charter.mjs` and `check-loop-vocab.mjs`.
- RemoteTrigger `get` and `list_runs` (page 1 only, read-only).
- A path scanner under scorer-A/, plus git log, blame and grep.

Nothing I scored came from the forbidden files, but a few lines reached me:
- The loop-log tail I read showed the 393.10 row: "(2.375; Correctness 1, Maintainability 1)".
- The heading of Slice 398 shows "(2.375, FAIL)".
- One repo-wide git grep printed 3 lines of `.roundtable/loop-doctor-rescore-2026-09-26.md` and 2 lines of `owner-recs-2026-09-26.md`, all about N2's wording at an old line number.

All of that happened before I scored, and I did not open either file.

I edited, created, committed and deleted nothing in the repo. `git status` shows only the pre-existing modification to `.roundtable/RESUME.md` (the in-flight line). The only side effect is Python import caches under `scripts/loops/__pycache__`, which git ignores. My scratch files are:
- `/private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/398.5/scorer-A/loop-inventory.json`
- `/private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/398.5/scorer-A/refscan.py`
- `/private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/398.5/scorer-A/inflight-sandbox/`

---

## Scorer B (variance check)

SCORER B: LOOP-DOCTOR RE-SCORE (busy-office:loop-doctor 0.9.4) at HEAD b07ff571

Verdict: FAIL. The mean is 2.375, below 3.0, and Correctness and Maintainability are both at 1. The label is TREAT.

Disclosure before the scores: before I scored, I saw the earlier result ("2.375; Correctness 1, Maintainability 1"). It is in the Slice 398 heading, which I was allowed to read, and in the last lines of the loop log, which I read to count M0 wakes. My mean and my two dimensions at 1 match that result. The Invalid findings behind them are different ones: B1, B2, B4, B5 and S1 below, not N1-N7. Knowing the earlier score can only pull a scorer toward it, so treat the agreement as weak evidence. I read 398.1's DONE note only after my scores were written, and only to confirm which files each N concerns.

How I classified: an Invalid means the loop does not do what its files say. One Invalid caps a dimension at 2, and two or more cap it at 1.

DIMENSIONS (reason first, then score)

1. Correctness
Reason: two Invalids.
- B5: the milestone prompt says it lives at `.roundtable/milestone-m1-prompt.md` (`.roundtable/milestone-draft-2026-09-25/4-prompt.md:5`). Its M1 `/loop` line tells every wake to read that file (line 20). The file does not exist (`test -e` says MISSING). LOOPS.md:670 names this prompt as rule M's full statement.
- B4: `.roundtable/DISPATCHER:4` says "A cloud session is never this checkout, so it stops at Step 0." That is the N6 overclaim again. LOOPS.md:77-79 itself says a revived stale session has no guard.
What passes: no tripped sentinels (inventory `sentinels: []`), and the guard self-test passes 6 of 6. A scan of LOOPS, CLAUDE, RESUME, STATUS, ENVIRONMENT and ROADMAP.md:1-2757 found no other dead path presented as existing.
Minor exit-code risks: a non-UTF-8 RESUME.md makes `inflight.py` crash with exit 1, which Step 0 does not define. LOOPS.md:104 says a `started` that is "not a UTC time" gives exit 5, but the code accepts `+08:00`. The arithmetic is still correct, so this is harmless.
Score: 1

2. Safety
Reason: one Invalid.
- S1, no self-approval guard: ROADMAP.md:139-140 says "The loop reads it and never edits it." But the loop wrote the owner's section twice as a scribe (commits c8d2ccb7 and 0ab92652). It filled Precedence, Rules-2-3, Planner and Direction-drift (ROADMAP.md:157-162) while their owner decisions O11, O12, O14 and O16 are blank (`___` at ROADMAP.md:373). Item 398.3 is still open.
- Nothing prevents the loop from writing `Status: ACTIVE`. milestone.py:133 accepts it from any writer, and loop commits carry the owner's identity: 184 of the last 200 commits are "ThePFMind".
What works: the kill switch (`.roundtable/HALT`, guard exit 3, self-test) and the escalation channel (RESUME Direction, PushNotification).
Risks:
- The routine is disabled, but its sessions are still present. RESUME.md:54 says "302 of 307 sessions … still active". I did not re-measure this; the third agent lists them.
- The overlap guard fails open on a renamed heading (in-flight check below).
- The m0-wakes cap is counted in prose. No code counts it; `grep m0-wakes` finds only the parser and fixtures.
- agents/wake and workflow-wall are still OWNER.
Score: 2

3. Reliability
Reason: no Invalid; three Risks.
- Rule 8 (halt) cannot be reached, because rule 6 is always true (LOOPS.md:1596-1602; the owner accepted this as 176.3).
- The two-wakes-no-progress stop exists only when ACTIVE (Stop field). Outside it, M0 has no coded no-progress stop.
- A `started` time in the future holds forever. Scratch test: exit 3, "IN FLIGHT -525456/60 min".
What is sound: a commit per round, and the recorder reads rows back after writing.
Score: 3

4. Cost
Reason: no Invalid; Risks only.
- ROADMAP.md is 10,465 lines. It was 6,786 at 53ffa54f (2026-09-25 02:49) and is 10,465 at b07ff571: +3,679 lines in about 31 hours. `roadmap_scope.py`: 104 open items, 11.7% closed history.
- LOOPS.md is 2,318 lines.
- The wake prompt says "Read `LOOPS.md` and `ROADMAP.md` fresh" (LOOPS.md:49-50).
- The archive sweep has no threshold; 249.12 is an open owner call. agents/wake is not set.
Score: 3

5. Maintainability
Reason: two Invalids, both statements that the O3 extension (0ab92652) superseded but did not update.
- B1: generate_status.py:636-637 prints "overrides it until 393.10 closes" into STATUS.md:9 at HEAD. The override actually ends at 398.5 (ROADMAP.md:373, LOOPS.md:883-886).
- B2: the activation rule at ROADMAP.md:148 reads "393.10 reports a loop-doctor mean of at least 3.0". 393.10 is closed at 2.375, so the rule as written can never be met, while 398.5's Accept (ROADMAP.md:814-815) asks the owner to activate on PASS.
Risks:
- The running dispatcher session (pid 33060, lock session 1dbfe40a, started 2026-09-24) holds an old CLAUDE.md in context. My own injected copy contains "(P0 bug > build > tidy > explore > grill)". `git show HEAD:CLAUDE.md | grep -c "P0 bug"` gives 0; `git show 08ca48f0^:CLAUDE.md` has it at line 64.
- LOOPS.md:2292 still opens with "No longer session-scoped", which is false under O1.
Score: 1

6. Understandability
Reason: no Invalid; three Risks.
- "Who owns done" has three answers: LOOPS.md:1133 says "`verifier` on the staged diff", routes.json build says "critic: J2 (Jev rubric 2 completion review)", and commits show "Adversarial verification … and a critic" plus J2.
- The pause of rules 2 and 3 is written under rule 4 (LOOPS.md:879-886), below the rules it pauses, while Step 2 is evaluated top to bottom.
- A 2,318-line playbook mixes incident history into the dispatch rules.
What is sound: resume and history are separate (RESUME.md is 86 lines; history is in resume-history.md), and the tick can be drawn from the files.
Score: 3

7. Observability
Reason: no Invalid; Risks.
What works: the outcome vocabulary is closed (check:loop-vocab passes, per closes-on-head), and each wake is recorded after its commit with a read-back. dispatch_status prints the counters and the holds ("Holds 1 hold-wake(s) recorded").
Risks:
- Rule 5's input is STALE: "8 of 51 name(s) paired across days".
- Owner commits and loop commits cannot be told apart by author.
- dispatch_status says "the dispatcher should pick it" for the paused rules.
Score: 3

8. Purpose
Reason: no Invalid; two Risks.
What works: the intent (ROADMAP ## Objective) is named in loaded rules (CLAUDE.md:141-143, LOOPS.md:494-497). There is a periodic objective review (rule 3, with a thesis-shape reset per 392.4) and a goal-level done-test (ROADMAP.md:309-337). Sharpness: 93 of 104 open items (89%) name an Accept; 0 have a judgement-worded title with no Accept.
Risks:
- The lower rungs of the empty-queue ladder are unreachable (Research has 0 rows).
- The M1 prompt's Stops section says a one-way door stops the dispatcher and "does not continue", then says it is "logged … and worked around" (4-prompt.md:642-655). The prompt is still DRAFT.
Score: 3

MEAN: (1 + 2 + 3 + 3 + 1 + 3 + 3 + 3) / 8 = 19 / 8 = 2.375, label TREAT.

How sensitive the verdict is to my borderline calls: if B4 and B2 were Risks rather than Invalids, the mean would be 21/8 = 2.625, still FAIL on the mean. To pass, several of the 3s would also have to be 4s.

RE-CHECKS N1-N7

N1, the hand-off's next rule: no longer Invalid as stated.
- RESUME.md:38-46: "The one standing GOAL — the owner's M0 retry (O3's cell …) … rules 2 and 3 paused until 398.5; cap 13 … Used: 12 of 13 … Next: `398.5` … Rules 2 and 3 print OVERDUE and stay paused."
- This agrees with O3's cell (ROADMAP.md:373: "one retry, 398.1 → 398.2 → re-score 398.5; rules 2 and 3 paused until 398.5; cap 13") and with LOOPS.md:879-886, the one standing exception.
- `dispatch_status.py` (exit 0): "Standardize 16 / 4 … OVERDUE", "Objective 4 / 3 slices … OVERDUE [375, 392, 393, 398]", "-> … the dispatcher should pick it". The hand-off names this and overrides it.
- "12 of 13" checked: 12 distinct loop-log timestamps of Continue rows for 393.x and 398.x.
- What is left: STATUS.md:9 still says the override ends "until 393.10 closes" (new Invalid B1). dispatch_status does not know about the pause (Risk).

N2, "hourly cloud routine dispatches" presented as current: closed. LOOPS.md:2294-2298 now reads, in the past tense: "from then an hourly cloud routine dispatched … with collisions accepted. **Reversed by the owner on 2026-09-25 (O1)**". The Step 0c heading (LOOPS.md:225) marks the old decision as "kept below as the record". A `git grep` over live files finds no statement that presents it as current.

N3, the in-progress override in Continue's Input: closed. LOOPS.md:1068-1072: "`RESUME.md`'s In flight section is not an override (retired by 393.4); a workflow in flight is a hold at Step 0." The old text at LOOPS.md:865-868 is struck through.

N4, CLAUDE.md restating the dispatch order: closed at HEAD. CLAUDE.md:63-64: "chosen per wake by the dispatcher's rules in `LOOPS.md` Step 2 (not restated here: restatements drift)." What is left is a Risk: the running session still carries the old text (see Maintainability).

N5, dead citations: closed in ROADMAP.md, still open in the milestone prompt.
- `test -e` resolves `.roundtable/milestone-draft-2026-09-25/4-prompt.md`, `…/1-grill-report.md` and `.roundtable/grill-kev-in-the-loop-2026-09-21.md`. The bare filename at ROADMAP.md:1574 resolves by basename.
- The old paths are gone from ROADMAP.md. But `.roundtable/milestone-m1-prompt.md` is still the prompt's stated home (4-prompt.md:5) and the file its M1 `/loop` line reads (4-prompt.md:20), and it is MISSING (new Invalid B5).
- 4-prompt.md:101 (step P5) still names the MISSING `.roundtable/grill-milestone-m1-2026-09-25.md`.
- Every other unresolved hit in my scan is a generated artefact (api.json, jobs.json), a future deliverable (the ADR, queue_screen.json) or described as absent (gauntlet-a, check-boost.mjs).

N6, the guard's claims: closed in the two named places.
- LOOPS.md:77-79: "a revived stale session runs its own older copy of this file, which has no guard, so **the owner's archive … is the prevention and exit 5 below is the backstop**". step0_guard.py:16-20 says the same.
- Self-test: "6 cases … behave". Exit 5 can fire on a cloud push: cloud commits are authored "Claude <noreply@anthropic.com>" (16 of the last 200, +0000), which is not the DISPATCHER author.
- The same overclaim survives at `.roundtable/DISPATCHER:4` (new Invalid B4).

N7, the Objective trigger: closed. The loop table (LOOPS.md:28, "rule 3's counter (3 slices named since the last reset)"), rule 3 (LOOPS.md:530-533), §6 Trigger (LOOPS.md:1668-1669) and dispatch_status ("4 / 3 slices") all agree.

IN-FLIGHT CHECK

On the real repo:
- `python3 scripts/loops/inflight.py --self-test`: "inflight --self-test: 25 cases behave (… 398.2: the five malformed lines, two lines, bad started, hold/open/close over an unparsed line, a missing RESUME.md, the root)", exit 0.
- `python3 scripts/loops/inflight.py status`: "inflight: IN FLIGHT 2/90 min — hold (dispatch nothing): wf=rescore-398.5 item=398.5 …", exit 3 (this re-score's own line).

On a scratch copy (scorer-B/fake/), running `status`:

| Input | Exit | Verdict |
|---|---|---|
| tab between fields, 2-space indent, `> ` prefix, line inside a code fence, `<!-- none -->` | 5 | good |
| CRLF line endings | 3 | good |
| cap=0 | 4 | good |
| RESUME.md is a directory | 5 | good |
| heading renamed `## In flight — live`, `## In Flight`, `### In flight`, or two headings with the line under the second | 0, "inflight: nothing in flight" with a live line present | fails open (Risk) |
| non-UTF-8 byte, or a UTF-16 file | 1, "UnicodeDecodeError …" | exit not defined in Step 0 (Risk) |
| `started=…+08:00` | 3 | accepted, although LOOPS.md:104 says non-UTC is exit 5 (doc/code mismatch, harmless) |
| `started` one year ahead | 3, "-525456/60 min" | holds forever (Risk) |

Fix: `current()` should return exit 5 when it finds any heading matching `^#+\s*in[ -]?flight` other than exactly one `## In flight`, and it should catch UnicodeDecodeError. Exit 3 should require `started` to be no later than now.

NEW INVALID FINDINGS (file:line, then a one-line fix)

- B1: `scripts/loops/generate_status.py:636-637`, shown at STATUS.md:9, says "overrides it until 393.10 closes".
  Fix: take the end item from O3 (398.5) or name it, then regenerate STATUS.md.
- B2: `ROADMAP.md:148`, "393.10 reports a loop-doctor mean of at least 3.0". This is the owner's section.
  Fix: change it to "398.5 (the retry's re-score, O3) reports …".
- B4: `.roundtable/DISPATCHER:4`, "so it stops at Step 0".
  Fix: "a cloud session running the current Step 0 stops here; a revived stale session does not. The owner's archive is the prevention; exit 5 is the backstop."
- B5: `.roundtable/milestone-draft-2026-09-25/4-prompt.md:5,20` (and :101) point to missing files.
  Fix: change lines 5 and 20 to `.roundtable/milestone-draft-2026-09-25/4-prompt.md` (or put the file where they point) before ACTIVE; fix :101 to the grill report's real path, `…/1-grill-report.md`.
- S1: `ROADMAP.md:139-140` against loop-written fields at :157-162 while :373 is blank, and milestone.py:133 accepts `Status: ACTIVE` from any writer.
  Fix: commit loop work under a distinct git author, have milestone.py refuse an ACTIVE Status line whose blame author is the loop's, and close 398.3.

VERDICT AGAINST THE ACTIVATION RULE (mean at least 3.0 and no dimension at 1): FAIL. The mean is 2.375, and Correctness (1) and Maintainability (1) fail the rule.

RECEIPT

Commands I ran:
- `node inventory.mjs` (skill script, output to scratch)
- `inflight.py --self-test` and `inflight.py status`
- `step0_guard.py --self-test` and `step0_guard.py --no-fetch` (no fetch, so remote refs were not touched)
- `dispatch_status.py` and `dispatch_status.py --self-test`
- `milestone.py` (report only)
- `generate_status.py --check`
- `roadmap_scope.py` (report)
- git log, show, blame, grep and ls-files; `ps`; `test -e`
- my own reference scan and sharpness scan (Python, run from scratch)
- the malformed-line tests on a scratch copy

Files read:
- in full: LOOPS.md, CLAUDE.md, RESUME.md, inflight.py, step0_guard.py, DISPATCHER, the memory note, the loop-doctor SKILL, scorecard, checklist and tick-model
- in part: ROADMAP.md 1-375, 562-585, 766-832 (585-640 after scoring); STATUS.md 1-120; 4-prompt.md 1-24, 96-104, 640-660; the last 22 lines of loop-log.md; generate_status.py 630-640
- no state file was read whole
- not opened: loop-doctor-rescore-2026-09-26.md, owner-recs-2026-09-26.md, the 393.10 and 398.2 DONE notes, and scorer-A's folder

Not done by me: the RemoteTrigger listing of cloud sessions (the third agent's task).

Limits of the measurements:
- The reference scan covers only backticked tokens with a file extension. It skips directories, paths not in backticks, ROADMAP.md past line 2757, the archives and dated reports.
- Sharpness counts whether an item has an Accept, not whether the Accept is good.
- The M0 count covers only Continue rows for 393.x and 398.x.

I edited, created, committed and deleted nothing in the repo. `git status --short` shows only ` M .roundtable/RESUME.md`, the in-flight line that was already there.

Scratch files are in /private/tmp/claude-501/-Users-thepfmind-Projects-busy-office-ui/1dbfe40a-17f6-4a1d-a447-12cd87bce187/scratchpad/398.5/scorer-B/:
- loop-inventory.json
- dispatch_status.txt
- refscan.py
- roadmap-head.md
- fake/ (the scratch copy of inflight.py with a test RESUME.md)

---

## Cloud sessions (read-only listing)

Counts
- Pages read: 31 (30 pages of 10 sessions, then a last page of 7; the last page had next_cursor null)
- Total sessions: 307
- Active: 302
- Archived: 5 (cse_011zvhzRhmdFRNtRKi4vE91H, cse_01DULHxzi8LCdQdZ3zEuPJNQ, cse_01Bs8fBtaxY5xxEERHELc2cV, cse_01HWtKwTutQVNyMg1XTuK8jf, cse_01UFArCbeEc3amH7eQhNuASw)
- Other: 0
- How I counted: I read each page's status field and tallied by hand; I did not run a script over the data. Check: the oldest session was created 2026-08-27T17:27:58Z and the last fire was 2026-09-09T12:31Z. That is about 307 hourly slots, which matches the 307 sessions.
- Sessions with activity in the last 24 hours: 2
- Newest activity across all sessions: 2026-09-25T05:20:50.484566Z (cse_01WUJ1KgzH6GM17XffvmjG27)

Activity field used: `last_event_at` from each list_runs row. Now was 2026-09-26T02:18:21Z (10:18 local, +08), so the 24-hour cutoff was 2026-09-25T02:18:21Z.

Trigger trig_019aw8tDjiYxC3ejSFd5wYZY ("⚡ Busy Office UI loop wake")
- enabled: false
- cron: `27 * * * *` (hourly at :27), model claude-opus-5
- last_fired_at: 2026-09-09T12:31:19.449474Z
- next_run_at: 2026-09-09T13:27:00Z. This time has already passed. It stopped moving because the trigger is disabled, so it will not fire at that time.
- last_run: status ROUTINE_RUN_STATUS_FAILED, session cse_01DULHxzi8LCdQdZ3zEuPJNQ, fired 2026-09-09T12:31:19Z, finished 2026-09-09T13:11:21Z
- trigger updated_at: 2026-09-09T12:54:44Z (created 2026-08-27T16:27:41Z)

Sessions with last_event_at within 24 hours of now
1. cse_01WUJ1KgzH6GM17XffvmjG27: status active, worker_status idle, last_event_at 2026-09-25T05:20:50.484566Z, created 2026-09-09T03:27:46Z
2. cse_019nfzicjq4bU6iFkDSnTq9d: status active, worker_status idle, last_event_at 2026-09-25T04:36:33.217904Z, created 2026-09-09T11:28:33Z

Both of these were created by the trigger on 2026-09-09 and then had activity again on 2026-09-25. The trigger has been disabled since 09-09, so it did not fire them again. Something else resumed them, probably manual use. No session has an event after 2026-09-25T05:20:50Z, and no session is currently running: both recent ones are idle.

Every other session's last_event_at is 2026-09-09T23:25:29Z or earlier. The list comes back most-recently-active first, and the third row of page 1 was already at that date.

Only get and list_runs were called. No trigger or repository was changed.