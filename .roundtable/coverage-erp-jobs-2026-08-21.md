# ERP coverage by JOB — and the owner's nine screens

2026-08-21. Delivers **95.2** (coverage measured as jobs, never a component
catalogue) and **99.1** (a verdict per screen for the owner's nine). Run as
one report because they are the same question asked twice: 95.2 in general,
99.1 with the owner's own answer as input.

**No percentage, deliberately** — 95.2's Accept refuses one. A coverage number
invites maximising it, and the honest deliverable is a ranked list with
reasons.

## The finding, first

**The gaps are SHAPES, not domains.**

Walking the standard process inventory — procure-to-pay, order-to-cash,
record-to-report, hire-to-retire, warehouse execution — the domains we do not
document turn out to reuse screens we already have. A sales order is a list, a
detail, an approval and a line-item grid; so is a purchase order. Adding
"order-to-cash patterns" would mostly re-photograph existing screens with
different column headings, which Objective §3 refuses outright ("nothing ships
for one screen" cuts both ways — nothing ships as a *copy* either).

What is genuinely missing is a small set of screen shapes that no amount of
recomposition produces. All five were named by the owner.

## Procure-to-pay — the framework's covered spine

| Job | Screen |
|---|---|
| Sign in / recover | `login` |
| Enter the suite | `app-launch` |
| Create a document too long for one screen | `wizard` |
| Enter / correct line items | `editable-grid` |
| Edit a record's fields | `detail-form`, `field-editor` |
| Find one document in thousands | `invoice-list`, `filter-panel`, `value-help` |
| Clear a queue | `bulk-actions` |
| Approve | `approval` |
| Receive stock (incl. RF scanner) | `goods-receipt`, `goods-receipt-rf` |
| Check a record end to end | `object-page`, `record-detail`, `master-detail` |
| Load data in bulk | `staging` |
| Monitor the period | `reporting-dashboard` |
| Configure the workspace | `settings-admin` |
| Recover from bad input | `validation-summary` |

P2P is not the gap. It is the most completely documented ERP process I would
expect to find in a UI framework this size.

## Composable, not absent — do NOT build these

Marked explicitly so a future wake does not read the coverage table as a
to-do list:

- **Order-to-cash** (quotation → sales order → delivery → billing) — list,
  detail, approve, line grid. Every shape exists.
- **Hire-to-retire** (requisition → candidate → onboarding) — same.
- **Audit / change history** — `record-detail` already documents the audit
  trail as one of its regions.
- **Mass change** — `staging` plus the `value-help` mass-change dogfood
  (Slices 66-67) cover it.
- **Global search results** — folds into the command bar below rather than
  earning a separate screen.

## Genuinely absent — the five shapes

Each is a shape, not a domain, which is why recomposition does not reach it.

| Shape | The job it does that nothing else does | Verdict |
|---|---|---|
| **Command bar** | jump to any record/action by typing, keyboard-first, without navigating | **build** — and we already run one |
| **Inbox / worklist** | "what needs ME today", ACROSS document types | **build** |
| **Notification** | tells you an async thing finished when you were not watching | **build** |
| **Report** | run with parameters, read, print, export — not monitor | **build** |
| **Output form** | the printed artefact the ERP emits: PO, invoice, delivery note | **build** |

Why each is not already covered:

- **Command bar** — nothing in the framework is keyboard-first navigation.
  And the asymmetry is embarrassing in a useful way: `cmdk` appears in exactly
  one file (`Gallery.astro`, the docs shell) and **zero** files under
  `packages/core`. We have been using one daily and documenting none.
- **Inbox** — `approval` is *one* approver's queue for *one* document type.
  An inbox is cross-type and cross-process: approvals, exceptions, assigned
  tasks, failed jobs, in one list with a "why is this here" per row. Nothing
  documents that.
- **Notification** — `alert` and `toast` are components for things that
  happen *while you watch*. The ERP case is the opposite: a posting run
  finished twenty minutes ago. That needs a persistent, readable,
  dismissible-per-item surface with an unread contract — a screen, not a
  toast.
- **Report** — `reporting-dashboard` monitors ("is this period on track");
  a report is *run* ("show me open items for cost centre 4021 as of
  period 7") and then read, printed or exported. Different job, different
  states (parameters, running, empty result, too many rows), different
  print story. The framework has strong print rules and no report to use
  them on.
- **Output form** — the one most UI frameworks ignore entirely, and the one
  an ERP cannot ship without. It is a document, not a screen: fixed layout,
  page breaks, letterhead, totals that must survive pagination. We already
  have `@media print` rules scattered across nine components with nothing
  that composes them into an artefact.

## The owner's nine — verdicts

| Screen | Verdict | Reason |
|---|---|---|
| login | **already covered** | `/patterns/login` |
| dashboard | **already covered** | `/patterns/reporting-dashboard` |
| object page (detail) | **already covered — but settle 99.2 first** | four overlapping detail patterns |
| landing page | **already covered, pending owner** | `app-launch` is the post-sign-in launchpad; if the owner means a role home with live content, that is a different screen and becomes a build |
| command bar | **build** | 99.3 |
| inbox | **build** | 101.4 below |
| notification | **build** | 101.5 |
| report | **build** | 101.6 |
| output form | **build** | 101.7 |

## What this does NOT cover

Stated so the report is not read as more than it is: this is a coverage
judgement over *screen shapes*, made by reading our own pattern openers
against a standard process inventory. It is not user research, it is not a
competitor comparison (95.2 refused that), and it does not claim the five
shapes are the only ones missing — only that they are the ones this walk
found, and that the four process families above genuinely recompose.
