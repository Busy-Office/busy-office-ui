#!/usr/bin/env python3
"""Record one metric sample: append to loop-metrics.jsonl AND insert into
loops.db. The jsonl file is the source of truth; the DB is the mirror.

Usage:
  python3 scripts/loops/record_metric.py --name bundle-gz-kb --value 7.0 --unit kB

THERE IS DELIBERATELY NO `--direction`, AND DO NOT ADD ONE (roadmap 324.1,
2026-09-08). Two reasons, both measured. Shape: direction is constant per NAME,
so a per-sample field is one fact stored in every sample and free to disagree
with itself, and no sample already recorded could ever carry it. Substance:
supplying it makes rule 5 fire on `bundle-gz-kb` -- four consecutive day-pair
rises, 7.2 -> 15.1 kB -- and that verdict is wrong, because the same wakes
recorded `components` at the SAME timestamps and per-component cost FELL
(0.400 -> 0.384 -> 0.355 kB; 0.378 live). A rise with no denominator is growth.
Nor can the unit stand in: `count` is carried by 14 names spanning both
directions, and `axe-violations` changed unit mid-series (`pages` -> `count`).

So: the reader supplies the direction, and `dispatch_status.py` prints movement
rather than a verdict. When a name has a real threshold, gate it -- `check:size`
budgets the bundle at 16.7 kB gz, which is rule 5's budget clause and the
instrument that actually answers "is this a problem?".
"""
import argparse
import datetime
import json

from _common import METRICS, connect


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True)
    ap.add_argument("--value", required=True, type=float)
    ap.add_argument("--unit", default=None)
    ap.add_argument("--no-log", action="store_true")
    args = ap.parse_args()

    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    row = {"ts": ts, "name": args.name, "value": args.value, "unit": args.unit}

    if not args.no_log:
        with open(METRICS, "a", encoding="utf-8") as f:
            f.write(json.dumps(row) + "\n")

    conn = connect()
    conn.execute(
        "INSERT INTO metrics (ts, name, value, unit) VALUES (?, ?, ?, ?)",
        (ts, args.name, args.value, args.unit),
    )
    conn.commit()
    conn.close()
    print(f"recorded metric: {ts} · {args.name}={args.value}{args.unit or ''}")


if __name__ == "__main__":
    main()
