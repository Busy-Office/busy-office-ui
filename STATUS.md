# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-27 19:54

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 158** (2 open)
  - 158.1 — decide, per outlier, whether the PROSE or the THING is wrong.
  - 158.2 — the loop's own prose discipline.
- **Slice 159** (1 open)
  - 159.1 — `report-reach` prints the verdict where one exists.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (968 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-08-27 18:57   ok
  Objective     1 / 3 slice           since 2026-08-27 19:43   ok  [159]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-27 18:47 · Standardize · tidy · viewport-width forks: 29 literals in 4 gate scripts back to viewports.mjs + check:viewport-forks to hold the line · landed · 728d8aa
- 2026-08-27 18:55 · Standardize · tidy · gate-report bypass: check-versions zero-guard (8 of 9 non-users were fine); visually-hidden triple settled + cross-referenced · landed · 0768f09
- 2026-08-27 18:57 · Standardize · tidy · skip-list fork: source-files.mjs re-exports paths.mjs SOURCE_SKIP_DIRS; clean pass across all chokepoints · landed · dd482f3
- 2026-08-27 18:57 · Meta · refusal · a gate for skip-list forks — base rate is 1 true signal vs 2 exceptions, ceremony not a gate · refused · dd482f3
- 2026-08-27 19:43 · Objective · grill · Objective grill 151/153/157: half the window was refusals and both premise-false ones cited a measurement with no command; a gate for 157.3's shape refused with two dead instruments (one fires pre-bug, one reports zero ON the buggy commit); found that rebuild_from_log corrupts a row whose item contains the log's own separator · logged · 098205a
- 2026-08-27 19:43 · Meta · refusal · a gate for the split/asymmetric selector-family shape — 3 of 15 families today with 0 defects, and the sharper predicate reports zero on the commit that carried the live bug · refused · 098205a
- 2026-08-27 19:43 · Meta · refusal · a third exemption bucket in report-reach — the five remaining blocks are adjudicated, not exempt, and burying them would make the report print a serene zero · refused · 098205a
- 2026-08-27 19:46 · Continue · bug · 159.2 P0: rebuild_from_log corrupted the one log line whose item contains the log's own separator — outcome held the item's prose, commit_sha held 'refused'. Fields now read from the ends; the rebuild reconciles bullet-count and post-enforcement vocabulary and refuses to write BEFORE the drop, so the previous mirror survives; parse_log_line self-tests on every run. All three red-proved with the injection confirmed · landed · 72029ee
- 2026-08-27 19:54 · Continue · build · 158 premise re-measured under 159's own rule: report:prose makes the baseline a command, and it was wrong — 118 documentation pages not 107 (/base/ and /reference/ were missing), median 739, and TWELVE pages over 2x the median not seven, so 158.1's Accept now names the property instead of a count fixed in advance. The new instrument's chrome alarm was itself a detector that could not fail; replaced with a body-vs-main comparison, red-proved both ways · landed · 7d46218
- 2026-08-27 19:54 · Meta · refusal · a word-count gate — 158 refused it up front and the reasoning holds: prose here carries decisions and a budget is satisfiable by moving words into a code comment · refused · 7d46218

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
