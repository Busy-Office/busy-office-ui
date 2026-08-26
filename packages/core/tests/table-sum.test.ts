import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initTableSum robustness (Slice 19 item 4, grill H1/H2 + checkbox)', () => {
  it('step="any" or missing step derives decimals from the values, not 0', () => {
    html`
      <table>
        <tbody>
          <tr><td><input name="qty" type="number" step="any" value="2.25" aria-label="Qty A" /></td></tr>
          <tr><td><input name="qty" type="number" value="5.25" aria-label="Qty B" /></td></tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty">7.50</td></tr></tfoot>
      </table>
    `;
    ui.initTableSum();
    const a = document.querySelector<HTMLInputElement>('[aria-label="Qty A"]')!;
    a.value = '2.30';
    a.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('[data-sum-of="qty"]')!.textContent).toBe('7.55'); // not "8"
  });

  it('data-decimals="" means "not supplied" and falls back to the step width, not 0', () => {
    // 2026-08-21 sweep: an inline second parser treated '' as 0 and forced
    // integer totals; parseDecimalsAttr now handles both call sites.
    html`
      <table>
        <tbody>
          <tr><td><input name="qty" type="number" step="0.01" value="2.25" aria-label="Qty" /></td></tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty" data-decimals="">2.25</td></tr></tfoot>
      </table>
    `;
    ui.initTableSum();
    const qty = document.querySelector<HTMLInputElement>('[aria-label="Qty"]')!;
    qty.value = '2.30';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('[data-sum-of="qty"]')!.textContent).toBe('2.30'); // not "2"
  });

  it('a nested table\'s same-named fields are not double-counted into the outer sum', () => {
    html`
      <table>
        <tbody>
          <tr><td><input name="qty" type="number" step="0.01" value="2.00" aria-label="Outer" /></td></tr>
          <tr><td>
            <table>
              <tbody><tr><td><input name="qty" type="number" step="0.01" value="99.00" aria-label="Inner" /></td></tr></tbody>
            </table>
          </td></tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty">2.00</td></tr></tfoot>
      </table>
    `;
    ui.initTableSum();
    const outer = document.querySelector<HTMLInputElement>('[aria-label="Outer"]')!;
    outer.value = '3.00';
    outer.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('[data-sum-of="qty"]')!.textContent).toBe('3.00'); // not 102.00
  });

  it('checkboxes/radios sharing the summed name are excluded', () => {
    html`
      <table>
        <tbody>
          <tr>
            <td><input name="qty" type="number" step="1" value="4" aria-label="Qty" /></td>
            <td><input name="qty" type="checkbox" value="1" checked aria-label="Flag" /></td>
          </tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty">4</td></tr></tfoot>
      </table>
    `;
    ui.initTableSum();
    const qty = document.querySelector<HTMLInputElement>('[aria-label="Qty"]')!;
    qty.value = '5';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    expect(document.querySelector('[data-sum-of="qty"]')!.textContent).toBe('5'); // not 6
  });
});
