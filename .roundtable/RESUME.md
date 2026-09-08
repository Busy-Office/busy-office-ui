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
at hand-off. **No collision this wake** — `origin/main` read `30d94cc7` at Step
0 and `30d94cc7` again immediately before the first commit. It also arrived as a
plain **fast-forward** (`d876765..30d94cc`), not the forced update the last
several wakes saw.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md          # open-checkbox count
node apps/docs/scripts/check-resume-slice-ids.mjs # names any stale closed ids
python3 scripts/loops/roadmap_scope.py            # OPEN set + sweep scope
```

**`check:resume-slice-ids` REPORTED against the PREVIOUS revision of this file
and the report was read, not deferred.** It named 10 closed ids and 3 absent
from `ROADMAP.md`, all historical. This rewrite carries the same practice: every
id below is either named as OPEN with its blocking kind, or cited as closed
precedent and said to be closed. **Nothing here claims an open item that is
not**, so there is no stale blocked-set for rule 4 to read. Re-run the check
against this file rather than trusting that sentence.

## ⚠ RULE 2 IS SPENT. EXPECT RULE 4 — and its item is `330.1`

`dispatch_status.py`, read immediately after this wake's recording (LOOPS.md
asks for exactly that comparison; it has found two of the five parser bugs):

```
Standardize   0 / 4 Continue rounds   ok     <- reset by this wake
Objective     2 / 3 slices [356, 357]  ok
Optimize      0 wake-date(s) newer     ok
```

Rule 1 has no open P0, rule 2 is reset, rule 3 is one slice short. **So rule 4
matches.** Its item is the OLDEST still-open item, which is **Slice 15**
(owner-blocked, AT runtime evidence on owner hardware); the oldest a **cloud**
wake can take is **`330.1`**, unchanged from the previous hand-off since this
wake closed nothing from that set. **Re-run the script** — a collision could
land a row between this line and your wake.

## What landed: Slice 357 — Standardize sweep, 4 of 4 lanes, all clean

**Rule 2 dispatched this** at `4 / 4 OVERDUE`, exactly as the previous hand-off
predicted — re-read this wake rather than trusted.

**Say `n of 4` in the write-up** (LOOPS.md §3): this wake ran **4 of 4**.

| lane | reading this wake | verdict |
|---|---|---|
| 1 `scan:dead-style` | 0 dead attributes · **11** dead declarations on **9** pages · 1,365 live attributes / 1,813 declarations / 345 multi | clean — the refusal set, page for page |
| 2 `report:css-repeats` | **74 / 242 / 230 / 8** | clean, **and it could not have been otherwise** — see below |
| 3 `report:prose` | 119 pages · median **798** · mean **959** · **114,124** words (+337) · flagged union **15**, all verdicted | clean, and the one lane that MOVED |
| 4 `report_loop_prose` | dispatch region **7,548**, flat; ratio 42.0% → **41.8%** | clean; `341.1` already owns the Step 0c signal |

**The finding is lane 2's, and it is a refinement of the open `350.1`.** That
item classifies a window by `packages/core/src/css/ OR apps/docs/src/`.
`report-css-repeats.mjs` reads **only the first** (`srcCssRoot`), while lanes 1
and 3 read built pages and depend on both — so the OR credits lane 2 with
windows it is structurally blind to. Bucketed separately at `30d94cc7`,
`a..b^`, over 139 windows: `neither` **20** · `core_only` **7** · `docs_only`
**38** · `both` **74** (partition asserted, sums to 139).

- lanes 1 and 3 blind on **20 / 139 = 14.4%** — reproducing `351.1`'s amended
  figure at a later commit.
- **lane 2 blind on 58 / 139 = 41.7%**, nearly 3x, the gap being the 38
  `docs_only` windows.

**Red-proved with BOTH controls**, each injection asserted present exactly once
and outside a comment *before* the result was read, and re-asserted at zero
after revert: the *same* three-declaration body moves the report **242 → 243**
with its group **x3 → x4** in the core stylesheets, and moves **nothing** in a
docs page. The discrimination is the tree, not the content.

**`350.1` stays OPEN** with this as a third amendment — the decision is rule
4's, not a sweep's. The only code change is one line of stdout on
`report-css-repeats.mjs`, naming the tree it walked, **derived from
`srcCssRoot` rather than hand-typed**. No gate (94.11: the property is
semantic), no new instrument, no fourth lane.

## Two of this wake's own claims were wrong first, and both were caught by re-running

Worth carrying because both are the same shape — a figure asserted from what
looked obvious, refuted by the command:

1. **"`LOOPS.md` is unchanged, so the region reading is identical to Slice
   350's."** It is not unchanged: `1310b81a` (Slice 353) touched it in this
   window. The file went **17,980 → 18,046 (+66)** and the dispatch region
   stayed at **7,548 exactly** — every word landed below `## Playbooks`. So the
   ratio fell 42.0% → 41.8% **on the denominator alone**, which is the
   playbook's own "read the sections, not the ratio" warning arriving live.
