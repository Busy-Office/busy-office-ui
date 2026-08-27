# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 00:42

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 157** (1 open)
  - 157.3 — write the guideline: when does a row show a marker at all?
- **Slice 158** (2 open)
  - 158.1 — decide, per outlier, whether the PROSE or the THING is wrong.
  - 158.2 — the loop's own prose discipline.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (957 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-28 00:09   ok
  Objective     2 / 3 slices          since 2026-08-28 00:13   ok  [151, 153]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-27 23:33 · Continue · build · 157.1: icon-only row actions, Unsaved badge removed, dirty state moved onto the Save button's accessible name; new save/close glyphs; save-timing guide on inline-editing · landed · 9d1ecbe
- 2026-08-27 23:44 · Continue · build · 157.2: dropped the inset leading edge from td[data-tone] so the edge means only the ROW; cells keep their tint. RTL count did not move as predicted — six stays six, but DESIGN.md's prose named the removed bar · landed · 3a995d1
- 2026-08-28 00:09 · Standardize · tidy · 155.1/155.2 consolidated: create-ui's three derived artefacts (template screen, framework pin, NOTICE) get one --check freshness gate wired into CI; found that CI never ran create-ui's build at all, so the generated template screen had no verification · landed · e321aa2
- 2026-08-28 00:13 · Objective · grill · Objective grill 151/154/156/157: Accept criteria were embedding predictions and 2 of ~12 were falsified (Breaking-that-wasn't, a flip-site count that did not move); six instrument errors in one session, three of them name-derivation against a rule that already exists — assertions caught all six, recall caught none · logged · b2c556a
- 2026-08-28 00:13 · Meta · refusal · a gate that every var(--bo-*) resolves — base rate is 65 refs, 0 genuinely unresolved, and the measuring instrument was 6-for-6 false · refused · b2c556a
- 2026-08-28 00:19 · Continue · build · 151.3: ordinal values REFUSED — 168 suite badges, zero ranked; the rank word IS the ordinal channel and the two-channel rule makes it mandatory anyway, so a glyph would encode the same fact twice. Reopen test written on the badge page · refused · 6088cbb
- 2026-08-28 00:22 · Continue · build · 153.1: report-reach separates 'cannot appear' (bo-toast-region, a runtime container) from 'never composed' (7->6); the hand-kept exemption reconciles against measurement both ways so it cannot rot, red-proved on both paths · landed · c2c7d59
- 2026-08-28 00:37 · Roadmap · plan · 158.1/158.2 triaged from the owner's simplicity wishlist: measured 107 docs pages (median 775 words, total 98k), 7 over 2x median led by data-table at 4,429 across 22 sections; the loop itself added +482/-90 lines in 24h · triaged · 4b64f67
- 2026-08-28 00:37 · Meta · refusal · a word-count budget or gate — prose here carries decisions and a budget cannot tell a recorded decision from padding · refused · 4b64f67
- 2026-08-28 00:42 · Continue · build · 153.2 REFUSED: bo-date is deprecated (3 independent confirmations) and the suite already uses the prescribed .bo-u-tabular replacement 349x — the grill matched the string '01 Oct' without its markup. report-reach gains a 'deprecated' category so zero reach on a retired block cannot be read as a defect again · refused · 67638f7

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
