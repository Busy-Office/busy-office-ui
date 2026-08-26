import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('shared popover positioning (roadmap 105.1)', () => {
  const origInnerWidth = window.innerWidth;
  const origInnerHeight = window.innerHeight;
  function setViewport(width: number, height: number) {
    Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
    Object.defineProperty(window, 'innerHeight', { value: height, configurable: true });
  }
  function stubDims(el: HTMLElement, width: number, height: number) {
    Object.defineProperty(el, 'offsetWidth', { value: width, configurable: true });
    Object.defineProperty(el, 'offsetHeight', { value: height, configurable: true });
  }
  afterEach(() => setViewport(origInnerWidth, origInnerHeight));
  // jsdom doesn't implement CSS.escape (dropdown's position() uses it to
  // find the invoker by id); every other test in this file avoids opening a
  // popover via the real 'toggle' event, so this gap has never surfaced.
  beforeEach(() => {
    if (!(globalThis as any).CSS) (globalThis as any).CSS = {};
    (globalThis as any).CSS.escape ??= (s: string) => s;
  });

  it('dropdown: clamps to the viewport rather than overflowing past the right edge', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="clamp-menu">open</button>
      <div class="bo-dropdown__menu" id="clamp-menu" popover></div>
    `;
    const invoker = document.querySelector('button')!;
    const menu = document.getElementById('clamp-menu') as HTMLElement;
    setViewport(400, 800);
    stubDims(menu, 200, 40);
    invoker.getBoundingClientRect = () =>
      ({ top: 10, bottom: 30, left: 350, right: 390, width: 40 }) as DOMRect;
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    const toggleEvent = Object.assign(new Event('toggle'), { newState: 'open' });
    menu.dispatchEvent(toggleEvent);
    // Clamped: 400 (viewport) - 200 (menu) - 4 (margin) = 196, never 350 (the invoker's own left).
    expect(menu.style.left).toBe('196px');
    raf.mockRestore();
  });

  it('dropdown: flips above the invoker when there is no room below', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="flip-menu">open</button>
      <div class="bo-dropdown__menu" id="flip-menu" popover></div>
    `;
    const invoker = document.querySelector('button')!;
    const menu = document.getElementById('flip-menu') as HTMLElement;
    setViewport(800, 400);
    stubDims(menu, 150, 120);
    invoker.getBoundingClientRect = () =>
      ({ top: 340, bottom: 360, left: 100, right: 140, width: 40 }) as DOMRect;
    const raf = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
    const toggleEvent = Object.assign(new Event('toggle'), { newState: 'open' });
    menu.dispatchEvent(toggleEvent);
    // bottom (360) + gap (4) + menu height (120) = 484, past the 400px viewport,
    // so it flips: top (340) - height (120) - gap (4) = 216.
    expect(menu.style.top).toBe('216px');
    raf.mockRestore();
  });

  it('combobox: aligns to the RTL trailing edge instead of always the physical left', () => {
    ui.initCombobox();
    html`
      <div class="bo-combobox">
        <input class="bo-input" type="text" role="combobox" id="rtl-input"
            aria-expanded="false" aria-controls="rtl-list" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="rtl-list" role="listbox" popover>
          <li class="bo-combobox__option" role="option" id="rtl-opt-1" data-value="x">x</li>
        </ul>
      </div>
    `;
    const input = document.getElementById('rtl-input') as HTMLInputElement;
    const listbox = document.getElementById('rtl-list') as HTMLElement;
    listbox.style.direction = 'rtl';
    setViewport(800, 600);
    stubDims(listbox, 200, 100);
    input.getBoundingClientRect = () =>
      ({ top: 50, bottom: 74, left: 300, right: 340, width: 40 }) as DOMRect;
    input.value = 'x';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    // RTL start-align means the listbox's END (right) edge meets the input's
    // right edge: left = 340 (right) - 200 (width) = 140 — not 300, which is
    // what the old un-aware `left = r.left` would have produced in RTL too.
    expect(listbox.style.left).toBe('140px');
  });

  it('combobox: a stale inline inset-inline-start from a prior state does not survive a reposition', () => {
    ui.initCombobox();
    html`
      <div class="bo-combobox">
        <input class="bo-input" type="text" role="combobox" id="stale-input"
            aria-expanded="false" aria-controls="stale-list" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="stale-list" role="listbox" popover>
          <li class="bo-combobox__option" role="option" id="stale-opt-1" data-value="x">x</li>
        </ul>
      </div>
    `;
    const input = document.getElementById('stale-input') as HTMLInputElement;
    const listbox = document.getElementById('stale-list') as HTMLElement;
    // Simulate a stale logical offset surviving from an earlier open/flip —
    // the exact defect 105.1 red-proved before writing the fix.
    listbox.style.insetInlineStart = '999px';
    setViewport(800, 600);
    stubDims(listbox, 200, 100);
    input.getBoundingClientRect = () =>
      ({ top: 50, bottom: 74, left: 20, right: 60, width: 40 }) as DOMRect;
    input.value = 'x';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(listbox.style.insetInlineStart).toBe('auto');
    expect(listbox.style.left).toBe('20px');
  });

  it('context-menu: flips above the cursor when there is no room below (previously only clamped)', () => {
    ui.initContextMenu();
    html`
      <div data-context-menu="cm-1"></div>
      <div class="bo-dropdown__menu" id="cm-1" popover></div>
    `;
    const trigger = document.querySelector('[data-context-menu]') as HTMLElement;
    const menu = document.getElementById('cm-1') as HTMLElement & { showPopover: () => void };
    menu.showPopover = vi.fn();
    setViewport(800, 400);
    stubDims(menu, 120, 150);
    trigger.dispatchEvent(
      new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: 400, clientY: 380 }),
    );
    // y (380) + gap (4) + height (150) = 534, past the 400px viewport,
    // so it flips: y (380) - height (150) - gap (4) = 226.
    expect(menu.style.top).toBe('226px');
  });
});
