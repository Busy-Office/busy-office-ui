import { page } from '../_shell.mjs';

/* Document screen, modelled on the `object-page` pattern: header facts +
   status, the lines, the approval trail, and the actions.
   Two gaps surfaced writing this one — both recorded in
   .roundtable/erp-suite-gaps.md, both visible below as a comment where the
   markup had to compromise. */
const lines = [
  ['10', 'ABC-10924', 'Hex bolt M8 × 40, zinc', '2,400', 'ea', '0.42', '1,008.00'],
  ['20', 'ABC-11002', 'Hex nut M8, zinc', '2,400', 'ea', '0.18', '432.00'],
  ['30', 'STL-4410', 'Steel plate 3mm, 1m × 2m', '60', 'sheet', '412.00', '24,720.00'],
  ['40', 'PKG-0910', 'Pallet, heat-treated', '120', 'ea', '18.00', '2,160.00'],
];

export const render = () =>
  page({
    title: 'PO-88213',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/purchase-orders.html' },
      { label: 'Purchase orders', href: '/p2p/purchase-orders.html' },
      { label: 'PO-88213' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">PO-88213 · Northwind Supply</h1>
        <span class="bo-badge bo-badge--warning">Pending approval</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Vendor</dt><dd>Northwind Supply · V-2049</dd></div>
          <div><dt>Cost center</dt><dd><span class="bo-u-tabular">CC-4021</span></dd></div>
          <div><dt>Needed by</dt><dd><span class="bo-u-tabular">2026-08-28</span></dd></div>
          <div><dt>Order value</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">48,200<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Buyer</dt><dd>M. Osei</dd></div>
          <div><dt>Payment terms</dt><dd>Net 30</dd></div>
        </dl>
      </div>
    </header>

    <h2>Lines</h2>
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Item</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--numeric">Qty</th>
            <th scope="col" class="bo-data-table__col--tertiary">UoM</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Unit price</th>
            <th scope="col" class="bo-data-table__col--numeric">Line total</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(
              ([no, item, desc, qty, uom, price, total]) => `<tr>
            <td class="bo-u-tabular">${no}</td>
            <td class="bo-data-table__col--code">${item}</td>
            <td class="bo-u-text-truncate">${desc}</td>
            <td class="bo-data-table__col--numeric">${qty}</td>
            <td class="bo-data-table__col--tertiary">${uom}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${price}</td>
            <td class="bo-data-table__col--numeric">${total}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <h2>Related documents</h2>
    <!-- GAP-2. A document screen's whole job is to say what this document is
         connected to: the requisition it came from, the receipts against it,
         the invoices matched to it. The framework has NO surface for this —
         no component, no pattern, not a line of guidance. Rendered here as a
         hand-rolled kv list, which is the wrong shape: these are navigable
         records with their own status, not facts about this one. -->
    <dl class="bo-kv bo-kv--rows">
      <div><dt>Requisition</dt><dd><a href="/p2p/purchase-orders.html">REQ-40118</a> · approved</dd></div>
      <div><dt>Goods receipts</dt><dd><a href="/p2p/purchase-orders.html">GR-4471</a> · partial, 1 of 2</dd></div>
      <div><dt>Vendor invoices</dt><dd><a href="/p2p/vendor-invoice.html">INV-55710</a> · <span class="bo-badge bo-badge--danger">price variance</span></dd></div>
    </dl>

    <h2>Approval</h2>
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Submitted by M. Osei</p>
        <p class="bo-timeline__meta">2026-08-21 09:14</p>
      </li>
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Budget check passed</p>
        <p class="bo-timeline__meta">2026-08-21 09:14 · automatic</p>
      </li>
      <li class="bo-timeline__step" data-state="current">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Cost-center approval — R. Meyer</p>
        <p class="bo-timeline__meta">waiting 2 days</p>
      </li>
      <li class="bo-timeline__step">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Send to vendor</p>
      </li>
    </ol>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Approve</button>
      <button class="bo-btn bo-btn--secondary" type="button">Reject</button>
      <button class="bo-btn bo-btn--ghost" type="button">Print</button>
    </div>
`,
  });
