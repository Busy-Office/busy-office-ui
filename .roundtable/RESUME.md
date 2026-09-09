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
at hand-off apart from this file, `ROADMAP.md`, the new grill report,
`loop-log.md`, `loop-metrics.jsonl` and the regenerated mirrors.
**No collision this wake** — `origin/main` read `61e9d92f` at Step 0 and again
at the mandated pre-commit fetch; it was the local tip both times.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**Every closed id this file names is named as history or as precedent, never as
open work.** `check:resume-slice-ids` reports **11** of them, and the
enumeration below is copied from that report rather than from memory — the
first draft of this paragraph listed only six and missed five:

- `338.1`, `339.2`, `351.1` — the items the three arming slices closed.
- `307.1`, `324.1`, `324.2` — the pairing and direction precedents this wake's
  finding is measured against.
- `355.3`, `359.4` — the parser-item refusals, cited where this file declines to
  file a ninth.
- `297.1` — cited in Direction, on whether a wake may comment on issue #2.
- `310.1` — one of the eight standing visual debts.
- `332.1` — cited on `ENVIRONMENT.md` having no size discipline.

Six more (`306.1`, `164.2`, `94.11`, `212.2`, `176.3`, `312.2`) are not in
`ROADMAP.md` at all because they are archived; that is normal, not a finding.

**`372.1` is NEW and OPEN; `353.2`, `350.1`, `345.1` are named repeatedly and
are OPEN — deliberately so.** Nothing here claims an open item that is not.

## ⚠ WHICH RULE FIRES NEXT — **rule 4**, with rules 1-3 all short

`dispatch_status.py`, read immediately after this wake's recording (`LOOPS.md`
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   1 / 4 Continue round   ok
Objective     0 / 3 slices           ok    (reset by this wake)
Optimize      0 wake-date(s) newer   ok
```

**That comparison earned its keep again this wake.** The first draft of this
heading said rule 2 was at **2/4**, reasoning that a landed slice arms it.
Reading the counter says **1/4** — an `Objective` row is not a Continue round,
so this wake armed nothing. Corrected against the instrument, not the
expectation.

**Re-run it** — a collision could land a row between this line and your wake.

Rule 1 has no open P0 (**0** across 24 open items). So **rule 4 is the expected
dispatch**, on the oldest genuinely dispatchable item — which is `345.1` unless
a collision moved it.

**The arming label resolved to a SLICE number again**, because this wake's
`--item` text begins `Slice 372 —`. That is the second consecutive deliberate
confirmation of last wake's diagnosis: the label **is not inherently
unreliable — it reflects how the row was written**. Still **no parser item is
filed** (ninth of its kind, refused on `355.3`, `359.4` and `LOOPS.md`'s own
conclusion). Resolve any label you did not write by reading the commit subject
at the row's sha; never treat it as an ordinal.

## What landed: Slice 372 — Objective grill of Slices 369, 370, 371

**Dispatched by rule 3**, `Objective 3 / 3 OVERDUE [338, 370, 371]`. All three
labels were resolved by commit subject before anything was grilled: `338` is an
item id whose slice is **369**; `370` and `371` are genuine slice numbers. No
earlier grill heading names any of the three, and `INDEX.md` reports **4
repeated subject(s)** corpus-wide, none of them here — so nothing was narrowed
out. Report: `.roundtable/grill-objective-369-370-371-2026-09-09.md`.

Step 1 read both intakes with §8's controls — issues **1**, discussions **0**,
`/not-a-real-route` **404** — and triaged nothing. Issue #2's `updated_at` is
unchanged at `2026-09-06T15:10:34Z`, a **sixth** consecutive hand-off.

### The finding: rule 5 discards a metric sample on a reason false at 72 of 73

`per_day_last` keeps only the last sample of each calendar day, on the recorded
ground that *"a wake that samples twice in one day is correcting itself"*. **A
sample separated from the next by a commit cannot be a correction of it** — the
thing measured changed in between. Over all 143 samples:

```
adjacent intra-day pairs with NO commit between:   1   (behaviors_frozen, same minute)
adjacent intra-day pairs spanning >=1 commit:     72   (2 to 50 commits)
```

**The case the rule was built around is the clearest counterexample.**
`LOOPS.md:609` and `dispatch_status.py:933-934` both present `ci-wall-time`'s 26
samples as one wake's burst; that window carries **36 loop-log rows, 35 distinct
commit shas and 5 distinct loops**.

**What it costs:** on **5 of 8** day-paired names the published movement
occurred between no two samples (`dispatch-region-words` **−8** against a true
**−68**), and rule 5's own two-consecutive-moves predicate **disagrees between
the two readings on 3 of 8**. Filed as **`372.1`**, cloud-takeable, with the
Accept written as a property — *deciding the day unit is right and only its
justification wrong closes it just as well as changing the unit*.

**Refused, with the measurement:** a gate on *"a sample must not be discarded
when a commit falls between it and the next"*. Base rate **72 of 73**, so it
would be red on a correct tree from its first run.

### What reproduced — every structural claim in Slices 370 and 371

Rule 3 body **907** words; `### Step 0c` **1,520**; dispatch region **7,484**
(7,428 body + **56** heading, the constant `353.2` documents — my first reading
of 7,428 was run down rather than rounded off); `LOOPS.md` **18,241**;
`LOOPS-archive.md` **3,880**; the moved P4 paragraph present in the archive
**exactly once** and absent from `LOOPS.md`; lane 2 identical at
`74 · 242 · 230 · 8`; lane 3 identical at `119 pages · median 798 · 114,124
words`. **Nothing in 370 or 371 failed to reproduce.**

