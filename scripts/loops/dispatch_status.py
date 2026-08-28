#!/usr/bin/env python3
"""Report how overdue each COUNTER-triggered dispatcher rule is.

Why this exists (roadmap 41.1). Three dispatcher rules have starved because a
rule that is *always true* — "build item queued" — sat above a rule that fires
on an accumulating count. A counter below an always-true condition is dead, and
the failure is silent: nothing is broken, a loop simply never runs. Each of the
three was found by hand, and the last one after **ten slices**.

The instances are fixed by re-ordering. The blind spot is not: nothing measures
it. This turns a periodic rediscovery into one line per rule, read from
`loop-log.md`, which already records every dispatch.

Deliberately NOT a gate. A stale counter is information for whoever is
dispatching, not a reason to fail a build — and a red build here would push the
wrong lever entirely (it would block the very work the loop exists to do).

    python3 scripts/loops/dispatch_status.py

The output is the product. Exit status is 0 on a clean read and NON-ZERO on a
parse failure — a counter that cannot see its own input must say so rather than
print a number, which is the whole reason this file exists.
"""
import re
import sys

from _common import LOG

ROW = re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ([\w-]+) · ([\w-]+) · (.*)$")
# `[\w-]`, not `\w`, and the hyphen is not hypothetical: NINE rows carry a
# hyphenated mode (`owner-decision`, `owner-wishlist`, all 2026-08-24) and every
# one of them is a **Continue** row — which is precisely what both counters
# below count. The parser read 982 of 991 bullets and said "ok".
#
# Measured before fixing, by replaying both parsers over all 703 revisions of
# loop-log.md: the row count differs on 79 of them, and the OVERDUE/ok verdict
# differs on exactly ONE (dc7ea4d, 2026-08-24: Standardize read 3/4 "ok" when it
# was 4/4). So the cost was one wake's flag, not a starved loop — the number is
# small and is written down rather than dramatised.
#
# The lesson is the SILENCE, not the count, which is why the reconciliation
# below matters more than this character class. A carried-forward note in
# RESUME.md called this "six legacy rows" for four wakes; it was nine at the
# commit that wrote it and has been nine ever since. A bare count with no
# command, which is the failure roadmap 159 wrote a rule against the day before.

# The raw thing to count in the source, per CLAUDE.md's mirror doctrine: every
# iteration is one "- " bullet. `rebuild_from_log.py` already reconciles against
# this and refuses to write when it under-parses; this script decided on the
# same file with no such check. Counting the raw thing is what makes the
# assertion independent of the regex above — a reconciliation that re-uses the
# parser it is checking cannot fail.
BULLET = "- "
# The slice a row worked on. THE LOG USES FOUR CONVENTIONS; this script parses
# three of them, and the fourth is refused deliberately (see MID_TEXT below).
# For most of its life it could see only the first.
#
#   bare   "164.1 the dispatcher's counter reconciles…"
#   prose  "Slice 84: wrote the eight missing CHANGELOG entries…"
#
# Anchored to the start on purpose, and kept as TWO patterns rather than one
# loosened pattern, because the looseness is exactly what goes wrong: a free-text
# scan for `NN.N` reads "10.3%" and "17 screens" as slice numbers, which is how
# the first version of this script reported 16 slices instead of 10. So the bare
# form REQUIRES the `.N` sub-item, and the prose form REQUIRES the literal word.
#
# ANY slice number, not two digits. `^(\d{2})\.` silently stopped matching the
# day slice numbers passed 99 (2026-08-21): it read "14" out of "145.3", wanted
# a dot, found "5", and returned no match. Objective then counted 0 slices for
# FIVE DAYS while 70 Continue rounds and ~17 slices went past it — a rule that
# could not fire, reporting "ok".
#
# LOOPS.md already records this failure shape twice, the second time about
# Objective specifically ("it starved for ten slices before this was noticed").
# The two-digit bug was the third. THE MISSING PROSE FORM IS THE FOURTH, and it
# was the biggest of them — measured over all 996 rows on 2026-08-28:
#
#   996 rows: 302 bare, 141 prose, 553 naming no slice
#   distinct slices seen — bare 99 · prose 60 · union 144, of the 146 in ROADMAP.md
#
# Reconciled against an independent source rather than against itself: the 45
# slices the prose form adds are all real, and the union lands 2 short of the
# roadmap's own heading count. The 50 parsed numbers with no `## Slice N`
# heading are slices 7-21, which predate that heading convention — not noise.
SLICE_BARE = re.compile(r"^([1-9]\d{0,2})\.\d+[a-z]?\b")
SLICE_PROSE = re.compile(r"^Slice ([1-9]\d{0,2})(?:\.\d+[a-z]?)?\b", re.IGNORECASE)
# A THIRD convention, and the FIFTH time this parser has been found blind
# (roadmap 166.5, 2026-08-28). A row may name a slice with no sub-item and no
# "Slice" prefix — `166 — Standardize sweep`, `119: pattern wishlist triaged`.
# SLICE_BARE requires `.N` and SLICE_PROSE requires the word, so both miss it.
# Found the same way the fourth was: by a Standardize row this script then
# refused to see, on the very wake that wrote it.
#
# The separator is what makes this safe, and the first draft got it wrong. A
# loose `\s*[—–:-]` also matches `4-tick sweep: …` and `4-seat adversarial
# grill …`, which are counts, not slice 4 — 18 such rows are in the log and a
# widening that swallowed them would invent slices. So: a colon may sit flush
# against the number, but a dash must be surrounded by whitespace.
#
# Measured over all 1,000 rows, reconciled three ways: the loose probe matches
# 39 rows the old parser missed, this one matches 21, and the 18 it rejects are
# every `N-tick`/`N-seat` row and nothing else (21 + 18 = 39, and each of the 18
# was read). Rows naming a slice 444 -> 465, distinct slices 144 -> 150, rows
# LOST by the widening: 0.
#
# NO CADENCE FIGURE IS QUOTED HERE, deliberately. A replay harness written for
# it read 61 crossings where this file's own header publishes 23 for the
# unchanged parser, so the harness — not the header — is wrong, and an
# unreconciled number does not go in a comment. What IS checked is the live
# effect: before this change `dispatch_status.py` read `Objective 1 / 3 [161]`
# with a Standardize row for 166 already in the log; after, `2 / 3 [161, 166]`.
SLICE_TOP = re.compile(r"^([1-9]\d{0,2})(?::|\s+[—–-])\s")

