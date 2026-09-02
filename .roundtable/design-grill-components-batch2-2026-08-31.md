# Design grill — components batch 2: byline, calendar, combobox, dashboard, data-table, date, dialog (2026-08-31)

Second batch of the full component-by-component sweep (39 components total, see
`design-grill-components-batch1-2026-08-31.md` for the first 7 and the
methodology note). Measured live against the Podman-served docs container at
`:8081` (`bo-docs-review`), 1440px light + 390px dark per page, via
`chrome-devtools-mcp`. `emulate({colorScheme})` still does not drive this
site's theme — `document.documentElement.setAttribute('data-theme', …)` via
`evaluate_script` is the reliable way to force it (the manual toggle button
was flaky in batch 1; scripting the attribute directly worked cleanly for all
7 pages here).

## Summary verdict

6 of 7 **pass** outright. **Date** carries one real, reproducible defect in
its deprecation notice's mobile layout (see below) — everything else about
that page (the deprecation handling itself, replacement-first ordering) is a
positive example worth the rest of the framework matching.

### Byline *(`/components/byline`)*

**Step 1 — the decision:** is this an author·role·timestamp line for a
record header, comment, or feed item — and does the page draw the line
against a table cell? Yes, precisely: "Not inside the cells of a sortable
grid," with the reasoning (packing actor+timestamp into one cell buries the
differing value in two repeating ones, and neither sorts).

