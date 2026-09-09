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
**No collision this wake** — `origin/main` read `44a7deae` at Step 0 and
`44a7deae` again at the mandated pre-commit fetch, and it was already the local
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
**2** archived ids (`94.11`, `312.2`, both *rules* cited by number) and the
recorded `[x]` closed ids it names — `334.1` (closed by this wake and named as
exactly that); `364.1`, `331.1`, `332.1`, `333.1`, `341.1` (history, the subject
of the previous wake's grill); `355.3` and `359.4` (named only as precedent for
not filing a parser item); `324.3` and `297.1` (precedent); and `310.1` (named
as an unspent *visual debt*, not as open work). **Nothing here claims an open
item that is not.** Re-run the check against this file rather than trusting this
paragraph.

## ⚠ WHICH RULE FIRES NEXT — rule 4 again, and the counters are NOT spent

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   1 / 4 Continue round    ok     ← advanced by THIS wake
Objective     1 / 3 slice             ok  [334]
Optimize      0 wake-date(s) newer    ok    (8 of 47 names paired across days)
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 26 open items). Rules 2, 3 and 5 all read
`ok`, so **rule 4 is the first rule that matches next wake**. Its item is below.

**The parser oddity recurred, for a SIXTH time.** This wake's row leads with the
item id `334.1`, so `SLICE_TOP` credits **334** rather than Slice **365**, and
the rule-3 line reads `[334]`. Slices 358, 360, 361, 362 and 363 each hit the
same leading-item-id behaviour. **No parser item is filed**, on `355.3`'s
precedent, `359.4`'s refusal, and `LOOPS.md`'s own note that widening the regex
is not the lesson. It costs nothing here: the count is right, only the label is.

## What landed: Slice 365 — `334.1` decided, RETAG

**Dispatched by rule 4** on the oldest cloud-takeable open item, exactly as the
previous hand-off predicted.

