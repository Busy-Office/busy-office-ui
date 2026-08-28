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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 2 → Standardize,
Slice 178**). Working tree clean at hand-off; the wake's commits were pushed as
one push.

No collision. `git branch --show-current` answered EMPTY at Step 0 (detached
container, ENVIRONMENT.md trap 1), fixed with `git checkout -B main origin/main`
**before the first commit**; `origin/main` arrived as a forced update
(`17b3ba6...4be166b`). The mandated pre-commit `git fetch origin main` found it
unmoved at `4be166be`, confirmed against `git ls-remote --heads origin`, which is
the authority.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## Rule 2 fired this wake, and rule 3 is still armed

Dispatcher, in the order `LOOPS.md` states them: rule 1 clear (no open P0 —
`grep -niE '\bp0\b' ROADMAP.md` returns only closed slice headings and prose;
GitHub intake **0 open issues**, asked via the API, not assumed); **rule 2 fired**
at `Standardize 4 / 4 OVERDUE`.

**Rule 3 was armed at the same time and was NOT consumed** — it sits below rule 2,
so `Objective 3/3 [173, 176, 177]` was never evaluated for dispatch. After this
wake's recording it reads **`4 / 3 OVERDUE [173, 176, 177, 178]`**, because Slice
178 closes on a Standardize row and 161.4 counts those.

Rules 4-8 were not reached. The six open items are unchanged and all six are
owner-blocked — `112.3`, `112.4`, `173.2`, `175.4`, `176.3`, and `15.12` (AT
runtime evidence, owner hardware). Nothing this wake changed that set.

## What landed this wake (2026-08-28, cloud, rule 2 → Slice 178)

**The finding is one shape appearing twice: 169.3's split created a durable loop
file, and the two instruments that classify loop files were not told.**

