# 37.3 — feeding the scoring results back

2026-08-21. The other half of 37.2, which closed when all 39 components were
scored. 37.3's contract: *every "improve" becomes a queued item with its own
Accept criteria; every "deprecate" gets its migration note; every "keep" is
recorded so the next sweep does not re-litigate it.*

Running it found that the first clause was **not** true.

## What was broken

| | |
|---|---|
| Below-3 dimensions | 17 across 13 components |
| Of those, with a follow-up naming them | **11** |
| With no follow-up at all | **4** — `avatar`, `dashboard`, `kbd`, `prose`, all `typography: 2` |
| Pointing at a roadmap item that does not exist | **2** — `amount` → "roadmap 92.5", `data-table` → "roadmap 94.1" |

So six of seventeen gaps were published on component pages as a score of 2/3
with nothing behind them. A reader following the reference found either
nothing at all or a number that has never been an item.

## What changed

**1. `94.13` created** — the six raw font-sizes, with Accept criteria that
force a decision rather than a tokenisation. The pattern is the finding: five
of the six are *em* in a narrow 0.7-0.9 band doing the same job — text that
must sit smaller than its host without leaving the host's scale, which is
what an em ratio buys and an absolute rem step cannot. `dashboard`'s `3rem`
is the opposite case, a display size above the scale's top. So the question
is whether the scale is missing a relative tier, or whether "smaller than my
host, in em" is a legitimate intrinsic the scale deliberately does not
express — in which case `typography`'s definition must say so, exactly as
`spacing`'s does, and the six re-score on that basis. What is not acceptable
is what was shipping: 2/3 forever with no route out.

**2. Every `improve` entry now names its dimension** — `"typography — …"`,
`"content — …"`, `"fit — …"`. This is not cosmetic: it makes the
score↔follow-up link *checkable* instead of a guess at which free-text line
addresses which row, and the rendered "Known gaps" line now tells a reader
which rule the gap belongs to. `kbd` reads:

> **Known gaps:** typography — the 0.85em keycap size: same decision (roadmap
> 94.13); content — name a context where this is the wrong choice, and the
> alternative (roadmap 94.10).

**3. The gate now enforces the reciprocal.** `check-dsa-scores.mjs` already
asserted "no *Known gaps* without a dimension below 3" (yesterday's shipped
contradiction). It now also asserts the other direction: **no dimension below
3 without an improve entry naming it.** The two together make score and
follow-up impossible to separate.

Red-proved by recreating the exact defect found here — stripped `kbd`'s
typography entry while leaving its `typography: 2` — confirmed the injection
was in the file, watched the gate report
`kbd: every dimension below 3 has an improve entry naming it` and exit 1,
restored byte-identical, exit 0.

## Deprecations — clause 2

One: `date`, `fit: 0`. Its migration note is on the page (leads with the
deprecation, shows the `.bo-cluster` replacement first), in the CHANGELOG as
a Deprecated entry, and in `date.css`'s own header. Removal is a next-major
change because 0.x is published. Nothing owed.

## Keeps — clause 3, recorded so the next sweep does not re-open them

These were examined and judged correct. Re-litigating them is wasted work
unless the component changes:

- **`tabs`' nine `#000`** — mask alpha inside `linear-gradient()`, not theme
  colour. A mask is used *precisely* so no cover colour is assumed. Judged
  four separate times now.
- **Raw hex inside `@media print`** (`data-table`, `stepper`,
  `approval-workflow`, `badge`) — theme tokens are wrong on paper.
- **em `letter-spacing`** (`form` 0.03em, `kv` 0.04em, `combobox`/`sidebar-nav`
  0.05em, `data-table` 0.03em) — intrinsic, not a type-scale step.
- **`inline-editing` and `table-toolbar`** — feature pages documenting no
  component, so they carry no score and should not be "fixed" to have one.
- **`hierarchy: na` on eight components** — fewer than two affordances means
  there is nothing to rank; this is 94.7's rule, not an omission.

## Still open, and named rather than absorbed

- **94.9** — `hierarchy` (0 failures in 25) and `interaction` (0 in 21) have
  never discriminated.
- **94.10 / 94.12** — the `content` gap, and the fact that 28 rows were scored
  against a retired standard.
- **94.13** — the six font-sizes, created here.

## Verification

Core build and docs build green, `check-dsa-scores` passing at 273
assertions over 39 components. Live on a bind-mounted container over fresh
`dist`: `kbd` renders both named gaps in **both themes**, flip confirmed by
computed `background-color`, no page-level horizontal overflow.

**Not verified at 1440px** — the viewport would not leave 1280 (70.1/71.1).
