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

Last updated 2026-09-01 (**cloud** wake). Working tree clean at hand-off; two
commits — `fd9affed` (the slice) and the bookkeeping commit carrying this file
— pushed.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # 6 at hand-off, across 4 slices
node apps/docs/scripts/check-resume-slice-ids.mjs # names the closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: the counters, and where the next wake lands

```
Standardize   1 / 4 Continue rounds  since 2026-09-01 05:06   ok
Objective     1 / 3 slices           since 2026-09-01 06:45   ok  [232]
Optimize      0 wake-date(s) newer   since 2026-09-01 07:48   ok  [newest pair: axe-violations]
```

Read immediately after recording, per Step 0b. This wake spent rule 4, so
rules 1-3 are still clear and **the next wake falls through to rule 4 again**.
Re-run `dispatch_status.py` rather than trusting this snapshot; several
dispatchers land work hourly.

**Objective moved 0 → 1, naming `[232]`** — that is the counter recognising
Slice 232 as CLOSED by this wake's Continue row, which is rule 3 working, not a
surprise. Two more closed slices arm a grill.

**Rule 5 is `ok`, not STALE.** `test:axe` ran green here (127 pages × 2 widths,
zero violations), so `axe-violations = 0` was recorded from a gate that actually
executed, pairing with the prior `0`. **No regression: 0 → 0.** Keep rule 5
alive by recording a name **already sampled**; a name sampled once can never
satisfy "two consecutive runs" (184.1's defect). **Do not read
`bundle-gz-kb`** — it and eleven other names are 13+ days stale and its
`10.8 → 11.6 → 11.7` *looks* exactly like a rule-5 trigger. Not evaluable.

## What landed this wake

**Continue, build mode, dispatched by rule 4 — the oldest still-open
DISPATCHABLE item, `232.3`. One commit, and Slice 232 is now fully closed.**

The gate is **`apps/docs/scripts/check-parse-asserts.mjs`**, wired into
`check:repo` — so it runs on every `docs:build` and on CI's
`npm run build -w docs`, with **no `ci.yml` step added**. It flags an `.astro`
file whose frontmatter reads a file at build time, parses structure out of it,
and asserts nothing: the shape that renders an empty table instead of failing
the build. `concepts/cascade.astro` shipped exactly that for nine days.

**232.3's premise held.** Accept (e) offered "record it and refuse the gate on
the measurement" as a satisfying close, and it did not fire — no exemption map
was needed, so there was nothing to refuse on.

- **HEAD**: `149 .astro file(s) scanned, 8 read a file at build time, none
  parses without asserting`. The `8` was reconciled against an independent
  `grep -rl`, which also reads 8, before being quoted.
- **Red-proof against the REAL pre-fix tree**, not a synthetic injection:
  `git checkout -q 'ff2b623d^' -- apps/docs/src/pages` → the gate exits **1**,
  naming **exactly one** page, **zero false positives**. The checkout was
  confirmed by **blob sha** (`git hash-object` == `git rev-parse ff2b623d^:…`,
  both `6138cbe6`), not by the checkout command's exit code.
- **The self-test is itself red-proved**: a probe copy with comment-stripping
  removed turns **3 of its 11 cases WRONG**, including the fail-OPEN one.
- `check:selftests` now reads **47 gates: 16 heuristic, 31 exact** (was 46/15).

## The one claim this wake got wrong, and how it was caught

The write-up's first draft said the `stripComments` move to `source-files.mjs`
left `check:ci-ignores` "reporting the same numbers". **False.** It reads
`130 / 128` here and **`128 / 127`** at `HEAD`.

What caught it was going to GET the pre-move reading rather than asserting it,
in a **pristine `git worktree` at `HEAD`** (never `git stash` — ENVIRONMENT.md's
trap: it reverts the data along with the script). `HEAD` + the helper move alone
still reads **128 / 127**, so the move is verdict-neutral; the whole delta is
the new gate existing (`+1 script`) and becoming CI-run (`+2` = 1 script × the
2 `paths-ignore` entries). Both the corrected table and this account are in
ROADMAP 232.3's RESOLUTION.

**The general shape, for the next wake:** the claim that costs you is never the
one the slice was about — that one gets the red-proof treatment. It is the
sentence shipped BESIDE it on credibility it has not earned (roadmap 192.1).
This one was a tidy-up paragraph.

## Gates

**All seventeen entry points `ENVIRONMENT.md` derives from `ci.yml`: green,
exit 0 each**, against the committed tree — core `build`, core `test` (**152**
in 27 files), `lint:css`, `docs:build`, `check:claims`, `check:formatting`,
`check:scroll`, `check:layout` (**127** pages), `check:forced-colors`,
`test:axe` (**127 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (19 behaviours),
`check -w @busy-office/create-ui`, and `suite` (28 screens × 2 widths). Each
written to its own log and tailed only on failure, per 233.2's lesson.

`check:claims` reads **162 verified live · 3 NOT VERIFIED** — ENVIRONMENT §6b,
`(pointer: fine) = false` in this container, and the gate names that cause
itself on each of the three. **Not a regression; do not "restore" the zero.**

## Step 0c: ZERO collisions this wake

`origin/main` stayed at `2c02c34c` across both `git fetch origin main` calls —
Step 0 and once immediately before the commit.

**ENVIRONMENT trap 1 bit for real at Step 0 again**: the container started
**DETACHED**, `git branch --show-current` returned empty — the check that file
names as the actual answer — and `origin/main` arrived as a **forced update**
(`+ 17b3ba6...2c02c34`). `git checkout -B main origin/main` fixed it before any
commit existed. Trap 2's `--unshallow` ran clean in one attempt, no
`.git/shallow.lock`, `is-shallow-repository` → `false` afterwards, **1,778**
commits.

## Direction

**No new input arrived**: GitHub intake `list_issues` OPEN → `totalCount: 0`,
and no owner message. Step 1 had nothing to triage, so this wake recorded no
`Roadmap · plan` row.

**The open set is 6 items across 4 slices, and THREE are dispatchable:**

| item | kind of blocked |
|---|---|
| `234.1` introducing commit is 42.1, not 42.3 | **NOT blocked** |
| `236.1` 234.1's widened-predicate corroboration | **NOT blocked** |
| `236.2` an archived Accept target | **NOT blocked** |
| `112.3` pattern-fit pilot | owner-blocked — 5 briefs; `.roundtable/pilot-112/` has no `briefs.md` |
| `112.4` Screen Contract layer | owner-blocked — on 112.3's verdict |
| AT runtime evidence (Slice 15) | hardware-blocked — owner hardware |

**The oldest open item is Slice 15's AT runtime evidence**, then 112.3/112.4;
all three are blocked. Rule 4's oldest **dispatchable** item next wake is
**`234.1`**, then `236.1` — and note 236.1 is a finding *about* 234.1's
corroborating sentence, so a wake taking 234.1 should read both before
starting; they may close together.

**⚠ THE ARCHIVE SWEEP IS NOW DUE — do not skip it to take 234.1 without
looking.** `roadmap_scope.py` reads `targets: [235, 232]` and closed-history
share **842 / 2,665 = 31.6%**, up from 14.3% at the last hand-off, because
Slice 232 closed carrying a long RESOLUTION. Two eligible slices, hand-checked
one at a time per 177.1 and CLAUDE.md's bulk-edit rule. **Before creating
`ROADMAP-archive.md` content, re-read CLAUDE.md's case-insensitivity trap** —
a "new" file that shows up as *modified* is a file you just replaced.

**Nothing is owed to the owner from this wake.** Everything it touched was the
loop's own machinery — one gate, one shared helper, and the roadmap — and it
landed.

**Not verified, said plainly:** no Podman and no `localhost:8081` here, so the
1440/390 light-and-dark screenshot lane could not run. This wake changed **no
CSS and no page markup** — the diff is two gate scripts, one shared helper,
`apps/docs/package.json` and `ROADMAP.md` — so nothing in it rests on a
rendered image. Every browser-driven reading quoted (`check:claims` 162/3,
`check:layout` 127, `test:axe` 127 × 2, `suite` 28 × 2) came from a gate
executing in this container.
