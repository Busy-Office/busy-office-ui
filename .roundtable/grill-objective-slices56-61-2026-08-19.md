# Objective grill — Slices 56-61 (2026-08-19)

Dispatched by rule 3 at 3/3. Evidence gate: **≥2 independent sources** for
`Evidence`, else `Hypothesis`.

Window: 8 iterations (1 Objective, 3 Roadmap triage, 3 Continue, 1
Standardize) — small, because this window was dominated by rapid owner
wishlist input rather than build rounds.

---

## H1 — The dispatcher has been running LIFO, not FIFO, and one starved item has a self-documented cost
**Seat: Skeptic (Rex) · process · HIGH · Evidence · actionable**

`51.1` (loop telemetry blind to refusals) was queued at 19:10 today. Since
then, **9 consecutive Continue dispatches** ran — and every single one picked
either a fresh P0, or the lowest-numbered item in whichever slice had *just*
been triaged that same wake:

```
19:20  52.1     20:12  52.2     20:24  54.1 (P0)   20:33  54.2
21:00  54.3     21:31  53.1     21:47  56.1+56.2   22:09  59.1     23:01  61.1
```

Not one touched `51.1`, `52.3`, `53.2`, `53.3`, or `58.1` — all older, all
still open, all sitting behind newer slices in `ROADMAP.md`. **This is not
coincidence; it is the mechanism working exactly as written and worse than
intended.** LOOPS.md rule 4 says *"the top of the **current in-progress
slice's** queue"* — but "current in-progress slice" is never defined anywhere
in the file, and `RESUME.md`'s "In flight" section (the natural place to
define it) has said "nothing" since 2026-08-18, four days and dozens of
slices out of date. In practice, "current" has meant *whichever slice a
triage step just created* — and because triage inserts a new slice heading
near the top of the file, the file's own top-to-bottom order (used every wake
to find "the queued item") is a LIFO stack: new work always jumps the line,
and once an item's slice is no longer the newest, it sinks and stays sunk.

**This has a real, not hypothetical, cost.** `53.2` (grill `icon`, the only
NET-negative component) was queued with my own words: *"any removal is free
only until 0.2.0 publishes… the free window closes at publish."* That
argument has been sitting unactioned for the entire 9-dispatch window while
newer, unrelated triage kept winning by insertion order alone.

**Counter-evidence, and it matters:** not every starved item is equally
starved *of value*. `52.3` (Object Page naming) is explicitly an OWNER CALL —
it cannot be dispatched by the loop at all, so its age is appropriate, not a
bug. `51.1` and `53.3` are cheap and low-urgency; deferring them cost little.
Only `53.2` carries a stated, time-sensitive cost, and `58.1` was explicitly
requested by the owner to be "in the plan" — both of those are where the
LIFO behavior actually bit.

→ **Fixed directly**, not queued — this is a process/direction finding, and
Step 1's own rule says process changes to LOOPS.md are edited on sight. See
below.

---

## H2 — This window shipped zero framework CSS
**Seat: Chair · WORKING · MEDIUM · Evidence**

```
framework src (packages/core/src)   0 changes
gates/scripts                       +90 / -0  (one file: check-data-hooks)
docs pages                          +166 / -0
classes                             189 -> 189, unchanged
claims call sites                   73 -> 73, unchanged
```

Every landed item this window was docs, a gate, or a triage — the RF-floor
publish (59.1), the review-anatomy page (61.1), the data-hooks gate (56.1)
and its own Standardize conversion (60.1). **Nothing shipped that changes what
a consumer imports.**

**Counter-evidence:** this is not stalling, it is exactly what a
triage-heavy window produces, and three of those four landed items exist
*because* of real defects the docs work uncovered (three dead dialog buttons,
a shell-coupled behavior, a `0fr` collapse bug) — H2 from the last grill
already established that self-correction from building is healthy. The
concern is only real in combination with H1: if the loop is *also*
structurally avoiding older queued build work, a docs-only window is evidence
of the same cause, not an independent problem.

---

## H3 — npm still serves 0.1.1. Tenth consecutive grill.
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

```
npm view @busy-office/ui version  ->  0.1.1
local packages/core/package.json  ->  0.2.0
```

Restated for the tenth time. Unchanged, still owner-triggered.

---

## Fix applied directly (process change, per Step 1)

LOOPS.md rule 4 and the Continue trigger line both said "the current
in-progress slice's queue" without defining it, and the natural definition —
whichever slice was most recently touched — produces LIFO. Changed to name
the oldest open item across the whole backlog explicitly, with `RESUME.md`
kept as the override for genuine multi-round in-progress work (a slice
actually mid-build, not merely most-recently-triaged). `RESUME.md`'s stale
"nothing" is also flagged inline as a signal to check, not trusted blindly.

---

## Feeding back into triage

- **H1 → fixed directly in LOOPS.md** (see diff in this commit).
- **H2 → no new work**, read together with H1: expect this to self-correct
  once the FIFO fix lets `53.2` and `58.1` surface.
- **H3 → restated, owner-blocked.**
