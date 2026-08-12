# Slice-3 grill — dashboard, approval workflow, stepper, theming · 2026-08-12

Three-seat delta review (Auditor, Platform, Skeptic) of the slice-3 surfaces against
rendered docs (localhost:4173) and shipped `dist/`. Prior gates (08-11, 08-12) assumed
done; nothing found contradicting them.

## Verdicts

| Seat | Verdict |
|---|---|
| Auditor | Conditional — 3 required fixes (A1, A2, A3) |
| Platform | **NO-GO** gated on F1 (container fix), F3 dark-accent line |
| Skeptic | **NO-GO** gated on R1, R2 (+R3 patch) |

## Convergent findings (≥2 seats — CONFIRMED)

1. **Timeline/stepper state is invisible to screen readers** (A2 + R1, HIGH).
   Markers are `aria-hidden`, `data-state` announces nothing; done vs pending is gone
   and **done vs rejected is indistinguishable** — the core datum of an approval
   product. The same slice's stat tiles ship the correct visually-hidden-text pattern,
   so this is an unapplied known, and the docs' canonical markup currently teaches the
   inaccessible version. The CSS comment "state is never color-alone" is true visually
   and false programmatically.
2. **Both new unnamed `@container (max-width: 480px)` queries resolve against the
   wrong container** (F1/F2 + R2, HIGH). An element can't query itself; with
   `.eof-widget-grid` not a container, the nearest ancestor is `eof-shell` — so the
   widget `--span-2` collapse is a media-query-in-disguise, and in un-shelled apps it
   never fires at all, leaving `span 2` to deform a 1-column auto-fill grid (implicit
   phantom track) across a ~470px band of shell widths (~480–950px). The stepper's
   label collapse has the same wrong anchor, and its connectors (`flex:1`, basis 0, no
   min) squeeze to zero before the collapse ever fires. Bonus falsehood: the CSS
   comment says "each widget is a named container" — there is no `container-name`.
   This breaks the naming discipline the codebase itself established with
   `eof-table`/`eof-shell`.
3. **The theming example silently disables the framework's dark-mode remaps**
   (F3 + R3, MEDIUM-HIGH). Unlayered `:root` beats the *layered* `[data-theme=dark]`
   block for any token it sets — brand teal-600 accent survives into dark mode
   (~2.4:1 links on dark canvas), and the guide never states the rule: *every token
   set unlayered must be re-set in your dark block if dark differs.* Also omitted
   from the "whole framework" re-skin: `--eof-color-focus-ring` (stays blue) and
   `--eof-color-bg-selected` (selected rows stay blue); `accent-strong` gets no
   framework dark remap either.
4. **Audit-detail indent is a magic number** (A6 + F5 + R7 — three seats): `5.5rem`
   hand-tuned to the demo's `08-10 09:14` format; any longer timestamp misaligns.
5. **Dead `counter-reset: eof-step`** (F6 + R7): no counter is ever incremented/used.

## Single-seat findings that stand

- **A1 (HIGH)**: stat delta valence is color-alone for *sighted* colorblind users —
  ▲+12%-good and ▲+12%-bad are glyph-identical; arrow+sign encode direction, not
  goodness; the hidden text helps AT only. Needs a visible valence cue.
- **A3 (MEDIUM, NEEDS-RUNTIME)**: `list-style:none` on timeline/stepper/audit strips
  list semantics in Safari/VoiceOver — add `role="list"` to the documented markup.
- **A4**: delta ▲/▼ glyphs not `aria-hidden` → "black up-pointing triangle" noise
  before the hidden text (timeline/stepper hide their glyphs; inconsistent).
