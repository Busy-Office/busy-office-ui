/**
 * Behavior tests run against the COMPILED dist (test what ships).
 * `npm run build:js` must run before `npm test` — CI does; the local test
 * script does too via pretest.
 */
import { beforeEach, describe, expect, it, vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';

function html(strings: TemplateStringsArray, ...vals: unknown[]): void {
  document.body.innerHTML = String.raw(strings, ...vals);
}

beforeEach(() => {
  document.body.innerHTML = '';
});

/** jsdom lacks showModal/close — emulate the open/close+event contract the
 *  code relies on. */
function stubShowModal(dialog: HTMLDialogElement) {
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new Event('close'));
  };
  return vi.spyOn(dialog, 'showModal');
}

describe('initDialogs (delegation)', () => {
  // jsdom implements <dialog> show/close + close event; showModal exists.
  it('opens via trigger, syncs data-state, and guards re-trigger while open', () => {
    ui.initDialogs();
    html`
      <button data-dialog-trigger="d1">open</button>
      <dialog id="d1" data-state="closed"><button>x</button></dialog>
    `;
    const dialog = document.getElementById('d1') as HTMLDialogElement;
    const trigger = document.querySelector('button')!;
    const showModal = stubShowModal(dialog);
    (trigger as HTMLElement).click();
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog.dataset.state).toBe('open');
    // Re-trigger while open: guarded no-op (grill finding N2).
    (trigger as HTMLElement).click();
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog.dataset.state).toBe('open');
    dialog.close();
    expect(dialog.dataset.state).toBe('closed');
  });

  it('works when the trigger renders BEFORE the dialog exists (grill finding R1)', () => {
    ui.initDialogs();
    html`<button data-dialog-trigger="late">open</button>`;
    const trigger = document.querySelector('button')!;
    (trigger as HTMLElement).click(); // dialog absent: no throw, no dead flag
    document.body.insertAdjacentHTML(
      'beforeend',
      '<dialog id="late" data-state="closed"></dialog>',
    );
    const dialog = document.getElementById('late') as HTMLDialogElement;
    const showModal = stubShowModal(dialog);
    (trigger as HTMLElement).click();
    expect(showModal).toHaveBeenCalledTimes(1);
    expect(dialog.dataset.state).toBe('open');
  });
});

