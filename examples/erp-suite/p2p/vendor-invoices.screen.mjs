import { page } from '../_shell.mjs';

/* The second document type in the module. Deliberately NOT a copy of the PO
   list with different words: an invoice list's job is triage — which of these
   can I pay — so it leads with the exception (match status), not the value. */
const rows = [
  ['INV-55710', 'Northwind Supply', 'PO-88213', '48,940.00', 'Price variance', 'danger'],
  ['INV-55702', 'Ferrus Metals', 'PO-88198', '12,940.00', 'Matched', 'success'],
  ['INV-55698', 'Kite Logistics', 'PO-88164', '3,180.50', 'Matched', 'success'],
  ['INV-55671', 'Aalto Plastics', '—', '2,405.00', 'No PO', 'warning'],
  ['INV-55640', 'Northwind Supply', 'PO-88140', '27,015.00', 'Awaiting receipt', 'warning'],
];

export const render = () =>
  page({
    title: 'Vendor invoices',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/purchase-orders.html' },
      { label: 'Vendor invoices' },
    ],
    body: `
    <h1>Vendor invoices</h1>

    <!-- GAP-3. This list is a triage queue: the reader wants "show me only
         what is blocked". That is a saved view / segmented filter over the
         SAME list, which list-report now documents (127.4) — but the counts
         beside each view are the load-bearing part and nothing in the
         framework renders a count inside a segmented option. Written as
         plain text inside the label, which is what a consumer will copy. -->
    <form class="bo-cluster" method="get" data-density="compact">
      <div class="bo-segmented" role="group" aria-label="Saved views">
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-all" value="all" checked>
        <label class="bo-segmented__option" for="v-all">All open · 128</label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-block" value="blocked">
        <label class="bo-segmented__option" for="v-block">Blocked · 9</label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="v-mine" value="mine">
        <label class="bo-segmented__option" for="v-mine">Mine · 14</label>
      </div>
      <button class="bo-btn bo-btn--secondary" type="submit">Go</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <thead>
          <tr>
            <th scope="col">Invoice #</th>
            <th scope="col">Vendor</th>
            <th scope="col" class="bo-data-table__col--secondary">Against</th>
            <th scope="col" class="bo-data-table__col--numeric">Amount</th>
            <th scope="col">Match status</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, vendor, po, amount, status, tone]) => `<tr${tone === 'danger' ? ' data-row-state="error"' : ''}>
            <td class="bo-data-table__col--code"><a href="/p2p/vendor-invoice.html">${no}</a></td>
            <td class="bo-u-text-truncate">${vendor}</td>
            <td class="bo-data-table__col--secondary bo-data-table__col--code">${
              po === '—' ? '—' : `<a href="/p2p/purchase-order.html">${po}</a>`
            }</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${amount.slice(0, -3)}<span class="bo-amount__fraction">${amount.slice(-3)}</span></span></span></td>
            <td><span class="bo-badge bo-badge--${tone}">${status}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
`,
  });
