import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
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
