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

Last updated 2026-08-30 (**cloud** wake — Step 1 triage → **Slice 219**, then
rule 4 → **Continue**, build mode on `219.1`). Working tree clean at hand-off;
one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off (219.1 opened and closed in-wake)
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `219.1`, `218.1`, `127b9e5`'s
slice, `94.11`, `186.2` — are historical references to this wake's work and to
what it cites, not claims they are open. The four genuinely open are **`112.3`,
`112.4`, `211.1`, AT runtime**. This wake changed none of them.

## NOT lapped this wake, and that was checked rather than assumed

Step 0 fetched `origin/main` at `4713084` — **one commit newer than the previous
hand-off described**, and that commit is not a loop row: `4713084`, *"DESIGN.md
— add a Non-goals section"*, authored `ThePFMind`, with no
`record_iteration.py` row behind it. Treated as owner-authored content, not as
a dispatch to reconcile. The re-fetch Step 0c mandates before the first commit,
and again before the second, both returned `4713084`. No collision.

The container started **detached**; `git checkout -B main origin/main` at Step 0,
`git branch --show-current` non-empty before each commit — ENVIRONMENT.md trap 1.
The clone is still **shallow** and was left that way: nothing this wake measured
was a history measurement, so trap 2's unshallow was not needed and not run.

## What landed this wake

**Slice 219 — triage, then 219.1 built and closed.** Full reasoning, the
red-proof table and every command are in ROADMAP 219.

- **The triage exists because the previous hand-off said it should.** 218.1
  named its gate's coverage gap and left it as *"worth a line of owner
  direction, or a triage row on a later wake"*. Filing it into `ROADMAP.md`
  rather than re-copying it here is 169.3's lesson applied on purpose.
- **`examples/erp-suite/check-erp-suite.mjs` gained a fourth assertion**: every
  rendered `.bo-timeline__step[data-state="current"]` carries
  `aria-current="step"`. Not a new script — that file was already `@exact` and
  already walked the built dist.
- **Red-proved three times, injection confirmed each time**, including once
  against the **real historical defect** (`git checkout 577c572 --
  examples/erp-suite/p2p/purchase-order.screen.mjs`, rebuild → red). The 100%
  base rate today (8 of 8) is stated as the weakness 94.11 says it is; what
  earns the ratchet is that the population held a violation one day earlier,
  found by a source grep and by no gate.
- **Two refusals recorded**: the aria-hidden/inert exemption (needs a DOM
  parser → `jsdom`, which this directory has no `package.json` to declare;
  0 `inert` and 265 decorative `aria-hidden` measured first), and putting the
  rule in `packages/core/scripts/check-markup.mjs`, which ships as the
  `bo-check-markup` bin — a contract change to a published tool, not a gate
  extension.

**Instrument correction worth carrying, and it is `LOOPS.md`'s own prescribed
comparison working.** Rule 3's counter did **not** move after the Continue row
was recorded, while a slice had visibly just closed. That is the disagreement
`LOOPS.md` says to look for right after recording — and the defect was **mine,
not the parser's**: the row's item text began `Roadmap 219.1 — …`, and all three
patterns anchor the slice number at position 0, so it fell into the measured
24.2% slice-less bucket. The row was corrected to `219.1 — …` before commit and
the mirrors rebuilt (`rebuild_from_log.py`, `generate_status.py`,
`generate_roundtable_index.py`), with the raw `grep -c '^- '` asserted unchanged
at **1211** either side. The counter then read `2 / 3 slices [218, 219]`.
**Not a sixth recurrence — start a Continue row with the bare slice id.**

## Cloud-wake limits, stated rather than implied

No Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. The diff is one gate script, one docs-script comment and `ROADMAP.md`
— `packages/core` and every `.astro` page are untouched — so nothing rendered
should move. **That is an argument, not a look at the page.**

Gates green in this container (16, the list re-derived from `ci.yml`): core
build/test/`lint:css`, `docs:build` (runs `check:repo`, so `check:selftests`
ran), `check:claims` (158 live + the documented 3 NOT VERIFIED for this
container's `pointer: none`), `check:formatting`, `check:scroll`,
`check:forced-colors`, `check:layout` (127 pages), `test:axe` (127 × 2, zero),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check -w @busy-office/create-ui`, `npm run suite` (28 screens; audit zero
violations). **`check:po-app` is the documented 2 of 19** — this container
cannot fetch the htmx CDN.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison that just paid for itself
(above).

```
python3 scripts/loops/dispatch_status.py
```

Rules as this wake read them, each from its own source: rule 1 clear (no open
P0; GitHub intake **0 open issues**, `totalCount: 0`), rule 2
`Standardize 2 / 4 ok`, rule 3 `Objective 2 / 3 ok [218, 219]` — **one more
closed slice arms an Objective grill**, rule 5 **`ok`, not STALE** (newest pair
`axe-violations`; no regression, no budget breach), **rule 4 fired** on `219.1`.

**Rule 4's remaining four, with the KIND of blocked per 186.2** — re-read from
each item's own text this wake:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| `211.1` vendor htmx into `examples/po-app` | owner-blocked — a product call |
| AT runtime evidence | hardware-blocked — owner hardware |

**None of the four is browser-blocked**, so this is not the mis-sort 186.2 warns
about. With 219.1 closed, rule 4 has nothing dispatchable again; the next wake
most likely reaches **rule 6, Polish** (run `polish_requeue.py --apply` first,
then the citation-reconciliation arm — it has found a real defect on 4 of 5
surfaces where it has been run), or **rule 3** if it closes one more slice.

## Direction

**`examples/po-app` is now the ONLY uncovered timeline, and that is recorded in
both gates rather than left implied.** 218.1's hand-off offered the suite half
as owner direction; this wake took it as a triage row and built it. What is
left is genuinely harder and is not a defect: po-app has no built dist to walk,
its timeline is a template literal in `server.mjs`, and `check:po-app` cannot
run green in an egress-restricted container at all. **Covering it is arguably
downstream of `211.1`** — an app that could load htmx locally would also be an
app whose gate runs here. Worth a line of owner direction; not filed, because
filing it before `211.1` is decided would be planning against an unknown.

**`211.1` remains the owner's call and this wake did not touch it.** The
standing correction holds: the docs teach no CDN wiring at all, so the question
is whether to ADD teaching, not to preserve it.

**`175.4` gained no new evidence this wake** — no collision occurred, and
`origin/main` did not move between Step 0 and either commit.

**Still unacted, now five wakes older:** 177's observation that a grill's
roadmap slice pays for its text twice.

**Standing three unchanged** (112.3, 112.4, AT runtime).
