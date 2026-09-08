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
at hand-off apart from this file and the recording it belongs to. **No collision
this wake** — `origin/main` read `954ae4a3` at Step 0 and `954ae4a3` again at the
mandated pre-commit fetch, and it arrived as a plain fast-forward
(`d876765..954ae4a`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED at recording time, and that report described
the PREVIOUS version of this file** — the recording runs before the rewrite. It
named 4 archived ids (`94.11`, `312.2`, `192.1`, `321.1`, every one a *rule*
cited by number) and 9 recorded `[x]` closed. Against the file **as it now
stands**, every closed id named below — `333.1`, `334.1`'s figures, `310.1`,
`324.3` — is described as closed or as a precedent, never as open work. **Re-run
it against this file rather than trusting that sentence.**

## ⚠ RULE 2 FIRES NEXT — `Standardize` IS OVERDUE AT `4 / 4`, AND RULE 3 IS ALSO OVERDUE

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   4 / 4 Continue rounds   OVERDUE
Objective     3 / 3 slices            OVERDUE  [331, 332, 333]
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0. **Rule 2 advanced 3 → 4 of 4 and preempts**, so the next
wake runs a **Standardize sweep — say `n of 4` lanes in the write-up**, all four:
`scan:dead-style`, `report:css-repeats`, `report:prose`, and lane 4, the
roadmap-regrowth ratchet that four consecutive sweeps forgot.

Rule 3 is also OVERDUE and sits *below* rule 2, so it does not fire this time;
it will be waiting.

**The rule-3 counter credits `[331, 332, 333]`, not 360/361/362, and that is the
KNOWN behaviour, not a new bug.** The row's item text leads with `333.1`, so
`SLICE_TOP` reads 333. Slices 358, 360 and 361 hit the identical thing and each
recorded it. **No sixth parser item is filed** — `355.3`'s precedent, `359.4`'s
refusal, and `LOOPS.md`'s own note that widening the regex is not the lesson.

## What landed: Slice 362 — `333.1` DECIDED (`tsconfig`, not a gate), and a 22-day-old dead import deleted

**Dispatched by rule 4**, exactly as the previous hand-off predicted. `333.1`
asked whether a gate should forbid a never-used frontmatter `const` in an
`.astro` page, and named **"finding the base rate has moved off zero"** as a
satisfying outcome alongside deciding to build nothing.

**Answer: the base rate is 0 for the predicate as written and 1 for the same
predicate one AST node kind wider.** Every command beside its figure:
`.roundtable/measure-333.1-unused-frontmatter-bindings-2026-09-08.md`, which
also carries the instrument verbatim so the number is re-runnable rather than
re-derivable.

```
152 tracked .astro file(s)
frontmatter bindings: const 600, import 518, total 1,118   (517 / 1,117 after the fix)
never-used const  : 0 of 600      ← the item's figure, confirmed
never-used import : 1 of 518      ← the population the item did not cover
```

**The one hit was live and old.** `js-behaviors.astro`'s
`import eventsManifest from '@busy-office/ui/events';` — its use was removed by
`bb4ece7c` on 2026-08-17 (Slice 23 item 6) and the import stayed. **22 days.**

**The premise was re-checked before it was used** (CLAUDE.md: when an item's
premise is an earlier wake's measurement, re-checking it is part of the
criterion). Every clause of `333.1`'s tsconfig paragraph reproduces exactly. One
clause added rather than corrected: `typescript` **is** on disk at 5.9.3,
declared by `packages/core` for stylelint, so the compiler was never the missing
piece.

## The decision, and what each option costs

- **`tsconfig` — CHOSEN.** `astro check` + `noUnusedLocals` found the same
  import independently (two instruments reconciling) **plus** an unused template
  param the scan's population cannot express. Filed as **`362.1`**.
- **A gate — REFUSED.** Not because it would not work: the predicate is exact,
  so 94.11's wall does not apply, and `310.1`'s clean-base-rate precedent fits
  this population better than it fitted that one. It is refused for duplicating
  a **subset** of a compiler flag while costing a 54th gate — which moves the two
  counts `derive-readme-facts.mjs` stamps on the **npm front page** and forces a
  README re-stamp gated inside the core build.
- **"Neither" — REFUSED**, on the 22 days.

## This wake's own output was wrong once, and it was the expensive direction

**The tsconfig spike's first run reported 101 errors, 76 of them
`ts(2307) Cannot find module '@busy-office/ui/api' or its corresponding type
declarations`.** That reads as *the shipped package has no types for its subpath
exports* — an adopter-facing product claim, and the most quotable thing this
wake produced. **It is wrong**: `packages/core/dist` did not exist in this
container. After `npm run build -w @busy-office/ui` the same command reports
**23 errors / 0 warnings / 27 hints over 164 files in 17s** and **zero**
`ts(2307)`.

Caught by asking what would make the number wrong *before* quoting it. It was
one sentence from reaching this file.

**So `362.1` carries that dependency as load-bearing**: the gate is meaningless
unless `packages/core` has been built first.

## Every figure that could be a 100% carries a control

- The detector ships **eight self-test cases**, including the three that would
  otherwise let it pass while measuring nothing: a binding named **only inside
  an HTML comment** must still be flagged; an import used only as a **component
  tag** must not be; one half of a destructured `const` must flag alone.
- **The injection was confirmed structurally, not assumed.** `savingMarkup`
  landed at **line 7** of a frontmatter running lines **1-66** — so not in a
  comment — the binding count moved **600 → 601**, and exactly one hit was
  reported. Reverted to the same blob sha `526f9b24`. The target page was chosen
  *because* it names `savingMarkup` in three prose comments.
- **Byte-identical is a suspiciously tidy result**, so the deletion's
  render-neutrality proof was red-proved: `cmp` of the same saved page against a
  *different* built page DIFFERS, so the comparison discriminates.

## A correction owed to an open item: `334.1`'s pinned gate counts were stale

`334.1` and `check-selftests.mjs`'s header both read *"`scanGates()` reports
**54 / 20 / 34** today, so counting this file as a heuristic gate makes it
**55 / 21 / 34**"*. The live reading is **already 55 / 21 / 34** without the
retag — `check-print-tokens.mjs` landed in between — so the *forecast* value had
become the *current* value and reads as if the retag were done. Both are
re-expressed as the property; **no value is pinned in either place any more.**

## ⚠ The archive sweep: re-read it, do not quote this line

```
python3 scripts/loops/roadmap_scope.py --rev <sha>
  954ae4a3  6,545 / 12,480 = 52.4%     (this wake's Step 0 tip)
  9307c6aa  6,709 / 12,724 = 52.7%     (this wake's slice commit — the highest on record)
```

**52.7% is ~11pp above the last sweep anyone actually took (`324.3`, 41.5%) and
2.4pp below the 55.1% at which the tenth sweep was dispatched.**

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**.

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake
was rule 4's item end to end. **`249.12` is named for a TWENTY-SECOND
consecutive wake** — it is the open **OWNER OR ARCHITECTURE CALL** on the
archival trigger. **The next wake runs a Standardize sweep, whose lane 4 is
exactly this ratchet** — so it is that wake's to weigh, with the number
re-measured.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none. It touched one `.astro` page, and the removal is proved
render-neutral by something stronger than a screenshot: `md5`
`a8e5762c946cf70dde4187b4698bd8e1`, **89,440 bytes** and **529** dist files
before and after a full `rm -rf apps/docs/dist && npm run docs:build` — never a
bare `astro build` (`ENVIRONMENT.md` §3).

**The eight older debts are unchanged and unspent**, and nothing this wake did
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** and the RF tile
grid on `/patterns/rf/rf-landing-rf/` at both widths); and the four older ones —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**, in
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size` **139**
payload files / 382.7 kB gz, `check:readme-facts`, `check:package` **185** files),
core `test`, `lint:css`, `docs:build` (carrying `check:slice-refs` **1,010**
assertions / **382** citations / **344** slice numbers, `check:selftests`
**55** gates / **21** heuristic / **34** exact / 172 cases run, `check:floor`,
`check:vendor-names`, `check:imports`, `check:page-shape`, `check:wrong-choice`,
`check:metadata`, `check-markup`), `check:claims` (**176** live · 3 NOT
VERIFIED, which is `ENVIRONMENT.md` §6b's container fact, not a regression),
`check:formatting`, `check:scroll`, `check:layout`, `check:forced-colors`,
`test:axe`, `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app`, `check -w create-ui`, `npm run suite`
(**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit **and before the slice commit** (it gates `.roundtable/**`
content), and again after this file was written, per `ENVIRONMENT.md` §3b,
before the push.

**The `verifier` agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially and **every load-bearing figure
re-run from scratch** — the open/P0 counts (**28** / **0**), the scan on the
staged tree (**600 / 517 / 1,117**, never-used **0**), both `-S'eventsManifest'`
shas, the built-page md5 and the 529 file count, the only gate added since
`ac4a9a0f`, the 23-error file breakdown summing to **23**, and the 22-day
arithmetic. All reproduced.

## The throwaway install was cleaned up, and this is how that was checked

`@astrojs/check` was installed `--no-save` and `apps/docs/tsconfig.json` written
by hand for the spike. Both are gone: `npm ci` restored `node_modules`
(`ls -d node_modules/@astrojs/check` → No such file or directory), the tsconfig
was deleted, and `git status --short` and
`git diff --stat package-lock.json apps/docs/package.json` were **both empty**
before any commit. **`package-lock.json` was never modified** — `--no-save`
behaved, and it was verified rather than assumed.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous seven
  wakes; an eighth identical sample moves nothing rule 5 can read.
- **`dispatch-region-words`** — not sampled. `LOOPS.md` is byte-for-byte
  unchanged this wake; `353.2` is open about exactly this name.
- **An `astro-check-errors` = 23 metric was considered and REFUSED**, even
  though `362.1` genuinely reads that number. It would be a single-day name —
  39 of 47 names already have only one day and cannot be an input to a rule that
  compares two runs — and `362.1`'s Accept asks for the before/after pair **in
  the item's own write-up, from a built tree**, which a bare sample cannot
  express. The number lives in ROADMAP 362 and in the measure file, with the
  build precondition attached.
- Rule 5's line reads `ok`, not `STALE` and not `SKEW`, so the rule had input.

## The open set is 28 — no P0

`roadmap_scope.py` and the raw checkbox count agree at **28**. Slice 362 closed
`333.1` and filed `362.1`, so the set held steady at 28.

- **cloud-takeable: 17** — `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`,
  `352.1`, `352.2`, `353.2`, `362.1`.
  **`334.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached — and this wake has just corrected its stale figures, so read the
  amended text rather than a memory of it. `335.1` still carries its caveat —
  settling it may mean filing a throwaway Q&A discussion, an outward-facing
  write to a public repo whose permission has **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7`
  (owner- *and* browser-blocked), `249.10`, `249.11`, `249.12`, `249.13`,
  `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

17 + 10 + 1 = 28, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step 1
committed nothing. **Issue #2's `updated_at` has not moved for a TWENTY-EIGHTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 28 open items. Rule 2 read `Standardize 3 / 4 ok`. Rule 3 read
`Objective 2 / 3 ok`. **Rule 4 matched**, and its oldest cloud-takeable item was
`333.1`; the oldest open item overall is still Slice 15, owner-blocked. Rules
5-8 not reached. **Rule 5 would not have fired** — its line read `ok`: **0**
wake-dates newer than the newest pair, 8 of 47 names paired across days.

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

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `954ae4a3` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, **50**
commits); `git fetch --unshallow origin` completed inside the timeout, giving
**2,091** commits and **8** tags, and left no `shallow.lock`. Per §2 the tag
count is the check, not a pinned value — this container's `--unshallow` again
brought them.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `954ae4a3` (the Step 0 tip) or `9307c6aa` (the slice commit).

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
   **OWNER OR ARCHITECTURE CALL**. Twenty-two consecutive wakes have declined a
   sweep for want of the trigger this item would supply. Its filed grounds are
   *low urgency, "the sweep keeps happening regardless"* — that premise has now
   been weakening for twenty-two wakes.

**A fourth thing, carried forward from the previous hand-off and still true:**
`ENVIRONMENT.md` has no size discipline and no longer has an item asking for
one. `332.1` closed on the finding that the file is long because the environment
is hostile. **If the owner wants it shorter anyway, that is a different item and
needs filing**; no wake should infer it from a closed one.

**A fifth thing, new and worth the owner's eye: `362.1` will change published
sample code.** Adopting `astro check` means resolving 22 DOM-narrowing errors
inside inline `<script>` blocks that readers copy off pattern pages — casting
`querySelector` results, mostly on `/patterns/value-help` and in
`Gallery.astro`. Whether those samples *should* teach the cast is a judgement
about the docs, not a lint decision, and the item says refusing part of it is a
satisfying outcome.

**The loop-mechanics question is still FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and **deliberately added
none**, on `355.3`'s and `359.4`'s precedent: the rule-3 counter crediting
`[331, 332, 333]` instead of 362 was met, recognised as documented behaviour,
and left unfiled.

**Nothing this wake did is outward-facing or hard to reverse.** `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged**.