# A FOURTH convention exists and is REFUSED, on measurement (Objective grill of
# 161/162/166, 2026-08-28). Thirty Continue/Standardize rows name their slice
# MID-TEXT, after an em-dash, which all three start-anchored patterns above
# miss:
#
#   "Skeleton + state (empty/error) components — Slice 6 item 1 · shipped 0242384"
#   "Demo-section ordering audit (Slice 6 item 10) — sample-before-code convention"
#
# Eight distinct slices (3, 6, 7, 8, 14, 18, 22, 96) are invisible, and that is
# the right outcome. The convention is DEAD: 29 of the 30 rows are 2026-08-14 to
# 2026-08-16, the newest is 2026-08-21, and adding a `\bSlice (\d+)\b` fallback
# moves the whole-log crossing count 24 -> 25 — one crossing in the log's entire
# history, none in the last week. Against that, a non-anchored pattern re-opens
# exactly what 166.5's first draft did: a widening that reports MORE is not
# self-evidently a fix.
#
# This block exists so the SIXTH discovery of a missed convention is not
# reported as a new bug. LOOPS.md rule 3 concluded after the fifth recurrence
# that "the lesson is no longer widen the regex"; this is that sentence's first
# test, and it holds.
#
# Re-run before reopening — and note the plain grep UNDERCOUNTS, because two of
# the thirty use a parenthetical (`(Slice 6 item 10)`) rather than an em-dash:
#
#   grep -c ' — Slice [0-9]' .roundtable/loop-log.md            # 28, not 30
#   python3 -c "import re,sys; sys.path.insert(0,'scripts/loops'); \
#     from dispatch_status import slice_of, ROW, CLOSES_A_SLICE; \
#     rs=[m.groups() for m in map(lambda l: ROW.match(l.rstrip()), \
#         open('.roundtable/loop-log.md')) if m]; \
#     print(sum(1 for _,lp,_,it in rs if lp in CLOSES_A_SLICE \
#         and not slice_of(it) and re.search(r'\bSlice \d+', it)))"   # 30
#
# The population is Continue/Standardize rows only, because those are the only
# loops this counter reads; across ALL loops the same probe finds 79.
#
# Reopen only if rows in the CURRENT convention era start using it again.

