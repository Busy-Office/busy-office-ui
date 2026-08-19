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
 * buttons. Cancel resets every input/textarea to its `defaultValue`,
 * every checkbox/radio to `defaultChecked`, and every select to its
 * default selection (re-firing change so dependent behaviors like
 * money/unit precision re-derive), then dispatches `bo:row-cancel` so
 * YOUR code can restore consumer-rendered cell content the framework
 * doesn't own (tag-input chips). Save dispatches `bo:row-save`
 * (bubbling, `detail: { row, rowId }`) and clears the dirty state —
 * your listener does the actual persistence. When the activated
 * Save/Cancel button held keyboard focus, focus moves to the row's
 * first usable field before the button hides (never stolen otherwise).
 *
 * Every committed cell edit also dispatches `bo:cell-change` — the
 * realtime feed for subtotal math (see initTableSum for the declarative
 * auto-sum counterpart, or listen yourself for custom math like
 * qty × price line totals).
 *
 * Save models — BOTH supported (Slice 18, user's explicit call):
 *   data-row-edit          batch: dirty state + explicit Save/Cancel
 *   data-row-edit="live"   save-per-change: every committed change
 *                          (change event — blur for text, immediate for
 *                          select/checkbox) dispatches bo:row-save and
 *                          re-baselines; no dirty UI, omit the
 *                          Save/Cancel buttons in your markup. Saves are
 *                          deferred one microtask and coalesced per row
 *                          per tick, so same-tick reformats (money/unit)
 *                          land before the save reads the row and a
 *                          row removed in the same tick is never saved.
 */
let installed = false;

type RowField = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function rowFields(row: HTMLElement): RowField[] {
  return [...row.querySelectorAll<RowField>('input, textarea, select')];
}

function isCheckable(f: RowField): f is HTMLInputElement {
  return f instanceof HTMLInputElement && (f.type === 'checkbox' || f.type === 'radio');
}

/* Selects have no defaultValue — their baseline lives per-option in
   defaultSelected; checkboxes/radios in defaultChecked. A genuinely-reset
   select re-fires change so dependent behaviors (money/unit precision)
   re-derive from the restored selection — otherwise Cancel would restore
   the VALUE but leave the input's step at the abandoned currency/unit's
   precision. Safe ordering: the cancel branch calls setDirty(false) after
   this, so the re-derivation's own input/change events never leave the
   row dirty. */
function resetField(field: RowField): void {
  if (field instanceof HTMLSelectElement) {
    let changed = false;
    for (const opt of field.options) {
      if (opt.selected !== opt.defaultSelected) changed = true;
      opt.selected = opt.defaultSelected;
    }
    if (changed) field.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (isCheckable(field)) {
    const changed = field.checked !== field.defaultChecked;
    field.checked = field.defaultChecked;
    if (changed) field.dispatchEvent(new Event('input', { bubbles: true }));
  } else {
    const changed = field.value !== field.defaultValue;
    field.value = field.defaultValue;
    // Announce genuine restores (input, bubbling) — realtime listeners
    // (auto-sum, custom subtotal math) must see values revert, or a
    // cancelled edit leaves their totals stale. Same doctrine as the
    // combobox/money reformats; cancel's trailing setDirty(false) keeps
    // the row clean.
    if (changed) field.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

function baselineField(field: RowField): void {
  if (field instanceof HTMLSelectElement) {
    for (const opt of field.options) opt.defaultSelected = opt.selected;
  } else if (isCheckable(field)) {
    field.defaultChecked = field.checked;
  } else {
    field.defaultValue = field.value;
  }
}

/* aria-invalid is never set by this behavior — it's server/app-rendered
   content (a 422 re-render, per every pattern's own Data contract) — so
   reading it live is always accurate regardless of when it's checked. */
function hasInvalidCell(row: HTMLElement): boolean {
  return !!row.querySelector('[aria-invalid="true"]');
}

function setDirty(row: HTMLElement, dirty: boolean): void {
  if (dirty) {
    row.setAttribute('data-row-state', 'dirty');
  } else if (hasInvalidCell(row)) {
    // 58.4: going clean must not silently drop a surviving cell error. Cancel
    // restores fields to their DEFAULT value, which for a row that started
    // invalid (a 422 re-render) is still invalid — the aria-invalid cell and
    // its message survive Cancel untouched (this behavior never owns them),
    // so the row-level tint must survive with them. Save falls through here
    // too: until the app's own bo:row-save listener confirms success and
    // clears aria-invalid itself, the error the row had is still real.
    row.setAttribute('data-row-state', 'error');
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

/* Grill H4 (WCAG 2.4.3): Save/Cancel hide themselves on activation, so a
   keyboard user's focus silently dropped to <body> mid-table. When the
   activated control is the focused element, move focus to the row's first
   usable field BEFORE it hides — a stable, predictable anchor. Focus held
   anywhere else (programmatic clicks, live mode) is never stolen. */
function refocusIntoRow(row: HTMLElement, activated: HTMLElement): void {
  if (document.activeElement !== activated) return;
  const target = rowFields(row).find((f) => !f.disabled);
  target?.focus();
}

function tableOf(row: HTMLElement): HTMLElement | null {
  return row.closest<HTMLElement>('table[data-row-edit]');
}

/* Grill E3 fixes (Slice 19 item 2): the row currently mid-Cancel — its
   restore-driven change/input events must never trigger a live save or
   dirty state (a select-reset's change otherwise turned Cancel into a
   Save that persisted the abandoned values). */
let cancelling: HTMLElement | null = null;

/* Live saves are deferred one microtask so every same-tick synchronous
   re-derivation (money/unit reformat listeners on the same change event)
   lands BEFORE the save reads the row — a sync save captured the
   pre-reformat value. Coalesces multiple same-tick changes into one
   save; a row detached before the microtask runs is skipped entirely
   (never dispatched-into-nothing, never baselined while detached — the
   consumer who removed the row owns its fate). */
const pendingLiveSave = new WeakSet<HTMLElement>();

function queueLiveSave(row: HTMLElement): void {
  if (pendingLiveSave.has(row)) return;
  pendingLiveSave.add(row);
  queueMicrotask(() => {
    pendingLiveSave.delete(row);
    if (row.isConnected && cancelling !== row) saveRow(row);
  });
}

function isLive(table: HTMLElement): boolean {
  return table.getAttribute('data-row-edit') === 'live';
}

function fieldName(field: RowField): string | null {
  return field.name || field.getAttribute('aria-label') || null;
}

function dispatchCellChange(field: RowField, row: HTMLElement): void {
  field.dispatchEvent(
    /**
     * @event bo:cell-change
     * @target the edited field (input/select/textarea; bubbles)
     * @when a cell in a `data-row-edit` row changes — typing, a select
     *   pick, a checkbox toggle, or a behavior-driven reformat
     *   (money/unit precision). The realtime feed for subtotal math.
     * @detail rowId {string|null} the row's `data-row-id`
     * @detail field {string|null} the field's `name`, falling back to its `aria-label`
     * @detail value {string|boolean} the field's current value (`checked` for a checkbox/radio)
     */
    new CustomEvent('bo:cell-change', {
      bubbles: true,
      detail: {
        rowId: row.getAttribute('data-row-id'),
        field: fieldName(field),
        value: isCheckable(field) ? field.checked : field.value,
      },
    }),
  );
}

function saveRow(row: HTMLElement): void {
  row.dispatchEvent(
    /**
     * @event bo:row-save
     * @target the edited `<tr>` (bubbles)
     * @when Save is activated on a dirty row (batch mode), or any change
     *   commits in `data-row-edit="live"` mode; after the event, current
     *   field values become the new baseline (Cancel restores to them)
     * @detail row {HTMLTableRowElement} the live row — read committed values
     *   from its inputs/selects by `name`
     * @detail rowId {string|null} the row's `data-row-id`, or null if unset
     */
    new CustomEvent('bo:row-save', {
      bubbles: true,
      detail: { row, rowId: row.getAttribute('data-row-id') },
    }),
  );
  rowFields(row).forEach(baselineField);
  setDirty(row, false);
}

export function initRowEdit(): void {
  if (installed) return;
  installed = true;

  // Typing/toggling. Selects are handled in the change listener only —
  // real browsers fire input for them too, and double-dispatching
  // bo:cell-change would double any consumer's subtotal math.
  document.addEventListener('input', (e) => {
    const target = e.target as HTMLElement;
    if (target instanceof HTMLSelectElement) return;
    const row = target.closest<HTMLElement>('table[data-row-edit] tbody tr');
    const table = row && tableOf(row);
    if (!row || !table) return;
    if (!isLive(table) && cancelling !== row) setDirty(row, true);
    dispatchCellChange(target as RowField, row);
  });

  // Committed edits: selects/checkboxes commit immediately, text on blur.
  // Live mode saves here; batch mode only needs the select dirty-marking
  // (inputs were already marked on input).
  /* A native form reset IS a cancel — it restores every control to its
     defaultValue, which is exactly what the per-row Cancel does one row at a
     time. Without this the values revert and the rows stay marked dirty, so the
     behavior contradicts itself and the screen lies about unsaved work.
     Needed by form-level save, where there is no per-row Cancel to press
     (roadmap 34.1). Deferred a tick because `reset` fires BEFORE the controls
     are restored. */
  document.addEventListener('reset', (e) => {
    const form = e.target as HTMLElement;
    if (!(form instanceof HTMLFormElement)) return;
    setTimeout(() => {
      form.querySelectorAll<HTMLElement>('table[data-row-edit] tbody tr[data-row-state="dirty"]')
        .forEach((row) => setDirty(row, false));
    }, 0);
  });

  document.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    const row = target.closest<HTMLElement>('table[data-row-edit] tbody tr');
    const table = row && tableOf(row);
    if (!row || !table) return;
    if (target instanceof HTMLSelectElement) {
      if (!isLive(table) && cancelling !== row) setDirty(row, true);
      dispatchCellChange(target, row);
    }
    if (isLive(table) && cancelling !== row) queueLiveSave(row);
  });

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;

    const cancelBtn = target.closest<HTMLElement>('[data-row-edit-cancel]');
    if (cancelBtn) {
      const row = cancelBtn.closest<HTMLElement>('table[data-row-edit] tbody tr');
      if (!row) return;
      cancelling = row;
      try {
        rowFields(row).forEach(resetField);
      } finally {
        cancelling = null;
      }
      refocusIntoRow(row, cancelBtn);
      setDirty(row, false);
      row.dispatchEvent(
        /**
         * @event bo:row-cancel
         * @target the cancelled `<tr>` (bubbles)
         * @when Cancel is activated; native fields are already restored —
         *   listen to restore consumer-rendered cell content the
         *   framework doesn't own (e.g. tag-input chips)
         * @detail row {HTMLTableRowElement} the live row
         * @detail rowId {string|null} the row's `data-row-id`, or null if unset
         */
        new CustomEvent('bo:row-cancel', {
          bubbles: true,
          detail: { row, rowId: row.getAttribute('data-row-id') },
        }),
      );
      return;
    }

    const saveBtn = target.closest<HTMLElement>('[data-row-edit-save]');
    if (saveBtn) {
      const row = saveBtn.closest<HTMLElement>('table[data-row-edit] tbody tr');
      if (!row) return;
      refocusIntoRow(row, saveBtn);
      saveRow(row);
    }
  });

  // Consumer-rendered cells (tag-input chips) never fire input/change on
  // the row's native fields — their intent events stand in. Removal is
  // framework-owned and always real. bo:tag-add fires on Enter BEFORE
  // your listener decides to append or reject, so a rejected duplicate
  // still marks the row dirty in batch mode (harmless — Cancel/Save both
  // resolve it); in live mode the save is deferred a microtask so your
  // append (same tick) lands before the save handler reads the row — a
  // rejected add then saves an unchanged row, a no-op for your backend.
  for (const type of ['bo:tag-add', 'bo:tag-remove']) {
    document.addEventListener(type, (e) => {
      const row = (e.target as Element | null)?.closest<HTMLElement>(
        'table[data-row-edit] tbody tr',
      );
      const table = row && tableOf(row);
      if (!row || !table) return;
      if (isLive(table)) queueLiveSave(row);
      else setDirty(row, true);
    });
  }
}
