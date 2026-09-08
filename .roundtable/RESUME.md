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
at hand-off. **No collision this wake** — `origin/main` read `2caaa16f` at Step 0
and `2caaa16f` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: RULE 4 IS THE NEXT DISPATCH AND ITS ITEM HAS MOVED

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   1 / 4 Continue round    ok
Objective     1 / 3 slice      [325]  ok
Optimize      0 wake-date(s) newer    ok
```

Rules 1, 2, 3 and 5 are all clear, so **rule 4 matches**. `325.2` closed this
wake, so its oldest cloud-takeable item is no longer `325.2` — it is
**`326.3`**: *what is the answer when the region a wake must read grows because
the RULES grew?* Its Accept takes **a recorded decision OR a recorded refusal
with its reason**, and says outright that "cut something" is not the default, so
it can close either way. **Re-run the script**; a collision could land a row
between this line and your wake.

**Read `349.1` beside that counter line.** `Objective 1 / 3` names **`[325]`**,
not 352 — the slice this wake CLOSED, not the slice it wrote. That is exactly
the gap `349.1` is open about (rule 3 counts slices *named by a building row*,
its text says slices *closed*), reproducing again without being looked for.
Recorded here, not acted on.

## What landed: Slice 352 — `325.2` closed by WITHDRAWAL

**Rule 4 dispatched this** on the oldest still-open item no other kind of block
covers. Every open item older than it was re-checked in the file rather than
carried from the previous hand-off: Slice 15, `112.3`, `112.4`, `249.7`,
`249.10`-`249.13`, `273.2`, `296.3` owner-blocked; `320.3` browser-blocked in
the screenshot sense, which its own Accept says in as many words.

**The method is not recoverable, searched four ways**, each command written next
to its claim in the slice. The figures enter at `4fbe1afe` (2026-08-15
12:11 +0800) with the throttled rows at `961fd043` (13:01); neither commit
records a window; `git log --all --diff-filter=AD --name-only -- '*stress*'`
returns **exactly one file in the repository's whole history**, this repo's own
`measure-stress.mjs` added three weeks later; and over **2,070** commits the
only surviving sentence about the method is a diagnostic aside (a hidden-tab
artifact ruled out, *"re-measured with synchronous forced-layout reads"*) with
no start point, no end point and no machine.

**The measurement that decides it needs no knowledge of the missing machine.**
`npm run measure:stress -w docs -- --rows 1000,5000,20000 --repeat 5`, controls
`1000/1000, 5000/5000, 20000/20000 checked`:

```
render   85 / 174 / 558 ms  vs  render-dcl 357.1 / 2073.1 / 4092.9  = 4.20x / 11.91x / 7.33x
sel-all   4 /  18 /  49 ms  vs               3.7 /   12.9 /   58.4  = 0.93x /  0.72x /  1.19x
```

**A machine gap is a roughly constant multiple; a method gap is not.** Said at
the strength the evidence carries: this does not prove the 2026-08-15 render
figures wrong, it proves the disagreement is **undiagnosable**. The Accept's
third branch (a shape-only column kept undefined) is **refused with its reason**
— the page's own fallback, *"read the shape"*, is not checkable without the
window, and the page told the reader to reproduce it with a probe whose header
says its render figures are **not comparable to that column**.

## This wake's own instrument was wrong first, and it cost a FALSE P0

Recorded because CLAUDE.md's base rate says so, and because it looked like the
one thing that preempts every rule:

The first `measure:stress` run failed its own control on **6 of 6** runs
(`0/1000 checked`, `0/5000 checked`), and `check:po-app` then failed **3 of 20
behaviours** including *"the shared page template inits data-tables"* — the
**exact signature, in the same words**, of the real 2026-08-23 → 2026-09-07
defect Slice 309 found, on a gate CI runs. **It was neither.**
`packages/core/dist` did not exist, because the wake had not yet run
`npm run build -w @busy-office/ui`, so `npm pack -w @busy-office/ui` shipped the
reference app a tarball with **no behaviour bundle**. What settled it *before*
any diagnosis was written: **CI on the same commit `2caaa16f` was green at
`2026-09-08T11:04:54Z`**, and CI runs `check:po-app`. After the core build and
`rm -rf examples/po-app/node_modules examples/po-app/busy-office-ui.tgz`:
`check:po-app` **20 / 20**, controls `1000/1000, 5000/5000, 20000/20000`.

**Filed as `352.1`**, and the practical warning for the next cloud wake is one
line: **run `npm run build -w @busy-office/ui` before any gate that boots the
reference app.** `ENVIRONMENT.md`'s toolchain list already puts it first; what
was missing is that skipping it produces a message that accuses the app.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the 2026-09-07 reading.
  Nothing this wake touched the claim corpus, so recording it adds a zero-delta
  day-pair and no information — the same reason the previous wake gave.
- **`dispatch-region-words`** was not re-measured. `324.1` names it as the one
  live candidate to reopen rule 5 *if it gets a third day*, and its newest
  sample is **7,492 on 2026-09-08**; a reading taken today falls in the same day
  bucket and would replace that value rather than add a day.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139 payload files / 382.7 kB gz**, tightest headroom 110 bytes.

## NOT VERIFIED, said plainly — and this wake ADDS visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** Unlike
the previous two wakes, **this one owes some**, structurally: two docs tables
lose a column (`/components/data-table` 4 → 3, `/concepts/scale` 3 → 2) and four
paragraphs change, so column widths redistribute and the `4× CPU throttle` badge
now sits in a **two-column** table on `/concepts/scale`. Nothing here was
checked visually and nothing in the commit claims it was.

**What WAS checked, because it is a property rather than an appearance:** the
built pages were parsed rather than the diff, per CLAUDE.md's bulk-edit rule —
`/components/data-table`'s perf table renders 3 headers and every body row
carries exactly 3 cells **paired to its own row label** (1,000 → 4 ms /
negligible; 5,000 → 18 / 231; 20,000 → 49 / 610; throttled 15 / 174 and
60 / 686), `/concepts/scale` renders 2, and the withdrawn figures appear
**exactly once each** on the built data-table page (in the withdrawal paragraph)
and **zero** times on `/concepts/scale`.

**The visual debt this wake adds (2):** `/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes. **Slice 345's two are still owed and unspent:** `/patterns/output-form`
**in print** (the figure, the barcode quiet zone), and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths. **The six older ones are
unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run green in this container** —
core `build` (incl. `lint:css`, `check:size`, `check:readme-facts`,
`check:package` 185 files), core `test` (165 passed), `lint:css`, `docs:build`
(carrying `check:slice-refs` **994** assertions / **376** citations / **334**
slice numbers, `check:floor` **594** files, `check:vendor-names` **616** files,
`check:imports`, `check:repo`, `check:page-shape`, `check:wrong-choice` 158
assertions, `check:metadata` 1,159 assertions), `check:claims` (**176** live · 3
NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (914 containers / 118 pages), `check:layout`
(128 pages), `check:forced-colors` (23 rules), `test:axe` (128 × 2, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (28 screens × 2).

**Said precisely.** `docs:build` and the three whole-tree browser gates
(`check:layout`, `check:scroll`, `test:axe`) plus `check:claims` were **re-run
after the last prose edit**, so they describe the committed tree and not an
earlier one. The second commit adds the recording and this file — **markdown
only** — and `docs:build` was re-run after writing this file, per
`ENVIRONMENT.md` §3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep
twice.** It caught that the slice said `4fbe1afe`'s diff was *"the whole of what
shipped that day"* when what is measured is that the **commit's** diff is three
files — other commits landed that day. And it caught `/concepts/scale` claiming
the probe's `~4.1 s` is *"the figure this page's guidance below now rests on"*,
which is false: that page's guidance below is a decisions table quoting no
milliseconds. Both were corrected before the commit.

## The open set is 33 — no P0

`roadmap_scope.py` reports **33 open / 84 closed** at `3d2816a2`, and the raw
checkbox count reads **33 open / 86 closed**. **The two disagree by design, not
by defect**: `roadmap_scope.py` excludes the 2 `[x]` items under the non-slice
`## STATE` headings and says so in its own output.

This wake closed `325.2` and filed `352.1` and `352.2` (32 → 33). **Re-run the
script at the commit** rather than quoting this.

- **cloud-takeable: 22** — `326.3`, `327.3`, `328.1`, `330.1`, `331.1`,
  `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`,
  `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`,
  `352.2`. **`326.3` is now the oldest of these.** `335.1` still carries its
  caveat — settling it may mean filing a throwaway Q&A discussion, an
  outward-facing write to a public repo whose permission has **not** been
  tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

22 + 10 + 1 = 33, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** The owner-blocked *classification* is carried
forward from the previous hand-off, which re-read each in the file; the seven
older-than-`326.3` ids were re-read in the file **this** wake, because rule 4
had to walk past them.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for an
EIGHTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 32 open items at dispatch. Rule 2 `Standardize 0 / 4`. Rule 3
`Objective 0 / 3` (spent by Slice 351). **Rule 4 matched.** Rules 5-8 not
reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days. No sample was recorded this wake (reasons above), so
it is unmoved.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **4,129 / 10,606 = 38.9%** at
`2caaa16f` (Step 0) with 20 eligible targets, **11** named by a still-open item
(236.2's report, read before concluding). Below every trigger the last sweeps
used: 252.1 dispatched the tenth at **55.1%**, 272.1 the eleventh at **56.7%**,
279.3 declined the twelfth at **40.6%**, `324.3` took the thirteenth at
**41.5%**. **It reads 40.0% at `3d2816a2`** — the closed-line count rose
**4,129 → 4,334** because Slice 325 crossed to the closed side, so the ratio
rose for a reason that is not regrowth. Still below every trigger above. **Re-run the
script at your commit**; no figure here describes your tree.

**`249.12` is named for a TWELFTH consecutive wake.** Twelve consecutive wakes
have now declined a sweep on the absence of a stated trigger. **Nothing is
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

**Trap 1 bit again.** The fetch reported a forced update `26447ba...2caaa16`,
and `git branch --show-current` answered **EMPTY** — the container *was*
detached. Fixed with `git checkout -B main origin/main`; the branch read `main`
afterwards. No `git stash` at any point. **`HEAD` equalled `origin/main` at
`2caaa16f`**, which is the previous wake's own tip, so no other dispatcher had
landed anything between the two wakes.

**Trap 2: the clone was shallow and this wake's verdict is a history search**, so
it was unshallowed before any figure was taken — **2,070** commits at `HEAD`, no
`shallow.lock`, and the unshallow again brought the tags (`git tag | wc -l` →
**8**, run rather than assumed). `polish_requeue.py --verify-stamps` therefore
had real history and printed nothing.

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

**And the loop-mechanics question is still THREE items deep** — `349.1`,
`350.1`, `351.1` — unchanged by this wake, which took a docs item. `349.1`
**reproduced again unprompted** on this wake's own recording (`Objective 1 / 3`
naming `[325]`, the slice closed, not `352`, the slice written); that is a third
independent occurrence and it still needs whoever owns `LOOPS.md`'s text, not a
wake.

**One thing this wake did that the owner may want to weigh.** Slice 352 removed
a published performance column from two docs pages. It is the outcome
`325.2`'s Accept asked for and the evidence is in the slice — but it is also
the framework's headline scaling number disappearing from a public page, which
is the kind of change an owner may want to see rendered before it sits on the
site. **The push carries it either way**; this is a flag, not a request.
