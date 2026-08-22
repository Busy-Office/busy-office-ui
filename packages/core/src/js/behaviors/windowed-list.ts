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
  /* The density tokens are declared in REM (density.css: 1.875rem / 2.5rem /
     3rem) and custom properties come back from getComputedStyle UNRESOLVED —
     parseFloat alone read "1.875rem" as 1.875 and the first live spacer came
     out 187.5px for 100 rows, 16x short (30.4b red-proof, first run). Convert
     by unit; px/unitless pass through. */
  const raw = getComputedStyle(table)
    .getPropertyValue('--bo-density-row-height')
    .trim();
  const n = parseFloat(raw);
  if (!Number.isFinite(n)) return 40; // comfortable's value, if the token can't resolve
  if (raw.endsWith('rem'))
    return n * (parseFloat(getComputedStyle(document.documentElement).fontSize) || 16);
  if (raw.endsWith('em')) return n * (parseFloat(getComputedStyle(table).fontSize) || 16);
  return n;
}

function columnCount(table: HTMLTableElement): number {
  return table.tHead?.rows[0]?.cells.length || table.rows[0]?.cells.length || 1;
}

/* The observer's root must be the nearest scrollable ancestor, not the
   default viewport: with root:null, rootMargin expands the VIEWPORT rect,
   but the target is still clipped by any scroll container between it and
   the root — so a spacer scrolled out of an app shell's main region never
   reports intersecting at all, margin or no margin, and re-requests only
   fired once a spacer was literally visible (30.4b red-proof, live in
   po-app's .bo-app-shell__main). Plain window-scrolled pages: null. */
function scrollParent(el: Element): Element | null {
  for (let p = el.parentElement; p; p = p.parentElement) {
    const s = getComputedStyle(p);
    // overflow-y alone is not enough: .bo-data-table-container is
    // `overflow: auto` for HORIZONTAL table scrolling and grows with its
    // content vertically — picked as root, its rect covers every chunk, so
    // nothing ever left it and eviction silently stopped (red-proof run 3).
    // The root is the ancestor that scrolls vertically AND actually clips.
    if (/(auto|scroll)/.test(s.overflowY) && p.scrollHeight > p.clientHeight + 1) return p;
  }
  return null;
}

/* Spacer row height: measured from ONE real rendered row, cached per table.
   The grill's original call was "compute from the density token, never
   measure" — the red-proof amended it: real rows render taller than the
   token (32.5px vs compact's 30px — border-box extras), so token-derived
   spacers ran 250px short per 100-row chunk, a guaranteed scroll jump. The
   decision's INTENT — no layout read during the eviction scroll path —
   holds: one read at bind (and a cache refresh during the post-swap
   reconcile, where layout is already hot), never per eviction. The token
   stays as the fallback when no real row exists yet. */
