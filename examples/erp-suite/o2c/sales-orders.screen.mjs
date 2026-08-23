import { page } from '../_shell.mjs';

/* MODULE TWO, screen one (roadmap 130.3). Deliberately the same SHAPE as
   p2p/purchase-orders — a document list — because that is what makes it a
   measurement: if the second module needs new surface to build a list, the
   framework has a hole; if it does not, lists are settled.

   Two things here are 130.2's answers being spent rather than re-decided:
   the order number is a `bo-data-table__cell-link` (135.3b) so a touch user
   can open the row, and the saved-view counts are muted tabular text inside
   the segmented options (GAP-3), not badges. */
const rows = [
  ['SO-51204', 'Halden Marine AS', '2026-09-02', '84,300.00', 'Awaiting stock', 'warning'],
  ['SO-51198', 'Brightline Rail', '2026-08-30', '19,450.00', 'Confirmed', 'success'],
  ['SO-51186', 'Halden Marine AS', '2026-08-29', '6,120.00', 'Shipped', 'success'],
  ['SO-51171', 'Cobalt Works Ltd', '2026-08-27', '132,900.00', 'Credit hold', 'danger'],
  ['SO-51150', 'Brightline Rail', '2026-08-24', '2,780.00', 'Invoiced', ''],
  ['SO-51132', 'Meridian Foods', '2026-08-22', '45,010.00', 'Invoiced', ''],
];

export const render = () =>
  page({
    title: 'Sales orders',
    moduleId: 'o2c',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Order to cash', href: '/o2c/sales-orders.html' },
      { label: 'Sales orders' },
    ],
    body: `
    <h1>Sales orders</h1>

    <form class="bo-cluster" method="get" data-density="compact">
      <div class="bo-segmented" role="group" aria-label="Saved views">
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-open" value="open" checked>
        <label class="bo-segmented__option" for="v-open">Open <span class="bo-u-text-muted bo-u-tabular">184</span></label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-hold" value="hold">
        <label class="bo-segmented__option" for="v-hold">On hold <span class="bo-u-text-muted bo-u-tabular">7</span></label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-ship" value="ship">
        <label class="bo-segmented__option" for="v-ship">Ready to ship <span class="bo-u-text-muted bo-u-tabular">23</span></label>
      </div>
      <button class="bo-btn bo-btn--secondary" type="submit">Go</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Confirm</button>
          <button class="bo-btn bo-btn--secondary" type="button">Release to warehouse</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">214 orders</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Open sales orders</caption>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col" aria-sort="descending"><button class="bo-data-table__sort-btn" type="button">Order #</button></th>
            <th scope="col">Customer</th>
            <th scope="col" class="bo-data-table__col--secondary">Requested</th>
            <th scope="col" class="bo-data-table__col--numeric">Value</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, cust, req, val, status, tone]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"></td>
            <td class="bo-data-table__col--code"><a class="bo-data-table__cell-link" href="/o2c/sales-order.html">${no}</a></td>
            <td class="bo-u-text-truncate">${cust}</td>
            <td class="bo-data-table__col--secondary bo-u-tabular">${req}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${val}</span></span></td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${status}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
`,
  });
