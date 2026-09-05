/**
 * `data-load-more-auto` — the auto-fire half of initLoadMore.
 *
 * A SEPARATE file from load-more.test.ts on purpose. `initLoadMore` latches
 * `installed` and builds its IntersectionObserver exactly once, inside the
 * `if (!installed)` branch, so a file that has already called it in jsdom
 * (where `IntersectionObserver` is undefined) can never acquire an observer
 * afterwards — whatever it installs on `globalThis` later. vitest isolates
 * module graphs per file, so this file installs the fake BEFORE any call and
 * load-more.test.ts keeps its no-IntersectionObserver case.
 *
 * What jsdom can and cannot answer, said plainly: FakeIO drives the callback,
 * so these cases assert the WIRING — which elements get observed, and what the
 * module does with an intersecting entry. They do not assert the browser's own
 * intersection computation. That half was measured in headless Chrome against
 * the shipped `dist/js/behaviors/load-more.js` (roadmap 277.1): a button out of
 * view at init read `0` fires, scrolling it in read `1`, scrolling away and
 * back read `2` — and a button ALREADY in view when `initLoadMore()` runs read
 * `1` with no scroll and no click, which is the fact five documentation sites
 * used to state as "scrolls into view".
 */
import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

/** A controllable IntersectionObserver — jsdom has none, and without one
 *  initLoadMore never builds an observer and nothing auto-fires. Same shape
 *  as windowed-list.test.ts's, which is where the precedent comes from. */
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

beforeAll(() => {
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
    FakeIO as unknown as typeof IntersectionObserver;
});

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('initLoadMore with data-load-more-auto', () => {
  it('observes the auto button and fires one bubbling event when it is intersecting', () => {
    html`<button id="b" type="button" data-table-load-more data-load-more-auto>Load more</button>`;
    ui.initLoadMore();
    const btn = document.getElementById('b') as HTMLButtonElement;
    expect(FakeIO.last?.observed.has(btn)).toBe(true);

    const seen: boolean[] = [];
    document.addEventListener('bo:table-load-more', (e) => seen.push(e.bubbles));
    FakeIO.last!.fire([[btn, true]]);
    expect(seen).toEqual([true]);
  });

  it('does not fire while the button is out of view', () => {
    html`<button id="b" type="button" data-table-load-more data-load-more-auto>Load more</button>`;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    FakeIO.last!.fire([[document.getElementById('b') as Element, false]]);
    expect(fired).toBe(0);
  });

  it('fires once per entry, so a consumer that fails to append does not loop', () => {
    html`<button id="b" type="button" data-table-load-more data-load-more-auto>Load more</button>`;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    const btn = document.getElementById('b') as Element;
    /* Two approaches with a departure between them: the observer reports a
       transition, so nothing re-fires while the button merely stays in view. */
    FakeIO.last!.fire([[btn, true]]);
    FakeIO.last!.fire([[btn, false]]);
    FakeIO.last!.fire([[btn, true]]);
    expect(fired).toBe(2);
  });

  it('a disabled auto button (fetch in flight) does not auto-fire', () => {
    html`<button id="b" type="button" data-table-load-more data-load-more-auto disabled>Load more</button>`;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    FakeIO.last!.fire([[document.getElementById('b') as Element, true]]);
    expect(fired).toBe(0);
  });

  it('a button without data-load-more-auto is never observed', () => {
    html`<button id="b" type="button" data-table-load-more>Load more</button>`;
    ui.initLoadMore();
    expect(FakeIO.last?.observed.has(document.getElementById('b') as Element)).toBe(false);
  });

  it('observes a late-arriving auto button on a second initLoadMore() call', () => {
    html`<div id="host"></div>`;
    ui.initLoadMore();
    const host = document.getElementById('host') as HTMLElement;
    host.innerHTML =
      '<button id="late" type="button" data-table-load-more data-load-more-auto>Load more</button>';
    const late = document.getElementById('late') as Element;
    expect(FakeIO.last?.observed.has(late)).toBe(false);
    ui.initLoadMore();
    expect(FakeIO.last?.observed.has(late)).toBe(true);
  });
});
