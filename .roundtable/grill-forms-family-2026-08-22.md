# Design grill — Data input / Forms family, blind-spot audit (roadmap 102.7)

Owner ask, 2026-08-21. **Explicitly not a re-score**: Slice 94 batch 2 already
cleared the six DSA dimensions for this family, and re-running that measure
returns "fine" again. The job is to ask what those six dimensions **cannot**
see, against five named candidates, and — the item's real Accept criterion —
answer for each: *could the DSA rubric ever have caught this?*

**Correction to the item's own premise, found while starting.** "Scored
95-100%" doesn't hold for the current `Data input` sidebar group: it has
grown from 6 to 8 pages since Slice 94 (`richtext`, `file-upload` added
later), and three of the eight — `combobox`, `money`, `quantity` — still
carry `content: 2` in `dsa-scores.json` (94.4%), each cited as *"no
wrong-choice clause… on check:wrong-choice's TODO."* `form` is EXEMPT
(the anchor everything else is compared against). This is exactly the kind
of stale-number-quoted-as-current-fact CLAUDE.md's "a number you report is
load-bearing" section warns about — noted, not silently corrected, because
fixing three wrong-choice clauses is 102.7's own scope creep, not this
grill's job. Left for a follow-up (recorded below), not fixed here.

Measured live against the current build (fresh `dist`, nginx bind-mount,
puppeteer-core via `browser-harness.mjs`, 1440px, real Tab key events —
see `/private/tmp/.../scratchpad/forms-grill.mjs`, not committed, disposable).

## 1. Tab order through a real ERP row

**Target:** `/components/form`'s `fieldsRow` demo — Vendor → Amount → Cost
center (pre-existing error) → Status, the shape a clerk actually fills.

**Measured:** focused `#vendor`, pressed Tab 4 times, read
`document.activeElement` each time. Order: `vendor → amount → cc → status`
— exactly DOM/visual order, including the already-invalid `cc` field
(no skip, no trap). Leaving the row moves into the page's own `<pre>` code
sample next, which is correct (not a form control).

**Verdict: keep.** Matches visual order exactly.
**Could the rubric have caught a failure here?** No — none of the six
dimensions execute a keyboard walk; `interaction`'s definition is about
platform-vs-behavior narration in prose, not DOM tab-order correctness.

## 2. Server round-trip: values kept, errors wired

**Target:** the actual claim lives on `/patterns/validation-summary`, not
the Forms family pages themselves — a code comment on the `oobMarkup`
sample: `<!-- 422: the form comes back, values kept, error wired to the
field -->`, shown inside a `<pre><code>`, never executed.

**Measured:** confirmed via source read that this specific block is a
static code sample (`{oobMarkup}` inside `<pre><code>`), not live-mounted
markup — distinct from the page's OTHER interactive demo just above it
(`data-validation-summary`), which check:claims DOES exercise (two
assertions, `validation-summary.mjs` lines ~1153-1189: summary reveal,
focus-move). The "values kept" half specifically is never proven because
it describes the CONSUMER's server behaviour, not something client CSS/JS
can produce or the docs can execute without a real backend — same boundary
class as the output-form/report patterns' data-contract sections (101.6/
101.7), which document a contract the consumer's server must uphold rather
than asserting it live.

**Verdict: accept-with-reason.** The claim is correctly scoped to what the
framework can prove (the two-channel field wiring, `aria-invalid` +
`aria-describedby`, IS live-verified elsewhere per 97.1/97.2) and correctly
punts what it cannot (a real server keeping form values is not a CSS/JS
concern). Not queued as a fix.
**Could the rubric have caught this?** No — the six dimensions have no
"is this documented claim executable" check; that's CLAUDE.md's separate
"claims must be executable" rule, and by that rule's own established
precedent (consumer-server contracts are documented, not executed), this
is in-bounds as written.

## 3. Required vs. optional marking

**Target:** `/components/form`'s `reqDisabled` demo, three requiredness
paths: native `required` (`#req-native`), and the CSS-only `--required`
modifier (`#req-class`) — documented in `form-field.css`'s own comment as
needing "requiredness… ALSO on the control itself (required or
aria-required)."

