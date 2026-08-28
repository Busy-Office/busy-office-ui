import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

/* roadmap 173.3 — initWindowedList shipped with zero tests, and its
   spacer-height mechanism has already shipped wrong once (token-derived
   heights ran ~250px short per 100-row chunk).

   WHAT THIS FILE CAN AND CANNOT HOLD, said plainly rather than implied.
   jsdom lays nothing out: every getBoundingClientRect is 0x0, so a test
   written against real geometry here would silently assert the TOKEN
   FALLBACK and call the measured path covered — which is the exact bug
   173.3 names. So rows are given a stubbed height that DIFFERS from the
   token fallback (32.5 vs 40), which makes every assertion below
   discriminating: a regression to token-derived heights changes the
   number. The one property a stub cannot establish — that real rows
   actually render taller than the token — is held in a real browser by
   `check-po-app.mjs`'s `spacerMatchesReal`, which compares a 100-row
   spacer against a measured row on /movements. */

const STUB_ROW_H = 32.5; // deliberately != the 40px token fallback
const CHUNK_ROWS = 2;

let rowRectReads = 0;
let stubRowHeight = STUB_ROW_H;
let rectSpy: ReturnType<typeof vi.spyOn>;

/** A controllable IntersectionObserver — jsdom has none, and without one
 *  bindTable returns at its no-op floor and nothing ever evicts. */
class FakeIO {
  static last: FakeIO | null = null;
  cb: IntersectionObserverCallback;
  observed = new Set<Element>();
  constructor(cb: IntersectionObserverCallback) {
    this.cb = cb;
    FakeIO.last = this;
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  /** entries: [element, isIntersecting][] */
  fire(entries: [Element, boolean][]) {
    this.cb(
      entries.map(([target, isIntersecting]) => ({ target, isIntersecting })) as
        unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver,
    );
  }
}

function chunk(id: string, offset: number): string {
  return `
    <tbody data-chunk-id="${id}" data-chunk-offset="${offset}">
      ${Array.from({ length: CHUNK_ROWS }, (_, i) => {
        const n = offset + i + 1;
        return `<tr data-row-id="R-${n}">
          <td><input class="bo-data-table__row-select" type="checkbox"></td>
          <td>${n}</td>
        </tr>`;
      }).join('')}
    </tbody>`;
}

function table(chunks: number, resident: number): HTMLTableElement {
  html`
    <div class="bo-data-table-container">
      <table class="bo-data-table" data-windowed data-window-chunks="${String(resident)}"
             data-table-total-rows="50000">
        <thead><tr><th scope="col"><span>Sel</span></th><th scope="col">Row</th></tr></thead>
        ${Array.from({ length: chunks }, (_, i) => chunk(`c${i}`, i * CHUNK_ROWS)).join('')}
      </table>
    </div>
  `;
  return document.querySelector('table') as HTMLTableElement;
}

function spacerHeight(t: HTMLTableElement, chunkId: string): number {
  const tbody = t.querySelector<HTMLElement>(`tbody[data-chunk-id="${chunkId}"]`);
  return parseFloat(
    tbody?.querySelector<HTMLElement>('.bo-data-table__spacer')?.style.blockSize ?? 'NaN',
  );
}

function evicted(t: HTMLTableElement, chunkId: string): boolean {
  return (
    t.querySelector<HTMLElement>(`tbody[data-chunk-id="${chunkId}"]`)?.dataset.evicted === 'true'
  );
}

beforeEach(() => {
  document.body.innerHTML = '';
  rowRectReads = 0;
  stubRowHeight = STUB_ROW_H;
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
    FakeIO as unknown as typeof IntersectionObserver;
  const original = Element.prototype.getBoundingClientRect;
  rectSpy = vi
    .spyOn(Element.prototype, 'getBoundingClientRect')
    .mockImplementation(function (this: Element) {
      if (this instanceof HTMLTableRowElement && this.dataset.rowId) {
        rowRectReads++;
        // jsdom's rect is a plain object with no toJSON; only `height` is read.
        return { ...original.call(this), height: stubRowHeight } as DOMRect;
      }
      return original.call(this);
    });
});

afterEach(() => {
  rectSpy.mockRestore();
  delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
});

describe('initWindowedList — spacer height', () => {
  it('an evicted chunk becomes a spacer of rowCount x the MEASURED row height, not the token', () => {
    const t = table(4, 3);
    ui.initWindowedList();
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);

    // c3 is farthest from the visible c0, and 4 residents exceed the budget of 3.
    expect(evicted(t, 'c3')).toBe(true);
    expect(spacerHeight(t, 'c3')).toBe(CHUNK_ROWS * STUB_ROW_H); // 65
    // The number the reverted design would have produced. Named so a
    // regression reads as "it went back to the token", not "65 changed".
    expect(spacerHeight(t, 'c3')).not.toBe(CHUNK_ROWS * 40);
  });

  it('the row height is measured ONCE and cached — a later eviction re-uses it', () => {
    const t = table(4, 3);
    ui.initWindowedList();
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);
    const readsAfterFirstEviction = rowRectReads;

    // A new chunk arrives (a load-more append), pushing residents over budget
    // again — WITHOUT an htmx swap, which is the only thing allowed to
    // refresh the cache.
    stubRowHeight = 50;
    t.insertAdjacentHTML('beforeend', chunk('c4', 8));
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);

    expect(evicted(t, 'c4')).toBe(true);
    expect(spacerHeight(t, 'c4')).toBe(CHUNK_ROWS * STUB_ROW_H); // cached 32.5, not 50
    expect(rowRectReads).toBe(readsAfterFirstEviction);
  });

  it('reads no row geometry at bind — the one measurement happens at the FIRST eviction', () => {
    /* Pins what the code does, against what two documents claimed it did
       (roadmap 173.3): windowed-list.ts's own header said "one read at
       bind", and /concepts/scale said "measured once when the table
       binds". Measured here: 0 reads at bind, 1 at the first eviction.
       The INTENT holds — one read per table, not one per eviction — but
       the first eviction is on the scroll path, so "eviction never forces
       a layout read" was never true as written. */
    const t = table(4, 3);
    ui.initWindowedList();
    expect(rowRectReads).toBe(0);

    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);
    expect(evicted(t, 'c3')).toBe(true);
    expect(rowRectReads).toBe(1);
  });

  it('an htmx swap refreshes the cached row height (density may have changed)', () => {
    const t = table(4, 3);
    ui.initWindowedList();
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);

    stubRowHeight = 50;
    t.insertAdjacentHTML('beforeend', chunk('c4', 8));
    t.closest('.bo-data-table-container')!.dispatchEvent(
      new Event('htmx:afterSwap', { bubbles: true }),
    );
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);

    expect(spacerHeight(t, 'c4')).toBe(CHUNK_ROWS * 50);
  });

  it('falls back to the density token when no real row has rendered yet', () => {
    // No stylesheet in jsdom, so --bo-density-row-height does not resolve and
    // densityRowHeightPx returns its documented 40px floor. This is the
    // fallback path, asserted AS the fallback — never as the measured one.
    html`
      <div class="bo-data-table-container">
        <table class="bo-data-table" data-windowed data-window-chunks="1">
          <thead><tr><th scope="col">Row</th></tr></thead>
          <tbody data-chunk-id="e0" data-chunk-offset="0"><tr><td>no data-row-id</td></tr></tbody>
          <tbody data-chunk-id="e1" data-chunk-offset="1"><tr><td>no data-row-id</td></tr></tbody>
        </table>
      </div>
    `;
    const t = document.querySelector('table') as HTMLTableElement;
    ui.initWindowedList();
    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="e0"]')!, true]]);
    expect(spacerHeight(t, 'e1')).toBe(1 * 40);
  });
});

