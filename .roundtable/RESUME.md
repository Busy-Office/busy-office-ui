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

Last updated 2026-09-08 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **No collision this wake** — `origin/main` read `c1716ead` at Step
0, `c1716ead` again immediately before the first commit, and `c1716ead` after
the gate suite.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against this file, and the report was read
rather than left for the next wake.** It names **9** closed ids
(`355.1`, `355.2`, `355.3`, `354.1`, `327.3`, `273.1`, `310.1`, `324.3`,
`297.1`) and **3** absent from `ROADMAP.md` entirely (`192.1`, `274.1`,
`312.2`, all archived). The check says outright it cannot tell a stale claim
from a historical reference. **All twelve are historical here** — `355.1`-`355.3`
are this wake's own items, closed in the same commit that names them; the rest
are cited as precedent or as the record a figure was compared against. **None is
claimed open, blocked or queued**, so there is no stale blocked-set for rule 4
to read.

## ⚠ RULE 3 JUST FIRED AND RESET. RULE 4 IS THE NEXT DISPATCH

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   3 / 4 Continue rounds   ok
Objective     0 / 3 slices            ok
Optimize      0 wake-date(s) newer    ok
```

Rules 1-3 are clear, so **rule 4 matches**: the OLDEST still-open item across
all slices that no other kind of block covers. That is **`328.1`** — unchanged
from the previous hand-off, because this wake closed nothing from the
cloud-takeable list. **Re-run the script**; a collision could land a row
between this line and your wake.

**`349.1` reproduced a SIXTH time, and this wake's grill names the shape rather
than re-filing it.** The armed set read `[325, 327, 353]`. Slice **325** had
already been grilled in full a day earlier, and **327** is itself a grill,
closed 2026-09-07 — it appears only because the round's recorded row begins
`327.3 — …`, so the counter attributes the round to slice 327 and never names
**354**, the slice the round actually wrote. Two of three armed slices were
therefore not the material. `349.1` stays **open**; it needs whoever owns
`LOOPS.md`'s text.

## What landed: Slice 355 — Objective grill of Slices 353 and 354

**Rule 3 dispatched this** at `Objective 3 / 3 [325, 327, 353] OVERDUE`. Scope
narrowed per §6 step 0 to **353 and 354** (see above). Full report:
`.roundtable/grill-objective-353-354-2026-09-08.md`.

**Verdict: 103 of 107 published figures reproduce. Two defects, one per slice,
and they are the same defect pointing opposite ways** — a number right at the
commit and wrong in the prose beside it, and a number right at the tip the wake
read and wrong at the commit that ships it.

**The granularity is stated because the total depends on it:** a figure = one
number, id, percentage or sha that a command returns. At the coarser
one-claim-per-sentence granularity the same evidence reads roughly 40 of 44;
the two defects are identical either way.

- **`355.1` — Slice 354's halves table prints TWO CONVENTIONS in one row.**
  Published `11 of 21`, measured **`12 of 21`**. Not off by one: every
  observation-half slice cites `192.1` and the self-slice `327` does not quote
  it, so the citation column and the population column count the **same set**
  and cannot differ. `11` is the body-only count, `12` the whole-text count,
  and **Slice 319** — which quotes it in its heading only — is the single
  discriminator. **Corrected at all three sites** (354's heading, `354.1`, and
  Slice 327's `327.3` closure note), with a correction block in Slice 354.
- **`355.2` — Slice 353's whole-region verdict section reads the PRE-COMMIT
  tip.** `72 revisions / FASTER 56 / "42.0% now"` is `299f7063` exactly; at
  `1310b81a`, the commit that ships it, it is **73 / 57 / 41.8%**.
  `ENVIRONMENT.md`'s `HEAD` bullet in its **third** consecutive instance after
  `273.1` and `274.1`. **The instrument was not at fault** —
  `report_loop_prose.py` prints its revision in its own first line; the figure
  was quoted as *"now"* with the sha dropped. Corrected in place, revision
  named. **`353.2`, which files this same defect about the metric, is untouched
  and stays open.**
- **`355.3` — base rate measured before anything was proposed, and nothing is
  proposed.** An unanchored *"at `HEAD`"* is in **14 of 161** population slices
  (8.7%) and **0 of 174** control slices; the anchored form Slice 354 uses is
  **n = 1**. No gate: *"at `HEAD`"* is correct wherever the commit does not
  move the figure — Slice 353's own split table is the worked case — so the
  checkable shape flags right answers (94.11).

**The instrument was an independent reimplementation**, because Slice 354's
extractor was a throwaway that was never committed. Three conventions had to be
recovered before it agreed — sections bound at **any** `^## ` heading,
**IGNORECASE** base-rate needles, and `shipped BESIDE` rather than the full
quoted phrase — after which it reproduces **53 of Slice 354's 54 figures**,
four of them exact **id lists**. That is the discrimination control.

