# Wake card — what a wake needs to decide, and where the rest lives

A **derived summary of `LOOPS.md`** (Step 0, Step 0b, Step 2 and the record rule). It is a
reading aid for the decision, not a second source: when the two disagree, `LOOPS.md` wins
and this card is the defect. Playbooks, history and the reasoning behind each rule stay in
`LOOPS.md`; open the section named next to a rule only when that rule fires.

## 1. Guards, in this order (LOOPS.md Step 0)
1. `python3 scripts/loops/step0_guard.py` — any exit but 0: STOP, write and commit nothing.
2. `python3 scripts/loops/inflight.py hold` (after step 1) — exit 0: nothing in flight, or room
   to dispatch (the limit is 1 today, so an open line is exit 3); **3 = HOLD**: the command has
   already logged the hold, so record nothing, dispatch nothing, `ScheduleWakeup`, stop;
   **4** past cap: TaskStop, keep `out`, record `--outcome logged` naming what did not finish,
   `inflight.py close`, continue; **5** the state cannot be read: STOP and tell the owner.
   A guard stop (step 1) or exit 5 writes and commits nothing, so there is nothing to record.
3. `gh run list --branch main --limit 2` — if main's HEAD is red, fixing it comes before any dispatch (a Continue defect; this is RESUME.md's practice, not a Step 2 rule).
4. `python3 scripts/loops/dispatch_status.py` — the counters (Step 0b). A `REFUSED` milestone
   line stops the wake.

**What each stop means.** A guard stop (HALT file, wrong checkout, foreign commits), exit 5 and a
REFUSED milestone line end *this wake*: write, commit and record nothing, tell the owner.
`LOOPS.md` does not say whether such a wake reschedules; this session's practice was to
reschedule after a hold and to leave a stop for the owner. Only rule 8 "stops the loop" (no
`ScheduleWakeup`). A red main that is still *running* is not red: read it again next wake.
Fixing a red main is recorded `--loop Continue --mode fix --track defect`. A past-cap line (exit
4) is recorded with the `--loop` of the item that was running. When rule 8 fires, the dispatch
decision goes in the iteration log (`--loop Meta --outcome logged`, this session's practice).

## 2. Triage (Step 1)
New input from the owner goes into `ROADMAP.md` with Accept criteria (a property, never a
value), tested against the Objective; refusing is a valid outcome. Commit it.

## 3. The rules, first match wins (Step 2)
| # | Condition | Dispatch | Full text |
|---|---|---|---|
| 1 | an open P0 bug (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md`) | Continue, bug mode | Step 2 rule 1 |
| 2 | Standardize counter at 4 Continue rounds, or drift flagged (by Continue, or seen in triage) | Standardize (§3 playbook) | Step 2 rule 2 |
| 3 | 3 distinct slices since the last grill that reset the counter (a grill whose report has the thesis section; `dispatch_status.py` prints a row that did not count, and why), or the owner asked | Objective (§6) | Step 2 rule 3 |
| 4 | the **oldest** open item that is not blocked: `sqlite3 .roundtable/loops.db "select item_id,title from roadmap_items where blocked=0 and after_open='' and parked_held=0 order by cast(slice as int), item_id limit 5"` | Continue, build mode | Step 2 rule 4 |
| 5 | a metric regressed on two consecutive runs, or a size budget breached | Optimize (§4) | Step 2 rule 5; `STALE` means record a metric first |
| 6 | a scored surface below its round budget and not dry | Polish (§3b) | Step 2 rule 6 (its predicate is not a queue test; open the rule before dispatching) |
| 7 | every surface dry or spent | Research (§3c), queue only | Step 2 rule 7 |
| 8 | nothing above matched | say why **once** and stop the loop | Step 2 rule 8; name the kind of blocked: owner-blocked, browser-blocked, agent-blocked, or dependency-blocked (`After:`) |

While a milestone is ACTIVE, rules M and D (planner) precede these; M1 is DRAFT (`Status:` in ROADMAP.md's M1 block), so they are off. A `REFUSED` line only appears once one is ACTIVE.

## 4. Never, unattended
`npm publish`; replying to outside people; keys, `jev allow`, plugin config; spend caps;
irreversible deletion; changes to the wake prompt, the decision ladder or this card.

## 5. Before a commit
`step0_guard.py` again; the gate for what changed (core build, docs build, `check:claims` part
A or B, `inflight.py --self-test`); a red-proof for any new check; live verification for visual
changes (`docs:container`, 1440/390 px, light and dark); `test:axe` and `check:layout` before a
push that touches pages.

## 6. Record, after every commit
```
python3 scripts/loops/record_iteration.py --loop <Loop> --mode <one word> --item "<what>" --outcome <landed|released|logged|triaged|refused|reverted> [--track defect] [--also-refused "<what>"]
```
`--loop` is Continue, Standardize, Polish, Research, Optimize, Explore, Objective, Gauntlet, Roadmap or Meta.
`--track defect` marks defect work (fixes, red-proofs, gate repairs). `--mode` is one free word (this session used build, fix, measure, sweep, grill, triage). A hold
records nothing; a REFUSED milestone line is a stop, not a row.
then `git add -A .roundtable STATUS.md`, commit, push, and `ScheduleWakeup` (last act unless
halting). `record_metric.py --name <n> --value <v> --unit <u>` when you measured something.

## 7. Jev, two points only
A choice between drafted alternatives (`jev ask`) and a completion or grill-finding claim
(`jev judge completion`, `jev judge local/grill-finding`). Read the exit code first; any exit
but 0/3/4 is UNVERIFIED. Advisory, never a gate. CLAUDE.md "Jev" is the rule.
