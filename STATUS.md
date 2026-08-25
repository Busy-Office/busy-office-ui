# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-25 22:59

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 145** (3 open)
  - 145.1 — settle the rubric against measured base rates, THEN write it.
  - 145.2 — performance is the one dimension that can be exact.
  - 145.3 — seed `.roundtable/suite-score.md` and stamp every screen.
- **Slice —** (2 open)
  - OWNER CALL — direction. REALIGNED 2026-08-24: the release blocker is GONE; this waits on a decision only.
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (885 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-08-25 21:31   ok
  Objective     0 / 3 slices          since 2026-08-23 18:32   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- OWNER CALL — direction. REALIGNED 2026-08-24: the release blocker is GONE; this waits on a decision only.
- AT runtime evidence

## Last 10 iterations

- 2026-08-25 09:05 · Meta · refusal · adding spacing utilities to absorb 279 inline styles — DESIGN.md refuses a utility system by design · refused · c9640d8
- 2026-08-25 09:05 · Meta · refusal · wiring the sweep as a CI gate — 2min walk, and folding into check:layout would mutate a trusted gate's page for cosmetic drift · refused · c9640d8
- 2026-08-25 10:15 · Roadmap · plan · polish_requeue.py — the Polish re-entry rule now executes; 7 surfaces re-queued, rule 6 no longer starved. Unblocks unattended loops. · landed · f57570f
- 2026-08-25 10:15 · Meta · refusal · re-queueing SKIPPED/dry surfaces on a source change — the ledger took component/date out of play deliberately · refused · f57570f
- 2026-08-25 10:17 · Roadmap · plan · Slice 145 queued — ERP-suite screen scoring (functionality/UX/performance); base rates measured first, landmarks excluded as unable to fail · logged · 1dd68ce
- 2026-08-25 19:03 · Continue · bug · object-page 'footer gap' — sticky .bo-form-actions was canvas-coloured with no shadow over a surface card; new --bo-shadow-up makes it read as elevated · landed · 75e8615
- 2026-08-25 20:53 · Continue · bug · money currency slot: a combobox rendered 180px vs the selects' 75px; sized via --bo-money-currency-size, plus the missing invalid-currency demo · landed · 9837cb9
- 2026-08-25 21:31 · Standardize · tidy · STATUS.md under-reported open items (7 of 9) because the parser required numeric ids; reconciliation guard added and red-proved · landed · c7e2965
- 2026-08-25 22:07 · Continue · build · 145.4 — Finance and Inventory built (8 screens, 28 total); GAP-20 tree-table th indent fixed, GAP-21 DAG-as-tree recorded · landed · 7ae2b5a
- 2026-08-25 22:07 · Meta · refusal · a genealogy/graph component — one component for one screen until a where-used BOM explosion gives it a second use · refused · 7ae2b5a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
