# busy-office-ui — Roadmap

A CSS-first ERP UI framework: semantic components, density-aware tokens, modern CSS,
generated-and-verified docs. This file is the long-term plan; per-slice detail and the
design-review trail live in `.roundtable/`, and every breaking change is in
`CHANGELOG.md`.

## Objective — the direction (set by the owner, 2026-08-16)

**Make complex ERP UI simple: the framework absorbs the hard problems so
the app doesn't have to.** Every proposal to add, change, or remove
anything passes the three principles below — each carries explicit
**accept / refuse / rethink** tests so decisions are made against the
direction, not against momentum. Anything that fails a test is refused
outright or sent to the design panel; "it would be useful" is never
sufficient on its own.

### 1. Simplicity — simple is the best; make the complex simple

The framework's job is to take on genuinely hard problems (accessibility
contracts, precision, density, theming, focus, save semantics) and hand
back something that reads obvious. Power that complicates the consumer's
markup or mental model is failure, not capability.

- **Accept** when it lets a consumer *delete* code, markup, or decisions.
- **Refuse** when using it correctly requires understanding more than its
  own docs page, or when its explanation needs a caveat list to be honest.
- **Rethink** when a docs explanation keeps growing to cover a surface —
  the fix is simplifying the thing, never the prose. (Precedent: the
  lossless-reformat fix — the simple contract "never change the number"
  replaced a growing pile of rounding caveats.)

### 2. Less for more — fewer options, more possibility

One component, many settings. Composition over variants. Native elements
over invented widgets. Every new option must open more use-cases than the
one that asked for it.

- **Accept** when one general mechanism replaces N specific asks
  (precedent: `data-density="spacious"` IS the warehouse-floor variant —
  no `--large` modifier ever shipped).
- **Refuse** a modifier/part/attribute that serves exactly one scenario,
  and any second way to do something that already works.
- **Rethink** when two surfaces start growing toward each other — merge
  them or extract the shared primitive (precedent: the `decimal-input`
  util under money + quantity).

### 3. Reusability is the key

Nothing ships for one screen. A piece earns its place by surviving ≥2
real, independent compositions (the same bar behaviors already meet
before being called stable). Prefer the primitive that composes over the
composite that locks.

- **Accept** when it works, unchanged, in a context it wasn't designed
  for.
- **Refuse** when it embeds app/domain decisions — data, workflow,
  policy stay with the consumer ("framework does visuals, you do the
  data"); the rare deliberate exception is named, documented, and always
  overridable (precedent: the currency/unit tables).
- **Rethink** when reuse requires copy-paste-modify — extract the
  reusable core instead of shipping the copy.

**Precedence (owner call, 2026-08-21): suitability beats reuse at the
point of use.** Reusability decides what SHIPS in the framework;
context-suitability decides what a screen USES. When they conflict — a
reusable control that is wrong for the context (steppers in a dense
line grid; the joined money widget crammed into a table cell) — the
suitable design wins, because an unsuitable design damages the UX no
matter how reusable it is. The resolution is always to pick or build
the suitable REUSABLE primitive (the field matrix on
`/concepts/design-language` says which, per field type × context),
never a one-off.

### 4. Design the decision, not the screen (added 2026-08-19, owner input — the Ive filter)

A screen exists to serve **one decision its user must make**, and everything on
it is ranked by that decision. "The payroll manager needs to know whether
payroll is safe to release" is a design brief; "we need a payroll screen" is
not. Complexity lives under the interface, never in the user's mental model —
the system may run fifty validations, the user reads *Ready · 428 employees ·
2 exceptions*.

- **Accept** when the screen answers, in order, *what is this / what should I
  look at / what should I do* — and the primary action is singular and obvious.
  (Measured 2026-08-19: 18 of 19 pattern screens already have ≤1 visually
  primary action; the wizard's Next/Submit pair is the legitimate exception —
  never both visible.)
- **Refuse** any element whose removal does not materially reduce the user's
  ability to decide — and any state text that names the mechanism instead of
  the meaning (`Processing Status: 04` is refused; "Ready to release" with
  detail underneath is the shape). If an element needs a long explanation to
  justify existing, that is the signal it should not.
- **Rethink** when a screen accumulates a second primary action or a second
  audience — it is usually two decisions sharing one page, and the fix is a
  split, not a bigger toolbar.

**The screen's decision lives inside a journey** (owner input, 2026-08-20 —
the full Ive document's §4): a decision is one step of Request → Validation →
Exception → Resolution → Approval → Execution → Confirmation, and a beautiful
screen inside a terrible workflow is still a bad product. The unit of design
is the journey; screens are its steps.

- **Accept** when a screen's exits land the user at the next decision with
  context intact — the approval screen's "done" IS the confirmation state,
  not a dead end the user navigates away from blind (precedent: po-app's
  edit → 302 → record-with-new-values, and the mass-change 422 that
  re-renders in place instead of losing the user's selection).
- **Refuse** a screen designed in isolation — one whose entry assumes state
  no prior step produces, or whose exit drops the user somewhere no next
  step picks up. If the pattern page cannot say which step precedes and
  follows it, that's the signal.
- **Rethink** when a journey needs a screen that exists only to bridge two
  others (a "now click here to continue" page) — the fix is merging the
  handoff into an exit, not adding a step.

The full 10-question version of this filter runs on demand as `/design-grill`
against a named screen — or against a whole journey as
`/design-grill flow:<a> > <b> > <c>`; this section is the every-wake
distillation.

**References are floors, not ceilings** (owner, 2026-08-23, during the
RF-coverage grill): research citations prove a need RECURS — they never
define the solution. Parity with SAP/Fiori/Zebra/anyone is not an Accept
criterion; every design must name what it does BETTER than the reference
it cites (typically: two-channel state, no-JS floor, reduced-motion and
forced-colors correctness, honest docs, composition over new surface). A
proposal that cannot name its improvement is copying, and gets rethought.

**How it binds the loops:** Roadmap triage tests every new ask against
these before queuing (refuse/rethink are valid triage outcomes, recorded
with the reason); the design panel grills slices against them; removals
face the same tests as additions — deleting a surface consumers compose
against is a Breaking-entry decision, not a tidy-up.

## Milestone M1 — Layouts and components for a long-use ERP app

> **DRAFT, round 2 (2026-09-25). Not active.** O1-O4 decided by the owner 2026-09-25 (below); M0 (Slice 393) is approved to run as a one-time bootstrap capped at 12 wakes; after 393.10's FAIL the owner extended it on 2026-09-26 to one retry (398.1, 398.2, then the re-score 398.5), capped at 13.
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
Budget: m0-wakes 13 · wakes OWNER · agents/wake OWNER · workflow-wall OWNERm · experimental 2 · resume-lines 120 · direction-items 5
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

- **Step 0.** A wake runs `step0_guard.py` first (HALT, then the checkout,
  then foreign commits), then the in-flight line. Each check can halt the wake
  (393.1, 393.2).
- **Step 2.** Rule M (the milestone's oldest dispatchable item, with the
  interleave) sits below rules 2-3 and above rule 4. Rule D (the planner)
  sits directly below rule M (393.4, 393.7). Oldest-first means every
  dispatchable Phase 1 item runs before the frame: dispatch #26 by
  `simulate_rule_m.py`. `After:` lines hold items back but never pull one
  forward.
- **Rules 2 and 3** follow the `Rules-2-3` field (393.5).
- **Step 0c.** "Accept collisions" is reversed (O1), and a foreign commit
  halts the wake (393.1). This and Step 0 are live already, since M0; they are
  listed because M1 depends on them.
- **Jev.** CLAUDE.md's Jev section names a third point, the queue screen, once
  the owner closes 394.18 (O13). It runs in shadow, or in escalate-only if the
  owner chooses that there.

### Owner decisions recorded here (numbers from the round-2 report)

| O1 | O2 | O3 | O4 | O5 | O6 | O7 | O8 | O9 | O10 | O11 | O12 | O13 | O14 | O15 | O16 | O17 | O18 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| local /loop only; cloud sessions archived by the owner | parked on branch `park/owner-checkpoint-2026-09-20` (`a9a2d9bb`) | bootstrap 393.1-393.10 approved; rules 2 and 3 paused until 393.10; cap 12 wakes. **Extended 2026-09-26** after 393.10's FAIL: one retry, 398.1 → 398.2 → re-score 398.5; rules 2 and 3 paused until 398.5; cap 13 | CLAUDE.md naming rule widened (shape names everywhere; tier word left to O7) | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ | ___ |

## CI strategy — measured, and why branches are not the lever (2026-08-24)

Owner asked whether a dev/main split should manage different CI. **It should
not, and the timing data says why: CI was slow for a structural reason, not a
branching one.**

Measured before changing anything: ~12.4 min of serial steps, lopsided —
scroll 216s (29% of the run), claims 104s, axe 68s, layout 65s, container 59s.
Eleven browser gates each launched a browser and walked the same 121 built
pages.

Fixed structurally, **without touching branches**: sharding the browser gates
into five parallel jobs took wall clock to **184s**. Plus `paths-ignore` for
narrative-only commits (8 of the last 30 touched only `.roundtable/**` and
`STATUS.md`) and `cancel-in-progress` for superseded pushes. Roughly **4x**,
with no change to what any gate asserts.

**Why NOT tier gates by branch.** This file's own doctrine already answers it:
*a gate that only runs in CI is not known to work.* The corollary is worse — a
gate that only runs on `main` finds problems **after** the merge, which is the
expensive moment to find them. Cheap-on-dev / full-on-main also trains you to
trust a green that means less than it says. Same gates everywhere; make them
fast instead. At 3 minutes there is nothing left to tier.

**Branches ARE worth it — for a different problem.** Twice on 2026-08-24 the
owner and the loop edited the same working tree simultaneously: once an
independently-written ledger entry was swept into an unrelated commit by
`git add -A` (which is how two gaps briefly shared the number 17), and once a
whole slice (139) was found already implemented and uncommitted. Branches plus
separate worktrees remove that contention entirely, and `fix/docs-search-bar`
showed the shape working. So: **branch for isolation and review, not for CI
tiering.**

**Standing rules that follow:**
- Same gate set on every branch and on `main`.
- `main` protected, requiring CI green.
- Anything that reads a file must not be in `paths-ignore` — `DESIGN.md`,
  `ROADMAP.md`, `LOOPS.md`, `README.md` and `CHANGELOG.md` are each read by
  gate scripts, so none of them may be ignored. **`.roundtable/**` and
  `STATUS.md` were the two exceptions and they are not exceptions: both are
  read, and `paths-ignore` is gone entirely** (312.2, 2026-09-07). The rule
  survives; only its exception list died. The `~4x` above still holds — it was
  sharding, not the ignore: sharding took wall clock 12.4 min → 184s, and one
  run today measures ~3 min wall / ~14.7 machine-minutes. What the removal
  costs is *more runs*, not slower ones.
- Re-measure before optimising again. The single biggest win here was a loop
  written the wrong way round, and no amount of workflow tuning would have
  found it.

## Sequence — what runs next, and why in this order (owner, 2026-08-24)

> **SUPERSEDED 2026-08-24, recorded 2026-08-28 (Slice 170.1). Every row below is
> closed or was deliberately dropped; this section is kept as the record of the
> reasoning, not as the plan.** It was written at 20:45 and the commit run that
> closed 130.4 *without Inventory or Finance* — the owner's own call, on the
> evidence — landed at 21:22, four commits later; 193 commits have passed over it
> since without an edit. 140.3 and 130.5 are `[x]` in `ROADMAP-archive.md`;
> 130.4a Production was built, 130.4b/c were not. The gated list below is stale
> too: it says "precondition met (0.3.0 cut)" and the package is at **0.5.0**.
> For what is open **now**, read the `N. [ ]` checkboxes or generated `STATUS.md`
> — never a count written into prose.
>
> ```
> git log -1 --format='%h %ai' d04b5557   # wrote this section
> git log -1 --format='%h %ai' 45baaa12   # closed 130.4, 37 minutes later
> grep -cE "^[0-9]+\. \[ \]" ROADMAP.md   # what is actually open
> ```

Eighteen items are open; **nine are dispatchable** and nine are gated on the
owner or on a condition — *the count as it stood on 2026-08-24; see the note
above.* The order below is the plan of record. It is derived
from one finding rather than from item age: the instrument grill
(`.roundtable/grill-erp-suite-instrument-2026-08-24.md`) showed that **every
gap the ERP suite has found came from a new SHAPE or from STRESS, and none
from a new domain** — 9, 4, and 0 of the seventeen. So the remaining modules
are ranked by the shapes they force, not by module order.

| # | Item | Why here |
|---|------|----------|
| 1 | **140.3** — predictions on record | Must precede the modules. A yield predicted *after* building is worthless; the whole value is that it can be wrong. Cheap — recording, not building. |
| 2 | **130.4a Production** | Highest predicted yield: BOM as a multi-level hierarchy, capacity over time, the MRP panel. Also where **140.1's reopened question** — intensity over a long date grid — gets tested on a real screen instead of a screenshot. |
| 3 | **130.4b Inventory** | Stock by item × warehouse. Predicted **not** a gap (`comparison` documents a candidates × criteria grid; `data-table` ships `--sticky-col`). Building it either confirms that or proves the prediction wrong. |
| 4 | **130.4c Finance** | Journal entry that must balance, payment list + detail. Predicted **~0 gaps** — all shapes covered. This is the thesis test: a module that finds nothing is a **success**, and the evidence for stopping at shape coverage. |
| 5 | **130.5** — wire the suite into CI | Its own condition is "once it stops changing shape". That is true only after 2-4 land. Ordered last among suite work on purpose: a gate guarding a moving target reports noise. |
| 6 | ~~**136.6 / 136.7**~~ — **both REFUSED 2026-08-24** | The instrument did what this row predicted, and refuted them. 25 ERP screens express document relationships as a document-flow timeline (5) or a related list (2), and use rich text on **zero**. A reference belongs in a structured surface GAP-2 already resolved, not in prose. 136.7's general question — a character counter for the form family — is re-homed as open, not queued. |

**Gated, not sequenced** — these are not "later", they are waiting on someone:

- **112.3** pilot briefs → owner (the loop must never author brief content);
  **112.4** blocked on 112.3's verdict; **112.5** after both.
- **OWNER CALL — direction**: precondition met (0.3.0 cut), awaiting the
  owner's push + GitHub Release.
- **AT runtime evidence**: needs owner hardware — a screen reader this loop
  cannot drive.
- **Turbo**: conditional, and its condition (workspace past ~2 packages) is
  not met.
- **185.2 — register the npm Trusted Publisher for `@busy-office/create-ui`**:
  needs the owner's npm account, wizard at hand
  (`register-create-ui-trusted-publisher.sh`, walked through 2026-08-29,
  not committed — one-off). `@busy-office/ui` already went through the exact
  same sequence (`ROADMAP-archive.md`: manual `0.1.0` publish by the owner,
  then Trusted Publisher registered, then `0.1.1` shipped with SLSA
  provenance) — this is the same step for the second package, not a new
  kind of gap. Two consequences of leaving it unregistered, as the owner
  named them: (1) `create-ui@0.1.0` carries no attestation a consumer can
  verify the build against, unlike `ui@0.5.0` — and that specific version
  can never be retrofitted, since a published version can't be republished,
  so every release skipped here is provenance lost permanently, not just
  deferred; (2) the next real release strands the scaffolder again exactly
  the way 185's original finding described, unless this is registered
  first — `publish.yml` ships create-ui unconditionally after core, so an
  unregistered Trusted Publisher fails that step outright rather than
  silently skipping it. *(The owner referenced this as "ADR-06" — no ADR-06
  or any `docs/adr/` file exists in this repo as of 2026-08-29; recorded
  here rather than assumed, since `domain-modeling`'s ADR support isn't
  wired into this project yet.)*

  **In progress 2026-08-29 (owner, via the wizard).** The npmjs.com panel was
  opened and the form was mostly filled correctly (Publisher GitHub Actions,
  org `Busy-Office`, repo `busy-office-ui`, workflow `publish.yml`) — but a
  screenshot showed **Environment name pre-filled with `@busy-office/ui`**,
  which is wrong: `publish.yml` has no `environment:` key at all
  (`grep -n 'environment:' .github/workflows/publish.yml` returns nothing),
  so an OIDC token from this workflow never carries that claim and saving it
  as-is would make every future publish fail. Flagged before save; owner was
  told to clear that field and leave it blank, matching what `ui`'s own
  config almost certainly has.

  **No wake can verify the save happened, and neither can `npm view`.**
  Browser automation to npmjs.com is blocked at the Claude-in-Chrome
  extension's own site-permissions level (confirmed by two navigation
  attempts, both refused before any page loaded) — not a login issue,
  a hard stop, and account-settings changes like this belong to the owner
  directly regardless. More load-bearing: **the registry has no field that
  states "Trusted Publisher: configured."** It only ever shows *provenance
  on an already-published version*, stamped at publish time — so
  `create-ui@0.1.0` will read no-provenance permanently no matter what gets
  configured now, and there is no query against the registry that proves
  registration today. The only proof is the next `npm publish` actually
  succeeding via OIDC (or failing loudly, if something is still
  misconfigured) — which only happens at the next real, owner-triggered
  release. `npm view @busy-office/create-ui` is not a valid check for this;
  don't try it as a substitute for a screenshot or the owner's own
  confirmation.

  **RESOLVED 2026-08-29 — the browser block above was per-origin, not
  absolute.** The owner added `npmjs.com` to the Claude-in-Chrome extension's
  site permissions; `www.npmjs.com` (the redirect target) stayed blocked but
  the bare `npmjs.com` origin worked, so navigation succeeded from there.
  **Confirmed directly, not inferred**: the Trusted Publisher panel shows a
  saved entry (`Busy-Office/busy-office-ui`, `publish.yml`, permissions `npm
  publish` + `npm stage publish`); opening its Edit form (via a real
  extension-driven click, not a synthetic DOM event — see 200.1/200.2's own
  caught bugs about the difference) shows Organization `Busy-Office`,
  Repository `busy-office-ui`, Workflow filename `publish.yml`, and
  **Environment name genuinely empty** — the earlier mis-fill was corrected
  before saving, exactly as flagged.

  **What this does and does not prove, stated precisely rather than
  overclaimed.** This confirms the *configuration* is now correct. It does
  **not** prove OIDC actually authenticates — as recorded above, that has
  exactly one proof and it is the next real release publishing
  `create-ui` successfully. Configuration-correct and publish-correct are
  different claims; only the first is closed here.

  **CLOSED 2026-08-29 — the second proof landed.** `v0.6.0` was cut (owner
  confirmed, release created via `gh release create v0.6.0`), `publish.yml`
  ran green end to end, and `Publish create-ui to npm (OIDC, with
  provenance)` — the step that only passes if the Trusted Publisher
  actually authenticates — succeeded. Confirmed against the registry
  directly, not inferred from the green run:

  ```
  npm view @busy-office/create-ui version               # 0.1.1
  npm view @busy-office/create-ui dist.attestations      # predicateType: slsa.dev/provenance/v1
  ```

  `create-ui@0.1.1` carries SLSA provenance — the trust-surface hole named
  at the top of this item is closed for every version from here forward;
  `0.1.0` stays permanently unattested, as already established.

**What would change this order.** If Production finds three or more gaps, the
shape thesis is holding and Inventory/Finance stay as written. If Production
finds **zero**, the thesis is wrong in an interesting way — the remaining
modules would be re-argued rather than ground through, because the instrument
would have stopped paying for itself.

## Slice 399 — findings of the 398.5 re-score and the release check: stale statements a second pair of scorers found, a check that still reads a drifted heading as "nothing in flight", a floor that ships lower than the CSS needs, and five red pushes nobody saw (2026-09-26)

M0 ended with 398.5's FAIL, so these are ordinary backlog items, dispatched
oldest-first (rule 4). Nothing here is parked, and none of it is a third M0
retry. Report: `.roundtable/loop-doctor-rescore-398.5-2026-09-26.md`.

1. [ ] **399.1 — the stale statements the 398.5 scorers found, and the
       sweep for their siblings.**
       - **Accept — the property.** Each site agrees with the code or with
         the rule that superseded it, re-read after the edit and quoted:
         - LOOPS.md's routine-tick paragraph that still says "bind-mounted
           … no image rebuild", against the wake prompt (A: NI-1);
         - LOOPS.md's claim that `.roundtable/**` is in CI's `paths-ignore`,
           against `.github/workflows/ci.yml` (A: NI-2);
         - Explore's §-Trigger "dispatched when the backlog is empty", against
           rule 8 (A: NI-3);
         - `generate_status.py`'s "until 393.10 closes", shown in STATUS.md
           (B: B1);
         - `.roundtable/milestone-draft-2026-09-25/4-prompt.md`'s pointers to
           files that do not exist (B: B5);
         - `.roundtable/DISPATCHER:4`'s "so it stops at Step 0" (both
           scorers).

         The owner-only sentence at ROADMAP.md:148, which names 393.10 as
         the activation test, goes to RESUME's Direction with its
         replacement text. The loop does not edit it.
       - **Siblings.** For each old wording, run a fixed-string sweep over
         the live files and quote the counts. More sites than named is a
         satisfying outcome.
2. [ ] **399.2 — the in-flight check reads a drifted heading as "nothing in
       flight".**
       - **Why.** Scorer A found six forms where a valid, live line under a
         changed heading reads exit 0: `## In flight (393.2)`,
         `## In Flight`, `### In flight`, `## In-flight`, the line under
         another section, or a second `## In flight` section. RESUME.md is
         rewritten every wake. A non-UTF-8 byte exits 1 with a traceback.
         A future `started`, or an enormous `cap`, holds forever.
       - **Accept — the property.** Each form is a `--self-test` case, and
         none of them reads "nothing in flight":
         - each of the six heading forms either parses or exits 5;
         - an undecodable file exits 5;
         - a `started` in the future, or a `cap` beyond a stated maximum,
           exits 5.

         Red-proved by reverting and watching the cases fail.
3. [x] **399.3 — the published browser floor agrees with the one the CSS
       needs.**
       Track: defect
       - **Why.** `package.json`'s `browserslist` ships to npm. It has been
         hand-typed since the initial commit and was published in 0.8.0.
         `floor.json`, derived from the shipped CSS by `derive-floor.mjs`,
         is one version higher on Firefox and on Safari, and names
         `@starting-style` as the driver. DESIGN.md's prose beside the stat
         still gives the lower Firefox reason. Nothing compares the two.
       - **Accept — the property.** The published floor and the derived floor
         agree, or the difference is deliberate and stated where both
         appear: for example, `@starting-style` is an enhancement the floor
         should not count, and `derive-floor.mjs` says so. The CHANGELOG
         entry matches the actual compatibility, with the reasoning. A check
         compares the two, red-proved by lowering one.

         Relevant to O6: decide before 0.9.0 ships, or ship with the
         entry saying it is known.
       - **DONE 2026-09-26 (owner: "Prep 0.9.0 release").** `browserslist`
         now equals the derived floor: Firefox 129 and Safari 17.5, with
         Chrome and Edge unchanged at 119. `@starting-style` sets both
         (`floor.json` `drivenBy`), and its tier is `degrades`. Every use is an
         entry transition's starting values:
         - dialog and its backdrop;
         - offcanvas;
         - dropdown;
         - the data-table bulk bar.

         `dropdown.ts` also relies on it to hide the menu for the one frame
         before it is positioned.
         - **The shipped artefact did not change.** A rebuild with the old list
           was byte-identical to the build before it, 148 of 148 `dist` files,
           so the build is deterministic. The build with the new list was
           byte-identical too. **Red-proof of that diff:** lowering the list
           to Firefox 60 and Safari 11 changed 67 CSS files (`index.css` gained
           141 `-webkit-` prefixes). So the diff could see a change, and the
           raise genuinely moves none.
         - **The check.** `derive-floor.mjs` now fails the build when
           `browserslist` differs from the derived floor, naming the browser.
           It cannot generate the list, because the build reads it before the
           script runs. `build:floor` exits 0; with Firefox set back to 128 it
           prints `derive-floor FAILED — package.json browserslist … differs
           on: firefox` and exits 1.
         - **The rest.** DESIGN.md's "FF 128 is required by `content`
           alt-text syntax" now points at `floor.json`'s `drivenBy`.
           `check:readme-facts` and `check-floor` pass. The other hits for the
           old values are frozen 0.1.1 snapshots, history comments in the two
           floor scripts, an issue-template example, and a feature comment.
         - **CHANGELOG** (Unreleased → Changed): the claim changes, the CSS
           does not. The entry says what Firefox 128 and Safari 17.4 do,
           exactly as in 0.8.0: no entrance transition, and a one-frame
           unpositioned dropdown. It also covers tooling that reads our
           list.
4. [ ] **399.4 — the loop-written owner fields and the activation rule
       (both scorers' Safety finding).**
       - **Why.** Both scorers count, as an Invalid, that the loop wrote
         Precedence, Rules-2-3, Planner and Direction-drift into the owner's
         field block while O11, O12, O14 and O16 are blank. B adds that
         `milestone.py` would accept `Status: ACTIVE` from any writer.
       - **Accept — the property.** `milestone.py` does not count a field as
         owner-set when its decision cell is blank (this absorbs 398.3).
         Whether `Status: ACTIVE` can be told apart from a loop edit is
         measured and reported (the loop commits as the owner's git
         author). An honest "cannot, here is why" is a satisfying outcome.
5. [ ] **399.5 — a `.roundtable`-only commit broke CI for five pushes, and no
       local step saw it.**
       Track: defect
       - **Why.** `bbdc4269` through `b07ff571` were all red in CI and
         Pages. `check-floor.mjs`, the docs build's first gate, scans
         `.roundtable/**` and found five floor labels in the
         recommendations file. Each wake ran `test:axe` and `check:layout`
         before pushing, as the wake prompt says. It did not run
         `docs:build`, which is where the repo-wide source gates run. Nothing
         checked CI after the push either. Fixed in `57e67a42`.
       - **Accept — the property.** Before a wake pushes, the repo-wide
         source gates that scan every file run locally: `check-floor`,
         `check:repo`, and whatever else the docs build runs over the whole
         tree (list them from `apps/docs/package.json`, do not recall them).
         After it pushes, the wake reads the CI conclusion for its sha, or
         the next wake does at Step 0 and treats a red main as rule 1.
         Red-prove it by planting a floor label in a scratch `.roundtable`
         file.

## Slice 398 — findings of the 393.10 re-score (2.375, FAIL): stale statements M0 did not sweep, two dead references, and two checks that report less than they see (2026-09-26)

**Why these are parked, and why that is the owner's to lift.** Slice 393's
rule files loop-machinery findings raised during M0 with a `Parked: M1` line
instead of adding them to M0. But M0's exit test is the re-score these
findings failed, so the milestone cannot pass its own test while they stay
open. Two paths exist, and choosing is the owner's:
- extend O3's bootstrap to 398.1 and a second re-score (2 of the 12 M0 wakes
  remain); or
- set `Status: ACTIVE` without the test. Parked items are held while M1 is
  ACTIVE, so these would then wait for the milestone's close.

Until then, rule 4 reaches them oldest-first, which is far from now. Report:
`.roundtable/loop-doctor-rescore-2026-09-26.md`.

**The owner chose the first path on 2026-09-26** ("M0 retry": 398.1 → 398.2 →
one fresh re-score, with the bootstrap cap raised from 12 to 13 and rules 2 and 3
still paused). So 398.1 and 398.2 lose their `Parked:` line and join M0 as
Phase 0, and 398.5 is the re-score. It is one retry, not a standing
extension. 398.3 and 398.4 stay parked: 398.3 closes as satisfied when the
owner fills the O11, O12, O14 and O16 cells, and 398.4 is code the retry does
not need.

1. [x] **398.1 — the statements that disagree with the rule that replaced
       them (N2-N7 and the two Redundants).**
       Milestone: M1 · Phase: 0
       Route: build
       - **Accept — the property.** Every site the report names agrees with
         the code or with the rule that superseded it. Each re-read is quoted
         after the edit:
         - LOOPS.md's "collisions are ACCEPTED" heading and the hourly-cloud
           operating rule are marked as reversed by O1, pointing at Step 0c
           (N2 and the first Redundant).
         - The Continue input no longer offers RESUME.md's in-progress
           override, which 393.4 retired (N3).
         - CLAUDE.md's router order is a pointer to LOOPS.md Step 2, not a
           restatement (N4).
         - ROADMAP.md's two dead paths resolve: `test -e` on each (N5). So does
           a third the re-score's path-prefix scan missed, a bare filename:
           `grill-kev-in-the-loop-2026-09-21.md` (cited in 394.14's Accept)
           exists only on `park/owner-checkpoint-2026-09-20`, and bringing it
           to main is the owner's O2 call. Found by the owner-recommendations
           critic on 2026-09-26 (`.roundtable/owner-recs-2026-09-26.md`), so
           the sweep below re-scans bare filenames too.
         - LOOPS.md Step 0 and `step0_guard.py`'s docstring say the owner's
           archive of the cloud sessions is the prevention and exit 5 the
           backstop, not that every cloud session stops at the guard (N6).
         - The Objective loop's trigger names rule 3's counter (N7).
         - The milestone's Step 0 order matches the code's (second
           Redundant).
       - **The sweep, because three of these came from M0 changing a rule
         without its other statements.** For each old wording, a fixed-string
         `git grep` over the live files (not the archive or dated history)
         finds no statement that still presents it as current. Quote each
         command and its count. Finding more sites than the report named is a
         satisfying outcome.
       - **DONE 2026-09-26.** Each site re-read after the edit:
         - **N2 and the first Redundant.** The Step 0c heading now reads "One
           dispatcher (O1, 2026-09-25); the earlier "accept collisions"
           decision is kept below as the record". The operating rule reads, in
           the past tense, that the hourly routine "dispatched … with
           collisions accepted. **Reversed by the owner on 2026-09-25 (O1)**",
           and points at Step 0c.
         - **N3.** Continue's input is "the item Step 2 dispatched": rule 1's
           P0, rule M's pick, or rule 4's oldest item, including the M0
           bootstrap. It says RESUME.md's In flight section "is not an
           override (retired by 393.4)".
         - **N4.** CLAUDE.md reads "chosen per wake by the dispatcher's rules
           in `LOOPS.md` Step 2 (not restated here: restatements drift)".
         - **N5.** `test -e` exits 0 on
           `.roundtable/milestone-draft-2026-09-25/4-prompt.md` (§9 is its
           line 504), on `…/1-grill-report.md`, and on
           `grill-kev-in-the-loop-2026-09-21.md`, which the M0-retry triage
           (`0ab92652`) copied byte-identical from the parked branch.
         - **N6.** LOOPS.md Step 0 and `step0_guard.py`'s exit-4 docstring
           now say a revived stale session runs an older copy with no guard,
           so the owner's archive is the prevention and exit 5 the backstop.
           Self-test: 6 cases behave.
         - **N7.** The loop table and §6's Trigger name rule 3's counter.
         - **Second Redundant.** The Milestone section's Step 0 sentence
           matches `step0_guard.py` (HALT, checkout, foreign commits; lines
           62-89), then `inflight.py`. The owner approved the scribe edit on
           2026-09-26, since only the owner edits that section.
         - **Found beyond the report.** Re-reading every remaining hit, rather
           than trusting a zero, found four more sites:
           - The "20 min" cadence, the scorer's Correctness risk, in the loop
             table and §1's Trigger. It now names the owner's self-paced
             `/loop`.
           - Step 0c's body still gave a present-tense collision procedure
             under a banner calling all of it "the record". It now says which
             two parts still apply: the pre-commit fetch, now the guard's
             second run, which stops on exit 5; and the renumber mechanic, for
             two local sessions in one checkout, which the guard cannot tell
             apart.
           - `step0_guard.py`'s header scoped the reversal "while Milestone M1
             runs", but the guard enforces it on every wake now. The header
             states that fact, and no longer states O1's intent.
           - The Milestone section's Step 0c bullet said the reversal
             "becomes" the topology while ACTIVE, but it has been live since
             M0. The owner approved this second scribe edit on 2026-09-26.
         - **Checked and left alone.** The frame's "dispatch #26" still holds
           by its own instrument: `--compare` puts 395.1 at entry 26 of 63,
           counting owner-held positions. The owner-recommendations critic's
           "#17" counted differently.
       - **The sweep.** 14 fixed-string `git grep -i -F` patterns over tracked
         files, excluding archives, the loop log, resume-history and dated
         reports:
         - Before the edit there were 18 hits on 17 lines. 11 lines were live
           sites to fix; the other 6 hits were quotes or history.
         - Once edited, and outside 398.1's own text, there are 7 hits. Every
           one is a quote or dated history:
           - an old measurement table;
           - the new Step 0c heading, which names the old decision as the
             record;
           - the record under the REVERSED banner;
           - the past-tense operating rule;
           - the Milestone section's Step 0c bullet, now "is reversed";
           - the struck-through override;
           - `step0_guard.py`'s "is reversed".

         `whoever sends it the wake prompt` goes from 2 to 0, and
         `every cloud session stops here` read 0 before and after. The bold
         markup wraps that phrase across a line, so only the first phrase
         could see it. Script and outputs are in the 398.1 scratch directory.
       - **The dead-reference re-scan** covers bare filenames, the class the
         re-score missed. It checks 1,301 backticked file references in
         ROADMAP, LOOPS, CLAUDE, DESIGN, RESUME and ENVIRONMENT against the
         tracked tree and the worktree, including ignored build output such
         as `dist/api.json`. **31 do not resolve, and none is a live claim
         that a file exists:**
         - 18 are future deliverables named in open items or in the Milestone
           section (`jobs.json` 9 times, `queue_screen.json` twice, the ADR
           and others);
         - 1 is in the external busy-office-erp repo;
         - 1 is marked "not committed — one-off";
         - 9 are history in closed items;
         - 2 are ENVIRONMENT.md's record of `check-boost.mjs`'s deletion.

         **Red-proof:** on HEAD's ROADMAP.md the scanner lists both N5 paths.
         After the fix it lists 0 of them.
       - **Jev (J2, advisory).**
         - Sites agree, re-reads quoted: 0.86.
         - Dead references resolve: 0.96, once the new citation lines were in
           the evidence (0.66 without them).
         - The dead-reference scan can fail: 0.91.
         - The sweep: **0.71, unverified.** Whether a remaining hit "presents
           the old rule as current" is a reading of prose, and no instrument
           measures it. The counts are measured; the classification is
           judgement, with every hit quoted above so it can be checked.

           An earlier call read 0.23 on evidence that summarised the remaining
           hits. That prompted the in-context re-read that found three of the
           four extra sites. 398.5's fresh scorer is the independent check.
2. [x] **398.2 — the in-flight check refuses what it cannot parse.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 398.1
       - **Why.** The scorer fed `inflight.py status` five malformed
         In-flight lines (trailing space, a space in `paths`, fields
         reordered, `cap=60m`, a bullet prefix). All five read "nothing in
         flight", exit 0, so a wake would dispatch over a live workflow. A
         missing RESUME.md crashes with exit 1, which Step 0 does not define.
       - **Accept — the property.** A non-empty In-flight section that does
         not parse is never reported as "nothing in flight". It either parses
         or exits with a code LOOPS.md Step 0 names and treats as a stop, and
         so does a missing RESUME.md. Each of the scorer's five lines is a
         `--self-test` case, red-proved by reverting the fix and watching the
         case fail.
       - **DONE 2026-09-26.** Every non-blank line under `## In flight` must
         now parse, trailing whitespace aside. Anything else is **exit 5, a
         STOP**, which LOOPS.md Step 0 names beside 0, 3 and 4. The cases:
         a malformed line, two lines, a `started` that is not a UTC time, or
         an unreadable RESUME.md. `hold` writes no row on it, and `open` and
         `close` refuse with 5 too.

         The repo root now comes from the script's own path, not the cwd. Run
         from `/tmp`, the old script crashed with `FileNotFoundError`, exit 1,
         and the new one reads the repo.
         - **Self-test: 25 cases behave** (it was 11). Those include:
           - the scorer's five lines: a trailing space parses to exit 3, and
             a space in `paths`, reordered fields, `cap=60m` and a bullet
             prefix each exit 5;
           - two lines;
           - a `started` with no timezone, and one that is not a time;
           - hold, open and close over an unparsed line;
           - close removing a line with trailing whitespace;
           - a missing RESUME.md;
           - the root check.
         - **Red-proof.** The old `current()` and `read()` were loaded from
           HEAD, and the injection was asserted to be the old parser: it uses
           `LINE_RE.search` and has no `fullmatch`. 13 of the 14 new command
           cases then fail; the 14th, status after the trailing-space close,
           reads 0 either way:
           - all five of the scorer's lines read "nothing in flight", exit 0,
             which reproduces the finding;
           - two lines read as a hold on the first line;
           - the bad `started` cases and the missing file crash;
           - `close` removed an unparsed line, and could not remove a line
             with trailing whitespace.
         - **End to end.** The CLI, run from `/tmp` on a scratch tree whose
           line carries a bullet, prints `STOP — the line under ## In flight
           does not parse …`, exits 5, and writes no hold row. On this repo it
           reads "nothing in flight", exit 0.
         - **Jev (J2, advisory)**: stop-not-nothing 0.95, five lines
           red-proved 0.90.
3. [ ] **398.3 — `milestone.py` counts a field as filled only when the owner
       filled it.**
       Parked: M1 — loop machinery (the milestone field report) — revisit: the owner's answer to 393.10's FAIL, or milestone close
       - **Why.** It prints "unfilled: App, Modules, Devices, Tiers, Budget".
         But Precedence, Rules-2-3, Planner and Direction-drift were written
         by the loop while their owner decisions (O11, O12, O14, O16) are
         blank in the decision table. RESUME.md flagged only O12. A mirror
         that under-reports is the failure CLAUDE.md's storage doctrine names.
       - **Accept — the property.** The unfilled list is reconciled against
         the owner decision table in ROADMAP.md, not against the field block
         alone. A field whose decision cell is blank is reported as unfilled,
         or as "loop-proposed, awaiting O<n>". A self-test case blanks one
         decision cell and fails without the fix. Finding that the owner has
         since filled those cells is a satisfying outcome: the list is then
         right as it stands.
4. [ ] **398.4 — a `Modules` value that is not ` · `-separated is refused, not
       read as one module.**
       Parked: M1 — loop machinery (the milestone field check) — revisit: the owner's answer to 393.10's FAIL, or milestone close
       - **Why.** `_check_value('Modules', 'o2c=sales:Sales, fin=finance:Finance')`
         returns no problem, and the value parses as one entry, because only
         ` · ` splits entries. The field's own comment in the Milestone block
         reads `<dir-id>=<facet word>:<Label>, …`, so the comma form is the one
         the owner is invited to write. The module count is then wrong, and
         nothing says so until 394.9's reconcile against `_shell.mjs`.
         Found by the owner-recommendations critic on 2026-09-26, and
         re-run by hand the same day.
       - **Accept — the property.** A `Modules` entry containing `, ` or a
         second `=` is refused, naming the entry. A self-test case feeds the
         comma form and fails without the fix. The Milestone block's comment
         is the owner's to change; the report says whether it still invites
         the comma form.
5. [x] **398.5 — the second re-score: M0's exit test, run once more.**
       Milestone: M1 · Phase: 0
       Route: build
       After: 398.1, 398.2
       - **Accept — the property.** The same test as 393.10, run on HEAD after
         398.1 and 398.2 have closed.
         - **Who scores.** A fresh-context subagent that built none of
           393.1-398.2 re-runs `busy-office:loop-doctor` 0.9.4. It is not
           shown either earlier score.
         - **What is re-checked.** Every Invalid the 2026-09-26 report named
           (N1-N7) is re-checked by its own command, and the output is quoted.
         - **Closes on HEAD.** Before the re-score, the named commands of
           398.1 and 398.2 are re-run on a clean HEAD worktree.
         - **The owner's archive of the cloud sessions** (O1) is re-listed
           read-only with RemoteTrigger. The count still active is quoted, and
           the re-score is not held for it.
         - **Pass.** A mean of 3.0 or more with no dimension at 1 sends a
           PushNotification asking the owner to set `Status: ACTIVE`.
         - **Fail.** The report names the failing dimensions and M1 stays
           DRAFT. The loop does not extend M0 again: this was the owner's one
           retry, and what follows is the owner's call.

         Either verdict satisfies this item.
       - **Pre-registered on 2026-09-26, before the run.** Two fresh scorers,
         A and B, run independently from the same prompt.
         - **A's verdict is the verdict.**
         - **B is a variance check only.** It is reported beside A and never
           replaces it. The retry plan put the odds of passing at 40-60%, and
           a single score cannot say how stable it is.
         - Neither scorer is given an earlier score. Both are told not to open
           the 2026-09-26 report, the recommendations file, or the DONE notes
           of 393.10 and Slice 398 before writing their own scores.
         - A third agent lists the cloud routine's sessions, read-only.
       - **DONE 2026-09-26 — FAIL again: mean 2.375. M1 stays DRAFT, and the
         loop does not extend M0.** Report:
         `.roundtable/loop-doctor-rescore-398.5-2026-09-26.md`.
         - **Closes on HEAD.** 15 of 15 named commands of 398.1 and 398.2 exit
           0 on a clean worktree of `252c2ec9`.
         - **Scorer A (the verdict).** Correctness 2, Safety 2, Reliability 2,
           Cost 3, Maintainability 1, Understandability 3, Observability 3,
           Purpose 3.
         - **Scorer B (variance).** Correctness 1, Safety 2, Reliability 3,
           Cost 3, Maintainability 1, Understandability 3, Observability 3,
           Purpose 3.
         - Both disclose that the earlier mean reached them before they
           scored, so their agreement on 2.375 is weak evidence.
         - **N1-N7 are closed in both**, except for one leftover at
           `.roundtable/DISPATCHER:4`.
         - **The failing dimensions rest on new Invalids.** Each scorer found
           its own 5-7 stale or contradicting statements. Most are text, but
           A's NI-5 was an unmarked blocked item. The two sets overlap in only
           three places: DISPATCHER:4, the activation rule at ROADMAP.md:148
           (the owner's section), and the owner fields the loop wrote itself
           (398.3). They are filed as Slice 399.
         - **What that means, measured over three runs.** The 2026-09-26
           score named seven Invalids and this retry closed them, yet two
           fresh scorers each found about as many again. Patching named sites
           does not converge: the stale-statement tail of a 2,318-line
           LOOPS.md and a 992-line ENVIRONMENT.md is longer than one pass
           finds. That is an owner call (RESUME Direction), not a third
           retry.
         - **Cloud sessions.** 302 of 307 still active (31 pages read,
           `last_event_at`). None has an event after 2026-09-25T05:20:50Z.
           The routine is disabled.
         - **Also found while this ran:** CI and Pages had been red since
           `bbdc4269`, fixed in `57e67a42`. See 399.5.
         - **Jev (J2, advisory):** fresh scorer without an earlier score 0.86
           (the scorers' own disclosure is why it is not higher), closes on
           HEAD 0.96, sessions listed 0.96, verdict rule applied 0.97.

## Slice 397 — M1 Phase 3: components go through the experimental tier, and the milestone closes (owner realignment, 2026-09-25)

**What this slice holds.** At the start it holds two items: the first real run
of the component lifecycle, and the exit. Everything else in it is filed while
the milestone runs. Each missing piece a module finds becomes an item, and so do
the three steps that follow an experimental part: **N.1** build and fill
(`Route: build`), **N.2** a second composition on a different pattern
(`Route: design`), and **N.3** "experimental `<name>`: admit or remove"
(`Route: build`). The committer numbers these items after a fetch, and each one
carries `After:` lines, so code releases them in order. The rules are in
`.roundtable/milestone-draft-2026-09-25/4-prompt.md` §9.

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
           seat-A scanner (`name_scan.py`; P5 was said to commit it and had not, so
           393.3 did) measured 0 of 1,039 on 2026-09-25.
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
`.roundtable/milestone-draft-2026-09-25/1-grill-report.md`.

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

1. [x] **393.1 — one committer: a wake halts on a HALT file or on a foreign
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
       - **DONE 2026-09-25 (owner asked to stop the collisions now).**
         `scripts/loops/step0_guard.py` runs first at Step 0 and again before
         the first commit: exit 3 on `.roundtable/HALT` (prints its first
         line), exit 4 on a checkout that is not `.roundtable/DISPATCHER`'s root
         — every cloud session, since its checkout is never the owner's — exit
         5 on an upstream commit by an author outside the topology (the cloud
         wakes commit as `Claude <noreply@anthropic.com>`, the owner's machine
         as `ThePFMind`; author, not timestamps, so the local/cloud clock offset
         at LOOPS.md:282-283 does not matter), exit 2 when it cannot read its
         inputs. `--self-test` drives all six cases on scratch repositories and
         FAILED, naming the case, when the checkout check was disabled in a
         copy. Step 0c now records O1 reversing 162.1, citing collisions 6-8.
         Stray sessions: the local wake's Step 0 lists the routine's runs; the
         two sessions active today were reported to the owner to archive
         (the API cannot archive them). Limit: a cloud session that ignores
         LOOPS.md is not stopped by this — archiving is the owner's half.
2. [x] **393.2 — the in-flight protocol: one workflow at a time, a hold that reads
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
       - **PARTIAL 2026-09-25 — built; the real-hold measurement is still
         owed.** `scripts/loops/inflight.py open|status|hold|close`: `--self-test`
         11 cases (status 0/3/4, refused second open, hold row, close, reopen),
         and FAILED naming the cap case when the cap comparison was disabled in
         a copy. The cap, live on a scratch RESUME with a background task and
         `cap=2`: status 3 until the real 2-minute mark, then 4; TaskStop; the
         partial output kept (27 of 60 lines, unchanged 11s later); close ->
         status 0. `dispatch_status.py` prints the hold count. LOOPS.md Step 0
         runs `inflight.py hold` second, after the guard. The zoom workflow
         (375.11) was opened as the first real line (cap 90 — O17's budget is
         still open). **Owed:** the tool-call count of one real hold wake.
       - **DONE 2026-09-25: one real hold measured at 2 tool calls.** The
         timer wake at 21:42 (local) found 393.3's verification workflow
         (`wf_8f75ecde-897`) in flight at 5 of its 45 minutes. It made one
         Bash call (`step0_guard.py`, then `inflight.py hold`, exit 3) and one
         `ScheduleWakeup`, and dispatched nothing. `hold-wakes.jsonl` gained
         its first row (13:42:07Z), and `dispatch_status.py` counts it. The
         workflow then finished and woke the loop through its task
         notification, not a timer. The limit is: one hold, in one session,
         so this measures the protocol, not a rate.
3. [x] **393.3 — the backlog mirror reports every kind of wait, and prints the
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
           output are quoted. The audit (`blocked_audit.py`; committed by 393.3,
           since P5 had not)
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
       - **DONE 2026-09-25.** `generate_status.py` parses the owner markers
         with whitespace collapsed and code removed. It also reads the five
         own-line markers and the `TAG · ` title prefix (`OWNER ·`, `P0 ·`).
         Checks:
         - The markers reconcile against a loose raw line count (130 = 130).
         - The mirror's `After:` targets reconcile against a second, line-walk
           count of the source (114 = 114).
         - An unresolved target or a cycle refuses the write.

         STATUS.md prints `oldest dispatchable: 375.11` and lists
         owner-blocked (23), dependency-blocked (35, two of them also
         owner-blocked), parked (0), browser-blocked (0, marker
         `NEEDS-BROWSER`) and markers quoted only in code (393.3's own
         Accept).
         - **The replay, quoted.** The audit is
           `.roundtable/milestone-m1-2026-09-25/blocked_audit.py --roadmap
           <b69129d0's ROADMAP.md>`.
           - With the old parser first on `PYTHONPATH` (the header gives the
             commands): `disagreements: 6`. They are 377.5 and 377.6 (both
             `None`: the `OWNER ·` prefix left them un-numbered), 373.8,
             369.1, 249.12, and 393.3 `(only inside code)`.
           - With the new parser on the same file: `disagreements: 1`, which
             is 393.3, correctly not flagged.

           The run that first used the audit's shim loaded the NEW parser and
           printed 1 for "before". It was caught because 1 contradicted the
           recorded 6, and fixed (`sys.path.append`).
         - **The premise was wrong in one name.** The Accept lists 374.4 among
           the audit's six. The audit cannot flag an item with no marker: its
           sixth was 393.3, a mention inside code. 374.4 was found by reading
           it, and it now carries an `OWNER CALL`.
         - **Fixtures, confirmed in a scratch mirror.**
           `generate_status.py --self-test` has 38 cases, including the four
           the Accept names. The After-deletion case goes through the real
           path: the parse loses a target, and `sync_mirror` refuses it
           against the source.
           - Red-proved by 22 injections into copies, each asserted to match
             once. Every one failed naming its case, or refused before any
             case ran (the mirror writing no `after`).
           - 15 of the injections came from the verification below. On the
             first fixture, the pick could ignore owner and Parked holds with
             every case green.
         - **Adversarial verification** (workflow `wf_8f75ecde-897`: 4 lenses
           and a critic, all "holds with defects"). Fixed:
           - the printed pick was **249.7**, an item waiting on the owner's
             249.10 that carried no marker (now `After: 249.10`, so the pick is
             375.11, and no free item is older);
           - 389.6 and 389.7 need check-journey, which exists only on the
             parked checkpoint branch (now `BLOCKED ON` P2);
           - naive backtick pairing hid a prose marker after an indented fence
             or a double-backtick span;
           - near-miss spellings (`after:`, `- After:`, `**After:**`, column
             0, fenced) were dropped silently;
           - a marker under `### ` or after `---` held the item above it;
           - `P0 ·` ids did not parse;
           - `UNBLOCKED` counted as a marker, and a multi-word
             `OWNER OR X Y CALL` did not;
           - a second `Parked:` line was ignored;
           - `After:` cycles were not detected;
           - an undotted id crashed the pick;
           - `record_iteration.py` swallowed the generator's reason for
             refusing.
         - **Left, with reasons.** 394.13's single O15-dependent Accept bullet
           is not marked, because a marker holds the whole item and the rest
           can proceed. The Slice-389 items that 396.12 absorbs get their
           `After:` from 393.9's realignment, not here. 375.11's remaining
           Firefox half needs an engine that did not launch last time. No
           marker kind says so, and a wake may retry it.
         - **Jev, rubric 2** (advisory, not a gate). Bullets 1-4 scored
           0.82 / 0.80 / 0.93 / 0.83, and the pick scored 0.92. That leaves
           three in the unverified band. The likely reasons, stated rather
           than argued away:
           - bullet 1 excludes one audit hit (393.3), by design;
           - bullet 4's "deleting one `After:` line" is tested by deleting
             it from the PARSE, because deleting it from the source rightly
             just releases the item.
         - Four artefacts the draft said P5 committed had not been committed
           (`blocked_audit.py`, `name_scan.py`, `queue_screen.gate.json`,
           `pilot_results.json`). They were copied from scratch and
           committed, and the two roadmap lines claiming otherwise were
           corrected.
4. [x] **393.4 — `milestone.py` and rule M: code computes the milestone's next
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
       - **DONE 2026-09-25.** `scripts/loops/milestone.py` (`@heuristic`,
         `--self-test`) parses the milestone fields, ignoring `#` comments, and
         computes the verdict. `dispatch_status.py` prints the eight lines
         while a milestone is ACTIVE.
         - **No change when inactive.** Against HEAD's `dispatch_status.py`,
           run in a git worktree of HEAD at the same moment, the output is
           byte-identical: 2,398 bytes, sha1 `49b3bb930178`. One verifier
           measured the same hash independently. The first comparison, run
           from a non-git scratch root, differed by one line, the clock-skew
           note that needs `git blame`. That is an artefact of the
           environment, not of the change.
         - **The path can print.** In scratch roots with M1 set ACTIVE:
           - with the OWNER fields left in, it exits 1 with `milestone
             REFUSED — M1 is ACTIVE with unfilled field(s): …` at the top of
             stdout, and STATUS.md embeds the refusal;
           - filled in, and with a scratch `routes.json`, it prints all eight
             lines, and rule M picks 393.4.
         - **Against the reference simulator.** `milestone.py --compare`, rule
           M run to exhaustion over the live M1 slices, reads **IDENTICAL, 43
           / 43** entries with `simulate_rule_m.py`, from `(394.1) (394.2)
           (394.3) (394.18) 393.4 … 396.11 397.2`. The self-test also runs
           both simulators on a synthetic set of slices and checks both
           against a hand-derived order.
         - **Fixtures and red-proof.** The fixtures cover every refusal the
           Accept names, the structural ones, and the five fixtures the Accept
           lists. 46 injections, each asserted to match once, all fail the
           self-test. Against the FIRST self-test, the verifiers' own 23
           injections survived (lens 3's count, which overlaps lens 1's four),
           so the fixtures were rebuilt. Two of the 46 then still survived,
           and those fixtures were tightened.
         - **Adversarial verification** (`wf_98ab6e84-eb8`: 3 lenses and a
           critic, all "holds with defects", about 30 findings). What was fixed:
           - D1 fired whenever no M1 item was free, even with rule 4 holding
             work. It now fires only when nothing is dispatchable, §7's whole
             backlog.
           - "Blocked by the owner" did not walk `After:` chains, so a chain
             ending at a free non-M1 item deadlocked. The chains are now
             walked: an owner end falls through, a free end is dispatched, and
             a parked end is a stall.
           - `Precedence: after` switched rule M off. It now prints a fallback,
             an id that resolves nowhere refuses, and rule 4 passes over M1
             items while a milestone is ACTIVE (§4 rule 6).
           - The budget counted rows, with no ACTIVE-date window, and ignored
             `Stop`.
           - Row tags were searched in free text.
           - A refusal was invisible in STATUS.md, and LOOPS.md halted on it
             only after rules 1-3. It is now in Step 0b.
           - A malformed or duplicated heading, or orphan tags, turned rule M
             off silently.
           - `interleave 1/1` and `1/01`, impossible dates, and `TBD` were
             accepted.
           - The MODULES parse had no raw count.
           - The generated STATUS caption still named the retired GOAL
             override.
         - **Jev, rubric 2** (advisory): bullets 1-6 scored 0.89, 0.93, 0.93,
           0.93, 0.77 and 0.95. The fixtures bullet sits in the unverified band.
           Its likely reason is the refinement stated above: the Accept's "no
           dispatchable M1 item prints DIRECTION GAP" became §7's whole-backlog
           D1. Where the milestone has no free item and rule 4 does, it now
           prints `stalled … rule 4 runs`, which the verification showed is
           what §7 means.
         - **One decision, stated.** A DRAFT's malformed field is reported by
           `milestone.py`'s CLI (exit 1). It is not a `dispatch_status`
           refusal, because the owner fills a DRAFT over several edits and
           nothing dispatches from it. Structural problems refuse whatever
           the status, because they could hide an ACTIVE milestone.
         - **Left, with reasons.**
           - D3, D4 and the once-per-24h limit are 393.7's.
           - `routes.json` is 393.6's, so today an ACTIVE M1 refuses on its
             absence. That is correct: the milestone cannot activate before
             393.10 anyway.
           - The Done-test behind D2 is approximated by "the exit item has not
             closed".
           - Nothing outside `dispatch_status` runs `--self-test`, but the
             fixtures run on every ACTIVE read, following the precedent in
             `rebuild_from_log.py`.
5. [x] **393.5 — milestone rows move the counters the way the rules say (folds
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
       - **DONE 2026-09-25.**
         - **Loop names.** `record_iteration.py`'s `LOOPS` holds ten names:
           the nine the log uses (re-counted over 1,804 rows: Continue 676,
           Meta 579, Roadmap 172, Standardize 169, Objective 112, Explore 57,
           Polish 35, Optimize 3, Gauntlet 1) plus Research, which LOOPS.md's
           table names. `--loop Layout` is refused with exit 1 and appends
           nothing (1,815 log lines before and after, in a scratch root).
           `check:loop-vocab` compares a `# loop:` line in CLAUDE.md and in
           LOOPS.md against the constant. It went red naming `MISSING:
           Research` / `NOT A REAL LOOP: Layout` when one was swapped, and its
           self-test grew loop cases, 12 cases after verification. CLAUDE.md now names all nine loops
           and says `Meta` labels refusal rows.
         - **Tags in the row.** `--milestone M1` and `--track defect` write a
           segment made only of tags just before the outcome: `… · <item> ·
           milestone=M1 track=defect · landed · <sha>`. They also go into
           two new `loops.db` columns. `connect()` adds the columns to an
           older mirror, and nothing is backfilled.
           - `parse_log_line` reads the segment only in that position, so an
             item that mentions `milestone=M1` in prose is untagged.
             `rebuild_from_log.py`'s self-test has three new cases.
           - `milestone.row_tags` now uses the same reading.
           - The mirror was rebuilt: 1,804 rows, 0 tagged.
         - **Scoped counting**, red-proved on fixture rows written by the real
           recorder. The scratch root had M1 ACTIVE and `Rules-2-3: scoped`.
           `dispatch_status.py` read as follows after each row:
           - no tagged rows: Standardize 0/4 and Objective 0/3;
           - after an untagged Continue row: still 0/4 and 0/3;
           - after a `milestone=M1` row: 1/4 and 1/3 `[393]`;
           - after a `milestone=M1 track=defect` row: 2/4 and 2/3 `[375, 393]`;
           - the same log under `normal`: 11/4 and 4/3, both OVERDUE;
           - under `suspended`: both rules print as suspended.

           With no ACTIVE milestone the output is byte-identical to HEAD's
           (2,398 bytes, compared in a git worktree).
         - **392.4** closes by its first route, and also takes the second: see
           392.4.
         - **Jev, rubric 2** (advisory): loop names 0.94, tags 0.94, scoped
           counting 0.94, 392.4 0.92, 381.2 0.90. All five are in the
           supporting band.
         - **381.2**'s count is quoted before the owner confirms `Rules-2-3`,
           which reads `scoped` as a pre-filled default while O12 is open:
           **4 of 20**. See 381.2.
         - **Adversarial verification** (`wf_e0d8bf47-300`, 3 lenses and a
           critic, all "holds with defects"). What was fixed:
           - The recorder could write a row whose tags do not read back: an
             item ending in ` ·`, or with a tag-shaped last segment. It now
             builds each line, parses it back, and refuses on any difference
             before writing. Three such inputs were refused, and an ordinary
             item with a middle separator records.
           - `--milestone` naming no `## Milestone` section (M2), or `M01`, is
             refused.
           - The loop-name gate read only Title-case tokens on one line. It now
             compares every `|` token exactly, across continuation lines and
             every `# loop:` line. `layout` and `GauntLet` turn it red, and its
             self-test is at 12 cases.
           - The thesis check had four problems, all fixed:
             - it depended on the working directory;
             - it failed OPEN when a commit could not be read;
             - it took whichever report sorted first;
             - its skip test matched words anywhere, so §6's own "cannot see"
               clause switched it off and "not measured" refused a compliant
               report.

             It now runs `git -C ROOT` and fails closed. It reads the report
             the commit ADDED and refuses when that is ambiguous. It ties a
             skip to an error in the same sentence, ignores quotations, and
             accepts hyphenated labels and numbered headings. Its self-test
             has 17 thesis cases, the two-report commits were checked in a
             scratch git repo, and the replay reads the same from `/tmp` as
             from the repo root.
           - LOOPS.md sentences that still stated the old rule 3 are
             corrected, and LOOPS.md now says that amending a refused report
             restores the reset.
6. [x] **393.6 — routes: the roadmap names which model does each item (owner
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
       - **DONE 2026-09-26.**
         - **The route table.** `scripts/loops/routes.json` is hand-written
           from the prompt's §5 table, never generated, and reviewed in this
           diff. It has seven routes: build, design, mechanical, collect,
           research, planner and owner. Each gives loop and mode, tier,
           effort, skills, critic, what it returns, what it never does, and
           its hand-up.
           - Hand-up conditions are copied only where §5 gives one (build).
           - Design's note cites §8 stage 6: an unresolved critic verdict is
             a Slice 397 item, not a hand-up.
           - `collect` has no loop. §5 calls it read-only gathering, and it
             records no row of its own.
         - **Refusals.** `milestone.py` refuses:
           - an item whose route is not in the table, including a dispatched
             item outside M1;
           - a malformed table, as a Refuse and never a traceback: bad JSON, a
             duplicate key, a bad id shape, a missing or empty field, a mode
             that is not a list of words, a loop that is not recorded, a
             hand-up chain that never reaches the planner or the owner, or a
             tier outside top, balanced, fast or Planner.

           **The tier clause is superseded, and this note says so rather than
           reading around it.** This Accept says a tier the `Tiers` field does
           not permit is refused. §5 says such a route "runs on top, and the
           telemetry records the substitution", and owner decision O14 frames
           a `none` tier the same way. So a `none` tier runs on `top`. The rule
           M line prints `(tier balanced is none → top)`, and `--tier` records
           the tier actually run. The only tier refusal is the vocabulary
           check above. `Tiers` must name all three tiers, so no `Tiers` value
           can make a route unrunnable. Its fixtures run on a table fixed
           inside `milestone.py`, and three of them cover the planner route's
           indirection through the `Planner` field. The live `routes.json` is
           checked for shape only, so a legitimate edit to it cannot stop
           dispatch.
         - **Telemetry.** `record_iteration.py` gains `--route`, `--tier`,
           `--model`, `--agent`, `--skill` and `--first-try`. They are written
           into the row's tag segment
           (`… · route=design tier=top model=… first-try=reworked · landed · …`),
           which `dispatch_status.py`'s `ROW` still matches, and into eight
           `loops.db` columns.
           - It refuses a route not in the table, `--route owner` or
             `collect`, a `--loop`/`--mode` that is not the route's own, and a
             mode `ROW` cannot read (`plan/direction`).
           - It writes the log first and the mirror second.
           - **Before writing,** it refuses when a `- ` bullet does not parse.
             Red-proved: 1,809 bullets against 1,808 parsed, nothing written.
             When the mirror's count differs from the log's, it rebuilds the
             mirror first. **Red-proved by dropping one row:** 1,807 against
             1,808, rebuilt, then recorded to 1,809 = 1,809.
           - **After writing,** it reads the new rows back from `loops.db`
             column by column. Red-proved with an INSERT that drops `model`:
             it printed both tuples and "the row WAS recorded; do not re-run".
         - **Rebuildable from the log.** In a scratch root, the recorder wrote
           design, mechanical-on-top and planner rows plus a refusal row.
           `loops.db` was deleted and rebuilt, and **the recorder-written rows
           equal the rebuilt rows**: 1,811 rows by 14 columns, compared with
           `cmp`. A control rebuild that drops `route` differs.
           - The first run of this red-proof was circular, because the
             reconcile had already rebuilt the mirror before the "before"
             snapshot. It was redone.
           - Every row written before this change parses with the new fields
             empty: 0 of 1,807. None is backfilled.
         - **No change when inactive.** `dispatch_status.py` is byte-identical
           to HEAD's (2,398 bytes, compared in a git worktree).
         - **Jev stays out.** `grep -ril jev scripts/loops/` finds 0 files.
         - **Jev, rubric 2** (advisory): table 0.89, refusals 0.75, telemetry
           0.95, rebuild 0.94, Jev-out 0.96. The refusals bullet is in the
           unverified band, and the reason is the stated supersession above.
           **Owner, confirm or reverse:** should a `none` tier run on `top`
           (§5, O14), or refuse (this Accept)? It is a one-line change either
           way.
         - **Adversarial verification** (`wf_954581c2-c94`: 2 lenses and a
           critic, all "holds with defects"). It found:
           - the dead `Tiers` refusal and the unstated override;
           - no planner-tier fixture;
           - invented hand-up conditions and an invented `collect` loop;
           - a shallow table check, and a traceback on malformed JSON;
           - a KeyError on a dispatched non-M1 route;
           - a reconcile that counted parsed rows rather than raw bullets, ran
             after writing, and was blind to columns;
           - a recorder that accepted `--mode plan/direction`, which `ROW`
             cannot read and which would halt every later dispatch;
           - self-test fixtures tied to the live table;
           - a false `--no-log` docstring.

           All are fixed as described above.
7. [x] **393.7 — rule D: when there is no task, or an item is unclear, the loop
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
       - **DONE 2026-09-26.** Rule D lives in `milestone.py` and prints on the
         `direction` line. `DIRECTION GAP` is printed only when rule D acts on
         it this wake, and `held — …` otherwise. LOOPS.md Step 2 carries its
         rule D paragraph.
         - **Triggers, replayed before shipping.** The replay is
           `.roundtable/milestone-m1-2026-09-25/replay_triggers.py --rev
           024bccc2`. It reads every file through `git show`, runs from any
           directory, and takes about 2.5 minutes. It uses proxies, because no
           milestone was ever ACTIVE:
           - **D1: 5 of 45 dates, ROADMAP.md at each end of day.**
             - 2 are all-held. 09-02 is real: that ROADMAP.md says "every
               unchecked item … is undispatchable".
             - 3 are "free-named-only", where the only free items are
               unnumbered. 08-13 and 08-16 are false fires. 08-14 is right for
               the wrong reason.
             - 21 dates are unparseable, because prose `After:` lines predate
               the marker. A secondary pass reads all 21 as quiet.
             - Evaluated at every log row's own commit: 360 of 1,782 rows fire,
               and all-held fires fall on 11 of 34 dates, 9 once per 24 h. The
               pattern: a Continue row lands the last free item, and the next
               wake files new work.
           - **D2: 0 by construction.** No milestone section existed before
             `c8d2ccb7`.
           - **D3: 0 of 678 Continue rows.** Only 4 Continue rows ever ended
             triaged or logged, and they were 23-81 rows apart. **This clause
             may never fire.** An executor that meets an unclear item records
             it under a Roadmap row or a Meta refusal, not as its own outcome.
             If every loop but Meta counted, it would fire 99 times (8.1%).
             Revisit when the first 20 milestone executor rows are in: if D3
             has not fired while planner re-plans happened, count `refused`
             too. The lint half of D3 has no history to replay.
           - **D4: dominated by bookkeeping.** `packages/core/src` is 6.0% of
             all changed lines. The median 10-landing share is 4.9%, and a
             threshold of 10/20/30% would fire on 27/29/29 of 33 dates. D4
             stays off until the owner sets it (O16), and these figures are
             the data for choosing X.
           - **The plan-only stop.** With the loose predicate (any
             `Roadmap · plan` row), history has 30 adjacent plan-only pairs,
             mostly owner-input triage. So the stop counts only wakes whose
             every row is a planner run. On history that is 0 by construction,
             because no row carried `route=planner`.
         - **The item lint**, re-run rather than copied. The harvest, label
           and lint scripts are committed under `lint_history/`. At today's
           HEAD they label 47 items that were re-planned and 314 that were
           built as written:
           - "no Accept" catches **10/47 (21%)** and flags **26/314 (8%)**,
             the real signal;
           - "no instrument" catches 9/47 (19%) and flags 77/314 (25%), no
             better than chance on old-style items;
           - together: 19/47 and 103/314.

           The draft's "15 of 45 / 19 of 309" came from a differently defined
           lint and reproduces as 13/45, 18/309. Both clauses ship, because
           this Accept names them, but the pick lint only sees
           property-and-instrument items. It flags 2 of the 35 live non-owner
           M1 items:
           - 394.11 states a property with no check;
           - 396.12 delegates to other items' Accepts.

           Each will be sharpened once when picked. **Revisit the instrument
           clause** if 2 of its first 5 sharpen bounces come back "executable
           as written".
         - **The item lint at the pick** has two clauses: an Accept label (at
           the start of a line or sentence, never a word in a title or a
           quotation), and an instrument inside that Accept block. An
           inherited common Accept counts, unless the preamble excludes the
           item. **One bounce:** an item that still fails after its sharpen
           is held for the owner, `(lint, after its one sharpen)`, and rule M
           picks the next item. A failing pick is never dispatched. The
           `Route:` clause is enforced earlier, by 393.4's milestone-wide
           refusal.
         - **Planner output.** `milestone.py --check-commit <sha>` checks every
           item a commit adds or changes: Accept with an instrument, `Route:`
           in routes.json, resolvable `After:`, numbered, no duplicate open id,
           at most `direction-items` for a D1-D4 review. `record_iteration.py
           --route planner` runs it, even under `--no-log`. While a milestone
           is ACTIVE, any `Roadmap` row gets the check on the milestone items
           its commit touches. Red-proved in scratch git repos: an item with
           no Accept, one with an unknown route, and a triage row adding a
           milestone item with no Accept were all refused, with log lines
           unchanged.
         - **Frequency limits**, from the recorded rows (`--trigger` needs
           `--milestone` and `--route planner`):
           - each of D1-D4 fires at most once per 24 h, per trigger;
           - a D1 review that filed nothing, with no executor row since,
             makes the next D1 fall through to rules 5-8;
           - two consecutive all-planner wakes stop the loop when
             `2-wakes-plan-only` is in `Stop`.

           Fixtures red-prove each limit, and its negatives: one plan-only
           wake, plan-build-plan and triage rows do not stop the loop, a
           recent D3 does not hold D1, and a D1 review that filed items does
           not fall through.
         - **Order.** D3 and D4 take the wake ahead of rule M's pick, except
           when the owner is the blocker (§7), when rule M dispatches a free
           chain end, or when the dispatch is a defect interleave. Nothing
           runs under an open `Precedence: after`. Planner rows do not count
           toward the interleave.
         - **Tests.** 20 injections into the rule D code all fail the
           self-test, on top of the earlier 46. `--compare` against
           `simulate_rule_m.py` reads IDENTICAL, 40 / 40. The rule M
           simulation models a sharpen as fixed-then-dispatched, and reports
           `<394.11> <396.12>` apart. With M1 DRAFT, `dispatch_status.py` is
           byte-identical to HEAD's (2,799 bytes).
         - **Jev, rubric 2** (advisory): triggers 0.88, lint 0.88, planner
           output 0.86, limits 0.93. All four are in the supporting band.
         - **Adversarial verification** (`wf_ca045290-84c`: 2 lenses and a
           critic, all "holds with defects"). All of these were found and
           fixed:
           - **three blockers:**
             - my own regression that dropped `--outcome` validation;
             - a failing pick that got through under the 24 h limit, with no
               one-bounce cap;
             - suppressed gaps still printed as `DIRECTION GAP`;
           - D3 and D4 running against §7 while the owner blocked;
           - rule D ignoring `Precedence: after` and the interleave;
           - a planner contract limited to added items, and bypassable with
             `--no-log` or without `--route`;
           - an instrument regex that matched 73-98% of prose, and an Accept
             label that matched titles;
           - common-Accept exclusions that were ignored;
           - D4 going quiet on a sha that does not resolve;
           - a replay that failed outside the repo root;
           - frequency fixtures that could not tell one wake from two.

           While fixing them, a replacement of mine truncated `milestone.py`
           after `framework_share`. The self-test caught it by printing
           nothing. The tail was restored from HEAD and the 393.7 edits were
           re-applied.
8. [x] **393.8 — a bounded hand-off, one wake prompt, and the milestone's read
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
       - **DONE 2026-09-26 on its first three clauses. The fourth, read cost,
         moved to `393.13`,** because no milestone wake can exist before M1 is
         ACTIVE, and keeping it here would deadlock M0 (393.10 waits on this
         item). Jev scored that clause 0.08 against a claim of "met", which is
         right. Its measured evidence so far is below.
         - **RESUME.md** holds four sections: `In flight`, `Uncommitted`,
           `Next rule`, and `Direction — <date>`. It is 70 lines against the
           cap of 120. Its first 23 lines (the title, the ENVIRONMENT.md
           blockquote, the charter) were kept verbatim.
           - **Accounted line by line, both ways.** HEAD's 1,044 lines = 23
             kept + 1,021 moved. The moved block in
             `.roundtable/resume-history.md` is exactly those lines, in order.
             Every old line is in one of the two, and every moved line came
             from the old file.
           - **Still-current facts went to durable homes**, not only to
             history. The single-`:8081`-listener rule, with its reason, is in
             ENVIRONMENT.md §6e. The owner's O3 bootstrap wording is quoted
             verbatim in `Next rule`. The "empty RESUME.md" instructions (in
             LOOPS.md and the file itself) now say "clear In flight and
             Uncommitted", which the charter allows.
         - **`check-resume-charter`** now also asserts:
           - the four sections: level-2 headings only, a dated Direction, no
             second `#` title, no duplicate section, `###` allowed inside a
             section;
           - the line cap, read from the (ACTIVE or only) milestone's field
             block and never from a stray `Budget:` line, failing loudly when
             no cap can be read.

           **Red-proved on the real file**: exit 0 at 120 lines, exit 1 at
           121 ("121 of 120"), and the file was restored byte-for-byte (`cmp`).
           Its self-test has 23 cases, including the cap predicate at the
           cap, at cap + 1, and with no cap.
         - **Milestone progress** is generated into STATUS.md from the markers,
           in ROADMAP.md and in ROADMAP-archive.md, so a swept slice does not
           vanish. It reads M1 DRAFT: Phase 0 is 7 of 12 closed, Phases 1-3
           none of 18, 15 and 2. The self-test covers open, closed and
           archived items.
         - **One wake prompt.**
           - LOOPS.md's new section "The wake prompt — the one copy" holds the
             owner's current `/loop` text. `git grep` finds no other copy in
             the repo.
           - The trigger list names the `/loop` invocation, the self-paced
             wake, the assistant's memory note (rewritten to point here; its
             own copy had drifted to "bind-mounted") and the disabled cloud
             routine, which holds an older copy and is stopped by
             `step0_guard.py`.
           - The duplicated `gh`-intake paragraphs (LOOPS.md:353-371 at the
             triage commit) are merged into one: "only the pinned set of
             PR-review operations is served" went from 2 copies to 1, and so
             did "Discussions were not checked this wake".
         - **Read cost, measured.** Counted with `str.split()` over the
           tool-result text of real wakes in the session transcripts
           (critic's scripts, 393.8's verification):
           - a cold-start wake (2026-09-23) read **12,352 words** at Step 0;
           - the first M0 bootstrap wake on a milestone item (2026-09-25) read
             **3,791**.

           As whole-file models, the literal prompt's read set (LOOPS +
           ROADMAP + RESUME + ENVIRONMENT) is **131,377 words at HEAD and
           122,865 now**, and the prompt §4 milestone read set models at about
           13.3k. **Round 1's "about 110k" has no source**: `rg -F 110k` finds
           only this Accept and its draft. No real wake reads the 131k, and
           the Read tool truncates LOOPS.md anyway. The honest reading is that
           RESUME.md fell from 9,216 words to about 550, and that the wake
           prompt's "read LOOPS.md and ROADMAP.md fresh" is what a
           milestone-scoped wake should stop doing. That wording is the
           owner's, and is in RESUME.md's Direction. **`393.13` re-measures it
           on the first ACTIVE wake.**
         - **Jev, rubric 2** (advisory): RESUME 0.94, progress 0.83, one prompt
           0.87, read cost 0.08. The first three are in the supporting band or
           near it. The fourth does not support a close, so that clause moved.
         - **Adversarial verification** (`wf_84102e0c-2aa`, a skeptic and a
           critic, "holds with defects"). What was fixed:
           - the read-cost figures (mixed snapshots, models reported as
             measurements);
           - an off-by-one line count (1,044, not 1,045);
           - archived milestone items dropped from the progress count;
           - the listener rule stranded in history;
           - the "empty RESUME.md" instructions that now contradict the
             charter;
           - a section parser that missed extra H1s and duplicate sections and
             refused `###`;
           - a self-test that could not see a fail-open cap check;
           - the cap read from any `Budget:` line;
           - the owner's GOAL paraphrased;
           - "seven" unreleased P0s (it is eight, with 392.1);
           - the history file missing from the index's living set;
           - the cloud routine missing from the trigger list.
9. [x] **393.9 — apply the realignment markers to the 65 open items. They stay
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
       - **DONE 2026-09-26.**
         - **Re-counted first.** 63 items are open outside Slices 393-397: the
           table's 65 less 392.4 and 381.2, which 393.5 closed. The breakdown
           is 1 M0 (377.3), 22 folded, 16 defect, 9 parked, and 14
           owner-blocked plus AT runtime evidence. Nothing is outside the
           table, and nothing in the table is missing.
         - **Marker sets.** 48 item blocks were edited, each located by its id
           and appended after the item's own last indented line, at its title
           column:
           - 377.3: `Milestone: M1 · Phase: 0`, `Route: build`,
             `After: 393.11`;
           - the 22 folded items: the absorbing item's Phase and Route, plus
             `After:` it (394.11, 394.12, 394.9, 395.1, 396.12);
           - 16 × `Track: defect`;
           - 9 × `Parked: M1 — <reason> — revisit: <the table's trigger>`,
             each with a one-line reason from its title.

           The owner-blocked items keep the markers 393.3 normalised. The diff
           is +94 lines exactly (3 + 66 + 16 + 9) and nothing else. The first
           pass indented the markers at 3 spaces, not the title column; it was
           restored from HEAD and re-applied.
         - **Nothing closes.** 103 `[ ]` and 85 `[x]` lines, before and after.
         - **Checked by script.**
           `.roundtable/milestone-m1-2026-09-25/check_realignment.py` re-counts
           the open items against the table. It checks each item's parsed
           markers, and the regenerated STATUS.md's Parked,
           Dependency-blocked and Milestone-progress sections. It passes.
           Red-proved twice:
           - removing 386.1's `Track:` line printed `386.1: Track ''`;
           - dropping 377.9 from STATUS.md's Parked list printed the missing
             id.

           Both files were restored byte-for-byte.
         - **Order.** `simulate_rule_m.py` cannot read the whole ROADMAP.md: it
           requires a `Route:` on every item, and defect, parked and owner items
           have none. So both simulators ran over the M1 paste, which now takes
           the M1-tagged items from mixed slices, keeps slice preambles, and
           stubs outside `After:` targets as owner items.
           `milestone.py --compare` reads **IDENTICAL, 63 / 63**, once both
           simulators model a prose owner-block the same way. The reference
           only knew `Route: owner`, so it had dispatched 389.6 and 389.7.
           **No folded item comes before its absorbing item**: 377.3 is #4
           after 393.11 #3, 376.5 is #23 after 395.1 #22, and 389.1 is #31
           after 396.12 #30. 249.7, 389.6 and 389.7 wait on owner decisions.
         - **Reconcile.** With M1 forced ACTIVE, `milestone.py` reads After=59
           Parked=9 Milestone=71 Route=71 Track=16, parsed = raw, and every
           `After:` target resolves.
         - **What is not inert, stated plainly.** `Parked`, `Track`,
           `Milestone` and `Route` change nothing while M1 is DRAFT. **The
           folded items' `After:` lines do**, and that is the absorption: 20
           items leave rule 4's free set (52 → 32), namely the 389 RF fixes,
           376.5, 377.3, 377.10 and 392.5. They wait on the milestone items
           that redesign their pages, because building a fix on a page 396.12
           may delete is waste. The oldest dispatchable item is unchanged
           (375.11). If the owner wants them worked before M1 activates,
           removing those `After:` lines reverses it. 396.12's own Accept
           returns the 389 items to the backlog if rugged devices are out of
           scope.
         - **Jev (J2, the `mechanical` route's critic)**: markers 0.90, order
           0.81, nothing closes 0.94, reconcile 0.96, script 0.96. Order sits in
           the unverified band, for the reason stated: the reference simulator
           ran over the milestone paste, not the whole file.
         - **A consequence for M1, measured.** The item lint (393.7) would
           sharpen 7 folded items' own Accepts once when picked: 392.5,
           377.10, 376.5, 389.5, 389.8, 389.10 and 389.22. It would also
           sharpen 394.11 and 396.12.
10. [x] **393.10 — re-score the loop; the owner activates the milestone only at
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
       - **DONE 2026-09-26 — FAIL: mean 2.375, Correctness 1 and
         Maintainability 1. M1 stays DRAFT.** The full report is
         `.roundtable/loop-doctor-rescore-2026-09-26.md`.
         - **Closes on HEAD.** All 17 named commands of 393.1-393.9 pass on a
           clean worktree of `8575c98b`, including every self-test, the thesis
           replay, `milestone.py --compare` (IDENTICAL, 62 / 62),
           `blocked_audit.py` (0 disagreements), the realignment check and both
           charter gates. The output is
           `.roundtable/milestone-m1-2026-09-25/closes-on-head-393.10.txt`.
         - **Who scored.** A fresh-context subagent that built none of
           393.1-393.9, following loop-doctor 0.9.4, not shown the 2026-09-25
           per-dimension scores. It changed no repo file.
         - **Scores** (2026-09-25 → 2026-09-26): Correctness 1 → 1, Safety
           2 → 3, Reliability 2 → 3, Cost 2 → 3, Maintainability 3 → 1,
           Understandability 2 → 2, Observability 2 → 3, Purpose 3 → 3. Mean
           2.1 → 2.375. Dropping the most arguable Invalid (N6) gives 2.5, still
           a FAIL.
         - **The four Invalids, each by its own command.** A design-grill
           resetting rule 3: **closed** (`--thesis-replay` refuses 388.2's
           design-grill commit; the scorer's own synthetic rows agree). No
           in-flight rule: **closed** (`inflight.py status` exit 3 on this
           item's own line). Two live dispatchers: **no longer Invalid as
           stated** (`step0_guard.py` exit 0 here, HALT exit 3 in its
           self-test), but the playbook claims the guard stops every cloud
           session, and a revived stale session never runs it (N6). The
           self-contradicting hand-off: **narrower but still Invalid**. The
           history half is fixed; RESUME's "after 393.10" rule sent the next
           wake to rule 4 past two overdue counters (N1).
         - **Failing dimensions.** Correctness (N5: two dead references in
           ROADMAP.md; N6) and Maintainability (N2, N3, N4, N7: four stale
           statements, three of which M0 changed the rule for and did not sweep).
         - **What this commit fixes.** N1: RESUME.md's Next rule now reads
           Step 2 from rule 1. N2-N7, the two Redundants, the in-flight check's
           fail-open (Safety b) and the pre-filled fields counted as filled
           (Safety d) are filed as Slice 398, under Slice 393's rule that
           loop-machinery findings are parked, not added to M0.
         - **Wakes used.** 10 of 12, counted as distinct loop-log timestamps of
           393.x rows (9 before this one; 393.2 took two wakes and shared one
           with 393.3). The one hold row is counted separately. The earlier
           "9 of 12" counted items, and matched only by coincidence.
         - **Jev (J2, advisory)**: re-run on HEAD 0.96, fresh scorer 0.88, the
           four Invalids by their own commands 0.94, closes on HEAD 0.95, the
           verdict rule applied 0.96. The fresh-scorer claim is the weakest
           because its evidence is the launch prompt and the scorer's own
           receipt, not an independent check.
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
13. [ ] **393.13 — the Step 0 read cost, measured on the first ACTIVE milestone
       wake (393.8's fourth clause, moved here).**
       Milestone: M1 · Phase: 1
       Route: build
       - **Why it is its own item.** 393.8's Accept asks for the words read at
         Step 0 "on one real milestone wake". No milestone wake can exist until
         M1 is ACTIVE, M1 cannot activate before 393.10, and 393.10 waits on
         393.8. Leaving the clause in 393.8 would deadlock M0. Jev scored the
         clause as closed at 0.08 on 2026-09-26, correctly.
       - **Accept — the property.** On the first wake after the owner sets
         `Status: ACTIVE`, count the words that wake read at Step 0.
         - Count them from its own transcript, with `str.split()` over the
           tool-result text, and name the transcript and the command.
         - Report the figure against the two real readings 393.8 measured
           (12,352 at a cold start, 3,791 on a bootstrap wake) and against the
           whole-file model (122,865). Round 1's "about 110k" has no source.
         - Say whether the wake read LOOPS.md or ROADMAP.md whole, and whether
           the wake prompt's "Read `LOOPS.md` and `ROADMAP.md` fresh" made it
           do so. Finding that it did not is a satisfying outcome.

## Slice 392 — Objective grill of 388.1, 389.4/389.25 and Slice 390: 41 of 59 claims reproduce, 22 of 28 findings survive (plus 12 the skeptics found), and the headline is a P0 the fix it grilled could not see — a second scan verdict inside a live flash never shows (2026-09-25)

**Dispatched by rule 3** (renumbered from 391: a cloud wake landed its own Slice 391 first — collision, LOOPS.md Step 0c), `Objective 3 / 3 OVERDUE [388, 389, 390]`. Report:
`.roundtable/grill-objective-388-389-390-2026-09-25.md` (with the thesis
section: adoption indistinguishable from zero, first user's state,
fundamental-styles deltas, framework-code numstat). Corrections applied in
place to 377.5, 388.1, Slice 390, CHANGELOG, `/components/scan`,
`/components/button`, LOOPS.md.

1. [x] **392.1 — P0 · a second scan verdict inside a live flash never shows.**
       `body::after` keeps its animation when the stamp changes ok -> error or
       ok -> ok, so it never restarts: an error 150ms after an ok peaks at
       opacity 0.208, at 400ms 0.019, at 620ms 0 — the attribute says error
       and the screen shows nothing. Rescans every 650ms: scans 2 and 3 never
       flash. The goods-receipt data contract's 404 path (a server round trip)
       hits exactly this, and with 389.3 open no other visible cue exists.
       Predates 389.4 (126.2's structure); 389.4's claim pins currentTime=0
       and cannot see it.
       - **Accept — the property.** A stamp inside a live one restarts the
         flash: through the REAL behaviour (Enter + `flashScanResult`), ok then
         error at 150/400/620ms, a repeat ok and a repeat error at 300 and
         650ms, and the goods-receipt shape (error after a 250 and 400ms round
         trip) — the rendered band/gap 30ms after the second stamp is within
         0.05 of a fresh stamp's, both themes. A `check:claims` case, seen to
         fail today. OR a design reason to keep no-restart is recorded AND
         `/components/scan` stops claiming "'error' overrides a live ok".
       - **DONE 2026-09-25 — the flash restarts on every stamp.**
         `flashScanResult()` now drops a live stamp, flushes style
         (`body.offsetWidth`) and stamps again, so `body::after` gets a new
         animation; `/components/scan`'s "error overrides a live ok" is now
         true. `check:claims` case through REAL paths (Enter scans on the pick
         screen, and the page's own imported `flashScanResult`), light and
         dark, each second stamp frozen ~30ms in and compared with a fresh one.
         Accept delays -> cases: ok-then-error 150 / 400 / 620 (`lateError150`,
         `roundTrip400`, `lateError620`, plus the capture-path
         `rescanError400`); repeat ok 300 / 650 (`repeatOk300`,
         `rescanOk650`); repeat error 300 / 650 (`repeatError300`,
         `repeatError650`); round trip 250 / 400 (`roundTrip250`,
         `roundTrip400`). RED on the pre-fix build in every case (e.g.
         roundTrip400 t=433ms, 1.006 vs fresh 1.201; repeatError650 1.00);
         GREEN after, t=17-33ms and within 0.01 of fresh, on dist and live on
         :8081. vitest: a MutationObserver sees five mutations for ok, error,
         error (red-proved). CHANGELOG notes the removal is observable. Jev
         (Rubric 2): fixed 0.94; "every delay covered" 0.81 — the unverified
         band, recorded as such; the mapping above is the evidence for it.
2. [ ] **392.2 — a pressed toggle differs from an unpressed one by colour
       alone in normal colours.** Fill 1.043:1 light / 1.363:1 dark, text
       2.339:1 / 1.416:1; weight, outline, shadow identical. The richtext
       toolbar's Bold uses the same pair. Violates "every state signal is
       two-channel". (Forced colours was fixed by 388.1.)
       - **Accept — the property.** In both themes a
         `.bo-btn[aria-pressed="true"]` differs from an unpressed one by a
         non-colour cue, or by >= 3:1 in some channel, asserted by a
         `check:claims` case that fails on today's CSS; the RF profile's
         budget is re-argued if the fix lands there.
       Track: defect
3. [ ] **392.3 — a `--bar` label with one word wider than its slot paints past
       its button.** 'Kommissionierung' 15px, 'Wareneingangsbestätigung' 49px
       past at 390; heights stay 52, so the text overlays the next slot. The
       page and the CSS say a long label wraps and never clips.
       - **Accept — the property.** A `check:claims` case gives a bar member a
         single word wider than its slot at 1440 and 390 and asserts equal
         widths, a taller member, and no text rect past its button — red on
         today's CSS. `.bo-form-actions > .bo-btn` measured the same way.
       Track: defect
4. [x] **392.4 — rule 3 reset without the thesis section, twice; and a
       design-grill reset it.** Slice 386 read no adoption channel it could
       have read; 388.2 (a design-grill logged as Objective) has no thesis
       section and dropped the armed set `[372, 375]`.
       - **Accept — the property.** An Objective row resets rule 3 only if
         its report has §6's four thesis parts (each read, or naming the
         channel and the error that stopped the read) — replaying 384, 386
         and 388.2 through the check refuses all three; OR §6 is amended to
         exempt owner-asked design-grills, and the exemption says what they
         must log instead.
       - **DONE 2026-09-25 (by 393.5), by the first route, and the second
         too.** `dispatch_status.py` resets rule 3 only on an Objective row
         whose grill report has §6's thesis section in the shape the counter
         checks:
         - a `## Thesis section` heading;
         - four labelled parts;
         - none of them skipped without naming the error;
         - `git diff --numstat` in the framework-code part.

         A row that fails is printed with its reason, and the count runs on.
         **The replay** (`dispatch_status.py --thesis-replay`), over every
         Objective row since the requirement:
         - **384: REFUSED**, no `## Thesis section`;
         - **386: REFUSED**, adoption and comparators were skipped without an
           error;
         - **388.2: REFUSED**, no `## Thesis section`;
         - 382: REFUSED as well;
         - **392: RESETS**, so today's counter is unchanged.

         The self-test has 17 thesis cases after verification, including a
         skipped part WITH its error in the same sentence, which counts as a
         reading. The second route was also taken:
         §6 now says an owner-asked design-grill is logged
         `--loop Objective --mode design-grill`. Such a row never resets rule
         3, and its report is its `design-grill-*.md` file. This is what the
         prompt's §4 anticipated ("a design-grill does not reset it"). @heuristic,
         and it checks SHAPE: whether a reading is any good stays the grill's
         judgement.
5. [ ] **392.5 — the comparator deltas are recorded nowhere a later grill
       reads them.** This grill measured five against fundamental-styles
       (two Evidence for each side, two BO candidates refuted).
       - **Accept — the property.** One maintained place lists BO's deltas
         against fundamental-styles, each marked Evidence (2+ sources) or
         Hypothesis with its counter-evidence; any doc that argues BO's case
         on generated AI docs or on density names the FS counterpart or drops
         the argument.
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.11

## Slice 391 — a cloud wake that collided TWICE, and the one thing it can see that no local wake can: `check:claims` fails **3 of 311** in this container at a commit CI reports `success` on (2026-09-25)

**This slice files a finding and records two collisions. It closes no queue
item**, because both items it dispatched to were taken by the other dispatcher
first. The dispatch trace and the discards are in `LOOPS.md` Step 0c
(collisions 6 and 7) with forensics in `LOOPS-archive.md`; they are not
restated here.

**Dispatch, re-derived at each tip rather than carried.** Rule 1: no open P0
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**). Rule 4 matched at the
stale tip and ran `336.2` to a verdict; rule 2 matched at the next tip
(`Standardize 4 / 4 OVERDUE`) and ran the sweep to a verdict. **Both were
already landed** — Slice 366 sixteen days earlier and Slice 390 forty minutes
earlier — and both discards were checked before being made, per Step 0c.

**Step 1 read both intakes with `ENVIRONMENT.md` §8's controls:**
`/issues?state=open` → `200 len 1` (issue #2, `updated_at`
**2026-09-06T15:10:34Z**, unmoved); `/discussions` → `200 len 0`;
`/not-a-real-route` → `404`, the control that makes the `200 []` mean *served
and empty*. No new untriaged input, so Step 1 committed nothing.

**Rule 5 is STALE and is therefore NOT reported clear**, per its own text:
`Optimize 4 wake-date(s) newer — STALE`, its newest comparable pair (`claims`,
2026-09-19) predating four distinct log dates. Any regression verdict quoted
from it describes the tree of 2026-09-19.

### The finding: a gate that is green on CI and red here, on the same sha

Measured at `b0401326` after `rm -rf apps/docs/dist` and a full
`npm run build -w @busy-office/ui && npm run docs:build`, both rc=0:

```
npm run check:claims -w docs
  claims check FAILED — 3 of 311 documented behaviours do not hold
    FAIL  sticky table: the real list-report exemplar — every expected row control focused …
    FAIL  sticky table: density declared on the TABLE (container left default) …
    FAIL  sticky table: container-spacious exact-match case (144px reserved == 144px header) …
```

**It is deterministic, not a flake, and that was measured before anything was
concluded from it**: two consecutive runs in this container both report
`3 of 311`, the same three cases. The browser here is **Chromium
141.0.7390.37** (`$CHROME_PATH --version`, read rather than inferred from the
`chromium-1194` path) — the same major build Slice 384 found a reading to
depend on, which is why the Chrome-build candidate below is named first among
equals rather than last.

**CI ran the same gate on the same commit and reports `success`** — `ci.yml`
line 158 is `npm run check:claims -w docs && npm run check:formatting -w docs`,
so it is executed rather than skipped, and the run listing for
`b04013266eac9c718c1b2fed8d80d8d1bfcae65e` reads `CI completed success
2026-09-25T04:26:17Z`.

**CORRECTED after this slice's own push, and the correction makes the finding
sharper rather than weaker.** CI on `88ba16bb` — this wake's commit, a
**markdown-only** diff — came back `failure`, so the sentence above ("CI reports
success") is true of `b0401326` and **not** of every sha. What CI reported is
`claims check FAILED — 1 of 311`, and the one is a **different case entirely**:

```
FAIL SC 2.5.7 alternative: a single real mouse click on the dropzone's visible hint …
     {"opened":false,"chooserErr":"Waiting for `FileChooser` failed: 5000ms exceeded"}
```

Two things follow, and they point in opposite directions:

- **The container-vs-CI divergence is CONFIRMED, not weakened.** CI executed the
  gate at this sha and reported **no sticky-table failure at all** — the three
  this container fails deterministically are absent from CI's output while CI is
  busy failing something else. So it is not that CI never got that far.
- **A second, separate finding: CI's file-chooser case is flaky.** A 5,000 ms
  timeout waiting for a native `FileChooser` is a timing assertion, the diff that
  "caused" it is four markdown files, and `b0401326` passed the identical case
  minutes earlier. **The one re-run `LOOPS.md` allows came back green on the
  identical commit** (run `36095606397`, `rerun_failed_jobs`, `04:55:23Z`) —
  **and then the same case failed again on the NEXT sha, `07aef5bf`, with a
  byte-identical payload.** So the rate over the four CI runs this wake observed
  is **2 of 4**, which is not a rare flake, and the re-run's green was the
  misleading reading rather than the settling one. **Fixed in this wake** — see
  `391.2`; `main` is not left red on a "flake" verdict.

**This wake did not introduce either failure**, and that is a set
membership argument rather than a guess: the gate reads `apps/docs/dist` and
`scripts/check-claims.mjs`, and this wake's whole diff is `ROADMAP.md`,
`LOOPS.md`, `LOOPS-archive.md` and this hand-off — no CSS, no `.astro`, no
script. The dist it read was built from unmodified source at `b0401326`.

**The three `NOT VERIFIED` button rows in the same output are NOT part of this**
— they are `ENVIRONMENT.md` §6b's standing container fact (`(hover: hover) and
(pointer: fine)` reads false in headless Chrome) and are correct output.

**What the failures have in common, stated as a reading and not a diagnosis:**
all three are sticky-table cases, all three pass `badForward` and fail only
`badBackward`, and every failing entry has `isExpected: true` and `hasSize:
true` with a non-empty `hits` array at a specific `scrollTop`. So the header
geometry the setup block asserts is intact (`headerGeometryOk: true`,
`headerHeightSum` 30 and 144 as the case names say) and what differs is the
intersection during **backward** scroll.

1. [ ] **391.1 — settle why `check:claims` is red here and green on CI at the
       same commit, and record which environment is telling the truth.**
       Three candidate causes, none tested by this wake and none to be assumed:
       the container's 15px classic-scrollbar reservation
       (`ENVIRONMENT.md` §6c, which is exactly a scroll-geometry offset and is
       already known to feed wrap-sensitive measurements); a **Chrome build**
       difference between `/opt/pw-browsers/chromium-1194` here and whatever
       `resolve-chrome.mjs` finds on the runner (Slice 384 already established
       that a reading in this repo can depend on the Chrome build rather than
       the machine); or a real defect that CI's environment happens to mask.
       - **Accept** — the property, not a predicted outcome: one wake reports
         (a) the Chrome version each environment resolves, read from each rather
         than inferred, (b) whether the three cases execute on CI at all, from
         the job log rather than from the workflow file, and (c) which side's
         geometry is correct, with the number that decides it. **Finding that
         the container is wrong and the framework is fine is a satisfying
         outcome**, and so is finding a real sticky-header defect that CI cannot
         see. If it is environmental, `ENVIRONMENT.md` gains the entry — a gate
         that is red for the environment rather than for the tree must say so in
         its own output, which is this repo's standing rule and is not satisfied
         by a note in a hand-off.
       - **Determinism is already established** — two runs, same three cases —
         so the wake taking this starts at the cause, not at a re-run. The
         container's browser is **Chromium 141.0.7390.37**; the runner's is the
         first thing to read.
       - **Lane**: cloud-takeable for the measurement; the CI half needs only
         the run/job API, which a cloud wake has.
       Parked: M1 — a cloud-container gate question, and no cloud dispatcher runs under O1 — revisit: the dispatcher topology keeps a cloud gate runner

2. [x] **391.2 — DONE: `check:claims`'s SC 2.5.7 file-chooser wait goes
       5,000 ms → 15,000 ms, because the case fails on CI at a measured 2 of 4
       and the wait is the only thing that is short.**

       **The rate is measured, not asserted**, over every CI run of this gate
       this wake observed:

       | run | sha | this case |
       |---|---|---|
       | `36095…` | `b0401326` | pass |
       | `36095606397` | `88ba16bb` | **FAIL** |
       | `36095606397` re-run | `88ba16bb` | pass |
       | `36096487317` | `07aef5bf` | **FAIL** |

       Both failing shas carry a **markdown-only** diff, and both payloads are
       identical: `{"opened":false,"chooserErr":"Waiting for FileChooser failed:
       5000ms exceeded"}` with the geometry block healthy every time —
       `isLabel: true`, `inputHidden: true`, `inputNotDisplayNone: true`,
       `pointIsOnInput: false`, `pointInViewport: true`. So the click lands
       where the case intends and only the native chooser event is late.

       **The re-run's green is the reading that would have misled a wake**, and
       it is recorded for that reason: spending the one permitted re-run
       produced *"confirmed intermittent, main is green"*, which the very next
       push refuted. **A single passing re-run is not evidence of rarity** — the
       rate needs more than one point, exactly as rule 5's own "two consecutive
       runs" wording says about metrics.

       **What the fix is NOT.** The case is not skipped, disabled, quarantined
       or made conditional, and its assertion is unchanged: `opened === true` is
       still required, so a dropzone that never opens a picker still fails the
       build. Only the patience moves, and the reason is in the code beside the
       constant. The container has never failed this case, which is consistent
       with a shared runner simply being slower.

       **What is left open**: whether 15,000 ms is enough is a claim about a
       machine this wake cannot profile. If it recurs, the next step is to make
       the case assert something that is not a race rather than to raise the
       number again — a timeout ladder is how a real defect gets hidden.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots — a
cloud wake has no Podman. **None are owed**, read off `git diff --stat` rather
than assumed: the diff is `ROADMAP.md`, `LOOPS.md`, `LOOPS-archive.md`,
`.roundtable/RESUME.md` and **`apps/docs/scripts/check-claims.mjs`** — one
constant and its comment, for `391.2`. That last file is a **gate script, not
shipped code**: no CSS, no `.astro`, no docs page, no `packages/core` source, no
generated artefact, so nothing a screenshot could show has changed. **The
earlier "four markdown files" phrasing in this entry describes the two commits
that OBSERVED the CI failures** (`88ba16bb`, `07aef5bf`) and stays true of
them; it is not a claim about this slice's final diff.

## Slice 390 — Standardize sweep, 4 of 4 lanes on an isolated clean build: lanes 1 and 2 carry no new finding, lane 3 flags `/components/button/` (the new which-one guideline) and gets a verdict, lane 4's +52 is two sentences of new instruction (2026-09-25)

**Dispatched by rule 2**, `Standardize 4 / 4 OVERDUE`. Worktree of HEAD
(`c76a841e`) with its own `npm ci`; `@busy-office/ui` realpath-resolves inside
it; core and docs builds green (0 FAIL). Base: Slice 385 (`6ec0e8da`).

- **Lane 1 (of 4):** *"0 dead style attribute(s) on 0 page(s); 1392 live"*, and
  the standing 10 dead declarations on 8 pages. Equal to the base.
- **Lane 2 (of 4):** *"74 source file(s) · 246 rule(s) with 3+ declarations · 235
  distinct bodies · 7 body(ies) appearing more than once"* against the base's
  245 · 234 · 7. The +1 rule / +1 body is this window's new CSS (375.11,
  389.4, 388.1); no group formed, grew or dissolved, so no delta finding.
- **Lane 3 (of 4):** 119 pages, median 833, 119,993 words; the flagged union
  is **18** (base 17). The new page is **`/components/button/`** at 1,806
  words, 2.2x the corpus median — carrying no verdict yet. **Verdict: the
  length is the THING, not the prose.** The page is now the chooser for the
  action primitive (separate / group / toggle / segmented / bar, each with a
  Not-for), which the owner asked for (388.1), and every figure in it is
  asserted by a claim. One caption WAS prose: the icon paragraph narrated a
  past check ("checked live … right now"); cut to its one-sentence contract.
  §3's enumeration amended in this commit (twenty -> twenty-one).
- **Lane 4 (of 4):** dispatch region **7,775** (Slice 385: 7,749), 2 of 16
  sections moved: rule 3 +26 (already read at 385) and rule 5 +26 — 372.1's
  day-close sentence, new instruction a wake needs to read the comparable
  set correctly. No cut: removing it would remove instruction, not narrative.
  [**Corrected by Slice 392:** that holds for rule 5 only. Rule 3's +26 is
  Slice 384's provenance rewrite of a replay figure (28 of 63 / 42 of 72) —
  the rule-text generator open item 384.1 names — and is left to 384.1.]
- **Archive sweep: not due.** `roadmap_scope.py`: 1,193 / 7,532 = 15.8%.

## Slice 389 — findings of the RF journey grill (388.2): the app screen exists but is not wired, and the task screens neither take the first scan nor finish a task (2026-09-25)

Report: `.roundtable/design-grill-flow-rf-2026-09-25.md`. Six lenses on the live
container at 360x640 (the floor study's fixture) and 390x844, both themes; a
challenger re-measured all 25 and **25 survived**. **Owner hypothesis 1 ("might
need an app screen") — NO new pattern or surface:** rf-landing already is the
RF home; what is missing is the wiring (389.5, 389.6) and slot guidance
(389.14); per-screen app chrome was measured and refused at 360x640 (task
content at 27.3%, scan field at 54.8%, Confirm below the fold). **Hypothesis 2
("task screens can be better") — YES, on all four**, almost all by composition,
removal or rewording; one shipped framework defect (389.4).

1. [ ] **389.1 — Every RF task screen accepts a wedge scan on arrival without stealing the docs reader's focus.**
       A wedge scan (keys then Enter) sent right after tapping a menu
       tile is lost on pick, putaway and count: focus is on body, 0
       bo:scan events, the status is empty. This held in 4 of 4
       viewport × theme runs. It is captured on goods receipt, the only
       screen with autofocus. Control: after one tap, pick captures it.
       check:claims' only scan case clicks the field first, so this was
       never tested. Goods receipt's autofocus has a cost: on load it
       moves the docs page's focus into the iframe, and at 390 the h1
       is out of view. rf-pick's embed leaves focus on body.
       - **Accept — the property.**
         Each RF task document is loaded top-level by a real menu-
         tile click at 360x640. A wedge scan sent with no tap is then
         captured, measured live on the built mirrors. Each page's
         Markup sample shows the markup that makes this happen. A
         check:claims case drives the scan from the tile, and it is
         seen to fail when one screen's mechanism is removed. On each
         hosting docs page, the load-time activeElement and scroll
         position are measured. Either focus stays in the parent
         document, or the accepted cost is recorded. A screen that
         deliberately needs a different entry focus says why on its
         page. The profile's size does not change.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

2. [ ] **389.2 — RF task screens complete the task, or stop claiming to.**
       There are 0 forms in 6 of 6 RF documents. Primary actions: pick
       0, goods receipt 0, putaway 0, count 1.
       - Pick: Enter, Skip item and Report short change neither the URL
         nor the text and open 0 dialogs. With JS off, Enter does
         nothing.
       - Count: Submit does nothing.
       - Putaway: after a match the only way on is Back, and a later
         wrong scan shows 'Confirmed' and an error at the same time.
       - Goods receipt: Skip item and Report short cause 0 DOM
         mutations.
       The pages' States and No-JS rows claim 'the form still posts on
       Enter', 'Enter posts the scan' and 'Report short opens the
       reason path'. The journey's receiving screen completes with 1
       form and 1 primary action, and moves focus to a return link.
       - **Accept — the property.**
         For each RF task mirror, each runtime claim in States, No-JS
         and Anatomy either happens when driven with real keys at
         360x640 and 390x844 in both themes, or is reworded to what
         the demo does. Each surviving claim has a check:claims case
         seen to fail on today's markup.
         Where the demo completes a task:
         - the done state names what was recorded and moves focus to
           a way on (next line, next HU, or the task menu);
         - a screen that takes a typed quantity commits from Enter
           and from one tap.
         On every screen:
         - at most one action is visually primary;
         - a short has exactly one entry path;
         - each bar control does something visible, or its caption
           says the app owns it;
         - no reachable state shows a confirmation and a rejection
           for the same item at once.
         Each task page states in one line how it commits and why.
         Profile headroom is measured before and after, and no CSS is
         added.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

3. [ ] **389.3 — A rejected scan's reason stays readable after the flash.**
       On 4 of 4 docs task screens, the reason for a rejected scan
       lives only in a 1x1 clipped live region. Examples: 'Wrong bin:
       B-07-13 — this HU goes to B-07-12' and 'Wrong scan: B-99-99 —
       expected A-01-04 or MAT-4471'. Visible text is identical at +80,
       +800 and +1000 ms, and aria-invalid is null. The comparator is
       proven: it registers putaway's confirmation reveal. On goods
       receipt, a rejected first scan deletes the empty-state row, and
       'ZZZ-000-NOT-ON-PO' was logged as received. The journey keeps
       'Item not accepted…' visible with aria-invalid=true, using
       profile classes only (0 style tags).
       - **Accept — the property.**
         On every RF task mirror at 360x640, in both themes, at least
         1 s after a rejected scan:
         - a sighted user can read what was rejected and why,
           measured by a visible-text comparator proven against a
           control;
         - the field exposes the invalid state programmatically;
         - the live region still announces it;
         - the rejection has removed no existing row and no empty
           state.
         The demo or its caption says which codes it treats as
         unexpected. Contrast gates stay green, and no profile CSS is
         added. Keeping the reason screen-reader-only is acceptable
         only with a recorded reason and a measured alternative
         visible cue.
       Track: defect

4. [x] **389.4 — P0 · scan.css: ok and error differ by more than hue on screen, or the claim is corrected.**
       Three lenses pixel-sampled the frame band: it is identical to
       the wash in every ok/error × light/dark case, animated and
       reduced-motion. The cause is background-clip: border-box. The
       controls (an injected border, forced colours, padding-box) show
       the bands, so the sampler can see a frame. The ok and error
       washes differ by only 1.26:1 in light and 1.08:1 in dark; for
       deuteranopia the difference is ΔE76 3.8 and 1.8. With forced
       colours and animation on, frame opacity falls from 0.30 to 0.002
       within 555 ms. The check-claims flash case (about lines
       4722-4768) passes by comparing computed border width and style.
       scan.css's header says the FRAME, not the hue, carries the
       verdict.
       - **Accept — the property.**
         First, a check that judges rendered pixels fails against
         today's scan.css; a control proves it can see same-colour
         bands. Then one of two outcomes:
         - In rendered pixels, ok and error differ by a cue other
           than hue, in light and dark, animated and reduced-motion,
           and the forced-colours frame stays visible for the stamp's
           whole lifetime.
         - Or scan.css's header, /components/scan and the claims case
           stop claiming the frame carries the verdict outside forced
           colours, and name the persistent visible text (389.3) as
           the non-hue channel.
         The CHANGELOG entry matches the real compatibility impact of
         whichever change ships, with the reasoning.
       - **DONE 2026-09-25 — the first outcome: the frame now carries the
         verdict.** Cause confirmed: a frame in the wash's own hue over a
         border-box wash, and under forced colours an animation that outranks
         the declared `opacity: 1`. Fix: a NEUTRAL frame
         (`--bo-color-text-primary`), the wash clipped to the padding box
         (`background-color`, because the `background` shorthand in the state
         rules reset the clip — found when the first build still read 1.00),
         and `animation: none` under forced colours. `check:claims` +2 read
         RENDERED pixels (a 1px screenshot row decoded through a canvas at
         RF_WIDTH, the theme's transitions awaited — the first version paused
         them and measured "dark" at light colours) and the forced-colours
         frame at 500ms. Red-proved: HEAD's rules in the built CSS read 1.00
         everywhere and opacity 0.009; both claims failed, 307 others passed;
         309/309 with the fix. Live screenshots 1440/390 x light/dark x
         ok/error. Contrast edge gate: the two frame pairs are EDGE_EXEMPT
         with the pixel claim named as the check. CHANGELOG: visual change,
         attribute contract unchanged. Jev (Rubric 2): 0.96 / 0.87 / 0.97.

5. [ ] **389.5 — Join the RF track: per-type routing that the links, the prose and the Back exits agree on.**
       - rf-list-rf has 0 inbound links, and a walk from the menu
         reaches 5 of 6 fixture pages.
       - rf-landing's contract routes every tile through GET
         /rf/tasks/:type, but 0 of 4 tiles do.
       - The task contracts use /next for pick, putaway and count (1
         each) and not for goods receipt (0).
       - The queue's rows cover 3 task types, although it claims to
         serve one.
       - 0 of 4 tapped identifiers appear at the destination, and two
         POs share one URL.
       - The queue has no link back to the menu.
       - All 6 iframe titles say 'its links walk the whole track', and
         135.2's closed Accept is false for 1 of 6 pages.
       - The goods-receipt page's Related links reach 0 of its 5
         siblings.
       - In-screen Back is a forward push to the menu, so system Back
         then returns to the task just left.
       - **Accept — the property.**
         First re-check which task contracts need the worker to
         choose; today only receiving does.
         - Each pattern page states, per task type, whether its tile
           opens the queue or the next task, and the live links do
           exactly that. Check by reading both.
         - Every kept fixture page is reachable from the menu and has
           an exit, shown by a link walk reconciled against the
           RfTaskMenu and RfTaskQueue sources.
         - Each linked queue row's identifier appears on the screen
           it opens; otherwise the row is not a link.
         - Where Back from a queue-opened task goes, and whether the
           Back label names its destination, is decided and recorded.
           A live walk supports the decision and also records where
           system Back lands.
         - Iframe titles, openers, Related links and the 135.2 record
           all match the census.
         Demoting the queue, with the bridge-screen reason on its
         page, also satisfies this.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

6. [ ] **389.6 — The journey's RF step exits to an RF home.**
       Both RF exits ('Back to my work' and 'Return to my work') go to
       purchasing.html#queues. That page loads index.css, whose floor
       is Chrome/Edge 119 against RF's 108, at comfortable density. At
       360x640 it has a 135 px header (21.1% of the height), a table
       overflowing by 29 px, and focus on body. The only visible queue
       link is approval work. The README's rule is 'RF loads rf-
       essentials.css alone'.
       **Challenger:** "the only visible queue link is approval work"
       holds only for an unapproved order; approved-partly-received
       shows 'Receive PO-1042', complete shows 0 links.
       - **Accept — the property.**
         Every exit from the journey's RF step that means 'back to my
         work' lands on a page that meets all of these:
         - it loads only the RF profile, at spacious density;
         - it has no horizontal overflow at 360x640;
         - RF work is its first actionable;
         - focus lands on a named control;
         - it is composed from the existing task-menu markup, with no
           example CSS and no new framework API.
         check-journey asserts the stylesheet and density at the
         exit, and is red-proved by reverting the exit.
         Alternatively, the journey README records why the desktop is
         the intended home. The owner commits the checkpoint first.
       - BLOCKED ON the owner's 09-20 checkpoint (precondition P2). O2 parked
         it on `park/owner-checkpoint-2026-09-20`, and check-journey exists
         only there. Marker added by 393.3, 2026-09-25.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

7. [ ] **389.7 — The journey's RF confirm and failure verdict are in view at a rugged viewport.**
       At 360x640, after a capture, Confirm receipt sits at 689-741 px.
       After a failed send, 'Connection lost before sending' sits at
       y=774 and focus stays on quantity. Both are below the 640 fold,
       and both are in view at 390x844. The scan field starts at 351 px
       (54.8%), below a 74 px header, a 60 px title and an 88 px KV
       block. check-journey only uses 1440x900, 390x844, 1440 and 390
       wide at 900 high, and 390x420.
       - **Accept — the property.**
         check-journey measures the RF step at a rugged viewport it
         names and justifies. At that viewport, two things are in
         view without scrolling: the confirm action after an accepted
         scan, and the failure verdict after a failed send. The
         verdict can be the text itself, or a viewport-level cue with
         a programmatic channel. The fix removes or demotes chrome
         above the task rather than adding CSS; or the chrome stays,
         with its measured cost recorded. The check is red-proved by
         reverting one fix. If the premise that check-journey lacks
         such a viewport turns out false on re-checking, that is a
         valid finding.
       - BLOCKED ON the owner's 09-20 checkpoint (precondition P2), as
         for 389.6: check-journey exists only on the parked branch. Marker
         added by 393.3, 2026-09-25.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

8. [ ] **389.8 — Goods receipt shows the decision: which delivery, its expected lines, one completing action, in worker language.**
       goods-receipt-rf has 0 KV rows (pick 4, putaway 3, count 3), and
       its first visible text is 'Scan barcode'. Opening it from
       'PO-88213 · Dock 4' or 'PO-88190 · Dock 2' lands on a screen
       that names neither. It shows 0 expected lines, a duplicate scan
       adds a second row, and it has 0 primary actions. The device
       shows 'No scans yet — try the live demo above.' rf-pick's opener
       says every RF screen shares the KV header.
       - **Accept — the property.**
         Loaded top-level at 360x640 in both themes, the screen meets
         all of these:
         - its first visible text names the delivery;
         - each expected line shows received against ordered;
         - a matching scan updates its line, so a repeat scan changes
           one line and not the row count;
         - exactly one visually primary action completes the receipt,
           reachable without scrolling;
         - every visible string states the worker's meaning and does
           not refer to the docs page;
         - it uses only rf-essentials members and no new CSS, checked
           by a census and the served-CSS check.
         The shared-header claim matches the built mirrors, checked
         by counting .bo-kv in the built output. Re-scoping goods
         receipt as a scan-behaviour demo, with the reason recorded,
         is an acceptable outcome.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

9. [ ] **389.9 — On goods receipt, tapping a control never costs the next scan.**
       After a tap on +, the scanner's Enter presses + (quantity 2 to
       3) and 0 rows are added. With focus in quantity, the scan is
       lost and the field reports badInput. After tapping Skip item or
       Report short, the next scan is lost. Control: the same wedge
       sent from the scan field adds 1 row. The States table says the
       field holds focus permanently.
       - **Accept — the property.**
         After a real tap on each control (steppers, quantity, every
         bar button), a wedge scan produces a scan outcome (a line
         update or a visible rejection) and changes no other value.
         This is measured with page.mouse and page.keyboard at
         360x640. A control that cannot meet this is removed, with
         the reason recorded. The States row matches what the screen
         does.
       Milestone: M1 · Phase: 2
       Route: design
       After: 396.12

10. [ ] **389.10 — Goods-receipt quantity: captured after the scan, per line, with out-of-range values refused visibly.**
       A quantity of 6 was applied to 2 different lines. A typed 0 was
       logged as 0, and 20000 was logged although max is 9999. An empty
       quantity was silently logged as 1. None of these showed a
       warning. Receiving 3 units took 3 taps plus 1 scan, against 1
       scan plus 2 keys in the journey.
       - **Accept — the property.**
         A quantity entered for one line never applies to another
         line unless it is re-entered. A quantity outside the line's
         allowed range records nothing and is flagged both visibly
         and programmatically. The States table's over-receipt row
         matches what the screen does. Measured live in both themes.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

11. [ ] **389.11 — Count: the menu, the screen and the state table agree.**
       The Count tile's aria-label says '0 open', yet it opens an
       active 'PI-2026-081 · bin 4 of 30', and the queue lists CC-3092
       as Queued. Before the bin scan, quantity and Submit are both
       enabled, and typing 7 then Submit changes nothing. A right-bin
       scan changes no visible text, and focus stays on the scan field.
       Enter in quantity does nothing. The page claims the count stays
       closed until the right bin, Submit is disabled until a figure
       exists, it is 'a plain form', and it has steppers.
       - **Accept — the property.**
         For every menu tile, the open count on the tile agrees with
         what its destination opens, checked by walking all four
         tiles. A zero tile leads to the documented empty state,
         which has a way back. Each count States or Anatomy row
         either holds when driven with real keys or is reworded.
         Examples: quantity and Submit cannot be used before the
         right bin; focus moves to quantity after it; Enter commits.
         Each surviving claim has a check:claims case seen to fail on
         today's markup.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

12. [ ] **389.12 — Pick shows which scan it expects next.**
       The label 'Scan bin, then item' and the placeholder 'Scan
       A-01-04…' do not change after the bin is accepted. Checked 1 s
       after the bin, item and wrong scans, the visible text had not
       changed in any of the three cases. Scanning the item before the
       bin is accepted with a flash of ok. The States table claims 'the
       field names what it expects'.
       - **Accept — the property.**
         One second after each wedge scan, visible text states the
         verdict. After the bin is accepted, it names the item as the
         next scan. This is measured by a comparator proven against a
         control. A scan out of order is either rejected with a
         visible reason, or the page stops claiming an order. The
         change is in the demo's consumer validation, with no
         framework change.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

13. [ ] **389.13 — Decide once where the RF exception bar sits.**
       The bar is position: static on 4 of 4 task screens. On goods
       receipt it moves from 274 to 531 px over 10 scans, and leaves
       the viewport at scan 13 (360x640) and scan 20 (390x844). A dock
       injected in the browser holds it at 588-640. On pick, 252 px
       (39.4%) is empty below the bar. button.css and ScanToReceive
       both say a real screen docks the bar; the isolated document is
       the real screen, and it does not. Soft-keyboard occlusion has
       not been measured. approval.astro's 390 px card also uses --bar.
       - **Accept — the property.**
         One decision covers all the RF task screens. It is measured
         at 360x640 and 320x533 with quantity focused, checking
         overlap, that every control is reachable, and that the
         focused element stays in view. It is also measured after
         enough scans to overflow the first screenful. The isolated
         documents, ScanToReceive's comment and the docs guidance
         then all say the same thing. The --bar rule does not change.
         'Keep it in flow and drop the docking advice' or 'put the
         log last' are acceptable outcomes if measured.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

14. [ ] **389.14 — RF frame guidance on the existing pages: who owns each app-level slot.**
       app-frame's Not-for says RF runs 'with no frame at all'. As a
       result, the journey had to invent a 74 px identity/exit header,
       a 60 px title and a desktop exit. No RF document (0 of 6) and no
       journey screen shows who is signed in or offers a way to end the
       session, although the menu's content depends on the signed-in
       role. The menu leaves 64.1% of the 360x640 screen empty.
       **Challenger:** that the journey 'had to invent' its header is
       inference, not measurement; its header does show the site,
       lacking only the user and a sign-out.
       - **Accept — the property.**
         rf-landing states who owns each app-level slot:
         - the slots are identity/site, where-am-I, exit, key legend,
           connection, scan feedback, session end and docked bar;
         - each is owned by the menu, by an existing task-screen
           slot, or is refused with a citation (R2-Q3, 126).
         app-frame's Not-for points to this guidance. If identity or
         sign-out is added to the menu, 4-6 tiles stay fully visible
         at 320x533, and only rf-essentials members are used (check-
         markup finds no new class). Any runtime claim gets a
         check:claims case. The owner declining session end as app-
         owned, with that recorded, also satisfies this.
        Milestone: M1 · Phase: 2
        Route: design
        After: 395.1

15. [ ] **389.15 — Decide what a wedge scan does on the menu and the queue.**
       From a fresh load, a scan does nothing and gives no feedback.
       After history Back, focus sits on the last opened tile or row,
       and a PO scan reopens Pick; this happens on both screens. A
       browser-only spike showed an autofocused native GET field
       catches fresh-load scans, with or without JS, but not scans
       after history Back (4 of 4 runs went to the wrong task).
       initScanInput has no pageshow handler.
       - **Accept — the property.**
         Both pages state what a scan does on that screen, based on a
         live run with real keys, both from a fresh load and after
         history Back. Then one of two outcomes:
         - a scan-to-open composition sends a scan to the scanned
           task on both paths, with a check:claims case driving real
           keys;
         - or a design panel refuses it, with the reason recorded.
         Either way, the wrong-task behaviour is documented in the
         States table. No new component is added unless the panel
         records why composition failed.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

16. [ ] **389.16 — Every class an RF document uses has a rule in the profile it loads.**
       bo-u-tabular has 0 rules in rf-essentials: on pick, font-
       variant-numeric computes to 'normal', while on /components/kv it
       is 'tabular-nums'. 4 of 6 RF documents carry a class with no
       rule:
       - pick and count: bo-u-tabular;
       - putaway: bo-u-tabular and bo-u-text-muted;
       - goods receipt: bo-u-text-muted.
       check-markup validates against the full api.json, so it cannot
       see this. PickScreen's header claims it uses 'ONLY profile
       members'. The profile has 179 characters of headroom.
       - **Accept — the property.**
         An instrument reads the BUILT RF mirrors and the BUILT
         profile, and reports, per document, any class token with no
         matching selector. It is proven to fail on today's bo-u-
         tabular. Each reported class is then either removed, added
         to the profile with its byte cost measured against the
         budget, or listed with a reason (for example, a JS hook).
         The documents' own membership claims match what the
         instrument reports.
        Track: defect

17. [ ] **389.17 — Decide whether putaway verifies the pallet as well as the bin.**
       Scanning the pallet's own label gives 'Wrong bin: HU-100234'.
       The screen checks 1 value, the bin, and handles the pallet with
       a 'Wrong HU' button that does nothing when clicked. Pick checks
       both bin and item through one field.
       - **Accept — the property.**
         A recorded decision, one of two:
         - Putaway checks both the moved HU and the destination
           through its one scan field. The Wrong HU button is
           removed, and the bar and element census are re-measured.
         - Or the system-directed shape, with no HU scan, is kept and
           the reason is stated on the page. Scanning an HU label
           then produces a message that names what was scanned,
           instead of 'Wrong bin'.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

18. [ ] **389.18 — The receiving log reads at the glove tier, and its headers say what the cells hold.**
       Log rows are 28 px with 11.7 px code text at 320, 360, 390 and
       480 px wide, against 49 px and 14.4 px at 520 and above. The
       cause is the @container bo-table 30rem rule, which applies
       because the container has no data-density. Adding data-
       density="spacious" gives 49 px rows (red-proved). The 'Received'
       column holds a clock time. The 109.7 report gives column count
       as the reason rf-list escapes this; the real reason is
       RfTaskQueue's explicit data-density.
       **Challenger:** rows measure 48.5 px, not 49.
       - **Accept — the property.**
         At 360x640, the log's row height and code font size match
         the screen's spacious tier, or a recorded reason explains
         the compact choice. Every column header names what its cells
         contain. Every table under patterns/rf/ is re-checked for
         the same missing opt-out by measuring row heights, not by
         reading source. The reasoning in the 109.7 report is
         corrected.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

19. [ ] **389.19 — The task-menu count badge is sized to its content.**
       On rf-landing-rf the badge is 158 px wide in a 160 px tile (0.99
       of the tile), with the number left-aligned, so it reads as an
       empty field. It measures 138 of 140 px at 320 and 173 of 175 px
       at 390. With align-self:center it shrinks to 25.9 px (red-
       proof). App-launch badges are 33-39 px. rf-landing's Markup
       sample reproduces the stretch.
       - **Accept — the property.**
         In the fixture and in the page's Markup sample, the badge's
         rendered width follows its content, not the tile. Measured
         at 320, 360 and 390 in both themes. The fix adds no bytes to
         rf-essentials unless the budget is argued. Every other page
         that puts a .bo-badge directly in a .bo-widget is re-
         measured and either unchanged or fixed.
        Track: defect

20. [ ] **389.20 — The RF queue drops a column and a tab stop that carry nothing, and names itself.**
       The Status column has only 2 distinct values: 3 of 4 rows say
       'Queued', and 'Next' repeats row 1's position. At 320 it forces
       2 of 4 labels to wrap into 73 px rows; with it hidden the rows
       are 49 px. The container's tabindex=0 is a focus stop on a
       region that never overflows (scrollWidth equals clientWidth at
       320, 360 and 390, and the instrument does see an injected
       overflow). It costs one extra keypress and takes the first D-pad
       Down. No visible title names the queue.
       - **Accept — the property.**
         Every column in the RF queue carries information that row
         position does not, checked by counting distinct values per
         column in the rendered fixture. From load, every Tab stop
         leads either to something actionable or to a region whose
         scrollWidth exceeds its clientWidth at 320, 360 and 390. The
         first visible text names what the queue is. Keeping either
         one with a recorded reason (for example axe's scrollable-
         region rule, or a slot for exception statuses) also
         satisfies this.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

21. [ ] **389.21 — RF docs pages: screen first, figures true, promised states buildable from the profile.**
       Where the device screen starts:
       - goods receipt: y=749 of 900 at 1440 (rf-pick: 426);
       - rf-landing and rf-list: 942 and 899 px at 390, which removing
         the preamble brings to at most 546 and 643;
       - putaway and count: 746 and 765 of 844 at 390.
       Other findings:
       - The goods-receipt, putaway, count, landing and list pages
         narrate roadmap history (131.1, 135.1, 135.2).
       - A 14-link profile list is repeated on 3 pages.
       - Goods receipt's Scan-feedback section repeats
         /components/scan.
       - Stale figures: '128×42px' measures 162.8x48; 'not in this
         demo' is out of date; '3-4 tiles' is a 2-column layout.
       - The Loading rows promise a skeleton, but bo-skeleton appears 0
         times in the profile.
       **Challenger:** rf-pick narrates roadmap history too — 6 of 6
       pages, not 5.
       - **Accept — the property.**
         At 390 and 1440, in both themes, each page's device screen
         starts within the first viewport, or the page records why
         what comes before it has to be there. No page narrates
         roadmap history, and restated content becomes a link. Every
         pixel or count figure matches a live measurement at the
         width it names, or is removed in favour of the gate that
         guards it. Every visual state a States table names can be
         built from classes in the served profile (grep each one); if
         not, it is reworded. The rf-essentials budget gate stays
         green.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

22. [ ] **389.22 — Count and putaway on-screen wording and emphasis.**
       The count hint 'Blind count — …' takes 2 lines (36 px) at 360,
       and the page already says 'blind' 4 times. The primary label
       'Submit count' wraps to 2 lines at 320, 360 and 390, and 'Item
       not found' wraps at 360 and 390. Emphasis differs by screen:
       putaway bolds its scan target, count bolds nothing, and pick
       bolds a quantity. Count's anatomy calls the bar that holds
       Submit an 'Exception bar'.
       **Challenger:** 'Item not found' also wraps at 320, and 'Report
       short' wraps at all three widths.
       - **Accept — the property.**
         No worker-facing text on the count screen explains the docs'
         rationale. One stated emphasis rule is applied the same way
         on putaway, count and pick. The primary action's label fits
         on one line at 360 and 390, or the wrap is kept with a
         recorded reason. Anatomy names match what each region
         contains.
        Milestone: M1 · Phase: 2
        Route: design
        After: 396.12

23. [ ] **389.23 — Pick identifiers do not break inside themselves at the 320 px floor.**
       At 320x533, MAT-4471 takes 2 line boxes; at 360 and 390 it takes
       1. 135.3 documented 320-800 as the supported range. The no-wrap
       utility is not in the profile, which has 179 characters of
       headroom.
       - **Accept — the property.**
         At every documented RF width, no identifier on the pick
         screen (bin, item code, task id) breaks inside itself,
         measured by counting line boxes per identifier at every
         width. The fix's cost to the profile budget is measured.
         Refusing is acceptable if the documented range is changed to
         match.
        Track: defect

24. [ ] **389.24 — The data-table cell-link focus ring is clipped on the first and last rows.**
       Pixel sampling of the focus ring, in both themes:
       - row 1: top edge 0% visible, covered by the sticky thead;
       - row 4: bottom edge 0% visible, clipped by the container;
       - rows 2-3: 100% on every edge.
       Controls: a landing tile reads 95%, an unfocused row reads 0%.
       - **Accept — the property.**
         A keyboard-focused .bo-data-table__cell-link shows its ring
         on all four edges for the first and last body rows, in both
         themes, verified by pixel-sampling the rendered page.
         Alternatively, the three-sided ring is judged against WCAG
         2.4.7 and 2.4.11 as acceptable, with the reasoning recorded.
        Track: defect

25. [x] **389.25 — Input to 388.1: state the edge contrast of a joined bar in the glove tier.**
       On the same screen, the bar buttons' edges measure 1.41:1 in
       light and 1.90:1 in dark, while the steppers and fields measure
       4.63:1 and 7.44:1. Under the glare model (g=0.25) the bar edges
       fall to 1.30 and 1.16. The three joined targets read as a single
       strip.
       - **Accept — the property.**
         388.1's button-group guideline states the edge and seam
         contrast of a joined group and of --bar, measured in both
         themes. Either the bar's target edges meet 3:1 non-text
         contrast, or the guideline records why the labels alone
         identify each target. A new modifier is not an acceptable
         outcome.
       - **DONE 2026-09-25 with 388.1.** The guideline states edge 1.41:1 /
         1.90:1, seam 1.47:1 / 1.70:1 and label 17.74:1 / 16.15:1 (light /
         dark), below 3:1 for the edges, and records why each member's label
         and the bar's equal slots identify the target; the solid primary
         carries the boundary where it matters. A `check:claims` case
         recomputes the six ratios and asserts the stated values.

## Slice 388 — owner input: a capsule button and the button group with a usage guideline; grill the RF / rugged-device patterns as a journey (2026-09-25)

Owner, verbatim: *"/components/button — capsule style button / group button
--> with usage guideline. Grill Patterns: RF / rugged devices --> Might need app
screen. Task screen can be better."* Two items; the grill is dispatched by rule 3
("or user asked"), the button by the owner's request.

1. [x] **388.1 — a capsule (fully rounded) button shape that also works on a
       button group, and a usage guideline on `/components/button`.** Slice 111
       shipped `.bo-btn-group` / `--bar` but never decided the capsule shape.
       - **Accept — the property, and refusing the shape is a satisfying
         outcome.** EITHER a shape lands that passes the Objective's
         less-for-more test (one general mechanism rather than a modifier for
         one scenario — decided by a design panel that records the refused
         alternatives), and it holds on a lone `.bo-btn`, an icon button, and a
         joined `.bo-btn-group` (only the group's outer ends round; seams, the
         focus ring and forced-colors follow the shape), with contrast,
         target-size, axe and layout gates green and live screenshots at 1440
         and 390 in both themes — OR the shape is refused with the reason
         recorded. In BOTH cases `/components/button` gains a usage guideline:
         when to use a group, a segmented control, a bar, or separate buttons,
         and (if it ships) when a capsule is right and when it is not, each
         with its "Not for" clause, demos through `Demo`, and a `check:claims`
         case for any runtime claim the guideline makes.
       - **DONE 2026-09-25 — the capsule is REFUSED; the guideline landed.**
         A design panel (three designs — a shape setting, a
         `.bo-btn--capsule` modifier, a skeptic — each prototyped on the live
         page; two judges; a synthesis that re-measured) chose the refusal:
         28 and 28 against the setting's 21/23 and the modifier's 17/18.
         Measured grounds: every fully rounded shape outside the tokens (8 of
         8) is a status, token or marker, never an action [**corrected by Slice
         392:** 6 of the 8 are statuses/tokens/markers and 2 are REMOVE buttons
         (`.bo-chip__remove`, `.bo-tag-input__remove`), and `.bo-chip` renders
         as a link on 117 of 128 pages — a pill is never a COMMAND button here,
         but it is already a link and a remove control; the other three grounds
         reproduced], and under forced
         colours a `--sm` secondary capsule and a `.bo-badge` compute the same
         in every property but the radius; a capsule is invisible at rest on
         the ghost variants (0 px changed); it cuts an icon button's
         hit-tested share of its box from ~0.99 to ~0.83; and the best form,
         the setting token, froze `--bo-radius-md` on `:root` as drafted.
         **Reopen condition:** an action that floats OVER content (the
         modifier design's trigger) — reopen from the setting form with its
         `:root` default fixed and a 2px forced-colours edge on lone capsules.
         Landed on `/components/button`: the opener's "Not for" (segmented,
         chip), so `button` leaves the wrong-choice EXEMPT list; "Which one"
         (separate / group / segmented / bar, each with its Not-for); demos for
         separate buttons, toggles, the segmented choice and "one shape";
         captions on the group and bar; the edge/seam figures 389.25 asked for.
         Also landed, found by the panel: **`aria-pressed` had no visible state
         under forced colours** (pressed and unpressed computed identically) —
         now the system Highlight pair, no transition, ring in Highlight. The
         RF profile budget went 40 -> 41 kB for it (65 characters over; reason
         in `build-rf-essentials.mjs`). `check:claims` +5 [corrected by Slice 392: +6 counted the flashRow change], each seen to fail
         on a broken build (314/314 green). Jev (Rubric 2): 0.97 / 0.91 / 0.91.
3. [ ] **388.3 — the segmented control's checked option draws an author-colour
       focus ring under forced colours.** Found by 388.1's panel: rgb(13,148,136)
       in both themes, where every other control's ring computes Highlight,
       because the checked option sets `forced-color-adjust: none`.
       - **Accept — the property.** Under forced colours a focused checked
         option's ring computes a system colour, asserted by a `check:claims`
         case that fails on today's CSS; the tabs' forced rule is measured for
         the same defect and fixed or cleared.
       Track: defect
4. [ ] **388.4 — two docs follow-ups from 388.1's panel, not re-measured.**
       (a) `/concepts/cascade`'s example `.bo-btn { border-radius: 0; }` works
       only because 0 is a group's inner radius; (b) `check:target-size` reads
       bounding boxes, so a fully rounded target (`.bo-chip__remove`, 24px) is
       judged by a box it does not fill.
       - **Accept — the property.** (a) the cascade example demonstrates an
         override whose result does not depend on a coincidence of values, or
         the dependence is stated; (b) the target-size gate measures hit-tested
         area for fully rounded targets, or records why the box is enough.
       Track: defect
2. [x] **388.2 — grill the RF / rugged-device family as a JOURNEY
       (`/design-grill` flow mode).** Owner hypotheses to test, not to assume:
       *an app screen may be missing* and *the task screens can be better*.
       - **Accept — the property.** A report in `.roundtable/` that: reads the
         earlier RF grills first (109.7's family grill 2026-08-22, the
         coverage grill 2026-08-23, the device-coverage grill 2026-09-20) and
         does not re-litigate what they settled without new evidence; walks the
         family live on the container at a rugged-device viewport it names and
         justifies, plus 390, both themes; gives a verdict per seam and per
         task-screen element with a measurement beside each; answers BOTH owner
         hypotheses explicitly (app screen needed or not, and why; which task
         screen elements change), where "no change" is a satisfying answer if
         the measurement supports it; and triages every actionable into
         ROADMAP with its own Accept criteria.
       - **DONE 2026-09-25.** Report
         `.roundtable/design-grill-flow-rf-2026-09-25.md`; earlier RF grills
         read first. Viewport 360x640 DPR 2 (the floor study's fixture) plus
         390x844, both themes. Per-seam and per-element verdicts carry their
         measurements. H1: no new pattern — wire what exists; H2: yes, 25
         actionables filed as Slice 389, all re-measured by a challenger and
         all surviving; its 10 corrections to the report are applied and
         listed there.

## Slice 387 — residuals the 375.11 measurement found beyond its own list: two more lost-press paths from the message's horizontal overflow, and two layers that still cover a frozen cell's message (2026-09-25)

Found by the skeptics of the 375.11 workflow; each measured, none fixed here.

1. [ ] **387.1 — the message's horizontal overflow loses presses on two more
       paths.** (a) Scroll then press, every scrollbar mode: after a
       horizontal wheel to read a long message (scrollLeft ~70), the
       blurring mousedown clamps scrollLeft to 0, the row's Remove button
       slides ~70px, and the press lands on "Unit price" — lost at 60 and
       900ms, at HEAD and with 375.11's rule. (b) The page's canonical markup
       has no `.bo-data-table-container`, so with classic scrollbars at 390 a
       303-character message toggles the VIEWPORT's scrollbar and a sticky
       `.bo-form-actions` "Post" moves 15px: 2 of 7 top-band presses land.
       375.9's Accept names the canonical markup.
       - **Accept — the property.** A real press on a control that was visible
         when the press began activates it, on both paths, measured where
         each can be seen; OR each is accepted with the measurement and a
         reason. The skeptic's reading: moving the message's overflow out of
         the scroll container would close both and 196.1's residual at once.
       Track: defect
2. [ ] **387.2 — a frozen cell's message still has two covers above it.** Near
       the viewport bottom the anchored message flips ABOVE a first-row
       frozen field onto the sticky header (z 1100) and is 128-160 of 160
       points hidden; and the sticky `.bo-form-actions` (1150) covers it 80 of
       160 at the bottom. No z-index can fix either: a frozen cell above 1100
       paints over the header when scrolled beneath it.
       - **Accept — the property.** The message of a focused frozen field is
         fully painted wherever the anchor places it, OR the case is
         accepted with a reason. The candidate named by the skeptic is the
         top layer (a popover message), which is a markup/JS change, so this
         is a builder's decision to argue, not a CSS tweak.
       Track: defect

## Slice 386 — Objective grill of 362.1, 369.2 and Slice 385: 3 of 3 headline claims reproduce, and the defect is in the sweep's own write-up — it said the closed-history share fell to "~0" (measured 14.4%) and called lane 2 "unchanged by construction" while a lane-2 input had moved (2026-09-25)

**Dispatched by rule 3**, `Objective 3 / 3 OVERDUE [362, 369, 385]`. Labels resolved
by commit subject: `362` and `369` are ITEM ids (362.1, 369.2), `385` is a slice.
No earlier grill covers any of them. Report:
`.roundtable/grill-objective-362-369-385-2026-09-25.md`.

- **Reproduced:** 362.1 — `astro check` 0 errors, wired into `docs:build`
  (`check:types`), and the stray `))}` is absent from the visible text of the
  built tokens page (raw grep reads 1, all inside minified JS — a structural
  read, with the pre-fix source as the positive control). 369.2 — over ALL 139
  built pages, print emulation, light and dark: 0 of 278 readings off
  `#fff`/`#000`. Slice 385 — 21 slices byte-identical in the archive; 925
  checkboxes both sides; open 33 -> 33.
- **Defects, all in 385's write-up and all corrected in place:** the share is
  14.4% (971 lines, 6 closed slices kept), not "~0"; the live file is 6,750
  lines, not "~6,780"; lane 2 is NOT "unchanged by construction" because
  `package-lock.json` (796 lines, astro check) is one of its inputs — the figure
  held, which is the honest wording; the "+170 words is 362.1/384/369.2" line
  was an attribution nobody measured.
- **Framework code since Slice 384's grill:** `git diff --numstat eec86ae2 HEAD --
  packages/core/src` lists 0 files. Adoption channels, the first user (377.6,
  still an owner call) and comparators were NOT re-read this grill.

1. [ ] **386.1 — nothing keeps the print reset true on a NEW standalone page.**
       369.2's fix is ten copies of one block, and the ten exist because each
       page builds its own `<html>` with an unlayered `body` rule. A page added
       tomorrow repeats the loss silently.
       - **Accept — the property.** EITHER a check reads print-emulated `body`
         colours over every built page and fails on any that is not white/black
         (base rate measured today: 0 of 139, so it cannot fail on this tree —
         red-prove it with the rule removed), OR the ten are made to share one
         source and the shape is refused with the reason recorded.
       Track: defect

## Slice 385 — Standardize sweep, 4 of 4 lanes on an isolated clean build, plus the thirteenth archive sweep: lanes 1-3 match their base, lane 4 is +26 body words with no cut, and 21 closed slices moved verbatim (ROADMAP.md 10,140 -> 6,726 lines; [corrected by Slice 386: 6,750 after this slice's own entry, and the closed-history share is 14.4%, not ~0]) (2026-09-24)

**Dispatched by rule 2**, `Standardize 4 / 4 OVERDUE`. Built in a worktree of HEAD
(`6a85e048`) with its own `npm ci`; docs build 0 FAIL. Base for §3's shortcut:
Slice 383 (`330051e0`).

- **Lane 1 (of 4):** *"0 dead style attribute(s) on 0 page(s); 1392 live"*.
- **Lane 2 (of 4) — figure equal to the base [corrected by Slice 386: NOT "unchanged by
  construction" — `package-lock.json`, a lane-2 input, moved]:** `git diff --stat 330051e0 HEAD --
  packages/core/src/css` is empty and the figure equals the base's, *"74 source
  file(s) · 245 rule(s) … 234 distinct bodies · 7 body(ies) appearing more than
  once"*. `package-lock.json` did move (astro check, 362.1); the figure held.
- **Lane 3 (of 4):** 119 pages, median 833, 119,246 words (Slice 383: 119,076);
  the same 17 flagged pages, all in §3's enumeration. Docs pages changed in the
  window (362.1, 384, 369.2); [corrected by Slice 386: that the +170 words comes
  from them was not measured].
- **Lane 4 (of 4):** dispatch region 7,749 (Slice 383: 7,723); 1 of 16 sections
  moved, rule 3 +26 body words. Too small and too specific to cut.
- **Archive sweep (closed-history share 43.6% -> 14.4% [corrected by Slice 386: written as ~0, unmeasured], past both trigger halves):**
  21 closed slices moved verbatim by a fence-aware splitter built from HEAD's
  bytes; 5 named by a still-open item stay (339, 348, 349, 353, 283). Each
  section re-found byte-identical in the archive by an independent regex
  reader. Raw counts reconcile: checkboxes 925 before and after (live 123 -> 101,
  archive 802 -> 824), open 33 -> 33; `check:slice-refs` passes (1,136
  assertions, 366 slice numbers). Not covered: no screenshot (no rendered
  surface changed).

## Slice 384 — Objective grill of 352.1, 352.2, 353.2 and Slice 383: 31 of 35 findings survive; the data-table page's style-flush reading depends on the Chrome build, not the machine, and the po-app harness now catches a STALE dist, not only a missing one (2026-09-24)

**Dispatched by rule 3** (`Objective 3 / 3 OVERDUE [352, 353, 383]`) after rule
1 read 0 open P0; the owner asked for it at once rather than at the next wake.
352.1, 352.2 and 353.2 were closed in place (`135fb21b`, `37a704a2`,
`633ff058`); Slice 383 is `330051e0`. Workflow `wf_678cad48-73f` (4 finders +
4 adversarial verifiers; 44 claims reproduced, 35 findings, 31 survived).
Report: `.roundtable/grill-objective-352-353-383-2026-09-24.md`.

**Fixed in this commit:**
- **The data-table performance passage.** Its style flush costs about 14× select-all on
  an M4 with Chrome 153, 28-31× on the same M4 with Chrome 141, and 24-38× on
  a recorded Xeon with Chrome 141: the browser build moves it, which 352.2's
  "a faster machine moves both columns together" hid. It matches the
  published 12-13× only on the stylesheet the table was measured on (today's
  costs 5-11% more). "Under 700 ms even throttled" is false today (about 0.8
  s at 20k); the published throttled rows are not a 4× throttle of the
  unthrottled sitting. The page now says all of that, with the full command.
- **po-app's harness.** It now also checks that the installed `index.js`
  exports every name `server.mjs` imports (a STALE dist passed the old check
  and still produced the false select-all failure), names the cause from what
  it can observe (not built / stale install / partial dist), and refuses if
  `server.mjs` mentions `/assets/` somewhere it cannot parse. Each branch is
  red-proved on scratch copies; `check:po-app` still passes 20 behaviours.
- **The metric sampling.** `record_iteration.py` samples before it regenerates
  `STATUS.md`, honours `--no-log`, and samples only when the recorded commit
  is HEAD. Rule 5's freshness flag no longer counts the auto-sampled name, so
  it reads STALE again, which is the truth for the names it can act on.
- LOOPS.md §3's lane inputs gain the files the grill found missing, and a base
  figure is quoted from the base's write-up. Rule 3's pointer says 28 of 63
  has no committed command. `ENVIRONMENT.md` §3c records the tested `npm ci`
  recipe. `measure-stress.mjs`'s JSON usage gains `-s`.

**Corrected in place:** 352.1, 352.2, 353.2, open item 372.1's lead example,
and Slice 383 (archive-sweep reason, attribution, build path).

**Thesis:** npm (09-15..21) still 16 / 12; jsDelivr 29; GitHub 0 stars, 0
forks; framework code since Slice 382 **0 lines** (`git diff --numstat
0ed584cd HEAD -- packages/core/src`), 11 lines of docs. Six P0 fixes still wait
on 377.5.

1. [ ] **384.1 — lane 4's anchor and the rule-text generator.** A partial trim
       resets both lane-4 anchors, so 239 of the 340 words that grew since the
       previous full cut are now invisible to the next sweep's per-section
       attribution and ratchet. The growth itself has a GENERATOR: closures and
       grills write their replay figures into rule text (349.1, 348.1, 382,
       383), which 308.1/339.1's third branch says no cut can hold against.
       - **Accept:** measure how much of the dispatch region's growth since
         `4e6b83c1` is measurement narrative versus instruction, then decide
         either a high-water anchor in `report_loop_prose.py` or a charter line
         ("replay figures go to measure files; rules carry the pointer"), with
         the reason. Refusing both on the measurement is satisfying.
       Parked: M1 — Standardize lane-4 machinery, not milestone work — revisit: the Standardize run at milestone close

## Slice 383 — Standardize sweep, **4 of 4 lanes on an isolated clean build**, the first under Slice 382's corrected §3: lane 2 is unchanged by construction, lanes 1 and 3 match their base, and lane 4 cuts 101 words of today's own measurement narrative back out of the dispatch region (2026-09-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 382 — Objective grill of 348.1, 349.1, 350.1: 19 of 22 findings survive, every headline figure reproduces, and the closures got their own corrections wrong — 348.1 called a correct figure unreproducible, 349.1's new rule-3 wording still missed what the counter reads, and 350.1's shortcut skipped the comparison that would catch it (2026-09-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 381 — Objective grill of 335.1, 346.1 and Slice 380: 27 of 33 findings survive, every headline figure reproduces, and the defects shipped beside them — two bugs in 346.1's check, a verification recipe that was not isolated, and a loop that spent five hours on its own machinery while six P0 fixes waited on a release (2026-09-24)

**Dispatched by rule 3** (`Objective 3 / 3 OVERDUE [335, 346, 380]`) after rule 1
read 0 open P0. The labels 335 and 346 resolve to items closed in place
(`0756cafb`; `f8856986` + `2428af86`), so the subjects are those two closures
and Slice 380. Report: `.roundtable/grill-objective-335-346-380-2026-09-24.md`
(4 finders + 4 adversarial verifiers, workflow `wf_516a8fb5-83a`; 45 claims
reproduced, 33 findings, 27 survived, 6 refuted).

**Fixed in this commit:**
- `record_iteration.py` checked HEAD rather than the recorded commit, and the
  check failed silently from outside the repository or on a bad sha. It now
  passes the recorded commit, runs from the repository root, and a failed git
  read exits 2 as "could not run".
- `report_loop_prose.py` counted Slice 380's relocation as a cut, resetting
  lane 4's baseline. A cut now shrinks the file too (`is_cut`, +4 self-test
  cases; no past reading changes). The baseline is back at `4e6b83c1`.
- LOOPS.md's intake spelled `$GITHUB_TOKEN`, which is unset locally: both
  intakes answered 401 with `len` 3 while the 404 control passed. It now falls
  back to `gh auth token` and prints each status, verified with the variable
  unset (200 / 200 / 404).
- ENVIRONMENT.md §3c: a worktree with symlinked `node_modules` builds against
  the main checkout's `packages/core`, so Slice 380's "clean tree" was not.
  The figures held only because that `packages/core` had no uncommitted
  source. RESUME.md's lane-run note stops recommending the recipe.
- LOOPS.md §6's Exit now requires the thesis section, with a framework-code
  command that can see JS: 377.7's structural half.
- `.roundtable/measure-346.1-2026-09-24.md` carries 346.1's commands and lists.
  The pinned selection reproduces 1,062 and 231 at `04e08b9b`.
- An 18th stale copy is annotated in the archive. The four uncommitted
  adoption rows are committed.

**Corrected in place:** 335.1's DONE block (the command that ran; a tombstone
and a consumed number are left); 346.1's DONE block, rule, docstring and
comments (18 sites; 10 of 17 on the superseded number itself; two of the
verifiers' eight left copies; one odd `~~` paragraph hid about 10,700 lines;
"at least 59, among the 231"; precision about 4 real sites in 234 printed);
Slice 380 and the 167.1 note ("none is incident narrative" is false; the
rules bucket is two build rules and one unit rule); 377.5 (six unreleased P0
fixes, not four); 377.7 (channel windows, jsDelivr, current-version
downloads, GitHub traffic); Slice 379's daily series and its report's command
path.

**Thesis:** npm `@busy-office/ui` 16 in 2026-09-15..21, 5 of them the current
version; `create-ui` 12; jsDelivr 29 a month, 0 hits on any `dist/` file;
GitHub 22 views / 7 uniques and 244 clones / 118 uniques (09-09..22); 0 stars,
forks or non-owner items. Framework code since Slice 379: **0 lines** (`git
diff --numstat 2fad3cc7 HEAD -- packages/core/src`), against 373 lines of loop
tooling and 339 of records.

1. [ ] **381.1 — the correction-site check: precision, coverage, or unwire it.**
       Over the last 150 `ROADMAP.md` commits it printed 234 site lines, about 4
       of them real stale copies; 12 of 19 mutations survive its self-test,
       including the paths the published 10-of-17 rests on (commit-message
       "not N", struck extraction, `--old`, strike masking, the exit code); it
       cannot see an end-of-hunk replace, a struck bare number's context,
       separators or units, or a copy that moved to `ROADMAP-archive.md`.
       - **Accept:** state a precision floor before measuring. Then either
         re-tune — suppress quotations inside the correcting section, search
         both roadmap files, add a self-test case for each path — and re-measure
         precision and recall on the same windows (the 150 commits, the 18
         sites), or unwire it from `record_iteration.py` if it stays below the
         floor. Unwiring on the number is a satisfying outcome.
       Parked: M1 — loop machinery (the correction-site check) — revisit: milestone close, unless the owner wants "unwire" now
2. [x] **381.2 — rule 3 arms on slices that shipped nothing.** This grill's
       three subjects changed 0 lines under `packages/` or `apps/docs`, and it
       still ran four finders and four verifiers. Before anything changes, the
       base rate.
       - **Accept:** over the last 20 Objective grills, count those whose armed
         slices changed no shipped artefact (`git diff --numstat` of each
         subject's commits against `packages/ apps/docs/src`), with the command
         beside the count. Then decide: narrow such a grill to reproducing the
         headlines plus the thesis section, count only shipping slices toward
         rule 3, or leave it — refusing on the number is satisfying.
       - **DONE 2026-09-25 (by 393.5): 4 of 20, so narrow, don't recount.**
         `python3 .roundtable/milestone-m1-2026-09-25/grill_shipped.py --rev
         5177daad`. The flag pins the window: the script takes the last 20
         grill rows at that revision. The script is committed with 393.5. Over the
         last 20 Objective grill rows (388.2's design-grill and the duplicate
         `Slice 330 amended` row were excluded), the subjects of **382, 381, 355
         and 337** changed 0 lines under `packages/` and `apps/docs/src`.
         - **Red-proved** (`--redproof`): 381 reads 0, as its own report says,
           and 392 reads 174. 39 of those lines are in button.css and
           scan.css; most of the rest are their docs pages.
         - **What changes the count:**
           - the commit-subject match alone gives 5 (grill 346's subject
             landed inside a 345 commit);
           - the path set `packages/ apps/docs` gives 3;
           - leaving out build scripts, tests and READMEs gives 5;
           - counting the ARMED set, the script's `armed rows / their lines`
             column, gives 3 of 20: 382, 381 and 351. It is 4 if 337's empty
             window is counted.
         - **What the instrument cannot see:** behaviour (it counts lines),
           and work that neither a commit subject nor a log row attributes to
           the subject. It was corrected four times before the figure was
           taken:
           - a subject match alone missed grill 346's in-scope commit, so a
             second join through the log rows' shas was added;
           - three rows' recorded shas pointed at the wrong commit, and their
             grill commits were resolved by hand in the script;
           - lines are summed once per commit;
           - an exclude pathspec that excluded nothing was fixed.
         - **Decided:** such a grill is narrowed (LOOPS.md §6 step 0). It
           reproduces the headlines and writes the thesis section, with no
           finder or verifier fan-out.
         - **Refused:** counting only shipping slices toward rule 3. It changes
           a counter, and this repo has five recorded counter starvations.
           `Rules-2-3` in M1's field block already reads `scoped`. That was
           pre-filled by the triage commit as the draft's recommendation, while
           O12 is still `___` in the owner table, so it is a default awaiting
           the owner's confirmation, not a decision. `milestone.py` counts the
           field as filled, and the owner can set `normal` or `suspended`.

## Slice 380 — Standardize sweep, **4 of 4 lanes on a clean HEAD tree**: lanes 1-3 carry no delta; lane 4 re-decides `DESIGN.md` (HONEST on what it grew on, no longer "the control") and moves 346.1's correction rule out of the dispatch region (2026-09-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 379 — Objective grill of Slices 345, 378: every headline figure reproduces at its own revision, and all twelve findings are in what shipped BESIDE the figure — 345.1's move of `display: inline-block` into the utility breaks a block spinner nobody measured, and 378 published totals read off a working tree (2026-09-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 378 — Standardize sweep, **4 of 4 lanes, all clean**: the window touched every lane's input (two CSS fixes, a JS fix, prose), and no lane moved against the verdicts Slice 376 recorded that morning (2026-09-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 377 — Objective grill of Slices 373, 374, 375, 376: all 47 load-bearing claims re-checked HOLD; the findings are two shipped pointer defects, a completion gate that cannot see a revision, and a product thesis no grill had asked about — adoption indistinguishable from zero, and the one real user unnamed (2026-09-24)

Report: `.roundtable/grill-objective-373-374-375-376-2026-09-24.md` (4 finders
+ 4 adversarial verifiers; 37 findings, 35 survived, 2 refuted). Record-only
corrections landed with this slice: 374.6's criterion count, 373.7's file
attribution, 376.8's figures, 374.5's missing CHANGELOG entry, a stale
`check-claims` comment, and LOOPS.md's 0fr/1fr Settled section brought to
376.2's state.

1. [x] **P0 · 377.1 — a real right-click does not open the context menu.** On
       `/components/data-table/` a trusted right press opens the menu on
       `contextmenu` and its own `pointerup` light-dismisses it (three drivers,
       1440 and 390); a synthetic `contextmenu` opens it, and no `check-claims`
       case exists. The page instructs "Right-click Vendor or Amount above."
       - **Accept:** a real right press (down, hold, up via CDP) on the Vendor
         and Amount headers leaves the menu `:popover-open` after release, at
         the cursor, at 1440 and 390 — in `check-claims`, red on today's build.
         The fix shape is argued in the item; say what it does on an engine
         that fires `contextmenu` after mouseup.
       - **DONE 2026-09-24.** `initContextMenu` now records whether a press is
         in progress (capture-phase pointerdown/up/cancel): a `contextmenu`
         that arrives mid-press opens the menu after the release, one task
         later, at the `contextmenu` coordinates; one with no press around it —
         Windows, which fires it after mouseup, and the keyboard menu key —
         opens immediately, as before. `popover="auto"` is kept, so light
         dismiss, Esc and item-click-to-close are unchanged (verified live: an
         outside click and Esc still close it). `check:claims` +4 (both headers,
         1440 and 390): all four red on the pre-fix build (open false, 506-929px
         from the cursor), green after; vitest +1 pins the ordering. The ACR's
         2.5.7 drag scan shortlisted the file once it named pointer events and
         refused to build — recorded as non-drag, with its reason (the gate
         doing its job). Jev: supported 0.93 (A 0.94, B 0.94).
2. [x] **P0 · 377.2 — the app-launch launcher's filter desyncs after Escape.**
       Escape empties the field (Chromium fires `search`, not `input`) while
       the grid stays filtered and the status still names the old query.
       - **Accept:** after one Escape with a query typed and a reopen, the
         visible tiles equal the set computed from the field's CURRENT value
         and the status agrees, DOM-compared, in a real-key `check-claims`
         case red-proved against today's build.
       - **DONE 2026-09-24.** The launcher re-runs its filter on the dialog's
         `close` event, which fires after the native Escape-clear on every
         engine, so the grid follows whatever the field holds — cleared or not
         — without depending on Chromium's non-standard `search` event.
         `check:claims` +2 (1440 and 390) asserts the invariant rather than
         re-implementing the filter: re-running the page's own filter on the
         reopened field changes nothing. Red on the pre-fix build (empty field,
         2 of 9 tiles, "2 applications match inv"), green after; the seven
         existing launcher claims still pass. Live at 1440/390 light/dark.
         Jev: supported 0.94 (A 0.93).
3. [ ] **377.3 — the completion gate cannot see a revision.** 2 of 30 closes
       since 2026-09-19 were false at HEAD when marked (373.3, 373.4); the
       rubric names no revision; no check reads git status; `build-id.json`'s
       dirty flag is constant in the container.
       - **Accept:** a close is verified on HEAD alone — e.g. `record_iteration
         --outcome landed` builds HEAD in a throwaway worktree and re-runs the
         item's named commands, or the rubric requires a HEAD-only build and
         the report quotes its sha. Replaying the 43cca240 close must FAIL it.
       Milestone: M1 · Phase: 0
       Route: build
       After: 393.11
4. [ ] **377.4 — pointer coverage, named per behaviour.** 16 of 26 behaviours
       listen for pointer input; trusted events reach 8 in `check-claims`;
       presses from a focused state had no coverage before 2026-09-24; two
       comments call an in-page `el.click()` "real". Base rate of a synthetic-
       only path being broken under real input: about 1 in 9.
       - **Accept:** a `check:pointer-coverage` meta-gate (`@heuristic`, with
         `--self-test`) fails when a behaviour with a pointer listener has no
         CDP-input case, unless it is in an EXEMPT map with a reason; the two
         mislabelled comments are gone. Measure its base rate before wiring it.
       Track: defect
5. [ ] **OWNER · 377.5 — release the unreleased fixes, or record why not.**
       231 commits and eight framework defect fixes (four P0) since 0.8.0
       (2026-09-06). The one consumer pins 0.8.0 and vendors only the CSS, so
       375.9, 376.2, 376.4 and 374.5's 6x smaller default export are fixes it
       does not have. Publishing is owner-triggered. Either outcome closes it.
       [**Corrected by Slice 381:** **six** P0 fixes are outside `v0.8.0`, 260 commits
       back: 300.1 (issue #1's crash, closed on 2026-09-06 with the fix "on the
       next release"; the published `bo-check-markup` still crashes), 375.9,
       375.10, 376.2, 376.4 and 377.1.] [**Corrected by Slice 392:** **seven** P0
       fixes (adds 389.4) among 16 Fixed entries under Unreleased, 313 commits
       back (`git log --oneline v0.8.0..HEAD | wc -l`, 2026-09-25). And the
       premise about the consumer was wrong: busy-office-erp (private, last push
       2026-09-09) has NO package.json; its spike 6
       (`spikes/06-runtime-ui/render.py`, `UI_VERSION = "0.8.0"`) vendors
       `index.min.css`, `htmx.min.css` and `dist/api.json` from the tarball and
       validates with `check-markup.mjs`. Its five committed spike-6 screens use
       none of the classes or scripts the six CSS/JS P0 fixes touch, and the
       `index.min.css` it vendors was already comment-free at 0.8.0; the one
       unreleased fix its workflow touched is 300.1 (issue #1). Any case for
       releasing rests on users no channel can see. The release stays the
       owner's call.]
6. [ ] **OWNER · 377.6 — is busy-office-erp the named first user?** Its ADR-0016
       names this package the reference implementation of its runtime-UI
       contract; nothing in this repo's steering documents names it. If yes:
       the Objective names it, and one checkable property (its contract's
       §7.1 conformance against current `dist`) stands in for "serves them".
7. [ ] **377.7 — an adoption reading at every Objective grill, and §6's exit
       requires the thesis section.** No record has ever read adoption; none
       of 71 grills ran step 1; in 373-376 about 1% of changed lines were
       framework code.
       - **Accept:** `record_metric.py` gains the reading (non-publish-day npm
         downloads for both packages, jsDelivr monthly hits, non-owner issues/
         discussions/stars/forks) and the next grill quotes it with the
         channels it cannot see; LOOPS.md §6's Exit names a thesis section
         (adoption reading, the named user, comparators starting from SAP
         fundamental-styles) and the framework-code line count since the last
         grill, with its command.
       - **The Exit half LANDED in Slice 381** (LOOPS.md §6, with
         `git diff --numstat <sha> HEAD -- packages/core/src`, which sees JS;
         the first command used named a `behaviors/` path that does not exist).
         **The instrument half stays open, with four requirements the 381 grill
         measured:** record each reading's window (npm's last week lags, and a
         daily series beside it covered other days); record current-version
         downloads (5 of 16 were 0.8.0); record jsDelivr hits to `dist/*`
         files, since every hit so far was a README, package.json or script;
         and add GitHub traffic, the only channel above zero.
       Parked: M1 — Objective-grill machinery — revisit: the Objective grill at milestone close
8. [ ] **377.8 — the ACR's 1.4.11 and 2.4.7 remarks derive from source.** 1.4.11
       still states the limitation 374.7 removed; both remarks are literals.
       - **Accept:** removing check-contrast's edge branch, or changing the
         forest focus-ring or border-strong value in a scratch copy, changes
         the published remark or fails the build.
       Track: defect
9. [ ] **377.9 — re-decide 375.6 on real CI timings.** Build steps are
       14.2-15.6% of job time (8 runs), not ~8%; `npm ci` is about a third of
       the build.
       - **Accept:** 375.6 and ci.yml's cost comment carry figures reproduced
         from `gh api …/actions/runs/<id>/jobs` over ≥3 recent runs, with the
         command beside them; the decision follows the data either way.
       Parked: M1 — CI cost, not milestone work — revisit: the next change to CI cost
10. [ ] **377.10 — the Jev band, re-measured with the question form Rubric 2
       prescribes, and the set recorded.** 375.8's zero-FP result rested on
       asymmetric criteria; uniform re-runs put a false case at 0.87 once.
       - **Accept:** the 20 cases (claims, evidence, questions, truth) are
         committed; re-run with uniform criteria, truth-blind ids, ≥3 repeats;
         FP/FN at 0.85 and 0.35 reported with spread; the rubric, its heading
         and CLAUDE.md agree on n; the "never wrongly says yes" sentence is
         kept, qualified or withdrawn on that data.
        Milestone: M1 · Phase: 1
        Route: build
        After: 394.12
11. [ ] **377.11 — 375.10's "holds the option" half must be able to fail.**
       `label.includes('')` is true.
       - **Accept:** the predicate rejects an empty value or asserts equality
         with the label or the event detail; red-proved by a handler that
         clears the field on `bo:combobox-select`.
        Track: defect
12. [ ] **377.12 — the preview's provenance is truthful.** The container
       reports `{sha:null, dirty:true}` whatever it holds.
       - **Accept:** the container build receives the sha and the dirty
         build-input paths and `stamp-build-id` honours them, failing loudly
         rather than writing null; the served stamp names HEAD plus exactly the
         uncommitted paths it contains.
        Parked: M1 — docs-preview provenance, not milestone work — revisit: a stale-docs-container incident
13. [ ] **377.13 — 375.9's corpus figure is re-runnable.** The sweep script
       lives only in session scratch.
       - **Accept:** the script (or its committed equivalent) is in the repo
         where 375.9 cites it, and a later run on HEAD reproduces or corrects
         0 of 4,944.
        Parked: M1 — measurement hygiene, not milestone work — revisit: milestone close
14. [ ] **377.14 — the low items, one bundle.** (a) 374.1's seam loop visits 2
       of the 7 pages rendering `.bo-quantity`/`.bo-money` — derive the list
       from `dist` or narrow the Accept; (b) six "56rem" prose restatements of
       the shell band pass 373.3's value grep — derive or accept them;
       (c) 373.9's refusal counts carry no recorded predicate; (d) count the
       runtime-behaviour sentences on component/pattern pages with and without
       a `check-claims` case before deciding anything about the umbrella
       pattern. Each closes on its own measurement.
        Parked: M1 — a low-severity bundle — revisit: milestone close

## Slice 376 — Standardize sweep, **4 of 4 lanes**: one dead style and two false passages fixed, four prose verdicts recorded (enumeration 16 -> 20), one standing CSS group found DISSOLVED by a measured fix, and two shipped defects found BESIDE the lanes; the completeness critic also found two closed items resting on uncommitted work (2026-09-24)

**Dispatched by rule 2** (`Standardize 13 / 4 OVERDUE`) after rule 1 cleared
(375.9, 375.10). Each lane's figure, as the lane printed it
(`scripts/loops/standardize_lanes.py`): lane 1 *"1 dead style attribute(s) on 1
page(s)"* · lane 2 *"7 body(ies) appearing more than once"* · lane 3 *"flagged
union … 17 page(s)"* · lane 4 *ratchet: ROADMAP.md 6 up, ENVIRONMENT.md 24 up*.
Adjudicated by one agent per lane against the recorded verdicts, then a
completeness critic that spot-checked 11 citations (all held).

**The critic's cross-lane finding came first and landed first:** 373.3 and 373.4
were `[x]` on hunks that were never committed (the ACR 2.5.7 row; DESIGN.md,
`/base/primitives` and the Gallery drawer patch). Landed in `5d0146f5` /
`24ca80b0`; HEAD then built green alone (journey checkpoint stashed out).

1. [x] **376.1 — lane 1 + lane 2 records.** Lane 1: the one dead attribute
       (`margin: 0` on the app-launch launcher heading, added by 373.5 after
       the last sweep) removed in `2ff4ca61`; the rescan reads 0 dead
       attributes and exactly Slice 345's 11 standing refusals. What the
       figure does not cover: the scan never emulates the dark theme — base
       rate measured 0 (no dead declaration changes verdict in dark), so no
       instrument change. Lane 2: the standing `flex:1 / min-inline-size:0 /
       overflow-wrap:anywhere` group DISSOLVED — `.bo-file-list__name` is now
       `flex: 1 1 12ch`, 373.1's measured 390px fix, guarded by a claim; the
       LOOPS.md table row says so and warns off re-standardizing. The count
       "eight" is gone from LOOPS.md and the report's header (a value in a
       playbook is the staleness this file keeps paying for).
2. [x] **P0 · 376.2 — `.bo-motion-collapse` keeps the bare `0fr` closed track
       that 52.2 fixed in the widget copy only.** A bare `0fr` track has an
       `auto` minimum, so a padded child leaves a stub (the dashboard copy
       measured 32px before 52.2 changed it to `minmax(0, 0fr)`). The utility
       ships the unfixed form (`motion/motion.css`), and LOOPS.md's Settled
       section called the three copies identical after they had diverged.
       - **Accept:** in a real browser, the utility's closed state with a
         padded child measures a non-zero stub before the fix and 0 after, in
         a `check:claims` case red-proved against the unfixed rule; the
         Settled section's correction stays accurate.
       - **DONE 2026-09-24 — and the fix found a second defect.** Reproduced on
         the shipped CSS: closed utility, 16px-padded child, 32px tall. Fixing
         only the closed side (`minmax(0, 0fr)` against a bare `1fr`) was
         measured to SNAP (0, 0, 0, 95) — the two do not interpolate — and that
         is the dashboard card's exact shipped form since 52.2, so its collapse
         has not animated for a month. Both now use `minmax(0, Nfr)` in both
         states. `check:claims` +2 (a padded motion collapse closes to 0 and
         animates; the dashboard card animates and closes to 0): red on the
         unfixed build (closed 32; intermediate frames 0), green after. Live at
         1440/390 light/dark: 74px -> 0 with 7 intermediate frames. The richtext
         copy keeps bare `0fr/1fr` — it zeroes its own padding, so it neither
         stubs nor snaps. Jev: supported 0.93 (A 0.95, B 0.94).
3. [x] **376.3 — lane 3 verdicts; the enumeration is 20.** Four newly flagged
       pages, each classified by whether the PROSE or the THING was wrong:
       `/patterns/kanban/` — HONEST COVERAGE (373.4's required focus section);
       one stale paragraph (110.7 in the future tense, linked to the unrelated
       `/patterns/staging`) removed in `2ff4ca61`. `/reference/acr/` — THE
       INSTRUMENT (89% generated rows). `/components/file-upload/` — THE
       INSTRUMENT (recipe fixed cost; authored prose 1.03x its family median).
       `/components/alerts/` — THE INSTRUMENT for the flag (373.3's measured
       in-flow region section); one false sentence ("the reason the earlier
       attempt failed", an attempt that never shipped) removed in `2ff4ca61`.
       LOOPS.md's enumeration amended in the same commit as these verdicts.
       Also measured: `report:prose` counts ApiTable's hand-written halves
       (the `js` cell, the `notes` list) as generated — richtext 492 words,
       data-table 434, file-upload 275 — and no verdict flips at this
       revision; recorded so the next flip is read with it in mind.
4. [x] **P0 · 376.4 — `initGroupedNumber` breaks the quantity/unit-select joint.**
       It inserts its generated hidden input directly after the field
       (`input.after(hidden)` in `grouped-number.ts`), so
       `.bo-quantity__input:has(+ .bo-quantity__unit-select)` (374.1's joint)
       no longer matches when a named quantity field also uses grouped
       numbers — the lane's synthetic measurement: joined radii 0/0 and no gap
       without the hidden input, 6px radii and an 8px gap with it.
       - **Accept:** reproduced on real framework markup in a browser, then
         fixed so the joint holds with and without `initGroupedNumber`,
         asserted in `check:claims` and red-proved.
       - **DONE 2026-09-24.** Reproduced on `/components/quantity/` (which
         loads the behaviour): a named, grouped field beside a unit-select
         measured 6px radii, a 1px edge and an 8px gap against the page's own
         ungrouped control's 0/0/0. Fixed in CSS rather than JS — the joint now
         also matches `+ [type="hidden"] + .bo-quantity__unit-select`, the
         convention `money.css` already keys on (`:not([type="hidden"])`), and
         it covers a server-rendered hidden input too; moving the hidden input
         in JS would have fixed only this one writer. `check:claims` +1, red on
         the unfixed build, green after; slice 374's joint claims still pass.
         Live at 1440/390 light/dark. Jev round 2: supported 0.89 (A 0.94, B1
         0.96, B2 0.93, B3 0.94); round 1 read 0.83 with B's halves unstated.
5. [ ] **376.5 — the app-launch launcher hand-rolls a dialog header.** A
       `form.bo-cluster` with inline padding plus an `<h2>` whose 18px comes
       from the docs chrome's `.demo h2`, which a consumer's page will not
       have — while `dialog.css` ships `.bo-dialog__header` / `__title`.
       Adopting them CHANGES rendering (a 1px bottom border, 16/24 padding,
       the md title size), so it is a decision, not a Standardize removal.
       - **Accept:** either the launcher uses the shipped parts, verified live,
         or the page records why a grid launcher's header differs. Refusing is
         a satisfying outcome.
       Milestone: M1 · Phase: 2
       Route: design
       After: 395.1
6. [x] **376.6 — lane 4 verdicts.** CLAUDE.md changed accumulate class —
       HONEST, cut by 375.2 (5,880 -> 3,227 words), 2 up since. ROADMAP.md:
       167.1's premise ("growth here is managed") has been false since
       2026-09-07 — no archive sweep since `3cb2381a`, 58,531 -> 150,288 words —
       so the sweep runs in this slice (376.8). RESUME.md: its INSTRUMENT
       premise ("rewritten every wake") no longer holds — since 2026-09-19 the
       handover has been PREPENDED, and the 2026-09-09 hand-off below has
       survived 7 commits byte for byte (43% of the file); recorded, not cut,
       because pruning the handover is the next hand-off's job.
7. [ ] **376.7 — the lane-4 ratchet counts any net shrink as a cut.**
       `report_loop_prose.py`'s `ups_since_last_cut` treats `cur < prev` as a
       cut, so a 52-word item close reads as ROADMAP.md's "last cut" while
       its real cut was 81 steps back; ENVIRONMENT.md's "cut" was 7 words.
       The block LOOPS.md says to read first is least trustworthy on exactly
       the files lane 4 exists for.
       - **Accept:** the ratchet distinguishes a real cut from noise (a named
         floor, argued), a replay reports ROADMAP.md's last real cut at the
         2026-09-07 sweep, and the change is red-proved.
       Parked: M1 — Standardize lane-4 machinery, not milestone work — revisit: the Standardize run at milestone close
8. [x] **376.8 — archive sweep, the twelfth: 40 closed slices moved.** Taken
       inside lane 4 because 167.1's premise had been false for 17 days and
       rule 4 says to run the sweep when it walks thousands of lines. Targets
       from `roadmap_scope.py` (51 eligible); the 11 named by a still-open item
       stay in place (236.2's pins: 338, 333, 364, 339, 351, 357, 324, 342,
       343, 366, 283). Moved fence-aware from HEAD's bytes, each section
       verified byte-identical in the archive by a second reader that locates
       it by heading text, each leaving the pointer line. Reconciled on raw
       counts both ways: live closed **145 -> 74** (72 moved; this entry is
       itself a new `[x]`), archive **730 -> 802**; open **32 -> 32**, the
       same ids name for name; slice headings live **358 -> 358**, archive
       **286 -> 326**; live lines **15,977 -> 9,314** at the committed
       revision (9,301 was the working copy before this entry was written —
       corrected by the 377 grill); closed-history share **56.7% -> 23.7%**. `check:slice-refs`
       passes (1,091 assertions, 358 slice numbers each heading one section).

## Slice 375 — owner-directed cleanup: the two-agent arrangement is retired, `CLAUDE.md` loses 45% to a reference file, and two defects are rescued from records that were about to become history (2026-09-22)

**Owner instruction:** reduce development overhead and inconsistent decisions
while preserving intended behaviour; and specifically, remove the instructions
designating a peer agent ("Codex") as development lead. Claude Code carries out
authorized development independently from here.

**The arrangement never reached the committed instruction surface.** `CLAUDE.md`,
`LOOPS.md`, `DESIGN.md`, `ROADMAP.md`, `STATUS.md`, `README.md` and
`ENVIRONMENT.md` contain zero references to it. There is no script, hook, agent
config, npm script, CI job, crontab or launchd entry for it: `.git/hooks` has no
non-sample files, `.claude/` has no agents/hooks/commands, and the 15-minute
`busy-office-ui-development-lead` heartbeat that two documents asserted has **no
definition anywhere on this machine**. Every directive lived in files that were
untracked or uncommitted, so the removal was a working-tree change.

### Items

1. [x] **375.1 — the arrangement's instructions are gone; its measurements are
       kept.** `codex-claude-roles.md` became `history-two-agent-2026-09.md`
       (role table, coordination protocol, await-assignment convention,
       ownership claims and asserted heartbeat removed; acceptance records kept
       verbatim under a header saying nothing in the file directs behaviour).
       `exchange/` (45 files) is now committed rather than untracked, with a
       README stating no file in it is a live assignment and no reply is
       expected — untracked is not preservation, and several measurements exist
       only there.
       - **Accept — met:** no file outside the history record and `exchange/`
         contains an instruction to await, acknowledge, or route work through a
         peer. The remaining references are attribution in dated evidence or a
         quoted external review naming several LLMs.

2. [x] **375.2 — `CLAUDE.md` 624 -> 334 lines by moving evidence, not rules.**
       373 of 624 lines were dated war stories in a file loaded into every
       session. The nine essays moved verbatim to
       `.roundtable/verification-discipline.md`; every rule stayed. Six stale
       figures corrected, four of them load-bearing arguments: "seven build
       gates" (56), "behavior tests" listed as a build gate (vitest is not in
       either build), "148 citations" (404), "131 findings" (206, and generated),
       the archive-sweep narrative ending at 1,094 lines (15,353 today), and a
       recipe path that does not resolve from the repo root.
       - **Accept — met:** 37,682 -> 20,869 bytes on the auto-loaded file, and
         every number in it either agrees with the gate that produces it or is
         left to that gate to print.

3. [x] **375.3 — dead weight, each verified rather than assumed.** The
       Containerfile's `apk add chromium` was justified by `check-boost`, which
       no longer exists; no step of either build drives a browser. Removing it
       is 738 MB of build stage and 42 s per cold build, measured, with the
       runtime image unchanged at 79.5 MB. `pixelmatch` and `pngjs` had no
       importer. An orphaned preview server (PID 5162, 1d12h) was bound to the
       SAME port as the Podman container on a different stack, so
       `localhost:8081` answered from either depending on IPv6 preference and
       the IPv4 answer was two commits stale — the prescribed stale-image
       defence cannot catch that, because it is a different server, not a stale
       layer.
       - **Accept — met:** builds green, and `:8081` has one listener.

4. [x] **375.4 — a class name inside a copyable sample is validated by
       nothing.** `check-markup` validates rendered `dist` HTML, but a class in
       a `<pre>` block is escaped text, so an invalid modifier in a recipe a
       user copies is invisible to it. This is how `bo-btn--primary` once
       shipped in a sample when `button.css` defines only `--danger`, `--ghost`,
       `--icon`, `--secondary`, `--sm`. That instance is gone (`grep` finds no
       occurrence in `apps/docs/src` or `examples/` today), so this is about the
       missing check, not a live defect.
       - **Accept — measure the base rate first (94.11).** Extract every
         `bo-*` class from every copyable block on the built site and check it
         against `api.json`'s generated class list. If the count of invalid
         classes is zero today the gate is ceremony and this closes with the
         count recorded; if it is not, the gate is worth writing. Finding zero
         is a satisfying outcome. Note the shape question before writing it:
         samples legitimately contain consumer-side classes that are not ours,
         so the predicate is "a `bo-`-prefixed class that `api.json` does not
         know", not "every class".
       - **DONE 2026-09-23 — the premise ("that instance is gone … not a live
         defect") was FALSE, so the gate was built.** Measured on the built
         site: 2,382 `bo-*` class tokens in 261 `<pre>` blocks across 169 HTML
         files; **1 unknown** — `class="bo-label"` in the form-field sample on
         `/concepts/accessibility/`, shipped since 2026-08-21 (`01d09528`, 33
         days). Corrected to `bo-form-field__label`; count 0.
       - `apps/docs/scripts/check-sample-classes.mjs` (`@heuristic`, 6-case
         self-test), in the docs build after `check-markup`. Red-proved: HEAD's
         `bo-label` put back into the built page → FAIL naming the page and
         class, exit 1; `check-markup` PASSES that same page. Docs-side rather
         than inside `check-markup`, which ships as a consumer bin whose users'
         samples are not ours to judge. Not covered, and stated in its header:
         classes built in script, and inline `<code>` fragments.
       - Gate count re-stamped 56/23 → 57/24 (READMEs, and `CLAUDE.md`'s
         hand-typed figure, which already read 22). Jev: supported 0.95
         (A 0.96, B 0.96, C 0.95).

5. [x] **375.5 — the direct Qty-to-Add pointer path is uncertified.** Rescued
       from the retired arrangement's records, where it was explicitly retained
       for triage and never folded into an assignment: a direct pointer click on
       Qty-to-Add was reported as missing because the focus-shown message changes
       the row height under the cursor. The checks that exist blur and settle
       before clicking, so they do not exercise that path.
       - **Accept — re-check the premise, it is another wake's measurement
         (158.2's rule).** Reproduce the click against the built site with a
         trusted pointer event at the original coordinates, or record that it
         does not reproduce and why. Either outcome closes it; what does not
         close it is a settled-then-clicked check, which is the thing already
         known to pass.
       - **CLOSED 2026-09-23 as REPRODUCED — and the stated mechanism is
         wrong.** Trusted CDP presses (puppeteer `mouse.down/up`) at `#eg-add`'s
         own centre, read with focus in the invalid Qty cell, against the
         `:8081` container's `/patterns/editable-grid/`: **0 of 6** added a line
         (3 at 1440, 3 at 390). mousedown hit `#eg-add` every time; mouseup hit
         a `P`/`CODE` below; `click` went to `SECTION.demo`, the nearest common
         ancestor. Control, blur first: **6 of 6**.
       - **Why, measured:** the row does NOT change height — 173.2 holds it.
         What moves is `.bo-data-table-container`, which shrinks **142px**
         focused → blurred while the message span itself is 28px: the
         `padding-block-end: calc(6lh + …)` reserve (data-table.css, 190.1)
         exists only while a cell message is shown. The press lands on Add;
         the mousedown blurs Qty; the reserve collapses; Add rises ~141px
         before mouseup. Filed as **375.9**. Jev: supported 0.89, corrected
         mechanism 0.96.

6. [x] **375.6 — CI rebuilds the whole project six times per run.**
       `.github/workflows/ci.yml`'s `docs-gates` is a 5-entry matrix whose steps
       run `npm ci`, the core build and the docs build **inside every shard**,
       and the `core` job builds again — so the core build's 24 steps run 6x and
       the docs build's 35 steps run 5x, with only the final `${{ matrix.run }}`
       line differing. The file records the bill at "~14.7 machine-minutes across
       6 parallel jobs (~3 min wall)". Reported rather than changed: the fix
       shape is build once and pass `dist` between jobs as an artifact, which
       cannot be verified locally.
       - **Accept:** the shards consume a built `dist` they did not build
         themselves, and the wall-clock and machine-minute figures in ci.yml's
         own comment are re-measured and updated to whatever the change actually
         produces — not predicted in advance.
       - **CLOSED 2026-09-23 as REFUSED, because re-measuring the premise
         refuted it.** The duplication is real — 5 shards each run `npm ci`,
         the core build and the docs build, and the `core` job builds again —
         but the BUILD half of it is not where the time goes. Measured cold
         (dist, `.astro` and the node astro cache all removed first): core
         build 6s, docs build 7s, 13s combined. So the duplicated build work is
         5 x 13 + 6 = **71s, 1.2 machine-minutes of the ~14.7 the file itself
         quotes — about 8%**. Building once and passing `dist` as an artifact
         saves ~0.9 machine-min before the upload and download cost is
         subtracted, which on a `dist` this size would eat much of it.
       - **The large duplication is `npm ci`, and it is already mitigated** by
         `actions/setup-node`'s `cache: npm` in every job. The fix this item
         proposed therefore targets the small half.
       - **And it could not be landed blind anyway**, which is the second
         reason to stop: shard 5 runs `npm run suite` and `check:quickstart`,
         which pack the local package and build the ERP suite rather than
         merely reading `dist`, so "consume a prebuilt dist" is not true of
         every shard. A wrong artifact wiring blocks all of CI, and this
         item's own Accept requires figures that only a real CI run produces.
       - **Limit of this measurement, stated rather than hidden:** it was taken
         on a developer machine with dependencies already installed, not on a
         cold CI runner. The build steps are CPU-bound (astro, postcss) so they
         should not differ by an order of magnitude, but the 8% is a local
         reading and the honest way to confirm it is the per-step timings in
         any real run's log. Reopen if those show the build dominating.

7. [x] **375.7 — three "Not when" cells on the decision page are
       content-free, and the page's own generated prose overclaims that they
       are not.** Found while verifying 373.2. `/concepts/which-pattern/`
       renders the bare words "Not for" — seven characters, no object — for
       Editable grid, RF task menu and RF task queue, while the generated
       sentence above the table says "39 state when not to use them".
       - **Cause is upstream and pre-existing**, not introduced by 373.2:
         `gen-patterns.mjs`'s `WRONG_CHOICE_RE` captures only the text INSIDE
         `<strong>`, and those three pages write `<strong>Not for</strong>`
         with the object after the tag. `check:wrong-choice` cannot see it —
         the clause is present, it is just empty of content, which is exactly
         the shape CLAUDE.md's 94.11 note describes: a gate can enforce that a
         clause EXISTS and cannot judge whether it says anything.
       - **Accept — write the property, not the fix.** Either the extraction
         takes the whole clause (so the three cells carry an object), or those
         three pages move the object inside the `<strong>`, or the generated
         sentence stops counting cells it cannot vouch for. Whichever lands,
         the count in the prose must be derived from the same field the cells
         render, so the two cannot disagree again. A cell whose clause is
         under ~12 characters is the cheap detector; measure how many exist
         before deciding it is worth a gate.
       - **DONE 2026-09-23 — the extraction takes the whole clause; no gate.**
         `extractWrongChoice` now runs on past `</strong>` to the first
         terminator unless the bold text already ended in punctuation.
         `patterns.json`: exactly the 3 named clauses changed, 36 of 39
         byte-identical. Built page: cells under 12 characters 3 → **0**,
         shortest legitimate clause 14 ("Not a launcher"). The prose count
         `withNot` and the cell both read `r.not`, so they share one field.
         **Gate refused on its base rate**: a <12-character predicate is true
         of 0 of 39 cells after the fix and could not fail on this tree.
         Self-test red-proved (disabling the branch fails the new case).
         **Found beside it:** the extended RF task menu clause ("general app
         launcher") substring-matched the "App launch" title and rendered a
         mid-word link replacing the reader's word; `linkAlternatives` now
         matches whole words. Measured: that was the ONLY substring hit — the
         linker links 0 of 39 cells today, which this item does not change.
         Jev completion review, round 2: supported 0.86 (A 0.95, B 0.94,
         C 0.89); round 1 read 0.77 without per-criterion evidence.

8. [x] **375.8 — the Jev threshold cannot discriminate where it is being asked
       to.** The completion review scored 373.3 at **0.81** against a
       provisional band of 0.85, on evidence where every Accept criterion had a
       direct measurement and one carried a self-run red-proof. The item was
       marked done on this repo's own rule — "do not let a band decide anything
       a check can decide" — but the episode is the finding: **an n=5
       validation set does not support a 0.04 distinction**, and a band that
       cannot be trusted at its own boundary will either be overridden (as here)
       or obeyed wrongly.
       - Observed so far, which is the seed of a larger set: supported cases
         have read 0.96, 0.92, 0.91; unsupported 0.20, 0.05, 0.03; and the
         genuinely-partial ones 0.84, 0.81, 0.79, 0.68, 0.65, 0.51, 0.35. The
         middle band is populated, which is what a useful detector looks like —
         it is the CUT that is unvalidated, not the signal.
       - **Accept — measure, do not tune.** Build the set to at least 20 cases
         drawn from this repo's own landed and refused items, each with a truth
         value established by measurement rather than by recollection, and
         report the separation. Then either the 0.85/0.35 cuts are justified by
         the data and stay, or they move to where the data puts them, or the
         review is reported as a three-way signal with no cut at all. Finding
         that no clean cut exists is a satisfying outcome and should be written
         down rather than papered over with a rounder number.
       - **The judge is framing-sensitive, measured 2026-09-23 and more
         serious than the cut.** The SAME evidence for 373.7 scored **0.25**
         when the payload opened by disclosing that an earlier review had
         scored 0.35, and **0.48** when that sentence was removed and nothing
         else changed. A 0.23 swing from a leading sentence is larger than the
         0.04 the band was being asked to resolve. So the review payload is
         part of the instrument: state the evidence, never the prior score, and
         never what verdict is hoped for. Add a pair of framing variants to the
         validation set so this is measured rather than remembered.
       - **Closed 2026-09-23 with 20 cases, and the answer is that NO CLEAN CUT
         EXISTS — which the Accept named as a satisfying outcome.** The set was
         drawn from this repo's own landed and refused work, each truth value
         established by measurement. Evidence-supports: min 0.81, median 0.95,
         max 0.97. Evidence-does-not: min 0.03, median 0.24, max 0.81. **A true
         case and a false case both landed on exactly 0.81**, so the ranges
         overlap and no threshold separates them.
       - **What the cut buys is an asymmetry, and 0.85 buys the right one:**
         0 false positives and 1 false negative, against 1 false positive and 0
         false negatives at any cut of 0.80 or below. A false positive claims
         completion on evidence that does not support it, which is what the
         review exists to prevent; a false negative costs one more measurement.
         So 0.85 stays, now on evidence rather than on margin, and the band's
         job is understood: it never wrongly says yes, and a reading between
         0.35 and 0.85 is an instruction to go measure, not a verdict.
       - **The two cases at 0.81 are the useful ones.** The TRUE one claimed
         "every rule was restated" and offered byte counts — real, but they
         cannot evidence a claim about CONTENT. The FALSE one claimed "only one
         thing remains" on evidence that established six criteria passing and
         said nothing about what else was open. Both are claims outrunning
         their evidence, which is exactly what the middle band is for.
       - The framing variant is recorded rather than re-measured here: the same
         evidence scored 0.25 with a leading prior-score sentence and 0.48
         without it, a 0.23 swing, so `jev-rubrics.md` forbids putting a prior
         score or a hoped-for verdict in a payload.

9. [x] **P0 · 375.9 — any control below a grid loses its first click while a
       cell's error message is shown.** Reproduced by 375.5 (0 of 6 trusted
       presses on the editable-grid demo's "+ Add line" landed). The cause is
       the container's reserve padding (`.bo-data-table-container:has(… :focus-within
       .bo-form-field__message)`, data-table.css) appearing on focus and
       vanishing on blur: the mousedown that blurs the cell moves everything
       beneath the table ~141px before the mouseup. It is framework CSS, so
       every consumer's grid carries it, and the user sees a press that did
       nothing.
       - **Accept:** a trusted pointer press (down and up at the target's
         centre, read while an invalid cell has focus) on a control below the
         grid activates it, at 1440 and 390, on the demo AND on a copy of the
         canonical markup — asserted in `check:claims` with real mouse events,
         red-proved by restoring the collapse. 173.2's property still holds
         (row height unchanged by a message) and so does 190.1's (a six-line
         message is not clipped by the container). Which shape removes the
         shift is the builder's call and is argued in the item, not assumed.
       - **DONE 2026-09-24 — nothing resizes on focus or blur any more.**
         The shape, argued: the reserve existed only because
         `.bo-data-table-container` is `overflow: auto` and clips an
         out-of-flow message, so either the room is permanent or the message
         leaves the clip. Where anchor positioning exists (Chrome 129+,
         Firefox 147+, Safari 26+) it leaves: the message is `position: fixed`,
         anchored to its field, with a minimum width and flip fallbacks so a
         right-hand column or a dialog does not squeeze it into a sliver
         over its own field. Elsewhere the reserve is STATIC on any grid whose
         body has an editable control. The open `.bo-dialog` / `.bo-offcanvas`
         now rest at `transform`/`translate: none`, because any transform —
         the identity included — made them the containing block that trapped
         the fixed message.
       - **Refused on measurement, so a later wake does not re-propose them:**
         a delay or `:active` latch on the collapse (postpones the jump, needs
         caveats per engine, and a press inside an iframe is invisible to
         `:active`); a reserve that follows the error (moves the toggle to the
         422 re-render, which lands mid-press — 10 of 16 lost); padding plus a
         negative margin (feeds ancestor scroll overflow); a static reserve
         everywhere (a permanent 142px band under every editable grid); and
         `pointer-events: none` on the floated message, which fired the row's
         hidden Remove button when the visible text was pressed. The message
         keeps catching presses: pressing it dismisses it.
       - Measured: `check:claims` +14 cases (real 60/900ms presses at 1440 and
         390 on the demo and on a pasted copy of the canonical markup; a
         counterfactual that re-injects the old reserve and must lose the
         press; nothing moves on focus/blur and the row keeps its height
         (173.2); a long message paints at every sample point (190.1, vertical
         fit holds in both modes); dialog/offcanvas rest at `none`), each
         red-proved by injection. Corpus sweep, 135 pages, 2834 valid targets:
         0 of 4944 presses lost (baseline control lost 92 of 358).
         Chrome 153 + WebKit 26.6: 0 hidden controls activated; every lost
         press is one on a control the visible message covers.
       - Not covered, filed as 375.11: Firefox unverified; fallback + classic
         scrollbars + a long message from a non-first column still toggles a
         horizontal scrollbar (the 196.1 residual); frozen-column cells paint
         over the message (pre-existing); 400% zoom on a 320x256 viewport
         partly covers the focused field (12/18 points, never entirely).
       - Jev completion review, two rounds (the limit): per criterion A 0.92,
         B 0.94, C 0.92, D 0.87; the overall "every criterion met" read 0.82
         both rounds, in the middle band — it tracks the not-covered list
         above, which is outside this item's Accept and is 375.11.

10. [x] **P0 · 375.10 — a real mouse or touch press on a combobox option never
       commits it; only the keyboard works.** Found by 375.9's attack
       workflow (side lens, unpatched CSS). `combobox.ts`'s `focusout`
       handler closes the listbox at mousedown (focus goes to BODY, the
       grid container or the dialog), so the click lands on a common
       ancestor: 0 of 10 trusted presses committed on `/components/combobox/`
       and inside `/patterns/editable-grid/` (60/0/900ms, touch), while
       `element.click()` commits. On `/patterns/command-bar/` the same press
       also CLOSES the palette (the click lands on the `<dialog>` and its
       backdrop handler fires). Nothing catches it: the vitest cases use
       `element.click()` and jsdom does not move focus on mousedown;
       `check:claims` drives only the keyboard.
       - **Accept:** a trusted mouse press and a touch tap on an option commit
         it (`bo:combobox-select` fires, the input holds the option's label)
         on `/components/combobox/`, inside `#eg-table` on
         `/patterns/editable-grid/`, and on `/patterns/command-bar/` (where
         the palette stays open until the commit) — asserted in
         `check:claims` with real pointer input and red-proved against
         today's build. The fix shape is the builder's, argued in the item;
         the attack's simulation of a capture-phase `mousedown`
         `preventDefault()` on enabled options committed 11 of 11. Also
         settle whether `/components/money`'s currency combobox demo is
         meant to be live (it never calls `initCombobox`).
       - **DONE 2026-09-24.** `combobox.ts` cancels `mousedown` on an enabled
         option of a listbox that has an input — the APG pattern — so focus
         never leaves the input and the existing click handler commits; the
         listbox's padding and scrollbar are left alone. `check:claims` +4
         real-pointer cases (mouse and touch on `/components/combobox`, the
         editable-grid cell, the command bar inside its dialog): all four
         FAILED on the pre-fix build with the option under the pointer and
         `bo:combobox-select` never firing, and pass now. The attack's
         11-scenario reproduction reads 11/11 committed (was 0/10). The
         command bar commits, THEN its own select handler closes it. A vitest
         case pins the contract (cancelled on an enabled option only) and
         failed before the fix; jsdom cannot move focus on mousedown, so the
         browser cases carry the behaviour.
       - **The money demo is meant to be live** — its caption states "the list
         stays shut until you type" and the sample carries no script — so
         the page now calls `initCombobox()`, with two claims (shut on focus,
         opens filtered on the first keystroke; a real press commits),
         red-proved by stripping the call from the built script.
       - Jev completion review: supported 0.92 (A 0.95, B 0.87, C 0.94).

11. [ ] **375.11 — what 375.9 measured and did not fix.** Each is recorded
       rather than silently accepted; each wants a measurement or a
       decision, not necessarily a change.
       - **Firefox is unverified** for both the anchored mode and the static
         fallback — Playwright Firefox would not launch in this environment.
       - **Fallback browsers + classic scrollbars:** a long message from a
         field away from the container's inline start overflows it and
         toggles its horizontal scrollbar only while focused — 15px of
         movement and a lost press, 196.1's accepted residual now on a
         press path. Needs classic-scrollbar measurement (every browser gate
         runs with scrollbars hidden, so none of them can see this class).
       - **Frozen-column cells:** the message is painted under later rows'
         sticky cells and sticky totals (8/160 in first-row frozen cells),
         identical before and after 375.9.
       - **A loading table** (`opacity` on `[data-loading]`) traps the
         message's z-index; 6 of 2834 corpus targets.
       - **400% zoom on a 320x256 viewport:** the message partly covers its
         focused field (12 of 18 sample points; never entirely).
       - **Accept:** each is measured in the environment that can see it and
         either fixed, or closed with the measurement and the reason it is
         accepted.
       - **PARTIAL 2026-09-25 — three of five fixed; the item stays open on
         the other two.** Measured by a four-lens workflow, each lens followed
         by an independent skeptic who re-measured and tried to refute it (all
         four verdicts survived; three proposed fixes were amended by the
         skeptic). Scripts: session scratchpad `r375/`, not in the repo.
         - FIXED — frozen cells: 72/72 case-runs buried the message; the frozen
           cell holding the focused field now sits one step above its peers,
           scoped to the cells the file makes sticky (the broad selector
           trapped consumer `position: relative` cells, 160 -> 80 of 160).
         - FIXED — loading table: `opacity: 0; pointer-events: none` while
           loading (not `display: none`, which replayed the entrance animation
           and dropped the alert from the AX tree), plus `pointer-events: auto`
           on a shown message, which also closes the htmx bridge's
           pass-through (6/6 -> 0/6).
         - FIXED — classic scrollbars: measured in Chrome 124 (no anchor
           positioning) with classic scrollbars — 18/42 toggles and a lost
           press at HEAD, 0/42 with `overflow-x: scroll` on the fallback
           reserve. Cost recorded in the CSS: an empty track in those browsers,
           which cannot reveal the clipped message.
         - `check:claims` +7 (freeze + real hit-test at 1440/390 with a
           counterfactual; loading, restore and htmx-bridge at 390; the
           fallback shape). Red-proved: the four rules stripped from the built
           CSS fail exactly the 5 fix claims; counterfactuals and 300 others
           pass. Jev (Rubric 2): 0.95 / 0.89 / 0.96; "closable" 0.73 —
           UNVERIFIED, correctly, since two residuals remain.
         - STILL OPEN — **Firefox**: Playwright Firefox 155 (firefox-1543)
           exits "Could not find profile folder" on Darwin 27.2, sandboxed or
           not, launched directly too. Needs another machine or a stock
           Firefox install. **NEEDS-RUNTIME** (triaged 2026-09-26, from the
           398.5 re-score's NI-5): this was the item's only open half and it
           had no marker, so STATUS.md and rule 4 kept computing 375.11 as the
           oldest dispatchable item, which no wake on this machine can finish.
           The owner's action is a stock Firefox (`brew install --cask
           firefox`, `.roundtable/owner-recs-2026-09-26.md`). Lift the marker
           once a launch succeeds.
         - **FIXED 2026-09-25 — 400% zoom** (the half below). A design panel
           (G2 refined vs R2), a judge re-measuring both over 6 layouts x 6
           lengths x 5 positions x Tab/click, and an adversarial verifier.
           Landed: R2 — both full-width fallbacks capped to the LARGER room
           on either side, with a `- max(2rem, 40px)` scrollbar allowance on
           the option tried last and `box-sizing: border-box` on the message
           (the verifier's two fixes: `- 2rem` alone failed at 17px scrollbars
           or a 12px root; without border-box nothing changed, 39/180).
           Entirely covered: 0 of 360 (HEAD 88). `check:claims` +2: the
           approve dialog at 320x256 DPR 4, 303 characters, 5 positions — 0
           entirely covered; the old fallback list put back covers 4 of 5.
           Claims 317, axe, layout, 175 tests green; live at 1440/390 x
           light/dark (no change there) and 320x256. Size budget +0.1 kB.
           Jev: 0.94 / 0.92. **Residual, recorded:** classic scrollbars of
           21px or more (15/65 at 24px in a dialog); near-fit Tab stops that
           scroll only padding at 568x320 / 640x360 (10-17 of 738).
         - STILL OPEN, PREMISE CORRECTED (history) — **400% zoom** is not "never
           entirely": the 303-character message covers its field ENTIRELY
           (18/18) in the approve dialog at 320x256, and at 9 of 25 scrolled
           positions on the demo with 433 characters, so this fails WCAG
           2.4.11 (AA), not only 2.4.12. The proposed last-resort
           `@position-try` (capped, scrolling) was refused: it clips an
           unbreakable token and adds a Tab stop at 100% zoom, leaves 0.4-1.7
           line slivers near the top, and creates new partial covering. The
           skeptic's variant (capped below/span-all with `min(5lh,100%)` and
           `min(3lh,100%)` floors, `overflow-wrap: anywhere`) cleared its matrix
           but is ungrilled.
        Track: defect

## Slice 374 — the joined-control seam was spelled against the AUTHORED markup, not the RENDERED DOM: three trailing children defeat `:last-child`, the framework's own canonical quantity markup is one of them, and the defect shipped on **3 pages / 5 rendered views** while a gate that visits those exact elements measured only their focus rings (2026-09-22)

**Found by the owner, from a screenshot.** The `+` stepper on
`/components/quantity/`'s grouped demo renders as a pill notched into a square
field. `.bo-quantity__step:last-child` was the only rule squaring its inner
corners, and the `+` is not the last child — so it matched nothing and kept all
four `.bo-btn` corners at 6px, where 0/6/6/0 is correct.

**THREE different trailing children cause it, and only one is the one that was
blamed.** The sibling money fix (uncommitted, same window) attributed this
class to `initGroupedNumber()`'s generated hidden input and fixed money with
`:nth-child(1 of :not([type="hidden"]))`. Ported to quantity that blocklist
fixes **one of the three** instances:

| page | trailing children after the `+` | hidden input? |
|---|---|---|
| `/components/quantity/` grouped demo | `input[type=hidden]`, `__unit`, `.bo-visually-hidden` | yes |
| `/patterns/rf/rf-pick-rf/` | `__unit`, `.bo-visually-hidden` | **no** |
| `/patterns/rf/goods-receipt-rf/` | `__unit` | **no** |

Two of the three carry no `data-grouped` and no `name`, so no hidden input
exists on them at all. The real predicate is *"the trailing step is not the
last child"*, and the `__unit` span alone is sufficient — a span this
component's own canonical `Markup` block puts there
(`quantity.astro:143-146`).

**A correction to the sibling fix's stated mechanism, which is why the two
files needed different answers.** `money.css` said `initGroupedNumber()`
*"APPENDS"* a hidden input. It does not: `grouped-number.ts:161` is
`input.after(hidden)` — inserted immediately after the VISIBLE input, wherever
that sits. In money the amount happens to be last, so it lands last and the
description was accidentally true. In `.bo-quantity` it lands at index 2 of 6,
**between** the input and the `+`. Corrected in the file.

**The base rate, measured rather than assumed** (33 rendered instances across
every page of the built site that carries either component, `querySelectorAll`
not grep — 15 served pages match the string, only 7 render an element):
**5 of 33 defective, all the same defect, all in quantity.** Every welded seam
in the framework measures 0 or −1px; there are no odd gaps. Six joined controls
exist (`.bo-money`, `.bo-quantity`, `.bo-btn-group`, `.bo-btn-group--bar`,
`.bo-richtext`, `.bo-tabs`); `.bo-segmented`, `.bo-tag-input`, `.bo-pagination`,
`.bo-stepper`, `.bo-date` and a standalone `.bo-combobox` were measured and
ruled out as not welded.

**Three candidate selectors were measured against every instance, not reasoned
about.** Ground truth was computed geometrically and independently of any
selector (a child is a segment if it — or its nested `.bo-input` — has
border-width > 0 and width > 0; two consecutive segments are welded if their
rects gap ≤ 0.5px), then each candidate was run as `querySelectorAll` AND
injected as an unlayered `<style>` with the resulting computed radius read
back:

- **adjacency** (`:has(~ .bo-quantity__input)` / `.bo-quantity__input ~ …`) —
  9/9 stepper cases, 11/11 stepper-less, 4/4 synthetic single-stepper, correct
  in RTL. **Chosen.**
- **typed nth** (`:nth-child(1 of .bo-quantity__step)`) — fixes the bug, but
  with a single stepper both rules select the same button and square all four
  of its corners (0/0/0/0 on 4 of 4 probes, LTR and RTL). Latent, and it
  mis-draws rather than failing soft, which this file's own unit-select comment
  rules out.
- **money's blocklist, ported** — **regresses six controls that ship today**.
  In a button-less composition both rules land on the bare `.bo-quantity__input`:
  `/components/quantity/` instances 2, 4, 8, 9, 10 and `/patterns/rf/rf-count-rf/`
  all go 6/6/6/6 → 0/0/0/0. Named by a before/after diff, not predicted.

**The gate that should have caught it was standing on the elements.**
`check-claims.mjs` already walked `.bo-money` and `.bo-quantity` segment pairs
live — and asserted only that a focused segment's ring stays off its neighbour.
Radius and border-colour were both invisible to it, to `check:contrast` (which
compares token PAIRS, not two elements' agreement) and to `check:layout` (which
looks for overflow). Extended in 374.2.

### Items

1. [x] **374.1 — the quantity joint keys off ADJACENCY to the input, not
       position in the parent.** `.bo-quantity__step:first-child` /
       `:last-child` → `.bo-quantity > .bo-quantity__step:has(~ .bo-quantity__input)`
       / `.bo-quantity > .bo-quantity__input ~ .bo-quantity__step`. General
       sibling, so the injected hidden input and both authored trailing spans
       are stepped over without enumerating them; specificity (0,3,0) clears
       the base `.bo-btn` rules with no `!important`.
       - **Accept — met.** Every `.bo-quantity` on the built site reports the
         interior corners its geometry says it should, in both themes, and
         `check:claims` agrees (374.2 is the instrument, so this is not
         self-attested). The three previously-defective views measure 0/6/6/0
         where they measured 6/6/6/6.

2. [x] **374.2 — `check:claims` asserts the two properties that define a seam,
       on the pairs it was already visiting.** (A) an interior corner of a
       welded control is square; (B) every segment of one welded control draws
       the same `border-top-color`. Both in light and dark, with three
       cross-cutting checks behind them: the two theme runs rendered different
       `bodyBg`, every `.bo-combobox` segment resolved to its nested
       `.bo-input` (and money exercised that path), and the settle outlasts the
       live transition.
       - **Accept — met, red-proved by injection with the injection confirmed
         in the COMPUTED STYLE before the verdict was believed.** (A) injected
         a 6px end-radius → red on 8 of 8 money seams; a separate injection on
         the combobox's NESTED input → red, which is what proves the resolver
         rather than the wrapper. (B) injected `border-strong` onto the
         steppers → red with the real token pairs, and the dark run reported
         DIFFERENT values from light, which is itself the evidence the two runs
         are not one run duplicated. Base rate before any injection was **1 of
         20 already failing** on (A) and 20 of 20 passing on (B) — so (A) was
         not vacuous, and (B) is 100% only because 374.1's sibling fix had just
         landed, which is what a gate is for.
       - **Settle, not rAF — measured as a ladder, because this is the hazard
         that produced a false "all 12 mismatch" earlier in the same window.**
         `.bo-input` transitions `border-color` (100ms) and `.bo-select` /
         `.bo-btn` do not, so a read taken during a theme flip catches the
         input mid-interpolation: +0/8/16/33/50/80ms all report 7 of 7 groups
         mismatched, +120/300/600ms report 0, and the +50ms sample reads
         rgb(145,152,164) against rgb(156,163,175) — an interpolated value, not
         a token, which is the tell. A double rAF lands at ~16ms, so this
         file's usual settle idiom is the wrong one here. The 600ms literal is
         not trusted: a check compares it against the duration read off the
         live element, so raising `--bo-motion-duration-fast` goes red rather
         than quietly under-settling.
       - **No new `@heuristic` obligation.** `check:selftests` tags a FILE, not
         a check, and `check-claims.mjs`'s existing `@exact` still holds: every
         verdict here is a number compared in a real browser. The one
         judgement-shaped term is the weld window (gap ∈ [−3, 0.5]), a
         membership test against measured geometry. `where` (the demo heading)
         IS a positional recognition and is diagnostic only — printed in the
         FAIL detail, never in a boolean.

3. [x] **374.3 — what else is in this class, and the one that is NOT a
       defect.** Two records, both measured, so neither is re-derived a third
       time:
       - **`.bo-btn-group--bar`'s filled segment is correct — refused.** A
         primary computes `border-color: transparent` beside
         `.bo-btn--secondary`'s border-strong, which reads as a border-colour
         disagreement in computed style and paints nothing extra: a 1px-row
         pixel scan across that seam on `/patterns/approval/` reads white →
         rgb(15,118,110) with **zero** pixels of rgb(209,213,219), while the
         same scanner DOES see them at both seams of `/components/button/`'s
         all-secondary group — so the absence is a real absence, not a dead
         detector. `background-clip: border-box` means the accent fill paints
         under its own transparent border. That edge is the better-contrasted
         one (5.47:1 vs border-strong's 1.47:1), and forced-colors gives every
         segment `ButtonText` anyway. This is why 374.2 scopes (B) to
         money/quantity: widening it would need an exemption covering a whole
         modifier, and a predicate that is mostly exempt is ceremony.
       - **Money's fix is a BLOCKLIST, and holds only while every `.bo-money`
         child is a welded part.** True of all 12 rendered instances — there is
         no money composition on the site with a trailing non-welded child. Not
         guaranteed: injecting the compositions quantity already ships (a
         trailing `.bo-visually-hidden`, a trailing note span) reproduces the
         identical 6/6/6/6 defect, and a currency-less money field renders
         0/0/0/0. Left as a blocklist deliberately — the hardened allowlist
         measured 15/15 including those three probes but subsumes two more
         rules, and money's joint must stay order-agnostic (currency leads in
         en-US, trails in de-DE), so it is a larger change than a live defect
         warrants.
       - **Accept — met:** the refusal and the latency are both recorded next
         to the rules they explain, with the command or measurement that
         produced each.

4. [ ] **374.4 — `.bo-btn--secondary` standing alone is identified almost
       entirely by a 1.47:1 border, the contrast gate structurally cannot see
       it, and the published ACR says it can.** Surfaced by 374.1's sibling
       fix, which converged the quantity steppers onto `border-control`
       *because* border-strong would drop a segment below 3:1 — and then scoped
       that to the group, leaving the general case where it was. Three parts,
       and the first is a correctness defect rather than a design question:
       - `extract-acr.mjs:159-162` publishes 1.4.11 as **Supports**, remarking
         that non-text pairs *"(borders, focus rings, icon fills) are included
         in the same contrast.json gate as text pairs — not a separate, weaker
         check."* `PAIRS` has three `--bo-color-border-control` rows and **zero**
         `--bo-color-border-strong` rows, and `check-contrast.mjs:232` binds
         `fg` only when `d.prop === 'color'`, so the coverage guard cannot see
         a `border-color` declaration at all. A derived artefact deciding on
         its own what it failed to see, which is the rule this repo paid for.
       - Measured: `.bo-btn--secondary`'s fill is bg-surface, so it is
         **1.00–1.17:1** against every surface it sits on across the built site
         (navbar, card, widget, app-shell main, sidebar, dialog footer, alert,
         form-section) in both themes. The fill identifies nothing; the border
         at 1.34–1.90:1 is the only non-text identifier — precisely the
         condition `color.css:29-31` already names. **1,252 rendered instances
         across 123 of 139 pages.** `.bo-file-input::file-selector-button` and
         `.bo-file-dropzone` (1px dashed border-strong on bg-muted = 1.34:1
         light / 1.45:1 dark, shipped in 373.1) share the recipe; the dropzone
         is the clearest case, since its own comment says the border *"is what
         makes the box droppable at all"*.
       - The strongest case it is NOT a defect was looked for and is not on
         record: nothing in ROADMAP, ROADMAP-archive, DESIGN.md, `.roundtable/`,
         `button.css` or `/concepts/accessibility` argues that a button's label
         carries identification in place of its border. `border-strong` has
         zero hits in ROADMAP.md, DESIGN.md and all of `.roundtable/`.
       - **Accept — write the property, not the verdict.** Every
         `--bo-color-border-strong` site that paints an INTERACTIVE control's
         boundary either clears 3:1 against the surface it sits on as
         `check:contrast` computes it, or records a one-line reason it should
         not. Finding some of them fine is a satisfying outcome. Do the
         dropzone first. Before adding the `PAIRS` rows, **measure the base
         rate** — no brand preset overrides the token (0 hits across all six),
         so a row goes red identically in 14 places (2 base + 12 brand×theme),
         which is honest rather than noisy, but it is a token re-value and
         therefore an owner call. **Put to Jev under decision rubric v1
         (2026-09-22) and it escalated**: split-the-token 0.61 / repoint-the-three
         -sites 0.32 at confidence **0.54**, under the 0.8 route threshold, so the
         choice stays with the owner — where this item already placed it. One
         answer was usable: documenting that the label identifies the button and
         exempting it would CONFLICT with the accepted decisions (0.90), because
         `color.css` reserves the 3:1 token for "when the border is the only
         affordance" and nothing in the repo argues the label substitutes. So
         refusal-by-documentation is off the table; what remains is which token
         shape, and that is a visual-weight preference.
         Separating the decorative uses (kbd, filter
         chips, blockquote, data-table outline) onto their own token is one way
         out; `border-control` for everything flattens the input/button
         hierarchy `color.css:29-31` deliberately built.
       - **OWNER CALL — which token shape** (split the token, or repoint the
         three sites), as the Jev escalation above left it. The ACR half,
         which publishes 1.4.11 as Supports, is covered by 377.8. The marker
         was added by 393.3 on 2026-09-25. Before that the item carried none,
         so the backlog mirror listed it as dispatchable.

5. [x] **374.5 — `./css` resolves to the UNMINIFIED bundle, so this repo's
       write-the-reasoning-inline doctrine is payload a consumer downloads.**
       Surfaced by 374.1: the seam fix's comments broke `check:size`.
       `css/index.css` measured 93.69 kB gz at HEAD, 97.24 with the tree's
       then-uncommitted work — **61 bytes** under a 97.3 budget — and 97.71
       with the fix's explanation. The budget row was re-based to 107.5 on the
       table's own stated convention (current + ~10%) with the reason recorded
       in `check-size.mjs`, rather than trimming a fix's rationale to fit; this
       item holds the question that raise defers.
       - Note the asymmetry: `index.min.css` is 15.15/16.7 kB and a comment
         cannot move it, and the minified figure is what `stamp-readme`
         publishes. Only the default export pays.
       - **Accept:** either `./css` resolves to the minified artifact and
         `./css/src` (or similar) keeps the annotated one, or the budget's
         header states outright that this row is a comment budget as well as a
         code one and what that is worth. Deciding it is fine as it stands, with
         the reason written down, closes this.
       - **Closed 2026-09-23, by measuring rather than arguing.** index.css was
         99.5 kB gz against index.min.css 15.4; stripping comments alone lands
         at 17.1, so comments were **80.5 kB gz, 98% of the gap**, and
         minification only 1.6. The build now strips them when emitting dist:
         index.css 99.5 -> 16.7, rf-essentials 45.7 -> 8.2, whole shipped
         payload **401.1 -> 185.8 kB gz**. No export path moved. `src/css` is
         untouched — the doctrine was always about source.
       - **The blanket strip was wrong and `check:deprecated-icons` caught it**,
         failing with "found no deprecated glyphs in the shipped css to check".
         It reads icon.css's four DEPRECATED blocks out of the SHIPPED artifact
         on purpose: they are user-facing contract, not internal reasoning. The
         rule became the CSS bang-comment convention — ordinary comments go,
         bang comments stay — and anything that must reach dist now says so.
         Five budget rows that existed to protect prose were re-based, including
         the 97.3 -> 107.5 raise made the day before, recorded in place as
         overturned. Completion review 0.85; regression risk 0.97.

6. [x] **374.6 — the published conformance report overclaims in four rows, and
       - **CORRECTION 2026-09-24 (377 grill):** its "audited all 21 criteria" and "21 rows" were counted on a working tree carrying the then-uncommitted 2.5.7 row; `extract-acr.mjs` as committed in `1816d366` held **20** criteria, and clean builds carried 20 until `5d0146f5` landed the 21st.
       the rows that are wrong are exactly the ones that interpolate nothing.**
       Audited all 21 criteria in `extract-acr.mjs` against the gate each one
       names. Four overclaim, one is an unbacked Supports, and the rest verify
       true — so it is a class, not a slip.
       - **The structural cause, which is the finding.** Where a remark pulls a
         live number or calls `cite()`, the build fails on it and it is right.
         Where it is a bare string literal — 1.4.11, 1.4.1's "automated proof",
         4.1.2's `aria-sort`, 3.2.1 — nothing can fail, and three of those four
         were wrong. The file's own header says the evidence is "pulled live …
         so the report can't quietly go stale"; that doctrine was applied in
         the places it was applied, and absent in the places it was not. Every
         row corrected here now interpolates.
       - **The forced-colors count was 23 and the truth is 18.** A substring
         scan, `.includes('forced-colors')`, counted five components that match
         only in a COMMENT — and `date/date.css` is the inversion that gives it
         away: the sentence it matched on says the block has "no forced-colors
         rule". The deleted comment named the exact hazard ("the @media block
         is easy to lose in a string scan") and then used a string scan anyway.
         `extract-api.mjs` already PARSES this correctly, so `/concepts/
         accessibility` published 18 while `/reference/acr` published 23 — two
         pages, one fact, different answers. Fixed by deleting the second
         mechanism, not by patching its regex.
       - **The reconciliation that replaced it failed its own red-proof first,
         and that is worth recording.** The first version compared the list
         against `api.components[*].forcedColors` — the thing it is built
         from — so it agreed with itself by construction and a flipped flag
         produced a PASS. Re-derived from the stylesheets instead. Red-proved
         three ways: a wrong flag in `api.json` → red; a real `@media` rule in
         a stylesheet the mirror has not seen → red; a comment mentioning
         forced-colors → green, which is the negative control proving it is not
         the old substring bug.
       - **1.4.11 and 2.4.7 → `Partially Supports`**, a recognised VPAT 2.x
         level this file had never used. `Conditional-on-adopter` would have
         blamed the adopter for a gap in our own token values and our own gate;
         `Not Evaluated` would have discarded evidence that does run every
         build. Both rows now name the ungated part and say what returns them
         to Supports. 2.4.7 carries a LIVE miss, not just a structural one: the
         ring reads 2.99:1 on bg-muted under brand-forest light, where
         `.bo-segmented` draws it.
       - **4.1.2 named `aria-sort` as evidence while a green gate asserts the
         opposite** — `check-claims.mjs` presses Enter on the sort header and
         confirms the attribute does not move. It also quoted the behaviour
         TOTAL as if it were the ARIA-syncing subset (26 for 10). Now derived
         from source, with the denominator reconciled against
         `behaviors.json` — the first run of that scan drew from all 31 modules
         under `src/js` rather than the 26 behaviours and pulled in
         `reveal.ts`, which would have put two populations in one fraction, in
         the fix for a row being corrected for exactly that.
       - **1.4.3 understated itself sevenfold** — "both themes plus the brand
         preset" counted `contrast.themes` only (74) while 444 brand readings
         were computed and quoted by nothing, and "the brand preset" was
         singular about six. Both now derived, with the 4.5/3.0 split spelled
         so "74/74 pass AA" cannot be read as 74 readings at 4.5.
       - **3.2.1 → `Not Evaluated`.** It reads true on inspection but names no
         gate, and this file's own methodology line says a row with no
         automated evidence is Not Evaluated, never inferred as Supports.
         Applied to the row rather than exempted.
       - **`acr.astro`'s summary was a mirror that could under-report.** It
         hardcoded three verdict badges, so a fourth rendered in the table and
         was invisible in the count above it, and an unmapped verdict
         interpolated to `class="bo-badge undefined"` — silently unstyled. Now
         derived from the rows, with a build-time throw on either failure.
       - **Accept — met:** every corrected row's numbers are interpolated from
         `dist/*.json` or derived from source, so the build fails when they
         drift; verified live at 1440 and 390 in both themes (21 rows, summary
         accounts for all 21, no unstyled badge).

7. [x] **374.7 — `check:contrast`'s coverage guard cannot see an edge, and the
       base rate says a gate would earn its keep.** The mechanism is 374.4's:
       `check-contrast.mjs` binds `fg` only on `d.prop === 'color'`, so a
       `border-color` declaration matches none of its branches and the three
       `border-control` rows are hand-maintained with nothing noticing a fourth.
       - **Base rate, measured before proposing the gate (94.11's rule).** Of
         the 78 token-resolving boundary declarations in the component tree,
         **7 of 36 INTERACTIVE ones are below 3:1 (19%)** — not ceremony, not a
         blanket verdict. The classification is load-bearing rather than
         decoration: container is 21 of 22 below and decorative 16 of 20, so
         the same gate written WITHOUT the interactive filter would be 44 of 78
         — an opinion about `--bo-color-border-default` delivered 44 times.
       - **Four of the seven are not on record anywhere** and are this item's
         actual content: `.bo-segmented`'s track at **1.13:1** (the worst in
         the interactive set), `.bo-chip` at 1.34, the dropzone's
         `[data-dragover]` accent at **2.26 in dark** across all six presets,
         and `.bo-data-table tbody tr:hover` at 1.34 — that last one being the
         strongest case, because `bg-hover` and `bg-muted` are the same value,
         so on a striped row that outline is the ONLY hover channel there is.
       - **A gate cannot tell an interactive boundary from a decorative one.**
         `--bo-color-border-strong` at 1.34:1 is `.bo-kbd`'s keycap edge and
         `.bo-btn--secondary`'s control boundary — same token, same ratio,
         opposite verdicts. So the enforceable property is a SHAPE, exactly
         `check:wrong-choice`'s bargain: every edge pairing is in `PAIRS` at
         3:1, or in an exemption map with a reason NAMING the other channel
         that identifies the control, or in a TODO list as debt. What the
         reason says stays a human call.
       - **Accept:** the guard fails on an edge pairing that is in neither
         list — red-proved by injection, with the injection confirmed in the
         parsed declaration list the guard reads, not in the file text. Expect
         the `@exact` tag to move to `@heuristic` (the extension recognises a
         boundary from a property NAME, which is a recognition and can be
         fooled); if it does, `readme-facts` must agree with what
         `check:selftests` reports in the same commit, or `stamp-readme
         --check` fails the core build.
       - **Closed 2026-09-23.** 26 edge pairings adjudicated: 15 exempt with a
         stated reason, 5 in `EDGE_TODO` as debt against 374.4, the rest gated;
         three state edges (calendar selected day, invalid field in a
         data-table, active filter chip) went into `PAIRS` at 3:1 and pass,
         taking it 37 -> 40 rows. Red-proved by injection with the injection
         confirmed in the PARSED declaration list, and the staleness branch
         red-proved itself on a mis-keyed exemption. Retagged
         `@exact` -> `@heuristic` with a 6-case `--self-test` covering the two
         defects the detector actually had — a LENGTH read as the edge colour
         on 22 of 33 sites, and a local property read as a token, inventing a
         pairing no element holds — and that retag forced the README
         gate-count re-stamp it should have. Verified in a packages-only
         context, not just a full checkout. Completion review 0.80; its weakest
         criterion is the claim that a shape is the right enforceable property,
         which is a judgement no measurement settles (94.11).

## Slice 373 — Owner direction 2026-09-19: a master prompt naming five workstreams (docs IA, app-shell contract, dropzone / reorder / dock / launcher, layout recipes); Phase 0 inventory finds **one capability existing-incomplete with two HIGH behaviour defects, two refused on record (dock, drag), and every other ask answered by composition** — 24 of 26 gap claims reproduce under an adversarial pass, and the baseline tree is green on every gate (2026-09-19)

**Triaged from chat (Step 1): the owner pasted a "master prompt" for a UI
framework architect agent** — graph-driven planning, bounded loops, five
workstreams (A docs simplification, B app-shell contract, C1-C4 dropzone /
reorder-transfer / app dock / fullscreen launcher, D six structural layout
recipes for AI composition). Its scope boundary matches this repo's (UI only,
no business modules, no React, no mandatory HTMX, the browser floor as is). Its
process asks — a dependency/evidence graph, an execution state machine, ≤3
slices per invocation, ≤3 repair attempts — are **already this file, `LOOPS.md`
and graphify's `graph.db`**; nothing new is adopted, per the prompt's own
"extend existing mechanisms" line.

**Phase 0 ran as one workflow of nine agents** (seven read-only mappers, one
baseline runner, one skeptic instructed to REFUTE every "missing" and every
"defect" claim by re-running the evidence). Baseline at `ce17d9b4`, Node 26.8 /
Chrome 153 (CI pins Node 22): `build`, `test` (29 files / 165), `lint:css`
(74 files), `check:size`, `docs:build` (all chained gates), `check:claims` (179
live), `check:selftests` (22 heuristic / 183 cases, 34 exact), `check:markup`,
`test:axe` (128 × 2, 0 violations), `check:layout` — **all pass, no
pre-existing failure, no environment blocker, tree clean after.** Skeptic: **24
confirmed, 2 partially true, 0 refuted** of 26 claims; every confirmation is a
re-execution, not a re-read.

### Classification (source-backed; each mapper's evidence is in the workflow journal, the load-bearing ones are re-stated beside their item)

| Ask | Class | Existing surface | Verdict |
|---|---|---|---|
| C1 dropzone | **existing-incomplete** | `file-upload.css`, `file-dropzone.ts` (stable set), `check-claims.mjs:1938`, po-app | **extend** — 373.1 |
| C2 reorder / transfer / basket | **deliberately-excluded** | button floor ships: `ordered-list__actions`, kanban *Move to…* menu, bulk-actions, tag-input events | **reuse**; drag REFUSED ×4 on record (100.1, 110.7, 132.5, 317) — 373.4 fixes the two focus leaks on that floor |
| C3 app dock, hide-on-upward-scroll | **deliberately-excluded → owner call** | none; 0 hits for dock / scroll-direction in source | 123.2 refused the bottom-nav tier, Slice 154 refused direction-driven chrome motion — **373.6, OWNER CALL** |
| C4 fullscreen launcher + search | **existing-incomplete** | `/patterns/app-launch`, `/patterns/command-bar`, `bo-dialog` + `initDialogs` (focus restore already claimed), `bo-widget-grid` | **compose** — 373.5, zero core source |
| B app-shell contract | **existing-incomplete** | `sidebar-layout.css`, `/concepts/layouts` (Slice 156: one shell, not three), z-index tokens, `check:sticky-layers` | **extend the page**; 2 HIGH CSS leaks — 373.3 |
| D six layout recipes | **existing** | every intent resolves to a gated pattern page; `/concepts/which-pattern` is generated from `patterns.json` | **reuse** — 373.7 repairs the router; 112.4 stays blocked |
| A docs IA | **existing-incomplete** | 17 sidebar groups, 2-level cap (docs-IA comparison 2026-08-16); Slice 112 REFUSED the six-section reorg | 4 stale claims — 373.2; regroup is **373.8, OWNER CALL** |

### The 8-task lookup baseline (Workstream A's number to beat — "less or equal reading, no loss of correctness")

Instrument: whitespace tokens of tag-stripped `<main>` content on the built
site, docs chrome removed, code samples included; "words" = words passed before
the answer first appears, walking links from `/` without search. Re-run it
before quoting a change.

| # | Task | Path | Words | Answer |
|---|---|---|---|---|
| T1 | make a table dense | `/` → `/concepts/density` | ~479 | exists (`data-density="compact"`) |
| T2 | pattern for an approval screen | `/` → `/patterns/` → `/patterns/approval` | ~1,354 | exists |
| T3 | wire the dropzone | `/components/` → `/components/file-upload` | ~1,077 | exists |
| T4 | the shell's scroll container | `/concepts/layouts` | ~1,142 | **partial** — `__main` scrolls is stated; that the document does NOT is nowhere |
| T5 | is there a dock / launcher | `/patterns/` → `/patterns/app-launch` | ~277 | launcher exists; **dock absent and no page says so** |
| T6 | HTMX on a 409 | `/getting-started/htmx` | ~1,337 | exists, late in the page |
| T7 | event fired when a row edit saves | `/reference/events` | ~262 | exists (`bo:row-save`) |
| T8 | is there a data grid | `/getting-started/scope` | ~494 | **partial** — never says "grid"; full answer only on `/getting-started/ai-assistants` |

### Items

1. [x] **373.1 — the dropzone forwards no more than the native input it
       forwards to would accept, its states are two-channel, and the page says
       only what a browser does.** Measured with TRUSTED drops (CDP
       `Input.dispatchDragEvent` with real file paths, headless Chrome 153,
       source transpiled in memory; a plain native input in the same run as
       control): a zone wrapping a **disabled** input takes 3 files and fires
       `change` (native: 0 files, 0 events); 3 files on a **non-`multiple`**
       input are all assigned and `FormData` carries three entries (native
       Chrome refuses the drop outright); the behavior fires `change` only
       where native fires `input` then `change`; a **text/plain drag**
       highlights the zone and is then swallowed; `data-dragover` differs from
       rest in **colour only** and in **zero** computed properties under
       forced colours; a zone around a disabled input has **zero** computed
       difference from an enabled one. And the three shipped texts that say
       drop-to-select works natively without the behavior (`file-upload.css:47`,
       `file-upload.astro:52`, ApiTable js line) are **false for the
       documented markup**: the input is `bo-visually-hidden` (1px, clipped),
       so a trusted drop with no init yields 0 files and Chrome opens the file
       in a new tab.
       - **Accept — parity is measured against native in the same run, never
         asserted.** For each of {disabled; non-`multiple` with 3 files;
         `multiple` with 3 files; one file}, the file names on the input and
         the ordered event sequence after a trusted zone drop agree with the
         same trusted drop on a plain visible input carrying the same
         attributes. A drag whose `dataTransfer.types` lacks `Files` leaves
         `data-dragover` unset and `dragover` un-prevented. Each new claim is
         red-proved by reverting its guard, with the injection confirmed in the
         BUILT `dist/js` before a pass is believed.
       - **Accept — two-channel.** With `(forced-colors: active)` emulated and
         asserted, at least one computed property differs between rest and
         `data-dragover`; in normal mode at least one differing property is not
         a colour; a zone with a disabled input differs from rest in a
         non-colour property and its cursor is not `pointer`; any fg/bg pair
         the states produce is in `PAIRS` and `check:contrast` agrees in both
         themes.
       - **Accept — the page.** Every sentence about what a drop does WITHOUT
         `initFileDropzone()` agrees with a trusted-drop case on the documented
         markup, or is in `EXEMPT` with a reason; the documented input's
         computed accessible name/description carry the visible instruction and
         the constraint hint (accessibility tree, not markup); every demo's
         visible hint agrees with that input's `accept`; the page states that
         `accept` does not filter a drop (native or forwarded — measured);
         rejected / in-progress / retry rows are static consumer-state markup
         composed from shipped surfaces with no timer or network call.
       - The CHANGELOG entry's compatibility classification matches the effect
         on the po-app composition and the docs demos, with the reasoning;
         `behaviors.json` agrees with the extractor after the change.
       - **Decided here, not forecast:** a several-file drop on a
         non-`multiple` input is **refused whole, the way native Chrome
         refuses it** — matching the platform is the deterministic floor and
         "take the first file" silently discards the rest; the cursor shows
         `not-allowed` during the drag (`dropEffect = 'none'`), which is the
         feedback the platform gives. Recorded so a later wake does not
         re-decide it.

       - **DONE 2026-09-19 (this invocation, slice 1 of ≤3).** Every Accept line
         held except where stated below; nothing was forecast, each number has
         its command.

         **Parity, measured against native in the same run** (`Input.dispatchDragEvent`
         with real files, headless Chrome 153; scratchpad `parity.mjs`, and now
         `check-claims.mjs` "file-dropzone parity"): for
         {`multiple`×3, no-`multiple`×3, no-`multiple`×1, `disabled`×3,
         `accept=".pdf"`×3} the zone and the plain input agree on files AND event
         sequence in **5 of 5** cases (was: 0 files/events native vs 3 files +
         `change` on the zone for `disabled`; 0 vs 3 for no-`multiple`; `[input,
         change]` vs `[change]` on every drop). Source checked first, then
         `dist/js` — same table both times. A text drag no longer highlights; a
         Text-node target no longer throws.

         **The red-proofs, and the one that came back green.** Twelve
         injections against the SERVED page or bundle, each counted before it
         was applied and asserted present after: five behaviour guards, four
         dropzone-state CSS guards, three row/list CSS guards. **Eleven went red
         on the intended claim first time. The `Files`-type guard went GREEN**,
         with the injection confirmed landed — so the defect was the gate:
         Chrome lists a text drag's items during `dragover`, `dragFileCount`
         already reads 0 and refuses it, and no trusted drag can make the type
         check the only discriminator. A synthetic empty `DataTransfer` can
         (no items, no files, no types), so that claim was added and re-proved
         red. This is CLAUDE.md's "a green red-proof is a defect in the
         injection until proven otherwise" resolving the other way: the
         injection was fine.

         **And one red-proof aimed at the wrong file.** The CSS red-proof
         first targeted `dist/assets/busy-office-ui.min.css`; the page loads
         `dist/_astro/colors.*.css`, whose spelling differs (`border-style`
         before `border-color`, `:is()` kept). Caught by reading which
         `<link>` the page emits before believing a result, and the run was
         killed and retargeted. Command: `grep -oE '<link[^>]*stylesheet[^>]*>'
         apps/docs/dist/components/file-upload/index.html`.

         **Found by the screenshot, missed by every gate.** The new
         progress/failure/retry demo rendered a 357px-tall row at 390px with the
         file name at **0px wide** — one letter per line. `check:layout` (128
         pages, "no overflow at 390") passed, because it looks for horizontal
         overflow and this grew vertically. Two causes, one of them older than
         this slice: `ul.bo-file-list` never reset the UA's `padding-inline-start:
         40px` (13% of a phone), and a row could not wrap. Fixed in
         `file-upload.css` and claimed (`file-upload rows @390`, red-proved by
         removing `flex-wrap`, the 12ch basis, and the reset, separately).
         **Filed as 373.9**, not built.

         **Contrast.** Adding `text-secondary`-on-`bg-selected` to `PAIRS`
         found the dragover hint's resting `text-muted` at **3.59-4.31:1 on the
         four dark brand presets** (`check:contrast` failed the core build).
         The hint steps up to `text-secondary` while dragging. The coverage
         scan could not see this pair: fg and bg are set in two different rules.

         **Gate cost, recorded so it is not paid twice.** `check:claims`
         179 → **203** (+24). Replacing the document with `page.setContent` /
         `document.write`, or opening a second `browser.newPage()`, made a
         `page.click` **21 claims later** block the renderer until the 120s
         protocol timeout while every assertion in the new block passed —
         found by tracing claim numbers, not by reading the error (which names
         only `Runtime.callFunctionOn`). The no-JS claim therefore runs LAST
         and says why in a comment; nothing may be appended below it.

         **Decided here, so a later wake does not re-decide:** a several-file
         drop on a no-`multiple` input is refused whole (as Chrome refuses it);
         `accept` is not enforced on a drop (Chrome does not either — measured);
         no upload-specific class exists (rows compose `bo-badge`,
         `bo-progress`, `bo-btn`); the dropzone's name comes from its own
         visible line via `aria-labelledby` (a separate `aria-label` beat the
         wrapping label and dropped the visible words out of the name — WCAG
         2.5.3), checked from the accessibility tree on every live demo.

         **CHANGELOG classification, with reasoning:** a fix, not Breaking —
         no class, attribute, event or export moved — but two effects are
         consumer-visible and are written down: a listener on `input` now fires
         on a drop, and existing `.bo-file-list`s render 40px left and wider.
         `po-app` was aligned (added `accept`, `aria-labelledby`,
         `aria-describedby`); it does not compensate for the indent.
         `behaviors.json`'s `initFileDropzone` hook list is unchanged
         (`grep -A8 initFileDropzone packages/core/dist/behaviors.json`).

         **Verified live, on the freshly built revision** (served from
         `apps/docs/dist`, not a cached container image): 1440 and 390, light
         and dark — solid border on dragover, dimmed `not-allowed` zone,
         solid red border with message, wrapped state rows. Gates green on the
         final tree: `build`, `docs:build` (every chained gate), `check:claims`
         (203), `check:po-app` (20), `check:forced-colors`, `check:target-size`,
         `test:axe` (128 pages × 2 widths, 0 violations), `check:layout`,
         `check:selftests` (22 heuristic / 183 cases run, 34 exact),
         `check:markup`. **Not verified, stated rather than skipped:** Safari
         and Firefox (native refusal semantics and a null `dragleave`
         `relatedTarget` were measured in Chrome only); a real screen reader
         announcing the description; touch; whether any engine actually targets
         a Text node with a drag event (only a synthetic dispatch proves the
         throw was real); the native PICK order `[input, change]` (taken from
         the spec — only native DROP was run). The reviewer was **not
         independent**: the adversarial pass was by the same agent, and it is
         what found the wrapped-row defect only because a screenshot was
         looked at.

2. [x] **373.2 — four shipped-status claims are false on the built site, and
       the decision page blanks 5 of 39 "Not when" cells it has structured data
       for.** `installation.astro:173` says the RF lower-floor profile is "not
       shipped yet" — `build:rf-essentials` + `check:rf-floor` run on every core
       build; `scope.astro:57` and BOTH READMEs' stamped not-for row list
       "Kanban boards" while `/patterns/kanban` ships in the sidebar;
       `density.astro:59` calls App Launch "forthcoming (Slice 9, queued)";
       `which-pattern.astro:29/46` re-parse the opener with a regex and drop
       `record-detail`, `role-home`, `command-bar`, `output-form`, `rf-putaway`
       although `patterns.json` carries a `wrongChoice.clause` for all 39; and
       `/concepts/layouts` says `check:markup` protects its four shell
       templates when an invented class inside a template string builds green
       (injection confirmed in the built page, 1 of 1 replaced).
       - **Accept:** each of the five either changes at its SOURCE (scope table
         re-stamped through `stamp-readme.mjs --check`, never a hand edit in a
         stat block) or records a one-line reason it should not; the count of
         non-blank "Not when" cells in the BUILT decision page equals the count
         of non-empty `wrongChoice.clause` in `patterns.json` counted by
         re-reading the JSON; the layouts sentence agrees with what the
         injection showed. No new gate — the population is 2 lexical matches
         and the Kanban case has no lexical marker (94.11).

3. [x] **373.3 — the app-shell contract, on the page that already owns it, and
       - **CORRECTION 2026-09-24 — part of this item's change was never committed** (DESIGN.md, /base/primitives and the Gallery drawer patch); it sat in the working tree, misfiled as owner checkpoint, so clean builds did not carry it. Landed in `24ca80b0`; found by the Standardize completeness critic.
       the two shipped CSS leaks the shell measurement found.** Measured on the
       fresh dist: (i) an `<dialog class="bo-offcanvas">` drawer holding a
       `bo-sidebar-nav` placed INSIDE a `.bo-app-shell` narrower than the rail
       band inherits the rail's icon-only collapse — labels render as 1×1
       clipped boxes; `Gallery.astro` carries a hand patch for the docs' own
       drawer (Objective §1: the fix lets a consumer delete code); (ii) on
       `/patterns/list-report` as shipped (bounded `max-block-size: 24rem`,
       sticky `thead`), Shift+Tab from the last row lands row 5's checkbox
       **16 of 16 px under the sticky header** — WCAG 2.4.11 at the block-start
       edge, the mirror of `form-section.css:100-103`'s block-end fix; (iii) a
       one-line toast covers 69 % of *Save* on a sticky `.bo-form-actions` at
       390×844. Plus the contract itself: Slice 156's binding decision is
       *"extend `/concepts/layouts`, do not fork a second page"*, so the
       region model (header / optional nav / workspace: page header, toolbar
       scope, app area, action region / overlays), the scroll owner
       (`__main`, and that the document does not scroll — T4's missing half),
       sticky offsets via `--bo-app-shell-pad`, top-layer ownership, the
       z-index scale and safe-area go THERE with every number derived from
       `sidebar-layout.css` / `z-index.css` rather than retyped.
       - **Accept:** a claims case injects the drawer markup inside a narrow
         shell and outside one as control and asserts the label's rendered box
         and computed `clip-path` agree; a claims case walks Shift+Tab with real
         keys on shipped `list-report` and asserts no focused control's rect
         intersects a `thead th` rect, red-proved on the current build; the
         toast/actions collision is either resolved (a documented clearance or
         region rule) or refused with the measurement; `grep -rnF "900px"` over
         docs src and `DESIGN.md` returns no shell-band restatement; the scroll
         owner is asserted by a claims case (`document.scrollingElement` does
         not overflow, `__main` does). **Refused here, with reasons:** a
         page-header component (breadcrumb + `h1` + cluster already compose
         it), a second rail (GAP-1's trigger unmet), a split primitive
         (31.2/152.1), speculative `env(safe-area-inset-*)` (state the
         `viewport-fit` assumption instead), `role="toolbar"` on any action row
         without the APG keyboard model.

4. [x] **373.4 — the shipped move/remove floor loses focus at completion, in
       - **CORRECTION 2026-09-24 — part of this item's change was never committed** (the ACR 2.5.7 row in extract-acr.mjs); it sat in the working tree, misfiled as owner checkpoint, so clean builds did not carry it. Landed in `5d0146f5`; found by the Standardize completeness critic.
       the framework and in the copyable sample.** Measured with trusted keys:
       Enter on `tag-input`'s remove button → chip removed, `activeElement ===
       body` (`tag-input.ts` `removeTag` calls `tag.remove()` with no handoff);
       Enter on editable-grid's *Remove line* → row removed, focus on `body`, in
       BOTH the live script and the copy-paste sample (`editable-grid.astro:80`,
       `:232`). This is the part of C2 that is not refused: the single-pointer,
       non-drag floor SC 2.5.7 asks for already ships everywhere (ordered-list
       `__actions`, kanban's server-legal *Move to…* menu, bulk-actions,
       tag-input) — what it lacks is the focus and announcement obligations
       written down.
       - **Accept:** after a trusted-key removal, `activeElement` is inside the
         same `.bo-tag-input` (first, middle, last and only chip), focus moves
         ONLY when the removed chip contained it, `bo:tag-remove` still fires
         before removal; the editable-grid case holds for live and sample and a
         rendered-row check pairs each *Remove* label with its own row; the
         ordered-list, kanban and editable-grid pages state where focus goes
         (including the boundary where the pressed button no longer exists)
         and that the status sentence is consumer-owned (317.1's style); the
         generated ACR carries an SC 2.5.7 row derived from a scan of
         `packages/core/src/js` with the command beside it, naming
         `file-dropzone` as the one drag surface and its click alternative.
         **Drag stays refused** — 100.1, 110.7 (owner re-ask, "not a third
         time"), 132.5 (membership), 317 (a generic move core: 4 of 5
         parameters are announcement strings); the reopen bars are quoted, not
         re-argued. No new "reorder" concept page (158.2).

5. [x] **373.5 — a searchable, viewport-filling launcher as a section of
       `/patterns/app-launch`, with zero framework source change.** Composition:
       header ghost button with `data-dialog-trigger` + `initDialogs()` (modal,
       Escape, Tab loop, focus restore — `check-claims.mjs:2303` already asserts
       the restore with real clicks); `<dialog class="bo-dialog"
       aria-labelledby>` with the recipe's visible Close; `<input type="search"
       class="bo-input">` as initial focus; one labelled section + `bo-widget-grid`
       per category, tiles `<a class="bo-widget">` with visible labels;
       `.bo-state` + `role="status"` count for no-results; hiding via `hidden`
       (leaves the Tab trap, `focus-trap.ts:20`). Page-local: ~6 declarations
       of viewport-filling sizing and ~20 lines of `data-keywords` substring
       filtering, like `command-bar.astro` and `value-help.astro:257` already
       carry. **Not** `initCombobox` (imposes listbox, hides headings under a
       query, brings 174.1's overflow trap) and **not** `bo-dialog--fullscreen`
       (99.3 refused a one-caller modifier; `dialog.css:15-19` argues against
       edge-to-edge panels — the page must justify its exception in its
       wrong-choice clause against 123.2's owner-confirmed popover switcher and
       command-bar's type-to-jump).
       - **Accept:** `git diff --stat -- packages/core/src` for the slice is
         empty or the page says why not; claims cases driven by CDP clicks and
         keys assert open → `activeElement` is the search input, Escape and
         Close → focus on the trigger, a substring query shows exactly the tiles
         whose label or `data-keywords` contain it (DOM-compared, not a
         hard-coded count), a keyword-only match shows its tile, a no-match
         query renders the `.bo-state` and the status count reads 0; long
         labels wrap at 390 with no horizontal overflow (`check:layout`).
         Whether a generic text-filter behavior should be extracted is a
         separate grill (two page-local copies would then exist — §3's bar is
         two real compositions), recorded in `.roundtable/` either way.

       - **Verified 2026-09-23, HOLD — the page ships a claim the build does not
         support.** The rendered prose reads "Opening, the search, Escape, Close
         and the focus moves are real and are verified by the build", and
         `check-claims.mjs` contains **zero** launcher cases (grep count 0 for
         `al-launcher`, `app-launch`, "All applications"). That is the same class
         374.6 corrected in the published conformance report: an artefact
         asserting verification that does not exist.
       - **And one of the asserted behaviours is broken.** Escape does not close
         the launcher while a query is typed: the field is `type="search"`, so
         Chromium's native Escape-to-clear consumes the first press and two are
         required. The empty-field case works, which is why it read as fine.
       - **The criterion names a gate that cannot see the property.**
         `check:layout` is cited for the 390px wrap, but it walks
         `.bo-app-shell__main` and a closed `<dialog>` computes `display: none`
         with a 0x0 rect. Its green is unearned here. Also: no long label exists
         to exercise the wrap (longest shipped is "Purchase orders"), and
         `data-keywords` — named in the criterion — does not exist; the
         implementation ships a JSON script block instead.
       - **Accept, revised:** the sentence about build verification is either
         made true (launcher cases in `check-claims.mjs`, driven by real key and
         pointer events) or removed. Escape is either fixed or the page and this
         criterion say two presses are needed. Runtime search/filter behaviour
         measured correct and is not in question.
       - **Closed 2026-09-23.** Escape fixed with an explicit `dialog.close()`
         on keydown (the native `type="search"` clear was consuming the key);
         seven claims cases now drive open / search / keyword-only / no-match /
         Escape / Close / the 390 wrap with real key and pointer events, taking
         the suite 263 -> 270; the Escape case is red-proved by removing the
         handler from the built bundle, with the injection confirmed landed and
         the bundle restored byte-identical. The page's sentence now names what
         actually runs. The 390 wrap is measured on the OPEN dialog rather than
         left to `check:layout`, which cannot see a closed `<dialog>`. The
         extraction question is recorded as a refusal in
         `launcher-filter-extraction-2026-09-23.md`, with a third caller of the
         same shape named as the reopen trigger. Completion review 0.89. Decision review scored the
         hold at **confidence 1.00**.

6. [ ] **373.6 — App dock: hide on UPWARD scroll. OWNER CALL — two refusals
       stand on the record and the reversal is not written down.** 123.2
       (2026-08-23): *"Mobile bottom-nav tier REFUSED for now (icon-rail
       collapse already ships; re-open on a real consumer need)"*, trigger
       sharpened in 125.2 to *"first phone-first consumer"*. Slice 154: *"A tab
       strip that hides on scroll-down and reappears on scroll-up — direction-
       driven chrome motion"* REFUSED. The 2026-09-19 prompt asks for exactly
       these two halves and says "do not silently reverse" the direction. The
       direction itself is taken as stated (upward = decreasing `scrollTop` in
       `.bo-app-shell__main`; reveal on downward; initial and no-JS state =
       visible), and its consequence is named: it is the reverse of the common
       mobile convention, so the persistent reveal control is load-bearing, not
       decorative. **Three questions, then it is dispatchable:** (a) does this
       supersede 123.2 and Slice 154 — both, or the dock only, leaving the
       general hide-on-scroll mechanism refused; (b) which consumer meets the
       "phone-first" trigger, or is the trigger withdrawn; (c) is the item
       cleared to add a CSS dir plus one call-once behavior if the compose-first
       spike (static `nav` + `.bo-btn-group--bar` links with `aria-current` in
       app-frame AND `erp-suite/_shell.mjs`) measures a real gap — the four
       things composition cannot do today are a shell slot, a hidden state that
       drops tab stops, safe-area insets (0 `env()` in source) and a clearance
       contract with `.bo-form-actions`.
       - **Accept (once answered):** the owner entry names what it supersedes;
         a spike report lists every C3 requirement as composed-from or missing
         with the measurement; direction, hysteresis, overscroll clamp,
         focus-within guard and manual reveal each have a claims case that
         asserts `scrollTop` really moved before believing a state; hidden items
         are not tab stops; reduced motion drops the transition; listeners
         follow `anchor-nav.ts:136` (one capture-phase document listener,
         resolve the scroller at event time).

7. [x] **373.7 — the six-intent recipe path exists; make its one router read
       - **CORRECTION 2026-09-24 (377 grill):** three of the five files its closing measurement called "this item's" and reverted for its baseline (`gen-suite-index.mjs`, `suite.json`, `screen-kit.astro`) were never touched by a 373.7 commit — they hold only the owner's 2026-09-20 journey checkpoint. The item's own files are `gen-llms.mjs`, `ai-assistants.astro` and `commands.mjs`.
       its own data and name the validator in the AI path.** Every intent
       maps to a gated page: find-and-act → `list-report`; inspect one →
       `record-detail` / `object-page`; create-or-edit → `detail-form` /
       `wizard`; list + selected → `master-detail`; review decision →
       `approval`; monitor → `reporting-dashboard` / `job-monitor`. The
       pattern recipe (Anatomy / Data contract / States / Components used) is
       already build-gated, `which-pattern` is generated from `patterns.json`,
       and `bo-check-markup` is a consumer-runnable validator. What is missing
       is small: `llms.txt` never names the validator command or the shells
       page, and `ai-assistants`' paste-in block does not state the order
       shell → pattern → components → verify.
       - **Accept:** the built `llms.txt` names the validator command read from
         the one source the ai-assistants snippet and the scaffolder use; every
         added URL resolves under gen-llms' existing assertion; the paste-in
         block's "Why these N things" agrees with its list; no States / Data
         contract / Anatomy text is added (gen-llms' "kept lean" stands) and
         the size delta is written into the item. **Not built, by name:** a
         machine-readable per-pattern recipe with required/optional regions,
         structural checks in `bo-check-markup`, a findings format — those are
         112.4 word for word, OWNER-BLOCKED behind 112.3's briefs; editing
         `llms.txt` changes the pilot's instrument and is written into 112.3's
         record rather than landed silently.

       - **Verified 2026-09-23, NOT landable — two gaps, not one.** Six of seven
         criteria measure PASS: the validator command is single-sourced
         (injection-proved), the three added URLs each pass gen-llms' existing
         assertion (failure-proved), "Why these five things" now matches its
         list, nothing from the exclusion list was added, and the instrument
         change is recorded in `pilot-112/README.md` with figures independently
         reconciled (49,982 + 556 = 50,538 B, SHA e9c1ef20…).
         **(a)** The size delta is still not written into this item —
         `git diff ROADMAP.md` was zero lines. **(b)** The changed page has no
         1440/390 light-and-dark verification; the prior session's claim of
         "four rendered viewport/theme cases" rested on `/private/tmp` evidence
         that no longer exists, so it is UNVERIFIED rather than done.
         Completion review scored this **0.35** — at the "evidence does not
         support" boundary — which corrected a wake that had reported it as
         "one line short". Gap (b) is a measurement, not clerical.
       - **Both gaps closed 2026-09-23.** (a) **The size delta is +556 bytes:
         llms.txt goes 49,982 -> 50,538.** Measured, not inherited: the prior
         figure was taken before three slices landed, so the baseline was
         rebuilt by reverting only this item's five files
         (`gen-llms.mjs`, `gen-suite-index.mjs`, `suite.json`,
         `ai-assistants.astro`, `screen-kit.astro`), running the docs build, and
         restoring them — 49,982 then 50,538, reproducing +556 against today's
         HEAD. (b) The changed page was measured at desktop and 390, light and
         dark: page overflow 0 and `__main` overflow 0 in all four, the paste-in
         block contained within the viewport at both widths (342px at 390), and
         its 356px horizontal scroll is `overflow-x: auto` — a scroll container
         by design, not a layout break. Desktop emulation reported innerWidth
         1600 rather than 1440 (the driver refuses that resize; `check:layout`
         sweeps DESKTOP_WIDTH across 128 pages including this one), so the
         desktop reading is "a desktop width", stated rather than rounded.
       - **One observation, not a criterion failure:** the paste-in block now
         carries SIX `##` sections while "Why these five things" explains five.
         The criterion is about the why-list matching its own `<ol>`, which it
         does (5 and 5). Whether the sixth section wants explaining is a
         judgement, recorded here rather than silently closed.

8. [ ] **373.8 — docs IA: collapse 17 sidebar groups into the prompt's seven
       (Start here / Foundations / Components / Patterns and layouts /
       Integration / Reference / Contributor and decision history). OWNER
       CALL.** It contradicts the recorded 2-level nesting cap (docs-IA
       comparison 2026-08-16; `Gallery.astro:88`) or yields a 42-item
       Components group, and Slice 112 REFUSED the six-section IA reorg pending
       a second real consumer. The cheapest honest option — non-interactive
       section labels over the existing groups, no third level — is the
       recommendation; the T1-T8 baseline above is the property to beat.
       Independent of the call and already concurred (Slice 249): a
       `CONTRIBUTING.md` that POINTS at `CLAUDE.md`'s recipes, `DESIGN.md`,
       `LOOPS.md` and `.roundtable/INDEX.md` with no second copy of any rule.
       DELETE nothing; the two "absent" lists (`DESIGN.md` component-level,
       `scope.astro` product-level) overlap on ~2 of 17 subjects and are NOT
       merged.

9. [x] **373.9 — `check:layout` is blind to vertical collapse: a name at 0px
       wide passed it with a 357px row.** Question, not a gate: should it also
       flag a text container whose rendered width is below N characters?
       - **Accept — decide from the base rate first (94.11).** Count how many of
         the 128 pages have any text node narrower than 8ch at 390px *today*; a
         predicate true of 0 pages cannot fail, and one true of many is noise.
         Either the count justifies a `@heuristic` gate with a `--self-test`, or
         the local claim shipped in 373.1 (`file-upload rows @390`) is recorded
         as the whole answer and this closes as refused with the count. Finding
         the gate unnecessary is a satisfying outcome.
       - **CLOSED 2026-09-23 as REFUSED, with the count — and the count settles
         it without judgement.** The literal predicate, "a text container
         narrower than 8ch at 390px", is true of **125 of 128 pages, 4,956
         boxes**. The item's own criterion says "one true of many is noise".
       - **The premise is TRUE, which is why this is a refusal and not a
         dismissal.** Injecting the 373.1 defect and running `check-layout`'s
         own probes verbatim: name at 0px wide, row 714px tall, both probes
         return null, gate PASSES. The blindness is real; it is the PREDICATE
         that cannot be built.
       - **No threshold separates the defect from the tree.** 8ch → 125 pages;
         require the text to wrap → 36; require 3+ lines → 21; under 4ch and
         wrapped → 1; under 3ch → 0. The band between is 4-column tables at
         390px, which are fine: `/components/quantity/`'s units column stacks
         "ea / each / pc pcs / unit / item / box / carton / pallet" with every
         word intact, while 373.1 broke ONE LETTER per line. "< 8ch" cannot
         tell those apart.
       - **The best-constructed predicate was tried and also fails.** "Box
         narrower than its own longest word" (browser `min-content`, with
         `overflow-wrap`/`word-break` forced normal so the property under test
         cannot suppress its own measurement) red-proves on the injection
         (0 vs 92.8px) and scores **0 true positives / 12 false positives** on
         today's tree — nine single-glyph icon buttons where the glyph paints
         over padding, and three `.bo-pagination__btn` whose text spills its own
         box but sits 49-231px INSIDE the parent, fully visible.
       - So 373.1's local `file-upload rows @390` claim is recorded as the whole
         answer. This is 94.11's ceremony case in mirror image: there the
         predicate was uniformly true, here no threshold exists at all.

10. [x] **373.10 — independent re-score of `file-upload · interaction`.** The
       DSA cite claimed "native drag-drop come free", which is false for the
       documented markup; it was corrected in 373.1 WITHOUT re-taking the
       score, because a re-score by the agent that changed the surface is not
       the independent second opinion `LOOPS.md` §3b step 4 requires.
       - **Accept:** a blind re-score of that one dimension, its date carried in
         its own cite and `scored` left where it is (the ledger's `$comment`).
         It may stay 3 or move; either closes it.
       - **CLOSED 2026-09-23: blind re-score HELD AT 3.** Scored independently
         from the shipped component and its page before reading the existing
         value, per `LOOPS.md` §3b step 4, then compared: 3 and 3. The cite in
         `dsa-scores.json` now carries the 2026-09-23 date; `scored` stays
         2026-08-21, because a single re-scored dimension must not move the
         full-pass date. No `improve` entry — nothing sits below 3.
       - Worth recording rather than just the number: after 373.1 this is now
         the repo's strongest example of the dimension, because the page names
         what omitting the JS actually COSTS ("the browser opens the dropped
         file instead") rather than merely noting a behaviour, and both halves
         are executable in `check:claims`.

**Refused in triage, with reasons:** a graph database or agent runtime (the
prompt's own boundary; `graph.db` is a derived mirror already); a per-slice
"requirement / benefit / nodes / evidence / rollback" record format beyond
what an item's Accept lines carry (a second record shape is what 326.3 and
158.2 measure the cost of); a new "reorder", "dock" or "launcher" component
family before its spike (§3: nothing ships for one screen); a universal quality
score (171.3: layout is not scorable; the DSA rubric stands).

**Sequence for this invocation (≤3 slices, the prompt's own budget):** 373.1
now — it is the only ask with HIGH behaviour defects in a stable behavior, its
harness (trusted drops) is reusable by 373.3's claims, and nothing depends on
an owner. Then 373.2 (independent, documentation-only). 373.3 / 373.4 / 373.5 /
373.7 are dispatchable by rule 4 in that order; 373.6 and 373.8 wait on the
owner and block nothing else.

## Slice 372 — Objective grill of Slices 369, 370, 371: every structural claim in 370 and 371 reproduces exactly, and the finding is in the instrument that READS the samples they wrote — **`per_day_last` discards a metric sample on a stated reason that is false at 72 of 73 pairs**, so rule 5 publishes a movement that never happened on **5 of 8** names and its own predicate flips on **3 of 8** (2026-09-09)

**Dispatched by rule 3**, cloud wake, `Objective 3 / 3 slices OVERDUE
[338, 370, 371]`. Rule 1 found **0** open P0 across **23** open items
(`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → 0); rule 2 read `1 / 4`. Rules
4-8 were not reached. Step 1 read both intakes in the REST form with §8's
controls: issues **1** (#2, `updated_at` `2026-09-06T15:10:34Z` — the **sixth**
consecutive hand-off recording that same value), discussions **0**,
`/not-a-real-route` **404**, so the empty list means *served and empty*.
**Nothing triaged.**

**Both Step 0 traps bit, plus the third.** The container arrived **detached**
(`git branch --show-current` empty at `61e9d92f`) and **shallow** (50 commits);
`git fetch origin main && git checkout -B main origin/main` and
`git fetch --unshallow origin` fixed both — **2,112** commits, **8** tags, no
`shallow.lock`. Per §2 the tag count is the check, not a pinned value. And
`node_modules` was absent again, so `npm ci` ran first.

**The arming set resolves to Slices 369, 370, 371** — `338` is an item id whose
slice is 369, `370` and `371` are genuine slice numbers. Resolved by reading the
commit subject at each row's sha, per §0's rule, not by treating the label as an
ordinal. No earlier grill heading names any of the three, and `INDEX.md` reports
**4 repeated subject(s)** corpus-wide, none of them here — so nothing was
narrowed out. The full report is
`.roundtable/grill-objective-369-370-371-2026-09-09.md`.

### The finding: rule 5 discards a sample on a reason that is false at 72 of 73

`per_day_last` keeps only the last sample of each calendar day and records why:
*"a wake that samples twice in one day is correcting itself, and rule 5 compares
what each run concluded."* That is a claim about the data, so it was checked
against the data. **A sample separated from the next by a commit cannot be a
correction of it — the thing measured changed in between.** Counting distinct
commit shas strictly between each adjacent intra-day pair, over all **143**
samples in `loop-metrics.jsonl`:

```
adjacent pairs with NO commit between (a wake correcting itself):  1
adjacent pairs separated by >=1 commit (distinct trees):          72
```

The one pair matching the docstring is `behaviors_frozen`, **19.0 → 18.0 at the
same minute**, `2026-08-16 11:25`. Every other spans 2 to 50 commits.

**The case the rule was built around is the clearest counterexample.**
`LOOPS.md:609` and `dispatch_status.py:933-934` both present `ci-wall-time`'s 26
samples as one wake's burst — the latter outright: *"a burst inside one wake is
NOT two runs."* That window (`2026-08-18 02:48 .. 19:54`) carries **36 loop-log
rows, 35 distinct commit shas and 5 distinct loops** (`Continue`, `Explore`,
`Objective`, `Roadmap`, `Standardize`). The 17 hours are real; "one wake" is not.

### What it costs, and it is not cosmetic

Rule 5's trigger is *"regressed on TWO CONSECUTIVE runs"*; the implementation
maps *run* to *calendar day*, and 72 of 73 discarded samples were separate runs.
Across the 8 day-paired names that are rule 5's actual input set, **5 publish a
movement that occurred between no two samples**:

| name | published (per-day) | last two ACTUAL samples |
|---|---|---|
| `dispatch-region-words` | 7492 → 7484 **−8** | 7552 → 7484 **−68** |
| `components` | 25 → 30 **+5** | 29 → 30 **+1** |
| `claims` | 169 → 176 **+7** | 170 → 176 **+6** |
| `bundle-gz-kb` | 11.7 → 15.1 **+3.4** | 15.1 → 15.1 **+0.0** |
| `behaviors_frozen` | 16 → 18 **+2** | 19 → 18 **−1** (sign inverts) |

And on the rule's own predicate — two consecutive moves in one direction — the
two readings **disagree on 3 of 8**: true at sample level, invisible at day
level (`behaviors_frozen`, `ci-gates`, `dispatch-region-words`).

**`dispatch-region-words`'s two same-date samples were written by two different
wakes nine hours apart**, which is why this grill surfaced it. Attributed by
`git blame --line-porcelain` on `loop-metrics.jsonl` (164.2's method, and the
one `353.2` exists because a sample carries no commit of its own):

```
line 141  7552  2026-09-09 00:55   4cfb8b2c  "record Slice 363 …"  (00:58 +0000)
line 143  7484  2026-09-09 09:44   61e9d92f  "record Slice 371 …"  (09:49 +0000)
```

Slice 370's wake sits between them (08:54), read the region at **7,552** in its
lane-4 write-up, and **recorded no sample at all**. So the discarded reading is
not a correction Slice 371 superseded — it is another wake's correct reading of
an earlier tree, and rule 5 never sees it. Slice 371's hand-off meanwhile states
the movement as *"the region genuinely moved (7,552 → 7,484)"* while
`dispatch_status.py`, run in that same wake, printed
`2026-09-08 7492 -> 2026-09-09 7484  -8`. **Two numbers for one movement, 8.5x
apart, in one wake's record, unreconciled.**

**Evidence, not Hypothesis** — two independent sources: commit boundaries in
`loop-log.md` against sample stamps in `loop-metrics.jsonl`, and the live output
of `dispatch_status.py`, which printed the −8 at this wake's Step 0b before any
of this was measured.

### What these numbers do NOT cover, said before they are quoted

- **"Two consecutive moves in one direction" is the SHAPE of rule 5's predicate,
  not its verdict.** No direction is recorded with a sample (324.1), so a rise is
  a regression for `bundle-gz-kb` and the goal for `claims`. The 3-of-8 figure is
  about what the rule can SEE, not what it should fire on.
- **A commit between two samples proves they read different trees, not
  different wakes.** One wake can commit twice. The one-wake reading is refuted
  for `ci-wall-time` by the five distinct loop names, not by the count alone.
- **This does not establish the day unit is WRONG.** 324.2 measured
  `bundle-gz-kb` under four pairings and argued its sample-to-sample moves are
  noise; for a shared-runner timing that is plausible. What is established is
  that the recorded JUSTIFICATION is false and the case cited for it is
  mislabelled — separable, and only the first is proved.
- **`353.2` is adjacent and is NOT this**, so nothing is filed twice. It asks
  that a `dispatch-region-words` sample be traceable to its commit; this is about
  which samples the pairing keeps.

### What reproduced — and the 56 that looked like a discrepancy

Re-measured by **importing** `report_loop_prose.dispatch_sections` rather than
re-implementing its convention, as both slices did: rule 3 body **907** words
(exactly one section matches); `### Step 0c` **1,520**; `LOOPS.md` whole-file
**18,241**; `LOOPS-archive.md` **3,880**; the moved P4 paragraph present in the
archive **exactly once** and absent from `LOOPS.md`. **All four of Slice 370's
lanes were re-run against a built `dist` and each reproduces its published
figure** — lane 1 `0 dead attribute(s) … 1365 live`, lane 2 `74 · 242 · 230 · 8`,
lane 3 `119 page(s) · median 798 · 114,124 words`, lane 4 Step 0c `1,520`.
**Every structural claim in Slices 370 and 371 reproduced exactly.**

**One imprecision, recorded and NOT filed.** Slice 370 quoted lane 1's
*attribute* line and called the lane clean; the same run's second line reads
**11 dead declaration(s) on 9 page(s)** — the per-declaration view 320.2 added
because a dead declaration can hide behind a live sibling. The 11 is neither new
nor unnoticed: it is tracked as its own metric, `dead-declarations`, which moved
52 → 11 on 2026-09-08 and has not moved since. 370 quoted the weaker of the two
figures its lane prints; that is worth a sentence in the next sweep, not an item.

The dispatch region first read **7,428**, and the 56 was run down rather than
rounded off: `dispatch_heading_words` counts the region's own `##`-`####`
heading lines and returns **56**, so 7,428 + 56 = **7,484**. `353.2` already
documents that constant. Not a discrepancy.

**Not re-run, and named rather than implied:** Slice 371's 25-revision series
and its "all three quoted fragments are in P5" check need pre-cut revisions and
were not replayed — the endpoints reproduce, the path between them is taken on
371's word. **Slice 369's print figures were not re-measured at all** (a
multi-hour headless-Chrome + PDF re-derivation); its two browser-free citations
were, and both are exact — `print/index.css:99-102` is
`.bo-timeline__marker, .bo-stepper__marker { print-color-adjust: exact }`, and
the gate header's *WHAT THIS GATE DOES NOT SEE* paragraph carries its correction
in place, in the same commit `c5780113`.

### Three instrument defects in this grill's own work

0. **Authorship inferred from timestamp proximity instead of measured.** The
   first draft of the paragraph above said both `dispatch-region-words` samples
   were written by slices in this arming set, because 7,552 sits between Slices
   370 and 371 in time. `git blame` says the wake that wrote it recorded **Slice
   363**, and Slice 370 recorded no sample at all. Caught before publishing, by
   running the very blame the paragraph was about to cite `353.2` for. **The
   finding is unchanged** — nothing in it rests on which slice authored a
   sample.
1. **The commit-boundary probe was dead on its first run** — it called
   `r.get("sha")` on rows from `dispatch_status.rows()`, which returns only
   `at`/`loop`/`item`, so the set was always empty and it reported **0 commits
   between for 17 of 17 buckets**. Caught by the identical-value tell, then
   believed only after a **positive control** (9 distinct shas on 2026-09-09)
   and a **negative control** — the detector must be able to return 0, and does,
   exactly once, on the same-minute `behaviors_frozen` pair.
2. **A paraphrase-grep reported a false absence.** `grep -cF` for `"12 of 17"`,
   `"crossings 51"` and `"18 rows"` — `ROADMAP.md`'s wording for the moved text
   — returned **0** in both files while the text is present under the archive's
   own wording. Not reported as an absence; caught by opening the paragraph.

**Filed by this slice:**

1. [x] **372.1 — rule 5's pairing keeps the last sample of each calendar day on
       a recorded reason that is false at 72 of 73 pairs, and the case cited for
       it is mislabelled.** Measured above. The consequence is not cosmetic: on
       **5 of 8** day-paired names the published movement occurred between no two
       samples (`dispatch-region-words` −8 against a true −68 [**Corrected by Slice 384:** 56 of
       that gap is convention: 7,492 is a body figure, 7,484 a region one (353.2);
       in one convention the day pair is −64, the sample pair −68]), and the rule's own
       two-consecutive-moves predicate **disagrees between the two readings on 3
       of 8**.
       - **Accept — the property, and finding the unit RIGHT is a satisfying
         outcome.** EITHER `per_day_last`'s stated reason is replaced by one that
         reproduces against the data, with the command beside it, and the
         `comparable set` line says which movement it reports so a wake cannot
         read a day-close delta as a consecutive one — **OR** the pairing unit
         changes and the same 8-name set is re-measured showing what moved.
         Deciding that the day unit is correct and only its justification was
         wrong closes this just as well; so does deciding the reverse. What does
         not close it is leaving two numbers for one movement in one wake's
         record.
       - **DONE 2026-09-25 — the day unit is RIGHT; its reason was wrong.**
         Re-measured first: `dispatch_status.py --pairing-census` (new) reads 151
         samples, **75** adjacent same-day pairs, **70** with a commit between.
         Of the 5 without, 4 are cloud samples stamped in UTC (2026-09-01; each
         recording commit sits exactly +8h later), so 1 is a genuine same-wake
         repeat — the old reason is false at 74 of 75. The 72-of-73 filed figure
         was on 143 samples and is not reproduced exactly. `per_day_last` now
         states the day-close reason with that command; the `comparable set`
         header says each delta is DAY-CLOSE to DAY-CLOSE and every row marks
         `[k same-day]` samples folded in (counts checked against raw grep:
         3, 1, 0). The unit stays a day on 307.1's reason, which still holds.
         The "one wake" label on `ci-wall-time`'s burst is corrected in the
         script and `LOOPS.md`: that window holds 72 commits and five loops.
         Not covered: the census compares naive stamps against a local clock
         and LISTS the UTC ones rather than correcting them; no self-test case
         for the census itself. Jev completion review (`jev_evaluate`, Rubric 2,
         four claims batched, run after the service swap): **0.94 / 0.95 / 0.95 /
         0.94** — all in the supports band. The earlier attempt on `jevai.org`
         was rate-limited and did not run.
       - **Lane: cloud-takeable.** It is a Python module, a docstring, a
         self-test fixture and one sentence of `LOOPS.md`; no rendered evidence
         is involved.

**Refused, with the measurement:** a gate asserting *"a metric sample must not
be discarded when a commit falls between it and the next"*. The predicate is
true of **72 of 73** intra-day pairs today, so the gate would be red on a
correct tree from its first run — 94.11's base-rate rule pointing the other way
(there a predicate true of 100% distinguished nothing; here one false of 99%
would fail everything). The property belongs in the pairing's own reasoning, not
in a build gate.

## Slice 371 — `339.2` decided: the +303 is **THREE kinds, not two**, and 279.4's inline argument covers only **one of the two paragraphs it was thought to protect**. All three quoted fragments of that argument sit in the paragraph that STAYS; the cost narrative it was read as defending contains none of them, and every one of its figures is carried more completely beside `CLOSES_A_SLICE`. Rule 3: **975 → 907 words** (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 370 — Standardize sweep, **4 of 4 lanes**, all three artefact lanes clean; the finding is that **`351.1` was decidable from evidence `350.1` already carried in prose**, so the base-rate command now windows `a..b^`. Under `a..b` a sweep is classified *has lane input* on the strength of **its own commit** — `f9e0f17d..161ede68` is 16 commits, **15 touching no lane input**, the 16th being the sweep (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 369 — `338.1` decided: **refused on its named instance, and the instrument its own Accept prescribed is the wrong one.** `.bo-timeline__marker` prints at **5.66:1** (worst state), not the filed 2.54:1, because `print-color-adjust: exact` keeps its disc. The general gap is real and framework-wide — **19,511 of 26,817** painted text fills below AA on **125 of 128** pages — but every computed-style figure about it over-states, because Chrome rewrites light text on the way to paper (2026-09-09)

**Dispatched by rule 4**, on the oldest genuinely dispatchable open item. Rule 1
no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0** across **24**
open items); rule 2 `Standardize 3 / 4 ok`; rule 3 `Objective 0 / 3 ok`. Rule 5
was **EVALUATED, not skipped** even though rule 4 fires above it:
`Optimize 0 wake-date(s) newer — ok`, movers `gates` +1,
`dispatch-region-words` +60, `claims` +7, none a regression on two consecutive
runs. Step 1 read both intakes in the REST form with §8's controls — issues
**1** (#2, `updated_at` `2026-09-06T15:10:34Z`, unchanged since the previous
wake and already triaged as `300.2`), discussions **0**, `/not-a-real-route`
**404** — and triaged nothing.

**Everything older than 338 was re-derived as blocked from each item's own
text**, not from the hand-off's list: Slice 15 (owner hardware), `112.3`/`112.4`
(owner briefs), `249.7`/`249.10`-`249.13` (owner calls), `273.2`, `296.3`
(owner calls), `320.3` (**browser-blocked in the screenshot sense** — its Accept
says outright "a **rendered** change a cloud wake cannot judge"), `335.1`
(cloud-blocked in the WRITE sense). `338.1` is the oldest item this wake could
honestly take, and its own text says so: *"a computed-style reading under print
emulation is the right one, and a cloud wake can take that"*.

### The verdict on the named instance: REFUSED, with the measurement

`.bo-timeline__marker`, measured under `emulateMediaType('print')` on the built
site, both themes, `data-theme` forced exactly as 298.1 did:

| state | dark: glyph on disc | light: glyph on disc |
|---|---|---|
| `done` | rgb(134,239,172) on rgb(20,48,29) = **10.17:1** | rgb(21,128,61) on rgb(240,253,244) = **4.79:1** |
| `current` | rgb(94,234,212) on rgb(11,59,55) = **8.38:1** | rgb(17,94,89) on rgb(240,253,250) = **7.27:1** |
| `rejected` | rgb(252,165,165) on rgb(58,29,29) = **8.06:1** | rgb(185,28,28) on rgb(254,242,242) = **5.91:1** |
| `pending` | rgb(156,163,175) on rgb(38,42,51) = **5.66:1** | rgb(75,85,99) on rgb(243,244,246) = **6.87:1** |

The filed **2.54:1** is `rgb(156,163,175)` against **white**, and the marker
never meets white paper. `print/index.css` gives
`.bo-timeline__marker, .bo-stepper__marker { print-color-adjust: exact }`, which
keeps the disc — so the pair on paper is glyph-on-disc, and the worst of the
eight readings is **5.66:1**, above AA for normal text.

**The item's own gate already knew this and the gate's two paragraphs
contradict each other.** `check-print-tokens.mjs`'s *NO EXEMPTION LIST*
paragraph names that exact rule by file and selector; its *WHAT THIS GATE DOES
NOT SEE* paragraph, twenty lines later, computes the same marker against white
as though the rule were not there. Corrected in place by this slice.

**Not modelled — measured on the artefact.** "Backgrounds are dropped unless
`exact`" is a claim about what a printer paints, so it was taken from the PDF
rather than from computed style: `page.pdf({ printBackground: false })`, the
print dialog's default, inflating every content stream and parsing the fill
operators. Both marker discs, rgb(20,48,29) and rgb(11,59,55), are **PRESENT**;
the non-exact page canvas rgb(15,17,21) is **absent** in that same PDF and
**PRESENT** when `printBackground: true`. Two controls pointing opposite ways in
one artefact.

### The general gap is real, framework-wide, and NOT what a source trace predicts

`check:print-tokens`'s header calls this *"a narrow gap and not a
framework-wide one"*. Measured over all **128** built pages, dark theme,
`printBackground: false`, counting only fills that draw text:

```
distinct text fill colours actually painted : 40   (26,817 text fill ops)
below 4.5:1 against white paper             : 17 colours, 19,511 ops, 125 of 128 pages
```

So the mechanism the item filed is real and the word "narrow" is wrong. **But
the numbers a computed-style reading gives for it are all wrong**, and that is
this slice's substantive finding.

### Chrome rewrites the colour between the cascade and the paper

`print-color-adjust: economy` — the default — does not merely drop backgrounds.
It **darkens light text** when it drops them. Measured as a 2×2 on
`/concepts/scale/`, which is what identifies the mechanism rather than guessing
at it:

| | `printBackground: false` | `printBackground: true` |
|---|---|---|
| **dark theme** | rgb(249,250,251) → painted **rgb(166,166,167)** | painted rgb(249,250,251), unadjusted |
| **light theme** | rgb(17,24,39) → painted rgb(17,24,39) | rgb(17,24,39), identical |

The adjustment fires only when the colour is light **and** backgrounds are
dropped. The light-theme row is the control that rules out "the PDF just writes
different numbers".

What it does to the ratio, computed style → actually painted:

| token (dark) | computed | painted | computed ratio | **real ratio** |
|---|---|---|---|---|
| `--bo-color-text-primary` | rgb(249,250,251) | rgb(166,166,167) | 1.05:1 | **2.43:1** |
| `--bo-color-success-text` | rgb(134,239,172) | rgb(87,155,111) | 1.4:1 | **3.32:1** |
| `--bo-color-text-secondary` | rgb(209,213,219) | rgb(129,131,135) | 1.47:1 | **3.80:1** |
| `--bo-color-danger-text` | rgb(252,165,165) | rgb(168,110,110) | 1.9:1 | **4.10:1** |
| `--bo-color-accent` | rgb(45,212,191) | rgb(27,128,115) | 1.86:1 | **4.79:1 — PASSES** |
| `--bo-color-warning` | rgb(245,158,11) | rgb(245,158,11) | 2.15:1 | **2.15:1 — unchanged** |

**One row is not a magnitude error but a wrong verdict**: `--bo-color-accent`
fails the computed reading and passes on paper. A gate built on the instrument
338.1's Accept prescribes would have accused correct code.

**So the Accept's own sentence is false**, and it is corrected rather than
quietly satisfied: *"a computed-style reading under print emulation is the right
one"*. It is not. It is an INPUT to a system that rewrites it, which is
CLAUDE.md's downstream-artefact rule (*"when something DOWNSTREAM can rewrite
the artefact, its output is the artefact — not what you handed it"*) with print
as the downstream system. Whether the computed reading is *usable* is decided by
the question: for "does this element set its own colour and survive the print
reset", yes; for any RATIO that will be published, no.

### What the numbers do not cover, said before they are quoted

- **The 19,511 includes ~30 false positives from `exact` subtrees.** Four
  colours appear at their *unadjusted* token values — rgb(156,163,175) ×13,
  rgb(134,239,172) ×9, rgb(94,234,212) ×6, rgb(252,165,165) ×2 — which is the
  signature of a subtree Chrome left alone, i.e. the markers and `.bo-icon`.
  Measured against white they read 1.4-2.54:1; they are not on white. The same
  colours appear *adjusted* elsewhere in the same sweep, which is the internal
  reconciliation that identifies them.
- **One headless Chrome, one build.** Whether headed Chrome, Firefox or Safari
  apply the same economy adjustment is **untested here**. Firefox is not known
  to darken text this way, so the framework-wide reading is a floor for Chrome
  and says nothing about the others.
- **The classifier for "this fill draws text" is a lookahead** (`BT` before the
  next `re … f`), not a parse. It is a heuristic, and it is named as one.
- **10 of 128 pages do not get the print reset on `body` at all**, in both
  themes — the three `components/demos/*`, the six `patterns/rf/*` and
  `patterns/schedule/full`. Their `body` stays at the theme colours under print
  emulation. Filed below as `369.2`; not folded into the figures above.

### Two instrument defects, both caught before anything was published

Recorded because the base rate says to expect them, and both are textbook shapes
from CLAUDE.md:

1. **75,437 of 75,546 below AA — a 99.86% that was a defect in the instrument.**
   `getComputedStyle(el).display` does not walk ancestors, so every label inside
   a `@media print { … display: none }` subtree was counted as visible; the docs
   sidebar alone contributed 27,643. Fixed with `el.checkVisibility()` plus a
   non-empty `getClientRects()`, and red-proved both ways: an injected
   `color: var(--bo-color-text-muted)` paragraph moved the count `797 → 798` and
   the below-AA count `793 → 794`, appearing at exactly 2.54:1, while
   `.bo-sidebar-nav__label` reads `display: block` for itself and
   `checkVisibility() === false`.
2. **All seven PDF cases read "absent" — an identical value across every input.**
   The stream parser was fine; the fill matcher built `0.08\d*` while Chrome
   writes leading-dot floats (`.0784 .1882 .1137 rg`). It could not have matched
   anything, in either arm, and it looked exactly like a clean negative result.
   Fixed by parsing every operator to 0-255 and comparing with a ±1 tolerance.

### Commands, so the next wake re-runs rather than re-derives

Probes were throwaway and lived in the scratchpad, never the repo (three files:
computed-style walk, PDF fill sweep, 2×2). Each is `serve-dist.mjs` +
`browser-harness.mjs` by absolute path plus `page.pdf()`, and the re-runnable
core is:

```
node -e '…' # emulateMediaType("print"); control: body must read
            # rgb(255,255,255) / rgb(0,0,0), and 10 pages do not
page.pdf({ printBackground: false })   # then inflateSync every stream and
                                       # parse /([\d.]+) ([\d.]+) ([\d.]+) rg/
```

1. [x] **338.1 — the gap `check:print-tokens` cannot see.** **REFUSED on its
       named instance, with the measurement**, per its own Accept's second
       branch. `.bo-timeline__marker` reads **5.66:1** at worst, not 2.54:1;
       `print-color-adjust: exact` is why. The gate header's *WHAT THIS GATE
       DOES NOT SEE* paragraph is corrected in the same commit. The premise
       being false was a satisfying outcome, as the item said it would be —
       and the base rate the other branch asked for was measured anyway,
       because it is what says whether the gap is empty or merely not here.

**Filed by this slice:**

2. [ ] **369.1 — should printing from the DARK theme force the light palette?
       OWNER OR ARCHITECTURE CALL.** Measured above: **19,511 of 26,817**
       painted text fills, on **125 of 128** pages, are below 4.5:1 on white
       when a reader prints from the dark theme with the print dialog's default
       settings. Chrome's economy adjustment lifts the worst from 1.05:1 to
       2.43:1 and rescues exactly one token outright, and it is a UA behaviour
       no other engine is known to share. The framework already declares its
       intent — `reset/index.css` prints `body { background: #fff; color: #000 }`
       — so the question is only whether that intent should extend to the
       tokens that beat it on specificity.
       - **Accept — the property, and refusing is a satisfying outcome.**
         EITHER a decision lands that print re-points the `--bo-color-*` set at
         the light values (one `@media print` block re-declaring the theme, not
         a per-component sweep), with the same PDF measurement re-run to show
         the painted set moved and `check:print-tokens` amended, since that
         block would be a deliberate, wanted exception to the gate's own rule —
         OR it is refused with the reason recorded, in which case the gate
         header stops calling this gap "narrow", because measured it is not.
       - **Lane: owner-blocked.** It is a palette-wide behaviour change with a
         visible print result, and no wake should take it unilaterally.

3. [x] **369.2 — 10 of 128 pages never get the print reset on `body`.**
       Measured this wake, both themes, under print emulation: the three
       `/components/demos/*` pages, the six `/patterns/rf/*` pages and
       `/patterns/schedule/full/` keep `body` at the theme's own
       background/colour instead of `#fff`/`#000`. Every other page flips.
       Whether that is correct (these are embedded/full-bleed demo documents
       that may not be meant to print at all) or a specificity loss like the
       one 338.1 filed is **not decided here, because it was not measured** —
       the reset's loss was observed, the winning rule was not identified.
       - **Accept — the property.** Name the rule that beats
         `reset/index.css`'s `@media print { body { … } }` on each of the ten,
         then EITHER they are print-exempt by intent and that is recorded in
         one line, OR the reset is made to win and the same ten are re-measured
         showing `body` at rgb(255,255,255) / rgb(0,0,0). A cloud wake can take
         this: it is a computed-style reading, not a rendered image.
       - **DONE 2026-09-24.** The winning rule is each page's own inline,
         UNLAYERED `body { background; color }`: an unlayered author rule beats
         any `@layer` rule regardless of specificity, so `reset/index.css`'s
         layered `@media print { body }` loses on exactly the ten pages that
         build their own `<html>` (3 demos, 6 RF, schedule/full). Fixed by a
         literal `@media print { body { background: #fff; color: #000 } }` in
         each page's style block. Re-measured over a served build, print
         emulation, light and dark: 20 of 20 read rgb(255,255,255) /
         rgb(0,0,0); red-proof (deleting that rule at runtime) makes the
         readings revert on every page, so the probe can fail. Not covered:
         no `check-claims` case yet, so a new standalone page can regress it.

## Slice 368 — Objective grill of Slices 365, 366, 367: **45 of 50** published assertions reproduce, and the one substantive defect is a count taken over a population that was **7/15 one-line archive pointers** — an instrument that opened the stub instead of the body, which the slice's own red-proof structurally could not reach. The arming set needed resolving first: **all three** counter labels are item ids, and the hand-off resolved one (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 367 — `337.1` closed with a wrapper, because two of the three fixes its Accept offered were **not available**: `LOOPS.md` never carried a `-s` to drop (**0** occurrences of `npm run -s ` in the file), and the per-lane write-up rule is **4 of 15** sweeps old [**corrected by Slice 368: 5 of 15 in that population, 7 full write-ups across all 47 sweeps, and the convention is 27 sweeps old**]. The filed trap reproduces and is worse than filed — **0B stdout AND 0B stderr** — and a second byte-silent form exists that the item does not name (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 366 — `336.2` decided: **print the union** — and the base rate it was filed on is **1 of 7**, not 2 of 2: Slice 326 printed `union = 15` in its own entry and failed on the ENUMERATION instead, which no report line can prevent (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 365 — `334.1` decided: **retag**, and the premise it was filed on is false — the marker is only the THIRD text leg, and an identical unreachable branch passes or fails this gate on **one line of prose** (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 364 — Objective grill of Slices 360, 361, 362, 363: **73 of 78** published assertions reproduce, every headline figure and every verdict among them — and all **five** defects are again in a sentence that CHARACTERISES or CITES a measurement rather than in the measurement, which is **two consecutive grills, seven slices** (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 363 — Standardize sweep, 4 of 4 lanes. Lanes 1-3 carry no delta (and lane 2's "no delta" is **unchanged by construction** — the window never touched the path it reads). Lane 4's finding is `341.1`, closed on ONE of its two halves: the **79-word** aggregate a new collision falsifies is gone by shape, the **115-word** entry is refused, and Step 0c is **+4 words**, which is not a cut and is said so (2026-09-09)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 362 — `333.1` decided: **`tsconfig`, not a gate** — and the base rate the item pinned as "0 of 152" is 0 of 600 *consts* but **1 of 1,118 frontmatter bindings**, a dead import live for **22 days** (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 361 — `332.1` closed by auditing all 18 `ENVIRONMENT.md` sections against this container: **17 live** (four of them BIT this wake), **1 dead** — and the dead one's territory holds a live hazard pointing the opposite way (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 360 — `331.1` REFUSED on the base rate its own Accept demanded first: `api.json` contains **0** HTML start tags, so the half a prompt block exists for — **378 of 749** lines — has no source in the mandated provenance, and the fallback source carries only **61 of 263** substantive markup lines (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 359 — Objective grill of Slices 356, 357, 358: **60 of 64** published assertions reproduce, every red-proved headline figure to the digit — and all four defects are in a sentence that CHARACTERISES a measurement rather than in the measurement, which is 192.1's shape three slices running (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 358 — `330.1` closed by the census it asked for: the named failure mode has **one** live instance, not two (the second left `ROADMAP.md` when Slice 301 was archived), and **0 of 31** open items rest on an undisclosed sample (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 357 — Standardize sweep, 4 of 4 lanes, all clean — and the finding is that `350.1`'s "does this window have lane input" predicate is **not per-lane**: lanes 1 and 3 read the docs tree, lane 2 reads only the core stylesheets, so ORing the two inputs credits lane 2 with **41.7%** of windows it is structurally blind to (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 356 — `328.1` answered and closed as NOT-A-PATTERN: exactly **1** live instrument answers *"does this page show a result"* with a Demo-shaped signal — and measuring it found the surviving instance reporting the population where it means an eighth of it, 24 where the honest number is 3 (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 355 — Objective grill of Slices 353, 354: 103 of 107 published figures reproduce, and both defects are a number that is right at one revision and wrong at the one it ships on — 354's heading count is the body-only convention while its own population column is the whole-text one, and 353's verdict series describes the tip the wake READ (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 354 — `327.3` answered: 192.1 entered this loop's vocabulary as a NAME FOR A DEFECT, not as a step in a write-up — **12 of 21** citations quote its observation half, **1 of 21** its instruction half (and that one a restatement, not an application), and **1 of 161** slices since it landed carries the inventory it prescribes (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 353 — `326.3` answered: the question has no single answer because the region has two KINDS of growth, and the whole-region ratio that raised it cannot tell them apart — 73.5% of the growth since the item was filed is one generator section, and every one of the eight rules is flat (2026-09-08)

**Dispatched by rule 4**, cloud wake, on the oldest still-open item no other
kind of block covers. Every open item older than `326.3` was re-read in the file
rather than carried from the hand-off: Slice 15, `112.3`, `112.4`, `249.7`
(*"still waiting on 249.10"*, itself an OWNER CALL), `249.10`-`249.13`, `273.2`,
`296.3` owner-blocked; `320.3` browser-blocked in the screenshot sense, which
its own Accept says in as many words.

### The premise was re-measured first, and it has moved off the item

`326.3` states the region at **6,759 words**. At `HEAD` it reads **7,548**
(7,492 body + 56 heading words), **+789** since the item was filed at
`e1f5a12f`. The commands are the shipped instrument, so they re-run:

```
python3 scripts/loops/report_loop_prose.py     # the by-region block, and now per section
```

| section | at `e1f5a12f` | at `HEAD` | delta |
|---|---|---|---|
| `### Step 0c — …collisions are ACCEPTED` | 936 | **1,516** | **+580** |
| `### Step 1 — Triage new input` | 671 | 880 | +209 |
| all 14 other sections, the **eight rules included** | — | — | **0** |

**73.5% of the growth is one section and 26.5% is one other; nothing else moved
by a word.** So the item's own framing — *the region grows because the RULES
grew* — described `e1f5a12f`, where 326.2 measured it correctly, and does not
describe `HEAD`. That is not a correction to 326.2; it is the thing 326.3 was
filed to notice, arriving one day later in a different section.

### The answer: two kinds of growth, one number, and the number cannot separate them

- **A rule that changed** — rule 3 gaining 279.4's Polish amendment, rule 5
  gaining the comparable-set and `SKEW` blocks. 326.2 attributed the four
  2026-09-07 risers this way and refused a cut on it. **Accepted**: this is
  instruction, and cutting it removes what a wake executes.
- **A generator section** — 339.1's term: a recurring event, each instance of
  which writes a narrative inline. Step 0c is the worked case, and its series
  is the argument:

  ```
  aa550d2c  1,378   before 274.2's cut
  8848ed55    936   274.2 folds the collision forensics into LOOPS-archive.md
  86f034ce  1,500   collisions 3 and 4 written up in full
  f9e0f17d  1,322   339.1 applies the charter by hand
  299f7063  1,516   collision 5 written up in full   ← 138 ABOVE the pre-cut size
  ```

  Two cuts and a hand-applied charter in four days, and the section is now
  **larger than before either**. The charter's own sentence — *"A new collision
  adds a LINE here and its forensics to `LOOPS-archive.md`"* — sits inside the
  section that was growing while it was being written.

**Neither kind is a defect, and that is the point.** They want opposite answers,
they produce the same rising number, and the block a sweep reads printed only
the number.

### Both structural candidates the item named are REFUSED, each on a measurement

**A per-rule word ceiling — refused on base rate (94.11).** The eight Step-2
rules read **9 / 119 / 975 / 980 / 585 / 631 / 226 / 190** body words at `HEAD`.
A ceiling low enough to constrain the largest fails rules 3 and 4 at once, and
one set anywhere below 585 fails 5 and 6 as well — precisely the four sections
326.2 attributed to *rules that changed*, so it forces the cut 326.2 refused.
A ceiling above 980 binds nothing today, and the first thing to cross it would
be Step 0c at **1,516**, which is not a rule at all. And *"the decision content
is short"* is semantic: a ceiling counts bytes, not what they carry.

**A rules-file / rationale-file split — refused on this repo's only precedent,
measured rather than argued.**

```
git log --diff-filter=A --format='%H %cs' -- .roundtable/ENVIRONMENT.md   # f52f2597 2026-08-28
git show <rev>:.roundtable/RESUME.md | wc -w      # and ENVIRONMENT.md, at each rev
```

| | `RESUME.md` | `ENVIRONMENT.md` | Step-0 total |
|---|---|---|---|
| commit before the split (`c6eeb667`) | 3,150 | — | **3,150** |
| the split itself (`f52f2597`) | 1,683 | 1,666 | **3,349** |
| `HEAD` | 2,728 | 6,582 | **9,310** |

The split cost **+199 words the same day** (a pointer and a charter at both
ends) and the pair is now **2.96x** the pre-split file, the moved half at
**17 up / last cut 2026-08-30**. Step 0 names both files, so a wake reads both:
**the split moved the number and not the read.** That is 274.1's refusal in a
second instance, and 167.2's *"a pointer is read less than a paragraph"* is why
the only version that would reduce the read — telling the dispatcher not to open
the rationale half — is deletion wearing a filename.

### What the whole-region verdict has actually been saying

Over all **73** revisions of `LOOPS.md` since the 2026-08-20 base, the block's
verdict reads `FASTER` on **57** and `SLOWER` on **16** — and the last `SLOWER`
is `69cadcbb`, the revision before the share stepped 33.0% → 38.6% on
2026-08-28. The block landed at `aa550d2c` on 2026-09-05, **56 revisions and 12
Standardize sweeps after that step**, so every reading it has ever produced was
already fixed. It is not a dead detector — the share does move: 34.8% at the
base, 27.3% at its floor, 46.9% at its peak, 42.0% now. But it has not
discriminated once in its own lifetime, and **both times a sweep reached a
correct verdict on the region it came from a per-section reading that overturned
this one** — 308.1 (*"+877 is five new rules, Step 0c holds at 936"*) and 339.1
(*"the per-revision series says that verdict is wrong"*).

**CORRECTED by the Objective grill of 353/354 (Slice 355, 2026-09-08): the
three figures in this section were read at `299f7063`, the wake's Step 0 tip,
not at `1310b81a`, the commit that ships them.** As published they were
**72** revisions, `FASTER` on **56**, and *"42.0% now"*; at `1310b81a` — which
is this slice's own commit **and** the last revision of `LOOPS.md`, adding the
73rd revision and 66 words to the playbooks half — they are **73**, **57** and
**41.8%**. The counts above are corrected; the share is stated here with its
revision rather than as a bare *"now"*. `SLOWER` **16**, the `69cadcbb` anchor,
and the 34.8% / 27.3% / 46.9% readings are unaffected.

This is `ENVIRONMENT.md`'s *"when your own commit changes the file, `HEAD` is
the pre-change state"* bullet in its third consecutive instance, after `273.1`
and `274.1`. **The instrument was not at fault:** `report_loop_prose.py` prints
its revision in its own first line, and the figure was quoted into prose as
*"now"* with the sha dropped. The split table above, by contrast, is read at
`1310b81a` correctly — so this slice is inconsistent about which tip it stands
on rather than uniformly early. `353.2`, which files this same defect about the
metric, is untouched and stays open.

1. [x] **353.1 — the attribution 308.1 mandates is now the instrument's output,
       not a recipe a wake re-derives.** `report_loop_prose.py`'s by-region
       block gains per-section **body-word deltas since the last commit that
       REDUCED the region**, and `last_region_cut()` finds that anchor from the
       tip backwards, so no window can hide or manufacture it. At `HEAD` it
       prints **one line — Step 0c, +194** — where the ratio above it prints
       `FASTER`, as it has on every reading in its lifetime. Lane 4's hand-rolled
       `awk … | split on ^#{2,4}` recipe is replaced by the block that runs it.

       **The reconciliation's first draft could not fail, and the injection is
       what showed it.** It took the heading total as `region − body`, a
       residual that agrees with itself by construction: under an injection that
       drops a section from the split it printed `7,302 + 246 = 7,548` and
       **passed**. `dispatch_heading_words()` now counts the heading lines from
       the text, independently; the same injection then prints
       `7,302 + 56 = 7,358`, names the gap and exits **1**. The injection was
       confirmed to have landed before either result was believed — 16 sections
       became 15, body 7,492 → 7,302.

       **Validated against an independent source as well as by injection**,
       because an instrument's first output is not evidence. 339.1 published a
       Step 0c series derived by a different wake with a different `awk` method:
       **936 / 1,300 / 1,500** at `8848ed55` / `534b097a` / `86f034ce`. This
       parser reproduces **3 of 3 exactly**, and 339.1's five per-section deltas
       reproduce **5 of 5** — Step 0c +564, Step 1 +580, Step 2 +527 (rule 3's
       +303 plus rule 5's +224), Step 0 +151, and the loops table's +52 net,
       which the block reports as an explicit NEW/GONE pair because *eight*
       became *nine* in the heading.

       **Discrimination on real data, not only on fixtures:** over
       `8848ed55 → 632bfc46` the block names **rule 3, +303, and nothing else** —
       a different section on a different input, which is the property a
       per-section report has to have and the whole-region ratio does not.

       **Six new paired self-test cases** (19 total). The load-bearing pair is a
       `N. **` line inside Step 2, which is a section, against the identical
       line inside Step 0c, which is not — Step 0c carries a numbered list of
       collisions, and splitting on it would attribute the section's growth to
       whichever incident was written last. The section-dropping injection turns
       **6 of 6** of them red.

       - *Accept was*: a recorded decision or a recorded refusal with its
         reason, with "cut something" not the default. **Decided**: growth that
         is a rule changing is accepted; growth from a generator is the
         charter's business; and the instrument now says which is which, so the
         question is answered by a reading rather than re-argued every sweep.
         **No cut was made** — 274.2's and 339.1's between them are the evidence
         that a cut without a mechanism buys about fifteen commits.

       **What this does NOT claim.** It does not claim the region is too large,
       or that 7,548 is the right size, or that Step 0c should shrink. It
       measures where the growth is and hands the sweep the two branches; the
       branch that applies to Step 0c is **`341.1`, open** — which measured the
       identical series independently (`### Step 0c` .. `### Step 1` bounds
       rather than generic section bounds, and the same 1,378 / 936 / 1,300 /
       1,500 / 1,322 / 1,516), and found that the charter throttles only one of
       the generator's two outputs. **Nothing here re-decides that**; what
       changes is that the next lane-4 round is handed the section by name
       instead of deriving it.

2. [x] **353.2 — `dispatch-region-words` is sampled by hand, under a convention
       the instrument does not use, and no sample records the commit it
       describes.** 339.1's own text publishes the pair **7,476 → 7,298** while
       `report_loop_prose.py` prints **7,532 → 7,354** for those two commits —
       the constant 56, which lane 4 already documents so a wake comparing
       readings is not fooled. The part that is not documented is that the
       *metric* is the hand-rolled side: `loop-metrics.jsonl` records only
       `{ts, name, value, unit}`, so the newest sample (**7,492**, 2026-09-08
       00:17) cannot be attributed to a commit without re-deriving it, which is
       exactly ENVIRONMENT.md's *"a figure with no revision beside it is read as
       current"*. Rule 5 reads this name.
       - **Accept** — the property, not a predicted fix: the sample rule 5 reads
         is traceable to the command and the revision that produced it. Either
         this name's value comes from the instrument, **or** a recorded reason it
         should not — measuring that the hand-rolled convention is the one rule 5
         wants, and writing that down, closes it just as well. Finding that the
         two conventions should stay separate is a satisfying outcome, not an
         off-plan one.
       - **DONE 2026-09-24 — the instrument records it now, with the commit.**
         The premise was worse than filed. Each of the four samples matches
         exactly one `LOOPS.md` revision within minutes of it, and they split
         between conventions: 7,298 and 7,492 are BODY figures (`f9e0f17d`,
         `7e2c61c0`), while 7,552 and 7,484 are REGION figures (`f1e84a77`,
         `4e6b83c1`). So the pair rule 5 compared read −8 where the region fell
         by 64. Now `report_loop_prose.py --record [REV]` measures the region
         (headings included, the figure the report prints) and passes it to
         `record_metric.py`, which gains `--commit` and stores it in the jsonl
         row. `record_iteration.py` runs it on every Standardize row, at the
         recorded commit. First sample: **7,723 at `6d4fb0d4`**. A bad
         revision exits 1 and records nothing. Rule 5's newest pair is now
         region to region: 7,484 → 7,723, +239. LOOPS.md §3 says the old body
         samples must not be paired. Jev: supported 0.95.
         [**Corrected by Slice 384:** the auto-sampled name kept rule 5's freshness
         flag at ok while the names it can act on went unsampled; it no longer
         counts toward the flag. The sampling ran after `STATUS.md` was
         regenerated, ignored `--no-log`, and an older `--commit` recorded later
         could become the day's reading; all three fixed. The four matches are
         unique in time, not in value (other commits share those figures). And
         372.1's lead example carries the same convention mix, now noted
         there.]

## Slice 352 — `325.2` closed by WITHDRAWAL: the *Initial render* column's method is unrecoverable, and the measurement that decides it needs no knowledge of the missing machine — a machine gap is a roughly CONSTANT multiple, and this column's is 4.2x / 11.9x / 7.3x while its own neighbour's is 0.93x / 0.72x / 1.19x (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 351 — Objective grill of Slices 324, 325, 347, 350: 63 of 65 assertions reproduce to the digit, and the finding is that the base rate `350.1` tells a later wake to re-run counts a sweep's OWN conversions as inputs it had to read (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 350 — Standardize sweep, 4 of 4 lanes, all clean — and the sweep's own dispatch is the finding: rule 2's counter counts ROUNDS, lanes 1-3 measure ARTEFACTS, and **10.1% of windows can move neither** (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 349 — rule 3's text says "slices CLOSED"; its counter means "slices NAMED by a building row", and nothing has ever compared the two [**Corrected by Slice 382:** §6 step 0 had recorded the gap since `e721c20b`, 2026-08-29] (2026-09-08)

**Found the way `LOOPS.md` says this counter is always found** — by a number
disagreeing with something a human had just written down, read immediately
after recording an iteration, which is that file's standing instruction. The
previous hand-off predicted: *"closing anything in a slice other than 324 or
347 does it"*. This wake closed **`325.1`, an ITEM**; Slice 325 stayed open on
`325.2`. The counter armed anyway, to `Objective 3 / 3 OVERDUE [324, 325, 347]`
— and **one of the three armed slices is open right now.**

1. [x] **349.1 — rule 3 counts slices a building loop TOUCHED, not slices that
       closed, and the two have never been reconciled.** Step 2's rule 3 reads
       *"THREE OR MORE slices closed since the last Objective"*.
       `dispatch_status.py` never opens `ROADMAP.md`: it collects distinct
       slice numbers named by `CLOSES_A_SLICE` rows
       (`Continue`/`Standardize`/`Polish`) in `loop-log.md` since the last
       `Objective` row. A slice with one item closed and three still open
       counts exactly like a slice that finished.

       **Base rate measured before filing, per CLAUDE.md — it is not a
       hypothetical and it is not epidemic either:**

       ```
       python3 - <<'PY'
       import re,sys; sys.path.insert(0,'scripts/loops')
       from dispatch_status import ROW, slice_of, CLOSES_A_SLICE
       rows=[m.groups() for m in (ROW.match(l.rstrip()) for l in open('.roundtable/loop-log.md')) if m]
       named={slice_of(it) for _,lp,_,it in rows if lp in CLOSES_A_SLICE and slice_of(it)}
       cur=None; op=set()
       for l in open('ROADMAP.md'):
           h=re.match(r'^## Slice (\d+)',l)
           if h: cur=h.group(1)
           if re.match(r'^\s*\d+\. \[ \]',l) and cur: op.add(cur)
       print(len(named), len(named&op), sorted(named&op,key=int))
       PY
         #  258 distinct slices named by a building row
         #   12 of them (4.7%) are STILL OPEN in ROADMAP.md today
         #   -> 15, 112, 249, 273, 320, 325, 326, 328, 331, 332, 333, 339
       ```

       4.7% over the whole log, and **1 of 3 in the arming set live at this
       commit** — the rate that matters is the second one, because a rule with
       a threshold of three is decided by the marginal member.

       **This is the SIXTH shape of a rule-3 counter defect and the first that
       is not the parser.** The five in `LOOPS-archive.md` are all log
       conventions a regex missed; 279.4's is the loop SET. This one is the
       PREDICATE: every row parses correctly, every loop is the right loop, and
       the number still does not mean what the rule says. No widening of
       anything finds it — only comparing the counter against `ROADMAP.md`,
       which nothing does.

       **Which side is wrong is deliberately NOT decided here**, per CLAUDE.md's
       rule that a criterion names the property and never the verdict. Both
       readings are defensible: *closed* is what the rule says, and a grill
       wants finished material to find a pattern in; *touched* may be the
       better trigger, since three slices with work landed in them is arguably
       the same "enough material", and it is what every rule-3 dispatch to date
       has actually run on. **Finding that the counter is right and the TEXT should change
       is a fully satisfying outcome** — this item is not a bug report with a
       foregone fix.
       - **Accept:** the two are reconciled — either `dispatch_status.py` reads
         `ROADMAP.md` and counts closed slices, or rule 3's text in `LOOPS.md`
         is rewritten to say what the counter measures — **and whichever is
         chosen, the base rate above is re-measured at execution time** (the
         figures here are snapshots) and the decision records what the counter
         would have read historically under the other reading. A change that
         moves the live count must say what it moves it to and why that is
         right, not merely that it is now consistent.
       - **REPRODUCED UNPROMPTED on the very next wake (Slice 350,
         2026-09-08).** Recording that sweep took the counter to
         `Objective 4 / 3 OVERDUE [324, 325, 347, **350**]` — and Slice 350's
         only item, `350.1`, is **open**. So the arming set is now **2 of 4**
         open (325 and 350) where this item measured 1 of 3, and the newest
         member was armed by the row that filed an open question. Nothing was
         staged to produce it: the sweep was dispatched by rule 2 and read the
         counter afterwards, which is `LOOPS.md`'s standing instruction. It
         does not decide the item — a *touched* reading would count 350 too,
         and correctly — but it does show the divergence is live and growing,
         not a historical artefact of the 4.7% base rate.
       - **DONE 2026-09-24 — the TEXT changes; the counter was right.** Base
         rate now, with the command above: 281 slices named by a building row,
         10 (3.6%) still open. Replaying all 107 past grills (103 with a
         readable commit), with the counter's own `rows()`/`slice_of`, and
         classing each armed slice from `ROADMAP.md` at the grill's parent: of
         the 72 that armed on three touched slices, **only 42 had three
         closed**, so 30 would not yet have fired under the text's reading, and
         **24.0%** of all armed slices were open at dispatch. The replay agrees
         with this item's own 2026-09-08 record (2 of 4 open). So the text
         never described the loop that ran. The counter's reading is also the
         better trigger: Slice 377's grill armed on four open slices and found
         two shipped P0 defects, and counting closed slices is the regex §6
         step 0 already refuses. Rule 3 now reads *"slices with work landed
         since the last Objective — named by a building row; closed is not
         required"*, with the figures beside it; §6 step 0 and the counter's
         comment say the same. **The live count does not move** (Objective
         1 / 3 [348] before and after); only text changed. Script and output:
         `.roundtable/measure-349.1-2026-09-24.md`. Jev: supported 0.95.
         [**Corrected by Slice 382:** "slices with work landed" still missed what the
         counter reads: it credits the slice a row's label names, **whatever the
         row's outcome** (a refused row armed Slice 382), and rule 3 now says
         so. The 42 of 72 ran today's parser over history; the counter as shipped
         at each dispatch reads **28 of 63**, with 35 delayed under a closed
         reading, each by **1-21** further rows (Slice 377's by 5). "The regex
         §6 step 0 refuses" was the wrong reason — `roadmap_scope.py` already
         classifies slices — so the refusal now rests on the asymmetry alone.
         "24% of every arming set" was a pooled figure.]

## Slice 348 — `check:resume-slice-ids` reports a backticked DECIMAL FIGURE as a slice id, and files it under a heading that asserts an interpretation it cannot have earned (2026-09-08)

**Dispatched by rule 4** on `324.2` (Slice 324 above); this section carries the
one incidental finding, in the shape Slice 347 used for the same situation — a
defect surfaced by the wake's own recording step, in the advisory checks
`record_iteration.py` runs after the commit.

1. [x] **348.1 — a kB figure in backticks is indistinguishable from a slice id
       by shape, and the "absent" bucket claims otherwise.** Recording this
       wake's iteration printed:

       ```
       3 named id(s) are not in ROADMAP.md at all — normally archived, not a finding: 15.0, 15.10, 312.2
       ```

       **One of those three is a slice id.** `312.2` is real and archived.
       `15.0` and `15.10` are the gzip figures `324.2` measured, written in
       backticks in `RESUME.md` (*"printing the same `15.0`"*, *"`check:size`
       prints `15.10`"*), and `NAMED_ID` matched them.

       **Reproducer: the committed `RESUME.md` at this slice's own commit.**
       `grep -o '`15\.10`\|`15\.0`\|`312\.2`' .roundtable/RESUME.md` → 2, 1, 1.
       It was deliberately NOT reworded to suppress the symptom.

       **The report line is the defect, not the match.** The check is careful
       about exactly this everywhere else — its CLOSED bucket says outright
       *"this check cannot tell the two apart — you can."* The ABSENT bucket
       instead asserts *"normally archived"*, which is a claim about what the
       string IS, and it is the one bucket that has no way to check: an id
       missing from `ROADMAP.md` is missing whether it was archived or was
       never an id.

       **A shape fix looks available and is not**, which is why this is filed
       rather than patched. Requiring a non-zero item number would drop `15.0`
       — item numbers start at 1, so no derived id ever ends `.0` — and it
       would keep `15.10`, because `15.10` is *well-formed*: Slice 15 is OPEN
       in this very file and its live items are numbered **11 and 12**, so a
       `15.10` would sit directly above them and read as perfectly ordinary.
       (Checked rather than assumed: no `## Slice 15` heading exists in
       `ROADMAP-archive.md` and no `15.10` occurs outside this wake's own
       prose, so the id is not live *and* not archived — which is precisely the
       state the ABSENT bucket cannot distinguish from a figure.) A decimal
       figure and a plausible slice id genuinely coincide, and no regex
       separates them. This is roadmap 94.11's rule: the checkable shape is
       exhausted, so either the report changes or nothing does.

       - **Accept** — the property: either the ABSENT bucket's wording no
         longer asserts an interpretation the check cannot verify (matching the
         hedge its CLOSED bucket already carries), **or** a recorded refusal
         saying why the current wording is right, with the base rate measured —
         how many of `RESUME.md`'s revisions this bucket has fired on, and on
         how many of those the named string was a real archived id versus a
         figure. **Finding the false-positive rate negligible and refusing is a
         satisfying outcome**, and is the reason the base rate is part of the
         criterion rather than an afterthought.
       - **Do not suppress it by changing how a wake writes numbers.** The
         figures belong in backticks; a convention that bans them to keep an
         advisory check quiet would trade a real document for a clean report.
       - Measure first, and one command answers it:
         `git log -p --follow -- .roundtable/RESUME.md` piped through the
         check's own `namedIn` export, per revision. `LOOPS.md` Step 0 records
         that this check fired on **8 of 86** revisions on 2026-08-29 — that is
         the denominator to re-derive, and whether those 8 were ids or figures
         is exactly what nobody has looked at.
       - **DONE 2026-09-24 — reworded, on the base rate.** Replayed with the
         check's own code: each of the 244 `RESUME.md` revisions since it landed
         (`cfb53521`), with that revision's `ROADMAP.md`, run beside the
         committed script in a scratch tree. The ABSENT line printed on **127**,
         and **7** of those carried a figure shaped like an id: `15.0` and
         `15.10` (gzip sizes, 6 revisions) and `0.0` (a metric value, 1). The
         other strings were real ids, but not all archived: `185.2` sat in
         `ROADMAP.md` as a bullet, not a checkbox, so "not in ROADMAP.md at all"
         was false for it too. An independent port of the four regexes agrees
         on 244 of 244, and dropping `15.10` from it drops agreement to exactly
         238. A 5.5% false reading is small, but the fix costs one line, so the
         line now reads *"N backticked string(s) match no checkbox item in
         ROADMAP.md"* and ends with the CLOSED bucket's hedge (*"This check
         cannot tell which — you can."*); the printed output contains "normally
         archived" 0 times, and `--self-test` passes 12 cases.
         **The denominator did not reproduce, and it had propped up a false
         sentence.** Replays of the revisions up to 2026-08-29 give 23 or 30 of
         101, not 8 of 86, and no command was recorded. Since the check landed
         it has exited 1 on **216 of 244** revisions, so LOOPS.md's *"a report is
         a signal rather than the normal state"* was false; it now says a report
         is the normal state, to be read for which ids. Jev: supported (A 0.93,
         B 0.88, second round; the first read 0.79 / 0.04 on weaker evidence and
         a claim that said "re-derived").
         [**Corrected by Slice 382:** **8 of 86 does reproduce**, exactly, over the
         revisions up to `cfb53521` with the header's recipe, and all 8 were real
         closed ids; the "23 or 30 of 101" was a calendar-day window that took in
         15 post-landing revisions. **12 of the 127** absent revisions held a
         non-archived string, not 7: `288.1`/`288.2` sat as `###` headings on one.
         The self-test cited here could not fail on the change; it now pins the
         hedge and the `15.10` limit. And the hedge now carries the CLOSED
         bucket's staleness instruction, since an archived id is a closed one.]

## Slice 347 — rule 5's missing DIRECTION is refused, and the reason is not that it is hard to record: supplying it makes rule 5 fire on the one metric it can act on, and the log's own same-timestamp companion samples refute that verdict. `324.1` closed on its Accept's second branch (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 346 — Objective grill of Slices 322, 342: 20 of 22 assertions reproduce, and **both defects are a recurrence of something Slice 322 had just filed** — the next slice published a load-bearing number with no command, and the round closing its item missed the third copy of a correction because the phrase wraps (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 345 — Standardize sweep, 4 of 4 lanes. 342.1 closed with a verdict per SITE: **38 of the 52 dead declarations came from FOUR source lines**, and the eleven that remain are the eleven that were refused — the re-run lands on exactly the refusal set, not merely on the arithmetic (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 344 — 323.1: the two base-rate replays keep their different units, because the unit follows the LIFETIME of the state counted, not the unit the predicate compares — and the date replay reports the one verdict SKEW exists to soften on 2 of the 8 dates it is blind on (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 343 — 322.3: a whitespace-normalising helper is REFUSED on the base rate and on a caller count of zero — 1 of 14 published phrase-counts changes, and the two consumers that could have needed it were already safe (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 342 — 320.2: `scan:dead-style` judges each declaration on its own, and the blind spot was not empty — **52 dead declarations** were hiding behind live siblings, invisible to every sweep that has ever read this instrument (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 341 — Objective grill of Slices 316, 319, 339: 17 of 17 published assertions reproduce, and the finding is that Slice 339's generator thesis was confirmed by the very NEXT commit — Step 0c's cut lasted one wake, with the charter followed exactly (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 340 — 319.3: the four-page "overlap" was never coverage. `check:target-size` cannot see a named pixel size by construction, so growing it is refused on a red-proof, and the six claims move to the gate that CAN see them (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 339 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's regrowth is a THIRD case 308.1's fork does not name — the cut held perfectly and the charter behind it was never executed (2026-09-08)

**Dispatched by rule 2** at `Standardize 4 / 4 Continue rounds OVERDUE`, cloud
wake. Rule 1 no open P0 (`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**).
Step 0: `origin/main` arrived as a **forced update** again
(`26447ba...c87fc52`) — `ENVIRONMENT.md` trap 1 — fixed with `git checkout -B
main origin/main`; `git branch --show-current` re-read as `main` before
committing. Trap 2 clean in one `--unshallow`, no `shallow.lock`, tags again
arrived with it (`git tag | wc -l` → **8**). Step 1 read **both** intakes in the
REST form with its 404 control: `/discussions` **200 len 0**,
`/not-a-real-route` **404**, `/issues?state=open` **200 len 1**. **No new
untriaged input** — issue #2's `updated_at` is unmoved at
`2026-09-06T15:10:34Z` for a sixth consecutive hand-off — so **Step 1 committed
nothing**.

**Lanes 1-3 clean, and `n of 4` is said as the playbook requires.**

```
npm run scan:dead-style -w docs          # 0 dead of 1,365 attrs / 1,854 decls
npm run report:css-repeats -w @busy-office/ui   # 74 files · 242 rules · 230 bodies · 8 repeats
npm run report:prose -w docs             # 119 pages · median 798 · total 113,787
python3 scripts/loops/report_loop_prose.py
```

Lane 1 ran green **with `CHROME_PATH` exported in the same command** and the
workspace spelled `docs` — `337.1`'s live trap, avoided rather than met. Lane 2
is the **fifth** consecutive reading of `74/242/230/8`; the finding is the delta
and there is none. Lane 3's flagged union is **15** (10 over 2x the corpus
median, 11 over a family median), every one inside the pinned 16-set —
`158.1`'s twelve resolve to twelve page paths in the archive, `161.1`'s three,
`178.3`'s `/concepts/scale/`; the unflagged member is `/patterns/output-form/`.
Membership was checked against **the enumeration**, never the grep `326.1`
red-proved dead.

1. [x] **339.1 — lane 4: Step 0c regrew past its pre-cut size in one day, and
       neither branch of 308.1's fork describes what happened.**

       Lane 4 reports the dispatch region growing faster than the file (1,525 →
       **7,532** words, 42.3% of it). `308.1` says a rising region number is not
       a regrowth reading until it is attributed per section, so it was — on
       headings only, which is what that clause asks for.

       **Every per-section figure below is the SPLITTER's, and lane 4's 7,532 is
       the report's**; the two differ because the report counts heading lines and
       a body split does not. They reconcile at the constant the playbook names —
       7,532 − 7,476 = **56** — so the deltas agree exactly and the totals do
       not. Quoting one against the other would invent a delta that is not there:

       ```
       # per-section body words, dispatch region, at each revision since the cut
       git show <rev>:LOOPS.md | awk '/^## Playbooks/{exit} {print}'   # split on ^#{2,4}
       ```

       **Every changed section grew and none shrank** since the last cut
       (`8848ed55`, 274.2, 2026-09-05): Step 0c **+564**, Step 1 **+580**, Step 2
       **+527**, Step 0 **+151**, and the loops table +52 net as *eight* became
       *nine*. The largest is the section **274.2 cut**, which is 308.1's first
       branch — *the fold did not hold, another cut is the answer*.

       **The per-revision series says that verdict is wrong.** Step 0c held
       **flat at 936 across 15 consecutive commits** over two days, then moved
       twice on 2026-09-07: `534b097a` **+364** (collision 3's forensics) and
       `86f034ce` **+200** (collision 4's). It reached **1,500** — **122 words
       above the 1,378 it was cut from**.

       ```
       8848ed55  2026-09-05   936        274.2's cut: 1,378 -> 936
       … 15 commits …         936    +0  through 2026-09-07 (Slice 327)
       534b097a  2026-09-07  1300  +364  collision 3 written up in full
       86f034ce  2026-09-07  1500  +200  collision 4 written up in full
       ```

       **So the cut held perfectly and the charter behind it was never
       executed.** `LOOPS-archive.md`'s own Step 0c charter — written by 274.2 —
       says the decision, the cost, the fetch rule, the conflict recipe and the
       reopen condition stay inline and **the forensics move**. Collisions 3 and
       4 wrote their forensics inline anyway. Nothing executes that charter when
       the next incident is recorded, exactly like the polish re-queue rule that
       "was a rule a human had to notice. It was not noticed."

       **This is a third case, and the first two branches send a wake the wrong
       way on it.** Branch 1 buys another 15 commits; branch 2 ("other sections
       grew — do not reach for a cut") is false here. The distinguishing tell is
       that the regrowth is **new material**, so it is invisible in the
       endpoints and obvious in the series. Added to the lane-4 clause as a
       third branch, with the general form: **check whether the section has a
       GENERATOR** — a recurring event each instance of which writes a narrative
       there — because no cut can hold against one.

       **What was done about it: the charter applied, not a second cut.**
       Collisions 3 and 4 keep a one-line record inline, in the shape 274.2 left
       collisions 1 and 2 in; their forensics, the decision-time fixed-string
       re-check and the "it has happened once" stale-snapshot incident moved to
       `LOOPS-archive.md`. What CHANGES what a wake does stayed inline and is
       named: the pre-commit `git fetch origin main`, the renumber mechanic, the
       keep-both-rows recipe, "check the loser's output before discarding", and
       the guaranteed-conflict refutation.

       **Measured, and the first attempt did not work.** Applying the charter
       moved Step 0c **1,500 → 1,487**, a 13-word reduction: the narrative that
       came out was replaced by a paragraph explaining why it came out, which is
       the same accretion by another name. Tightened to the instruction, and the
       explanation put here and in the archive, it reads **1,322** — **178 below
       where this wake found it and 56 below the pre-cut 1,378**, with the
       dispatch region 7,476 → **7,298**. It is **still 386 above the 936 the cut
       achieved**, and that is stated rather than rounded off: the residual is
       instruction that landed after the cut (the renumber mechanic above all),
       not narrative, and cutting to 936 would remove what a colliding wake
       executes.

       **Two stale counts fixed in passing, same defect class as lane 3's
       "Verdicts to date" list**: `LOOPS.md` pointed at "the forensics of the
       first two collisions" and `LOOPS-archive.md`'s heading read "The two
       collisions" — both written when two was right, both stale from the moment
       a third landed. Both now name the subject rather than a count.

       *Accept was*: the region's rise is attributed per section before any
       verdict; the verdict names which of 308.1's cases it is, or records that
       none of them fits; and whatever is done leaves Step 0c's
       behaviour-changing content inline, verified by naming it. Finding the
       premise ("the fold did not hold") FALSE is a satisfying outcome and is
       what happened.

2. [x] **339.2 — the sweep's re-scan found a SECOND section with the same
       unexecuted charter, and this item is deliberately not the fix.**
       **DECIDED by Slice 371 (2026-09-09): split — the cost narrative moved,
       the loop-SET argument stayed uncut.** The +303 is three kinds, not the
       two the Accept anticipated: P3 (89w) is the operative loop set, pure
       instruction; P4 (160w) is forensics whose every figure was verified
       present — and more completely — beside `CLOSES_A_SLICE`; P5 is 279.4's
       lesson. **What settled it was that all three fragments this item quotes
       as 279.4's inline argument are in P5 and none is in P4**, so the cost
       narrative was never covered by the argument that protected the lesson,
       and moving it overrode nothing. Rule 3 **975 → 907** words. The premise
       re-measured clean: the filed 660 → 963 is the same series 12 words
       lower, and 12 is exactly the rule's own heading line, which
       `dispatch_sections` counts and 339's method could not have — that
       function landed a day later (`1310b81a`, Slice 353).

       `LOOPS.md` §3 step 4 says a round re-scans for another instance of the
       same drift. Applying 339.1's own general question — *does this section
       have a generator?* — to the other sections that grew since `8848ed55`
       finds one, with the identical signature:

       ```
       # rule 3's body words, per revision since 274.2's cut
       8848ed55  2026-09-05   660
       632bfc46  2026-09-05   963  +303   Slice 279.4
       … 18 commits …         963    +0   through 339 (2026-09-07)
       ```

       **One step, then flat for 18 commits** — the same series Step 0c showed,
       one narrative instead of two. Rule 3 carries an archive charter of its own
       (*"The five recurrence narratives — what each parser did, the replay
       figures, the counts that were snapshots — are in `LOOPS-archive.md`"*),
       and 279.4's +303 is a sixth blind spot written inline, replay figures
       included (`18 Polish rows naming 17 slices`, `crossings 51 → 52`, the
       12-slice list). Those figures already have a home the text itself names —
       *"in `dispatch_status.py` beside `CLOSES_A_SLICE`; re-run them, they are
       snapshots"* — so they are duplicated, not merely inline.

       **Why this is filed rather than cut in the same wake, which is 339.1's
       own third branch applied to itself.** That branch says: when other
       sections grew, *"a second cut would remove instruction rather than
       narrative … say so and file the structural question; do not reach for a
       cut."* And 279.4 **argues explicitly for its inline placement** — that its
       mechanism is the loop SET rather than a parser, that *"no widening of any
       regex could have found it"*, and that this is "the point". Overriding a
       stated argument is its own decision with its own reasoning; it is not a
       tidy-up at the tail of a sweep, and making it at speed is how instruction
       gets cut.

       **So the sweep exits with a KNOWN open item, and does not claim a clean
       pass.** `LOOPS.md` §3's exit is *"a clean pass finds nothing to
       consolidate"*; this pass found something and left it, which is stated here
       rather than implied by silence.

       *Accept*: the item names, sentence by sentence, which of rule 3's +303 is
       instruction (a lesson that changes what the next wake does) and which is
       forensics under its own charter, and either moves the forensics or records
       why 279.4's inline argument beats the charter. **Finding that the whole
       +303 is instruction is a satisfying outcome** and closes this item — the
       premise is that some of it is not, and that premise is checkable against
       the charter's own wording rather than against a word count. Re-measure the
       series first (the numbers above are snapshots, and the command is the
       block above them).

## Slice 338 — 316.1 built: `check:print-tokens` ships red-proved, the exemption list it was expected to need is refused on a measurement, and the gap it CANNOT see is filed rather than quietly widened (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 337 — Objective grill of Slice 297: `config.yml` is the router, not a third template, and the slice counted the escape hatch as an enforcer (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 336 — Objective grill of Slices 315, 332, 333: 26 of 29 assertions reproduce, and all three defects are a number that is a faithful reading of a DIFFERENT population than the noun beside it names (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 335 — 297.1 answered: both issues landed in the right channel, and the router that was supposed to put them there was never used (2026-09-08)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 334 — 315.3: `check:selftests` now RUNS each self-test, because the third rung of its own ladder was open — and the two costs that were expected to refuse it both measure zero (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 333 — 310.2: the five unrendered markup consts are deleted, and the reason is not tidiness — 3 of the 5 had already drifted from the showcase they describe (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 332 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 led to a mandated intake command that CANNOT RUN where most wakes run (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 331 — 294.2: the input block is fixed rather than reported, and all six proposals carry a verdict (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 330 — Objective grill of Slices 310, 328, 329: 23 of 25 reproduce, and the figure that does not is the one a design refusal rests on (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 329 — 249.9 built: the component catalogue ships with every field generated, and the miniature it specified is refused with the cost it asked for (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 328 — 249.6 built: the router lands, its "three rows have no rendered result" premise was FALSE, and the gate its Accept asks for cannot discriminate (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 327 — Objective grill of Slices 309, 323, 326: 74 of 75 published assertions reproduce, and both defects are in prose sitting BESIDE a measurement that is correct — one route claim nobody ran a command for, and a negative control whose own record destroyed it (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 326 — Standardize sweep, 4 of 4 lanes: the lane that warns against stale name lists carried one, and following it produced a false finding on a page verdicted ten days earlier (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 325 — 309.5: the `/stress` measurement is committed, and its own style-flush column shipped dead first — an identical ~0 across inputs differing 20-fold, because the event loop pays the recalculation between tasks (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 324 — rule 5's pairing test counted SAMPLES, so a 26-sample afternoon read as a series; re-scoped to distinct days its actionable input set is one metric, and the reason nobody records that one was a premise this wake refuted (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 323 — rule 5's staleness line compared naive stamps from two clocks, so a calendar boundary read as missing input; the fix states the skew rather than removing it, and the base rate that justifies it is invisible at date granularity (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 322 — Objective grill of Slices 304, 305, 320: 26 of 29 assertions reproduce, and both defects are a COUNT published beside a correctly red-proved fix. One of them the grill's own first instrument reproduced, by the same mechanism (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 321 — rule 4's oldest item asked a wake to re-measure an artifact that exists in no commit: the Gauntlet's bar protected the REFERENCE and never the graded thing, so three blind critic rounds bought findings nobody can check (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 320 — Standardize sweep, 4 of 4 lanes: two shared components carried the LAST inline spellings of two classes a 2026-08-17 sweep created to replace them, and lane 1's own headline number counts attributes while saying "declarations" (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 319 — Objective grill of Slices 298, 300, 318: 25 of 27 published assertions reproduce, and both defects are in what shipped BESIDE the number. Slice 317 audited a three-part runtime claim, removed the false third, and re-published the other two unmeasured — one of them is also false (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 318 — `check:claims`'s calendar case raced a real navigation against a fixed 400ms wait, turned `main` red once, and recovered on the next run without a code change. It is the file's ONE navigation-gated assertion that was not already using the file's own deterministic pattern (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 317 — 300.2's spike: the board's announcement cannot be decided once — 4 of the 5 things one generic core could not know are announcement strings — and the framework's answer to this screen kind already ships, saying something about itself that is not true (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 316 — 298.1: the second fixed-medium artifact was already here and PREDATES the first by 25 days. The two agree, and the half nobody wrote down is the load-bearing one — a theme token in `@media print` prints at 2.54:1 on white paper (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 315 — Objective grill of Slices 294, 312, 314: the gate written to catch a detector that cannot fail became one — `check:ci-ignores`'s `--self-test` has sat below an early return since 312.2 emptied `paths-ignore`, running 0 of its 18 cases while `check:selftests` reported it self-tested (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 314 — Standardize sweep, 4 of 4 lanes: lanes 1-4 clean, and the finding came from the re-scan step 4 mandates — 292.8's scope was "the whole page tree", and the 24 shared components/layouts that render INTO every page were outside every count it took (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 313 — 312.1 + 312.2: the honest reader set is FOUR gates, not two, and three of the four never spell the path at all. `paths-ignore` is removed rather than the reads, because keeping it means reversing three recorded decisions (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 312 — P0: `check:ci-ignores` asserts that nothing CI runs reads `.roundtable/**`, and two gates CI runs read it — one of them has the directory as a literal string in its own `ROOTS` array (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 311 — 294.1: the three probes are one line each, and the item's own reason for calling them harmless — "they arrive `@supports`-guarded" — is not a thing `derive-floor.mjs` can see. Adding the third opens the first hole in the floor where BCD says a browser will NEVER support it (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 310 — filed while closing 292.9: the two reference APPS hand a reader four deprecated glyphs that the docs gate deliberately does not cover, and `/base/motion` declares five copyable markup samples the page never renders (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 309 — Objective grill of Slices 307, 308: Slice 308 reproduces to the word, and underneath Slice 307's re-measurement is a P0 — the reference app's shared init has been swallowed by a trailing comment since 2026-08-23, so the select-all it timed did nothing (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 308 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's "the dispatch region is regrowing" is FALSE as stated — the section 274.2 cut has not regrown by ONE word, and the +877 is five new rules in five sections the cut never touched (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 307 — 296.2: the latency gate is REFUSED on the repo's own precedent, and the real defect was a published claim that cannot be reproduced by anyone else (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 306 — Rule 5's staleness line cannot reach `ok` from a cloud wake while the other dispatcher is a calendar day ahead (2026-09-06, triaged from inside a Continue round)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 305 — 296.1: the Gauntlet ran its full three-round budget and the artifact FAILED — the loop worked, the framework was never the gap (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 304 — Objective grill of Slices 300, 301, 303: 24 of 26 reproduce, and both failures are one defect — four figures quoted from a working tree that no commit ever held (2026-09-07)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 303 — The framework's central promise was documented, demoed, and ungated: the layered-reset recipe is now executable (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 302 — Step 1 mandates two intakes and a cloud wake could execute neither command; the Discussions half had no substitute at all, so the rule was unrunnable rather than merely awkward (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 301 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4 carried the eleventh archive sweep — 37.1% closed history down to 7.2% [**Corrected by 346.1:** 8.4%, per Slice 304's correction in this slice], the largest single move on record (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 300 — P0: the first two issues ever filed against this package, and the shipped CLI crashes on its own documented usage (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 299 — The SAME Objective grill, run twice by two dispatchers: this one lost the race and re-dispatched, and the re-dispatch is what caught the two things the winner did not — a metadata baseline that matches no revision of its gate, and the count Slice 298 diagnosed and left uncorrected (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 298 — Objective grill of Slices 292, 293, 295: 44 of 47 assertions reproduce, and the two real defects are a durable file that reads as universal and a claim I made about my own work (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 297 — Owner call: feedback intake stays on GitHub, and Discussions are enabled because issues were the only door (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 296 — Owner direction: a Gauntlet loop aimed at next-generation ERP UI, and 21st.dev read as a reference rather than a template (2026-09-06)

**Input**: the owner asked for (a) a **gauntlet loop** whose goal is "the new
generation ERP UI — performance, UX best for the user, scalable, secure,
modern", (b) `https://21st.dev/` explored, and (c) the roadmap updated so the
**scheduled** loop can run it.

**(c) needed no scheduling change, and that is worth recording rather than
silently relying on.** The wake prompt the owner pastes — and the cloud
routine runs — deliberately restates no dispatch order: it says *"act as the
Roadmap dispatcher exactly as `LOOPS.md` specifies… evaluate the dispatcher
rules in the order that file states them"*. That was a deliberate fix
(roadmap 102.4) after an earlier prompt drifted for weeks. So **adding the
loop to `LOOPS.md` is what schedules it**; no cron, routine or prompt was
touched.

**The loop is installed with NO counter and NO rule of its own.** It is
dispatched by rule 4 like any build item, when the oldest open item names a
gauntlet artifact. This file records **five** separate occasions where a
counter sat beneath an always-true condition and starved silently — Objective
alone lost ten slices — and a ninth dispatcher rule would be the sixth
instance. `LOOPS.md` §7 carries the playbook and states the overlap with
Polish, Objective and Continue explicitly, so a later wake can see why this is
not a duplicate of the blind re-score it resembles.

**The bar was adapted, not adopted.** The contribution's `BAR.md` graded
`ui_kits/` and `explorations/` against an `assets/` screenshot — none of which
exist in this tree. `.roundtable/gauntlet/BAR.md` now names references that
are actually here (`packages/core/media/list-report-compact.png`,
`check-po-app.mjs`'s route contracts, the reverted tree) and hoists the six
requirements every class shares out of the per-class lists.

**Two of the owner's five properties are NOT gradeable today, and the bar says
so instead of inviting a critic to judge them by feel.** This is the repo's own
base-rate rule applied to a rubric: a criterion nothing can measure is one the
builder argues past.

| property | instrument today | verdict |
|---|---|---|
| Performance | `check:size` gzip budgets over all shipped artifacts | **partial** — size only; no interaction-latency or render instrument, so an artifact may not claim runtime performance |
| UX / user-centric | Class B's five-minute blind task test | **gradeable** |
| Scalable | `/components/data-table`'s measured wide-table and 50-column demos | **partial** — a claim beyond what those measure needs a new instrument |
| Secure | **none** | **not gradeable, and the framework is the wrong layer** — it ships CSS and optional behaviours, holds no credentials, makes no requests, owns no data layer. The honest scope is a pattern page documenting the server contract it assumes, which is documentation |
| Modern | Class C: a guarded platform feature with the floor unmoved | **gradeable** |

**(b) 21st.dev, read against `references-are-floors`.** A community registry of
12,000+ React components distributed three ways — an **AI-ready prompt** pasted
into Claude Code or Cursor, the `shadcn` CLI, or copy-paste — on a
React + Tailwind + shadcn stack, with "you own the code, there is no version of
us to upgrade" as its stated philosophy.

**The stack is the one this framework refuses**, so nothing about React,
Tailwind or shadcn primitives transfers, and the contribution's own guide
already says its React wrappers exist for a design tool and not for the
product. What is genuinely interesting is narrower and is **already half-built
here**:

- **The ownership philosophy is this framework's existing position**, not a new
  idea to import: `dist/` copies into any asset pipeline, the cascade is the
  API, and there is no runtime to upgrade.
- **The AI-prompt distribution shape is the transferable part**, and the
  owner-supplied `registry.json` + `install-prompts.md` (Slice 294, item 2 of
  its order) are exactly that, rebuilt HTML-first. That is where this belongs —
  filed there, not duplicated here.

**Refused, so it is not re-proposed:** publishing to the shadcn registry
format as a distribution channel. `registry.json` in the contribution already
carries `$schema: ui.shadcn.com/schema/registry.json`, and shipping into an
ecosystem whose consumers expect React components would advertise this
framework as something it is not. The prompt half is the half that works
without the stack.

1. [x] **296.1 — DONE (refused at budget), Slice 305.** Run the first gauntlet round, Class A, on the reference this
       repo actually has.** Artifact: a rebuild of `/patterns/list-report` at
       `data-density="compact"`; reference:
       `packages/core/media/list-report-compact.png`. This is the smallest real
       exercise of the loop and it tests the loop itself as much as the
       artifact — a blind critic that cannot fail the builder is the failure
       mode to watch for.
       - **Accept** — the property, not a predicted verdict: a round is
         recorded in `.roundtable/gauntlet/ROUNDS.md` naming a critic that ran
         in a **fresh context** and did not see the build; the verdict is
         whatever it is, and a FAIL that stops at round three with the gap
         reported is a satisfying outcome. What would NOT satisfy this is a
         PASS graded by the builder, or a bar edited mid-round to make the
         artifact pass.

2. [x] **296.2 — DONE (refused, with the measurement), Slice 307.** An interaction-latency instrument, or a recorded refusal.
       The bar cannot grade "performant" beyond bundle size today. Either an
       instrument lands that measures something real in a browser — first
       input delay on a dense grid, time to interactive on the heaviest
       pattern page — or this closes as a refusal stating that size is the
       honest scope and why.
       - **Accept:** if built, it reports a number from a real browser run and
         is red-proved by making the measured thing worse; if refused, the
         refusal names what was measured to decide it. Finding that the
         existing `check:size` plus the data-table page's own measurements
         already cover the useful range is a satisfying outcome.

3. [ ] **296.3 — OWNER CALL: is "secure" in scope for this framework at all?**
       The bar currently says no, with a reason: the framework ships CSS and
       optional behaviours and owns no data layer, so a security claim would be
       about the *consumer's* server. The alternative reading is that pattern
       pages should carry a threat-model section the way they carry a data
       contract. **Not built either way without a decision** — it changes what
       every pattern page owes.

## Slice 295 — 249.15 built: the social card, generated from the framework's own stylesheet rather than drawn — and the gate arm it replaces had become undeleteable-by-design (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 294 — Triaged from an owner-supplied upstream contribution: six proposals arriving pre-sequenced, and the floor risk it names is real but already paid for (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 293 — Standardize sweep, 4 of 4 lanes: all four instrumented lanes clean for the fourth consecutive sweep, and the finding came from lane 1 FAILING — `ENVIRONMENT.md` §1c named a script deleted a week ago and missed the gate that actually needed the export (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 292 — Polish round 3 on `component/icon`: the page's Markup heading had been outside every `<section>` for 18 days, and the blind re-score then found the deprecation note resting on a **census** — "no pattern screen renders this glyph" — that a pattern screen falsifies (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 291 — Objective grill of Slices 286, 287, 290: 32 of 32 published assertions reproduce and the three slices carry no defect — so the finding is on the other side of the desk, where **4 of this grill's own 4 ad-hoc probes were wrong**, each one reconstructed from a slice's prose instead of run from the command beside it (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 290 — Standardize sweep, 4 of 4 lanes clean, and the reading that makes that honest rather than dead: the inputs three lanes measure did not move since Slice 284. Lane 4's carried worry — `LOOPS.md`'s dispatch region regrowing — did NOT continue, and step 1's one live candidate is refused by discrimination (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 289 — Objective grill of the three items built since the last grill (283.3, 284.2, 288.1/288.2): 22 of 28 assertions reproduce, all six that do not sit beside no command, and the one that matters put an **empty diff** into the Accept of an item that is still open (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 288 — 286.3 asked for a decision on `LOOPS.md` §3b step 4 and required its own base rate re-run first; re-running it is what found that **4 of its 7 independent-pass entries do not hold**, and that the step it calls dead has moved a score twice on real defects — the LABEL and the TRIGGER were the defect, not the content (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 287 — 283.3 asked whether an advisory check is enough, and the honest answer is that the question has an EMPTY DENOMINATOR: 0 Polish rounds have run since 283.2, so the check has never had a live opportunity to fire — closed by repairing the gap that IS measurable, the printed repair command nothing ran (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 286 — the defect Slice 285 listed under "what reproduced": 281's decay is dated to the hour and its CAUSE is false — `69a53364` is a pure addition that never touched the table, the table is still reached by the rule, and the claim was shipped in the `data-table` spacing cite (2026-09-06)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 285 — Objective grill of Slices 281, 283, 284: 31 of 33 assertions reproduce, and the one that matters is the measurement a design decision was BUILT on — "0 of 18 stamps reproduce at the parent" is **16 of 18**, and it had spread into the shipped script's own docstring (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 284 — Standardize sweep, 4 of 4 lanes: lanes 1-3 clean, and lane 4's finding is that 167.1's stated reopen condition for `CLAUDE.md` was MET — an eighth section on "can this detector fail" was added without folding, and the fold is this slice (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 283 — Polish round 3 on `table-toolbar`: the re-queue signal this loop's step 0 runs every wake is a CONSTANT for 7 of the 13 surfaces it reports, and 5 of those 7 were broken by 276.1 — the round whose whole subject was this script's blindness (2026-09-05)

**Dispatcher trace, cloud wake.** Rule 1: no open P0 — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and
`grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` reads **0**. Step 1 triaged and
committed nothing: no new input. Rule 2 `3 / 4 Continue rounds … ok`; rule 3
`1 / 3 slice … ok [281]`. **Rule 4 found nothing this wake can take**: all 12
open items were re-read from `ROADMAP.md` and each re-classified from its own
text per `LOOPS.md` 186.2 — owner-blocked (`112.3`, `112.4`, `249.7`,
`249.10`-`249.13`, `273.2`, Slice 15) or browser-blocked in the SCREENSHOT
sense (`249.6`, `249.9`, `249.15`; a LOCAL wake can take those three).
**Rule 4's sweep clause did not fire either** — `roadmap_scope.py` read
**218 / 3,398 = 6.4%** closed-history share at dispatch (`7079c94`), with Slice
282 the only eligible target. *(The previous hand-off predicted `0.0%` and 117 lines; the difference
is Slice 282's own text, which that prediction was made before writing. Read
the number, not the forecast.)* Rule 5 reports **STALE** — 2 wake-dates of
loop activity newer than the newest comparable pair — so per `LOOPS.md` it
**could not be evaluated** and is not reported clear. **Rule 6 matched.**

**The pick was re-derived, not inherited.** §3b step 1's ranking is degenerate
— every eligible surface is `content: 3` at `2/3 rounds, dry 0` (171.1 reaching
the pick step) — so the tiebreak is the one the last wake used: which surface's
SOURCE has moved furthest from the tree its score was taken against. Re-run
this wake rather than reusing the ordering, over each surface's own paths since
the commit that recorded its stamp:

```
table-toolbar  stamped 2026-08-25  7 commits since  churn +122/-17   ← picked
alerts         stamped 2026-08-31  5 commits        +46/-7
icon           stamped 2026-08-30  4 commits        +72/-4
```

`data-table` is out at `3/3`. `table-toolbar` leads on all three readings.

1. [x] **283.1 — DONE 2026-09-05. `polish_requeue.py` reports 13 surfaces as
       "SOURCE moved"; for 7 of them that sentence is a constant that no source
       change can set and no source change can clear. Five are 276.1's own
       doing, and every affected row is a behavior-serving surface: 7 of 9
       against 0 of 12.**

       **The round on `table-toolbar` is a NO-OP on the surface** — four arms,
       all clean, listed at the end. The defect is in this loop's step 0, which
       is where the last four rounds' findings have also landed (267.1, 276.1,
       278, 279); it was found by asking the arm nobody had asked, which is
       whether the ledger's own `src` column means anything.

       **What a re-queue claims, and when it stops being true.** A row says
       "source moved since the last round" by comparing a recorded digest
       against today's. That comparison is only meaningful while both were
       computed the same way. **276.1 widened the path set to include behavior
       modules and did not re-stamp the rows computed without them.** A digest
       over strictly more blobs can never equal one over fewer, so for those
       rows the two sides can never agree again — the re-queue is `True`
       unconditionally, and `--apply` has been reporting it as a measurement
       ever since.

       **Measured, with the command, over the 21-row ledger at `7079c94`:**

       ```
       python3 scripts/loops/polish_requeue.py --audit-stamps
       ```

       | verdict | rows | what it means |
       |---|---|---|
       | equals today's digest | 7 | not re-queued at all |
       | reproducible, current path set | 7 | the re-queue means what it says |
       | reproducible ONLY under the pre-276.1 set | **5** | stamped before the widening — permanently re-queued |
       | reproducible at no revision of its own paths | **2** | `data-table`, `pagination` |

       The five are `alerts`, `dashboard`, `stepper`, `table-toolbar`,
       `tree-table`, each reproducing **exactly** under the narrow set at the
       commit that recorded it (`alerts` → `4ee5ad51` is the narrow digest at
       `4beb4b86`, where the wide digest is `577cb919`).

       **The attribution is not inferred from dates — it is a clean split.**
       Nine ledger surfaces have behavior modules in their source set; twelve do
       not. **All 7 affected rows are in the first group and none is in the
       second** (the two behavior surfaces not affected, `inline-editing` and
       `scan`, both equal today's digest, i.e. were stamped after the widening).

       **The two `data-table`/`pagination` rows are a DIFFERENT fault, and it is
       stated as an inference.** Both closed their rounds after 276.1, so the
       widening cannot explain them, and 322 and 60 revisions of their own paths
       respectively reproduce their stamp under neither path set. Both stamps
       were written by a commit that ALSO edited the surface's source, and match
       neither that commit's tree nor its parent's — so the digest was taken
       from an on-disk state between the two. `digest()` hashes the **working
       tree** by design (145.3, its own comment), so running `--stamp` before
       the round's last edit produces exactly this. **The contrast is what makes
       it more than a guess:** `byline`'s round edited both its source files in
       the same commit and its stamp is the digest of that commit's tree, not
       its parent's. Same-commit stamping is fine; stamping before the last edit
       is not. §3b step 5 and this script's own USAGE both already say "at the
       END of a round" — nothing new is being asked for, so no rule is added.

       - **Accept:** the report says, for every surface it re-queues, whether
         the recorded stamp is reproducible from a commit, and the verdict is
         red-proved by injection with the injection confirmed to have landed
         **(DONE — below)**; the number of rows the audit calls unreproducible
         agrees with an independent walk of the same question **(DONE — two
         implementations, 7 and 7, agreeing row for row)**.

       **Red-proof, and what each injection proves.** The detector returns all
       four of its verdicts on real input — `reproducible` on 6 rows, `narrow`
       on 5, `orphan` on 2 — so it demonstrably discriminates before any
       injection. Then:

       - **A stamp no commit records.** `badge`'s `1f69e677` → `deadbe01`,
         asserted to be exactly 1 occurrence before replacing and confirmed at 1
         occurrence after. The row flipped from silent to
         `⚠ stamp unknown: no commit in the ledger's history records this
         digest`. Restored and re-verified at 1 occurrence.
       - **The condition is CLEARABLE by the documented mechanism, not just by
         a hand edit.** `--stamp component/alerts` wrote `ccdfb154` and the
         report went 13 → **12** surfaces with 7 → **6** warnings: the row left
         the re-queue set entirely, because a correct stamp equals today's
         digest. Restored.
       - **The `narrow` verdict is a path-set fact, not "the digests differ".**
         Computed outside the new code: `alerts` at `4beb4b86` is `577cb919`
         over 3 paths and `4ee5ad51` over 2, and the ledger holds the second.

       **What the cheap check does NOT cover, said outright.** `--check` runs at
       step 0 every wake, so it tests two revisions — the commit that recorded
       the stamp, and its parent. Its `orphan` verdict therefore means "not the
       digest at the commit that recorded it", which is a **superset** of "no
       revision reproduces it": a stamp seeded from a historical tree reads
       `orphan` and is fine. **`component/date` is the live case** — `orphan`
       to the cheap test, and reproducible at `3909b80a`, a day before the row
       was written, to the exhaustive one. It is excluded from the re-queue set
       (SKIPPED, deprecated) so no output claims otherwise, and this is why
       `--audit-stamps` exists rather than the cheap verdict being trusted.
       The two instruments were reconciled row for row on all 21 rows, not
       compared as totals.

       **Every figure above is read at `7079c94`, the tree this round opened
       against, and closing the round moved two of them.** §3b step 5's
       `--stamp component/table-toolbar` wrote `99f7ac9f`, and the report went
       **13 → 12** surfaces with **7 → 6** warnings — the picked surface leaving
       the re-queue set is the same clearance the `alerts` red-proof
       demonstrated, arriving as the round's ordinary last step rather than as
       an injection. So the committed tree reads 12 and 6; the 13 and 7 describe
       the state in which the defect was found.

       **Nothing was re-stamped, and that is a refusal with a measured reason.**
       Migrating the five to their wide-equivalent digest at the same commit is
       exact and preserves the row's meaning — and it **breaks its own
       detector**: `stamp_provenance` finds the commit that INTRODUCED a digest,
       so a migrated stamp would be introduced by the migration commit, where
       the source has since moved, and all five would re-read `orphan`. A fix
       whose own verification turns worse is not a fix. The durable form is
       283.2.

       **The four arms on `table-toolbar` itself, all clean.** (1) The ledger
       says "unscored in DSA" and `dsa-scores.json` carries no `table-toolbar`
       entry — consistent, and the page renders no stale *"Not yet scored"*
       block, which is 176.1's defect re-checked rather than assumed. (2) The
       wrong-choice clause is present and load-bearing: *"Do not add either to
       a read-mostly list"*, with the cost named (the table collapses to one Tab
       stop). (3) `PAGE_ONLY_BEHAVIORS` reconciles — the script's own assertion
       that the page imports `initTableToolbar` and `initDataGrid` passes, and
       the documented exclusion of `initDataTables` still holds. (4) The page's
       runtime claims are covered by `check:claims`, green in the gate run
       below. **No blind re-score was run, and that is deliberate**: §3b step 4
       exists so a round cannot mark its own homework, and this round changed
       nothing on the surface, so there is no score to mark. Recorded as a call,
       not an omission.

2. [x] **283.2 — DONE 2026-09-05 (cloud wake). The revision is recorded as an
       OPTIONAL suffix, seven rows migrated, and the item's own premise was
       half wrong: two of the orphans are not formula casualties at all.**

       **Dispatched by rule 4**, and the hand-off said rule 4 would not reach
       this item — *"rule 4 takes the oldest, and the nine older ones are all
       owner-blocked"*. **That reading is refuted by measurement.** Across all
       **917** revisions of `ROADMAP.md`, the oldest open item — Slice 15's *AT
       runtime evidence*, permanently owner-blocked on a human listening to a
       screen reader — has **never** been ticked `[x]`, while the loop log
       carries **573** `Continue` rows. If a blocked oldest item stopped rule 4,
       rule 4 could not have dispatched once in the life of this repo. It skips
       blocked items and takes the oldest *dispatchable* one, exactly as its own
       173.2 bullet describes.

       ```
       for sha in $(git log --format=%H -- ROADMAP.md); do \
         git show $sha:ROADMAP.md | grep -F 'AT runtime evidence'; done | grep -c '\[x\]'   # 0
       grep -c ' · Continue · ' .roundtable/loop-log.md                                     # 573
       ```

       **What shipped.** The `src` cell is now `<digest>` or
       `<digest>@<revision>`; `stamp_provenance` and `--audit-stamps` verify a
       suffixed stamp by ONE equality at that revision instead of searching;
       `--restamp SURFACE --at REV` performs the migration mechanically; and
       `--verify-stamps` runs advisory from `record_iteration.py`.
       `--check`: **12 re-queues with 6 uninformative → 10 with 0**.
       `--verify-stamps`: **7 → 0**. `--audit-stamps`: **2 DEAD → 0**.

       **THE REVISION CANNOT BE MANDATORY, AND THE ITEM ASSUMED IT COULD BE.**
       `--stamp` runs at the END of a round, which is BEFORE that round's
       commit, so the revision its digest describes does not exist yet.
       Measured over the 21-row ledger: every stamp that reproduces anywhere
       reproduces at the commit that **carries** it — **18 of 18** — and at that
       commit's parent, which is HEAD as `--stamp` saw it, **0 of 18**. A `@rev`
       written by `--stamp` would record the one revision the measurement rules
       out, on every row.

       > **CORRECTED 2026-09-05 by Slice 285.1 (Objective grill of 281/283/284).
       > The parent half of that measurement is wrong: it is 16 of 18, not 0 of
       > 18.** The `18 of 18` stands. What does not is `0 of 18` and the "on
       > every row" it carries — 16 of the 18 carrier commits never touched
       > their surface's own source (a NO-OP round commits the ledger and the
       > roadmap, not the CSS), so the digest at the parent is identical and a
       > mandatory `@HEAD` would have been RIGHT on those 16. Only `byline` and
       > `icon` — the two rounds that edited their surface in the same commit —
       > differ at the parent. **The decision to keep the suffix optional
       > survives on a different ground**, now recorded in `parse_stamp`:
       > `--stamp` cannot know whether the round will still commit a source
       > change, so it cannot write a revision it can *guarantee*, and a wrong
       > suffix is worse than an absent one because it is trusted by one
       > equality instead of searched for. See Slice 285 for the commands and
       > the reconciliation. So the suffix is written only where the revision is
       known by construction (`--restamp --at`, `--backfill`) and omitted
       otherwise. **Seven rows carry it, fourteen do not.**

       **283.1's refusal was right, and the suffix is what dissolves it.** It
       refused re-stamping because *"a migrated stamp is introduced by the
       migration commit and would re-read `orphan`"* — true, and confirmed:
       reconciling the two implementations row for row gives **6 agree, 5
       disagree, and on every disagreement the lookup is right**, because the
       search cannot resolve a stamp whose digest is not the tree at the commit
       that introduced it. That is the Accept's "disagreement recorded with
       which one is right", and it is the justification for the format rather
       than a wrinkle in it.

       **THE PREMISE WAS HALF WRONG: the two `orphan` rows are a DIFFERENT
       BUG.** The item reads *"every fault in 283.1 reduces to this"*. It does
       not. `data-table` and `pagination` were not orphaned by 276.1's path-set
       widening — `--stamp` ran mid-round and the round then **edited the
       surface's source again before committing**, leaving the stamp describing
       a working tree no commit carries. Proved exhaustively, not inferred:
       every committed blob combination was enumerated — **2** candidate trees
       for `data-table` (only `data-table.css` differs between its commit and
       the parent), **4** for `pagination` — and **none** reproduces the stamp.
       A recorded revision would not have prevented either; what catches them is
       `--verify-stamps` after the commit, which is why that shipped too.

       **The five were four before the work started.** 283.1 measured five
       formula-orphaned rows; `table-toolbar` cleared itself through the
       documented mechanism (a round ending in `--stamp`) in between. Re-derived
       per CLAUDE.md's premise rule rather than carried over.

       **Which rows still re-queue, as the Accept required.** All four migrated
       formula-orphans (`alerts`, `dashboard`, `stepper`, `tree-table`) **still
       re-queue** — their source genuinely moved since their recorded revision.
       So 276.1's orphaning cost *false confidence, not a missed round*, which
       is what 283.2 itself predicted, now measured. The two mid-round rows
       **stop** re-queueing, correctly: their source is unmoved since their own
       round's commit. That is the whole behavioural delta, 12 → 10.

       **Red-proved by injection, both directions.** Widening `source_paths`
       with one extra file — asserted present in the path set the gate reads
       before believing anything — takes `--verify-stamps` to 21 of 21, and the
       verdicts **discriminate**: all **7** suffixed rows report `path-set`
       ("the set this surface is computed over has changed since the stamp was
       written"), all **14** bare rows report an undiagnosed `orphan`. That is
       exactly the contrast the Accept asked for — the new form *says* a
       path-set change happened where the old form cannot tell it from source
       movement — and it reproduces 276.1's silent failure on demand. Injection
       reverted and re-confirmed absent. The advisory wiring was red-proved
       separately by discrimination: clean ledger → no stderr block; one stamp
       corrupted (asserted at exactly 1 occurrence before replacing) → a block
       naming exactly that row.

       **One dead detector was caught and killed inside this item.** The first
       version of the self-explaining `orphan` message asked whether the
       introducing commit touched the surface's own source with
       `git log -1 <rev> -- <paths>`. That form walks **back** from `rev` and
       answers with the newest touching commit at or before it, so it is
       non-empty almost always: it claimed `f57570f4` touched `component/date`'s
       source (it touched none of it) and answered `a098cf85` — a different
       commit — for `6cb26268`. Replaced with `git diff-tree --no-commit-id
       --name-only -r <rev>`, which discriminates: the two mid-round rows get
       the mid-round diagnosis and `date` correctly gets the plain orphan. Found
       by the message disagreeing with a probe taken minutes earlier, which is
       the only thing that ever catches this shape.

3. [x] **283.3 — DONE 2026-09-06 (cloud wake), and the answer is neither branch
       as written: the sufficiency question has an EMPTY DENOMINATOR — 0 Polish
       rounds have run since 283.2, so the advisory check has never had a live
       opportunity to fire. Closed by shipping the self-healing branch instead,
       at the one step whose write lands in the round's own commit. See Slice
       287.** Original text follows.

       **`--stamp` cannot verify its own output, and the fix for that
       is ordering plus an advisory check. Is that enough?** 283.2 shipped
       `--verify-stamps` (advisory, post-commit) and a `LOOPS.md` rule that
       `--stamp` runs last. Both were the affordable fix, and neither *prevents*
       the fault — a round that stamps early still ships a dead stamp and learns
       about it one command later, if whoever is reading stderr notices.
       - **Accept:** either a mechanism that makes an early stamp impossible or
         self-healing (e.g. `--stamp` recording the paths' blob SHAs so a later
         edit is detectable without a commit, or the stamp being written by the
         commit itself), **or** a recorded refusal measuring why the advisory
         check is sufficient — including how many rounds since 283.2 stamped
         early, which `--verify-stamps` now makes countable. **Finding the
         advisory check sufficient is a satisfying outcome**; the base rate is 2
         in the 21 rows this ledger has ever held, both on one day.

       **283.2's ORIGINAL TEXT AND ACCEPT, kept verbatim below** on the
       precedent of Slice 147's owner call — the premise corrections above are
       only checkable against what the item actually said.

       > **the ledger records a digest with no revision beside it, so a
       stamp cannot be audited or migrated without guessing which commit it
       describes.** Every fault in 283.1 reduces to this: the `src` cell says
       *what* the source hashed to and never *when* or *over which path set*,
       so a formula change silently orphans every existing row and the only way
       back is a search over history that can be wrong (`component/date`).
       A stamp that carried its revision would make `--audit-stamps` a lookup,
       make migration after a path-set change mechanical, and make the two
       `orphan` rows self-explaining.
       - **Accept:** a stamp records the revision it was taken against as well
         as the digest; `--audit-stamps` reads that revision instead of
         searching for it, and its verdict for every row agrees with the
         current searching implementation on the tree as it stands **or the
         disagreement is recorded with which one is right**; the five
         pre-276.1 rows are migrated to the current path set at their own
         recorded revision and stop re-queueing unconditionally, verified by
         `--check` reporting them only when their source has actually moved;
         and a red-proof shows the new form catching a path-set change — widen
         the set in a throwaway edit and confirm the audit says so rather than
         reporting every row moved. **Finding that a migration is not worth the
         format change is a satisfying outcome**: record which of the five
         would still re-queue on their genuine source movement (all five have
         moved since their stamp, so the practical cost today may be only the
         false confidence, not a missed round).

## Slice 282 — the twelfth archive sweep, taken 3.5 hours after another wake REFUSED it: 13 slices moved, and the finding is that the five recorded sweep decisions lie on no threshold in either unit — the tenth ran at 3,790 lines / 55.1% and today's refusal came at 5,450 lines / 40.6%, a longer file refused for being a smaller fraction closed (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 281 — Polish round 3 on `data-table`: the `spacing` cite's worked example stopped being reachable by the rule it explains ONE DAY after it was measured, and all three live copies had also dropped the sentence separating the two effects it describes (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 280 — Objective grill of Slices 276, 277, 278, 279: 52 of 54 assertions reproduce, and the two that do not are one sentence apart in a table that measured the tree BEFORE its own fix while describing the tree after it — the two rows it dropped are the two surfaces that same item added (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 279 — Polish round on `scan`: the demo runs, and the finding is that the ONE pattern screen the component's own page points at is the one that never links it back; then reading the counter right after recording found rule 3 has been blind to 12 closed slices for the whole Polish-dispatched era (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 278 — Polish round on `table-toolbar`, the surface every prior round dropped: the two behaviors this page documents as a pair make the grid keyboard-unreachable when they meet — hiding the column the cell cursor sits in strands the grid's ONE tab stop on a `[hidden]` cell (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 277 — Polish round on `pagination`: six cites hold, and the finding is a runtime claim published in four places, asserted in none — `data-load-more-auto`'s only test says it *does not throw* in an environment where the feature cannot exist (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 276 — Polish round on `inline-editing`: every arm on the surface reproduces, and the finding is in step 0's own source map — a surface's source set stopped at CSS, so 31 commits changed a behavior module with nothing to notice [**Corrected by 346.1:** 51 commits across 9 surfaces, per 280.1] (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 275 — Objective grill of Slices 271, 272, 273, 274: 271 and 272 reproduce whole, and all three defects are one shape — a figure the wake's OWN commit moved, read from `HEAD` and published as the commit's state (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 274 — Standardize sweep, 4 of 4 lanes: three clean, and lane 4's finding is that its own instrument measures the wrong box — `LOOPS.md`'s every-wake DISPATCH region grew +300% where the file grew +220%, so the row a sweep reads understates the burden it exists to catch (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 273 — Polish round on `byline`: six cites hold and five arms reproduce, and two findings — the reason `LOOPS.md` records for `dry = 0` was false in the commit that wrote it, and the blind re-score found the page recommending the context its own wrong-choice clause forbids (2026-09-05)

**Dispatcher trace, cloud wake.** Step 0: container **DETACHED** again
(`git branch --show-current` empty; `HEAD` at `14947d1` with no local `main`) —
ENVIRONMENT trap 1, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` clean in one attempt (**1,877** commits, no `shallow.lock`)
and `git fetch --tags origin` brought all **seven**, so trap 2 did not bite —
the hand-off's instruction to fetch tags explicitly rather than expect either
outcome is what made that a check instead of an assumption. Rule 1: no open P0
— `list_issues` on `Busy-Office/busy-office-ui` returns `totalCount: 0`, and no
open `N. [ ]` item is a P0. Step 1 triaged and committed nothing: no new input.
Rule 2 **3 / 4 … ok**; rule 3 **2 / 3 … ok [271, 272]**.

**Rule 4 found nothing dispatchable**, and per `LOOPS.md` 186.2 the kind is
named rather than lumped, each item re-read from `ROADMAP.md` this wake rather
than copied from the hand-off: **owner-blocked** Slice 15, `112.3`, `112.4`,
`249.7` (its own text holds its seed for 249.10), `249.10`-`249.13`;
**browser-blocked in the SCREENSHOT sense** (a LOCAL wake can take these)
`249.6`, `249.9`, `249.15`; **agent-blocked** none; **not blocked** none.
Rule 4's own sweep clause did not fire either: `roadmap_scope.py` reads
**837 / 3,689 = 22.7%** closed history, of which **673 lines are the four
targets 236.2 pins to open Slice 249**, leaving Slice 272 alone — one slice,
moved one wake ago — as the whole eligible scope.

Rule 5: `dispatch_status.py` reads `2 wake-date(s) newer … STALE`, so the trend
clause **could not be evaluated** rather than being reported clear. The rule's
SECOND clause (184.2's, "a size budget breached outright") **was** evaluable and
is clear — `check-size.mjs` passed at *139 shipped payload file(s) in 11 budget
bucket(s), 376.2 kB gz total; tightest headroom 110 bytes*
(`css/brand-navy.min.css`), the same reading 268 recorded. Rule 6 fired.

### The pick

§3b step 1: every non-skipped row scores 3, so "lowest score" does not
discriminate and "fewest rounds used" does — **4 rows at `1/3`** against 16 at
`2/3`. 268's rule drops `inline-editing` and `table-toolbar` (no
`dsa-scores.json` entry, so no arm can disagree with them), leaving `byline` and
`pagination`. `byline` taken.

### `byline`'s own six cites all hold

Checked at the source, comment-stripped where the claim is about declarations.

- **typography** *"sizes from `--bo-font-size-sm/xs`; no raw font-size"* — both
  tokens present, **0** raw `font-size` values.
- **colour** *"zero raw colour; name is emphasis ink, remainder secondary"* —
  **0** hex/`rgb(`/`hsl(`; `--bo-color-text-secondary` on the base and
  `--bo-color-text-primary` on `strong, b`, exactly as claimed.
- **spacing** *"zero raw dimension literals — the whole file is tokens"* — holds
  on the unit-bearing reading arm 5 uses. `min-inline-size: 0` is the one bare
  number, and it is **not** a byline literal: the same idiom appears in **16**
  component files. Recorded because it was the round's most promising-looking
  defect and the base rate is what refuted it.
- **interaction: `na`** *"plain markup, no behavior"* — holds on both readings
  the ledger now has: `behaviors.json`'s `byComponent.byline` is `[]` (arm 9)
  and `byline.css` paints **zero** interaction-state selectors (arm 10).
- **content** — the quoted clause renders on the built page (arm 4), and
  `check:wrong-choice` passes at *156 assertions / 80 pages / 1 outstanding*.
- **fit** *"record headers, comments, feed items, audit notes; composes
  `.bo-avatar` rather than owning a disc"* — the opener names all four contexts;
  `byline.css` paints no disc and says so in place.

`byline.css`'s comment also asserts a fact about **another file** — *"Breaking
(listed in the CHANGELOG)"*. It holds: `CHANGELOG.md:1265-1271` carries the
`.bo-avatar` promotion as a **Breaking** entry in those words. It is the only
such cross-file claim in the shipped CSS (`grep 'in the CHANGELOG'` → 1).

### The arms

| arm | reading |
|---|---|
| 1 wrong-choice clause | `156 assertions / 80 pages / 1 outstanding` (the skipped `date`) |
| 2 score rendered by its page | `360 assertions / 40 scored`; `Not yet scored` in **0** dist files |
| 3 line-number cites | **0 of 40** — 266's fix has not regrown |
| 8 `interaction: na` pages importing a behaviour | **0 of 16** |
| 9 `interaction` vs declared `@serves` relation | `na`&served **1** (`stepper::initWizard`); 3&served 17; 3&none 7; `na`&none 15 |
| 10 `interaction: na` painting its own state | **1 of 16** — stepper, 3 × `[aria-current` |
| 13 **NEW** — cites naming another component's class | **17/17** resolve against `api.json` |

Arm 9 **reproduces 268's table with breadcrumb's fix applied and nothing else
moved** — `3/none` 6 → 7 and `na/none` 16 → 15, the two cells 269's `na`→`3`
had to touch, with `3/served` unchanged at 17. That is the independent
reconciliation, not the arm's own say-so.

**Arm 9's first implementation returned `served = 0` for all 40**, because it
looked `byComponent` up by CSS class where the file is keyed by component name.
Caught by this repo's own rule — an identical value across many inputs is a
defect in the instrument until proven otherwise — before any verdict rested on
it, and the corrected arm is what the table reports.

### Arm 13, and why its 17/17 is not offered as a gate

Red-proved by injection, the injection confirmed before the red was believed:
renaming `byline · fit`'s `.bo-avatar` to `.bo-avatarr` (asserted absent from
`api.json`) takes the arm 17/17 → **16/17** naming that exact cite. So it can
fail. But resolution is not truth, and the arm's value is in the second
reading, which is a human one: of the three cross-component claims spot-checked,
`progress · fit`'s *"the source names `.bo-stepper`"* holds at
`progress.css:8`, `byline · fit`'s composition holds, and `sidebar-nav · fit`'s
*"composes inside `.bo-offcanvas`"* holds as real DOM nesting on **117 of 165**
built pages — not as file co-occurrence, which is the weaker reading this
repo has been caught by before. A 100% existence check that distinguishes
nothing today is 94.11's refused gate, so arm 13 is reported, not shipped.

1. [x] **273.1 — the finding: `LOOPS.md`'s reason for `dry = 0` was false in
       the commit that wrote it.** Parsed over **all 30 revisions** of
       `.roundtable/polish-state.md`: `budget_spent = 0` and `dry > 0` count
       **0 in 30 of 30**, so the numeric claim still holds on a denominator
       that has grown from 11. The **reason** does not. It read *"every seeded
       surface landed its clause in one round, so nothing ever got a second
       round to be dry in"* — written in `eb7fd36c` (2026-08-28 16:41:03Z), a
       revision whose own ledger already carried `component/scan` at `2/3`.
       Today **16 of the 20 non-skipped rows carry a second round** — **CORRECTED
       by 275.2 (2026-09-05): 16 is the reading at `d8c9b5d1^`, and this slice's
       own commit `d8c9b5d1` makes it 17**, the seventeenth row being
       `component/byline`, the surface this very round was polishing. The figure
       was read from `HEAD` at dispatch and published as the state of the commit
       that moved it. The conclusion below is unaffected: `dry > 0` and
       `budget_spent` read 0 at all three revisions, so it survives on 17 exactly
       as on 16 — **8** of
       them recorded `NO-OP` on the surface, and `dry` reads **0** on all
       sixteen. So the counter is zero because **no round has ever incremented
       it**, not because no round could — and the two are not the same fact:
       one is structural and needs nothing, the other is bookkeeping that is
       not happening. Stated in both places `LOOPS.md` carried it (rule 6, and
       §3b's Exit), corrected in place rather than appended, because lane 4's
       ratchet reads `LOOPS.md` as accumulating with no cut behind it.
       - **Accept:** the parse is red-proved by injection **(done — a copy of
         the ledger with `byline` set `dry 1` and `pagination` set `3/3`, the
         injection confirmed present in the file, moves the reading from
         `dry>0=0, spent=0` to `dry>0=1, spent=1`)**; and `LOOPS.md`'s wording
         states the property to re-measure, not the value it will have.

**Sent to the owner rather than resolved here:**

2. [ ] **273.2 — §3b step 5 mandates `dry++` on a round whose score does not
       move, and no round has ever done it. OWNER CALL.** The conflict is real
       in both directions and neither side is safe to take unilaterally:
       - **Start incrementing** and the 8 NO-OP rows go to `dry 1`; the next
         no-op on any of them marks it DRY, forfeits its budget, and
         `polish_requeue.py` stops re-queueing it. Within a few wakes that
         empties the Polish lane — which is **exactly what 176.3 refused**,
         on the measured ground that the redundant-looking second rounds are
         the lane that finds the real defects.
       - **Leave it** and §3b step 5 is a written rule that nothing executes,
         which is the shape this repo keeps paying for (`check:resume-charter`
         hardened and demoted 44 minutes apart; rule 5 keeping only its dead
         half for six days).
       - The empirical input the owner should have: of the **8** rounds
         recorded NO-OP on their surface, **6** filed a real defect found
         elsewhere in the same round (231.2, 267.1, 268.1, 269.1, 270.1, and
         tree-table's base-rate correction); **2** — `badge` and `stepper` —
         found nothing at all. So "the score did not move" and "the round was
         busywork" have come apart 6 times out of 8, and `dry` as written
         cannot tell them apart.

         **RE-MEASURED 2026-09-05 (cloud wake): it is now 9 and 7, and the
         figure above was already one short when this hand-off quoted it.**
         `inline-editing`'s round (2026-09-05) filed **276**. The count and
         its instrument, so the next reader re-runs it rather than
         re-deriving:
         `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **9**,
         reconciled against the ledger's own table rows (same nine surfaces:
         alerts, badge, breadcrumb, inline-editing, navbar, progress, stepper,
         tree, tree-table). The two that found nothing are unchanged —
         `badge` and `stepper`. **This corrects the number, not the
         argument**: the ratio moved 6/8 → 7/9 and the conclusion is the same
         one, which is why it is amended in place rather than reopened. The
         figure goes stale on every Polish round, so **re-run the command
         before quoting it to the owner.**

         **It went stale on the very next round: 283 makes it 10 and 8.**
         `table-toolbar`'s round 3 (2026-09-05) is a tenth NO-OP on the
         surface and filed a real defect (283.1), so the same command now
         reads **10** and the ratio is **8/10**. Amended in place for the same
         reason as the line above — the number moved, the argument did not,
         and the two that found nothing are still `badge` and `stepper`.
         Two consecutive rounds now carry an in-place correction of this
         tally, which is itself input to the owner call: a figure that needs
         re-measuring every round is a poor thing to have hard-coded in the
         item that asks the owner to decide on it.
       - **Accept:** the owner picks one of — execute step 5 as written;
         redefine dry as "no score movement **and** no finding filed"; or
         delete the dry exit and say Polish runs until the owner stops it.
         Whichever is picked, `LOOPS.md` §3b step 5 and rule 6 agree with the
         ledger's own columns afterwards, asserted by re-running the parse in
         273.1 rather than by reading the prose.

### §3b step 4 ran, and it is what found the surface's own defect

A second agent was given the surface, the dimension and the rubric text, and —
per 268.2, which is the first round to apply that correction rather than record
it — was told **outright that the built page publishes a prior verdict, that
the published value is not evidence, and to reach its own reading from the page
source and the shipped CSS first**. It returned **3**, quoting the same clause
and naming the same `data-table` alternative.

**The direction of the bias is stated, per 268.2: this re-score AGREES with the
published value, so it is weak evidence for the score itself.** What it is not
weak evidence for is what it found unprompted, which no arm in this ledger
looks at: **the page recommends the context its own wrong-choice clause
forbids.**

3. [x] **273.3 — byline's wrong-choice clause forbids a POSITION while its
       reasoning forbids a PRACTICE, and the framework's own screens sit in
       the gap.** Three artefacts disagree, each measured this wake:
       - The opener says *"**Not inside the cells of a sortable grid**"* and
         draws its boundary at *"whether the reader scans DOWN a column"*.
       - `--compact`'s rationale said *"for dense feeds and table cells"* — in
         the docs heading **and in the shipped CSS comment the docs derive
         from**, which is the half that made it more than a typo. **FIXED this
         wake**, on a base rate rather than an opinion: of the **21** markup
         uses of `bo-byline--compact` in the repo (8 kanban, 5 notification,
         4 po-app, 2 report, 1 role-home, 1 its own page), **0** are in a
         `<td>` or `<th>`. The modifier's stated purpose named a context
         nothing used and the opener forbids.
       - **Still open:** `.bo-byline` appears inside a table cell on **2** built
         pages — `/patterns/settings-admin` and `/components/avatar`, whose demo
         is headed *"In context — assignee column"*. Both are a **name + avatar
         only**, so neither commits the packing the opener's reasoning actually
         objects to (*"actor and timestamp into one cell buries the value that
         differs inside two that repeat"*) — but both are squarely inside the
         position its headline forbids, and a reader following the clause would
         conclude the avatar page's own exemplar is wrong.
       - **Accept:** each of the two either changes, or the opener records in
         one line why a single-value name cell is not what the clause rules out
         — written so that finding the clause CORRECT as it stands is a
         satisfying outcome, not an off-plan one (149.1's shape). Whichever is
         chosen, `check:wrong-choice` still passes and the clause and the two
         screens no longer contradict each other, asserted by re-running the
         `<td>`-containing-`bo-byline` count over `dist` rather than by reading
         the prose.
       - **RESOLVED 2026-09-05 (cloud wake): the CLAUSE changed, not the two
         screens.** The premise was re-measured before it was acted on, per
         CLAUDE.md's premise rule, and it reproduces exactly: a jsdom parse of
         all **137** built pages finds `.bo-byline` on **10** of them and inside
         a real `td`/`th` on exactly **2** — `/components/avatar` (2 cells) and
         `/patterns/settings-admin` (3 cells), **5** cell-borne bylines in all,
         every one of them a name plus `__avatar` and nothing else. The probe
         is **red-proved by discrimination, before any real count was read**:
         the same selector returns 1 on a byline inside a `<td>`, 0 on one
         beside a table, and **0 on an escaped `<pre>` sample** — which is why
         it is a DOM parse and not a grep, since the copy-paste blocks on both
         pages carry `&lt;td&gt;` as text and a grep would have counted them.
       - **Why the clause and not the screens.** The two cells are the
         framework's own prescribed composition: `.bo-byline__avatar` exists to
         put a disc beside a name, `/components/avatar`'s opener names
         *"assignee columns"* as a use, and its `inTable` sample is the worked
         example. Changing the screens would mean either dropping that
         composition or inventing a second way to spell it — more API to say the
         same thing, which the Objective refuses. The headline was the artefact
         that over-reached: its own reasoning objects to *packing* three values
         into one cell, and a single-value name cell packs nothing. So the
         headline now names the practice — **"Not for packing actor, role and
         timestamp into a grid cell"** — and one added sentence names the
         exception and links it to `avatar`.
       - **Asserted against the BUILT artefact, not the diff.** After a clean
         rebuild: the old headline appears in **0** files under `dist` (it was
         also quoted in `dsa-scores.json`'s `content` cite, which is why 0 and
         not 1 — the cite was updated in the same commit rather than left
         quoting a string the page no longer carries), the new headline in
         exactly **1**, the exception sentence in exactly **1**. The
         `<td>`-borne count re-run after the change is **unchanged at 2 pages /
         5 cells**, which is the point: nothing moved on those screens, the
         clause stopped contradicting them. `check:wrong-choice` passes
         (**156** assertions, 37 components carry / 1 outstanding / 3 exempt)
         and `check:dsa-scores` passes (**360** assertions), so the
         `content = 3` cross-check still agrees with the reworded clause.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. The rendered
         change is one bolded clause and one added sentence inside a single
         `<p class="demo-note">` on `/components/byline`, plus the `content`
         cite `DsaScore.astro` renders on that same page. `check:layout` (390px
         and 150% zoom), `check:scroll` and `test:axe` all pass over it, so
         nothing overflows and nothing is unreachable — but **whether the longer
         opener reads well at 390px was seen by nobody.** That is the residue a
         LOCAL wake would close.

**This round is therefore NOT a NO-OP on its surface**, which matters for
273.2's tally: it belongs with the rounds that found a defect *on* the thing
they were scoring, not with the 8 recorded NO-OP, and it leaves those figures
unchanged.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The change to a rendered surface
is **two lines of text** — one `<h2>` on `/components/byline` and one CSS
comment, which postcss strips, so no `.min.css` byte moves. Overflow at both
widths is covered by `check:layout` (390px and 150% zoom) and `check:scroll`,
both run below; **whether the shortened heading looks right at 390px was not
seen by anyone**, and that is the residue a LOCAL wake would close.

## Slice 272 — the eleventh archive sweep, dispatched from inside rule 4 with rule 4 finding nothing else: 17 slices moved, and reading the four 236.2 refuses found that NONE of them is named by an amend clause — all four are provenance citations, and they stay put anyway (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 271 — `check:slice-refs` reaches the whole tracked tree: the fix for 270.1 is a DENYLIST, because an allowlist that omits a type nobody remembered *is* the defect — and reconciling the run line against an independent count found the gate's headline number counting the wrong noun (2026-09-05)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 270 — Polish round on `tree`: all six cites hold, and the finding is that `check:slice-refs` cannot see the file extensions the shipped BEHAVIOURS are authored in — 11 slice references are cited from nowhere the gate looks (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 269 — Polish round on `breadcrumb`: all six cites hold, and the finding is that the only two blind re-scores this ledger has ever run that MOVED a score both left the entry's `scored` stamp behind — obeying a rule nothing had written down, and disobeying the one the file's own `$comment` states (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 268 — Polish round on `navbar`: navbar's six cites hold, and a new arm reading the rubric's own `na` boundary finds `breadcrumb · interaction` scored `na` seven hours before the clause that forbids it existed (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 267 — Polish round on `progress`: every arm reproduces, and the finding is in the loop's own step 0 — `polish_requeue.py --apply` reports the size of its argument, not the rows it wrote, and says "ledger updated" over a byte-identical file (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 266 — Polish round on `avatar`: 249.8's 3-line header moved every line-number pointer in the framework, and all four live ones were published or printed while pointing at the wrong line (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 265 — Objective grill of Slices 263, 264: both slices' own numbers reproduce, and both defects are in what shipped BESIDE them — a gate header that still encodes the declaration its own slice corrected, and an entity decoder consolidated everywhere except the one place a reader could see it missing (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 264 — 249.9's last no-JSON-key badge: which component a behavior serves is now declared, and the first declaration written from the headers' prose was wrong about one of the 26 (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 263 — Standardize sweep: all five lanes clean again, and the finding is again from none of them — three HTML-entity decoders in one directory, disagreeing on 8 of 11 inputs, where the fix one copy credits to a grill is exactly what makes it wrong on the mirror case (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 262 — 249.7's one banked gap measured against its own base rate: the symmetry gate is refused, and what survives is a hole in Dropdown's own wrong-choice clause (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 261 — 249.9's "no JSON key exists" is false, and the key it asked for is an inversion of one this repo already ships (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 260 — 249.15's tag half split out and landed: every built page now says what a shared link should show, and the three equalities are what makes the arm able to fail (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 259 — 249.9's two Accept clauses answered before the page is built: the miniature mechanism the item names does not exist, and two of its seven badges trace to no JSON key (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 258 — Objective grill of Slices 256, 257: 58 of 62 assertions reproduce, and two of the four that do not are the same defect the grilled slice records one item earlier — a real count of a set the sentence does not name (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 257 — Standardize sweep: all five lanes clean, and the finding came from none of them — the default-label rule was hand-copied into the scaffolder by the wake that introduced it, kept in sync by a comment, after it had already drifted once (2026-09-04)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 256 — Objective grill of Slices 249 (.2/.3/.4), 254, 255: 57 of 60 assertions reproduce, both that do not are counts of the WRONG SET — a label group read as a browser floor and a width that is a platform scrollbar — and writing the report tripped a gate whose own comment exempts the file it fired on (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 255 — Standardize sweep: all five lanes clean, nothing to consolidate — lane 4's regrowth signal is 22.1%, well under the 55.1% that dispatched the tenth sweep three days ago, and lane 5's only two-count pair is a false positive by arity (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 254 — 249.16 built: the README screenshot, taken in the lane a cloud wake cannot reach — and the image that reads best is NOT the one the page shows (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 253 — Objective grill of Slices 247, 249, 252: 31 of 34 claims reproduce, and all three that do not are citations about citations — including one in the slice whose whole subject is citation decay (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 252 — Standardize sweep: lanes 1-3 clean a TWELFTH time, lane 4 dispatched the tenth archive sweep (13 slices, the largest single move since 228.1), and the fifth lane found the BCD walk hand-copied into both floor scripts (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 251 — 247.1 built: every live `file:line` citation into a rewritten/regenerated file is already self-documenting, and the one actual defect was in the handover file's own drift, not the roadmap's

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 250 — Objective grill of Slices 244, 245, 248: 28 of 28 claims reproduce, both red-proofs executed live, and the append-only citation-stability property survived an intervening rebase it could not have anticipated (2026-09-03)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 249 — Triaged from an external docs-adoption-surface proposal (2026-09-03)

**Input**: a 16-item proposal comparing this repo (`5b3ab697`) against
`DibbayajyotiRoy/RoyUI@0e29468` plus eight reviewer notes, covering the "first
thirty seconds of contact" gap: bundle-size budget, page metadata, terminology,
maturity labels, a "choose your path" router, README, install commands, docs
recipe ordering, generated taglines, a visual catalogue, DESIGN.md's split, a
stability field, an outward "not for you" page, plus three open owner
questions and a lane of refusals. Full triage:
`.roundtable/grill-adoption-proposal-2026-09-03.md`.

**Every citation that a verdict depended on was re-run against the live tree
before trusting it**, per this file's own "a number you report is
load-bearing" rule — not read off the proposal's own text. Two did not
survive:

- The terminology-table item's own worked example was **backwards**:
  cited `components/offcanvas.astro` as missing the word "drawer"; the page
  actually uses "drawer" as its dominant vocabulary (15+ occurrences across
  headings, IDs, prose, and its own wrong-choice clause). No gap exists
  between the two cited pages.
- An "incidental" browserslist-vs-derived-floor mismatch is **not a
  defect** — `derive-floor.mjs`'s own header states it is deliberately
  independent of browserslist, computed from shipped CSS via BCD precisely
  because a hand-typed floor was once wrong. A derived floor one minor
  version above the declared browserslist target is the expected
  relationship. Refused as 94.11 ceremony — the predicate would be
  near-permanently true.

Everything else re-checked (bundle-size gate absent, page metadata absent,
DSA/floor/AT-evidence sourcing, README's 0 images/0 FAQ, install page's
npm-only, the recipe's demo-first/spec-last gate and its exact source
position, the hand-written sidebar/task-tile arrays, DESIGN.md's length and
dated-section count, the absent stability field) reproduced exactly as
claimed.

1. [x] **249.1 — DONE 2026-09-03. Bundle-size budget gate.**
       `packages/core/scripts/check-size.mjs`, wired into `build` as
       `check:size` immediately before `stamp-readme --check`. Eleven budget
       buckets cover all **139** shipped CSS/JS artifacts; every number is a
       gzip ceiling at current + ~10% headroom.

       **The premise needed correcting first, and the correction shaped the
       design.** "No bundle-size gate exists" is true of 138 of 139 artifacts,
       not of all of them —

       ```
       grep -rn -i budget packages/core/scripts packages/core/package.json .github/workflows
       ```

       returns exactly one enforcement: `build-rf-essentials.mjs`'s
       `RF_BUDGET_KB = 40` (roadmap 126.1), a MINIFIED-byte ceiling on one
       bundle, inline in the script that builds it. It is kept, not replaced —
       it defends an argued membership list, this gate defends transfer
       weight, and they fail for different reasons and read differently. So
       this generalises a precedent rather than inventing one.

       **gzip, against 126.1's explicit argument for minified bytes.** That
       argument (zlib-build drift; the 2026-08-16 CI failure on identical
       source) was about an EQUALITY check on a published string. Every number
       here is a ceiling with ~10% headroom. The claim is not left as an
       assertion that can go stale: the gate recomputes and prints the
       **tightest headroom in the whole table, in bytes**, on every run —
       today 110 bytes, `css/brand-navy.min.css`.

       **Red-proved live, four arms; each injection was confirmed to have
       LANDED before its red was believed.**

       - *per-file* — 2,062 bytes of unique CSS appended inside
         `data-table.css`'s `@layer` block.
         `grep -o 'bo-data-table--probe-' | wc -l` counts **28** in each of
         `dist/css/components/data-table.min.css`, `index.min.css` and
         `rf-essentials.min.css`; `npm run build -w @busy-office/ui` then
         exits 1 **at `check:size`**:
         `data-table.min.css is 2.28 kB gz > per-file budget 2.2 kB`.
       - *unbudgeted file* — a `dist/css/themes/nordic.css` no bucket claims:
         exit 1, the file named. A new shipped artifact must be budgeted
         deliberately, never absorbed by a wildcard.
       - *stale row* — `dist/css/brand-*.min.css` moved aside: exit 1,
         "budget row matched no shipped file". The reconciliation runs both
         ways.
       - *blown total* and *a multi-file bucket declaring no per-file max* —
         `--self-test`, which pins the classifier (14 cases) and the
         comparator (5) through the ONE `bucketOf`/`findBreaches` pair the
         real run uses, per check-rf-floor.mjs's lesson.

       **What the item did not name, and it decides the design: a
       group-total-only gate would have been GREEN on exactly the injection
       the Accept prescribes.** 2 kB of source CSS is **+0.37 kB gz**.
       `css/components/*.min.css` went 24.75 → 25.12 against a 27.3 budget,
       and `css/index.min.css` 15.10 → 15.53 against 16.7. Only the per-file
       arm fired. So both arms ship, and a bucket holding more than one file
       that declares only a total is itself a gate failure: a total alone lets
       one component balloon while its neighbours shrink, and a per-file max
       alone lets ten new components each land just under it.

       Current tree: 139 payload files, **371.7 kB gz** total. Not budgeted,
       with counts printed every run so the exemption cannot grow quietly:
       8 `.json` (build-time data, not per-page browser payload) and 31
       `.d.ts` (types, stripped before anything ships).
       - **Accept:** met. Fails on injection (four arms above), passes on the
         current tree, and raising a budget is a one-line diff — measured,
         not asserted: changing `css/components/*.min.css`'s `max` from 2.2 to
         2.4 produces a diff of exactly **-1/+1**.

2. [x] **249.2 — Per-page metadata: description, sitemap, robots.** `Gallery.astro`
       gains a required `description` prop (new `check-page-shape` arm fails a
       page without one); `@astrojs/sitemap`; a one-line `robots.txt`; one
       static OG image site-wide.
       - **Accept:** `grep -L 'name="description"' dist/**/*.html` returns
         empty; `dist/sitemap-index.xml` lists every built page; `check-links`
         stays green.

       **Baseline, measured before the change:** `grep -rl 'name="description"'
       dist --include='*.html' | wc -l` read **1 of 165** — the landing page,
       which has always hand-written its own `<head>`. Every other page was
       described to a search result by whatever an engine guessed from its
       body. The criterion was not vacuously true.

       **The Accept's glob over-reaches its own subject, and it is met over the
       page set this repo already defines rather than over the glob** — stated
       here rather than quietly narrowed. `dist/**/*.html` is 165 files; the
       built DOCS pages are **127**. The other 38 are two sets, and neither
       should carry a description:
       - **10 redirect stubs** (`<meta http-equiv="refresh">`). `dist-pages.mjs`
         has excluded them since the 2026-08-18 sweep — there is no content on a
         page whose only job is to bounce the browser — and the sitemap filter in
         `astro.config.mjs` now excludes the same ten, derived from that file's
         own `redirects` object so the two cannot drift. Describing a stub for
         indexing points a crawler at a page that is not a destination.
       - **28 `suite/` pages.** An app, not documentation, copied in by
         `copy-suite.mjs` *after* `astro build`, with its own gates
         (`npm run suite`). `dist-pages.mjs` carries the reason. Closing this
         half means threading a description through `_shell.mjs`'s `page()` and
         authoring 28 more — a second chunk of comparable size on a different
         app — so it is **249.14**, not an extra commit here.

       So the property verified is *every built docs page describes itself*, and
       `check-metadata.mjs` asserts it over `distPages()` — the one definition of
       "a built docs page" four gates converged on. **127 of 127**, up from 1.

       **The sitemap check is a reconciliation between two INDEPENDENT
       derivations, which is the only reason it can fail.** `@astrojs/sitemap`
       builds its list from Astro's route table; `distPages()` builds its by
       walking `dist/` for `index.html`. Generating the sitemap here from
       `distPages()` — the cheaper design, and the one first considered — would
       have made the gate compare a list against itself: green whatever broke,
       and precisely CLAUDE.md's *reconcile against the source, not against the
       argument*. The two sets agree at **127 = 127**, each reaching the same two
       exclusions separately.

       **Red-proved, injection confirmed before the result was believed** (six
       arms, each verified to have landed — a count grepped, a DOM read, or the
       thrown message itself):
       - *source page with no description* → `check-page-shape` fails naming
         `components/badge.astro` (confirmed: `grep -c 'description=' ` → 0).
       - *the required prop* → `astro build` throws
         `Gallery: page "Badge" (/components/badge/) needs a description prop…`.
       - *built page with the tag stripped* → `metadata check FAILED — 2 of 133`
         (confirmed: the meta count in the BUILT file went 1 → 0).
       - *two pages sharing one description* → fails naming both URLs. This arm
         exists because arm 1 passes in full on 127 identical descriptions,
         which is the copy-paste failure a 127-file bulk edit actually has.
       - *a built page missing from the sitemap* → fails (url count 127 → 126).
       - *a sitemap URL with no built page* → fails (127 → 128).
       - *`robots.txt` pointing elsewhere* → fails. `robots.txt` is static, so
         the published URL is spelled there a second time and cannot import
         `SITE_URL`; the answer to a copy this repo cannot delete is a gate that
         reconciles it, so the line must equal `SITE_URL + /sitemap-index.xml`,
         not merely look like a sitemap URL.

       **The bulk edit was verified against the RENDERED artefact, not the
       diff** (CLAUDE.md's rule, and its worked failure was labelling rows with
       other rows' names). Each of the 116 built pages was paired against its
       OWN `<title>` and its intended description: **116 of 116**. The first run
       of that probe reported 104 and eleven "mismatches" — every one its own
       entity handling (`&` renders as `&amp;`) plus an `index.astro` path built
       as `patterns/index/index.html`. An instrument's first output is not
       evidence; the descriptions were never wrong.

       **Not verified, and named rather than implied:** this was a cloud wake,
       so the 1440/390 light-and-dark screenshot lane could not run. Nothing in
       the diff renders differently — a `<meta>` tag, two XML files and a
       `robots.txt` have no visual surface — and `check:layout`, `check:scroll`
       and `test:axe` swept all 127 pages at both widths green.

       **The OG image is NOT done.** It is a rendered image, which a cloud wake
       cannot author honestly. Split out as **249.15** rather than left implied
       by a ticked box.

       Also landed, because it was smaller than explaining: the published URL
       was spelled out in `gen-llms.mjs`, `check-published.mjs` and
       `ai-assistants.astro`, and the sitemap needed a fourth. All three now
       import `SITE_URL`/`SITE_ORIGIN` from `paths.mjs`. Split in two because
       Astro joins `base` onto `site` itself, so handing it the full published
       root emits `/busy-office-ui/busy-office-ui/` — checked against a real
       `DOCS_BASE=/busy-office-ui` build, where the 127 sitemap URLs come out as
       `https://busy-office.github.io/busy-office-ui/…` exactly.
       - **Accept:** met, against the page set named above. All 17 CI entry
         points, re-derived from `ci.yml` rather than read off `ENVIRONMENT.md`'s
         snapshot, ran green in this container.

3. [x] **249.3 — Maturity labels with a real source. DONE 2026-09-03 (cloud
       wake).** Per component page: DSA-scored date (`dsa-scores.json.scored`),
       introduced-version, per-component floor, AT evidence rendering "none
       recorded" until the owner-blocked item closes (Slice 15's open `AT
       runtime evidence` row). A `Maturity` section on all 40 components, four
       facts each, every one read from a key.

       **THE ITEM'S OWN MECHANISM FOR "introduced-version" IS REFUTED, and
       that is the finding.** It said *"first tag containing the component's
       CSS file, computed at build"*. Measured before building — CLAUDE.md's
       rule that re-checking a premise is part of the criterion — a tag scan is
       **wrong for 38 of the 40 components**, for three independent reasons:

       - **0.1.0 was published and never tagged.** `git tag --sort=v:refname`
         starts at `v0.1.1`, so the **26** components of the first release
         would each be labelled one version late.
       - **`v0.2.0` is a tag with no release behind it.**
         `npm view @busy-office/ui versions --json` returns
         `["0.1.0","0.1.1","0.3.0","0.4.0","0.5.0","0.6.0","0.7.0"]` — no
         0.2.0, ever. **14** components would have been labelled "introduced in
         0.2.0", pointing a reader at an `npm i` that cannot resolve.
       - **A tag scan keys on a SOURCE path, and source paths rename.** The
         same probe reported `form` UNRELEASED. That was the probe's defect,
         not a fact: `src/css/components/form/` has never held a `form.css` —
         it holds five files — so `<dir>/<dir>.css` misses it at every
         revision. An instrument's first output is not evidence, and this one
         had a plausible story ready.

       So the source is **the published tarballs**, not git: for each version
       the registry serves, the earliest one whose tarball carries
       `dist/css/components/<name>.css`. That is CLAUDE.md's downstream rule in
       a new place — a tag is an *input* to publishing, not the published
       thing. Distribution: **26 at 0.1.0, 15 at 0.3.0, 1 at 0.5.0**, and two
       (`nav`, `record-card`) published once and since removed.

       **Reconciled against an independent derivation before it was trusted.**
       A throwaway probe in the scratchpad and `derive-introduced.mjs --refresh`
       were written separately and agree key-for-key on all 42
       (`JSON.stringify` equality). The record — `packages/core/src/data/
       introduced.json`, committed — is what an offline build reads, because
       neither git nor the registry is reachable from the docs container.

       **What shipped**

       - `packages/core/scripts/derive-introduced.mjs` — `--refresh` (network)
         rebuilds the record from the registry; the default build mode
         reconciles it against the stylesheets the build actually produced and
         writes `dist/introduced.json`, exported as `./introduced.json`.
       - `derive-floor.mjs` gains `perComponent`: the same probe set pointed at
         one component's sheet instead of `index.css`. **9 distinct floors
         across 40 components**, Chrome 99 → 119 — the label is worth printing
         precisely because it is not uniform, and **25** components floor at
         Chrome 99 where the framework floors at 119 — spread across **three**
         distinct labels that agree on Chrome and differ on Firefox/Safari,
         sized **20 / 3 / 2** (read the labels from `floor.json`; they are not
         typed here, per `check:floor`).
         *(Corrected 2026-09-03 by the Objective grill, Slice 256 finding A:
         this said "20 components floor at Chrome 99", which is the size of the
         largest label group, not the Chrome-99 set — 20 + 3 + 2 = 25. The
         command is in that grill; the error flattered the item, since 25 of 40
         is 63% at the framework's oldest floor rather than 50%.)*
         The framework keys are
         **byte-identical** to the pre-change file (`JSON.stringify(rest) ===
         baseline`), so the refactor moved nothing it was not meant to.
       - `apps/docs/src/data/at-evidence.json` — the hand-recorded AT register,
         empty today, naming Slice 15 as the blocker and `test:axe` +
         `check:forced-colors` as what automation covers instead.
       - `Maturity.astro`, mounted from `DsaScore.astro` — which
         `check-page-shape` already requires on every component page, so it
         reaches all 40 without a 40-file regex.
       - `check-maturity.mjs` (`@exact`), wired into `docs build` after
         `check-metadata`: **280 assertions**, 40 components across 39 pages.

       **Ten red-proofs, each with the injection confirmed first.** Four value
       arms by mutating a record without rebuilding (version, floor label,
       score date, AT record) — each failed exactly one assertion and named the
       component. Three structural arms by mutating the built HTML or the
       component set (block deleted, an emptied `<dd>`, a shipped component no
       page documents). Two guards on `derive-introduced` by exit code, not by
       message: an emptied record and a missing record both `exit 1` (checked
       with `>/dev/null; echo $?`, because the first attempt read `rc=0` — it
       was measuring `head`, not `node`). And the two branches live data cannot
       reach were proved by injecting into the record, rebuilding, and reading
       the built page: `button` with no published version renders *"Not
       published yet"*, `dialog` with an NVDA record renders it.

       **The third absence branch is unreachable BY CONSTRUCTION, and the
       injection is what showed it.** Deleting `tabs` from `dsa-scores.json` to
       reach *"Not yet scored"* turned the docs build red at
       `check:dsa-scores` — *"FAIL tabs: the page that renders its score has one
       to render"* — so the page never rebuilt and the probe read the STALE
       artefact and reported the string absent. The rc=1 is the only reason
       that was not filed as a rendering bug. The branch stays, mirroring
       `DsaScore`'s own fallback; it is defensive, not reachable.

       **`check:pseudo` found a real defect, twice, and neither round would
       have looked wrong in English.** Round 1 put the explanations inside the
       `<dd>`s: 9 of the gate's 14 sampled pages overflowed at 390px under
       ≥44% text expansion, every one naming the same expanded sentence at
       495px. Round 2 shortened the values to two words — and the same nine
       failed again, now naming a `<dd>` holding *"None recorded"*: the cause
       was the `<dt>`, because `.bo-kv--rows` is `max-content 1fr` and
       "Assistive-tech evidence" sizes that track. Plain `.bo-kv`
       (`auto-fit, minmax(11rem, 1fr)`) collapses to one column at 390 and
       passes. `check:layout` and `test:axe` were green through all three
       rounds — expansion is the only gate that could see it.

       - **Accept:** met. Every label on every built page traces to a key
         (`check:maturity`, 280 assertions), and each absence renders its
         stated string — two proved by injection, the third forbidden by an
         existing gate as recorded above.
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item DOES
         have a visual surface — unlike 249.2 — and the honest statement is
         that its *properties* were swept and its *appearance* was not: no new
         CSS rule ships (the block is `.bo-kv` + `.bo-u-text-muted` +
         `.bo-badge`, all existing), and `check:layout`, `check:scroll`,
         `check:pseudo`, `test:axe`, `check:forced-colors` and
         `check:target-size` all passed across the tree at 1440 and 390. All
         **17** CI entry points, re-derived from `ci.yml`, ran green here, plus
         a `DOCS_BASE=/busy-office-ui` build (both new links carry the prefix).

4. [x] **249.4 — README: stamped gate count, who-for/not-for, FAQ.**
       *(The screenshot half is split out as 249.16 — see below.)*
       `derive-readme-facts.mjs` derives three repo facts into the committed
       record `packages/core/src/data/readme-facts.json`, and
       `stamp-readme.mjs` stamps them into both READMEs as `stat:gates`,
       `stat:notfor` and `stat:faq`.

       **TWO of this item's three source premises were false, and were measured
       before anything was built on them.**

       *Worth naming, because this slice's own header says every citation a
       verdict depended on was re-run against the live tree:* what that sweep
       covered on this item was the **README side** — "README's 0 images/0 FAQ",
       which reproduces exactly. The three counts the item's *mechanism* rested
       on are on the **source side** (`scope.astro`, `troubleshooting.astro`,
       the gate files), and none of them was in that list. Two were wrong. A
       re-check of the evidence for *whether* to build something does not cover
       the figures describing *what to build*, and the header reads as though it
       did.

       Commands, so the next wake re-runs rather than re-derives:

       ```
       ALL=$(find . -name 'check-*.mjs' -not -path './node_modules/*' -not -path '*/dist/*')
       grep -l -- '--self-test' $ALL | wc -l                              # 48
       grep -lE "argv.*includes\(['\"]--self-test" $ALL | wc -l           # 18
       grep -c 'Not for' apps/docs/src/pages/getting-started/scope.astro  # 0
       grep -cE '<h[1-6][ >]' apps/docs/src/pages/getting-started/troubleshooting.astro  # 3
       ```

       - **"count of `check-*.mjs` carrying `--self-test`" is the detector
         CLAUDE.md already records as unable to fail.** 48 gate files contain
         the literal string; only **18** contain the `process.argv` branch that
         runs one — because the tag text itself says *"Carries --self-test"*.
         Stamping the stated predicate would have published **48**, or **49**
         after any gate that merely mentions it. So nothing here re-counts:
         `check-selftests.mjs` now exports `scanGates()` and the deriver imports
         it, because a second regex over the same tree is a copy of a known trap.
         The published figure is **51 gates, 18 heuristic**.
       - **"the existing two 'Not for' clauses from `scope.astro`"** — `grep -c
         'Not for'` on that page returns **0**. It carries an `In scope` list of
         5 and a `Not in scope — decided, not forgotten` table of **7**; neither
         is spelled "Not for". The 7 table subjects are what shipped.
       - **"the five `troubleshooting.astro` headings"** — that page has **3**
         headings (2 `<h2>`, 1 `<h3>`), and its substance is an **11-row symptom
         table carrying no heading at all**. Shipped as the 11 entries plus the
         two `<h2>` questions.

         Two things measured against the BUILT page rather than assumed, with
         one command —
         `grep -oE '<h[123][^>]*>[^<]{0,70}' apps/docs/dist/getting-started/troubleshooting/index.html`:
         the built page carries **3** `<h2>`, the third being `Related`, the
         layout's own footer heading. So the deriver reads the SOURCE page, not
         the built one — parsing the built page would have counted layout chrome
         as an authored question, which is the failure CLAUDE.md's instrument
         section records. And **no heading carries an `id`**: raw `<h2>` in a
         `.astro` file gets no auto-slug, so the README links to the page, not
         to an anchor. Add ids first if a deep link is ever wanted.

       **Context safety, the trap `check:rtl` already paid for.**
       `stamp-readme --check` runs inside `npm run build -w @busy-office/ui`,
       which builds in contexts that copy only `packages/` (the po-app consumer
       image). So the deriver refuses to re-derive when an input is absent: it
       names each missing input on stderr, says the record was NOT rewritten and
       NOT verified there, leaves the record untouched, and exits 0. Verified by
       building a real packages-only tree and running both modes in it. The
       record lives in `src/data/`, not `dist/` — `files` ships `dist` only, so
       the tarball stayed at **183 files**.

       - **Accept (property, not prediction):** `npm run check:readme-facts`
         agrees with the repo and `stamp-readme --check` agrees with the record,
         both wired into `build`; each derived fact is red-proved by injection
         with the injection confirmed to have landed.
       - **Red-proofs, all with the injection verified before the verdict was
         believed:** (a) a row added to `scope.astro`'s table → `--check` red
         naming `notfor`; (b) a real gate file added → 51 → 52, `--check` red
         naming `gates`; (c) **the discrimination proof** — a prose mention of
         `--self-test` added to a gate that lacked the string, confirmed to move
         the literal count **48 → 49** while the argv count stayed 18 and the
         derived fact did **not** move; (d) a heuristic gate stripped of its
         argv branch → the deriver refuses to stamp at all rather than publish a
         count for a tree failing its own meta-gate; (e) each of the three
         markers corrupted in turn in both READMEs → `stamp-readme --check`
         rc=1; (f) a marker deleted → `requireAll` throws.
       - **Also fixed, found while doing it:** `stamp-readme`'s success line
         hard-coded *"size/behaviors/events"* while checking five stats. It now
         names them from the object.
       - **Not verified, named rather than implied:** this was a cloud wake, so
         the 1440/390 light-and-dark screenshot lane could not run. **No CSS,
         no docs page and no rendered surface changed** — the diff is two
         scripts, one JSON record, `package.json` and two markdown READMEs — so
         there is nothing here a screenshot could have shown. The docs gates
         were run across the tree anyway and are reported with the commit.

5. [x] **249.5 — DONE 2026-09-03 (cloud wake). Install commands for
       pnpm/yarn/bun — ADDED, and executed rather than written.**
       `getting-started/installation.astro` showed npm only, confirmed still
       true at dispatch: `grep -rniE 'pnpm|yarn|\bbun\b'` over `apps/docs/src`
       returned **0 files**, and over the whole repo (excluding
       `node_modules`, `dist`, lockfiles) the only hits were this item, its
       grill row and `STATUS.md`'s copy of it.

       **The refusal was weighed and lost on a measurement, not a preference.**
       The DA the item offers — "the no-bundler audience makes it noise" —
       argues about *bundlers*; the install line is for the npm-ecosystem
       audience, and the page already answers the no-package-manager case in
       its own paragraph two lines below. So the three were added.

       **What made this more than three lines of prose: the page's own opener
       claims everything on it is executed** — *"These steps are executed, not
       just written… If anything here stops working, that build fails."*
       Three unexecuted commands under that sentence would have falsified it,
       so `check:quickstart` gained step 3b, which installs the LOCAL packed
       build with each documented package manager and resolves the same four
       entry points step 3 resolves for npm. Page and gate read ONE list,
       `apps/docs/src/data/package-managers.mjs` — the `MARKUP_RULES`
       precedent (shared by `ai-assistants.astro` and `gen-llms.mjs`), because
       a restated list is a list that drifts.

       **Measured here, all four green** (Node v22.22.2; npm 10.9.7, pnpm
       10.33.0, yarn 1.22.22, bun 1.3.11): each installs the 0.7.0 tarball and
       resolves `css`, `css/reset`, `css/tokens`, `css/components/data-table`.
       Install cost 191–561 ms each; the whole gate runs in **9.2 s**.

       **The red-proof found a real defect, and it is the finding worth
       keeping.** Step 3b's first version put each package manager's directory
       INSIDE the gate's temp dir — which already holds step 2's npm install —
       so Node's resolver walked up into `dir/node_modules` and every
       documented import resolved no matter what the package manager had done.
       The injection (yarn installing `is-number@7.0.0` instead of the
       package) was confirmed present in the file and the gate still passed:
       a detector that could not fail, exactly CLAUDE.md's shape. Fixed with a
       SIBLING temp root; the comment at the `pmRoot` declaration says why, so
       it cannot be "tidied" back.

       - **Accept (property, not prediction):** the page's install commands
         come from the same list the gate executes, and each documented
         command is either run or named as not run.
       - **Red-proofs, injection asserted to land before the verdict was
         believed** (each replacement refused unless it matched exactly once):
         (a) yarn pointed at a different package → red, naming
         `the documented import "@busy-office/ui/css" does not resolve after
         \`yarn add @busy-office/ui\``; (b) bun pointed at a nonexistent
         tarball → red, naming `the documented \`bun add @busy-office/ui\`
         does not install`; (c) a package manager that is not installed →
         **rc=0** with `NOT VERIFIED here — \`no-such-pm-xyz\` is not
         installed in this context` on stderr and in the summary line.
       - **Why (c) reports instead of failing:** bun is not on a stock GitHub
         runner, and a gate that turned CI red for that would be asserting
         something about the runner, not about the package. This is
         `check:rtl`'s precedent for a legitimately absent input — say it was
         NOT verified rather than claim a pass it did not earn. Whether the
         runner carries pnpm/yarn/bun is **not knowable from here**; the gate
         prints which ones it actually ran either way.
       - **Scope limit, stated rather than glossed:** `yarn` here is **1.22.22
         (classic)**, a flat `node_modules`. **Yarn Berry / PnP is NOT
         covered** — it resolves through a zip and no evidence was taken for
         it. The documented command is correct for both; the *verification* is
         classic-only.
       - **Also changed, and caused by this one:** the paragraph below now
         reads *"No package manager?"* rather than *"No npm?"*, since the
         three commands above it are the npm-ecosystem answers. The phrase
         appears nowhere else in the repo (grepped before editing).
       - **Not verified, and named rather than implied:** cloud wake, so the
         1440/390 light-and-dark screenshot lane could not run. This item has
         a small visual surface — one new `<p class="bo-u-text-muted">` with
         three `<code>` spans — and the honest statement is that its
         *properties* were swept and its *appearance* was not: **no new CSS
         rule ships**, the classes are existing ones, and the rendered section
         was read out of the BUILT page rather than off the diff.
         `check:layout`, `check:scroll`, `check:pseudo`, `test:axe`,
         `check:forced-colors` and `check:target-size` passed across the tree
         at 1440 and 390. All **17** CI entry points, re-derived from
         `ci.yml`, ran green here.

6. [x] **249.6 — DONE, Slice 328.** "Choose your path" router, corrected from the proposal's
       own undercount.** The proposal's evidence ("index.astro:118, one
       CTA") undercounted: the page has 2 CTA buttons, 4 nav links and 6
       task-tiles.

       *Corrected by Slice 253's grill, finding C.* This item used to say the
       cited line "is the install snippet". It is not, at any revision: line
       118 is the FIRST of the two CTA buttons
       (`Build your first screen`), line 119 is the second, and the install
       snippet is line **121** — and `index.astro` has not changed since
       `f1be2485`, well before this triage. The proposal's line reference
       resolved; only its count was wrong, so what is refuted here is the
       count, not the citation. The remaining figures reproduce: 2 CTAs, 4
       nav links, and 6 `bo-widget` cards under *"Find it by task"* (a
       descriptive name — there is no `task-tile` class).

       The real gap:
       every existing router (nav, tiles) sorts by *component category*, none
       by *adoption scenario* (add to existing app / new app / CSS-only / with
       behaviours / htmx / custom theme). A six-row block on `index.astro`,
       each row ending in a rendered screen.

       **MEASURED 2026-09-03 (cloud wake), and it re-scopes the item: THREE
       rows lack a qualifying terminal page, not one.** [**Corrected by 346.1:** Slice 328
       found this premise false — all three pages render live framework
       elements, and nothing was missing.] This item said "the
       theming row currently has none". That premise is a wake-old measurement,
       so it was re-run before dispatching, per CLAUDE.md's premise rule — and
       it undercounts the same way the CTA figure did. Against the BUILT tree,
       reading each scenario's natural terminal page:

       | scenario | terminal page | `demo-pair__preview` | pattern links |
       |---|---|---|---|
       | add to an existing app | `/getting-started/installation` | 0 | 1 ✓ |
       | start something new | `/getting-started/first-screen` | 3 | 3 ✓ |
       | CSS only, no JS | `/getting-started/scope` | 0 | 0 ✗ |
       | add behaviours | `/concepts/js-behaviors` | 0 | 0 ✗ |
       | htmx | `/getting-started/htmx` | 1 | 1 ✓ |
       | custom theme | `/concepts/theming` | 0 | 0 ✗ |

       So landing this needs three rendered screens, not one — or three of the
       six rows cut, which leaves a three-row "adoption-scenario router" that
       does not route the scenarios the gap names. **Deciding that is still
       part of the item; what changed is the price.**

       **THE GATE MUST ANCHOR TO THE PAGE'S CONTENT REGION, or it cannot
       fail.** Measured before writing the Accept, per 94.11: the docs shell
       lists every pattern page in its sidebar, so *"the page contains a
       pattern link"* read whole-page is **78–81 on all 31 learning-path
       pages** — a predicate uniformly true, i.e. a detector that cannot fail,
       and exactly the shape `check-learning-path`'s own header records three
       of. Anchored to `<section class="demo"` — the anchor that gate already
       uses — the same predicate reads **17 of 31 (55%)**, so it discriminates.
       The anchor cuts off the opener (`<h1>` sits ~1,000 chars before the
       first demo section), so any ABSENCE it reports must be re-checked
       whole-page before being believed; that is how the three ✗ rows above
       were confirmed.

       **DECLINED BY A CLOUD WAKE 2026-09-03, left open, and this is the
       screenshot sense of browser-blocked** (`LOOPS.md` 186.2's vocabulary):
       three terminal pages must gain a rendered result, and a new six-row
       block lands on the site's front door — evidence that is a rendered
       image a human compares. A LOCAL wake can take it. The measurement above
       is the part a cloud wake could take, and it is banked here so the next
       wake does not re-derive it.

       **DECLINED AGAIN 2026-09-04 (cloud wake), this time at the CLAUSE
       level, which is the question `RESUME.md`'s correction block says to
       ask instead of "is this item browser-blocked".** The answer is that
       this Accept has no separable cloud-takeable half: the arm cannot land
       green until the three ✗ rows gain something, and the two ways to give
       them something are a `Demo` (a rendered screen — `ENVIRONMENT.md`'s
       FIRST list) or a bare pattern link, which would be fitting the page to
       the gate rather than the reader. Choosing between those is this item's
       own open question (*"or three of the six rows cut"*), not a wake's to
       settle by padding. The premise was re-run rather than trusted: all
       three pages still read **0** `Demo` and **0** `/patterns/` hrefs in
       source — `grep -c Demo` and `grep -o "/patterns/[a-z-]*"` over
       `getting-started/scope.astro`, `concepts/js-behaviors.astro` and
       `concepts/theming.astro`.
       - **Accept:** each row's terminal page contains a `Demo` or a pattern
         link **inside its content region**, asserted by a
         `check-learning-path`-style arm that anchors the same way that gate
         does; a row ending in prose alone fails. The arm's red-proof asserts
         the injection landed in the BUILT page before the red is believed,
         and a whole-page reading of the same predicate is recorded beside it
         so a later reader can see why the anchor is load-bearing.

7. [ ] **249.7 — Terminology table, re-scoped after its own worked example
       failed verification.** Drop the offcanvas/drawer pairing (refuted
       above — no gap exists). Before landing `src/data/terminology.mjs`,
       spot-check every remaining seed row (select/dropdown/combobox/value
       help/F4, grid/table/ALV, snackbar/toast/notification,
       master-data/CRUD/maintain, wizard/stepper/guided-procedure) the same
       way A3's citation was checked — against the actual built pages, not
       assumed. Hold the SAP/Fiori-specific rows (value help, ALV, guided
       procedure, F4, message, maintain) for 249.10 (owner vocabulary).
       Three consumers once seeded: a visible "Also called" line under
       `<h1>` (Pagefind-indexed), a `check-search.mjs` `@exact` arm per
       alias, and a glossary in `gen-llms.mjs`.
       **THE SPOT-CHECK RAN 2026-09-03 (cloud wake). Four of the five seed
       rows do not reproduce.** This is the Accept's first clause executed,
       not a new opinion: each row was grepped against the built pages it
       names, the same test that refuted the offcanvas row. Counts are of the
       page's own text (tags stripped), whole-page — the docs sidebar names
       every component, so an anchored reading undercounts, and every absence
       below was confirmed at whole-page 0.

       | seed row | pages grepped | verdict |
       |---|---|---|
       | select / dropdown / combobox | `combobox`, `dropdown`, `form` | **no gap** — the combobox page already reads `dropdown` 3, `select` 44, `autocomplete` 11; the dropdown page reads `select` 39 |
       | grid / table | `data-table`, `tree-table` | **no gap** — `grid` 10, `datagrid` 1, `spreadsheet` 1 on the data-table page |
       | snackbar / toast / notification | `alerts` | **partial** — `toast` 34, `alert` 46, `notification` 3; only **`snackbar`** is absent (0) |
       | master data / CRUD / maintain | `object-page`, `list-report` | **reproduces whole** — all three read 0 on both pages |
       | wizard / stepper / guided procedure | `stepper`, `patterns/wizard` | **no gap** — the stepper page reads `wizard` 1, the wizard page reads `stepper` 4 |

       Three of five are refuted the same way the offcanvas row was: the page
       already carries the alias as live vocabulary. The surviving seed is
       **one full row (master data / CRUD / maintain) and one single term
       (`snackbar`)** — plus `typeahead`, absent (0) from all three of
       combobox/dropdown/form, which no seed row named.

       **So the open question is now a cost question, and it is left open
       rather than settled here:** three consumers — a visible "Also called"
       line under every component `<h1>`, a `check-search.mjs` `@exact` arm
       per alias, and a glossary in `gen-llms.mjs` — built to carry **three
       aliases**. The Objective's less-for-more test is the one to apply, and
       249.10 (the owner's SAP/Fiori column) is what would grow the seed, so
       settling this before the owner answers 249.10 would decide it on the
       thinnest version of the input. **One thing measured here is worth
       keeping either way:** the dropdown page never names or links
       `combobox` in its own content (0 hrefs; the 2 whole-page hits are shell
       chrome), which is a *Related-link* gap, not a terminology one.

       **That clause is SPLIT OUT as 249.19 and LANDED (Slice 262,
       2026-09-04) — do not re-derive it.** Both readings above reproduced
       independently on the built tree, and the wake that took it measured the
       base rate before fixing anything: reciprocal linking is the exception
       at **29 of 97 pairs (29.9%)**, with **55** pairs where the target never
       names the source, so this gap is not distinctive and a symmetry gate is
       refused. The fix landed on a page-local argument instead. **Nothing
       about the terminology table moved** — this item is still the same cost
       question, still waiting on 249.10, and its seed is still one full row
       (master data / CRUD / maintain) plus `snackbar` and `typeahead`.
       - **Accept:** every row's claimed gap is independently reproduced by
         grepping the two pages it names, the same check that refuted the
         offcanvas row **(done — table above; a row that does not reproduce is
         dropped, and finding the seed empty is a satisfying outcome, not an
         off-plan one)**; then, if a table ships at all, deleting a row from
         it turns its search arm red.
       - **Held on 249.10** (marker added by 393.3, 2026-09-25). The item
         says it is "still waiting on 249.10", which is an owner call, and
         Slices 353 and 369 both counted it as owner-blocked. It carried no
         marker, so the first computed `oldest dispatchable` picked it.
       After: 249.10
       Milestone: M1 · Phase: 1
       Route: build
       After: 394.9

8. [x] **249.8 — Component tagline + category, generated from the CSS
       header.** `/* @tagline … @category … */` in each component's CSS
       header, lifted into `api.json` by `extract-api.mjs`. Deletes two
       hand-written lists this repo's own gates already police drifting
       (`Gallery.astro`'s sidebar array, `index.astro`'s task-tile prose) and
       feeds 249.2's description, 249.7's terminology line, and 249.9's
       catalogue cards.
       - **Accept:** a stub component CSS file with the header updates
         sidebar/tiles/llms with zero hand edits on rebuild; omitting the
         header fails the build naming the file.
       - **LANDED 2026-09-03 (cloud wake).** Four directives, two required:
         `@tagline` (30-120 chars) and `@category` (one of eight in
         `extract-api.mjs`'s `CATEGORIES`); `@label` and `@order` optional and
         present only where the derived default is wrong (13 and 40 of 40).
         `api.json` gains `components[…].meta`, `api.categories` and
         `api.nav`; `apps/docs/src/data/component-nav.mjs` builds the sidebar
         groups and the homepage tiles from it, on the `pattern-groups.mjs`
         precedent. The 43-entry hand-written array is gone; 4 documented
         extras remain, each with a reason.

       **The item's premise was re-checked before building on it (CLAUDE.md's
       premise rule) and is half wrong — in the direction that strengthens the
       item.** "Two hand-written lists this repo's own gates already police
       drifting" holds only for the sidebar, and only one-way:
       `check-page-shape.mjs` failed when a component PAGE had no entry, and
       read neither the label nor the group. The tile prose was policed by
       **nothing**: `grep -rc "Find it by task" apps/docs/scripts
       packages/core/scripts` -> **0**, and the single script hit for a tile
       string (`Segmented control`) is a comment in `new-component.mjs`. The
       drift that predicts had already happened — the "Actions" tile listed
       **Combobox**, which the sidebar groups under Data input, and "Money
       field" and "Loading states" were labels no sidebar entry used.

       **Shape, measured rather than assumed:** 43 sidebar `/components/*`
       entries, 40 CSS dirs, **39** page slugs (skeleton + state share
       `state-patterns`; `alert` aliases to `alerts`). The 4-entry difference
       is 2 anchors (`form#dates`, `dashboard#card`) and 2 pages that document
       `data-table` behaviour with no stylesheet of their own
       (`inline-editing`, `table-toolbar`) — none of which has a CSS header to
       carry metadata, which is why they stay written down.

       **A pre-existing blind spot, found by a red-proof that came back
       green.** `check-page-shape`'s sidebar arm lived inside a loop over
       `src/css/components/*`, so `inline-editing` and `table-toolbar` — the
       two pages with no CSS dir — were **never reachability-checked**.
       Deleting the `inline-editing` entry (its mentions in the module went
       1 -> 0, injection confirmed) left the gate GREEN. The arm now walks the
       PAGES: 41 checked, and the same injection fails it naming the file.
       Same shape as the `scan` skip that comment already records.

       **Verified against what it RENDERS, not against the diff** (CLAUDE.md's
       bulk-edit rule). Full `dist` before and after: **45 of ~3,000 files
       differ — and 1 of 138 HTML pages.** That one is `index.html` (the
       tiles, the only intended visible change). The other 44: `llms.txt`
       (new `tagline:`/`category:` lines), `build-id.json` (a per-build
       stamp), and 42 unminified CSS files carrying the new header comment —
       **comment-stripped via postcss, all 42 are byte-identical**, and no
       `.min.css` changed at all. So the sidebar's 39 generated entries
       reproduce the hand-written array exactly, on every page that renders
       it.

       That claim is not vacuous and the check is not dead, both measured:
       a built page carries all **43** `/components/*` links server-rendered
       (`grep -o 'href="/components/[a-z#-]*"' … | sort -u | wc -l` on
       `dist/components/badge/index.html`), and changing **one** `@order`
       (badge 40 -> 5, injection confirmed) makes **41 component pages**
       differ against the same comparison that reports 0 for the real change.

       **Red-proofs, each with the injection asserted before the red was
       believed** — and the first harness was itself broken: `git checkout --`
       restored the *committed* file, which has no header yet, so two "reds"
       were red for the wrong reason. Redone against a real backup: @tagline
       removed (1 -> 0, names the file); `@category "Displays"` (names the
       file and lists the eight legal values); a 14-character tagline (names
       the file and the count); skeleton/state declaring different `@label`
       (names both dirs and the shared page); `@category` dropped from tabs.

       **The Accept's first clause was EXECUTED, not asserted.** `npm run
       new:component -- probe-widget --group=… --tagline=…` touched no shared
       file (`grep -c probe-widget Gallery.astro index.astro` -> 0, 0); after
       a rebuild the probe appeared in the built sidebar of an unrelated page,
       in `llms.txt` with its tagline and category, and — once given a
       category under the 5-name tile cap — in the built homepage tile
       (`Button · Dropdown · Segmented control · Probe widget`). The probe was
       then deleted. Two notes worth keeping: a scaffolded stub still cannot
       complete a full `docs:build` until its page has a wrong-choice clause
       and a DSA score, which is **pre-existing content-gate behaviour, not
       registration**, and no score was fabricated to get past it; and the
       scaffolder's own default label ("Probe Widget") disagreed with the
       extractor's ("Probe widget"), so it stamped a redundant `@label` — two
       derivations of one default, fixed to one.

       **Not verified, named rather than implied:** cloud wake, so the
       1440/390 light-and-dark screenshot lane could not run. 137 of 138 HTML
       pages are byte-identical so nothing there can have moved; for
       `index.html`, the tile cards were measured live in headless Chrome at
       both widths — 6 cards, grid height **281 -> 281** at 1440 and **854 ->
       854** at 390, with two individual cards swapping which is the short one
       (Actions lost "Combobox", Navigation gained names). **A "zero prose
       overflow" reading from that same probe is discarded as a dead
       detector**: a `<p>` shrink-wraps, so 400 unbreakable characters
       (injection confirmed at 400) still read **0**, and it only reached 263
       when the element was artificially clamped. Overflow is covered instead
       by `check:layout` (127 pages at 390 and 150% zoom) and `check:scroll`
       (912 containers x 2 widths), both green. All **17** CI entry points,
       re-derived from `ci.yml`, ran green in this container.

9. [x] **249.9 — DONE, Slice 329.** Visual component catalogue. Depends on 249.8 (tagline) and
       249.3 (maturity labels). `/components/` index: one card per component
       — name, tagline, CSS-only/JS-enhanced/JS-required (derived: component
       classes ∩ `behaviors.json` hooks), DSA score + date, floor, AT line,
       pattern links, a build-time miniature via `browser-harness.mjs`
       (already exists, used today for patterns via `PatternPreview.astro`).
       - **Accept:** every badge on a card either traces to a JSON key **or
         the card renders the absence and names its reason** — 249.3's
         "absence is rendered, never blank", and the audit below says which
         badge is which; the miniature-rendering build-time cost is measured
         and stated before this closes **(DONE — both routes costed below)**.

       **THE MECHANISM PREMISE IS FALSE — measured 2026-09-04 (cloud wake),
       per CLAUDE.md's rule that re-checking an item's premise is part of the
       criterion.** Neither half of "a build-time miniature via
       `browser-harness.mjs` (already exists, used today for patterns via
       `PatternPreview.astro`)" holds:

       - `browser-harness.mjs` has **13** consumers and **0** of them run at
         build time. Every one is a gate or audit invoked separately, after
         `astro build`, against `dist/`. Commands:
         `grep -rln browser-harness --include='*.mjs' --include='*.astro' . | grep -v node_modules`
         → 13; each of the 11 docs names checked against
         `require('./apps/docs/package.json').scripts.build` → **0** present;
         `packages/core`'s own build script matches neither `browser-harness`
         nor `puppeteer`.
       - `PatternPreview.astro` renders **no image and launches no browser**.
         It is a map of **10** hand-authored HTML fragments (of **39**
         patterns) drawn inline and scaled by a CSS custom property.
         `grep -E 'puppeteer|browser-harness|screenshot'` on that file → 0,
         and its own header states the scoping is deliberate: *"only patterns
         whose screens read at tile size get one — a dense list-report shrunk
         to 16rem is grey noise, and a preview that cannot be read is worse
         than text."*

       So "already exists" names a **different mechanism** than the one that
       ships, and the two have opposite cost shapes: the shipped one costs
       authoring per tile and zero build time; the named one costs build time
       and zero authoring. **That scoping sentence is the live design question
       this item now has to answer** — **40** components at tile size (from
       **39** pages) is exactly the case the pattern precedent refused for
       dense screens, and it refused it for **29 of 39** patterns.

       **COST, ROUTE A (the mechanism the item names).** One browser launch
       plus navigate-and-screenshot the first `<section class="demo">` on each
       component page, at 1440x900, against the built `dist/` served by
       `serve-dist.mjs` — i.e. the build step this item would add. Three runs
       in a cloud container; the probe is ad-hoc, not a gate, so the figures
       are snapshots:

       | | run 1 (cold) | run 2 | run 3 |
       |---|---|---|---|
       | browser launch, paid once | 2,337 ms | 259 ms | 243 ms |
       | wall for all 39 pages | **11,640 ms** | **8,013 ms** | **8,022 ms** |
       | median navigate / page | 106 ms | 87 ms | 88 ms |
       | median screenshot / page | 111 ms | 93 ms | 97 ms |
       | PNG bytes emitted | 1254 kB | 1255 kB | 1255 kB |

       So **~8 s warm, ~11.6 s cold, and +1.23 MB in `dist/`** — **8.8%** on
       top of the tree as built here (14,549,590 bytes over 526 files,
       `find apps/docs/dist -type f -printf '%s\n'`). Navigate p90 119 ms /
       p50 88 ms, screenshot p90 131 ms / p50 97 ms; slowest page
       `data-table` at 632 ms cold.

       **The byte column is stated at the precision it was taken, which is
       not the precision it is tempting to claim.** Only run 3's per-page
       bytes were kept (**1,284,734** exactly); runs 1 and 2 are the probe's
       own rounded kB print. So the honest reading is *the three agree to
       within 0.1% while the wall times move by 45%* — enough to reconcile
       the probe as measuring rendering rather than load, and NOT the
       byte-identical claim a first draft of this table asserted from one
       run's JSON.

       **39, not 40, and that reconciles rather than surprising:** `skeleton`
       and `state` share `/components/state-patterns/`
       (`api.pageSlug`), which is the pair CLAUDE.md's recipe already names.
       Every one of the 39 had a `<section class="demo">` — a 100% that is
       structural, not a dead detector: `check-page-shape` requires a demo
       section on every component page, so any other answer would be a gate
       failure.

       **COST, ROUTE B (the mechanism that actually ships).** Zero build time
       and zero bytes; the cost is authoring, and the shipped precedent has
       paid it **10 times in 39** patterns since 2026-08-23. This route has no
       measurable build cost to state, which is itself the answer the Accept's
       second clause wanted.

       **BADGE AUDIT — the Accept's first clause, run in advance against every
       component in `api.json` (n = 40).** Four resolve cleanly; **two trace
       to no JSON key at all** (`pattern links`, and the `JS-required` third
       of the maturity label), and **one traces to a key that is empty for
       every component** (`AT line`) — a distinct case, not a third failure:

       | badge | resolves | source |
       |---|---|---|
       | name | 40/40 *(tautological — the name IS the `api.json` key)* | `api.json.components` |
       | tagline | 40/40 | `meta.tagline` — 249.8 makes the core build **throw** without one, so this is structural |
       | DSA score + date | 40/40 | `dsa-scores.json` (`scored` = a date; 3 distinct: 2026-08-21/23/28) |
       | floor | 40/40 | `floor.json.perComponent` |
       | AT line | **0/40** | `at-evidence.json.components` is `{}`; the file's own `blockedBy` names Slice 15, owner hardware |
       | pattern links | **29/40**, and **no JSON key exists** | only the BUILT pattern pages' "Components used" lists (39 of them); `patterns-index.json` and `patterns.json` contain no such key |
       | CSS-only / JS-enhanced / JS-required | **binary, not ternary** | the intersection is computable; **nothing in the repo distinguishes "JS-required"** |

       Four consequences, each a real change of scope:

       1. **The AT badge is an absence on every card, not on some.** That is
          the state 249.3 built `Maturity.astro` to render, so this is
          designed-for rather than blocking — but a card laid out assuming a
          populated AT line is laid out for a case that does not exist.
       2. **Pattern links need a generator that does not exist, and it cannot
          read `dist/`.** `astro build` runs before every dist-walker in the
          build script, so a page consuming this mapping needs it emitted
          from source beforehand — the shape `gen-patterns-index.mjs` and
          `gen-patterns.mjs` already have, both of which run before
          `astro build` and read `src/pages/patterns/*.astro`.
       3. **11 components are named by zero patterns**: `breadcrumb`, `date`,
          `file-upload`, `icon`, `navbar`, `ordered-list`, `prose`,
          `richtext`, `sidebar-nav`, `tree`, `tree-table`. `date` reading
          zero is the deprecation working (45.3); the rest are the
          zero-reach question 150.1 already says is not automatically a
          defect. A card must render "no pattern uses this" without it
          reading as a fault.
       4. **The stated derivation over-reports, and the obvious fix
          under-reports.** `classes ∩ hooks` reads **23/40** — but
          `approval-workflow` matches on `data-state` alone, a vocabulary
          **6** components share and **6** behaviors hook, and no
          `approval*.ts` exists in `packages/core/src/js/behaviors/`.
          Anchoring the match to the component's own block instead reads
          **20/40** and drops `dialog` and `scan`, which are genuinely
          JS-driven through data attributes (`scan` is the documented
          attribute-only component `check-components-used.mjs` already
          carries an exception for). So one rule produces a false positive
          and the other two false negatives: this badge needs a recorded key,
          not a set intersection.

       **CORRECTION TO THE AUDIT'S `pattern links` ROW — measured 2026-09-04
       (cloud wake), and it is what 249.18 was split out to land.** Two of the
       three things that row and consequence 2 assert do not hold. The **29/40
       reproduces exactly**, from a route the audit did not use, which is what
       makes the rest of the correction believable rather than a second opinion:
       inverting `patterns-index.json`'s per-tile `components` gives 29/40 and
       the same eleven names, character for character.

       - **"No JSON key exists … only the BUILT pattern pages' lists" is
         false.** `src/data/patterns-index.json` has carried the relation per
         tile all along — `groups[].tiles[].components` as `{href,label}` — and
         `gen-llms.mjs:155` already republishes it in `llms.txt` as `uses:`.
         `node -e "const t=require('./apps/docs/src/data/patterns-index.json').groups.flatMap(g=>g.tiles); console.log(t.length, t.flatMap(x=>x.components).length)"`
         → `39 165`.
       - **"A generator that does not exist, and it cannot read `dist/`" is
         false, and it named the answer without recognising it.** Consequence 2
         describes building a generator "the shape `gen-patterns-index.mjs` and
         `gen-patterns.mjs` already have, both of which run before `astro build`
         and read `src/pages/patterns/*.astro`" — which is not a shape to copy
         but the script that already does it. The missing piece was the
         **inversion**, a dozen lines over data already in the tree, not a new
         page-parsing generator. That is the whole cost delta this correction
         buys.
       - **The eleven zero-reach names contain one FALSE zero: `sidebar-nav`.**
         `/components/nav` is a registered redirect to `/components/sidebar-nav`
         (`astro.config.mjs`), and `app-frame` and `suite-home` both cite the
         component by that old href — 5 links across the two pages. Matching
         hrefs literally, as the audit did, reads that as an absence.
         Redirect- and anchor-aware, the count is **30/40 reached, 10 zero**;
         the removed name is `sidebar-nav` alone, and the other ten stand. So
         consequence 3's list is ten, not eleven, and a card built on the
         literal reading would have rendered "no pattern uses this" for a
         component two patterns do use — the exact mis-render consequence 3
         warns about, arriving through its own input rather than its layout.

       **What this does NOT change:** the AT badge (0/40, Slice 15, owner
       hardware) and the JS-tier badge (consequence 4 — still needs a recorded
       key, not a set intersection) are untouched, and the deliverable is still
       a catalogue page whose point is rendered miniatures. Only the pattern-
       links badge's data half moved, and it moved to 249.18.

       **STILL OPEN, and browser-blocked in the SCREENSHOT sense**
       (`LOOPS.md` 186.2's vocabulary): the deliverable is a catalogue page
       whose point is rendered miniatures a human compares. A LOCAL wake can
       build it. What a cloud wake could take is measured above and banked
       here so the next wake does not re-derive it.

10. [ ] **249.10 — SAP/Fiori terminology column for 249.7.** Owner
        vocabulary — value help, ALV, guided procedure, F4, message, maintain.
        **OWNER CALL.**

11. [ ] **249.11 — "Migrate an existing admin UI" path.** No page exists.
        Which stack is the entry point decides whether this is one page or a
        pattern family. **OWNER CALL.**

12. [ ] **249.12 — Archival trigger for `ROADMAP.md`.** The archive-sweep
        *practice* exists (Slices 224, 228, 235.2, 237.1 all did one); no
        stated trigger (on slice close? every N slices?) exists. **OWNER OR
        ARCHITECTURE CALL** — low urgency, the sweep keeps happening
        regardless.

**Sent back to the owner rather than dispatched, because the proposal's own
justification doesn't hold:**

13. [ ] **249.13 — Reconsider demo-first/spec-last (the proposal's B1),
        explicitly, not as a ratification.** The facts check out exactly —
        `data-table.astro`'s Markup section is its 18th and last `<h2>`,
        `check-page-shape.mjs` gates the position with test cases proving it.
        But the proposal argues for reversing it as "1 reviewer beats 0
        readers," which misstates the 2026-08-16 decision: that call came
        from comparing four established framework docs sites with zero
        exceptions found for demo-first/spec-last (this file, then
        `CLAUDE.md`, states the comparison explicitly). The proposed reversal
        (Markup moves to position 2, spec tables stay generated-only at the
        end) is a defensible design on its own merits and costs only moving
        one block — but reversing a dated, gated, cross-referenced decision is
        the owner's call to make with the real tradeoff in front of them, not
        something a triage settles by itself. **OWNER CALL**, recommended
        default: keep spec-last unless the owner weighs the new evidence
        against the original four-site comparison and prefers the change.

**Split out of 249.2 while building it, rather than left implied by a ticked
box (2026-09-03, cloud wake):**

14. [x] **249.14 — DONE 2026-09-03 (cloud wake). A description on each of the 28
        `suite/` pages.** 249.2 closed
        `name="description"` on 127 of 127 built DOCS pages; the suite is the
        other 38 minus the 10 redirect stubs, and it is deliberately outside
        `distPages()` (an app, not documentation, copied in after `astro build`,
        gated by `npm run suite`). Every suite page's head comes from ONE place —
        `examples/erp-suite/_shell.mjs`'s `page({ title, moduleId, trail, body })`
        — so the mechanism is one added parameter; the work is authoring 28
        descriptions and threading them from each `*.screen.mjs`. Deliberately
        not folded into 249.2: the mechanism is one line and the content is a
        second chunk the size of the first, which is LOOPS' "an improvement
        bigger than the item becomes a roadmap entry".
        - **Accept:** `npm run suite`'s audit gains an arm asserting every built
          suite page carries a `<meta name="description">` of at least 40
          characters and that no two share one — the same two arms
          `check-metadata.mjs` runs over the docs, red-proved the same way
          (strip one, duplicate one, confirm each injection landed in the BUILT
          file before believing the red). A page whose description is absent or
          shared fails, naming it.

        **Every figure in the premise reproduced before building**, per this
        file's own rule: `find examples/erp-suite -name '*.screen.mjs' | wc -l`
        → 28, the built suite is 28 pages, and
        `grep -rn 'name="description"' examples/erp-suite/` returned **nothing**
        — so it really was 0 of 28. `page()` really is the only head.

        **Shipped:** `page()` takes a `description` and emits the tag;
        `DESCRIPTION_MIN = 40` is exported from `_shell.mjs` and read by both
        the render and the gate, so the floor is one number (the `MARKUP_RULES`
        precedent). 28 descriptions authored one per `*.screen.mjs`; measured
        **105–123 characters**, 28 distinct.

        **The render THROWS rather than defaulting, and that is the load-bearing
        choice.** A default would be a string all 28 share — which passes a
        presence check in full and would satisfy the length arm too; only the
        distinctness arm would catch it, and the render should notice before a
        gate does. `page()` also refuses a description containing `"`, which
        would end the `content="…"` attribute early and ship the rest of the
        sentence as stray markup in `<head>` — present to a grep, broken to a
        consumer.

        **Verified against what it RENDERS, not against the diff.** The
        insertion touched 31 files in one pass, so the assertion run was
        CLAUDE.md's row-label pairing: every built page carries the description
        authored for *that* source file — **28 of 28**, compared value-for-value
        rather than counted.

        **Four red-proofs, each with the injection confirmed before the red was
        believed:** (a) the tag stripped from one built page → confirmed 1 → 0
        tags in the file, gate red naming `/p2p/purchase-order.html`; (b) one
        page's description copied onto another → confirmed the identical
        `content` on both files, gate red naming both; (c) a 13-character
        description → gate red naming the page and the count; (d) source side, a
        screen with its `description` removed and a second with an 8-character
        one → the build itself throws, naming the page in both cases.

        **The fail-fast claim was made true rather than softened.** The first
        version of the comment said a missing description fails in milliseconds
        instead of after 28 screens × 2 widths of axe — but `failures` was only
        reported at the very end, so it did not. The arms now report and exit
        before the browser starts. The trade is stated in the comment: a run
        that trips here shows only these failures, and an axe violation on the
        same screen surfaces on the next run.

        **NOT VERIFIED, named rather than implied:** this was a cloud wake, so
        the 1440/390 light-and-dark screenshot lane could not run. It has
        **no rendered surface** — `<meta name="description">` is invisible, no
        CSS or body markup changed, and `check-erp-suite` confirms the suite
        still ships zero CSS of its own. `npm run suite` swept all 28 screens at
        both widths: zero axe violations, no sideways scroll at 390.

15. [x] **249.15 — DONE, Slice 295.** The one static OG image 249.2 named and did not build.
        Everything else in 249.2 shipped; this did not, because a social preview
        card is a *rendered image a human compares* — `ENVIRONMENT.md`'s first
        list, which a cloud wake cannot take. **browser-blocked in the
        screenshot sense, so a LOCAL wake can do it and a cloud wake should not
        pick it up.** Note the site currently has no `og:` or `twitter:` tag at
        all, so this is the whole card, not just its image.

        **RE-SCOPED 2026-09-04 (cloud wake): the TAG half is split out as
        249.17 and has landed (Slice 260); what is left here is the image.**
        Same split as 249.16 out of 249.4, for the same reason — a derivation
        half was being held behind the one half that needs a human's eyes. The
        premise was re-checked on the BUILT artifact before splitting, per
        CLAUDE.md's premise rule, and it held:
        `grep -rl 'property="og:' apps/docs/dist --include='*.html'` returned
        **0 of 138** built `index.html` files on a full `docs:build` of
        `3e1dac1` (`name="twitter:` likewise 0).
        - **Accept, image half (this item):** every built docs page carries
          `og:image`; the referenced path resolves to a file that exists in
          `dist/`; `check-metadata.mjs` gains that arm and it is red-proved by
          pointing `og:image` at a path that is not there. `twitter:card` moves
          from `summary` to `summary_large_image` in the same change, and
          arm 5's assertion that it is `summary` while no image ships is
          removed rather than left contradicting the new tag. Whether the card
          LOOKS right is the part that needs the local wake's eyes.
        - *(As first written, before the split — the clauses now covered by
          249.17 are struck through.)* ~~every built docs page carries
          `og:title`, `og:description` (agreeing with the page's own
          `name="description"`, asserted rather than assumed), `og:url`~~ and
          `og:image`; the image resolves to a file that exists in `dist/`;
          `check-metadata.mjs` gains the arm and it is red-proved by ~~removing
          the tag from one built page and by~~ pointing `og:image` at a path that
          is not there.

16. [x] **249.16 — DONE, Slice 254.** The one hand-made README screenshot, split out of 249.4.
        One screenshot of `patterns/list-report` at `data-density="compact"`,
        labelled as hand-made in alt text, in both READMEs. **browser-blocked
        in the screenshot sense** (`ENVIRONMENT.md`'s first list, `LOOPS.md`
        rule 4's vocabulary): its evidence is a rendered image a human
        compares, and a cloud wake must not take it. Split from 249.4 on
        2026-09-03 because the other three halves are plain derivation and were
        being held behind it.
        - **Accept:** both READMEs carry ≥1 image; the referenced file exists in
          the repo and, for the package README, inside the published tarball
          (`npm view @busy-office/ui` is the authority on what shipped, not
          `npm pack` — roadmap 185); `stamp-readme --check` still exits 0.

17. [x] **249.17 — DONE, Slice 260.** The `og:`/`twitter:` tag set, split out
        of 249.15 on 2026-09-04. 249.15 is the social CARD; this is everything
        about that card which is not a rendered image, and a cloud wake can
        take it in full — the evidence is `<head>` content in the built
        artifact, which is `ENVIRONMENT.md`'s SECOND list. Split for the same
        measured reason 249.16 was split out of 249.4: the derivation half was
        being held behind the half that needs a human's eyes.
        - **Accept:** every built docs page carries `og:type`, `og:site_name`,
          `og:title`, `og:description`, `og:url` and the three `twitter:` tags;
          `og:title` EQUALS that page's own `<title>` and `og:description`
          EQUALS its own `<meta name="description">`, asserted on the BUILT
          page rather than assumed; `og:url` equals the published URL
          `dist-pages.mjs` derives by WALKING `dist/`, which is a second
          derivation that cannot see the one `SocialMeta.astro` builds from
          Astro's route table; the arm is red-proved twice — a tag deleted from
          a built page, and one page's `og:title` made to disagree with its own
          `<title>` — with each injection confirmed present in the built HTML
          before the red is believed.

18. [x] **249.18 — DONE, Slice 261.** The component→patterns mapping, split out
        of 249.9 on 2026-09-04. It is one of the two badges 249.9's own audit
        found tracing to no JSON key, and it is pure derivation — no rendered
        image, `ENVIRONMENT.md`'s SECOND list — so a cloud wake can take it in
        full while the catalogue PAGE (rendered miniatures a human compares)
        stays with 249.9. Third split of this shape in three days, after 249.16
        out of 249.4 and 249.17 out of 249.15.

        **It exists because 249.9's stated cost for this badge is wrong**, and
        that premise was re-checked before the split rather than inherited
        (CLAUDE.md's premise rule). See the correction block under 249.9.
        - **Accept:** `patterns-index.json` carries a `byComponent` key emitted
          by the same generator that already emits the forward relation, with
          **one entry per component docs page including the ones no pattern
          names** (an absence is an empty array, never a missing key — 249.3's
          "absence is rendered, never blank"); hrefs are resolved through a
          redirect map with exactly ONE home in the repo, imported by both
          `astro.config.mjs` and the build-time reader rather than re-parsed,
          and the resulting reached/zero counts agree with an inversion taken
          independently of the generator; a gate arm re-derives the mapping
          from the **BUILT** pattern pages — a route the source-side regex
          cannot see — and fails when the shipped key disagrees, red-proved by
          injection with the injection confirmed present in the artefact before
          the red is believed.

19. [x] **249.19 — DONE, Slice 262.** The Related-link gap 249.7 banked as
        *"worth keeping either way"*, split out of 249.7 on 2026-09-04. 249.7
        is a COST question about a terminology table and waits on the owner's
        `249.10`; this is the one measurement inside it that is neither
        terminology nor owner-blocked, and it is `ENVIRONMENT.md`'s SECOND
        list — hrefs and prose in the built artifact, no rendered image.
        Fourth split of this shape in three days, after 249.16 out of 249.4,
        249.17 out of 249.15 and 249.18 out of 249.9. The route to it is the
        same one `RESUME.md`'s correction block names: read the clause, not
        the item's label.

        **The banked premise was re-derived independently before acting and
        held** (CLAUDE.md's premise rule) — and then the base rate refuted the
        obvious fix. Reciprocal linking is NOT the norm here: 29 of 97 pairs
        (29.9%), with 55 pairs where the target never names the source, so
        `dropdown`/`combobox` is one instance of a general property and a
        symmetry gate is refused. What justifies fixing this ONE pair is
        page-local: combobox's opener already claims the boundary from its
        side, and dropdown's answered only the too-few-options case. Full
        commands and figures in Slice 262.
        - **Accept:** the dropdown page's own content region links `combobox`,
          in the opener as a wrong-choice alternative and in `Related`, with
          the change argued from that page's own clause rather than from the
          symmetry statistic; the whole-page-versus-content-region readings
          are recorded side by side so a later reader can see why the anchor
          is load-bearing; and any gate proposed off this finding is measured
          for base rate BEFORE it is written, with the refusal recorded when
          the predicate is uniformly true.

20. [x] **249.20 — DONE, Slice 264.** The JS-tier badge's recorded key, split
        out of 249.9 on 2026-09-04. It is the second of the two badges 249.9's
        own audit found tracing to no JSON key — 249.18 took the first — and
        like it, it is pure derivation, `ENVIRONMENT.md`'s SECOND list, so a
        cloud wake can take it in full while the catalogue PAGE (rendered
        miniatures a human compares) stays with 249.9. Fifth split of this
        shape, after 249.16 out of 249.4, 249.17 out of 249.15, 249.18 out of
        249.9 and 249.19 out of 249.7.

        **249.9's consequence 4 was re-derived before the split rather than
        inherited** (CLAUDE.md's premise rule) and reproduces to the number:
        `(classes+dataAttrs) ∩ hooks` reads **23/40**, `classes ∩ hooks` reads
        **20/40** and drops `dialog` and `scan`, and `approval-workflow`
        matches on `data-state` alone — a vocabulary **6** components declare
        and **6** behaviors hook. Two things it did not say, measured here:
        the intersection's false positives are **structural, not incidental**
        (`form` matches 16 behaviors and `button` 5, because behaviors hook the
        shared primitives `bo-input`/`bo-btn` that those components define —
        composition, not a JS requirement); and `scan` declares **zero**
        classes, so no class-anchored rule can ever see it.
        - **Accept:** the relation is DECLARED in the shipped artifact — a
          directive in each behavior module's header, with the core build
          throwing and naming the file when it is missing, empty, or names a
          component `api.json` does not have — and published as a key carrying
          **one entry per component including the ones nothing serves** (an
          absence is an empty array, never a missing key — 249.3's "absence is
          rendered, never blank"); the published hook surface is asserted
          byte-identical to the previous build, because the directive sits in
          the same comments the hook scan reads; and a gate re-derives the
          relation from an INDEPENDENT source — what the BUILT component pages
          claim in their own "JS required" row — and fails when the two
          disagree, with its base rate measured before it is written and its
          red-proof asserting the injection landed in the built page before the
          red is believed.

**Refused, recorded as DA (not re-litigated here — see the triage file for
each item's reasoning):** publish-on-every-push/auto-bump, a `registry.ts`
model for component metadata, thirteen mandatory page headings, hand-typed
stability/tested badges, `COMPATIBILITY.md` as prose, `docs/decisions/`
duplicating `.roundtable/`, per-page generated OG images, a bundlephobia
badge, an npm keyword blob, Preview/Code tabs (already decided, roadmap 118),
search-side query expansion, and framework-owned column persistence.

**Concurred without a new item** (already correctly scoped, or resolved by
an item above): the visual-catalogue and split-DESIGN.md items (B3→249.9,
B4→ not separately filed, folds into ongoing `.roundtable/` practice already
in place — `DESIGN.md`'s Principles-only split and a `CONTRIBUTING.md` are
low-risk and can be built directly without a triage item; flagged here so a
future wake doesn't re-propose it from scratch), and the stability-field item
(B5, folds into 249.8's CSS-header convention once that lands — declaring
`stable`/`experimental`/`deprecated` as a field is a small extension of the
same `@tagline`/`@category` header mechanism, not a separate design).

## Slice 248 — Component-by-component design-grill: 40 of 40 covered, 1 real defect fixed, one instrument caught lying to itself (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 247 — 245.1 built: both of 244.3's counts corrected against a named revision, and upholding the "leave the log row alone" bullet found that bullet's OWN citation pointing at the wrong row (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 246 — 244.4 built: the src/css chokepoint gets its gate, and the design question it carried is answered by a count nobody had taken — there are FOUR chokepoints in this repo, one of them gated (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 245 — Objective grill of Slices 238, 241, 243, 244: twenty-nine of thirty-one published claims reproduce, and the two that do not are ONE item's two counts of one set — six and eight against a tree holding five before and seven after (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 244 — Standardize sweep: all four standing lanes clean, and the finding came from the fifth thing the playbook names — `cssFiles` hand-copied four times, one of them already diverged (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 243 — 242.1 refused: arm 8 does not become a build gate, and neither of the two arguments its Accept anticipated is what decided it — the predicate is unsound in the one direction nobody injected, red-proved by a score that stays correct while the arm goes red (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 242 — Polish round 2 on `component/dashboard`: the seventh recorded defect is the first where the SCORE was wrong, not the cite — `interaction: na` on a component that ships a behaviour, blind re-scored to 3 by a second agent (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 241 — 240.1 closed on its OWN second branch: the chevron's two hex literals are not removable, measured four ways — and the item was never browser-blocked, only its first branch was (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 240 — Polish round 2 on `component/calendar`: six arms clean, and a SEVENTH finds the sixth recorded defect — the one cite in the framework that claims an absence the shipped CSS does not have (2026-09-02)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 239 — Polish round 2 on `component/tree-table`: NO-OP on six arms, and the sixth is the class arm 5 structurally cannot see — where 3 of this ledger's 5 recorded defects lived (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 238 — Objective grill of Slices 232, 234, 236, 237: twenty-four of twenty-five published claims reproduce, and the one that does not is the count written BESIDE a premise that was correctly re-run — five archive commits reported as four, at two durable sites (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 237 — Standardize sweep: lanes 1-3 clean an ELEVENTH time, lane 4 dispatched the ninth archive sweep, and the file that sweep writes into was still instructing the opposite of the rule written beside dispatcher rule 4 the day before (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 236 — Objective grill of Slices 232, 233, 234, 235: every published figure reproduces except one, and the two findings are both about what a verification CANNOT see — a corroborating count that measures its own explanation, and a sweep that archived the target of an open item's Accept (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 235 — Standardize sweep: lanes 1-3 clean a TENTH time, and lane 4's finding is that the sweep's own instrument has never had a file — five runs, one copy, living inside an archived slice. Committing it exposed two owner calls no run could see, and the sweep it enabled exposed three self-referential stubs in the archive (2026-09-01)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 234 — 232.2's closing measurement is wrong about its own headline: the defect was introduced by 42.1, the commit that WROTE the sentence, and both dispatchers confirmed the opposite from the same single-file probe (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 233 — 231.2's new prose asserts two computed facts and nothing executes either; found by the THIRD independent build of 231.2 (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 232 — Objective grill of Slices 229, 230, 231: 230 and 231 survive entirely, and both findings are against how 229's refusal RECORDED its numbers, not against the refusal (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 231 — Polish round on `component/alerts`: the reconciliation is a NO-OP, and the sweep that surrounded it found one shipped variant with no recorded reason anywhere (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 230 — Standardize sweep: lanes 1-4 clean a ninth time, and the drift carried for three wakes was a genuine one-off — 5 of 6 parsing pages already asserted (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 229 — Objective grill of Slices 222, 226, 227, 228: every decision survives, the best candidate finding was already gated, and the one mirror no gate can see is fixed (2026-08-31)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 228 — Standardize sweep: lanes 1-3 clean an eighth time, and lane 4 carries the finding again — the archive sweep is due a SEVENTH time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 227 — Polish round 1 on `component/icon`: a stale count that was also a DIVISOR (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 226 — the fixed `check:po-app`, run in a cloud container for the first time (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 225 — Objective grill of Slices 218, 219, 223, 224: a citation that quoted its own re-run command into permanence, and everything else held (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 224 — Standardize sweep: three of four lanes clean, and the fourth found a stale trap in the file Step 0 reads every wake (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 223 — owner call: move the shipped htmx integration and both example apps to htmx 4, dropping `apps/docs`'s boosted navigation in the process (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 222 — `check:po-app` after 211.1: the previous wake's open question, answered by measurement — 2 of 19 becomes 1 of 19 here, and 19 of 19 on CI (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 221 — Owner direction: pin htmx to 4, and plan the framework update. Slice 114's refusal is SUPERSEDED, and its own reopen condition is half-met (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 220 — Polish round on `breadcrumb`: the count-bearing cite class pays out a second time, and the pick was a filed defect rather than a tie-break (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 219 — the `aria-current` pairing gate stops at the docs dist, and the one violation it would have caught lived outside it (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 218 — Owner-forwarded review: `data-state`/`data-status` conflation, scoped to two components not the framework (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 217 — Polish round on `sidebar-nav`: a cite that was EXACT when written and decayed two days later, and the count-bearing class measured at 6 of 240 (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 216 — Polish round on `data-table`: a DSA cite that was already stale on the day it was scored, and a cloud wake lapped by 37 slices (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 215 — Objective grill of Slices 211, 213, 214: the open item's refusal cites a page that does not say it, and every container htmx measurement ran a version the app does not ship (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 214 — Standardize sweep: lanes 1-3 clean for the sixth time, and lane 4 carries the finding again — the archive sweep is due a SIXTH time, one day after the fifth (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 213 — P0: a windowed-list spacer is sized from ONE sampled row that is not representative, so every evicted chunk is 49px short and re-loading it jumps the scroll (2026-08-30)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 212 — Objective grill of the 200/208/209 window: a refusal's own base rate missed the declaration its cited gate names in its header, and the arming set needed narrowing for the third grill running (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 211 — two things 208.3's root-cause turned up: a reference app that cannot run without the public internet, and a scroll-anchor assertion nobody had ever exercised in a container (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 210 — the motion-literal gate refuses itself: 0 of 23 under its own wording, and its only three reds under a wider one are three right answers (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 209 — Objective grill of Slices 205, 208: the sweep proved itself against a state it never committed, and the floor script publishes a prefixed version its sibling filters out (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 208 — Standardize sweep: the fifth clean result came from three lanes, and the fourth lane — unread by all four prior sweeps — was carrying the finding (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 206 — Standardize sweep: fourth identical clean result, and one genuine candidate examined and correctly left alone (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 205 — `check:rf-floor` says "every use of a feature above Chrome 108 is guarded" while checking a fixed list of six (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 204 — P0: `check:claims` turned CI red for three commits [**Corrected by 346.1:** five — 3 when measured, 5 by the time the fix pushed, per this slice's own body] by asserting a claim the headless browser structurally cannot evaluate (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 207 — Objective grill of Slices 204, 206: an environment fact went stale within the same day, and the self-healing gate absorbed it with no code change (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 203 — Objective grill of Slices 199-202: the P0 fix's own gate re-verified by injection, two triage refusals confirmed against source (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 202 — Standardize sweep: clean, and the two things this window's own new artefacts might have duplicated, checked directly (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 201 — P0: two undefined token references silently deleted the declarations that named them (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 200 — triage: an external "micro-motion UX review" proposal, checked against the shipped CSS before anything was filed (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 199 — the two things 193.2 left open: a denominator it could not reproduce, and a refused decision whose trigger had already fired (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 198 — Objective grill of Slices 193, 196, 197: a clean control, re-derived rather than re-copied (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 197 — Standardize sweep: all three standing lanes clean, delta 0 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 196 — Objective grill of Slices 190, 191, 192 (the artefact half): twelve measured claims reproduce, and the thirteenth was reasoned out beside them (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 195 — Objective grill of Slices 190, 191, 192 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 194 — Standardize sweep: the previous sweep's own fix pointed at the next one (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 193 — Objective grill of Slices 186, 189, 190, 191: the window's artefact claims all hold, and the one obligation it left behind was never read (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 192 — Objective grill of Slices 186, 189, 190, 191 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 191 — Standardize sweep: three lanes clean, and the fourth was reading a number its own command cannot print (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 190 — Objective grill of Slices 173, 185, 187: the measured claims all held, the reasoned ones did not (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 189 — Objective grill of Slices 173, 185, 186, 187 (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 188 — the release now ships the front door, and the tag assertion is replaced rather than dropped (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 187 — Standardize sweep: three clean lanes, and the one duplicate they cannot see (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 186 — Objective grill of Slices 180, 183, 184: the loop's self-descriptions are the thinly-gated surface, and the hand-off is wrong at HEAD (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 184 — rule 5 has read ten-day-old numbers for ten wake-dates, and the Accept criterion that was supposed to prevent it stopped holding the day it was ticked (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 185 — `create-ui` is RELEASED, and two of this slice's own diagnoses were wrong (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 183 — the visual backlog that waited eight wakes, cleared (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 182 — Polish round on `state-patterns`: the rubric cited the bug, not the fix (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 180 — P0: a loop-name tally is read as a slice citation, and `main` has been red since (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 179 — Objective grill of Slices 173, 176, 177, 178 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 178 — Standardize sweep: the split that outran its own instrument, and a page that disagrees with itself (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 27 — triaged from the owner QA review (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 28 — from the Objective grill of Slices 26-27 (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 32 — preventing AI slop when building with this framework (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 49 — Standardize sweep: inline styles, and the paths sweep's leftovers (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 57 — Owner input: the Ive design principles, installed (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 63 — Standardize sweep: finishing last sweep's partial review (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 144 — Owner wishlist: login's sticky actions, a comment/chat component (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 145 — Score the ERP-suite screens so the loop can benchmark them (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 143 — Owner wishlist: motion bug, sidebar-nav, offcanvas (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 142 — Owner wishlist: skeleton motion, state standardisation, command-bar states (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 141 — Owner: standardize the command bar (2026-08-25)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 139 — Gap ledger promotion: the list screen with no way to create (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 140 — The two watch items: one refused, one already scheduled (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 138 — Owner wishlist: joined fields (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 137 — Owner wishlist: the richtext toolbar (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 136 — Owner: grill the rich-text DESIGN (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 135 — Owner wishlist: the RF track, four asks (2026-08-24)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 134 — `test:visual` is red, and nothing runs it (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 133 — Owner: prove the scrolling actually works (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 132 — Owner wishlist: date entry, three pickers, list-to-list (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 131 — Owner wishlist: the RF pages show the screen twice (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 130 — ERP suite examples: the gap-finding instrument (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 129 — Objective grill of 126-128, and the gate hole it found (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 128 — Standardize sweep, round 1 (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 127 — the mobile-ERP candidates, grilled to builds (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 126 — RF coverage, grilled to a scope (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 125 — Explore/Research fallback: dogfood bugs + mobile-ERP candidates (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 124 — Owner: the left bar on a toned cell (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 123 — Owner answers, seven decisions in one message (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 122 — Owner wishlist: Amount decimal control + live masking (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 121 — Owner ask: grill the pattern catalogue for coverage + showcase (2026-08-23)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 120 — Owner wishlist: dependent dropdowns, checked against an article (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 119 — Owner wishlist: the pattern catalog review, grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 118 — Owner decision: docs go showcase-first (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 117 — Owner wishlist: form label position, grilled to Top/Start (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 116 — Owner decision: inbox approval rows expand in place (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 115 — Owner input: the Motion System proposal, triaged (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 114 — Owner wishlist: adopt htmx 4 (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 113 — Owner wishlist: improve the rich text sample (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 112 — External governance/conformance proposal, grilled to a pilot (2026-08-22)

Owner supplied a rev-3 "Documentation, Governance & Conformance Improvement
Proposal" (uploaded 2026-08-22) proposing a consumer-facing validator
(`@busy-office/check`), a Screen Contract YAML, pattern metadata, a Quality
Index, waivers/SARIF/benchmarking, and a six-section docs IA. Reviewed
against the repo: **most of its P0 already exists here under other names**
(Surface Fitness ≈ the DSA rubric; admission gate ≈ the 99.4 front door;
mandatory doc cores ≈ the two recipes + `check-page-shape`; canonical
generated metadata ≈ the docs doctrine). The genuinely new bets were the
Screen Contract + pattern-fit layer. Grilled in a 2-round design-tree
session (report: `.roundtable/grill-112-pattern-fit-proposal.md`); the
owner's deciding call: **the checker is for AI agents building with the
framework** — not human enterprise teams. Final decision made on long-term
benefit: build the metadata substrate unconditionally; every superstructure
stays evidence-gated.

**Sequencing (settled Q5): this slice queues BEHIND 110.4 and 109.3.**
109.3's per-section quality bar is what the pilot judges against, and
109.3 grows the 13 outstanding wrong-choice clauses (settled Q9 — one pass
per page, not two).

1. [x] **112.1 — DONE 2026-08-22. `patterns.json` extracted, `gen-patterns.mjs`.**
       Self-tested (`--self-test`, red-proved by breaking the row regex and
       confirming the cases meant to catch it went red), reconciled by hand
       against 9+ pages including edge cases (a nested `<code>` tag inside
       a Data-contract cell, a wrong-choice clause with no alternative
       link). Wired into the docs build chain right after
       `gen-patterns-index.mjs`. No new drift gate added — 112.1's own
       Accept asked only for the extractor to be red-proved, not for a
       staleness gate; adding one would be scope creep beyond what was
       asked. Original item text follows.
       `patterns.json`, extracted not authored. A
       `gen-patterns.mjs` scrapes the pattern pages (the single source of
       truth stays the pages, per doctrine) into a generated per-pattern
       record: group, opener, complexity, components-used, the States
       table rows, the Data-contract table rows, and the wrong-choice
       clause text + its alternative link (today detected then thrown
       away by `wrong-choice-rule.mjs`). **Anatomy is deliberately out of
       scope** — its `<li><strong>Region</strong>` convention fuses
       component links into prose (approval's entries carry
       parenthetical asides a naive extractor would swallow); extract it
       only after a page-side convention tightening earns it. Technique
       precedent: `check-components-used.mjs`'s section-slice against
       dist. Red-prove the extractor per the instrument doctrine — first
       output is wrong until reconciled against a hand count.
2. [x] **112.2 — DONE 2026-08-22.** `llms.txt` gained a `## Patterns`
       section generated from `patterns.json`: per pattern, name/URL,
       opener, complexity, components, and the wrong-choice clause +
       alternative link — the task-fit data an agent needs to pick the
       right SHAPE before reaching for components (Objective §4). Kept
       lean deliberately: full States/Data-contract row text stays on
       the page itself, not duplicated here — including it would have
       roughly doubled the file for detail a pattern-fit decision
       doesn't need. Same anti-drift guard as 32.3's precedent (throws
       if the catalogue is missing or under 20 patterns), red-proved by
       truncating `patterns.json` to 2 entries and confirming the build
       actually threw before restoring it. File grew 22.9kB → 36.7kB,
       53 → 81 URLs verified. Full suite green (13 docs gates incl. the
       URL-resolution check on all 29 new pattern links; `check:claims`
       90/90).
3. [ ] **112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR
       ANSWERS (grilled 2026-08-29 at the owner's request; full report
       `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).** The
       block is now *precise*: every precondition the pilot set for itself has
       landed, so briefs are the only remaining input, and four questions
       decide whether they are worth spending.

       - **All four self-imposed gates are met.** Substrate complete
         (`patterns.json`: 39 patterns, **39/39** carrying states, data
         contract and wrong-choice); llms.txt coverage present (83
         `patterns/` refs for 39 pages); 110.4/109.3 landed; wrong-choice debt
         down to 1, and that one is the deprecated `date`.
       - **Part of the superstructure already shipped without the verdict.**
         Q7 said the "Which pattern should I use?" page comes *after* the
         verdict; it shipped as 112.5, generated from `patterns.json`. Half of
         Q7 honoured (canonical source), half not (no verdict). **Recorded,
         not actioned** — the decision with teeth gated only 112.4, and
         un-shipping a generated docs page to satisfy a sequencing clause
         would be ceremony. What it does establish: the verdict no longer
         gates anything a wake can build, only 112.4, which is itself blocked
         on 112.3. A closed loop with the owner on both ends.
       - **The suite answers a NEIGHBOURING question for free** — whether a
         correctly-picked pattern's anatomy suffices (GAP-17, 6 of 7 list
         screens). It must NOT count toward the bar: it measures completeness
         rather than discovery, and it was produced by an agent with repo
         access, so counting it is self-approval.
       - **"Briefs are burn-once" is asserted, not established** — the pilot
         agent is specified llms.txt-only with no repo access, so a fresh
         session arguably cannot see a brief that lives in the repo. Marked
         Hypothesis: the isolation is unverified.

       *Owner decisions needed (recommendations in the report):* is the pilot
       still worth the briefs (**yes, as 112.4's admission gate only**); how
       many (**five, not eight — the bar is an absolute count, so eight raise
       the hit-rate, not the standard**); does suite evidence count (**no**);
       and are briefs re-runnable (**test it with one brief before believing
       either way**).

       **OWNER DECISION 2026-08-29: agree, all four recommendations.** Pilot
       proceeds as 112.4's admission gate only; **5 briefs**, not 8; suite
       evidence (GAP-17-style) does **not** count toward the bar; and the
       burn-once assumption gets tested rather than believed — run the first
       real brief, then re-run that same brief text in a fresh no-repo session
       and compare the two agents' picks/answers before treating any brief as
       spent. If they diverge, brief scarcity is confirmed and 5 stands; if
       they agree, briefs are a re-runnable regression test and the "scarce
       resource" framing that blocked this for weeks no longer applies.

       **Still blocked on one input no wake can supply: the owner writing 5
       real ERP screen briefs with sealed picks.** Nothing else in this item
       is dispatchable until at least the first brief exists in
       `.roundtable/pilot-112/briefs.md`.

       *(original item, unchanged below)*

       **Original item, kept verbatim — BLOCKED ON OWNER BRIEFS —
       protocol owner-confirmed 2026-08-23, scaffold ready.** The owner
       agreed to the protocol (after stress-testing the loop's format
       example — the duplicate-check-vs-reconciliation challenge, which
       also confirmed why briefs must be owner-authored). Scaffold at
       `.roundtable/pilot-112/` (README + briefs.md + SEALED-PICKS.md);
       the loop wrote only the scaffold, never brief content. Waiting on:
       5–8 briefs + sealed picks, then "briefs ready" starts the runs.

       **Realigned 2026-08-24 — still blocked, but with new evidence the pilot
       should account for.** The ERP suite has since built 25 screens from
       these patterns, and GAP-17 found `list-report`'s Anatomy omitted a whole
       region (the create action) — an omission that propagated into **6 of 7
       list screens**. That is real pattern-fit failure data from a different
       direction than the pilot measures: the pilot asks whether an agent
       PICKS the right pattern from the docs; this says a correctly picked
       pattern's own anatomy can be incomplete. It argues for the Screen
       Contract layer's premise without satisfying the pilot's verdict bar,
       which is deliberately about sealed owner picks.
       *(pre-registered protocol follows, unchanged)*
       32-style evidence before any contract surface exists. Protocol,
       pre-registered here so the verdict cannot be argued afterward:
       - **Briefs**: the owner writes **5** screen briefs from real ERP
         memory (revised down from 5-8 by the 2026-08-29 owner decision
         above — the bar is an absolute count, not a rate, so 8 only
         raised the odds of hitting it at 60% more owner time), unseen
         by the loop before the runs, each with the owner's own pattern
         pick sealed in a file the pilot agent can never see.
       - **Agent context**: a fresh subagent gets the brief text plus the
         IMPROVED `llms.txt` (post-112.2) ONLY — no repo access. One
         control brief re-run with nothing but the npm README.
       - **Runs**: one run per brief; any failing brief is re-run twice
         and the failure counts only if it appears in ≥2 of 3
         (variance guard).
       - **Measurement**: the full failure taxonomy, each row arguing
         for its own defense separately — pattern choice, invented
         APIs (regression check on 32.1/32.2), missed states,
         right-pattern-wrong-component (the 42-fields-in-a-Dialog
         class), contract violations.
       - **Verdict bar**: confirmed wrong-pattern picks (vs the sealed
         owner picks) on **≥2 briefs** → the Screen Contract layer earns
         admission and gets designed (112.4). Below the bar → **refused
         and recorded**; 112.1/112.2 stand on their own merits either
         way. Report lands in `.roundtable/`.
4. [ ] **112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.**
       Deliberately undesigned until admitted — schema, delivery
       (extend `bo-check-markup` vs new bin), and finding format are the
       post-pilot grill round. If 112.3 refuses it, this item closes as
       refused with the pilot report as the reason.
5. [x] **112.5 — DONE 2026-08-25, generated from `patterns.json` as required. UNBLOCKED
       2026-08-24 — the coupling to 112.3 cost more than it saved.** A
       task→pattern decision-flow page generated from `patterns.json` (never
       hand-maintained — it would be the fifth interpretation of the pattern
       system the proposal itself forbids).

       It was sequenced after the 112.3 verdict so the page and any contract
       pattern-selection logic would be one authoring pass from one source — a
       real saving, but a small one, and this item's own last line already said
       it **pays regardless of 112.4's fate**.

       **Realignment:** 112.3 has been blocked on owner-authored briefs since
       2026-08-23 and the loop cannot unblock it by design. Holding a page that
       pays on its own behind a gate only the owner can open trades a certain
       benefit for a possible second authoring pass. Decoupled: build it now,
       and accept that a later contract layer might touch it again.

       It is now **the only dispatchable build item in the backlog** — every
       other open item waits on the owner or on an unmet condition.

       **Shipped at `/concepts/which-pattern`**, under concepts rather than
       patterns: it documents no screen, so the pattern-shape gate rightly
       does not apply to it.

       Every cell is read from `patterns.json` — the same file that builds the
       tile index and the sidebar — so adding a pattern adds a row with no
       edit here, and rewording an opener rewords its row. Three things are
       extracted, because they are the three a reader chooses by: the job
       family, who the screen is for, and **the pattern's own statement of
       when it is the wrong choice**. That last is the most useful column and
       the most reliable source, because `check:wrong-choice` requires every
       page to carry the clause.

       Verified against the numbers measured BEFORE building, which is the
       independent check: **39 rows across 6 groups, 39 pattern links, and 17
       alternative links** — the clauses that name another pattern outright
       get a real link to it. Five rows show a dash, and the page says so in
       its own words rather than hiding it: a blank means the clause is
       phrased in a way the extraction did not match, never that the page is
       silent on it. Where a clause describes an alternative instead of naming
       it, the prose stands — inventing a link the author did not write would
       be the page guessing.

**REFUSED, with reasons (recorded per the grill's Q6 — re-open any of
these when a second real consumer of `@busy-office/ui` exists):**
- **Consumer Quality Index /100 + application benchmarking** —
  organizational-governance machinery for teams that don't exist yet;
  fails the proposal's own §16 demonstrated-gap rule. The anti-gaming
  design (§24 medians/percentiles) is good and is preserved here for
  the re-proposal.
- **Waiver system (PASS WITH WAIVERS, expiry, SARIF output)** — CI
  exception machinery for human orgs; an AI agent needs PASS/FAIL and
  readable findings, nothing more.
- **A second Surface Fitness rubric (proposal §13, 5-dim /15)** — the
  six-dimension DSA rubric already exists and is gated; running two
  violates the proposal's own §2.6. Its one real improvement — the
  Removal Cost axis + fitness×cost decision matrix (§15) — may be
  absorbed into the existing rubric as a future Standardize item.
- **The six-section docs IA reorg (§3)** — ~80% renames groups that
  were each measured into place more recently than the proposal was
  written (2026-08-16 comparative IA pass; 104.1's single-source
  grouping). Extracted instead: 112.5, and possibly an Integration
  sidebar group as a future small item.
- **Hand-authored pattern metadata YAML (§30)** — inverts the
  generated-from-artifact doctrine; superseded by 112.1's extraction.
- **A consumer-facing conformance web tool (§34)** — downstream of a
  Quality Index that is itself refused.

## Slice 111 — Owner wishlist: button group, dropdown animation, design-system reference (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 110 — v2 candidates approved and grilled (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 109 — Owner direction: the real-ERP pattern catalogue + regrouping (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 108 — P0: object-page sticky bleed-through, z-index scale, tab-vs-anchor clarity (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 107 — Owner ask: button icon-only / text-only / icon+text (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 106 — P0: leaving the docs shell for the landing page silently failed (2026-08-22)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 105 — Standardize sweep findings deferred with reason (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 104 — Owner wishlist: patterns section + tile index à la namethatui.com (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 99 — Owner direction: patterns as an ERP expert would actually build them (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 103 — Standardize: the dist-walking chokepoint regrew (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 102 — owner wishlist: three grills (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 101 — Objective grill: the loop optimised what it could see (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 100 — Owner wishlist: drag & drop list (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 98 — Standardize: the two wrong-choice gates were one rule, written twice (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 97 — Owner wishlist: validation check UX/UI (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 96 — Owner wishlist: currency on the right of the amount (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 95 — Owner wishlist: device-fitness and ERP-coverage scoring (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 94 — Review, improve and score the remaining 37 components (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 93 — Owner ask: show the alignment score on each component's page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 92 — Owner direction: the design system takes the wheel (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 91 — Standardize sweep: the conventions Slices 84-90 established, applied site-wide (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 90 — /design-grill: the three editing designs (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 89 — Owner screenshot report: two shipped defects in the dirty row-edit row (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 88 — Owner wishlist: split the table-column demos into value + qualifier columns (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 87 — /design-grill: the Combobox page (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 86 — /design-grill: the Forms page ("Data Input - forms", clarified by "next") (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 85 — Owner wishlist: joined ( qty | unit ) becomes Quantity's Basic (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 84 — wake triage-noticing: Slices 71-81 shipped no CHANGELOG entries (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 83 — /design-grill: the "Data input" and "Values" groups (2026-08-21)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 82 — Owner ask: redundancy review across Amount/Quantity/Money docs (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 81 — Owner ask: Quantity basic as ( qty | unit ), joined like Money (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 80 — /design-grill: Quantity's +/− buttons — optional after all (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 79 — /design-grill: Quantity & Money — do they need JS? (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 78 — /design-grill: the numeric family's DOCS — and a shipped UA-chrome defect (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 77 — /design-grill: the numeric family, incl. "Number" (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 76 — /design-grill: Amount vs. Quantity consistency (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 75 — Owner ask: apply the full Jony Ive design document (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 74 — Standardize sweep: sticky-cols' redundant "1" case (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 73 — Owner ask: grill a right-click column-header context menu (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 72 — Owner wishlist: multi-sticky columns, tone text, width/font (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 71 — Owner ask: server-controlled conditional cell tone (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 70 — Objective grill: the po-app dogfood streak (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 69 — Standardize: po-app's own three-Explore-wake drift (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 68 — Explore: record editing dogfooded in po-app (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 67 — Explore: PO creation dogfooded in po-app, a dead link fixed (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 66 — Explore: value-help dogfooded in po-app, backlog empty (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 65 — Standardize: two framework bugs the design-grill sweep queued (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 64 — from the Objective grill, Slices 51-63 (2026-08-20)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 62 — from the Objective grill, Slices 56-61 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 61 — Owner wishlist: a generic, fixed review-screen contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 59 — Owner wishlist: RF-scanner browser floor + a smaller-screen profile (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 58 — Owner ask: run /design-grill across the screens (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 60 — Standardize sweep: one gate hand-rolled its own exit contract (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 56 — from the Objective grill, Slices 52-55 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 55 — Standardize sweep: two decisions that had each been written twice (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 54 — P0 + wishlist from the owner (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 53 — Owner input: grill components on need vs cost (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 52 — Owner wishlist: the Object Page (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 51 — from the Objective grill, Slices 45-50 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 50 — Standardize sweep: how pages carry layout, and one behaviour that knew too much (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 48 — Owner input: the SAP Object Page floorplan (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 47 — Standardize sweep: the widths we verify at (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 46 — from the Objective grill, Slices 37/38/44 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 45 — surface review, batch 1 outcomes (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 44 — from the Objective grill, Slices 39/42/43 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 43 — P0 found while doing 39.3 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 42 — from the Objective grill, Slices 39-41 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 41 — from the Objective grill, Slices 31-40 (2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 40 — icons, SVG, date picker, filter popup (owner wishlist, 2026-08-19)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 39 — the docs must make the first impression (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 38 — is the browser floor too new? (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 37 — score the surface for real ERP fit (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 36 — vertical tabs (owner wishlist, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 35 — P0: tabs worked exactly once (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 34 — field editor: per-row save is the wrong idiom (owner report, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 33 — using this framework from ANOTHER repo, with AI (owner question, 2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 31 — DESIGN.md's own four-pattern table is wrong (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 30 — owner wishlist, triaged (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 29 — owner bug report (2026-08-18)

Closed — archived verbatim in `ROADMAP-archive.md`.

## STATE — no dispatchable work; two owner calls (2026-08-18)

From the Slice 28 grill: `.roundtable/grill-objective-slice28-2026-08-18.md`.

**Every unchecked item in this file is undispatchable.** Three are NEEDS-RUNTIME
on owner hardware (VoiceOver, NVDA, AT runtime evidence); the fourth (Turbo) is
a conditional that has not fired. There is also no 1.0 definition anywhere in
the plan.

*(True on 2026-08-18, not now — 168.1 and 169.3 are both open and dispatchable.
Read the `N. [ ]` checkboxes, not this line. Noted 2026-08-28, Slice 170.1.)*

That is structural, not a lull: from here the dispatcher can only reach
Standardize, Objective and Explore — all of which generate work *about the
project*. It will keep producing self-referential improvement indefinitely and
look healthy doing it, because each piece of that work is genuinely good. The
Objective charter is a **filter, not a direction**: simplicity / less-for-more /
reusability say what to refuse, never what to build. Choosing a direction is
structurally an owner call, not something a loop can derive.

1. [x] **OWNER CALL — 0.2.0 release. ANSWERED 2026-08-21: owner triggered the
       publish, and it was cut as 0.3.0, not 0.2.0.** The tarball built at HEAD
       was labelled 0.2.0 but carried 304 commits of post-tag work (tabs,
       anchor-nav, context-menu, sticky-cols), so that number would have
       permanently described contents it did not have. 0.2.0 stays an accurate
       record of what was cut on 2026-08-18, annotated "tagged, never
       published"; the registry goes 0.1.1 → 0.3.0 and consumers get both
       sections' 83 entries, which the CHANGELOG now says outright. Tagged
       `v0.3.0` at `24c6e7d`, every gate green at 0.3.0. **Still not on the
       registry** — publishing runs through Trusted Publishing (OIDC), so it
       needs the owner to push the tag and publish a GitHub Release; tracked in
       `RESUME.md`, not here.

       Original text, kept for the record: **64 unreleased CHANGELOG entries**
       against a published **0.1.1** (`npm view` confirms). Slices 24-28 —
       query tokens, staging, mass change, four placeholder-only accessible
       names, the 1.46:1 search contrast, icons vanishing in print, the
       nav-label spill — are shipped, gated, and in nobody's `node_modules`.
       `npm install @busy-office/ui` today still gets the accessibility defects
       fixed two days ago. This is the previous grill's F5 one level up: the
       stale *site* was fixed, the stale *package* was not. Publishing is
       owner-triggered by policy; the work itself is done.

2. [x] **OWNER CALL — DECIDED 2026-08-26: (a) adoption/DX.** See Slice 147. Original text kept below.

2b. [x] **OWNER CALL — direction. REALIGNED 2026-08-24: the release blocker is
       GONE; this waits on a decision only.** It said the release "is cut as
       0.3.0 and awaits only the owner's push". **0.5.0 is published on npm** —
       checked, not assumed. The precondition was not merely met, it has been
       overtaken twice, and the recommended default below still says "ship
       0.2.0 first", which shipped long ago.

       Nothing structural blocks this any more. What remains is the choice,
       which was always an owner call: pick (a), (b), (c) or (d) below, or say
       "keep waiting for adopter feedback" and mean it as a decision rather
       than as a precondition.

       Recommended default (kept for its reasoning, though its ship-first
       clause is spent): **choose from real adopter feedback rather than from
       this room** —
       the cost being that feedback takes time, against the alternative risk of
       building the next twelve components for nobody. Candidates if the owner
       prefers to choose now: (a) adoption/DX — starter template, copy-paste
       screen kit, migration note; (b) depth on data maintenance — M2
       master-detail and M4 Excel round-trip are only partly done; (c) the
       autosave decision below, the one genuine product question already in the
       plan; (d) define 1.0 and close the gap to it.

**RETIRED — F1 (verification-to-product ratio).** The previous grill deferred it
with the trigger "revisit if the next window pushes past ~30:1". It fired:
framework CSS grew **+25 lines across 45 commits, and zero in two of three
15-commit windows**, so the denominator is zero and the ratio is meaningless.
The honest conclusion is that the **metric was wrong**, not that things are 30x
worse — zero CSS growth is the charter working, and a ratio that reads "added no
CSS" as failure would push toward adding CSS for its own sake. What it was
gesturing at is captured properly by the two owner calls above. Not to be
re-raised as a new finding.

## Slice 177 — the archive sweep is due a FOURTH time, and the regrowth rate is rising (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 176 — Polish round 2 on `component/scan`: the score that was taken and never written down (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 181 — Owner: a PO-list screenshot, grilled for framework gaps (2026-08-29)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 175 — Objective grill of Slices 169, 170, 172 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 173 — Owner: two demos that do not demonstrate (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 172 — Objective grill of Slices 168, 169, 170 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 174 — Owner: /patterns/command-bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 171 — Owner wishlist: score layout / usability / performance, then recommend (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 170 — Objective grill of Slices 164, 167, 169 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 169 — Standardize sweep: the correction landed in the file that is rewritten every wake (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 168 — Objective grill of Slices 163, 164, 165 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 167 — Objective grill of Slices 161, 162, 166 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 166 — Standardize sweep: a fourth copy of the alias whose home says there is one (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 165 — the archive sweep is due again, and rule 4 is the thing paying for it (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 164 — Objective grill of Slices 158, 159, 160 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 163 — noticed while shipping 159.1: the bucket nobody adjudicated is the one below the bar (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 162 — Two wakes took the same item, and nothing could have stopped them (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 161 — Standardize sweep: the cadence's first run, and a settled count that was wrong (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 160 — triaged while reading 158.1's outlier pages: named products the denylist does not deny (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 159 — Objective grill of Slices 151, 153, 157 (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 158 — Owner wishlist: simplicity is the key; clean up the content (2026-08-28)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 157 — Owner: the dirty row says it twice (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 156 — Owner: a device guide for the shells, with a support matrix (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 155 — Two drift risks in `create-ui`, found by explaining it (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 154 — Triaged from a reference form-layout engine (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 153 — Objective grill of Slices 149, 150, 152 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 152 — Owner wishlist: show every layout as a skeleton template (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 151 — Owner wishlist: learn from a mainstream list product (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 150 — Objective grill of Slices 112, 130-148 (2026-08-27)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 149 — Research: dense numeric UI, and an open-source ERP desk (owner wishlist, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 148 — Triaged from an external framework review (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 147 — Adoption: the framework has no front door (owner decision, 2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 146 — the published site went stale for a week (2026-08-26)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 26 — from the Objective grill (2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 25 — carried forward (2026-08-17 reconciliation)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 24 — triaged from "ROADMAP DIRECTION v1.2" (external review, 2026-08-17)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 15 (in progress — item 12 owner-gated) — conformance artifacts

11. [x] **Generated ACR** (Ines). VPAT-2.5-shaped page: WCAG 2.2 AA criterion
       × component, verdicts Supports / Conditional-on-adopter / Not
       Evaluated, generated from api.json + contrast.json + behaviors.json +
       the guarantees split. Accept: page generated, gated, linked from the
       accessibility concept; Not-Evaluated rows cite the AT gate.
12. [ ] **AT runtime evidence** — NEEDS-RUNTIME (owner hardware): combobox
       activedescendant, data-grid implicit roles, selection live-region on
       VoiceOver + NVDA; results recorded in `.roundtable/` and cited by the
       ACR. **Realigned 2026-08-24: unchanged, and genuinely unblockable by
       the loop** — it needs a human listening to a screen reader, which no
       gate here can simulate. `test:axe` (121 pages x 2 widths) and
       `check:forced-colors` cover what automation can; the residue is
       announcement behaviour, which only ears verify. Stays open rather than
       quietly closed, because the ACR cites it.

## Slice 16 — docs IA, compared against 5 CSS frameworks (user wishlist)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 17 — ERP component gaps, compared against 4 enterprise design systems

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 22 — scale system, rich text, WYSIWYG table (user wishlist, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

## Slice 23 — docs IA & depth (owner review, 2026-08-16)

Closed — archived verbatim in `ROADMAP-archive.md`.

