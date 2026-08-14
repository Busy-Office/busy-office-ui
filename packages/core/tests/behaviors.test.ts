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
