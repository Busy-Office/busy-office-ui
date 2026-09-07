/* Renderer + preview shim for the future-ERP home screen. Same approach as
   preview-shim.js: every fragment below is what a server template would emit;
   the interceptor only stands in for the server. Delete it, point the same
   hx-* attributes at a backend, and the markup is unchanged. */

(() => {
  const D = window.HOME_DATA;
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const money = (n) => {
    if (n == null) return '';
    const [w, fr] = n.toLocaleString('en-US', { minimumFractionDigits: 2 }).split('.');
    return `<span class="bo-amount"><span class="bo-amount__currency">$</span><span class="bo-amount__value">${w}<span class="bo-amount__fraction">.${fr}</span></span></span>`;
  };

  const state = { role: 'approver', q: '', resolved: new Set(), notice: null };

  const ACTION = {
    approve: ['Approve', ''], reject: ['Reject', 'bo-btn--danger-ghost'], nudge: ['Nudge', 'bo-btn--ghost'],
    'short-pay': ['Short-pay', ''], hold: ['Hold', 'bo-btn--secondary'], match: ['Match to PO', ''],
    compare: ['Compare', 'bo-btn--secondary'], recode: ['Recode', ''], 'post-batch': ['Post 14', ''],
    'approve-overrun': ['Approve overrun', ''], reclass: ['Reclassify', 'bo-btn--secondary'],
    'nudge-all': ['Nudge all', 'bo-btn--ghost'], open: ['Open', 'bo-btn--ghost'],
    'accept-short': ['Accept short', ''], recount: ['Assign recount', ''], reassign: ['Reassign', ''],
    'assign-bin': ['Assign bin', '']
  };

  const SEV_ROW = { blocker: 'error', warning: 'warning' };
  const STATE_BADGE = { submitted: ['Submitted', ''], exception: ['Exception', 'bo-badge--danger'], ready: ['Ready', 'bo-badge--success'], task: ['Task', ''], draft: ['Draft', ''], posted: ['Posted', 'bo-badge--success'] };

  function roleData() { return D[state.role]; }

  function filterRows(rows) {
    const q = state.q.trim().toLowerCase();
    return rows.filter((r) => !state.resolved.has(r.id)).filter((r) => {
      if (!q) return true;
      if (q === 'next:me') return r.next.name === 'You';
      if (q === 'next:other') return r.next.name !== 'You';
      if (q === 'due:today' || q === 'due:shift') return /closes|leaves|by|wave/i.test(r.due);
      if (q.startsWith('state:')) return r.state === q.slice(6);
      if (q === 'blocks:close') return r.type === 'Close' || r.type === 'Budget';
      return (r.id + ' ' + r.title + ' ' + (r.blocker || '')).toLowerCase().includes(q);
    });
  }

  function sortRows(rows) {
    const rank = (r) => {
      const mine = r.next.name === 'You';
      const timed = /closes|leaves|wave|by /i.test(r.due);
      const blocked = r.severity === 'blocker';
      if (r.state === 'exception' && mine) return timed ? 0 : 1;
      if (mine) return timed ? 2 : 3;
      if (blocked) return 4;
      return 5;
    };
    return rows.slice().sort((a, b) => rank(a) - rank(b));
  }

  function statsHtml(role) {
    return `<div class="bo-cluster" style="gap:var(--bo-space-6)">${role.stats.map((s) => `
      <a class="bo-stat" href="?q=${encodeURIComponent(s.q)}" hx-get="/queue?q=${encodeURIComponent(s.q)}" hx-target="#queue" hx-select="#queue" hx-push-url="true" style="text-decoration:none;color:inherit;min-inline-size:9rem">
        <span class="bo-stat__label">${esc(s.label)}</span>
        <span class="bo-stat__value">${esc(s.value)}</span>
      </a>`).join('')}</div>`;
  }

  function rowHtml(r) {
    const [stLabel, stCls] = STATE_BADGE[r.state] || [r.state, ''];
    const acts = r.actions.map((a) => {
      const [label, cls] = ACTION[a] || [a, ''];
      return `<button class="bo-btn bo-btn--sm ${cls}" type="button" hx-post="/act" hx-vals='{"id":"${r.id}","action":"${a}"}' hx-target="#queue" hx-select="#queue">${label}</button>`;
    }).join('');
    const why = D.explain[r.id]
      ? `<button class="bo-btn bo-btn--sm bo-btn--ghost" type="button" hx-get="/explain?about=${r.id}" hx-target="#explain" hx-swap="innerHTML" aria-label="Why ${r.id}?">Why?</button>` : '';
    return `<tr id="row-${r.id}" data-row-id="${r.id}" data-row-state="${SEV_ROW[r.severity] || ''}">
      <td><span class="bo-badge ${stCls}">${stLabel}</span></td>
      <td class="bo-data-table__col--code"><a href="#" onclick="return false">${r.id}</a>${r.expandable ? `<div class="bo-u-text-muted" style="font-size:var(--bo-font-size-xs)">${r.expandable} items</div>` : ''}</td>
      <td>
        <div>${esc(r.title)}</div>
        ${r.blocker ? `<div style="font-size:var(--bo-font-size-xs);color:var(--bo-color-${r.severity === 'blocker' ? 'danger' : 'warning'}-text);margin-block-start:2px">
          <span aria-hidden="true">${r.severity === 'blocker' ? '\u2715' : '\u26A0'}</span> ${esc(r.blocker)}
          <span class="bo-u-text-muted"> \u00b7 ${esc(r.who)}</span></div>` : ''}
      </td>
      <td class="bo-data-table__col--numeric bo-data-table__col--secondary">${money(r.amount)}</td>
      <td class="bo-data-table__col--secondary"><span class="bo-byline bo-byline--compact"><span class="bo-avatar bo-byline__avatar" aria-hidden="true">${esc(r.next.initials)}</span>${esc(r.next.name)}</span></td>
      <td class="bo-data-table__col--secondary" style="white-space:nowrap">${esc(r.due)}<div class="bo-u-text-muted" style="font-size:var(--bo-font-size-xs)">${esc(r.age)}</div></td>
      <td><div class="bo-cluster" style="gap:var(--bo-space-1);flex-wrap:nowrap">${acts}${why}</div></td>
    </tr>`;
  }

  function queueHtml() {
    const role = roleData();
    const rows = sortRows(filterRows(role.rows));
    const notice = state.notice ? `<div class="bo-alert bo-alert--${state.notice.tone}" role="status"><div><strong class="bo-alert__title">${esc(state.notice.title)}</strong> ${esc(state.notice.body)}</div></div>` : '';
    const chip = state.q ? `<span class="bo-chip bo-chip--active">${esc(state.q)}<a class="bo-chip__remove" href="?q=" hx-get="/queue?q=" hx-target="#queue" hx-select="#queue" hx-push-url="true" aria-label="Remove filter">\u00d7</a></span>` : '';
    return `<div id="queue">
      ${notice}
      <div class="bo-cluster bo-cluster--split" style="margin-block:var(--bo-space-4) var(--bo-space-2)">
        <div class="bo-cluster">
          <span style="font-size:var(--bo-font-size-xs);text-transform:uppercase;letter-spacing:.06em;color:var(--bo-color-text-muted)">Sorted by</span>
          ${role.sort.map((s, i) => `<span style="font-size:var(--bo-font-size-sm);color:var(--bo-color-text-secondary)">${i ? '\u2192 ' : ''}${esc(s)}</span>`).join('')}
          ${chip}
        </div>
        <span style="font-size:var(--bo-font-size-xs);color:var(--bo-color-text-muted)">${rows.length} of ${role.rows.length - state.resolved.size}</span>
      </div>
      <div class="bo-data-table-container">
        <table class="bo-data-table" aria-rowcount="${rows.length}">
          <thead><tr>
            <th scope="col">State</th>
            <th scope="col" class="bo-data-table__col--code">Document</th>
            <th scope="col">What \u00b7 what\u2019s stopping it</th>
            <th scope="col" class="bo-data-table__col--numeric bo-data-table__col--secondary">Amount</th>
            <th scope="col" class="bo-data-table__col--secondary">Next</th>
            <th scope="col" class="bo-data-table__col--secondary">Due</th>
            <th scope="col">Actions</th>
          </tr></thead>
          <tbody>${rows.length ? rows.map(rowHtml).join('') : `<tr><td colspan="7"><div class="bo-state"><span class="bo-state__icon bo-icon bo-icon--check-circle" aria-hidden="true"></span><h2 class="bo-state__title">Nothing needs you right now.</h2><p class="bo-state__description">Everything else is waiting on someone else, and you will be told when it comes back.</p></div></td></tr>`}</tbody>
        </table>
      </div>
    </div>`;
  }

  function mainHtml() {
    const role = roleData();
    return `<main class="bo-app-shell__main" id="main">
      <div class="bo-cluster bo-cluster--split">
        <div>
          <h1 style="margin:0;font-size:var(--bo-font-size-xl);font-weight:600;white-space:nowrap">${esc(role.home)}</h1>
          <div style="color:var(--bo-color-text-muted);font-size:var(--bo-font-size-sm)">${esc(role.user)} \u00b7 ${esc(role.role)}</div>
        </div>
        <button class="bo-btn bo-btn--secondary" type="button" id="open-palette">
          Go to\u2026
          <kbd class="bo-kbd" style="margin-inline-start:var(--bo-space-2)">Ctrl K</kbd>
        </button>
      </div>
      <div style="margin-block:var(--bo-space-4)">${statsHtml(role)}</div>
      ${queueHtml()}
    </main>`;
  }

  /* ---- Palette ---------------------------------------------------------- */
  function paletteResults(q) {
    const role = roleData();
    const ql = q.trim().toLowerCase();
    const groups = [];
    const docs = role.rows.filter((r) => !state.resolved.has(r.id) && (!ql || r.id.toLowerCase().includes(ql) || r.title.toLowerCase().includes(ql))).slice(0, 4);
    if (docs.length) groups.push(['Jump to', docs.map((r) => ({ label: r.id, hint: r.title, kind: 'doc', id: r.id }))]);
    const cmds = role.commands.filter((c) => !ql || (c.label + ' ' + (c.hint || '')).toLowerCase().includes(ql));
    if (cmds.length) groups.push(['Actions', cmds]);
    const screens = D.screens.filter((s) => s.roles.includes(state.role) && (!ql || s.label.toLowerCase().includes(ql)));
    if (screens.length) groups.push(['Screens', screens.map((s) => ({ label: s.label, hint: s.path, kind: 'screen' }))]);
    if (/^[a-z]+:/.test(ql)) groups.unshift(['Filter the queue', [{ label: q, hint: 'token query', kind: 'view', q }]]);
    let i = 0;
    return groups.map(([g, items]) => `<li role="presentation" style="padding:var(--bo-space-2) var(--bo-space-3) var(--bo-space-1);font-size:var(--bo-font-size-xs);text-transform:uppercase;letter-spacing:.06em;color:var(--bo-color-text-muted)">${g}</li>` +
      items.map((it) => `<li class="bo-combobox__option" role="option" aria-selected="${i++ === 0}" data-kind="${it.kind}" data-q="${esc(it.q || '')}" data-id="${esc(it.id || it.about || '')}" data-run="${esc(it.run || '')}">
        <span class="bo-combobox__option-label">${esc(it.label)}</span>${it.hint ? `<span class="bo-combobox__option-meta">${esc(it.hint)}</span>` : ''}</li>`).join('')).join('')
      || `<li class="bo-combobox__option" role="option" aria-disabled="true">Nothing matches. Try a document number or a token like <code>next:me</code>.</li>`;
  }

  function paletteHtml() {
    return `<dialog class="bo-dialog" id="palette" aria-label="Command palette" style="max-inline-size:40rem;padding:0">
      <div style="display:flex;gap:var(--bo-space-2);align-items:center;padding:var(--bo-space-3);border-block-end:1px solid var(--bo-color-border-default)">
        <input class="bo-input bo-input--code" id="palette-q" role="combobox" aria-expanded="true" aria-controls="palette-list" autocomplete="off"
               placeholder="Document number, action, or next:me due:today\u2026"
               hx-get="/palette" hx-trigger="input changed delay:80ms" hx-target="#palette-list" hx-swap="innerHTML" name="q" style="flex:1">
        <kbd class="bo-kbd">Esc</kbd>
      </div>
      <ul class="bo-combobox__listbox" id="palette-list" role="listbox" style="position:static;border:0;box-shadow:none;max-block-size:22rem;overflow:auto">${paletteResults('')}</ul>
      <div style="padding:var(--bo-space-2) var(--bo-space-3);border-block-start:1px solid var(--bo-color-border-default);font-size:var(--bo-font-size-xs);color:var(--bo-color-text-muted);display:flex;gap:var(--bo-space-4)">
        <span><kbd class="bo-kbd">\u2191\u2193</kbd> move</span><span><kbd class="bo-kbd">\u21b5</kbd> go</span><span>Tokens reuse the list-report grammar: <code>next:me</code> <code>due:today</code> <code>state:exception</code></span>
      </div>
    </dialog>`;
  }

  /* ---- Explain / stage drawer ------------------------------------------- */
  function explainHtml(about) {
    const x = D.explain[about];
    if (!x) return '';
    return `<header class="bo-offcanvas__header"><h2 class="bo-dialog__title">${esc(x.title)}</h2>
      <button class="bo-btn bo-btn--ghost bo-btn--icon bo-btn--sm" type="button" aria-label="Close" onclick="document.getElementById('explain').close()"><span class="bo-icon bo-icon--close" aria-hidden="true"></span></button></header>
      <div class="bo-dialog__body">
        <dl class="bo-kv bo-kv--rows">${x.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
        ${x.timeline ? `<ol class="bo-timeline" style="margin-block-start:var(--bo-space-4)">${x.timeline.map((s) => `<li class="bo-timeline__step" data-state="${s.state}"><span class="bo-timeline__marker" aria-hidden="true">${s.state === 'done' ? '\u2713' : '\u2022'}</span><div><div class="bo-timeline__title">${esc(s.title)}</div>${s.meta ? `<div class="bo-timeline__meta">${esc(s.meta)}</div>` : ''}</div></li>`).join('')}</ol>` : ''}
        ${x.options ? `<p style="margin-block:var(--bo-space-4) 0;font-size:var(--bo-font-size-sm)">${esc(x.options)}</p>` : ''}
        <p style="margin-block:var(--bo-space-4) 0;font-size:var(--bo-font-size-xs);color:var(--bo-color-text-muted)">Derived from: ${esc(x.from)}</p>
      </div>`;
  }

  /* ---- Shim -------------------------------------------------------------- */
  document.addEventListener('htmx:beforeRequest', (e) => {
    const d = e.detail;
    const raw = String(d.pathInfo?.requestPath || d.requestConfig?.path || '');
    const [path, search] = raw.split('?');
    const params = new URLSearchParams(search || '');
    const body = d.requestConfig?.parameters || {};
    let html = null, target = d.target;

    if (path === '/home') {
      state.role = params.get('role') || body.role || state.role; state.q = ''; state.notice = null; state.resolved.clear();
      document.documentElement.setAttribute('data-density', roleData().density);
      html = mainHtml();
    } else if (path === '/queue') {
      state.q = params.get('q') ?? body.q ?? ''; state.notice = null; html = queueHtml();
    } else if (path === '/palette') {
      html = paletteResults(params.get('q') ?? body.q ?? '');
    } else if (path === '/explain') {
      html = explainHtml(params.get('about')); document.getElementById('explain').showModal();
    } else if (path === '/act') {
      const { id, action } = body;
      const role = roleData();
      const [label] = ACTION[action] || [action];
      if (action === 'nudge' || action === 'nudge-all' || action === 'open' || action === 'compare') {
        state.notice = { tone: 'info', title: label + '.', body: action === 'open' ? id + ' would open here.' : 'The next actor has been told what is waiting and why.' };
      } else {
        state.resolved.add(id);
        const past = { approve: 'approved', reject: 'rejected', 'short-pay': 'short-paid', match: 'matched', recode: 'recoded', 'post-batch': 'posted', 'approve-overrun': 'approved', reclass: 'reclassified', 'accept-short': 'accepted short', recount: 'assigned for recount', reassign: 'reassigned', 'assign-bin': 'assigned a bin', hold: 'held' }[action] || label.toLowerCase();
        state.notice = { tone: 'success', title: (id === 'BATCH' ? '14 invoices' : id) + ' ' + past + '.', body: (action === 'post-batch' ? 'Posted to period 08/2026. Reversal needs a credit note.' : '') };
      }
      html = queueHtml();
    }

    if (html === null) return;
    e.preventDefault();
    const sel = d.requestConfig?.elt?.getAttribute('hx-select');
    if (sel) { const doc = new DOMParser().parseFromString(html, 'text/html'); html = doc.querySelector(sel)?.innerHTML ?? html; }
    target.innerHTML = html;
    target.dispatchEvent(new CustomEvent('htmx:after:swap', { bubbles: true }));
    window.htmx?.process(target);
    if (path === '/home') wirePalette();
  });

  /* ---- Palette wiring (keyboard) ----------------------------------------- */
  function wirePalette() {
    const btn = document.getElementById('open-palette');
    const dlg = document.getElementById('palette');
    if (!btn || !dlg) return;
    const open = () => { dlg.showModal(); const q = dlg.querySelector('#palette-q'); q.value = ''; document.getElementById('palette-list').innerHTML = paletteResults(''); q.focus(); };
    btn.onclick = open;
    document.onkeydown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === '/' && !dlg.open && !/input|textarea|select/i.test(e.target.tagName)) { e.preventDefault(); open(); }
    };
    dlg.onkeydown = (e) => {
      const opts = [...dlg.querySelectorAll('[role=option]:not([aria-disabled])')];
      const cur = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.max(0, Math.min(opts.length - 1, cur + (e.key === 'ArrowDown' ? 1 : -1)));
        opts.forEach((o, i) => o.setAttribute('aria-selected', String(i === next)));
        const o = opts[next], list = o?.parentElement;
        if (o && list) { if (o.offsetTop < list.scrollTop) list.scrollTop = o.offsetTop; else if (o.offsetTop + o.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = o.offsetTop + o.offsetHeight - list.clientHeight; }
      }
      if (e.key === 'Enter') { e.preventDefault(); if (opts[cur]) choose(opts[cur]); }
    };
    dlg.onclick = (e) => { const o = e.target.closest('[role=option]'); if (o) choose(o); };
    function choose(o) {
      dlg.close();
      const { kind, q, id, run } = o.dataset;
      const queue = document.getElementById('queue');
      if (kind === 'view' && q) { state.q = q; state.notice = null; swap(queue, queueHtml(), '#queue'); }
      else if (kind === 'doc' || kind === 'explain') { if (D.explain[id]) { document.getElementById('explain').innerHTML = explainHtml(id); document.getElementById('explain').showModal(); } else { state.notice = { tone: 'info', title: id + '.', body: 'Would open the record.' }; swap(queue, queueHtml(), '#queue'); } }
      else if (kind === 'action' && run === 'approve-clear') { roleData().rows.filter((r) => r.next.name === 'You' && !r.blocker).forEach((r) => state.resolved.add(r.id)); state.notice = { tone: 'success', title: 'Approved 4 documents.', body: 'Only documents with no blocker were included; PO-88212 still needs your note.' }; swap(queue, queueHtml(), '#queue'); }
      else if (kind === 'action' && run) { const r = roleData().rows.find((x) => x.actions.includes(run)) || roleData().rows[0]; state.resolved.add(r.id); state.notice = { tone: 'success', title: r.id + ' done.', body: '' }; swap(queue, queueHtml(), '#queue'); }
      else { state.notice = { tone: 'info', title: o.querySelector('.bo-combobox__option-label').textContent + '.', body: 'Would open here.' }; swap(queue, queueHtml(), '#queue'); }
    }
  }
  function swap(target, html, sel) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    target.innerHTML = doc.querySelector(sel)?.innerHTML ?? html;
    window.htmx?.process(target);
  }

  window.HOME = { mainHtml, paletteHtml, wirePalette, state, roleData };
})();
