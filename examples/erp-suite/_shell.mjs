/**
 * The suite's shared chrome, as ONE function every screen calls.
 *
 * Owner's framing (2026-08-23): "just sample screens to navigate thru app UI…
 * I just want to capture if we miss any necessary components or patterns or
 * features. So don't do anything complicated." So: static screens, real
 * links, no data layer, no interactivity beyond navigation. Cross-module
 * references are links only — the API side is explicitly out of scope.
 *
 * THE RULE THAT MAKES THIS AN INSTRUMENT: this example may not add a single
 * line of its own CSS. Every class below is one the framework ships. When a
 * screen needs something the framework has not got, the screen stops and the
 * need is written down in .roundtable/erp-suite-gaps.md — that is the whole
 * point of building it. check-erp-suite.mjs enforces the no-CSS half; the
 * writing-it-down half is judgement.
 */

/** The six modules, in the order they appear on the rail. */
export const MODULES = [
  { id: 'home', label: 'Home', icon: 'grid', href: '/index.html' },
  { id: 'o2c', label: 'Order to cash', icon: 'cart', href: '/o2c/sales-orders.html' },
  { id: 'p2p', label: 'Procure to pay', icon: 'truck', href: '/p2p/purchase-orders.html' },
  { id: 'crm', label: 'CRM', icon: 'user', href: '/crm/accounts.html' },
  { id: 'fin', label: 'Finance', icon: 'invoice', href: '/fin/journal-entry.html' },
  { id: 'inv', label: 'Inventory', icon: 'box', href: '/inv/stock-on-hand.html' },
  { id: 'prod', label: 'Production', icon: 'settings', href: '/prod/production-orders.html' },
];

/** The documents each module owns — the second nav level. */
export const SECTIONS = {
  /* One level, and the functions ARE the documents (owner, 2026-08-23):
     anything in P2P that is not a document is a report or a job, and both
     already have homes. Ordered as the work flows. */
  o2c: [
    { label: 'Sales orders', href: '/o2c/sales-orders.html' },
    { label: 'Customer invoices', href: '/o2c/customer-invoices.html' },
  ],
  p2p: [
    { label: 'Requisitions', href: '/p2p/requisitions.html' },
    { label: 'Purchase orders', href: '/p2p/purchase-orders.html' },
    { label: 'Vendor invoices', href: '/p2p/vendor-invoices.html' },
  ],
  /* CRM breaks the "the functions ARE the documents" rule above, and it is
     the rule that bends rather than the module: an account is master data,
     not a document. It still belongs at this level because it is what a
     salesperson navigates BY. */
  crm: [
    { label: 'Accounts', href: '/crm/accounts.html' },
    { label: 'Opportunities', href: '/crm/opportunities.html' },
  ],
  /* Finance breaks the "the functions ARE the documents" rule the way CRM
     does, and more sharply: a journal entry is a document, but a trial balance
     and an aging are REPORTS and period close is a job. They sit at this level
     because it is what a finance clerk navigates by — the alternative was a
     module whose only entry was the one screen nobody opens daily. */
  fin: [
    { label: 'Journal entries', href: '/fin/journal-entry.html' },
    { label: 'Trial balance', href: '/fin/trial-balance.html' },
    { label: 'AR aging', href: '/fin/ar-aging.html' },
    { label: 'Period close', href: '/fin/period-close.html' },
  ],
  /* Inventory is the clearest case of the CRM exception: a stock level is
     master data and a count is a job, but they are what a storesperson
     navigates by. Only stock-movement is a document. */
  inv: [
    { label: 'Stock on hand', href: '/inv/stock-on-hand.html' },
    { label: 'Stock movements', href: '/inv/stock-movement.html' },
    { label: 'Cycle counts', href: '/inv/cycle-count.html' },
    { label: 'Lot trace', href: '/inv/lot-trace.html' },
  ],
  prod: [
    { label: 'Production orders', href: '/prod/production-orders.html' },
    { label: 'Bills of material', href: '/prod/bom.html' },
    { label: 'Capacity', href: '/prod/capacity.html' },
  ],
};

const icon = (name) =>
  `<span class="bo-icon bo-icon--${name} bo-sidebar-nav__icon" aria-hidden="true"></span>`;

/**
 * GAP-1 lives here. The design called for a narrow ICON RAIL of modules
 * beside a second column listing that module's documents — the shape every
 * multi-module ERP uses. `bo-sidebar-nav` ships __section/__heading, which is
 * ONE column with grouped links, and `sidebar-layout` ships one sidebar slot.
 * There is no second rail, so this renders both levels in the single sidebar:
 * modules as one group, the current module's documents as a second group
 * under a heading. It reads fine and it is not what was designed.
 */
function nav(moduleId) {
  const modules = MODULES.map(
    (m) =>
      `<li><a class="bo-sidebar-nav__link" href="${m.href}"${
        m.id === moduleId ? ' aria-current="page"' : ''
      }>${icon(m.icon)}<span class="bo-sidebar-nav__label">${m.label}</span></a></li>`,
  ).join('\n          ');

  const sections = SECTIONS[moduleId];
  const second = !sections
    ? ''
    : `
      <div class="bo-sidebar-nav__section">
        <p class="bo-sidebar-nav__heading">Documents</p>
        <ul role="list">
          ${sections
            .map(
              (s) =>
                `<li><a class="bo-sidebar-nav__link" href="${s.href}"><span class="bo-sidebar-nav__label">${s.label}</span></a></li>`,
            )
            .join('\n          ')}
        </ul>
      </div>`;

  return `<nav class="bo-sidebar-nav bo-app-shell__sidebar" aria-label="Modules and documents">
      <div class="bo-sidebar-nav__section">
        <p class="bo-sidebar-nav__heading">Modules</p>
        <ul role="list">
          ${modules}
        </ul>
      </div>${second}
    </nav>`;
}

/** Breadcrumb trail — the only wayfinding a document screen gets today. */
function crumbs(trail) {
  if (!trail?.length) return '';
  const items = trail
    .map((t, i) =>
      i === trail.length - 1
        ? `<li><span aria-current="page">${t.label}</span></li>`
        : `<li><a href="${t.href}">${t.label}</a></li>`,
    )
    .join('');
  // The class sits on the <ol>, not the <nav> — breadcrumb.css:3 documents it.
  return `<nav aria-label="Breadcrumb"><ol class="bo-breadcrumb">${items}</ol></nav>`;
}

export function page({ title, moduleId, trail = [], body }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · Busy Office ERP suite</title>
<link rel="stylesheet" href="/bo/index.css">
</head>
<body>
<div class="bo-app-shell">
  <header class="bo-navbar bo-app-shell__header">
    <a class="bo-navbar__brand" href="/index.html">Busy Office ERP</a>
    <span class="bo-navbar__spacer"></span>
    <span class="bo-avatar" aria-hidden="true">JK</span>
  </header>
  ${nav(moduleId)}
  <!-- bo-stack spaces the sections (the reset zeroes margins and this example
       may not add CSS). It goes on an INNER div, never on __main itself —
       see GAP-6: __main is overflow:auto, so making it a flex column makes
       its children shrinkable, and a scrollable table container collapses to
       its header row with the body clipped. Cost an hour and a screenshot to
       find; the obvious composition is the broken one. -->
  <main class="bo-app-shell__main">
    <div class="bo-stack">
      ${crumbs(trail)}
      ${body}
    </div>
  </main>
</div>
</body>
</html>
`;
}
