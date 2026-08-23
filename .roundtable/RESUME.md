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

Last updated 2026-08-23 00:33. `git status` clean, HEAD `beba4bb`.
**Backlog is now genuinely dry of buildable-now work.** This wake:
triaged 122.1 (masking-input wishlist, BLOCKED ON GRILL — real UX
tradeoffs need the owner's answers, not a self-decided grill),
dispatched Standardize (overdue: 9/4 Continue rounds) and consolidated
the RF device-frame iframe style (goods-receipt/rf-list/rf-landing, 3x
duplicated inline style -> `rf-device-frame.css`), then closed **119.2**
(the previous survey's one buildable-now item — `/concepts/layouts`),
fixing a real copy-paste bug (a duplicated "per the ... per the" clause)
found reviewing it before closing.

**Every remaining open item is BLOCKED ON GRILL or an explicit owner
call**: 121.1/121.2/121.3 (new pattern shapes), 121.5 (orphan
cross-links + naming collisions, owner call), 119.3 (app-frame, owner
grill), 122.1 (masking input, owner grill), plus the older 30.0
(overview/sidebar-menu clarification) and 52.3 (Object Page naming) —
both under "Open questions" below. Per LOOPS.md dispatcher rule 6
("Backlog empty? -> dispatch Explore"), the next wake's honest move is
an Explore spike (dogfood-loop fallback per the Ideas backlog note —
the seed list is exhausted, so pull from `examples/po-app` friction,
not a manufactured idea) — or surfacing the blocked list to the owner
so a grill round can actually unblock 121.1-121.3/119.3/122.1, which is
where most of the real remaining value sits.

**Standing lesson, still true, kept for the next wake that inherits a
stale note:** don't trust an "In flight" entry's age at face value —
re-verify its specific claims against ROADMAP.md before acting on them.
This file went stale from 2026-08-22 (referencing 109.6) all the way to
2026-08-23 before being caught; the fix each time is a full grep of
every unchecked `[ ]` in ROADMAP.md, not a sample.

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

- **0.3.0 — RELEASED 2026-08-23, npm serves it as `latest`.** Owner chose
  the re-cut path; done same wake (ROADMAP 123.4 has the full story,
  including the two real publish-workflow bugs found and fixed: npm 12's
  `pack --json` shape change, and a base-blind check:claims case).
  Still-true mechanics for the NEXT release: publishing needs no `npm
  login` — `.github/workflows/publish.yml` uses Trusted Publishing
  (OIDC); creating the GitHub Release is the trigger and it re-runs every
  gate from a clean checkout. npm in a wake's environment is
  unauthenticated (E401) and always will be. The workflow now pins
  `npm@11` deliberately — do not "upgrade" it back to `@latest`.

  **Optional, still not done:** the docs version snapshot
  (`node apps/docs/scripts/cut-version-snapshot.mjs 0.3.0`, ~4.3 MB
  committed). `apps/docs/versions/` holds only `0.1.1`, so the version
  switcher offers 0.1.1 and latest, not 0.3.0. Cheap to add; owner's
  call.
- **30.4b** — windowed list (the 50,000-record ask). Scope/Accept criteria are
  fully written (the numbered **30.4b** item in ROADMAP.md — item numbers
  survive file growth; a hand-typed line citation here had drifted ~3000
  lines, 2026-08-21 sweep); owner explicitly **deferred to the next
  publish cycle** (2026-08-20) rather than building now — not a build-now item
  until that cycle starts, don't re-surface as ready in the meantime.
- **52.3 — Object Page naming.** Recommendation given (keep the `object-page`
  slug, retitle to name the interaction); genuinely the owner's call on taste,
  not something the loop can decide for itself.

## Open questions awaiting the owner

- **30.0** — **this entry was stale, corrected 2026-08-20.** The real open
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
