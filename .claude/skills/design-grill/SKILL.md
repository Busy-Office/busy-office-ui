---
name: design-grill
description: Apply the Ive filter (ROADMAP.md Objective §4) to one named screen or component — measured inputs first, then the ten questions, then a verdict per element. Trigger with /design-grill <screen>.
---

# /design-grill — the Ive filter, applied to one screen

Grill ONE named screen (a `/patterns/*` page, a component demo, or the docs
shell itself) against the design principles in **ROADMAP.md → Objective**,
especially §4 *Design the decision, not the screen*. The output is a verdict
per element, not prose admiration.

The core question is never "how can this look better?" — it is:

> **What can I remove so the essential thing becomes obvious?**

## Non-negotiables (this project's own rules apply to this skill)

- **Measure before judging.** Every claim about the screen carries a number or
  a rendered screenshot. Use the live bind-mounted container, 1440 + 390, both
  themes. An instrument's first output is not evidence — reconcile.
- **A verdict per element, each with a citation.** "Keep / remove / demote /
  reword", one line of why. No element skipped; skipping is how decoration
  survives.
- **Refusals are recorded**, in the report and (if roadmap-worthy) triaged with
  the reason — same as every other grill here.
- Findings land in `.roundtable/design-grill-<screen>-<date>.md` and anything
  actionable is triaged into ROADMAP.md with Accept criteria.

## Step 1 — name the decision

Before opening the page, write down: **who sits in front of this screen, and
what single decision must it let them make?** If the answer is two decisions,
that is already finding #1. Check the page's own opener ("Who uses it / what
done looks like") against your answer — disagreement is finding material.

## Step 2 — measured inputs

Collect, at minimum:

- **Primary-action count** — visually primary controls (`bo-btn` without
  secondary/ghost/sm modifiers) in the demo region. >1 needs a defence like the
  wizard's (never both visible).
- **Hierarchy scan** — first three things a reader meets in DOM order. Do they
  answer *what is this → what should I look at → what should I do*, in that
  order?
- **Element census** — count interactive elements, fields, badges/chips, and
  distinct colours carrying meaning in the demo region.
- **State language** — every status string on the screen. Flag any that names a
  mechanism (`data-state`, codes, flags) where the user needed a meaning.
- **Chrome ratio** at 390 if anything sticks (precedent: object-page went
  33% → 19%).

## Step 3 — the ten questions

Answer each with evidence, not vibes. A "no" carries its consequence:

| # | Question | On "no" |
|---|---|---|
| 1 | Is the primary purpose statable in one sentence? | redesign the brief, not the pixels |
| 2 | Is the primary action obvious within one screenful? | fix hierarchy |
| 3 | Can something be removed without reducing the user's ability to decide? | remove it — then ask again (20 → 12 → 7 → 4) |
| 4 | Does every element have a stated purpose? | remove the ones that don't |
| 5 | Does the interface explain itself without a manual? | reword to meaning, not mechanism |
| 6 | Is complexity hidden under the interface, not in the mental model? | absorb it into the framework |
| 7 | Is there decoration — colour, borders, icons carrying no state? | remove it |
| 8 | Are loading / empty / error states immediately understandable? | improve the state, not the caption |
| 9 | Does the interaction preserve context (no needless dialogs, focus never lost)? | simplify the flow |
| 10 | Built from zero today, would it look like this? | name what momentum is protecting |

## Step 4 — verdicts and follow-through

- Table: element → verdict (keep / remove / demote / reword) → one-line why.
- Anything `remove` faces the same bar as any removal here: cost-to-remove
  (45.5) bounds the outcome, and CHANGELOG duty applies if it shipped.
- Write the report, triage actionables, commit both. Run the loop's usual
  verify (gates green, live at both widths and themes) if anything changed.

## What this skill is NOT

- Not a restyle pass. If every verdict is "keep", say so — a screen can pass.
- Not a replacement for the Objective's every-wake distillation; this is the
  deep version you run on demand.
- Not licensed to invent framework surface. Removal-first: the answer to most
  findings is deletion, demotion, or rewording — not a new component.
