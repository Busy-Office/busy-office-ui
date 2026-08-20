# Design grill — Amount/Quantity/Money DOCS: arrangement, naming, look & feel (2026-08-20)

Owner-requested angles: demo arrangement (simple → complex), sidebar naming
("Money field" vs bare "Quantity"), and "look & feel of display and input
also different." The third angle turned out to be the biggest real find of
the three grills run against this family — a shipped rendering defect, not
a docs nit.

## Finding 1 — the quantity input was shipping on UA-default chrome (fix, framework CSS)

`.bo-quantity__input` had no box styling at all: `quantity.css` gives it
flex/alignment only, and the reset gives inputs only `font`/`color`
inheritance. Nothing in the framework drew its border, background, or
padding — the browser did. Measured live, same theme (dark), same density,
against Money's amount input:

| | quantity `__input` (before) | money `__amount` (`.bo-input`) |
|---|---|---|
| border | `2px inset rgb(133,133,133)` — UA | `1px solid` border-control token |
| background | `rgb(59,59,59)` — Chrome's own dark UA color | `--bo-color-bg-surface` |
| padding-inline | `2px` — UA | `12px` (`--bo-space-3`) |
| height | 36px — **only by accident** (flex-stretch to the buttons) | 36px — density token |

This is exactly the "look & feel of display and input also different" the
owner saw: the two editable siblings didn't match each other, and the
quantity input's look was whatever the browser felt like — guaranteed
different across browsers, off-token in both themes.

**Worse: the call sites had already drifted into three compositions.**
Census across docs + po-app (15 quantity inputs): 11 bare
`bo-quantity__input`, 3 `bo-quantity__input bo-input--seamless` — the
seamless modifier WITHOUT the base, so its `--bo-input-border: transparent`
custom property had no border declaration consuming it and the UA inset
border stayed visible on "seamless" cells — and 1 full
`bo-input bo-input--numeric bo-input--seamless bo-quantity__input`.

**Fix — absorb, don't demand markup:** extended `input.css`'s base (+
`::placeholder`, `:disabled`, `[aria-invalid]`) selectors to include
`.bo-quantity__input`, so it IS a `bo-input` by construction. One CSS
change fixes all 15 call sites and all three compositions as-is — no
Breaking markup-contract change, no consumer edits. `quantity.css`'s own
later rules (radius 0, centering, −1px overlap) still win by source order,
verified live: post-fix the input computes the token border/background/
12px padding in BOTH themes (light `rgb(107,114,128)` on white, dark
`rgb(156,163,175)` on `rgb(26,29,35)`), radius 0 and centering intact, and
the three base-less seamless inputs on `/patterns/editable-grid` now
render the proper transparent 1px seamless contract instead of the UA
inset.

## Finding 2 — sidebar naming: "Money field" vs "Quantity" (fix, rename)

The "field" suffix carried no consistent meaning: Quantity is equally a
field and didn't have it; inside a sidebar group literally named "Data
input", the suffix is redundant with the group. Subtraction: renamed the
sidebar label and the page H1/title to **"Money"**. Group context
disambiguates from Amount (which lives in "Values", the display group).
Prose references to "the Money field" across other pages stay — that's
natural descriptive text, not a navigation label.

## Finding 3 — crossover-section placement was inconsistent (fix, arrangement)

Each family page carries a "when you actually want the sibling" section
(Money: "Read-only display — use Amount"; Quantity: same; Amount:
"Editable money — not `.bo-amount`"). Money had it 2nd, Quantity 3rd
(right after its basic demos) — Amount had it buried **9th of 12**.
Moved it to position 4, right after Amount's three basic money-display
demos, matching the convention: basics first, then "here's the door to
the sibling," then the deeper material. Verified live: renders 4th.

## Finding 4 — the display/input visual difference is intentional; say so (reword)

After Finding 1's fix the two INPUTS match each other — but display
(`.bo-amount`, a plain span) and input (bordered control) are meant to
look unrelated: the border is the affordance. That intent was implicit.
Added one clause to both crossover captions: *"a bordered box says 'you
can type here', plain text says 'this is a fact' — the two are meant to
look unrelated."* Verified rendering on both pages.

## Verdict summary

| # | Element | Verdict | Why |
|---|---|---|---|
| 1 | `.bo-quantity__input` box styling | **fix** (framework CSS) | UA chrome shipped; 15 call sites, 3 drifted compositions; absorbed into `input.css`'s selectors |
| 2 | Sidebar "Money field" | **rename** → "Money" | suffix carried no consistent meaning; group name already says "input" |
| 3 | Amount's crossover section at 9/12 | **move** → 4 | other two pages put it right after basics |
| 4 | Display-vs-input visual split | **reword** (one clause ×2) | intentional difference stated, not left implicit |
| — | A paired display+input showcase demo | **refuse** | the crossover captions + existing demos already carry it; a new demo per page is addition where a clause suffices |
