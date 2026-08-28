# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

**169.3 (OPEN) says this file is not honouring that header** — 164 of its 261
lines were durable content, kept alive only by each wake re-copying it. The
trap block below is exactly that content. It stays until 169.3 is decided;
moving it is that item's job, not a passing tidy.

---

## In flight: nothing

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 3 → Objective,
Slice 170**). Working tree clean at hand-off; the wake's commits were pushed as
one batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. The handover this one replaces was correct: it named
**168.1** then **169.3**, and both are still open. Trust the `N. [ ]`
checkboxes, not this section.

**Direction, stated as a fact of this wake and not as an implementation of
168.1** — that item asks for a *standing* element of the handover and is still
open, to be decided by the wake that dispatches it. The chosen direction is (a),
publish `create-ui`; its remaining step is `npm publish`, owner-only, so this
wake could not advance it. Measured: **61 commits since the last change to a
declaration in `packages/core/src`**, which is `c073c360` — the cloud routine's
own first commit.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS

**Exercised for real this wake (2026-08-28, Slice 170): 1c, 2, 3.** Said one by
one rather than carried forward as "all confirmed":

- **1** — exercised in full, and **it bit at `git push`, not at Step 0.** See
  the corrected trap 1 below; this wake's first push was rejected.
- **1b, 4, 7** — not exercised: no `cd` was issued, no formatter was run, and
  every word count came from `report_loop_prose.py` (Python `str.split()`),
  never from a bare `wc -w`.
- **6** — avoided by construction, not tested: background tasks were waited on
  by the completion notification and by `Monitor` with an until-loop. An empty
  output file was never read as "done".

### 1. `git checkout main` — the container starts DETACHED

Confirmed again. This wake `origin/main` came back as a **forced update**
(`17b3ba6...fe2de12`) — a rebase — so the local ref was not merely behind.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch.

**THE TRAP DOES NOT BITE AT STEP 0. IT BITES AT `git push`, and the usual Step 0
check gives false comfort** (2026-08-28, Slice 170 — the first push of that wake
was rejected after three commits were already made).

On a detached HEAD the local `main` ref still exists and is **stale** — here it
sat at the pre-rebase `17b3ba67` while work was committed onto a detached
`6dfb8709`. `git push -u origin main` pushes *that ref*, not `HEAD`, so it
reports the confusing `a pushed branch tip is behind its remote counterpart`
even though your work is strictly ahead.

The check that missed it is the one that looks most reassuring:

```
git rev-list --left-right --count origin/main...HEAD    # 0  3   ← compares HEAD
git branch --show-current                               # EMPTY ← the actual answer
git rev-parse --short main HEAD                         # 17b3ba67 vs 6dfb8709
```

`--left-right ... HEAD` compares the wrong ref. **Run `git branch
--show-current` before the first commit; an empty answer means fix it now.**
The recovery once commits already exist is safe and is a fast-forward — verify
first, never force:

```
git merge-base --is-ancestor origin/main HEAD && git checkout -B main HEAD
git push -u origin main
```

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

**Anchor every command with an absolute `cd`, or none at all.** A `cd apps/docs`
to run one gate leaves the NEXT command there.

