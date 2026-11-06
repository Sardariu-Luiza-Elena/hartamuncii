"""Baza de date a site-ului: data/hartamuncii.sqlite, plus fiecare tabel în data/csv/.
write() pune setul construit de build.py în tabele; site() citește tabelele înapoi în forma folosită de paginile JS.
Fișierul js/data-extra.js e generat din bază, deci tabelele sunt singura sursă a cifrelor de pe site."""
import csv, json, os, sqlite3

# Fiecare tabel: nume, descriere, sursă, coloane (nume, tip SQL, descriere).
TABLES = [
    ('county_salary', 'Câștigul salarial mediu net lunar, media anuală, pe județe. Rândul RO e media pe țară.',
     'INS TEMPO, FOM106E', 'http://statistici.insse.ro:8077/tempo-online/#/pages/tables/insse-table',
     [('county_code', 'TEXT', 'codul județului (RO = toată țara)'), ('county', 'TEXT', 'județul'), ('year', 'INTEGER', 'anul'),
      ('net_salary_lei', 'INTEGER', 'lei pe lună')]),
    ('eu_indicator', 'Indicatori pentru țările UE: ore lucrate pe săptămână (hours), tineri NEET (neet), săraci deși muncesc (iwp), '
     'angajarea absolvenților (grad). Clasamentul are toate țările UE în ultimul an; seriile în timp sunt pentru România, media UE și, la ore, Olanda.',
     'Eurostat: lfsa_ewhan2, edat_lfse_20, ilc_iw01, edat_lfse_24', 'https://ec.europa.eu/eurostat/databrowser/',
     [('indicator', 'TEXT', 'hours, neet, iwp sau grad'), ('country', 'TEXT', 'cod de țară Eurostat (EU27_2020 = media UE)'),
      ('year', 'INTEGER', 'anul'), ('value', 'REAL', 'ore pe săptămână sau procent')]),
    ('graduate_employment_by_level', 'Rata de ocupare a tinerilor de 20–34 de ani la 1–3 ani după absolvire, pe nivel de educație (ISCED).',
     'Eurostat, edat_lfse_24', 'https://ec.europa.eu/eurostat/databrowser/view/edat_lfse_24/default/table',
     [('country', 'TEXT', 'RO sau EU'), ('isced_level', 'TEXT', 'nivelul de educație, cod ISCED 2011'), ('value', 'REAL', 'procent')]),
    ('diaspora_series', 'Cetățeni români rezidenți în fiecare țară, pe ani.',
     'Eurostat, migr_pop1ctz', 'https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table',
     [('country', 'TEXT', 'cod de țară'), ('year', 'INTEGER', 'anul'), ('romanian_citizens', 'INTEGER', 'persoane')]),
    ('diaspora_latest', 'Comunitățile de români, cel mai recent an disponibil pentru fiecare țară, și ponderea în populația țării.',
     'Eurostat migr_pop1ctz, tps00001, cens_21ctz_r3; ONS (Regatul Unit)', 'https://ec.europa.eu/eurostat/databrowser/view/migr_pop1ctz/default/table',
     [('country', 'TEXT', 'cod de țară'), ('romanian_citizens', 'INTEGER', 'persoane'), ('year', 'INTEGER', 'anul datelor'),
      ('share_of_population_pct', 'REAL', '% din populația țării'), ('note', 'TEXT', 'precizări despre sursă')]),
    ('sector_employment_change', 'Variația numărului de lucrători pe domenii. Perioadele sunt separate din cauza schimbării de metodologie din 2021.',
     'Eurostat, lfsa_egan2', 'https://ec.europa.eu/eurostat/databrowser/view/lfsa_egan2/default/table',
     [('period_from', 'TEXT', 'anul de început'), ('period_to', 'TEXT', 'anul de sfârșit'), ('sector', 'TEXT', 'domeniul'),
      ('change_pct', 'REAL', 'variația, %'), ('employed_start_thousands', 'INTEGER', 'mii de lucrători la început'),
      ('employed_end_thousands', 'INTEGER', 'mii de lucrători la sfârșit')]),
    ('sector_work', 'Munca pe domenii (secțiuni CAEN): salariu, ore, câștig pe oră, accidente mortale, lucrători. '
     'TOTAL = toată economia; C16_31 = lemn și mobilă (diviziile 16 și 31).',
     'INS, câștigul salarial lunar (anexa din decembrie); Eurostat lfsa_ewhan2, hsw_n2_02, lfsa_egan2', 'https://insse.ro/cms/ro/content/castiguri-salariale',
     [('sector_code', 'TEXT', 'secțiunea CAEN'), ('sector', 'TEXT', 'domeniul'), ('net_salary_lei', 'INTEGER', 'salariul mediu net lunar'),
      ('hours_ro', 'REAL', 'ore pe săptămână, salariați, România'), ('hours_eu', 'REAL', 'ore pe săptămână, salariați, media UE'),
      ('net_lei_per_hour', 'REAL', 'câștig net pe oră'), ('fatal_accidents_ro', 'REAL', 'accidente mortale la 100.000 de lucrători, România'),
      ('fatal_accidents_eu', 'REAL', 'accidente mortale la 100.000 de lucrători, media UE'), ('employed_thousands', 'REAL', 'mii de lucrători')]),
    ('sector_share', 'Ponderea marilor sectoare în populația ocupată.', 'Eurostat, lfsa_egan2',
     'https://ec.europa.eu/eurostat/databrowser/view/lfsa_egan2/default/table',
     [('sector_group', 'TEXT', 'marele sector'), ('year', 'INTEGER', 'anul'), ('share_pct', 'REAL', '% din populația ocupată')]),
    ('remittances', 'Banii trimiși acasă de românii din străinătate și investițiile străine directe. Remitențele în dolari sunt doar din 2013, din cauza unei schimbări de înregistrare.',
     'Banca Mondială: BX.TRF.PWKR.CD.DT, BX.KLT.DINV.CD.WD, BX.TRF.PWKR.DT.GD.ZS', 'https://data.worldbank.org/indicator/BX.TRF.PWKR.CD.DT?locations=RO',
     [('year', 'INTEGER', 'anul'), ('remittances_bn_usd', 'REAL', 'remitențe, mld. $'), ('fdi_bn_usd', 'REAL', 'investiții străine directe, mld. $'),
      ('remittances_pct_gdp', 'REAL', 'remitențe, % din PIB')]),
    ('migration_flows', 'Cetățeni români care s-au întors în țară și care au plecat, pe ani.', 'Eurostat: migr_imm1ctz, migr_emi1ctz',
     'https://ec.europa.eu/eurostat/databrowser/view/migr_emi1ctz/default/table',
     [('year', 'INTEGER', 'anul'), ('returned', 'INTEGER', 'întorși'), ('emigrated', 'INTEGER', 'plecați')]),
    ('hourly_earnings_by_occupation', 'Câștigul brut pe oră, pe grupe de ocupații, firme cu 10+ angajați.', 'Eurostat, earn_ses22_47 (ancheta salariilor 2022)',
     'https://ec.europa.eu/eurostat/databrowser/view/earn_ses22_47/default/table',
     [('occupation', 'TEXT', 'grupa ISCO-08 (TOTAL = toate)'), ('country', 'TEXT', 'cod de țară'), ('unit', 'TEXT', 'EUR sau PPS (standard de putere de cumpărare)'),
      ('value', 'REAL', 'câștig pe oră')]),
    ('children_parents_abroad', 'Copii cu părinți plecați la muncă în străinătate (introdus de mână din data/manual.json).', 'ANPDCA, prin Economedia',
     'https://economedia.ro/?p=330015',
     [('date', 'TEXT', 'data situației'), ('any_parent', 'INTEGER', 'cu cel puțin un părinte plecat'), ('both_parents', 'INTEGER', 'cu ambii părinți plecați'),
      ('one_parent', 'INTEGER', 'cu un părinte plecat'), ('sole_parent', 'INTEGER', 'cu singurul părinte plecat'),
      ('any_parent_prev_year', 'INTEGER', 'cu cel puțin un părinte plecat, anul anterior'), ('both_parents_prev_year', 'INTEGER', 'cu ambii părinți plecați, anul anterior')]),
    ('pay_distribution', 'Salariații din sectorul privat pe tranșe de venit (introdus de mână din data/manual.json). Netul e aproximativ.',
     'INS, prin Ziarul Financiar', 'https://www.zf.ro/eveniment/varful-salariilor-subtire-1-5-dintre-angajati-depasesc-venituri-30-22964480',
     [('band', 'INTEGER', 'ordinea tranșei'), ('gross_band', 'TEXT', 'venit brut, lei'), ('net_band', 'TEXT', 'echivalent net aproximativ, lei'),
      ('employees_millions', 'REAL', 'milioane de salariați')]),
    ('meta', 'Informații despre actualizare și câteva valori singulare folosite pe site (în format JSON).', '', '',
     [('key', 'TEXT', 'cheia'), ('value', 'TEXT', 'valoarea, JSON')]),
]
KIDS = [('any_parent', 'any'), ('both_parents', 'both'), ('one_parent', 'one'), ('sole_parent', 'sole'),
        ('any_parent_prev_year', 'anyPrev'), ('both_parents_prev_year', 'bothPrev')]
