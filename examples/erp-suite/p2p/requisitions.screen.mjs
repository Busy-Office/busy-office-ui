import { page } from '../_shell.mjs';

/* The SOURCE list for a conversion: the reader selects requisitions and acts
   on the selection to create something ELSE. That is not what a list screen
   normally does — bulk-actions approves or rejects the rows themselves — and
   the difference shows up in the toolbar, where the action names its OUTPUT
   ("Create purchase orders") rather than its effect on these rows. */
const rows = [
  ['REQ-40118', 'Northwind Supply', 'M. Osei', 'CC-4021', '3', '25,608.00', 'Approved', 'success'],
  ['REQ-40122', 'Northwind Supply', 'M. Osei', 'CC-4021', '1', '2,160.00', 'Approved', 'success'],
  ['REQ-40130', 'Ferrus Metals', 'L. Bianchi', 'CC-1180', '2', '18,400.00', 'Approved', 'success'],
  ['REQ-40131', 'Aalto Plastics', 'L. Bianchi', 'CC-1180', '4', '6,740.00', 'Pending approval', 'warning'],
  ['REQ-40140', 'Ferrus Metals', 'R. Meyer', 'CC-2205', '1', '980.00', 'Draft', ''],
];

export const render = () =>
  page({
    title: 'Requisitions',
    description:
      'Purchase requisitions with vendor, requester, cost centre, line count, value and where each one sits in approval.',
    moduleId: 'p2p',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'Procure to pay', href: '/p2p/requisitions.html' },
      { label: 'Requisitions' },
    ],
    body: `
    <div class="bo-cluster bo-cluster--split">
      <h1>Requisitions</h1>
      <div class="bo-cluster">
        <button class="bo-btn bo-btn--ghost bo-btn--icon" type="button" aria-label="Refresh requisitions">⟳</button>
        <button class="bo-btn" type="button">+ New requisition</button>
      </div>
    </div>

    <form class="bo-cluster" data-density="compact">
      <input class="bo-input" type="search" aria-label="Search requisitions" placeholder="Search…" style="max-inline-size: 12rem">
      <select class="bo-select" aria-label="Status filter">
        <option>Approved — ready to order</option><option>All statuses</option><option>Pending approval</option><option>Draft</option>
      </select>
      <button class="bo-btn bo-btn--secondary" type="button">Apply</button>
    </form>

    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <div class="bo-data-table__toolbar">
        <div class="bo-data-table__bulk-actions" role="group" aria-label="Actions on selected requisitions">
          <!-- The action names its OUTPUT, not its effect on these rows.
               "Approve" changes the selection; "Create purchase orders"
               produces different documents and leaves these ones behind. -->
          <a class="bo-btn" href="/p2p/convert-to-po.html">Create purchase orders</a>
          <button class="bo-btn bo-btn--secondary" type="button">Reject</button>
        </div>
        <span class="bo-data-table__selection-count"></span>
        <span class="bo-u-text-muted">42 requisitions</span>
      </div>
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Requisitions with vendor, requester, value and status</caption>
        <thead>
          <tr>
            <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
            <th scope="col">Requisition</th>
            <th scope="col">Vendor</th>
            <th scope="col" class="bo-data-table__col--tertiary">Requested by</th>
            <th scope="col" class="bo-data-table__col--tertiary">Cost center</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Lines</th>
            <th scope="col" class="bo-data-table__col--numeric">Value</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${rows
            .map(
              ([no, vendor, who, cc, lines, value, status, tone]) => `<tr>
            <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${no}"${
              tone === 'success' ? ' checked' : ''
            }></td>
            <td class="bo-data-table__col--code"><a href="/p2p/requisition.html">${no}</a></td>
            <td class="bo-u-text-truncate">${vendor}</td>
            <td class="bo-data-table__col--tertiary">${who}</td>
            <td class="bo-data-table__col--tertiary bo-data-table__col--code">${cc}</td>
            <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${lines}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${value.slice(0, -3)}<span class="bo-amount__fraction">${value.slice(-3)}</span></span></span></td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${status}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
`,
  });
