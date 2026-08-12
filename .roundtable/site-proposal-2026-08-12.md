# Proposal: framework website content design · 2026-08-12

The artifact under grill: a content/IA design for the busy-office-ui site (landing +
docs), replacing the current flat 20-page gallery at
https://busy-office.github.io/busy-office-ui/.

## Sitemap

```
├─ Landing (/)
├─ Getting started
│  ├─ Installation          npm, all-in-one vs à-la-carte, JS behaviors, browser floor
│  ├─ Your first screen     tutorial: build the invoice list step by step
│  ├─ Using with HTMX       (exists, moves here)
│  └─ Versioning & upgrades (from theming page + CHANGELOG)
├─ Core concepts
│  ├─ Design tokens         the 4-tier model, with the WHY
│  ├─ Density               the flagship concept — its own page
│  ├─ Theming & dark mode   (exists, split: contract here, brand.css recipe stays)
│  ├─ The cascade contract  @layer order, "unlayered wins", escape hatches
│  ├─ Accessibility model   the two-channel rule, ARIA-as-state, what's YOUR job
│  └─ Container queries     the named-container registry, why bare queries are banned
├─ Base styles
│  ├─ Reset & typography
│  ├─ Colors                full swatch tables WITH hex values and contrast ratios
│  ├─ Spacing, radius, motion, z-index
│  ├─ Utilities             the curated .eof-u-* set, finally enumerated
│  └─ Print & reports       (exists, moves here)
├─ Components               (existing 13 pages, standardized per template below)
├─ Patterns                 invoice list · approval workflow · detail form · dashboard
└─ Example app              the PO demo: live link + annotated source walkthrough
```

## Landing page

1. Hero: name + "CSS-first UI framework for ERP and back-office — semantic
   components, not utility soup" + three numbers (37 kB · zero runtime deps · WCAG AA
   both themes) + install command + CTAs (Get started / Components). Beside it: the
   dense invoice table LIVE with density and theme switchers in the hero.
2. Six "why" cards, each with a live mini-demo or real code: Density is a dimension
   (toggle) · The cascade is the API (brand.css re-skin live) · Semantic HTML (table
   markup vs equivalent utility-class soup side by side) · Never color-alone, twice
   (badge + delta anatomy) · HTMX-ready (swap lifecycle) · Prints like a report
   (print-preview screenshot pair).
3. "Built with it": the PO app framed live + "reviewed like it matters" note linking
   the .roundtable/ grill trail.
4. Honest footer: browser floor, license, GitHub, versioning promise.

## Component-page template

Live demo → Markup (copy button) → API table (classes · variants · data-* hooks ·
ARIA contract · tokens consumed) → Density & dark behavior → Accessibility notes
(framework's job vs consumer's job) → Related patterns.

## Execution

- Restructure existing pages; new writing = landing, Installation, concept pages, API
  tables.
- Top nav (Docs · Components · Patterns · Example · GitHub) + grouped sidebar;
  Pagefind static search.
- frontend-design skill for the landing; docs interior keeps framework chrome.
- Ships on the existing Pages pipeline; localhost:8080 stays the consumer test rig,
  linked as "Example app".
- Order: landing → Installation + concepts → API tables → Base styles → search.
- Tone: sober enterprise with occasional wit (recommended; open question to owner).
