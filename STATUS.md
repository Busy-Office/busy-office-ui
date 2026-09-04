# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-04 07:06 UTC

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
dispatch status — counter-triggered rules (1369 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-04 00:56   ok
  Objective     1 / 3 slice           since 2026-09-04 02:05   ok  [249]
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

- 2026-09-04 02:49 · Meta · refusal · building the /components/ catalogue page itself — browser-blocked in the screenshot sense, left OPEN for a local wake · refused · e6631a88
- 2026-09-04 02:49 · Meta · refusal · closing 249.9 on the strength of the measurement — the Accept's deliverable is the page, not the numbers · refused · e6631a88
- 2026-09-04 05:04 · Continue · build · 249.17 (split from 249.15) — og:/twitter: tags on every built page + check-metadata arm 5, red-proved four ways; Slice 260 · landed · 93ad43a
- 2026-09-04 05:04 · Meta · refusal · a placeholder og:image and twitter:card=summary_large_image — the card image needs a rendered-image check a cloud wake cannot do (249.15) · refused · 93ad43a
- 2026-09-04 05:04 · Meta · refusal · adding <link rel=canonical> alongside og:url — the item names the social tags; og:url already carries the published URL · refused · 93ad43a
- 2026-09-04 05:04 · Meta · refusal · retyping each self-head page's title/description into the SocialMeta call — hoisted to one const per page instead, so the two uses cannot drift · refused · 93ad43a
- 2026-09-04 07:06 · Continue · build · 249.18 — component→patterns mapping split out of 249.9 and landed; the audit's 'no JSON key exists' refuted and one false zero (sidebar-nav) corrected · landed · 96dc182
- 2026-09-04 07:06 · Meta · refusal · publishing the inverse into llms.txt as used-by: — the file already carries the full relation forward as uses: per pattern, so the inverse duplicates bytes for a reader that already has both halves · refused · 96dc182
- 2026-09-04 07:06 · Meta · refusal · keying byComponent by component NAME — skeleton and state share /components/state-patterns, so a name-keyed map has to invent which of the two a link meant · refused · 96dc182
- 2026-09-04 07:06 · Meta · refusal · checking byComponent against the groups beside it in the same JSON — one script writes both, so that comparison is self-consistent by construction and could never fail · refused · 96dc182

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