**Measured:** all three fields render the visual asterisk
(`::after` content `" *"`) — confirmed live. `#req-native` gets `required`
natively (HTML-AAM maps this to the accessibility tree automatically, no
`aria-required` needed). **`#req-class` had `required: false`, no
`aria-required`, at all — the demo violated the CSS's own documented
contract**: the asterisk (visible cue) rendered with **zero** programmatic
signal behind it, exactly the two-channel gap CLAUDE.md's standing
principle names ("every state signal is two-channel: visible non-color cue
+ programmatic").

**Fixed in this grill** (trivial, one attribute + one clarified hint,
`apps/docs/src/pages/components/form.astro`): added `aria-required="true"`
to `#req-class`, and reworded its hint to state the pairing requirement
explicitly rather than only naming the class. Re-verified live post-rebuild:
`aria-required="true"` present, asterisk unchanged. Only one usage site in
the repo (`grep -l bo-form-field--required` → this one file), so nothing
else needed the same fix.

**Verdict: fixed.**
**Could the rubric have caught this?** No — `interaction`'s definition
checks whether the page NARRATES the platform/behavior split in prose; it
does, correctly, in the CSS comment. It does not check whether the page's
OWN demo obeys what that prose says. A rubric that reads prose cannot
catch a demo contradicting its own documented contract — that needs the
live DOM read this grill did.

## 4. Non-English locale: units, currency, number entry

**Target:** Money and Quantity's numeric entry and display under a
non-English locale (decimal comma, symbol placement, unit-name
pluralisation).

**Measured:** `/components/money` already states outright: *"Currency
placement is a locale convention, not [the framework's]… formatting for
display… remains your app's job — the input holds a plain number;
`Intl.NumberFormat` at render time is the tool."* Native `<input
type="number" inputmode="decimal">` — per the HTML spec, the DOM `.value`
is always `.`-decimal regardless of UI locale in every evergreen engine;
locale-formatted *display* is explicitly the consumer's job via
`Intl.NumberFormat`, already documented.

**Verdict: accept-with-reason** — already a stated, deliberate boundary,
same shape as the currency/unit-table precedent in CLAUDE.md's Objective
§3 ("framework does visuals, you do the data"). Not a silent gap; a
found-and-already-answered question.
**Could the rubric have caught this?** No — none of the six dimensions
evaluate i18n/locale correctness; this is a scope boundary, not a defect,
and scope boundaries are Objective-level decisions, not DSA-scorable.

## 5. A genuinely long form at 390px

**Target:** `/patterns/detail-form` — three `.bo-form-section` fieldsets,
six real fields (Vendor, Cost center, Order date, Terms, Ship via, Notes)
plus a line-items grid, the closest thing this framework ships to a "long
form."

**Measured:** `document.documentElement.scrollWidth === clientWidth === 390`
— zero horizontal overflow. Label-to-control gap measured per field: a
flat, consistent 4px across all six top-level fields, full 292px control
width, no wrapping-induced gap growth, no label/control overlap.

**Verdict: keep.** Clean at 390px, live-measured, not assumed from the
92rem-down responsive CSS.
**Could the rubric have caught this?** No — `spacing`'s definition audits
whether intrinsic literals carry a reason comment, not whether the
CASCADE actually produces a consistent result at a given viewport; that
needs a live render.

## Summary — what the rubric can and cannot see

Zero of five candidates were things the six DSA dimensions could have
caught, by construction: they audit **static properties of the source**
(raw hex, raw font-size, an intrinsic literal's comment, prose describing
platform-vs-behavior) or **presence of a clause**. None of the five real
questions here — DOM tab order, an unexecuted cross-file claim, a demo
contradicting its own CSS comment, an i18n scope boundary, live layout
math at a viewport — are properties of the source text at all; every one
needed the page actually rendered and driven. This is itself the finding
101.3 asked 102.7 to feed: **a pattern of "no," five for five**, is
evidence the DSA rubric's ceiling is source-level static analysis, and
live-behavior classes of defect will keep needing an explicit `/design-
grill` pass rather than ever showing up in a score.

## Verdict per weakness

| candidate | verdict | queued |
|---|---|---|
| Tab order through a real row | keep | — |
| Server round-trip values-kept claim | accept-with-reason | — |
| Required marking (`--required` had no `aria-required`) | **fixed** | — (this grill) |
| Non-English locale entry/display | accept-with-reason | — |
| Long form at 390px | keep | — |
| *(found, not requested)* stale `content: 2` on combobox/money/quantity | noted, not fixed | see roadmap follow-up |

## Gates

Core build (`npm run build -w @busy-office/ui`), docs build (13 chained
gates incl. `check:claims` 86 behaviours, `check-markup`, link check),
`npx stylelint packages/core/src/css/**/*.css` (exit 0), all 111
`packages/core` vitest behavior tests — all green on this build.
