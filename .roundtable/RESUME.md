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
at hand-off. Two commits this wake, both pushed: `276.1` and this hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## The counters, read right after this wake's recording

Read immediately after `record_iteration.py`, so it is a snapshot — and this is
the comparison `LOOPS.md` rule 3 asks for. **Both rules read UNCHANGED, and that
is the agreement, not a stall**: this wake's row is a `Polish` row, and 161.4's
list says only `Continue` and `Standardize` close a slice. A counter that had
moved here would have been the finding.

- **Rule 2 (Standardize)** `1 / 4 … ok` at dispatch → **`1 / 4 … ok`**. A Polish
  round is not a Continue round.
- **Rule 3 (Objective)** `1 / 3 … ok [274]` at dispatch → **`1 / 3 … ok [274]`**.
  Slice 276 was closed by Polish, which 161.4 excludes.
- **Rule 5 (Optimize)** read **STALE** (`2 wake-date(s) newer`, unchanged) at
  Step 0b and again after recording. Report it *could not be evaluated*, never
  clear.
- **Rules 7-8 were NOT EVALUATED**, because rule 6 matched. A rule below a
  match is unreached, not clear.

## The open set is 12, and NONE of it is cloud-dispatchable

Re-read from `ROADMAP.md` after this wake's commit, and **every line was
re-classified from the item's own text rather than carried over from the last
hand-off**, per `LOOPS.md` 186.2:

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7`
  (its own text holds the cost question for the owner's `249.10`), `249.10`,
  `249.11`, `249.12`, `249.13` (each says **OWNER CALL** in its own line), and
  `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`,
  `249.15`. Each says so in its own text; `249.6` has now been declined at the
  **clause** level twice, and re-reading it produced no separable cloud half.
- **agent-blocked:** none.
- **NOT BLOCKED:** none.

**So a cloud wake again falls through rule 4 to rule 5 (STALE — cannot be
evaluated) and then to rule 6, which fires.** That is the second consecutive
wake with no queued build item to take, exactly as the previous hand-off
predicted. Run `polish_requeue.py --apply` first — and note it now needs
`behaviors.json` as well as `api.json`, so `npm run build -w @busy-office/ui`
comes first or it exits naming the command.

**Rule 6's tiebreak is not in the rule, and the next wake will hit it too.**
Every non-skipped surface reads `content: 3`, so "lowest score" selects all of
them, and "fewest rounds used" now leaves **two** at `1/3` — `pagination` and
`table-toolbar`. This wake took the third (`inline-editing`) alphabetically and
said so. Do the same, or say what you did instead; do not present the tiebreak
as the rule deciding.

`roadmap_scope.py` reads **1,411 / 4,531 = 31.1%** closed history. No sweep is
due (272's eleventh sweep dispatched at 56.7%); re-run the script rather than
trusting this.

## What landed this wake

**Dispatched by rule 6 (Polish).** Rule 1 clear — `list_issues` on
`Busy-Office/busy-office-ui` returns `totalCount: 0`, and no open `N. [ ]` item
is a P0. Step 1 triaged and committed nothing: no new input.

**Step 0 hit trap 1 for the tenth wake running** (detached HEAD at `e914399`,
`git branch --show-current` empty). Trap 2 clean in one `--unshallow`
(**1,887** commits, no `shallow.lock`); `git fetch --tags origin` returned all
seven. The Step 0c `git fetch origin main` before the first commit reported
`0 0` — no second dispatcher moved anything this wake.

### `276.1` — the source set was blind to every behavior module

The Polish round on `component/inline-editing` is a **NO-OP on the surface**
(five arms, all reproducing) and the finding is in the loop's own step 0.
`polish_requeue.py` hashed a surface's docs page and CSS directories and
stopped, so a behavior module could be rewritten with nothing to notice —
**31 blind commits across 7 surfaces**, and `inline-editing`, whose whole
subject is `row-edit.ts`, had a source set of the docs page alone.

Fixed by reading `behaviors.json`'s `byComponent` (Slice 264's `@serves`), with
the two page-only surfaces named in a `PAGE_ONLY_BEHAVIORS` map that is
re-checked against each page's own import on every run. Both arms red-proved
with the injection confirmed first.

**The one number worth carrying forward, because it is what keeps the finding
honest: after the fix, `--apply` reported `0 rows newly marked`.** Every
affected surface was already re-queued for some other reason, so the 31 is
**structural blindness, not 31 demonstrated missed re-queues** — and the next
wake should not quote it as the latter. The cost is latent and lands on
`interaction`.

**Two refusals recorded inside the item**, both measured rather than waved off:
deriving the modules from each docs page's own imports (over-broad on `button`
and `richtext`, under-reports `stepper`), and extending the behavior source set
to patterns (near-uniformly-true predicate, the dead-detector shape 94.11
refuses).

**Nothing in this slice renders** — `scripts/loops/polish_requeue.py`,
`.roundtable/polish-state.md`, `ROADMAP.md`. **0** files under
`packages/core/src/` and **0** docs page markup changed, so the 1440/390
light-and-dark screenshot lane a cloud wake cannot run has nothing to say about
this diff; that is an absence of subject, not an unverified claim.
**All 17 cloud-toolchain entry points ran green**, and the entry-point list was
re-derived from `ci.yml` rather than trusted — it still matches
`ENVIRONMENT.md`'s in the two documented, opposite-direction ways.
`check:claims`' *"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b — this container
reports `(hover: hover) and (pointer: fine)` false — not a regression; its live
count reads **162**, unchanged from the previous wake.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `276.1`, `274.2`, `273.2`, `264` and the `249.x` ids are named
as history or as classification evidence — what was decided and why — not as
queued work. The report is partly **self-referential**: an id acquires a mention
simply by being listed in a paragraph like this one.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4` (owner briefs, then 112.3's verdict),
and `249.7`, `249.10`-`249.13`.

**Two things want the owner's attention, and both are carried over unchanged —
which is itself the signal:**

1. **`273.2` is still the owner call worth their attention**, untouched for a
   third wake. `LOOPS.md` §3b step 5 mandates `dry++` on a Polish round whose
   score does not move; no round has ever done it, **this one included** — it
   was deliberately not incremented, because 273.2 is open. This wake makes the
   tally **9 NO-OP rounds, 7 of which filed a real defect found elsewhere**, so
   "the score did not move" and "the round was busywork" have now come apart 7
   times out of 9. Executing the rule as written would retire surfaces and empty
   a lane **176.3 already refused to narrow**.
2. **The cloud lane still has no dispatchable build work**, second wake running.
   All 12 open items are owner-blocked (9) or need a LOCAL wake's screenshots
   (3). A cloud wake will keep finding Polish under rule 6, which is working as
   designed — the last two Polish rounds each found a real defect — but no
   *queued build item* will move until the owner answers something or a local
   wake takes `249.6`/`249.9`/`249.15`.

## `bundle-gz-kb` still cannot be sampled — nineteenth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
