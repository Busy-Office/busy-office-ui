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

Last updated 2026-08-29 (**cloud** wake — rule 4 → Continue, build mode:
**208.3**, which closed Slice 208). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `208.3`, `208.1`, `208.2`, `209.1`,
`209.2` and `201.4` as closed ids named here — **historical references** (this
wake's subject and its neighbours), not claims that they are open. The ids
named here that genuinely ARE open are `211.1`, `211.2`, `112.3`, `112.4`.

**No collision on this wake.** `origin/main` was at `ca4f04f` at Step 0 and
still at `ca4f04f` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again**, fifth wake running. Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...ca4f04f`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. The clone is
shallow and was left shallow — no finding this wake was a history measurement.

## What landed this wake

**`208.3` CLOSED — the cloud/CI divergence is an environment artefact, and the
mechanism is named.** The reference app loads htmx from
`https://unpkg.com/htmx.org@2.0.4` (`examples/po-app/server.mjs:125`); this
container's proxy refuses the host (`net::ERR_TUNNEL_CONNECTION_FAILED`), the
page throws `htmx is not defined`, and every windowed-list assertion is
downstream of htmx. The list stays at **2 tbodies / 200 rows / `next-offset
200` for all ten scroll iterations**, never passes the 3-chunk resident budget,
evicts nothing — and `renderedBounded` passes *vacuously*.

**One variable, both directions, same container and commit.** htmx served from
`node_modules` via request interception, gate `page.evaluate` block copied
verbatim: without it `chunk0Evicted false` (reproducing the recorded payload
byte-identically, the fifth run of the class); with it `chunk0Evicted true` and
the assertion **passes 4 of 4**. Neither the app nor CI is wrong.

**Accept (a)'s third environment is not needed and that is argued, not
assumed:** (a) exists to distinguish which side is right, and the mechanism
distinguishes them directly. (b) the wrong side was the measurement. (c)
`ENVIRONMENT.md`'s `check:po-app` entry now carries the mechanism.

**The gate was fixed to say the true thing, not to pass.** `check-po-app.mjs`
asserts the precondition first — *"windowed list: htmx loaded…"*, reporting
`typeof window.htmx`. Red-proved on the predicate in both directions (blocked →
`undefined` → RED; served → `object` → GREEN). It now reads **2 of 19** here,
precondition first, and is a 19th passing check on CI. **Do not "fix" either
failure here.**

**Two things filed rather than built — Slice 211**, because both are outside
208.3's Accept: `211.1` vendoring htmx into the example (a product call — it
changes what the example teaches), and `211.2` the scroll-anchor assertion,
which has only ever passed *vacuously* in a container and read **98 / 49 / 0 /
0** against its `<= 2` threshold once htmx was present. 211.2 is stated as an
observation, not an accusation: the shim serves htmx from memory, which is not
how it ships.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here — zero
lines changed under `packages/core/src/` or `apps/docs/src/`; the diff is one
gate script plus markdown. Green in this container: core build, core `npm run
test` 151/151, `lint:css`, `docs:build` rc=0, `check:claims` 158 live + 3 NOT
VERIFIED (ENVIRONMENT.md §6b — the container's pointer capability, not a
regression), `check:formatting`, `check:scroll` 910 containers, `check:layout`
127 pages, `check:forced-colors`, `test:axe` 127 pages × 2 widths zero
violations, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:selftests` 46 gates / 16 heuristic, `create-ui`
check, `suite` audit 28 screens. `check:po-app` **red here by design** — see
above.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — re-run it rather than trusting this
snapshot:

```
python3 scripts/loops/dispatch_status.py
```

**Rule 3 is OVERDUE — `Objective 3 / 3 [200, 208, 209]`.** This wake's row
closed Slice 208, which armed it. Rule 3 sits above rule 4, so **next wake
dispatches Objective**, a grill of Slices 200, 208 and 209 — not a build item,
whatever the backlog says. Rule 2 stands at `3 / 4`; rule 5's line reads `ok`,
not STALE, and reports nothing regressed.

**If Objective has already run and rule 4 is reached, five open checkboxes.**
Say the kind of blocked rather than "all blocked":

| item | what | kind of blocked |
|---|---|---|
| `211.2` | scroll-anchor `anchorShift` where htmx loads as it ships | **cloud-takeable in part** — a cloud wake can re-measure through the shim, but the Accept asks for htmx loading *the way it ships*, which here it cannot. CI is the other route. |
| `211.1` | vendor htmx into `examples/po-app`? | **owner-blocked** — a product call about what the example teaches, not a defect |
| `112.3` | pattern-fit pilot | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

**`208.3` is gone from that table, and it was the item the last hand-off said
wanted a local wake.** That prediction was wrong in an instructive way: it
classified 208.3 as needing a third *environment*, when what it needed was
reading the page console — one line of `page.on('pageerror')` in the
environment already reproducing the failure. Root-causing is best done where
the failure reproduces, which was here all along. Worth carrying into the next
"browser-blocked" classification.

## Direction

Nothing blocked on the owner that a wake could advance beyond the standing
three, and one new one worth a moment's eye:

**`211.1` is a genuine product question, not maintenance.** `examples/po-app`
is the "Devi test" consumer four docs pages cite, and it cannot run without
reaching the public internet — while the same shell already serves
`/assets/css/htmx.min.css` locally, so it is half-vendored today. Vendoring the
script would make the example runnable offline and would have saved four gate
runs across two containers; it would also stop the example demonstrating the
CDN wiring that `/getting-started/htmx` documents. That trade is the owner's,
which is why it was refused inside 208.3 and filed rather than done.

**The cloud lane is NOT out of build work, which reverses the last hand-off.**
That claim rested on 208.3 being uncloudable; it was not. Next wake is an
Objective grill regardless, by rule 3.
