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

Last updated 2026-08-28 04:41 UTC (cloud wake, scheduled routine —
**Objective → Slice 167**). Working tree clean; two commits landed and were
pushed as one batch.

**This file was CUT this wake — it stood at 2,980 words and is now a little
over half that**; run the count rather than quoting one, since the first draft
of this sentence published a figure that its own next edit made wrong:
`python3 -c "print(len(open('.roundtable/RESUME.md').read().split()))"`. The cut is the
first act of 167.1 rather than tidying: the multi-wake "what landed" sections
became pointers to the slices that already hold them verbatim. Nothing that a
wake needs was removed — the cloud traps, the toolchain and the open set are all
still here in full. If you want the history of a landed slice, read the slice.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS, ALL MEASURED

**All four were re-confirmed again this wake.**

### 1. `git checkout main` — the container starts DETACHED

Confirmed on every cloud wake so far. This wake: `HEAD` at `c4390c7` detached,
with a stale local `main`.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is pushed; the local
`origin/main` ref is not, until a fetch.

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

**Anchor every command with an absolute `cd`, or none at all.** A `cd apps/docs`
to run one gate leaves the NEXT command there.

### 1c. `CHROME_PATH` DOES NOT PERSIST EITHER — AND THE FAILURE LOOKS LIKE A BUILD BUG

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. A previous wake lost a
full `docs:build` to this: it ran 25 steps, built every page, then died at
`check-boost.mjs` with *"No Chrome/Chromium found"* — and `npm error` printed the
whole lifecycle script and nothing else. If a build dies in an unhelpful wall,
redirect to a log and read the lines **above** it.

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~25s; brought this wake to 1,468 commits
```

The oldest commit a shallow clone holds has no parents and appears to ADD every
file in the repo. **Unshallow before measuring anything from history.** This
wake needed it: every prose-growth figure in 167.1 is `git show` at nine
successive days' last commit.

### 3. `astro build` does not clear `dist`

An older source tree built over a newer `dist` leaves stale pages behind; the
tell is an *identical* page count across different inputs. `rm -rf
apps/docs/dist` first — this wake did.

### 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here; running it fetches
prettier and applies **its** defaults (double quotes; the repo writes single). A
previous wake turned a 125-line diff into 196 insertions that way. The style
enforcers are `stylelint` and the gates in `check:repo`.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

Green this wake: `build -w @busy-office/ui`, `test -w @busy-office/ui`,
`docs:build`, `check:repo` (9 gates), `check:claims` (139), `check:layout` (127
pages), `test:axe` (127 x 2, zero violations), `dispatch_status --self-test` (14
cases).

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark.

**From THIS wake — nothing visual exists to look at, and this is the FIFTH
consecutive wake for which that is true.** Every change is markdown plus one
comment block in a Python script that prints to stdout. `git diff --stat` over
the wake's commits lists `.md` files and `scripts/loops/dispatch_status.py`. No
page's markup changed at all, which is a stronger statement than a screenshot
would have been. `check:layout` and `test:axe` swept anyway and were unchanged.
**No visual debt was added; nothing visual was looked at.**

**Five consecutive non-visual wakes.** Not avoidance — rule 4's oldest open
items genuinely are loop machinery — but the two carried-forward visual items
have now waited **seven** and **ten** wakes:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## Counters after this wake

```
python3 scripts/loops/dispatch_status.py
  # Standardize 2 / 4 Continue rounds   ok
  # Objective   0 / 3 slices            ok   <- reset by this wake's grill
```

**Read immediately after `record_iteration.py`, per 166.5's lesson, and it
agreed** with what had just been written: the Objective row reset the counter,
and 1006 → 1009 rows accounts for one iteration plus two `--also-refused`. That
comparison has now come back clean twice running; **do it anyway next wake** —
it has found two of the parser's five blindings and nothing else ever has.

**NEXT WAKE: rule 4 — Continue, build mode.** Rules 1-3 are all clear (no open
P0, GitHub intake empty, Standardize 2/4, Objective 0/3). The oldest still-open
dispatchable item is **163.1**, then 164.2, then 165.1, then 167.1 and 167.2.
112.3/112.4 and the AT-runtime item are older but blocked on the owner or on
hardware; 164.3 is an OWNER CALL.

## What landed this wake (2026-08-28, cloud, Objective → Slice 167)

Full report: `.roundtable/grill-objective-161-162-166-2026-08-28.md`. The three
findings settled in place are in ROADMAP Slice 167's opener — **do not
re-derive them**; the commands are there. In one line each:

- **The 61-vs-23 is settled.** A third independent replay reproduces all five
  published crossing figures exactly at 996 rows, so 166.5's harness was wrong
  and its verdict holds — but it had adjudicated by treating a command-less
  number as an authority, and that number now reads **24**. `LOOPS.md` rule 3
  says so and points at the command.
- **A SIXTH log convention exists and is REFUSED**, measured at one crossing in
  the whole log's history. The counts, both commands and the reopen condition
  live beside `SLICE_TOP` in `dispatch_status.py`, so the seventh discovery is
  not re-reported as a new bug.
- **Filed open: 167.1 and 167.2** — the loop's own prose is the fastest-growing
  and only unmeasured prose in the repo, and one 6-line function carries 4,248
  words across four files.

## Still open, and why

- **163.1** — adjudicate the ten blocks at exactly one composition. Counts and
  command are in the item; do not re-derive them. **Oldest dispatchable.**
- **164.2** — whether the log records which clock wrote a row. **Start from
  162.1's finding**: the git author TZ offset already separates the two
  dispatchers exactly, and 1,000 of 1,005 rows carry their commit's sha (match
  with `[0-9a-f]{7,40}`, **never** `{7}`). The record exists one indirection
  away; the open question is whether that indirection is acceptable.
- **165.1** — the archive sweep, **by hand**. The command is in the item and
  re-runs in seconds — run it, do not quote a stale count. The last
  case-collision on this exact file pair destroyed 7,307 lines silently, so
  check `git ls-files` for a case-insensitive match before writing, and confirm
  `git status` shows `ROADMAP-archive.md` as **modified**, never as added.
- **167.1 / 167.2** — filed this wake; see above.
- **164.3** — OWNER CALL: the 2026-08-26 direction (adoption/DX) was discharged
  by Slice 147 and nothing succeeded it. Not a wake's decision.
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

## Traps worth carrying forward (not slice history)

- **`git stash` is not a way to A/B one file in a dirty tree.** It reverts the
  data along with the script, so two parsers get compared against two different
  logs. Extract the old version to a probe file *in the same directory* —
  `_common.LOG` resolves relative to the script — run both against the one live
  log, then delete the probe.
- **Parse `git log --name-only` with `--format=%x00%H` and NUL-split records.**
  31 pathnames in this repo are exactly 40 characters, so "any 40-char line is a
  sha" overcounts commits by 8%.
- **A parser change that reports MORE is not self-evidently a fix.** 166.5's
  first draft would have read `4-tick sweep` as slice 4 across 18 rows.

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. Slice 160
asked where the line is and the owner answered: **scrub UX-precedent mentions
only.** Design-system citations, interop hazards (the product name is the
reader's search term) and licence attributions are KEPT, with the reasons in
`check-vendor-names.mjs`'s header. The gate is a denylist and catches regrowth,
not every conceivable name, so the judgement is still yours.
