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
at hand-off. Two commits this wake, both pushed: Slice 284 and this hand-off.
One iteration recorded — `Continue · build`, with three refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: read the counter, do not act on this paragraph

After this wake's row, rule 2 reads `2 / 4` and rule 3 `2 / 3 [283, 284]` — **no
counter is armed, and rule 3 is one slice away.** Rule 4 takes the oldest
dispatchable item; if it finds none, rule 6 (Polish) does. Rule 5 read **STALE**
(`3 wake-date(s) newer`) and is reported as *could not be evaluated* — never
clear.

`286.3`, `286.4` and `287.5` are cloud-takeable, so a cloud wake reaching rule 4
has work. Re-run `dispatch_status.py` anyway: the standing carried-forward
finding is that **a hand-off's claim about a dispatcher rule is a forecast, not a
measurement.**

**Last wake's `[283]` observation resolved itself, and it is worth one line.**
That hand-off noted the rule-3 counter crediting `Slice 283` for a row whose item
text began `283.3 — …`, because `SLICE_TOP` reads the leading number. This
wake's row begins `284.2 — …` and the counter credited **284**, which is both the
item and the record. Nothing to fix; the two readings simply coincide here.

**No collision this wake.** Step 0c's mandated `git fetch origin main` before the
first commit read `0 0` against `origin/main`. **Do not skip it.**

## What landed this wake

**Slice 284 — 284.2, dispatched by rule 4 as the oldest cloud-takeable item.**
The item asked for a verdict on `CLAUDE.md`'s accumulation using 158.1's
three-way split, **or** a recorded reason the file should not be cut, and it
required both named instruments re-run first because every figure in it is a
snapshot. Both were re-run and neither moved: ratchet **33 up / 0 down, never
cut**; section inventory **16**.

- **VERDICT: HONEST**, on four fresh measurements rather than on 167.1's (which
  was taken at 10 up / 4,759 words and is what the item said not to quote):
  the signature holds over the file's **whole** history (all 34 commits ever to
  touch it — **33 up / 0 down / 0 flat**, 381 → 5,880 words, 4 → 16 sections);
  **0 of 834** sentences of ≥12 words are duplicated across the four files a
  wake reads; an independent 8-gram sweep finds **3 of 120** section pairs
  overlapping at all, largest **36 of 5,808 body words (0.62%)**; and 14 of 16
  sections cite a date or slice id, a proxy that **undercounts** — the two that
  do not cite still name their incidents in prose.
- **The reason not to cut is a number.** The entire removable surface both
  instruments can find is one worked example (39.2's four dead detectors) told
  three times for **181 words = 3.1%**, against the +2,914 the item is about.
  Kept: it illustrates three *different* rules, and this repo has a recorded
  position that *a pointer is read less than a paragraph*.
- **One instrument caveat, and it was NOT enough to verdict INSTRUMENT.** The
  ratchet's up/down is a word count, so 284.1's own fold (`6eab896f`, **17 → 16
  sections for +20 words**, read from the commit and its parent) registers as an
  **up** step. 1 of 33 — the file has genuinely never been cut by words.
- **The first red-proof came back GREEN, which is `CLAUDE.md`'s own case.** The
  sentence detector split line-by-line while this repo hard-wraps at ~79
  columns, so it could only ever match a sentence short enough to fit on one
  line; a duplicate planted verbatim out of `LOOPS.md` did **not** fire it, and
  its 3 "hits" were all single-line code comments. Unwrapping fixed it, and the
  fixed version asserts the planted sentence is **present in the parsed corpus
  at both locations** before reporting — injection confirmed in the artefact,
  not in the file.
- **The reopen condition is restated as a PROPERTY.** 167.1's was a value
  (*"reopen if an eighth is added without folding"*) that 284.1 satisfied
  literally, leaving it consumed inside a closed archived item. The entry's
  command and baseline are recorded so a later wake re-runs and compares.

**Gates green in this container, all 17 CI entry points, zero failures:**
`build`, `test` **165**, `lint:css`, `docs:build`, `check:claims` **167** live
(the *"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b — this container reports
`(pointer: fine) = false` — not a regression), `check:formatting`,
`check:scroll` **914** containers, `check:layout` **127** pages,
`check:forced-colors`, `test:axe` **127** pages x 2 widths zero violations,
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` **19** behaviours, create-ui `check`, `suite` **28** screens.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` again arrived as a **forced update** (`26447ba...c3d87a0`). Trap 2
clean in one `--unshallow` (**1,920** commits, no `shallow.lock`) and it again
brought the tags (`git tag | wc -l` → **7**) — the seventh consecutive container
to do so, which is why that section states the count as the check.

**NOT VERIFIED, said plainly:** no 1440/390 light-and-dark screenshots were
taken — a cloud wake has no Podman and no `:8081`. **None were needed and that
is checkable, not asserted:** the slice commit changes **0** CSS files and **0**
docs pages; its single file is markdown. Nothing in that diff renders.

## The open set is 15, and THREE are cloud-takeable

Each line re-classified from the item's own text per `LOOPS.md` 186.2:

- **cloud-takeable (3):** `286.3` (is §3b step 4's real value a different
  activity from the dead dimension re-score?), `286.4` (`fit`'s definition
  scores against a four-row field matrix), `287.5` (re-attach the orphaned
  sentence in `LOOPS.md` §3b step 5). Each has an Accept where a recorded
  refusal is a satisfying outcome.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` and `112.4` (blocked on 112.3's verdict), `249.7` (its own text
  defers to 249.10, the owner's vocabulary column), `249.10`, `249.11`,
  `249.12`, `249.13`, `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list —
  a LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`,
  `249.15`. Each has its cloud-takeable half already banked in its own text.
  **`249.6` has been declined at the clause level four times. Do not re-derive
  it a fifth.**

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Two things want the owner's attention, both carried forward unchanged:**

1. **`273.2` is the owner call worth their attention**, an eleventh wake
   untouched — whether a Polish round whose score does not move should
   increment `dry`. It is load-bearing in a second place: 287.2's heal skips
   dry rows on `--apply`'s own rule, so whichever way 273.2 is decided changes
   which rows the repair can reach. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

2. **`286.3` is still the one that changes how the loop works** — §3b step 4,
   the *load-bearing step*, absent from 13 of 20 Polish rounds because its
   stated mechanism is one 171.1 already measured as dead. Base rate is
   Evidence; the yield claim is **n = 1** and is Hypothesis.

## `bundle-gz-kb` still cannot be sampled — twenty-seventh wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
