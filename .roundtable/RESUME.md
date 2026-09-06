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

Last updated 2026-09-06 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake: Slice 291 and this hand-off. One iteration
recorded — `Objective · grill`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rules 2, 3 and 4 all fall through, so rule 6 (Polish) is what runs

After this wake's row, `dispatch_status.py` reads **rule 2 `1 / 4 … ok`** and
**rule 3 `0 / 3 … ok`** (this grill reset it). Rule 4 is then reached and
**finds nothing it can take: the cloud lane is dry, 0 of 12 open items are
cloud-takeable** (classified below). So a cloud wake falls through to **rule 6,
Polish**, whose predicate 176.2 measured as true of every non-skipped surface.
Rule 5 read **STALE** (`3 wake-date(s) newer`) and is reported as *could not be
evaluated*, never clear.

**Run `python3 scripts/loops/polish_requeue.py --apply` BEFORE evaluating rule
6** — `LOOPS.md` §3b step 0, and it now heals mid-round stamps as well as
re-queueing. `--verify-stamps` currently reports **21 rows, every stamp
describes a real tree**, so 283.3's repair is holding.

Re-run `dispatch_status.py` anyway. The standing carried-forward finding is
that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**Both counters were read immediately after recording** — `LOOPS.md`'s own
instruction, and the comparison that has found two of that parser's five bugs.
Both moved exactly as this wake predicts by hand: rule 3
`3/3 [286, 287, 290] → 0/3`, rule 2 unchanged at `1/4` (an Objective row is not
a Continue round). No disagreement to chase.

## ⚠ THIS WAKE LOST A COLLISION, and Step 0c's fetch is what caught it

The first pass reached **rule 4**, took `287.5` — the one cloud-takeable item —
built it and verified it. The mandated `git fetch origin main` **before the
first commit** then found `origin/main` **2 commits ahead** carrying the other
dispatcher's `287.5`: the same item, taken deterministically by the same rule,
exactly as Step 0c describes. That work was discarded per the accept-collisions
decision; cost, as priced, one wake's item.

**What is worth carrying forward is that the two answers agreed byte-for-byte.**
Both derived `f57570f4` as the commit that stranded the sentence, and both
rejected the Accept's no-change branch on the same ground. The two `LOOPS.md`
diffs are identical. Recorded as **291.4** — n = 2 independent derivations, the
strongest corroboration in this wake's report, and something no single
dispatcher can produce. It is **not** an argument for collisions.

## What landed this wake

