# Design grill — Amount vs. Quantity consistency (2026-08-20)

Requested as `/design-grill flow:Amount Quantity`. Neither name is a
journey step (Request → Validation → … → Confirmation), so flow mode
didn't apply as written — clarified with the user: this grills
**consistency between the two components**, not a flow's handoffs.
Measured, not assumed, same discipline as every other grill here.

## Finding 0 — the pairing itself needs a correction, and the docs already make it

`.bo-amount` is a **read-only display** component (CSS-only, no JS,
domain-neutral — money, quantities, rates, unit prices all format
through it). `.bo-quantity` is an **editable input** (`type="number"` +
stepper buttons + `initQuantity()`). They are not structural siblings —
the actual editable sibling of Quantity is `.bo-money`, and Amount is
the read-only display BOTH of them hand off to.

This is not a gap: all three pages (`amount.astro`, `quantity.astro`,
`money.astro`) carry the **identical** "rule for this family" paragraph
verbatim, cross-linking all three. The framework already documents its
own shape correctly. Grilled all three below — Amount vs. Quantity as
asked, plus the corrected pair (Money vs. Quantity) since that's where
real asymmetry showed up.

## Finding 1 — shared plumbing is genuinely consistent (keep)

Both `initQuantity()` and `initMoneyField()` derive decimal precision
through the same `setInputDecimals`/`decimalsOverride` utility
(`utils/decimal-input.ts`), with the identical override-priority shape:
`data-decimals` on the selected option → `data-decimals` on the
container → a built-in table (units for Quantity, ISO 4217 minor units
for Money) → default. This is the "decimal-input util under money +
quantity" merge Objective principle 2 already cites as precedent — a
real, live strength, not just a claim. **Verdict: keep, no action.**

## Finding 2 — the stepper asymmetry is justified (keep)

Quantity has increment/decrement buttons with boundary-disable logic;
Money has none — only currency-driven reformatting. Confirmed this is a
domain distinction, not neglect: incrementing a quantity by one unit is
a common ERP action, incrementing money by its minor unit via a button
is not. Verified live: at `min=0`, the `−` button's `disabled` property
is genuinely `true`; at `max=10`, `+` is genuinely `true` (checked via
`element.disabled`, not a screenshot). **Verdict: keep, difference is
correct.**

## Finding 3 — Money's docs are measurably thinner than Quantity's (real gap)

Section count, read from each page's own `<h2>`s:

| Quantity (11 sections) | Money (5 sections) |
|---|---|
| Basic | Basic — precision follows currency |
| With a unit | Your data wins — `data-decimals` override |
| **Read-only display — use Amount** | *(no equivalent)* |
| Interactive unit — precision follows it | *(no equivalent — no interactive-currency-changes-format demo distinct from Basic)* |
| Fractional units — step IS the precision | *(no equivalent)* |
| Unit decimals reference (full table) | Currency decimals reference (has this one) |
| **At a boundary** | *(no equivalent — arguably justified, money has no natural min/max)* |
| Inside a form field (validation) | Inside a form field (has this one) |
| **In a table column** | *(no equivalent)* |
| **Large-target (warehouse-floor) variant** | *(no equivalent)* |
| Markup | Markup |

Three gaps read as genuinely missing rather than domain-justified:
- **No "Read-only display — use Amount" section.** Quantity has a
  dedicated demo showing exactly what to do for a read-only quantity
  (use Amount + `__unit`); Money's shared family paragraph makes the
  same claim but never demonstrates it. A reader who lands on Money
  looking for "how do I just SHOW an amount" has to go find Amount
  themselves.
- **No "In a table column" demo.** Money values inside a data-table row
  are an extremely common ERP shape (line items) — Quantity has this
  exact demo, Money doesn't.
- **No large-target/density variant demo.** Quantity explicitly shows
  the warehouse-floor density case; Money's docs never show it at
  `data-density="spacious"`, despite both components sharing the same
  density-token sizing per `quantity.css`'s own comment ("sizes with
  density like every other control").

"At a boundary" is NOT counted as a gap — money genuinely has no
min/max stepper concept, so there's nothing to demo. **Verdict:
demote/fix — add the three missing sections to `money.astro`,
matching Quantity's coverage.**

## Finding 4 — sidebar taxonomy contradicts the family's own stated split (real gap)

`apps/docs/src/layouts/Gallery.astro`:
- **"Data input"** group: Forms, Combobox, Filters, **Money field**, Tag
  input, File upload, Rich text.
- **"Values"** group: **Amount**, **Quantity**, Date, Key-value facts.

Quantity is editable (real input, stepper, keyboard, validation) — the
same category of thing as Money — but sits in "Values" next to
read-only Amount, not in "Data input" next to Money. A user scanning
the sidebar for "editable numeric fields" finds Money in one group and
has to already know to look in a differently-named group to find
Quantity. The taxonomy groups by a criterion ("is this a form control"
vs. "is this a value type") that the two most-related components in the
whole framework land on opposite sides of.

Two honest ways to fix it, and this is a genuine decision, not a
one-line typo:
- **(a)** Move Quantity into "Data input", next to Money — groups by
  editability, matches how a consumer actually searches ("I need to let
  someone type X").
  Amount stays alone in a smaller "Values" group with Date/Key-value
  facts — arguably too small a group afterward (down to 3 items).
- **(b)** Move Money into "Values", next to Amount/Quantity — groups by
  domain/family, matches the shared "rule for this family" paragraph
  every page already states. "Data input" loses its most complex
  member.

Leaning **(a)**: "Data input" is a stronger, larger existing group and
the split already has 7 members; a consumer's actual task ("build a
form") is better served by editability-based grouping than by domain
grouping, and the family relationship is already fully cross-linked in
prose on all three pages regardless of which sidebar group they sit in.
**Verdict: rethink — needs an owner call on (a) vs (b), not built in
this grill.**

## Verdict summary

| Finding | Verdict |
|---|---|
| 0. Amount/Quantity aren't real siblings; Money/Quantity are | Correction stated, already well-documented in prose |
| 1. Shared decimal-precision plumbing | Keep |
| 2. Stepper only on Quantity, not Money | Keep — domain-justified |
| 3. Money's docs thinner than Quantity's (3 missing sections) | Fix — queue as a build item |
| 4. Sidebar splits the editable pair across two groups | Rethink — needs an owner call on (a) vs (b) |
