/* PREVIEW ONLY — none of this exists in production.

   This kit's markup carries real hx-get / hx-post attributes pointing at the
   reference app's real routes (/pos, /pos/:id/approve, /cost-centers …). There
   is no server here, so this shim answers those requests from canned fragments
   so the screens actually click through.

   It is deliberately a request interceptor and nothing more: it does not touch
   the markup, so what you inspect in devtools is exactly what a Django, Go or
   Rails template would emit. Delete this file and point the same attributes at
   a real server and the kit works unchanged.

   Routes answered here mirror examples/po-app, whose contracts are asserted by
   apps/docs/scripts/check-po-app.mjs. */

const PO = [
  { id: 'PO-88211', vendor: 'Acme Supply Co.',  cc: 'CC-4021', due: '2026-08-12', amount: 17329.42, status: 'Approved', tone: 'success' },
  { id: 'PO-88212', vendor: 'Stark Components', cc: 'CC-1180', due: '2026-08-13', amount: 18685.95, status: 'Pending',  tone: 'warning' },
  { id: 'PO-88213', vendor: 'Nobody Ltd',       cc: 'CC-2205', due: '2026-08-14', amount: 3322.40,  status: 'Pending',  tone: 'warning' },
  { id: 'PO-88214', vendor: 'Acme Supply Co.',  cc: 'CC-4021', due: '2026-08-15', amount: 15636.05, status: 'Pending',  tone: 'warning' },
  { id: 'PO-88215', vendor: 'Stark Components', cc: 'CC-2205', due: '2026-08-16', amount: 19678.49, status: 'Rejected', tone: 'danger'  },
  { id: 'PO-88216', vendor: 'Umbrella Freight', cc: 'CC-1180', due: '2026-08-17', amount: 6088.31,  status: 'Pending',  tone: 'warning' },
  { id: 'PO-88217', vendor: 'Acme Supply Co.',  cc: 'CC-2205', due: '2026-08-18', amount: 13639.73, status: 'Approved', tone: 'success' },
  { id: 'PO-88218', vendor: 'Initech GmbH',     cc: 'CC-4021', due: '2026-08-19', amount: 20287.16, status: 'Pending',  tone: 'warning' }
];

const decided = new Set(['PO-88211', 'PO-88215', 'PO-88217']);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const money = (n) => {
  const [w, fr] = n.toLocaleString('en-US', { minimumFractionDigits: 2 }).split('.');
  return `<span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${w}<span class="bo-amount__fraction">.${fr}</span></span></span>`;
};

/* The query-token grammar the reference app uses: one `q` param holding
   space-separated key:value tokens, with unknown keys left as FREE TEXT
   rather than becoming a token that matches nothing. */
const KEYS = ['status', 'vendor', 'cc'];
function parseQ(q) {
  const tokens = [], free = [];
  for (const part of (q || '').trim().split(/\s+/).filter(Boolean)) {
    const m = /^([a-z]+):(.+)$/i.exec(part);
    if (m && KEYS.includes(m[1].toLowerCase())) tokens.push({ key: m[1].toLowerCase(), value: m[2] });
    else free.push(part);
  }
  return { tokens, free };
}
function match(po, { tokens, free }) {
  for (const t of tokens) {
    const hay = String(po[t.key === 'status' ? 'status' : t.key]).toLowerCase();
    if (!hay.includes(t.value.toLowerCase())) return false;
  }
  return free.every((w) => (po.id + ' ' + po.vendor).toLowerCase().includes(w.toLowerCase()));
}

function chips(parsed) {
  if (!parsed.tokens.length) return '';
  return parsed.tokens.map((t, i) => {
    const rest = parsed.tokens.filter((_, j) => j !== i).map((x) => x.key + ':' + x.value)
      .concat(parsed.free).join(' ');
    /* A plain <a href> carrying q minus that token — removing a filter needs
       no JavaScript, which the reference app's gate asserts by following this
       href with fetch() and counting the rows that come back. */
    return `<span class="bo-chip bo-chip--active">${esc(t.key)}: ${esc(t.value)}<a class="bo-chip__remove" href="?q=${encodeURIComponent(rest)}" hx-get="/pos?q=${encodeURIComponent(rest)}" hx-target="#list" hx-select="#list" hx-push-url="true" aria-label="Remove filter ${esc(t.key)} ${esc(t.value)}">×</a></span>`;
  }).join('');
}

