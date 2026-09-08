# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

**Citation practice for this file: cite by slice number only, never by raw
`ROADMAP.md:NN`.** A slice number survives every rewrite; a line number
survives none.

---

## In flight: nothing

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **No collision this wake** — the pre-commit `git fetch origin main`
found `origin/main` unmoved. One iteration recorded (`Continue · build ·
320.2`, `landed`, one refusal) and one metric, `dead-declarations=52`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: Slice 342 — `scan:dead-style` now judges each declaration on its own, and the blind spot was NOT empty

**52 dead declarations, on 13 pages, hiding behind live siblings** — invisible
to every sweep that has ever read this instrument, the 17 Slice 322 enumerated
(208 through 314) among them. 320.2's Accept said outright that finding zero
would be a satisfying outcome; it is not zero.

```
before   0 dead attribute(s) on 0 page(s); 1365 live; 1854 declaration(s); 357 multi
after    (identical on all four — the historical series is unmoved by design)
         per declaration — 52 dead on 13 page(s)
         reconciliation — 52 sit in 50 attribute(s) the attribute verdict calls LIVE,
                          of 357 multi; 0 dead attribute(s) hold a live declaration
```

**Read the reconciliation, not the 52.** It is against the **re-measured**
corpus (357 of 1,365 today), not against 320.2's stated *"273 attributes"* —
273 was Slice 320's reading on 2026-09-07 and the tree has moved. Slice 332's
grill independently recorded `0 / 1,365 / 357` on this same corpus, which is the
independent count the doctrine asks for before quoting.

**Two runs are byte-identical**, so the number is settled rather than a
mid-flight reading — the failure mode this script's own header records from its
first version.

**`342.1` is what the next Standardize sweep inherits:** a verdict for each of
the 52. It is deliberately NOT this item's work — 320.2 was scoped to the
instrument, and several of the 52 are on generated pages
(`/reference/tokens/`, `/reference/events/`) or inside copyable template
literals, which 292.8 puts out of scope. Judgement per site, never a regex.

## The red-proof, and it is PRECISE rather than broad

A throwaway copy of the script had its per-declaration verdict replaced by the
attribute one. The injection was verified before the result was believed —
target occurrence count asserted as exactly **1** before the replace, marker
asserted present after — and **exactly one of five controls failed**:

```
- mixed control's dead declaration read live — 'margin: 0' inside
  'padding: 40px; margin: 0' → dead=false.                              rc=1
```

The live control, the dead control, the mixed attribute and the mixed live
declaration all still passed. `ENVIRONMENT.md` carries the sibling trap this
guards against — *a red-proof that goes red TOO BROADLY certifies nothing
either*. **The probe file was deleted and its absence confirmed**
(`ls apps/docs/scripts | grep -c redproof` → **0**); `git status --short`
showed only the intended files at commit time.

## Two instruments were wrong first — mine, both times

The base rate arriving on schedule, recorded because it is the reusable part:

1. **A per-page grep conflated the scan's GLOBAL `by dead declaration` tally
   with its PER-PAGE list** and reported `raw=0` against `scan said 10`. The
   fix was a whole-`dist` declaration census; every dead count is then bounded
   above by what is present, and **three of seven strings SPLIT** (19→17, 7→4,
   6→3). The splits are the discriminating evidence — `dead == present` on
   every row would have been the "identical value across many inputs" tell.
2. **A first attempt to count "how many sweeps read this instrument" returned
   46 slices** by grepping `dead[- ]style`, which counts every slice that
   *mentions* it. The published claim was cut back to the number that was
   actually measured — Slice 322's enumerated 17.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
Rule 2 `Standardize 1 / 4` no. Rule 3 `Objective 0 / 3` no (spent by Slice 341).
**Rule 4 matched** on `320.2`, the oldest cloud-takeable open item, exactly what
the previous hand-off predicted. Rules 5-8 not reached.

```
Standardize   1 / 4 Continue round   since 2026-09-07 21:52   ok
Objective     0 / 3 slices           since 2026-09-08 00:17   ok
Optimize      0 wake-date(s) newer   since 2026-09-08 00:17   ok
```

**Rule 5 was not reached and would not have fired.** `dispatch-region-words` is
**unchanged** — `report_loop_prose.py` reads **7,548** heading-included at
`e214bd7d`, identical to Slice 341's reading, so 7,492 by the series convention
(constant **56**; subtract it or the series jumps for no reason). It was **not
re-recorded**: the existing sample is from today, and `dispatch_status.py` pairs
by DISTINCT DAY, so a second same-day sample adds no pair. `LOOPS.md` is not in
this wake's diff, which is why the figure cannot have moved.

## The archive sweep WAS evaluated this wake, and declined on the measured trigger

