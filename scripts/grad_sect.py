"""Adaugă în data-extra.js: angajarea absolvenților (edat_lfse_24) și ocuparea pe industrii în timp (lfsa_egan2)."""
import os, sys, json, re
S, out = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jstat import table
E = S + '/euro/'

def flat(path):
    d = json.load(open(path, encoding='utf-8'))
    ids, size, dims = d['id'], d['size'], d['dimension']
    cats = {k: sorted(dims[k]['category']['index'].items(), key=lambda x: x[1]) for k in ids}
    res = []
    for idx, val in d['value'].items():
        i = int(idx); co = {}
        for k, sz in zip(reversed(ids), reversed(size)):
            co[k] = cats[k][i % sz][0]; i //= sz
        res.append((co, val))
    return res

EU = {'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','EL','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'}
_, g = table(E + 'grad.json')
lv = {}
for co, v in flat(E + 'grad_lvl.json'): lv.setdefault(co['geo'], {})[co['isced11']] = v
grad = {
    'year': 2025, 'eu': g['EU27_2020']['2025'],
    'rows': sorted([[k, g[k]['2025']] for k in EU if g.get(k, {}).get('2025')], key=lambda r: (-r[1], r[0])),
    'trend': {k: {y: v for y, v in sorted(g[k].items())} for k in ('RO', 'EU27_2020')},
    'levels': {'RO': lv['RO'], 'EU': lv['EU27_2020']}
}

NAMES = {'A': 'Agricultură', 'B': 'Minerit', 'C': 'Industrie prelucrătoare', 'D': 'Energie', 'E': 'Apă și deșeuri', 'F': 'Construcții',
         'G': 'Comerț', 'H': 'Transport și logistică', 'I': 'HoReCa', 'J': 'IT și comunicații', 'K': 'Finanțe', 'L': 'Imobiliare',
         'M': 'Profesii liberale și cercetare', 'N': 'Servicii suport (call-center, pază)', 'O': 'Administrație publică', 'P': 'Educație',
         'Q': 'Sănătate', 'R': 'Arte și divertisment', 'S': 'Alte servicii'}
ser = {}
for co, v in flat(E + 'emp_nace_ts.json'):
    if co['nace_r2'] in NAMES: ser.setdefault(co['nace_r2'], {})[co['time']] = v
def change(a, b):
    rows = []
    for k, s in ser.items():
        if s.get(a) and s.get(b):
            rows.append([NAMES[k], round((s[b] / s[a] - 1) * 100, 1), round(s[a]), round(s[b])])
    return sorted(rows, key=lambda r: (-r[1], r[0]))
sect = {'p1': {'from': '2011', 'to': '2020', 'rows': change('2011', '2020')},
        'p2': {'from': '2021', 'to': '2025', 'rows': change('2021', '2025')}}

s = open(out, encoding='utf-8').read()
m = re.search(r'window\.RO_EXTRA=(\{.*\});', s, re.S)
obj = json.loads(m.group(1)); obj['grad'] = grad; obj['sect'] = sect
s = s[:m.start(1)] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + s[m.end(1):]
s = s.replace('lfsa_egan2 (', 'lfsa_egan2, edat_lfse_24 (', 1)
open(out, 'w', encoding='utf-8').write(s)
print('grad RO rank', [r[0] for r in grad['rows']].index('RO') + 1, 'of', len(grad['rows']))
for p in sect.values(): print(p['from'], p['to'], [(r[0], r[1]) for r in p['rows']])
