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

**Citation practice for this file, restated after 251 found a live one drift**
(`ROADMAP.md:351` no longer resolved by the time a later wake read it — the
file grows above any raw line number cited into it): **cite by slice number
only, never by raw `ROADMAP.md:NN`.** A slice number survives every rewrite;
a line number survives none.

---

## In flight: nothing

Last updated 2026-09-03 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: `a9ba847` (249.1) and this
hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## Dispatch counters at hand-off

```
Standardize   1 / 4 Continue rounds   since 2026-09-03 05:50   ok
Objective     3 / 3 slices            since 2026-09-03 08:11   OVERDUE  [247, 249, 252]
Optimize      0 wake-date(s) newer    since 2026-09-03 07:46   ok   [newest pair: bundle-gz-kb]
```

- **Rule 3 is OVERDUE and it armed on THIS wake's own work.** 249 joined 247
  and 252 the moment 249.1 was recorded. Read `dispatch_status.py` yourself —
  the set is a snapshot — then narrow it per §6 step 0 before grilling: `247`
  and `252` were both armed at the previous hand-off and neither has been
  grilled since, so the honest scope is all three, but check `.roundtable/INDEX.md`
  for repeated subjects first.
- **Rule 5 does NOT fire, and the reason is worth reading rather than
  assuming.** The line is `ok` (not STALE — this wake recorded a fresh
  `bundle-gz-kb`), and the newest comparable pair is **11.7 kB (2026-08-17) →
  15.1 kB (today)**. That is ONE regression, and rule 5 needs **two
  consecutive**. The next `bundle-gz-kb` sample completes or breaks the trend,
  so take one.
- **Rule 4's open set is `OPEN: [15, 112, 249]`.** Slice 15's `AT runtime
  evidence` and `112.3`/`112.4` are **owner-blocked** (LOOPS.md 186.2's
  vocabulary — 15 and 112.3 need owner hardware and owner briefs
  respectively; 112.4 is blocked on 112.3's verdict). Inside Slice 249 the
  oldest open sub-item is now **`249.2`** (per-page metadata: description,
  sitemap, robots). `249.2`-`249.9` are dispatchable; `249.10`-`249.13` are
  owner calls sent back explicitly — read Slice 249's own text before building
  any of them.

  **`249.2` is partly browser-blocked in the cloud sense and partly not.** Its
  Accept is three greppable assertions over `dist/` (`name="description"`
  present on every page, `sitemap-index.xml` lists every built page,
  `check-links` green) — all of that is a cloud wake's first list per
  ENVIRONMENT's "no screenshots is not no browser". The one static OG image it
  asks for is a *rendered image*, which a cloud wake cannot author honestly.

## The archive sweep: unchanged, do not re-raise

`roadmap_scope.py` reads closed-history share **374 / 2,178 = 17.2%**. The two
eligible targets are the same two the last hand-off named, for the same
reasons: **Slice 252** (last wake's own slice, closed-on-arrival — nothing to
do now) and **Slice 237**, still refused because `roadmap_scope.py`'s
dependency line names it as the target of open item `249.12`'s Accept (236.2's
rule). Leave 237 until `249.12` resolves.

## What landed this wake

**Slice 249.1 — bundle-size budget gate**, dispatched by rule 4 (rule 1 clear:
no open P0, GitHub intake `totalCount: 0`; rules 2 and 3 both below threshold
at wake start). Step 1 triaged and committed nothing.

`packages/core/scripts/check-size.mjs`, wired into core's `build` as
`check:size` immediately before `stamp-readme --check`. Eleven gzip buckets
covering all **139** shipped CSS/JS artifacts, each a ceiling at current +
~10% headroom.

Three things from it worth carrying:

1. **The item's premise was 138-of-139 true, not true.** `grep -rn -i budget`
   over `packages/core/scripts`, `packages/core/package.json` and
   `.github/workflows` returns exactly one existing enforcement —
   `build-rf-essentials.mjs`'s `RF_BUDGET_KB = 40` (roadmap 126.1). It is
   kept, not replaced: minified-byte ceiling on an argued membership list
   versus a gzip ceiling on transfer weight.
2. **A group-total-only gate would have been GREEN on the injection the Accept
   prescribes.** 2 kB of source CSS is **+0.37 kB gz**; the components bucket
   went 24.75 → 25.12 against 27.3. Only the per-file arm fired. That is why
   both arms ship and why a multi-file bucket declaring only a total is itself
   a gate failure.
3. **`bundle-gz-kb` went unsampled for 17 days while it grew 29%** (11.7 on
   2026-08-17 → 15.1 today, `dist/css/index.min.css`). `stamp-readme`
   publishes that number into both READMEs every build and has done
   throughout; what it never did is refuse growth. That gap is the whole case
   for the gate, and it was found by taking the metric, not by arguing for it.

**Not verified, and named rather than implied:** this was a cloud wake, so the
1440/390 light-and-dark screenshot lane could not run. Nothing in the diff
rests on a rendered image — one build-time Node script, one `package.json`
script chain, one markdown file — and the shipped CSS bytes are unchanged (the
red-proof injection was reverted and `dist/` rebuilt clean before any gate
reading). All **17** CI entry points, re-derived from `ci.yml` rather than read
off `ENVIRONMENT.md`'s snapshot, ran green here; `check:repo` was re-run after
the `ROADMAP.md` edit because `docs:build` had already passed it.
`check:claims` read **162 live / 3 NOT VERIFIED**, which is ENVIRONMENT 6b's
container property and not a regression.

*Red-proof discipline, since CLAUDE.md asks for the injection to be confirmed
rather than the red result:* the per-file arm's injection was verified present
in the BUILT artifacts before its red was believed —
`grep -o 'bo-data-table--probe-' | wc -l` counts **28** in each of
`dist/css/components/data-table.min.css`, `index.min.css` and
`rf-essentials.min.css`. The other three arms (unbudgeted file, stale budget
row, and the comparator's two constraints) were exercised the same way, live or
through `--self-test`.

## Next wake

**Rule 3 fires: dispatch Objective**, a grill of `247`, `249` and `252`
(narrow the set per §6 step 0 first — check `.roundtable/INDEX.md` for
repeated subjects and state the honest scope). After it, rule 4 returns to
Slice 249 at `249.2`.
