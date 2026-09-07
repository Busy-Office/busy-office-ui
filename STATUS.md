# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 19:07 UTC

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
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice 319** (1 open)
  - 319.3 — should a docs page be allowed to assert a target size at all without a gate that can see it?
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
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1627 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-07 22:24   ok
  Objective     0 / 3 slices          since 2026-09-07 19:07   ok
  Optimize      1 wake-date(s) newer   since 2026-09-07 12:59   STALE   [newest pair: claims; 133 sample(s), 7 of 44 name(s) paired across days]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-07, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-07 (2026-09-08), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 7 name(s) sampled on 2+ distinct days (37 of 44 name(s) have only one day and are not an input to a rule that compares two runs):
       claims                      4d  2026-09-06 169 count -> 2026-09-07 170 count  +1
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       gates                       2d  2026-08-18 19 count -> 2026-08-19 27 count  +8
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

- 2026-09-07 14:49 · Meta · refusal · a gate over 'a never-used frontmatter const in an .astro page' — filed as 333.1 rather than built: the base rate after this fix is 0 of 152, and the ordinary tool is noUnusedLocals plus a tsconfig that would actually see docs .astro files, which nothing here has · refused · 422601c4
- 2026-09-07 14:49 · Meta · refusal · rendering the five as pre blocks — three of them contradict the live showcase they describe, so the render branch of 310.2's Accept ships worse than nothing without first rendering preview and code from one string · refused · 422601c4
- 2026-09-07 16:07 · Continue · build · 315.3 — check:selftests executes each heuristic gate's --self-test and asserts a case-count marker; base rate re-measured (0 of 20 run zero cases), 3 gates standardised, 334.1 filed · landed · ac4a9a0f
- 2026-09-07 16:07 · Meta · refusal · retagging check-selftests.mjs @heuristic inside this slice — it would move the two counts stamped on the npm front page (54/20/34 -> 55/21/34) and require a README re-stamp; filed as 334.1 instead · refused · ac4a9a0f
- 2026-09-07 16:07 · Meta · refusal · exit code alone as the execution signal — it cannot distinguish 18 passing cases from a branch that never ran, which is 315.1 exactly · refused · ac4a9a0f
- 2026-09-07 16:09 · Roadmap · plan · cloud-wake hand-off for Slice 334; rule 3 armed at 3/3 for the next wake · logged · ac4a9a0f
- 2026-09-08 03:00 · Continue · continue · 297.1 answered — both filed issues landed in Issues correctly, but zero labels prove both bypassed the templates entirely (blank_issues_enabled). Router never exercised; Discussions intake still never returned a non-empty list. Filed 335.1. · landed · 6a009a4b
- 2026-09-07 19:07 · Objective · grill · Slice 336 — grill of 315, 332, 333: 26 of 29 assertions reproduce; three defects, each a number reading a different population than its noun names · logged · 86f034ce
- 2026-09-07 19:07 · Meta · refusal · a gate for 'the noun matches the population' — semantic, 94.11's wall · refused · 86f034ce
- 2026-09-07 19:07 · Meta · refusal · building 336.2 inside the grill — the union question is filed with its base rate, not answered here · refused · 86f034ce

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
