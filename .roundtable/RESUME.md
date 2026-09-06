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
at hand-off. Two commits this wake, both pushed: Slice 286 and this hand-off. One
iteration recorded — `Objective · grill`, with two refusals.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ NEXT WAKE: read the counter, do not act on this paragraph

Rule 3 was already spent by Slice 285's grill row before this wake's own
`Objective` row landed, so **no counter is armed**. Rule 4 takes the oldest
dispatchable item; if it finds none, rule 6 (Polish) does. Rule 5 read **STALE**
(`2 wake-date(s) newer`) and is reported as *could not be evaluated* — never
clear.

`283.3`, `284.2`, `286.3` and `286.4` are all cloud-takeable, so a cloud wake
reaching rule 4 has work. Re-run `dispatch_status.py` anyway: the standing
carried-forward finding is that **a hand-off's claim about a dispatcher rule is a
forecast, not a measurement.**

## ⚠ THIS WAKE LOST TWO COLLISIONS — the case Step 0c says would REOPEN the decision

This is the thing that must survive into the next wake, and it is new.

- **Collision 1.** The wake dispatched Objective on `[274, 276-279]` and
  **completed a full grill of 276-279**. Step 0c's mandated `git fetch origin
  main` *before the first commit* then found `origin/main` **12 commits ahead**
  carrying `71b44721`, Slice 280 — the same grill. Nothing committed, nothing
  rebased, no push rejected. Reset and re-dispatched.
- **Collision 2.** It then grilled `[281, 283, 284]`, committed, and `git push`
  was **rejected**: another dispatcher had pushed `89455547`, *Slice 285 —
  Objective grill of Slices 281, 283, 284* — the same three slices, the same
  slice number, and the same report filename. The rebase conflicted (add/add on
  the report, content on `ROADMAP.md`) and was aborted; that work was discarded.

**Step 0c's stated cost is "up to one wake's work, discarded", measured at n = 1.
This wake paid it twice.** Both times the overlap was rule 3's armed set, not
rule 4's oldest-item rule — the armed set is equally deterministic, so the
mechanism `LOOPS.md` names is not the only one. **Recorded, not acted on: the
concurrency model is an owner call.** Two practical notes for the next wake:

- **The pre-commit fetch is the working half and it worked exactly as written.**
  It is what made collision 1 cost nothing. **Do not skip it.**
- **Losing a collision does not always mean the work is worthless.** Slice 286
  exists because the winning grill *checked and passed* a defect that was still
  shipped. Before discarding, ask whether the winner covered your finding.

## What landed this wake

**Slice 286 — the defect Slice 285 listed under *what reproduced*.** Slice 285
grilled 281 and recorded its decay as reproducing, verifying the two TIMESTAMPS
(`79f7fec9` 10:50 → `69a53364` 14:48, 27h58m, published as 28 hours) and taking
the causal half on trust. Both timestamps are right; the sentence joining them is
not.

- **`286.1`** — 281's heading says the worked example *"stopped being
  **reachable** by the rule"*; 281.1's own next paragraph measures *"the fourth
  **is reached** (injection confirmed)"*. Its dated cause is refuted three ways:
  `git show 69a53364 --stat` on `detail-form.astro` reads **91 insertions, 0
  deletions** — a pure addition of a *different* table — the cited table carries
  no density attribute at `79f7fec9:122`, `69a53364:127`, `a24ed45:127` or
  HEAD`:127`, and its markup (5 `<th>`, 3 `<tr>`, 26 lines) and `density.css` are
  both unchanged between 94.3 and 281's own commit, so neither side of the
  comparison moved. **Both readings of the sentence fail**: if *"it"* is the
  table the fact is false; if *"it"* is the page it is true and explains nothing.
- **It was SHIPPED**, which is what raised it above a wording slip — the sentence
  lived in `dsa-scores.json`'s `data-table · spacing` cite, which
  `DsaScore.astro` renders (1 occurrence in `dist`). Fixed with the replacement
  asserted at **exactly 1** occurrence and the JSON re-parsed; `scored` unmoved
  per 269.1. Archived Slice 281 gains a `CORRECTED` block per 236.2 / 199.1.
  **281's conclusion is preserved and is not in question.**
- **`286.2`** — `ENVIRONMENT.md` §6c read as a 1440-only WIDTH trap. The same
  15px reservation is present at **390px** (`offsetWidth 390 − clientWidth 375`),
  and its closing *"heights are unaffected"* does not hold for a row that WRAPS:
  the reached table measures **260px** against its three compact siblings' 310px
  and its row already wraps at **87px** before any mutation. Recorded as
  **Hypothesis, not Evidence** — settling it needs the owner's environment.

**Gates green in this container:** `docs:build` (runs `check:repo`),
`check:claims` **167** live (the *"3 NOT VERIFIED"* is `ENVIRONMENT.md` 6b, not a
regression), `check:layout` 127 pages, `test:axe` 127 pages x 2 widths zero
violations, `check:scroll` 914 containers across 118 pages x 2 widths.

**Step 0 traps:** trap 1 bit again (detached HEAD, `git branch --show-current`
empty), fixed with `git checkout -B main origin/main` before any commit;
`origin/main` arrived as a **forced update** (`26447ba...77e475c`). Trap 2 clean
in one `--unshallow` (**1,902** commits, no `shallow.lock`) and it again brought
the tags (`git tag | wc -l` → **7**). Trap 1b bit once mid-wake — a `cd apps/docs`
to run one gate left the next command there.

**NOT VERIFIED, said plainly:** **0** CSS files changed, but the cite string
renders on `/components/data-table`, so **that page reflows and the reflow is
UNVERIFIED VISUALLY** — a cloud wake has no 1440/390 light-and-dark lane. What
*is* verified: the old claim confirmed absent from the BUILT `dist/` and the
corrected text confirmed present, per the verify-against-what-it-renders rule.

## The open set is 16, and FOUR are cloud-takeable

Each line re-classified from the item's own text per `LOOPS.md` 186.2:

- **cloud-takeable (4):** `283.3` (is an advisory post-commit check enough for
  early stamping?), `284.2` (a verdict for `CLAUDE.md`'s accumulation on 158.1's
  three-way split), `286.3` and `286.4` below. Each has an Accept where a
  recorded refusal is a satisfying outcome.
- **owner-blocked (9):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  and `112.4` (blocked on 112.3's verdict), `249.7`, `249.10`, `249.11`,
  `249.12`, `249.13` (each says **OWNER CALL** in its own line), and `273.2`.
- **browser-blocked in the SCREENSHOT sense** (`ENVIRONMENT.md`'s FIRST list — a
  LOCAL wake can take these, a cloud wake cannot): `249.6`, `249.9`, `249.15`.
  Each has its cloud-takeable half already banked in its own text. **`249.6` has
  been declined at the clause level four times. Do not re-derive it a fifth.**

## Direction

Nothing new from the owner this wake; GitHub intake is empty (`list_issues` →
`totalCount: 0`). The standing owner blocks are unchanged.

**Three things want the owner's attention:**

1. **Two lost collisions in one wake is Step 0c's own reopen condition.** Its
   cost line reads *"up to one wake's work, discarded"* at n = 1; it is now n = 3
   overall and 2 in a single wake, and both of this wake's were on rule 3's armed
   set rather than rule 4's oldest item. The loop is not stuck and nothing was
   corrupted — `git push` rejected the loser both times, exactly as designed —
   but the accept-collisions decision was made against a smaller number than the
   one that now holds.

2. **`286.3` is the one that changes how the loop works.** §3b step 4 is called
   *the load-bearing step* and is absent from **13 of 20** Polish rounds — 7 ran
   it, 7 explicitly declined, 6 recorded none. The declines are principled: the
   step is written as a *dimension re-score*, and **171.1 already measured that
   no DSA dimension can rank**, so rounds skip a dead mechanism correctly. Its
   real value is a different activity — Slice 278 ran the step's principle rather
   than its letter and got **4 of that slice's 6 items**, including a shipped
   `aria-selected` accessibility defect. Base rate is Evidence; the yield claim
   is **n = 1** and is recorded as Hypothesis.

3. **`273.2` is still the owner call worth their attention**, a ninth wake
   untouched — whether a Polish round whose score does not move should increment
   `dry`. Re-measure before quoting:
   `grep -cE '^## Round .*NO-OP' .roundtable/polish-state.md` and
   `grep -cE '^## Round .*NOT a no-op'`; these are snapshots.

**Worth pointing at:** 286.1's two defects were both visible in Slice 281's own
text, one paragraph apart, at zero instrument cost — and two grills missed them
because both re-ran the slice's commands, which confirms its inputs and never its
inference. The generalisation to try next: **read a slice's headline against the
measurement it publishes, before re-running anything.**

## `bundle-gz-kb` still cannot be sampled — twenty-fifth wake

259.1's rule-5 finding, re-verified this wake rather than re-derived:

```
grep -rln 'bundle-gz-kb' --include='*.mjs' --include='*.py' --include='*.ts' \
  --include='*.js' --include='*.json' . | grep -v node_modules
```

still returns exactly **one** file — `scripts/loops/record_metric.py` — and the
hit is its **docstring example** at line 6, `--value 7.0`. Nothing derives the
number. Do not "fix" rule 5's staleness by recording a guessed value.
