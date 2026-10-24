/*
  „De ce pleacă românii” (linie a timpului legată de glob) și capitolul „Plecare și întoarcere”:
  salarii aici vs. acolo, banii trimiși acasă, plecări vs. întoarceri, copiii rămași acasă.
*/
window.Migration = (function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  const TIMELINE = [
    { y: '1990', g: 1990, ro: ['Granițele se deschid', 'Primii care pleacă în masă sunt etnicii germani, maghiari și evrei, spre Germania, Ungaria și Israel. În 1990 trăiau în străinătate ~0,96 milioane de oameni născuți în România.'],
      en: ['The borders open', 'The first to leave in large numbers are ethnic Germans, Hungarians and Jews, heading to Germany, Hungary and Israel. In 1990 about 0.96 million people born in Romania lived abroad.'] },
    { y: '2002', g: 2005, ro: ['Fără vize în Schengen', 'Din ianuarie 2002, românii intră în spațiul Schengen fără viză. Plecările spre Italia și Spania cresc puternic. În noiembrie, Italia legalizează imigranții care lucrau la negru.'],
      en: ['Visa-free Schengen', 'From January 2002 Romanians can enter the Schengen area without a visa. Departures to Italy and Spain rise sharply. In November, Italy legalises immigrants working without papers.'] },
    { y: '2007', g: 2010, ro: ['Aderarea la UE', 'Românii primesc libertate de mișcare, deși mai multe țări păstrează restricții pe piața muncii până în 2014.'],
      en: ['Joining the EU', 'Romanians gain freedom of movement, although several countries keep labour-market restrictions until 2014.'] },
    { y: '2008–10', g: 2010, ro: ['Criza financiară', 'Construcțiile din Spania și Italia se prăbușesc. Unii români se întorc acasă, alții se mută mai spre nord.'],
      en: ['The financial crisis', 'Construction collapses in Spain and Italy. Some Romanians return home, others move further north.'] },
    { y: '2014', g: 2015, ro: ['Cad ultimele restricții', 'Germania, Regatul Unit și Austria își deschid complet piața muncii. Germania devine principala destinație pentru noii plecați.'],
      en: ['The last restrictions go', 'Germany, the UK and Austria fully open their labour markets. Germany becomes the main destination for new emigrants.'] },
    { y: '2016–20', g: 2020, ro: ['Brexit și pandemia', 'După votul pentru Brexit, sute de mii de români își cer statutul de rezident în Regatul Unit. În 2020, mii de muncitori sezonieri pleacă cu zboruri charter spre fermele din Germania.'],
      en: ['Brexit and the pandemic', 'After the Brexit vote, hundreds of thousands of Romanians apply for settled status in the UK. In 2020 thousands of seasonal workers fly on charter planes to German farms.'] },
    { y: '2022+', g: 2024, ro: ['Mai multe întoarceri', 'Din 2022, datele Eurostat arată în fiecare an mai mulți români care se întorc decât români care pleacă.'],
      en: ['More people coming back', 'Since 2022, Eurostat data shows more Romanians returning each year than leaving.'] }
  ];
  const ITALY = [
    ['Fără vize din 2002', 'No visas from 2002', 'Momentul pe care emigranții îl descriu drept decisiv: plecarea devine ușoară și cu risc mic.', 'The moment emigrants describe as decisive: leaving becomes easy and low-risk.', 'https://onlinelibrary.wiley.com/doi/10.1155/2024/7435493'],
    ['Legalizarea din 2002', 'The 2002 amnesty', 'Italia dă acte celor care lucrau ilegal. Numărul românilor cu permis de ședere crește brusc, iar zvonurile despre legalizare atrag și mai mulți.', 'Italy legalises undocumented workers. Romanian residence permits jump, and rumours of amnesties draw even more people.', 'https://www.researchgate.net/publication/255708598_Regularisation_of_Unauthorised_Immigrants_in_Italy_and_Spain_Determinants_and_Effects'],
    ['Cererea de îngrijitoare', 'Demand for carers', 'Italia are una dintre cele mai îmbătrânite populații din Europa. Mii de românce lucrează ca „badante”, îngrijind bătrâni acasă; bărbații merg în construcții și agricultură.', 'Italy has one of Europe’s oldest populations. Thousands of Romanian women work as live-in carers (“badanti”); men go into construction and farming.', 'https://ceemr.uw.edu.pl/vol-10-no-2-2021/articles/migration-and-elderly-care-work-italy-three-stories-romanian-and-moldovan'],
    ['Limba', 'Language', 'Româna și italiana sunt limbi latine, așa că integrarea e mai ușoară. Studiile nu sunt de acord cât de mult a contat.', 'Romanian and Italian are both Romance languages, which makes integration easier. Studies disagree on how much it mattered.', 'https://fieri.it/wp-content/uploads/2013/05/Rapporto-finale-Transnational-Communities-in-a-Globalized-World-Romanians-transnational-practices-2007.pdf']
  ];

  const OCC = [['TOTAL', 'Toate meseriile', 'All jobs'], ['OC2', 'Specialiști (medici, ingineri, profesori)', 'Professionals (doctors, engineers, teachers)'],
    ['OC5', 'Servicii și vânzări (îngrijire, comerț)', 'Service and sales (care, retail)'], ['OC7', 'Meseriași (construcții, mecanici)', 'Craft trades (construction, mechanics)'],
    ['OC8', 'Operatori de mașini și șoferi', 'Machine operators and drivers'], ['OC9', 'Muncitori necalificați', 'Elementary jobs (cleaners, labourers)']];

  function init(C, fmt, col, goGlobe) {
    const X = window.RO_EXTRA.mig, EN = window.LANG === 'en';
    const T = (ro, en) => (EN ? en : ro);

    /* ---------- linia timpului ---------- */
    const tl = $('#timeline');
    if (tl) {
      tl.innerHTML = TIMELINE.map((t, i) => {
        const [h, p] = EN ? t.en : t.ro;
        return '<li class="tl-item"><span class="tl-year">' + t.y + '</span><h4>' + h + '</h4><p>' + p + '</p>' +
          '<button class="tl-go" data-g="' + t.g + '">' + T('Vezi pe glob, ' + t.g, 'See it on the globe, ' + t.g) + ' →</button></li>';
      }).join('');
      tl.querySelectorAll('.tl-go').forEach(b => b.addEventListener('click', () => goGlobe(+b.dataset.g)));
    }
    const it = $('#whyItaly');
    if (it) {
      it.innerHTML = '<h4>' + T('Factorii emigrației spre Italia', 'Why so many went to Italy') + '</h4><p class="wi-lead">' +
        T('Nu există un singur motiv. Patru factori s-au suprapus la începutul anilor 2000:', 'There is no single reason. Four factors overlapped in the early 2000s:') + '</p><ol>' +
        ITALY.map(r => '<li><b>' + (EN ? r[1] : r[0]) + '</b><span>' + (EN ? r[3] : r[2]) + ' <a href="' + r[4] + '" target="_blank" rel="noopener">' + T('sursa', 'source') + ' ↗</a></span></li>').join('') +
        '</ol><p class="wi-note">' + T('În plus, rețelele de rude și vecini: cine pleca aducea apoi familia, uneori sate întregi plecate în același oraș. După 2014, noii plecați aleg mai des Germania, unde salariile sunt mai mari.',
          'Add family and village networks: whoever left would bring relatives, sometimes whole villages ending up in the same Italian town. After 2014 new emigrants more often chose Germany, where pay is higher.') + '</p>';
    }

    /* ---------- salarii aici vs. acolo ---------- */
    let occ = 'OC9', unit = 'EUR';
    const occBox = $('#occChips');
    occBox.innerHTML = OCC.map(o => '<button data-o="' + o[0] + '" class="' + (o[0] === occ ? 'on' : '') + '">' + (EN ? o[2] : o[1]) + '</button>').join('');
    function renderOcc() {
      const v = X.occ[occ][unit], ve = X.occ[occ].EUR, vp = X.occ[occ].PPS;
      const rows = Object.entries(v).sort((a, b) => b[1] - a[1]);
      const rE = ve.DE / ve.RO, rP = vp.DE / vp.RO;
      $('#occLead').innerHTML = T('În Germania, aceeași muncă e plătită de <b>' + fmt(rE, 1) + ' ori</b> mai bine în euro. Dacă ținem cont că și prețurile sunt mai mari acolo, diferența scade la <b>' + fmt(rP, 1) + ' ori</b>.',
        'In Germany the same work pays <b>' + fmt(rE, 1) + ' times</b> more in euros. Once higher prices there are taken into account, the gap shrinks to <b>' + fmt(rP, 1) + ' times</b>.');
      C.rank($('#occChart'), {
        title: unit === 'EUR' ? T('Salariu brut pe oră, în euro, 2022', 'Gross hourly pay, euros, 2022') : T('Salariu brut pe oră, în putere de cumpărare (PPS), 2022', 'Gross hourly pay, purchasing power (PPS), 2022'),
        rows, dec: 2, unit: unit === 'EUR' ? ' €' : ' PPS', fmtv: x => fmt(x, 2) + (unit === 'EUR' ? ' €' : '')
      });
    }
    occBox.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      occ = b.dataset.o; occBox.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b)); renderOcc();
    });
    $$('#occUnit button').forEach(b => b.addEventListener('click', () => {
      unit = b.dataset.u; $$('#occUnit button').forEach(x => x.classList.toggle('on', x === b)); renderOcc();
    }));
    renderOcc();

    /* ---------- banii trimiși acasă ---------- */
    const yrs = Object.keys(X.remit).sort(), last = yrs[yrs.length - 1];
    const above = yrs.filter(y => X.remit[y] > X.fdi[y]).length;
    $('#remitLead').innerHTML = '<div class="mg-big">' + fmt(X.remit[last], 1) + T(' mld. $', ' bn $') + '</div><p>' +
      T('au trimis acasă românii din străinătate în ' + last + ', mai mult decât toate investițiile străine directe din același an (' + fmt(X.fdi[last], 1) + ' mld. $). Din ' + yrs.length + ' ani, banii trimiși acasă au depășit investițiile străine în ' + above + '.',
        'sent home by Romanians abroad in ' + last + ', more than all foreign direct investment that year ($' + fmt(X.fdi[last], 1) + ' bn). In ' + above + ' of the last ' + yrs.length + ' years, remittances exceeded foreign investment.') + '</p>';
    C.line($('#remitChart'), {
      title: T('Remitențe vs. investiții străine directe, miliarde $', 'Remittances vs. foreign direct investment, $ bn'), dec: 1, yMin: 0,
      series: [{ name: T('Bani trimiși acasă', 'Remittances'), color: col('--acc'), data: X.remit }, { name: T('Investiții străine', 'Foreign investment'), color: col('--mute'), muted: true, data: X.fdi }]
    });

    /* ---------- plecări vs. întoarceri ---------- */
    const ry = Object.keys(X.ret.in).sort(), rl = ry[ry.length - 1];
    $('#retLead').innerHTML = '<div class="mg-big">' + fmt(X.ret.in[rl]) + '</div><p>' +
      T('de români s-au întors în țară în ' + rl + ', față de ' + fmt(X.ret.out[rl]) + ' care au plecat. Din 2022, întoarcerile depășesc plecările în fiecare an.',
        'Romanians came back in ' + rl + ', compared with ' + fmt(X.ret.out[rl]) + ' who left. Since 2022, returns have outnumbered departures every year.') + '</p>';
    C.line($('#retChart'), {
      title: T('Cetățeni români care pleacă și care se întorc, pe an', 'Romanian citizens leaving and returning, per year'), dec: 0, yMin: 0, axisW: 46,
      fmtTick: x => fmt(x / 1000, 0) + 'k', fmtLab: x => fmt(x / 1000, 0) + 'k',
      series: [{ name: T('Plecați', 'Left'), color: col('--hot'), data: X.ret.out }, { name: T('Întorși', 'Returned'), color: col('--acc'), data: X.ret.in }]
    });

    /* ---------- copiii rămași acasă ---------- */
    const K = X.kids;
    $('#kids').innerHTML = [
      [fmt(K.any), T('copii aveau cel puțin un părinte plecat la muncă în străinătate la sfârșitul lui 2025.', 'children had at least one parent working abroad at the end of 2025.')],
      [fmt(K.both), T('dintre ei aveau ambii părinți plecați. Cei mai mulți rămân în grija bunicilor sau a altor rude.', 'of them had both parents abroad. Most are left in the care of grandparents or other relatives.')],
      ['−' + fmt((1 - K.any / K.anyPrev) * 100, 0) + '%', T('față de sfârșitul lui 2024 (' + fmt(K.anyPrev) + ' copii). Numărul scade de la an la an.', 'compared with the end of 2024 (' + fmt(K.anyPrev) + ' children). The number keeps falling.')]
    ].map((s, i) => '<div class="card stat-tile' + (i === 0 ? ' accent' : '') + '"><div class="mega">' + s[0] + '</div><span class="label">' + s[1] + '</span></div>').join('');
  }

  return { init };
})();
