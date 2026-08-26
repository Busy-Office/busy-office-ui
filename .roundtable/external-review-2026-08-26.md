# Busy Office UI Framework Review & AI Benchmark Proposal

**Repository:** https://github.com/Busy-Office/busy-office-ui  
**Review Date:** 26 Aug 2026

---

## Executive Summary

Busy Office UI is already a technically strong ERP-oriented UI framework.

The framework is unusually disciplined around:

- semantic HTML;
- CSS-first architecture;
- density-aware design;
- accessibility;
- native browser capabilities;
- generated API contracts;
- machine-readable documentation;
- runtime behavior validation;
- ERP-specific reference screens;
- adversarial design review.

The recommendation is **not to restart the CSS or component architecture**.

If rebuilding from scratch, the largest architectural change should be made **above the component layer**.

The current conceptual hierarchy is approximately:

```text
Tokens
  ↓
Components
  ↓
Patterns
  ↓
Screens
```

A stronger architecture for both humans and AI would be:

```text
Tokens
  ↓
Primitives
  ↓
Components
  ↓
Patterns
  ↓
Screen Contracts
  ↓
Applications
```

For an AI agent, this should be consumed in reverse:

```text
Requirement
  ↓
Screen Contract
  ↓
Pattern
  ↓
Components
  ↓
Markup
```

The key strategic goal should become:

> Given the same ERP requirement to several independent developers or AI agents, can Busy Office guide all of them toward substantially the same correct screen architecture?

That is a much stronger differentiator than merely having a large component library.

---

# 1. Overall Assessment

| Area | Rating | Comment |
|---|---:|---|
| CSS architecture | **9/10** | Strong semantic/cascade/token strategy |
| ERP suitability | **9/10** | Density and transactional patterns are real strengths |
| Accessibility engineering | **9.5/10** | Much stronger than most small frameworks |
| Runtime architecture | **9/10** | CSS-first, dependency-free core, delegated JS |
| Component API discipline | **9/10** | Generated manifests and checks are excellent |
| Documentation correctness | **9/10** | Strong anti-drift model |
| AI consumability | **8/10** | `llms.txt` is excellent, but decision layer remains incomplete |
| AI reproducibility | **Not yet measured** | This should become the next major benchmark |
| Onboarding / DX | **7.5/10** | Improving; runnable starter remains important |
| Maintainability | **7/10** | Risk of excessive internal process machinery |
| Overall | **~8.7/10** | Strong foundation; next gains require a different direction |

---

# 2. What Busy Office UI Already Gets Right

## 2.1 CSS-first architecture

The framework's core philosophy is appropriate for ERP software:

- semantic component naming;
- native HTML elements first;
- CSS cascade as a supported extension mechanism;
- minimal optional JavaScript;
- modern CSS features;
- density as a first-class system;
- logical properties and RTL discipline;
- print support;
- reduced-motion handling;
- explicit browser floor.

This is a sound technical foundation.

---

## 2.2 Semantic state model

Using ARIA and `data-*` attributes rather than inventing parallel state classes is a good decision.

For example:

```html
<tr data-row-state="dirty">
```

is better than creating multiple overlapping class systems such as:

```html
<tr class="is-dirty status-warning row-edited">
```

The current approach improves:

- consistency;
- accessibility;
- machine-readability;
- framework validation;
- AI correctness.

---

## 2.3 Strong machine-readable surface

Busy Office already exposes much more than CSS.

The package includes generated artifacts for areas such as:

```text
api.json
behaviors.json
events.json
keymap.json
contrast.json
acr.json
floor.json
```

This is extremely useful for coding agents.

Most UI frameworks give AI only documentation prose.

Busy Office is moving toward an actual machine contract.

---

# 3. `llms.txt` Is One of the Strongest Parts of the Project

The generated `llms.txt` is a particularly good direction.

It provides AI agents with:

- real component classes;
- supported data attributes;
- allowed data attribute values;
- behavior hooks;
- semantic tokens;
- browser floor;
- pattern catalogue;
- wrong-choice guidance;
- deliberately absent features.

This is important because AI needs two types of knowledge.

## Positive knowledge

```text
These components exist.
These attributes are supported.
These patterns are available.
```

