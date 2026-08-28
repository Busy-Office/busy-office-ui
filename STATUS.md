# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-08-28 08:49 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 168** (1 open)
  - 168.1 — let the dispatcher SAY when the chosen direction is blocked.
- **Slice 169** (1 open)
  - 169.3 — the generalized form of 169.1: `RESUME.md` is carrying durable content, and its charter says it cannot.
- **Slice 170** (2 open)
  - 170.2 — the generalized form of 170.1: nothing re-reads the narrative sections of `ROADMAP.md`, and refusing this is a satisfying outcome.
  - 170.3 — `dispatch_status.py`'s zero-slice guard hard-exits on a legitimate row, and this wake tripped it live.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1030 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-08-28 07:45   ok
  Objective     1 / 3 slice           since 2026-08-28 08:46   ok  [170]
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS — protocol owner-confirmed 2026-08-23, scaffold ready.
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-08-28 06:50 · Continue · build · 167.3 — STATUS.md's history half had no reconciliation: a git-ignored loops.db means a fresh cloud container renders 'Last 10 iterations' from 2 rows against the log's 1,020, deleting nine committed rows silently; generator now counts the raw log rows, announces, rebuilds and re-checks · landed · cef80575
- 2026-08-28 06:50 · Meta · refusal · a CI gate for it — these scripts are not in CI at all, which is rebuild_from_log.py's own stated reason for putting its assertions in the writing path · refused · cef80575
- 2026-08-28 15:19 · Continue · build · 167.2: 717 words of incident narrative split from LOOPS.md rule 3 into a new LOOPS-archive.md (rule 3 1,171 -> 525); the standing lesson stays inline because a pointer is read less than a paragraph; registered with vendor-names and with report_loop_prose so the move cannot read as a fake shrink · landed · 3006da0
- 2026-08-28 07:44 · Standardize · sweep · 169.1 — LOOPS.md's prose-sweep step named three pages as unread that 161.1 had verdicted; 166.1 corrected only RESUME.md, which is rewritten every wake. Instruction now names the property. · landed · 87bf0f54
- 2026-08-28 07:45 · Standardize · sweep · 169.2 — report-prose.mjs's family list printed a bare URL while its corpus list printed authored+generated; the family half is the one the playbook sends a wake to read. Split now printed in both. · landed · 87bf0f54
- 2026-08-28 07:45 · Standardize · sweep · 169.3 — 63% of RESUME.md is durable content its own header forbids; filed with Accept criteria rather than decided, because the destination is a direction call · triaged · 87bf0f54
- 2026-08-28 08:46 · Objective · grill · Objective grill 164/167/169: ROADMAP.md's plan of record went stale 37 minutes after it was written and 193 commits passed over it, invisible because rule 4 reads checkboxes and never the prose above them; and rule 3's Objective exclusion is one hop short — a grill files items in its own slice number and Continue builds them, so 7 of 26 dispatches were armed by grill follow-up, this one at 2 of 3 · logged · 00d9e099
- 2026-08-28 08:46 · Meta · refusal · a slice-heading classifier inside dispatch_status.py — it would be the sixth regex, and this grill's own first attempt got it wrong · refused · 00d9e099
- 2026-08-28 08:46 · Meta · refusal · rewriting the owner's Sequence table rather than annotating it — 130.4's closure was an owner call, so recording the supersession is bookkeeping and choosing a new sequence is not · refused · 00d9e099
- 2026-08-28 08:48 · Continue · fix · 170 — trap 1 corrected in the handover after it bit for real: on a detached HEAD the stale local main ref is what git push sends, so the first push of this wake was rejected while the work was strictly ahead — and rev-list --left-right against HEAD is the check that gives false comfort · landed · e46a8e6f

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
