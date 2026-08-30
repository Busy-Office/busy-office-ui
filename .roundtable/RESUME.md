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

Last updated 2026-08-30 (**cloud** wake). Working tree clean at hand-off; one
push, two commits (`db53ddc` triage, `1005d1d` the item).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below — `222.1`, `226.1` — are **closed**, and are cited here as what
landed, not as open work. The three genuinely open are **`112.3`, `112.4`, AT
runtime**, unchanged and all owner- or hardware-blocked.

## What landed this wake

**Slice 226 — the fixed `check:po-app`, run in a cloud container for the first
time.** This was the previous hand-off's own `Direction` item, *"named rather
than filed"*; Step 1 filed it as 226, because rule 4 reads `ROADMAP.md` and a
follow-up living only here is invisible to the dispatcher.

- **Result: green, twice.** `po-app smoke check passed — 19 behaviours verified
  end to end`, exit 0, on two consecutive runs in this container.
- **The part that makes it evidence rather than a tick**: a green run alone is
  equally consistent with *"this container happened to hoist `htmx.org` to
  root"*, which would mean the old path worked and 222.1's fix was never
  exercised. Probed instead of assumed — `node_modules/htmx.org` is **absent**
  at root, `apps/docs/node_modules/htmx.org` exists, and
  `examples/po-app/node_modules` holds `@busy-office` + `htmx.org 4.0.0` from
  the gate's own install. **The failure mode that turned `main` red is present
  here, and the gate passes through it.**
- `ENVIRONMENT.md` now agrees with that reading: `check:po-app` is in the
  runnable cloud-toolchain list, the exceptions block went **2 → 1** (only
  `docker build`, no daemon), and the old bullet's general lesson — a
  browser-driven gate reporting a *downstream* symptom of egress restriction,
  indistinguishable from an app defect without reading the page console — was
  **moved into "Traps worth carrying forward", not deleted with the trap**.
- **One tidy number flagged rather than quoted.** That file said *"the
  re-derivation prints 17; this list names 16"*. Adding `check:po-app` makes
  both 17 — and the two 17s are a **coincidence**: `check:ci-ignores` is in
  `ci.yml` only (a sub-check of `check:repo`) and `npm run test -w
  @busy-office/ui` is in the list only (`ci.yml` spells it `npx vitest run`).
  The file now says outright not to read them as a match.

**All 17 CI entry points were run green in this container** before the push:
core build/test/lint:css, `docs:build` (with `check:repo` inside it), claims,
formatting, scroll, layout, forced-colors, axe, target-size, search, pseudo,
quickstart, create-ui, suite, po-app. `check:claims` reported **3 NOT
VERIFIED** — that is `ENVIRONMENT.md` §6b, a property of this container's
pointer capability, **not** a regression; do not "restore" the zero.

**Not verified, said plainly:** nothing rendered changed this wake (markdown
plus a gate run), so the Podman screenshot lane — 1440/390, light and dark —
was not needed. It also could not have run here. No claim in this wake rests on
a rendered image.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [222, 226]
Optimize      0 wake-date(s) newer    ok
```

Both counters advanced by exactly one on this wake's Continue row, which is the
Step 0b comparison — read the counter right after recording — and it agreed.

**All three genuinely open items are blocked, and the kind matters (rule 4):**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

None is browser-blocked, so **a local wake has no advantage over a cloud one on
the current open set** — the 173.2 situation (four wakes calling a merely
browser-blocked item owner-blocked) does not apply to any of these three.

Next wake most likely reaches **rule 2, Standardize** if one more Continue round
lands first, otherwise **rule 6, Polish** — the backlog is again clear of
dispatchable build items.

## Direction

**The previous hand-off's one follow-up is DONE** — the cloud `check:po-app`
run and the `ENVIRONMENT.md` simplification are Slice 226. Nothing replaces it;
this block is genuinely empty of new asks.

**Standing three unchanged** (112.3, 112.4, AT runtime). All three need the
owner; no wake of any kind can advance them.

**Still unacted, now eleven wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
