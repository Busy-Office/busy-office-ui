# Explore — role-home dogfooded into po-app's Dashboard (2026-08-22)

Backlog was empty (Slice 109/113 fully closed, Slice 112 gated on owner
briefs) — dispatched Explore per LOOPS.md's own fallback: extend
`examples/po-app` and feel where it fights. `po-app`'s `dashScreen()`
predates the role-home pattern (110.1): same primitives
(`.bo-widget-grid`/`.bo-stat`), never its actual anatomy. Exactly the kind
of gap the pattern catalogue's own doctrine keeps naming — "never
exercised against a real ERP screen in this repo" (102.1, 113.2).

## Result: graduated, zero framework changes needed

Spiked in an isolated worktree (`explore/role-home-po-app`, removed after;
finished file copied over — same shape as every prior graduation). Rebuilt
`dashScreen()` composing role-home's real shape (Identity line, "Needs
you" spanning two columns, Stat/Progress/Recent cards) against po-app's
actual `pos`/`budgets` data. Verified live: screenshotted 1440px light,
1440px dark, 390px light — clean at all three, no layout fights, no CSS
needed.

**Two honest adaptations, kept rather than papered over** (this is the
value of dogfooding against a REAL app instead of another demo page):

1. **"Needs you" links to `/pos?status=Pending`, not `/inbox`.** The
   pattern page's own demo button says "Open inbox" and assumes a
   standalone inbox screen exists. po-app has none, and building one is
   out of scope for this spike. The filtered list is the honest
   equivalent — worth noting for role-home's own docs: the pattern
   composes even when the app has no dedicated inbox, if there's SOME
   place its "Needs you" queue already lives.
2. **"Recent" relabelled "Recently added."** po-app has no session, so no
   per-user view history exists to show "recently viewed." It DOES know
   insertion order (imports and `/pos/new` unshift). Recently-added is
   real; recently-viewed would have been fabricated data in the demo.

**No synthetic deltas.** The role-home pattern page's own demo shows
"+2 since yesterday" style deltas; po-app has no historical snapshot to
diff against. Rather than fake one, the "Needs you" stat ships without a
delta — a stat can exist without one when there's no real baseline.

## Two real, pre-existing bugs found and fixed along the way

Confirmed on an UNMODIFIED checkout first, per this project's own
dogfood discipline (a bug found mid-spike must be proven not caused by
the spike before it counts as pre-existing):

1. **`spendScreen()` counted Rejected POs as spend.** A rejected PO never
   spent anything, but its amount was counted against budget anyway.
2. **Stale budget figures.** Set 2026-08-15 against a 5-row `pos`
   (`$80k/$15k/$25k`); never revisited when a 25-row backfill landed
   later. Compounding with bug #1, `/spend` showed **every** cost centre
   pinned at 134%/448%/330% "review before approving" — permanently red,
   demonstrating none of the tone system's three states (the entire
   point of that screen).

Fixed both: Rejected excluded from the spend sum; budgets recomputed
from real committed (non-Rejected) spend against the current `pos`,
chosen to land one CC in each tone band (51% normal / 87% warning / 96%
danger) so `/spend` now demonstrates the system actually working.
Screenshotted before/after — before showed uniform red, after shows a
real spread.

## A third finding: an unignored build artifact

`examples/po-app/busy-office-ui.tgz` (the packed tarball the Dockerfile
produces, and what a local test run also produces) was never in
`.gitignore` — `git status` showed it as untracked after a routine local
install. One `git add -A` away from a 250KB binary landing in a commit.
Added `examples/*/busy-office-ui.tgz` and `examples/*/package-lock.json`
(same local-only-artifact class) to `.gitignore`.

## Verification

- `node apps/docs/scripts/check-po-app.mjs` — 13/13 behaviours pass,
  fresh install, after all changes.
- Screenshots: dashboard light/dark/390px, spend page before/after the
  budget fix.
- Bug reproduction confirmed on an unmodified checkout (a second po-app
  copy, separate from the worktree) before attributing it to pre-existing
  code.

## Not done (out of scope for this spike)

- No `/inbox` route was built for po-app — "Needs you" points at the
  filtered list instead, which is the honest answer, not a placeholder
  for future work.
- No historical-snapshot mechanism was added to make deltas real — the
  stat simply omits one.
