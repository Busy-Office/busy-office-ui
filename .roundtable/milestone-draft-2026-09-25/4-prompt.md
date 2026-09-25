# Milestone M1 wake addendum: layouts and components for a long-use ERP app

**Status:** DRAFT for owner review, round 2 (2026-09-25), with the completeness critic's fixes applied.

**Where it lives:** `.roundtable/milestone-m1-prompt.md`. The owner or the committer puts it there when committing the realignment.

**When it applies:**
- §2 and §3 apply from the owner's bootstrap GOAL onwards.
- Everything else applies only while `## Milestone M1` in ROADMAP.md reads `Status: ACTIVE`.

**How it relates to LOOPS.md:** it adds to LOOPS.md and does not restate it. Where the two conflict:
1. The wake stops.
2. It logs the conflict as an owner-decision item.
3. It follows LOOPS.md until the owner answers.

**Owner values:** a value marked **OWNER** comes from the Milestone section. If it is blank, the step that needs it does not run.

**The `/loop` line** (after 393.8 has made one canonical wake prompt):

`/loop Follow the wake prompt at the top of LOOPS.md. Milestone M1: read ROADMAP.md "## Milestone M1" and .roundtable/milestone-m1-prompt.md §4.`

---

## 0. Words with one meaning each

| Word | Meaning here | Never |
|---|---|---|
| **shape** | One distinct interaction or screen structure, e.g. `list-report`, `settings-admin`, `goods-receipt`. | A module or a department |
| **pattern** | A shape documented at `/patterns/<id>`, with its id in `patterns.json`. | Named for a module (394.1) |
| **layout** | A screen built from a pattern in the reference app, or the app frame. | Shipped CSS |
| **module** | A functional area, e.g. Finance or Distribution. The closed list is in `## Milestone M1` (394.2). | Part of a published name |
| **job** | What a user does, written as a verb-object id (`receive-against-order`). Job ids live in the job index. | A pattern id |
| **job index** | `apps/docs/src/data/jobs.json`, generated from the pattern pages' Jobs tables and the screen headers (394.9), and exported as `@busy-office/ui/jobs`. | Hand-edited |
| **worked screen** | A `*.screen.mjs` in `examples/erp-suite/<module-id>/` whose header names its `@pattern` and `@job`. | A pattern page |
| **experimental** | The tier for a part that exists but has not yet passed admission. This is the owner's "preview" flag; the word itself is owner decision O7. It is declared as `@status experimental` in the part's registration header (CSS), and in the behaviour's header when the part has JS (§9.3). | "preview" (123 existing meanings) or "init" (26 `init*()` functions) |
| **placeholder** | A labelled region carrying `data-bo-gap="<need-slug>"`. It stands in for a missing piece. | `bo-skeleton`, `aria-busy` |
| **need** | One missing piece, keyed by its `data-bo-gap` slug. Its ledger entry lists every use (site, job, pattern) ever recorded against it. | A GAP number allocated as max+1 |
| **brief** | A module's sourced practitioner brief, written by the `research` route at `.roundtable/brief-<module-id>-<date>.md`. | A 112.3 pilot brief (owner-only, `.roundtable/pilot-112/`) |
| **route** | The id on an item's `Route:` line. It names an entry in `scripts/loops/routes.json`: loop/mode, model tier, effort, skills, critic. | Chosen by Jev |
| **track** | `Track: defect` marks a shipped-defect item that the interleave serves. | "lane", which already means a Standardize sweep lane |
| **dispatcher** | The one local `/loop` session named by O1. | A second session |
| **committer** | The dispatcher. It is the only process that writes shared files. | A subagent |
| **planner** | A fresh-context subagent on the `planner` route (§7). It writes ROADMAP items. | A builder |
| **J1, J2, JQ** | The three Jev points (§6). | Anything else Jev is asked |
| **item lint** | The tier-0 code check in `milestone.py` (393.7). An item fails it if it has no Accept, if its Accept names no instrument, or if its `Route:` is missing or unknown. | A Jev question |

---

## 1. Who does what

Every verb in this file has one of these actors.

| Actor | Does | Never |
|---|---|---|
| **Owner** | Fills the Milestone fields; answers O1-O18; sets `Status`; closes OWNER items; archives sessions; publishes; promotes JQ. | — |
| **Dispatcher** (the one local `/loop` session) | Runs Step 0-2. Launches at most one Workflow at a time. Launches subagents on the route an item names. Makes every Jev call. Allocates slice and item numbers after a fetch. Writes every shared file. Runs the gates and the `:8081` visual checks one at a time. Commits each item and pushes once per wake. | Lets another process write a shared file; judges an order that code can compute |
| **Code** (`scripts/loops/*.py`, the generators, the gates) | Parses markers. Counts. Reconciles against raw source. Resolves `After:` lines. Picks the rule and the item. Applies the rules to Jev's probabilities. Fails loudly. | Judges quality or direction |
| **Planner** (subagent, `planner` route) | Sharpens one item, or writes the direction for the milestone as ROADMAP items and owner-decision items (§7). | Builds; closes items; edits `## Objective` or `## Milestone` |
| **Executors** (subagents, or the dispatcher itself, per route) | Build to the Accept. Return files as data when running inside a fan-out. | Write a shared file during a fan-out; grade their own work |
| **Critics** (fresh-context subagents) | Run `/design-grill` against the built output and return `{refuted, reason}`. The default verdict is refuted. | See the author's reasoning |
| **Jev** (hosted at jev-ai.pro, `jev-latest`) | Answers the typed questions in §6 when the dispatcher asks them. | Selects, orders or closes an item; picks a route or model; calls a model; admits a part; decides PASS |
| **Workflow script** | Runs the stages of one item that need no shared write (§8), and returns data. A module item uses several Workflow runs, with dispatcher integration between them. | Calls Jev; writes shared files |

**No agent wakes another agent.** "Call back" has only two meanings:
- **Inside one Workflow run:** the next stage.
- **Across wakes:** code releasing an item once every `After:` target has closed. Rule M or rule 4 then picks it up.

---

## 2. Before anything runs: owner preconditions and the bootstrap

**P1. One committer.**
- The owner answers O1.
- The owner archives every active session of routine `trig_019aw8t…` on every page of `list_runs`.
- Check: `RemoteTrigger list_runs`, paged to the end, shows no active session outside the chosen topology.

**P2. The working tree is decided.**
- The owner answers O2 for each of these:
  - the 09-20 erp-suite checkpoint;
  - `scripts/loops/review_depth_gate.*`;
  - the three untracked `.roundtable/grill-*` files;
  - `.claude/skills/hallmark`;
  - `.agents/`;
  - `skills-lock.json`;
  - the modified `.gitignore` and `package.json`.
