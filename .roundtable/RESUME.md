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

Last updated 2026-08-23. `git status` clean, 214 commits ahead of
origin/main (unpushed, unrelated to the 0.3.0 release question below).
**This file had gone stale again** — it still read "last updated
2026-08-22 after 109.6," 214 commits and Slices 110-122 behind reality,
and its 109.13-109.18 note ("queued, not fixed yet") was flatly wrong:
all of Slice 109 including 109.13-109.19 shows `[x]` DONE (109.19 landed
2026-08-22 in commit `69a5336`). A read-only survey this wake (grepping
every unchecked `[ ]` across the whole 6398-line ROADMAP.md, not
sampling) found this by cross-checking the claim against the file
instead of trusting it — exactly the failure mode this file's own
2026-08-19 warning names. **Lesson repeats: don't trust an "In flight"
entry's age at face value — re-verify its specific claims against
ROADMAP.md before acting on them, every time, not just when something
feels off.**

**Current reality (2026-08-23 survey), replacing the stale note above:**
Slices 110-121 all landed and are `[x]` DONE except the items below, which
are genuinely still open. There is exactly **one buildable-now item** with
real Accept criteria and no blocker: **119.2 — ERP layout overview,
concepts page** (docs-only, zero new CSS: map the shells that already
ship — app-shell sidebar+navbar / RF full-screen / role-home / split
master-detail — to when each fits). Everything else open is BLOCKED ON
GRILL or an explicit owner call (121.1/121.2/121.3, 121.5, 119.3, 122.1 —
the last is this wake's own triage of the "Amount decimal/masking"
wishlist item, see ROADMAP.md Slice 122). Also open, older and easy to
lose track of because they don't read as "blocked": 30.0 (owner
clarification on the overview/sidebar-menu note) and 52.3 (Object Page
naming, owner taste call) — both under "Open questions" below, unchanged
since last checked.

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

- **0.3.0 is PUSHED, awaiting owner decision — read
  `.roundtable/release-0.3.0-brief.md` (written 2026-08-22 by 102.5), not
  this entry, for current numbers.** That brief replaced the standing
  restatement (ROADMAP.md 101.1, now superseded) after its "five more
  commits stacked on the tag" count went stale: measured live at 155
  commits since the tag, 6 of which touch the shipped package with no
  CHANGELOG entry yet. The brief recommends re-cutting the tag before
  publishing rather than releasing as-is. Future wakes: don't re-derive this
  count by hand, re-read the brief (and re-measure `git log v0.3.0..HEAD`
  if it's been more than a few wakes, per this file's own staleness rule).

  Once the owner decides, the release command itself is unchanged (npm
  still serves 0.1.1; `gh release view v0.3.0` says "release not found"):

  ```
  gh release create v0.3.0 --title "0.3.0" --notes-from-tag
  ```

  Original entry, kept for its still-true context (tarball contents, Trusted
  Publishing mechanics, the optional snapshot):
  This entry replaces the ten-grill-old "0.2.0 is tagged" one, which had become
  actively misleading: the tarball built at HEAD was *labelled* 0.2.0 but
  carried 304 commits of post-tag work, so publishing it would have made the
  version number permanently wrong. Owner chose 0.3.0.

  Done in-wake: version bumped, CHANGELOG cut as `0.3.0 (2026-08-21)` with the
  0.1.1-upgrade note, `DESIGN.md`'s `data-day` rationale corrected before the
  release could falsify it, tag `v0.3.0` created at `24c6e7d`, every gate green
  at 0.3.0 (core build, 110 tests, docs build), tarball packs as
  `busy-office-ui-0.3.0.tgz` (173 files, 220.9 kB), and the workflow's
  tag-vs-package guard simulated green.

  Publishing does NOT need `npm login` — `.github/workflows/publish.yml` uses
  **Trusted Publishing (OIDC)**, no token and no OTP; publishing the GitHub
  Release is the trigger, and it re-runs every gate from a clean checkout
  before `npm publish`. npm in a wake's environment is unauthenticated (E401)
  and always will be, so this handoff shape is permanent, not a one-off.

  **Optional, and deliberately not done:** the docs version snapshot
  (`node apps/docs/scripts/cut-version-snapshot.mjs 0.3.0`, ~4.3 MB committed).
  0.2.0 skipped it too — `apps/docs/versions/` holds only `0.1.1` — so the
  version switcher will offer 0.1.1 and latest, not 0.3.0. Cheap to add later;
  say the word.
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
