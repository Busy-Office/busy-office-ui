# ERP pattern catalogue v2 — after external research (2026-08-22)

Owner: *"ok let regrouping and propose me again. pls also get new input and
research what need for ERP. then we review."* Regrouping is DONE and live
(5 job families + RF track, Slice 109.1/109.6). This is the re-proposal,
now cross-checked against three independent industry taxonomies instead of
only our own coverage walk.

## Sources (fetched 2026-08-22)

1. **SAP Fiori floorplans** — List Report, Object Page, Overview Page,
   Worklist, Analytical List Page, Wizard, Initial Page.
2. **Microsoft Dynamics 365 F&O form patterns** — Simple List, Simple
   List & Details, Details Master, List Page, Workspace, Form Part
   Section List (+ Double), Table of Contents (settings), Drop Dialog,
   Lookup (basic / w-preview / w-tabs), Wizard, Simple Details variants.
3. **Odoo view types** — List, Form, Kanban, Pivot, Graph, Calendar,
   Gantt, Activity, Cohort, Grid (editable spreadsheet), Map, Search,
   Settings.
4. General ERP-operations sweep — period close, batch jobs, master data,
   exception management, audit trail.

## Finding 1 — the current catalogue maps 1:1 onto the industry cores

Every core floorplan in all three systems has a row in our catalogue.
The mappings worth writing down (they double as reader-facing vocabulary):

| Ours | Fiori | Dynamics | Odoo |
|---|---|---|---|
| list-report | List Report | List Page / Simple List | List + Search |
| object-page | Object Page | Details w/FastTabs | — |
| master-detail | — | **Details Master / Simple List & Details** | — |
| detail-form | — | Simple Details | Form |
| editable-grid | — | — | **Grid (editable spreadsheet)** |
| value-help | — | **Lookup (all 3 variants)** | — |
| wizard | Wizard | Wizard | — |
| app-launch | Initial Page | — | — |
| inbox (queued 101.4) | **Worklist** | — | Activity (partly) |
| settings-admin | — | **Table of Contents** | Settings |
| reporting-dashboard | — | — | Pivot + Graph (partly) |

Validation, not vanity: `value-help` ↔ Dynamics *Lookup* and
`master-detail` ↔ *Details Master* mean our names are recognisable to
people migrating off those systems.

## Finding 2 — ROLE HOME is upgraded from "owner call" to "build, recommended"

The open question since 99.1 now has independent evidence: **both** SAP
(*Overview Page* — cards with live content, per role) and Microsoft
(*Workspace* — "collection of smaller content regions", the D365 home for
each activity) ship it as a first-class floorplan distinct from the
launchpad. Two of three major systems treat "my open items + my KPIs, per
role" as a required screen, not an option. Recommendation: **build**, as
`role-home`, composing from `bo-widget-grid` + kv + badges + links into
the inbox — after 101.4 (inbox) lands, since its "my open items" region
wants the inbox to link into.

## Finding 3 — four NEW candidates surfaced, each needing an owner verdict

Ranked by evidence strength. None auto-queued — this is the review list.

| Candidate | Evidence | Starting position |
|---|---|---|
| **Job monitor / batch-run history** — scheduled jobs, run history, failures, next run | ops sweep (batch RunId / reconciliation discipline); Dynamics batch-job screens; our own `staging` stops at import | **lean build** — the admin's daily screen nothing covers; `notification` (101.5) tells you a run finished, nothing shows the queue itself |
| **Kanban board** — cards in status lanes (production orders by stage, requests by state) | Odoo only (first-class there; not a Fiori/D365 floorplan) | **owner call** — single-source; would also need the drag question re-opened (100.1 refused drag for lists; lanes without drag = status columns, which `bo-badge`+grid may compose) |
| **Schedule / calendar screen** — deliveries, work orders by date | Odoo Calendar; we already ship the `bo-calendar` COMPONENT | **lean compose-first grill** — likely a pattern page composing the existing component, same shape as command-bar's verdict |
| **Period-close cockpit** — the close checklist with statuses and owners | ops sweep (close discipline); SAP ships a Closing Cockpit product | **expect recompose** — ordered-list + status badges + approval covers the shape; grill before believing that |

## Finding 4 — confirmed refusals, now with external backing

- **Analytical List Page** (Fiori) — stays refused: composes from
  reporting-dashboard + list-report; Fiori itself positions it as a
  hybrid of two floorplans we have.
- **Gantt** (Odoo) — out of scope, same stance as the virtualiser: a
  charting/scheduling engine is a library, not a CSS pattern; the docs
  can say so plainly.
- **Map** (Odoo) — logistics-niche, no second source.
- **Activity / chatter** (Odoo) — CRM-shaped; the audit/timeline region
  of `record-detail` + `approval-workflow` covers the ERP need.
- **Drop Dialog, Form Part Section List** (Dynamics) — component-level
  (dialog, form-section), already shipped as components.

## The v2 catalogue for review

**App track** (device-adaptive by construction) — 5 job families as
deployed, plus the changes above if approved:

1. **Enter & find**: login · app-launch · command-bar · list-report ·
   filter-panel · value-help · **role-home (NEW — build recommended)**
2. **Work one record**: object-page · record-detail · master-detail ·
   detail-form
3. **Enter & correct data**: editable-grid · wizard · staging ·
   validation-summary · field-editor (membership under review, 109.4)
4. **Decide & clear queues**: inbox (queued) · approval · bulk-actions ·
   **kanban board (CANDIDATE — your call)**
5. **Monitor, report & output**: reporting-dashboard · report (queued) ·
   notification (queued) · output-form (queued) · settings-admin ·
   **job monitor (CANDIDATE — lean build)** ·
   **schedule screen (CANDIDATE — compose-first)** ·
   **period-close cockpit (CANDIDATE — expect recompose)**

**RF track**: goods-receipt · the 109.7 family grill (landing, task list,
scan form, picker doctrine) as already queued.

## What we're asking the owner to decide

1. **role-home** — approve the build? (evidence upgraded to 2 of 3
   industry systems; sequenced after inbox)
2. **job monitor** — approve a front-door grill? (lean build)
3. **kanban** — grill, or refuse as single-source? (would touch the
   drag question again)
4. **schedule screen** — approve a compose-first grill?
5. **period-close cockpit** — approve a grill expecting "recomposes"?

Everything else in v2 is either already shipped, already queued
(101.4-101.7, 109.7), or already refused with reasons.
