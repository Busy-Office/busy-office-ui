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

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 5 at hand-off, was 5
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

The open set held at 5 across this wake by coincidence, not by nothing
happening: **232.1 closed and 233.1 opened.** `112.3`, `112.4` and the AT item
are the same three as always.

## ⚠ Read this first: THIS WAKE LOST A COLLISION, and the ledger moves again

**231.2 was built to completion THREE times on 2026-08-31 and landed once.**
Slice 232 records the second build; this wake was the third. The pre-commit
`git fetch origin main` that Step 0c mandates is what caught it — `origin/main`
had moved `014741c → dbc41ae`, carrying `c870a4f` (231.2, the winner), the
Slice 232 grill, and two chore rows.

So **the previous hand-off's "231.2 twice, landed once" is now three**, and the
day's discarded total is **at least four wakes' work**, not three. That is the
number worth the owner's attention; the decision to accept collisions is the
owner's and is not reopened here.

**Step 0c's credited compensation fired too, and it is worth stating because
the trade now has evidence on both sides in one day.** The losing diff was not
identical to the winner's: it also carried a `check:claims` case for the
elevated-vs-toast distinction, and the winner's shipped page makes that same
assertion with nothing executing it. That is **233.1**, filed this wake. The
ledger for 2026-08-31 is **two** such catches (232.1 and 233.1) against at
least four discarded wakes.

**The losing round was NOT recorded as a log row, deliberately.** It closed no
slice and produced no commit, and a `Continue · build · 231.2` row would feed
rule 3's slice counter for a slice this wake did not close. The grill wake made
the same choice for its own discarded build. Recorded here as prose, and in
ROADMAP Slice 233's opener, so it is a decision rather than an omission.

## What landed this wake

**Step 1 — `Roadmap · plan`, triage of 233.1.** `/components/alerts`'s new
Elevated section states two facts a browser can check — that the elevated
surface and the toast surface MATCH, and that the card look and the accent
colour are INDEPENDENT — and `check:claims` covers neither
(`grep -c 'elevated' apps/docs/scripts/check-claims.mjs` → **0**). Accept is
written as properties: cover both sentences off the built page, close the
transparent-equals-transparent hole explicitly, red-prove by an injection
confirmed in the DOM rather than in the file, and leave the `NOT VERIFIED`
count alone (ENVIRONMENT trap 6b).

**233.1 is NOT browser-blocked and NOT owner-blocked** — it is entirely
ENVIRONMENT.md's second list (computed style + a red-proof by injection), which
a cloud wake takes with `browser-harness.mjs` + `serve-dist.mjs`. The lost
round had already built and red-proved exactly this case, so it is known to be
buildable in a cloud container; that patch was discarded with the rest.

**Dispatched Continue (rule 4) → 232.1 — LANDED.** 229.3's BROAD base rate is
**7, not 2**: `owes?\b` cannot match `owed`, and `owed` is the wording 229.2's
own five corrected headers use. Every published figure re-ran identically
before anything was edited (2; 0-vs-1 on the tense; 7; five headers; BROAD's
proximity test true on all five; 15 branch-carrying gates re-derived).

- **The 7 was reconciled against an independent instrument** before being
  quoted — a Node pass applying BROAD's real 120-char proximity predicate to
  the 15 branch-carrying files returns the same seven, all inside the 15.
- **One published figure did not reproduce as written.** "Unanchored
  `owe[sd]?\b` returns 17 files" returns **18**; it is 17 only with the
  `grep -v check-selftests.mjs` the 7-count command carries and that sentence
  does not. Recorded, not quietly adjusted.
- **The replay found a SECOND wrong number in the same table.** 229.3's
  red-proof third row reads `BROAD 0`; rows 1-2 are counts over the 15 and row
  3 is "did it fire on the injection". As a count it is **2**.
- **The correction strengthens the refusal.** Tense-inclusive, the BROAD column
  reads **7 / 7 / 7** — flat across baseline and both injections — because the
  red-proof's own injection site, `check-floor.mjs`, is itself one of the seven
  false positives. **The refusal is explicitly left standing.**
- **Method:** injections replayed in memory (file read, sentence spliced into
  the string, predicate applied to the string), each mutated string asserted to
  CONTAIN the injected sentence before measurement, the file on disk asserted
  byte-identical afterwards. Case-**in**sensitive, as 229.3 measured it — a
  case-sensitive replay reads row 2 as 2, not 3, and that discrepancy was
  chased down rather than averaged over.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

```
Standardize   2 / 4 Continue rounds   since 2026-08-31 13:03   ok
Objective     1 / 3 slice             since 2026-08-31 14:43   ok  [232]
Optimize      0 wake-date(s) newer    since 2026-08-31 08:41   ok
```

**Re-run it rather than trusting this snapshot.**

**How rules 1-6 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; GitHub intake `list_issues` OPEN → `totalCount: 0` |
| 2 Standardize | counter **2 / 4**, and **no drift flagged** |
| 3 Objective | **1 / 3**, `[232]` — reset by the grill that landed mid-wake |
| 4 build item | **fired** → 232.1, the oldest DISPATCHABLE item |
| 5 Optimize | **not evaluable** — see below; reported as such, not as clear |
| 6 Polish | not reached |

**Rule 4's next pick is 232.2**, then 233.1. Neither is blocked; `112.3` is the
oldest open item outright and is owner-blocked, so a wake reading rule 4 as
oldest-regardless will land on it and stop.

## ⚠ Rule 5 has one live metric and twelve stale ones — do not read `bundle-gz-kb`

**Re-measured this wake, not carried.** 13 of 33 metric names have more than one
sample; **12 of those 13 have their newest sample in 2026-08-16→19**. Only
`axe-violations` is current — `0.0, 0.0, 0.0`, flat — which is why
`dispatch_status.py`'s rule-5 line says `ok` rather than STALE, and that `ok` is
correct but narrow.

`bundle-gz-kb` reads `10.8 → 11.6 → 11.7`, which *looks* exactly like rule 5's
"regressed on two consecutive runs" trigger and is **14 days stale**. Recorded
as **not evaluable**; do not quote it as current.

## Direction

**No new input arrived from outside the loop** — no open GitHub issues, no owner
message. The `Roadmap · plan` row this wake carries is a finding the loop made
about itself, not external input.

The three standing items are unchanged and still not ours:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — 5 briefs; `.roundtable/pilot-112/` holds README + SEALED-PICKS.md and **no `briefs.md`** |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |

**`ROADMAP.md` is at 2,944 lines** (measured at hand-off, up from 2,704). No
sweep was triggered and **the closed-history share was NOT re-measured** —
fourth consecutive deferral. Rule 4 walked 5 open items, not thousands of
lines, so the sweep's own trigger did not fire; say "deferred", not a
percentage. Measure the cycle from the blob, never from a sweep's prose
(ENVIRONMENT.md):

```
git show d701e61:ROADMAP.md | wc -l                 # 1626, the seventh sweep
git rev-list --count d701e61..HEAD -- ROADMAP.md
```

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Neither commit this
wake is a code change** — the diff is `ROADMAP.md` plus the loop-log files, and
no shipped artefact, CSS, markup or rendered output moved, so nothing in this
wake rests on a rendered image.

**One visual gap is inherited, not created here, and a local wake should glance
at it:** 231.2 landed a new demo section on `/components/alerts` in the same
cloud-only conditions. Its properties are gated (`check:layout` at 390 and 150%
zoom, `test:axe` at both widths, `check:pseudo`), but nobody has looked at it at
1440 and 390 in both themes.
