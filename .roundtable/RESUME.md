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

Last updated 2026-09-05 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 272 and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The archive sweep RAN — it is not due again, and it now has a floor

The eleventh sweep landed this wake (Slice 272). `roadmap_scope.py`, read after
it: **673 / 3,524 = 19.1%** closed-history share, down from **56.7%** at the
start of the wake. Re-run the script rather than quoting that figure.

**The number to carry forward is not the share, it is the FLOOR.** All four
remaining eligible targets — Slices **253, 262, 260, 237** — are named by open
items inside Slice **249**, so 236.2 pins them. While 249 stays open, no sweep
can take the share below **19.1%**, and a wake that reads a rising share should
subtract those 673 lines before deciding a sweep is due. That cost is the
concrete thing `249.12` (archival trigger, **OWNER OR ARCHITECTURE CALL**) is
about; it is recorded there, not acted on.

**Reading those four is done and banked in 272.1 — do not re-derive it.** Every
one of the four citations is *provenance* (where a correction came from, where a
split-out clause landed, one instance in a list of four), and **none** is an
Accept clause saying to amend its target. They were kept anyway, and the trade
is stated in the slice rather than hedged.

## Rule 4 has no queued item, and the kind of blocked is named

Rule 4 matched this wake on its **own sweep clause**, not on a queued build
item — `LOOPS.md`'s *"if this rule is walking thousands of lines, that is the
signal"*, the precedent Slices 165, 177 and 252 set. The live open set is
unchanged at **11**: `249.6`, `249.7`, `249.9`, `249.10`-`249.13`, `249.15`,
Slice 15, `112.3`, `112.4`. Classified per `LOOPS.md` 186.2, re-read from
`ROADMAP.md` this wake rather than copied:

- **owner-blocked:** Slice 15 (AT runtime evidence, owner hardware), `112.3`,
  `112.4` (owner briefs, then 112.3's verdict), `249.10`-`249.13`, and `249.7`
  (its own text says it is still waiting on `249.10`).
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these): `249.6`, `249.9`, `249.15`.
- **agent-blocked:** none. **NOT BLOCKED:** none.

So the next cloud wake should expect rule 4 to find nothing and fall through —
**and the sweep is no longer the escape hatch**, because it just ran and its
remaining scope is the pinned 673 lines above. A cloud wake reaching rule 4 with
this open set has genuinely nothing dispatchable in it; say which kind of
blocked, per 186.2, rather than reporting the backlog empty.

**`check:resume-slice-ids` will report the closed ids named in this file, and
all are deliberate** — `272.1`, `271.1`, `252.1`, `252.2`, `237.1`, `249.17`,
`249.19` appear as history or as precedent. Nothing here queues or blocks on a
closed id.

## The counters, read immediately after recording — re-run them, this is a snapshot

- **Rule 2 (Standardize)** `3 / 4 Continue rounds … ok` — read immediately after
  recording. **One more Continue round arms it.**
- **Rule 3 (Objective)** `2 / 3 slices … ok [271, 272]` — 161.4's rule
  executing: only `Continue` and `Standardize` rows close a slice, and 272 is a
  Continue row. **One more closed slice arms an Objective grill**, which is
  worth knowing before the next wake picks work — a grill is cloud-takeable,
  unlike every item currently in the open set, and rules 2 and 3 both sit ABOVE
  rule 4 so either will preempt a fall-through.
- **Rule 5 (Optimize)** — its TREND clause read **STALE** at Step 0b (`2
  wake-date(s) newer`), so it must be reported *could not be evaluated*, never
  clear. Do not "fix" that by recording a guessed value (see the bottom of this
  file).
- **Rules 5-8 were NOT EVALUATED this wake**, because rule 4 matched and Step 2
  dispatches the first match. A rule below a match is unreached, not clear.

## What landed this wake

**Dispatched by rule 4 (Continue, build mode), on its sweep clause.** Rule 1
clear (`list_issues` → `totalCount: 0`, no open item is a P0); Step 1 triaged
and committed nothing. Step 0 hit **trap 1** for the fourth wake running
(detached HEAD, local `main` stale at `26447ba` against a pushed `9d698de`).
**Trap 2's second half did NOT bite this time** — `--unshallow` was clean in one
attempt (**1,875** commits) and brought all seven tags unprompted. Last wake's
hand-off said the opposite; both readings are real, so **fetch tags explicitly
and check, rather than expecting either outcome**.

### Slice 272 — the eleventh archive sweep

Four things worth carrying:

1. **17 slices moved, 2,995 body lines**; `ROADMAP.md` 6,468 → **3,524** at the
   move and 6,468 → **3,689** at the commit (writing the slice back is the
   rest); `ROADMAP-archive.md` 34,431 → **37,443**, the **+3,012** reconciling
   as 2,995 body + 17 headings. All read from the index and `HEAD`, never the
   working tree. **Three figures in this slice are a MOVE-vs-COMMIT pair** —
   these line counts, `check:slice-refs` 792 vs 793, and the verifier's checkbox
   arm, which exits 1 on the committed tree because 272.1's own `[x]` is a
   checkbox the pre-move source has not got. Quote each for the right one.
2. **The 236.2 arm was red-proved by committing the actual defect**, not a proxy:
   the mover was re-run with Slice **253** added to its move list, the mover's own
   output confirmed the injection landed (18 moved, 6,468 → 3,362), and the
   verifier caught it **alone** — checkbox conservation stayed green, which is
   what shows that arm does independent work. Archive and removal arms red-proved
   separately, each injection confirmed landed (block count 1 → 0 with the marker
   present; interior-present False → True).
3. **`check:slice-refs` 775 → 792 on the sweep, +1 per swept slice**, because a
   swept number heads a section in both files. Cited refs hold at 295 across 698
   files, dangling baseline 2, live sections 253. The committed tree reads
   **793 / 254** — Slice 272's own heading. The two are different numbers about
   different things; do not quote one for the other.
4. **`git stash` was not used.** The A/B here is of DATA, not a script, so the
   two markdown files were copied aside and `git checkout --`'d between proofs —
   ENVIRONMENT's rule generalises to this case.

**Not verified, and named rather than implied:** cloud wake, so the 1440/390
light-and-dark screenshot lane could not run. It is not needed here and that is
measurable rather than asserted — the staged diff is **exactly two markdown
files**: **0** non-`.md` files, **0** under `packages/core/src/`, **0** docs
pages. The docs site builds neither file into a page, so nothing in this slice
renders.

## Direction

Nothing new from the owner this wake, and nothing owner-facing is newly blocked.
GitHub intake is empty (`list_issues` → `totalCount: 0`). The two standing owner
blocks are unchanged: Slice 15's AT runtime evidence (owner hardware) and
`112.3`/`112.4` (owner briefs, then 112.3's verdict). `249.10`-`249.13` remain
the owner-decision cluster inside Slice 249.

**One thing is newly worth the owner's attention, and it is small:** `249.12`
now has a measured cost attached rather than being an abstract "no stated
trigger" question — four archived-eligible slices (673 lines) are pinned live
for as long as Slice 249 stays open, which is the floor described above.

## `bundle-gz-kb` still cannot be sampled — thirteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example**, `--value 7.0`. Nothing derives the number. Do
not "fix" rule 5's staleness by recording a guessed value.
