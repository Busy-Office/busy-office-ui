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
**Slice 210**, closing `200.7` as refused and `201.4` with it). Working tree
clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `200.7`, `201.4`, `209.1`, `208.1` and
`208.2` as closed ids named here — **historical references** (this wake's subject
matter and the last one's), not claims that they are open. `209.2` and `208.3`
genuinely are open.

**No collision on this wake.** `origin/main` was at `aacb356` at Step 0 and still
at `aacb356` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again**, third wake running. Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...aacb356`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. Also
unshallowed — one finding needed a worktree at an older commit.

## What landed this wake

**`200.7` REFUSED, and the qualifier in its own wording is what decided it.**
The item asks for a gate on a literal duration/easing *"where a `--bo-motion-`
prefixed token exists"*. That clause had never been measured on its own, and it
is the whole answer: the token scale is `100/150/300ms` plus one easing, and the
three literals in the tree are `600ms` (scan), `1.8s` and `linear` (skeleton) —
**not one at a token's value**. Base rate **0 of 23**, which is 94.11's no-op
gate exactly, and 200.7's own Accept says to say so rather than ship.

**The zero is red-proved by injection in both directions**, and the probe exits
non-zero if the replacement changed nothing — so a green red-proof could not be
misread as a clean tree. Injecting `150ms` moved it 0 → 1 against
`--bo-motion-duration-base`; injecting `cubic-bezier(0.4, 0, 0.2, 1)` moved it
0 → 1 against `--bo-motion-easing-standard`.

**The broadened predicate was measured too, and refused separately.** Its entire
red set is three deliberate decisions, and both declarations are already
adjudicated by `check:motion` route (b) — verified at `scan.css:63` and
`skeleton.css:81` and against the gate's own pass line, not read off 201.4.

**`201.4` closed by the second outcome its own Accept allows.** Its conclusion
re-derives exactly (same two declarations, at its commit and at HEAD). **Its
denominator does not** — `23 = 5 none + 16 token + 2 literal` reproduces under no
scoping constructed for it; at its own commit the honest figure is
`26 = 6 + 18 + 2`. The `23` that does appear is at HEAD under a different scope,
so that agreement is a coincidence and is named as one. **No item filed** — the
conclusion is sound; the correction is that a declaration count means nothing
without the scope beside it.

**The probe is deliberately NOT committed** — shipping the script would be
shipping the gate this item refuses.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here —
**zero lines changed under `packages/` or `apps/docs/src/`**; the whole diff is
markdown. Green in this container: core build, core `npm run test` 151/151,
`lint:css`, `docs:build` (runs `check:repo`), `check:motion`, `check:claims` 158
live + 3 NOT VERIFIED (ENVIRONMENT.md §6b — the container's pointer capability,
not a regression), `test:axe` 127 pages × 2 widths zero violations,
`check:layout` 127 pages, `check:scroll` 910 containers, `check:formatting`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:slice-refs` 421 citations, `check:rf-floor`,
`create-ui` check, `suite` audit 28 screens. `check:po-app` NOT run — known RED
here per 208.3.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — re-run it rather than trusting this
snapshot:

```
python3 scripts/loops/dispatch_status.py
```

This wake's row is a `Continue` row, so it **advances rule 2 to `1 / 4`** and
credits rule 3 with `1 / 3 [200]`. Neither fires next wake, so the next wake
should again fall through to **rule 4**.

**When rule 4 is reached**, five open checkboxes:

| item | what | notes |
|---|---|---|
| `208.3` | `check:po-app` red in cloud, green on CI; known deterministic across two cloud containers | **oldest non-blocked, but wants a LOCAL wake** — its Accept asks for a third environment, and this container is a second instance of the same class |
| `209.2` | `earliestChrome()` misses the prefix filter its sibling applies | **the oldest CLOUD-takeable item — rule 4 would pick this on a cloud wake**; needs the built CSS and the gate's pass line, no rendered image |

Per `LOOPS.md` rule 4, name which kind of blocked: `208.3` is
**browser-blocked** only in the narrow sense of needing a *different
environment*, not a rendered image — a local wake takes it. `209.2` needs
neither.

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware).

## Direction

Nothing blocked on the owner that a wake could advance; the three owner-blocked
items above are the standing set and are unchanged by this wake.

One judgement for an owner's eye, and it is the third consecutive hand-off to
raise the same thing with a new data point. 209.1 found a wake quoting a figure
about an artefact it had since rewritten. This wake found the sibling case:
**201.4's conclusion was red-proved and correct, and the breakdown printed beside
it went out on that credibility and does not reproduce.** That is 192.1's rule
("the defect lands in what shipped BESIDE the number") firing for the second time
in three wakes. The cheap fix is a writing habit, not a gate — *state the scope
next to any count, and re-read the committed blob before quoting a figure about
it* — and if a rule lands in `CLAUDE.md`, those two belong together. **Refused as
a gate here**: the property is "the count is meaningful under the scope claimed",
which needs the intent to check.