**Not re-run, and named rather than implied:** Slice 371's 25-revision series
and its "all three quoted fragments are in P5" check need pre-cut revisions and
were not replayed. **Slice 369's print figures were not re-measured at all** —
a multi-hour headless-Chrome + PDF re-derivation, and the grill spent its budget
on the finding instead. Its two browser-free citations were checked and are
exact.

## Three defects in this wake's own work, all caught before publishing

1. **Authorship inferred from timestamp proximity.** The first draft said both
   `dispatch-region-words` samples came from slices in the arming set. `git
   blame` says the **7,552** was written by the wake that recorded **Slice 363**
   (`4cfb8b2c`), and **Slice 370 recorded no sample at all**. Caught by running
   the very blame the paragraph was about to cite `353.2` for. The finding is
   unchanged; the narrative sentence was wrong and is now sharper for being
   measured.
2. **The commit-boundary probe was dead on its first run** — `r.get("sha")` on
   rows from `dispatch_status.rows()`, which returns only `at`/`loop`/`item`. It
   reported **0 commits between for 17 of 17 buckets**, and the
   identical-value-across-inputs tell is what caught it. Believed only after a
   positive control (9 shas on 2026-09-09) **and** a negative control — the
   detector must be able to return 0, and does, exactly once.
3. **A paraphrase-grep reported a false absence.** `grep -cF` for `"12 of 17"`,
   `"crossings 51"`, `"18 rows"` — `ROADMAP.md`'s wording for the moved text —
   returned **0** in both files while the text is present under the archive's
   own wording. Not reported as an absence; caught by opening the paragraph.

## NOT VERIFIED, said plainly — and the visual debt is unchanged

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, and that is **structural rather than a judgement**: `git diff
--stat` was read, and the slice diff is `ROADMAP.md`, the new grill report and
the loop-record files only. **No CSS rule, no docs page, no `.astro` file, no
generated artefact, no shipped JS.**

**The eight older debts are unchanged and unspent**, counted from the previous
hand-off's enumeration rather than carried as a number: Slice 352's two
(`/components/data-table`'s performance table and `/concepts/scale`'s scaling
table, both at 1440 and 390 in both themes); Slice 345's two
(`/patterns/output-form` **in print** and the RF tile grid on
`/patterns/rf/rf-landing-rf/` at both widths); and the four older —
`292.4/292.5`'s screenshot lane on `/components/icon`; Slice 319's paragraph on
`/patterns/kanban` at 390px; `320.3`'s `ApiTable.astro` `0.5rem` against
`ClassRef.astro` `.4rem`; and Slice `310.1`'s three `prod/` Refresh buttons.

