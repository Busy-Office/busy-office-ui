# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 17:01 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 200** (1 open)
  - 200.7 — a lint check that a raw ms duration or literal easing function isn't hand-written in component CSS where a `--bo-motion-` prefixed token exists.
- **Slice 201** (1 open)
  - 201.4 — 200.7's gate is largely already shipped as `check:motion`, and a naive version would fail the build on two right answers.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1174 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-29 22:59   ok
  Objective     2 / 3 slices          since 2026-08-29 23:06   ok  [200, 205]
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 14:45 · Meta · refusal · display … allow-discrete on the bulk bar — it buys holding the box through a fade-OUT, which this item's Accept excludes; adding it would have created the exit flourish the item rules out · refused · 1c7875e4
- 2026-08-29 14:45 · Meta · refusal · fixing check:rf-floor inside this dispatch — the @starting-style coverage gap it exposed is about the gate, not the bulk bar, so it is filed as 205.1 rather than widening the item · refused · 1c7875e4
- 2026-08-29 22:59 · Standardize · sweep · Slice 206 — fourth clean sweep; motion @starting-style repetition checked and correctly left alone · landed · c97e893
- 2026-08-29 23:06 · Objective · grill · Slices 204/206 grilled — an environment fact (headless Chrome's pointer capability) drifted mid-session; the self-healing gate absorbed it with no code change · logged · 31bec93
- 2026-08-29 23:06 · Meta · refusal · a Chromium version-pin gate — would trade one kind of staleness for another this repo does not control · refused · 31bec93
- 2026-08-29 23:15 · Continue · build · 205.1 — check:rf-floor's pass message narrowed to what it actually checks; base rate 6 at-rules, 1 above 108, at-rules degrade wholesale by CSS spec so no guard needed · landed · 39a6fa2
- 2026-08-29 16:04 · Continue · build · 200.5 — toast exit animation + bounded stack reflow; auto-dismiss premise measured false · landed · a7dbf0b1
- 2026-08-29 16:04 · Meta · refusal · adding an auto-dismiss timer to satisfy two Accept clauses that presumed one — measured absent, and the framework's position is that it never removes a toast the reader did not dismiss · refused · a7dbf0b1
- 2026-08-29 17:01 · Continue · build · 200.6 — row insert/delete + inline-validation entrance wired from the motion module into /getting-started/htmx; removal on a timer, never animationend · landed · e1be09a
- 2026-08-29 17:01 · Meta · refusal · a gate for 'a message that ARRIVES with no live-region role' — check:live-regions reads built html and structurally cannot see it, but the base rate is 0 message-shaped insertions across the 5 docs pages that call createElement (94.11) · refused · e1be09a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
