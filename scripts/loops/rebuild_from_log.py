#!/usr/bin/env python3
"""Rebuild loops.db from scratch using the source-of-truth files:
.roundtable/loop-log.md (iterations) and .roundtable/loop-metrics.jsonl
(metrics). Idempotent — drops and recreates both tables, so running it can
never drift from the files. This is the recovery/verify path; day-to-day the
record_* scripts insert incrementally.

Usage: python3 scripts/loops/rebuild_from_log.py

RECONCILES AGAINST THE SOURCE, AND REFUSES TO WRITE WHEN IT CANNOT (roadmap
159.2). CLAUDE.md's storage doctrine says a mirror must reconcile against its
source and fail loudly, and *a derived artefact may not decide, on its own, what
it failed to see* — this script did neither. It mis-parsed one line in 971 into
an `outcome` column holding a fragment of that item's own prose, and printed a
serene "rebuilt loops.db — 971 iterations".

`check:loop-vocab` looks like the gate for that and is not: it compares the
vocabulary DOCUMENTED in CLAUDE.md and LOOPS.md against the Python constant, and
never reads a row. Nothing else runs these scripts — they are not in CI at all —
so the check belongs here, in the path that writes.

Three assertions, all against the file rather than against what this script
believes it did:

  1. every "- " line in the log produced a row (a parser that skips is silent);
  2. every row recorded after the vocabulary was enforced carries an outcome
     `record_iteration.py` would accept — history before that keeps its own
     vocabulary, which 153 refused to rewrite;
  3. `parse_log_line` still passes its own self-test, run on EVERY rebuild
     rather than behind a flag, because a self-test nothing runs is a self-test
     that has rotted.
"""
import json
import os

from _common import LOG, METRICS, SEP, connect, parse_log_line
from record_iteration import OUTCOMES

# The vocabulary was enforced by roadmap 41.2. Measured, not guessed: 8 rows
# carry a pre-enforcement outcome ("shipped", "committed", "fixed; push
# pending (GitHub 500)") and the newest of them is 2026-08-19 04:10. Anything
# after this boundary must be in vocabulary; anything before is history and is
# deliberately left alone.
VOCAB_ENFORCED_FROM = "2026-08-19 05:00"


def self_test():
    """`parse_log_line` must survive an item containing the separator itself.

    Red-proved against the real defect: with the fields read positionally from
    the left, the second case below puts "b · c" in `outcome` and "out" in
    `commit_sha`.
    """
    plain = parse_log_line("- 2026-08-27 06:31 · Continue · build · an item · landed · abc1234")
    embedded = parse_log_line("- 2026-08-27 06:31 · Continue · build · a · b · c · landed · abc1234")
    legacy = parse_log_line("- 2026-08-13 00:00 · Continue · build · an item · shipped · -")
    cases = [
        ("plain line parses", (plain["item"], plain["outcome"], plain["commit_sha"]),
         ("an item", "landed", "abc1234")),
        ("separator inside the item survives",
         (embedded["item"], embedded["outcome"], embedded["commit_sha"]),
         ("a · b · c", "landed", "abc1234")),
        ('"-" commit becomes None', legacy["commit_sha"], None),
        ("prose is not a row", parse_log_line("some prose"), None),
    ]
    for label, got, want in cases:
        if got != want:
            raise SystemExit(f"rebuild_from_log self-test FAILED — {label}: {got!r} != {want!r}")


def read_iterations():
    """Parse and RECONCILE before anything is written.

    Deliberately ahead of the DROP below: "refusing to write" has to mean the
    previous mirror survives. Validating mid-insert would leave an empty mirror
    behind on failure, which is a quieter kind of wrong than the row it exists
    to catch.
    """
    rows = []
    bullets = 0
    offenders = []
    if os.path.exists(LOG):
        with open(LOG, encoding="utf-8") as f:
            for lineno, line in enumerate(f, 1):
                if line.startswith("- "):
                    bullets += 1
                row = parse_log_line(line)
                if not row:
                    continue
                if row["ts"] >= VOCAB_ENFORCED_FROM and row["outcome"] not in OUTCOMES:
                    offenders.append((lineno, row["ts"], row["outcome"]))
                rows.append(row)

    # Count the raw thing in the source, not what this script thinks it read.
    if bullets != len(rows):
        raise SystemExit(
            f"rebuild_from_log: {bullets} bullet line(s) in {LOG} but only {len(rows)} parsed into "
            f"rows. The mirror would silently under-report — fix parse_log_line, do not write."
        )
    if offenders:
        detail = "; ".join(f"line {n} ({ts}): {out!r}" for n, ts, out in offenders[:5])
        raise SystemExit(
            f"rebuild_from_log: {len(offenders)} row(s) recorded after {VOCAB_ENFORCED_FROM} carry "
            f"an outcome record_iteration.py would reject — {detail}. That is a PARSE failure, not "
            f"a vocabulary drift: the recorder cannot write one. Refusing to write the mirror."
        )
    return rows


def main():
    self_test()
    parsed = read_iterations()

    conn = connect()
    conn.executescript("DROP TABLE IF EXISTS iterations; DROP TABLE IF EXISTS metrics;")
    conn.close()
    conn = connect()  # recreate schema

    for row in parsed:
        conn.execute(
            "INSERT INTO iterations (ts, loop, mode, item, outcome, commit_sha) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (row["ts"], row["loop"], row["mode"], row["item"],
             row["outcome"], row["commit_sha"]),
        )
    iters = len(parsed)

    mets = 0
    if os.path.exists(METRICS):
        with open(METRICS, encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                m = json.loads(line)
                conn.execute(
                    "INSERT INTO metrics (ts, name, value, unit) VALUES (?, ?, ?, ?)",
                    (m["ts"], m["name"], m["value"], m.get("unit")),
                )
                mets += 1

    conn.commit()
    conn.close()
    print(f"rebuilt loops.db — {iters} iterations, {mets} metrics")


if __name__ == "__main__":
    main()
