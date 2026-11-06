/*
  Date folosite pe site.
  - Salariile pe județe și variația față de anul anterior (INS TEMPO, FOM106E) nu sunt aici: se generează automat
    în js/data-extra.js (scripts/update.py) și se adaugă peste obiectele de mai jos.
  - Industrii de top: sinteză editorială după profilul economic al județului (marii angajatori și ramuri),
    NU un clasament oficial INS. Pentru cifre exacte pe CAEN: INS TEMPO-Online.
*/
window.RO_DATA = {
  counties: {
    B:  { n: 'București',       ind: [['it','IT & tehnologie'], ['finance','Servicii financiare'], ['public','Administrație & sedii centrale']] },
    CJ: { n: 'Cluj',            ind: [['it','IT & software'], ['finance','Servicii de business (BPO)'], ['health','Farma & sănătate']] },
    TM: { n: 'Timiș',           ind: [['electronics','Electronică & componente auto'], ['it','IT & software'], ['logistics','Logistică']] },
    TL: { n: 'Tulcea',          ind: [['naval','Construcții navale'], ['metal','Metalurgie (alumină)'], ['tourism','Turism în Delta Dunării']] },
    SB: { n: 'Sibiu',           ind: [['auto','Componente auto'], ['tourism','Turism'], ['it','IT & servicii']] },
    IF: { n: 'Ilfov',           ind: [['logistics','Logistică & depozite'], ['retail','Comerț & retail'], ['construction','Construcții & imobiliare']] },
    AG: { n: 'Argeș',           ind: [['auto','Industria auto (Mioveni)'], ['oil','Petrol & gaze'], ['energy','Hidroenergie']] },
    BV: { n: 'Brașov',          ind: [['aero','Aeronautică & auto'], ['tourism','Turism montan'], ['it','IT & servicii']] },
    IS: { n: 'Iași',            ind: [['it','IT & servicii'], ['health','Sănătate & universități'], ['chem','Farma (antibiotice)']] },
    BC: { n: 'Bacău',           ind: [['aero','Aeronautică'], ['food','Industrie alimentară'], ['retail','Comerț']] },
    AR: { n: 'Arad',            ind: [['auto','Componente auto'], ['metal','Vagoane & metalurgie'], ['agri','Agricultură']] },
    OT: { n: 'Olt',             ind: [['metal','Aluminiu (Slatina)'], ['auto','Componente auto'], ['agri','Agricultură']] },
    PH: { n: 'Prahova',         ind: [['oil','Rafinare petrol'], ['food','Bunuri de larg consum'], ['tourism','Turism (Valea Prahovei)']] },
    MS: { n: 'Mureș',           ind: [['chem','Chimie (îngrășăminte)'], ['health','Farma & sănătate'], ['wood','Prelucrarea lemnului']] },
    CT: { n: 'Constanța',       ind: [['logistics','Port & logistică'], ['tourism','Turism pe litoral'], ['energy','Energie nucleară & petrochimie']] },
    GL: { n: 'Galați',          ind: [['metal','Siderurgie'], ['naval','Șantier naval'], ['logistics','Port la Dunăre']] },
    DJ: { n: 'Dolj',            ind: [['auto','Industria auto (Craiova)'], ['energy','Energie'], ['agri','Agricultură']] },
    AB: { n: 'Alba',            ind: [['auto','Componente auto'], ['wood','Lemn & mobilă'], ['tourism','Turism']] },
    CS: { n: 'Caraș-Severin',   ind: [['metal','Metalurgie (Reșița)'], ['energy','Hidroenergie'], ['tourism','Turism balnear']] },
    GJ: { n: 'Gorj',            ind: [['energy','Energie termo'], ['mining','Minerit (lignit)'], ['oil','Petrol']] },
    BH: { n: 'Bihor',           ind: [['wood','Mobilă'], ['tourism','Turism balnear'], ['textile','Încălțăminte & textile']] },
    VS: { n: 'Vaslui',          ind: [['textile','Confecții'], ['metal','Rulmenți (Bârlad)'], ['agri','Agricultură']] },
    SJ: { n: 'Sălaj',           ind: [['metal','Cord metalic & cabluri'], ['wood','Prelucrarea lemnului'], ['agri','Agricultură']] },
    DB: { n: 'Dâmbovița',       ind: [['metal','Oțel (Târgoviște)'], ['oil','Petrol'], ['agri','Legumicultură']] },
    IL: { n: 'Ialomița',        ind: [['agri','Agricultură'], ['food','Industrie alimentară'], ['logistics','Transport']] },
    BZ: { n: 'Buzău',           ind: [['food','Industrie alimentară'], ['metal','Metalurgie'], ['agri','Agricultură']] },
    GR: { n: 'Giurgiu',         ind: [['logistics','Logistică & vamă'], ['agri','Agricultură'], ['retail','Comerț']] },
    BR: { n: 'Brăila',          ind: [['naval','Naval & metalurgie'], ['agri','Agricultură'], ['food','Industrie alimentară']] },
    CL: { n: 'Călărași',        ind: [['agri','Agricultură'], ['metal','Siderurgie'], ['logistics','Transport fluvial']] },
    HD: { n: 'Hunedoara',       ind: [['auto','Componente auto'], ['mining','Minerit (în declin)'], ['energy','Energie']] },
    MH: { n: 'Mehedinți',       ind: [['energy','Hidroenergie (Porțile de Fier)'], ['naval','Naval'], ['agri','Agricultură']] },
    SM: { n: 'Satu Mare',       ind: [['electronics','Componente auto & electrice'], ['textile','Textile'], ['agri','Agricultură']] },
    NT: { n: 'Neamț',           ind: [['metal','Țevi (Roman)'], ['tourism','Turism'], ['textile','Textile']] },
    BN: { n: 'Bistrița-Năsăud', ind: [['electronics','Cablaje auto'], ['wood','Prelucrarea lemnului'], ['agri','Agricultură']] },
    CV: { n: 'Covasna',         ind: [['wood','Prelucrarea lemnului'], ['food','Ape minerale & alimentare'], ['textile','Textile']] },
    MM: { n: 'Maramureș',       ind: [['wood','Mobilă'], ['electronics','Componente'], ['tourism','Turism rural']] },
    HR: { n: 'Harghita',        ind: [['wood','Prelucrarea lemnului'], ['food','Ape minerale'], ['tourism','Turism']] },
    TR: { n: 'Teleorman',       ind: [['agri','Agricultură'], ['electronics','Cablaje'], ['food','Industrie alimentară']] },
    SV: { n: 'Suceava',         ind: [['wood','Prelucrarea lemnului'], ['tourism','Turism (Bucovina)'], ['food','Industrie alimentară']] },
    VN: { n: 'Vrancea',         ind: [['wine','Viticultură'], ['agri','Agricultură'], ['wood','Lemn & mobilă']] },
    BT: { n: 'Botoșani',        ind: [['textile','Confecții'], ['agri','Agricultură'], ['retail','Comerț']] },
    VL: { n: 'Vâlcea',          ind: [['chem','Chimie'], ['energy','Hidroenergie'], ['tourism','Turism balnear']] }
  }
};

