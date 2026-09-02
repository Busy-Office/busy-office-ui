# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). **`check:resume-slice-ids` DID fire on this wake's
> recording**, naming `244.4` — correctly, against the *previous* hand-off,
> which listed it as dispatchable. This file has been rewritten since. Run both
> against the file as it now stands rather than trusting that.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-09-02 (**cloud** wake). Working tree clean at hand-off; two
commits — `8f6c1011` and the bookkeeping commit carrying this file — pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off, across 3 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ Rule 4 fires next wake, and ONE item is dispatchable

```
Standardize   1 / 4 Continue rounds   since 2026-09-02 16:54   ok
Objective     1 / 3 slices            since 2026-09-02 17:53   ok  [244]
Optimize      0 wake-date(s) newer    since 2026-09-02 01:46   ok  [newest pair: axe-violations]
```

- **Rules 1, 2, 3 are all clear**, so **rule 4 dispatches Continue, build mode**.
  The only NOT-BLOCKED item left is `245.1`.
- **The Objective counter names slice `244`, not `246`.** That is the parser
  reading the slice out of the item text (`244.4 — …`), and it is correct: the
  item that closed is 244.4. Slice 246 is this wake's write-up; its own `246.1`
  is a recorded finding closed in the same breath, not a second closed slice.
  Do not "fix" the counter to 2.
- **Rule 5 is `ok`, not STALE, and was genuinely evaluable**: `axe-violations`
  reads zero across consecutive runs and the one live absolute budget
  (`RF_BUDGET_KB = 40`) passed inside `npm run build -w @busy-office/ui`. **Do
  not read `bundle-gz-kb`** — it and eleven other names are 13+ days stale and
  its `10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## ⚠ The archive sweep signal crossed 50% this wake — read it before dispatching

`roadmap_scope.py` reads closed-history share **1,676 / 3,294 = 50.9%**, up from
41.7% at the last hand-off, with targets
`[246, 244, 243, 242, 241, 240, 239, 238, 237]`. **The live roadmap is now more
than half closed history.** LOOPS rule 4 says outright: if the rule is walking
thousands of lines, triage the sweep and run it — Slices 165 and 177 are the
precedent for doing that from inside a dispatch.

The move is **numerator-driven this time**, not denominator-only: Slice 246
closed 244.4 and added its own write-up, so 1,304 → 1,676 closed lines. Read it
from the tool, never by subtracting.

**Two targets are flagged by the 236.2 dependency report**, both by the same
open item: Slices **238** and **244** are named by `245.1` (`ROADMAP.md:503`).
Read the flag before moving either. 245.1's Accept is about correcting two
counts published in **244.3**, which is inside Slice 244 — so unlike the last
wake's flag, this one names a slice the open item may actually need to **amend**,
which is exactly the case 236.2 was written for. **Do not move Slice 244 until
245.1 is closed.** Slice 238 is cited as precedent only and is safe to move.

## What landed this wake

**Continue, build mode, dispatched by rule 4** on the oldest still-open item,
`244.4`. One commit. Slice write-up in ROADMAP 246.

- **Built `apps/docs/scripts/check-src-css-walkers.mjs`** and extracted
  `gate-source-scan.mjs`, the shared driver `check-dist-walkers.mjs` is now
  rewired onto. Wired into `check:repo` (not into core's `build` — see below).
- **244.4's own premise was wrong in one of its two readings, and that is
  recorded rather than smoothed over.** *"True of every core script but one"*
  holds for its base-rate clause (**2 of 26**, both exempt) and NOT for its first
  criterion's wording, *"enumerates `src/css` itself"* (**7 of 26**). Four of the
  six non-chokepoint matches enumerate `src/css/components` as a **directory
  structure** a flat file stream cannot express. Both counts are in the gate's
  header so the next wake does not re-derive them.
- **The design question was answered by a count nobody had taken**: this repo has
  **FOUR** walker chokepoints — `dist-pages.mjs` (gated 103.2),
  `src-css-files.mjs` (gated now), `source-files.mjs` and `dist-css.mjs` (both
  ungated). `source-files.mjs`'s own header states the gap. So "second gate or
  shared mechanism" was never the real choice.
- **Chosen: a shared DRIVER, one gate FILE per chokepoint.** The argument is a
  measured property of an existing gate, not taste: `check-selftests.mjs` demands
  `@heuristic`/`@exact` + a real `--self-test` **per `check-*.mjs` file**, so a
  table of rows would satisfy it once and accept predicates three and four
  unproved. Confirmed by the count moving **47 → 48 gates, 17 heuristic**.
- **The predicates cannot be shared, red-proved:** `walksDist` reads **false** on
  the exact body 244.2 removed (`git show 71a61679`) and **true** on its dist
  control. A recursive walker names its tree at the **call site**, not in the
  `readdir` argument — so a retargeted copy of the dist gate would have been a
  detector that cannot fail on the drift it was written for.
- **Why it lives in `apps/docs/scripts`:** it reads core's scripts as TEXT. A
  gate in core's `build` chain could not import that directory —
  `examples/po-app/Dockerfile` runs `npm run build -w @busy-office/ui` with
  `packages` + `apps/docs/package.json` only, which is how `check:rtl`'s
  DESIGN.md assertion broke that image build. `check-selftests.mjs` is the
  precedent for scanning both dirs from here.

**Refused inside the item, and recorded:** gating the wide reading of the
predicate (it would exempt six of twenty-six core scripts — exempting the tree
rather than gating it); a table-driven single gate; and routing
`check-contrast.mjs:135` / `build-component-css.mjs:98` through the chokepoint —
neither is a drop-in (both use bare filenames, `srcCssFiles` yields full paths)
and it would change build output this wake cannot verify visually. Filed as the
closed finding `246.1` so the next Standardize sweep has the call sites.

**The third option 245 recorded is neither chosen nor lost.** 244.3's general
cross-file duplicate detector **cannot catch regrowth** — a duplicate detector
needs n ≥ 2, and regrowth is the n = 1 case (103.1's single private
`readdirSync(join(DIST,'patterns'))` had no twin). Complementary lane, still
available, still uncommitted.

## Gates

**All 17 CI entry points ran green against the committed tree, exit 0 each** —
`build`, `test` (**27 files / 152 tests**), `lint:css`, `docs:build`,
`check:claims`, `check:formatting`, `check:scroll` (**912 containers / 118 pages
× 2**), `check:layout` (**127 pages**), `check:forced-colors`, `test:axe`
(**127 × 2, zero violations**), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**19 behaviours**),
`check -w @busy-office/create-ui`, and `suite` (**28 screens × 2 widths**).

`check:repo` after the ROADMAP edits: `check:slice-refs` reads **704 citations /
228 slice numbers** (up from 703 / 227 — Slice 246's heading, which reconciles).
`check:selftests` reads **48 gates: 17 heuristic (all self-tested), 31 exact**,
up from 47/16 — the `+1` is `check-src-css-walkers.mjs`, verified by counting
`check-*.mjs` in both script dirs at HEAD (47) and in the tree (48).

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container. **Not a regression; do not "restore"
the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `41abd4b8` across both `git fetch origin main` calls —
Step 0 and once immediately before the first commit.

**ENVIRONMENT traps 1 and 2 both bit at Step 0, as usual.** The container started
**DETACHED** (`git branch --show-current` empty), and `origin/main` arrived as a
**forced update** (`+ 17b3ba6...41abd4b`) with the local `main` ref stale at
`17b3ba6` — the same stale sha as the last eight wakes. `git checkout -B main
origin/main` fixed it before any commit existed. Trap 2's `--unshallow` ran clean
in one attempt (run in background to survive the 300s tool timeout that creates
`.git/shallow.lock`), `is-shallow-repository` → `false`, **1,808** commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`, and
no owner message. Step 1 had nothing to triage.

