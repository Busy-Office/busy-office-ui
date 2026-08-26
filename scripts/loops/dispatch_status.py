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

Exit status is always 0; the output is the product.
"""
import re
import sys

from _common import LOG

ROW = re.compile(r"^- (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) · (\w+) · (\w+) · (.*)$")
# The slice a row worked on: the log's convention is that an item OPENS with its
# item number — "40.3 REFUSED the date picker…".
#
# Anchored to the start on purpose. A free-text scan for `NN.N` reads "10.3%"
# and "17 screens" as slice numbers, which is how the first version of this
# script reported 16 slices instead of 10 — the same class of instrument error
# the Slices 31-40 grill had just finished cataloguing.
# ANY slice number, not two digits. `^(\d{2})\.` silently stopped matching the
# day slice numbers passed 99 (2026-08-21): it read "14" out of "145.3", wanted
# a dot, found "5", and returned no match. Objective then counted 0 slices for
# FIVE DAYS while 70 Continue rounds and ~17 slices went past it — a rule that
# could not fire, reporting "ok".
#
# LOOPS.md already records this failure shape twice, the second time about
# Objective specifically ("it starved for ten slices before this was noticed").
# This is the third. The regex is the bug; the silence is the lesson, which is
# what assert_parsed below exists for.
SLICE = re.compile(r"^([1-9]\d{0,2})\.\d+[a-z]?\b")

# name -> (threshold, what one unit is, how the rule counts)
RULES = {
    "Standardize": (4, "Continue round"),
    "Objective": (3, "slice"),
}


def rows():
    out = []
    with open(LOG, encoding="utf-8") as fh:
        for line in fh:
            m = ROW.match(line.rstrip("\n"))
            if m:
                out.append({"at": m.group(1), "loop": m.group(2), "item": m.group(4)})
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
        # Continue rows only: that is where build work lands. A Roadmap triage
        # row plans a slice, it does not close one.
        slices = sorted({
            m.group(1)
            for r in after
            if r["loop"] == "Continue"
            for m in [SLICE.match(r["item"])]
            if m
        }, key=int)
        count = len(slices)
        # A ZERO HERE IS A DEFECT UNTIL PROVEN OTHERWISE. Continue rounds
        # happened but no slice parsed out of any of them means the parser is
        # blind, not that no work landed — exactly how this rule spent five
        # days reporting "ok" while eighteen slices closed.
        build_rows = [r for r in after if r["loop"] == "Continue"]
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


def main():
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
