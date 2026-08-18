#!/usr/bin/env python3
"""Record one loop iteration: append the human line to loop-log.md AND insert
the derived row into loops.db. The markdown stays the source of truth.

Usage:
  python3 scripts/loops/record_iteration.py \
      --loop Continue --mode build --item "ERP Amount field" \
      --outcome landed [--commit <sha>] [--no-log]

--commit defaults to the current git HEAD short sha. --no-log inserts the DB
row without touching the markdown (used by rebuild).

OUTCOME VOCABULARY (roadmap 41.2). "shipped" is rejected because it was doing
two jobs and hiding the difference: every iteration in Slices 31-40 was recorded
as shipped while the registry served 0.1.1 throughout, so four consecutive
Objective grills had to keep rediscovering that none of it had reached a user.
The log is where prioritisation happens; it should not require an npm lookup to
read honestly.

    landed    committed to git, gates green — the normal outcome
    released  in a published artifact a consumer can install
    logged    a decision or plan recorded, no code
    triaged   input turned into roadmap items
    refused   considered and declined, with the reason recorded
    reverted  shipped then withdrawn

Historical rows are left alone. They record what was believed when written, and
rewriting them would erase the very finding that motivated this.
"""
import argparse
import datetime
import subprocess

from _common import LOG, SEP, connect

OUTCOMES = {"landed", "released", "logged", "triaged", "refused", "reverted"}


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
    if args.outcome == "shipped":
        raise SystemExit(
            'record_iteration: "shipped" is ambiguous — it meant both "committed" and\n'
            '  "a user can install it", and the second was never true while npm served\n'
            '  0.1.1. Use "landed" (committed, gates green) or "released" (published).'
        )
    if args.outcome not in OUTCOMES:
        raise SystemExit(
            f'record_iteration: unknown outcome "{args.outcome}".\n'
            f'  Use one of: {", ".join(sorted(OUTCOMES))}'
        )
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
