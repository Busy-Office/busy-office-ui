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

Last updated 2026-08-24 05:50. `git status` clean, main pushed, **npm serves
0.5.0** (`latest`). `## Unreleased` has grown to **five Fixed + two Added** —
enough for a release when the owner wants one.

**A twenty-wake run. Slices 131, 132, 133, 135 CLOSED; 130.2 and 130.3 closed;
134 is one owner call away.**

- **135 (owner, RF track)** — naming unified (labels, not slugs: 69 references
  made that the wrong trade); the six mirrors are one walkable track; screens
  measured responsive at 320-800; the keypad removed because the gun has a
  keyboard. Along the way `.bo-data-table__cell-link` shipped, because the task
  queue promised a tap it did not provide.
- **133 (owner, scrolling)** — `check:scroll` is in CI, driving 732 regions;
  the object-page spy is verified for every section rather than one; GAP-6
  fixed at the primitive (`.bo-stack > * { flex-shrink: 0 }`).
- **132 (owner, five wishes)** — one section shipped (date entry on
  `/components/form#dates`) and four refusals, each with the measurement:
  Search Help is value-help, the calendar already did it, the file panel is
  three existing screens, list-to-list is what `data-multiselect` already does.
- **130.2 / 130.3** — every gap in the ERP-suite ledger decided, then module
  two built. **The checkpoint says the instrument worked**: pilot 13 gaps,
  module two 2 — one a regression in the pilot's own fix, one a treatment
  (totals rows) nobody had needed yet. Modules three to six look mechanical.

**Two things need the owner:**

1. **134.3 — the visual gate.** Three costed options in ROADMAP 134.3
   (containerise for CI / leave local / delete). It works again and caught
   three real changes this run.
2. **112.3 pilot briefs** — unchanged; scaffold at `.roundtable/pilot-112/`,
   and the loop must never author brief content.

**One open finding, deliberately left failing:** `test:visual` reports a diff
on `/components/richtext` that cannot be attributed — that page has no
`tfoot`, no `colspan` and zero commits since the baselines were taken. Not
blind-updated. Also: `--only=<page>` does not filter what it updates, so
selective re-baselining is not currently possible.

**Next dispatched work:** 130.4 (the remaining four modules, batched if module
three confirms) is the oldest open item; 134.3 waits on the owner.

## `npm run docs:build` does NOT run the browser gates (2026-08-24)

A green local docs build is **not** a green CI. The build script runs the
static checks (page-shape, links, markup, data-hooks, components-used …). It
does **not** run `check:claims`, `check:layout` or `test:axe` — CI runs those
as separate steps.

This cost a red main on 2026-08-24. Collapsing `/patterns/goods-receipt` to
its mirror moved `#gr-scan` into the iframe; the docs build passed, so did
`check:layout` and `test:axe`, and `check:claims` — which I did not run —
went red on CI with *"No element found for selector: #gr-scan"*. Two claims
had been silently driving the duplicate inline copy.

**Any change to what a page RENDERS runs `check:claims` before the push.**
It is the gate that knows what the page promised.

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
