/**
 * The markup rules a consumer must follow, in ONE place.
 *
 * They were a literal inside gen-llms.mjs. When 33.1 needed the same list for
 * the copy-paste block a consumer drops into their own AI instructions file,
 * the choice was to restate them or to share them — and a restated list is a
 * list that drifts, which is the failure this whole slice is about.
 *
 * These are the rules a CHECKER CANNOT ENFORCE. bo-check-markup validates that
 * a class exists and that a framework data-* value is legal; nothing here is
 * either. That is exactly why they have to be written down where a reader —
 * human or model — will see them before writing markup, and it is why the
 * scrollable-region rule was added: 33.3 measured its absence producing a real
 * axe violation.
 */
export const MARKUP_RULES = [
  'State is two-channel: visible non-color cue (glyph, aria-hidden) AND programmatic\n  (visually-hidden text like "Completed: ", aria-current, ARIA attributes).',
  'Forms: aria-invalid + aria-describedby -> message id (+ role="alert" if dynamic).',
  'Dialogs: aria-labelledby -> title id. Icon-only buttons: aria-label.',
  'Row-select checkboxes need name/value to POST. Styled lists get role="list".',
  'Sorting: YOUR code re-orders rows and sets aria-sort on <th>; CSS draws indicator.',
  'Never user-scalable=no. Never override html font-size (rem-based framework).',
  'Columns hidden by container compaction (__col--secondary) must stay reachable.',
  'A scrollable region must be keyboard-reachable: .bo-data-table-container needs\n  tabindex="0" (and an aria-label when the table has no caption). axe reports\n  scrollable-region-focusable otherwise, and no markup linter can infer it.',
];
