// Access Granted 05 — "Identity lifecycle: Joiner, Mover, Leaver"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 05/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait. Voice: content/debug-diaries/iam-05/p1..p6.mp3
// Story: Priya joins (HR desk prints a badge, only the Finance doors light), moves to Engineering (new doors light,
// the Finance doors go dark), leaves (badge into the return tray, every lamp dark at once, out the exit). Then the HR
// desk sends a pulse to the sync server that creates / updates / disables door lamps (SCIM), and one lamp stays lit: orphan?
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.3, v = x => x + VO;
const PART = [0.06, 9.971, 16.261, 25.496, 31.671, 41.419].map(v), VEND = v(53.684);
const DUR = +(VEND + 1.25).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.475, 'B, 403!'], [2.201, 'The token was valid,'], [3.227, 'only the permission was missing.'],
  [4.244, "Today's topic:"], [5.556, 'the identity lifecycle:'], [7.941, 'Joiner,'], [8.614, 'Mover,'], [9.304, 'Leaver.'],
  [9.971, 'Joiner.'], [10.675, "Priya's first day at the office."], [12.211, 'Her HR entry creates a badge,'], [14.58, "only for her team's doors."],
  [16.261, 'Mover.'], [17.043, 'Priya shifts from Finance to Engineering.'], [19.499, 'New doors open,'],
  [20.829, 'and the old Finance doors must close.'], [23.244, 'Otherwise, access just piles up.'],
  [25.496, 'Leaver.'], [26.159, 'Last day,'], [27.036, 'badge returned.'], [28.172, 'And all her doors close at once,'],
  [30.051, 'the same day,'], [30.791, 'not next week.'],
  [31.671, 'In tech: the HR system is the source of truth.'], [34.398, 'The moment something changes there,'],
  [36.012, 'a standard like SCIM'], [37.991, 'creates, updates or disables the account in every app.'],
  [41.419, 'Clearance check!'], [42.437, 'Priya has left the company,'], [44.036, 'but her account is still active.'],
  [45.753, 'What is that called?'], [46.782, 'A, an orphan account,'], [48.352, 'or B, a service account?'],
  [50.303, 'Answer in the next reel. Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const KIOSK = [2.5, 4.9, 0.7, 0.6, 1.15];           // HR desk: x, y, w, d, h
const GATE_Y = 4.3, POSTS = [4.6, 6.35];
const DOORS = [{ x: 0.8, name: 'FINANCE' }, { x: 2.3, name: 'LEDGER' }, { x: 5.0, name: 'ENG' }, { x: 6.5, name: 'BUILD' }, { x: 8.6, name: 'EXIT', exit: true }];
const SERVER = [3.75, -1.3, 0.7, 0.75, 1.7];         // the sync server
const TRAY = [4.15, 0.15, 0.5, 0.4, 0.8];            // badge return tray
const SUBJ = '#D97757', SUBJ_LT = '#D97757';
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.78, top: '#D97757', legs: LEGS[2] };

const T_PRINT = v(12.3), T_TAKE = v(13.3), T_SCAN = v(14.9), T_GATE = v(15.15);
const T_DROP = v(27.15), T_ALLOFF = v(28.35), T_GONE = v(31.9);
const T_PULSE = [v(34.5), v(35.9)], T_SRV = v(36.0);
// lamp windows per door: [on, off, colour]
const LAMPS = [
  [[v(15.0), v(21.6)]],
  [[v(15.3), v(21.85)], [v(44.05), 999]],
  [[v(19.6), T_ALLOFF], [v(39.7), v(40.4)]],
  [[v(20.0), T_ALLOFF], [v(38.05), v(40.4)]],
  [],
];
const KEYS = [ // [t, x, y]  ~1.5 m/s, away from the camera
  [0, 5.6, 8.6], [v(10.0), 5.6, 8.6], [v(12.5), 3.6, 5.4],
  [v(13.5), 3.6, 5.4], [v(14.85), 5.6, 5.4],
  [v(16.3), 5.6, 5.4], [v(19.3), 5.6, 1.0],
  [v(25.6), 5.6, 1.0], [v(26.3), 4.95, 0.45],
  [v(28.8), 4.95, 0.45], [v(31.8), 9.2, -0.6], [DUR, 9.2, -0.6]];
