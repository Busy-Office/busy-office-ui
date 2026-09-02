# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` fired on this wake's
> recording**, naming `244.4`, `245.1` and `246.1` — correctly, against the
> *previous* hand-off. This file has been rewritten since. Run both against the
> file as it now stands rather than trusting that.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `b1370408` and the bookkeeping commit carrying this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ Rule 4 fires next wake, and ONE item is dispatchable

```
Standardize   2 / 4 Continue rounds   since 2026-09-02 16:54   ok
Objective     2 / 3 slices            since 2026-09-02 17:53   ok  [244, 245]
Optimize      0 wake-date(s) newer    since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

- **Rules 1, 2, 3 are all clear**, so **rule 4 dispatches Continue, build mode**.
  The only NOT-BLOCKED item is `247.1`.
- **Objective is at 2 / 3 and will cross next wake** if a Continue or Standardize
  row closes a slice — worth knowing one wake ahead. The counter names `[244,
  245]`; Slice 246 and 247 are wake write-ups whose own findings closed in the
  same breath, which is why they are not counted. Do not "fix" it to 4.
- **Rule 5 is `ok`, not STALE, and was genuinely evaluable**: `axe-violations`
  reads zero across consecutive runs and the one live absolute budget
  (`RF_BUDGET_KB = 40`) passed inside `npm run build -w @busy-office/ui`. **Do
  not read `bundle-gz-kb`** — it and eleven other names are 13+ days stale and
  its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## ⚠ The archive sweep is the strongest standing signal — and 247.1 CONSTRAINS it

`roadmap_scope.py` reads closed-history share **1,840 / 3,458 = 53.2%**, up from
50.9% at the last hand-off. **The live roadmap is more than half closed history,
and this is the second consecutive wake it has been so.** LOOPS rule 4 says
outright: if the rule is walking thousands of lines, triage the sweep and run it
— Slices 165 and 177 are the precedent for doing that from inside a dispatch.

**This wake did NOT run it, and the reason is recorded in Slice 247 rather than
left implied**: 236.2's dependency report flagged Slice **244** as named by
`245.1`, which was the item this wake was dispatched to build and which had to
**amend 244.3's text**. Moving 244 first would have archived the lines the
dispatch existed to correct.

**The constraint did not go away when 245.1 closed — it moved.** `247.1` now
names **four** targets:

```
⚠ 4 target(s) NAMED by a still-open item — read each before moving it (236.2):
  Slice 237, 238, 244, 245  — all by the open item at ROADMAP.md:351 (Slice 247)
```

`247.1`'s Accept says outright that **amending 238.1's two `STATUS.md:43` sites
is permitted and expected**, so Slice 238 is exactly the case 236.2 was written
for: *do not move it until 247.1 is closed.* The other six eligible targets —
**246, 243, 242, 241, 240, 239** — carry no flag and are safe to move. Read the
flag from the tool before moving anything; do not re-derive this list.

## What landed this wake

**Continue, build mode, dispatched by rule 4** on the oldest still-open item that
is not owner-blocked, `245.1`. One commit. Slice write-up in ROADMAP 247.

- **Both sites in 244.3 corrected**, each now carrying the figure, the revision
  it was read at, the command that prints it, and the noun it counts. The item's
  premise reproduced exactly: **5** at `71a61679`, **7** at `1590bc2b`,
  `b0b70f96` and `c31799a3`; the two folded are `report_reopen_conditions.py` and
  `roadmap_scope.py`, so *"other than the two folded"* is **five**.
- **The published six is reachable at no revision** — a working-tree reading
  taken between the two foldings. **The eight counted a different noun**: ten
  `.py` in `scripts/loops` besides `_common.py`, minus the two folded; three of
  those eight (`generate_roundtable_index.py`, `polish_requeue.py`,
  `report_loop_prose.py`) do not import `_common` at all.
- **The fourth Accept bullet was TESTED, not waved past.** It invited a third
  reading that rescues one of the numbers. Three widenings — whole repo, any
  import syntax, any mention at all — every one still reads 5 before / 7 after,
  so the answer is negative and is recorded as such.
- **The log row and its `STATUS.md` mirror are left unedited**, per
  `record_iteration.py`'s standing rule, with the reason at the durable site.
  238.1's disposition for the same class, applied unchanged.

**Filed as `247.1`, and it came out of the bullet that asked for the least.**
Going to READ the mirror before asserting anything about it — which this repo's
rule requires — showed `STATUS.md:45` holding an unrelated `Meta · refusal` row;
244.3's is at `:38`, and 238.1's cited row has **left the file entirely**
(`grep -c '237.2' STATUS.md` → 0, because `STATUS.md` renders a rolling ten).
245.1's own two `ROADMAP.md` citations had moved **237 lines in one wake**.

All 17 `file:line` citations in `ROADMAP.md` were then re-read AT the line:
**8 of 8 resolve into source files**, **3 of 8 into markdown**, and all five
failures target a file that is rewritten or regenerated. `check-sticky-layers.mjs:43`
names a reverted injection point and is excluded from the denominator rather
than scored as a failure. **A blanket gate is refused in advance on base rate** —
45 sites corpus-wide, ~39 of them in `ROADMAP-archive.md` and dated `grill-*.md`
reports where the citation was true when written; the live subset is **6**.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `lint:css`, `docs:build`,
`check:claims`, `check:formatting`, `check:scroll` (**912 containers / 118 pages
× 2**), `check:layout` (**127 pages**), `check:forced-colors`, `test:axe`
(**127 × 2, zero violations**), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**19 behaviours**),
`check -w @busy-office/create-ui`, and `suite` (**28 screens × 2 widths**).

`check:slice-refs` reads **705 citations / 229 slice numbers**, up from 704 / 228
— the `+1` is Slice 247's own heading, which reconciles. `docs:build` was re-run
after the final two edits and the 705 / 229 is that run's output, not the first
one's.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `c31799a3` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty), and `origin/main` arrived as a
**forced update** (`+ 17b3ba6...c31799a`) with the local `main` ref stale at
`17b3ba6` — **the same stale sha as the last nine wakes**. `git checkout -B main
origin/main` fixed it before any commit existed. Trap 2's `--unshallow` ran clean
in one attempt (run in background to survive the 300s tool timeout that creates
`.git/shallow.lock`), `is-shallow-repository` → `false`, **1,810** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage.

**The open set is 4 items across 3 slices, and ONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `247.1` line-number citations in the live files | **NOT BLOCKED** — markdown + possibly one exact gate; rule 4 takes this next |
| AT runtime evidence (Slice 15) | **owner-hardware-blocked** — needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**After 247.1 lands, rule 4 has nothing left that is not owner-blocked**, and the
loop falls to rule 6 (Polish) — the same one-wake-ahead warning the last hand-off
gave, and it did not come true only because this wake filed 247.1. **Two
consecutive wakes have now kept rule 4 alive on a finding produced by the item
being built.** That is worth naming as a pattern rather than a coincidence: it
means the backlog is being sustained by grill/build by-products, not by new
direction, and it is the thing the Direction block exists to surface.

**What is owed to the owner:** unchanged, and now **fifteen wakes old**. Slice
112's pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS, no page markup and no shipped artefact** — the diff is `ROADMAP.md` plus the
bookkeeping files. **Nothing was looked at visually**, and nothing in the diff
renders. `check:layout` (127 pages) and `test:axe` (127 × 2, zero violations)
executed in this container regardless and are green.
