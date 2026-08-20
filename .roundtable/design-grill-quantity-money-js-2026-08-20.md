# Design grill — Quantity & Money: do they need JS? Server-side? External? (2026-08-20)

Owner-requested architecture grill: justify each piece of JS these two
components ship against the alternatives — no JS at all, a server-side job
(this is an htmx-first framework), or external/consumer-supplied JS.
Evidence gathered from the shipped behaviors (`quantity.ts` 113 lines →
5.0k unminified per-file; `money-field.ts` 59 lines → 2.4k; shared
`decimal-input` util), the docs' own claims, and what `examples/po-app`
actually uses.

## The inventory — what the JS actually does

| Behavior | Responsibilities |
|---|---|
| `initQuantity()` | (1) +/− click stepping, clamped + float-quantized; (2) boundary disable sync at min/max; (3) unit-select change → re-derive `step`/decimals from the built-in unit table |
| `initMoneyField()` | currency change → re-derive the amount input's `step`/decimals from the ISO 4217 table, lossless reformat |

## Verdicts per responsibility

**Quantity stepping — keep, client-side (keep).** The input is a native
`type="number"`: typing, ArrowUp/Down, and validation work with ZERO JS,
and the page says so ("without it the buttons are inert, but the input
itself still works"). The buttons exist for the touch/warehouse case —
exactly the context where a server round-trip per +1 click is
indefensible latency. Server-side stepping fails the framework's own
htmx doctrine (server owns DATA, not per-click UI micro-state); native-
only fails the RF/glove use case the spacious density tier exists for.
The float quantization (0.28 + 0.01 ≠ 0.29000000000000004) is a
consequence of stepping being client-side, correctly co-located.

**Boundary disable sync — keep.** Cannot be CSS (no value-vs-max
comparison in CSS); the native input clamps on its own, so this is pure
progressive enhancement, and the docs already instruct rendering the
correct initial `disabled` server-side.

**Money precision — keep as the default, with the server-side
alternative now DOCUMENTED (was the gap).** The `step` attribute is
presentation state; deriving it client-side is zero-latency and works on
a static page. The ISO 4217 table is an already-settled, named exception
("built-in but overridable", Slice 18 owner call — re-cited, not
re-litigated). But the owner's question "should it be a server-side
job?" deserved a documented answer, and the Money page had none — unlike
Quantity, it never stated its no-JS story. **Fixed: one new ApiTable
note** stating all three tiers: JS optional (controls still work,
precision just doesn't auto-follow); htmx apps can skip the behavior and
re-render the input with the new `step` on currency change (`hx-get` on
the select) — same outcome, server-owned; single-currency forms need
neither (plain `.bo-input--numeric`, currency in the label).

**External JS — refuse.** The behaviors are already effectively
external: per-behavior tree-shakable dist files (2.4k/5.0k unminified),
call-once, imported only if wanted, nothing global. A separate package
would add an install step to save 7.4k of source nobody is forced to
ship. po-app is the live proof of optionality: **it imports neither
behavior** — every amount it captures is a plain `.bo-input--numeric`
with a fixed currency, which is precisely what the family decision tree
prescribes for a single-currency app. The framework's opt-in story
works in practice, not just in prose.

## Incidental finds (fixed in this pass)

**A rendered ApiTable note claimed `.bo-quantity--display` exists.** The
quantity page's own "Read-only display" section says the modifier was
removed before it reached a release (grill 2026-08-19) — yet its
ApiTable's last note still described `--display` as "the read-only
form", and a dead `display` const still carried markup for the
nonexistent class. Neither gate could catch it: `check-markup` verifies
rendered markup (the const was never rendered) and the notes gate checks
notes render as prose, not that their claims are true. Both deleted.

**One stale "Money field" Related label** on the quantity page — the
78.2 rename's follow-through. Fixed to "Money".

## Verdict summary

| # | Element | Verdict | Why |
|---|---|---|---|
| 1 | Quantity stepping JS | keep (client) | native works JS-free; buttons are the touch affordance; round-trip-per-click indefensible |
| 2 | Boundary disable sync | keep | not expressible in CSS; progressive enhancement over native clamping |
| 3 | Money precision JS | keep + document alternatives | presentation state; server-side path now a documented one-liner, not a missing answer |
| 4 | Moving behaviors to an external package | refuse | already per-file opt-in at 2.4k/5.0k; a second install step buys nothing |
| 5 | `--display` ApiTable note + dead const | remove | claimed a modifier the CSS doesn't have and the page's own prose says was removed |
| 6 | "Money field" Related label | reword | 78.2 rename follow-through |
