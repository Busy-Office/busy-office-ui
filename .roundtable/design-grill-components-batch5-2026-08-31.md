# Design grill — components batch 5 (quantity, richtext, scan, segmented, sidebar-nav, skeleton, state)

2026-08-31. Live at http://localhost:8081 (podman `bo-docs-review`), chrome-devtools-mcp,
1440px light + 390px dark (theme forced via `localStorage['bo-theme-pref']` + reload).

**Tooling correction, carried forward to future batches:** `resize_page` has a
hard floor of ~500px width regardless of the requested value (confirmed:
requesting 390 and even 320 both produced `window.innerWidth === 500`). It
cannot produce a true mobile viewport. Use `emulate({viewport:
"390x844x2,mobile,touch"})` instead — confirmed this actually sets
`window.innerWidth === 390`. Every 390px measurement in this file used
`emulate`, not `resize_page`.

**Result: 7 of 7 pass** (Skeleton and State share one docs page,
`state-patterns.astro`, and are graded together below — see note under
State). No removals, no rewording forced. One cross-cutting finding that
**corrects batch 4**, below.

## Cross-cutting finding: the Amount/Money/Quantity "rule for this family" box IS a verbatim duplicate — batch 4's refutation was comparing the wrong paragraph

Batch 1 flagged, unconfirmed, that Amount and Money might duplicate a
"rule for this family" note. Batch 4 (covering Money) reported this
**refuted** — that Money's box is about who-owns-display-vs-capture and
Amount's is about decimal precision, "different text, not a copy."

Checked directly against source for this batch's Quantity assignment
(`grep -n "rule for this family"` across `amount.astro`, `money.astro`,
`quantity.astro`): **all three files contain the identical string**,
character-for-character —

> "The rule for this family: displaying a value is Amount's job; capturing
> one is Money's (currency) or Quantity's (count). One display component
> for every numeric value; two entry components, split by what the value
> *is* — and when it is neither a selectable currency nor a steppable
> count (a rate, a fixed-currency price, a percentage), a plain
> `.bo-input--numeric` is the whole answer: no fourth component, just the
> input modifier."

`amount.astro:134`, `money.astro:188`, `quantity.astro:168` — three
occurrences, byte-identical.

What batch 4 actually compared was Amount's box against a **different**
note further down Amount's page (line 181, "Decimal precision is
app/domain data, not a CSS rule…") — that one genuinely is unique to
Amount (and Quantity has its own unique variant of it too, "Decimal
precision is expressed via the native `step` attribute…", line 351). That
decimals note is real and not duplicated. The **rule-for-this-family**
box is a separate, three-way-identical paragraph batch 4 did not check
against source.

**Verdict on the duplication itself:** this is by design, not a bug — the
same cross-reference note belongges on all three pages precisely because a
reader could land on any of the three first and needs the same routing
logic (which of the three components is right) regardless of entry point.
Repeating a short "you might actually want one of these siblings instead"
box across sibling pages is a defensible pattern (the pattern-recipe docs
do the same with "Related" footers). **Not a `remove` or `reword`** — but
worth a one-line HTML comment at each of the three sites (`<!-- kept in
sync with amount.astro / money.astro / quantity.astro -->`) so a future
edit to one doesn't silently drift from the other two, since nothing
currently enforces the three staying identical.

## Quantity

**Decision:** capture a count (not a currency — routes to Money) as a real
`type="number"` input, optionally joined to a unit select and flanked by
stepper buttons that read min/max/step from the same source as native
validation. Opener's "Not for a number that isn't a count" clause (a
percentage, an index) is present and correctly routes to
`.bo-input--numeric`.

Measured: default stepper buttons 36×36px; the "large-target
(warehouse-floor) variant" 44×44px — both clear the WCAG 2.5.8 24px floor,
and the size difference is a real, stated product decision (touch-target
density for a warehouse floor vs. desktop). 390px dark: `scrollWidth ===
clientWidth === 390` (no overflow) across the whole page, including the
unit-select-joined layout and the reference table.

