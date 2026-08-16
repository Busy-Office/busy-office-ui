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

  it('multi-select: checking an item does not close the menu, and updates the trigger label with a count', () => {
    ui.initDropdowns();
    html`
      <button popovertarget="m2" data-multiselect-label="Cost center">Cost center</button>
      <div class="bo-dropdown__menu" id="m2" popover data-multiselect>
        <label class="bo-dropdown__item"><input type="checkbox" value="CC-1180" /> CC-1180</label>
        <label class="bo-dropdown__item"><input type="checkbox" value="CC-2205" /> CC-2205</label>
      </div>
    `;
    const menu = document.getElementById('m2') as HTMLElement & { hidePopover: () => void };
    menu.hidePopover = vi.fn();
    const [first, second] = [...document.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')];

    first.click();
    expect(menu.hidePopover).not.toHaveBeenCalled();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (1)');

    second.click();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (2)');

    first.click();
    expect(document.querySelector('[popovertarget="m2"]')!.textContent).toBe('Cost center (1)');
  });
});

describe('initCombobox', () => {
  function combobox(): { input: HTMLInputElement; listbox: HTMLElement } {
    html`
      <div class="bo-combobox">
        <input class="bo-input" type="text" role="combobox" id="cb-input"
            aria-expanded="false" aria-controls="cb-list" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="cb-list" role="listbox" popover>
          <li class="bo-combobox__option" role="option" id="cb-opt-1" data-value="CC-1180">CC-1180</li>
          <li class="bo-combobox__option" role="option" id="cb-opt-2" data-value="CC-2205">CC-2205</li>
          <li class="bo-combobox__option" role="option" id="cb-opt-3" data-value="CC-4021">CC-4021</li>
        </ul>
      </div>
    `;
    ui.initCombobox();
    return {
      input: document.getElementById('cb-input') as HTMLInputElement,
      listbox: document.getElementById('cb-list') as HTMLElement,
    };
  }
  const type = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
  };
  const key = (input: HTMLInputElement, k: string) =>
    input.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

  it('typing filters options case-insensitively and opens the list', () => {
    const { input, listbox } = combobox();
    type(input, '2205');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const hidden = [...listbox.querySelectorAll('[role="option"]')].map((o) => (o as HTMLElement).hidden);
    expect(hidden).toEqual([true, false, true]);
  });

  it('no matches closes the list', () => {
    const { input } = combobox();
    type(input, 'zzz');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('ArrowDown moves aria-activedescendant across the filtered options only', () => {
    const { input } = combobox();
    type(input, 'cc');
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-1');
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-2');
    // ArrowUp clamps at the top rather than wrapping.
    key(input, 'ArrowUp');
    key(input, 'ArrowUp');
    key(input, 'ArrowUp');
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-1');
  });

  it('Enter commits the active option, closes the list, and dispatches bo:combobox-select', () => {
    const { input } = combobox();
    let detail: any = null;
    input.addEventListener('bo:combobox-select', (e: any) => { detail = e.detail; });
    type(input, 'cc');
    key(input, 'ArrowDown');
    key(input, 'ArrowDown');
    key(input, 'Enter');
    expect(input.value).toBe('CC-2205');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(detail).toEqual({ value: 'CC-2205', text: 'CC-2205' });
  });

  it('clicking an option commits it the same way as Enter', () => {
    const { input, listbox } = combobox();
    type(input, 'cc');
    (listbox.querySelector('#cb-opt-3') as HTMLElement).click();
    expect(input.value).toBe('CC-4021');
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('survives duplicated ids from a partial swap: each widget stays self-contained', () => {
    // A naive fragment duplication (the classic HTMX partial-swap accident)
    // leaves two widgets with IDENTICAL ids and aria-controls. Resolution
    // must prefer the shared .bo-combobox container over document-wide id
    // lookup, or widget #2 silently drives widget #1.
    html`
      <div class="bo-combobox" data-t="one">
        <input class="bo-input" type="text" role="combobox"
            aria-expanded="false" aria-controls="cb-dup" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="cb-dup" role="listbox" popover>
          <li class="bo-combobox__option" role="option" id="dup-a" data-value="A1">Alpha</li>
        </ul>
      </div>
      <div class="bo-combobox" data-t="two">
        <input class="bo-input" type="text" role="combobox"
            aria-expanded="false" aria-controls="cb-dup" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="cb-dup" role="listbox" popover>
          <li class="bo-combobox__option" role="option" id="dup-b" data-value="B1">Bravo</li>
        </ul>
      </div>
    `;
    ui.initCombobox();
    const second = document.querySelector('[data-t="two"]') as HTMLElement;
    const input2 = second.querySelector('input') as HTMLInputElement;
    const listbox2 = second.querySelector('[role="listbox"]') as HTMLElement;
    const listbox1 = document.querySelector('[data-t="one"] [role="listbox"]') as HTMLElement;

    type(input2, 'br');
    // widget #2 filters its OWN list; widget #1 is untouched
    expect(input2.getAttribute('aria-expanded')).toBe('true');
    expect((listbox2.querySelector('#dup-b') as HTMLElement).hidden).toBe(false);
    expect(listbox1.hasAttribute('data-bo-open')).toBe(false);

    let detail: any = null;
    input2.addEventListener('bo:combobox-select', (e: any) => { detail = e.detail; });
    (listbox2.querySelector('#dup-b') as HTMLElement).click();
    // the commit lands in input #2, not the first id match in the document
    expect(input2.value).toBe('Bravo');
    expect(detail).toEqual({ value: 'B1', text: 'Bravo' });
  });
});

describe('initCollapsibleCards', () => {
  function card(): { trigger: HTMLElement; body: HTMLElement } {
    html`
      <div class="bo-widget">
        <header class="bo-widget__header">
          <button data-collapse-trigger aria-expanded="true" aria-controls="c1">
            <span class="bo-widget__toggle-icon">▾</span> Title
          </button>
        </header>
        <div class="bo-widget__collapse" id="c1" data-state="open">
          <div class="bo-widget__body">content</div>
        </div>
      </div>
    `;
    ui.initCollapsibleCards();
    return {
      trigger: document.querySelector('[data-collapse-trigger]')!,
      body: document.getElementById('c1')!,
    };
  }

  it('click toggles aria-expanded and data-state open <-> closed', () => {
    const { trigger, body } = card();
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(body.dataset.state).toBe('closed');
    trigger.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(body.dataset.state).toBe('open');
  });

  it('clicking inside the trigger (the icon span) still toggles it', () => {
    const { trigger, body } = card();
    document.querySelector<HTMLElement>('.bo-widget__toggle-icon')!.click();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(body.dataset.state).toBe('closed');
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

describe('initDataGrid', () => {
  function grid(): HTMLTableElement {
    html`
      <table class="bo-data-table" data-grid-nav>
        <thead><tr>
          <th scope="col"><input type="checkbox" class="bo-checkbox bo-data-table__select-all" aria-label="Select all" /></th>
          <th scope="col">Invoice</th>
        </tr></thead>
        <tbody>
          <tr><td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="r1" /></td><td>INV-1</td></tr>
          <tr><td><input type="checkbox" class="bo-checkbox bo-data-table__row-select" aria-label="r2" /></td><td>INV-2</td></tr>
        </tbody>
      </table>
    `;
    ui.initDataGrid();
    return document.querySelector('.bo-data-table') as HTMLTableElement;
  }
  const key = (el: Element, k: string, mods: Partial<KeyboardEventInit> = {}) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, ...mods }));

  it('sets role=grid, aria-multiselectable, and 1-based rowindex/colindex', () => {
    const g = grid();
    expect(g.getAttribute('role')).toBe('grid');
    expect(g.getAttribute('aria-multiselectable')).toBe('true');
    const rows = g.querySelectorAll('tr');
    expect(rows[0].getAttribute('aria-rowindex')).toBe('1');
    expect(rows[2].getAttribute('aria-rowindex')).toBe('3');
    expect(rows[1].children[1].getAttribute('aria-colindex')).toBe('2');
  });

  it('exactly one cell is tabbable at init; interactive descendants are pulled out of Tab order', () => {
    const g = grid();
    const tabbable = g.querySelectorAll('td[tabindex="0"], th[tabindex="0"]');
    expect(tabbable.length).toBe(1);
    expect(tabbable[0]).toBe(g.querySelector('th'));
    g.querySelectorAll('input').forEach((i) => expect(i.tabIndex).toBe(-1));
  });

  it('ArrowRight/ArrowDown move the cell cursor (clamped, no wrap)', () => {
    const g = grid();
    const first = g.querySelector('th') as HTMLElement;
    first.focus();
    key(first, 'ArrowRight');
    const second = g.querySelectorAll('th')[1];
    expect(document.activeElement).toBe(second);
    expect(second.tabIndex).toBe(0);
    expect(first.tabIndex).toBe(-1);
    key(second, 'ArrowDown');
    const belowSecond = g.querySelectorAll('tr')[1].children[1];
    expect(document.activeElement).toBe(belowSecond);
    // Right-edge clamp: no wrap.
    key(belowSecond, 'ArrowRight');
    expect(document.activeElement).toBe(belowSecond);
  });

  it('Enter focuses the cell checkbox; Escape returns focus to the cell', () => {
    const g = grid();
    const cell = g.querySelectorAll('tr')[1].children[0] as HTMLElement;
    cell.tabIndex = 0;
    cell.focus();
    key(cell, 'Enter');
    const box = cell.querySelector('input') as HTMLInputElement;
    expect(document.activeElement).toBe(box);
    key(box, 'Escape');
    expect(document.activeElement).toBe(cell);
  });

  it('checking a row checkbox sets aria-selected on its row', () => {
    const g = grid();
    const row = g.querySelectorAll('tr')[1];
    const box = row.querySelector('input') as HTMLInputElement;
    expect(row.getAttribute('aria-selected')).toBe('false');
    box.checked = true;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    expect(row.getAttribute('aria-selected')).toBe('true');
  });
});

describe('initSavedViews', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/invoices?status=pending&q=acme');
  });

  it('populates .bo-filter-bar fields from the current querystring', () => {
    html`
      <form class="bo-filter-bar">
        <input name="q" value="" />
        <select name="status"><option value="">All</option><option value="pending">Pending</option></select>
      </form>
    `;
    ui.initSavedViews();
    const form = document.querySelector('form')!;
    expect((form.elements.namedItem('q') as HTMLInputElement).value).toBe('acme');
    expect((form.elements.namedItem('status') as HTMLSelectElement).value).toBe('pending');
  });

  it('marks the saved-view link matching the current URL aria-current, clears the others', () => {
    html`
      <nav data-saved-views>
        <a href="/invoices?status=pending&q=acme" aria-current="page">stale-but-matching</a>
        <a href="/invoices?status=overdue">Overdue</a>
      </nav>
    `;
    const [match, other] = document.querySelectorAll('a');
    other.setAttribute('aria-current', 'page'); // wrongly pre-set, should be cleared
    ui.initSavedViews();
    expect(match.getAttribute('aria-current')).toBe('page');
    expect(other.hasAttribute('aria-current')).toBe(false);
  });

  it('checks a checkbox filter via .checked, not .value (ultrareview bug_012)', () => {
    window.history.pushState({}, '', '/invoices?published=true&status=pending');
    html`
      <form class="bo-filter-bar">
        <input type="checkbox" name="published" value="true" />
        <input type="checkbox" name="archived" value="true" checked />
        <select name="status"><option value="">All</option><option value="pending">Pending</option></select>
      </form>
    `;
    ui.initSavedViews();
    const form = document.querySelector('form')!;
    expect((form.elements.namedItem('published') as HTMLInputElement).checked).toBe(true);
    // 'archived' isn't in the URL — params.has() is false, left untouched.
    expect((form.elements.namedItem('archived') as HTMLInputElement).checked).toBe(true);
    expect((form.elements.namedItem('status') as HTMLSelectElement).value).toBe('pending');
  });
});

describe('initWizard', () => {
  function wizard(): HTMLElement {
    html`
      <div data-wizard data-wizard-current="0">
        <ol class="bo-stepper" role="list">
          <li class="bo-stepper__step" aria-current="step">One</li>
          <li class="bo-stepper__step">Two</li>
          <li class="bo-stepper__step">Three</li>
        </ol>
        <div data-wizard-panel>Panel one</div>
        <div data-wizard-panel hidden>Panel two</div>
        <div data-wizard-panel hidden>Panel three</div>
        <button type="button" data-wizard-back>Back</button>
        <button type="button" data-wizard-next>Next</button>
        <button type="submit" data-wizard-submit hidden>Submit</button>
      </div>
    `;
    ui.initWizard();
    return document.querySelector('[data-wizard]')!;
  }

  it('starts on step 0: back disabled, only the first panel visible', () => {
    const root = wizard();
    expect(root.querySelector('[data-wizard-back]')!.hasAttribute('disabled')).toBe(true);
    const panels = root.querySelectorAll('[data-wizard-panel]');
    expect((panels[0] as HTMLElement).hidden).toBe(false);
    expect((panels[1] as HTMLElement).hidden).toBe(true);
  });

  it('Next advances the panel, updates the stepper, and moves focus to the new panel', () => {
    const root = wizard();
    const steps = root.querySelectorAll('.bo-stepper__step');
    root.querySelector<HTMLElement>('[data-wizard-next]')!.click();
    const panels = root.querySelectorAll('[data-wizard-panel]');
    expect((panels[0] as HTMLElement).hidden).toBe(true);
    expect((panels[1] as HTMLElement).hidden).toBe(false);
    expect(steps[0].getAttribute('data-state')).toBe('done');
    expect(steps[1].getAttribute('aria-current')).toBe('step');
    expect(steps[0].hasAttribute('aria-current')).toBe(false);
    expect(document.activeElement).toBe(panels[1]);
  });

  it('Back retreats a step; Next on the last panel reveals Submit instead', () => {
    const root = wizard();
    const next = root.querySelector<HTMLElement>('[data-wizard-next]')!;
    next.click(); // -> step 1
    next.click(); // -> step 2 (last)
    expect(next.hidden).toBe(true);
    expect(root.querySelector('[data-wizard-submit]')!.hidden).toBe(false);
    root.querySelector<HTMLElement>('[data-wizard-back]')!.click(); // -> step 1
    expect(root.querySelectorAll('[data-wizard-panel]')[1].hasAttribute('hidden')).toBe(false);
    expect(next.hidden).toBe(false);
  });
});

describe('initQuantity', () => {
  function quantity(attrs = 'min="0" max="10" step="1" value="4"'): {
    root: HTMLElement;
    input: HTMLInputElement;
    dec: HTMLButtonElement;
    inc: HTMLButtonElement;
  } {
    html`
      <div class="bo-quantity">
        <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
        <input class="bo-quantity__input" type="number" ${attrs} />
        <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
      </div>
    `;
    ui.initQuantity();
    return {
      root: document.querySelector('.bo-quantity')!,
      input: document.querySelector('.bo-quantity__input')!,
      dec: document.querySelector('[data-quantity-step="-1"]')!,
      inc: document.querySelector('[data-quantity-step="1"]')!,
    };
  }

  it('increment/decrement buttons step the value and fire input+change', () => {
    const { input, dec, inc } = quantity();
    let changed = 0;
    input.addEventListener('change', () => changed++);
    inc.click();
    expect(input.value).toBe('5');
    dec.click();
    dec.click();
    expect(input.value).toBe('3');
    expect(changed).toBe(3);
  });

  it('clamps at min/max and disables the corresponding button once reached', () => {
    const { input, dec, inc } = quantity('min="0" max="5" step="1" value="4"');
    inc.click();
    expect(input.value).toBe('5');
    expect(inc.disabled).toBe(true); // reactively synced after the click
    inc.click();
    expect(input.value).toBe('5'); // unchanged, button is disabled
    dec.click();
    expect(inc.disabled).toBe(false); // re-enabled once off the boundary
    for (let i = 0; i < 10; i++) dec.click();
    expect(input.value).toBe('0');
    expect(dec.disabled).toBe(true);
  });

  it('respects a non-1 step', () => {
    const { input, inc } = quantity('min="0" max="20" step="5" value="0"');
    inc.click();
    expect(input.value).toBe('5');
  });

  it('fractional step never leaves floating-point artifacts (ultrareview bug_003)', () => {
    const { input, inc } = quantity('min="0" max="5" step="0.01" value="0.28"');
    inc.click();
    expect(input.value).toBe('0.29'); // not 0.29000000000000004
    const { input: input2, inc: inc2 } = (() => {
      html`
        <div class="bo-quantity">
          <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
          <input class="bo-quantity__input" type="number" min="0" max="5" step="0.1" value="0.2" />
          <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
        </div>
      `;
      return { input: document.querySelector<HTMLInputElement>('.bo-quantity__input')!, inc: document.querySelector<HTMLButtonElement>('[data-quantity-step="1"]')! };
    })();
    inc2.click();
    expect(input2.value).toBe('0.3'); // not 0.30000000000000004
    void input;
  });
});

describe('initScanInput', () => {
  function scanInput(attrs = ''): HTMLInputElement {
    html`<input class="bo-input bo-input--code" data-scan-input ${attrs} />`;
    ui.initScanInput();
    return document.querySelector('[data-scan-input]')!;
  }

  it('Enter dispatches bo:scan with the value, clears the field, and refocuses it', () => {
    const input = scanInput();
    input.focus();
    input.value = '8901234567890';
    let detail: any;
    document.addEventListener('bo:scan', (e) => { detail = (e as CustomEvent).detail; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(detail).toEqual({ value: '8901234567890' });
    expect(input.value).toBe('');
    expect(document.activeElement).toBe(input);
  });

  it('ignores Enter on an empty field (no accidental empty scans)', () => {
    const input = scanInput();
    let fired = false;
    document.addEventListener('bo:scan', () => { fired = true; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fired).toBe(false);
  });

  it('respects a custom terminator key via data-scan-terminator', () => {
    const input = scanInput('data-scan-terminator="Tab"');
    input.value = '123';
    let fired = false;
    document.addEventListener('bo:scan', () => { fired = true; }, { once: true });
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(fired).toBe(false); // wrong key for this field, ignored
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    expect(fired).toBe(true);
  });

  it('back-to-back scans work without re-focusing manually', () => {
    const input = scanInput();
    const scans: string[] = [];
    document.addEventListener('bo:scan', (e) => scans.push((e as CustomEvent).detail.value));
    input.value = 'AAA';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    input.value = 'BBB';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(scans).toEqual(['AAA', 'BBB']);
  });

  it('announces the scanned value in the linked data-scan-status element', () => {
    html`
      <input class="bo-input bo-input--code" data-scan-input aria-describedby="scan-status" />
      <p id="scan-status" data-scan-status aria-live="polite"></p>
    `;
    ui.initScanInput();
    const input = document.querySelector('[data-scan-input]') as HTMLInputElement;
    const status = document.getElementById('scan-status')!;
    input.value = '8901234567890';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(status.textContent).toBe('Scanned 8901234567890');
  });

  it('without aria-describedby, behaves exactly as before (no error, no announcement)', () => {
    const input = scanInput();
    input.value = 'AAA';
    expect(() =>
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })),
    ).not.toThrow();
  });

  it('finds the status element when aria-describedby lists multiple IDs (ultrareview bug_005)', () => {
    html`
      <input class="bo-input bo-input--code" data-scan-input aria-describedby="scan-hint scan-status" />
      <p id="scan-hint">Focus the field and scan.</p>
      <p id="scan-status" data-scan-status aria-live="polite"></p>
    `;
    ui.initScanInput();
    const input = document.querySelector('[data-scan-input]') as HTMLInputElement;
    input.value = 'ITEM-42';
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(document.getElementById('scan-status')!.textContent).toBe('Scanned ITEM-42');
    expect(document.getElementById('scan-hint')!.textContent).toBe('Focus the field and scan.');
  });
});

describe('initValidationSummary', () => {
  function form(): HTMLFormElement {
    html`
      <form data-validation-summary novalidate>
        <div class="bo-alert bo-alert--danger" data-validation-summary-box hidden role="alert">
          <p>There is a problem</p>
          <ul></ul>
        </div>
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="v-vendor">Vendor</label>
          <input class="bo-input" id="v-vendor" required />
        </div>
        <div class="bo-form-field">
          <label class="bo-form-field__label" for="v-email">Approver email</label>
          <input class="bo-input" id="v-email" type="email" required />
        </div>
        <button type="submit">Submit</button>
      </form>
    `;
    ui.initValidationSummary();
    return document.querySelector('form')!;
  }
  const submit = (f: HTMLFormElement) =>
    f.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

  it('an invalid submit is prevented, lists every invalid field, and focuses the summary first', () => {
    const f = form();
    let prevented = false;
    f.addEventListener('submit', (e) => { if (e.defaultPrevented) prevented = true; });
    submit(f);
    const box = f.querySelector('[data-validation-summary-box]') as HTMLElement;
    expect(box.hidden).toBe(false);
    const links = [...box.querySelectorAll('a')];
    expect(links.map((a) => a.textContent)).toEqual(['Vendor', 'Approver email']);
    expect(document.activeElement).toBe(box);
  });

  it('clicking a summary link focuses the exact field', () => {
    const f = form();
    submit(f);
    const link = f.querySelector('a[href="#v-email"]') as HTMLAnchorElement;
    link.click();
    expect(document.activeElement).toBe(document.getElementById('v-email'));
  });

  it('a valid form submits normally (summary never shown)', () => {
    const f = form();
    (document.getElementById('v-vendor') as HTMLInputElement).value = 'Acme';
    (document.getElementById('v-email') as HTMLInputElement).value = 'a@b.com';
    submit(f);
    const box = f.querySelector('[data-validation-summary-box]') as HTMLElement;
    expect(box.hidden).toBe(true);
  });
});

describe('initRowEdit', () => {
  function table(): HTMLTableElement {
    html`
      <table class="bo-data-table" data-row-edit>
        <tbody>
          <tr data-row-id="WIDGET-A">
            <td><input class="bo-input bo-input--seamless" value="12" /></td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    return document.querySelector('table')!;
  }

  it('typing in a row reveals its dirty badge and save/cancel, and marks data-row-state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    expect((t.querySelector('[data-row-edit-dirty]') as HTMLElement).hidden).toBe(false);
    expect((t.querySelector('[data-row-edit-save]') as HTMLElement).hidden).toBe(false);
    expect((t.querySelector('[data-row-edit-cancel]') as HTMLElement).hidden).toBe(false);
  });

  it('cancel resets the input to its last-saved value and clears dirty state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-cancel]') as HTMLElement).click();
    expect(input.value).toBe('12');
    expect(row.hasAttribute('data-row-state')).toBe(false);
    expect((t.querySelector('[data-row-edit-dirty]') as HTMLElement).hidden).toBe(true);
  });

  it('save dispatches bo:row-save with the row id and clears dirty state', () => {
    const t = table();
    const input = t.querySelector('input') as HTMLInputElement;
    const row = t.querySelector('tr') as HTMLTableRowElement;
    let detail: any = null;
    t.addEventListener('bo:row-save', (e: any) => { detail = e.detail; });
    input.value = '99';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-save]') as HTMLElement).click();
    expect(detail.rowId).toBe('WIDGET-A');
    expect(detail.row).toBe(row);
    expect(row.hasAttribute('data-row-state')).toBe(false);
    // Saved value becomes the new baseline — a later cancel reverts to it, not the original.
    input.value = '100';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    (t.querySelector('[data-row-edit-cancel]') as HTMLElement).click();
    expect(input.value).toBe('99');
  });

  it('composes with a combobox cell: committing an option marks the row dirty', () => {
    html`
      <table class="bo-data-table" data-row-edit>
        <tbody>
          <tr data-row-id="PO-1">
            <td>
              <div class="bo-combobox">
                <input class="bo-input bo-input--seamless" role="combobox" id="grid-cb"
                    aria-expanded="false" aria-controls="grid-cb-list" aria-autocomplete="list" autocomplete="off" />
                <ul class="bo-combobox__listbox" id="grid-cb-list" role="listbox" popover>
                  <li class="bo-combobox__option" role="option" id="grid-opt-1" data-value="CC-1180">CC-1180</li>
                </ul>
              </div>
            </td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initCombobox();
    const row = document.querySelector('tr') as HTMLTableRowElement;
    (document.getElementById('grid-opt-1') as HTMLElement).click();
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    expect((row.querySelector('[data-row-edit-save]') as HTMLElement).hidden).toBe(false);
  });
});

