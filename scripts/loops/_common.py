"""Shared helpers for the loop telemetry mirror.

Doctrine: the markdown/jsonl files under .roundtable/ are the source of truth;
loops.db is a derived mirror that can be rebuilt from them at any time.
"""
import os
import sqlite3
import subprocess

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RT = os.path.join(ROOT, ".roundtable")
DB = os.path.join(RT, "loops.db")
LOG = os.path.join(RT, "loop-log.md")
METRICS = os.path.join(RT, "loop-metrics.jsonl")
SCHEMA = os.path.join(os.path.dirname(__file__), "schema.sql")

# Canonical log line: "- <ts> · <loop> · <mode> · <item> · <outcome> · <commit>"
SEP = " · "


def from_disk(path):
    """Read a file from the WORKING TREE.

    Paired with `from_rev` so a report can be pointed at either the tree or a
    revision. Both live here because `roadmap_scope.py` and
    `report_reopen_conditions.py` carried byte-identical copies (Standardize
    sweep, 2026-09-02) — and a reader pair is exactly the thing that must not
    drift: ENVIRONMENT.md's standing trap says a figure describing a commit is
    read from THAT COMMIT, so two reports disagreeing about what "read" means
    would publish figures that cannot be reconciled.
    """
    with open(path, encoding="utf-8") as fh:
        return fh.read()


def from_rev(rev):
    """Return a reader that resolves paths against `rev` instead of the tree."""

    def read(path):
        return subprocess.run(
            ["git", "show", f"{rev}:{path}"], capture_output=True, text=True, check=True
        ).stdout

    return read


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

    THE ITEM IS THE ONLY FIELD THAT MAY CONTAIN THE SEPARATOR, so the fixed
    fields around it are taken from the ENDS and the item is whatever is left in
    the middle (roadmap 159.2). Reading `outcome` and `commit` positionally from
    the LEFT is what broke: 151.1's line legitimately quotes list-report's dirty
    marker — `'Overdue · edited'` — so it carries seven fields, and the rebuilt
    row held a fragment of the item's own prose in its `outcome` column while
    `commit_sha` held the word "refused". One line in 971, and silent.

    Worth stating because the direction of the bug is the lesson:
    `record_iteration.py` builds the log line and the DB row from the same
    in-memory values, so the WRITE path was always correct. Only the RECOVERY
    path — the script whose whole purpose is that it can never drift from the
    files — could produce the damage.
    """
    line = line.strip()
    if not line.startswith("- "):
        return None
    parts = [p.strip() for p in line[2:].split(SEP)]
    if len(parts) < 3:
        return None
    ts, loop = parts[0], parts[1]
    rest = parts[2:]
    if len(rest) >= 4:                       # mode · item(+) · outcome · commit
        mode, outcome, commit = rest[0], rest[-2], rest[-1]
        item = SEP.join(rest[1:-2])
    elif len(rest) == 3:                      # mode · item · outcome
        mode, item, outcome, commit = rest[0], rest[1], rest[2], None
    elif len(rest) == 2:                      # legacy: item · outcome
        mode, item, outcome, commit = None, rest[0], rest[1], None
    else:                                     # item only
        mode, item, outcome, commit = None, rest[0], None, None
    commit = None if commit in (None, "-", "") else commit
    return {"ts": ts, "loop": loop, "mode": mode, "item": item,
            "outcome": outcome, "commit_sha": commit}
