# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-30 (**local** wake). Working tree clean at hand-off; one
push (`5e5ede6`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 3 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `211.1`, `213`, `218.1`,
`219.1` — are historical references to what landed and to what this hand-off
cites, not claims they are open. The three genuinely open, all owner- or
hardware-blocked, are **`112.3`, `112.4`, AT runtime**.

## What landed this wake

**Slice 211.1 closed — `examples/po-app` no longer needs a CDN to run.** Owner
call, taken over chat (not decided by the loop): vendor htmx locally rather
than keep the `unpkg.com` script tag. `server.mjs` now resolves
`htmx.org/dist/htmx.min.js` via `require.resolve` — the same pattern already
used for `@busy-office/ui`'s dist — and serves it at `/vendor/htmx.min.js`;
`htmx.org` is `examples/po-app/package.json`'s own declared dependency, pinned
`^2.0.10` to match `apps/docs`'s existing pin rather than adding a third
version. Full reasoning and the accept-criterion measurement are in ROADMAP
211.1.

**Verified two ways, not just asserted:**
- `check:po-app` → **19 of 19**, including the htmx-loaded precondition.
- The item's own accept criterion — *"re-measured in an egress-restricted
  container"* — taken directly: `podman build -f examples/po-app/Dockerfile`
  (the real tarball-consumer path, not the dev shortcut) then
  `podman run --network none` (zero egress, no DNS). `/vendor/htmx.min.js`
  still returns `200` from inside that container.

**A stale-build trap this file already warns about, hit fresh mid-verification
and worth naming so the next wake recognises it faster.** The first
`check:po-app` run after the code change still showed the pre-213.1 defect
(`spacerH 3250` vs `chunk0RenderedH 3299`) — not a regression, a **stale local
`examples/po-app/busy-office-ui.tgz`** packed before 213.1 landed. Repacking
with `npm pack -w @busy-office/ui` (from repo root, `-w` — a bare
`npm pack @busy-office/ui` from inside `examples/po-app` pulls the **published
registry version**, not the local workspace build, and silently installed
`0.3.0`) still showed the old version, because a **gitignored local
`package-lock.json`** was pinning the previous tarball's resolution. Deleting
both `node_modules` and the lockfile before reinstalling is what actually
picked up the fix. Neither artefact is tracked in git, so this cannot recur
from a fresh clone — only from a dev machine with prior local installs, same
class of trap as ENVIRONMENT.md's "stale podman image" one.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   3 / 4 Continue rounds   ok
Objective     3 / 3 slices            OVERDUE  [211, 218, 219]
Optimize      0 wake-date(s) newer    ok
```

**Rule 3 fires next wake — Objective grill of Slices 211, 218, 219.** This
wake's own close of 211.1 is itself something that grill should re-verify
rather than take on faith, per this file's own standing rule (an item's
premise is part of what a grill re-checks, not a courtesy).

**Rule 4's remaining three, all blocked:**

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

## Direction

**The previous hand-off's speculation — "covering `examples/po-app` in
`check:po-app` is arguably downstream of 211.1" — is now testable and not yet
tested.** `check:po-app` has never run green inside an actual egress-restricted
*CI-style* container (only the ad-hoc `podman --network none` probe this wake
ran by hand, which passed). Whether the gate itself now passes clean in such a
container, not just the one route this wake checked, is open — a natural
Continue-round follow-up, not urgent enough to jump the queue ahead of the
overdue Objective grill.

**Standing three unchanged** (112.3, 112.4, AT runtime).

**Still unacted, now six wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.
