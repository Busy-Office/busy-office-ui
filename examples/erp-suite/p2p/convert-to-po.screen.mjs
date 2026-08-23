import { page } from '../_shell.mjs';

/* THE screen this whole sub-slice exists to test: N source documents become
   M new ones, by a grouping rule, with the reader able to leave lines out.
   Nothing in the 38 shipped patterns does this — bulk-actions acts ON the
   selection, wizard creates ONE thing from nothing, comparison chooses
   between options. Here the reader is previewing documents that do not exist
   yet, and the count on the button (2) is derived from a rule, not chosen.

   Three gaps hit building it — GAP-8, GAP-9, GAP-10 in the ledger. Each is
   marked below where the markup had to compromise. */

const groups = [
  {
    vendor: 'Northwind Supply',
    terms: 'Net 30',
    sources: ['REQ-40118', 'REQ-40122'],
    lines: [
      ['REQ-40118', '10', 'ABC-10924', 'Hex bolt M8 × 40, zinc', '2,400', '0.42', '1,008.00', true],
      ['REQ-40118', '20', 'ABC-11002', 'Hex nut M8, zinc', '2,400', '0.18', '432.00', true],
      ['REQ-40118', '30', 'STL-4410', 'Steel plate 3mm, 1m × 2m', '60', '412.00', '24,720.00', true],
      ['REQ-40122', '10', 'PKG-0910', 'Pallet, heat-treated', '120', '18.00', '2,160.00', false],
    ],
    total: '26,160.00',
  },
  {
    vendor: 'Ferrus Metals',
    terms: 'Net 45',
    sources: ['REQ-40130'],
    lines: [
      ['REQ-40130', '10', 'STL-2200', 'Steel angle 40×40, 6m', '200', '68.00', '13,600.00', true],
      ['REQ-40130', '20', 'STL-2210', 'Steel angle 50×50, 6m', '60', '80.00', '4,800.00', true],
    ],
    total: '18,400.00',
  },
];

const group = (g, i) => `
    <section class="bo-widget">
      <div class="bo-widget__header">
        <h2 class="bo-widget__title">Purchase order ${i + 1} of 2 · ${g.vendor}</h2>
        <span class="bo-badge">${g.terms}</span>
      </div>
      <div class="bo-widget__body">
        <!-- GAP-9. "These sources become this result" has no surface. The
             sources are the reason this group exists, and they are rendered
             as a kv row of links — the same wrong shape GAP-2 settled for,
             which is evidence the two are one need seen twice. -->
        <dl class="bo-kv">
          <div><dt>From</dt><dd>${g.sources
            .map((s) => `<a href="/p2p/requisition.html">${s}</a>`)
            .join(' · ')}</dd></div>
          <div><dt>Vendor</dt><dd>${g.vendor}</dd></div>
          <div><dt>Order value</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${g.total.slice(0, -3)}<span class="bo-amount__fraction">${g.total.slice(-3)}</span></span></span></dd></div>
        </dl>
      </div>
      <div class="bo-data-table-container" tabindex="0" data-density="compact">
        <table class="bo-data-table">
          <thead>
            <tr>
              <th scope="col"><input type="checkbox" class="bo-checkbox" aria-label="Include all lines from ${g.vendor}" checked></th>
              <th scope="col" class="bo-data-table__col--tertiary">Source</th>
              <th scope="col">#</th>
              <th scope="col">Item</th>
              <th scope="col" class="bo-data-table__col--secondary">Description</th>
              <th scope="col" class="bo-data-table__col--numeric">Qty</th>
              <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Unit price</th>
              <th scope="col" class="bo-data-table__col--numeric">Line total</th>
            </tr>
          </thead>
          <tbody>
            ${g.lines
              .map(
                /* GAP-11. An excluded line renders IDENTICALLY to an
                   included one — the only difference is the checkbox.
                   data-row-state ships dirty / error / warning, all of them
                   PROBLEM states; "deliberately left out" is not a problem
                   and has no cue. On a 40-line conversion the reader cannot
                   see at a glance what they are dropping. */
                ([src, no, item, desc, qty, price, total, include]) => `<tr>
              <td><input type="checkbox" class="bo-checkbox" aria-label="Include ${item} from ${src}"${
                include ? ' checked' : ''
              }></td>
              <td class="bo-data-table__col--tertiary bo-data-table__col--code">${src}</td>
              <td class="bo-u-tabular">${no}</td>
              <td class="bo-data-table__col--code">${item}</td>
              <td class="bo-data-table__col--secondary bo-u-text-truncate">${desc}</td>
              <td class="bo-data-table__col--numeric">${qty}</td>
              <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${price}</td>
              <td class="bo-data-table__col--numeric">${total}</td>
            </tr>`,
              )
              .join('\n            ')}
          </tbody>
        </table>
      </div>
    </section>`;

export const render = () =>
  page({
    title: 'Create purchase orders',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/requisitions.html' },
      { label: 'Requisitions', href: '/p2p/requisitions.html' },
      { label: 'Create purchase orders' },
    ],
    body: `
    <h1>Create purchase orders</h1>

    <!-- GAP-8. The transform statement — "3 requisitions become 2 purchase
         orders, grouped by vendor" — is the single most important sentence on
         this screen, and it is plain prose in an alert because nothing
         renders a source→result summary. A reader who misreads it creates
         the wrong number of documents, which is not recoverable by undo. -->
    <div class="bo-alert">
      <p><strong>3 requisitions → 2 purchase orders.</strong> Grouped by vendor,
      because a purchase order goes to exactly one vendor. Lines you leave out
      stay on their requisition and can be ordered later.</p>
    </div>

    ${groups.map(group).join('\n')}

    <!-- GAP-10. One line is excluded above, so this total and the button's
         count are both DERIVED — and both are hand-typed here, since the
         framework has no live-total surface and this example ships no JS.
         In a real build these must recompute as boxes are ticked; nothing in
         the docs says who owns that or how it is announced. -->
    <div class="bo-form-actions">
      <a class="bo-btn bo-btn--ghost" href="/p2p/requisitions.html">Back to requisitions</a>
      <button class="bo-btn bo-btn--secondary" type="button">Save as draft orders</button>
      <button class="bo-btn" type="button">Create 2 purchase orders · $44,560.00</button>
    </div>
`,
  });