**The open set is 4 items across 3 slices, and ONE is dispatchable:**

| item | kind of blocked |
|---|---|
| `245.1` 244.3's two wrong counts | **NOT BLOCKED** — markdown-only, two sites; rule 4 takes this next |
| AT runtime evidence (Slice 15) | **owner-hardware-blocked** — needs a human listening to a screen reader |
| `112.3` pattern-fit pilot | **owner-blocked** — 5 briefs; `.roundtable/pilot-112/briefs.md` is still the 16-line scaffold, its only commit `e58ea3ca` on **2026-08-23**, never modified since (read from `git log`, not mtime — mtime here is clone time) |
| `112.4` Screen Contract layer | **owner-blocked** — on 112.3's verdict |

**After 245.1 lands, rule 4 has nothing left that is not owner-blocked**, and
the loop falls to rule 6 (Polish) — worth knowing one wake ahead.

**What is owed to the owner:** unchanged, and now **fourteen wakes old**. Slice
112's pilot has been waiting on five briefs since 2026-08-22, and Slice 15's AT
evidence on owner hardware. **Nothing this loop can do closes either.**

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS, no page markup and no shipped artefact** — the diff is two new gate scripts,
one rewired gate, `apps/docs/package.json` and markdown. **Nothing was looked at
visually.** `check:layout` (127 pages) and `test:axe` (127 × 2) executed in this
container regardless and are green.
