# Grill — examples as experiments across desktop, mobile and RF

Owner clarification, 2026-09-20: detailed examples exist to experiment, identify what belongs in the ERP UI framework, and avoid overbuilding; consider desktop, mobile and RF scanner variation.

## Verdict

Accept the purpose. Depth belongs in representative tasks and their difficult states. Breadth is justified when a different task, interaction or operating constraint could expose a new failure. A second business-domain label or a screenshot at another width is not an independent use case.

This extends the existing examples strategy; it does not launch three application products or three component families.

## Existing evidence and limits

- `examples/erp-suite/README.md` describes the suite as a gap-finding instrument with no local CSS. Its scope is static UI and cross-module links, not working business transactions. Its “What is here” paragraph is out of date: the source now contains 28 `.screen.mjs` files across six module directories and the index. Do not use that paragraph as the coverage inventory.
- `.roundtable/grill-erp-suite-instrument-2026-08-24.md` classified the historical first 17 findings as nine triggered by new structures, four by stress, and four implementation/documentation issues. No finding in that historical sample was attributed to domain alone. This supports a hypothesis for choosing experiments; it does not prove future domains can never expose a new requirement.
- `apps/docs/src/data/pattern-groups.mjs` already groups patterns by jobs and keeps RF as a separate usage track. `concepts/layouts` already distinguishes shell suitability from viewport size.
- The RF coverage and pattern-family reviews established composition first, a reduced CSS profile, keyboard-wedge input, and application-owned scanner integration and persistence. Their old bundle/component counts are historical; use current build output for budgets.
- Browser emulation can verify layout and simulated input. It cannot establish real trigger behavior, scan timing, glove use, rugged-device browser support, or warehouse network reliability. Record the device/engine actually exercised and leave physical-device evidence pending until obtained.

## Challenge the proposal

| Temptation | Problem | Decision |
| --- | --- | --- |
| Build every module on every device | Multiplies maintenance without identifying a new question | Choose representative jobs and add only the changed constraint or missing state. |
| Treat mobile as narrow desktop | Hides touch, soft-keyboard, interruption and information-priority problems | Reuse primitives while testing task-appropriate composition and input. Density follows the task, not a device-name rule. |
| Treat RF as ordinary mobile | A scan loop and exception recovery are not a miniature admin screen | Use a focused task track with explicit scan/confirm/error/next behavior; validate actual hardware separately. |
| No local CSS means every compromise belongs in core | The instrument can manufacture demand for a domain-specific abstraction | Preserve the suite's conformance rule, but compare a candidate against a separate temporary composition spike before promoting it. Example failure is evidence to investigate, not an automatic framework admission. |
| Every experiment must yield a new component | Rewards expansion and makes refusal look like failure | “Existing components suffice,” a docs correction, and a reproduced bug fix are useful outcomes. |
| Add enough switches to cover all variants | Transfers complexity to application authors and agents | Prefer tokens/layout composition, then one reusable contract; a long list of options is a reason to rethink. |
| A linked set of screens proves end-to-end behavior | Static fixtures cannot prove persistence, authorization or recovery | Separate static composition evidence, fixture-driven interaction evidence and real backend/device evidence. |

## Device variation to test

| Dimension | Desktop ERP work | Mobile task work | RF scan work |
| --- | --- | --- | --- |
| Representative decision | Find, compare, edit or clear a queue | Inspect one item and act; resume after interruption | Verify the scanned thing and complete the next step |
| Input to exercise | Keyboard and pointer; table navigation | Touch and soft keyboard; preserve keyboard access too | Wedge input/trigger sequence and confirm controls; manual-entry recovery |
| Composition | Dense list/detail or grid; persistent navigation when useful | Prioritized fields, progressive detail, reachable primary action | One focused task with essential context, scan field, result and exception action |
| Stress | Many rows/columns, long labels, selection, sticky regions | Narrow width, zoom, keyboard occlusion, long text, interrupted edit | Rapid/repeated input, unexpected code, short quantity, focus loss, lost connectivity |
| Navigation hypothesis | Dock accelerates repeated movement between apps | A short dock may help only when app switching is part of the task | Frequent global switching may distract; task menu/back path may be enough |
| Counter hypothesis | Per-app pending work helps prioritize | Show only meaningful counts that remain readable | Task/queue context may be useful; don't copy the entire enterprise dock |
| Reuse boundary | Shared semantic components and behavior contracts | Same component APIs; different composition only where task evidence warrants it | Existing RF profile and shared suitable primitives; hardware/services remain app-owned |

These are hypotheses to test, not findings that every listed variation is necessary. Do not add a mobile/RF modifier just because a profile has a column in this table.

## Smallest useful next experiment

Use one fixture-backed procurement/receiving journey, drawing from existing examples:

1. Desktop: locate and inspect a purchase order, then move to the related task queue. Compare the existing switcher with the proposed dock for identical destinations.
2. Mobile: inspect an approval request, make a decision, handle a validation/conflict fixture, and return to the queue with selection/context preserved.
3. RF: receive against the relevant order using scan → validation → quantity/exception → confirmation → next. Exercise an invalid scan and a repeated submission response; the fixture represents the server's response, not framework-owned deduplication or stock posting.

Share representative identifiers and fixtures where a cross-role handoff matters. Each device gets the part of the journey appropriate to its user, rather than three copies of every screen. If the existing examples cannot express a shared handoff, record that limitation before adding a backend.

