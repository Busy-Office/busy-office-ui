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
push (`bb16f8d`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `211.1`, `215`, `218.1`,
`219.1`, `220.1`, `220.2`, `221.1`, `221.2`, `221.3`, `223.1`, `223.2`,
`223.3`, `224.1`, `224.2`, `225.1` — are historical references to what
landed and to what this hand-off cites, not claims they are open. The four
genuinely open are **`222.1`, `112.3`, `112.4`, AT runtime**.

## What landed this wake

**Slice 225 — Objective grill of Slices 218, 219, 223, 224.** Full reasoning
and the re-derivation table are in ROADMAP 225.

- **Arming set narrowed first**: `dispatch_status.py` armed
  `[211, 218, 219, 223, 224]`; Slice 215 already grilled 211 (with 213, 214),
  so this grill covers the genuinely un-grilled four.
- **Every load-bearing count re-derived independently and held**, except one:
  218.1's own citation — *"re-run `grep -rn data-status packages/core/src
  apps/docs/src` before arguing with it → 0"* — now returns **7**, not 2,
  because the comment that CARRIES the citation mentions the bare string
  `data-status` five times while explaining the refusal, so the command
  quoted its own future match into permanence the moment it was committed.
  The substantive claim (no CSS selector uses `data-status`) still holds —
  confirmed with the anchored form (`\[data-status` → 0, comments included).
  **Fixed**: the citation now asserts the selector form, which cannot
  self-match by construction.
- v0.7.0's own npm release (from the previous wake) verified again in
  passing: `@busy-office/ui@0.7.0` / `@busy-office/create-ui@0.1.2` live,
  both with SLSA provenance.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   1 / 4 Continue round    ok
Objective     0 / 3 slices            ok     (just reset by this wake)
Optimize      0 wake-date(s) newer    ok
```

**Both counters clear — rule 4 fires next wake.** The oldest open item is
**`222.1`**, and it is genuinely dispatchable, not blocked:

| item | kind of blocked |
|---|---|
| `222.1` — characterise `check:po-app`'s `chunk0Reloaded: false` residual | **not blocked** — a genuine open measurement, oldest in the queue |
| `112.3` pattern-fit pilot | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**222.1's own text says what to do first**: don't re-run the check more
times — the distinguishing variable between the green readings (CI,
`podman --network none`) and the red one (this container's earlier run) is
the harness (tarball-consumer path vs. raw workspace), not the count. Compare
those two before touching timing.

## Direction

**Nothing else queued.** Both the htmx v4 migration and this grill are
complete work, not partial.

**Standing three unchanged** (112.3, 112.4, AT runtime).

**Still unacted, now nine wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
