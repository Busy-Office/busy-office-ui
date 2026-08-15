/**
 * Editable combobox with list autocomplete — WAI-ARIA APG combobox pattern
 * (single-select, list autocomplete, manual selection). The listbox is a
 * [popover] (default "auto"), so it renders in the top layer — never
 * clipped by scrolling containers — and gets Esc / light-dismiss for free.
 *
 * Markup contract:
 *   <div class="bo-combobox">
 *     <input class="bo-input" type="text" role="combobox" id="cb-input"
 *         aria-expanded="false" aria-controls="cb-list" aria-autocomplete="list"
 *         autocomplete="off" />
 *     <ul class="bo-combobox__listbox" id="cb-list" role="listbox" popover>
 *       <li class="bo-combobox__option" role="option" id="cb-opt-1" data-value="CC-1180">CC-1180</li>
 *     </ul>
 *   </div>
 *
 * initCombobox() wires: typing filters options (case-insensitive substring)
 * and opens the list; ArrowDown/ArrowUp move aria-activedescendant across
 * the filtered (visible) options; Enter commits the active option's text
 * into the input and dispatches bo:combobox-select ({value, text}). Escape
 * and click-outside close without changing the value — native popover
 * behavior, no extra code. Call once.
 */
let installed = false;
// commit() dispatches a synthetic `input` for generic form-field listeners
// (see commit()) — the combobox's OWN `input` listener must ignore that one
// event, or it re-filters the just-committed text and reopens the list.
const suppressNextInput = new WeakSet<HTMLInputElement>();

// Resolution prefers the shared .bo-combobox container over document-wide
// id lookup: a duplicated fragment (the classic partial-swap accident)
// leaves two widgets with identical ids, and getElementById/first-match
// would silently wire widget #2's input to widget #1's list. The id-based
// document fallback keeps the documented aria-controls contract working
// for markup that skips the wrapper.
function listboxFor(input: HTMLElement): HTMLElement | null {
  const id = input.getAttribute('aria-controls');
  if (!id) return null;
  const scoped = input.closest('.bo-combobox')?.querySelector<HTMLElement>('[role="listbox"]');
  if (scoped?.id === id) return scoped;
  return document.getElementById(id);
}

function inputFor(listbox: HTMLElement): HTMLInputElement | null {
  const scoped = listbox.closest('.bo-combobox')?.querySelector<HTMLInputElement>('[role="combobox"]');
  if (scoped?.getAttribute('aria-controls') === listbox.id) return scoped;
  return (
    [...document.querySelectorAll<HTMLInputElement>('[role="combobox"]')].find(
      (el) => el.getAttribute('aria-controls') === listbox.id,
    ) ?? null
  );
}

function options(listbox: HTMLElement): HTMLElement[] {
  return [...listbox.querySelectorAll<HTMLElement>('[role="option"]')];
}

// Tracked ourselves rather than via `:popover-open` — that pseudo-class
// isn't implemented in every test/runtime environment, and we already
// need to know "open or not" at every call site regardless.
function isOpen(listbox: HTMLElement): boolean {
  return listbox.dataset.boOpen === 'true';
}

function open(listbox: HTMLElement): void {
  if (isOpen(listbox)) return;
  listbox.dataset.boOpen = 'true';
  listbox.showPopover?.();
}

function close(listbox: HTMLElement): void {
  if (!isOpen(listbox)) return;
  listbox.dataset.boOpen = 'false';
  listbox.hidePopover?.();
}

function visibleOptions(listbox: HTMLElement): HTMLElement[] {
  return options(listbox).filter((o) => !o.hidden);
}

function position(input: HTMLElement, listbox: HTMLElement): void {
  const r = input.getBoundingClientRect();
  const width = Math.max(listbox.offsetWidth, r.width);
  const left = Math.max(4, Math.min(r.left, window.innerWidth - width - 4));
  let top = r.bottom + 4;
  if (top + listbox.offsetHeight > window.innerHeight - 4) {
    top = Math.max(4, r.top - listbox.offsetHeight - 4);
  }
  listbox.style.left = `${left}px`;
  listbox.style.top = `${top}px`;
  listbox.style.minWidth = `${r.width}px`;
}

