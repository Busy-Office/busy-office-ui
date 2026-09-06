# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 07:37 UTC

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
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1486 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-06 06:48   ok
  Objective     3 / 3 slices          since 2026-09-06 03:45   OVERDUE  [286, 287, 290]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      3 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 3 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05, 2026-09-06), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
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

- 2026-09-06 03:45 · Meta · refusal · the archive sweep — roadmap_scope reports 2 of 5 eligible targets NAMED by still-open items (Slice 283, by 287.5 and 273.2); 236.2's report read before deciding not to move · refused · 7ad1aca6
- 2026-09-06 05:43 · Continue · build · 286.4: fit's rubric definition scored against a 4-row field matrix reaching 4 of 40 scored components; definition rewritten to the property it scores, and scan's published cite corrected (0 occurrences on the page it claimed placed it) · landed · 04073028
- 2026-09-06 05:43 · Meta · refusal · widening the field matrix with a scan row — that makes the definition true by editing the artefact it points at; the matrix covers field types, scan is an input mechanism · refused · 04073028
- 2026-09-06 05:43 · Meta · refusal · a gate over 'a fit cite naming the matrix also links from it' — 94.11 base rate first: true of 5 of the 6 cites that mention it, vacuously true of the 34 that do not, so it fires on a healthy tree · refused · 04073028
- 2026-09-06 06:48 · Standardize · sweep · 290.1 Standardize sweep 4 of 4 lanes — all clean, with the inputs measured rather than the detectors trusted; lane 4 retires 284's dispatch-region worry (flat at 6,112 across three commits, +686 file) · logged · 2f3ff9a8
- 2026-09-06 06:48 · Meta · refusal · consolidating _common.parse_log_line and dispatch_status.ROW — they agree 1,480/1,480/1,480 but discriminate on synthetic legacy rows; the recovery path must be tolerant and the counter must not be · refused · 2f3ff9a8
- 2026-09-06 07:37 · Continue · build · 287.5 — re-attach the orphaned sentence in LOOPS.md §3b step 5; orphaning commit is f57570f4 (2026-08-25), not either sha the item named; verified a pure move by word multiset · landed · 29e3e7f7
- 2026-09-06 07:37 · Meta · refusal · the no-change branch: f57570f4's diff is a paste artifact, not a decision to leave the sentence trailing · refused · 29e3e7f7
- 2026-09-06 07:37 · Meta · refusal · 286.4 as dispatched — collision lost to 04073028, work discarded per Step 0c rather than merged · refused · 29e3e7f7
- 2026-09-06 07:37 · Meta · refusal · filing a finding against the winning wake's scan cite: its 'matrix puts it' hit is a quotation inside its own explanation, not a surviving false claim · refused · 29e3e7f7

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
