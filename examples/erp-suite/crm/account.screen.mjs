import { page } from '../_shell.mjs';

/* THE MASTER RECORD, and the shape the suite has not built before. Every
   document screen so far ends in a document flow: an ordered chain with a
   "you are here". A master record has no such chain — it is never finished,
   and its history is not a lifecycle but a LEDGER of things that happened
   TO it.

   So this screen is deliberately not object-page-with-a-timeline. It is:
   identity, the running position, the relationships, and the open items.
   What that costs the framework is recorded in the gap ledger. */
const contacts = [
  ['Ingrid Halden', 'Purchasing manager', 'ingrid.halden@example.no', 'Primary'],
  ['Ola Nyström', 'Accounts payable', 'ap@example.no', ''],
  ['Marte Lie', 'Site engineer', 'm.lie@example.no', ''],
];

const openItems = [
  ['SO-51204', 'Sales order', '2026-09-02', '84,300.00', 'Awaiting stock', 'warning'],
  ['SO-51186', 'Sales order', '2026-08-29', '6,120.00', 'Shipped', 'success'],
  ['INV-70402', 'Invoice', '2026-09-14', '18,400.00', 'Not due', ''],
  ['INV-70318', 'Invoice', '2026-06-11', '6,120.00', '74 days overdue', 'danger'],
];

export const render = () =>
  page({
    title: 'Halden Marine AS',
    moduleId: 'crm',
    trail: [
      { label: 'Home', href: '/index.html' },
      { label: 'CRM', href: '/crm/accounts.html' },
      { label: 'Accounts', href: '/crm/accounts.html' },
      { label: 'ACC-1042' },
    ],
    body: `
    <header class="bo-widget">
      <div class="bo-widget__header">
        <h1 class="bo-widget__title">ACC-1042 · Halden Marine AS</h1>
        <span class="bo-badge bo-badge--success">Within limit</span>
      </div>
      <div class="bo-widget__body">
        <dl class="bo-kv">
          <div><dt>Tier</dt><dd>Key account</dd></div>
          <div><dt>Owner</dt><dd>P. Sandberg</dd></div>
          <div><dt>Terms</dt><dd>Net 30 · DAP Bergen</dd></div>
          <div><dt>Credit limit</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">150,000<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Open exposure</dt><dd><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">24,520<span class="bo-amount__fraction">.00</span></span></span></dd></div>
          <div><dt>Customer since</dt><dd><span class="bo-u-tabular">2019-03-11</span></dd></div>
        </dl>
      </div>
    </header>

    <h2>Contacts</h2>
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">People at this account</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Role</th>
            <th scope="col">Email</th>
            <th scope="col"><span class="bo-visually-hidden">Primary contact</span></th>
          </tr>
        </thead>
        <tbody>
          ${contacts
            .map(
              ([name, role, mail, flag]) => `<tr>
            <td>${name}</td>
            <td class="bo-data-table__col--secondary">${role}</td>
            <td class="bo-data-table__col--code">${mail}</td>
            <td>${flag ? `<span class="bo-badge bo-badge--accent">${flag}</span>` : ''}</td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>
    <div class="bo-cluster">
      <button class="bo-btn bo-btn--secondary" type="button">+ Add contact</button>
    </div>

    <h2>Open items</h2>
    <!-- NOT a document flow: these documents are not stages of one chain,
         they are unrelated transactions that happen to share a customer.
         A timeline would imply an order that does not exist. -->
    <div class="bo-data-table-container" tabindex="0" data-density="compact">
      <table class="bo-data-table">
        <caption class="bo-visually-hidden">Open transactions for this account</caption>
        <thead>
          <tr>
            <th scope="col">Document</th>
            <th scope="col">Type</th>
            <th scope="col" class="bo-data-table__col--secondary">Due</th>
            <th scope="col" class="bo-data-table__col--numeric">Value</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          ${openItems
            .map(
              ([no, type, due, val, status, tone]) => `<tr>
            <td class="bo-data-table__col--code">${no}</td>
            <td>${type}</td>
            <td class="bo-data-table__col--secondary bo-u-tabular">${due}</td>
            <td class="bo-data-table__col--numeric"><span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${val}</span></span></td>
            <td><span class="bo-badge${tone ? ` bo-badge--${tone}` : ''}">${status}</span></td>
          </tr>`,
            )
            .join('\n          ')}
        </tbody>
      </table>
    </div>

    <div class="bo-form-actions">
      <button class="bo-btn" type="button">Edit account</button>
      <button class="bo-btn bo-btn--secondary" type="button">Raise credit limit</button>
      <button class="bo-btn bo-btn--ghost" type="button">Put on hold</button>
    </div>
`,
  });
