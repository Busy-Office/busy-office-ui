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
import { positionPopover } from '../utils/popover-position';

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
  // aria-disabled options are shown but never navigable or committable
  // (owner test report 3.5, 2026-08-16 — they used to be fully selectable).
  return options(listbox).filter((o) => !o.hidden && o.getAttribute('aria-disabled') !== 'true');
}

function position(input: HTMLElement, listbox: HTMLElement): void {
  const r = input.getBoundingClientRect();
  positionPopover(listbox, r);
  listbox.style.minWidth = `${r.width}px`;
}

/**
 * Form value (owner test report §4.2): a combobox's visible text is the
 * DISPLAY label ("CC-1180 — Warehouse"); a plain form POST needs the
 * machine value. Put `data-name` on the root and the behavior mirrors
 * each commit into a generated hidden input — no app code, works with a
 * no-JS-framework form submit.
 */
function syncFormValue(root: HTMLElement, value: string): void {
  const name = root.dataset.name;
  if (!name) return;
  let hidden = root.querySelector<HTMLInputElement>(':scope > input[type="hidden"][data-bo-value]');
  if (!hidden) {
    hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.setAttribute('data-bo-value', '');
    root.append(hidden);
  }
  hidden.name = name;
  hidden.value = value;
}

/**
 * Result count for screen readers (owner test report §4.4, APG): typing
 * used to be silent — no "3 results", and critically no announcement
 * when the list closed on zero matches. The region is visually hidden;
 * the visible channel is the list itself.
 */
function announce(root: HTMLElement, count: number): void {
  let status = root.querySelector<HTMLElement>(':scope > [role="status"]');
  if (!status) {
    status = document.createElement('span');
    status.setAttribute('role', 'status');
    status.className = 'bo-visually-hidden';
    root.append(status);
  }
  status.textContent = count === 0 ? 'No results' : `${count} result${count === 1 ? '' : 's'} available`;
}

