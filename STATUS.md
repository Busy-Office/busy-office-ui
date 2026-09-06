# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-06 15:09 UTC

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
- **Slice 298** (1 open)
  - 298.1 — `gen-og-card.mjs`'s display sizes are literals with a stated reason, and nothing checks that the reason stays true.
- **Slice 300** (1 open)
  - 300.2 — Issue #2: no board/kanban component, triaged, NOT built.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1524 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-06 12:51   OVERDUE
  Objective     1 / 3 slice           since 2026-09-06 15:05   ok  [300]
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

- 2026-09-06 22:31 · Roadmap · plan · Slice 297 — owner call: feedback intake stays on GitHub, not Linear (a stranger can file an issue and cannot file into a private workspace; a tracker beside ROADMAP.md is a second truth the storage doctrine refuses). Enabled Discussions, wired both intakes into LOOPS.md Step 1 with a live-tested GraphQL command, and routed questions at filing time via 3 new contact_links, all 4 URLs verified 200 · triaged · b3abc5fd
- 2026-09-06 22:31 · Meta · refusal · Linear as a feedback or backlog tracker — external adopters cannot reach it, and it duplicates ROADMAP.md, which CLAUDE.md's storage doctrine makes the source of truth · refused · b3abc5fd
- 2026-09-06 22:54 · Objective · grill · Slice 298 — grill of 292, 293, 295: 44 of 47 assertions reproduce. Two real defects, both fixed in place: 295's claim that the OG card 'invents no colour' was false (raw #fff -> --bo-color-text-inverse, card byte-identical at 97,379), and ENVIRONMENT.md §1c's CHROME_PATH evidence is container-only but read as universal (env -u CHROME_PATH scan:dead-style exits 0 on macOS via resolve-chrome's fallback) · logged · bf55dca5
- 2026-09-06 22:54 · Meta · refusal · a gate over 'a durable file names the environment its measurement was taken in' — semantic predicate, base rate 1 section, 94.11's wall for the sixth time · refused · bf55dca5
- 2026-09-06 22:54 · Meta · refusal · re-filing 295's display font-size literals as a defect — a poster sits outside the component type scale legitimately; only the sentence claiming otherwise was wrong · refused · bf55dca5
- 2026-09-06 15:05 · Objective · grill · Slice 299 — the same Objective grill of 292/293/295 run twice by two dispatchers; this pass LOST the Step 0c collision to Slice 298 and re-dispatched, landing the two findings the winner did not make: Slice 295's metadata baseline 'up from 387' is 1,022 (each gate revision run against one dist), so the change adds 128 assertions not 763; and ENVIRONMENT.md 1c's consumer count, diagnosed as 14->15 by Slice 298, was still reading 14 · landed · 0e52b565
- 2026-09-06 15:05 · Meta · refusal · a gate over the CHROME_PATH consumer count — it is already self-announcing when re-run, and classifying a new consumer needs the semantic judgement 94.11 refuses to gate · refused · 0e52b565
- 2026-09-06 23:09 · Continue · fix · 300.1/P0 — check-markup crashed with a raw ENOENT on any path ending .html that does not exist, including the quoted glob its own docstring showed (GitHub issue #1, the first ever filed). The report named globs; a plain typo crashed identically, so the fix verifies the file (stat().isFile()) rather than special-casing globs. Also: glob-aware failure message, --help handled at exit 0, docstring corrected. All four paths verified by exit code · landed · 1c889eee
- 2026-09-06 23:09 · Meta · refusal · fs.promises.glob for internal expansion — it puts a Node 22 floor on a package that declares no engines, against a zero-dependency surface that looks deliberate · refused · 1c889eee
- 2026-09-06 23:09 · Roadmap · plan · 300.2 — triaged issue #2 (no board/kanban component): premise verified (40 components, only bo-icon--keyboard in the vocabulary), argument accepted as strong, but NOT dispatched as a build — a new component is the largest surface addition here, so it goes to an Explore spike that answers whether the keyboard contract and announcement can be decided once. Also answered 297.1: both issues arrived in the right intake, but both were filed by the owner's agent, so the router was not actually tested · triaged · 1c889eee

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