### 1c. `CHROME_PATH` DOES NOT PERSIST EITHER

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. Confirmed again this
wake: it is needed by `docs:build` (`check-boost.mjs`), `check:layout` and
`test:axe`.

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~25s; brought this wake to 1,481 commits
```

Needed again this wake — 167.1 is entirely history measurement.
`report_loop_prose.py` now **refuses to report** on a shallow clone rather than
printing wrong figures; that guard was red-proved against a real
`git clone --depth 1`.

### 3. `astro build` does not clear `dist`

`rm -rf apps/docs/dist` first — this wake did. Exercised for real: `report:prose`
died with `ENOENT … apps/docs/dist` before the build, which is the honest failure
rather than a stale number.

### 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here. The style enforcers
are `stylelint` and the gates in `check:repo`.

### 5. NEW — `loops.db` IS GIT-IGNORED, SO A FRESH CONTAINER HAS NO MIRROR

**Fixed this wake (167.3), so this is now a note rather than a trap** — but know
the shape, because other derived mirrors have it too. `record_iteration.py`
regenerates the tracked `STATUS.md` from `loops.db`, and on a fresh clone that db
holds only the row this wake just inserted. `STATUS.md`'s "Last 10 iterations"
was rendered from **2 rows against the log's 1,020**, which would have committed
nine rows of history away, silently. `generate_status.py` now counts the raw rows
in `loop-log.md`, announces the disagreement and rebuilds. If you touch another
mirror here, assert its count against the file first.

### 6. NEW — A BACKGROUND TASK'S OUTPUT FILE IS NOT A COMPLETION SIGNAL

**This wake's own worked example of "an instrument's first output is not
evidence", and the wrong diagnosis got committed before the right one.** The
first version of this trap accused the GitHub run-level endpoints of serving a
stale snapshot. **That accusation is withdrawn — it was wrong**, and the real
cause was the wake's own waiting.

To wait for CI, four `sleep 150`–`sleep 240` commands were launched with
`run_in_background`, and after each the output file was read. It came back
empty, the harness rendered that as *"(Bash completed with no output)"*, and
that was read as **the task finished**. It means the opposite: the file is empty
because the task is **still running**. So every "wait" was about three seconds.

Measured, not reasoned — `date; sleep 20; date` launched at **06:56:55**:

```
06:56:58  file holds "start 06:56:55"          ← 3s in, reads as "no output"
06:57:11  file holds "start 06:56:55"          ← 16s in, still nothing new
06:57:29  file holds "start … / end 06:57:15 / [exited with code 0]"
```

The sleep itself is fine and elapses correctly. **The completion marker is the
literal `[exited with code 0]` line**, and it was absent from every mid-flight
read. Wait for the task-completion notification, or use `Monitor` with an
until-loop; foreground `sleep` is blocked in this environment. Never infer
completion from an empty file.

**What it cost, and why it is filed here rather than shrugged off.** Five CI
polls fired inside ~4 minutes of wall clock while the wake believed ~20 minutes
had passed, so a **normal three-minute run** (565: started 06:50:44, last job
done 06:53:48, all six `success`) looked hung at 7x its norm. That false alarm
was sent to the owner, then a second notification "corrected" it with a
diagnosis that was also wrong. Two reported numbers, both the instrument's
fault. Container wall clock is the check that settles it — `date -u` against
`git log --format=%cd`; the whole wake spans 06:47→06:57.

`get_workflow_job` on a specific job id **is** still the most direct route to a
definite per-job answer, and job ids come from `list_workflow_jobs`. But the
run-level readings were most likely correct when taken: `updated_at` on a run
does not tick per step, so a frozen value there is normal and is not evidence
of staleness.

### 7. NEW — A BARE `wc -w` UNDERCOUNTS THIS REPO BY 2.4-4.5%

No locale is set in this container, and GNU `wc` in the C locale swallows an em
dash, which this repo's prose is full of:

```
printf 'alpha — beta\n' | wc -w                 # 2   ← wrong
printf 'alpha — beta\n' | LC_ALL=C.UTF-8 wc -w  # 3
```

`LC_ALL=C.UTF-8 wc -w` and Python's `str.split()` agree exactly on all five
loop-machinery files. Any ad-hoc word count taken here is low unless the locale
is pinned. Full figures in ROADMAP 167.1.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
rm -rf apps/docs/dist
```