function setActive(input: HTMLElement, listbox: HTMLElement, option: HTMLElement | null): void {
  options(listbox).forEach((o) => o.removeAttribute('aria-selected'));
  if (option) {
    option.setAttribute('aria-selected', 'true');
    input.setAttribute('aria-activedescendant', option.id);
    option.scrollIntoView?.({ block: 'nearest' });
  } else {
    input.removeAttribute('aria-activedescendant');
  }
}

function filter(input: HTMLInputElement, listbox: HTMLElement): void {
  const q = input.value.trim().toLowerCase();
  let anyVisible = false;
  options(listbox).forEach((o) => {
    const match = q === '' || (o.textContent ?? '').toLowerCase().includes(q);
    o.hidden = !match;
    if (match) anyVisible = true;
  });
  if (anyVisible) {
    open(listbox);
    input.setAttribute('aria-expanded', 'true');
    position(input, listbox);
  } else {
    close(listbox);
    input.setAttribute('aria-expanded', 'false');
  }
  setActive(input, listbox, null);
}

/**
 * @event bo:combobox-select
 * @target the combobox `<input>` (bubbles)
 * @when an option is committed — click, or Enter on the active option
 * @detail value {string} the option's `data-value`, falling back to its text
 * @detail text {string} the option's visible text, now in the input
 */
function commit(input: HTMLInputElement, listbox: HTMLElement, option: HTMLElement): void {
  input.value = option.textContent?.trim() ?? '';
  close(listbox);
  input.setAttribute('aria-expanded', 'false');
  setActive(input, listbox, null);
  // Programmatic .value assignment fires no native events — dispatch a real
  // `input` first so any generic form-field listener (row-edit's dirty
  // tracking, native form validation, a plain onChange handler) sees the
  // commit exactly like it would see typed input. bo:combobox-select is the
  // richer, combobox-specific event for consumers who want the option's
  // data-value directly.
  suppressNextInput.add(input);
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(
    new CustomEvent('bo:combobox-select', {
      bubbles: true,
      detail: { value: option.getAttribute('data-value') ?? input.value, text: input.value },
    }),
  );
}

/**
 * @keymap initCombobox
 * @key ArrowDown / ArrowUp — open the list (filtering first if closed), then move the active option; clamps at the ends
 * @key Enter — commit the active option (dispatches bo:combobox-select)
 * @key Escape — close without changing the value (native popover light-dismiss)
 */
export function initCombobox(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('input', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.getAttribute?.('role') !== 'combobox') return;
    if (suppressNextInput.delete(input)) return;
    const listbox = listboxFor(input);
    if (listbox) filter(input, listbox);
  });

  document.addEventListener('keydown', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.getAttribute?.('role') !== 'combobox') return;
    const listbox = listboxFor(input);
    if (!listbox) return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen(listbox)) filter(input, listbox);
      const visible = visibleOptions(listbox);
      if (!visible.length) return;
      const current = visible.findIndex((o) => o.getAttribute('aria-selected') === 'true');
      const next =
        e.key === 'ArrowDown'
          ? visible[Math.min(current + 1, visible.length - 1)]
          : visible[Math.max(current - 1, 0)];
      setActive(input, listbox, next);
      return;
    }

    if (e.key === 'Enter') {
      const active = options(listbox).find((o) => o.getAttribute('aria-selected') === 'true');
      if (active) {
        e.preventDefault();
        commit(input, listbox, active);
      }
    }
  });

  document.addEventListener('click', (e) => {
    const option = (e.target as Element | null)?.closest<HTMLElement>('[role="option"]');
    const listbox = option?.closest<HTMLElement>('[role="listbox"]');
    const input = listbox && inputFor(listbox);
    if (listbox && input && option) commit(input, listbox, option);
  });

  // Native popover close (Esc, light-dismiss) doesn't know about the
  // combobox contract — sync aria-expanded and clear the active option.
  document.addEventListener(
    'toggle',
    (e) => {
      const listbox = e.target as HTMLElement;
      if (listbox.getAttribute?.('role') !== 'listbox') return;
      const input = inputFor(listbox);
      if (!input) return;
      const isNowOpen = (e as ToggleEvent).newState === 'open';
      listbox.dataset.boOpen = String(isNowOpen);
      input.setAttribute('aria-expanded', String(isNowOpen));
      if (!isNowOpen) setActive(input, listbox, null);
    },
    true,
  );
}
