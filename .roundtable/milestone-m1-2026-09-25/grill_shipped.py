#!/usr/bin/env python3
"""381.2 base rate — of the last N Objective grills, how many had armed subjects
that changed NO shipped artefact (0 lines under packages/ + apps/docs/src).

Read-only against the repo. Usage:
    python3 grill_shipped.py [--rev HEAD] [--n 20] [--paths packages/ apps/docs/src]
    python3 grill_shipped.py --redproof      # the two known cases, must be 0 and >0

Method
  1. Rows: every `- <ts> · Objective · grill · <item> · <outcome> · <sha>` line
     of .roundtable/loop-log.md at --rev, in file order. The parsed count is
     reconciled against a raw count of the same prefix in the file.
  2. Exclusions (explicit, printed): a row whose item is not a grill of named
     slices (a design-grill of a journey), and a row that re-records a grill id
     already counted (a collision loser's amendment).
  3. Subjects: regex over the row text after "grill of" (or the leading id list
     when there is no "grill of"), cut at the first ':' ';' '(' ' — '. Ranges
     expand. SUBJECT_EXTRA adds ids the grill's own report header names and the
     row does not.
  4. Grill commit: the row's sha when its subject says grill; else GRILL_COMMIT
     (hand-resolved, printed). Only ANCESTORS of the grill commit's parent can
     be a subject's landing commit — an item N.x filed and landed after the
     grill was not armed by it.
  5. Landing commits: `git log --format='%H %s' <grill>^`, minus
     chore(loops)/chore(resume); a commit lands subject S when an id in its
     LEADING id list (after an optional Slice/Roadmap/P0/mark prefix or
     fix(/docs(/refuse(/grill( wrapper) is S (item) or has integer part S (slice).
     SECONDARY (reported, not counted): "Slice M — N.x" / "Slice M: N.x", i.e.
     an item of S landed under another slice's label.
  6. Lines: `git diff --numstat <c>^ <c> -- <paths>`, added+deleted, summed over
     every landing commit of every subject. Binary entries count 0 lines and
     are flagged.
"""
import os
import subprocess
import argparse, re, subprocess, sys
from collections import OrderedDict

REPO = subprocess.check_output(['git', 'rev-parse', '--show-toplevel'], text=True,
                               cwd=os.path.dirname(os.path.abspath(__file__))).strip()
LOG = '.roundtable/loop-log.md'

# Hand-resolved grill commits, each because the row's own sha is not the grill.
GRILL_COMMIT = {
    # Slice 330's row carries 8ef9b944 = "Slice 329: 249.9 — ..." (a SUBJECT's own
    # landing commit; using it as the cutoff would drop Slice 329 from its own grill).
    '8ef9b944': '19fc0045',
    # The "grill of 297" row carries 69e43460 = a chore(loops) record commit;
    # the grill landed as 0ba54bab "Slice 337 — 297 counted the escape hatch ...".
    '69e43460': '0ba54bab',
    # Slice 336's row carries 86f034ce, a follow-up ("record collision 4");
    # the grill itself is 49467ad5 "Slice 336: Objective grill of 315, 332, 333".
    '86f034ce': '49467ad5',
}
# Ids a grill's report header names and its row text does not.
SUBJECT_EXTRA = {
    # grill-objective-388-389-390: "389 is item 389.4 (1b19d6e9, with 389.25
    # closed in 388.1's commit)" — commit e8ac9844 also names 389.25.
    'e8ac9844': ['389.25'],
}
EXCLUDE_PATTERNS = [
    (re.compile(r'design-grill'), 'a design-grill of a journey (flow mode), not a grill of named slices'),
    (re.compile(r'^Slice \d+ amended'), 're-records a grill id already counted: the collision loser of the same grill, same subjects'),
]

ID = r'\d+(?:\.\d+)?'
LEAD = re.compile(
    r'^(?:(?:Slice|Slices|Roadmap|P0|mark|Close)\s+|(?:fix|docs|refuse|grill|feat)\()?'
    r'(' + ID + r'(?:\s*(?:,|/|\+|and|-|&)\s*' + ID + r')*)(?![\d.])')
