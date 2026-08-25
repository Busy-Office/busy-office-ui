import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "a transfer is a document with TWO
   parties that are both internal, and the object-page shape assumes one."

   Every document the suite has built points outward — a PO has a vendor, an
   invoice has a customer. A stock transfer has a FROM and a TO, both of them
   the company's own locations, and the reader needs to see the pair as a pair.
   `bo-kv` renders facts as a list, which flattens "from" and "to" into two
   unrelated rows and loses the direction.

   Built with two `bo-widget` cards side by side in a `bo-widget-grid`, which
   is the closest shipped expression of "these two things are counterparts".
   What is not expressed is the ARROW — that the left one empties into the
   right one. A reader gets it from the headings, which may be enough; a
   dedicated from/to surface would be one component for one screen, which the
   Objective refuses without a second use. Recorded, not built. */

const lines = [
  ['MAT-4471', 'Hydraulic pump, 24V', 'ea', '12', 'A-14-3', 'L-02-1'],
  ['MAT-9002', 'Filter cartridge', 'ea', '40', 'A-09-2', 'L-02-1'],
  ['MAT-3390', 'Grease, lithium EP2', 'kg', '4', 'A-22-1', 'L-02-4'],
];

export const render = () =>
  page({
    title: 'Stock movement',
    moduleId: 'inv',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Inventory', href: '/inv/stock-on-hand.html' },
      { label: 'TR-2026-0338' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>TR-2026-0338 <span class="bo-badge bo-badge--accent">In transit</span></h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--secondary" type="button">Print pick list</button>
        <button class="bo-btn" type="button">Confirm receipt</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Internal transfer · raised 28 Sep 2026 by
    R. Vance · 3 lines. Stock left the source when it was picked and is not
    available at the destination until receipt is confirmed.</p>

    <div class="bo-widget-grid">
      <section class="bo-widget">
        <div class="bo-widget__header"><h2 class="bo-widget__title">From</h2></div>
        <div class="bo-widget__body">
          <dl class="bo-kv bo-kv--rows">
            <dt>Location</dt><dd>Main WH · Plant 1000</dd>
            <dt>Picked</dt><dd>28 Sep 2026, 14:20</dd>
            <dt>Picked by</dt><dd>R. Vance</dd>
          </dl>
        </div>
      </section>
      <section class="bo-widget">
        <div class="bo-widget__header"><h2 class="bo-widget__title">To</h2></div>
        <div class="bo-widget__body">
          <dl class="bo-kv bo-kv--rows">
            <dt>Location</dt><dd>Line-side · Assembly line 1</dd>
            <dt>Expected</dt><dd>29 Sep 2026</dd>
            <dt>Received</dt><dd><span class="bo-u-text-muted">Not yet received</span></dd>
          </dl>
        </div>
      </section>
    </div>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Transfer lines with source and destination bins</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Item</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--code">Unit</th>
            <th scope="col" class="bo-data-table__col--numeric">Quantity</th>
            <th scope="col" class="bo-data-table__col--code">From bin</th>
            <th scope="col" class="bo-data-table__col--code">To bin</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(
              ([item, desc, unit, qty, from, to]) => `<tr>
            <th scope="row" class="bo-data-table__col--code">${item}</th>
            <td>${desc}</td>
            <td class="bo-data-table__col--code">${unit}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${qty}</td>
            <td class="bo-data-table__col--code">${from}</td>
            <td class="bo-data-table__col--code">${to}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <p class="bo-u-text-muted">In-transit stock is the reason
    <a href="/inv/stock-on-hand.html">stock on hand</a> carries a column for
    it: the quantity exists and belongs to nobody's bin until this document is
    confirmed.</p>
`,
  });
