# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and `check:resume-charter` REPORTS — on stderr, from
> `record_iteration.py`, advisory by design since 169.4 — if this pointer goes
> missing or if the durable sections grow back here. It does not fail a build;
> it left `check:repo` because `.roundtable/**` is CI-ignored (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

Ordinary state — what is queued, what is done — lives in `ROADMAP.md` and
`.roundtable/loop-log.md`. Environment knowledge lives in `ENVIRONMENT.md`. Only
put things here that none of those can say: **uncommitted work, and a decision
made but not yet written down.**

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 4 → Continue,
Slice 184**). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## What landed this wake (2026-08-29, cloud, rule 4 → Slice 184)

**The finding, and how it was found: by opening the file instead of copying the
previous handover's answer.** Dispatcher rule 5 asks whether a tracked metric
regressed on two consecutive runs. Its only input is
`.roundtable/loop-metrics.jsonl`, and **96 of 99 samples predate 2026-08-20**.
652 iterations have been logged since, against **3** samples — each a metric name
recorded exactly once, so not one of them can ever be "two consecutive runs".

- **`ci-wall-time`: 26 samples, all inside a single 17-hour window on
  2026-08-18.** That is the day **Slice 28.1** closed, with the Accept criterion
  *"`ci-wall-time` recorded every wake"*, written against the finding that the
  rule was "structurally blind to the one number that bounds every future gate".
  **The fix held for one day**, and nothing here re-asks a closed criterion.
- **The stale reading was already published.** Slice 183's dispatch record in
  `ROADMAP.md` quotes `ci-wall-time` "flat at 275s" as *this-wake* evidence. By
  CLAUDE.md's own standard that is a load-bearing number, quoted into the plan,
  wrong — and the previous handover carried it too.
- **Nothing detected it.** `dispatch_status.py` — the Step 0b instrument that
  exists *because* dispatcher rules starve silently — reads `loop-log.md` and
  covers rules 2 and 3 only. `loop-metrics.jsonl` was named **zero** times in
  `ROADMAP.md`, `ROADMAP-archive.md`, `LOOPS.md` and every `.roundtable/*.md`.
- **184.1 — the instrument now reads rule 5's input** and reports how many
  wake-dates of loop activity are newer than the newest metric pair rule 5 could
  compare. Red-proved by three injections, each confirmed to have landed in the
  file before the run, the file restored and checked byte-identical after. Base
  rate measured *before* shipping: replayed over all 17 wake-dates with
  as-of-date semantics it reads **live on 6, stale on 11** — a predicate that can
  read both ways, not ceremony.
- **184.2 — rule 5's text was missing the trigger added to revive it.** §4
  Optimize has carried "or a size budget breached outright" since 2026-08-23; the
  rule a dispatcher actually evaluates kept only the dead trend half. Fixed and
  stated where it was fixed. `LOOPS.md` Step 0b's "the two rules it covers" was
  corrected in the same pass — the same commit made it false.
- **One metric recorded, and it is one sample, not a restored criterion.**
  `axe-violations 0 pages`, genuinely measured this wake. Refused: recording
  `check:claims`' 141 under the existing `claims` name, whose earlier samples
  (65 → 82) measured something else.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**Nothing this wake needed one.** `git diff --stat` names only `ROADMAP.md`,
`LOOPS.md`, `scripts/loops/dispatch_status.py`, `.roundtable/` and the generated
`STATUS.md` — no `.css`, no `.astro`, nothing under `packages/core/src` and
nothing the docs build reads. That is an argument from the diff, **not a visual
check, and it is not claimed as one.**

Gates run twice, before and after the change, all green: core `build` + `test`
(146), `docs:build`, `check:repo` (slice-refs **372** citations, **166** slice
numbers each heading one section), `check:claims` (141), `check:layout` (127),
`test:axe` (127 × 2, zero violations). `rebuild_from_log.py` independently
reconciles the metric file at **99** through different code.

**Nothing visual is carried forward.** Slice 183 cleared that backlog locally and
this wake added nothing to it.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY at Step 0, fixed before any commit), 1b, 1c, 2
(unshallowed: `--is-shallow-repository` read `true`, now 1,566 commits), 3, 5
(`loops.db` absent on the fresh container). Not exercised: 4, 6, 7.

**A new one worth knowing, and it shaped the code.** The two dispatchers write
naive stamps at different offsets (164.2: 974 rows `+0800`, 40 `+0000`). This
container's clock read `2026-08-29 00:37` while the log's newest row, written by
the other dispatcher, read `2026-08-29 08:21` — **the same day, eight hours
"earlier"**. So 184.1 compares metric freshness by DATE, never by timestamp: a
timestamp comparison would report STALE on a wake that had just recorded a
metric. Checked live, not reasoned about.

