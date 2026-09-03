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

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 256.2 and this hand-off.

**`check:resume-slice-ids` will name `256.2` as closed — that is deliberate.**
It appears below only as *what this wake closed*, never as open, blocked or
queued.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. The two standing owner blocks are unchanged: Slice 15's `AT runtime
evidence` (owner hardware) and `112.3`/`112.4` (owner briefs, then 112.3's
verdict).

Nothing this wake needs an owner decision. The item closed was a gate's own
internal contradiction, settled on measured evidence within the Accept's stated
branches.

## Dispatch counters at hand-off

Read `dispatch_status.py` yourself — the sets below are snapshots.

- **Rule 2 (Standardize)** read `3 / 4` at wake start and **`4 / 4` OVERDUE**
  after this wake's Continue row. `dispatch_status.py` prints *"a counter is at
  or past its threshold; the dispatcher should pick it"*. **Rule 2 sits above
  rule 4 deliberately, so the next wake dispatches Standardize, not a build
  item** — that ordering is the whole point of the 2026-08-18 move.
- **Rule 3 (Objective)** read `1 / 3 [249]` at wake start and **`2 / 3
  [249, 256]`** now — 256 closed fully this wake, so it counts as a slice.
- **Rule 5 (Optimize)** read `ok` (not STALE), so the rule *could* be evaluated
  and finds nothing. **No sample was recorded this wake, deliberately:** the
  diff is one gate comment plus markdown and changes **0** files under
  `packages/core/src/css/`, so a `bundle-gz-kb` reading could only reproduce the
  existing value — and a repeated identical value is a data point about the
  instrument, not the bundle.

## Next wake

**Expect rule 2 (Standardize), not rule 4** — see the counter above. `LOOPS.md`
§3 has four standing lanes; four consecutive sweeps ran three and missed lane 4,
so **say `n of 4` in the write-up**. Lane 4 is
`python3 scripts/loops/report_loop_prose.py` — read its `ratchet` block first,
never the delta.

If rule 2 has already been discharged, rule 4's open set is `OPEN: [15, 112,
249]`, **11** open items (was 12). The classifications below are unchanged from
the last hand-off and were each re-read against `ROADMAP.md` this wake, not
inherited:

- Slice 15's `AT runtime evidence` and `112.3`/`112.4` are **owner-blocked**.
- **`249.6` is browser-blocked in the SCREENSHOT sense** (`LOOPS.md` 186.2's
  vocabulary) — a LOCAL wake can take it; a cloud wake should not.
- **`249.7` is open as a COST question, not as unstarted work.** Its Accept's
  first clause has been executed: 4 of the 5 seed rows do not reproduce. Do not
  re-run that grep — the table is in the item. Settling it before the owner
  answers `249.10` would decide it on the thinnest possible input.
- **`249.9` is browser-blocked in the screenshot sense** — it builds a
  `/components/` catalogue whose point is rendered miniature previews. Its
  Accept's second half — *"the miniature-rendering build-time cost is measured
  and stated before this closes"* — is measurable anywhere, so a cloud wake
  could usefully measure and record that number without building the page.
- `249.10`, `249.11`, `249.13` are owner calls; `249.12` is owner-or-
  architecture, low urgency.
- **`249.15` is browser-blocked in the screenshot sense** (a static OG image).

**So a cloud wake that reaches rule 4 has no cheap dispatchable item left** —
`256.2` was it, and it closed this wake. The measurable half of `249.9` is the
best remaining cloud-takeable work.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **943 / 3,404 = 27.7%** at
hand-off — still well under the **55.1%** at which 252.1 dispatched the tenth
sweep on 2026-09-03. It read 21.4% at wake start; the share ROSE this wake, the
opposite of the last three, because Slice 256 closed *fully* — its 229 body
lines moved from live denominator into closed history in one step. That is
arithmetic, not a backlog signal. Eligible targets `[256, 255, 254, 253, 252,
237]`, of which 253 and 237 are named by the still-open Slice 249 and stay per
236.2. Re-run the script; these are snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4.** Rule 1 clear (no open P0;
GitHub intake `totalCount: 0`); Step 1 triaged and committed nothing — no new
input. Rules 2 (3/4 at wake start) and 3 (1/3) did not fire.

### Slice 256.2 — the comment was the wrong half, not the allow-list

`check:floor`'s header comment granted `.roundtable/**` an exemption `ALLOW`
never contained. Settled on the Accept's second branch: **the comment is
corrected; `ALLOW` is unchanged.** Four things worth carrying:

1. **The FOR-widening argument was refuted by its own worked example.** It
   claimed rewriting a grill to satisfy the gate "erases the finding it
   records". The actual rewrite still records the finding *and* ships the
   command that derives it — preserved and made re-runnable. The grill's own
   prose already described the code's boundary while its Finding D quoted the
   comment's wider claim; the report disagreed with itself.
2. **Base rate decided it: `.roundtable/` is 185 of the 556 files this gate
   checks, and 0 trip the literal** — including a study entirely about the
   browser floor, which names single browsers (permitted by design) and never a
   full label. Reconciled two ways (556 = 561 walked − 5 allow-skipped; 185 =
   182 top-level `*.md` + 3 under `pilot-112/`); command in the ROADMAP entry.
3. **Both subsets the Accept imagined were measured and NEITHER is a clean
   boundary.** `grill-*.md` is 86 of 182 and misses 75 equally-historical
   reports under six other prefixes; "a dated filename means history" fails the
   other way, since `reopen-conditions-2026-08-29.md` is dated *and* read as
   current. Recorded because both read as obvious.
4. **The stale comment was not adjacent to what it described** — it floated
   above the `--self-test` block, ~20 lines from `ALLOW`. That is plausibly the
   drift mechanism, and it is now fixed as well as the wording.

Red-proved two-sided with the injection confirmed by `grep -cF` **before**
either verdict was believed, using `cp` backups rather than `git checkout`
(249.8's recorded trap): the same label leaves the gate green inside `ALLOW`
(rc=0) and fails it outside (rc=1) naming exactly one file. Both restored.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. The diff is one gate comment plus
markdown — **0** files under `packages/core/src/css/`, no page markup, and the
built page count is unchanged at 138 — so there is nothing a screenshot could
have shown. All **17** CI entry points, re-derived from `ci.yml` this wake
rather than read off the snapshot, ran green here.
