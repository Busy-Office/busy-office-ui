# Grill — the ERP suite as an instrument, and whether Slices 139/140 serve it

2026-08-24. Owner framing: *"let's grill them first. The purpose is to create
examples & find more use case so we can find what is missing from this UI
framework."*

That framing is the grill. Slices 139 and 140 were written as tidy decisions
about two ledger entries. The question here is different and harder: **do they
make the instrument find more?**

## Verdict

**139 survives and comes out stronger** — the evidence against my own
attribution checked out. **140.1 refused the right slice and closed the wrong
question**, which is a defect in my reasoning rather than in the outcome.
**140.2 is right but under-specified.**

And one finding larger than either: **130.4 is scheduled by DOMAIN, but every
gap this instrument has ever found came from a SHAPE or from STRESS.** Three
of the four remaining modules are more of the shapes already covered.

## The instrument's yield is falling, and the schedule explains why

Pilot 13 → module two 2 → module three 1. That reads like diminishing returns
on a working instrument. Categorising all seventeen by **what triggered them**
says something more useful:

| Trigger | Gaps | Examples |
|---|---|---|
| A **new shape** the screen had to express | 9 | two-level nav (1), document chain (2), count-in-a-segment (3), three-way match (4), transform statement (8/9/10), "Add a line" (12), partial chain step (14), totals row (16), create action (17) |
| **Stress** on an existing shape (a width, a count) | 4 | stack clips a scroller (6), form-actions won't wrap at 390 (7), grouped header over its last column (15), stepper markers overlap at five steps (18) |
| My bug or a doc/semantic defect | 4 | title as `<span>` (5), and the two logged then withdrawn (10, 11) |

**Zero gaps were caused by a new domain.** Module two was a different domain
and found two: one was a regression in the pilot's own fix, the other was the
totals row — *a new shape*. Module three was a different domain again and
found one: a five-step chain — *stress on an existing shape*.

So the instrument does not respond to domains. It responds to shapes it has
not drawn and to sizes it has not been squeezed to. Building four more
document-list-plus-detail modules is running the same experiment a fourth
time.

## 139 — survives, and the attribution held up under attack

The uncomfortable question first, because it is the one that would invalidate
the slice: **six of seven list screens have no create action, and I built four
of them. Is "the pattern page didn't say" a convenient way to avoid saying "I
forgot"?**

It is not, and the page settles it. `list-report.astro`'s **Anatomy is an
ordered enumeration of five regions** — saved-view switcher, filter bar,
toolbar, table, footer. It is not a vague page a careless reader could skim; it
is a checklist, and it has **no slot for a create action**. A builder working
region by region produces exactly the six screens that exist. The one line
that does mention a primary action puts it inside `.bo-state--empty`, a state
no populated screen renders.

That is also why an earlier audit of the same page concluded it covered the
list screen end to end: filters, toolbar, bulk actions and pagination were all
present and correct, and none of them create anything.

**Under the instrument's own purpose, 139 rates higher than I first argued.**
A gap that makes a builder omit the same region six times across three modules
is not documentation tidying — it is the instrument finding a defect that
*propagates*. That is the most valuable class of finding it can produce,
because the cost scales with adoption.

One correction to my own slice: it must fix the **Anatomy**, not only the
states table. The states table is where the omission is visible; the Anatomy
is where it is *caused*.

## 140.1 — right refusal, wrong question closed

Refusing to invent a Projects module to host one widget: **correct, and I
stand behind it.** There is no Projects module on the rail, the reference
screenshot showed uniform gray cells, and GAP-1's rejected sticky-rail
speculation is the standing rule.

But I closed more than I was entitled to. I refused *"a GitHub contribution
heatmap"* and treated the underlying question as disposed of. Reframed as an
ERP need it does not disappear:

> **Does the framework have any way to show INTENSITY over a long date grid?**
> Machine or line utilisation across a quarter. Stock-movement density by day.
> Absence patterns across a year. These are ordinary ERP reporting shapes, and
> they are not GitHub's.

Measured, not assumed:

- `schedule` is a **month grid for discrete bookings** — what is on a day, not
  how much across a year.
