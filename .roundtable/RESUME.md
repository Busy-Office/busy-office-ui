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

Last updated 2026-08-30 (**cloud** wake — rule 3 → **Objective**, the dispatch
the previous hand-off predicted). Working tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `215.1`, `215.2`, `215.3` and `213.1` as
closed ids named here — **historical references** to this wake's own work and to
what it grilled, not claims they are open. The only ids named here that
genuinely ARE open are `211.1`, `112.3`, `112.4`.

**No collision on this wake.** `origin/main` was at `aba7c3cc` at Step 0, still
`aba7c3cc` at the mandated re-fetch before the first commit, and still
`aba7c3cc` at the final fetch before the commit landed.

**Trap 1 fired for real again, ninth wake running.** Container started detached
(`git branch --show-current` empty) with `origin/main` arriving as a forced
update (`+ 17b3ba6...aba7c3c`). Recovered at Step 0 with
`git checkout -B main origin/main`, before any commit. The clone was
**unshallowed** (50 → 1,703 commits) because two claims under grill are history
measurements.

## What landed this wake

**Slice 215 — Objective grill of 211, 213, 214.** Full report:
`.roundtable/grill-objective-211-213-214-2026-08-30.md`. Scope was the **whole
armed set with no narrowing needed** — the first grill since 212 whose set
contains no already-grilled slice, so the hand-narrowing 207/209/212 each had to
do did not recur.

**The finding that matters, because it sits under an OPEN owner decision:
`211.1`'s refusal premise is measurably FALSE.** That item declines to vendor
htmx because doing so *"changes what the reference app teaches — a real consumer
wiring htmx from a CDN, which is what `/getting-started/htmx` documents"*. That
page carries **0** each of `unpkg`, `cdn`, `jsdelivr`, `script src`, `install`;
across **all of `apps/docs/src/`, 0 files** contain `unpkg` or `cdn`. What the
page actually documents is the *integration* — the opt-in
`@busy-office/ui/css/htmx` stylesheet and the `initDialogs`/`initDataTables`
wiring — never how to load htmx by any route. Repo-wide `unpkg` survives in one
piece of live code (`server.mjs:125`) plus one comment about it. The second half
fails too: *"the mechanism costs nothing"* rests on **`apps/docs`**'s dependency
— `examples/po-app` is not a workspace, declares only `@busy-office/ui`, and has
no `node_modules`; the version it would resolve to (**2.0.10**) is not the one it
pins (**2.0.4**). The correction is recorded **inside 211.1**, and the item stays
OPEN because the product call is the owner's.

**213's one self-declared unverifiable claim is now verified and it holds.** It
closed saying *"this could not be verified on CI from here"*. 213.1 landed as
`926bd36e` and was pushed with `dd76ee84` on top, so **CI run 663 ran ON the
fix** (`git show dd76ee84:…/windowed-list.ts | grep -c measuredChunkHeight` → 3).
6 of 6 jobs green; the reference-app job logs `po-app smoke check passed — 19
behaviours verified end to end`, non-vacuous because 208.3's htmx precondition is
one of the 19. The residual risk 213 named did not materialise. **n = 2**
post-fix CI runs (663, 664) — which is what this supports and no more.

**A confound neither 211.2 nor 213 named:** every container measurement ran htmx
**2.0.10** (`node_modules` holds the only `htmx.min.js` here) against an app
pinning **2.0.4**. 213's *defect diagnosis* is untouched — `3250 vs 3299` is
arithmetic over row heights — but the **timing** figures beside it race a fixed
150ms wait. 211.2 reasoned about a timing confound and 213 wrote that it *"was
named and removed"*; it was removed for **interception**, not for version.

**Slice 214 reproduces to the digit and nothing in it is corrected.** All four
lanes (0 dead of 1,433 · 74 files/242 rules/230 distinct/8 repeats · 9 corpus +
12 family = 14 distinct · ratchet `ROADMAP.md` 0 up, last cut `e29c7c18`);
conservation verified structurally from git (`--numstat` `1575 0` on the archive,
`--name-status` **M / M never A**, appended block walks to 7 headings + 1,568
body, byte-exact prefix **True**); `check:slice-refs` **427/233/196/2**.

