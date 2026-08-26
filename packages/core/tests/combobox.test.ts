import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
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

  /* --- roadmap 24.2: rich rows, recents-first, group headings --- */

  function richCombobox(openOnFocus: boolean): { input: HTMLInputElement; listbox: HTMLElement } {
    html`
      <div class="bo-combobox"${openOnFocus ? ' data-open-on-focus' : ''}>
        <input class="bo-input" type="text" role="combobox" id="rb-input"
            aria-expanded="false" aria-controls="rb-list" aria-autocomplete="list" autocomplete="off" />
        <ul class="bo-combobox__listbox" id="rb-list" role="listbox" popover>
          <li class="bo-combobox__group" role="presentation">Recent</li>
          <li class="bo-combobox__option" role="option" id="rb-opt-1" data-value="CC-1180">
            <span class="bo-combobox__option-code">CC-1180</span>
            <span class="bo-combobox__option-label">Warehouse Hamburg</span>
            <span class="bo-combobox__option-meta">Logistics</span>
          </li>
          <li class="bo-combobox__option" role="option" id="rb-opt-2" data-value="CC-4021">
            <span class="bo-combobox__option-code">CC-4021</span>
            <span class="bo-combobox__option-label">Assembly Line 2</span>
            <span class="bo-combobox__option-meta">Production</span>
          </li>
        </ul>
      </div>
    `;
    ui.initCombobox();
    return {
      input: document.getElementById('rb-input') as HTMLInputElement,
      listbox: document.getElementById('rb-list') as HTMLElement,
    };
  }

  it('commits the LABEL part of a rich row, not the whole row text', () => {
    const { input, listbox } = richCombobox(false);
    type(input, 'Hamburg');
    key(input, 'ArrowDown');
    key(input, 'Enter');
    // Not "CC-1180 Warehouse Hamburg Logistics"
    expect(input.value).toBe('Warehouse Hamburg');
    const hidden = listbox.closest('.bo-combobox')!.querySelector('input[type="hidden"][data-bo-value]');
    expect(hidden).toBeNull(); // no data-name on this widget, so no hidden input
  });

  it('a rich row is findable by its code OR its meta, not just its label', () => {
    const { input, listbox } = richCombobox(false);
    const shown = () =>
      [...listbox.querySelectorAll('[role="option"]')].filter((o) => !(o as HTMLElement).hidden).length;
    type(input, '4021');       // the code
    expect(shown()).toBe(1);
    type(input, 'Production'); // the meta column
    expect(shown()).toBe(1);
  });

  it('data-open-on-focus shows server-supplied recents before any keystroke', () => {
    const { input } = richCombobox(true);
    expect(input.getAttribute('aria-expanded')).toBe('false');
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  it('without the opt-in, focus does NOT open the list', () => {
    const { input } = richCombobox(false);
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('the group heading is hidden once filtering starts, and is never an arrow stop', () => {
    const { input, listbox } = richCombobox(true);
    const group = listbox.querySelector('.bo-combobox__group') as HTMLElement;
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(group.hidden).toBe(false);
    type(input, 'Hamburg');
    expect(group.hidden).toBe(true);
    // arrow keys land on a real option, never the heading
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe('rb-opt-1');
  });

  it('scrolling FOLLOWS the focused field instead of closing the list', () => {
    // The live bug: .focus() scrolls an off-screen field into view, and that
    // scroll used to close the list focus had just opened. jsdom never
    // scrolls and reports a zero rect, so the viewport check is stubbed.
    const { input, listbox } = richCombobox(true);
    input.getBoundingClientRect = () =>
      ({ top: 100, bottom: 130, left: 0, right: 200, width: 200, height: 30 }) as DOMRect;
    input.focus();
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    window.dispatchEvent(new Event('scroll'));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    expect(listbox.getAttribute('data-bo-open')).toBe('true');
  });

  it('scrolling the field OUT of view still closes the list', () => {
    const { input, listbox } = richCombobox(true);
    input.getBoundingClientRect = () =>
      ({ top: 100, bottom: 130, left: 0, right: 200, width: 200, height: 30 }) as DOMRect;
    input.focus();
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.getAttribute('aria-expanded')).toBe('true');
    // now off the top of the viewport
    input.getBoundingClientRect = () =>
      ({ top: -200, bottom: -170, left: 0, right: 200, width: 200, height: 30 }) as DOMRect;
    window.dispatchEvent(new Event('scroll'));
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(listbox.getAttribute('data-bo-open')).not.toBe('true');
  });

  it('typing filters options case-insensitively and opens the list', () => {
    const { input, listbox } = combobox();
    type(input, '2205');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const hidden = [...listbox.querySelectorAll('[role="option"]')].map((o) => (o as HTMLElement).hidden);
    expect(hidden).toEqual([true, false, true]);
  });

  // --- owner combobox test report, 2026-08-16: five confirmed bugs ---
  it('Enter with the list open but nothing active does not submit the form', () => {
    const { input } = combobox();
    type(input, 'CC');
    expect(input.getAttribute('aria-expanded')).toBe('true');
    const ev = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
    input.dispatchEvent(ev);
    // must be swallowed: otherwise the enclosing <form> submits and the
    // user loses their typed filter (report 3.1, high)
    expect(ev.defaultPrevented).toBe(true);
  });

  it('focusout closes the list and clears the active option', () => {
    const { input, listbox } = combobox();
    type(input, 'CC');
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
    input.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: document.body }));
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    expect(listbox.dataset.boOpen).not.toBe('true');
  });

  it('clicking an option returns focus to the input', () => {
    const { input, listbox } = combobox();
    type(input, 'CC');
    const opt = listbox.querySelector('#cb-opt-2') as HTMLElement;
    opt.click();
    expect(document.activeElement).toBe(input);
  });

  it('aria-disabled options are skipped by arrows and reject commit', () => {
    const { input, listbox } = combobox();
    const disabled = listbox.querySelector('#cb-opt-2') as HTMLElement;
    disabled.setAttribute('aria-disabled', 'true');
    type(input, 'CC');
    key(input, 'ArrowDown');
    key(input, 'ArrowDown');
    // second option is disabled -> the active option must skip to the third
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-3');
    const fired: string[] = [];
    input.addEventListener('bo:combobox-select', (e) => fired.push((e as CustomEvent).detail.value));
    disabled.click();
    expect(fired).toEqual([]);
    expect(input.value).not.toBe('CC-2205');
  });

  it('options without an id never yield an empty aria-activedescendant', () => {
    const { input, listbox } = combobox();
    listbox.querySelectorAll('[role="option"]').forEach((o) => o.removeAttribute('id'));
    type(input, 'CC');
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBeTruthy();
  });

  // --- owner report §4: the four gaps accepted per the Objective ---
  it('data-name mirrors the committed machine value into a hidden input', () => {
    const { input, listbox } = combobox();
    (input.closest('.bo-combobox') as HTMLElement).dataset.name = 'cost_center';
    type(input, 'CC');
    key(input, 'ArrowDown');
    key(input, 'Enter');
    const hidden = input.closest('.bo-combobox')!.querySelector('input[type="hidden"]') as HTMLInputElement;
    expect(hidden).toBeTruthy();
    expect(hidden.name).toBe('cost_center');
    expect(hidden.value).toBe('CC-1180'); // data-value, not the display text
  });

  it('focusing a committed field selects its text so the next keystroke browses', () => {
    const { input, listbox } = combobox();
    type(input, 'CC');
    key(input, 'ArrowDown');
    key(input, 'Enter');
    expect(input.value).toBe('CC-1180');
    input.dispatchEvent(new FocusEvent('focusin', { bubbles: true }));
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(input.value.length);
  });

  it('announces the result count in a live region', () => {
    const { input } = combobox();
    type(input, 'CC');
    const status = input.closest('.bo-combobox')!.querySelector('[role="status"]') as HTMLElement;
    expect(status).toBeTruthy();
    expect(status.textContent).toMatch(/3/);
    type(input, 'zzz');
    expect(status.textContent).toMatch(/no|0/i);
  });

  it('pointer movement over an option makes it the active option', () => {
    const { input, listbox } = combobox();
    type(input, 'CC');
    key(input, 'ArrowDown');
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-1');
    const third = listbox.querySelector('#cb-opt-3') as HTMLElement;
    third.dispatchEvent(new MouseEvent('pointermove', { bubbles: true }));
    expect(input.getAttribute('aria-activedescendant')).toBe('cb-opt-3');
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
