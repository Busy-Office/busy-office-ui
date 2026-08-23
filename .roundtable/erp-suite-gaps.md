# ERP suite examples — the gap ledger

What building real screens out of the shipped framework could not do cleanly.
One entry per gap, written **when it was hit**, with the screen that hit it.
Promoted into `ROADMAP.md` slices in batches — this file is the raw log, the
roadmap is the decision.

**The rule that produces this file**: the example may not add a single line of
its own CSS (`check-erp-suite.mjs` enforces it). When a screen needs something
the framework has not got, the screen compromises visibly and the need lands
here. Without that rule, every gap becomes a local `<style>` block and the
instrument reads clean while telling us nothing.

**Status of the pilot**: Procure-to-pay, 2 document types, 5 real screens
(suite home, PO list, PO document, invoice list, invoice document) + 5 honest
module stubs. Gates: `check-markup` (every class exists), `check-erp-suite`
(no CSS, every link resolves), `audit` (axe at 1440 and 390, no sideways
scroll, and — added mid-pilot — no element spilling content past its
parent's edge). All green, with ONE allowlisted failure carrying its reason:
GAP-7.

**Read GAP-6 and GAP-7 first if you read nothing else.** They were found by a
SCREENSHOT after all three gates reported the pilot clean, and both are
defects in shipped code rather than missing surface. That is the quality
bar's screenshot step earning its place, again.

---

## GAP-1 — no module rail: the shell has one sidebar, a suite needs two levels

**Hit on**: every screen (`_shell.mjs`).
**Wanted**: the shape every multi-module ERP uses — a narrow always-visible
icon rail of modules, beside a wider column listing the current module's
documents. Switching module is one click from anywhere; the second column
re-populates.
**Have**: `sidebar-layout` gives ONE sidebar slot; `bo-sidebar-nav` gives
`__section` + `__heading`, i.e. one column with grouped links.
**Compromised to**: both levels stacked in the single sidebar — "Modules" as
one group, "Documents" as a second group beneath it. It reads fine at six
modules and two documents. It will not survive twelve modules, and the module
list scrolls away as the document list grows, which is exactly what a rail
exists to prevent.
**Shape of the fix (not yet decided)**: either a `--rail` setting on
`sidebar-layout` that admits a second, narrower slot, or an explicit
two-level `sidebar-nav` variant. Refusing is also a real answer — "compose two
`sidebar-nav`s inside a `bo-cluster`" may be enough, and if so the gap is a
DOCS gap, not a component one. Decide before building module two.

## GAP-2 — nothing documents "related documents"

**Hit on**: `p2p/purchase-order`, `p2p/vendor-invoice`.
**Wanted**: the block every document screen in every ERP has — what this
record is connected to, with each entry's own status, navigable. A PO shows
its requisition, its receipts, its invoices; the invoice shows its PO and its
receipt.
**Have**: nothing. No component, no pattern, no guidance. Grepped the whole
docs tree for "related documents" and got zero hits.
**Compromised to**: a `bo-kv--rows` list with links and badges stuffed into
the value. That is the wrong shape and says so: these are *records with their
own state*, not facts about this one. A kv row cannot carry a status, a
timestamp and an action, and the reader cannot scan a column of them.
**Why it matters more than it looks**: this is the connective tissue of a
document-based suite. Every module needs it, on every document screen. It is
the single most-repeated thing the pilot could not build.
**Shape of the fix**: likely a small composition documented as a pattern
section (badge + link + meta in a `bo-stack`), NOT a new component — but the
composition has to be decided once and documented, or twelve screens will
invent twelve versions of it. Worth grilling against the Objective.

## GAP-3 — a segmented option cannot carry a count

**Hit on**: `p2p/vendor-invoices` (the triage views: All open · 128, Blocked ·
9, Mine · 14).
**Wanted**: the count beside each saved view. The count is the load-bearing
part — "Blocked · 9" is what makes a clerk click it; "Blocked" alone is a
filter nobody knows the size of.
**Have**: `bo-segmented` renders label text only.
**Compromised to**: the count typed into the label string. It works and it
scans, but nothing sets the count apart typographically, it cannot be styled
as secondary, and a consumer re-implementing this will guess at the separator.
**Shape of the fix**: probably a documented convention rather than CSS — the
same "one component, many settings" call the badge/count question got
elsewhere. Cheap either way; the risk is twelve screens each inventing a
different separator.

## GAP-4 — three-way match has no home: no grouped column header, no
"this is the cell that disagrees" cue

**Hit on**: `p2p/vendor-invoice`, the three-way match table.
**Wanted**: ordered / received / billed shown as three readings of ONE line,
grouped under spanning headers, with the disagreeing cell marked so the eye
lands on it. This screen is the reason AP exists.
**Have**: `data-table` with flat single-row headers. `data-row-state` marks a
ROW, not a cell. `comparison` is about choosing between options;
`reconciliation` is about two sides of a ledger. Neither is this.
**Compromised to**: a wide flat table with repeated column names ("Qty
ordered / Qty received / Qty billed") and a verdict badge at the end that the
reader must map back to a column by eye — the exact manual step the screen
exists to remove.
**Shape of the fix**: two separable pieces. (a) a grouped (two-row) column
header for `data-table` — mechanical, and useful far beyond this screen;
(b) a cell-level state cue, which is a genuinely new idea and needs grilling:
it risks becoming "colour the cell", which the two-channel rule forbids
outright.

## GAP-5 — the object-page header models the record title as a `<span>`, so a
consumer who copies it ships a page with no `<h1>`

**Hit on**: `p2p/purchase-order`, `p2p/vendor-invoice`. Caught by axe
(`page-has-heading-one`) on the pilot's first audit run — I had copied the
pattern faithfully and the result was inaccessible.
**Have**: `bo-widget__title` is a `<span>` in the component page, in every
pattern page, and in the canonical Markup samples. There is no note anywhere
that on a REAL screen the object page's record title is the page's `<h1>` and
the section widgets' titles are `<h2>`.
**Why the docs cannot see it**: every demo is nested inside the docs page's
own `<h1>`, so the docs' axe sweep is green while the copyable markup is not.
That is the whole argument for building this example.
**Compromised to**: `<h1 class="bo-widget__title">` on the record title,
`<h2>` on section headings — which works and is what the pattern should say.
**Shape of the fix**: a docs fix, and a small one: the object-page and
record-detail Markup samples should show the heading element, with one line
saying why. Possibly a claims case asserting the built pattern pages' samples
carry a heading element. **Highest confidence-to-cost ratio of the five.**

## GAP-6 — `bo-stack` on `bo-app-shell__main` silently clips a scrollable
table

**Hit on**: every document screen, and found by a SCREENSHOT after three
gates had reported the pilot clean.
**What happened**: the reset zeroes margins, so a screen's sections ran
together. The framework's own answer to that is the `stack` primitive, so I
put `bo-stack` on `bo-app-shell__main` — the obvious composition.
`__main` is `overflow: auto`; making it a flex column makes its children
shrinkable, and the table container collapsed to **32px against a 198px
scrollHeight** — header row visible, all four data rows clipped away. Nothing
reported it: not axe, not the page-level overflow check, not check-markup.
**Compromised to**: the stack goes on an inner `<div>`, never on `__main`.
That works and is what the docs should say.
**Shape of the fix**: docs, plus possibly one defensive line. Two shipped
primitives that are each correct compose into silent data loss, and the
composition that breaks is the one a careful reader would try first.

## GAP-7 — `bo-form-actions` does not wrap: a three-button bar loses a button
at 390

**Hit on**: `p2p/vendor-invoice` (Release for payment · Request credit note ·
Send back to vendor).
**Have**: `.bo-form-actions` is `display:flex; justify-content:flex-end` with
no `flex-wrap`. At 390 the row overflows to the LEFT, and because the bar is
`position: sticky` inside a clipping ancestor, the first button is simply
gone — 234px of it, measured.
**Why nothing caught it, here or in the docs**: content overflowing the START
edge does not appear in `scrollWidth`, so a page-level or container-level
overflow check reports clean. The docs' own action bars carry two short
buttons, which fit. The framework's standing lesson applies verbatim —
*measure the box that carries the constraint* — and the pilot's first
clipping probe fell into exactly that trap: it passed with the allowlist
emptied, i.e. it could not fail. Rewritten to compare each CHILD against the
PARENT's client box, it reports the defect immediately.
**Compromised to**: nothing. The example keeps the realistic three-button
bar, and `audit.mjs` allowlists `.bo-form-actions` **with the reason and a
pointer here** rather than trimming the screen to hide it.
**Shape of the fix**: almost certainly `flex-wrap: wrap` plus a row gap —
mechanical, and it needs a claims case at 390 so it cannot regress.

---

## Not gaps (checked, and the framework was right)

- **List screens**: `list-report` covered the PO list end to end — filters,
  toolbar, bulk actions, the priority ladder, pagination. Nothing missing.
- **Approval trail**: `bo-timeline` carried the PO's approval chain with its
  markers, states and meta, unchanged.
- **Money**: `bo-amount` with `--negative` carried the variance. My first
  attempt guessed `--danger`; `check-markup` rejected it and named the real
  one, which is the gate working as designed.
- **Density**: `data-density="compact"` on the containers did what an ERP
  screen needs without a single override.
