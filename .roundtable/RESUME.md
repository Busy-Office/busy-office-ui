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

Last updated 2026-09-07 (**cloud** wake, scheduled routine). Working tree clean
at hand-off. **One iteration recorded**: `Objective · grill` (outcome `logged`,
two refusals) and **no metric** — see rule 5 below. The work landed as
**`49467ad5`** and **`86f034ce`**, followed by this hand-off's own commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

Every figure below was taken at **`86f034ce`**, the second slice commit — **not**
the working tree and **not** `HEAD` once this hand-off commits, which is
`ENVIRONMENT.md`'s figure rule.

## THIS WAKE COLLIDED, AND IT IS A KIND STEP 0c HAD NOT SEEN

The pre-commit fetch returned `6a009a4b..9c7bac19`. **The other dispatcher ran
rule 4 (`297.1`) while this one ran rule 3 (the grill)** — the first collision
where the two ran DIFFERENT rules, so nothing was duplicated and nothing was
discarded. They contended only for the slice **number**: both wrote
`## Slice 335`. This wake renumbered to **336**, rebased (one `ROADMAP.md`
conflict, both hunks kept, ordered 336 / 335 / 334) and landed intact.

**Recorded in `LOOPS.md` Step 0c as collision 4**, count moved three → four per
that section's own instruction to count by re-reading the record. Also recorded
there: the renumber's one failure mode — a blind `sed 's/335/336/g'` rewrites
the live arithmetic `396 − 61 = 335` elsewhere in `ROADMAP.md`, so scope the
replace to `335\.` plus the heading and count hits before and after.

**Their Slice 335 is worth reading before dispatching**: it closed `297.1` and
opened its own `335.1`, so the open set moved in two places this wake, not one.

## The counters after recording — RULE 3 IS SPENT, RULE 2 IS ONE ROUND OFF

```
Standardize   3 / 4 Continue rounds   since 2026-09-07 22:24   ok
Objective     0 / 3 slices            since 2026-09-07 19:07   ok
Optimize      1 wake-date(s) newer    since 2026-09-07 12:59   STALE
```

**Re-read `dispatch_status.py` rather than trusting this block.** It is read
AFTER recording, which is `LOOPS.md`'s own instruction and the thing that has
caught two of the five parser recurrences. Two dispatchers share this queue and
one of them landed inside this wake, so a block written here is a snapshot with
a known-live competitor.

## What landed: Slice 336, the grill of 315, 332, 333

`377/3` for the slice (`ROADMAP.md` + the report), then `+13/−2` `ROADMAP.md`
and `+21/−1` `LOOPS.md` for the collision record.

**29 published assertions re-run; 26 reproduce exactly.** Including every line
number in 315.1 (`219`, `293` at `066d9878^`), all six of 315.2's hex spellings
(`142, 142, 123, 141, 114, 134`), all three of 332's lane figures to the digit,
and 333's built-page identity (md5 `f8886e3e9ee20f6464ae9545cd44d7aa`, **87,802**
bytes, **139** pages) — still matching **three** commits later.

**The three defects share one mechanism**, and it is a sharper reading of
192.1's *"the defect lands in what shipped BESIDE the number"*: in none of them
is the measurement wrong — each is a faithful reading of a **different
population or quantity than the noun beside it names**, and in all three the
conclusion is unaffected, which is why review passed them.

| | the noun | what was counted | fix |
|---|---|---|---|
| A | "top-level **sections**" | `^#` headings, incl. the H1 title — **17**, not 18 | amended in `332.1`, which is OPEN and audits *each section* |
| B | "the **10** flagged pages" | the corpus half of a corpus-∪-family definition — the union is **15** | amended in 332's lane 3; the lane is genuinely clean, only the population was misstated |
| C | "**1.38 s** for twenty child processes" | superseded **by its own commit** — `ac4a9a0f` wrote both it and Slice 334's `1355/1295/1300 ms` + `1.23 s`, 2,200 file-lines apart | amended in 315.3's DONE bullet |

All three corrected in place (336.1), which is 315.2's own precedent. **No gate
for any of them** — *"the noun matches the population"* is semantic, 94.11's
wall. **336.2** files the one general question: should `report:prose` print the
flagged UNION, since that is what its lane is defined on and the report never
prints it? Its Accept makes **refusing satisfying** and asks for the two-sweep
base rate re-measured at that revision.

**Recorded, not filed:** 333's *"alone among the page's sections"* — **4 of 8**
sections carry no `<pre>`. True of the four demo sections, false as written.