describe('initWindowedList — the spacer as a re-request', () => {
  it('carries chunk id, offset and SIZE, and fires bo:table-load-more once when scrolled back to', () => {
    const t = table(4, 3);
    ui.initWindowedList();
    const io = FakeIO.last!;
    io.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);

    const spacer = t.querySelector<HTMLElement>('tbody[data-chunk-id="c3"]')!;
    expect(spacer.dataset.chunkSize).toBe(String(CHUNK_ROWS));
    expect(spacer.dataset.chunkOffset).toBe('6');

    const details: unknown[] = [];
    document.addEventListener('bo:table-load-more', (e) =>
      details.push((e as CustomEvent).detail),
    );
    io.fire([[spacer, true]]);
    io.fire([[spacer, true]]); // a slow consumer must not accumulate re-requests

    expect(details).toEqual([{ offset: 6, chunkId: 'c3', size: CHUNK_ROWS }]);
  });
});

describe('initWindowedList — selection survives eviction', () => {
  it('keeps a checked row in the hidden-input host after its chunk is evicted, and re-checks it on return', () => {
    const t = table(4, 3);
    ui.initWindowedList();

    const box = t.querySelector<HTMLInputElement>(
      'tbody[data-chunk-id="c3"] .bo-data-table__row-select',
    )!;
    const rowId = box.closest<HTMLElement>('[data-row-id]')!.dataset.rowId!;
    box.checked = true;
    box.dispatchEvent(new Event('change', { bubbles: true }));

    FakeIO.last!.fire([[t.querySelector('tbody[data-chunk-id="c0"]')!, true]]);
    expect(evicted(t, 'c3')).toBe(true);
    // The row is gone from the DOM; the Set outside it is what a bulk action reads.
    expect(t.querySelector(`[data-row-id="${rowId}"]`)).toBeNull();
    expect(
      document.querySelector(`[data-windowed-selection-host] input[value="${rowId}"]`),
    ).not.toBeNull();

    // The chunk comes back: the swap reconcile re-applies the saved selection.
    t.querySelector('tbody[data-chunk-id="c3"]')!.outerHTML = chunk('c3', 6);
    t.closest('.bo-data-table-container')!.dispatchEvent(
      new Event('htmx:afterSwap', { bubbles: true }),
    );
    expect(
      t.querySelector<HTMLInputElement>(`[data-row-id="${rowId}"] .bo-data-table__row-select`)
        ?.checked,
    ).toBe(true);
  });
});

describe('initWindowedList — indexing', () => {
  it('sets aria-rowcount from the true total and aria-rowindex from the chunk offset', () => {
    const t = table(4, 3);
    ui.initWindowedList();
    expect(t.getAttribute('aria-rowcount')).toBe('50001'); // 50,000 data rows + header
    const mid = t.querySelector('tbody[data-chunk-id="c2"] tr')!;
    // offset 4, plus one header row, plus 1 for aria's 1-based indexing.
    expect(mid.getAttribute('aria-rowindex')).toBe('6');
  });

  it('without IntersectionObserver every chunk stays resident — the documented no-op floor', () => {
    delete (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver;
    const t = table(4, 1);
    expect(() => ui.initWindowedList()).not.toThrow();
    expect(t.querySelectorAll('tbody[data-evicted="true"]').length).toBe(0);
    expect(t.getAttribute('aria-rowcount')).toBe('50001');
  });
});
