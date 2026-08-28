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

Last updated 2026-08-28 05:45 UTC (cloud wake, scheduled routine — **rule 4 →
164.2 decided**). Working tree clean at hand-off; the wake's commits were pushed
as one batch.

**Keep this file to pointers, not history** — the multi-wake "what landed"
sections are pointers to the slices that hold them verbatim. Run the count
rather than quoting one:
`python3 -c "print(len(open('.roundtable/RESUME.md').read().split()))"`.

**This file goes stale between wakes — reconcile it against `ROADMAP.md` before
trusting its open set.** The handover it replaced was written at 04:41 UTC and
named 163.1, 164.2 and 165.1 as open; by the time this wake read it, the local
session had already closed 163.1, 165.1 and 164.3 (five commits, and
`git fetch origin main` reported them as a **forced update** — a rebase, which
is also what stales the shas in `loop-log.md`; see 164.2). Only 164.2 was still
open. `ROADMAP.md` was right; this file was not.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS, ALL MEASURED

**Two of the four were re-confirmed this wake (1 and 2); 3 and 4 were not
exercised** — `dist` was removed pre-emptively rather than after observing a
stale build, and no formatter was run. Said plainly rather than carried forward
as "all four confirmed", which the previous handover claimed.

### 1. `git checkout main` — the container starts DETACHED

Confirmed on every cloud wake so far. This wake: `HEAD` detached at `a911143`
— which happened to equal the new `origin/main`, while the local `main` branch
ref was five commits stale at `17b3ba6`. So the detachment is not always visible
as wrong history; check the BRANCH, not just what HEAD points at.

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

**From THIS wake — nothing visual exists to look at.** Every change is markdown
plus two Python comment blocks and one `strftime` in a script that writes a
markdown file. `git diff --stat` lists `LOOPS.md`, `ROADMAP.md`, `STATUS.md`,
`RESUME.md`, `generate_status.py` and `record_iteration.py`. No page's markup
changed at all, which is a stronger statement than a screenshot would have been.
`check:layout` (127 pages) and `test:axe` (127 × 2) swept anyway and were green.
**No visual debt was added; nothing visual was looked at.**

**Non-visual wakes continue.** Not avoidance — rule 4's oldest open items
genuinely are loop machinery — but the two carried-forward visual items have
waited longer again:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has. This wake it agreed
again: one Continue row took Standardize 0 → 1, and the row count moved by
exactly the number of rows recorded.

**NEXT WAKE: rule 4 — Continue, build mode.** Rules 1-3 were all clear this wake
(no open P0, GitHub intake empty at 0 issues, Standardize 0/4, Objective 0/3).
The oldest still-open dispatchable item is now **167.1**, then 167.2, then
168.1. 112.3/112.4 and the AT-runtime item are older but blocked on the owner or
on hardware.

## What landed this wake (2026-08-28, cloud, rule 4 → 164.2)

**164.2 decided: the log row keeps its naive local timestamp.** The decision, its
cost and the two refusals are in `LOOPS.md` Step 0c; every command and figure is
in ROADMAP 164.2 — **do not re-derive them, re-run them.** In one line each:

- **The premise held on re-check** — 3 inversions, unchanged across the 18 rows
  added since the item was filed at 996.
- **The offset would add an ordering the file already has.** Read each naive
  stamp through the author-tz of the commit that introduced it and file order is
  chronological at **1014 of 1014**. The zero is red-proved (inject one
  backwards row → 1).
- **162.1's "recorded exactly, one indirection away" was wrong at the margin,
  and corrected in place.** The sha resolves for 1004 of 1014, never disagreeing
  with blame — but **five rows cite a sha that no longer exists**, rebased away,
  which is what the losing dispatcher does after a collision. `git blame` is the
  exact mechanism, at 1014/1014.
- **`%z` refused, measured by injection**: `dispatch_status.py`'s `ROW` rejects
  such a row and 164.1's reconciliation hard-exits. Backfilling refused too.
- **Fixed in passing**: `STATUS.md`'s `Generated at:` ran **backwards**
  13:15 → 05:31 on this wake — the one naive `now()` that is not latent. It now
  stamps UTC.

## Still open, and why

- **163.1** — adjudicate the ten blocks at exactly one composition. Counts and
  command are in the item; do not re-derive them. **Oldest dispatchable.**
- **167.1** — the loop's own prose growth vs the 158.2 cadence. **Oldest
  dispatchable.**
- **167.2** — `LOOPS.md` rule 3 is 82% archaeology and the file has no archive.
- **168.1** — let the dispatcher say when the chosen direction is blocked. Its
  Accept names a line in THIS file; deliberately not written yet, so 168.1 is
  still a real dispatch rather than a box ticked in passing.
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
