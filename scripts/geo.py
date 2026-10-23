import json, sys, math
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src, encoding='utf-8'))
CODES = {'ALBA':'AB','ARAD':'AR','ARGES':'AG','BACAU':'BC','BIHOR':'BH','BISTRITA-NASAUD':'BN','BOTOSANI':'BT','BRAILA':'BR','BRASOV':'BV','BUZAU':'BZ','CALARASI':'CL','CARAS-SEVERIN':'CS','CLUJ':'CJ','CONSTANTA':'CT','COVASNA':'CV','DAMBOVITA':'DB','DOLJ':'DJ','GALATI':'GL','GIURGIU':'GR','GORJ':'GJ','HARGHITA':'HR','HUNEDOARA':'HD','IALOMITA':'IL','IASI':'IS','ILFOV':'IF','MARAMURES':'MM','MEHEDINTI':'MH','BUCURESTI':'B','MURES':'MS','NEAMT':'NT','OLT':'OT','PRAHOVA':'PH','SALAJ':'SJ','SATU MARE':'SM','SIBIU':'SB','SUCEAVA':'SV','TELEORMAN':'TR','TIMIS':'TM','TULCEA':'TL','VALCEA':'VL','VASLUI':'VS','VRANCEA':'VN'}
def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]
    dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy) or 1e-12
    dmax, idx = 0, 0
    for i in range(1, len(pts)-1):
        p = pts[i]
        dd = abs(dy*p[0]-dx*p[1]+b[0]*a[1]-b[1]*a[0])/L if (dx or dy) else math.hypot(p[0]-a[0], p[1]-a[1])
        if dd > dmax: dmax, idx = dd, i
    if dmax > eps:
        return rdp(pts[:idx+1], eps)[:-1] + rdp(pts[idx:], eps)
    return [a, b]
def ring(r, eps):
    # split closed ring into two halves so RDP keeps shape
    h = len(r)//2
    s = rdp(r[:h+1], eps)[:-1] + rdp(r[h:], eps)
    return [[round(x,3), round(y,3)] for x,y in s[:-1]]
res = []
for f in d['features']:
    n = f['properties']['shapeName']; g = f['geometry']
    polys = g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    eps = 0.002 if n=='BUCURESTI' else 0.006
    P = []
    for poly in polys:
        rings = [ring(r, eps) for r in poly]
        if len(rings[0]) >= 4: P.append([rg for rg in rings if len(rg) >= 4])
    res.append({'c': CODES[n], 'p': P})
    print(n, [len(r) for p in P for r in p])
open(out,'w',encoding='utf-8').write('/* Contururi județe: geoBoundaries ROU ADM1 (CC BY 4.0), simplificate */\nwindow.RO_GEO=' + json.dumps(res, separators=(',',':')) + ';\n')
