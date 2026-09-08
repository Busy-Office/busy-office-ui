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
at hand-off. **No collision this wake** — `origin/main` read `299f7063` at Step 0
and `299f7063` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: RULE 4 IS THE NEXT DISPATCH AND ITS ITEM HAS MOVED

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   2 / 4 Continue rounds   ok
Objective     2 / 3 slices  [325, 353] ok
Optimize      0 wake-date(s) newer     ok
```

Rules 1, 2, 3 and 5 are all clear, so **rule 4 matches**. `326.3` closed this
wake, so its oldest cloud-takeable item is no longer `326.3` — it is
**`327.3`**. **Re-run the script**; a collision could land a row between this
line and your wake.

**`349.1` reproduced AGAIN, and this time in the opposite direction — read that
beside the counter line.** `Objective 2 / 3` names **`[325, 353]`**: `325` is
the slice the *previous* wake CLOSED, `353` is the slice *this* wake WROTE.
Two consecutive wakes, two different meanings, from the same counter — which is
`349.1`'s point (rule 3's text says slices *closed*; its counter means slices
*named by a building row*) arriving as a within-counter inconsistency rather
than only as a definitional one. **Recorded here, not acted on** — `349.1` is
open and needs whoever owns `LOOPS.md`'s text.

## What landed: Slice 353 — `326.3` answered, and the premise had moved off the item

**Rule 4 dispatched this** on the oldest still-open item no other kind of block
covers. Every open item older than it was re-checked in the file rather than
carried from the previous hand-off: Slice 15, `112.3`, `112.4`, `249.7` (its own
text: *"still waiting on 249.10"*, itself an OWNER CALL), `249.10`-`249.13`,
`273.2`, `296.3` owner-blocked; `320.3` browser-blocked in the screenshot sense,
which its own Accept says in as many words.

**The premise was re-measured before anything was built** (CLAUDE.md's premise
rule) and it had moved. `326.3` states the region at **6,759 words**; at Step 0
it read **7,548** (7,492 body + 56 headings), **+789** since the item was filed
at `e1f5a12f`. Attributed per section, **580 of that +789 (73.5%) is Step 0c and
209 is Step 1 — every one of the eight rules is flat.** So the item's own
framing (*"the region grows because the RULES grew"*) described `e1f5a12f`,
where 326.2 measured it correctly, and does not describe the tree that closed
it.

**Decision:** the question has no single answer because the region has two kinds
of growth. Growth that is a rule changing is accepted; growth from a *generator*
section (339.1's term) is its charter's business — and **`341.1` is open on
exactly that for Step 0c**, so nothing here re-decides it. Both structural
candidates the item named are refused on measurement:

- **a per-rule word ceiling** — the eight rules read
  `9 / 119 / 975 / 980 / 585 / 631 / 226 / 190` body words; one low enough to
  bind fails the sections 326.2 attributed to rules that changed, one above 980
  binds nothing, and *"the decision content is short"* is semantic (94.11).
- **a rules/rationale split** — the repo's ONE precedent, measured:
  `RESUME.md` **3,150** words before the 169.3 split, **1,683 + 1,666 = 3,349**
  in the split commit, and **2,728 + 6,582 = 9,310** at HEAD, **2.96x** the
  pre-split file. Step 0 names both files, so the split moved the number and not
  the read.

`353.1` landed the executable half: `report_loop_prose.py`'s by-region block now
prints per-section body-word deltas since the last commit that REDUCED the
region. At the commit it landed on it prints **one line — Step 0c, +194** —
where the ratio above it prints `FASTER`, as it has on **56 of 72** revisions
and on every revision since 2026-08-28, i.e. 56 revisions and 12 Standardize
sweeps before the block was written.

## This wake's own instrument was wrong first — and the RED-PROOF is what caught it

Recorded because CLAUDE.md's base rate says so, and because the defect was in
the reconciliation rather than in the detector:

The first draft derived the heading total as `region − body` — a residual that
agrees with itself by construction. Under an injection that drops a section from
the split it printed `7,302 + 246 = 7,548` and **passed**. `dispatch_heading_words()`
now counts the heading lines from the text independently; the same injection
prints `7,302 + 56 = 7,358`, names the gap and exits **1**. **The injection was
confirmed to have landed before either result was believed** — 16 sections
became 15, body 7,492 → 7,302.

**Validated against independent sources as well as by injection**, because an
instrument's first output is not evidence:

- 339.1's published Step 0c series (**936 / 1,300 / 1,500** at `8848ed55` /
  `534b097a` / `86f034ce`) reproduces **3 of 3 exactly**, and its five
  per-section deltas **5 of 5**, including the loops table's `+52` net as an
  explicit NEW/GONE pair (`## The eight loops` −214, `## The nine loops` +266).
