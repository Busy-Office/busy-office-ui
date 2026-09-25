#!/usr/bin/env python3
"""The item lint's catch rate on history (roadmap 393.7), re-run rather than copied.

    python3 .roundtable/milestone-m1-2026-09-25/lint_history/harvest_items.py DIR
    python3 .roundtable/milestone-m1-2026-09-25/lint_history/label_v2.py DIR
    python3 .roundtable/milestone-m1-2026-09-25/lint_history/lint_history.py DIR

harvest_items.py walks every revision of ROADMAP.md and the loop log;
label_v2.py labels each item from what happened next (the milestone grill's
Jev pilot, 2026-09-25): re-planned (clarify, owner, replan), built as written
(execute) or refused (left out). This script runs scripts/loops/milestone.py's
item_lint — the one rule M and the planner check use — over the text each item
had when it was labelled, and prints each clause's rate on both classes.
"""
import json, os, subprocess, sys
from pathlib import Path
ROOT = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True,
                      cwd=Path(__file__).resolve().parent).stdout.strip()
sys.path.insert(0, os.path.join(ROOT, "scripts", "loops"))
import milestone  # noqa: E402

out = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/bo-lint-history")
cases = [json.loads(l) for l in (out / "labelled_v2.jsonl").read_text().splitlines()]
POS = {"clarify", "owner", "replan"}
pos = [c for c in cases if c["label"] in POS]
exe = [c for c in cases if c["label"] == "execute"]
print(f"labelled: {len(cases)} ({len(pos)} re-planned, {len(exe)} built as written, "
      f"{len(cases) - len(pos) - len(exe)} refused and left out)")


def lint(t):
    return milestone.item_lint({"body": t, "slice": "0", "route": "", "milestone": ""}, "", None, require_route=False)


for name, hit in (("no Accept", lambda r: "no Accept" in r),
                  ("no instrument", lambda r: "its Accept names no instrument" in r),
                  ("either (the lint)", lambda r: bool(r))):
    p = sum(1 for c in pos if hit(lint(c["text"])))
    e = sum(1 for c in exe if hit(lint(c["text"])))
    print(f"  {name:18s} catches {p}/{len(pos)} re-planned ({p/len(pos):.0%}); "
          f"flags {e}/{len(exe)} built as written ({e/len(exe):.0%})")
print("  (Route: cannot be measured on history: no item carried one before 2026-09-25)")
