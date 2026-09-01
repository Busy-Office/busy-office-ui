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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 5 at hand-off, across 4 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # NEW — see below
```

## ⚠ READ THIS FIRST: rule 2 is DISCHARGED, rule 3 is OVERDUE

```
Standardize   0 / 4 Continue rounds  since 2026-09-01 05:06   ok
Objective     4 / 3 slices           since 2026-08-31 14:58   OVERDUE  [232, 233, 234, 235]
Optimize      0 wake-date(s) newer   since 2026-09-01 05:07   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. This wake spent rule 2's counter,
so **the next wake dispatches Objective** — a grill of 232, 233, 234, 235 — and
rule 4 is not reached. Re-run `dispatch_status.py` rather than trusting this
snapshot: several dispatchers land work hourly and it moves fast.

**Rule 5 is `ok`, not STALE, and the pair is real**: `test:axe` ran green here
(127 pages × 2 widths, zero violations), so `axe-violations = 0` was recorded
from a gate that actually executed, pairing with the prior `0`. **No regression:
0 → 0.** The way to keep rule 5 alive is to record a name **already sampled**; a
name sampled once can never satisfy "two consecutive runs", which is 184.1's
defect exactly. **Do not read `bundle-gz-kb`** — it and eleven other names are
13+ days stale, and its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5
trigger. Not evaluable.

## THE ARCHIVE SWEEP IS DONE, AND ITS INSTRUMENT NOW HAS A FILE

**Stop copying the heredoc out of `ROADMAP-archive.md` Slice 177.** It is a
committed script:

```
python3 scripts/loops/roadmap_scope.py                # the live reading
python3 scripts/loops/roadmap_scope.py --self-test    # cases A-D
python3 scripts/loops/roadmap_scope.py --rev <sha>    # any past tree
```

That was 235.1, and it is lane 4's finding rather than a convenience: the
instrument had been **run by five wakes and never had a file**, its one copy
inside an archived slice, pointed at three times by wakes writing *"the command
is in ROADMAP-archive.md, Slice 177, verbatim"* — into the file `LOOPS.md` rule
4 says a dispatch decision never comes from. The trigger the last four hand-offs
deferred (*"if a wake needs this share a third time, commit the script"*) fired.

**Post-sweep state, read from `HEAD` not the working tree:**

```
ROADMAP.md          2,324 lines      (was 3,569 at move time)
ROADMAP-archive.md 31,001 lines
closed-history share  15.8%          (was 39.8%)
targets              [235] only      — this wake's own slice, next sweep's business
```

**Do not sweep Slice 235 on the next wake.** A slice becomes eligible the moment
it closes; every prior sweep has left the just-closed slice alone, and 235 is
what the armed Objective grill is about to read.

## What landed this wake

Standardize, dispatched by rule 2 (`6 / 4 OVERDUE`). **Three commits, Slice 235.**

- **235.1** (`54396d36`) — `scripts/loops/roadmap_scope.py`, `@heuristic` with
  `--self-test` cases A-D. **Reconciled against an independent record before
  quoting**: `--rev d701e619^` reproduces 228.1's `OPEN [15, 112]`,
  `15 closed slices / 2366 lines`, `62.4%` **exactly**; `--rev e29c7c18^`
  reproduces 214.1's 7 targets and 1,568 lines **exactly**. Where it differs
  from 214.1 (`OPEN`, and 49.0% vs 50.8%) it is the tree, not the parse —
  1568/3085 = 50.8%, 1568/3197 = 49.0%.
- **235.2** (`574a8634`) — **eighth archive sweep**, 5 slices (233, 231, 230,
  229, 228), 3,569 → 2,165 at move time. Lossless against the git blob by an
  independently written parser; line accounting reconciles both directions;
  citation-neutral at 464/249/2/217 either side.
- **235.3** (`dc861a25`) — three self-referential pointer stubs removed from the
  archive, and `check:slice-refs` extended to assert uniqueness there too.

