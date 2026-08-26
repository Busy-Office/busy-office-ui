import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initTabs', () => {
  function tabs(): HTMLElement[] {
    html`
      <div class="bo-tabs">
        <div class="bo-tabs__list" role="tablist" aria-label="t">
          <button class="bo-tabs__tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">One</button>
          <button class="bo-tabs__tab" role="tab" id="t2" tabindex="-1" aria-selected="false" aria-controls="p2">Two</button>
        </div>
        <div role="tabpanel" id="p1" tabindex="0"></div>
        <div role="tabpanel" id="p2" tabindex="0" hidden></div>
      </div>
    `;
    ui.initTabs();
    return Array.from(document.querySelectorAll('[role="tab"]'));
  }

  it('click activation moves selection, roving tabindex, and panel visibility', () => {
    const [t1, t2] = tabs();
    t2.click();
    expect(t2.getAttribute('aria-selected')).toBe('true');
    expect(t1.getAttribute('aria-selected')).toBe('false');
    expect(t1.tabIndex).toBe(-1);
    expect(t2.tabIndex).toBe(0);
    expect(document.getElementById('p1')!.hidden).toBe(true);
    expect(document.getElementById('p2')!.hidden).toBe(false);
  });

  it('ArrowRight activates the next tab and wraps', () => {
    const [t1, t2] = tabs();
    t1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(t2.getAttribute('aria-selected')).toBe('true');
    t2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(t1.getAttribute('aria-selected')).toBe('true');
  });
});
