"""Shared helpers for the loop telemetry mirror.

Doctrine: the markdown/jsonl files under .roundtable/ are the source of truth;
loops.db is a derived mirror that can be rebuilt from them at any time.
"""
import os
import sqlite3

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RT = os.path.join(ROOT, ".roundtable")
DB = os.path.join(RT, "loops.db")
LOG = os.path.join(RT, "loop-log.md")
METRICS = os.path.join(RT, "loop-metrics.jsonl")
SCHEMA = os.path.join(os.path.dirname(__file__), "schema.sql")

# Canonical log line: "- <ts> · <loop> · <mode> · <item> · <outcome> · <commit>"
SEP = " · "


def connect(db=DB):
    os.makedirs(os.path.dirname(db), exist_ok=True)
    conn = sqlite3.connect(db)
    with open(SCHEMA, encoding="utf-8") as f:
        conn.executescript(f.read())
    return conn


def parse_log_line(line):
    """Return an iteration dict from a canonical log line, or None if not one.

    Tolerant of the older 4-field form (ts · loop · item · outcome) so history
    written before the mode/commit columns existed still rebuilds cleanly.
    """
    line = line.strip()
    if not line.startswith("- "):
        return None
    parts = [p.strip() for p in line[2:].split(SEP)]
    if len(parts) < 3:
        return None
    ts, loop = parts[0], parts[1]
    rest = parts[2:]
    if len(rest) >= 4:                       # mode · item · outcome · commit(+)
        mode, item, outcome, commit = rest[0], rest[1], rest[2], rest[3]
    elif len(rest) == 3:                      # mode · item · outcome
        mode, item, outcome, commit = rest[0], rest[1], rest[2], None
    elif len(rest) == 2:                      # legacy: item · outcome
        mode, item, outcome, commit = None, rest[0], rest[1], None
    else:                                     # item only
        mode, item, outcome, commit = None, rest[0], None, None
    commit = None if commit in (None, "-", "") else commit
    return {"ts": ts, "loop": loop, "mode": mode, "item": item,
            "outcome": outcome, "commit_sha": commit}
