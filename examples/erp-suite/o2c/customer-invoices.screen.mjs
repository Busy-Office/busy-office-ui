import { page } from '../_shell.mjs';

/* Module two's SECOND document type, and deliberately not another flat list:
   a receivables screen is read as AGEING — how much is overdue, and by how
   long — so the columns are buckets and the decision is "who do I chase".
   That is a shape the pilot never built, which is the point of module two.

   It also carries a totals row, which nothing in the pilot had: the
   data-table docs document `<tfoot>` plus `--col--numeric`, so this is the
   first time that documentation is spent on a real screen. */
const rows = [
  ['Halden Marine AS', '18,400.00', '6,120.00', '0.00', '0.00', '0.00', '24,520.00', ''],
  ['Cobalt Works Ltd', '0.00', '12,900.00', '44,200.00', '31,700.00', '9,400.00', '98,200.00', 'danger'],
  ['Brightline Rail', '9,050.00', '0.00', '0.00', '0.00', '0.00', '9,050.00', ''],
  ['Meridian Foods', '2,780.00', '1,120.00', '640.00', '0.00', '0.00', '4,540.00', 'warning'],
];

const money = (v) =>
  `<span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${v}</span></span>`;

export const render = () =>
  page({
    title: 'Customer invoices',
    description:
      'Outstanding customer invoices summarised as receivables by customer and days overdue, rather than as a flat document list.',
    moduleId: 'o2c',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Order to cash', href: '/o2c/sales-orders.html' },
      { label: 'Customer invoices' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Customer invoices</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--secondary" type="button">Export</button>
        <button class="bo-btn bo-btn--ghost bo-btn--icon" type="button" aria-label="Refresh customer invoices">⟳</button>
        <button class="bo-btn" type="button">+ New customer invoice</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Receivables by age. The decision this screen
    serves is who to chase first, so the buckets are the columns and the
    oldest money is the one that stands out.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Send reminder</button>
          <button class="bo-btn bo-btn--secondary" type="button">Put on credit hold</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">as at 2026-08-24</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Receivables ageing by customer</caption>
        <thead>
          <tr>
            <th scope="col" rowspan="2"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col" rowspan="2">Customer</th>
            <th scope="colgroup" colspan="5">Days overdue</th>
            <th scope="col" rowspan="2" class="bo-data-table__col--numeric">Total</th>
          </tr>
          <tr>
            <th scope="col" class="bo-data-table__col--numeric">Current</th>
            <th scope="col" class="bo-data-table__col--numeric">1–30</th>
            <th scope="col" class="bo-data-table__col--numeric">31–60</th>
            <th scope="col" class="bo-data-table__col--numeric">61–90</th>
            <th scope="col" class="bo-data-table__col--numeric">90+</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([cust, c, b1, b2, b3, b4, total, tone]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${cust}"></td>
            <td><a class="bo-data-table__cell-link" href="/o2c/customer-invoice.html">${cust}</a></td>
            <td class="bo-data-table__col--numeric">${c}</td>
            <td class="bo-data-table__col--numeric">${b1}</td>
            <td class="bo-data-table__col--numeric">${b2}</td>
            <td class="bo-data-table__col--numeric"${tone === 'danger' ? ' data-tone="danger" data-tone-text' : ''}>${b3}${tone === 'danger' ? '<span class="bo-visually-hidden"> — overdue over 60 days</span>' : ''}</td>
            <td class="bo-data-table__col--numeric"${tone === 'danger' ? ' data-tone="danger" data-tone-text' : ''}>${b4}${tone === 'danger' ? '<span class="bo-visually-hidden"> — overdue over 90 days</span>' : ''}</td>
            <td class="bo-data-table__col--numeric">${money(total)}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="2" class="bo-data-table__col--right">Total outstanding</td>
            <td class="bo-data-table__col--numeric">30,230.00</td>
            <td class="bo-data-table__col--numeric">20,140.00</td>
            <td class="bo-data-table__col--numeric">44,840.00</td>
            <td class="bo-data-table__col--numeric">31,700.00</td>
            <td class="bo-data-table__col--numeric">9,400.00</td>
            <td class="bo-data-table__col--numeric">${money('136,310.00')}</td>
          </tr>
        </tfoot>
      </table>
    </div>
`,
  });
