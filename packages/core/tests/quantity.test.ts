import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html, pick } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initQuantity', () => {
  function quantity(attrs = 'min="0" max="10" step="1" value="4"'): {
    root: HTMLElement;
    input: HTMLInputElement;
    dec: HTMLButtonElement;
    inc: HTMLButtonElement;
  } {
    html`
      <div class="bo-quantity">
        <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
        <input class="bo-quantity__input" type="number" ${attrs} />
        <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
      </div>
    `;
    ui.initQuantity();
    return {
      root: document.querySelector('.bo-quantity')!,
      input: document.querySelector('.bo-quantity__input')!,
      dec: document.querySelector('[data-quantity-step="-1"]')!,
      inc: document.querySelector('[data-quantity-step="1"]')!,
    };
  }

  it('increment/decrement buttons step the value and fire input+change', () => {
    const { input, dec, inc } = quantity();
    let changed = 0;
    input.addEventListener('change', () => changed++);
    inc.click();
    expect(input.value).toBe('5');
    dec.click();
    dec.click();
    expect(input.value).toBe('3');
    expect(changed).toBe(3);
  });

  it('clamps at min/max and disables the corresponding button once reached', () => {
    const { input, dec, inc } = quantity('min="0" max="5" step="1" value="4"');
    inc.click();
    expect(input.value).toBe('5');
    expect(inc.disabled).toBe(true); // reactively synced after the click
    inc.click();
    expect(input.value).toBe('5'); // unchanged, button is disabled
    dec.click();
    expect(inc.disabled).toBe(false); // re-enabled once off the boundary
    for (let i = 0; i < 10; i++) dec.click();
    expect(input.value).toBe('0');
    expect(dec.disabled).toBe(true);
  });

  it('respects a non-1 step', () => {
    const { input, inc } = quantity('min="0" max="20" step="5" value="0"');
    inc.click();
    expect(input.value).toBe('5');
  });

  it('fractional step never leaves floating-point artifacts (ultrareview bug_003)', () => {
    const { input, inc } = quantity('min="0" max="5" step="0.01" value="0.28"');
    inc.click();
    expect(input.value).toBe('0.29'); // not 0.29000000000000004
    const { input: input2, inc: inc2 } = (() => {
      html`
        <div class="bo-quantity">
          <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
          <input class="bo-quantity__input" type="number" min="0" max="5" step="0.1" value="0.2" />
          <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
        </div>
      `;
      return { input: document.querySelector<HTMLInputElement>('.bo-quantity__input')!, inc: document.querySelector<HTMLButtonElement>('[data-quantity-step="1"]')! };
    })();
    inc2.click();
    expect(input2.value).toBe('0.3'); // not 0.30000000000000004
    void input;
  });
});
describe('initQuantity unit select (embedded unit table)', () => {
  function unitQuantity(opts = ''): { root: HTMLElement; select: HTMLSelectElement; input: HTMLInputElement } {
    html`
      <div class="bo-quantity" ${opts}>
        <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
        <input class="bo-quantity__input" type="number" min="0" step="0.01" value="2.5" aria-label="Quantity" />
        <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
        <select class="bo-select bo-quantity__unit-select" aria-label="Unit">
          <option>kg</option>
          <option>each</option>
          <option>mg</option>
          <option data-decimals="4">kg — lab</option>
        </select>
      </div>
    `;
    ui.initQuantity();
    return {
      root: document.querySelector('.bo-quantity')!,
      select: document.querySelector('.bo-quantity__unit-select')!,
      input: document.querySelector('.bo-quantity__input')!,
    };
  }

  it('unit change adjusts step; value only reformats losslessly (Slice 19 grill fix)', () => {
    const { select, input } = unitQuantity();
    pick(select, 'each');
    expect(input.step).toBe('1');
    expect(input.value).toBe('2.5'); // 2.5 does NOT fit 0 decimals → untouched, never rounds
    pick(select, 'mg');
    expect(input.step).toBe('0.001');
    expect(input.value).toBe('2.500'); // pad — lossless
  });

  it('unknown units leave precision entirely alone; override still wins', () => {
    const { select, input } = unitQuantity();
    // inject an unknown master-data-style unit code
    const opt = document.createElement('option');
    opt.textContent = 'MT';
    select.append(opt);
    pick(select, 'MT');
    expect(input.step).toBe('0.01'); // untouched — unknown unit, no opinion
    expect(input.value).toBe('2.5');
    expect(ui.unitDecimals('bundle-of-widgets')).toBeUndefined();
    expect(ui.unitDecimals(' KG ')).toBe(2);
    expect(ui.unitDecimals('hr')).toBe(2);
    pick(select, 'kg — lab'); // data-decimals=4 (value-based select: jsdom's selectedIndex setter is unreliable post-value-set)
    expect(input.step).toBe('0.0001');
    expect(input.value).toBe('2.5000');
  });
});
