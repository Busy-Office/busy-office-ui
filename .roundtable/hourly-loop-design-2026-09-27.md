# The hourly loop for busy-office-ui — design (2026-09-27)

Settled with the owner in grilling rounds Q1-Q20 (every recommendation accepted, "Ok" to
the round) and the decision ladder (Jev, then a smarter model, then Jev, then the owner).
The sibling design is `busy-office-erp` ADR-0023 (Accepted, Q1-Q33); this note keeps its
shape where the two repos agree and says where this one differs. **Nothing here is built
yet except the parts marked BUILT.**

## 1. What it is
An hourly floor plus event wakes, run as the session's `/loop` (dynamic mode), that takes
roadmap work, has Jev route each item to a named profile, and runs independent items in
parallel. The dashboard is separate: read-only, event-driven, a private Artifact.

## 2. Same as ADR-0023
| Point | Rule |
|---|---|
| Where | a local Claude Code session; a self-paced `/loop` expires after 7 days, so a weekly restart until a `launchd` driver exists (deferred) |
| Wake | events wake it; the timer is a heartbeat: 3,600 s idle, 1,800 s while work is in flight, never under 300 s |
| Guard first | BUILT: `step0_guard.py`, `inflight.py hold`, `dispatch_status.py`, CI read of main |
| Batch | up to 3 at once, read-only first (Q4), then writers |
| One writer | one wake lands one item at a time, rebasing the rest; only the orchestrator writes `main` |
| Jev | advisory, CLI only (`jev ask`, `jev judge`), two points, agents run it themselves; a blind scorer or critic never does |
| Never unattended | `npm publish`, replies to outside people, keys/`jev allow`/plugin config, spend caps, irreversible deletion, changes to the ladder |
| Self-edit | the loop may not edit its own rules (LOOPS.md, CLAUDE.md, the judges, this note) without an owner-approved change |

## 3. Different here
| Point | busy-office-ui |
|---|---|
| Queue | `ROADMAP.md` is the record; `loops.db`'s `roadmap_items` is the mirror the dispatcher queries. No GitHub Issues queue |
| Ordering | the dispatcher's rules stay the authority (LOOPS.md Step 2). The hourly floor only decides *when* to run a wake and *how many* items the chosen rule can fan out; it does not reorder rules |
| Tiers | no T0/T1 split. `Track: defect`, `Route:` and `Parked:` markers already exist; owner-blocked items are excluded by the `blocked` column |
| Landing | direct to `main` after the wake's gates (LOOPS.md step "verify"), not `ci/` branches; CI is read at the start of every wake and after the push |
| Concurrency | `inflight.py` holds ONE line today; parallel work needs several (build step 2) |
| Profiles | seven, below, not per-model tiers |

## 4. The profile menu (Q3, Q15)
A profile is a named bundle: model tier, effort, required skills, allowed tools, Jev
allowlist, wall-clock cap, and whether it may write.

| Profile | For | Writes | Jev allowlist |
|---|---|---|---|
| browser-fix | a defect that needs the live container and a screenshot | yes | `judge completion` |
| gate-or-script | a check, a script, a claim case (red-proved) | yes | `judge completion` |
| measure-and-decide | a number or a drafted choice | notes only | `ask` (choice), `judge completion` |
| grill | Objective grill: finders, verifiers, critic | report only | `judge local/grill-finding` for verifiers; **none** for finders and critic |
| sweep | Standardize's four lanes on an isolated worktree | ROADMAP slice only | none |
| planner | empty or unclear queue: clarify, split, file owner questions | ROADMAP text (clarify), never direction | `ask` |
| owner | anything in the never-unattended list | nothing | none |

Model tier is the profile's floor; Jev may move an item up, never below the floor (a
pick under 0.6 confidence moves one tier up). The planner tier is the top tier, and the
system works with no ACTIVE milestone (Q8-Q14).

## 5. A wake, in order
1. Guard (BUILT). Exit 3/4/5 of `inflight.py` holds, stops, or halts.
2. Triage new input into `ROADMAP.md`.
3. Dispatcher rule (unchanged) names the loop and, for rule 4, the item set: the oldest
   unblocked open items whose declared `paths` are disjoint (a new marker, step 3).
4. **Route** each item: code sets the floor from `Route:`, `Track:` and path class, then
   `jev ask` picks a profile and effort inside it. **Shadow first** (Q11): the pick is
   recorded next to what the dispatcher would have done; the dispatcher's choice runs.
5. Run: read-only profiles in parallel (max 3, 45 min per wake); one writer at a time.
6. Verify per profile, commit, record with `record_iteration.py --route --model --agent
   --skill --first-try` (393.6's fields exist).
7. Empty or unclear (Q8-Q9): no dispatchable item, an item failing the lint, Jev cannot
   decide, or Jev and code disagree, so run `planner`; it may sharpen, split and file owner
   questions but not change direction. A Jev outage falls back to rule 4.
8. Push, read CI, reschedule (heartbeat above). Halt only on the dispatcher's halt rule.

## 6. Bounds and trust (Q6, Q7, Q16-Q18)
- **Spend guard:** 1,000k output tokens per hour (the owner's figure; measured median 94k
  per active hour, p90 160k, max 281k over 48 h, subagents about 45%). Soft warning near
  250k, a knob. Needs a counter (build step 5); until then the wake reports its own spend.
- **Jev cap:** per-profile allowlist plus a per-hour call count; blind roles get none.
- **Retry:** Jev's `retry` judge plus a code cap of 2 per item.
- **Shadow bar:** Jev's pick is followed only after at least 20 recorded decisions at 85%
  agreement with what the dispatcher chose or the reviewer would have. Below the bar it
  stays advisory.
- **Trial:** owner watches 3 working wakes; then one unattended week: no red main, no
  unapproved governed change, idle wakes under 2 minutes, at least half of routed items
  first-try. Missing the bar pauses the loop.
- **Pause:** two failed wakes in a row, or three held by one cause, pause the loop and
  notify the owner.

## 7. Build order (each step makes the next safe)
1. This note. **DONE.**
2. **Multi-line `inflight`** — several `wf=` lines under `## In flight`, a per-line cap,
   `open` refuses a line whose `paths` overlap an open one, `hold` holds only when the
   overlap or the concurrency limit (3) forbids the next dispatch. Extends 393.2/398.2's
   exits; keeps exit 5 as a STOP.
3. `paths=` declared on roadmap items (a marker the mirror parses and reconciles).
4. `routes.json` becomes the profile menu; `record_iteration.py` gains `--profile`.
5. The spend counter and the soft/hard guard.
6. The routing judge (`local/assign`, shadow) and its agreement report.
7. The hourly floor: the wake prompt gains the heartbeat rule.
8. Supervised first run, then the trial week.
Persistence beyond the session (`launchd`) stays deferred.

## 8. What would make this wrong
- Parallel writers on `data-table.css`-sized files conflict; step 3's disjoint paths are
  the whole defence, and `paths=` is only as good as the declaration.
- A shadow agreement of 85% over 20 decisions is a small sample; the bar is provisional
  like the Jev thresholds (`jev-rubrics.md`).
- The measured hour (94k median) came from a session that mostly held; a parallel wake
  will spend several times that.
