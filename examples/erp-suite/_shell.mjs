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
  { id: 'crm', label: 'CRM', icon: 'user', href: '/crm/index.html' },
  { id: 'fin', label: 'Finance', icon: 'invoice', href: '/fin/index.html' },
  { id: 'inv', label: 'Inventory', icon: 'box', href: '/inv/index.html' },
  { id: 'prod', label: 'Production', icon: 'settings', href: '/prod/index.html' },
];

/** The documents each module owns — the second nav level. */
export const SECTIONS = {
  /* One level, and the functions ARE the documents (owner, 2026-08-23):
     anything in P2P that is not a document is a report or a job, and both
     already have homes. Ordered as the work flows. */
  o2c: [
    { label: 'Sales orders', href: '/o2c/sales-orders.html' },
  ],
  p2p: [
    { label: 'Requisitions', href: '/p2p/requisitions.html' },
    { label: 'Purchase orders', href: '/p2p/purchase-orders.html' },
    { label: 'Vendor invoices', href: '/p2p/vendor-invoices.html' },
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
