import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "dense numeric ENTRY with a computed
   variance is the densest data-input screen an ERP has, and the framework has
   only ever been tested on read-mostly tables."

   Everything the suite has built is a document or a report. This is neither:
   it is a worksheet. A counter walks a bin with a tablet, types a number per
   line, and the screen computes the variance as they go. The interesting part
   is that the SAME table is both input and output — the counted column is
   editable, the variance column is derived, and they sit side by side.

   What exists and is used here: `.bo-input--numeric` for right-aligned figures
   in a cell, `.bo-input--seamless` so a full-bordered box per row does not turn
   the table into a wall of rectangles, and `data-density="compact"` to fit a
   bin on one screen. `.bo-quantity` is deliberately NOT used — it pairs a
   number with a unit picker, and on a count the unit is fixed by the item.

   Watch for: whether a seamless input still reads as editable (an affordance
   the money page's own note calls out — "a bordered box says you can type
   here"), and whether the derived column can be told apart from the typed one
   at a glance. Those two pull in opposite directions and that tension is the
   finding. */

/* [item, description, unit, system, counted] — counted '' means not yet done */
const lines = [
  ['MAT-4471', 'Hydraulic pump, 24V', 'ea', 48, 48],
  ['MAT-1180', 'Seal kit, 60 mm', 'ea', 25, 21],
  ['MAT-9002', 'Filter cartridge', 'ea', 312, 312],
  ['MAT-2210', 'Hose, hydraulic 3/8"', 'm', 1240, 1252],
  ['MAT-3390', 'Grease, lithium EP2', 'kg', 18, ''],
  ['MAT-5510', 'Coupling, quick-release', 'ea', 6, ''],
];

const fmt = (n) => n.toLocaleString('en-US');

export const render = () =>
  page({
    title: 'Cycle count',
    moduleId: 'inv',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Inventory', href: '/inv/stock-on-hand.html' },
      { label: 'CC-2026-114' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>CC-2026-114 <span class="bo-badge bo-badge--accent">Counting</span></h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--secondary" type="button">Save progress</button>
        <button class="bo-btn" type="button" disabled aria-describedby="cc-remaining">Post adjustments</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Bin A-14-3 · Main WH · counter R. Vance ·
    started 09:42. Type the count you see, not the count you expect — the
    system figure is shown because hiding it makes reconciling harder, not
    because it is the answer.</p>

    <div class="bo-alert bo-alert--warning" role="status" id="cc-remaining">
      <p class="bo-alert__title">2 of 6 lines not yet counted</p>
      <p>Adjustments can be posted once every line has a count. Two lines
      already differ from the system figure and will raise a variance
      adjustment when posted.</p>
    </div>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Cycle count worksheet: system quantity, counted quantity and variance</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Item</th>
            <th scope="col">Description</th>
            <th scope="col" class="bo-data-table__col--code">Unit</th>
            <th scope="col" class="bo-data-table__col--numeric">System</th>
            <th scope="col" class="bo-data-table__col--numeric">Counted</th>
            <th scope="col" class="bo-data-table__col--numeric">Variance</th>
          </tr>
        </thead>
        <tbody>
          ${lines
            .map(([item, desc, unit, sys, got], i) => {
              const done = got !== '';
              const v = done ? got - sys : null;
              const tone = v ? 'danger' : '';
              /* No data-row-state for an uncounted line: the framework defines
                 dirty / error / warning and "pending" is none of them, so the
                 attribute matched no CSS and did nothing. The empty input and
                 the em-dash variance already say the line is not done
                 (roadmap 147.1 — found when the suite entered check-markup). */
              return `<tr>
            <th scope="row" class="bo-data-table__col--code">${item}</th>
            <td>${desc}</td>
            <td class="bo-data-table__col--code">${unit}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${fmt(sys)}</td>
            <td class="bo-data-table__col--numeric">
              <label class="bo-visually-hidden" for="c-${i}">Counted quantity for ${item}</label>
              <input class="bo-input bo-input--numeric bo-input--seamless" id="c-${i}"
                     type="text" inputmode="numeric" value="${done ? fmt(got) : ''}"
                     placeholder="—">
            </td>
            <td class="bo-data-table__col--numeric bo-u-tabular"${tone ? ` data-tone="${tone}" data-tone-text` : ''}>${
              done
                ? v === 0
                  ? '<span class="bo-u-text-muted">0</span>'
                  : `${v > 0 ? '+' : ''}${fmt(v)}<span class="bo-visually-hidden"> — variance against system</span>`
                : '<span class="bo-u-text-muted">—</span>'
            }</td>
          </tr>`;
            })
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="3">Counted</th>
            <td class="bo-data-table__col--numeric bo-u-tabular">4 of 6</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">1,633</td>
            <td class="bo-data-table__col--numeric bo-u-tabular" data-tone="danger" data-tone-text>+8</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p class="bo-u-text-muted">A net variance of +8 hides two errors pointing
    opposite ways — four short on seal kits, twelve over on hose. That is why
    the line variances are shown and the net is not the number anyone acts on.</p>
`,
  });
