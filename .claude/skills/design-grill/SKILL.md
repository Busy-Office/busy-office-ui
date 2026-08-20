---
name: design-grill
description: Apply the Ive filter (ROADMAP.md Objective §4) to one named screen — or to a whole journey with flow mode. Measured inputs first, then the ten questions, then a verdict per element (or per handoff). Trigger with /design-grill <screen> or /design-grill flow:<a> > <b> > <c>.
---

# /design-grill — the Ive filter, applied to one screen (or one journey)

Grill ONE named screen (a `/patterns/*` page, a component demo, or the docs
shell itself) against the design principles in **ROADMAP.md → Objective**,
especially §4 *Design the decision, not the screen*. The output is a verdict
per element, not prose admiration.

**Flow mode** (`/design-grill flow:<a> > <b> > <c>`) grills a JOURNEY instead
of a screen — see the "Flow mode" section at the end. Everything before that
section describes single-screen mode.

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

## Flow mode — grilling a journey, not a screen

Triggered as `/design-grill flow:<a> > <b> > <c>` where each name is a
pattern page, a po-app route, or a screen the user names. Grounded in
Objective §4's journey clause: the unit of design is Request → Validation →
Exception → Resolution → Approval → Execution → Confirmation, and a
beautiful screen inside a terrible workflow is still a bad product.

Single-screen questions still apply to each step (run the light version:
primary-action count, state language), but the flow-specific work is the
**handoffs** — grill each SEAM, not each screen:

1. **Name the journey's decision** first, same as Step 1 names a screen's:
   what does the user have decided/accomplished when the whole flow is done?
   If two journeys are tangled in one flow, that is finding #1.
2. **Walk it live, in order, in one browser session** — never grill steps
   from separate fresh loads; carried state IS the subject. Use the live
   container, drive real clicks/keys.
3. **Per-handoff measured inputs**, for every seam a→b:
   - **Context survival** — what the user selected/typed/filtered at `a`:
     still present at `b`? (Precedent: the mass-change 422 preserving
     selection; htmx focus restored only to a matching id.)
   - **Entry honesty** — does `b` assume state that `a` doesn't produce?
     Land on `b` directly (deep link, refresh) and see what breaks.
   - **Exit clarity** — at the end of `a`, is the way INTO `b` the obvious
     next action (the primary action, or an automatic swap), or does the
     user have to hunt?
   - **Failure return path** — when `b` rejects (422/409), does the user
     land back in `a`'s context with their work intact, or start over?
   - **Focus/keyboard across the seam** — where does focus land after the
     transition? A keyboard user dumped on `<body>` fails the seam.
4. **The flow questions** (replacing the ten where they don't apply):

   | # | Question | On "no" |
   |---|---|---|
   | F1 | Is the journey's end state statable in one sentence? | redesign the flow, not the screens |
   | F2 | Does each step's exit land at the next step's entry with context intact? | fix the handoff |
   | F3 | Can a STEP be removed — does merging two steps lose anything? | merge them |
   | F4 | Does any step exist only to bridge two others? | fold it into an exit |
   | F5 | After an error, is the user's prior work still there? | fix state preservation |
   | F6 | Can the user tell, at every step, how far along they are and what remains? | add orientation (or cut steps until it's obvious) |
   | F7 | Walked backwards (browser Back), does each step still make sense? | fix history/state handling |

5. **Verdicts per seam** (keep / fix-handoff / merge-steps / split-journey),
   same evidence discipline as per-element verdicts. Report lands in
   `.roundtable/design-grill-flow-<a>-<b>-<date>.md`; actionables triage into
   ROADMAP.md with Accept criteria, same as single-screen mode.

## What this skill is NOT

- Not a restyle pass. If every verdict is "keep", say so — a screen can pass
  (and a flow can pass).
- Not a replacement for the Objective's every-wake distillation; this is the
  deep version you run on demand.
- Not licensed to invent framework surface. Removal-first: the answer to most
  findings is deletion, demotion, or rewording — not a new component. In flow
  mode the removal-first target is STEPS and HANDOFF friction, not widgets.
