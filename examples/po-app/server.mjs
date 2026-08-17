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
// Backfill a longer history so the list screen has something real to
// load-more over (second-consumer round for initLoadMore).
for (let i = 0; i < 25; i++) {
  const vendors = ['Acme Supply Co.', 'Globex Industrial', 'Initech GmbH', 'Umbrella Logistics', 'Stark Components'];
  pos.push({
    id: `PO-88${String(190 - i).padStart(3, '0')}`,
    vendor: vendors[i % 5],
    cc: ['CC-4021', 'CC-1180', 'CC-2205'][i % 3],
    amount: (i % 40) * 517 + 380,
    status: ['Approved', 'Rejected', 'Approved'][i % 3],
  });
}
const PAGE_SIZE = 10;
const audit = [];
const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
const tone = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };

// ---------- layout ----------
const DENSITIES = ['compact', 'comfortable', 'spacious'];
const densityFromCookie = (req) => {
  const m = /(?:^|;\s*)density=(\w+)/.exec(req.headers.cookie || '');
  return m && DENSITIES.includes(m[1]) ? m[1] : 'compact';
};

const page = (title, current, main, density = 'compact') => `<!doctype html>
<html lang="en" data-density="${density}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} · PO demo</title>
<link rel="stylesheet" href="/assets/css/index.min.css">
<link rel="stylesheet" href="/assets/css/htmx.min.css">
<link rel="stylesheet" href="/assets/css/brand-cobalt.min.css">
<script>
  // htmx DISCARDS non-2xx responses by default — a 422 carrying a
  // re-rendered form, or a 409 carrying the current record, would never
  // reach the user (docs: /concepts/concurrency, /getting-started/htmx).
  // Opt the statuses this app uses deliberately back in.
  document.addEventListener("htmx:beforeSwap", (e) => {
    if ([409, 422].includes(e.detail.xhr.status)) {
      e.detail.shouldSwap = true;
      e.detail.isError = false;
    }
  });
</script>
<script src="https://unpkg.com/htmx.org@2.0.4"></script>
</head>
<body>
<div class="bo-app-shell">
  <header class="bo-navbar bo-app-shell__header">
    <a class="bo-navbar__brand" href="/">PO demo</a>
    <span class="bo-badge bo-badge--accent">tarball build</span>
    <span class="bo-navbar__spacer"></span>
    <div class="bo-segmented" role="group" aria-label="Density" id="density-switch">
      ${DENSITIES.map((d) => `<input class="bo-segmented__input bo-visually-hidden" type="radio"
          name="density" id="density-${d}" value="${d}"${d === density ? ' checked' : ''}>
      <label class="bo-segmented__option" for="density-${d}">${d[0].toUpperCase()}${d.slice(1)}</label>`).join('\n      ')}
    </div>
  </header>
  <nav class="bo-sidebar-nav bo-app-shell__sidebar" aria-label="Main">
    <ul>
      <li><a class="bo-sidebar-nav__link" href="/" ${current === '/' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--grid bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Dashboard</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/pos" ${current === '/pos' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--invoice bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Purchase orders</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/spend" ${current === '/spend' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--chart bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Spend by CC</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/receive" ${current === '/receive' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--barcode bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Receive</span></a></li>
    </ul>
  </nav>
  <main class="bo-app-shell__main"><div class="bo-stack bo-stack--loose">${main}</div></main>
</div>
<script type="module">
  import { initDialogs, initDataTables, initAlerts } from '/assets/js/index.js';
  initDialogs(); initDataTables(); initAlerts();
  document.body.addEventListener('htmx:afterSwap', (e) => { initDataTables(e.target); window.__btt?.(); });
  document.getElementById('density-switch').addEventListener('change', (e) => {
    const d = e.target.value;
    document.documentElement.dataset.density = d;
    document.cookie = 'density=' + d + '; path=/; max-age=31536000';
  });
</script>
<div class="bo-toast-region" role="status" aria-live="polite" id="toasts"></div>
</body></html>`;

