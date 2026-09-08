# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-08 07:20 UTC

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
- **Slice 320** (1 open)
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 324** (1 open)
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
- **Slice 345** (1 open)
  - 345.1 — should `.bo-motion-spin` own its `display: inline-block`?
- **Slice 346** (1 open)
  - 346.1 — Slice 343 refused a whitespace normaliser on a caller census of counting INSTRUMENTS. The failure recurred the next wake in a population that census did not measure: a wake's own grep checking that a correction it just made landed everywhere.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1653 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-09-08 04:59   ok
  Objective     2 / 3 slices          since 2026-09-08 05:54   ok  [324, 347]
  Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok   [newest pair: dispatch-region-words; 140 sample(s), 8 of 47 name(s) paired across days]
     rule 5's comparable set — 8 name(s) sampled on 2+ distinct days (39 of 47 name(s) have only one day and are not an input to a rule that compares two runs):
       dispatch-region-words       2d  2026-09-07 7298 words -> 2026-09-08 7492 words  +194
       claims                      4d  2026-09-06 169 count -> 2026-09-07 176 count  +7
       gates                       3d  2026-08-19 27 count -> 2026-09-07 55 count  +28
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
     a direction is NOT recorded on purpose (roadmap 324.1): adding one makes rule 5 fire on `bundle-gz-kb`'s four consecutive rises, which the log's own same-timestamp `components` samples refute (0.400 -> 0.355 kB per component over that window). A rise with no denominator is growth. Where a name has a real threshold, use it — `check:size` gates the bundle at 16.7 kB gz, which is rule 5's budget clause, not its trend one.
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

- 2026-09-08 03:49 · Meta · refusal · reconciling the two base-rate replays into one — measured: the liveness question reads 335 live / 645 not live at commit granularity against 15 of 27 wake-dates, so the unit changes no conclusion · refused · b1ce1263
- 2026-09-08 03:49 · Meta · refusal · restating timedelta(hours=8) inside the recorded snippet — a constant copied into prose is the drift observed_skew() exists to catch; it imports the module's own instead · refused · b1ce1263
- 2026-09-08 04:59 · Standardize · sweep · 342.1 — lane 1 verdict per site: 41 dead declarations converted, 11 refused, re-run lands on the refusal set · landed · 161ede68
- 2026-09-08 04:59 · Meta · refusal · PatternPreview / inline-size:100% / combobox listbox margin / state-patterns Demo literal / motion spinner / AppTile BOX height / zero spacing swatch — 11 dead declarations kept, each dead only in the docs container · refused · 161ede68
- 2026-09-08 05:54 · Objective · grill · 322/342 — 20 of 22 reproduce; both defects recur what 322 filed: a number with no command, and a correction missed because the phrase wraps · logged · 6cfe380c
- 2026-09-08 06:50 · Continue · build · 324.1 — a DIRECTION field on a metric sample: 1 of 8 day-paired names is directional from its unit, and supplying a direction makes rule 5 fire on bundle-gz-kb's four consecutive rises, which the log's own same-timestamp components samples refute (0.400 -> 0.355 kB per component) · refused · 5b78e4f
- 2026-09-08 06:50 · Meta · refusal · a per-NAME direction registry in dispatch_status.py — base rate: it would cover 8 names, of which one can satisfy 'two consecutive', and that one (bundle-gz-kb) is already better served by check:size's 16.7 kB gz budget, which is rule 5's other clause · refused · 5b78e4f
- 2026-09-08 06:50 · Meta · refusal · recording a bundle-kb-per-component metric — 324.2 forbids sampling to un-STALE the line, and a 48th single-day name is the shape this slice just refused · refused · 5b78e4f
- 2026-09-08 06:55 · Continue · bug · 347.1 — polish_requeue.py --verify-stamps, the third advisory check LOOPS.md Step 0 says REPORTS, died with an unhandled traceback on a shallow clone; its docstring claimed that case landed in 'unknown' and it never could. Fourth verdict 'absent' added, red-proved by injection with a control · landed · f1e7eed3
- 2026-09-08 07:20 · Roadmap · trap · ENVIRONMENT.md 6d — actions/runs?head_sha= needs the FULL sha; a 9-char prefix answers 200 with an empty workflow_runs, which a poll loop reads as 'not started'. Cost this wake 20 minutes on runs that were already green. Trap 2's shape a third time · landed · c93ee1de

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
