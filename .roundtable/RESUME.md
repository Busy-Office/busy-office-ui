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

Last updated 2026-08-30 (**cloud** wake — rule 4 → **Continue**, build mode on
`218.1`). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 4 at hand-off (was 5; 218.1 closed)
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

Ids named below that are **closed or archived** — `218.1`, `217.2`, `176.1`,
`154.1`, `94.11`, `186.2`, `211.1`'s neighbours — are historical references to
this wake's work and to what it cites, not claims they are open. The four
genuinely open are **`112.3`, `112.4`, `211.1`, AT runtime**. This wake changed
none of them.

## NOT lapped this wake, and that was checked rather than assumed

Step 0 fetched `origin/main` at `577c572` — one commit newer than the previous
hand-off described, because that hand-off was written before Slice 218's triage
commit landed. The re-fetch Step 0c mandates before the first commit returned
the same `577c572`. No collision.

The container started **detached** and the local `main` ref was stale at
`17b3ba6`; `git checkout -B main origin/main` at Step 0, and
`git branch --show-current` verified non-empty before the first commit —
ENVIRONMENT.md trap 1, exercised exactly as written.

## What landed this wake

**Slice 218.1 — the `data-status` split REFUSED; the `aria-current` pair kept
and gated.** Full reasoning and every command are in ROADMAP 218.1.

- **Two of the item's own premises were wrong, and re-checking them is what
  changed the answer.** `grep -rn 'data-status=' … → 0` is true of that command
  and reports a **false absence** — the trailing `=` is a position filter, and
  `/patterns/job-monitor` writes it as `<code>data-status</code>`. The plain
  fixed string finds 2. So the proposed convention already ships here, which
  turns the question from "adopt a foreign name?" into "where is the boundary?".
  Also `~60 components` → **40**.
- **Decision: `data-state` is what the shipped CSS SELECTS ON; `data-status` is
  payload no stylesheet touches.** One rule, already holding framework-wide.
  No CHANGELOG entry — nothing in `packages/core` changed but comments, and
  writing a **Breaking** entry because the Accept forecast one would be 154.1
  repeated.
- **The `current`/`aria-current` half went the OTHER way from the way it was
  filed.** Not redundant: `PatternPreview.astro:110` draws thumbnails inside
  `<div class="tile-preview" inert aria-hidden="true">`, where the step must be
  visible and `aria-current` reaches nobody. But the pair had already drifted —
  6 rendered in the built docs, 4 paired, 2 not, one of them a real defect on
  `/patterns/object-page`. Two markup sites fixed; new `@exact` gate
  **`check:timeline-current`** in the `docs:build` chain.

**Instrument correction worth carrying:** the refactor that made the gate assert
**per page** — so a clean tree cannot report a pass over zero checks — built the
failure-detail string eagerly and crashed with a `TypeError` on every clean page.
All three "red" results in that round were **crashes, not verdicts**, and they
looked like a working red-proof. Retake a red-proof after any change to the
detector, and read the failure text, not just the exit code.

## Cloud-wake limits, stated rather than implied

No Podman, no `localhost:8081`, **no screenshots at 1440px or 390px in either
theme**. `packages/core` changed by comments only (verified: the new comment is
absent from the built dist CSS, and the README size stat still matches), and the
two markup fixes add one ARIA attribute no framework selector reads — so nothing
rendered should move. **That is an argument, not a look at the page.**

Gates green in this container: core build/test/`lint:css`, `docs:build`,
`check:claims` (158 live + the documented 3 NOT VERIFIED for this container's
`pointer: none`), `check:formatting`, `check:scroll`, `check:forced-colors`,
`check:layout`, `test:axe` (127 × 2, zero), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check -w @busy-office/create-ui`,
`check:repo`, `npm run suite`. **`check:po-app` is the documented 2 of 19** with
`htmx: undefined` named first — this container cannot fetch the CDN.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — and it agreed with what the wake
had just done: `Standardize 0 → 1`, `Objective 0 → 1 [218]`.

```
python3 scripts/loops/dispatch_status.py
```

Rules as this wake read them, each from its own source: rule 1 clear (no open
P0; GitHub intake **0 open issues**, `totalCount: 0`), rule 2
`Standardize 0 / 4 ok`, rule 3 `Objective 0 / 3 ok`, rule 5 **`ok`, not STALE**
(newest pair `axe-violations`, 0 → 0 — no regression, no budget breach), **rule
4 fired** on `218.1`.

**Rule 4's remaining four, with the KIND of blocked per 186.2** — re-read from
each item's own text this wake:

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| `211.1` vendor htmx into `examples/po-app` | owner-blocked — a product call |
| AT runtime evidence | hardware-blocked — owner hardware |

**None of the four is browser-blocked**, so this is not the mis-sort 186.2 warns
about. With 218.1 closed, rule 4 has nothing dispatchable again and **a Polish
round is the likely next dispatch** — its stated pick is still `breadcrumb ·
fit`'s stale denominator (217.2: "2 of **19** pattern screens" against **39**
today, numerator still 2). Run the citation-reconciliation arm first; it has
found a real defect on 4 of 5 surfaces where it has been run.

## Direction

**A NEW OWNER DECISION IS AVAILABLE AND WAS DELIBERATELY NOT TAKEN.** 218.1's
gate covers the **built docs pages only**. `examples/erp-suite` and
`examples/po-app` render timelines it never sees, and neither `npm run suite`
nor `check:po-app` asserts the pairing — the erp-suite defect this wake fixed
was found by a source grep, not by any gate, and the next one would not be.
Extending the pairing assertion into `suite:check` is a small, exact change; it
was left alone because widening a just-shipped gate on the same wake is scope
the item did not ask for. **Worth a line of owner direction, or a triage row on
a later wake — not a defect.**

**`211.1` remains the owner's call and this wake did not touch it.** The standing
correction holds: the docs teach no CDN wiring at all, so the question is whether
to ADD teaching, not to preserve it.

**`175.4` gained no new evidence this wake** — no collision occurred, and
`origin/main` did not move between Step 0 and the first commit.

**Still unacted, now four wakes older:** 177's observation that a grill's roadmap
slice pays for its text twice.

**Standing three unchanged** (112.3, 112.4, AT runtime).
