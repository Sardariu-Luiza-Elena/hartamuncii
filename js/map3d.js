/* Harta 3D a României: fiecare județ e extrudat după indicatorul ales */
window.RoMap3D = (function () {
  const LON0 = 25.0, LAT0 = 45.95, K = 10, COSLAT = Math.cos(45.9 * Math.PI / 180);
  const MAX_H = 7.5, MIN_H = 0.35;

  function cssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  }

  function create(canvas, opts) {
    const data = window.RO_DATA.counties;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 1000);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x223344, 0.55));
    const sun = new THREE.DirectionalLight(0xffffff, 0.75);
    sun.position.set(-30, 60, 40);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0x8899ff, 0.35);
    rim.position.set(40, 20, -40);
    scene.add(rim);

    const root = new THREE.Group();
    root.rotation.x = -Math.PI / 2; // extrudarea (z) devine înălțime (y)
    scene.add(root);

    // umbră moale sub hartă
    const shadowTex = (function () {
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const g = c.getContext('2d'); const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
      gr.addColorStop(0, 'rgba(0,0,0,0.55)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.fillRect(0, 0, 128, 128);
      return new THREE.CanvasTexture(c);
    })();
    const shadow = new THREE.Mesh(new THREE.PlaneGeometry(95, 70), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = -0.05;
    scene.add(shadow);

    const project = ([lon, lat]) => new THREE.Vector2((lon - LON0) * COSLAT * K, (lat - LAT0) * K);

    const meshes = [];
    const byCode = {};
    window.RO_GEO.forEach(({ c, p }) => {
      const shapes = p.map(rings => {
        const shape = new THREE.Shape(rings[0].map(project));
        rings.slice(1).forEach(h => shape.holes.push(new THREE.Path(h.map(project))));
        return shape;
      });
      const geo = new THREE.ExtrudeGeometry(shapes, { depth: 1, bevelEnabled: false, curveSegments: 1 });
      geo.computeBoundingBox();
      const capMat = new THREE.MeshStandardMaterial({ roughness: 0.6, metalness: 0.05 });
      const sideMat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 });
      const mesh = new THREE.Mesh(geo, [capMat, sideMat]);
      mesh.scale.z = 0.001;

      // contur pe fața de sus
      const outline = new THREE.Group();
      p.forEach(rings => {
        const pts = rings[0].map(pt => { const v = project(pt); return new THREE.Vector3(v.x, v.y, 1.002); });
        const lg = new THREE.BufferGeometry().setFromPoints(pts);
        outline.add(new THREE.LineLoop(lg, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.35 })));
      });
      mesh.add(outline);

      const bb = geo.boundingBox;
      mesh.userData = {
        code: c, d: data[c], outline,
        cx: (bb.min.x + bb.max.x) / 2, cy: (bb.min.y + bb.max.y) / 2,
        h: 0.001, target: 1, lift: 0, liftT: 0, fade: 0, fadeT: 0, sel: 0, delay: 0
      };
      root.add(mesh); meshes.push(mesh); byCode[c] = mesh;
    });

    // ---- culori & înălțimi ----
    let metric = 'g';
    const cLo = new THREE.Color(), cMid = new THREE.Color(), cHi = new THREE.Color(), cSide = new THREE.Color(), cDim = new THREE.Color();
    function gradient(t, out) {
      if (t < 0.5) out.copy(cLo).lerp(cMid, t * 2);
      else out.copy(cMid).lerp(cHi, (t - 0.5) * 2);
      return out;
    }
    function range(m) {
      const v = Object.values(data).map(d => d[m]);
      return [Math.min(...v), Math.max(...v)];
    }
    function applyColors() {
      cLo.set(cssVar('--map-lo')); cMid.set(cssVar('--map-mid')); cHi.set(cssVar('--map-hi'));
      cSide.set(cssVar('--map-side'));
      const lineCol = new THREE.Color(cssVar('--ink'));
      cDim.set(cssVar('--map-dim'));
      shadow.material.opacity = document.documentElement.getAttribute('data-theme') === 'dark' ? 1 : 0.28;
      const [lo, hi] = range(metric);
      meshes.forEach(m => {
        const t = (m.userData.d[metric] - lo) / (hi - lo);
        const col = gradient(t, new THREE.Color());
        m.userData.baseCol = col;
        m.userData.sideCol = col.clone().lerp(cSide, 0.55);
        m.userData.outline.children.forEach(l => l.material.color.copy(lineCol));
      });
    }
    function setMetric(m, stagger) {
      metric = m;
      const [lo, hi] = range(m);
      meshes.forEach(mesh => {
        const t = (mesh.userData.d[m] - lo) / (hi - lo);
        mesh.userData.target = MIN_H + Math.pow(t, 1.15) * MAX_H;
        if (stagger) mesh.userData.delay = performance.now() + (mesh.userData.cx + 35) * 22;
      });
      applyColors();
      return [lo, hi];
    }

    // ---- cameră orbitală simplă ----
    const homeX = () => (window.innerWidth > 960 ? -8 : 0);
    const target = new THREE.Vector3(homeX(), 0, 0), targetGoal = new THREE.Vector3(homeX(), 0, 0);
    const phi0 = window.innerWidth < 720 ? 0.72 : 0.92;
    let theta = 0, phi = phi0, radius = 105, radiusGoal = 88, thetaGoal = 0, phiGoal = phi0;
    function placeCamera() {
      camera.position.set(
        target.x + radius * Math.sin(phi) * Math.sin(theta),
        target.y + radius * Math.cos(phi),
        target.z + radius * Math.sin(phi) * Math.cos(theta)
      );
      camera.lookAt(target);
    }

    // ---- interacțiune ----
    const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
    let needPick = false, hovered = null, selected = null, dragging = false, moved = 0, last = null, lastPointer = null, idleSince = performance.now();

    function pick(e) {
      const r = canvas.getBoundingClientRect();
      ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ptr, camera);
      const hits = ray.intersectObjects(meshes, false);
      if (!hits.length) return null;
      // dacă județul deja evidențiat e încă sub cursor (chiar și în spatele altuia), îl păstrăm
      if (hovered && hits.some(h => h.object === hovered)) return hovered;
      return hits[0].object;
    }

    canvas.addEventListener('pointerdown', e => {
      dragging = true; moved = 0; last = { x: e.clientX, y: e.clientY, type: e.pointerType };
      if (e.pointerType === 'mouse') canvas.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointermove', e => {
      lastPointer = e;
      needPick = true;
      if (dragging && last) {
        const dx = e.clientX - last.x, dy = e.clientY - last.y;
        moved += Math.abs(dx) + Math.abs(dy);
        thetaGoal -= dx * 0.005;
        if (last.type === 'mouse') phiGoal = Math.min(1.3, Math.max(0.25, phiGoal - dy * 0.004));
        last.x = e.clientX; last.y = e.clientY;
        idleSince = performance.now();
        if (moved > 4) canvas.classList.add('dragging');
      }
    });
    window.addEventListener('pointerup', () => { dragging = false; canvas.classList.remove('dragging'); });
    canvas.addEventListener('pointerleave', () => { lastPointer = null; hovered = null; });
    canvas.addEventListener('click', e => {
      if (moved > 6) return;
      const m = pick(e);
      if (m) select(m.userData.code); else select(null);
    });
    canvas.addEventListener('wheel', e => {
      if (!e.ctrlKey && !e.metaKey) return; // lasă pagina să se deruleze
      e.preventDefault();
      radiusGoal = Math.min(320, Math.max(35, radiusGoal * (1 + e.deltaY * 0.0015)));
    }, { passive: false });

    function select(code) {
      selected = code ? byCode[code] : null;
      meshes.forEach(m => {
        m.userData.fadeT = !selected || m === selected ? 0 : 0.72;
        m.userData.liftT = m === selected ? 1.2 : 0;
      });
      if (selected) {
        const u = selected.userData;
        targetGoal.set(u.cx, 0, -u.cy);
        // pe ecran lat, mută județul spre stânga ca să facă loc panoului
        if (window.innerWidth > 720) {
          const right = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta));
          targetGoal.addScaledVector(right, 6);
        }
        radiusGoal = fitRadius() * 0.8;
      } else {
        targetGoal.set(homeX(), 0, 0); radiusGoal = fitRadius();
      }
      opts.onSelect && opts.onSelect(code);
    }

    // ---- bucla de randare ----
    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    // distanța la care încape toată țara, în funcție de proporțiile ecranului
    function fitRadius() {
      const a = camera.aspect || 1.6;
      return 98 * Math.max(1, (a < 1 ? 1.3 : 1.55) / a);
    }
    window.addEventListener('resize', () => {
      resize();
      if (!selected) { targetGoal.set(homeX(), 0, 0); radiusGoal = fitRadius(); }
    });
    resize();
    radius = fitRadius() * 1.2; radiusGoal = fitRadius();

    let visible = true;
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(canvas);

    const tip = opts.tip;
    function loop(now) {
      requestAnimationFrame(loop);
      if (!visible) return;

      // balans lent când nu atinge nimeni harta
      const idle = now - idleSince > 2500 && !selected;
      const sway = idle ? Math.sin(now * 0.00025) * 0.18 : 0;
      theta += (thetaGoal + sway - theta) * 0.06;
      phi += (phiGoal - phi) * 0.08;
      radius += (radiusGoal - radius) * 0.06;
      target.lerp(targetGoal, 0.06);
      placeCamera();

      // hover
      let hov = hovered;
      if (!lastPointer || dragging) hov = null;
      else if (needPick) { hov = pick(lastPointer); needPick = false; }
      if (hov !== hovered) {
        hovered = hov;
        canvas.classList.toggle('hovering', !!hov);
      }
      if (tip) {
        if (hovered && lastPointer) {
          const r = canvas.getBoundingClientRect();
          const d = hovered.userData.d;
          tip.innerHTML = d.n + '<small>' + (metric === 's' ? d.s.toLocaleString(window.LOCALE || 'ro-RO') + ' lei' : (d.g > 0 ? '+' : '') + d.g.toLocaleString(window.LOCALE || 'ro-RO') + '%') + '</small>';
          tip.style.left = (lastPointer.clientX - r.left) + 'px';
          tip.style.top = (lastPointer.clientY - r.top) + 'px';
          tip.classList.add('show');
        } else tip.classList.remove('show');
      }

      meshes.forEach(m => {
        const u = m.userData;
        if (now >= u.delay) u.h += (u.target - u.h) * 0.07;
        const liftGoal = u.liftT || (m === hovered && !selected ? 0.4 : 0);
        u.lift += (liftGoal - u.lift) * 0.12;
        u.fade += (u.fadeT - u.fade) * 0.1;
        m.scale.z = Math.max(0.001, u.h);
        m.position.z = u.lift;
        // județul selectat primește culoarea cea mai intensă, ca să iasă în evidență
        u.sel += ((m === selected ? 1 : 0) - u.sel) * 0.1;
        m.material[0].color.copy(u.baseCol).lerp(cHi, u.sel * 0.85).lerp(cDim, u.fade);
        m.material[1].color.copy(u.sideCol).lerp(cDim, u.fade);
        const glow = m === hovered || m === selected ? 0.18 : 0;
        m.material[0].emissive.copy(u.baseCol).multiplyScalar(glow);
        u.outline.children.forEach(l => { l.material.opacity = 0.3 * (1 - u.fade * 0.8); });
      });

      renderer.render(scene, camera);
    }

    const [lo, hi] = setMetric('s', true);
    requestAnimationFrame(loop);

    return {
      setMetric: m => setMetric(m, true),
      range,
      select,
      refreshColors: applyColors,
      initialRange: [lo, hi]
    };
  }

  return { create };
})();