function priyaAt(t) {
  for (let i = 0; i < KEYS.length - 1; i++) {
    const [t0, x0, y0] = KEYS[i], [t1, x1, y1] = KEYS[i + 1];
    if (t <= t1) {
      const moving = Math.hypot(x1 - x0, y1 - y0) > 0, f = clamp((t - t0) / (t1 - t0));
      // ease in/out over the first and last 0.35 s only, so the pace stays ~1.5 m/s
      const T = t1 - t0, a = .35 / T; let e;
      if (!moving) e = 0; else if (f < a) e = f * f / (2 * a * (1 - a)); else if (f > 1 - a) e = 1 - (1 - f) * (1 - f) / (2 * a * (1 - a)); else e = (f - a / 2) / (1 - a);
      const x = lerp(x0, x1, e), y = lerp(y0, y1, e), dist = Math.hypot(x - x0, y - y0);
      return { x, y, walking: moving && f > 0 && f < 1, dist, seg: i };
    }
  }
  const k = KEYS[KEYS.length - 1]; return { x: k[1], y: k[2], walking: false, dist: 0, seg: 99 };
}
// total path length up to t (for the stride phase)
function phaseAt(t) {
  let L = 0;
  for (let i = 0; i < KEYS.length - 1; i++) { const [t0, x0, y0] = KEYS[i], [t1, x1, y1] = KEYS[i + 1]; if (t >= t1) L += Math.hypot(x1 - x0, y1 - y0); else break; }
  return (L + priyaAt(t).dist) / .72 * Math.PI;
}


// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 6.0, -1.2, 82], [v(4.0), 5.8, -1.2, 80], [v(9.8), 5.4, -1.8, 90],
  [v(13.2), 4.8, -0.6, 92], [v(16.0), 4.4, 1.8, 86], [v(19.0), 3.7, 4.0, 88],
  [v(24.8), 3.7, 4.0, 90], [v(27.6), 3.7, 4.6, 86], [v(31.4), 4.3, 6.6, 82],
  [v(33.4), 2.9, 1.6, 72], [v(40.8), 2.7, 2.0, 74], [v(43.4), 4.9, 3.0, 80], [DUR, 4.9, 3.0, 84]];
function camAt(t) {
  let a = CAM[0], b = CAM[CAM.length - 1];
  for (let i = 0; i < CAM.length - 1; i++) if (t >= CAM[i][0] && t <= CAM[i + 1][0]) { a = CAM[i]; b = CAM[i + 1]; break; }
  if (t > b[0]) a = b;
  const f = a === b ? 0 : eio((t - a[0]) / (b[0] - a[0]));
  const s = lerp(a[1], b[1], f), d = lerp(a[2], b[2], f), k = lerp(a[3], b[3], f);
  return { x: s + d / 2, y: s - d / 2, z: 0, k };
}

// ---------- floor phrases (English, Newsreader; one accent word each) ----------
const PH = [
  { t0: v(0.5), at: v(2.0), lines: [[['answer ', 'n'], ['403', 'na']], [['valid token, no permission', 'ns']]], l2: v(3.227) },
  { t0: v(4.4), at: v(8.0), lines: [[['Joiner · Mover', 'n']], [['· ', 'ns'], ['Leaver', 'nsa']]], l2: v(9.304) },
  { t0: v(10.1), at: v(13.0), lines: [[['Joiner', 'na']], [['team doors only', 'ns']]], l2: v(14.58) },
  { t0: v(16.4), at: v(20.0), lines: [[['Mover', 'n']], [['new doors in, ', 'ns'], ['old out', 'nsa']]], l2: v(20.829) },
  { t0: v(23.3), at: v(24.4), lines: [[['access ', 'n'], ['piles up', 'na']]], gap: .25 },
  { t0: v(25.7), at: v(28.5), lines: [[['Leaver', 'n']], [['every door, ', 'ns'], ['same day', 'nsa']]], l2: v(28.9) },
  { t0: v(31.8), at: v(35.5), lines: [[['HR', 'na'], [' = truth', 'n']], [['SCIM syncs every app', 'ns']]], l2: v(36.012) },
  { t0: v(41.6), at: v(46.0), lines: [[['left, still ', 'n'], ['active', 'na']], [['orphan or service?', 'ns']]], l2: v(46.782) },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1330;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .12, scale: .74, dv: 1.7, indent: .4 });
  let L = phraseLayout({ ...P, lineGap: 0 });
  if (P.l2) { const end0 = Math.max(...L.filter(c => c.li === 0).map(c => c.tc)); P.lineGap = Math.max(.2, P.l2 - end0); } else P.lineGap = P.gap;
  L = phraseLayout(P);
  iso.cam = camAt(P.at);
  const [x0, x1, y0, y1] = phraseWorld(P, L), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const [tx, ty] = iso.unP(W / 2, SCREEN_Y, 0);
  P.x = tx - cx; P.y = ty - cy; P.L = L;
}

