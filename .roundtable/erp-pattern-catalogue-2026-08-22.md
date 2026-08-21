# The target pattern catalogue for a real ERP (owner ask, 2026-08-22)

The ask: *"low quality of patterns content, grouping need to improve. it
needs to think about the patterns that can use in real ERP. pls list out
the list that we should have."*

Grounded in the 95.2/99.1 coverage walk (jobs, not domains — the finding
that gaps are SHAPES stands) and in the industry reference an ERP reader
already knows: SAP Fiori's floorplan taxonomy (List Report, Object Page,
Overview Page, Worklist, Wizard, Initial Page). Where our name and the
industry name differ, the catalogue says both — a reader arriving from
SAP/Oracle/Dynamics should recognise every row.

## The catalogue — 24 screens, 5 groups

Grouped by the JOB FAMILY in a real ERP working day, replacing the current
three groups (capture & edit / review & approve / overview & shell). The
current grouping is by interaction mode, which is how a framework author
thinks; a clerk's day runs find → work → decide → monitor → output, which
is how a reader chooses.

### 1. Enter & find (getting to the record)

| # | Screen | Industry name | Status |
|---|---|---|---|
| 1 | `login` | Sign-in | **have** |
| 2 | `app-launch` | Launchpad / Initial page | **have** |
| 3 | — | **Role home / Overview page** — my open items, my KPIs, live content (not a launcher) | **OWNER CALL, still unanswered from 99.1** |
| 4 | `command-bar` | Global search / command palette | **have** |
| 5 | `invoice-list` | **List Report** — find one document in thousands | **have** (rename candidate, below) |
| 6 | `filter-panel` | Filter bar / saved views | **have** |
| 7 | `value-help` | Value help (F4) | **have** |

### 2. Work one record (the detail family)

| # | Screen | Industry name | Status |
|---|---|---|---|
| 8 | `object-page` | Object Page (long record) | **have** — 102.2 grill queued |
| 9 | `record-detail` | Quick view / short read | **have** |
| 10 | `master-detail` | Split screen / list-detail | **have** |
| 11 | `detail-form` | Edit form | **have** |

### 3. Enter & correct data (capture)

| # | Screen | Industry name | Status |
|---|---|---|---|
| 12 | `editable-grid` | Line-item entry grid | **have** — 102.3 grill queued |
| 13 | `wizard` | Guided activity / create flow | **have** |
| 14 | `goods-receipt` (+ RF) | Warehouse execution / RF transaction | **have** |
| 15 | `staging` | Data import / batch upload | **have** |
| 16 | `validation-summary` | Error summary | **have** |
| 17 | `field-editor` | In-place field editing | **have** — weakest membership claim, below |

### 4. Decide & clear queues (the approver's day)

| # | Screen | Industry name | Status |
|---|---|---|---|
| 18 | — | **Inbox / Worklist** — what needs ME, across document types | **BUILD — queued 101.4** |
| 19 | `approval` | Approval detail | **have** |
| 20 | `bulk-actions` | Mass processing | **have** |

### 5. Monitor, report & output

| # | Screen | Industry name | Status |
|---|---|---|---|
| 21 | `reporting-dashboard` | Analytical dashboard (monitors) | **have** |
| 22 | — | **Report** — run with parameters, read, print, export | **BUILD — queued 101.6** |
| 23 | — | **Notification centre** — async things that finished while you weren't watching | **BUILD — queued 101.5** |
| 24 | — | **Output form** — the printed artefact: PO, invoice, delivery note | **BUILD — queued 101.7** |
| 25 | `settings-admin` | Configuration / admin | **have** |

**Count: 20 shipped + 4 queued builds + 1 owner decision (role home) = the
25-row catalogue.** The four queued builds are precisely the four the
coverage walk found and the owner named; nothing new was invented for this
list, which is itself the finding: the catalogue is already agreed — what
was missing was seeing it AS one catalogue, in ERP language, in job order.

## What this deliberately does NOT add

