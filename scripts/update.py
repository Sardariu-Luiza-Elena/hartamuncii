"""Actualizează toate datele site-ului cu o singură comandă.

  python scripts/update.py             descarcă datele noi, reconstruiește baza și site-ul, arată ce s-a schimbat
  python scripts/update.py --check     la fel, dar nu scrie nimic: doar arată ce s-ar schimba
  python scripts/update.py --offline   folosește datele deja descărcate în work/

Pașii: descărcare (download.py) → prelucrare (build.py) → verificări → baza de date data/hartamuncii.sqlite și data/csv/
(db.py) → js/data-extra.js, generat din bază. Dacă o verificare eșuează, site-ul și baza rămân neatinse."""
import datetime, json, os, re, sys

sys.stdout.reconfigure(encoding='utf-8'); sys.stderr.reconfigure(encoding='utf-8')
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
try:
    import xlrd  # noqa: F401  (citește fișierul .xls de la INS)
except ImportError:
    sys.exit('Lipsește biblioteca xlrd. Instaleaz-o o dată cu:  pip install xlrd')
import build, db, download

DB_PATH = os.path.join(ROOT, 'data', 'hartamuncii.sqlite')
JS_PATH = os.path.join(ROOT, 'js', 'data-extra.js')
JS_VARS = ('RO_EXTRA', 'RO_PAY_DIST', 'RO_SECTORS_SPLIT', 'RO_COUNTY_PAY')
# Fișierele în care se caută anii vechi după o actualizare (textele scrise de mână).
TEXT_FILES = ('index.html', 'js/main.js', 'js/migration.js', 'js/sources.js', 'js/i18n.js')

fmt = lambda v: '–' if v is None else f'{v:,.1f}'.replace(',', ' ').replace('.', ',').replace(',0', '') if isinstance(v, float) else f'{v:,}'.replace(',', '.')


# ---------- verificări ----------
def checks(s):
    """Întoarce (erori, avertismente). O eroare oprește actualizarea."""
    err, warn = [], []
    X, C = s['extra'], s['counties']
    if len(C) != 42: err.append(f'salarii pe județe: {len(C)} județe în loc de 42')
    bad = [c for c, v in C.items() if not 1500 < v['s'] < 30000]
    if bad: err.append(f'salarii pe județe: valori neplauzibile la {bad}')
    lo, hi = min(v['s'] for v in C.values()), max(v['s'] for v in C.values())
    if not lo <= s['national']['net'] <= hi: err.append('media pe țară nu e între minimul și maximul pe județe')
    for ind in ('hours', 'neet', 'iwp', 'grad'):
        rows = X[ind]['rows']
        if len(rows) < 20: err.append(f'{ind}: doar {len(rows)} țări în clasament')
        if 'RO' not in dict(rows): warn.append(f'{ind}: România lipsește din clasamentul pe {X[ind]["year"]}')
    W = X['work']
    if len(W['rows']) != 19: err.append(f'munca pe domenii: {len(W["rows"])} domenii în loc de 19')
    if any(not 25 < r['h'] < 50 or r['perH'] <= 0 for r in W['rows']): err.append('munca pe domenii: ore sau câștig pe oră neplauzibile')
    if len(X['diaspora']) < 10: err.append('diaspora: prea puține țări')
    if not X['mig']['remit']: err.append('remitențe: nicio valoare')
    if abs(sum(r['v'] for r in s['split']) - 100) > 0.5: err.append('ponderile marilor sectoare nu dau 100%')
    return err, warn


# ---------- ce s-a schimbat ----------
def read_js(path):
    """Variabilele din js/data-extra.js, ca să le comparăm cu cele noi."""
    if not os.path.exists(path): return {}
    src = open(path, encoding='utf-8').read()
    out = {}
    for v in JS_VARS:
        m = re.search(r'window\.' + v + r'=(.*?);\n', src, re.S)
        if m: out[v] = json.loads(m.group(1))
    return out


