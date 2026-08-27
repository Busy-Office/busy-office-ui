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

Last updated 2026-08-27 15:45, HEAD `6e25b0e`. Working tree clean apart from
`layout.js` (see below). Every gate green: 136 behavior tests, 132 live claims,
full docs build, plus the CI-only sweeps `test:axe` (127 pages x 2 widths) and
`check:layout`. npm serves **0.5.0**.

**Pushed, and green.** The 32-commit backlog from Slice 149 through 154 went out
in one push (`8437e3a`). CI passed in 3m26s and the Pages deploy succeeded — the
first time either has seen any of it.

**⚠ Two workflow runs from 2026-08-26 have been stuck `queued` for 16+ hours**
(CI `32985176430`, Deploy `32985737608`), plus one `startup_failure`. They are
superseded by this push and will never run, but they mean **nothing between
2026-08-26 15:16 and today was ever CI-validated** — a wider gap than the
previous handover implied. They are noise in `gh run list`; cancelling them is
an owner call, not a loop one.

**`layout.js` at the repo root is TRIAGED INPUT, not abandoned work.** It is an
897-line form-layout engine from an open-source ERP desk framework, dropped
there for review. Slice 154 triaged it; it is deliberately never committed
(third-party source), and per the standing owner instruction the product is not
named anywhere in this repo. **Do not re-triage it** — and do not treat the
dirty tree it causes as an interrupted slice. Deleting it is safe.

**The backlog is NOT halt-blocked.** Three dispatchable items, oldest first:

- **151.3** — ordinal values (priority/severity/risk read as ranked, and
  `bo-badge` has tone but no ordinal channel). Recorded as a **RETHINK**:
  a `--priority` modifier serves one scenario and principle 2 refuses it on
  sight; the open question is whether *ordinality* is general enough to earn one
  general mechanism. **Refusing is a valid outcome** — the suite shows badges on
  23 of 27 screens and has never asked for rank.
- **153.1** — teach `report-reach.mjs` its fourth meaning: a runtime container
  (`bo-toast-region`) cannot appear in a static composition corpus, so listing it
  beside `bo-date` invites a misreading.
- **153.2** — `bo-date` is the one real reach miss: 21 of 27 suite screens render
  a date as a plain string like `'01 Oct'`. **The screens change, not the
  component**, and per 149.1's precedent refusing per screen with a reason is a
  valid outcome.

**One docs container, and it is the bind-mounted one.** Two were running: a
stale image on `:8081` (baked 2026-08-26 21:55, no mounts, served 200s and
therefore looked fine) and the current bind-mounted one on `:8091`. A wake
following `LOOPS.md`'s documented port would have screenshotted 18-hour-old
content and believed it — it briefly misled this wake. Both were removed and
replaced by a single `bo-docs-run` on **:8081**, bind-mounted to
`apps/docs/dist` exactly as `LOOPS.md` specifies, so the doc and reality now
agree. Recreate with the command in LOOPS.md if it is gone. **Confirm a served
page carries your change before trusting a screenshot** — `vs-dock` on
`/patterns/validation-summary/` is this wake's marker.

**Still owner-blocked, unchanged** — do not try to work around these:

- **112.3** — the pattern-fit pilot. Needs 5–8 owner-written screen briefs with
  sealed picks; scaffold ready at `.roundtable/pilot-112/`.
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

## What landed 2026-08-27

`.roundtable/loop-log.md` has every iteration; the short version:

- **149** — two research runs triaged. Mostly refusals; the one P0 was **149.4**:
  `job-monitor` and `notification` documented auto-updating content with no way
  to pause it (WCAG 2.2 SC 2.2.2 has **no five-second grace for numbers**). The
  two pages got deliberately *different* answers. **149.1** adopted `bo-progress`
  on one screen and refused it on three — a reorder point is a **floor**, not a
  ceiling, so a progress bar there is semantically wrong.
- **150 / 153** — two Objective grills. The suite is blind to components it *can*
  express but nobody reaches for. Of seven zero-reach blocks **only `bo-date` is
  a real defect**; a gate would have been wrong 6 of 7, which is why
  `report-reach` reports and never fails.
- **151** — triaged from an owner screenshot. **151.1 was refused as already
  shipped**: `/patterns/list-report` has the whole saved-views mechanism and
  beats the reference (views carry counts, a view *is* a URL, the dirty marker is
  the word "edited" rather than a bare `*`). **151.2** shipped a self-explaining
  column and uncovered a real bug — a top-layer panel was inheriting its DOM
  parent's uppercase and `nowrap`.
- **152** — every shell now has a copyable template on `concepts/layouts`, and
  the page hand-maintains *less* than before. Surfaced that **split
  master-detail has no shipped primitive**.
- **Standardize** — one `source-files.mjs` replaced two hand-rolled source walks
  written the same day with different skip lists; proven behaviour-neutral by
  diffing output and file sets.

## Slice 154 (2026-08-27) — triaged from a reference form-layout engine

Both items shipped in one wake. The finding is worth keeping in mind beyond
the fix: **the framework could hide the very thing it had just told the user to
fix.** A `required` control inside an inactive tab panel, a closed `<details>`
or a collapsed widget still blocks submit, so `initValidationSummary()` listed
it — and the link it handed over silently did nothing.

- **A third container turned up mid-build and fails WORSE than the two the item
  named.** `.bo-widget__collapse[data-state="closed"]` clips instead of
  un-rendering, so `.focus()` *succeeds* into a 0px `overflow: hidden` box.
  Focus moves somewhere invisible with no way to find it. A fix scoped to the
  two named containers would have looked complete.
- **`reveal(el)` verifies its own press.** It reveals by clicking each
  container's own control so the owning behavior keeps `aria-selected` /
  `aria-expanded` correct — then checks the container actually opened. That
  check exists because the first version reported success while doing nothing:
  the tabs delegation matches `.bo-tabs__tab[role=tab]`, and the repro's tabs
  had `role` but not the class.
- **Five mechanisms from the reference were refused with reasons** (Tab-key
  takeover, alt+hover fieldnames, colour-named message block, auto-hiding empty
  sections, scroll-direction tab strip). One question is left OPEN rather than
  half-decided: the reference's whole shape is a **tabbed detail form**, and no
  pattern page shows one — `detail-form` has no tabs, `object-page` answers long
  records with anchor-nav instead. That is a design call for `/design-grill`,
  not a build item.
- **Checked, not assumed, that the fix is in the right layer**: all nine
  `.focus()` sites in `behaviors/` were audited and only `validation-summary`
  can target a container the user cannot see.

## Two traps recorded today, both worth not repeating

- **A context-window regex is secretly a position filter.**
  `grep -oE ".{50}(saved view).{80}"` returned zero because it requires 50
  characters *before* the match on the same line. It produced a confident,
  wrong ROADMAP claim (151.1). Grep a plain fixed string first; add context only
  after you know the count — and **re-verify the siblings** of any claim that
  dies this way. Now in CLAUDE.md.
- **Minified-vs-source spelling cuts both ways.** A grep for `p{` found nothing
  because the built CSS is *not* minified (`p {`). Search for the value.