## Negative knowledge

```text
Do not build this.
It was deliberately rejected.
Use this alternative instead.
```

Negative knowledge is a major defense against AI hallucination and design slop.

---

# 4. The Main Architectural Weakness

The component layer is still too close to the top of the decision process.

Today an AI can still reason like this:

> I need an invoice screen. Which components look useful?

That encourages generic composition.

Instead, the framework should force the agent to reason:

> What job is the user performing?

That produces much more deterministic ERP design.

---

# 5. Introduce a Screen Contract Layer

Consider the following requirement:

> A Finance clerk reviews 200–500 supplier invoices every morning, clears correctly matched invoices in batches, investigates exceptions individually, and occasionally exports the filtered result.

The AI should **not** immediately choose cards, filters, tables, badges, and buttons.

It should first derive something like:

```yaml
screen:
  job: work_queue
  entity: vendor_invoice

  cardinality:
    typical: 300
    maximum: 5000

  primary_user: finance_clerk

  dominant_action:
    type: batch
    action: clear

  secondary_actions:
    - inspect
    - filter
    - export

  editing:
    mode: none

  selection:
    required: true
    multi: true

  navigation:
    row_to_detail: true

  density:
    preferred: compact

  status:
    important: true
    vocabulary:
      - matched
      - exception
      - blocked

  information_priority:
    must_show:
      - vendor
      - invoice_number
      - invoice_date
      - amount
      - currency
      - match_status

  pattern:
    family: work-list
```

The framework can then resolve:

```text
work-list
  ↓
filter bar
  ↓
dense data table
  ↓
multi-selection
  ↓
bulk action toolbar
  ↓
paging/windowing
  ↓
row-to-detail navigation
```

Only then should markup generation begin.

---

# 6. The Framework Is Already Pointing Toward This

The repository already contains a planned pattern-fit experiment.

The design is conceptually strong:

```text
owner-written ERP brief
        ↓
fresh independent agent
        ↓
brief + llms.txt only
        ↓
agent chooses pattern
        ↓
compare to sealed owner choice
        ↓
rerun failures to measure variance
```

This is the right experiment.

The framework should not assume that a Screen Contract layer is necessary.

It should **measure whether pattern selection is currently reproducible first**.

If independent agents already converge reliably, keep the architecture simpler.

If they do not, Screen Contracts become justified by evidence.

---

# 7. Major Risk: Internal Process Complexity

Busy Office has developed a very sophisticated internal engineering process.

The repo contains concepts such as:

- ROADMAP;
- ROADMAP archive;
- STATUS;
- LOOPS;
- SQLite mirrors;
- roundtable reviews;
- generated indexes;
- autonomous work modes;
- component scoring;
- screen scoring;
- pattern scoring;
- wrong-choice checks;
- runtime claim gates;
- browser compatibility gates;
- layout checks;
- accessibility checks;
- derived documentation;
- reconciliation checks.

This discipline is valuable.

However, the danger is:

> The project may optimize the framework-development process more than the framework-user experience.

The external developer or AI agent should not need to understand any of this machinery.

The external workflow should be closer to:

```text
1. Read framework manifest.
2. Read screen-pattern catalogue.
3. Create screen contract.
4. Generate markup.
5. Run Busy Office validators.
6. Fix violations.
```

Everything else should remain internal.

---

# 8. Concrete Current Architecture Issue

During review, the latest `main` branch CI had a container-build failure.

The important browser and framework validation shards were passing, but the docs container failed because the new screen-kit generator imported:

```text
examples/erp-suite/_shell.mjs
```

while the docs Containerfile did not copy the ERP suite into the image.

The simple fix would be to add `examples/` to the container build context.

However, the better architectural fix is to remove this direct dependency.

Avoid:

```text
docs
  ↓
ERP example implementation internals
```

Prefer:

```text
ERP suite
  ↓
generated suite-manifest.json
  ↓
docs
```

Example:

```json
{
  "screens": [
    {
      "id": "p2p.purchase-orders",
      "kind": "work-list",
      "module": "p2p",
      "path": "p2p/purchase-orders",
      "fragment": "..."
    }
  ]
}
```

Then:

