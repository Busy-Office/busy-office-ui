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

Last updated 2026-08-30 (**cloud** wake — nothing to triage at Step 0, rules 1-5
clear, **rule 6 fired → Polish** on `component/breadcrumb`; owner input then
arrived MID-WAKE and became **Slice 221**, and a free measurement became **Slice
222**). Working tree clean at hand-off; one push, five commits.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 7 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed** — `220.1`, `220.2`, `211.1`, `219.1`,
`218.1`, `217.2`, `216.1`, `213`, `176.1`, `182.1`, `114`, `208.3` — are
historical references to this wake's work and to what it cites, **not** claims
they are open. The seven genuinely open are **`112.3`, `112.4`, AT runtime,
`221.1`, `221.2`, `221.3`, `222.1`**.

## ⚠ THE NEXT WAKE MOST LIKELY DISPATCHES RULE 3 — Objective is OVERDUE

Read **after** recording, which is the comparison `LOOPS.md` prescribes and
which is exactly what surfaced this:

```
python3 scripts/loops/dispatch_status.py
#  Standardize   3 / 4 Continue rounds   ok
#  Objective     3 / 3 slices            OVERDUE  [211, 218, 219]
#  Optimize      0 wake-date(s) newer    ok
```

It read `Objective 2 / 3 [218, 219]` at Step 0b and crossed **only when this
wake recorded**, because the other dispatcher closed **211.1** mid-wake. This
wake did not re-dispatch on it: Step 2 decides once, and rule 6 had already
fired and run its full round.

The Polish round does **not** contribute to that counter — 161.4 admits only
`Continue` and `Standardize`. The three slices are 211, 218, 219.

## What landed this wake

**Slice 220 — Polish round on `breadcrumb`, NOT a no-op.** Full reasoning, every
command and the four-source reconciliation are in ROADMAP 220 and
`.roundtable/polish-state.md`.

- **The first round since 176.1 that needed no invented tie-break.** All 8
  re-queued surfaces score `content: 3` (171.1: no DSA dimension can rank), so
  216.1 and 217.1 each had to invent a discriminator. This one had a **filed**
  defect: 217.2 measured the count-bearing cite class at 6 of 240, found 2 stale,
  fixed `sidebar-nav` and wrote `breadcrumb` down without fixing it.
- **`fit` published "used in 2 of 19 pattern screens" against 39.** Numerator
  holds (2, by both a top-level and a recursive glob). Denominator reconciled
  against **four** independent sources, all 39. A recursive glob returns **47** —
  `rf/` and `schedule/` hold sub-screens `patterns.json` does not count — so the
  obvious count would have replaced one wrong figure with another.
- **The fix removes the quantity rather than refreshing it**, 217.2's precedent
  now twice-confirmed. No line number added: the most decay-prone cite shape,
  1 of 40 today.
- **Score does not move; no blind re-score owed; `scored` stays 2026-08-21.**
  `rounds` 1/3 on a new re-entry row, stamped `dcbde565`.
- **220.2 refuses a gate for the class a second time**, with a reason 217.2 did
  not have: the two stale cites failed against **different trees**. The class is
  shrinking by construction, 6 of 240 → **4 of 240**.

**Slice 222 — the previous hand-off's open question, answered for free.** See
the po-app section below; it changes a number `ENVIRONMENT.md` still publishes.

**Slice 221 — owner direction triaged, nothing pinned.** The thing most worth
the owner's attention; its own section below.

**Instrument correction worth carrying.** The behaviors check first read
`0 of 4` — it had counted `Object.keys(behaviors.json)`, whose top level is
`generated`/`initCount`/`exports`/`behaviors`. The real array holds **33**, 0
matching `/crumb/i`. **The conclusion it reached was correct**, which is what
makes it worth recording: a right answer from a broken instrument, caught only
because a denominator of 4 was too tidy to be true.

## ⚠ OWNER INPUT ARRIVED MID-WAKE AND IS AWAITING A DECISION — Slice 221

Owner, two messages: *"pls pin htmx to version 4"* and *"plan to update framework
accordingly"*. Triaged under Step 1 as a requirement/direction change, committed
as `56ccceb`. **This supersedes Slice 114 (2026-08-22), which refused this exact
ask** and wrote its own reopen condition — htmx 4 ships stable AND someone audits
the "discards non-2xx" claims first. **The first half is now met.**

