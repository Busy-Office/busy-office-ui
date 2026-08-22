# RF pattern family — grill report (roadmap 109.7)

Owner ask, 2026-08-22: "then should be full range of patterns for RF? metro
UI or bento UI landing? list (display and editable)? form? dropdown (instead
of dropdown, should popup full screen instead)?"

Direction from the roadmap entry: **a small RF family mapped to the RF
worker's DAY, never a mirror of the app catalogue** — an RF device runs 3-6
tasks, not a suite. Every verdict below is measured against the
`rf-essentials` floor (Chrome/WebView 108, `packages/core/scripts/rf-components.mjs`)
and verified live at the 360×640 fixture size, both themes
(`/patterns/rf/rf-landing-rf/`, `/patterns/rf/rf-list-rf/`), same technique as
`goods-receipt-rf` (roadmap 59.4).

## 1. RF landing (metro/bento task menu) — BUILD

Shipped: `/patterns/rf-landing` + isolated fixture `/patterns/rf/rf-landing-rf`.

Composes from `.bo-widget-grid` + `.bo-widget` — the same container-query
grid `/patterns/app-launch` already uses at desktop tile size, here at a
raised `--bo-widget-min` (8rem) for glove-sized tap targets, plus
`data-density="spacious"`. At 360px this auto-fills 2 columns, which is the
right shape for a worker glancing at a handheld, not scrolling a list.

**Profile change**: `dashboard/dashboard` (the CSS file `.bo-widget-grid`/
`.bo-widget` live in) was added to `RF_COMPONENTS`
(`packages/core/scripts/rf-components.mjs`). Its `.bo-widget-grid` /
`.bo-widget` rules use one `@container` query
(`@container bo-widget-grid (max-width: 41rem)`, for the `--span-2` collapse
— irrelevant to this pattern but shipped with the file). Container queries
(BCD `css.at-rules.container`) need Chrome 105+, already inside the 108
floor this profile targets — `check:rf-floor` (which parses the CSS and
fails on any unguarded feature above 108) passed clean, no `@supports`
wrapper needed. Rebuilt bundle: 13 components, 83.2 kB / 32.9 kB min (was
12 / ~28 kB before).

