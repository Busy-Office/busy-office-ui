/**
 * Multiple frozen columns (roadmap 72.1) — opt-in via [data-sticky-cols],
 * "2" | "3" only. Freezing a SINGLE column needs no JS at all (its offset
 * is always 0) — use .bo-data-table--sticky-col in data-table.css for that
 * case; data-sticky-cols="1" is deliberately not a thing (Standardize sweep,
 * 2026-08-20 — it would just be a second way to do what --sticky-col already
 * does). This behavior exists only because 2+ columns need each preceding
 * column's actual rendered width, and table-layout is auto by default so
 * nothing knows that width in advance.
 *
 * Markup contract:
 *   <table class="bo-data-table" data-sticky-cols="2">
 *     <thead><tr><th>ID</th><th>Name</th><th>Amount</th></tr></thead>
 *     ...
 *   </table>
 * Measures the header row's first two cells and writes --bo-sticky-w-1 /
 * --bo-sticky-w-2 (px) on the <table> — the CSS reads them via calc() to
 * position column 2 (and 3) after however wide column 1 (and 2) actually
 * rendered. A ResizeObserver on the table re-measures on any width change
 * (container-query breakpoint, column-visibility toggle, content change)
 * so the offsets never go stale — no re-call convention needed, unlike
 * the toolbar/data-table behaviors that only react to explicit DOM swaps.
 *
 * @serves data-table
 */
const observed = new WeakSet<Element>();

function measure(table: HTMLTableElement): void {
  const headerRow = table.querySelector('thead tr');
  if (!headerRow) return;
  const cells = headerRow.children;
  const w1 = (cells[0] as HTMLElement | undefined)?.offsetWidth ?? 0;
  const w2 = (cells[1] as HTMLElement | undefined)?.offsetWidth ?? 0;
  table.style.setProperty('--bo-sticky-w-1', `${w1}px`);
  table.style.setProperty('--bo-sticky-w-2', `${w2}px`);
}

export function initStickyCols(): void {
  const tables = document.querySelectorAll<HTMLTableElement>('[data-sticky-cols]');
  tables.forEach((table) => {
    measure(table);
    if (observed.has(table)) return;
    observed.add(table);
    const ro = new ResizeObserver(() => measure(table));
    ro.observe(table);
  });
}