function rows(list) {
  if (!list.length) {
    return `<tr><td colspan="7"><div class="bo-state"><span class="bo-state__icon bo-icon bo-icon--invoice" aria-hidden="true"></span><h2 class="bo-state__title">No purchase orders match this query.</h2><p class="bo-state__description">Remove a filter token to widen the search.</p><div class="bo-state__actions"><a class="bo-btn bo-btn--secondary" href="?q=" hx-get="/pos?q=" hx-target="#list" hx-select="#list" hx-push-url="true">Clear query</a></div></div></td></tr>`;
  }
  return list.map((p) => `<tr id="row-${p.id}" data-row-id="${p.id}"${decided.has(p.id) ? '' : ''}>
  <td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" name="id" value="${p.id}" aria-label="Select ${p.id}"></td>
  <td class="bo-data-table__col--code" data-col="id"><a class="bo-data-table__cell-link" style="color:inherit" href="/pos/${p.id}" hx-get="/pos/${p.id}" hx-target="#main" hx-select="#main" hx-push-url="true">${p.id}</a></td>
  <td data-col="vendor">${esc(p.vendor)}</td>
  <td class="bo-data-table__col--code bo-data-table__col--secondary" data-col="cc">${p.cc}</td>
  <td class="bo-data-table__col--secondary" data-col="due">${p.due}</td>
  <td class="bo-data-table__col--numeric" data-col="amount">${money(p.amount)}</td>
  <td data-col="status"><span class="bo-badge bo-badge--${p.tone}">${p.status}</span></td>
</tr>`).join('');
}