// ---------- fragments ----------
const rowHtml = (p) => `<tr id="row-${p.id}"${p.bulkError ? ' data-row-state="error"' : ''}>
  <!-- The id is load-bearing: the bulk swap replaces this very row, so the
       checkbox the user pressed Enter on is destroyed. htmx restores focus
       after a swap only to an element with a matching id — without it the
       keyboard user is dumped on <body>. Verified both ways. -->
  <td><input type="checkbox" id="sel-${p.id}" name="id" value="${p.id}" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${p.id}"${p.status !== 'Pending' ? ' disabled' : ''}></td>
  <td class="bo-data-table__col--code"><a href="/pos/${p.id}">${p.id}</a></td>
  <td class="bo-u-text-truncate" data-col="vendor">${p.vendor}</td>
  <td class="bo-data-table__col--secondary bo-data-table__col--code" data-col="cc">${p.cc}</td>
  <td class="bo-data-table__col--numeric">${money(p.amount)}</td>
  <td data-col="status"><span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span>${
    p.bulkError ? ` <span class="bo-badge bo-badge--danger">${p.bulkError}</span>` : ''
  }</td>
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
<div id="bulk-result"></div>
<!-- A real <form> around the selection, not hx-include on the button. Both
     POST the same ids, but only the form gets native implicit submission:
     Enter from ANY row checkbox runs the bulk action, instead of
     Shift+Tab-ing back up to a toolbar that sits above the table (measured
     at 32 presses from row 30). The safe action is FIRST because implicit
     submission activates the first submit button in the form. -->
<form hx-post="/pos/bulk-approve" hx-target="#po-rows" hx-swap="outerHTML">
<div class="bo-data-table-container" tabindex="0">
  <div class="bo-data-table__toolbar">
    <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
      <button class="bo-btn" type="submit">Approve selected</button>
    </div>
    <span class="bo-data-table__selection-count"></span>
    <span class="bo-cluster" style="--bo-cluster-gap: var(--bo-space-2)">
      <!-- type="button" is load-bearing now: inside a form a button with no
           type IS a submit button, so this would fire the bulk action. -->
      <button class="bo-btn bo-btn--secondary" type="button" popovertarget="po-cols" data-multiselect-label="Columns">Columns</button>
      <div class="bo-dropdown__menu" id="po-cols" popover data-multiselect>
        <label class="bo-dropdown__item"><input type="checkbox" class="bo-checkbox" data-col-toggle="vendor" checked> Vendor</label>
        <label class="bo-dropdown__item"><input type="checkbox" class="bo-checkbox" data-col-toggle="cc" checked> Cost center</label>
        <label class="bo-dropdown__item"><input type="checkbox" class="bo-checkbox" data-col-toggle="status" checked> Status</label>
      </div>
      <button class="bo-btn bo-btn--secondary" type="button" data-table-export data-table-export-format="csv">Export</button>
    </span>
  </div>
  <table class="bo-data-table bo-data-table--sticky-col">
    <thead><tr>
      <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all"></th>
      <th scope="col" aria-sort="ascending"><button class="bo-data-table__sort-btn" type="button">PO #</button></th>
      <th scope="col" data-col="vendor">Vendor</th>
      <th scope="col" class="bo-data-table__col--secondary" data-col="cc">Cost center</th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th>
      <th scope="col" data-col="status">Status</th>
    </tr></thead>
    ${tbodyHtml(pos.slice(0, PAGE_SIZE))}
  </table>
  <div class="bo-data-table__footer" style="justify-content: center">
    <button class="bo-btn bo-btn--secondary" type="button" data-table-load-more id="po-load-more"
      data-po-offset="${PAGE_SIZE}">Load more (${pos.length - PAGE_SIZE} of ${pos.length} remaining)</button>
  </div>
</div>
</form>
<script type="module">
  import { initDropdowns, initTableToolbar, initLoadMore } from '/assets/js/index.js';
  initDropdowns(); initTableToolbar(); initLoadMore();
  window.__btt = initTableToolbar; // layout's afterSwap re-applies column state
  document.addEventListener('bo:table-export', () => {
    const toasts = document.getElementById('toasts');
    const t = document.createElement('div');
    t.className = 'bo-alert bo-alert--success';
    t.textContent = 'Export started — CSV will download when ready.';
    toasts.append(t);
    setTimeout(() => t.remove(), 3000);
  });
  document.addEventListener('bo:table-load-more', async (e) => {
    const btn = e.target;
    btn.disabled = true;
    const offset = Number(btn.dataset.poOffset);
    const res = await fetch('/pos/rows?offset=' + offset);
    const html = await res.text();
    document.getElementById('po-rows').insertAdjacentHTML('beforeend', html);
    initTableToolbar(); // re-apply column visibility to the appended rows
    const remaining = Number(res.headers.get('x-remaining'));
    btn.dataset.poOffset = String(offset + ${PAGE_SIZE});
    if (remaining <= 0) btn.remove();
    else { btn.textContent = 'Load more (' + remaining + ' remaining)'; btn.disabled = false; }
  });
</script>`;

