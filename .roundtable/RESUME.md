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
at hand-off. **No collision this wake** — `origin/main` read `d8767657` at Step
0 and `d8767657` again immediately before the first commit, and again after the
gate suite.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

## ⚠ READ THIS FIRST: RULE 3 IS NOW OVERDUE AND IS THE NEXT DISPATCH

`dispatch_status.py`, read immediately after this wake's recording:

```
Standardize   3 / 4 Continue rounds   ok
Objective     3 / 3 slices  [325, 327, 353]   OVERDUE
Optimize      0 wake-date(s) newer     ok
```

Rules 1 and 2 are clear, so **rule 3 matches and dispatches Objective** — a
grill of the armed set. **Re-run the script**; a collision could land a row
between this line and your wake, and rule 3 collides harder than rule 4
(Step 0c: both dispatchers get the same arming set and duplicate a whole wake,
not one item).

**`349.1` reproduced a FIFTH time, and in a new form — read that beside the
counter line.** The armed set names **`327`**. This wake did not write Slice
327 or close it; Slice 327 closed on 2026-09-07. What this wake did was close
the *item* `327.3` and write **Slice 354**, and because the recorded row's item
text begins `327.3 — …`, the counter attributes the round to slice **327** and
never names **354** at all. So the counter's arming set can now point at a
slice closed a day earlier while omitting the slice the wake actually wrote.
That is `349.1`'s point (rule 3's text says slices *closed*; its counter means
slices *named by a building row*) in a third distinct shape.
**Recorded here, not acted on** — `349.1` is open and needs whoever owns
`LOOPS.md`'s text. A grill dispatched by rule 3 should read the armed set as
`[325, 353, 354]` and check `327` only insofar as `327.3` closed into 354.

## What landed: Slice 354 — `327.3` answered, on its stated satisfying branch

**Rule 4 dispatched this** on the oldest still-open item no other kind of block
covers. Every open item older than it was re-checked in the file rather than
carried from the previous hand-off: Slice 15's AT-runtime item (owner
hardware), `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4`, `249.7` (its own
closing text: *"still waiting on 249.10"*), `249.10`-`249.13`, `273.2`, `296.3`
all owner-blocked; `320.3` browser-blocked in the screenshot sense, which its
own Accept says in as many words.

**Verdict: the rule is fine, the practice is the gap, nothing built, no gate
proposed** — which `327.3`'s Accept names as a satisfying outcome, conditional
on the count carrying its command.

**The count, under a definition fixed before reading anything** (*the slice
inventories the claims it ships BESIDE its headline measurement and names an
instrument — or an explicit "none" — for each*):

- **1 of 161 (0.6%)** carry the inventory 192.1 prescribes — **Slice 278**.
- **3 of 161 (1.9%)** apply it forward to at least one non-headline claim —
  `227`, `239`, `278`.
- 3 more attribute an instrument *kind* collectively rather than per claim —
  `256`, `258`, `294` — counted in neither.

**The diagnosis, and it is what makes the count mean something:** the corpus
quotes the paragraph's **observation** half and drops its **instruction** half.
Of 21 non-self citations, **11** quote *"the defect lands in what shipped
BESIDE the number"* and **1** reaches *"list the other claims … name the
instrument for each"* — and that one (`193`) is a table restating the rule, not
an application of it. **19 of the 21 are retrospective diagnoses.** 17 of the
22 citing slices are Objective grills: **43.6% of grills against 4.1% of
everything else, 10.6x**. And the one slice that executed the inventory,
`278`, **never cites the item number**, so citation tracks diagnosis rather
than practice and both errors point the same way.

**The base rate was measured before any gate could be proposed**, as the item
requires, and it kills the checkable shape: *contains `instrument`* is true of
**65.2%** of the population **and 31.6% of slices written before the rule
existed**; *`measur*`* reads 94.4% / 73.6%. 94.11's rule — no gate, no
mechanism, the finding is the count.

## Three of this wake's own detectors were wrong first — all published

CLAUDE.md's base rate arriving on schedule, and the third is the expensive one:

- **`git log -S` on the rule's own sentence returned NOTHING.** The phrase
  spans a line break in `CLAUDE.md`, and `-S` matches the raw blob, so a full
  quoted phrase reads as *"this never landed"*. `-S'instrument for each'`
  answers `c75d721e` at once. **`ENVIRONMENT.md` trap 2's shape a fourth time**
  (after `git tag`, `/discussions`, `actions/runs?head_sha=`).
