/**
 * The elements that are ALLOWED to overflow, defined once.
 *
 * Two gates need this list and they need it to mean the same thing:
 *
 *   - `check-layout` EXEMPTS them from its page-overflow rule, because a
 *     table container that scrolls is doing its job, not breaking the page.
 *   - `check-scroll` does the opposite and looks at exactly these, asking
 *     whether what spills past their edge is still reachable.
 *
 * One list, or the exemption and the check drift apart and the gap between
 * them is invisible: an element dropped from one and kept in the other is
 * either unchecked by both or double-judged, and nothing reports it.
 *
 * It had already drifted into three spellings before this file existed
 * (Standardize sweep, 2026-08-24): `check-layout` carried it twice — once as
 * a const with spaces and once hardcoded without them in a helper right below
 * — and `check-scroll` added a third that omitted `pre`. The omission was not
 * deliberate; adding `pre` back took the scroll sweep from 122 to 700 regions,
 * all passing, on the same page set and therefore at no CI cost.
 */
export const SCROLL_REGIONS = ['.bo-data-table-container', '.scale-scroll', 'pre'];

/** For `closest()` / `querySelectorAll()`, which want one string. */
export const SCROLL_REGION_SELECTOR = SCROLL_REGIONS.join(', ');
