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

Last updated 2026-08-24 00:20. `git status` clean, CI green, **npm serves
0.5.0** (`latest`). Unreleased has grown: two `Fixed` and one `Added`.

**A ten-wake run closed Slice 131 and ALL of Slice 130.2.**

- **131 (owner wishlist) DONE.** RF pages showed the screen twice → the
  mirror alone, wrapped in a handheld (`RfDevice.astro`, one call site for
  six embeds, chrome only above `@container bo-demo (min-width: 26rem)`).
  Icons on RF buttons **refused** — no glyph exists for those labels and the
  task-menu case was already refused on profile-size grounds.
- **130.2 DONE — every gap in `.roundtable/erp-suite-gaps.md` is decided.**
  GAP-2 (+9): document flow is a `bo-timeline` composition, documented on
  `/patterns/object-page`. GAP-4a: grouped column headers were a sticky BUG
  in shipped CSS (both header rows pinned at 0), fixed with a
  `--bo-density-row-height` offset + claim 108. GAP-3: a segmented option
  gained a `gap`; the count is muted tabular text, not a badge. GAP-12: "Add
  a line" lives below the table in a cluster. GAP-1: measured (fails at 11
  docs/700px), deferred behind a trigger, limit documented. **Refused as not
  gaps**: GAP-11 (a usage bug — `bo-data-table__row-select` was omitted),
  GAP-14 (the marker glyph already carries partial), GAP-10 (the
  recompute/announce contract is `initTableSum`'s, only discoverability was
  missing), GAP-4b (`data-tone` marks a cell; the gap had looked at
  `data-row-state`). GAP-13 answered by a Standardize sweep.
  **GAP-6 is the exception**: it moved under Slice 133, because it is a
  scrolling defect and that is what 133 exists to prove.

**Three owner wishlists triaged this run, none started**: Slice 132 (date
entry / search help / calendar months / file panel / list-to-list), Slice 133
(prove table + object-page scrolling — the scroll containers are exempt from
every gate today), Slice 134 (`test:visual` is red on 40 of 40 shots, its
dark half photographs light pages, and no workflow runs it).

**One open owner input:** 112.3 pilot briefs — unchanged; scaffold at
`.roundtable/pilot-112/`, and the loop must never author brief content.

**Next dispatched work:** 130.3 (module two, O2C) is now unblocked — 130.2's
answers are all in. The oldest queued items ahead of the new triage are
Slice 132/133/134 by number but 130.3 by age; the dispatcher takes the
oldest still-open item, which is 130.3.

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
