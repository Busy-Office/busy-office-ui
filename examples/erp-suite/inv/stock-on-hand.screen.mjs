import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): the SECOND half of the standing
   cross-tab claim. `ar-aging` settled the money case; this is the quantity
   case, item x location, which is the one the triage note actually named.

   Two things differ from aging and both are worth watching:

   - The cells are QUANTITIES with a unit, not money. A unit belongs to the
     item (each, metres, kg), so it varies down the column — which rules out
     putting it in the header and means either repeating it in every cell or
     giving the row a unit column of its own.
   - "Zero" and "no record" are different facts. A bin that has been counted
     and holds nothing is not a bin the item has never been stocked in, and a
     replenishment decision turns on which. An em-dash for one, a real 0 for
     the other. */

const locations = ['Main WH', 'Dock 4', 'Line-side', 'Quarantine', 'In transit'];

/* [item, description, unit, [qty per location], reorder point] */
const rows = [
  ['MAT-4471', 'Hydraulic pump, 24V', 'ea', ['48', '12', '6', '', '24'], 40],
  ['MAT-1180', 'Seal kit, 60 mm', 'ea', ['0', '', '0', '4', ''], 25],
  ['MAT-9002', 'Filter cartridge', 'ea', ['312', '40', '88', '', '150'], 100],
  ['MAT-2210', 'Hose, hydraulic 3/8"', 'm', ['1,240', '', '96', '', ''], 400],
  ['MAT-3390', 'Grease, lithium EP2', 'kg', ['18', '', '4', '2', ''], 30],
  ['MAT-5510', 'Coupling, quick-release', 'ea', ['6', '', '0', '', '60'], 20],
];

/* Availability is a property of the ROW, not of a cell: a bin holding 6 of an
   item is fine if the other bins hold 300. So the tone sits on the row total
   against its reorder point, and the cells stay plain — the opposite call to
   `capacity`, where every cell was independently over or under. */
const num = (s) => Number(String(s).replace(/,/g, '')) || 0;
const total = (qs) => qs.reduce((a, q) => a + (q === '' ? 0 : num(q)), 0);
const fmt = (n) => n.toLocaleString('en-US');

export const render = () =>
  page({
    title: 'Stock on hand',
    moduleId: 'inv',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Inventory', href: '/inv/stock-on-hand.html' },
      { label: 'Stock on hand' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Stock on hand</h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">+ Transfer</button>
        <button class="bo-btn bo-btn--secondary" type="button">Export</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Plant 1000 · as at 30 Sep 2026.
    <strong>A dash is not a zero</strong> — a dash means the item has never
    been stocked in that location, a 0 means it has and the bin is empty. The
    replenishment decision is different in each case.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-data-table--sticky-col">
        <caption class="bo-visually-hidden">Quantity on hand by item and location, against reorder point</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Item</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--code">Unit</th>
            ${locations.map((l) => `<th scope="col" class="bo-data-table__col--numeric">${l}</th>`).join('\n            ')}
            <th scope="col" class="bo-data-table__col--numeric">On hand</th>
            <th scope="col" class="bo-data-table__col--numeric">Reorder at</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(([item, desc, unit, qs, rop]) => {
              const t = total(qs);
              const short = t < rop;
              return `<tr>
            <th scope="row" class="bo-data-table__col--code">${item}</th>
            <td>${desc}</td>
            <td class="bo-data-table__col--code">${unit}</td>
            ${qs
              .map(
                (q) =>
                  `<td class="bo-data-table__col--numeric bo-u-tabular">${q === '' ? '<span class="bo-u-text-muted">—</span>' : q}</td>`,
              )
              .join('\n            ')}
            <td class="bo-data-table__col--numeric bo-u-tabular"${short ? ' data-tone="danger" data-tone-text' : ''}><strong>${fmt(t)}</strong>${short ? '<span class="bo-visually-hidden"> — below reorder point</span>' : ''}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${fmt(rop)}</td>
          </tr>`;
            })
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <p class="bo-u-text-muted">Three items are below their reorder point, and
    the tone is on the row total rather than on any cell: six in one bin is
    not a problem when another holds three hundred. Quarantine and in-transit
    quantities are counted here because they exist — whether they are
    <em>available</em> is a different report.</p>
`,
  });
