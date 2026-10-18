(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = (n, dec) => n.toLocaleString(window.LOCALE || 'ro-RO', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  const D = window.RO_DATA;

  /* ---------- temă ---------- */
  let map = null;
  $('#themeBtn').addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('hm-theme', next); } catch (e) {}
    setTimeout(() => { if (map) map.refreshColors(); renderCharts(); }, 30);
  });

  /* ---------- lumină după cursor ---------- */
  window.addEventListener('pointermove', e => {
    document.body.style.setProperty('--mx', e.clientX + 'px');
    document.body.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  /* ---------- count-up ---------- */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const to = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0);
    const t0 = performance.now(), dur = 1400;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * e, dec);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  function animateNumber(el, to, dec, dur) {
    const from = parseFloat(el.dataset.v || 0), t0 = performance.now();
    el.dataset.v = to;
    (function step(now) {
      const p = Math.min(1, (now - t0) / (dur || 900)), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(from + (to - from) * e, dec);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ---------- puncte gen ---------- */
  $$('.dots').forEach(box => {
    const on = +box.dataset.dots, cls = box.dataset.cls;
    let h = '';
    for (let i = 0; i < 100; i++) h += '<i class="' + (i < on ? 'on ' + cls : '') + '" style="transition-delay:' + (i * 12) + 'ms"></i>';
    box.innerHTML = h;
  });

  /* ---------- împărțire pe sectoare ---------- */
  $('#split').innerHTML = window.RO_SECTORS_SPLIT.map(s =>
    '<div data-w="' + s.v + '"><b>' + fmt(s.v, 1) + '%</b><span>' + s.k + '</span></div>').join('');

  /* ---------- domenii ---------- */
  const WORK = window.RO_EXTRA.work, WK = {};
  WORK.rows.forEach(r => { WK[r.k] = r; });
  const domFacts = k => k === 'wood' ? { net: WORK.wood, h: WK.C.h, perH: WORK.wood / (WK.C.h * 52 / 12) } : WK[k];
  const payLevel = v => v < WORK.avgPerH * 0.9 ? 'low' : v > WORK.avgPerH * 1.1 ? 'high' : 'avg';
  const domBox = $('#domains');
  domBox.innerHTML = window.RO_DOMAINS.map((d, i) => {
    const f = domFacts(d.k);
    return '<button class="dom reveal" style="transition-delay:' + (i % 4) * 60 + 'ms" aria-expanded="false">' +
      '<span class="di">' + ICONS(d.icon) + '</span>' +
      '<span class="pay ' + payLevel(f.perH) + '" title="' + L('Salariu net pe oră de muncă', 'Net pay per hour worked') + '"><b>' + fmt(f.perH, 0) + ' lei</b>' + L('/oră', '/hour') + '</span>' +
      '<h4>' + d.t + '</h4>' +
      '<span class="dom-facts"><span>' + fmt(f.net) + L(' lei net/lună', ' lei net/month') + '</span><span>' + fmt(f.h, 1) + L(' h/săpt.', ' h/week') + '</span></span>' +
      '<p>' + d.d + '</p></button>';
  }).join('');
  domBox.addEventListener('click', e => {
    const b = e.target.closest('.dom'); if (!b) return;
    const was = b.classList.contains('open');
    $$('.dom.open').forEach(x => { x.classList.remove('open'); x.setAttribute('aria-expanded', 'false'); });
    if (!was) { b.classList.add('open'); b.setAttribute('aria-expanded', 'true'); }
  });

  /* ---------- angajare ---------- */
  const hireBox = $('#hire');
  hireBox.innerHTML = window.RO_HIRE.map((h, i) =>
    '<div class="flip reveal" tabindex="0" role="button" aria-label="' + h.t + '" style="transition-delay:' + (i % 3) * 80 + 'ms"><div class="flip-in">' +
      '<div class="face"><span class="turn">' + ICONS('arrow') + '</span><span class="hi">' + ICONS(h.icon) + '</span><h4>' + h.t + '</h4>' +
        '<div class="hb">' + h.big + '</div><div class="hu">' + h.unit + '</div></div>' +
      '<div class="face back"><p>' + h.d + '</p><div class="s">' + h.src + '</div></div>' +
    '</div></div>').join('');
  hireBox.addEventListener('click', e => { const f = e.target.closest('.flip'); if (f) f.classList.toggle('on'); });
  hireBox.addEventListener('keydown', e => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.classList.contains('flip')) { e.preventDefault(); e.target.classList.toggle('on'); }
  });

  /* ---------- reveal la scroll ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      el.classList.add('in');
      el.querySelectorAll('[data-count]').forEach(countUp);
      if (el.id === 'split') el.querySelectorAll('div').forEach(d => { d.style.flexBasis = d.dataset.w + '%'; });
      io.unobserve(el);
    });
  }, { threshold: 0.18 });
  $$('.reveal, #split').forEach(el => io.observe(el));
  // numere din titluri (în afara .reveal)
  $$('.h2 [data-count]').forEach(el => {
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { countUp(el); o.disconnect(); } }).observe(el);
  });

  /* ---------- nav activ ---------- */
  const navLinks = $$('.nav-links a');
  const secIO = new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => secIO.observe(s));

  /* ---------- viața la muncă (taburi) ---------- */
  const X = window.RO_EXTRA;
  const C = window.Charts;
  const col = v => C.css(v);
  const rankOf = (rows, id) => rows.findIndex(r => r[0] === id) + 1;
  const LIFE = {
    hours: () => {
      const d = X.hours, ro = d.rows.find(r => r[0] === 'RO')[1], nl = d.rows.find(r => r[0] === 'NL')[1];
      const extraWeeks = (ro - nl) * 46 / ro;
      return {
        big: fmt(ro, 1) + ' h', lead: L('lucrează efectiv un român într-o săptămână obișnuită. Cu ' + fmt(ro - d.eu, 1) + ' ore <b>mai mult</b> decât media UE.', 'is how long a Romanian actually works in a typical week. That’s ' + fmt(ro - d.eu, 1) + ' hours <b>more</b> than the EU average.'),
        facts: [[L('Media UE', 'EU average'), fmt(d.eu, 1) + ' h'], [L('Locul în UE', 'EU ranking'), rankOf(d.rows, 'RO') + L(' din ', ' of ') + d.rows.length + L(' (mai sus = mai multe ore)', ' (higher = more hours)')], [L('Față de Olanda', 'Compared with the Netherlands'), '+' + fmt(ro - nl, 1) + L(' h pe săptămână', ' h a week')]],
        note: L('<b>De ce nu 40 de ore?</b> Cifra nu e programul din contract, ci media orelor lucrate efectiv. Intră în calcul și cei cu jumătate de normă, și săptămânile cu concediu sau zile libere. În România foarte puțini lucrează cu jumătate de normă, așa că media iese mai mare decât în vest.<br><br>În Olanda, mulți lucrează part-time. Cele ' + fmt(ro - nl, 1) + ' ore în plus pe săptămână ale unui român înseamnă cam <b>' + fmt(extraWeeks, 0) + ' săptămâni de muncă în plus pe an</b>.', '<b>Why not 40 hours?</b> This isn’t the hours in a contract but the average actually worked. It includes part-timers and weeks with holidays or days off. Very few Romanians work part-time, so the average comes out higher than in Western Europe.<br><br>In the Netherlands many people work part-time. A Romanian’s extra ' + fmt(ro - nl, 1) + ' hours a week add up to roughly <b>' + fmt(extraWeeks, 0) + ' extra weeks of work a year</b>.'),
        rank: { title: L('Ore lucrate pe săptămână, ', 'Hours worked per week, ') + d.year, sub: L('Barele arată cât de departe e fiecare țară de media UE', 'Bars show how far each country is from the EU average'), rows: d.rows, eu: d.eu, dec: 1, unit: ' h', diverge: true },
        trend: { title: L('Cum a evoluat', 'How it changed'), series: [['RO', L('România', 'Romania'), '--acc'], ['EU27_2020', L('Media UE', 'EU average'), '--mute', 1], ['NL', L('Olanda', 'Netherlands'), '--s3']], dec: 1, unitShort: ' h' },
        src: L('Eurostat, lfsa_ewhan2: ore efectiv lucrate la locul de muncă principal, persoane de 20–64 de ani.', 'Eurostat, lfsa_ewhan2: hours actually worked in the main job, people aged 20–64.')
      };
    },
    neet: () => {
      const d = X.neet, ro = d.rows.find(r => r[0] === 'RO')[1];
      return {
        big: fmt(ro, 1) + '%', lead: L('dintre tinerii de 15–29 ani nici nu lucrează, nici nu învață. Aproape 1 din 5.', 'of young people aged 15–29 are neither working nor studying. Almost 1 in 5.'),
        facts: [[L('Media UE', 'EU average'), fmt(d.eu, 1) + '%'], [L('Locul în UE', 'EU ranking'), rankOf(d.rows, 'RO') + L(' din ', ' of ') + d.rows.length + L(' (cel mai rău)', ' (the worst)')], [L('Ținta UE pentru 2030', 'EU target for 2030'), L('sub 9%', 'below 9%')]],
        note: L('NEET vine din engleză: <i>Not in Employment, Education or Training</i>. Media UE a scăzut constant din 2015, iar România a revenit după pandemie aproape la nivelul de atunci.', 'NEET stands for <i>Not in Employment, Education or Training</i>. The EU average has fallen steadily since 2015, while Romania climbed back after the pandemic to almost where it started.'),
        rank: { title: L('Tineri NEET (15–29 ani), ', 'Young NEETs (aged 15–29), ') + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
        trend: { title: L('România vs. media UE', 'Romania vs. EU average'), series: [['RO', L('România', 'Romania'), '--acc'], ['EU27_2020', L('Media UE', 'EU average'), '--mute', 1]], dec: 1, unitShort: '%', yMin: 0 },
        src: L('Eurostat, edat_lfse_20: tineri care nu sunt ocupați și nu urmează nicio formă de educație sau formare.', 'Eurostat, edat_lfse_20: young people not in employment and not in any education or training.')
      };
    },
    iwp: () => {
      const d = X.iwp, ro = d.rows.find(r => r[0] === 'RO')[1];
      return {
        big: fmt(ro, 1) + '%', lead: L('dintre românii care au un loc de muncă trăiesc totuși sub pragul de sărăcie.', 'of Romanians with a job still live below the poverty line.'),
        facts: [[L('Media UE', 'EU average'), fmt(d.eu, 1) + '%'], [L('Locul în UE', 'EU ranking'), rankOf(d.rows, 'RO') + L(' din ', ' of ') + d.rows.length], [L('În 2015', 'In 2015'), L('18,6%, locul 1 în UE', '18.6%, worst in the EU')]],
        note: L('Ani la rând, România a avut cea mai mare rată din UE. În 2024 a scăzut brusc, de la 15% la 10,7%. Saltul e neobișnuit de mare pentru un singur an, așa că merită urmărit și în datele următoare.', 'For years Romania had the highest rate in the EU. In 2024 it fell sharply, from 15% to 10.7%. That’s an unusually big jump for one year, so it’s worth watching in the next releases.'),
        rank: { title: L('Sărăcia în rândul celor care muncesc, ', 'In-work poverty rate, ') + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
        trend: { title: L('România vs. media UE', 'Romania vs. EU average'), series: [['RO', L('România', 'Romania'), '--acc'], ['EU27_2020', L('Media UE', 'EU average'), '--mute', 1]], dec: 1, unitShort: '%', yMin: 0 },
        src: L('Eurostat, ilc_iw01: persoane ocupate de 18–64 de ani cu venit sub 60% din venitul median național.', 'Eurostat, ilc_iw01: employed people aged 18–64 with income below 60% of the national median.')
      };
    }
  };
  LIFE.grad = () => {
    const d = X.grad, ro = d.rows.find(r => r[0] === 'RO')[1], LV = d.levels;
    return {
      big: fmt(ro, 1) + '%', lead: L('dintre tinerii cu facultate au un loc de muncă la 1–3 ani după absolvire.', 'of young university graduates have a job 1–3 years after graduating.'),
      facts: [[L('Media UE', 'EU average'), fmt(d.eu, 1) + '%'], [L('Locul în UE', 'EU ranking'), rankOf(d.rows, 'RO') + L(' din ', ' of ') + d.rows.length], [L('Cu liceu sau școală profesională', 'With high school or vocational school'), fmt(LV.RO.ED3_4, 1) + L('% (UE: ', '% (EU: ') + fmt(LV.EU.ED3_4, 1) + '%)']],
      note: L('Cu o diplomă de facultate, șansele sunt aproape ca în restul UE. Problema mare e la cei fără facultate: dintre absolvenții de <b>școală profesională</b>, doar ' + fmt(LV.RO.ED35_45, 1) + '% lucrează, față de ' + fmt(LV.EU.ED35_45, 1) + '% în UE.', 'With a university degree, the odds are close to the rest of the EU. The big problem is for those without one: among <b>vocational school</b> graduates only ' + fmt(LV.RO.ED35_45, 1) + '% have a job, compared with ' + fmt(LV.EU.ED35_45, 1) + '% in the EU.'),
      rank: { title: L('Absolvenți de facultate cu un job (20–34 ani), ', 'University graduates in work (aged 20–34), ') + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
      trend: { title: L('România vs. media UE', 'Romania vs. EU average'), series: [['RO', L('România', 'Romania'), '--acc'], ['EU27_2020', L('Media UE', 'EU average'), '--mute', 1]], dec: 1, unitShort: '%' },
      src: L('Eurostat, edat_lfse_24: rata de ocupare a tinerilor de 20–34 de ani care au terminat studiile în ultimii 1–3 ani și nu mai sunt în educație.', 'Eurostat, edat_lfse_24: employment rate of people aged 20–34 who finished their studies 1–3 years ago and are no longer in education.')
    };
  };
  LIFE.self = () => {
    const d = X.self, ro = d.rows.find(r => r[0] === 'RO')[1];
    const agri = d.nace.find(r => r.k === 'A');
    return {
      big: fmt(ro, 1) + '%', lead: 'dintre românii care muncesc lucrează pe cont propriu: PFA-uri, fermieri, meseriași, profesii liberale.',
      facts: [['Media UE', fmt(d.eu, 1) + '%'], ['Locul în UE', rankOf(d.rows, 'RO') + ' din ' + d.rows.length], ['Persoane', fmt(d.total, 0) + ' mii (' + fmt(d.prev, 0) + ' mii în 2024)']],
      note: 'Contrar impresiei, România are <b>mai puțini</b> lucrători pe cont propriu decât media UE. Și aproape jumătate dintre ei (' + fmt(agri.v / d.total * 100, 0) + '%) sunt în agricultură, nu freelanceri. Pentru IT, Eurostat nu publică o cifră pentru România: eșantionul e prea mic, iar mulți programatori lucrează prin propriul SRL, nu ca PFA.',
      rank: { title: 'Pe cont propriu, % din cei care muncesc, ' + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
      domains: { title: 'În ce domenii lucrează românii pe cont propriu', sub: 'mii de persoane, ' + d.year + ' · * estimare cu precizie scăzută', rows: d.nace.map(r => [r.t + (r.low ? ' *' : ''), r.v]) },
      src: 'Eurostat, lfsa_esgan2 și lfsa_egan2: lucrători pe cont propriu (cu sau fără angajați), 15–74 ani, ca procent din totalul persoanelor ocupate.'
    };
  };
  let lifeTab = 'hours';
  function renderLife() {
    const t = LIFE[lifeTab]();
    $('#lifeCopy').innerHTML = '<div class="life-big">' + t.big + '</div><p class="life-lead">' + t.lead + '</p>' +
      '<dl class="life-facts">' + t.facts.map(f => '<div><dt>' + f[0] + '</dt><dd>' + f[1] + '</dd></div>').join('') + '</dl>' +
      '<p class="life-note">' + t.note + '</p>';
    C.rank($('#lifeRank'), t.rank);
    if (t.domains) {
      C.rank($('#lifeTrend'), { title: t.domains.title, sub: t.domains.sub, rows: t.domains.rows, highlight: null, dec: 0, labels: r => r[0], tipv: r => fmt(r[1], 1) + ' mii de persoane', wideLabels: true });
    } else {
      const trend = X[lifeTab].trend;
      C.line($('#lifeTrend'), {
        title: t.trend.title, dec: t.trend.dec, unitShort: t.trend.unitShort, yMin: t.trend.yMin,
        series: t.trend.series.map(s => ({ name: s[1], color: col(s[2]), muted: !!s[3], data: trend[s[0]] }))
      });
    }
    $('#lifeSrc').textContent = L('Sursa: ', 'Source: ') + t.src;
    const life = $('#life'); life.classList.remove('swap'); void life.offsetWidth; life.classList.add('swap');
  }
  function moveInk() {
    const b = $('#lifeTabs .on'), ink = $('#tabInk');
    ink.style.width = b.offsetWidth + 'px'; ink.style.transform = 'translateX(' + b.offsetLeft + 'px)';
  }
  $$('#lifeTabs button').forEach(b => b.addEventListener('click', () => {
    $$('#lifeTabs button').forEach(x => x.classList.toggle('on', x === b));
    lifeTab = b.dataset.tab; moveInk(); renderLife();
  }));
  window.addEventListener('resize', moveInk);

  /* ---------- diaspora ---------- */
  const DIAS = X.diaspora;
  function sideFor(d) {
    const ser = d.ser || {};
    const yrs = Object.keys(ser);
    const hasSeries = yrs.length > 3;
    $('#euSide').innerHTML =
      '<p class="eu-k">' + L('Românii din', 'Romanians in') + '</p><h3>' + C.name(d.id) + '</h3>' +
      '<div class="eu-big">' + fmt(d.n) + '</div><p class="eu-u">' + (d.note ? d.note : L('cetățeni români, ', 'Romanian citizens, ') + d.y) + '</p>' +
      '<div class="eu-pct"><b>' + fmt(d.pct, 2) + '%</b><span>' + L('din populația țării, adică cam 1 din ', 'of the population, roughly 1 in every ') + fmt(100 / d.pct, 0) + L(' locuitori.', ' residents.') + '</span></div>' +
      (hasSeries ? '<div class="eu-mini" id="euMini"></div>' : '<p class="eu-u">' + L('Nu există o serie comparabilă în timp pentru această țară.', 'There’s no comparable time series for this country.') + '</p>');
    if (hasSeries) {
      C.line($('#euMini'), {
        title: L('Evoluție ', 'Trend ') + yrs[0] + '–' + yrs[yrs.length - 1], w: 300, h: 150, axisW: 34, dec: 0, legend: false, labels: false,
        fmtTick: v => v >= 1e6 ? fmt(v / 1e6, 1) + 'M' : fmt(v / 1000, 0) + 'k',
        series: [{ name: '', color: col('--acc'), data: ser }]
      });
    }
  }
  let euSel = 'IT';
  function renderDias() {
    $('#euMap').querySelectorAll('svg').forEach(x => x.remove());
    const euMap = C.euMap($('#euMap'), DIAS, d => { euSel = d.id; sideFor(d); });
    euMap.select(euSel);
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { setTimeout(euMap.draw, 250); o.disconnect(); } }, { threshold: 0.25 }).observe($('#euMap'));
    const top = DIAS.filter(d => d.ser && Object.keys(d.ser).length > 8).slice(0, 4);
    C.line($('#diasTrend'), {
      title: L('Unde au crescut comunitățile', 'Where the communities grew'), sub: L('Cetățeni români rezidenți, primele 4 destinații cu serie completă', 'Resident Romanian citizens, top 4 destinations with a full time series'), dec: 0, yMin: 0, axisW: 46,
      fmtLab: v => v >= 1e6 ? fmt(v / 1e6, 2) + L(' mil.', 'm') : fmt(v / 1000, 0) + 'k',
      fmtTick: v => v >= 1e6 ? fmt(v / 1e6, 1) + L(' mil.', 'm') : fmt(v / 1000, 0) + 'k',
      series: top.map((d, i) => ({ name: C.name(d.id), color: col('--s' + (i + 1)), data: d.ser }))
    });
    C.rank($('#diasRank'), {
      title: L('Cei mai mulți români', 'Largest Romanian communities'), sub: L('Număr de persoane, cel mai recent an disponibil', 'Number of people, latest year available'), highlight: null,
      rows: DIAS.slice(0, 12).map(d => [d.id, d.n]),
      fmtv: v => v >= 1e6 ? fmt(v / 1e6, 2) + L(' mil.', 'm') : fmt(v / 1000, 0) + 'k',
      tipv: r => fmt(r[1]) + L(' români', ' Romanians')
    });
  }

  /* ---------- ce industrii au crescut ---------- */
  let growthP = 'p1';
  function renderGrowth() {
    const p = X.sect[growthP];
    C.rank($('#growth'), {
      title: '', rows: p.rows, eu: 0, diverge: true, centerLabel: '0%', highlight: null, wideLabels: true, cls: 'growth-bars',
      labels: r => r[0], fmtv: v => { const r = Math.round(v); return (r > 0 ? '+' : r < 0 ? '−' : '') + fmt(Math.abs(r), 0) + '%'; },
      tipv: r => (r[1] > 0 ? '+' : '') + fmt(r[1], 1) + '% (' + fmt(r[2]) + ' → ' + fmt(r[3]) + L(' mii de oameni, ', ' thousand people, ') + p.from + '–' + p.to + ')'
    });
  }
  $$('#growthSeg button').forEach(b => b.addEventListener('click', () => {
    $$('#growthSeg button').forEach(x => x.classList.toggle('on', x === b));
    growthP = b.dataset.p; renderGrowth();
  }));

  /* ---------- cât valorează munca ---------- */
  function renderWork() {
    const rows = WORK.rows, avg = WORK.avgPerH;
    const totEmp = rows.reduce((s, r) => s + (r.emp || 0), 0);
    const lowEmp = rows.filter(r => r.perH < avg).reduce((s, r) => s + (r.emp || 0), 0);
    const stats = [
      [fmt(WK.J.perH / WK.I.perH, 1) + '×', L('câștigă pe oră un angajat din IT față de unul din HoReCa: ', 'is how much more an IT worker earns per hour than someone in hotels and restaurants: ') + fmt(WK.J.perH, 0) + L(' vs. ', ' vs. ') + fmt(WK.I.perH, 0) + L(' lei net.', ' lei net.')],
      [fmt(lowEmp / totEmp * 100, 0) + '%', L('dintre cei care muncesc sunt în domenii plătite pe oră sub media economiei.', 'of people in work are in sectors that pay less per hour than the economy-wide average.')],
      [fmt(WK.A.acc / WK.A.accEU, 1) + '×', L('mai multe accidente mortale în agricultura din România decât media UE.', 'as many fatal accidents in Romanian farming as the EU average.')]
    ];
    $('#workStats').innerHTML = stats.map((s, i) =>
      '<div class="card stat-tile' + (i === 0 ? ' accent' : '') + '"><div class="mega">' + s[0] + '</div><span class="label">' + s[1] + '</span></div>').join('');
    const byPay = rows.slice().sort((a, b) => b.perH - a.perH);
    C.rank($('#perHour'), {
      title: L('Cât câștigi pe o oră de muncă', 'What an hour of work pays'),
      sub: L('Salariul mediu net împărțit la orele lucrate efectiv, pe domenii, 2025. Treci cu mouse-ul peste un domeniu pentru detalii.', 'Average net salary divided by hours actually worked, by sector, 2025. Hover over a sector for details.'),
      rows: byPay.map(r => [r.t, r.perH, r]), eu: avg, centerLabel: L('media economiei: ', 'economy average: ') + fmt(avg, 1) + ' lei',
      highlight: null, wideLabels: true, cls: 'pay-bars', labels: r => r[0], fmtv: v => fmt(v, 1) + ' lei',
      barClass: r => r[1] < avg ? 'under' : 'over',
      tipv: r => fmt(r[1], 1) + L(' lei net pe oră', ' lei net per hour') + '<br><small>' + fmt(r[2].net) + L(' lei net pe lună · ', ' lei net a month · ') + fmt(r[2].h, 1) + L(' ore pe săptămână · ', ' hours a week · ') + fmt(r[2].emp, 0) + L(' mii de oameni', ' thousand people') + '</small>'
    });
    const byRisk = rows.filter(r => r.acc != null && r.accEU != null).sort((a, b) => b.acc - a.acc).slice(0, 8);
    C.pairs($('#danger'), {
      title: L('Cât de periculoasă e munca', 'How dangerous the work is'),
      sub: L('Accidente mortale la 100.000 de lucrători pe an, media 2021–2024. Cele 8 domenii cu cel mai mare risc în România.', 'Fatal accidents per 100,000 workers a year, 2021–2024 average. The 8 riskiest sectors in Romania.'),
      names: [L('România', 'Romania'), L('Media UE', 'EU average')], dec: 1,
      rows: byRisk.map(r => [r.t, r.acc, r.accEU])
    });
  }

  function renderCharts() { renderLife(); renderDias(); renderGrowth(); renderWork(); }
  renderCharts();
  requestAnimationFrame(moveInk);

  /* ---------- sunet de suspans ---------- */
  const soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', async () => {
    const on = await Suspense.toggle();
    soundBtn.classList.toggle('on', on);
    soundBtn.setAttribute('aria-pressed', on);
    soundBtn.querySelector('.sound-l').textContent = on ? L('Oprește sunetul', 'Turn off sound') : L('Pornește sunetul', 'Turn on sound');
    $('#soundFab').classList.toggle('on', on);
  });
  const fab = document.createElement('button');
  fab.id = 'soundFab'; fab.className = 'sound-fab'; fab.setAttribute('aria-label', L('Oprește sunetul', 'Turn off sound'));
  fab.innerHTML = '<span class="eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>';
  fab.addEventListener('click', () => soundBtn.click());
  document.body.appendChild(fab);
  new IntersectionObserver(es => {
    const inHero = es[0].isIntersecting;
    Suspense.setFocus(inHero);
    fab.classList.toggle('show', !inHero);
  }, { threshold: 0.35 }).observe($('#harta'));

  /* ---------- rail cu capitole ---------- */
  const railLinks = $$('#rail a');
  const railIO = new IntersectionObserver(es => {
    es.forEach(en => {
      if (en.isIntersecting) railLinks.forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('section[id]').forEach(s => railIO.observe(s));
  window.addEventListener('scroll', () => {
    const p = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
    $('#railFill').style.transform = 'scaleY(' + Math.min(1, Math.max(0, p)) + ')';
    $('#rail').classList.toggle('show', window.scrollY > window.innerHeight * 0.5);
  }, { passive: true });

  /* ---------- hartă + panou ---------- */
  const sorted = Object.entries(D.counties).sort((a, b) => b[1].s - a[1].s).map(e => e[0]);
  const maxS = D.counties[sorted[0]].s;
  const panel = $('#panel');

  function openPanel(code) {
    try { history.replaceState(null, '', code ? '#judet-' + code : location.pathname); } catch (e) {}
    document.body.classList.toggle('county-open', !!code);
    if (!code) { panel.classList.remove('open'); return; }
    const d = D.counties[code];
    $('#pRank').textContent = L('Locul ', 'Rank ') + (sorted.indexOf(code) + 1) + L(' din 42 după salariu', ' of 42 by salary');
    $('#pName').textContent = d.n;
    animateNumber($('#pSal'), d.s, 0, 900);
    const g = $('#pGrowth');
    g.textContent = (d.g >= 0 ? '▲ +' : '▼ ') + fmt(d.g, 1) + L('% față de iunie 2024', '% vs. June 2024');
    g.className = 'chip ' + (d.g >= 0 ? 'up' : 'down');
    const diff = (d.s / D.nationalNet2025 - 1) * 100;
    $('#pVsAvg').textContent = (diff >= 0 ? '+' : '') + fmt(diff, 0) + L('% vs. media anuală pe țară', '% vs. national annual average');
    $('#pGauge').style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => { $('#pGauge').style.width = (d.s / maxS * 100) + '%'; }));
    $('#pAvgMark').style.left = (D.nationalNet2025 / maxS * 100) + '%';
    $('#pInd').innerHTML = d.ind.map((x, i) =>
      '<li><span class="ib">' + ICONS(x[0]) + '</span>' + x[1] + '<span class="rk">#' + (i + 1) + '</span></li>').join('');
    panel.classList.add('open');
  }
  $('#panelClose').addEventListener('click', () => map ? map.select(null) : openPanel(null));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && map) map.select(null); });

  function setLegend(m, lo, hi) {
    $('#legMin').textContent = m === 's' ? fmt(lo) + ' lei' : fmt(lo, 1) + '%';
    $('#legMax').textContent = m === 's' ? fmt(hi) + ' lei' : '+' + fmt(hi, 1) + '%';
  }

  try {
    if (!window.THREE) throw new Error(L('three.js nu s-a încărcat', 'three.js failed to load'));
    map = RoMap3D.create($('#map3d'), { tip: $('#mapTip'), onSelect: openPanel });
    $('#mapLoading').remove();
    setLegend('s', map.initialRange[0], map.initialRange[1]);
    const m = location.hash.match(/^#judet-([A-Z]{1,2})$/);
    if (m && D.counties[m[1]]) setTimeout(() => map.select(m[1]), 1200);
  } catch (err) {
    $('#mapLoading').textContent = L('Harta 3D nu a putut fi încărcată (', 'The 3D map could not be loaded (') + err.message + ').';
  }

  $$('.metric-switch button').forEach(b => b.addEventListener('click', () => {
    $$('.metric-switch button').forEach(x => x.classList.toggle('on', x === b));
    if (!map) return;
    const [lo, hi] = map.setMetric(b.dataset.metric);
    setLegend(b.dataset.metric, lo, hi);
  }));
})();
