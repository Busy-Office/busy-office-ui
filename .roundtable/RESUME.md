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

Last updated 2026-09-09 (**cloud** wake, scheduled routine). Working tree clean
at hand-off apart from this file, `loop-log.md`, `INDEX.md` and `STATUS.md`.
**No collision this wake** — `origin/main` read `421afd15` at Step 0 and again at
the mandated pre-commit fetch; it was the local tip both times.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**Every closed id this file names is named as history or as precedent, never as
open work:** `351.1` (the item THIS wake closed), `341.1`/`339.1`/`326.3` (the
Step 0c precedents re-measured here), `324.3`, `297.1`, `332.1`, `355.3`,
`359.4`, `310.1`, `298.1`, `316.1`, `338.1` (named by `roadmap_scope.py`'s own
report, all history). **`350.1` is named repeatedly and is OPEN — deliberately
so.** Nothing here claims an open item that is not.

## ⚠ WHICH RULE FIRES NEXT — rule 3, Objective, at 2/3 and one slice short

`dispatch_status.py`, read immediately after this wake's recording (`LOOPS.md`
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   0 / 4 Continue rounds   ok        ← reset by THIS wake's Standardize row
Objective     2 / 3 slices            ok    [338, 370]
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 24 open items). Rule 2 was consumed by this
wake and is back to 0/4. **Rule 3 is at 2/3: the NEXT slice closed by a
Continue, Standardize or Polish row arms it**, so a wake that dispatches rule 4
and lands an item should expect rule 3 to fire the wake after. Until then
**rule 4 matches**, on the oldest genuinely dispatchable open item.

**⚠ The arming label reads `[338, 370]`, and its two entries are of DIFFERENT
kinds — this hand-off predicted `[338, 351]` and the instrument said otherwise.**
`338` is an ITEM id, resolving to slice **369**; `370` is a genuine **slice
number**. The nine-row SLICE_TOP streak the last three hand-offs recorded is
therefore **broken here, and by a controllable cause**: `SLICE_TOP` reads the
head of the row's item text, and this wake's row begins *"Slice 370 — …"*, so it
resolved correctly. The previous rows began with an item id.

