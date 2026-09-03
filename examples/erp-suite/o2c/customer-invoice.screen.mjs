import { page } from '../_shell.mjs';

/* The document at the end of O2C. Its decision is not "is this correct" — the
   three-way match already answered that on the buying side — it is "what do I
   do about money that has not arrived". So the screen leads with the age of
   the debt and carries the chasing history, which is the one thing the pilot
   never modelled: a sequence of ACTIONS TAKEN rather than a lifecycle. */
export const render = () =>
  page({
    title: 'INV-70318',
    description:
      'Customer invoice INV-70318 to Cobalt Works Ltd, with the chasing history against it and the document flow it sits in.',
    moduleId: 'o2c',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Order to cash', href: '/o2c/sales-orders.html' },
      { label: 'Customer invoices', href: '/o2c/customer-invoices.html' },
      { label: 'INV-70318' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">INV-70318 · Cobalt Works Ltd</h1>
        <span class="bo-badge bo-badge--danger">74 days overdue</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Issued</dt><dd><span class="bo-u-tabular">2026-06-04</span></dd></div>
          <div><dt>Due</dt><dd><span class="bo-u-tabular">2026-06-11</span> · Net 7</dd></div>
          <div><dt>Invoiced</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">44,200<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Received</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">0<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Outstanding</dt><dd><span class="bo-amount bo-amount--negative"><span class="bo-amount__currency">$</span><span class="bo-amount__value">44,200<span class="bo-amount__fraction">.00</span></span></span></dd></div>
        </dl>
      </div>
    </header>

    <h2>Chasing history</h2>
    <!-- Not the document flow: this is what WE DID, in order, and the next
         step is a decision rather than a document. bo-timeline carries both
         because both are an ordered chain with state — the distinction lives
         in the heading, which is exactly what /patterns/object-page says to
         do when a screen shows two timelines. -->
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Reminder 1 sent</p>
        <p class="bo-timeline__meta">2026-06-18 · automatic · no reply</p>
      </li>
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Reminder 2 sent</p>
        <p class="bo-timeline__meta">2026-07-02 · automatic · customer disputed 1 line</p>
      </li>
      <li class="bo-timeline__step" data-state="rejected">
        <span class="bo-timeline__marker" aria-hidden="true">!</span>
        <p class="bo-timeline__title">Dispute raised — line 20, quantity</p>
        <p class="bo-timeline__meta">2026-07-03 · credit note not yet agreed</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Awaiting your decision <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Escalate to collections, or issue the credit note and settle</p>
      </li>
    </ol>

    <h2>Document flow</h2>
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Sales order — <a href="/o2c/sales-order.html">SO-51171</a></p>
        <p class="bo-timeline__meta">Confirmed 2026-05-28</p>
      </li>
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Delivery — DN-8841</p>
        <p class="bo-timeline__meta">Shipped 2026-06-02 · signed for</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Customer invoice — INV-70318 <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Unpaid · 74 days past due</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Payment — Finance</p>
        <p class="bo-timeline__meta">Nothing received</p>
      </li>
    </ol>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Escalate to collections</button>
      <button class="bo-btn bo-btn--secondary" type="button">Issue credit note</button>
      <button class="bo-btn bo-btn--ghost" type="button">Record a promise to pay</button>
    </div>
`,
  });