TREND_GEOS = {'hours': ('RO', 'EU27_2020', 'NL'), 'neet': ('RO', 'EU27_2020'), 'iwp': ('RO', 'EU27_2020'), 'grad': ('RO', 'EU27_2020')}
EU = {'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'EL', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
      'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE'}


def write(path, data, meta):
    """Scrie setul construit de build.run() într-o bază nouă (fișierul vechi e înlocuit)."""
    from build import COUNTIES
    if os.path.exists(path): os.remove(path)
    con = sqlite3.connect(path)
    for name, _, _, _, cols in TABLES:
        con.execute(f'CREATE TABLE {name} (' + ', '.join(f'"{c}" {t}' for c, t, _ in cols) + ')')
    ins = lambda t, rows: con.executemany(f'INSERT INTO {t} VALUES (' + ','.join('?' * len(rows[0])) + ')', rows) if rows else None
    X, C = data['extra'], data['counties']

    ins('county_salary', [(c, 'România' if c == 'RO' else COUNTIES[c], y, v)
                          for c, vals in [('RO', C['national'])] + list(C['values'].items()) for y, v in sorted(vals.items())])
    rows = {}
    for ind in ('hours', 'neet', 'iwp', 'grad'):
        for g, v in X[ind]['rows']: rows[(ind, g, X[ind]['year'])] = v
        rows[(ind, 'EU27_2020', X[ind]['year'])] = X[ind]['eu']
        for g, ser in X[ind]['trend'].items():
            for y, v in ser.items(): rows[(ind, g, int(y))] = v
    ins('eu_indicator', [(*k, v) for k, v in sorted(rows.items())])
    ins('graduate_employment_by_level', [(g, lvl, v) for g, d in X['grad']['levels'].items() for lvl, v in sorted(d.items())])
    ins('diaspora_series', [(d['id'], int(y), v) for d in X['diaspora'] for y, v in d['ser'].items()])
    ins('diaspora_latest', [(d['id'], d['n'], d['y'], d['pct'], d.get('note')) for d in X['diaspora']])
    ins('sector_employment_change', [(p['from'], p['to'], *r) for p in X['sect'].values() for r in p['rows']])
    W = X['work']
    ins('sector_work', [(r['k'], r['t'], r['net'], r['h'], r['hEU'], r['perH'], r['acc'], r['accEU'], r['emp']) for r in W['rows']] +
        [('TOTAL', 'Toată economia', W['avgNet'], W['avgH'], None, W['avgPerH'], W['accRO'], W['accEU'], None),
         ('C16_31', 'Lemn și mobilă', W['wood'], None, None, None, None, None, None)])
    ins('sector_share', [(r['k'], int(data['split']['year']), r['v']) for r in data['split']['rows']])
    M = X['mig']
    yrs = sorted({*M['remit'], *M['fdi'], *M['remitGdp']}, key=int)
    ins('remittances', [(int(y), M['remit'].get(y), M['fdi'].get(y), M['remitGdp'].get(y)) for y in yrs])
    ins('migration_flows', [(int(y), M['ret']['in'].get(y), M['ret']['out'].get(y)) for y in sorted({*M['ret']['in'], *M['ret']['out']}, key=int)])
    ins('hourly_earnings_by_occupation', [(o, g, u, v) for o, units in M['occ'].items() for u, d in units.items() for g, v in d.items()])
    ins('children_parents_abroad', [(M['kids']['date'], *[M['kids'][k] for _, k in KIDS])])
    P = data['pay']
    ins('pay_distribution', [(i + 1, b['gross'], b['net'], b['n']) for i, b in enumerate(P['bins'])])
    meta = {**meta, 'counties_year': C['year'], 'work_year': W['year'], 'work_years': W.get('_years'),
            'pay_total_millions': P['total'], 'pay_month': P['month'], 'min_wage': P['minWage']}
    ins('meta', [(k, json.dumps(v, ensure_ascii=False)) for k, v in meta.items()])
    con.commit()
    return con