- Check: `git status --porcelain` (the whole tree, not a path list) prints nothing, or prints only paths that RESUME.md `Uncommitted` names as deliberately left out, each with the owner's reason. A path list would miss `.agents/`, `skills-lock.json`, `.claude/skills/hallmark` and the three grill files, which are all untracked today.
- If the owner discards `.roundtable/grill-kev-in-the-loop-2026-09-21.md`, §6 JQ's citation of its reopen conditions moves to the owner's O13 answer.

**P3. Nothing is in flight.**
- The 375.11 workflow has either finished or been stopped.
- Its row is in `.roundtable/loop-log.md`.
- RESUME.md `## In flight` is empty.

**P4. A fresh session.** The session that ran the 09-25 grill carries about 770K tokens per turn, so it is not reused.

**P5. The realignment is committed.**
- The owner or committer commits these together:
  - the five slices in `realigned_roadmap`, pasted above Slice 392;
  - `## Milestone M1`, below `## Objective`;
  - this file;
  - the grill report, at `.roundtable/grill-milestone-m1-2026-09-25.md`;
  - the scratch artefacts the roadmap cites as specs or reconcilers, under `.roundtable/milestone-m1-2026-09-25/`: `marker_check.mjs` (394.5's spec), `queue_screen.gate.json` and the pilot results (394.14), `blocked_audit.py` (393.3), `classify_r2.py` (the critic's version, which moves 377.4 to the defect track), `lint_roadmap.py` (the critic's version, whose red-proof injections match one anchored item line and fail loudly on a miss) and `simulate_rule_m.py` (393.4, 393.9), and the seat-A name scanner (396.1). Scratch paths under `/private/tmp` do not survive the session, so the roadmap cites the committed copies.
- Before pasting, the numbers are re-checked with `git fetch origin main && git log HEAD..origin/main --oneline`.
- The commit is recorded: `record_iteration.py --loop Roadmap --mode plan --item "M1 realignment — slices 393-397 and ## Milestone M1" --outcome landed`.

**B0. The bootstrap GOAL.** The owner writes this block into RESUME.md, answering O3:

```
GOAL (owner, <date>): clear 393.1-393.10 in the order their After: lines give; rule 1 (an open P0)
still preempts; rules 2 and 3 are paused until 393.10 closes [OWNER: yes/no]; stop after 393.10 and
notify. Do not dispatch any item numbered 394 or above. At most <m0-wakes> wakes.
```

This is the last use of the prose GOAL mechanism. 393.4 retires it.

---

## 3. Phase 0: Slice 393 (M0), loop readiness

**Inclusion test.** An item belongs in M0 only if, without it, the first unattended milestone wake would do one of these:
- pick the wrong item;
- collide with another writer;
- hide its own state;
- spend without bound.

A loop-machinery finding raised during M0 is not added to M0. The dispatcher files it with `Parked: M1 — <reason> — revisit: <trigger>`.

**Order.** The dispatcher runs the items in the order the bootstrap GOAL and each item's `After:` lines give:

| Group | Items | Depends on |
|---|---|---|
| Independent | 393.1, 393.2, 393.3 | nothing |
| | 393.4 | 393.3 |
| In parallel after 393.4 | 393.5, 393.6, 393.8 | 393.4 (393.8 also needs 393.2) |
| | 393.7 | 393.6 |
| | 393.9 | 393.4 |
| | 393.10 | all of the above |

393.11 and 393.12 run after activation, under rule M. Every item that fans out waits on 393.12.

**Recording.** Each item is recorded as:

`--loop Continue --mode build --item "393.n — …"`

**Exit test.**
- 393.1-393.10 are closed, and each one's named commands were re-run on a clean HEAD worktree before the re-score (377.3's defect: 2 of 30 closes were false at HEAD; 393.11 builds the tool later).
- 393.10 quotes a loop-doctor mean of 3.0 or more, with no dimension at 1. The re-score runs in a fresh context that did not build 393.1-393.9, and it re-checks, each by its own command, the four Invalids the 09-25 score named: the self-contradicting hand-off, a design-grill resetting rule 3, two live dispatchers with no kill switch, and no in-flight rule.
- `python3 scripts/loops/milestone.py` parses the Milestone section with no blank, `OWNER` or unknown field.
- The dispatcher then sends a PushNotification.
- The owner sets `Status: ACTIVE <date>`.

If the re-score is below 3.0, the milestone stays DRAFT and the report names the failing dimension.

### Milestone status: every state has a gate

| State | Who sets it | Gate before it may be set |
|---|---|---|
| `DRAFT` | owner | — |
| `ACTIVE <date>` | owner | M0 exit test above |
| `PAUSED <date> <reason>` | owner, usually after a Stop (§12) | the Stop report exists in RESUME.md `Direction` |
| `CLOSED <date>` | owner | 397.2's Accept |

The loop never edits this line. `milestone.py` exits non-zero if more than one milestone is ACTIVE.

---

## 4. A wake while M1 is ACTIVE

### Step 0: code first, in this order

1. **HALT.** `test -e .roundtable/HALT`. If the file exists, the wake prints its first line and stops (393.1).
2. **In flight.** `python3 scripts/loops/inflight.py status` (393.2). Act on the state:

   | State | Gate | What the dispatcher does |
   |---|---|---|
   | no line | — | Continue with step 3. |
   | line under its cap, timer wake | `inflight.py status` exit 3 | **Hold.** Make at most 3 tool calls. Read and dispatch nothing. Record `record_metric.py --name hold-wakes --value 1 --unit wake`. Set no heartbeat shorter than the time left on the cap. |
   | line under its cap, owner chat input | same | Triage the input under LOOPS.md Step 1. Build a P0 in the main checkout. Workflow agents return data only, so the later fan-in rebases. |
   | line past its cap | `inflight.py status` exit 4 | TaskStop the workflow if this session can reach it. Keep the output at `out`. Record `--outcome logged`, naming what did not finish. `inflight.py close`. Continue with step 3. |
   | Workflow completion notification | — | **Integration wake.** Write files and registries, run the gates, run the `:8081` checks one at a time, run J2, commit each item, record, `inflight.py close`, push once. |

3. **Foreign commits.** `git fetch origin main`, then `git log HEAD..origin/main --format='%h %an %ai %s'`.
   - Any commit by a writer that O1's topology does not allow halts the wake before it writes anything.
   - The hand-off records the commit's sha.
   - The same check runs again immediately before the wake's first commit.
4. **Status.** `python3 scripts/loops/dispatch_status.py`. It prints the `milestone`, `rule M`, `interleave`, `skipped`, `blocked`, `direction`, `budget` and `reconcile` lines. A non-zero exit is a finding: the wake reports it and dispatches nothing.

### Step 1: triage new input (LOOPS.md Step 1, plus one test)

Every new ask is also tested against the 394.1 naming ADR. An ask to name a published thing after a module is rethought as "which shape does this job need?" and logged with the reason.

### Step 2: decide, top to bottom (393.4)