// ---------- events (sound) ----------
const EV = [];
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
PART.forEach((t, i) => E(Math.max(0, t - .05), 'chord', { i }));
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
{ let lastStep = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = priyaAt(t); if (!p.walking) continue; const n = Math.floor(phaseAt(t) / Math.PI); if (n !== lastStep) { if (lastStep >= 0) E(t, 'step'); lastStep = n; } } }
E(T_PRINT - .1, 'slide'); E(T_PRINT + .7, 'beep'); E(T_TAKE, 'tick'); E(T_SCAN, 'beep'); E(T_GATE, 'gate');
LAMPS.forEach(ws => ws.forEach(([on]) => { if (on < 900) E(on, 'lamp'); }));
E(v(21.6), 'lock'); E(T_DROP, 'tick'); E(T_DROP + .15, 'beep'); E(T_ALLOFF, 'lock'); E(T_GONE - .3, 'gate');
E(T_PULSE[0], 'slide'); E(T_SRV, 'beep'); E(v(40.4), 'lock');
E(v(46.782), 'tick'); E(v(48.352), 'tick');
EV.sort((a, b) => a.t - b.t);

// ---------- drawing helpers ----------
const FLOOR = '#020403', FLOOR_LINE = '#0B2412', BEYOND = '#000000';
const WALLC = '#0A100C', DOORC = '#00FF66', SCREEN = '#2F3532';
function floor(g) {
  { const _g = g.createLinearGradient(0, 0, W * .35, H); _g.addColorStop(0, BEYOND); _g.addColorStop(1, '#00CC54'); g.fillStyle = _g; g.fillRect(0, 0, W, H); }
  const P = (x, y) => iso.P(x, y, 0);
  fillPoly(g, [P(WALL_X, WALL_Y), P(60, WALL_Y), P(60, 60), P(WALL_X, 60)], FLOOR);
  g.save(); g.strokeStyle = FLOOR_LINE; g.lineWidth = 1.5;
  for (let x = WALL_X; x < 40; x += 1.5) { const a = P(x, WALL_Y), b = P(x, 40); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  for (let y = WALL_Y; y < 40; y += 1.5) { const a = P(WALL_X, y), b = P(40, y); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  g.restore();
  onPlane(g, 6.4, 9.6, 0, 'xy', gg => { gg.fillStyle = '#F1C474'; gg.fillRect(-1.6, -1.6, 1.6, 1.8); });
}
function disc(g, x, y, r, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); }); }
function ring(g, x, y, r, col, a, lw = .07) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.strokeStyle = col; gg.lineWidth = lw; gg.stroke(); }); }



function lampLit(i, t) { let a = 0; for (const [on, off] of LAMPS[i]) a = Math.max(a, ss(seg(t, on, on + .3)) * (1 - ss(seg(t, off, off + .25)))); return a; }
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri(WALLC, .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri(WALLC, .1, .12));
  for (const y0 of [2, 6, 10, 14]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = '#00FF66'; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = '#E5C280'; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ_LT; gg.fillRect(0, -.16, 40, .16); });
  DOORS.forEach((D, i) => {
    const lit = lampLit(i, t);
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = D.exit ? '#D97757' : DOORC; gg.fillRect(0, -2.15, 1.2, 2.15);
      gg.fillStyle = hex(mix(DOORC, '#0F1A12', .25)); gg.fillRect(1.0, -1.2, .08, .3);
      if (D.exit) { gg.fillStyle = SUBJ; gg.fillRect(.25, -2.62, .7, .3); gg.fillStyle = '#EEC677'; gg.font = font(700, 100, 'Inter'); gg.textAlign = 'center'; gg.save(); gg.translate(.6, -2.4); gg.scale(.0021, .0021); gg.fillText('EXIT', 0, 0); gg.restore(); return; }
      gg.beginPath(); gg.arc(.6, -2.42, .11, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, C.accent, lit)); gg.fill();
      if (lit > .01) { gg.globalAlpha = lit * .35; gg.beginPath(); gg.arc(.6, -2.42, .2, 0, Math.PI * 2); gg.fillStyle = C.accentLt; gg.fill(); gg.globalAlpha = 1; }
      gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center';
      gg.save(); gg.translate(.6, -2.62); gg.scale(.003, .003); gg.fillText(D.name, 0, 0); gg.restore();
    });
    if (!D.exit) onPlane(g, D.x + 1.3, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = '#0F1A12'; gg.fillRect(0, -1.35, .14, .22); });
  });
}

