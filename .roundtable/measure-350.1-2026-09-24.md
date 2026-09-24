# 350.1 — should rule 2 test for lane input? The measurement (2026-09-24)

Slice 350's recorded command (windows between consecutive Standardize commits,
`a..b^` per 351.1), extended with Slice 357's per-lane split and a count of the
windows where lane 4's files changed. Run from the repository root.

```python
import re, subprocess
def sh(*a): return subprocess.run(a, capture_output=True, text=True).stdout
order = sh('git','rev-list','--first-parent','HEAD').split()
pos = {c: i for i, c in enumerate(order)}
full = {c[:n]: c for c in order for n in (7, 8, 9, 10, 40)}
std, seen = [], set()
for line in open('.roundtable/loop-log.md'):
    if line.startswith('- ') and ' · Standardize · ' in line:
        m = re.search(r' · ([0-9a-f]{7,40})\s*$', line.rstrip())
        if m and full.get(m.group(1)) and full[m.group(1)] not in seen:
            seen.add(full[m.group(1)]); std.append(full[m.group(1)])
std.sort(key=lambda c: -pos[c])
INPUTS = ('packages/core/src/css/', 'apps/docs/src/')
CORE, DOCS = 'packages/core/src/css/', 'apps/docs/src/'
INSTR = ('apps/docs/scripts/scan-dead-style.mjs',
         'apps/docs/scripts/report-prose.mjs',
         'packages/core/scripts/report-css-repeats.mjs')
noin = noboth = span = 0; buckets = {'neither':0,'core_only':0,'docs_only':0,'both':0}; last=[]
for a, b in zip(std, std[1:]):
    revs = sh('git','rev-list','--first-parent',f'{a}..{b}^').split()
    files = {f for c in revs for f in sh('git','show','--name-only','--format=',c).split('\n') if f}
    span += len(revs)
    hi = any(f.startswith(INPUTS) for f in files)
    noin += not hi
    noboth += not hi and not any(f in INSTR for f in files)
    c = any(f.startswith(CORE) for f in files); d = any(f.startswith(DOCS) for f in files)
    k = 'both' if c and d else 'core_only' if c else 'docs_only' if d else 'neither'
    buckets[k] += 1; last.append((b[:8], k, len(revs)))
n = len(std)-1
print(n, 'windows;', noin, f'with no lane input change ({100*noin/n:.1f}%);', noboth, 'with no input AND no instrument change; span', span)
print('per lane:', buckets, '-> lanes 1+3 blind on', buckets['neither'], f"({100*buckets['neither']/n:.1f}%), lane 2 blind on", buckets['neither']+buckets['docs_only'], f"({100*(buckets['neither']+buckets['docs_only'])/n:.1f}%)")
print('last 8 windows:', last[-8:])
LOOPF = ('LOOPS.md', '.roundtable/RESUME.md', '.roundtable/ENVIRONMENT.md', 'ROADMAP.md',
         'CLAUDE.md', 'DESIGN.md', 'LOOPS-archive.md', 'ROADMAP-archive.md')
INSTR4 = INSTR + ('scripts/loops/report_loop_prose.py',)
nothing = []; loopy = 0
for a, b in zip(std, std[1:]):
    revs = sh('git','rev-list','--first-parent',f'{a}..{b}^').split()
    files = {f for c in revs for f in sh('git','show','--name-only','--format=',c).split('\n') if f}
    lp = any(f in LOOPF for f in files); loopy += lp
    if not any(f.startswith(INPUTS) for f in files) and not lp and not any(f in INSTR4 for f in files):
        nothing.append((b[:8], len(revs)))
print('a loop-read file changed in', loopy, 'windows; nothing to read in any lane:', nothing)
```

Output at HEAD `03485ac9` plus 350.1's edits (its `last 8 windows` line omitted):

```
147 windows; 21 with no lane input change (14.3%); 19 with no input AND no instrument change; span 2001
per lane: {'neither': 21, 'core_only': 8, 'docs_only': 40, 'both': 78} -> lanes 1+3 blind on 21 (14.3%), lane 2 blind on 61 (41.5%)
a loop-read file changed in 136 windows; nothing to read in any lane: [('534f55ca', 0), ('2d6823d9', 0), ('cdd7c07e', 0), ('36477d72', 0), ('0768f09f', 0), ('dd482f37', 0), ('69cadcbb', 0), ('9198e43f', 1), ('574a8634', 0), ('dc861a25', 0), ('ce10de0d', 1)]
```

Every window with nothing to read in any lane is 0 or 1 commits wide: a second
round of one sweep, not a separate rule-2 dispatch.
