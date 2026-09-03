# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-03 17:47 UTC

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
- **Slice 256** (1 open)
  - 256.2 — `check:floor`'s stated exemption names `.roundtable` grills; its allow-list does not. Decide which one is wrong.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1335 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-09-03 14:40   ok
  Objective     0 / 3 slices          since 2026-09-03 17:47   ok
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

- 2026-09-03 12:52 · Continue · build · Slice 249.4 — README facts generated (gates/notfor/faq), two of the item's three premises refuted · landed · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · the item's stated gate predicate (count of check-*.mjs carrying --self-test): 48 files match the string, 18 have the argv branch — the deriver imports scanGates() from the gate instead of re-counting · refused · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · parsing the BUILT troubleshooting page: its third <h2> is the layout's own Related heading, so the deriver reads the source page · refused · e1c71d5
- 2026-09-03 12:52 · Meta · refusal · shipping the record in dist/: it is repo provenance, not part of the npm tarball — check:package stayed at 183 files · refused · e1c71d5
- 2026-09-03 21:10 · Continue · build · Slice 254 / 249.16 — the hand-made README screenshot, taken in the browser-blocked lane a cloud wake cannot reach. Literal reading of the item gave the wrong image (docs chrome, not the framework); shot is a computed clip of the compact list-report screen ending at the last fully-visible row. 1x chosen over 2x on a measured tarball trade: 88.9 kB / +23.4% vs 216 kB / +59% · landed · 82d14bf
- 2026-09-03 21:10 · Meta · refusal · a 2x retina asset in the package tarball — +59% on a 364 kB package whose README advertises 93 kB minified · refused · 82d14bf
- 2026-09-03 14:40 · Standardize · standardize · Slice 255 — Standardize sweep: all five lanes clean, nothing to consolidate · logged · a9754a10
- 2026-09-03 17:47 · Objective · grill · Slice 256 — grill of Slices 249 (.2/.3/.4), 254, 255: 57 of 60 assertions reproduce; 249.3's '20 components floor at Chrome 99' is 25 (largest LABEL group, 20+3+2), 254's 928px container is 913px here (15px scrollbar reserved in the shell's scrolling main — ENVIRONMENT §6c), and 255's lane 3 cites an archive enumeration labelling fifteen names as '158.1's twelve' · logged · ba527917
- 2026-09-03 17:47 · Meta · refusal · widening check:floor's ALLOW list to .roundtable/ in the same wake that tripped the gate — the report was rewritten to print the deriving command instead, and the comment-vs-list mismatch is filed OPEN as 256.2 · refused · ba527917
- 2026-09-03 17:47 · Meta · refusal · publishing the tarball figures as a defect: 363.6/449.1 kB here against 254's 364.0/449.3 is the zlib-build tolerance LOOPS.md already records; file counts are exact at 183 to 184 and the 1x-over-2x trade is unaffected · refused · ba527917

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