SECOND = re.compile(r'^(?:Slice|Roadmap)\s+' + ID + r'(?:\s+\w+)?\s*(?::|—|-)\s*(?:P0\s+)?'
                    r'(' + ID + r'(?:\s*(?:,|/|\+|and|-)\s*' + ID + r')*)(?![\d.])')


def git(*a):
    return subprocess.run(['git', '-C', REPO, *a], capture_output=True, text=True, check=True).stdout


def ids_in(s):
    return re.findall(ID, s)


def parse_rows(rev):
    text = git('show', f'{rev}:{LOG}')
    raw = sum(1 for ln in text.splitlines() if re.match(r'^- \S+ \S+ · Objective · grill · ', ln))
    rows, every = [], []
    for n, ln in enumerate(text.splitlines(), 1):
        if not ln.startswith('- '):
            continue
        f = ln[2:].split(' · ')
        if len(f) < 6:
            continue
        row = dict(line=n, ts=f[0], loop=f[1], mode=f[2], item=' · '.join(f[3:-2]), outcome=f[-2], sha=f[-1].strip())
        every.append(row)
        if f[1] == 'Objective' and f[2] == 'grill':
            rows.append(row)
    if len(rows) != raw:
        sys.exit(f'RECONCILE FAIL: {raw} raw Objective grill rows, {len(rows)} parsed')
    return rows, raw, every


def subjects_of(item):
    m = re.search(r'grill of (.*)', item)
    seg = m.group(1) if m else item.split(' — ')[0]
    seg = re.split(r'[:;(]| — | lost ', seg)[0]
    out = []
    for a, b in re.findall(r'(' + ID + r')(?:\s*-\s*(' + ID + r'))?', seg):
        if b and '.' not in a and '.' not in b:
            out += [str(i) for i in range(int(a), int(b) + 1)]
        else:
            out += [a] + ([b] if b else [])
    return list(OrderedDict.fromkeys(out))


def grill_id(subject_line):
    m = re.match(r'^(?:Slice\s+)?(\d+)', subject_line)
    return m.group(1) if m else '?'


def belongs(cid, subj):
    return cid == subj if '.' in subj else cid.split('.')[0] == subj


def numstat(c, paths):
    out = git('diff', '--numstat', f'{c}^', c, '--', *paths)
    lines, files, binary = 0, 0, 0
    for ln in out.splitlines():
        a, d, _p = ln.split('\t', 2)
        files += 1
        if a == '-':
            binary += 1
        else:
            lines += int(a) + int(d)
    return lines, files, binary


ROW_LEAD = re.compile(r'^(?:(?:Slice|P0)\s+)?(' + ID + r'(?:\s*(?:,|/|\+|and|-|&)\s*' + ID + r')*)(?![\d.])')


def row_commits(all_rows, grill_line, subj, anc):
    """JOIN 2 (added after the start-of-subject join missed 342.1 -> 161ede68):
    loop-log rows BEFORE the grill row, in a loop other than Meta/Roadmap/Objective,
    whose item's leading id belongs to the subject; the row's sha, when it resolves
    to an ancestor of the grill's parent. This is the row that ARMED the counter."""
    out = []
    for r in all_rows:
        if r['line'] >= grill_line or r['loop'] in ('Meta', 'Roadmap', 'Objective'):
            continue
        m = ROW_LEAD.match(r['item'])
        if not m or not any(belongs(i, subj) for i in ids_in(m.group(1))):
            continue
        full = anc.get(r['sha'][:7])
        out.append((r['line'], r['sha'], full))
    return out


