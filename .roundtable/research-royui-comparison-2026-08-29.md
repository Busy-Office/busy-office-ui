# Research — royui.dibbayajyoti.com's component-doc pattern, compared against this repo's own recipe (2026-08-29)

User-requested research, not dispatcher-triaged: "research how royui.dibbayajyoti.com document. Learn the pattern how components are present. What can we do to improve them?"

## What royui is, and why it's a different kind of thing

RoyUI is a React component library in the shadcn mould: components are **copy/import** into your own codebase, not an installed npm dependency you call into. Its four stated principles are RSC-ready, owns-styles, typed, copy/import — all React-specific and all about a distribution model this repo does not use. `@busy-office/ui` is CSS-first and npm-published; nothing about RoyUI's core distribution philosophy transfers, and this is stated up front so the comparison below doesn't read as "adopt RoyUI" — it isn't that.

## What was actually observed (3 pages: home, `/components/gradient-button`, `/components/popover`)

**Home**: nav is Components / About / search (⌘K) / GitHub. Homepage shows a hand-picked carousel, a "Principles" section (the four above), framework-compatibility badges (Next.js, Vue, Vite, Angular — inconsistent with "React library," not investigated further, out of scope).

**`gradient-button` page** (a simple, single-state component): Installation (4 package managers + import) → Usage, as **four separate variant demos** (default, loading, inline, disabled), each with a live preview AND a copy-able code snippet → a Props table (5 props, typed, with defaults). Straightforward, and structurally close to what this repo already does (demo-first, spec-last, generated-looking props table).

**`popover` page** (an overlay/panel, more complex): Installation → Usage (4 sub-variants: default trigger, custom trigger via `renderTrigger`, alignment, width presets) → **Theming** (CSS custom-property overrides scoped to `.royui-popover`, with a worked dark-theme example touching 7 named variables) → Props table → **Known Limits** (three items, stated plainly: no portal so it can clip on overflow, click-only with no hover variant, below-only placement with no auto-flip).

## The two sections that don't exist anywhere in this repo's docs

Checked by grep across `apps/docs/src/pages/components/*.astro` and `CLAUDE.md`'s component-doc recipe — neither "Theming" nor "Known Limits" is a section this repo's page-shape gate requires or that any shipped page carries.

**1. A per-component "Theming" section — LOWER value than it first looks, because this repo already ships the equivalent as data.** `ApiTable` already generates the custom-property surface a component exposes (verified: `dialog.astro` imports and renders `ApiTable`, which is generated from the shipped CSS, not hand-written — this repo's whole recipe is "never hand-write the API surface"). RoyUI's "Theming" section is hand-authored prose demonstrating a worked override; this repo's equivalent would be a *demo* built on top of the *already-generated* table, not a new data source. That's a real, small gap — not "we're missing token documentation," but "we don't show one worked example of overriding a component's tokens for a themed variant." Marginal value for a framework whose components are already meant to be visually complete out of the box; not filed as an item on its own merits.

**2. A "Known Limits" section — genuinely something this repo's recipe doesn't have a slot for, and it isn't the same thing as the required wrong-choice clause.** The wrong-choice clause (`check:wrong-choice`, required on every opener) answers *"should I use this component at all?"* — a routing question, answered once, up front. RoyUI's Known Limits answers a different question asked by someone who has ALREADY chosen the component: *"what will this NOT do for me, once I'm using it?"* (no portal, no auto-flip, click-only). This repo has that information — 26.1 documents `.bo-command-palette` has no fuzzy-match; the overflow-boundedness discussion this very session shipped in 196.1's data-table comment is exactly a known-limit statement — but it lives inside implementation comments and prose paragraphs a docs reader never sees, not in a scannable section on the component's own page.

## Recommendation

Filed as `LOOPS.md` Ideas-backlog entry below (a real gap, but untested against this repo's actual page-shape gate and existing content — needs an Explore spike, not a blind roadmap item, per this repo's own standard for new page-shape ideas). Everything else observed on RoyUI is either already covered here (demo-first-then-spec ordering, generated/typed prop tables, live interactive previews) or doesn't transfer (copy/import distribution, React-specific principles).

**Not filed, and why:** RoyUI's four-package-manager install snippet — this repo publishes one package via npm, and duplicating install-manager tabs for a single real command would be decoration, not information. The homepage carousel/hero pattern — this repo's Objective already rejected an equivalent for the same reason skeleton screens without a `Demo`-first ordering were rejected: it's marketing surface, not the docs recipe's job.
