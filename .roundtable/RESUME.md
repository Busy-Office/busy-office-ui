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
this wake** — `origin/main` read `6a7505f9` at Step 0 and `6a7505f9` again at the
mandated pre-commit fetch, and it was already the local tip (no fast-forward).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. It
named 4 archived ids (`94.11`, `312.2`, `192.1`, `321.1`, every one a *rule*
cited by number) and **8** recorded `[x]` closed.

**So it was re-run against this file as it now stands**, and the report was read
rather than deferred: the same 4 archived ids, and **9** recorded `[x]` closed —
`341.1` (closed by this wake and named as exactly that), `333.1`, `332.1`,
`297.1` and `324.3` (each named as precedent or as the last sweep anyone took),
`355.3` and `359.4` (named only as precedent for not filing a sixth parser
item), `326.1` (named as the dead-grep precedent lane 3 must avoid), and
`310.1` (named as an unspent *visual debt*, not as open work). **Nothing here
claims an open item that is not.** Re-run the check against this file rather
than trusting this paragraph.

**Its two counts reconcile with `roadmap_scope.py`'s and the difference is not a
finding**: 27 open / **108** closed against the scope script's 27 / **106** — the
two extra are the `[x]` items under the non-slice `## STATE` heading, which the
scope script's own output lists as outside every figure it prints.

## ⚠ RULE 3 FIRES NEXT — `Objective` IS OVERDUE AT `4 / 3`

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   0 / 4 Continue rounds   ok        ← spent by this wake
Objective     4 / 3 slices            OVERDUE   [331, 332, 333, 341]
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 27 open items). **Rule 2 reset to 0 / 4** —
this wake spent it. **Rule 3 is OVERDUE and is now the top unspent rule**, so
the next wake runs the **Objective grill**. Rule 4's next item is below.

**The rule-3 counter credits `341` rather than `363`, and that is the KNOWN
behaviour, not a new bug.** This wake's row leads with `341.1`, so `SLICE_TOP`
reads 341. Slices 358, 360, 361 and 362 hit the identical thing and each
recorded it. **No sixth parser item is filed** — `355.3`'s precedent, `359.4`'s
refusal, and `LOOPS.md`'s own note that widening the regex is not the lesson.

## What landed: Slice 363 — a Standardize sweep, 4 of 4 lanes, closing `341.1`

**Dispatched by rule 2** at `Standardize 4 / 4 OVERDUE`, exactly as the previous
hand-off predicted. Rule 3 was *also* already overdue and sits below rule 2, so
it waited — and has now accumulated one more.

**Lanes 1-3 carry no delta, and one of the three could not have carried one:**

