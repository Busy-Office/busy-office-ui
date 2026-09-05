#!/usr/bin/env python3
"""Report how overdue each COUNTER-triggered dispatcher rule is, and whether
rule 5's input is fresh enough to be worth evaluating at all.

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

Rule 5 is not a counter — it reads `loop-metrics.jsonl`, not the log — so it is
reported separately and cannot be "overdue", only STALE. It is here because Step
0b is the one moment every wake looks at dispatcher inputs, and because rule 5
starved the same silent way with nobody watching: see the block above
`metric_samples` for what that cost and how the threshold was chosen.

The output is the product. Exit status is 0 on a clean read and NON-ZERO on a
parse failure — a counter that cannot see its own input must say so rather than
print a number, which is the whole reason this file exists.
"""
import json
import re
import sys

from _common import LOG, METRICS

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
#   Polish       ·  18 rows (17 slices) — ADDED 2026-09-05 (roadmap 279.4). The
#                            line here used to read "Meta/Polish/Optimize · 0
#                            rows ever named a slice. Nothing to decide." That
#                            was true when written and is now false: Polish
#                            names a slice on 18 rows / 17 slices, and 12 of
#                            those 17 are named by NO Continue/Standardize row
#                            at all, so rule 3 cannot see them. Its sole stated
#                            ground for the exclusion died; the exclusion went
#                            with it.
#   Meta         ·   3 rows (3 slices)  — EXCLUDED. Also no longer zero, and
#                            also no longer decidable by "nothing to decide" —
#                            but a Meta row records machinery about the loop
#                            itself, which is the Roadmap reason, not a slice
#                            of product work closing. Left out deliberately, so
#                            the next reader sees it was asked.
#   Optimize     ·   0 rows — still genuinely zero.
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
# REPLAYED AGAIN 2026-09-05 (roadmap 279.4) over 1,437 rows, same method:
#
#   Continue + Standardize          51
#   + Polish                        52      <- decided
#
# ONE crossing over the whole log — and the whole-log figure is the misleading
# one here, which is why the current window is quoted beside it. At the moment
# this landed the counter read `2 / 3 [274, 278]` while FIVE slices had closed
# since the last grill: 274, 276, 277, 278, 279. Three of the five (276, 277,
# 279) are Polish rounds that filed and closed their own slices, and rule 3
# could see none of them. The whole-log average is flat because Polish only
# started closing slices in bulk once rule 4's cloud lane ran dry; the effect is
# concentrated in exactly the era the loop is now in, so an average over the
# whole log is the wrong instrument for it.
#
# The replay above was reconciled against this script's own live output before
# being quoted — replaying `Continue + Standardize` for the current window
# returns ['274', '278'], which is what `report()` prints. An instrument's first
# output is not evidence; this one agreed with a second, independent reading.
#
# Circularity was checked, since that is what disqualified Objective: a Polish
# round is dispatched by rule 6 and an Objective row resets this counter, so
# Polish arming rule 3 does not arm Polish. And LOOPS.md's own asymmetry decides
# the residual doubt — rule 3 sits ABOVE rule 4 so it cannot starve, so
# over-arming costs one paragraph of scope-setting and under-arming costs a
# starved loop.
#
# And of the 45 Objective rounds that actually ran, the number where the counter
# was ALREADY past 3 goes 6 -> 15: the corrected counter shows the rule was
# firing LATE more often than anyone knew. It is not trigger-happy either — 23
# crossings against 45 real Objective rounds means it still signals about half as
# often as the loop actually ran, which is the direction LOOPS.md worries about.
CLOSES_A_SLICE = ("Continue", "Standardize", "Polish")

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
            # WARNS, never exits (roadmap 170.3). This guard reads a zero as
            # proof the parser is blind, and that inference is unsound on a
            # small window: 117 of 484 slice-closing rows legitimately name no
            # slice, so a window of ONE trips it ~24% of the time with nothing
            # wrong — which is how it fired on a real `Continue · fix` row and
            # hard-exited Step 0b, leaving that wake no counters at all.
            #
            #   python3 - <<'PY'   # re-run; do not trust the pinned figure
            #   import sys,re; sys.path.insert(0,'scripts/loops')
            #   import dispatch_status as ds
            #   R=re.compile(r"^- (\S+ \S+) · ([\w-]+) · ([\w-]+) · (.*?) · (\w+) · \S+$")
            #   rows=[m.groups() for m in (R.match(l.rstrip()) for l in
            #         open('.roundtable/loop-log.md')) if m]
            #   cs=[r for r in rows if r[1] in ds.CLOSES_A_SLICE]
            #   print(len(cs), sum(1 for r in cs if not ds.slice_of(r[3])))
            #   PY
            #   # 484 rows · 117 name no slice = 24.2% (2026-08-28)
            #
            # Fatality belongs to the PROVABLE check above — parsed rows vs raw
            # bullets — which 164.1 installed and which cannot be wrong. This
            # one is an inference, so it reports its own strength and lets the
            # reader weigh it. Losing Step 0b entirely is the worse failure:
            # a warning a wake can read beats a number it never sees.
            p_fluke = NO_SLICE_RATE ** len(build_rows)
            verdict = (
                "PROBABLY A PARSE FAILURE — check SLICE against what "
                "record_iteration.py writes"
                if p_fluke < 0.01
                else "not yet evidence of one; a slice-less row is ordinary here"
            )
            print(
                f"  !! {len(build_rows)} {loop}-closing round(s) since the last {loop} "
                f"round and none names a slice.\n"
                f"     At the measured {NO_SLICE_RATE:.0%} slice-less rate that is "
                f"p={p_fluke:.1%} if the parser is fine — {verdict}."
            )
        detail = f"  [{', '.join(slices)}]" if slices else ""
    overdue = count >= threshold
    flag = "OVERDUE" if overdue else "ok"
    print(
        f"  {loop:<12} {count:>2} / {threshold} {unit + ('' if count == 1 else 's'):<16}"
        f"since {when}   {flag}{detail}"
    )
    return overdue


