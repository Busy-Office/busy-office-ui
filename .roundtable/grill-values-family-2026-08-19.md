# Grill — the Values family: display vs input (2026-08-19)

Owner ask: *Values → Amount & Quantity — grill display and input fields.*
Scored on the NEED/COST rubric (Slice 53). Measured, with counter-evidence.

---

## The hypothesis I started with was wrong, and that matters

Triage recorded this as *"three components, three different answers to 'does
this handle entry?'"* — Amount display-only, Quantity with a stepper, Money with
a currency select. Reading the pages instead of the class lists:

- **Amount** — "A money or quantity value, laid out to scan down a column."
- **Money** — "Editable money… **The read-only counterpart is Amount.**"
- **Quantity** — "A count field, **not a currency one — see Amount for money.**"

The rule already exists and each page already states it: **Amount displays;
Money and Quantity capture.** The split is by *value type*, not by mode, and the
pages cross-link (amount→money ×3, money→amount ×4). There is no inconsistency
to fix, and saying there was would have been the finding inventing itself.

---

## The real defect: two ways to display a count, and the purpose-built one is unused

| class | screens using it (demo regions only) |
|---|--:|
| `.bo-amount` + `__unit` — a count with a unit | 1 (`master-detail`) |
| `.bo-quantity` — the editable stepper | 3 (`editable-grid`, `field-editor`, `goods-receipt`) |
| **`.bo-quantity--display`** | **0** |

`.bo-quantity--display` exists to display a count. Its own source comment says
why it was built:

> *"Read-only display — the counterpart to the editable stepper, **closing the
> asymmetry with Amount** (which always had a display form). A span composition,
> no JS, no fixed width."*

**That is a symmetry argument, not a demand argument** — and the demand column
says so: zero screens. Meanwhile the docs' "Read-only display" section
recommends it, while every real screen displays counts with `.bo-amount` +
`__unit`. Documentation and practice disagree, which is the defect class 46.2
was built to catch.

### Scored

| | N1 demand | N2 correctness absorbed | N3 effort saved | N4 consistency | NEED | C1 composable | C2 payload | C3 runtime | C4 surface | COST | **NET** |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| `.bo-quantity--display` | 0 | 0 | 0 | 1 | **1** | 3 | 0 | 0 | 1 | **4** | **−3** |

N2 = 0 and N3 = 0 are not harsh: its own comment calls it "a span composition,
no JS, no fixed width". It absorbs no contract a consumer would get wrong, and
`.bo-amount` — which the screens already use — absorbs the same alignment and
tabular-figure decisions for every numeric value.

C1 = 3 because it is not merely composable in principle; **it is already
composed, by the component next door, in the one screen that needed it.**

---

## Cost to remove is ZERO, and only until 0.2.0 publishes

Per 45.5 the outcome is bounded by removal cost. Verified from two independent
sources:

```
npm view @busy-office/ui versions   ->  [ '0.1.0', '0.1.1' ]
--display present at v0.1.1         ->  0
--display present at the v0.2.0 tag ->  2   (tagged, never published)
```

**No consumer can have this class.** That makes it a cost-0 row — "never
published… removable now" — rather than the deprecate-and-wait-for-next-major
path `.bo-date` required. It is also time-limited: the moment 0.2.0 reaches the
registry, this becomes a next-major job for a class nobody asked for.

→ **Remove `.bo-quantity--display` and `.bo-quantity__value`** (the latter exists
only to serve it), and point the docs at `.bo-amount` with `__unit`.

**Counter-evidence, stated plainly:** naming symmetry has real value — a reader
looking at `.bo-quantity` may reasonably expect `.bo-quantity--display` to
exist, and sending them to a differently-named component is a small surprise.
The answer is that the surprise is cheaper than the class: the rule is one
sentence, it is now on all three pages in the same words, and `.bo-amount`'s own
opener already says it displays "a money **or quantity** value".

---

## The rule, now stated identically on all three pages

> **Displaying a value is Amount's job. Capturing one is Money's (currency) or
> Quantity's (count).** One display component for every numeric value; two entry
> components, split by what the value *is*.

## What was NOT changed, and why

- **No Amount input.** Refused. The editable counterpart already exists and is
  called Money; adding `.bo-amount--input` would be a second way to do one
  thing, which is what this grill just removed elsewhere.
- **Quantity keeps its stepper.** N2 is genuinely high there: min/max/step
  clamping, keyboard behaviour and validation all read from one native source of
  truth, which is exactly what consumers hand-roll wrongly.
- **Money keeps its currency select.** The ISO 4217 precision table and the
  lossless reformat are claim-asserted (roadmap 45.6) and not composable.
