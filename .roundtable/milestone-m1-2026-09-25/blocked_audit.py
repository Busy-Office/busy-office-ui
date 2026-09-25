# The wide-marker audit (milestone grill round 2, 2026-09-25; committed by
# 393.3, which the draft said P5 had done and it had not). It extracts item
# bodies on its own and flags them with a deliberately WIDE regex, then
# compares with what generate_status.py flags. Usage, from the repo root:
#   python3 .roundtable/milestone-m1-2026-09-25/blocked_audit.py [--roadmap PATH]
# `--roadmap` replays it on another ROADMAP.md, e.g. `git show <sha>:ROADMAP.md`.
# To re-run the BEFORE figure, put the old parser first on the path:
#   git show b69129d0:scripts/loops/generate_status.py > /tmp/old/generate_status.py
#   cp scripts/loops/{_common,rebuild_from_log}.py scripts/loops/schema.sql /tmp/old/
#   PYTHONPATH=/tmp/old python3 .../blocked_audit.py --roadmap <(git show b69129d0:ROADMAP.md)
# The audit cannot flag an item that carries NO marker (374.4 was found by
# reading it), and it flags a marker quoted in code (393.3's own Accept),
# which it labels.
import re,sys
sys.path.append('scripts/loops')  # appended, so PYTHONPATH (an old parser) wins
import generate_status as gs
path=sys.argv[sys.argv.index('--roadmap')+1] if '--roadmap' in sys.argv else 'ROADMAP.md'
try:
    items=gs.open_items(path)
except TypeError:
    # A parser from before 393.3 takes no path; point its constant at the file
    # instead, so the audit can re-run the 'before' figure it was written for.
    gs.ROADMAP=path; items=gs.open_items()
text=open(path).read()
# independent body extraction: from item line to next numbered item or heading
lines=text.split('\n')
bodies={}
idx=[i for i,l in enumerate(lines) if re.match(r'^\s*\d+\. \[[ x]\]',l)]
heads=[i for i,l in enumerate(lines) if l.startswith('#')]
for i,l in enumerate(lines):
    m=re.match(r'^\s*\d+\. \[ \] (.*)',l)
    if not m: continue
    nxt=min([j for j in idx if j>i]+[j for j in heads if j>i]+[len(lines)])
    body=' '.join(x.strip() for x in lines[i:nxt])
    im=re.search(r'(\d{2,3}\.\d+[a-z]?)',m.group(1)[:40])
    key=im.group(1) if im else m.group(1).lstrip('*')[:30]
    bodies[key]=body
wide=re.compile(r'OWNER\s+(OR\s+\w+\s+)?CALL|OWNER\s*·|BLOCKED\s+ON|NEEDS-RUNTIME|BLOCKED\b|OWNER-BLOCKED')
gs_flag={ (iid or t[:30]):b for _,iid,t,b in items}
print('open parsed by generate_status:',len(items),' raw bodies:',len(bodies))
print('%-10s %-6s %-6s %s'%('item','gs','wide','marker found'))
diff=0
for k,b in bodies.items():
    g=gs_flag.get(k)
    if g is None:
        # match title key
        g=[v for kk,v in gs_flag.items() if kk.startswith(k[:10])]
        g=g[0] if g else None
    w=bool(wide.search(b))
    mk=wide.search(b).group(0) if w else ''
    code_only=w and not wide.search(re.sub(r'`[^`]+`',' ',b))
    if g!=w or w:
        print('%-10s %-6s %-6s %s%s'%(k[:10],g,w,mk.replace('\n',' '),'   (only inside `code`)' if code_only else ''))
    if g!=w: diff+=1
print('disagreements:',diff)
