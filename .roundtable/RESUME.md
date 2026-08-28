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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 2 → Standardize,
Slice 169**). Working tree clean at hand-off; the wake's commits were pushed as
one batch.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes, and it did again: the handover this one replaces named
**167.2** as the oldest dispatchable open item, and `ROADMAP.md` showed it
already closed (`3006da0`). Trust the `N. [ ]` checkboxes, not this section.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS

**Re-confirmed this wake: 1, 1c, 2, 3.** Trap 4 was not exercised (no formatter
was run). Said plainly rather than carried forward as "all confirmed".

### 1. `git checkout main` — the container starts DETACHED

Confirmed again. This wake `origin/main` came back as a **forced update**
(`17b3ba6...787319c`) — a rebase — so the local ref was not merely behind.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch.

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

Green again this wake (2026-08-28, Slice 169): `build -w @busy-office/ui`,
`test -w @busy-office/ui` (137), `docs:build`, `check:claims` (139),
`check:repo`, `check:layout` (127 pages), `test:axe` (127 × 2). Traps 1, 1b,
1c, 2, 3 and **6** were all exercised for real — 6 bit again, on the
`scan:dead-style` background task, and the empty output file was correctly read
as *still running* rather than done.

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing visual exists to look at from this wake.** `git diff --stat` lists
`ROADMAP.md`, `LOOPS.md`, `.roundtable/RESUME.md` and one `console.log` format
in `apps/docs/scripts/report-prose.mjs`. No file under `packages/core/src` or
`apps/docs/src` was touched, which is a stronger statement than a screenshot.
`check:layout` (127 pages) and `test:axe` (127 × 2) swept anyway and were green.
**No visual debt was added; nothing visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## What landed this wake (2026-08-28, cloud, rule 2 → Standardize 169)

Dispatcher: rule 1 clear (no open P0, GitHub intake **0 open issues**), rule 2
read `Standardize 4 / 4 OVERDUE` and won. Third run of 158.2's cadence.
**Three of the four sweeps were zero-delta; the finding came from the fourth.**

- **169.1 closed.** `LOOPS.md` still told every wake that `/base/motion/`,
  `/concepts/js-behaviors/` and `/concepts/design-language/` were unread.
  **161.1 verdicted all three**, and **166.1 already found this** — and put the
  correction in THIS file, which is rewritten every wake, so it was discarded
  while the durable playbook stayed wrong. This wake re-derived all three a
  third time before finding 161.1's entry. The instruction now names the
  **property** (any flagged page with no verdict in `ROADMAP.md` or the
  archive), not a snapshot of names.
- **169.2 closed.** `report-prose.mjs`'s family list printed a bare URL while
  its corpus list printed `authored + generated`. The family half is the one
  LOOPS.md sends a wake to read, so the split was missing exactly where it was
  needed — 2 of the 12 family-flagged pages are majority machine-written
  (`js-behaviors` 375a+1054g, `which-pattern` 310a+2015g). No threshold moved;
  the flagged set is identical before and after.
- **169.3 OPEN — the generalized form, and the next wake can execute it.**
  63% of this file is durable content. Destination is a direction call, so it
  was filed rather than decided. Full measurement and command in ROADMAP 169.3.

**Re-run, do not quote** — every figure above has its command in ROADMAP 169.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

**NEXT WAKE: re-derive it, but expect rule 3 (Objective).** Standardize
discharged its counter this wake, and Objective stood at 2/3 before it. Rule 4's
oldest dispatchable open items are **168.1** then **169.3**; 112.3/112.4 and the
AT-runtime item are older but blocked on the owner or on hardware.

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