/* Domenii (secțiuni CAEN). Salariul, orele și riscul vin din RO_EXTRA.work, iar ponderile pe mari sectoare (RO_SECTORS_SPLIT)
   din js/data-extra.js, generat de scripts/update.py. */
window.RO_DOMAINS = [
  { icon: 'agri',         k: 'A',    t: 'Agricultură',             d: 'Muncă fizică grea, sezonieră, mult în aer liber. Majoritatea celor din agricultură nu au salariu: lucrează pe cont propriu sau pentru familie. E și cel mai periculos domeniu din România.' },
  { icon: 'metal',        k: 'C',    t: 'Industrie prelucrătoare', d: 'Cel mai mare angajator: auto, componente, confecții, alimentară. Muncă în ture, la bandă. Salariile diferă enorm: în jur de 3.500 de lei în confecții și peste 6.500 în electronice.' },
  { icon: 'construction', k: 'F',    t: 'Construcții',             d: 'Muncă fizică, la înălțime, pe orice vreme. Al doilea domeniu ca risc de accidente mortale și unul în care o parte din bani se dau încă „la plic”.' },
  { icon: 'retail',       k: 'G',    t: 'Comerț',                  d: 'Al doilea mare angajator: casieri, vânzători, depozite. Ture lungi, în picioare, inclusiv în weekend, pentru un salariu sub media economiei.' },
  { icon: 'logistics',    k: 'H',    t: 'Transport & logistică',   d: 'Șoferi, curieri, depozite. Printre cele mai multe ore lucrate din economie și un risc mare de accidente pe drum.' },
  { icon: 'tourism',      k: 'I',    t: 'HoReCa & turism',         d: 'Cel mai prost plătit domeniu din economie și cel cu cele mai multe ore. Muncă în ture, seara și în weekend, adesea sezonieră.' },
  { icon: 'it',           k: 'J',    t: 'IT & comunicații',        d: 'Cele mai mari salarii, concentrate în București, Cluj, Iași și Timiș. Muncă de birou, mai puține ore și aproape niciun risc fizic.' },
  { icon: 'finance',      k: 'K',    t: 'Finanțe & asigurări',     d: 'Puțini angajați, salarii mari, aproape exclusiv în marile orașe.' },
  { icon: 'energy',       k: 'D',    t: 'Energie & utilități',     d: 'Hidro, nuclear (Cernavodă), cărbune în declin în Gorj. Salarii peste medie și firme mari, multe de stat.' },
  { icon: 'health',       k: 'Q',    t: 'Sănătate & asistență',    d: 'Majoritar femei. Ture de 12 ore, nopți și presiune psihică mare, pentru un salariu sub media economiei. Mulți medici și asistente au emigrat.' },
  { icon: 'public',       k: 'O',    t: 'Administrație publică',   d: 'Primării, ministere, instituții. Salarii peste medie și program stabil. Sectorul public are în jur de 16,6% din cei care muncesc.' },
  { icon: 'wood',         k: 'wood', t: 'Lemn & mobilă',           d: 'Puternic în Maramureș, Suceava, Bihor și Harghita. Muncă fizică în fabrici și în pădure, cu unele dintre cele mai mici salarii din industrie.' }
];

