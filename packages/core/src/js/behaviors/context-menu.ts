/**
 * Right-click (contextmenu) trigger for the SAME popover menu component
 * initDropdowns() already opens on click (roadmap 73.1). This behavior owns
 * exactly one thing — WHERE the menu opens from: [data-context-menu] on any
 * element (a data-table <th>, a row, anything) positions the associated
 * .bo-dropdown__menu at the cursor instead of at an invoker's rect, and
 * suppresses the browser's native context menu. Everything else — Esc/
 * light-dismiss, item-click-to-close, keyboard nav — is the native
 * <div popover> + initDropdowns() machinery already ships; call both.
 *
 * Markup contract:
 *   <th data-context-menu="col-menu-vendor">Vendor</th>
 *   <div class="bo-dropdown__menu" id="col-menu-vendor" popover>
 *     <button class="bo-dropdown__item">Sort ascending</button>
 *     <label class="bo-dropdown__item">
 *       <input type="checkbox" class="bo-checkbox" data-col-toggle="vendor" checked /> Show column
 *     </label>
 *   </div>
 * Menu items wire to mechanisms that already exist elsewhere in this
 * framework — data-col-toggle (initTableToolbar) for hide/show, an
 * ordinary sort control for sorting — this behavior does not own or invent
 * either; it only opens the menu where the user right-clicked.
 */
import { pointAnchor, positionPopover } from '../utils/popover-position.js';

let installed = false;

// Shares dropdown/combobox's clamp+flip math (roadmap 105.1) via a
// zero-size anchor rect at the cursor. Before the shared helper this only
// clamped (a click near the bottom edge left the menu squashed against the
// cursor); it now flips fully above the cursor when there's no room below,
// same as the other two.
function position(menu: HTMLElement, x: number, y: number): void {
  positionPopover(menu, pointAnchor(x, y));
}

export function initContextMenu(): void {
  if (installed) return;
  installed = true;

  document.addEventListener('contextmenu', (e) => {
    const trigger = (e.target as Element | null)?.closest<HTMLElement>('[data-context-menu]');
    if (!trigger) return;
    const menu = document.getElementById(trigger.dataset.contextMenu ?? '');
    if (!(menu instanceof HTMLElement) || !menu.hasAttribute('popover')) return;
    e.preventDefault();
    menu.showPopover();
    // showPopover() is synchronous and lays out the top-layer element
    // immediately, so offsetWidth/Height are accurate right after — the
    // same assumption initDropdowns' own anchor-based position() makes.
    position(menu, e.clientX, e.clientY);
  });
}
