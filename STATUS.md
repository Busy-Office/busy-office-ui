# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-04 13:53 UTC

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
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1390 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-04 09:57   ok
  Objective     0 / 3 slices          since 2026-09-04 13:02   ok
  Optimize      1 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-04 12:07 · Meta · refusal · a required/enhanced/optional JS tier — the only source in the repo is the hand-written page prose this key exists to check, so sourcing it would be circular; stays 249.9's open question · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · blanking comments in extract-behaviors' hook scan — measured: it deletes real published hooks on 25 of 33 exports, one of them 12 · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · publishing byComponent into llms.txt — behaviors.json is already an export and llms.txt already lists all 26 inits with their hooks; a fourth spelling of one relation · refused · 1b4c3365
- 2026-09-04 12:07 · Meta · refusal · gating gen-llms' hand-written paste-in block — it names 5 of 26 inits deliberately, and all 5 were checked to agree with byComponent · refused · 1b4c3365
- 2026-09-04 13:02 · Objective · grill · Slice 265 — Objective grill of 263, 264: gate header still encoding the declaration its slice corrected; pattern text published undecoded, one badge visible as 'Dashboard &amp; widgets'; 53rd gate added · landed · 234677f7
- 2026-09-04 13:02 · Meta · refusal · widening html-entities.mjs's NAMED map for the 7 residual references — measured: the first argument against it (code samples) is false, the real risk is unescaped live content like '&times; EA' · refused · 234677f7
- 2026-09-04 13:02 · Meta · refusal · re-grilling Slice 249, armed for the sixth wake — already grilled whole and per item on 2026-09-03 · refused · 234677f7
- 2026-09-04 13:53 · Polish · round · Slice 266 — Polish round 2 on component/avatar: 249.8's 3-line @tagline header decayed all four live line-number pointers, two of them published and one printed; fixed by naming the property · landed · 62fec2ae
- 2026-09-04 13:53 · Meta · refusal · a gate for line-number cites, sixth refusal — after the fix the class has no members (0 live <component>.css:NN), so it would be 94.11 ceremony · refused · 62fec2ae
- 2026-09-04 13:53 · Meta · refusal · correcting the 21 archive / 24 roundtable / 2 frozen-version-snapshot citations the same shift invalidated — history is read from the commit it describes · refused · 62fec2ae

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