- **Lane 1 `scan:dead-style`** — **11** dead declarations on **9** pages (1,365
  live attributes, 1,813 declarations, 345 multi-declaration). Reconciled **by
  kind**, not by total, against Slice 345's eleven **refusals**: `3×
  inline-size: 100%`, `3× color`, `1× display: inline-block`, `1×
  margin-block-start`, `1× align-items: center`, `1× block-size: 2rem`, `1×
  inline-size:var(--bo-space-0)`. Item for item the same set.
- **Lane 2 `report:css-repeats`** — `74/242/230/8`, the sixth consecutive
  identical reading. **It is unchanged BY CONSTRUCTION and is therefore no
  evidence either way**: the report's own footer says an unchanged reading means
  something only if the window touched `packages/core/src/css`, and
  `git log --first-parent -1 -- packages/core/src/css` is `e4742fd4`
  (2026-09-07), which **predates the last sweep**. Five previous sweeps quoted
  the streak as a pass; it is not one.
- **Lane 3 `report:prose`** — 119 pages, median **798**, total **114,124**.
  Flagged union **15**, every one inside the pinned 16-set. Checked against the
  ENUMERATION (never `326.1`'s dead grep) and the enumeration **re-derived from
  the archive** rather than carried: 158.1's twelve page paths + 161.1's three +
  178.3's `/concepts/scale/`; `/patterns/output-form/` is the sixteenth and is
  not flagged.
- **Lane 4 `report_loop_prose.py` — THE finding, and it is an item that was
  already open.** 1 of 16 dispatch-region sections moved, **+194** body words,
  all of it Step 0c. That is `341.1`. **No new item was filed.**

## `341.1` closed, and the shape of the answer matters more than the number

`341.1` split collision 5's +194 into **115** (the list entry, mandated by Step
0c's charter) and **79** (correcting counts the incident falsified, mandated by
nothing). **Both halves were re-derived from `7e2c61c0` itself** and reproduce
exactly; the series `1322 → 1516 → flat` reproduces to the word.

The 79 came from **exactly two sentences**, both aggregates over the collision
list — a count (`Five as of 2026-09-08:`) and a fraction (`Three of the five (2,
3, 4) … the sample is five, and two of them …`) — standing four lines under Step
0c's own *"Count them by re-reading the list below rather than trusting a number
in prose"*. **Every entry now ends with a `cost:` tag** and both sentences are
gone, so a sixth collision edits the list and nothing above it.

**Step 0c is 1,516 → 1,520. That is +4 words: a shape change, NOT a cut**, and
the forward saving is a property rather than one already banked. Said that way
deliberately — **the first attempt was +93**, which is 339.1's own recorded
failure (*"the narrative that came out was replaced by a paragraph explaining
why it came out"*) reproduced one slice later; the justification was moved into
Slice 363 and the section re-measured.

**Refused, both with the reason**: moving the 115-word entry out (Step 0c
refuses a count-plus-pointer **in its own words**, and a wake reads that section
every wake); and a gate over the tag — refused on the **failure mode**, not the
base rate, because a missing tag leaves an *untagged entry* where a missed
correction left a *false statement*.

**What this does NOT fix, and the next wake should not read it as fixed**: the
archive charter is still a rule a human has to notice. `LOOPS-archive.md` says
so in its own words. This slice removed the half with no rule behind it.

## The instrument agreed with itself, which is the only reason the figure is quoted

`dispatch-region-words` was measured twice by different code before being
recorded: this wake's own section splitter and `report_loop_prose.py`'s `by
region` block **both read 7,552** at `f1e84a77`. `353.2` is open about that
name's counting convention and is untouched.

## ⚠ The archive sweep: 54.3%, and it crossed the last dispatched trigger

```
python3 scripts/loops/roadmap_scope.py --rev f1e84a77
  7013 / 12911 = 54.3%    (this wake's slice commit — the highest on record)
  6545 / 12480 = 52.4%    (previous wake's Step 0 tip, for the trend)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 54.3% is
**0.8pp below** the 55.1% at which a sweep was last dispatched and **12.8pp
above** the level at which one was last taken.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
2's sweep end to end. **`249.12` is named for a TWENTY-THIRD consecutive wake** —
the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. Note that
`roadmap_scope.py` now lists **Slice 341 as archive-eligible**, which it was not
before this wake closed its item; **13 targets are still NAMED by a still-open
item** and must be read before moving (236.2).

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: **the diff is
`LOOPS.md` and `ROADMAP.md` only**. No CSS rule, no docs page, no script and no
`.astro` file changed, so no rendering can move — `git diff --stat` was read to
confirm that, not assumed.

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
**1,013** assertions / **384** citations / **345** slice numbers,
`check:loop-vocab`, `check:floor` **600** source files, `check:vendor-names`
**622** files, `check:selftests`, `check:imports`, `check:page-shape`,
`check:wrong-choice`, `check:metadata`, `check-markup`), `check:claims`
(**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (914 containers),
`check:layout` (128 pages), `check:forced-colors`, `test:axe` (128 × 2, zero
violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit **and before the slice commit** (it gates `.roundtable/**`
content), and again after this file was written, per `ENVIRONMENT.md` §3b,
before the push. The core `build` was also re-run on the final tree so the
"all 17 on this tree" claim is exact rather than inherited from the opening run.

**The `verifier` agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially and **every load-bearing figure
re-run from scratch** — the Step 0c series (1322/1516/1520), the 115+79=194
split re-derived from the commit rather than from `341.1`'s prose, the region
figure against two independent instruments, the lane-1 refusal set matched by
kind, the lane-3 enumeration re-derived from the archive, the open/P0 counts
(**27** / **0**), and the README `gates` fact read out of
`derive-readme-facts.mjs` line 141 rather than cited. All reproduced.

## One claim was weakened after checking it, and it is worth carrying

A regex for *a cardinal in the same sentence as a collision word, outside the
numbered list* reads **13 sentences before this wake's edit and 11 after** — the
two that vanish are exactly the two carrying all three aggregates. **It is
reported as a check and not as a proof**, because it also matches 11 sentences
that an append cannot falsify (they name a *specific* entry). *"This sentence is
an aggregate over the list"* is semantic, which is `94.11`'s wall — so no gate,
and the detector is not dressed up as one.

## No other metric was recorded, and here is the reason for each candidate

- **`dispatch-region-words` = 7,552 — RECORDED.** `LOOPS.md` changed this wake,
  the number is the one the slice moved, and the name is one of the 8 already
  paired across days. Rule 5's line went `STALE (1 wake-date newer)` on the
  recording and back to `ok` after this sample, which is the instrument
  behaving.
- **`claims` = 176** — **identical** to the previous eight wakes; a ninth
  identical sample moves nothing rule 5 can read.
- **A `step0c-words` metric was considered and REFUSED** — it would be a
  single-day name (39 of 47 names already have only one day and cannot be an
  input to a rule that compares two runs), and the series it belongs to is in
  Slice 363 with the command that regenerates it.

## The open set is 27 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **27**. Slice 363 closed
`341.1` and filed **nothing**, so the set fell 28 → 27.

- **cloud-takeable: 16** — `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`,
  `352.2`, `353.2`, `362.1`.
  **`334.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached — but **rule 3 fires first**, so rule 4 is not reached next wake
  unless the grill is spent first. `335.1` still carries its caveat — settling
  it may mean filing a throwaway Q&A discussion, an outward-facing write to a
  public repo whose permission has **not** been tested.
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
committed nothing. **Issue #2's `updated_at` has not moved for a TWENTY-NINTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 28 open items at Step 0. **Rule 2 read `Standardize 4 / 4 OVERDUE` and
matched.** Rule 3 read `Objective 3 / 3 OVERDUE [331, 332, 333]` and sits below
rule 2, so it did not fire — it is now `4 / 3`. Rules 4-8 not reached. **Rule 5
would have read `ok` at Step 0** (0 wake-dates newer, 8 of 47 names paired), and
`polish_requeue.py --apply` was correctly NOT run because rule 6 was never
reached.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs the
full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b —
*re-run `npm run docs:build` after writing this file, before pushing* — and it
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
container arrived detached at `6a7505f9` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,094**
commits and **8** tags, and left no `shallow.lock`. Per §2 the tag count is the
check, not a pinned value — this container's `--unshallow` again brought them,
which is the eighth consecutive container to do so.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `6a7505f9` (the Step 0 tip) or `f1e84a77` (the slice commit).

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
   **OWNER OR ARCHITECTURE CALL**. Twenty-three consecutive wakes have declined
   a sweep for want of the trigger this item would supply, and the share has now
   reached **54.3%** — within 0.8pp of the level at which the tenth sweep was
   dispatched. Its filed grounds are *low urgency, "the sweep keeps happening
   regardless"*; that premise has been weakening for twenty-three wakes and this
   wake's number is the closest it has come to the trigger a sweep last fired on.

**A fourth thing, carried forward and still true:** `ENVIRONMENT.md` has no size
discipline and no longer has an item asking for one. `332.1` closed on the
finding that the file is long because the environment is hostile. **If the owner
wants it shorter anyway, that is a different item and needs filing**; no wake
should infer it from a closed one.

**A fifth thing, carried forward from the previous hand-off and unchanged:
`362.1` will change published sample code.** Adopting `astro check` means
resolving 22 DOM-narrowing errors inside inline `<script>` blocks that readers
copy off pattern pages. Whether those samples *should* teach the cast is a
judgement about the docs, not a lint decision, and the item says refusing part
of it is a satisfying outcome.

**The loop-mechanics question is now FOUR items deep, down from five** —
`349.1`, `350.1`, `351.1` and `353.2`. `341.1` closed this wake and **no item
replaced it**: the rule-3 counter crediting `341` instead of `363` was met,
recognised as documented behaviour, and left unfiled on `355.3`'s and `359.4`'s
precedent.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` and
`ENVIRONMENT.md` are **byte-for-byte unchanged**; `LOOPS.md` changed only inside
`### Step 0c`, by **+4 words**.
