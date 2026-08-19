# RF scanner browser-floor study (2026-08-19)

Owner wishlist: an RF-scanner component supporting 5-6-year-old devices, and a
separated smaller-screen-only profile. Researched before building anything —
three parallel agents (device landscape, CSS floor audit, JS floor audit),
spot-checked against source before being trusted.

## What already exists — don't rebuild it

The scanning mechanics were spiked and shipped in Slice 6 (2026-08-14):
`initScanInput()` (zero new CSS) and `.bo-quantity` +
`data-density="spacious"` for the stepper, composed in `/patterns/goods-receipt`.
**That part of the ask is done.** What's new here is the *floor* and the
*profile* — how old a device can run what we ship, and whether a narrower
build is warranted.

## Recommended floor: Chrome/WebView 108, confidence MEDIUM

Researched, not assumed — Zebra TC52/TC57/TC72, MC3300, Honeywell CT40/CT60/EDA51,
Datalogic Memor 10/20 (the 2018-2020 RF fleet).

**The load-bearing fact**: "Enterprise Browser" on every one of these vendors
(Zebra, Honeywell, Ivanti Velocity) **renders through the device's Android
System WebView** — it is not a bundled older engine. So the WebView version,
not the app wrapper, is the real floor.

- **Optimistic**: devices that received any LifeGuard/MDM/Play update sit at
  WebView 138 (Android 8/9 ceiling, hit Aug 2025) or evergreen (Android 10+).
- **Pessimistic**: a fleet with Play blocked and *no* patch pipeline sits at the
  **factory image** — WebView ~61 on Android 8.1, ~74-77 on Android 10, ~83 on
  Android 11. This regime is real, unquantifiable (no public telemetry), and
  **no modern CSS framework meaningfully targets WebView 61-83** — that's
  Enterprise Browser/Velocity legacy-channel territory or a device refresh,
  not a CSS floor decision.
- **108 is the defensible middle**: it's the version every device that took
  even one patch in the last ~3.5 years has cleared, and it still includes
  container queries (105) and `:has()` (105/106) — the two features a
  density-aware framework actually needs.

**Stated honestly: this is a MEDIUM-confidence number**, not a measured one —
there is no public fleet telemetry. Treat 108 as a design target, not a
guarantee for a Play-blocked, patch-frozen fleet.

## What's already fine: the JS

Every RF-relevant behavior (`scan-input`, `quantity`, `dialog`, `alert`,
`validation-summary`, `table-sum`) sits at **exactly Chrome 80** today —
optional chaining and nullish coalescing are the only syntax above baseline,
and both post-80 Web APIs used (`checkVisibility`, `CSS.escape`) are already
runtime-guarded with working fallbacks. **No JS work is needed** for a 108
floor; it would only matter for a fleet below Chrome 61 (where `type="module"`
itself breaks), which is the same "out of scope" pessimistic tail as above.

## What isn't fine: the CSS, and by how much

Current framework floor is **Chrome 119** (driven by `:user-invalid`) — 11
versions above even the optimistic RF ceiling. Audited against 84 (a stand-in
low bar) with every version verified against `@mdn/browser-compat-data`:

- **Clean or near-clean once `@layer` is stripped**: tokens, scales, motion,
  the brand palettes, `amount`, `breadcrumb`, `filters`, `icon`, `kbd`, `kv`,
  `progress`, `skeleton`. (One correction to the audit's own list: `state.css`
  carries one `margin-block-start` — a logical property, not fully clean.)
- **Blocked by a small, mechanically-fixable set**: `button`, `quantity`,
  `alert`, `badge` — logical-property shorthands and one `color-mix()`
  declaration. A PostCSS pass targeting the floor (logical→physical, resolve
  `color-mix` to a static per-theme color) clears these without hand-editing
  source.
- **Blocked by real behavioral dependencies, need hand-written fallbacks**:
  `form.css` (error/required/disabled visuals are built on `:has()` /
  `:user-invalid` / `:is()`, all ≥88 — needs an `aria-invalid`-class fallback)
  and `data-table.css` (the `@container` density switch and `:has()` row-select
  highlight need class-driven replacements).
- Everything else in the component set either isn't RF-relevant or is blocked
  by the same handful of features (`:has()`, `@container`, logical shorthands,
  `dvh`/`svh`, `popover`).

**The whole bundle is currently a no-op below Chrome 99** regardless of any
single file's content, because `index.css` wraps everything in `@layer`.

## The right shape, per this project's own Objective

The ask as phrased — "a component… should be separated" — would, read
literally, mean forking a second design surface. That fails Objective §2
(less-for-more, refuse a second way to do something that already works) and
§3 (nothing ships for one screen). The actual gap is narrower and fits without
forking anything:

**Not a new component. A derived, lower-floor BUILD PROFILE of the existing
source** — the same shape as the per-component dist files that already exist,
one more build target. Source of truth stays one CSS tree; the profile is a
transform's output, not a hand-maintained fork, so it cannot drift the way a
copy-pasted "RF theme" would.

## Recommendation (queued as Slice 59, not built this turn)

Scoped, not attempted here — it is genuinely new build tooling (PostCSS
fallback authoring for `:has()`/`:user-invalid`/`@container`), and this
project's own discipline is to verify a new gate before trusting it, which
needs its own slice:

1. **`rf-essentials` build profile** — PostCSS pass at Chrome/WebView 108,
   covering the RF-relevant set (tokens, button, form, quantity, badge, alert,
   data-table basics, state, kv) plus the two hand-authored fallback layers
   for form and data-table.
2. **A floor-verification gate for the profile**, same technique as
   `derive-floor.mjs` run in reverse: assert nothing in the profile's OUTPUT
   exceeds the 108 target, using `@mdn/browser-compat-data` — not a claim,
   a build-time check.
3. **A narrow-viewport RF demo** using the profile, verified live at a small
   fixed viewport (e.g. 360×640, common RF scanner resolution) — this is
   where the "smaller screen" half of the ask is answered, not a separate
   component.
4. State the confidence caveat on the docs page itself: 108 is a design
   target verified against research, not a guarantee for a fully
   patch-frozen, Play-blocked fleet.
