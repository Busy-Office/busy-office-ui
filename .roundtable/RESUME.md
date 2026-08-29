# Resume state — read this at Step 0 of every wake

> **⚠ ALSO READ `.roundtable/ENVIRONMENT.md` — the git/build traps and the
> toolchain that works.** It used to live in this file. It does not any more
> (roadmap 169.3, 2026-08-28), because this file is rewritten wholesale every
> wake and that is where corrections go to die. `LOOPS.md` Step 0 names both
> files, and two advisory checks run from `record_iteration.py` — the charter
> check and `check:resume-slice-ids`. Both REPORT on stderr; neither fails a
> build (roadmap 175.3).

The wake prompt says *"don't assume prior-turn state"*. This file is how a wake
picks up work that was left mid-flight, so the instruction stays true across a
context clear. **Keep it current whenever a slice is left uncommitted, and empty
it the moment the slice lands.**

---

## In flight: nothing

Last updated 2026-08-29 (cloud wake, scheduled routine — **rule 1, Continue bug
mode**, landed as **201**). Working tree clean at hand-off.

**Reconcile this file against `ROADMAP.md` before trusting its open set:**

```
grep -cE '^\s*[0-9]+\. \[ \]' ROADMAP.md                # 10 at hand-off
node apps/docs/scripts/check-resume-slice-ids.mjs       # names the closed ids
```

## What landed this wake (201) — a P0 found while measuring, not while looking

**The dispatch changed twice, both times because the queue moved under it.**
Rules 1-3 were clear and rule 4 found all three open items owner-blocked, so
this wake began a **rule 6 (Polish)** round. A collision reset it onto a tree
where Slice 200 had just been triaged — **7 new open items** — so rule 4 now
fired. While measuring **200.7's base rate BEFORE building it**, which is what
200.7's own Accept demands, the measurement turned up a shipped defect and
**rule 1 preempted**. Same shape as Slice 180: the P0 was found by the wake,
not reported to it.

| what was measured | verdict |
|---|---|
| `scan.css` names `var(--bo-motion-ease)` | **defined nowhere**, in src and in `dist` |
| computed `animation-name` on `body[data-scan-result]::after` | **`none`**, `opacity 0` — the RF scan flash painted **nothing** |
| `combobox.css` names `var(--bo-font-family-mono)` | **defined nowhere**; the token is `--bo-font-mono`, spelled right by 6 other components |
| computed `font-family` of `.bo-combobox__option-code` | **byte-identical to `document.body`** — sans-serif, against a `.bo-kbd` control computing monospace |

An unresolvable `var()` is neither a syntax error nor a no-op: the whole
declaration is **invalid at computed-value time**, so the property inherits and
nothing warns. stylelint sees valid syntax; `check:motion` asks whether a
duration is token-driven, never whether the token *resolves*.

Both fixed, both re-measured after the fix. **`check:token-refs` added** — every
`var(--bo-…)` with no fallback must name a property something defines.

## The three things worth carrying forward from 201

1. **`check:token-refs` caught a real ordering bug in its own wiring.** Placed
   after `check:motion` it ran *before* `build:rf-essentials` writes
   `rf-essentials.css`, read a stale copy, and failed on a typo already fixed in
   source — the `build:acr` stale-`dist` trap again. It now runs after
   `check:rf-floor`, verified against `rm -rf packages/core/dist`, not an
   incremental build.
2. **The first instrument undercounted by 52%.** A line-scoped
   `grep -oE '(transition|animation)…'` over the 44 component stylesheets found
   **11** declarations; a multi-line-aware parse found **23**. Every wrapped
   declaration was silently dropped. The base-rate claim in 201.4 rests on the
   second number.
3. **Siblings, re-verified rather than assumed.** 201.2 exists only because
   CLAUDE.md's *"when one claim dies this way, re-verify its siblings"* was
   executed as a command instead of read. The sweep found **9** undefined names;
   **7 are consumer-override hooks carrying fallbacks and are correct**. Do not
   re-file those seven.

## 201.4 is OPEN and it constrains 200.7 — read it before building 200.7

