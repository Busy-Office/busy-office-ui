# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror — rebuildable from ROADMAP.md and the loop log, so never edit it by hand. Unlike `loops.db` it is COMMITTED: CLAUDE.md's rule is that a queryable binary stays git-ignored while a file a human reads and reviews stays in git, and this one is read.

Generated at: 2026-09-26 20:02 UTC

oldest dispatchable: 387.2 — a frozen cell's message still has two covers above it.

Dispatcher rule 4's pick, computed: the oldest open item that no owner marker, open `After:` target or held `Parked:` line holds — and, while a milestone is ACTIVE, that the milestone does not tag (rule M dispatches those; `dispatch_status.py` prints its pick). No GOAL overrides it: the owner's M0 bootstrap (O3), the one exception there was, ended with 398.5. A named item without a number has no age to rank by; any that nothing holds is listed here instead of being dropped.

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
- **Slice 376** (1 open)
  - 376.5 — the app-launch launcher hand-rolls a dialog header.
- **Slice 377** (3 open)
  - 377.3 — the completion gate cannot see a revision.
  - 377.6 — is busy-office-erp the named first user?
  - 377.10 — the Jev band, re-measured with the question form Rubric 2 prescribes, and the set recorded.
- **Slice 387** (2 open)
  - 387.2 — a frozen cell's message still has two covers above it.
  - 387.3 — is the fallback's permanent horizontal scrollbar still needed?
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
- **Slice 392** (3 open)
  - 392.2 — a pressed toggle differs from an unpressed one by colour alone in normal colours.
  - 392.3 — a `--bar` label with one word wider than its slot paints past its button.
  - 392.5 — the comparator deltas are recorded nowhere a later grill reads them.
