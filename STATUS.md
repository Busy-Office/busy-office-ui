# STATUS

Generated — do not hand-edit. Regenerate with `python3 scripts/loops/generate_status.py` (also runs automatically after `record_iteration.py`). Source of truth for every number here is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md).

Generated at: 2026-09-07 14:01 UTC

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
- **Slice 330** (1 open)
  - 330.1 — Sampling is now a named failure mode here, twice.
- **Slice 331** (1 open)
  - 331.1 — `install-prompts.md`, generated from `api.json`.
- **Slice —** (1 open)
  - AT runtime evidence

## Dispatch counters

```
dispatch status — counter-triggered rules (1614 iterations logged)
  Standardize   4 / 4 Continue rounds since 2026-09-07 10:47   OVERDUE
  Objective     0 / 3 slices          since 2026-09-07 14:01   ok
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
- 273.2 — §3b step 5 mandates `dry++` on a round whose score does not move, and no round has ever done it. OWNER CALL.
- 249.10 — SAP/Fiori terminology column for 249.7.
- 249.11 — "Migrate an existing admin UI" path.
- 249.13 — Reconsider demo-first/spec-last (the proposal's B1), explicitly, not as a ratification.
- 112.3 — the pattern-fit pilot. BLOCKED ON OWNER BRIEFS + FOUR ANSWERS (grilled 2026-08-29 at the owner's request; full report `.roundtable/grill-112.3-pilot-still-worth-it-2026-08-29.md`).
- 112.4 — Screen Contract layer. BLOCKED ON 112.3's verdict.
- AT runtime evidence

## Last 10 iterations

- 2026-09-07 21:16 · Meta · refusal · dispatching 249.7 as the oldest open item — its first Accept clause is already executed and its own text says settling the rest before the owner answers 249.10 would decide it on the thinnest input; reported as owner-blocked per rule 4 · refused · 623c98d9
- 2026-09-07 21:41 · Objective · grill · Slice 330 — grill of 310, 328, 329: 23 of 25 reproduce. The one that matters is mine: 329's miniature cost (29kB/PNG, ~1.1MB for 40) was extrapolated from five components and does not reproduce — an independent five-sample read 49kB/1.91MB, and a census over all 39 reads 0.89MB with a 2.2-60.7kB spread. Two samples landed either side of the truth. The refusal survives (0.89MB is ~10x the framework) but the wrong figure was written into the shipped page header. Corrected there and in the slice, with the command shape added · logged · 8ef9b944
- 2026-09-07 21:41 · Meta · refusal · a gate over 'a published figure carries the command that produces it' — semantic predicate, 94.11's wall for the seventh time; the fix that works is putting the command next to the claim · refused · 8ef9b944
- 2026-09-07 21:41 · Meta · refusal · re-filing 329's 8-vs-7 group count as a defect — wording only, the conclusion never depended on it · refused · 8ef9b944
- 2026-09-07 21:49 · Continue · build · Slice 331 / closes 294.2 — fixed the input block instead of reporting it a twelfth time: landed the owner-supplied contribution on branch contribution/upstream-2026-09-06 (31 files, secret-scanned, NOT on main, nothing adopted) so every verdict cites a readable path — 321.1's defect fixed as a class. All six proposals ranked: brand mark OWNER CALL; registry refused / install-prompts adopt-with-changes (must be generated, filed 331.1); gauntlet already adopted Slice 296; static consumer REFUSED because erp-suite already ships a file-openable static dist; modern CSS split (probes landed 311, OKLCH blocked by its own PR.md gate, surface.css withdrawn by its author); proposals refused as product · landed · 19fc0045
- 2026-09-07 21:49 · Meta · refusal · the shadcn registry.json — publishing into that ecosystem advertises this framework to consumers expecting React components; Slice 296's refusal stands · refused · 19fc0045
- 2026-09-07 21:49 · Meta · refusal · examples/static-list-report — erp-suite already ships a static dist openable with file:// and has no server at all, so a second consumer is coverage duplication carrying a hand-transcribed copy of three shipped behaviours · refused · 19fc0045
- 2026-09-07 14:01 · Objective · grill · Slice 330 amended — grill of 310/328/329 lost the collision; the 17-of-31 corpus finding survives, the census and group-count errors are recorded · logged · 534b097a
- 2026-09-07 14:01 · Meta · refusal · re-proposing a gate over 'a published figure carries its command' — the landed Slice 330 already refuses it on the semantic wall · refused · 534b097a
- 2026-09-07 14:01 · Meta · refusal · keeping this wake's duplicate grill report in .roundtable/ — a second report of the same three slices is the repeated-subject shape INDEX.md measures · refused · 534b097a

## Sunset test

This file exists so the owner can get the ten-second "now" view without asking for a chat summary. **If, in practice, the owner keeps asking for or reading chat summaries instead of this file, delete STATUS.md and its generator** — that is proof it is ceremony, not a read habit, and the wake budget belongs elsewhere. Nothing else depends on this file: ROADMAP.md and loop-log.md remain the source of truth with or without it.
