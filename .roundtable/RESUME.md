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
at hand-off. **No collision this wake** — `origin/main` read `fd17c682` at Step
0 and `fd17c682` again immediately before the first commit.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against this file, and the report was read
rather than left for the next wake.** It names **10** closed ids (`355.1`,
`355.2`, `355.3`, `354.1`, `327.3`, `273.1`, `310.1`, `324.3`, `297.1`,
**`328.1`**) and **3** absent from `ROADMAP.md` entirely (`192.1`, `274.1`,
`312.2`, all archived). The check says outright it cannot tell a stale claim
from a historical reference. **All thirteen are historical here** — `328.1` is
the item this wake CLOSED and is named as closed throughout; the rest are cited
as precedent. **None is claimed open, blocked or queued**, so there is no stale
blocked-set for rule 4 to read.

## ⚠ RULE 2 IS NOW OVERDUE. STANDARDIZE IS THE NEXT DISPATCH

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     1 / 3 slices  [356]     ok
Optimize      0 wake-date(s) newer    ok
```

Rule 1 has no open P0, so **rule 2 matches and fires**: this wake's Continue
round was the fourth. **Re-run the script** — a collision could land a row
between this line and your wake — but expect Standardize, not rule 4.

**Standardize has FOUR lanes and four consecutive sweeps ran three** (LOOPS.md
§3 says so in its own text). Say `n of 4` in the write-up. Lane 4 is the
roadmap-regrowth lane, and it is the one with something to say this wake — see
the archive-share block below. Lane 1 (`scan:dead-style`) **needs
`CHROME_PATH` exported in the same command** in this container
(`ENVIRONMENT.md` §1c); it is the lane that has died on that before.

## What landed: Slice 356 — `328.1` answered and closed as NOT-A-PATTERN

**Rule 4 dispatched this** with rules 1-3 clear. `328.1` was the oldest
still-open item no other kind of block covers, unchanged across three hand-offs.

**The count its Accept asked for is 1, which is its own stated satisfying
branch** — so it closes, and no gate is added. Population **160** committed
script files (`apps/docs/scripts` 78, `packages/core/scripts` 32, `scripts` 12,
`examples` 38); **8** carry a Demo-family signal on a non-comment line; **1**
uses one to answer *"does this page show a result"*.

```
git ls-files 'apps/docs/scripts/*.mjs' 'packages/core/scripts/*.mjs' \
    'scripts/**' 'examples/**/*.mjs' | grep -cE '\.(mjs|js|py)$'
```

**Measuring the survivor is why this is a slice and not a one-line tick.**
`check-learning-path.mjs`'s pass message quoted the **24**-page population for a
check that judges **3**: only a page carrying `.demo-pair__preview` is judged,
the other **21** are exempt, and **21 of 21** of those render `bo-*` markup
anyway. That is `328.1`'s own defect in the one instrument `328.1` leaves
standing, pointing the *opposite* way from the figure that filed it — *"1 of 18
learning-path pages shows anything working"* under-reported from a Demo-shaped
signal; this over-reported from the same one.

- **The reconciliation is that two independently written instruments agree.**
  The gate reads built HTML as a string; the probe read the DOM at 1440px after
  `networkidle0` + 2 rAF. Both say **3 / 21 / 24**.
- **Red-proved by injection**, with the injection itself checked first
  (CLAUDE.md: a green red-proof is a defect in the injection until proven
  otherwise): one `<div class="demo-pair__preview">` into
  `dist/concepts/tokens/index.html` after its first `<section class="demo">`
  opening tag, asserted **not inside an HTML comment**, the page asserted
  preview-free beforehand, and exactly **1** occurrence after. The gate moved
  **3 → 4** judged / **21 → 20** exempt, and back on restore.
- **Widening the check is REFUSED on the base rate from the same probe.**
  *"Renders `bo-*` outside a `<pre>`"* is true of **24 of 24** pages — uniformly
  true of the tree, so it distinguishes nothing (94.11). The **message**
  changed; the detector did not, and its `--self-test`'s 3 cases pass unchanged.
- **`dist-pages.mjs` is the near-miss worth knowing about**, and the reason the
  count is 1 rather than 2: `demoRegion()` anchors on `<section class="demo">`
  and then **strips `<pre>`**, with both dead detectors recorded in its header.

**One wording fix was made by the adversarial re-read, before the commit.** The
new message first said the judged pages *"show it before their code"*. The
condition also admits a page with a preview and **no code block at all**, which
would pass vacuously — so it now reads *"none of those opens with code before
it"*, with the file's comment naming that all 3 today do carry a `<pre>` and
that this is a reading of today's tree, not a property of the check.

## The blocked-set classification was VERIFIED, not carried

`249.12` is the item that has held the archive sweep for fifteen wakes, and the
previous hand-off filed it owner-blocked. **Re-read this wake rather than
trusted:** its own text says **"OWNER OR ARCHITECTURE CALL — low urgency, the
sweep keeps happening regardless."** The classification is correct.

## ⚠ The archive sweep: the share has risen for a FOURTH consecutive wake

Measured, not carried. `roadmap_scope.py` read **5,078 / 11,423 = 44.5%** at
`fd17c682` (Step 0). **At `78e96150` it reads `5,307 / 11,564 = 45.9%` with 27
targets, 13 named by a still-open item** — Slice 356 landing closed, not
regrowth.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, and `324.3` *took* the thirteenth at **41.5%**. **45.9% is
4.4pp above the last taken sweep**, above every declined reading on record, and
has now risen on four consecutive wakes (41.1 → 43.9 → 44.5 → 45.9).

**Not dispatched by this wake, and the reason is scope, not the number**: rule 4
had already dispatched `328.1`, and a sweep is a hand-checked bulk edit one
slice at a time (CLAUDE.md). **It is a live candidate for the next wake** — and
next wake is a Standardize, whose **lane 4 is exactly this signal**, so the two
coincide for the first time in this streak. `249.12` is named for a
**SIXTEENTH** consecutive wake.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is **`ROADMAP.md` plus one docs gate
script** (`check-learning-path.mjs`) and the recorder's own files. No `.astro`,
no CSS, no built page content changed — `docs:build` ran green on the same
**128** pages as the previous wake, and the only changed build output is that
gate's own stdout line.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**,
which is the first hand-off in several able to say that rather than name a
judged-irrelevant subset. In `ENVIRONMENT.md`'s own order: core `build` (incl.
`lint:css`, `check:size` **139** files / **382.7 kB** gz, `check:readme-facts`,
`check:package` **185** files), core `test` (**165** passed), `lint:css`,
`docs:build` (carrying `check:slice-refs` **1,001** assertions / **379**
citations / **338** slice numbers, `check:floor` **595** files,
`check:vendor-names` **616**, `check:imports` **350**, `check:selftests` 55
gates / 21 heuristic / **172** cases, `check:page-shape`, `check:wrong-choice`
**158**, `check:metadata` **1,159**), `check:claims` (**176** live · 3 NOT
VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (**914** containers / 118 pages),
`check:layout` (**128** pages), `check:forced-colors`, `test:axe` (128 × 2, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit, and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially,
every number re-checked against the command that produced it. **It earned its
keep once** — it caught the vacuous-pass wording described above, which is a
claim the code does not make, inside a slice about a message that claimed more
than its check measured.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous wake.
  Nothing this wake touched the claim corpus.
- **`dispatch-region-words`** — not sampled. `353.2` is open about exactly this
  name, and `LOOPS.md` is **byte-for-byte unchanged** this wake, so the value
  has not moved.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139** payload files / **382.7 kB** gz, tightest headroom 110 bytes,
  unchanged.

## The open set is 31 — no P0

`roadmap_scope.py` reports **31 open** at `78e96150`, and the raw checkbox count
reads **31 open / 95 closed**. `roadmap_scope.py` excludes the 2 `[x]` items
under the non-slice `## STATE` headings and says so in its own output.