`grep -n '201.4' ROADMAP.md`. Measured: of the 23 transition/animation
declarations in component CSS, 5 are `none`, 16 are token-driven, and **2 carry
a literal duration — `scan`'s `600ms` and `skeleton`'s `1.8s linear`. Both are
correct**, no token exists at either value, and `check:motion` already
adjudicates both via its reduced-motion route (b). So a naive 200.7 gate's only
two reds are two deliberate, documented decisions.

**201.4's Accept is written so that finding its premise false is satisfying** —
200.7 may ship against a predicate false of something today, *or* close as
refused. It may not ship a gate red only on those two.

## A Polish measurement this wake took and did NOT file — re-run it, don't re-derive it

Before the collision, the rule-6 round reconciled `component/data-table` (the
measured discriminator: the only one of 8 re-queued surfaces with commits in the
last day). **All four arms clean.** The ledger change was discarded by
`git reset --hard origin/main` and the wake re-dispatched, so **no Polish row
was recorded and `polish-state.md` is untouched** — said plainly rather than
counted as a round.

The part worth keeping is the answer to a question `polish-state.md` explicitly
deferred to *"a later wake"* — whether arm 4 deserves a gate:

- **18 of 18** `content`-cite clause quotes are still present verbatim on their
  page. A structural classifier (the quote introduced by `wrong-choice clause:`)
  finds **17 of 40** and misses `scan`, which words the introduction with an
  em-dash instead.
- A naive classifier (any quoted string) checks 20 and produces **2 false
  positives** — `byline`'s `"many rows"` (a quote of a *rejected first draft*)
  and `button`'s `"use X instead of a button"` (a placeholder template on a
  component EXEMPT from the clause gate).
- **So a gate is refused, on 94.11's ground.** The predicate is uniformly true,
  and the two candidate detectors trade a 10% false-positive rate against
  silently under-counting. Telling a page-clause quote from a rejected draft is
  semantic, not shape.

Re-run rather than trusting the above — the classifier is eight lines over
`dsa-scores.json` + `apps/docs/src/pages/components/*.astro`, and it was
red-proved by perturbing a clause in the file the detector reads (1 miss under
injection, 0 without).

## ⚠ THIS WAS A CLOUD WAKE — WHAT WAS NOT LOOKED AT

No Podman, no `localhost:8081`, **no screenshots at 1440px/390px in light or
dark**. Nothing was visually verified and nothing is described as if it were.

**This matters more than usual this wake, because the diff touches shipped
CSS.** Every figure in Slice 201 is a computed-style or `font-family` reading
taken from headless Chrome (`browser-harness.mjs` + `serve-dist.mjs`). That the
scan flash now animates, and to exactly what values, is measured. **How it looks
— the wash's weight in peripheral vision, which is the whole design argument for
it — is UNVERIFIED.** A local wake looking at `/components/scan/` is worth one
minute.

**A rendering item was declined on exactly this basis and the other dispatcher
took it.** Rule 4's oldest dispatchable item was `200.1` (dialog exit motion);
it was classified **browser-blocked** rather than taken, and a local wake landed
it (`f0d7324b`) while this one worked. That is the cloud/local split working as
LOOPS.md rule 4 describes it, with the cost visible: `200.2`–`200.6` are all
shipped-CSS rendering changes and are the same kind of blocked.

No `verifier` agent is available in this session, so the staged diff was read by
hand — said plainly rather than logged as a verifier pass.

Gates green on the committed tree, **re-run in full after the rebase onto
`origin/main`** rather than trusted from the pre-collision build: core `build`
(incl. the new `check:token-refs`) + `test` (**146** passed), `docs:build`,
`check:repo` (slice-refs **404** citations / **183** slice numbers),
`check:claims` **146**, `check:layout` **127** pages, `test:axe` **127 pages ×
2 widths, zero violations**, `check:selftests` **46 gates / 30 exact** — the new
gate registered and tagged.

## ⚠ TWO COLLISIONS THIS WAKE, AND BOTH WERE CAUGHT BEFORE A COMMIT

Step 0c's mandated `git fetch origin main` immediately before the first commit
did its job **twice**:

- `59b690dd → 28d8e8d5` (Slice 200 triage + a Research round). Caught before
  any commit. **This one changed the dispatch** — 7 new open items moved rule 4
  from "nothing dispatchable" to firing.
- `28d8e8d5 → 0951e207` (`200.1` closed by the other dispatcher). Caught before
  the second commit; **rebased cleanly**, no file overlap.

**Neither cost a wake's work**, unlike the previous two collisions. The
difference is that this wake's work had not yet been committed when the first
one landed, so the reset was free. That is luck about timing, not a mechanism —
Step 0c still says so.

## Counters after this wake

Verified after recording: **1155** rows by the parser against a raw
`grep -c "^- "` of **1155**, and the `loops.db` mirror at **1155**.

```
Standardize   5 / 4 Continue rounds   OVERDUE
Objective     3 / 3 slices            OVERDUE  [199, 200, 201]
Optimize      0 wake-date(s) newer    ok   [newest pair: axe-violations]
```

**BOTH rules 2 and 3 are now past threshold**, which is the change from the last
hand-off — rule 2 fires first (it sits above rule 3). Re-run
`dispatch_status.py` rather than trusting this block; three of this wake's own
rows moved it.

**Rule 5's instrument is NOT stale** — `0 wake-date(s) newer`, so rule 5 was
answerable and found nothing: the only metric with a sample newer than
2026-08-19 is `axe-violations` (0.0 → 0.0), and the one real size budget is
gate-enforced in the build (`rf-essentials` **37.0 kB min against a 40 kB
budget**). Both halves of rule 5 answered, neither triggered.

**No metric recorded**, deliberately: every figure this wake characterises one
declaration or one token set at one moment, not a repeatable sample under an
existing name, and a single-sample name pads the store rule 5 reads (184's
discipline).

## What the next wake should expect

**Rule 2 (Standardize) fires first — 5/4 and OVERDUE.** Run its three standing
sweeps (`scan:dead-style`, `report:css-repeats`, `report:prose`, plus
`report_loop_prose.py`, reading the `ratchet` block first). Rule 3 (Objective,
3/3 on 199/200/201) is immediately behind it.

**Rule 4's set has grown and is no longer uniformly owner-blocked.** Re-count
rather than copying:

| item | blocked on | which kind (LOOPS.md rule 4) |
|---|---|---|
| `200.2`–`200.6` (5 items) | shipped-CSS rendering changes needing 1440/390 × light/dark screenshots | **browser-blocked — a LOCAL wake can take these** |
| `201.4` | nothing — it is a measurement + a decision | **dispatchable, cloud included** |
| `112.3` | the owner writing 5 real ERP screen briefs with sealed picks | **owner-blocked** |
| `112.4` | `112.3`'s verdict | **owner-blocked** |
| `15.12` | owner hardware — a human listening to a screen reader | **owner-blocked** |

**Read the items rather than trusting this table**, and note the cloud/local
split is now load-bearing: a cloud wake reporting "all blocked" here would be
repeating the exact error LOOPS.md rule 4 records against four consecutive
wakes.

**Do not re-raise Slice 179's or 182.2's refusals, 176.3, the retired
product-vs-machinery ratio, Slice 195's finding A, 167.1's retired `CLAUDE.md`
watch, or `199.1`/`104.4`'s thrice-refused complexity filter.** New to this
list: **the seven fallback-carrying undefined tokens** (`--bo-grid-min` and
friends) are consumer-override hooks and are correct — `check:token-refs`
prints their count every run precisely so they are not re-discovered as a
finding.

**Two blind re-scores are still owed and neither can be done in a cloud wake**
(§3b step 4 needs a second agent): `scan`'s three fixed dimensions, and
`skeleton · colour`. Unchanged by this wake. Note that `scan`'s CSS changed this
wake, so it will re-queue.

