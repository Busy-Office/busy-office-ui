/**
 * Expand/collapse for hierarchical table rows — document-level
 * delegation, call initTreeTable() once. A PLAIN table + disclosure
 * buttons, deliberately NOT role="treegrid" (ADR:
 * .roundtable/adr-tree-table-2026-08-16.md — native table browse mode
 * beats the weakest-supported APG composite for read-mostly hierarchy).
 *
 * Markup contract:
 *   <table class="bo-data-table bo-tree-table" data-tree-table>
 *     <tbody>
 *       <tr data-tree-level="1">
 *         <td><button class="bo-tree-table__toggle" type="button"
 *              aria-expanded="true" aria-label="Collapse Assembly A"></button> Assembly A</td>…
 *       <tr data-tree-level="2"> … child …
 *       <tr data-tree-level="1" hidden? …
 *
 * Hierarchy is document order: a row's descendants are the following
 * rows with a HIGHER data-tree-level, ending at the first row with the
 * same or lower level. Collapse hides all descendants; expand reveals
 * direct children, and deeper rows only where every intermediate parent
 * is itself expanded (nested collapsed state is preserved). Rendering a
 * branch pre-collapsed: aria-expanded="false" on its toggle + `hidden`
 * on every descendant row, server-side.
 *
 * Two-channel: indent + chevron (visible) / aria-expanded + rows
 * genuinely `hidden` (programmatic). Totals note: data-sum-of keeps
 * counting collapsed rows — collapse is a view state, not a filter.
 */
let installed = false;

function level(row: HTMLTableRowElement): number {
  return Number(row.dataset.treeLevel) || 1;
}

function descendants(row: HTMLTableRowElement): HTMLTableRowElement[] {
  const out: HTMLTableRowElement[] = [];
  const base = level(row);
  let next = row.nextElementSibling;
  while (next instanceof HTMLTableRowElement && level(next) > base) {
    out.push(next);
    next = next.nextElementSibling;
  }
  return out;
}

function toggleOf(row: HTMLTableRowElement): HTMLButtonElement | null {
  return row.querySelector<HTMLButtonElement>('.bo-tree-table__toggle');
}

export function initTreeTable(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest<HTMLButtonElement>('.bo-tree-table__toggle');
    if (!btn) return;
    const row = btn.closest('tr');
    const table = btn.closest('[data-tree-table]');
    if (!(row instanceof HTMLTableRowElement) || !table) return;

    const expanding = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(expanding));

    if (!expanding) {
      for (const d of descendants(row)) d.hidden = true;
      return;
    }
    // Expand: reveal each descendant only when every intermediate parent
    // between it and this row is itself expanded — a collapsed child
    // branch stays collapsed.
    const base = level(row);
    let hideBelow = Infinity; // levels deeper than this stay hidden
    for (const d of descendants(row)) {
      const l = level(d);
      if (l > hideBelow) continue; // inside a collapsed sub-branch
      hideBelow = Infinity;
      d.hidden = false;
      const t = toggleOf(d);
      if (t && t.getAttribute('aria-expanded') !== 'true') hideBelow = l;
      if (l === base) break; // safety; descendants() already bounds this
    }
  });
}
