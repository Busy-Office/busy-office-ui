/**
 * Optional data-table toolbar actions: column visibility + export. Composes
 * with the existing multi-select dropdown (data-multiselect) rather than
 * inventing new markup — this behavior only owns show/hide and the export
 * intent event.
 *
 * Column visibility — Markup contract:
 *   <div class="bo-data-table-container">
 *     <div class="bo-data-table__toolbar">
 *       <button class="bo-btn bo-btn--secondary" popovertarget="cols-menu"
 *           data-multiselect-label="Columns">Columns</button>
 *       <div class="bo-dropdown__menu" id="cols-menu" popover data-multiselect>
 *         <label class="bo-dropdown__item">
 *           <input type="checkbox" class="bo-checkbox" data-col-toggle="cc" checked /> Cost center
 *         </label>
 *       </div>
 *     </div>
 *     <table class="bo-data-table">
 *       <thead><tr><th data-col="cc">Cost center</th></tr></thead>
 *       <tbody><tr><td data-col="cc">CC-4021</td></tr></tbody>
 *     </table>
 *   </div>
 * Toggling a [data-col-toggle] checkbox shows/hides every [data-col] cell
 * (th and td, header and body) with the matching value, scoped to the
 * same .bo-data-table-container — call initDropdowns() too for the menu
 * itself (positioning, stays-open, trigger-label count). Rows appended
 * or swapped in later don't inherit hidden state — call initTableToolbar()
 * again after appending (safe: listeners install once, the reconciliation
 * pass re-runs) — same re-call convention as initDataTables(root).
 *
 * Export — Markup contract:
 *   <button class="bo-btn bo-btn--secondary" type="button" data-table-export
 *       data-table-export-format="csv">Export</button>
 * Click dispatches bo:table-export ({ format }) on the button — this
 * behavior only tracks the intent; generating and downloading the actual
 * file is the consumer's code (same split as bo:row-save / bo:scan).
 *
 * @serves data-table
 */
let installed = false;

function applyColToggle(checkbox: HTMLInputElement): void {
  const col = checkbox.dataset.colToggle;
  if (col === undefined) return;
  const container = checkbox.closest('.bo-data-table-container');
  if (!container) return;
  container.querySelectorAll<HTMLElement>('[data-col]').forEach((cell) => {
    if (cell.dataset.col === col) cell.hidden = !checkbox.checked;
  });
}

export function initTableToolbar(): void {
  // The initial reconciliation runs on EVERY call (a server rendering a
  // persisted "column hidden" preference renders the checkbox unchecked
  // — the column must match it on load, not after a phantom toggle);
  // only the document-level listeners are install-once.
  document
    .querySelectorAll<HTMLInputElement>('[data-col-toggle]')
    .forEach(applyColToggle);

  if (installed) return;
  installed = true;

  document.addEventListener('change', (e) => {
    const checkbox = e.target as HTMLInputElement;
    if (checkbox.dataset?.colToggle === undefined) return;
    applyColToggle(checkbox);
  });

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLElement>('[data-table-export]');
    if (!btn) return;
    const format = btn.dataset.tableExportFormat || 'csv';
    /**
     * @event bo:table-export
     * @target the `[data-table-export]` button (bubbles)
     * @when the export button is clicked; the listener produces the file
     *   (server round-trip or client-side) — the framework only signals
     * @detail format {string} `data-table-export-format`, default "csv"
     */
    btn.dispatchEvent(
      new CustomEvent('bo:table-export', { bubbles: true, detail: { format } }),
    );
  });
}