Ten questions: all yes. 12 demo sections, each tied to a distinct decision
(stepper vs. no-stepper, unit-join, fractional-step precision, grouped
display, table-column density) — none read as a restyle of another.

**Verdict:** keep everything. No component-level findings (see the
cross-cutting rule-box item above, which is shared with Amount/Money).

## Rich text

**Decision:** the chrome for formatted ERP free-text (delivery notes,
approval comments) — five commands (bold/italic/both lists/link), backed
by native `contenteditable` with zero custom editing engine. Opener's "Not
for an ordinary note field" clause correctly routes the common case to a
plain `textarea.bo-input`, and a second clause routes *displaying*
already-rich content to `.bo-prose` instead of a disabled editor — two
distinct wrong-choice tests, both earn their place.

**False lead, checked and dropped:** initial DOM query found the toolbar's
Bold/Italic/Strikethrough/H2/H3 buttons carry `aria-label="null"`. This is
**not a defect** — every one of them has visible text content ("B", "I",
"S", "H2", "H3") which is a valid accessible name per WCAG (text content
counts absent an aria-label), and Bold/Italic/Strikethrough additionally
carry a `title` with the keyboard shortcut. Recording this explicitly
because CLAUDE.md's own doctrine asks that a suspicious-looking automated
result be checked against source before being reported — this one didn't
survive that check.

Ten questions: all yes. The "Why no engine" and "Four things this
framework will never wire" sections name the boundary explicitly instead
of leaving it implicit — matches the framework's stated content bar.
390px dark: no overflow, toolbar wraps cleanly, all icon buttons remain
36×36px (touch-safe).

**Verdict:** keep everything. No findings.

## Scan feedback

**Decision:** the visible half of a barcode-scan event for an RF/warehouse
user whose eyes are on the rack — a ~600ms full-viewport colour wash
(green on capture, red on validation reject), always paired with a
`data-scan-status` live region so the cue is two-channel by construction.
Opener explicitly separates capture-succeeded from validation-passed (the
framework only owns the former) and gives a sharp "Not for form
validation on an ordinary screen" clause — a seated user gets the field's
own inline message; a full-viewport flash aimed at nobody in particular is
the wrong tool.

This is the leanest page in the batch: one demo (a single input), a
markup block, and a "what the platform gives you vs. what the behavior
adds" comparison table — no restyle-of-itself padding, appropriate for a
component that does exactly one thing.

**Minor finding (cosmetic, not blocking):** the demo input's placeholder
text — `Try 4006381333931, then REJECT-1` — clips at 390px width with no
visual affordance that it's truncated (no ellipsis, no fade). It's
placeholder copy, not real content, so this doesn't rise to a `reword`
verdict on its own, but a shorter placeholder (e.g. `Try 4006381333931…`)
would read cleanly at both widths. Flagged as a `demote`-severity nit.

