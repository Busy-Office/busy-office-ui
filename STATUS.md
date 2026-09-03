# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-03 13:10 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (11 open)
  - 249.5 — Install commands for pnpm/yarn/bun, or a recorded refusal.
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.8 — Component tagline + category, generated from the CSS header.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
  - 249.14 — A description on each of the 28 `suite/` pages.
  - 249.15 — The one static OG image 249.2 named and did not build.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1331 iterations logged)
  Standardize   5 / 4 Continue rounds since 2026-09-03 05:50   OVERDUE
  Objective     2 / 3 slices          since 2026-09-03 08:53   ok  [249, 254]
  -> a counter is at or past its threshold; the dispatcher should pick it
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

- 2026-09-03 11:58 · Continue · build · Slice 249.3 — maturity labels (introduced version, per-component CSS floor, DSA date, AT evidence) with check:maturity · landed · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · the item's own mechanism: introduced-version from the first git tag — measured wrong for 38 of 40 components (0.1.0 untagged, v0.2.0 never published, source paths rename); the registry's tarballs are the source instead · refused · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · attributing behaviour JS to a component by name convention for the per-component floor — dist/js is not split per component, so the floor is CSS-only and the label says so · refused · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · adding a <Maturity> line to 40 hand-authored pages by regex — mounted from DsaScore, which check-page-shape already requires on every one · refused · 4e93bc3b
- 2026-09-03 12:52 · Continue · build · Slice 249.4 — README facts generated (gates/notfor/faq), two of the item's three premises refuted · landed · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · the item's stated gate predicate (count of check-*.mjs carrying --self-test): 48 files match the string, 18 have the argv branch — the deriver imports scanGates() from the gate instead of re-counting · refused · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · parsing the BUILT troubleshooting page: its third <h2> is the layout's own Related heading, so the deriver reads the source page · refused · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · shipping the record in dist/: it is repo provenance, not part of the npm tarball — check:package stayed at 183 files · refused · e1c71d5
- 2026-09-03 21:10 · Continue · build · Slice 254 / 249.16 — the hand-made README screenshot, taken in the browser-blocked lane a cloud wake cannot reach. Literal reading of the item gave the wrong image (docs chrome, not the framework); shot is a computed clip of the compact list-report screen ending at the last fully-visible row. 1x chosen over 2x on a measured tarball trade: 88.9 kB / +23.4% vs 216 kB / +59% · landed · 82d14bf
- 2026-09-03 21:10 · Meta · refusal · a 2x retina asset in the package tarball — +59% on a 364 kB package whose README advertises 93 kB minified · refused · 82d14bf

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
