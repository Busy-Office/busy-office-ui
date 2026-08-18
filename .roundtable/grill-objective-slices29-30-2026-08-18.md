# Objective grill — Slices 29 & 30 at slice close (2026-08-18)

Dispatched by rule 5. Slice 29 was the owner's P0 (dropdown locked to the
viewport); Slice 30 was the wishlist, triaged and mostly built. 17 iterations
since the last Objective.

Evidence gate: ≥2 independent sources for `Evidence`, else `Hypothesis`.
Everything below is measured against git and the loop log, not recalled.

---

## H1 — The framework barely grew, and every addition was forced

| | |
|---|---|
| framework CSS | **+64 lines**, **4 new selectors** |
| framework JS | **+84 / −1** |
| docs source | +430 / −32 |
| gate scripts | +226 / −44 |
| executable claims | 20 → **26** |

Across two slices that shipped a P0 fix, an overflow affordance, a new pattern
page, a 50-column stress case and two guidance extensions, the public surface
moved by four selectors — three of them the `data-overflow` states that make the
tab fade conditional.

What makes that a finding rather than a statistic is what sits *next* to each
addition: arrows refused twice, a "field editor" component refused, a virtual
scroller refused, and the tab fade refused for the data table. Every one of those
refusals was decided by rendering the thing and looking at it — the fade dimming
the frozen column is the clearest case. The charter is doing work rather than
being quoted.

**Evidence.**

---

## H2 — The self-correction rate is the real story of these slices
**Seat: Skeptic (Rex) · process · HIGH · Evidence**

Counted from the log and commits, across 17 iterations:

- **3 mechanical-rewrite failures** — a case-only rename (`serve-dist.mjs` →
  `serve-DIST.mjs`) that passed locally because APFS is case-insensitive and
  broke Linux CI; the same regex damaging prose including a user-facing gate
  message; and a third that put an Astro component call inside a copy-paste code
  sample and labelled rows with other rows' names, forcing a full file revert.
- **3 unverified injections** — a red-proof believed while the grep confirming
  the injection had errored, targeted the wrong file, or searched for a minified
  spelling in a dist that is not minified.
- **2 bogus metrics** — CI wall time recorded from runs that had *failed*, the
  second one after I had already corrected the first.
- **1 over-fitted trend** — 30.6 raised on three ascending samples and closed
  unbuilt when two more showed 282 → 261 → 257.
- **1 CI break I had warned about in the same commit message** that shipped it.
- **1 unrecorded iteration** — a version release and a P0 fix logged as nothing.

Every one was caught, none reached the published site or the package, and the
gates did most of the catching. That is the system working. But the rate is high
and, more usefully, **the failures cluster**: they are almost all in *bulk
mechanical edits* and in *verification shortcuts*. None are design errors — the
refusals and compositions held up under scrutiny.

The fixes made so far are per-instance: a case-exact import check, a
two-consecutive-breach rule for metrics, "do this by hand" written into an item.
The class fix is different and is this grill's main recommendation: **a bulk edit
is verified against the RENDERED artefact, not the source diff.** That is what
finally caught the editable-grid damage — comparing rendered labels against each
row's actual content — after reading the source diff had missed it twice.

---

## H3 — Nothing has reached a user, for the third grill running
**Seat: Consumer (Devi) · FUNCTION · HIGH · Evidence · owner-blocked**

`npm view @busy-office/ui version` → **0.1.1**. 0.2.0 is tagged, `npm pack`-verified
and CI-green. Everything from Slice 24 onward — query tokens, staging, the P0
dropdown fix, four accessibility fixes, the tab affordance, the field editor —
is in the repository and in nobody's `node_modules`.

The Slice 28 grill said this. The Slice 26-27 grill said the same one level down
about the published site. Recording it a third time rather than quietly dropping
it, because a finding that keeps being true and keeps not being acted on is
worth more visible, not less.

---

## H4 — Grilling the wishlist before building paid for itself
**Seat: Chair · WORKING · MEDIUM · Evidence**

Two of the four wishlist items turned out to be **already built and unproven**
rather than missing: tab overflow scrolling was claimed in a CSS comment with a
3-tab demo that could never overflow, and the data table's sticky column was
claimed but never stressed past a handful of columns.

Both had real defects hiding behind the claim. The tab strip had no overflow
affordance at all on macOS — and three rounds of measurement proved no CSS
delivers one, which reversed my own decision against arrow buttons before a
mask solved it. The 50-column table proved the frozen column holds, then
revealed that "keyboard reachable" meant **~76 arrow presses** to reach the last
column, with `End` doing nothing.

Had these been built as asked — "scrollable slider tabs", "advanced wide table"
— both would have shipped new components on top of working mechanisms whose
actual defects would have survived untouched.

---

## Feeding back into triage

- **H2** → one queued item: write the rendered-artefact rule into `CLAUDE.md`,
  next to the red-proof discipline it belongs with.
- **H3** → already recorded as an owner call; not re-queued, only re-stated.
- **H1, H4** → recorded as held-up, no action.
