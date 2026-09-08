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
at hand-off. **No collision this wake** — `origin/main` read `614ce99e` at Step 0
and `614ce99e` again immediately before the first commit, and it arrived as a
plain fast-forward (`d876765..614ce99`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against THIS file, as it now stands, and the
report was read rather than deferred.** It names **4** archived ids — `94.11`,
`312.2`, `192.1`, `321.1`, every one of them a *rule* cited by number, not an
item — and **7** ids recorded `[x]` closed: `331.1` (closed by this wake, named
below as exactly that), `330.1`, `355.3`, `359.4`, `324.3` and `297.1` (all cited
as precedent and each said here to be closed), and `310.1` (named only as an
unspent *visual debt*, not as an open item). **Nothing here claims an open item
that is not.** `check:resume-charter` also passed — 14 rules. Re-run both against
this file rather than trusting that sentence.

## ⚠ RULE 4 IS NEXT AGAIN, AND ITS CLOUD-TAKEABLE ITEM IS `332.1`

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md asks
for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   2 / 4 Continue rounds   ok
Objective     1 / 3 slice             ok   [331]
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0. Rule 2 advanced 1 → **2 of 4** (this wake's row is a
Continue round). Rule 3 advanced 0 → **1 of 3**. **So rule 4 matches**, and its
oldest cloud-takeable item is now **`332.1`**; the oldest open item overall is
still Slice 15, owner-blocked (a human listening to a screen reader).

**The rule-3 counter credits `[331]`, not 360, and that is the KNOWN behaviour,
not a new bug.** The row's item text leads with `331.1`, so `SLICE_TOP` reads
331. Slice 358 hit the identical thing (its row named `330.1`, the counter said
330) and Slice 359 recorded it. **No sixth parser item is filed** — `355.3`'s
precedent, `359.4`'s refusal and `LOOPS.md`'s own note that widening the regex is
not the lesson. It is also not wrong in effect here: Slice 331's last open item
was `331.1`, so 331 did close.

## What landed: Slice 360 — `331.1` REFUSED, on the base rate its Accept demanded

**Dispatched by rule 4**, exactly as the previous hand-off predicted. `331.1`
asked for `install-prompts.md` (an owner-supplied contribution, on branch
`contribution/upstream-2026-09-06`, not on `main`) to be **generated from
`api.json`**, and its Accept said to *measure the base rate first* and named
refusing as a satisfying outcome.

**It differs materially, measured six ways:**

| finding | figure |
|---|---|
| the item's own premise number | **53** blocks, not 40 (40 is the api.json component count; Slice 331's own text already said 53) |
| markup's share of the file | **378 of 749** non-blank fenced lines, 50.5% |
| markup present in `api.json` | **0** — and `api.json` holds **0** substrings matching `/<[a-z]+[ >]/` across its 368 distinct keys |
| block set vs key set | 45 records (40 components + 5 primitives); **33 of 53** headings name one; **12** records named by none; `bo-date`, `bo-richtext` appear **0** times |
| taglines | **0 of 30** comparable lines equal `meta.tagline`; **27 of 30** differ by more than punctuation |
| the fallback source (docs pages) | naive **168/378 (44.4%)** is an artefact of line length — 107 hits under 25 chars; substantive lines are **61 of 263, 23.2%** |

Refused also on a ground **stronger** than the one the Accept anticipated: a
*generated* assistant-facing surface already ships —
`/getting-started/ai-assistants` (built from `DESIGN.md`'s tables + shared
`MARKUP_RULES`, throwing at build time if they do not parse) + `llms.txt` +
the `bo-check-markup` bin. And 196 of the file's 371 non-markup lines are four
sentences repeated 53/53/53/37 times, which `llms.txt` states once.

