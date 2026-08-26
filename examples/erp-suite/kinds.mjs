/**
 * What each ERP-suite screen is FOR. One definition, two readers.
 *
 * `score.mjs` scores a screen against what its KIND owes; the docs' screen-kit
 * index (roadmap 147.1) groups and describes screens by the same map. Two
 * copies would drift the moment a screen is added, and this file has already
 * corrected itself three times — `period-close` is a job not a list, `bom` and
 * `lot-trace` are structures not reports, `customer-invoices` is an aging
 * report that merely SOUNDS like a list. Those corrections are the reason it is
 * hand-written and reviewed in a diff rather than inferred from a URL.
 */
/** What each kind of screen is FOR, and therefore what it owes. */
export const KIND = {
  'index': 'home',
  'p2p/requisitions': 'list', 'p2p/purchase-orders': 'list', 'p2p/vendor-invoices': 'list',
  'o2c/sales-orders': 'list',
  'crm/accounts': 'list', 'crm/opportunities': 'list',
  'prod/production-orders': 'list',
  'p2p/requisition': 'document', 'p2p/purchase-order': 'document',
  'p2p/vendor-invoice': 'document', 'o2c/sales-order': 'document',
  'o2c/customer-invoice': 'document', 'crm/account': 'document',
  'crm/opportunity': 'document', 'prod/production-order': 'document',
  'fin/journal-entry': 'document', 'inv/stock-movement': 'document',
  'p2p/convert-to-po': 'worksheet', 'inv/cycle-count': 'worksheet',
  'fin/trial-balance': 'report', 'fin/ar-aging': 'report', 'prod/capacity': 'report',
  'inv/stock-on-hand': 'report',
  /* Reclassified 2026-08-26, the THIRD kind-map correction and the one that
     names the cause: `o2c/customer-invoices` is "Receivables by age", a cross-tab
     with Current / 1-30 / 31-60 / 61-90 / 90+ — the same shape as fin/ar-aging.
     It was filed as a list because its NAME sounds like one. All three
     corrections share that: period-close, bom and this. Kind comes from what a
     screen DOES, and the map is hand-written precisely so that judgement is
     visible in a diff rather than inferred from a URL. */
  'o2c/customer-invoices': 'report',
  /* Corrected 2026-08-26 after the first run scored these 1/4 and 2/4. That was
     the MAP being wrong, not the screens: a BOM and a lot trace are structures,
     and a structure has no meaningful total, so owing a <tfoot> was nonsense.
     Period close is a job — you do not filter close tasks, create them ad hoc,
     or drill into a task record. Reclassified because the PURPOSE differs, not
     to erase a low score; the six lists still missing a filter bar were left
     exactly where they are. */
  'prod/bom': 'structure', 'inv/lot-trace': 'structure',
  'fin/period-close': 'job',
};
