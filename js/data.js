/*
  Date folosite pe site.
  - Salarii pe județe: câștigul salarial mediu net, iunie 2025 (INS, prin direcțiile județene / infopolitica.ro)
  - Variație: iunie 2025 față de iunie 2024 (INS)
  - Industrii de top: sinteză editorială după profilul economic al județului (marii angajatori și ramuri),
    NU un clasament oficial INS. Pentru cifre exacte pe CAEN: INS TEMPO-Online.
*/
window.RO_DATA = {
  nationalNet2025: 5266, // media anuală 2025, INS
  counties: {
    B:  { n: 'București',       s: 7051, g: 7.7,  ind: [['it','IT & tehnologie'], ['finance','Servicii financiare'], ['public','Administrație & sedii centrale']] },
    CJ: { n: 'Cluj',            s: 6633, g: 10.2, ind: [['it','IT & software'], ['finance','Servicii de business (BPO)'], ['health','Farma & sănătate']] },
    TM: { n: 'Timiș',           s: 6192, g: 6.0,  ind: [['electronics','Electronică & componente auto'], ['it','IT & software'], ['logistics','Logistică']] },
    TL: { n: 'Tulcea',          s: 5539, g: 7.0,  ind: [['naval','Construcții navale'], ['metal','Metalurgie (alumină)'], ['tourism','Turism în Delta Dunării']] },
    SB: { n: 'Sibiu',           s: 5528, g: 3.5,  ind: [['auto','Componente auto'], ['tourism','Turism'], ['it','IT & servicii']] },
    IF: { n: 'Ilfov',           s: 5443, g: 5.8,  ind: [['logistics','Logistică & depozite'], ['retail','Comerț & retail'], ['construction','Construcții & imobiliare']] },
    AG: { n: 'Argeș',           s: 5410, g: 16.1, ind: [['auto','Industria auto (Mioveni)'], ['oil','Petrol & gaze'], ['energy','Hidroenergie']] },
    BV: { n: 'Brașov',          s: 5376, g: 6.9,  ind: [['aero','Aeronautică & auto'], ['tourism','Turism montan'], ['it','IT & servicii']] },
    IS: { n: 'Iași',            s: 5335, g: 5.4,  ind: [['it','IT & servicii'], ['health','Sănătate & universități'], ['chem','Farma (antibiotice)']] },
    BC: { n: 'Bacău',           s: 5138, g: 12.5, ind: [['aero','Aeronautică'], ['food','Industrie alimentară'], ['retail','Comerț']] },
    AR: { n: 'Arad',            s: 5025, g: 10.7, ind: [['auto','Componente auto'], ['metal','Vagoane & metalurgie'], ['agri','Agricultură']] },
    OT: { n: 'Olt',             s: 5003, g: 8.7,  ind: [['metal','Aluminiu (Slatina)'], ['auto','Componente auto'], ['agri','Agricultură']] },
    PH: { n: 'Prahova',         s: 4987, g: 5.3,  ind: [['oil','Rafinare petrol'], ['food','Bunuri de larg consum'], ['tourism','Turism (Valea Prahovei)']] },
    MS: { n: 'Mureș',           s: 4982, g: 9.1,  ind: [['chem','Chimie (îngrășăminte)'], ['health','Farma & sănătate'], ['wood','Prelucrarea lemnului']] },
    CT: { n: 'Constanța',       s: 4880, g: 4.6,  ind: [['logistics','Port & logistică'], ['tourism','Turism pe litoral'], ['energy','Energie nucleară & petrochimie']] },
    GL: { n: 'Galați',          s: 4858, g: 3.8,  ind: [['metal','Siderurgie'], ['naval','Șantier naval'], ['logistics','Port la Dunăre']] },
    DJ: { n: 'Dolj',            s: 4837, g: 4.7,  ind: [['auto','Industria auto (Craiova)'], ['energy','Energie'], ['agri','Agricultură']] },
    AB: { n: 'Alba',            s: 4715, g: 3.8,  ind: [['auto','Componente auto'], ['wood','Lemn & mobilă'], ['tourism','Turism']] },
    CS: { n: 'Caraș-Severin',   s: 4697, g: 12.3, ind: [['metal','Metalurgie (Reșița)'], ['energy','Hidroenergie'], ['tourism','Turism balnear']] },
    GJ: { n: 'Gorj',            s: 4693, g: -1.9, ind: [['energy','Energie termo'], ['mining','Minerit (lignit)'], ['oil','Petrol']] },
    BH: { n: 'Bihor',           s: 4670, g: 8.8,  ind: [['wood','Mobilă'], ['tourism','Turism balnear'], ['textile','Încălțăminte & textile']] },
    VS: { n: 'Vaslui',          s: 4636, g: 10.5, ind: [['textile','Confecții'], ['metal','Rulmenți (Bârlad)'], ['agri','Agricultură']] },
    SJ: { n: 'Sălaj',           s: 4609, g: 13.0, ind: [['metal','Cord metalic & cabluri'], ['wood','Prelucrarea lemnului'], ['agri','Agricultură']] },
    DB: { n: 'Dâmbovița',       s: 4607, g: 5.6,  ind: [['metal','Oțel (Târgoviște)'], ['oil','Petrol'], ['agri','Legumicultură']] },
    IL: { n: 'Ialomița',        s: 4568, g: 14.4, ind: [['agri','Agricultură'], ['food','Industrie alimentară'], ['logistics','Transport']] },
    BZ: { n: 'Buzău',           s: 4567, g: 5.3,  ind: [['food','Industrie alimentară'], ['metal','Metalurgie'], ['agri','Agricultură']] },
    GR: { n: 'Giurgiu',         s: 4524, g: 6.7,  ind: [['logistics','Logistică & vamă'], ['agri','Agricultură'], ['retail','Comerț']] },
    BR: { n: 'Brăila',          s: 4469, g: 8.4,  ind: [['naval','Naval & metalurgie'], ['agri','Agricultură'], ['food','Industrie alimentară']] },
    CL: { n: 'Călărași',        s: 4462, g: -0.9, ind: [['agri','Agricultură'], ['metal','Siderurgie'], ['logistics','Transport fluvial']] },
    HD: { n: 'Hunedoara',       s: 4405, g: 16.0, ind: [['auto','Componente auto'], ['mining','Minerit (în declin)'], ['energy','Energie']] },
    MH: { n: 'Mehedinți',       s: 4396, g: -3.0, ind: [['energy','Hidroenergie (Porțile de Fier)'], ['naval','Naval'], ['agri','Agricultură']] },
    SM: { n: 'Satu Mare',       s: 4354, g: 2.7,  ind: [['electronics','Componente auto & electrice'], ['textile','Textile'], ['agri','Agricultură']] },
    NT: { n: 'Neamț',           s: 4353, g: 1.0,  ind: [['metal','Țevi (Roman)'], ['tourism','Turism'], ['textile','Textile']] },
    BN: { n: 'Bistrița-Năsăud', s: 4343, g: 6.9,  ind: [['electronics','Cablaje auto'], ['wood','Prelucrarea lemnului'], ['agri','Agricultură']] },
    CV: { n: 'Covasna',         s: 4296, g: 2.8,  ind: [['wood','Prelucrarea lemnului'], ['food','Ape minerale & alimentare'], ['textile','Textile']] },
    MM: { n: 'Maramureș',       s: 4287, g: 3.3,  ind: [['wood','Mobilă'], ['electronics','Componente'], ['tourism','Turism rural']] },
    HR: { n: 'Harghita',        s: 4255, g: 8.9,  ind: [['wood','Prelucrarea lemnului'], ['food','Ape minerale'], ['tourism','Turism']] },
    TR: { n: 'Teleorman',       s: 4252, g: 10.5, ind: [['agri','Agricultură'], ['electronics','Cablaje'], ['food','Industrie alimentară']] },
    SV: { n: 'Suceava',         s: 4208, g: 3.6,  ind: [['wood','Prelucrarea lemnului'], ['tourism','Turism (Bucovina)'], ['food','Industrie alimentară']] },
    VN: { n: 'Vrancea',         s: 4203, g: 5.7,  ind: [['wine','Viticultură'], ['agri','Agricultură'], ['wood','Lemn & mobilă']] },
    BT: { n: 'Botoșani',        s: 4131, g: 0.7,  ind: [['textile','Confecții'], ['agri','Agricultură'], ['retail','Comerț']] },
    VL: { n: 'Vâlcea',          s: 4126, g: -2.1, ind: [['chem','Chimie'], ['energy','Hidroenergie'], ['tourism','Turism balnear']] }
  }
};

/* Domenii (secțiuni CAEN). Salariul, orele și riscul vin din RO_EXTRA.work; ponderile pe mari sectoare: INS, populația ocupată 2024. */
window.RO_SECTORS_SPLIT = [
  { k: 'Servicii', v: 56.1 },
  { k: 'Industrie & construcții', v: 32.6 },
  { k: 'Agricultură', v: 11.3 }
];

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