**So the label is not inherently unreliable — it reflects how the row was
written.** A wake that starts its `--item` text with `Slice N —` gets a label
that resolves; one that starts with `NNN.N —` gets an item id wearing a slice
label. Still **no parser item is filed** (seventh of its kind, refused on
`355.3`, `359.4` and `LOOPS.md`'s own conclusion) — there is nothing to fix in
the parser, and this is a writing convention, which is the shape `LOOPS.md`
already refuses a sixth regex for. Resolve any label you did not write by reading
the commit subject at the row's sha; never treat it as an ordinal.

**Recorded because the prediction was made and was wrong**, which is CLAUDE.md's
rule on criteria arriving in a hand-off: this file named the value `[338, 351]`
before measuring it, and the counter was the thing that corrected it.

## What landed: Slice 370 — the Standardize sweep, 4 of 4 lanes

**Dispatched by rule 2, which read `4 / 4 OVERDUE`.** Rules 3-8 were not
reached. Step 1 read both intakes with §8's controls — issues **1**, discussions
**0**, `/not-a-real-route` **404** — and triaged nothing.

**Lanes 1-3 are clean, and each figure below was printed by that lane**
(`standardize_lanes.py`, rc 0, `all 4 lane(s) printed a figure`), run against a
settled `dist` of **529** files:

```
lane 1  scan:dead-style     0 dead attrs on 0 pages, 1365 live inline
lane 2  report:css-repeats  74 files / 242 rules / 230 bodies / 8 repeats
lane 3  report:prose        119 pages, median 798, flagged union 15
lane 4  report_loop_prose   dispatch region 7,552 words, 1 of 16 sections moved
```

Lane 2's **8** groups match `LOOPS.md`'s standing table body-for-body and
multiplicity-for-multiplicity. Lane 3's **15** flagged pages are all inside the
mandated 16-set; the one non-flagged member is `/patterns/output-form/`, as in
345 and 350, so **the 16-set needs no amendment**.

**Lane 4's `+198` is not new material, and the per-revision series is what says
so** — 339.1's rule that the tell is the series, not the endpoints. Measured by
importing `report_loop_prose.dispatch_sections` rather than re-implementing its
convention, asserting exactly one `Step 0c` match per revision:

```
f9e0f17d  1,322   339.1 applies the charter by hand
7e2c61c0  1,516   +194   collision 5 written up in full
1310b81a  1,516     +0
f1e84a77  1,520     +4   341.1 removes the aggregate half
e128804d  1,520     +0
5ce62916  1,520     +0
```

So `+198` = **one generator firing (+194)** plus **the +4 net of the very commit
that was trying to shrink the section**, and Step 0c has been **flat at 1,520
across the last three revisions**. Both components were already recorded
(`326.3` publishes the series and refuses both structural candidates; Slice 363
records its own `+4` as *"NOT a cut"*), so **no new finding and no cut
proposed** — this wake adds only the two flat revisions after 341.1.

## The decision: `351.1` ACCEPTED — the base-rate command now windows `a..b^`

**What settled it was evidence `350.1` already carried in its own prose.** That
paragraph names `161ede68`'s only lane-input commit as *"the sweep's own
conversions"* — so under `a..b` that window is classified **has lane input** on
the strength of the sweep's own OUTPUT. Re-verified by hand on two of the five
disagreeing windows: `f9e0f17d..161ede68` is **16 commits, 15 touching no lane
input**, the 16th being the sweep; `d3bb443f..cdd7c07e` is the sweep's own single
`Gallery.astro`. The confound is the mechanism, not one window's accident.

**Both predicates re-measured at execution time** (unshallowed first — 2,108
commits), 141 windows: `a..b` **15** no-input (10.6%) / span **2037**; `a..b^`
**20** (14.2%) / span **1896**. **Reconciled twice before quoting**: the `a..b`
span equals an independent `rev-list` over the same range, and `a..b^` is
**exactly 141 lower**, one dropped commit per window. The disagreement set is
**the same five windows**, reproduced rather than carried.

**`350.1` IS LEFT OPEN ON PURPOSE.** 351.1 only ever claimed to decide *which
number* 350.1 is decided on. A wake reaching 350.1 by rule 4 now gets the
see-able window from the block, and must still answer 350.1's own question.

## Two defects in this wake's own work, both caught before publishing

- **The block-extraction assertion was load-bearing.** Verifying the amended
  command meant extracting it back out of `ROADMAP.md` and running it. The naive
  "first `python3 - <<'PY'` block" pick found **6** candidates; selecting by
  content and asserting exactly one match is what made the check real. It then
  printed `141 windows; 20 …; span 1896`, the figures written beside it.
- **A wrong attribution, caught by the hand verifier pass.** A draft said the
  15/20 pair was "published at `81f6281c`". It was not — `81f6281c`'s own
  reading is the earlier **14 of 138**; the pair was published by the Slice 351
  grill at **`65de70c`**. That is 350.1's own *"a figure published from inside a
  sweep is one window short of the sweep publishing it"* effect, arriving in a
  sentence about it. Corrected in both places before committing.

A caret count over the extracted block also read **3** where the code has 2 —
the third is the new comment's own explanation of the change. The
"assertion tripped by its own explanation" shape, checked rather than assumed.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is **structural rather than a judgement**: `git diff
--stat` was read, and the slice diff is **`ROADMAP.md` alone** (167 insertions,
4 deletions). **No CSS rule, no docs page, no `.astro` file, no generated
artefact, no shipped JS.** The four deletions were read individually and are the
`351.1` checkbox, the command's two `{a}..{b}` lines, and the pinned comment
line — nothing else was removed.

**The eight older debts are unchanged and unspent**, counted from the previous
hand-off's enumeration rather than carried as a number: Slice 352's two
(`/components/data-table`'s performance table and `/concepts/scale`'s scaling
table, both at 1440 and 390 in both themes); Slice 345's two
(`/patterns/output-form` **in print** and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths); and the four older —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run in this container**, the list
re-derived from `ci.yml` rather than trusted, every one green. Figures read off
their own output: core `build` (incl. `check:package` **185** files), core
`test`, `lint:css`, `docs:build` (`slice-refs` **1027** assertions / **352**
slice sections, `vendor-names` **624** files, `floor` **602** files),
`check:claims` (**176** live, **3 NOT VERIFIED**, which is `ENVIRONMENT.md`
§6b's container fact, not a regression), `check:formatting`, `check:scroll`
(**914** containers), `check:layout` (**128** pages), `check:forced-colors`,
`test:axe` (**128** pages × 2 widths, **zero** violations), `check:target-size`,
`check:search`, `check:pseudo`, `check:quickstart`, `check:po-app` (**20**
behaviours), `check -w create-ui`, `npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push. It gates `.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It is what
caught the `81f6281c` misattribution above**, which was then corrected rather
than argued.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing recorded, deliberately** — the same call the previous two wakes
  made, for the same measured reason.
- **`dispatch-region-words`** — **`LOOPS.md` was not touched this wake**
  (byte-for-byte unchanged), so it cannot have moved; not re-sampled.
- **`gates`** — unchanged at **56**; this wake added no gate and **refused
  one** (a comment-only-diff refinement to lane 2's window guard).
- **`claims`** — read **176** live, identical to the sample already in the pair.
  A same-value sample moves nothing.
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.
- **The 141-window base rate was NOT recorded as a metric**, and that is a
  choice: rule 5 compares two runs on distinct days, and 39 of 47 names already
  have only one day. A name nothing will sample again adds to that pile rather
  than to the rule's input.

## The open set is 24 — no P0

`roadmap_scope.py` at the slice commit and the raw checkbox count agree at
**24**. Slice 370 closed one item (`351.1`) and opened **none**, so the set is
−1 on the previous hand-off's 25.

- **cloud-takeable: 11** — `339.2`, `345.1`, `346.1`, `348.1`, `349.1`,
  `350.1`, `352.1`, `352.2`, `353.2`, `362.1`, `369.2`. `339.2` is the oldest
  of these and is what **rule 4 dispatches next**. `362.1` carries Slice 364's
  amendment on the `include`; Slices 365-370 did not touch it. **`350.1` is now
  better-served than it was** — its block hands a wake the see-able window.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, and the **403** was re-confirmed by
  measurement in Slice 366. A local wake can take it. **Not re-derived this
  wake** — rule 2 dispatched, so rule 4 did not reach it.
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (holds its remaining rows for `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**),
  `369.1` (a palette-wide print behaviour change with a visible result).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

11 + 1 + 11 + 1 = 24, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 25 open items at Step 0. **Rule 2 matched** on
`Standardize 4 / 4 OVERDUE`, so rules 3-8 were **not reached** and were
correctly not evaluated — including rule 5, which the previous wake evaluated
only because rule 4 (below it) had fired. `polish_requeue.py --apply` was
correctly NOT run.

## ⚠ The archive sweep: 60.9% — the highest on record, and it ROSE 1.3pp

```
python3 scripts/loops/roadmap_scope.py
  8669 / 14230 = 60.9%    (this wake's slice commit)
  8381 / 14062 = 59.6%    (previous wake's tip, for the trend)
```

**Read the direction carefully, because the previous hand-off's reading went the
other way and both are correct.** Nothing was archived this wake either; the
share rose because closing `351.1` moved Slice 351's whole body from the open
side of 208.1's ratio to the closed side. So **a 1.3pp rise here is one item
being ticked, not history being filed** — the exact counterpart of last wake's
0.1pp fall, and the same ratio-versus-denominator caveat `LOOPS-archive.md`
carries. Do not read either as progress against the backlog.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 60.9% is
**5.8pp above** the level the tenth was dispatched at and **4.2pp above** the
eleventh's — the largest margin yet recorded.

**Not dispatched by this wake, and the reason is the dispatch**: rule 2 fired,
and a sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md).
**`249.12` is named again** — the open **OWNER OR ARCHITECTURE CALL** on the
archival trigger, and this wake is a second consecutive live argument that a
percentage trigger moves for reasons unrelated to how much closed history the
file carries. **10 targets are NAMED by a still-open item** (`roadmap_scope.py`
lists them) and must be read before moving (236.2).

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit.** `git branch --show-current` answered **EMPTY** at Step 0 — the
container arrived detached at `421afd15` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,108**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**). **No
streak ordinal is carried forward**: §2 asks for the count.

**No `git worktree` and no `git stash` were used this wake.** The three probes
(the Step 0c series, the two-predicate base rate, and the block extraction)
lived in the scratchpad and never in the repo; `git status` showed only
`ROADMAP.md` throughout.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Five things want the owner's attention. The first two are unchanged from the
previous hand-off and are the two biggest.**

1. **`369.1` — printing from the dark theme puts 19,511 of 26,817 painted text
   fills below AA on paper, across 125 of 128 pages.** Chrome's economy mode is
   what keeps that from being worse, and it is a **UA behaviour no other engine
   is known to share**, so the reading is a floor for Chrome and says nothing
   about the others. The proportionate fix is one `@media print` block
   re-pointing the theme tokens at their light values — a deliberate exception
   to `check:print-tokens`'s own rule, and so the owner's to make.
2. **Issue #2 is open and carries only the triage comment**, with `updated_at`
   unchanged for a **fourth** consecutive hand-off. Slice 317 refuses the
   component with the measurement; Slice 319 corrected a second false claim on
   the page the reporter was pointing at. **Replying and closing is an owner
   action.** Whether a *wake* should post that comment was `297.1`, closed by
   Slice 335 — read it before re-raising.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. **This wake adds the counterpart to last
   wake's argument**: the share fell 0.1pp last wake with nothing archived, and
   rose 1.3pp this wake with nothing archived. Both moves are denominator
   effects of ordinary slice work. A trigger phrased as a percentage will fire
   and un-fire for reasons that have nothing to do with how much closed history
   the file carries — that is now measured twice, in both directions.
4. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
5. **`335.1` cannot be settled by any cloud wake.** A local wake can do it in
   one command, or the owner can file a throwaway Q&A discussion and let the
   next wake read it.

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages.

**`ENVIRONMENT.md` was NOT touched this wake** — no new trap was found, and the
two Step 0 traps that bit are already described there accurately enough that
recovery took one attempt each. The previous hand-off's note stands: the file
has no size discipline and no open item asking for one (`332.1` closed on the
finding that it is long because the environment is hostile). **If the owner
wants that discipline it needs filing as its own item**, and no wake should
infer it from a closed one.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` and
`LOOPS.md` are **byte-for-byte unchanged**, so the dispatch region a wake reads
every wake is unmoved at **7,552** words.