1. **Open P0** → Continue in bug mode. Unchanged, and never parked.
2. **Standardize counter**, depending on `Rules-2-3`:
   - `normal`: as today.
   - `scoped`: counts only rows tagged `--milestone M1`, and sweeps the paths those rows changed.
   - `suspended`: skipped; one sweep runs at 397.2.
3. **Objective counter**, depending on the same field:
   - `scoped`: arms only on M1 slices, and grades against the Done-test plus the thesis section of LOOPS.md's Objective playbook (its §6).
   - A design-grill does not reset it, as decided in 392.4.
4. **Rule M.**
   1. **Candidates.** Code takes open items tagged `Milestone: M1` that are:
      - not owner-blocked (an item whose `Route:` is `owner` is owner-blocked whatever its prose says);
      - not parked;
      - not browser-blocked (on a cloud wake);
      - dependency-free, meaning every `After:` target has closed.

      It picks the oldest, by slice number and then item number.

      **What oldest-first means for this milestone, measured** (`simulate_rule_m.py` over the pasted slices, red-proved on an injected `After:` cycle): every dispatchable earlier item runs first, so the frame (395.1) is dispatch #26, after the 12 M0 items and 13 Phase 1 build items (the experimental tier, the ledger, the job index and exports, the reference delta, Jev hygiene, the queue screen and the incubation recipe), assuming the owner closes 394.1-394.3 and 394.18 before ACTIVE. Items filed during the milestone (N.1-N.3, the planner's items) run after every module item that is dispatchable when they are filed. `After:` lines only hold items back; they never pull one forward. The one deliberate exception is 397.1: 396.5 waits on it, so the first need a module logs walks the lifecycle before the five-module fan-out.
   2. **Interleave.** If `Precedence: interleave 1/N track=defect`, and the log shows N−1 consecutive M1 dispatch rows since the last `Track: defect` row, this dispatch goes instead to the oldest dispatchable `Track: defect` item. If no `Track: defect` item is dispatchable, the dispatch goes to rule M's own pick, and the counter is not reset. Both counts are read from the loop-log rows, which is why 393.5 writes `--milestone` and `--track` into the row.

      If `Precedence: after <id>`, rule M sits below rule 4 until `<id>` closes.
   3. **Item lint** (code).
      - If the pick fails, the dispatcher runs rule D's `sharpen` on that item in this wake, and does not dispatch it.
   4. **JQ** (§6): one call on the picked item.
      - In shadow, the dispatcher prints one advisory line and proceeds.
      - In escalate-only (only if the owner chose it at 394.18), a `sharpen` answer sends the item to the planner (§7); every other answer is logged only.
      - In enforce mode (only after 394.16 promotes it), code turns the answer into `execute`, `sharpen` or `ask-owner`.
   5. **Dispatch** the item's `Route:` (§5).
5. **Rule D, the planner** (§7). Runs when `dispatch_status.py` prints `direction: DIRECTION GAP <trigger>`.
6. **Rule 4** over everything that is neither parked nor tagged M1.
   - If M1 still has open items but all of them are owner- or dependency-blocked, rule 4 is restricted to `Track: defect`.
   - In that case the wake names the blocking ids, and sends the owner one PushNotification per 24 h.
7. **Rules 5-8** as in LOOPS.md.

Every wake prints the `skipped:` line: the oldest dispatchable item outside M1 that this wake passed over.

### The read set

A milestone wake reads only these:
- the Milestone section;
- §4 of this file, plus the section for the route it dispatches;
- RESUME.md, which 393.8 keeps bounded;
- `.roundtable/ENVIRONMENT.md`, which LOOPS.md Step 0 requires and `check:resume-charter` keeps RESUME.md pointing at: the git/build traps (the symlinked `node_modules` that is not isolated, `CHROME_PATH`, the empty background-task output file). Dropping it would save words and re-open traps that were each paid for;
- `dispatch_status.py` output;
- the item itself and the files it names.

It does not read the whole of ROADMAP.md, which was 7,839 lines on 2026-09-25.

---

## 5. Routes: the roadmap names who does each item (owner answer 1)

`scripts/loops/routes.json` is written by hand and reviewed in a diff (393.6). Its first content is the table below.

- **Tiers** map to models through the Milestone `Tiers` field (O14).
- **A route whose tier the owner has not permitted** runs on `top`, and the telemetry records the substitution.
- **Jev never reads or writes a route.**

| Route | Loop / mode | Tier · effort | Skills and sources | Critic | Returns | Never | Hand-up |
|---|---|---|---|---|---|---|---|
| `build` | Continue / build | top · high | the item's named files; the CLAUDE.md component recipe; `npm run new:component` | J2 | the landed change, green gates | writes outside the item's paths | `planner`, when the Accept is wrong or the premise is false |
| `design` | Continue / layout | top · xhigh | `frontend-design`, `modern-web-guidance` (guidance only); `api.json` classes; the nearest worked screen's markup | 2 fresh critics running `/design-grill`, then flow mode | LAYOUT data (§8 stage 4) | writes CSS or inline styles; uses `bo-skeleton`; ships `hallmark` or `wireframe` output (critique only) | `planner` |
| `mechanical` | Continue / build | balanced · medium | the item's named files | J2 | the edit, with before and after counts | judges | `build` |
| `collect` | read-only gathering | fast · low | grep, the generators | — | data with counts | writes anything | `build` |
| `research` | Continue / brief | top · high | `research` or `anthropic-skills:deep-research`; NotebookLM notebook 89417194 as a lead only (O18); the finance and sales SKILL.md files read as checklists, **never run** (they drive connectors) | a fresh realism reviewer | BRIEF (§8 stage 1) | authors layouts; picks patterns | `planner` |
| `planner` | Roadmap / plan or direction | the `Planner` field · xhigh | `busy-office:requeue`, `busy-office:sharpen-intent`, `grilling`, `domain-modeling` | the item lint plus JQ in shadow (one bounce) | one `Roadmap · plan` commit (§7) | builds; closes items; edits `## Objective` or `## Milestone` | owner |
| `owner` | — | — | — | — | — | is dispatched | — |

**How a model is chosen.** The dispatcher launches the subagent with the model its route's tier maps to. If the harness cannot set a model per subagent, the subagent runs on the session model, and `--model` records the model actually used.

**Why the planner sits on `top`, and how that squares with jev-rubrics.md's escalation ladder.** The rubric file says "do not jump to the strongest model merely because Jev was uncertain" and caps escalation at two rounds. The planner is not reached because Jev was uncertain: code reaches it on a named trigger (§7), and setting direction is the rubric's own third rung, "complex or consequential". One bounce per item keeps the two-round cap.

**Routes for items the milestone files later.** Every filed item carries one `Route:` line, or the item lint refuses it:

| Item | Route |
|---|---|
| N.1 build and fill | `build` |
| N.2 second composition on a different pattern | `design` |
| N.3 "experimental `<name>`: admit or remove" | `build` (G1-G5 in §9.3; the critic is a fresh-context subagent plus J2) |
| Fill of a COMPOSED placeholder | `design` |
| Unresolved critic verdict after 3 rounds (§8 stage 6) | `design` |
| Owner-decision item | `owner` |

