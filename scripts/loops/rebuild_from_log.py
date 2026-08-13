#!/usr/bin/env python3
"""Rebuild loops.db from scratch using the source-of-truth files:
.roundtable/loop-log.md (iterations) and .roundtable/loop-metrics.jsonl
(metrics). Idempotent — drops and recreates both tables, so running it can
never drift from the files. This is the recovery/verify path; day-to-day the
record_* scripts insert incrementally.

Usage: python3 scripts/loops/rebuild_from_log.py
"""
import json
import os

from _common import LOG, METRICS, connect, parse_log_line


def main():
    conn = connect()
    conn.executescript("DROP TABLE IF EXISTS iterations; DROP TABLE IF EXISTS metrics;")
    conn.close()
    conn = connect()  # recreate schema

    iters = 0
    if os.path.exists(LOG):
        with open(LOG, encoding="utf-8") as f:
            for line in f:
                row = parse_log_line(line)
                if not row:
                    continue
                conn.execute(
                    "INSERT INTO iterations (ts, loop, mode, item, outcome, commit_sha) "
                    "VALUES (?, ?, ?, ?, ?, ?)",
                    (row["ts"], row["loop"], row["mode"], row["item"],
                     row["outcome"], row["commit_sha"]),
                )
                iters += 1

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