- `341.1`'s independently-derived Step 0c series — different bounds
  (`### Step 0c` .. `### Step 1`) — reproduces as well: 1,378 / 936 / 1,300 /
  1,500 / 1,322 / 1,516.
- **Discrimination on real data:** over `8848ed55 → 632bfc46` the block names
  **rule 3, +303, and nothing else** — a different section on a different input.
- **6 new paired self-test cases** (19 total). The load-bearing pair is a
  `N. **` line inside Step 2 (a section) against the identical line inside Step
  0c (not one) — Step 0c carries a numbered list of collisions. The
  section-dropping injection turns **6 of 6** red.

## No metric was recorded this wake, and here is the reason for each candidate

- **`dispatch-region-words`** was deliberately NOT sampled. Its newest reading
  is **7,492 on 2026-09-08 00:17**; a sample taken today falls in the same day
  bucket and would replace that value rather than add a day, so it moves rule 5
  by nothing. **And this wake filed `353.2` about that name** — it is sampled by
  hand under the body-only convention while the instrument prints the
  headings-included one, and `loop-metrics.jsonl` records no revision beside a
  sample. Recording another hand-typed value would have deepened exactly the
  thing just filed.
- **`claims` = 176** (`check:claims`). **Identical** to the two previous
  readings. Nothing this wake touched the claim corpus.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139 payload files / 382.7 kB gz**, tightest headroom 110 bytes.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is one Python script under
`scripts/loops/` and two markdown files (`ROADMAP.md`, `LOOPS.md`) that ship to
no page. No `.astro`, no CSS, no built page changed content — `docs:build` was
re-run twice and every page gate passed on the same 128 pages as the previous
wake.

**The eight older debts are unchanged and unspent**, and no wake since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were not all run — say which.** Run
green in this container: core `build` (incl. `lint:css`, `check:size`,
`check:readme-facts`, `check:package` 185 files), core `test` (165 passed),
`lint:css`, `docs:build` **twice** (carrying `check:slice-refs` **997**
assertions / **378** citations / **335** slice numbers, `check:floor` **594**
files, `check:vendor-names` **615** files, `check:imports`, `check:repo`,
`check:loop-vocab`, `check:selftests`, `check:page-shape`, `check:wrong-choice`,
`check:metadata`), `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:layout` (128 pages), `test:axe` (128 × 2, zero violations), `check:repo`.

**NOT run this wake, and named rather than implied:** `check:scroll`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite`. The
reason is that the diff touches no CSS, no `.astro` and no built page, so none
of them reads anything that changed — but **that is a judgement, not a
measurement**, and CI has no `paths-ignore`, so CI runs all of them on this
push. Check the run.

**Said precisely.** `docs:build` was re-run after the last ROADMAP prose edit,
so it describes the committed tree; and re-run again after this file was
written, per `ENVIRONMENT.md` §3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep
three times.** It caught *"any ceiling that binds today fails rules 3, 4, 5 and
6"* — false, a ceiling of 900 binds and fails only two — corrected to name the
threshold. It caught *"every one of the 16 SLOWER readings predates
2026-08-28"* — false, two are dated 2026-08-28 — corrected to name the last one,
`69cadcbb`. And it caught the slice attributing two `loop-metrics.jsonl` samples
to specific commits when the file records only `{ts, name, value, unit}`;
the commit-anchored pair 339.1 published was used instead, and the unanchored
sample became the point of `353.2`.

## The open set is 33 — no P0

`roadmap_scope.py` reports **33 open / 86 closed** at `1310b81a`, and the raw
checkbox count reads **33 open / 88 closed**. **The two disagree by design, not
by defect**: `roadmap_scope.py` excludes the 2 `[x]` items under the non-slice
`## STATE` headings and says so in its own output.

