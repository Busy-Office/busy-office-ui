# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-25 07:13

## Open items by slice

- **Slice 112** (3 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
  - 112.5 — "Which Pattern Should I Use?" docs page. UNBLOCKED 2026-08-24 — the coupling to 112.3 cost more than it saved.
- **Slice 142** (1 open)
  - 142.4 — command bar: document its states.

## Dispatch counters

```
dispatch status — counter-triggered rules (864 iterations logged)
  Standardize   0 / 4 Continue rounds since 2026-08-25 07:13   ok
  Objective     0 / 3 slices          since 2026-08-23 18:32   ok
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 142.4 — command bar: document its states.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.5 — "Which Pattern Should I Use?" docs page. UNBLOCKED 2026-08-24 — the coupling to 112.3 cost more than it saved.

## Last 10 iterations

- 2026-08-24 23:15 · Standardize · tidy · richtext __divider deprecated for __group; last two usages migrated (canonical sample + reference app) · landed · d3bb443
- 2026-08-25 05:42 · Standardize · tidy · 141 — docs palette uses shipped bo-kbd instead of a local re-implementation; Pagefind focus ring aligned to framework tokens · landed · cdd7c07
- 2026-08-25 05:49 · Continue · bug · 142.1 — skeleton shimmer swept between two byte-identical tokens and was never visible; new highlight token, 10/10 distinct frames · landed · ef64c74
- 2026-08-25 05:56 · Standardize · tidy · 142.3 — filtered-empty gains copyable code; phantom .bo-state--empty removed from prose and regenerated data · landed · 56f742c
- 2026-08-25 06:07 · Continue · build · 142.2a — skeleton sweep retimed (travel 4x too far, not duration), linear, left-to-right; motion showcase with speed controls · landed · d70bd16
- 2026-08-25 06:17 · Continue · bug · skeleton loop cut at restart — band was visible at both endpoints; 150%/-50% over 1.8s is seamless, proved after 3 false instrument readings · landed · c7d460d
- 2026-08-25 06:23 · Continue · bug · 143.1 — dead Reprice-line button on /base/motion (Attention effects carry no class at rest); 143.2 triaged · landed · 1112baf
- 2026-08-25 06:57 · Continue · build · 143.2 DemoFrame + demo routes (sidebar-nav both states, offcanvas in-frame); 143.3 collapsed icon centring · landed · 6b00ee2
- 2026-08-25 07:04 · Continue · build · 143.4 — drawer exit motion via allow-discrete behind @supports; chosen because the JS route could fail to close · landed · 7acd8aa
- 2026-08-25 07:13 · Standardize · tidy · 0fr/1fr triplication settled as correct — utility vs component-part selector ownership, plus the opt-in module · refused · f4d4d11

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
