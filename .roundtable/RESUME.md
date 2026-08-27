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

Last updated 2026-08-27 19:00. Working tree clean apart from the generated
`STATUS.md` / `loop-log.md` the recorder rewrites. The Standardize sweep landed
in three commits and reached its exit condition (a clean pass).

## THE NEXT WAKE DISPATCHES OBJECTIVE — read this before Step 2

```
Standardize   0 / 4 Continue rounds   ok        (fired and cleared this wake)
Objective     3 / 3 slices            OVERDUE   [151, 153, 157]
```

Rule 2 fired this wake and is now reset. **Rule 3 is still overdue and is now
the first match** — it sits above the queued-build-item rule precisely so a
build item cannot keep skipping it, which is the failure this file has recorded
three times about Objective specifically. Do not fall through to rule 4.

After Objective clears, the oldest open item by age is **158.1**.

## ⚠ THIS WAS A CLOUD WAKE — NOTHING WAS VISUALLY VERIFIED

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and
dark. **This wake carries no visual risk, and that is measured rather than
asserted:** two of three commits are script-only, and the third's CSS half is
comments only, proved both directions —

- the comments DID reach the shipped un-minified CSS (3 in `dist/css/index.css`,
  1 in `dist/css/components/stepper.css`), so the edit is real, not a no-op;
- all **14 minified stylesheets are byte-for-byte identical** across a build
  from the stashed tree and a build from this one, so nothing a browser renders
  changed.

**Chromium is available in cloud wakes** — set
`CHROME_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome`, and run
`npm ci` first (the container starts with no `node_modules`). Every browser
gate ran from it this wake: check:claims (139 behaviours), check:layout (127
pages), check:scroll (906 containers x 2 widths), test:axe (127 pages x 2
widths), check:quickstart, scan:dead-style.

**Still unlooked-at by a human, carried forward from the previous wake:** the
`#markers` table on `/components/data-table` at 390px, both themes. Untouched
this wake.

## What landed this wake (Standardize, dispatcher rule 2)

Four rounds, ending on a clean pass. The theme is **chokepoint regrowth** — a
shared module extracted by an earlier sweep, then bypassed again.

1. **29 viewport literals** back to `viewports.mjs`, across four scripts
   (check-scroll's `const WIDTHS = [1440, 390]` shadowing the export name;
   check-claims x25; check-quickstart x2; scan-dead-style x1). New
   `check:viewport-forks` (`@heuristic`, `--self-test`, in `check:repo`) holds
   the line, reading the widths FROM viewports.mjs rather than storing a copy.
2. **check-versions.mjs** reported `${snapshots.length} snapshot(s) verified`
   with no zero-guard, reading the count from a file — `"snapshots": []` was a
   silent pass in the one gate whose job is catching a release slip.
3. **The visually-hidden triple** settled in LOOPS.md next to the 0fr/1fr
   precedent, and all three copies cross-referenced.
4. **`source-files.mjs`'s SKIP_DIRS** was a second copy of `SOURCE_SKIP_DIRS`,
   disagreeing by three entries.

Four things worth carrying forward:

- **Importing a constant is not using it.** check-claims imported `WIDTHS`,
  `DESKTOP_WIDTH` and `NARROW_WIDTH` and then hardcoded 25 viewports anyway. No
  convention, and no import-list check, can see that — which is why it landed
  as a gate.
- **A gate must not store its own copy of the thing it polices.**
  `check:viewport-forks` reads the widths from `viewports.mjs`; a private copy
  would be the very fork it hunts and would go stale the day the pair changes.
  Red-proved on both branches (re-inject the real fork → red; rename the export
  → red on the parse, not a sweep for a needle it never found).
- **Checking before claiming killed three findings.** check-layout and
  axe-audit look unguarded but get their pages from `distPages()`, which throws
  on zero; check-search's hand-rolled luminance already carries its refusal (it
  runs inside `page.evaluate` and cannot import a Node module); po-app's walker
  has nothing to over-count. The first read of each was wrong.
- **A gate was measured and REFUSED**, with the reasoning stored in
  `source-files.mjs` so it is not re-proposed: a skip-list-fork detector has a
  base rate of one true signal against two exceptions. Ceremony, not a gate
  (roadmap 94.11).

## Still open, and why

- **158.1 / 158.2** — the prose-length verdicts. Next by age once Objective
  clears. **158.1 must not quote 4,429 words as current** for
  `/components/data-table`; the previous wake added +337 reader-facing words to
  it and that baseline was never re-measured.
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
