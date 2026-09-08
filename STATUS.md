# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-08 00:17 UTC

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
- **Slice 320** (2 open)
  - 320.2 — judge each declaration separately, so a dead one cannot hide behind a live sibling.
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 322** (1 open)
  - 322.3 — should a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md` be taken whitespace-normalised by default?
- **Slice 323** (1 open)
  - 323.1 — the script's existing base-rate command, the one quoted above `metric_samples`, is an as-of-DATE replay and is now known to be blind to states that live less than a day.
- **Slice 324** (2 open)
  - 324.1 — a sample records no DIRECTION, so even a fresh, well-paired metric cannot yield a verdict.
  - 324.2 — `bundle-gz-kb` is the only metric rule 5 can act on, its generator exists, and its noise floor is wider than three of its four historical moves.
- **Slice 325** (2 open)
  - 325.1 — a docs page can name an `npm run` command and nothing checks the command exists.
  - 325.2 — `measure:stress`'s render columns have no counterpart in the published table, and the published table's method is unrecoverable.
- **Slice 326** (1 open)
  - 326.3 — the dispatch region has grown +1,101 words in two days with no narrative left in it to cut. What is the answer when the region a wake must read grows because the RULES grew?
- **Slice 327** (1 open)
  - 327.3 — the one instrument gap this grill could not close: nothing distinguishes a claim that was MEASURED from one that was read off the code, inside a slice whose other claims were measured.
- **Slice 328** (1 open)
  - 328.1 — The `Demo`-component detector has now produced a wrong count twice, a month apart, and nothing stops a third.
- **Slice 330** (1 open)
  - 330.1 — Sampling is now a named failure mode here, twice.
- **Slice 331** (1 open)
  - 331.1 — `install-prompts.md`, generated from `api.json`.
- **Slice 332** (1 open)
  - 332.1 — `ENVIRONMENT.md` doubled in 8 days and every wake reads all of it.
- **Slice 333** (1 open)
  - 333.1 — should a gate forbid a never-used frontmatter `const` in an `.astro` page?
- **Slice 334** (1 open)
  - 334.1 — should `check-selftests.mjs` itself be `@heuristic` now?
- **Slice 335** (1 open)
  - 335.1 — The Discussions intake has never returned a non-empty list, in either environment.
- **Slice 336** (1 open)
  - 336.2 — should `report:prose` print the flagged UNION, since that is what its lane is defined on?
- **Slice 337** (1 open)
  - 337.1 — A Standardize lane that never RAN is recorded as clean, and nothing in the sweep can tell the two apart.
- **Slice 338** (1 open)
  - 338.1 — the gap `check:print-tokens` cannot see: a theme token that reaches paper through the ORDINARY CASCADE.
- **Slice 339** (1 open)
  - 339.2 — the sweep's re-scan found a SECOND section with the same unexecuted charter, and this item is deliberately not the fix.
- **Slice 341** (1 open)
  - 341.1 — Step 0c's generator has TWO outputs and its charter throttles only one. The cut lasted exactly one commit.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1636 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-07 21:52   ok
  Objective     0 / 3 slices          since 2026-09-08 00:17   ok
  Optimize      0 wake-date(s) newer   since 2026-09-07 23:29   SKEW   [newest pair: claims; 137 sample(s), 7 of 46 name(s) paired across days]
     1 further date(s) (2026-09-08) are NOT counted above: every row on them is naive-later than the pair by less than the 8h between the two dispatchers' clocks, so the ordering is undetermined, not stale (roadmap 306.1). Both files carry naive local stamps and neither says which clock wrote it. Recording another metric does not move this line.
     rule 5's comparable set — 7 name(s) sampled on 2+ distinct days (39 of 46 name(s) have only one day and are not an input to a rule that compares two runs):
       claims                      4d  2026-09-06 169 count -> 2026-09-07 176 count  +7
       gates                       3d  2026-08-19 27 count -> 2026-09-07 55 count  +28
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-07 19:07 · Meta · refusal · building 336.2 inside the grill — the union question is filed with its base rate, not answered here · refused · 86f034ce
- 2026-09-08 03:15 · Objective · grill · Objective grill of 297 (collision 5 — the cloud dispatcher ran the same rule and took 315/332/333, so those are ceded to its Slice 336). Defect: 297 called config.yml a third 'template' that 'enforces', when it is the router whose first line is blank_issues_enabled:true — the escape hatch counted as an enforcer. The archive entry it compressed had said 'blank issues on' outright, and Slice 335 spent an API round-trip rediscovering it. Filed 337.1. · landed · 69e43460
- 2026-09-07 19:53 · Continue · build · 316.1 — check:print-tokens: no theme colour token inside @media print, red-proved twice · landed · e4742fd4
- 2026-09-07 19:53 · Meta · refusal · the exemption list 316.1 anticipated for print-color-adjust:exact fills — measured, all three such rules declare no colour inside @media print at all · refused · e4742fd4
- 2026-09-07 21:52 · Standardize · sweep · Slice 339 — Standardize sweep 4 of 4 lanes: lanes 1-3 clean (0 dead of 1,365 attrs; css-repeats 74/242/230/8 a 5th time; 15 flagged prose pages all inside the pinned 16-set). Lane 4's finding is a THIRD case 308.1's fork does not name: Step 0c held FLAT at 936 across 15 commits after 274.2's cut, then two collision write-ups took it to 1,500 — past its pre-cut 1,378. The cut held; the charter behind it was never executed. Applied the charter (forensics to LOOPS-archive.md, instruction inline) rather than cutting again; 1,322 net, and the first attempt moving only 13 words is recorded · landed · f9e0f17d
- 2026-09-07 23:29 · Continue · build · 319.3 — check:target-size cannot see a named pixel size (red-proved); growth refused on cost+blindness, six pixel claims moved to check:claims · landed · 0d8cc85f
- 2026-09-07 23:29 · Meta · refusal · growing check:target-size's page list 7 -> 14: +86% CI time, identical exempted set, and the gate's predicate cannot see a pixel claim at all · refused · 0d8cc85f
- 2026-09-08 00:17 · Meta · collision · collision 5 recorded per 274.2's charter — both dispatchers ran rule 4 on 319.3, same verdict, same slice number; loser discarded after all 17 gates green · logged · aac39366
- 2026-09-08 00:17 · Meta · refusal · re-running the rule-4 dispatch on 319.3 — the winner's analysis strictly dominated, so the loser's output was checked and discarded · refused · aac39366
- 2026-09-08 00:17 · Objective · grill · Slice 341 — grill of 316/319/339: 17 of 17 assertions reproduce; 341.1 filed — Step 0c's cut lasted one commit and its generator has an unnamed second output · landed · aac39366

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
