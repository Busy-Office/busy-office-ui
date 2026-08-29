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
`200.6`). Working tree clean at hand-off. **Two pushes, not the usual one** —
the first turned CI red and the second is the fix; the operating rule's
"one push per wake" lost to not leaving `main` red. Stated rather than
glossed, because the rule exists to bound Pages deploys and this wake spent
two.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `200.6` as a closed id named here. That is
a **historical reference** — the "what landed" section below — not a claim that
it is open.

**No collision on this item.** `origin/main` was at `efa2d21` at Step 0 and
still at `efa2d21` at the mandated re-fetch before the first commit
(`git rev-list --left-right --count origin/main...HEAD` → `0 0`).

## What landed this wake

**200.6** — row insert, row delete and inline-validation entrance, wired from
the opt-in motion module into `/getting-started/htmx` as one new section, "5.
Motion on swapped rows and messages" — the page that already documents the
settle flash, which is where the item said the guidance belonged. **No new
CSS: zero lines changed under `packages/`.** The guidance is one `<p>` (cell vs
row vs summary total; never while typing, never on first paint, never more than
~once/second per region) and it carries the windowed-table exemption in that
same paragraph, as the Accept required.

Accept clause 1 was read out of the BUILT CSS, not out of intent: each of
`.bo-motion-fade-in` / `-fade-out` / `-slide-in-block-start` resolves to
exactly **1** rule in `packages/core/dist/css/motion.css` with a matching
`@keyframes` (8 total), and `grep -ric shake packages/core/dist/css/` reads
**0** — so "explicitly no shake" is a property of the artifact.

**Three `check:claims` cases, 155 → 158, every sub-assertion red-proved by
injection, with the injection confirmed in the BUILT html before any red was
believed.** The load-bearing one asserts that deletion does not depend on
`animationend`: the check kills the leaving row's animation outright
(`style.animation = 'none'`, **not** by stripping the exit class — see below),
so no animation of any name is left to end, and the row must still go.
Injected `animationend`-gated version →
`{"after":3,"ended":0,"stillAttached":true}` — the row never left.

**The first draft shipped an accessibility defect and no gate could have caught
it.** The inline-validation message is inserted after load, so
`/concepts/accessibility#live-regions` requires `role="alert"`; the draft had
the `aria-invalid`/`aria-describedby` wiring and no role.
`check:live-regions` reads the BUILT html, so it catches a static role on
content that never arrives and structurally cannot catch the opposite. A gate
for it was measured and **refused** per 94.11 — 5 docs pages call
`createElement`, the other four insert tags and rows, so there are **0**
message-shaped insertions besides this one and a gate would have nothing to
catch. The one instance is asserted live by the claims case instead.

**This wake turned CI red once and fixed it.** Run 655's "Claims + formatting"
job failed on one of the three new cases; the payload showed the page was
correct and the assertion was not. Two defects, both this repo's own shapes: it
counted the ENTRANCE animation's `animationend` (0 locally, 1 on CI — a number
that differs between two runs of one commit is the instrument), and the fix for
that made the check unable to fail, caught only by re-running the injection,
which replayed GREEN. Stripping the exit class is not a cancel — the row still
carries `bo-motion-fade-in`, so removing `fade-out` restarts the entrance.
Cancelled with `animation: none` instead and re-proved red. **The rule worth
carrying: re-red-prove after CHANGING a detector, not only after writing one.**
Also: `check:formatting` was never run locally by this wake before CI ran it —
`ENVIRONMENT.md`'s cloud-toolchain list does not name it, and that list is what
the wake used.

**NOT VERIFIED and named as such**, in the commit and in ROADMAP 200.6: no
Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. Every figure is DOM, computed style or built-artifact text. Whether a
row fading out of a compact table *reads* as the line leaving rather than as
the table twitching is a judgement a local wake should settle by watching
`/getting-started/htmx` while removing a line.

## Dispatcher state at hand-off

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [200, 205]
Optimize      0 wake-date(s) newer    ok
```

Re-run `python3 scripts/loops/dispatch_status.py` rather than trusting those —
they are a snapshot taken before this wake's row was recorded.

**Next wake: rule 4, oldest open non-blocked item.** Five open items:

| item | what | notes |
|---|---|---|
| `201.4` | 200.7's proposed lint gate mostly duplicates `check:motion` already shipped | read before building a redundant gate; either outcome closes it |
| `200.7` | lint check for hand-written durations outside the token scale | read 201.4 first |

`200.7` is the oldest of the two and neither is browser-blocked — 200.7 is a
script, and 201.4 is a measurement plus a written verdict. Both are
cloud-takeable.

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware).

## Direction

Nothing blocked on the owner that a wake could advance. The three owner-blocked
items above are the standing set and are unchanged by this wake.

One judgement worth an owner's eye, not a blocker: this wake put a **live
demo with its own inline script** on a *getting-started* page for the first
time — the pattern was previously confined to `/base/motion` and to component
and pattern pages. It is defensible (the item asked for the three wirings to
*visibly* use the classes, and a recipe nobody can run is what the claims gate
exists to distrust), but it does grow a guide page that was five short static
recipes. If the owner would rather guides stay copy-only, the demos move to
`/base/motion`'s showcase section and the guide keeps the paragraph and the
recipes; that is a small, reversible edit.