def measure(grill_sha, subjects, paths, all_rows=None, grill_line=None):
    history = git('log', '--format=%h %s', f'{grill_sha}^').splitlines()
    history = [h.split(' ', 1) for h in history]
    anc = {h[:7]: h for h, _ in history}
    subj_of = {h: s for h, s in history}
    history = [(h, s) for h, s in history if not re.match(r'chore\((loops|resume)\)', s)]
    per = OrderedDict()
    for subj in subjects:
        prim, sec, rowj, unresolved, mention = [], [], [], [], []
        pat = re.compile(r'(?<![\d.])' + re.escape(subj) + (r'(?:\.\d+)?' if '.' not in subj else '') + r'(?![\d])')
        for h, s in history:
            m = LEAD.match(s)
            if m and any(belongs(i, subj) for i in ids_in(m.group(1))):
                prim.append((h, s))
                continue
            m2 = SECOND.match(s)
            if m2 and any(belongs(i, subj) for i in ids_in(m2.group(1))):
                sec.append((h, s))
            elif pat.search(s):
                mention.append((h, s))
        if all_rows is not None:
            have = {h for h, _ in prim}
            for line, rsha, full in row_commits(all_rows, grill_line, subj, anc):
                if full is None:
                    unresolved.append((line, rsha))
                elif re.match(r'chore\((loops|resume)\)', subj_of[full]):
                    continue
                elif full not in have:
                    have.add(full)
                    rowj.append((full, f'[log line {line}] ' + subj_of[full]))
        mention = [(h, s) for h, s in mention if h not in {x for x, _ in rowj}]
        per[subj] = dict(
            prim=[(h, s, *numstat(h, paths)) for h, s in prim],
            row=[(h, s, *numstat(h, paths)) for h, s in rowj],
            sec=[(h, s, *numstat(h, paths)) for h, s in sec],
            mention=[(h, s, *numstat(h, paths)) for h, s in mention],
            unresolved=unresolved)
    return per


CLOSES_A_SLICE = ('Continue', 'Standardize', 'Polish')   # scripts/loops/dispatch_status.py:249


