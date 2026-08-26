import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initDataTables', () => {
  function table(): HTMLElement {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <span class="bo-data-table__selection-count"></span>
          <input class="bo-input" type="search" aria-label="Filter" />
        </div>
        <table>
          <thead><tr><th>
            <input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all" />
          </th></tr></thead>
          <tbody>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r1" /></td></tr>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r2" /></td></tr>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r3" /></td></tr>
          </tbody>
        </table>
      </div>
    `;
    const container = document.querySelector('.bo-data-table-container')!;
    ui.initDataTables();
    return container as HTMLElement;
  }

  const rows = (c: Element) =>
    Array.from(c.querySelectorAll<HTMLInputElement>('.bo-data-table__row-select'));
  const change = (el: Element) =>
    el.dispatchEvent(new Event('change', { bubbles: true }));

  it('select-all checks all rows, sets count, any-selected, indeterminate', () => {
    const c = table();
    const all = c.querySelector<HTMLInputElement>('.bo-data-table__select-all')!;
    const count = c.querySelector('.bo-data-table__selection-count')!;

    all.checked = true;
    change(all);
    expect(rows(c).every((r) => r.checked)).toBe(true);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    expect(count.textContent).toBe('3 selected');
    expect(count.getAttribute('aria-live')).toBe('polite');

    rows(c)[0].checked = false;
    change(rows(c)[0]);
    expect(all.indeterminate).toBe(true);
    expect(count.textContent).toBe('2 selected');
  });

  it('ignores unrelated change events (toolbar inputs)', () => {
    const c = table();
    rows(c)[0].checked = true;
    change(rows(c)[0]);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    const search = c.querySelector('input[type="search"]')!;
    change(search);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    expect(rows(c)[0].checked).toBe(true);
  });

  it('re-derives after a row swap via htmx:afterSwap and refreshDataTable (grill finding N1)', () => {
    const c = table();
    rows(c).forEach((r) => (r.checked = true));
    change(rows(c)[0]);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');

    // Simulate an HTMX tbody swap to fresh, unchecked rows.
    c.querySelector('tbody')!.innerHTML =
      '<tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="n1" /></td></tr>';
    c.dispatchEvent(new Event('htmx:afterSwap', { bubbles: true }));
    expect((c as HTMLElement).dataset.anySelected).toBe('false');
    expect(c.querySelector('.bo-data-table__selection-count')!.textContent).toBe('');

    // Manual path for non-HTMX swappers.
    c.querySelector<HTMLInputElement>('.bo-data-table__row-select')!.checked = true;
    ui.refreshDataTable(c);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
  });
});
