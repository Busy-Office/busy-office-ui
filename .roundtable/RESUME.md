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
at hand-off apart from this file, `loop-log.md`, `INDEX.md` and `STATUS.md`.
**No collision this wake** — `origin/main` read `41946018` at Step 0, again at
the mandated pre-commit fetch, and again immediately before the slice commit;
it was the local tip every time.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. Run
it again against this file as it now stands, which is what the line above asks
of you. Every closed id named below is named as history or as precedent, never
as open work: `337.1`, `336.2`, `334.1` (the three slices THIS wake grilled),
`355.3` / `359.4` (precedent for the parser refusal), `94.11` and `312.2` (two
archived *rules*, cited by number), `297.1` and `324.3` (precedent), `310.1` (an
unspent *visual debt*, not open work). **Nothing here claims an open item that is not.**

## ⚠ WHICH RULE FIRES NEXT — rule 4, on `338.1`

`dispatch_status.py`, read immediately after this wake's recording (`LOOPS.md`
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   3 / 4 Continue rounds   ok
Objective     0 / 3 slices            ok        ← RESET by this wake's grill
Optimize      0 wake-date(s) newer    ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 24 open items). Rules 2 and 3 both read
`ok`, so **rule 4 is the first rule that matches next wake**, and its oldest
genuinely dispatchable item is **`338.1`** — the gap `check:print-tokens` cannot
see: a theme token reaching paper through the ordinary cascade. Everything older
is blocked; re-derive that from each item's own text rather than from this list.

## ⚠ RESOLVE EVERY ARMING LABEL — the previous hand-off got this wrong, and it is now in the playbook

The counter's labels are **item ids, not slice numbers**, whenever a log row
leads with one. This wake's armed set read `[334, 336, 337]`; the slices it
actually had to grill were **365, 366 and 367**.

The previous hand-off resolved **one label of three** and named the wrong
parser. Measured this wake: `SLICE_TOP` matches **none** of the three items —
the pattern that matches is **`SLICE_BARE`** (`^([1-9]\d{0,2})\.\d+[a-z]?\b`).
Followed literally, its instruction *"grill 334, 336 and 367"* would have
grilled two closed slices, one of them a grill itself, and missed 365 and 366.

**This is now written into `LOOPS.md` §6 step 0** rather than left here, because
this file is rewritten wholesale every wake (169.3) and eight consecutive wakes
had to re-derive it. **Read the playbook, not this paragraph.** No parser item
is filed — fifth of its kind, refused on `355.3`, `359.4` and `LOOPS.md`'s own
conclusion.

## What landed: Slice 368 — the Objective grill of Slices 365, 366, 367

**Dispatched by rule 3** (`Objective 3 / 3 OVERDUE`). **45 of 50** published
assertions reproduce. Full per-assertion table with commands in
`.roundtable/grill-objective-365-366-367-2026-09-09.md`.

- **Slice 366** — **16 of 16, nothing failed.**
- **Slice 365** — **11 of 13**, with the two non-reproducible ones named rather
  than counted as passes.
- **Slice 367** — **18 of 21**, one partial, **two defects**.

**The defect.** Slice 367 published *"the `Lane K of 4` marker appears in **4**
of the 15 `Standardize sweep, 4 of 4 lanes` sections in `ROADMAP.md` +
`ROADMAP-archive.md`"*. Over that stated population it appears in **5** — Slice
**274** carries all four markers, each with a figure. Red-proved by injection
with a positive control: stripping 274's four markers (asserted to land, marker
lines 15 → 11) returns the published `4` **and its published set, verbatim**.

**The mechanism was reproduced, not hypothesised, and it generalises — so it is
in `ENVIRONMENT.md`, not here.** 7 of the 15 sections are closed, so `ROADMAP.md`
holds only a one-line pointer under the full heading; an enumeration deduping by
slice number on the FIRST hit reads the stub and never opens the body. 274 is
the only one of those seven carrying markers.

**Its own red-proof could not have caught it** — the injection landed inside a
section the instrument was already reading, and no injection inside the
population can surface a section that was never opened.

