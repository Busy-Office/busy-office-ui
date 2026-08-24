import { page } from '../_shell.mjs';

/* MODULE THREE, and the first one that is NOT a document. 130.3's checkpoint
   said the remaining modules are mechanical — that claim is only worth
   testing against a shape the suite has never built, so CRM leads with
   MASTER DATA. A customer is not a transaction: it has no posting date, no
   approval, no document flow, and it is never "done". What it has instead is
   a set of relationships and a running financial position.

   The list therefore sorts by something a document list never has: how much
   of our money the row is currently holding. */
const rows = [
  ['ACC-1042', 'Halden Marine AS', 'Bergen, NO', 'Key account', '24,520.00', 'Within limit', 'success'],
  ['ACC-1077', 'Cobalt Works Ltd', 'Sheffield, UK', 'Key account', '98,200.00', 'Credit hold', 'danger'],
  ['ACC-1105', 'Brightline Rail', 'Derby, UK', 'Standard', '9,050.00', 'Within limit', 'success'],
  ['ACC-1130', 'Meridian Foods', 'Cork, IE', 'Standard', '4,540.00', 'Review due', 'warning'],
  ['ACC-1166', 'Nordkapp Offshore', 'Tromsø, NO', 'Prospect', '0.00', 'No terms yet', ''],
];

export const render = () =>
  page({
    title: 'Accounts',
    moduleId: 'crm',
    trail: [{ label: 'Home', href: '/index.html' }, { label: 'CRM', href: '/crm/accounts.html' }, { label: 'Accounts' }],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Accounts</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--ghost bo-btn--icon" type="button" aria-label="Refresh accounts">⟳</button>
        <button class="bo-btn" type="button">+ New account</button>
      </div>
    </div>
    <p class="bo-u-text-muted">Customer master data. The decision this screen
    serves is who to call, so the columns are the ones that change what you
    would say — exposure and credit standing, not address detail.</p>

    <form class="bo-cluster" method="get" data-density="compact">
      <div class="bo-segmented" role="group" aria-label="Saved views">
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="cv-all" value="all" checked>
        <label class="bo-segmented__option" for="cv-all">All <span class="bo-u-text-muted bo-u-tabular">412</span></label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="cv-key" value="key">
        <label class="bo-segmented__option" for="cv-key">Key accounts <span class="bo-u-text-muted bo-u-tabular">38</span></label>
        <input class="bo-segmented__input bo-visually-hidden" type="radio" name="view" id="cv-hold" value="hold">
        <label class="bo-segmented__option" for="cv-hold">On hold <span class="bo-u-text-muted bo-u-tabular">3</span></label>
      </div>
      <button class="bo-btn bo-btn--secondary" type="submit">Go</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
          <button class="bo-btn bo-btn--secondary" type="button">Assign owner</button>
          <button class="bo-btn bo-btn--secondary" type="button">Schedule review</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">412 accounts</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Customer accounts with exposure and credit standing</caption>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col">Account</th>
            <th scope="col">Name</th>
            <th scope="col" class="bo-data-table__col--secondary">Location</th>
            <th scope="col">Tier</th>
            <th scope="col" class="bo-data-table__col--numeric">Open exposure</th>
            <th scope="col">Credit</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, name, loc, tier, exp, credit, tone]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"></td>
            <td class="bo-data-table__col--code"><a class="bo-data-table__cell-link" href="/crm/account.html">${no}</a></td>
            <td class="bo-u-text-truncate">${name}</td>
            <td class="bo-data-table__col--secondary">${loc}</td>
            <td>${tier}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${exp}</span></span></td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${credit}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
`,
  });