- **The instruction-half needle read `0 of 21` before widening** from
  `instrument for each` to `instrument for` — Slice 193's line says *"name the
  instrument for every other **claim**"*, singular, no *each*. Both readings
  are published; the 0 sat in the slice's own heading for one draft, which is
  exactly the failure the slice is about.
- **A context-window regex reported an ABSENCE in the one slice the count
  names.** `re.findall(r'.{60}instrument for.{40}', text)` returns `[]` for
  Slice 278 where a plain `count()` returns 1 — the match begins at char **56**
  of a **78**-char line, so neither window fits. CLAUDE.md names this trap
  verbatim and prescribes the control that caught it: **plain fixed string
  first, context only after you know the count.**

**Slice 354 also carries the claim inventory 192.1 prescribes**, with an
instrument named per claim and an explicit *read off the code, no instrument*
for the two sentences that have none. That makes it the second execution of
the instruction half in the corpus and the first outside `278` — deliberately,
since a slice measuring how rarely this is done and not doing it would be the
fourth instance of the shape it describes.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous wake's
  reading. Nothing this wake touched the claim corpus, so a sample would add a
  day bucket carrying no information.
- **`dispatch-region-words`** — not sampled, and `353.2` is open about exactly
  this name (sampled by hand under a body-only convention while the instrument
  prints the headings-included one, with no revision recorded beside a sample).
  Recording another hand-typed value would deepen what was just filed.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139 payload files / 382.7 kB gz**, tightest headroom 110 bytes, unchanged.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is **`ROADMAP.md` alone** plus the
recorder's own two files. No `.astro`, no CSS, no built page changed content —
`docs:build` ran green three times on the same **128** pages as the previous
wake.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure,
the barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/`
at both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: not all 17 CI-runnable entry points were run — say which.** Green in
this container: core `build` (incl. `lint:css`, `check:size` 139 files /
382.7 kB gz, `check:readme-facts`, `check:package` 185 files), core `test`
(**165** passed), `lint:css`, `docs:build` **three times** (carrying
`check:slice-refs` **998** assertions / **378** citations / **336** slice
numbers, `check:floor` **594** files, `check:vendor-names` **615**,
`check:imports`, `check:repo`, `check:loop-vocab`, `check:selftests`,
`check:page-shape`, `check:wrong-choice`, `check:metadata` **1,159**
assertions), `check:claims` (**176** live · 3 NOT VERIFIED, which is
`ENVIRONMENT.md` §6b's container fact, not a regression), `check:formatting`,
`check:layout` (**128** pages), `test:axe` (128 × 2, zero violations).

**NOT run this wake, and named rather than implied:** `check:scroll`,
`check:forced-colors`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite`. The
reason is that the diff touches no CSS, no `.astro` and no built page, so none
of them reads anything that changed — but **that is a judgement, not a
measurement**, and CI has no `paths-ignore`, so CI runs all of them on this
push. Check the run.

**Said precisely.** `docs:build` was re-run after the last `ROADMAP.md`
correction, so it describes the committed tree; and re-run again after this
file was written, per `ENVIRONMENT.md` §3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2
step 6's verifier pass was done by hand: the staged diff re-read adversarially,
every number re-checked against the command that produced it. **It earned its
keep three times.** It caught the heading still carrying the pre-widening
**`0 of 21`** after the table beneath it said 1 — the slice's own headline
number being the stale one. It caught the character offset in the
context-window note, published as **43** and measured at **56** of a 78-char
line. And it caught a control hit asserted to be noise without being read:
the pre-rule corpus's single instruction-half match is Slice **176**, *"…
instrument for a re-entered surface…"*, which was then read and is a genuine
false positive — but the sentence had shipped before it was checked.

## The open set is 32 — no P0

`roadmap_scope.py` reports **32 open** at `95d4aca9`, and the raw checkbox
count reads **32 open / 90 closed**. `roadmap_scope.py` excludes the 2 `[x]`
items under the non-slice `## STATE` headings and says so in its own output.