This wake closed `328.1` and filed Slice 356 with one item of its own, closed in
the same commit, so the open set moved 32 → **31**. **Re-run the script at the
commit** rather than quoting this.

- **cloud-takeable: 20** — `330.1`, `331.1`, `332.1`, `333.1`, `334.1`,
  `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`,
  `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`330.1` is now the oldest of these**, so it is rule 4's item whenever rule 4
  is next reached — but rule 2 preempts next wake. `335.1` still carries its
  caveat — settling it may mean filing a throwaway Q&A discussion, an
  outward-facing write to a public repo whose permission has **not** been
  tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`
  (**verified this wake — see above**), `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
TWENTY-SECOND consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 32 open items at dispatch. Rule 2 `Standardize 3 / 4 ok` **at dispatch**
(it is 4 / 4 OVERDUE only *after* this wake's recording — that is the sequence,
not a contradiction). Rule 3 `Objective 0 / 3 ok`. **Rule 4 matched and
dispatched `328.1`.** Rules 5-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days. No sample was recorded this wake (reasons above), so
it is unmoved.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d, whose
third rule was written by the previous wake after that fabrication cost it 20
minutes):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `fd17c68` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.
The documented `rev-parse --short` failure was avoided by using the
two-argument form without `--short` from the start.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any
figure was taken** — **2,079** commits at `HEAD`, no `shallow.lock`, and the
unshallow again brought the tags (`git tag | wc -l` → **8**, run rather than
assumed). No figure this wake is a history measurement, so the unshallow was
precautionary rather than load-bearing — said plainly, because the previous
hand-off could say the opposite and the distinction is the point of §2.

**No `git worktree` and no `git stash` were used this wake.** Every figure
describes either `fd17c682` (the Step 0 tip) or `78e96150` (the commit), and
says which.

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

**A third is now worth naming: `249.12`.** It is the stated-trigger question for
the archive sweep, it is explicitly an **OWNER OR ARCHITECTURE CALL**, and the
share it governs has risen four wakes running to **4.4pp above the last sweep
anyone actually took**. Sixteen consecutive wakes have declined a sweep for want
of the trigger this item would supply. It is filed *low urgency* on the grounds
that "the sweep keeps happening regardless" — that premise is what has weakened.

**The loop-mechanics question is still FOUR items deep** — `341.1`, `349.1`,
`350.1`, `351.1` — plus `353.2`. This wake answered none and added none; Slice
356 closed `328.1` and filed one item of its own. `349.1` did **not** reproduce
this wake, because rule 3 never armed — the first wake in several where it had
no occasion to.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is
`ROADMAP.md`, one docs gate script, and `.roundtable/**`. `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged** —
deliberately: Slice 356 refuses a gate on the measured base rate and changes a
report instead.
