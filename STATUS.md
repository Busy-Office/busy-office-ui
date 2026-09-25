# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a queryable binary stays git-ignored while a file a human reads and reviews stays in git, and this one is read.

Generated at: 2026-09-25 14:47 UTC

oldest dispatchable: 375.11 — what 375.9 measured and did not fix.

Dispatcher rule 4's pick, computed: the oldest open item that no owner marker, open `After:` target or held `Parked:` line holds — and, while a milestone is ACTIVE, that the milestone does not tag (rule M dispatches those; `dispatch_status.py` prints its pick). The one standing GOAL, the owner's M0 bootstrap (O3), overrides it until 393.10 closes. A named item without a number has no age to rank by; any that nothing holds is listed here instead of being dropped.

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (5 open)
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 369** (1 open)
  - 369.1 — should printing from the DARK theme force the light palette? OWNER OR ARCHITECTURE CALL.
- **Slice 373** (2 open)
  - 373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals stand on the record and the reversal is not written down.
  - 373.8 — docs IA: collapse 17 sidebar groups into the prompt's seven (Start here / Foundations / Components / Patterns and layouts / Integration / Reference / Contributor and decision history). OWNER CALL.
- **Slice 374** (1 open)
  - 374.4 — `.bo-btn--secondary` standing alone is identified almost entirely by a 1.47:1 border, the contrast gate structurally cannot see it, and the published ACR says it can.
- **Slice 375** (1 open)
  - 375.11 — what 375.9 measured and did not fix.
- **Slice 376** (2 open)
  - 376.5 — the app-launch launcher hand-rolls a dialog header.
  - 376.7 — the lane-4 ratchet counts any net shrink as a cut.
- **Slice 377** (12 open)
  - 377.3 — the completion gate cannot see a revision.
  - 377.4 — pointer coverage, named per behaviour.
  - 377.5 — release the unreleased fixes, or record why not.
  - 377.6 — is busy-office-erp the named first user?
  - 377.7 — an adoption reading at every Objective grill, and §6's exit requires the thesis section.
  - 377.8 — the ACR's 1.4.11 and 2.4.7 remarks derive from source.
  - 377.9 — re-decide 375.6 on real CI timings.
  - 377.10 — the Jev band, re-measured with the question form Rubric 2 prescribes, and the set recorded.
  - 377.11 — 375.10's "holds the option" half must be able to fail.
  - 377.12 — the preview's provenance is truthful.
  - 377.13 — 375.9's corpus figure is re-runnable.
  - 377.14 — the low items, one bundle.
- **Slice 381** (2 open)
  - 381.1 — the correction-site check: precision, coverage, or unwire it.
  - 381.2 — rule 3 arms on slices that shipped nothing.
- **Slice 384** (1 open)
  - 384.1 — lane 4's anchor and the rule-text generator.
- **Slice 386** (1 open)
  - 386.1 — nothing keeps the print reset true on a NEW standalone page.
- **Slice 387** (2 open)
  - 387.1 — the message's horizontal overflow loses presses on two more paths.
  - 387.2 — a frozen cell's message still has two covers above it.
- **Slice 388** (2 open)
  - 388.3 — the segmented control's checked option draws an author-colour focus ring under forced colours.
  - 388.4 — two docs follow-ups from 388.1's panel, not re-measured.
- **Slice 389** (23 open)
  - 389.1 — Every RF task screen accepts a wedge scan on arrival without stealing the docs reader's focus.
  - 389.2 — RF task screens complete the task, or stop claiming to.
  - 389.3 — A rejected scan's reason stays readable after the flash.
  - 389.5 — Join the RF track: per-type routing that the links, the prose and the Back exits agree on.
  - 389.6 — The journey's RF step exits to an RF home.
  - 389.7 — The journey's RF confirm and failure verdict are in view at a rugged viewport.
  - 389.8 — Goods receipt shows the decision: which delivery, its expected lines, one completing action, in worker language.
  - 389.9 — On goods receipt, tapping a control never costs the next scan.
  - 389.10 — Goods-receipt quantity: captured after the scan, per line, with out-of-range values refused visibly.
  - 389.11 — Count: the menu, the screen and the state table agree.
  - 389.12 — Pick shows which scan it expects next.
  - 389.13 — Decide once where the RF exception bar sits.
  - 389.14 — RF frame guidance on the existing pages: who owns each app-level slot.
  - 389.15 — Decide what a wedge scan does on the menu and the queue.
  - 389.16 — Every class an RF document uses has a rule in the profile it loads.
  - 389.17 — Decide whether putaway verifies the pallet as well as the bin.
  - 389.18 — The receiving log reads at the glove tier, and its headers say what the cells hold.
  - 389.19 — The task-menu count badge is sized to its content.
  - 389.20 — The RF queue drops a column and a tab stop that carry nothing, and names itself.
  - 389.21 — RF docs pages: screen first, figures true, promised states buildable from the profile.
  - 389.22 — Count and putaway on-screen wording and emphasis.
  - 389.23 — Pick identifiers do not break inside themselves at the 320 px floor.
  - 389.24 — The data-table cell-link focus ring is clipped on the first and last rows.
