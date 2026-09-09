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
at hand-off apart from this file, `loop-log.md` and `STATUS.md`. **No collision
this wake** — `origin/main` read `0edfc35e` at Step 0 and `0edfc35e` again at the
mandated pre-commit fetch, and it was already the local tip.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. It
was therefore **re-run against this file as it now stands**, which is what the
line above asks of you too: **2** archived ids (`94.11`, `312.2`, both *rules*
cited by number) and **9** `[x]` closed ids. Every one is named as history or as
precedent, never as open work: `337.1` (closed by THIS wake and named as exactly
that), `336.2` and `334.1` (the two previous wakes'), `355.3` and `359.4`
(precedent for the parser refusal), `297.1` and `324.3` (precedent), `332.1`
(quoted in Direction), and `310.1` (an unspent *visual debt*, not open work).
**Nothing here claims an open item that is not.**

## ⚠ WHICH RULE FIRES NEXT — rule 3, and it is OVERDUE

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   3 / 4 Continue rounds   ok        ← advanced by THIS wake
Objective     3 / 3 slices            OVERDUE  [334, 336, 337]
  -> a counter is at or past its threshold; the dispatcher should pick it
Optimize      0 wake-date(s) newer    ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 24 open items). Rule 2 reads `ok`, so
**rule 3 is the first rule that matches next wake**: an Objective grill of the
three armed slices.

**The arming set's third label is the parser oddity, for an EIGHTH time — the
slice to grill is 367, not 337.** This wake's row leads with the item id `337.1`,
so `SLICE_TOP` credits **337** rather than Slice **367**. Slices 358, 360, 361,
362, 363, 365 and 366 each hit the same leading-item-id behaviour. **No parser
item is filed**, on `355.3`'s precedent, `359.4`'s refusal, and `LOOPS.md`'s own
note that widening the regex is not the lesson. It costs nothing here: the count
is right, only the label is — but a grill that takes the labels literally will
open Slice 337 (the *filing* slice) instead of Slice 367 (the *building* one), so
**grill 334, 336 and 367**.

## What landed: Slice 367 — `337.1` closed, A WRAPPER

**Dispatched by rule 4.** The Standardize sweep is four commands typed by hand,
and a mistyped one is byte-silent, so a lane that never ran is written up as
clean. `scripts/loops/standardize_lanes.py` now holds the four spellings, runs
each lane, and classifies it on three exact clauses of the child process's own
bytes — `rc == 0`, non-empty after npm's banner is stripped, contains a digit —
printing `NOT RUN` with the stderr tail and exiting non-zero otherwise. `LOOPS.md`
§3 step 1 sends the sweep through it and requires a figure per lane. **Read the
script's own output rather than a value here.**

**The trap reproduces and is worse than filed:** `rc=1` with **0B stdout AND 0B
stderr**, where the item recorded only *"printed nothing at all"*. A **second**
byte-silent form the item does not name behaves identically — a mistyped
*script* name, `npm run -s scan:no-such-lane -w docs`.

**Two of the three fixes the Accept offered do not exist**, measured rather than
argued. There is no `-s` to drop: `git show HEAD:LOOPS.md | grep -c 'npm run -s '`
read **0** at `0edfc35e`, and all three npm lanes already carried the correct
workspace. And the per-lane write-up rule is **4 of 15** sweeps old — the
`Lane K of 4` marker starts at Slice 345; the other 11 sweeps narrate *"lanes 1-3
clean"* collectively, which by construction cannot say which lane printed what.

**It is NOT a gate**, not in `ci.yml`, and not scanned by `check:selftests`
(which reads `check-*.mjs` in two script dirs). Its `--self-test` — 7 cases, 0
failures — ships on doctrine rather than enforcement.

## Two defects in this wake's OWN work, both caught by red-proving

Recorded here because both are the shapes `CLAUDE.md` predicts, and a later wake
re-running the red-proof should expect them:

