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
commits — `7e861867` (the slice) and the bookkeeping commit carrying this file
— pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off, across 2 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope + 236.2's lane
```

## ⚠ READ THIS FIRST: rule 2 is spent, rule 3 is OVERDUE — next wake is Objective

```
Standardize   0 / 4 Continue rounds since 2026-09-01 12:05   ok
Objective     4 / 3 slices          since 2026-09-01 06:45   OVERDUE  [232, 234, 236, 237]
Optimize      0 wake-date(s) newer   since 2026-09-01 12:05   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. **This wake spent rule 2**, which
the previous hand-off had predicted; it now reads `0 / 4`. Rule 3 moved 3 → 4 on
this wake's own Slice 237, which is 161.4's decision working (Standardize closes
a slice), not a surprise. **Rule 1 has nothing, rule 2 is spent, so the next wake
dispatches Objective over Slices 232, 234, 236, 237.** Re-run
`dispatch_status.py` rather than trusting this snapshot.

**Rule 5 is `ok`, not STALE.** `test:axe` ran green here (127 pages × 2 widths,
zero violations), so `axe-violations = 0` was recorded from a gate that actually
executed, pairing with the prior `0`. **No regression: 0 → 0.** Keep rule 5
alive by recording a name **already sampled**; a name sampled once can never
satisfy "two consecutive runs" (184.1's defect). **Do not read `bundle-gz-kb`**
— it and eleven other names are 13+ days stale and its `10.8 → 11.6 → 11.7`
*looks* exactly like a rule-5 trigger. Not evaluable.

## The archive sweep is DISCHARGED — do not re-raise it next wake

Lane 4's `ratchet` block now reads **`ROADMAP.md  0 up   last cut 7e861867`**,
and `roadmap_scope.py` reads closed-history share **149 / 1,659 = 9.0%** with
targets `[237]` — this wake's own slice, which is a record being written, not a
sweep candidate. The signal that carried the last two wakes is spent.

## What landed this wake

**Standardize, sweep mode, dispatched by rule 2 (`4 / 4 OVERDUE`). One commit;
Slice 237 has two items, both closed. All four lanes ran — `n of 4` is 4 of 4.**

- **Lanes 1-3 clean an eleventh time, no delta.** `scan:dead-style` 0 dead of
  1,433 live inline declarations. `report:css-repeats` 74 files · 242 rules ·
  230 distinct bodies · 8 repeats, and the repeat set is unchanged **member for
  member** against `LOOPS.md`'s table; the x4 joined-control group is still two
  components, so its reopen trigger is unmet. `report:prose` 118 pages, median
  748 — the 14 flagged pages resolve entirely against 158.1's twelve, 161.1's
  three and 178.3's `/concepts/scale/`, checked by **set membership**, since
  228.1 already recorded that the cite-count instrument is a dead one.
- **237.1 — the ninth archive sweep.** Slices 236, 235, 234, 232 moved verbatim
  (381 / 368 / 161 / 500 lines); `ROADMAP.md` 2,907 → 1,509 at move time, 1,659
  committed. **The verification reads the SOURCE, not the mover's memory**: a
  second, independently written parser re-derives each block from
  `git show HEAD:ROADMAP.md` and asserts presence in the archive and absence
  from the live file. Red-proved by injection — that slice's archive count went
  1 → **0**, the verifier failed 1 of 4 and exited 1.
- **`check:slice-refs` 680 → 684 → 685, and the +4 is NOT new citations.**
  Reconciled against a `git worktree` at `HEAD`: distinct archive headings
  212 → 216, live headings flat at 218, so the **uniqueness** arm runs 430 → 434
  checks while the **citation** arm holds at 250 (252 cited − 2 known-dangling).
  A swept slice number heads a section in *both* files. The 685th is Slice 237's
  own heading. Worth knowing before the next sweep quotes a moved count.
- **237.2 — the archive's own header instructed the opposite of the rule
  `LOOPS.md` gained the day before.** It read *"Nothing here is edited"* against
  236.2's *"amending the archive is allowed and expected"*. The premise was
  re-run, not quoted: of ten commits touching the archive, eight are sweeps and
  **two are edits with no move** (`d3d76a28`/199.1, `dc861a25`/235.3). The cost
  is specific — 177.1 named Slices 17, 23, 24 as self-referential stubs on
  2026-08-28 and left them *"on the archive's own authority"* quoting that
  header; `dc861a25` deleted exactly those three four days and four archive
  commits later. **Refused:** restating rule 4's paragraph there.

**One instrument artefact, recorded so the next wake does not re-find it.**
Extracting flagged page paths from `report:prose` with a `/[a-z-]+/[a-z-]+/`
regex returns **fifteen**, and the fifteenth is `/script/style/` — matched out
of the report's own sentence *"with pre/script/style/svg/template removed"*. A
page list containing a substring of the sentence that explains how pages are
measured. Caught by reading the list, not by a check.

## Gates

**All seventeen entry points `ENVIRONMENT.md` derives from `ci.yml`: green,
exit 0 each**, against the committed tree — core `build`, core `test`,
`lint:css`, `docs:build`, `check:claims`, `check:formatting`, `check:scroll`,
`check:layout` (**127 pages**), `check:forced-colors`, `test:axe` (**127 × 2**,
zero violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (19 behaviours),
`check -w @busy-office/create-ui`, and `suite` (28 screens × 2 widths).
`check:slice-refs` passed at **685** citations. Each written to its own log and
tailed only on failure, per 233.2's lesson.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

**`scan:dead-style` needs `CHROME_PATH` exported in the same command**, like
every other browser-driven gate here. Without it, it exits 1 listing six paths
it tried, which reads like a failure and is a missing export. ENVIRONMENT §1c
says this; the lane-1 instruction in `LOOPS.md` does not repeat it.

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `c775bcb5` across both `git fetch origin main` calls —
Step 0 and once immediately before the commit.

**ENVIRONMENT trap 1 bit at Step 0 again**: the container started **DETACHED**,
`git branch --show-current` returned empty — the check that file names as the
actual answer — and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...c775bcb`). `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false` afterwards, **1,782**
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

Say the *kind* of blocked, per rule 4's own instruction: **none of these three
is browser-blocked**, so a local wake cannot take them either. **Two
owner-blocked, one hardware-blocked.** It does not gate the next wake, which
dispatches Objective at rule 3 before ever reaching rule 4.

**What is owed to the owner:** unchanged from the last hand-off, and now two
wakes old. The backlog holds nothing any wake can build. Slice 112's pilot has
been waiting on five briefs since 2026-08-22, and Slice 15's AT evidence on
owner hardware. Everything this wake touched was the loop's own bookkeeping —
the roadmap, its archive, and that archive's header.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is `ROADMAP.md` and `ROADMAP-archive.md`,
and the docs site renders neither — so nothing in it rests on a rendered image.
Every browser-driven reading quoted (`check:claims` 162/3, `check:layout` 127,
`test:axe` 127 × 2, `suite` 28 × 2, `scan:dead-style` 1,433) came from a gate
executing in this container.
