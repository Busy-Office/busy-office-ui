import { page, MODULES } from './_shell.mjs';

/* Suite home. The `suite-home` PATTERN is the model: not a bare tile grid
   (that is `app-launch`), but status first — what is waiting on you across
   modules — with every module one click away. */
export const render = () =>
  page({
    title: 'Home',
    moduleId: 'home',
    body: `
    <h1>Good morning, Jamie</h1>

    <div class="bo-widget-grid" style="--bo-widget-min: 15rem">
      <section class="bo-widget">
        <div class="bo-widget__header"><span class="bo-widget__title">Waiting on you</span></div>
        <div class="bo-widget__body">
          <span class="bo-stat">
            <span class="bo-stat__value">7</span>
            <span class="bo-stat__delta">4 approvals · 2 receipts · 1 exception</span>
          </span>
        </div>
      </section>

      <section class="bo-widget bo-widget--span-2">
        <div class="bo-widget__header"><span class="bo-widget__title">Across your modules</span></div>
        <div class="bo-widget__body">
          <ul class="bo-stack bo-stack--tight" role="list">
            <li><span class="bo-badge bo-badge--warning">Procure to pay</span>
              <a href="/p2p/purchase-order.html">PO-88213</a> waiting on cost-center approval · 2 days</li>
            <li><span class="bo-badge bo-badge--danger">Procure to pay</span>
              <a href="/p2p/vendor-invoice.html">INV-55710</a> price variance over tolerance</li>
            <li><span class="bo-badge">Inventory</span> Stock count WH-2 finishes today</li>
          </ul>
        </div>
      </section>
    </div>

    <h2>Modules</h2>
    <div class="bo-widget-grid" style="--bo-widget-min: 12rem">
      ${MODULES.filter((m) => m.id !== 'home')
        .map(
          (m) => `<section class="bo-widget">
        <div class="bo-widget__header"><span class="bo-widget__title">${m.label}</span></div>
        <div class="bo-widget__body"><a href="${m.href}">Open ${m.label}</a></div>
      </section>`,
        )
        .join('\n      ')}
    </div>
`,
  });
