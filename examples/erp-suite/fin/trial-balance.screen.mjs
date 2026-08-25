import { page } from '../_shell.mjs';

/* PREDICTION UNDER TEST (roadmap 145.4): "a long numeric report needs nothing
   new."

   A trial balance is the plainest thing finance produces and the densest: every
   account, four money columns, and a grand total that must be zero. If the
   framework is complete for reports, this screen costs nothing to build. If it
   is not, the miss shows up here rather than in an argument.

   The TOTAL row needed nothing: `.bo-data-table tfoot :is(th, td)` already
   separates a summary from the rows it sums, with a rule above and heavier
   figures (roadmap 130.3). See journal-entry, where the opposite was predicted
   and the measurement corrected it.

   What is still true is narrower and worth recording: `--sticky-col` pins the
   account column horizontally, but nothing pins a footer row VERTICALLY. On a
   long report the grand total — the one row the reader came for — scrolls away
   with everything else. A sticky `<tfoot>` is a real ask; whether it belongs
   in a CSS framework or in the app that knows how long its report is, is not
   settled by one screen. Recorded, not worked around. */

const rows = [
  ['100100', 'Cash at bank', '412,880.00', '', '412,880.00', ''],
  ['110200', 'Trade receivables', '288,140.25', '', '288,140.25', ''],
  ['120300', 'Inventory — raw materials', '196,420.00', '', '196,420.00', ''],
  ['120400', 'Inventory — finished goods', '104,880.50', '', '104,880.50', ''],
  ['150100', 'Plant and equipment', '840,000.00', '', '840,000.00', ''],
  ['155100', 'Accumulated depreciation', '', '312,400.00', '', '312,400.00'],
  ['200100', 'Trade payables', '', '241,980.75', '', '241,980.75'],
  ['210300', 'Goods received not invoiced', '', '48,220.00', '', '48,220.00'],
  ['230100', 'VAT payable', '', '61,340.00', '', '61,340.00'],
  ['300100', 'Share capital', '', '500,000.00', '', '500,000.00'],
  ['310100', 'Retained earnings', '', '402,180.00', '', '402,180.00'],
  ['400100', 'Revenue — goods', '', '1,284,900.00', '', '1,284,900.00'],
  ['500100', 'Cost of goods sold', '742,180.00', '', '742,180.00', ''],
  ['610100', 'Freight in', '48,940.00', '', '48,940.00', ''],
  ['700100', 'Payroll', '228,560.00', '', '228,560.00', ''],
];

export const render = () =>
  page({
    title: 'Trial balance',
    moduleId: 'fin',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Finance', href: '/fin/journal-entry.html' },
      { label: 'Trial balance' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Trial balance</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--secondary" type="button">Export</button>
        <button class="bo-btn bo-btn--secondary" type="button">Print</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Ledger GL-01 · Period 09/2026 · in USD.
    Movement is the period; balance is cumulative. The grand total is the
    check — if it is not zero, something posted that should not have.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table bo-data-table--sticky-col bo-data-table--striped">
        <caption class="bo-visually-hidden">Trial balance by account, movement and closing balance</caption>
        <thead>
          <tr>
            <th scope="col" class="bo-data-table__col--code">Account</th>
            <th scope="col">Name</th>
            <th scope="col" class="bo-data-table__col--numeric">Movement Dr</th>
            <th scope="col" class="bo-data-table__col--numeric">Movement Cr</th>
            <th scope="col" class="bo-data-table__col--numeric">Balance Dr</th>
            <th scope="col" class="bo-data-table__col--numeric">Balance Cr</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([acct, name, mdr, mcr, bdr, bcr]) => `<tr>
            <th scope="row" class="bo-data-table__col--code">${acct}</th>
            <td>${name}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${mdr}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${mcr}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${bdr}</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${bcr}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row" colspan="2">Totals</th>
            <td class="bo-data-table__col--numeric bo-u-tabular">2,851,020.75</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">2,851,020.75</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">2,861,900.75</td>
            <td class="bo-data-table__col--numeric bo-u-tabular">2,861,900.75</td>
          </tr>
        </tfoot>
      </table>
    </div>

    <p class="bo-u-text-muted">Debits equal credits in both pairs, so the
    ledger is in balance. That is the whole job of this report, which is why
    the totals row is the one a reader looks at first and the one a scrolling
    table is most likely to hide.</p>
`,
  });
