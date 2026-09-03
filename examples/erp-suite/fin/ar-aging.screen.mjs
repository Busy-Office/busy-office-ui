import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST — and this one is a STANDING prediction the ledger
   already made and never proved (roadmap 145.4): "`--sticky-col` plus
   `data-tone` already cover a cross-tab, so Inventory's stock-by-location and
   Finance's aging need nothing new."

   That claim was made ONCE, in triage, to justify dropping two modules. It has
   never been built. This screen exists to settle it.

   An aging report is a cross-tab whose cells carry MONEY, not a magnitude:
   customer x bucket, read along a row to find who owes what and how late.
   The difference from `capacity` — the other cross-tab, which carries load
   percentages — is that here the row TOTAL is what a collections clerk acts
   on, and the buckets are ordered by severity rather than by time-of-reading.

   Watch for: whether tone on a money cell reads as "this figure is bad" or as
   "this figure is highlighted", and whether the pinned first column survives a
   row header that is a customer NAME rather than a short code. */

const buckets = ['Current', '1–30', '31–60', '61–90', '90+'];

/* [customer, [current, 1-30, 31-60, 61-90, 90+], total] */
const rows = [
  ['Halden Marine AS', ['48,200.00', '12,400.00', '', '', ''], '60,600.00'],
  ['Norvik Shipping', ['18,900.00', '9,120.50', '4,800.00', '', ''], '32,820.50'],
  ['Baltic Freight Ltd', ['', '22,140.00', '18,600.00', '11,200.00', ''], '51,940.00'],
  ['Acme Supply Co.', ['96,400.00', '', '', '', ''], '96,400.00'],
  ['Kestrel Engineering', ['', '', '6,400.00', '14,880.00', '28,900.00'], '50,180.00'],
  ['Meridian Plant Hire', ['4,120.00', '', '', '', '9,640.00'], '13,760.00'],
];

/* Severity is the BUCKET, not the amount: $500 at 90+ days is a collections
   problem and $90,000 current is not. Only the two worst buckets carry tone —
   toning every non-empty cell would say everything is urgent, which says
   nothing. */
const tone = (i) => (i === 4 ? 'danger' : i === 3 ? 'warning' : '');
const says = (i) => (i === 4 ? ' — over 90 days' : i === 3 ? ' — 61 to 90 days' : '');

export const render = () =>
  page({
    title: 'AR aging',
    description:
      'Receivables aging: every customer against the current, 1-30, 31-60, 61-90 and 90-plus day buckets, with totals.',
    moduleId: 'fin',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Finance', href: '/fin/journal-entry.html' },
      { label: 'AR aging' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Receivables aging</h1>
      <div class="bo-cluster">
        <button class="bo-btn" type="button">Send reminders</button>
        <button class="bo-btn bo-btn--secondary" type="button">Export</button>
      </div>
    </div>
    <p class="bo-u-text-muted">As at 30 Sep 2026 · in USD. The decision this
    screen serves is who to chase today, so the two oldest buckets carry a tone
    and the rest do not — a figure is urgent because of the column it sits in,
    not because of its size.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-data-table--sticky-col">
        <caption class="bo-visually-hidden">Receivables by customer and aging bucket, in US dollars</caption>
        <thead>
          <tr>
            <th scope="col">Customer</th>
            ${buckets.map((b) => `<th scope="col" class="bo-data-table__col--numeric">${b}</th>`).join('\n            ')}
            <th scope="col" class="bo-data-table__col--numeric">Total</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([name, cells, total]) => `<tr>
            <th scope="row">${name}</th>
            ${cells
              .map((v, i) => {
                const t = v ? tone(i) : '';
                return `<td class="bo-data-table__col--numeric bo-u-tabular"${t ? ` data-tone="${t}" data-tone-text` : ''}>${v || '<span class="bo-u-text-muted">—</span>'}${t ? `<span class="bo-visually-hidden">${says(i)}</span>` : ''}</td>`;
              })
              .join('\n            ')}
            <td class="bo-data-table__col--numeric bo-u-tabular"><strong>${total}</strong></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">All customers</th>
            <td class="bo-data-table__col--numeric bo-u-tabular">167,620.00</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">43,660.50</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">29,800.00</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">26,080.00</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">38,540.00</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">305,700.50</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p class="bo-u-text-muted">Kestrel Engineering is the one to open first:
    it is the only account with money in both of the oldest buckets, which a
    single total would have hidden.</p>
`,
  });
