import { beforeEach, describe, expect, it } from 'vitest';
// @ts-expect-error — importing the built artifact on purpose
import * as ui from '../dist/js/index.js';
import { html, stubShowModal } from './helpers.js';

beforeEach(() => {
  document.body.innerHTML = '';
});

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
