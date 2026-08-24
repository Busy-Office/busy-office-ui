import { page } from '../_shell.mjs';

/* The pipeline. A third list shape: not documents by date and not master
   data by exposure, but records grouped by STAGE, where the interesting
   number is weighted value — what the pipeline is worth after probability.
   That is a computed column no other module has needed. */
const rows = [
  ['OPP-2201', 'Halden Marine AS', 'Deck refit 2027', 'Proposal', '60', '420,000.00', '252,000.00', 'warning'],
  ['OPP-2214', 'Nordkapp Offshore', 'Riser spares frame', 'Qualification', '25', '180,000.00', '45,000.00', ''],
  ['OPP-2220', 'Brightline Rail', 'Coupling replacement', 'Negotiation', '80', '96,000.00', '76,800.00', 'success'],
  ['OPP-2231', 'Meridian Foods', 'Hygiene retrofit', 'Discovery', '10', '54,000.00', '5,400.00', ''],
];

export const render = () =>
  page({
    title: 'Opportunities',
    moduleId: 'crm',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'CRM', href: '/crm/accounts.html' },
      { label: 'Opportunities' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Opportunities</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--ghost bo-btn--icon" type="button" aria-label="Refresh opportunities">⟳</button>
        <button class="bo-btn" type="button">+ New opportunity</button>
      </div>
    </div>
    <p class="bo-u-text-muted">The pipeline, by stage. Weighted value is
    value × probability — the only figure worth adding up, which is why it
    carries the total.</p>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Advance stage</button>
          <button class="bo-btn bo-btn--secondary" type="button">Mark lost</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">Q4 · 4 open</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Open opportunities by stage with weighted value</caption>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col">Opportunity</th>
            <th scope="col">Account</th>
            <th scope="col" class="bo-data-table__col--secondary">Name</th>
            <th scope="col">Stage</th>
            <th scope="col" class="bo-data-table__col--numeric">Prob.</th>
            <th scope="col" class="bo-data-table__col--numeric">Value</th>
            <th scope="col" class="bo-data-table__col--numeric">Weighted</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, acct, name, stage, prob, val, weighted, tone]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"></td>
            <td class="bo-data-table__col--code"><a class="bo-data-table__cell-link" href="/crm/opportunity.html">${no}</a></td>
            <td class="bo-u-text-truncate">${acct}</td>
            <td class="bo-data-table__col--secondary bo-u-text-truncate">${name}</td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${stage}</span></td>
            <td class="bo-data-table__col--numeric bo-u-tabular">${prob}%</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${val}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${weighted}</span></span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="6" class="bo-data-table__col--right">Weighted pipeline</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">750,000.00</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">379,200.00</span></span></td>
          </tr>
        </tfoot>
      </table>
    </div>
`,
  });