# WHICH LOOPS CLOSE A SLICE (roadmap 161.4, decided 2026-08-28 by replaying the
# whole log, not by argument). Counts are per-loop rows that name a slice, and
# the parenthetical is how many slices that loop is the ONLY witness for:
#
#   Continue     · 252 rows — builds items. Uncontested.
#   Standardize  ·  31 rows (12 slices) — ADDED. Slices 47, 49, 50, 55, 60, 63,
#                            65, 69, 103, 111, 155 and 161 have a Standardize
#                            row and no Continue row at all; Slice 49's own
#                            heading is "Standardize sweep". Those are closed
#                            slices the counter could never see. The old comment
#                            was right about Roadmap and was never asked about
#                            this: 28% of Standardize's slice-naming rows.
#   Roadmap      ·  11 rows (4 slices) — EXCLUDED, reason unchanged: a triage row
#                            plans a slice, it does not close one. Slice 162 is
#                            the live illustration — Roadmap-only, and open.
#   Explore      ·   6 rows (5 slices) — EXCLUDED. A spike graduates INTO the
#                            plan; the build that follows is a Continue row.
#   Objective    ·   2 rows (1 slice)  — EXCLUDED, and it is also circular: an
#                            Objective row resets this very counter.
#   Meta/Polish/Optimize · 0 rows ever named a slice. Nothing to decide.
#
# (The separators above are not decoration. check:slice-refs reads the word
# "roadmap" followed by whitespace and a number as a citation, so an aligned
# column that put a row count straight after a loop named Roadmap turned the
# gate red on a slice that does not exist. The gate was right — the string was
# genuinely ambiguous — and the first attempt to explain that here failed the
# same way, by quoting the offending text verbatim. Hence the separator.)
#
# Explore and Objective were measured before being refused, because "obviously
# not" is how the Standardize exclusion survived unexamined. Adding both to the
# set below changes the number of times the counter reaches 3 over the whole log
# from 23 to 23 — they buy nothing, so they stay out.
#
# THE CADENCE THIS BUYS, replayed rather than predicted (the Accept criterion's
# own requirement). Times the count crossed 3 over all 996 rows:
#
#   Continue + bare only (before)   18
#   Continue, both forms            22      <- the format fix is most of it
#   + Standardize, both forms       23      <- decided
#   + Explore + Objective           23
#
# And of the 45 Objective rounds that actually ran, the number where the counter
# was ALREADY past 3 goes 6 -> 15: the corrected counter shows the rule was
# firing LATE more often than anyone knew. It is not trigger-happy either — 23
# crossings against 45 real Objective rounds means it still signals about half as
# often as the loop actually ran, which is the direction LOOPS.md worries about.
CLOSES_A_SLICE = ("Continue", "Standardize")

# name -> (threshold, what one unit is, how the rule counts)
RULES = {
    "Standardize": (4, "Continue round"),
    "Objective": (3, "slice"),
}


def slice_of(item):
    """The slice number a log item names, or None. All three conventions."""
    m = SLICE_BARE.match(item) or SLICE_PROSE.match(item) or SLICE_TOP.match(item)
    return m.group(1) if m else None


def rows():
    out = []
    bullets = 0
    with open(LOG, encoding="utf-8") as fh:
        for line in fh:
            if line.startswith(BULLET):
                bullets += 1
            m = ROW.match(line.rstrip("\n"))
            if m:
                out.append({"at": m.group(1), "loop": m.group(2), "item": m.group(4)})
    if bullets != len(out):
        raise SystemExit(
            f"dispatch_status: {bullets} iteration bullet(s) in {LOG} but only {len(out)} "
            f"parsed into rows. Every counter below reads Continue rows, so an unparsed row "
            f"makes a counter under-report and a loop starve — silently, which is the failure "
            f"this script exists to make impossible. Fix ROW; do not print a number."
        )
    return out


def since_last(all_rows, loop):
    """Rows recorded after the last time `loop` ran (all of them if it never has)."""
    last = max((i for i, r in enumerate(all_rows) if r["loop"] == loop), default=None)
    return (all_rows[last + 1:], all_rows[last]["at"]) if last is not None else (all_rows, "never")