1. **The emptiness clause came back GREEN under injection.** No output is a
   strict subset of no digit, so that clause could never change a verdict — an
   unfalsifiable clause, not a defective injection (the injection was verified
   to land: 1 site, content changed, reason string visibly moved). Fixed by
   having the self-test assert the **reason substring** as well as the verdict.
2. **The first rc injection went red TOO BROADLY.** `rc != 0` → `rc != 99999`
   makes the clause true for every rc, so everything classified `NOT RUN` and the
   three NOT-RUN cases "passed" while measuring nothing. Only the positive
   control caught it. Re-aimed to `if False:`, which fails 4 cases.

## A live hazard the wrapper creates, measured this wake

**Lanes 1 and 3 read `apps/docs/dist`** — checked per lane, since `grep -c dist`
says 3 of 4 and lane 2's hits are all the word *distinct*. So a sweep run beside
a build reads a half-written site: lane 1 reported **990** live inline style
attributes mid-`docs:build` and **1365** twice on a settled tree (529 files).
The wrong figure is plausible, self-consistent and silent. **Run the sweep
against a settled `dist`.**

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: **the diff is one
new run-by-hand Python script plus `LOOPS.md` and `ROADMAP.md` prose**. No CSS
rule, no docs page, no `.astro` file, no generated artefact, no shipped JS —
`git diff --stat` was read to confirm that, not assumed. `grep -rn
'standardize_lanes' .github/workflows/` returns **nothing**, so not even a gate's
output moves.