Green again this wake (2026-08-28, Slice 170): `build -w @busy-office/ui`,
`test -w @busy-office/ui` (137 tests, 26 files), `docs:build`, `check:repo`
(9 gates — 288 imports, 42 self-test classifications, 185 slice citations, 530
files against the vendor denylist), `check:claims` (139 behaviours),
`check:layout` (127 pages), `test:axe` (127 × 2, zero violations).

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing visual exists to look at from this wake.** `git diff --stat` lists
`ROADMAP.md`, `LOOPS.md`, `.roundtable/RESUME.md` and one new grill file. **No
executable file was touched at all** — no script, no CSS, no Astro page — which
is a stronger statement than a screenshot. `check:layout` and `test:axe` swept
every page at both widths anyway and were green. **No visual debt was added;
nothing visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## What landed this wake (2026-08-28, cloud, rule 3 → Objective 170)

Dispatcher: rule 1 clear (no open P0, GitHub intake **0 open issues**), rule 2
read `Standardize 0 / 4`, rule 3 read `Objective 3 / 3 OVERDUE [164, 167, 169]`
and won. Full report:
`.roundtable/grill-objective-164-167-169-2026-08-28.md`.

- **170.1 closed — `ROADMAP.md`'s plan of record went stale 37 minutes after it
  was written, and 193 commits passed over it.** `## Sequence — what runs next`
  opens *"Eighteen items are open; nine are dispatchable"* (it is **5 and 2**)
  and sequences five rows that are all closed or were deliberately dropped; its
  gated list still says "0.3.0 cut" while the package is **0.5.0**. Nobody
  noticed because rule 4 reads *checkboxes* and never the prose above them. The
  section now carries a supersession note with its commands, and the owner's
  text is left verbatim. `## STATE (2026-08-18)` got the same one-line
  annotation; `## CI strategy` was checked and is sound.
- **170.2 OPEN — the generalized form**: nothing re-reads `ROADMAP.md`'s
  narrative sections. Accept is written so that **refusing it on a measured base
  rate satisfies it** — there is exactly one plan-of-record table in the repo.
- **Finding B, settled not filed**: 161.4's *"`Objective` is excluded — circular"*
  is wrong. A grill files items in its **own** slice number and `Continue` builds
  them, so a grill arms the next grill: **7 of 26** dispatches depended on that,
  and this wake is the extreme case (2 of 3 armed slices are grills; 1 of 3
  without them, which would have dispatched **168.1** instead). Corrected in
  `LOOPS.md` rule 3. No mechanism — a heading classifier would be the sixth
  regex, and this grill's own first attempt got it wrong.
- **Finding C, settled not filed**: **61 commits, zero shipped declarations
  changed.** Third consecutive grill to conclude the direction is owner-blocked;
  the filed answer, 168.1, already exists.

**Re-run, do not quote** — every figure above has its command in ROADMAP 170 or
the grill file.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

Read immediately after `record_iteration.py` this wake: **Standardize 0/4 ok,
Objective 3/3 OVERDUE → 0/3 ok**, parser at 1,029 rows against a raw
`grep -c "^- "` of 1,029 — the agreement that check exists for.

**NEXT WAKE: re-derive it, but expect rule 4 → 168.1.** Both counters were
discharged or low at hand-off. Rule 4's oldest dispatchable open items are
**168.1**, then **169.3**,
then **170.2**; 112.3/112.4 and the AT-runtime item are older but blocked on the
owner or on hardware. 168.1 needs no browser and is dispatchable in a cloud wake.

## Traps worth carrying forward (not slice history)

- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory*, run
  both against the one live log, then delete the probe. Used again this wake to
  red-prove `report_loop_prose.py`'s fatal path.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  31 pathnames in this repo are exactly 40 characters, so "any 40-char line is a
  sha" overcounts commits by 8%.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. The owner's
line: **scrub UX-precedent mentions only.** Design-system citations, interop
hazards (the product name is the reader's search term) and licence attributions
are KEPT, with the reasons in `check-vendor-names.mjs`'s header. The gate is a
denylist and catches regrowth, not every conceivable name, so the judgement is
still yours.