import { trapFocus } from '../utils/focus-trap.js';

/**
 * Dialog behavior via event delegation — no per-element binding, no DOM
 * flags. Survives every HTMX swap pattern: dialogs swapped without their
 * trigger, triggers rendered before their dialog exists, and clone/morph
 * swaps. The dialog is looked up at CLICK time, and its own listeners are
 * attached lazily on first open, tracked in a WeakSet (garbage-collected
 * with the node, never serialized into the DOM).
 *
 * Call initDialogs() once; calling again is a no-op. No re-init needed after
 * HTMX swaps.
 */
const boundDialogs = new WeakSet<HTMLDialogElement>();
let delegationInstalled = false;

function bindDialog(dialog: HTMLDialogElement): void {
  if (boundDialogs.has(dialog)) return;
  boundDialogs.add(dialog);
  dialog.addEventListener('close', () => {
    dialog.dataset.state = 'closed';
  });
  dialog.addEventListener('keydown', trapFocus);
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog && dialog.dataset.dismissible !== 'false') {
      dialog.close('dismiss');
    }
  });
}

export function initDialogs(): void {
  if (delegationInstalled) return;
  delegationInstalled = true;
  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>(
      '[data-dialog-trigger]',
    );
    if (!trigger) return;
    const dialog = document.getElementById(
      trigger.dataset.dialogTrigger!,
    ) as HTMLDialogElement | null;
    if (!dialog || typeof dialog.showModal !== 'function') return;
    if (dialog.open) return;
    bindDialog(dialog);
    dialog.dataset.state = 'open';
    dialog.showModal();
  });
}
