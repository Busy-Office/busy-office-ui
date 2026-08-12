# Grill: website content proposal · 2026-08-12

Three seats fitted to a content/IA artifact: Adopter (Devi), DevRel (Mara),
Maintainer (Sable). Artifact: `.roundtable/site-proposal-2026-08-12.md` (v1).

## Verdicts

| Seat | Verdict |
|---|---|
| Adopter | **GO on the restructure** — gated on D-1 (JS behaviors have no home) |
| DevRel | **Ship — M1/M2 claim fixes as gates** |
| Maintainer | **REQUIRED changes before build** — F1 drift mechanism is non-negotiable |

## Convergent findings

1. **The hero claims are the DESIGN.md-drift hazard moved to the most public place**
   (D-5 + M1 + M2 + F3 — all three seats). "WCAG AA both themes" is refuted by the
   project's own linked review trail (standing NEEDS-RUNTIME ledger, VoiceOver not
   done) and by the record of the dark-badge failure; "37 kB" is minified-not-gzipped
   (convention says quote compressed — likely ~8-10 kB, an UNDER-claim); "zero runtime
   deps" skim-reads as "zero JS". Rule adopted: **every landing number is
   script-derived or evidence-linked, and CI-checked** — same discipline as the CSS.
2. **The API tables are the semver contract, so they must be machine-true** (F1
   CRITICAL + D-4 + D-6). The versioning policy defines breaking changes by documented
   class names — a drifted table redefines semver silently. One mechanism solves three
   findings: extract classes/variants/data-attrs/tokens from the CSS at build time
   (PostCSS walk, precedent: the named-container build check), render tables AND the
   missing global class index (D-4) from that data, hand-write only ARIA/prose. CI
   diff-gate as the floor.
3. **Everything that isn't CSS got orphaned** (D-1 BLOCKER, D-2 HIGH, D-3 HIGH). JS
   behaviors own no page; the primitives page regressed out of the sitemap; the
   brand.css recipe has no address. The IA quietly became "CSS-only" for a framework
   whose identity is "CSS-first".
4. **The component count is wrong**: 14, not 13 — stepper and audit trail ship in dist
   with no docs page at all (F1). Undocumented-but-shipped is the "undemoed =
   untested" finding in docs form.

## Single-seat findings that stand

- **F2 (HIGH)**: five live URLs move — name the redirect map now (Astro `redirects`,
  base-path-safe); cheapest moment ever.
- **M3 (HIGH)**: no bridge from `npm i` to "adopt for 200 screens". At v0.1 with zero
  users, **cheap exit is the social proof**: a "Pilot one screen" section built from
  à-la-carte imports + the cascade escape hatch + the versioning promise.
- **M4**: cut "not utility soup" from the hero (the anti-Tailwind drawer is Pico's,
  and it's the wrong drawer); keep the side-by-side evidence card, labeled neutrally.
- **M5**: never bare-link the grill trail — narrate outcomes first ("N blockers, all
  fixed or on the public ledger; two rules now build-enforced").
- **M6**: the hero live table must be specced for 375px (scroll-in-card with sticky
  first column — itself a feature demo) and zero-CLS density toggle.
- **D-7**: the tutorial must include a full copy-paste HTML skeleton, real import
  specifiers, toolbar+pagination, end-state screenshot; add a no-npm path (CDN/zip).
- **D-8**: Troubleshooting page (this framework's failure modes are unusually silent)
  and `llms.txt` (agents are first adopters in 2026).
- **F4**: honest scope: ~35 pages, ~2/3 net-new writing; the component template MUST
  be a shared Astro layout, not a copy-paste convention.
- **F5**: Pagefind needs a pages.yml post-build step — small, but the pipeline isn't
  untouched.
- **M7 [HUMAN CALL]**: the `eof-` prefix needs a public one-liner or a pre-1.0 rename
  (`bo-`?) — the site freezes it into every snippet. Recommended default: keep `eof-`
  with the one-liner ("collision-safe, greppable"), rename only if the owner already
  dislikes it; cost of renaming later is a major version.
- **M8**: browser floor moves up (hero footnote/Installation link) — it's a
  qualifying filter, and filtering early is a conversion feature.

## Revised proposal (v2) — deltas from v1

**Sitemap changes:**
- Core concepts gains **JS behaviors** (the delegation model, import specifiers,
  what breaks without init, swap guarantees) — closes D-1.
- Base styles gains **Layout primitives** (restored + API-table treatment) — D-2.
- Getting started: Installation gains the no-npm path; **Troubleshooting** added;
  the brand.css recipe explicitly lives ON the Theming concepts page (no split) — D-3.
- Components: **14 pages** (stepper + audit trail added).
- Reference additions: **generated class index** page; **llms.txt** build artifact.
- Redirect map declared: /htmx → /getting-started/htmx, /printing → /base/print,
  /tokens → /base/colors (+ concepts/tokens), /theming → /concepts/theming,
  /primitives → /base/primitives.

**Landing changes:** hero says what it IS (no negation); numbers become
"~X kB gzipped · zero dependencies, JS optional · AA contrast verified per token
pair, both themes" — each script-derived and linked; browser floor as hero footnote;
review-trail section narrates outcomes before linking; NEW "Pilot one screen"
adoption-bridge section; hero table specced for mobile + zero CLS.

**Mechanism requirements (build gates):**
1. `scripts/extract-api.mjs`: PostCSS walk over component CSS → JSON (classes,
   variants, data-attrs, tokens) → renders API tables + class index + llms.txt;
   CI fails on table drift.
2. `scripts/check-contrast.mjs`: computes WCAG ratios for both themes from token
   values → renders the Colors page tables → CI gate. Landing numbers (gzip size)
   computed at build.
3. Component template = shared Astro layout with a JS-requirement field, required-vs-
   optional markup parts, and per-feature browser notes (D-6 columns).
4. Astro `redirects` block before any page moves.

**Execution order (revised):** mechanisms (1-3) + template + redirects → component
retrofits (parallel) + concepts/base pages (parallel) → landing (frontend-design
skill) → tutorial + troubleshooting → search + llms.txt. API tables land BEFORE the
landing (D-9: the landing convinces once, reference serves daily).
