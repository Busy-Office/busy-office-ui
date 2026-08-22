/**
 * Shared by dropdown, combobox and context-menu: anchor a `position: fixed`
 * top-layer popover under (or, when there's no room, above) a rect — an
 * invoker's own `getBoundingClientRect()`, or a synthetic zero-size rect at
 * a cursor position for context-menu. Extracted 2026-08-22 (roadmap 105.1)
 * after the same 4px-clamp + flip-above math drifted across all three:
 * dropdown and combobox each hand-rolled it slightly differently, and
 * context-menu didn't flip at all (it only clamped, so a menu opened near
 * the bottom edge sat squashed against the cursor instead of appearing
 * above it).
 *
 * Always resets `insetInlineStart` to `'auto'` before writing physical
 * `left`/`top`. Every popover's base CSS sets `inset: auto` — a PHYSICAL
 * shorthand (top/right/bottom/left) — which never touches the logical
 * `inset-inline-start`/`inset-inline-end` properties. Per the CSS Logical
 * Properties spec, when a physical and its corresponding logical property
 * are both set with equal specificity (true for two inline-style writes),
 * whichever was written LAST wins. `combobox.position()` used to write only
 * `left`, never `insetInlineStart` — harmless by itself, but leaves the
 * element vulnerable to any future logical write value + Standardize drift
 * outliving one; dropdown already reset it defensively. Doing it here,
 * once, in the shared call, makes it structurally impossible for the three
 * callers to diverge on this again.
 */
export interface PopoverAnchorRect {
  top: number;
  right: number;
  bottom: number;
  left: number;
  width: number;
}

export interface PopoverPositionOptions {
  /** Align the popover's END edge with the anchor's end edge instead of
   *  its start edge. Logical, RTL-aware: LTR end = right, RTL end = left. */
  alignEnd?: boolean;
  /** Gap between the anchor and the popover on the flip axis, in px. */
  gap?: number;
  /** Minimum distance kept from every viewport edge, in px. */
  margin?: number;
}

export function positionPopover(
  target: HTMLElement,
  anchor: PopoverAnchorRect,
  options: PopoverPositionOptions = {},
): void {
  const { alignEnd = false, gap = 4, margin = 4 } = options;
  const rtl = getComputedStyle(target).direction === 'rtl';
  const width = Math.max(target.offsetWidth, anchor.width);

  let left = alignEnd !== rtl ? anchor.right - width : anchor.left;
  left = Math.max(margin, Math.min(left, window.innerWidth - width - margin));

  let top = anchor.bottom + gap;
  if (top + target.offsetHeight > window.innerHeight - margin) {
    top = Math.max(margin, anchor.top - target.offsetHeight - gap);
  }

  target.style.insetInlineStart = 'auto';
  target.style.left = `${left}px`;
  target.style.top = `${top}px`;
}

/** A zero-size anchor rect at a point — context-menu's cursor position. */
export function pointAnchor(x: number, y: number): PopoverAnchorRect {
  return { top: y, right: x, bottom: y, left: x, width: 0 };
}
