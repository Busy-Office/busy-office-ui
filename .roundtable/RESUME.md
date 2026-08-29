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

Last updated 2026-08-29 (**cloud** wake — rule 3 → Objective, grill of Slices
205 and 208: `209.1` landed, `209.2` filed OPEN). Working tree clean at
hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 7 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `205`, `208.1`, `208.2` and `209.1` as
closed ids named here — **historical references** (this wake's subject matter),
not claims that they are open. `209.2` and `208.3` genuinely are open.

**No collision on this wake.** `origin/main` was at `6105054` at Step 0 and
still at `6105054` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again.** Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...6105054`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. Also
unshallowed — this wake's findings are history measurements.

## What landed this wake

**Scope narrowed first.** Rule 3's window was `[200, 205, 208]`;
`grill-objective-199-202-2026-08-29.md` already covers 200 in full, so the
honest scope was **205 and 208** — the same correction the 204/206 grill made.
Report: `.roundtable/grill-objective-205-208-2026-08-29.md`.

**Nine of 208's claims reproduce exactly**, re-derived rather than read off the
file: lane 1 (`0 dead of 1,433`), lane 2 (`8 groups / 242 rules / 230 distinct
bodies`, same eight shapes), lane 3 (`118 pages, median 748, 9 + 12`), the
lane-coverage table under an independent per-section parser (4 of 6 come back
NO, so it discriminates), the four prior sweeps' drop figures, and both
substantive halves of the lossless-move proof. 205's base rate reproduces too:
the same 6 at-rules in the built `rf-essentials.css`, exactly one above 108.

**`209.1` — 208's sweep numbers describe a state that was never committed.**
Reported `6,424 → 2,184` and *"gained exactly `{pointer: 32}`"*; the committed
blob at `83192cd1` is **2,301** and gained **127** — the 32 pointers plus 95
lines of Slice 208's own write-up, appended by the same commit
(`2301 - 117 = 2184`, the 117 being that section). `4,272` is the same
intermediate arithmetic; committed, it is `4,250`. The lossless conclusion
holds; the assertion that exists to catch an edit riding along with the move
does not reproduce. 208's text and proof table now carry the committed numbers.

**`209.2` filed OPEN — `check-rf-floor.mjs` publishes a PREFIXED version.**
`earliestChrome()` filters `flags` but not `prefix`, so the pass line reads
`@keyframes 1` (the `-webkit-` entry) where the unprefixed at-rule is **43**.
`derive-floor.mjs`, on the same BCD data across 6 shared feature paths, does
filter. It understates the floor — the false-safe direction — and today's blast
radius is **zero, measured**. `LOOPS.md`'s "divergence here is LOUD" section now
says it covers the path column and not the helper beside it.

**A third finding was wrong and is recorded in that order.** `check:ci-ignores`
is in `ci.yml` and absent from `ENVIRONMENT.md`'s list, which reads exactly like
the `check:formatting` failure 208.2 closed. It is the opposite: it is a
sub-check of `check:repo`, which `docs:build` runs. Coverage is complete. The
cost is that the file's own re-derivation instruction produces that false
positive — entry points vs steps — and `ENVIRONMENT.md` now says so beside the
list.

**208.3 gained a second-container reading** — byte-identical payload, fourth
run, different clone, later HEAD. Deterministic in this environment class, not
contended. Still OPEN; a second instance of the same class is not the third
environment its Accept asks for.

**`ENVIRONMENT.md` §6b added**: `check:claims` reporting `3 NOT VERIFIED` is the
container's pointer capability, not a regression — measured both ways within two
days (154 live / 0 unverified at Chrome 151; **158 live / 3 unverified** here).

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here —
**zero lines changed under `packages/` or `apps/docs/src/`**; the whole diff is
markdown. Green in this container: core build, core `npm run test`, `lint:css`,
`docs:build`, `check:repo` 9/9, `check:claims` 158 live, `test:axe` 127 pages ×
2 widths zero violations, `check:layout` 127 pages, `check:formatting`,
`check:slice-refs`, `check:rf-floor` incl. `--self-test`. `check:po-app` RED,
per 208.3.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — re-run it rather than trusting this
snapshot:

```
python3 scripts/loops/dispatch_status.py
```

This wake's row is an `Objective` row, which resets rule 3's counter and does
**not** advance rule 2 (Objective rows are not Continue rounds). So the next
wake should fall through to **rule 4**.

**When rule 4 is reached**, seven open checkboxes:

| item | what | notes |
|---|---|---|
| `200.7` | lint check for hand-written durations outside the token scale | **oldest non-blocked — rule 4 would pick this**; read 201.4 first |
| `201.4` | 200.7's proposed gate mostly duplicates `check:motion` already shipped | either outcome closes it |
| `208.3` | `check:po-app` red in cloud, green on CI; now known deterministic across two cloud containers | **wants a LOCAL wake** — its Accept asks for a third environment |
| `209.2` | `earliestChrome()` misses the prefix filter its sibling applies | **cloud-takeable**; needs the built CSS and the gate's pass line, no rendered image |

200.7, 201.4 and 209.2 are all cloud-takeable; none needs a rendered image.
208.3 is blocked on an environment this container is not.

Owner-blocked, unchanged: **112.3** (pilot briefs), **112.4** (blocked on
112.3), **AT runtime evidence** (owner hardware).

## Direction

Nothing blocked on the owner that a wake could advance; the three owner-blocked
items above are the standing set and are unchanged by this wake.

One judgement worth an owner's eye, not a blocker, and it is the same one the
last hand-off raised with a second data point behind it now. 209.1's finding is
that a wake measured its own artefact **before** appending its write-up to it —
and the write-up was 117 lines of a 2,301-line file, for a slice whose actual
change was a file move. The previous hand-off asked whether the owner would
rather slices were terser; this wake found the length is not only a storage
question — the longer the write-up, the more it perturbs what the same wake is
measuring. If a writing rule lands in `CLAUDE.md`, "re-read the committed blob
before quoting a figure about it" belongs next to it.
