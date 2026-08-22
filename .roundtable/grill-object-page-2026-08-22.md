# Design grill — `/patterns/object-page`, comprehensive (roadmap 102.2)

Owner ask, 2026-08-21: score this pattern on the six DSA dimensions like a
component, then grill the screen as a whole (anchor navigation, sticky
action bar, 390px, print, states table). Measured live — fresh build,
nginx bind-mount of `apps/docs/dist`, puppeteer-core via the project's
`browser-harness.mjs`, both widths (1440/390), both themes.

A prior single-screen grill exists
(`design-grill-object-page-2026-08-20.md`, all-keep) but predates the
108 P0 sticky-bleed-through fix and the 109 sidebar regroup — this pass
re-verifies against the CURRENT build rather than trusting that result.

## DSA dimensions (rubric.definitions in `dsa-scores.json`)

Patterns aren't part of the scored-`components` system (`check:dsa-scores`
only scans `src/pages/components/*.astro` for `<DsaScore>`), so this is a
report-only scoring pass, same rubric, no entry added to the JSON file and
no `<DsaScore>` badge rendered on the page — adding either would make
`check:dsa-scores`' orphan check fail for a page type the gate was never
built to cover.

| dimension | score | citation |
|---|---|---|
| typography | 3 | Zero raw font sizes in the page's scoped `<style>` block; all class-based (`.op-anchors`, `.op-section`) carry no size literals at all. |
| colour | 3 | `.op-sticky { background: var(--bo-color-bg-canvas); }` — token, not raw. No hex/rgb anywhere in the file. State badges (`Pending approval`, `Partial`, `2 days late`) use existing two-channel `bo-badge` variants. |
| spacing | 3 | `inset-block-start: calc(-1 * var(--bo-space-6))` is a token. `scroll-margin-block-start: calc(7rem - var(--bo-space-6))` is the one intrinsic literal (`7rem`), and it carries a 9-line comment stating why it's intrinsic (sized for the collapsed-header state) plus its own regression history — meets the "intrinsic literal carries a comment saying why" bar exactly. |
| interaction | 3 | States the platform/behavior line explicitly: *"Every part of this screen is a component that already ships — the only thing added is `initAnchorNav()`, and it writes no CSS."* Also draws the tabs-vs-anchor-links distinction in Anatomy ("Reads like tabs, is NOT `role="tab"`"). |
| content | 3 | Opener carries the required clause: **"Not for a record you can take in at one glance"** — names the wrong context and links the alternative (`record-detail`). |
| fit | n/a | The rubric's `fit` definition is written for field-type × context placement (the field matrix on `/concepts/design-language`), which doesn't extend to a whole-screen pattern. Not scored rather than forced. |

All-3 where applicable. Consistent with the prior grill's finding that this
page was built via a self-correcting Explore spike rather than assembled
for docs — not a rubber-stamp: see the live defect found below, which
scoring-by-reading (not scoring-by-assuming) caught.

## Screen-as-a-whole grill

**Anchor navigation** — `aria-current` moves correctly on scroll at both
widths (re-verified against `check-claims.mjs`'s own probe, still green).
Keyboard: `tabindex="0"` on the scrollable nav, confirmed reachable.

**Sticky action bar** — `.bo-form-actions`, already sticky + print-hidden,
unchanged since the last grill.

**390px — one real, small, reproducible defect found.** Scrolling to any
section (`#delivery` used as the probe, matching `check-claims.mjs`'s own
target) lands the reader with the section's own `.bo-widget__title` **2.25px
under the sticky chrome**, at 390px only:

| width | sticky bottom | title top | overlap |
|---|---|---|---|
| 1440 | 140.0px | 155.75px | none (15.75px clear) |
| 390 | 262.0px | 259.75px | **2.25px obscured** |

Root cause, measured: the collapsed sticky wrapper is **18.375px taller at
390 than at 1440** (216.375px vs 198.375px) — the object header's title +
badge wrap to two lines at narrow width (visible in the screenshot below),
adding height even in the collapsed state. `scroll-margin-block-start` is a
single fixed `7rem` value tuned against the 1440 height, so it undershoots
by almost exactly the wrap delta at 390.

This is the **same defect class** the page's own code comments already
document finding and fixing twice (48.3: 110px overshoot when the header
collapse landed; 108.1: 26px undershoot after the sticky-padding fix) — a
third, much smaller occurrence the *existing* `check-claims.mjs` probe
cannot see, because it only asserts `aria-current` moved to the right href,
never that the landed section's own content clears the sticky chrome.
Confirmed reproducible (re-measured at a 1200ms settle, not a scroll-
animation artifact) and confirmed **not** visually obvious — a screenshot
at the landed position shows no perceptible clipping (title renders intact,
`op-390.png`, kept locally, not committed).

**Verdict: fix, but not rushed.** 2.25px is below any threshold this
project has treated as a real regression before (the two prior fixes were
26px and 110px — both plainly visible; this one visually is not), and both
prior fixes required "real debugging, not just adding CSS" per their own
commit messages. Patching the `7rem` constant under time pressure, without
the same live multi-width/theme verification discipline those fixes used,
risks trading a 2px invisible defect for a visible one. Queued as
**roadmap 102.8** with its own Accept criteria rather than guessed at here.

**Print** — `check-claims.mjs`'s existing probe (`opPrint`) still passes:
action bar `display: none`, every section stays visible. Unchanged.

**States table** — present, six rows (loading / empty section / error in
one section / read-only / conflict / print), matches CLAUDE.md's pattern
recipe exactly. Not a finding; confirming it's still there since the recipe
gates on this shape.

## Verdict per element

| element | verdict | why |
|---|---|---|
| Opener (who/what-done/wrong-choice) | keep | unchanged, correct |
| DSA dimensions (typography/colour/spacing/interaction/content) | keep | all cite real evidence, none forced |
| `fit` dimension | not scored | rubric doesn't extend to whole-screen patterns; forcing a number would be noise |
| Anchor nav (`aria-current`, keyboard) | keep | re-verified live, unchanged |
| Sticky action bar | keep | unchanged |
| 390px anchor-landing gap | **fix (queued, 102.8)** | real, measured, reproducible, invisible-but-real — same defect class as two prior fixes, deliberately not rushed |
| Print behavior | keep | re-verified via existing gate |
| States table | keep | present, matches the pattern recipe |

## Gates

Core build, docs build (13 chained gates incl. page-shape/wrong-choice/
dsa-scores), stylelint, and `check:claims` (including both existing
object-page probes) all green on this exact build — the 2.25px finding is
real but does not fail any standing gate, which is itself the finding: the
existing probe measures the wrong thing to catch it.
