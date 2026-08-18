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
SLICE = re.compile(r"^(\d{2})\.\d+[a-z]?\b")

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
        })
        count = len(slices)
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
