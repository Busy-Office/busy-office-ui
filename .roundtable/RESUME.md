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
push (`bcd1d49`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `211.1`, `218.1`, `219.1`,
`220.1`, `220.2`, `221.1`, `221.2`, `221.3`, `222.1`, `223.1`, `223.2`,
`223.3`, `224.1`, `224.2`, `225.1` — are historical references to what
landed and to what this hand-off cites, not claims they are open. The three
genuinely open are **`112.3`, `112.4`, AT runtime** — all owner- or
hardware-blocked.

## ⚠ `main`'s CI was ACTUALLY RED for several commits — read this before trusting any green claim from this window

Rule 4 dispatched **222.1**, and its own hint (*"the distinguishing variable
is the harness"*) led straight to a live P0: `check:po-app` crashed on a
genuinely fresh install, and `main`'s CI had been failing since the "Release
prep" commit — caught only because this wake actually re-ran the check on a
wiped `node_modules`, not because anything alerted on it. Full detail in
ROADMAP 222.1.

- **Root cause**: 223's htmx-4 migration made `server.mjs`'s
  `require.resolve('htmx.org/…')` load-bearing (no CDN fallback left). A
  fresh `npm ci` never hoists `htmx.org` to root `node_modules` — it stays
  nested under `apps/docs/node_modules`, unreachable from
  `examples/po-app`'s own `require.resolve` walk.
- **Fixed at the gate**: `check-po-app.mjs` now does the real
  tarball-consumer install itself (wipe + `npm pack` + `npm install`),
  matching `examples/po-app/Dockerfile`'s own flow, instead of relying on
  monorepo-hoisting luck for either `@busy-office/ui` or `htmx.org`.
- **Also closes 222.1's original question**: with a deterministic install,
  the `chunk0Reloaded: false` residual doesn't reproduce across 3
  consecutive runs — environmental, tied to the install's prior
  non-determinism, now gone rather than merely avoided.
- **Verified against real CI, not just locally**: `gh run watch` on the
  fix's own triggered run — `conclusion: success`. `main` is green again,
  confirmed live, not inferred.
- **The earlier "verification" in Slice 223 was itself contaminated** — it
  ran against a working tree carrying stale manual installs from earlier
  session testing, a false green. Worth carrying forward: after any
  dependency-resolution change, verify from a genuinely wiped
  `node_modules`, not the tree sitting in front of you.

**What is NOT yet re-verified**: a cloud container running the fixed gate.
The new `npm install` step needs the public npm registry at gate-run time —
a different path from the CDN block that started this whole history, and
one `npm ci` already exercises successfully every cloud wake, but that is an
inference, not a direct post-fix measurement. `ENVIRONMENT.md`'s po-app
entry says so explicitly and names what a cloud wake should do: run it, and
if 19/19 holds, the entry no longer needs its exceptions-list caveat at all.

## What else landed this wake

**Slice 225 — Objective grill of 218/219/223/224** (211 dropped, already
grilled by 215): every load-bearing count re-derived and held except one
self-invalidating citation in 218.1's own comment, fixed. Full detail in
ROADMAP 225.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   2 / 4 Continue rounds   ok
Objective     1 / 3 slice             ok   [222]
Optimize      0 wake-date(s) newer    ok
```

**All three genuinely open items are blocked:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

Next wake most likely reaches **rule 6, Polish** (backlog genuinely clear of
dispatchable items), or a counter if it crosses first.

## Direction

**One real follow-up, not urgent, named rather than filed**: a cloud wake
should re-run the fixed `check:po-app` once to confirm the `npm install`
step works there as inferred, then simplify `ENVIRONMENT.md`'s entry
accordingly (see the ⚠ section above).

**Standing three unchanged** (112.3, 112.4, AT runtime).

**Still unacted, now ten wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
