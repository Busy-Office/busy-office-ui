# Grill: the finished V2 site (live) · 2026-08-12

Three seats (Adopter, DevRel, Maintainer) against the deployed site + repo. This was
the first grill against the fully-built site — and it validated the project's rule
that finished artifacts get attacked: all three seats found live production defects
no proposal review could have seen.

## Verdicts

| Seat | Verdict |
|---|---|
| Adopter | NO-GO for 200 screens (npm, redirects, index links) · GO for repo-dist pilot |
| DevRel | Ship to HN after the one-line F1 fix — every hero number survived re-derivation |
| Maintainer | NOT publish-grade until S-1/S-2/S-7/S-6 — the gap is generated-vs-verified-deployed |

## Prior-gates closure (the good news)

Every content gate from the proposal grill verified CLOSED in the live artifact:
Adopter's D-1–D-8 (JS behaviors page, primitives, brand.css address, API tables with
JS-required rows on 14/14 pages, tutorial completeness, troubleshooting, llms.txt) and
DevRel's M1–M8 (honest hero numbers — she re-derived all six and every one was exact;
anti-Tailwind punchline gone; review trail narrated outcomes-first; prefix renamed).

## The round's lesson: "generated" ≠ "verified deployed"

Every live defect found lived in build output the generators wrote confidently and
nothing re-read at the real base path:

1. **All five redirect stubs 404'd in production** (Maintainer S-1 / Adopter A-2,
   CRITICAL) — Astro base-prefixes the stub's source, not the absolute destination.
2. **The class index and llms.txt linked `/components/alert/`** (S-2/A-3/A-4) — CSS
   dir `alert` vs page slug `alerts`; 19 of 131 index rows were dead, in the page
   whose whole point is trustworthiness.
3. **The pilot kB was computed from the unminified files while the snippet imports
   `.min`** (DevRel F1 / Maintainer S-5) — script-derived from the wrong artifact,
   sitting next to "verify it, don't trust it."
4. **Four in-content relative links 404'd** (A-5) — including the one at "components
   are inert without their init."
5. And the mechanism built to catch this class immediately found a **sixth** defect
   neither seat had: the index mapped utilities to `base/utilities`, a page proposed
   but never built.

## Outcome (fixed same day — verified in rebuilt dist, live after deploy)

- Redirect destinations base-prefixed; verified in built stubs.
- Slug alias (`alert`→`alerts`) in one place; `gen-llms` asserts every published URL
  against built output; `base/utilities` page created from generated data.
- **NEW STANDING MECHANISM: the dist link checker** — every docs build resolves all
  internal links (absolute AND relative, plus redirect-stub targets) against the
  built output; CI builds at the real Pages base path so the bug class is testable.
  1,174 links verified per build.
- Pages deploy gated on behavior tests (S-6).
- Landing: pilot kB from the exact `.min` files imported (2.8 kB gz); Bundle
  provenance visible and correctly linked; "15 pairs × 2 themes"; the "no JS"
  self-contradiction → "modern CSS instead of a runtime"; new hero cell "API:
  Versioned — classes, tokens, ARIA are semver surface" (DevRel's conversion fix);
  npm-honesty note ("Not on npm yet — pilot by copying dist/") until publish;
  the brand demo now models the family swap its own theming page mandates (A-7).
- Extractor: JS-hook classes registered (`__select-all`, `data-dialog-trigger`,
  `data-dismissible` — the CSS-true-but-not-JS-true gap, partially closed);
  utilities listing filtered to utility namespaces; class attribution
  primitives-first (fixes `bo-app-shell__main` → form mis-attribution); llms.txt
  gains the full semantic-token vocabulary with the dark-rule warning.

## Logged debt (next sprint, not launch)

- S-3 full form: a generated behaviors manifest (JS exports + hooks) merged into
  api.json/llms.txt — the JS surface is semver too and is still hand-asserted.
- S-4: derive contrast-pair candidates from component CSS co-occurrence and assert
  candidates ⊆ PAIRS (the pair list is the residual drift point); add missing pairs
  (text-primary on bg-hover/bg-selected/surface-raised).
- A-6: in-content cross-links on component/concept pages (the site navigates by
  sidebar only).
- NEEDS-RUNTIME ledger (Chrome/AT pass): pagefind behavior, hero at 375px, toggles,
  print output, VoiceOver items from earlier ledgers.
- npm publish (owner-deferred until "perfect"): the Adopter's blocker A-1 resolves
  the moment it ships; the landing is honest about it meanwhile.
