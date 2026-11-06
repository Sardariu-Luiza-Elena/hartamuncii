"""Prelucrează datele brute din folderul de lucru și construiește setul de date al site-ului.
Anul cel mai recent se alege automat din fiecare fișier, deci la o actualizare nu trebuie schimbat nimic aici.
Cifrele introduse de mână (fără sursă descărcabilă) vin din data/manual.json."""
import json, os, re, sys, unicodedata
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from jstat import table, flat

EU = {'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'}
SECTORS = {'A': 'Agricultură', 'B': 'Minerit', 'C': 'Industrie prelucrătoare', 'D': 'Energie', 'E': 'Apă și deșeuri', 'F': 'Construcții',
           'G': 'Comerț', 'H': 'Transport și logistică', 'I': 'HoReCa', 'J': 'IT și comunicații', 'K': 'Finanțe', 'L': 'Imobiliare',
           'M': 'Profesii liberale și cercetare', 'N': 'Servicii suport (call-center, pază)', 'O': 'Administrație publică', 'P': 'Educație',
           'Q': 'Sănătate', 'R': 'Arte și divertisment', 'S': 'Alte servicii'}
COUNTIES = {'AB': 'Alba', 'AR': 'Arad', 'AG': 'Argeș', 'BC': 'Bacău', 'BH': 'Bihor', 'BN': 'Bistrița-Năsăud', 'BT': 'Botoșani',
            'BV': 'Brașov', 'BR': 'Brăila', 'B': 'București', 'BZ': 'Buzău', 'CS': 'Caraș-Severin', 'CL': 'Călărași', 'CJ': 'Cluj',
            'CT': 'Constanța', 'CV': 'Covasna', 'DB': 'Dâmbovița', 'DJ': 'Dolj', 'GL': 'Galați', 'GR': 'Giurgiu', 'GJ': 'Gorj',
            'HR': 'Harghita', 'HD': 'Hunedoara', 'IL': 'Ialomița', 'IS': 'Iași', 'IF': 'Ilfov', 'MM': 'Maramureș', 'MH': 'Mehedinți',
            'MS': 'Mureș', 'NT': 'Neamț', 'OT': 'Olt', 'PH': 'Prahova', 'SM': 'Satu Mare', 'SJ': 'Sălaj', 'SB': 'Sibiu', 'SV': 'Suceava',
            'TR': 'Teleorman', 'TM': 'Timiș', 'TL': 'Tulcea', 'VS': 'Vaslui', 'VL': 'Vâlcea', 'VN': 'Vrancea'}
AGGREGATES = ('EA', 'EA18', 'EA19', 'EA20', 'EA21', 'EU', 'EU27_2007', 'EU28', 'EU27_2020')
WEEKS_PER_MONTH = 52 / 12


def latest(series):
    """Cel mai recent an cu valoare dintr-un dicționar {an: valoare}."""
    return max(y for y, v in series.items() if v is not None)


def eu_ranking(t):
    """Clasamentul țărilor UE în cel mai recent an pentru care există media UE."""
    y = latest(t['EU27_2020'])
    rows = sorted([[g, t[g][y]] for g in EU if t.get(g, {}).get(y)], key=lambda r: (-r[1], r[0]))
    return y, t['EU27_2020'][y], rows


def series(t, keys=('RO', 'EU27_2020')):
    return {k: {y: v for y, v in sorted(t[k].items()) if v is not None} for k in keys}


# ---------- județe: INS TEMPO FOM106E ----------
def counties(W):
    norm = lambda s: unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower().replace('municipiul ', '').strip()
    code = {norm(n): c for c, n in COUNTIES.items()}
    val = {}
    for line in open(f'{W}/ins/fom106e.csv', encoding='utf-8').read().splitlines()[1:]:
        p = [x.strip() for x in line.split(',')]
        if len(p) < 6 or not p[5]: continue
        c = 'RO' if p[2].upper() == 'TOTAL' else code[norm(p[2])]
        val.setdefault(c, {})[int(p[3][-4:])] = int(float(p[5]))
    y = max(val['RO']); prev = y - 1
    missing = set(COUNTIES) - set(val)
    if missing: raise ValueError(f'Lipsesc județe din FOM106E: {sorted(missing)}')
    return {'year': y, 'prev': prev, 'national': val['RO'], 'values': {c: val[c] for c in COUNTIES}}


