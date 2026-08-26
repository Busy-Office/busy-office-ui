import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html, pick } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initMoneyField', () => {
  function money(opts = ''): { root: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement } {
    html`
      <div class="bo-money" ${opts}>
        <select class="bo-select bo-money__currency" aria-label="Currency">
          <option>USD</option>
          <option>JPY</option>
          <option>BHD</option>
          <option data-decimals="4">USD-4</option>
        </select>
        <input class="bo-input bo-input--numeric bo-money__amount" type="number" step="0.01" value="1234.5" aria-label="Amount" />
      </div>
    `;
    ui.initMoneyField();
    return {
      root: document.querySelector('.bo-money')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
    };
  }

  it('reformats ONLY losslessly: pads/trims, never rounds (Slice 19 grill fix)', () => {
    const { select, amount } = money();
    pick(select, 'JPY');
    expect(amount.step).toBe('1');
    expect(amount.value).toBe('1234.5'); // does NOT fit 0 decimals → value untouched
    pick(select, 'BHD');
    expect(amount.step).toBe('0.001');
    expect(amount.value).toBe('1234.500'); // pad — numerically identical, applies
    pick(select, 'JPY');
    expect(amount.value).toBe('1234.500'); // still lossy → untouched again
    amount.value = '1250.00';
    pick(select, 'USD');
    pick(select, 'JPY');
    expect(amount.value).toBe('1250'); // trim — lossless, applies
  });

  it('data-decimals on the selected option overrides the table (lossless pad)', () => {
    const { select, amount } = money();
    pick(select, 'USD-4');
    expect(amount.step).toBe('0.0001');
    expect(amount.value).toBe('1234.5000');
  });

  it('container override still never rounds a non-fitting value', () => {
    const { select, amount } = money('data-decimals="0"');
    pick(select, 'USD'); // table says 2, container says 0 — but 1234.5 doesn't fit 0
    expect(amount.step).toBe('1');
    expect(amount.value).toBe('1234.5');
  });

  it('lossless reformat dispatches input; skipped (lossy) reformat does not', () => {
    const { root, select, amount } = money();
    let inputs = 0;
    root.addEventListener('input', () => inputs++);
    pick(select, 'JPY'); // lossy → skipped → no synthetic input
    expect(inputs).toBe(0);
    pick(select, 'BHD'); // pad 1234.5 → 1234.500 → input
    expect(inputs).toBe(1);
    pick(select, 'BHD'); // no change → no input
    expect(inputs).toBe(1);
    amount.value = '9e21'; // beyond safe range → always left alone
    pick(select, 'USD');
    expect(amount.value).toBe('9e21');
    expect(inputs).toBe(1);
  });

  it('currencyDecimals is exported and case/space tolerant', () => {
    expect(ui.currencyDecimals('jpy')).toBe(0);
    expect(ui.currencyDecimals(' KWD ')).toBe(3);
    expect(ui.currencyDecimals('THB')).toBe(2);
    expect(ui.currencyDecimals('CLF')).toBe(4);
  });
});
