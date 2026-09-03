import { page } from '../_shell.mjs';

/* MODULE TWO, the document screen. The one place O2C genuinely differs from
   P2P: a sales order can be PARTIALLY deliverable — some lines in stock, some
   not — and the decision the screen serves is "ship what we have, or wait".
   That is a per-line availability read, which is the same shape as the
   three-way match's grouped header (GAP-4a), so it is built with the same
   surface: a two-row header over Ordered / Available / Confirmed. */
const lines = [
  ['10', 'MRN-2210', 'Marine coupling 80mm', '120', '120', '120', '640.00', 'ok'],
  ['20', 'MRN-2255', 'Hose assembly, 6m', '40', '12', '12', '210.00', 'short'],
  ['30', 'MRN-3001', 'Anode kit', '60', '60', '60', '88.50', 'ok'],
  ['40', 'MRN-4120', 'Deck plate, coated', '15', '0', '0', '1,240.00', 'none'],
];

const avail = {
  ok: ['bo-badge--success', 'In stock'],
  short: ['bo-badge--warning', 'Part only'],
  none: ['bo-badge--danger', 'None'],
};

/* The cell that disagrees carries the tone, not the row — GAP-4b's answer,
   and its second independent use. The row stays untinted so the cell reads. */
const shortCell = (v) => (v === 'ok' ? '' : ' data-tone="warning" data-tone-text');
const shortNote = (v) => (v === 'ok' ? '' : '<span class="bo-visually-hidden"> — short</span>');

export const render = () =>
  page({
    title: 'SO-51204',
    description:
      'Sales order SO-51204 for Halden Marine AS: order lines with quantity ordered, quantity available and what was confirmed.',
    moduleId: 'o2c',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Order to cash', href: '/o2c/sales-orders.html' },
      { label: 'Sales orders', href: '/o2c/sales-orders.html' },
      { label: 'SO-51204' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">SO-51204 · Halden Marine AS</h1>
        <span class="bo-badge bo-badge--warning">Awaiting stock</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Customer PO</dt><dd><span class="bo-u-tabular">HM-2026-0417</span></dd></div>
          <div><dt>Requested</dt><dd><span class="bo-u-tabular">2026-09-02</span></dd></div>
          <div><dt>Incoterms</dt><dd>DAP Bergen</dd></div>
          <div><dt>Order value</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">84,300<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Credit</dt><dd><span class="bo-badge bo-badge--success">Within limit</span></dd></div>
        </dl>
      </div>
    </header>

    <h2>Lines and availability</h2>
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Order lines with quantity ordered, available and confirmed</caption>
        <thead>
          <tr>
            <th scope="col" rowspan="2">#</th>
            <th scope="col" rowspan="2">Item</th>
            <th scope="colgroup" colspan="3" class="bo-data-table__col--numeric">Quantity</th>
            <th scope="col" rowspan="2" class="bo-data-table__col--numeric">Unit price</th>
            <th scope="col" rowspan="2">Availability</th>
          </tr>
          <tr>
            <th scope="col" class="bo-data-table__col--numeric">Ordered</th>
            <th scope="col" class="bo-data-table__col--numeric">Available</th>
            <th scope="col" class="bo-data-table__col--numeric">Confirmed</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(
              ([no, item, desc, ord, av, conf, price, v]) => `<tr>
            <td class="bo-u-tabular">${no}</td>
            <td class="bo-data-table__col--code">${item}</td>
            <td class="bo-data-table__col--numeric">${ord}</td>
            <td class="bo-data-table__col--numeric"${shortCell(v)}>${av}${shortNote(v)}</td>
            <td class="bo-data-table__col--numeric">${conf}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${price}</td>
            <td><span class="bo-badge ${avail[v][0]}">${avail[v][1]}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="bo-cluster">
      <button class="bo-btn bo-btn--secondary" type="button">+ Add line</button>
    </div>

    <h2>Document flow</h2>
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Quotation — <a href="/o2c/sales-orders.html">QT-9042</a></p>
        <p class="bo-timeline__meta">Accepted 2026-08-19</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Sales order — SO-51204 <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Awaiting stock on 2 of 4 lines</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Delivery</p>
        <p class="bo-timeline__meta">Not created — a partial ship would create two</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Customer invoice</p>
        <p class="bo-timeline__meta">Raised on delivery</p>
      </li>
    </ol>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Confirm what is available</button>
      <button class="bo-btn bo-btn--secondary" type="button">Wait for full stock</button>
      <button class="bo-btn bo-btn--ghost" type="button">Send back to sales</button>
    </div>
`,
  });