const timelineHtml = (p) => `<ol class="bo-timeline" role="list" id="timeline-${p.id}">
  <li class="bo-timeline__step" data-state="done">
    <span class="bo-timeline__marker" aria-hidden="true">✓</span>
    <div><div class="bo-timeline__title"><span class="bo-visually-hidden">Completed: </span>Submitted</div>
    <div class="bo-timeline__meta">system · <time datetime="2026-08-10T09:14">2026-08-10 09:14</time></div></div>
  </li>
  ${p.status === 'Approved'
    ? `<li class="bo-timeline__step" data-state="done">
        <span class="bo-timeline__marker" aria-hidden="true">✓</span>
        <div><div class="bo-timeline__title"><span class="bo-visually-hidden">Completed: </span>Approved</div>${
          p.note ? `<div class="bo-prose bo-u-text-sm">${p.note}</div>` : ''
        }</div></li>`
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
    <dl class="bo-kv">
      <div><dt>Vendor</dt><dd>${p.vendor}</dd></div>
      <div><dt>Cost center</dt><dd>${p.cc}</dd></div>
      <div><dt>Amount</dt><dd class="bo-u-tabular">${money(p.amount)}</dd></div>
    </dl>
  </fieldset>
  <div>${timelineHtml(p)}</div>
</div>
<fieldset class="bo-form-section">
  <legend class="bo-form-section__legend">Documents</legend>
  <label class="bo-file-dropzone" data-file-dropzone>
    <input class="bo-file-input bo-visually-hidden" type="file" multiple
        id="po-doc-input" aria-label="Attach vendor documents">
    <span>Drop files here, or click to browse</span>
    <span class="bo-file-dropzone__hint">PDF, JPG, or PNG — up to 10 MB each</span>
  </label>
  <ul class="bo-file-list" id="po-doc-list" aria-live="polite"></ul>
</fieldset>
<script type="module">
  import { initFileDropzone } from '/assets/js/index.js';
  initFileDropzone();
  document.getElementById('po-doc-input').addEventListener('change', (e) => {
    const list = document.getElementById('po-doc-list');
    for (const f of e.target.files) {
      const li = document.createElement('li');
      li.className = 'bo-file-list__item';
      const name = document.createElement('span');
      name.className = 'bo-file-list__name';
      name.textContent = f.name;
      const size = document.createElement('span');
      size.className = 'bo-file-list__size';
      size.textContent = (f.size / 1024).toFixed(0) + ' KB';
      const rm = document.createElement('button');
      rm.className = 'bo-btn bo-btn--sm bo-btn--danger-ghost';
      rm.type = 'button';
      rm.setAttribute('aria-label', 'Remove ' + f.name);
      rm.textContent = '✕';
      rm.addEventListener('click', () => li.remove());
      li.append(name, size, rm);
      list.append(li);
    }
    e.target.value = '';
  });
</script>
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
    <div class="bo-dialog__body" id="adlg-body">
      <p>Approve ${p.id} for <span class="bo-u-tabular">${money(p.amount)}</span>?</p>
      <div class="bo-form-field">
        <span class="bo-form-field__label" id="adlg-note-label">Approval note</span>
        <div class="bo-richtext">
          <div class="bo-richtext__toolbar" role="group" aria-label="Formatting">
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="bold" aria-pressed="false"><strong>B</strong></button>
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="italic" aria-pressed="false"><em>I</em></button>
            <span class="bo-richtext__divider"></span>
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="insertUnorderedList">• List</button>
          </div>
          <div class="bo-richtext__content bo-prose" contenteditable="true" id="adlg-note"
               role="textbox" aria-multiline="true" aria-labelledby="adlg-note-label"></div>
        </div>
      </div>
      <div class="bo-form-field">
        <span class="bo-form-field__label" id="adlg-notify-label">Notify additional approvers</span>
        <div class="bo-tag-input" id="adlg-notify" role="group" aria-labelledby="adlg-notify-label">
          <input class="bo-tag-input__field" id="adlg-notify-field" type="text"
              placeholder="Type a name, press Enter">
        </div>
      </div>
    </div>
    <footer class="bo-dialog__footer">
      <button class="bo-btn bo-btn--secondary" value="cancel">Cancel</button>
      <button class="bo-btn bo-btn--danger-ghost" type="button"
        hx-post="/pos/${p.id}/reject" hx-target="#adlg-body" hx-swap="innerHTML"
        hx-vals='js:{note: document.getElementById("adlg-note").innerHTML}'>Reject</button>
      <button class="bo-btn" value="confirm"
        hx-post="/pos/${p.id}/approve" hx-target="#timeline-${p.id}" hx-swap="outerHTML"
        hx-vals='js:{note: document.getElementById("adlg-note").innerHTML}'>Approve</button>
    </footer>
  </form>
</dialog>
<script type="module">
  import { initTagInput } from '/assets/js/index.js';
  initTagInput();
  // richtext light case — straight from /components/richtext Markup
  document.addEventListener('mousedown', (e) => {
    if (e.target.closest('[data-richtext-cmd]')) e.preventDefault();
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-richtext-cmd]');
    if (!btn) return;
    document.execCommand(btn.dataset.richtextCmd);
    if (btn.hasAttribute('aria-pressed'))
      btn.setAttribute('aria-pressed', String(document.queryCommandState(btn.dataset.richtextCmd)));
  });
  const notify = document.getElementById('adlg-notify');
  const field = document.getElementById('adlg-notify-field');
  notify.addEventListener('bo:tag-add', (e) => {
    const tag = document.createElement('span');
    tag.className = 'bo-tag-input__tag';
    tag.textContent = e.detail.value;
    const rm = document.createElement('button');
    rm.className = 'bo-tag-input__remove';
    rm.type = 'button';
    rm.setAttribute('aria-label', 'Remove ' + e.detail.value);
    rm.textContent = '×';
    tag.append(rm);
    notify.insertBefore(tag, field);
  });
</script>` : ''}`;

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
<div class="bo-data-table-container" tabindex="0">
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
      <tr><th scope="rowgroup" colspan="4">${cc}
        <span class="bo-u-text-muted" style="font-weight: normal"> — budget ${money(budget)},</span>
        <progress class="bo-progress${barTone}" max="100" value="${Math.min(pct, 100)}"
          aria-label="${pct}% of ${cc} budget consumed"></progress>
        <span class="bo-u-text-muted" style="font-weight: normal">${pct}% consumed${pct >= 90 ? ' — review before approving' : pct >= 75 ? ' — approaching budget' : ''}</span>
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

// Receiving screen — second real consumer of initScanInput (incl. the
// data-scan-status live region): scan a PO number, receive against it.
const receiveScreen = () => `
<h1>Receive against PO</h1>
<div class="bo-form-field" style="max-inline-size: 22rem">
  <label class="bo-form-field__label" for="rcv-scan">Scan PO barcode</label>
  <input class="bo-input bo-input--code" id="rcv-scan" data-scan-input autofocus
    placeholder="Waiting for scan…" aria-describedby="rcv-scan-status">
  <p id="rcv-scan-status" data-scan-status aria-live="polite" class="bo-visually-hidden"></p>
