import { beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initDropdowns (popover)', () => {
  it('closes the popover when an item is picked', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="m1">open</button>
      <div class="bo-dropdown__menu" id="m1" popover>
        <button class="bo-dropdown__item" type="button">Pick</button>
      </div>
    `;
    const menu = document.getElementById('m1') as HTMLElement & {
      hidePopover: () => void;
    };
    // jsdom has no popover implementation — stub the API surface.
    menu.hidePopover = vi.fn();
    document.querySelector<HTMLElement>('.bo-dropdown__item')!.click();
    expect(menu.hidePopover).toHaveBeenCalledTimes(1);
  });

  it('multi-select: checking an item does not close the menu, and updates the trigger label with a count', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="m2" data-multiselect-label="Cost center">Cost center</button>
      <div class="bo-dropdown__menu" id="m2" popover data-multiselect>
        <label class="bo-dropdown__item"><input type="checkbox" value="CC-1180" /> CC-1180</label>
        <label class="bo-dropdown__item"><input type="checkbox" value="CC-2205" /> CC-2205</label>
      </div>
    `;
    const menu = document.getElementById('m2') as HTMLElement & { hidePopover: () => void };
    menu.hidePopover = vi.fn();
    const [first, second] = [...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];

    first.click();
    expect(menu.hidePopover).not.toHaveBeenCalled();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (1)');

    second.click();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (2)');

    first.click();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (1)');
  });
});

/* Shared popover-positioning geometry (roadmap 105.1): dropdown, combobox
   and context-menu all route through one helper now. These tests exercise
   it through each public behavior rather than importing the helper
   directly — same convention every other test in this file follows
   (test what ships, via the public init functions). */
