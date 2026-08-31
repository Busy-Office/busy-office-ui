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

Last updated 2026-08-31 (**cloud** wake). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 6 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
```

**The open set moved for the first time in four wakes: 3 → 6, and all three new
ones are dispatchable by any wake.** Rule 4's backlog is no longer wholly
blocked.

## What landed this wake

**Slice 229 — Objective grill of Slices 222, 226, 227, 228**, dispatcher rule 3
(`Objective 4 / 3 slices OVERDUE`). Rules 1 and 2 were answered by measurement;
the readings are in "Dispatcher state" below. Full report:
`.roundtable/grill-objective-222-226-227-228-2026-08-31.md`.

**Arming set NOT narrowed, and that is a reading rather than a skipped step.**
**23** prior grill headings, read **from the HEAD blobs**; 225 covered
218/219/223/224 and none of the 23 names 222, 226, 227 or 228. All four
genuinely un-grilled.

**Read them from the blobs, not the tree** — the working-tree form of that check
returns 24 and 1, because this grill's own heading names the four slices it is
searching for prior coverage of. Caught in the drafting; the commands are in
Slice 229's opener. A scope check for a NEW slice is read from the commit that
predates it.

**Every decision in the four slices survives. No counter-evidence against any
substantive claim.** The two findings and the one refutation are all about how
measurements were *recorded*, not about what was decided.

- **227 re-derives exactly** — 9,109 / 95,046 / 26 glyphs by three independent
  derivations / 9.6% / 93 kB / 68 kB at `/26` and 148 at `/12` / 85,937 B =
  83.9 kB. So 227.1's point that *"more than everything else we ship"* was true
  at 148 and false at 68 is confirmed, not just repeated.
- **226.1 reproduces in a SECOND cloud container a day later** — `check:po-app`
  19/19 exit 0, root hoist still absent, po-app's own install carrying htmx
  4.0.0, `ci.yml` re-derivation 17. Its one open inference is now two readings
  on two dates.
- **228.1 is lossless at 15/15 byte-identical moved sections**, re-verified with
  a parser written this wake rather than the sweep's own; `+2,381` archive delta
  matches the git blobs exactly. `check:slice-refs` 455 / 247 / 2 / 210.

**229.1 — the best candidate finding was REFUTED, and the one mirror no gate
can see was found underneath it and fixed.**

- Refuted: 227.3's guard compares a *count*, so a glyph **rename** passes it.
  Injecting `.bo-icon--doc` → `.bo-icon--doczz`: core exits **0**, `api.json`
  still declares 26 — exactly as predicted — but `docs:build` exits **1** with
  `check-markup FAILED — 116 problem(s) across 165 file(s)`. Glyph names are
  guarded one layer up by `check-markup.mjs`, written for a different reason
  (32.2). **Two injection notes**: the first attempt used `docZZ` and went red
  on stylelint's naming pattern — a red for the *wrong reason*; and the
  refutation then reproduced by accident when a later build failed identically
  off a stale core `dist/`.
- Held: `check:markup` cannot see *which* glyphs are deprecated, because a
  wrongly-listed glyph is still a shipped class. `deprecatedGlyphs` was
  hand-typed against four `/* DEPRECATED` blocks in the same stylesheet, so a
  fifth deprecation would have shown that glyph among the eight that "earned
  their place" under a badge still reading 4, with nothing failing. Now derived
  from the **unminified** shipped css and reconciled against an independent
  marker count. **No hand-typed floor**, for 227.3's stated reason.
- Red-proved **both** directions through the built page, injections confirmed
  before each build: a stray marker → `EXIT=1` with the guard's own message; a
  real fifth block above `.bo-icon--close` → `EXIT=0` and the rendered badge
  moves **4 → 5** with `close` entering the cluster. With the stylesheet
  untouched the rendered page is **byte-identical** before/after — two full
  clean builds, diffed.

**229.2 — the improvement question found a stale claim on FIVE gate headers,
including the one that had just refuted 229.1's hypothesis.**
`check-markup.mjs` line 4 read *"OWES a --self-test (roadmap 42.3)"*. It does
not: `node packages/core/scripts/check-markup.mjs --self-test` exits **0** with
four cases, and `check:selftests` reports **15 heuristic gates, all
self-tested**. **Base rate measured before fixing** — five files carry that
sentence and **5 of 5** have the branch, so it is false everywhere it appears.
Corrected in place; each `--self-test` re-run green, meta-gate still 15 of 15.
Whether the meta-gate should *reject* the sentence is filed OPEN as 229.3 with
the refusal argument (base rate now 0) already written down.

**All 17 cloud-toolchain entry points run green here, exit 0 each** — the list
was taken from `ENVIRONMENT.md` rather than curated, which is that list's own
rule: core `build`, `test` (152 in 27 files), `lint:css`, `docs:build` (which
runs `check:repo` → `check:selftests`, `check:slice-refs`, and `check-markup`),
`check:claims`, `check:formatting`, `check:scroll`, `check:layout`,
`check:forced-colors`, `test:axe`, `check:target-size`, `check:search`,
`check:pseudo` (14 pages × 2 widths, ≥41% expansion), `check:quickstart`,
`check:po-app` (**19/19**), `check -w @busy-office/create-ui`, and `suite`
(28 screens × 2 widths, zero axe violations; `check-markup` 4,235 class uses).
Both advisory resume checks pass, and `check:resume-slice-ids` reports **no**
named id closed — cleaner than the previous hand-off, which flagged 228.1.

`check:claims` reads **158 verified live · 3 NOT VERIFIED**. That is
`ENVIRONMENT.md` §6b — this container reports `(pointer: fine) = false`, so the
three `.bo-btn` press claims cannot discriminate — **not** a regression. Do not
"restore" the zero.

**The suite above was run before the last four files were edited**, so core
`build`, `docs:build`, `check:formatting` and `check:claims` were re-run
afterwards against the final tree; the commit records both passes.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. **Nothing in this wake
rests on a rendered image** — the only code change is build-time, and the
rendered page was *measured* byte-unchanged rather than assumed. The whole-tree
browser gates are the evidence that nothing broke.

## Dispatcher state at hand-off

```
python3 scripts/loops/dispatch_status.py
```

**This is the Step 0b comparison — the counter read immediately after
recording.** Rule 3's slice counter must RESET (an `Objective` row resets it by
161.4's exclusion list); rule 2's Continue-round counter must be **unchanged at
0/4**, because an Objective row is neither a Continue nor a Standardize row.
Re-run it rather than trusting this sentence — that comparison has found two of
the five starved-counter bugs.

**How rules 1-3 were answered, so the next wake need not re-derive them:**

| rule | reading |
|---|---|
| 1 P0 | none open; no open GitHub issues (`list_issues` OPEN → `totalCount: 0`) |
| 2 Standardize | **0 / 4 — ok.** The counter reset when 228 fired |
| 3 Objective | **4 / 3 OVERDUE `[222, 226, 227, 228]` — dispatched** |
| 4 build item | not reached — but see below, it is no longer empty of work |

**The open set is 6, and THREE of them are dispatchable** (rule 4's
kind-of-blocked distinction, which `LOOPS.md` keeps in the durable playbook
precisely because it did not survive a rewrite of this file):

| item | kind of blocked |
|---|---|
| `112.3` pattern-fit pilot (oldest open) | owner-blocked — briefs + four answers |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence | hardware-blocked — owner hardware |
| **229.3** should `check:selftests` reject a "owes a self-test" header? | **NOT blocked** — a decision plus, if taken, a red-proof by injection |
| **229.4** 227.2's base rate is unreproducible | **NOT blocked** — a paragraph and three greps; a cloud wake can take it in full |
| **229.5** the diff-stat form of the git-blob rule | **NOT blocked** — one `ENVIRONMENT.md` edit, or a recorded refusal |

**So rule 4 has real work for the first time in four wakes.** Read it carefully:
the rule says *the OLDEST still-open item*, and the oldest is `112.3`, which is
owner-blocked. The oldest **dispatchable** one is 229.3. Say which you took and
why, rather than reporting rule 4 as finding nothing — that misreport is exactly
what cost four wakes on 173.2.

**All three are written so that REFUSING is a satisfying outcome**, per
CLAUDE.md's criterion rule — 229.3's base rate is already 0 and 94.11 says that
is an argument against it; 229.4's honest first result may be that the number
cannot be recovered; 229.5 may be refused as prose growth on 158.2's argument.
None of them should be built just because it is open.

## Direction

**No new input arrived**: no open GitHub issues, and no owner message since the
last wake. Step 1 had nothing to triage, so no `Roadmap · plan` row exists.

**The standing three are unchanged** (112.3, 112.4, AT runtime) and still need
the owner; no wake of any kind can advance them. What changed is that the loop
is **no longer running on counters alone** — 229.2 and 229.3 are ordinary
buildable items.

**177's observation is now fifteen wakes old and this wake is fresh evidence for
it**: a grill's roadmap slice pays for its text twice — measured, not estimated,
Slice 229 is **254 lines** in `ROADMAP.md` (`awk '/^## Slice 229 /{f=1} /^## Slice
228 /{f=0} f' ROADMAP.md | wc -l`) *and* a 313-line standalone report in
`.roundtable/`. Re-checked rather
than repeated: 177's own text calls it *"a direction call about how the loop
records its own work, and this loop does not take those"*, so it stays recorded
for the owner rather than filed as an item.

**The sweep cadence, measured not asserted.** `ROADMAP.md` is at **1,880**
lines, up from the 1,626 committed at the seventh sweep (`d701e61`). Measure
the cycle from the blob, never from a sweep's own prose:

```
git show d701e61:ROADMAP.md | wc -l                 # 1626
git rev-list --count d701e61..HEAD -- ROADMAP.md
```

**No sweep is due**, and the figure to compare is the closed-history *share*,
which the seventh sweep triggered on at **62.4%**. Do not carry 228's post-sweep
9.3% forward as if it still held — this wake added 254 lines of its own, and the
share is re-derived by 177's scope command, not by arithmetic on a stale
percentage. Run that command before concluding either way.

**`cascade.astro`'s missing parse assertion is still open as an observation**
(carried unchanged, not re-derived): it parses `Z_TOKENS` from the shipped
z-index tokens with no assertion, so a zero-parse renders an empty stacking
section rather than a wrong number. Milder than 227.3's — silence, not a false
figure. 227.2's own text names it as one of the three of eight parse pages that
do not throw, and this wake's `grep -rln 'throw new Error'` re-reads **6 of 8**,
`cascade.astro` still among the two. A Standardize sweep is the right home for
it.
