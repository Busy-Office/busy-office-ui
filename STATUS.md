# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-03 11:58 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (12 open)
  - 249.4 — README: stamped gate count, one screenshot, who-for/not-for, FAQ.
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
dispatch status — counter-triggered rules (1325 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-03 05:50   ok
  Objective     1 / 3 slice           since 2026-09-03 08:53   ok  [249]
  Optimize      0 wake-date(s) newer   since 2026-09-03 09:54   ok   [newest pair: bundle-gz-kb; 125 sample(s), 13 of 39 name(s) sampled twice]
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

- 2026-09-03 08:53 · Objective · grill · Slice 253 — grill of Slices 247, 249, 252: 31 of 34 claims reproduce; 247.1's base rate is 188 sites not 45 (archive alone is 91), its 'live subset, 6 sites' omitted polish-state.md's 12 where one had drifted (server.mjs:105 -> 106), and 249.6's 'index.astro:118 is the install snippet' is false at every revision; 252 clean 15 of 15 · logged · b1e3d161
- 2026-09-03 08:53 · Meta · refusal · a blanket file:line gate, re-refused on the CORRECTED base rate — 221 sites on the current tree, ~85% in frozen history and dated reports, so a gate would fail the build on correct history (94.11) · refused · b1e3d161
- 2026-09-03 08:53 · Meta · refusal · publishing a fourth grill finding: check:slice-refs read one low at every anchor when two files were swapped into the live tree, but the gate scans the WHOLE tree — real worktrees reproduce Slice 252's 709/262/233 and 723/262/234 exactly · refused · b1e3d161
- 2026-09-03 09:54 · Continue · build · 249.2 — per-page meta description on 127 of 127 built docs pages (from 1 of 165), sitemap reconciled against distPages, robots.txt, check-metadata.mjs · landed · 01fd7fc5
- 2026-09-03 09:54 · Meta · refusal · widening 249.2 to the 28 suite/ pages and the 10 redirect stubs — filed as 249.14 and left excluded respectively, rather than absorbed into the item · refused · 01fd7fc5
- 2026-09-03 09:54 · Meta · refusal · generating the sitemap from distPages() — cheaper, but it would make the gate compare a list against itself · refused · 01fd7fc5
- 2026-09-03 11:58 · Continue · build · Slice 249.3 — maturity labels (introduced version, per-component CSS floor, DSA date, AT evidence) with check:maturity · landed · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · the item's own mechanism: introduced-version from the first git tag — measured wrong for 38 of 40 components (0.1.0 untagged, v0.2.0 never published, source paths rename); the registry's tarballs are the source instead · refused · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · attributing behaviour JS to a component by name convention for the per-component floor — dist/js is not split per component, so the floor is CSS-only and the label says so · refused · 4e93bc3b
- 2026-09-03 11:58 · Meta · refusal · adding a <Maturity> line to 40 hand-authored pages by regex — mounted from DsaScore, which check-page-shape already requires on every one · refused · 4e93bc3b

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
