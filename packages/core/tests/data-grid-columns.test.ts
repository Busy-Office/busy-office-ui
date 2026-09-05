/**
 * initDataGrid composed with initTableToolbar's column visibility.
 *
 * /components/table-toolbar documents these as "the two opt-in behaviors that
 * sit on top of a data table", and nothing asserted what happens when they
 * meet. Measured in headless Chrome against the built page (roadmap 278.1):
 * hiding the column the cell cursor is parked in left the grid's ONE tabbable
 * cell `hidden`, so Tab skipped the grid entirely and the keyboard user had no
 * way back in.
 *
 * These drive the real toolbar behavior — a `change` on a [data-col-toggle]
 * box — rather than setting `cell.hidden` by hand, because the ordering
 * between the toolbar's document-level listener and the grid is the part that
 * was wrong.
 */
import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

/** Let the MutationObserver callback run. */
const settle = () => new Promise((r) => setTimeout(r, 0));

describe('initDataGrid + column visibility', () => {
  function composed(): HTMLTableElement {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <label><input type="checkbox" class="bo-checkbox" data-col-toggle="amount" checked /> Amount</label>
        </div>
        <table class="bo-data-table" data-grid-nav>
          <thead><tr>
            <th scope="col" data-col="no">Invoice</th>
            <th scope="col" data-col="amount">Amount</th>
            <th scope="col" data-col="status">Status</th>
          </tr></thead>
          <tbody>
            <tr><td data-col="no">INV-1</td><td data-col="amount">$4,208.00</td><td data-col="status">Open</td></tr>
            <tr><td data-col="no">INV-2</td><td data-col="amount">$18,940.50</td><td data-col="status">Paid</td></tr>
          </tbody>
        </table>
      </div>
    `;
    ui.initTableToolbar();
    ui.initDataGrid();
    return document.querySelector('.bo-data-table') as HTMLTableElement;
  }
  const key = (el: Element, k: string) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true }));
  const toggle = (checked: boolean) => {
    const box = document.querySelector('[data-col-toggle]') as HTMLInputElement;
    box.checked = checked;
    box.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const stops = (g: HTMLTableElement) =>
    Array.from(g.querySelectorAll<HTMLElement>('td[tabindex="0"], th[tabindex="0"]'));

  it('hiding the column the cursor is parked in hands the tab stop to a visible cell', async () => {
    const g = composed();
    // Park the cursor the way a user does — the roving model clears the seed.
    const seed = g.querySelector('th') as HTMLElement;
    seed.focus();
    key(seed, 'ArrowDown');
    key(document.activeElement as Element, 'ArrowRight');
    const amountCell = g.querySelectorAll('tr')[1].children[1] as HTMLElement;
    expect(document.activeElement).toBe(amountCell);
    expect(stops(g)).toEqual([amountCell]);

    toggle(false);
    await settle();

    expect(amountCell.hidden).toBe(true);
    // The grid still has exactly one tab stop, and it is reachable.
    expect(stops(g).length).toBe(1);
    expect(stops(g)[0].hidden).toBe(false);
  });

  it('the cell cursor skips a hidden column instead of stranding on it', async () => {
    const g = composed();
    toggle(false);
    await settle();

    const first = g.querySelectorAll('tr')[1].children[0] as HTMLElement;
    first.tabIndex = 0;
    first.focus();
    key(first, 'ArrowRight');

    // Amount is hidden, so ArrowRight lands on Status, not on the hidden cell.
    expect(document.activeElement).toBe(g.querySelectorAll('tr')[1].children[2]);
    expect(stops(g).length).toBe(1);
    expect(stops(g)[0].hidden).toBe(false);
  });

  it('End goes to the last VISIBLE cell in the row', async () => {
    const g = composed();
    toggle(false);
    await settle();
    // hide the trailing column too, so the row's last cell is hidden
    const statusCells = g.querySelectorAll<HTMLElement>('[data-col="status"]');
    statusCells.forEach((c) => (c.hidden = true));
    await settle();

    const first = g.querySelectorAll('tr')[1].children[0] as HTMLElement;
    first.tabIndex = 0;
    first.focus();
    key(first, 'End');
    expect(document.activeElement).toBe(first);
    expect(stops(g)[0].hidden).toBe(false);
  });

  it('re-showing the column makes it navigable again', async () => {
    const g = composed();
    toggle(false);
    await settle();
    toggle(true);
    await settle();

    const first = g.querySelectorAll('tr')[1].children[0] as HTMLElement;
    first.tabIndex = 0;
    first.focus();
    key(first, 'ArrowRight');
    expect(document.activeElement).toBe(g.querySelectorAll('tr')[1].children[1]);
  });

  it('a server-rendered hidden column never receives the initial tab stop', () => {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <label><input type="checkbox" class="bo-checkbox" data-col-toggle="no" /> Invoice</label>
        </div>
        <table class="bo-data-table" data-grid-nav>
          <thead><tr>
            <th scope="col" data-col="no">Invoice</th>
            <th scope="col" data-col="amount">Amount</th>
          </tr></thead>
          <tbody><tr><td data-col="no">INV-1</td><td data-col="amount">$4,208.00</td></tr></tbody>
        </table>
      </div>
    `;
    // The toolbar reconciles the unchecked box on init, before the grid binds.
    ui.initTableToolbar();
    ui.initDataGrid();
    const g = document.querySelector('.bo-data-table') as HTMLTableElement;
    const tabbable = stops(g);
    expect(tabbable.length).toBe(1);
    expect(tabbable[0].hidden).toBe(false);
    expect(tabbable[0].dataset.col).toBe('amount');
  });
});