This wake closed `326.3`, landed `353.1` and filed `353.2` (33 → 33). **Re-run
the script at the commit** rather than quoting this.

- **cloud-takeable: 22** — `327.3`, `328.1`, `330.1`, `331.1`, `332.1`,
  `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`,
  `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`,
  `353.2`. **`327.3` is now the oldest of these.** `335.1` still carries its
  caveat — settling it may mean filing a throwaway Q&A discussion, an
  outward-facing write to a public repo whose permission has **not** been
  tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

22 + 10 + 1 = 33, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** The eight ids older than `327.3` were re-read in
the file **this** wake, because rule 4 had to walk past them.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
NINETEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 33 open items at dispatch. Rule 2 `Standardize 1 / 4`. Rule 3
`Objective 1 / 3` (spent by Slice 351). **Rule 4 matched.** Rules 5-8 not
reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days. No sample was recorded this wake (reasons above), so
it is unmoved.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **4,334 / 10,829 = 40.0%** at
`299f7063` (Step 0) with 21 eligible targets, **12** named by a still-open item
(236.2's report, read before concluding). Below every trigger the last sweeps
used: 252.1 dispatched the tenth at **55.1%**, 272.1 the eleventh at **56.7%**,
279.3 declined the twelfth at **40.6%**, `324.3` took the thirteenth at
**41.5%**. **It reads 41.1% at `1310b81a`** — the rise is this wake's own Slice
353 crossing to the closed side plus 190 lines of new closed text, not regrowth
of anything. Still below every trigger above. **Re-run the script at your
commit**; no figure here describes your tree.

**`249.12` is named for a THIRTEENTH consecutive wake.** Thirteen consecutive
wakes have now declined a sweep on the absence of a stated trigger. **Nothing is
proposed here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit again.** The fetch reported a forced update `26447ba...299f706`,
and `git branch --show-current` answered **EMPTY** — the container *was*
detached. Fixed with `git checkout -B main origin/main`; the branch read `main`
afterwards. No `git stash` at any point. **`HEAD` equalled `origin/main` at
`299f7063`**, the previous wake's own tip, so no other dispatcher had landed
anything between the two wakes.

**Trap 2: the clone was shallow and this wake's verdict is a history
measurement**, so it was unshallowed before any figure was taken — **2,072**
commits at `HEAD`, no `shallow.lock`, and the unshallow again brought the tags
(`git tag | wc -l` → **8**, run rather than assumed). `report_loop_prose.py`
refuses to report on a shallow clone, so this was load-bearing rather than
precautionary. `polish_requeue.py --verify-stamps` therefore had real history
and printed nothing.

**No `git worktree` was used this wake.** Every figure describes either the
Step 0 tip or the commit named beside it.

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

**The loop-mechanics question is now FOUR items deep** — `341.1`, `349.1`,
`350.1`, `351.1` — and this wake made it four by *answering* one (`326.3`) and
filing a smaller one (`353.2`) rather than by adding another structural
question. `349.1` reproduced again on this wake's own recording, and this time
in the opposite direction (see the counter block at the top): that is a fourth
independent occurrence, and it still needs whoever owns `LOOPS.md`'s text.

**Nothing this wake did is outward-facing or hard to reverse.** The one change
to a file every wake reads is `LOOPS.md`'s lane 4, **below `## Playbooks`** —
the dispatch region is byte-for-byte unchanged (`+0` words, asserted with the
instrument, not assumed).
