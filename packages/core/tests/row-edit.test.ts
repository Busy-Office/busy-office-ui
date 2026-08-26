import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initRowEdit', () => {
  function table(): HTMLTableElement {
    html`
      <table class="bo-data-table" data-row-edit>
        <tbody>
          <tr data-row-id="WIDGET-A">
            <td><input class="bo-input bo-input--seamless" value="12" /></td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    return document.querySelector('table')!;
  }

  it('typing in a row reveals its dirty badge and save/cancel, and marks data-row-state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    expect((t.querySelector('[data-row-edit-dirty]') as HTMLElement).hidden).toBe(false);
    expect((t.querySelector('[data-row-edit-save]') as HTMLElement).hidden).toBe(false);
    expect((t.querySelector('[data-row-edit-cancel]') as HTMLElement).hidden).toBe(false);
  });

  it('cancel resets the input to its last-saved value and clears dirty state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-cancel]') as HTMLElement).click();
    expect(input.value).toBe('12');
    expect(row.hasAttribute('data-row-state')).toBe(false);
    expect((t.querySelector('[data-row-edit-dirty]') as HTMLElement).hidden).toBe(true);
  });

  it('save dispatches bo:row-save with the row id and clears dirty state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    let detail: any = null;
    t.addEventListener('bo:row-save', (e: any) => { detail = e.detail; });
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-save]') as HTMLElement).click();
    expect(detail.rowId).toBe('WIDGET-A');
    expect(detail.row).toBe(row);
    expect(row.hasAttribute('data-row-state')).toBe(false);
    // Saved value becomes the new baseline — a later cancel reverts to it, not the original.
    input.value = '100';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-cancel]') as HTMLElement).click();
    expect(input.value).toBe('99');
  });

  it('composes with a combobox cell: committing an option marks the row dirty', () => {
    html`
      <table class="bo-data-table" data-row-edit>
        <tbody>
          <tr data-row-id="PO-1">
            <td>
              <div class="bo-combobox">
                <input class="bo-input bo-input--seamless" role="combobox" id="grid-cb"
                    aria-expanded="false" aria-controls="grid-cb-list" aria-autocomplete="list" autocomplete="off" />
                <ul class="bo-combobox__listbox" id="grid-cb-list" role="listbox" popover>
                  <li class="bo-combobox__option" role="option" id="grid-opt-1" data-value="CC-1180">CC-1180</li>
                </ul>
              </div>
            </td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initCombobox();
    const row = document.querySelector('tr') as HTMLTableRowElement;
    (document.getElementById('grid-opt-1') as HTMLElement).click();
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    expect((row.querySelector('[data-row-edit-save]') as HTMLElement).hidden).toBe(false);
  });
});
describe('initRowEdit advanced cells + save models (Slice 18 item 4)', () => {
  function advancedTable(mode = ''): { table: HTMLElement; row: HTMLElement } {
    html`
      <table data-row-edit${mode ? `="${mode}"` : ''}>
        <tbody>
          <tr data-row-id="A-1">
            <td><input name="qty" type="number" step="0.01" value="2.50" aria-label="Qty" /></td>
            <td><select name="status" aria-label="Status">
              <option selected>Open</option><option>Closed</option>
            </select></td>
            <td><input name="urgent" type="checkbox" aria-label="Urgent" /></td>
            <td><input name="due" type="date" value="2026-08-20" aria-label="Due" /></td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty">2.50</td></tr></tfoot>
      </table>
    `;
    ui.initRowEdit();
    ui.initTableSum();
    return { table: document.querySelector('table')!, row: document.querySelector('tbody tr')! };
  }

  it('bo:cell-change carries rowId/field/value for input, select, and checkbox', () => {
    const { row } = advancedTable();
    const seen: any[] = [];
    row.addEventListener('bo:cell-change', (e: any) => seen.push(e.detail));

    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '3.00';
    qty.dispatchEvent(new Event('input', { bubbles: true }));

    const status = row.querySelector<HTMLSelectElement>('[name="status"]')!;
    status.value = 'Closed';
    status.dispatchEvent(new Event('change', { bubbles: true }));

    const urgent = row.querySelector<HTMLInputElement>('[name="urgent"]')!;
    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));

    expect(seen).toEqual([
      { rowId: 'A-1', field: 'qty', value: '3.00' },
      { rowId: 'A-1', field: 'status', value: 'Closed' },
      { rowId: 'A-1', field: 'urgent', value: true },
    ]);
  });

  it('checkbox + date cells: dirty, Cancel restores checked/value, Save baselines', () => {
    const { row } = advancedTable();
    const urgent = row.querySelector<HTMLInputElement>('[name="urgent"]')!;
    const due = row.querySelector<HTMLInputElement>('[name="due"]')!;

    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));
    due.value = '2026-09-01';
    due.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');

    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(urgent.checked).toBe(false);
    expect(due.value).toBe('2026-08-20');

    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));
    row.querySelector<HTMLElement>('[data-row-edit-save]')!.click();
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click(); // no-op reset
    expect(urgent.checked).toBe(true); // saved baseline sticks
  });

  it('data-sum-of recomputes in realtime, and Cancel-restores recompute it too', () => {
    const { table, row } = advancedTable();
    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '4.25';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    expect(table.querySelector('[data-sum-of="qty"]')!.textContent).toBe('4.25');
    // the stale-total bug the live check caught: reset must be announced
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(table.querySelector('[data-sum-of="qty"]')!.textContent).toBe('2.50');
  });

  it('live mode: a committed change dispatches bo:row-save + re-baselines, no dirty UI', async () => {
    const { row } = advancedTable('live');
    const saves: any[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));

    const status = row.querySelector<HTMLSelectElement>('[name="status"]')!;
    status.value = 'Closed';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve(); // live saves are microtask-deferred (Slice 19 item 2)
    expect(saves).toEqual(['A-1']);
    expect(row.hasAttribute('data-row-state')).toBe(false);
    // baseline moved: cancel-equivalent reset would keep Closed
    expect([...status.options].find((o) => o.defaultSelected)!.text).toBe('Closed');
  });

  it('bo:row-cancel fires after native fields restore (consumer chips restore hook)', () => {
    const { row } = advancedTable();
    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '9.99';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    let cancelled: any = null;
    let valueAtCancel = '';
    row.addEventListener('bo:row-cancel', (e: any) => {
      cancelled = e.detail.rowId;
      valueAtCancel = qty.value;
    });
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(cancelled).toBe('A-1');
    expect(valueAtCancel).toBe('2.50'); // already restored when the event fired
  });

  it('tag events mark a batch row dirty; live mode saves after a microtask', async () => {
    html`
      <table data-row-edit="live">
        <tbody><tr data-row-id="T-1"><td>
          <div class="bo-tag-input">
            <span class="bo-tag-input__tag">CC-1<button class="bo-tag-input__remove" type="button" aria-label="Remove CC-1">×</button></span>
            <input class="bo-tag-input__field" type="text" aria-label="Cost centers" />
          </div>
        </td></tr></tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initTagInput();
    const row = document.querySelector('tbody tr')!;
    const saves: any[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    (document.querySelector('.bo-tag-input__remove') as HTMLElement).click();
    expect(saves).toEqual([]); // deferred
    await Promise.resolve();
    expect(saves).toEqual(['T-1']);
  });
});
describe('initRowEdit focus management (Slice 19 item 3, grill H4 / WCAG 2.4.3)', () => {
  function focusRow(): { row: HTMLElement; field: HTMLInputElement; save: HTMLElement; cancel: HTMLElement } {
    html`
      <table data-row-edit>
        <tbody>
          <tr data-row-id="F-1">
            <td><input name="qty" value="4" aria-label="Qty" /></td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    return {
      row: document.querySelector('tbody tr')!,
      field: document.querySelector('[name="qty"]')!,
      save: document.querySelector('[data-row-edit-save]')!,
      cancel: document.querySelector('[data-row-edit-cancel]')!,
    };
  }

  it('Save moves focus to the row instead of dropping it with the hidden button', () => {
    const { row, field, save } = focusRow();
    field.value = '5';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    (save as HTMLButtonElement).focus();
    save.click();
    expect(save.hidden).toBe(true);
    expect(document.activeElement).toBe(field); // not the hidden button, not <body>
  });

  it('Cancel moves focus the same way', () => {
    const { field, cancel } = focusRow();
    field.value = '9';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    (cancel as HTMLButtonElement).focus();
    cancel.click();
    expect(document.activeElement).toBe(field);
  });

  it('focus is left alone when the action was not keyboard/pointer-focused within the row', () => {
    const { field, save } = focusRow();
    field.value = '5';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.focus(); // user is in the field; save clicked programmatically elsewhere
    save.click();
    expect(document.activeElement).toBe(field); // unchanged, no focus theft
  });
});
describe('initRowEdit live-mode save integrity (Slice 19 item 2, grill E3/H3)', () => {
  function liveMoneyRow(): { row: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement; notes: HTMLInputElement } {
    html`
      <table data-row-edit="live">
        <tbody>
          <tr data-row-id="LV-1">
            <td>
              <div class="bo-money">
                <select class="bo-select bo-money__currency" aria-label="Currency">
                  <option selected>USD</option>
                  <option>JPY</option>
                </select>
                <input class="bo-input bo-money__amount" type="number" step="0.01" value="1250.00" aria-label="Amount" />
              </div>
            </td>
            <td><input name="notes" value="original" aria-label="Notes" /></td>
            <td>
              <!-- docs suggest omitting these in live mode; nothing enforces it -->
              <button type="button" data-row-edit-cancel>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initMoneyField();
    return {
      row: document.querySelector('tbody tr')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
      notes: document.querySelector('[name="notes"]')!,
    };
  }

  it('Cancel on a live table never fires a save; every field restores (Cancel-becomes-Save bug)', async () => {
    const { row, select, amount, notes } = liveMoneyRow();
    // mid-edit state: fields differ from their baselines with NO committed
    // change yet (typing in progress / consumer-set values) — the exact
    // precondition under which Cancel's select-restore change fired a save
    notes.value = 'edited';
    amount.value = '999.00';
    select.value = 'JPY';
    const saves: string[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    await Promise.resolve();
    expect(saves).toEqual([]); // the select-reset change must NOT save mid-cancel
    expect(select.value).toBe('USD');
    expect(notes.value).toBe('original'); // restored, not baselined-away
  });

  it('live save carries the post-reformat value (save-before-reformat bug)', async () => {
    const { row, select, amount } = liveMoneyRow();
    let valueAtSave: string | null = null;
    row.addEventListener('bo:row-save', () => { valueAtSave = amount.value; });
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve(); // deferred save
    expect(valueAtSave).toBe('1250'); // trimmed by the reformat BEFORE the save read it
  });

  it('same-tick changes coalesce into one save', async () => {
    const { row, select, notes } = liveMoneyRow();
    const saves: string[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    notes.dispatchEvent(new Event('change', { bubbles: true }));
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve();
    expect(saves).toEqual(['LV-1']);
  });

  it('a row detached in the same tick is never saved or mutated (lost-save guard)', async () => {
    const { row, notes } = liveMoneyRow();
    const saves: string[] = [];
    document.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    notes.value = 'edited';
    notes.dispatchEvent(new Event('change', { bubbles: true }));
    row.remove(); // consumer removes the line in the same tick
    await Promise.resolve();
    expect(saves).toEqual([]);
    expect(notes.defaultValue).toBe('original'); // detached row must not be baselined
  });
});
describe('initRowEdit + money cell composition (Slice 18 item 3)', () => {
  function editableMoneyRow(): { row: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement; save: HTMLElement; cancel: HTMLElement } {
    html`
      <table data-row-edit>
        <tbody>
          <tr data-row-id="L-1">
            <td>
              <div class="bo-money">
                <select class="bo-select bo-money__currency" aria-label="Currency">
                  <option selected>USD</option>
                  <option>JPY</option>
                </select>
                <input class="bo-input bo-money__amount" type="number" step="0.01" value="1250.00" aria-label="Amount" />
              </div>
            </td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initMoneyField();
    return {
      row: document.querySelector('tr')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
      save: document.querySelector('[data-row-edit-save]')!,
      cancel: document.querySelector('[data-row-edit-cancel]')!,
    };
  }

  it('currency change marks the row dirty; Cancel restores selection, value AND step', () => {
    const { row, select, amount, cancel } = editableMoneyRow();
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty'); // via the change listener (jsdom fires no input for selects)
    expect(amount.value).toBe('1250'); // reformatted to 0 decimals
    expect(amount.step).toBe('1');

    cancel.click();
    expect(row.hasAttribute('data-row-state')).toBe(false);
    expect(select.value).toBe('USD');
    expect(amount.value).toBe('1250.00'); // defaultValue restored
    expect(amount.step).toBe('0.01'); // re-derived from the restored currency
  });

  it('Save re-baselines the select — a later Cancel keeps the saved currency', () => {
    const { row, select, amount, save, cancel } = editableMoneyRow();
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    save.click();
    expect(row.hasAttribute('data-row-state')).toBe(false);

    amount.value = '900';
    amount.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    cancel.click();
    expect(select.value).toBe('JPY'); // saved baseline, not the original USD
    expect(amount.value).toBe('1250'); // the value saved alongside it
  });
});
