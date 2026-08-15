# Docs IA comparison vs. Tailwind / shadcn / Bootstrap / Pico / DaisyUI (2026-08-16)

Triaged from user wishlist: "well structure framework document — pls compare
with other CSS framework. how they arrange the content to make it easy to
understand, make the user like to use it, easy to navigate."

## Research summary (5 frameworks, fetched live)

| # | Pattern | Who does it | busy-office-ui before | Action |
|---|---|---|---|---|
| 1 | Install → first real usage in one sequence, ending on a visible result | Tailwind, Pico, Bootstrap | Already true (`getting-started/installation.astro`, `your-first-screen.astro`) | none needed |
| 2 | **Demo-first, spec-last** — API/props table always LAST, zero exceptions across all 4 component-catalog sites studied | Tailwind, shadcn, Bootstrap, DaisyUI | **Violated on every one of 24 component pages** — `ClassRef` (quick-ref table) sat right after the opener, before any demo | **Fixed** — see below |
| 3 | Sidebar taxonomy matches how a user thinks (task-based or concept-based), never mixes axes, ≤2 nesting levels | Tailwind (by CSS concept), DaisyUI (by UI task: Actions/Feedback/Navigation/…) | One flat 22-item "Components" list, no grouping logic, plus a separate 3-item "Data display" — an inconsistent partial grouping | **Fixed** — regrouped by task, 5 groups |
| 4 | Prominent `⌘K` search | Tailwind, DaisyUI (present); Bootstrap, Pico (absent — flagged as their weak point) | Already present (pagefind + Cmd/Ctrl-K palette) | none needed |
| 5 | Hero pitch backed by a falsifiable number, not adjectives | all 5 | Already true (landing `<dl class="meta">`: gzip kB, behavior count, contrast pairs — all computed at build) | none needed |
| 6 | One interactive element visitors can manipulate before installing | DaisyUI (33-theme live switcher), Tailwind (live dark-mode/breakpoint demo) | Already true (landing hero: live density + theme switcher re-skinning a real table) | none needed |
| 7 | Nesting capped at 2 levels regardless of catalog size | Bootstrap (27 components), DaisyUI (68) both hold the line | Already true, still true after the regroup (5 groups × 3–10 items, no sub-nesting) | none needed |
| 8 | "Why/philosophy" is its own stable page, separate from "how" | shadcn ("Introduction" ≠ "Installation" ≠ Components) | Already true (`concepts/cascade.astro` is the philosophy page, separate from `getting-started/`) | none needed |

**Net finding: busy-office-ui already had 6 of 8 patterns right** (search,
quantified pitch, interactive hero, shallow nesting, philosophy/how split,
install-to-result flow). The two gaps — spec-before-demo ordering and flat
sidebar taxonomy — were real and are exactly the two changes made this pass.

## What shipped

1. **Demo-first, spec-last, all 24 component pages.** `ClassRef` moved from
   right after the opener to immediately before `ApiTable`, at the end of
   the page (mechanical move, content untouched). CLAUDE.md's documented
   skeleton, the `check-page-shape.mjs` gate comment, and `new-component.mjs`
   scaffold template updated so this is the shape by construction going
   forward, not a one-time fix that regresses on the next new component.
2. **Sidebar regrouped by task**, matching DaisyUI's approach: `Actions`
   (Button/Dropdown/Combobox), `Data input` (Forms/Filters), `Data display`
   (10 items — Data table/Pagination/Amount/Quantity/Date/Tree/Ordered
   list/Dashboard/Card/Byline), `Feedback` (Badge/Alerts/Progress/Stepper/
   Timeline/Loading-empty-error), `Navigation & layout` (Nav/Tabs/Dialog/
   Icon). Replaces one flat 22-item list + an inconsistent 3-item side group.
3. **Found while verifying, fixed same pass**: the button loading state
   (`data-loading="true"`) dimmed the whole element to `opacity: 0.7`,
   dropping white-on-accent text contrast to ~3.24:1 — well under AA's
   4.5:1 (axe `color-contrast`, serious, caught on the button page during
   the post-reorder scan). The documented contract already relies on the
   consumer's own text change ("Save" → "Saving…") as the visible signal, so
   the dimming was decorative, not load-bearing — removed it entirely rather
   than tune a fragile per-variant opacity value.

## Verified

Both link checks (plain + `DOCS_BASE=/busy-office-ui`), axe zero across all
56 pages × 2 widths, 32 visual baselines updated and re-passed, 57 tests,
stylelint clean, live-checked in both themes (button loading state confirmed
`opacity: 1` in dark).

## Not changed (checked, judged not broken)

- Nesting depth — new 5-group sidebar is still exactly 2 levels.
- `Data display` at 10 items is the largest group; matches DaisyUI's own
  largest category (also named "Data display") — not flagged as too big by
  any framework studied; a further split wasn't warranted by the research.