## CI on this wake's push: BOTH RUNS GREEN

`81fc42cbe8` — `CI` **success** 14:59:27Z, `Deploy docs to Pages` **success**
14:57:31Z, roughly three minutes after the push. Read from the plain
`?branch=main&per_page=6` listing with the sha matched in code, per
`ENVIRONMENT.md` §6d.

## This wake's own THREE instrument errors — all published

- **`git rev-parse --short origin/main HEAD` exited 128** at the pre-commit
  collision check. `ENVIRONMENT.md` §1 documents this verbatim, *including* the
  warning that it fails on every container whether `main` is healthy or not.
  The two-argument form without `--short` answered.
- **The verification of `355.1`'s own fix was an assertion trippable by its own
  explanation.** Its first draft claimed `grep -c '11 of 21'` → 3 → 0, which is
  false the moment the item says what it corrected. Replaced with the
  structural form: name the three sites, assert each now reads `12`, account
  for the survivors. CLAUDE.md's removal rule, inside a grill about numbers
  that are right at one revision and wrong at another.

- **The CI poll filtered on a sha that does not exist**, and it cost 20
  minutes. `ENVIRONMENT.md` §6d's two rules were both followed — the plain
  listing, and a loop that emits on the empty case — but the sha itself was
  *assembled*: `81fc42cb` (the new commit's prefix) concatenated with
  `b1da20c7`'s tail. **The emit-on-empty branch is what contained it**: the loop
  printed *"ZERO runs match this sha — not the same as still running"* forty
  times rather than reporting a timeout, so the diagnosis took one command
  instead of a false alarm. **§6d now carries a third rule** — take the full sha
  from `git rev-parse HEAD`, never by extending a short one already on screen.

None reached a published number. **Three in one wake is the base rate, not bad
luck** — CLAUDE.md says an instrument's first output is not evidence, and this
wake's own grill verdict rests on detectors that were checked before they were
quoted.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous two wakes.
  Nothing this wake touched the claim corpus.
- **`dispatch-region-words`** — not sampled. `353.2` is open about exactly this
  name, and `LOOPS.md` is **byte-for-byte unchanged** this wake, so the value
  has not moved. Recording another hand-typed sample would deepen what `353.2`
  filed.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139 payload files / 382.7 kB gz**, tightest headroom 110 bytes, unchanged.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is **`ROADMAP.md` plus `.roundtable/**`**
and the recorder's own files. No `.astro`, no CSS, no built page changed
content — `docs:build` ran green on the same **128** pages as the previous wake.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: not all 17 CI-runnable entry points were run — say which.** Green in
this container: core `build` (incl. `lint:css`, `check:size` 139 files /
382.7 kB gz, `check:readme-facts`, `check:package` 185 files), core `test`
(**165** passed), `lint:css`, `docs:build` — **run to exit 0 after every edit
to the committed tree, including a final run after this file was written**, per
`ENVIRONMENT.md` §3b (a literal count is deliberately not given: it changes as
this sentence is written, which is its own bad instrument) — (carrying
`check:slice-refs` **999** assertions / **378** citations / **337** slice
numbers, `check:floor` **595** files, `check:vendor-names` **616**,
`check:imports`, `check:repo`, `check:loop-vocab`, `check:selftests`,
`check:page-shape`, `check:wrong-choice`, `check:metadata` **1,159**
assertions), `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:layout` (**128** pages), `test:axe` (128 × 2, zero violations).

**NOT run this wake, and named rather than implied:** `check:scroll`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite`. The
reason is that the diff touches no CSS, no `.astro` and no built page, so none
of them reads anything that changed — but **that is a judgement, not a
measurement**, and CI has no `paths-ignore`, so CI runs all of them on this
push. Check the run.

**Said precisely.** `docs:build` was re-run after the last `ROADMAP.md`
correction, so it describes the committed tree; and re-run again after this
file was written, per `ENVIRONMENT.md` §3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2
step 6's verifier pass was done by hand: the staged diff re-read adversarially,
every number re-checked against the command that produced it. **It earned its
keep twice.** It caught *"thirty exact agreements"* standing in the slice text
against the **103** the same commit publishes — an unmeasured round number
beside a measured one, which is 192.1's shape inside the grill about 192.1 —
replaced with `53 of Slice 354's 54 figures` and the four id lists enumerated.
And it caught the self-tripping `grep` assertion described above.

## The open set is 32 — no P0

`roadmap_scope.py` reports **32 open** at `b1da20c7`, and the raw checkbox count
reads **32 open / 93 closed**. `roadmap_scope.py` excludes the 2 `[x]` items
under the non-slice `## STATE` headings and says so in its own output.

This wake filed Slice 355 with **three items, all closed in the same commit**,
so the open set is unchanged at 32. **Re-run the script at the commit** rather
than quoting this.

- **cloud-takeable: 21** — `328.1`, `330.1`, `331.1`, `332.1`, `333.1`,
  `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`,
  `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`328.1` is the oldest of these**, so it is rule 4's item next wake.
  `335.1` still carries its caveat — settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

21 + 10 + 1 = 32, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
TWENTY-FIRST consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 32 open items at dispatch. Rule 2 `Standardize 3 / 4 ok`. Rule 3
`Objective 3 / 3 OVERDUE [325, 327, 353]` — **matched and dispatched**. Rules
4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days. No sample was recorded this wake (reasons above), so
it is unmoved.

## ⚠ The archive sweep: the share has risen AGAIN and is now 3.0pp above the last taken sweep

Measured, not carried. `roadmap_scope.py` read **4,942 / 11,267 = 43.9%** at
`c1716ead` (Step 0), 24 eligible targets, **12** named by a still-open item
(236.2's report, read before concluding). **At `b1da20c7` it reads
`5,078 / 11,423 = 44.5%` with 25 targets** — Slice 355 landing closed, not
regrowth of anything.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, and `324.3` *took* the thirteenth at **41.5%**. **44.5%
is 3.0pp above the last taken sweep and above every declined reading on
record**, and it has now risen on three consecutive wakes (41.1 → 43.9 → 44.5).

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and rule 3
had already dispatched. **It is a live candidate for the next wake**, alongside
rule 4's `328.1` — and note `249.12`, still open, is the item saying no stated
trigger exists, which is exactly why this reading has to be compared to the
record by hand every time. **Re-run the script at your commit**; no figure here
describes your tree.

**`249.12` is named for a FIFTEENTH consecutive wake.** Fifteen consecutive
wakes have now declined a sweep on the absence of a stated trigger, and this is
the second of them where the measured share exceeds the last taken sweep's.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and
it was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 DID bite this wake, in both of its forms.** `git branch
--show-current` answered **EMPTY** at Step 0 — the container arrived detached at
`c1716ea` — and was fixed with `git fetch origin main && git checkout -B main
origin/main` before any commit. Then the *documented* `rev-parse` failure bit
for real at the pre-commit collision check: `git rev-parse --short origin/main
HEAD` exited **128** with *"Needed a single revision"*, exactly as
`ENVIRONMENT.md` §1 says it does on every container. The two-argument form
without `--short` answered both shas.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any
figure was taken** — **2,076** commits at `HEAD`, no `shallow.lock`, and the
unshallow again brought the tags (`git tag | wc -l` → **8**, run rather than
assumed). This wake's verdict is a history measurement over 73 revisions of
`LOOPS.md`, so the unshallow was load-bearing rather than precautionary.

**No `git worktree` and no `git stash` were used this wake.** Every figure
describes either `c1716ead` (the Step 0 tip) or the commit stated beside it —
which is, deliberately, the discipline `355.2` is about.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention, both unchanged and both thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2` is still worth their attention** — whether a Polish round whose
   score does not move should increment `dry`. Not touched this wake; rule 6
   was never reached, so `polish_requeue.py --apply` was correctly not run.

**The loop-mechanics question is still FOUR items deep** — `341.1`, `349.1`,
`350.1`, `351.1` — plus `353.2`. This wake answered neither and added none:
`355` closed three items of its own and left every open item untouched, which
is the second consecutive wake not to file a successor. **`349.1` reproduced a
sixth time on this wake's own arming set** (two of three armed slices were not
the material — see the counter block above). It still needs whoever owns
`LOOPS.md`'s text.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is
`ROADMAP.md` plus `.roundtable/**`. `LOOPS.md`, `CLAUDE.md` and the dispatch
region are **byte-for-byte unchanged** — deliberately: `355.3` refuses a gate
and a prose change alike on the measured base rate.
