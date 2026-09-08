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
at hand-off. **No collision this wake** — `origin/main` read `0ab8a564` at Step 0
and `0ab8a564` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: RULE 3 IS SPENT AND RULE 4 IS THE NEXT DISPATCH

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   0 / 4 Continue rounds   ok
Objective     0 / 3 slices            ok      ← this wake spent it
Optimize      0 wake-date(s) newer    ok
```

Rules 1, 2, 3 and 5 are all clear, so **rule 4 matches**. Its oldest
cloud-takeable item is unchanged at **`325.2`** — *the published `Initial
render` column has no recoverable method*; its Accept accepts withdrawal as
readily as a definition, so it can close either way. **Re-run the script**; a
collision could land a row between this line and your wake.

**If you want the item this wake produced instead, it is `351.1`** — and it is
the youngest open item, so rule 4 will not reach it for a long time. That is
correct and is not a complaint.

## What landed: Slice 351 — the Objective grill of 324, 325, 347, 350

**Rule 3 dispatched this** at `Objective 4 / 3 OVERDUE [324, 325, 347, 350]`.
Scope was four of four, nothing dropped: no earlier grill names any of them
(`grep -hoE '^## Slice [0-9]+ — Objective grill of [^:—]*' ROADMAP.md
ROADMAP-archive.md`). `.roundtable/INDEX.md` read **4 repeated subject(s)**
across 200 files at dispatch; this grill adds no repeat.

**63 of 65 re-runnable assertions reproduce to the digit, a 64th in kind, and
every verdict in all four slices survives.** The full table is in
`.roundtable/grill-objective-324-325-347-350-2026-09-08.md`.

**The finding is a predicate, not a number.** Slice 350's base-rate probe windows
Standardize commits as `a..b`, and `b` is the sweep's own commit — so a sweep
that converts a dead style is classified *has lane input* on its own **output**.
Windowed on what the sweep could SEE (`a..b^`): **20 of 139 no-input (14.4%)**
against the published predicate's 15 of 139 (10.8%), disagreeing on **5** windows
(`15f9bbc1`, `91677655`, `cdd7c07e`, `0768f09f`, `161ede68`), two of them
discriminated by hand. `161ede68` is the window Slice 350 itself names in prose
as *"the sweep's own conversions"* — **the confound was seen in prose and left in
the command.** Filed as `351.1`.

**And `350.1`'s stability forecast is true of the commit and false of the wake.**
*"This commit does not move them (it touches no lane input)"* — but
`record_iteration.py` appends a row carrying the sweep's sha, which adds one
window, and that window is a **no-input** one precisely because the sweep touched
no lane input. Read at each revision rather than from the working tree:
`81f6281c` and `6996a39` both 138 / 14 / 13 / span 1994; `65de70c` — the same
wake's own recording commit — 139 / **15** / 13 / span 2008; HEAD the same. Both
findings are **amended into `350.1` per 236.2**, original text intact.

**Two smaller things carry no item, each for a stated reason.** `325.1`'s
`git grep measure:stress` census names **five of the six** paths that command
returns at `f4da2fe8` (the omitted one is a `.roundtable/` grill report — same
kind as the roadmap prose it does name, so the refusal is untouched). And
`324.3` cited two revisions correctly and **`67fc6659` no longer resolves** —
Step 0c's known shape, not an error in the slice; its figures all reproduce at
`3cb2381a` (closed 67→52, archive 714→730, open 26→26, headings 306→306, lines
8,188→6,476).

## This grill's own two instruments were wrong first, on schedule

Recorded because CLAUDE.md's base rate says so, and because one of them changed
an outcome:

1. **The sha census over-counted 5x on token shape.** Nine backticked hex tokens
   in `ROADMAP.md` do not resolve, which reads as nine dead revision citations.
   **Eight of the nine are blob digests or deliberately bogus red-proof values**
   (`1f69e677`, `4ee5ad51`, `99f7ac9f`, `ccdfb154`, `577cb919`, `deadbe01`,
   `deadbeef1`, a 32-char md5) — reading each one's context is what showed it.
   The real corpus is **one**, which is what turned that observation from a filed
   item into a refusal.
2. **The `absent` red-proof came back GREEN on its first run**, because the
   worktree it ran in had no `packages/core/dist` and `--verify-stamps` bails at
   *"api.json is missing"* before reading a stamp. The injection landed in the
   file and the gate never reached it. Re-run in the built tree it goes red
   exactly once, on exactly the injected row, with the unmodified control passing
   either side of it.

## No metric was recorded this wake, and here is the reason for each candidate

Two tracked names were measured and neither was recorded:

- **`dispatch-region-words` = 7,548** (lane 4 re-run). The newest sample is
  **7,492 on 2026-09-08**, and `dispatch_status.py` pairs by **distinct day**
  taking the last reading per day — so this wake falls in the **same day bucket**
  and recording would replace that day's value, not add a third day. `324.1`
  names this as the one live candidate to reopen rule 5 *if it gets a third day*;
  it cannot get one from a wake on 2026-09-08.
- **`claims` = 176** (`check:claims`). Identical to the 2026-09-07 reading, and
  nothing this wake touched the corpus, so it would add a zero-delta day-pair and
  no information.

`324.2`'s `bundle-gz-kb` convention (read the left-hand number off `check:size`,
never off a README) remains unspent — nothing this wake touched the bundle,
though `check:size` was run and reads **15.10** against the 16.7 kB gz budget.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, structurally rather than by judgement: the diff is `ROADMAP.md`, one
new `.roundtable/` report and this file. No CSS, no docs page, no component and
no script changed, so nothing rendered can move.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run green in this container** —
core `build` (incl. `lint:css`, `check:size` 139 payload files / 382.7 kB gz /
tightest headroom 110 bytes, `check:readme-facts`, `check:package` 185 files),
core `test` (165 passed), `lint:css`, `docs:build` (carrying `check:slice-refs`
**992** assertions / **375** citations / **333** slice numbers, `check:floor`
**594** files, `check:vendor-names` **616** files, `check:imports`,
`check:repo`), `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:scroll` (914 containers / 118 pages), `check:layout` (128 pages),
`check:forced-colors` (23 rules), `test:axe` (128 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app` (20 behaviours), `check -w create-ui`, `npm run suite` (28
screens × 2).