- docs consume the manifest;
- benchmark tooling consumes the manifest;
- the suite remains independent;
- build coupling is reduced.

---

# 9. The ERP Suite Is One of the Best Assets

The ERP suite has a strong rule:

> It may not add private CSS to make a screen look better.

That turns the suite into a gap-finding instrument rather than a showcase.

This is exactly the right philosophy.

The suite should evolve into three things at once.

## 9.1 Reference application

For humans learning the framework.

## 9.2 Framework conformance suite

To identify missing capabilities.

## 9.3 AI benchmark corpus

To evaluate independent coding agents.

The third use could become especially important.

---

# 10. Prevent AI Slop Structurally, Not With Better Prompts

Avoid relying on prompts such as:

```text
Be professional.
Avoid too many cards.
Use good hierarchy.
Do not overuse gradients.
Use subtle shadows.
```

These may improve outputs, but they are not deterministic.

Instead:

> Make common slop structurally invalid or at least machine-detectable.

Busy Office already does this at the component API level.

The same concept should move to the screen architecture level.

---

# 11. Build `bo-check-screen`

The project already has markup validation.

Add a higher-level validator:

```bash
bo-check-screen screen.html --contract screen.yaml
```

The distinction:

## `bo-check-markup`

Answers:

> Did the developer use Busy Office API correctly?

## `bo-check-screen`

Answers:

> Did the developer choose the correct Busy Office solution?

Example output:

```text
BO-SCREEN-012  ERROR
Work-list contract declares multi-selection=true,
but screen contains no selection mechanism.

BO-SCREEN-018  ERROR
Contract cardinality.maximum=5000 but no pagination,
windowing, or server-driven load strategy is declared.

BO-PATTERN-007 WARNING
Screen contract indicates independent record maintenance.
Detected a whole-table editable grid.
Preferred: row-swap editing.

BO-DESIGN-021 WARNING
Five separate status surfaces describe the same state.
Expected one primary status signal.

BO-DESIGN-033 WARNING
Three nested raised surfaces detected with no distinct semantic regions.

BO-ACTION-004 ERROR
Contract names "Approve" as the dominant action,
but the action appears only inside an overflow menu.
```

The design philosophy then moves from documentation into executable rules.

---

# 12. Define AI Slop Precisely

Avoid treating AI slop as purely visual taste.

A useful taxonomy is:

| Category | Example |
|---|---|
| **Invention** | Nonexistent `bo-*` classes, attributes, or states |
| **Pattern drift** | Dashboard used for a transactional work queue |
| **Structural noise** | Unnecessary wrappers, cards, and nested surfaces |
| **Action dilution** | Too many equal-priority CTAs |
| **Semantic weakness** | Decorative status without operational meaning |

These are measurable.

---

# 13. Use Structural Metrics as Tripwires, Not Design Truth

Avoid simplistic rules such as:

```text
Maximum 4 cards.
Maximum 150 DOM nodes.
```

A structurally rich purchase-order page may legitimately need more markup than a flat invoice list.

Therefore:

```text
DOM nodes
card count
surface count
wrapper depth
```

should generally be **tripwires**.

They should trigger inspection rather than automatically declare the design wrong.

---

# 14. Add a Design Entropy Report

For AI-generated screens, measure:

```text
invented API count
custom CSS declarations
unique spacing values
unique radius values
unique shadow values
nested surface depth
button variant count
status representation count
unexplained icon-only actions
component substitutions
screen-contract violations
```

A strong Busy Office-generated screen should often achieve:

```text
custom CSS                 0
invented bo-*              0
invented data-* values     0
arbitrary spacing          0
arbitrary colors           0
contract errors            0
```

This is more useful than an AI evaluator saying:

```text
Looks professional: 8.7/10.
```

---

# 15. Constrain AI-Written CSS Aggressively

For ERP applications built with Busy Office, default AI permissions should be:

```text
AI may:
✓ compose Busy Office components
✓ use documented variants
✓ remap semantic brand tokens
✓ add application layout only where no framework pattern exists
```

The AI should normally not be allowed to:

```text
✗ invent component colors
✗ invent shadows
✗ invent radii
✗ style framework internals
✗ recreate existing Busy Office components
✗ use arbitrary inline styles
✗ add another utility framework for convenience
```

