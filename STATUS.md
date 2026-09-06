# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 13:31 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (7 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 292** (4 open)
  - 292.6 — `icon.css` forbids figures in itself and carries two.
  - 292.7 — four `content` cites score a page property while citing the CSS.
  - 292.8 — nothing polices style in a docs PAGE, and 292.3 is what makes that visible.
  - 292.9 — 292.4's property is tree-wide and the guard it landed is page-local: four other docs pages hand a reader a deprecated glyph.
- **Slice 294** (2 open)
  - 294.1 — `derive-floor.mjs` has no probe for `light-dark()`, `oklch()` or `scroll-state()`.
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1507 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-06 12:51   ok
  Objective     3 / 3 slices          since 2026-09-06 07:53   OVERDUE  [292, 293, 295]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      3 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 3 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05, 2026-09-06), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-06 11:52 · Continue · build · 292.5 — /components/icon's copyable block teaches --bo-icon-src and carries bo-sidebar-nav__icon; icon.css header's contradicting mask-image line fixed · landed · 689297c8
- 2026-09-06 11:52 · Meta · refusal · a tree-wide gate for 'the copyable block teaches a class the page shows' — measured 0 of 9 pages, uniformly true, ceremony per 94.11 · refused · 689297c8
- 2026-09-06 11:52 · Meta · refusal · converting the page's six hand-written demo sections to <Demo code={…}/> — it would blind 292.4's literal-class guard, which matches literals on purpose · refused · 689297c8
- 2026-09-06 12:51 · Standardize · sweep · Slice 293 — Standardize sweep 4 of 4 lanes: lanes 1-3 identical to 290 (cited, not re-derived), lane 4's dispatch region flat at 6,112 for a fourth commit; the finding came from lane 1 FAILING — ENVIRONMENT.md §1c named check-boost.mjs, deleted 7 days earlier by f1be2485, while docs:build needs no CHROME_PATH at all and unnamed scan:dead-style does · landed · f3743b3e
- 2026-09-06 12:51 · Meta · refusal · promoting the round-2 nonexistent-file scan to a gate — base rate 1 true positive of 11, and 9 of the 10 false hits need a judgement about generated vs illustrative vs historical, the semantic half 94.11 refused to gate · refused · f3743b3e
- 2026-09-06 21:22 · Roadmap · plan · Slice 294 — triaged the owner-supplied upstream-contribution zip (6 proposals): guide verifies clean (44 sheets, 26 behaviours, 11/11 edit targets exist, stylelint exit 0); the light-dark() floor risk is real but @supports-guarded so reach stays 80.09%; filed 294.1 (missing floor probes) and 294.2 (Objective ranking, brand mark = owner call) · triaged · e8c7b0f2
- 2026-09-06 21:22 · Meta · refusal · two of this triage's own findings — 'raw hex outside @media print' (base rate: repo carries 139) and 'an !important' (the hit is inside a comment saying the layer needs none) · refused · e8c7b0f2
- 2026-09-06 21:31 · Continue · build · Slice 295 / 249.15 — the social card, generated from packages/core/dist/css/index.css rather than drawn; og:image on 127/127 pages, twitter:card -> summary_large_image, two new check-metadata arms both red-proved with the injection grep-confirmed first (gate 387 -> 1150 assertions); verified against a real DOCS_BASE build · landed · c6643153
- 2026-09-06 21:31 · Meta · refusal · keeping arm 5's 'og:image absent OR twitter:card summary' disjunction — once the image ships its left side is permanently true, so it would pass on a tree that had left the card at summary · refused · c6643153
- 2026-09-06 21:31 · Meta · refusal · wiring gen-og-card.mjs into docs:build — it would put Chrome on the critical path of every build to emit a static asset that belongs in public/ · refused · c6643153

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
