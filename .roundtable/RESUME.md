# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 4 → 167.1
closed**). Working tree clean at hand-off; the wake's commits were pushed as one
batch.

**This file's own growth was verdicted this wake, and the verdict is that it is
supposed to shrink.** 167.1 measured it at **27 up / 13 down** over 40
transitions — it is rewritten each wake, not appended, min 314 and max 2,980.
The 2,980 peak was the commit 167.1 quoted, and the next commit cut it 44%. So
trimming this file is the rule, not a tidy: run
`python3 scripts/loops/report_loop_prose.py` and keep the `down` column alive.

**This file goes stale between wakes — reconcile it against `ROADMAP.md` before
trusting its open set.** Live proof, and it happened again: the handover this
one replaces named **163.1 as the oldest dispatchable open item**. `ROADMAP.md`
showed it already closed. `ROADMAP.md` was right; this file was not. Trust the
`N. [ ]` checkboxes, not this section.

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

### 6. NEW — THE GITHUB RUN-LEVEL ENDPOINTS SERVE A STALE SNAPSHOT

**This cost ~20 minutes of dead polling this wake, and put a wrong claim in the
owner's notification.** After pushing, `get_workflow_run` and
`list_workflow_jobs` both reported run 565 `in_progress` with `updated_at`
FROZEN at `06:50:54` across five polls over twenty minutes — so it read as a run
hung at ~7x its ~3-minute norm. It was not. Querying each job by id with
**`get_workflow_job`** returned live data: all six had finished, the last at
**06:53:48**, every step `success`. A normal three-minute run.

The tell is the one this repo already names — *a value identical across many
polls is a defect in the instrument until proven otherwise*. A timestamp that
does not move while a run is supposedly progressing is that value.

```
# stale:  actions_get   get_workflow_run   <run_id>
# stale:  actions_list  list_workflow_jobs <run_id>
# LIVE:   actions_get   get_workflow_job   <job_id>     ← use this
```

Get the job ids once from `list_workflow_jobs`, then poll the jobs individually.
And note this was a *reported* number: the owner was told CI looked stuck. That
is the failure mode CLAUDE.md's "a number you report is load-bearing" section is
about, and it happened to a number about the tooling rather than the product.

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

Green this wake: `build -w @busy-office/ui`, `test -w @busy-office/ui`,
`docs:build`, `check:repo`, `check:claims` (139), `check:layout` (127 pages),
`test:axe` (127 × 2).

**CI run 565 (`cd31930`) is GREEN** — all six jobs `success`, finished 06:53:48,
confirmed per-job because the run-level endpoint was stale (trap 6).

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark.

**From THIS wake — nothing visual exists to look at.** `git diff --stat` lists
`ROADMAP.md`, `LOOPS.md`, `.roundtable/RESUME.md` and one new Python script
under `scripts/loops/`. No page's markup, CSS or component changed at all, which
is a stronger statement than a screenshot would have been. `check:layout` (127
pages) and `test:axe` (127 × 2) swept anyway and were green. **No visual debt was
added; nothing visual was looked at.**

**The two carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

**NEXT WAKE: rule 4 — Continue, build mode.** Rules 1-3 were all clear this wake
(no open P0, GitHub intake empty at 0 open issues, Standardize 1/4, Objective
1/3). Re-derive the queue from the `N. [ ]` checkboxes rather than trusting this
line; as it stood at hand-off the oldest still-open dispatchable item is
**167.2**, then **168.1**. 112.3/112.4 and the AT-runtime item are older but
blocked on the owner or on hardware.

**167.2 has a live datum waiting for it.** Re-running its own command this wake,
rule 3 is now **1,171 words (181 rule / 990 history)**, up from the 1,026
(181 / 845) it was filed at — it grew 145 words, all history, while the item to
archive it sat open. Re-run, do not quote.

## What landed this wake (2026-08-28, cloud, rule 4 → 167.1)

**167.1 closed: 2 instrument, 3 honest, 0 removable that is not already filed.**
Every figure and command is in ROADMAP 167.1 — **do not re-derive them, re-run
them**, with `python3 scripts/loops/report_loop_prose.py`. In one line each:

- **Two of the entry's four headline figures did not survive re-running.**
  `RESUME.md` is **+100.4%**, not the +256% filed; ROADMAP was quoted as
  ROADMAP **+ archive**, and the file rule 4 actually reads went **-85.9%**.
- **The load-bearing column is `accumulate`, not the delta.** 158.2's cadence
  rests on docs pages never shrinking; 2 of these 5 shrink by design, so a
  rising count means nothing for them.
- **The cadence extends; 158.2's instrument does not.** n=5 has no usable median
  (161.1 already recorded n=6 failing, and the spread here is 102x).
- **Shipped:** `scripts/loops/report_loop_prose.py`, three guards red-proved end
  to end, plus one bullet in `LOOPS.md`'s Standardize step 1 — **+73 words,
  measured by the script itself**, to the file this item is about.

**167.3 closed, found in passing while committing 167.1.** `STATUS.md`'s history
half had no reconciliation and this wake's own commit would have deleted nine
committed iteration rows — see trap 5 above and ROADMAP 167.3. CLAUDE.md's
storage doctrine was written for this generator and only its open-items half
applied it; the iterations half in the same file had nothing. Four branches
red-proved.

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