---

## 6. Jev: three declared points; code acts on the probabilities

### Contract

- **What Jev is.** A hosted, stateless typed classifier: `jev-latest`, which was jev-1.13.0 on 2026-09-25.
- **How the dispatcher calls it.**
  - J1 and J2 go through `jev_evaluate`.
  - JQ goes through `scripts/loops/queue_screen.py`, which makes direct HTTPS calls with an explicit User-Agent. This follows `review_depth_gate.py`. It avoids the MCP client, because there a connection error bypasses the `{"error"}` shape.
- **It is advisory.** CLAUDE.md: a failed check is FAIL whatever Jev says. An outage, or any missing, partial or non-JSON answer, is **UNVERIFIED** for J1 and J2, and `sharpen` for JQ. JQ changes what happens to an item only in the mode the owner set: escalate-only (394.18) or enforce (394.16). Before either is set, JQ is shadow.
- **What code reads.** Code reads `probabilities` and nothing else. It never reads `confidence` or `jev_route`'s `escalate`: confidence is rescaled by the number of options (0.96 came back as 0.94; 0.92 as 0.90 with 4 options).
- **Payload hygiene.**
  - No prior score, no hoped-for verdict, and no sentence framing the repo. One leading sentence has moved a score by 0.23, and one framing sentence moved `nothing_stated` from 0.56 to 0.24.
  - States are at most 1,500 characters.
  - Only what O13 allows leaves this machine.
- **Never inside a Workflow script.** Call Jev before or after a Workflow run, and pass the answer in as data. J1 on the alternatives a Workflow drafted (§8 stages 3 and 8) therefore runs at the integration wake, over the alternatives the run returned; since no J1 number decides anything, nothing is lost by asking after the run.
- **Do not use the installed `jev-*` skills as they stand.** Their wording is uncalibrated here.

### J1: deciding between drafted alternatives (Rubric 1)

- **When.** One of three situations, always at a dispatcher step, never inside a Workflow run:
  - (a) the mapper drafted two or more candidate patterns for a job (§8 stage 3);
  - (b) the triage agent drafted compose / experimental / refuse for a missing piece (§9.3);
  - (c) the planner drafted two or more directions (§7).
- **State.** Each alternative with the requirement it must meet, and the accepted decisions that apply, quoted: CLAUDE.md, the 394.1 ADR, and any refused-on-record match.
- **Question:**

  `{type: "choice", instructions: "Which drafted alternative should <subject> use?", criteria: {<alt-id>: "<one line>", …, "insufficient_evidence": "The supplied evidence does not distinguish them.", "ask_user": "This turns on a user preference, not a technical fact."}}`
- **Code rule:**

  | Top option | Action |
  |---|---|
  | `ask_user` | The dispatcher files an owner-decision item. |
  | `insufficient_evidence` | The drafter measures the missing fact, and J1 is asked once more. |
  | anything else | Log agreement or disagreement with the drafter, with the probabilities. |

  **Accepted decisions always win. No J1 number decides anything:** the wording is uncalibrated.

### J2: completion review before every `[x]` (Rubric 2)

- **When.** Once per landing round, after the checks have run. One batched call covers every claim that shares an evidence state.
- **State.** Each claim, plus its evidence: gate output lines, screenshot paths, marker counts, commit sha.
- **Question.** One `noul` per Accept property, with Rubric 2's instruction and criteria verbatim:

  `{true: "Evidence is a measurement, gate result or reproduction of the specific artifact.", false: "Evidence is absent, narrative, or does not bear on the claim."}`
- **Code rule:**

  | Result | Action |
  |---|---|
  | every required check green **and** every noul ≥ 0.85 | PASS |
  | any noul ≤ 0.35 | do not mark `[x]` |
  | anything in between | UNVERIFIED: gather the missing evidence |

  Every number is quoted in the commit message. Layout claims add "(band provisional: 377.10 folded into 394.12; no layout calibration set)".

### JQ: the queue screen (the third point; owner answer 1; needs O13, recorded by 394.18)

- **Where it stands against the 2026-09-21 refusal.** `grill-kev-in-the-loop-2026-09-21.md` refused Jev as dispatcher (Part 1) "on grounds a better model does not fix": rules 3, 4 and 5 are exact. JQ keeps Part 1 intact, because code still picks the item. What JQ screens is Part 2/3's question (what to do with an item already chosen), which that grill left "genuinely open for Jev" under two reopen conditions: (1) labels from recorded outcomes, not a proxy, and (2) answers that do not move when unrelated prose is added or removed. 394.13 answers (1) and 394.14's probes answer (2). The 394.14 record quotes both conditions and how each was met.
- **Where the rubric lives.** `.roundtable/jev-rubrics.md` gains JQ as its own rubric: the questions, the cuts, the tune/holdout set and its validation status. Rubric 3 (DISPATCH, `jev_route`) stays off, because JQ neither routes nor dispatches.
- **When.** At Step 2 rule M, once the code has picked the item and the item lint has passed. Once per dispatch. It also runs once on each item the planner writes (one bounce).
- **Where it is stored.** Gate: `scripts/loops/queue_screen.json`. Log: `.roundtable/queue-screen-shadow.jsonl`. The log holds the state hash (never the state), the question fingerprint, the `/v1/models` string, the probabilities and the would-be action. Answers are memoised by the hash of the item text.
- **State.** `{item: {text}}`, containing the title, about 700 characters of context and the Accept block, with whitespace normalised. It carries no status marker, no repo framing and no prior verdict, and is at most 1,500 characters.
- **Questions** (exactly these; drafted and pilot-tested in `queue_screen.gate.json`, committed by P5 at `.roundtable/milestone-m1-2026-09-25/`):
  1. `decision`, an exhaustive `choice`: "Which describes the choice item.text leaves open?"

     | Option | Meaning |
     |---|---|
     | `no_choice` | It states one change or measurement to make; no alternatives are left to choose between. |
     | `choice_settled_by_check` | It allows two or more outcomes and names the measurement, count or check whose result decides between them. |
     | `design_choice_unsettled` | It leaves a choice between designs or approaches open and names nothing that decides it. |
     | `owner_or_business_choice` | It says the owner, a user or the business must decide, pick, approve or be asked; or it leaves a product scope, release or business-policy choice open. |
  2. `done_evidence`, an exhaustive `choice`: "What does item.text name as the evidence that the work is done?"

     | Option | Meaning |
     |---|---|
     | `instrument_result` | A command, check case, gate, test, count or measurement, and the result it must show. |
     | `artifact_exists` | Only that a page, file, section, table or record is written or exists. |
     | `judgement_or_approval` | A quality, an agreement, a review or someone's approval. |
     | `nothing_stated` | No done condition is stated. |
  3. `waits_on`, a `noul`: "Does item.text say the work must wait until something else happens first: another item, research, a grill, a verdict, a brief, a release, a decision or hardware?"
     - true: "The text says the work waits for, is blocked on, happens after, or starts only once something else lands or is decided."
     - false: "The text describes work that can start now, even if it cites earlier items as background."
     - This question is **shadow-only permanently.** It did not separate in the pilot, and the code-read `After:` line replaces it.
