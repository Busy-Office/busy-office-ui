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
Slice 182**). Working tree clean at hand-off; the wake's commits went out as one
push.

**Reconcile this file against `ROADMAP.md` before trusting its open set** — it
goes stale between wakes. Trust the `N. [ ]` checkboxes, not this section.

## ⚠ A COLLISION HAPPENED, AND THE PRE-COMMIT FETCH IS THE ONLY THING THAT SAW IT

`origin/main` moved **`65139a8` → `fb25abf5` mid-wake** — the other dispatcher's
PO-screenshot triage. It had already taken **Slice 181**, and this wake had
written its own 181. Two sections under one number is exactly what
`check:slice-refs` fails on, so `main` would have gone red on the push.

Nothing caught it except `LOOPS.md` Step 0c's mandated `git fetch origin main`
**immediately before the first commit**. Nothing else could have: their diff is
`ROADMAP.md` + `loop-log.md` + `STATUS.md`, this wake's work was
`dsa-scores.json` + `polish-state.md`, and the ROADMAP hunks are ~1,600 lines
apart, so the rebase was a **clean fast-forward with no conflict**. That is the
**third collision and the second in a row to merge cleanly** — the evidence
175.4 is open on, now with one more data point.

**Run that fetch. It is a process rule with nothing mechanical behind it.** Also
note: the other dispatcher appended its slice at the END of `ROADMAP.md`
(line ~1859), not at the top where 178/179/180 sit. Both orderings are in the
file now; this wake followed the newest-first convention at the top.

## What landed this wake (2026-08-28, cloud, rule 6 → Slice 182)

- **182.1 — `skeleton · colour` cited the token pairing that was REMOVED.** The
  cite read *"gradient built from bg-muted/bg-hover tokens"*; the shipped CSS
  sweeps `--bo-color-bg-muted` to `--bo-color-skeleton-highlight`.
  `bg-muted/bg-hover` is the pairing `ef64c745` deleted on 2026-08-25 because
  the two tokens are byte-identical in both themes — the shimmer swept from a
  colour to itself. Cite written `479cc6a9`, 2026-08-21. So the **evidence for
  `colour: 3` described the bug**, published verbatim on
  `/components/state-patterns` for three days.
- **Surface picked on a measured discriminator, not a coin toss.** Nine surfaces
  re-queued, all `content: 3` at `1/3` — 176.1's unbroken tie. `state-patterns`
  is the **only page with two rubric entries** (`skeleton` + `state`; 39 pages,
  40 entries), so every per-component arm gets two chances to disagree.
- **The score was NOT re-taken; `scored` stays `2026-08-23`.** §3b step 4 needs a
  blind re-score by a second agent and this wake could not run one. **`skeleton ·
  colour` is owed a blind re-score** — the same debt `scan`'s three dimensions
  carry. Do not read the repaired cite as a fresh score.
- **182.2 — the obvious gate was measured and REFUSED.** 28 token references
  across 240 cites, **1** absent from its component's CSS (this one); `money`'s
  is adjudicated false (`.bo-input` is in `components/form/`, which `money.css`
  composes). Three dead instruments came first — `--bo-*`-only could not see the
  shorthand; token stems gave a **plain zero of 240** (stems are
  `color-bg-muted`, cites write `bg-muted`); aliases gave 14, of which 13 were
  the bare CSS property `font-size` inside negations.
- **The repair tripped the detector, and that is the load-bearing half of the
  refusal.** The first correction explained what `bg-hover` had been, and the
  probe went red on the fix — CLAUDE.md's *assert on structure, never on raw
  text* trap, hit live. It also decided the shipped wording: `DsaScore` renders
  the cite **verbatim to readers**, so loop forensics belong in the ledger, not
  in a published cite. Probe left in the scratchpad deliberately; it is not a
  gate.

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, no screenshots at 1440px/390px in light and dark.

**This wake's change is one JSON string** rendered by `DsaScore` as running text
inside an existing block — `git diff --stat` names only `apps/docs/src/data/
dsa-scores.json`, `ROADMAP.md` and `.roundtable/`; no `.css`, no `.astro`,
nothing under `packages/core/src`. That is an argument from the diff, **not a
visual check, and it was not claimed as one.**

Gates run on the merged tree, all green: core `build` + `test` (146),
`docs:build`, `check:repo` (slice-refs **368** citations, **164** slice numbers
each heading one section), `check:dsa-scores` (**360** assertions, 40 of 40),
`check:claims` (141), `check:layout` (127), `test:axe` (127 x 2). The fix was
checked against the **rendered** page: built `state-patterns/index.html` carries
`skeleton-highlight` once and `bg-muted/bg-hover` zero times.

**The carried-forward visual backlog is CLEARED (2026-08-29, local wake, Slice
183).** All five items measured at 390px in a real browser; **all five clean, no
defect found**. `docOverflow` read 0 on every page in every theme; the
`generated` badge sits at **1.1 lines** with `badgeOverflows: false` on every
heading, so the 39-page wrap risk is closed; `state-patterns`' longer repaired
`colour` cite wraps in-cell with the table at exactly container width.

Wide tables reporting `spillsViewport: true` **with** `scrollable: true` are the
designed behaviour, not findings — `.bo-data-table-container` is `overflow-x:
auto` and `check:scroll` already asserts it across 804 containers. Do not
re-raise them.

**Nothing visual is carried forward.** The next local wake does not owe this
sweep; re-open only if a NEW page or a changed cite is added.