**Slice 291 — Objective grill of 286, 287, 290**, dispatched by rule 3 on the
re-read after the collision (the winner's close armed it to `3 / 3 OVERDUE`).
Scope survived §6 step 0 whole: 285 took 281/283/284 and 289 took
283.3/284.2/288.1-2, so none of the three had been grilled.

**32 of 32 published assertions reproduce. No defect in any of the three
slices.** 290 21/21, 286 8/8, 287 3/3.

**A 100% is the shape CLAUDE.md calls a defect until proven otherwise, so the
finding is the check on that.** The pipeline *can* disagree — it disagreed four
times — and all four were **this grill's own probes**:

| # | probe | what made it wrong |
|---|---|---|
| 1 | `\b284\b` over open items | matched inside `1,284,734`; a comma **is** a word boundary |
| 2 | lane 1 over `packages/core/src/css` | the slice says `-- apps/docs/src`; read 0 against a true 390 |
| 3 | a synthetic "legacy 4-field" log row | its item was ONE token, so `ROW`'s `([\w-]+)` ate it and it matched |
| 4 | 286.2's table figures | measured **height**, compared to a claim about **width** |

Each was fixed by running the slice's stated command, after which it reproduced
exactly. **This continues 289's finding from the other side** — 289 found all
six of its non-reproducing assertions sat beside no command; here every
published claim had one and all 32 held, and the four things without one were
the grill's own. **Re-deriving what to measure from prose is where the error
enters.**

One real, minor gap filed and amended in place (**291.3**): Slice 290's lane-1
block states `in 79 files`, which the command it quotes cannot produce. The
number is true — `git grep -l 'style="' <rev> -- apps/docs/src | wc -l` reads 79
at all four revisions — so it is an incomplete command beside a correct claim.

**Gates green in this container:** `build`, `test` **165**, `lint:css`,
`docs:build` (`check:repo`, incl. `slice-refs` **855** assertions and
`loop-vocab`), `check:claims` **167** live, `check:layout` **127** pages,
`test:axe` **127** pages x 2 widths zero violations. The *"3 NOT VERIFIED"* in
`check:claims` is `ENVIRONMENT.md` 6b — this container reports
`(pointer: fine) = false` — not a regression.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...a3bc8fe`). Trap 2
clean in one `--unshallow` (**1,930** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the **twelfth** consecutive
container to do so.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None is owed, and that is
checkable rather than asserted:** the diff is one markdown file plus a new
`.roundtable/` report, and nothing in it renders. The one *rendered* measurement
the grill relies on (286.2's re-take: `main` 390−375 = 15, table widths
260/310/310/310, first rows 87/67/126/68) is layout geometry —
`ENVIRONMENT.md`'s **second** list, which a cloud wake can take — and it was
taken live against the built tree via `browser-harness.mjs` + `serve-dist.mjs`.

## The open set is 12, and NONE is cloud-takeable — the cloud lane is dry

This wake closed no open item (`287.5` was closed by the other dispatcher) and
filed none. Each line re-classified from the item's own text per `LOOPS.md`
186.2.

- **cloud-takeable: 0.** This is the second consecutive wake with a dry cloud
  lane, and it is why rule 4 falls through to Polish above.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text defers
  to 249.10, the owner's vocabulary column), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

Note the two counts are both right and have different denominators:
`roadmap_scope.py` reads items under slice headings; `check-resume-slice-ids`
also counts the 2 items under the non-slice `## STATE` heading. Do not quote a
bare closed count.

## No archive sweep — and this wake REVERSED its own decision, which is the part worth reading

It **began** one: 8 slices moved, `roadmap_scope.py` `38.1% → 9.4%`, verified
verbatim 8-of-8 with the diff shape asserted. It then **stood it down** on
reading the losing-side hand-off, which had refused the sweep hours earlier with
its numbers and named the trigger it would honour:

> *"a wake that finds itself past 5,450 / 40.6% should simply run it."*

We were at **5,163 / 38.0%** — below that in **both** units. `249.12`, the
archival trigger itself, is an **open owner call**, so a wake inventing a
threshold to justify work it had already started is the exact thing that item
exists to prevent. The sweep was discarded, not deferred with the work banked.

**Re-measure before acting:** after this wake's own commits `roadmap_scope.py`
reads **39.4%**, still under 40.6%. Trend across six wake readings:
**25.4% → 27.5% → 32.0% → 34.2% → 38.0% → 39.4%**. A wake that reads past
5,450 lines / 40.6% should simply run it; these are snapshots.

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **The cloud lane is dry for the second consecutive wake.** Nine of the twelve
   open items are owner calls and the other three need a local wake's
   screenshots. The loop keeps working — Polish's rule 6 sits below rule 4 — but
   **every remaining build item now waits on either the owner or a local wake.**

2. **`273.2` is still the owner call worth their attention**, a sixteenth wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. Measured this wake:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` → **10**, and
   `grep -cE '^## Round .*NOT a no-op'` → **6**; these are snapshots.

3. **`249.12`, the archival trigger, is now load-bearing rather than low
   urgency.** Its own text calls it *"low urgency, the sweep keeps happening
   regardless"*. That is no longer the whole picture: this wake and the previous
   one each spent real work on the sweep question and reached **opposite**
   conclusions on the same tree hours apart, and the only thing that settled it
   was one hand-off happening to name a number. Two dispatchers arbitrating a
   recurring decision by reading each other's prose is what a stated trigger
   would remove.

## `bundle-gz-kb` still cannot be sampled — the rule-5 finding is unchanged

259.1's finding, re-run this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