- **F4 (MEDIUM)**: current stepper marker prints white-on-white (no print rule;
  backgrounds don't print).
- **R4 (MEDIUM)**: undemoed = untested: `data-state="rejected"`, `.eof-stat--hero`,
  and the promised ✕ glyph appear in zero rendered pages; rejected titles aren't
  muted/differentiated and nobody has ever seen one.
- **R5 (MEDIUM)**: the versioning policy's API definition (class names) excludes file
  placement — the dimension DESIGN.md elevates to a contract and the dimension the
  `__footer` move already broke for pagination-only importers. No CHANGELOG exists.
- **R6 (MEDIUM)**: DESIGN.md now *under*-documents the system — zero mentions of
  widget/stat/timeline/stepper/audit, and the "JS surface — Slice 1:" heading lists
  slice-2 behaviors. Drift reversed direction; the authority doc no longer matches
  either way.
- **A5/A7, F7, R7**: `<time datetime>` for audit timestamps; done-connector green is
  decorative-only (pass, recorded); `done`+`aria-current` conflict resolves by source
  order but is undocumented; interactive stepper steps are out of contract and
  undeclared; ▲▼ font coverage on Android NEEDS-RUNTIME.

## What survived falsification (recorded)

Every computed contrast pair passes AA in both themes — the cleanest slice yet —
including the theming example's own values (5.5–7.3:1) and all dark markers
(5.7–12:1). `container-type` on `.eof-widget` is provably free of sizing loops given
the `minmax(min(…,100%),1fr)` tracks, and the widget→table compaction demo genuinely
works (the *named* `eof-table` query resolves correctly; only the comment's wording
oversells the mechanism). `font-variant-numeric: normal` on stat values correctly
shields them inside tables. Logical properties throughout; timeline geometry RTL-safe;
à-la-carte integrity holds (tokens-only dependencies, layer headers, real .min files).
ROADMAP's checked slice-3 items all have matching artifacts.

## Tensions

- **"Never color-alone" has two audiences and slice 3 satisfied exactly one each
  time**: stat tiles cover AT (hidden text) but not sighted-colorblind (A1);
  timeline/stepper cover sighted (glyphs) but not AT (R1/A2). The rule needs both
  halves stated in DESIGN.md: *a visible non-color cue AND a programmatic state.*
- **Container-query discipline**: named queries (`eof-table`, `eof-shell`) verified
  sound twice; both regressions came from bare `@container`. Panel consensus → build
  rule: **every `@container` in this codebase is named.** (Stylelint can enforce.)
- **Doc drift now runs both directions.** Grills 1–2 fought over-claiming; R6 is
  under-claiming. Same hazard: DESIGN.md stops being where claims are checked.

## Gate to slice-3 sign-off (union)

1. R1/A2 — visually-hidden state text ("completed," / "rejected," / "not started,") in
   timeline and stepper canonical markup + docs; keep glyphs aria-hidden.
2. F1/R2 — make `.eof-widget-grid` a named container (`eof-widget-grid`), retarget the
   span-2 collapse at ~41rem against it; name the stepper query (or retarget/document);
   `min-inline-size` on stepper connectors; fix the "named container" comment; demo
   `--span-2`.
3. A1 — visible valence cue on stat deltas (distinct good/bad glyph treatment).
4. F3/R3 — theming guide: state the unlayered-vs-dark-remap rule, add the dark
   `--eof-color-accent` line, name focus-ring/bg-selected/accent-strong as part of an
   accent swap.
5. A3 — `role="list"` on the three lists in documented markup.
6. R4 — demo rejected state, hero stat, and ✕ glyph (undemoed = untested).
7. F4 — stepper print rule.

Fast-follows: A4 (aria-hide delta glyphs), A5 (`<time>`), audit indent variable, dead
counter-reset, R5 (declare file placement in/out of API + start a CHANGELOG), R6
(DESIGN.md slice-3 inventory + fix the "Slice 1:" fossil).

## [HUMAN CALL]s

- **Container-naming build rule.** Recommended default: adopt "every @container is
  named" + stylelint enforcement. Cost: trivial now, prevents the only bug class that
  has recurred across grills.
- **File placement as API.** Recommended default: declare per-component dist file
  paths NOT-API until v1.0, add a CHANGELOG noting the `__footer` move. Cost: honesty
  paragraph; avoids freezing internals prematurely.

## Outcome (2026-08-12, post-grill fixes — verified in rebuilt dist + rendered pages)

Gate: **all 7 fixed.** R1/A2 → visually-hidden state text ("Completed:/Rejected:/Not
started:") in timeline+stepper demos and markup blocks; F1/R2 → `.eof-widget-grid`
and `.eof-widget` are NAMED containers, span-2 collapse retargeted at the grid's real
2-column threshold (41rem), stepper queries its own named container, connectors get a
minimum, the false comment fixed, span-2 demoed; A1 → bad deltas carry a visible ⚠
(two-channel valence), CSS contract comment rewritten; F3/R3 → theming guide states
THE DARK RULE, example re-sets `--eof-color-accent` in dark and swaps
focus-ring/bg-selected; A3 → `role="list"` on all three lists; R4 → rejected step
(with ✕ and danger title rule), hero stat, and span-2 all demoed; F4 → stepper print
rule. Fast-follows landed: delta glyphs aria-hidden (A4), `<time datetime>` (A5),
audit indent tokenized (`--eof-audit-time-width`), dead counter-reset deleted,
CHANGELOG.md created + file placement declared not-API until v1.0 (R5), DESIGN.md
gains the slice-1–3 component inventory, the named-container registry, and the two
standing build rules (R6). **Both [HUMAN CALL] defaults adopted**: the
container-naming rule is enforced at build time (build fails on bare `@container` —
verified: 0 in dist), and file placement is not-API with the `__footer` move recorded.

## Not this review

Print/report stylesheet expansion (open ROADMAP item), interactive stepper steps,
saved-view persistence, runtime AT/device passes (standing NEEDS-RUNTIME ledger).
