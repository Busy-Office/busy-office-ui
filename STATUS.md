# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-25 06:23

## Open items by slice

- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page. UNBLOCKED 2026-08-24 — the coupling to 112.3 cost more than it saved.
- **Slice 142** (1 open)
  - 142.4 — command bar: document its states.
- **Slice 143** (1 open)
  - 143.2 — a demo cannot show what only its CONTEXT produces.

## Dispatch counters

```
dispatch status — counter-triggered rules (861 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-25 05:56   ok
  Objective     0 / 3 slices          since 2026-08-23 18:32   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 143.2 — a demo cannot show what only its CONTEXT produces.
- 142.4 — command bar: document its states.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.5 — "Which Pattern Should I Use?" docs page. UNBLOCKED 2026-08-24 — the coupling to 112.3 cost more than it saved.

## Last 10 iterations

- 2026-08-24 22:01 · Continue · bug · docs search bar: gate Pagefind results below 2 chars (was 113 noise-ranked results for 's'), pin cmdk result list-style/row-spacing against a stale-cache mismatch · landed · 8ff3971deab0e6b56bb6783289e667bf4f1eb1ac
- 2026-08-24 22:20 · Continue · bug · docs search bar: filter weak/gibberish matches by prefix-overlap with query (score alone doesn't separate noise from signal), sticky cmdk input via flex chain, Clear button sized to real input height + swapped to close glyph · landed · 3a90a7a61ea0480a767f3d7537695a06ebf68b6a
- 2026-08-24 23:11 · Roadmap · triage · realigned all six gated items — OWNER CALL precondition obsolete (0.5.0 shipped), 112.5 decoupled and unblocked, Turbo condition measured · logged · cbd935a
- 2026-08-24 23:15 · Standardize · tidy · richtext __divider deprecated for __group; last two usages migrated (canonical sample + reference app) · landed · d3bb443
- 2026-08-25 05:42 · Standardize · tidy · 141 — docs palette uses shipped bo-kbd instead of a local re-implementation; Pagefind focus ring aligned to framework tokens · landed · cdd7c07
- 2026-08-25 05:49 · Continue · bug · 142.1 — skeleton shimmer swept between two byte-identical tokens and was never visible; new highlight token, 10/10 distinct frames · landed · ef64c74
- 2026-08-25 05:56 · Standardize · tidy · 142.3 — filtered-empty gains copyable code; phantom .bo-state--empty removed from prose and regenerated data · landed · 56f742c
- 2026-08-25 06:07 · Continue · build · 142.2a — skeleton sweep retimed (travel 4x too far, not duration), linear, left-to-right; motion showcase with speed controls · landed · d70bd16
- 2026-08-25 06:17 · Continue · bug · skeleton loop cut at restart — band was visible at both endpoints; 150%/-50% over 1.8s is seamless, proved after 3 false instrument readings · landed · c7d460d
- 2026-08-25 06:23 · Continue · bug · 143.1 — dead Reprice-line button on /base/motion (Attention effects carry no class at rest); 143.2 triaged · landed · 1112baf

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