**Nothing was pinned, and that is sequencing with a measured reason, not a
refusal of the direction.** Every fact was measured against the shipped 4.0.0
tarball rather than inherited from 114's WebFetch, and that re-check immediately
paid: **114's claim that `hx-vals` is removed in htmx 4 is WRONG** (live path at
`dist/htmx.js:487`).

```
npm view htmx.org dist-tags        # latest: 2.0.10   next: 4.0.0
npm pack htmx.org@4.0.0
grep -c 'hx-ext'    package/dist/htmx.js   # 0    REMOVED
grep -n  '204\|304' package/dist/htmx.js   # 202:   noSwap: [204, 304]
npm view htmx-ext-head-support dist-tags   # latest: 2.0.5  — no htmx-4 release
grep -n '<head'     package/dist/htmx.js   # 1049: strips head, keeps ONLY title
```

**`221.3` is the blocker and it needs the owner.** htmx 4 removes `hx-ext`; the
docs shell uses `hx-ext="head-support"` at `Gallery.astro:208`;
`htmx-ext-head-support` tops out at **2.0.5**; htmx 4 has no native head merging.
There is **no published upgrade path for that dependency today** — a fact about
the ecosystem, not a cost this repo can absorb by trying harder. Its Accept takes
any of three answers, including *"docs stays on htmx 2 while po-app moves to 4"*,
which is not a failure.

**`221.1` is ready to execute** and is deliberately shaped to land
`examples/po-app` alone: po-app uses **zero** `hx-ext` and all eight of its
attributes exist in htmx 4. But its 422s (`server.mjs:1374/1550/1636/1705`) and
409 (`1691`) currently rely on being **discarded**, and under `noSwap: [204,
304]` they will swap — so `check:po-app`'s 19 assertions must be **re-derived,
not re-run**.

**`221.2` is the audit 114 made a precondition**, surface counted: 7 pages assert
"discards", **30** pattern pages carry a 4xx/409/422 Data-contract row, 6 htmx
references in `check-claims.mjs`. It is the one item here a cloud wake can take
end-to-end.

## `check:po-app` — the documented number CHANGED, do not read the old one

**`ENVIRONMENT.md` is stale on this and it is filed as `222.1`.** It still says
*"the expected reading here is 2 of 19"* and blames a blocked htmx CDN. After
211.1 there is no CDN.

```
before 211.1, this container:  FAILED — 2 of 19   {"htmx":"undefined"}
after  211.1, this container:  FAILED — 1 of 19   (precondition passes)
CI, same commit 5e5ede6:       success — 19 of 19
```

17 previously-vacuous assertions now genuinely run and pass, and this container
reads `chunk0Evicted: **true**` — which **spends 208.3's standing warning** that
a false there meant "htmx never loaded".

The one residual is `chunk0Reloaded: false`. **Read the payload, not the
assertion name**: `anchorShift 0`, `scrollShift 0`, `spacerMatchesReal true`,
`hiddenInputSurvives true`, `countAtEnd "1 selected"` — everything the name
promises is green and Slice 213's P0 fix is holding. **Not filed as a P0**: CI
concluded success on the same commit and 211.1's message records 19/19 under
`podman --network none`, so two independent green readings of identical code make
this a container divergence. 222.1 says to compare the **harness** (tarball
consumer vs raw workspace) before touching timing.

## Lapped mid-wake, and Step 0c's re-fetch is what caught it

Step 0 fetched `origin/main` at `89bb937` — the sha the previous hand-off named.
**The re-fetch before the first commit returned `8798da6`**: the other dispatcher
had landed `5e5ede6` (211.1) plus its record row. Nothing of this wake's work was
lost; the rebase onto it resolved **with no conflict at all**.

**A third data point for roadmap 175.4**, which leaves the decision open: the
"safe by construction" argument predicts a conflict on `loop-log.md` or
`ROADMAP.md`, and again neither happened — their ROADMAP hunk ticked a box ~1,700
lines from this wake's insert, and this wake had not yet recorded. **The working
half is the mandated pre-commit fetch**, a process rule with nothing mechanical
behind it.

It also **helped twice**: 211.1 removed the last CDN version literal in the repo
(so "pin htmx to 4" is now two `package.json` ranges), and it made Slice 222's
before/after possible at zero cost.

