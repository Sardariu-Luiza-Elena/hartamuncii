"""Construiește setul „munca pe domenii”: salariu net (INS 2025), ore (Eurostat), lei/oră, accidente mortale, nr. lucrători.
Rezultatul e adăugat în js/data-extra.js ca RO_EXTRA.work."""
import sys, json, re
S, out = sys.argv[1], sys.argv[2]
import xlrd

# --- salariul net mediu lunar 2025 pe secțiuni CAEN (media celor 12 luni din anexa INS din decembrie)
sh = xlrd.open_workbook(S + '/ins/cs12r25.xls').sheet_by_name('Tabel 3 Castiguri nete')
CODES = {'01-03': 'A', '05-09': 'B', '10-33': 'C', '35': 'D', '36-39': 'E', '41-43': 'F', '45-47': 'G', '49-53': 'H', '55-56': 'I',
         '58-63': 'J', '64-66': 'K', '68': 'L', '69-75': 'M', '77-82': 'N', '84': 'O', '85': 'P', '86-88': 'Q', '90-93': 'R', '94-96': 'S'}
net, total = {}, None
for r in range(3, sh.nrows):
    name = str(sh.cell_value(r, 0)).strip(); code = sh.cell_value(r, 1)
    code = (str(int(code)) if isinstance(code, float) else str(code)).strip()
    vals = [sh.cell_value(r, c) for c in range(3, 15)]
    if not all(isinstance(v, float) for v in vals): continue
    avg = sum(vals) / 12
    if name.startswith('TOTAL'): total = avg
    elif code in CODES and CODES[code] not in net: net[CODES[code]] = avg
    elif code in ('16', '31'): net['div' + code] = avg

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

E = S + '/euro/'
hours = {co['nace_r2']: v for co, v in flat(E + 'hours_nace.json') if co['geo'] == 'RO'}
hours_eu = {co['nace_r2']: v for co, v in flat(E + 'hours_nace.json') if co['geo'] == 'EU27_2020'}
acc = {}
for co, v in flat(E + 'acc_fatal.json'):
    if co['unit'] == 'RT_INC' and co['time'] in ('2021', '2022', '2023', '2024'):
        acc.setdefault(co['geo'], {}).setdefault(co['nace_r2'], []).append(v)
emp = {co['nace_r2']: v for co, v in flat(E + 'emp_nace_ts.json') if co['time'] == '2025'}

NAMES = {'A': 'Agricultură', 'B': 'Minerit', 'C': 'Industrie prelucrătoare', 'D': 'Energie', 'E': 'Apă și deșeuri', 'F': 'Construcții',
         'G': 'Comerț', 'H': 'Transport și logistică', 'I': 'HoReCa', 'J': 'IT și comunicații', 'K': 'Finanțe', 'L': 'Imobiliare',
         'M': 'Profesii liberale și cercetare', 'N': 'Servicii suport (call-center, pază)', 'O': 'Administrație publică', 'P': 'Educație',
         'Q': 'Sănătate', 'R': 'Arte și divertisment', 'S': 'Alte servicii'}
WEEKS_PER_MONTH = 52 / 12
rows = []
for k in NAMES:
    if k not in net or k not in hours: continue
    a_ro = acc.get('RO', {}).get(k); a_eu = acc.get('EU27_2020', {}).get(k)
    rows.append({
        'k': k, 't': NAMES[k], 'net': round(net[k]), 'h': hours[k], 'hEU': hours_eu.get(k),
        'perH': round(net[k] / (hours[k] * WEEKS_PER_MONTH), 1),
        'acc': round(sum(a_ro) / len(a_ro), 1) if a_ro else None, 'accEU': round(sum(a_eu) / len(a_eu), 1) if a_eu else None,
        'emp': emp.get(k)
    })
wood = round((net['div16'] + net['div31']) / 2)
work = {'wood': wood, 'year': 2025, 'avgNet': round(total), 'avgH': hours['TOTAL'],
        'avgPerH': round(total / (hours['TOTAL'] * WEEKS_PER_MONTH), 1),
        'accRO': round(sum(acc['RO']['TOTAL']) / 4, 2), 'accEU': round(sum(acc['EU27_2020']['TOTAL']) / 4, 2), 'rows': rows}

s = open(out, encoding='utf-8').read()
m = re.search(r'window\.RO_EXTRA=(\{.*\});', s, re.S)
obj = json.loads(m.group(1)); obj['work'] = work
s = s[:m.start(1)] + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + s[m.end(1):]
if 'hsw_n2_02' not in s: s = s.replace('cens_21ctz_r3 (', 'cens_21ctz_r3, hsw_n2_02, INS câștigul salarial lunar 2025 (', 1)
open(out, 'w', encoding='utf-8').write(s)
print('avg', work['avgNet'], work['avgH'], work['avgPerH'], 'acc', work['accRO'], work['accEU'])
for r in sorted(rows, key=lambda r: r['perH']):
    print(r['k'], r['net'], r['h'], r['perH'], r['acc'], r['accEU'], r['emp'])
