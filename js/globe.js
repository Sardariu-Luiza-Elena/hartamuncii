/*
  Glob 3D cu românii din toată lumea (persoane născute în România, ONU 2024).
  Se încarcă doar când secțiunea se apropie de ecran: d3 (proiecția ortografică) + js/world.js (contururi și date).
  Se rotește trăgând cu mouse-ul sau cu degetul; un clic pe o țară arată detaliile.
*/
window.Globe = (function () {
  const D3_URL = 'https://cdnjs.cloudflare.com/ajax/libs/d3/7.9.0/d3.min.js';
  const RO = [24.97, 45.94];
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  function load(src) {
    return new Promise((res, rej) => {
      const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s);
    });
  }

  function start(opts) {
    const host = document.getElementById(opts.stage);
    if (!host) return;
    let started = false;
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting || started) return;
      started = true; io.disconnect();
      Promise.all([window.d3 ? 0 : load(D3_URL), window.WORLD ? 0 : load('js/world.js')])
        .then(() => build(host, opts))
        .catch(() => { host.innerHTML = '<p class="globe-err">' + L('Globul nu a putut fi încărcat.', 'The globe could not be loaded.') + '</p>'; });
    }, { rootMargin: '600px 0px' });
    io.observe(host);
  }

  function build(host, opts) {
    const W = window.WORLD, d3 = window.d3, fmt = opts.fmt;
    const yearIdx = { };
    W.years.forEach((y, i) => { yearIdx[y] = i; });
    let year = 2024;
    const name = c => (window.LANG === 'en' ? c.en : (W.namesRo[c.id] || c.en));
    const val = id => { const v = W.ro[id]; return v ? v[yearIdx[year]] : 0; };

    const feats = W.c.map(c => ({ type: 'Feature', id: c.id, c, geometry: { type: 'MultiPolygon', coordinates: c.p } }));
    const canvas = document.createElement('canvas');
    canvas.className = 'globe-canvas';
    canvas.setAttribute('role', 'img');
    canvas.setAttribute('aria-label', L('Glob cu numărul de persoane născute în România care trăiesc în fiecare țară', 'Globe showing how many people born in Romania live in each country'));
    host.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const proj = d3.geoOrthographic().clipAngle(90).precision(0.6);
    const path = d3.geoPath(proj, ctx);
    const sphere = { type: 'Sphere' }, grat = d3.geoGraticule10();
    let size = 0, dpr = 1, rot = [-20, -38, 0], scale0 = 1, zoom = 1;

    // culori citite din temă
    let C = {};
    function colors() {
      C = { ocean: css('--bg2'), land: css('--q-none'), line: css('--line'), ink: css('--ink'), hot: css('--hot'),
            q: [css('--q0'), css('--q1'), css('--q2'), css('--q3'), css('--q4'), css('--q5')], grid: css('--grid'), acc: css('--acc') };
    }
    colors();
    new MutationObserver(() => { colors(); draw(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // scală logaritmică: de la câteva sute de oameni la aproape un milion
    const BINS = [1000, 10000, 50000, 150000, 500000];
    const bin = v => BINS.filter(b => v >= b).length;

    function resize() {
      const r = host.getBoundingClientRect();
      size = Math.min(r.width, 560); dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = size * dpr; canvas.height = size * dpr;
      canvas.style.width = size + 'px'; canvas.style.height = size + 'px';
      scale0 = size / 2 - 6;
      draw();
    }

    let hover = null, sel = null;
    function draw() {
      if (!size) return;
      proj.translate([size / 2, size / 2]).scale(scale0 * zoom).rotate(rot);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      ctx.beginPath(); path(sphere); ctx.fillStyle = C.ocean; ctx.fill();
      ctx.beginPath(); path(grat); ctx.strokeStyle = C.grid; ctx.lineWidth = 0.6; ctx.stroke();
      feats.forEach(f => {
        const v = val(f.id);
        ctx.beginPath(); path(f);
        ctx.fillStyle = f.id === 642 ? C.hot : v > 0 ? C.q[bin(v)] : C.land;
        ctx.fill();
      });
      ctx.beginPath(); feats.forEach(f => path(f)); ctx.strokeStyle = C.ocean; ctx.lineWidth = 0.5; ctx.stroke();
      // arce de la România spre fiecare țară (cercuri mari, tăiate la orizont)
      const maxV = Math.max(...feats.map(f => val(f.id)));
      feats.forEach(f => {
        const v = val(f.id); if (!v || f.id === 642) return;
        ctx.beginPath(); path({ type: 'LineString', coordinates: [RO, [f.c.lx, f.c.ly]] });
        const on = !sel || sel === f;
        ctx.strokeStyle = C.hot; ctx.globalAlpha = on ? (sel ? 0.95 : 0.45) : 0.12;
        ctx.lineWidth = 0.6 + Math.sqrt(v / maxV) * 3.2; ctx.stroke();
      });
      ctx.globalAlpha = 1;
      [sel, hover].forEach((f, i) => {
        if (!f) return;
        ctx.beginPath(); path(f); ctx.strokeStyle = C.ink; ctx.lineWidth = i ? 1 : 1.8; ctx.stroke();
      });
      ctx.beginPath(); path(sphere); ctx.strokeStyle = C.line; ctx.lineWidth = 1; ctx.stroke();
    }

    function featAt(e) {
      const r = canvas.getBoundingClientRect();
      const ll = proj.invert([e.clientX - r.left, e.clientY - r.top]);
      if (!ll || isNaN(ll[0])) return null;
      // doar emisfera vizibilă
      if (d3.geoDistance(ll, [-rot[0], -rot[1]]) > Math.PI / 2) return null;
      return feats.find(f => d3.geoContains(f, ll)) || null;
    }

    // tragere cu inerție
    let drag = null, vel = [0, 0], spin = true, raf = 0;
    function loop() {
      raf = 0;
      if (!drag) {
        if (spin) { rot[0] += 0.08; }
        else if (Math.abs(vel[0]) + Math.abs(vel[1]) > 0.01) {
          rot[0] += vel[0]; rot[1] = Math.max(-80, Math.min(80, rot[1] + vel[1])); vel = [vel[0] * 0.93, vel[1] * 0.93];
        } else { draw(); return; }
      }
      draw();
      if (visible) raf = requestAnimationFrame(loop);
    }
    const kick = () => { if (!raf && visible) raf = requestAnimationFrame(loop); };
    let visible = false;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; if (visible) kick(); }).observe(canvas);

    canvas.addEventListener('pointerdown', e => {
      drag = { x: e.clientX, y: e.clientY, moved: 0 }; spin = false; vel = [0, 0];
      canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging'); kick();
    });
    canvas.addEventListener('pointermove', e => {
      if (drag) {
        const k = 0.25 / zoom, dx = (e.clientX - drag.x) * k, dy = (e.clientY - drag.y) * k;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        rot[0] += dx; rot[1] = Math.max(-80, Math.min(80, rot[1] - dy));
        vel = [dx, -dy]; drag.x = e.clientX; drag.y = e.clientY;
        opts.hideTip(); return;
      }
      const f = featAt(e);
      if (f !== hover) { hover = f; draw(); }
      if (f) {
        const v = val(f.id);
        opts.showTip('<b>' + name(f.c) + '</b> ' + (f.id === 642 ? '' : v ? fmt(v) + L(' născuți în România', ' born in Romania') : L('fără date', 'no data')) +
          (f.id === 642 ? '<br><small>' + L('punctul de plecare', 'where they come from') + '</small>' : '<br><small>' + year + '</small>'), e.clientX, e.clientY);
      } else opts.hideTip();
    });
    canvas.addEventListener('pointerup', e => {
      canvas.classList.remove('dragging');
      const wasClick = drag && drag.moved < 3;
      drag = null; kick();
      if (wasClick) { const f = featAt(e); if (f && f.id !== 642 && val(f.id)) select(f); }
    });
    canvas.addEventListener('pointerleave', () => { if (hover) { hover = null; draw(); } opts.hideTip(); });
    canvas.addEventListener('wheel', e => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault(); zoom = Math.max(1, Math.min(4, zoom * (1 - e.deltaY * 0.0015))); draw();
    }, { passive: false });

    function select(f) {
      sel = f; spin = false;
      if (f) {
        // rotește globul lin până țara ajunge în centru
        const from = rot.slice(), to = [-f.c.lx, -f.c.ly, 0], t0 = performance.now();
        const ip = d3.interpolate(from, to);
        (function step(now) {
          const t = Math.min(1, (now - t0) / 900), e = 1 - Math.pow(1 - t, 3);
          rot = ip(e); draw(); if (t < 1) requestAnimationFrame(step);
        })(t0);
      } else draw();
      opts.onSelect(f ? { name: name(f.c), id: f.id, series: W.ro[f.id], years: W.years } : null, year);
    }

    function setYear(y) {
      year = y; draw();
      opts.onSelect(sel ? { name: name(sel.c), id: sel.id, series: W.ro[sel.id], years: W.years } : null, year);
    }

    // clasamentul țărilor din afara UE, pentru panoul lateral
    const EU = new Set([40, 56, 100, 191, 196, 203, 208, 233, 246, 250, 276, 300, 348, 372, 380, 428, 440, 442, 470, 528, 616, 620, 642, 703, 705, 724, 752]);
    function topOutside(y) {
      const i = yearIdx[y];
      return Object.entries(W.ro).filter(([id]) => !EU.has(+id)).map(([id, v]) => ({ id: +id, v: v[i] }))
        .filter(r => r.v > 0).sort((a, b) => b.v - a.v).slice(0, 8)
        .map(r => ({ id: r.id, v: r.v, name: window.LANG === 'en' ? (W.c.find(c => c.id === r.id) || {}).en || W.namesRo[r.id] : W.namesRo[r.id] }));
    }
    function selectById(id) { const f = feats.find(x => x.id === id); if (f) select(f); }

    window.addEventListener('resize', resize);
    resize();
    opts.onReady({ W, setYear, select: () => select(null), selectById, topOutside, bins: BINS });
  }

  return { start };
})();
