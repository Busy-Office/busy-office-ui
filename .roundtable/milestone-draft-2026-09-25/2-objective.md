## Milestone M1 — Layouts and components for a long-use ERP app

> **DRAFT, round 2 (2026-09-25). Not active.**
> - **Who edits it.** The owner edits this section. The loop reads it and never
>   edits it. `scripts/loops/milestone.py` (built by 393.4) parses the fields in
>   the first fenced block under this heading. It refuses to print a verdict if
>   a field is blank, still reads `OWNER`, or holds an unknown value.
> - **Where it goes.** Directly below `## Objective`. It does not replace the
>   Objective: every item this milestone files must still pass the Objective's
>   accept/refuse/rethink tests.
> - **How it activates.** The owner sets `Status: ACTIVE <date>` only when both
>   hold:
>   - 393.10 reports a loop-doctor mean of at least 3.0 with no dimension at 1;
>   - every `OWNER` blank below is filled in.

```
Status: DRAFT
Precedence: interleave 1/3 track=defect          # OWNER: preempt | interleave 1/N track=defect | after <item-id>
Rules-2-3: scoped                                 # OWNER: normal | scoped | suspended
Dispatcher: local                                 # OWNER (O1): local | local+auditor | both
Tiers: top=OWNER · balanced=OWNER|none · fast=OWNER|none
Planner: top                                      # OWNER (O14): the tier the planner route uses
Direction-drift: off                              # OWNER (O16): off | N=<landings> X=<percent>
Budget: m0-wakes OWNER · wakes OWNER · agents/wake OWNER · workflow-wall OWNERm · experimental 2 · resume-lines 120 · direction-items 5
Stop: HALT | foreign-commit | budget | 2-wakes-no-progress | 2-wakes-plan-only | one-way-door
```

### The decision it serves

The owner is building a long-lived ERP application suite. Humans and AI coding
agents will compose its screens, for years, across modules:

- Home
- Profile
- Configuration
- Finance
- Sales
- Distribution
- Inventory
- Procurement
- Production Planning
- the modules still to come

For every screen, whoever builds it (a person or an agent) has to decide three things:

1. **Which shape.** Which shape does this job need, and does the framework have it?
2. **Which parts.** Which parts compose it, and which are missing?
3. **What to do about a missing part.** Should it be built, and how, without
   breaking the framework's promise to everyone else?

This milestone gives those three decisions a durable answer. It builds:

- the app frame;
- shape-named layouts;
- the components those layouts need;
- a generated route from a module's words to the right shape.

Owner answer 3 (2026-09-25) sets the scope: "only layout and components … existing screen
… for reference only … freedom to design."

### Who it is for

1. **The owner's long-use app,** and any consumer app built on `@busy-office/ui`.
2. **An AI coding agent** composing a screen from the published package: `api.json`,
   `patterns.json`, `jobs.json` and `llms.txt`.
3. **The developer** who reviews that agent's work.

### The bet (each part can be proven wrong)

1. **Names.** Shape names outlive module boundaries. The evidence:
   - A published name is effectively permanent. `invoice-list` still had 162
     references in 94 files 34 days after it was renamed.
   - Module boundaries move. The owner's own artefacts cut modules three
     different ways.
   - The first user's AppSpec is keyed by 9 screen kinds. It has no module
     layouts.

   So every name the framework publishes is a shape name. Module words live
   only in demo data, in the job index and in the consumer.
2. **Gaps.** New modules expose new *shapes*, not new domains. The record so
   far: 9 of 17 gaps came from a new shape, 4 from stress and 0 from a new
   domain. Every module slice records its prediction before it builds, so this
   is re-tested module by module.
3. **Missing parts.** A missing part can ship early without skipping admission.
   It ships as an **experimental** part that:
   - uses its final name;
   - is excluded from `index.css`;
   - is marked at every use;
   - is exempt from Breaking entries;
   - graduates by deleting one header line, once it survives two independent
     compositions.

If the bet is wrong, the recorded predictions, the `check:shape-names` base rate
and the A/B test (396.5) will show it.

### What it produces

- **The app frame** (395.1) and the **module landing** (395.2).
- **One set of module layouts per module** in the reference app,
  `examples/erp-suite/<module-id>/`. Each is designed freely; the existing
  screens are only a reference. Every screen declares its `@pattern` and its
  `@job`.
- **New shapes as experimental patterns, and new parts as experimental
  components.** Each carries its final shape name, and each gets an open
  "admit or remove" item.
- **The job index.** `jobs.json` is generated, carries a schema tag, and is
  exported by the package. `llms.txt` gains the sections "Jobs → shape" and
  "Worked screens", plus a pointer to the Screen kit.