# ---------------------------------------------------------------------------
# RULE 5's input (roadmap 184.1). The two counters above read `loop-log.md`;
# rule 5 reads `loop-metrics.jsonl`, and until 2026-08-29 NOTHING read it.
#
# What that cost, measured rather than argued. 96 of 99 metric samples predate
# 2026-08-20; 652 iterations were logged after it against 3 samples, and each of
# those three is a metric name recorded exactly once, so not one can satisfy
# rule 5's "two consecutive runs". Every wake in that window still evaluated
# rule 5 and reported it clear — from readings taken on 2026-08-18. Slice 183's
# dispatch record published one: `ci-wall-time` "flat at 275s", whose 26 samples
# all fall inside a single 17-hour window that day.
#
# It is the same starvation shape this file's header describes, one rule further
# down, and it had already been found once: Slice 28.1 closed on 2026-08-18 with
# the Accept criterion "`ci-wall-time` recorded every wake", against the finding
# that the rule was "structurally blind to the one number that bounds every
# future gate". THE FIX HELD FOR ONE DAY. A criterion satisfied by a burst and
# never again is invisible to everything here, because nothing re-asks it.
#
# So the threshold below is NOT invented here — it is 28.1's own adopted
# criterion, read as a property: if a whole wake-date of loop activity is newer
# than the newest pair rule 5 could compare, that pair did not come from this
# tree. Deliberately measured against the LOG's wake-dates and not `now()`:
# roadmap 164.2 settled that the log's stamps are the record, and this
# container's clock has run backwards once.
#
# DATE granularity, not timestamp, and that is load-bearing rather than lazy —
# checked live on 2026-08-29 rather than reasoned about. Both dispatchers write
# naive local stamps into these files at two different offsets (164.2 measured
# 974 rows at +0800 against 40 at +0000, and refused to add `%z`), so a metric
# recorded by the cloud wake at `00:37` sits BEFORE a log row the other
# dispatcher wrote at `08:21` **on the same day**. Comparing timestamps would
# read a sample taken minutes ago as older than the log and report STALE on a
# wake that had just recorded one. Comparing dates is immune to the whole
# eight-hour ambiguity, and a wake-date is also the unit 28.1's criterion is
# written in.
#
# BASE RATE, measured before shipping, because a predicate already true (or
# already false) of everything cannot fail and would look exactly like this one:
# replayed over all 17 wake-dates in the log with as-of-date semantics — only
# samples that existed on the day — it reads live on 6 and stale on 11, and
# stale on every one of the last 10. It discriminates; it is not ceremony.
#
#   python3 - <<'PY'   # re-run; the figures are snapshots
#   import json, re, collections
#   ROW = re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · ")
#   dates = sorted({ROW.match(l).group(1)[:10]
#                   for l in open('.roundtable/loop-log.md') if ROW.match(l)})
#   mets = [json.loads(l) for l in open('.roundtable/loop-metrics.jsonl') if l.strip()]
#   live = 0
#   for d in dates:
#       asof = [m for m in mets if m['ts'][:10] <= d]
#       c = collections.Counter(m['name'] for m in asof)
#       live += any(c[m['name']] >= 2 for m in asof if m['ts'][:10] == d)
#   print(live, 'of', len(dates))          # 6 of 17 (2026-08-29)
#   PY
#
# @exact — the verdict rests on equality and comparison of timestamps, names and
# counts, with no recognition step: a sample either carries a date newer than
# another or it does not. Nothing here can be fooled by a shape it has not seen,
# which is the property `--self-test` exists to check, so it is exempt per the
# heuristic/exact rule rather than wrapped in ceremony. `slice_of` above is the
# heuristic in this file and carries the self-test.


