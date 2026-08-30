/**
 * Opt-in ARIA grid pattern for .bo-data-table (WAI-ARIA APG "Grid", the
 * interactive-widgets variant). NOT part of initDataTables() — selection/
 * sort keep working exactly as before whether or not this is used; this
 * behavior only ADDS two-axis keyboard navigation on top.
 *
 * Markup contract: <table class="bo-data-table" data-grid-nav>. On init:
 *   - role="grid" on the table (td/th get IMPLICIT gridcell/columnheader
 *     roles from being inside a role=grid table per the HTML-AAM mapping —
 *     no need to set them by hand).
 *   - aria-multiselectable="true" if the table has row-select checkboxes.
 *   - aria-rowindex / aria-colindex on every row/cell (1-based, DOM order —
 *     this table is never virtualized, so these are supplementary AT
 *     robustness, not load-bearing the way they are for a virtualized grid).
 *   - Two-level roving tabindex: ONE cell is tabbable at a time (Tab enters/
 *     exits the whole grid in one stop); focusable descendants (checkbox,
 *     button, input, link) are pulled out of the Tab sequence at init and
 *     re-entered only via Enter (matches the APG "Data Grid" example, not
 *     the simpler read-only grid — cells here host real interactive
 *     widgets, so a two-level model is the correct one, not the read-only
 *     single-level model).
 *
 * Keys on a cell: Arrow keys move one cell (clamped, no wrap — per APG,
 * "focus does not move" at an edge); Home/End = row start/end; Ctrl+Home/
 * Ctrl+End = grid start/end; Enter focuses the cell's single interactive
 * descendant, if any; Escape (from inside that descendant) returns focus to
 * the cell.
 */
const boundGrids = new WeakSet<Element>();

// :not(:disabled) matches focus-trap's FOCUSABLE — without it, Enter
// focused a disabled control and silently went nowhere (2026-08-21
// sweep). [tabindex] stays unfiltered ON PURPOSE: Enter's programmatic
// focus of a tabindex="-1" descendant is the two-level grid pattern.
const FOCUSABLE =
  'input:not(:disabled), button:not(:disabled), select:not(:disabled), textarea:not(:disabled), a[href], [tabindex]';

function cellMatrix(table: HTMLTableElement): HTMLElement[][] {
  return Array.from(table.querySelectorAll('tr')).map((tr) =>
    Array.from(tr.children) as HTMLElement[],
  );
}

function cellPosition(
  matrix: HTMLElement[][],
  cell: HTMLElement,
): [number, number] | null {
  for (let r = 0; r < matrix.length; r++) {
    const c = matrix[r].indexOf(cell);
    if (c !== -1) return [r, c];
  }
  return null;
}

function focusCell(table: HTMLTableElement, cell: HTMLElement): void {
  table.querySelectorAll<HTMLElement>('td[tabindex], th[tabindex]').forEach((c) => {
    c.tabIndex = -1;
  });
  cell.tabIndex = 0;
  cell.focus();
}

function reindex(table: HTMLTableElement): void {
  const matrix = cellMatrix(table);
  matrix.forEach((row, r) => {
    const tr = row[0]?.parentElement;
    if (tr) tr.setAttribute('aria-rowindex', String(r + 1));
    row.forEach((cell, c) => {
      cell.setAttribute('aria-colindex', String(c + 1));
      if (!cell.hasAttribute('tabindex')) cell.tabIndex = -1;
      cell
        .querySelectorAll<HTMLElement>(FOCUSABLE)
        .forEach((w) => (w.tabIndex = -1));
    });
  });
  // Exactly one tab stop for the whole grid.
  if (!table.querySelector('td[tabindex="0"], th[tabindex="0"]')) {
    const first = matrix[0]?.[0];
    if (first) first.tabIndex = 0;
  }
}

function syncSelected(table: HTMLTableElement): void {
  table.querySelectorAll<HTMLInputElement>('.bo-data-table__row-select').forEach((box) => {
    const tr = box.closest('tr');
    if (tr) tr.setAttribute('aria-selected', String(box.checked));
  });
}

/** Re-derive rowindex/colindex/tabindex/aria-selected after a swap (mirrors refreshDataTable). */
export function refreshDataGrid(table: Element): void {
  if (!(table instanceof HTMLTableElement)) return;
  reindex(table);
  syncSelected(table);
}

function bindGrid(table: HTMLTableElement): void {
  if (boundGrids.has(table)) return;
  boundGrids.add(table);

  table.setAttribute('role', 'grid');
  if (table.querySelector('.bo-data-table__row-select')) {
    table.setAttribute('aria-multiselectable', 'true');
  }
  reindex(table);
  syncSelected(table);

  table.addEventListener('change', (e) => {
    if ((e.target as Element).matches('.bo-data-table__row-select')) syncSelected(table);
  });
  table
    .closest('.bo-data-table-container')
    ?.addEventListener('htmx:after:swap', () => refreshDataGrid(table));

  table.addEventListener('keydown', (e) => {
    const cell = (e.target as Element | null)?.closest<HTMLElement>('td, th');
    if (!cell || !table.contains(cell)) return;

    // Enter: hand focus to the cell's one interactive widget, if any.
    if (e.key === 'Enter' && cell === e.target) {
      const widget = cell.querySelector<HTMLElement>(FOCUSABLE);
      if (widget) {
        e.preventDefault();
        widget.focus();
      }
      return;
    }
    // Escape: hand focus back from a widget to its parent cell.
    if (e.key === 'Escape' && cell !== e.target) {
      e.preventDefault();
      focusCell(table, cell);
      return;
    }
    // Everything below moves the cell cursor — only from the cell itself,
    // not while a descendant widget is focused (it needs its own arrow
    // keys, e.g. a select or a text cursor).
    if (cell !== e.target) return;

    const matrix = cellMatrix(table);
    const pos = cellPosition(matrix, cell);
    if (!pos) return;
    const [r, c] = pos;
    const jump = e.ctrlKey || e.metaKey;
    let next: HTMLElement | undefined;
    if (e.key === 'ArrowRight') next = matrix[r][Math.min(c + 1, matrix[r].length - 1)];
    else if (e.key === 'ArrowLeft') next = matrix[r][Math.max(c - 1, 0)];
    else if (e.key === 'ArrowDown') next = matrix[Math.min(r + 1, matrix.length - 1)]?.[c];
    else if (e.key === 'ArrowUp') next = matrix[Math.max(r - 1, 0)]?.[c];
    else if (e.key === 'Home') next = jump ? matrix[0][0] : matrix[r][0];
    else if (e.key === 'End') {
      const targetRow = jump ? matrix[matrix.length - 1] : matrix[r];
      next = targetRow[targetRow.length - 1];
    }
    if (next && next !== cell) {
      e.preventDefault();
      focusCell(table, next);
    }
  });
}

/**
 * @keymap initDataGrid
 * @key ArrowRight / ArrowLeft / ArrowDown / ArrowUp — move the cell cursor; clamps at the grid edges
 * @key Home / End — jump to the first/last cell in the row; with Ctrl/Cmd, the first/last cell in the grid
 * @key Enter — focus the cell's one interactive widget, if it has one
 * @key Escape — return focus from a widget to its parent cell
 */
export function initDataGrid(root: ParentNode = document): void {
  root.querySelectorAll<HTMLTableElement>('.bo-data-table[data-grid-nav]').forEach(bindGrid);
}