- `timesheet` is **numeric entry for one period**, not an intensity plot.
- `calendar` is a scheduling month-grid, as the watch-item note already said.
- The colour ramp **does** exist — `dist/scales.json`, eleven steps per hue —
  but there are **no `bo-scale` CSS utilities**. The ramp is a token artefact,
  not something markup can apply.

So an intensity grid today needs either inline styles picking ramp steps —
which the suite's zero-local-CSS gate forbids, and which is precisely how this
instrument detects a gap — or new framework surface. **And the two-channel
rule sharpens it**: intensity by colour alone is already refused by this
framework's own doctrine, so any answer has to carry a second channel (the
number in the cell, a title, a pattern). That is an unsolved design problem,
not a missing widget.

**This does not resurrect the Projects slice.** It relocates the question to a
module that is already scheduled: **Production capacity** is the ERP-native
form of it, and 130.4 builds Production. The correct action is a prediction
recorded against that module, not a new one.

## 140.2 — right, but a note is weaker than an item

Folding the MRP panel into 130.4 is the right call: Production is coming, so
the shape gets tested against a real screen instead of a screenshot. Two
weaknesses worth naming:

1. **I asserted GAP-8 covers it without testing.** GAP-8's answer — restate
   the action's effect in the primary button label — is plausible for
   "Get Raw Materials For Production", and plausible is the word. It is a
   prediction, and it should be written as one so that being wrong is
   informative.
2. **A note inside a checked item is easy to lose.** It survives only if
   whoever builds Production reads the item's body. Recording it as a named
   prediction with an expected outcome makes it checkable.

## The change worth making — turn 130.4 into a real experiment

The instrument's remaining value is not four more modules; it is the shapes
those modules force. Ordered by what they would newly stress:

| Module | New shape it forces | Predicted yield |
|---|---|---|
| **Production** | BOM as a multi-level hierarchy with rolled-up quantities; capacity/utilisation over time; the MRP derived-action panel | **highest** |
| **Inventory** | stock by item × warehouse — a **matrix / cross-tab** | **low-medium, revised down mid-grill** |
| **Finance** | journal entry (an editable grid that must balance to zero before posting), payment (list + detail) | **low — shapes already covered** |
| ~~CRM~~ | done: master data, five-step forecast chain | 1 gap, as predicted |

**Write the prediction down before building.** If Finance is built and finds
zero, that is not a wasted module — it is the thesis confirmed, and it is the
evidence for stopping at shape coverage rather than domain coverage. If it
finds three, the thesis is wrong and domain still matters. Either way the
instrument learns something, which is more than "build the next one" offers.

## Objective test on the reordering

- **Accept** — it makes one general rule (*cover shapes, not domains*) replace
  a list of specific asks, and it lets the roadmap **delete** work rather than
  add it: if the thesis holds, Finance and the remaining list/detail pairs can
  be dropped or thinned.
- **Refuse** — inventing a module to host a widget (140.1 stands).
- **Rethink** — 130.4's framing. It is not wrong, it is measuring the wrong
  variable.

## What this grill does NOT establish

- **The intensity grid is a candidate, not a confirmed gap.** Nothing has been
  built that needed it. It gets a prediction against Production, and the rule
  that logged GAP-1's speculation as refused still applies: it becomes a gap
  when a screen hits it.
- **The matrix/cross-tab prediction was wrong when first written, and is
  corrected here rather than quietly dropped.** I rated Inventory "high" on
  the assumption that no pattern covered a cross-tab. Checking instead of
  assuming: `comparison` documents a **candidates × criteria** grid, and
  `data-table` already ships **`--sticky-col`** and `data-sticky-cols`
  alongside its sticky header — so the hardest part of a cross-tab, holding
  the row header still while both axes scroll, is already solved. The residual
  question is narrow: does a *data* cross-tab (many × many, scanned for a
  number) need anything a *decision* grid (few × few, pick one) does not? That
  is worth one screen, not a high expectation.

  Worth noting what this near-miss demonstrates: the same reflex that produced
  "no pattern page covers it" is the one that produced GAP-1's sticky-rail
  speculation. Absence of a docs page is not absence of a capability.
- **The yield table predicts; it does not measure.** Its whole value is that
  it can be wrong in a way anyone can check.