The container started **detached**; `git checkout -B main origin/main` at Step 0,
`git branch --show-current` non-empty before each commit — ENVIRONMENT.md trap 1.
`git rev-parse --short main HEAD` reproduced the documented `fatal: Needed a
single revision`, which that trap warns is **not** evidence of a missing branch.
The clone is still **shallow** and was left that way: nothing measured this wake
was a history measurement.

## Cloud-wake limits, stated rather than implied

No Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. Slice 220's whole diff under `apps/docs/src` is **one JSON string** — no
CSS, no markup, no `.astro` page touched — so nothing rendered should move, and
the corrected cite was verified in the BUILT html rather than in the diff. **That
is an argument plus a DOM check, not a look at the page.** Slices 221 and 222 are
markdown only.

Gates green in this container (16, the list re-derived from `ci.yml` — the grep
prints 17, the extra being `check:ci-ignores`, a sub-check of `check:repo`): core
build/test/`lint:css`, `docs:build` (runs `check:repo`, so `check:dsa-scores` and
`check:selftests` ran), `check:claims` (158 live + the documented 3 NOT VERIFIED
for this container's `pointer: none`), `check:formatting`, `check:scroll` (910
containers / 118 pages), `check:forced-colors`, `check:layout` (127 pages),
`test:axe` (127 × 2, zero), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check -w @busy-office/create-ui`, `npm run suite` (28
screens, zero violations). **`check:po-app` is 1 of 19 here — see above, and do
not expect the documented 2.**

**`polish_requeue.py` still cannot run before a build** — it dies with
`FileNotFoundError: packages/core/dist/api.json`. 217 recorded this as a shape
rather than filing it, and that holds: the traceback names the missing file, so
it fails loudly rather than skipping quietly. `npm run build -w @busy-office/ui`
first is the whole fix.

## Dispatcher state at hand-off

Rules as this wake read them, each from its own source. **Rule 1** clear — no
open P0 (`grep -inE 'P0' ROADMAP.md` returns only closed slice headings), GitHub
intake **0 open issues** (`list_issues` `state: OPEN` → `totalCount: 0`).
**Rule 2** `Standardize 3 / 4 ok`. **Rule 3 OVERDUE** — see the warning above.
**Rule 4**: read as four owner/hardware-blocked items at Step 0; `211.1` closed
mid-wake and three new items were filed. **Rule 5** clear and **not** stale —
`0 wake-date(s) newer`, newest pair `axe-violations` 0 → 0, and the one declared
size budget (`RF_BUDGET_KB = 40`, `build-rf-essentials.mjs`) is gated by a build
that passed. **Rule 6** fired and ran.

**The open set, with the KIND of blocked per 186.2** — re-read from each item's
own text:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| `221.3` htmx-4 head-support | **owner-blocked — a product call, and the ecosystem has no fix** |
| `221.1` pin po-app to htmx 4 | **browser-blocked — needs a harness where `check:po-app` reads 19 of 19** |
| `221.2` non-2xx claim audit | **NOT blocked — a cloud wake can take it end-to-end** |
| `222.1` characterise the po-app residual | **not blocked — starts as a harness comparison, not a re-run** |

**`221.2` and `222.1` are the first genuinely unblocked build items this loop has
had in several wakes.** Named explicitly because four consecutive wakes once
reported "all open items owner-blocked" while 173.2 was merely browser-blocked —
the mis-sort 186.2 exists to prevent.

## Direction

**The owner's htmx-4 direction is accepted and planned, not refused — but it
cannot be executed as a single flag-day, and 221.3 is why.** The single most
unblocking thing is an answer to 221.3's three-way Accept. Option (c) — docs
stays on htmx 2, `examples/po-app` moves to 4 — needs no new ecosystem release
and lets 221.1 proceed immediately.

**114's `hx-vals` error is the argument for re-measuring an inherited premise,
landing again.** Two wakes running, an inherited claim has been wrong: 217.2's
`breadcrumb` cite (no command recorded beside it) and now 114's breaking-change
list. Both were caught by re-running the measurement, not by review.

**`175.4` gained a third data point** — a real collision, rebased clean, caught
only by the mandated pre-commit fetch. The decision stays open.

**Still unacted, now six wakes older:** 177's observation that a grill's roadmap
slice pays for its text twice.

**Standing three unchanged** (112.3, 112.4, AT runtime).