**Icon glyphs deliberately excluded.** `AppTile.astro` (app-launch's tile)
supports an icon mark, and the instinct was to reuse it here. Refused:
`icon.css` is 12 glyphs, ~7.9 kB minified, ~10% of the *whole* framework by
itself (per its own header comment) — a disproportionate addition to a
profile whose entire point is "a scanner runs a few screens, carry only
what those screens need" (roadmap 95.1/59.2). An RF worker already knows
their own device's 3-6 tasks by name every shift; a label is the whole
affordance a metro tile needs here, unlike a general app launcher searched
by unfamiliar users. Tiles ship label + open-count `.bo-badge` only.

**Verified** at 360×640, `rf-essentials.min.css` only, light + dark: 2-column
grid, full-width glove tiles, badge counts legible in both themes.
Screenshots taken via Playwright against the built `dist/` (not dev
server) — see verification note below on what nearly went wrong.

## 2. RF list (display) — BUILD

Shipped: `/patterns/rf-list` + isolated fixture `/patterns/rf/rf-list-rf`.

The grill question was "composes from `.bo-data-table` at spacious, or
needs its own single-column task-row shape?" The answer was already sitting
in the codebase: `ScanToReceive.astro`'s own receiving log — the SAME
component this profile has shipped since 59.4 — is a `.bo-data-table` at
360px inside `goods-receipt-rf`, and it already works (narrow columns,
scans top-to-bottom). A task queue ("what's next") is the identical shape:
2 narrow columns (task label, status), read top-to-bottom, never
cross-referenced. **No profile change needed** — `data-table` was already a
member.

One real risk checked and closed: `data-table.css` auto-compacts below a
30rem (480px) container (`@container bo-table (max-width: 30rem)`), and that
compaction is described in its own source comment as "deliberately TIGHTER
than `data-density="compact"`" — the opposite direction from RF's spacious/
glove-target requirement. At 360px this query WOULD fire. It does not
collide here because a 2-column table never needs the compaction rescue in
the first place (compaction exists to save a table with too many columns
for its container, not to fight density) — confirmed by rendering the queue
in the fixture: rows stay at spacious height in both themes. Worth stating
plainly for whoever adds a 4+ column RF list later: check `data-table.css`'s
`@container bo-table` rule against `spacious` at 360px before assuming this
composition scales past 2-3 columns.

## 3. RF list (editable) — REFUSE

Not built. Documented as a refusal, in place, on `/patterns/rf-list#editable-refused`
rather than only in this report — a reader who reaches for it finds the
reasoning where they'd look, not just in `.roundtable/`.

RF data correction is a one-field-at-a-time **scan flow** — barcode, then
quantity, then confirm — which `/patterns/goods-receipt` already ships and
documents. Grid editing (`.bo-editable-grid`) assumes a pointer for
cell-to-cell navigation and enough width for multiple editable columns;
neither holds one-handed, gloved, at 360px. Forcing an editable variant of
the RF list would be the RF track absorbing the app catalogue's shape
instead of keeping its own (109.6's founding rule: RF is a track, not a
group member, precisely because its device/usage/browser floor differ on
every axis from desktop/tablet). This matched the roadmap entry's own
stated expectation ("expect REFUSE").

## 4. RF form (generic "scan task" extraction) — REFUSE

Not built, no new page. `/patterns/goods-receipt` already demonstrates
scan-first sequential entry — scan field always focused, quantity stepper
at spacious density, live-region confirmation. Extracting a generic "RF
form" pattern from it would produce a second page whose entire content is
"see goods-receipt, but with the nouns removed" — the exact re-photographing
the 109.5 shape-not-domain rule and the Objective's less-for-more test both
refuse. Goods receipt already IS the documentation of this shape; the RF
form "candidate" is goods-receipt under a more generic name, not a
different pattern. Re-open condition: if a second RF scan-entry screen ships
with materially different anatomy (not just different domain nouns), extract
then, from two real examples instead of one imagined one.

## 5. Dropdown → full-screen picker — DOCTRINE, no component

Not built, and per the roadmap entry's own instruction the native-first
question had to be measured before building anything. What was checked in
this codebase: `.bo-select` (`packages/core/src/css/components/form/select.css`,
already an `rf-essentials` member) is `appearance: none` styling applied
directly to a real `<select>` — no JS reimplements it as a custom popup (that
job belongs to the separate `.bo-dropdown` component, which is NOT in the
RF profile and was never a candidate here). Because the element stays a
native `<select>`, the browser — not this framework's CSS — owns what
happens on open. On Android, WebView's default `<select>` rendering
delegates to the OS picker, which is a full-screen (or near-full-screen)
native dialog, not a small anchored popup — this is documented,
long-standing Android WebView behavior going back to Android 3.0/4.x, not
something introduced at the Chrome-108 floor. **This was not re-verified
inside an actual Android WebView in this session** (no device/emulator in
this environment) — stated plainly rather than claimed as measured, per the
project's own rule that an unverified gate must say so, not report a clean
pass it didn't earn.

**Verdict: doctrine line, not a component.** "RF uses native `<select>`" —
already true today, zero build, zero profile change. Belongs in the RF
track's guidance ("Not for" -style note) rather than as a queued build item;
recorded here so it doesn't get re-asked as if unresolved.

## What shipped vs what was refused

| Candidate | Verdict | Artifact |
|---|---|---|
| RF landing (metro/bento) | BUILD | `/patterns/rf-landing`, `dashboard/dashboard` added to profile |
| RF list (display) | BUILD | `/patterns/rf-list`, no profile change |
| RF list (editable) | REFUSE | documented in-page (`#editable-refused`) + here |
| RF form (generic extraction) | REFUSE | documented here; goods-receipt stays canonical |
| Dropdown → full-screen | DOCTRINE | native `<select>` already does this; no component |

## Verification note — the served CSS was stale, caught before screenshotting counted

First screenshot pass at 360×640 showed the task tiles as unstyled links in
a single column with badges detached from their labels — no grid, no
border, underlined text. `packages/core/dist/css/rf-essentials.min.css`
(rebuilt, 33,738 bytes, containing `.bo-widget-grid`) was correct; the file
actually served by the local static server was 30,843 bytes and contained
zero `bo-widget` occurrences. Traced to this session's worktree
environment: the isolated worktree ships without its own `node_modules`,
and the workaround (symlinking the parent checkout's `node_modules`) carried
a stale relative symlink for the `@busy-office/ui` self-reference
(`node_modules/@busy-office/ui -> ../../packages/core`, resolved through the
*parent* checkout's `node_modules`, i.e. the wrong `packages/core` — not
this worktree's rebuilt one) — `copy-framework-css.mjs`'s
`require.resolve('@busy-office/ui/css/rf-essentials.min')` followed that
link straight to a stale build. Fixed by re-linking `node_modules` per-entry
with `@busy-office/ui` pointed at this worktree's own `packages/core`
absolute path, confirmed via `require.resolve` before re-screenshotting.
Recorded per CLAUDE.md's own rule ("Podman can serve a stale image from
cache — confirm the served CSS actually contains your change") — the same
failure mode, different cache.
