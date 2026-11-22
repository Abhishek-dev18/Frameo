// Debug Diaries · Sunday Inside EP 03 — "What does your phone actually read in a UPI QR code?" (Scale Zoom Explainer, 1080×1920).
// Route: a vegetable cart's QR stand → the whole code (21×21 modules, error correction) → one finder pattern (1:1:3:1:1)
// → one byte (8 modules = 8 bits) → the text inside (upi://pay?pa=…&pn=…) → pull back through every ring.
// Sources: IEEE Milestone "QR Code, 1994" (Denso Wave, Japan, for tracking automotive parts); QR spec facts as published by
// Denso Wave / ISO/IEC 18004 (version 1 = 21×21 … version 40 = 177×177 modules; error-correction level H ≈ 30 %;
// finder pattern 1:1:3:1:1; dark module = binary 1); NPCI UPI Linking Specification (upi://pay?pa=<VPA>&pn=<name>).
// SIMPLIFIED on screen: data mask and real codeword placement skipped; module patterns are illustrative (not scannable);
// field-of-view values are approximate. Guide: Kanchu (lemo/inside-kit/guide.js). Engine pieces from Lemo-Opuscar flat-space-explainer.
const S0 = [W / 2, H / 2];
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x)), lerp = (a, b, k) => a + (b - a) * k, seg = (t, a, b) => clamp((t - a) / (b - a));
const eio = x => (x = clamp(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2), eo = x => 1 - Math.pow(1 - clamp(x), 3);
const spr = x => { x = clamp(x); return 1 - Math.exp(-6 * x) * Math.cos(9 * x); };
// ───────── timing (from vo/dur.json: v1 9.52 · v2 11.24 · v3 9.33 · v4 12.66 · v5 15.05 · v6 8.94 · v7 11.97 · v8 9.90)
const VO = [['v1', 0.7], ['v2', 10.9], ['v3', 24.1], ['v4', 34.0], ['v5', 48.6], ['v6', 65.6], ['v7', 75.2], ['v8', 88.2]];
const V = Object.fromEntries(VO);
const DIVES = [[22.4, 23.9], [47.0, 48.5], [64.0, 65.5]], BACK = [88.5, 91.2], FILM = 101.0;
function depth(t) {
  if (t >= BACK[0]) return 3 * (1 - eio(seg(t, BACK[0], BACK[1])));
  let d = 0; for (const [a, b] of DIVES) d += eio(seg(t, a, b)); return d;
}
// ───────── a QR-like module matrix (structure true to the spec: finders, separators, timing; data modules illustrative)
function qrMatrix(n, seed) {
  const R = rng(seed), M = [], fix = [];
  for (let j = 0; j < n; j++) { M.push([]); fix.push([]); for (let i = 0; i < n; i++) { M[j].push(R() < .48 ? 1 : 0); fix[j].push(0); } }
  const finder = (ox, oy) => { for (let j = -1; j < 8; j++) for (let i = -1; i < 8; i++) { const x = ox + i, y = oy + j; if (x < 0 || y < 0 || x >= n || y >= n) continue;
    const r = Math.max(Math.abs(i - 3), Math.abs(j - 3)); M[y][x] = r === 4 ? 0 : r === 3 ? 1 : r === 2 ? 0 : 1; fix[y][x] = 1; } };
  finder(0, 0); finder(n - 7, 0); finder(0, n - 7);
  for (let k = 8; k < n - 8; k++) { M[6][k] = M[k][6] = k % 2 ? 0 : 1; fix[6][k] = fix[k][6] = 1; }
  return { M, fix, n };
}
const QR21 = qrMatrix(21, 2203);
function drawQR(p, Q, x0, y0, m, skip) {
  for (let j = 0; j < Q.n; j++) for (let i = 0; i < Q.n; i++) if (Q.M[j][i] && !(skip && skip(i, j)))
    el('rect', { x: r1(x0 + i * m), y: r1(y0 + j * m), width: r1(m + .6), height: r1(m + .6), fill: C.night }, p);
}
// ───────── next-stop rings (in each level's own frame)
const RINGS = [
  { x: 770, y: 812, r: 84, tag: 'NEXT STOP', label: 'The code', lx: 560, ly: 640, t: 20.6 },
  { x: 330, y: 570, r: 140, tag: 'NEXT STOP', label: 'One corner', lx: 520, ly: 372, t: 45.3 },
  { x: 880, y: 1100, r: 186, tag: 'NEXT STOP', label: 'One byte', lx: 470, ly: 1430, t: 62.4 },
];
const FOV = [2.0, 0.12, 0.045, 0.019];   // metres across the frame (approximate)
const REACH = 1102;
// ───────── level 0: a vegetable cart at night with a QR stand
function level0(p, t) {
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: C.night }, p);
  stars(p, 21, 220, (x, y) => y > 1330 || (y < 420 && x < 820) || (x > 600 && y > 1480));
  el('rect', { x: -400, y: 1330, width: W + 800, height: 1000, fill: C.n2 }, p);
  // lantern on a pole
  el('rect', { x: 896, y: 560, width: 16, height: 470, rx: 8, fill: C.mist }, p);
  el('path', { d: 'M904,580 L760,580', stroke: C.mist, 'stroke-width': 4, 'stroke-linecap': 'round' }, p);
  halo(p, 700, 640, 46, 80); el('rect', { x: 682, y: 600, width: 36, height: 16, rx: 6, fill: C.mist }, p);
  el('circle', { cx: 700, cy: 640, r: 26, fill: C.cream }, p);
  // cart body, handle, wheels
  el('path', { d: 'M150,1060 L40,1000', stroke: C.mist, 'stroke-width': 14, 'stroke-linecap': 'round' }, p);
  shaded(p, 'rect', { x: 140, y: 990, width: 800, height: 210, rx: 26 }, C.blue, C.blueD, 0, 26);
  for (let i = 0; i < 6; i++) el('rect', { x: 170 + i * 130, y: 1030, width: 100, height: 14, rx: 7, fill: C.blueD }, p);
  for (const wx of [300, 780]) { shaded(p, 'circle', { cx: wx, cy: 1250, r: 82 }, C.n3, C.n2, 10, 10); el('circle', { cx: wx, cy: 1250, r: 22, fill: C.mist }, p);
    for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; el('path', { d: `M${wx},1250 L${r1(wx + Math.cos(a) * 62)},${r1(1250 + Math.sin(a) * 62)}`, stroke: C.mist, 'stroke-width': 4, 'stroke-linecap': 'round' }, p); } }
  // produce piles: tomatoes (coral), spinach (mint), onions (cream)
  const Rp = rng(8);
  for (let i = 0; i < 9; i++) shaded(p, 'circle', { cx: 190 + i * 30 + Rp() * 8, cy: 975 - (i % 2) * 26, r: 26 }, C.coral, C.coralD, 6, 6);
  for (let i = 0; i < 5; i++) shaded(p, 'path', { d: blobPath(polar(470 + i * 46, 960 - (i % 2) * 14, 9, a => 38 * (.75 + .35 * Math.abs(Math.sin(a * 3 + i))))) }, C.mint, C.mintD, 8, 8);
  for (let i = 0; i < 4; i++) shaded(p, 'ellipse', { cx: 860 + (i % 2) * 40, cy: 975 - Math.floor(i / 2) * 30, rx: 26, ry: 22 }, C.cream, C.creamD, 6, 6);
  // the QR stand on its little easel
  el('path', { d: 'M770,940 L740,990 M770,940 L800,990', stroke: C.mist, 'stroke-width': 6, 'stroke-linecap': 'round' }, p);
  shaded(p, 'rect', { x: 690, y: 712, width: 160, height: 224, rx: 14 }, C.cream, C.creamD, 8, 8);
  el('rect', { x: 690, y: 712, width: 160, height: 32, rx: 14, fill: C.blue }, p);
  el('rect', { x: 690, y: 728, width: 160, height: 16, fill: C.blue }, p);
  drawQR(p, QR21, 718, 760, 5);
  el('rect', { x: 716, y: 884, width: 108, height: 10, rx: 5, fill: C.creamD }, p); el('rect', { x: 736, y: 904, width: 68, height: 10, rx: 5, fill: C.creamD }, p);
}
// ───────── level 1: the whole code (21 × 21 modules), then damage and recovery
const L1 = { x0: 225, y0: 465, m: 30 };
function level1(p, t) {
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: C.night }, p);
  stars(p, 5, 80, (x, y) => (x > 140 && x < 940 && y > 380 && y < 1200) || y > 1330 || y < 420);
  shaded(p, 'rect', { x: 180, y: 420, width: 720, height: 720, rx: 34 }, C.cream, C.creamD, 12, 12);
  // damage: a mist smudge over part of the data region; recovery pops the modules back (mint flash then night)
  const t0 = V.v4 + 0.4, hit = spr(seg(t, t0, t0 + .6)), heal = eio(seg(t, V.v4 + 11.4, V.v4 + 12.4));
  const inSm = (i, j) => { const dx = i - 14.5, dy = j - 14; return dx * dx / 22 + dy * dy / 14 < 1; };
  drawQR(p, QR21, L1.x0, L1.y0, L1.m);
  if (hit > 0.01 && heal < .999) {
    const k = hit * (1 - heal), cx = L1.x0 + 14.5 * L1.m, cy = L1.y0 + 14 * L1.m;
    el('path', { d: blobPath(polar(cx, cy, 11, a => (150 + 30 * Math.sin(a * 3) + 20 * Math.cos(a * 5)) * k)), fill: C.mist }, p);
    el('path', { d: blobPath(polar(cx - 20, cy + 10, 9, a => (90 + 20 * Math.sin(a * 4 + 1)) * k)), fill: '#A9AEDF' }, p);
    // a torn corner, bottom right of the card
    el('path', { d: `M900,${r1(1140 - 170 * k)} L${r1(900 - 120 * k)},1140 L900,1140 Z`, fill: C.night }, p);
  }
  if (heal > 0 && heal < 1) for (let j = 0; j < 21; j++) for (let i = 0; i < 21; i++) if (inSm(i, j) && QR21.M[j][i]) {
    const s = spr(seg(heal, (i + j) * .015, (i + j) * .015 + .4)); el('rect', { x: r1(L1.x0 + i * L1.m + 15 - 15 * s), y: r1(L1.y0 + j * L1.m + 15 - 15 * s), width: r1(30 * s), height: r1(30 * s), fill: C.mintD }, p); }
}
// ───────── level 2: one finder pattern, close (cream paper card, night modules)
const L2 = { x0: 80, y0: 380, m: 80 }, BYTE = [0, 1, 1, 1, 0, 1, 0, 1];   // 'u' = 0x75 = 01110101
const byteAt = (r, c) => BYTE[(3 - r) * 2 + (c === 1 ? 0 : 1)];   // MSB bottom-right, upward zigzag
function level2(p, t) {
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: C.night }, p);
  stars(p, 6, 40, (x, y) => y > 300);
  shaded(p, 'rect', { x: 40, y: 340, width: 1000, height: 960, rx: 30 }, C.cream, C.creamD, 10, 10);
  const Q = qrMatrix(21, 2203), G2 = g(p, { 'clip-path': clipOf('rect', { x: 40, y: 340, width: 1000, height: 960, rx: 30 }) });
  for (let j = 0; j < 12; j++) for (let i = 0; i < 12; i++) {
    let v = Q.M[j][i]; if (i >= 9 && i <= 10 && j >= 7 && j <= 10) v = byteAt(j - 7, i - 9);
    if (v) el('rect', { x: L2.x0 + i * L2.m, y: L2.y0 + j * L2.m, width: L2.m + .6, height: L2.m + .6, fill: C.night }, G2);
  }
  // the scan line across the middle row: 1 : 1 : 3 : 1 : 1
  const a = seg(t, V.v5 + 3.9, V.v5 + 5.2); if (a > 0 && t < V.v5 + 13.6) {
    const y = L2.y0 + 3.5 * L2.m, xa = L2.x0, xb = lerp(xa, L2.x0 + 7 * L2.m, eo(a));
    el('rect', { x: xa - 10, y: y - 7, width: xb - xa + 20, height: 14, rx: 7, fill: C.sun }, p);
    [[0, 1, '1'], [1, 2, '1'], [2, 5, '3'], [5, 6, '1'], [6, 7, '1']].forEach(([i0, i1, s], k) => {
      const kk = spr(seg(t, V.v5 + 4.2 + k * .25, V.v5 + 4.7 + k * .25)); if (kk <= 0) return;
      const cx = L2.x0 + (i0 + i1) / 2 * L2.m;
      el('rect', { x: L2.x0 + i0 * L2.m + 6, y: y - 22, width: 5, height: 44, rx: 2.5, fill: C.sunD }, p);
      el('circle', { cx: cx, cy: y, r: r1(30 * kk), fill: C.night }, p);
      text(p, cx, y + 13, s, { 'font-size': r1(38 * kk), 'font-weight': 700, fill: C.sun, 'text-anchor': 'middle' });
    });
  }
  // inset: a whole code turning, its three finders ringed (any angle)
  const b = spr(seg(t, V.v5 + 7.9, V.v5 + 8.6)), bo = seg(t, V.v5 + 14.2, V.v5 + 14.6);
  if (b > 0.01 && bo < 1) { const s = b * (1 - eio(bo)), cx = 860, cy = 560, rot = (t - V.v5 - 7.9) * 40;
    el('circle', { cx, cy, r: r1(170 * s), fill: C.night }, p);
    const G3 = g(p, { transform: `translate(${cx},${cy}) rotate(${r1(rot)}) scale(${(s).toFixed(3)})` });
    el('rect', { x: -98, y: -98, width: 196, height: 196, rx: 10, fill: C.cream }, G3);
    drawQR(G3, QR21, -84, -84, 8);
    for (const [fx, fy] of [[3.5, 3.5], [17.5, 3.5], [3.5, 17.5]]) el('circle', { cx: -84 + fx * 8, cy: -84 + fy * 8, r: 36, fill: 'none', stroke: C.sun, 'stroke-width': 5 }, G3);
  }
}
// ───────── level 3: one byte (2 × 4 modules), bits shown
const L3 = { x0: 350, y0: 520, m: 190 };
function level3(p, t) {
  el('rect', { x: -400, y: -400, width: W + 800, height: H + 800, fill: C.night }, p);
  stars(p, 13, 70, (x, y) => (x > 280 && x < 800 && y > 440 && y < 1360) || y < 440 || y > 1330);
  shaded(p, 'rect', { x: L3.x0 - 30, y: L3.y0 - 30, width: 2 * L3.m + 60, height: 4 * L3.m + 60, rx: 26 }, C.cream, C.creamD, 10, 10);
  const show = seg(t, V.v6 + 3.4, V.v6 + 3.9);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 2; c++) {
    const v = byteAt(r, c), x = L3.x0 + c * L3.m, y = L3.y0 + r * L3.m;
    if (v) shaded(p, 'rect', { x: x + 6, y: y + 6, width: L3.m - 12, height: L3.m - 12, rx: 18 }, C.n3, C.night, 8, 8);
    else el('rect', { x: x + 6, y: y + 6, width: L3.m - 12, height: L3.m - 12, rx: 18, fill: C.creamD }, p);
    const k = 7 - ((3 - r) * 2 + (c === 1 ? 0 : 1)), kk = spr(seg(t, V.v6 + 3.4 + (7 - k) * .12, V.v6 + 3.9 + (7 - k) * .12));
    if (show > 0 && kk > 0.01) text(p, x + L3.m / 2, y + L3.m / 2 + 34 * kk, String(v), { 'font-size': r1(100 * kk), 'font-weight': 700, fill: v ? C.cream : C.night, 'text-anchor': 'middle' });
  }
  // reading order: a sun path zigzagging up from the bottom-right module
  const a = seg(t, V.v6 + 1.0, V.v6 + 3.0); if (a > 0) {
    const pts = []; for (let r = 3; r >= 0; r--) { pts.push([L3.x0 + 1.5 * L3.m, L3.y0 + (r + .5) * L3.m]); pts.push([L3.x0 + .5 * L3.m, L3.y0 + (r + .5) * L3.m]); }
    const n = Math.min(8, Math.floor(a * 8) + 1);
    for (let i = 0; i < n; i++) { const s = spr(seg(a * 8, i, i + .6)); el('circle', { cx: pts[i][0] + 62, cy: pts[i][1] - 62, r: r1(16 * s), fill: C.sun }, p);
      text(p, pts[i][0] + 62, pts[i][1] - 54, String(i + 1), { 'font-size': r1(22 * s), 'font-weight': 700, fill: C.night, 'text-anchor': 'middle' }); }
  }
}
const LEVELS = [level0, level1, level2, level3];
function drawLevel(p, k, t) { LEVELS[k](p, t); }
// ───────── the camera: dive k → k+1 at u (log space); also used backwards for the pull-back
function scene(p, t) {
  const d = depth(t), k = Math.min(2, Math.floor(d)), u = d - k;
  if (d >= 3 - 1e-6) { drawLevel(p, 3, t); return { k: 3, u: 0 }; }
  const Rg = RINGS[k], Z = Math.exp(u * Math.log(REACH / Rg.r));
  const C2 = [lerp(Rg.x, S0[0], eio(u)), lerp(Rg.y, S0[1], eio(u))];
  const outer = g(p, { transform: `translate(${r1(C2[0])},${r1(C2[1])}) scale(${Z.toFixed(5)}) translate(${-Rg.x},${-Rg.y})` });
  drawLevel(outer, k, t);
  if (u > 0.001) {
    const rr = Rg.r * Z, s = rr / REACH;
    const clip = clipOf('circle', { cx: r1(C2[0]), cy: r1(C2[1]), r: r1(rr) });
    const inner = g(g(p, { 'clip-path': clip }), { transform: `translate(${r1(C2[0])},${r1(C2[1])}) scale(${s.toFixed(5)}) translate(${-S0[0]},${-S0[1]})` });
    drawLevel(inner, k + 1, t);
    el('circle', { cx: r1(C2[0]), cy: r1(C2[1]), r: r1(rr), fill: 'none', stroke: C.sun, 'stroke-width': 4 }, p);
    el('circle', { cx: r1(C2[0]), cy: r1(C2[1]), r: r1(rr + 13), fill: 'none', stroke: C.sun, 'stroke-width': 2.5, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round' }, p);
  }
  return { k, u, C2, Z };
}
function ringLock(p, t, k) {
  const Rg = RINGS[k], a = spr(seg(t, Rg.t, Rg.t + .5)); if (a <= 0) return;
  el('circle', { cx: Rg.x, cy: Rg.y, r: r1(Rg.r * a), fill: 'none', stroke: C.sun, 'stroke-width': 5 }, p);
  el('circle', { cx: Rg.x, cy: Rg.y, r: r1((Rg.r + 14) * a), fill: 'none', stroke: C.sun, 'stroke-width': 3, 'stroke-dasharray': '3 9', 'stroke-linecap': 'round' }, p);
  const w = eo(seg(t, Rg.t + .2, Rg.t + .7)), below = Rg.ly > Rg.y;
  const ex = Rg.lx - 16, ey = below ? Rg.ly - 34 : Rg.ly + 24;
  const ang = Math.atan2(ey - Rg.y, ex - Rg.x), sx = Rg.x + Math.cos(ang) * (Rg.r + 22), sy = Rg.y + Math.sin(ang) * (Rg.r + 22);
  el('path', { d: `M${r1(sx)},${r1(sy)}L${r1(lerp(sx, ex, w))},${r1(lerp(sy, ey, w))}`, stroke: C.sun, 'stroke-width': 3, 'stroke-linecap': 'round' }, p);
  const G2 = g(p, { 'clip-path': clipOf('rect', { x: Rg.lx - 10, y: Rg.ly - 50, width: 420 * w, height: 84 }) });
  el('rect', { x: Rg.lx - 10, y: Rg.ly - 46, width: 300, height: 80, rx: 14, fill: C.night }, G2);
  text(G2, Rg.lx + 6, Rg.ly - 18, Rg.tag, { 'font-size': 18, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 });
  text(G2, Rg.lx + 6, Rg.ly + 18, Rg.label, { 'font-size': 36, 'font-weight': 600, fill: C.cream });
}
function sightLine(p, t, k, lens) {
  const Rg = RINGS[k], t0 = Rg.t - .7, t1 = Rg.t; if (t < t0 || t > Rg.t + 1.6) return;
  const fade = 1 - seg(t, Rg.t + 1.2, Rg.t + 1.6);
  const dx = Rg.x - lens[0], dy = Rg.y - lens[1], D = Math.hypot(dx, dy), L = D - Rg.r - 20, n = Math.floor(L / 24);
  for (let i = 1; i <= n; i++) { const ti = t0 + (t1 - t0) * i / n, a = seg(t, ti, ti + .12); if (a <= 0) continue;
    const s = (a < .6 ? lerp(0, 1.3, a / .6) : lerp(1.3, 1, (a - .6) / .4)) * fade, f = (i * 24 + (t - t0) * 30) % L;
    el('circle', { cx: r1(lens[0] + dx / D * f), cy: r1(lens[1] + dy / D * f), r: r1(4.5 * s), fill: C.sun }, p); }
}
// ───────── headlines: one big number or label per beat (rise through a clip, exit backwards)
const HEADS = [
  { lv: 0, t0: V.v2 + 2.4, t1: 20.3, tag: 'QR CODE · DENSO WAVE, JAPAN', big: '1994', size: 150 },
  { lv: 1, t0: V.v3 + 5.3, t1: V.v4 - .3, tag: 'SMALLEST QR · MODULES', big: '21 × 21', size: 140, sub: 'largest: 177 × 177' },
  { lv: 1, t0: V.v4 + 7.4, t1: 45.0, tag: 'DAMAGE IT CAN SURVIVE · LEVEL H', big: '~30%', size: 150 },
  { lv: 2, t0: V.v5 + 4.0, t1: 62.1, tag: 'FINDER PATTERN · STRIPE RATIO', big: '1:1:3:1:1', size: 120 },
  { lv: 3, t0: V.v6 + 6.6, t1: V.v7 - .3, tag: '8 BITS = 1 BYTE · SIMPLIFIED', big: '01110101 = u', size: 108 },
  { lv: 3, t0: V.v7 + 3.6, t1: BACK[0] - .1, tag: 'WHAT A UPI QR HOLDS · TEXT', big: 'upi://pay', size: 128, sub: '?pa=&lt;UPI ID&gt;&amp;pn=&lt;name&gt;' },
  { lv: 0, t0: BACK[1] + 1.4, t1: FILM + 1, tag: 'SUNDAY INSIDE · EP 03', big: 'module → text → ₹', size: 84 },
];
function headline(p, t, lv) {
  for (const h of HEADS) { if (h.lv !== lv || t < h.t0 || t > h.t1) continue;
    const a = spr(seg(t, h.t0, h.t0 + .55)), o = eio(seg(t, h.t1 - .4, h.t1)), dy = (1 - a) * 170 + o * 170;
    const G2 = g(p, { 'clip-path': clipOf('rect', { x: 50, y: 150, width: 980, height: h.sub ? 270 : 230 }) });
    text(G2, 70, 196 + dy, h.tag, { 'font-size': 20, 'font-weight': 600, fill: C.sun, 'letter-spacing': 3 });
    text(G2, 64, 216 + h.size * .78 + dy, h.big, { 'font-size': h.size, 'font-weight': 700, fill: C.cream, 'letter-spacing': -2 });
    if (h.sub) text(G2, 70, 216 + h.size * .78 + 58 + dy, h.sub, { 'font-size': 34, 'font-weight': 500, fill: C.mist }); }
}
// ───────── corner instrument (right, above the subtitles) and subtitles (bottom)
function fmt(m) { if (m >= 1) return [m.toFixed(1), 'm']; const c = m * 100; return [c >= 10 ? String(Math.round(c)) : c.toFixed(1), 'cm']; }
function instrument(p, d) {
  const k = Math.min(2, Math.floor(d)), u = d - k, f = Math.exp(lerp(Math.log(FOV[k]), Math.log(FOV[Math.min(3, k + 1)]), u)), [num, unit] = fmt(f);
  const x0 = 640, y = 1645, L = 360;
  el('rect', { x: x0 - 28, y: 1496, width: L + 56, height: 184, rx: 22, fill: C.night }, p);
  text(p, x0, 1530, 'FIELD OF VIEW ≈', { 'font-size': 17, 'font-weight': 600, fill: C.mist, 'letter-spacing': 3 });
  text(p, x0, 1592, `${num}<tspan font-size="30" font-weight="500" fill="${C.mist}" dx="10">${unit}</tspan>`, { 'font-size': 56, 'font-weight': 600, fill: C.cream });
  el('rect', { x: x0, y: y - 5, width: L, height: 10, rx: 5, fill: C.n3 }, p);
  const pos = v => x0 + v / 3 * L;
  el('rect', { x: x0, y: y - 5, width: r1(Math.max(10, pos(d) - x0)), height: 10, rx: 5, fill: C.sun }, p);
  for (let i = 0; i < 4; i++) { const lit = d >= i - .02; el('circle', { cx: r1(pos(i)), cy: y, r: lit ? 11 : 8, fill: lit ? C.sun : C.n3 }, p); }
}
let LINES = {}, DURS = {};
function subtitles(p, t) {
  el('rect', { x: 0, y: 1700, width: W, height: 220, fill: C.night }, p);
  for (let i = 0; i < VO.length; i++) { const [id, t0] = VO[i], Ln = LINES[id]; if (!Ln) continue;
    const end = Math.min(t0 + (DURS[id] || 5) + .6, i + 1 < VO.length ? VO[i + 1][1] - .05 : 1e9);
    for (let c = 0; c < Ln.cues.length; c++) { const a = t0 + Ln.cues[c].t, b = c + 1 < Ln.cues.length ? t0 + Ln.cues[c + 1].t - .02 : end;
      if (t < a || t >= b) continue; const rise = eo(seg(t, a, a + .16)), dy = (1 - rise) * 24, q = Ln.cues[c];
      el('rect', { x: 64, y: 1724 + dy, width: 5, height: 96, fill: C.sun }, p);
      const G2 = g(p, { 'clip-path': clipOf('rect', { x: 70, y: 1706, width: 1000, height: 140 }) });
      text(G2, 88, 1764 + dy, q.hg, { 'font-size': 38, 'font-weight': 600, fill: C.cream, ...(q.hg.length > 44 ? { textLength: 930, lengthAdjust: 'spacingAndGlyphs' } : {}) });
      text(G2, 88, 1806 + dy, q.en, { 'font-size': 27, 'font-weight': 500, fill: C.mist, ...(q.en.length > 62 ? { textLength: 930, lengthAdjust: 'spacingAndGlyphs' } : {}) }); } }
}
function render(t) {
  svg = document.getElementById('s'); while (svg.firstChild) svg.removeChild(svg.firstChild); defs = el('defs', {}, svg); uid = 0;
  const p = g(svg), st = scene(p, t), d = depth(t), still = st.u < 1e-4, back = t >= BACK[0] && t < BACK[1];
  if (still && st.k < 3 && t < BACK[0]) ringLock(p, t, st.k);
  if (still && !back) headline(p, t, st.k);
  // the guide: Kanchu, screen-space, bottom left; looks at each ring, fires the sight line, leans into dives
  const ox = 180, oy = 1455 + Math.sin(t * 1.6) * 6, os = 230, rk = st.k < 3 && t < BACK[0] ? RINGS[st.k] : null;
  const look = rk ? [clamp((rk.x - ox) / 420, -1, 1), clamp((rk.y - oy) / 600, -1, 1)] : [.5, -.5];
  const zoomPose = st.u > 0 ? Math.sin(Math.PI * st.u) : 0, fire = rk ? Math.sin(Math.PI * seg(t, rk.t - 1.0, rk.t + .5)) : 0;
  const end = eo(seg(t, BACK[1] + .2, BACK[1] + 1.0)), lid = (t % 3.9) < .12 ? Math.sin(Math.PI * (t % 3.9) / .12) : 0;
  const P = { rot: -4 + Math.sin(t * 1.2) * 3, look, lid, smile: end, zoom: Math.max(zoomPose, fire * .7), wide: fire * .3, squash: .04 * Math.sin(t * 2.4) - zoomPose * .06, step: t * 2.2, wave: end * (.6 + .4 * Math.sin(t * 5)) };
  const lens = guideLens(ox, oy, os, P);
  if (still && rk) sightLine(p, t, st.k, lens);
  guide(p, ox, oy, os, P);
  instrument(p, d);
  subtitles(p, t);
}
window.DUR = FILM;
window.render = render;
const EV = [];
VO.forEach(([id, t]) => EV.push({ t, type: 'vo', id }));
RINGS.forEach((r, k) => { EV.push({ t: r.t, type: 'lock', k }); EV.push({ t: r.t - .7, type: 'sight', k, d: .7 }); });
DIVES.forEach(([a, b], k) => EV.push({ t: a, type: 'dive', k, d: b - a }));
EV.push({ t: V.v4 + .4, type: 'smudge' }, { t: V.v4 + 11.4, type: 'heal' }, { t: V.v6 + 3.4, type: 'bits' }, { t: V.v7 + 3.6, type: 'reveal' }, { t: BACK[0], type: 'back', d: BACK[1] - BACK[0] });
window.EV = EV.sort((a, b) => a.t - b.t);
window.TEXTS = () => [];
Promise.all([document.fonts.load('600 40px Jost'), document.fonts.load('700 40px Jost'), document.fonts.load('500 40px Jost'),
  fetch('vo/lines.json').then(r => r.json()).then(a => a.forEach(l => LINES[l.id] = l)), fetch('vo/dur.json').then(r => r.json()).then(x => DURS = x)])
  .then(() => { render(0); window.READY = true; });
