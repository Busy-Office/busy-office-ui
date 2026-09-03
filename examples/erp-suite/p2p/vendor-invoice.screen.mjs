import { page } from '../_shell.mjs';

/* The screen the whole pilot was worth building for: three-way match.
   An AP clerk compares what was ORDERED, what was RECEIVED and what is being
   BILLED, line by line, and decides. The `comparison` pattern is about
   choosing between options; `reconciliation` is about two sides of a ledger.
   Neither is three columns of the same line. See GAP-4. */
/* The 8th field is the verdict; the 9th names WHICH column disagrees, so the
   tone lands on that cell rather than on the whole row (GAP-4b). */
const match = [
  ['10', 'Hex bolt M8 × 40', '2,400', '2,400', '2,400', '0.42', '0.42', 'ok', null],
  ['20', 'Hex nut M8', '2,400', '2,400', '2,400', '0.18', '0.18', 'ok', null],
  ['30', 'Steel plate 3mm', '60', '60', '60', '412.00', '424.00', 'price', 'pb'],
  ['40', 'Pallet, heat-treated', '120', '80', '120', '18.00', '18.00', 'qty', 'qb'],
];

/* GAP-4b RESOLVED 2026-08-24: the cue is data-tone on the CELL, which the
   framework already ships — the gap looked at data-row-state (a ROW marker)
   and missed it. Slice 124's own guideline says data-tone must not be the
   only channel, since both its tint and its leading bar are colour; so the
   disagreeing cell also carries a visually-hidden word. Two channels on the
   cell itself, plus the verdict badge saying what kind of disagreement it is
   — and the reader no longer maps a badge back to a column by eye.

   The row-level data-row-state="warning" is GONE, and removing it was not
   tidying: measured with it in place, the toned cell's computed fill was
   rgb(255,251,235) — byte-identical to its untoned neighbours, because the
   row tint IS the warning tint. A cell cue inside a toned row marks nothing.
   That is Slice 124's guideline arriving from a new direction: tone stops
   working the moment it is applied to everything in view. */
const disagrees = (v, col, key) =>
  v === col ? ' data-tone="warning" data-tone-text' : '';
const disagreeNote = (v, col) =>
  v === col ? '<span class="bo-visually-hidden"> — disagrees</span>' : '';

const verdict = {
  ok: ['bo-badge--success', 'Matched'],
  price: ['bo-badge--danger', 'Price +2.9%'],
  qty: ['bo-badge--warning', 'Billed > received'],
};

export const render = () =>
  page({
    title: 'INV-55710',
    description:
      'Vendor invoice INV-55710 from Northwind Supply, matched three ways against what was ordered and what was received.',
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
    <!-- GAP-4a FIXED 2026-08-23, and this screen is what found it. Ordered /
         received / billed is THREE readings of one line, so they belong under
         one heading — plain table semantics, no class and no modifier. What
         was broken underneath: every thead th sticks at 0, so with two header
         rows the second pinned ON TOP of the first and "Quantity" vanished
         entirely while scrolling. Each header row now offsets by
         --bo-density-row-height.
         GAP-4b is still open: nothing marks WHICH cell in a row disagrees, so
         the verdict badge at the end is still a summary the reader maps back
         to a column by eye. -->
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Vendor invoice lines matched against the purchase order</caption>
        <thead>
          <tr>
            <th scope="col" rowspan="2">#</th>
            <th scope="col" rowspan="2">Item</th>
            <th scope="colgroup" colspan="3" class="bo-data-table__col--numeric">Quantity</th>
            <th scope="colgroup" colspan="2" class="bo-data-table__col--numeric bo-data-table__col--secondary">Unit price</th>
            <th scope="col" rowspan="2">Verdict</th>
          </tr>
          <tr>
            <th scope="col" class="bo-data-table__col--numeric">Ordered</th>
            <th scope="col" class="bo-data-table__col--numeric">Received</th>
            <th scope="col" class="bo-data-table__col--numeric">Billed</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Ordered</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Billed</th>
          </tr>
        </thead>
        <tbody>
          ${match
            .map(
              ([no, item, qo, qr, qb, po, pb, v, col]) => `<tr>
            <td class="bo-u-tabular">${no}</td>
            <td class="bo-u-text-truncate">${item}</td>
            <td class="bo-data-table__col--numeric">${qo}</td>
            <td class="bo-data-table__col--numeric">${qr}</td>
            <td class="bo-data-table__col--numeric"${disagrees(col, 'qb')}>${qb}${disagreeNote(col, 'qb')}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${po}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary"${disagrees(col, 'pb')}>${pb}${disagreeNote(col, 'pb')}</td>
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
