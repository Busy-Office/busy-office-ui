/**
 * Multi-step wizard flow — one panel visible at a time, with a bo-stepper
 * kept in sync. Document-level delegation — call initWizard() once.
 *
 * Markup contract:
 *   <div data-wizard data-wizard-current="0">
 *     <ol class="bo-stepper" role="list">
 *       <li class="bo-stepper__step" aria-current="step">…</li>  <!-- one per panel, same order -->
 *       …
 *     </ol>
 *     <div data-wizard-panel>…</div>   <!-- one per step, same order; all but the first [hidden] -->
 *     …
 *     <button type="button" data-wizard-back>Back</button>
 *     <button type="button" data-wizard-next>Next</button>
 *     <button type="submit" data-wizard-submit hidden>Submit</button>
 *   </div>
 * Steps before the current index get data-state="done"; the current step
 * gets aria-current="step"; steps after get neither.
 */
let installed = false;

function show(root: HTMLElement, index: number, moveFocus = true): void {
  const steps = Array.from(root.querySelectorAll<HTMLElement>('.bo-stepper__step'));
  const panels = Array.from(root.querySelectorAll<HTMLElement>('[data-wizard-panel]'));
  const clamped = Math.max(0, Math.min(index, panels.length - 1));

  steps.forEach((step, i) => {
    step.removeAttribute('aria-current');
    delete step.dataset.state;
    if (i < clamped) step.dataset.state = 'done';
    else if (i === clamped) step.setAttribute('aria-current', 'step');
  });

  panels.forEach((panel, i) => {
    panel.hidden = i !== clamped;
  });

  root.dataset.wizardCurrent = String(clamped);

  const back = root.querySelector<HTMLButtonElement>('[data-wizard-back]');
  const next = root.querySelector<HTMLButtonElement>('[data-wizard-next]');
  const submit = root.querySelector<HTMLButtonElement>('[data-wizard-submit]');
  if (back) back.disabled = clamped === 0;
  const last = clamped === panels.length - 1;
  if (next) next.hidden = last;
  if (submit) submit.hidden = !last;

  if (moveFocus) {
    const activePanel = panels[clamped];
    if (activePanel) {
      if (!activePanel.hasAttribute('tabindex')) activePanel.tabIndex = -1;
      activePanel.focus();
    }
  }
}

export function initWizard(): void {
  if (!installed) {
    installed = true;
    document.addEventListener('click', (e) => {
      const trigger = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-wizard-next], [data-wizard-back]',
      );
      if (!trigger) return;
      const root = trigger.closest<HTMLElement>('[data-wizard]');
      if (!root) return;
      const current = Number(root.dataset.wizardCurrent ?? '0');
      show(root, trigger.hasAttribute('data-wizard-next') ? current + 1 : current - 1);
    });
  }

  // The normalization pass runs on EVERY call — it's a pure re-derivation
  // from data-wizard-current, and a wizard swapped in after the first call
  // (hx-boost revisit, client-side mount) needs it to disable Back at
  // step 0. Only the document listener above is install-once.
  document.querySelectorAll<HTMLElement>('[data-wizard]').forEach((root) => {
    show(root, Number(root.dataset.wizardCurrent ?? '0'), false);
  });
}
