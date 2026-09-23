/**
 * Multi-value tag/chip entry (Fiori Token/MultiInput; Ant/Carbon Tag) —
 * multi-tag cost centers on a record, multiple approval-routing recipients.
 * No native element covers this (unlike file/date/segmented), so it's real
 * JS, same class as combobox/data-grid.
 *
 * Markup contract:
 *   <div class="bo-tag-input" role="group" aria-label="Cost centers">
 *     <span class="bo-tag-input__tag">CC-4021
 *       <button class="bo-tag-input__remove" type="button" aria-label="Remove CC-4021">×</button>
 *     </span>
 *     <input class="bo-tag-input__field" type="text" placeholder="Add…">
 *   </div>
 *
 * Framework owns REMOVAL (deterministic — it's the framework's own rendered
 * chip element, same as initAlerts() removing its own .bo-alert) but not
 * ADDITION: Enter dispatches bo:tag-add with the typed text and clears the
 * field; YOUR code decides whether it's valid/a duplicate and, if so,
 * appends the actual .bo-tag-input__tag markup. Same "framework does
 * visuals, you do the data" split as row-edit/file-upload.
 *
 * @serves tag-input
 */
let installed = false;

function removeTag(tag: Element): void {
  // tag.textContent would also pick up the remove button's own "×" label —
  // clone and strip it first so the event carries just the tag's own text.
  const clone = tag.cloneNode(true) as Element;
  clone.querySelector('.bo-tag-input__remove')?.remove();
  const label = clone.textContent?.trim() ?? '';

  /* Removing the chip that HOLDS focus drops the caret to <body> — the
     keyboard user loses their place mid-task (WCAG 3.2.1/2.4.3). Read that
     BEFORE dispatching: a listener may move focus itself, and the question
     here is where focus was when the removal began.

     The field is the destination because it already exists in the markup
     contract, already takes the next value, and needs no new state — a
     roving index over the remaining chips would be a second navigation model
     for one interaction. Resolved from the container before `tag.remove()`,
     since a detached chip has no ancestor to search from. */
  const container = tag.closest('.bo-tag-input');
  const field = container?.querySelector<HTMLElement>('.bo-tag-input__field') ?? null;
  const activeBefore = document.activeElement;
  const removingFocused = tag.contains(activeBefore);

  tag.dispatchEvent(
    /**
     * @event bo:tag-remove
     * @target the removed `.bo-tag-input__tag` (bubbles)
     * @when its remove button is clicked, or Backspace is pressed in the field while empty (removes the last tag)
     * @detail value {string} the removed tag's text content
     */
    new CustomEvent('bo:tag-remove', { bubbles: true, detail: { value: label } }),
  );

  /* A listener that moved focus somewhere outside the doomed chip meant it.
     Comparing against `activeBefore` rather than testing for "not body" is
     what distinguishes a deliberate move from the blur the removal is about
     to cause anyway. */
  const activeAfter = document.activeElement;
  const consumerMovedFocus = activeAfter !== activeBefore && !tag.contains(activeAfter);

  tag.remove();

  if (removingFocused && !consumerMovedFocus) field?.focus();
}

export function initTagInput(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('click', (e) => {
    const btn = (e.target as Element | null)?.closest('.bo-tag-input__remove');
    if (!btn) return;
    const tag = btn.closest('.bo-tag-input__tag');
    if (tag) removeTag(tag);
  });

  document.addEventListener('keydown', (e) => {
    const field = (e.target as Element | null)?.closest<HTMLInputElement>('.bo-tag-input__field');
    if (!field) return;
    const container = field.closest('.bo-tag-input');
    if (!container) return;

    if (e.key === 'Enter' && field.value.trim()) {
      e.preventDefault();
      const value = field.value.trim();
      field.value = '';
      /**
       * @event bo:tag-add
       * @target the `.bo-tag-input` container (bubbles)
       * @when Enter is pressed in the field with non-empty text; the field is cleared immediately
       * @detail value {string} the typed text — your code validates/dedupes and appends the actual `.bo-tag-input__tag` markup if accepted
       */
      container.dispatchEvent(new CustomEvent('bo:tag-add', { bubbles: true, detail: { value } }));
      return;
    }

    if (e.key === 'Backspace' && !field.value) {
      const tags = container.querySelectorAll('.bo-tag-input__tag');
      const last = tags[tags.length - 1];
      if (last) {
        e.preventDefault();
        removeTag(last);
      }
    }
  });
}