**Said precisely, because the wake landed in two commits.** All 17 were run green
on the tree of the FIRST commit (Slice 351). The second commit adds the recording
and this file — **markdown only**, and nothing in it can reach a browser gate.
What was re-run after it: **`docs:build`**, which is where all four gates that
read `.roundtable/**` and `ROADMAP.md` live, per `ENVIRONMENT.md` §3b. It was
also re-run mid-item, after three wordings were softened in the staged diff.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep
three times.** It caught that the assertion table's section headers said
"27 of 28" and "10 of 11" against tables holding 31 and 12 rows, so the
publishable total was wrong before it was written; it caught two claims stated
more strongly than the evidence (*"rebased away within a day"* — the rebase's
timing is not knowable from here — and *"349.1 reproducing for a second
consecutive wake"*, which is the SAME 2-of-4 arming set the previous hand-off
already measured, not a new occurrence); and it caught that `324.2`'s 98-byte
README lag only reproduces if you read `check-size.mjs:284`'s divisor as
**1024** — dividing by 1000 gives 15.46 kB and a 458-byte lag, and neither
number appears anywhere in the slice.

## The open set is 32 — no P0

`roadmap_scope.py` reports **32 open / 83 closed** at `0ad6e903`, and the raw
checkbox count reads **32 open / 85 closed**. **The two disagree by design, not
by defect**: `roadmap_scope.py` excludes the 2 `[x]` items under the non-slice
`## STATE` headings and says so in its own output.

This wake closed nothing and filed `351.1` (31 → 32). **Re-run the script at the
commit** rather than quoting this.

