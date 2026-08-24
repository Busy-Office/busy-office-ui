import { page } from '../_shell.mjs';

/* PREDICTION 1 UNDER TEST (ledger, 2026-08-24): "intensity over a long date
   grid is a real gap."

   A planner needs to see which weeks are over-committed across a quarter.
   That is load per work-centre per week — a matrix whose cells carry a
   MAGNITUDE, not a status.

   Built with only shipped surface, deliberately, to find out whether the
   claim holds. What exists: `--sticky-col` pins the work-centre names while
   the weeks scroll, `data-tone` gives THREE steps (default / warning /
   danger), and `bo-u-tabular` keeps the numbers aligned. What does not
   exist: any way to say "62%" as a continuous shade — `scales.json` has the
   eleven-step ramp but ships no `bo-scale` utility to apply it.

   So the honest result is a THREE-BUCKET screen, not a heatmap. The number
   in every cell is the second channel, which the two-channel rule requires
   regardless — and which is why the loss is smaller than it first looked. */
const weeks = ['W36', 'W37', 'W38', 'W39', 'W40', 'W41', 'W42', 'W43'];

/* load %, and the bucket it falls in. Three buckets is what the framework
   can express today; the underlying number is what the planner reads. */
const rows = [
  ['Assembly line 1', [72, 81, 96, 104, 88, 61, 55, 49]],
  ['Assembly line 2', [58, 64, 79, 118, 126, 92, 70, 66]],
  ['Machining cell', [90, 94, 88, 83, 77, 102, 111, 85]],
  ['Paint booth', [41, 38, 52, 60, 55, 47, 44, 40]],
  ['Test rig', [66, 70, 68, 74, 91, 99, 86, 72]],
];

const bucket = (n) => (n > 100 ? 'danger' : n > 85 ? 'warning' : '');
const note = (n) => (n > 100 ? ' — over capacity' : n > 85 ? ' — near capacity' : '');

export const render = () =>
  page({
    title: 'Capacity',
    moduleId: 'prod',
    trail: [{ label: 'Home', href: '/index.html' }, { label: 'Production', href: '/prod/production-orders.html' }, { label: 'Capacity' }],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Capacity — Q4</h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">+ New production order</button>
        <button class="bo-btn bo-btn--secondary bo-btn--icon" type="button" aria-label="Refresh"><span class="bo-icon bo-icon--settings" aria-hidden="true"></span></button>
      </div>
    </div>
    <p class="bo-u-text-muted">Load per work centre per week, as a percentage
    of available hours. The decision this screen serves is what to move, so
    the weeks over 100% have to be findable at a glance — and the figure is in
    every cell, because a colour on its own would not say by how much.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-data-table--sticky-col">
        <caption class="bo-visually-hidden">Work centre load by week, percentage of available hours</caption>
        <thead>
          <tr>
            <th scope="col">Work centre</th>
            ${weeks.map((w) => `<th scope="col" class="bo-data-table__col--numeric">${w}</th>`).join('\n            ')}
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([centre, load]) => `<tr>
            <th scope="row">${centre}</th>
            ${load
              .map((n) => {
                const b = bucket(n);
                return `<td class="bo-data-table__col--numeric bo-u-tabular"${b ? ` data-tone="${b}" data-tone-text` : ''}>${n}%${b ? `<span class="bo-visually-hidden">${note(n)}</span>` : ''}</td>`;
              })
              .join('\n            ')}
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Level the overloaded weeks</button>
      <button class="bo-btn bo-btn--secondary" type="button">Add a shift to line 2</button>
    </div>
`,
  });