- **Slice 393** (3 open)
  - 393.11 — a close is verified on HEAD alone (folds 377.3).
  - 393.12 — worktree isolation and fan-in, as code.
  - 393.13 — the Step 0 read cost, measured on the first ACTIVE milestone wake (393.8's fourth clause, moved here).
- **Slice 394** (17 open)
  - 394.1 — OWNER CALL: naming doctrine. Every published name names a shape (owner answer 2; roundtable 2026-09-25).
  - 394.2 — OWNER CALL: the app, the module list and the device classes (folds 377.6; owner answer 3).
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
- **Slice 398** (2 open)
  - 398.3 — `milestone.py` counts a field as filled only when the owner filled it.
  - 398.4 — a `Modules` value that is not ` · `-separated is refused, not read as one module.
- **Slice 399** (4 open)
  - 399.1 — the stale statements the 398.5 scorers found, and the sweep for their siblings.
  - 399.2 — the in-flight check reads a drifted heading as "nothing in flight".
  - 399.4 — the loop-written owner fields and the activation rule (both scorers' Safety finding).
  - 399.5 — a `.roundtable`-only commit broke CI for five pushes, and no local step saw it.
- **Slice 401** (4 open)
  - 401.1 — `bo-check-markup` fails closed on every root that yields no HTML (G401-2, a regression shipped in 0.9.0).
  - 401.2 — the 0.9.0 CHANGELOG says what 0.9.0 actually does (G401-1, G401-3, g375-F1, g392-F3).
  - 401.3 — 392.1's restart survives a consumer's tree-shaking, or the limit is recorded (g392-F1, g392-F2).
  - 401.4 — how a repeat verdict is acknowledged without motion (g392-F3).
- **Slice 403** (2 open)
  - 403.1 — the pointer-coverage gate cannot be satisfied by a comment, and it reads what it could not classify.
  - 403.2 — the seven trusted cases assert what their names claim (cases-F1, F2, F5, F6 and the two nits).
- **Slice 404** (1 open)
  - 404.2 — switching versions keeps the reader's page, and a snapshot's landing page says it is a snapshot.
- **Slice 406** (5 open)
  - 406.2 — 404.1's follow-ups.
  - 406.3 — the ACR's verdicts rest on detectors that can miss what they certify.
  - 406.4 — `ci_timings.py`'s reconciliation shares the recogniser it checks, and the recorder downgrades a refused STATUS.md.
  - 406.5 — the byline demo's avatar 404s on Pages.
  - 406.7 — the forest-light focus ring is 2.99:1 on `bg-muted`.
- **Slice 408** (3 open)
  - 408.1 — grid ring placement follows fill, not element name.
  - 408.2 — the container stamp's dirty half is enforced, and ignored inputs are visible.
  - 408.3 — the combobox case asserts the event's VALUE, not only its text.
- **Slice 411** (9 open)
  - 411.1 — the object-page anchor strip loses the reader at narrow widths.
  - 411.2 — the published CSS under the copyable Markup reproduces the overlap 377.16 fixed.
  - 411.3 — 377.16's check-claims case is LTR-only.
  - 411.4 — object-page's States table overflows the main pane at 320.
  - 411.5 — two docs sentences 377.14 (d) found false were never filed.
  - 411.6 — nothing floors the derived seam list.
  - 411.7 — the band needle and the sidebar-nav demo frames.
  - 411.8 — 377.14 (d)'s counts cannot be re-derived.
  - 411.9 — the file-picker case passes when the click is cancelled.
- **Slice 413** (5 open)
  - 413.1 — bound the fallback message's height, or say what it can do.
  - 413.2 — `position: relative` gives the message the scrollport as its box.
  - 413.3 — an unbreakable token still lengthens the scroller (fallback only).
  - 413.4 — the claims that cannot fail.
  - 413.5 — 384.1's write-up states the basis of the ratchet floor.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1870 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-09-27 03:43   ok
  (Objective row 2026-09-27 04:02 did not reset rule 3: .roundtable/grill-objective-384-386-387-412-2026-09-27.md: no `## Thesis section`)
  Objective     4 / 3 slices          since 2026-09-27 00:50   OVERDUE  [384, 386, 387, 412]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      2 wake-date(s) newer   since 2026-09-25 05:14   STALE   [newest pair: claims; 161 sample(s), 8 of 52 name(s) paired across days]
  -> rule 5's newest comparable pair predates 2 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-25, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-25 (2026-09-26, 2026-09-27), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (44 of 52 name(s) have only one day and are not an input to a rule that compares two runs). Each delta is DAY-CLOSE to DAY-CLOSE (the last sample of each day, roadmap 372.1); `[k same-day]` marks a day whose other samples are folded in, not shown:
       dispatch-region-words       7d  2026-09-26 10374 words -> 2026-09-27 10374 words  +0   [5 same-day]
       claims                      6d  2026-09-19 203 count -> 2026-09-25 311 count  +108
       gates                       4d  2026-09-07 55 count -> 2026-09-09 56 count  +1
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4   [2 same-day]
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1   [6 same-day]
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5   [3 same-day]
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2   [2 same-day]
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
     a direction is NOT recorded on purpose (roadmap 324.1): adding one makes rule 5 fire on `bundle-gz-kb`'s four consecutive rises, which the log's own same-timestamp `components` samples refute (0.400 -> 0.355 kB per component over that window). A rise with no denominator is growth. Where a name has a real threshold, use it — `check:size` gates the bundle at 16.7 kB gz, which is rule 5's budget clause, not its trend one.
     not rule 5's input: 24 adoption-* name(s), the Objective grill's reading of the world (377.7), never a size or speed regression.
  Holds         8 hold-wake(s) recorded, 7 today (UTC dates)   [inflight.py hold; .roundtable/hold-wakes.jsonl]
```

## Milestone progress

Generated from the `Milestone: Mn · Phase: n` markers on every item, open or closed (roadmap 393.8). The milestone's own status is its `Status:` field.

- **M1** — DRAFT
  - Phase 0: 13 of 16 closed
  - Phase 1: 1 of 22 closed
  - Phase 2: 0 of 34 closed
  - Phase 3: 0 of 2 closed

## Owner-blocked

Open items carrying an owner marker (`BLOCKED ON`, `OWNER CALL`, `OWNER OR <X> CALL`, `OWNER ·`, `NEEDS-RUNTIME`, or `Route: owner`) — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 396.13 — OWNER CALL: the form the remaining modules take (full module sets, or job rows plus screens only where a new shape is needed), decided on 396.5's result.
- 394.1 — OWNER CALL: naming doctrine. Every published name names a shape (owner answer 2; roundtable 2026-09-25).
- 394.2 — OWNER CALL: the app, the module list and the device classes (folds 377.6; owner answer 3).
- 394.16 — OWNER CALL: promote the queue screen, keep it in shadow, or retire it.
- 394.18 — OWNER CALL: declare the queue screen as Jev's third point (O13), say what may leave the machine, and choose its mode before promotion.
- 389.6 — The journey's RF step exits to an RF home.
- 389.7 — The journey's RF confirm and failure verdict are in view at a rugged viewport.
- 377.6 — is busy-office-erp the named first user?
- 375.11 — what 375.9 measured and did not fix.
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
- 397.2 — after 393.11, 393.12, 394.1, 394.2, 394.4, 394.5, 394.6, 394.7, 394.8, 394.9, 394.10, 394.11, 394.12, 394.13, 394.14, 394.15, 394.17, 394.18, 395.1, 395.2, 396.1, 396.2, 396.3, 396.4, 396.5, 396.6, 396.7, 396.8, 396.9, 396.10, 396.11, 396.12, 396.13, 397.1
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
- 393.12 — after 393.11
- 392.5 — after 394.11
- 389.1 — after 396.12
- 389.2 — after 396.12
- 389.5 — after 396.12
- 389.6 — after 396.12 (also owner-blocked)
- 389.7 — after 396.12 (also owner-blocked)
- 389.8 — after 396.12
- 389.9 — after 396.12
- 389.10 — after 396.12
- 389.11 — after 396.12
- 389.12 — after 396.12
- 389.13 — after 396.12
- 389.14 — after 395.1
- 389.15 — after 396.12
- 389.17 — after 396.12
- 389.18 — after 396.12
- 389.20 — after 396.12
- 389.21 — after 396.12
- 389.22 — after 396.12
- 377.3 — after 393.11
- 377.10 — after 394.12
- 376.5 — after 395.1
- 249.7 — after 249.10, 394.9

## Parked

Open items with a `Parked:` line. Held only while that milestone is ACTIVE.

- 398.3 — M1, not held
- 398.4 — M1, not held
- 391.1 — M1, not held

## Browser-blocked

Open items marked `NEEDS-BROWSER`: they need Podman and screenshots, so a local wake can take them and a cloud wake cannot (LOOPS.md rule 4). Listed, not held — the one dispatcher is local.

(none)

## Owner markers quoted only in code

Open items whose only owner marker sits inside a code span or fence, so they are NOT counted as owner-blocked. Usually an item describing the markers; if one is really blocked, write its marker in prose.

(none)

## Last 10 iterations

- 2026-09-27 01:23 · Continue · build · 384.1 — both refused on the number: dispatch-region growth since 4e6b83c1 is 11.5-15.8% narrative, ~85% instruction (two blind labellers); charter line and high-water anchor refused · refused · 39bfa34d
- 2026-09-27 01:23 · Meta · refusal · 384.1: charter line (targets <=16% of growth; restates lane 4's third branch) · refused · 39bfa34d
- 2026-09-27 01:23 · Meta · refusal · 384.1: high-water anchor and region floor (anchor would never move; floor misses the 101-word case) · refused · 39bfa34d
- 2026-09-27 01:45 · Continue · fix · 386.1 — check:layout print probe: body white/black under print emulation in both themes over 128 docs + 28 suite pages (base rate 0/312); red-proved 3 ways; earlier 0-rule injection corrected · landed · 3c840c02
- 2026-09-27 01:45 · Meta · refusal · 386.1: sharing one source for the ten copies (still loses silently on a NEW page) · refused · 3c840c02
- 2026-09-27 03:16 · Continue · fix · 387.1 — data-table message no longer lengthens the scroller/page without anchor positioning: press after reading lands (a) and sticky bar holds (b); simulated in one engine; 4 claims (364 total); rf-essentials 41,966/41,984; filed 387.3 · landed · d808dc7f
- 2026-09-27 03:21 · Roadmap · triage · Jev 0.10/0.11 migration landed, owner-approved 2026-09-27: CLAUDE.md, LOOPS §6 step 4, jev-rubrics v2, local/grill-finding judge; MCP path retired · triaged · afb2f38b
- 2026-09-27 03:34 · Continue · fix · red main on a8fae14b/17dddf66: 387.1's path (a) counterfactual claim failed on CI (the sideways wheel did not scroll in 300ms on Linux); case now waits for the wheel and falls back to scrollLeft, recording which; verified real and stubbed wheel locally · landed · 464f1e57
- 2026-09-27 03:43 · Standardize · sweep · Slice 412 — 4 of 4 lanes (isolated build): lanes 1, 3 equal Slice 410; lane 2 +1 rule (387.1's position: relative, traced); lane 4 dispatch region 10,374; CLAUDE.md +405 on the approved Jev section · landed · c7af39f2
- 2026-09-27 04:02 · Objective · grill · Slice 413 — grill of 384.1/386.1/387.1/412: 387.1's fix trades a horizontal lengthening for a vertical one (not within six lines); overclaims corrected, 413.1-413.5 filed · landed · 1565560b

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
