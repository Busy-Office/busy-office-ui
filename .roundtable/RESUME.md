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
survives none. (Slice 364 found the same failure one level out: Slice 361 cited
`check-layout.mjs:112` for a symbol that is on line 26.)

---

## In flight: nothing

Last updated 2026-09-09 (**cloud** wake, scheduled routine). Working tree clean
at hand-off apart from this file, `loop-log.md`, `INDEX.md` and `STATUS.md`.
**No collision this wake** — `origin/main` read `4cfb8b2c` at Step 0 and
`4cfb8b2c` again at the mandated pre-commit fetch, and it was already the local
tip.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. **So
it was re-run against this file as it now stands, and read rather than deferred:**
**2** archived ids (`94.11`, `312.2`, both *rules* cited by number) and **10**
recorded `[x]` closed — `364.1` (closed by this wake and named as exactly that);
`331.1`, `332.1`, `333.1`, `341.1` (the four items Slices 360-363 closed, which
are the subject of the grill); `355.3` and `359.4` (named only as precedent for
not filing a sixth parser item); `324.3` and `297.1` (each named as precedent or
as the last sweep anyone took); and `310.1` (named as an unspent *visual debt*,
not as open work). **Nothing here claims an open item that is not.** Re-run the
check against this file rather than trusting this paragraph.

**Its two counts reconcile with `roadmap_scope.py`'s and the difference is not a
finding**: 27 open / **109** closed against the scope script's 27 / **107** — the
two extra are the `[x]` items under the non-slice `## STATE` heading, which the
scope script's own output lists as outside every figure it prints.

## ⚠ RULE 4 FIRES NEXT — every counter is spent

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   0 / 4 Continue rounds   ok     ← spent by Slice 363
Objective     0 / 3 slices            ok     ← spent by THIS wake
Optimize      0 wake-date(s) newer     ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 27 open items). Rules 2, 3 and 5 all read
`ok`, so **rule 4 is the first rule that matches next wake**, for the first time
in three wakes. Its item is below.

**No parser oddity this wake, unlike the last four.** This wake's row leads with
`Slice 364`, so `SLICE_TOP` credits 364 and the counter reset cleanly to `0 / 3`
— read after recording rather than assumed. Slices 358, 360, 361, 362 and 363
each hit the leading-item-id behaviour and each recorded it; **no sixth parser
item is filed**, on `355.3`'s precedent, `359.4`'s refusal, and `LOOPS.md`'s own
note that widening the regex is not the lesson.

## What landed: Slice 364 — the Objective grill of Slices 360, 361, 362, 363

**Dispatched by rule 3** at `Objective 4 / 3 OVERDUE [331, 332, 333, 341]`,
exactly as the previous hand-off predicted.

**The arming set names ITEMS, not slices, and the narrowing step needed that
distinction.** The four rows since the last Objective row lead with `331.1`,
`332.1`, `333.1`, `341.1`, so `SLICE_TOP` reports `[331, 332, 333, 341]` — the
slices carrying them are **360-363**. `grill-objective-315-332-333-2026-09-07.md`
covers *Slices* 332 and 333, which are different objects from *items* `332.1`
and `333.1`, so the apparent overlap is not one. **No earlier grill covers
Slices 360-363**; nothing was dropped from scope.

**73 of 78 published assertions reproduce**, counted one per row of the report's
table and reconciled programmatically (78 rows, numbering contiguous 1..78, 5
carrying ✗). Every verdict of the four slices survives.

Full evidence: `.roundtable/grill-objective-360-361-362-363-2026-09-09.md`.

## The five defects — all corrected or marked in place, none a measurement taken wrong

- **A — Slice 362's ts-code tally is over all 50 diagnostics, not the 23
  errors.** It sums to **49**, and its two largest entries (`ts(7044)` 16,
  `ts(6387)` 7) are **hints**. Errors alone: `ts(2339) 20 · ts(2322) 1 ·
  ts(6133) 1 · ts(2551) 1 = 23`. A wake sizing `362.1` off that line budgets 23
  diagnostics it never has to clear.
- **B — `362.1`'s enabling tsconfig omits the `include`, which is
  load-bearing.** As prescribed it yields **377 files / 69 hints** against the
  published **164 / 27**; `astro/tsconfigs/base` includes `${configDir}/**/*`.
  The **error count is unchanged either way**, so the decision stands; only the
  baseline's reproducibility does not. `resolveJsonModule` is already `true` in
  that base. Item amended to name the property.
- **C — Slice 361's "40 commits" is 67**, under plain `git log`,
  `--first-parent`, `--follow`, `--no-merges` and a distinct-blob count alike,
  at `13545b20` as well as at HEAD. **The property is intact and stronger for
  it** (`^5.1.0` across all 67). It had been copied into **`ENVIRONMENT.md`
  §3**, where it is now the command instead of a value.
- **D — `check-layout.mjs:112`** is inside `async function sweep`; `serveDist`'s
  destructure is line **26**, its return `serve-dist.mjs:44`. Re-cited by symbol.
