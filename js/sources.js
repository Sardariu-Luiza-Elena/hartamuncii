/* Lista completă a surselor, pe capitole. Fiecare intrare: [titlu RO, titlu EN, link, ce am folosit RO, ce am folosit EN]. */
(function () {
  const ES = code => 'https://ec.europa.eu/eurostat/databrowser/view/' + code + '/default/table';
  const GS = q => 'https://scholar.google.com/scholar?q=' + encodeURIComponent(q);
  const SOURCES = [
    { ro: 'Harta și salariile pe județe', en: 'The map and county salaries', items: [
      ['INS, câștigul salarial mediu net pe județe, iunie 2025', 'INS, average net earnings by county, June 2025', 'https://infopolitica.ro/2025/10/12/salariul-mediu-pentru-fiecare-judet-in-luna-iunie-2025-vs-iunie-2024/',
        'Salariul și variația anuală pentru toate cele 42 de județe (comunicatele direcțiilor județene INS, centralizate de Infopolitica).', 'Salary and annual change for all 42 counties (INS county office releases, compiled by Infopolitica).'],
      ['INS, câștigul salarial mediu net, anul 2025', 'INS, average net earnings, 2025', 'https://tvrinfo.ro/salariul-mediu-net-a-ajuns-la-5-266-de-lei-in-2025-diferenta-de-peste-3-000-de-lei-intre-bucuresti-si-botosani/',
        'Media anuală pe țară: 5.266 lei.', 'National annual average: 5,266 lei.'],
      ['geoBoundaries, granițele județelor (CC BY 4.0)', 'geoBoundaries, county boundaries (CC BY 4.0)', 'https://www.geoboundaries.org', 'Contururile hărții 3D.', 'Outlines for the 3D map.']
    ] },
    { ro: 'Cine muncește', en: 'Who works', items: [
      ['INS, Forța de muncă în România: ocupare și șomaj, 2025', 'INS, Labour force in Romania: employment and unemployment, 2025', 'https://www.forbes.ro/ins-populatia-activa-a-romaniei-era-de-816-milioane-de-persoane-in-trimestrul-al-iv-lea-din-2025-492058',
        'Ratele de ocupare pe sexe, urban/rural, șomaj.', 'Employment rates by sex, urban/rural, unemployment.']
    ] },
    { ro: 'Viața la muncă', en: 'Work life', items: [
      ['Eurostat, ore efectiv lucrate pe săptămână (lfsa_ewhan2)', 'Eurostat, actual weekly hours worked (lfsa_ewhan2)', ES('lfsa_ewhan2'), 'Ore la locul de muncă principal, 20–64 de ani, 2010–2025, pe țări și pe domenii.', 'Hours in the main job, ages 20–64, 2010–2025, by country and sector.'],
      ['Eurostat, tineri NEET (edat_lfse_20)', 'Eurostat, young NEETs (edat_lfse_20)', ES('edat_lfse_20'), 'Tineri de 15–29 de ani care nu lucrează și nu învață, 2015–2025.', 'People aged 15–29 not in employment, education or training, 2015–2025.'],
      ['Eurostat, sărăcia în rândul celor care muncesc (ilc_iw01)', 'Eurostat, in-work poverty (ilc_iw01)', ES('ilc_iw01'), 'Persoane ocupate de 18–64 de ani sub pragul de sărăcie, 2015–2025.', 'Employed people aged 18–64 below the poverty line, 2015–2025.']
    ] },
    { ro: 'Cât valorează munca', en: 'What work is worth', items: [
      ['INS, câștigul salarial mediu lunar, ianuarie–decembrie 2025 (anexe Excel)', 'INS, average monthly earnings, January–December 2025 (Excel annexes)', 'https://insse.ro/cms/sites/default/files/com_presa/com_pdf/cs10r25.pdf',
        'Salariul net pe domenii, media celor 12 luni din 2025.', 'Net pay by sector, mean of the 12 months of 2025.'],
      ['INS, repartizarea salariaților pe grupe de venituri, octombrie 2024 (prin Ziarul Financiar)', 'INS, employees by income group, October 2024 (via Ziarul Financiar)', 'https://www.zf.ro/eveniment/varful-salariilor-subtire-1-5-dintre-angajati-depasesc-venituri-30-22964480',
        'Câți salariați câștigă în fiecare tranșă de venit.', 'How many employees fall into each income band.'],
      ['Ministerul Muncii, salariul minim din 2025', 'Ministry of Labour, 2025 minimum wage', 'https://mmuncii.ro/j33/index.php/ro/comunicare/comunicate-de-presa/7516-20241127-cp-salariu-minim-ianuarie-2025',
        '1.823.520 de salariați plătiți cu salariul minim.', '1,823,520 employees on the minimum wage.'],
      ['Eurostat, accidente de muncă mortale (hsw_n2_02)', 'Eurostat, fatal accidents at work (hsw_n2_02)', ES('hsw_n2_02'), 'Rata la 100.000 de lucrători, pe domenii, media 2021–2024.', 'Rate per 100,000 workers, by sector, 2021–2024 average.'],
      ['Eurostat, persoane ocupate pe domenii (lfsa_egan2)', 'Eurostat, employment by sector (lfsa_egan2)', ES('lfsa_egan2'), 'Evoluția numărului de lucrători pe domenii, 2011–2025.', 'Change in the number of workers by sector, 2011–2025.'],
      ['INS, populația ocupată pe mari sectoare, 2024', 'INS, employment by broad sector, 2024', 'https://agerpres.ro/economic/2025/04/22/rata-de-ocupare-a-populatiei-in-varsta-de-munca-a-crescut-la-63-8-in-2024--1442085',
        'Ponderile serviciilor, industriei și agriculturii.', 'Shares of services, industry and agriculture.']
    ] },
    { ro: 'Munca nedeclarată', en: 'Undeclared work', items: [
      ['European Labour Authority, Factsheet on undeclared work: Romania (2023)', 'European Labour Authority, Factsheet on undeclared work: Romania (2023)', 'https://www.ela.europa.eu/sites/default/files/2024-02/RO-UDW_factsheet-2023-fin.pdf',
        'Ponderea muncii nedeclarate (metoda Labour Input), plata „la plic”, definiția legală.', 'Share of undeclared work (Labour Input Method), envelope wages, legal definition.'],
      ['Horodnic & Horodnic, Forța de muncă din construcții (FGS Familia, 2022)', 'Horodnic & Horodnic, The construction workforce (FGS Familia, 2022)', 'https://forumulconstructorilor.ro/wp-content/uploads/2022/02/Piata-fortei-de-munca-in-sectorul-Constructii.pdf',
        'Subdeclararea veniturilor în construcții.', 'Under-declared earnings in construction.'],
      ['Inspecția Muncii, comunicat din 17 septembrie 2025', 'Labour Inspectorate, press release, 17 September 2025', 'https://www.inspectiamuncii.ro/documents/66402/268210/2025-09-17+Comunicat+de+presa.pdf/b6646946-2adb-4aa8-bd33-377b274faa3b',
        'Controalele din 8–12 septembrie 2025.', 'Inspections of 8–12 September 2025.'],
      ['Inspecția Muncii, bilanțul săptămânii 17–21 noiembrie 2025', 'Labour Inspectorate, report for 17–21 November 2025', 'https://www.inspectiamuncii.ro/documents/66402/188223/Bilan%C8%9Bul+controalelor+Inspec%C8%9Biei+Muncii+realizate+%C3%AEn+s%C4%83pt%C4%83m%C3%A2na+17.11-21.11.2025/b3f22d85-6825-4830-b44c-2107d2523f86',
        'Cazul firmei de ride-sharing din Timiș.', 'The ride-sharing company case in Timiș.']
    ] },
    { ro: 'Cine e angajat', en: 'Who gets hired', items: [
      ['Persico, Postlewaite & Silverman (2004), Journal of Political Economy', 'Persico, Postlewaite & Silverman (2004), Journal of Political Economy', GS('Persico Postlewaite Silverman 2004 effect of adolescent experience on labor market outcomes height'), 'Înălțimea și salariul.', 'Height and pay.'],
      ['Hamermesh & Biddle (1994), American Economic Review', 'Hamermesh & Biddle (1994), American Economic Review', GS('Hamermesh Biddle 1994 Beauty and the labor market'), 'Aspectul fizic și salariul.', 'Looks and pay.'],
      ['López Bóo, Rossi & Urzúa (2013), Economics Letters', 'López Bóo, Rossi & Urzúa (2013), Economics Letters', GS('Lopez Boo Rossi Urzua 2013 relevance of physical attractiveness CV photo field experiment'), 'Poza din CV.', 'CV photos.'],
      ['Eurostat, decalajul salarial pe gen (sdg_05_20)', 'Eurostat, gender pay gap (sdg_05_20)', ES('sdg_05_20'), 'România 3,7%, UE 11,1% (2024).', 'Romania 3.7%, EU 11.1% (2024).'],
      ['Judge, Livingston & Hurst (2012); Barrick & Mount (1991)', 'Judge, Livingston & Hurst (2012); Barrick & Mount (1991)', GS('Judge Livingston Hurst 2012 Do nice guys and gals really finish last agreeableness income'), 'Personalitatea și venitul.', 'Personality and income.'],
      ['Bertrand & Mullainathan (2004), American Economic Review', 'Bertrand & Mullainathan (2004), American Economic Review', GS('Bertrand Mullainathan 2004 Are Emily and Greg more employable than Lakisha and Jamal'), 'Numele de pe CV.', 'Names on CVs.'],
      ['Cawley (2004), Journal of Human Resources', 'Cawley (2004), Journal of Human Resources', GS('Cawley 2004 The impact of obesity on wages'), 'Greutatea și salariul.', 'Weight and pay.'],
      ['Granovetter (1973); Rajkumar et al. (2022), Science', 'Granovetter (1973); Rajkumar et al. (2022), Science', GS('Rajkumar 2022 causal test of the strength of weak ties Science'), 'Relațiile și găsirea unui job.', 'Connections and finding a job.'],
      ['Neumark, Burn & Button (2019), Journal of Political Economy', 'Neumark, Burn & Button (2019), Journal of Political Economy', GS('Neumark Burn Button 2019 Is it harder for older workers to find jobs'), 'Discriminarea după vârstă.', 'Age discrimination.']
    ] },
    { ro: 'Românii plecați', en: 'Romanians abroad', items: [
      ['Eurostat, populația pe cetățenie (migr_pop1ctz)', 'Eurostat, population by citizenship (migr_pop1ctz)', ES('migr_pop1ctz'), 'Cetățeni români rezidenți în fiecare țară, 2010–2025.', 'Romanian citizens resident in each country, 2010–2025.'],
      ['Eurostat, populația totală (tps00001)', 'Eurostat, total population (tps00001)', ES('tps00001'), 'Pentru procentul din populație.', 'For the share of the population.'],
      ['Eurostat, recensământul 2021 (cens_21ctz_r3)', 'Eurostat, 2021 census (cens_21ctz_r3)', ES('cens_21ctz_r3'), 'Grecia, Cipru, Malta.', 'Greece, Cyprus, Malta.'],
      ['ONS, recensământul 2021 (Anglia și Țara Galilor)', 'ONS, 2021 census (England and Wales)', 'https://www.ons.gov.uk/census', 'Persoane născute în România din Regatul Unit.', 'People born in Romania living in the UK.'],
      ['ONU, DESA, International Migrant Stock 2024', 'UN DESA, International Migrant Stock 2024', 'https://www.un.org/development/desa/pd/content/international-migrant-stock',
        'Persoane născute în România din 69 de țări, 1990–2024 (globul).', 'People born in Romania in 69 countries, 1990–2024 (the globe).'],
      ['Panzaru (2024), Health & Social Care in the Community', 'Panzaru (2024), Health & Social Care in the Community', 'https://onlinelibrary.wiley.com/doi/10.1155/2024/7435493', 'Româncele care lucrează în îngrijire în Italia; rolul eliminării vizelor din 2002.', 'Romanian women in Italian care work; the role of the 2002 visa abolition.'],
      ['Studiu despre legalizările din Italia și Spania', 'Study on regularisations in Italy and Spain', 'https://www.researchgate.net/publication/255708598_Regularisation_of_Unauthorised_Immigrants_in_Italy_and_Spain_Determinants_and_Effects', 'Efectul legalizării din 2002 asupra emigrării românești.', 'Effect of the 2002 amnesty on Romanian emigration.'],
      ['CEEMR (2021), îngrijitoare din România și Moldova în Italia', 'CEEMR (2021), Romanian and Moldovan care workers in Italy', 'https://ceemr.uw.edu.pl/vol-10-no-2-2021/articles/migration-and-elderly-care-work-italy-three-stories-romanian-and-moldovan', 'Munca de îngrijire a vârstnicilor.', 'Elderly care work.'],
      ['FIERI (2007), The Romanians in Italy', 'FIERI (2007), The Romanians in Italy', 'https://fieri.it/wp-content/uploads/2013/05/Rapporto-finale-Transnational-Communities-in-a-Globalized-World-Romanians-transnational-practices-2007.pdf', 'Rolul limbii și al rețelelor.', 'The role of language and networks.'],
      ['Natural Earth (domeniu public)', 'Natural Earth (public domain)', 'https://www.naturalearthdata.com', 'Contururile hărții Europei și ale globului.', 'Outlines for the Europe map and the globe.']
    ] }
    ,{ ro: 'Plecare și întoarcere', en: 'Leaving and returning', items: [
      ['Eurostat, câștiguri pe meserii (earn_ses22_47)', 'Eurostat, earnings by occupation (earn_ses22_47)', ES('earn_ses22_47'), 'Salariul brut pe oră în România, Italia, Germania, Spania, Austria, Franța, 2022.', 'Gross hourly pay in Romania, Italy, Germany, Spain, Austria, France, 2022.'],
      ['Banca Mondială, remitențe primite (BX.TRF.PWKR.CD.DT)', 'World Bank, personal remittances received (BX.TRF.PWKR.CD.DT)', 'https://data.worldbank.org/indicator/BX.TRF.PWKR.CD.DT?locations=RO', 'Banii trimiși acasă, 2013–2025.', 'Money sent home, 2013–2025.'],
      ['Banca Mondială, investiții străine directe (BX.KLT.DINV.CD.WD)', 'World Bank, foreign direct investment (BX.KLT.DINV.CD.WD)', 'https://data.worldbank.org/indicator/BX.KLT.DINV.CD.WD?locations=RO', 'Pentru comparația cu remitențele.', 'For the comparison with remittances.'],
      ['Eurostat, emigrare și imigrare pe cetățenie (migr_emi1ctz, migr_imm1ctz)', 'Eurostat, emigration and immigration by citizenship (migr_emi1ctz, migr_imm1ctz)', ES('migr_imm1ctz'), 'Cetățeni români care pleacă și care se întorc, 2010–2024.', 'Romanian citizens leaving and returning, 2010–2024.'],
      ['ANPDCA, copii cu părinți plecați la muncă în străinătate (prin Economedia)', 'ANPDCA, children with parents working abroad (via Economedia)', 'https://economedia.ro/?p=330015', 'Situația la 31 decembrie 2025.', 'Figures for 31 December 2025.']
    ] }
  ];

  const METHOD = [
    ['Înălțimea județelor pe hartă e proporțională cu salariul mediu net din iunie 2025. Salariul e doar un indicator aproximativ al dezvoltării: nu include munca la negru, banii trimiși din străinătate sau costul vieții.',
     'County heights on the map are proportional to the average net salary in June 2025. Salary is only a rough measure of development: it leaves out undeclared work, money sent from abroad and the cost of living.'],
    ['INS publică două medii salariale: media anuală oficială (5.266 lei în 2025) și media anchetei lunare (5.536 lei, media lunilor din 2025). Comparațiile între domenii folosesc ancheta lunară.',
     'INS publishes two salary averages: the official annual average (5,266 lei in 2025) and the monthly survey average (5,536 lei, mean of the 2025 months). Comparisons between sectors use the monthly survey.'],
    ['Salariul net din tranșele de venit e estimat din cel brut: net ≈ brut × 0,585 (contribuții de 25% și 10%, impozit de 10%, fără deduceri).',
     'Net pay in the income bands is estimated from gross: net ≈ gross × 0.585 (25% and 10% contributions, 10% income tax, no deductions).'],
    ['În 2021, INS a schimbat metodologia anchetei forței de muncă: cei care produc doar pentru consumul propriu nu mai sunt numărați ca ocupați. De aceea, evoluția pe domenii e arătată separat pentru 2011–2020 și 2021–2025.',
     'In 2021 Romania changed its labour force survey method: people producing only for their own household are no longer counted as employed. That is why sector trends are shown separately for 2011–2020 and 2021–2025.'],
    ['Pentru accidente am folosit doar cele mortale: accidentele nemortale sunt raportate foarte incomplet în România.',
     'Only fatal accidents are used: non-fatal accidents are heavily under-reported in Romania.'],
    ['Diaspora are două definiții: harta Europei numără cetățenii români (Eurostat), globul numără persoanele născute în România, indiferent de cetățenie (ONU). Cifrele nu se adună între ele.',
     'The diaspora uses two definitions: the Europe map counts Romanian citizens (Eurostat), the globe counts people born in Romania whatever their citizenship (UN). The figures should not be added together.'],
    ['Industriile de top pe județe sunt o sinteză editorială după marii angajatori din fiecare județ, nu un clasament oficial.',
     'Top industries by county are an editorial summary based on each county’s main employers, not an official ranking.']
    ,['Remitențele de la Banca Mondială au o ruptură de metodă în 2013 (valorile sar de la 0,7 la 4,8 miliarde de dolari de la un an la altul). De aceea arătăm doar perioada 2013–2025.',
      'World Bank remittance data has a method break in 2013 (values jump from $0.7 bn to $4.8 bn in one year). That is why only 2013–2025 is shown.']
    ,['Pentru întoarceri folosim datele Eurostat despre cetățenii români: imigrarea temporară publicată de INS îi include și pe străinii veniți la muncă în România.',
      'Returns use Eurostat data on Romanian citizens: the temporary immigration figures published by INS also include foreigners coming to work in Romania.']
  ];
  const mbox = document.getElementById('methodList');
  if (mbox) mbox.innerHTML = METHOD.map(m => '<li>' + (window.LANG === 'en' ? m[1] : m[0]) + '</li>').join('');
  document.querySelectorAll('.sec:not(#surse) .src').forEach(p => {
    if (p.id === 'lifeSrc') return;
    p.insertAdjacentHTML('beforeend', ' <a class="to-src" href="#surse">' + (window.LANG === 'en' ? 'All sources ↓' : 'Toate sursele ↓') + '</a>');
  });

  const box = document.getElementById('sourcesList');
  if (!box) return;
  const EN = window.LANG === 'en';
  box.innerHTML = SOURCES.map(g =>
    '<div class="src-group"><h4>' + (EN ? g.en : g.ro) + '</h4><ol>' +
    g.items.map(it => '<li><a href="' + it[2] + '" target="_blank" rel="noopener">' + (EN ? it[1] : it[0]) + ' <span aria-hidden="true">↗</span></a><p>' + (EN ? it[4] : it[3]) + '</p></li>').join('') +
    '</ol></div>').join('');
})();
