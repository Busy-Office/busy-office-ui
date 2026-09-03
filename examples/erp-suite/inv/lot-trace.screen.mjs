import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "lot genealogy is the likeliest real
   gap in the set." It is the screen a recall runs on, and it is the one shape
   in this suite that is genuinely NOT a tree.

   A lot family is a DAG. LOT-A9F4 was blended from two supplier lots and went
   into three finished batches, one of which was reworked back into a fourth.
   Two facts follow, and neither is a rendering detail:

   - A node can have MORE THAN ONE PARENT. `bo-tree-table`'s `data-tree-level`
     encodes depth, which assumes exactly one path to each node. A blended lot
     has two, so one of them has to be duplicated or dropped.
   - The question is asked in BOTH directions. "What went into this?" and
     "where did this end up?" are the same edges read opposite ways, and a
     recall asks the second one.

   Built anyway, with `bo-tree-table` downward only, because the honest way to
   size a gap is to build up to it. What that costs is stated in the screen
   itself rather than in a note nobody reads: the second parent of LOT-A9F4
   appears as its own root, and the two rows carrying the same lot are marked
   so a reader is not left to notice the duplication for themselves.

   The recorded finding is NOT "add a graph component". It is narrower: the
   framework has no way to say "this row is the same entity as that row", and
   that shortfall would show up anywhere a DAG is flattened — a where-used
   BOM explosion has it too. Whether that earns surface is a separate call. */

/* [level, lot, item, qty, date, note, dup] — levels are 1-BASED, per the
   component's own contract ("Rows carry data-tree-level='1..12'"). Read from
   the CSS rather than assumed: a first pass used 0 and 1 and rendered flat,
   because level 1 is the un-indented root and there is no rule for 0. */
const rows = [
  [1, 'LOT-A9F4', 'Hydraulic fluid, blended', '2,400 L', '12 Aug 2026', 'Subject of recall RC-118', false],
  [2, 'SUP-77120', 'Base oil — Norvik', '1,800 L', '04 Aug 2026', 'Supplier lot, GRN-9921', false],
  [2, 'SUP-77340', 'Additive pack — Kestrel', '600 L', '06 Aug 2026', 'Supplier lot, GRN-9944', false],
  [1, 'BATCH-5501', 'Pump assembly, 24V', '120 ea', '18 Aug 2026', 'Shipped to Halden Marine AS', false],
  [2, 'LOT-A9F4', 'Hydraulic fluid, blended', '900 L', '12 Aug 2026', 'Same lot as the root above', true],
  [1, 'BATCH-5502', 'Pump assembly, 24V', '80 ea', '19 Aug 2026', 'Shipped to Norvik Shipping', false],
  [2, 'LOT-A9F4', 'Hydraulic fluid, blended', '640 L', '12 Aug 2026', 'Same lot as the root above', true],
  [1, 'BATCH-5507', 'Pump assembly, 24V (rework)', '40 ea', '24 Aug 2026', 'Reworked from BATCH-5501 returns', false],
  [2, 'BATCH-5501', 'Pump assembly, 24V', '40 ea', '18 Aug 2026', 'Same batch as the root above', true],
];

export const render = () =>
  page({
    title: 'Lot trace',
    description:
      'Lot genealogy for LOT-A9F4 under recall RC-118 — the components it consumed and the batches it went on to build.',
    moduleId: 'inv',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Inventory', href: '/inv/stock-on-hand.html' },
      { label: 'LOT-A9F4' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>LOT-A9F4 <span class="bo-badge bo-badge--danger">Recall RC-118</span></h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">Block affected stock</button>
        <button class="bo-btn bo-btn--secondary" type="button">Export trace</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Hydraulic fluid, blended · 2,400 L made
    12 Aug 2026 · 240 pump assemblies affected across three customers. Read
    down for what went into a lot, and across the roots for where it ended up.</p>

    <div class="bo-alert bo-alert--warning" role="status">
      <p class="bo-alert__title">A lot family is not a tree</p>
      <p>LOT-A9F4 was blended from two supplier lots and consumed by three
      batches, so it appears four times below — once as a root and three times
      as a component. Rows marked <span class="bo-badge">repeat</span> are the
      <em>same</em> lot, not another one; adding their quantities would
      double-count. This is a limitation of showing a graph as an indented
      list, and it is stated here rather than left for a reader to spot during
      a recall.</p>
    </div>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-tree-table">
        <caption class="bo-visually-hidden">Lot genealogy for LOT-A9F4, components and consuming batches</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Lot / batch</th>
            <th scope="col">Item</th>
            <th scope="col" class="bo-data-table__col--numeric">Quantity</th>
            <th scope="col">Date</th>
            <th scope="col">Note</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([level, lot, item, qty, date, note, dup]) => `<tr data-tree-level="${level}">
            <th scope="row" class="bo-data-table__col--code">${level > 1 ? '<span class="bo-tree-table__spacer"></span>' : ''}${lot}${dup ? ' <span class="bo-badge">repeat</span>' : ''}</th>
            <td>${item}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${qty}</td>
            <td class="bo-u-tabular">${date}</td>
            <td>${note}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <p class="bo-u-text-muted">The rework line is where an indented list hurts
    most: BATCH-5507 was made from BATCH-5501's returns, so BATCH-5501 is both
    a root and a component of a later root. The list can show that twice; it
    cannot show that it is one thing.</p>
`,
  });
