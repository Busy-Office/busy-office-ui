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

Last updated 2026-08-28 (cloud wake). Working tree clean; four commits landed
and were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS, ALL MEASURED

### 1. `git checkout main` — the container starts DETACHED

**Confirmed again this wake**: `HEAD` was `9d80050` (the pushed tip) on a
detached head, with no local `main` branch at all.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch. Also note `git checkout <file>`
discards an UNCOMMITTED fix; save a copy or commit before injecting a red-proof.
This wake injected two red-proofs into `badge.css` and used `cp` to a backup
outside the tree, then `git status --short packages/core/src` to confirm the
revert — do that, not `git checkout`.

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

New this wake, and it produced a `cp: cannot stat` on a file that plainly
exists. A `cd apps/docs` in one command leaves the NEXT command there. It cost
nothing here only because the failing command was the *first* half of a
red-proof injection; had it been the revert half, `badge.css` would have been
left modified. **Anchor every command with an absolute `cd`, or none at all.**

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~31 seconds
```

The oldest commit the shallow clone holds has no parents and appears to ADD
every file in the repo. Before the unshallow, a 24-hour `git log --numstat` over
`apps/docs/src/pages` reported **+23,926/-39**; the truth is **+482/-90**.
Nothing errors. **Unshallow before measuring anything from history** — churn,
blame, "in the last N days", a file's age. (This wake measured nothing from
history and so did NOT unshallow; the clone is still shallow.)

### 3. `astro build` does not clear `dist`

An older source tree built over a newer `dist` leaves stale pages behind; the
tell is an *identical* page count across different inputs. `rm -rf
apps/docs/dist` first — this wake did, before every build.
Also: `git checkout <sha> -- <dir>` only adds and updates, so use
`rm -rf <dir> && git checkout <sha> -- <dir>`, then `git reset -- <paths>`.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

**`CHROME_PATH` does not persist between shell invocations** — export it in the
SAME command as the build. Everything ran green this wake: `build -w
@busy-office/ui`, `test -w @busy-office/ui` (137), `docs:build`, `check:claims`
(139), `check:repo`, `check:layout` (127 pages), `test:axe` (127 x 2), plus a
`DOCS_BASE=/busy-office-ui` build and a plain rebuild after it.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark.

**From THIS wake** — four docs edits, all link/cite TEXT inside components that
already existed (three `Related` labels, one `dsa-scores.json` cite). No CSS, no
layout, no colour. `check:layout` and `test:axe` swept all 127 pages at both
widths. The labels grew by one word each, which is why `report:prose`'s corpus
total moved 104,408 → 104,411 — reconciled, not assumed. **Still not the same as
having looked**; a first local wake could glance at `/components/data-table`'s
Related row, though the risk is close to zero.

**Still unlooked-at by a human, carried forward:**

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>` two wakes
  ago. `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in
  38 places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes —
  now five wakes back.

## Counters after this wake — READ THEM, and note 161.4

```
python3 scripts/loops/dispatch_status.py
  Standardize   0 / 4 Continue rounds since 2026-08-27 22:53   ok
  Objective     2 / 3 slices          since 2026-08-27 19:43   ok  [158, 159]
```

Standardize ran this wake and reset to 0/4. **Objective still reads 2/3 even
though Slice 161 closed** — that is item **161.4**, opened this wake: the
counter filters to `Continue` rows only, and this slice landed under
`Standardize`. Measured, not assumed: **31 of 110 Standardize rows in the whole
log name a slice number, and none has ever counted.** Not fixed here, because
widening the filter changes when Objective preempts the build queue and this
file records that being wrong in either direction has cost real time.

So: rule 3 does not fire on the current reading. **Rule 4's oldest still-open
item is 159.1** — unchanged from last wake, since this wake was rule 2.

## What landed this wake

**Standardize (rule 2), Slice 161** — first run of the two-sweep step 1 that
158.2 installed, and the sweep that was NOT on the list is the one that found
something.

- **161.1** — `scan:dead-style` clean (0 dead of 1,428 live). Three prose
  verdicts recorded for the pages the FAMILY median flags:
  `/concepts/js-behaviors/` (74% generated → the instrument),
  `/base/motion/` (0.97x the CORPUS median → the instrument, and `/base/`'s n=6
  median is what is wrong), `/concepts/design-language/` (honest coverage, the
  one to watch — 0 generated, 1.5x density, and it is the page other pages are
  measured against). Per-page detail reconciled against `report:prose` on three
  totals AND reproduced 158.1's corpus median of 103 w/h2 exactly.
- **161.2** — `invoice-list`, the one pattern name the owner rule refused, was
  still the visible label in **four** reader-facing places (3 `Related` labels
  + the `filters.fit` DSA cite). Fixed; verified against `dist`, not the diff.
  **The gate was refused on a measured base rate**: 90 of 428 Related links
  (21.0%) legitimately disagree with their target's title, because the label
  carries the link's REASON. Nothing but reading would have caught this.
- **161.3** — LOOPS.md's "Settled" section asserted **three** repeated CSS rule
  bodies and, in the same breath, that the count was cheap to re-measure "in one
  command" — while recording no command. It is **eight**. `npm run
  report:css-repeats -w @busy-office/ui` is that command now, reconciled against
  an independent regex pass and red-proved both ways. Its own first run was
  wrong (postcss keeps `!important` off `decl.value`), which is the base rate
  holding. **No verdict changed** — all eight repeats are correct; LOOPS.md now
  carries the table and states the verdict as a RULE, which is what let five
  siblings sit unrecorded.
- **161.4 (OPEN)** — the counter finding above.

## Still open, and why

- **161.4** — which loops close a slice, for the Objective counter. Command and
  counts are in the item; do not re-derive them.
- **159.1** — `report-reach` prints the verdict where one exists. The verdicts
  already exist in `.roundtable/grill-objective-149-152-2026-08-27.md`; do not
  re-derive them, and do not make them a third exemption bucket.
- **160.1** — OWNER CALL on named products (below).
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

**Noticed, not chased, third wake running.** `dispatch_status.py` reports fewer
iterations than `rebuild_from_log` — its `ROW` regex requires `\w+` for both
loop and mode, so six legacy rows do not match. Does not affect either
counter's verdict.

## Standing owner instruction (2026-08-27)

**No external product is named in any document in this repo.** Describe the
mechanism instead ("a high-traffic market-data site", "an open-source ERP
desk"), or cite the standard when a finding is normative. Enforced by
`check:vendor-names` in `check:repo` — it is a denylist and therefore catches
regrowth, not every conceivable name, so the judgement is still yours. **Slice
160 measures exactly how far past the denylist this reaches and asks the owner
where the line is; until that is answered, do not scrub design-system
citations.**