const rowHeights = new WeakMap<HTMLTableElement, number>();
function chunkRowHeightPx(table: HTMLTableElement): number {
  const cached = rowHeights.get(table);
  if (cached) return cached;
  const real = table.querySelector<HTMLElement>('tbody[data-chunk-offset] tr[data-row-id]');
  const h = real?.getBoundingClientRect().height || densityRowHeightPx(table);
  if (h) rowHeights.set(table, h);
  return h;
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
  const height = rowCount * chunkRowHeightPx(table);
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
  // One fire per evicted spacer until it is swapped away — a slow consumer
  // must not accumulate duplicate re-requests while the spacer keeps
  // crossing the observer margin. data-bo-* = internal bookkeeping, never
  // consumer-written (the extract-behaviors convention).
  if (spacer.dataset.boReloading === 'true') return;
  spacer.dataset.boReloading = 'true';
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

  // data-table-total-rows counts DATA rows; aria-rowcount counts ALL rows
  // including the header row, same space aria-rowindex is computed in.
  const total = Number(table.dataset.tableTotalRows);
  if (Number.isFinite(total) && total > 0) {
    table.setAttribute('aria-rowcount', String(total + (table.tHead ? 1 : 0)));
  }

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

  // Deliberately broad rather than target-precise: htmx's afterSwap target
  // resolution differs between outerHTML swaps (spacer -> real tbody) and
  // appends (a NEW chunk arriving via the load-more button), and chasing
  // the exact element per swap style is how a chunk quietly ends up
  // unobserved. Instead, ANY swap bubbling through the container
  // reconciles every chunk: reindex + reapply selection on resident ones,
  // (re)observe all — observe is idempotent per the IntersectionObserver
  // spec, so double-observing costs nothing.
  table.closest('.bo-data-table-container')?.addEventListener('htmx:afterSwap', () => {
    const observer = observers.get(table);
    // Refresh the cached row height while layout is already hot — a real
    // row is guaranteed present right after a chunk swap, and this keeps
    // the cache honest if density changed since bind.
    const real = table.querySelector<HTMLElement>('tbody[data-chunk-offset] tr[data-row-id]');
    if (real) rowHeights.set(table, real.getBoundingClientRect().height);
    table
      .querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]')
      .forEach((tbody) => {
        if (tbody.dataset.evicted !== 'true') {
          reindexChunk(tbody, table);
          applySavedSelection(tbody, table);
        }
        observer?.observe(tbody);
      });
  });

  // No-op floor: without IntersectionObserver every chunk simply stays
  // resident forever — correct, just not memory-releasing.
  if (typeof IntersectionObserver === 'undefined') return;

  const resident = Number(table.dataset.windowChunks) || DEFAULT_RESIDENT_CHUNKS;
  /* Eviction is a SWEEP over all residents, not a per-transition check.
     The first version evicted only the chunk whose own exit transition was
     firing, if residents were over budget AT THAT MOMENT — and the 30.4b
     red-proof caught the hole on its first run: a chunk that exits while
     the table is still small (chunk 0, always) never transitions again, so
     it stayed resident forever while later chunks evicted around it. The
     sweep instead tracks the currently-visible set and, on every callback,
     evicts the farthest-from-view non-visible residents until the budget
     holds — no chunk is exempt just because its exit happened early. */
  const visible = new Set<Element>();
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const tbody = entry.target as HTMLTableSectionElement;
        if (entry.isIntersecting) {
          visible.add(tbody);
          if (tbody.dataset.evicted === 'true') requestReload(tbody, table);
        } else {
          visible.delete(tbody);
        }
      });
      const residents = Array.from(
        table.querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]'),
      ).filter((c) => c.dataset.evicted !== 'true');
      const over = residents.length - resident;
      if (over <= 0) return;
      const visibleOffsets = residents
        .filter((c) => visible.has(c))
        .map((c) => Number(c.dataset.chunkOffset));
      const anchor = visibleOffsets.length
        ? visibleOffsets.reduce((a, b) => a + b, 0) / visibleOffsets.length
        : Number.POSITIVE_INFINITY; // nothing visible mid-flight: treat the deepest as nearest
      residents
        .filter((c) => !visible.has(c))
        .sort(
          (a, b) =>
            Math.abs(Number(b.dataset.chunkOffset) - anchor) -
            Math.abs(Number(a.dataset.chunkOffset) - anchor),
        )
        .slice(0, over)
        .forEach((c) => {
          visible.delete(c);
          evict(c, table, observer);
        });
    },
    { root: scrollParent(table), rootMargin: ROOT_MARGIN },
  );
  observers.set(table, observer);
  table
    .querySelectorAll<HTMLTableSectionElement>('tbody[data-chunk-offset]')
    .forEach((tbody) => observer.observe(tbody));
}

export function initWindowedList(root: ParentNode = document): void {
  root.querySelectorAll<HTMLTableElement>('.bo-data-table[data-windowed]').forEach(bindTable);
}
