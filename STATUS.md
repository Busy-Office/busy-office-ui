# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 07:19 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 168** (1 open)
  - 168.1 — let the dispatcher SAY when the chosen direction is blocked.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1023 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-08-28 13:11   OVERDUE
  Objective     2 / 3 slices          since 2026-08-28 13:15   ok  [164, 167]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 13:15 · Meta · refusal · a gate for the instrument defects, and a product-vs-machinery ratio — retired one grill ago and a ratio cannot tell maintenance that unblocks product from maintenance that displaces it · refused · 409e5bb
- 2026-08-28 05:42 · Continue · build · 164.2 decided: the log row keeps its naive local stamp — an offset would add an ordering the file already has (file order is chronological at 1014/1014 through blame offsets, red-proved), and dispatch_status.py's ROW rejects an offset row outright; 162.1's 'recorded exactly via the sha' corrected — 5 rows cite a sha rebased out of existence, blame is exact at 1014/1014 · logged · 75aba882
- 2026-08-28 05:42 · Meta · refusal · appending %z to new log rows — measured by injection: dispatch_status.py hard-exits on it, for an ordering the file already has, plus a permanently mixed column · refused · 75aba882
- 2026-08-28 05:42 · Meta · refusal · backfilling offsets into the 1014 existing rows — exact via blame and still refused: record_iteration.py's standing rule is that historical rows record what was believed when written · refused · 75aba882
- 2026-08-28 05:42 · Meta · refusal · a gate for the naive stamp — the only checkable property (the stamp carries an offset) is the option this item refused, so the gate would enforce the rejected answer · refused · 75aba882
- 2026-08-28 06:47 · Continue · build · 167.1 — verdict the loop's own prose growth: 2 instrument, 3 honest; the cadence extends, 158.2's median instrument refused · landed · e3844c49
- 2026-08-28 06:47 · Meta · refusal · the median-outlier test over the five loop-machinery files: n=5 has no usable median, 161.1 already recorded n=6 failing, and the spread is 102x · refused · e3844c49
- 2026-08-28 06:50 · Continue · build · 167.3 — STATUS.md's history half had no reconciliation: a git-ignored loops.db means a fresh cloud container renders 'Last 10 iterations' from 2 rows against the log's 1,020, deleting nine committed rows silently; generator now counts the raw log rows, announces, rebuilds and re-checks · landed · cef80575
- 2026-08-28 06:50 · Meta · refusal · a CI gate for it — these scripts are not in CI at all, which is rebuild_from_log.py's own stated reason for putting its assertions in the writing path · refused · cef80575
- 2026-08-28 15:19 · Continue · build · 167.2: 717 words of incident narrative split from LOOPS.md rule 3 into a new LOOPS-archive.md (rule 3 1,171 -> 525); the standing lesson stays inline because a pointer is read less than a paragraph; registered with vendor-names and with report_loop_prose so the move cannot read as a fake shrink · landed · 3006da0

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