**The correction argues FOR the wrapper `337.1` shipped.** Over all **47**
sweeps the convention was introduced by Slice **208**, seven sweeps carry a full
four-lane write-up (228, 237, 274, 345, 350, 357, 363), and it lapsed for **ten
consecutive sweeps** between 274 and 345. A rule that has already fallen
silently out of use twice is a stronger case for an executable wrapper than a
four-sweep-old rule. Both defects are corrected in place in Slice 367's entry.

## A defect in this wake's OWN work, caught by re-measuring

Recorded because it is the same shape as the finding, one level down. The first
pass at the history claim grepped only `Lane 1 of 4` to stand for the marker
set, and so missed Slice **235**, which carries a lane-4 marker and no lane-1
one. It was caught by re-running over all 47 sweeps before the number was
published. **Grepping one member of a set to stand for the set is the pointer
shadow's smaller sibling:** the instrument answers faithfully about a narrower
population than the noun beside it names.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: `git diff
--stat` was read, and the diff is `ROADMAP.md`, `LOOPS.md`,
`.roundtable/ENVIRONMENT.md`, one new grill report and this file. **No CSS rule,
no docs page, no `.astro` file, no generated artefact, no shipped JS.** Nothing
this wake touched can move a rendered surface.

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
`ENVIRONMENT.md`'s own order, every one green. Figures read off their own
output: core `build` (incl. `check:package` **185** files), core `test`,
`lint:css`, `docs:build`, `check:claims` (**176** live, **3 NOT VERIFIED**,
which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll` (**914** containers across 118 pages × 2
widths), `check:layout` (**128** pages), `check:forced-colors` (23 rules live),
`test:axe` (**128** pages × 2 widths, **zero** violations), `check:target-size`
(7 pages × 3 densities), `check:search`, `check:pseudo` (14 pages × 2 widths),
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite` (28
screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push. It gates `.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It caught two
of this wake's own defects** — the missing Slice 235 above, and an ordinal
("the thirteenth consecutive container to bring the tags") carried from the
previous hand-off's prose rather than measured, which `ENVIRONMENT.md` §2
explicitly asks not to pin. Both were fixed before the commit.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing recorded, deliberately.** No name this wake could sample MOVED on a
  day-paired name, which is the only thing rule 5 can read.
- **`gates`** — unchanged at **56**; this wake added no gate, and refused one on
  the base rate.
- **`claims`** — read **176** live, identical to the sample already in the pair.
  A same-value sample moves nothing.
- **`dispatch-region-words`** — **measured, not assumed**: `LOOPS.md` changed
  this wake, but the edit sits below `## Playbooks`, and `report_loop_prose.py`'s
  `by region` block reads **7,552** after it, the same value already sampled.
  The playbooks half went 10,595 → **10,757** (+162).
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.

## The open set is 24 — no P0

`roadmap_scope.py` at the slice commit and the raw checkbox count agree at
**24**. Slice 368 is a grill: it closed no item and opened none, so the set is
unchanged from the previous hand-off.

- **cloud-takeable: 12** — `338.1`, `339.2`, `345.1`, `346.1`, `348.1`, `349.1`,
  `350.1`, `351.1`, `352.1`, `352.2`, `353.2`, `362.1`. **`338.1` is the oldest
  of these, and rule 4 fires next**, so it is what a wake should pick.
  **`362.1` carries Slice 364's amendment** on the `include`; Slices 365-368 did
  not touch it.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, and this wake re-confirmed the **403**
  (`viewer { login }`) plus all-false repo permissions. A local wake can take it.
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
across 24 open items at Step 0. Rule 2 read `Standardize 3 / 4 ok` and did not
match. **Rule 3 matched** — `Objective 3 / 3 OVERDUE [334, 336, 337]`. Rule 5
was **EVALUATED, not skipped**, even though rule 3 fires above it: its movers
were `gates` (+1), `dispatch-region-words` (+60) and `claims` (+7), none a
regression on two consecutive runs. Rules 4 and 6-8 were not reached, so
`polish_requeue.py --apply` was correctly NOT run.

## ⚠ The archive sweep: 59.7% — the highest on record, and above BOTH recorded triggers

```
python3 scripts/loops/roadmap_scope.py
  8256 / 13836 = 59.7%    (this wake's slice commit — the highest on record)
  8056 / 13635 = 59.1%    (previous wake's tip, for the trend)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the tenth
sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the twelfth
at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 59.7% is **4.6pp above**
the level the tenth was dispatched at and **3.0pp above** the eleventh's. It
rose again this wake (59.1 → 59.7); the "six consecutive rises" before that is
the previous hand-off's count, carried and not re-derived here.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
3's grill end to end. **`249.12` is named again** (the previous hand-off counted a twenty-seventh consecutive wake; that ordinal is carried, not re-derived)
— the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. **11 targets
are NAMED by a still-open item** (`roadmap_scope.py` lists them) and must be read
before moving (236.2).

**And this wake found a reason the sweep is not free**, which belongs in that
decision: every slice moved to the archive leaves a one-line pointer in
`ROADMAP.md` under its full heading, and the defect Slice 368 found is an
instrument that read the pointer instead of the body. **A sweep grows the
population of that trap by one section per slice moved.** The mitigation is the
new `ENVIRONMENT.md` bullet, not a smaller archive — but the cost is real and
was previously unrecorded.

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
container arrived detached at `41946018` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,104**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**). **No
streak ordinal is carried forward**: §2 asks for the count, and the previous
hand-off's "twelfth consecutive container" is exactly the kind of prose figure
this wake's verifier pass removed from its own draft.

**No `git worktree` and no `git stash` were used this wake.** The three probes
(the marker counter, the injection harness and the pointer-shadow variant) lived
in the scratchpad and never in the repo; the injected copy of
`ROADMAP-archive.md` was written to the scratchpad and deleted after the run,
and the tracked file was never modified — `git status` was clean of it
throughout.

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
   **OWNER OR ARCHITECTURE CALL**. Wake after wake has declined a sweep for want
   of the trigger this item would supply (the previous hand-off counted
   twenty-seven; that ordinal is carried, not re-derived), and the share has now
   passed **both** recorded dispatch levels (59.7% against 55.1% and 56.7%).
   Its filed grounds are *low urgency, "the sweep keeps happening regardless"*.
   **This wake adds a cost to that decision that was not on the record:** each
   archived slice leaves a heading-plus-pointer stub in `ROADMAP.md`, and Slice
   368's defect is an instrument that counted the stub instead of the body. The
   sweep is still probably right; it is not free.
3. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
4. **`335.1` cannot be settled by any cloud wake**, re-confirmed this wake by
   measurement rather than carried: `viewer { login }` → **403**, repo
   permissions all false. A local wake can do it in one command, or the owner
   can file a throwaway Q&A discussion and let the next wake read it.

**A fifth thing, carried forward and still true:** `ENVIRONMENT.md` has no size
discipline and no longer has an item asking for one. `332.1` closed on the
finding that the file is long because the environment is hostile. This wake
**added 29 lines to it** (the pointer-shadow trap), which is the first thing to
weigh if the owner wants that discipline. **If so, that is a different item and
needs filing**; no wake should infer it from a closed one.

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages. Whether those
samples *should* teach the cast is a judgement about the docs, not a lint
decision, and the item says refusing part of it is a satisfying outcome.

**The loop-mechanics question is still FOUR items deep** — `349.1`, `350.1`,
`351.1` and `353.2`. Slice 368 filed nothing and refused a fifth for the third
time running. The item-id label behaviour is **8 consecutive Continue/Standardize
rows** — 358, 360, 361, 362, 363, 365, 366, 367 — measured this wake by mapping
each row's sha to the slice number in its own commit subject, not carried. (This
wake's own row is an `Objective` row and produces no label, so the count is
unmoved.) What Slice 368 did add is the instruction in `LOOPS.md` §6 step 0,
which is the first time that correction has been written anywhere durable.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md` is
**byte-for-byte unchanged**; `LOOPS.md` gained **17 lines** in §6 step 0 and
nothing else, entirely below `## Playbooks`, so the dispatch region a wake reads
every wake is unmoved at **7,552** words.
