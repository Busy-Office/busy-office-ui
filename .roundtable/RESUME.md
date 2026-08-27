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

Last updated 2026-08-27 20:55 UTC. Working tree clean; two commits landed and
were pushed as one batch.

## ⚠ READ FIRST IF THIS IS A CLOUD WAKE — `git checkout main` IS A TRAP HERE

**The container starts on a DETACHED HEAD at the pushed tip, while the local
`main` ref is STALE.** Confirmed again this wake: `HEAD` was `de0c814` (the
pushed tip) while `refs/heads/main` sat at `17b3ba6`, seven commits behind.

**Do this instead, before committing anything:**

```
git fetch origin main && git checkout -B main origin/main
```

`git ls-remote --heads origin` is the authority on what is actually pushed; the
local `origin/main` ref is not, until a fetch. Following the recipe above took
about ten seconds this wake and cost nothing — it is only expensive if skipped.

Also note `git checkout <file>` discards an UNCOMMITTED fix; save a copy or
commit before injecting a red-proof.

## Cloud-wake toolchain — what works, in order

```
npm ci                                                    # no node_modules at start
export CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome
```

**`CHROME_PATH` does not persist between shell invocations** — each `Bash` call
is a fresh shell, and `npm run docs:build` fails partway (after Astro renders,
in a browser gate) without it. Export it in the SAME command as the build.
Everything ran green from there this wake: `build -w @busy-office/ui`,
`test -w @busy-office/ui` (137), `docs:build`, the `DOCS_BASE=/busy-office-ui`
build, `check:claims` (139), `check:layout` (127 pages), `test:axe` (127 x 2),
`check:repo`.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark. **Unlike the previous wake, this one DID touch two docs pages**, so the
risk is not structurally zero:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`. That is
  the identical construction 41 component pages already ship from
  `ClassRef`/`ApiTable`, and `check:layout` (127 pages, 390px and 150% zoom)
  and `test:axe` (127 x 2 widths) are green — but **nobody has looked at it**.
  `DsaScore` renders on 38 pages, so if the badge wraps badly it wraps in 38
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px.

**Still unlooked-at by a human, carried forward from three wakes back:** the
`#markers` table on `/components/data-table` at 390px, both themes.

## Counters after this wake

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [158, 159]
```

**The next Continue round is the 4th, so rule 2 preempts and the next wake
dispatches Standardize**, not the next build item. Its playbook's step 1 wants
`npm run scan:dead-style -w docs` — that sweep is not a CI gate on purpose, and
reaching Standardize every 4th round is the only thing that keeps it from
rotting.

After that, rule 4's oldest still-open item is **158.2** (the loop's own prose
discipline; Accept is "a decision either way, recorded", and refusing is
explicitly valid). This wake handed it real evidence — see below.

## What landed this wake

**Continue (rule 4), 158.1 — twelve prose-outlier verdicts.** Re-ran
`report:prose` first per 159's rule; the premise held (same twelve pages).
Tally: **9 honest coverage, 3 instrument, 0 removable, 0 component rethink.**

1. **`report:prose` now prints three things it did not.** Working the twelve by
   hand produced facts a single total cannot show, and 159's rule says the
   command belongs next to the claim:
   - `authored + generated` per outlier — **a fifth to a third of every
     component outlier is machine-written** (ApiTable + ClassRef + DsaScore +
     the which-pattern index). `/components/combobox` is 34% generated; its
     authored prose is 1.3x the median and would not be an outlier at all.
   - `hidden` at load — **530 of `/components/tabs`' 1,491 words**, in 21 of
     its 24 demo tab panels. Everywhere else it is 3 (the TOC aside).
   - **per-family medians**, 346 (`/base/`) to 1,023 (`/reference/`), a 3x
     spread. One corpus threshold flags `/reference/` pages for being
     reference pages.
2. **`DsaScore` was missing the `generated` badge** its own header comment
   claims it follows — on all 38 scored pages, worth 140-215 words each read as
   authored prose. Fixed, which is what makes the new split exact rather than a
   heading-text guess. `/concepts/which-pattern` gained one too: 2,015 of its
   2,325 words are read from `patterns.json`.
3. **Slice 160, triaged not fixed.** `check:vendor-names` passes and is correct;
   it is a denylist of seven names that have occurred. Measured beyond it: 8
   consumer-app mentions in 4 files (one a shipped CSS comment) and **45
   design-system / ERP-suite citations** — and LOOPS.md's Research playbook
   names those same sources as the ones to cite. Two populations, plausibly
   opposite answers, so it is an OWNER CALL and nothing was scrubbed.

Four things worth carrying forward:

- **158.2 now has its evidence, and it points at refusing.** The three
  instrument findings say the loop's pages are not as long as the number
  claimed, and the cross-page duplication sweep found **11 repeated sentences
  in 2,558** — nothing cuttable. The one page where the density signal is real
  is `/concepts/layouts` (0 generated, median chunk count, 2.1x the median
  words per chunk), which is exactly where the owner's +283-lines-in-24-hours
  delta landed. A decision that says "measure per family, watch layouts, refuse
  a budget" is supportable from what is now committed.
- **An instrument's first output is not evidence — the red-proof itself was the
  instrument that failed this time.** Stripping `<span class="bo-badge">generated</span>`
  from a built page left 680 words behind and looked exactly like a detector
  that could not read the badge. ApiTable's badge says "generated from CSS".
  The injection was wrong, not the detector. Confirm the injection took effect
  *and* that it took effect completely.
- **"Stripe: 19" was zebra stripes.** A case-insensitive product-name sweep
  reported it; word-boundary, case-sensitive matching found the real 8. The
  tidy-looking number was the tell, and it nearly went into Slice 160 as a
  fact.
- **Noticed, not chased (still true from last wake):** `dispatch_status.py`
  reports 971 iterations where `rebuild_from_log` reports more — its `ROW`
  regex requires `\w+` for both loop and mode, so six legacy rows do not match.
  Does not affect either counter's verdict. Left alone deliberately.

## Still open, and why

- **158.2** — the loop's own prose discipline. Next by age after Standardize
  preempts; evidence assembled above.
- **159.1** — `report-reach` prints the verdict where one exists. The verdicts
  already exist in `.roundtable/grill-objective-149-152-2026-08-27.md`; do not
  re-derive them, and do not make them a third exemption bucket.
- **160.1** — OWNER CALL on named products (above).
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
regrowth, not every conceivable name, so the judgement is still yours. **Slice
160 measures exactly how far past the denylist this reaches and asks the owner
where the line is; until that is answered, do not scrub design-system
citations.**
