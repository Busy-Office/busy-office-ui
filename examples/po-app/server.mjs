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
// Cost-centre master data — did not exist before this spike. Every "CC-nnnn"
// in the app up to now was an ad-hoc string literal; mass-change validated
// FORMAT only (/^CC-\d{4}$/), so a well-formed but nonexistent code silently
// "succeeded". A real catalog is what value-help needs to search against,
// and it happens to close that correctness gap too.
const COST_CENTERS = [
  { code: 'CC-1180', name: 'Operations' },
  { code: 'CC-2205', name: 'Logistics' },
  { code: 'CC-4021', name: 'Facilities' },
  { code: 'CC-3310', name: 'Sales' },
  { code: 'CC-9002', name: 'R&D' },
  { code: 'CC-5540', name: 'Customer Support' },
  { code: 'CC-6610', name: 'IT Infrastructure' },
];
// Hoisted from spendScreen (explore/role-home-po-app spike): the dashboard's
// real Progress card needs the same budget figures spendScreen already had,
// and a second copy would be the exact duplication this project's own
// Standardize doctrine refuses.
//
// Values corrected in the same spike (real, pre-existing bug, reproduced
// on an unmodified checkout BEFORE this fix — not introduced by hoisting):
// the originals (80000/15000/25000, set 2026-08-15 against a 5-row `pos`)
// were never revisited when the 25-row backfill landed, so /spend showed
// every cost centre pinned at 134%/448%/330% "review before approving" —
// every progress bar red, always, which demonstrates none of the tone
// system's three states. Recomputed from real committed (non-Rejected)
// spend against the CURRENT `pos`, chosen to land one CC in each tone
// band (normal/warning/danger) so the demo shows the system actually
// working, not permanently maxed out.
const budgets = { 'CC-1180': 110000, 'CC-2205': 70000, 'CC-4021': 95000 };
const PAGE_SIZE = 10;
const audit = [];
// Notifications: a persistent, unread-tracked activity feed (roadmap
// Explore, explore/notification-po-app spike). The approve dialog has
// always had a "Notify additional approvers" field (adlg-notify below);
// nothing ever rendered anywhere those notified people could actually
// see anything — only ephemeral toasts existed, gone on next page load.
// Same shape as `audit` above (push at the same four points audit
// already hooks), so this reuses established insertion points rather
// than inventing new ones.
let notifSeq = 0;
const notifications = [];
function notify(title, detail, source, href) {
  notifications.unshift({
    id: `N-${++notifSeq}`, unread: true, title, detail, source, href,
    t: new Date().toISOString(),
  });
}
const money = (n) =>
  '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
