"""Adaugă RO_EXTRA.mig: remitențe vs ISD (Banca Mondială), plecări vs întoarceri (Eurostat), salarii pe meserii (Eurostat SES 2022),
copii cu părinți plecați (ANPDCA)."""
import os, json, re, sys
S, out = sys.argv[1], sys.argv[2]
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jstat import table

def wb(ind):
    d = json.load(open(f'{S}/wb/{ind}.json'))
    return {r['date']: round(r['value'] / 1e9, 2) for r in d[1] if r['value'] is not None and int(r['date']) >= 2013}
remit, fdi = wb('BX.TRF.PWKR.CD.DT'), wb('BX.KLT.DINV.CD.WD')
gdp = {r['date']: round(r['value'], 2) for r in json.load(open(f'{S}/wb/BX.TRF.PWKR.DT.GD.ZS.json'))[1] if r['value'] is not None}

_, imm = table(S + '/euro/imm_ro.json'); _, emi = table(S + '/euro/emi_ro.json')
ret = {'in': {y: v for y, v in sorted(imm['RO'].items())}, 'out': {y: v for y, v in sorted(emi['RO'].items())}}

# salarii brute pe oră, firme cu 10+ angajați, 2022
d = json.load(open(S + '/euro/ses47.json', encoding='utf-8'))
ids, size, dims = d['id'], d['size'], d['dimension']
cats = {k: sorted(dims[k]['category']['index'].items(), key=lambda x: x[1]) for k in ids}
occ = {}
for idx, val in d['value'].items():
    i = int(idx); co = {}
    for k, sz in zip(reversed(ids), reversed(size)):
        co[k] = cats[k][i % sz][0]; i //= sz
    if co['indic_se'] == 'ERN' and co['sizeclas'] == 'GE10' and co['unit'] in ('EUR', 'PPS') and co['isco08'] in ('TOTAL', 'OC2', 'OC5', 'OC7', 'OC8', 'OC9'):
        occ.setdefault(co['isco08'], {}).setdefault(co['unit'], {})[co['geo']] = val

kids = {'date': '2025-12-31', 'any': 50364, 'both': 7418, 'one': 37212, 'sole': 5734, 'anyPrev': 54798, 'bothPrev': 8074}

s = open(out, encoding='utf-8').read()
m = re.search(r'window\.RO_EXTRA=(\{.*\});', s, re.S)
obj = json.loads(m.group(1))
obj['mig'] = {'remit': remit, 'fdi': fdi, 'remitGdp': gdp, 'ret': ret, 'occ': occ, 'kids': kids}
s = s[:m.start(1)] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + s[m.end(1):]
open(out, 'w', encoding='utf-8').write(s)
print('remit', list(remit.items())[-3:], 'fdi', list(fdi.items())[-3:])
print('occ keys', list(occ.keys()))
