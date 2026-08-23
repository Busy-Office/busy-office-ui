/**
 * Single source for the pattern sidebar groups. `Gallery.astro`'s sidebar
 * and `scripts/gen-patterns-index.mjs` (which drives `/patterns/`, the
 * generated tile index — roadmap 104.1) both import this, so the sidebar
 * and the front door cannot disagree about which patterns exist or how
 * they're grouped.
 *
 * Grouped by JOB FAMILY in a real ERP working day (2026-08-22, Slice 109
 * catalogue: .roundtable/erp-pattern-catalogue-2026-08-22.md) — a clerk's
 * day runs find -> work -> decide -> monitor. RF is a TRACK, not a job
 * stage: own browser floor (rf-essentials, Chrome/WebView 108), own screen
 * size, own usage.
 *
 * Plain ESM (no Astro syntax) so it loads identically from an .astro
 * frontmatter (Vite/Astro build) and a plain Node script (gen-patterns-index).
 */
export const PATTERN_GROUPS = [
  {
    label: 'Patterns: enter & find',
    items: [
      { href: '/patterns/login', label: 'Login' },
      { href: '/patterns/error-pages', label: 'Error pages' },
      { href: '/patterns/app-frame', label: 'App frame' },
      { href: '/patterns/suite-home', label: 'Suite home' },
      { href: '/patterns/app-launch', label: 'App launch' },
      { href: '/patterns/role-home', label: 'Role home' },
      { href: '/patterns/command-bar', label: 'Command bar' },
      { href: '/patterns/list-report', label: 'List report' },
      { href: '/patterns/filter-panel', label: 'Advanced filter panel' },
      { href: '/patterns/value-help', label: 'Value help' },
    ],
  },
  {
    label: 'Patterns: work one record',
    items: [
      { href: '/patterns/object-page', label: 'Object page' },
      { href: '/patterns/record-detail', label: 'Record detail' },
      { href: '/patterns/master-detail', label: 'Master-detail' },
      { href: '/patterns/detail-form', label: 'Multi-column detail form' },
    ],
  },
  {
    label: 'Patterns: enter & correct data',
    items: [
      { href: '/patterns/editable-grid', label: 'Editable grid' },
      { href: '/patterns/wizard', label: 'Multi-step wizard' },
      { href: '/patterns/staging', label: 'Staging / batch result' },
      { href: '/patterns/reconciliation', label: 'Reconciliation' },
      { href: '/patterns/timesheet', label: 'Timesheet' },
      { href: '/patterns/comparison', label: 'Comparison matrix' },
      { href: '/patterns/validation-summary', label: 'Validation summary' },
    ],
  },
  {
    label: 'Patterns: decide & clear queues',
    items: [
      { href: '/patterns/inbox', label: 'Inbox' },
      { href: '/patterns/approval', label: 'Approval workflow' },
      { href: '/patterns/bulk-actions', label: 'Bulk actions' },
      { href: '/patterns/kanban', label: 'Kanban board' },
    ],
  },
  {
    label: 'Patterns: monitor & output',
    items: [
      { href: '/patterns/reporting-dashboard', label: 'Reporting dashboard' },
      { href: '/patterns/report', label: 'Parameterized report' },
      { href: '/patterns/output-form', label: 'Issued document' },
      { href: '/patterns/notification', label: 'Notification' },
      { href: '/patterns/job-monitor', label: 'Job monitor' },
      { href: '/patterns/schedule', label: 'Schedule calendar' },
      { href: '/patterns/settings-admin', label: 'Settings & admin' },
    ],
  },
  {
    label: 'Patterns: RF / rugged devices',
    items: [
      { href: '/patterns/rf-landing', label: 'RF task menu' },
      { href: '/patterns/rf-list', label: 'RF task queue' },
      { href: '/patterns/goods-receipt', label: 'Goods receipt (RF scanner)' },
    ],
  },
];
