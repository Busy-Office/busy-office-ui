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
two commits landed and were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — THE GIT/BUILD TRAPS, ALL MEASURED

### 1. `git checkout main` — the container starts DETACHED

**Confirmed again this wake**: `HEAD` was `32e24c5` (the pushed tip) on a
detached head, with no local `main` branch at all.

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch. Also note `git checkout <file>`
discards an UNCOMMITTED fix — this wake used it deliberately (see trap 4) and
only because the edits were reconstructible from context.

### 1b. THE BASH WORKING DIRECTORY PERSISTS BETWEEN TOOL CALLS

Recorded last wake, and it bit again this wake: a `cd apps/docs` left the NEXT
command there, and a `git diff <path>` from inside `apps/docs` failed with
*"ambiguous argument … unknown revision or path not in the working tree"*. It
cost nothing (the command was a style spot-check, not a mutation) but the error
message blames the path, not the directory, which is how it wastes time.
**Anchor every command with an absolute `cd`, or none at all.**

### 2. THE CLONE IS SHALLOW — any history measurement is silently 50x wrong

```
git rev-parse --is-shallow-repository     # -> true, on a fresh container
git fetch --unshallow origin              # ~31 seconds
```

The oldest commit the shallow clone holds has no parents and appears to ADD
every file in the repo. **Unshallow before measuring anything from history** —
churn, blame, "in the last N days", a file's age. (This wake measured nothing
from history and so did NOT unshallow; the clone is still shallow.)

### 3. `astro build` does not clear `dist`

An older source tree built over a newer `dist` leaves stale pages behind; the
tell is an *identical* page count across different inputs. `rm -rf
apps/docs/dist` first — this wake did, before every build.

### 4. ⚠ NEW — `npx prettier` IS NOT THIS REPO'S FORMATTER, AND IT REWROTE A FILE

There is **no prettier config and no prettier dependency anywhere in the repo**
(`ls -a | grep -i prettier` and `grep -rn prettier package.json
apps/*/package.json packages/*/package.json` both return nothing). Running
`npx prettier --check` on a docs script therefore fetches prettier from the
network and applies **its defaults**, not the repo's style — the repo writes
single-quoted strings, prettier's default is double.

Measured: `npx prettier --write apps/docs/scripts/report-reach.mjs` turned a
125-line diff into a **196-insertion / 33-deletion** one, almost all of it
re-quoting lines the change never touched. That is exactly the bulk-edit trap
CLAUDE.md documents, arriving through a tool that looks like hygiene.

**Do not run prettier here.** The repo's style enforcers are `stylelint` (CSS
naming) and the gates in `check:repo`; if one of those is quiet about a file,
the file is fine. Recovery this wake was `git checkout HEAD -- <file>` followed
by re-applying the edits by hand, which worked only because they were still in
context.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

**`CHROME_PATH` does not persist between shell invocations** — export it in the
SAME command as the build. Everything ran green this wake: `build -w
@busy-office/ui`, `test -w @busy-office/ui` (137), `docs:build`, `check:claims`
(139), `check:repo`, `check:layout` (127 pages), `test:axe` (127 x 2).

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark.

**From THIS wake — nothing visual exists to look at.** The only code change is
`apps/docs/scripts/report-reach.mjs`, a Node script that prints to stdout. It
renders nothing, ships in no page, and is not imported by any component. The
other change is markdown. `check:layout` and `test:axe` swept all 127 pages at
both widths anyway and were unchanged. **No visual debt was added.**

**Still unlooked-at by a human, carried forward:**

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>` three
  wakes ago. `DsaScore` renders on 38 pages, so if the badge wraps badly it
  wraps in 38 places. First local wake: glance at one component page's
  "Design-system alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes —
  now six wakes back.

## Counters after this wake

```
python3 scripts/loops/dispatch_status.py
  Standardize   1 / 4 Continue round   since 2026-08-27 22:53   ok
  Objective     2 / 3 slices           since 2026-08-27 19:43   ok  [158, 159]
```

Objective did NOT move: 159 was already in its list, and closing 159.1 closes an
item inside a slice it had already counted. **161.4 remains open** — the counter
filters to `Continue` rows only, so a slice closing under `Standardize` is
invisible to it (31 of 110 Standardize rows name a slice; none has ever
counted).

**Rule 4's oldest still-open item is now 160.1 — which is an OWNER CALL, not
dispatchable.** The oldest *dispatchable* item is **161.4**. 112.3/112.4 and the
AT-runtime item are older but blocked on the owner or on hardware.

## What landed this wake

**Continue (rule 4, build mode), item 159.1 — landed.** `report-reach` now
prints a verdict, or an explicit "NO VERDICT RECORDED", for every block it
names. Five blocks were printed bare under "never composed" while all five were
already adjudicated — the verdicts sat in the 2026-08-27 grill and, for two of
them, in a CSS comment no reader of the report would open. That is the exact
state that produced 153.2.

Each verdict was **re-measured before being copied**, per the item's Accept (b),
and two of the three re-measurements corrected the grill's own wording:

- `bo-file-*` — 0 of **28** `*.screen.mjs` match `attach|upload`. The grill said
  "all 27"; it is 27 module screens **plus the suite index**. Zero either way.
- `bo-avatar-stack` — the promotion comment is real but **capitalised**
  (`avatar/avatar.css:40`), so the grill's lowercase quotation greps to nothing.
  The first grep for it returned zero and looked like a refuted premise.
- `bo-tree` — `bo-tree-table` reaches 2 compositions, `bo-tree` 0. Unchanged.

Reconciliation runs both ways over the new entries and was **red-proved with the
injection confirmed each time**: a composed block given a verdict prints "IS
composed 11x — the verdict is refuted"; a renamed entry prints "is not a shipped
block"; deleting `bo-tree`'s entry prints NO VERDICT RECORDED for a block
genuinely in the zero list.

**Also filed: ROADMAP Slice 163 (163.1, OPEN)** — noticed while shipping the
above, left as an entry rather than an extra commit. The report has adjudicated
**7 of 7** zero-reach blocks and **0 of 10** blocks at exactly ONE composition —
and *one* is the number the Objective's principle 3 actually names ("≥2 real,
independent compositions"). This is **not** a claim that any of the ten is a
defect; 153.2 is what happens when a bare count from this report is read as one.
The finding is that nobody has written down which are fine. The item's Accept
says outright that "all ten are correct as they stand" is a satisfying outcome.

## Still open, and why

- **163.1** — adjudicate the ten blocks at exactly one composition. The counts
  and the command are in the item; do not re-derive them.
- **162.1** — how two dispatchers share one queue. "Accept collisions" is a
  valid outcome; what is not acceptable is leaving `LOOPS.md` silent.
- **161.4** — which loops close a slice, for the Objective counter. Command and
  counts are in the item; do not re-derive them.
- **160.1** — OWNER CALL on named products (below).
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

**Noticed, not chased, fourth wake running.** `dispatch_status.py` reports fewer
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
