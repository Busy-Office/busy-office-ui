# Design grill — components batch 4 (money, navbar, offcanvas, ordered-list, pagination, progress, prose)

2026-08-31. Live at http://localhost:8081 (podman `bo-docs-review`), chrome-devtools-mcp,
1440px light + 390px dark (theme forced via `localStorage['bo-theme-pref']` +
reload — `emulate(colorScheme)` does not drive this site's theme, and a bare
`data-theme` attribute set post-load does not survive a viewport-driven
resize either; the persisted preference key is the only reliable path).
Retry of an earlier attempt that was cut off mid-run by a host sleep/API
error before anything was written — this file starts clean, nothing carried
over.

**Result: 7 of 7 pass.** No removals, no rewording forced, no rendering
defects found in this batch (batches 2 and 3 each found one; this one
didn't).

## Money

**Decision:** capture a currency + amount pair as one field, with precision
that follows the selected currency. Opener states this in one sentence and
the "Not for a fixed-currency value" clause is present and correct (a plain
`.bo-input--numeric` is right for a rate/fee/fixed-price).

**Rule-box duplication check (requested):** Money's "The rule for this
family" box reads *"displaying a value is Amount's job; capturing one is
Money's (currency) or Quantity's (count) … a plain `.bo-input--numeric` is
the whole answer: no fourth component, just the input modifier."* Amount's
own rule box reads *"Decimal precision is app/domain data, not a CSS rule —
there's no `--decimals` modifier…"* — a different rule, about a different
axis (who-owns vs. how-many-decimals). **Not a duplicate.** Batch 1's flagged
concern is refuted.

Ten questions: all yes. 12 demo sections (basic, currency-after, combobox for
long lists, invalid-currency error, read-only/use-Amount, data-decimals
override, data-grouped, in-a-form-field, decimals reference table, in-a-table-
column, warehouse-floor density variant) — each is annotated with a distinct
product decision (locale ordering, unknown-code handling, override priority,
format-on-blur vs. live, density-as-size), not decoration; none is a
candidate for removal. Error state (invalid currency, "EURO is not a
currency code. Did you mean EUR?") names the correction, not just the fault
— matches the framework's own stated content rule. 390px dark: all 12
sections stack single-column, no overflow, no clipped labels.

**Verdict:** keep everything. No findings.

## Navbar

**Decision:** the one suite-level header, identical on every screen, holding
only whole-app chrome (brand, environment badge, global actions). Wrong-
choice clause is sharp: page identity/actions explicitly do NOT belong here
(routed to breadcrumb + form-actions instead), with the boundary pointed at
the app-frame pattern for the full picture.

Ten questions: all yes. Single demo section — brand, environment badge,
spacer, one icon-only notification button (`aria-label="Notifications"`,
bell icon is a near-universal glyph so this is an acceptable exception to
needing visible text). At 390px the three elements (brand, badge, bell) stay
on one row with no wrap/overflow — this is the smallest, most finished page
in the batch.

**Verdict:** keep everything. No findings.

## Offcanvas (Drawers)

**Decision:** a native `<dialog>`-backed panel that slides over the screen
for navigation (start) or filters/preview (end) — explicitly not for content
that must stay visible beside the record it's about (routes to master-detail
instead, citing the 156.1 precedent where master-detail's own split
collapsed at 390px).

The live demo runs inside an iframe rather than opening over the docs page
itself, with the reasoning given inline ("the one control you want to study
[would hide] the thing hiding everything else") — the iframe still gets a
real top layer, backdrop and Esc handling, just scoped to the frame. Measured
the iframe's actual box: 320×342 (not a wasted-height concern; visually it
reads correctly at both widths).

Ten questions: all yes. "Which side, and when" section gives an explicit
decision table for start vs. end. 390px dark: demo, code sample, and prose
all stack cleanly, no overflow.

**Verdict:** keep everything. No findings.

## Ordered list

**Decision:** a native `<ol>` where order is real semantics (line items,
approval routes, release steps) — number is the actual list marker, not CSS
content, so it survives copy/screen-readers.

**Correction to a standing note:** the reach-report finding cited in
CLAUDE.md ("`bo-ordered-list` — NOT EXAMINED — carries no wrong-choice
clause") is **out of date**. The page now has one: *"Not once each item needs
more than one attribute — order alone does not justify a list if you also
need quantities, dates or status per row; that is a data table."* Whether
this was added since that finding was written or the earlier proxy simply
missed it isn't determinable from here, but the clause exists today and is
correct — this item can be marked resolved rather than left open.

Measured the `__actions` variant's reorder/remove buttons directly:
`.bo-btn.bo-btn--sm.bo-btn--ghost.bo-btn--icon`, 24×24px (meets WCAG 2.5.8's
24px minimum), each with a row-specific `aria-label` ("Move Standing desk
down", "Remove Standing desk") — real two-channel affordance, not bare glyphs.

Ten questions: all yes. Three demo variants (default mono/tabular,
`--plain` prose, `__actions` editable) each earn their place — different
content shapes, not restyles of the same thing. 390px dark: clean stacking,
no overflow.

**Verdict:** keep everything. No findings. (Plus the correction above.)

## Pagination

**Decision:** page-relative navigation (`<nav aria-label="Pagination">`,
`aria-current="page"`) for content where jumping to any page is valid —
explicitly not for a must-complete-in-order process, which routes to Stepper
or the wizard pattern. The wrong-choice clause's tell ("whether landing on
page 7 first would be wrong") is a genuinely useful test, not boilerplate.

Ten questions: all yes. Two sections: the default numbered bar (rows-per-page
select, prev/next, numbered links with ellipsis, "1–25 of 312" count) and the
opt-in "Load more" infinite-scroll alternative with its own data-table demo.
At 390px the default bar reflows to two rows (rows-select on its own line,
page controls below) with no overflow or clipped text — this is exactly the
kind of claim batch 3 caught being false elsewhere (Key-value's "single
stack"), so it was checked, not assumed: confirmed true here by screenshot.

**Verdict:** keep everything. No findings.

## Progress

**Decision:** continuous, determinate progress with a known fraction
(budget consumption, import jobs, storage quotas) via a styled native
`<progress>` — distinct from Stepper (discrete named steps). Wrong-choice
clause is unusually strong: explicitly refuses indeterminate work ("a
determinate-looking bar on indeterminate work is the single most common
misuse of this element") and names the correct alternative (a loading state
with words).

Ten questions: all yes. Origin story given for the class itself (native
`<progress>` renders unthemed platform-blue in both light and dark; this is
the re-skin). Three-tone threshold demo (default/warning/danger) states
explicitly that "the tone is decoration on top of the text — the
accompanying text must say it," and cites the 3:1 WCAG 1.4.11 contrast gate
for all three tones in both themes. 390px dark: bars, percentage labels, and
the dashboard-card composition all render without clipping.

**Verdict:** keep everything. No findings.

## Prose

**Decision:** styling for server-stored rich text once it's rendered
(approval notes, comments, return instructions) — pairs with but needs none
of the rich-text-editor chrome. No `<strong>Not for…</strong>` clause is
present, and per the standing EXEMPT reasoning already on record (a display
class for whatever rich text a server happens to send has no wrong-choice
question to answer — the choice is upstream of this class), that's correct,
not a gap.

Ten questions: all yes, with Q4 (every element has a stated purpose) worth
calling out — the three demos (a return-authorization note with headings/
list/table/blockquote, an approval note inside a card, and a plain rendered-
content block) each exercise a different real host context rather than
repeating the same content in three boxes. 390px dark: the bordered lite
table inside the RMA demo reflows without column-width breakage (contrast
with Key-value's batch-3 finding, where a similar-looking table claim turned
out false) — checked directly, confirmed true.

**Verdict:** keep everything. No findings.
