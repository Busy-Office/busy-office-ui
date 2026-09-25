<!-- PASTE NOTE FOR BOTH PARTS (delete on paste). This file holds the two
ROADMAP.md edits of the M1 realignment, with the completeness critic's fixes:
  PART 1, "## Milestone M1", goes directly below "## Objective" (above
          "## CI strategy"). The owner edits it; the loop only reads it.
  PART 2, Slices 397 -> 393, goes directly above "## Slice 392".
Both land in the one P5 commit, together with .roundtable/milestone-m1-prompt.md,
the grill report and the committed reconcilers. -->

<!-- ===== PART 1 ===== -->

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
>   - every `OWNER` value below is filled in. Text after `#` on a field line is
>     a comment, and `milestone.py` ignores it.

```
Status: DRAFT
App: OWNER                                        # (O5/394.2) the long-use app; first user: busy-office-erp yes|no
Modules: OWNER                                    # (O5/394.2) closed list: <dir-id>=<facet word>:<Label>, …  e.g. o2c=sales:Sales · configuration=configuration:Configuration
Devices: OWNER                                    # (O5/394.2) desktop · phone · rugged-rf yes|no
Precedence: interleave 1/3 track=defect          # (O11) preempt | interleave 1/N track=defect | after <item-id>
Rules-2-3: scoped                                 # (O12) normal | scoped | suspended
Dispatcher: local                                 # (O1) local | local+auditor | both
Tiers: top=OWNER · balanced=OWNER|none · fast=OWNER|none
Planner: top                                      # (O14) the tier the planner route uses
Direction-drift: off                              # (O16) off | N=<landings> X=<percent>
Budget: m0-wakes OWNER · wakes OWNER · agents/wake OWNER · workflow-wall OWNERm · experimental 2 · resume-lines 120 · direction-items 5
Stop: HALT | foreign-commit | budget | 2-wakes-no-progress-on-one-item | 2-wakes-plan-only | one-way-door
```

`wakes` counts dispatch wakes; holds are counted separately as `hold-wakes`.
`2-wakes-no-progress-on-one-item` means two consecutive dispatch wakes on the
same item, neither ending `landed`. Holds, and wakes that rule 4 restricted to
the defect track because every M1 item is blocked, do not count toward it.
Reaching the `experimental` cap is not a stop: it refuses entry, and the need
stays `OPEN` behind its placeholder. Once 394.9 lands, generators and gates read
the module list from `examples/erp-suite/_shell.mjs` MODULES, never from this
section, and `milestone.py` reconciles the two.

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
   - uses its intended final name, which may still be renamed for free while
     experimental;
   - is excluded from `index.css` (and, for JS, from the `./js` index);
   - is marked at every use;
   - is exempt from Breaking entries;
   - graduates by deleting one header line, once it survives two independent
     compositions.

   **No need is lost while it waits.** A need with one use stays `OPEN` behind
   its placeholder. Every later hit on its key is recorded as a use, and code
   re-files it for triage when a second, independent use appears (owner answer
   5: "if we don't consider new, we could miss as well").

If the bet is wrong, the recorded predictions, the `check:shape-names` base rate
and the A/B test (396.5) will show it.

### What it produces

- **The app frame** (395.1) and the **module landing** (395.2).
- **Module layouts** in the reference app, `examples/erp-suite/<module-id>/`,
  in the form the owner chooses at 396.13 on the A/B result (396.5): full
  module sets, or job rows plus screens only where a new shape is needed. Each
  is designed freely, and the existing screens are only a reference. Every
  screen declares its `@pattern` and its `@job`.
- **New shapes as experimental patterns, and new parts as experimental
  components.** Each carries its final shape name, and each gets an open
  "admit or remove" item.
- **The job index.** `jobs.json` is generated, carries a schema tag, and is
  exported by the package. `llms.txt` gains the sections "Jobs → shape" and
  "Worked screens", plus a pointer to the Screen kit.
- **A loop that can run the milestone unattended.** This is Slice 393 (M0): one
  committer, the in-flight protocol, the backlog mirror, rule M, routes and the
  planner. The Jev queue screen is Phase 1 (394.12-394.16, 394.18), in shadow
  or escalate-only as the owner chooses at 394.18.

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
- **Closing a need REFUSED only because no second use is known yet.** It stays
  `OPEN` and waits. REFUSED is for refusals on the merits.

**Rethink** when any of these happens:
- A job row needs a paragraph to say which pattern it uses. Fix the pattern's
  "Not for" clause instead.
- Two modules ask for the same missing piece in different words. Merge them.
- An experimental part is still waiting on its second use when its N.3 item
  comes up. Absorb it or remove it; do not extend the wait.
- A module screen re-demos a job an existing screen already serves, with
  another module's column headings. That is a per-domain variant
  (loop-log.md:598), not freedom to design.

### Done-test (properties; each instrument must be shown to fail before its result is quoted)

1. **Frame.** The frame holds the closed module list at 1440 and 390, and at the
   rugged width if that is in scope. It is measured, uses no local CSS, and
   GAP-1's trigger has been answered.
2. **Modules.** Every module in the closed list has its layouts built, in the
   form chosen at 396.13. Every screen declares `@pattern` and `@job`.
   `npm run suite`, `check-markup`, `score.mjs`, `check:shape-names` and
   `npm run docs:build` (which re-checks the suite under `dist/suite/`) are
   green. Every module's prediction has been scored.
3. **Resolves.** Every row in `jobs.json` resolves to a `patterns.json` id and a
   worked screen, or to an OPEN ledger entry. The generator counts the raw
   source and throws if anything is dropped or unknown.
4. **Placeholders are honest, and no need is lost.** Every `data-bo-gap` in the
   built suite has an OPEN ledger entry. Every OPEN entry has its marker, and
   every marker site has a `Use:` line. Each pool round's count of uses added
   to seen keys is in the report.
5. **Experimental parts are honest.** Every experimental part has an open decision item. None of them
   is in `index.css`. The count is at or under the cap. Docs and `llms.txt`
   show the status in words, and a stable page never shows it.
6. **Guides.** The A/B test (396.5) has run against its pre-registered margin.
   If the owner chose O10(a) **and** has written 112.3's briefs, 112.3's
   protocol has also run as the job index's evaluation. The loop never writes
   those briefs, so without them this half is reported as not run, and why.
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
  sits directly below rule M (393.4, 393.7). Oldest-first means every
  dispatchable Phase 1 item runs before the frame: dispatch #26 by
  `simulate_rule_m.py`. `After:` lines hold items back but never pull one
  forward.
- **Rules 2 and 3** follow the `Rules-2-3` field (393.5).
- **Step 0c.** "Accept collisions" becomes the owner's topology (O1), and a
  foreign commit halts the wake (393.1).
- **Jev.** CLAUDE.md's Jev section names a third point, the queue screen, once
  the owner closes 394.18 (O13). It runs in shadow, or in escalate-only if the
  owner chooses that there.

### Owner decisions recorded here (numbers from the round-2 report)

| O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | O12 | O13 | O14 | O15 | O16 | O17 | O18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

<!-- ===== PART 2 ===== -->

<!-- PASTE NOTE (delete on paste). These five slices go above "## Slice 392" in
ROADMAP.md. The file lists the newest slice first, so they appear 397 → 393; the
work runs 393 → 397. The numbers assume no other slice 393+ lands first: run
`git fetch origin main && git log HEAD..origin/main --oneline` before pasting.
If one has landed, renumber with LOOPS.md's renumber recipe (match `393\.` and the
`^## Slice 393` heading, count the hits before and after), and include every
`After:` line. Every marker line (`Milestone:`, `Route:`, `After:`, `Track:`,
`Parked:`) is inert until 393.3 teaches the parser to read it.
Reconciled by `lint_roadmap.py` (ids, After targets, Route values, one Accept per
item), `classify_r2.py` (65 of 65 open items have exactly one disposition) and
`simulate_rule_m.py` (no `After:` cycle; the dispatch order rule M's oldest-first
produces). All three were shown to fail on an injected defect, and P5 commits them
under `.roundtable/milestone-m1-2026-09-25/` so these citations survive the
session. -->

## Slice 397 — M1 Phase 3: components go through the experimental tier, and the milestone closes (owner realignment, 2026-09-25)

**What this slice holds.** At the start it holds two items: the first real run
of the component lifecycle, and the exit. Everything else in it is filed while
the milestone runs. Each missing piece a module finds becomes an item, and so do
the three steps that follow an experimental part: **N.1** build and fill
(`Route: build`), **N.2** a second composition on a different pattern
(`Route: design`), and **N.3** "experimental `<name>`: admit or remove"
(`Route: build`). The committer numbers these items after a fetch, and each one
carries `After:` lines, so code releases them in order. The rules are in
`.roundtable/milestone-m1-prompt.md` §9.

