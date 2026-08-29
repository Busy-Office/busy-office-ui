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

Last updated 2026-08-29 (**cloud** wake — rule 3 OVERDUE → **Objective**, the
grill of the 200/208/209 window, landed as **Slice 212**). Working tree clean at
hand-off; one push.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 5 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

`check:resume-slice-ids` will report `212.1`, `212.2`, `208.3`, `209.2` and
`201.4` as closed ids named here — **historical references** (this wake's own
findings and their subjects), not claims that they are open. The ids named here
that genuinely ARE open are `211.1`, `211.2`, `112.3`, `112.4`.

**No collision on this wake.** `origin/main` was at `723e1f0` at Step 0 and
still at `723e1f0` at the mandated re-fetch before the first commit.

**Trap 1 fired for real again, sixth wake running.** Container started detached
(`git branch --show-current` empty) with local `main` stale at `17b3ba6` and
`origin/main` arriving as a forced update (`+ 17b3ba6...723e1f0`). Recovered at
Step 0 with `git checkout -B main origin/main`, before any commit. The clone is
shallow and was left shallow — no finding this wake was a history measurement.

## What landed this wake

**Scope was narrowed before grilling, and that narrowing became finding
212.2.** The counter armed `[200, 208, 209]`, but 200 had been grilled twice
already and 208 in full by 209 last wake. The honest subject was the three
Continue rounds since the last Objective row: **200.7 (written up as Slice
210), 209.2, and 208.3**.

**`212.1` — Slice 210's BROAD base rate is wrong, and its own cited gate names
the missing case in its header.** 210 reported *"3 sites / 2 declarations"* and
enumerated `600ms` (scan), `1.8s` and `linear` (skeleton) as *"the three
literals in the tree"*. An independent postcss walk of all of
`packages/core/src/css` finds **5 literal occurrences across 3 declarations** —
the third is `motion/motion.css:96`,
`.bo-motion-spin { animation: bo-motion-spin 1s linear infinite }`, which ships
as the **opt-in `dist/css/motion.css`** entry point (never imported by
`index.css`) and is **not under `components/`**, which is the likely reason a
components-scoped probe missed it.

Red-proved rather than reasoned: removing spin's reduce override from the
generated dist — injection asserted unique before replacing — turns
`check:motion` red naming exactly that declaration, and restoring it returns
green. `check-motion.mjs`'s own header says *"both literal-duration animations
(**spin**, skeleton shimmer)"*, and `skeleton.css`'s comment cross-references
spin by name.

**Neither of 210's conclusions moves**, and that is the point rather than a
softener: NARROW re-derives as **0** (no token carries `1s` or `linear`), so the
94.11 refusal stands; BROAD's refusal *strengthens*, the missed declaration
being the most explicitly documented of the three. **192.1's shape, third
instance running** — the defect landed beside the number that was red-proved.
Correction **appended** to Slice 210's own record, never rewritten in place.

**`212.2` — `LOOPS.md` §6 now carries the arming-set narrowing step.** Rule 3's
text says *"slices **closed**"*; the instrument counts slice numbers **named by
rows**, so a many-round slice re-arms after each grill. Slice 200 alone armed
three consecutive grills (207, 209, 212), each narrowing by hand and each
calling it *"the same correction"* someone else had made. Measured across
`ROADMAP.md` + `ROADMAP-archive.md` headings: **21 grills, 9 covering at least
one already-grilled slice**. Written into §6 as a property with its command,
never as a list of stale slices.

**Two refusals, both recorded:** a gate for 212.1 (`check:motion` already covers
the subject on shipped dist; 192.1's answer to a wrong count is to name the
instrument), and a sixth regex in `dispatch_status.py` to count closed rather
than named slices (rule 3 sits above rule 4, so over-arming costs one paragraph
and under-arming starves a loop).

