# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 11:52 UTC

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
- **Slice 292** (4 open)
  - 292.6 — `icon.css` forbids figures in itself and carries two.
  - 292.7 — four `content` cites score a page property while citing the CSS.
  - 292.8 — nothing polices style in a docs PAGE, and 292.3 is what makes that visible.
  - 292.9 — 292.4's property is tree-wide and the guard it landed is page-local: four other docs pages hand a reader a deprecated glyph.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1500 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-06 06:48   OVERDUE
  Objective     1 / 3 slice           since 2026-09-06 07:53   ok  [292]
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

- 2026-09-06 08:59 · Meta · refusal · a check-page-shape arm for the orphaned-heading class — 101.3 confines Polish to the existing ratchet, though unlike the previous five refusals the base rate argues FOR it (1 of 80 pages, 18 days, past five gates) · refused · 331ca0f9
- 2026-09-06 09:46 · Continue · build · Slice 292 — 292.3: DSA rubric scope stated explicitly (css/page per dimension), measured over all 240 cites; premise refuted, conclusion held · landed · 52f78df5
- 2026-09-06 09:46 · Meta · refusal · repeating the scope into the six rubric definitions — two records of one fact is how they drift · refused · 52f78df5
- 2026-09-06 09:46 · Meta · refusal · a gate asserting each cite respects its dimension's scope — the classifier mis-sorts 5 of 240, so it would be the semantic gate 94.11 refuses · refused · 52f78df5
- 2026-09-06 10:48 · Continue · build · Slice 292.4 — /components/icon stops teaching a deprecated glyph; guard extended to the markup string and live demos, red-proved twice · landed · 901ce9af
- 2026-09-06 10:48 · Meta · refusal · un-deprecating --settings: reverses a dated published deprecation (53.2), the shape 249.13 was sent to the owner for; its stated ground (the caption's 'cog') is refuted by the shipped mask · refused · 901ce9af
- 2026-09-06 10:48 · Meta · refusal · a tree-wide gate in this round: it would be red on the five sites 292.9 now records, and the deprecation's own text says an existing render is not by itself a defect · refused · 901ce9af
- 2026-09-06 11:52 · Continue · build · 292.5 — /components/icon's copyable block teaches --bo-icon-src and carries bo-sidebar-nav__icon; icon.css header's contradicting mask-image line fixed · landed · 689297c8
- 2026-09-06 11:52 · Meta · refusal · a tree-wide gate for 'the copyable block teaches a class the page shows' — measured 0 of 9 pages, uniformly true, ceremony per 94.11 · refused · 689297c8
- 2026-09-06 11:52 · Meta · refusal · converting the page's six hand-written demo sections to <Demo code={…}/> — it would blind 292.4's literal-class guard, which matches literals on purpose · refused · 689297c8

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
