#!/usr/bin/env python3
"""Record one loop iteration: append the human line to loop-log.md AND insert
the derived row into loops.db. The markdown stays the source of truth.

Usage:
  python3 scripts/loops/record_iteration.py \
      --loop Continue --mode build --item "ERP Amount field" \
      --outcome shipped [--commit <sha>] [--no-log]

--commit defaults to the current git HEAD short sha. --no-log inserts the DB
row without touching the markdown (used by rebuild).
"""
import argparse
import datetime
import subprocess

from _common import LOG, SEP, connect


def head_sha():
    try:
        return subprocess.check_output(
            ["git", "rev-parse", "--short", "HEAD"], text=True
        ).strip()
    except Exception:
        return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--loop", required=True)
    ap.add_argument("--mode", default=None)
    ap.add_argument("--item", required=True)
    ap.add_argument("--outcome", required=True)
    ap.add_argument("--commit", default=None)
    ap.add_argument("--no-log", action="store_true",
                    help="insert the DB row only; don't append to loop-log.md")
    args = ap.parse_args()

    ts = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    commit = args.commit or head_sha()

    if not args.no_log:
        line = SEP.join(["- " + ts, args.loop, args.mode or "-",
                         args.item, args.outcome, commit or "-"])
        with open(LOG, "a", encoding="utf-8") as f:
            f.write(line + "\n")

    conn = connect()
    conn.execute(
        "INSERT INTO iterations (ts, loop, mode, item, outcome, commit_sha) "
        "VALUES (?, ?, ?, ?, ?, ?)",
        (ts, args.loop, args.mode, args.item, args.outcome, commit),
    )
    conn.commit()
    conn.close()
    print(f"recorded: {ts} · {args.loop} · {args.mode} · {args.item} · {args.outcome}")


if __name__ == "__main__":
    main()
