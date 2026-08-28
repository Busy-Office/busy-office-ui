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

Last updated 2026-08-28 (cloud wake, scheduled routine — **Standardize**).
Working tree clean; two commits landed and were pushed as one batch.

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

**From THIS wake — nothing visual exists to look at, and this is the THIRD
consecutive wake for which that is true.** The code changes are two build-time
Node generators and `dispatch_status.py`; none renders, ships in a page, or is
imported by a component. `gen-rf-profile.mjs`'s output is **byte-identical**
before and after — so no page's markup changed at all, which is a stronger
statement than a screenshot would have been and is the one being made here.
Everything else is markdown. `check:layout` and `test:axe` swept all 127 pages
at both widths anyway and were unchanged. **No visual debt was added; nothing
visual was looked at.**

**Three consecutive non-visual wakes is itself worth noticing.** It is not
evidence of avoidance — rule 4's oldest open items genuinely are loop machinery
(164.3 says so outright) — but the two carried-forward visual items below have
now waited five and eight wakes respectively.

**Still unlooked-at by a human, carried forward:**

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>` **five**
  wakes ago. `DsaScore` renders on 38 pages, so if the badge wraps badly it
  wraps in 38 places. First local wake: glance at one component page's
  "Design-system alignment" heading at 390px.
- The `#markers` table on `/components/data-table` at 390px, both themes —
  now **eight** wakes back.

## Counters after this wake

```
python3 scripts/loops/dispatch_status.py
  # Standardize 0 / 4 Continue rounds   ok       <- reset by this wake's sweep
  # Objective   2 / 3 slices  [161, 166]  ok     <- 166 visible only after 166.5
```

**NEXT WAKE: rule 4.** Both counters are below threshold, so no counter rule
preempts. Rule 4's oldest still-open dispatchable item is **162.1**, then
163.1, 164.2, 165. 112.3/112.4 and the AT-runtime item are older but blocked on
the owner or on hardware.

**Objective is one slice from firing.** The next Continue or Standardize round
that names a new slice takes it to 3/3, and rule 3 sits above rule 4 — so the
wake after next is likely Objective, not a build.

**Do NOT re-verdict the prose outliers.** The previous handover named
`/base/motion/`, `/concepts/js-behaviors/` and `/concepts/design-language/` as
"the three nobody has verdicted"; **161.1 had already verdicted all three**, in
the very run that wrote the note. Every page `report:prose` flags today carries
a verdict from 158.1 or 161.1. Corrected here rather than carried forward
again.

**The `[161]` is NOT evidence the 161.4 fix does anything, and the first draft
of this note said it was.** Run in place against the identical log, the old
parser reads `1 / 3 [161]` too — the 161 comes from this wake's own Continue
row, which opens `161.4 …` in the bare form the old regex already matched. The
difference that looked convincing came from `git stash` reverting
`loop-log.md` **along with** the script, so the two parsers were compared
against two different logs.

Worth carrying forward as a trap, since it will recur: **`git stash` is not a
way to A/B one file in a dirty tree.** Extract the old version to a probe file
*in the same directory* — `_common.LOG` resolves relative to the script — run
both against the one live log, and delete the probe. The fix's effect is real
and is measured over the whole log's history (18 → 23 crossings); it is simply
not visible in today's two-row window.

Objective was reset by the 2026-08-28 grill and still reads 0/3.
**Rule 4's oldest still-open dispatchable item is now 162.1** (161.4 closed);
then 163.1, 164.2, and the newly filed 165. 112.3/112.4 and the AT-runtime item
are older but blocked on the owner or on hardware.

## What landed this wake (2026-08-28, cloud, Standardize → Slice 166)

**Slice 166 CLOSED — the sweep came back clean, and both findings were things
the sweep tripped over rather than looked for.**

- **166.1** three rot-guards clean: `scan:dead-style` 0 dead of 1,428;
  `report:css-repeats` 8 repeats, matching LOOPS.md's table on all three totals
  — **no delta, so no finding**; `report:prose` no unverdicted page (see the
  correction under Counters).