def metric_samples():
    """Every recorded metric sample, reconciled against the raw file.

    Counting the raw thing in the source and refusing to write when fewer parse
    is CLAUDE.md's mirror doctrine, and it is applied to the SOURCE rather than
    to anything a caller passed in — a reconciliation that cannot see past its
    own argument is self-consistent by construction and can never fail.
    """
    try:
        with open(METRICS, encoding="utf-8") as fh:
            raw = [ln for ln in fh if ln.strip()]
    except FileNotFoundError:
        return None
    out = []
    for ln in raw:
        try:
            row = json.loads(ln)
        except json.JSONDecodeError:
            continue
        if isinstance(row, dict) and "ts" in row and "name" in row:
            out.append(row)
    if len(out) != len(raw):
        raise SystemExit(
            f"dispatch_status: {len(raw)} non-empty line(s) in {METRICS} but only "
            f"{len(out)} parsed as samples. Rule 5 reads this file and nothing else "
            f"does, so an unparsed line makes its input look older or younger than "
            f"it is — silently. Fix the parse; do not print a number."
        )
    return out


def report_metrics(all_rows):
    """Rule 5's input: how stale is the newest pair it could actually compare?"""
    samples = metric_samples()
    if samples is None:
        print(f"  Optimize     no {METRICS} at all — rule 5 has no input to read   NO INPUT")
        return True
    counts = {}
    for s in samples:
        counts[s["name"]] = counts.get(s["name"], 0) + 1
    # Rule 5 compares TWO consecutive readings, so a name sampled once is not an
    # input to it however recent it is. All three samples recorded since
    # 2026-08-20 are exactly that, which is why "3 recent samples" is not the
    # reassurance it looks like.
    pairs = [s for s in samples if counts[s["name"]] >= 2]
    log_dates = sorted({r["at"][:10] for r in all_rows})
    if not pairs:
        print(
            f"  Optimize     {len(samples)} sample(s) over {len(counts)} name(s), none "
            f"sampled twice   NO LIVE INPUT"
        )
        return True
    newest = max(pairs, key=lambda s: s["ts"])
    # DISTINCT log dates strictly after the pair, never a count of wakes. Several
    # wakes on one date age this by zero, and a wake on a fresh date ages it by
    # one however little it did. A hand-off read it the other way on 2026-09-04
    # ("every decline ages the rule by one wake-date"): Slices 255 and 256 both
    # declined a sample on 2026-09-03, the same date as the newest pair, and
    # aged it by nothing; only 257 moved it, by falling on 2026-09-04 (roadmap
    # 258.1). The advisory line below says the unit, because that is where the
    # misreading happens.
    stale = [d for d in log_dates if d > newest["ts"][:10]]
    flag = "ok" if not stale else "STALE"
    print(
        f"  {'Optimize':<12} {len(stale):>2} wake-date(s) newer   "
        f"since {newest['ts']}   {flag}   "
        f"[newest pair: {newest['name']}; {len(samples)} sample(s), "
        f"{sum(1 for n in counts if counts[n] >= 2)} of {len(counts)} name(s) sampled twice]"
    )
    if stale:
        print(
            f"  -> rule 5's newest comparable pair predates {len(stale)} wake-date(s) of "
            f"loop activity. Any regression verdict quoted from it is about the tree as "
            f"it was on {newest['ts'][:10]}, not this one — record a metric or say the "
            f"rule could not be evaluated."
        )
        print(
            f"     the unit is DISTINCT LOG DATES after {newest['ts'][:10]} "
            f"({', '.join(stale)}), not wakes: several wakes on one date add "
            f"nothing, and one wake on a new date adds the whole step."
        )
    return bool(stale)


# Measured share of slice-closing rows that legitimately name no slice. Used
# ONLY to report how surprising a zero is, never to decide anything — the
# command that produces it is beside the guard that reads it (roadmap 170.3).
NO_SLICE_RATE = 0.242

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
    # Rule 5 is not a counter — it reads a different file and can be stale rather
    # than overdue — so it prints after the two counters and does not feed the
    # line above. It is reported here because Step 0b is the one moment every
    # wake looks at dispatcher inputs (roadmap 184.1).
    report_metrics(all_rows)
    return 0


if __name__ == "__main__":
    sys.exit(main())
