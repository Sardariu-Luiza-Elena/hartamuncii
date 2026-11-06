# HartaMuncii

Munca în România, pe date oficiale: salarii pe județe pe o hartă 3D, cine muncește și cât, cât valorează o oră de muncă în fiecare domeniu, munca la negru, factorii care influențează angajarea și românii plecați în străinătate (și cei care se întorc). Site în română și engleză.

**Site:** https://sardariu-luiza-elena.github.io/hartamuncii/

## Pe scurt
- ~35% dintre salariații din sectorul privat iau în mână sub ~2.900 lei pe lună.
- O oră de muncă în IT e plătită de 3,3 ori mai bine decât una în HoReCa.
- Banii trimiși acasă de românii din străinătate depășesc investițiile străine directe.
- Din 2022, se întorc în fiecare an mai mulți români decât pleacă.

## Date și metodă
Toate sursele (INS, Eurostat, Banca Mondială, ONU, European Labour Authority etc.) sunt listate cu linkuri pe site, în secțiunea **Surse și metodă**.

Cifrele sunt într-o bază de date SQLite, [`data/hartamuncii.sqlite`](data/README.md), și în tabele CSV, cu descrierea fiecărei coloane. Baza se reface din datele oficiale cu o singură comandă, iar site-ul își ia datele din ea:

```bash
pip install xlrd
python scripts/update.py
```

Detalii în [`scripts/README.md`](scripts/README.md).

Studiul de caz al proiectului: [CASE_STUDY.md](CASE_STUDY.md).

## Structură
- `index.html`: pagina
- `css/style.css`: stilurile (temă întunecată și deschisă)
- `js/map3d.js`: harta 3D a județelor (Three.js)
- `js/globe.js`: globul cu românii din toată lumea (d3-geo, încărcat la nevoie)
- `js/charts.js`: graficele SVG și harta Europei
- `js/migration.js`: capitolul „Plecare și întoarcere”
- `js/data.js`: textele despre județe și domenii; `js/data-extra.js`: cifrele, generate din baza de date; `js/world.js`: datele globului
- `data/`: baza de date, tabelele CSV și cifrele introduse de mână (`manual.json`)
- `js/i18n.js`, `js/data-en.js`: varianta în engleză
- `js/sources.js`: lista surselor și notele de metodă
- `js/author.js`: datele autorului (nume, rol, linkuri)
- `scripts/`: descărcarea și prelucrarea datelor, baza de date (Python)

Site static: nu are nevoie de server sau de build.
