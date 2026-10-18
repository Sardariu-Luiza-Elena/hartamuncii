# HartaMuncii

Munca în România, pe date: salarii pe județe pe o hartă 3D, munca la negru, cine muncește, ore lucrate, tineri NEET, sărăcia celor care muncesc, absolvenții, industriile care cresc și românii plecați în Europa.

**Site:** https://sardariu-luiza-elena.github.io/hartamuncii/

## Surse
- **INS:** câștigul salarial pe județe, forța de muncă
- **Eurostat:** diaspora, ore lucrate, NEET, sărăcie, absolvenți, ocupare pe industrii
- **European Labour Authority:** munca nedeclarată
- **Inspecția Muncii:** controale 2025
- **ONS:** recensământul 2021, Regatul Unit
- **Contururi:** geoBoundaries (CC BY 4.0), Natural Earth

## Structură
- `index.html`: pagina
- `css/style.css`: stilurile, cu tema întunecată și cea deschisă
- `js/map3d.js`: harta 3D (Three.js)
- `js/charts.js`: graficele SVG și harta Europei
- `js/data.js`, `js/data-extra.js`: datele
- `js/sound.js`: coloana sonoră generată în browser. Un fișier propriu pus în `audio/suspans.mp3` o înlocuiește.

Site static: nu are nevoie de server sau de build. Se deschide direct `index.html`.
