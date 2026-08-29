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

Last updated 2026-08-29 (local session — **rule 4 → Continue, build mode,
`205.1`**). Working tree clean at hand-off; the wake's commits went out as
one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 6 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

**No collision on THIS item.** `205.1` landed clean. Earlier this session had
FOUR real collisions (193.2, 200.3, 200.4, and an early duplicate) — all
resolved per Step 0c: the pusher-second side discarded its work rather than
force-merging. One local fork's implementation of 200.4 was independently
correct but discarded anyway, because the cloud wake's landed version was
verifiably MORE correct (an asymmetric entrance-only transition, avoiding an
exit flourish the local fork's symmetric version would have accidentally
introduced) — read `git show 1c7875e` if that reasoning is needed again.

## What landed this session, most recent first

**205.1** — `check:rf-floor`'s pass message ("every use of a feature above
Chrome 108 is guarded") was broader than what the gate actually checked: an
unlisted at-rule (`@starting-style`, which entered `rf-essentials.css` via
200.4) was silently dropped rather than flagged. Base rate measured: 6
distinct at-rules in the built file, exactly 1 above the floor. Chose the
message-fix branch over a generic BCD rewrite (population too small to
justify it) — the header now states the real reason (CSS drops an
unrecognised at-rule WHOLESALE, never partially, which is why only these need
active guarding). Also fixed two dead `FEATURES` entries that were declared
but silently excluded from evaluation. Red-proved by injecting a fake
at-rule and confirming the live reporter caught it (6→7) before reverting.

**206 / 207** — Standardize sweep (fourth identical clean result: 0 dead
style, 8 css-repeat groups, 14 flagged prose pages, matching three prior
sweeps exactly) and the Objective grill that followed it, covering 204/206.

**204** — P0: `check:claims` had been red on `main` for 5 commits (642-646,
including the `Release 0.6.0` commit itself) asserting a claim headless
Chrome structurally cannot evaluate (no pointer device). Guarded, not
deleted — the claim stays as the real evidence for a machine with a mouse.

**200.4** — data-table bulk-actions entrance transition (cloud-landed,
see collision note above). **200.3** — tab/segmented selection transitions
(cloud-landed, caught a real forced-colors cascade-position bug —
independently rediscovered by a local fork at the same time, which is why
it collided). **200.1/200.2** — dialog exit motion and button press
feedback (local session), each caught a real synthetic-event test-harness
bug before trusting a red/green result.

**Release 0.6.0** — cut and confirmed on the npm registry: `@busy-office/ui`
and `@busy-office/create-ui` both live, **`create-ui@0.1.1` carries SLSA
provenance** — the whole point of this session's Trusted Publisher work
(roadmap 185.2, closed with the actual registry proof, not just the
npmjs.com config screenshot).

## Dispatcher state at hand-off

```
Standardize   1 / 4 Continue round    ok
Objective     1 / 3 slices            ok   [205]
Optimize      0 wake-date(s) newer    ok
```

**Next wake: rule 4, oldest open non-owner-blocked item.** Six open items:

| item | what | notes |
|---|---|---|
| `201.4` | 200.7's proposed lint gate mostly duplicates `check:motion` already shipped | check before building a redundant gate |
| `200.5` | toast exit animation + bounded stack-reflow | |
| `200.6` | row insert/delete + inline-validation entrance | |
| `200.7` | lint check for hand-written durations outside the token scale | read 201.4 first |

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware).

## A process note worth carrying forward

**Fork dispatch was unreliable for two consecutive attempts today** (both
returned a bogus zero-tool-call result that just echoed the dispatch prompt
back). The fix that worked: verify against `git log`/`git status` before
trusting ANY fork's self-report, and if a dispatch looks bogus, either retry
once with an explicit "you MUST call tools" instruction or do the work
directly rather than retrying the same broken pattern repeatedly. Later
dispatches in the same session worked normally (36-39 real tool calls,
verifiable results) — treat it as a possible transient failure mode to
watch for, not a permanent one.
