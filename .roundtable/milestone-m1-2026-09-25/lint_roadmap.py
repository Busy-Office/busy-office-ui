"""Lint the redrafted slices before they reach ROADMAP.md. Run from the repo root:
  python3 <scratch>/lint_roadmap.py <scratch>/realigned_roadmap.md [--red-route|--red-after|--red-accept]
Checks (each counted against the RAW text, not a list handed in):
  - every raw `N. [ ]` line parses to an item id; ids unique
  - every item has exactly one `Milestone: M1 · Phase: n`, one `Route:` in ROUTES, one Accept
  - every `After:` target is an id defined here or an OPEN id in ROADMAP.md
  - today's generate_status owner regex flags exactly the Route: owner items (no misfiles)"""
import re, sys
ROUTES = {'build','design','mechanical','collect','research','planner','owner'}
path = sys.argv[1]; text = open(path, encoding='utf-8').read()
def inject(text, old, new):
    # critic fix: the first run's --red-route replaced a PROSE mention and came back green.
    # Anchor on the item line and assert exactly one match, so an injection that misses fails loudly.
    n = text.count(old)
    if n != 1: raise SystemExit(f'INJECTION MISSED: {old!r} matched {n} times')
    return text.replace(old, new)
if '--red-route' in sys.argv: text = inject(text, '\n       Route: design\n       After: 396.13\n       - **Accept — the property.** The slice\'s common Accept holds, in the form\n         the owner chose', '\n       Route: layout\n       After: 396.13\n       - **Accept — the property.** The slice\'s common Accept holds, in the form\n         the owner chose')
if '--red-after' in sys.argv: text = inject(text, '       After: 393.11\n', '       After: 393.99\n')
if '--red-accept' in sys.argv: text = inject(text, '**Accept — the property.** `record_iteration.py --outcome landed`', 'The close: `record_iteration.py --outcome landed`')
roadmap = open('ROADMAP.md', encoding='utf-8').read()
open_ids = set(re.findall(r'^\s*\d+\.\s*\[ \]\s*\*\*(?:OWNER · )?(\d+\.\d+)', roadmap, re.M))
lines = text.split('\n')
starts = [i for i, l in enumerate(lines) if re.match(r'^\s*\d+\.\s*\[ \]', l)]
heads = [i for i, l in enumerate(lines) if l.startswith('## ')]
raw = len(starts); items = {}; errs = []
for s in starts:
    end = min([j for j in starts + heads if j > s] + [len(lines)])
    body = '\n'.join(lines[s:end])
    m = re.match(r'^\s*\d+\.\s*\[ \]\s*\*\*(\d+\.\d+)', lines[s])
    if not m: errs.append(f'unparsed item line {s+1}'); continue
    iid = m.group(1)
    if iid in items: errs.append(f'duplicate id {iid}')
    items[iid] = body
if len(items) != raw: errs.append(f'raw {raw} items, parsed {len(items)}')
all_ids = set(items)
for iid, body in items.items():
    ms = re.findall(r'^\s*Milestone: M1 · Phase: [0-3]\s*$', body, re.M)
    rs = re.findall(r'^\s*Route: (\S+)\s*$', body, re.M)
    acc = re.findall(r'\*\*Accept — the property\.\*\*', body)
    if len(ms) != 1: errs.append(f'{iid}: {len(ms)} Milestone lines')
    if len(rs) != 1 or rs[0] not in ROUTES: errs.append(f'{iid}: Route {rs}')
    if len(acc) != 1: errs.append(f'{iid}: {len(acc)} Accept blocks')
    for a in re.findall(r'^\s*After: (.+)$', body, re.M):
        for t in [x.strip() for x in a.split(',')]:
            if t not in items and t not in open_ids and t not in all_ids:
                errs.append(f'{iid}: After target {t} unresolved')
    owner_now = bool(re.search(r"BLOCKED ON|OWNER CALL|NEEDS-RUNTIME|BLOCKED\b", body))
    if owner_now != (rs[:1] == ['owner']): errs.append(f'{iid}: today\'s owner regex says {owner_now}, Route says {rs}')
counts = {r: sum(1 for b in items.values() if re.search(r'^\s*Route: ' + r + r'\s*$', b, re.M)) for r in sorted(ROUTES)}
print(f'raw items {raw}, parsed {len(items)}; routes: {counts}')
if errs:
    print('LINT FAILED'); [print('  -', e) for e in errs]; sys.exit(1)
print('lint clean')
