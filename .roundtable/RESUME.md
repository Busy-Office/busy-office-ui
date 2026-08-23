# Resume state — read this at Step 0 of every wake

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Only put things here that those two cannot say:
uncommitted work, and a decision made but not yet written down.

---

## In flight: nothing

Last updated 2026-08-23 22:35. `git status` clean, CI green,
**npm serves 0.5.0** (`latest`).

**This wake (Standardize, dispatched by the 6/4 counter) — Slice 131 closed,
three slices triaged.** Owner sent three wishlist messages mid-wake; each was
triaged before any code, per the operating rule.

- **131 DONE.** RF pages showed the screen twice (owner). Collapsed to the
  mirror alone on rf-pick/putaway/count; `RfDevice.astro` now wraps all six
  embeds in a handheld that appears only above `@container bo-demo
  (min-width: 26rem)` — at 390px the geometry is byte-identical to before.
  Icons on RF buttons: **REFUSED** (131.3), no glyph exists for those labels
  and the task-menu case was already refused on profile-size grounds.
- **Two defects the duplicate had been hiding**, both fixed: the RF mirrors
  ignored the docs theme entirely (dark page, light screen), and
  `check-components-used` could not see components rendered inside the frame.
- **Queued, not started:** 132 (date entry / search help / calendar months /
  file panel / list-to-list), 133 (prove table + object-page scrolling —
  the scroll containers are exempt from every gate today, and GAP-6 moved
  under it), 134 (`test:visual` is red on 40 of 40 shots, its dark half
  photographs light pages, and no workflow runs it).

**Next dispatched work:** the dispatcher takes the OLDEST open item — Slice
130.2's remaining gaps, not the new triage above.

Since the 14:30 entry: Slices 126-130 closed or advanced.

- **0.5.0 released** (owner said "Cut"). Deliberately a MINOR, not the
  0.4.1 that had been recommended — Unreleased had grown three `Added`
  entries by then, and this project bumps minor for features. It carries
  the three grouped-number defects 0.4.0 had been shipping since that
  morning, plus the scan flash, `--bar`, and the column ladder. The
  **0.4.0 docs snapshot was cut FROM ITS TAG** in a worktree (same rule
  as 0.3.0); the switcher offers 0.5.0 · latest / 0.4.0 / 0.3.0 / 0.1.1.
- **Slice 129 (Objective grill)** found that `check-page-shape.mjs` had
  NEVER run against `scan` — its filter needed a `.bo-` selector and
  `scan.css` has none. A skipped page looks exactly like a passing one.
  Membership now reads `api.json`; 39 → 40 pages checked.
- **Polish took `scan`** on a source-change re-entry and scored it
  colour 2 / interaction 2 / fit 2 — the first colour<3 in the rubric.
  The scan verdict is now carried by the FRAME (6px solid vs 18px
  double), not by hue.
- **Slice 130 — `examples/erp-suite/`, a gap-finding instrument.** Owner
  wishlist, grilled over two rounds before any build. Static screens,
  no backend, document-based; cross-module data is API-side and out of
  scope. P2P pilot: 8 real screens + 5 module stubs. **The rule that
  makes it work: the example may not add ONE line of its own CSS**
  (`check-erp-suite.mjs` enforces it), so a gap cannot be papered over.
  **13 gaps in `.roundtable/erp-suite-gaps.md`**; GAP-5, GAP-7 and
  GAP-13 already fixed, ten open.

**One open owner input:**

1. **112.3 pilot briefs** — unchanged; scaffold at `.roundtable/pilot-112/`
   (the loop must never author brief content, and SEALED-PICKS.md stays
   unopened until all runs are recorded).
2. ~~**GAP-13's consolidation question**~~ — **ANSWERED 2026-08-23** by the
   Standardize sweep, no owner call needed: REFUSE the general form. The
   premise was wrong (two label-wrap rules, not three — `.bo-state__actions`
   wraps the BAR, not the label), and dropping `.bo-btn`'s global
   `white-space: nowrap` changes ZERO buttons at 1440 and exactly four at
   390, every one of which already fits. Full measurement in the gap ledger.

**Progress on 130.2 (the ten open gaps → decisions):** GAP-2 (merged with
GAP-9) decided AND documented — the document flow is a `bo-timeline`
composition, on `/patterns/object-page` with claim coverage. GAP-4a decided
and fixed — grouped column headers were a sticky bug in shipped CSS, not a
missing feature. GAP-13 answered above. **Open: GAP-1, GAP-3, GAP-4b, GAP-6,
GAP-8, GAP-10, GAP-11, GAP-12, and the new GAP-14** (a chain step can be
PARTIAL and `data-state` has no word for it — grill with GAP-11, since both
ask whether the component needs one more state).

