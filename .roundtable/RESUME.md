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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; one
commit, `a5f5007a`, pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 7 at hand-off, across 5 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: every counter is DISCHARGED — the next wake reaches rule 4

```
Standardize   0 / 4 Continue rounds  since 2026-09-01 05:06   ok
Objective     0 / 3 slices           since 2026-09-01 06:45   ok
Optimize      0 wake-date(s) newer   since 2026-09-01 06:45   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. This wake spent rule 3's
counter, so rules 1-3 are all clear and **the next wake falls through to rule
4** — the oldest still-open item. Re-run `dispatch_status.py` rather than
trusting this snapshot; several dispatchers land work hourly.

**Rule 5 is `ok`, not STALE.** `test:axe` ran green here (127 pages × 2 widths,
zero violations), so `axe-violations = 0` was recorded from a gate that actually
executed, pairing with the prior `0`. **No regression: 0 → 0.** Keep rule 5
alive by recording a name **already sampled**; a name sampled once can never
satisfy "two consecutive runs" (184.1's defect). **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## What landed this wake

**Objective grill, dispatched by rule 3 (`4 / 3 OVERDUE [232, 233, 234, 235]`).
One commit, Slice 236.** Full report:
`.roundtable/grill-objective-232-233-234-235-2026-09-01.md`.

**23 load-bearing figures re-derived independently; 22 reproduce exactly.**
Not re-quoted from the slices that published them — re-run on an unshallowed
clone, and 235.2's move re-verified with a **separately written span parser
against the git blobs**, never against the script that performed it. Nothing in
232, 233, 234 or 235 is reopened; every decision stands.

**Two things that look wrong and are not, checked rather than assumed:**

- **235.2's `3,569 → 2,165` against a commit holding 2,269.** This is the exact
  silhouette of the defect ENVIRONMENT.md's "read a figure from THAT COMMIT"
  bullet exists for, and it is **not** that defect: the item declares its figure
  is post-move, pre-write-up. `3,569 − 1,419 + 15 = 2,165`; `2,165 + 104 =
  2,269`, and the 104 lands in the one live section the independent parser
  reports as changed — Slice 235's own. **216 untouched, 1 changed, accounted
  for.** The tell is never arithmetic, so the section walk is what settled it.
- **`check:slice-refs` reads `678 / 218`, not `677 / 217`.** Slice 236 adds one
  live heading: `218 live + 212 archive + 248 citations = 678`. **Do not read
  the jump as a regression** — same shape as the `464 → 677` note last wake.

## The two findings, both filed OPEN as Slice 236

Neither is browser-blocked or owner-blocked. Both are dispatchable by any wake.

- **`236.1`** — 234.1's central attribution reproduces **exactly** (at
  `84eb14ca`, five files `branch=0`, `check-notes.mjs` `branch=1`; 42.1's own
  diff adds the branch). What does not reproduce is its corroborating sentence:
  *"widening to **any** `--self-test` mention confirms the other five carried
  none"*. The five read **`any=1`, not 0**, and that 1 is the OWES sentence the
  item is adjudicating. True only under an exclusion the published command does
  not carry. **Filed as a recurrence, not a typo** — 232.1 recorded the
  identical missing-exclusion shape *about itself* two slices earlier.
- **`236.2`** — 235.2's sweep archived Slice 229 while `234.1` is open and names
  229.3's `RECURRENCE HISTORY` as text to **amend**. That text is now only at
  `ROADMAP-archive.md:30520`. All five of 235.2's Accept criteria are properties
  of the *move*; none can see a dependency, and `check:slice-refs` asks whether
  a citation **resolves** — the wrong question when the criterion says amend.
  **A gate was refused on 94.11's test** and the refusal is recorded as its own
  log row: the discriminating predicate is semantic, and the checkable shape
  fires on 232.3 too, where the behaviour is correct.

  **236.2's Accept (d) makes "the premise is false" a satisfying close**: if
  amending an archived section is simply fine — the archive is reviewed,
  diffed markdown, and 235.3 already deleted from it — record that as the
  standing answer. What is wrong is that **no document says either way**.

## Gates

**All seven cloud entry points the wake prompt requires: green, exit 0 each**,
against the committed tree — core `build`, core `test` (**152** in 27 files),
`docs:build`, `check:claims`, `check:layout` (**127** pages), `test:axe`
(**127 × 2**, zero violations), `check:repo`. Each written to its own log and
tailed only on failure, per 233.2's lesson.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**
This also confirms 233.2's stated `161 → 162`, which is why 233 has no finding
against it.

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `7bce44ed` across **three** `git fetch origin main`
calls — Step 0, mid-wake, and once immediately before the commit.

**ENVIRONMENT trap 1 bit for real at Step 0**: the container started
**DETACHED**, local `main` stale at `17b3ba67` while `HEAD` was `7bce44ed`, and
`origin/main` arrived as a **forced update** (`+ 17b3ba6...7bce44e`).
`git branch --show-current` returned empty — the check that file names as the
actual answer — and `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false` afterwards, **1,776**
commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 7 items across 5 slices, and FOUR are dispatchable:**

| item | kind of blocked |
|---|---|
| `236.1` 234.1's widened-predicate corroboration | **NOT blocked** |
| `236.2` an archived Accept target | **NOT blocked** |
| `234.1` introducing commit is 42.1, not 42.3 | **NOT blocked** |
| `232.3` 230.1's refusal misapplies 94.11 | **NOT blocked** |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

**The oldest open item is Slice 15's AT runtime evidence**, then 112.3/112.4;
all three are blocked. Rule 4's oldest **dispatchable** item next wake is
**`232.3`** — build the parse-without-assert detector. Its premise was
re-derived and **confirmed twice** by this grill (pre-fix tree flags exactly 1,
`HEAD` flags 0, checkout confirmed to have taken effect), so it is ready to
build rather than re-measure.

**Do not sweep Slice 236 on the next wake.** `roadmap_scope.py` reads
`targets: [235]` — 235 closed and is eligible; 236 is this wake's own slice and
is open. The live file is **2,565 lines, closed-history share 14.3%**, so the
sweep is not due.

**Nothing is owed to the owner from this wake.** Everything it touched was the
loop's own bookkeeping — a grill and two filed findings — and it landed.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
code** — the diff is `ROADMAP.md` and one `.roundtable/` report, and the docs
site renders neither. Nothing in it rests on a rendered image. The one
browser-driven reading quoted (`check:claims` 162/3) came from the gate
executing in this container, not from an image.