**The control held.** Every claim in `209.2` and `208.3` reproduces, re-derived
rather than read off the file — `check:rf-floor`'s pass line to the digit, a
fresh BCD read of all six at-rules, no prefixed at-rule emitted, `--self-test`
**red-proved fresh** (filter dropped → `1 1`, rc=1; restored → green), and
`check:po-app` at **2 of 19** with the precondition first and `htmx:
"undefined"`.

**NOT VERIFIED and named as such:** no Podman, no `localhost:8081`, **no
screenshots at 1440px or 390px in either theme**. It costs nothing here — zero
lines changed under `packages/core/src/` or `apps/docs/src/`; the diff is
markdown only. Both dist mutations used as red-proofs were reverted and the
gates re-run green after. Green in this container: core build, core `npm run
test` 151/151, `lint:css`, `docs:build` rc=0, `check:claims` 158 live + 3 NOT
VERIFIED (ENVIRONMENT.md §6b — the container's pointer capability, not a
regression), `check:formatting`, `check:scroll` 910 containers, `check:layout`
127 pages, `check:forced-colors`, `test:axe` 127 pages × 2 widths zero
violations, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:selftests` 46 gates / 16 heuristic, `create-ui`
check, `suite` audit 28 screens. `check:po-app` **red here by design** (2 of
19) per 208.3 — do not "fix" it.

## Dispatcher state at hand-off

Read **after** recording, which is the comparison `LOOPS.md` says has caught two
of that counter's five historical failures — re-run it rather than trusting this
snapshot:

```
python3 scripts/loops/dispatch_status.py
```

At hand-off: `Standardize 3 / 4 ok`, **`Objective 0 / 3` (reset by this wake)**,
`Optimize 0 wake-date(s) newer, ok` — not STALE, so rule 5 has live input and
reports nothing regressed. So **next wake reaches rule 4**, and every open item
is blocked in some way. Say the KIND of blocked, per rule 4's own instruction:

| item | what | kind of blocked |
|---|---|---|
| `112.3` | pattern-fit pilot (oldest open) | owner-blocked (briefs) |
| `112.4` | Screen Contract layer | owner-blocked (on 112.3) |
| `211.1` | vendor htmx into `examples/po-app`? | **owner-blocked** — a product call about what the example teaches, not a defect |
| `211.2` | scroll-anchor `anchorShift` where htmx loads as it ships | **egress-blocked** — see the note below; not owner-blocked |
| AT runtime evidence | combobox behaviour on real AT | owner-blocked (owner hardware) |

If rule 4 finds nothing takeable, rule 6 is next — run
`python3 scripts/loops/polish_requeue.py --apply` **before** evaluating it, and
read §3b's note on what a round on a `content: 3` surface is for (reconcile the
published artefact against the ledger; a no-op is a valid, one-line outcome).

## Direction

**`211.2` may be cloud-takeable, and the previous hand-off's classification is
worth re-examining rather than inherited.** Its Accept asks for the anchor
property measured *"where htmx loads the way it actually ships"*, and the
objection to 208.3's evidence was that the shim serves htmx **from memory**
via request interception, so the timing is not real. That objection is about the
*transport*, not about the CDN: serving `node_modules/htmx.org/dist/htmx.min.js`
from a real local HTTP server, and pointing the app at it, restores an actual
network round-trip and script-eval ordering while still needing no public
egress. **Stated as an option with its limit, not as a claim** — it is still not
a CDN's latency, so a wake taking that route must say which property it
measured and which it did not. Whether that satisfies the Accept is the next
dispatcher's call; if it does not, CI or a local wake remains the route.

**`211.1` is still the one genuine product question.** `examples/po-app` is the
"Devi test" consumer four docs pages cite, and it cannot run without reaching
the public internet — while the same shell already serves
`/assets/css/htmx.min.css` locally, so it is half-vendored today. Vendoring the
script would make the example runnable offline; it would also stop the example
demonstrating the CDN wiring that `/getting-started/htmx` documents. That trade
is the owner's, which is why it was refused inside 208.3 and filed.

**Nothing else is blocked on the owner beyond the standing three.** The cloud
lane is not out of work: rule 6 (Polish) is reachable and `211.2` may be too.