- **Rules in code** (evaluated in order; the first match wins; the cuts are the pilot cuts minus the 0.05 jitter band, so they are **tune-grade until 394.14's holdout**):

  ```
  decision:owner_or_business_choice >= 0.45  -> ask-owner
  done_evidence:nothing_stated      >= 0.15  -> sharpen
  waits_on                          >= 0.85  -> sharpen   (logged, never enforced)
  otherwise                                  -> execute
  unreachable | partial | non-JSON | unknown option | /v1/models string changed -> sharpen
  ```

- **Actions:**

  | Mode | Action | What happens |
  |---|---|---|
  | shadow | any | Nothing. The dispatcher prints one line and runs the item's route. |
  | escalate-only | `sharpen` | The planner runs on this item (§7), blind: it is not told that JQ sent it. At most one bounce per item, and it counts toward rule D's limits. |
  | escalate-only | `ask-owner`, `execute`, fail-open | Logged only. The item's route runs. |
  | enforce | `execute` | The item's route runs. |
  | enforce | `sharpen` | The planner runs on this item (§7). |
  | enforce | `ask-owner` | The planner writes an owner-decision item with options and a recommendation. The item gets an owner marker, the owner is notified, and code selects the next item. |

  Every action is reversible. **A cheaper tier is reachable only through a decided `execute`.**

  **Why escalate-only exists (owner answer 1).** You said "Jev needs to call another model to review and set the direction". In shadow, that is not true until 394.16 promotes JQ, which needs at least 20 joined outcomes. Escalate-only makes it true from 394.15 onwards, in the one direction that cannot skip or cheapen work: a `sharpen` answer can only add a planner run, and the planner may answer "executable as written — no change". The costs are extra top-tier planner runs, counted in the shadow report as over-escalations. The labels stay usable because the planner is blind to why it was sent. The default is shadow. The mode is the owner's to set, in `queue_screen.json`.
- **Circuit breaker (enforce only).** After 3 consecutive fail-opens, the dispatcher:
  1. stops calling Jev for 24 h;
  2. runs the pre-gate behaviour (the item's route, with triage authority);
  3. writes a Direction line;
  4. notifies the owner.
- **Promotion.** Only the owner promotes, at 394.16, and only when all of these hold:
  - ≥20 joined outcomes;
  - ≥5 of them above rank 0;
  - 0 missed;
  - over-escalation rate ≤ 0.5;
  - fail-open below 20% by item;
  - an admitted tune/holdout calibration.

  Keeping JQ in shadow, or retiring it to code-only, is also a valid outcome.

### What Jev never does here

- Select, order, skip, close or admit anything.
- Pick a route or a model.
- Call or wake a model.
- Judge whether a layout is good. That belongs to the critics and `/design-grill`.
- Get called per file or per action.

---

## 7. The planner: where "Jev needs to call another model to set the direction" lands

Jev cannot call anything. The **code** detects the need. The **dispatcher** launches the planner.

### Triggers (393.7; each one's firing rate is replayed on history before it ships)

| Id | Trigger | Scope | Limit |
|---|---|---|---|
| **sharpen** | Rule M's pick fails the item lint, or JQ returns `sharpen` in escalate-only mode, or `sharpen` or `ask-owner` in enforce mode. | one item | one bounce |
| **D1** no task | Rules 1-4, including rule M, find nothing dispatchable. | whole backlog | once per 24 h; a second empty review falls through to rules 5-8 (O16 may place it before rule 6) |
| **D2** milestone empty | Zero open M1 items and the Done-test is unmet. | M1 | once per 24 h |
| **D3** unclear direction | ≥2 of the last 3 M1 executor rows ended `triaged` or `logged`, or ≥2 of the last 3 picks failed the lint. | M1 | once per 24 h |
| **D4** drift | Only if `Direction-drift` is set: the framework-path share of changed lines over the last N landings is below X%. | M1 | once per 24 h |

If M1's open items are all owner- or dependency-blocked, the planner does **not** run. The owner is the blocker (§4, rule 4).

### Input (bounded read)

- `## Objective` and `## Milestone M1`
- the item or items concerned
- `roadmap_scope.py` output
- the last 30 loop-log rows
- the item's gate log
- `.roundtable/INDEX.md` (never re-grill a repeated subject)
- the refused-on-record list (§9.1)
- when the item lint sent the item: the lint's finding. When JQ sent it: nothing about JQ. The planner is not told that a screen flagged the item, so its verdict can serve as JQ's label without having been primed by JQ.

It never reads the full ROADMAP.md.

**"Which is bigger target" is read two ways, and both are served.** If it means the bigger model, the planner runs on the `Planner` tier (O14). If it means the bigger goal (setting direction matters more than dispatching single items), rule D sits above rule 4 and D2/D3 fire on the milestone's own state. Confirm which reading you meant in O14.

### Output contract

The output is one commit, recorded as `--loop Roadmap --mode plan|direction`. The Roadmap loop does not arm rules 2 and 3. The commit contains one of:

- **(a) Sharpened items.** Each gets:
  - an Accept that names a property and its instrument;
  - a `Route:` from `routes.json`;
  - `After:` lines where needed;
  - `Milestone: M1 · Phase: n`;
  - the line `re-planned: <reason>, screen row <id>`.
- **(b) An owner-decision item** with options and a recommendation, plus a PushNotification.
- **(c) "executable as written — no change"**, logged. It becomes a calibration label for JQ.

A direction review (D1-D4) files at most `direction-items` new items (default 5). Each passes the item lint and one JQ bounce. The review updates RESUME.md `Direction` with a date.

### Enforcement

- `milestone.py` fails a planner commit that adds an item with no Accept, an unknown route or an unresolved `After:`.
- Two consecutive wakes that only plan halt the loop, with a PushNotification. This exists because of the 28-idle-wake spiral recorded at LOOPS.md:775-781.

---

## 8. Layout work (Slices 395-396)

### Naming rules (from 394.1; `check:shape-names` enforces them from 396.1 onwards)

- **Shape names only.** A layout that no pattern covers is a new shape. It enters as an experimental pattern with its final shape name, never a module name.
- **The swap test.** A job word may name a shape only if:
  - it names one distinct interaction, **and**
  - it stays true when the demo data moves to another module.

  `goods-receipt` passes. `invoice-list` failed.
- **Module directory ids.** New ids are full words (`configuration`, `distribution`). Existing ids (`fin`, `inv`, `o2c`, `p2p`, `prod`, `crm`) are kept, which avoids 31 URL redirects. `dist` is reserved: `examples/erp-suite/build.mjs` deletes it on every build.
- **Facet ids are not directory ids.** The module facets in `jobs.json` ship in the npm package, so they use the canonical module words from the Milestone `Modules` field (`sales`, `procurement`), never the directory abbreviations (`o2c`, `p2p`). `_shell.mjs` MODULES carries both, and 394.9's generator maps one to the other. A directory id can then change for URL reasons without touching a published facet.
- **Where code reads the module list.** Generators and `check:shape-names` read it from `examples/erp-suite/_shell.mjs` MODULES, never from ROADMAP.md. The docs container build has no ROADMAP.md (see the Containerfile's note on two gates that broke it that way), and the gate must outlive the milestone. `milestone.py` reconciles MODULES against the `Modules` field.
- **Redesign freely.** Existing screens are reference only. A redesign replaces its predecessor at the same URL. The predecessor's open findings close against the replacement (394.2).
- **Freedom to design is not a per-domain variant.** A module screen is built when its job, and so its decision, differs; a screen that re-demos the same job with another module's column headings is the variant loop-log.md:598 refused. Whether whole module sets may be built is 396.5's A/B question plus the owner's 396.13 choice. Offering it requires 394.1's ADR to record loop-log.md:595 (domain packs) as superseded, for `examples/erp-suite` only.

### A module item, stage by stage

A module item (Route `design`) spans several wakes. Its stages alternate between **Workflow runs**, which return data only, and **dispatcher steps** (stages 2, 5, 9 and 10, plus the J1 calls), which write shared files, build and screenshot. It cannot be one Workflow run, because a Workflow cannot write the registries a new screen needs, and the critics need the built output. Each Workflow run opens and closes its own in-flight line (393.2). The item's number is allocated after a fetch.

| # | Stage | Actor | Artefact and location | Gate before the next stage |
|---|---|---|---|---|
| 1 | Brief | `research` subagent | `.roundtable/brief-<module-id>-<date>.md`: BRIEF `{roles, jobs[{id, who, frequency, decision, done, before, after, sources[]}], alsoCalled[{word, source}], edgeStates, demoData, practitionerWouldReject, reference, betterThanReference}` | Code counts ≥2 distinct URL hosts per domain claim. A fresh realism reviewer returns a verdict for each job. |
| 2 | Prediction | dispatcher | A ledger entry in `.roundtable/erp-suite-gaps.md`, in the format at :809-848: shapes forced, expected gap count, what would falsify it | It is committed **before** any markup. The commit order is quoted. |
| 3 | Job rows | mapping subagent | Rows for the pattern pages' Jobs tables and each screen's `@pattern`/`@job`, returned as data; `alternatives[]` where there are two or more | J1 runs at the next dispatcher step wherever `alternatives[]` has two or more entries. The 394.9 generator reconciles after the barrier. |
| 4 | Screens | `design` subagents, up to `agents/wake` in parallel | LAYOUT `{file, content, pattern, job, shapeAdded, placeholders[{key, region, settledFor}], requirements[{key, capability, triedWithShipped, wantedOutcome}]}`, returned as data | Only `api.json` classes, plus experimental parts with their import and marker. No CSS. |
| 5 | Barrier | dispatcher | Writes the files and the registries: `build.mjs` BUILT_MODULES, `_shell.mjs` MODULES and navigation, `kinds.mjs`, `index.screen.mjs`, the Jobs rows | `npm run suite`, the 394.8 marker↔ledger check, `check:shape-names`, `check-markup`, and `npm run docs:build`. The docs build copies the suite into `dist/suite/` and runs `check-markup` over it, so it must pass `--allow-gaps` there too (394.5). Then screenshots on `:8081` at 1440/390 × light/dark, one at a time, after confirming the served CSS contains the change. |
| 6 | Critics | 2 fresh subagents per screen | `/design-grill <screen>`, then `/design-grill flow:<a> > <b> > <c>` on the module's main journey. VERDICT `{refuted, reason}` | At most 3 revise rounds. An unresolved verdict after round 3 is filed as a Slice 397 item on Route `design`, and the stage continues. |
| 7 | Pool | code | All placeholders flattened and deduplicated against SEEN: ledger keys, including REFUSED and NOT-A-GAP; the §9.1 list; `api.json`; `api.experimental`. **Deduplication stops a need being filed twice. It never discards a use.** A hit on a seen key is appended to that entry's uses (site, job, pattern). When an OPEN entry reaches 2 distinct (job, pattern) pairs, code files a triage item for it. Hits on a §9.1 or REFUSED key are counted and reported, never dispatched. | Stop discovering after 2 rounds with no fresh key. Log fresh/seen/admitted counts, and seen-key uses added, for each round. |
| 8 | Triage | `build` subagent, effort high | For each fresh key, and for each entry that code just re-filed, three drafted alternatives: compose as drafted / experimental / refuse. J1 runs on them at the next dispatcher step. | Code enforces the entry test (§9.3). |
| 9 | Filing | dispatcher | Ledger entries and their appended uses; for an experimental route, items N.1, N.2 and N.3, each with its `Route:` (§5) and `After:` lines; owner-decision items; one commit per item; one push | `milestone.py` reconcile is green, and the item lint passes on every filed item. |
| 10 | Score | dispatcher | The stage-2 prediction scored against actual results, in the ledger | This is part of the item's Accept. "0 new shapes" satisfies it. |

### The frame (395.1) and the landing (395.2)

These run the same stages 4-6 and 10. They have no brief, but their prediction is still committed before any markup.

The dock is built with its refusal kept. Its options go to 373.6 for the owner.

---

## 9. Missing pieces: the placeholder and the experimental lifecycle (owner answer 5)

### 9.1 Refused on record

Every candidate is checked against this list **before** it is logged. A match becomes `app-owned slot — refused on record (<id>)` and is never dispatched. Reopening one needs an owner entry that names the new evidence.

- **Gantt, map, period-close cockpit, activity-chatter, Analytical List Page:** loop-log.md:727.
- **Sparklines, column chooser, number abbreviation, gantt/tours, group-by-with-counts:** loop-log.md:939.
- **Drag**, refused four times: ROADMAP.md:2613.
- **The dock:** 373.6.
- **Module rail:** GAP-1. 395.1 answers its trigger.
- **Grid engine, master-detail component:** DESIGN.md "Deliberately absent".
- **Charting engine, rich-text engine, virtualised table, page builder, icon set, state/routing:** scope.astro:41-66.
- **Per-domain variants, device-class forks:** loop-log.md:598, 600.
- **Domain packs:** loop-log.md:595. Upheld for the framework. For `examples/erp-suite`, 394.1's ADR records whether owner answer 3 ("freedom to design") supersedes it; until it does, a module screen is built only for a job no existing screen serves (§8).
- **Genealogy graph (GAP-21), and a fifth chain state (GAP-14).**

### 9.2 Placeholder markup

Use the closest composition of shipped classes. Where nothing comes close, use the labelled region alone:

```html
<!-- gap check-matrix: wanted a role × permission matrix; settled for a role list with a per-role permissions link -->
<section class="bo-state" data-bo-gap="check-matrix">
  <p class="bo-state__title">Placeholder: role × permission matrix</p>
  <p class="bo-state__description">Not in the framework yet. Tracked as gap check-matrix.</p>
</section>
```

- **Keys** are need slugs, named for shape and built from the content, never `max+1`.
- **Forbidden:** `bo-skeleton`, `aria-busy`, local CSS and inline styles.
- **The shipped validator** fails on `data-bo-gap` unless `--allow-gaps` is set (394.5). Two in-repo runs see suite pages: `suite:check`, and the docs build's `check-markup dist`, which walks `dist/suite/`. Both pass `--allow-gaps` for suite pages only, and the 394.8 marker↔ledger check reconciles instead. A docs page outside `/suite/` never carries a placeholder.

### 9.3 States: each with its artefacts, gate and actor

| State | Artefacts (location) | Gate | Who moves it on |
|---|---|---|---|
| **Discovered** | Placeholder in the screen. Ledger entry `Status: OPEN` in `.roundtable/erp-suite-gaps.md`, recording: hit on, uses (site, job, pattern, one line each, appended by every later hit), user task, what was tried with shipped classes, the wanted outcome (checkable), placeholder sites. | 394.8 marker↔ledger check | Triage (§8 stage 8) |
| **Open, one use** | Same as Discovered, with the line `Waiting: second use`. The placeholder stays and is honest. Nothing is built and nothing is refused. | 394.8 check; code re-files it for triage the moment its uses reach 2 distinct (job, pattern) pairs (§8 stage 7) | Code |
| **Composed** | The placeholder is replaced by the composition. `Status: COMPOSED`. | Marker count for the key is 0 in the built suite | Fill executor |
| **Refused** | The compromise stays. `data-bo-gap` is removed and the source comment kept. `Status: REFUSED`. A DESIGN.md "Deliberately absent" row is added if the refusal is general. | §9.1 list updated; `gen-llms` warns agents | Triage |
| **Experimental** | `packages/core/src/css/components/<name>/<name>.css`, header `@status experimental` + `@decide <N.3 id>`, `@layer bo-components` (the same layer stable parts use). Built to `dist/css/components/<name>.css`; not in `index.css`. Listed in `api.experimental`. **If it has JS:** `src/js/behaviors/<name>.ts` carries the same two header lines, ships only at the existing `./js/behaviors/<name>` per-file export, and is **not** re-exported from `src/js/index.ts` (versioning.astro: exported `init*` signatures are API). Its entries in `behaviors.json`/`events.json`/`keymap.json` carry the status. **Tokens:** it adds no `--bo-*` semantic token; any custom property it needs is scoped to its own root (component-internal, "Not API"). Every use carries `data-bo-experimental="<name>"` plus the per-file import(s). `Status: EXPERIMENTAL`. Items N.1, N.2 and N.3. | 394.4-394.7: cap; decision item reconciled; load gate; validator; docs status both directions | N.3 executor |
| **Stable (graduated)** | `@status` and `@decide` deleted. `@import` added to `index.css`; the behaviour, if any, added to `src/js/index.ts`. Markers removed. CHANGELOG "Added (graduated from experimental, since vX)". `introduced.json` records both the first published version and the stable-since version, and the Maturity label shows stable-since. Breaking rules apply from here on. | Every stable gate. The validator flags stale markers (`--strict` in the repo). | — |
| **Absorbed** | Becomes a setting on an existing component. The experimental files are deleted and the uses rewritten. CHANGELOG `### Experimental`. | Removal gates | — |
| **Removed** | Files deleted. Uses rewritten to the composition N.3 named, or back to a placeholder. Ledger REFUSED. CHANGELOG `### Experimental` "Removed `bo-x`; compose Y instead", which is not a Breaking entry and ships in a minor. A removed experimental page gets an entry in `apps/docs/src/data/redirects.mjs`. | `check-markup` finds no unknown class over the docs and suite builds; `check-links` | — |

**Entry test, discovered → experimental.** Code and the triage agent check all of these:

- **E-compose.** The closest composition was tried, and the reason it fails is written down (step 1 of the 99.4 front door).
- **E-record.** The part is not on the §9.1 list.
- **E-second.** Either two real uses are already recorded on **different `patterns.json` ids**, or there is one real use plus a **named, queued** second use on a different id. A second module on the same shape counts once.
- **E-cap.** After admission the count stays at or under `experimental` (O8).
- **E-release.** 394.3 is closed.
- **E-items.** The same commit files these items:
  - **N.1** build and fill (`Route: build`; `After:` nothing);
  - **N.2** the second composition (`Route: design`; `After: N.1`);
  - **N.3** "experimental `<name>`: admit or remove" (`Route: build`; `After: N.2`, plus `After: 377.4` when the part has a pointer listener).

  The Accept of N.2 and N.3 allows either outcome.

**How no need is missed (owner answer 5: "if we don't consider new, we could miss as well").** Two rules, one for each way a need gets lost:
- **A second use that is foreseen gets queued.** If the need's second use is foreseen (a named screen in a later module), that screen's item is named in the ledger entry, or an item is filed for it. GAP-21 was refused on 2026-08-25 pending a where-used screen, and that screen was never queued (394.8).
- **A second use that is not foreseen gets caught by code.** The need stays `OPEN` with `Waiting: second use`. It is not closed REFUSED. Every later hit on its key is appended as a use (§8 stage 7), and when the uses reach 2 distinct (job, pattern) pairs, code re-files it for triage.

REFUSED is kept for refusals on the merits: a §9.1 match, a composition that works, or an Objective refuse. Before this rule, a need refused only for lack of a second use was deduplicated as SEEN when it came back, so its second use was never counted.

**Admission at N.3, experimental → stable.** All of these must hold:

- **G1.** There are ≥2 independent compositions. Code counts distinct (job, pattern) pairs among worked screens that use the part **unchanged**. `git log` on its files between the compositions must show no change, and composition 1 is re-verified.
- **G2.** The 99.4 front door is run again with both uses in hand:
  - does composition work now?
  - a DSA score with evidence in `dsa-scores.json`;
  - the "Not for" clause;
  - the name passes the swap test with both uses in hand. A rename is free while the part is experimental (it is not API), so a wrong name is fixed here, before graduation makes it permanent.
- **G3.** The Objective §1-§4 tests are recorded, and the record names what the part does better than its reference.
- **G4.** The part meets the floor and the contracts:
  - contrast PAIRS;
  - vitest;
  - `check-claims` for each runtime claim;
  - 377.4 closed if it has a pointer listener.
- **G5.** The graduation diff (above). J2 reviews the completion claim. The owner sees the "Added" entry at release (O8).

---

## 10. Parallel work and isolation

- **One Workflow in flight** (393.2). At most `agents/wake` agents per wake.
- **Agents return file content as data.** Only the dispatcher writes:
  - ROADMAP.md, loop-log.md, STATUS.md, RESUME.md, CHANGELOG.md;
  - `.roundtable/erp-suite-gaps.md`;
  - the suite registries (§8 stage 5);
  - `src/css/index.css`, PAIRS;
  - anything generated: `api.json`, `suite.json`, `jobs.json`, `patterns.json`, `llms.txt`.
- **Numbers.** Slice and item numbers are allocated after `git fetch`, before any fan-out.
- **Component builders run one per wake**, in the main checkout, unless 393.12 has closed and the item names a worktree.
- **Writing agents never edit the suite registries**, even in a worktree. A new screen needs a registry entry to build, so a Workflow run returns the screen and its registry lines as data, and the dispatcher applies both at the next integration step (§8).
- **One at a time.** `build.mjs` deletes `dist/`, so the whole-tree gates and `:8081` run one at a time after fan-in.
- **Lint the Workflow script** with `busy-office:graph-engineer` before its first run. It must report 0 rows.

---

## 11. Every iteration

1. **Build and test.** `npm run build -w @busy-office/ui`, `npm run docs:build`, `npm test -w @busy-office/ui`, `npm run suite`.
2. **Rebuild `:8081`.** Confirm the served CSS or markup contains the change; rebuild with `--no-cache` if it does not. Take screenshots at 1440 and 390, light and dark.
3. **Design-grill** each new screen, and run flow mode on the module's journey.
4. **Run J2** before any `[x]`, and quote its numbers.
5. **Record,** then quote `dispatch_status.py` and confirm the counters moved:

```
python3 scripts/loops/record_iteration.py --loop <Continue|Roadmap> \
  --mode <build|layout|component|fill|brief|measure|plan|direction|bug> \
  [--milestone M1 | --track defect] \
  --route <route> --model <model actually used> [--agent <subagent type>] [--skill <skill>]... \
  --item "<id — what>" \
  --outcome <landed|released|logged|triaged|refused|reverted> \
  [--first-try landed|reworked|reverted] [--screen <jq-row-id>] [--also-refused "<what>"]
```

Every flag lands in the loop-log.md row first (393.5, 393.6); `dispatch_status.py` reads the rule 2/3 scoping and the interleave from the row, and `rebuild_from_log.py` rebuilds the mirror from it.

---

## 12. Phase exits, stops, notifications and the exit report

### Phase exit tests

| Phase | Exit test (code prints it via `milestone.py`) |
|---|---|
| 0 (393) | §3 exit test; the owner sets ACTIVE |
| 1 (394) | Every Phase 1 item is closed, except 394.16 and any OWNER item waiting on data. The 394.4-394.10 gates have been shown to fail and are green on HEAD. |
| 2 (395-396) | Every Phase 2 item is closed, including module items the planner filed under 396.11. Done-test properties 1-4 hold. |
| 3 (397) | 397.2's Accept holds. |

Phases are reporting labels, not gates. Order comes from rule M's oldest-first plus `After:` lines (§4), so this table says when a phase is **done**, not when the next may **start**.

### Stops

The dispatcher stops, reports in RESUME.md `Direction`, sends a PushNotification, and does not continue when any of these happens (the same set as the Milestone `Stop` field):

- a HALT file appears;
- a foreign commit appears;
- a `Budget` line is spent. `wakes` counts dispatch wakes; hold wakes have their own `hold-wakes` metric;
- **no progress:** two consecutive dispatch wakes on the **same** item end without `landed` (both `logged`, `reverted` or `triaged`). A hold under an in-flight cap is not a no-progress wake. Neither is a wake that rule 4 restricted to `Track: defect` because every M1 item is owner- or dependency-blocked: that case has its own once-per-24-hours owner notification (§4);
- two consecutive wakes only plan;
- a one-way door is reached:
  - a public API or token change outside the experimental tier that no answered owner decision already approved (O9 approves 394.10's exports and the `data-bo-*` attributes by name);
  - a Breaking entry;
  - reopening a refused item;
  - reversing an owner refusal.

A one-way door is logged as an owner-decision item and worked around. The dispatcher never guesses.

**Not a stop: the experimental cap.** When admission would take the count over the Milestone `experimental` cap, the entry test (E-cap) refuses entry. The need stays `OPEN` with its placeholder, an owner-decision item is filed, and the loop continues. At the cap is a normal state, and halting there would stop layout work for a component question.

### PushNotification

A PushNotification is sent:
- on every stop;
- at the M0 exit;
- at each phase exit;
- when each module item closes;
- for each owner-decision item filed;
- at 396.5's result;
- at 397.2.

### Exit report (397.2)

**Per module:**
- screens built, and the shape each one uses or adds;
- predicted gaps against actual gaps;
- placeholders opened and closed;
- requirement dispositions;
- needs still `OPEN` with `Waiting: second use`, each with its recorded uses.

**Experimental:**
- parts opened, graduated, absorbed and removed;
- ages in releases.

**Jev:**
- J1 agreement counts;
- J2 counts, with UNVERIFIED shown separately;
- the JQ shadow report.

**Loop:**
- wakes, agents, wall time;
- hold-wakes, planner calls;
- the loop-doctor re-score.

**Product share:** the `git diff --numstat` split, with commands.

**Limits:** what each number does not cover.

---

## 13. Refused: do not do these

- A module, department or process-area word in any published name (394.1).
- A `@busy-office/modules` or `blueprints` package, or domain-named pages outside `/suite/`.
- Per-module copies of pattern pages.
- An experimental part without an open N.3 item, over the cap, imported by `index.css`, or under a class prefix such as `bo-x-`.
- Moving an experimental part's path at graduation.
- An experimental behaviour re-exported from `src/js/index.ts`, or an experimental part adding a `--bo-*` semantic token.
- Closing a need REFUSED only because no second use is known yet (§9.3), or discarding a hit on a seen key instead of recording it as a use.
- `bo-skeleton` or `aria-busy` as a placeholder. Local CSS in the suite.
- A module directory named `dist`. A directory abbreviation (`o2c`, `p2p`) used as a published `jobs.json` facet.
- A build gate that reads ROADMAP.md or `.roundtable/` for data the docs container build needs (the container copies neither).
- Jev selecting, routing, calling, admitting or deciding PASS. Reading `confidence` or `escalate`.
- An exchange file, heartbeat or await-assignment protocol between agents (Slice 375). Non-Claude agents, unless O14 allows them.
- More than one Workflow in flight. Parallel component builders before 393.12.
- Writing into `.roundtable/pilot-112/`, or authoring 112.3 briefs.
- A Screen Contract schema (112.4) unless the owner answers O10(a).
- Anything in §9.1.
- Publishing to npm.
