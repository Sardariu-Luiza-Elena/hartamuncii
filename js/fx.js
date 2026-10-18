/*
  Efecte vizuale: elementele apar discret de jos când intră în ecran (animația se repetă la fiecare trecere).
*/
window.FX = (function () {
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  function assignFly() {
    document.querySelectorAll('.reveal').forEach(el => {
      const r = el.getBoundingClientRect();
      // elementele mari urcă puțin mai mult decât cele mici; fără rotiri sau mișcări laterale
      const fy = el.classList.contains('sec-head') ? 28 : clamp(24 + r.height * 0.08, 30, 60);
      el.style.setProperty('--fy', Math.round(fy) + 'px');
    });
  }

  function init() {
    assignFly();
    let t; window.addEventListener('resize', () => { clearTimeout(t); t = setTimeout(assignFly, 200); });
  }
  return { init, assignFly };
})();
