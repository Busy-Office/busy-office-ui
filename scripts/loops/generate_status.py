#!/usr/bin/env python3
"""Generate STATUS.md — the human's ten-second "now" view (roadmap 110.5).

STATUS.md is a DERIVED MIRROR, same doctrine as loops.db (see CLAUDE.md's
storage doctrine): it is regenerated wholesale from three sources that are
already the record —

  - ROADMAP.md        open items (`N. [ ] **NN.N — Title.**`), scanned fresh
  - .roundtable/loop-log.md   last 10 iterations (via loops.db, the mirror
                              already built from that log)
  - dispatch_status.py        the existing counter-overdue report, run as a
                              subprocess and embedded verbatim — no duplicate
                              counting logic

Nothing here is hand-authored data. If a number looks wrong, the fix is in
ROADMAP.md, loop-log.md, or dispatch_status.py — never in this file or its
output.

Usage:
    python3 scripts/loops/generate_status.py            # writes STATUS.md
    python3 scripts/loops/generate_status.py --check     # exit 1 if stale

Rebuildable: `rm STATUS.md && python3 scripts/loops/generate_status.py` must
reproduce the file byte-for-byte (the only changing input is the "generated
at" timestamp, which --check tolerates — see below).
"""
import argparse
import datetime
import re
import subprocess
import sys

from _common import ROOT, LOG, connect

import os

ROADMAP = os.path.join(ROOT, "ROADMAP.md")
STATUS = os.path.join(ROOT, "STATUS.md")

# Matches the roadmap's open-item convention: "N. [ ] **NN.N[a-z] — Title.**"
ITEM = re.compile(
    r"^\d+\.\s*\[ \]\s*\*\*(\d+)(\.\d+[a-z]?)?\s*(?:—|-)\s*([^*]+?)\*\*",
    re.M,
)


def open_items():
    """[(slice_num, item_id, title, owner_blocked)] scanned fresh from ROADMAP.md."""
    text = open(ROADMAP, encoding="utf-8").read()
    lines = text.splitlines()
    # Byte offsets of every line start, to slice out each item's body text
    # (from its match to the next numbered item or next heading) so we can
    # look for "owner" inside the body, not just the title.
    starts = [m.start() for m in re.finditer(r"^", text, re.M)]
    items = []
    matches = list(ITEM.finditer(text))
    for i, m in enumerate(matches):
        major = m.group(1)
        minor = m.group(2) or ""
        item_id = f"{major}{minor}"
        if not minor:
            continue  # bare "N." list markers without a NN.N id aren't roadmap items
        title = " ".join(m.group(3).split())
        body_end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        # stop the body at the next '##' heading too, whichever comes first
        next_heading = text.find("\n## ", m.start())
        if next_heading != -1:
            body_end = min(body_end, next_heading)
        body = text[m.start():body_end]
        owner_blocked = bool(re.search(r"owner", body, re.I))
        items.append((major, item_id, title, owner_blocked))
    return items


def by_slice(items):
    groups = {}
    for major, item_id, title, _ in items:
        groups.setdefault(major, []).append((item_id, title))
    return dict(sorted(groups.items(), key=lambda kv: int(kv[0])))


def dispatch_counters():
    """Run dispatch_status.py and return its stdout verbatim — no re-derivation."""
    script = os.path.join(os.path.dirname(__file__), "dispatch_status.py")
    out = subprocess.run(
        [sys.executable, script], capture_output=True, text=True, cwd=ROOT
    )
    return out.stdout.strip() or "(dispatch_status.py produced no output)"


def last_iterations(n=10):
    """Last n rows from loops.db (the mirror), most recent last."""
    conn = connect()
    rows = conn.execute(
        "SELECT ts, loop, mode, item, outcome, commit_sha FROM iterations "
        "ORDER BY id DESC LIMIT ?",
        (n,),
    ).fetchall()
    conn.close()
    return list(reversed(rows))


def render(now_str):
    items = open_items()
    slices = by_slice(items)
    owner_blocked = [(iid, title) for _, iid, title, blocked in items if blocked]
    iterations = last_iterations(10)
    counters = dispatch_counters()

    out = []
    out.append("# STATUS")
    out.append("")
    out.append(
        "Generated — do not hand-edit. Regenerate with "
        "`python3 scripts/loops/generate_status.py` (also runs automatically "
        "after `record_iteration.py`). Source of truth for every number here "
        "is ROADMAP.md + `.roundtable/loop-log.md`/`loops.db`; this file is a "
        "derived mirror, same doctrine as `loops.db` itself (see CLAUDE.md)."
    )
    out.append("")
    out.append(f"Generated at: {now_str}")
    out.append("")

    out.append("## Open items by slice")
    out.append("")
    if slices:
        for major, its in slices.items():
            out.append(f"- **Slice {major}** ({len(its)} open)")
            for iid, title in its:
                out.append(f"  - {iid} — {title}")
    else:
        out.append("(no open items found)")
    out.append("")

    out.append("## Dispatch counters")
    out.append("")
    out.append("```")
    out.append(counters)
    out.append("```")
    out.append("")

    out.append("## Owner-blocked")
    out.append("")
    out.append(
        "Open items whose text mentions \"owner\" — needs an owner decision, "
        "trigger, or hardware a wake cannot supply on its own."
    )
    out.append("")
    if owner_blocked:
        for iid, title in owner_blocked:
            out.append(f"- {iid} — {title}")
    else:
        out.append("(none)")
    out.append("")

    out.append("## Last 10 iterations")
    out.append("")
    if iterations:
        for ts, loop, mode, item, outcome, commit in iterations:
            mode_s = mode or "-"
            commit_s = commit or "-"
            out.append(f"- {ts} · {loop} · {mode_s} · {item} · {outcome} · {commit_s}")
    else:
        out.append("(loops.db has no rows — run scripts/loops/rebuild_from_log.py)")
    out.append("")

    out.append("## Sunset test")
    out.append("")
    out.append(
        "This file exists so the owner can get the ten-second \"now\" view "
        "without asking for a chat summary. **If, in practice, the owner keeps "
        "asking for or reading chat summaries instead of this file, delete "
        "STATUS.md and its generator** — that is proof it is ceremony, not a "
        "read habit, and the wake budget belongs elsewhere. Nothing else "
        "depends on this file: ROADMAP.md and loop-log.md remain the source "
        "of truth with or without it."
    )
    out.append("")
    return "\n".join(out)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument(
        "--check", action="store_true",
        help="exit 1 if STATUS.md is missing or stale (ignoring the timestamp line)",
    )
    args = ap.parse_args()

    now_str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    content = render(now_str)

    if args.check:
        if not os.path.exists(STATUS):
            print("STATUS.md is missing", file=sys.stderr)
            return 1
        current = open(STATUS, encoding="utf-8").read()
        strip_ts = lambda s: re.sub(r"^Generated at: .*$", "", s, flags=re.M)
        if strip_ts(current) != strip_ts(content):
            print("STATUS.md is stale — regenerate it", file=sys.stderr)
            return 1
        print("STATUS.md is current")
        return 0

    with open(STATUS, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"wrote {STATUS}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
