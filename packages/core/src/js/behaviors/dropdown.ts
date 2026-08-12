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
 */
let installed = false;

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

export function initDropdowns(): void {
  if (installed) return;
  installed = true;

  // 'toggle' does not bubble; capture still sees it.
  document.addEventListener(
    'toggle',
    (e) => {
      const menu = e.target as HTMLElement;
      if (!menu.classList?.contains('bo-dropdown__menu')) return;
      if ((e as ToggleEvent).newState === 'open') position(menu);
    },
    true,
  );

  document.addEventListener('click', (e) => {
    const item = (e.target as Element | null)?.closest('.bo-dropdown__item');
    const menu = item?.closest<HTMLElement>('.bo-dropdown__menu[popover]');
    if (menu) menu.hidePopover();
  });
}
