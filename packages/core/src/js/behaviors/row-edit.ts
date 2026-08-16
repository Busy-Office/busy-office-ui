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
 * buttons. Cancel resets every input/textarea to its `defaultValue` and
 * every select to its default selection (re-firing change so dependent
 * behaviors like money/unit precision re-derive). Save dispatches
 * `bo:row-save` (bubbling, `detail: { row, rowId }`) and clears the
 * dirty state — your listener does the actual persistence.
 */
let installed = false;

type RowField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function rowFields(row: HTMLElement): RowField[] {
  return [...row.querySelectorAll<RowField>('input, textarea, select')];
}

/* Selects have no defaultValue — their baseline lives per-option in
   defaultSelected (needed once money/unit-select cells sit inside
   editable rows, Slice 18 item 3). A genuinely-reset select re-fires
   change so dependent behaviors (money/unit precision) re-derive from
   the restored selection — otherwise Cancel would restore the VALUE but
   leave the input's step at the abandoned currency/unit's precision.
   Safe ordering: the cancel branch calls setDirty(false) after this, so
   the re-derivation's own input/change events never leave the row dirty. */
function resetField(field: RowField): void {
  if (field instanceof HTMLSelectElement) {
    let changed = false;
    for (const opt of field.options) {
      if (opt.selected !== opt.defaultSelected) changed = true;
      opt.selected = opt.defaultSelected;
    }
    if (changed) field.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    field.value = field.defaultValue;
  }
}

function baselineField(field: RowField): void {
  if (field instanceof HTMLSelectElement) {
    for (const opt of field.options) opt.defaultSelected = opt.selected;
  } else {
    field.defaultValue = field.value;
  }
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

  // Selects fire input in real browsers, but synthetic/legacy paths may
  // only fire change — listen for both so a currency/unit cell always
  // marks its row dirty (setDirty is idempotent, double-fire is harmless).
  document.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    if (!(target instanceof HTMLSelectElement)) return;
    const row = target.closest<HTMLElement>('table[data-row-edit] tbody tr');
    if (row) setDirty(row, true);
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const cancelBtn = target.closest<HTMLElement>('[data-row-edit-cancel]');
    if (cancelBtn) {
      const row = cancelBtn.closest<HTMLElement>('table[data-row-edit] tbody tr');
      if (!row) return;
      rowFields(row).forEach(resetField);
      setDirty(row, false);
      return;
    }

    /**
     * @event bo:row-save
     * @target the edited `<tr>` (bubbles)
     * @when Save is activated on a dirty row; after the event, current field
     *   values become the new baseline (Cancel restores to them)
     * @detail row {HTMLTableRowElement} the live row — read committed values
     *   from its inputs/selects by `name`
     * @detail rowId {string|null} the row's `data-row-id`, or null if unset
     */
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
      rowFields(row).forEach(baselineField);
      setDirty(row, false);
    }
  });
}
