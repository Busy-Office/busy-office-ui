"""Simulate rule M over the pasted slices: oldest dispatchable M1 item first
(slice, then item), owner-route items never dispatched (the owner closes them
at a chosen moment), every dispatched item closes in one dispatch.
Reports: dispatch order, where the first design-route item lands, After cycles,
and which non-owner items 397.2's After omits.
Usage: python3 simulate_rule_m.py <roadmap.md> [--owner-closes id,id,...] [--red-cycle]
The owner closes the listed owner items as soon as they become the only thing left
(default: all owner items except 394.16, closed up front)."""
import re, sys
path = sys.argv[1]
text = open(path, encoding='utf-8').read()
if '--red-cycle' in sys.argv:  # red-proof: inject a cycle 393.1 -> 393.10
    text = text.replace('       Route: build\n       - **Accept — the property.**\n         - **HALT file.**',
                        '       Route: build\n       After: 393.10\n       - **Accept — the property.**\n         - **HALT file.**', 1)
lines = text.split('\n')
starts = [i for i, l in enumerate(lines) if re.match(r'^\s*\d+\.\s*\[ \]', l)]
heads = [i for i, l in enumerate(lines) if l.startswith('## ')]
items = {}
for s in starts:
    end = min([j for j in starts + heads if j > s] + [len(lines)])
    body = '\n'.join(lines[s:end])
    iid = re.match(r'^\s*\d+\.\s*\[ \]\s*\*\*(\d+\.\d+)', lines[s]).group(1)
    route = re.search(r'^\s*Route: (\S+)', body, re.M).group(1)
    after = []
    for a in re.findall(r'^\s*After: (.+)$', body, re.M):
        after += [x.strip() for x in a.split(',')]
    items[iid] = dict(route=route, after=after)
raw = len(re.findall(r'^\s*\d+\.\s*\[ \]', text, re.M))
assert raw == len(items), f'raw {raw} != parsed {len(items)}'
key = lambda i: tuple(int(x) for x in i.split('.'))
# cycle check (DFS)
state = {}
def dfs(n, stack):
    state[n] = 1
    for m in items[n]['after']:
        if m not in items: continue
        if state.get(m) == 1: raise SystemExit(f'CYCLE: {" -> ".join(stack + [n, m])}')
        if state.get(m) is None: dfs(m, stack + [n])
    state[n] = 2
for n in sorted(items, key=key):
    if state.get(n) is None: dfs(n, [])
owner = [i for i in items if items[i]['route'] == 'owner']
keep_open = {'394.16'}
# The owner closes an owner item as soon as its own After: targets are closed
# (the fastest owner). The first version closed them all up front, which let
# 396.6-396.10 run before 396.5 -- an artefact of the simulator, not the plan.
closed = set()
order = []
ready = lambda i: all(t in closed or t not in items for t in items[i]['after'])
while True:
    changed = True
    while changed:
        changed = False
        for i in owner:
            if i not in closed and i not in keep_open and ready(i):
                closed.add(i); order.append(f'({i})'); changed = True
    cand = [i for i in items if i not in closed and items[i]['route'] != 'owner' and ready(i)]
    if not cand: break
    pick = min(cand, key=key)
    order.append(pick); closed.add(pick)
left = [i for i in items if i not in closed]
print(f'{len(items)} items, {len(owner)} owner-route; no cycle')
print('dispatch order:', ' '.join(order))
disp = [i for i in order if not i.startswith('(')]
fd = next((k for k, i in enumerate(disp) if items[i]['route'] == 'design'), None)
print(f'first design-route item: {disp[fd]} at dispatch #{fd+1}; before it: {" ".join(disp[:fd])}')
print('(owner closes shown in parentheses)')
print('never dispatched (blocked):', ' '.join(sorted(left, key=key)))
exit_after = set(items.get('397.2', {}).get('after', []))
omitted = sorted([i for i in items if i != '397.2' and i not in exit_after], key=key)
print("397.2's After omits:", ' '.join(omitted))