def site(con):
    """Citește tabelele înapoi în forma folosită de js/data-extra.js."""
    q = lambda sql, *a: con.execute(sql, a).fetchall()
    meta = {k: json.loads(v) for k, v in q('SELECT key, value FROM meta')}

    X = {'diaspora': []}
    ser = {}
    for c, y, v in q('SELECT country, year, romanian_citizens FROM diaspora_series ORDER BY country, year'):
        ser.setdefault(c, {})[str(y)] = v
    for c, n, y, pct, note in q('SELECT * FROM diaspora_latest'):
        d = {'id': c, 'n': n, 'y': y, 'pct': pct}
        if note: d['note'] = note
        d['ser'] = ser.get(c, {})
        X['diaspora'].append(d)
    X['diaspora'].sort(key=lambda d: -d['n'])

    for ind in ('hours', 'neet', 'iwp', 'grad'):
        year = q('SELECT MAX(year) FROM eu_indicator WHERE indicator = ? AND country = ?', ind, 'EU27_2020')[0][0]
        vals = dict(q('SELECT country, value FROM eu_indicator WHERE indicator = ? AND year = ?', ind, year))
        rows = sorted([[g, v] for g, v in vals.items() if g in EU and v], key=lambda r: (-r[1], r[0]))
        trend = {}
        for g in TREND_GEOS[ind]:
            trend[g] = {str(y): v for y, v in q('SELECT year, value FROM eu_indicator WHERE indicator = ? AND country = ? ORDER BY year', ind, g)}
        X[ind] = {'year': year, 'eu': vals['EU27_2020'], 'rows': rows, 'trend': trend}
    lv = {}
    for g, lvl, v in q('SELECT * FROM graduate_employment_by_level'): lv.setdefault(g, {})[lvl] = v
    X['grad']['levels'] = lv

    X['sect'] = {}
    for i, (a, b) in enumerate(q('SELECT DISTINCT period_from, period_to FROM sector_employment_change ORDER BY period_from')):
        rows = [list(r) for r in q('SELECT sector, change_pct, employed_start_thousands, employed_end_thousands FROM sector_employment_change '
                                   'WHERE period_from = ? AND period_to = ?', a, b)]
        X['sect'][f'p{i + 1}'] = {'from': a, 'to': b, 'rows': sorted(rows, key=lambda r: (-r[1], r[0]))}

    sw = {r[0]: r for r in q('SELECT * FROM sector_work')}
    tot = sw.pop('TOTAL'); wood = sw.pop('C16_31')
    X['work'] = {'wood': wood[2], 'year': meta['work_year'], 'avgNet': tot[2], 'avgH': tot[3], 'avgPerH': tot[5], 'accRO': tot[6], 'accEU': tot[7],
                 'rows': [{'k': r[0], 't': r[1], 'net': r[2], 'h': r[3], 'hEU': r[4], 'perH': r[5], 'acc': r[6], 'accEU': r[7], 'emp': r[8]}
                          for r in sorted(sw.values())]}

    rem = q('SELECT * FROM remittances ORDER BY year DESC')
    flows = q('SELECT * FROM migration_flows ORDER BY year')
    occ = {}
    for o, g, u, v in q('SELECT * FROM hourly_earnings_by_occupation'): occ.setdefault(o, {}).setdefault(u, {})[g] = v
    kid = q('SELECT * FROM children_parents_abroad')[0]
    X['mig'] = {'remit': {str(y): r for y, r, _, _ in rem if r is not None}, 'fdi': {str(y): f for y, _, f, _ in rem if f is not None},
                'remitGdp': {str(y): g for y, _, _, g in rem if g is not None},
                'ret': {'in': {str(y): i for y, i, _ in flows if i is not None}, 'out': {str(y): o for y, _, o in flows if o is not None}},
                'occ': occ, 'kids': {'date': kid[0], **{k: kid[i + 1] for i, (_, k) in enumerate(KIDS)}}}

    pay = {'total': meta['pay_total_millions'], 'month': meta['pay_month'],
           'bins': [{'gross': g, 'net': n, 'n': v} for _, g, n, v in q('SELECT * FROM pay_distribution ORDER BY band')],
           'minWage': meta['min_wage']}
    split = [{'k': k, 'v': v} for k, v in q('SELECT sector_group, share_pct FROM sector_share ORDER BY share_pct DESC')]

    cy = meta['counties_year']
    cs = {c: v for c, v in q('SELECT county_code, net_salary_lei FROM county_salary WHERE year = ?', cy)}
    prev = {c: v for c, v in q('SELECT county_code, net_salary_lei FROM county_salary WHERE year = ?', cy - 1)}
    counties = {c: {'s': v, 'g': round((v / prev[c] - 1) * 100, 1)} for c, v in cs.items() if c != 'RO'}
    return {'extra': X, 'pay': pay, 'split': split, 'counties': counties, 'national': {'net': cs['RO'], 'year': cy}, 'meta': meta}


