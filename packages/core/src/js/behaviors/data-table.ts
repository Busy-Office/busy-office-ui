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
 *
 * @serves data-table
 */
const boundContainers = new WeakSet<Element>();

function update(container: Element): void {
  const rows = container.querySelectorAll<HTMLInputElement>(
    '.bo-data-table__row-select',
  );
  const checked = container.querySelectorAll<HTMLInputElement>(
    '.bo-data-table__row-select:checked',
  );
  // A windowed table (roadmap 30.4b) tracks selection in a Set outside the
  // DOM — an evicted row's checkbox doesn't exist to be counted below, so
  // windowed-list.ts writes the true total here before eviction can make
  // the DOM count wrong. Absent, this is exactly the plain :checked count
  // it always was; every non-windowed table is unaffected.
  const override = (container as HTMLElement).dataset.selectedCountOverride;
  const selectedCount = override !== undefined ? Number(override) : checked.length;

  (container as HTMLElement).dataset.anySelected =
    selectedCount > 0 ? 'true' : 'false';

  const selectAll = container.querySelector<HTMLInputElement>(
    '.bo-data-table__select-all',
  );
  if (selectAll) {
    // Deliberately LOCAL even with an override present: "select all" means
    // all rendered rows, never a windowed table's true server-side total —
    // selecting everything across an unbounded dataset is a distinct,
    // harder problem this behavior does not attempt.
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
    count.textContent = selectedCount > 0 ? `${selectedCount} selected` : '';
  }
}

/**
 * Re-derive selection state after content inside the container was replaced
 * (row/tbody swaps). Called automatically on htmx:after:swap bubbling through
 * the container — that is an event-NAME string only, no HTMX dependency —
 * and exported for non-HTMX swap mechanisms.
 */
export function refreshDataTable(container: Element): void {
  update(container);
}

function bindContainer(container: Element): void {
  if (boundContainers.has(container)) return;
  boundContainers.add(container);
  container.addEventListener('htmx:after:swap', () => update(container));
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
