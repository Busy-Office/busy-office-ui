# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and **three** advisory checks run from `record_iteration.py` — the
> charter check, `check:resume-slice-ids`, and `polish_requeue.py
> --verify-stamps`. All three REPORT; none fails a build (roadmap 175.3). Run
> them against the file as it now stands rather than trusting a stale reading.

**`ENVIRONMENT.md` was audited section by section this wake (Slice 361) and one
section was found DEAD and rewritten — §3. Read it fresh; do not carry a
memory of it.**

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
at hand-off. **No collision this wake** — `origin/main` read `731beff2` at Step 0
and `731beff2` again immediately before the first commit, and it arrived as a
plain fast-forward (`d876765..731beff`).

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against the file as it stood at recording,
and the report was read rather than deferred.** It names **4** archived ids —
`94.11`, `312.2`, `192.1`, `321.1`, every one a *rule* cited by number, not an
item — and **8** ids recorded `[x]` closed: `332.1` (closed by this wake and
named below as exactly that), `331.1`, `330.1`, `355.3`, `359.4`, `324.3`,
`297.1` (all cited as precedent and each said here to be closed), and `310.1`
(named only as an unspent *visual debt*, not as an open item). **Nothing here
claims an open item that is not.** Re-run it against this file rather than
trusting that sentence.

