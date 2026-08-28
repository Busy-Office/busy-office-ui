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

Last updated 2026-08-28 (cloud wake, scheduled routine). Working tree clean;
three commits landed and were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS, ALL MEASURED

### 1. `git checkout main` — the container starts DETACHED

**Confirmed again this wake**: `HEAD` was `e6bf553` (the pushed tip) on a
detached head, with no local `main` branch at all.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch.

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

Recorded twice before, and it bit again this wake: a `cd apps/docs` to run
`check:repo` left the NEXT command there. **Anchor every command with an
absolute `cd`, or none at all.**

### 1c. `CHROME_PATH` DOES NOT PERSIST EITHER — AND THE FAILURE LOOKS LIKE A BUILD BUG

This wake lost a full `docs:build` to it. `npm run docs:build` ran 25 steps,
built every page, indexed search, verified 14,456 links — and died at
`check-boost.mjs` with *"No Chrome/Chromium found"*. `npm error` then printed
the whole 25-command lifecycle script and **nothing else**, so the actual cause
was invisible unless the output was captured to a file and read from the end.

```
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome && npm run docs:build
```

Export it in the SAME command as the build, every time. If a build fails with
an unhelpful `npm error command failed` wall, redirect to a log and read the
lines **above** it.

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~27 seconds this wake
```

The oldest commit the shallow clone holds has no parents and appears to ADD
every file in the repo. **Unshallow before measuring anything from history.**
This wake DID unshallow — three of its four findings are history measurements
(703 revisions of the loop log replayed; per-day commit classification; the
provenance of a number in this very file).

### 3. `astro build` does not clear `dist`

An older source tree built over a newer `dist` leaves stale pages behind; the
tell is an *identical* page count across different inputs. `rm -rf
apps/docs/dist` first — this wake did, before every build.

### 4. `npx prettier` IS NOT THIS REPO'S FORMATTER

No prettier config and no prettier dependency exists here; running it fetches
prettier from the network and applies **its** defaults (double quotes; the repo
writes single). A previous wake turned a 125-line diff into 196 insertions that
way. **Do not run prettier here.** The style enforcers are `stylelint` and the
gates in `check:repo`.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

Everything ran green this wake: `build -w @busy-office/ui`, `test -w
@busy-office/ui` (137), `docs:build` (127 pages, 14,456 links, check-markup
88,726 class uses), `check:repo` (9 gates), `check:claims` (139),
`check:layout` (127 pages), `test:axe` (127 x 2, zero violations).

`sqlite3` is NOT installed in this container. Query the mirror with Python's
`sqlite3` module instead — `python3 -c "import sqlite3; ..."`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark.

**From THIS wake — nothing visual exists to look at.** The only code change is
`scripts/loops/dispatch_status.py`, a Python script that prints to a terminal:
it renders nothing, ships in no page, is imported by no component and is not
part of the docs build. Everything else is markdown. `check:layout` and
`test:axe` swept all 127 pages at both widths anyway and were unchanged. **No
visual debt was added.**

**Still unlooked-at by a human, carried forward:**

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>` four
  wakes ago. `DsaScore` renders on 38 pages, so if the badge wraps badly it
  wraps in 38 places. First local wake: glance at one component page's
  "Design-system alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes —
  now seven wakes back.

## Counters after this wake

```
python3 scripts/loops/dispatch_status.py
  # rerun it — it now reads 991 rows, not 982 (see 164.1)
```

Objective was reset by this wake's grill. **Rule 4's oldest still-open
dispatchable item is 161.4**; 112.3/112.4 and the AT-runtime item are older but
blocked on the owner or on hardware.

## What landed this wake

**Objective (rule 3, fired at 3/3), grill of Slices 158/159/160 — logged.**
Report: `.roundtable/grill-objective-158-161-2026-08-28.md`. Roadmap entry:
Slice 164.

Four findings, three Evidence:

- **A — the instrument that DECIDES did not reconcile.** `dispatch_status.py`
  read 982 of the log's 991 rows and printed a confident number; the nine it
  missed are all `Continue` rows (`owner-decision`, `owner-wishlist` — `(\w+)`
  does not match a hyphen), which is exactly what both counters count.
  **Fixed and red-proved (164.1).** Cost, measured by replaying both parsers
  over all 703 revisions of the log: row count differs on 79, the OVERDUE/ok
  verdict on exactly **one**. Nearly nothing — the defect is the silence.
- **B — two clocks write one log** (164.2, OPEN). `record_iteration.py` writes
  naive `datetime.now()`; the owner's machine is UTC+08, this container is UTC.
  2 adjacent inversions in 990 pairs, both on a cloud/local handover. **Latent
  — all three `ts` consumers were read and none decides on it.** Belongs with
  162.1.
- **C — positive control.** 159's "write the command next to the claim" rule
  paid off one wake later: 160's re-run found its *framing* wrong (two
  populations were four, three kept).
- **D — every open item is about the loop, not the product** (164.3, OWNER
  CALL). Six open; three blocked; all three dispatchable ones are the loop's
  own machinery. Nothing open would change anything a consumer installs.

**Corrected in passing: this file's own number.** The note below used to say
"six legacy rows do not match". It was **nine** at the commit that wrote it and
has been nine since 2026-08-24 — a bare count with no command, carried forward
four wakes. It is now fixed rather than counted.

## Still open, and why

- **164.3** — OWNER CALL: the 2026-08-26 direction (adoption/DX) was discharged
  by Slice 147 and nothing succeeded it. Not a wake's decision.
- **164.2** — whether the log records which clock wrote a row. Pairs with 162.1.
- **163.1** — adjudicate the ten blocks at exactly one composition. The counts
  and the command are in the item; do not re-derive them.
- **162.1** — how two dispatchers share one queue. "Accept collisions" is a
  valid outcome; what is not acceptable is leaving `LOOPS.md` silent.
- **161.4** — which loops close a slice, for the Objective counter. Command and
  counts are in the item; do not re-derive them.
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

## Standing owner instruction (2026-08-27, resolved 2026-08-28)

**No external product is named in any document in this repo** — describe the
mechanism instead, or cite the standard when a finding is normative. Slice 160
asked where the line is and the owner answered: **scrub UX-precedent mentions
only.** Design-system citations, interop hazards (the product name is the
reader's search term) and licence attributions are KEPT, with the reasons in
`check-vendor-names.mjs`'s header. The gate is a denylist and catches regrowth,
not every conceivable name, so the judgement is still yours.
