import { beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('flashScanResult + data-scan-flash (126.2 — scan-result flash)', () => {
  it('capture stamps ok on body ONLY when the input opts in, and the stamp expires', async () => {
    vi.useFakeTimers();
    html`
      <input class="bo-input bo-input--code" data-scan-input aria-label="Scan" />
    `;
    ui.initScanInput();
    const input = document.querySelector<HTMLInputElement>('[data-scan-input]')!;
    input.value = '4006381333931';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(document.body.dataset.scanResult).toBeUndefined(); // no opt-in, no stamp

    input.setAttribute('data-scan-flash', '');
    input.value = '4006381333931';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(document.body.dataset.scanResult).toBe('ok');
    vi.advanceTimersByTime(800);
    expect(document.body.dataset.scanResult).toBeUndefined(); // timer, not animationend
    vi.useRealTimers();
  });

  it("error flash is the consumer's call, overrides a live ok, and can announce", async () => {
    vi.useFakeTimers();
    html`
      <input class="bo-input bo-input--code" data-scan-input data-scan-flash aria-label="Scan" />
      <p data-scan-status aria-live="polite" class="bo-visually-hidden"></p>
    `;
    ui.initScanInput();
    const input = document.querySelector<HTMLInputElement>('[data-scan-input]')!;
    input.value = 'WRONG-BIN';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(document.body.dataset.scanResult).toBe('ok'); // capture succeeded
    ui.flashScanResult('error', 'Wrong bin — expected A-01-04');
    expect(document.body.dataset.scanResult).toBe('error'); // validity is the app's verdict
    expect(document.querySelector('[data-scan-status]')!.textContent).toBe('Wrong bin — expected A-01-04');
    vi.advanceTimersByTime(800);
    expect(document.body.dataset.scanResult).toBeUndefined();
    vi.useRealTimers();
  });

  it('a stamp inside a live one RESTARTS the flash: the stamp is removed before the new one lands (392.1)', async () => {
    // A same-name animation on body::after never restarts on a value change,
    // so a late error painted nothing. jsdom cannot run CSS animations; what
    // it CAN see is the mechanism the browser needs — the attribute leaving
    // before it returns. The browser behaviour is a check:claims case.
    vi.useFakeTimers();
    const seen: Array<string | null> = [];
    const mo = new MutationObserver((recs) => {
      for (const r of recs) seen.push(r.oldValue); // the value BEFORE each mutation, captured at mutation time
    });
    mo.observe(document.body, { attributes: true, attributeOldValue: true, attributeFilter: ['data-scan-result'] });
    ui.flashScanResult('ok');
    ui.flashScanResult('error');
    ui.flashScanResult('error');
    await Promise.resolve();
    mo.disconnect();
    // set ok, remove ok, set error, remove error, set error — five mutations; an
    // in-place overwrite would be three: [null, 'ok', 'error']
    expect(seen).toEqual([null, 'ok', null, 'error', null]);
    vi.advanceTimersByTime(800);
    expect(document.body.dataset.scanResult).toBeUndefined();
    vi.useRealTimers();
  });
});