**The eight older debts are unchanged and unspent**, counted from the previous
hand-off's enumeration rather than carried as a number: Slice 352's two
(`/components/data-table`'s performance table and `/concepts/scale`'s scaling
table, both at 1440 and 390 in both themes); Slice 345's two
(`/patterns/output-form` **in print** and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths); and the four older —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates: all 17 CI-runnable entry points were run in this container**, in
`ENVIRONMENT.md`'s own order, every one green. Figures read off their own output:
core `build` (incl. `check:package` **185** files), core `test` (**165** tests, 29
files), `lint:css`, `docs:build`, `check:claims` (**176** live, **3 NOT
VERIFIED**, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting` (7 Intl outputs), `check:scroll` (**914** containers across 118
pages × 2 widths), `check:layout` (**128** pages), `check:forced-colors` (23 rules
live), `test:axe` (**128** pages × 2 widths, **zero** violations),
`check:target-size` (7 pages × 3 densities), `check:search` (10 assertions),
`check:pseudo` (14 pages × 2 widths), `check:quickstart`, `check:po-app`,
`check -w create-ui`, `npm run suite`.

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push. It gates `.roundtable/**` and `ROADMAP.md` content —
`check:slice-refs` reported **1020** assertions and **349** slice numbers on that
run, and `check:vendor-names` **623** files against 7 denied names.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It caught one of
this wake's own defects** — the script header and the roadmap entry both said
*"three of the four lanes read `dist`"*, read off a `grep -c` whose hits in lane 2
are all the word *distinct*. Corrected to **lanes 1 and 3** in both places before
the commit.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing recorded, deliberately.** No name this wake could sample MOVED on a
  day-paired name, which is the only thing rule 5 can read.
- **`claims`** — read **176** live, identical to the sample already in the pair.
  A same-value sample moves nothing.
- **`gates`** — unchanged at **56**; this wake added no gate. The wrapper is an
  instrument, `check:selftests` does not scan it, and `ci.yml` does not run it.
- **`dispatch-region-words`** — **measured, not assumed**: `LOOPS.md` changed
  this wake, but the edit sits below `## Playbooks`, and `report_loop_prose.py`'s
  `by region` block reads **7,552** after it, the same value already sampled.
  The file as a whole went 18,050 → 18,147 words (+97), all in the playbooks
  half. The first draft of that edit was +188 and was cut in half before landing.
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.

## The open set is 24 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **24**. Slice 367 closed
`337.1` and opened nothing, so the set fell 25 → 24.

- **cloud-takeable: 12** — `338.1`, `339.2`, `345.1`, `346.1`, `348.1`, `349.1`,
  `350.1`, `351.1`, `352.1`, `352.2`, `353.2`, `362.1`. **`338.1` is the oldest
  of these** — but rule 3 outranks rule 4, so it is not what fires next.
  **`362.1` carries Slice 364's amendment** on the `include`; Slices 365, 366 and
  367 did not touch it.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, which is 403 for a cloud session. A local
  wake can take it.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (holds its remaining rows for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

12 + 1 + 10 + 1 = 24, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step
1 committed nothing. **Issue #2's `updated_at` is the same value the previous
hand-off recorded.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 25 open items at Step 0. Rule 2 read `Standardize 2 / 4 ok` and did not
match. Rule 3 read `Objective 2 / 3 ok [334, 336]` and did not match. Rule 5 read
`Optimize 0 wake-date(s) newer — ok` and was EVALUATED, not skipped: its movers
were `gates` (+1), `claims` (+7) and `dispatch-region-words` (+60), none a
regression on two consecutive runs. **Rule 4 matched** — on `337.1`, the oldest
open item after Slice 15 → `335.1` were re-derived as blocked from their own
text. Rules 6-8 not reached, so `polish_requeue.py --apply` was correctly NOT
run.

## ⚠ The archive sweep: 59.1% — the highest on record, and above BOTH recorded triggers

```
python3 scripts/loops/roadmap_scope.py
  8056 / 13635 = 59.1%    (this wake's slice commit — the highest on record)
  7788 / 13455 = 57.9%    (previous wake's tip, for the trend)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the tenth
sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the twelfth
at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 59.1% is **4.0pp above**
the level the tenth was dispatched at and **2.4pp above** the eleventh's, and it
has risen on each of the last six wakes.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
4's build end to end. **`249.12` is named for a TWENTY-SEVENTH consecutive wake**
— the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. **12 targets
are NAMED by a still-open item** (`roadmap_scope.py` lists them) and must be read
before moving (236.2).

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
container arrived detached at `0edfc35e` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,102**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**), which
is the twelfth consecutive container to do so.

**No `git worktree` and no `git stash` were used this wake.** The three
red-proof probes were one file, `scripts/loops/__probe_337.py`, written and
deleted three times in the same directory (so `parents[2]` still resolved to the
repo root), and confirmed absent before the slice commit. The base-rate
instrument lived in the scratchpad, never in the repo.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Four things want the owner's attention:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Twenty-seven consecutive wakes have declined a
   sweep for want of the trigger this item would supply, and the share has now
   passed **both** recorded dispatch levels (59.1% against 55.1% and 56.7%).
   Its filed grounds are *low urgency, "the sweep keeps happening regardless"*;
   that premise has been weakening for twenty-seven wakes and is now weakest.
3. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
4. **`335.1` cannot be settled by any cloud wake**, carried unchanged from the
   previous hand-off. Filing the test discussion needs GraphQL, which is 403 for
   a cloud session. A local wake can do it in one command, or the owner can file
   a throwaway Q&A discussion and let the next wake read it.

**A fifth thing, carried forward and still true:** `ENVIRONMENT.md` has no size
discipline and no longer has an item asking for one. `332.1` closed on the
finding that the file is long because the environment is hostile. **If the owner
wants it shorter anyway, that is a different item and needs filing**; no wake
should infer it from a closed one.

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages. Whether those
samples *should* teach the cast is a judgement about the docs, not a lint
decision, and the item says refusing part of it is a satisfying outcome.

**The loop-mechanics question is still FOUR items deep** — `349.1`, `350.1`,
`351.1` and `353.2`. Slice 367 filed nothing and refused a fifth on the eighth
recurrence of the `SLICE_TOP` label behaviour.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` and
`ENVIRONMENT.md` are **byte-for-byte unchanged**; `LOOPS.md` gained **9 lines**
in §3 step 1 and nothing else.
