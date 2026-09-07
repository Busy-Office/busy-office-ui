# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 13:16 UTC

## Open items by slice

- **Slice 112** (2 open)
  - 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
  - 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- **Slice 249** (5 open)
  - 249.7 — Terminology table, re-scoped after its own worked example failed verification.
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
- **Slice 328** (1 open)
  - 328.1 — The `Demo`-component detector has now produced a wrong count twice, a month apart, and nothing stops a third.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1605 iterations logged)
  Standardize   3 / 4 Continue rounds since 2026-09-07 10:47   ok
  Objective     3 / 3 slices          since 2026-09-07 11:48   OVERDUE  [310, 328, 329]
  -> a counter is at or past its threshold; the dispatcher should pick it
  Optimize      0 wake-date(s) newer   since 2026-09-07 12:59   ok   [newest pair: claims; 133 sample(s), 7 of 44 name(s) paired across days]
     rule 5's comparable set — 7 name(s) sampled on 2+ distinct days (37 of 44 name(s) have only one day and are not an input to a rule that compares two runs):
       claims                      4d  2026-09-06 169 count -> 2026-09-07 170 count  +1
       axe-violations              8d  2026-09-03 0 count -> 2026-09-06 0 count  +0   NEVER MOVED
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

- 2026-09-07 11:48 · Meta · refusal · a new CLAUDE.md section for the self-destroying-control shape — the file already carries its mirror image and 326.3 is open on prose growth; a pinned revision plus one sentence in the lane that uses it is smaller · refused · ac0fc752
- 2026-09-07 11:48 · Meta · refusal · a gate over 'this claim names its instrument' (327.3) — semantic, 94.11's rule, and the checkable shape would be true of nearly every slice · refused · ac0fc752
- 2026-09-07 12:58 · Continue · build · 310.1 — deprecated glyphs in the two reference apps: 3 sites replaced onto the suite's own Refresh convention, 3 kept with the reason at the code · landed · 0879ec3d
- 2026-09-07 12:58 · Meta · refusal · a gate over examples/** for deprecated glyphs — post-change the exemption map would be the population (94.11 base rate); reopen condition recorded in the gate header · refused · 0879ec3d
- 2026-09-07 21:01 · Continue · build · Slice 328 / closes 249.6 — shipped the six-row adoption-scenario router on index.astro (3+3 at 1440, 1 col at 390, all hrefs resolve). Its premise was FALSE: the three 'no rendered result' rows render 103, 11 and 8 live framework elements inside their demo sections, more than the page that passed (14) — the detector counted the Demo COMPONENT, which is CLAUDE.md's own recorded 1-of-18-vs-16-of-18 error repeating. The Accept's gate is refused on base rate: the honest predicate reads 30 of 30, uniformly true · landed · 9a4be080
- 2026-09-07 21:01 · Meta · refusal · the check-learning-path arm the Accept asked for — the honest predicate is 30/30 uniformly true, and the anchored 17/31 alternative discriminates on WHICH mechanism a page uses to show a result rather than whether it shows one · refused · 9a4be080
- 2026-09-07 21:01 · Meta · refusal · cutting three of the six rows, or padding those pages with a bare pattern link — nothing was missing, and padding would be fitting the page to the gate · refused · 9a4be080
- 2026-09-07 21:16 · Continue · build · Slice 329 / closes 249.9 — the component catalogue at /components/: 42 cards, 8 groups, every field generated (tagline+category from api.json meta, JS status from behaviors.json byComponent, floor from floor.json perComponent, DSA from dsa-scores.json). Caught a defect in my own code before shipping: 2 of 6 'no tagline' cards were real components whose page slug differs from their CSS dir (alerts->alert, state-patterns->state) — CLAUDE.md's named trap; inverted api.json's pageSlug map rather than special-casing, 6 -> 0. Edited check-page-shape to stop treating a section front door as a component, red-proved with an orphan probe · landed · 623c98d9
- 2026-09-07 21:16 · Meta · refusal · the build-time miniature 249.9 specified — measured 40s and 1.1MB for 40 components, ~12x the whole framework's minified size, to show a still picture of a demo that is live one click away; that is re-photographing, which the pattern recipe already refuses · refused · 623c98d9
- 2026-09-07 21:16 · Meta · refusal · dispatching 249.7 as the oldest open item — its first Accept clause is already executed and its own text says settling the rest before the owner answers 249.10 would decide it on the thinnest input; reported as owner-blocked per rule 4 · refused · 623c98d9

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
