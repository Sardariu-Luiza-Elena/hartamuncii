/*
  Efecte vizuale:
  1. Elementele apar discret de jos când intră în ecran (animația se repetă la fiecare trecere).
  2. Liniile topografice din fundal se deformează lin, ca un lichid, în jurul cursorului;
     efectul se stinge când cursorul e peste un card cu date.
  3. Trei avioane de hârtie zboară lin, pe lângă conținut, și aterizează pe marginea cardului cu harta Europei.
*/
window.FX = (function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  /* ---------- 1. apariția de jos ---------- */
  function assignFly() {
    document.querySelectorAll('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      // elementele mari urcă puțin mai mult decât cele mici; fără rotiri sau mișcări laterale
      const fy = el.classList.contains('sec-head') ? 28 : clamp(24 + r.height * 0.08, 30, 60);
      el.style.setProperty('--fy', Math.round(fy) + 'px');
    });
  }

  /* ---------- 2. fundal lichid ---------- */
  function hexA(hex, a) {
    const h = hex.replace('#', ''), n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a.toFixed(3) + ')';
  }
  // peste aceste elemente, efectul se stinge, ca să nu distragă de la date
  const CALM = '.card, .chart-card, .dom, .flip, .gender-col, .panel, .nav, .tabs, .split, .rail, .sound-btn, .metric-switch, .lang-btn, .life-copy, .sec-head, .foot';

  function liquid() {
    const old = document.querySelector('.bg-art .topo');
    if (!old) return;
    const cv = document.createElement('canvas');
    cv.className = 'topo-cv';
    old.replaceWith(cv);
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, rings = [], drawn = false;
    let color = css('--topo'), glow = css('--acc');
    new MutationObserver(() => { color = css('--topo'); glow = css('--acc'); drawn = false; })
      .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      rings = []; drawn = false;
      const fam = [{ x: 0.78, y: 0.28, step: 46, ay: 0.75 }, { x: 0.12, y: 0.85, step: 58, ay: 1.2 }];
      const diag = Math.hypot(W, H);
      fam.forEach(f => {
        const cx = f.x * W, cy = f.y * H;
        for (let k = 1; k * f.step < diag * 1.1; k++) {
          const r = k * f.step, n = clamp(Math.round(r * 0.5), 48, 520);
          const pts = [];
          for (let i = 0; i < n; i++) {
            const a = i / n * Math.PI * 2;
            pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r * f.ay, a });
          }
          rings.push({ pts, k });
        }
      });
    }
    build();
    window.addEventListener('resize', build);

    let tx = 0, ty = 0, mx = 0, my = 0, vx = 0, vy = 0, seen = false, want = 0, energy = 0, lastMove = 0;
    window.addEventListener('pointermove', e => {
      if (!seen) { mx = tx = e.clientX; my = ty = e.clientY; seen = true; }
      tx = e.clientX; ty = e.clientY; lastMove = performance.now();
      want = e.target.closest && e.target.closest(CALM) ? 0 : 1;
    }, { passive: true });
    document.addEventListener('pointerleave', () => { want = 0; });

    const SIG = 160, S2 = 2 * SIG * SIG, REACH = S2 * 4.5;
    const out = { x: 0, y: 0 };
    function displace(p, time) {
      out.x = p.x; out.y = p.y;
      if (energy < 0.005) return out;
      const dx = p.x - mx, dy = p.y - my, d2 = dx * dx + dy * dy;
      if (d2 > REACH) return out;
      const f = Math.exp(-d2 / S2) * energy, d = Math.sqrt(d2) || 1;
      const wave = Math.sin(time * 1.6 + d * 0.035 - p.a * 2) * 5 * f;   // unduire lentă, ca un val
      const push = 44 * f + wave;
      out.x += dx / d * push + vx * 2.2 * f;
      out.y += dy / d * push + vy * 2.2 * f;
      return out;
    }

    function frame(t) {
      requestAnimationFrame(frame);
      if (document.hidden) return;
      const idle = t - lastMove > 2500;
      energy += ((idle ? 0 : want) - energy) * 0.05;
      if (energy < 0.004 && drawn) return; // liniștit: nu mai redesenăm
      // cursorul „lichid” urmează cursorul real cu întârziere, ca vâscozitatea
      const nx = mx + (tx - mx) * 0.09, ny = my + (ty - my) * 0.09;
      vx += (clamp(nx - mx, -25, 25) - vx) * 0.12; vy += (clamp(ny - my, -25, 25) - vy) * 0.12;
      mx = nx; my = ny;
      const time = t * 0.001;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (energy > 0.02) {
        const g = ctx.createRadialGradient(mx, my, 0, mx, my, 300);
        g.addColorStop(0, hexA(glow, 0.5 * energy)); g.addColorStop(1, color);
        ctx.strokeStyle = g;
      } else ctx.strokeStyle = color;
      ctx.lineWidth = 1.1; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      for (const ring of rings) {
        const pts = ring.pts, n = pts.length;
        ctx.beginPath();
        // curbă netedă: trecem prin mijlocul segmentelor, cu punctele ca puncte de control
        let p = displace(pts[n - 1], time), px = p.x, py = p.y;
        p = displace(pts[0], time);
        let cx = p.x, cy = p.y;
        ctx.moveTo((px + cx) / 2, (py + cy) / 2);
        for (let i = 1; i <= n; i++) {
          p = displace(pts[i % n], time);
          ctx.quadraticCurveTo(cx, cy, (cx + p.x) / 2, (cy + p.y) / 2);
          cx = p.x; cy = p.y;
        }
        ctx.stroke();
      }
      drawn = true;
    }
    requestAnimationFrame(frame);
  }

  /* ---------- 3. avioane de hârtie ---------- */
  function planes() {
    const sec = document.getElementById('diaspora'), map = document.getElementById('euMap');
    if (!sec || !map) return;
    const box = document.createElement('div');
    box.className = 'planes'; box.setAttribute('aria-hidden', 'true');
    sec.appendChild(box);
    const SVG = '<svg viewBox="0 0 100 60"><path class="w1" d="M2 30 98 4 40 38Z"/><path class="w2" d="M40 38 98 4 54 58Z"/><path class="w3" d="M40 38 54 58 45 44Z"/></svg>';
    // trei avioane, trei mărimi; aterizează pe marginea de sus a cardului cu harta
    const P = [
      { size: 92, delay: 0.00, side: -1, at: 0.22, alt: 70 },
      { size: 66, delay: 0.12, side: 1, at: 0.58, alt: 40 },
      { size: 46, delay: 0.24, side: -1, at: 0.86, alt: 105 }
    ].map(p => {
      const el = document.createElement('div'); el.className = 'plane'; el.innerHTML = SVG;
      const puff = document.createElement('span'); puff.className = 'plane-hit';
      box.appendChild(puff); box.appendChild(el);
      return Object.assign(p, { el, puff, cur: 0, landed: false });
    });

    const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    let goal = 0;
    function measure() {
      const mr = map.getBoundingClientRect(), vh = window.innerHeight;
      // 0 = harta abia apare jos; 1 = marginea ei de sus a ajuns la o treime din ecran
      goal = reduce ? 1 : clamp((vh * 0.98 - mr.top) / (vh * 0.62), 0, 1);
    }

    function place(p) {
      const sr = sec.getBoundingClientRect(), mr = map.getBoundingClientRect();
      const W = sr.width, top = mr.top - sr.top, left = mr.left - sr.left;
      const scale = clamp(W / 1100, 0.55, 1), s = p.size * scale;
      // aterizare: avionul stă pe marginea cardului (burta pe margine, ușor înclinat)
      const end = [left + mr.width * p.at, top - s * 0.24];
      // pornesc din lateral, aproape de nivelul cardului, și zboară prin spațiul liber de deasupra lui, nu peste text
      const start = [p.side < 0 ? -s * 1.5 : W + s * 1.5, top - p.alt * scale];
      const ctrl = [(start[0] + end[0]) / 2, Math.min(start[1], end[1]) - 30 * scale];
      const t = ease(clamp((p.cur - p.delay) / (1 - 0.24), 0, 1)), u = 1 - t;
      const x = u * u * start[0] + 2 * u * t * ctrl[0] + t * t * end[0];
      const y = u * u * start[1] + 2 * u * t * ctrl[1] + t * t * end[1];
      const tt = Math.min(t, 0.97);
      const dx = 2 * (1 - tt) * (ctrl[0] - start[0]) + 2 * tt * (end[0] - ctrl[0]);
      const dy = 2 * (1 - tt) * (ctrl[1] - start[1]) + 2 * tt * (end[1] - ctrl[1]);
      let ang = Math.atan2(dy, dx) * 180 / Math.PI;
      if (dx < 0) ang -= 180;                      // avionul care vine din dreapta e întors
      const flip = dx < 0 ? -1 : 1;
      const settle = t > 0.97 ? (t - 0.97) / 0.03 : 0;
      ang = ang * (1 - settle) + (flip > 0 ? 6 : -6) * settle; // la final se așază aproape orizontal
      const bob = t < 1 ? Math.sin(t * Math.PI * 2.5) * 5 * scale * (1 - t) : 0;
      p.el.style.width = s + 'px'; p.el.style.height = s * 0.6 + 'px';
      p.el.style.transform = 'translate(' + (x - s / 2) + 'px,' + (y - s * 0.3 + bob) + 'px) scaleX(' + flip + ') rotate(' + (ang * flip) + 'deg)';
      p.el.style.opacity = t > 0 ? 1 : 0;
      const landed = t >= 0.999;
      if (landed !== p.landed) {
        p.landed = landed;
        p.el.classList.toggle('landed', landed);
        if (landed) {
          p.puff.style.left = end[0] + 'px'; p.puff.style.top = (top) + 'px';
          p.puff.classList.remove('go'); void p.puff.offsetWidth; p.puff.classList.add('go');
        }
      }
    }

    // zbor lin: progresul fiecărui avion urmează scroll-ul cu inerție, nu sare odată cu el
    let running = false;
    function tick() {
      let moving = false;
      P.forEach(p => {
        const d = goal - p.cur;
        if (Math.abs(d) > 0.0008) { p.cur += d * 0.075; moving = true; } else p.cur = goal;
        place(p);
      });
      if (moving) requestAnimationFrame(tick); else running = false;
    }
    function kick() { measure(); if (!running) { running = true; requestAnimationFrame(tick); } }
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    new ResizeObserver(kick).observe(map);
    kick();
  }

  function init() {
    assignFly();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(assignFly, 200); });
    if (!reduce) liquid();
    planes();
  }
  return { init, assignFly };
})();
