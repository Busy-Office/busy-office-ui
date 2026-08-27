/**
 * Inline validation summary. On submit, if the form is invalid, prevent
 * submission, list every invalid field as a link, and move focus to the
 * SUMMARY first — not straight into the first field. WCAG/GOV.UK
 * precedent: a screen-reader user hears the overview before jumping into
 * any one field. Each link click focuses its field.
 *
 * Markup contract:
 *   <form data-validation-summary>
 *     <div class="bo-alert bo-alert--danger" data-validation-summary-box hidden role="alert">
 *       <p>There is a problem</p>
 *       <ul></ul>
 *     </div>
 *     ...fields with a <label for="id">
 *   </form>
 */
import { reveal } from '../utils/reveal.js';

let installed = false;

function fieldLabel(field: HTMLElement): string {
  const id = field.id;
  const label = id ? document.querySelector(`label[for="${id}"]`) : null;
  return label?.textContent?.trim() || field.getAttribute('aria-label') || id || 'Field';
}

export function initValidationSummary(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('submit', (e) => {
    const form = e.target as HTMLFormElement;
    if (!form.matches('[data-validation-summary]')) return;
    if (form.checkValidity()) return;
    e.preventDefault();

    const box = form.querySelector<HTMLElement>('[data-validation-summary-box]');
    const list = box?.querySelector('ul');
    if (!box || !list) return;

    // `:invalid` also matches a <fieldset> wrapping an invalid control (a
    // real browser behavior, not present in every test environment) —
    // scope to actual fields so the summary doesn't list the fieldset
    // itself as an unlabeled "Field".
    const invalid = [...form.querySelectorAll<HTMLElement>('input:invalid, select:invalid, textarea:invalid')];
    list.innerHTML = '';
    invalid.forEach((field) => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `#${field.id}`;
      a.textContent = fieldLabel(field);
      a.addEventListener('click', (ev) => {
        ev.preventDefault();
        // Open whatever is hiding it first. A required field inside an
        // inactive tab, a closed <details> or a collapsed widget still blocks
        // submit, so the summary must list it — and without this the link it
        // hands over silently does nothing. See utils/reveal.ts.
        reveal(field);
        field.focus();
      });
      li.appendChild(a);
      list.appendChild(li);
    });

    box.hidden = false;
    box.tabIndex = -1;
    box.focus();
  });
}
