# Scripturile de date

Toate cifrele de pe site vin din baza de date [`data/hartamuncii.sqlite`](../data/README.md), iar baza se reface din datele oficiale cu o singură comandă.

## Cum actualizezi datele

O singură dată, instalează biblioteca care citește fișierele Excel de la INS:

```bash
pip install xlrd
```

Apoi, oricând vrei să verifici dacă au apărut date noi:

```bash
python scripts/update.py --check   # descarcă și arată ce s-ar schimba, fără să scrie nimic
python scripts/update.py           # descarcă, reface baza și site-ul
```

Comanda:

1. descarcă datele brute în `work/` (Eurostat, INS, Banca Mondială); anii se aleg automat, deci nu trebuie schimbat nimic în cod când apare un an nou;
2. le prelucrează și verifică dacă au sens (42 de județe, 27 de țări UE, valori plauzibile); dacă ceva nu e în regulă, se oprește și nu modifică nimic;
3. scrie baza `data/hartamuncii.sqlite`, tabelele `data/csv/` și `data/README.md`;
4. generează `js/data-extra.js` din bază;
5. afișează ce s-a schimbat față de versiunea de pe site și ce texte scrise de mână pomenesc anii vechi, ca să le poți actualiza.

La final, deschide site-ul local, verifică, apoi fă commit și push.

Dacă o sursă nu răspunde (se întâmplă, de exemplu, la Banca Mondială), comanda se oprește fără să strice nimic; încearcă din nou mai târziu. Cu `--offline` poți reface baza din datele deja descărcate.

## Cifrele introduse de mână

Câteva date nu au o sursă care se poate descărca automat. Sunt toate în [`data/manual.json`](../data/manual.json), cu sursa lângă fiecare: distribuția salariilor pe tranșe și salariul minim, copiii cu părinți plecați, românii din Regatul Unit. Când apar cifre noi, le schimbi acolo și rulezi `python scripts/update.py`.

Mai sunt scrise direct în pagini:

| Ce | Unde | Sursa |
|---|---|---|
| Industriile de top pe județe | `js/data.js` | Sinteză editorială, nu o statistică |
| Munca nedeclarată | `index.html` | European Labour Authority, factsheet România 2023 |
| Ocuparea pe sexe, urban/rural, șomaj | `index.html` | INS, Forța de muncă în România |
| Studiile despre angajare | `js/data.js` (`RO_HIRE`) | Studiile citate lângă fiecare |

## Fișierele

| Fișier | Ce face |
|---|---|
| `update.py` | Comanda de actualizare: rulează toți pașii de mai sus |
| `download.py` | Descarcă datele brute; poate fi rulat și singur: `python scripts/download.py work` |
| `build.py` | Prelucrează datele brute în setul folosit de site |
| `db.py` | Schema bazei de date, exportul CSV și generarea datelor pentru site din bază |
| `jstat.py` | Citește formatul JSON-stat de la Eurostat |

Contururile hărților se schimbă rar și au scripturi separate, care au nevoie și de `pip install openpyxl`:

```bash
python scripts/download.py work --shapes                         # contururi (geoBoundaries, Natural Earth) și tabelul ONU
python scripts/geo.py    work/geo/ro.geojson       js/geo.js      # județele (harta 3D)
python scripts/europe.py work/geo/world50.geojson  js/europe.js   # Europa
python scripts/un_extract.py work/un/ims.xlsx work/un/ro_origin.json
python scripts/world.py  work/geo/world110.geojson work/un/ro_origin.json js/world.js   # globul
```
