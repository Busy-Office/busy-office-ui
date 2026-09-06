# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 14:31 UTC

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
- **Slice 292** (3 open)
  - 292.7 — four `content` cites score a page property while citing the CSS.
  - 292.8 — nothing polices style in a docs PAGE, and 292.3 is what makes that visible.
  - 292.9 — 292.4's property is tree-wide and the guard it landed is page-local: four other docs pages hand a reader a deprecated glyph.
- **Slice 294** (2 open)
  - 294.1 — `derive-floor.mjs` has no probe for `light-dark()`, `oklch()` or `scroll-state()`.
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice 296** (3 open)
  - 296.1 — Run the first gauntlet round, Class A, on the reference this repo actually has.
  - 296.2 — An interaction-latency instrument, or a recorded refusal.
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 297** (1 open)
  - 297.1 — The first real intake run is the test of this, not the config.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1516 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-06 12:51   ok
  Objective     3 / 3 slices          since 2026-09-06 07:53   OVERDUE  [292, 293, 295]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      3 wake-date(s) newer   since 2026-09-03 09:54   STALE   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
  -> rule 5's newest comparable pair predates 3 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-03, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-03 (2026-09-04, 2026-09-05, 2026-09-06), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-06 21:31 · Meta · refusal · wiring gen-og-card.mjs into docs:build — it would put Chrome on the critical path of every build to emit a static asset that belongs in public/ · refused · c6643153
- 2026-09-06 21:41 · Continue · release · v0.8.0 released — @busy-office/ui 0.8.0 and @busy-office/create-ui 0.1.3 live on npm with SLSA provenance, verified via npm view rather than from the green CI run; 220 commits since 0.7.0 (2026-08-30). introduced.json refreshed against the registry per its own note · released · 2a4bb245
- 2026-09-06 21:47 · Roadmap · plan · Slice 296 — owner direction: installed a Gauntlet loop (LOOPS.md §7, builder -> blind critic, 3-round budget) with NO counter of its own to avoid the starvation bug this file records five times; adapted BAR.md/CRITIC.md to references that exist in this tree; explored 21st.dev and read it as a reference not a template (React/Tailwind/shadcn is the refused stack; the AI-prompt distribution shape is already half-built as 294's registry.json) · triaged · 691102d3
- 2026-09-06 21:47 · Meta · refusal · publishing to the shadcn registry format as a distribution channel — it advertises this framework to consumers expecting React components · refused · 691102d3
- 2026-09-06 21:47 · Meta · refusal · a ninth dispatcher rule for the Gauntlet — a counter under an always-true condition is the exact bug that starved Objective for ten slices, five times over · refused · 691102d3
- 2026-09-06 21:47 · Meta · refusal · importing the contribution's two existing gauntlet rounds as precedent — both were self-graded by the builder, which this loop's step 2 refuses · refused · 691102d3
- 2026-09-06 13:50 · Continue · build · 292.6 — icon.css's PRICED block dates its four size endpoints (d48f361d/43ea922a) and points at the stat:size stamp · landed · c3637cb9
- 2026-09-06 13:50 · Meta · refusal · filing an item for the 162-byte gzip level spread — GZIP_TOLERANCE_KB=0.3 (307 bytes) already absorbs it · refused · c3637cb9
- 2026-09-06 22:31 · Roadmap · plan · Slice 297 — owner call: feedback intake stays on GitHub, not Linear (a stranger can file an issue and cannot file into a private workspace; a tracker beside ROADMAP.md is a second truth the storage doctrine refuses). Enabled Discussions, wired both intakes into LOOPS.md Step 1 with a live-tested GraphQL command, and routed questions at filing time via 3 new contact_links, all 4 URLs verified 200 · triaged · b3abc5fd
- 2026-09-06 22:31 · Meta · refusal · Linear as a feedback or backlog tracker — external adopters cannot reach it, and it duplicates ROADMAP.md, which CLAUDE.md's storage doctrine makes the source of truth · refused · b3abc5fd

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
