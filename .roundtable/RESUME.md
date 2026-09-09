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
this wake** — `origin/main` read `1e756a5d` at Step 0 and `1e756a5d` again at the
mandated pre-commit fetch, and it was already the local tip.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. It
named **2** archived ids (`94.11`, `312.2`, both *rules* cited by number) and
**12** `[x]` closed ids. **Re-run it against this file as it now stands rather
than trusting this paragraph.** The closed ids named below are named as history
or as precedent, never as open work: `336.2` (closed by THIS wake and named as
exactly that), `334.1` (the previous wake's), `297.1` and `324.3` (precedent),
`310.1` (an unspent *visual debt*, not open work), and `332.1`/`341.1`/`353.1`
(history quoted in the base-rate table). **Nothing here claims an open item that
is not.**

## ⚠ WHICH RULE FIRES NEXT — rule 4 again, and no counter is spent

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   2 / 4 Continue rounds   ok     ← advanced by THIS wake
Objective     2 / 3 slices            ok  [334, 336]
Optimize      0 wake-date(s) newer    ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 25 open items). Rules 2, 3 and 5 all read
`ok`, so **rule 4 is the first rule that matches next wake**. Its item is below.

**The parser oddity recurred, for a SEVENTH time.** This wake's row leads with
the item id `336.2`, so `SLICE_TOP` credits **336** rather than Slice **366**,
and the rule-3 line reads `[334, 336]`. Slices 358, 360, 361, 362, 363 and 365
each hit the same leading-item-id behaviour. **No parser item is filed**, on
`355.3`'s precedent, `359.4`'s refusal, and `LOOPS.md`'s own note that widening
the regex is not the lesson. It costs nothing here: the count is right, only the
label is.

## What landed: Slice 366 — `336.2` decided, PRINT THE UNION

