# Red-proving the DSA rubric (roadmap 94.4)

2026-08-21. Dispatched by the Roadmap loop as **Continue, build mode** — rules
1-3 did not fire (no P0, Standardize 1/4, Objective 0/3), and the oldest
dispatchable open item is **37.2** (score every component in batches), whose
executable plan is Slice 94.

Run *before* batch 3, not after, because two places in `ROADMAP.md` say so:
94.4's own Accept ("before scoring the remaining 23") and 37.2's warning that
"correcting the rubric after 55 rows are scored means scoring them twice."

## The question

Can the rubric tell a weak component from a strong one *at all*? After 94.2,
12 of 14 scored components read 100% and the trigger clauses had never fired
across the whole population. That is the shape this project treats as a defect
until proven otherwise — a detector that has never gone red.

## The test, and its result

Score the deprecated `.bo-date` — independently reviewed at 1 of 12 on the older
surface rubric, the lowest in the framework — and check it ranks below `money`.

| | `date` | `money` |
|---|---|---|
| Total | **83% (15/18)** | **100% (21/21)** |
| Fit | **0 / 3** | 3 / 3 |

**It discriminates.** And the interesting half is *which clause caught it*:

- Clause 1 (total < 80%) — **does not fire.** 83% is above the threshold.
- Clause 2 (any dimension ≤ 1) — **fires**, on `Fit: 0`.

A single-clause trigger would have missed this component. Slice 94 wrote clause
2 for almost exactly this case: "a component can score 85% while carrying
`Fit: 1` … and that IS the 'wrong presentation to the user' defect, hidden by an
average." The predicted case occurred, at 83%.

## What nearly went wrong

The first draft scored `date` **2 on typography and 2 on colour** — it has no
density awareness and ships no forced-colors rule, where siblings do.

Checked that against the components already scored, before committing to it:

| | forced-colors blocks | `--bo-density` refs | scored typography / colour |
|---|---|---|---|
| `money` | 0 | 0 | 3 / 3 |
| `amount` | 0 | 0 | 3 / 3 |
| `date` | 0 | 0 | (proposed 2 / 2) |

`money` and `amount` have the identical gaps and were scored 3. Marking `date`
down for them would have been **manufacturing the discrimination the test was
looking for** — the instrument returning what the tester expected. Scored on the
standard actually in use, `Fit` alone carries the verdict, which is the stronger
result: one dimension, unambiguous, and the trigger still fires.

Also caught, and worth naming because it is the second time in two wakes:
`grep -c forced-colors date.css` returns **1**, matching the deprecation comment
that *says there is no forced-colors rule*. Same comment trap as three of the
94.2 citations. Structural check, never a substring.

## Conclusion — 94.4's premise was wrong

"12 of 14 read 100%" is not a blind rubric. It is a **uniformly mature scored
population**: every one of the 14 is a long-grilled component. The instrument
works; the sample was easy. Batches 3-7 are unblocked and worth running as
planned, no sharpening needed, and the published percentage stays.

Recorded plainly because the loop queued 94.4 last wake asserting the opposite.

## Found while wiring the page — queued as 94.5

`DsaScore.astro`'s "not yet scored" branch **has never rendered on any page.**
Measured: 40 component pages, exactly 14 render `DsaScore`, and those 14 are
precisely the 14 that are scored — the component is added to a page at the
moment it gets scored. 93.1 recorded the else-branch as a deliberate judgment
call ("absence should read as 'not done yet', not as an omission"); 26 pages
show nothing at all. Nothing user-facing is false, but the recorded intent is
not realised and it is a branch that cannot fire.

## Verification

Live, on a **bind-mounted container over the fresh `dist`** — the running
`bo-docs-run` was serving stale content (no mounts, baked image), which is the
trap CLAUDE.md warns about; it was verified stale by curl and bypassed rather
than trusted.

- **Both themes**: 83% and `Fit 0 / 3` render legibly. Dark confirmed by
  computed `background-color` (`rgb(249,250,251)` → `rgb(15,17,21)`) and
  `data-theme="dark"`, not by the toggle appearing to work.
- **390px**: `resize_window` did not propagate to the viewport — stuck at
  1280×656 across two attempts, the limitation logged in Slices 70.1 and 71.1.
  So the narrow case was **measured, not screenshotted**: constraining the
  section to 390px gives no page-level horizontal overflow, the table reflows
  inside its own `overflow-x: auto` container, and `--bo-density-row-height`
  resolves to `1.875rem` — explicit `compact` beating auto-compaction, a live
  confirmation of 94.3's analysis from the opposite direction.

Green: full docs build (page-shape 39+19, link check 8712, markup, learning-path,
components-used, self-test 28 gates).

**Stated plainly: 1440px was not verified at 1440px.** The viewport would not
leave 1280, so what was checked is 1280 and a measured 390. The section is a
text table in the normal content column with no width-dependent rule of its own,
so the risk of a 1440-only failure is low — but it was not observed.