- **Slice 391** (1 open)
  - 391.1 — settle why `check:claims` is red here and green on CI at the same commit, and record which environment is telling the truth.
- **Slice 392** (4 open)
  - 392.2 — a pressed toggle differs from an unpressed one by colour alone in normal colours.
  - 392.3 — a `--bar` label with one word wider than its slot paints past its button.
  - 392.4 — rule 3 reset without the thesis section, twice; and a design-grill reset it.
  - 392.5 — the comparator deltas are recorded nowhere a later grill reads them.
- **Slice 393** (8 open)
  - 393.5 — milestone rows move the counters the way the rules say (folds 392.4 and 381.2).
  - 393.6 — routes: the roadmap names which model does each item (owner answer 1), and telemetry records who did it.
  - 393.7 — rule D: when there is no task, or an item is unclear, the loop goes to the planner (owner answer 1: "which is bigger target").
  - 393.8 — a bounded hand-off, one wake prompt, and the milestone's read set.
  - 393.9 — apply the realignment markers to the 65 open items. They stay inert until the milestone is ACTIVE.
  - 393.10 — re-score the loop; the owner activates the milestone only at "watch".
  - 393.11 — a close is verified on HEAD alone (folds 377.3).
  - 393.12 — worktree isolation and fan-in, as code.