// Display money as .bo-amount (roadmap 92.4) — the framework's display
// component for scanned columns: muted currency affix + muted fraction,
// tabular figures. Same text content as money(), so nothing that asserts
// on textContent changes.
const moneyHtml = (n, strong = false) => {
  const m = money(n);
  return `<span class="bo-amount${strong ? ' bo-amount--strong' : ''}"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${m.slice(1, -3)}<span class="bo-amount__fraction">${m.slice(-3)}</span></span></span>`;
};
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
    ${notifBellHtml()}
    <div class="bo-segmented" role="group" aria-label="Density" id="density-switch">
      ${DENSITIES.map((d) => `<input class="bo-segmented__input bo-visually-hidden" type="radio"
          name="density" id="density-${d}" value="${d}"${d === density ? ' checked' : ''}>
      <label class="bo-segmented__option" for="density-${d}">${d[0].toUpperCase()}${d.slice(1)}</label>`).join('\n      ')}
    </div>
  </header>
  <nav class="bo-sidebar-nav bo-app-shell__sidebar" aria-label="Main">
    <ul>
      <li><a class="bo-sidebar-nav__link" href="/" ${current === '/' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--grid bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Dashboard</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/inbox" ${current === '/inbox' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--check-circle bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Inbox</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/pos" ${current === '/pos' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--invoice bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Purchase orders</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/spend" ${current === '/spend' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--chart bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Spend by CC</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/import" ${current === '/import' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--box bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Import</span></a></li>
      <li><a class="bo-sidebar-nav__link" href="/receive" ${current === '/receive' ? 'aria-current="page"' : ''}><span class="bo-icon bo-icon--barcode bo-sidebar-nav__icon" aria-hidden="true"></span><span class="bo-sidebar-nav__label">Receive</span></a></li>
    </ul>
  </nav>
  <main class="bo-app-shell__main"><div class="bo-stack bo-stack--loose">${main}</div></main>
</div>
<script type="module">
  import { initDialogs, initDataTables, initAlerts, initDropdowns } from '/assets/js/index.js';
  initDialogs(); initDataTables(); initAlerts(); initDropdowns();
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
/* One way to read a request body. There were two idioms across four
   handlers — `for await (const c of req)` and a Promise wrapping
   req.on('data') — doing the same job with different failure behaviour
   (Standardize sweep, 2026-08-17). Four call sites, one helper. */
const readBody = async (req) => {
  let body = '';
  for await (const chunk of req) body += chunk;
  return body;
};

const rowHtml = (p) => `<tr id="row-${p.id}"${p.bulkError ? ' data-row-state="error"' : ''}>
  <!-- The id is load-bearing: the bulk swap replaces this very row, so the
       checkbox the user pressed Enter on is destroyed. htmx restores focus
       after a swap only to an element with a matching id — without it the
       keyboard user is dumped on <body>. Verified both ways. -->
  <td><input type="checkbox" id="sel-${p.id}" name="id" value="${p.id}" class="bo-checkbox bo-data-table__row-select" aria-label="Select ${p.id}"${p.status !== 'Pending' ? ' disabled' : ''}></td>
  <td class="bo-data-table__col--code"><a href="/pos/${p.id}">${p.id}</a></td>
  <td data-col="vendor"><span class="bo-u-text-truncate" style="display: block; max-inline-size: 14rem">${p.vendor}</span></td>
  <td class="bo-data-table__col--secondary bo-data-table__col--code" data-col="cc">${p.cc}</td>
  <td class="bo-data-table__col--numeric">${moneyHtml(p.amount)}</td>
  <td data-col="status"><span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span>${
    p.bulkError ? ` <span class="bo-badge bo-badge--danger">${p.bulkError}</span>` : ''
  }</td>
</tr>`;

const tbodyHtml = (list) =>
  `<tbody id="po-rows">${list.map(rowHtml).join('')}</tbody>`;

/* The filter bar used to be pure decoration: the form submitted q/status and
   the server read neither, so Apply silently did nothing (2026-08-17). It
   also meant the "filters exclude everything" empty state — which the
   invoice-list pattern requires as a distinct state — could never occur in
   the reference app, so nobody had ever built it. */
/* QUERY TOKENS (roadmap 24.1). One search field carries typed tokens —
   `status:pending vendor:acme` — plus any free text. The SERVER parses;
   the framework contributes nothing new, because active tokens render as
   the .bo-chip that already ships. No new component, no new behavior.
   Unknown keys are deliberately NOT treated as tokens: they stay free
   text, so a vendor literally called "ref:99" still searches instead of
   silently matching nothing. */
const TOKEN_KEYS = { status: 'status', vendor: 'vendor', cc: 'cc' };

const parseQuery = (raw) => {
  const tokens = [];
  const free = [];
  for (const word of String(raw).trim().split(/\s+/).filter(Boolean)) {
    const m = /^([a-z]+):(.+)$/i.exec(word);
    const key = m && TOKEN_KEYS[m[1].toLowerCase()];
    if (key) tokens.push({ key, value: m[2] });
    else free.push(word);
  }
  return { tokens, free: free.join(' ') };
};

/* Rebuild the q string without one token — that is the chip's remove link,
   so removing a filter is a plain <a href>, not a click handler. */
const queryWithout = (raw, i) => {
  const { tokens, free } = parseQuery(raw);
  const kept = tokens.filter((_, n) => n !== i).map((t) => `${t.key}:${t.value}`);
  return [...kept, free].filter(Boolean).join(' ');
};

const filterPos = ({ q = '', status = '' }) => {
  const { tokens, free } = parseQuery(q);
  const needle = free.toLowerCase();
  return pos.filter((p) => {
    if (status && status !== 'All' && p.status !== status) return false;
    for (const t of tokens) {
      const field = String(p[t.key] ?? '').toLowerCase();
      if (!field.includes(t.value.toLowerCase())) return false;
    }
    if (!needle) return true;
    return `${p.id} ${p.vendor} ${p.cc}`.toLowerCase().includes(needle);
  });
};

const tokenChipsHtml = (q, status) => {
  const { tokens } = parseQuery(q);
  if (!tokens.length) return '';
  const qs = (newQ) => {
    const u = new URLSearchParams();
    if (newQ) u.set('q', newQ);
    if (status && status !== 'All') u.set('status', status);
    const str = u.toString();
    return '/pos' + (str ? '?' + str : '');
  };
  return `
<div class="bo-cluster" role="group" aria-label="Active filters" style="--bo-cluster-gap: var(--bo-space-2)">
  <span class="bo-u-text-muted bo-u-text-sm">Filtering by</span>
  ${tokens
    .map(
      (t, i) => `<span class="bo-chip">${esc(t.key)}: ${esc(t.value)}
    <a class="bo-chip__remove" href="${esc(qs(queryWithout(q, i)))}"
       aria-label="Remove filter ${esc(t.key)} ${esc(t.value)}">&times;</a></span>`,
    )
    .join('')}
</div>`;
};

const esc = (v) => String(v).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* TWO empties, deliberately different. First-run empty offers the action
   that creates data; filtered empty must NOT — the records exist, the
   filters are hiding them, so the way out is clearing the filters. Getting
   this wrong sends a clerk off to re-key a PO that is already in the
   system. */
const emptyHtml = (filtered) => `
<div class="bo-state">
  <span class="bo-state__icon" aria-hidden="true">${filtered ? '\u{1F50D}' : '\u{1F4ED}'}</span>
  <p class="bo-state__title">${
    filtered ? 'No purchase orders match these filters' : 'No purchase orders yet'
  }</p>
  <p class="bo-state__description">${
    filtered
      ? `All ${pos.length} orders are hidden by the current search or status.`
      : 'Purchase orders will appear here once they are raised.'
  }</p>
  <div class="bo-state__actions">
    ${
      filtered
        ? '<a class="bo-btn bo-btn--secondary" href="/pos">Clear filters</a>'
        : '<a class="bo-btn" href="/pos/new">New purchase order</a>'
    }
  </div>
</div>`;

// Server-side search for the value-help picker — the docs demo filters
// client-side ("six rows fit in the page") and explicitly says a real
// picker asks the server. Dogfooding that half for real: debounced via
// hx-trigger's delay:250ms, one request per pause, not per keystroke.
const costCenterResults = (q) => {
  const term = (q || '').trim().toLowerCase();
  const matches = COST_CENTERS.filter(
    (c) => !term || c.code.toLowerCase().includes(term) || c.name.toLowerCase().includes(term),
  );
  if (!matches.length) {
    return `<div class="bo-state" id="cc-empty">
      <p class="bo-state__title">No cost centre matches "${esc(q)}"</p>
      <p class="bo-state__description">${COST_CENTERS.length} cost centres exist — none of them match.</p>
    </div>`;
  }
  return `<div class="bo-data-table-container" tabindex="0">
    <table class="bo-data-table" data-density="compact">
      <caption class="bo-visually-hidden">Cost centres matching your search</caption>
      <thead><tr><th scope="col">Code</th><th scope="col">Name</th></tr></thead>
      <tbody>
        ${matches
          .map(
            (c) => `<tr>
          <td class="bo-data-table__col--code">
            <button class="bo-btn bo-btn--sm bo-btn--ghost" type="button" data-cc-pick="${c.code}">${c.code}</button>
          </td>
          <td>${esc(c.name)}</td>
        </tr>`,
          )
          .join('')}
      </tbody>
    </table>
  </div>`;
};

// A trigger button for the cost-centre picker. data-cc-target names the
// field THIS button fills — the picker dialog is one shared element per
// page, so multiple triggers (mass-change, new-PO) need to say which field
// they're for. Factored out (roadmap Explore, po-create spike) so the
// dialog markup + wiring exist ONCE, not once per form that needs it —
// the mass-change dialog had its own inline copy before this.
const costCenterPickerTrigger = (targetFieldId) => `<button class="bo-btn bo-btn--secondary" type="button"
  data-dialog-trigger="cc-picker" data-cc-target="${targetFieldId}" aria-label="Find a cost centre">Find…</button>`;

// The shared dialog + its wiring. Include ONCE per page, alongside any
// number of costCenterPickerTrigger() buttons.
const costCenterPickerHtml = () => `
<dialog class="bo-dialog" id="cc-picker" data-state="closed" aria-labelledby="cc-picker-title">
  <div class="bo-dialog__header">
    <h2 class="bo-dialog__title" id="cc-picker-title">Find a cost centre</h2>
    <form method="dialog"><button class="bo-btn bo-btn--sm bo-btn--ghost" type="submit" aria-label="Close">×</button></form>
  </div>
  <div class="bo-dialog__body">
    <form class="bo-filter-bar" role="search" aria-label="Cost centre search" onsubmit="return false">
      <input class="bo-input" type="search" id="cc-q" name="q" aria-label="Search cost centres"
        placeholder="Code or name…" hx-get="/cost-centers" hx-trigger="input changed delay:250ms, search"
        hx-target="#cc-results" hx-swap="innerHTML">
    </form>
    <div id="cc-results">${costCenterResults('')}</div>
  </div>
</dialog>
<script type="module">
  // Same "fill field, close, refocus the FIELD (not the trigger)" behavior
  // the docs' own value-help pattern documents. Which field to fill is read
  // from whichever [data-cc-target] trigger was clicked most recently —
  // captured at click time so it works for any number of triggers on one
  // page without the dialog needing to know about them in advance.
  let ccTargetField = null;
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-cc-target]');
    if (trigger) ccTargetField = trigger.getAttribute('data-cc-target');
  });
  const ccPicker = document.getElementById('cc-picker');
  if (ccPicker) {
    ccPicker.addEventListener('click', (e) => {
      const pick = e.target.closest('[data-cc-pick]');
      if (!pick || !ccTargetField) return;
      const field = document.getElementById(ccTargetField);
      field.value = pick.getAttribute('data-cc-pick');
      field.dispatchEvent(new Event('change', { bubbles: true }));
      ccPicker.close('picked');
      field.focus();
    });
  }
</script>`;

// The vendor/cost-centre/amount validation both /pos/new and /pos/:id/edit
// need — was two identical copies (the field-editor spike duplicated the
// PO-creation spike's rules word for word) until a Standardize dispatch,
// triggered by spotting exactly this while triaging the next wake, not by
// the round counter. One rule set, used by both POST handlers.
function parsePoFields(form) {
  const values = {
    vendor: (form.get('vendor') ?? '').trim(),
    cc: (form.get('cc') ?? '').trim().toUpperCase(),
    amount: (form.get('amount') ?? '').trim(),
  };
  const errors = {};
  if (!values.vendor) errors.vendor = 'Vendor is required.';
  if (!values.cc) errors.cc = 'Cost centre is required.';
  else if (!COST_CENTERS.some((c) => c.code === values.cc)) errors.cc = `"${values.cc}" is not a cost centre.`;
  const amountNum = Number(values.amount);
  if (!values.amount || !Number.isFinite(amountNum) || amountNum <= 0) errors.amount = 'Enter an amount greater than zero.';
  return { values, errors, amountNum };
}

const listScreen = (query = {}) => {
  const rows = filterPos(query);
  const filtering = Boolean((query.q || '').trim() || (query.status && query.status !== 'All'));
  return `
<div class="bo-cluster bo-cluster--split">
  <h1>Purchase orders</h1>
  <!-- The only way to reach /pos/new used to be the empty state, which
     never fires with seeded data — a real user could never actually find
     this route. A persistent action here is what a real list screen has. -->
  <a class="bo-btn" href="/pos/new">New purchase order</a>
</div>
<form class="bo-filter-bar" role="search" aria-label="PO filters" method="get" action="/pos">
  <input class="bo-input" type="search" name="q" aria-label="Search POs" placeholder="Search…" style="max-inline-size: 12rem" value="${esc(query.q || '')}">
  <select class="bo-select" name="status" style="inline-size:auto" aria-label="Status">
    ${['All', 'Pending', 'Approved', 'Rejected']
      .map((o) => `<option${o === (query.status || 'All') ? ' selected' : ''}>${o}</option>`)
      .join('')}
  </select>
  <button class="bo-btn bo-btn--secondary" type="submit">Apply</button>
</form>
<p class="bo-u-text-muted bo-u-text-sm">Type tokens in the search box:
<code>status:pending</code> <code>vendor:acme</code> <code>cc:4021</code> — plus any free text.</p>
${tokenChipsHtml(query.q || '', query.status || 'All')}
<div id="bulk-result"></div>
${rows.length === 0 ? emptyHtml(filtering) : `<!-- A real <form> around the selection, not hx-include on the button. Both
     POST the same ids, but only the form gets native implicit submission:
     Enter from ANY row checkbox runs the bulk action, instead of
     Shift+Tab-ing back up to a toolbar that sits above the table (measured
     at 32 presses from row 30). The safe action is FIRST because implicit
     submission activates the first submit button in the form. -->
<form id="po-bulk" hx-post="/pos/bulk-approve" hx-target="#po-rows" hx-swap="outerHTML">
<div class="bo-data-table-container" tabindex="0">
  <div class="bo-data-table__toolbar">
    <div class="bo-data-table__bulk-actions" role="group" aria-label="Bulk actions">
      <button class="bo-btn" type="submit">Approve selected</button>
      <!-- MASS CHANGE shares this form's selection. formaction points the same
           checkboxes at a different endpoint, so there is one selection and no
           duplicate state — and it stays type="submit" so the keyboard path
           (Enter from any row) still reaches the SAFE action first. -->
      <button class="bo-btn bo-btn--secondary" type="button" data-dialog-trigger="mass-cc">Change cost centre…</button>
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
    ${tbodyHtml(rows.slice(0, PAGE_SIZE))}
  </table>
  ${rows.length > PAGE_SIZE ? `<div class="bo-data-table__footer" style="justify-content: center">
    <button class="bo-btn bo-btn--secondary" type="button" data-table-load-more id="po-load-more"
      data-po-offset="${PAGE_SIZE}">Load more (${rows.length - PAGE_SIZE} of ${rows.length} remaining)</button>
  </div>` : ''}
</div>
</form>`}
<dialog class="bo-dialog" id="mass-cc" data-state="closed" aria-labelledby="mass-cc-title">
  <div class="bo-dialog__header"><h2 class="bo-dialog__title" id="mass-cc-title">Change cost centre</h2></div>
  <div class="bo-dialog__body">
    <p class="bo-u-text-muted">Applies to the rows selected in the list — one
    validated operation, not one edit per row. A purchase order that is already
    decided needs a reversal, so it will be reported rather than changed.</p>
    <div class="bo-form-field" style="margin-block-start: var(--bo-space-3)">
      <label class="bo-form-field__label" for="mass-cc-value">New cost centre</label>
      <div class="bo-cluster">
        <input class="bo-input bo-input--code" id="mass-cc-value" name="cc" placeholder="CC-4021" form="po-bulk">
        <!-- value-help, dogfooded for real (roadmap Explore spike): a
             SECOND modal opened from inside an already-open one. The docs
             demo never has to handle this — it's the only dialog on its
             page. Native <dialog> stacks fine (each showModal() pushes to
             the top layer; closing pops back to the one beneath), and
             focus-trap is per-dialog in dialog.ts, so nothing needed
             changing in the framework to make this compose. -->
        ${costCenterPickerTrigger('mass-cc-value')}
      </div>
      <p class="bo-form-field__hint">Format CC-nnnn. An invalid or unknown value changes nothing at all.</p>
    </div>
  </div>
  <div class="bo-dialog__footer">
    <form method="dialog"><button class="bo-btn bo-btn--ghost" value="cancel">Cancel</button></form>
    <!-- formaction re-points the SAME form (and therefore the same selected
         ids) at the mass-change endpoint. -->
    <button class="bo-btn" type="submit" form="po-bulk" formaction="/pos/mass-change"
      hx-post="/pos/mass-change" hx-target="#po-rows" hx-swap="outerHTML" hx-include="#po-bulk">Change selected</button>
  </div>
</dialog>

${costCenterPickerHtml()}
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
};

// The creation screen /pos/new used to point to (a real dead link — see
// roadmap Explore, po-create spike: reachable only from the empty state,
// which never fires with seeded data, so nobody had ever actually loaded
// it). detail-form's own shape (fieldset + bo-form-row), scoped to the
// fields this app's data model actually has — no line items here, the
// `pos` records never had them.
const newPoScreen = (values = {}, errors = {}) => `
<h1>New purchase order</h1>
<form method="post" action="/pos/new" novalidate>
  <fieldset class="bo-form-section">
    <legend class="bo-form-section__legend">Order</legend>
    <div class="bo-form-row">
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="new-vendor">Vendor</label>
        <input class="bo-input" id="new-vendor" name="vendor" required
          value="${esc(values.vendor || '')}"
          ${errors.vendor ? `aria-invalid="true" aria-describedby="new-vendor-err"` : ''}>
        ${errors.vendor ? `<p class="bo-form-field__message" id="new-vendor-err" role="alert">${errors.vendor}</p>` : ''}
      </div>
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="new-cc">Cost centre</label>
        <div class="bo-cluster">
          <input class="bo-input bo-input--code" id="new-cc" name="cc" placeholder="CC-4021" required
            value="${esc(values.cc || '')}"
            ${errors.cc ? `aria-invalid="true" aria-describedby="new-cc-err"` : ''}>
          ${costCenterPickerTrigger('new-cc')}
        </div>
        ${errors.cc ? `<p class="bo-form-field__message" id="new-cc-err" role="alert">${errors.cc}</p>` : ''}
      </div>
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="new-amount">Amount</label>
        <input class="bo-input bo-input--numeric" id="new-amount" name="amount" type="number" min="0.01" step="0.01" required
          value="${esc(values.amount || '')}"
          ${errors.amount ? `aria-invalid="true" aria-describedby="new-amount-err"` : ''}>
        ${errors.amount ? `<p class="bo-form-field__message" id="new-amount-err" role="alert">${errors.amount}</p>` : ''}
      </div>
    </div>
  </fieldset>
  <div class="bo-form-actions">
    <a class="bo-btn bo-btn--secondary" href="/pos">Cancel</a>
    <button class="bo-btn" type="submit">Create purchase order</button>
  </div>
</form>
${costCenterPickerHtml()}
`;

/* ---------- STAGING / batch result (roadmap 24.3) ----------
   The Excel round-trip (M4) needs somewhere for rows to LAND before they
   become records: upload, validate every row, show what would happen, then
   apply only the rows that can be applied. The framework contributes only
   row states and badges — the validation and the apply are the server's.

   Tri-state, but only TWO row tints: an `error` row cannot be applied, a
   `warning` row can be applied with a caveat, and an OK row is a normal row
   whose confirmation is a success badge. A third tint for "nothing wrong"
   would be noise. */
const VENDORS = ['Acme Supply Co.', 'Globex Industrial', 'Initech GmbH', 'Umbrella Logistics', 'Stark Components'];
const LIMIT = 20000;

const validateStagedRow = (line, i) => {
  const [vendor = '', cc = '', amountRaw = ''] = line.split(',').map((c) => c.trim());
  const amount = Number(amountRaw.replace(/[^0-9.-]/g, ''));
  const row = { n: i + 1, vendor, cc, amount, raw: line };
  if (!vendor || !cc || !amountRaw) return { ...row, state: 'error', msg: 'Needs vendor, cost centre and amount' };
  if (!Number.isFinite(amount) || amount <= 0) return { ...row, state: 'error', msg: `"${amountRaw}" is not an amount` };
  if (!/^CC-\d{4}$/.test(cc)) return { ...row, state: 'error', msg: `Cost centre "${cc}" is not CC-nnnn` };
  const exact = VENDORS.find((v) => v.toLowerCase() === vendor.toLowerCase());
  if (!exact) {
    const near = VENDORS.find((v) => v.toLowerCase().startsWith(vendor.toLowerCase().slice(0, 4)));
    if (near) return { ...row, state: 'warning', vendor: near, msg: `Matched "${vendor}" to ${near}` };
    return { ...row, state: 'error', msg: `No vendor matches "${vendor}"` };
  }
  if (amount > LIMIT) return { ...row, state: 'warning', msg: `Over ${money(LIMIT)} — will need a second approver` };
  return { ...row, state: 'ok', msg: 'Ready to import' };
};

const STATE_TONE = { ok: 'success', warning: 'warning', error: 'danger' };
const STATE_WORD = { ok: 'Ready', warning: 'Check', error: 'Cannot import' };

/* A DOCUMENT-level condition: about the whole submission, not any one row.
   No row is wrong, so nothing here belongs on a row or in a field summary —
   it gets the strip at the top (see /patterns/validation-summary). The strip
   says what is still possible, not just what is blocked. */
const PERIOD_BUDGET_REMAINING = 60000;

const stagingScreen = (rows = null, applied = 0) => {
  const counts = rows ? rows.reduce((a, r) => ({ ...a, [r.state]: (a[r.state] || 0) + 1 }), {}) : {};
  const applyable = rows ? rows.filter((r) => r.state !== 'error') : [];
  const applicable = applyable.length;
  const batchTotal = applyable.reduce((t, r) => t + (Number.isFinite(r.amount) ? r.amount : 0), 0);
  const overBudget = batchTotal > PERIOD_BUDGET_REMAINING;
  return `
<h1>Import purchase orders</h1>
${applied ? `<div class="bo-alert bo-alert--success" role="alert"><p><strong>${applied} imported.</strong> Rows that could not be imported are still listed below.</p></div>` : ''}
${
  overBudget
    ? `<div class="bo-alert bo-alert--warning" role="alert">
    <p><strong>This batch totals ${money(batchTotal)}; only ${money(PERIOD_BUDGET_REMAINING)} is left in the period.</strong>
    No individual row is wrong — you can still validate and fix rows, but applying is blocked until the batch fits or the budget is raised.</p>
  </div>`
    : ''
}
<form method="post" action="/import" class="bo-stack">
  <div class="bo-form-field">
    <label class="bo-form-field__label" for="csv">Paste rows — vendor, cost centre, amount</label>
    <textarea class="bo-input" id="csv" name="csv" rows="5"
      placeholder="Acme Supply Co., CC-4021, 4200">${rows ? esc(rows.map((r) => r.raw).join('\n')) : ''}</textarea>
    <p class="bo-form-field__hint">One row per line. Nothing is created until you apply.</p>
  </div>
  <div class="bo-form-actions">
    <button class="bo-btn bo-btn--secondary" type="submit" name="action" value="validate">Validate</button>
  </div>
</form>
${
  rows === null
    ? ''
    : rows.length === 0
      ? `<div class="bo-state"><span class="bo-state__icon" aria-hidden="true">\u{1F4C4}</span>
           <p class="bo-state__title">Nothing to validate</p>
           <p class="bo-state__description">Paste at least one row above.</p></div>`
      : `
<div class="bo-alert bo-alert--${counts.error ? 'warning' : 'success'}" role="alert">
  <p><strong>${counts.ok || 0} ready, ${counts.warning || 0} to check, ${counts.error || 0} cannot import.</strong>
  Every row below says which it is and why.</p>
</div>
<div class="bo-data-table-container" tabindex="0">
  <table class="bo-data-table" data-density="compact">
    <thead><tr>
      <th scope="col">#</th><th scope="col">Vendor</th>
      <th scope="col">Cost centre</th>
      <th scope="col" class="bo-data-table__col--numeric">Amount</th>
      <th scope="col">Result</th>
    </tr></thead>
    <tbody>
      ${rows
        .map(
          (r) => `<tr${r.state === 'ok' ? '' : ` data-row-state="${r.state}"`}>
        <td class="bo-data-table__col--numeric">${r.n}</td>
        <td>${esc(r.vendor || '—')}</td>
        <td class="bo-data-table__col--code">${esc(r.cc || '—')}</td>
        <td class="bo-data-table__col--numeric">${Number.isFinite(r.amount) && r.amount > 0 ? money(r.amount) : '—'}</td>
        <td><span class="bo-badge bo-badge--${STATE_TONE[r.state]}">${STATE_WORD[r.state]}</span>
            <span class="bo-u-text-muted"> ${esc(r.msg)}</span></td>
      </tr>`,
        )
        .join('')}
    </tbody>
  </table>
</div>
<form method="post" action="/import" class="bo-form-actions">
  <input type="hidden" name="csv" value="${esc(rows.map((r) => r.raw).join('\n'))}">
  <button class="bo-btn" type="submit" name="action" value="apply"${applicable && !overBudget ? '' : ' disabled'}>
    Apply ${applicable} valid row${applicable === 1 ? '' : 's'}
  </button>
  <a class="bo-btn bo-btn--ghost" href="/import">Start over</a>
</form>
<p class="bo-u-text-muted bo-u-text-sm">The ${counts.error || 0} row(s) that cannot import are left for you to fix
and re-paste — applying valid rows never silently drops the rest.</p>`
}`;
};

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

// Field-editor, dogfooded for real (roadmap Explore spike). Before this,
// po-app had NO way to fix a mistake on a record — a typo'd vendor name or
// wrong amount could only be approved, rejected, or bulk-recosted; nothing
// let a user correct the record itself. Gated to Pending: an Approved/
// Rejected PO already has consequences downstream (the same reasoning
// mass-change uses — "already decided needs a reversal, not a re-cost").
const editableOrderFields = (p, errors = {}) => `
<form method="post" action="/pos/${p.id}/edit" data-row-edit>
  <div class="bo-data-table-container" tabindex="0">
    <table class="bo-data-table" data-row-edit data-density="compact">
      <caption class="bo-visually-hidden">${p.id} order fields, one row per field</caption>
      <thead><tr><th scope="col" style="inline-size: 10rem">Field</th><th scope="col">Value</th></tr></thead>
      <tbody>
        <tr data-row-id="vendor">
          <th scope="row">Vendor</th>
          <td>
            <input class="bo-input bo-input--seamless" id="edit-vendor" name="vendor" value="${esc(p.vendor)}"
              aria-label="Vendor" ${errors.vendor ? `aria-invalid="true" aria-describedby="edit-vendor-err"` : ''}>
            ${errors.vendor ? `<p class="bo-form-field__message" id="edit-vendor-err" role="alert">${errors.vendor}</p>` : ''}
          </td>
        </tr>
        <tr data-row-id="cc">
          <th scope="row">Cost centre</th>
          <td>
            <div class="bo-cluster">
              <input class="bo-input bo-input--code bo-input--seamless" id="edit-cc" name="cc" value="${esc(p.cc)}"
                aria-label="Cost centre" ${errors.cc ? `aria-invalid="true" aria-describedby="edit-cc-err"` : ''}>
              ${costCenterPickerTrigger('edit-cc')}
            </div>
            ${errors.cc ? `<p class="bo-form-field__message" id="edit-cc-err" role="alert">${errors.cc}</p>` : ''}
          </td>
        </tr>
        <tr data-row-id="amount">
          <th scope="row">Amount</th>
          <td>
            <input class="bo-input bo-input--numeric bo-input--seamless" id="edit-amount" name="amount" type="number"
              min="0.01" step="0.01" value="${p.amount}" aria-label="Amount"
              ${errors.amount ? `aria-invalid="true" aria-describedby="edit-amount-err"` : ''}>
            ${errors.amount ? `<p class="bo-form-field__message" id="edit-amount-err" role="alert">${errors.amount}</p>` : ''}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="bo-data-table__footer">
    <span class="bo-badge bo-badge--warning" data-any-dirty hidden>Unsaved changes</span>
    <button class="bo-btn bo-btn--secondary" type="reset">Cancel</button>
    <button class="bo-btn" type="submit">Save changes</button>
  </div>
</form>
${costCenterPickerHtml()}
<script type="module">
  import { initRowEdit } from '/assets/js/index.js';
  initRowEdit();
  // Same "aggregate per-row dirty into one badge" split field-editor.astro
  // itself documents: the framework marks each ROW dirty, rolling that into
  // one page-level indicator is app state, three lines.
  const table = document.querySelector('table[data-row-edit]');
  const badge = document.querySelector('[data-any-dirty]');
  // Roadmap Slice 70.1: Save changes and Approve... were both visible at
  // once whenever a Pending record was open (Objective grill, 2026-08-20) —
  // two primary actions sharing one screen. Hiding Approve while a row is
  // mid-edit keeps at most one visible, the same "never both visible" bar
  // the wizard's Next/Submit pair already meets.
  const approveCluster = document.getElementById('approve-cluster');
  const sync = () => {
    const dirty = !!table.querySelector('tr[data-row-state="dirty"]');
    badge.hidden = !dirty;
    if (approveCluster) approveCluster.hidden = dirty;
  };
  document.addEventListener('input', sync);
  document.addEventListener('change', sync);
  document.addEventListener('reset', () => setTimeout(sync, 0));
</script>`;

const detailScreen = (p, editErrors = null) => `
<h1>${p.id} <span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></h1>
<div class="bo-grid" style="--bo-grid-min: 18rem">
  <fieldset class="bo-form-section">
    <legend class="bo-form-section__legend">Order</legend>
    ${p.status === 'Pending'
      ? editableOrderFields(p, editErrors || {})
      : `<dl class="bo-kv">
      <div><dt>Vendor</dt><dd>${p.vendor}</dd></div>
      <div><dt>Cost center</dt><dd>${p.cc}</dd></div>
      <div><dt>Amount</dt><dd>${moneyHtml(p.amount)}</dd></div>
    </dl>`}
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
${p.status === 'Pending' ? approveDialogHtml(p) : ''}`;

// Extracted from detailScreen (roadmap 116.2 spike) so /inbox's expand-in-place
// preview reuses the SAME dialog and endpoints, not a second copy — the exact
// promise ROADMAP 116.1 makes for the docs pattern, tested here for real.
//
// IDs are suffixed per PO (approve-dlg-${p.id}, …) rather than fixed. A first
// version used fixed IDs on the reasoning "only one routine row renders per
// page load" — check-po-app's OWN gate disproved that on its first run: an
// earlier check in that same suite edits PO-88213's amount down to $77.25,
// which puts it under /inbox's own threshold too, so two routine rows DID
// share one page — exactly the "instrument's first output is not evidence"
// case, just against a feature instead of a check.
function approveDialogHtml(p) {
  const id = (suffix) => `${suffix}-${p.id}`;
  return `
<div class="bo-cluster" id="${id('approve-cluster')}">
  <button class="bo-btn" data-dialog-trigger="${id('approve-dlg')}">Approve…</button>
</div>
<dialog class="bo-dialog" id="${id('approve-dlg')}" aria-labelledby="${id('adlg-t')}" data-state="closed">
  <form method="dialog">
    <header class="bo-dialog__header">
      <h2 class="bo-dialog__title" id="${id('adlg-t')}">Approve ${p.id}</h2>
      <button class="bo-btn bo-btn--ghost bo-btn--icon" value="cancel" aria-label="Close">✕</button>
    </header>
    <div class="bo-dialog__body" id="${id('adlg-body')}">
      <p>Approve ${p.id} for <span class="bo-u-tabular">${money(p.amount)}</span>?</p>
      <div class="bo-form-field">
        <span class="bo-form-field__label" id="${id('adlg-note-label')}">Approval note</span>
        <div class="bo-richtext">
          <div class="bo-richtext__toolbar" role="group" aria-label="Formatting">
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="bold" aria-pressed="false"><strong>B</strong></button>
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="italic" aria-pressed="false"><em>I</em></button>
            <span class="bo-richtext__divider"></span>
            <button class="bo-btn bo-btn--ghost" type="button" data-richtext-cmd="insertUnorderedList">• List</button>
          </div>
          <div class="bo-richtext__content bo-prose" contenteditable="true" id="${id('adlg-note')}"
               role="textbox" aria-multiline="true" aria-labelledby="${id('adlg-note-label')}"></div>
        </div>
      </div>
      <div class="bo-form-field">
        <span class="bo-form-field__label" id="${id('adlg-notify-label')}">Notify additional approvers</span>
        <div class="bo-tag-input" id="${id('adlg-notify')}" role="group" aria-labelledby="${id('adlg-notify-label')}">
          <input class="bo-tag-input__field" id="${id('adlg-notify-field')}" type="text"
              placeholder="Type a name, press Enter">
        </div>
      </div>
    </div>
    <footer class="bo-dialog__footer">
      <button class="bo-btn bo-btn--secondary" value="cancel">Cancel</button>
      <button class="bo-btn bo-btn--danger-ghost" type="button"
        hx-post="/pos/${p.id}/reject" hx-target="#${id('adlg-body')}" hx-swap="innerHTML"
        hx-vals='js:{note: document.getElementById("${id('adlg-note')}").innerHTML}'>Reject</button>
      <button class="bo-btn" value="confirm"
        hx-post="/pos/${p.id}/approve" hx-target="#timeline-${p.id}" hx-swap="outerHTML"
        hx-vals='js:{note: document.getElementById("${id('adlg-note')}").innerHTML}'>Approve</button>
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
  const notify = document.getElementById('${id('adlg-notify')}');
  const field = document.getElementById('${id('adlg-notify-field')}');
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
</script>`;
}

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
  // ERP screen or fights. (`budgets` moved to module scope — see its
  // definition near COST_CENTERS.)
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
      // Real bug found in the role-home dogfood spike (2026-08-22),
      // reproduced on an unmodified checkout first: a Rejected PO never
      // actually spent anything, but was counted against budget here
      // anyway, compounding with the stale budget figures above to pin
      // every cost centre at "review before approving" permanently.
      const spent = list.reduce((s, p) => s + (p.status === 'Rejected' ? 0 : p.amount), 0);
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
        <td><span class="bo-u-text-truncate" style="display: block; max-inline-size: 14rem">${p.vendor}</span></td>
        <td><span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></td>
        <td class="bo-data-table__col--numeric">${moneyHtml(p.amount)}</td>
      </tr>`).join('')}
      <tr>
        <td colspan="3" class="bo-data-table__col--right">Subtotal ${cc}</td>
        <td class="bo-data-table__col--numeric"${pct >= 90 ? ' data-tone="danger"' : pct >= 75 ? ' data-tone="warning"' : ''}>${moneyHtml(spent)}${pct >= 90 ? ' <span class="bo-u-text-muted">— over budget threshold</span>' : ''}</td>
      </tr>
    </tbody>`;
    }).join('')}
    <tbody>
      <tr>
        <td colspan="3" class="bo-data-table__col--right"><strong>Grand total</strong></td>
        <td class="bo-data-table__col--numeric">${moneyHtml(grand, true)}</td>
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

// Notification bell + screen — dogfoods /patterns/notification against real
// events (explore/notification-po-app, 2026-08-22). Composed from the
// pattern's own shape: bell dropdown = latest 3 + count badge; screen =
// full readable history with Mark-read/Dismiss. Real unread contract
// (two-channel: worded badge + "read" in the byline, never colour alone).
const notifBadgeHtml = (oob = false) => {
  const unread = notifications.filter((n) => n.unread).length;
  const oobAttr = oob ? ' hx-swap-oob="true"' : '';
  return unread
    ? `<span class="bo-badge bo-badge--warning" id="notif-count"${oobAttr} hx-get="/notifications/count" hx-trigger="every 60s" hx-swap="outerHTML">${unread} unread</span>`
    : `<span id="notif-count"${oobAttr} hx-get="/notifications/count" hx-trigger="every 60s" hx-swap="outerHTML"></span>`;
};
const notifItemHtml = (n, compact = false) => {
  if (compact) {
    return `<a class="bo-dropdown__item" href="/notifications" data-notification-id="${n.id}"${n.unread ? ' data-unread="true"' : ''}>${n.unread ? '<strong>' : ''}${n.title}${n.unread ? '</strong>' : ''} · ${byline(n.t)}</a>`;
  }
  return `<article class="bo-alert" id="notif-${n.id}" data-notification-id="${n.id}"${n.unread ? ' data-unread="true"' : ''} aria-label="${n.unread ? 'Unread notification' : 'Notification'}">
    <div>
      <p>${n.unread ? '<span class="bo-badge bo-badge--warning">Unread</span> ' : ''}<strong>${n.title}</strong> — ${n.detail}</p>
      <p class="bo-byline bo-byline--compact">${n.source} · ${byline(n.t)}${n.unread ? '' : ' · read'}</p>
    </div>
    <span class="bo-cluster">
      ${n.href ? `<a class="bo-btn bo-btn--sm bo-btn--secondary" href="${n.href}">Open</a>` : ''}
      ${n.unread ? `<button class="bo-btn bo-btn--sm bo-btn--ghost" type="button" hx-post="/notifications/${n.id}/read" hx-target="#notif-${n.id}" hx-swap="outerHTML">Mark read</button>` : ''}
      <button class="bo-btn bo-btn--sm bo-btn--ghost" type="button" aria-label="Dismiss: ${n.title}" hx-post="/notifications/${n.id}/dismiss" hx-target="#notif-${n.id}" hx-swap="outerHTML swap:200ms">Dismiss</button>
    </span>
  </article>`;
};
const byline = (iso) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
const notifBellHtml = () => `<button class="bo-btn bo-btn--secondary" type="button" popovertarget="notif-menu">
  Notifications ${notifBadgeHtml()}
</button>
<div class="bo-dropdown__menu" id="notif-menu" popover>
  ${notifications.length
    ? notifications.slice(0, 3).map((n) => notifItemHtml(n, true)).join('\n  ') +
      '\n  <div class="bo-dropdown__separator"></div>\n  <a class="bo-dropdown__item" href="/notifications">View all notifications</a>'
    : '<p class="bo-dropdown__item bo-u-text-muted" style="pointer-events: none">No notifications</p>'}
</div>`;
const notificationScreen = () => `
<h1>Notifications</h1>
<div class="bo-stack" style="max-inline-size: 44rem" id="notif-list">
  ${notifications.length
    ? notifications.map((n) => notifItemHtml(n)).join('\n  ')
    : '<p class="bo-u-text-muted">No notifications.</p>'}
</div>`;

// /inbox (roadmap 116.2 spike, dogfooding 116.1 for real). po-app's real
// data has only ONE row type worth a worklist — Pending PO approvals; no
// exceptions/tasks/jobs are modeled — so, honestly, there is no cross-type
// filter to build: a segmented control with one real option is chrome, not
// a feature, so it is left out rather than faked. The "why it's yours"
// column still earns its place even with one type.
//
// Escalation threshold reuses the ERP round-table review's own guardrail
// (116's ROADMAP entry): high-value routes to full review. Real data:
// PO-88210 ($4,208) is the only Pending PO under $10,000 today, so it is
// the one row that expands in place; PO-88213 ($12,400) and PO-88214
// ($56,000) both link out — a real escalated/routine split, not staged.
//
// Two more honest gaps found dogfooding, not built around: po-app's PO
// records carry no submitted-date, so there is no real "Waiting" column
// (the docs demo's is illustrative; a fabricated one here would be a lie
// the framework's own doctrine refuses) — and no seeded attachment data
// per PO, so the preview has no attachment line either. Both are gaps in
// po-app's OWN data model, not in the inbox pattern or in 116.1.
const INBOX_ESCALATE_OVER = 10000;
const inboxScreen = () => {
  const pending = pos.filter((p) => p.status === 'Pending');
  const rows = pending.map((p) => {
    const escalated = p.amount > INBOX_ESCALATE_OVER;
    return `
    <tr>
      <td><span class="bo-badge bo-badge--type">PO</span> ${p.id} · ${esc(p.vendor)} · ${moneyHtml(p.amount)}</td>
      <td>Awaiting <strong>your approval</strong></td>
      <td>${escalated
        ? `<a class="bo-btn bo-btn--sm bo-btn--secondary" href="/pos/${p.id}">Review</a>`
        : `<button class="bo-btn bo-btn--sm bo-btn--secondary" type="button" aria-expanded="true" aria-controls="inb-detail-${p.id}">Preview</button>`}</td>
    </tr>
    ${!escalated ? `
    <tr id="inb-detail-${p.id}">
      <td colspan="3">
        <div class="bo-widget">
          <div class="bo-widget__body">
            <dl class="bo-kv bo-kv--rows">
              <div><dt>Vendor</dt><dd>${esc(p.vendor)}</dd></div>
              <div><dt>Cost centre</dt><dd>${esc(p.cc)}</dd></div>
              <div><dt>Amount</dt><dd>${moneyHtml(p.amount)}</dd></div>
            </dl>
            ${approveDialogHtml(p)}
          </div>
        </div>
      </td>
    </tr>` : ''}`;
  }).join('');
  return `
<h1>Inbox</h1>
<p class="bo-byline bo-byline--compact">${pending.length} item${pending.length === 1 ? '' : 's'} need your approval</p>
${pending.length === 0 ? `
<div class="bo-widget"><div class="bo-widget__body">
  <p><strong>Inbox zero</strong> — nothing is waiting on you.</p>
</div></div>` : `
<div class="bo-data-table-container" tabindex="0">
  <table class="bo-data-table">
    <caption class="bo-visually-hidden">Purchase orders needing your approval</caption>
    <thead><tr>
      <th scope="col">Item</th>
      <th scope="col">Why it's yours</th>
      <th scope="col"><span class="bo-visually-hidden">Action</span></th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
</div>
<p class="bo-u-text-muted">Under ${money(INBOX_ESCALATE_OVER)} decides in place, right here; at or above it
links out to the full record — the framework's inbox pattern's own escalation rule.</p>`}`;
};

// Rebuilt against the real role-home pattern shape (explore/role-home-po-app,
// 2026-08-22) — the original above predates role-home (110.1) and used the
// same primitives (.bo-widget-grid/.bo-stat) but not its actual anatomy
// (Identity line, "Needs you" spanning two columns, Stat/Progress/Recent
// cards). Every number below is DERIVED from real `pos`/`budgets` data, no
// synthetic deltas — po-app keeps no historical snapshot to diff against,
// so a stat that would need one (the demo page's "+2 since yesterday") is
// simply not shown, rather than faked. Two real adaptations the honest
// rebuild forced, kept rather than papered over:
//  1. DONE 2026-08-22 (116.2): "Needs you" now links to the real /inbox
//     route built above — this gap is closed.
//  2. "Recent" is relabelled "Recently added" — po-app tracks no per-user
//     view history (no session), but DOES know insertion order (imports
//     and /pos/new both unshift). Recently-added is real; recently-viewed
//     would have been fabricated.
const dashScreen = () => {
  const pending = pos.filter((p) => p.status === 'Pending');
  const totalPending = pending.reduce((s, p) => s + p.amount, 0);
  const grandBudget = Object.values(budgets).reduce((s, b) => s + b, 0);
  const grandSpent = pos.reduce((s, p) =>
    s + (budgets[p.cc] !== undefined && p.status !== 'Rejected' ? p.amount : 0), 0);
  const pct = grandBudget ? Math.round((grandSpent / grandBudget) * 100) : 0;
  const recent = pos.slice(0, 3);
  return `
<h1>Dashboard</h1>
<p class="bo-byline bo-byline--compact">Signed in as A. Reyes · AP Clerk</p>
<div class="bo-widget-grid" style="--bo-widget-min: 16rem">
  <section class="bo-widget bo-widget--span-2">
    <div class="bo-widget__header">
      <span class="bo-widget__title">Needs you</span>
      <a class="bo-btn bo-btn--sm bo-btn--secondary" href="/inbox">View queue</a>
    </div>
    <div class="bo-widget__body">
      <span class="bo-stat">
        <span class="bo-stat__label">Awaiting your approval</span>
        <span class="bo-stat__value">${pending.length}</span>
      </span>
    </div>
  </section>

  <section class="bo-widget">
    <div class="bo-widget__header"><span class="bo-widget__title">My open orders</span></div>
    <div class="bo-widget__body">
      <span class="bo-stat">
        <span class="bo-stat__label">Value in flight</span>
        <span class="bo-stat__value">${money(totalPending)}</span>
        <span class="bo-stat__delta">across ${pending.length} PO${pending.length === 1 ? '' : 's'}</span>
      </span>
    </div>
  </section>

  <section class="bo-widget">
    <div class="bo-widget__header"><span class="bo-widget__title">Budget consumed</span></div>
    <div class="bo-widget__body">
      <p style="margin-block: 0 var(--bo-space-2)">${pct}% of ${money(grandBudget)} total</p>
      <progress class="bo-progress${pct >= 90 ? ' bo-progress--danger' : pct >= 75 ? ' bo-progress--warning' : ''}" value="${Math.min(pct, 100)}" max="100" aria-label="${pct}% of total budget consumed"></progress>
      <p class="bo-u-text-muted" style="margin-block-end: 0"><a href="/spend">Spend by cost center</a></p>
    </div>
  </section>

  <section class="bo-widget">
    <div class="bo-widget__header"><span class="bo-widget__title">Recently added</span></div>
    <div class="bo-widget__body">
      <ul class="bo-stack bo-stack--tight docs-list-bare" style="margin: 0">
        ${recent.map((p) => `<li><a href="/pos/${p.id}">${p.id} · ${p.vendor}</a> <span class="bo-badge bo-badge--${tone[p.status]}">${p.status}</span></li>`).join('')}
      </ul>
    </div>
  </section>
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
      const query = {
        q: url.searchParams.get('q') || '',
        status: url.searchParams.get('status') || 'All',
      };
      return res.end(page('Purchase orders', '/pos', listScreen(query), density));
    }
    if (path === '/pos/new' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('New purchase order', '/pos', newPoScreen(), density));
    }
    if (path === '/pos/new' && req.method === 'POST') {
      const form = new URLSearchParams(await readBody(req));
      const { values, errors, amountNum } = parsePoFields(form);

      if (Object.keys(errors).length) {
        // Same document-level-vs-field-level split as mass-change: THESE
        // are field errors (the user can fix them right here), so they go
        // on the fields and the form re-renders with values preserved —
        // never a blank form, matching detail-form's own documented
        // contract ("422 → the SAME form re-rendered... values preserved").
        res.writeHead(422, { 'content-type': 'text/html' });
        return res.end(page('New purchase order', '/pos', newPoScreen(values, errors), density));
      }

      const id = `PO-${88300 + pos.length}`;
      pos.unshift({ id, vendor: values.vendor, cc: values.cc, amount: amountNum, status: 'Pending' });
      audit.push({ t: new Date().toISOString(), what: `${id} raised by demo user` });
      res.writeHead(302, { location: `/pos/${id}` });
      return res.end();
    }
    if (path === '/cost-centers' && req.method === 'GET') {
      // Fragment only — the picker's own results region, not a page. Real
      // server-side narrowing against COST_CENTERS, not a client filter.
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(costCenterResults(url.searchParams.get('q') ?? ''));
    }
    if (path === '/import' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Import', '/import', stagingScreen(), density));
    }
    if (path === '/import' && req.method === 'POST') {
      const body = await readBody(req);
      const form = new URLSearchParams(body);
      const lines = (form.get('csv') ?? '').split('\n').map((l) => l.trim()).filter(Boolean);
      const rows = lines.map(validateStagedRow);
      if (form.get('action') !== 'apply') {
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(page('Import', '/import', stagingScreen(rows), density));
      }
      // The document-level condition is enforced HERE too, not only by the
      // disabled button: a disabled control is a hint, never a guarantee.
      const applyableRows = rows.filter((r) => r.state !== 'error');
      const total = applyableRows.reduce((t, r) => t + (Number.isFinite(r.amount) ? r.amount : 0), 0);
      if (total > PERIOD_BUDGET_REMAINING) {
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(page('Import', '/import', stagingScreen(rows), density));
      }
      // Apply only what CAN be applied, and keep the rest on screen. Errors
      // are never silently dropped — the clerk has to see what did not land.
      let applied = 0;
      for (const r of rows) {
        if (r.state === 'error') continue;
        pos.unshift({
          id: `PO-9${String(1000 + pos.length).slice(-4)}`,
          vendor: r.vendor, cc: r.cc, amount: r.amount, status: 'Pending',
        });
        applied += 1;
      }
      const remaining = rows.filter((r) => r.state === 'error');
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Import', '/import', stagingScreen(remaining.length ? remaining : [], applied), density));
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
    if (path === '/notifications' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Notifications', '/notifications', notificationScreen(), density));
    }

    if (path === '/inbox' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(page('Inbox', '/inbox', inboxScreen(), density));
    }
    if (path === '/notifications/count' && req.method === 'GET') {
      res.writeHead(200, { 'content-type': 'text/html' });
      return res.end(notifBadgeHtml());
    }
    {
      const nm = path.match(/^\/notifications\/(N-\d+)(\/read|\/dismiss)$/);
      if (nm && req.method === 'POST') {
        const n = notifications.find((x) => x.id === nm[1]);
        // Idempotent either way, per the pattern's own Data contract: a
        // second post returns the same state, never an error — includes
        // an id that's already been dismissed (n undefined here).
        if (nm[2] === '/read') {
          if (n) n.unread = false;
          res.writeHead(200, { 'content-type': 'text/html' });
          return res.end((n ? notifItemHtml(n) : '') + notifBadgeHtml(true));
        }
        if (nm[2] === '/dismiss') {
          const idx = notifications.findIndex((x) => x.id === nm[1]);
          if (idx !== -1) notifications.splice(idx, 1);
          res.writeHead(200, { 'content-type': 'text/html' });
          return res.end(notifBadgeHtml(true));
        }
      }
    }
    /* MASS CHANGE (roadmap 25.2 / M3): select N rows, set ONE field, in ONE
       validated operation. This is the honest answer to "update 200 records" —
       the request people reach for cell editing to satisfy. It reuses the
       bulk-action contract exactly: same rows + out-of-band summary response,
       same per-row error state, same TRANSIENT-reason rule. Nothing new. */
    if (path === '/pos/mass-change' && req.method === 'POST') {
      const form = new URLSearchParams(await readBody(req));
      const ids = new Set(form.getAll('id'));
      const cc = (form.get('cc') ?? '').trim().toUpperCase();
      pos.forEach((p) => { delete p.bulkError; });

      // Validate the OPERATION once, before touching any row. A bad target
      // value is not a per-row failure — it is the whole request being wrong,
      // so it gets the document-level treatment, not 200 identical row errors.
      // Now checks EXISTENCE against COST_CENTERS, not just format — before
      // this spike there was no catalog to check against, so "CC-0000" (a
      // well-formed but nonexistent code, easy to fat-finger without a
      // picker) silently "succeeded".
      if (!COST_CENTERS.some((c) => c.code === cc)) {
        res.writeHead(422, { 'content-type': 'text/html' });
        // MAIN content (the hx-target="#po-rows" swap) FIRST, OOB block
        // SECOND — matching the success path below. Found by dogfooding
        // this path for real: with the OOB block first, #po-rows ended up
        // MISSING from the DOM entirely after the swap (0 <tbody> elements
        // — checked directly, not eyeballed from a screenshot), even
        // though this exact 422 branch pre-dates this spike and the OOB
        // markup itself is correct. Reproduced on a clean, unmodified copy
        // of the app too, so this was always broken — nobody had tried a
        // well-formed-but-wrong cost centre in a live browser before.
        return res.end(
          `${tbodyHtml(pos)}<div id="bulk-result" hx-swap-oob="innerHTML"><div class="bo-alert bo-alert--danger" role="alert">` +
            `<p><strong>"${esc(form.get('cc') ?? '')}" is not a cost centre.</strong> Expected CC-nnnn — nothing was changed.</p>` +
            `</div></div>`,
        );
      }

      const failed = [];
      let changed = 0;
      pos.forEach((p) => {
        if (!ids.has(p.id)) return;
        // A decided PO cannot be re-costed: the posting already referenced the
        // old cost centre, so this needs a reversal, not an edit.
        if (p.status !== 'Pending') { failed.push([p, `Already ${p.status.toLowerCase()} — needs a reversal, not a re-cost`]); return; }
        if (p.cc === cc) { failed.push([p, `Already on ${cc}`]); return; }
        p.cc = cc;
        changed += 1;
      });
      for (const [p, reason] of failed) p.bulkError = reason;
      audit.push({ t: new Date().toISOString(), what: `mass change cc=${cc}: ${changed} ok, ${failed.length} failed` });
      if (changed) notify('Mass change applied', `${changed} moved to ${cc}${failed.length ? `, ${failed.length} could not be` : ''}.`, 'Purchasing', '/spend');
      res.writeHead(200, { 'content-type': 'text/html' });
      const summary = `<div id="bulk-result" hx-swap-oob="innerHTML">${
        failed.length
          ? `<div class="bo-alert bo-alert--warning" role="alert"><p><strong>${changed} moved to ${cc}, ${failed.length} could not be.</strong> The rows below carry the reason.</p></div>`
          : `<div class="bo-alert bo-alert--success" role="status"><p>${changed} moved to ${cc}.</p></div>`
      }</div>`;
      return res.end(tbodyHtml(pos) + summary + '<button id="po-load-more" hx-swap-oob="delete"></button>');
    }
    if (path === '/pos/bulk-approve' && req.method === 'POST') {
      const body = await readBody(req);
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
      if (approved) notify('Bulk approve completed', `${approved} approved${failed.length ? `, ${failed.length} could not be` : ''}.`, 'Purchasing', '/pos');
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
    const m = path.match(/^\/pos\/(PO-\d+)(\/approve|\/reject|\/edit)?$/);
    if (m) {
      const p = pos.find((x) => x.id === m[1]);
      if (!p) {
        res.writeHead(404);
        return res.end('not found');
      }
      if (m[2] === '/reject' && req.method === 'POST') {
        const body = await readBody(req);
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
        notify(`${p.id} rejected`, note ? `Reason: ${note}` : 'No reason given.', 'Purchasing', `/pos/${p.id}`);
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
        const body = await readBody(req);
        const rawNote = new URLSearchParams(body).get('note') ?? '';
        p.note = rawNote
          .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
          .replace(/<(?!\/?(b|strong|i|em|ul|ol|li|p|br)\b)[^>]*>/gi, '')
          .replace(/<(\w+)[^>]*>/g, '<$1>');
        audit.push({ t: new Date().toISOString(), what: `approved ${p.id}` });
        notify(`${p.id} approved`, `${money(p.amount)} · ${p.vendor}`, 'Purchasing', `/pos/${p.id}`);
        res.writeHead(200, { 'content-type': 'text/html' });
        return res.end(timelineHtml(p));
      }
      if (m[2] === '/edit' && req.method === 'POST') {
        // A decided PO cannot be re-edited here either — same "needs a
        // reversal, not a re-cost" rule mass-change already established.
        // Checked server-side, not just hidden by the client: the form
        // only renders for Pending records, but a request can still arrive
        // after someone else approved it in the meantime.
        if (p.status !== 'Pending') {
          res.writeHead(409, { 'content-type': 'text/html' });
          return res.end(page(p.id, '/pos', `
            <div class="bo-alert bo-alert--danger" role="alert">
              <p><strong>${p.id} is already ${p.status.toLowerCase()}.</strong> It cannot be edited — nothing was changed.</p>
            </div>${detailScreen(p)}`, density));
        }
        const body = await readBody(req);
        const form = new URLSearchParams(body);
        const { values, errors, amountNum } = parsePoFields(form);

        if (Object.keys(errors).length) {
          // Field-editor's own contract, re-render with values preserved —
          // same pattern the mass-change and /pos/new paths already use.
          const preview = { ...p, vendor: values.vendor, cc: values.cc, amount: amountNum || p.amount };
          res.writeHead(422, { 'content-type': 'text/html' });
          return res.end(page(p.id, '/pos', detailScreen(preview, errors), density));
        }
        p.vendor = values.vendor;
        p.cc = values.cc;
        p.amount = amountNum;
        audit.push({ t: new Date().toISOString(), what: `${p.id} edited` });
        res.writeHead(302, { location: `/pos/${p.id}` });
        return res.end();
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

/* PORT is overridable so the smoke gate can boot this on a free port without
   colliding with a running container (roadmap 26.1). Default unchanged. */
const PORT = Number(process.env.PORT) || 8080;
server.listen(PORT, () => console.log(`po-app on :${PORT} · ui dist:`, uiDist));
