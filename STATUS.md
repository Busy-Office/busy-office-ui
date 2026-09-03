# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-03 21:53 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (9 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.8 — Component tagline + category, generated from the CSS header.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
  - 249.15 — The one static OG image 249.2 named and did not build.
- **Slice 256** (1 open)
  - 256.2 — `check:floor`'s stated exemption names `.roundtable` grills; its allow-list does not. Decide which one is wrong.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1343 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-09-03 14:40   ok
  Objective     1 / 3 slice           since 2026-09-03 17:47   ok  [249]
  Optimize      0 wake-date(s) newer   since 2026-09-03 09:54   ok   [newest pair: bundle-gz-kb; 128 sample(s), 13 of 42 name(s) sampled twice]
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

- 2026-09-03 17:47 · Meta · refusal · widening check:floor's ALLOW list to .roundtable/ in the same wake that tripped the gate — the report was rewritten to print the deriving command instead, and the comment-vs-list mismatch is filed OPEN as 256.2 · refused · ba527917
- 2026-09-03 17:47 · Meta · refusal · publishing the tarball figures as a defect: 363.6/449.1 kB here against 254's 364.0/449.3 is the zlib-build tolerance LOOPS.md already records; file counts are exact at 183 to 184 and the 1x-over-2x trade is unaffected · refused · ba527917
- 2026-09-03 18:49 · Continue · build · 249.5 — pnpm/yarn/bun install commands on installation.astro, executed by check:quickstart step 3b from a shared package-managers.mjs · landed · 0f7fb2b3
- 2026-09-03 18:49 · Meta · refusal · the item's own offered refusal (a DA saying the no-bundler audience makes it noise) — the argument is about bundlers, while the install line serves the npm-ecosystem audience and the no-package-manager case is already answered two lines below · refused · 0f7fb2b3
- 2026-09-03 18:49 · Meta · refusal · making step 3b FAIL when a documented package manager is absent — bun is not on a stock GitHub runner, so a red build there would assert something about the runner, not the package; it reports NOT VERIFIED instead (check:rtl's precedent) · refused · 0f7fb2b3
- 2026-09-03 21:53 · Roadmap · plan · 249.6 and 249.7 re-scoped by measurement — 3 of 6 router rows lack a terminal page (not 1), and 4 of 5 terminology seed rows do not reproduce · triaged · 6cdcab4b
- 2026-09-03 21:53 · Meta · refusal · 249.6 declined by this cloud wake — browser-blocked in the screenshot sense (3 terminal pages must gain a rendered result, plus a new block on the landing page); left open for a local wake · refused · 6cdcab4b
- 2026-09-03 21:53 · Meta · refusal · the whole-page form of 249.6's gate predicate — 78-81 pattern links on all 31 learning-path pages, so it could not fail; the Accept now names the content-region anchor · refused · 6cdcab4b
- 2026-09-03 21:53 · Continue · build · Slice 249.14 — a distinct meta description on all 28 erp-suite screens, thrown at render and gated in the suite audit, four red-proofs · landed · 6cdcab4b
- 2026-09-03 21:53 · Meta · refusal · reading the descriptions off the DOM in audit.mjs — the built file is what a crawler gets and needs no browser, so the arms run and report before Chrome starts · refused · 6cdcab4b

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