Start with the existing screens and a normal path plus the named high-risk failures. Expand combinations only when they answer another question. No full Cartesian product of every module × device × density × theme × state is required. Both themes and the existing accessibility/layout gates remain acceptance checks for changed surfaces.

For each experiment, record the user task, changed constraint, predicted failure, current composition, observed result and disposition in the existing gap ledger. Preserve source/revision and reproducible evidence. Test the cheapest existing composition before designing an API.

## Decide what enters the framework

1. **Already composes:** improve the example or discovery guidance; add no core API.
2. **Correctness defect:** repair the current contract and add the appropriate regression evidence. A real defect does not need a second consumer before it can be fixed.
3. **Repeated composition difficulty:** try the shared primitive in at least two independent compositions; a desktop/mobile rendering of the same example counts once. Promote only when it reduces consumer code or decisions and passes the existing quality/budget bar.
4. **Domain/device policy:** leave it with the application, with a clear integration recipe where useful. Pending-count calculations, authorization, offline queues and scanner configuration are examples.
5. **No new evidence:** close the experiment or park the hypothesis. Do not build another renamed module to keep the experiment going.

An experiment stops when its question is answered. Keep the smallest reproduction as verification when useful. A polished production ERP, a universal mobile shell and a framework scanner SDK are not required outcomes.

## Graph and AI-agent use

Trace a demonstrated user task through its journey, pattern, components, source and verification. Attach the device/input constraint and observed failure to that existing evidence path; mark proposed edges as hypotheses rather than delivered capability. Derive inventories from source/manifests, not a second hand-authored capability catalogue.

Examples should give an agent a canonical working composition, its state/data boundary, when to choose another pattern, and how to verify it. They should not teach the agent to select a different component API for each device. The owner-authored sealed pattern-fit pilot remains separate: these design fixtures cannot substitute for its briefs or count as independent selection evidence.

## Outcome of this review

The strategy is accepted as an experiment plan. No new device-specific component or example application is added by this review. The dock spike remains a concrete test of navigation usefulness across contexts, rather than an assumed requirement for all devices. Physical-device tests and the proposed fixture journey remain pending.

## Implementation checkpoint — owner accepted, September 20

The owner replied “As you proposed”. The fixture journey is now implemented
locally in `examples/erp-suite/journey/` and linked from suite home and the docs
Screen kit. This supersedes the pending journey status above; the physical-device
and human task-time studies remain pending. Base revision: `6b72a778`, with local
uncommitted edits; no publication or release.

- **Delivered:** one order through desktop inspection, mobile approval and RF
  receiving. Same-tab note/search persistence; required-note validation; conflict
  review whose updated delivery instruction reaches receiving; invalid-scan and
  quantity recovery; partial receipt; loss-before-send retry; replay of a previous
  receipt without adding units; completion returns focus and clears the queue.
- **Navigation:** dock and switcher expose identical destinations/count meanings.
  Counts derive from the same sample predicates as the queues, with distinct
  loading/unavailable labels. Mobile/RF retain a task return link. This proves
  composition, not enterprise scale, user speed or 373.6's full acceptance.
- **Framework admission:** none. No core CSS/JS source changed. GAP-22 records the
  native-validation click-target movement; application validation resolves the
  example, while generic native-validation guidance/layout remains for review.
- **Verification:** `npm run docs:build`, `npm run suite:check`, `npm run
  suite:audit`, and `check-journey.mjs` both standalone and with `--docs` pass.
  The suite has 31 screens; its audit covers 1440/390, axe and child clipping.
  Each journey run checks 12 screen/width/theme combinations, RF-only CSS,
  short-viewport focus reachability and disabled actions without JavaScript.
  The existing docs layout gate passes 128 pages at narrow width, 150% zoom
  and WCAG text spacing. Slice references and whitespace checks pass.
  Environment: local macOS, Node v26.8.1, Google Chrome 153.0.8010.53 via the
  repository's browser harness; no RF hardware or mobile browser was exercised.
- **Evidence:** `/private/tmp/boui-journey-evidence/` and
  `/private/tmp/boui-journey-docs-evidence/` contain rendered screenshots.
  `/private/tmp/boui-native-quantity-probe.log` captures the original 40px
  pointer-target shift and zero/one submit-event counts. The durable journey
  check first failed on that interaction before the example was corrected.
  The theme check was also corrected to wait for color transitions before
  measuring contrast; an intermediate color pair is not a settled-theme result.
- **Size boundary:** three emitted JS files total 14,222 uncompressed bytes
  (`wc -c examples/erp-suite/dist/journey/*.js`), including the existing scan
  behavior and comments. No runtime dependency was added. This is an artifact
  size measurement, not a latency or scalability benchmark.
- **Remaining evidence:** physical scanner timing/terminators, gloves, actual
  mobile keyboard/interruption, backend authorization/idempotency and human
  dock comparison. Claude's independent review completed on 2026-09-21 with no blocking findings;
  it executed suite:build and check-journey.mjs. The durable report is
  `exchange/from-claude/boui-journey-review-20260920-01.md`. Codex reconciled
  the findings with current source and accepted the review. Physical-device
  and human task-time studies remain pending.

The source-backed evidence map is in `journey/README.md`. The earlier derived
graph was not re-extracted for these new files; its absence of these nodes is
not evidence of missing capability.
