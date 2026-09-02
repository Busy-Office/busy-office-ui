# Design grill — components batch 1: alert, amount, approval-workflow, avatar, badge, breadcrumb, button (2026-08-31)

First pass of a full component-by-component sweep (39 components total), using
the `design-grill` skill's ten-question framework applied to each component's
docs page as "the screen," per the skill's explicit allowance ("a component
demo"). Measured live against the Podman-served docs container at `:8081`
(`bo-docs-review`), 1440px light + one dark/mobile combo per page, via
`chrome-devtools-mcp`.

## Methodology note (applies to all 7, and to any future batch)

- **`emulate({colorScheme: 'dark'})` does NOT drive this site's theme.** The
  docs shell uses a manual toggle button (`Theme: Light — click for Dark`)
  that sets `data-theme` on `<html>`, not `prefers-color-scheme`. A future
  grill (or the `chrome-devtools-mcp` verify-live workflow CLAUDE.md now
  documents) must click that button, not rely on `emulate`.
- The toggle button's synthetic `.click()` was **unreliable** across
  navigations in this session — it worked once (alert page) and silently
  no-op'd once (amount page), for reasons not root-caused here (possibly a
  non-`click` event listener, or a hydration race right after `navigate_page`).
  Flagging this as a tooling gap rather than a framework defect — nothing
  suggests the real toggle is broken for a human clicking it.
- Every one of the 7 pages resolved on the first slug tried, except `alert` →
  `alerts` (already documented as a known `PAGE_SLUG` alias in
  `extract-api.mjs`, per CLAUDE.md).

## Summary verdict

All 7 pages **pass** — no removals, no rewording forced. Every page already
carries a `<strong>Not for …</strong>` wrong-choice clause (or is correctly in
`wrong-choice-rule.mjs`'s `EXEMPT` map, button's case) and a two-channel state
story where the component has state at all. This batch did not surface a
build-breaking or Objective-violating defect — the docs recipe and the
existing gates (`check:wrong-choice`, contrast, alignment scoring) are visibly
doing their job on this slice of the framework. The value of this pass is
mostly confirmatory, plus the one open question flagged under Amount below.

### ### Alert *(`/components/alerts`)*

**Step 1 — the decision:** a reader needs to know, in one glance, whether
something needs their attention right now (info/success/warning/danger) and
whether it is about a field, a request, or a persistent background event
(toast). The opener states this precisely and draws the line to validation
messages and the validation-summary pattern.

**Step 2 — measured inputs:** 4 inline-alert variants shown together (0
competing primary actions — only the danger variant has a dismiss ✕, which is
a utility control, not a competing CTA). State language: "Heads up.", "Saved.",
"Budget at 92%.", "Posting failed." — meaningful, not mechanism names. Design-
system alignment score on the page: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes — "what happened," severity-coded |
| 2 | Primary action obvious? | N/A (informational, not action-primary) |
| 3 | Anything removable? | No — 4 variants + toast + dismiss cover distinct real cases |
| 4 | Every element has a stated purpose? | Yes |
| 5 | Self-explanatory? | Yes — bold lead phrase names the meaning before the color does |
| 6 | Complexity hidden, not exposed? | Yes — `initAlerts()` is opt-in, degrades to markup-only |
| 7 | Decoration present? | No — the 3px accent is a semantic border, not ornament |
| 8 | Loading/empty/error understandable? | N/A to this component |
| 9 | Context preserved? | Yes — inline alerts don't reflow the page on dismiss, toasts don't float over dialogs |
| 10 | Built from zero today, same shape? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Inline alert (4 variants) | keep | distinct real states, correct roles per arrival-timing rule |
| Toast + `bo-toast-region` | keep | live-region contract is explicit and correctly ordered in the docs |
| Dismiss button | keep | delegated, documented, only on the variant that needs it |
| Wrong-choice clause | keep | precise: names validation-summary and form-field message as the alternatives |

---

### ### Amount *(`/components/amount`)*

**Step 1 — the decision:** does this page make it obvious, in one screenful,
that Amount is *display-only* and which of its siblings (Money, Quantity) to
reach for instead? Yes — the opener's last sentence does this directly.

