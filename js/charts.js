/* Grafice SVG fără biblioteci: clasament, linie în timp, harta Europei */
window.Charts = (function () {
  const NS = 'http://www.w3.org/2000/svg';
  const fmt = (n, dec) => n.toLocaleString('ro-RO', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 });
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const NAMES = {};
  (window.EU_GEO ? EU_GEO.c : []).forEach(c => { NAMES[c.id] = c.n; });
  NAMES.EU27_2020 = 'Media UE';
  const name = id => NAMES[id] || id;

  /* ---------- tooltip comun ---------- */
  const tip = document.createElement('div');
  tip.className = 'ch-tip';
  document.body.appendChild(tip);
  function showTip(html, x, y) {
    tip.innerHTML = html;
    tip.classList.add('show');
    const r = tip.getBoundingClientRect();
    const left = Math.min(window.innerWidth - r.width - 12, Math.max(12, x - r.width / 2));
    const top = y - r.height - 14 < 8 ? y + 18 : y - r.height - 14;
    tip.style.transform = 'translate(' + left + 'px,' + top + 'px)';
  }
  function hideTip() { tip.classList.remove('show'); }

  function el(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  /* ---------- clasament orizontal ---------- */
  function rank(box, o) {
    const rows = o.rows, max = o.max || Math.max(...rows.map(r => r[1])) * 1.05;
    const hl = o.highlight || 'RO';
    const div = o.diverge && o.eu != null;
    const maxd = div ? Math.max(...rows.map(r => Math.abs(r[1] - o.eu))) * 1.05 : 0;
    let h = (o.title ? '<div class="ch-head"><h4>' + o.title + '</h4>' + (o.sub ? '<p>' + o.sub + '</p>' : '') + '</div>' : '') +
      '<div class="rank' + (div ? ' div' : '') + (o.highlight === null ? ' all' : '') + (o.wideLabels ? ' wide' : '') + (o.cls ? ' ' + o.cls : '') + '">';
    rows.forEach((r, i) => {
      let bar;
      if (div) {
        const d = (r[1] - o.eu) / maxd * 50;
        bar = '<i class="' + (d < 0 ? 'neg' : 'pos') + '" style="--l:' + (d < 0 ? 50 + d : 50).toFixed(2) + '%;--w:' + Math.abs(d).toFixed(2) + '%"></i>';
      } else {
        bar = '<i style="--w:' + ((r[1] / max) * 100).toFixed(2) + '%"></i>';
      }
      h += '<div class="rk-row' + (r[0] === hl ? ' hl' : '') + '" data-i="' + i + '">' +
        '<span class="rk-n">' + (o.labels ? o.labels(r) : name(r[0])) + '</span>' +
        '<span class="rk-bar">' + bar + '</span>' +
        '<span class="rk-v">' + (o.fmtv ? o.fmtv(r[1]) : fmt(r[1], o.dec)) + '</span></div>';
    });
    if (o.eu != null) h += '<span class="rk-eu" style="--xr:' + (div ? 0.5 : o.eu / max).toFixed(4) + '"><b>' + (o.centerLabel || 'media UE ' + fmt(o.eu, o.dec) + (o.unit || '')) + '</b></span>';
    h += '</div>';
    box.innerHTML = h;
    box.querySelectorAll('.rk-row').forEach(row => {
      const r = rows[+row.dataset.i];
      const diff = div && !o.centerLabel ? ' (' + (r[1] >= o.eu ? '+' : '−') + fmt(Math.abs(r[1] - o.eu), o.dec) + ' față de UE)' : '';
      row.addEventListener('pointermove', e => showTip('<b>' + (o.labels ? o.labels(r) : name(r[0])) + '</b> ' + (o.tipv ? o.tipv(r) : fmt(r[1], o.dec) + (o.unit || '')) + diff + '<br><small>locul ' + (+row.dataset.i + 1) + ' din ' + rows.length + '</small>', e.clientX, e.clientY));
      row.addEventListener('pointerleave', hideTip);
    });
    // linia de referință se aliniază la coloana barelor, indiferent de lățimea etichetelor
    const ref = box.querySelector('.rk-eu'), bar0 = box.querySelector('.rk-bar');
    if (ref && bar0) {
      const xr = parseFloat(ref.style.getPropertyValue('--xr'));
      const place = () => { ref.style.left = (bar0.offsetLeft + bar0.offsetWidth * xr) + 'px'; };
      place();
      if (box._ro) box._ro.disconnect();
      box._ro = new ResizeObserver(place); box._ro.observe(bar0);
    }
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('drawn')));
  }

  /* ---------- linie în timp (o singură axă) ---------- */
  function line(box, o) {
    const W = o.w || 560, H = o.h || 260, m = { t: 16, r: o.labels === false ? 14 : 118, b: 28, l: o.axisW || 40 };
    const years = Array.from(new Set(o.series.flatMap(s => Object.keys(s.data)))).sort();
    const vals = o.series.flatMap(s => Object.values(s.data));
    let lo = o.yMin != null ? o.yMin : Math.min(...vals), hi = Math.max(...vals);
    const pad = (hi - lo) * 0.12 || 1; if (o.yMin == null) lo -= pad; hi += pad;
    const x = y => m.l + (years.indexOf(y) / (years.length - 1)) * (W - m.l - m.r);
    const yy = v => m.t + (1 - (v - lo) / (hi - lo)) * (H - m.t - m.b);
    box.innerHTML = '<div class="ch-head"><h4>' + o.title + '</h4>' + (o.sub ? '<p>' + o.sub + '</p>' : '') + '</div>';
    if (o.series.length > 1 && o.legend !== false) {
      box.insertAdjacentHTML('beforeend', '<div class="ch-legend">' + o.series.map(s => '<span><i style="background:' + s.color + '"></i>' + s.name + '</span>').join('') + '</div>');
    }
    const svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'ch-svg', role: 'img', 'aria-label': o.title }, box);
    // grilă recesivă
    const ticks = niceTicks(lo, hi, 4);
    ticks.forEach(t => {
      el('line', { x1: m.l, x2: W - m.r, y1: yy(t), y2: yy(t), class: 'ch-grid' }, svg);
      el('text', { x: m.l - 8, y: yy(t) + 4, class: 'ch-ax', 'text-anchor': 'end' }, svg).textContent = o.fmtTick ? o.fmtTick(t) : fmt(t, o.tickDec || 0);
    });
    const step = Math.ceil(years.length / 6);
    years.forEach((y, i) => {
      if (i % step && i !== years.length - 1) return;
      el('text', { x: x(y), y: H - 6, class: 'ch-ax', 'text-anchor': 'middle' }, svg).textContent = y;
    });
    // linii + etichete directe
    const ends = [];
    o.series.forEach((s, si) => {
      const pts = years.filter(y => s.data[y] != null).map(y => [x(y), yy(s.data[y])]);
      const p = el('path', { d: 'M' + pts.map(q => q.join(',')).join('L'), class: 'ch-line' + (s.muted ? ' muted' : ''), stroke: s.color }, svg);
      const len = p.getTotalLength ? p.getTotalLength() : 1000;
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.style.transitionDelay = (si * 0.15) + 's';
      const last = pts[pts.length - 1];
      el('circle', { cx: last[0], cy: last[1], r: 4, fill: s.color, class: 'ch-end' }, svg);
      ends.push({ y: last[1], s, v: s.data[years.filter(y => s.data[y] != null).pop()] });
    });
    // evită suprapunerea etichetelor directe
    ends.sort((a, b) => a.y - b.y);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 15) ends[i].y = ends[i - 1].y + 15;
    if (o.labels !== false) ends.forEach(e => {
      const t = el('text', { x: W - m.r + 10, y: e.y + 4, class: 'ch-lab' }, svg);
      t.textContent = e.s.name + ' ' + (o.fmtLab ? o.fmtLab(e.v) : fmt(e.v, o.dec) + (o.unitShort || ''));
    });
    // strat de hover: crosshair + tooltip
    const cross = el('line', { y1: m.t, y2: H - m.b, class: 'ch-cross' }, svg);
    const hit = el('rect', { x: m.l, y: m.t, width: W - m.l - m.r, height: H - m.t - m.b, fill: 'transparent' }, svg);
    hit.addEventListener('pointermove', e => {
      const r = svg.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width * W;
      const i = Math.max(0, Math.min(years.length - 1, Math.round((px - m.l) / (W - m.l - m.r) * (years.length - 1))));
      const y = years[i];
      cross.setAttribute('x1', x(y)); cross.setAttribute('x2', x(y)); cross.classList.add('on');
      const rows = o.series.filter(s => s.data[y] != null).sort((a, b) => b.data[y] - a.data[y])
        .map(s => '<span class="tt-row"><i style="background:' + s.color + '"></i>' + s.name + '<b>' + fmt(s.data[y], o.dec) + (o.unitShort || '') + '</b></span>').join('');
      showTip('<b>' + y + '</b>' + rows, e.clientX, e.clientY);
    });
    hit.addEventListener('pointerleave', () => { cross.classList.remove('on'); hideTip(); });
    requestAnimationFrame(() => requestAnimationFrame(() => box.classList.add('drawn')));
  }

  function niceTicks(lo, hi, n) {
    const raw = (hi - lo) / n, mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const step = [1, 2, 2.5, 5, 10].map(k => k * mag).find(s => s >= raw);
    const out = [];
    for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(+t.toFixed(6));
    return out;
  }

  /* ---------- harta Europei ---------- */
  function euMap(box, data, onSelect) {
    const G = window.EU_GEO, byId = {};
    data.forEach(d => { byId[d.id] = d; });
    // praguri pentru scala secvențială (procent din populație)
    const BINS = [0.1, 0.3, 0.6, 1.0, 1.5];
    const bin = p => BINS.filter(b => p >= b).length; // 0..5
    const svg = el('svg', { viewBox: '0 0 ' + G.w + ' ' + G.h, class: 'eu-svg', role: 'img', 'aria-label': 'Harta Europei: românii ca procent din populația fiecărei țări' });
    box.insertBefore(svg, box.firstChild);
    const gC = el('g', {}, svg), gA = el('g', { class: 'eu-arcs' }, svg), gL = el('g', { class: 'eu-labels' }, svg);
    const ro = G.c.find(c => c.id === 'RO');
    const paths = {};
    G.c.forEach(c => {
      const d = byId[c.id];
      const cls = c.id === 'RO' ? 'eu-c ro' : d ? 'eu-c s' + bin(d.pct) : 'eu-c none';
      const p = el('path', { d: c.d, class: cls }, gC);
      paths[c.id] = p;
      if (d || c.id === 'RO') {
        p.addEventListener('pointermove', e => {
          const html = c.id === 'RO'
            ? '<b>România</b><br><small>punctul de plecare</small>'
            : '<b>' + c.n + '</b> ' + fmt(d.n) + ' români<br><small>' + fmt(d.pct, 2) + '% din populație · ' + d.y + '</small>';
          showTip(html, e.clientX, e.clientY);
        });
        p.addEventListener('pointerleave', hideTip);
        if (d) p.addEventListener('click', () => select(c.id));
      }
    });
    // arce din România către fiecare destinație
    const maxN = Math.max(...data.map(d => d.n));
    const arcs = {};
    data.slice().sort((a, b) => a.n - b.n).forEach((d, i) => {
      const c = G.c.find(q => q.id === d.id);
      if (!c) return;
      const x1 = ro.lx, y1 = ro.ly, x2 = c.lx, y2 = c.ly;
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dist = Math.hypot(x2 - x1, y2 - y1);
      const cx = mx, cy = my - dist * 0.35;
      const a = el('path', { d: 'M' + x1 + ',' + y1 + 'Q' + cx + ',' + cy + ' ' + x2 + ',' + y2, class: 'eu-arc', 'stroke-width': (0.8 + Math.sqrt(d.n / maxN) * 6).toFixed(2) }, gA);
      const len = a.getTotalLength();
      a.style.strokeDasharray = len; a.style.strokeDashoffset = len;
      a.style.transitionDelay = (0.3 + (data.length - i) * 0.05) + 's';
      arcs[d.id] = a;
      el('circle', { cx: x2, cy: y2, r: (1.5 + Math.sqrt(d.n / maxN) * 4).toFixed(1), class: 'eu-dot' }, gA);
    });
    el('circle', { cx: ro.lx, cy: ro.ly, r: 6, class: 'eu-ro-dot' }, gA);
    // etichete doar pentru destinațiile mari
    data.filter(d => d.n > 100000).forEach(d => {
      const c = G.c.find(q => q.id === d.id); if (!c) return;
      const t = el('text', { x: c.lx, y: c.ly - 10, class: 'eu-lab', 'text-anchor': 'middle' }, gL);
      t.textContent = c.n;
    });
    // legendă
    const leg = box.querySelector('.eu-legend');
    if (leg) {
      const labs = ['< 0,1%', '0,1–0,3%', '0,3–0,6%', '0,6–1%', '1–1,5%', '> 1,5%'];
      leg.innerHTML = '<span class="eu-leg-t">% din populație</span>' + labs.map((l, i) => '<span><i class="s' + i + '"></i>' + l + '</span>').join('') +
        '<span><i class="none"></i>fără date</span>';
    }
    let cur = null;
    function select(id) {
      if (cur) { paths[cur].classList.remove('sel'); arcs[cur] && arcs[cur].classList.remove('sel'); }
      cur = id;
      paths[id].classList.add('sel'); arcs[id] && arcs[id].classList.add('sel');
      gA.classList.add('has-sel');
      onSelect && onSelect(byId[id]);
    }
    return { select, draw: () => box.classList.add('drawn') };
  }

  return { rank, line, euMap, fmt, name, css };
})();
