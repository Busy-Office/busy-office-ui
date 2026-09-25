#!/usr/bin/env python3
"""Seat A instrument: how many PUBLISHED names in busy-office-ui carry a
module / department / process-area token?  Read-only.

Published names scanned:
  - every .bo-* class in packages/core/dist/api.json (classes, parts, modifiers)
  - every CSS custom property --bo-* in dist css
  - every component dir under packages/core/src/css/components
  - every pattern slug in apps/docs/src/data/patterns.json
  - every docs page slug under apps/docs/src/pages
  - every behaviour name in packages/core/dist/behaviors.json

Tokens = split on '-', '_', '.', '/'.  A hit = a token in MODULE_TERMS.
--self-test injects known-bad names and asserts they are caught (red-proof),
and asserts known shape names are NOT caught.
"""
import json, os, re, sys, glob

ROOT = '/Users/thepfmind/Projects/busy-office-ui'

# Module / department / process-area vocabulary, drawn from THREE sources the
# owner has actually used (measured, not invented):
#   examples/erp-suite/_shell.mjs MODULES ids+labels
#   the owner's 2026-09-25 list
#   busy-office-erp/reference-apps/* dir names + its README "Not here" line
MODULE_TERMS = {
    'finance', 'fin', 'sales', 'o2c', 'p2p', 'crm', 'inv', 'inventory', 'prod',
    'production', 'procurement', 'purchasing', 'distribution', 'logistics',
    'manufacturing', 'hr', 'payroll', 'wms', 'tms', 'ap', 'ar', 'gl', 'treasury',
    'accounting', 'ledger', 'warehouse', 'mrp', 'pp', 'mm', 'sd', 'fico',
    'order-to-cash', 'procure-to-pay', 'hire-to-retire',
}

def tokens(name):
    return [t for t in re.split(r'[-_./]+', name.lower()) if t]

def hits(names):
    out = []
    for n in names:
        tk = tokens(n)
        bad = [t for t in tk if t in MODULE_TERMS]
        # multi-token process names
        joined = '-'.join(tk)
        for p in ('order-to-cash', 'procure-to-pay', 'hire-to-retire'):
            if p in joined:
                bad.append(p)
        if bad:
            out.append((n, sorted(set(bad))))
    return out

def collect():
    names = {}
    api = json.load(open(f'{ROOT}/packages/core/dist/api.json'))
    cls = set(re.findall(r'bo-[a-z0-9_-]+', json.dumps(api)))
    names['api.json classes/parts/modifiers'] = sorted(cls)
    props = set()
    for f in glob.glob(f'{ROOT}/packages/core/dist/css/**/*.css', recursive=True):
        props |= set(re.findall(r'--bo-[a-z0-9-]+', open(f).read()))
    names['--bo-* custom properties'] = sorted(props)
    names['component dirs'] = sorted(os.listdir(f'{ROOT}/packages/core/src/css/components'))
    pj = json.load(open(f'{ROOT}/apps/docs/src/data/patterns.json'))
    names['pattern slugs'] = [t['href'].rstrip('/').split('/')[-1] for g in pj['groups'] for t in g['tiles']]
    pages = []
    for f in glob.glob(f'{ROOT}/apps/docs/src/pages/**/*.astro', recursive=True):
        pages.append(os.path.relpath(f, f'{ROOT}/apps/docs/src/pages')[:-6])
    names['docs page slugs'] = sorted(pages)
    beh = json.load(open(f'{ROOT}/packages/core/dist/behaviors.json'))
    bnames = set(re.findall(r'"(init[A-Z][A-Za-z]+|refresh[A-Z][A-Za-z]+)"', json.dumps(beh)))
    # camelCase -> kebab for tokenising
    names['behaviours'] = sorted(re.sub(r'(?<!^)([A-Z])', r'-\1', b).lower() for b in bnames)
    return names

def main():
    if '--self-test' in sys.argv:
        bad = ['bo-finance-layout', 'bo-sales-workspace__kpi', 'patterns/order-to-cash',
               'bo-dispatch--distribution', 'init-procurement-board', '--bo-hr-accent']
        good = ['bo-list-report', 'bo-object-page', 'goods-receipt', 'rf-putaway',
                'bo-approval-workflow', 'reconciliation', 'timesheet', 'bo-amount',
                'bo-app-shell', 'bo-tree-table__row', 'bo-card', 'bo-badge--warning',
                'bo-prose', 'bo-dropdown', 'arrow', 'bo-dialog--wide']
        caught = hits(bad)
        false_pos = hits(good)
        assert len(caught) == len(bad), f'missed: {set(bad) - {c for c, _ in caught}}'
        assert not false_pos, f'false positives: {false_pos}'
        print(f'self-test OK: {len(caught)}/{len(bad)} injected module names caught, '
              f'0/{len(good)} shape names flagged')
        return
    names = collect()
    total = 0
    for k, v in names.items():
        h = hits(v)
        total += len(v)
        print(f'{k:36s} {len(v):5d} names   {len(h):3d} hits  {h[:6]}')
    print(f'TOTAL {total} published names scanned')

if __name__ == '__main__':
    main()