**Step 2 — measured inputs:** 11 `<h2>` demo sections (the largest opener-to-
section ratio of the 7 pages this batch reviewed) — Money, ISO-code currency,
custom currency, editable-money anti-pattern callout, precision, negative/
credit, dates, block totals, unit of measure, mixed currencies, column
totals. 0 primary actions (display component). Two info boxes stack at the
top: the page's own opener, then a second "The rule for this family" box
repeating the Amount/Money/Quantity split.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 2 | Primary action obvious? | N/A |
| 3 | Anything removable? | Borderline — see open question below |
| 4 | Every element has a stated purpose? | Yes, each section demos a distinct real ERP case (ISO code either side, mixed currencies, credit sign) |
| 5 | Self-explanatory? | Yes |
| 6 | Complexity hidden? | Yes — CSS-only, app supplies formatted parts |
| 7 | Decoration? | No |
| 8 | States understandable? | N/A |
| 9 | Context preserved? | N/A (static display) |
| 10 | Built from zero today? | Yes, modulo the open question |

**Open question, not a verdict:** the "rule for this family" box — is it
identical, word-for-word, on the Money and Quantity pages too? If so, that is
three copies of the same paragraph maintained in three files, which is exactly
the kind of duplication this project's own doctrine (small & general over
specific) argues against for *prose*, not just CSS. Not verified in this
batch — flagging for the next Amount-family-touching wake rather than
asserting it as fact (per this file's own house rule: measure, don't guess).

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 11 demo sections | keep | each demonstrates a distinct, real ERP-specific case, not padding |
| "Rule for this family" box | **check for duplication** across Money/Quantity, dedupe if literal | cost of maintaining prose in 3 places if so |
| Wrong-choice clause | keep | correctly routes to Money/Quantity for entry |

---

### ### Approval-workflow *(`/components/approval-workflow`, titled "Timeline & audit trail")*

**Step 1 — the decision:** who sits here, and what do they need — status of a
request over time (timeline) plus a record of who-said-what (audit trail),
including which comments are internal vs. external and which are settled.
The opener states the two-channel contract (glyphs `aria-hidden`, state via
visually-hidden text + `aria-current`) up front.

**Step 2 — measured inputs:** Timeline states shown: Submitted (done, ✓),
Cost-center approval (current, filled dot), Finance release (rejected, ✕,
red), Archive (pending, "4", greyed) — 4 distinct states, each with icon +
color + text label (three-channel, exceeds the two-channel bar). The
Collaborating section shows `data-visibility="external"` and
`data-state="resolved"` as two independently-meaningful attributes on the
same thread — genuinely composable, not overlapping.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 2 | Primary action obvious? | Yes in the composer demo — one "Send to vendor" button, matches the highlighted-orange external-visibility state |
| 3 | Anything removable? | No — timeline, audit, discussion, and composer are four distinct real needs (status / history / conversation / new entry) |
| 4 | Every element purposeful? | Yes |
| 5 | Self-explanatory? | Yes — "Internal is the default — no attribute, no edge" states the safe default explicitly |
| 6 | Complexity hidden? | Yes |
| 7 | Decoration? | No — the left-edge stripe is stated as geometry-plus-badge, not stripe-alone |
| 8 | States understandable? | Yes |
| 9 | Context preserved? | Yes |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Timeline (4 states) | keep | icon+color+text, exceeds two-channel bar |
| Audit trail + discussion + composer | keep | four distinct, non-overlapping jobs |
| Visibility/resolved badges | keep | explicitly reasoned default ("internal, no attribute") |
| Wrong-choice clause | keep | correctly routes to Stepper for in-progress flows |

---

### ### Avatar *(`/components/avatar`)*

**Step 1 — the decision:** whose is this, at a glance — and does the page
make clear that the disc alone is never sufficient? Yes, forcefully: the
wrong-choice clause is the longest and most specific of the 7 pages,
naming the exact failure ("asks every reader to decode 'JK'").

**Step 2 — measured inputs:** 4 demo sections (initials, photo, approval-
chain stack, in-context assignee column). 0 primary actions (decoration-only
component, correctly `aria-hidden` per the opener).

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 4 | Every element purposeful? | Yes |
| 7 | Decoration? | Yes, by design and explicitly declared as such — not a defect, the component's entire contract |
| 10 | Built from zero today? | Yes |