# ---------- diaspora, ore, NEET, sărăcie: Eurostat ----------
def extra(W, manual):
    E = W + '/euro/'
    _, ro = table(E + 'pop_ro.json'); _, pop = table(E + 'pop_tot.json')
    dias = []
    for g, ser in ro.items():
        if g in ('RO', 'UK'): continue
        yrs = [y for y in sorted(ser) if ser[y]]
        if not yrs: continue
        y = yrs[-1]; n = ser[y]
        p = {k: v for k, v in pop.get(g, {}).items() if v}
        P = p.get(y) or (p[min(p, key=lambda k: abs(int(k) - int(y)))] if p else None)
        if not P or n < 1000: continue
        dias.append({'id': g, 'n': n, 'y': int(y), 'pct': round(n / P * 100, 2), 'ser': {k: v for k, v in sorted(ser.items()) if v}})
    # Regatul Unit: Eurostat nu mai are date după Brexit, deci folosim recensământul ONS (introdus de mână)
    uk = manual['uk_census']
    dias.append({'id': 'UK', 'n': uk['n'], 'y': uk['year'], 'pct': round(uk['n'] / uk['population'] * 100, 2), 'note': uk['note'], 'ser': {}})
    # Grecia, Cipru, Malta nu raportează anual cetățenia străinilor: recensământul 2021 (Eurostat cens_21ctz_r3)
    cv = {(co['geo'], co['citizen']): v for co, v in flat(E + 'cens_el.json') if co.get('sex', 'T') == 'T'}
    have = {r['id'] for r in dias}
    for g in ('EL', 'CY', 'MT'):
        if g not in have and (g, 'RO') in cv:
            n, P = cv[(g, 'RO')], cv[(g, 'TOTAL')]
            dias.append({'id': g, 'n': n, 'y': 2021, 'pct': round(n / P * 100, 2), 'note': 'cetățeni români, recensământul din 2021', 'ser': {}})
    dias.sort(key=lambda r: -r['n'])

    out = {'diaspora': dias}
    for key, f, trend in (('hours', 'hours.json', ('hours_ts.json', ('RO', 'EU27_2020', 'NL'))),
                          ('neet', 'neet.json', ('neet.json', ('RO', 'EU27_2020'))),
                          ('iwp', 'iwp.json', ('iwp.json', ('RO', 'EU27_2020')))):
        _, t = table(E + f)
        y, eu, rows = eu_ranking(t)
        out[key] = {'year': int(y), 'eu': eu, 'rows': rows, 'trend': series(table(E + trend[0])[1], trend[1])}
    return out


# ---------- absolvenți și ocupare pe domenii în timp ----------
def grad_sect(W):
    E = W + '/euro/'
    _, g = table(E + 'grad.json')
    y, eu, rows = eu_ranking(g)
    lvl = flat(E + 'grad_lvl.json')
    ly = max(co['time'] for co, v in lvl if v is not None)
    lv = {}
    for co, v in lvl:
        if co['time'] == ly: lv.setdefault(co['geo'], {})[co['isced11']] = v
    grad = {'year': int(y), 'eu': eu, 'rows': rows,
            'trend': {k: {yy: v for yy, v in sorted(g[k].items())} for k in ('RO', 'EU27_2020')},
            'levels': {'RO': lv['RO'], 'EU': lv['EU27_2020']}}

    ser = {}
    for co, v in flat(E + 'emp_nace_ts.json'):
        if co['nace_r2'] in SECTORS: ser.setdefault(co['nace_r2'], {})[co['time']] = v

    def change(a, b):
        rows = [[SECTORS[k], round((s[b] / s[a] - 1) * 100, 1), round(s[a]), round(s[b])] for k, s in ser.items() if s.get(a) and s.get(b)]
        return sorted(rows, key=lambda r: (-r[1], r[0]))
    # 2011–2020 rămâne fix: în 2021 INS a schimbat metodologia, deci a doua perioadă pornește din 2021 până la ultimul an
    last = latest(ser['A'])
    sect = {'p1': {'from': '2011', 'to': '2020', 'rows': change('2011', '2020')},
            'p2': {'from': '2021', 'to': last, 'rows': change('2021', last)}}
    return {'grad': grad, 'sect': sect}


