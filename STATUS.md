# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-08 02:49 UTC

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
- **Slice 342** (1 open)
  - 342.1 — the 52 are a lane-1 finding, not this item's to spend.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1642 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-07 21:52   ok
  Objective     2 / 3 slices          since 2026-09-08 00:17   ok  [320, 322]
  Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok   [newest pair: dispatch-region-words; 139 sample(s), 8 of 47 name(s) paired across days]
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

- 2026-09-07 23:29 · Meta · refusal · growing check:target-size's page list 7 -> 14: +86% CI time, identical exempted set, and the gate's predicate cannot see a pixel claim at all · refused · 0d8cc85f
- 2026-09-08 00:17 · Meta · collision · collision 5 recorded per 274.2's charter — both dispatchers ran rule 4 on 319.3, same verdict, same slice number; loser discarded after all 17 gates green · logged · aac39366
- 2026-09-08 00:17 · Meta · refusal · re-running the rule-4 dispatch on 319.3 — the winner's analysis strictly dominated, so the loser's output was checked and discarded · refused · aac39366
- 2026-09-08 00:17 · Objective · grill · Slice 341 — grill of 316/319/339: 17 of 17 assertions reproduce; 341.1 filed — Step 0c's cut lasted one commit and its generator has an unnamed second output · landed · aac39366
- 2026-09-08 00:53 · Continue · build · 320.2 — scan:dead-style judges each declaration on its own; the blind spot was NOT empty: 52 dead declarations on 13 pages, all inside attributes the attribute verdict calls live, reconciled against the re-measured 357-of-1365 corpus rather than 320.2's stale 273. Self-test gains a mixed control and fails on exactly one of five assertions when the verdict is put back to the whole attribute (red-proved by injection). 342.1 files the 52 for the next Standardize lane 1 · landed · cdfcb129
- 2026-09-08 00:53 · Meta · refusal · a depth-aware declaration splitter — base rate 0 of 30,483 style attributes in dist carry a ';' inside a value, so it distinguishes nothing today (94.11) · refused · cdfcb129
- 2026-09-08 00:53 · Meta · refusal · fixing the 52 dead declarations inside this round — it mixes an instrument change with a corpus change and needs per-site judgement; filed as 342.1 · refused · cdfcb129
- 2026-09-08 00:53 · Meta · refusal · a thirteenth archive sweep — closed-history share 33.1%, below every measured trigger (55.1%, 56.7%, and the 40.6% at which 279.3 declined); sweeping would pre-empt the open owner call 249.12 · refused · cdfcb129
- 2026-09-08 02:49 · Continue · build · 322.3 — whitespace-normalised phrase-counts over the roadmap corpus · refused · a5c2ef0a
- 2026-09-08 02:49 · Meta · refusal · a shared normaliser in scripts/loops/ — base rate 1 of 14, and the caller count is zero · refused · a5c2ef0a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
