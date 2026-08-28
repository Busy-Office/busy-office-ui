# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 13:11

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 164** (1 open)
  - 164.2 — decide whether the loop log records WHICH CLOCK wrote a row.
- **Slice 167** (2 open)
  - 167.1 — the loop's own prose is the fastest-growing and the only unmeasured prose in the repo. Decide whether the 158.2 cadence covers it.
  - 167.2 — `LOOPS.md` rule 3 is 82% archaeology, and the file has no archive.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1012 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-08-28 13:11   ok
  Objective     3 / 3 slices          since 2026-08-28 04:41   OVERDUE  [163, 164, 165]
  -> a counter is at or past its threshold; the dispatcher should pick it
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- 164.2 — decide whether the loop log records WHICH CLOCK wrote a row.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 03:39 · Meta · refusal · a git claim marker as a lock — it must be pushed to be visible and pages.yml deploys on every push · refused · 15ab347b
- 2026-08-28 03:39 · Meta · refusal · partitioning the queue by loop type — it would make counter starvation a design property · refused · 15ab347b
- 2026-08-28 03:41 · Roadmap · hygiene · Slice 165 carried no `N. [ ]` checkbox, so STATUS.md omitted it and 165's own archive command — which pins OPEN under a comment telling you to re-derive it — classified 165's own 47 lines as a closed slice to be archived. Gave it 165.1 with the Accept criteria that were loose prose, and made the command derive OPEN. Re-measured: OPEN [15,112,163,164,165], 20 closed slices / 3,019 lines, ROADMAP.md 4,212 lines · landed · b3604c18
- 2026-08-28 03:46 · Continue · fix · 162.1's sha count was wrong on publication and the command caught it one commit later: grep -cE '^- .* · [0-9a-f]{7}$' requires exactly seven hex, but git's abbreviation grew with the repo — 994 rows carry 7 chars, 4 carry 8, 2 carry 40 — so it silently dropped the four rows this wake had just written. Corrected to 1,000 of 1,005 in LOOPS.md, ROADMAP.md and RESUME.md, pattern widened to [0-9a-f]{7,40} with a note not to shorten it. Positive control for roadmap 159's write-the-command-next-to-the-claim rule · landed · bce2cef2
- 2026-08-28 04:41 · Objective · grill · Objective grill 161/162/166: the 61-vs-23 is settled — a third independent replay reproduces all five published figures exactly at 996 rows (18/22/23/23, 6 to 15), so 166.5's harness was wrong and its verdict holds, but it had adjudicated by trusting a number with no command and that number now reads 24; a SIXTH log convention found and REFUSED on measurement (30 rows, dead since 2026-08-21, worth one crossing ever) — the first test of LOOPS.md's own 'no longer widen the regex' conclusion; and the loop's governing prose is the fastest-growing in the repo (RESUME.md +256%, LOOPS.md +121.6% over the nine days 158.2 measured docs at +51%, DESIGN.md +15.7%), with one 6-line function carrying 4,248 words across four files · logged · 0aab35cf
- 2026-08-28 04:41 · Meta · refusal · a new CLAUDE.md doctrine section for finding A — roadmap 159's 'write the command next to the claim' already covers it; the gap was compliance, and a second rule restating a neighbouring one is what 158.2 is about · refused · 0aab35cf
- 2026-08-28 04:41 · Meta · refusal · widening the slice parser a SIXTH time for the mid-text convention — measured at one crossing in the whole log's history and zero in the last week, against re-opening the invented-slice risk 166.5's first draft demonstrated · refused · 0aab35cf
- 2026-08-28 12:50 · Continue · build · 164.3 owner call: (a) adoption is not spent — create-ui 404s on npm. Fixed three publish blockers (publishConfig MISSING would have failed or gone private, no README, no repo metadata) and corrected two fabricated README claims by scaffolding and measuring · landed · ea4c72b
- 2026-08-28 13:00 · Continue · build · 163.1: ten used-once verdicts — 8 correct at one (from each component's gated wrong-choice clause), bo-composer a real screen-level miss (approval shows the thread but offers no way to contribute), bo-ordered-list unexamined; the reconciliation shipped dead and was caught by red-proving · landed · 2c46191
- 2026-08-28 13:11 · Standardize · tidy · 165.1 archive sweep: 20 closed slices moved, ROADMAP.md 4,461 -> 1,474 and archive 16,218 -> 19,285, conservation reconciled to the 80 lines of pointer stubs; found the counting command attributes non-slice H2 sections to the preceding slice (4 sections, 279 lines) · landed · 187ab92

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
