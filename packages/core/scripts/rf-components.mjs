/**
 * The rf-essentials profile's membership — ONE list, read by both the build
 * and the docs.
 *
 * The owner's ask behind this (roadmap 95.1) was precise: an RF scanner runs
 * a few screens, "not need all component, just need components that
 * required". The profile has encoded that answer since Slice 59.2 — and it
 * was unreadable. `rf-essentials` is named on four docs pages and the list of
 * what is actually IN it appeared on none of them, so the one question a
 * reader would bring could not be answered from the docs.
 *
 * Exported rather than restated so the page cannot drift from the bundle:
 * `build-rf-essentials.mjs` compiles exactly these, and the docs page renders
 * exactly these. Adding a component to the profile updates both, or neither.
 *
 * Paths are `<dir>/<file>` under `src/css/components/`, which is what the
 * build's `@import` needs; the docs derive the display name from the dir.
 */
export const RF_COMPONENTS = [
  'button/button',
  'form/checkbox-radio',
  'form/form-field',
  'form/form-section',
  'form/input',
  'form/select',
  'quantity/quantity',
  'badge/badge',
  'alert/alert',
  'data-table/data-table',
  'state/state',
  'kv/kv',
];
