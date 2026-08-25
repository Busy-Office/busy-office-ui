import { page } from '../_shell.mjs';

/* The list. Same shape as every other document list in the suite, and that is
   the point of building it — module four's value is in the BOM tree and the
   capacity grid, not here. Carries the header-actions row from Slice 139 so
   it is not the eighth screen to miss it. */
const rows = [
  ['PRO-3310', 'PMP-4400 Pump assembly', '40', '2026-09-21', 'Material short', 'warning'],
  ['PRO-3305', 'IMP-2210 Impeller', '120', '2026-09-14', 'In progress', ''],
  ['PRO-3298', 'MNT-1180 Mounting plate', '250', '2026-09-09', 'Released', 'success'],
  ['PRO-3286', 'PMP-4400 Pump assembly', '25', '2026-09-02', 'Finished', 'success'],
];

export const render = () =>
  page({
    title: 'Production orders',
    moduleId: 'prod',
    trail: [{ label: 'Home', href: '/index.html' }, { label: 'Production', href: '/prod/production-orders.html' }, { label: 'Production orders' }],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Production orders</h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">+ New production order</button>
        <button class="bo-btn bo-btn--secondary bo-btn--icon" type="button" aria-label="Refresh"><span class="bo-icon bo-icon--settings" aria-hidden="true"></span></button>
      </div>
    </div>

    <form class="bo-cluster" data-density="compact">
      <input class="bo-input" type="search" aria-label="Search production orders" placeholder="Search…" style="max-inline-size: 12rem">
      <select class="bo-select" aria-label="Status filter">
        <option>All statuses</option><option>Released</option><option>In progress</option><option>Confirmed</option><option>Closed</option>
      </select>
      <select class="bo-select" aria-label="Work centre filter">
        <option>All work centres</option><option>Assembly line 1</option><option>Machining cell</option>
      </select>
      <button class="bo-btn bo-btn--secondary" type="button">Apply</button>
      <button class="bo-btn bo-btn--ghost" type="reset">Clear</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Release</button>
          <button class="bo-btn bo-btn--secondary" type="button">Check material</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">4 open</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Open production orders</caption>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col">Order</th>
            <th scope="col">Item</th>
            <th scope="col" class="bo-data-table__col--numeric">Qty</th>
            <th scope="col" class="bo-data-table__col--secondary">Due</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, item, qty, due, status, t]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"></td>
            <td class="bo-data-table__col--code"><a class="bo-data-table__cell-link" href="/prod/production-order.html">${no}</a></td>
            <td class="bo-u-text-truncate">${item}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${qty}</td>
            <td class="bo-data-table__col--secondary bo-u-tabular">${due}</td>
            <td><span class="bo-badge${t ? ` bo-badge--${t}` : ''}">${status}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
`,
  });
