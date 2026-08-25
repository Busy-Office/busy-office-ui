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

    <h2>Internal notes</h2>
    <!-- 144.2: a comment thread, composed — NOT a new component. bo-audit is
         the list, --discussion says its entries are content rather than small
         print, bo-byline is the author line (its own docs name "a comment"),
         bo-prose is the body, bo-composer is the write surface. The one thing
         that did not compose was the body's type size, which is why the
         modifier exists. -->
    <ol class="bo-audit bo-audit--discussion">
      <li class="bo-audit__entry">
        <span class="bo-audit__time"><time datetime="2026-08-20T09:12">20 Aug 09:12</time></span>
        <div class="bo-audit__detail">
          <span class="bo-byline"><strong>M. Osei</strong> · Requester</span>
          <div class="bo-prose"><p>Vendor confirmed the coupling is on a 3-week
          lead time. Asked whether we split the line and take 40 now.</p></div>
        </div>
      </li>
      <li class="bo-audit__entry">
        <span class="bo-audit__time"><time datetime="2026-08-20T11:40">20 Aug 11:40</time></span>
        <div class="bo-audit__detail">
          <span class="bo-byline"><strong>J. Kim</strong> · Cost-centre manager</span>
          <div class="bo-prose"><p>Split it. Budget is committed either way and
          the line stoppage costs more than the second delivery.</p></div>
        </div>
      </li>
      <li class="bo-audit__entry" data-state="resolved">
        <span class="bo-audit__time"><time datetime="2026-08-21T08:05">21 Aug 08:05</time></span>
        <div class="bo-audit__detail">
          <span class="bo-byline"><strong>M. Osei</strong> · Requester</span>
          <span class="bo-badge">Resolved</span>
          <div class="bo-prose"><p>Split raised as PO-88240 for the balance.</p></div>
        </div>
      </li>
      <li class="bo-audit__entry" data-visibility="external">
        <span class="bo-audit__time"><time datetime="2026-08-21T09:30">21 Aug 09:30</time></span>
        <div class="bo-audit__detail">
          <span class="bo-byline"><strong>M. Osei</strong> · Requester</span>
          <span class="bo-badge bo-badge--warning">External · sent to vendor</span>
          <div class="bo-prose"><p>Please confirm the revised delivery date for the
          40-unit first drop, and invoice the two drops separately.</p></div>
        </div>
      </li>
    </ol>

    <form class="bo-composer">
      <span class="bo-avatar bo-byline__avatar" aria-hidden="true">MO</span>
      <div class="bo-composer__body">
        <label class="bo-visually-hidden" for="po-note">Add a note</label>
        <textarea class="bo-input" id="po-note" rows="3"
                  placeholder="Visible to anyone who can see this order."></textarea>
        <div class="bo-composer__actions">
          <button class="bo-btn" type="button">Post note</button>
        </div>
      </div>
    </form>

    <h2>Document flow</h2>
    <!-- GAP-2 (merged with GAP-9), DECIDED 2026-08-23: bo-timeline, ordered by
         lifecycle, one step per document TYPE with that type's instances as
         links inside the step. No new component and no new CSS — which this
         file proves, because it may not add any.

         Why the chain and the related list are ONE surface: grouping the
         related documents by type in lifecycle order and marking the current
         one IS the chain. Rendered separately, the same records appear twice.

         Why not the kv list this replaced: a kv row is a FACT ABOUT this
         record; these are navigable records with their own state. Why not
         bo-stepper, which is also an ordered chain with a current step: it is
         horizontal and its steps each take an equal share of the row, so a
         step holding three invoice links breaks it — and a PO with several
         receipts is the normal case, not the edge one. Vertical stacking is
         the whole reason this fits. -->
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Requisition — <a href="/p2p/requisitions.html">REQ-40118</a></p>
        <p class="bo-timeline__meta">Approved 2026-08-19 · M. Osei</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Purchase order — PO-88213 <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Pending approval · $44,560.00</p>
      </li>
      <!-- GAP-14, found by rendering this: the step is PARTIAL and data-state
           has no word for it. "done" paints a green tick over "1 of 2", which
           is the screen telling a small lie; "pending" says nothing started.
           Compromised to pending + a half-filled marker, so the glyph carries
           what the state cannot — and logged rather than papered over. -->
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">◐</span>
        <p class="bo-timeline__title">Goods receipts — <a href="/p2p/purchase-orders.html">GR-4471</a>, <a href="/p2p/purchase-orders.html">GR-4472</a></p>
        <p class="bo-timeline__meta">Partial — 1 of 2 lines received</p>
      </li>
      <li class="bo-timeline__step" data-state="rejected">
        <span class="bo-timeline__marker" aria-hidden="true">!</span>
        <p class="bo-timeline__title">Vendor invoice — <a href="/p2p/vendor-invoice.html">INV-55710</a></p>
        <p class="bo-timeline__meta">Blocked · price variance $1,240.00 over the PO</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Payment</p>
        <p class="bo-timeline__meta">Not scheduled — the invoice block must clear first</p>
      </li>
    </ol>

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