`roadmap_scope.py` at `e214bd7d`: closed-history share **2,946 / 8,908 = 33.1%**,
13 eligible targets, 12 of them named by a still-open item (236.2 — read each
before moving it). The trigger the last sweeps actually used: 252.1 dispatched
the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, and 279.3 declined the
twelfth at **40.6%**. 33.1% is below all three, so sweeping here would be a wake
lowering the threshold by its own initiative — which is what `249.12`, the open
**OWNER OR ARCHITECTURE CALL** on the archival trigger, exists to prevent.
Re-run the script; this commit moves the numbers.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this commit**, and that is structural rather than a
judgement call: the diff is `ROADMAP.md`, this file, and one `.mjs` scan script
that is not a build step, not a gate and not imported anywhere. Checked rather
than asserted — `grep -rln scan-dead-style` finds it in `apps/docs/package.json`
(its own entry) and as **prose in a header comment** in
`check-viewport-forks.mjs` and `viewports.mjs`; `check:viewport-forks` passes on
the edited tree. No CSS rule, no docs page and no component changed, so no
rendering can move.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree — core `build`, core `test` (29 files, 165 tests), `lint:css`,
`docs:build`, `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:scroll` (914 containers), `check:layout` (128 pages), `check:forced-colors`,
`test:axe` (128 × 2, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (20 behaviours),
`check -w create-ui`, `npm run suite` (28 screens × 2). Plus `check:selftests`
(55 gates: 21 heuristic, 34 exact — this script stays `@exact`) and
`check:viewport-forks`. **`docs:build` was re-run after this file was written**,
per `ENVIRONMENT.md` §3b.

**One gate reported `rc=1` and it was MY invocation, not the gate**:
`check:vendor-names` is not a docs-workspace npm script, so
`npm run -s check:vendor-names` inside `apps/docs` fails with *"To see a list of
scripts…"*. Run directly it passes — `node scripts/check-vendor-names.mjs` →
613 files against 7 denied names. It reaches CI through `check:repo`.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. What
it caught, both in this wake's own output: a claim that nothing references the
scan script (false — two scripts name it in comments, corrected in place with
the gate re-run), and the unmeasured **"18 sweeps"** (cut back to Slice 322's
measured 17).

## The open set is 32 — no P0, and 21 are cloud-takeable

`roadmap_scope.py` reports **32 open** and the raw checkbox count agrees; that
figure is from before this commit, which closes `320.2` and opens `342.1`, so
the count is unchanged at 32 while the membership moves. **Re-run the script**
rather than quoting this — it refuses to print figures for an uncommitted tree.

- **cloud-takeable: 21** — `322.3`, `323.1`, `324.1`, `324.2`, `325.1`,
  `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`, `332.1`, `333.1`,
  `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `342.1`.
  **`322.3` is now the oldest of these** and is what rule 4 reaches for next —
  whether a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md` should be
  line-independent, which is the wrapped-instance bug Slice 322 hit in its own
  first instrument. **`335.1` still carries its caveat**: settling it may mean
  filing a throwaway Q&A discussion, an outward-facing write to a public repo
  whose permission has **not been tested**.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**). Carried forward from the previous hand-off's
  re-derivation; nothing this wake touched them.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3` — and note it is
  now the ONLY item left open on Slice 320.

21 + 10 + 1 = 32, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for an eighth
consecutive hand-off.** See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

Read the runs after your push; one `actions/runs?branch=main` read costs nothing
and is the only thing standing between a red `main` and the next wake.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...e214bd7` and
the container started **detached** (`git branch --show-current` empty); fixed
with `git checkout -B main origin/main` before any commit. Trap 2 was clean in
one `--unshallow` (no `shallow.lock`) and again brought the tags; `git tag |
wc -l` → **8**, §2's mandated count, run rather than assumed. **No ordinal is
claimed for that streak** — two incompatible counters are in circulation, and
running the count is the check §2 asks for.

Trap 1c was respected: `CHROME_PATH` was exported **in the same command** as
every browser gate. Trap 1b bit mildly — a `cd apps/docs` persisted into the
next command, which is how the `check:vendor-names` `rc=1` above was produced;
anchor with an absolute `cd`. Trap 6 was met twice and handled correctly: the
scan's empty output file is **not** a completion signal, and both readings
waited for `[exited with code 0]`. No `git stash` was used at any point.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6
   was never reached, so `polish_requeue.py --apply` was correctly not run.

**A third thing is worth naming, and it is new this wake.** `249.12` — the open
owner call on an archival trigger — was reached for the second time in four
days as the thing that *prevents* a sweep, and it is now the only reason the
live `ROADMAP.md` grows unattended at 33.1% closed history. The item is filed
as low urgency because "the sweep keeps happening regardless"; that sentence is
no longer quite true, because two consecutive wakes have now declined one on
precisely the absence of a stated trigger. **Nothing is proposed here** — the
point is only that the item's own urgency note has drifted from the practice.

**What the next wake should reach for: rule 4 on `322.3`**, unless rule 2
(`1 / 4`) has moved. Rule 3 is at `0 / 3`, so a grill is three closed slices
away — this wake's Slice 342 is the first of them.
