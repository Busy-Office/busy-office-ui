import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initLoadMore', () => {
  it('clicking the button dispatches bo:table-load-more', () => {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__footer">
          <button class="bo-btn" type="button" data-table-load-more>Load more</button>
        </div>
      </div>
    `;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    const btn = document.querySelector('[data-table-load-more]') as HTMLButtonElement;
    btn.click();
    expect(fired).toBe(1);
  });

  it('a disabled button (fetch in flight) does not fire', () => {
    html`<button type="button" data-table-load-more disabled>Load more</button>`;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    (document.querySelector('[data-table-load-more]') as HTMLElement).click();
    expect(fired).toBe(0);
  });

  it('data-load-more-auto does not throw where IntersectionObserver is unavailable (jsdom)', () => {
    html`<button type="button" data-table-load-more data-load-more-auto>Load more</button>`;
    expect(() => ui.initLoadMore()).not.toThrow();
  });
});