## ⚠ RULE 4 IS NEXT AGAIN, AND ITS CLOUD-TAKEABLE ITEM IS `333.1`

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   3 / 4 Continue rounds   ok
Objective     2 / 3 slices            ok   [331, 332]
Optimize      0 wake-date(s) newer    ok
```

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0. Rule 2 advanced 2 → **3 of 4**. Rule 3 advanced 1 → **2
of 3**. **So rule 4 matches again**, and its oldest cloud-takeable item is
**`333.1`**; the oldest open item overall is still Slice 15, owner-blocked (a
human listening to a screen reader).

**Rule 2 is one Continue round from firing.** At `4 / 4` a Standardize sweep
preempts the queued item — four lanes, and say `n of 4` in the write-up.

**The rule-3 counter credits `[331, 332]`, not 360/361, and that is the KNOWN
behaviour, not a new bug.** The row's item text leads with `332.1`, so
`SLICE_TOP` reads 332. Slices 358 and 360 hit the identical thing and both
recorded it. **No sixth parser item is filed** — `355.3`'s precedent, `359.4`'s
refusal, and `LOOPS.md`'s own note that widening the regex is not the lesson. It
is also not wrong in effect: Slice 332's last open item was `332.1`, so 332 did
close.

## What landed: Slice 361 — `332.1` CLOSED, 17 of 18 sections live, 1 dead

**Dispatched by rule 4**, exactly as the previous hand-off predicted. `332.1`
asked whether every `ENVIRONMENT.md` section still describes a trap that can
bite a wake TODAY, and named *"finding that all 18 still bite"* as a satisfying
outcome, with **"a section whose trap is fixed in the toolchain"** as the only
safe cut.

**Answer: 17 live, 1 dead.** Full evidence, every command beside its figure:
`.roundtable/measure-332.1-environment-md-section-audit-2026-09-08.md`.

**The premise was re-checked before it was used** (CLAUDE.md: when an item's
premise is an earlier wake's measurement, re-checking it is part of the
criterion). Sizing the file at each of its **28** revisions rather than in the
working tree, both endpoints reproduce exactly — `1005d1db` = **391 / 3,130 /
14** and `0879ec3d` = **731 / 6,316 / 17**.

**Four sections BIT this very wake**: §1 detached HEAD, §1b the persisting bash
cwd, §2 the shallow clone, §5 the missing `loops.db`. §2b was **red-proved** on
a throwaway `--depth 1` clone. §6c reproduced **to the pixel** (`1216−1201=15`,
`390−375=15`, container `913×384`). §6d reproduced (9-char sha → `200` with
**0** runs; full sha → **2**).

**§3 is the dead one.** *"`astro build` does not clear `dist`"* is false at
astro **5.18.2**: a sentinel file **and** a sentinel directory are both removed,
**isolated to a bare `npx astro build`** rather than to the 30-step chain. It is
rewritten in place, with the superseded text in `LOOPS-archive.md` behind a
pointer — because **the live hazard in that same ground is the inverse**: a bare
`astro build` silently discards everything the chain adds after it (**224** files
where a full build leaves **529**, 0 pagefind, no `llms.txt`), so a dist-reading
gate measures an incomplete site that looks built.

**If you have run a bare `astro build`, run the full `npm run docs:build`
before believing any dist reading.** This wake did exactly that, twice, on
purpose.

## Every 100% here carries a control, and the method was made to say DEAD

"18 of 18 live" would have been a 100%, which this repo treats as a defect until
proven otherwise. The method returns **DEAD** for two claims already known dead
(`check-boost.mjs` does not exist; `check:resume-charter` is not in `check:repo`
and appears in `ci.yml` only inside comments) and **LIVE** for a live one.

**Said precisely: those controls discriminate at the level of a CLAIM inside a
section, not a whole section** — no whole section is known-dead, so no
section-level control exists. The stronger evidence the method is not a rubber
stamp is that it found **three stale things inside sections it ruled live**.

## Two more durable-file corrections landed

- **§1c's consumer count read 15 and returns 17.** The 15 reproduces exactly at
  `605829ca`, so the entry was right and drifted — the **third** consecutive
  time (14 → 15 → 17), so **no value is pinned there any more**. One arrival of
  each kind: `measure-stress.mjs` is a new **npm-script entry point**
  (`measure:stress`, absent from `ci.yml`, so run-by-hand and needing the
  export); `po-app-harness.mjs` is a **false positive** matching only a prose
  comment. **The grep/closure agreement is no longer a SET equality** —
  closure-only is `resolve-chrome.mjs`, grep-only is that false positive, two
  opposite errors cancelling into a coincidental `17 = 17`.
- **A carried trap pinned "31 pathnames are exactly 40 characters"**; the
  command returns **30**. Same correction Slice 360 made to §2's `git tag`.

## This wake's own output was wrong twice, both caught before the commit

1. **`grep -c 'paths-ignore' .github/workflows/ci.yml` returned 2**, which reads
   as *"paths-ignore is back"* and would have filed a false defect against §3b.
   Both hits are inside the comment block explaining its removal; the structural
   check `grep -E '^\s*paths-ignore\s*:'` returns **0** across all three
   workflows. A substring count answering a structural question — this repo's
   own *assert on structure, never on raw text* rule.
2. **The §6c probe crashed** on a guessed `serveDist` return shape. It returns
   `{ server, port, base }`, as `check-layout.mjs:112` builds it.

The same suspicion was then applied to the control that also returned 2 —
likewise all comments, checked rather than assumed.

## Named plainly: this audit GREW the file whose length was the question

**789 → 856 lines, 6,861 → 7,374 words, 18 sections both before and after** (the
dead section was rewritten, not removed). The Accept asked whether each section
still bites, **not** for a smaller file, and the measured answer is that the
environment is hostile: it grew again *during* the audit, and the section added
the day before was §6d, documenting a trap that had just cost a wake 20 minutes.

**A wake that wants a shorter file needs a different item from `332.1`** — that
one is now closed, and nothing open tracks this file's size.

## ⚠ The archive sweep: re-read it, do not quote this line

```
python3 scripts/loops/roadmap_scope.py --rev <sha>
  731beff2  6,329 / 12,356 = 51.2%     (this wake's Step 0 tip)
  13545b20  6,545 / 12,480 = 52.4%     (this wake's slice commit — the highest on record)
```

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. **52.4% is
~11pp above the last sweep anyone actually took**, above every declined reading
on record, and **2.7pp** below the 55.1% at which the tenth sweep was
dispatched.

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this wake
was rule 4's item end to end. **`249.12` is named for a TWENTY-FIRST consecutive
wake** — it is the open **OWNER OR ARCHITECTURE CALL** on the archival trigger.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: `git show --stat` confirms the slice diff is
`ROADMAP.md`, `.roundtable/ENVIRONMENT.md`, `LOOPS-archive.md` and one new
`.roundtable/` report. **No `.astro`, no CSS, no script and no generated
artefact changed.**

**The §6c reading is a DOM/geometry measurement, not a screenshot** —
`ENVIRONMENT.md`'s own two-list split puts it squarely in what a cloud wake
*can* do, and it is reported as such.

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
`check:slice-refs` **1,008** assertions / **381** citations / **343** slice
numbers, `check:floor` **599** files, `check:vendor-names` **621**,
`check:imports`, `check:selftests`, `check:page-shape`, `check:wrong-choice`,
`check:metadata` **1,159**, `check-markup` **166** files / 89,941 class uses),
`check:claims` (**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's
container fact, not a regression), `check:formatting`, `check:scroll` (**914**
containers / 118 pages), `check:layout` (**128** pages), `check:forced-colors`,
`test:axe` (128 × 2, zero violations), `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app` (**20** behaviours),
`check -w create-ui`, `npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit **and before the slice commit** (it gates `.roundtable/**`
content), and again after this file was written, per `ENVIRONMENT.md` §3b,
before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially and
**every load-bearing figure re-run from scratch** — the astro sentinel (file and
directory, both REMOVED again, 224 files again), the 40-char count (**30**), the
consumer grep (**17**), active `paths-ignore` keys (**0**), the `wc -w` pair
(**2** vs **3**). All reproduced.

## No metric was recorded this wake, and here is the reason for each candidate

- **`claims` = 176** (`check:claims`). **Identical** to the previous six wakes; a
  seventh identical sample moves nothing rule 5 can read.
- **`dispatch-region-words`** — not sampled. `LOOPS.md` is byte-for-byte
  unchanged this wake; `353.2` is open about exactly this name.
- **An `env-md-lines` metric was considered and REFUSED.** It would be a
  single-day name, and 39 of 47 names already have only one day and cannot be an
  input to a rule that compares two runs. With `332.1` closed, nothing open
  reads it — a metric nobody reads is noise, not telemetry.
- Rule 5's line reads `ok`, not `STALE` and not `SKEW`, so the rule had input and
  did not need a fresh sample to be answerable.

## The open set is 28 — no P0

`roadmap_scope.py` reports **28 open** at the slice commit; the raw checkbox
count agrees. Slice 361 filed one item and closed it in the same commit, and
closed `332.1` in place, so the open set fell **29 → 28**.

- **cloud-takeable: 17** — `333.1`, `334.1`, `335.1`, `336.2`, `337.1`, `338.1`,
  `339.2`, `341.1`, `345.1`, `346.1`, `348.1`, `349.1`, `350.1`, `351.1`,
  `352.1`, `352.2`, `353.2`.
  **`333.1` is the oldest of these**, so it is rule 4's item whenever rule 4 is
  next reached — it asks whether a gate should forbid a never-used frontmatter
  `const` in an `.astro` page. `335.1` still carries its caveat — settling it may
  mean filing a throwaway Q&A discussion, an outward-facing write to a public
  repo whose permission has **not** been tested.
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
committed nothing. **Issue #2's `updated_at` has not moved for a TWENTY-SEVENTH
consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 29 open items at dispatch. Rule 2 read `Standardize 2 / 4 ok`. Rule 3
read `Objective 1 / 3 ok`. **Rule 4 matched**, and its oldest cloud-takeable
item was `332.1`. Rules 5-8 not reached. **Rule 5 would not have fired** — its
line read `ok`, not `STALE` and not `SKEW`: **0** wake-dates newer than the
newest pair, 8 of 47 names paired across days.

## The standing environment fact: CI HAS NO `paths-ignore`

`312.2` removed it entirely, and **this wake re-verified it structurally** —
`grep -E '^\s*paths-ignore\s*:'` returns **0** across `ci.yml`, `pages.yml` and
`publish.yml`. **A push that touches only `.roundtable/**` runs the full
suite.** The consequence a wake feels directly is `ENVIRONMENT.md` §3b —
*re-run `npm run docs:build` after writing this file, before pushing* — and it
was executed this wake, after this file was written, before the push.

## CHECK CI AFTER PUSHING — and filter the run list yourself

Use the plain listing and match the sha in your own code; **never `?head_sha=`
with an abbreviated sha** (re-proved this wake: a 9-char prefix answers HTTP
**200** with **0** runs while the full sha answers **2**), and **take the full
sha from `git rev-parse HEAD`, never by extending a short one already on
screen** (`ENVIRONMENT.md` §6d):

```
curl -sS -H "Authorization: bearer $GITHUB_TOKEN" \
  "https://api.github.com/repos/Busy-Office/busy-office-ui/actions/runs?branch=main&per_page=6"
```

## Step 0 traps

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `d8767657` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, **50**
commits) and `git fetch --unshallow origin` completed inside the tool timeout
this time, giving **2,089** commits and **8** tags, with no `shallow.lock` left
behind. 2b was red-proved separately on a throwaway clone rather than being
assumed — see the slice.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `731beff2` (the Step 0 tip) or `13545b20` (the slice commit).

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
   **OWNER OR ARCHITECTURE CALL**. The share it governs now reads **52.4%**, the
   highest on record and **~11pp above the last sweep anyone actually took**, and
   twenty-one consecutive wakes have declined a sweep for want of the trigger
   this item would supply. Its filed grounds are *low urgency, "the sweep keeps
   happening regardless"* — that premise has now been weakening for twenty-one
   wakes.

**A fourth thing, newly worth naming: `ENVIRONMENT.md` has no size discipline
and no longer has an item asking for one.** `332.1` is closed on the finding
that the file is long because the environment is hostile — 17 of 18 sections
provably live — and the audit itself added 67 lines. That is the honest answer
to the question as posed. **If the owner wants the file shorter anyway, that is
a different item and needs filing**; no wake should infer it from a closed one.

**The loop-mechanics question is still FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and **deliberately added
none**, on `355.3`'s and `359.4`'s precedent: the rule-3 counter crediting
`[331, 332]` instead of 361 was met, recognised as documented behaviour, and
left unfiled.

**Nothing this wake did is outward-facing or hard to reverse.** `LOOPS.md`,
`CLAUDE.md` and the dispatch region are **byte-for-byte unchanged**.