</div>
<div class="bo-data-table-container" tabindex="0" style="max-inline-size: 36rem">
  <table class="bo-data-table">
    <thead><tr><th scope="col">PO #</th><th scope="col">Vendor</th><th scope="col">Received</th></tr></thead>
    <tbody id="rcv-log">
      <tr><td colspan="3" class="bo-u-text-muted">No receipts yet — scan a PO number (try PO-88210).</td></tr>
    </tbody>
  </table>
</div>
<script type="module">
  import { initScanInput } from '/assets/js/index.js';
  initScanInput();
  const known = new Map(${JSON.stringify(pos.map((p) => [p.id, p.vendor]))});
  let cleared = false;
  document.getElementById('rcv-scan').addEventListener('bo:scan', (e) => {
    const id = e.detail.value.trim().toUpperCase();
    const log = document.getElementById('rcv-log');
    if (!known.has(id)) {
      const toasts = document.getElementById('toasts');
      const t = document.createElement('div');
      t.className = 'bo-alert bo-alert--warning';
      t.textContent = 'Unknown PO: ' + id;
      toasts.append(t);
      setTimeout(() => t.remove(), 3000);
      return;
    }
    if (!cleared) { log.textContent = ''; cleared = true; }
    const tr = document.createElement('tr');
    const c1 = document.createElement('td');
    c1.className = 'bo-data-table__col--code';
    c1.textContent = id;
    const c2 = document.createElement('td');
    c2.textContent = known.get(id);
    const c3 = document.createElement('td');
    c3.textContent = new Date().toLocaleTimeString();
    tr.append(c1, c2, c3);
    log.prepend(tr);
  });