describe('initTableToolbar', () => {
  function table(): HTMLTableElement {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__toolbar">
          <input type="checkbox" data-col-toggle="cc" checked />
          <button type="button" data-table-export data-table-export-format="pdf">Export</button>
        </div>
        <table class="bo-data-table">
          <thead><tr><th data-col="no">No.</th><th data-col="cc">Cost center</th></tr></thead>
          <tbody><tr><td data-col="no">INV-1</td><td data-col="cc">CC-4021</td></tr></tbody>
        </table>
      </div>
    `;
    ui.initTableToolbar();
    return document.querySelector('table')!;
  }

  it('unchecking a column-toggle checkbox hides every cell with the matching data-col', () => {
    const t = table();
    const checkbox = document.querySelector('[data-col-toggle="cc"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const cells = [...t.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => c.hidden)).toBe(true);
    const noCells = [...t.querySelectorAll('[data-col="no"]')] as HTMLElement[];
    expect(noCells.every((c) => !c.hidden)).toBe(true);
  });

  it('re-checking the box shows the column again', () => {
    const t = table();
    const checkbox = document.querySelector('[data-col-toggle="cc"]') as HTMLInputElement;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    const cells = [...t.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => !c.hidden)).toBe(true);
  });

  it('clicking the export button dispatches bo:table-export with its configured format', () => {
    table();
    let detail: any = null;
    document.addEventListener('bo:table-export', (e: any) => { detail = e.detail; }, { once: true });
    (document.querySelector('[data-table-export]') as HTMLElement).click();
    expect(detail).toEqual({ format: 'pdf' });
  });

  it('export defaults to csv when no format is configured', () => {
    html`<button type="button" data-table-export>Export</button>`;
    ui.initTableToolbar();
    let detail: any = null;
    document.addEventListener('bo:table-export', (e: any) => { detail = e.detail; }, { once: true });
    (document.querySelector('[data-table-export]') as HTMLElement).click();
    expect(detail).toEqual({ format: 'csv' });
  });

  it('applies the initial checked state at init — a server-rendered unchecked box hides its column (ultrareview bug_013)', () => {
    html`
      <div class="bo-data-table-container">
        <input type="checkbox" data-col-toggle="cc" />
        <table class="bo-data-table">
          <thead><tr><th data-col="cc">Cost center</th></tr></thead>
          <tbody><tr><td data-col="cc">CC-4021</td></tr></tbody>
        </table>
      </div>
    `;
    ui.initTableToolbar();
    const cells = [...document.querySelectorAll('[data-col="cc"]')] as HTMLElement[];
    expect(cells.every((c) => c.hidden)).toBe(true);
  });
});

describe('initLoadMore', () => {
  it('clicking the button dispatches bo:table-load-more', () => {
    html`
      <div class="bo-data-table-container">
        <div class="bo-data-table__footer">
          <button class="bo-btn" type="button" data-table-load-more>Load more</button>
        </div>
      </div>
    `;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    const btn = document.querySelector('[data-table-load-more]') as HTMLButtonElement;
    btn.click();
    expect(fired).toBe(1);
  });

  it('a disabled button (fetch in flight) does not fire', () => {
    html`<button type="button" data-table-load-more disabled>Load more</button>`;
    ui.initLoadMore();
    let fired = 0;
    document.addEventListener('bo:table-load-more', () => fired++);
    (document.querySelector('[data-table-load-more]') as HTMLElement).click();
    expect(fired).toBe(0);
  });

  it('data-load-more-auto does not throw where IntersectionObserver is unavailable (jsdom)', () => {
    html`<button type="button" data-table-load-more data-load-more-auto>Load more</button>`;
    expect(() => ui.initLoadMore()).not.toThrow();
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

describe('initTagInput', () => {
  function container(): HTMLElement {
    html`
      <div class="bo-tag-input" role="group" aria-label="Cost centers">
        <span class="bo-tag-input__tag">CC-4021
          <button class="bo-tag-input__remove" type="button" aria-label="Remove CC-4021">×</button>
        </span>
        <input class="bo-tag-input__field" type="text" placeholder="Add…">
      </div>
    `;
    ui.initTagInput();
    return document.querySelector('.bo-tag-input')!;
  }
  const key = (el: Element, k: string) =>
    el.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));

  it('Enter with text dispatches bo:tag-add and clears the field', () => {
    const c = container();
    const field = c.querySelector('.bo-tag-input__field') as HTMLInputElement;
    let detail: any = null;
    c.addEventListener('bo:tag-add', (e: any) => { detail = e.detail; });
    field.value = 'CC-2205';
    key(field, 'Enter');
    expect(detail).toEqual({ value: 'CC-2205' });
    expect(field.value).toBe('');
  });

  it('Enter with an empty/whitespace-only field does nothing', () => {
    const c = container();
    const field = c.querySelector('.bo-tag-input__field') as HTMLInputElement;
    let fired = false;
    c.addEventListener('bo:tag-add', () => { fired = true; });
    field.value = '   ';
    key(field, 'Enter');
    expect(fired).toBe(false);
  });

  it('clicking a tag\'s remove button dispatches bo:tag-remove and removes it', () => {
    const c = container();
    let detail: any = null;
    c.addEventListener('bo:tag-remove', (e: any) => { detail = e.detail; });
    (c.querySelector('.bo-tag-input__remove') as HTMLElement).click();
    expect(detail).toEqual({ value: 'CC-4021' });
    expect(c.querySelector('.bo-tag-input__tag')).toBeNull();
  });

  it('Backspace in an empty field removes the last tag; a non-empty field is untouched', () => {
    const c = container();
    const field = c.querySelector('.bo-tag-input__field') as HTMLInputElement;
    let detail: any = null;
    c.addEventListener('bo:tag-remove', (e: any) => { detail = e.detail; });

    field.value = 'partial';
    key(field, 'Backspace');
    expect(detail).toBeNull();
    expect(c.querySelector('.bo-tag-input__tag')).not.toBeNull();

    field.value = '';
    key(field, 'Backspace');
    expect(detail).toEqual({ value: 'CC-4021' });
    expect(c.querySelector('.bo-tag-input__tag')).toBeNull();
  });
});

describe('initRowEdit advanced cells + save models (Slice 18 item 4)', () => {
  function advancedTable(mode = ''): { table: HTMLElement; row: HTMLElement } {
    html`
      <table data-row-edit${mode ? `="${mode}"` : ''}>
        <tbody>
          <tr data-row-id="A-1">
            <td><input name="qty" type="number" step="0.01" value="2.50" aria-label="Qty" /></td>
            <td><select name="status" aria-label="Status">
              <option selected>Open</option><option>Closed</option>
            </select></td>
            <td><input name="urgent" type="checkbox" aria-label="Urgent" /></td>
            <td><input name="due" type="date" value="2026-08-20" aria-label="Due" /></td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
        <tfoot><tr><td data-sum-of="qty">2.50</td></tr></tfoot>
      </table>
    `;
    ui.initRowEdit();
    ui.initTableSum();
    return { table: document.querySelector('table')!, row: document.querySelector('tbody tr')! };
  }

  it('bo:cell-change carries rowId/field/value for input, select, and checkbox', () => {
    const { row } = advancedTable();
    const seen: any[] = [];
    row.addEventListener('bo:cell-change', (e: any) => seen.push(e.detail));

    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '3.00';
    qty.dispatchEvent(new Event('input', { bubbles: true }));

    const status = row.querySelector<HTMLSelectElement>('[name="status"]')!;
    status.value = 'Closed';
    status.dispatchEvent(new Event('change', { bubbles: true }));

    const urgent = row.querySelector<HTMLInputElement>('[name="urgent"]')!;
    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));

    expect(seen).toEqual([
      { rowId: 'A-1', field: 'qty', value: '3.00' },
      { rowId: 'A-1', field: 'status', value: 'Closed' },
      { rowId: 'A-1', field: 'urgent', value: true },
    ]);
  });

  it('checkbox + date cells: dirty, Cancel restores checked/value, Save baselines', () => {
    const { row } = advancedTable();
    const urgent = row.querySelector<HTMLInputElement>('[name="urgent"]')!;
    const due = row.querySelector<HTMLInputElement>('[name="due"]')!;

    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));
    due.value = '2026-09-01';
    due.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');

    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(urgent.checked).toBe(false);
    expect(due.value).toBe('2026-08-20');

    urgent.checked = true;
    urgent.dispatchEvent(new Event('input', { bubbles: true }));
    row.querySelector<HTMLElement>('[data-row-edit-save]')!.click();
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click(); // no-op reset
    expect(urgent.checked).toBe(true); // saved baseline sticks
  });

  it('data-sum-of recomputes in realtime, and Cancel-restores recompute it too', () => {
    const { table, row } = advancedTable();
    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '4.25';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    expect(table.querySelector('[data-sum-of="qty"]')!.textContent).toBe('4.25');
    // the stale-total bug the live check caught: reset must be announced
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(table.querySelector('[data-sum-of="qty"]')!.textContent).toBe('2.50');
  });

  it('live mode: a committed change dispatches bo:row-save + re-baselines, no dirty UI', async () => {
    const { row } = advancedTable('live');
    const saves: any[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));

    const status = row.querySelector<HTMLSelectElement>('[name="status"]')!;
    status.value = 'Closed';
    status.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve(); // live saves are microtask-deferred (Slice 19 item 2)
    expect(saves).toEqual(['A-1']);
    expect(row.hasAttribute('data-row-state')).toBe(false);
    // baseline moved: cancel-equivalent reset would keep Closed
    expect([...status.options].find((o) => o.defaultSelected)!.text).toBe('Closed');
  });

  it('bo:row-cancel fires after native fields restore (consumer chips restore hook)', () => {
    const { row } = advancedTable();
    const qty = row.querySelector<HTMLInputElement>('[name="qty"]')!;
    qty.value = '9.99';
    qty.dispatchEvent(new Event('input', { bubbles: true }));
    let cancelled: any = null;
    let valueAtCancel = '';
    row.addEventListener('bo:row-cancel', (e: any) => {
      cancelled = e.detail.rowId;
      valueAtCancel = qty.value;
    });
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    expect(cancelled).toBe('A-1');
    expect(valueAtCancel).toBe('2.50'); // already restored when the event fired
  });

  it('tag events mark a batch row dirty; live mode saves after a microtask', async () => {
    html`
      <table data-row-edit="live">
        <tbody><tr data-row-id="T-1"><td>
          <div class="bo-tag-input">
            <span class="bo-tag-input__tag">CC-1<button class="bo-tag-input__remove" type="button" aria-label="Remove CC-1">×</button></span>
            <input class="bo-tag-input__field" type="text" aria-label="Cost centers" />
          </div>
        </td></tr></tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initTagInput();
    const row = document.querySelector('tbody tr')!;
    const saves: any[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    (document.querySelector('.bo-tag-input__remove') as HTMLElement).click();
    expect(saves).toEqual([]); // deferred
    await Promise.resolve();
    expect(saves).toEqual(['T-1']);
  });
});