def armed_rows(every, grill_line, grill_sha, paths):
    """CROSS-CHECK, not the headline: what rule 3 armed on, at the time — rows in
    CLOSES_A_SLICE between the previous Objective row (file order) and this one,
    their shas' lines under paths. Blind where a collision put two dispatchers'
    windows out of file order."""
    prev = max((r['line'] for r in every if r['loop'] == 'Objective' and r['line'] < grill_line), default=0)
    win = [r for r in every if prev < r['line'] < grill_line and r['loop'] in CLOSES_A_SLICE]
    anc = {h[:7]: h for h in git('log', '--format=%h', f'{grill_sha}^').split()}
    shas, bad = [], []
    for r in win:
        full = anc.get(r['sha'][:7])
        (shas if full else bad).append(full or r['sha'])
    shas = list(OrderedDict.fromkeys(shas))
    return win, sum(numstat(h, paths)[0] for h in shas), bad


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--rev', default='HEAD')
    ap.add_argument('--n', type=int, default=20)
    ap.add_argument('--paths', nargs='+', default=['packages/', 'apps/docs/src'])
    ap.add_argument('--join', choices=['subject', 'both'], default='both',
                    help="subject = commit-subject join only (the method as first specified); both = + the log-row join")
    ap.add_argument('--include-amended', action='store_true', help='count a collision-loser amendment row as its own grill')
    ap.add_argument('--redproof', action='store_true')
    ap.add_argument('--brief', action='store_true')
    a = ap.parse_args()

    rows, raw, every = parse_rows(a.rev)
    print(f'rev {git("rev-parse", "--short", a.rev).strip()} · {raw} Objective grill rows in {LOG}, {len(rows)} parsed (reconciled)')
    print(f'paths: {" ".join(a.paths)} · join: {a.join}\n')

    def resolve(r):
        r['gsha'] = GRILL_COMMIT.get(r['sha'][:8], r['sha'])
        r['gsubj'] = git('log', '-1', '--format=%s', r['gsha']).strip()
        r['gid'] = grill_id(r['gsubj'])

    chosen, excluded, seen = [], [], set()
    pats = [(p, w) for p, w in EXCLUDE_PATTERNS if not (a.include_amended and 'amended' in p.pattern)]
    for r in reversed(rows):
        if len(chosen) == a.n:
            break
        resolve(r)
        why = next((w for p, w in pats if p.search(r['item'])), None)
        if not why and r['gid'] in seen and not a.include_amended:
            why = f'duplicate of grill {r["gid"]} already counted'
        if why:
            excluded.append((r, why)); continue
        seen.add(r['gid'])
        chosen.append(r)

    if a.redproof:
        chosen = [r for r in rows if r['sha'][:7] in ('60235d9', 'e8ac984', '6cfe380')]
        for r in chosen:
            resolve(r)

    zero, table = 0, []
    for r in chosen:
        subs = subjects_of(r['item']) + SUBJECT_EXTRA.get(r['sha'][:8], [])
        per = measure(r['gsha'], subs, a.paths, every if a.join == 'both' else None, r['line'])
        uniq = OrderedDict((x[0], x[2]) for v in per.values() for x in v['prim'] + v['row'])
        tot = sum(uniq.values())   # distinct commits: a row sha shared by two subjects counts once
        prim_h = {x[0] for v in per.values() for x in v['prim']}
        rowonly = sum(l for h, l in uniq.items() if h not in prim_h)
        win, armed_lines, bad = armed_rows(every, r['line'], r['gsha'], a.paths)
        r['armed'] = (len(win), armed_lines, bad)
        sec = sum(x[2] for v in per.values() for x in v['sec'])
        men = sum(x[2] for v in per.values() for x in v['mention'])
        z = tot == 0
        zero += z
        table.append((r, subs, per, tot, rowonly, sec, men, z))

    print('| # | log line | row date | grill | grill commit | subjects | commits | lines pkg+docs/src | of which via row join | shipped nothing | secondary (not counted) | any-mention (not counted) | armed rows / their lines (cross-check) |')
    print('|---|---|---|---|---|---|---|---|---|---|---|---|---|')
    for k, (r, subs, per, tot, rowonly, sec, men, z) in enumerate(table, 1):
        n = len({x[0] for v in per.values() for x in v['prim'] + v['row']})
        print(f"| {k} | {r['line']} | {r['ts']} | {r['gid']} | {r['gsha'][:8]} | {', '.join(subs)} | {n} | {tot} | {rowonly} | {'YES' if z else 'no'} | {sec} | {men} | {r['armed'][0]} / {r['armed'][1]}{' UNRESOLVED ' + ','.join(r['armed'][2]) if r['armed'][2] else ''} |")
    print(f'\nshipped nothing: {zero} of {len(table)}')
    if excluded:
        print('\nexcluded rows:')
        for r, why in excluded:
            print(f"  line {r['line']} {r['ts']} ({r['item'][:70]}...): {why}")

    if not a.brief:
        print('\nper-subject detail:')
        for r, subs, per, *_ in table:
            print(f"\n== grill {r['gid']} ({r['gsha'][:8]} {r['gsubj'][:70]}) row sha {r['sha']}")
            for s, v in per.items():
                print(f'  subject {s}: {sum(x[2] for x in v["prim"] + v["row"])} lines')
                for tag in ('prim', 'row', 'sec', 'mention'):
                    for h, subj, ln, fi, bi in v[tag]:
                        lab = {'prim': '', 'row': '(row join) ', 'sec': '(secondary, not counted) ', 'mention': '(mention, not counted) '}[tag]
                        print(f'    {lab}{h} {ln:>5} lines {fi:>3} files{" BINARY " + str(bi) if bi else ""}  {subj[:95]}')
                for line, rsha in v['unresolved']:
                    print(f'    UNRESOLVED log line {line} sha {rsha} (not an ancestor of the grill, or no such commit)')
                if not v['prim'] and not v['row']:
                    print('    NO LANDING COMMIT FOUND')

    if a.redproof:
        got = {r['gid']: t for r, _, _, t, *_ in table}
        ok = got.get('381') == 0 and got.get('392', 0) > 0
        print(f'\nRED-PROOF (a) grill 381 = {got.get("381")} (want 0); (b) grill 392 = {got.get("392")} (want > 0) -> {"PASS" if ok else "FAIL"}')
        print(f'regression case: grill 346 = {got.get("346")} (its report puts 161ede68, 342.1 closure, in scope; > 0 wanted under --join both)')
        sys.exit(0 if ok else 1)


if __name__ == '__main__':
    main()