def as_js(s):
    return {'RO_EXTRA': s['extra'], 'RO_PAY_DIST': s['pay'], 'RO_SECTORS_SPLIT': s['split'],
            'RO_COUNTY_PAY': {'year': s['national']['year'], 'net': s['national']['net'], 'counties': s['counties']}}


def leaves(o, p=''):
    if isinstance(o, dict):
        for k, v in o.items(): yield from leaves(v, f'{p}/{k}')
    elif isinstance(o, list):
        for i, v in enumerate(o): yield from leaves(v, f'{p}[{i}]')
    else: yield p, o


def get(o, *path):
    try:
        for k in path: o = o[k]
        return o
    except (KeyError, IndexError, TypeError):
        return None


def last_key(d): return max(d, key=int) if d else None


DATASETS = [  # (nume, variabila, an, valoare de afișat)
    ('Salarii pe județe (INS)', 'RO_COUNTY_PAY', lambda o: o['year'], lambda o: f'media pe țară {fmt(o["net"])} lei'),
    ('Ore lucrate (Eurostat)', 'RO_EXTRA', lambda o: o['hours']['year'], lambda o: f'România {fmt(dict(o["hours"]["rows"]).get("RO"))} h, UE {fmt(o["hours"]["eu"])} h'),
    ('Tineri NEET (Eurostat)', 'RO_EXTRA', lambda o: o['neet']['year'], lambda o: f'România {fmt(dict(o["neet"]["rows"]).get("RO"))}%, UE {fmt(o["neet"]["eu"])}%'),
    ('Săraci deși muncesc (Eurostat)', 'RO_EXTRA', lambda o: o['iwp']['year'], lambda o: f'România {fmt(dict(o["iwp"]["rows"]).get("RO"))}%, UE {fmt(o["iwp"]["eu"])}%'),
    ('Angajarea absolvenților (Eurostat)', 'RO_EXTRA', lambda o: o['grad']['year'], lambda o: f'România {fmt(dict(o["grad"]["rows"]).get("RO"))}%, UE {fmt(o["grad"]["eu"])}%'),
    ('Munca pe domenii (INS, Eurostat)', 'RO_EXTRA', lambda o: o['work']['year'], lambda o: f'salariul mediu {fmt(o["work"]["avgNet"])} lei, {fmt(o["work"]["avgPerH"])} lei/oră'),
    ('Ocuparea pe domenii (Eurostat)', 'RO_EXTRA', lambda o: o['sect']['p2']['to'], lambda o: f'perioada {o["sect"]["p2"]["from"]}–{o["sect"]["p2"]["to"]}'),
    ('Diaspora (Eurostat)', 'RO_EXTRA', lambda o: max(d['y'] for d in o['diaspora']), lambda o: f'{o["diaspora"][0]["id"]} {fmt(o["diaspora"][0]["n"])}'),
    ('Remitențe (Banca Mondială)', 'RO_EXTRA', lambda o: last_key(o['mig']['remit']), lambda o: f'{fmt(o["mig"]["remit"][last_key(o["mig"]["remit"])])} mld. $'),
    ('Plecări și întoarceri (Eurostat)', 'RO_EXTRA', lambda o: last_key(o['mig']['ret']['in']), lambda o: f'întorși {fmt(o["mig"]["ret"]["in"][last_key(o["mig"]["ret"]["in"])])}'),
]