describe('initRowEdit live-mode save integrity (Slice 19 item 2, grill E3/H3)', () => {
  function liveMoneyRow(): { row: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement; notes: HTMLInputElement } {
    html`
      <table data-row-edit="live">
        <tbody>
          <tr data-row-id="LV-1">
            <td>
              <div class="bo-money">
                <select class="bo-select bo-money__currency" aria-label="Currency">
                  <option selected>USD</option>
                  <option>JPY</option>
                </select>
                <input class="bo-input bo-money__amount" type="number" step="0.01" value="1250.00" aria-label="Amount" />
              </div>
            </td>
            <td><input name="notes" value="original" aria-label="Notes" /></td>
            <td>
              <!-- docs suggest omitting these in live mode; nothing enforces it -->
              <button type="button" data-row-edit-cancel>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initMoneyField();
    return {
      row: document.querySelector('tbody tr')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
      notes: document.querySelector('[name="notes"]')!,
    };
  }

  it('Cancel on a live table never fires a save; every field restores (Cancel-becomes-Save bug)', async () => {
    const { row, select, amount, notes } = liveMoneyRow();
    // mid-edit state: fields differ from their baselines with NO committed
    // change yet (typing in progress / consumer-set values) — the exact
    // precondition under which Cancel's select-restore change fired a save
    notes.value = 'edited';
    amount.value = '999.00';
    select.value = 'JPY';
    const saves: string[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    row.querySelector<HTMLElement>('[data-row-edit-cancel]')!.click();
    await Promise.resolve();
    expect(saves).toEqual([]); // the select-reset change must NOT save mid-cancel
    expect(select.value).toBe('USD');
    expect(notes.value).toBe('original'); // restored, not baselined-away
  });

  it('live save carries the post-reformat value (save-before-reformat bug)', async () => {
    const { row, select, amount } = liveMoneyRow();
    let valueAtSave: string | null = null;
    row.addEventListener('bo:row-save', () => { valueAtSave = amount.value; });
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve(); // deferred save
    expect(valueAtSave).toBe('1250'); // trimmed by the reformat BEFORE the save read it
  });

  it('same-tick changes coalesce into one save', async () => {
    const { row, select, notes } = liveMoneyRow();
    const saves: string[] = [];
    row.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    notes.dispatchEvent(new Event('change', { bubbles: true }));
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await Promise.resolve();
    expect(saves).toEqual(['LV-1']);
  });

  it('a row detached in the same tick is never saved or mutated (lost-save guard)', async () => {
    const { row, notes } = liveMoneyRow();
    const saves: string[] = [];
    document.addEventListener('bo:row-save', (e: any) => saves.push(e.detail.rowId));
    notes.value = 'edited';
    notes.dispatchEvent(new Event('change', { bubbles: true }));
    row.remove(); // consumer removes the line in the same tick
    await Promise.resolve();
    expect(saves).toEqual([]);
    expect(notes.defaultValue).toBe('original'); // detached row must not be baselined
  });
});

describe('initRowEdit + money cell composition (Slice 18 item 3)', () => {
  function editableMoneyRow(): { row: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement; save: HTMLElement; cancel: HTMLElement } {
    html`
      <table data-row-edit>
        <tbody>
          <tr data-row-id="L-1">
            <td>
              <div class="bo-money">
                <select class="bo-select bo-money__currency" aria-label="Currency">
                  <option selected>USD</option>
                  <option>JPY</option>
                </select>
                <input class="bo-input bo-money__amount" type="number" step="0.01" value="1250.00" aria-label="Amount" />
              </div>
            </td>
            <td>
              <span data-row-edit-dirty hidden>Unsaved</span>
              <button type="button" data-row-edit-save hidden>Save</button>
              <button type="button" data-row-edit-cancel hidden>Cancel</button>
            </td>
          </tr>
        </tbody>
      </table>
    `;
    ui.initRowEdit();
    ui.initMoneyField();
    return {
      row: document.querySelector('tr')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
      save: document.querySelector('[data-row-edit-save]')!,
      cancel: document.querySelector('[data-row-edit-cancel]')!,
    };
  }

  it('currency change marks the row dirty; Cancel restores selection, value AND step', () => {
    const { row, select, amount, cancel } = editableMoneyRow();
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty'); // via the change listener (jsdom fires no input for selects)
    expect(amount.value).toBe('1250'); // reformatted to 0 decimals
    expect(amount.step).toBe('1');

    cancel.click();
    expect(row.hasAttribute('data-row-state')).toBe(false);
    expect(select.value).toBe('USD');
    expect(amount.value).toBe('1250.00'); // defaultValue restored
    expect(amount.step).toBe('0.01'); // re-derived from the restored currency
  });

  it('Save re-baselines the select — a later Cancel keeps the saved currency', () => {
    const { row, select, amount, save, cancel } = editableMoneyRow();
    select.value = 'JPY';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    save.click();
    expect(row.hasAttribute('data-row-state')).toBe(false);

    amount.value = '900';
    amount.dispatchEvent(new Event('input', { bubbles: true }));
    expect(row.getAttribute('data-row-state')).toBe('dirty');
    cancel.click();
    expect(select.value).toBe('JPY'); // saved baseline, not the original USD
    expect(amount.value).toBe('1250'); // the value saved alongside it
  });
});

describe('initQuantity unit select (embedded unit table)', () => {
  function unitQuantity(opts = ''): { root: HTMLElement; select: HTMLSelectElement; input: HTMLInputElement } {
    html`
      <div class="bo-quantity" ${opts}>
        <button class="bo-quantity__step" type="button" data-quantity-step="-1" aria-label="Decrease">−</button>
        <input class="bo-quantity__input" type="number" min="0" step="0.01" value="2.5" aria-label="Quantity" />
        <button class="bo-quantity__step" type="button" data-quantity-step="1" aria-label="Increase">+</button>
        <select class="bo-select bo-quantity__unit-select" aria-label="Unit">
          <option>kg</option>
          <option>each</option>
          <option>mg</option>
          <option data-decimals="4">kg — lab</option>
        </select>
      </div>
    `;
    ui.initQuantity();
    return {
      root: document.querySelector('.bo-quantity')!,
      select: document.querySelector('.bo-quantity__unit-select')!,
      input: document.querySelector('.bo-quantity__input')!,
    };
  }

  function pick(select: HTMLSelectElement, value: string): void {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  it('unit change adjusts step; value only reformats losslessly (Slice 19 grill fix)', () => {
    const { select, input } = unitQuantity();
    pick(select, 'each');
    expect(input.step).toBe('1');
    expect(input.value).toBe('2.5'); // 2.5 does NOT fit 0 decimals → untouched, never rounds
    pick(select, 'mg');
    expect(input.step).toBe('0.001');
    expect(input.value).toBe('2.500'); // pad — lossless
  });

  it('unknown units leave precision entirely alone; override still wins', () => {
    const { select, input } = unitQuantity();
    // inject an unknown master-data-style unit code
    const opt = document.createElement('option');
    opt.textContent = 'MT';
    select.append(opt);
    pick(select, 'MT');
    expect(input.step).toBe('0.01'); // untouched — unknown unit, no opinion
    expect(input.value).toBe('2.5');
    expect(ui.unitDecimals('bundle-of-widgets')).toBeUndefined();
    expect(ui.unitDecimals(' KG ')).toBe(2);
    expect(ui.unitDecimals('hr')).toBe(2);
    pick(select, 'kg — lab'); // data-decimals=4 (value-based select: jsdom's selectedIndex setter is unreliable post-value-set)
    expect(input.step).toBe('0.0001');
    expect(input.value).toBe('2.5000');
  });
});

describe('initMoneyField', () => {
  function money(opts = ''): { root: HTMLElement; select: HTMLSelectElement; amount: HTMLInputElement } {
    html`
      <div class="bo-money" ${opts}>
        <select class="bo-select bo-money__currency" aria-label="Currency">
          <option>USD</option>
          <option>JPY</option>
          <option>BHD</option>
          <option data-decimals="4">USD-4</option>
        </select>
        <input class="bo-input bo-input--numeric bo-money__amount" type="number" step="0.01" value="1234.5" aria-label="Amount" />
      </div>
    `;
    ui.initMoneyField();
    return {
      root: document.querySelector('.bo-money')!,
      select: document.querySelector('.bo-money__currency')!,
      amount: document.querySelector('.bo-money__amount')!,
    };
  }

  function pick(select: HTMLSelectElement, value: string): void {
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }

  it('reformats ONLY losslessly: pads/trims, never rounds (Slice 19 grill fix)', () => {
    const { select, amount } = money();
    pick(select, 'JPY');
    expect(amount.step).toBe('1');
    expect(amount.value).toBe('1234.5'); // does NOT fit 0 decimals → value untouched
    pick(select, 'BHD');
    expect(amount.step).toBe('0.001');
    expect(amount.value).toBe('1234.500'); // pad — numerically identical, applies
    pick(select, 'JPY');
    expect(amount.value).toBe('1234.500'); // still lossy → untouched again
    amount.value = '1250.00';
    pick(select, 'USD');
    pick(select, 'JPY');
    expect(amount.value).toBe('1250'); // trim — lossless, applies
  });

  it('data-decimals on the selected option overrides the table (lossless pad)', () => {
    const { select, amount } = money();
    pick(select, 'USD-4');
    expect(amount.step).toBe('0.0001');
    expect(amount.value).toBe('1234.5000');
  });

  it('container override still never rounds a non-fitting value', () => {
    const { select, amount } = money('data-decimals="0"');
    pick(select, 'USD'); // table says 2, container says 0 — but 1234.5 doesn't fit 0
    expect(amount.step).toBe('1');
    expect(amount.value).toBe('1234.5');
  });

  it('lossless reformat dispatches input; skipped (lossy) reformat does not', () => {
    const { root, select, amount } = money();
    let inputs = 0;
    root.addEventListener('input', () => inputs++);
    pick(select, 'JPY'); // lossy → skipped → no synthetic input
    expect(inputs).toBe(0);
    pick(select, 'BHD'); // pad 1234.5 → 1234.500 → input
    expect(inputs).toBe(1);
    pick(select, 'BHD'); // no change → no input
    expect(inputs).toBe(1);
    amount.value = '9e21'; // beyond safe range → always left alone
    pick(select, 'USD');
    expect(amount.value).toBe('9e21');
    expect(inputs).toBe(1);
  });

  it('currencyDecimals is exported and case/space tolerant', () => {
    expect(ui.currencyDecimals('jpy')).toBe(0);
    expect(ui.currencyDecimals(' KWD ')).toBe(3);
    expect(ui.currencyDecimals('THB')).toBe(2);
    expect(ui.currencyDecimals('CLF')).toBe(4);
  });
});
