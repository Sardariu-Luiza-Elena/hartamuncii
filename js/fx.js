/*
  Efecte vizuale:
  1. Cardurile intră în pagină din direcții diferite (direcția e calculată după poziția fiecăruia).
  2. Liniile topografice din fundal se deformează ca un lichid în jurul cursorului.
  3. Trei avioane de hârtie zboară spre harta Europei pe măsură ce derulezi și se opresc când o ating.
*/
window.FX = (function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

  /* ---------- 1. direcțiile de zbor pentru elementele .reveal ---------- */
  function assignFly() {
    document.querySelectorAll('.reveal').forEach(el => {
      const p = el.parentElement.getBoundingClientRect(), r = el.getBoundingClientRect();
      if (!p.width) return;
      const cx = (r.left + r.width / 2 - p.left) / p.width;
      const narrow = window.innerWidth < 720;
      let fx = 0, fy = 110, fr = 0, fs = 0.92, fb = 0;
      if (el.classList.contains('sec-head')) { fx = narrow ? -40 : -140; fy = 30; fb = 10; fs = 1; }
      else if (r.width > p.width * 0.8) { fy = 150; fs = 0.9; }
      else if (cx < 0.4) { fx = narrow ? -60 : -200; fy = 70; fr = -7; }
      else if (cx > 0.6) { fx = narrow ? 60 : 200; fy = 70; fr = 7; }
      else { fy = 220; fs = 0.82; }
      const st = el.style;
      st.setProperty('--fx', fx + 'px'); st.setProperty('--fy', fy + 'px');
      st.setProperty('--fr', fr + 'deg'); st.setProperty('--fs', fs); st.setProperty('--fb', fb + 'px');
    });
  }

  /* ---------- 2. fundal lichid ---------- */
  function hexA(hex, a) {
    const h = hex.replace('#', ''), n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')';
  }
  function liquid() {
    const old = document.querySelector('.bg-art .topo');
    if (!old) return;
    const cv = document.createElement('canvas');
    cv.className = 'topo-cv';
    old.replaceWith(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, rings = [];
    let color = css('--topo'), glow = css('--acc');
    new MutationObserver(() => { color = css('--topo'); glow = css('--acc'); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      rings = []; frame.drawn = false;
      const fam = [{ x: 0.78, y: 0.28, step: 46, ax: 1, ay: 0.75 }, { x: 0.12, y: 0.85, step: 58, ax: 1, ay: 1.2 }];
      const diag = Math.hypot(W, H);
      fam.forEach(f => {
        const cx = f.x * W, cy = f.y * H;
        for (let k = 1; k * f.step < diag * 1.1; k++) {
          const r = k * f.step, n = Math.max(32, Math.min(260, Math.round(r * 0.45)));
          const pts = [];
          for (let i = 0; i < n; i++) {
            const a = i / n * Math.PI * 2;
            pts.push({ x: cx + Math.cos(a) * r * f.ax, y: cy + Math.sin(a) * r * f.ay, a });
          }
          rings.push({ pts, k });
        }
      });
    }
    build();
    window.addEventListener('resize', build);

    // cursorul „real” și cel „lichid”, care îl urmează cu întârziere
    let tx = -9999, ty = -9999, mx = -9999, my = -9999, vx = 0, vy = 0, lastMove = 0, energy = 0;
    window.addEventListener('pointermove', e => {
      if (mx < -9000) { mx = e.clientX; my = e.clientY; }
      tx = e.clientX; ty = e.clientY; lastMove = performance.now();
    }, { passive: true });

    const SIG = 170, S2 = 2 * SIG * SIG;
    function frame(t) {
      requestAnimationFrame(frame);
      if (document.hidden) return;
      const active = t - lastMove < 2500;
      energy += ((active ? 1 : 0) - energy) * 0.04;
      if (energy < 0.01 && frame.drawn) return; // liniștit: nu mai redesenăm
      const nx = mx + (tx - mx) * 0.12, ny = my + (ty - my) * 0.12;
      vx += ((nx - mx) - vx) * 0.25; vy += ((ny - my) - vy) * 0.25;
      mx = nx; my = ny;
      const time = t * 0.0012;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // liniile se colorează ușor în jurul cursorului, ca o pată de lumină în lichid
      if (energy > 0.02) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 280);
        g.addColorStop(0, hexA(glow, 0.55 * energy)); g.addColorStop(1, color);
        ctx.strokeStyle = g;
      } else ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      for (const ring of rings) {
        ctx.beginPath();
        let started = false;
        for (let i = 0; i <= ring.pts.length; i++) {
          const p = ring.pts[i % ring.pts.length];
          const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
          let x = p.x, y = p.y;
          if (d2 < S2 * 4.5 && energy > 0.01) {
            const f = Math.exp(-d2 / S2) * energy, d = Math.sqrt(d2) || 1;
            const wob = Math.sin(time * 2 + p.a * 5 + ring.k * 0.7) * 6 * f;
            x += dx / d * (62 * f + wob) + Math.max(-60, Math.min(60, vx * 3.2)) * f;
            y += dy / d * (62 * f + wob) + Math.max(-60, Math.min(60, vy * 3.2)) * f;
          }
          if (x < -80 || x > W + 80 || y < -80 || y > H + 80) { started = false; continue; }
          if (!started) { ctx.moveTo(x, y); started = true; } else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      frame.drawn = true;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 3. avioane de hârtie spre harta Europei ---------- */
  function planes() {
    const sec = document.getElementById('diaspora'), map = document.getElementById('euMap');
    if (!sec || !map || !window.EU_GEO) return;
    const box = document.createElement('div');
    box.className = 'planes'; box.setAttribute('aria-hidden', 'true');
    const NS = 'http://www.w3.org/2000/svg';
    const trails = document.createElementNS(NS, 'svg'); trails.setAttribute('class', 'plane-trails');
    box.appendChild(trails);
    sec.appendChild(box);

    const PLANE = '<svg viewBox="0 0 100 60"><path class="w1" d="M2 30 98 4 40 38Z"/><path class="w2" d="M40 38 98 4 54 58Z"/><path class="w3" d="M40 38 54 58 45 44Z"/></svg>';
    // trei avioane, trei destinații: cele mai mari comunități de români
    const P = [
      { to: 'IT', size: 96, delay: 0.00, from: (W, e, vh) => [-0.14 * W, e[1] - 0.42 * vh] },
      { to: 'DE', size: 68, delay: 0.10, from: (W, e, vh) => [1.12 * W, e[1] - 0.28 * vh] },
      { to: 'ES', size: 48, delay: 0.20, from: (W, e, vh) => [-0.12 * W, e[1] + 0.05 * vh] }
    ].map(p => {
      const el = document.createElement('div'); el.className = 'plane'; el.innerHTML = PLANE;
      const ring = document.createElement('span'); ring.className = 'plane-hit';
      const path = document.createElementNS(NS, 'path'); path.setAttribute('class', 'plane-trail');
      trails.appendChild(path); box.appendChild(ring); box.appendChild(el);
      return Object.assign(p, { el, ring, path, landed: false });
    });

    const ease = t => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    function target(id, sr) {
      const svg = map.querySelector('.eu-svg'), c = EU_GEO.c.find(q => q.id === id);
      if (!svg || !c) return null;
      const r = svg.getBoundingClientRect();
      return [r.left - sr.left + c.lx / EU_GEO.w * r.width, r.top - sr.top + c.ly / EU_GEO.h * r.height];
    }

    function update() {
      const sr = sec.getBoundingClientRect(), mr = map.getBoundingClientRect(), vh = window.innerHeight;
      const W = sr.width, mt = mr.top - sr.top, mh = mr.height;
      trails.setAttribute('viewBox', '0 0 ' + W + ' ' + sr.height);
      trails.setAttribute('width', W); trails.setAttribute('height', sr.height);
      const scale = clamp(W / 1000, 0.55, 1);
      // progresul zborului e legat de scroll: 0 = harta abia apare jos, 1 = harta e în mijlocul ecranului
      const prog = reduce ? 1 : clamp((vh * 0.95 - mr.top) / (vh * 0.6), 0, 1);
      P.forEach(p => {
        const end = target(p.to, sr); if (!end) return;
        const start = p.from(W, end, vh);
        const dist = Math.hypot(end[0] - start[0], end[1] - start[1]);
        const ctrl = [start[0] + (end[0] - start[0]) * 0.5, Math.min(start[1], end[1]) - dist * 0.12];
        const raw = clamp((prog - p.delay) / (1 - 0.2), 0, 1), t = ease(raw);
        const u = 1 - t;
        const x = u * u * start[0] + 2 * u * t * ctrl[0] + t * t * end[0];
        const y = u * u * start[1] + 2 * u * t * ctrl[1] + t * t * end[1];
        const tt = Math.min(t, 0.985);
        const dx = 2 * (1 - tt) * (ctrl[0] - start[0]) + 2 * tt * (end[0] - ctrl[0]);
        const dy = 2 * (1 - tt) * (ctrl[1] - start[1]) + 2 * tt * (end[1] - ctrl[1]);
        const ang = Math.atan2(dy, dx) * 180 / Math.PI;
        const s = p.size * scale, bob = raw < 1 ? Math.sin(raw * Math.PI * 3) * 6 * scale : 0;
        // avionul are vârful în partea dreaptă; punctul de contact e vârful, nu centrul
        const nose = s / 2;
        const rad = Math.atan2(dy, dx);
        const px = x - Math.cos(rad) * nose, py = y - Math.sin(rad) * nose + bob;
        p.el.style.width = s + 'px'; p.el.style.height = s * 0.6 + 'px';
        p.el.style.transform = 'translate(' + (px - s / 2) + 'px,' + (py - s * 0.3) + 'px) rotate(' + ang + 'deg)';
        p.el.style.opacity = raw > 0 ? 1 : 0;
        // dâra din spatele avionului
        p.path.setAttribute('d', 'M' + start[0] + ',' + start[1] + ' Q' + ctrl[0] + ',' + ctrl[1] + ' ' + end[0] + ',' + end[1]);
        const len = p.path.getTotalLength();
        p.path.style.strokeDasharray = len; p.path.style.strokeDashoffset = len * (1 - t);
        // „impactul” cu harta
        const landed = raw >= 1;
        if (landed !== p.landed) {
          p.landed = landed;
          p.el.classList.toggle('landed', landed);
          if (landed) {
            p.ring.style.left = end[0] + 'px'; p.ring.style.top = end[1] + 'px';
            p.ring.classList.remove('go'); void p.ring.offsetWidth; p.ring.classList.add('go');
          }
        }
      });
    }
    let queued = false;
    const onScroll = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; update(); }); } };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    new ResizeObserver(onScroll).observe(map);
    update();
  }

  function init() {
    assignFly();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(assignFly, 200); });
    if (!reduce) liquid();
    planes();
  }
  return { init, assignFly };
})();