function badge(x, y, z, col, band) {
  iso.box(x, y, z, .44, .32, .04, tri(col), { bias: -z - .1, cull: false, decal: (I, b) => {
    onPlane(g, b.x, b.y, b.z + b.h + .001, 'xy', gg => { gg.fillStyle = band; gg.fillRect(-b.d, 0, b.d, .1); });
  } });
}
function props(t) {
  const subj = tri(SUBJ, .25, .2);
  // HR desk: a box with a monitor; the screen glows accent while it is the source of truth
  const [kx, ky, kw, kd, kh] = KIOSK;
  const glow = ss(seg(t, PART[4] + .3, PART[4] + .8)) * (1 - ss(seg(t, PART[5] - .2, PART[5] + .2)));
  iso.box(kx, ky, 0, kw, kd, kh, tri('#D97757'), { bias: -kh / 2, decal: (I, b) => {
    onPlane(g, b.x + b.w + .001, b.y + b.d, b.z + .75, 'yz', gg => { gg.fillStyle = css(mix(SCREEN, C.accent, glow)); gg.fillRect(-.5, -.3, .4, .25); });
  } });
  iso.box(kx + .15, ky + .12, kh, .12, .36, .3, tri(css(mix(SCREEN, C.accent, glow)), .2, .2), { bias: -kh - .2 });
  onPlane(g, kx + kw + .02, ky + .3, 0, 'xy', gg => {});
  const out = eio(seg(t, T_PRINT, T_PRINT + .8)), taken = seg(t, T_TAKE, T_TAKE + .3);
  if (out > 0 && taken < 1) badge(kx + .14 + out * .2, ky + .14, kh, '#EEC677', C.accent);
  // turnstile
  const open = eio(seg(t, T_GATE, T_GATE + .7));
  POSTS.forEach(x => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#D97757'), { bias: -.5 }));
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(4.85, GATE_Y + .1, .1, leafW, .06, .8, tri('#00FF66', .1, .12), { bias: -.45 });
  const yes = ss(seg(t, T_SCAN + .1, T_SCAN + .35));
  iso.box(6.38, GATE_Y + .2, 1.0, .19, .22, .06, tri('#0F1A12'), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .06, 0, Math.PI * 2); gg.fillStyle = css(mix('#0F1A12', C.accent, yes)); gg.fill(); });
  } });
  for (let x = 0.6; x < 4.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 4.6 - x), .2, .9, subj, { bias: -.45 });
  for (let x = 6.6; x < 9.0; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 9.0 - x), .2, .9, subj, { bias: -.45 });
  // sync server: its lights turn accent when the HR change arrives
  const [sx, sy, sw, sd, sh] = SERVER, on = ss(seg(t, T_SRV, T_SRV + .3)) * (1 - ss(seg(t, PART[5] - .2, PART[5] + .2)));
  iso.box(sx, sy, 0, sw, sd, sh, tri('#0F1A12', .25, .2), { bias: -sh / 2, decal: (I, b) => {
    for (let k = 0; k < 5; k++) onPlane(g, b.x, b.y + b.d + .001, b.z + .3 + k * .26, 'xz', gg => { gg.fillStyle = '#D97757'; gg.fillRect(.08, -.06, b.w - .16, .05); gg.beginPath(); gg.arc(.14, -.15, .03, 0, 7); gg.fillStyle = css(mix('#80E5A9', C.accent, on)); gg.fill(); });
  } });
  // badge return tray, the returned badge sits in it
  const [tx, ty, tw, td, th] = TRAY;
  iso.box(tx, ty, 0, tw, td, th, tri('#D97757'), { bias: -th / 2 });
  iso.box(tx - .03, ty - .03, th, tw + .06, td + .06, .08, tri('#D97757'), { bias: -th - .1 });
  const drop = eio(seg(t, T_DROP - .3, T_DROP));
  if (drop > 0) badge(tx + .03, ty + .04, th + .08 + (1 - drop) * .5, '#EEC677', css(mix(C.accent, '#D97757', ss(seg(t, T_ALLOFF, T_ALLOFF + .3)))));
  iso.box(WALL_X + .4, 1.0, 0, .5, .5, .45, tri('#E0B575'), { bias: -.22 });
  iso.cone(WALL_X + .65, 1.25, .45, .38, 1.1, tri('#D97757', .2, .2), { n: 6 });
}

