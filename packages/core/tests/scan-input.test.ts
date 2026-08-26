import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initScanInput', () => {
  function scanInput(attrs = ''): HTMLInputElement {
    html`<input class="bo-input bo-input--code" data-scan-input ${attrs} />`;
    ui.initScanInput();
    return document.querySelector('[data-scan-input]')!;
  }

  it('Enter dispatches bo:scan with the value, clears the field, and refocuses it', () => {
    const input = scanInput();
    input.focus();
    input.value = '8901234567890';
    let detail: any;
    document.addEventListener('bo:scan', (e) => { detail = (e as CustomEvent).detail; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(detail).toEqual({ value: '8901234567890' });
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('ignores Enter on an empty field (no accidental empty scans)', () => {
    const input = scanInput();
    let fired = false;
    document.addEventListener('bo:scan', () => { fired = true; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fired).toBe(false);
  });

  it('respects a custom terminator key via data-scan-terminator', () => {
    const input = scanInput('data-scan-terminator="Tab"');
    input.value = '123';
    let fired = false;
    document.addEventListener('bo:scan', () => { fired = true; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fired).toBe(false); // wrong key for this field, ignored
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(fired).toBe(true);
  });

  it('back-to-back scans work without re-focusing manually', () => {
    const input = scanInput();
    const scans: string[] = [];
    document.addEventListener('bo:scan', (e) => scans.push((e as CustomEvent).detail.value));
    input.value = 'AAA';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.value = 'BBB';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(scans).toEqual(['AAA', 'BBB']);
  });

  it('announces the scanned value in the linked data-scan-status element', () => {
    html`
      <input class="bo-input bo-input--code" data-scan-input aria-describedby="scan-status" />
      <p id="scan-status" data-scan-status aria-live="polite"></p>
    `;
    ui.initScanInput();
    const input = document.querySelector('[data-scan-input]') as HTMLInputElement;
    const status = document.getElementById('scan-status')!;
    input.value = '8901234567890';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(status.textContent).toBe('Scanned 8901234567890');
  });

  it('without aria-describedby, behaves exactly as before (no error, no announcement)', () => {
    const input = scanInput();
    input.value = 'AAA';
    expect(() =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })),
    ).not.toThrow();
  });

  it('finds the status element when aria-describedby lists multiple IDs (ultrareview bug_005)', () => {
    html`
      <input class="bo-input bo-input--code" data-scan-input aria-describedby="scan-hint scan-status" />
      <p id="scan-hint">Focus the field and scan.</p>
      <p id="scan-status" data-scan-status aria-live="polite"></p>
    `;
    ui.initScanInput();
    const input = document.querySelector('[data-scan-input]') as HTMLInputElement;
    input.value = 'ITEM-42';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(document.getElementById('scan-status')!.textContent).toBe('Scanned ITEM-42');
    expect(document.getElementById('scan-hint')!.textContent).toBe('Focus the field and scan.');
  });
});