2. **"This commit lowers the closed-history share."** The opposite. Slice 357
   closes its only item in the same commit, so it is a *closed* slice and all
   238 of its lines are closed history: `919d55d5` reads **5,525 / 11,802 =
   46.8%**, up 0.9pp from the **45.9%** at the Step 0 tip.

## ⚠ The archive sweep: 46.8%, and the four-wake rise was NOT sampled

`roadmap_scope.py` read **5,307 / 11,564 = 45.9%** at `30d94cc7` (Step 0) — the
same value the previous hand-off published at `78e96150`, which is **expected
and not informative**: `30d94cc7` is that wake's recording commit and does not
touch `ROADMAP.md`. So the rise (41.1 → 43.9 → 44.5 → 45.9) **has not paused;
it simply had no new sample**. At this wake's commit it reads **46.8%**.

**The empirical record, re-read rather than carried:** 252.1 dispatched the
tenth sweep at **55.1%**, 272.1 the eleventh at **56.7%**, 279.3 *declined* the
twelfth at **40.6%**, `324.3` *took* the thirteenth at **41.5%**. **46.8% is
5.3pp above the last taken sweep** and above every declined reading on record.

**Not dispatched by this wake, and the reason is scope, not the number**: a
sweep is a hand-checked bulk edit one slice at a time (CLAUDE.md), and this
wake's lane-4 signal was a measurement with two red-proofs. `249.12` is named
for a **SEVENTEENTH** consecutive wake. It is a live candidate for the next
wake — but next wake is rule 4, whose item is `330.1`.

## NOT VERIFIED, said plainly — and this wake adds NO visual debt

**No 1440/390 light-and-dark screenshots — a cloud wake has no Podman.** This
wake owes none, structurally: the diff is **`ROADMAP.md` plus one report
script's stdout line** (`report-css-repeats.mjs`) and the recorder's own files.
No `.astro`, no CSS, no built page content changed — `docs:build` ran green on
the same **128** pages, and the only changed build output is that report's own
closing line.

**The eight older debts are unchanged and unspent**, and nothing since has
touched their surfaces: Slice 352's two (`/components/data-table`'s performance
table and `/concepts/scale`'s scaling table, both at 1440 and 390 in both
themes); Slice 345's two (`/patterns/output-form` **in print** — the figure, the
barcode quiet zone — and the RF tile grid on `/patterns/rf/rf-landing-rf/` at
both widths); and the four older ones — `292.4/292.5`'s screenshot lane on
`/components/icon`; Slice 319's paragraph on `/patterns/kanban` at 390px;
`320.3`'s `ApiTable.astro` `0.5rem` against `ClassRef.astro` `.4rem`; and Slice
`310.1`'s three `prod/` Refresh buttons.

**Gates: ALL 17 CI-runnable entry points were run green in this container.** In
`ENVIRONMENT.md`'s own order: core `build` (incl. `lint:css`, `check:size`
**139** files / **382.7 kB** gz, `check:readme-facts`, `check:package` **185**
files), core `test` (**165** passed), `lint:css`, `docs:build` (carrying
`check:slice-refs` **1,002** assertions / **379** citations / **339** slice
numbers, `check:floor` **595** files, `check:vendor-names` **617**,
`check:imports` **350**, `check:selftests`, `check:page-shape`,
`check:wrong-choice` **158**, `check:metadata` **1,159**), `check:claims`
(**176** live · 3 NOT VERIFIED, which is `ENVIRONMENT.md` §6b's container fact,
not a regression), `check:formatting`, `check:scroll` (**914** containers / 118
pages), `check:layout` (**128** pages), `check:forced-colors`, `test:axe`
(128 × 2, zero violations), `check:target-size`, `check:search`, `check:pseudo`,
`check:quickstart`, `check:po-app` (**20** behaviours), `check -w create-ui`,
`npm run suite` (**28** screens × 2 widths).

**Said precisely.** `docs:build` was re-run to exit 0 after the last
`ROADMAP.md` edit, and again after this file was written, per `ENVIRONMENT.md`
§3b, before the push.

**The `verifier` agent is not available in this session**, so `LOOPS.md` §2 step
6's verifier pass was done by hand: the staged diff re-read adversarially, every
number re-checked against the command that produced it. **It earned its keep
twice** — both corrections in the section above were made by that re-read,
before the push.

## No metric was recorded this wake, and here is the reason for each candidate

- **`dispatch-region-words`** — not sampled. The region is **7,548** (body
  7,492), byte-identical to the last sample; `353.2` is open about exactly this
  name and its convention. A second identical sample moves nothing.
