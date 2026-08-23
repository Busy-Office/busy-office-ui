# Research: ERP web/mobile UX — what's missing, what needs improving

Owner's ask (2026-08-23): "UX/UI Web/Mobile App for ERP … what are missing
ones and are requiring to be improved." Research loop §3c: candidates for
the OWNER to pick — this report decides nothing. Local ground truth
verified first (35 patterns, ~45 components, density/container-query
device story; zero touch/pointer handlers in shipped JS; table
auto-compaction tightens density but drops no columns; the words
mobile/phone/touch appear nowhere in notification/approval/inbox/wizard;
offline exists only as prose promises in the RF state tables).

## Ranked candidates (7 — the 8th slot deliberately left empty)

1. **Offline / sync-state signalling — MISSING (Evidence).** RF pages
   already PROMISE queue-and-replay; nothing ships it. D365 Field Service
   made sync state an ever-present header element; web.dev prescribes
   per-item queued/synced/failed. Accept sketch: two-channel sync-status
   slot in app-frame + an "offline & queued actions" concept page.
2. **Column priority / pop-in for narrow tables — IMPROVE (Evidence).**
   Fiori's responsive table pops columns in/out by importance; PatternFly
   stacks rows. Our 10-column list at 390px is horizontal scroll. Accept:
   CSS-first per-column priority under the existing bo-table container
   query; column-chooser as recovery.
3. **Approve-from-phone — IMPROVE (Evidence).** Fiori My Inbox and Power
   Automate treat phone approvals as first-class; our approval/inbox
   never mention phone width. Accept: phone-width States rows + an
   "on a phone" section in approval/inbox — sections, not new patterns.
4. **Camera capture & camera barcode — MISSING (Evidence).** Fiori ships
   camera-scan patterns on both mobile OSes; our story is keyboard-wedge
   only. Accept: capture="environment" recipe on file-upload +
   BarcodeDetector-fallback note in goods-receipt — recipe, not engine.
5. **Saved views / variant management — IMPROVE, partial (Evidence).**
   Fiori treats named views as list-report table-stakes; we have one
   state-table row. Accept: named-view switcher composed from dropdown +
   a persistence data contract in list-report.
6. **Mobile form-entry recipe — IMPROVE (Evidence refs / Hypothesis
   size).** inputmode ships in places; no page teaches the
   inputmode/autocomplete/enterkeyhint recipe Baymard calls the cheapest
   mobile win. Accept: a "forms on touch devices" section.
7. **Swipe row actions — MISSING, rank LOW (Hypothesis).** Real in Fiori
   Android/M3, but gesture-only actions strain the two-channel doctrine
   and need new touch JS. Propose only if a consumer asks.

**Bottom-nav** (refused in 123.2, respected): reference consensus is
uniform (M3 mandates nav bars <600dp), but consensus is not the trigger.
Named re-open trigger: the first consumer shipping a phone-first module.

**Checked, already covered** (false gaps die here): bulk-import feedback
(staging) · audit trail (timeline/audit + record-detail) · KPI drill-down
(reporting-dashboard) · global search/app frame (command-bar + 123.2) ·
export/column chooser (table-toolbar) · conflict handling (concurrency) ·
scale (windowed list/pagination/AG-Grid recipe) · Gantt/map/chatter/
period-close (Slice 121 refusals stand).

Sources: Fiori responsive table + variant management + iOS/Android
barcode; PatternFly tables; D365 FS offline sync; web.dev offline UX;
Power Automate approvals; Baymard input fields; NN/g mobile input; M3
navigation bar + lists; Android canonical layouts. (Full URLs in the
agent transcript; each claim carries 2+ independent sources.)
