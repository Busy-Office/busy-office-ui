# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 03:46

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 163** (1 open)
  - 163.1 — adjudicate the ten blocks at exactly one composition.
- **Slice 164** (2 open)
  - 164.2 — decide whether the loop log records WHICH CLOCK wrote a row.
  - 164.3 — OWNER CALL: the direction chosen on 2026-08-26 is spent, and the queue behind it is empty of product work.
- **Slice 165** (1 open)
  - 165.1 — move the closed slices to `ROADMAP-archive.md`, by hand.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1006 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-08-28 02:42   ok
  Objective     3 / 3 slices          since 2026-08-28 00:49   OVERDUE  [161, 162, 166]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- 164.3 — OWNER CALL: the direction chosen on 2026-08-26 is spent, and the queue behind it is empty of product work.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 03:39 · Continue · build · 162.1 decided: two dispatchers share one queue by ACCEPTING collisions — cost named in LOOPS.md Step 0c (up to one wake's work, discarded), safe by construction because every wake appends loop-log.md and ticks a ROADMAP box (5 of 5 same-clock runs in the cloud era touched both); one free mitigation, a second git fetch before the wake's first commit. Refused a git claim marker (pages.yml has no paths-ignore, so it costs a second deploy per wake and still races), partition-by-loop (partitions the loops but not the shared counters), and stopping the local dispatcher (Slice 162's own postscript refutes it) · landed · 15ab347b
- 2026-08-28 03:39 · Meta · refusal · a git claim marker as a lock — it must be pushed to be visible and pages.yml deploys on every push · refused · 15ab347b
- 2026-08-28 03:39 · Meta · refusal · partitioning the queue by loop type — it would make counter starvation a design property · refused · 15ab347b
- 2026-08-28 03:41 · Roadmap · hygiene · Slice 165 carried no `N. [ ]` checkbox, so STATUS.md omitted it and 165's own archive command — which pins OPEN under a comment telling you to re-derive it — classified 165's own 47 lines as a closed slice to be archived. Gave it 165.1 with the Accept criteria that were loose prose, and made the command derive OPEN. Re-measured: OPEN [15,112,163,164,165], 20 closed slices / 3,019 lines, ROADMAP.md 4,212 lines · landed · b3604c18
- 2026-08-28 03:46 · Continue · fix · 162.1's sha count was wrong on publication and the command caught it one commit later: grep -cE '^- .* · [0-9a-f]{7}$' requires exactly seven hex, but git's abbreviation grew with the repo — 994 rows carry 7 chars, 4 carry 8, 2 carry 40 — so it silently dropped the four rows this wake had just written. Corrected to 1,000 of 1,005 in LOOPS.md, ROADMAP.md and RESUME.md, pattern widened to [0-9a-f]{7,40} with a note not to shorten it. Positive control for roadmap 159's write-the-command-next-to-the-claim rule · landed · bce2cef2

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