**When these items run.** Rule M takes the oldest dispatchable item first, and
items filed here are newer than every Slice 396 item. So an N.x item runs after
the module items that are dispatchable when it is filed, and until then its
placeholder stands in for it. Components do **not** interleave with layouts by
default. The one deliberate exception is 397.1: 396.5 waits on it, so the
lifecycle is proven end to end on the first real need before the five-module
fan-out (round 1's "one module end to end before any fan-out").

1. [ ] **397.1 — the first real run: the first need Configuration or Distribution
       logs walks the component lifecycle as far as its fill.**
       Milestone: M1 · Phase: 3
       Route: build
       After: 394.4, 394.5, 394.6, 394.7, 394.8, 394.17, 396.3, 396.4
       - **Accept — the property.** The first need logged by 396.3 or 396.4 has,
         at every state it reaches, the artefacts the gates for that state check
         (prompt §9.3 table):
         - a placeholder and its ledger entry, with its uses;
         - then triage's three drafted alternatives and the entry-test record;
         - if it enters: the `@status experimental` and `@decide` header, the
           marker, items N.1, N.2 and N.3 filed with their `Route:` and
           `After:` lines, and N.1 closed with the placeholder filled.

         N.2 and N.3 are not part of this Accept. N.2's second use may sit in a
         module that waits on 396.5, and 396.5 waits on this item, so requiring
         them here would deadlock. Composed, refused and "still `OPEN`,
         waiting for a second use" are all satisfying outcomes, each recorded
         with its reason. If neither module logs a need, this item closes with
         that count, quoted from the ledger.
2. [ ] **397.2 — EXIT: close Milestone M1.**
       Milestone: M1 · Phase: 3
       Route: planner
       After: 393.11, 393.12, 394.1, 394.2, 394.3, 394.4, 394.5, 394.6, 394.7, 394.8, 394.9, 394.10, 394.11, 394.12, 394.13, 394.14, 394.15, 394.17, 394.18, 395.1, 395.2, 396.1, 396.2, 396.3, 396.4, 396.5, 396.6, 396.7, 396.8, 396.9, 396.10, 396.11, 396.12, 396.13, 397.1
       - **Accept — the property.** One of two things is true. Either each
         Done-test property in `## Milestone M1` has been checked with the
         instrument it names, and the output is quoted. Or a Stop condition
         has been reached, and the report names it.

         After that, all of the following hold:
         - the owner sets `Status: CLOSED`;
         - `milestone.py` output shows every `Parked: M1` item dispatchable,
           with no hand edit;
         - one Objective grill grades the milestone against its Done-test,
           thesis section included;
         - the report gives framework-code lines against loop-machinery lines,
           with the `git diff --numstat` commands used and what the split does
           not cover;
         - the report lists every experimental part still open, its age in
           releases and its decision item;
         - the report includes a `busy-office:loop-doctor` re-score.

         **What `After:` leaves out, on purpose.** 394.16 (the JQ promotion
         call), because it may wait for more shadow data than the milestone
         produces. Items filed during the milestone that may legitimately stay
         open at close: N.1-N.3 for a part still experimental (the report lists
         them), and needs still `OPEN`, waiting for a second use. The owner items
         394.1, 394.2, 394.3, 394.18 and 396.13 are **included**, because the
         milestone cannot close honestly without them.
         **What `After:` cannot list** is a module item 396.11 files later. So
         `milestone.py` also holds this item while any other open item tagged
         `Milestone: M1 · Phase: 2` exists.

## Slice 396 — M1 Phase 2: module layouts, designed freely and named by shape (owner answers 2 and 3, 2026-09-25)

**Owner answer 3:** "this scope only layout and components so existing screen
..for reference only. however, we are looking for the long use app so freedom to
design."

**What a module item builds.** Each module item designs that module's screens in
the reference app, `examples/erp-suite/<module-id>/`. The designs are new; existing
suite screens are reference only. A redesigned screen replaces its predecessor
at the same URL, and the predecessor's open findings close against the
replacement (394.2).

**Naming (394.1).** The framework publishes only shape names. When a module needs
a layout that no pattern covers, that layout is a new *shape*. It enters as an
experimental pattern with its final shape name. Module words appear only in:
- the module directory;
- demo data;
- the job index's also-called words and module facets.

**The common Accept for the module items: 396.3, 396.4, 396.6-396.10, 396.12
and every item 396.11 files.** It does not apply to 396.1, 396.2, 396.5, 396.11
or 396.13, which are not module items. Each item meets all of these, and each is
a property to verify:

1. **Brief.** A sourced brief exists at `.roundtable/brief-<module-id>-<date>.md`,
   with at least 2 independent URL sources for each domain claim. A
   fresh-context realism reviewer read it, and did not also author the layouts.
2. **Prediction first.** The module's prediction of new shapes and gaps is
   committed to `.roundtable/erp-suite-gaps.md` before the first markup. The
   commit order is quoted: `git log --format='%h %ai %s' -- .roundtable/erp-suite-gaps.md examples/erp-suite/<module-id>`.
3. **Every job lands somewhere.** Every job in the brief has either a screen or
   a job row pointing at an existing worked screen. Every screen:
   - declares `@pattern` and `@job`;
   - carries `data-bo-pattern`;
   - uses only `api.json` classes, plus experimental parts that come with their
     import and their marker.
4. **Missing pieces are logged, not guessed.** Each missing piece was checked
   against the refused-on-record list (prompt §9.1). It is then either:
   - a `data-bo-gap` placeholder with an OPEN ledger entry; or
   - an app-owned slot that cites its refusal id.

   A hit on a need already in the ledger is appended to that entry as a use
   (site, job, pattern), never dropped as a duplicate. The count of uses
   appended is quoted with the pool's fresh/seen counts.
5. **Critics.** Two fresh-context critics ran `/design-grill` on each new
   screen, and in flow mode on the module's main journey. There were at most 3
   revise rounds. Each new screen's reference-delta line exists (394.11).
6. **Gates.** These pass: `npm run suite` as defined on HEAD (it includes
   `suite:journey` only if P2 landed the 09-20 checkpoint), `check-markup`,
   `score.mjs` for each screen's kind, `check:shape-names`, and
   `npm run docs:build`, which copies the suite into `dist/suite/` and checks
   it again. Screenshots exist at 1440 and 390, in light and dark.
7. **Prediction scored.** After the build, the prediction is scored against what
   happened. "0 new shapes" is a satisfying outcome.

Module items that fan out wait on `393.12`.

1. [ ] **396.1 — `check:shape-names`: no published name contains a module word.**
       Milestone: M1 · Phase: 2
       Route: build
       After: 394.1, 394.2, 394.9
       - **Accept — the property.**
         - **What it reads.** The gate is `@heuristic` and ships `--self-test`.
           It splits every published name into tokens:
           - classes, parts and modifiers in `api.json`;
           - `--bo-*` tokens;
           - component directories;
           - `@category` values;
           - pattern ids;
           - `data-bo-*` values;
           - export names;
           - docs slugs under `/patterns/`, `/components/` and `/concepts/`.
         - **What it fails on.** A module term. The terms come from
           `examples/erp-suite/_shell.mjs` MODULES (every id and label), the
           `jobs.json` facets, and a reviewed seed list. They never come from
           ROADMAP.md: the docs container build has no ROADMAP.md, and this gate
           outlives the milestone.
         - **Where it runs.** In a build that the docs container also runs.
           Verify it there, the narrowest context that must run it, not only in
           CI.
         - **Base rate.** Measure it before wiring the gate, and quote it. The
           seat-A scanner (committed with P5) measured 0 of 1,039 on 2026-09-25.
           Re-measure it here, because a gate with a base rate of 0 cannot fail
           on this tree.
         - **Self-test.** It catches injected module names and passes real shape
           names.
         - **Ordering.** 396.3 carries `After: 396.1`.
2. [ ] **396.2 — pre-register the A/B test: do agents build better from job rows
       or from a full module set?**
       Milestone: M1 · Phase: 2
       Route: research
       After: 394.10
       - **Accept — the property.** A protocol is committed at
         `.roundtable/ab-module-sets-protocol.md` before 396.3's first screen.
         The commit order is quoted. The protocol names:
         - **The arms.**
           - (a) `llms.txt` plus `jobs.json` rows;
           - (b) the same, plus that module's full screen set.
         - **The tasks.** Two jobs, from different modules. Neither job may have
           a worked screen in either arm.
         - **The metrics.** `score.mjs` for the job's kind, `check-markup`, axe at
           1440 and 390, a blind `/design-grill` flow critic, and tokens.
         - **The margin**, fixed in advance.
         - **The seal.** No arm agent can read `.roundtable/pilot-112/`.

         This item runs no agents.
3. [ ] **396.3 — Configuration layouts** (users and roles, permissions, rules,
       and the settings the frame links to).
       Milestone: M1 · Phase: 2
       Route: design
       After: 395.1, 396.1, 396.2, 394.8, 394.9, 393.12
       - **Accept — the property.** The slice's common Accept holds for module
         `configuration`, within the boundary 394.2 set between the frame's
         Settings screen (395.1) and this module. The prediction names the candidate shapes this module
         is expected to test, all Hypothesis: a check matrix (role × permission)
         and a rule table (thresholds and conditions).
4. [ ] **396.4 — Distribution layouts** (pack, handling units, dispatch, labels).
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.3
       - **Accept — the property.** The slice's common Accept holds for module
         `distribution`. The module id is never `dist`: `examples/erp-suite/build.mjs`
         deletes `dist/` on every build.
         - Maps and route optimisation are logged as app-owned slots that cite
           their refusal.
         - Candidate shapes, all Hypothesis: a unit tree (nested handling
           units), and a scan flow that passes the swap test.
5. [ ] **396.5 — run the A/B test, and put the result in front of the owner.**
       Milestone: M1 · Phase: 2
       Route: research
       After: 396.2, 396.3, 396.4, 397.1
       - **Accept — the property.** The arms run exactly as pre-registered, and
         the result is recorded against the pre-registered margin. The result,
         with two options for 396.6-396.10, is written into 396.13, the owner
         item already reserved for this choice. The options:
         - full module sets. This is offered only if 394.1's ADR records
           loop-log.md:595 (domain packs) as superseded for `examples/erp-suite`;
         - job rows, plus screens only where a new shape is needed.

         Either result satisfies this item. A tie is reported as a tie.
         `After: 397.1` makes the first real need walk the component lifecycle
         before the five-module fan-out.
6. [ ] **396.6 — Production Planning layouts** (planned orders, capacity,
       scheduling, where-used).
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.13
       - **Accept — the property.** The slice's common Accept holds.
         - **Schedule authoring** is grilled only as "move a booking between
           resource × time cells with kanban's Move-to menu: no drag, no
           engine". The Gantt and drag refusals are quoted first, and a
           composition spike runs before any shape is proposed.
         - **Where-used** is built as GAP-21's second use only if 394.8 queued
           it.
7. [ ] **396.7 — Finance layouts.**
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.13
       - **Accept — the property.** The slice's common Accept holds, in the form
         the owner chose at 396.13. AP and AR sit where 394.2 put them.
8. [ ] **396.8 — Sales layouts.**
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.13
       - **Accept — the property.** The slice's common Accept holds, in the form
         chosen at 396.13. An available-to-promise cue per line is first tried as
         a composition.
9. [ ] **396.9 — Inventory layouts.**
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.13
       - **Accept — the property.** The slice's common Accept holds, in the form
         chosen at 396.13. The candidate shape "running balance over time" is
         tested against its other uses: Sales available-to-promise and
         Production Planning MRP.
10. [ ] **396.10 — Procurement layouts.**
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.13
       - **Accept — the property.** The slice's common Accept holds, in the form
         chosen at 396.13.
11. [ ] **396.11 — the owner's further modules, one item each.**
       Milestone: M1 · Phase: 2
       Route: planner
       After: 394.2, 396.13
       - **Accept — the property.** The planner files exactly one item for each
         module 394.2 lists beyond 396.3-396.10. Each item uses this slice's
         common Accept. The count filed equals the count 394.2 lists, and the
         planner quotes both. If 394.2 lists no further modules, this item
         closes with that count.
12. [ ] **396.12 — rugged-device task layouts** (only if 394.2 scopes rugged
       devices in; it absorbs 17 items of Slice 389).
       Milestone: M1 · Phase: 2
       Route: design
       After: 395.1, 394.2
       - **Accept — the property.**
         - **If in scope.** Each absorbed item's own Accept holds on the
           redesigned screens: 389.1, .2, .5, .6, .7, .8, .9, .10, .11, .12, .13,
           .15, .17, .18, .20, .21, .22. An item whose page the redesign deletes
           instead closes as superseded, naming the deleting commit.
         - **If out of scope.** The `Milestone: M1` tags are removed from those
           items, and they return to the backlog without being closed.
         - 389.6 and 389.7 also depend on the owner's decision about the
           09-20 checkpoint (precondition P2).
13. [ ] **396.13 — OWNER CALL: the form the remaining modules take (full
       module sets, or job rows plus screens only where a new shape is
       needed), decided on 396.5's result.**
       Milestone: M1 · Phase: 2
       Route: owner
       After: 396.5
       - **Accept — the property.** The owner records one of the two options in
         this item, citing 396.5's result against its pre-registered margin.
         396.6-396.11 carry `After: 396.13`, so no remaining module is
         dispatched before the form is chosen. Reserved here rather than filed
         by 396.5, because an item filed later has no number that the module
         items could wait on.

## Slice 395 — M1 Phase 2: the app frame, and the module landing (owner realignment, 2026-09-25)

**Why the frame comes first.** Every module layout sits inside the frame. Four
open decisions also meet here:
- the phone dock (373.6);
- the launcher header (376.5);
- the RF frame slots (389.14);
- the navigation rail once a sidebar group holds more than 10 entries (GAP-1).

1. [ ] **395.1 — the app frame end to end: shell, home, launch, navigation for
       the closed module list, profile and settings.**
       It absorbs 376.5 and 389.14, prepares the options for 373.6, and answers
       GAP-1.
       Milestone: M1 · Phase: 2
       Route: design
       After: 394.1, 394.2, 394.11, 393.12
       - **Accept — the property.**
         - **Prediction first.** A prediction of new shapes and gaps is
           committed before the first markup, and the commit order is quoted.
         - **No local CSS.** Module layouts compose inside the frame without
           local CSS. `check-erp-suite` enforces this.
         - **Navigation.** It holds 394.2's closed module list at 1440 and 390,
           and at the rugged width if that is in scope. This is measured, and
           GAP-1's trigger ("more than 10 entries in one sidebar group") is
           answered from the measurement. Every `_shell.mjs` MODULES entry
           (which 394.9 made equal to the Milestone `Modules` field) is now
           built and reachable, and none is left marked not built.
         - **Icons.** Each rail entry uses a glyph from the shipped set, and no
           deprecated glyph (`check-deprecated-icons` is green). The frame
           ships no SVG of its own: an icon set is refused on record
           (scope.astro). Alternatively, the frame is designed so that a module
           needs no glyph of its own. The glyph count is quoted against the
           budget recorded at `_shell.mjs`.
         - **Profile and Settings.** Each has a home in the frame and a worked
           screen, placed where 394.2 put it (rail module or user-menu
           destination). `/profile` no longer points at nothing
           (app-frame.astro:48).
         - **The dock (373.6).** The frame is built with the dock refusal kept
           (123.2, Slice 154). The executor files the dock options, with a
           recommendation, as a note on 373.6 for the owner. Reversing a
           refusal is the owner's decision, so 373.6 stays owner-blocked and
           does not block this item. If the owner reverses it, the planner
           files the build as a new item.
         - **Absorbed items.** 376.5 and 389.14 each close by their own Accept,
           in this item's landing commit. Each carries `After: 395.1`, so rule M
           never dispatches it on its own first.
         - **Checks.** The reference-delta line exists (394.11). Suite gates are
           green. Screenshots exist at 1440 and 390, in light and dark.
           `/design-grill flow:` runs over home → module landing → record.
2. [ ] **395.2 — the module landing: compose `workspace`, or admit it as an
       experimental pattern.**
       Milestone: M1 · Phase: 2
       Route: design
       After: 395.1, 394.7
       - **Accept — the property.** A composition spike builds a module landing
         in two modules from 394.2's list, starting from `role-home` scoped to
         one function. The landing's anatomy:
         - the work waiting for me;
         - section navigation;
         - the document chain;
         - an entry to the module's settings;
         - the module's identity, with a count.

         One of two outcomes follows:
         - **Shipped patterns compose it.** The composition is recorded and no
           pattern is added. This is a satisfying outcome.
         - **They do not.** `workspace` enters through the lifecycle as an
           experimental pattern (prompt §9), with its `@decide` item, and
           `check-experimental` stays green.

## Slice 394 — M1 Phase 1: the decisions, the experimental tier, the job index, and the Jev queue screen (owner realignment, 2026-09-25)

**How the order is enforced, and what it means.** No layout starts before the
naming ADR (394.1) and the app definition (394.2) are closed. Every Phase 2 item
waits on both, either directly or through its `After:` chain. Code enforces this
through the dependency kind that 393.3 adds, and nothing waits on judgement.

`After:` lines only hold items back, and rule M takes the oldest dispatchable
item first. So every dispatchable item in this slice runs before the frame: the
experimental tier (394.4-394.7), the ledger (394.8), the job index and exports
(394.9, 394.10), the reference delta (394.11), Jev hygiene (394.12), the queue
screen (394.13-394.15, once 394.18 is closed) and the recipe (394.17).
`simulate_rule_m.py` puts the frame at dispatch #26 when the owner closes 394.18
before ACTIVE. That order is deliberate: layouts are built once, on a finished
tier, ledger and job index, rather than retrofitted, and the queue screen then
screens every layout dispatch. The cost is about 13 wakes before the first
layout. If the owner wants the frame sooner, the lever is an explicit
`After: 395.1` on the items to defer (394.12, 394.13 and 394.17 do not feed the
frame), added by the owner or by a planner re-plan. `Precedence` does not do
this: it orders rule M against rule 4, not within M1.

1. [ ] **394.1 — OWNER CALL: naming doctrine. Every published name names a
       shape (owner answer 2; roundtable 2026-09-25).**
       Milestone: M1 · Phase: 1
       Route: owner
       - **Accept — the property.** The owner accepts an ADR at
         `.roundtable/adr-published-names-are-shapes-2026-09-25.md`. It states:
         - what counts as a published name;
         - the rule itself;
         - the swap test;
         - where module words live, and nowhere else;
         - what the framework ships, what the reference app holds, and what a
           consumer owns;
         - what reversing the rule later would cost, re-measured with
           `git grep -c invoice-list` (162 references in 94 files on
           2026-09-25).

         The same commit replaces the pattern-recipe paragraph at
         CLAUDE.md:337-343 with the ADR's text, and cites loop-log.md:595
         (domain packs) and :598 (per-domain variants) as upheld, or as
         superseded by name. The ADR states the scope of each. For example,
         :595 might be superseded for `examples/erp-suite` only, under owner
         answer 3's "freedom to design", and upheld for the framework. 396.5
         may offer "full module sets" only if the ADR supersedes :595 there.

         If the owner rejects the rule, the ADR records the alternative chosen
         instead. The planner then re-plans every Phase 2 item before any of
         them is dispatched.
2. [ ] **394.2 — OWNER CALL: the app, the module list and the device classes
       (folds 377.6; owner answer 3).**
       Milestone: M1 · Phase: 1
       Route: owner
       - **Accept — the property.** `## Milestone M1` names each of these, in
         its `App`, `Modules` and `Devices` fields where it has one:
         - the long-use app, and whether busy-office-erp is its first user. If
           it is, add one conformance property that can be checked, and say how
           a layout reaches that app (copying the pattern from the Screen kit,
           or something else).
         - the closed module list, each with a directory id and a facet word.
           Existing directory ids are kept. New ids are full words. `dist` is
           reserved. The facet word is the canonical module word that
           `jobs.json` publishes (for example `sales`, never `o2c`).
         - what happens to each existing suite module the owner's list does not
           name (`o2c`, `p2p`, `crm`, `journey`): relabelled, merged or retired.
           CRM in particular: its own module, or part of Sales.
         - whether Profile and Configuration are rail modules or user-menu and
           admin destinations, and where the frame's Settings screen (395.1)
           ends and the Configuration module (396.3) begins;
         - where AP and AR sit;
         - the industry the demo data assumes;
         - the device classes in scope, including rugged RF: yes or no.
         - the rule "existing suite screens are reference only; a redesign
           replaces its predecessor at the same URL; the predecessor's open
           findings close against the replacement, or as superseded naming the
           replacing commit."

         377.6 closes by this item.
3. [ ] **394.3 — OWNER CALL: a release boundary before any experimental part
       merges (377.5).**
       Milestone: M1 · Phase: 1
       Route: owner
       - **Accept — the property.** Before the first `@status experimental` line
         reaches main, the owner does one of two things:
         - releases the unreleased stable fixes; or
         - records why not, quoting that day's `git rev-list --count
           v0.8.0..HEAD` (322 on 2026-09-25).

         No release carries experimental surface without its label. 377.5
         closes by this item.
4. [ ] **394.4 — the experimental tier: `@status experimental` and `@decide` in
       the registration header, and where the build puts the part.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.1
       - **Accept — the property.**
         - **The directives.** `DIRECTIVE_RE` in `extract-api.mjs` (today
           :198-199: tagline|category|label|order) also accepts
           `@status experimental|deprecated`, where no line means stable, and
           `@decide <item-id>`. A header with `@status experimental` and no
           `@decide` throws an error that names the file.
         - **Where the part appears.** It is listed in a new `api.experimental`
           section. It is absent from:
           - `api.components`, the ACR, llms.txt's Components section and the
             homepage task tiles, checked on the generated files;
           - the BUILT `dist/css/index.css` and `index.min.css`, checked by
             grepping the built output.
         - **Where the part ships.** It is present at
           `dist/css/components/<name>.css`, which the existing
           `./css/components/*` export resolves, and in
           `npm pack --dry-run`. Graduation therefore adds one `@import` and
           never moves a path. (versioning.astro: per-file placement is not API
           before v1.0, so the promise not to move it is a commitment made here,
           not one the versioning policy already gives.)
         - **JS and tokens.** A behaviour whose header carries
           `@status experimental` ships at `./js/behaviors/<name>` only. It is
           absent from `src/js/index.ts` and the built `dist/js/index.js`,
           checked on the built file, and its `behaviors.json`, `events.json`
           and `keymap.json` entries carry the status. An experimental part adds
           no `--bo-*` semantic token, checked by `check:token-refs` or a new
           assertion.
         - **Readers of `api.components`.** The item commits a list of every
           reader (16 files on 2026-09-25) and how each treats an experimental
           part. Readers that fail open keep excluding it. Readers that fail
           closed on an unknown class (`check-markup`, `check-sample-classes`)
           and the page-shape components (`ClassRef`, `ApiTable`) read
           `api.experimental` as well. Otherwise an experimental page renders
           an empty table or fails its own build.
         - **Existing gates.** Every existing core gate still runs over it,
           because the source tree is shared. `check:size` and the framework
           floor (`derive-floor` reads `dist/css/components/*.css`) do not change
           because it exists.
         - **Maturity.** `derive-introduced` records, for each component, the
           first published version and the first version in which it was
           stable. The Maturity label shows stable-since, so a graduated part is
           not labelled as stable from its experimental release.
         - **Patterns.** A pattern page can declare `status="experimental"`,
           and `gen-patterns` carries it into `patterns.json`.
         - **Public surface.** The new `api.experimental` key in the published
           `api.json` is additive. It is named in O9's approval, along with the
           exports and attributes.
         - **Red-proof.** Each property is shown failing: flip one stable
           component's header in a scratch tree, confirm the flip reached the
           built output, then watch the property change.
5. [ ] **394.5 — `bo-check-markup` (the shipped bin) sees experimental parts and
       placeholders.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.4
       - **Accept — the property.** The bin tells these cases apart, and each
         message names the import and the stable alternative:

         | Case | Result |
         |---|---|
         | A marked experimental root | pass |
         | An unmarked experimental root | error |
         | A part with no marked root on the page | error |
         | A marker naming a component that has since graduated | warning, or error under `--strict`, which the repo's own gates use |
         | A marker naming no known component | error |
         | A `data-bo-gap` attribute | error unless `--allow-gaps` is set |

         The raw count of marker strings equals the parsed count.
         `--self-test` shows every branch failing. The prototype is the spec:
         `.roundtable/milestone-m1-2026-09-25/marker_check.mjs`, committed by
         P5. `check:package` still proves that the bin and `api.json` ship
         together.

         **Both in-repo runs that see suite pages pass `--allow-gaps` for them
         only:** `suite:check`, and the docs build's `check-markup dist`, which
         walks `dist/suite/` because `copy-suite.mjs` puts the suite there.
         Without the second, the docs build fails on the first placeholder a
         module lands. Red-prove it: a placeholder on one suite page passes the
         docs build, and the same attribute on a non-suite docs page fails it.
6. [ ] **394.6 — docs, llms.txt and the sidebar show the status in words, in
       both directions.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.4
       - **Accept — the property.**
         - **Experimental pages** (built component and pattern pages) show the
           word "Experimental" in all of these, plus a
           `<meta name="bo-status">`:
           - a banner mounted from `Maturity.astro`, with no page edited by
             hand;
           - a Status row;
           - an ApiTable caption;
           - a generated sidebar group.
         - **Stable pages** show none of it.
         - **The versioning page's "Not API" list** gains a bullet generated
           from `api.experimental`.
         - **llms.txt** lists experimental parts only inside a fenced
           "Experimental: opt-in, NOT API" section. Each entry gives the name,
           tagline, classes, import, marker, page and the production
           alternative. `gen-llms` throws if the count in that section differs
           from `api.experimental`.
         - **112.3's instrument.** The llms.txt change, with its byte delta, is
           written into 112.3's record in ROADMAP.md, because llms.txt is that
           pilot's instrument (ROADMAP.md:3002). Nothing is written into
           `.roundtable/pilot-112/`.
         - **`check-maturity`** asserts both directions (experimental pages show
           it, stable pages do not). Red-prove it by adding the directive and
           then removing it.
7. [ ] **394.7 — every experimental part has an open decision item, the count
       stays under the cap, and every marked use loads its stylesheet.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.4, 394.5
       - **Accept — the property.**
         - **Decision items.** `check-experimental.mjs` counts the raw
           `@status experimental` lines in `packages/core/src/css` and in
           experimental pattern pages. It also counts open ROADMAP items titled
           "experimental `<name>`: admit or remove". It fails when either side
           has an entry the other lacks, or when the total is over the
           Milestone `experimental` cap. Red-prove both directions and the cap.
           **Where it runs.** It reads ROADMAP.md, which the docs container
           build does not copy. So it runs on the loop's own path
           (`record_iteration.py`, beside `check-resume-charter`) and in CI's
           full checkout, and never in the container build. Anywhere ROADMAP.md
           is absent, it prints that it stood down and why, as the existing
           ROADMAP-reading gates do. The red-proof includes that printed line.
         - **Stylesheet loads.** A real-browser gate (`@exact`) asserts that
           every `[data-bo-experimental]` root on the built docs and suite pages
           computes `--bo-experimental` equal to its marker. It serves the
           build itself through `serveDist` (`apps/docs/scripts/serve-dist.mjs`),
           because a gate that needs a hand-started container is not a gate. Red-prove it by
           dropping the stylesheet link on one page. This closes the failure
           mode where `motion.css` failed silently twice (check-claims.mjs,
           137.12 and 137.17).
8. [ ] **394.8 — the placeholder, the ledger, and the second-use rule (resolves
       GAP-21).**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept — the property.**
         - **Ledger status.** Every entry in `.roundtable/erp-suite-gaps.md`
           carries a `Status:` line taken from a closed set: OPEN, COMPOSED,
           FIXED, EXPERIMENTAL, REFUSED, ABSORBED or NOT-A-GAP. Each entry
           also carries one `Use:` line per recorded use (site, job, pattern).
           The GAP-4 heading contradiction (:256 against :276) is corrected.
         - **Marker check.** A new `@exact` check in `suite:check` re-reads the
           ledger file. It fails on:
           - a `data-bo-gap` key in the built suite with no OPEN entry;
           - an OPEN entry with no marker;
           - a marker site with no `Use:` line.

           Red-prove all three against the built dist.
         - **Second use (owner answer 5: "we could miss as well").** An entry
           that waits on a second use does one of two things:
           - names an open ROADMAP item that builds that use on a different
             pattern, when the second use is foreseen; or
           - stays OPEN with `Waiting: second use`, when it is not foreseen.
             Code re-files it for triage once its `Use:` lines reach 2 distinct
             (job, pattern) pairs (prompt §8 stage 7).

           Closing an entry REFUSED only because no second use is known yet is
           not allowed. REFUSED is for refusals on the merits.
         - **GAP-21** is resolved: its foreseen second use (PP where-used) is
           queued, or it is refused on the merits, or it stays OPEN waiting.
           Each outcome is satisfying if its reason is recorded.
9. [ ] **394.9 — the job index: every worked screen declares its pattern and its
       job, and `jobs.json` is generated (folds 249.7's "also called").**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.1, 394.2
       - **Accept — the property.**
         - **Screen headers.** The header of every
           `examples/erp-suite/**/*.screen.mjs` carries `@pattern <patterns.json id>`
           and `@job <verb-object id>`. Its root region carries
           `data-bo-pattern`.
         - **Jobs tables.** Each pattern page carries a Jobs table with these
           columns:
           - job id;
           - also-called words, each with a source;
           - module facets: the facet words in `_shell.mjs` MODULES. This item
             writes the Milestone `Modules` field into MODULES. Each entry gains
             its facet word, and a module not built yet is listed but marked
             not built, so the rail does not show it before 395.1 wires the
             navigation. The generator reads MODULES, never ROADMAP.md, because
             the docs container build has no ROADMAP.md. `milestone.py`
             reconciles MODULES against the field from here on;
           - the fork condition.
         - **The generator.** It writes `apps/docs/src/data/jobs.json`, with the
           schema tag `busy-office.jobs/1`, and adds a `pattern` field to
           `suite.json`. It counts the raw `*.screen.mjs` files and Jobs-table
           rows in the source. It throws on:
           - a count mismatch;
           - an unknown pattern id;
           - an unknown facet.

           Red-prove each of the three.
         - **KIND.** `kinds.mjs` KIND is derived from `pattern`, or a check
           asserts that the two agree.
         - **249.7.** Its Accept is met by the same also-called mechanism, or
           the planner re-scopes it and records why.
10. [ ] **394.10 — the shape layer ships: llms.txt points at the worked screens,
       and the package exports patterns, jobs and llms.txt.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.9
       - **Accept — the property.**
         - **llms.txt.** It gains a Screen kit pointer and two generated
           sections, "Jobs → shape" and "Worked screens". Record the byte
           change. A fixed-string grep of the built llms.txt finds "screen kit"
           and every module facet. On 2026-09-25 that grep found 0 hits for
           "screen kit", "sales" and "distribution".
         - **Exports.** `@busy-office/ui` exports `./patterns`, `./jobs` and
           `./llms.txt`, each with a schema tag. They are visible in
           `npm pack --dry-run`.
         - **Build order.** The three files come from `apps/docs` generators,
           and today the docs build runs after the core build and after
           `check:package` (publish.yml: build core, then docs, then publish).
           The property is that a core-only `npm run build -w @busy-office/ui`
           produces all three, with no dependency on the docs build, and
           `check:package` asserts that every entry in `exports` resolves in
           the packed tarball. Red-prove it by deleting one file from the
           tarball's staging.
         - **Compatibility of the data.** The versioning page says, generated
           from the schema tags: each file's schema is API (a shape change is a
           Breaking entry). Row values (jobs, also-called words, facets) are
           data and may change in any minor, and the versioning page's "Not
           API" list says so.
         - **112.3's instrument.** The llms.txt byte change is written into
           112.3's record in ROADMAP.md (ROADMAP.md:3002).
         - **CHANGELOG.** The entry's compatibility class matches the actual
           change, and the entry gives the reasoning.
         - **Publishing** stays owner-triggered.
11. [ ] **394.11 — the reference-delta record (folds 392.5).**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept — the property.**
         - **392.5.** Its property holds: one maintained place lists BO's deltas
           against fundamental-styles. Each delta is marked either Evidence
           (2 or more sources) or Hypothesis with its counter-evidence.
         - **Layouts.** The same place gains one line per Phase 2 layout. The
           line names what the layout does better than the reference it cites
           (ROADMAP.md, "References are floors").
12. [ ] **394.12 — Jev hygiene: the rubric describes the fields as measured
       (folds 377.10).**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept — the property.**
         - **Line 41.** `jev-rubrics.md:41` describes `confidence` as measured.
           The premise, that it is rescaled by the number of options (0.92 →
           0.90 with 4 options, and 0.96 → 0.94, both from 2026-09-25), is
           re-measured by one live probe whose payload and answer are quoted.
           Finding the premise false is a satisfying outcome.
         - **n agrees.** The rubric's heading, the rubric's text and CLAUDE.md
           give the same n.
         - **377.10** closes by its own Accept, run here: 20 cases, uniform
           criteria, 3 or more repeats, and the false-positive and
           false-negative rates at 0.85 and 0.35 with their spread.
13. [ ] **394.13 — the queue-screen calibration set, built from ROADMAP history.**
       Milestone: M1 · Phase: 1
       Route: build
       - **Accept — the property.**
         - **Reproducible.** `scripts/loops/queue_screen_harvest.py`, run on
           HEAD, reproduces the committed tune and holdout files exactly.
         - **Counts match.** Each class count equals a raw count taken from git
           history.
         - **Hand check.** A 20-case sample is read by hand. The label precision
           is recorded, with every case that disagrees.
         - **Split fixed first.** The rule that splits tune from holdout is
           committed before any Jev call.
         - **Pilot cases.** The 26 pilot items go in tune only.
         - **Discovery re-plans.** These are labelled according to the owner's
           answer to O15.
14. [ ] **394.14 — the queue screen (JQ): the gate, the script, stability probes
       and calibration, in shadow.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.12, 394.13, 394.18, 393.4
       - **Accept — the property.**
         - **Precondition.** 394.18 is closed: the owner answered O13, and
           CLAUDE.md's Jev section names the third point (prompt §6).
         - **Gate file.** `scripts/loops/queue_screen.json` holds the questions
           and rules from prompt §6 JQ word for word, plus the mode 394.18
           recorded. `kev-gate lint` reports 0 errors on it. The committed
           pilot file (`.roundtable/milestone-m1-2026-09-25/queue_screen.gate.json`)
           is the starting point.
         - **Rubric.** `.roundtable/jev-rubrics.md` gains JQ as its own rubric:
           the questions, the cuts, the tune/holdout set and its validation
           status. The rubric says Rubric 3 (dispatch) stays off.
         - **The 09-21 reopen conditions.** The record quotes
           `grill-kev-in-the-loop-2026-09-21.md`'s "What would reopen it" and
           shows each condition met: labels from recorded outcomes (394.13),
           and answers stable under unrelated prose (the probes below). It
           also shows that Part 1 is untouched, because code still picks the
           item.
         - **Script.** `queue_screen.py --item <id>` calls Jev over direct HTTPS
           with an explicit User-Agent. Its `--self-test` shows each failure
           class returning `sharpen` with exit code 0: no key, 401/403,
           timeout, non-JSON, a missing question, an unknown option key, and a
           changed `/v1/models` string.
         - **Memo.** An unchanged item text reuses the logged answer.
         - **Probes before calibration.** Run three: add a framing sentence,
           repeat 3 times, and permute the option order. A question is dropped
           if its deciding fact moves more than 0.05 on more than 10% of cases.
         - **Calibration.** Calibrate on tune, then run the holdout once. The
           results record missed, over-escalated and misrouted counts, the
           over-escalation rate, a ±0.1 and ±0.2 sweep with the nearest miss,
           and the model string.
         - **Refusal is allowed.** If the gate is refused, the record says so and
           the screen stays code-only. That is a satisfying outcome.
15. [ ] **394.15 — the queue screen runs beside every milestone dispatch, and its
       outcomes are joined.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.14, 393.2
       - **Accept — the property.**
         - **One row per dispatch.** Every M1 dispatch gets exactly one row in
           `.roundtable/queue-screen-shadow.jsonl`, or one logged fail-open,
           and the report counts both.
         - **Join.** `record_iteration.py --screen <row-id>` joins each row to
           its outcome.
         - **Escalate-only, if 394.18 chose it.** A `sharpen` answer launches
           the planner on the item, blind (it is not told that JQ sent it),
           with at most one bounce per item, counted toward rule D's limits.
           Every other answer is logged only. Red-prove it with a fixture item:
           a `sharpen` answer produces exactly one planner launch, and an
           `ask-owner` answer produces none.
         - **Report.** `queue_screen.py --report` scores only decided rows that
           joined an outcome, on one question fingerprint. It prints:
           - missed, over-escalated and misrouted counts;
           - the over-escalation rate;
           - the fail-open rate by item;
           - the executor wakes the screen would have diverted.
16. [ ] **394.16 — OWNER CALL: promote the queue screen, keep it in shadow, or
       retire it.**
       Milestone: M1 · Phase: 1
       Route: owner
       After: 394.15
       - **Accept — the property.** The record cites a shadow report, and the
         owner chooses one of three outcomes. Each outcome closes this item.
         - **Promote.** Allowed only when the report shows all of these:
           - at least 20 joined outcomes;
           - at least 5 above rank 0;
           - 0 missed;
           - an over-escalation rate of 0.5 or less;
           - a fail-open rate below 20% by item;
           - an admitted calibration.

           In enforce mode the screen changes which reversible action handles an
           item, never which item is picked.
         - **Keep in shadow**, citing the report.
         - **Retire to code-only**, citing the report.
17. [ ] **394.17 — the incubation recipe: `new:component --experimental`, a
       CLAUDE.md "How to incubate a component" section, and the triage wording.**
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.4, 394.5, 394.6, 394.7, 394.8
       - **Accept — the property.**
         - **The stamp.** A component stamped with `--experimental` passes every
           gate as experimental. The only hand edits are its demo and its
           opener.
         - **The recipe** names, for each state, which artefacts exist and which
           gate checks them.
         - **Worked diffs.** Following the recipe alone produces a graduation
           diff and a removal diff. Both are shown in a scratch tree.
18. [ ] **394.18 — OWNER CALL: declare the queue screen as Jev's third point
       (O13), say what may leave the machine, and choose its mode before
       promotion.**
       Milestone: M1 · Phase: 1
       Route: owner
       - **Accept — the property.** The owner commits an amendment to
         CLAUDE.md's Jev section (today "exactly two points" and "not a gate").
         It names the queue screen as a third declared point that never picks,
         orders or approves an item. The same commit records:
         - what may be sent to jev-ai.pro. The recommended answer is roadmap
           item text only; the repo is public, so that text already is;
         - the mode until 394.16 decides promotion, recorded in
           `queue_screen.json`:
           - **shadow**: log only;
           - **escalate-only**: a `sharpen` answer launches the planner,
             blind, one bounce per item. This makes owner answer 1 ("Jev needs
             to call another model") true before promotion, in the one
             direction that can only add work.

         Declining is a satisfying outcome: 394.14-394.16 then close as
         refused, citing this item, and the planner and item lint still run
         on code triggers alone. 394.14 waits on this item, so O13 does not
         block ACTIVE.

## Slice 393 — M0: loop readiness for Milestone M1. The loop scored 2.1 of 5 (TREAT) on 2026-09-25; the milestone starts only when a re-score reaches 3.0 (owner realignment, 2026-09-25)

**Owner answer 4, 2026-09-25:** "The loop isn't ready for this milestone - then
realign the roadmap." The grill report is at
`.roundtable/grill-milestone-m1-2026-09-25.md`.

**Inclusion test.** It applies to every item here, and to anything proposed for
this slice later. An item belongs in M0 only if, without it, the first unattended
milestone wake would do one of these:
- pick the wrong item;
- collide with another writer;
- hide its own state;
- spend without bound.

Loop-machinery findings raised while M0 runs are not added to M0. They are filed
with a `Parked: M1` line and a revisit trigger. Slice 381's heading is the
reason: "a loop that spent five hours on its own machinery while six P0 fixes
waited on a release".

**How it is dispatched.** Rule 4 takes the oldest open item, and this is the
newest slice. So 393.1-393.10 run under the owner's one-time bootstrap GOAL in
RESUME.md (precedent: RESUME.md:93, d66a02df), and 393.4 then retires that
mechanism. Once the milestone is ACTIVE, rule M dispatches 393.11 and 393.12.
Every item that fans out waits on 393.12.

**Exit test for M0.** Items 393.1-393.10 are closed, and 393.10 reports a
loop-doctor mean of at least 3.0 with no dimension at 1. The owner then sets
`Status: ACTIVE`.

**The realignment table, applied by 393.9.** Every open item as of 2026-09-25
(65 raw `[ ]`; reconciled by `classify_r2.py`, committed by P5 and updated for
377.4's move):

**Why an absorbed item carries `After:` on the item that absorbs it.** Rule M
takes the oldest dispatchable M1 item. Without that line, a folded item (377.x,
389.x, 249.7) would be older than every Slice 393-397 item, so rule M would
dispatch it on its own, first. Every absorbed item therefore gets:
- `Milestone: M1 · Phase: <n>`;
- a `Route:` (393.4 refuses an ACTIVE-milestone item without one);
- `After: <absorbing item>`.

It closes in the absorbing item's landing commit, by its own Accept.

- **M0 (3):** each gets `Phase: 0`, `Route: build`, and `After:` on the item
  that absorbs it.
  - 392.4 and 381.2 go to 393.5.
  - 377.3 goes to 393.11.
- **Folded into the milestone (22).** Each keeps its own Accept and gains
  `Milestone: M1`, the absorbing item's Phase and Route, and `After:` on the
  absorbing item:
  - 392.5 goes to 394.11.
  - 377.10 goes to 394.12.
  - 249.7 goes to 394.9.
  - 376.5 and 389.14 go to 395.1.
  - 17 items of Slice 389 go to 396.12: 389.1, .2, .5, .6, .7, .8, .9, .10, .11,
    .12, .13, .15, .17, .18, .20, .21, .22.
- **Defect track (16).** These carry `Track: defect` and stay dispatchable
  through the interleave: 392.2, 392.3, 389.3, 389.16, 389.19, 389.23, 389.24,
  388.3, 388.4, 387.1, 387.2, 386.1, 377.4, 377.8, 377.11 and 375.11.
  - 375.11 waits on precondition P3.
  - 386.1 is recommended before 395.1 adds new standalone pages.
  - **377.4 moved here from "folded".** It is pointer coverage for shipped
    behaviours (16 of 26 listen for pointer input). Folded with no absorbing
    item, it would have been rule M's first pick. Here the interleave serves
    it, and any N.3 item for a part with a pointer listener carries
    `After: 377.4`.
- **Parked (9).** These carry `Parked: M1 — <reason> — revisit: <trigger>`:

  | Item | Revisit when |
  |---|---|
  | 391.1 | the dispatcher topology keeps a cloud gate runner |
  | 384.1, 376.7 | the Standardize run at milestone close |
  | 381.1 | milestone close, unless the owner wants "unwire" now |
  | 377.7 | the Objective grill at milestone close |
  | 377.9 | the next change to CI cost |
  | 377.12 | a stale-docs-container incident |
  | 377.13, 377.14 | milestone close |
- **Owner-blocked (15).** 393.3 normalises their markers.
  - Decided inside the milestone:
    - 377.5 goes to 394.3.
    - 377.6 goes to 394.2.
    - 373.6: 395.1 prepares its options; the owner decides.
    - 112.3 and 112.4 go to owner decision O10.
  - 374.4 gets its missing marker. Its ACR half is covered by 377.8.
  - 373.8 is revisited when 394.6 adds the Experimental sidebar group.
  - Unchanged: 369.1, 296.3, 273.2, 249.10, 249.11, 249.12, 249.13, and AT
    runtime evidence.

No item closes on the realignment commit. Each closes on its own Accept, or as
superseded once a named item has landed or the owner has acted.

1. [ ] **393.1 — one committer: a wake halts on a HALT file or on a foreign
       commit.**
       Milestone: M1 · Phase: 0
       Route: build
       - **Accept — the property.**
         - **HALT file.** LOOPS.md Step 0 tests for `.roundtable/HALT` before
           any other read. When the file exists, the wake stops and prints its
           first line. Red-prove this in a scratch clone.
         - **Foreign commits.** At Step 0, and again just before the wake's
           first commit, the wake runs `git fetch origin main` and lists
           `git log HEAD..origin/main --format='%h %an %ai %s'`. A commit from a
           writer that the owner's topology (O1) does not allow halts the wake
           before it writes anything, and the hand-off records the commit's sha.
           Red-prove this on a scratch clone with a fabricated commit. Re-read
           LOOPS.md:282-283, the local/cloud offset tell, before relying on it.
         - **Step 0c.** LOOPS.md Step 0c records the topology as a dated entry
           that confirms or reverses 162.1 by name, citing collisions 6-8
           (LOOPS.md:179-198).
         - **Stray sessions.** A `RemoteTrigger list_runs` across every page
           shows no active session outside the topology. If one is found, the
           wake stops and notifies the owner.
2. [ ] **393.2 — the in-flight protocol: one workflow at a time, a hold that reads
       nothing, and a wall-time cap.**
       Milestone: M1 · Phase: 0
       Route: build
       - **Accept — the property.**
         - **The line.** `scripts/loops/inflight.py open|close|status` keeps one
           structured line under RESUME.md `## In flight`:
           `wf=<id> item=<id> started=<UTC> cap=<min> session=<id> out=<path> paths=<globs>`.
           `open` exits non-zero if a line already exists. `status` exits 0
           when there is no line, 3 when a line is under its cap, and 4 when a
           line is past its cap. Red-prove each exit code.
         - **The hold.** A timer wake that finds an open line still under its
           cap makes at most 3 tool calls and dispatches nothing. Measure this on
           one real hold and quote the count.
         - **The cap.** When the cap is reached, the dispatcher stops the
           workflow, keeps its partial output at `out`, records a
           `--outcome logged` row naming what did not finish, and clears the
           line. Red-prove this with a 2-minute cap.
         - **Hold counter.** Each hold records `hold-wakes`, and
           `dispatch_status.py` prints the running count.
3. [ ] **393.3 — the backlog mirror reports every kind of wait, and prints the
       oldest dispatchable item.**
       Milestone: M1 · Phase: 0
       Route: build
       - **Accept — the property.**
         - **Owner markers.** The owner-marker parse in `generate_status.py`
           (today :92-93) must:
           - match across line wraps;
           - accept `OWNER OR <X> CALL` and `OWNER ·`.

           Replay it on the ROADMAP.md of the commit before this item. It must
           flag every item a wide-marker audit flags, and the command and its
           output are quoted. The audit (`blocked_audit.py`, committed by P5)
           found 6 disagreements on 2026-09-25: 377.5, 377.6, 373.8, 369.1,
           249.12, and 374.4, which has no marker. An item whose `Route:` is
           `owner` counts as owner-blocked whatever its prose says, so the
           marker and the route cannot disagree.
         - **New marker kinds.** Each sits on its own line and is reconciled
           against a raw line count of ROADMAP.md; any mismatch refuses the
           write.

           | Marker | Meaning |
           |---|---|
           | `After: <id>[, <id>]` | dependency-blocked while any target is open; an unresolved target refuses the write |
           | `Parked: M1 — …` | held only while M1 is ACTIVE |
           | `Milestone: M1 · Phase: <0-3>` | milestone membership and phase |
           | `Route: <id>` | which route runs the item |
           | `Track: defect` | the defect track |
         - **STATUS.md.** It lists owner-blocked, dependency-blocked, parked and
           browser-blocked separately, and prints `oldest dispatchable: <id>`.
         - **Fixture red-proofs.** Each is confirmed in the parsed mirror:
           - an open `After:` target holds its item, and a closed one releases
             it;
           - `Parked` holds under ACTIVE and releases under CLOSED;
           - a wrapped owner marker is flagged;
           - deleting one `After:` line fails the reconcile.
4. [ ] **393.4 — `milestone.py` and rule M: code computes the milestone's next
       item.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.3
       - **Accept — the property.**
         - **The parser.** `scripts/loops/milestone.py` is `@heuristic` and ships
           `--self-test`. It parses the `## Milestone M1` fields and the tagged
           items. Text after `#` on a field line is a comment and is ignored,
           so the `# (O…)` hints do not read as unfilled values. It
           reconciles the `Modules` field against `examples/erp-suite/_shell.mjs`
           MODULES once 394.9 has closed. It holds 397.2 while any other open
           item tagged `Milestone: M1 · Phase: 2` exists.
         - **What `dispatch_status.py` prints.** It imports the parser and
           prints the `milestone`, `rule M`, `interleave`, `skipped`, `blocked`,
           `direction`, `budget` and `reconcile` lines.
         - **When it refuses.** It exits non-zero, with no verdict, when:
           - more than one milestone is ACTIVE;
           - a field has an unknown value;
           - a parsed marker count differs from the raw count;
           - an `After:` target does not resolve;
           - an item in an ACTIVE milestone has no `Route:`, or one that is not
             in `routes.json`.
         - **No change when inactive.** With no ACTIVE milestone, the output is
           byte-identical to the output before this change. Quote the diff.
         - **Self-test fixtures:**
           - no dispatchable M1 item prints `DIRECTION GAP`;
           - when every M1 item is owner-blocked, the wake falls through as
             `Precedence` says and names the ids;
           - an open `After:` holds its item;
           - with `interleave 1/N`, the Nth dispatch goes to the oldest
             dispatchable `Track: defect` item, and to rule M's own pick when
             no defect item is dispatchable;
           - the dispatch order over the pasted slices matches
             `simulate_rule_m.py`'s, quoted.
         - **LOOPS.md.** Step 2 carries rule M and rule D in the positions prompt
           §4 gives. The prose "In flight" and GOAL override (LOOPS.md:630-633)
           is retired with a dated line.
5. [ ] **393.5 — milestone rows move the counters the way the rules say (folds
       392.4 and 381.2).**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.4
       - **Accept — the property.**
         - **Loop names.** `record_iteration.py` rejects a `--loop` value
           outside one closed set, stated once as a constant in the script.
           The set is every name the log already uses plus LOOPS.md's table.
           On 2026-09-25 the log held Continue 670, Meta 577, Roadmap 171,
           Standardize 169, Objective 112, Explore 57, Polish 35, Optimize 3
           and Gauntlet 1. LOOPS.md's table lacks Meta, and CLAUDE.md names
           six. A set taken from LOOPS.md alone would reject Meta, the label of
           577 refusal rows. Re-count before choosing. `check-loop-vocab`
           extends to this set, as it already does for outcomes, and CLAUDE.md
           and LOOPS.md are corrected to agree with it. Red-prove the rejection
           with `--loop Layout`.
         - **Tags in the row.** `--milestone M1` and `--track defect` are
           written into the loop-log.md row, not only into loops.db, because
           `dispatch_status.py` reads the log: rules 2 and 3 under `scoped`,
           and the interleave count, are counted from the row.
         - **392.4** closes by one of its own two routes, with the replay its
           Accept names.
         - **381.2.** Its base-rate count is quoted, with its command, before
           the owner fills in `Rules-2-3`.
         - **Scoped counting.** Under `Rules-2-3: scoped`, only rows tagged M1
           count toward rules 2 and 3. Red-prove this on a fixture log, quoting
           `dispatch_status.py` after each fixture row.
6. [ ] **393.6 — routes: the roadmap names which model does each item (owner
       answer 1), and telemetry records who did it.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.4
       - **Accept — the property.**
         - **The route table.** `scripts/loops/routes.json` is reviewed in a diff
           and never generated. It holds every route that prompt §5 lists. Each
           route gives:
           - loop and mode;
           - tier;
           - effort;
           - skills;
           - critic;
           - its hand-up to `planner`.
         - **Refusals.** `milestone.py` refuses a route that is not in the table,
           and a tier that the Milestone `Tiers` field does not permit.
         - **Telemetry.** `record_iteration.py` gains `--route`, `--model`,
           `--agent`, `--skill` and `--first-try landed|reworked|reverted`. It
           writes loop-log.md first and loops.db second, and reconciles the
           mirror against a raw count of the log. Red-prove the reconcile by
           dropping one row.
         - **Rebuildable from the log.** The new fields are appended to the row
           in a form that `dispatch_status.py`'s `ROW` still matches, with its
           bullets-equals-rows guard intact. `rebuild_from_log.py` restores
           every new column from loop-log.md alone. Rows written before this
           change parse with the new fields empty and are never backfilled
           (`record_iteration.py`'s standing rule). Red-prove it: delete
           loops.db, rebuild, and show the new columns equal the pre-delete
           rows.
         - **Jev stays out.** No Jev code reads or writes a Route.
7. [ ] **393.7 — rule D: when there is no task, or an item is unclear, the loop
       goes to the planner (owner answer 1: "which is bigger target").**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.4, 393.6
       - **Accept — the property.**
         - **Triggers.** With M1 ACTIVE, `dispatch_status.py` prints
           `direction: DIRECTION GAP <trigger>` when any trigger in prompt §7
           fires (D1-D3, and D4 only if the owner sets it). Before the rule
           ships, measure each trigger's firing rate by replaying loop-log.md as
           it stood on past dates, and quote the replay.
         - **The item lint** (tier 0, code only). It sends an item to `sharpen`
           when the item has no Accept, when its Accept names no instrument, or
           when its Route is missing or unknown. Quote the lint's catch rate on
           history, re-run rather than copied. The scratch lint caught 15 of 45
           re-plans and flagged 19 of 309 items that were built as written.
         - **Planner output.** A planner commit that adds an item with no Accept,
           with an unknown Route or with an unresolved `After:` fails
           `milestone.py`.
         - **Frequency limits.** Rule D fires at most once per 24 h per trigger.
           Two consecutive wakes that only plan halt the loop with a
           PushNotification; red-prove this with a fixture. A second empty D1
           review falls through to rules 5-8.
8. [ ] **393.8 — a bounded hand-off, one wake prompt, and the milestone's read
       set.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.2, 393.4
       - **Accept — the property.**
         - **RESUME.md.** It holds only these sections: `In flight`,
           `Uncommitted`, `Next rule`, and `Direction` (dated). It stays at or
           under the Milestone `resume-lines` cap.
           - The history moved out of it is accounted for line by line, in both
             directions.
           - `check-resume-charter` exits non-zero at cap + 1. Red-prove it.
           - It keeps the blockquote pointer to `ENVIRONMENT.md` that
             `check-resume-charter` already asserts. The milestone's read set
             (prompt §4) includes ENVIRONMENT.md.
         - **Milestone progress** is generated into STATUS.md from the markers.
         - **One wake prompt.** A grep finds exactly one copy of it. The
           repeated paragraph at LOOPS.md:353-361 and 363-371 is gone, and every
           trigger points at the one copy.
         - **Read cost.** Count the words read at Step 0 on one real milestone
           wake, and report the figure against round 1's reading of about 110k.
9. [ ] **393.9 — apply the realignment markers to the 65 open items. They stay
       inert until the milestone is ACTIVE.**
       Milestone: M1 · Phase: 0
       Route: mechanical
       After: 393.3, 393.4
       - **Accept — the property.**
         - **Marker sets.** Each open item carries exactly the markers that its
           disposition in the table above implies. For an absorbed item that
           means `Milestone`, `Route` and `After: <absorbing item>`; without
           the Route, 393.4 refuses to print a verdict once M1 is ACTIVE. The
           edits are made by hand, one block at a time.
         - **Order.** `simulate_rule_m.py` over the whole ROADMAP.md shows that
           no folded item is rule M's pick before the item that absorbs it.
         - **Nothing closes.** The count of `[ ]` lines is the same before and
           after, and both counts are quoted.
         - **Reconcile.** `milestone.py` agrees with the raw counts.
         - **Checked by script.** A script, not a reading, checks the
           regenerated STATUS.md against the table. Re-count first: the table is
           a snapshot.
10. [ ] **393.10 — re-score the loop; the owner activates the milestone only at
       "watch".**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.1, 393.2, 393.3, 393.4, 393.5, 393.6, 393.7, 393.8, 393.9
       - **Accept — the property.** `busy-office:loop-doctor` is re-run on HEAD,
         and the mean and every dimension are quoted.
         - **Who scores.** A fresh-context subagent that did not build
           393.1-393.9 runs the re-score, since no builder grades its own work.
         - **The four Invalids.** Each Invalid the 2026-09-25 score named is
           re-checked by its own command, and the output is quoted:
           - the self-contradicting hand-off;
           - a design-grill resetting rule 3 (392.4);
           - two live dispatchers with no kill switch;
           - no in-flight rule.
         - **Closes on HEAD.** Before the re-score, the named commands of
           393.1-393.9 are re-run on a clean HEAD worktree, which is 377.3's
           property applied by hand, since 393.11 builds the tool only after
           activation. 2 of 30 closes since 2026-09-19 were false at HEAD.
         - **Pass.** A mean of 3.0 or more with no dimension at 1 sends a
           PushNotification asking the owner to set `Status: ACTIVE`.
         - **Fail.** Otherwise the report names the failing dimension, and the
           milestone stays DRAFT.

         Either verdict satisfies this item.
11. [ ] **393.11 — a close is verified on HEAD alone (folds 377.3).**
       Milestone: M1 · Phase: 0
       Route: build
       - **Accept — the property.** `record_iteration.py --outcome landed` does
         one of two things:
         - rebuilds HEAD in a throwaway worktree and re-runs the item's named
           commands; or
         - quotes a build sha taken from HEAD alone in the completion review.

         Replaying the 43cca240 close fails.
12. [ ] **393.12 — worktree isolation and fan-in, as code.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.11
       - **Accept — the property.**
         - **Isolation.** One script:
           - creates a detached worktree;
           - runs `npm ci` inside it;
           - builds core;
           - asserts that `realpath(@busy-office/ui)` resolves inside the
             worktree, and fails loudly on a symlinked `node_modules`. Red-prove
             this.
         - **Numbering.** Slice and item numbers are allocated after a fetch and
           before any fan-out.
         - **Fan-in check.** It lists the paths each agent touched. It fails if
           any agent wrote a shared file:
           - ROADMAP, loop-log, STATUS, RESUME, CHANGELOG;
           - the ledger;
           - the suite registries;
           - generated files.