- **A loop that can run the milestone unattended.** This is Slice 393 (M0). It
  covers routes, the planner, the Jev queue screen in shadow, and the in-flight
  protocol.

### Accept / refuse / rethink (added to the Objective's tests while ACTIVE)

**Accept** when any of these holds:
- A module's job reaches a pattern and a worked screen through `jobs.json` with
  no prose in between.
- A new layout exists because its module needed a shape that its recorded
  prediction named.
- A missing piece ends in one of these:
  - composed from shipped classes;
  - fixed in an existing component;
  - admitted as experimental, with a named second use;
  - refused, with a labelled compromise kept.

**Refuse** any of these:
- **A module word in a published name.** This covers classes, parts,
  modifiers, tokens, behaviours, component directories, `@category`, pattern
  ids, `data-bo-*` values, packages and exports, and docs slugs under
  `/patterns/`, `/components/` and `/concepts/`.
- **A per-module copy of a pattern page.**
- **A `@busy-office/modules` or `blueprints` package.** Revisit only if an
  outside consumer asks to install module screens.
- **An experimental part without an open decision item, or over the cap.**
- **A refused-on-record item.** Examples: Gantt, map, drag, the dock, the grid
  engine, the charting engine. It can only be reopened by an owner entry that
  names new evidence.
- **Business logic, data or workflow policy** in any layout.
- **A placeholder built from `bo-skeleton` or `aria-busy`.**

**Rethink** when any of these happens:
- A job row needs a paragraph to say which pattern it uses. Fix the pattern's
  "Not for" clause instead.
- Two modules ask for the same missing piece in different words. Merge them.
- An experimental part is still waiting on its second use when its N.3 item
  comes up. Absorb it or remove it; do not extend the wait.

### Done-test (properties; each instrument must be shown to fail before its result is quoted)

1. **Frame.** The frame holds the closed module list at 1440 and 390, and at the
   rugged width if that is in scope. It is measured, uses no local CSS, and
   GAP-1's trigger has been answered.
2. **Modules.** Every module in the closed list has its layouts built. Every
   screen declares `@pattern` and `@job`. `npm run suite`, `check-markup`,
   `score.mjs` and `check:shape-names` are green. Every module's prediction has
   been scored.
3. **Resolves.** Every row in `jobs.json` resolves to a `patterns.json` id and a
   worked screen, or to an OPEN ledger entry. The generator counts the raw
   source and throws if anything is dropped or unknown.
4. **Placeholders are honest.** Every `data-bo-gap` in the built suite has an
   OPEN ledger entry, and every OPEN entry has its marker.
5. **Experimental parts are honest.** Every experimental part has an open decision item. None of them
   is in `index.css`. The count is at or under the cap. Docs and `llms.txt`
   show the status in words, and a stable page never shows it.
6. **Guides.** The A/B test (396.5) has run against its pre-registered margin.
   If the owner chooses O10(a), 112.3's protocol has also run as the job index's
   evaluation.
7. **Product share.** The report compares lines changed in framework and example
   paths against lines changed in loop machinery. It gives the
   `git diff --numstat` commands used and states what the split does not cover.
8. **Loop.** The report includes a loop-doctor re-score, and counts of hold
   wakes, planner calls and JQ shadow outcomes.

### Non-goals

- **Rewriting `## Objective`.**
- **Publishing.** Releases stay owner-triggered.
- **Jev choosing items or routes, calling models, admitting parts, or deciding
  PASS.** Code acts on Jev's probabilities at three declared points (prompt §6).
- **Non-Claude agents.** Slice 375 stands unless the owner answers O14
  otherwise.
- **Anything written into `.roundtable/pilot-112/`, or authoring 112.3 briefs.**
- **Reopening a refused item without new evidence.**

### Rules this milestone changes while ACTIVE

- **Step 0.** A wake checks for `.roundtable/HALT` first, then the in-flight
  line, then foreign commits. Each check can halt the wake (393.1, 393.2).
- **Step 2.** Rule M (the milestone's oldest dispatchable item, with the
  interleave) sits below rules 2-3 and above rule 4. Rule D (the planner)
  sits directly below rule M (393.4, 393.7).
- **Rules 2 and 3** follow the `Rules-2-3` field (393.5).
- **Step 0c.** "Accept collisions" becomes the owner's topology (O1), and a
  foreign commit halts the wake (393.1).
- **Jev.** CLAUDE.md's Jev section names a third point, the queue screen, in
  shadow, once the owner answers O13 (394.14).

### Owner decisions recorded here (numbers from the round-2 report)

| O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | O12 | O13 | O14 | O15 | O16 | O17 | O18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |
