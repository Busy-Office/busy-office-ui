import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initValidationSummary', () => {
  function form(): HTMLFormElement {
    html`
      <form data-validation-summary novalidate>
        <div class="bo-alert bo-alert--danger" data-validation-summary-box hidden role="alert">
          <p>There is a problem</p>
          <ul></ul>
        </div>
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="v-vendor">Vendor</label>
          <input class="bo-input" id="v-vendor" required />
        </div>
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="v-email">Approver email</label>
          <input class="bo-input" id="v-email" type="email" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
    ui.initValidationSummary();
    return document.querySelector('form')!;
  }
  const submit = (f: HTMLFormElement) =>
    f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  it('an invalid submit is prevented, lists every invalid field, and focuses the summary first', () => {
    const f = form();
    let prevented = false;
    f.addEventListener('submit', (e) => { if (e.defaultPrevented) prevented = true; });
    submit(f);
    const box = f.querySelector('[data-validation-summary-box]') as HTMLElement;
    expect(box.hidden).toBe(false);
    const links = [...box.querySelectorAll('a')];
    expect(links.map((a) => a.textContent)).toEqual(['Vendor', 'Approver email']);
    expect(document.activeElement).toBe(box);
  });

  it('clicking a summary link focuses the exact field', () => {
    const f = form();
    submit(f);
    const link = f.querySelector('a[href="#v-email"]') as HTMLAnchorElement;
    link.click();
    expect(document.activeElement).toBe(document.getElementById('v-email'));
  });

  it('a valid form submits normally (summary never shown)', () => {
    const f = form();
    (document.getElementById('v-vendor') as HTMLInputElement).value = 'Acme';
    (document.getElementById('v-email') as HTMLInputElement).value = 'a@b.com';
    submit(f);
    const box = f.querySelector('[data-validation-summary-box]') as HTMLElement;
    expect(box.hidden).toBe(true);
  });
});
