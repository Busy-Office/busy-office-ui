import { page } from '../_shell.mjs';

/* Document LIST screen. Assembled from the `list-report` pattern: filter bar,
   toolbar with bulk actions, the table with a priority ladder, footer with
   pagination. Nothing here is new — that is the point of the first screen.

   GAP-17 (.roundtable/erp-suite-gaps.md): list-report only ever gave a
   "create" action inside the empty state, so nothing stood above a table
   that has rows — which every screen in this suite does. Fixed here with a
   header-actions row (existing bo-btn/bo-cluster primitives, no new CSS).
   Also adds a "Received" column: existing bo-progress paired with its own
   percent text, never colour/fill-length alone — the two-channel rule two
   external references (a Frappe PO list, a stock ledger) both violated with
   bare, textless progress fills. null = not a meaningful reading (rejected /
   not yet approved), rendered as an em dash rather than a misleading 0%. */
const rows = [
  ['PO-88213', 'Northwind Supply', 'CC-4021', '2026-08-28', '48,200.00', 'Pending approval', 'warning', null],
  ['PO-88198', 'Ferrus Metals', 'CC-4021', '2026-08-25', '12,940.00', 'Approved', 'success', 0],
  ['PO-88164', 'Kite Logistics', 'CC-1180', '2026-08-24', '3,180.50', 'Approved', 'success', 0],
  ['PO-88140', 'Northwind Supply', 'CC-2205', '2026-08-21', '27,015.00', 'Partially received', '', 55],
  ['PO-88121', 'Aalto Plastics', 'CC-1180', '2026-08-19', '9,600.00', 'Closed', '', 100],
  ['PO-88097', 'Ferrus Metals', 'CC-4021', '2026-08-18', '61,750.00', 'Rejected', 'danger', null],
];

export const render = () =>
  page({
    title: 'Purchase orders',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/purchase-orders.html' },
      { label: 'Purchase orders' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Purchase orders</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--ghost bo-btn--icon" type="button" aria-label="Refresh purchase orders">⟳</button>
        <button class="bo-btn" type="button">+ New purchase order</button>
      </div>
    </div>

    <form class="bo-cluster" data-density="compact">
      <input class="bo-input" type="search" aria-label="Search purchase orders" placeholder="Search…" style="max-inline-size: 12rem">
      <select class="bo-select" aria-label="Status filter">
        <option>All statuses</option><option>Pending approval</option><option>Approved</option><option>Closed</option>
      </select>
      <select class="bo-select" aria-label="Vendor filter">
        <option>All vendors</option><option>Northwind Supply</option><option>Ferrus Metals</option>
      </select>
      <button class="bo-btn bo-btn--secondary" type="button">Apply</button>
      <button class="bo-btn bo-btn--ghost" type="reset">Clear</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Approve</button>
          <button class="bo-btn bo-btn--danger" type="button">Reject</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">312 orders</span>
      </div>
      <table class="bo-data-table bo-data-table--sticky-col">
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col" aria-sort="descending"><button class="bo-data-table__sort-btn" type="button">Order #</button></th>
            <th scope="col">Vendor</th>
            <th scope="col" class="bo-data-table__col--tertiary">Cost center</th>
            <th scope="col" class="bo-data-table__col--secondary">Needed by</th>
            <th scope="col" class="bo-data-table__col--numeric">Value</th>
            <th scope="col">Status</th>
            <th scope="col">Received</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, vendor, cc, due, amount, status, tone, received]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"></td>
            <td class="bo-data-table__col--code"><a href="/p2p/purchase-order.html">${no}</a></td>
            <td class="bo-u-text-truncate">${vendor}</td>
            <td class="bo-data-table__col--tertiary bo-data-table__col--code">${cc}</td>
            <td class="bo-data-table__col--secondary bo-u-tabular">${due}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${amount.slice(0, -3)}<span class="bo-amount__fraction">${amount.slice(-3)}</span></span></span></td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${status}</span></td>
            <td>${received === null ? '<span class="bo-u-text-muted">—</span>' : `<progress class="bo-progress" value="${received}" max="100"></progress> ${received}% received`}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
      <div class="bo-data-table__footer">
        <nav class="bo-pagination" aria-label="Purchase order pages">
          <button class="bo-pagination__btn" type="button" disabled aria-label="Previous page">‹</button>
          <a class="bo-pagination__btn" aria-current="page" href="#">1</a>
          <a class="bo-pagination__btn" href="#">2</a>
          <a class="bo-pagination__btn" href="#">3</a>
          <a class="bo-pagination__btn" href="#" aria-label="Next page">›</a>
          <span class="bo-pagination__info">1–6 of 312</span>
        </nav>
      </div>
    </div>
`,
  });
