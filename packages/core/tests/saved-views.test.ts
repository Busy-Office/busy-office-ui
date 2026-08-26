import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initSavedViews', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/invoices?status=pending&q=acme');
  });

  it('populates .bo-filter-bar fields from the current querystring', () => {
    html`
      <form class="bo-filter-bar">
        <input name="q" value="" />
        <select name="status"><option value="">All</option><option value="pending">Pending</option></select>
      </form>
    `;
    ui.initSavedViews();
    const form = document.querySelector('form')!;
    expect((form.elements.namedItem('q') as HTMLInputElement).value).toBe('acme');
    expect((form.elements.namedItem('status') as HTMLSelectElement).value).toBe('pending');
  });

  it('marks the saved-view link matching the current URL aria-current, clears the others', () => {
    html`
      <nav data-saved-views>
        <a href="/invoices?status=pending&q=acme" aria-current="page">stale-but-matching</a>
        <a href="/invoices?status=overdue">Overdue</a>
      </nav>
    `;
    const [match, other] = document.querySelectorAll('a');
    other.setAttribute('aria-current', 'page'); // wrongly pre-set, should be cleared
    ui.initSavedViews();
    expect(match.getAttribute('aria-current')).toBe('page');
    expect(other.hasAttribute('aria-current')).toBe(false);
  });

  it('checks a checkbox filter via .checked, not .value (ultrareview bug_012)', () => {
    window.history.pushState({}, '', '/invoices?published=true&status=pending');
    html`
      <form class="bo-filter-bar">
        <input type="checkbox" name="published" value="true" />
        <input type="checkbox" name="archived" value="true" checked />
        <select name="status"><option value="">All</option><option value="pending">Pending</option></select>
      </form>
    `;
    ui.initSavedViews();
    const form = document.querySelector('form')!;
    expect((form.elements.namedItem('published') as HTMLInputElement).checked).toBe(true);
    // 'archived' isn't in the URL — params.has() is false, left untouched.
    expect((form.elements.namedItem('archived') as HTMLInputElement).checked).toBe(true);
    expect((form.elements.namedItem('status') as HTMLSelectElement).value).toBe('pending');
  });
});
