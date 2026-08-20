# Scorecard — Feedback (Slice 94, batch 4)

2026-08-21. Fourth family by blast radius. **Six components, not the five the
roadmap table predicts**: `/components/state-patterns` documents two —
`skeleton` and `state` — each with its own `ClassRef`/`ApiTable` pair, so it
gets two score sections. The table counts sidebar entries; this counts
components. Same class of correction as batch 1 establishing that
`inline-editing` and `table-toolbar` are feature pages, not components.

## Scores

| Component | Total | Trigger |
|---|--:|---|
| `alert` | 100% (21/21) | — |
| `skeleton` | 100% (18/18) | — |
| `state` | 100% (18/18) | — |
| `progress` | 100% (18/18) | — |
| `stepper` | 100% (18/18) | — |
| `approval-workflow` | 100% (18/18) | — |

None triggered. **And that clean sweep is itself the finding** — see below.

94.6(b) was applied at scoring time as that item specifies: eleven intrinsic
literals across the six now carry their reason (`state` 2rem icon + 32ch
measure, `skeleton` 2.5rem/4rem placeholders, `progress` 10rem×0.5rem bar,
`alert` 3px accent + 24rem toast, `stepper` 1.75rem marker + 2px connector,
`approval-workflow` marker + its three derived connector numbers). That is
why Spacing reads 3 everywhere here.

## The rubric has three dimensions that have never once varied

Measured across all **28** components now scored:

| Dimension | Score spread | Below 3 |
|---|---|--:|
| hierarchy | `{3: 28}` | **0** |
| content | `{3: 28}` | **0** |
| interaction | `{3: 17}` (11 `na`) | **0** |
| typography | `{2: 2, 3: 26}` | 2 |
| colour | `{2: 2, 3: 26}` | 2 |
| spacing | `{2: 6, 3: 22}` | 6 |
| fit | `{0: 1, 3: 27}` | 1 |

Totals: `{83%: 1, 90%: 2, 94%: 3, 95%: 3, 100%: 19}`.

**Three of seven dimensions have produced the same value 28 times out of 28.**
By this project's own standard — an identical value across many inputs is a
defect in the instrument until shown otherwise — those three are not
measuring anything. They are ceremony attached to a number that gets
published.

And **Spacing is not a quality measure, it is a to-do list**: it scores 2
exactly until a wake writes the comment, then it scores 3 forever. All six
components here went 2→3 within this same wake, by my own edit. A dimension
whose value is "has a scoring wake visited this file yet" tells a reader
nothing about the design.

That leaves **Fit** as the only dimension carrying real signal — which is
precisely what 94.4 found when `date` scored 0 there while passing the 80%
clause. 94.4's conclusion ("the rubric discriminates, no sharpening needed")
was half right: it discriminates *through Fit*, and the other six dimensions
converge to 3. I recorded "no sharpening needed" last wake; with 28 rows
instead of 15, that no longer holds. Queued as **94.7**.

## One suspicious signal, reconciled

`stepper` measured 3 raw hex and `approval-workflow` 1, with comments
stripped. All four sit inside `@media print`, where theme tokens would be
wrong on paper — the same reconciliation batch 1 made for `data-table`.
Scored `Colour: 3`.

This is the **third consecutive family** in which the raw-hex heuristic's top
hit was correct CSS (batch 3: `tabs`'s nine `#000` were mask alpha). Across
three families it has produced zero true positives. Worth saying plainly:
the check earns its place as a tripwire, but a hit is not evidence.

## Verification

Docs build green (page-shape 39+19, link check 8712, markup). The five pages
were wired to `DsaScore` by script and **verified against the built output**,
not the diff: each carries its own score, `state-patterns` renders exactly
two sections, and zero insertions landed in a template literal or `<pre>`.

Live on a bind-mounted container over fresh `dist`: both sections render 7
rows each in **both themes**, theme flip confirmed by computed
`background-color` (`rgb(15,17,21)` ↔ `rgb(249,250,251)`), no page-level
horizontal overflow. `stylelint` clean after the eleven comment edits.

**Not verified at 1440px** — the viewport would not leave 1280 (the Slice
70.1/71.1 `resize_window` limitation), so 1280 is what was observed.
