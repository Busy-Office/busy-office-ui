#!/usr/bin/env python3
"""v2: one case per (item, the text the gate WOULD have seen), label from what
happened next. Fixes v1's leak (v1 used the post-rewrite text for 'clarify').

  clarify  : state = text at CREATION; later the Accept was rewritten (ratio<0.8)
             before the first Continue commit, or the first Continue row was
             triaged/logged (executor re-planned instead of building).
  owner    : state = text at creation; 'OWNER' was added later.
  replan   : state = text at creation; closed [x] with no Continue row and the
             closing text says superseded/withdrawn/folded/moot/merged/obsolete/
             dropped/refused at triage (re-planned away, never built).
  execute  : state = text at the first Continue commit's parent; that row
             landed and every Continue row for the id landed; Accept unchanged
             since creation.
  refused  : first Continue row refused (kept apart: ambiguous).
"""
import json, re, difflib, subprocess
from pathlib import Path
from collections import Counter
import sys
# Reads items.jsonl from, and writes labelled_v2.jsonl to, the directory given as
# the first argument (the one harvest_items.py wrote to).
HERE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("/tmp/bo-lint-history")
REPO = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True,
                      cwd=Path(__file__).resolve().parent).stdout.strip()
LANDED = {"landed","shipped","fixed","released","red-first","clean","graduated","closed","committed"}
def accept(t):
    i = t.lower().find("accept"); return re.sub(r"\s+"," ",t[i:] if i>=0 else "").strip()
_cd = {}
def cdate(sha):
    if sha not in _cd:
        _cd[sha] = subprocess.run(["git","-C",REPO,"log","-1","--format=%cI",sha],capture_output=True,text=True).stdout.strip() or None
    return _cd[sha]
REPLAN = re.compile(r"SUPERSEDED|WITHDRAWN|folded into|merged into|\bmoot\b|obsolete|DROPPED|withdrawn|superseded", re.I)
rows = [json.loads(l) for l in (HERE/"items.jsonl").read_text().splitlines()]
cases=[]; skip=Counter()
for r in rows:
    h=r["history"]; created=h[0]
    cont=[d for d in r["dispatches"] if d["loop"]=="Continue" and re.match(r"^[0-9a-f]{7,}$",d["commit"])]
    anycont=[d for d in r["dispatches"] if d["loop"]=="Continue"]
    final=h[-1]
    if "OWNER" not in created["text"] and any("OWNER" in v["text"] for v in h[1:]):
        cases.append(dict(id=r["id"],label="owner",state_sha=created["sha"],text=created["text"])); continue
    if not anycont and final["status"]=="x" and REPLAN.search(final["text"]) and not REPLAN.search(created["text"]):
        cases.append(dict(id=r["id"],label="replan",state_sha=created["sha"],text=created["text"])); continue
    if not cont: skip["no Continue sha"]+=1; continue
    first=cont[0]; cd=cdate(first["commit"])
    if not cd: skip["sha missing"]+=1; continue
    before=[v for v in h if v["date"]<cd]
    if not before: skip["filed+built same commit"]+=1; continue
    at=before[-1]
    ratio=difflib.SequenceMatcher(None,accept(created["text"]),accept(at["text"])).ratio()
    fo=first["outcome"]
    if ratio<0.8 or fo in ("triaged","logged"):
        cases.append(dict(id=r["id"],label="clarify",state_sha=created["sha"],text=created["text"],ratio=round(ratio,2),first=fo)); continue
    if fo=="refused":
        cases.append(dict(id=r["id"],label="refused",state_sha=at["sha"],text=at["text"])); continue
    if fo in LANDED and all(d["outcome"] in LANDED for d in cont):
        cases.append(dict(id=r["id"],label="execute",state_sha=at["sha"],text=at["text"])); continue
    skip[f"mixed/unmapped:{fo}"]+=1
print("skipped",dict(skip)); print("labelled",len(cases),dict(Counter(c["label"] for c in cases)))
def feats(t):
    title=t.split("\n")[0]
    return {"has_accept":int("accept" in t.lower()),"backticks":t.count("`")//2,"words":len(t.split()),
            "decide":int(bool(re.search(r"\b(decide|whether|should|choose|pick|grill)\b|\?",title,re.I))),
            "owner_marked":int("OWNER" in t),"blocked":int(bool(re.search(r"BLOCKED|NEEDS-RUNTIME",t)))}
def auc(p,n):
    return None if not p or not n else round(sum((a>b)+0.5*(a==b) for a in p for b in n)/(len(p)*len(n)),3)
for c in cases: c["feats"]=feats(c["text"])
POS={"clarify","owner","replan"}
print("\nT0 AUC, positives = clarify+owner+replan vs execute (refused excluded)")
for f in cases[0]["feats"]:
    a=auc([c["feats"][f] for c in cases if c["label"] in POS],[c["feats"][f] for c in cases if c["label"]=="execute"])
    print(f"  {f:13s} {a}")
# combined T0 score: words rank + decide
(HERE/"labelled_v2.jsonl").write_text("".join(json.dumps(c)+"\n" for c in cases))
for lab in ["clarify","owner","replan"]:
    print(f"\n-- {lab}:")
    for c in [c for c in cases if c["label"]==lab][:40]:
        print(f"  {c['id']:7s} {c.get('ratio','')} {c.get('first','')} | {c['text'].splitlines()[0][:120]}")
