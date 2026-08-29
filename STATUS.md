# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-29 14:22 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 200** (4 open)
  - 200.4 — data-table bulk-actions get an entrance transition instead of an instant `display` flip.
  - 200.5 — toast gets an exit animation and a bounded stack-reflow, matching the entrance it already has.
  - 200.6 — row insert/delete and inline-validation entrance, composed from existing motion-module utilities, plus the usage guidance the already-shipped pulse/settle mechanisms are missing.
  - 200.7 — a lint check that a raw ms duration or literal easing function isn't hand-written in component CSS where a `--bo-motion-` prefixed token exists.
- **Slice 201** (1 open)
  - 201.4 — 200.7's gate is largely already shipped as `check:motion`, and a naive version would fail the build on two right answers.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1163 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-08-29 21:04   ok
  Objective     2 / 3 slices          since 2026-08-29 21:09   ok  [200, 204]
  Optimize      0 wake-date(s) newer   since 2026-08-29 01:46   ok   [newest pair: axe-violations; 101 sample(s), 13 of 30 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-29 12:56 · Continue · bug · 201 — P0: two undefined var(--bo-*) references silently dropped their declarations (scan flash invisible, combobox code not monospace); fixed both, added check:token-refs · landed · 0026066a
- 2026-08-29 12:56 · Meta · refusal · a naive 200.7 literal-duration gate — its only two reds are scan's 600ms and skeleton's 1.8s, both deliberate and both already adjudicated by check:motion (filed as 201.4, left OPEN) · refused · 0026066a
- 2026-08-29 21:04 · Standardize · sweep · Slice 202 — all three standing lanes clean at Slice 197 baseline; dialog/offcanvas motion reuse and check-token-refs scope both checked, neither duplicates · logged · c217250
- 2026-08-29 21:09 · Objective · grill · Objective grill of 199-202 — 201's new gate re-verified by injection, two Slice 200 refusals confirmed against source · logged · 9e7b74a
- 2026-08-29 21:26 · Continue · build · 200.2 — restrained button press feedback; the Accept's own hover/pointer selector let a real keyboard Space press get the same transform as a mouse click, fixed with :not(:focus-visible) · landed · a9403f4
- 2026-08-29 22:00 · Roadmap · release · 185.2 closed + v0.6.0 released — create-ui@0.1.1 confirmed carrying SLSA provenance · released · 4ea551b
- 2026-08-29 14:22 · Continue · bug · 204.1 — P0: check:claims accused correct CSS for three commits (CI red 642-644); gate() gains notVerified() · landed · 79f4ca3
- 2026-08-29 14:22 · Meta · refusal · forcing a desktop pointer via --blink-settings / --touch-events — six launch variants measured, none moves headless Chrome off (pointer: none) · refused · 79f4ca3
- 2026-08-29 14:22 · Continue · build · 200.3 — tab + segmented selection easing, colour only, token-driven; forced-colors zeroed · landed · 79f4ca3
- 2026-08-29 14:22 · Meta · refusal · border-color in segmented's transition list — the Accept names it, but no rule there changes an option's border colour · refused · 79f4ca3

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
