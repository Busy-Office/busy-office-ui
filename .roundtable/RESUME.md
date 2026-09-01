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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `ede706af` (the slice) and the bookkeeping commit carrying this file
— pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's new lane
```

## ⚠ READ THIS FIRST: TWO counters are OVERDUE, and rule 2 wins

```
Standardize   4 / 4 Continue rounds since 2026-09-01 05:06   OVERDUE
Objective     3 / 3 slices          since 2026-09-01 06:45   OVERDUE  [232, 234, 236]
Optimize      0 wake-date(s) newer   since 2026-09-01 10:48   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b — and this is the case that rule
exists for: **both counters flipped on this wake's own three rows.** This wake
spent rule 4; **the next wake does NOT fall through to it.** Rule 2 sits above
rule 3, so **the next wake dispatches Standardize**, and rule 3 is armed behind
it. Re-run `dispatch_status.py` rather than trusting this snapshot.

**Objective moved 1 → 3, naming `[232, 234, 236]`** — 234 and 236 are this
wake's own closures, which is rule 3 working, not a surprise.

**Rule 5 is `ok`, not STALE.** `test:axe` ran green here (127 pages × 2 widths,
zero violations), so `axe-violations = 0` was recorded from a gate that actually
executed, pairing with the prior `0`. **No regression: 0 → 0.** Keep rule 5
alive by recording a name **already sampled**; a name sampled once can never
satisfy "two consecutive runs" (184.1's defect). **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## ⚠ The archive sweep belongs to NEXT wake's Standardize, and it is now large

`roadmap_scope.py` reads **targets `[236, 235, 234, 232]`** and closed-history
share **1,410 / 2,907 = 48.5%**, up from 31.6% at the last hand-off — because
this wake closed two slices carrying long RESOLUTIONs. This was NOT skipped to
take 234.1: the sweep is Standardize lane 4's signal, and lane 4's counter armed
on this wake's own rows, so the loop's own ordering now puts it next.

**The new dependency lane says the sweep is safe to run**: it reads *"no target
slice is named by a still-open item"*, so nothing open depends on text those
four slices carry. That line is 236.2's, added this wake — read it, do not
re-derive it. Four slices, hand-checked one at a time per 177.1 and CLAUDE.md's
bulk-edit rule. **Before creating archive content, re-read CLAUDE.md's
case-insensitivity trap** — a "new" file that shows up as *modified* is a file
you just replaced.

## What landed this wake

**Continue, build mode, dispatched by rule 4 on `234.1` — the oldest still-open
DISPATCHABLE item. One commit; Slices 234 AND 236 are now fully closed.**

`236.1` and `236.2` are findings *about* 234.1's own text and about the sweep
that moved half its target, so all three closed together rather than being left
to re-derive each other. **Both premises were re-run before anything was
edited** — on an unshallowed clone (`is-shallow` → **false**, **1,780** commits)
— and both reproduce exactly: at `84eb14ca` five files read `sentence=1
branch=0` and `check-notes.mjs` reads `sentence=1 branch=1`.

- **234.1 (a)** — the two targets its Accept names were in *different states*.
  229.3's `RECURRENCE HISTORY` was **already amended**:
  `git log -S'CORRECTED 2026-08-31 by slice 234.1'` returns `258856b4` (the
  item's own filing commit, written while 229.3 was still live) and then
  `574a8634` (the sweep, which carried it across verbatim). Only **232.2's
  closing text** was this wake's to write, and it is now corrected in place,
  with the aggregate in its own paragraph per (b). **229.3's refusal is not
  reopened.**
- **236.1** — the widening sentence said the five read `0` under "any
  `--self-test` mention". They read **`any=1`**, and that `1` is line 15's
  `OWES a --self-test (roadmap 42.3)` — the sentence being adjudicated. The
  paragraph now prints `any` and `excl` side by side and names which column
  carries the claim.
- **236.2** — arm (d) **fired: the premise is false as stated.** Editing
  archived text was already established practice; only the documentation was
  missing. `git log --numstat -- ROADMAP-archive.md`: `d3d76a28` (199.1)
  appended a `RE-VERIFIED` block into an archived slice **with no move**, and
  `dc861a25` (235.3) deleted 12 lines. Every other commit on that file is a
  sweep. **The standing answer is in `LOOPS.md` beside rule 4, not here** —
  169.3's lesson, and this item's own sibling finding.

**The new instrument: `roadmap_scope.py` recognition 3.** For each still-open
item, the slice numbers it names, intersected with the target set. A **report,
not a gate** — 236.2 measured why: the checkable shape fires on healthy states
too. Red-proved by injection as `--self-test` **case E**, where the fixture
order and the two *different* citations are both load-bearing (an open item
first, a closed item after it citing another slice; otherwise a lane with no
clear-on-`[x]` passes). Reconciled against a throwaway independent parser
agreeing on all four (target, item) pairs. **Not true-of-everything:** the two
targets are cited **22** and **24** times in `ROADMAP.md` and the lane charges
**4**; 3 of 6 open items named a target and 3 named none. Both branches were
seen on real data in one wake — 4 named before the ticks, clean after them.

**`check:selftests` did NOT move — still 47 gates (16 heuristic, 31 exact).**
`roadmap_scope.py` lives in `scripts/loops/` and is outside that gate's scope,
so its `@heuristic` header and `--self-test` are held by the file's own
convention. Said plainly rather than quoted as a count that rose.

## Gates

**All seventeen entry points `ENVIRONMENT.md` derives from `ci.yml`: green,
exit 0 each**, against the committed tree — core `build`, core `test`,
`lint:css`, `docs:build`, `check:claims`, `check:formatting`, `check:scroll`,
`check:layout`, `check:forced-colors`, `test:axe` (**127 × 2**, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (19 behaviours),
`check -w @busy-office/create-ui`, and `suite` (28 screens × 2 widths).
`check:slice-refs` passed at **680** citations. Each written to its own log and
tailed only on failure, per 233.2's lesson.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `488bcbcf` across both `git fetch origin main` calls —
Step 0 and once immediately before the commit.

**ENVIRONMENT trap 1 bit for real at Step 0 again**: the container started
**DETACHED**, `git branch --show-current` returned empty — the check that file
names as the actual answer — and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...488bcbc`). `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false` afterwards, **1,780**
commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 3 items across 2 slices, and NONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

**Rule 4 would find nothing dispatchable next wake** — and it does not matter,
because rules 2 and 3 both fire above it. Say the *kind* of blocked, per rule
4's own instruction: none of these three is browser-blocked, so a local wake
cannot take them either. **Two owner-blocked, one hardware-blocked.**

**What is owed to the owner:** the backlog is now empty of anything any wake can
build. Slice 112's pilot has been waiting on five briefs since 2026-08-22, and
Slice 15's AT evidence on owner hardware. Everything this wake touched was the
loop's own machinery — one instrument, the roadmap, and the playbook.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is one Python script under `scripts/loops/`
plus `ROADMAP.md` and `LOOPS.md` prose, and the docs site renders none of them —
so nothing in it rests on a rendered image. Every browser-driven reading quoted
(`check:claims` 162/3, `check:layout` 127, `test:axe` 127 × 2, `suite` 28 × 2)
came from a gate executing in this container.
