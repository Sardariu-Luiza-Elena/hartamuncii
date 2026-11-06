"""Descarcă datele brute folosite pe site într-un folder de lucru (implicit: ./work).
Anii nu sunt scriși de mână: pentru INS se caută cel mai nou fișier publicat, iar Eurostat și Banca Mondială
trimit toate datele de la anul de pornire încoace (scripturile de prelucrare aleg singure cel mai nou an).
Folosire: python scripts/download.py [folder] [--shapes]
Cu --shapes descarcă în plus contururile hărților și tabelul ONU pentru glob (se schimbă rar, nu fac parte din actualizarea obișnuită)."""
import datetime, json, os, sys, time, urllib.error, urllib.request

E = 'https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/'
UA = 'Mozilla/5.0 (compatible; hartamuncii-data/2.0)'

EUROSTAT = {
    'pop_ro':      'migr_pop1ctz?citizen=RO&age=TOTAL&sex=T&unit=NR&sinceTimePeriod=2010',
    'pop_tot':     'tps00001?sinceTimePeriod=2024',
    'neet':        'edat_lfse_20?age=Y15-29&sex=T&training=NO_FE_NO_NFE&wstatus=NEMP&sinceTimePeriod=2015',
    'iwp':         'ilc_iw01?age=Y18-64&sex=T&wstatus=EMP&unit=PC&sinceTimePeriod=2015',
    'hours':       'lfsa_ewhan2?age=Y20-64&sex=T&worktime=TOTAL&wstatus=EMP&nace_r2=TOTAL&sinceTimePeriod=2024',
    'hours_ts':    'lfsa_ewhan2?age=Y20-64&sex=T&worktime=TOTAL&wstatus=EMP&nace_r2=TOTAL&geo=RO&geo=EU27_2020&geo=NL&sinceTimePeriod=2010',
    'hours_nace':  'lfsa_ewhan2?geo=RO&geo=EU27_2020&sex=T&age=Y20-64&worktime=TOTAL&wstatus=SAL&sinceTimePeriod=2025',
    'grad':        'edat_lfse_24?sex=T&age=Y20-34&duration=Y1-3&isced11=ED5-8&sinceTimePeriod=2012',
    'grad_lvl':    'edat_lfse_24?geo=RO&geo=EU27_2020&sex=T&age=Y20-34&duration=Y1-3&sinceTimePeriod=2025',
    'emp_nace_ts': 'lfsa_egan2?geo=RO&sex=T&age=Y15-74&sinceTimePeriod=2008',
    'acc_fatal':   'hsw_n2_02?geo=RO&geo=EU27_2020&sinceTimePeriod=2020',
    'imm_ro':      'migr_imm1ctz?geo=RO&citizen=RO&age=TOTAL&agedef=COMPLET&sex=T&unit=NR&sinceTimePeriod=2010',
    'emi_ro':      'migr_emi1ctz?geo=RO&citizen=RO&age=TOTAL&agedef=COMPLET&sex=T&unit=NR&sinceTimePeriod=2010',
    'ses47':       'earn_ses22_47?geo=RO&geo=IT&geo=DE&geo=ES&geo=AT&geo=FR&sex=T&nace_r2=B-S_X_O',
    'cens_el':     'cens_21ctz_r3?geo=EL&geo=CY&geo=MT&citizen=RO&citizen=TOTAL&age=TOTAL',
}
WORLD_BANK = ['BX.TRF.PWKR.CD.DT', 'BX.TRF.PWKR.DT.GD.ZS', 'BX.KLT.DINV.CD.WD']
TEMPO = 'http://statistici.insse.ro:8077/tempo-ins/'
SHAPES = {
    'geo/ro.geojson': 'https://github.com/wmgeolab/geoBoundaries/raw/9469f09/releaseData/gbOpen/ROU/ADM1/geoBoundaries-ROU-ADM1_simplified.geojson',
    'geo/world50.geojson': 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_50m_admin_0_countries.geojson',
    'geo/world110.geojson': 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_110m_admin_0_countries.geojson',
    'un/ims.xlsx': 'https://www.un.org/development/desa/pd/sites/www.un.org.development.desa.pd/files/undesa_pd_2024_ims_stock_by_sex_destination_and_origin.xlsx',
}


