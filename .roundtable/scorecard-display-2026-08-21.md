# Scorecard — Display (Slice 94, batch 5)

2026-08-21. Seven components: `dashboard`, `byline`, `badge`, `kbd`, `avatar`,
`prose`, `calendar`. Fifth family by blast radius — read surfaces, lower
interaction risk. **The first family scored against 94.7's written
definitions** rather than against citations alone.

## Scores

| Component | Total | Below 3 | Trigger |
|---|--:|---|---|
| `byline` | 93% (14/15) | content | — |
| `badge` | 93% (14/15) | content | — |
| `calendar` | 90% (19/21) | spacing, content | — |
| `kbd` | 87% (13/15) | typography, content | — |
| `dashboard` | 83% (15/18) | typography, spacing, content | — |
| `avatar` | **80%** (12/15) | typography, spacing, content | — |
| `prose` | **80%** (12/15) | typography, spacing, content | — |

**No component triggered a grill** — but `avatar` and `prose` land on exactly
**80.0%**, and the clause is `total < 80%`. Two components sit one point the
right side of a threshold. Recorded rather than rounded away; whether that
boundary is where it should be is a question for the owner, not for the
scorer to quietly adjust mid-batch.

## The sharpened definitions did real work

This is the first evidence about whether 94.7 achieved anything, and it did:

- **`content` failed 7 of 7.** Not one page in this family names a context
  where the component is the wrong choice. Checked by reading, not by the
  marker count — `kbd`'s "use the native `<kbd>` element, not a span" and
  `badge`'s "never encode status as colour alone" both *look* like negative
  guidance to a regex, but neither names a context where the component itself
  is the wrong answer. Queued as **94.10**.
- **`typography` failed 4 of 7**: `kbd` 0.85em, `avatar` 0.7em, `prose` 0.9em
  on inline code, `dashboard` 3rem on the stat value — all raw sizes off the
  scale, the same defect class as `amount` and `data-table`.
- **`hierarchy` was `na` on 5 of 7** under 94.7's new rule, and scored on the
  two that present affordances (`dashboard`, `calendar`). It still has not
  failed anywhere — 94.9 remains open.

**This corrects what I recorded last wake.** After 94.8 fixed the six named
failures I wrote that `content`'s "discriminating power is spent until new
components arrive". That was wrong: it was spent only on the *population
already treated*. On an untouched family it failed 7 of 7. The dimension is
healthy; the previous 28-of-28 reading was an artefact of having just fixed
everything it pointed at.

## One suspicious signal, reconciled

A literal-comment scan flagged `badge.css:42-43` as carrying uncommented
`373px`, `390px` and `24px`. Those are **measurements quoted inside a
comment** — the note written two wakes ago explaining the page-overflow fix.
Not declarations. Fourth instance of the comment trap this session, and the
second where the scanner tripped on prose written by an earlier wake.

`badge`'s two raw hex are inside `@media print`, where theme tokens would be
wrong on paper — the same reconciliation made for `data-table`, `stepper` and
`approval-workflow`. **Fourth consecutive family** in which the raw-hex
heuristic's top hit was correct CSS; still zero true positives.

## Verification

Docs build green (page-shape 39+19, link check 8712, markup, notes,
data-hooks). Seven pages wired to `DsaScore` by script and **verified against
the built output**: each carries its own score, zero insertions landed in a
template literal or `<pre>`.

Live on a bind-mounted container over fresh `dist` (CSS hash matched before
trusting it): `avatar` renders all seven rows and its Known-gaps line in
**both themes**, theme flip confirmed by computed `background-color`
(`rgb(15,17,21)` → `rgb(249,250,251)`), no page-level horizontal overflow.

**Not verified at 1440px** — the viewport would not leave 1280 (the Slice
70.1/71.1 `resize_window` limitation), so 1280 is what was observed.

## Remaining

35 of 40 components scored. Batches 6 (Actions: button, dropdown, segmented)
and 7 (Values: kv — `amount` and `date` already done) close the slice.
