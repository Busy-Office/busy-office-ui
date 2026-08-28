# Environment — the traps, and the toolchain that works

**Read this at Step 0 alongside `.roundtable/RESUME.md`.** `LOOPS.md`'s Step 0
names both files, so this is a step the dispatcher executes, not a cross
reference it may skip.

This file exists because of **roadmap 169.3, decided 2026-08-28**. Everything
below lived in `RESUME.md` — the handover that is rewritten wholesale every wake
— against that file's own charter, which admits only *uncommitted work* and *a
decision not yet written down*. The measurements that decided it, and the
argument for refusing that was weighed and lost, are in ROADMAP 169.3.

**This file is durable. Edit it when a trap changes; do not re-copy it.** A
correction here shows up as a small `git diff` on a stable file, which is the
whole point: the same correction inside `RESUME.md` was invisible in a 111-line
rewrite, and that is exactly how 169.1's wrong sentence survived 166.1 fixing it.

---

## 1. `git checkout main` — the container starts DETACHED

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch. `origin/main` frequently arrives as a
**forced update** (a rebase — Step 0c's collision mechanic, visible), so the
local ref is not merely behind: 2026-08-28 saw `17b3ba6...12e97c6`, and the tip
the previous handover named no longer existed at all.

A container may have **no local `main` whatsoever**, which is harder than the
stale-ref case and shows up one command earlier: `git rev-parse --short main
HEAD` exits **128** with `fatal: Needed a single revision`.

**THE TRAP DOES NOT BITE AT STEP 0. IT BITES AT `git push`, and the usual Step 0
check gives false comfort** (2026-08-28, Slice 170 — that wake's first push was
rejected after three commits were already made).

On a detached HEAD the local `main` ref still exists and is **stale** — it sat
at the pre-rebase `17b3ba67` while work was committed onto a detached
`6dfb8709`. `git push -u origin main` pushes *that ref*, not `HEAD`, so it
reports the confusing `a pushed branch tip is behind its remote counterpart`
even though the work is strictly ahead.

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

## 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

**Anchor every command with an absolute `cd`, or none at all.** A `cd apps/docs`
to run one gate leaves the NEXT command there.

## 1c. `CHROME_PATH` DOES NOT PERSIST EITHER

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. It is needed by
`docs:build` (`check-boost.mjs`), `check:layout` and `test:axe`.

## 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~25s; ~1,500 commits
```

`report_loop_prose.py` **refuses to report** on a shallow clone rather than
printing wrong figures; that guard was red-proved against a real
`git clone --depth 1`. Nothing else refuses, so any wake whose finding is a
history measurement must unshallow first.

## 3. `astro build` does not clear `dist`

`rm -rf apps/docs/dist` first. Skipping it has produced a real failure rather
than a stale number once — `report:prose` died with `ENOENT … apps/docs/dist`
before the build — but that is luck, not a guard.

## 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here. The style enforcers
are `stylelint` and the gates in `check:repo`.

## 5. `loops.db` IS GIT-IGNORED, SO A FRESH CONTAINER HAS NO MIRROR

**Guarded since 167.3, so this is a shape to know rather than a live trap** —
but other derived mirrors have it too. `record_iteration.py` regenerates the
tracked `STATUS.md` from `loops.db`, and on a fresh clone that db holds only the
row the current wake just inserted. `STATUS.md`'s "Last 10 iterations" was once
rendered from **2 rows against the log's 1,020**, which would have committed
nine rows of history away, silently. `generate_status.py` now counts the raw
rows in `loop-log.md`, announces the disagreement and rebuilds. **If you touch
another mirror here, assert its count against the file first.**

## 6. A BACKGROUND TASK'S OUTPUT FILE IS NOT A COMPLETION SIGNAL

A worked example of "an instrument's first output is not evidence", and the
wrong diagnosis got committed before the right one. The first version of this
trap accused the GitHub run-level endpoints of serving a stale snapshot. **That
accusation is withdrawn — it was wrong**, and the real cause was the wake's own
waiting.

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

**What it cost.** Five CI polls fired inside ~4 minutes of wall clock while the
wake believed ~20 minutes had passed, so a **normal three-minute run** (565:
started 06:50:44, last job done 06:53:48, all six `success`) looked hung at 7x
its norm. That false alarm was sent to the owner, then a second notification
"corrected" it with a diagnosis that was also wrong. Two reported numbers, both
the instrument's fault. Container wall clock is the check that settles it —
`date -u` against `git log --format=%cd`.

`get_workflow_job` on a specific job id **is** still the most direct route to a
definite per-job answer, and job ids come from `list_workflow_jobs`. But the
run-level readings were most likely correct when taken: `updated_at` on a run
does not tick per step, so a frozen value there is normal and is not evidence
of staleness.

## 7. A BARE `wc -w` UNDERCOUNTS THIS REPO BY 2.4-4.5%

No locale is set in this container, and GNU `wc` in the C locale swallows an em
dash, which this repo's prose is full of:

```
printf 'alpha — beta\n' | wc -w                 # 2   ← wrong
printf 'alpha — beta\n' | LC_ALL=C.UTF-8 wc -w  # 3
```

`LC_ALL=C.UTF-8 wc -w` and Python's `str.split()` agree exactly on all five
loop-machinery files. Any ad-hoc word count taken here is low unless the locale
is pinned. Full figures in ROADMAP 167.1.

---

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
rm -rf apps/docs/dist
```

Then, all runnable in a cloud wake without anything hand-started — they bring
up their own server via `serve-dist.mjs`, which is why that exists:

```
npm run build -w @busy-office/ui
npm run test -w @busy-office/ui
npm run docs:build
npm run check:repo -w docs
npm run check:claims -w docs
npm run check:layout -w docs
npm run test:axe -w docs
```

`sqlite3` is NOT installed in this container. Query the `loops.db` mirror with
Python's `sqlite3` module — `python3 -c "import sqlite3; ..."`.

**What a cloud wake CANNOT do:** there is no Podman and no `localhost:8081`, so
the live-verify step every other rule assumes — screenshots at 1440px and 390px
in both themes — cannot run. An item that genuinely needs one is left OPEN with
the reason recorded, per the standing instruction; it is never described as
verified.

---

## Traps worth carrying forward (measurement discipline, not slice history)

- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory*, run
  both against the one live log, then delete the probe.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  31 pathnames in this repo are exactly 40 characters, so "any 40-char line is a
  sha" overcounts commits by 8%.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.
- **A presence probe is not a fidelity probe.** Asking whether a heading still
  appears in 53 revisions answers whether it was deleted, not whether what sits
  under it decayed. 169.3's first pass read "zero shrinks" off a subset of
  sections with a deduplicated display; the honest count on the full set was
  three (roadmap 169.3).

---

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. The owner's
line: **scrub UX-precedent mentions only.** Design-system citations, interop
hazards (the product name is the reader's search term) and licence attributions
are KEPT, with the reasons in `check-vendor-names.mjs`'s header. The gate is a
denylist and catches regrowth, not every conceivable name, so the judgement is
still yours.
