# 349.1 — rule 3 under both readings: the replay (2026-09-24)

Rule 3 said *slices closed*; its counter counts slices a building row named. This
replays every past Objective dispatch and asks, at the commit before each grill,
how many of its arming set were actually closed in `ROADMAP.md`. It reuses
`dispatch_status.py`'s own `rows()`, `slice_of` and `CLOSES_A_SLICE`, so the
arming sets are the counter's, not a re-implementation. Run from the
repository root.

```python
"""349.1: what rule 3's counter read at every past Objective dispatch, under the TOUCHED reading
(what dispatch_status counts) and the CLOSED reading (what the rule's text says)."""
import re, sys, subprocess, collections
sys.path.insert(0, 'scripts/loops')
from dispatch_status import rows, slice_of, CLOSES_A_SLICE
R = rows()
cat = subprocess.Popen(['git', 'cat-file', '--batch'], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
def blob(spec):
    cat.stdin.write((spec + '\n').encode()); cat.stdin.flush()
    h = cat.stdout.readline().split()
    if len(h) < 3 or h[1] == b'missing': return None
    d = cat.stdout.read(int(h[2])); cat.stdout.read(1); return d.decode('utf-8', 'replace')
def open_slices(src):
    cur = None; op = set(); present = set()
    for l in src.split('\n'):
        h = re.match(r'^## Slice (\d+)\b', l)
        if h: cur = h.group(1); present.add(cur); continue
        if cur and re.match(r'^\s*\d+\. \[ \]', l): op.add(cur)
    return op, present
last = None; out = []
for i, r in enumerate(R):
    if r['loop'] != 'Objective': continue
    window = R[(last + 1 if last is not None else 0):i]; last = i
    armed = sorted({s for w in window if w['loop'] in CLOSES_A_SLICE for s in [slice_of(w['item'])] if s}, key=int)
    m = re.search(r'· ([0-9a-f]{7,40})\s*$', r['item'])
    sha = m.group(1) if m else None
    src = blob(f'{sha}^:ROADMAP.md') if sha else None
    if src is None:
        out.append((r['at'], armed, None, None)); continue
    op, present = open_slices(src)
    still_open = [s for s in armed if s in op]
    out.append((r['at'], armed, still_open, sha))
known = [o for o in out if o[2] is not None]
print(f'{len(out)} Objective rows; {len(known)} with a readable commit')
touched3 = [o for o in known if len(o[1]) >= 3]
closed3 = [o for o in known if len(o[1]) - len(o[2]) >= 3]
anyopen = [o for o in known if o[2]]
print(f'armed with >=3 touched slices: {len(touched3)}; of those, >=3 were CLOSED at dispatch: {sum(1 for o in touched3 if len(o[1])-len(o[2])>=3)}')
print(f'dispatches whose arming set held at least one still-open slice: {len(anyopen)} of {len(known)}')
tot_armed = sum(len(o[1]) for o in known); tot_open = sum(len(o[2]) for o in known)
print(f'armed slices in total {tot_armed}, of them still open at dispatch {tot_open} ({100*tot_open/max(1,tot_armed):.1f}%)')
print('last 10:')
for o in known[-10:]: print('  ', o[0], 'armed', o[1], 'open', o[2])
```

Output on 2026-09-24 (HEAD `bc79e235` plus 349.1's edits):

```
107 Objective rows; 103 with a readable commit
armed with >=3 touched slices: 72; of those, >=3 were CLOSED at dispatch: 42
dispatches whose arming set held at least one still-open slice: 48 of 103
armed slices in total 333, of them still open at dispatch 80 (24.0%)
```

Spot-check against the record: the 2026-09-08 10:59 row reads armed `[324,
325, 347, 350]`, open `[325, 350]`, which is the "2 of 4 open" 349.1 wrote down
at the time. **Not covered:** which of the 31 dispatches that armed on fewer
than three touched slices were owner-requested grills; the log does not say.
