import json, sys, math
src, out = sys.argv[1], sys.argv[2]
d = json.load(open(src, encoding='utf-8'))
L0, P0 = math.radians(14), math.radians(52)
def proj(lon, lat):
    l, p = math.radians(lon), math.radians(lat)
    k = math.sqrt(2/(1+math.sin(P0)*math.sin(p)+math.cos(P0)*math.cos(p)*math.cos(l-L0)))
    return k*math.cos(p)*math.sin(l-L0), -k*(math.cos(P0)*math.sin(p)-math.sin(P0)*math.cos(p)*math.cos(l-L0))
# fereastra vizibilă
corners = [proj(-11, 36), proj(-11, 66), proj(40, 36), proj(40, 66), proj(14, 71.5), proj(14, 34.5)]
x0 = min(c[0] for c in corners); x1 = max(c[0] for c in corners)
y0 = min(c[1] for c in corners); y1 = max(c[1] for c in corners)
W = 1000; S = W/(x1-x0); H = round((y1-y0)*S)
def P(lon, lat):
    x, y = proj(lon, lat); return ((x-x0)*S, (y-y0)*S)
def rdp(pts, eps):
    if len(pts) < 3: return pts
    a, b = pts[0], pts[-1]; dx, dy = b[0]-a[0], b[1]-a[1]; L = math.hypot(dx, dy) or 1e-9
    dm, ix = 0, 0
    for i in range(1, len(pts)-1):
        q = pts[i]; dd = abs(dy*q[0]-dx*q[1]+b[0]*a[1]-b[1]*a[0])/L
        if dd > dm: dm, ix = dd, i
    return rdp(pts[:ix+1], eps)[:-1]+rdp(pts[ix:], eps) if dm > eps else [a, b]
NAMES = {'AT':'Austria','BE':'Belgia','BG':'Bulgaria','HR':'Croația','CY':'Cipru','CZ':'Cehia','DK':'Danemarca','EE':'Estonia','FI':'Finlanda','FR':'Franța','DE':'Germania','EL':'Grecia','HU':'Ungaria','IE':'Irlanda','IT':'Italia','LV':'Letonia','LT':'Lituania','LU':'Luxemburg','MT':'Malta','NL':'Olanda','PL':'Polonia','PT':'Portugalia','RO':'România','SK':'Slovacia','SI':'Slovenia','ES':'Spania','SE':'Suedia','UK':'Regatul Unit','NO':'Norvegia','CH':'Elveția','IS':'Islanda','MD':'Moldova','UA':'Ucraina','RS':'Serbia','TR':'Turcia','BY':'Belarus','RU':'Rusia','BA':'Bosnia','ME':'Muntenegru','AL':'Albania','MK':'Macedonia de Nord','XK':'Kosovo','LI':'Liechtenstein'}
res = []
for f in d['features']:
    pr = f['properties']; iso = pr.get('ISO_A2_EH') or pr.get('ISO_A2')
    iso = {'GR':'EL','GB':'UK'}.get(iso, iso)
    if pr.get('NAME') == 'Kosovo': iso = 'XK'
    g = f['geometry']; polys = g['coordinates'] if g['type']=='MultiPolygon' else [g['coordinates']]
    parts = []
    for poly in polys:
        ring = poly[0]
        clon = sum(p[0] for p in ring)/len(ring); clat = sum(p[1] for p in ring)/len(ring)
        if not (-30 < clon < 70 and 22 < clat < 75): continue
        full = [P(*p) for p in ring]; h = len(full)//2
        pts = rdp(full[:h+1], 0.9)[:-1] + rdp(full[h:], 0.9)
        if len(pts) < 4: continue
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        if max(xs) < -50 or min(xs) > W+50 or max(ys) < -50 or min(ys) > H+50: continue
        parts.append('M' + 'L'.join(f'{x:.1f},{y:.1f}' for x, y in pts) + 'Z')
    if not parts: continue
    lx, ly = P(pr['LABEL_X'], pr['LABEL_Y'])
    res.append({'id': iso, 'n': NAMES.get(iso, pr['NAME']), 'd': ''.join(parts), 'lx': round(lx,1), 'ly': round(ly,1)})
open(out, 'w', encoding='utf-8').write('/* Contururi Europa: Natural Earth 1:50m (domeniu public), proiecție Lambert azimutală echivalentă */\nwindow.EU_GEO=' + json.dumps({'w': W, 'h': H, 'c': res}, ensure_ascii=False, separators=(',',':')) + ';\n')
print(W, H, len(res), [r['id'] for r in res])