## Rules 1-5 as read this wake, each re-derived

- **Rule 1 — no P0.** GitHub intake **0 open issues** (asked via the API), no
  open P0 in `ROADMAP.md`, and the full gate chain run on `origin/main` at
  `ad77cc17` came back green on all seven. Slice 184 was deliberately **not**
  classified P0: nothing is red and no shipped artefact is wrong.
- **Rule 2 — `Standardize 2 / 4 ok`.** Not armed.
- **Rule 3 — `Objective 2 / 3 ok` [180, 183]**. Not armed.
- **Rule 4 — ARMED, and this is the change from the last four wakes.** The six
  older items are still owner-blocked (`112.3`, `112.4`, `173.2`, `175.4`,
  `176.3`, `15.12` — each re-read in the file this wake, not copied). Slice 184,
  triaged from inside the dispatch (precedent: Slices 165 and 177), was the
  oldest *dispatchable* item, so Continue ran on it.
- **Rule 5 — evaluable again, and clear.** Before the fix it had no live input at
  all. `axe-violations` 0 → 0 is not a regression.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — and note there is now a **third**
line to read.

**Prediction written down first.** Before recording: `Standardize 2/4`,
`Objective 2/3`, parser 1,088 against a raw `grep -c "^- "` of 1,088. Predicted
after two `record_iteration.py` calls carrying no `--also-refused`: **1,090**
rows, `Standardize 2/4` (Continue rounds count, so **3/4**), `Objective`
**3/3 OVERDUE** — 184 is a slice closed by a Continue row, and 180/183 are
already banked. Rule 5's line predicted to read `0 wake-date(s) newer … ok`.

**Check it against the real output rather than assuming; 182.3's lesson is that
the row count is the part that surprises** (`--also-refused` emits its own
`Meta · refusal` row, so one call carrying a refusal writes two).

## What the next wake should expect

**Rule 3 should be ARMED at 3/3** — verify, do not trust this line. If it is,
the next wake is an **Objective grill** covering 180, 183 and 184, above rule 4.

If it is not armed, rule 4 has nothing again: the same six owner-blocked items,
and Slice 184 opened no new one. That routes to rule 5 — now genuinely
readable — and then rule 6 → Polish.

**Read the rule-5 line before answering rule 5.** If it says STALE, rule 5 has no
input: say it could not be evaluated rather than reporting it clear. That is the
whole point of Slice 184, and the failure it fixes is a wake confidently
reporting "no regression" from readings eleven days old.

**`LOOPS.md` grew by ~353 words this wake** and `report_loop_prose.py` now reads
`33 up / 1 down` for it. Not a finding on its own — 167.1 carries the verdicts —
but the next Standardize sweep should look, since 167.2's note was that
`LOOPS.md` sat at 0 down.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake.

**Do not re-raise Slice 179's or 182.2's refusals as new findings.** Both were
refused on measured base rates; re-measure before reopening, do not re-derive.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`** (line ~21190), not
  `ROADMAP.md`. Read it there; this line is a pointer, and a pointer that
  disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**. `@busy-office/ui` reads **0.5.0**.
- **Did this wake advance it?** **No.** The remaining step is owner-only and no
  cloud wake can run it. This wake ran rule 4 → Continue on Slice 184.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. Re-run
  the command and READ the matched rows rather than `-c`-ing them; the needle
  over-counts, because a row can mention `create-ui` while merely narrating the
  blockage. **Derived this wake: 44 non-Meta work rows since `fb15cdc`; the
  needle matches 2; reading them, only **164.3** advances the direction and
  **168.1** merely narrates it — so 43 of 44 did not.** *(Measured at `9ac84d1e`,
  before this wake's own log rows were committed. The last honest reads were
  41 of 42, 38 of 39 and 37 of 38.)*

  ```
  git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28).** Asked directly whether to pause the hourly routine until the
  publish, the owner chose **keep it running hourly**. So a wake finding this
  block's answers unchanged is looking at an **accepted state, not a fault**: do
  not re-triage it, do not raise it as a new finding, and do not slow or pause
  the routine on your own judgement. What WOULD be new information: the registry
  answering something other than E404, or the owner picking a different
  direction.

```
npm view @busy-office/create-ui version     # E404 → unpublished → still blocked
npm view @busy-office/ui version            # 0.5.0

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the needle change with it — and `fb15cdc` becomes whichever commit carries
the new decision. Rewrite them; do not reinterpret them.