# ---------- munca pe domenii: salariu, ore, lei pe oră, accidente ----------
def work(W):
    import xlrd
    info = json.load(open(f'{W}/ins/cs12.json'))
    sh = xlrd.open_workbook(f'{W}/ins/cs12.xls').sheet_by_name('Tabel 3 Castiguri nete')
    codes = {'01-03': 'A', '05-09': 'B', '10-33': 'C', '35': 'D', '36-39': 'E', '41-43': 'F', '45-47': 'G', '49-53': 'H', '55-56': 'I',
             '58-63': 'J', '64-66': 'K', '68': 'L', '69-75': 'M', '77-82': 'N', '84': 'O', '85': 'P', '86-88': 'Q', '90-93': 'R', '94-96': 'S'}
    net, total = {}, None
    for r in range(3, sh.nrows):
        name = str(sh.cell_value(r, 0)).strip(); code = sh.cell_value(r, 1)
        code = (str(int(code)) if isinstance(code, float) else str(code)).strip()
        vals = [sh.cell_value(r, c) for c in range(3, 15)]
        if not all(isinstance(v, float) for v in vals): continue
        avg = sum(vals) / 12
        if name.startswith('TOTAL'): total = avg
        elif code in codes and codes[code] not in net: net[codes[code]] = avg
        elif code in ('16', '31'): net['div' + code] = avg

    E = W + '/euro/'
    hn = flat(E + 'hours_nace.json')
    hy = max(co['time'] for co, v in hn if co['geo'] == 'RO' and v is not None)
    hours = {co['nace_r2']: v for co, v in hn if co['geo'] == 'RO' and co['time'] == hy}
    hours_eu = {co['nace_r2']: v for co, v in hn if co['geo'] == 'EU27_2020' and co['time'] == hy}
    # accidente mortale: media ultimilor 4 ani disponibili
    af = [(co, v) for co, v in flat(E + 'acc_fatal.json') if co['unit'] == 'RT_INC']
    ay = sorted({co['time'] for co, v in af if co['geo'] == 'RO' and co['nace_r2'] == 'TOTAL' and v is not None})[-4:]
    acc = {}
    for co, v in af:
        if co['time'] in ay and v is not None: acc.setdefault(co['geo'], {}).setdefault(co['nace_r2'], []).append(v)
    emp_all = flat(E + 'emp_nace_ts.json')
    ey = max(co['time'] for co, v in emp_all if v is not None)
    emp = {co['nace_r2']: v for co, v in emp_all if co['time'] == ey}

    avg = lambda a, d: round(sum(a) / len(a), d) if a else None
    rows = []
    for k in SECTORS:
        if k not in net or k not in hours: continue
        rows.append({'k': k, 't': SECTORS[k], 'net': round(net[k]), 'h': hours[k], 'hEU': hours_eu.get(k),
                     'perH': round(net[k] / (hours[k] * WEEKS_PER_MONTH), 1),
                     'acc': avg(acc.get('RO', {}).get(k), 1), 'accEU': avg(acc.get('EU27_2020', {}).get(k), 1), 'emp': emp.get(k)})
    return {'wood': round((net['div16'] + net['div31']) / 2), 'year': info['year'], 'avgNet': round(total), 'avgH': hours['TOTAL'],
            'avgPerH': round(total / (hours['TOTAL'] * WEEKS_PER_MONTH), 1),
            'accRO': avg(acc['RO']['TOTAL'], 2), 'accEU': avg(acc['EU27_2020']['TOTAL'], 2), 'rows': rows,
            '_years': {'hours': hy, 'accidents': f'{ay[0]}–{ay[-1]}', 'employment': ey}}


def sectors_split(W):
    """Ponderea marilor sectoare în populația ocupată, în cel mai recent an (Eurostat lfsa_egan2)."""
    emp = flat(W + '/euro/emp_nace_ts.json')
    y = max(co['time'] for co, v in emp if v is not None)
    v = {co['nace_r2']: x for co, x in emp if co['time'] == y and x is not None}
    groups = [('Servicii', 'GHIJKLMNOPQRSTU'), ('Industrie & construcții', 'BCDEF'), ('Agricultură', 'A')]
    tot = v['TOTAL']
    return y, [{'k': name, 'v': round(sum(v.get(s, 0) for s in secs) / tot * 100, 1)} for name, secs in groups]


# ---------- migrație: remitențe, plecări și întoarceri, salarii pe meserii ----------
def mig(W, manual):
    def wb(ind, since=None):
        d = json.load(open(f'{W}/wb/{ind}.json'))
        return {r['date']: r['value'] for r in d[1] if r['value'] is not None and (since is None or int(r['date']) >= since)}
    # înainte de 2013 Banca Mondială înregistra remitențele altfel (salt de la 0,7 la 4,8 mld. $), deci pornim din 2013
    remit = {y: round(v / 1e9, 2) for y, v in wb('BX.TRF.PWKR.CD.DT', 2013).items()}
    fdi = {y: round(v / 1e9, 2) for y, v in wb('BX.KLT.DINV.CD.WD', 2013).items()}
    gdp = {y: round(v, 2) for y, v in wb('BX.TRF.PWKR.DT.GD.ZS').items()}
    _, imm = table(W + '/euro/imm_ro.json'); _, emi = table(W + '/euro/emi_ro.json')
    ret = {'in': dict(sorted(imm['RO'].items())), 'out': dict(sorted(emi['RO'].items()))}
    occ = {}
    for co, val in flat(W + '/euro/ses47.json'):
        if co['indic_se'] == 'ERN' and co['sizeclas'] == 'GE10' and co['unit'] in ('EUR', 'PPS') and co['isco08'] in ('TOTAL', 'OC2', 'OC5', 'OC7', 'OC8', 'OC9'):
            occ.setdefault(co['isco08'], {}).setdefault(co['unit'], {})[co['geo']] = val
    kids = {k: v for k, v in manual['children_parents_abroad'].items() if not k.startswith('_')}
    return {'remit': remit, 'fdi': fdi, 'remitGdp': gdp, 'ret': ret, 'occ': occ, 'kids': kids}


def run(W, manual):
    """Întoarce tot setul de date al site-ului, în forma folosită de paginile JS."""
    site = extra(W, manual)
    site.update(grad_sect(W))
    site['work'] = work(W)
    site['mig'] = mig(W, manual)
    split_year, split = sectors_split(W)
    return {'extra': site, 'counties': counties(W), 'split': {'year': split_year, 'rows': split},
            'pay': {k: v for k, v in manual['pay_distribution'].items() if not k.startswith('_')}}