describe('initDataTables', () => {
  function table(): HTMLElement {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <span class="bo-data-table__selection-count"></span>
          <input class="bo-input" type="search" aria-label="Filter" />
        </div>
        <table>
          <thead><tr><th>
            <input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all" />
          </th></tr></thead>
          <tbody>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r1" /></td></tr>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r2" /></td></tr>
            <tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="r3" /></td></tr>
          </tbody>
        </table>
      </div>
    `;
    const container = document.querySelector('.bo-data-table-container')!;
    ui.initDataTables();
    return container as HTMLElement;
  }

  const rows = (c: Element) =>
    Array.from(c.querySelectorAll<HTMLInputElement>('.bo-data-table__row-select'));
  const change = (el: Element) =>
    el.dispatchEvent(new Event('change', { bubbles: true }));

  it('select-all checks all rows, sets count, any-selected, indeterminate', () => {
    const c = table();
    const all = c.querySelector<HTMLInputElement>('.bo-data-table__select-all')!;
    const count = c.querySelector('.bo-data-table__selection-count')!;

    all.checked = true;
    change(all);
    expect(rows(c).every((r) => r.checked)).toBe(true);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    expect(count.textContent).toBe('3 selected');
    expect(count.getAttribute('aria-live')).toBe('polite');

    rows(c)[0].checked = false;
    change(rows(c)[0]);
    expect(all.indeterminate).toBe(true);
    expect(count.textContent).toBe('2 selected');
  });

  it('ignores unrelated change events (toolbar inputs)', () => {
    const c = table();
    rows(c)[0].checked = true;
    change(rows(c)[0]);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    const search = c.querySelector('input[type="search"]')!;
    change(search);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
    expect(rows(c)[0].checked).toBe(true);
  });

  it('re-derives after a row swap via htmx:afterSwap and refreshDataTable (grill finding N1)', () => {
    const c = table();
    rows(c).forEach((r) => (r.checked = true));
    change(rows(c)[0]);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');

    // Simulate an HTMX tbody swap to fresh, unchecked rows.
    c.querySelector('tbody')!.innerHTML =
      '<tr><td><input type="checkbox" class="bo-data-table__row-select" aria-label="n1" /></td></tr>';
    c.dispatchEvent(new Event('htmx:afterSwap', { bubbles: true }));
    expect((c as HTMLElement).dataset.anySelected).toBe('false');
    expect(c.querySelector('.bo-data-table__selection-count')!.textContent).toBe('');

    // Manual path for non-HTMX swappers.
    c.querySelector<HTMLInputElement>('.bo-data-table__row-select')!.checked = true;
    ui.refreshDataTable(c);
    expect((c as HTMLElement).dataset.anySelected).toBe('true');
  });
});

describe('initTabs', () => {
  function tabs(): HTMLElement[] {
    html`
      <div class="bo-tabs">
        <div class="bo-tabs__list" role="tablist" aria-label="t">
          <button class="bo-tabs__tab" role="tab" id="t1" aria-selected="true" aria-controls="p1">One</button>
          <button class="bo-tabs__tab" role="tab" id="t2" tabindex="-1" aria-selected="false" aria-controls="p2">Two</button>
        </div>
        <div role="tabpanel" id="p1" tabindex="0"></div>
        <div role="tabpanel" id="p2" tabindex="0" hidden></div>
      </div>
    `;
    ui.initTabs();
    return Array.from(document.querySelectorAll('[role="tab"]'));
  }

  it('click activation moves selection, roving tabindex, and panel visibility', () => {
    const [t1, t2] = tabs();
    t2.click();
    expect(t2.getAttribute('aria-selected')).toBe('true');
    expect(t1.getAttribute('aria-selected')).toBe('false');
    expect(t1.tabIndex).toBe(-1);
    expect(t2.tabIndex).toBe(0);
    expect(document.getElementById('p1')!.hidden).toBe(true);
    expect(document.getElementById('p2')!.hidden).toBe(false);
  });

  it('ArrowRight activates the next tab and wraps', () => {
    const [t1, t2] = tabs();
    t1.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(t2.getAttribute('aria-selected')).toBe('true');
    t2.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    expect(t1.getAttribute('aria-selected')).toBe('true');
  });
});

describe('initDropdowns (popover)', () => {
  it('closes the popover when an item is picked', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="m1">open</button>
      <div class="bo-dropdown__menu" id="m1" popover>
        <button class="bo-dropdown__item" type="button">Pick</button>
      </div>
    `;
    const menu = document.getElementById('m1') as HTMLElement & {
      hidePopover: () => void;
    };
    // jsdom has no popover implementation — stub the API surface.
    menu.hidePopover = vi.fn();
    document.querySelector<HTMLElement>('.bo-dropdown__item')!.click();
    expect(menu.hidePopover).toHaveBeenCalledTimes(1);
  });
});

describe('initAlerts', () => {
  it('dismiss removes the enclosing alert — including injected toasts', () => {
    ui.initAlerts();
    html`<div class="bo-toast-region" role="status" aria-live="polite"></div>`;
    document.querySelector('.bo-toast-region')!.innerHTML =
      '<div class="bo-alert bo-toast">saved <button class="bo-alert__dismiss" aria-label="Dismiss">x</button></div>';
    document.querySelector<HTMLElement>('.bo-alert__dismiss')!.click();
    expect(document.querySelector('.bo-alert')).toBeNull();
  });
});

describe('behaviors manifest (generated)', () => {
  it('lists exactly the runtime exports and counts init* correctly', async () => {
    // @ts-expect-error — generated artifact
    const manifest = (await import('../dist/behaviors.json')).default;
    const runtimeExports = Object.keys(ui).sort();
    expect(manifest.exports).toEqual(runtimeExports);
    expect(manifest.initCount).toBe(runtimeExports.filter((n) => n.startsWith('init')).length);
  });
});

describe('trapFocus', () => {
  it('skips hidden elements when wrapping (grill finding R9)', () => {
    html`
      <dialog id="d">
        <button id="first">a</button>
        <button hidden id="ghost">hidden</button>
        <button id="last">b</button>
      </dialog>
    `;
    const dialog = document.getElementById('d')!;
    const last = document.getElementById('last')!;
    // jsdom lacks checkVisibility + layout; emulate the offsetParent fallback.
    for (const b of dialog.querySelectorAll<HTMLElement>('button')) {
      Object.defineProperty(b, 'offsetParent', {
        get: () => (b.hasAttribute('hidden') ? null : dialog),
      });
    }
    last.focus();
    const focusFirst = vi.spyOn(document.getElementById('first')!, 'focus');
    const e = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
    Object.defineProperty(e, 'currentTarget', { value: dialog });
    ui.trapFocus(e);
    expect(focusFirst).toHaveBeenCalled();
  });
});
