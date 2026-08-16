# Grill: Slice 20 (docs hardening & depth) — Objective review at slice close

2026-08-16, milestone-rule dispatch. Four seats (Architect / Skeptic /
A11y+Docs / Consumer-ERP) run as parallel read-only agents. Evidence bar
per LOOPS.md: ≥2 independent seats or seat + code-walk.

## Convergent findings (Evidence)

**E1 — Slice 20's mechanisms fail OPEN and SILENT.** Architect's
strongest objection + Skeptic's P1, independently: the highlight
transform's `<pre><code>` regex requires a zero-attribute `<pre>`, so
the six hand-written blocks in `index.astro` (`tabindex="0"`,
`class="install"`) and theming's two scoped blocks shipped
UNHIGHLIGHTED — on the highest-traffic page — while the build printed a
green count. The strip-regex and hex-gate are structurally unable to
both fail (post-strip scan, hex-free style). The palette parse is one
comment-edit away from breaking (`[data-theme="dark"]` literal split; a
brand file's own comment already nearly contains it), and var()-valued
tokens would render invisible swatches ungated. The pattern: depth was
added without the assertions (blocks>0 AND none-left-behind,
exactly-two brand blocks, hex-only values) that make it verifiable.

**E2 — tree-table breaks at structural seams.** Architect (FLAWED) +
Skeptic (two code-confirmed P2s) + Consumer:
- `descendants()` stops at the `</tbody>` boundary — a per-tbody-grouped
  table (normal ERP shape; the docs page itself has 3 tbodies) collapses
  only within the first, silently.
- A missing/typo'd `data-tree-level` coerces to 1 and truncates the
  subtree — chevron flips "collapsed" over fully-visible rows.
- CSS indents only levels 2-6 while JS accepts any depth; real BOMs hit
  8-12 (Consumer: depth is the customer's engineering data, not a
  "modelling smell" the UI may judge — the docs claim is dismissive).
- No event is dispatched on toggle → no documented hook for
  fetch-on-expand (htmx lazy branches), and no volume guidance for
  10k-row BOMs; expand-all / expand-to-level — the most-used real BOM
  controls — have neither affordance nor recipe.
- The demo's static `aria-label="Collapse Pump assembly"` never updates
  (Consumer flags it as an Objective/Simplicity violation). Correct
  disclosure practice: name the branch WITHOUT the verb and let
  `aria-expanded` carry state — a docs fix, not framework code.
- Tests: one fixture, single tbody, all-valid levels — none of the
  above paths covered.

**E3 — the Palettes page ships a real WCAG 1.4.3 failure.** A11y seat,
measured: the "light values only" preview scopes light accent tokens
onto a box whose surface goes dark in dark mode — mauve accent-text
2.10:1, mist 2.11:1 — on the page whose premise is "every pair is
gated". The gate never checks cross-theme pairs, so it can't catch it.

**E4 — version-switcher operations fail under real-release pressure.**
Consumer (WRONG) + Architect: three manual unlinked steps; the likeliest
slip (versions.json entry without a committed snapshot dir) ships a live
404 that no gate catches. Snapshots keep the search button but their
pagefind is stripped → dead search dialog inside every snapshot.
Snapshot dropdowns freeze at cut time (a 0.1.1 reader never learns 0.2.0
exists) and there's no visible frozen-docs banner for deep-linked
readers (`currentSnapshot` is already computed — a two-line banner).

## Single-seat findings (graded)

- H1 (Skeptic, code-confirmed): `&#38;` decodes before `&amp;` — one-line
  order fix; latent (Astro never emits it) but wrong.
- H2 (A11y): IA smells — Tree table appended 5 items from Tree (they're
  the disambiguation pair); Palettes after Motion instead of beside
  Colors & tokens.
- H3 (A11y): tree-table page never states its keyboard story (its own
  sibling Tree page does); the raw ADR path in prose is unclickable dead
  weight; the versioning known-gap note is buried.
- H4 (A11y): swatch cells should be aria-hidden; attr-names as the most
  muted token is odd salience (cosmetic).
- H5 (Consumer): palettes never say WHY status colors are out of scope
  (semantic stability across brands) — one prose fix.
- H6 (Architect): a base containing "/v/" would confuse siteRoot —
  hypothetical for this deployment; note only.

## Examined and held (verified by the seats)

Idempotent re-highlight; text/comment nodes between rows;
toggle-outside-tree-table guard ordering; hidden-rows-are-summed doc
claim matches code; switcher listener properly scoped (not delegated);
detectLang in practice (2/117 fall through, both legitimately);
`BLOCK.lastIndex` handling; swatch hex adjacency (1.1.1 satisfied);
highlighting correctly claims nothing a11y-wise and every slot IS gated
at 4.5 in both themes. Architect's "no path back to latest from inside
a snapshot" was checked against the live layout: docs pages inside the
snapshot DO carry the working switcher (verified during item 3); the
landing page lacks it on latest and snapshot alike (it has no docs
header) — reframed under E4's banner gap rather than a broken escape.

## Outcome → Slice 21 (hardening), ranked

1. Highlight integrity (E1+H1): match attributed `<pre>`s (or normalize
   the hand-written ones through the transform), add the
   none-left-behind gate (fail on surviving `<pre...><code` in dist),
   harden the strip (fail if no strip occurred), fix entity order.
2. Palettes conformance (E3+H4+H5): preview scopes the full light
   surface/text/border set (or renders light+dark boxes each on its own
   background); parse assertions (exactly two blocks, hex-only values);
   aria-hidden swatches; the status-colors why-not paragraph.
3. Tree-table seams (E2): span tbodies in descendants(); guard
   missing/invalid levels honestly; indent to level 12; dispatch
   bo:tree-toggle (the lazy-load/expand-all hook) + volume guidance +
   expand-to-level recipe; verb-less disclosure naming in all demos;
   the six uncovered test paths.
4. Switcher operations (E4): one-command release (script writes
   versions.json) + a gate that every entry has a committed snapshot
   index; frozen-docs banner from currentSnapshot; hide search UI when
   pagefind is absent; frozen-dropdown note.
5. Docs/IA batch (H2+H3): Tree table beside Tree, Palettes beside
   Colors & tokens; keyboard line on tree-table; ADR link → repo URL;
   surface the known-gap note.