function listFragment(q, banner) {
  const parsed = parseQ(q);
  const found = PO.filter((p) => match(p, parsed));
  const total = found.reduce((t, p) => t + p.amount, 0);
  /* The banner lives INSIDE #list. hx-select="#list" takes that subtree, so a
     message rendered outside it would be silently dropped by the swap — the
     kind of bug that only shows up on the partial-failure path. */
  return `<div id="list">
  ${banner || ''}
  <!-- Saved views. The reference screenshot (/patterns/list-report) renders
       these as a .bo-segmented group; saved-views.ts's contract is
       <nav data-saved-views> of plain links. Both are upstream sources and they
       disagree — logged in gauntlet/ROUNDS.md. The screenshot is the Class A
       reference, so it wins here. -->
  <div class="bo-cluster">
    <div class="bo-segmented" role="group" aria-label="Saved views">
    <input class="bo-segmented__input" type="radio" name="view" id="view-all" value=""${encodeURIComponent(q || '') === '' ? ' checked' : ''} hx-get="/pos?q=" hx-target="#list" hx-select="#list" hx-push-url="true"><label class="bo-segmented__option" for="view-all">All open · ${PO.length}</label>
    <input class="bo-segmented__input" type="radio" name="view" id="view-status%3APending" value="status%3APending"${encodeURIComponent(q || '') === 'status%3APending' ? ' checked' : ''} hx-get="/pos?q=status%3APending" hx-target="#list" hx-select="#list" hx-push-url="true"><label class="bo-segmented__option" for="view-status%3APending">Pending · ${PO.filter((p) => p.status === 'Pending').length}</label>
    <input class="bo-segmented__input" type="radio" name="view" id="view-vendor%3AStark" value="vendor%3AStark"${encodeURIComponent(q || '') === 'vendor%3AStark' ? ' checked' : ''} hx-get="/pos?q=vendor%3AStark" hx-target="#list" hx-select="#list" hx-push-url="true"><label class="bo-segmented__option" for="view-vendor%3AStark">Stark · ${PO.filter((p) => p.vendor.includes('Stark')).length}</label>
    <input class="bo-segmented__input" type="radio" name="view" id="view-cc%3A1180" value="cc%3A1180"${encodeURIComponent(q || '') === 'cc%3A1180' ? ' checked' : ''} hx-get="/pos?q=cc%3A1180" hx-target="#list" hx-select="#list" hx-push-url="true"><label class="bo-segmented__option" for="view-cc%3A1180">CC-1180 · ${PO.filter((p) => p.cc === 'CC-1180').length}</label>
    </div>
    <button class="bo-btn bo-btn--secondary" type="button">Go</button>
    <button class="bo-btn bo-btn--secondary" type="button">Views ▾</button>
  </div>

  <form class="bo-filter-bar" action="/pos" method="get" hx-get="/pos" hx-target="#list" hx-select="#list" hx-push-url="true">
    <input class="bo-input" name="q" value="${esc(q || '')}" placeholder="Search…" aria-label="Search" hx-trigger="input changed delay:250ms, search" hx-get="/pos" hx-target="#list" hx-select="#list">
    <select class="bo-select" name="status" aria-label="Status" hx-get="/pos" hx-trigger="change" hx-target="#list" hx-select="#list" hx-include="closest form"><option value="">All statuses</option><option>Pending</option><option>Approved</option><option>Rejected</option></select>
    <select class="bo-select" name="cc" aria-label="Cost center" hx-get="/pos" hx-trigger="change" hx-target="#list" hx-select="#list" hx-include="closest form"><option value="">All cost centers</option><option>CC-4021</option><option>CC-1180</option><option>CC-2205</option></select>
    <button class="bo-btn bo-btn--secondary" type="submit">Apply</button>
    <a class="bo-btn bo-btn--ghost" href="?q=" hx-get="/pos?q=" hx-target="#list" hx-select="#list" hx-push-url="true">Clear</a>
  </form>

  <div class="bo-cluster">${chips(parsed)}</div>

  <form hx-post="/pos/bulk-approve" hx-target="#list" hx-select="#list">
    <div class="bo-data-table-container" data-any-selected="false">
      <div class="bo-data-table__toolbar">
        <span style="margin-inline-start:auto;font-size:var(--bo-font-size-sm);color:var(--bo-color-text-secondary)">${found.length} purchase orders</span>
        <div class="bo-data-table__bulk-actions">
          <span class="bo-data-table__selection-count" aria-live="polite"></span>
          <button class="bo-btn bo-btn--sm bo-btn--secondary" type="submit">Approve</button>
          <button class="bo-btn bo-btn--sm bo-btn--danger-ghost" type="submit" formaction="/pos/bulk-reject">Reject</button>
          <button class="bo-btn bo-btn--sm bo-btn--ghost" type="button" data-table-export data-table-export-format="csv">Export</button>
        </div>
      </div>
      <table class="bo-data-table" aria-rowcount="${found.length}">
        <thead><tr>
          <th scope="col" style="inline-size:2.5rem"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all rows"></th>
          <th scope="col" data-col="id" aria-sort="ascending"><button type="button" class="bo-data-table__sort-btn" hx-get="/pos?q=${encodeURIComponent(q || '')}&amp;sort=id" hx-target="#list" hx-select="#list">PO number</button></th>
          <th scope="col" data-col="vendor"><button type="button" class="bo-data-table__sort-btn" hx-get="/pos?q=${encodeURIComponent(q || '')}&amp;sort=vendor" hx-target="#list" hx-select="#list">Vendor</button></th>
          <th scope="col" class="bo-data-table__col--secondary" data-col="cc">Cost center</th>
          <th scope="col" class="bo-data-table__col--secondary" data-col="due">Due</th>
          <th scope="col" class="bo-data-table__col--numeric" data-col="amount"><button type="button" class="bo-data-table__sort-btn" hx-get="/pos?q=${encodeURIComponent(q || '')}&amp;sort=amount" hx-target="#list" hx-select="#list">Amount</button></th>
          <th scope="col" data-col="status">Status</th>
        </tr></thead>
        <tbody>${rows(found)}</tbody>
      </table>
      <div class="bo-data-table__footer">
        <nav class="bo-pagination" aria-label="Pagination">
          <button class="bo-pagination__btn" type="button" disabled>Previous</button>
          <span class="bo-pagination__info">1–${found.length} of ${found.length}</span>
          <button class="bo-pagination__btn" type="button" disabled>Next</button>
        </nav>
        <span style="font-size:var(--bo-font-size-xs);color:var(--bo-color-text-muted);margin-inline-start:auto">Total <span class="bo-amount bo-amount--strong">${money(total).replace(/^<span class="bo-amount">|<\/span>$/g, '')}</span></span>
      </div>
    </div>
  </form>
</div>`;
}

