"""Round-2 redraft: reconcile the disposition of every open ROADMAP item against a RAW
count of ROADMAP.md (not against this list). Run from the repo root.
Differs from design-realign/classify.py in one place: 249.7 moves PARK -> FOLD
(the job index's 'also called' mechanism serves it)."""
import re, sys
C = {
 'M0':    ['392.4','381.2','377.3'],
 'FOLD':  ['392.5','377.4','377.10','376.5','389.14','249.7',
           '389.1','389.2','389.5','389.6','389.7','389.8','389.9','389.10','389.11',
           '389.12','389.13','389.15','389.17','389.18','389.20','389.21','389.22'],
 'DEFECT':['392.2','392.3','389.3','389.16','389.19','389.23','389.24','388.3','388.4',
           '387.1','387.2','386.1','377.8','377.11','375.11'],
 'PARK':  ['391.1','384.1','381.1','377.7','377.9','377.12','377.13','377.14','376.7'],
 'OWNER': ['377.5','377.6','374.4','373.6','373.8','369.1','296.3','273.2',
           '249.10','249.11','249.12','249.13','112.3','112.4','AT runtime evidence'],
}
if '--red-drop' in sys.argv: C['DEFECT'].remove('389.24')
if '--red-dup' in sys.argv: C['PARK'].append('392.2')
text = open('ROADMAP.md', encoding='utf-8').read()
raw = len(re.findall(r'^\s*\d+\.\s*\[ \]', text, re.M))
open_ids = [m.group(1) for m in re.finditer(
    r'^\s*\d+\.\s*\[ \]\s*\*\*(?:OWNER · )?(\d+\.\d+|AT runtime evidence)', text, re.M)]
flat = [i for v in C.values() for i in v]
dups = {i for i in flat if flat.count(i) > 1}
missing = set(open_ids) - set(flat); extra = set(flat) - set(open_ids)
print(f'raw open checkboxes: {raw}  ids recognised: {len(open_ids)}  classified: {len(flat)}')
for k, v in C.items(): print(f'  {k:7s} {len(v):3d}')
if raw != len(open_ids) or dups or missing or extra:
    print('RECONCILE FAILED', dict(dups=dups, missing=missing, extra=extra)); sys.exit(1)
print('reconciled: every open item has exactly one disposition')
