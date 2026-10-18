/*
  Coloană sonoră de suspans, generată în browser (Web Audio API), fără fișiere și fără drepturi de autor.
  Dacă pui un fișier propriu în audio/suspans.mp3, se folosește acela în loc.
  Browserele nu permit sunet fără o acțiune a utilizatorului, așa că pornește doar din buton.
*/
window.Suspense = (function () {
  let ctx = null, master = null, timer = null, on = false, fileAudio = null, useFile = null;
  const VOL = 0.55;

  /* ---------- varianta cu fișier propriu ---------- */
  function tryFile() {
    return new Promise(res => {
      const a = new Audio('audio/suspans.mp3');
      a.loop = true; a.volume = 0;
      a.addEventListener('canplaythrough', () => res(a), { once: true });
      a.addEventListener('error', () => res(null), { once: true });
      a.load();
      setTimeout(() => res(null), 1500);
    });
  }
  function fadeFile(to, ms) {
    const from = fileAudio.volume, t0 = performance.now();
    (function step(now) {
      const p = Math.min(1, (now - t0) / ms);
      fileAudio.volume = from + (to - from) * p;
      if (p < 1) requestAnimationFrame(step); else if (to === 0) fileAudio.pause();
    })(t0);
  }

  /* ---------- varianta generată ---------- */
  function reverb(seconds) {
    const len = ctx.sampleRate * seconds, buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6);
    }
    const cv = ctx.createConvolver(); cv.buffer = buf; return cv;
  }

  function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    master.connect(comp).connect(ctx.destination);
    const verb = reverb(4.5), verbGain = ctx.createGain(); verbGain.gain.value = 0.55;
    verb.connect(verbGain).connect(master);

    // dronă joasă: două dinți de fierăstrău ușor dezacordate, printr-un filtru care respiră
    const droneF = ctx.createBiquadFilter(); droneF.type = 'lowpass'; droneF.frequency.value = 180; droneF.Q.value = 6;
    const droneG = ctx.createGain(); droneG.gain.value = 0.16;
    [36.71, 36.95, 55.0].forEach((f, i) => {
      const o = ctx.createOscillator(); o.type = i === 2 ? 'sine' : 'sawtooth'; o.frequency.value = f;
      o.connect(droneF); o.start();
    });
    const lfo = ctx.createOscillator(), lfoG = ctx.createGain();
    lfo.frequency.value = 0.07; lfoG.gain.value = 110; lfo.connect(lfoG).connect(droneF.frequency); lfo.start();
    droneF.connect(droneG); droneG.connect(master); droneG.connect(verb);

    // zgomot pentru ticăitul de ceas
    const nb = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

    const BPM = 92, beat = 60 / BPM;
    const NOTES = [293.66, 349.23, 440.0, 523.25, 587.33, 659.25, 698.46]; // re minor
    let next = ctx.currentTime + 0.1, n = 0;

    function heart(t) { // „lub-dub”
      [0, 0.22].forEach((dt, k) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(k ? 62 : 70, t + dt); o.frequency.exponentialRampToValueAtTime(34, t + dt + 0.18);
        g.gain.setValueAtTime(0.0001, t + dt); g.gain.exponentialRampToValueAtTime(k ? 0.45 : 0.7, t + dt + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.3);
        o.connect(g).connect(master); o.start(t + dt); o.stop(t + dt + 0.35);
      });
    }
    function tick(t, acc) {
      const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      s.buffer = nb; f.type = 'highpass'; f.frequency.value = acc ? 3500 : 6000;
      g.gain.setValueAtTime(acc ? 0.09 : 0.045, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);
      s.connect(f).connect(g).connect(master); s.start(t);
    }
    function bell(t, f) { // notă de „pian” rece, cu ecou lung
      const g = ctx.createGain(), g2 = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.09, t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t + 3.2);
      [[f, 'triangle', 1], [f * 2.01, 'sine', 0.25]].forEach(([fr, type, a]) => {
        const o = ctx.createOscillator(), og = ctx.createGain(); o.type = type; o.frequency.value = fr; og.gain.value = a;
        o.connect(og).connect(g); o.start(t); o.stop(t + 3.3);
      });
      g.connect(g2); g2.gain.value = 0.6; g2.connect(master); g.connect(verb);
    }
    function swell(t) { // creștere de tensiune la fiecare 16 bătăi
      const o = ctx.createOscillator(), f = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.value = 73.42; f.type = 'lowpass';
      f.frequency.setValueAtTime(120, t); f.frequency.exponentialRampToValueAtTime(1400, t + beat * 7.5);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + beat * 7.4); g.gain.exponentialRampToValueAtTime(0.0001, t + beat * 8);
      o.connect(f).connect(g); g.connect(master); g.connect(verb); o.start(t); o.stop(t + beat * 8.1);
    }

    timer = setInterval(() => {
      while (next < ctx.currentTime + 0.3) {
        const inBar = n % 4;
        if (inBar === 0) heart(next);
        tick(next, inBar === 0); tick(next + beat / 2, false);
        if (n % 16 === 8) swell(next);
        if (n % 2 === 0 && Math.random() < 0.38) bell(next + beat * 0.5, NOTES[Math.floor(Math.random() * NOTES.length)] / (Math.random() < 0.3 ? 2 : 1));
        next += beat; n++;
      }
    }, 80);
  }

  function setLevel(v, sec) {
    if (useFile) { fadeFile(v * VOL, sec * 1000); if (v > 0) fileAudio.play(); return; }
    if (!ctx) return;
    const t = ctx.currentTime;
    master.gain.cancelScheduledValues(t);
    master.gain.setValueAtTime(master.gain.value, t);
    master.gain.linearRampToValueAtTime(v * VOL, t + sec);
  }

  async function toggle() {
    on = !on;
    if (on) {
      if (useFile === null) { fileAudio = await tryFile(); useFile = !!fileAudio; }
      if (!useFile) { if (!ctx) build(); else await ctx.resume(); }
      setLevel(1, 2.5);
    } else {
      setLevel(0, 0.8);
      if (!useFile && ctx) setTimeout(() => { if (!on) ctx.suspend(); }, 900);
    }
    return on;
  }
  // volum mai mic după ce pleci de pe prima pagină (muzica e pentru intro)
  function setFocus(inHero) { if (on) setLevel(inHero ? 1 : 0.18, 1.2); }

  return { toggle, setFocus, isOn: () => on };
})();
