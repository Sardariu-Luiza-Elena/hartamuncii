"""Descarcă din INS TEMPO (FOM106E) câștigul salarial mediu net lunar, media anuală, pe județe, pentru anii ceruți.
Folosire: python scripts/tempo_county_salary.py 2023 2024 > date/fom106e.csv"""
import json, sys, urllib.request
BASE = 'http://statistici.insse.ro:8077/tempo-ins/'
YEARS = sys.argv[1:] or ['2023', '2024']
meta = json.load(urllib.request.urlopen(BASE + 'matrix/FOM106E', timeout=40))

def pick(label, opts):
    l = label.lower()
    if 'judete' in l: return [o for o in opts if not any(w in o['label'].lower() for w in ('macroregiunea', 'regiunea'))]
    if label.startswith('Ani'): return [o for o in opts if o['label'][-4:] in YEARS]
    if label.startswith('UM'): return opts
    return [o for o in opts if o['label'].strip().upper() == 'TOTAL'][:1] or opts[:1]

parts = [','.join(str(o['nomItemId']) for o in pick(d['label'], d['options'])) for d in meta['dimensionsMap']]
body = {'encQuery': ':'.join(parts), 'language': 'ro', 'matCode': 'FOM106E', 'matMaxDim': meta['details']['matMaxDim'],
        'matUMSpec': meta['details']['matUMSpec'], 'matRegJ': meta['details'].get('matRegJ', 0), 'matrixName': meta['matrixName']}
req = urllib.request.Request(BASE + 'pivot', data=json.dumps(body).encode(), headers={'Content-Type': 'application/json'})
sys.stdout.write(urllib.request.urlopen(req, timeout=90).read().decode('utf-8'))
