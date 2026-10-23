# HartaMuncii — studiu de caz

> **Ciornă.** Scrisă la persoana I, ca s-o poți folosi direct în portofoliu. Completează locurile marcate cu ✏️ și schimbă orice nu sună ca tine.

**Site:** https://sardariu-luiza-elena.github.io/hartamuncii/ · **Cod:** https://github.com/Sardariu-Luiza-Elena/hartamuncii
**Rol:** ✏️ numele tău, software developer · **Durată:** ✏️ · **Tehnologii:** JavaScript (fără framework), Three.js, d3-geo, SVG, Python, API-urile Eurostat, INS TEMPO, Banca Mondială și ONU

---

## Ce este

Un site de jurnalism de date despre munca în România, în română și engleză. Arată cât câștigă oamenii în fiecare județ, cât lucrează, cât de periculoasă e munca în fiecare domeniu, cât de răspândită e munca la negru și de ce pleacă românii în străinătate, dar și de ce mulți se întorc.

## Întrebarea de la care am pornit

✏️ *De ce te-a interesat subiectul? Exemplu:* Se vorbește mult despre „salariul mediu”, dar puțini știu cum arată de fapt munca în România: cine câștigă cât, cine lucrează cel mai mult și de ce pleacă oamenii. Am vrut să răspund cu date oficiale, nu cu impresii.

## Ce am găsit

- **~35% dintre salariații din sectorul privat iau în mână sub ~2.900 lei pe lună.** Media ascunde cât de jos e majoritatea salariilor.
- **O oră de muncă în IT e plătită de 3,3 ori mai bine decât una în HoReCa**, unde se lucrează cele mai multe ore.
- **În agricultura din România mor la locul de muncă de 3,4 ori mai mulți oameni** decât media UE.
- **Banii trimiși acasă de românii din străinătate (10,7 mld. $ în 2025) depășesc toate investițiile străine directe** din același an.
- **Din 2022, se întorc în fiecare an mai mulți români decât pleacă.**

## Cum am lucrat

1. **Am căutat datele la sursă.** Am pornit de la ce se putea descărca direct: Eurostat, baza INS TEMPO, Banca Mondială și ONU, pe care le-am interogat prin API. Unde datele oficiale nu erau publicate ca fișier, am folosit presa care cita sursa și am scris asta explicit pe site.
2. **Am verificat fiecare serie înainte s-o folosesc.** Câteva exemple sunt mai jos.
3. **Am construit vizualizările** în JavaScript simplu: o hartă 3D a județelor (Three.js), un glob care se rotește (d3-geo), grafice SVG proprii și o hartă a Europei.
4. **Am documentat tot.** Pe site există o secțiune „Surse și metodă”, cu link la fiecare set de date. În `scripts/` sunt scripturile care descarcă datele și refac fiecare cifră. Le-am rulat de la zero și dau exact datele de pe site.

## Probleme întâlnite și cum le-am rezolvat

| Problema | Ce am făcut |
|---|---|
| În 2021, INS a schimbat metodologia anchetei forței de muncă, iar agricultura „pierde” 850.000 de oameni de la un an la altul | Am arătat separat 2011–2020 și 2021–2025, în loc să le amestec |
| Remitențele Băncii Mondiale sar de la 0,7 la 4,8 mld. $ în 2013, din cauza unei schimbări de înregistrare | Am folosit doar 2013–2025 și am explicat de ce |
| INS publică două medii salariale diferite (anuală și lunară) | Am folosit una singură în fiecare comparație și am explicat diferența |
| Accidentele de muncă nemortale sunt raportate foarte incomplet în România | Am comparat doar accidentele mortale |
| O hartă a emigrării pe județe arăta valori aproape identice, pentru că datele sunt estimate | Am scos-o: nu spunea nimic nou |
| Diaspora are două definiții (cetățeni vs. născuți în România) | Am păstrat ambele, pe vizualizări separate, cu explicația lor |

## Decizii de design și tehnice

- **Performanță:** harta 3D se redesenează doar când se schimbă ceva, deci în repaus nu consumă nimic. Globul și datele lui se încarcă doar când ajungi la secțiune.
- **Mobil:** meniul se ascunde la derulare, graficele își adaptează etichetele, iar pagina nu are scroll orizontal.
- **Accesibilitate:** respectă setarea sistemului de reducere a animațiilor. Culorile graficului cu mai multe serii (destinațiile diasporei) au fost verificate cu un validator pentru daltonism, pe ambele teme. Graficele au tooltip-uri cu valorile exacte, iar cardurile pot fi folosite și de la tastatură.
- **Două limbi:** comutare română/engleză, cu numerele formatate după limbă.

## Cum am folosit AI

✏️ *Scrie sincer, cu cuvintele tale. Exemplu:* Am construit site-ul împreună cu Claude (Anthropic), ca asistent pentru cod și pentru căutarea surselor. Alegerea subiectelor, verificarea datelor, deciziile editoriale (ce păstrez, ce scot, ce titlu are fiecare secțiune) și direcția de design au fost ale mele. Istoricul din GitHub arată fiecare pas.

## Ce aș face mai departe

- Să actualizez harta cu media anuală pe județe pentru 2025, când INS o publică în TEMPO.
- Să adaug datele pe județe pentru remitențe sau pentru copiii cu părinți plecați, dacă devin publice.
- ✏️ *altceva care te interesează*
