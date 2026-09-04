# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3). Run both against the file as it now stands rather
> than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-04 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 261 and this hand-off.

**`check:resume-slice-ids` reports four closed ids, and all four are
deliberate.** It names `249.18`, `249.17`, `249.16` and `249.4`: the first is
*what this wake closed*, and the other three are the two-precedent chain the
correction block below cites by name (`249.16` came out of `249.4`). The count
is read from the check's own output rather than counted by hand — the first
draft of this paragraph said three, having missed `249.4` inside a parenthesis.
The live open set is
`249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`, plus Slice 15 and
`112.3`/`112.4`. Nothing here queues or blocks on a closed id.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. GitHub intake is empty (`list_issues` → `totalCount: 0`). The two
standing owner blocks are unchanged: Slice 15's `AT runtime evidence` (owner
hardware) and `112.3`/`112.4` (owner briefs, then 112.3's verdict).

What landed needs no owner decision and changes nothing a reader sees — it adds
a generated key and a gate arm, and touches no CSS.

## ⚠ The correction most likely to be re-broken

**The per-EVIDENCE split rule is now 3 for 3, and this wake found it in an item
nobody had flagged as splittable at all.** `249.16` out of `249.4`
(2026-09-03), `249.17` out of `249.15` (2026-09-04), and now `249.18` out of
`249.9`. The first two were items a hand-off had already named as
browser-blocked; this one was reached by reading the Accept's OPENING CLAUSE —
*"every badge on a card either traces to a JSON key or the card renders the
absence"* — and noticing that a badge tracing to a key is derivation while the
card is the rendered image.

**So the question to ask at rule 4 is not "is this item browser-blocked" but
"which clause of its Accept needs a human's eyes".** Three consecutive wakes
answered the first question and reported nothing dispatchable.

**And the second lesson from this one: a premise that names its own answer.**
249.9's consequence 2 said the mapping "needs a generator that does not exist",
then described building one "the shape `gen-patterns-index.mjs` and
`gen-patterns.mjs` already have, both of which run before `astro build` and read
`src/pages/patterns/*.astro`". That is not a shape to copy — it is the script
that already does it, and already emits the relation. The audit was one
`node -e` away from refuting itself.

**`bundle-gz-kb` still cannot be sampled, and the reason is unchanged from the
last two wakes** (259.1's rule-5 finding, re-verified this wake, not
re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number.
Do not "fix" rule 5's staleness by recording a guessed value. The fix is to
write the derivation command next to the name, which is a loop-script change
and wants its own dispatch.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** reads `3 / 4` — this wake ran one Continue round, so
  the NEXT Continue round arms Standardize. Expect rule 2 to preempt rule 4
  one round from now.
- **Rule 3 (Objective)** reads `1 / 3`, naming `[249]`. Read after recording,
  per `LOOPS.md`'s instruction that this counter is only ever caught by a
  number disagreeing with something a human just wrote down: this wake's row
  begins `249.18`, so `SLICE_TOP` attributes it to 249 while the slice it
  closed is 261. **Third hand-off running with the same disagreement, same
  verdict — recorded, not fixed**; `LOOPS.md` rule 3 refuses a sixth regex over
  that parser and nothing downstream reads the attribution.
- **Rule 5 (Optimize) reads STALE, `1 wake-date(s) newer`** — unchanged from
  wake start, because this wake's rows land on 2026-09-04, a date already
  counted. `LOOPS.md` rule 5 is explicit that STALE means the rule has no input
  and must be reported as *could not be evaluated*; it was reported that way.

## Next wake

**Rule 2 (Standardize) is the first rule that can fire once one more Continue
round lands**; until then rule 4. Re-run `dispatch_status.py`; this is a
snapshot.

Rule 4's open set is `OPEN: [15, 112, 249]`, **11** open items, unchanged in
count: 249.18 was filed already closed. Classifications re-read against
`ROADMAP.md` this wake, in the shape `LOOPS.md` 186.2 requires — per item, not
for the backlog as a whole:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6`, `249.9`, `249.15` are browser-blocked in the SCREENSHOT sense** —
  a LOCAL wake can take them; a cloud wake should not. Each has its
  cloud-takeable measurement already banked, so none should be re-derived:
  249.6 has the six-row terminal-page table, 249.15 has the tag work already
  landed as 249.17, and **249.9 now has its pattern-links badge answered** by
  249.18 — what remains there is the card itself, the AT badge (0/40, Slice 15)
  and the JS-tier badge.
- **`249.9`'s consequence 4 is the next cloud-takeable-looking thing in that
  item, and it is NOT obviously takeable.** "This badge needs a recorded key,
  not a set intersection" means declaring a JS tier per component — a new CSS
  header directive in 249.8's mechanism plus **40 judgement calls** about what
  "JS-required" means, which nothing in the repo currently distinguishes. That
  is an architecture call with authoring behind it, not a derivation. Do not
  take it as a sibling of 249.18 without deciding the definition first.
- **`249.7` is open as a COST question, not unstarted work.** Its Accept's
  first clause is executed — 4 of 5 seed rows do not reproduce, table is in the
  item. Do not re-run that grep. Settling it before the owner answers `249.10`
  decides it on the thinnest input. **One thing inside it is still unbanked
  and cheap:** its measured *Related-link* gap — the dropdown page never names
  or links `combobox` in its own content — is a docs change, not a terminology
  one, and no item owns it yet.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency and carries **no Accept criteria**, so it cannot be
  dispatched as written — giving it one is itself a triage-sized task.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **1,758 / 4,458 = 39.4%** at
hand-off — well under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 38.1% at wake start; the share rose because Slice 261 closed
*fully*, so its whole body is closed history the moment it lands. That is
arithmetic, not a backlog signal — the same mechanism the last five hand-offs
recorded, now six wakes running. Eligible targets
`[261, 260, 259, 258, 257, 256, 255, 254, 253, 252, 237]`, of which 253, 237 and
260 are named by the still-open Slice 249 and stay per 236.2. **261 is named by
249.18, which is closed, so it does not stay on that ground** — check it against
249.9 before moving it, since 249.9 is open and now cites 261's finding.
Re-run the script; snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4 (Continue, build mode).** Rule 1
clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input. Step 0c's pre-commit `git fetch origin main` showed no
movement, so no collision.

### Slice 261 — 249.18 split out of 249.9 and landed

Five things worth carrying:

1. **The split is the finding**, and the route to it is the correction block
   above.
2. **The audit's number reproduced and its mechanism claim did not.** 29/40 and
   all eleven zero-reach names came back character for character from inverting
   `patterns-index.json` — a route the audit did not use, and the very file it
   said had no such key. Reconciling against something independent before
   quoting is what made the refutation safe to publish.
3. **The reproduced number was still one short.** `/components/nav` is a
   registered redirect to `/components/sidebar-nav`, cited 5 times across
   `app-frame` and `suite-home`; a literal href match reads that as an absence.
   Redirect- and anchor-aware: **30/40 reached, 10 zero**. It was checked as a
   possible broken link first — it is not one.
4. **The gate arm caught the first draft's own bug, not review.** Keying off
   `api.json` left `inline-editing` and `table-toolbar` cited-but-unkeyed —
   they are component docs pages with no CSS dir. `component-nav.mjs`'s
   `ALL_ITEMS` is where that exception is already reconciled, so the key set is
   41, not 39.
5. **A red-proof was refused before it ran, and the reason generalises.** The
   obvious way to red-prove the arm is to inject a badge for a component the
   built page does not mention — but all ten zero-reach names appear in every
   built page's markup, because the sidebar lists all 43 components on all 127
   pages. A bare-href presence check would have picked a target that was never
   absent. The badge-class anchor is what makes the arm read 165 links instead
   of thousands; same shape as 249.6's anchor finding, in a different gate.

Also: the third injection (removing `resolveHref` from the generator ONLY)
measured something the plan had not — the anchor strip is separately
load-bearing, `dashboard` 8 patterns → 10 via `/components/dashboard#card`.
Neutering `resolveHref` in `redirects.mjs` instead would have neutered both
sides and gone **green**.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. Unusually, the no-pixel-movement
claim here is *measured* rather than argued: **0** files under
`packages/core/src/css/` are touched, and the two rendering consumers
(`patterns/index.astro`, `index.astro`) read only `.groups` and `.count`, both
byte-identical to HEAD — `patterns-index.json` is **+222/−0**. All 17
cloud-toolchain gates green, plus the `DOCS_BASE=/busy-office-ui` parity build,
whose base-stripping branch was **confirmed exercised** (built badge hrefs carry
the prefix and all 41 entries still matched) rather than merely green.
