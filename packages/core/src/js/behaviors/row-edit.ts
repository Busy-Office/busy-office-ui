/**
 * Multi-row inline edit: tracks which rows have unsaved changes, shows a
 * per-row Save/Cancel affordance, and dispatches a `bo:row-save` event for
 * your code to persist (fetch, hx-patch, form submit — this behavior only
 * tracks state, it never sends data itself).
 *
 * Markup contract:
 *   <table class="bo-data-table" data-row-edit>
 *     <tbody>
 *       <tr data-row-id="INV-1">
 *         <td><input class="bo-input bo-input--seamless" ... /></td>
 *         <td class="bo-data-table__row-edit-actions">
 *           <span class="bo-badge bo-badge--warning" data-row-edit-dirty hidden>Unsaved</span>
 *           <button class="bo-btn bo-btn--sm" type="button" data-row-edit-save hidden>Save</button>
 *           <button class="bo-btn bo-btn--sm bo-btn--secondary" type="button" data-row-edit-cancel hidden>Cancel</button>
 *         </td>
 *       </tr>
 *     </tbody>
 *   </table>
 *
 * Sets `data-row-state="dirty"` on the <tr> (same visual channel the
 * error row state uses) and reveals the row's dirty badge + save/cancel
 * buttons. Cancel resets every input in the row to its `defaultValue`.
 * Save dispatches `bo:row-save` (bubbling, `detail: { row, rowId }`) and
 * clears the dirty state — your listener does the actual persistence.
 */
let installed = false;

function rowFields(row: HTMLElement): HTMLInputElement[] {
  return [...row.querySelectorAll<HTMLInputElement>('input, textarea')];
}

function setDirty(row: HTMLElement, dirty: boolean): void {
  if (dirty) {
    row.setAttribute('data-row-state', 'dirty');
  } else {
    row.removeAttribute('data-row-state');
  }
  const badge = row.querySelector<HTMLElement>('[data-row-edit-dirty]');
  const save = row.querySelector<HTMLElement>('[data-row-edit-save]');
  const cancel = row.querySelector<HTMLElement>('[data-row-edit-cancel]');
  if (badge) badge.hidden = !dirty;
  if (save) save.hidden = !dirty;
  if (cancel) cancel.hidden = !dirty;
}

export function initRowEdit(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>('table[data-row-edit] tbody tr');
    if (!row) return;
    setDirty(row, true);
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const cancelBtn = target.closest<HTMLElement>('[data-row-edit-cancel]');
    if (cancelBtn) {
      const row = cancelBtn.closest<HTMLElement>('table[data-row-edit] tbody tr');
      if (!row) return;
      rowFields(row).forEach((field) => {
        field.value = field.defaultValue;
      });
      setDirty(row, false);
      return;
    }

    const saveBtn = target.closest<HTMLElement>('[data-row-edit-save]');
    if (saveBtn) {
      const row = saveBtn.closest<HTMLElement>('table[data-row-edit] tbody tr');
      if (!row) return;
      row.dispatchEvent(
        new CustomEvent('bo:row-save', {
          bubbles: true,
          detail: { row, rowId: row.getAttribute('data-row-id') },
        }),
      );
      rowFields(row).forEach((field) => {
        field.defaultValue = field.value;
      });
      setDirty(row, false);
    }
  });
}
