# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 09:40 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 169** (1 open)
  - 169.3 — the generalized form of 169.1: `RESUME.md` is carrying durable content, and its charter says it cannot.
- **Slice 170** (2 open)
  - 170.2 — the generalized form of 170.1: nothing re-reads the narrative sections of `ROADMAP.md`, and refusing this is a satisfying outcome.
  - 170.3 — `dispatch_status.py`'s zero-slice guard hard-exits on a legitimate row, and this wake tripped it live.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1033 iterations logged)
  Standardize   2 / 4 Continue rounds since 2026-08-28 07:45   ok
  Objective     2 / 3 slices          since 2026-08-28 08:46   ok  [168, 170]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 07:44 · Standardize · sweep · 169.1 — LOOPS.md's prose-sweep step named three pages as unread that 161.1 had verdicted; 166.1 corrected only RESUME.md, which is rewritten every wake. Instruction now names the property. · landed · 87bf0f54
- 2026-08-28 07:45 · Standardize · sweep · 169.2 — report-prose.mjs's family list printed a bare URL while its corpus list printed authored+generated; the family half is the one the playbook sends a wake to read. Split now printed in both. · landed · 87bf0f54
- 2026-08-28 07:45 · Standardize · sweep · 169.3 — 63% of RESUME.md is durable content its own header forbids; filed with Accept criteria rather than decided, because the destination is a direction call · triaged · 87bf0f54
- 2026-08-28 08:46 · Objective · grill · Objective grill 164/167/169: ROADMAP.md's plan of record went stale 37 minutes after it was written and 193 commits passed over it, invisible because rule 4 reads checkboxes and never the prose above them; and rule 3's Objective exclusion is one hop short — a grill files items in its own slice number and Continue builds them, so 7 of 26 dispatches were armed by grill follow-up, this one at 2 of 3 · logged · 00d9e099
- 2026-08-28 08:46 · Meta · refusal · a slice-heading classifier inside dispatch_status.py — it would be the sixth regex, and this grill's own first attempt got it wrong · refused · 00d9e099
- 2026-08-28 08:46 · Meta · refusal · rewriting the owner's Sequence table rather than annotating it — 130.4's closure was an owner call, so recording the supersession is bookkeeping and choosing a new sequence is not · refused · 00d9e099
- 2026-08-28 08:48 · Continue · fix · 170 — trap 1 corrected in the handover after it bit for real: on a detached HEAD the stale local main ref is what git push sends, so the first push of this wake was rejected while the work was strictly ahead — and rev-list --left-right against HEAD is the check that gives false comfort · landed · e46a8e6f
- 2026-08-28 09:40 · Continue · build · 168.1 — RESUME.md gains a standing ## Direction block: four answers a wake fills from named sources, two backed by recorded commands. Implemented not refused, because the item's refusal argument ('the owner sees it in conversation') assumes a conversation and this is the scheduled cloud routine. Premise re-checked and half wrong: fb15cdc IS 164.3 advancing it, so the figure is 12 of 13 work rows did not advance it, a rate not a state; registry asked directly and create-ui is still E404 · landed · f2506dfb
- 2026-08-28 09:40 · Meta · refusal · generating the block into STATUS.md — 'is the direction blocked' is not derivable from the log without classifying rows by subject, the sixth regex LOOPS.md rule 3 refuses by name and the one 170.3 is open about · refused · f2506dfb
- 2026-08-28 09:40 · Meta · refusal · a threshold on the 12-of-13 rate — that is the ratio 168.1's own Accept refuses, and it cannot tell maintenance that unblocks product from maintenance that displaces it · refused · f2506dfb

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
