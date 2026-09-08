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
at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## What landed: `324.2` closed — and the item's own headline was refuted

**Rule 4 dispatched this** on `324.2`, the oldest still-open item that is
neither owner-blocked nor screenshot-blocked. It asked what `bundle-gz-kb`
actually means and whether a gzip series can support a rule-5 verdict against a
0.3 kB cross-environment floor.

**The measure-first step ran first and killed the item's own shrink branch.**
It had written itself an exit — *"a series taken entirely at one offset has no
cross-environment problem at all"*. Blame says otherwise: the 11 samples are
**9 at `+0800` and 2 at `+0000`**, so the series really is cross-environment
and had to be answered rather than shrunk.

**The headline premise does not reproduce under any pairing.** *"Its noise
floor is wider than three of its four historical moves."* Rule 5 pairs the last
reading of each distinct day, so the four moves it reads are **+2.4, +1.2,
+0.9, +3.4 kB — 3.0x, 4.0x, 8.0x and 11.3x the 0.3 kB band, 0 of 4 below it.**
The two readings that *are* mostly sub-band (sample-to-sample 5 of 10,
within-day 5 of 6) are moves rule 5 never reads. **The band has never been the
binding constraint**, which is the opposite of what the item assumed.

**Cross-environment gzip drift measured for the first time, and it is under
0.1 kB.** The repo has asserted this drift since one real CI failure on
2026-08-16 and never measured its size, so "the 0.3 kB cross-environment floor"
was a chosen band being read back as a measurement. Tree `a9403f42` was stamped
`92 kB minified (15.0 kB gzipped)` by a `+0800` wake; the same source rebuilt
here (`+0000`, node 22.22.2, zlib 1.3.1) gives **93,785 minified bytes** and
**15,334 gzip bytes = 14.975 kB**, printing the same `15.0`. **The minifier is
not a confound** — all six CSS toolchain packages are version-identical to that
commit's own lockfile (cssnano 7.1.9, postcss 8.5.26, +4), compared one by one
— so gzip is the only variable. **Stated as a bound at n = 1**, because only
the rounded stamp survives: `|drift| < 0.1 kB`, under a third of the band. Not
"drift is zero".

**A second finding answers the half of the Accept that had no obvious answer —
WHICH ARTIFACT.** Two published figures for this exact quantity disagree right
now: `check:size` prints `15.10`, both READMEs publish `15.0`. Neither is
wrong — `stamp-readme.mjs` keeps an in-tolerance string rather than re-stamping,
so a rebuild elsewhere makes no no-op diff — but **the README lags the artifact
by up to the full band, and lags it by 98 bytes today.** A wake recording the
README's number would record a stale sample with no way to tell.

**Verdict: both of the Accept's escape hatches are REFUSED on the
measurement** — the name is not retired and is not re-pointed at the
deterministic minified byte count. It is not noise-limited; what it lacks is a
**denominator**, which `324.1` settled last wake, and the size question is
answered by `check:size`'s 16.7 kB budget printing its tightest headroom in
bytes every run.

## Where it is written, and the one place it deliberately is NOT

`record_metric.py`'s docstring — the file a wake recording a sample opens,
which is exactly what the Accept names. **`dispatch_status.py` was deliberately
not extended**: `326.3` is open on the dispatch region's growth (+1,101 words
in two days), 324.1's note already stands there, and a second copy would grow
the region this loop is currently worried about to serve a reader who is not
recording anything.

## No metric was recorded this wake, and that is deliberate

`324.2` says outright *"do not record a sample to un-STALE the line before the
convention is written down"*, and *"do not re-baseline the existing 11
samples"*. Both were honoured. The convention is now written down, so the NEXT
wake that records a `bundle-gz-kb` sample may do so — reading the left-hand
number off `check:size`, never off a README.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** **None
are owed**, structurally rather than by judgement: the diff is `ROADMAP.md`,
`scripts/loops/record_metric.py` (a docstring only — no executable line
changed) and this file. No CSS, no docs page and no component changed, so
nothing rendered can move. `record_metric.py` is a CLI, not a build step and
not a gate.

**Slice 345's two visual debts are still owed and unspent:**
`/patterns/output-form` **in print** (the figure, the barcode quiet zone), and
the RF tile grid on `/patterns/rf/rf-landing-rf/` at both widths. **The six older
ones are unchanged:** `292.4/292.5`'s screenshot lane on `/components/icon`; the
withdrawn-claim paragraph and Slice 325's performance paragraph on
`/components/data-table`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run green in this container** —
core `build` (incl. `lint:css`, `check:size`, `check:readme-facts`,
`check:package`), core `test` (165 tests, 29 files), `docs:build` (carrying
`check:slice-refs` **988** assertions / **375** citations, `check:floor`,
`check:vendor-names` 614 files / 7 denied names, `check:imports`,
`check:loop-vocab`, `check:selftests`, `check:repo`), `check:claims` (**176**
live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a
regression), `check:formatting`, `check:scroll`, `check:layout` (128 pages),
`check:forced-colors`, `test:axe` (128 × 2, zero violations),
`check:target-size`, `check:search`, `check:pseudo`, `check:quickstart`,
`check:po-app`, `check -w create-ui`, `npm run suite`. **`docs:build` was
re-run after this file was written**, per `ENVIRONMENT.md` §3b.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand — the staged diff re-read adversarially.
What it caught: an earlier draft of the docstring called the 0.1 kB reading a
*measurement of the drift*; only the rounded stamp survives on the other side,
so it is a **bound at n = 1** and is now written that way in all three places.
It also caught that the minifier had to be ruled out explicitly — the stamp's
`92 kB` agrees only at 1 kB resolution, which would have left ±512 bytes of
confound — so all six toolchain versions were compared against that commit's
own lockfile rather than assumed.