(Remaining questions N/A or trivially yes — a 4-section decoration primitive
does not have loading/error states or a flow to preserve context across.)

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Initials / Photo / Stack / In-context | keep | each is a distinct real placement, no overlap |
| Wrong-choice clause | keep | names the exact accessibility failure mode, links to byline as the fix |

---

### ### Badge *(`/components/badge`)*

**Step 1 — the decision:** is this a label or a control? The opener's closing
line — "if removing it would change what the screen does, it was never a
badge" — is the sharpest test-sentence of the 7 pages reviewed.

**Step 2 — measured inputs:** 5 tones shown together (Neutral, Approved,
Pending, Rejected, In review) — all visually distinct in dark mode, each
carries its own text label (not color-only). 0 primary actions.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 4 | Every element purposeful? | Yes |
| 5 | Self-explanatory? | Yes, and unusually well — explicit chip vs. button vs. badge disambiguation |
| 7 | Decoration? | No — bare `.bo-badge` is a real state signal, "never color alone" stated outright |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 5 tones | keep | distinct real approval/document states |
| `--type` chip variant | keep | visually distinguished (rectangle vs. pill) from status tones, avoiding confusion |
| Wrong-choice clause | keep | the chip/button disambiguation is the strongest content-dimension example in this batch |

---

### ### Breadcrumb *(`/components/breadcrumb`)*

**Step 1 — the decision:** where does this record sit in the hierarchy, and
can the reader climb it? Opener states the ERP-specific hierarchy example
(cost center → PO → line item) and draws the Stepper distinction.

**Step 2 — measured inputs:** 1 demo (3-level trail). Current page rendered
as plain text, not a link — correct per WAI-ARIA breadcrumb pattern. The page
states its own constraint out loud: "if yours runs past four levels, the
hierarchy is the problem, not the component" — a rare case of a component
page naming a limit on itself rather than only on wrong usage.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 4 | Every element purposeful? | Yes — 3 `<li>`, no filler |
| 5 | Self-explanatory? | Yes |
| 9 | Context preserved? | N/A (single static demo) |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Path trail (3 levels) | keep | minimal, correct landmark + `aria-current="page"` |
| Wrong-choice clause | keep | correctly routes progress-through-a-flow to Stepper |

---

### ### Button *(`/components/button`)*

**Step 1 — the decision:** which action, and how much emphasis does it
deserve? Opener is a single unadorned sentence — no wrong-choice clause — but
this is a **verified, deliberate exemption**: `wrong-choice-rule.mjs` line 26
lists `button` as EXEMPT with the reason *"the action primitive every other
component defers to; there is no 'use X instead of a button'"*. Confirmed by
reading that file directly rather than assuming from the missing clause —
this is exactly the case CLAUDE.md's own doctrine describes (forcing a
sentence where none is true produces filler).

**Step 2 — measured inputs:** 6 variants shown together in the Variants demo
(Primary, Secondary, Ghost, Danger, Reject, icon-only) — this is a component
gallery, not a live screen, so the "one primary action" heuristic does not
apply to the demo region itself; it is stated correctly in prose instead
("`--danger-ghost` sits beside a solid primary without competing with it").
8 sections total (variants, sizes, states, icon/text combos, density
override, row actions, button group, action bar) — each maps to a distinct
real toolbar/table/dialog placement.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 3 | Anything removable? | No — each section is a distinct real placement (row action, button group, action bar) |
| 5 | Self-explanatory? | Yes |
| 7 | Decoration? | No |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 6 variants shown together | keep | gallery context, not a live-screen primary-action violation |
| No wrong-choice clause | keep as-is | verified EXEMPT in `wrong-choice-rule.mjs`, reason is sound |
| `--sm` / density override / row-actions / action-bar sections | keep | each names a distinct real ERP placement (24px WCAG target floor, RF exception row) |

## What this batch did NOT find

No dead detectors, no removable elements, no missing two-channel signal, no
missing wrong-choice clause that wasn't already adjudicated EXEMPT. The one
actionable item is the Amount-family duplication question above, which is
flagged as open rather than asserted.
