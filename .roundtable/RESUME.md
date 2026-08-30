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

Last updated 2026-08-30 (**cloud** wake — rule 4 → **Continue/build** on
`211.2`, which found a P0 that rule 1 then dispatched as **Slice 213**). Working
tree clean at hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 4 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `211.2`, `213.1`, `208.3`, `209.2`, `201.4`,
`212.1` and `212.2` as closed ids named here — **historical references** (this
wake's own work and the prior wake's findings), not claims that they are open.
The only ids named here that genuinely ARE open are `211.1`, `112.3`, `112.4`.

**No collision on this wake.** `origin/main` was at `c60ee88` at Step 0 and still
at `c60ee88` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again, seventh wake running.** Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...c60ee88`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. The clone was
**unshallowed** this wake (`git fetch --unshallow`, 1,697 commits) because a
finding needed the date a gate assertion first shipped.

## What landed this wake

**`211.2` — the premise was false, and its own control is what refuted it.**
The item invited the close *"the variance is the shim's"*. Measured both halves:
CI (real CDN) logs `po-app smoke check passed — 19 behaviours verified end to
end` on run 662, non-vacuous by construction because 208.3's htmx precondition is
one of those 19; and this container still exceeds the threshold in **12 of 20**
runs with **no request interception at all** — the app's one `<script src>`
repointed at a local static server instead. The confound in 208.3's evidence was
that interception delays htmx's own chunk fetches, which is the timing under
test; removing it did not remove the failure.

**`213.1` — P0, found by that measurement and filed rather than built inside it**
(Slice 211's own preamble set that precedent). `windowed-list.ts` sized an
evicted chunk's spacer as `rowCount * one sampled row`; on `/movements` 98 of 100
rows are 33px, 2 are 32.5px, and the sample is one of the outliers — so every
chunk was **49px short** and re-loading one jumped the scroll by exactly that.
Now measured from the chunk itself. `3250/3299 err +49` → `3299/3299 err 0`,
4 of 4; downstream `anchorShift` `>2 in 12 of 20` → `0 in 40 of 40`.

**The result worth carrying: the old gate assertion was INVERTED.** Red-proving
`spacerMatchesReal` in the direction that looked redundant showed it **fails on
the fixed code and passes on the bug** — both detectors derived their expectation
from the value under test, so shipping the behaviour fix alone would have turned
CI red. That was not predicted.

**Two refusals, both recorded:** tuning `check:po-app`'s 150ms anchor wait (the
timing sensitivity is about a real jump — fix the jump, not the sleep), and
widening 211.2 to carry the shipped-behaviour change.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. Nothing this wake claims rests
on a rendered image — every number is a DOM, geometry or computed-style
measurement. The dist mutation used as a red-proof was reverted by a rebuild and
`grep INJECTED` on the built file returns 0. **`213.1`'s criterion (c) could not
be exercised on CI from here**; it is verified on the same code path CI runs,
with htmx over a real HTTP round-trip.

Green in this container: core build, `npm run test` **152/152**, `lint:css`,
`docs:build` rc=0, `check:claims` 158 live + 3 NOT VERIFIED (ENVIRONMENT §6b —
container property, not a regression), `check:formatting`, `check:scroll` 910
containers, `check:layout` 127 pages, `check:forced-colors`, `test:axe` 127 pages
× 2 widths zero violations, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `create-ui` check, `suite` 28 screens. `check:po-app` **red
here by design** (2 of 19, htmx blocked) per 208.3, shape unchanged — do not
"fix" it.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — and it changed the answer again:

```
python3 scripts/loops/dispatch_status.py
```

At hand-off: **`Standardize 5 / 4` OVERDUE** (this wake's own two Continue rows
pushed it past), `Objective 2 / 3 [211, 213]`, `Optimize` **STALE**. So the
**next wake dispatches rule 2, Standardize — not rule 4.** Log reconciles:
parser 1196 against a raw `grep -c "^- "` of 1196.

**Rule 5 now reads STALE and that is this wake's doing:** the metric recorded
(`windowed-list-spacer-err-px`) is a name sampled once, which can never be "two
consecutive runs". Per rule 5's own text, say it could not be evaluated rather
than reporting it clear.

If a later wake reaches rule 4, every remaining item is blocked; the KIND, per
rule 4's own instruction:

| item | what | kind of blocked |
|---|---|---|
| `112.3` | pattern-fit pilot (oldest open) | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| `211.1` | vendor htmx into `examples/po-app`? | **owner-blocked** — a product call about what the example teaches |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

`211.2` has left that table: it is closed, and the **egress-blocked** label the
previous hand-off gave it was wrong in a useful way — repointing the app's script
tag at a local server needs no public egress at all, and that route is what found
the P0.

## Direction

**`211.1` is now better-informed and still the owner's call.** This wake showed
the example runs correctly offline the moment htmx is served locally — the
mechanism costs nothing and `htmx.org` is already in `node_modules`. What has not
changed is the trade: vendoring stops the example demonstrating the CDN wiring
that `/getting-started/htmx` documents. **One thing the owner did not have
before:** the CDN dependency has now cost two investigations (208.3's four
misread runs, and this wake's confound-removal) because it makes
`check:po-app` report a *downstream* symptom in any egress-restricted
environment. That is an argument about maintenance cost, not about what the
example teaches, and both belong in the decision.

**Standing three unchanged** (112.3, 112.4, AT runtime). The cloud lane is not
out of work: rule 2 is overdue and dispatches next.
