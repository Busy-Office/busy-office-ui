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

    <h2>Document flow</h2>
    <!-- GAP-2's decided shape, second independent use — the reusability test
         the Objective sets (>=2 real compositions). Same chain, different
         position in it: this screen is the invoice, so the PO is done above
         and the payment is pending below. Note the LAST step is a document in
         another module (Finance), which is exactly the cross-module link the
         suite is for — and it stays a plain step, not a special case. -->
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Purchase order — <a href="/p2p/purchase-order.html">PO-88213</a></p>
        <p class="bo-timeline__meta">Pending approval · $44,560.00</p>
      </li>
      <!-- GAP-14 again, on the second screen — which is what makes it a gap
           rather than one screen's awkwardness. -->
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">◐</span>
        <p class="bo-timeline__title">Goods receipt — <a href="/p2p/purchase-orders.html">GR-4471</a></p>
        <p class="bo-timeline__meta">Partial — 1 of 2 lines received</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Vendor invoice — INV-55710 <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Blocked · price variance $1,240.00 over the PO</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Journal entry — Finance</p>
        <p class="bo-timeline__meta">Created on release · not yet posted</p>
      </li>
    </ol>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Release for payment</button>
      <button class="bo-btn bo-btn--secondary" type="button">Request credit note</button>
      <button class="bo-btn bo-btn--ghost" type="button">Send back to vendor</button>
    </div>
`,
  });
