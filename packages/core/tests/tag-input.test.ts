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

  /* Removal focus (roadmap 373.4, tag-input subset). Removing the chip that
     holds focus used to drop it to <body>. These cover the conditional and
     the event order; the BROWSER half — real Enter on the remove button,
     which no synthetic dispatch stands in for — is in check-claims.mjs. */

  function twoTags(): HTMLElement {
    html`
      <div class="bo-tag-input" role="group" aria-label="Cost centers">
        <span class="bo-tag-input__tag">CC-4021
          <button class="bo-tag-input__remove" type="button" aria-label="Remove CC-4021">×</button>
        </span>
        <span class="bo-tag-input__tag">CC-2205
          <button class="bo-tag-input__remove" type="button" aria-label="Remove CC-2205">×</button>
        </span>
        <input class="bo-tag-input__field" type="text" placeholder="Add…">
      </div>
      <button id="outside" type="button">Elsewhere</button>
    `;
    ui.initTagInput();
    return document.querySelector('.bo-tag-input')!;
  }

  it('removing the chip that HOLDS focus moves focus to that group\'s field', () => {
    const c = twoTags();
    const btn = c.querySelector('.bo-tag-input__remove') as HTMLElement;
    btn.focus();
    expect(document.activeElement).toBe(btn);
    btn.click();
    expect(document.activeElement).toBe(c.querySelector('.bo-tag-input__field'));
    expect(c.querySelectorAll('.bo-tag-input__tag')).toHaveLength(1);
  });

  it('removing an UNFOCUSED chip leaves focus exactly where it was', () => {
    const c = twoTags();
    const outside = document.getElementById('outside') as HTMLElement;
    outside.focus();
    // second chip removed programmatically; focus is nowhere near it
    (c.querySelectorAll('.bo-tag-input__remove')[1] as HTMLElement).click();
    expect(document.activeElement).toBe(outside);
    expect(c.querySelectorAll('.bo-tag-input__tag')).toHaveLength(1);
  });

  it('an already focused field is preserved, not re-focused, by an unfocused removal', () => {
    const c = twoTags();
    const field = c.querySelector('.bo-tag-input__field') as HTMLInputElement;
    field.focus();
    (c.querySelector('.bo-tag-input__remove') as HTMLElement).click();
    expect(document.activeElement).toBe(field);
  });

  it('a consumer that moves focus during bo:tag-remove is not overridden', () => {
    const c = twoTags();
    const outside = document.getElementById('outside') as HTMLElement;
    const btn = c.querySelector('.bo-tag-input__remove') as HTMLElement;
    btn.focus();
    c.addEventListener('bo:tag-remove', () => outside.focus());
    btn.click();
    expect(document.activeElement).toBe(outside);
  });

  it('Backspace in an empty field keeps focus in the field', () => {
    const c = twoTags();
    const field = c.querySelector('.bo-tag-input__field') as HTMLInputElement;
    field.focus();
    field.value = '';
    key(field, 'Backspace');
    expect(c.querySelectorAll('.bo-tag-input__tag')).toHaveLength(1);
    expect(document.activeElement).toBe(field);
  });

  it('bo:tag-remove still fires BEFORE disconnection, bubbling, with the value', () => {
    const c = twoTags();
    const seen: Array<{ connected: boolean; value: string; target: string; bubbles: boolean }> = [];
    // listener on document proves it still bubbles all the way up
    document.addEventListener('bo:tag-remove', (e: any) => {
      seen.push({ connected: e.target.isConnected, value: e.detail.value,
        target: e.target.className, bubbles: e.bubbles });
    }, { once: true });
    (c.querySelector('.bo-tag-input__remove') as HTMLElement).click();
    expect(seen).toEqual([{ connected: true, value: 'CC-4021', target: 'bo-tag-input__tag', bubbles: true }]);
  });

  it('removal focus stays inside the SAME group when two groups are present', () => {
    html`
      <div class="bo-tag-input" id="g1" role="group" aria-label="One">
        <span class="bo-tag-input__tag">A
          <button class="bo-tag-input__remove" type="button" aria-label="Remove A">×</button>
        </span>
        <input class="bo-tag-input__field" id="f1" type="text">
      </div>
      <div class="bo-tag-input" id="g2" role="group" aria-label="Two">
        <span class="bo-tag-input__tag">B
          <button class="bo-tag-input__remove" type="button" aria-label="Remove B">×</button>
        </span>
        <input class="bo-tag-input__field" id="f2" type="text">
      </div>
    `;
    ui.initTagInput();
    const btn = document.querySelector('#g1 .bo-tag-input__remove') as HTMLElement;
    btn.focus();
    btn.click();
    expect(document.activeElement).toBe(document.getElementById('f1'));
    expect(document.querySelectorAll('#g2 .bo-tag-input__tag')).toHaveLength(1);
  });
});
