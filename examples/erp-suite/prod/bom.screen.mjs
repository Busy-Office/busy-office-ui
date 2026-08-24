import { page } from '../_shell.mjs';

/* MODULE FOUR, screen one — and the first genuine HIERARCHY in the suite.
   A bill of materials is a tree with quantities that multiply down it: the
   seal ring is 2 per impeller, the impeller is 1 per pump, so building 40
   pumps needs 80 seal rings. Two numeric columns say that — per-parent and
   total-required — and the second is the one a planner reads.

   Predicted (ledger, 2026-08-24) as part of Production's 2-4 gaps. Built to
   find out whether `tree-table` carries it, since its own docs demo is a
   pump-assembly BOM. */
const lines = [
  [1, 'PMP-4400', 'Pump assembly', '1', '40', 'ea', 'Make', true],
  [2, 'IMP-2210', 'Impeller, bronze', '1', '40', 'ea', 'Make', true],
  [3, 'SRS-0071', 'Seal ring set', '2', '80', 'ea', 'Buy', false],
  [3, 'BRZ-0900', 'Bronze billet', '0.8', '32', 'kg', 'Buy', false],
  [2, 'MNT-1180', 'Mounting plate', '1', '40', 'ea', 'Buy', false],
  [2, 'FST-0042', 'Fastener kit', '4', '160', 'ea', 'Buy', false],
];

export const render = () =>
  page({
    title: 'BOM — PMP-4400',
    moduleId: 'prod',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Production', href: '/prod/production-orders.html' },
      { label: 'Bills of material', href: '/prod/bom.html' },
      { label: 'PMP-4400' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>BOM — PMP-4400 · Pump assembly</h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">+ New BOM</button>
        <button class="bo-btn bo-btn--secondary bo-btn--icon" type="button" aria-label="Refresh"><span class="bo-icon bo-icon--settings" aria-hidden="true"></span></button>
      </div>
    </div>
    <p class="bo-u-text-muted">Quantities multiply down the tree. <strong>Per
    parent</strong> is what the engineering drawing says; <strong>total
    required</strong> is that figure against this order's 40 units, and it is
    the column a planner actually reads.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-tree-table">
        <caption class="bo-visually-hidden">Bill of materials, indented by assembly level</caption>
        <thead>
          <tr>
            <th scope="col">Component</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--numeric">Per parent</th>
            <th scope="col" class="bo-data-table__col--numeric">Total required</th>
            <th scope="col" class="bo-data-table__col--secondary">UoM</th>
            <th scope="col">Source</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(
              ([lvl, code, desc, per, total, uom, src, hasKids]) => `<tr data-tree-level="${lvl}">
            <td class="bo-data-table__col--code">${
              hasKids
                ? `<button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="${desc}"></button>${code}`
                : `<span class="bo-tree-table__spacer"></span>${code}`
            }</td>
            <td class="bo-u-text-truncate">${desc}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary bo-u-tabular">${per}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${total}</td>
            <td class="bo-data-table__col--secondary">${uom}</td>
            <td><span class="bo-badge${src === 'Make' ? ' bo-badge--accent' : ''}">${src}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Release to production</button>
      <button class="bo-btn bo-btn--secondary" type="button">Compare revisions</button>
    </div>
`,
  });