## TWO defects found by verification, neither of them looked for

Both are the same shape and worth carrying: **the check that was written to
prove a change was safe is what found the pre-existing bug.**

1. **`roadmap_scope.py`'s reconciliation REFUSED on the real file** the first
   time it ran — 19 raw `[x]` markers against 17 attributed. The two are
   `1. [x] OWNER CALL — 0.2.0 release` and `2. [x] OWNER CALL — (a) adoption/DX`
   under `## STATE`, a non-slice H2. **Both are closed, so nothing is lost
   today.** The shape is what matters: an OPEN item there is invisible to a
   slice-keyed pass while rule 4 asks for *"the OLDEST still-open item"* — the
   exact defect CLAUDE.md's storage doctrine records `STATUS.md` shipping for
   weeks. They now print on every run, flagged `⚠ OPEN and unattributed`.
2. **235.2's verification parser crashed** — `duplicate heading: ## Slice 24` —
   and that was three self-referential stubs in `ROADMAP-archive.md` (17, 23,
   24), each a pointer into the file it was already in. `check:slice-refs`
   passed throughout, because its uniqueness loop read only `ROADMAP.md`. Its
   header's sufficiency argument **holds for citations and not for uniqueness**,
   and that is now written into it.

**`check:slice-refs` reports 677, not 464, and that is by design.** The figure
is assertions, not citations: `217` live uniqueness + `212` archive uniqueness
(new) + `248` citation checks. Cites moved 249 → 250 because the gate's own new
header names `235.3`. `seen.size` is unchanged at **217** — every archive slice
number is also a live one. **Do not read the jump as a regression.**

## Gates

**All 17 cloud entry points green at `54396d36`**, exit 0 each: core `build`,
core `test` (152 in 27 files), `lint:css`, `docs:build`, `check:claims`,
`check:formatting`, `check:scroll`, `check:layout` (127 pages),
`check:forced-colors`, `test:axe` (127 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:repo`, `check:po-app`, `create-ui check`, `suite`.

**Re-run at `574a8634` and again at `dc861a25`**, the seven the wake prompt
requires — core `build`, core `test`, `docs:build`, `check:claims`, `test:axe`,
`check:layout`, `check:repo` — all exit 0; the delta between those trees is
markdown no page renders plus one build-time gate.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — `ENVIRONMENT.md`
§6b, `(pointer: fine) = false` in this container. **Not a regression; do not
"restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `4910943f` across **four** `git fetch origin main` calls
— Step 0, and once immediately before each of the three commits. Recorded
because the previous hand-off lost the same dispatch four times in one wake and
concluded the fetch earns its keep; a wake with no collisions is the other data
point, and the rule cost nothing.

**ENVIRONMENT trap 1 bit for real at Step 0**: the container started
**DETACHED**, with local `main` stale at `17b3ba67` while `HEAD` was
`4910943f`. `git branch --show-current` returned empty — the check that file
names as the actual answer — and `git checkout -B main origin/main` fixed it
before any commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false` afterwards, 1,772
commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 5 items across 4 slices, and two are dispatchable:**

| item | kind of blocked |
|---|---|
| `234.1` introducing commit is 42.1, not 42.3 | **NOT blocked** |
| `232.3` 230.1's refusal misapplies 94.11 | **NOT blocked** |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

**The oldest open item is Slice 15's AT runtime evidence, NOT `112.3`** — three
hand-offs called `112.3` "oldest open" before the last one corrected it. Both
are blocked, so no dispatch has been affected. Rule 4 is not reached next wake
regardless: rule 3 is OVERDUE and sits above it.

**Nothing is owed to the owner from this wake.** Everything it touched was the
loop's own bookkeeping — an instrument, a sweep, and a gate — and all three
landed.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed one
Python script, one build-time gate, and markdown. Nothing in it rests on a
rendered image, and no docs page's markup or CSS moved.
