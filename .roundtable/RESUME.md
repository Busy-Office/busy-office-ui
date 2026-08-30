# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-30 (**local** wake). Working tree clean at hand-off; one
push (`9af4c3d`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `211.1`, `218.1`, `219.1`,
`220.1`, `220.2`, `221.1`, `221.2`, `221.3`, `223.1`, `223.2`, `223.3`,
`224.1`, `224.2` — are historical references to what landed and to what this
hand-off cites, not claims they are open. The four genuinely open are
**`222.1`, `112.3`, `112.4`, AT runtime**.

## What landed this wake

**Slice 224 — Standardize sweep, all four lanes run.** Full reasoning and
every command are in ROADMAP 224.

- **Lanes 1-3 clean, no delta from standing verdicts.** `scan:dead-style`: 0
  dead. `report:css-repeats`: still exactly 8 repeat groups, same membership
  LOOPS.md's table names (rule/file counts grew, group count and membership
  did not). `report:prose`: 14 flagged pages, all already carry a verdict
  (158.1's twelve, 161.1's three, 178.3's `/concepts/scale`).
- **Lane 4 found a real defect.** Two loop-machinery files postdate 167.1's
  five-file verdict set and had never individually been verdicted:
  `ENVIRONMENT.md` (born 169.3) and `LOOPS-archive.md` (born 167.2), both
  2026-08-28. Reading `ENVIRONMENT.md` in full to give it a verdict is what
  surfaced the actual finding: its `check:po-app` entry still described the
  pre-211.1 CDN-blocked failure mode as current — *"expected reading here is
  2 of 19"* — when the actual current figure (post-211.1, post-223) is
  **1 of 19** (roadmap 222). **Fixed in place**, per the file's own charter.
  Verdicts given: `ENVIRONMENT.md` HONEST (5 up/0 down, every section traces
  to a real incident), `LOOPS-archive.md` same category as
  `ROADMAP-archive.md` — an archive, not a sixth working file.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   0 / 4 Continue rounds   ok     (just reset by this wake)
Objective     5 / 3 slices            OVERDUE  [211, 218, 219, 223, 224]
Optimize      0 wake-date(s) newer    ok
```

**Objective fires next wake** — 5 slices armed since the last grill, two more
than the 3-slice threshold. `223` (the htmx v4 migration, including the
Step 0c collision with a concurrent cloud wake's own Slice 220-222) and `224`
(this sweep) are both new material a grill has not yet covered.

**Rule 4's remaining, still blocked:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**Not owner-blocked, not rule 4 either — a genuine open measurement:**
`222.1` (the `chunk0Reloaded: false` residual on `check:po-app` in a specific
container, still undetermined between app defect and environmental timing).

## Direction

**Nothing else queued.** Both htmx-v4 migration (223) and this Standardize
sweep (224) are complete, not partial.

**Standing three unchanged** (112.3, 112.4, AT runtime).

**Still unacted, now eight wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
