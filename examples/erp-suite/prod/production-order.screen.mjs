import { page } from '../_shell.mjs';

/* Where PREDICTION 2 gets tested (ledger, 2026-08-24): the MRP panel.

   The reference showed checkboxes configuring a derived action — "Get Raw
   Materials For Production" / "Download Required Materials". GAP-8's settled
   answer is that a transform's effect belongs in the PRIMARY BUTTON LABEL
   rather than in a separate statement, so the prediction was that this needs
   no new surface.

   Built that way to find out. The options are a real fieldset (they change
   what the action DOES, so they are inputs, not chrome), and the button says
   what will happen rather than naming a feature. What the panel does NOT get
   is a separate "this will do X" sentence — that is precisely the surface
   GAP-8 refused, and if the screen reads fine without it the prediction
   holds. */
const materials = [
  ['SRS-0071', 'Seal ring set', '80', '80', '0', 'ok'],
  ['BRZ-0900', 'Bronze billet', '32', '18', '14', 'short'],
  ['MNT-1180', 'Mounting plate', '40', '40', '0', 'ok'],
  ['FST-0042', 'Fastener kit', '160', '0', '160', 'none'],
];

const tone = { ok: ['bo-badge--success', 'Available'], short: ['bo-badge--warning', 'Part only'], none: ['bo-badge--danger', 'None'] };

export const render = () =>
  page({
    title: 'PRO-3310',
    description:
      'Production order PRO-3310 for the PMP-4400 pump assembly: material requirement, shortfall, and what to raise for it.',
    moduleId: 'prod',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Production', href: '/prod/production-orders.html' },
      { label: 'Production orders', href: '/prod/production-orders.html' },
      { label: 'PRO-3310' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">PRO-3310 · Pump assembly PMP-4400</h1>
        <span class="bo-badge bo-badge--warning">Material short</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Quantity</dt><dd><span class="bo-u-tabular">40</span> ea</dd></div>
          <div><dt>BOM</dt><dd><a href="/prod/bom.html">PMP-4400 rev C</a></dd></div>
          <div><dt>Planned start</dt><dd><span class="bo-u-tabular">2026-09-07</span></dd></div>
          <div><dt>Due</dt><dd><span class="bo-u-tabular">2026-09-21</span></dd></div>
          <div><dt>Work centre</dt><dd>Assembly line 2</dd></div>
        </dl>
      </div>
    </header>

    <h2>Material requirement</h2>
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Materials required against stock on hand</caption>
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--numeric">Required</th>
            <th scope="col" class="bo-data-table__col--numeric">On hand</th>
            <th scope="col" class="bo-data-table__col--numeric">Shortfall</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${materials
            .map(
              ([code, desc, req, have, short, t]) => `<tr>
            <td class="bo-data-table__col--code">${code}</td>
            <td class="bo-u-text-truncate">${desc}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${req}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${have}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular"${t !== 'ok' ? ' data-tone="warning" data-tone-text' : ''}>${short}${t !== 'ok' ? '<span class="bo-visually-hidden"> — short</span>' : ''}</td>
            <td><span class="bo-badge ${tone[t][0]}">${tone[t][1]}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="4" class="bo-data-table__col--right">Lines short</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">2</td>
            <td></td>
          </tr>
        </tfoot>
      </table>
    </div>

    <h2>Raise the shortfall</h2>
    <!-- GAP-8's answer under test: the options are real inputs because they
         change what the action does, and the BUTTON LABEL states the effect.
         No separate "this will create N purchase requisitions" sentence —
         that is the surface GAP-8 refused. -->
    <form class="bo-form-section">
      <fieldset>
        <legend>What to include</legend>
        <div class="bo-stack bo-stack--tight">
          <label class="bo-choice"><input type="checkbox" class="bo-checkbox" checked> Items with no stock at all</label>
          <label class="bo-choice"><input type="checkbox" class="bo-checkbox" checked> Items partly covered</label>
          <label class="bo-choice"><input type="checkbox" class="bo-checkbox"> Sub-assemblies we make ourselves</label>
        </div>
      </fieldset>
      <div class="bo-form-actions">
        <button class="bo-btn" type="button">Create 2 purchase requisitions</button>
        <button class="bo-btn bo-btn--secondary" type="button">Export the shortfall as CSV</button>
      </div>
    </form>

    <h2>Document flow</h2>
    <ol class="bo-timeline">
      <li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <p class="bo-timeline__title">Sales order — <a href="/o2c/sales-order.html">SO-51204</a></p>
        <p class="bo-timeline__meta">Confirmed 2026-08-28</p>
      </li>
      <li class="bo-timeline__step" data-state="current" aria-current="step">
        <span class="bo-timeline__marker" aria-hidden="true">●</span>
        <p class="bo-timeline__title">Production order — PRO-3310 <span class="bo-badge">you are here</span></p>
        <p class="bo-timeline__meta">Short on 2 of 4 materials</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Purchase requisitions</p>
        <p class="bo-timeline__meta">Not raised yet</p>
      </li>
      <li class="bo-timeline__step" data-state="pending">
        <span class="bo-timeline__marker" aria-hidden="true">○</span>
        <p class="bo-timeline__title">Goods receipt</p>
        <p class="bo-timeline__meta">Blocks the build start</p>
      </li>
    </ol>
`,
  });
