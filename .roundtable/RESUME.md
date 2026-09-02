# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **Neither fired on this wake's recording.** Run them
> against the file as it now stands rather than trusting that.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `4fcf971b` and the bookkeeping commit carrying this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 5 at hand-off, across 4 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ Rule 4 fires next wake, and TWO items are dispatchable

```
Standardize   0 / 4 Continue rounds   since 2026-09-02 16:54   ok
Objective     0 / 3 slices            since 2026-09-02 17:53   ok
Optimize      0 wake-date(s) newer    since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

- **This wake discharged rule 3** — the Objective counter reset 4/3 → 0/3.
  Rules 1, 2, 3 are all clear, so **rule 4 dispatches Continue, build mode**,
  on the OLDEST still-open item it can take.
- **Rule 5 is `ok`, not STALE, and was genuinely evaluated**: `axe-violations`
  reads zero across three consecutive runs and the one live absolute budget
  (`RF_BUDGET_KB = 40`) passed inside `npm run build -w @busy-office/ui`. **Do
  not read `bundle-gz-kb`** — it and eleven other names are 13+ days stale and
  its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## The archive sweep signal is 41.7%, and ONE target is flagged

`roadmap_scope.py` reads closed-history share **1,304 / 3,125 = 41.7%** with
targets `[243, 242, 241, 240, 239, 238, 237]`, and its 236.2 dependency report
now fires: **Slice 238 is named by the open 245.1**.

**Read the flag, then move it anyway if you agree with this reading.** 245.1
cites 238.1 as the *precedent* for its own shape (a correct premise sized by a
wrong number) and as the precedent for leaving the log rows unedited. Its Accept
says nothing about amending Slice 238. The report is deliberately a report and
not a gate for exactly this case — a citation resolves fine from the archive.

The 43.4% → 41.7% move is **denominator-only and is this wake's own doing**:
Slice 245's ~119 open-side lines were added while the closed numerator stayed at
1,304. Read it from the tool, never by subtracting.

## What landed this wake

**Objective grill, dispatched by rule 3** after rules 1 and 2 were evaluated and
clear. One commit. Full report:
`.roundtable/grill-objective-238-241-243-244-2026-09-02.md`; slice write-up in
ROADMAP 245.

- **Scope was narrowed before grilling, per §6 step 0.** 238 is the previous
  grill and is armed only by **238.1**. The four `Polish · reconcile` rows in
  the window were dropped (161.4 excludes Polish), so **Slices 239, 240 and 242
  carry no verdict from this grill** — say so if a later wake reads the counter
  and assumes they were covered.
- **29 of 31 published claims reproduce**, each re-executed on an unshallowed
  clone (1,806 commits), and the 31 are enumerated in the report so the total is
  auditable.
- **Filed `245.1`:** ROADMAP 244.3 publishes **two** counts of one set — *"six
  other loop scripts"* and *"eight other `_common` consumers"* — against a tree
  holding **5 before / 7 after**. The eight is a correct count of a different
  noun (ten `.py` files in `scripts/loops` minus the two changed); three of
  those eight do not import `_common` at all. **The consolidation itself is
  sound and is not reopened** — all seven real consumers import cleanly.
- **One claim is NOT re-runnable and that is recorded rather than passed over**:
  244.3's cross-file duplicate detector was never committed, so *"reads 0, down
  from 4"* and its `0 → 1` red-proof cannot be re-derived.

**Refused inside the item, and recorded:** filing that detector as a sibling
item. 244.4 is already open on the same question and its second criterion asks
exactly *"second gate or shared mechanism"* — the general detector is a **third
option** there, noted under 244.4, not a fourth roadmap entry.

**This wake's own first output was wrong, written down rather than smoothed
over:** re-checking 241.2's contrast read the dark ratio as **3.49** against a
published 11.46 — because it applied the light literal (`%236b7280`) to the dark
surface. `select.css:47` swaps to `%23d1d5db` under `[data-theme="dark"]`, which
reads **11.46** exactly. A near-miss of the same shape: `grep -l 'src-css-files'`
returns four files in `packages/core/scripts`, but the fourth match is
`generate-scales.mjs`'s comment *declining* to import it.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test`, `lint:css`, `docs:build`, `check:claims`, `check:formatting`,
`check:scroll` (**912 containers / 118 pages × 2**), `check:layout` (**127
pages**), `check:forced-colors`, `test:axe` (**127 × 2, zero violations**),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (**19 behaviours**), `check -w @busy-office/create-ui`, and
`suite` (**28 screens × 2 widths**). `check:repo` after the ROADMAP edits:
`check:slice-refs` reads **701 citations / 227 slice numbers** (up from 699 /
226 — Slice 245's heading and its citations, which reconciles).

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `ff28dfdb` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty), and `origin/main` arrived as a
**forced update** (`+ 17b3ba6...ff28dfd`) with the local `main` ref stale at
`17b3ba6` — the same stale sha as the last seven wakes. `git checkout -B main
origin/main` fixed it before any commit existed. Trap 2's `--unshallow` ran clean
in one attempt, no `.git/shallow.lock`, `is-shallow-repository` → `false`,
**1,806** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage.

**The open set is 5 items across 4 slices, and TWO are dispatchable:**

| item | kind of blocked |
|---|---|
| `244.4` src/css walker gate | **NOT BLOCKED** — any wake can build it; a reasoned refusal closes it |
| `245.1` 244.3's two wrong counts | **NOT BLOCKED** — filed this wake; markdown-only, two sites |
| AT runtime evidence (Slice 15) | **owner-hardware-blocked** — needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

Rule 4 takes the **oldest** of the two dispatchable ones, which is `244.4`.

**What is owed to the owner:** unchanged, and now **thirteen wakes old**. Slice
112's pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS, no page markup and no shipped artefact** — the diff is `ROADMAP.md`, one
new `.roundtable/` report and the bookkeeping files. **Nothing was looked at
visually.** `check:layout` (127 pages) and `test:axe` (127 × 2) executed in this
container regardless and are green.
