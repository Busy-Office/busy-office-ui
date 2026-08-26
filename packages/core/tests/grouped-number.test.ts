import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initGroupedNumber (123.1 — grouped display, format on blur)', () => {
  it('upgrades at init: number→text+inputmode, name moves to a hidden raw input, display groups', () => {
    html`
      <input class="bo-input bo-input--numeric" type="number" step="0.01"
             name="amount" value="1234567.5" data-grouped data-locale="en-US"
             aria-label="Amount" />
    `;
    ui.initGroupedNumber();
    const input = document.querySelector<HTMLInputElement>('[data-grouped]')!;
    expect(input.type).toBe('text');
    expect(input.inputMode).toBe('decimal');
    expect(input.hasAttribute('name')).toBe(false);
    const hidden = document.querySelector<HTMLInputElement>('input[type="hidden"][name="amount"]')!;
    expect(hidden).not.toBeNull();
    expect(hidden.value).toBe('1234567.50'); // raw, lossless-padded — never grouped
    expect(input.value).toBe('1,234,567.50');
  });

  function lateInput(attrs: string): HTMLInputElement {
    document.body.innerHTML = `<input type="number" name="n" ${attrs} data-grouped aria-label="N" />`;
    const input = document.querySelector<HTMLInputElement>('[data-grouped]')!;
    input.focus(); // late-added content upgrades on first focus
    return input;
  }

  it('focus shows the raw value for editing; blur re-groups what was typed', () => {
    const input = lateInput('step="0.01" value="1234567.5" data-locale="en-US"');
    expect(input.value).toBe('1234567.50'); // raw while focused
    input.value = '2500';
    input.blur();
    expect(input.value).toBe('2,500.00');
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('2500.00');
  });

  it('grouping is Intl-driven, not every-3-digits: en-IN lakh/crore', () => {
    const input = lateInput('data-decimals="2" value="1234567.5" data-locale="en-IN"');
    input.blur();
    expect(input.value).toBe('12,34,567.50');
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('1234567.50');
  });

  it('parses comma-decimal typing under de-DE, and a lone dot is a decimal, never grouping', () => {
    const input = lateInput('data-decimals="2" value="" data-locale="de-DE"');
    input.value = '1234,5';
    input.blur();
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('1234.50');
    expect(input.value).toBe('1.234,50');
    input.focus();
    input.value = '1.5'; // the SAP-community trap: must be 1.5, not 15
    input.blur();
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('1.50');
  });

  it('non-numeric text stays visible for correction and submits empty (native-number parity)', () => {
    const input = lateInput('data-decimals="2" value="" data-locale="en-US"');
    input.value = 'abc';
    input.blur();
    expect(input.value).toBe('abc');
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('');
  });

  it('never rounds a value the precision cannot represent (lossless rule)', () => {
    const input = lateInput('data-decimals="0" value="12.4" data-locale="en-US"');
    input.blur();
    expect(input.value).toBe('12.4'); // own decimals kept, not "12"
    expect(document.querySelector<HTMLInputElement>('input[name="n"]')!.value).toBe('12.4');
  });

  it('quantity steppers operate on the machine value of a grouped input', () => {
    html`
      <div class="bo-quantity">
        <button class="bo-quantity__step" type="button" tabindex="-1" data-quantity-step="-1">−</button>
        <input class="bo-quantity__input" type="number" step="1" name="qty"
               value="1250" data-grouped data-locale="en-US" aria-label="Qty" />
        <button class="bo-quantity__step" type="button" tabindex="-1" data-quantity-step="1">+</button>
      </div>
    `;
    ui.initQuantity();
    const input = document.querySelector<HTMLInputElement>('.bo-quantity__input')!;
    input.focus();
    input.blur(); // upgrade + settle: display "1,250"
    expect(input.value).toBe('1,250');
    document.querySelector<HTMLButtonElement>('[data-quantity-step="1"]')!.click();
    expect(input.value).toBe('1,251');
    expect(document.querySelector<HTMLInputElement>('input[name="qty"]')!.value).toBe('1251');
  });

  it('money currency change reformats a grouped amount through its raw value', () => {
    html`
      <div class="bo-money">
        <select class="bo-select bo-money__currency" aria-label="Currency">
          <option selected>USD</option>
          <option>JPY</option>
        </select>
        <input class="bo-input bo-money__amount" type="number" step="0.01"
               name="amt" value="1250" data-grouped data-locale="en-US" aria-label="Amount" />
      </div>
    `;
    ui.initMoneyField();
    const amount = document.querySelector<HTMLInputElement>('.bo-money__amount')!;
    amount.focus();
    amount.blur();
    expect(amount.value).toBe('1,250.00');
    const select = document.querySelector<HTMLSelectElement>('.bo-money__currency')!;
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(amount.value).toBe('1,250');
    expect(document.querySelector<HTMLInputElement>('input[name="amt"]')!.value).toBe('1250');
  });
});
describe('initGroupedNumber — form-reset + focus-selection contract (0.4.0 dogfood bugs)', () => {
  function groupedInForm(): { form: HTMLFormElement; input: HTMLInputElement } {
    html`
      <form>
        <input type="number" step="0.01" name="amount" value="1234567.5"
               data-grouped data-locale="en-US" aria-label="Amount" />
        <button type="reset">Cancel</button>
      </form>
    `;
    const input = document.querySelector<HTMLInputElement>('[data-grouped]')!;
    input.focus(); input.blur(); // upgrade + settle
    return { form: document.querySelector('form')!, input };
  }

  it('form reset restores the grouped display AND the hidden raw value (not a bare attr default)', async () => {
    const { form, input } = groupedInForm();
    input.focus();
    input.value = '42';
    input.blur();
    expect(input.value).toBe('42.00');
    form.reset();
    await new Promise((r) => setTimeout(r, 0)); // resync runs after the browser applies the reset
    expect(input.value).toBe('1,234,567.50'); // grouped, not the raw attr default
    expect(document.querySelector<HTMLInputElement>('input[type=hidden][name=amount]')!.value)
      .toBe('1234567.50'); // NOT '' — the browser reset an attr-less hidden to empty
  });

  it('composes with row-edit: Cancel (form reset) leaves the row CLEAN and the value grouped', async () => {
    /* The E2E dogfood bug: grouped's reset-resync dispatched input AFTER
       row-edit's own reset listener had cleared dirty rows, re-marking the
       row dirty on an untouched-looking form. The resync must be silent. */
    html`
      <form>
        <table data-row-edit>
          <tbody>
            <tr data-row-id="amount"><td>
              <input type="number" step="0.01" name="amount" value="1234567.5"
                     data-grouped data-locale="en-US" aria-label="Amount" />
            </td></tr>
          </tbody>
        </table>
        <button type="reset">Cancel</button>
      </form>
    `;
    ui.initRowEdit();
    ui.initGroupedNumber();
    const input = document.querySelector<HTMLInputElement>('[data-grouped]')!;
    const row = document.querySelector<HTMLElement>('tr[data-row-id="amount"]')!;
    input.focus(); input.blur(); // upgrade + settle
    input.focus(); input.value = '42'; input.blur(); // a real edit
    expect(row.dataset.rowState).toBe('dirty');
    document.querySelector('form')!.reset();
    await new Promise((r) => setTimeout(r, 0));
    await new Promise((r) => setTimeout(r, 0)); // both deferred handlers
    expect(row.dataset.rowState).not.toBe('dirty');
    expect(input.value).toBe('1,234,567.50');
    expect(document.querySelector<HTMLInputElement>('input[type=hidden][name=amount]')!.value)
      .toBe('1234567.50');
  });

  it('focus selects the raw value, so select-and-retype replaces instead of appending', () => {
    const { input } = groupedInForm();
    input.focus();
    expect(input.value).toBe('1234567.50');
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });
});
