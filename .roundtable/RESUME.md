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
at hand-off. Two commits this wake, both pushed: Slice 264 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

The live open set is `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
plus Slice 15 and `112.3`/`112.4` — **11 open, unchanged**, because 264's item
(`249.20`) was filed already closed, the same way 263.1 was.

**`check:resume-slice-ids` will report closed ids named below, and all are
deliberate** — `249.16`, `249.17`, `249.18`, `249.19`, `249.20` appear here only
as history (the per-EVIDENCE split chain of the last five wakes). Nothing here
queues or blocks on a closed id.

## ⚠ THE FIRST RULE THAT FIRES NEXT WAKE IS RULE 3 — Objective, not Continue

`dispatch_status.py` read this immediately after the wake recorded:

- **Rule 2 (Standardize)** `1 / 4 … ok`.
- **Rule 3 (Objective)** `3 / 3 … **OVERDUE**`, naming `[249, 263, 264]`. This
  wake's close armed it.
- **Rule 5 (Optimize)** `STALE, 1 wake-date(s) newer` — no input, so it is
  *could not be evaluated*, not clear.

So the next wake dispatches **Objective** — a grill of Slices 249, 263 and 264
— **before** it reaches rule 4. Re-run `dispatch_status.py` yourself; the lines
above are a snapshot. Rule 3's attribution agreed with the slice again, because
the `--item` string began `Slice 264.1`; that is the second row in a row where
starting with the slice number made `SLICE_TOP` read correctly.

## ⚠ The correction most likely to be re-broken

**A header's PROSE says what a thing is for; its SELECTORS say what it operates
on, and only the second is the relation.** The `@serves` declaration landed by
Slice 264 was authored by reading 26 behavior headers, and one of the 26 came
out wrong: `anchor-nav.ts` says its `aria-current` is *"the same signal
`.bo-sidebar-nav` and `.bo-pagination` already style"*, so it was declared
`@serves sidebar-nav`. It queries `[data-anchor-nav]`, `[data-anchor-collapse]`
and `a[href^="#"]` — no component's markup at all. The check that caught it was
one command per module:

```
grep -oE "(querySelector|querySelectorAll|closest|matches)<?[^>]*>?\('[^']+'\)" \
  packages/core/src/js/behaviors/*.ts
```

If a later wake revisits `@serves`, re-run that before trusting any header
sentence. The escape hatch `@serves none — <reason>` is used **once in 26** and
the reason is enforced to be a sentence, so a second `none` is worth arguing
about rather than accepting.

**And a directive in a comment is INPUT to every scanner that reads the file.**
Component directories are spelled exactly like `data-*` attributes, so
`@serves data-table` published a phantom `data-table` hook on five behaviors —
a change to a semver surface, from a comment. It was caught by diffing the new
`behaviors.json` against a copy of the previous build's, export for export;
nothing else would have. Keep that habit: **before believing a generated
manifest, diff it against the previous one**, not just read it.

Blanking comments was measured and refused rather than assumed unsafe: those
headers' markup contracts are where much of the hook surface is published from,
and blanking loses hooks on **25 of 33** exports.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly
blocked. GitHub intake is empty (`list_issues` → `totalCount: 0`). The two
standing owner blocks are unchanged: Slice 15's `AT runtime evidence` (owner
hardware) and `112.3`/`112.4` (owner briefs, then 112.3's verdict).

**Rule 4's open set, classified by WHICH KIND of blocked** (`LOOPS.md` 186.2's
vocabulary), because "all blocked" is three different situations:

- **owner-blocked:** Slice 15, `112.3`, `112.4`, `249.10`, `249.11`, `249.12`,
  `249.13` — and `249.7`, which is a cost question its own text says should not
  be settled before the owner answers `249.10`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none.

`249.9`'s two remaining badges are now unblocked as data — the pattern-links
half landed as `249.18`, the JS-tier half as `249.20` — and what is left of it
is the catalogue PAGE, whose point is rendered miniatures. There is no further
cloud-takeable clause inside it that this wake could find; the tier it still
wants was refused for want of a source, not for want of a browser.

**What landed needs no owner decision.** Five component pages' "JS required"
row changed text; nothing else about them moved and no CSS changed.

## The archive sweep: not due, do not re-raise

`roadmap_scope.py` reads closed-history share **2,315 / 5,108 = 45.3%** at
hand-off — under the **55.1%** at which 252.1 dispatched the tenth sweep on
2026-09-03. It read 43.8% at wake start; the share rose because Slice 264
closed *fully*, so its whole body is closed history the moment it lands. That
is arithmetic, not a backlog signal — nine wakes running now. Re-run the
script; snapshots.

## What landed this wake

**One commit of substance, dispatched by rule 4 (Continue, build).** Rule 1
clear (no open P0; GitHub intake `totalCount: 0`); Step 1 triaged and committed
nothing — no new input. Rules 2 (`0/4`) and 3 (`2/3`) did not fire at wake
start. Step 0c's pre-commit `git fetch origin main` showed `origin/main` still
at `758349a7`, so no collision. Step 0 hit **trap 1** again: the container
started DETACHED, fixed with `git checkout -B main origin/main` before any
work. `--unshallow` was clean in one attempt (**1,859** commits) and brought
all seven tags, so trap 2 did not bite. ENVIRONMENT trap 1's other note
reproduced too: `git rev-parse --short origin/main HEAD` exits 128 on a healthy
`main`, exactly as that file says it does.

### Slice 264 — 249.20, the JS-tier badge's recorded key

Five things worth carrying:

1. **The relation is declared, not intersected.** `@serves` in 26 behavior
   headers → `behaviors.json`'s `byComponent` (one entry per component, empty
   array included) and a per-behavior `serves`. 18 of 40 components are served.
   The two derivations 249.9 named were re-measured first and both fail:
   `classes ∩ hooks` 20/40 with structural false positives (`form` matches 16
   behaviors through the shared `bo-input`), filename-matching 9 of 26.
2. **The first declaration was wrong about one of the 26** — the prose-versus-
   selectors correction above.
3. **A phantom hook was published and caught by a manifest diff** — the second
   correction above.
4. **The new gate went red on six real pages before it went green**, base rate
   measured first (13 of 19). Two of the six contradicted their own page:
   offcanvas's API note names `initDialogs()` three sections above a row saying
   the drawer needs no JS.
5. **Six red-proofs**, three of them injected into the BUILT page and printed
   back from the file before the gate was run — plus the 40-of-40 pairing of
   each built cell against the prop its own source passes.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. What changed visually is one
table row's TEXT on five component pages, inside a generated table all 39 of
them already render; **0** files under `packages/core/src/css/` changed. All
**17** cloud-toolchain entry points green, re-derived from `ci.yml` this wake
rather than read off the snapshot, plus the `DOCS_BASE=/busy-office-ui` parity
build, whose base branch was **confirmed exercised** (91 prefixed
`/busy-office-ui/components/` hrefs and a base-carrying `og:url` on the built
drawer page) rather than merely green. `check:claims` reports `162 verified
live · 3 NOT VERIFIED` — ENVIRONMENT 6b's container property (`pointer: fine`
false), not a regression.

**`bundle-gz-kb` still cannot be sampled, unchanged for a fifth wake**
(259.1's rule-5 finding, re-verified rather than re-derived):

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
