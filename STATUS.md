# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-31 14:43 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 232** (2 open)
  - 232.1 — 229.3's BROAD base rate of 2 is an artefact of `owes?\b` not matching `owed`. The tense-inclusive count is 7, and the 5 extra firings are exactly the five files 229.2 corrected — the set 229.3's own Accept names as the ones it must not fire on.
  - 232.2 — the recurrence history 229.3 never measured: the defect was introduced BY the commit that paid the debt, and has recurred zero times since.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1246 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-08-31 13:03   ok
  Objective     0 / 3 slices          since 2026-08-31 14:43   ok
  Optimize      0 wake-date(s) newer   since 2026-08-31 08:41   ok   [newest pair: axe-violations; 106 sample(s), 13 of 33 name(s) sampled twice]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-31 10:38 · Continue · build · 229.5 — ENVIRONMENT.md's git-blob bullet generalised to 'a figure describing a commit is read from that commit'; the commit that added the narrow form broke it in its own subject (d701e61: 3,794 -> 1,473 stated, 1,626 held) · landed · d557d56d
- 2026-08-31 13:03 · Standardize · sweep · 230.1 cascade.astro z-index parse reconciled against the shipped tokens; lanes 4 of 4 clean · landed · ff2b623d
- 2026-08-31 13:03 · Meta · refusal · a gate over 'a parsing page asserts its parse' — the population is 6 of 6 after this fix, so it is uniformly true and distinguishes nothing (roadmap 94.11) · refused · ff2b623d
- 2026-08-31 13:50 · Polish · reconcile · 231.1 component/alerts round 2 — reconciliation clean on all four arms, recorded as a NO-OP · logged · 4beb4b86
- 2026-08-31 13:50 · Meta · refusal · a gate over 'a shipped variant is demoed on its own page' — residual base rate 1 of 89 after 16 of 17 were found to carry a recorded reason, so 94.11 ceremony · refused · 4beb4b86
- 2026-08-31 13:50 · Roadmap · plan · 231.2 filed — bo-alert--elevated published in the API tables and explained nowhere; three call sites are one screen, so Objective §3 is the question · triaged · 4beb4b86
- 2026-08-31 14:32 · Continue · build · 231.2 — bo-alert--elevated documented on /components/alerts; KEEP decided on the arrival-vs-presence distinction, removal refused · landed · c870a4f2
- 2026-08-31 14:32 · Meta · refusal · removing bo-alert--elevated — .bo-toast's entrance animation makes the raised surface alone insufficient for a static list · refused · c870a4f2
- 2026-08-31 14:43 · Objective · grill · Objective grill of Slices 229, 230, 231 — 230 and 231 survive; two findings against how 229.3 recorded its numbers (232.1 BROAD base rate excludes past tense, 7 not 2; 232.2 recurrence history, defect introduced by the commit that paid the debt) · logged · fd46c495
- 2026-08-31 14:43 · Meta · refusal · filing the two-collision cost as an item — Step 0c accepts collisions with the cost already named; recorded for the owner instead · refused · fd46c495

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