def export_csv(con, folder):
    os.makedirs(folder, exist_ok=True)
    for name, *_ in TABLES:
        cur = con.execute(f'SELECT * FROM {name}')
        with open(os.path.join(folder, name + '.csv'), 'w', encoding='utf-8-sig', newline='') as f:
            w = csv.writer(f); w.writerow([d[0] for d in cur.description]); w.writerows(cur.fetchall())


def dictionary(path, meta):
    """Scrie data/README.md: ce conține fiecare tabel, de unde vine și ce înseamnă fiecare coloană."""
    out = ['# Datele din spatele site-ului', '',
           'Toate cifrele de pe [HartaMuncii](https://sardariu-luiza-elena.github.io/hartamuncii/) sunt în baza SQLite '
           '[`hartamuncii.sqlite`](hartamuncii.sqlite) și, tabel cu tabel, în [`csv/`](csv/) (UTF-8, separator virgulă).', '',
           f'Ultima actualizare: **{meta["updated"]}**. Fișierele sunt generate de `python scripts/update.py`; nu le edita de mână. '
           'Cifrele fără sursă descărcabilă automat se schimbă în [`manual.json`](manual.json).', '']
    for name, desc, src, url, cols in TABLES:
        if name == 'meta': continue
        out += [f'## `{name}`', '', desc, '', f'Sursa: {f"[{src}]({url})" if url else src}', '', '| Coloană | Tip | Descriere |', '|---|---|---|']
        out += [f'| `{c}` | {t} | {d} |' for c, t, d in cols] + ['']
    open(path, 'w', encoding='utf-8').write('\n'.join(out))
