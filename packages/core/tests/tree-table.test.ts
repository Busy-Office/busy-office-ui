import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initTreeTable', () => {
  function treeTable(): Record<string, HTMLTableRowElement> {
    html`
      <table data-tree-table>
        <tbody>
          <tr data-tree-level="1" id="a"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="Collapse Assembly A"></button>Assembly A</td></tr>
          <tr data-tree-level="2" id="a1"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="false" aria-label="Expand Sub-assembly A1"></button>Sub-assembly A1</td></tr>
          <tr data-tree-level="3" id="a1x" hidden><td><span class="bo-tree-table__spacer"></span>Part A1-x</td></tr>
          <tr data-tree-level="2" id="a2"><td><span class="bo-tree-table__spacer"></span>Part A2</td></tr>
          <tr data-tree-level="1" id="b"><td><span class="bo-tree-table__spacer"></span>Assembly B</td></tr>
        </tbody>
      </table>
    `;
    ui.initTreeTable();
    const rows: Record<string, HTMLTableRowElement> = {};
    for (const id of ['a', 'a1', 'a1x', 'a2', 'b']) rows[id] = document.getElementById(id) as HTMLTableRowElement;
    return rows;
  }

  function toggle(row: HTMLTableRowElement): void {
    row.querySelector<HTMLElement>('.bo-tree-table__toggle')!.click();
  }

  it('collapse hides ALL descendants and stops at the next sibling branch', () => {
    const r = treeTable();
    toggle(r.a); // collapse Assembly A
    expect(r.a.querySelector('.bo-tree-table__toggle')!.getAttribute('aria-expanded')).toBe('false');
    expect(r.a1.hidden).toBe(true);
    expect(r.a1x.hidden).toBe(true);
    expect(r.a2.hidden).toBe(true);
    expect(r.b.hidden).toBe(false); // sibling untouched
  });

  it('expand reveals direct children but preserves a nested collapsed branch', () => {
    const r = treeTable();
    toggle(r.a); // collapse all
    toggle(r.a); // expand again
    expect(r.a1.hidden).toBe(false);
    expect(r.a2.hidden).toBe(false);
    expect(r.a1x.hidden).toBe(true); // A1 is itself collapsed — grandchild stays hidden
  });

  it('expanding the nested branch reveals its own children', () => {
    const r = treeTable();
    toggle(r.a1);
    expect(r.a1x.hidden).toBe(false);
    toggle(r.a1);
    expect(r.a1x.hidden).toBe(true);
  });

  it('descendants span tbody boundaries (grill E2: per-tbody grouping is normal ERP shape)', () => {
    html`
      <table data-tree-table>
        <tbody>
          <tr data-tree-level="1" id="p1"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="Group A"></button>Group A</td></tr>
          <tr data-tree-level="2" id="c1"><td>child in tbody 1</td></tr>
        </tbody>
        <tbody>
          <tr data-tree-level="2" id="c2"><td>child in tbody 2</td></tr>
          <tr data-tree-level="1" id="p2"><td>sibling group</td></tr>
        </tbody>
      </table>
    `;
    ui.initTreeTable();
    document.querySelector<HTMLElement>('#p1 .bo-tree-table__toggle')!.click();
    expect((document.getElementById('c1') as HTMLTableRowElement).hidden).toBe(true);
    expect((document.getElementById('c2') as HTMLTableRowElement).hidden).toBe(true); // crossed the tbody boundary
    expect((document.getElementById('p2') as HTMLTableRowElement).hidden).toBe(false);
  });

  it('a toggle with no following deeper rows is INERT — the chevron never lies (grill E2 missing-level case)', () => {
    html`
      <table data-tree-table>
        <tbody>
          <tr data-tree-level="1" id="p"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="Parent"></button>Parent</td></tr>
          <tr id="orphan"><td>child that FORGOT data-tree-level (reads as level 1)</td></tr>
        </tbody>
      </table>
    `;
    ui.initTreeTable();
    const btn = document.querySelector<HTMLElement>('#p .bo-tree-table__toggle')!;
    btn.click();
    expect(btn.getAttribute('aria-expanded')).toBe('true'); // did NOT flip over nothing
    expect((document.getElementById('orphan') as HTMLTableRowElement).hidden).toBe(false);
  });

  it('skipped levels (1 → 3, no toggle between) still collapse and re-expand', () => {
    html`
      <table data-tree-table>
        <tbody>
          <tr data-tree-level="1" id="p"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="P"></button>P</td></tr>
          <tr data-tree-level="3" id="deep"><td>grand-child directly</td></tr>
        </tbody>
      </table>
    `;
    ui.initTreeTable();
    const btn = document.querySelector<HTMLElement>('#p .bo-tree-table__toggle')!;
    const deep = document.getElementById('deep') as HTMLTableRowElement;
    btn.click();
    expect(deep.hidden).toBe(true);
    btn.click();
    expect(deep.hidden).toBe(false);
  });

  it('a toggle outside any [data-tree-table] does nothing at all', () => {
    html`
      <table>
        <tbody>
          <tr data-tree-level="1"><td>
            <button class="bo-tree-table__toggle" type="button" aria-expanded="true" aria-label="X"></button>X</td></tr>
          <tr data-tree-level="2" id="c"><td>child</td></tr>
        </tbody>
      </table>
    `;
    ui.initTreeTable();
    const btn = document.querySelector<HTMLElement>('.bo-tree-table__toggle')!;
    btn.click();
    expect(btn.getAttribute('aria-expanded')).toBe('true'); // untouched
    expect((document.getElementById('c') as HTMLTableRowElement).hidden).toBe(false);
  });

  it('dispatches bo:tree-toggle with expanded state and level', () => {
    const r = treeTable();
    const seen: any[] = [];
    document.addEventListener('bo:tree-toggle', (e: any) => seen.push(e.detail), { once: true });
    toggle(r.a);
    expect(seen).toEqual([{ row: r.a, level: 1, expanded: false }]);
  });
});
