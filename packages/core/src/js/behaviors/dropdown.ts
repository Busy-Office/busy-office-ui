/**
 * Popover-based dropdown menus. The menu is a [popover] element, so it
 * renders in the browser top layer: never clipped by overflow containers,
 * never z-fought by sticky table headers, Esc and light dismiss are native,
 * and Esc closes the innermost layer first when nested in a <dialog>.
 *
 * Markup contract:
 *   <button class="bo-btn" popovertarget="menu-1">Actions</button>
 *   <div class="bo-dropdown__menu" id="menu-1" popover>
 *     <button class="bo-dropdown__item">…</button>
 *   </div>
 *
 * initDropdowns() adds the two things the platform doesn't: anchoring the
 * menu to its invoker (top-layer popovers are not anchor-positioned at our
 * browser floor), and close-on-item-select. Call once.
 *
 * Multi-select variant — real checkboxes, no new ARIA role, stays open
 * across selections:
 *   <button class="bo-btn bo-btn--secondary" popovertarget="menu-2"
 *       data-multiselect-label="Cost center">Cost center</button>
 *   <div class="bo-dropdown__menu" id="menu-2" popover data-multiselect>
 *     <label class="bo-dropdown__item"><input type="checkbox" class="bo-checkbox" value="CC-1180" /> CC-1180</label>
 *   </div>
 * The trigger's label becomes "Cost center (2)" once >=1 box is checked,
 * and reverts to `data-multiselect-label` at zero. Clicking a checkbox
 * item does not close the menu (every other menu still closes on select).
 * A trigger with element children (icon + label) must nest a
 * `<span data-multiselect-count>` for the label text — the behavior never
 * rewrites a trigger's children, only that span or a plain-text trigger.
 */
let installed = false;

function findInvoker(menuId: string): HTMLElement | null {
  return [...document.querySelectorAll<HTMLElement>('[popovertarget]')].find(
    (el) => el.getAttribute('popovertarget') === menuId,
  ) ?? null;
}

function updateMultiselectLabel(menu: HTMLElement): void {
  const invoker = findInvoker(menu.id);
  const base = invoker?.getAttribute('data-multiselect-label');
  if (!invoker || !base) return;
  const count = menu.querySelectorAll('input[type="checkbox"]:checked').length;
  const text = count > 0 ? `${base} (${count})` : base;
  // Never write textContent on a trigger with element children — that
  // would destroy an icon/badge inside the button. Prefer a dedicated
  // [data-multiselect-count] child when one exists; otherwise only
  // rewrite a plain-text trigger.
  const target = invoker.querySelector<HTMLElement>('[data-multiselect-count]');
  if (target) target.textContent = text;
  else if (invoker.childElementCount === 0) invoker.textContent = text;
}

function position(menu: HTMLElement): void {
  const invoker = document.querySelector<HTMLElement>(
    `[popovertarget="${CSS.escape(menu.id)}"]`,
  );
  if (!invoker) return;
  const r = invoker.getBoundingClientRect();
  const menuWidth = Math.max(menu.offsetWidth, r.width);
  const rtl = getComputedStyle(menu).direction === 'rtl';
  const end = menu.classList.contains('bo-dropdown__menu--end');
  let left = end !== rtl ? r.right - menuWidth : r.left;
  left = Math.max(4, Math.min(left, window.innerWidth - menuWidth - 4));
  let top = r.bottom + 4;
  if (top + menu.offsetHeight > window.innerHeight - 4) {
    top = Math.max(4, r.top - menu.offsetHeight - 4);
  }
  menu.style.insetInlineStart = 'auto';
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

/* An open menu must FOLLOW its trigger (owner bug report, 2026-08-18).
   `position()` writes viewport coordinates onto a `position: fixed` element in
   the top layer, and it used to run once, on open. Scrolling then moved the
   trigger while the menu stayed nailed to the screen: measured on
   /components/filters, the menu's top stayed at 720px while its trigger's
   bottom travelled 844 -> 594, so the menu ended up floating over unrelated
   content 250px from the control that opened it. Resizing had the same effect
   and was equally unhandled.

   Listeners live only while a menu is open, and scroll is captured because the
   trigger is usually inside a scrolling container (the app shell's main
   region), not the window — a non-capturing window listener never sees it. */
let openMenu: HTMLElement | null = null;

function reposition(): void {
  if (openMenu) position(openMenu);
}

function trackWhileOpen(menu: HTMLElement): void {
  openMenu = menu;
  document.addEventListener('scroll', reposition, true);
  window.addEventListener('resize', reposition);
}

function stopTracking(): void {
  openMenu = null;
  document.removeEventListener('scroll', reposition, true);
  window.removeEventListener('resize', reposition);
}

export function initDropdowns(): void {
  if (installed) return;
  installed = true;

  // 'toggle' does not bubble; capture still sees it.
  document.addEventListener(
    'toggle',
    (e) => {
      const menu = e.target as HTMLElement;
      if (!menu.classList?.contains('bo-dropdown__menu')) return;
      if ((e as ToggleEvent).newState === 'open') {
        position(menu);
        trackWhileOpen(menu);
      } else {
        stopTracking();
      }
    },
    true,
  );

  document.addEventListener('click', (e) => {
    const item = (e.target as Element | null)?.closest('.bo-dropdown__item');
    const menu = item?.closest<HTMLElement>('.bo-dropdown__menu[popover]');
    if (menu && !menu.hasAttribute('data-multiselect')) menu.hidePopover();
  });

  document.addEventListener('change', (e) => {
    const input = e.target as HTMLInputElement;
    if (input.type !== 'checkbox') return;
    const menu = input.closest<HTMLElement>('.bo-dropdown__menu[data-multiselect]');
    if (menu) updateMultiselectLabel(menu);
  });
}
