# Color-docs presentation research (Slice 22 item 1, compare-first)

Fetched live 2026-08-16: Tailwind /docs/colors, Radix Colors (+
understanding-the-scale, scales), Carbon color overview/tokens (v10
mirror for the truncating v11 pages). Full per-site notes in the
research agent transcript; the five adopted choices:

1. ONE full-bleed grid — hues as rows, steps as sticky column headers,
   the whole system in a single scroll (Tailwind).
2. Click-to-copy with a modifier for the alternate format, always
   showing what was copied — default copies the VAR NAME, shift+click
   the hex (Tailwind's mechanism, our default flipped to the token).
3. Every step gets a documented ROLE, adjacent to the grid — role
   labels annotated above the step columns ("backgrounds | states |
   borders | solid | text") so the grid self-explains (Radix's step
   semantics, fixing its read-a-second-page-first flaw).
4. Light and dark as PAIRED rows under the same step numbers, not a
   toggle (Radix) — proves a step means the same role in both themes.
5. Tokens page as a table: name / role / resolved value per theme, hex
   always visible, cross-linked both ways to the raw swatch it
   resolves to (Carbon's role-adjacency, closing its palette↔token
   page-hop gap).
