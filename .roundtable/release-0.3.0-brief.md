# 0.3.0 release brief — read in under a minute (2026-08-22)

**101.1 has restated "publish 0.3.0?" eleven times.** It can't close itself —
publishing is owner-triggered by Trusted Publishing (OIDC), and a wake has no
npm auth. This is the one-time artifact so it stops being restated: everything
you need to say yes/no is below.

## What ships in 0.3.0 (consumer terms, not commits)

Tag `v0.3.0` is cut and pushed; the registry still serves `0.1.1`. 0.3.0 is
the **first release to reach npm at all past 0.1.1** — it silently carries
0.2.0's 65 entries too (0.2.0 was tagged 2026-08-18 but never published).
Headlines from `CHANGELOG.md`'s `## 0.3.0` section:

- Data-table row-edit actions cell fixed (was breaking table-cell layout,
  showing a background band through dirty rows)
- Money amount field gets a minimum width — digits no longer silently
  truncate ("1250.00" → "1250.") under column pressure
- `data-tone="danger|warning|success"` on table rows/cells
- Full CHANGELOG has the rest — read the `## 0.3.0` section for the complete
  83-entry list (0.2.0's 65 + 0.3.0's own 18)

## What's breaking

None flagged as **Breaking** in the 0.3.0 or 0.2.0 CHANGELOG sections — both
are additive/fix releases.

## Two more unshipped layers stacked on top of the tag

101.1's "five more" count is stale. Actual count, checked live
(`git log v0.3.0..HEAD --oneline`): **155 commits** since the tag, but almost
all are internal (scoring, grilling, standardizing docs) — the Objective grill
already measured 78% of session output as non-shipping commentary. Narrowing
to commits that touched `packages/core/src` (the actual shipped package):

**Layer 1 — already in `CHANGELOG.md`'s `## Unreleased` section** (5 entries,
committed, just not tagged): `--bo-font-size-mono-inline` token, Money
currency-side placement (DOM-order driven, no new class), badge overflow P0
fix (long label no longer pushes the page sideways), `--bo-color-scrim`
token, data-table container `min-inline-size: 0` fix.

**Layer 2 — landed in the package AFTER that CHANGELOG entry, not yet
written up**: 6 commits touching `packages/core/src` (`01d0952` role="alert"
arrival-vs-severity fix, `b3b3719` Standardize sweep — 15 real findings
fixed incl. a `data-decimals=""` parsing bug, `0c66257` motion-easing token
cleanup, `e163a4d` Slice 108 P0 — sticky-header content bleed-through fixed,
`0365cab` output-form print/barcode contract, `f1d8969` Slice 111 button
group + dropdown open/close motion). None of these have a CHANGELOG entry
yet — that's real, uncounted work.

## Recommendation: skip 0.2.0, ship one 0.3.0 — but re-cut the tag first

**Yes, skip 0.2.0** (unchanged from the original plan — it never reached the
registry, and 0.3.0 already carries its entries forward with a stated note).

**But don't publish the current tag as-is.** Re-tagging is cheap and the
current `v0.3.0` is now missing two real fix/feature layers a consumer would
want (the badge overflow P0 alone is a real bug fix). Recommended sequence:

1. Write CHANGELOG entries for Layer 2's 6 commits (folds into `## Unreleased`)
2. Move `## Unreleased` into a new `## 0.3.0` section, delete the old one
3. `git tag -d v0.3.0 && git tag v0.3.0 <new HEAD>` (or cut `0.3.1` instead
   of moving the tag, if you'd rather not force-move a pushed tag — a
   force-move needs `git push --force` on the tag, which is the kind of
   action this project's own guardrails ask a human to approve explicitly)
4. Then: `gh release create v0.3.0 --title "0.3.0" --notes-from-tag`
   (or `v0.3.1` if you took the no-force-move path)

This item (102.5) only produces this brief — it does not move the tag,
write the CHANGELOG entries, or run the release command. Those are the
next owner call, or a follow-up build item once you say which path.
