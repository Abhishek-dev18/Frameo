// Scale Zoom Explainer · «Har chamakta dot, ek payment» — vertical 1080×1920 SVG, rebuilt every frame from time.
// Engine pieces (palette, shaded, halo, stars, orbi) from the Lemo-Opuscar flat-space-explainer demo; levels, route and timing are this film's.
// One depth parameter d(t): 0 Earth · 1 a city · 2 a tea stall · 3 a phone. Between integers the camera dives through the next-stop ring.
const FILM = 25.0, S0 = [W / 2, H / 2];
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k, seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = x => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), eo = x => 1 - Math.pow(1 - clamp(x), 3);
const spr = x => { x = clamp(x); return 1 - Math.exp(-6 * x) * Math.cos(9 * x); };       // lock with one overshoot
const VO = [['z1', 0.5], ['z2', 6.4], ['z3', 10.1], ['z4', 13.1], ['z5', 17.1], ['z6', 20.1]];
const DIVES = [[11.4, 12.7], [15.9, 16.9], [18.9, 19.8]], BACK = [22.4, 24.2];
function depth(t) {
  if (t >= BACK[0]) return 3 * (1 - eio(seg(t, BACK[0], BACK[1])));
  let d = 0; for (const [a, b] of DIVES) d += eio(seg(t, a, b)); return d;
}
// next-stop rings: level k → where level k+1 lives (in level k's frame), radius, label
const RINGS = [
  { x: 668, y: 830, r: 44, tag: 'NEXT STOP', label: 'Ek shehar', lx: 760, ly: 610, t: 10.3 },
  { x: 610, y: 1080, r: 40, tag: 'NEXT STOP', label: 'Chai ki dukaan', lx: 690, ly: 1300, t: 15.0 },
  { x: 742, y: 1132, r: 42, tag: 'NEXT STOP', label: 'Ek phone', lx: 700, ly: 1350, t: 18.3 },
];
const FOV = [1.4e7, 2.5e3, 4, 0.16];       // metres across the frame at each level
const REACH = 1102;                         // half-diagonal of the frame: the ring must reach this to fill it
// ───────── levels (each drawn in its own 1080×1920 frame, local time lt)
function payDot(p, x, y, t, ph, r = 7) {   // a payment: pops (0 → 1.3 → 1) once per cycle, two hard rings
  const c = ((t * .55 + ph) % 1), k = c < .18 ? spr(c / .18) * 1 : c < .8 ? 1 : 1 - seg(c, .8, 1);
  if (k <= .01) return;
  halo(p, x, y, r * 1.9 * k, r * 3.0 * k); el('circle', { cx: r1(x), cy: r1(y), r: r1(r * k), fill: C.sun }, p);
}
const R = rng(77), LAND = [   // generic continents (not a map), one peninsula where the ring sits
  [[400, 760], 120, 3], [[520, 690], 100, 5], [[300, 900], 90, 7], [[640, 1080], 70, 9], [[760, 980], 60, 4]];
