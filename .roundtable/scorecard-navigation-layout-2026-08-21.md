# Scorecard — Navigation & layout (Slice 94, batch 3)

2026-08-21. Seven components: `navbar`, `sidebar-nav`, `breadcrumb`,
`offcanvas`, `tabs`, `dialog`, `icon`. Third family by blast radius —
shell-level, so a misalignment is on every screen at once.

Run only after **94.4** red-proved the rubric in the same wake; scoring a
family against an instrument not known to discriminate is what 37.2 warned
costs double.

## Scores

| Component | Total | Weakest dimension | Trigger |
|---|--:|---|---|
| `breadcrumb` | **100%** (18/18) | — zero raw dimension literals | — |
| `sidebar-nav` | 95% (20/21) | Spacing 2 | — |
| `tabs` | 95% (20/21) | Spacing 2 | — |
| `navbar` | 94% (17/18) | Spacing 2 | — |
| `icon` | 94% (17/18) | Spacing 2 | — |
| `offcanvas` | 90% (19/21) | Colour 2, Spacing 2 | — |
| `dialog` | 90% (19/21) | Colour 2, Spacing 2 | — |

**No component hit either trigger clause** (total < 80%, or any dimension
≤ 1), so no `/design-grill` was owed. The family's floor is 90%.

## Two findings, both family-level — queued as 94.6

Neither is a per-component defect. This is the case for scoring a family
together rather than a component alone.

**(a) The modal scrim is the framework's only untokenized colour, duplicated.**
`rgb(0 0 0 / 0.4)` appears verbatim in `dialog.css:20` and `offcanvas.css:28`
— which are the only two `::backdrop` rules in the framework — and no scrim
token exists (the only overlay tokens are `--bo-state-hover-overlay` and
`--bo-state-active-overlay`). Found by reading, not by grep: it is `rgb()`,
so the hex sweep that flagged `tabs` walked straight past it.

**(b) The 94.2 spacing habit is framework-wide.** Six of seven carry an
uncommented intrinsic literal — `navbar` 3rem, `sidebar-nav` 14rem/3.25rem,
`offcanvas` 18rem, `dialog` 32rem/56rem, `tabs` 2.5rem/2px, `icon` -0.125em.
94.2 drew the right conclusion (one habit, not N defects) but scoped the fix
to components already scored. `breadcrumb` proves the standard is reachable:
zero raw dimension literals, 100%.

## One suspicious signal, reconciled rather than scored

`tabs.css` measured **9 raw hex** with comments stripped — by far the highest
in the framework and exactly the shape that should be a Colour defect. Read in
context, all nine are `#000` inside `mask-image: linear-gradient(...)`. In a
mask, `#000` is the **alpha channel** — "keep this pixel" — not a theme colour;
the file uses a mask *precisely so that no cover colour is assumed, because the
tab strip sits on the canvas in the docs and on a surface inside a card.
Tokenizing it would be actively wrong. Scored `Colour: 3`.

Same shape as batch 1's print-block false signal. A raw-hex count is a
**heuristic**, and this is the second family in which its top hit was correct
CSS.

## Two instrument corrections before the numbers were used

- **`po-app` usage read 0 for all seven.** An identical value across many
  inputs is a defect until proven otherwise — and it was: the grep pointed at
  `examples/po-app/src`, which **does not exist** (po-app is a single
  `server.mjs`). Corrected, the real figures carry the `Fit` citations:
  `dialog` 13 sites, `sidebar-nav` 6, `icon` 5, `navbar` 3. This is verbatim
  the documented failure "a find over a path that did not exist".
- **The pattern-page count broke on shell quoting** and silently reported 0
  for every component in the same run. Both were caught by the identical-value
  rule, not by review.

## Calibration — scored against the standard already in use

Before scoring, the existing 15 entries' citations were read to fix the bar,
after 94.4 nearly went wrong the other way:

- **Typography** penalises raw **font-size** only. Em `letter-spacing` is
  treated as intrinsic and scored 3 on `form` (0.03em) and `combobox`
  (0.05em) — so `sidebar-nav`'s 0.05em is 3, not 2.
- **Interaction** is `na` where a component introduces no interaction surface
  (`amount`, `ordered-list`, `date`) — applied here to `navbar`, `breadcrumb`
  and `icon`.

## Verification

Docs build green (page-shape 39+19, link check 8712, markup 52720 class uses,
notes, data-hooks). The seven pages were wired to `DsaScore` by script, then
**verified against the built output** rather than the diff, per the bulk-edit
rule: every page carries its OWN score (`navbar` 94%, `dialog` 90%, …), zero
insertions landed inside a template literal or a `<pre>` sample.

Live on the bind-mounted container over the fresh `dist`: `dialog` renders all
seven rows and its Known-gaps line in **both themes**, with the theme flip
confirmed by computed `background-color` (`rgb(15,17,21)` ↔ `rgb(249,250,251)`),
no page-level horizontal overflow.

**Not verified at 1440px**: `resize_window` would not move the viewport off
1280×656 (the Slice 70.1/71.1 limitation), so 1280 is what was observed.
