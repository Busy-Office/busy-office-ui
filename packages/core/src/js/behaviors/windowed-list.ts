/**
 * Windowed list: server-chunked rows with client-side memory release
 * (roadmap 30.4b) — for SCANNING a large list, not searching one.
 * DESIGN.md's row-virtualiser refusal still applies in full to search
 * workflows (filter server-side instead); this is the scanning case
 * 30.4a's own decision table argues windowing legitimately serves.
 *
 * Markup contract:
 *   <table class="bo-data-table" data-windowed
 *       data-table-total-rows="50000" data-window-chunks="3">
 *     <thead>…</thead>
 *     <tbody data-chunk-id="c1" data-chunk-offset="0">
 *       <tr data-row-id="R-1">…</tr>  <!-- any number of rows -->
 *     </tbody>
 *     <tbody data-chunk-id="c2" data-chunk-offset="50">…</tbody>
 *   </table>
 *   <div class="bo-data-table__footer">
 *     <button class="bo-btn bo-btn--secondary" type="button"
 *         data-table-load-more data-load-more-auto>Load more</button>
 *   </div>
 *
 * `data-window-chunks` (default 3) is how many chunks stay resident around
 * the viewport before the far ones evict to a height-matched spacer —
 * computed from `--bo-density-row-height`, never measured, so eviction
 * never forces a layout read on the operation this behavior exists to
 * make cheap. `data-table-total-rows` sets `aria-rowcount` once; every
 * rendered row gets `aria-rowindex` computed from its chunk's
 * `data-chunk-offset`, not DOM position — this is why `data-grid-nav`
 * (whose own `aria-rowindex` IS DOM-position-derived) does not compose
 * with this behavior in v1; use one table for one job.
 *
 * Composes with, does not replace, `initDataTables()` — call both.
 * Selection survives eviction: a windowed table's row-select checkboxes
 * carry NO name/value (unlike a plain data table) — a checked box's
 * `data-row-id` (read from the nearest ancestor carrying it) is tracked
 * in a Set kept outside the DOM, mirrored into hidden inputs
 * (`name="id"`) inside the nearest `<form>` so a submit includes every
 * selected id, rendered or evicted. The Set also drives
 * `data-table.ts`'s selected count via `data-selected-count-override`,
 * so the bulk-actions bar and the announced "N selected" count both stay
 * correct. The select-all checkbox's own checked/indeterminate state
 * stays LOCAL on purpose — it means "all rendered rows", never "all of
 * an unbounded server dataset", which is a distinct, harder problem this
 * behavior does not attempt.
 *
 * Never owns fetching: eviction and spacer math are this behavior's own
 * job, but re-fetching on approach is the consumer's, via the SAME
 * bo:table-load-more event load-more.ts already fires — now carrying an
 * optional detail payload ({ offset, chunkId, size }) so a
 * windowing-aware consumer knows which chunk to re-request, while a
 * plain load-more consumer that ignores detail keeps working unchanged.
 *
 * Named costs, not discovered by an adopter: browser find-in-page cannot
 * find an evicted (spacer) row, and printing gets only what is currently
 * loaded — both are the argument for filtering server-side first, which
 * stays the recommended default even for scanning.
 */
import { refreshDataTable } from './data-table.js';

const DEFAULT_RESIDENT_CHUNKS = 3;
const ROOT_MARGIN = '150% 0px 150% 0px';

const selections = new WeakMap<HTMLTableElement, Set<string>>();
const observers = new WeakMap<HTMLTableElement, IntersectionObserver>();
const boundTables = new WeakSet<HTMLTableElement>();

function densityRowHeightPx(table: HTMLTableElement): number {
  const raw = getComputedStyle(table)
    .getPropertyValue('--bo-density-row-height')
    .trim();
  const px = parseFloat(raw);
  return Number.isFinite(px) ? px : 40; // comfortable's own value, if the token can't resolve
}

function columnCount(table: HTMLTableElement): number {
  return table.tHead?.rows[0]?.cells.length || table.rows[0]?.cells.length || 1;
}

function selectionSet(table: HTMLTableElement): Set<string> {
  let set = selections.get(table);
  if (!set) {
    set = new Set();
    selections.set(table, set);
  }
  return set;
}

function hiddenInputsHost(table: HTMLTableElement): HTMLElement {
  const form = table.closest('form');
  const scope: ParentNode = form ?? table.ownerDocument;
  let host = scope.querySelector<HTMLElement>('[data-windowed-selection-host]');
  if (!host) {
    host = document.createElement('div');
    host.hidden = true;
    host.setAttribute('data-windowed-selection-host', '');
    if (form) form.appendChild(host);
    else table.after(host);
  }
  return host;
}

function syncHiddenInputs(table: HTMLTableElement): void {
  const host = hiddenInputsHost(table);
  host.replaceChildren(
    ...[...selectionSet(table)].map((id) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'id';
      input.value = id;
      return input;
    }),
  );
}

function updateSelectedCountOverride(table: HTMLTableElement): void {
  const container = table.closest<HTMLElement>('.bo-data-table-container');
  if (!container) return;
  container.dataset.selectedCountOverride = String(selectionSet(table).size);
  refreshDataTable(container);
}

function applySavedSelection(tbody: HTMLElement, table: HTMLTableElement): void {
  const set = selectionSet(table);
  if (set.size === 0) return;
  tbody.querySelectorAll<HTMLInputElement>('.bo-data-table__row-select').forEach((box) => {
    const id = box.closest<HTMLElement>('[data-row-id]')?.dataset.rowId;
    if (id && set.has(id)) box.checked = true;
  });
}