function level0(p, t) {
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, p);
  stars(p, 11, 260, (x, y) => y > 1690 || (y < 380 && x < 760) || (y > 1490 && x > 600));
  const cx = 540, cy = 900, Rg = 380;
  halo(p, cx, cy, Rg + 40, Rg + 90);
  twoTone(p, 'circle', { cx, cy, r: Rg }, 70, 60, (G, shade) => {
    el('circle', { cx, cy, r: Rg, fill: shade ? C.blueD : C.blue }, G);
    for (const [[x, y], rr, s] of LAND) { const Rr = rng(s); el('path', { d: blobPath(polar(x, y, 9, a => rr * (.7 + .5 * Rr()))), fill: shade ? C.mintD : C.mint }, G); }
    // the peninsula: a softened triangle pointing south
    el('path', { d: blobPath([[600, 760], [690, 735], [745, 790], [720, 860], [680, 930], [650, 905], [615, 830]]), fill: shade ? C.mintD : C.mint }, G);
    for (const [x, y, w] of [[380, 600, 120], [600, 1150, 160], [300, 1020, 90]]) el('ellipse', { cx: x, cy: y, rx: w, ry: 22, fill: shade ? C.creamD : C.cream }, G);
  });
  // payments: dense on the peninsula, a few elsewhere
  const Rd = rng(5);
  for (let i = 0; i < 46; i++) { const x = 615 + Rd() * 120, y = 760 + Rd() * 150; if (x > 600 + (y - 760) * .5 && x < 740 - (y - 790) * .4) { const c = ((t * .55 + Rd()) % 1), k = c < .18 ? spr(c / .18) : c < .8 ? 1 : 1 - seg(c, .8, 1); if (k > .01) { el('circle', { cx: r1(x), cy: r1(y), r: r1(9 * k), fill: C.creamD }, p); el('circle', { cx: r1(x), cy: r1(y), r: r1(5 * k), fill: C.sun }, p); } } }
  return [cx, cy];
}
function level1(p, t) {     // a city at night, top-down: blocks, streets, payments on every street
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, p);
  const Rb = rng(9), bw = 150, bh = 170, gap = 46;
  for (let j = -1; j < 11; j++) for (let i = -1; i < 7; i++) {
    const x = i * (bw + gap) + 20, y = j * (bh + gap) + 40, k = Rb();
    shaded(p, 'rect', { x, y, width: bw, height: bh, rx: 16 }, k < .5 ? C.n3 : '#3A4192', C.n2, 10, 10);
    if (k > .35) el('rect', { x: x + 24, y: y + 24, width: bw * .4, height: bh * .3, rx: 8, fill: k > .8 ? C.blueD : C.n2 }, p);
    if (k > .7) el('circle', { cx: x + bw - 40, cy: y + bh - 40, r: 16, fill: C.mintD }, p);
  }
  const Rd = rng(31);
  for (let i = 0; i < 70; i++) { const onX = Rd() < .5, a = Math.floor(Rd() * 7), b = Rd();
    const x = onX ? b * W : a * (bw + gap) + 20 - gap / 2, y = onX ? Math.floor(b * 10) * (bh + gap) + 40 - gap / 2 + (Rd() * 0) : b * H;
    payDot(p, onX ? Rd() * W : x, onX ? Math.floor(Rd() * 10) * (bh + gap) + 40 - gap / 2 : y, t, Rd(), 6); }
  payDot(p, RINGS[1].x, RINGS[1].y, 0.3, 0, 8);
}
function level2(p, t) {     // a tea stall, front view, flat
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, p);
  stars(p, 3, 60, (x, y) => y > 520);
  el('rect', { x: 0, y: 1360, width: W, height: 560, fill: C.n2 }, p);
  // awning: coral and cream stripes, scalloped hem
  for (let i = 0; i < 8; i++) el('rect', { x: 120 + i * 105, y: 560, width: 105, height: 170, fill: i % 2 ? C.cream : C.coral }, p);
  for (let i = 0; i < 8; i++) el('circle', { cx: 172 + i * 105, cy: 730, r: 52, fill: i % 2 ? C.cream : C.coral }, p);
  el('rect', { x: 140, y: 780, width: 20, height: 420, fill: C.mist }, p); el('rect', { x: 920, y: 780, width: 20, height: 420, fill: C.mist }, p);
  // the bulb, glowing as two hard rings
  halo(p, 540, 830, 40, 70); el('circle', { cx: 540, cy: 830, r: 22, fill: C.sun }, p);
  // counter
  shaded(p, 'rect', { x: 110, y: 1190, width: 860, height: 220, rx: 24 }, C.blue, C.blueD, 0, 30);
  // kettle
  shaded(p, 'path', { d: blobPath([[250, 1190], [240, 1080], [290, 1030], [380, 1030], [420, 1080], [410, 1190]]) }, C.coral, C.coralD, 20, 16);
  el('path', { d: 'M410,1100 Q470,1080 480,1040', fill: 'none', stroke: C.coralD, 'stroke-width': 18, 'stroke-linecap': 'round' }, p);
  el('rect', { x: 300, y: 1006, width: 70, height: 26, rx: 13, fill: C.coralD }, p);
  // three cups with steam (steam = cream capsules that sway slowly)
  for (let i = 0; i < 3; i++) { const x = 500 + i * 80;
    shaded(p, 'rect', { x: x - 26, y: 1130, width: 52, height: 60, rx: 12 }, C.cream, C.creamD, 8, 8);
    el('path', { d: `M${x},1115 q${12 * Math.sin(t * 1.4 + i)},-30 0,-60`, fill: 'none', stroke: C.mist, 'stroke-width': 7, 'stroke-linecap': 'round' }, p); }
  // the QR stand and the phone lying on the counter
  shaded(p, 'rect', { x: 820, y: 1000, width: 110, height: 150, rx: 12 }, C.cream, C.creamD, 8, 8);
  const Rq = rng(4); for (let j = 0; j < 5; j++) for (let i = 0; i < 4; i++) if (Rq() < .55) el('rect', { x: 838 + i * 20, y: 1022 + j * 22, width: 16, height: 16, rx: 3, fill: C.night }, p);
  shaded(p, 'rect', { x: 700, y: 1110, width: 84, height: 44, rx: 10 }, C.n3, C.n2, 6, 6);
  el('rect', { x: 708, y: 1116, width: 68, height: 30, rx: 6, fill: C.cream }, p);
  text(p, 742, 1138, '₹20', { 'font-size': 18, 'font-weight': 700, fill: C.night, 'text-anchor': 'middle' });
}
function level3(p, t, lt) {   // the phone: the payment, done
  el('rect', { x: 0, y: 0, width: W, height: H, fill: C.night }, p);
  stars(p, 8, 90, (x, y) => x > 200 && x < 880 && y > 260 && y < 1650);
  shaded(p, 'rect', { x: 230, y: 300, width: 620, height: 1300, rx: 80 }, C.n3, C.n2, 18, 18);
  el('rect', { x: 262, y: 360, width: 556, height: 1180, rx: 54, fill: C.cream }, p);
  el('rect', { x: 470, y: 330, width: 140, height: 14, rx: 7, fill: C.n2 }, p);
  const k = spr(seg(lt, .3, 1.0));
  halo(p, 540, 760, 120 * k, 160 * k);
  el('circle', { cx: 540, cy: 760, r: r1(100 * k), fill: C.mint }, p);
  el('path', { d: 'M492,762 L528,798 L594,724', fill: 'none', stroke: C.cream, 'stroke-width': r1(22 * k), 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, p);
  text(p, 540, 1010, '₹20', { 'font-size': 150, 'font-weight': 700, fill: C.night, 'text-anchor': 'middle', 'data-a': 1 });
  text(p, 540, 1100, 'Paid', { 'font-size': 64, 'font-weight': 600, fill: C.mintD, 'text-anchor': 'middle' });
  text(p, 540, 1190, 'CHAI STALL · UPI', { 'font-size': 26, 'font-weight': 600, fill: C.mist, 'letter-spacing': 4, 'text-anchor': 'middle' });
  for (const [x, y, ph] of [[360, 640, 0], [720, 620, 1.3], [680, 900, 2.1], [390, 880, .7]]) { const s = 14 * (1 + .16 * Math.sin(t * 1.9 + ph)) * k; sparkle(p, x, y, s, C.sun); }
}
const LEVELS = [level0, level1, level2, level3];
function drawLevel(p, k, t, lt) { LEVELS[k](p, t, lt); }

// ───────── the camera: dive k → k+1 at u (log space)
function scene(p, t) {
  const d = depth(t), k = Math.min(2, Math.floor(d)), u = d - k;
  if (d >= 3 - 1e-6) { drawLevel(p, 3, t, t - DIVES[2][1]); return { k: 3, u: 0 }; }
  const Rg = RINGS[k], Z = Math.exp(u * Math.log(REACH / Rg.r));
  const C2 = [lerp(Rg.x, S0[0], eio(u)), lerp(Rg.y, S0[1], eio(u))];          // ring centre on screen
  const outer = g(p, { transform: `translate(${r1(C2[0])},${r1(C2[1])}) scale(${Z.toFixed(5)}) translate(${-Rg.x},${-Rg.y})` });
  drawLevel(outer, k, t, t);
  if (u > 0.001) {   // the next level grows inside the ring from a point
    const rr = Rg.r * Z, s = rr / REACH;
    const clip = clipOf('circle', { cx: r1(C2[0]), cy: r1(C2[1]), r: r1(rr) });
    const inner = g(g(p, { 'clip-path': clip }), { transform: `translate(${r1(C2[0])},${r1(C2[1])}) scale(${s.toFixed(5)}) translate(${-S0[0]},${-S0[1]})` });
    drawLevel(inner, k + 1, t, t - (k === 2 ? DIVES[2][1] : 0));
    el('circle', { cx: r1(C2[0]), cy: r1(C2[1]), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 4 }, p);
  }
  return { k, u, C2, Z };
}
function ringLock(p, t, k) {   // the next-stop ring locks with a spring, its label wipes in
  const Rg = RINGS[k], a = spr(seg(t, Rg.t, Rg.t + .5)); if (a <= 0) return;
  el('circle', { cx: Rg.x, cy: Rg.y, r: r1(Rg.r * a), fill: 'none', stroke: C.sun, 'stroke-width': 4 }, p);
  el('circle', { cx: Rg.x, cy: Rg.y, r: r1((Rg.r + 13) * a), fill: 'none', stroke: C.sun, 'stroke-width': 2.5, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round' }, p);
  const w = eo(seg(t, Rg.t + .2, Rg.t + .7)), below = Rg.ly > Rg.y;
  const ang = Math.atan2(Rg.ly - Rg.y, Rg.lx - Rg.x), sx = Rg.x + Math.cos(ang) * (Rg.r + 22), sy = Rg.y + Math.sin(ang) * (Rg.r + 22), ey = below ? Rg.ly - 46 : Rg.ly + 30;
  el('path', { d: `M${r1(sx)},${r1(sy)}L${r1(lerp(sx, Rg.lx, w))},${r1(lerp(sy, ey, w))}`, stroke: C.sun, 'stroke-width': 2.5, 'stroke-linecap': 'round' }, p);
  const G2 = g(p, { 'clip-path': clipOf('rect', { x: Rg.lx - 10, y: Rg.ly - 50, width: 460 * w, height: 80 }) });
  text(G2, Rg.lx, Rg.ly - 18, Rg.tag, { 'font-size': 18, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 });
  text(G2, Rg.lx, Rg.ly + 16, Rg.label, { 'font-size': 34, 'font-weight': 600, fill: C.cream });
}
function sightLine(p, t, k, lens) {   // dots pop out one by one from the lens toward the ring
  const Rg = RINGS[k], t0 = Rg.t - .6, t1 = Rg.t; if (t < t0) return;
  const dx = Rg.x - lens[0], dy = Rg.y - lens[1], L = Math.hypot(dx, dy) - Rg.r - 20, n = Math.floor(L / 22);
  for (let i = 1; i <= n; i++) { const ti = t0 + (t1 - t0) * i / n, a = seg(t, ti, ti + .12); if (a <= 0) continue;
    const s = a < .6 ? lerp(0, 1.3, a / .6) : lerp(1.3, 1, (a - .6) / .4), f = (i * 22 + (t - t0) * 30) % L;
    el('circle', { cx: r1(lens[0] + dx / (L + Rg.r + 20) * f), cy: r1(lens[1] + dy / (L + Rg.r + 20) * f), r: r1(4.2 * s), fill: C.sun }, p); }
}
// ───────── corner instrument (bottom right) and subtitles (bottom left)
function fmt(m) { if (m >= 1000) return [Math.round(m / 1000).toLocaleString('en-US'), 'km']; if (m >= 1) return [String(Math.round(m)), 'm']; return [String(Math.round(m * 100)), 'cm']; }
function instrument(p, d) {
  const k = Math.min(2, Math.floor(d)), u = d - k, f = Math.exp(lerp(Math.log(FOV[k]), Math.log(FOV[Math.min(3, k + 1)]), u)), [num, unit] = fmt(f);
  const x0 = 640, y = 1640, L = 360;
  text(p, x0, 1530, 'FIELD OF VIEW', { 'font-size': 17, 'font-weight': 600, fill: C.mist, 'letter-spacing': 3 });
  text(p, x0, 1590, `${num}<tspan font-size="30" font-weight="500" fill="${C.mist}" dx="10">${unit}</tspan>`, { 'font-size': 54, 'font-weight': 600, fill: C.cream });
  el('rect', { x: x0, y: y - 5, width: L, height: 10, rx: 5, fill: C.n3 }, p);
  const pos = v => x0 + v / 3 * L;
  el('rect', { x: x0, y: y - 5, width: r1(pos(d) - x0), height: 10, rx: 5, fill: C.sun }, p);
  for (let i = 0; i < 4; i++) { const lit = d >= i - .02; el('circle', { cx: r1(pos(i)), cy: y, r: lit ? 11 : 8, fill: lit ? C.sun : C.n3 }, p); }
}
let LINES = {}, DURS = {};
function subtitles(p, t) {
  for (let i = 0; i < VO.length; i++) { const [id, t0] = VO[i], t1 = Math.min(t0 + Math.max(1.8, (DURS[id] || 2) + .6), i + 1 < VO.length ? VO[i + 1][1] - .05 : 1e9);
    if (t < t0 || t >= t1 || !LINES[id]) continue; const rise = eo(seg(t, t0, t0 + .16)), dy = (1 - rise) * 24;
    el('rect', { x: 64, y: 1716 + dy, width: 5, height: 96, fill: C.sun }, p);
    const G2 = g(p, { 'clip-path': clipOf('rect', { x: 70, y: 1700, width: 1000, height: 140 }) });
    text(G2, 88, 1756 + dy, LINES[id].hg, { 'font-size': 36, 'font-weight': 600, fill: C.cream, ...(LINES[id].hg.length > 44 ? { textLength: 930 } : {}) });
    text(G2, 88, 1796 + dy, LINES[id].en, { 'font-size': 26, 'font-weight': 500, fill: C.mist }); }
}
function headline(p, t) {   // one big number, one label: «82 crore / har din» on the Earth level
  const a = eo(seg(t, 6.6, 7.1)), out = seg(t, 10.0, 10.3); if (a <= 0 || out >= 1) return;
  const G2 = g(p, { 'clip-path': clipOf('rect', { x: 60, y: 120 - (1 - a) * 0, width: 960, height: 260 }) });
  const dy = (1 - a) * 160 + out * -200;
  text(G2, 70, 190 + dy, 'UPI PAYMENTS · HAR DIN', { 'font-size': 18, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 });
  text(G2, 64, 330 + dy, `82<tspan font-size="70" font-weight="600" fill="${C.cream}" dx="16">crore</tspan>`, { 'font-size': 150, 'font-weight': 700, fill: C.cream });
}
function render(t) {
  svg = document.getElementById('s'); while (svg.firstChild) svg.removeChild(svg.firstChild); defs = el('defs', {}, svg); uid = 0;
  const p = g(svg), st = scene(p, t), d = depth(t);
  // rings and labels belong to the current level when it is still (no dive running)
  const still = st.u === 0 || st.u < 1e-4;
  if (still && st.k < 3 && t < BACK[0]) ringLock(p, t, st.k);
  if (st.k === 0 && still) headline(p, t);
  // the guide: Orbi, screen-space (parallax 1.0), bottom left; turns to each ring, fires the sight line, dives with us
  const ox = 210, oy = 1380, os = 230, look = st.k < 3 ? [clamp((RINGS[st.k].x - ox) / 400, -1, 1), clamp((RINGS[st.k].y - oy) / 500, -1, 1)] : [.6, -.6];
  const zoomPose = st.u > 0 ? Math.sin(Math.PI * st.u) : 0, rk = st.k < 3 ? RINGS[st.k] : null;
  const fire = rk && t > rk.t - .9 && t < rk.t + .2 ? 1 : 0, smile = d >= 2.98 && t < BACK[0] ? eo(seg(t, 20.3, 20.8)) : 0;
  const lid = (t % 3.7) < .12 ? Math.sin(Math.PI * (t % 3.7) / .12) : 0;
  const P = { rot: -6 + Math.sin(t * 1.3) * 3, look, lid, smile, zoom: Math.max(zoomPose, fire * .6), wide: fire * .3, ant: Math.sin(t * 2.1) * 8, flame: .6 + .2 * Math.sin(t * 3), flick: t * 9, tilt: Math.sin(t * 1.7) * 6 };
  const lens = orbiLens(ox, oy + Math.sin(t * 1.6) * 8, os, P);
  if (still && rk && t < BACK[0]) sightLine(p, t, st.k, lens);
  orbi(p, ox, oy + Math.sin(t * 1.6) * 8, os, P);
  instrument(p, d);
  subtitles(p, t);
}
window.DUR = FILM;
window.render = render;
const EV = [];
VO.forEach(([id, t]) => EV.push({ t, type: 'vo', id }));
RINGS.forEach((r, k) => { EV.push({ t: r.t, type: 'lock', k }); EV.push({ t: r.t - .6, type: 'sight', k, d: .6 }); });
DIVES.forEach(([a, b], k) => EV.push({ t: a, type: 'dive', k, d: b - a }));
EV.push({ t: DIVES[2][1] + .3, type: 'paid' }, { t: BACK[0], type: 'back', d: BACK[1] - BACK[0] });
window.EV = EV.sort((a, b) => a.t - b.t);
window.TEXTS = () => [];
Promise.all([document.fonts.load('600 40px Jost'), document.fonts.load('700 40px Jost'), document.fonts.load('500 40px Jost'),
  fetch('vo/lines.json').then(r => r.json()).then(a => a.forEach(l => LINES[l.id] = l)), fetch('vo/dur.json').then(r => r.json()).then(x => DURS = x)])
  .then(() => { render(0); window.READY = true; });