- **178.1 — `report_loop_prose.py` never measured `.roundtable/ENVIRONMENT.md`,**
  while the comment directly above its own `FILES` list states the rule that
  required the row (167.2 added the `LOOPS-archive.md` row for exactly this).
  At `f52f2597`, `RESUME.md` went **3,150 → 1,683 words (−1,467)** and
  `ENVIRONMENT.md` appeared at **1,666** — the **largest single down step in
  RESUME.md's 65-step series**, scored as a shrink when it was a relocation.
  Red-proved with the injection asserted first (`count == 1` before replacing):
  a probe with only the new row's path broken exits **1** with `RECONCILIATION
  FAILED … listed here but not on disk`.
- **178.2 — the same file was filed by `generate_roundtable_index.py` as a
  dateless row under "Findings — snapshots"**, the one thing its own header says
  it is not. 141 findings / 7 ledgers → **140 / 8**.
- **178.3 — the prose cadence's verdict for `/concepts/scale/`**, the only one of
  today's 14 flagged pages carrying none (158.1's twelve + 161.1's three cover
  the other 13). The verdict: length honest (1,168 words, **all authored**, 167
  per `h2` against a corpus median of 103) — **and the page contradicts itself.**
  Two decision tables, both touched by ONE commit (`a1239e02`), send a reader
  scanning ~10,000 rows to windowing and to load-more respectively. The page's
  own caption states which is right; the older row was stale and now matches.
  Word-neutral: corpus total 104,737 and page total 1,168 unchanged after the fix.
- **178.4 — three sweeps at zero delta**: `css-repeats` 74/237/225/8 matching
  LOOPS.md's table on every group size; `dead-style` 0 of 1,428; `report_loop_prose`
  showing `LOOPS.md` at 32 up / **1** down, so 167.1's finding condition is unmet.

**⚠ A needle read a confident ZERO in this wake and was wrong.**
`grep -Fc -- "/concepts/scale/"` (trailing slash) reads **0** across both roadmap
files; without the slash it reads **4**. The finding survived only because
CLAUDE.md's "a plain zero is a defect in the instrument until proven otherwise"
was applied before the zero was believed. **Re-run, do not quote** — every figure
here is a snapshot and the commands are all in ROADMAP 178.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**One docs page changed and it was NOT visually verified.**
`apps/docs/src/pages/concepts/scale.astro` — the change is the text of one
existing `<td>`: no element, class or style added, so nothing about the page's
layout or colour moved. `check:layout` (127 pages), `test:axe` (127 × 2 widths)
and `check:claims` (141 behaviours) all passed, and the
`DOCS_BASE=/busy-office-ui` build resolved the row's new link. **That is what
ran; it is not the same as having looked at the page.** A local wake glancing at
`/concepts/scale`'s first decision table would close this out in seconds.

**The carried-forward visual items have now waited FIVE wakes.** Neither is
dispatchable here; both need a local wake with a browser:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` renders on **39** pages, so if the badge wraps badly it wraps in 39
  places. First local wake: glance at one component page's "Design-system
  alignment" heading at 390px — make it `/components/scan`.

  **⚠ Do NOT "correct" that 39 to 40 from `check:dsa-scores`.** The gate reports
  *"40 requested by a page"*, which counts component ENTRIES, not pages:
  `state-patterns.astro` renders `<DsaScore` twice. 39 pages request 40 entries.
  A `grep -rlE "<DsaScore|DsaScore "` also reads 40, and that second alternative
  matches a *comment* in `concepts/which-pattern.astro:16` — an assertion
  tripping on prose about itself. Count `<DsaScore` files, or count built pages
  carrying "Design-system alignment": both read **39**.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY, caught before the first commit), 1b, 1c (**bit for real**:
`scan:dead-style` produced no output line with `CHROME_PATH` unexported, and only
re-running it in the same command as the export gave the number), 2 (unshallowed:
`--is-shallow-repository` read `true`, now 1,550 commits — load-bearing, since
this wake's whole finding is a history measurement), 3. Not exercised: 4, 5, 6, 7.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md` — 164
  was swept by 177.1. Read it there; this line is a pointer, and a pointer that
  disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 2 → Standardize on Slice 178.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. This
  wake: **37** non-Meta work rows since `fb15cdc`, of which the needle matches
  **2**; reading them, only **164.3** advances the direction and **168.1** merely
  narrates it. So **36 of 37** did not.

  **⚠ The `grep create-ui` needle over-counts.** Read the matched rows; do not
  `-c` them:

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
npm view @busy-office/ui version            # 0.5.0 on 2026-08-28

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
git diff fb15cdc..HEAD -- .roundtable/loop-log.md | grep '^+- ' | grep -vc ' · Meta · '
```

**`create-ui` is the only name in these commands that will age.** When the owner
picks a direction that is not "publish the front door", the two `npm view` lines
and the needle change with it — and `fb15cdc` becomes whichever commit carries
the new decision. Rewrite them; do not reinterpret them.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson — that comparison has found two of
the parser's five blindings and nothing else ever has.

**Prediction written down first, then checked, which is the point of the
exercise.** Before recording: `Standardize 4/4 OVERDUE`, `Objective 3/3 OVERDUE
[173, 176, 177]`, parser 1,074 against a raw `grep -c "^- "` of 1,074. One
Standardize row plus one `--also-refused` row should read **1,076**; rule 2
should RESET to `0/4`; and rule 3 should gain Slice 178, since 161.4 counts a
slice closed by Standardize.

After recording: **`Standardize 0/4 ok`, `Objective 4/3 OVERDUE
[173, 176, 177, 178]`**, parser **1,076** against a raw `grep -c "^- "` of
**1,076**. **Prediction confirmed on all four numbers.**

## What the next wake should expect

**Rule 3 → Objective is the likely dispatch** — it is the only armed counter, it
is one over its threshold, and rule 2 is spent. It needs no browser, so it is
cloud-dispatchable. Its material is Slices 173, 176, 177 and 178.

**Rule 4 still has nothing to give**: all six open items are the owner-blocked
set above, unchanged by this wake.

**Do not re-raise Slice 178's refusal as a new finding.** A gate for "two tables
on one page disagree about the same decision" was refused, measured against
94.11's shape-vs-meaning line and recorded with the iteration. The cadence is the
mechanism that caught it, which is what 158.2 says the cadence is for.