This wake closed `327.3` and filed nothing new (33 → 32). **Re-run the script
at the commit** rather than quoting this.

- **cloud-takeable: 21** — `328.1`, `330.1`, `331.1`, `332.1`, `333.1`,
  `334.1`, `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`,
  `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`328.1` is now the oldest of these**, so it is rule 4's item once rule 3's
  Objective dispatch is spent. `335.1` still carries its caveat — settling it
  may mean filing a throwaway Q&A discussion, an outward-facing write to a
  public repo whose permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

21 + 10 + 1 = 32, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.** The eight ids older than `328.1` were re-read in
the file **this** wake, because rule 4 had to walk past them.

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
TWENTIETH consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 33 open items at dispatch. Rule 2 `Standardize 2 / 4`. Rule 3
`Objective 2 / 3` at dispatch time — **it crossed to 3 / 3 only on this wake's
own recording**, which is why rule 4 was correctly matched and rule 3 is the
NEXT wake's. Rules 5-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days. No sample was recorded this wake (reasons above), so
it is unmoved.

## ⚠ The archive sweep: the share is now ABOVE the level the LAST sweep was taken at — read this before the "declined again" habit

Measured, not carried. `roadmap_scope.py` read **4,533 / 11,024 = 41.1%** at
`d8767657` (Step 0), 22 eligible targets, **12** named by a still-open item
(236.2's report, read before concluding). **At the commit it reads
`4,942 / 11,267 = 43.9%` with 24 targets** — Slice 354 crossing to the closed
side plus 243 lines of new closed text, not regrowth of anything.

**The hand-off before this one wrote "still below every trigger". At 43.9%
that sentence is now FALSE and is corrected here rather than repeated**, which
is 192.1's own shape arriving in this file: the empirical record is 252.1
dispatching the tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**,
279.3 *declining* the twelfth at **40.6%**, and `324.3` *taking* the
thirteenth at **41.5%**. 43.9% is **above** the level at which the most recent
sweep was dispatched and above every declined reading on record.

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), rule 4 had
already dispatched, and the counter now says rule 3. **It is a live candidate
for the next wake** — and note `249.12`, still open, is the item saying no
stated trigger exists, which is exactly why this reading has to be compared to
the record by hand every time. **Re-run the script at your commit**; no figure
here describes your tree.

**`249.12` is named for a FOURTEENTH consecutive wake.** Fourteen consecutive
wakes have now declined a sweep on the absence of a stated trigger. **Nothing
is proposed here** — but this is the first of the fourteen where the measured
share exceeds the last taken sweep's.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs
the full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b
— *re-run `npm run docs:build` after writing this file, before pushing* — and
it was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never
`?head_sha=` with an abbreviated sha**, which answers `200` with an empty list
and reads as "no runs yet" (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 did NOT bite this wake** — `git branch --show-current` answered
**`main`** at Step 0, before any commit, and `HEAD` equalled `origin/main` at
`d8767657`, the previous wake's own tip. No `git checkout -B` was needed and no
`git stash` was used at any point. That is a reading, not an assumption: the
container arrives detached often enough that the check is what settles it.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any
figure was taken** — **2,074** commits at `HEAD`, no `shallow.lock`, and the
unshallow again brought the tags (`git tag | wc -l` → **8**, run rather than
assumed; `git fetch --tags origin` afterwards added nothing). This wake's
verdict is a history measurement, so the unshallow was load-bearing rather than
precautionary.

**No `git worktree` was used this wake.** Every figure describes either
`d8767657` (the Step 0 tip, named in the slice) or the commit stated beside it.

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

**The loop-mechanics question is still FOUR items deep** — `341.1`, `349.1`,
`350.1`, `351.1` — and this wake answered a fifth (`327.3`) without adding one,
which is the first wake in several to shrink the open set without filing a
successor. `349.1` reproduced a fifth time, in a new shape, on this wake's own
recording (see the counter block at the top): the arming set names a slice this
wake neither wrote nor closed, and omits the one it wrote. It still needs
whoever owns `LOOPS.md`'s text.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is one
markdown file plus the recorder's own two. `LOOPS.md`, `CLAUDE.md` and the
dispatch region are **byte-for-byte unchanged** — deliberately: the slice
refuses a prose edit to 192.1's paragraph for want of an instrument to judge
its effect.
