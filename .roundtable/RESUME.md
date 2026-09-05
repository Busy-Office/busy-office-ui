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

Last updated 2026-09-05 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. Two commits this wake, both pushed: Slice 284 and this hand-off.
One iteration recorded — `Standardize · sweep`.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: rule 2 has RESET; expect rule 3 or rule 4

`dispatch_status.py` read `Standardize 4 / 4 … OVERDUE` at dispatch, which is
what dispatched this sweep. Re-read it after recording rather than trusting that
— a `Standardize` row resets rule 2's counter, and this sweep's row also **closes
a slice** (284), which advances rule 3.

**Rule 3 was `2 / 3 … ok [281, 283]` at dispatch.** Slice 284 is a new slice
closed by a `Standardize` row, and `Standardize` is in `CLOSES_A_SLICE`, so the
arming set should reach three and **rule 3 (Objective) is the likely dispatch**.
That is a forecast, not a measurement — the previous hand-off's prediction about
rule 3 was wrong for exactly this reason (it predicted on a slice the arming set
already held). **Re-run `dispatch_status.py` and read its own output.**

Rule 5 (Optimize) read **STALE** (`2 wake-date(s) newer`) and is reported as
*could not be evaluated* — never clear. `259.1`'s finding is unchanged and was
not re-verified this wake (nothing touched it).

## What landed this wake

**Dispatched by rule 2**, which sits above the queued build item deliberately.
Rule 1 clear: `list_issues` → `totalCount: 0`; no open item carries P0
(`grep -nE '^\s*[0-9]+\. \[ \]' ROADMAP.md | grep -i p0` → rc=1). Step 1 triaged
and committed nothing.

**Slice 284 — Standardize sweep, `4 of 4` lanes.** Lanes 1-3 clean; lane 4
carries the finding.

- **Lane 1** `scan:dead-style`: **0 dead** of **1,433** live inline declarations
  — identical to Slice 214's 1,433.
- **Lane 2** `report:css-repeats`: **8 repeated bodies**, `LOOPS.md`'s table
  exactly, membership included. 74 files · 242 rules · 230 distinct — all three
  unmoved from Slice 214, so its +5/+5 has not been followed by another. The
  joined-control `x4` group is still **two** components, so its reopen trigger
  (a THIRD) is unmet.
- **Lane 3** `report:prose`: **0 unverdicted**. 15 distinct flagged pages (10
  corpus, 11 family); 14 are named inside 158.1's own section body and
  `/concepts/scale/` carries 178.3's. Checked by extracting page paths from that
  section, **not** by counting roadmap mentions — a mention count is a presence
  probe, and the first attempt here was exactly that before it was thrown away.
  The set moved by one since Slice 214's 14; `/patterns/output-form/` is
  verdicted but no longer flagged, and **nothing entered the set unverdicted**.
- **Lane 4** `report_loop_prose.py`: **167.1's stated reopen condition for
  `CLAUDE.md` is MET.**

**The lane-4 finding, and why it was actionable rather than another watch.**
167.1 verdicted `CLAUDE.md` HONEST on 2026-08-28 with a checkable trigger —
*"7 of its 16 `##` sections … are all on one subject, whether a detector can
fail … Reopen if an eighth is added without folding."* Exactly one `##` section
has been added since that commit, it is on that subject, and it sits directly
beneath the rule it restates. **284.1 folds it in.**

- **The classifier was reconciled against 167.1's own published figures before
  its delta was believed.** Run over `e3844c49` it returns **7 of 16 on-subject
  and 1,893 section words — matching 167.1's numerator exactly**; the
  denominator reads 4,570 against its stated 4,600, which does not touch the
  numerator the condition rests on.
- `8 of 17 · 2,385 words` → `7 of 16 · 2,414 words` after the fold.
- **All ten worked examples survive**, plus both corollaries — asserted with 13
  distinguishing markers rather than by reading the diff.
