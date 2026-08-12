/**
 * Optional table behavior (~1 kB): wires select-all, keeps an O(1)
 * data-any-selected attribute on the container (so CSS needn't re-scan every
 * row via :has() on large grids), and maintains a live "n selected" count for
 * screen readers.
 *
 * Markup contract:
 *   .bo-data-table-container
 *     .bo-data-table__select-all      (header checkbox, optional)
 *     .bo-data-table__row-select     (row checkboxes)
 *     .bo-data-table__selection-count (live region target, optional —
 *                                       aria-live="polite" is added if absent)
 *
 * Event delegation on the container; call initDataTables() once. Swapped-in
 * rows are picked up automatically.
 */
const boundContainers = new WeakSet<Element>();

function update(container: Element): void {
  const rows = container.querySelectorAll<HTMLInputElement>(
    '.bo-data-table__row-select',
  );
  const checked = container.querySelectorAll<HTMLInputElement>(
    '.bo-data-table__row-select:checked',
  );
  (container as HTMLElement).dataset.anySelected =
    checked.length > 0 ? 'true' : 'false';

  const selectAll = container.querySelector<HTMLInputElement>(
    '.bo-data-table__select-all',
  );
  if (selectAll) {
    selectAll.checked = rows.length > 0 && checked.length === rows.length;
    selectAll.indeterminate =
      checked.length > 0 && checked.length < rows.length;
  }

  const count = container.querySelector<HTMLElement>(
    '.bo-data-table__selection-count',
  );
  if (count) {
    if (!count.hasAttribute('aria-live')) {
      count.setAttribute('aria-live', 'polite');
    }
    count.textContent = checked.length > 0 ? `${checked.length} selected` : '';
  }
}

/**
 * Re-derive selection state after content inside the container was replaced
 * (row/tbody swaps). Called automatically on htmx:afterSwap bubbling through
 * the container — that is an event-NAME string only, no HTMX dependency —
 * and exported for non-HTMX swap mechanisms.
 */
export function refreshDataTable(container: Element): void {
  update(container);
}

function bindContainer(container: Element): void {
  if (boundContainers.has(container)) return;
  boundContainers.add(container);
  container.addEventListener('htmx:afterSwap', () => update(container));
  container.addEventListener('change', (e) => {
    const target = e.target as HTMLElement;
    if (target.matches('.bo-data-table__select-all')) {
      const on = (target as HTMLInputElement).checked;
      container
        .querySelectorAll<HTMLInputElement>('.bo-data-table__row-select')
        .forEach((box) => {
          box.checked = on;
        });
    }
    if (
      target.matches(
        '.bo-data-table__select-all, .bo-data-table__row-select',
      )
    ) {
      update(container);
    }
  });
  update(container);
}

export function initDataTables(root: ParentNode = document): void {
  root
    .querySelectorAll('.bo-data-table-container')
    .forEach(bindContainer);
}