def report(all_rows, loop, threshold, unit):
    after, when = since_last(all_rows, loop)
    if loop == "Standardize":
        count = sum(1 for r in after if r["loop"] == "Continue")
        detail = ""
    else:
        # Distinct slices touched since the last grill — what "a slice closed"
        # means in practice, and countable from what the log already writes.
        # Which loops count is decided and measured at CLOSES_A_SLICE above.
        slices = sorted({
            s
            for r in after
            if r["loop"] in CLOSES_A_SLICE
            for s in [slice_of(r["item"])]
            if s
        }, key=int)
        count = len(slices)
        # A ZERO HERE IS A DEFECT UNTIL PROVEN OTHERWISE. Build rounds happened
        # but no slice parsed out of any of them means the parser is blind, not
        # that no work landed — exactly how this rule spent five days reporting
        # "ok" while eighteen slices closed.
        build_rows = [r for r in after if r["loop"] in CLOSES_A_SLICE]
        if build_rows and not slices:
            raise SystemExit(
                f"dispatch_status: {len(build_rows)} Continue round(s) since the last "
                f"{loop} round and NOT ONE names a slice. That is a parse failure, not "
                f"a quiet backlog — check SLICE against what record_iteration.py writes."
            )
        detail = f"  [{', '.join(slices)}]" if slices else ""
    overdue = count >= threshold
    flag = "OVERDUE" if overdue else "ok"
    print(
        f"  {loop:<12} {count:>2} / {threshold} {unit + ('' if count == 1 else 's'):<16}"
        f"since {when}   {flag}{detail}"
    )
    return overdue


# @heuristic — `slice_of` RECOGNISES a slice reference in free prose, and that
# recognition has now been wrong twice in this file's life (two digits only; the
# prose form invisible). apps/docs' check:selftests does not reach scripts/loops,
# so the rule is honoured here by hand rather than skipped because no gate asks.
# Each case below is one the detector has actually got wrong, or one it must keep
# refusing — a self-test made only of things it already passes cannot fail.
SELF_TEST = [
    # (item text, expected slice or None)
    ("164.1 the dispatcher's counter reconciles", "164"),   # bare
    ("Slice 84: wrote the eight missing entries", "84"),    # prose — was invisible
    ("Slice 92.4: adopted Amount in invoice-list", "92"),   # prose with sub-item
    ("145.3 something past the two-digit bug", "145"),      # the 2026-08-21 regression
    ("7.2 an early single-digit slice", "7"),
    ("Slice 7 scoping review (device coverage)", "7"),      # prose, no sub-item
    ("17 screens render a date as a plain string", None),   # not a slice number
    ("10.3% of pages carry the clause", "10"),              # KNOWN false positive, below
    ("scored Tables & lists (5 components)", None),
    ("released 0.3.0 to npm", None),                        # leading 0 refused
    # The third convention (166.5) — bare top-level number, no sub-item.
    ("166 — Standardize sweep: three rot-guards clean", "166"),  # was invisible
    ("119: pattern wishlist triaged with grilled verdicts", "119"),  # flush colon
    # ...and the trap that the first draft of that widening fell into. These are
    # counts of ticks and seats, not slice 4. Eighteen such rows are in the log.
    ("4-tick sweep: paths.mjs is one definition of DIST", None),
    ("4-seat adversarial grill of Slice 18 at slice close", None),
]
# `10.3%` is a real miss and is left alone deliberately. The tighter rule —
# require `.[1-9]`, since item indexes are 1-based — was measured over the whole
# log and changes four rows: it drops the two "1.0 checklist" false positives AND
# two REAL references, `110.0` and `145.0`. Trading two right answers for two
# wrong ones is not a fix. Both surviving false positives are on Explore and
# Roadmap rows, which CLOSES_A_SLICE excludes, so neither reaches the counter.


def self_test():
    bad = [
        f"    {item!r} -> {got!r}, expected {want!r}"
        for item, want in SELF_TEST
        for got in [slice_of(item)]
        if got != want
    ]
    if bad:
        print("dispatch_status --self-test FAILED:", file=sys.stderr)
        print("\n".join(bad), file=sys.stderr)
        return 1
    print(f"dispatch_status --self-test: {len(SELF_TEST)} cases classified correctly")
    return 0


def main():
    if "--self-test" in sys.argv:
        return self_test()
    all_rows = rows()
    if len(all_rows) < 2:
        print("dispatch status: loop-log.md has too few rows to say anything", file=sys.stderr)
        return 0
    print(f"dispatch status — counter-triggered rules ({len(all_rows)} iterations logged)")
    any_overdue = False
    for loop, (threshold, unit) in RULES.items():
        any_overdue |= report(all_rows, loop, threshold, unit)
    if any_overdue:
        print("  -> a counter is at or past its threshold; the dispatcher should pick it")
    return 0


if __name__ == "__main__":
    sys.exit(main())
