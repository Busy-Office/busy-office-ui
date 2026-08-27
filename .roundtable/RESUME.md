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

Last updated 2026-08-27 19:55 UTC (2026-08-28 03:55 +08). Working tree clean;
four commits landed and were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — `git checkout main` IS A TRAP HERE

**The container starts on a DETACHED HEAD at the pushed tip, while the local
`main` ref is STALE.** This wake found it the expensive way:

```
HEAD (detached)      3d534c0   <- the previous wake's work, already on GitHub
refs/heads/main      17b3ba6   <- 7 commits behind
refs/remotes/origin/main 17b3ba6   <- also stale until you fetch
```

`git checkout main` therefore moves the wake **backwards onto older history**,
silently. It looked like data loss — `loop-log.md` lost five lines, and
`git ls-remote` disagreed with `origin/main` — before the cause was clear.

**Do this instead, before committing anything:**

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch. Recovery, if you have already
committed onto the stale branch: `git branch backup-wrong-base`, reset onto the
fetched tip, re-apply by patch, and **check every patch applies cleanly** — a
`git stash pop` across the two bases auto-merged `ROADMAP.md` and the result had
to be redone by hand.

Also note `git checkout <file>` discards an UNCOMMITTED fix. One red-proof
injection was reverted that way and the fix went with it; save a copy first, or
commit before injecting.

## ⚠ THIS WAS A CLOUD WAKE — NOTHING WAS VISUALLY VERIFIED

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark. **This wake carries no visual risk, and that is structural rather than
asserted: not one line of CSS, component markup or docs page was touched.** The
four commits are two Python loop scripts, one new Node report script, one npm
script entry, and markdown.

**Chromium is available in cloud wakes** — set
`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and run
`npm ci` first (the container starts with no `node_modules`). Everything ran
green from it this wake: `build -w @busy-office/ui`, `test -w @busy-office/ui`
(137 tests), `docs:build`, `check:repo`, `check:claims` (139 behaviours),
`check:layout` (127 pages), `test:axe` (127 pages x 2 widths).

**Still unlooked-at by a human, carried forward from two wakes back:** the
`#markers` table on `/components/data-table` at 390px, both themes. Untouched
again this wake.

## Counters after this wake

```
Standardize   2 / 4 Continue rounds   ok
Objective     1 / 3 slices            ok   [159]
```

Rule 3 fired this wake and is now reset. **The next wake falls through to rule 4
— the oldest still-open item, which is `158.1`.** Its premise has just been
re-measured and its Accept criteria rewritten, so it is ready to build: run
`npm run docs:build && npm run report:prose -w docs` first and work the list
that run prints, not the twelve rows now in the roadmap.

## What landed this wake

**Objective (rule 3, at 3/3), grilling 151/153/157.** Report:
`.roundtable/grill-objective-151-153-157-2026-08-28.md`. Half the window was
refusals, and the two split cleanly — 151.3 refused *on principle* with its
premise intact, 153.2 because *its premise was false*.

1. **An Accept criterion must make re-checking a measured premise part of
   done.** Both premise-false refusals cited a measurement with no command
   recorded, so neither could be re-run. 149.1 is the control: same shape of
   error, cost nothing, because its criterion said *"each of the four either
   uses `bo-progress` **or** records a one-line reason it should not"*. Written
   as an amendment to CLAUDE.md's existing Accept-criterion section, not a new
   one — 158.2 has the loop's prose growth open as an item.
2. **A gate for 157.3's shape: refused, with two dead instruments recorded.**
   The split-family detector fires on the pre-condition, before the bug exists
   (3 of 15 families, 0 defects). The asymmetry detector reports **zero on the
   commit that carried the live bug**, because 157.2 left the family with one
   member and a family of one cannot be asymmetric. Do not rebuild either.
3. **159.2, P0, fixed same wake.** `rebuild_from_log` — the *recovery* path —
   was what corrupted the mirror: `parse_log_line` read all six fields from the
   left, so 151.1's line quoting `'Overdue · edited'` rebuilt with the item's
   own prose in its `outcome` column. The write path was always correct. Fields
   now read from the ends; the rebuild reconciles bullet-count and
   post-enforcement vocabulary and refuses **before** the DROP so the previous
   mirror survives; `parse_log_line` self-tests on every run. All three
   red-proved with the injection confirmed.
4. **`report:prose`** — 158's baseline made re-runnable, and it was wrong: 118
   documentation pages not 107 (`/base/` and `/reference/` were missing from the
   old instrument), and **twelve** pages over 2x the median, not seven.

Four things worth carrying forward:

- **159.1 is queued and cheap.** Seven blocks have ever read zero reach and all
  seven are adjudicated not-a-defect, but the report prints five of them bare.
  The verdicts already exist in
  `.roundtable/grill-objective-149-152-2026-08-27.md`; do not re-derive them,
  and do not make them a third exemption bucket.
- **An instrument's first output is not evidence, again — twice in one wake.**
  `report-prose`'s own chrome alarm could not fail (swapping `<main>` for
  `<body>` moved the median 739 → 1034 and it stayed silent), and the asymmetry
  detector reported zero on the very commit it was built for. Both caught by
  red-proving, neither by review.
- **Noticed, not chased:** `dispatch_status.py` reports 968 iterations where
  `rebuild_from_log` reports 974 — its `ROW` regex requires `\w+` for both loop
  and mode, so six legacy rows do not match. Pre-existing, does not affect
  either counter's verdict (both sum `loop == "Continue"` rows that do match),
  and left alone deliberately rather than turned into busywork. If a wake ever
  needs an exact iteration count from that script, this is why it disagrees.
- **`__pycache__/` was already ignored** by the previous wake — a change this
  wake proposed and then found upstream, which is what being on stale history
  looks like from the inside.

## Still open, and why

- **158.1 / 158.2** — the prose-length verdicts. Next by age. 158.1's premise is
  now current and its criterion names the property rather than a count.
- **159.1** — `report-reach` prints the verdict where one exists.
- **112.3** — the pattern-fit pilot. BLOCKED ON OWNER: needs 5–8 owner-written
  screen briefs with sealed picks; scaffold ready at `.roundtable/pilot-112/`.
- **112.4** — Screen Contract layer, gated on 112.3's verdict.
- **AT runtime evidence** — needs a human listening to a screen reader.

**One decision waiting, not a roadmap item.** `@busy-office/create-ui` is built,
gated and committed but **NOT published**, so `npm create @busy-office/ui` works
only from this repo. Publishing is owner-triggered, as every release is.

## Standing owner instruction (2026-08-27)

**No external product is named in any document in this repo.** Describe the
mechanism instead ("a high-traffic market-data site", "an open-source ERP
desk"), or cite the standard when a finding is normative. Enforced by
`check:vendor-names` in `check:repo` — it is a denylist and therefore catches
regrowth, not every conceivable name, so the judgement is still yours.