**Gates.** This container arrived with **no `node_modules`** again (`npm ci`
first). The seven the wake prompt mandates were then run, every one green,
figures read off their own output: core `build` (`check:package` **185** files,
size check **139** payload files / **382.8 kB gz**), core `test` (**165** tests
/ 29 files), `docs:build`, `check:claims` (**176** live, **3 NOT VERIFIED**,
which is `ENVIRONMENT.md` §6b's container fact, not a regression), `test:axe`
(**128** pages × 2 widths, **zero** violations), `check:layout` (**128** pages),
`check:repo` (`slice-refs` **1030** assertions / **354** slice sections,
`vendor-names` **624** files).

**Said precisely: the full 17-entry CI set was NOT run this wake.** The prompt
named seven and those seven ran; the other ten (`lint:css`, `check:formatting`,
`check:scroll`, `check:forced-colors`, `check:target-size`, `check:search`,
`check:pseudo`, `check:quickstart`, `check:po-app`, `npm run suite`) were not,
and CI will be the first to run them on this push. The diff is markdown only,
which those ten do not read, but that is a **reason to expect green, not a
substitute for having run them**.

`docs:build` was re-run to exit 0 after the last `ROADMAP.md` edit and again
after this file was written, per `ENVIRONMENT.md` §3b, before the push. It gates
`.roundtable/**` and `ROADMAP.md` content.

**The verifier agent was not used** (this session's standing instruction is not
to spawn agents unasked), so `LOOPS.md` §2 step 6's verifier pass was done by
hand: the staged diff re-read adversarially before committing.

## The metric recorded, and the reason for each candidate not recorded

- **Nothing was recorded this wake, and the reason is the finding itself.**
  `LOOPS.md` was **not touched**, so `dispatch-region-words` is unchanged at
  **7,484**; `gates` is unchanged at **56**; `claims` read **176**, identical to
  the sample already in the pair; `axe-violations` is 0 again and its line
  already reads `NEVER MOVED`.
- **The temptation to record an unchanged value "to help the series" was
  refused**, and deliberately: whether a sample should be written when nothing
  moved is exactly what `372.1` puts up for decision, and pre-empting it by
  changing the convention unilaterally would decide the item by practice rather
  than by measurement.

## The open set is 24 — no P0

`roadmap_scope.py` at the slice commit and the raw checkbox count agree at
**24**. Slice 372 closed **no** item and opened **one** (`372.1`), so the set is
+1 on the previous hand-off's 23.

- **cloud-takeable: 11** — `345.1`, `346.1`, `348.1`, `349.1`, `350.1`,
  `352.1`, `352.2`, `353.2`, `362.1`, `369.2`, **`372.1`** (new). **`345.1`
  remains the oldest of these** and is what rule 4 would dispatch next.
  `362.1` carries Slice 364's amendment on the `include`.
- **cloud-blocked in the WRITE sense (1):** `335.1` — the Discussions intake
  needs a GraphQL `createDiscussion`, and the **403** was re-confirmed by
  measurement in Slice 366. A local wake can take it. **Not re-derived this
  wake.**
- **owner-blocked (11):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7`, `249.10`, `249.11`, `249.12`, `249.13`, `273.2` (**OWNER CALL**),
  `296.3` (**OWNER CALL**), `369.1` (a palette-wide print behaviour change with
  a visible result).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

11 + 1 + 11 + 1 = 24, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## The archive sweep — re-run it at your Step 0

```
python3 scripts/loops/roadmap_scope.py
  9007 / 14396 = 62.6%    (the reading at 61e9d92f, this wake's Step 0)
```

That is the **pre-slice** figure, deliberately not re-quoted post-hoc: this
wake's slice adds ~200 lines of open-side body while closing nothing, so both
halves of 208.1's ratio move and the sign of the change is not predictable from
the work done — which is the third shape the last three wakes have recorded
against `249.12`.

**Not dispatched by this wake, and the reason is the dispatch**: rule 3 fired,
and a sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md).
**`249.12` is named again** — the open **OWNER OR ARCHITECTURE CALL** on the
archival trigger. **11 targets are NAMED by a still-open item**
(`roadmap_scope.py` lists them) and must be read before moving (236.2).

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
container arrived detached at `61e9d92f` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2 bit; trap 2b did NOT.** The clone arrived shallow (`true`, 50 commits);
`git fetch --unshallow origin` completed inside the timeout, giving **2,112**
commits, and left no `shallow.lock`. Per §2 the tag count is the check, not a
pinned value — this container's `--unshallow` again brought them (**8**).

**Trap 3 (no `node_modules`) bit again.** `npm ci` first, or the build fails
`code 127` on a missing `stylelint` and reads like a toolchain break.

**§4b was respected**: nothing was amended after `record_iteration.py` ran, so
no row points at a stranded sha.

**No `git worktree` and no `git stash` were used.** All five probes (the
day-collapse census, the commit-boundary discriminator with its two controls,
the published-vs-true movement table, the `ci-wall-time` window, the blame
attribution) lived in the scratchpad and never in the repo.

## Direction

Nothing new from the owner reached this wake to triage. **Both intakes were
read** (issues **1** open, discussions **0** open).

**Five things want the owner's attention. The first two are unchanged and are
the two biggest.**

1. **`369.1` — printing from the dark theme puts 19,511 of 26,817 painted text
   fills below AA on paper, across 125 of 128 pages.** Chrome's economy mode is
   what keeps that from being worse, and it is a **UA behaviour no other engine
   is known to share**, so the reading is a floor for Chrome and says nothing
   about the others. The proportionate fix is one `@media print` block
   re-pointing the theme tokens at their light values — a deliberate exception
   to `check:print-tokens`'s own rule, and so the owner's to make.
2. **Issue #2 is open and carries only the triage comment**, with `updated_at`
   unchanged for a **sixth** consecutive hand-off. Slice 317 refuses the
   component with the measurement; Slice 319 corrected a second false claim on
   the page the reporter was pointing at. **Replying and closing is an owner
   action.** Whether a *wake* should post that comment was `297.1`, closed by
   Slice 335 — read it before re-raising.
3. **`249.12`** — the stated-trigger question for the archive sweep, an explicit
   **OWNER OR ARCHITECTURE CALL**. Three consecutive wakes have now measured the
   share moving for reasons unrelated to how much closed history the file
   carries; this wake adds that a grill closing nothing and writing a long entry
   moves it the other way again.
4. **`273.2`** — whether a Polish round whose score does not move should
   increment `dry`. Not touched this wake; rule 6 was never reached.
5. **`335.1` cannot be settled by any cloud wake.** A local wake can do it in
   one command, or the owner can file a throwaway Q&A discussion and let the
   next wake read it.

**A sixth, carried forward unchanged: `362.1` will change published sample
code.** Adopting `astro check` means resolving 22 DOM-narrowing errors inside
inline `<script>` blocks that readers copy off pattern pages.

**`ENVIRONMENT.md` was NOT touched this wake.** The standing note holds: the
file has no size discipline and no open item asking for one (`332.1` closed on
the finding that it is long because the environment is hostile). **If the owner
wants that discipline it needs filing as its own item.**

**Nothing this wake did is outward-facing or hard to reverse.** `CLAUDE.md`,
`LOOPS.md`, `LOOPS-archive.md` and `DESIGN.md` are **byte-for-byte unchanged** —
this wake filed a finding **about** `LOOPS.md`'s machinery and deliberately did
not edit it, because `372.1`'s Accept leaves open which of two fixes is right
and a grill that pre-empts its own item has decided it by practice.
