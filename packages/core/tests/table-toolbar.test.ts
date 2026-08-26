import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initTableToolbar', () => {
  function table(): HTMLTableElement {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <input type="checkbox" data-col-toggle="cc" checked />
          <button type="button" data-table-export data-table-export-format="pdf">Export</button>
        </div>
        <table class="bo-data-table">
          <thead><tr><th data-col="no">No.</th><th data-col="cc">Cost center</th></tr></thead>
          <tbody><tr><td data-col="no">INV-1</td><td data-col="cc">CC-4021</td></tr></tbody>
        </table>
      </div>
    `;
    ui.initTableToolbar();
    return document.querySelector('table')!;
  }

  it('unchecking a column-toggle checkbox hides every cell with the matching data-col', () => {
    const t = table();
    const checkbox = document.querySelector('[data-col-toggle="cc"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const cells = [...t.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => c.hidden)).toBe(true);
    const noCells = [...t.querySelectorAll('[data-col="no"]')] as HTMLElement[];
    expect(noCells.every((c) => !c.hidden)).toBe(true);
  });

  it('re-checking the box shows the column again', () => {
    const t = table();
    const checkbox = document.querySelector('[data-col-toggle="cc"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const cells = [...t.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => !c.hidden)).toBe(true);
  });

  it('clicking the export button dispatches bo:table-export with its configured format', () => {
    table();
    let detail: any = null;
    document.addEventListener('bo:table-export', (e: any) => { detail = e.detail; }, { once: true });
    (document.querySelector('[data-table-export]') as HTMLElement).click();
    expect(detail).toEqual({ format: 'pdf' });
  });

  it('export defaults to csv when no format is configured', () => {
    html`<button type="button" data-table-export>Export</button>`;
    ui.initTableToolbar();
    let detail: any = null;
    document.addEventListener('bo:table-export', (e: any) => { detail = e.detail; }, { once: true });
    (document.querySelector('[data-table-export]') as HTMLElement).click();
    expect(detail).toEqual({ format: 'csv' });
  });

  it('applies the initial checked state at init — a server-rendered unchecked box hides its column (ultrareview bug_013)', () => {
    html`
      <div class="bo-data-table-container">
        <input type="checkbox" data-col-toggle="cc" />
        <table class="bo-data-table">
          <thead><tr><th data-col="cc">Cost center</th></tr></thead>
          <tbody><tr><td data-col="cc">CC-4021</td></tr></tbody>
        </table>
      </div>
    `;
    ui.initTableToolbar();
    const cells = [...document.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => c.hidden)).toBe(true);
  });
});
