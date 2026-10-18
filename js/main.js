(function () {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const fmt = (n, dec) => n.toLocaleString('ro-RO', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
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
  const domBox = $('#domains');
  domBox.innerHTML = window.RO_DOMAINS.map((d, i) =>
    '<button class="dom reveal" style="transition-delay:' + (i % 4) * 60 + 'ms" aria-expanded="false">' +
      '<span class="di">' + ICONS(d.icon) + '</span>' +
      '<span class="risk lv' + ({ 'scăzut': 1, mediu: 2, ridicat: 3 })[d.risk] + '" title="Risc de muncă nedeclarată: ' + d.risk + '"><b><i></i><i></i><i></i></b>risc ' + d.risk + '</span>' +
      '<h4>' + d.t + '</h4><p>' + d.d + '</p></button>').join('');
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
        big: fmt(ro, 1) + ' h', lead: 'pe săptămână lucrează în medie un român, la jobul principal.',
        facts: [['Media UE', fmt(d.eu, 1) + ' h'], ['Locul în UE', rankOf(d.rows, 'RO') + ' din ' + d.rows.length], ['Față de Țările de Jos', '+' + fmt(ro - nl, 1) + ' h / săpt.']],
        note: 'Diferența față de un neerlandez înseamnă cam <b>' + fmt(extraWeeks, 0) + ' săptămâni de muncă în plus pe an</b> (la 46 de săptămâni lucrate).',
        rank: { title: 'Ore lucrate pe săptămână, ' + d.year, sub: 'Barele arată cât de departe e fiecare țară de media UE', rows: d.rows, eu: d.eu, dec: 1, unit: ' h', diverge: true },
        trend: { title: 'Cum a evoluat', series: [['RO', 'România', '--acc'], ['EU27_2020', 'Media UE', '--mute', 1], ['NL', 'Țările de Jos', '--s3']], dec: 1, unitShort: ' h' },
        src: 'Eurostat, lfsa_ewhan2: ore efectiv lucrate la locul de muncă principal, persoane de 20–64 de ani.'
      };
    },
    neet: () => {
      const d = X.neet, ro = d.rows.find(r => r[0] === 'RO')[1];
      return {
        big: fmt(ro, 1) + '%', lead: 'dintre tinerii de 15–29 ani nici nu lucrează, nici nu învață. Aproape 1 din 5.',
        facts: [['Media UE', fmt(d.eu, 1) + '%'], ['Locul în UE', rankOf(d.rows, 'RO') + ' din ' + d.rows.length + ' (cel mai rău)'], ['Ținta UE pentru 2030', 'sub 9%']],
        note: 'NEET vine din engleză: <i>Not in Employment, Education or Training</i>. Media UE a scăzut constant din 2015, iar România a revenit după pandemie aproape la nivelul de atunci.',
        rank: { title: 'Tineri NEET (15–29 ani), ' + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
        trend: { title: 'România vs. media UE', series: [['RO', 'România', '--acc'], ['EU27_2020', 'Media UE', '--mute', 1]], dec: 1, unitShort: '%', yMin: 0 },
        src: 'Eurostat, edat_lfse_20: tineri care nu sunt ocupați și nu urmează nicio formă de educație sau formare.'
      };
    },
    iwp: () => {
      const d = X.iwp, ro = d.rows.find(r => r[0] === 'RO')[1];
      return {
        big: fmt(ro, 1) + '%', lead: 'dintre românii care au un loc de muncă trăiesc totuși sub pragul de sărăcie.',
        facts: [['Media UE', fmt(d.eu, 1) + '%'], ['Locul în UE', rankOf(d.rows, 'RO') + ' din ' + d.rows.length], ['În 2015', '18,6%, locul 1 în UE']],
        note: 'Ani la rând, România a avut cea mai mare rată din UE. În 2024 a scăzut brusc, de la 15% la 10,7%. Saltul e neobișnuit de mare pentru un singur an, așa că merită urmărit și în datele următoare.',
        rank: { title: 'Sărăcia în rândul celor care muncesc, ' + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
        trend: { title: 'România vs. media UE', series: [['RO', 'România', '--acc'], ['EU27_2020', 'Media UE', '--mute', 1]], dec: 1, unitShort: '%', yMin: 0 },
        src: 'Eurostat, ilc_iw01: persoane ocupate de 18–64 de ani cu venit sub 60% din venitul median național.'
      };
    }
  };
  LIFE.grad = () => {
    const d = X.grad, ro = d.rows.find(r => r[0] === 'RO')[1], L = d.levels;
    return {
      big: fmt(ro, 1) + '%', lead: 'dintre tinerii cu facultate au un loc de muncă la 1–3 ani după absolvire.',
      facts: [['Media UE', fmt(d.eu, 1) + '%'], ['Locul în UE', rankOf(d.rows, 'RO') + ' din ' + d.rows.length], ['Cu liceu sau școală profesională', fmt(L.RO.ED3_4, 1) + '% (UE: ' + fmt(L.EU.ED3_4, 1) + '%)']],
      note: 'Cu o diplomă de facultate, șansele sunt aproape ca în restul UE. Problema mare e la cei fără facultate: dintre absolvenții de <b>școală profesională</b>, doar ' + fmt(L.RO.ED35_45, 1) + '% lucrează, față de ' + fmt(L.EU.ED35_45, 1) + '% în UE.',
      rank: { title: 'Absolvenți de facultate cu un job (20–34 ani), ' + d.year, rows: d.rows, eu: d.eu, dec: 1, unit: '%' },
      trend: { title: 'România vs. media UE', series: [['RO', 'România', '--acc'], ['EU27_2020', 'Media UE', '--mute', 1]], dec: 1, unitShort: '%' },
      src: 'Eurostat, edat_lfse_24: rata de ocupare a tinerilor de 20–34 de ani care au terminat studiile în ultimii 1–3 ani și nu mai sunt în educație.'
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
    $('#lifeSrc').textContent = 'Sursa: ' + t.src;
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
      '<p class="eu-k">Românii din</p><h3>' + C.name(d.id) + '</h3>' +
      '<div class="eu-big">' + fmt(d.n) + '</div><p class="eu-u">' + (d.note ? d.note : 'cetățeni români, ' + d.y) + '</p>' +
      '<div class="eu-pct"><b>' + fmt(d.pct, 2) + '%</b><span>din populația țării, adică cam 1 din ' + fmt(100 / d.pct, 0) + ' locuitori.</span></div>' +
      (hasSeries ? '<div class="eu-mini" id="euMini"></div>' : '<p class="eu-u">Nu există o serie comparabilă în timp pentru această țară.</p>');
    if (hasSeries) {
      C.line($('#euMini'), {
        title: 'Evoluție ' + yrs[0] + '–' + yrs[yrs.length - 1], w: 300, h: 150, axisW: 34, dec: 0, legend: false, labels: false,
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
      title: 'Unde au crescut comunitățile', sub: 'Cetățeni români rezidenți, primele 4 destinații cu serie completă', dec: 0, yMin: 0, axisW: 46,
      fmtLab: v => v >= 1e6 ? fmt(v / 1e6, 2) + ' mil.' : fmt(v / 1000, 0) + 'k',
      fmtTick: v => v >= 1e6 ? fmt(v / 1e6, 1) + ' mil.' : fmt(v / 1000, 0) + 'k',
      series: top.map((d, i) => ({ name: C.name(d.id), color: col('--s' + (i + 1)), data: d.ser }))
    });
    C.rank($('#diasRank'), {
      title: 'Cei mai mulți români', sub: 'Număr de persoane, cel mai recent an disponibil', highlight: null,
      rows: DIAS.slice(0, 12).map(d => [d.id, d.n]),
      fmtv: v => v >= 1e6 ? fmt(v / 1e6, 2) + ' mil.' : fmt(v / 1000, 0) + 'k',
      tipv: r => fmt(r[1]) + ' români'
    });
  }

  /* ---------- ce industrii au crescut ---------- */
  let growthP = 'p1';
  function renderGrowth() {
    const p = X.sect[growthP];
    C.rank($('#growth'), {
      title: '', rows: p.rows, eu: 0, diverge: true, centerLabel: '0%', highlight: null, wideLabels: true, cls: 'growth-bars',
      labels: r => r[0], fmtv: v => { const r = Math.round(v); return (r > 0 ? '+' : r < 0 ? '−' : '') + fmt(Math.abs(r), 0) + '%'; },
      tipv: r => (r[1] > 0 ? '+' : '') + fmt(r[1], 1) + '% (' + fmt(r[2]) + ' → ' + fmt(r[3]) + ' mii de oameni, ' + p.from + '–' + p.to + ')'
    });
  }
  $$('#growthSeg button').forEach(b => b.addEventListener('click', () => {
    $$('#growthSeg button').forEach(x => x.classList.toggle('on', x === b));
    growthP = b.dataset.p; renderGrowth();
  }));

  function renderCharts() { renderLife(); renderDias(); renderGrowth(); }
  renderCharts();
  requestAnimationFrame(moveInk);

  /* ---------- sunet de suspans ---------- */
  const soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', async () => {
    const on = await Suspense.toggle();
    soundBtn.classList.toggle('on', on);
    soundBtn.setAttribute('aria-pressed', on);
    soundBtn.querySelector('.sound-l').textContent = on ? 'Oprește sunetul' : 'Pornește sunetul';
    $('#soundFab').classList.toggle('on', on);
  });
  const fab = document.createElement('button');
  fab.id = 'soundFab'; fab.className = 'sound-fab'; fab.setAttribute('aria-label', 'Oprește sunetul');
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
    $('#pRank').textContent = 'Locul ' + (sorted.indexOf(code) + 1) + ' din 42 după salariu';
    $('#pName').textContent = d.n;
    animateNumber($('#pSal'), d.s, 0, 900);
    const g = $('#pGrowth');
    g.textContent = (d.g >= 0 ? '▲ +' : '▼ ') + fmt(d.g, 1) + '% față de iunie 2024';
    g.className = 'chip ' + (d.g >= 0 ? 'up' : 'down');
    const diff = (d.s / D.nationalNet2025 - 1) * 100;
    $('#pVsAvg').textContent = (diff >= 0 ? '+' : '') + fmt(diff, 0) + '% vs. media anuală pe țară';
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
    if (!window.THREE) throw new Error('three.js nu s-a încărcat');
    map = RoMap3D.create($('#map3d'), { tip: $('#mapTip'), onSelect: openPanel });
    $('#mapLoading').remove();
    setLegend('s', map.initialRange[0], map.initialRange[1]);
    const m = location.hash.match(/^#judet-([A-Z]{1,2})$/);
    if (m && D.counties[m[1]]) setTimeout(() => map.select(m[1]), 1200);
  } catch (err) {
    $('#mapLoading').textContent = 'Harta 3D nu a putut fi încărcată (' + err.message + ').';
  }

  $$('.metric-switch button').forEach(b => b.addEventListener('click', () => {
    $$('.metric-switch button').forEach(x => x.classList.toggle('on', x === b));
    if (!map) return;
    const [lo, hi] = map.setMetric(b.dataset.metric);
    setLegend(b.dataset.metric, lo, hi);
  }));
})();
