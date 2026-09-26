"""extract.py — the dispatch-region paragraphs added or changed between two
revisions of LOOPS.md, with each paragraph's word count and how many of its
words are new (difflib against its closest old paragraph). Run from the repo
root: python3 .roundtable/measure-384.1-2026-09-27/extract.py 4e6b83c1 HEAD out.json"""
import sys, re, difflib, json
sys.path.insert(0, 'scripts/loops')
import report_loop_prose as r

def region(rev):
    lines = r.text_at(rev, 'LOOPS.md').split('\n')
    at = next(i for i, l in enumerate(lines) if r.REGION_SPLIT.match(l))
    return '\n'.join(lines[:at])

def paras(text):
    out, sec = [], ''
    for block in re.split(r'\n\s*\n', text):
        b = block.strip()
        if not b:
            continue
        for l in b.split('\n'):
            if re.match(r'^#{2,4} ', l):
                sec = l.strip()
        out.append((sec, b))
    return out

base, rev, dest = sys.argv[1], sys.argv[2], sys.argv[3]
old, new = paras(region(base)), paras(region(rev))
flat = lambda s: re.sub(r'\s+', ' ', s)
oldset = {flat(b) for _, b in old}
added = []
for sec, b in new:
    nb = flat(b)
    if nb in oldset:
        continue
    ratio, ob = max((difflib.SequenceMatcher(None, nb.split(), flat(o).split()).ratio(), o) for _, o in old)
    base_words = flat(ob).split() if ratio > 0.5 else []
    sm = difflib.SequenceMatcher(None, base_words, nb.split())
    new_words = sum(j2 - j1 for tag, i1, i2, j1, j2 in sm.get_opcodes() if tag in ('insert', 'replace'))
    added.append({'id': len(added) + 1, 'section': sec, 'words': len(nb.split()), 'new_words': new_words, 'text': b})
json.dump(added, open(dest, 'w'), indent=1)
print(len(added), 'paragraphs added or changed;', sum(a['words'] for a in added), 'words in them;', sum(a['new_words'] for a in added), 'new')