let autoId = 0;
function setActive(input: HTMLElement, listbox: HTMLElement, option: HTMLElement | null): void {
  options(listbox).forEach((o) => o.removeAttribute('aria-selected'));
  if (option) {
    option.setAttribute('aria-selected', 'true');
    // An option rendered from a template may have no id — aria-activedescendant
    // would then be set to "" and the highlight becomes invisible to AT while
    // staying visible to sighted users (owner test report 4.5). Mint one.
    if (!option.id) option.id = `bo-cb-opt-${++autoId}`;
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
  // Group headings ("Recent") describe the unfiltered order. Once the user
  // types, results are ranked by match rather than by group, so a stale
  // heading above filtered rows would be a lie.
  listbox.querySelectorAll<HTMLElement>('.bo-combobox__group').forEach((g) => {
    g.hidden = q !== '';
  });
  const root = input.closest<HTMLElement>('.bo-combobox');
  const count = visibleOptions(listbox).length;
  if (anyVisible) {
    open(listbox);
    input.setAttribute('aria-expanded', 'true');
    position(input, listbox);
  } else {
    close(listbox);
    input.setAttribute('aria-expanded', 'false');
  }
  if (root) announce(root, count);
  setActive(input, listbox, null);
}

/**
 * @event bo:combobox-select
 * @target the combobox `<input>` (bubbles)
 * @when an option is committed — click, or Enter on the active option
 * @detail value {string} the option's `data-value`, falling back to its text
 * @detail text {string} the option's visible text, now in the input
 */
const committed = new WeakSet<HTMLInputElement>();

/* A rich option row holds a code, a label and meta — committing its whole
   textContent would drop "CC-1180 Warehouse Hamburg Cost centre" into the
   field. The LABEL part is the display value; plain text options keep the
   old behaviour, so existing consumers are unaffected. */
function displayText(option: HTMLElement): string {
  const label = option.querySelector<HTMLElement>('.bo-combobox__option-label');
  return (label ?? option).textContent?.trim() ?? '';
}

function commit(input: HTMLInputElement, listbox: HTMLElement, option: HTMLElement): void {
  input.value = displayText(option);
  const root = input.closest<HTMLElement>('.bo-combobox');
  if (root) syncFormValue(root, option.getAttribute('data-value') ?? input.value);
  committed.add(input);
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
 * @key Enter (list open, nothing active) — swallowed, never submits the form; commits the sole match if there is exactly one
 * @key Escape — close without changing the value (native popover light-dismiss)
 * @key Tab — focus leaves the widget: the list closes and the active option clears
 * @key (focus after a commit) — the committed text is selected, so typing browses the full list again
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
        return;
      }
      // List open, nothing active: swallow Enter. Previously it fell
      // through to the enclosing <form>, which submitted an unfiltered
      // form and cleared the user's typed text — in the filter-bar shape
      // the docs recommend (owner test report 3.1, high). Commit the sole
      // match if there is exactly one; otherwise just don't submit.
      if (isOpen(listbox)) {
        e.preventDefault();
        const visible = visibleOptions(listbox);
        if (visible.length === 1) commit(input, listbox, visible[0]);
      }
    }
  });

  // Browse-after-commit (owner test report §4.1, the biggest usability
  // hole): after a commit the field holds the full option text, so
  // reopening filtered to exactly the row the user already had. Selecting
  // the text on focus means the next keystroke REPLACES it and the whole
  // list is reachable again — without destroying the value for someone
  // who just wants to read it.
  document.addEventListener('focusin', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.getAttribute?.('role') !== 'combobox') return;
    if (committed.has(input)) {
      input.select?.();
      return;
    }
    /* Recents-first (roadmap 24.2). ERP selection is Zipfian — users pick the
       same handful of values — so the useful list is the one shown BEFORE any
       keystroke. Opt-in per widget: opening on focus unprompted would be a
       behaviour change for every existing consumer, and a form full of
       lists popping open while tabbing through is worse than no recents.
       The recents themselves are server-supplied markup; nothing is stored
       client-side. */
    const root = input.closest<HTMLElement>('.bo-combobox');
    if (!root?.hasAttribute('data-open-on-focus')) return;
    if (input.value.trim() !== '') return;
    const lb = listboxFor(input);
    if (lb) filter(input, lb);
  });

  // Pointer and keyboard must agree on the active option (owner test
  // report §4.9): with no pointer listener, :hover and aria-selected
  // could highlight two different rows and Enter committed the one the
  // mouse was NOT over — a named APG anti-pattern.
  document.addEventListener('pointermove', (e) => {
    const option = (e.target as Element | null)?.closest<HTMLElement>('[role="option"]');
    if (!option || option.hidden || option.getAttribute('aria-disabled') === 'true') return;
    const listbox = option.closest<HTMLElement>('[role="listbox"]');
    const input = listbox && inputFor(listbox);
    if (!listbox || !input || !isOpen(listbox)) return;
    if (option.getAttribute('aria-selected') === 'true') return;
    setActive(input, listbox, option);
  });

  // Focus leaving the combobox closes the list. Without this the popover
  // stayed open over unrelated content after Tab, with aria-expanded="true"
  // and an active option in a list the user had left (owner test report
  // 3.2, high) — and "must match a known value" validation had no natural
  // moment to run.
  document.addEventListener('focusout', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.getAttribute?.('role') !== 'combobox') return;
    const root = input.closest('.bo-combobox');
    const to = (e as FocusEvent).relatedTarget as Node | null;
    if (to && root?.contains(to)) return; // moved within the widget
    const listbox = listboxFor(input);
    if (!listbox) return;
    close(listbox);
    input.setAttribute('aria-expanded', 'false');
    setActive(input, listbox, null);
  });

  // An open list is positioned once, at open time — it does not follow its
  // input on scroll (owner test report 3.3: the input scrolled away while
  // the list stayed pinned, orphaned over unrelated content). Closing is
  // the simple, correct behaviour; re-anchoring needs CSS anchor
  // positioning, which is below this project's browser floor.
  window.addEventListener(
    'scroll',
    (e) => {
      const open = document.querySelector<HTMLElement>('[role="listbox"][data-bo-open="true"]');
      // e.target is not always a Node (a window-targeted scroll event is
      // not), and Node.contains() THROWS on a non-Node — which silently
      // aborted the whole handler. Caught by a test that expected the list
      // to close and instead found it left open by the exception.
      const target = e.target;
      if (!open || (target instanceof Node && open.contains(target))) return;
      const input = inputFor(open);
      if (!input) return;
      /* While the field is still focused AND on screen, FOLLOW it rather than
         closing. Closing was the cheap answer to the list drifting away from
         its field, and it made focus-to-open impossible: focusing an
         off-screen field scrolls it into view, and that scroll closed the
         list focus had just opened — worse on a site with
         `scroll-behavior: smooth`, where one focus emits scroll events for
         ~300ms. Found live 2026-08-17; jsdom never scrolls, so no unit test
         could have caught it. Once the field leaves the viewport there is
         nothing to anchor to, so then we close. */
      const r = input.getBoundingClientRect();
      const measurable = r.width > 0 || r.height > 0;
      const onScreen = r.bottom > 0 && r.top < window.innerHeight;
      if (document.activeElement === input && measurable && onScreen) {
        position(input, open);
        return;
      }
      close(open);
      input.setAttribute('aria-expanded', 'false');
      setActive(input, open, null);
    },
    true,
  );

  document.addEventListener('click', (e) => {
    const option = (e.target as Element | null)?.closest<HTMLElement>('[role="option"]');
    const listbox = option?.closest<HTMLElement>('[role="listbox"]');
    const input = listbox && inputFor(listbox);
    if (!listbox || !input || !option) return;
    if (option.getAttribute('aria-disabled') === 'true') return; // report 3.5
    commit(input, listbox, option);
    // APG: focus must never leave the combobox during selection. Clicking
    // an option used to drop activeElement to <body>, so the next Tab
    // restarted from the top of the document (owner test report 3.4).
    input.focus();
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
