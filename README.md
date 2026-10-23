# HartaMuncii

Munca în România, pe date oficiale: salarii pe județe pe o hartă 3D, cine muncește și cât, cât valorează o oră de muncă în fiecare domeniu, munca la negru, factorii care influențează angajarea și românii plecați în străinătate (și cei care se întorc). Site în română și engleză.

**Site:** https://sardariu-luiza-elena.github.io/hartamuncii/

## Pe scurt
- ~35% dintre salariații din sectorul privat iau în mână sub ~2.900 lei pe lună.
- O oră de muncă în IT e plătită de 3,3 ori mai bine decât una în HoReCa.
- Banii trimiși acasă de românii din străinătate depășesc investițiile străine directe.
- Din 2022, se întorc în fiecare an mai mulți români decât pleacă.

## Date și metodă
Toate sursele (INS, Eurostat, Banca Mondială, ONU, European Labour Authority etc.) sunt listate cu linkuri pe site, în secțiunea **Surse și metodă**. Scripturile din [`scripts/`](scripts/README.md) descarcă datele brute și refac fiecare cifră.

Studiul de caz al proiectului: [CASE_STUDY.md](CASE_STUDY.md).

## Structură
- `index.html`: pagina
- `css/style.css`: stilurile (temă întunecată și deschisă)
- `js/map3d.js`: harta 3D a județelor (Three.js)
- `js/globe.js`: globul cu românii din toată lumea (d3-geo, încărcat la nevoie)
- `js/charts.js`: graficele SVG și harta Europei
- `js/migration.js`: capitolul „Plecare și întoarcere”
- `js/data.js`, `js/data-extra.js`, `js/world.js`: datele
- `js/i18n.js`, `js/data-en.js`: varianta în engleză
- `js/sources.js`: lista surselor și notele de metodă
- `js/author.js`: datele autorului (nume, rol, linkuri)
- `scripts/`: descărcarea și procesarea datelor (Python)

Site static: nu are nevoie de server sau de build.