- **Slice 394** (18 open)
  - 394.1 — OWNER CALL: naming doctrine. Every published name names a shape (owner answer 2; roundtable 2026-09-25).
  - 394.2 — OWNER CALL: the app, the module list and the device classes (folds 377.6; owner answer 3).
  - 394.3 — OWNER CALL: a release boundary before any experimental part merges (377.5).
  - 394.4 — the experimental tier: `@status experimental` and `@decide` in the registration header, and where the build puts the part.
  - 394.5 — `bo-check-markup` (the shipped bin) sees experimental parts and placeholders.
  - 394.6 — docs, llms.txt and the sidebar show the status in words, in both directions.
  - 394.7 — every experimental part has an open decision item, the count stays under the cap, and every marked use loads its stylesheet.
  - 394.8 — the placeholder, the ledger, and the second-use rule (resolves GAP-21).
  - 394.9 — the job index: every worked screen declares its pattern and its job, and `jobs.json` is generated (folds 249.7's "also called").
  - 394.10 — the shape layer ships: llms.txt points at the worked screens, and the package exports patterns, jobs and llms.txt.
  - 394.11 — the reference-delta record (folds 392.5).
  - 394.12 — Jev hygiene: the rubric describes the fields as measured (folds 377.10).
  - 394.13 — the queue-screen calibration set, built from ROADMAP history.
  - 394.14 — the queue screen (JQ): the gate, the script, stability probes and calibration, in shadow.
  - 394.15 — the queue screen runs beside every milestone dispatch, and its outcomes are joined.
  - 394.16 — OWNER CALL: promote the queue screen, keep it in shadow, or retire it.
  - 394.17 — the incubation recipe: `new:component --experimental`, a CLAUDE.md "How to incubate a component" section, and the triage wording.
  - 394.18 — OWNER CALL: declare the queue screen as Jev's third point (O13), say what may leave the machine, and choose its mode before promotion.
- **Slice 395** (2 open)
  - 395.1 — the app frame end to end: shell, home, launch, navigation for the closed module list, profile and settings.
  - 395.2 — the module landing: compose `workspace`, or admit it as an experimental pattern.
- **Slice 396** (13 open)
  - 396.1 — `check:shape-names`: no published name contains a module word.
  - 396.2 — pre-register the A/B test: do agents build better from job rows or from a full module set?
  - 396.3 — Configuration layouts
  - 396.4 — Distribution layouts
  - 396.5 — run the A/B test, and put the result in front of the owner.
  - 396.6 — Production Planning layouts
  - 396.7 — Finance layouts.
  - 396.8 — Sales layouts.
  - 396.9 — Inventory layouts.
  - 396.10 — Procurement layouts.
  - 396.11 — the owner's further modules, one item each.
  - 396.12 — rugged-device task layouts
  - 396.13 — OWNER CALL: the form the remaining modules take (full module sets, or job rows plus screens only where a new shape is needed), decided on 396.5's result.
- **Slice 397** (2 open)
  - 397.1 — the first real run: the first need Configuration or Distribution logs walks the component lifecycle as far as its fill.
  - 397.2 — EXIT: close Milestone M1.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1802 iterations logged)
  Standardize   7 / 4 Continue rounds since 2026-09-25 12:20   OVERDUE
  Objective     3 / 3 slices          since 2026-09-25 13:32   OVERDUE  [375, 392, 393]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-09-25 05:14   ok   [newest pair: claims; 153 sample(s), 8 of 51 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (43 of 51 name(s) have only one day and are not an input to a rule that compares two runs). Each delta is DAY-CLOSE to DAY-CLOSE (the last sample of each day, roadmap 372.1); `[k same-day]` marks a day whose other samples are folded in, not shown:
       claims                      6d  2026-09-19 203 count -> 2026-09-25 311 count  +108
       dispatch-region-words       5d  2026-09-24 7749 words -> 2026-09-25 7775 words  +26   [2 same-day]
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4   [2 same-day]
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1   [6 same-day]
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5   [3 same-day]
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2   [2 same-day]
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
     a direction is NOT recorded on purpose (roadmap 324.1): adding one makes rule 5 fire on `bundle-gz-kb`'s four consecutive rises, which the log's own same-timestamp `components` samples refute (0.400 -> 0.355 kB per component over that window). A rise with no denominator is growth. Where a name has a real threshold, use it — `check:size` gates the bundle at 16.7 kB gz, which is rule 5's budget clause, not its trend one.
  Holds         1 hold-wake(s) recorded, 1 today (UTC dates)   [inflight.py hold; .roundtable/hold-wakes.jsonl]
```

## Owner-blocked

Open items carrying an owner marker (`BLOCKED ON`, `OWNER CALL`, `OWNER OR <X> CALL`, `OWNER ·`, `NEEDS-RUNTIME`, or `Route: owner`) — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 396.13 — OWNER CALL: the form the remaining modules take (full module sets, or job rows plus screens only where a new shape is needed), decided on 396.5's result.
- 394.1 — OWNER CALL: naming doctrine. Every published name names a shape (owner answer 2; roundtable 2026-09-25).
- 394.2 — OWNER CALL: the app, the module list and the device classes (folds 377.6; owner answer 3).
- 394.3 — OWNER CALL: a release boundary before any experimental part merges (377.5).
- 394.16 — OWNER CALL: promote the queue screen, keep it in shadow, or retire it.
- 394.18 — OWNER CALL: declare the queue screen as Jev's third point (O13), say what may leave the machine, and choose its mode before promotion.
- 389.6 — The journey's RF step exits to an RF home.
- 389.7 — The journey's RF confirm and failure verdict are in view at a rugged viewport.
- 377.5 — release the unreleased fixes, or record why not.
- 377.6 — is busy-office-erp the named first user?
- 374.4 — `.bo-btn--secondary` standing alone is identified almost entirely by a 1.47:1 border, the contrast gate structurally cannot see it, and the published ACR says it can.
- 373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals stand on the record and the reversal is not written down.
- 373.8 — docs IA: collapse 17 sidebar groups into the prompt's seven (Start here / Foundations / Components / Patterns and layouts / Integration / Reference / Contributor and decision history). OWNER CALL.
- 369.1 — should printing from the DARK theme force the light palette? OWNER OR ARCHITECTURE CALL.
- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.12 — Archival trigger for `ROADMAP.md`.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Dependency-blocked

Open items with an `After:` target still open. Each releases when its last target closes. An item that is also owner-blocked says so: its dependency outlasts the owner's answer.

- 397.1 — after 394.4, 394.5, 394.6, 394.7, 394.8, 394.17, 396.3, 396.4
- 397.2 — after 393.11, 393.12, 394.1, 394.2, 394.3, 394.4, 394.5, 394.6, 394.7, 394.8, 394.9, 394.10, 394.11, 394.12, 394.13, 394.14, 394.15, 394.17, 394.18, 395.1, 395.2, 396.1, 396.2, 396.3, 396.4, 396.5, 396.6, 396.7, 396.8, 396.9, 396.10, 396.11, 396.12, 396.13, 397.1
- 396.1 — after 394.1, 394.2, 394.9
- 396.2 — after 394.10
- 396.3 — after 395.1, 396.1, 396.2, 394.8, 394.9, 393.12
- 396.4 — after 396.3
- 396.5 — after 396.2, 396.3, 396.4, 397.1
- 396.6 — after 396.13
- 396.7 — after 396.13
- 396.8 — after 396.13
- 396.9 — after 396.13
- 396.10 — after 396.13
- 396.11 — after 394.2, 396.13
- 396.12 — after 395.1, 394.2
- 396.13 — after 396.5 (also owner-blocked)
- 395.1 — after 394.1, 394.2, 394.11, 393.12
- 395.2 — after 395.1, 394.7
- 394.4 — after 394.1
- 394.5 — after 394.4
- 394.6 — after 394.4
- 394.7 — after 394.4, 394.5
- 394.9 — after 394.1, 394.2
- 394.10 — after 394.9
- 394.14 — after 394.12, 394.13, 394.18
- 394.15 — after 394.14
- 394.16 — after 394.15 (also owner-blocked)
- 394.17 — after 394.4, 394.5, 394.6, 394.7, 394.8
- 393.7 — after 393.6
- 393.10 — after 393.5, 393.6, 393.7, 393.8, 393.9
- 393.12 — after 393.11
- 249.7 — after 249.10

## Parked

Open items with a `Parked:` line. Held only while that milestone is ACTIVE.

(none)

## Browser-blocked

Open items marked `NEEDS-BROWSER`: they need Podman and screenshots, so a local wake can take them and a cloud wake cannot (LOOPS.md rule 4). Listed, not held — the one dispatcher is local.

(none)

## Owner markers quoted only in code

Open items whose only owner marker sits inside a code span or fence, so they are NOT counted as owner-blocked. Usually an item describing the markers; if one is really blocked, write its marker in prose.

(none)

## Last 10 iterations

- 2026-09-25 05:14 · Continue · bug · 391.2 — check:claims' SC 2.5.7 file-chooser wait 5s -> 15s. Failed on CI at 2 of 4 observed runs (88ba16bb, 07aef5bf; both markdown-only diffs, byte-identical payload, geometry block healthy). The one permitted re-run came back green and that green was refuted by the next push — a single passing re-run is not evidence of rarity. Patience raised, assertion unchanged (opened===true still required); not skipped, disabled or quarantined. CI green on 45aa4d1d · landed · 45aa4d1d
- 2026-09-25 13:32 · Objective · grill · Slice 392 — Objective grill of 388.1, 389.4, Slice 390 (renumbered from 391, collision 8); P0 392.1 filed · landed · e8ac9844
- 2026-09-25 14:12 · Continue · fix · 392.1 — P0: a scan verdict stamped while a flash is live restarts the flash · landed · a16d4ff3
- 2026-09-25 20:24 · Roadmap · triage · M1 milestone triaged as DRAFT; Slice 393 (M0) approved as bootstrap; owner O1-O4 applied (one dispatcher, park, cap 12, naming rule) · triaged · c8d2ccb7
- 2026-09-25 20:34 · Continue · build · 393.1 — one dispatcher: Step 0 guard (HALT, checkout, foreign commits) · landed · b17b36e7
- 2026-09-25 20:44 · Continue · build · 393.2 — in-flight protocol (partial): inflight.py + Step 0 hold + cap; cap proven live at 2 min (test task stopped, 33 of 60 lines unfinished) · landed · 8fcf50c2
- 2026-09-25 21:15 · Continue · build · 375.11 — zoom half fixed: grid message never covers its field at 400% (0/360); Firefox half open · landed · 24b4cb69
- 2026-09-25 22:03 · Continue · build · 393.2 — one real hold measured at 2 tool calls; in-flight protocol closed · landed · 3c142f20
- 2026-09-25 22:03 · Continue · build · 393.3 — backlog mirror: every kind of wait, own-line markers reconciled, oldest dispatchable computed (375.11) · landed · 3c142f20
- 2026-09-25 22:03 · Meta · refusal · marking 394.13 owner-blocked for one O15-dependent Accept bullet — a marker would hold the whole item · refused · 3c142f20

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
