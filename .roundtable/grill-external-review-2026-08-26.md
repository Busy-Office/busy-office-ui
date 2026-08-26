# Grill: the external framework review — 2026-08-26

Source: `.roundtable/external-review-2026-08-26.md` (owner-supplied, 26 Aug 2026).

**It found a P0 before this project did, and that is the headline.** §8 named a
live CI failure with the file, the import and the fix. It was real, it was mine,
and it is fixed in `23f931d`. A review that reproduces its own claims is worth
more than one that rates things, and this one did both.

Rated ~8.7/10 overall with the recommendation **not to restart**. The framing —
"the next gains are above the component layer" — is correct.

## Accepted

| § | Finding | Why it stands |
| --- | --- | --- |
| 8 / P0 | CI container build broken | Verified, fixed, and the Containerfile now records the third instance of this class |
| 21 | 129 behavior tests in one file | Cheap, obviously right, no counter-argument |
| 22 / P2 | `npm create busy-office` | 147.3 proves the path with a CHECK; a human still assembles the page by hand. Real gap. |
| 6 / P1 | Measure before building Screen Contracts | Already the plan — 112.3 gates 112.4 — and the review is right that it is the pivot |
| 13 | Structural metrics are tripwires, not truth | Reached independently this morning: four Polish rounds found content, never waste, and performance was reclassified a regression tripwire |
| 7 | Process machinery may outgrow user value | Fair. Three of six loop rounds today fixed instruments rather than the framework. |
| 20 | CI dependency graph over one long build chain | The docs `build` script is now ~30 steps and implicitly owns repo-wide validation |

## Refused, with the reason

**§8's architectural fix** — "prefer a generated manifest over docs→example
coupling". The manifest already exists (`gen-suite-index.mjs` → `suite.json`),
and it is **not where the coupling is**: the docs also copy the suite's 28 built
HTML pages and its stylesheet into `dist/suite/`. No manifest removes that. The
image needs the files because the kit *is* part of the docs now. The reviewer
inferred the fix from the error message without checking what else the build
does — which is the same shortcut this project's own doctrine warns against.

**§14's "design entropy report"** — most of its targets are already GATES, not
metrics. `custom CSS 0` is the suite's zero-CSS gate; `invented bo-* 0` and
`invented data-* 0` are `check-markup`, which as of today actually runs on the
suite. Turning an enforced binary property into a scored number is exactly the
mistake made and corrected this morning with the `ux` rubric dimension: **a
property that is either right or wrong belongs in a gate; a rubric is for what
can be better or worse.** The parts of §14 that are NOT already enforced —
nested surface depth, button variant count, status representation count — are
genuine and belong with `bo-check-screen`, which is P4 and correctly gated
behind the pilot.

**§16, one public package** — already true. `@busy-office/ui` is the only
package; no action.

**§11's `bo-check-screen` as an early item** — accepted in principle, refused as
a NEXT step. Building it before 112.3 reports is the intuition-over-evidence
move the review itself warns against in §6. It needs a contract to check
against, and whether that contract is justified is exactly what the pilot
measures.

## Corrections to the review

- **§18's figures are stale**: 25 screens (now 28), 281 classes (now 265). Read
  from a snapshot rather than the tree.
- **§30 P0 says "restore green main"** — done before this note was written.

## What this changes about priorities

Nothing, and that is worth stating plainly rather than manufacturing agreement.
The review's P1 is 112.3, which has been the top owner-blocked item since
2026-08-23; its P2 is a runnable starter, which 147.3 half-built today. The
review's value is not a new direction — it is **independent confirmation of the
existing one**, plus a caught regression and two cheap wins (§21, §22).

The one place it genuinely shifts weight: **§7 and §20 together**. Both say the
internal machinery is growing faster than the user-facing surface, and today's
loop log is evidence for it. That is a real signal and it is now a roadmap item
rather than a feeling.