**214's falsification of 179.2 also reproduces** over 801 `ROADMAP.md`-touching
commits — all four closed cycles match to the digit. **What this grill adds is
the interval, not the rate:** commits a cycle survives now read **140 → 66 → 34
→ 66 → 9**, so the sweep is due roughly every nine such commits. The fifth cycle
has since closed at 9 commits / 896 lines / 99.6 per commit.

**One refusal recorded:** gating "a roadmap claim about a docs page is true" —
the semantic class roadmap 94.11 refuses; the shape is checkable, the meaning is
not.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. Nothing this wake claims rests
on a rendered image — the change is markdown-only in two files no page renders,
and every figure is a grep count, a git line count or a gate's own output.

Green in this container: core build, `npm run test` **152/152** (27 files),
`lint:css`, `docs:build` rc=0, `check:repo`, `check:claims` 158 live + 3 NOT
VERIFIED (ENVIRONMENT §6b — a container property, not a regression),
`check:formatting`, `check:layout` 127 pages, `test:axe` 127 pages × 2 widths
zero violations, `check:slice-refs` **428/233/197/2** after the edit (the +1s are
Slice 215's own heading, the mechanism 214 documented).

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures:

```
python3 scripts/loops/dispatch_status.py
```

At hand-off: **`Standardize 0 / 4 ok`**, **`Objective 0 / 3 ok`** (reset by this
wake's row), `Optimize` **STALE**. So no counter is armed and **the next wake
falls through to rule 4 — Continue, oldest open item.** Log reconciles: parser
**1200** against a raw `grep -c "^- "` of **1200**.

**Rule 5 still reads STALE**, one wake-date newer than its newest comparable
pair. Per rule 5's own text, say it could not be evaluated rather than reporting
it clear. This wake recorded no metric, so it did not improve that.

**Rule 4 will find every remaining item blocked. The KIND, per rule 4's own
instruction:**

| item | what | kind of blocked |
|---|---|---|
| `112.3` | pattern-fit pilot (oldest open) | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| `211.1` | vendor htmx into `examples/po-app`? | owner-blocked — **but its inputs changed this wake**, see below |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

Rule 4 finding nothing dispatchable then falls to rule 5 (STALE, cannot be
evaluated) and **rule 6 — Polish**, whose predicate is true of 19 of 19
non-skipped surfaces (176.2). Run `polish_requeue.py --apply` first.

## Direction

**`211.1` is still the owner's call, but it is no longer the same call.** The
previous three hand-offs framed it as a trade: vendoring buys an offline example
and costs the CDN wiring the docs teach. **Measured this wake, the docs teach no
CDN wiring at all** — 0 files under `apps/docs/src/` mention `unpkg` or `cdn` —
so option (a) does not remove a lesson from anything a reader is directed to.
What it costs instead is a dependency declaration or a vendored file for a
package that deliberately declares only `@busy-office/ui`. The question the owner
is actually being asked is therefore **whether to ADD teaching the docs do not
yet carry**, not whether to preserve teaching that exists. Commands are in ROADMAP
211.1's correction block and in the grill report.

**The archive sweep's cadence is the measurement worth carrying forward.** 177's
"is the sweep converging" question now has four closed cycles and a fifth: the
commits a cycle survives have gone **140 → 66 → 34 → 66 → 9**. 214 falsified
179.2's monotone claim on regrowth; this wake reproduces that and adds that the
*interval* is what has collapsed. Nothing is proposed — the sweep runs from
inside rule 4 when the file is walked, and that mechanism is working.

**Still unacted, and now one wake older:** 177's observation that **61% of one
sweep's moved lines were Objective-grill slices that ALSO have a full report in
`.roundtable/`**. This wake is a fresh instance — Slice 215 is ~120 roadmap lines
alongside a full report. Whether a grill's roadmap slice should be a pointer
rather than a second copy is a direction call about how the loop records its own
work, and this loop does not take those.

**Standing three unchanged** (112.3, 112.4, AT runtime).