- **It is +20 words, NOT a cut, and the entry says so.** Trimming doctrine prose
  to make the number fall would be optimising the instrument (274.1's refusal).

**`LOOPS.md` was checked against the same shape and is NOT the finding** —
measured, not read off the row. Its `by region` block shows the dispatch region
outgrowing the file, and the playbook's rule is that a cut missing that region
does not answer it; today's cut (`8848ed55`, 274.2) **did** touch it, 6,100 →
5,658. Recorded rather than filed: the region has **already regrown to 6,112,
+454 in the same day**, more than the cut removed, from 279.4's and 283.2's rule
text. One day is not a trend.

**Filed: `284.2`** — `CLAUDE.md` accumulates (**32 up / 0 down, never cut**) and
the fold left it 20 words longer, so the accumulation half of lane 4's finding is
untouched. Its Accept allows *"a recorded reason the file should not be cut at
all"* as a satisfying outcome, and deliberately ships **no gate** — "this section
earns its words" is semantic, which 94.11 already paid for.

**Step 0 hit trap 1 again** (detached HEAD, `git branch --show-current` empty),
fixed with `git checkout -B main origin/main` before any commit; `origin/main`
again arrived as a **forced update** (`26447ba...6c18a11`). Trap 2 clean in one
`--unshallow` (**1,912** commits, no `shallow.lock`), and it again brought the
tags — `git tag | wc -l` reads **7**, an eighth consecutive container, which is
why `ENVIRONMENT.md` §2 states the count as the check rather than a value. Trap
1c bit once for real: `scan:dead-style` failed with *"No Chrome/Chromium found"*
because `CHROME_PATH` does not persist between tool calls — **that gate is not in
`ENVIRONMENT.md`'s cloud-toolchain list and needs the export too.**

**Gates, all 17 CI entry points green in this container:** `build` / `test` /
`lint:css`, `docs:build` (**127** built pages), `check:repo` (re-run after the
markdown edits; `slice-refs` **840** assertions, 317 cited across 702 files,
**266** slice numbers), `check:claims`, `check:formatting`, `check:scroll`,
`check:layout`, `check:forced-colors`, `test:axe`, `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app`,
`check -w @busy-office/create-ui`, `suite`.

**NOT VERIFIED, said plainly:** this wake's diff is three markdown files and
renders nothing, so the 1440/390 light-and-dark screenshot lane a cloud wake
cannot run had **no subject**. That is an absence of subject, not a skipped
check, and the commit message says it the same way.

## The open set is 14, and none of the remainder is cloud-takeable

It was 13 at dispatch and is **14** after — `284.1` closed and `284.2` filed.
Each line below re-classified from the item's own text this wake per `LOOPS.md`
186.2, not carried over:

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md      # 14
python3 scripts/loops/roadmap_scope.py        # OPEN: [15, 112, 249, 273, 283, 284]
```

- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (owner briefs) and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  holds the cost question until the owner answers `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  `249.6`'s own text banks its clause-level decline; do not re-derive it again.
- **agent-blocked:** none. **cloud-takeable (2):** `283.3` and the newly filed
  `284.2` — both are script/prose/refusal work with no rendered subject. Rule 4
  reaches them only after the nine older blocked ones are skipped, and **rule 3
  is likely to pre-empt next wake** (see above).

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged: Slice 15's AT runtime
evidence (owner hardware), `112.3`/`112.4`, `249.7`, `249.10`-`249.13`, and
`273.2`.

**Three things want the owner's attention.**

1. **`249.12` is no longer low urgency** — carried forward unchanged, because
   nothing this wake touched it and the evidence still stands: 282.2's table
   shows two wakes reaching opposite conclusions on the archive trigger 3.5
   hours apart, with no threshold in either unit across five recorded decisions.
   It is marked **OWNER OR ARCHITECTURE CALL**, so it may not need the owner.

2. **`273.2` is unchanged this wake** — no Polish round ran, so its tally did not
   move for a second consecutive wake. The decision is still the owner's.

3. **The cloud lane is still fed only by the loop's own maintenance.** Slice 284
   is work the loop found while maintaining itself, and `284.2` is its follow-up
   — the same shape as `283.2`/`283.3` before it. Every one of the nine items
   older than them is owner-blocked. Unblocking any one of `249.10`-`249.13`
   would refill the lane with work the owner actually wants.

**Findings carried forward rather than acted on** (`274.1` closed, but the loop's
prose growth is now `284.2`, so new one-line rules are still not being given
sections): *a measurement taken to justify a change must be taken under the
change, or say which side of it it is on*; *a citation should name its example by
the PROPERTY that makes it an example, not by the page that currently has that
property*; *a rule fitted to one row is ceremony, and the wake that wrote the row
is the worst-placed to judge it*; *when a derived value's FORMULA changes, every
value already recorded under the old formula becomes a constant, not a stale
reading*; *a hand-off's claim about what a dispatcher rule will do next is a
forecast, not a measurement — re-derive the rule against its own text before
acting on it.* This wake adds a sixth, from 284.1: **a reopen condition written
into a closed verdict is the cheapest finding a sweep can have, and it is only
found by re-reading the verdict rather than the instrument** — lane 4's row said
`32 up / never cut` on six previous sweeps and nobody went back to 167.1 to see
what it had said would make that actionable. None of the six has a home yet.

**`check:resume-slice-ids` will report closed ids named in this file, and all
are deliberate.** `284.1`, `167.1`, `158.1`, `178.3`, `274.1`, `274.2`, `279.4`,
`283.2`, `282.2`, `259.1`, `94.11` and the rest are named as history, as counter
evidence, or as classification evidence — never as queued work. The report is
partly **self-referential**: an id acquires a mention simply by being listed here.
