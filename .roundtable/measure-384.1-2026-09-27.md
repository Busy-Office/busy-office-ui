# 384.1 — how much of the dispatch region's growth is measurement narrative (2026-09-27)

Roadmap 384.1 asked:
1. Measure how much of the dispatch region's growth since `4e6b83c1` is
   measurement narrative, and how much is instruction.
2. Then decide between two fixes, with the reason:
   - a high-water anchor in `report_loop_prose.py`;
   - a charter line: replay figures go to measure files, and the rules carry
     the pointer.

Refusing both on the measurement was a satisfying outcome.

## 1. The premise, re-derived

At filing (Slice 384, 2026-09-24), the region had grown from 7,484 words
(`4e6b83c1`) to 7,824. Then `330051e0` trimmed 101 words. That trim became
the new anchor of the per-section block, so 340 − 101 = **239** words of
growth fell out of the next sweep's attribution. The premise holds.

**"Both anchors" is half true.** The ratchet has had a floor since 376.7:
`is_real_cut`, at least 100 words and 1% of the file. The region anchor
(`last_region_cut` → `is_cut`) has none. Every region shrink on record
(`report_loop_prose.region_words_at` on each LOOPS.md commit):

| commit | day | region | `is_cut` | passes the ratchet's floor |
|---|---|---|---|---|
| `ec482111` | 09-26 | 10,399 → 10,374 (−25) | yes | no |
| `daea445f` | 09-26 | 10,625 → 10,374 (−251) | yes | yes |
| `330051e0` | 09-24 | 7,824 → 7,723 (−101) | yes | yes |
| `741c9bea` | 09-24 | 7,643 → 7,521 (−122) | no (relocation) | yes |
| `4e6b83c1` | 09-09 | 7,552 → 7,484 (−68) | yes | no |
| `f9e0f17d` | 09-07 | 7,532 → 7,354 (−178) | yes | yes |
| `8848ed55` | 09-05 | 6,100 → 5,658 (−442) | yes | yes |
| `9198e43f` | 08-29 | 6,032 → 5,772 (−260) | yes | yes |
| `3006da0a` | 08-28 | 4,044 → 3,398 (−646) | yes | yes |

Slice 410's own trim (`ec482111`, −25) is the newest anchor. The cut before
it was `daea445f` (−251) on the same day, so that trim hid only the 25 words
it removed.

## 2. The measurement

`python3 .roundtable/measure-384.1-2026-09-27/extract.py 4e6b83c1 5a40dc2e
out.json` lists the dispatch-region paragraphs added or changed since the
anchor. Each is matched by difflib against its closest old paragraph, to
count how many of its words are new. The result: **44 paragraphs, 4,698
words, 3,130 of them new.**

The region grew from 7,484 to 10,374 words (+2,890 net), over 37 LOOPS.md
commits.

Two blind labellers labelled every sentence of the 44 paragraphs (workflow
`wf_0c9f4234-9f4`). One worked top-down and one bottom-up, neither consulted
Jev, and each saw only the paragraphs and this rubric:
- **INSTRUCTION:** what to do, a condition or threshold, a command, or a
  definition needed to decide.
- **NARRATIVE:** replay figures, counts, dates, shas, who found what, how a
  rule came to be, or corrected numbers. Its removal changes no action.

Per-paragraph word sums equal the paragraph's word count for both labellers
(0 mismatches). The labels are in `labels.json`, and the paragraph index in
`paragraphs.json`. The index carries ids, sections and counts, not the text;
`extract.py` regenerates the text from git.

| | narrative in the changed paragraphs | narrative among the 3,130 new words |
|---|---|---|
| labeller A | 1,128 of 4,698 (24.0%) | 420–495 (13.4%–15.8%) |
| labeller B | 1,026 of 4,698 (21.8%) | 360–442 (11.5%–14.1%) |

- **The new-word range:** its lower end spreads a paragraph's narrative evenly
  over its words; its upper end counts all of it as new.
- **Agreement:** 4 of 44 paragraphs differ by more than 10% of their words:
  the wake-prompt trigger list, Step 0's stamp history, Step 0c's collision
  history, and rule 3's replay figures.
- **Where the narrative is:** the heaviest narrative paragraphs are mostly
  **older than the anchor**. Step 0c's collision list has 350 words, of which
  80 are new; rule 4's LIFO history has 142, of which 2 are new.

**About 85% of the growth is instruction.** It is rule M, rule D and its lint,
the planner contract, the blocking-marker definitions, the in-flight exits and
the refused-milestone stop: the M1 milestone machinery.

## 3. Decision — both refused, on the number

- **Charter line: refused.** It would target 11.5%–15.8% of the growth. The
  step it would add already exists as the Standardize lane-4 third branch:
  "apply the charter on the incident". Slice 410 applied it the same day, and
  took 381.1's history sentence back out of Step 0. A second statement of the
  same rule is a restatement, which `LOOPS.md` refuses.
- **High-water anchor: refused.** An anchor that moves only on a "full" cut,
  one returning the region to its earlier level, never moves again: the growth
  is mostly new instruction, which no cut removes. So every cut since
  `3006da0a` would read as partial. The per-section block would then fold
  every new rule into the "did the previous cut hold" reading. Keeping those
  two apart is what 308.1 and 339.1's branches exist for.
- **The ratchet's floor on the region anchor: refused.** It would not have
  prevented the reset 384.1 names, because `330051e0` removed 101 words and
  passes the floor. It would skip only `4e6b83c1` (−68) and `ec482111` (−25).
- **What the number does say:** the dispatch region grew 39% in 18 days, and
  about 85% of that is instruction. That is a read-set question, not an
  anchor question. It is already the owner's (RESUME Direction #7; `393.13`
  re-measures on the first ACTIVE wake). No new item.

What this does not cover:
- It is one window (`4e6b83c1..5a40dc2e`).
- The labels come from two model labellers, not a human.
- The new-word attribution is difflib-based, so a paragraph that was moved and
  reworded counts as partly new.
