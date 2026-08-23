/**
 * The contexts this project verifies in. One answer, imported.
 *
 * `[1440, 390]` was hand-copied into five gates — axe-audit, visual-regression
 * (deleted 2026-08-24), check-po-app, check-pseudo-locale and one sweep inside
 * check-claims — and the
 * REASON for the pair was written down in exactly one of them (Standardize
 * sweep, 2026-08-19). That is the same shape as `paths.mjs` and
 * `SOURCE_SKIP_DIRS` before it: one decision, stored N times, failing silently.
 *
 * Silently, because nothing compares the five. Change the narrow width in
 * `axe-audit` and the accessibility sweep, the screenshot baselines and the
 * pseudo-locale check are quietly judging three different phones, while every
 * gate still reports a pass. CLAUDE.md's quality bar says "screenshot at 1440px
 * AND 390px" as a single rule; it should therefore be a single constant.
 *
 * WHY THESE TWO, since a constant with no rationale is how the reason got lost:
 *
 *   1440 — the desktop case. Wide enough that the shell, the sidebar rail and a
 *          data-table toolbar all sit at full size, which is where ERP screens
 *          actually live.
 *   390  — the narrow case, and the more informative of the two. Violations are
 *          frequently width-gated: a table container only becomes a scrollable
 *          region — and therefore only needs to be focusable — once it
 *          overflows, which mostly happens here. It is also the width at which
 *          `.bo-offcanvas` hits its `85vw` cap rather than its `18rem` one.
 *
 * NOT every 1440 in this directory belongs to this decision. `check-search`,
 * `check-boost` and `check-target-size` set a single desktop viewport and never
 * sweep; that is "a desktop viewport", not "the pair we verify at". They import
 * DESKTOP_WIDTH, so a future third sweep width does not silently double their
 * runtime.
 */

/** The narrow case. See above — most width-gated defects surface here. */
export const NARROW_WIDTH = 390;

/** The desktop case. */
export const DESKTOP_WIDTH = 1440;

/**
 * Both widths every full sweep runs at, desktop first.
 *
 * Ordered deliberately: gates that leave a page at the last width (or name a
 * screenshot after it) behaved as if desktop came first when this was five
 * separate literals, so the shared value keeps that order rather than quietly
 * changing four gates' behaviour.
 */
export const WIDTHS = [DESKTOP_WIDTH, NARROW_WIDTH];