**Raw output and both scripts are landed**, not left in a scratchpad
(`321.1`'s lesson): `.roundtable/measure-331.1-install-prompts-base-rate-2026-09-08.md`.

## Every zero and every 100% here carries a control

- `0` markup lines in `api.json` — three controls: `bo-btn--secondary` **True**,
  `bo-data-table__row-select` **True**, `bo-not-a-real-class-xyz` **False**.
- `0` prompt coverage for `bo-date`/`bo-richtext` — controls `bo-btn` **29**,
  `bo-zzz-not-real` **0**.
- `0 of 30` taglines identical — control: the comparator called a tagline
  identical to **itself**.
- The docs-overlap control **FAILED on its first form** and that is what produced
  the corrected number: the positive probe asserted a line the docs turned out
  not to contain. Re-run with the probe taken from the hit set, and with a length
  filter, the 44.4% became **23.2%**.

## This wake's own output was wrong twice, and both were caught before the push

1. **The record-coverage table read "45 of 45 records uncovered"** while 33
   headings had matched — a set built of *strings* differenced against a set of
   *tuples*. A 100% is a defect until proven otherwise; fixed and an
   `assert covered <= allrecs` added.
2. **The Reusability verdict said "77% would be a third copy of strings the docs
   pages hold" — backwards.** The 76.8% is precisely the part the docs pages do
   NOT hold. Corrected to name both halves. It is 192.1's shape again: the
   measurement was right and the sentence beside it was wrong.

**And two heuristic attributions were discarded, not shipped.** Attributing a
prompt block to an `api.json` record by its CSS classes failed a discrimination
control twice (most-frequent-owned-class put `Alert`/`Dialog`/`Offcanvas`/
`OrderedList` under `button`; first-owned-class put `Dialog` under `button` and
`ScanInput` under `data-table`). Every published figure uses exact heading/key
equality only. The failure is recorded in the slice as the finding it is.

## ⚠ The archive sweep: re-read it, do not quote this line

```
python3 scripts/loops/roadmap_scope.py --rev <sha>
  614ce99e  6,033 / 12,166 = 49.6%     (this wake's Step 0 tip)
  cfd781ab  6,329 / 12,356 = 51.2%     (this wake's slice commit — the highest on record)
```

**This wake's own forecast of that second row was WRONG and the measurement is
what stands.** The draft of this file predicted **48.8%**, reasoning that Slice
360's 191 new lines land as open history and push the ratio down. They do not:
Slice 360 closes its only item in the same commit, AND closing `331.1` in place
makes **Slice 331** a closed slice too, so `roadmap_scope.py` counts **33** closed
slices at `cfd781ab` against 31 at `614ce99e` — 6,033 → **6,329** closed lines.
Running the script instead of trusting the prose is the whole of the correction.
Slice 357 recorded the same mechanic after its own forecast went the wrong way,
so this is twice now. **Re-run the script at the commit; never quote either
number from prose.**

**The empirical record, re-read rather than carried:** 252.1 dispatched the tenth
sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the twelfth
at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. **51.2% is ~10pp above
the last sweep anyone actually took**, above every declined reading on record, and
**3.9pp** below the 55.1% at which the tenth sweep was dispatched.

**Not dispatched by this wake, and the reason is scope, not the number**: a sweep
is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake was
rule 4's item end to end. **`249.12` is named for a TWENTIETH consecutive wake** —
it is the open **OWNER OR ARCHITECTURE CALL** on the archival trigger.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: `git diff --stat` was read to confirm the diff is
`ROADMAP.md`, one new `.roundtable/` report, `ENVIRONMENT.md`, this hand-off and
the recorder's own files. **No `.astro`, no CSS, no script and no generated
artefact changed.** Nothing was written into `apps/docs/dist` this wake.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container**, in
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size` **139**
payload files / 382.7 kB gz, `check:readme-facts`, `check:package` **185** files),
core `test` (**165** tests / 29 files), `lint:css`, `docs:build` (carrying
`check:slice-refs` **1,006** assertions / **380** citations / **342** slice
numbers, `check:floor` **598** files, `check:vendor-names` **620**,
`check:imports`, `check:selftests`, `check:page-shape`, `check:wrong-choice`,
`check:metadata` **1,159**, `check-markup` **166** files / 89,941 class uses),
`check:claims` (**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact, not a regression), `check:formatting`, `check:scroll` (**914**
containers / 118 pages), `check:layout` (**128** pages), `check:forced-colors`,
`test:axe` (128 × 2, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours),
`check -w create-ui`, `npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last `ROADMAP.md`
edit, and again after this file was written, per `ENVIRONMENT.md` §3b, before the
push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep** —
both corrections in the section above were made by that re-read, before the push.

## `ENVIRONMENT.md` was corrected in two places this wake

Both are durable-file corrections of the kind 169.3 split that file out for:

- **§2's `git tag | wc -l # 7 here` → `# run it`.** This wake counted **8**. The
  value drifts with every release, so pinning it converts a normal reading into
  an apparent disagreement — the exact failure the surrounding bullet describes.
- **§2b gained one paragraph: the `shallow.lock` trap bit AGAIN**, on this wake.
  The first `git fetch --unshallow origin` was killed by a **280s** tool timeout,
  left the 0-byte lock, and `git rev-parse --is-shallow-repository` still read
  `true` at 50 commits. `rm -f .git/shallow.lock` + a plain re-run gave **2,087**
  commits and **8** tags. **Recovery took one attempt because §2b was read
  first.**

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous five wakes;
  a sixth identical sample moves nothing rule 5 can read.
- **`dispatch-region-words`** — not sampled. `LOOPS.md` is byte-for-byte
  unchanged this wake; `353.2` is open about exactly this name.
- **`bundle-gz-kb`** — nothing this wake touched the bundle.
- Rule 5's line reads `ok`, not `STALE` and not `SKEW`, so the rule had input and
  did not need a fresh sample to be answerable.

## The open set is 29 — no P0

`roadmap_scope.py` reports **29 open** at the slice commit; the raw checkbox count
agrees. Slice 360 filed one item and closed it in the same commit, and closed
`331.1` in place, so the open set fell **30 → 29**.

- **cloud-takeable: 18** — `332.1`, `333.1`, `334.1`, `335.1`, `336.2`, `337.1`,
  `338.1`, `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`,
  `351.1`, `352.1`, `352.2`, `353.2`.
  **`332.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached — it asks whether `ENVIRONMENT.md`, which doubled in 8 days and
  which every wake reads whole, needs a size discipline. **This wake grew it by
  ~10 lines**, which is a datum for that item, not an argument against it.
  `335.1` still carries its caveat — settling it may mean filing a throwaway Q&A
  discussion, an outward-facing write to a public repo whose permission has
  **not** been tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware), `112.3`
  (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict), `249.7`
  (holds its SAP/Fiori rows for `249.10`, **and** its first consumer is a
  rendered "Also called" line — it is owner- *and* browser-blocked), `249.10`,
  `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER
  CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

18 + 10 + 1 = 29, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so Step 1
committed nothing. **Issue #2's `updated_at` has not moved for a TWENTY-SIXTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 30 open items at dispatch. Rule 2 read `Standardize 1 / 4 ok`. Rule 3 read
`Objective 0 / 3 ok`. **Rule 4 matched**, and its oldest cloud-takeable item was
`331.1`. Rules 5-8 not reached. **Rule 5 would not have fired** — its line read
`ok`, not `STALE` and not `SKEW`: **0** wake-dates newer than the newest pair,
8 of 47 names paired across days, and no name in the comparable set regresses on
two consecutive runs.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely. **A push that touches only `.roundtable/**` runs the
full suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b —
*re-run `npm run docs:build` after writing this file, before pushing* — and it was
executed this wake, after this file was written, before the push.

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
at Step 0 — the container arrived detached at `614ce99e` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2b bit for real**, for the second recorded time; see the `ENVIRONMENT.md`
section above and §2b itself. After recovery: **2,087** commits, **8** tags, no
`shallow.lock`. **It was load-bearing** — the wake reads
`origin/contribution/upstream-2026-09-06`, which a 50-commit clone does not carry.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `614ce99e` (the Step 0 tip) or this wake's slice commit.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were read**
(issues **1** open, discussions **0** open).

**Three things want the owner's attention, all unchanged, all thirty-second
actions:**

1. **Issue #2 is open and carries only the triage comment.** Slice 317 refuses the
   component with the measurement; Slice 319 corrected a second false claim on the
   same page the reporter was pointing at. **Replying and closing the issue is an
   owner action.** Whether a *wake* should post that comment was `297.1`, closed
   by Slice 335 — read it before re-raising.
2. **`273.2`** — whether a Polish round whose score does not move should increment
   `dry`. Not touched this wake; rule 6 was never reached, so `polish_requeue.py
   --apply` was correctly not run.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. The share it governs now reads **51.2%**, the
   highest on record and **~10pp above the last sweep anyone actually took**, and
   twenty consecutive wakes have declined a sweep for want of the trigger this
   item would supply. Its filed grounds are *low urgency, "the sweep keeps
   happening regardless"* — that premise has now been weakening for twenty wakes.

**A fourth thing is newly worth naming: the owner-contributed material is now
fully adjudicated.** Slice 331 gave all six proposals a verdict; `331.1` was the
last live one and this wake refuses it. **What remains from that contribution is
one OWNER CALL — the brand mark** — plus the OKLCH PR, which is blocked on the
ΔE00 round-trip its own `PR.md` demands and is not a wake's to unblock.

**The loop-mechanics question is still FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and **deliberately added
none**, on `355.3`'s and `359.4`'s precedent: the rule-3 counter crediting `[331]`
instead of 360 was met, recognised as the documented behaviour, and left unfiled.

**Nothing this wake did is outward-facing or hard to reverse.** `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged**.