</script>`;

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
      <div class="bo-data-table-container" tabindex="0" style="border:none">
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
  const density = densityFromCookie(req);
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
      return res.end(page('Dashboard', '/', dashScreen(), density));
    }
    if (path === '/pos' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Purchase orders', '/pos', listScreen(), density));
    }
    if (path === '/pos/rows' && req.method === 'GET') {
      const offset = Number(url.searchParams.get('offset')) || 0;
      const slice = pos.slice(offset, offset + PAGE_SIZE);
      res.writeHead(200, {
        'content-type': 'text/html',
        'x-remaining': String(Math.max(0, pos.length - offset - slice.length)),
      });
      return res.end(slice.map(rowHtml).join(''));
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
${loose ? tableHtml : `<div class="bo-data-table-container" tabindex="0">
  <div class="bo-data-table__toolbar">
    <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
      <button class="bo-btn" type="button">Approve selected</button>
    </div>
    <span class="bo-data-table__selection-count"></span>
  </div>
  ${tableHtml}
</div>`}`));
    }
    if (path === '/receive' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Receive', '/receive', receiveScreen(), density));
    }
    if (path === '/spend' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Spend by cost center', '/spend', spendScreen(), density));
    }
    if (path === '/pos/bulk-approve' && req.method === 'POST') {
      let body = '';
      for await (const c of req) body += c;
      const ids = new Set(new URLSearchParams(body).getAll('id'));
      // Two real ERP rules, so the action can PARTIALLY fail: over a
      // limit needs a second approver, and a decided PO cannot be
      // re-approved. Never claim blanket success.
      const LIMIT = 20000;
      // Partial-failure state is TRANSIENT — clear last round's reasons
      // first, or a row keeps advertising an error that is no longer
      // true (spike finding, 2026-08-17).
      pos.forEach((p) => { delete p.bulkError; });
      const failed = [];
      let approved = 0;
      pos.forEach((p) => {
        if (!ids.has(p.id)) return;
        if (p.status !== 'Pending') { failed.push([p, `Already ${p.status.toLowerCase()}`]); return; }
        if (p.amount > LIMIT) { failed.push([p, `Needs a second approver over ${money(LIMIT)}`]); return; }
        p.status = 'Approved';
        approved += 1;
      });
      for (const [p, reason] of failed) p.bulkError = reason;
      audit.push({ t: new Date().toISOString(), what: `bulk approve: ${approved} ok, ${failed.length} failed` });
      res.writeHead(200, { 'content-type': 'text/html' });
      // The swap returns ALL rows, which would desync the load-more offset
      // and duplicate rows on the next click (grill finding) — remove the
      // button out-of-band in the same response.
      const summary = `<div id="bulk-result" hx-swap-oob="innerHTML">${
        failed.length
          ? `<div class="bo-alert bo-alert--warning" role="alert"><p><strong>${approved} approved, ${failed.length} could not be.</strong> The rows below carry the reason.</p></div>`
          : `<div class="bo-alert bo-alert--success" role="status"><p>${approved} approved.</p></div>`
      }</div>`;
      return res.end(tbodyHtml(pos) + summary + '<button id="po-load-more" hx-swap-oob="delete"></button>');
    }
    const m = path.match(/^\/pos\/(PO-\d+)(\/approve|\/reject)?$/);
    if (m) {
      const p = pos.find((x) => x.id === m[1]);
      if (!p) {
        res.writeHead(404);
        return res.end('not found');
      }
      if (m[2] === '/reject' && req.method === 'POST') {
        const body = await new Promise((ok) => { let b=''; req.on('data',(c)=>b+=c); req.on('end',()=>ok(b)); });
        const note = (new URLSearchParams(body).get('note') ?? '').replace(/<[^>]*>/g, '').trim();
        if (!note) {
          // 422: re-render the SAME body with values kept and the error
          // wired to the field — the contract on /patterns/validation-summary.
          res.writeHead(422, { 'content-type': 'text/html' });
          return res.end(`
            <div class="bo-alert bo-alert--danger" role="alert" id="adlg-error">
              <p><strong>A reason is required to reject.</strong> Say what the requester should change.</p>
            </div>
            <p>Reject ${p.id} for <span class="bo-u-tabular">${money(p.amount)}</span>?</p>
            <div class="bo-form-field">
              <span class="bo-form-field__label" id="adlg-note-label">Approval note</span>
              <div class="bo-richtext">
                <div class="bo-cluster bo-richtext__toolbar" role="group" aria-label="Formatting">
                  <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="bold" aria-pressed="false"><strong>B</strong></button>
                </div>
                <div class="bo-richtext__content bo-prose" contenteditable="true" id="adlg-note"
                     role="textbox" aria-multiline="true" aria-labelledby="adlg-note-label"
                     aria-invalid="true" aria-describedby="adlg-error"></div>
              </div>
            </div>`);
        }
        p.status = 'Rejected';
        p.note = note;
        audit.push({ t: new Date().toISOString(), what: `rejected ${p.id}` });
        // ONE endpoint, TWO swap targets: the 422 lands in the dialog body
        // (hx-target), the success has to update the timeline OUTSIDE the
        // dialog. Out-of-band swap solves it — without this the success
        // response replaced the dialog body with a timeline and the real
        // timeline never changed (found by dogfooding, 2026-08-17).
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(`
          <p>Rejected — <span class="bo-u-text-muted">reason recorded in the audit trail.</span></p>
          <div id="timeline-${p.id}" hx-swap-oob="outerHTML">${timelineHtml(p).replace(`<ol class="bo-timeline" role="list" id="timeline-${p.id}">`, '<ol class="bo-timeline" role="list">')}</div>`);
      }
      if (m[2] === '/approve' && req.method === 'POST') {
        p.status = 'Approved';
        // Sanitize per the richtext docs: drop script/style elements WITH
        // their content first (a tag-only allowlist leaks the text — the
        // dogfood round proved it), then allowlist tags, then strip attrs.
        const body = await new Promise((ok) => { let b=''; req.on('data',(c)=>b+=c); req.on('end',()=>ok(b)); });
        const rawNote = new URLSearchParams(body).get('note') ?? '';
        p.note = rawNote
          .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
          .replace(/<(?!\/?(b|strong|i|em|ul|ol|li|p|br)\b)[^>]*>/gi, '')
          .replace(/<(\w+)[^>]*>/g, '<$1>');
        audit.push({ t: new Date().toISOString(), what: `approved ${p.id}` });
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(timelineHtml(p));
      }
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page(p.id, '/pos', detailScreen(p), density));
    }
    res.writeHead(404);
    res.end('not found');
  } catch (e) {
    res.writeHead(500);
    res.end('error');
  }
});

server.listen(8080, () => console.log('po-app on :8080 · ui dist:', uiDist));
