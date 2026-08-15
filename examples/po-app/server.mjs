/**
 * PO mini-app — the Devi test. A dependency-free Node server rendering a
 * 3-screen ERP slice with @busy-office/ui installed FROM THE TARBALL, using
 * only markup documented in the gallery. HTMX drives bulk approve and the
 * detail-page approval; the framework's own JS behaviors run unmodified.
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, normalize } from 'node:path';

const require = createRequire(import.meta.url);
const uiDist = join(
  dirname(require.resolve('@busy-office/ui/package.json')),
  'dist',
);

// ---------- in-memory data ----------
const pos = [
  { id: 'PO-88210', vendor: 'Acme Supply Co.', cc: 'CC-4021', amount: 4208.0, status: 'Pending' },
  { id: 'PO-88211', vendor: 'Globex Industrial', cc: 'CC-4021', amount: 18940.5, status: 'Approved' },
  { id: 'PO-88212', vendor: 'Initech GmbH', cc: 'CC-1180', amount: 730.25, status: 'Rejected' },
  { id: 'PO-88213', vendor: 'Umbrella Logistics', cc: 'CC-2205', amount: 12400.0, status: 'Pending' },
  { id: 'PO-88214', vendor: 'Stark Components', cc: 'CC-1180', amount: 56000.0, status: 'Pending' },
];
const audit = [];
const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const tone = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

// ---------- layout ----------
const page = (title, current, main) => `<!doctype html>
<html lang="en" data-density="compact">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · PO demo</title>
<link rel="stylesheet" href="/assets/css/index.min.css">
<link rel="stylesheet" href="/assets/css/htmx.min.css">
<script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body>
<div class="bo-app-shell">
  <header class="bo-navbar bo-app-shell__header">
    <a class="bo-navbar__brand" href="/">PO demo</a>
    <span class="bo-badge bo-badge--accent">tarball build</span>
    <span class="bo-navbar__spacer"></span>
  </header>
  <nav class="bo-sidebar-nav bo-app-shell__sidebar" aria-label="Main">
    <ul>
      <li><a class="bo-sidebar-nav__link" href="/" ${current === '/' ? 'aria-current="page"' : ''}><span class="bo-sidebar-nav__icon" aria-hidden="true">▥</span><span class="bo-sidebar-nav__label">Dashboard</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/pos" ${current === '/pos' ? 'aria-current="page"' : ''}><span class="bo-sidebar-nav__icon" aria-hidden="true">▤</span><span class="bo-sidebar-nav__label">Purchase orders</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/spend" ${current === '/spend' ? 'aria-current="page"' : ''}><span class="bo-sidebar-nav__icon" aria-hidden="true">Σ</span><span class="bo-sidebar-nav__label">Spend by CC</span></a></li>
    </ul>
  </nav>
  <main class="bo-app-shell__main"><div class="bo-stack bo-stack--loose">${main}</div></main>
</div>
<script type="module">
  import { initDialogs, initDataTables, initAlerts } from '/assets/js/index.js';
  initDialogs(); initDataTables(); initAlerts();
  document.body.addEventListener('htmx:afterSwap', (e) => initDataTables(e.target));
</script>
<div class="bo-toast-region" role="status" aria-live="polite" id="toasts"></div>
</body></html>`;

// ---------- fragments ----------
const rowHtml = (p) => `<tr id="row-${p.id}">
  <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${p.id}"${p.status !== 'Pending' ? ' disabled' : ''}></td>
  <td class="bo-data-table__col--code"><a href="/pos/${p.id}">${p.id}</a></td>
  <td class="bo-u-text-truncate">${p.vendor}</td>
  <td class="bo-data-table__col--secondary bo-data-table__col--code">${p.cc}</td>
  <td class="bo-data-table__col--numeric">${money(p.amount)}</td>
  <td><span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></td>
</tr>`;

const tbodyHtml = (list) =>
  `<tbody id="po-rows">${list.map(rowHtml).join('')}</tbody>`;

const listScreen = () => `
<h1>Purchase orders</h1>
<form class="bo-filter-bar" role="search" aria-label="PO filters" method="get" action="/pos">
  <input class="bo-input" type="search" name="q" aria-label="Search POs" placeholder="Search…" style="max-inline-size: 12rem">
  <select class="bo-select" name="status" style="inline-size:auto" aria-label="Status">
    <option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option>
  </select>
  <button class="bo-btn bo-btn--secondary" type="submit">Apply</button>
</form>
<div class="bo-data-table-container">
  <div class="bo-data-table__toolbar">
    <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
      <button class="bo-btn" type="button"
        hx-post="/pos/bulk-approve" hx-target="#po-rows" hx-swap="outerHTML"
        hx-include=".bo-data-table__row-select:checked">Approve selected</button>
    </div>
    <span class="bo-data-table__selection-count"></span>
  </div>
  <table class="bo-data-table bo-data-table--sticky-col">
    <thead><tr>
      <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
      <th scope="col" aria-sort="ascending"><button class="bo-data-table__sort-btn" type="button">PO #</button></th>
      <th scope="col">Vendor</th>
      <th scope="col" class="bo-data-table__col--secondary">Cost center</th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th>
      <th scope="col">Status</th>
    </tr></thead>
    ${tbodyHtml(pos)}
  </table>
  <div class="bo-data-table__footer">
    <span class="bo-pagination__info">${pos.length} POs</span>
  </div>
</div>`;

const timelineHtml = (p) => `<ol class="bo-timeline" role="list" id="timeline-${p.id}">
  <li class="bo-timeline__step" data-state="done">
    <span class="bo-timeline__marker" aria-hidden="true">✓</span>
    <div><div class="bo-timeline__title"><span class="bo-visually-hidden">Completed: </span>Submitted</div>
    <div class="bo-timeline__meta">system · <time datetime="2026-08-10T09:14">2026-08-10 09:14</time></div></div>
  </li>
  ${p.status === 'Approved'
    ? `<li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <div><div class="bo-timeline__title"><span class="bo-visually-hidden">Completed: </span>Approved</div></div></li>`
    : p.status === 'Rejected'
      ? `<li class="bo-timeline__step" data-state="rejected">
          <span class="bo-timeline__marker" aria-hidden="true">✕</span>
          <div><div class="bo-timeline__title"><span class="bo-visually-hidden">Rejected: </span>Approval</div></div></li>`
      : `<li class="bo-timeline__step" data-state="current" aria-current="step">
          <span class="bo-timeline__marker" aria-hidden="true">●</span>
          <div><div class="bo-timeline__title">Awaiting approval</div></div></li>`}
</ol>`;

const detailScreen = (p) => `
<h1>${p.id} <span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></h1>
<div class="bo-grid" style="--bo-grid-min: 18rem">
  <fieldset class="bo-form-section">
    <legend class="bo-form-section__legend">Order</legend>
    <div class="bo-form-row">
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="vendor">Vendor</label>
        <input class="bo-input" id="vendor" value="${p.vendor}" readonly>
      </div>
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="amount">Amount</label>
        <input class="bo-input bo-input--numeric" id="amount" value="${money(p.amount)}" readonly>
      </div>
    </div>
  </fieldset>
  <div>${timelineHtml(p)}</div>
</div>
${p.status === 'Pending' ? `
<div class="bo-cluster">
  <button class="bo-btn" data-dialog-trigger="approve-dlg">Approve…</button>
</div>
<dialog class="bo-dialog" id="approve-dlg" aria-labelledby="adlg-t" data-state="closed">
  <form method="dialog">
    <header class="bo-dialog__header">
      <h2 class="bo-dialog__title" id="adlg-t">Approve ${p.id}</h2>
      <button class="bo-btn bo-btn--ghost bo-btn--icon" value="cancel" aria-label="Close">✕</button>
    </header>
    <div class="bo-dialog__body"><p>Approve ${p.id} for <span class="bo-u-tabular">${money(p.amount)}</span>?</p></div>
    <footer class="bo-dialog__footer">
      <button class="bo-btn bo-btn--secondary" value="cancel">Cancel</button>
      <button class="bo-btn" value="confirm"
        hx-post="/pos/${p.id}/approve" hx-target="#timeline-${p.id}" hx-swap="outerHTML">Approve</button>
    </footer>
  </form>
</dialog>` : ''}`;

// Dogfood probe (2026-08-15): the canonical grouped-with-subtotals ERP view,
// built with ONLY documented markup — to find out whether ROADMAP Slice 9
// items 8-9 (grouping, subtotal/total) compose from shipped primitives or
// genuinely fight. One <tbody> per group; the group header is a
// <th scope="colgroup" colspan>; subtotal/grand-total are plain rows.
const spendScreen = () => {
  const byCc = new Map();
  for (const p of pos) {
    if (!byCc.has(p.cc)) byCc.set(p.cc, []);
    byCc.get(p.cc).push(p);
  }
  const grand = pos.reduce((s, p) => s + p.amount, 0);
  const groups = [...byCc.entries()].sort(([a], [b]) => a.localeCompare(b));
  // Dogfood probe #2 (2026-08-15): budget consumption per CC — the named
  // continuous-progress scenario the parked "Process Bar" item was waiting
  // on. Bare NATIVE <progress> first (platform semantics for free); the
  // question is whether unstyled native rendering is acceptable in a themed
  // ERP screen or fights.
  const budgets = { 'CC-1180': 80000, 'CC-2205': 15000, 'CC-4021': 25000 };
  return `
<h1>Spend by cost center</h1>
<div class="bo-data-table-container">
  <table class="bo-data-table">
    <thead><tr>
      <th scope="col">PO #</th>
      <th scope="col">Vendor</th>
      <th scope="col">Status</th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th>
    </tr></thead>
    ${groups.map(([cc, list]) => {
      const spent = list.reduce((s, p) => s + p.amount, 0);
      const budget = budgets[cc] ?? 0;
      const pct = budget ? Math.round((spent / budget) * 100) : 0;
      const barTone = pct >= 90 ? ' bo-progress--danger' : pct >= 75 ? ' bo-progress--warning' : '';
      return `<tbody>
      <tr><th scope="colgroup" colspan="4">${cc}
        <span class="bo-u-text-muted" style="font-weight: normal"> — budget ${money(budget)},</span>
        <progress class="bo-progress${barTone}" max="100" value="${Math.min(pct, 100)}"></progress>
        <span class="bo-u-text-muted" style="font-weight: normal">${pct}% consumed${pct >= 90 ? ' — review before approving' : ''}</span>
      </th></tr>
      ${list.map((p) => `<tr>
        <td class="bo-data-table__col--code"><a href="/pos/${p.id}">${p.id}</a></td>
        <td class="bo-u-text-truncate">${p.vendor}</td>
        <td><span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></td>
        <td class="bo-data-table__col--numeric">${money(p.amount)}</td>
      </tr>`).join('')}
      <tr>
        <td colspan="3" class="bo-data-table__col--right">Subtotal ${cc}</td>
        <td class="bo-data-table__col--numeric">${money(spent)}</td>
      </tr>
    </tbody>`;
    }).join('')}
    <tbody>
      <tr>
        <td colspan="3" class="bo-data-table__col--right"><strong>Grand total</strong></td>
        <td class="bo-data-table__col--numeric"><strong>${money(grand)}</strong></td>
      </tr>
    </tbody>
  </table>
</div>`;
};

const dashScreen = () => {
  const pending = pos.filter((p) => p.status === 'Pending');
  const total = pending.reduce((s, p) => s + p.amount, 0);
  return `
<h1>Dashboard</h1>
<div class="bo-widget-grid" style="--bo-widget-min: 13rem">
  <div class="bo-widget bo-widget--span-2">
    <div class="bo-stat bo-stat--hero">
      <span class="bo-stat__label">Awaiting your approval</span>
      <span class="bo-stat__value">${pending.length}</span>
      <span class="bo-stat__delta bo-stat__delta--bad"><span aria-hidden="true">▲</span> +2 <span aria-hidden="true">⚠</span><span class="bo-visually-hidden">increase, worse,</span> since yesterday</span>
    </div>
  </div>
  <div class="bo-widget"><div class="bo-stat">
    <span class="bo-stat__label">Pending value</span>
    <span class="bo-stat__value">${money(total)}</span>
  </div></div>
  <div class="bo-widget">
    <div class="bo-widget__header"><span class="bo-widget__title">Queue</span>
      <a href="/pos" class="bo-u-text-muted" style="font-size: var(--bo-font-size-xs)">View all</a></div>
    <div class="bo-widget__body bo-widget__body--flush">
      <div class="bo-data-table-container" style="border:none">
        <table class="bo-data-table">
          <tbody>${pending.slice(0, 3).map((p) => `<tr><td class="bo-data-table__col--code">${p.id}</td><td class="bo-data-table__col--numeric">${money(p.amount)}</td></tr>`).join('')}</tbody>
        </table>
      </div>
    </div>
  </div>
</div>`;
};

// ---------- server ----------
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  const path = url.pathname;
  try {
    if (path.startsWith('/assets/')) {
      const file = normalize(join(uiDist, path.slice(8)));
      if (!file.startsWith(uiDist)) throw new Error('path');
      const body = await readFile(file);
      const type = file.endsWith('.css')
        ? 'text/css'
        : file.endsWith('.js')
          ? 'text/javascript'
          : 'application/octet-stream';
      res.writeHead(200, { 'content-type': type });
      return res.end(body);
    }
    if (path === '/' ) {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Dashboard', '/', dashScreen()));
    }
    if (path === '/pos' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Purchase orders', '/pos', listScreen()));
    }
    if (path === '/stress' && req.method === 'GET') {
      // Perf probe (2026-08-15): the virtualization question needs numbers,
      // not vibes. N unvirtualized rows through the full data-table stack
      // (sticky header, checkboxes, badges, container query, initDataTables).
      const n = Math.min(Number(url.searchParams.get('n')) || 5000, 20000);
      // Isolation flags: ?nocheck=1 (no row checkboxes → no :has() subject),
      // ?nobadge=1, ?loose=1 (table NOT in the overflow container).
      const nocheck = url.searchParams.has('nocheck');
      const nobadge = url.searchParams.has('nobadge');
      const loose = url.searchParams.has('loose');
      const vendors = ['Acme Supply Co.', 'Globex Industrial', 'Initech GmbH', 'Umbrella Logistics', 'Stark Components'];
      const statuses = ['Pending', 'Approved', 'Rejected'];
      let rows = '';
      for (let i = 0; i < n; i++) {
        const st = statuses[i % 3];
        rows += `<tr>
          ${nocheck ? '' : `<td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="Select STR-${i}"></td>`}
          <td class="bo-data-table__col--code">STR-${String(i).padStart(5, '0')}</td>
          <td>${vendors[i % 5]}</td>
          <td class="bo-data-table__col--numeric">${money((i % 900) * 61 + 250)}</td>
          <td>${nobadge ? st : `<span class="bo-badge bo-badge--${tone[st]}">${st}</span>`}</td>
        </tr>`;
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      const tableHtml = `<table class="bo-data-table">
    <thead><tr>
      ${nocheck ? '' : '<th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>'}
      <th scope="col">Ref</th><th scope="col">Vendor</th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th><th scope="col">Status</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
      return res.end(page(`Stress ${n}`, '/stress', `
<h1>Stress: ${n} rows${nocheck ? ', no checkboxes' : ''}${nobadge ? ', no badges' : ''}${loose ? ', no container' : ''}</h1>
${loose ? tableHtml : `<div class="bo-data-table-container">
  <div class="bo-data-table__toolbar">
    <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
      <button class="bo-btn" type="button">Approve selected</button>
    </div>
    <span class="bo-data-table__selection-count"></span>
  </div>
  ${tableHtml}
</div>`}`));
    }
    if (path === '/spend' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Spend by cost center', '/spend', spendScreen()));
    }
    if (path === '/pos/bulk-approve' && req.method === 'POST') {
      let body = '';
      for await (const c of req) body += c;
      const ids = new URLSearchParams(body).getAll('on'); // unnamed checkboxes post nothing useful — see findings
      pos.forEach((p) => {
        if (p.status === 'Pending') p.status = 'Approved';
      });
      audit.push({ t: new Date().toISOString(), what: 'bulk approve' });
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(tbodyHtml(pos));
    }
    const m = path.match(/^\/pos\/(PO-\d+)(\/approve)?$/);
    if (m) {
      const p = pos.find((x) => x.id === m[1]);
      if (!p) {
        res.writeHead(404);
        return res.end('not found');
      }
      if (m[2] && req.method === 'POST') {
        p.status = 'Approved';
        audit.push({ t: new Date().toISOString(), what: `approved ${p.id}` });
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(timelineHtml(p));
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page(p.id, '/pos', detailScreen(p)));
    }
    res.writeHead(404);
    res.end('not found');
  } catch (e) {
    res.writeHead(500);
    res.end('error');
  }
});

server.listen(8080, () => console.log('po-app on :8080 · ui dist:', uiDist));
