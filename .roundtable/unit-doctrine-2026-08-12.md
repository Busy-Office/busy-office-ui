# Proposed unit doctrine (pre-V2) · 2026-08-12

Artifact under grill: the CSS unit rules busy-office-ui adopts before the V2 site
freezes examples into every copy-paste snippet.

## Current state (audited)

- `rem` for nearly all sizing (spacing scale, font sizes, density heights, component
  dimensions). Zero `ch` anywhere.
- `px` in two roles: hairlines (16×1px, 9×2px, 3×3px — borders, focus rings,
  connectors) and container-query thresholds (480px table/stepper, 900px shell) —
  inconsistent with the one rem threshold (41rem widget grid).

## Proposed doctrine

1. **`rem` for space and size** — spacing tokens, density aliases, component
   dimensions, dialog/menu widths. Tracks the user's root font preference.
2. **`px` only for hairlines** — borders, focus rings, connector lines, shadow
   offsets. Visual weight must not scale with text size (a 1.25px divider is a blurry
   divider).
3. **`ch` for character-measured widths ONLY where the content is monospaced or
   prose**: `--eof-audit-time-width: 11ch` (mono timestamp column — replaces a
   grill-flagged magic number), optional `ch`-based width utility for code/ID inputs,
   and `max-inline-size: 70ch` prose measure on docs text. Never for alignment-
   critical layout, touch targets, or anything the density system owns (ch is the
   width of "0" — approximate in proportional fonts, shifts with font fallback).
4. **Container-query thresholds always in `rem`** — a query that gates content
   density must scale with the content's text (WCAG 1.4.4 interaction: px thresholds
   fire too late when users raise base font size). Migrate: 480px → 30rem,
   900px → 56rem.
5. Viewport units: only `100dvh` for shells/offcanvas (already the case). No `em` for
   layout (compounding); `em` acceptable inside a component for icon-to-text ratios
   only (currently one use: sort-glyph font-size 0.9em, code cells 0.9em).

## ERP-specific assumptions to challenge

- ERP users commonly: run Windows display scaling 125–150%, sit on 1366×768 or
  1920×1080 fleet laptops, raise browser zoom rather than font-size settings, keep
  apps open 8h/day at fixed zoom, and print.
- Density tokens in rem mean a user raising root font size gets proportionally
  larger rows — intended (it's accessibility), but an ERP admin may want density
  and text size decoupled. Is rem the right basis for DENSITY aliases, or should
  row heights be anchored differently?
