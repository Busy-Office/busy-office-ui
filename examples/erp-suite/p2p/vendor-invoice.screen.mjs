import { page } from '../_shell.mjs';

/* The screen the whole pilot was worth building for: three-way match.
   An AP clerk compares what was ORDERED, what was RECEIVED and what is being
   BILLED, line by line, and decides. The `comparison` pattern is about
   choosing between options; `reconciliation` is about two sides of a ledger.
   Neither is three columns of the same line. See GAP-4. */
const match = [
  ['10', 'Hex bolt M8 × 40', '2,400', '2,400', '2,400', '0.42', '0.42', 'ok'],
  ['20', 'Hex nut M8', '2,400', '2,400', '2,400', '0.18', '0.18', 'ok'],
  ['30', 'Steel plate 3mm', '60', '60', '60', '412.00', '424.00', 'price'],
  ['40', 'Pallet, heat-treated', '120', '80', '120', '18.00', '18.00', 'qty'],
];

const verdict = {
  ok: ['bo-badge--success', 'Matched'],
  price: ['bo-badge--danger', 'Price +2.9%'],
  qty: ['bo-badge--warning', 'Billed > received'],
};

export const render = () =>
  page({
    title: 'INV-55710',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/purchase-orders.html' },
      { label: 'Vendor invoices', href: '/p2p/vendor-invoices.html' },
      { label: 'INV-55710' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">INV-55710 · Northwind Supply</h1>
        <span class="bo-badge bo-badge--danger">Blocked — price variance</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Against</dt><dd><a href="/p2p/purchase-order.html">PO-88213</a></dd></div>
          <div><dt>Invoice date</dt><dd><span class="bo-u-tabular">2026-08-22</span></dd></div>
          <div><dt>Due</dt><dd><span class="bo-u-tabular">2026-09-21</span> · Net 30</dd></div>
          <div><dt>Invoiced</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">48,940<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Ordered</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">48,200<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Difference</dt><dd><span class="bo-amount bo-amount--negative"><span class="bo-amount__currency">$</span><span class="bo-amount__value">740<span class="bo-amount__fraction">.00</span></span></span></dd></div>
        </dl>
      </div>
    </header>

    <h2>Three-way match</h2>
    <!-- GAP-4. Ordered / received / billed is THREE readings of one line, and
         the reader's job is to spot where they disagree. Rendered as a wide
         flat table, because the framework has no surface for a grouped
         (two-row) column header, and nothing that marks WHICH cell in a row
         is the one that disagrees. The verdict badge at the end is a summary
         the reader must map back to a column by eye — exactly the manual
         step this screen exists to remove. -->
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item</th>
            <th scope="col" class="bo-data-table__col--numeric">Qty ordered</th>
            <th scope="col" class="bo-data-table__col--numeric">Qty received</th>
            <th scope="col" class="bo-data-table__col--numeric">Qty billed</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Price ordered</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Price billed</th>
            <th scope="col">Verdict</th>
          </tr>
        </thead>
        <tbody>
          ${match
            .map(
              ([no, item, qo, qr, qb, po, pb, v]) => `<tr${v === 'ok' ? '' : ' data-row-state="warning"'}>
            <td class="bo-u-tabular">${no}</td>
            <td class="bo-u-text-truncate">${item}</td>
            <td class="bo-data-table__col--numeric">${qo}</td>
            <td class="bo-data-table__col--numeric">${qr}</td>
            <td class="bo-data-table__col--numeric">${qb}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${po}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${pb}</td>
            <td><span class="bo-badge ${verdict[v][0]}">${verdict[v][1]}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <h2>Related documents</h2>
    <dl class="bo-kv bo-kv--rows">
      <div><dt>Purchase order</dt><dd><a href="/p2p/purchase-order.html">PO-88213</a> · pending approval</dd></div>
      <div><dt>Goods receipt</dt><dd><a href="/p2p/purchase-orders.html">GR-4471</a> · partial, 1 of 2</dd></div>
      <div><dt>Posts to</dt><dd>Finance · journal entry (created on release)</dd></div>
    </dl>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Release for payment</button>
      <button class="bo-btn bo-btn--secondary" type="button">Request credit note</button>
      <button class="bo-btn bo-btn--ghost" type="button">Send back to vendor</button>
    </div>
`,
  });
