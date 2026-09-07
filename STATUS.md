# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 00:48 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (7 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 294** (1 open)
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 297** (1 open)
  - 297.1 — The first real intake run is the test of this, not the config.
- **Slice 300** (1 open)
  - 300.2 — Issue #2: no board/kanban component, triaged, NOT built.
- **Slice 304** (1 open)
  - 304.1 — `roadmap_scope.py`'s figures should be quotable only with a revision.
- **Slice 305** (2 open)
  - 305.1 — The four defects round 3 left standing.
  - 305.2 — Run the repo's own gates on a gauntlet artifact BEFORE spending a critic round.
- **Slice 306** (1 open)
  - 306.1 — rule 5's staleness comparison must not be able to report "stale" for a reason that is only a timezone.
- **Slice 307** (1 open)
  - 307.1 — Rule 5 starves structurally: 42 metric names, 130 samples, 13 names sampled twice.
- **Slice 309** (1 open)
  - 309.5 — The `/stress` harness is half a harness: the rows are kept, the measurement is not.
- **Slice 310** (2 open)
  - 310.1 — `examples/erp-suite` and `examples/po-app` render deprecated glyphs, and whether that is a defect is undecided.
  - 310.2 — `/base/motion` declares five copyable markup samples the template never renders.
- **Slice 314** (1 open)
  - 314.2 — the same scope gap exists for SPACING and `font-weight` literals, and it is a different property with no verdict — filed, not built.
- **Slice 315** (1 open)
  - 315.3 — should `check:selftests` EXECUTE each self-test rather than grep for the branch? Filed with its base rate, deliberately not built inside a grill.
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1562 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-06 22:53   ok
  Objective     1 / 3 slice           since 2026-09-06 23:47   ok  [298]
  Optimize      1 wake-date(s) newer   since 2026-09-06 16:56   STALE   [newest pair: axe-violations; 132 sample(s), 13 of 44 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-06, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-06 (2026-09-07), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-06 21:11 · Roadmap · triage · Slice 312 filed P0 — check:ci-ignores asserts nothing CI runs reads .roundtable/**, and check:floor + check:vendor-names both do; red-proved by injection · triaged · e4d0459f
- 2026-09-06 21:54 · Continue · bug · 312.1/312.2 — check:ci-ignores could only see a read that NAMES the path; widened to enumeration + path-root routes, verdict matched against an fs-spy trace and a per-gate injection probe (7/7 pairs), and paths-ignore removed · landed · 024445f5
- 2026-09-06 21:54 · Meta · refusal · a second cheap workflow running the three repo-wide prose gates on the ignored paths — it needs a hand-kept list of which gates are repo-wide · refused · 024445f5
- 2026-09-06 21:54 · Meta · refusal · making the three gates stop reading .roundtable/** and STATUS.md — that reverses 256.2, the standing product-name instruction, and check:slice-refs' reason for existing · refused · 024445f5
- 2026-09-06 22:53 · Standardize · sweep · Slice 314 — Standardize sweep 4 of 4 lanes clean; step 4's re-scan found 292.8's scope excluded the 24 shared components/layouts, and 314.1 tokenises the two font-size literals there · landed · f5c6ecd1
- 2026-09-06 22:53 · Meta · refusal · 314.2 — widening the sweep to spacing/font-weight inline literals: a different property with no verdict; base rates measured (8.6% pages / 21.9% shared), filed not built, and no gate added · refused · f5c6ecd1
- 2026-09-06 23:47 · Objective · grill · Slice 315 — grill of 294/312/314: check:ci-ignores' --self-test unreachable since 312.2 (0 of 18 cases), fixed; 294's 139-hex base rate unreproducible, amended · landed · 066d9878
- 2026-09-06 23:47 · Meta · refusal · executing each self-test inside check:selftests — base rate 1 of 20 and no single parseable output shape across the heuristic gates; filed as 315.3 instead · refused · 066d9878
- 2026-09-07 00:48 · Continue · build · 298.1 — fixed-medium artifact convention: the second precedent predates the first by 25 days; a theme token in @media print prints at 2.54:1 on white paper · landed · 810e37fa
- 2026-09-07 00:48 · Meta · refusal · building the @media-print token gate in the same round — filed as 316.1 with its base rate measured (0 of 11) rather than manufactured alongside the convention · refused · 810e37fa

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
