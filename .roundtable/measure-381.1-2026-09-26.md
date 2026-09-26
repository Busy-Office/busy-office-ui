# 381.1 — the correction-site check: precision against a stated floor (2026-09-26)

Roadmap 381.1 asked for a precision floor stated before measuring, then a
re-tune measured on the same windows, or unwiring if it stays below the floor.
The floor was committed first (`59daa442`): **≥ 10% of printed site lines on
the 150-commit window, with recall not below today's.** This file carries the
commands, the judged lines and the numbers. Everything re-runs from the
repository root; the scripts are in `measure-381.1-2026-09-26/`.

## 1. The window, re-run first

`python3 .roundtable/measure-381.1-2026-09-26/window.py <script> f8856986^ 150 out.json`
runs a version of the check over the 150 `ROADMAP.md` commits before
`f8856986` (`fc79ea85..2fad3cc7`). It counts reports (exit 1) and printed
`L<n>:` site lines. An exit other than 0 or 1 is printed as `ERR` and not
counted.

| version | reports | printed site lines |
|---|---|---|
| the check as 346.1 shipped it (`git show f8856986:scripts/loops/check_correction_sites.py`) | 36 | 234 |
| the check at `3748d89a` (Slice 381's fixes) | 36 | 234 |
| re-tuned (this item) | 25 | 84 |

The premise reproduces exactly. A copy of the script outside `scripts/loops`
fails on every commit, because it locates its repository from its own path;
run the in-repo file or a `git show` copy placed in the repository.

## 2. What the re-tune changed, each measured on the window

1. **A small number is listed only where the same UNIT follows it.** The unit
   is the content words in the three tokens after the number, before any
   punctuation. It replaced "shares one content word with the correction in a
   ±3-word window", which printed 225 of the 234 lines. The unit is cut at
   punctuation; before that, "7, against a control" counted `against control`.
2. **A small number with no unit lists nothing** (count only). The old rule
   was the fallback, and it printed 67 of 151 lines. It listed none of the
   known sites.
3. **A sign is not a new figure:** `5` → `+5` superseded nothing. That was 14
   lines in one commit.
4. **"M …, not N" takes the unit from the clause ending at THIS N.** The first
   match in the window could be the clause before. The self-test caught it.
5. Two defects found while measuring, both now fixed and in the self-test:
   - **A crash exited 1, which means "listed something".** A re-tune's
     unpacking error printed 30 reports of 0 lines, and `record_iteration.py`
     would have shown it as a report. Any uncaught exception now exits 2,
     "could not run".
   - **`--old` matched its phrase against the 180-character display
     window.** A number within 90 characters of the phrase was listed even
     when the phrase did not contain it. The phrase must now span the hit.

Measured and **not adopted**, both named by the Accept:
- **Suppressing the correcting section.** 2 of the 4 real lines (both
  `11503760` sites, the heading and the body of Slice 301) sit in the corrected
  slice's own section, so this would halve recall. Suppressing only the
  correction's own item removes at most the 11 lines the judge called the
  corrected text itself, "annotated in place", or "kept verbatim under the
  correction". That is 4 of 73, 5.5%, still under the floor.
- **Searching `ROADMAP-archive.md` as well.** It adds **132 printed lines** on
  the same window, across 27 commits. Their precision is **not measured**.
  The 18 known sites cannot say what it would find: the 346.1 audit read
  `ROADMAP.md` only, so they are all `ROADMAP.md` lines by construction.

## 3. Precision — 4 of 84 (4.8%), judged blind

The 84 printed lines were written to a sheet: each hit with ~3 lines of
context and its section heading, under its commit's message and its removed
and added lines. A separate agent, which had not seen the known-site table or
any count, judged each line REAL or FALSE:
- **REAL:** it restates the superseded value of the same claim, left
  standing.
- **FALSE:** a quotation, a figure true at its own slice, a different claim,
  or the correction's own text.

The verdicts are `measure-381.1-2026-09-26/verdicts.json` (commit, line,
number, verdict, one-line reason).

- **REAL: 4.** `11503760` L612 (4,676), `11503760` L536 (7.2%), `5ce62916`
  L5428 (four), `ccb7d3ce` L812 (five). **These are exactly the four known
  sites in the window that the check lists.** The judge had not seen that
  set, so this reconciles two independent readings.
- **FALSE: 80; UNSURE: 0.** Most are the same number counting the same kind
  of thing in a different claim: "two instruments", "15 pages", "21 rows".
  11 are the corrected text itself or sit in the correcting item (H1, 2, 22,
  39, 41, 42, 53, 68, 82, 83, 84, by the judge's reasons).
- The wake spot-read the FALSE verdicts on three blocks (`ac4a9a0f`,
  `2c1de813`, `89455547`: H7-H10, H67, H84) and agreed with each.

**4.8% is under the 10% floor, so the check is unwired from
`record_iteration.py`,** as the rule stated beforehand says. The script stays
as the deliberate tool that LOOPS.md's operating rule describes: `--worktree
--old` before a correcting commit.

What this precision does NOT cover:
- It is one 150-commit window.
- Its denominator is printed lines. With a cap of 8 per number, 6 listed
  hits went unprinted (90 listed, 84 printed); they were not judged.
- The judge is one reader. Its REAL set matching the audit's is the check on
  it; a second full judgement was not run.

## 4. Recall — not below today's

`python3 .roundtable/measure-381.1-2026-09-26/replay.py <script> [--old]`
runs the check at each of the 18 known sites' commits
(`measure-346.1-2026-09-24.md` §3), plus the two out-of-sample misses. It says
whether each site's line is printed.

| | before (`3748d89a`) | re-tuned |
|---|---|---|
| diff alone, 18 known sites | 12 | 12 (the same 12) |
| with `--old`, 18 known sites | 17 | 17 |
| out of sample (`534c4593` L1110, `411a6663` L592) | 0 of 2 | 1 of 2 (`411a6663` L592, now inside the cap) |
| the 7 known sites inside the window | 4 | 4 |

## 5. The self-test — 10 cases, 20 of 20 mutations killed

Before, it had 2 cases, and the grill found 12 of 19 mutations surviving. Now
it has one case per path:
- replaced number;
- strike-masking bounds;
- struck-copy exclusion;
- the small-number unit, through a wrap;
- annotation "M, not N";
- word↔digit;
- quoted;
- commit message;
- newly struck;
- sign;
- no unit;
- unit cut at punctuation;
- singular/plural;
- `--old`, with its phrase spanning the hit;
- exits 0, 1 and 2, including a crash.

`python3 .roundtable/measure-381.1-2026-09-26/mutate.py` applies 20 one-line
mutations, one per path. Each is asserted to match exactly once. It writes
each mutant to an untracked copy beside the check (`_mutant_*.py`, removed
in a `finally`) and runs that copy's `--self-test`. The tracked file is only
read, so an interrupted run cannot leave it mutated; the verifier's MEDIUM
finding was that the first version rewrote it in place. **All 20 are killed.** The first run killed 16. The 4
survivors got cases, or a unique injection (a mutation that matched twice was
never applied, and is reported as such rather than as killed).