**Dispatched by rule 4.** `report-prose.mjs` printed both halves of `LOOPS.md`
§3 lane 3's two-clause definition — *over 2x the CORPUS median, or over 2x its
FAMILY median* — and never their union, so the report's most prominent number
answered one clause while the lane verdicts the other. It now prints three
lines: the union count with its inclusion-exclusion arithmetic, the **family-only
additions only** (the corpus set is listed directly above and is not repeated,
so this is not the third list `336.2`'s "against" clause feared), and the
enumeration reminder. The corpus headline names itself *one clause of the lane,
not its population*. **Read the report's own output rather than a value here:**
it currently reads `corpus 10 + family 11 − both 6 = 15`.

**The item's premise was re-measured and is recorded as arguing AGAINST the
change.** `336.2` was filed on *"2 of the last 2 sweeps mishandled lane 3"*. Over
the seven sweeps since 326 — **326, 332, 339, 345, 350, 357, 363**, enumerated
from the ROADMAP headings and the loop log independently, which agree — the
failure this line removes occurred in **1 of 7** (Slice 332 alone) and **0 of the
last 5**. Slice 326 printed `union = 15` in its own entry and failed on the stale
verdict **ENUMERATION**, which no report line can prevent. The change was taken
on the lane's contract, not on the rate, and both are published so a later wake
can disagree with the choice on the evidence.

**What could NOT be measured, said plainly:** whether the five correct sweeps
*derived* the union or copied the previous sweep's phrasing is not recoverable
from the record. Two of them ran the report fresh (350 quotes the moved threshold
`1,596` where 326 quotes `1,584`; 357 publishes a moved mean and total), but a
fresh report run is not a fresh union. No claim is made either way.

## `335.1` is ahead of it under rule 4, and its blocker is now MEASURED and written into the item

`335.1` was the oldest cloud-takeable item and **this was the first wake to reach
it under rule 4**. Its Accept allows filing a throwaway discussion; that is the
GraphQL `createDiscussion` mutation, and this session's GraphQL endpoint answers
**HTTP 403** — *"only the pinned set of PR-review operations is served"* — to all
three of a `viewer` query, a `repository { discussionCategories }` read and a
bare `__type` introspection, so the refusal is the endpoint and not one query.
The repo object read with the same token reports
`permissions {admin, maintain, push, triage, pull}` all **false**.

**Whether a REST POST would work is untested BY CHOICE**, and that is recorded
rather than folded into the block: the only probe is a request that can create a
real public item in the owner's repository, and a scheduled wake has no live
owner to authorise one. `/discussions/categories` answers `404` with
`documentation_url: rest/repos/discussions#get-a-discussion` — the family's own
anchor is a *get* — which is weaker evidence and is all that was taken.

**The item gained the Lane line it never had**, so the next cloud wake does not
re-derive the 403: **cloud-blocked in the WRITE sense — a LOCAL wake can take
it**, because `gh auth token` there carries the owner's own GraphQL access.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: **the diff is
one run-by-hand report script and `ROADMAP.md` prose**. No CSS rule, no docs
page, no `.astro` file, no generated artefact, no shipped JS —
`git diff --stat` was read to confirm that, not assumed. `grep -n 'report-prose'
.github/workflows/*.yml` returns **nothing**, so not even a gate's output moves.

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
`ENVIRONMENT.md`'s own order. Figures read off their own output: core `build`
(incl. `lint:css`, `check:size`, `check:readme-facts`, `check:package` **185**
files), core `test` (**165** tests), `lint:css`, `docs:build`, `check:claims`
(**176** live, **3 NOT VERIFIED**, which is `ENVIRONMENT.md` §6b's container
fact, not a regression), `check:formatting` (7 Intl outputs), `check:scroll`
(**914** containers across 118 pages × 2 widths), `check:layout` (**128**
pages), `check:forced-colors` (23 rules live), `test:axe` (**128** pages × 2
widths, **zero** violations), `check:target-size` (7 pages × 3 densities),
`check:search` (10 assertions), `check:pseudo` (14 pages × 2 widths),
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens × 2 widths, zero axe violations; `check-markup`
28 files / 4,229 `bo-*` class uses). **The last six were still running when the
slice was committed and every one was confirmed green before the push** — said
that way rather than implying they gated the commit. Nothing in this diff can
reach them: it is one run-by-hand script and roadmap prose.

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push. It gates `.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It caught one
of this wake's own defects** — the corpus headline said *"this is HALF the
lane's population"*, and 10 of 15 is not half. Fixed to *"ONE CLAUSE of the
lane, not its population"*, the report re-run, and the entry now says why the
shipped line does not use the word `336.2` itself uses.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing recorded, deliberately.** No name this wake could sample MOVED on a
  day-paired name, which is the only thing rule 5 can read.
- **`claims`** — read **176** live, identical to the 2026-09-07 sample already
  in the pair. A same-value sample moves nothing.
- **`gates`** — unchanged at **56**; this wake added no gate (the change is a
  report, and `check:selftests` does not scan it).
- **`dispatch-region-words`** — `LOOPS.md` did **not** change this wake, so the
  number that name tracks cannot have moved.
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.
- **Not invented:** a `prose-flagged-union` name. `dispatch_status.py` already
  reports **39 of 47** names having only one day and so being no input to rule
  5; adding a forty-eighth of that kind is noise, not instrumentation.

## The open set is 25 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **25**. Slice 366 closed
`336.2` and opened nothing, so the set fell 26 → 25.

- **cloud-takeable: 13** — `337.1`, `338.1`, `339.2`, `345.1`, `346.1`,
  `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`, `362.1`.
  **`337.1` is the oldest of these, and rule 4 reaches it next wake.**
  **`362.1` carries Slice 364's amendment** on the `include`; Slices 365 and 366
  did not touch it.
- **cloud-blocked in the WRITE sense (1):** `335.1` — see above. A local wake
  can take it.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (owner- *and* browser-blocked), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

13 + 1 + 10 + 1 = 25, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step
1 committed nothing. **Issue #2's `updated_at` has not moved for a THIRTY-SECOND
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 26 open items at Step 0. Rule 2 read `Standardize 1 / 4 ok` and did not
match. Rule 3 read `Objective 1 / 3 ok [334]` and did not match. Rule 5 read
`Optimize 0 wake-date(s) newer — ok` and was EVALUATED, not skipped: its movers
were `gates` (55 → 56, coverage growth on one pair) and
`dispatch-region-words` (+60), neither a regression on two consecutive runs.
**Rule 4 matched** — on `335.1` first, which fell through on the measured write
block above, then on `336.2`. Rules 6-8 not reached, so
`polish_requeue.py --apply` was correctly NOT run.

## ⚠ The archive sweep: 57.9% — the highest on record, and now ABOVE the ELEVENTH sweep's trigger

```
python3 scripts/loops/roadmap_scope.py
  7788 / 13455 = 57.9%    (this wake's slice commit — the highest on record)
  7481 / 13254 = 56.4%    (previous wake's tip, for the trend)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 57.9% is
**2.8pp above** the level the tenth was dispatched at and **1.2pp above** the
eleventh's — the first reading past both — and it has risen on each of the last
five wakes.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
4's build end to end. **`249.12` is named for a TWENTY-SIXTH consecutive wake**
— the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. **10 targets
are NAMED by a still-open item** (`roadmap_scope.py` lists them) and must be
read before moving (236.2).

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
container arrived detached at `1e756a5d` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,100**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**), which
is the eleventh consecutive container to do so.

**No `git worktree` and no `git stash` were used this wake.** The three
red-proof probes were separate files in `apps/docs/scripts/`, per
`ENVIRONMENT.md`'s rule, and were deleted before the slice commit. Every figure
names either `1e756a5d` (the Step 0 tip) or `9a5faeca` (the slice commit).

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
   **OWNER OR ARCHITECTURE CALL**. Twenty-six consecutive wakes have declined a
   sweep for want of the trigger this item would supply, and the share has now
   passed **both** recorded dispatch levels (57.9% against 55.1% and 56.7%).
   Its filed grounds are *low urgency, "the sweep keeps happening regardless"*;
   that premise has been weakening for twenty-six wakes and is now weakest.
3. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
4. **NEW this wake: `335.1` cannot be settled by any cloud wake.** Filing the
   test discussion needs GraphQL, which is 403 for a cloud session. A local wake
   can do it in one command, or the owner can file a throwaway Q&A discussion
   and let the next wake read it. Until then the intake's end-to-end proof stays
   owed, and every cloud wake will keep falling through this item.

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
`351.1` and `353.2`. Slice 366 filed nothing and refused a fifth on the seventh
recurrence of the `SLICE_TOP` label behaviour.

**Nothing this wake did is outward-facing or hard to reverse**, and one thing
was refused *because* it would have been: filing a public discussion in the
owner's repository with no live owner to authorise it. `CLAUDE.md`, `LOOPS.md`
and `ENVIRONMENT.md` are **byte-for-byte unchanged**.