**Next dispatched work, if nothing new arrives:** the rest of 130.2, then
130.3 builds module two.

## Live-verification gotcha — `bo-docs-run` on :8081 is STALE (2026-08-21)

The long-running `bo-docs-run` container serves a **baked image with no bind
mounts**, and it was found serving pre-Slice-94 content this wake. Curl it
before trusting a screenshot from it. The cheap fix, which needs no image
rebuild and cannot go stale, is to mount the fresh `dist` directly:

```
podman run -d --rm --name bo-docs-live -p 8091:80 \
  -v "$PWD/apps/docs/dist:/usr/share/nginx/html:ro,Z" docker.io/library/nginx:alpine
```

Also standing: **`resize_window` does not move the viewport** (stuck at
1280×656 across repeated attempts — the Slice 70.1/71.1 limitation). 390px has
to be *measured* (constrain the element, read `scrollWidth`/computed styles),
not screenshotted, and a wake should say so rather than claim a width it did
not observe.

## Owner-blocked (re-stated each grill, not re-queued)

- **Releases — CURRENT: npm serves 0.4.0 (`latest`), released
  2026-08-23** (grouped-number input + the RTL tone-bar fix). 0.3.0
  released earlier the same day. Mechanics for the NEXT release
  (unchanged, still owner-triggered): fold `## Unreleased`, bump, clean
  build + tests + pack, tag, push, `gh release create` — Trusted
  Publishing runs every gate from a clean checkout; the workflow pins
  `npm@11` deliberately (npm 12 broke `pack --json` mid-release
  2026-08-23) — do not "upgrade" it to @latest. Docs snapshots: cut from
  the RELEASE TAG in a worktree if any commits have landed since; the
  script builds whatever tree it runs in.

- ~~30.4b~~ — **SHIPPED**: built 2026-08-22 as `initWindowedList`,
  released to npm in 0.4.0 (2026-08-23). Entry outlived its subject.
  *(original text below is history only)*
- **30.4b (historical)** — windowed list (the 50,000-record ask). Scope/Accept criteria are
  fully written (the numbered **30.4b** item in ROADMAP.md — item numbers
  survive file growth; a hand-typed line citation here had drifted ~3000
  lines, 2026-08-21 sweep); owner explicitly **deferred to the next
  publish cycle** (2026-08-20) rather than building now — not a build-now item
  until that cycle starts, don't re-surface as ready in the meantime.
- ~~52.3~~ — **CLOSED 2026-08-23**: owner said "do what is good for
  long term"; slug kept, page retitled to name the interaction.

## Open questions awaiting the owner

- ~~30.0~~ — **CLOSED 2026-08-23**: owner answered (b) — a new ERP
  overview pattern with a module sidebar — shipped same day as
  `/patterns/suite-home` (123.2). *(the older correction note below is
  history only)*
  **this entry was stale, corrected 2026-08-20.** The real open
  half is the "*check out overview, the sidebar menu*" note (in ROADMAP.md's
  item **30.0** — cited by item, not line, per the sweep fix above):
  either (a) review the docs' own landing page/nav, or (b) a new ERP
  overview/dashboard pattern with a module sidebar — still ambiguous, still
  owner's call. ("Horizontal tabs" was answered 2026-08-18: meant **vertical**
  tabs, shipped as 36.1.) This entry previously described an "advanced
  editable table" ambiguity that does not exist in `ROADMAP.md` — that table
  work shipped 2026-08-16 as its own item, unrelated to 30.0; the owner's
  2026-08-20 chat ask against that stale description turned into Slice 71
  instead, once checked.
- **37.1/37.2 rubric — superseded, not answered.** The original
  Demand/Composition/Contracts/Evidence rubric never got owner sign-off; before
  it did, the owner's own wishlist (Slice 53) produced a different, symmetric
  NEED/COST rubric that has since been used for real decisions (`.bo-date`,
  `.bo-quantity--display`). Treat 37.1's sign-off question as moot unless the
  owner wants the original rubric run anyway.

## Resolved, kept here only as a pointer (not re-litigated)

- **Slice 48 — SAP Object Page scope.** Was "whole floorplan vs anchor bar
  only" — resolved by an Explore spike (2026-08-19): composes from primitives
  with zero new CSS, so the cheap answer was the whole thing. Shipped as
  `/patterns/object-page`, 48.1-48.4 and 52.1-52.2. Not open.
