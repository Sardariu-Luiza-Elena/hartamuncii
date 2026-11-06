"""Citește formatul JSON-stat de la Eurostat. Rulat direct, afișează un fișier pe scurt: python scripts/jstat.py fișier.json [ani]"""
import json, sys


def flat(path):
    """Toate valorile dintr-un fișier JSON-stat, ca listă de (coordonate, valoare); coordonatele sunt un dicționar dimensiune → cod."""
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


def table(path):
    """Valorile ca {țară: {an: valoare}}, pentru fișierele în care celelalte dimensiuni au o singură categorie."""
    d = json.load(open(path, encoding='utf-8'))
    out = {}
    for co, val in flat(path):
        out.setdefault(co['geo'], {})[co['time']] = val
    return d, out


if __name__ == '__main__':
    d, t = table(sys.argv[1])
    print(d['label'][:120]); print({k: list(v['category']['index'].keys())[:4] for k, v in d['dimension'].items() if k not in ('geo', 'time')})
    yrs = sorted({y for v in t.values() for y in v})[-int(sys.argv[2]) if len(sys.argv) > 2 else -3:]
    for g in sorted(t): print(g, [t[g].get(y) for y in yrs])
    print('years', yrs)
