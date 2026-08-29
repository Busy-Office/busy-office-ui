import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

const TOAST =
  '<div class="bo-alert bo-toast">saved <button class="bo-alert__dismiss" aria-label="Dismiss">x</button></div>';

function toastRegion(count = 1) {
  html`<div class="bo-toast-region" role="status" aria-live="polite"></div>`;
  document.querySelector('.bo-toast-region')!.innerHTML = TOAST.repeat(count);
}

/**
 * jsdom runs no animations and computes no duration, so the animated path
 * cannot be reached by loading the CSS — the duration has to be stubbed.
 * That is the whole point of reading it from the computed style rather than
 * hard-coding it: the branch is addressable. The live evidence that the
 * animation itself runs is check-claims' `toast:` cases, in a real browser.
 */
function stubExitDuration(value: string) {
  const real = window.getComputedStyle.bind(window);
  return vi
    .spyOn(window, 'getComputedStyle')
    .mockImplementation(((el: Element, pseudo?: string | null) => {
      if (el instanceof HTMLElement && el.dataset.state === 'closing') {
        return { ...real(el), animationDuration: value } as CSSStyleDeclaration;
      }
      return real(el, pseudo ?? undefined);
    }) as typeof window.getComputedStyle);
}

describe('initAlerts', () => {
  it('dismiss removes the enclosing alert — including injected toasts', () => {
    ui.initAlerts();
    toastRegion();
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    expect(document.querySelector('.bo-alert')).toBeNull();
  });

  it('an inline alert is never held for an exit — it is removed synchronously', () => {
    ui.initAlerts();
    stubExitDuration('0.1s');
    html`<div class="bo-alert bo-alert--warning">
      expiring <button class="bo-alert__dismiss" aria-label="Dismiss">x</button>
    </div>`;
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    expect(document.querySelector('.bo-alert')).toBeNull();
  });

  it('a toast with a non-zero exit duration is held, marked closing, then removed', () => {
    vi.useFakeTimers();
    ui.initAlerts();
    stubExitDuration('0.1s');
    toastRegion();
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();

    const toast = document.querySelector<HTMLElement>('.bo-toast');
    expect(toast).not.toBeNull();
    expect(toast!.dataset.state).toBe('closing');
    // The definite length the block-size collapse interpolates from.
    expect(toast!.style.blockSize).toMatch(/^\d+(\.\d+)?px$/);

    vi.advanceTimersByTime(99);
    expect(document.querySelector('.bo-toast')).not.toBeNull();
    vi.advanceTimersByTime(1);
    expect(document.querySelector('.bo-toast')).toBeNull();
  });

  it('a zero duration removes synchronously — the reduced-motion and no-CSS path', () => {
    ui.initAlerts();
    stubExitDuration('0s');
    toastRegion();
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    expect(document.querySelector('.bo-toast')).toBeNull();
  });

  it('the longest duration in the list wins — a consumer animation cannot be cut short', () => {
    vi.useFakeTimers();
    ui.initAlerts();
    stubExitDuration('0.1s, 250ms');
    toastRegion();
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    vi.advanceTimersByTime(200);
    expect(document.querySelector('.bo-toast')).not.toBeNull();
    vi.advanceTimersByTime(50);
    expect(document.querySelector('.bo-toast')).toBeNull();
  });

  it('a second dismiss on a closing toast does not queue a second removal', () => {
    vi.useFakeTimers();
    ui.initAlerts();
    stubExitDuration('0.1s');
    toastRegion(2);
    const [first, second] = document.querySelectorAll<HTMLElement>('.bo-alert__dismiss');
    first.click();
    first.click();
    expect(first.closest<HTMLElement>('.bo-toast')!.dataset.state).toBe('closing');
    // The other toast is untouched by either click — the guard is per toast,
    // not a global "one exit at a time".
    expect(second.closest('.bo-toast')!.dataset.state).toBeUndefined();
    vi.advanceTimersByTime(100);
    expect(document.querySelectorAll('.bo-toast').length).toBe(1);
  });
});