def fetch(url, data=None, headers=None, tries=4):
    h = {'User-Agent': UA, **(headers or {})}
    for i in range(tries):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, data=data, headers=h), timeout=120).read()
        except urllib.error.HTTPError as e:
            if e.code == 404: raise
            err = e
        except (urllib.error.URLError, TimeoutError) as e:
            err = e
        if i < tries - 1: time.sleep(5 * 2 ** i)
    raise RuntimeError(f'Nu am putut descărca {url}\n  ({err})\n  Serverul sursei nu răspunde acum. Încearcă din nou peste câteva minute.')


def save(path, blob):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'wb').write(blob)


def ins_monthly_annex(W):
    """Anexa INS din decembrie are salariile pe toate cele 12 luni. Caută cel mai nou an publicat."""
    this = datetime.date.today().year
    for y in range(this, this - 3, -1):
        yy = str(y)[2:]
        url = f'https://insse.ro/cms/files/statistici/comunicate/castiguri/a{yy}/cs12r{yy}.xls'
        try:
            save(f'{W}/ins/cs12.xls', fetch(url))
            json.dump({'year': y, 'url': url}, open(f'{W}/ins/cs12.json', 'w'))
            return y
        except urllib.error.HTTPError:
            continue
    raise RuntimeError('Nu am găsit anexa INS din decembrie (cs12rYY.xls) pentru ultimii 3 ani.')


def tempo_county_salary(W):
    """INS TEMPO FOM106E: câștigul salarial mediu net lunar, media anuală, pe județe, ultimii 2 ani disponibili."""
    meta = json.loads(fetch(TEMPO + 'matrix/FOM106E'))
    years = sorted(o['label'][-4:] for d in meta['dimensionsMap'] if d['label'].startswith('Ani') for o in d['options'])[-2:]

    def pick(label, opts):
        if 'judete' in label.lower(): return [o for o in opts if not any(w in o['label'].lower() for w in ('macroregiunea', 'regiunea'))]
        if label.startswith('Ani'): return [o for o in opts if o['label'][-4:] in years]
        if label.startswith('UM'): return opts
        return [o for o in opts if o['label'].strip().upper() == 'TOTAL'][:1] or opts[:1]

    parts = [','.join(str(o['nomItemId']) for o in pick(d['label'], d['options'])) for d in meta['dimensionsMap']]
    body = {'encQuery': ':'.join(parts), 'language': 'ro', 'matCode': 'FOM106E', 'matMaxDim': meta['details']['matMaxDim'],
            'matUMSpec': meta['details']['matUMSpec'], 'matRegJ': meta['details'].get('matRegJ', 0), 'matrixName': meta['matrixName']}
    save(f'{W}/ins/fom106e.csv', fetch(TEMPO + 'pivot', json.dumps(body).encode(), {'Content-Type': 'application/json'}))
    return years


def run(W):
    for name, q in EUROSTAT.items():
        print(f'  Eurostat  {name}'); save(f'{W}/euro/{name}.json', fetch(E + q))
    for ind in WORLD_BANK:
        print(f'  Banca Mondială  {ind}')
        save(f'{W}/wb/{ind}.json', fetch(f'https://api.worldbank.org/v2/country/ROU/indicator/{ind}?format=json&per_page=80&date=2000:{datetime.date.today().year}'))
    print(f'  INS  anexa salarii lunare: {ins_monthly_annex(W)}')
    print(f'  INS  TEMPO FOM106E, salarii pe județe: {", ".join(tempo_county_salary(W))}')


def shapes(W):
    for path, url in SHAPES.items():
        print(f'  {path}'); save(f'{W}/{path}', fetch(url))


if __name__ == '__main__':
    pos = [a for a in sys.argv[1:] if not a.startswith('--')]
    W = pos[0] if pos else 'work'
    run(W)
    if '--shapes' in sys.argv: shapes(W)
    print(f'Gata. Datele brute sunt în {W}/')