**Traps exercised for real this wake:** 1 (detached HEAD — `git branch
--show-current` EMPTY at Step 0, fixed before the first commit), 1b, 1c, 2
(unshallowed: `--is-shallow-repository` read `true`, now 1,560 commits), 3, 5
(`loops.db` absent on the fresh container — `record_iteration.py`'s guard
handled it). Not exercised: 4, 6, 7.

**`polish_requeue.py` needs `packages/core/dist/api.json`** and dies with a
traceback on a fresh container before `npm run build -w @busy-office/ui`. Build
core first; this is ordering, not a defect. Confirmed again this wake.

## Rule 6 fired this wake — what rules 1-5 read on the way past

Dispatcher, in the order `LOOPS.md` states them. Every reading re-derived, not
copied from the previous handover.

- **Rule 1 — no P0.** GitHub intake **0 open issues** (asked via the API, not
  assumed), no open P0 in `ROADMAP.md`, and — the check that found last wake's
  P0 — the full gate chain run on a clean checkout of `origin/main` at
  `65139a8` came back **green on all seven**. The branch was healthy.
- **Rule 2 — `Standardize 1 / 4 ok`.** Not armed.
- **Rule 3 — `Objective 1 / 3 ok` [180]**. Not armed.
- **Rule 4 — nothing dispatchable.** All six open items re-read this wake and
  all owner-blocked: `112.3` (owner briefs), `112.4` (on 112.3's verdict),
  `173.2` (owner to pick between two designs), `175.4`, `176.3` (both OWNER
  CALL), `15.12` (needs owner hardware + a screen reader).
- **Rule 5 — nothing.** No metric with two consecutive regressions:
  `ci-wall-time` flat at **275s** over its last three readings, `rf-essentials`
  **36.4 kB against a 40 kB** budget this wake.
- **Rule 6 → Polish.** `polish_requeue.py --apply` re-queued **9** surfaces.

## Counters after this wake

Run `python3 scripts/loops/dispatch_status.py` and read it **immediately after
`record_iteration.py`**, per 166.5's lesson.

**Prediction written down first, then checked — and it was WRONG by one, which
is the whole point of writing it down.** Before recording: `Standardize 1/4`,
`Objective 1/3`, parser 1,084 against a raw `grep -c "^- "` of 1,084. Predicted
**1,085** (one Polish row), rule 2 unchanged at `1/4` (a Polish row is not a
Continue round), rule 3 unchanged at `1/3` (161.4 excludes Polish from the
slice-closing set).

After recording: `Standardize 1/4 ok`, `Objective 1/3 ok`, parser **1,086**
against a raw `grep -c "^- "` of **1,086**. **Rules 2 and 3 exact; the row count
off by one.**

**Why, and it is knowable in advance: `--also-refused` emits its OWN `Meta ·
refusal` row.** One `record_iteration.py` call carrying a refusal writes **two**
rows. Add one per `--also-refused` when predicting. Recorded as roadmap 182.3.

**Also 182.3: 161.4's premise is now false and its rule is still right.** It
excluded `Polish` from slice-closing because `Meta`/`Polish`/`Optimize` "have
never named a slice at all"; this wake's Polish row names 182.1/182.2. Rule 3
still behaved correctly (stayed `1/3`) because the exclusion is by loop NAME,
not by whether a row cites a slice. Recorded, not fixed — 170 finding B refuses
a sixth classifying regex here.

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
  cloud wake can run it. This wake ran rule 6 → Polish on Slice 182.
- **Work rows since the direction was decided that did not advance it:** derive
  it, do not increment — a copied number is 169.1's exact failure mode. Re-run
  the command below and READ the matched rows rather than `-c`-ing them; the
  needle over-counts, because a row can mention `create-ui` while merely
  narrating the blockage (168.1 does exactly that). **Derived this wake: 42
  non-Meta work rows since `fb15cdc`; the needle matches 2; reading them, only
  **164.3** advances the direction and **168.1** merely narrates it — so 41 of
  42 did not.** *(Measured at `9cbd0d1c`, before this wake's own log rows were
  committed — re-running it after the chore commit reads higher. The point is
  that it is re-run: the last two honest reads were 37 of 38 and 38 of 39.)*

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

## What the next wake should expect

Rule 2 at 1/4 and rule 3 at 1/3 — neither armed. So the next wake falls to
**rule 4**, which still has nothing to give: the same six owner-blocked items,
and Slices 181 and 182 opened no new one. That routes it to **rule 5** (nothing)
and then **rule 6 → Polish** again.

Run `python3 scripts/loops/polish_requeue.py --apply` first, per rule 6's own
text, and build core before that or it dies on a missing `api.json`.

**`state-patterns` is now at 2/3 and its source moved this wake, so it will
re-queue itself** — do not take it a third time while eight surfaces sit at 1/3.
Prefer one of those. §3b's tie-break is "fewest rounds used", which now
discriminates for the first time.

**Two blind re-scores are owed and neither can be done in a cloud wake** (§3b
step 4 needs a second agent): `scan`'s three fixed dimensions, and now
`skeleton · colour`. A local wake that can run one should — without it the
dry-round exit can never fire, which is the mechanism 176.3 is open about.

**Do not re-raise Slice 179's refusal as a new finding.** A gate for
`check:selftests`' blind spot over `scripts/loops/*.py` was refused, measured:
2 of 9 scripts carry a tag, both are honest, and zero defects sit behind the gap,
so a gate would be ceremony on a predicate nothing has broken.

**Nor 182.2's.** A gate asserting every token named in a DSA cite exists in that
component's CSS was refused on a measured base rate (1 of 28) *and* on the
detector tripping on the repair's own prose. Re-measure before reopening it; do
not re-derive the refusal.