If an exception is required:

```css
/* bo-exception:
   reason="warehouse visualization unavailable in framework"
   issue="BO-284"
*/
```

Now deviations become measurable engineering data.

---

# 16. Keep a Single Main Public Package

If rebuilding from scratch, avoid splitting the framework into too many packages such as:

```text
@busy-office/tokens
@busy-office/components
@busy-office/patterns
@busy-office/forms
@busy-office/erp
@busy-office/ai
```

That may look architecturally elegant but increases adoption complexity.

Prefer:

```text
@busy-office/ui
```

with clear exports:

```text
@busy-office/ui/css
@busy-office/ui/js

@busy-office/ui/manifest/components
@busy-office/ui/manifest/patterns
@busy-office/ui/manifest/screens

@busy-office/ui/check
```

Benefits:

- one install;
- one version;
- one vocabulary;
- easier human onboarding;
- easier AI consumption.

---

# 17. Use Two Different Sources of Truth

The current design derives much of the framework API from the actual CSS.

That is excellent for preventing documentation drift.

Keep CSS as authoritative for:

```text
classes
selectors
attributes
supported values
visual API
```

However, CSS cannot derive semantic design knowledge such as:

> Use this pattern for 500 independently maintainable records but not for a single accounting document with 300 lines.

That knowledge should exist in explicit pattern contracts.

Recommended model:

```text
CSS
  ↓
generated component API
```

and:

```text
pattern contracts
  ↓
intent
  ↓
cardinality
  ↓
required behavior
  ↓
wrong-choice rules
  ↓
performance expectations
```

Then validate the two against each other.

---

# 18. Current Performance Assessment

Observed framework characteristics are already strong.

Approximate current values:

| Measurement | Observed result |
|---|---:|
| Full CSS source | ~263 KB |
| Full CSS minified | ~89.6 KB |
| Full CSS gzip | ~14.7 KB |
| Components indexed | ~40 |
| CSS classes indexed | ~281 |
| JS exports | ~32 |
| `init*` behaviors | ~26 |
| Behavior tests | ~129 |
| Behavior test runtime | ~1 second |
| Core build | several seconds on CI |
| RF essentials minified | ~36.9 KB |

For an ERP application, the CSS transfer size is already small enough.

Future optimization effort should focus less on reducing another few kilobytes and more on runtime behavior and development scalability.

---

# 19. Runtime Scalability Benchmark

Recommended benchmark levels:

## 100 rows

Expected to be trivial with a normal table.

Measure:

```text
render time
interaction latency
memory
```

## 1,000 rows

Test with:

- selection;
- sorting;
- filters;
- sticky columns;
- dropdowns;
- bulk actions.

Measure:

```text
interaction latency
select-all latency
layout cost
style recalculation
memory
DOM count
```

## 10,000 rows

This should probably cross an explicit framework boundary.

The correct design may be:

```text
Do not render 10,000 ordinary DOM rows.
Use windowing or server-side paging.
```

Create an explicit performance contract, for example:

```yaml
performance:
  normal_dom_rows: <= 500
  caution: 501..2000
  requires_windowing_or_paging: > 2000
```

The actual thresholds should be derived from benchmark data rather than guessed.

---

# 20. CI Scalability Is Becoming More Important

The project has already improved CI wall-clock through browser-test sharding.

That is good.

However, the documentation build command now runs a very large chain of generators and validators.

Long-term, prefer a dependency graph:

```text
core artifact
      ↓
manifest generation
      ↓
┌──────────────┬──────────────┬──────────────┐
docs           suite          package
│              │              │
browser        contract       publish
tests          tests          tests
```

This is easier to reason about than making the documentation build implicitly responsible for large parts of repository validation.

---

# 21. Split the Large Behavior Test File

The current behavior tests are strong, but placing all behavior tests in one very large file weakens locality.

Prefer:

```text
tests/
  combobox.test.ts
  data-table.test.ts
  dialog.test.ts
  dropdown.test.ts
  row-edit.test.ts
  tabs.test.ts
  windowed-list.test.ts
```

Benefits:

- easier maintenance;
- easier AI reasoning;
- clearer ownership;
- faster local debugging;
- less context required for code agents.

