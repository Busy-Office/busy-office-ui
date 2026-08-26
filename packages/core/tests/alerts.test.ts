import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initAlerts', () => {
  it('dismiss removes the enclosing alert — including injected toasts', () => {
    ui.initAlerts();
    html`<div class="bo-toast-region" role="status" aria-live="polite"></div>`;
    document.querySelector('.bo-toast-region')!.innerHTML =
      '<div class="bo-alert bo-toast">saved <button class="bo-alert__dismiss" aria-label="Dismiss">x</button></div>';
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    expect(document.querySelector('.bo-alert')).toBeNull();
  });
});