**The item's premise was tested before the decision and is recorded FALSE.** It
reads *"its verdict used to rest on a `readdir` and a tag comparison. It now
also rests on matching `SELF_TEST_MARKER`…"* — i.e. the marker made this gate a
recogniser. Two of its three text legs **predate** the marker and both produced
a wrong verdict on the real tree: until `18791d5` tags were classified with
`src.includes('@exact')`, so a header explaining a retag read as claiming BOTH
(and that repair's own first draft reported **eight** gates untagged); and the
first version decided `owed` by matching the string `--self-test`, which every
heuristic gate satisfies because the tag TEXT says "Carries --self-test".

**The spoof the item hypothesised was executed, not reasoned about.** A probe
carrying 315.1's defect verbatim — a real `--self-test` branch below an early
`process.exit(0)` — plus ONE line of prose made the gate report **PASS** (56
gates / 22 heuristic / **175** cases); the identical probe with that one line
changed to `console.log('probe ran')` reported **FAIL**, naming 315.1's defect.
The count published to the npm front page took **+3 cases from a probe that ran
none**.

**Decision: `@heuristic`.** The self-exclusion is gone, `declaresTag` and
`runsSelfTest` are module-scope so the new `--self-test` (11 cases) can drive
them, and both READMEs were re-stamped in the same commit. **Read the gate's own
line rather than a value here:** `55/21/34 → 56/22/34`, total and heuristic each
+1, exact unmoved, and `check:readme-facts` + `stamp-readme --check` agree.

## Three findings the retag produced that nothing had asked for

- **The gate went red on its own glossary.** The header paragraph *defining* the
  two tags sat at the declaration position, so the moment the file stopped
  exempting itself it read as claiming BOTH. CLAUDE.md's *an assertion tripped
  by its own explanation*, in the file that documents it — and the same defect
  `18791d5` fixed for every OTHER gate, surviving only because this one was
  exempt. Fixed by quoting the two names.
- **The branch must sit above the SPAWN LOOP, not above the scan — and the first
  attempt to prove that came back GREEN.** `scanGates` is a pure read and spawns
  nothing, so a branch below it still terminates. Below the loop it **did not
  terminate (killed at 30s)** against **0.041s** where it now sits. The
  paragraph written beside the finding had said "below the scan" and was wrong:
  a red-proof that comes back green was a defect in the *sentence*.
- **A self-test fixture can satisfy the predicate it tests.** Spelled whole, the
  positive control for "a mention is not an implementation" would itself match
  `runsSelfTest` against this source. Split; the literal now greps **1**.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is structural rather than a judgement: **the diff is
one gate script, `ROADMAP.md`, the derived `readme-facts.json` and the two
stamped README lines**. No CSS rule, no docs page, no `.astro` file, no shipped
JS — `git diff --stat` was read to confirm that, not assumed.

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
**185** files), core `test` (**165** tests), `lint:css`, `docs:build` (carrying
`check:selftests` **56 / 22 / 34** with **183** cases, `check:slice-refs`
**1,016** assertions / **385** citations / **347** slice numbers,
`check:loop-vocab`, `check:floor` **601** source files, `check:vendor-names`
**623** files, `check:imports`, `check:page-shape`, `check:wrong-choice`
**158** assertions, `check:metadata` **1,159** assertions, `check-markup`),
`check:claims` (**176** live, **3 NOT VERIFIED**, which is `ENVIRONMENT.md`
§6b's container fact, not a regression), `check:formatting`, `check:scroll`
(**914** containers), `check:layout` (**128** pages), `check:forced-colors`,
`test:axe` (**128** pages × 2 widths, zero violations), `check:target-size`,
`check:search`, `check:pseudo` (14 pages × 2 widths), `check:quickstart`,
`check:po-app` (**20** behaviours), `check -w create-ui`, `npm run suite`
(**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit **and before the slice commit** (it gates `.roundtable/**` and
`ROADMAP.md` content), and again after this file was written, per
`ENVIRONMENT.md` §3b, before the push.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing. **It caught two
of this wake's own defects**, both in the change rather than in the measurement
— an inline comment still asserting the refuted "below the scan would recurse",
and the self-satisfying fixture above. Both were fixed and the gates re-run
before the commit.

## The metric recorded, and the reason for each candidate not recorded

- **`gates` = 56, RECORDED.** It is a real movement this wake produced
  (`55 → 56`), on a name already day-paired, so it is an input rule 5 can read.
  Its line now shows `2026-09-07 55 → 2026-09-09 56  +1`. **That is coverage
  growth, not a regression** — one pair, one direction, and rule 5 wants two
  consecutive regressing runs. The verdict is this wake's, as
  `dispatch_status.py` says outright.
- **`claims`** — read **176** live, identical to the 2026-09-07 sample already
  in the pair. A same-value sample moves nothing rule 5 can read.
- **`dispatch-region-words`** — `LOOPS.md` did **not** change this wake, so the
  number the name tracks cannot have moved.
- **`axe-violations`** — 0 again; the line already marks it `NEVER MOVED`,
  because `test:axe` fails above 0.

## The open set is 26 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **26**. Slice 365 closed
`334.1` and opened nothing, so the set fell 27 → 26.

**Its two counts reconcile with `check:resume-slice-ids`'s and the difference is
not a finding**: 26 open / **109** closed against that check's 26 / **111** —
the two extra are the `[x]` items under the non-slice `## STATE` heading, which
`roadmap_scope.py`'s own output lists as outside every figure it prints.

- **cloud-takeable: 15** — `335.1`, `336.2`, `337.1`, `338.1`, `339.2`,
  `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`,
  `353.2`, `362.1`.
  **`335.1` is the oldest of these, and rule 4 reaches it next wake.** It still
  carries its caveat — settling it may mean filing a throwaway Q&A discussion,
  an outward-facing write to a public repo whose permission has **not** been
  tested. If that is the blocker, say so and take the next item rather than
  attempting the write. **`362.1` carries Slice 364's amendment** on the
  `include`, and Slice 365 did not touch it.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7`
  (owner- *and* browser-blocked), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

15 + 10 + 1 = 26, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step 1
committed nothing. **Issue #2's `updated_at` has not moved for a THIRTY-FIRST
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 27 open items at Step 0. Rule 2 read `Standardize 0 / 4 ok` and did not
match. Rule 3 read `Objective 0 / 3 ok` and did not match. Rule 5 read
`Optimize 0 wake-date(s) newer — ok` and was EVALUATED, not skipped: its movers
were `dispatch-region-words` (+60) and `claims` (+7), neither a regression.
**Rule 4 matched**, on `334.1`. Rules 6-8 not reached, so
`polish_requeue.py --apply` was correctly NOT run.

## ⚠ The archive sweep: 56.4% — it has CROSSED the tenth sweep's trigger and is 0.3pp under the eleventh's

```
python3 scripts/loops/roadmap_scope.py
  7481 / 13254 = 56.4%    (this wake's slice commit — the highest on record)
  7177 / 13103 = 54.8%    (previous wake's tip, for the trend)
```

**Measured, and it corrects this section's own first draft.** The draft
predicted the share would *fall slightly*, reasoning that Slice 365 adds open
narrative. It does not: 365 closed its only item, so all **151** of its lines
count as closed history and the share ROSE **1.6pp** in one wake — the largest
single-wake move in the record here. That is CLAUDE.md's Accept-criterion rule
biting a hand-off instead of an item: the forecast was written, then the command
was run, and the command won.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. 56.4% is
**1.3pp above** the level the tenth was dispatched at and **0.3pp below** the
eleventh's, and it has risen on each of the last four wakes.

**Not dispatched by this wake, and the reason is scope**: an archive sweep is a
hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was rule
4's build end to end. **`249.12` is named for a TWENTY-FIFTH consecutive wake**
— the open **OWNER OR ARCHITECTURE CALL** on the archival trigger. **9 targets
are still NAMED by a still-open item** and must be read before moving (236.2).

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
container arrived detached at `44a7deae` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit;
re-read as `main` before committing.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,098**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**), which
is the tenth consecutive container to do so.

**A `pkill -f "check-selftests.mjs"` KILLED THIS WAKE'S OWN SHELL** (exit 144),
because the pattern matched the bash command line running it. It cost nothing —
a `git checkout` that had not yet run was simply re-run — but the lesson
generalises: **never `pkill -f` on a pattern that appears in your own command.**
Kill a process group you created instead (`start_new_session=True` +
`os.killpg`), which is what the successful measurement used.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `44a7deae` (the Step 0 tip) or `ae10db97` (the slice commit).

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
   increment `dry`. Not touched this wake; rule 6 was never reached.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Twenty-five consecutive wakes have declined a
   sweep for want of the trigger this item would supply. Its filed grounds are
   *low urgency, "the sweep keeps happening regardless"*; that premise has been
   weakening for twenty-five wakes.

**A fourth thing, carried forward and still true:** `ENVIRONMENT.md` has no size
discipline and no longer has an item asking for one. `332.1` closed on the
finding that the file is long because the environment is hostile. **If the owner
wants it shorter anyway, that is a different item and needs filing**; no wake
should infer it from a closed one.

**A fifth thing, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages. Whether those
samples *should* teach the cast is a judgement about the docs, not a lint
decision, and the item says refusing part of it is a satisfying outcome.

**The loop-mechanics question is still FOUR items deep** — `349.1`, `350.1`,
`351.1` and `353.2`. Slice 365 filed nothing and refused a fifth on the sixth
recurrence of the `SLICE_TOP` label behaviour.

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md`,
`LOOPS.md` and `ENVIRONMENT.md` are **byte-for-byte unchanged**. The two README
lines that moved are derived and regenerated by the core build, not hand-typed.
