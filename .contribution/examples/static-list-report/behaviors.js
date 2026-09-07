/* Plain-JS transcriptions of three shipped behaviours, so this example can
   run without a build step. Loaded as a plain <script>, exposed on
   window.boBehaviors — no module exports, so it cannot shadow the real
   package's named exports if both end up on one page. They follow the markup contracts documented in
   packages/core/src/js/behaviors/data-table.ts and saved-views.ts.

   THESE ARE NOT THE REAL MODULES. In production you install @busy-office/ui
   and import the real ones:

     import { initDataTables, initSavedViews, initDropdowns } from '@busy-office/ui';

   The real package ships 26 behaviours; these two are here because the list
   report is unusable without them. Everything they do is delegation on a
   container, so swapped-in rows are picked up automatically — which is the
   property that makes them work with HTMX at all. */

/* data-table.ts — select-all, an O(1) data-any-selected attribute on the
   container (so CSS needn't re-scan every row with :has() on a large grid),
   and a live "n selected" count for screen readers. */
const bound = new WeakSet();

function update(container) {
  const rows = container.querySelectorAll('.bo-data-table__row-select');
  const checked = container.querySelectorAll('.bo-data-table__row-select:checked');
  const override = container.dataset.selectedCountOverride;
  const selectedCount = override !== undefined ? Number(override) : checked.length;

  container.dataset.anySelected = selectedCount > 0 ? 'true' : 'false';

  const selectAll = container.querySelector('.bo-data-table__select-all');
  if (selectAll) {
    /* Deliberately local even with an override present: "select all" means all
       rendered rows, never a windowed table's true server-side total. */
    selectAll.checked = rows.length > 0 && checked.length === rows.length;
    selectAll.indeterminate = checked.length > 0 && checked.length < rows.length;
  }

  const count = container.querySelector('.bo-data-table__selection-count');
  if (count) {
    if (!count.hasAttribute('aria-live')) count.setAttribute('aria-live', 'polite');
    count.textContent = selectedCount > 0 ? selectedCount + ' selected' : '';
  }
}

function bindContainer(container) {
  if (bound.has(container)) return;
  bound.add(container);
  /* An event-NAME string only — no HTMX dependency in the real module either. */
  container.addEventListener('htmx:after:swap', () => update(container));
  container.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('.bo-data-table__select-all')) {
      const on = t.checked;
      container.querySelectorAll('.bo-data-table__row-select').forEach((b) => { b.checked = on; });
    }
    if (t.matches('.bo-data-table__select-all, .bo-data-table__row-select')) update(container);
  });
  update(container);
}

function initDataTables(root = document) {
  root.querySelectorAll('.bo-data-table-container').forEach(bindContainer);
}

/* saved-views.ts — views are just links (server-rendered), so this owns no
   storage. It populates the filter bar FROM the querystring and derives which
   view link is aria-current="page" instead of anyone hand-setting it. */
function initSavedViews(root = document) {
  const params = new URLSearchParams(location.search);

  root.querySelectorAll('.bo-filter-bar').forEach((form) => {
    for (const el of Array.from(form.elements)) {
      if (!(el instanceof HTMLInputElement || el instanceof HTMLSelectElement)) continue;
      if (!el.name || !params.has(el.name)) continue;
      if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
        /* Writing .value on a checkbox only sets its submit-when-checked
           attribute — silently a no-op. */
        el.checked = params.getAll(el.name).includes(el.value);
      } else if (el instanceof HTMLSelectElement && el.multiple) {
        const values = params.getAll(el.name);
        for (const opt of Array.from(el.options)) opt.selected = values.includes(opt.value);
      } else {
        el.value = params.get(el.name);
      }
    }
  });

  root.querySelectorAll('[data-saved-views] a').forEach((a) => {
    const url = new URL(a.getAttribute('href') || '', location.href);
    const active = url.pathname === location.pathname && url.search === location.search;
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

/* table-toolbar.ts — column visibility over [data-col-toggle] / [data-col],
   plus the export INTENT event. The framework signals; the consumer's code
   produces the file. Same split as bo:row-save and bo:scan. */
function initTableToolbar() {
  const apply = (checkbox) => {
    const col = checkbox.dataset.colToggle;
    if (col === undefined) return;
    const container = checkbox.closest('.bo-data-table-container');
    if (!container) return;
    container.querySelectorAll('[data-col]').forEach((cell) => {
      if (cell.dataset.col === col) cell.hidden = !checkbox.checked;
    });
  };
  /* The reconciliation pass runs on every call — a server rendering a
     persisted "column hidden" preference renders the box unchecked, and the
     column must match it on load rather than after a phantom toggle. */
  document.querySelectorAll('[data-col-toggle]').forEach(apply);
  if (initTableToolbar._installed) return;
  initTableToolbar._installed = true;
  document.addEventListener('change', (e) => {
    if (e.target.dataset?.colToggle === undefined) return;
    apply(e.target);
  });
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('[data-table-export]');
    if (!btn) return;
    btn.dispatchEvent(new CustomEvent('bo:table-export', {
      bubbles: true, detail: { format: btn.dataset.tableExportFormat || 'csv' }
    }));
  });
}

window.boBehaviors = { initDataTables, initSavedViews, initTableToolbar };