- **Domain packs** (order-to-cash screens, HR screens) — the standing
  do-not-build: they re-photograph existing shapes with different column
  headings (95.2's central finding, Objective §3).
- **Analytical List Page** (Fiori's chart-over-table hybrid) — composes
  from `reporting-dashboard` + `invoice-list`; a build only if a real
  consumer asks.
- **Chat/collaboration, calendar views, kanban** — not ERP-core; each
  would need front-door grilling (99.4) with real demand.

## Grouping: the concrete change proposed

Sidebar (and the 104.1 tile index, which inherits whatever grouping
exists) moves from 3 groups to these 5. Costs: a `Gallery.astro` edit and
the tile index's headings — no page moves, no URL changes. The 5-group
shape also fixes a real reader problem the 3-group shape has: "Patterns:
review & approve" currently holds `record-detail`, `object-page` and
`master-detail`, which are not review screens — they are the detail
family, and a reader looking for "how do I show one PO" has to know our
internal history to look there.

## Renames: propose two, refuse the rest

- `invoice-list` → **`list-report`** (industry name; the page is and
  always was the generic list screen — the invoice is sample data). Old
  URL redirects.
- `field-editor` — **membership question rather than rename**: it is a
  technique (in-place editing) more than a screen; if 102.x grills find
  its page thin, fold its content into `detail-form`/`editable-grid` and
  redirect. Not decided here.
- Everything else keeps its name — `object-page`, `wizard`, `staging`
  etc. already match industry vocabulary.

## Addendum (owner follow-up, same day): shape-not-domain, and the RF track

Two questions from the owner, both answered YES with one nuance each.

### 1. "Pattern should not be specific, like PO or Invoice — domain goes in DEMO?"

**Yes — and 18 of 20 pages already live by this rule without it ever having
been stated.** `object-page` is the proof of the right shape: a generic
pattern whose DEMO is a realistic PO (PO-88213 · Acme Supply Co.) — the
domain makes the demo credible, the name stays the shape. The realistic
demo data is a strength, not drift: a pattern demoed with `Lorem Ipsum
Item 1` would not convince an ERP builder that the screen survives real
content.

The principle, now stated once: **a pattern is NAMED and FRAMED for its
shape; the domain (PO, invoice, sales order) appears only as demo data.**
Consequences:

- `invoice-list` → `list-report` (already 109.2) is the one rename this
  rule demands. The page's own content barely resists — "invoice" is
  sample data on a generic list screen.
- **No per-domain demo variants.** Presenting "the same pattern as a PO"
  and "as an invoice" is re-photographing (95.2's do-not-build). One
  realistic demo per pattern; the opener says the shape generalises.
- The rule goes into the pattern recipe (CLAUDE.md's "how to document a
  PATTERN") so page #21 follows it by construction.

### 2. "App patterns (desktop/tablet/mobile) separate from RF scanner?"

**Split exactly one way: RF is a separate TRACK; desktop/tablet/mobile
are NOT separate patterns.**

- **Desktop/tablet/mobile: one pattern each, by construction.** The
  framework's standing bar is responsive-by-construction (container
  queries, rem density, verified at 1440 AND 390 per slice). Forking the
  catalogue per device class would triple 24 screens into 72 for
  content that adapts — Objective §3 refuses it. The catalogue notes
  this as a principle instead of a column.
- **RF genuinely is a different delivery target, on all three axes the
  owner named**: old engine (the `rf-essentials` CSS profile exists for
  exactly this — Chrome/WebView 108 floor, proven sufficient standalone
  by the `goods-receipt-rf` iframe fixture); fixed small screens
  (360×640, not a breakpoint of a desktop screen); different usage
  (scan-first, gloved, one-handed, spacious density, no hover). That is
  a separate track with its own floor, own CSS bundle, own verification
  — not a sixth job-family group.
- So the catalogue gains a **track dimension**: rows 1-25 are the app
  track (device-adaptive by construction); `goods-receipt` (+ its RF
  fixture) moves OUT of group 3 into an **RF track** of its own. Its
  name stays — "goods receipt" is the industry name of the transaction,
  and on the RF track the domain IS the job (a scan-driven receiving
  screen is not a generic shape wearing receiving data — the scan flow
  is the shape). Future RF screens (picking, putaway, inventory count)
  go through the 99.4 front door with real demand, not speculatively.

## Quality: sequencing, not a new mechanism

"Low quality of patterns content" gets a measured answer, not a rewrite
spree: the two hardest screens already have comprehensive grills queued
(102.2 object-page, 102.3 editable-grid). Proposal: run those two first,
extract the per-section quality bar they produce (states depth, data
contract realism, keyboard walkthrough presence), then sweep the
remaining 18 against that bar — the same treat-the-recipe-not-the-pages
move that worked for wrong-choice clauses (94.10). The four new builds
(101.4-101.7) get written against that bar from day one.
