#!/usr/bin/env python3
"""Read-only harvest: per roadmap item, its text history across git and its
loop-log dispatches. Writes items.jsonl in this directory. Never writes the repo.

Item line shape (ROADMAP.md / ROADMAP-archive.md):
  N. [ ] **392.2 — title ...
         continuation lines, indented
"""
import json, re, subprocess, sys, hashlib
from pathlib import Path

REPO = Path(subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True,
                          cwd=Path(__file__).resolve().parent).stdout.strip())
# Writes items.jsonl to the directory given as the first argument (never into the repo).
OUT = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/bo-lint-history")
OUT.mkdir(parents=True, exist_ok=True)
ITEM = re.compile(r"^(\s*)\d+\. \[( |x|X)\] \*\*(?:OWNER[^0-9]*)?(\d+\.\d+)\b")

def git(*a):
    return subprocess.run(["git", "-C", str(REPO), *a], capture_output=True, text=True).stdout

def parse(text):
    items = {}
    lines = text.splitlines()
    i = 0
    while i < len(lines):
        m = ITEM.match(lines[i])
        if not m:
            i += 1; continue
        ind = len(m.group(1)); iid = m.group(3); status = m.group(2).lower()
        body = [lines[i]]
        j = i + 1
        while j < len(lines):
            l = lines[j]
            if ITEM.match(l) or l.startswith("#"):
                break
            if l.strip() and (len(l) - len(l.lstrip())) <= ind:
                break
            body.append(l); j += 1
        t = "\n".join(body).rstrip()
        if iid not in items:  # first occurrence wins (dupes exist)
            items[iid] = (status, t)
        i = j
    return items

def norm(t):
    t = re.sub(r"^\s*\d+\. \[[ xX]\] ", "", t)
    return re.sub(r"\s+", " ", t).strip()

def main():
    revs = git("log", "--reverse", "--format=%H %cI", "--", "ROADMAP.md").split("\n")
    revs = [r.split() for r in revs if r.strip()]
    hist = {}  # iid -> list of (sha, date, status, text)
    last = {}
    for n, (sha, date) in enumerate(revs):
        txt = git("show", f"{sha}:ROADMAP.md")
        items = parse(txt)
        for iid, (st, t) in items.items():
            key = (st, norm(t))
            if last.get(iid) != key:
                hist.setdefault(iid, []).append({"sha": sha[:10], "date": date, "status": st, "text": t})
                last[iid] = key
        if n % 100 == 0:
            print(f"{n}/{len(revs)}", file=sys.stderr)
    # loop-log rows per item id
    rows = [l for l in (REPO / ".roundtable/loop-log.md").read_text().splitlines() if l.startswith("- 20")]
    disp = {}
    for l in rows:
        parts = l[2:].split(" · ")
        if len(parts) < 6:
            continue
        ts, loop, mode, item, outcome, commit = parts[0], parts[1], parts[2], " · ".join(parts[3:-2]), parts[-2], parts[-1]
        for iid in set(re.findall(r"\b(\d{1,3}\.\d{1,2})\b", item.split("—")[0][:40])):
            disp.setdefault(iid, []).append({"ts": ts, "loop": loop, "mode": mode, "outcome": outcome.split()[0].strip(":;,").lower() if outcome.strip() else "", "commit": commit.strip(), "item": item[:200]})
    with (OUT / "items.jsonl").open("w") as fh:
        for iid, h in hist.items():
            fh.write(json.dumps({"id": iid, "history": h, "dispatches": disp.get(iid, [])}) + "\n")
    print(f"items with history: {len(hist)}; with loop-log rows: {sum(1 for i in hist if i in disp)}", file=sys.stderr)

if __name__ == "__main__":
    main()
