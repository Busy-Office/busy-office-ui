# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 01:41

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 162** (1 open)
  - 162.1 — decide how two dispatchers share one queue.
- **Slice 163** (1 open)
  - 163.1 — adjudicate the ten blocks at exactly one composition.
- **Slice 164** (2 open)
  - 164.2 — decide whether the loop log records WHICH CLOCK wrote a row.
  - 164.3 — OWNER CALL: the direction chosen on 2026-08-26 is spent, and the queue behind it is empty of product work.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (999 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-08-27 22:53   OVERDUE
  Objective     1 / 3 slice           since 2026-08-28 00:49   ok  [161]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- 164.3 — OWNER CALL: the direction chosen on 2026-08-26 is spent, and the queue behind it is empty of product work.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 01:41 · Continue · build · 161.4 decided which loops close a slice: Continue+Standardize, with Roadmap/Explore/Objective measured before being refused (adding the last two moves the log's crossing count 23 to 23). The premise was the smaller half — the same run found a FOURTH blind regex, the prose 'Slice NN' convention the counter never saw: 141 of 996 rows, 45 extra slices, union 144 of ROADMAP.md's 146. Cadence replayed not predicted: crossings 18 to 22 on the format fix alone, 23 with Standardize; of 45 real Objective rounds those already past 3 goes 6 to 15. slice_of ships --self-test, red-proved both ways · landed · 537f561
- 2026-08-28 01:41 · Roadmap · plan · 165 triaged: the archive sweep is due again — 2,488 of ROADMAP.md's 3,882 lines (64%) are 17 closed slices never moved, against 1,094 lines on 2026-08-25. Dispatcher rule 4 walks all of it every wake and names this exact signal itself. Filed with its command and an Accept that asserts the property, not a predicted line count; flagged do-by-hand because the last case-collision on this pair of files destroyed 7,307 lines silently · triaged · 537f561
- 2026-08-28 01:41 · Meta · refusal · doing the sweep in this wake — a 2,488-line bulk move of the file the dispatcher reads, landed under a commit whose item was a counter fix, is exactly the scope creep the operating rules refuse · refused · 537f561

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
