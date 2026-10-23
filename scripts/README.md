# Scripturile de date

Cu aceste scripturi se pot reface toate cifrele de pe site, pornind de la datele oficiale brute.

## Cerințe

- Python 3.10+, cu `pip install openpyxl xlrd`
- `curl` și `bash`; pe Windows merge din Git Bash

## Ordinea de rulare

```bash
bash scripts/download.sh work                           # 1. descarcă datele brute în ./work

python scripts/geo.py    work/geo/ro.geojson       js/geo.js      # 2. contururi județe (harta 3D)
python scripts/europe.py work/geo/world50.geojson  js/europe.js   #    contururi Europa
python scripts/un_extract.py work/un/ims.xlsx work/un/ro_origin.json
python scripts/world.py  work/geo/world110.geojson work/un/ro_origin.json js/world.js   # glob

python scripts/extra.py      work js/data-extra.js      # 3. diaspora UE, ore, NEET, sărăcie
python scripts/grad_sect.py  work js/data-extra.js      #    ocupare pe domenii în timp
python scripts/work.py       work js/data-extra.js      #    salariu pe oră, ore, accidente pe domenii
python scripts/mig.py        work js/data-extra.js      #    remitențe, plecări/întoarceri, salarii pe meserii
```

`jstat.py` e un ajutor comun: citește formatul JSON-stat de la Eurostat.

## Ce e adăugat manual (și de ce)

Câteva cifre nu au o sursă care se poate descărca automat. Sunt scrise direct în `js/data.js`, cu sursa în comentariu și pe site:

| Ce | Unde | Sursa |
|---|---|---|
| Salariile pe județe 2024 | `js/data.js` (`counties`) | INS TEMPO FOM106E; se descarcă cu `tempo_county_salary.py` și se copiază în fișier |
| Distribuția salariilor, oct. 2024 | `RO_PAY_DIST` | Ancheta INS a salariilor, prin Ziarul Financiar (tabelul INS nu e publicat ca fișier) |
| Salariații la salariul minim | `RO_PAY_DIST.minWage` | Comunicat Ministerul Muncii, nov. 2024 |
| Grecia, Cipru, Malta | `js/data-extra.js` (`diaspora`) | Recensământul 2021, Eurostat `cens_21ctz_r3` (`work/euro/cens_el.json`) |
| Regatul Unit | `js/data-extra.js` (`diaspora`) | ONS, recensământul 2021 |
| Copiii cu părinți plecați | `js/data-extra.js` (`mig.kids`) | ANPDCA, situația la 31.12.2025 |
| Munca nedeclarată | `index.html` | European Labour Authority, factsheet România 2023 |
| Industriile de top pe județe | `js/data.js` | Sinteză editorială, nu o statistică |

Toate sursele, cu linkuri, sunt și pe site, în secțiunea **Surse și metodă**.
