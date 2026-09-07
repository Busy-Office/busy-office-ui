# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 12:58 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (7 open)
  - 249.6 — "Choose your path" router, corrected from the proposal's own undercount.
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
  - 249.9 — Visual component catalogue.
  - 249.10 — SAP/Fiori terminology column for 249.7.
  - 249.11 — "Migrate an existing admin UI" path.
  - 249.12 — Archival trigger for `ROADMAP.md`.
  - 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- **Slice 273** (1 open)
  - 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- **Slice 294** (1 open)
  - 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- **Slice 296** (1 open)
  - 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- **Slice 297** (1 open)
  - 297.1 — The first real intake run is the test of this, not the config.
- **Slice 310** (1 open)
  - 310.2 — `/base/motion` declares five copyable markup samples the template never renders.
- **Slice 315** (1 open)
  - 315.3 — should `check:selftests` EXECUTE each self-test rather than grep for the branch? Filed with its base rate, deliberately not built inside a grill.
- **Slice 316** (1 open)
  - 316.1 — should a gate forbid a theme token in a `@media print` colour declaration?
- **Slice 319** (1 open)
  - 319.3 — should a docs page be allowed to assert a target size at all without a gate that can see it?
- **Slice 320** (2 open)
  - 320.2 — judge each declaration separately, so a dead one cannot hide behind a live sibling.
  - 320.3 — the same idiom, two values, in two shared components.
- **Slice 322** (1 open)
  - 322.3 — should a phrase-count over `ROADMAP.md` / `ROADMAP-archive.md` be taken whitespace-normalised by default?
- **Slice 323** (1 open)
  - 323.1 — the script's existing base-rate command, the one quoted above `metric_samples`, is an as-of-DATE replay and is now known to be blind to states that live less than a day.
- **Slice 324** (2 open)
  - 324.1 — a sample records no DIRECTION, so even a fresh, well-paired metric cannot yield a verdict.
  - 324.2 — `bundle-gz-kb` is the only metric rule 5 can act on, its generator exists, and its noise floor is wider than three of its four historical moves.
- **Slice 325** (2 open)
  - 325.1 — a docs page can name an `npm run` command and nothing checks the command exists.
  - 325.2 — `measure:stress`'s render columns have no counterpart in the published table, and the published table's method is unrecoverable.
- **Slice 326** (1 open)
  - 326.3 — the dispatch region has grown +1,101 words in two days with no narrative left in it to cut. What is the answer when the region a wake must read grows because the RULES grew?
- **Slice 327** (1 open)
  - 327.3 — the one instrument gap this grill could not close: nothing distinguishes a claim that was MEASURED from one that was read off the code, inside a slice whose other claims were measured.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1599 iterations logged)
  Standardize   1 / 4 Continue round  since 2026-09-07 10:47   ok
  Objective     1 / 3 slice           since 2026-09-07 11:48   ok  [310]
  Optimize      1 wake-date(s) newer   since 2026-09-06 16:56   STALE   [newest pair: axe-violations; 132 sample(s), 7 of 44 name(s) paired across days]
  -> rule 5's newest comparable pair predates 1 wake-date(s) of loop activity. Any regression verdict quoted from it is about the tree as it was on 2026-09-06, not this one — record a metric or say the rule could not be evaluated.
     the unit is DISTINCT LOG DATES after 2026-09-06 (2026-09-07), not wakes: several wakes on one date add nothing, and one wake on a new date adds the whole step.
     rule 5's comparable set — 7 name(s) sampled on 2+ distinct days (37 of 44 name(s) have only one day and are not an input to a rule that compares two runs):
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
       claims                      3d  2026-08-19 82 count -> 2026-09-06 169 count  +87
       bundle-gz-kb                5d  2026-08-17 11.7 kB -> 2026-09-03 15.1 kB  +3.4
       gates                       2d  2026-08-18 19 count -> 2026-08-19 27 count  +8
       ci-gates                    2d  2026-08-17 14 gates -> 2026-08-18 15 gates  +1
       components                  3d  2026-08-15 25 count -> 2026-08-16 30 count  +5
       behaviors_frozen            2d  2026-08-15 16 count -> 2026-08-16 18 count  +2
     no direction is recorded with a sample, so the movement above is a reading and the regression verdict is the wake's. A name that has NEVER MOVED is either healthy or pinned by a gate — rule 5 cannot fire on it either way (`axe-violations` is 0 on every day because `test:axe` fails the build above 0).
```

## Owner-blocked

Open items whose text mentions "owner" — needs an owner decision, trigger, or hardware a wake cannot supply on its own.

- 296.3 — OWNER CALL: is "secure" in scope for this framework at all?
- 294.2 — rank the six proposals against the Objective; adopt none on arrival.
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-07 09:54 · Continue · build · 309.5 — commit the /stress re-measurement probe with its own control, and correct its style-flush column, which shipped as a dead detector reading ~0 across a 20-fold input range · landed · 82dc60e6
- 2026-09-07 09:54 · Meta · refusal · a gate over npm-run commands cited in docs pages — base rate is 4 occurrences on 2 pages, 4 of 4 valid; filed as 325.1 rather than built unasked · refused · 82dc60e6
- 2026-09-07 10:47 · Standardize · sweep · 326.1 — lane 3's 'Verdicts to date' list was stale 12h after it was written (178.3 added the 16th verdict the same day); fixed as an enumeration + amend-in-same-commit obligation, with the grep alternative red-proved dead via negative controls · landed · e1f5a12f
- 2026-09-07 10:47 · Meta · refusal · replacing the verdict list with a per-path grep — 6 of 7 unverdicted control pages hit, so the detector cannot discriminate (94.11: no gate on a semantic property) · refused · e1f5a12f
- 2026-09-07 10:47 · Meta · refusal · cutting the LOOPS.md dispatch region — 308.1's per-section attribution shows the cut section did not regrow and all four risers are rules that changed; filed as 326.3 instead · refused · e1f5a12f
- 2026-09-07 11:48 · Objective · grill · Objective grill of Slices 309, 323, 326 (Slice 327): 74 of 75 assertions reproduce; 309's three-route init claim false for 2 of 3, 326.1's negative control self-destroying · landed · ac0fc752
- 2026-09-07 11:48 · Meta · refusal · a new CLAUDE.md section for the self-destroying-control shape — the file already carries its mirror image and 326.3 is open on prose growth; a pinned revision plus one sentence in the lane that uses it is smaller · refused · ac0fc752
- 2026-09-07 11:48 · Meta · refusal · a gate over 'this claim names its instrument' (327.3) — semantic, 94.11's rule, and the checkable shape would be true of nearly every slice · refused · ac0fc752
- 2026-09-07 12:58 · Continue · build · 310.1 — deprecated glyphs in the two reference apps: 3 sites replaced onto the suite's own Refresh convention, 3 kept with the reason at the code · landed · 0879ec3d
- 2026-09-07 12:58 · Meta · refusal · a gate over examples/** for deprecated glyphs — post-change the exemption map would be the population (94.11 base rate); reopen condition recorded in the gate header · refused · 0879ec3d

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