---

# 22. Build a Runnable Starter Before Adding Many More Components

A starter should become a top priority.

Target experience:

```bash
npm create busy-office my-erp
cd my-erp
npm run dev
```

Possible questions:

```text
Application type:
❯ ERP / back office
  RF / handheld

Interaction:
❯ server-rendered / HTMX
  vanilla JS
```

Generated structure:

```text
src/
  screens/
  screen-contracts/
  app.css

busy-office.config.json
```

And:

```bash
npm run bo:check
```

An AI agent should be able to generate a correct first screen after reading a small manifest rather than the whole repository.

---

# 23. Multi-Agent Benchmark

A valid benchmark requires genuinely independent agent sessions.

The correct experimental setup is stronger than simply asking the same model to “pretend” to be several agents.

Use:

```text
same repository commit
same task
fresh conversation/session
no previous screen history
same allowed tools
same time/tool budget
```

Test several models or agent systems independently.

For example:

```text
Agent A
Agent B
Agent C
```

The exact vendors or models can change over time.

The important property is independence.

---

# 24. Benchmark Information Arms

Use the same briefs under different information conditions.

| Arm | Context supplied |
|---|---|
| **A** | README only |
| **B** | `llms.txt` |
| **C** | `llms.txt` + Screen Contract layer |

This measures whether the additional machine-readable design knowledge actually improves outcomes.

---

# 25. Do Not Define “Same Result” as Pixel Identity

Independent good developers should not produce identical HTML.

The meaningful question is whether they converge on the same design decisions.

Use four levels.

## L1 — Screen Contract Agreement

Do agents identify the same job?

Examples:

```text
work queue
record detail
reconciliation
maintenance
approval
wizard
dashboard
```

This is the most important measure.

---

## L2 — Pattern Agreement

Did agents select the same Busy Office pattern family?

---

## L3 — Component Agreement

Use Jaccard similarity:

```text
J(A,B) = |A ∩ B| / |A ∪ B|
```

Example:

```text
Agent A:
filters table pagination bulk-toolbar badge

Agent B:
filters table pagination bulk-toolbar
```

Similarity:

```text
4 / 5 = 0.80
```

---

## L4 — Structural / Visual Agreement

Compare:

```text
DOM structure
landmark structure
action placement
screenshot similarity
```

This should be secondary to semantic agreement.

---

# 26. Benchmark Scorecard

For every generated screen or application, measure:

| Metric | Meaning |
|---|---|
| **Pattern accuracy** | Agreement with sealed owner solution |
| **Pattern convergence** | Agreement among independent agents |
| **Markup validity** | Pass rate of Busy Office markup checks |
| **Screen-contract score** | Pass rate of higher-level design checks |
| **Accessibility** | axe and Busy Office semantic obligations |
| **Invented API count** | Hallucinated classes, states, attributes |
| **Custom CSS bytes** | Amount of AI improvisation |
| **Wrong-choice count** | Known anti-patterns selected |
| **Task completion** | Whether the user workflow is represented |
| **DOM nodes** | Structural/rendering cost |
| **CSS / JS bytes** | Application delivery cost |
| **Generation wall time** | Agent speed |
| **Tool calls** | Agent effort |
| **Input tokens** | Context efficiency |
| **Repair iterations** | Number of correction cycles |
| **Variance** | Fresh-run consistency |

---

# 27. First-Pass Conformance and Repair Distance

These may become the most useful metrics.

Example:

## Agent A

```text
Initial generation
0 invalid classes
1 pattern warning
1 correction
DONE
```

## Agent B

```text
Initial generation
7 invented classes
3 accessibility errors
wrong screen pattern
4 repair cycles
DONE
```

Both eventually succeed.

But the framework experience is very different.

Track:

## First-Pass Conformance

How correct is the first generated screen?

## Repair Distance

How much change is needed before the screen becomes conformant?

These metrics directly measure framework usability for AI.

---

# 28. Run a Deliberate AI Slop Challenge

Use ambiguous prompts that normally tempt AI into generic SaaS UI.

Example:

> Build an AP dashboard where accountants manage invoices.

Generic AI output often includes:

