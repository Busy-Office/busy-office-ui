/**
 * Open every container that is hiding an element, so it can actually be
 * focused and seen.
 *
 * Moving focus to a field is not the same as putting it in front of the user.
 * Three containers this framework ships hide their contents, and each defeats
 * a plain `.focus()` differently — measured in headless Chrome against the
 * shipped `dist/`, not assumed:
 *
 *   - a closed `<details>`            — not rendered, `.focus()` is a NO-OP
 *   - `[role=tabpanel][hidden]`       — not rendered, `.focus()` is a NO-OP
 *   - `.bo-widget__collapse[data-state="closed"]` — WORSE: focus succeeds, but
 *     the container computes to 0px with `overflow: hidden`, so focus lands
 *     somewhere the user cannot see and has no way to find.
 *
 * The bug that produced this: `initValidationSummary()` listed a required
 * field inside an inactive tab and gave the user a link to it that silently
 * did nothing — the summary named the problem and hid the repair.
 *
 * **Reveal by driving the component's own trigger, never by mutating its
 * state.** Clicking the tab / the `[data-collapse-trigger]` lets the behavior
 * that owns that state update `aria-selected`, `aria-expanded`, the roving
 * tabindex and the sibling panels — all things a direct `hidden = false` would
 * leave stale, producing a panel that is visible while ARIA still calls it
 * unselected. The direct write is only a fallback for markup wired without its
 * behavior installed.
 *
 * Only containers whose reveal semantics this framework KNOWS are handled. A
 * generic "unhide any ancestor" would strip `hidden` off app markup whose
 * meaning we cannot know, which is a worse failure than not revealing.
 *
 * Note the platform already does part of this: navigating to `#id` opens a
 * closed `<details>` on its own. That only helps callers that let the fragment
 * navigation happen — `validation-summary` deliberately does not, because a
 * history entry per error-link click is its own problem — so the `<details>`
 * branch below stays, and stays two lines.
 */

/** An ancestor chain outermost-first, so an outer container opens before an inner one. */
function hidingAncestors(el: Element): HTMLElement[] {
  const chain: HTMLElement[] = [];
  let node: Element | null = el;
  while (node) {
    if (node instanceof HTMLElement) chain.push(node);
    node = node.parentElement;
  }
  return chain.reverse();
}

/**
 * Press the control that owns a container's state, then CHECK whether that
 * actually revealed it; returns false if it did not, so the caller can fall
 * back.
 *
 * The check is the point. Pressing the owner only works when the behavior that
 * listens for it is installed — `initTabs()`, `initCollapsibleCards()` — and a
 * page can ship the markup without ever calling them. Assuming the press
 * landed is how this fix silently did nothing on its first run: the tabs
 * delegation matches `.bo-tabs__tab[role=tab]`, and a panel whose tab omits the
 * class is never activated at all.
 */
function pressOwner(
  selector: string,
  id: string,
  revealed: () => boolean,
): boolean {
  const owner = ownerFor(selector, id);
  if (!owner) return false;
  owner.click();
  return revealed();
}

/**
 * The control whose `aria-controls` names `id`.
 *
 * Found by comparing the attribute rather than by interpolating the id into a
 * selector: `CSS.escape` is not present in every environment this package's
 * tests run in, and an unescaped id containing a quote or a space silently
 * matches nothing (or the wrong node). An exact string compare has neither
 * failure mode.
 */
function ownerFor(selector: string, id: string): HTMLElement | null {
  if (!id) return null;
  for (const el of document.querySelectorAll<HTMLElement>(selector)) {
    if (el.getAttribute('aria-controls') === id) return el;
  }
  return null;
}

/**
 * Reveal `el` by opening any container that hides it. Safe to call on an
 * element that is already visible — it does nothing.
 */
export function reveal(el: Element): void {
  for (const node of hidingAncestors(el)) {
    // Closed <details>. The platform's own reveal, used directly.
    if (node instanceof HTMLDetailsElement && !node.open) {
      node.open = true;
      continue;
    }

    // Inactive tab panel. Activating the TAB keeps aria-selected, the roving
    // tabindex and the sibling panels consistent.
    if (node.hidden && node.getAttribute('role') === 'tabpanel') {
      const panel = node;
      if (!pressOwner('[role="tab"]', panel.id, () => !panel.hidden)) {
        // No tab points here, or its behavior is not installed. Show the panel
        // and mark its own tab selected. Sibling panels are deliberately left
        // alone: re-implementing `activate()` here would be a second copy of
        // the tabs contract, and a page that never called initTabs() has tabs
        // that do not work at all — which `reveal` cannot and should not
        // repair. The user still lands on the field they must fix.
        panel.hidden = false;
        ownerFor('[role="tab"]', panel.id)?.setAttribute('aria-selected', 'true');
      }
      continue;
    }

    // Collapsed widget body. Same rule: press the trigger so aria-expanded and
    // data-state move together.
    if (
      node.classList.contains('bo-widget__collapse') &&
      node.dataset.state === 'closed'
    ) {
      const body = node;
      const opened = pressOwner(
        '[data-collapse-trigger]',
        body.id,
        () => body.dataset.state === 'open',
      );
      if (!opened) {
        body.dataset.state = 'open';
        ownerFor('[data-collapse-trigger]', body.id)?.setAttribute('aria-expanded', 'true');
      }
    }
  }
}