- **`claims` = 176** (`check:claims`). **Identical** to the previous two wakes.
- **`bundle-gz-kb`** — nothing this wake touched the bundle; `check:size` read
  **139** payload files / **382.7 kB** gz, tightest headroom 110 bytes,
  unchanged.

## The open set is 31 — no P0

`roadmap_scope.py` reports **31 open** at `919d55d5`; the raw checkbox count
reads **31 open / 96 closed**. (`roadmap_scope.py` says **94 closed** — it
excludes the 2 `[x]` items under the non-slice `## STATE` headings and says so
in its own output.) Slice 357 filed one item and closed it in the same commit,
so the open set is **unmoved at 31**.

- **cloud-takeable: 20** — `330.1`, `331.1`, `332.1`, `333.1`, `334.1`,
  `335.1`, `336.2`, `337.1`, `338.1`, `339.2`, `341.1`, `345.1`, `346.1`,
  `348.1`, `349.1`, `350.1`, `351.1`, `352.1`, `352.2`, `353.2`.
  **`330.1` is the oldest of these**, so it is rule 4's item next wake.
  `350.1` now carries a third amendment from this wake. `335.1` still carries
  its caveat — settling it may mean filing a throwaway Q&A discussion, an
  outward-facing write to a public repo whose permission has **not** been
  tested.
- **owner-blocked (10):** Slice 15 (AT runtime evidence, owner hardware),
  `112.3` (**BLOCKED ON OWNER BRIEFS**), `112.4` (blocked on 112.3's verdict),
  `249.7` (its own text holds it for `249.10`), `249.10`, `249.11`, `249.12`,
  `249.13`, `273.2` (**OWNER CALL**), `296.3` (**OWNER CALL**).
- **browser-blocked in the SCREENSHOT sense (1):** `320.3`.

20 + 10 + 1 = 31, asserted rather than left to the reader. **The fifth kind,
`artifact-lost`, is empty.**

## Step 1 — both intakes read, with the controls ENVIRONMENT.md §8 names

```
/issues?state=open  -> HTTP 200, len 1     #2, updated 2026-09-06T15:10:34Z
/discussions        -> HTTP 200, len 0     the reading
/not-a-real-route   -> HTTP 404            an unserved route does NOT answer 200 []
```

**Readings: issues 1 open, discussions 0 open. No new untriaged input**, so
Step 1 committed nothing. **Issue #2's `updated_at` has not moved for a
TWENTY-THIRD consecutive hand-off.** See Direction.

## Rule-by-rule dispatch trace

Rule 1: no open P0 — `grep -cE '^\s*[0-9]+\. \[ \].*P0' ROADMAP.md` → **0**
across 31 open items at dispatch. **Rule 2 read `Standardize 4 / 4 OVERDUE` and
matched.** Rule 3 `Objective 1 / 3 ok [356]` — evaluated below rule 2 anyway.
Rules 4-8 not reached.

**Rule 5 was not reached and would not have fired.** Its line read `ok`, not
`STALE` and not `SKEW`: **0** wake-dates newer than the newest pair, 8 of 47
names paired across days, and no name in the comparable set regresses on two
consecutive runs. No sample was recorded this wake (reasons above).

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

**Trap 1 bit in its first form.** `git branch --show-current` answered **EMPTY**
at Step 0 — the container arrived detached at `30d94cc` — and was fixed with
`git fetch origin main && git checkout -B main origin/main` before any commit.

**Trap 2: the clone was shallow (50 commits) and was unshallowed before any
figure was taken** — **2,081** commits at `HEAD`, no `shallow.lock`, and the
unshallow again brought the tags (`git tag | wc -l` → **8**, run rather than
assumed). **This wake it was load-bearing, not precautionary**: the base-rate
buckets walk 139 windows across 1,869 first-parent commits, which a 50-commit
clone cannot see.

**No `git worktree` and no `git stash` were used this wake.** Every figure names
either `30d94cc7` (the Step 0 tip) or `919d55d5` (the slice commit).

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
   **OWNER OR ARCHITECTURE CALL**. The share it governs is now **5.3pp above the
   last sweep anyone actually took**, and seventeen consecutive wakes have
   declined a sweep for want of the trigger this item would supply. It is filed
   *low urgency* on the grounds that "the sweep keeps happening regardless" —
   that premise is what has weakened.

**The loop-mechanics question is now FIVE items deep** — `341.1`, `349.1`,
`350.1`, `351.1` plus `353.2`. This wake answered none and added none; it
amended `350.1` with a measurement and left the decision open. `349.1` did
**not** reproduce this wake — rule 3 never armed.

**Nothing this wake did is outward-facing or hard to reverse.** The diff is
`ROADMAP.md`, one report script's closing stdout line, and `.roundtable/**`.
`LOOPS.md`, `CLAUDE.md` and the dispatch region are **byte-for-byte unchanged**
— deliberately: the sweep refuses a gate on the measured semantic property and
changes a report's output instead.
