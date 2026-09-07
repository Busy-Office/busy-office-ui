# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 06:57 UTC

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
- **Slice 306** (1 open)
  - 306.1 — rule 5's staleness comparison must not be able to report "stale" for a reason that is only a timezone.
- **Slice 307** (1 open)
  - 307.1 — Rule 5 starves structurally: 42 metric names, 130 samples, 13 names sampled twice.
- **Slice 309** (1 open)
  - 309.5 — The `/stress` harness is half a harness: the rows are kept, the measurement is not.
- **Slice 310** (2 open)
  - 310.1 — `examples/erp-suite` and `examples/po-app` render deprecated glyphs, and whether that is a defect is undecided.
  - 310.2 — `/base/motion` declares five copyable markup samples the template never renders.
- **Slice 315** (1 open)
  - 315.3 — should `check:selftests` EXECUTE each self-test rather than grep for the branch? Filed with its base rate, deliberately not built inside a grill.
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice 319** (1 open)
  - 319.3 — should a docs page be allowed to assert a target size at all without a gate that can see it?
- **Slice 320** (2 open)
  - 320.2 — judge each declaration separately, so a dead one cannot hide behind a live sibling.
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 322** (1 open)
  - 322.3 — should a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md` be taken whitespace-normalised by default?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1581 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-07 05:14   ok
  Objective     0 / 3 slices          since 2026-09-07 06:57   ok
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

- 2026-09-07 05:14 · Meta · refusal · base/primitives.astro's four margin-block-start: 1.5rem — inside copyable samples, out of 292.8's live-markup scope · refused · 7dacd80b
- 2026-09-07 05:14 · Meta · refusal · ClassRef.astro:44's off-scale .4rem — unifying it with ApiTable's 0.5rem is a rendered change a cloud wake cannot judge; filed as 320.3 · refused · 7dacd80b
- 2026-09-07 05:14 · Meta · refusal · --bo-space-0 as the spelling of a zero — refused on evidence, it has never been used anywhere · refused · 7dacd80b
- 2026-09-07 05:14 · Meta · refusal · fixing scan:dead-style's per-declaration detection inside this round — it moves a number five write-ups quoted; filed as 320.2 · refused · 7dacd80b
- 2026-09-07 05:45 · Continue · build · 305.1 — the gauntlet artifact three blind critic rounds graded is in no commit; LOOPS.md §7 gains the committed-path clause · landed · cbd8419d
- 2026-09-07 05:45 · Meta · refusal · 305.2's proposed §7 step — 1 of 12 findings gate-catchable, and step 1 already says 'the repo's gates green' · refused · cbd8419d
- 2026-09-07 05:45 · Meta · refusal · a gate over 'open items cite resolvable paths' — 2 of 10 legitimate absences on a healthy tree (94.11) · refused · cbd8419d
- 2026-09-07 06:57 · Objective · grill · Slice 322 — grill of 304/305/320: 26 of 29 reproduce, and both defects are a COUNT published beside a fix that was red-proved correctly. 320's wrong-noun blast radius is 17 Standardize sweeps (208..314, all 17), not the published 'five consecutive (214,284,290,301,314)' — and this grill's own first line-based scan reproduced the same undercount, missing exactly 301 whose phrase wraps a newline. 304's base rate (11/7/4) carries no command and is not re-runnable; re-derived from its stated form it is corpus 10, split 8 parent / 0 commit / 2 neither — the same omission 304 diagnoses in Slice 301 two paragraphs earlier. Both corrected in place per 236.2 with the commands recorded; 322.3 filed open · landed · ccb7d3ce
- 2026-09-07 06:57 · Meta · refusal · a gate over 'this count was taken correctly' — not a checkable shape; it would have to re-run every count in the corpus against an instrument nobody wrote down (94.11) · refused · ccb7d3ce
- 2026-09-07 06:57 · Meta · refusal · adjudicating 304's '3 of 11 name a revision' half — the verdict depends on how wide a window counts as surrounding text (a ±3-line window returns 4 of 9), so it is reported undecidable rather than scored · refused · ccb7d3ce

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
