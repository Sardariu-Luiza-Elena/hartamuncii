"""Generează js/world.js: contururi Natural Earth 1:110m + persoane născute în România pe țări (ONU, International Migrant Stock 2024)."""
import json, sys
geo_src, un_src, out = sys.argv[1], sys.argv[2], sys.argv[3]
YEARS = ['1990', '1995', '2000', '2005', '2010', '2015', '2020', '2024']
RO = {276: 'Germania', 380: 'Italia', 826: 'Regatul Unit', 724: 'Spania', 348: 'Ungaria', 840: 'SUA', 40: 'Austria', 250: 'Franța', 56: 'Belgia',
      376: 'Israel', 124: 'Canada', 528: 'Olanda', 300: 'Grecia', 372: 'Irlanda', 208: 'Danemarca', 756: 'Elveția', 752: 'Suedia', 620: 'Portugalia',
      578: 'Norvegia', 36: 'Australia', 792: 'Turcia', 203: 'Cehia', 703: 'Slovacia', 442: 'Luxemburg', 196: 'Cipru', 100: 'Bulgaria', 246: 'Finlanda',
      470: 'Malta', 498: 'Republica Moldova', 352: 'Islanda', 392: 'Japonia', 688: 'Serbia', 616: 'Polonia', 643: 'Rusia', 858: 'Uruguay',
      862: 'Venezuela', 434: 'Libia', 484: 'Mexic', 705: 'Slovenia', 152: 'Chile', 417: 'Kârgâzstan', 191: 'Croația', 710: 'Africa de Sud',
      604: 'Peru', 440: 'Lituania', 70: 'Bosnia și Herțegovina', 591: 'Panama', 233: 'Estonia', 234: 'Insulele Feroe', 268: 'Georgia',
      170: 'Columbia', 674: 'San Marino', 188: 'Costa Rica', 60: 'Bermuda', 31: 'Azerbaidjan', 44: 'Bahamas', 499: 'Muntenegru',
      68: 'Bolivia', 428: 'Letonia', 76: 'Brazilia', 214: 'Republica Dominicană', 192: 'Cuba', 438: 'Liechtenstein', 516: 'Namibia',
      807: 'Macedonia de Nord', 112: 'Belarus', 304: 'Groenlanda', 32: 'Argentina', 324: 'Guineea', 642: 'România'}

def rnd(ring):
    out, last = [], None
    for x, y in ring:
        p = [round(x, 1), round(y, 1)]
        if p != last: out.append(p); last = p
    return out

d = json.load(open(geo_src, encoding='utf-8'))
countries = []
for f in d['features']:
    pr = f['properties']
    n3 = pr.get('ISO_N3_EH') or pr.get('ISO_N3')
    try: n3 = int(n3)
    except (TypeError, ValueError): n3 = -1
    g = f['geometry']
    polys = g['coordinates'] if g['type'] == 'MultiPolygon' else [g['coordinates']]
    polys = [[rnd(r) for r in poly] for poly in polys]
    polys = [[r for r in poly if len(r) >= 4] for poly in polys]
    polys = [p for p in polys if p]
    countries.append({'id': n3, 'en': pr['NAME_EN'], 'p': polys, 'lx': round(pr['LABEL_X'], 1), 'ly': round(pr['LABEL_Y'], 1)})

rows = json.load(open(un_src, encoding='utf-8'))
data, total = {}, None
for r in rows:
    vals = [int(r['y'][y] or 0) for y in YEARS]
    if r['code'] == 900: total = vals
    elif r['code'] < 900: data[r['code']] = vals
have = {c['id'] for c in countries}
missing = {k: v[-1] for k, v in data.items() if k not in have}
obj = {'years': [int(y) for y in YEARS], 'total': total, 'ro': {str(k): v for k, v in data.items()},
       'namesRo': {str(k): v for k, v in RO.items()}, 'c': countries}
open(out, 'w', encoding='utf-8').write(
    '/* Glob: contururi Natural Earth 1:110m (domeniu public); persoane născute în România pe țări de reședință: '
    'ONU, DESA, International Migrant Stock 2024 */\nwindow.WORLD=' + json.dumps(obj, ensure_ascii=False, separators=(',', ':')) + ';\n')
print('countries', len(countries), 'with data', len(data), 'missing geometry (small states):', missing)
