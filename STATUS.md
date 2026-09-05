# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-05 21:55 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (8 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
  - 249.15 — The one static OG image 249.2 named and did not build.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 283** (1 open)
  - 283.3 — `--stamp` cannot verify its own output, and the fix for that is ordering plus an advisory check. Is that enough?
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1451 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-05 06:54   OVERDUE
  Objective     2 / 3 slices          since 2026-09-05 17:40   ok  [281, 283]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      2 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 2 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-05 19:11 · Polish · round · Slice 281 — data-table round 3: arm 16 re-took the spacing cite's live layout measurement; its worked example became unreachable by the rule 28h after it was measured, and all three live copies had dropped the sentence separating the two effects · landed · 6cb26268
- 2026-09-05 19:11 · Meta · refusal · a gate asserting the page a density comment cites is reachable by the rule — it discriminates today but gates one sentence in one comment and a prose edit returns it to silent · refused · 6cb26268
- 2026-09-05 19:48 · Roadmap · sweep · Slice 282 — twelfth archive sweep: 13 closed slices moved verbatim, ROADMAP.md 5,870 -> 3,179 at the move (share 46.5% -> 0.0%), identity red-proved 13/13 then 12/13 under injection; taken 3.5h after 5abdce3c refused the same sweep at 40.6%, and 282.2 records the five decisions lying on no threshold in either unit · landed · ed32eefd
- 2026-09-05 19:48 · Meta · refusal · inventing a sweep threshold in roadmap_scope.py from inside a dispatch — 249.12 is the open OWNER OR ARCHITECTURE call, and this wake is the one whose judgement is in dispute · refused · ed32eefd
- 2026-09-05 20:54 · Polish · round · Slice 283 — Polish round 3 on table-toolbar: NO-OP on the surface (4 arms clean); arm 17 found 7 of 13 polish_requeue re-queues are constants, 5 orphaned by 276.1's own path-set widening; report arm added and red-proved, --audit-stamps added · landed · fc79ea85
- 2026-09-05 20:54 · Meta · refusal · re-stamping the 5 pre-276.1 rows: exact, but a migrated stamp is introduced by the migration commit and would re-read orphan — the fix breaks its own detector; filed as 283.2 instead · refused · fc79ea85
- 2026-09-05 20:54 · Meta · refusal · incrementing dry on this no-op round — 273.2 is the open owner call and §3b's practice has never done it · refused · fc79ea85
- 2026-09-05 21:55 · Continue · build · 283.2 — stamp revision as an optional suffix; 7 rows migrated; --verify-stamps advisory post-commit · landed · 9c1bacbe
- 2026-09-05 21:55 · Meta · refusal · a MANDATORY revision on every stamp — --stamp runs before its own commit, and 0 of 18 stamps reproduce at the HEAD it would record · refused · 9c1bacbe
- 2026-09-05 21:55 · Meta · refusal · re-stamping the two mid-round orphans at TODAY's tree — it would say their source never moved; they are stamped at their own round's commit instead · refused · 9c1bacbe

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