- **166.2** `gen-rf-profile.mjs` held a **fourth copy** of the alias
  `extract-api.mjs` publishes as "the SINGLE source" while naming two readers.
  Drifted both ways, never collided (the maps key on dirs vs file stems), all
  14 hrefs resolved — no user-visible defect. Now derived. **Output
  byte-identical**, which is why `rf-profile.json` is absent from the diff.
- **166.3** two comments were false and are corrected.
- **166.4/166.5** below.

**Two instruments were wrong on their first output, in one wake.** That is
CLAUDE.md's stated base rate, and it is worth reading as confirmation rather
than as bad luck:

- 166.4's re-scan compared key sets for **equality** and reported 0 — it would
  have reported 0 on yesterday's tree too, since the drifted map had seven keys
  against three. Rewritten to test overlap and red-proved against
  `git show HEAD:` of the pre-change file.
- 166.5's replay harness read **61** crossings where `dispatch_status.py`'s own
  header publishes **23** for the unchanged parser. Unreconciled, so **no
  cadence figure was quoted anywhere** — not in the script, not in ROADMAP, not
  in LOOPS.md. If a later wake wants that number, the harness needs fixing
  first; do not quote the 61.

**166.5 is the one to carry forward.** The slice parser went blind a **fifth**
time, on a third log convention (`166 — …`, `119: …`). What exposed it was
running `dispatch_status.py` immediately after `record_iteration.py` and seeing
the counter disagree with the row just written. **That comparison has now found
two of the five recurrences — do it every wake.** The first draft of the fix
would have read `4-tick sweep: …` as slice 4 across 18 rows, making the counter
fire early; a parser change that reports MORE is not self-evidently a fix.

## What landed in an earlier wake (2026-08-28, cloud, Continue → 161.4)

**161.4 CLOSED.** Which loops close a slice: **Continue + Standardize**.
Roadmap/Explore/Objective excluded, the last two measured before being refused
(adding both moves the log's crossing count 23 → 23). Decision, per-loop counts
and the replayed cadence are in `LOOPS.md` rule 3 and `dispatch_status.py`'s
comment — **do not re-derive them, the commands are there.**

**The item's premise was right and was the smaller half.** The same run found a
FOURTH instance of that counter's regex going quietly blind: the log uses two
conventions, `164.1 …` and `Slice 84: …`, and the parser saw only the first —
302 bare rows against **141 prose**, 99 distinct slices against a union of
**144 of the 146** in ROADMAP.md. Replayed: the count crosses 3 **18** times
before, **22** on the format fix alone, **23** with Standardize. `slice_of` now
ships `--self-test`, red-proved both ways.

**The counter still reads 0/3 and that is correct**, not a failed change — only
two rows follow the last Objective round and neither names a slice.

**Filed, not done: Slice 165 — the archive sweep is due again.** 2,488 of
ROADMAP.md's 3,882 lines (64%) are 17 closed slices that were never moved; the
file was at 1,094 on 2026-08-25. Rule 4 walks all of it every wake. The command
is in the item. **Do it by hand** — the last case-collision on this exact pair
of files destroyed 7,307 lines silently.

## What landed in an earlier wake

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
  Every inversion sits on a cloud/local handover and the count grows by one per
  handover — the command is in 164.2; do not quote a fixed number (this wake's
  first draft did, and it was wrong in both numerator and denominator).
  **Latent — all three `ts` consumers were read and none decides on it.**
  Belongs with 162.1.
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
- **165** — the archive sweep. Re-run with 166 added to the OPEN set: still
  **17 closed slices, 2,488 lines**, and `ROADMAP.md` is now **4,131 lines**
  (3,882 when 165 was filed one wake ago — this slice added 249). By hand; the
  last case-collision on this file pair destroyed 7,307 lines silently.
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