- **cloud-takeable: 21** — `325.2`, `326.3`, `327.3`, `328.1`, `330.1`,
  `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`.
  **`325.2` is still the oldest of these.** `335.1` still carries its caveat —
  settling it may mean filing a throwaway Q&A discussion, an outward-facing
  write to a public repo whose permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

21 + 10 + 1 = 32, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** Every decimal id above was checked this wake to
resolve to **exactly one open checkbox line** in `ROADMAP.md` (31 decimal ids
plus Slice 15's `AT runtime evidence`); the owner-blocked *classification* is
carried forward from the previous hand-off, which re-read each in the file.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
SEVENTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 31 open items at dispatch. Rule 2 `Standardize 0 / 4` (spent by Slice
350). **Rule 3 matched** at `Objective 4 / 3 OVERDUE [324, 325, 347, 350]`.
Rules 4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE`: **0** wake-dates newer than the newest pair, 8 of 47 names paired
across days. No sample was recorded this wake (reasons above), so it is unmoved.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **4,129 / 10,429 = 39.6%** at
`0ab8a564` (Step 0) with 20 eligible targets, 10 named by a still-open item
(236.2's report, read before concluding). It read **40.4%** one commit earlier at
`81f6281c` — the previous wake's own figure, and the drop is that wake's Slice
350 text landing under an open heading, exactly as it predicted. Below every
trigger the last sweeps used: 252.1 dispatched
the tenth at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 declined the
twelfth at **40.6%**, `324.3` took the thirteenth at **41.5%**. This wake's own
commits lower it further — it reads **38.9%** at `0ad6e903`, because every line
Slice 351 adds lands under an **open** heading. **Re-run the script at your
commit**; no figure here describes your tree.

**`249.12` is named for an ELEVENTH consecutive wake.** Eleven consecutive wakes
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

**Trap 1 bit, and was observed rather than run blind.** The fetch reported a
forced update `26447ba...0ab8a56`, and `git branch --show-current` answered
**EMPTY** — the container *was* detached. Fixed with
`git checkout -B main origin/main`; the branch read `main` afterwards. No
`git stash` at any point. **`HEAD` equalled `origin/main` at `0ab8a564`, which is
the previous wake's own tip**, so no other dispatcher had landed anything between
the two wakes.

**Trap 1's OTHER half bit too, exactly as `ENVIRONMENT.md` §1 predicts.** The
pre-commit check was typed as `git rev-parse --short origin/main HEAD` and exited
**128** with `fatal: Needed a single revision` — which §1 says happens on every
container, `main` present or not, and which is why the file tells you to drop
`--short`. `git rev-parse origin/main HEAD` answered both shas immediately.

**Trap 2: the clone was shallow and this wake's finding is a history
measurement** (a base rate over 139 commit windows, taken twice under two
predicates), so it was unshallowed before any figure was taken — **2,068**
commits, no `shallow.lock`, and the unshallow again brought the tags
(`git tag | wc -l` → **8**, run rather than assumed). `polish_requeue.py
--verify-stamps` therefore had real history and printed nothing.

**One `git worktree` WAS used this wake**, at `81f6281c`, because
`roadmap_scope.py` and `report_loop_prose.py` read the working tree and the
figures being checked describe that revision. It was removed with
`git worktree remove --force` + `git worktree prune` before the first commit;
`git status` was clean before each commit. **It is also where the `absent`
red-proof first came back green** — the worktree has no `packages/core/dist`, so
the gate bailed before reading a stamp. A worktree is not a built tree.

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

**And the loop-mechanics question is now THREE items deep**, which is worth the
owner knowing even though none of them needs them: `349.1` (should rule 3 count
slices *closed* or slices *touched*?), `350.1` (should rule 2's counter know
whether its first three lanes have anything to read?) and now `351.1` (which
window should `350.1`'s base rate be measured over?). They nest: `351.1` decides
the number `350.1` is decided on, and both sit under the same gap `349.1` names
— **a dispatcher counter whose unit is *rounds* while the work it dispatches is
measured on *artefacts***. All three are answerable by whoever owns `LOOPS.md`'s
text, and a wake taking one should say why it is not taking the others.