**Two numbers in this wake's OWN diff were asserted rather than measured, and
the by-hand verifier pass caught both before the commit** — "two commits later"
(it is three, `git rev-list --count 422601c4..HEAD`) and "twelve hundred lines
apart" (it is 2,200: lines 411/414 against 2611 in `ac4a9a0f`'s own
`ROADMAP.md`). A grill about unmeasured numbers beside correct ones produced two
of its own. A fifth data point for `327.3`: the practice works when it is
executed.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.**
**None are owed by this slice**, and that is structural rather than measured:
the diff is `ROADMAP.md` prose, `LOOPS.md` prose and one `.roundtable/` report.
No `.astro`, no `.css`, no docs page, no generated artefact under `dist/`.

**The visual debts carried forward are unchanged and unspent** — a local wake
should glance at all six: `292.4/292.5`'s screenshot lane on `/components/icon`;
the withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons (`/prod/production-orders`,
`/prod/capacity`, `/prod/bom`).

**Gates green:** all **17** CI-runnable entry points were run on the pre-commit
tree — core `build`, core `test`, `lint:css`, `docs:build`, `check:claims`
(**170** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (914 containers / 118
pages × 2), `check:layout` (**128** pages), `check:forced-colors`, `test:axe`
(**128 × 2**, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app`, `check -w create-ui`,
`npm run suite`. **`docs:build` was then re-run twice more** — once after the
`LOOPS.md`/`ROADMAP.md` collision edit (`check:loop-vocab` and
`check:slice-refs` are the gates that read them: 968 assertions, 318 slice
numbers) and once after this file was written, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially. It
found the two unmeasured numbers above, plus a table row marked ✓ that the
prose counted as a defect (the 26-of-29 tally did not reconcile with its own
table until row 13 was re-marked ✗), and a union claim about Slice 326 that
rested on set equality this wake had not measured — narrowed to the one page
326's entry names.

## Rule 5 was evaluable at dispatch and is STALE at hand-off, because of the collision

At Step 0b it read `0 wake-date(s) newer — ok`, and was **evaluated**: the
comparable set's only mover is `claims`, already day-paired
`2026-09-06 169 → 2026-09-07 170`. This wake's `check:claims` read **170** again
on the same day, so a second sample moves nothing; `axe-violations` reads
`NEVER MOVED` and cannot fire the rule either way. **No metric recorded, on
purpose.**

After recording it reads **STALE, 1 wake-date newer** — the other dispatcher's
row carries a `+0800` stamp of `2026-09-08 03:00`. **This is NOT the SKEW case
306.1 added, checked rather than assumed**: `skew_split` asks whether a row is
newer than the metric by more than the 8h envelope, and 03:00 `+0800` is
19:00 UTC against a 12:59 metric — 6h in truth, still genuinely newer. A whole
wake landed with no metric. So rule 5's input is honestly stale, not
mis-classified, and the next wake should say so or record one.

**`polish_requeue.py` was not run in `--apply` mode** — §3b step 0 is owed only
once rule 6 is reached, and rules 3 then 4 matched first.

## The open set is 30 — no P0, and 19 are cloud-takeable

`roadmap_scope.py` at `86f034ce` reports **30 open / 67 closed**, OPEN slices
`[15, 112, 249, 273, 296, 316, 319, 320, 322, 323, 324, 325, 326, 327, 328, 330,
331, 332, 333, 334, 335, 336]`. **Slice 297 left the OPEN list** (the other
dispatcher closed `297.1`); 335 and 336 entered. The raw counts reconcile:
`grep -c` reads 30 open / **69** closed, and 69 = 67 attributed + the 2 `[x]`
under the non-slice `## STATE` heading.

**Enumerated, not carried from the last hand-off** — every entry re-derived from
its own item text this wake:

- **cloud-takeable: 19** — `316.1`, `319.3`, `320.2`, `322.3`, `323.1`, `324.1`,
  `324.2`, `325.1`, `325.2`, `326.3`, `327.3`, `328.1`, `330.1`, `331.1`,
  `332.1`, `333.1`, `334.1`, `335.1`, `336.2`. **`316.1` is the oldest of
  these** and is what rule 4 reaches for next.
  **`335.1` carries a caveat rather than a clean lane**: its own text says
  filing a throwaway Q&A discussion to exercise the route is explicitly
  allowed, which would settle it — but that is an outward-facing write to a
  public repo, and whether this session's token can create one has **not been
  tested**. Read it before treating it as takeable.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` ("BLOCKED ON OWNER BRIEFS"), `112.4` (blocked on 112.3's verdict),
  `249.7` (first Accept clause executed; the rest holds for `249.10`, owner
  vocabulary), `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (`OWNER CALL` in
  its own heading), `296.3`.
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

19 + 10 + 1 = 30, asserted rather than left to the reader.

**The fifth kind of blocked, `artifact-lost`, is still worth carrying** — an
item whose Accept says *re-measure* names an artifact, and the artifact either
resolves or it does not. Nothing in the current open set is of that kind,
checked rather than assumed.

## The archive sweep is NOT due, and the two halves disagree for the EIGHTH wake

Measured at **`86f034ce`**: **8,208 lines**, closed-history share **30.7%**
(2,519 lines across 10 closed slices). The standing trigger is *past 5,450 lines
**and/or** 40.6%*: lines are past, **share is not**. That is precisely the
AND-vs-OR case `249.12` is open on, and it decides something here — under AND,
no sweep. **Eighth consecutive wake where the two halves disagree.**

The share held flat at 30.7% (30.7 → 30.7) rather than rising: two slices closed
into the numerator (315 was already there; 297 joined) while the denominator
grew by two wakes' entries at once. A wake reaching for a sweep should read
`roadmap_scope.py`'s pin line first — **9 targets are named by a still-open
item**, and `297` is now among the eligible targets.

Trend across forty readings: 27.5% → 32.0% → 34.2% → 38.0% → 39.4% → 37.5% →
36.9% → 36.2% → 35.5% → 37.3% → 36.9% → 38.3% → 37.6% → 9.4% → 10.3% → 10.9% →
11.8% → 26.0% → 26.9% → 30.5% → 29.5% → 28.9% → 31.2% → 35.3% → 34.7% → 36.4%
→ 38.1% → 40.3% → 39.4% → 39.9% → 41.5% → 24.6% → 28.2% → 27.4% → 26.9% →
26.4% → 27.8% → 29.5% → 30.7% → **30.7%**.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. The red-proof `ENVIRONMENT.md` §8 owes is now the
subject of an open item — their `335.1` — rather than a standing footnote.

**Issue #2's `updated_at` has not moved for a fourth consecutive hand-off.**
See Direction.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING

`main` was green at the start of this wake. Read the runs after your push; one
`actions/runs?branch=main` read costs nothing and is the only thing standing
between a red `main` and the next wake. **This push carries two wakes' commits
into one CI run** — the collision's winner is already on `main`, so a red run
is not automatically this wake's.

## Step 0 traps

Trap 1 bit again — the fetch reported a forced update `26447ba...6a009a4` and
the container started detached; fixed with `git checkout -B main origin/main`
before any commit. Trap 2 was clean in one `--unshallow` (**2,028** commits, no
`shallow.lock`) and again brought the tags: `git tag | wc -l` → **8**, which is
§2's mandated count rather than an assumption either way. **Trap 6 bit hard and
cost real turns** — background waiters read as *"completed with no output"*
while still running, and the container clock is what settled it: four
consecutive polls advanced wall time by 5-11 seconds each. The fix that worked
is a FOREGROUND `timeout 900 bash -c 'while ! grep -q "exited with code" …; do
sleep 10; done'`, which blocks the tool call itself instead of returning
instantly. No `git stash` was used at any point.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Two things want the owner's attention:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at, which strengthens their report
   rather than weakening it. **Replying and closing the issue is a thirty-second
   owner action.** The question of whether a *wake* should post that comment was
   `297.1`, which the colliding wake **closed** — read its Slice 335 for what it
   concluded before re-raising it.
2. **`273.2` is still worth their attention**, a thirty-second call untouched —
   whether a Polish round whose score does not move should increment `dry`. Not
   touched this wake; rule 6 was never reached.

**`249.12` stays a live question and is sharper for the eighth time** — an
eighth consecutive wake where the two halves of the archival trigger DISAGREE.
The share stopped rising this wake (30.7 → 30.7), so the three-wake climb toward
the threshold is not yet a trend.

**What the next wake should reach for:** rule 3 is spent (`0 / 3`) and rule 2 is
at `3 / 4`, so unless a Continue round lands first, **rule 4** takes the oldest
genuinely dispatchable item — **`316.1`**, a gate question about a theme token
in a `@media print` colour, cloud-takeable and needing no browser.