function reindexChunk(tbody: HTMLTableSectionElement, table: HTMLTableElement): void {
  const offset = Number(tbody.dataset.chunkOffset ?? 0);
  const headerRows = table.tHead ? 1 : 0;
  Array.from(tbody.rows).forEach((tr, i) => {
    tr.setAttribute('aria-rowindex', String(offset + i + headerRows + 1));
  });
}

function makeSpacer(tbody: HTMLTableSectionElement, table: HTMLTableElement): HTMLTableSectionElement {
  const rowCount = tbody.rows.length;
  const height = rowCount * densityRowHeightPx(table);
  const spacer = document.createElement('tbody');
  spacer.dataset.chunkId = tbody.dataset.chunkId ?? '';
  spacer.dataset.chunkOffset = tbody.dataset.chunkOffset ?? '0';
  spacer.dataset.chunkSize = String(rowCount);
  spacer.dataset.evicted = 'true';
  const tr = document.createElement('tr');
  tr.className = 'bo-data-table__spacer';
  tr.style.blockSize = `${height}px`;
  const td = document.createElement('td');
  td.colSpan = columnCount(table);
  tr.appendChild(td);
  spacer.appendChild(tr);
  return spacer;
}

function evict(tbody: HTMLTableSectionElement, table: HTMLTableElement, observer: IntersectionObserver): void {
  if (tbody.dataset.evicted === 'true') return;
  observer.unobserve(tbody);
  const spacer = makeSpacer(tbody, table);
  tbody.replaceWith(spacer);
  observer.observe(spacer);
}

/**
 * @event bo:table-load-more
 * @target the `[data-table-load-more]` button (bubbles), or a windowed
 *   list's evicted spacer `<tbody>` when no such button exists
 * @when the button is clicked or scrolls into view (IntersectionObserver);
 *   or a windowed table's evicted chunk scrolls back near the viewport
 * @detail offset {number} the chunk's start row, 0-based — present only
 *   when fired by windowed-list.ts re-requesting an evicted chunk
 * @detail chunkId {string} the evicted chunk's `data-chunk-id` — present
 *   only when fired by windowed-list.ts
 * @detail size {number} rows the evicted chunk held — present only when
 *   fired by windowed-list.ts. A plain load-more consumer that ignores
 *   `detail` keeps working unchanged: it is `null` for an ordinary
 *   forward "load more" fire, exactly as before this behavior existed.
 */
function requestReload(spacer: HTMLTableSectionElement, table: HTMLTableElement): void {
  const btn = table
    .closest('.bo-data-table-container')
    ?.querySelector<HTMLElement>('[data-table-load-more]');
  const target = btn ?? spacer;
  target.dispatchEvent(
    new CustomEvent('bo:table-load-more', {
      bubbles: true,
      detail: {
        offset: Number(spacer.dataset.chunkOffset ?? 0),
        chunkId: spacer.dataset.chunkId ?? '',
        size: Number(spacer.dataset.chunkSize ?? 0),
      },
    }),
  );
}

function bindTable(table: HTMLTableElement): void {
  if (boundTables.has(table)) return;
  boundTables.add(table);

  const total = table.dataset.tableTotalRows;
  if (total) table.setAttribute('aria-rowcount', total);

  table
    .querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]')
    .forEach((tbody) => reindexChunk(tbody, table));

  table.addEventListener('change', (e) => {
    const box = (e.target as Element | null)?.closest<HTMLInputElement>(
      '.bo-data-table__row-select',
    );
    if (!box) return;
    const id = box.closest<HTMLElement>('[data-row-id]')?.dataset.rowId;
    if (!id) return;
    const set = selectionSet(table);
    if (box.checked) set.add(id);
    else set.delete(id);
    syncHiddenInputs(table);
    updateSelectedCountOverride(table);
  });

  table.closest('.bo-data-table-container')?.addEventListener('htmx:afterSwap', (e) => {
    const swapped = (e.target as Element | null)?.closest<HTMLTableSectionElement>(
      'tbody[data-chunk-offset]',
    );
    if (!swapped || swapped.closest('table') !== table) return;
    swapped.dataset.evicted = 'false';
    reindexChunk(swapped, table);
    applySavedSelection(swapped, table);
    const observer = observers.get(table);
    observer?.unobserve(swapped); // no-op if it wasn't already observed
    observer?.observe(swapped);
  });

  // No-op floor: without IntersectionObserver every chunk simply stays
  // resident forever — correct, just not memory-releasing.
  if (typeof IntersectionObserver === 'undefined') return;

  const resident = Number(table.dataset.windowChunks) || DEFAULT_RESIDENT_CHUNKS;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const tbody = entry.target as HTMLTableSectionElement;
        if (entry.isIntersecting) {
          if (tbody.dataset.evicted === 'true') requestReload(tbody, table);
          return;
        }
        if (tbody.dataset.evicted === 'true') return;
        const residentCount = Array.from(
          table.querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]'),
        ).filter((c) => c.dataset.evicted !== 'true').length;
        if (residentCount > resident) evict(tbody, table, observer);
      });
    },
    { root: null, rootMargin: ROOT_MARGIN },
  );
  observers.set(table, observer);
  table
    .querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]')
    .forEach((tbody) => observer.observe(tbody));
}

export function initWindowedList(root: ParentNode = document): void {
  root.querySelectorAll<HTMLTableElement>('.bo-data-table[data-windowed]').forEach(bindTable);
}