**Step 2 — measured inputs:** 4 demo sections (Default, `--compact`,
`__avatar`, in-context/approval-comment). 0 primary actions (display-only).
`__avatar` is `aria-hidden` since the name already carries identity as text —
decoration, not a duplicate information channel. Alignment: **100% (15/15)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 3 | Anything removable? | No — each of 4 sections is a distinct real placement |
| 4 | Every element purposeful? | Yes |
| 7 | Decoration? | The avatar part is declared decoration explicitly and correctly `aria-hidden` |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 4 demo sections | keep | record header / feed / compact / in-context are all real, non-overlapping |
| Wrong-choice clause | keep | the scanning-down-a-column boundary is precise and was blind re-scored (per the page's own alignment table) to fix an earlier contradiction |

---

### Calendar *(`/components/calendar`)*

**Step 1 — the decision:** does the reader need to know WHICH days are
special (holiday, shutdown, blackout), not just state a date? The opener
routes the common case (plain date field) to the native `<input
type="date">` before the reader even reaches a demo — a strong wrong-choice
clause up front rather than buried at the bottom.

**Step 2 — measured inputs:** 1 month grid demo, marked day (red dot,
two-channel with the day number itself unaffected), a focus-ring outline on
a separate "24," selected-state outline distinct from marked-state dot,
weekend columns shaded via a diagonal-hatch pattern (not color alone).
Alignment: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 2 | Primary action obvious? | Yes — each day is a real submit button when used as a picker |
| 5 | Self-explanatory? | Yes — "Why the framework does not ship a date-picker widget" section states the design decision outright instead of leaving it implicit |
| 7 | Decoration? | No — hatch/dot/outline are all load-bearing state, confirmed at both 1440 and 390 |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Month grid + marked/selected states | keep | two-channel at every state (dot+color, outline+focus), holds at 390 |
| "Why no date-picker widget" section | keep | rare and valuable — a component page defending an *absence* rather than a feature |

---

### Combobox *(`/components/combobox`)*

**Step 1 — the decision:** picking one value out of a long list by filtering
as you type, vs. a plain `<select>` for five-or-fewer options, vs. a
multi-select dropdown for several values. Three-way disambiguation stated in
the opener, not left for the reader to infer.

**Step 2 — measured inputs:** the opener states, unprompted, that **without
JS this component does not degrade — it stops** ("a text input beside a list
that never opens... if you cannot run the behavior, ship a `<select>`"), and
separately documents a real limitation from an owner test report: the popover
**closes on scroll** rather than re-anchoring. Both are stated as honest
constraints, not smoothed over. Alignment: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes |
| 5 | Self-explanatory? | Yes — WAI-ARIA APG pattern is named explicitly, not "a custom widget" |
| 8 | Loading/empty/error understandable? | Yes — "No matches" section is dedicated, not folded into the basic demo |
| 9 | Context preserved? | Yes — Esc/light-dismiss don't change the field's committed value |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Filter/async/value-help sections | keep | each is a distinct real ERP shape (recents-first, rich rows, server-driven) |
| No-JS hard-stop + closes-on-scroll disclosure | keep, and a model for other pages | stating a real limitation plainly is the Content-dimension bar this framework holds itself to |

---

### Dashboard *(`/components/dashboard`)*

**Step 1 — the decision:** widgets are named, genuinely-independent
containers — not a wrapper for every section of a continuous form. The
opener explicitly redirects "Card?" seekers to `.bo-widget` and warns against
over-wrapping a single record's sections (pointing at form sections /
object-page instead).

**Step 2 — measured inputs:** 4 stat tiles in the primary demo (Open
invoices, Approved this week, Avg. approval time, Blocked), each pairing a
▲/▼ glyph + red/green color + a text delta ("+12% vs July") — three
independent channels for one signal, exceeding the two-channel bar. One
stated "hero figure per view, maximum" rule. At 390 the 4 tiles reflow
2-per-row, not a single cramped column and not an overflow. Alignment: **100%
(15/15)**.

| # | Question | Answer |
|---|---|---|
| 3 | Anything removable? | No — 4 distinct KPIs, no padding |
| 6 | Complexity hidden? | Yes — `tabular-nums` reserved for columns, proportional figures for stat values, stated as a rule not left implicit |
| 7 | Decoration? | No — every color-coded delta carries an icon + text, confirmed in the screenshot |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Stat tile row | keep | three-channel signal, correct 2-col reflow at 390 |
| "One hero figure per view" rule | keep | a stated constraint on the demo's own composition, not just the component |

---

### Data table *(`/components/data-table`)*

**Step 1 — the decision:** rows are the same kind of thing, columns are the
same fact about each — explicitly *not* a layout tool (the opener spells out
the accessibility cost of using a table for two-panel layout) and *not* a
single record's facts (routes to key-value instead).

**Step 2 — measured inputs:** 22 `<h2>` sections — by far the largest page in
the sweep so far. Read every heading rather than assuming padding: each names
a distinct, real ERP capability not covered by a neighbor — wide tables (50
columns), frozen columns, right-click column menu, grouped rows + subtotals,
grouped column headers, conditional cell tone, column alignment/width
guidance, performance at scale ("measured, not guessed" — a claim this
project's own doctrine would refuse to let stand unmeasured). The Simple vs.
Advanced two-tier split is explicitly reasoned in the opener ("most tables
don't" need full two-axis keyboard nav) rather than defaulting every table to
the heavier tier. Alignment: **100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 3 | Anything removable? | No section duplicates another; this is the one page where the length itself could look like scope creep, and it isn't — checked against Objective §3 by reading every heading, not skimming |
| 6 | Complexity hidden? | Yes — bulk-action toolbar via `:has()`, zero JS, stated as the headline feature |
| 9 | Context preserved? | N/A to a static page; behavior claims (frozen columns, right-click menu) are demonstrated in dedicated sections rather than asserted in prose alone |
| 10 | Built from zero today? | Yes — the Simple/Advanced split is itself evidence of restraint, not accretion |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| 22 sections | keep, all of them | each maps to a distinct real ERP table shape; length is coverage, not padding |
| Simple/Advanced tier split | keep | explicitly defended against defaulting every table to the heavier navigation model |

---

### Date *(`/components/date`, DEPRECATED)*

**Step 1 — the decision:** this page's job is now to get the reader OFF this
component and onto `.bo-cluster` + `.bo-u-tabular` composition. It does this
well: **Deprecated** in bold as the first word, states its own surface-review
score (1 of 12, "the lowest in the framework") rather than a vague "consider
alternatives," and shows the **replacement first** — "Use this instead" is
the very first `<h2>`, before any deprecated demo.

**Step 2 — measured inputs:** the deprecation notice is a `.bo-alert
.bo-alert--warning` containing 3 sibling `<p>` elements. Measured directly
(`getComputedStyle`): the alert's box is `display: flex; flex-direction: row;
flex-wrap: nowrap`. At 390px container width the three paragraphs do **not**
stack — they compress into three narrow columns (168px / 134px / 99px wide),
confirmed in the screenshot below. Every other info box in this batch (byline,
calendar, combobox, dashboard, dialog — all `.bo-alert` variants or similar)
reflows to one full-width flowing paragraph at 390px. This one specifically
does not.

| # | Question | Answer |
|---|---|---|
| 1 | Statable in one sentence? | Yes — "stop using this, here is what to use instead" |
| 5 | Self-explanatory? | Yes at 1440; **degraded at 390** — three 8-12-word-wide columns of wrapped text are measurably harder to read than one flowing paragraph, on the one component page in this framework whose entire job is a warning message |
| 10 | Built from zero today? | The deprecation handling itself: yes. The notice's responsive layout: no — nothing else in the framework ships a 3-column non-reflowing alert |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Deprecation framing (bold label, own score cited, replacement-first ordering) | keep | best-handled deprecated-component page found in this sweep so far — a model for `bo-date`'s eventual removal and for any future deprecation |
| `.bo-alert--warning`'s 3-paragraph `flex-row nowrap` layout | **fix** | does not reflow at 390px; measured widths 168px/134px/99px vs. every sibling info box's single flowing column. Either drop to `flex-direction: column` under the same width the rest of the docs shell reflows at, or split into fewer/shorter paragraphs so 3-across is not load-bearing |

**Screenshot evidence (390 dark):** the three columns are visually distinct
narrow strips of heavily-wrapped text, not a single readable block — see the
batch's saved screenshots, or reproduce with `getComputedStyle` on the
`.bo-alert--warning` element containing "Deprecated." at 390px width.

---

### Dialog *(`/components/dialog`)*

**Step 1 — the decision:** a modal is for a choice that must be made now, not
for telling the user something (routes informational cases to alert/toast
explicitly). Confirmed live by clicking the "Approve PO…" trigger.

**Step 2 — measured inputs (live-clicked, not just read):** the "Approve
purchase order" dialog opened correctly — backdrop dimmed the page, focus
landed in the dialog, exactly **one** visually-primary action (teal "Approve")
beside one secondary ("Cancel") — matches the "one primary action" heuristic
exactly, unlike a gallery page where multiple variants sit side by side.
`Cancel`/`Approve` order follows the safe-choice-first convention the
Destructive-confirm section states explicitly for the reject flow. Alignment:
**100% (18/18)**.

| # | Question | Answer |
|---|---|---|
| 2 | Primary action obvious? | Yes — verified live, single primary button, no competing CTA |
| 6 | Complexity hidden? | Yes — native `<dialog>` supplies backdrop/Esc/focus-return; the behavior only adds trigger wiring, Tab loop, `data-state` |
| 8 | States understandable? | Yes — destructive-confirm section explicitly documents `data-dismissible="false"` and why (no accidental backdrop dismiss on a destructive action) |
| 9 | Context preserved? | Yes — "Toasts cannot float above an open modal (top layer) — render confirmations inside the dialog" is a stated, correct constraint |
| 10 | Built from zero today? | Yes |

**Verdict table**

| Element | Verdict | Why |
|---|---|---|
| Approve / Wide / Destructive-confirm demos | keep | three distinct real dialog shapes (confirmation, embedded table, no-accidental-dismiss), each with a stated reason for its width/dismissibility choice |
| Live-tested trigger → modal → focus/backdrop | keep | matches documented claims exactly on interaction, not just in prose |

## What this batch found

One actionable defect (Date's deprecation-notice mobile layout) against six
clean passes. Two positive patterns worth propagating: **Date**'s
replacement-first deprecation framing, and **Combobox**'s plain disclosure of
its own no-JS hard-stop and scroll-repositioning limitation — both are
examples of the Content-dimension bar working as intended, not just
theoretical scoring.
