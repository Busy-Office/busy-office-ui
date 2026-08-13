#!/usr/bin/env python3
"""Record one metric sample: append to loop-metrics.jsonl AND insert into
loops.db. The jsonl file is the source of truth; the DB is the mirror.

Usage:
  python3 scripts/loops/record_metric.py --name bundle-gz-kb --value 7.0 --unit kB
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