/* Factori care influențează angajarea și salariul: rezultate din studii publicate */
window.RO_HIRE = [
  { icon: 'height', t: 'Înălțimea', big: '+1,8%', unit: 'salariu / inch (2,54 cm)', d: 'Fiecare inch de înălțime la adolescență s-a asociat cu un salariu cu ~1,8% mai mare la adult. Efectul trece mai ales prin încrederea și activitățile sociale din adolescență, nu prin înălțimea de adult.', src: 'Persico, Postlewaite & Silverman (2004), Journal of Political Economy' },
  { icon: 'looks', t: 'Aspectul fizic', big: '−9% / +5%', unit: 'penalizare vs. primă', d: 'Persoanele evaluate ca „sub medie” la aspect câștigă cu 7–9% mai puțin, iar cele „peste medie” cu ~5% mai mult, la aceeași calificare.', src: 'Hamermesh & Biddle (1994), American Economic Review' },
  { icon: 'photo', t: 'Poza din CV', big: '+36%', unit: 'mai multe invitații la interviu', d: 'Într-un experiment cu CV-uri fictive, candidații cu poze atractive au primit cu 36% mai multe răspunsuri decât cei cu poze mai puțin atractive.', src: 'López Bóo, Rossi & Urzúa (2013), Economics Letters' },
  { icon: 'gender', t: 'Genul', big: '3,7%', unit: 'decalaj salarial pe gen în România (UE: 11,1%)', d: 'Pe hârtie, femeile din România câștigă pe oră doar cu 3,7% mai puțin decât bărbații, printre cele mai mici diferențe din UE. Dar cifra e parțial o iluzie: în România lucrează mult mai puține femei decât bărbați, iar cele care lucrează sunt, în medie, mai educate și în joburi mai bine plătite.', src: 'Eurostat, sdg_05_20 (2024): decalajul salarial pe gen, neajustat' },
  { icon: 'persona', t: 'Personalitatea', big: '+18%', unit: 'venit pentru bărbații mai puțin „agreabili”', d: 'Bărbații cu un nivel scăzut de agreabilitate (direcți, care negociază dur) câștigau cu ~18% mai mult decât cei foarte agreabili. Cel mai bun predictor al performanței la muncă rămâne însă conștiinciozitatea: oamenii organizați și de încredere performează constant mai bine, în orice domeniu.', src: 'Judge, Livingston & Hurst (2012), J. of Personality & Social Psych.; Barrick & Mount (1991), Personnel Psychology' },
  { icon: 'name', t: 'Numele', big: '+50%', unit: 'răspunsuri pentru același CV', d: 'CV-urile identice cu nume percepute ca „albe” au primit cu 50% mai multe apeluri decât cele cu nume afro-americane. Studii similare din Europa găsesc efecte pentru nume de minorități etnice; în România, de exemplu, pentru romi.', src: 'Bertrand & Mullainathan (2004), American Economic Review' },
  { icon: 'weight', t: 'Greutatea', big: '−9%', unit: 'salariu (femei)', d: 'Un plus de ~30 kg s-a asociat cu salarii cu ~9% mai mici la femeile albe din SUA. La bărbați, efectul a fost mult mai slab sau absent.', src: 'Cawley (2004), Journal of Human Resources' },
  { icon: 'network', t: 'Relațiile', big: '~50%', unit: 'din joburi găsite prin cunoștințe', d: 'Rețelele personale explică o parte uriașă din angajări. Contează mai ales „legăturile slabe”, adică cunoștințele îndepărtate, nu prietenii apropiați.', src: 'Granovetter (1973); Rajkumar et al. (2022), Science' },
  { icon: 'age', t: 'Vârsta', big: '+35%', unit: 'mai multe răspunsuri la 30 de ani decât la 65', d: 'Cercetătorii au trimis peste 40.000 de CV-uri identice, schimbând doar vârsta candidatului. Cei de 29–31 de ani au fost chemați cu 35% mai des decât cei de 64–66 de ani. Discriminarea a fost cea mai puternică față de femeile în vârstă.', src: 'Neumark, Burn & Button (2019), Journal of Political Economy' }
];

/* Distribuția salariilor (RO_PAY_DIST) se introduce de mână în data/manual.json și ajunge pe site prin js/data-extra.js. */
