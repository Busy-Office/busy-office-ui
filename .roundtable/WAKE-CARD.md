# Wake card — what a wake needs to decide, and where the rest lives

A **derived summary of `LOOPS.md`** (Step 0, Step 0b, Step 2 and the record rule). It is a
reading aid for the decision, not a second source: when the two disagree, `LOOPS.md` wins
and this card is the defect. Playbooks, history and the reasoning behind each rule stay in
`LOOPS.md`; open the section named next to a rule only when that rule fires.

## 1. Guards, in this order (LOOPS.md Step 0)
1. `python3 scripts/loops/step0_guard.py` — any exit but 0: STOP, write and commit nothing.
2. `python3 scripts/loops/inflight.py hold` — exit 0 continue; **3 hold** (dispatch nothing,
   reschedule, stop); **4** past cap (TaskStop, keep `out`, record `logged`, `close`); **5** the
   state cannot be read: STOP and tell the owner. Exit 0 may still list open lines (limit 1
   today, so a line means 3).
3. `gh run list --branch main --limit 2` — a red main is rule 1.
4. `python3 scripts/loops/dispatch_status.py` — the counters (Step 0b). A `REFUSED` milestone
   line stops the wake.

## 2. Triage (Step 1)
New input from the owner goes into `ROADMAP.md` with Accept criteria (a property, never a
value), tested against the Objective; refusing is a valid outcome. Commit it.

## 3. The rules, first match wins (Step 2)
| # | Condition | Dispatch | Full text |
|---|---|---|---|
| 1 | an open P0 bug | Continue, bug mode | Step 2 rule 1 |
| 2 | Standardize counter at 4 Continue rounds, or drift flagged | Standardize (§3 playbook) | Step 2 rule 2 |
| 3 | 3 distinct slices since the last grill that reset the counter, or the owner asked | Objective (§6) | Step 2 rule 3 |
| 4 | the **oldest** open item that is not blocked (`loops.db`, `roadmap_items`: `blocked=0`, `after_open=''`, `parked_held=0`) | Continue, build mode | Step 2 rule 4 |
| 5 | a metric regressed on two consecutive runs, or a size budget breached | Optimize (§4) | Step 2 rule 5; `STALE` means record a metric first |
| 6 | a scored surface below its round budget | Polish (§3b) | Step 2 rule 6; true of every surface, so read the rule |
| 7 | every surface dry or spent | Research (§3c), queue only | Step 2 rule 7 |
| 8 | nothing above matched | say why **once** and stop | Step 2 rule 8; name the kind of blocked |

While a milestone is ACTIVE, rules M and D (planner) precede these; M1 is DRAFT, so they are off.

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
python3 scripts/loops/record_iteration.py --loop <Loop> --mode <mode> --item "<what>" --outcome <landed|released|logged|triaged|refused|reverted> [--track defect]
```
then `git add -A .roundtable STATUS.md`, commit, push, and `ScheduleWakeup` (last act unless
halting). `record_metric.py --name <n> --value <v> --unit <u>` when you measured something.

## 7. Jev, two points only
A choice between drafted alternatives (`jev ask`) and a completion or grill-finding claim
(`jev judge completion`, `jev judge local/grill-finding`). Read the exit code first; any exit
but 0/3/4 is UNVERIFIED. Advisory, never a gate. CLAUDE.md "Jev" is the rule.
