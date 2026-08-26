import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initCollapsibleCards', () => {
  function card(): { trigger: HTMLElement; body: HTMLElement } {
    html`
      <div class="bo-widget">
        <header class="bo-widget__header">
          <button data-collapse-trigger aria-expanded="true" aria-controls="c1">
            <span class="bo-widget__toggle-icon">▾</span> Title
          </button>
        </header>
        <div class="bo-widget__collapse" id="c1" data-state="open">
          <div class="bo-widget__body">content</div>
        </div>
      </div>
    `;
    ui.initCollapsibleCards();
    return {
      trigger: document.querySelector('[data-collapse-trigger]')!,
      body: document.getElementById('c1')!,
    };
  }

  it('click toggles aria-expanded and data-state open <-> closed', () => {
    const { trigger, body } = card();
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(body.dataset.state).toBe('closed');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(body.dataset.state).toBe('open');
  });

  it('clicking inside the trigger (the icon span) still toggles it', () => {
    const { trigger, body } = card();
    document.querySelector<HTMLElement>('.bo-widget__toggle-icon')!.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(body.dataset.state).toBe('closed');
  });
});
