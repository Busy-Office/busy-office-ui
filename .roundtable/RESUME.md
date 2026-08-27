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

Last updated 2026-08-27 08:35, HEAD `d29bb32`. Working tree clean, every gate
green (129 behavior tests, 130 live claims, full docs build). npm serves
**0.5.0**.

**⚠ 26 commits are unpushed.** Everything from Slice 149 through 153 is local
only. CI and Pages have therefore not seen any of it — push before trusting a
green badge, and run the CI-only sweeps (`test:axe`, `check:layout`) as the wake
prompt requires.

**The backlog is NOT halt-blocked** — this file said the opposite until now, and
a wake that believed it would have stopped with real work queued. Three
dispatchable items:

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

## Two traps recorded today, both worth not repeating

- **A context-window regex is secretly a position filter.**
  `grep -oE ".{50}(saved view).{80}"` returned zero because it requires 50
  characters *before* the match on the same line. It produced a confident,
  wrong ROADMAP claim (151.1). Grep a plain fixed string first; add context only
  after you know the count — and **re-verify the siblings** of any claim that
  dies this way. Now in CLAUDE.md.
- **Minified-vs-source spelling cuts both ways.** A grep for `p{` found nothing
  because the built CSS is *not* minified (`p {`). Search for the value.
