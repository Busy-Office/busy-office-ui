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

Last updated 2026-08-23 14:30. `git status` clean, main pushed, CI green,
**npm serves 0.4.0** (`latest`). A very large owner-driven day: Slices
119-124 all closed; the loop system itself was redesigned (LOOPS.md now
has EIGHT loops — Polish and Research added, dispatcher rules 6-8
including the halt rule; owner-confirmed design, see the 2026-08-23
commits). Polish ran 18 rounds to a dry queue (36/37 component pages
carry the wrong-choice clause; `date` skipped as deprecated); Research
ran 2 rounds (DsaScore false gap closed; tile-preview evidence). The
docs tile index carries live miniatures for 10 patterns (104.2,
c-scoped). The 0.3.0 docs snapshot was cut FROM THE TAG in a worktree —
never snapshot the current tree for a past version — and the switcher
offers 0.1.1 / 0.3.0 / latest.

**The ONLY open input anywhere: the owner's 112.3 pilot briefs** —
scaffold at `.roundtable/pilot-112/` (README explains; the loop must
never author brief content, and SEALED-PICKS.md stays unopened until all
runs are recorded). When the owner says "briefs ready", run the
pre-registered protocol in ROADMAP 112.3.

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
