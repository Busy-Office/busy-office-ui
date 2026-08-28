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

Last updated 2026-08-28 (cloud wake, scheduled routine — **rule 6 → Polish,
`component/scan`**). Working tree clean at hand-off; the wake's commits were
pushed. No collision this wake: the mandated pre-commit `git fetch origin main`
found `origin/main` unmoved at `da9145a9`, and `git branch --show-current`
answered `main` rather than empty (ENVIRONMENT.md trap 1, checked BEFORE the
first commit, which is the only time it helps).

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## ⚠ RULE 6 FIRED, AND IT IS THE FIRST WAKE THAT ACTUALLY REACHED IT

The previous handover predicted *"the next wake may well reach rule 8 and halt."*
It did not, and the prediction was wrong for a reason worth carrying: **rules 5,
6 and 7 sit between rule 4 and the halt**, and rule 6 had a queue nobody had
looked at. Rule 4 genuinely found nothing dispatchable — all five open
checkboxes are owner- or hardware-blocked, re-verified by reading each — but
`polish_requeue.py --apply`, which rule 6 *mandates* running first, marked ten
surfaces re-queued, and the ledger named a scan re-score as pending.

**So: do not conclude "halt" from rule 4 being empty.** Run rule 5's metric
check and rule 6's re-queue before deciding, as this wake did.

## What landed this wake (2026-08-28, cloud, rule 6 → Polish on `component/scan`)

Dispatcher: rule 1 clear (no open P0; GitHub intake **0 open issues**, asked via
the API, not assumed), rule 2 `Standardize 2/4 ok`, rule 3 `Objective 1/3 ok
[173]`, rule 4 no dispatchable item, rule 5 no metric with two consecutive
readings and no budget breach (`rf-essentials` 36.4 kB against 40 kB).

- **176.1 — `/components/scan` published "Not yet scored" for five days after
  it was scored.** The 2026-08-23 Polish re-entry round scored scan, found
  colour/interaction/fit all at 2, and fixed all three — but wrote the result
  into `polish-state.md` prose only. `dsa-scores.json` never got the entry, so
  `DsaScore.astro` rendered its missing-entry fallback to every reader.
- **The gate printed the discrepancy and passed on it.** `check:dsa-scores`
  reported *"39 scored components (40 requested by a page)"* the whole time.
  Assertion 7 now asserts it per name, **red-proved twice** — once by the real
  defect (`FAIL scan: …`) before the entry existed, once by deleting an
  unrelated entry (`FAIL kv: …`) to prove the check is not scan-shaped, with the
  injection confirmed absent from the parsed JSON before the red was believed.
- **The ledger contradicted itself and `LOOPS.md`.** It said `QUEUE DRY` while
  its own table listed 10 `RE-QUEUED` rows, and still carried *"Polish drives on
  content, fit and interaction ONLY"* — refuted by 171.1 five days ago in
  `LOOPS.md` and never corrected here. Both fixed, with the re-measurement.
- **176.2 raised OPEN and deliberately not resolved.** `polish_requeue.py`
  re-queues on source change; §3b admits only `check:wrong-choice`'s TODO. All
  10 re-queued rows score `content: 3` and are off the TODO, so rule 6
  dispatches Polish onto surfaces with no scored weakness. Both sides are
  deliberate decisions three days apart and neither names the other; resolving
  it changes what the dispatcher does on every clear-backlog wake.

**Re-run, do not quote** — every figure here is a snapshot and the ROADMAP entry
carries its commands.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**The commit's only rendered change is `/components/scan`'s "Design-system
alignment" section**, which stops rendering the one-line fallback and starts
rendering the six-row table — from the same `DsaScore.astro`, with no markup and
no CSS change. `git diff --stat` names no file under `packages/core/src` and no
`.css` anywhere. `check:layout` and `test:axe` swept 127 pages at both widths and
were green; the unit suite is 146/146; the rendered artefact was checked, not
just the diff (`"Not yet scored"` now appears in **zero** built pages).

**That section's appearance at 390px was NOT looked at.** It is the same
component and the same table markup as the 39 pages already carrying it — which
is an argument, not a verification, and is why it is named here.

**The carried-forward visual items have waited another wake** — both need a
local wake with a browser, and neither is dispatchable here:

- `DsaScore.astro` and `concepts/which-pattern.astro` each gained
  `<span class="bo-badge">generated</span>` inside an existing `<h2>`.
  `DsaScore` now renders on **39** pages (scan joined them this wake), so if the
  badge wraps badly it wraps in 39 places. First local wake: glance at one
  component page's "Design-system alignment" heading at 390px — and make it
  `/components/scan`, which is the page this wake changed.
- The `#markers` table on `/components/data-table` at 390px, both themes.

**Traps exercised for real this wake:** 1 (branch checked before the first
commit; `origin/main` arrived as a forced update `17b3ba6...da9145a`), 1b, 1c, 2
(unshallowed before the direction ratio), 5 (`polish_requeue.py` **crashed** on a
fresh container with `FileNotFoundError: packages/core/dist/api.json` — rule 6's
own mandated first command needs `npm run build -w @busy-office/ui` to have run;
build first), 6 (a background gate's empty output file read as "still running",
correctly). Not exercised: 3, 4, 7.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  `ROADMAP.md`'s Slice 164.3. **Read it there**; this line is a pointer, and a
  pointer that disagrees with its source loses to the source.
- **Remaining step, and who it waits on:** `npm publish -w
  @busy-office/create-ui` — **owner-only**, by CLAUDE.md's standing policy
  ("Publishing remains owner-triggered"). Asked the registry this wake, which is
  the authority: **still E404**.
- **Did this wake advance it?** **No.** The remaining step is owner-only, and no
  cloud wake can run it. This wake ran rule 6 → Polish on `component/scan`.
- **Work rows since the direction was decided that did not advance it:**
  **31 of 32** as of this wake (was 30 of 31). Derived this wake, unshallowed
  first; re-derive rather than increment — a copied number is 169.1's exact
  failure mode. The needle matched **2** rows and only **164.3** advances the
  direction; **168.1** merely narrates it, which is why the count below is a
  read, not a `-c`.

  **⚠ The `grep -c create-ui` needle over-counts.** Only ONE of its matches
  advances the direction (164.3, which fixed three publish blockers); the other
  merely *narrates* it (168.1's own row). Read the matched rows; do not `-c`
  them:

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

Read at Step 0b against tip `da9145a`: **Standardize 2/4 ok, Objective 1/3 ok
[173]**, parser 1,062 against a raw `grep -c "^- "` of 1,062.

**Note for the next wake: a Polish row does NOT move rule 2 or rule 3.** Rule
2 counts Continue rounds; rule 3 counts slices closed by Continue **and**
Standardize only (161.4). So expect the counters to read the same as they did
this wake, and do not read that as the recorder failing — re-read
`dispatch_status.py` at Step 0b rather than trusting this line.

**When rule 4 is next reached, re-derive its oldest dispatchable item from
`ROADMAP.md`'s `N. [ ]` checkboxes.** At hand-off the open set is **6** —
the five that were open before, every one owner-blocked or needing hardware,
plus this wake's own 176.2:

- `112.3` / `112.4` — blocked on owner briefs, and on 112.3's verdict.
- `173.2` — explicitly *owner to pick* between two candidates (a row-level error
  row, or a message that floats on focus).
- `175.4` — OWNER CALL, Step 0c's reopen condition.
- `176.2` — the requeue-vs-queue contradiction. **Direction, so owner-facing**,
  but note it is the one open item a loop could plausibly argue itself into
  deciding; if a wake does take it, the Accept explicitly allows "the
  contradiction is benign" as a closing outcome, and requires the consequence
  for rule-6 firing rate to be **measured against the log, not predicted**.
- `AT runtime evidence` (Slice 15) — NEEDS-RUNTIME, owner hardware.

**So the next wake will likely reach rule 6 again** — `polish_requeue.py
--apply` will still report the same ten re-queued surfaces, because 176.2 is
open and nothing has changed the mechanism. **That is exactly the state 176.2
describes, and it is not a new finding.** A Polish round on any of those ten has
no scored weakness to fix (all `content: 3`, all off the wrong-choice TODO), so
do not manufacture one: say so in one line, and either take 176.2's decision to
the owner or fall through to rule 7 (Research). Do not re-dispatch Explore.
