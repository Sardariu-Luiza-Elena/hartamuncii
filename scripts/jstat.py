import json, sys, itertools
def table(path):
    d=json.load(open(path,encoding='utf-8'))
    ids=d['id']; size=d['size']; dims=d['dimension']
    cats={k:sorted(dims[k]['category']['index'].items(), key=lambda x:x[1]) for k in ids}
    out={}
    for idx,val in d['value'].items():
        i=int(idx); coords=[]
        for k,sz in zip(reversed(ids),reversed(size)):
            coords.append(cats[k][i%sz][0]); i//=sz
        coords=dict(zip(reversed(ids),coords))
        out.setdefault(coords['geo'],{})[coords['time']]=val
    return d, out
if __name__=='__main__':
    d,t=table(sys.argv[1])
    print(d['label'][:120]); print({k:list(v['category']['index'].keys())[:4] for k,v in d['dimension'].items() if k not in('geo','time')})
    yrs=sorted({y for v in t.values() for y in v})[-int(sys.argv[2]) if len(sys.argv)>2 else -3:]
    for g in sorted(t): print(g, [t[g].get(y) for y in yrs])
    print('years',yrs)
