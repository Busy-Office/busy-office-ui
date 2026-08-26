/**
 * Shared setup for the behavior tests, split out of one 2,350-line file
 * (roadmap 148.1, external review §21): one file per behavior, so changing
 * one behavior no longer means loading the other thirty.
 *
 * Behavior tests run against the COMPILED dist (test what ships).
 * `npm run build:js` must run before `npm test` — CI does; the local test
 * script does too via pretest.
 */
import { vi } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';

export function html(strings: TemplateStringsArray, ...vals: unknown[]): void {
  document.body.innerHTML = String.raw(strings, ...vals);
}

/** jsdom lacks showModal/close — emulate the open/close+event contract the
 *  code relies on. */
export function stubShowModal(dialog: HTMLDialogElement) {
  dialog.showModal = () => {
    dialog.open = true;
  };
  dialog.close = () => {
    dialog.open = false;
    dialog.dispatchEvent(new Event('close'));
  };
  return vi.spyOn(dialog, 'showModal');
}


export function pick(select: HTMLSelectElement, value: string): void {
  select.value = value;
  select.dispatchEvent(new Event('change', { bubbles: true }));
}
