# LOOPS archive — incident narratives, moved verbatim

Moved from `LOOPS.md` by roadmap item 167.2 (2026-08-28). Same doctrine as
`ROADMAP-archive.md`: still markdown, still reviewed, still diffed — this is
a split, not a database.

**What belongs here.** History a wake needs when it TOUCHES a mechanism, not
when it READS the rule. `LOOPS.md` keeps every rule's decision content — the
threshold, why it sits where it does, and the standing lesson — readable
without following a link. What moves is the incident narrative behind it.

**What does NOT belong here.** A lesson that changes what the next wake
does. `LOOPS.md`'s own note on rule 3 says why: a pointer is read less than
a paragraph, so the behaviour-changing sentence stays inline and only the
archaeology moves.

---

## Dispatcher rule 3 — the Objective counter's five blind spots

Cited from `LOOPS.md` rule 3. Five recurrences of one shape: a parser that
silently matched nothing while printing a confident number.

   **THE COUNTER WAS BLIND FOR FIVE DAYS, and this is the third recurrence.**
   `dispatch_status.py` parsed slice numbers with `^(\d{2})\.` — exactly two
   digits. The day slice numbers passed 99 (2026-08-21) it read "14" out of
   "145.3", wanted a dot, found "5", and matched nothing. Objective then
   reported **0 slices while 70 Continue rounds and ~17 slices went past it**,
   flagged "ok" the whole time. Found 2026-08-26, not by the rule failing but by
   a human noticing the number looked wrong.

   Two fixes, and the second is the important one. The regex now takes any slice
   number. And a **zero is now treated as a defect**: if Continue rounds have
   happened since the last Objective and not one of them names a slice, that is
   a parse failure and the script exits rather than printing "ok". This file has
   now recorded the same shape of bug three times about Objective specifically,
   which is enough to stop trusting careful wording and make the silence
   impossible instead.

   **And the bigger half was not the loop filter at all — it was a FOURTH
   instance of the regex going quietly blind.** The log uses THREE conventions
   — `164.1 …`, `Slice 84: …`, and a bare top-level `166 — …` / `119: …` — and
   at this point the counter could see only the first:

   ```
   # 996 rows: 302 bare · 141 prose · 553 naming no slice
   # distinct slices seen — bare 99 · prose 60 · union 144, of 146 in ROADMAP.md
   python3 scripts/loops/dispatch_status.py --self-test
   ```

   Replayed over the whole log, the count crosses 3 **18** times as the rule
   stood, **22** with the prose form alone, **23** with Standardize as well — so
   the format bug was four times the size of the question the item asked. Of the
   45 Objective rounds that actually ran, the number where the counter was
   already past 3 goes **6 → 15**: the rule was firing late more often than
   anyone knew. It is not trigger-happy either — 23 crossings against 45 real
   Objective rounds still signals about half as often as the loop ran, which is
   the direction this rule worries about. `slice_of` now ships `--self-test`,
   red-proved both ways (disable the prose branch → 3 cases fail; restore the
   two-digit regex → 3 different cases fail).

   **A FIFTH instance, found the next wake (roadmap 166.5).** The third
   convention above — a bare top-level number, `166 — …` or `119: …` — was
   still invisible, and what exposed it was the Standardize wake's own row:
   `dispatch_status.py` read `Objective 1 / 3 [161]` immediately after
   recording an iteration that named Slice 166. **The number disagreed with
   what had just been written**, which is the only thing that ever catches
   this. 21 rows and 6 distinct slices were being missed; rows naming a slice
   went 444 → 465, distinct slices 144 → 150, and the live counter moved to
   `2 / 3 [161, 166]`.

   **The widening's first draft invented slices**, which is the part to carry
   forward. A loose `^(\d+)\s*[—–:-]` reads **`4-tick sweep: …`** and
   **`4-seat adversarial grill …`** as slice 4 — 18 such rows exist, all of
   them Standardize and Objective rows, so it would have made this counter
   fire EARLY. A parser change that reports more is not self-evidently a fix.
   The shipped rule lets a colon sit flush and requires a dash to be
   surrounded by whitespace; `--self-test` now carries a case for each
   convention and for both traps, and fails when the fix is reverted (2 cases)
   and when the separator is loosened (2 different cases).

   **The 61-vs-23 is settled, and the figures above are a SNAPSHOT.** 166.5
   refused to quote its replay harness's 61 against this section's 23, on the
   grounds that 23 was "published, red-proved" — which `--self-test` is not: it
   proves `slice_of`'s classification, not the crossing replay, and no command
   was ever recorded for 18/22/23. A third, independent replay (Objective
   grill, 2026-08-28) reproduces all five published figures exactly at the 996
   rows they were taken on — 18 · 22 · 23 · 23, and 6 → 15 — so **the harness
   was wrong and 166.5's verdict holds**. It also shows the cost of the missing
   command: ten rows later the `+ Standardize` figure is **24**. Re-run, do not
   quote; the command is in
   `.roundtable/grill-objective-161-162-166-2026-08-28.md`.