- **E — Slice 363's `13 → 11` detector is recorded nowhere as a command**, and
  that slice landed **no `.roundtable` report** — alone among the four. A
  reconstruction reads `11 → 10`; that is a different regex, so it refutes
  nothing and establishes only that the figure cannot be checked. Marked
  UNCHECKED in place; the substantive claim under it stands on other evidence.

**The pattern, said no more strongly than measured:** all five are a
characterisation, a citation or a denominator. Slice 359 recorded the same of
its four, so **two consecutive grills, seven slices**. Extending the run back
through the grills of 351 and 355 was **refused as unmeasured** — Slice 355's
own row names a defect of a different shape.

**Nothing new filed and no gate proposed.** Each of the five would need a gate
over what a sentence MEANS, which is `94.11`'s wall and Slice 359's standing
refusal.

## The landed measurement reports paid off, and that is the case for E

Two of the three instruments were **extracted from their reports and executed
unchanged** this wake — the `331.1` prototype and the `333.1` base-rate probe —
and both reproduced to the digit, including the probe's eight self-test cases
and the `600 / 518 / 1,118 → 1 hit → 0 of 1,117` sequence, the last obtained by
restoring the deleted import and re-running. That is the contrast that makes E a
finding rather than a nitpick.

## This wake's own first output was wrong, and the run caught it

The first `scan:dead-style` read **10 dead on 8 pages, 1,121 / 1,453 / 249** — a
clean-looking disagreement with Slice 363 on all five numbers. **Contaminated:**
it was running in the background when this wake moved `apps/docs/dist` aside for
the `astro check` reproduction. Re-run with nothing else touching `dist`:
**11 / 9 / 1,365 / 1,813 / 345**, matching Slice 363 item for item including the
seven dead kinds. Worth carrying because the wrong reading was *plausible* —
every number moved the same direction by roughly the same fraction. **A
background measurement is a statement about the tree across its whole run, not
at the moment it was launched.**

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: **the diff is
`ROADMAP.md` and `.roundtable/**` only**. No CSS rule, no docs page, no script
and no `.astro` file changed, so no rendering can move — `git diff --stat` was
read to confirm that, not assumed.

**The eight older debts are unchanged and unspent**, and nothing this wake did
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** and the RF tile
grid on `/patterns/rf/rf-landing-rf/` at both widths); and the four older ones —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**, in
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size`
**139** payload files / 382.7 kB gz, `check:readme-facts`, `check:package`
**185** files), core `test`, `lint:css`, `docs:build` (carrying `check:slice-refs`
**1,015** assertions / **385** citations / **346** slice numbers,
`check:loop-vocab`, `check:floor` **601** source files, `check:vendor-names`
**623** files, `check:selftests` **55 / 21 / 34** with 172 cases,
`check:imports`, `check:page-shape`, `check:wrong-choice`, `check:metadata`,
`check-markup`), `check:claims` (**3 NOT VERIFIED**, which is `ENVIRONMENT.md`
§6b's container fact, not a regression), `check:formatting`, `check:scroll`,
`check:layout`, `check:forced-colors`, `test:axe`, `check:target-size`,
`check:search`, `check:pseudo` (14 pages × 2 widths), `check:quickstart`,
`check:po-app` (**20** behaviours), `check -w create-ui`, `npm run suite`
(**28** screens × 2 widths, 4,229 `bo-*` class uses).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` and `.roundtable` edit **and before the slice commit** (it gates
`.roundtable/**` content), and again after this file was written, per
`ENVIRONMENT.md` §3b, before the push.

**A destructive proof was run and undone.** Re-proving Slice 361's §3 finding
needs a bare `npx astro build`, which empties `dist` — it was run, both
sentinels confirmed removed (**224** files, 0 pagefind, no `llms.txt`), and then
`rm -rf apps/docs/dist && npm run docs:build` restored **529**. Every gate above
ran on the restored tree, not the 224-file one.

**The `verifier` agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially and every load-bearing figure re-run
from scratch. **It caught one of this wake's own claims**: a draft asserted
"four grills running, twelve slices" for the characterisation-defect pattern.
Unmeasured — it was weakened to "two consecutive grills, seven slices" with the
reason, before the commit. That is the same defect class the grill was reporting.

## No metric was recorded, and here is the reason for each candidate

- **`dispatch-region-words`** — `LOOPS.md` did **not** change this wake, so the
  number the name tracks cannot have moved. Recording it would add a sample that
  says nothing.
- **`gates` = 55** — already paired across days and read **55** on 2026-09-07; a
  same-value sample moves nothing rule 5 can read.
- **`claims`** — identical to the previous nine wakes, same ground.
- **A `grill-assertions` metric was considered and REFUSED** — it would be a
  single-day name (39 of 47 names already have only one day and cannot be an
  input to a rule that compares two runs), and the figure it would carry is in
  Slice 364 beside the table that produces it.

