# Objective review — the post-publish arc (2026-08-15)

Panel: Devi (Consumer) · Kofi (Platform) · Ines (Auditor) · Rex (Skeptic), per
PANEL.md. Question: with 0.1.1 public (npm + provenance, live docs, issues
intake), what is the next arc — deepen the surface, harden toward 1.0, or
invest in adoption?

## Verdict: HARDEN — unanimous, four different reasons that are one reason

- **Devi:** the CSS surface already covers her 40 screens; what stops a team
  committing is the **undocumented, un-versioned JS event contract** (BLOCKER)
  — `bo:row-save`'s payload is documented only as a code comment.
- **Kofi:** three **contract-level decisions** (unlayered-CSS interop story,
  `data-theme`/`data-density` attribute names, no-JS dark path) become breaking
  changes the moment adoption compounds; plus one latent bug shipped by
  build-tool accident.
- **Ines:** enterprise adoption dies at the procurement desk without an **ACR
  and AT evidence** — and the raw material (guarantees table, contrast.json,
  generated-docs pipeline) already exists, so it's cheap now.
- **Rex:** the project's differentiator is *verifiable promises*, and two of
  four headline claims are currently false or unverifiable on npm (README
  "37 kB" vs 57.4 kB shipped; "16 behaviors" hand-written; events not named
  semver surface). Deepening multiplies the drift; adoption markets claims
  that don't hold.

The common root: **the public contract lags the internal discipline.** The
repo's own doctrine (generate everything, freeze-audit Breaking rules) is
applied everywhere except the surfaces strangers read first — the npm README,
the versioning policy, and the JS integration layer.

## Confirmed defects found en route (not vision — fix regardless)

1. **README size claim false**: `packages/core/README.md` says "~37 kB
   minified"; shipped `index.min.css` is 57.4 kB (9.5 kB gz). Contradicts the
   landing page's own generated "56 kB" figure. (Rex)
2. **form-field.css comment/code contradiction**: source comment mandates two
   separate `:has()` rules so `:user-invalid` can't kill the `[aria-invalid]`
   path; the code is one comma list and only survives because postcss-nesting
   emits a forgiving `:is()`. A pipeline change silently reintroduces the bug.
   (Kofi)
3. **Combobox `inputFor()` full-document reverse lookup** — two comboboxes
   with colliding `aria-controls` after a partial swap is a stranger-shaped
   bug adjacent to the "survives any DOM swap" promise. Needs a test. (Rex)

## Conflicts the chair must surface

- Rex wants forced-colors **gated or the claim scoped** (7/25 components
  covered); the two-channel gate claim sits right next to the gap. No seat
  disagreed; cost is a sweep across 18 components.
- Ines's ACR + AT pass partially **needs the owner** (real AT hardware) — the
  loop can build the generated ACR skeleton and keyboard map, but VoiceOver/
  NVDA evidence stays NEEDS-RUNTIME.

## [HUMAN CALL]s

1. **`data-theme`/`data-density` attribute names** — unprefixed names are
   shared ecosystem surface (DaisyUI, Starlight, Pico use `data-theme`);
   renaming after 1.0 is impossible. Recommended default: **keep unprefixed,
   commit explicitly in the versioning policy** (cost: a host page whose theme
   switcher also writes `data-theme` collides; escape hatch = scoping docs).
2. **`--bo-palette-*` semver status** — 80 vars are de-facto public.
   Recommended default: declare them **internal, may change in minors**, in
   the versioning policy (cost: consumers who reached past semantic tokens
   break knowingly).
3. **AT hardware pass** (VoiceOver + NVDA on combobox/data-grid/live-region)
   — only the owner can run this; the ACR blocks on it for three criteria.

## Graduation → ROADMAP

- **Slice 14 — public-contract hardening** (the unanimous arc): generated
  README claims + drift gate; JS events/exports named semver surface with a
  generated events table; form-field source fix; combobox collision test;
  unlayered-CSS interop recipe; no-JS dark decision; forced-colors sweep;
  generated keyboard map + docs skip link; editable-grid recipe; po-app links.
- **Slice 15 — conformance artifacts** (partially owner-gated): generated ACR
  page; AT runtime evidence (owner); VPAT-ready export.

Not this arc (parked with gates intact): more components (no scenario
pressure), virtualization (re-open condition unchanged), adoption/outreach
investment (markets claims Slice 14 must first make true).
