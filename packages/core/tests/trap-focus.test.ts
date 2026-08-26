import { beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('trapFocus', () => {
  it('skips hidden elements when wrapping (grill finding R9)', () => {
    html`
      <dialog id="d">
        <button id="first">a</button>
        <button hidden id="ghost">hidden</button>
        <button id="last">b</button>
      </dialog>
    `;
    const dialog = document.getElementById('d')!;
    const last = document.getElementById('last')!;
    // jsdom lacks checkVisibility + layout; emulate the offsetParent fallback.
    for (const b of dialog.querySelectorAll<HTMLElement>('button')) {
      Object.defineProperty(b, 'offsetParent', {
        get: () => (b.hasAttribute('hidden') ? null : dialog),
      });
    }
    last.focus();
    const focusFirst = vi.spyOn(document.getElementById('first')!, 'focus');
    const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(e, 'currentTarget', { value: dialog });
    ui.trapFocus(e);
    expect(focusFirst).toHaveBeenCalled();
  });
});
