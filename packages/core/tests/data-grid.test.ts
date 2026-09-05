import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initDataGrid', () => {
  function grid(): HTMLTableElement {
    html`
      <table class="bo-data-table" data-grid-nav>
        <thead><tr>
          <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all" /></th>
          <th scope="col">Invoice</th>
        </tr></thead>
        <tbody>
          <tr><td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="r1" /></td><td>INV-1</td></tr>
          <tr><td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="r2" /></td><td>INV-2</td></tr>
        </tbody>
      </table>
    `;
    ui.initDataGrid();
    return document.querySelector('.bo-data-table') as HTMLTableElement;
  }
  const key = (el: Element, k: string, mods: Partial<KeyboardEventInit> = {}) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...mods }));

  it('sets role=grid, aria-multiselectable, and 1-based rowindex/colindex', () => {
    const g = grid();
    expect(g.getAttribute('role')).toBe('grid');
    expect(g.getAttribute('aria-multiselectable')).toBe('true');
    const rows = g.querySelectorAll('tr');
    expect(rows[0].getAttribute('aria-rowindex')).toBe('1');
    expect(rows[2].getAttribute('aria-rowindex')).toBe('3');
    expect(rows[1].children[1].getAttribute('aria-colindex')).toBe('2');
  });

  it('exactly one cell is tabbable at init; interactive descendants are pulled out of Tab order', () => {
    const g = grid();
    const tabbable = g.querySelectorAll('td[tabindex="0"], th[tabindex="0"]');
    expect(tabbable.length).toBe(1);
    expect(tabbable[0]).toBe(g.querySelector('th'));
    g.querySelectorAll('input').forEach((i) => expect(i.tabIndex).toBe(-1));
  });

  it('ArrowRight/ArrowDown move the cell cursor (clamped, no wrap)', () => {
    const g = grid();
    const first = g.querySelector('th') as HTMLElement;
    first.focus();
    key(first, 'ArrowRight');
    const second = g.querySelectorAll('th')[1];
    expect(document.activeElement).toBe(second);
    expect(second.tabIndex).toBe(0);
    expect(first.tabIndex).toBe(-1);
    key(second, 'ArrowDown');
    const belowSecond = g.querySelectorAll('tr')[1].children[1];
    expect(document.activeElement).toBe(belowSecond);
    // Right-edge clamp: no wrap.
    key(belowSecond, 'ArrowRight');
    expect(document.activeElement).toBe(belowSecond);
  });

  it('Enter focuses the cell checkbox; Escape returns focus to the cell', () => {
    const g = grid();
    const cell = g.querySelectorAll('tr')[1].children[0] as HTMLElement;
    cell.tabIndex = 0;
    cell.focus();
    key(cell, 'Enter');
    const box = cell.querySelector('input') as HTMLInputElement;
    expect(document.activeElement).toBe(box);
    key(box, 'Escape');
    expect(document.activeElement).toBe(cell);
  });

  // The @keymap block publishes these four into keymap.json and from there
  // onto /concepts/js-behaviors. Nothing asserted them until roadmap 278.1.
  it('Home/End jump to the row edges; with Ctrl they jump to the grid edges', () => {
    const g = grid();
    const rows = g.querySelectorAll('tr');
    const mid = rows[1].children[0] as HTMLElement;
    mid.tabIndex = 0;
    mid.focus();
    key(mid, 'End');
    expect(document.activeElement).toBe(rows[1].children[1]);
    key(rows[1].children[1], 'Home');
    expect(document.activeElement).toBe(rows[1].children[0]);
    key(rows[1].children[0], 'End', { ctrlKey: true });
    expect(document.activeElement).toBe(rows[2].children[1]);
    key(rows[2].children[1], 'Home', { ctrlKey: true });
    expect(document.activeElement).toBe(rows[0].children[0]);
  });

  it('checking a row checkbox sets aria-selected on its row', () => {
    const g = grid();
    const row = g.querySelectorAll('tr')[1];
    const box = row.querySelector('input') as HTMLInputElement;
    expect(row.getAttribute('aria-selected')).toBe('false');
    box.checked = true;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    expect(row.getAttribute('aria-selected')).toBe('true');
  });
});
