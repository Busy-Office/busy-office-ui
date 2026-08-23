# Research: references for 121.1/121.2/121.3 (for 123.3 proposals)

Commissioned 2026-08-23 after the owner's "find reference to propose me."
One research agent, web evidence, URLs inline. Each section ends with the
one disagreement the references have — that's the design decision the
proposal puts to the owner.

## 1. Reconciliation / matching screen (121.1)

**References:** Xero bank reconciliation (central.xero.com "Reconcile your
bank account"), QuickBooks Online reconcile, Dynamics 365 Business Central
payment reconciliation journals, SAP three-way match (MIRO/MIGO/MRBR),
BlackLine account reconciliations.

**Consensus anatomy:** (1) two independent item pools — bank-side lines
vs book-side transactions (Xero: literal left/right columns; QBO: one
list checked against an externally-entered ending balance; BC: one
journal grid matched against open ledger entries); (2) a system-proposed
match per line that a human confirms or overrides (Xero's green "OK" +
"See other matches"; BC's automatic-application engine; SAP's
tolerance-key auto-clear); (3) a persistent balance-difference figure
that gates completion.

**Shared contract (every reference):** confirming a match removes both
sides from the working set at once; unmatched items funnel to an explicit
exception path (create-new / find-and-match / transfer; SAP's
blocked-invoice queue); the finish action (Reconcile/Post) is gated on
the difference hitting exactly zero (Xero/QBO/BC) or a configured
tolerance (SAP).

**The disagreement → owner decision:** layout orientation. Xero = true
two-column side-by-side bridged by a match action; QBO = a single
checklist with no itemized counter-list; BC = single grid with an
apply-drawer; BlackLine drops line-matching for a portfolio dashboard.
Pick: dual-list-with-suggested-match vs single-list-with-checkbox-
clearing vs journal-with-apply-drawer.

## 2. Timesheet / time entry (121.2)

**References:** SAP CATS, Workday time entry/Time Tracking, Harvest
weekly timesheet, Toggl Track timesheet view, Replicon (validation rules
+ approval status).

**Consensus anatomy:** (1) a fixed day-of-week column axis spanning one
locked period — in every reference without exception; (2) rows = the
allocation dimension (project/task/cost-object/WBS), an open list crossed
against the fixed columns; (3) two levels of totals always shown together
— row total AND column total, usually plus a period target the grand
total must reconcile against.

**Shared contract:** validation gates the submit action (min/max/target
hours per day/week before Submit enables); submission moves the whole
period as ONE unit into an approval state; the approver sees per-row/day
detail, not just a total; a copy-prior-period convenience recurs (Toggl's
Copy) to avoid re-entering recurring rows.

**The disagreement → owner decision:** entry mechanism. Toggl/SAP CATS/
Harvest render a persistent, directly-editable grid (click a cell, type
hours); Workday uses a calendar/day-click model (clicking a day opens a
modal for that block). Pick: spreadsheet-style inline grid vs
click-day-to-open-dialog.

## 3. Comparison / evaluation matrix (121.3)

**References:** SAP Ariba (grading/scoring, award scenarios panel, bid
comparison), Coupa Sourcing Optimization, GSMArena compare, Amazon
"Compare with similar items", G2/Capterra side-by-side.

**Consensus anatomy:** (1) candidates as COLUMNS, criteria as rows —
uncontested across consumer and enterprise references (Ariba's bid sheet:
each supplier its own colored column, line items as rows); (2) a
per-criterion "best" signal computed and shown inline, never left for
the reader to scan unaided (GSMArena bolds the winner; Amazon badges
"Best value"; Ariba/Coupa show weighted score, rank, or
difference-to-best-bid); (3) a terminal action that commits to a subset
of candidates.

**Shared contract:** candidates add/remove in place; weighting is
implicit/equal in consumer tools but explicit and user-configurable in
enterprise ones (Ariba per-criterion weights; Coupa multi-constraint
optimization).

**The disagreement → owner decision:** award granularity. Consumer tools
end in a single mutually-exclusive pick; enterprise sourcing formalizes a
SPLIT award — allocating quantity/percentage across multiple winners
(60/40), with "Best Bid" as just one scenario. Pick: select-one
(radio-style, simpler) vs allocate-across-many (per-row split, heavier,
matches procurement reality).

## Source URLs

- https://central.xero.com/0/article/Reconcile-your-bank-account
- https://quickbooks.intuit.com/learn-support/en-us/help-article/statement-reconciliation/reconcile-account-quickbooks-online/L3XzsllsK_US_en_US
- https://learn.microsoft.com/en-us/dynamics365/business-central/receivables-how-reconcile-payments-auto-application
- https://ramp.com/blog/sap-3-way-match
- https://www.blackline.com/products/financial-close/account-reconciliations/
- https://www.cleverence.com/articles/sap-documentation/cross-application-time-sheet-cats-4937/
- https://kb.uwm.edu/uwmhd/153128
- https://support.getharvest.com/hc/en-us/articles/360048181832-Submitting-and-approving-timesheets
- https://support.toggl.com/en/articles/10760857-adding-time-entries-in-timesheet-view
- https://download2.replicon.com/help/Timesheet/Timesheet_Setup/Setting_Up_Validation_Rules.htm
- https://help.sap.com/docs/ARIBA_SOURCING/148a004128f64bc1837c11a69eb7caab/7d49a3ba71ea10149d7ffcca62d3a33d.html
- https://www.coupa.com/products/source-to-contract/advanced-sourcing-optimization/
- https://www.gsmarena.com/compare.php3
