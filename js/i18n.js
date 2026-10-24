/*
  Limba site-ului: română (implicit) sau engleză.
  Alegerea se face din butonul RO/EN și se reține; ?lang=en în adresă o forțează.
  Schimbarea limbii reîncarcă pagina și păstrează poziția de scroll.
*/
(function () {
  const LANG = window.LANG || 'ro';
  const EN = LANG === 'en';
  window.L = (ro, en) => (EN ? en : ro);
  window.LOCALE = EN ? 'en-GB' : 'ro-RO';

  /* ---------- etichete din date (industrii, sectoare) ---------- */
  const TR = {
    'IT & tehnologie': 'IT & tech', 'Servicii financiare': 'Financial services', 'Administrație & sedii centrale': 'Government & head offices',
    'IT & software': 'IT & software', 'Servicii de business (BPO)': 'Business services (BPO)', 'Farma & sănătate': 'Pharma & health',
    'Electronică & componente auto': 'Electronics & car parts', 'Logistică': 'Logistics', 'Construcții navale': 'Shipbuilding',
    'Metalurgie (alumină)': 'Metallurgy (alumina)', 'Turism în Delta Dunării': 'Danube Delta tourism', 'Componente auto': 'Car parts',
    'Turism': 'Tourism', 'IT & servicii': 'IT & services', 'Logistică & depozite': 'Logistics & warehousing', 'Comerț & retail': 'Retail',
    'Construcții & imobiliare': 'Construction & real estate', 'Industria auto (Mioveni)': 'Car industry (Mioveni)', 'Petrol & gaze': 'Oil & gas',
    'Hidroenergie': 'Hydropower', 'Aeronautică & auto': 'Aerospace & automotive', 'Turism montan': 'Mountain tourism',
    'Sănătate & universități': 'Healthcare & universities', 'Farma (antibiotice)': 'Pharma (antibiotics)', 'Aeronautică': 'Aerospace',
    'Industrie alimentară': 'Food industry', 'Comerț': 'Retail & trade', 'Vagoane & metalurgie': 'Railcars & metallurgy', 'Agricultură': 'Agriculture',
    'Aluminiu (Slatina)': 'Aluminium (Slatina)', 'Rafinare petrol': 'Oil refining', 'Bunuri de larg consum': 'Consumer goods',
    'Turism (Valea Prahovei)': 'Tourism (Prahova Valley)', 'Chimie (îngrășăminte)': 'Chemicals (fertiliser)', 'Prelucrarea lemnului': 'Wood processing',
    'Port & logistică': 'Port & logistics', 'Turism pe litoral': 'Seaside tourism', 'Energie nucleară & petrochimie': 'Nuclear power & petrochemicals',
    'Siderurgie': 'Steel', 'Șantier naval': 'Shipyard', 'Port la Dunăre': 'Danube port', 'Industria auto (Craiova)': 'Car industry (Craiova)',
    'Energie': 'Energy', 'Lemn & mobilă': 'Wood & furniture', 'Metalurgie (Reșița)': 'Metallurgy (Reșița)', 'Turism balnear': 'Spa tourism',
    'Energie termo': 'Thermal power', 'Minerit (lignit)': 'Mining (lignite)', 'Petrol': 'Oil', 'Mobilă': 'Furniture',
    'Încălțăminte & textile': 'Footwear & textiles', 'Confecții': 'Garment making', 'Rulmenți (Bârlad)': 'Ball bearings (Bârlad)',
    'Cord metalic & cabluri': 'Steel cord & cables', 'Oțel (Târgoviște)': 'Steel (Târgoviște)', 'Legumicultură': 'Vegetable farming',
    'Transport': 'Transport', 'Metalurgie': 'Metallurgy', 'Logistică & vamă': 'Logistics & customs', 'Naval & metalurgie': 'Shipbuilding & metallurgy',
    'Transport fluvial': 'River transport', 'Minerit (în declin)': 'Mining (declining)', 'Hidroenergie (Porțile de Fier)': 'Hydropower (Iron Gates)',
    'Naval': 'Shipbuilding', 'Componente auto & electrice': 'Car & electrical parts', 'Textile': 'Textiles', 'Țevi (Roman)': 'Steel pipes (Roman)',
    'Cablaje auto': 'Car wiring harnesses', 'Ape minerale & alimentare': 'Mineral water & food', 'Componente': 'Components',
    'Turism rural': 'Rural tourism', 'Ape minerale': 'Mineral water', 'Cablaje': 'Wiring harnesses', 'Turism (Bucovina)': 'Tourism (Bukovina)',
    'Viticultură': 'Winemaking', 'Chimie': 'Chemicals',
    // sectoare (graficul „Ce industrii au crescut”)
    'Minerit': 'Mining', 'Industrie prelucrătoare': 'Manufacturing', 'Apă și deșeuri': 'Water & waste', 'Construcții': 'Construction',
    'Transport și logistică': 'Transport & logistics', 'HoReCa': 'Hotels & restaurants', 'IT și comunicații': 'IT & communications',
    'Finanțe': 'Finance', 'Imobiliare': 'Real estate', 'Profesii liberale și cercetare': 'Professional & scientific services',
    'Servicii suport (call-center, pază)': 'Support services (call centres, security)', 'Administrație publică': 'Public administration',
    'Educație': 'Education', 'Sănătate': 'Health', 'Arte și divertisment': 'Arts & entertainment', 'Alte servicii': 'Other services',
    // împărțirea pe mari sectoare
    'Servicii': 'Services', 'Industrie & construcții': 'Industry & construction'
  };
  window.tr = s => (EN && TR[s]) || s;

  /* ---------- nume de țări ---------- */
  window.COUNTRY_EN = {
    AT: 'Austria', BE: 'Belgium', BG: 'Bulgaria', HR: 'Croatia', CY: 'Cyprus', CZ: 'Czechia', DK: 'Denmark', EE: 'Estonia', FI: 'Finland',
    FR: 'France', DE: 'Germany', EL: 'Greece', HU: 'Hungary', IE: 'Ireland', IT: 'Italy', LV: 'Latvia', LT: 'Lithuania', LU: 'Luxembourg',
    MT: 'Malta', NL: 'Netherlands', PL: 'Poland', PT: 'Portugal', RO: 'Romania', SK: 'Slovakia', SI: 'Slovenia', ES: 'Spain', SE: 'Sweden',
    UK: 'United Kingdom', NO: 'Norway', CH: 'Switzerland', IS: 'Iceland', MD: 'Moldova', UA: 'Ukraine', RS: 'Serbia', TR: 'Türkiye',
    BY: 'Belarus', RU: 'Russia', BA: 'Bosnia', ME: 'Montenegro', AL: 'Albania', MK: 'North Macedonia', XK: 'Kosovo', LI: 'Liechtenstein'
  };

  // după schimbarea limbii, revino în același loc din pagină
  try {
    const y = sessionStorage.getItem('hm-scroll');
    if (y) {
      sessionStorage.removeItem('hm-scroll');
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      // poziția e reținută ca „secțiune + distanța în secțiune”, pentru că textele au lungimi diferite în cele două limbi
      const [id, off] = y.split(':');
      window.addEventListener('load', () => setTimeout(() => {
        const sec = document.getElementById(id);
        window.scrollTo({ top: sec ? sec.offsetTop + (+off || 0) : 0, behavior: 'instant' });
      }, 50));
    }
  } catch (e) {}

  if (!EN) { addSwitch(); return; }

  /* ---------- texte fixe din pagină (cheia = textul românesc din HTML) ---------- */
  const STATIC = {
    'Datele folosite și limitele lor.': 'The data used and its limitations.',
    'Copii cu părinți plecați la muncă în străinătate': 'Children with parents working abroad',
    'Câștigul pe oră, pe grupe de ocupații': 'Hourly pay by occupation group',
    'Factorii economici ai emigrației și efectele ei asupra celor rămași acasă.': 'The economic drivers of emigration and its effects on those who stay behind.',
    'Diferențele salariale, banii trimiși acasă și migrația de întoarcere.': 'Pay gaps, remittances and return migration.',
    'Date ONU, 1990–2024. Globul poate fi rotit, iar fiecare țară poate fi selectată.': 'UN data, 1990–2024. The globe can be rotated and each country selected.',
    'Persoane născute în România, pe țări de reședință': 'People born in Romania, by country of residence',
    'Etapele emigrației': 'Stages of emigration',
    'Culoarea indică ponderea cetățenilor români în populația fiecărei țări. Selectează o țară pentru detalii.': 'Colour shows the share of Romanian citizens in each country’s population. Select a country for details.',
    'Aproximativ 3 milioane de cetățeni români locuiesc în alte state ale UE, cea mai numeroasă comunitate de acest fel din Uniune.': 'About 3 million Romanian citizens live in other EU countries, the largest such group in the Union.',
    'Rezultate din studii publicate. Selectează un card pentru detalii și sursă.': 'Results from published studies. Select a card for details and the source.',
    'Pe lângă competențe, angajarea și salariul sunt influențate de factori precum înălțimea, aspectul sau numele.': 'Beyond skills, hiring and pay are also influenced by factors such as height, appearance or name.',
    'Rezultatele controalelor Inspecției Muncii într-o săptămână': 'Labour Inspectorate findings in a single week',
    'Aproximativ o cincime din munca prestată în sectorul privat nu este declarată.': 'Roughly one fifth of the work done in the private sector is undeclared.',
    'Variația procentuală dintre începutul și sfârșitul fiecărei perioade': 'Percentage change between the start and end of each period',
    'Evoluția numărului de lucrători pe domenii': 'Change in employment by sector',
    'Structura ocupării pe sectoare': 'Employment by broad sector',
    'Comparația folosește datele INS și Eurostat privind câștigul pe oră, programul de lucru și accidentele de muncă.': 'The comparison uses INS and Eurostat data on hourly pay, working hours and workplace accidents.',
    'Salariile, programul și riscurile diferă puternic de la un domeniu la altul.': 'Pay, hours and risks vary widely between sectors.',
    'Programul de lucru, tinerii și sărăcia în rândul celor care muncesc, comparativ cu restul UE.': 'Working hours, young people and in-work poverty compared with the rest of the EU.',
    'Diferență de aproape 14 puncte între urban și rural': 'A gap of almost 14 points between urban and rural areas',
    'puncte procentuale separă rata de ocupare a femeilor de cea a bărbaților': 'percentage points separate the employment rates of women and men',
    'Rata de ocupare este de 71% în rândul bărbaților și de 54% în rândul femeilor.': 'The employment rate is 71% for men and 54% for women.',
    'Principalele concluzii.': 'Key findings.',
    'Înălțimea fiecărui județ pe hartă corespunde salariului mediu net din 2024. Selectează un județ pentru detalii.': 'The height of each county on the map reflects its average net salary in 2024. Select a county for details.',
    'Harta': 'Map', 'La negru': 'Off the books', 'Cine muncește': 'Who works', 'Viața la muncă': 'Work life', 'Domenii': 'Sectors', 'Angajarea': 'Hiring',
    'România · 42 de județe · date oficiale INS': 'Romania · 42 counties · official statistics',
    'Ghidul veniturilor': 'A guide to', '<em>regionale</em>.': '<em>regional</em> income.',
    'Salariu net': 'Net salary', 'Creștere anuală': 'Annual growth', 'Pornește sunetul': 'Turn on sound',
    'trage ↻ rotește · scroll + ctrl ⊕ zoom': 'drag ↻ rotate · ctrl + scroll ⊕ zoom', 'se încarcă harta…': 'loading map…',
    'lei net / lună': 'lei net / month', '<b class="mono">media</b>': '<b class="mono">average</b>', 'Industrii de top': 'Top industries',
    'Salariu: INS, media anuală 2024 (cele mai noi date oficiale pe județe). Industrii: sinteză după profilul economic al județului, nu un clasament oficial.':
      'Salary: Romanian statistics office (INS), 2024 annual average (the latest official county data). Industries: an editorial summary of each county’s economy, not an official ranking.',
    'derulează ↓': 'scroll ↓',

    '04 · Munca nedeclarată': '04 · Undeclared work',
    'Ponderea muncii nedeclarate în totalul muncii din sectorul privat, 2019': 'Undeclared work as a share of all labour in the private sector, 2019',
    'România 2019': 'Romania 2019', 'România 2013': 'Romania 2013', 'Media UE-27': 'EU-27 average',
    'Sursa: European Labour Authority, Factsheet Romania (2023), metoda Labour Input (Williams et al.)': 'Source: European Labour Authority, Factsheet Romania (2023), Labour Input Method (Williams et al.)',
    'din munca independentă (PFA, zilieri etc.) e nedeclarată': 'of self-employment (freelancers, day labourers etc.) is undeclared',
    'ELA 2023, pe baza AMIGO 2019': 'ELA 2023, based on the 2019 Labour Force Survey',
    'din munca în familie e nedeclarată': 'of family work is undeclared',
    'dintre muncitorii din construcții își subdeclară venitul real': 'of construction workers under-report their real income',
    'salariați primeau parte din bani „la plic” în 2007 (5% în 2019)': 'of employees got part of their pay “in an envelope” in 2007 (5% in 2019)',
    'Eurobarometru, prin ELA 2023': 'Eurobarometer, via ELA 2023',
    'controale<br>8–12 sept. 2025': 'inspections<br>8–12 Sept 2025', 'persoane fără forme legale': 'people working without a contract',
    'la o singură fabrică de mobilă, Bihor': 'at a single furniture factory in Bihor', 'la o firmă de ride-sharing, Timiș (nov. 2025)': 'at a ride-sharing company in Timiș (Nov 2025)',
    'Sursa: comunicate Inspecția Muncii, 2025': 'Source: Romanian Labour Inspectorate press releases, 2025',
    'Ce înseamnă legal „muncă nedeclarată”': 'What “undeclared work” means under Romanian law',
    '<span>01</span>Lucrezi fără contract scris, încheiat cu o zi înainte de început.': '<span>01</span>You work without a written contract signed at least one day before you start.',
    '<span>02</span>Contractul nu e trecut în REVISAL/REGES cu o zi înainte.': '<span>02</span>Your contract isn’t entered in the national employee register (REGES) a day in advance.',
    '<span>03</span>Lucrezi cât timp contractul îți e suspendat.': '<span>03</span>You work while your contract is suspended.',
    '<span>04</span>Ai contract part-time, dar lucrezi mai multe ore decât scrie în el.': '<span>04</span>You have a part-time contract but work more hours than it says.',
    '<span>05</span><b>Muncă subdeclarată:</b> primești un salariu net mai mare decât cel declarat (OUG 117/2021).': '<span>05</span><b>Under-declared work:</b> you’re paid more than the officially declared net salary (Government Ordinance 117/2021).',

    '01 · Cine muncește': '01 · Who works',
    'În total, 7,69 milioane de oameni aveau un loc de muncă în 2025.': 'In total, 7.69 million people had a job in 2025.',
    'Bărbați 15–64': 'Men 15–64', 'Femei 15–64': 'Women 15–64', 'lucrează': 'have a job',
    'rata de ocupare 20–64 ani': 'employment rate, ages 20–64', 'Ținta UE pentru 2030: 78%': 'EU target for 2030: 78%', 'tineri 15–24 ani ocupați': 'young people aged 15–24 in work',
    'Printre cele mai mici rate din UE': 'Among the lowest rates in the EU', 'șomeri (BIM)': 'unemployed (ILO definition)',
    'din 8,19 mil. de oameni activi': 'out of 8.19 million in the labour force',
    'Sursa: INS, Forța de muncă în România, ocupare și șomaj, 2025 (date anuale)': 'Source: Romanian statistics office (INS), Labour force: employment and unemployment, 2025 (annual data)',

    '02 · Viața la muncă': '02 · Work life',
    'România comparată cu celelalte 26 de țări din UE. Alege un subiect.': 'Romania compared with the other 26 EU countries. Pick a topic.',
    'Ore pe săptămână': 'Weekly hours', 'Tineri NEET': 'Young NEETs', 'Săraci deși muncesc': 'Working poor',

    '03 · Cât valorează munca': '03 · What work is worth',
    'Salarii: INS, câștigul salarial mediu net, media lunilor din 2025 (ancheta lunară; media economiei aici e 5.536 lei, față de 5.266 lei, media anuală oficială pe 2025, calculată de INS dintr-o altă anchetă). Ore: Eurostat, lfsa_ewhan2, doar salariații de 20–64 de ani, 2025. Accidente: Eurostat, hsw_n2_02, media 2021–2024. Ponderi pe mari sectoare: Eurostat, 2025.':
      'Pay: Romanian statistics office (INS), average net earnings, mean of the 2025 monthly surveys (the economy-wide average here is 5,536 lei, compared with the official 2025 annual average of 5,266 lei, which INS calculates from a different survey). Hours: Eurostat, lfsa_ewhan2, employees only, aged 20–64, 2025. Accidents: Eurostat, hsw_n2_02, 2021–2024 average. Shares by broad sector: Eurostat, 2025.',
    'Eurostat, lfsa_egan2. În 2021, INS a schimbat metodologia: cei care lucrează doar pentru consumul propriu (mai ales în agricultură) nu mai sunt numărați ca ocupați. De aceea comparăm separat cele două perioade, fără să le amestecăm.':
      'Eurostat, lfsa_egan2. In 2021 Romania changed its survey method: people who only produce for their own household (mostly small farmers) are no longer counted as employed. That’s why the two periods are shown separately rather than combined.',
    'Ponderi pe mari sectoare: Eurostat, 2025. Risc de muncă nedeclarată: după ELA și controalele Inspecției Muncii.': 'Shares by broad sector: Eurostat, 2025. Risk of undeclared work: based on ELA and Labour Inspectorate findings.',

    '05 · Cine e angajat': '05 · Who gets hired',
    'Majoritatea studiilor sunt din SUA și Europa de Vest. Efectele sunt medii statistice, nu reguli pentru fiecare om.': 'Most studies come from the US and Western Europe. The effects are statistical averages, not rules that apply to every person.',

    '06 · Românii plecați': '06 · Romanians abroad',
    'Cetățeni români rezidenți, 1 ianuarie (Eurostat, migr_pop1ctz; populație: tps00001). Regatul Unit: persoane născute în România, recensământul ONS 2021 (Anglia și Țara Galilor). Grecia, Cipru și Malta nu raportează anual: am folosit recensământul din 2021. Cei care au luat cetățenia țării gazdă nu apar în aceste cifre, deci totalul real e mai mare. Globul: persoane născute în România (indiferent de cetățenie), ONU, International Migrant Stock 2024; include și emigrări vechi, de exemplu etnicii germani, maghiari sau evrei plecați înainte de 1990.':
      'Romanian citizens resident on 1 January (Eurostat, migr_pop1ctz; population: tps00001). United Kingdom: people born in Romania, ONS 2021 census (England and Wales). Greece, Cyprus and Malta don’t report every year, so the 2021 census is used. People who took the host country’s citizenship are not included, so the real total is higher. Globe: people born in Romania (whatever their citizenship), UN International Migrant Stock 2024; it also includes older emigration, for example ethnic Germans, Hungarians or Jews who left before 1990.',

    'Surse': 'Sources', 'Metodă': 'Method', 'Pe scurt': 'In short', 'Plecare și întoarcere': 'Leaving and returning',
    '07 · Plecare și întoarcere': '07 · Leaving and returning', 'Euro': 'Euros', 'După prețuri': 'Adjusted for prices',
    'Salarii: Eurostat, earn_ses22_47, câștig brut pe oră, firme cu cel puțin 10 angajați, 2022; „după prețuri” = în standardul puterii de cumpărare (PPS). Remitențe și investiții: Banca Mondială, 2013–2025. Plecări și întoarceri: Eurostat, migr_emi1ctz și migr_imm1ctz (nu există date pentru 2019–2020). Copii: ANPDCA, 31 decembrie 2025.':
      'Pay: Eurostat, earn_ses22_47, gross hourly earnings, firms with 10+ employees, 2022; “adjusted for prices” = purchasing power standard (PPS). Remittances and investment: World Bank, 2013–2025. Leaving and returning: Eurostat, migr_emi1ctz and migr_imm1ctz (no data for 2019–2020). Children: ANPDCA, 31 December 2025.', 'Surse și metodă': 'Sources and method', 'Despre': 'About', 'Date actualizate': 'Data updated',
    'Fiecare cifră de pe site vine dintr-o sursă oficială sau dintr-un studiu publicat. Apasă pe o sursă ca s-o deschizi.': 'Every figure on this site comes from an official source or a published study. Click a source to open it.',
    'Note de metodă': 'Method notes',
    'Un proiect de jurnalism de date despre munca în România, construit numai din surse oficiale și studii publicate. Lista completă e în secțiunea <a href="#surse">Surse și metodă</a>.': 'A data journalism project about work in Romania, built only from official sources and published studies. The full list is in <a href="#surse">Sources and method</a>.',
    'Octombrie 2026. Cifrele sunt cele mai recente publicate de INS, Eurostat și ONU la acea dată.': 'October 2026. The figures are the latest published by INS, Eurostat and the UN at that date.',
    '<a href="https://insse.ro" target="_blank" rel="noopener">Institutul Național de Statistică (INS)</a>: câștig salarial, forța de muncă': '<a href="https://insse.ro" target="_blank" rel="noopener">Romanian National Institute of Statistics (INS)</a>: earnings, labour force',
    '<a href="https://www.inspectiamuncii.ro" target="_blank" rel="noopener">Inspecția Muncii</a>: bilanțuri săptămânale 2025': '<a href="https://www.inspectiamuncii.ro" target="_blank" rel="noopener">Romanian Labour Inspectorate</a>: weekly reports, 2025',
    '<a href="https://ec.europa.eu/eurostat/data/database" target="_blank" rel="noopener">Eurostat</a>: diaspora, ore lucrate, NEET, sărăcia celor care muncesc': '<a href="https://ec.europa.eu/eurostat/data/database" target="_blank" rel="noopener">Eurostat</a>: diaspora, hours worked, NEETs, in-work poverty, graduates, jobs by sector',
    '<a href="https://www.ons.gov.uk" target="_blank" rel="noopener">ONS</a>: recensământul 2021, Regatul Unit': '<a href="https://www.ons.gov.uk" target="_blank" rel="noopener">ONS</a>: 2021 census, United Kingdom',
    '<a href="https://www.geoboundaries.org" target="_blank" rel="noopener">geoBoundaries</a> (CC BY 4.0) și <a href="https://www.naturalearthdata.com" target="_blank" rel="noopener">Natural Earth</a>: contururi': '<a href="https://www.geoboundaries.org" target="_blank" rel="noopener">geoBoundaries</a> (CC BY 4.0) and <a href="https://www.naturalearthdata.com" target="_blank" rel="noopener">Natural Earth</a>: map outlines',
    'Înălțimea fiecărui județ pe hartă e proporțională cu salariul mediu net din 2024. Salariul e un indicator aproximativ al dezvoltării: nu include munca la negru, remitențele sau costul vieții.':
      'The height of each county on the map is proportional to its average net salary in 2024. Salary is only a rough measure of development: it leaves out undeclared work, money sent home from abroad and the cost of living.'
  };
  const norm = s => s.replace(/\s+/g, ' ').trim();
  const MAP = {};
  for (const k in STATIC) MAP[norm(k)] = STATIC[k];
  document.querySelectorAll('body *').forEach(el => {
    if (el.closest('script, svg')) return;
    const v = MAP[norm(el.innerHTML)];
    if (v !== undefined) el.innerHTML = v;
  });

  document.title = 'HartaMuncii — work in Romania, in data';
  const md = document.querySelector('meta[name=description]');
  if (md) md.content = 'Official data on work in Romania: salaries by county, undeclared work, employment by gender, hours, young NEETs, the working poor, graduates, growing industries and Romanians abroad.';
  [['#themeBtn', 'Switch theme'], ['#panelClose', 'Close'], ['#rail', 'Chapters']].forEach(([s, v]) => {
    const e = document.querySelector(s); if (e) e.setAttribute('aria-label', v);
  });
  addSwitch();

  /* ---------- butonul RO / EN ---------- */
  function addSwitch() {
    const theme = document.getElementById('themeBtn');
    if (!theme) return;
    const b = document.createElement('button');
    b.className = 'lang-btn';
    b.setAttribute('aria-label', EN ? 'RO EN, schimbă în română' : 'RO EN, switch to English');
    b.innerHTML = '<span class="' + (EN ? '' : 'on') + '">RO</span> <span class="' + (EN ? 'on' : '') + '">EN</span>';
    b.addEventListener('click', () => {
      const next = EN ? 'ro' : 'en';
      const secs = Array.from(document.querySelectorAll('section[id]'));
      const cur = secs.filter(s => s.offsetTop <= window.scrollY + 1).pop() || secs[0];
      try { localStorage.setItem('hm-lang', next); sessionStorage.setItem('hm-scroll', cur.id + ':' + Math.round(window.scrollY - cur.offsetTop)); } catch (e) {}
      // Dacă adresa are ?lang=..., îl scoatem (asta reîncarcă pagina).
      // Altfel reîncărcăm explicit: o navigare spre aceeași adresă cu #ancoră doar ar derula pagina, fără reîncărcare.
      const u = new URL(location.href); u.searchParams.delete('lang');
      if (u.search !== location.search) location.replace(u.pathname + u.search + u.hash);
      else location.reload();
    });
    theme.parentNode.insertBefore(b, theme);
  }
})();