**CLAUDE.md's injection rule bit for real, on the smallest possible check.**
The claim *"no executable line of `record_metric.py` changed"* was proved by
stripping the module docstring, AST-round-tripping the rest and comparing
hashes — and the first discrimination control came back **False**, i.e. a real
body mutation was reported as no change. That was not a bad comparator: the
control's `.replace()` needle did not occur in the file, so **the injection
never landed**, exactly the failure this repo's rule predicts. Re-run with the
substitution asserted (needle count == 1, replacement present), the check
discriminates both ways: a `type=float` → `type=str` change **is** detected, a
docstring-only edit is **not**, and the two body hashes are equal. The claim is
proved rather than asserted.

## The open set is 29 — no P0, and 18 are cloud-takeable

`roadmap_scope.py` reports **29 open / 82 closed**, and the raw checkbox count
agrees. This wake closed `324.2`, so open moved 30 → 29 and closed 81 → 82, and
Slice 324 leaves the OPEN set entirely. **Re-run the script** rather than
quoting this.

- **cloud-takeable: 18** — `325.1`, `325.2`, `326.3`, `327.3`, `328.1`,
  `330.1`, `331.1`, `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`,
  `338.1`, `339.2`, `341.1`, `345.1`, `346.1`.
  **`325.1` is now the oldest of these**, and is what rule 4 reaches for next:
  *a docs page can name an `npm run` command and nothing checks it exists.*
  `335.1` still carries its caveat — settling it may mean filing a throwaway
  Q&A discussion, an outward-facing write to a public repo whose permission has
  **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text: still waiting on `249.10`), `249.10`, `249.11`,
  `249.12`, `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

18 + 10 + 1 = 29, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** Every owner-blocked item above was re-checked **in
the file** this wake, not carried from the previous hand-off — `249.7` was read
in full, because it is the one whose heading does not say "OWNER CALL".

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
FOURTEENTH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**.
Rule 2 `Standardize 2 / 4 ok` did not match. Rule 3 `Objective 2 / 3 ok
[324, 347]` did not match. **Rule 4 matched** on `324.2`. Rules 5-8 not reached.

**Rule 3 did not move this wake, and the reason is worth knowing rather than
re-deriving:** Slice **324 was already in its armed set** from last wake's
`324.1`, so closing `324.2` adds no new slice number. The counter is still one
NEW slice away from arming the Objective grill — closing anything in a slice
other than 324 or 347 does it, and rule 3 sits above rule 4.

**Rule 5 was not reached and would not have fired.** Its line reads `ok`, and
this wake is why that is now checkable for the one name it could act on: every
day-pair move `bundle-gz-kb` has ever made clears the band by 3x or more, so
the rule's input is legible; what makes the verdict wrong is the missing
denominator, recorded in `324.1`.

## The archive sweep was evaluated this wake and declined on the measured trigger

`roadmap_scope.py` reported closed-history share **38.7%** at Step 0 (`5420f85`),
below every trigger the last sweeps actually used — 252.1 dispatched the tenth
at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 declined the twelfth at
**40.6%**, and `324.3` took the thirteenth at **41.5%**. This commit adds lines
to a now-closed slice, so the share rises slightly; **re-run the script at the
commit** rather than inferring it from here.

**`249.12` is named for an EIGHTH consecutive wake.** Eight consecutive wakes
have now declined an archive sweep on the absence of a stated trigger. The item
is filed as low urgency because *"the sweep keeps happening regardless"* —
`324.3` did run one last wake, which is the first time in eight that sentence
has been true. **Nothing is proposed here.**

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d, which cost a wake 20 minutes
two wakes ago):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1: the fetch reported a forced update `26447ba...5420f85`**, so the local
ref was not merely behind. `git checkout -B main origin/main` was run in the
same command, and `git branch --show-current` read `main` afterwards — **said
precisely: this wake did not observe whether the container started detached,
because it ran the fix unconditionally.** No `git stash` at any point.

**Trap 2 was exercised deliberately, not by a crash:** this item's Accept
*requires* a history measurement (the blame census of `loop-metrics.jsonl`), so
the clone was unshallowed before any figure was taken — **2,060 commits**, no
`shallow.lock`, and the unshallow again brought the tags (`git tag | wc -l` →
**8**, run rather than assumed). `polish_requeue.py --verify-stamps` therefore
had real history this wake and `347.1`'s new `absent` verdict was not exercised.

**A `git worktree` was used and removed.** The cross-environment rebuild needed
tree `a9403f42` built in isolation; it was added detached under the scratchpad
with `node_modules` symlinked, and removed with `git worktree remove --force`.
`git worktree list` reads one entry and the tree was clean before the first
commit — checked, because a stray worktree would have been committed noise.

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
