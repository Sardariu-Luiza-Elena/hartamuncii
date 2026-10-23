import os, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jstat import table
E = sys.argv[1]+'/euro/'
_, ro = table(E+'pop_ro.json'); _, pop = table(E+'pop_tot.json')
dias = []
for g, ser in ro.items():
    if g in ('RO', 'UK'): continue
    yrs = [y for y in sorted(ser) if ser[y]]
    if not yrs: continue
    y = yrs[-1]; n = ser[y]
    p = pop.get(g, {}); P = p.get(y) or p.get('2024') or p.get('2025')
    if not P or n < 1000: continue
    dias.append({'id': g, 'n': n, 'y': int(y), 'pct': round(n/P*100, 2),
                 'ser': {k: v for k, v in sorted(ser.items()) if v}})
# Regatul Unit: Eurostat nu mai are date după Brexit -> recensământul ONS 2021 (Anglia și Țara Galilor, născuți în România)
dias.append({'id': 'UK', 'n': 539000, 'y': 2021, 'pct': round(539000/59597542*100, 2), 'note': 'născuți în România, recensământ 2021 (Anglia și Țara Galilor), ONS', 'ser': {}})
# Grecia, Cipru, Malta nu raportează anual cetățenia străinilor: recensământul 2021 (Eurostat cens_21ctz_r3)
cens = json.load(open(E + 'cens_el.json', encoding='utf-8'))
ids, size, dims = cens['id'], cens['size'], cens['dimension']
cats = {k: sorted(dims[k]['category']['index'].items(), key=lambda x: x[1]) for k in ids}
cv = {}
for idx, val in cens['value'].items():
    i = int(idx); co = {}
    for k, sz in zip(reversed(ids), reversed(size)):
        co[k] = cats[k][i % sz][0]; i //= sz
    if co.get('sex', 'T') == 'T': cv[(co['geo'], co['citizen'])] = val
have = {r['id'] for r in dias}
for g in ('EL', 'CY', 'MT'):
    if g not in have and (g, 'RO') in cv:
        n, P = cv[(g, 'RO')], cv[(g, 'TOTAL')]
        dias.append({'id': g, 'n': n, 'y': 2021, 'pct': round(n / P * 100, 2), 'note': 'cetățeni români, recensământul din 2021', 'ser': {}})
dias.sort(key=lambda r: -r['n'])
def series(f, keys=('RO','EU27_2020')):
    _, t = table(E+f); return {k: {y: v for y, v in sorted(t[k].items()) if v is not None} for k in keys}
def latest(f, year):
    _, t = table(E+f)
    skip = ('EA','EA18','EA19','EA20','EA21','EU','EU27_2007','EU28','EU27_2020')
    return sorted([[g, t[g][year]] for g in t if g not in skip and t[g].get(year) is not None], key=lambda r: (-r[1], r[0]))
EU = {'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','EL','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE'}
_, h = table(E+'hours.json'); _, n = table(E+'neet.json'); _, w = table(E+'iwp.json')
out = {
  'diaspora': dias,
  'hours': {'year': 2025, 'eu': h['EU27_2020']['2025'], 'rows': sorted([[g, h[g]['2025']] for g in EU if h.get(g, {}).get('2025')], key=lambda r: (-r[1], r[0])),
            'trend': series('hours_ts.json', ('RO', 'EU27_2020', 'NL'))},
  'neet': {'year': 2025, 'eu': n['EU27_2020']['2025'], 'rows': sorted([[g, n[g]['2025']] for g in EU if n.get(g, {}).get('2025')], key=lambda r: (-r[1], r[0])),
           'trend': series('neet.json')},
  'iwp': {'year': 2025, 'eu': w['EU27_2020']['2025'], 'rows': sorted([[g, w[g]['2025']] for g in EU if w.get(g, {}).get('2025')], key=lambda r: (-r[1], r[0])),
          'trend': series('iwp.json')}
}
open(sys.argv[2], 'w', encoding='utf-8').write('/* Generat din API-ul Eurostat: migr_pop1ctz, tps00001, lfsa_ewhan2, edat_lfse_20, ilc_iw01 (descărcat oct. 2026) */\nwindow.RO_EXTRA=' + json.dumps(out, ensure_ascii=False, separators=(',',':')) + ';\n')
for r in dias[:12]: print(r['id'], r['n'], r['y'], r['pct'])
print('hours', out['hours']['rows'][:5], 'neet', out['neet']['rows'][:4], 'iwp', out['iwp']['rows'][:4])