function detailFragment(id, opts = {}) {
  const p = PO.find((x) => x.id === id) || PO[1];
  const isDecided = decided.has(p.id);
  const invalid = opts.invalid || {};
  return `<main class="bo-app-shell__main" id="main">
  <nav aria-label="Breadcrumb"><ol class="bo-breadcrumb">
    <li><a href="/">Purchasing</a></li>
    <li><a href="/pos" hx-get="/pos" hx-target="#main" hx-select="#main" hx-push-url="true">Purchase orders</a></li>
    <li><span aria-current="page">${p.id}</span></li>
  </ol></nav>

  ${opts.status === 422 ? '<div class="bo-alert bo-alert--danger" role="alert"><div><strong class="bo-alert__title">The purchase order was not saved.</strong> Two fields need attention. Your entries have been kept.</div></div>' : ''}
  ${opts.status === 409 ? '<div class="bo-alert bo-alert--danger" role="alert"><div><strong class="bo-alert__title">Already decided.</strong> This purchase order was ' + p.status.toLowerCase() + ' by someone else. Editing it needs a reversal first.</div></div>' : ''}
  ${opts.approved ? '<div class="bo-alert bo-alert--success" role="status"><div><strong class="bo-alert__title">Approved.</strong> ' + p.id + ' was released for payment.</div></div>' : ''}

  <div class="bo-cluster bo-cluster--split">
    <div class="bo-cluster">
      <h1 style="margin:0;font-size:var(--bo-font-size-xl);font-weight:600;white-space:nowrap">${p.id}</h1>
      <span class="bo-badge bo-badge--type">Purchase order</span>
      <span class="bo-badge bo-badge--${p.tone}">${p.status}</span>
    </div>
    <div class="bo-cluster">
      <a class="bo-btn bo-btn--ghost" href="/pos" hx-get="/pos" hx-target="#main" hx-select="#main" hx-push-url="true">Back to list</a>
      ${isDecided ? '' : `
      <button class="bo-btn bo-btn--danger-ghost" popovertarget="reject-dlg-${p.id}" type="button">Reject</button>
      <button class="bo-btn" hx-post="/pos/${p.id}/approve" hx-vals='{"note":"Approved from the record page"}' hx-target="#main" hx-select="#main">Approve</button>`}
    </div>
  </div>

  <dl class="bo-kv">
    <div><dt>Vendor</dt><dd>${esc(p.vendor)}</dd></div>
    <div><dt>Cost center</dt><dd class="bo-u-mono">${p.cc}</dd></div>
    <div><dt>Due</dt><dd>${p.due}</dd></div>
    <div><dt>Amount</dt><dd>${money(p.amount)}</dd></div>
  </dl>

  <form hx-post="/pos/${p.id}/edit" hx-target="#main" hx-select="#main">
    <fieldset class="bo-form-section bo-form-section--label-start">
      <legend class="bo-form-section__legend">Header</legend>
      <div class="bo-form-field${invalid.vendor ? '' : ''}">
        <label class="bo-form-field__label" for="edit-vendor">Vendor</label>
        <input class="bo-input" id="edit-vendor" name="vendor" value="${esc(invalid.vendor !== undefined ? invalid.vendor : p.vendor)}"${invalid.vendor !== undefined ? ' aria-invalid="true" aria-describedby="edit-vendor-msg"' : ''} required>
        ${invalid.vendor !== undefined ? '<span class="bo-form-field__message" id="edit-vendor-msg" role="alert">A vendor is required.</span>' : ''}
      </div>
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="edit-cc">Cost center</label>
        <div class="bo-combobox">
          <input class="bo-input bo-input--code" id="edit-cc" name="cc" role="combobox" aria-expanded="false" aria-controls="cc-list" autocomplete="off"
                 value="${esc(invalid.cc !== undefined ? invalid.cc : p.cc)}"${invalid.cc !== undefined ? ' aria-invalid="true" aria-describedby="edit-cc-msg"' : ''}
                 hx-get="/cost-centers" hx-trigger="input changed delay:250ms, search" hx-target="#cc-list" hx-swap="innerHTML">
          <ul class="bo-combobox__listbox" id="cc-list" role="listbox" hidden></ul>
        </div>
        ${invalid.cc !== undefined ? '<span class="bo-form-field__message" id="edit-cc-msg" role="alert">CC-9999 is not an open cost center.</span>' : ''}
      </div>
      <div class="bo-form-field">
        <label class="bo-form-field__label" for="edit-amount">Amount</label>
        <div class="bo-money">
          <input class="bo-input bo-money__amount bo-input--numeric" id="edit-amount" name="amount" inputmode="decimal" value="${p.amount.toFixed(2)}">
          <select class="bo-select bo-money__currency" aria-label="Currency"><option>USD</option><option>EUR</option></select>
        </div>
      </div>
    </fieldset>
    <div class="bo-form-actions">
      <a class="bo-btn bo-btn--secondary" href="/pos" hx-get="/pos" hx-target="#main" hx-select="#main" hx-push-url="true">Cancel</a>
      <button class="bo-btn" type="submit">Save</button>
    </div>
  </form>

  <dialog class="bo-dialog" id="reject-dlg-${p.id}" popover>
    <header class="bo-dialog__header"><h2 class="bo-dialog__title">Reject ${p.id}</h2>
      <button class="bo-btn bo-btn--ghost bo-btn--icon bo-btn--sm" popovertarget="reject-dlg-${p.id}" popovertargetaction="hide" aria-label="Close"><span class="bo-icon bo-icon--close" aria-hidden="true"></span></button>
    </header>
    <form hx-post="/pos/${p.id}/reject" hx-target="#main" hx-select="#main">
      <div class="bo-dialog__body">
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="reject-note">Reason</label>
          <textarea class="bo-input" id="reject-note" name="note" required>Cost center does not match the requisition.</textarea>
          <span class="bo-form-field__hint">The requester sees this text.</span>
        </div>
      </div>
      <footer class="bo-dialog__footer">
        <button class="bo-btn bo-btn--secondary" type="button" popovertarget="reject-dlg-${p.id}" popovertargetaction="hide">Cancel</button>
        <button class="bo-btn bo-btn--danger" type="submit">Reject purchase order</button>
      </footer>
    </form>
  </dialog>
</main>`;
}

