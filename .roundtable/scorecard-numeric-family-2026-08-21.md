# Design-System Alignment score (DSA) — instrument + numeric-family pilot (2026-08-21)

**Owner direction:** the score measures how much a component's design
ALIGNS with the design system — a different question from the Slice 37
worth rubric (keep/improve/deprecate), which stays in force for its own
purpose. Two instruments, two questions:

- **Worth** (`surface-review-rubric.md`, now /15 with Fit) — is this
  component worth its surface? Decides keep/improve/merge/deprecate.
- **DSA** (this instrument) — does its design follow the system? Decides
  where alignment work goes, and gives the owner one number per
  component for "how on-direction is this."

## The DSA instrument

Seven dimensions = the design system's own rules (the six on
`/concepts/design-language` + the Fit doctrine from the field matrix).
Each scored 0-3 **with a checkable citation** (a gate, a grep, a
measured check — the same one-rule as the worth rubric). A rule that
does not apply to a component is **N/A and leaves the denominator**
(score = points / (3 × applicable rules), reported as %) — a display
span isn't penalized for having no interaction story.

| Dimension | 3 means | Cheap signal |
|---|---|---|
| Hierarchy | introduces no competing primary affordance; demos hold ≤1 primary | primary-action count in its demos |
| Typography | sizes only from density/type tokens | grep for raw font-size literals in its CSS |
| Colour | semantic tokens only; state is two-channel; pairs contrast-gated | `check:contrast` coverage + zero raw hex |
| Spacing | dimensions from tokens; raw literals only where intrinsically dimensional (a min-content floor), each commented | grep for px/rem/em literals |
| Interaction | native-first; context preserved; focus never lost | behavior contracts + claims |
| Content | its UI strings and docs name meaning, not mechanism | state-language scan of its page |
| Fit | prescribed contexts match the field matrix; wrong contexts named on its page | the matrix vs. its docs |

## Pilot — the numeric family

| | Hier. | Typo. | Colour | Spacing | Inter. | Content | Fit | DSA |
|---|--:|--:|--:|--:|--:|--:|--:|--:|
| `money` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** (20/21) |
| `quantity` | 3 | 3 | 3 | 2 | 3 | 3 | 3 | **95%** (20/21) |
| `amount` | 3 | 2 | 3 | 3 | N/A | 3 | 3 | **94%** (17/18) |

**Citations.**
- *Hierarchy 3 (all):* none introduces a primary-styled control; the
  stepper buttons are `--secondary` with `tabindex="-1"`.
- *Typography:* money/quantity 3 — `font-size` only via
  `--bo-density-font-size` (via the absorbed `.bo-input` base); amount 2 —
  two raw `0.875em` affix sizes (`amount.css`), functional but not a
  token step; candidate for a `--bo-font-size-*` alias.
- *Colour 3 (all):* zero raw hex (grepped); pairs in `check:contrast`;
  amount's negative/positive is the two-channel signature contract.
- *Spacing:* money 2 — `6rem`/`9rem` min/max floors, the 6rem commented
  (89.2), the 9rem not; quantity 2 — `3rem`/`12rem` floors uncommented,
  `1px` is the border-width token's value written raw in the joint rule;
  amount 3 — gaps/margins all tokens.
- *Interaction:* money/quantity 3 — native inputs/selects first, lossless
  reformat dispatches real `input` events so dirty-tracking composes,
  boundary sync progressive; amount N/A — a display span, no interaction
  surface (correctly refused an input variant).
- *Content 3 (all):* captions and states name meanings; the family
  paragraph is the exemplar.
- *Fit 3 (all):* each page names its contexts per the matrix, including
  where a design does NOT belong (steppers; the crammed joined widget).

**What the pilot already tells the owner:** the family is on-direction
(94-95%); the deductions are three uncommented raw dimension literals
and two `em` affix sizes — small alignment items, queued as 92.5.
Full-surface DSA scoring proceeds in batches alongside the worth
rubric's 37.2.