def report(before, after):
    print('\nCe s-a schimbat:')
    old_years = []
    for name, var, year, show in DATASETS:
        a, b = before.get(var), after[var]
        try: ya, sa = year(a), show(a)
        except Exception: ya = sa = None
        yb, sb = year(b), show(b)
        if ya is None: print(f'  • {name}: {yb}, {sb} (nou în fișier)')
        elif str(ya) != str(yb): print(f'  • {name}: an nou {ya} → {yb}. {sa} → {sb}'); old_years.append(str(ya))
        elif sa != sb: print(f'  • {name}: {yb}, valori revizuite: {sa} → {sb}')
    changed = big = 0
    for var in JS_VARS:
        old = dict(leaves(before.get(var, {})))
        for p, v in leaves(after[var]):
            if p in old and old[p] != v:
                changed += 1
                if isinstance(v, (int, float)) and isinstance(old[p], (int, float)) and old[p] and abs(v / old[p] - 1) > 0.3:
                    big += 1; print(f'  ! schimbare mare (peste 30%): {var}{p}: {old[p]} → {v}')
    added = sum(1 for var in JS_VARS for p, _ in leaves(after[var]) if p not in dict(leaves(before.get(var, {}))))
    if not changed and not added: print('  Nimic. Datele sunt aceleași ca pe site.')
    else: print(f'  În total: {changed} valori schimbate, {added} valori noi.')
    if old_years:
        print('\nTexte scrise de mână care pomenesc anii vechi (' + ', '.join(sorted(set(old_years))) + '). Verifică dacă trebuie schimbate:')
        for f in TEXT_FILES:
            for i, line in enumerate(open(os.path.join(ROOT, f), encoding='utf-8'), 1):
                if any(re.search(r'\b' + y + r'\b', line) for y in old_years):
                    print(f'  {f}:{i}  {line.strip()[:110]}')


def write_js(path, s, updated):
    js = as_js(s)
    out = ['/* Generat automat de scripts/update.py din data/hartamuncii.sqlite. Nu edita de mână: modificările se pierd la următoarea actualizare.',
           f'   Actualizat: {updated}. Sursa fiecărui tabel: data/README.md. */']
    out += [f'window.{v}=' + json.dumps(js[v], ensure_ascii=False, separators=(',', ':')) + ';' for v in JS_VARS]
    out += [f"window.RO_DATA_UPDATED='{updated}';"]
    out += ['// Salariile pe județe completează RO_DATA din data.js (acolo sunt numele și industriile fiecărui județ).',
            '(function (D, X) { for (var k in X.counties) Object.assign(D.counties[k], X.counties[k]); D.nationalNet = X.net; D.nationalYear = X.year; })'
            '(window.RO_DATA, window.RO_COUNTY_PAY);', '']
    open(path, 'w', encoding='utf-8').write('\n'.join(out))


def main():
    args = set(sys.argv[1:])
    W = os.path.join(ROOT, 'work')
    if '--offline' not in args:
        print('1. Descarc datele brute în work/ ...')
        try: download.run(W)
        except Exception as e: sys.exit(f'\nActualizarea s-a oprit la descărcare; site-ul și baza au rămas neschimbate.\n{e}')
    else:
        print('1. Folosesc datele deja descărcate din work/')
    print('2. Prelucrez datele ...')
    manual = json.load(open(os.path.join(ROOT, 'data', 'manual.json'), encoding='utf-8'))
    data = build.run(W, manual)

    print('3. Construiesc baza de date și verific ...')
    updated = datetime.date.today().isoformat()
    tmp = DB_PATH + '.new'
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    con = db.write(tmp, data, {'updated': updated})
    s = db.site(con)
    built = dict(data['extra']); built['work'] = {k: v for k, v in built['work'].items() if not k.startswith('_')}
    err, warn = checks(s)
    if s['extra'] != built: err.append('datele citite din bază diferă de cele prelucrate (eroare în scripts/db.py)')
    for w in warn: print('  atenție:', w)
    if err:
        con.close(); os.remove(tmp)
        print('\nActualizarea s-a oprit; site-ul și baza au rămas neschimbate:'); [print('  ✗', e) for e in err]
        sys.exit(1)

    report(read_js(JS_PATH), as_js(s))
    if '--check' in args:
        con.close(); os.remove(tmp)
        print('\n(--check: nu am scris nimic.)'); return

    db.export_csv(con, os.path.join(ROOT, 'data', 'csv'))
    con.close()
    os.replace(tmp, DB_PATH)
    db.dictionary(os.path.join(ROOT, 'data', 'README.md'), {'updated': updated})
    write_js(JS_PATH, s, updated)
    print('\nGata. Am scris data/hartamuncii.sqlite, data/csv/, data/README.md și js/data-extra.js.')
    print('Deschide site-ul local ca să verifici, apoi fă commit și push.')


if __name__ == '__main__':
    main()
