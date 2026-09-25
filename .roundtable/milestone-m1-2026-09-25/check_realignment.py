"""393.9: the regenerated STATUS.md and the parsed markers, checked against the
realignment table (Slice 393's preamble), re-counted rather than trusted."""
import re, sys, subprocess
R = subprocess.run(["git", "rev-parse", "--show-toplevel"], capture_output=True, text=True).stdout.strip()
sys.path.insert(0, R + "/scripts/loops"); import generate_status as gs
FOLD = {'392.5':'394.11','377.10':'394.12','249.7':'394.9','376.5':'395.1','389.14':'395.1'}
for x in ['389.1','389.2','389.5','389.6','389.7','389.8','389.9','389.10','389.11','389.12','389.13','389.15','389.17','389.18','389.20','389.21','389.22']: FOLD[x] = '396.12'
M0 = {'377.3': '393.11'}
DEF = {'392.2','392.3','389.3','389.16','389.19','389.23','389.24','388.3','388.4','387.1','387.2','386.1','377.4','377.8','377.11','375.11'}
PARK = {'391.1','384.1','376.7','381.1','377.7','377.9','377.12','377.13','377.14'}
OWN = {'377.5','377.6','373.6','112.3','112.4','374.4','373.8','369.1','296.3','273.2','249.10','249.11','249.12','249.13'}
items = {it['id'] or it['title']: it for it in gs.roadmap_items()}
bad = []
outside = {k: it for k, it in items.items() if not (it['slice'].isdigit() and 393 <= int(it['slice']) <= 397)}
table = set(FOLD) | set(M0) | DEF | PARK | OWN | {'AT runtime evidence'}
if set(outside) != table:
    bad.append(f"open outside 393-397 != table: extra {sorted(set(outside)-table)}, missing {sorted(table-set(outside))}")
for iid, it in outside.items():
    want_ms = 'M1' if iid in FOLD or iid in M0 else ''
    if it['milestone'] != want_ms: bad.append(f"{iid}: Milestone {it['milestone']!r}, want {want_ms!r}")
    if iid in FOLD:
        a = items[FOLD[iid]]
        if (it['phase'], it['route']) != (a['phase'], a['route']): bad.append(f"{iid}: phase/route {it['phase']}/{it['route']} != absorbing {a['phase']}/{a['route']}")
        if FOLD[iid] not in it['after']: bad.append(f"{iid}: no After: {FOLD[iid]}")
    if iid in M0 and (it['phase'], it['route'], M0[iid] in it['after']) != ('0', 'build', True): bad.append(f"{iid}: M0 markers wrong")
    if (it['track'] == 'defect') != (iid in DEF): bad.append(f"{iid}: Track {it['track']!r}")
    if bool(it['parked']) != (iid in PARK): bad.append(f"{iid}: Parked {it['parked']!r}")
    if iid in OWN and not it['owner']: bad.append(f"{iid}: owner-blocked item not flagged")
    if iid not in FOLD and iid not in M0 and it['route']: bad.append(f"{iid}: unexpected Route {it['route']}")
status = open(R + "/STATUS.md", encoding="utf-8").read()
park_sec = re.search(r"^## Parked\n(.*?)^## ", status, re.M | re.S).group(1)
listed = set(re.findall(r"^- (\d+\.\d+) — M1, not held$", park_sec, re.M))
if listed != PARK: bad.append(f"STATUS Parked lists {sorted(listed)}, want {sorted(PARK)} (all 'not held' while DRAFT)")
dep_sec = re.search(r"^## Dependency-blocked\n(.*?)^## ", status, re.M | re.S).group(1)
for iid, tgt in {**FOLD, **M0}.items():
    if not re.search(rf"^- {re.escape(iid)} — after .*\b{re.escape(tgt)}\b", dep_sec, re.M):
        bad.append(f"STATUS Dependency-blocked does not show {iid} after {tgt}")
prog = re.search(r"^## Milestone progress\n(.*?)^## ", status, re.M | re.S).group(1)
tagged = {}
for it in items.values():
    if it['milestone'] == 'M1': tagged[it['phase']] = tagged.get(it['phase'], 0) + 1
for ph, n in tagged.items():
    m = re.search(rf"Phase {ph}: (\d+) of (\d+) closed|Phase {ph}: done", prog)
    if not m or (m.group(2) and int(m.group(2)) - int(m.group(1)) != n):
        bad.append(f"STATUS progress Phase {ph} does not show {n} open")
print(f"open outside 393-397: {len(outside)} = table {len(table)}; folded {len(FOLD)}, M0 {len(M0)}, defect {len(DEF)}, parked {len(PARK)}, owner {len(OWN)} + AT runtime")
print("CHECK FAILED:\n  " + "\n  ".join(bad) if bad else "every item carries exactly its disposition's markers, and STATUS.md agrees")
sys.exit(1 if bad else 0)
