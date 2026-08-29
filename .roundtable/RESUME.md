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

Last updated 2026-08-29 (**cloud** wake — rule 4 → Continue, build mode,
`200.5`). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 6 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `205.1` and `200.5` as closed ids named
here. Both are **historical references** — the "what landed" section below —
not claims that either is open.

**No collision on this item.** `origin/main` was at `828102d` at Step 0 and
still at `828102d` at the mandated re-fetch before the first commit.

## What landed this wake

**200.5** — a dismissed `.bo-toast` now leaves instead of vanishing:
`[data-state="closing"]` runs `bo-toast-out` on `--bo-motion-duration-fast`,
fading it and collapsing `block-size`/`padding-block` to zero, and
`initAlerts()` holds the node for the duration it reads back off the computed
style before removing it. An inline `.bo-alert` is untouched — still
synchronous. Measured live: survivors travel **68px** (60px toast + one 8px
`row-gap`), read **0.4573** of the way at t=400 of 1200, and the removal itself
moves **0.0625px**. Four `check:claims` cases and five behavior tests, both
red-proved by injection.

**Two of the item's five Accept clauses presumed an auto-dismiss timer and
told this wake to CHECK.** There is none — `setTimeout|setInterval|
requestAnimationFrame` reads 0 in all three shipped behaviors that touch an
alert or toast — so nothing pauses on hover/focus and nothing could
auto-dismiss an error toast. Recorded as a satisfying outcome, not a gap; the
docs now state the position (the framework never removes a toast the reader
did not dismiss) and the absence is asserted live.

**One instrument was wrong on its first output, as usual.** The reflow
measurement sampled the survivor one `requestAnimationFrame` after injection —
mid-`bo-toast-in` — and read that entrance's 8px `translateY` as a missing gap
(60 travel against a predicted 68). Measure the RESTING box; the trap is now
in the check's own comment.

**NOT VERIFIED and named as such**, in the commit and in ROADMAP 200.5: no
Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. Every figure is geometry or computed style. Whether a 100ms collapse
*reads* as a toast leaving rather than as the stack twitching is a design
judgement a local wake should settle by *watching* `/components/alerts/` while
dismissing the middle of a stack of three — a still frame cannot settle it
either.

## Dispatcher state at hand-off

```
Standardize   2 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [200, 205]
Optimize      0 wake-date(s) newer    ok
```

**Next wake: rule 4, oldest open non-blocked item.** Six open items:

| item | what | notes |
|---|---|---|
| `201.4` | 200.7's proposed lint gate mostly duplicates `check:motion` already shipped | check before building a redundant gate |
| `200.6` | row insert/delete + inline-validation entrance | composes existing motion utilities; cloud-takeable |
| `200.7` | lint check for hand-written durations outside the token scale | read 201.4 first |

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware). None of the three
dispatchable items is browser-blocked in the screenshot sense — 200.6's Accept
asks for the class to be read out of the BUILT CSS, and 200.7 is a script.

## Direction

Nothing blocked on the owner that a wake could advance. The three owner-blocked
items above are the standing set and are unchanged by this wake.

One judgement worth an owner's eye, not a blocker: `initAlerts()`'s dismiss
contract is now **asynchronous for toasts** (synchronous whenever the computed
exit duration is 0, which covers reduced motion and CSS-less consumers). The
CHANGELOG entry argues why that is not a Breaking entry and shows its
reasoning rather than asserting it — that call is reversible before the next
publish, and it is the kind of contract-shape question the freeze-audit
correction says to name out loud.