**Adjudicated at hand-off, which is the step `check:resume-slice-ids` exists to
prompt.** Run against this rewrite it reports **12 named ids: 5 closed —
`200.1`, `199.1`, `201.1`, `201.2`, `201.3` — and 1 archived (`104.4`)**.
Every one is a historical reference or this wake's own work: `201.1`/`201.2`/
`201.3` are what this wake closed; `200.1` is the rendering item this wake
declined and the other dispatcher landed, named throughout in the past tense;
`199.1` and `104.4` are prior refusals named only to say what must not be
re-raised. **None is a claim that any is open.** The genuinely open ids —
`200.2`–`200.6`, `201.4`, `112.3`, `112.4`, `15.12` — are in the table above and
are **not** among the closed set, which is the check agreeing with the table.
Re-run it after the next recording; the count moves with every rewrite.

## Direction — the owner's pick, and whether THIS wake advanced it

**Standing section, added by 168.1 (2026-08-28). Answer all four every wake,
from the sources named — never by copying the answers above you.**

- **Direction:** (a) adoption/DX — finish it by publishing
  `@busy-office/create-ui`. Source: the `DECISION (owner, 2026-08-28)` block in
  Slice 164.3, which lives in **`ROADMAP-archive.md`**, not `ROADMAP.md`. Read
  it there; a pointer that disagrees with its source loses.
- **Remaining step, and who it waits on.** The publish is done (`npm view
  @busy-office/create-ui version` → **`0.1.0`**, re-asked this wake) and the
  release workflow ships it. What is left is **one thing this loop cannot check
  from here: whether `@busy-office/create-ui` has a Trusted Publisher configured
  on npmjs.com.** **Stated as unknown, not as done.** If it is not set, the
  first release publishes core and then fails on create-ui's publish step; the
  workflow's comments carry the recovery. A release cannot even be *attempted*
  today without a version bump — `check-publishable.mjs` exits 1 on both
  packages, by design.
- **Did this wake advance it?** **No.** Rule 1 dispatched a P0 in the CSS
  package; nothing in the diff touches `create-ui`.
- **Work rows since the direction was decided that did not advance it:**
  **78 of 84** (derived this wake, not incremented). Re-derive rather than
  copying — and read it as a **rate, not a state**: the owner was shown this
  ratio and decided to keep the routine running hourly anyway (2026-08-28).
  *(Last honest reads: 78 of 84, 74 of 80, 69 of 72, 68 of 71, 65 of 68, 61 of
  64, 56 of 59, 55 of 58, 52 of 55, 49 of 52, 46 of 47, 43 of 44, 41 of 42, 38
  of 39.)*
  **Snapshot caveat, and it is real:** both dispatchers append to this log, so
  a figure taken mid-wake moves under you. This one includes this wake's own
  row and was taken against the working tree.

  ```
  # `git diff fb15cdc..HEAD` MISSES the current wake's rows until they are
  # committed; drop the `..HEAD` to diff the working tree instead.
  git diff fb15cdc -- .roundtable/loop-log.md | grep '^+- ' \
    | grep -v ' · Meta · ' | grep create-ui        # print them, don't -c them
  ```

  Left as a two-line read rather than a smarter regex on purpose: any needle
  that tries to separate "advanced" from "mentioned" is guessing at intent from
  prose, which is the semantic-vs-shape line CLAUDE.md draws (94.11).
- **Is that ratio a PROBLEM? No — the owner was shown it and decided otherwise
  (2026-08-28)**, choosing to keep the routine running hourly. Do not re-triage
  it and do not slow the routine on your own judgement.

```
npm view @busy-office/create-ui version     # 0.1.0   (asked 2026-08-29)
npm view @busy-office/ui version            # 0.5.0   (asked 2026-08-29)
node packages/core/scripts/check-publishable.mjs packages/core packages/create-ui
  # exits 1 today: both versions are already on the registry. That is the gate
  # working, not a fault — a release needs a bump first.

# fb15cdc is the commit carrying the owner's decision. UNSHALLOW FIRST
# (ENVIRONMENT.md trap 2) or these resolve nothing and the rate is silently
# missing, not wrong.
```

**A release now has a user-visible reason to happen, which it did not last
wake.** 201.1 and 201.2 are `Fixed` entries in the CHANGELOG's `Unreleased`
block describing two defects live in **0.5.0** — one of them a shipped component
whose primary visual feedback painted nothing. That is a fact for the owner to
weigh, not a decision this loop takes: publishing remains owner-triggered.