Ten questions: all yes except the placeholder nit above doesn't fail any
of the ten (it's not primary content).

**Verdict:** keep everything; shorten the demo placeholder string if
anyone is in that file for another reason. Not roadmap-worthy on its own.

## Segmented control

**Decision:** a 2-5-option mutually-exclusive toggle where every option
should stay visible (the button-group alternative to a hidden-behind-a-
click select). Real radio inputs under the hood, explicitly named as the
two-channel mechanism. "Not past about five options, or when an option
needs explaining" is a sharp, testable wrong-choice clause.

The "Saved views, with their size" section makes a real, explained design
call: counts use muted tabular text, not a badge, because "a badge is a
status chip and a count is not a status" — and gives the measured reason a
badge would be wrong at compact density (24px badge inside a 24px option
edge-to-edge). This is exactly the kind of stated-purpose-per-element the
ten questions ask for.

Measured: all 5 demo `.bo-segmented` groups at 390px — `scrollWidth ===
clientWidth` on every one (131–296px depending on option count), zero
overflow even on the 3-option-with-counts variant.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Sidebar navigation

**Decision:** the module rail of an ERP shell — collapses to icons when
its own container (not the viewport) narrows. The page's own left sidebar
doubles as one live demo; two embedded iframes (`sidebar-nav-wide`,
`sidebar-nav-narrow`) prove the container-query behavior independently of
viewport width, which is a genuinely strong way to demonstrate the "shell
width, not viewport width" claim rather than just asserting it. "Not for
navigating within one screen" clause correctly routes in-page section
jumps to anchor-bar/tabs instead, with the specific tell ("would
`aria-current='page'` claim a page change that never happened") — a real,
checkable test rather than a vague rule.

**Checked the icon-collapse accessibility claim directly** rather than
trusting it: in the narrow iframe, `.bo-sidebar-nav__label` (e.g. "Order
to cash") is present in the DOM with real text, and its computed style is
`width:1px; position:absolute; overflow:hidden; clip-path:inset(50%);
white-space:nowrap` — the textbook visually-hidden pattern, not
`display:none` (which would drop it from the accessibility tree) and not
a bare CSS truncation. The icon itself carries `aria-hidden="true"`.
Correct implementation, confirmed rather than assumed.

390px dark: both embedded shell demos (wide and narrow) reflow to fit
inside the 390px column with no horizontal overflow on the page itself.

Ten questions: all yes.

**Verdict:** keep everything. No findings.

## Skeleton / State (`state-patterns.astro` — one page, two components)

These CSS components (`skeleton`, `state`) live on a single combined docs
page, "Loading, empty & error states," each with its own `ClassRef` /
`ApiTable` / `DsaScore` section (confirmed both are present:
`ClassRef component="skeleton"` and `ClassRef component="state"` both
appear in the file). This is a deliberate, reasonable consolidation, not a
missing-page gap: the opener states the reason directly — "Three states
every data view needs: loading (`.bo-skeleton`), nothing to show
(`.bo-state`), and something went wrong (`.bo-state--error`) — one
component, two settings, not two separate components" for the state half,
with skeleton as the loading-specific complement. Small-and-general over
specific, per the Objective, applied to the docs structure itself.

**Decision (Skeleton):** a loading placeholder pairing `aria-busy="true"`
(programmatic) with the shimmer (visual) — genuinely two-channel, and the
copy says so explicitly rather than leaving it implicit.

**Decision (State):** empty and error are the *same component*, no
`--empty` modifier exists, distinguished by which words and icon it's
given. Checked this claim rather than trusting it: the "no purchase orders
yet" empty state uses a mailbox glyph, the filtered-empty state ("no POs
match these filters") uses a magnifying-glass glyph, and the error state
uses a warning-triangle glyph — three different icon *shapes*, matching
the opener's stated "the icon shape differs, not just its color" claim.
The filtered-empty state also names the actual cause ("Status 'Rejected' +
CC-4021 has no results in this period") and offers the one-click way out
("Clear filters") rather than a generic empty message — this is the
project's own state-language bar, met.

Measured 390px dark: `scrollWidth === clientWidth` (no overflow) across
skeleton lines, the circle/block variant, and all three state cards.

Ten questions (both components): all yes.

**Verdict:** keep everything, both components. No findings. Consolidating
them onto one docs page is itself a positive pattern worth naming, not
just a neutral non-finding — it's the Objective's "one component, many
settings" applied one level up, to documentation structure.

## Summary table

| Component | Verdict | Finding |
|---|---|---|
| Quantity | pass | none (see cross-cutting rule-box note) |
| Rich text | pass | none (a suspected a11y issue was checked and dropped) |
| Scan feedback | pass, minor nit | demo placeholder clips at 390px, cosmetic |
| Segmented control | pass | none |
| Sidebar navigation | pass | none |
| Skeleton | pass | none |
| State | pass | none |
| *(cross-cutting)* | — | Amount/Money/Quantity rule-box IS a verbatim 3-way duplicate; batch 4's refutation compared the wrong paragraph. By-design, not a defect — recommend a sync comment, not a rewrite. |
