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
 * build's `@import` needs. The docs derive the display name from the FILE
 * stem and the docs-page link from the DIR — corrected here 2026-08-28, when
 * this line still said the name came from the dir and `gen-rf-profile.mjs`
 * had been keying on `split('/')[1]` the whole time. The two halves are
 * genuinely different: five entries share the `form` dir and one page, but
 * name five distinct files that the profile ships.
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
  // Added 109.7 (RF landing): .bo-widget-grid/.bo-widget is the RF task
  // menu's whole layout mechanism — same container-query grid app-launch
  // already uses at desktop size, here at a glove-sized tile min. Its
  // @container queries need Chrome 105+ (BCD), already inside this
  // profile's 108 floor, so no new guard work. Pulling in the stat/collapse
  // rules this file also carries is accepted as-is (one file, no per-selector
  // split elsewhere in this profile either) — they're inert if unused, not a
  // floor risk.
  'dashboard/dashboard',
  // Added 126.2 (RF-coverage grill): the scan-result flash IS the RF
  // surface — a viewport cue for a user watching the rack, paired with the
  // scan-input live region for two channels. Floor-safe by construction
  // (no color-mix; see the file's own header).
  'scan/scan',
];