function people(t) {
  iso.bill(7.4, 3.4, 0, gg => drawPerson(gg, GUARD, {}));
  const p = priyaAt(t), a = 1 - ss(seg(t, T_GONE - .2, T_GONE + .3));
  if (a <= 0) return;
  iso.bill(p.x, p.y, 0, gg => { gg.globalAlpha = a; drawPerson(gg, PRIYA, { walking: p.walking, phase: phaseAt(t) }); });
}

// floor marks: accent ring at the gate when the new badge works, a pulse from HR desk to server, ring under the orphan door
function marks(g, t) {
  const r2 = ss(seg(t, T_SCAN + .1, T_SCAN + .4)) * (1 - ss(seg(t, T_GATE + 1.6, T_GATE + 2.1)));
  disc(g, 5.6, 5.4, .55, C.accentLt, r2 * .8); ring(g, 5.6, 5.4, .55, C.accent, r2);
  const r3 = ss(seg(t, T_ALLOFF, T_ALLOFF + .3)) * (1 - ss(seg(t, T_ALLOFF + 1.4, T_ALLOFF + 1.9)));
  ring(g, 4.95, 0.45, .6, C.ink, r3 * .8);
  // pulse: dotted track + travelling dot
  const tr = ss(seg(t, T_PULSE[0] - .3, T_PULSE[0])) * (1 - ss(seg(t, PART[5] - .3, PART[5])));
  const A = [3.4, 5.6], B = [4.1, 0.2];
  if (tr > 0) { for (let k = 0; k <= 12; k++) { const f = k / 12; disc(g, lerp(A[0], B[0], f), lerp(A[1], B[1], f), .05, C.accent, tr * .6); } }
  const f = seg(t, T_PULSE[0], T_PULSE[1]);
  if (f > 0 && f < 1) { const q = eio(f); disc(g, lerp(A[0], B[0], q), lerp(A[1], B[1], q), .2, C.accentLt, .9); disc(g, lerp(A[0], B[0], q), lerp(A[1], B[1], q), .11, C.accent, 1); }
  const o = ss(seg(t, v(44.05), v(44.4)));
  if (o > 0) { const pul = .5 + .5 * Math.sin((t - v(44)) * 5); ring(g, 2.6, -0.5, .4 + .08 * pul, C.accent, o); disc(g, 2.6, -0.5, .4, C.accentLt, o * .5); }
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 05', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Identity lifecycle: Joiner, Mover, Leaver', 78, 158);
  g.font = font(600, 21, 'Inter'); g.fillStyle = '#DFFFE6'; g.textAlign = 'right'; g.letterSpacing = '3px'; g.fillText('DEBUG DIARIES', W - 72, 112); g.letterSpacing = '0px';
  // subtitles: one cue at a time, hard switch
  g.textAlign = 'center';
  for (const s of SUBS) {
    if (t < s.t0 || t >= s.t1) continue;
    g.font = font(600, 42); const lines = wrap(g, s.text, 880), lh = 54, bottom = 1720, padY = 22;
    const tw = Math.max(...lines.map(l => g.measureText(l).width));
    const top = bottom - lines.length * lh - padY * 2 + 8;
    g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(W / 2 - tw / 2 - 30, top, tw + 60, bottom - top, 18); g.fill();
    g.fillStyle = C.ink; lines.forEach((l, i) => g.fillText(l, W / 2, top + padY + 38 + i * lh));
  }
  // footer
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 05/148', W / 2, 1808); g.letterSpacing = '0px';
  g.restore();
}

function render(g, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  iso.g = g; iso.cam = camAt(t);
  floor(g);
  marks(g, t);
  for (const P of PH) floorType(g, t, P, P.L);
  walls(g, t);
  props(t); people(t); iso.flush();
  overlay(g, t);
}

window.DUR = DUR; window.EV = EV;
window.render = t => { render(g, t); if (!window.__bc) { window.__bc = document.createElement("canvas"); window.__bc.width = W; window.__bc.height = H; } const bx = window.__bc.getContext("2d"); bx.clearRect(0, 0, W, H); bx.filter = "blur(12px)"; bx.drawImage(cv, 0, 0); bx.filter = "none"; g.save(); g.globalCompositeOperation = "screen"; g.globalAlpha = .75; g.drawImage(window.__bc, 0, 0); g.restore(); };
window.READY = true;