Rule 5's line read `ok` (0 wake-dates newer) both before and after the
recording, so nothing was owed.

## The open set is 27 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **27**. Slice 364 filed
`364.1` **closed** and opened nothing, so the set is unchanged at 27.

- **cloud-takeable: 16** — `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`,
  `352.2`, `353.2`, `362.1`.
  **`334.1` is the oldest of these, and rule 4 reaches it next wake** — every
  counter above is spent. Read Slice 362's correction to it first: `334.1`'s
  pinned *"scanGates() reports 54 / 20 / 34 today, so counting this file makes
  it 55 / 21 / 34"* is a forecast that has since become the CURRENT reading
  (this wake's build prints `55 gates … 21 heuristic … 34 exact`), so the item
  can be misread as already done. It is not. `335.1` still carries its caveat —
  settling it may mean filing a throwaway Q&A discussion, an outward-facing
  write to a public repo whose permission has **not** been tested.
  **`362.1` now carries Slice 364's amendment** on the `include`.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7`
  (owner- *and* browser-blocked), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

16 + 10 + 1 = 27, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step 1
committed nothing. **Issue #2's `updated_at` has not moved for a THIRTIETH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 27 open items at Step 0. Rule 2 read `Standardize 0 / 4 ok` (spent by
Slice 363) and did not match. **Rule 3 read `Objective 4 / 3 OVERDUE [331, 332,
333, 341]` and matched.** Rules 4-8 not reached. **Rule 5 would have read `ok`
at Step 0** (0 wake-dates newer, 8 of 47 names paired), and
`polish_requeue.py --apply` was correctly NOT run because rule 6 was never
reached.

## ⚠ The archive sweep: 54.8%, and it has now CROSSED the last dispatched trigger

```
python3 scripts/loops/roadmap_scope.py
  7177 / 13103 = 54.8%    (this wake's slice commit — the highest on record)
  7013 / 12911 = 54.3%    (previous wake's tip, for the trend)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 54.8% is
**0.3pp below** 55.1% and **13.3pp above** the level at which one was last
taken. It has risen on each of the last three wakes.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
3's grill end to end. **`249.12` is named for a TWENTY-FOURTH consecutive wake**
— the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. Note that
`roadmap_scope.py` now lists **Slice 364** as archive-eligible, and **9 targets
are still NAMED by a still-open item** and must be read before moving (236.2).

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs the
full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b —
*re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha**, and **take the full sha from `git rev-parse HEAD`,
never by extending a short one already on screen** (`ENVIRONMENT.md` §6d — which
this wake re-proved: the 9-char form answers HTTP **200** with **0** runs where
the full sha answers **2**):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit.** `git branch --show-current` answered **EMPTY** at Step 0 — the
container arrived detached at `4cfb8b2c` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,096**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**), which
is the ninth consecutive container to do so.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `4cfb8b2c` (the Step 0 tip) or `fed40de9` (the slice commit).

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Three things want the owner's attention, all unchanged, all thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses
   the component with the measurement; Slice 319 corrected a second false claim
   on the same page the reporter was pointing at. **Replying and closing the
   issue is an owner action.** Whether a *wake* should post that comment was
   `297.1`, closed by Slice 335 — read it before re-raising.
2. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached, so
   `polish_requeue.py --apply` was correctly not run.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Twenty-four consecutive wakes have declined a
   sweep for want of the trigger this item would supply, and the share has now
   reached **54.8%** — within 0.3pp of the level at which the tenth sweep was
   dispatched, and rising on each of the last three wakes. Its filed grounds are
   *low urgency, "the sweep keeps happening regardless"*; that premise has been
   weakening for twenty-four wakes.

**A fourth thing, carried forward and still true:** `ENVIRONMENT.md` has no size
discipline and no longer has an item asking for one. `332.1` closed on the
finding that the file is long because the environment is hostile. **If the owner
wants it shorter anyway, that is a different item and needs filing**; no wake
should infer it from a closed one. (It grew again: **856** lines at this wake's
Step 0 against the **789** Slice 361 measured a day earlier.)

**A fifth thing, carried forward and now better specified: `362.1` will change
published sample code.** Adopting `astro check` means resolving 22 DOM-narrowing
errors inside inline `<script>` blocks that readers copy off pattern pages —
`value-help` 9, `Gallery` 6, `htmx` 3, and one each in `ScheduleScreen`,
`palettes`, `cascade`, `detail-form`, re-derived this wake from an errors-only
tally. Whether those samples *should* teach the cast is a judgement about the
docs, not a lint decision, and the item says refusing part of it is a satisfying
outcome.

**The loop-mechanics question is still FOUR items deep** — `349.1`, `350.1`,
`351.1` and `353.2`. Slice 364 filed nothing and refused a fifth twice over.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` and
`LOOPS.md` are **byte-for-byte unchanged**; `ENVIRONMENT.md` changed only inside
`### 3`, replacing a wrong pinned count with the command that produces it.
