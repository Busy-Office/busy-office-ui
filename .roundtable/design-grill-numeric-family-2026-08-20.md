# Design grill — the numeric family: Amount / Quantity / Money / "Number" (2026-08-20)

Requested as `/design-grill flow: Amount vs. Quantity vs. Money vs. Number`.
Same treatment as the Slice 76 grill (not a journey — a family-consistency
grill), extended to the fourth member the request names: **"Number" is not a
component** — it is `.bo-input--numeric`, a modifier on the plain input
(`form/input.css:83`), and that fact is itself the thread most findings hang
off. Everything below is measured live in the running container, not read
from source alone.

## The four members, measured

| Surface | Role | `font-variant-numeric` (live) | `text-align` (live) |
|---|---|---|---|
| `.bo-amount` | display, any numeric value | `tabular-nums` | inline (cell decides) |
| `.bo-money__amount` | edit, selectable currency | `tabular-nums` | `end` |
| plain `.bo-input--numeric` | edit, fixed-currency / unitless | `tabular-nums` | `end` |
| `.bo-quantity__input` | edit, count | **`normal`** | `center` |

## Finding 1 — Quantity's input has the family's one real rendering defect (fix)

`.bo-quantity__input` is the only numeric surface in the framework rendering
**proportional figures** — and the tabular declaration that should be on it
sits on `.bo-quantity__step` instead: the +/− buttons, which display no
digits at all (`quantity.css:19` vs. the input rule at `:32`). Confirmed
live, not just in source: computed `fontVariantNumeric` is `tabular-nums` on
the button and `normal` on the input. Exactly inverted from intent.

Impact is small (a centered single value doesn't column-align against
anything) but the family's own stated contract is "tabular figures so every
row lines up digit-for-digit" (`amount.css:5`), and a quantity stepped from
1→2 visibly shifts width with proportional figures. **Fix: move
`font-variant-numeric: tabular-nums` from `__step` to `__input`** — the
`__step` copy is dead weight (subtraction applies), the `__input` gets what
was meant for it.

**Examined and kept:** `text-align: center` on the quantity input diverges
from every other member's `end` — deliberately. The value sits between the
−/+ buttons; centering it between its two operators is the standard stepper
idiom, and end-aligning it against the + button would read as attached to
one side. Keep.

## Finding 2 — `amount.astro`'s editable-money advice is stale, contradicting its own page (fix)

The "Editable money — a plain input, not `.bo-amount`" section says: *"For
an EDITABLE money field, compose `.bo-form-field` + `.bo-input--numeric`
directly — the currency belongs in the label."* That was written 2026-08-14
(`01a6bad`). `.bo-money` shipped 2026-08-16 (`d8b81d8`) — and this section
was never reconciled. The result is a page that contradicts itself: its own
family-rule opener says *"capturing one is **Money**'s (currency) or
Quantity's (count)"*, then five sections later it presents the plain input
as THE answer for editable money, never mentioning `.bo-money` at all.

The plain-input advice isn't wrong — it's the right answer for a
**fixed-currency** field (the demo's own "Unit price (USD)" is exactly
that case). It's stale because it presents one branch as the whole tree.
**Fix: reword the section to state both branches** — currency selectable →
`.bo-money`; currency fixed → plain `.bo-input--numeric` with the currency
in the label — and link the Money field.

## Finding 3 — the family rule names three members; four exist (fix)

The shared "rule for this family" paragraph (identical on all three pages)
says: one display component (Amount), two entry components (Money,
Quantity). But the framework's own docs use a **third entry path** in at
least four places (`form.astro`, `amount.astro`'s editable demo,
`tabs.astro`, `inline-editing.astro`): the plain `.bo-input--numeric`, for
values that are neither a selectable-currency amount nor a steppable count —
a rate, a fixed-currency price, a percentage. A consumer holding "which of
these do I use?" gets a decision tree that's missing a branch that the
docs themselves rely on.

**Fix: extend the shared paragraph by one sentence** naming the plain
numeric input as the entry path when neither currency-selection nor
count-stepping semantics apply. One sentence, same paragraph, all three
pages (kept verbatim-identical, as they are today).

## Finding 4 — `form.astro`'s Amount field teaches a third, divergent recipe (reword, second tier)

`form.astro:34` shows an Amount field as a type-less input holding a
formatted value (`value="4,208.00"`, `inputmode="decimal"`, no `type`, no
currency in the label) — different from `amount.astro`'s editable recipe
(`type="number"`, plain machine value, currency in the label). Two pages,
two conventions for the same field shape. The forms page is a form-anatomy
demo, not a numeric-entry lesson, so this is second-tier — but as the page a
first-time user most likely reads first, it shouldn't quietly teach a
convention the family pages contradict. **Fix: align it with the
amount.astro recipe** (label "Amount (USD)", `type="number"`,
`step="0.01"`, unformatted value).

## Verdict summary

| # | Element | Verdict | Why |
|---|---|---|---|
| 1 | `tabular-nums` on `__step`, missing on `__input` | **fix** (move it) | inverted from intent; live-confirmed `normal` on the digits |
| 1b | `text-align: center` on quantity input | keep | deliberate stepper idiom — value between its operators |
| 2 | `amount.astro` editable-money section | **reword** | predates `.bo-money`, contradicts its own page opener |
| 3 | family-rule paragraph (3 pages) | **reword** | names 3 members; the docs themselves use a 4th |
| 4 | `form.astro` Amount field | **reword** (tier 2) | teaches a third convention the family pages contradict |
| — | a `.bo-number` component | **refuse** | nothing to build — `.bo-input--numeric` already is the fourth member; naming it in the docs closes the gap for free (principle 2: no second way) |