- four KPI cards;
- large charts;
- colorful status tiles;
- many rounded containers;
- large empty spacing;
- multiple equal-priority actions;
- dashboard structure despite the actual job being operational processing.

A strong Busy Office agent should instead determine:

> This is primarily an operational invoice work queue, not a dashboard.

Then choose:

```text
work-list
  ↓
filters
  ↓
dense table
  ↓
bulk actions
  ↓
exception drill-down
```

If several independent agents reliably reach this conclusion, Busy Office has achieved something significant.

---

# 29. Proposed Architecture From Scratch

```text
                    ┌───────────────────────┐
User Requirement ──▶│   Screen Contract     │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Pattern Resolver      │
                    │ list / detail /       │
                    │ maintain / approve... │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │ Components            │
                    └───────────┬───────────┘
                                │
               ┌────────────────┴───────────────┐
               ▼                                ▼
       Semantic HTML/CSS                 Optional Behaviors
               │                                │
               └────────────────┬───────────────┘
                                ▼
                    ┌───────────────────────┐
                    │ bo-check-screen       │
                    │ bo-check-markup       │
                    │ axe / runtime checks  │
                    └───────────────────────┘
```

Underneath:

```text
tokens
semantic palette
density
motion
RTL
print
forced colors
```

Busy Office already has much of the lower architecture.

The next competitive advantage is the decision layer above it.

---

# 30. Recommended Priority Order

## P0 — Restore green `main`

Fix the current container-build regression.

Prefer removing direct docs-to-example implementation coupling rather than merely expanding the Containerfile.

---

## P1 — Complete the independent-agent pattern-fit pilot

Do not build Screen Contracts solely from intuition.

Measure whether they are needed.

---

## P2 — Build the runnable starter

Make first-screen adoption extremely easy for humans and AI agents.

---

## P3 — Introduce Screen Contract v0.1 if variance justifies it

Keep the first version lightweight.

Avoid building a huge DSL.

---

## P4 — Build `bo-check-screen`

Move design rules from prose into executable checks.

---

## P5 — Make the ERP suite the permanent AI benchmark corpus

Use the existing real screens rather than synthetic demos.

---

## P6 — Publish benchmark results

Produce something like:

```text
agent-benchmark.json
```

with:

```json
{
  "framework_version": "0.x",
  "agent": "...",
  "pattern_accuracy": 0.92,
  "first_pass_conformance": 0.84,
  "repair_distance": 1.3,
  "invented_api_rate": 0.01,
  "a11y_pass_rate": 1.0
}
```

---

## P7 — Slow component expansion

Only add components when real ERP screens prove that the framework is missing something.

---

# 31. Strategic Positioning

Current positioning:

> CSS-first UI framework for ERP and back-office applications.

Potential future positioning:

> **A deterministic UI system for ERP applications, designed for both humans and AI agents.**

Or:

> **An ERP interface grammar that turns business requirements into consistent, accessible application screens.**

The strongest long-term differentiator is not another visual component.

It is:

> Give Claude, GPT, Gemini, Codex, or a junior developer the same ERP requirement, and Busy Office constrains all of them toward substantially the same correct screen architecture.

That can be objectively benchmarked.

---

# Final Recommendation

**Do not restart Busy Office UI.**

The project has already accumulated a valuable set of design decisions, constraints, validators, and ERP-specific lessons.

A full rewrite would likely produce:

- cleaner source organization;
- fewer historical comments;
- a simpler CI pipeline;
- less internal process baggage.

However, it would also discard a large amount of hard-earned engineering knowledge.

Instead:

```text
Keep:
  CSS architecture
  semantic components
  density system
  accessibility discipline
  generated API
  behavior contracts
  llms.txt
  ERP suite
  adversarial validation

Improve:
  screen decision architecture
  AI reproducibility
  pattern selection
  runnable onboarding
  benchmark instrumentation
  CI dependency boundaries
```

The next evolution of Busy Office should be less about:

> How many components do we have?

and more about:

> How reliably can the framework turn an ERP job into the right screen?

If Busy Office can demonstrate high pattern convergence, low repair distance, zero invented API usage, and strong accessibility across multiple independent AI agents, it becomes more than a UI framework.

It becomes an **AI-compatible ERP design system with measurable output quality**.