const CCS = [
  { code: 'CC-4021', label: 'Facilities', meta: 'Open' },
  { code: 'CC-1180', label: 'Manufacturing', meta: 'Open' },
  { code: 'CC-2205', label: 'Logistics', meta: 'Open' },
  { code: 'CC-9900', label: 'Legacy projects', meta: 'Closed for posting' }
];

/* ---- The interceptor -------------------------------------------------- */
document.addEventListener('htmx:beforeRequest', (e) => {
  const d = e.detail;
  const verb = (d.requestConfig?.verb || 'get').toLowerCase();
  const raw = d.pathInfo?.requestPath || d.requestConfig?.path || '';
  const [path, search] = String(raw).split('?');
  const params = new URLSearchParams(search || '');
  const body = d.requestConfig?.parameters || {};
  let html = null;

  if (verb === 'get' && (path === '/pos' || path === '' || path === '?')) {
    let q = params.get('q') ?? body.q ?? '';
    const st = params.get('status') ?? body.status, cc = params.get('cc') ?? body.cc;
    if (st) q = (q + ' status:' + st).trim();
    if (cc) q = (q + ' cc:' + cc.replace(/^CC-/, '')).trim();
    html = listFragment(q);
  } else if (verb === 'get' && /^\/pos\/PO-\d+$/.test(path)) {
    html = detailFragment(path.split('/').pop());
  } else if (verb === 'get' && path === '/cost-centers') {
    const q = (params.get('q') || body.q || '').toLowerCase();
    const hits = CCS.filter((c) => (c.code + ' ' + c.label).toLowerCase().includes(q));
    html = hits.length
      ? hits.map((c) => `<li class="bo-combobox__option" role="option" aria-selected="false"><span class="bo-combobox__option-code">${c.code}</span><span class="bo-combobox__option-label">${c.label}</span><span class="bo-combobox__option-meta">${c.meta}</span></li>`).join('')
      : '<li class="bo-combobox__option" role="option" aria-disabled="true">No open cost center matches.</li>';
    document.getElementById('cc-list')?.removeAttribute('hidden');
  } else if (verb === 'post' && /\/approve$/.test(path)) {
    const id = path.split('/')[2];
    decided.add(id);
    const po = PO.find((x) => x.id === id);
    if (po) { po.status = 'Approved'; po.tone = 'success'; }
    html = detailFragment(id, { approved: true });
  } else if (verb === 'post' && /\/reject$/.test(path)) {
    const id = path.split('/')[2];
    decided.add(id);
    const po = PO.find((x) => x.id === id);
    if (po) { po.status = 'Rejected'; po.tone = 'danger'; }
    html = detailFragment(id);
  } else if (verb === 'post' && /\/edit$/.test(path)) {
    const id = path.split('/')[2];
    /* The documented detail-form contract: 409 if already decided, 422 with
       values preserved and ONLY the bad fields marked, 302 on success. */
    if (decided.has(id)) html = detailFragment(id, { status: 409 });
    else if (!body.vendor || body.cc === 'CC-9999' || body.cc === 'CC-9900') {
      html = detailFragment(id, { status: 422, invalid: { vendor: body.vendor, cc: body.cc } });
    } else {
      const po = PO.find((x) => x.id === id);
      if (po) { po.vendor = body.vendor; po.cc = body.cc; po.amount = Number(body.amount) || po.amount; }
      html = detailFragment(id);
    }
  } else if (verb === 'post' && /bulk-(approve|reject)$/.test(path)) {
    const ids = [].concat(body.id || []);
    const applied = ids.filter((i) => !decided.has(i));
    const refused = ids.filter((i) => decided.has(i));
    applied.forEach((i) => {
      decided.add(i);
      const po = PO.find((x) => x.id === i);
      if (po) {
        po.status = /approve/.test(path) ? 'Approved' : 'Rejected';
        po.tone = /approve/.test(path) ? 'success' : 'danger';
      }
    });
    /* Partial failure reports BOTH counts and puts the reason on the row —
       the bulk-actions contract the reference app's gate asserts. */
    const banner = `<div class="bo-alert bo-alert--${refused.length ? 'warning' : 'success'}" role="status"><div><strong class="bo-alert__title">${applied.length} ${/approve/.test(path) ? 'approved' : 'rejected'}.</strong>${refused.length ? ' ' + refused.length + ' could not be changed — already decided.' : ''}</div></div>`;
    html = listFragment('', banner);
  }

  if (html === null) return;
  e.preventDefault();
  const target = d.target || document.body;
  const sel = d.requestConfig?.elt?.getAttribute('hx-select');
  let content = html;
  if (sel) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    content = doc.querySelector(sel)?.innerHTML ?? html;
  }
  target.innerHTML = content;
  target.dispatchEvent(new CustomEvent('htmx:after:swap', { bubbles: true }));
  window.htmx?.process(target);
  window.boInit?.();
});

window.__boPreview = { listFragment, detailFragment };
