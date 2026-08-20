# Standardize sweep — the systemic Spacing habit (roadmap 94.2)

2026-08-21. Dispatched by the counter at **4/4 Continue rounds**. Target chosen
from the backlog: 94.2, elevated by batches 1-2 as *one habit, not eleven
defects*.

## What was done

Fourteen intrinsic dimension literals across ten components now carry a comment
stating **why the number is intrinsic** — not a token tier, per 94.2's
resolution (tokenising a chevron's `1em` renames it without explaining it).

| Component | Literal(s) commented | The reason now recorded |
|---|---|---|
| `money` | `9rem` cap | an amount holds digits, not prose; must not stretch and read as a text field |
| `quantity` | `12rem` cap, `3rem` floor | same pair as Money, sized for a control that can carry two steppers + a unit select |
| `tree` | `1em` chevron slot | one character advance width, so open/closed rows keep label alignment |
| `tree-table` | `1.5em` toggle box (×2 sites) | one compact line box — fits without forcing the row taller; `__spacer` repeats it for leaf alignment |
| `ordered-list` | `1.75rem` gutter, `0.15rem` item padding | gutter sized for the widest marker (`12.`); padding deliberately below the smallest space token |
| `form` | `6rem` clearance, `1rem` checkbox box | clearance must exceed the action bar (WCAG 2.4.11); the checkbox is the platform's own size |
| `combobox` | `12rem` min, `16rem` max | min protects option legibility from a narrow trigger; max keeps the popup inside the viewport |
| `filters` | `0.125rem` chip hug | half a space step so a chip row reads as tokens, not buttons |
| `tag-input` | chip hug, `1rem` remove box, `6rem` field floor | same chip rule; remove box conforms via 2.5.8 spacing exception; floor keeps the next-value field typeable |
| `data-table` | `1.75rem` compaction heights | see 94.3 — the comment records a *divergence*, not a justification |

All ten re-score to **3 on Spacing** in `dsa-scores.json`.

## Two comments make executable claims — both were run

Per the "claims that assert runtime behavior must be executable" rule, the
`tag-input` and `checkbox` comments cite the WCAG 2.5.8 **spacing exception**
rather than a 24px floor. `check:target-size` names both in its passing output:

```
bo-tag-input__remove 16x16 (nearest 91px); bo-checkbox 16x16 (nearest 185px)
```

So the route each comment claims is measured on the rendered page by a gate
that already runs in CI, not asserted from the source.

## Verification

The CSS change is documentary only. The **README size-stamp check passing**
proves the minified `dist` is byte-identical — comments are stripped — which is
stronger evidence that rendering cannot have regressed than a screenshot would
be. What *does* render is the score text, asserted against the built artifact:
every one of the ten pages shows `Spacing 3 / 3` with its new citation, and
`money`/`quantity` correctly drop their "Known gaps" line.

Green: core build, `lint:css`, full docs build (link check 8712, page-shape,
markup, learning-path, components-used), `check:target-size`.

## Three of the fourteen citations were wrong

Reconciling the batch's citations against the source **before** editing — rather
than trusting them — is what earned the two queued items. Rate: **3 of 14
misread**, consistent with the project's stated base rate that an instrument's
first output is wrong until checked.

- `filters` — "the 1rem icon box is uncommented". It has carried
  `Visual size 16px, hit area 24px (WCAG 2.5.8)` since 2026-08-17.
- `tree` — "1.25em indent … uncommented". It states its em-relative reason.
- `quantity` — "a raw 1px in the joint rule". **No such declaration exists.**
  The string is inside a *comment* describing a `calc(var(--bo-border-width) *
  -1)`. This is the documented comment-injection trap, hit by a scoring pass
  rather than by a gate.

Had the citations been applied as written, three comments would have been added
that repeat an existing note or explain a literal that is not there.

## Found, and queued rather than fixed

- **94.3** — `data-table`'s auto-compaction is a fourth density nobody designed:
  it claims "coherent compact" in its own comment and diverges from compact in
  two of six aliases, while duplicating a third as a literal. Values date to the
  initial commit. Comment corrected; **values deliberately not touched**, since
  matching compact changes rendered row heights and needs live verification.
- **94.4** — the rubric no longer discriminates. With Spacing resolved, **12 of
  14 components read 100%** (`{94%: 1, 95%: 1, 100%: 12}`), and the trigger
  clauses have never fired. Spacing was the only dimension that ever varied.
  Scoring the remaining 23 components before addressing this spends five batches
  to learn nothing.

## Refused

- **A spacing token tier for these numbers.** 94.2 already decided this and the
  sweep confirms it: `1em` for a chevron slot, `1rem` for a native checkbox, and
  `6rem` for an action-bar clearance are not points on a spacing scale. A token
  would give each a name without giving it a reason, which is what the score was
  actually reporting as missing.
- **Fixing 94.3 in this wake.** It is a rendered-layout change to the densest
  surface in the framework, discovered incidentally; shipping it inside a
  comment sweep would put an unverified height change under a commit that claims
  to change nothing visible.
