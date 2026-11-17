// Access Granted 07 — "Least privilege and need-to-know"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 07/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-07/p1..p6.mp3
// Story: Priya badges through the gate to a wall of department doors; only FINANCE and PRINT light green for her,
// the other lamps flash orange (denied). Need-to-know: at the file cabinets only her own drawer slides open.
// Tech: a backup bot gets one key for one bucket instead of rings over every bucket; when its key leaks, only that
// one bucket pulses orange (small blast radius). Quiz: separation of duties vs single sign-on.
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.8, v = x => x + VO;
const PART = [0.06, 6.855, 13.351, 19.529, 26.015, 34.935].map(v), VEND = v(46.804);
const DUR = +(VEND + 2.5).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.406, 'A, least privilege!'], [3.321, "And today's topic is exactly that:"], [4.906, 'least privilege and need-to-know.'],
  [6.855, 'Least privilege means'], [8.172, 'every identity gets only the access'], [10.314, 'its job actually needs.'], [12.021, 'Not one door more.'],
  [13.351, 'Priya works in finance.'], [14.478, 'Her badge opens the finance floor and the printer room.'], [17.269, 'The server room and HR?'], [18.967, 'No.'],
  [19.529, 'Need-to-know'], [20.32, 'is even narrower.'], [21.41, 'Even on the finance floor,'], [22.736, "Priya can open only her own clients' files,"], [25.257, "not everyone's."],
  [26.015, 'In tech:'], [26.863, "don't make a backup script admin of the whole cloud."], [29.646, 'Give it write permission'], [31.599, 'on just one bucket.'], [32.658, 'If the key leaks,'], [33.717, 'the damage stays small too.'],
  [34.935, 'Clearance check!'], [35.966, 'One person creates a payment and approves it too.'], [38.742, 'Which principle stops that?'], [40.308, 'A, separation of duties,'], [42.048, 'or B, single sign-on?'],
  [43.944, 'Answer in the next reel.'], [45.232, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3, POSTS = [4.6, 6.35];
const DOORS = [{ x: -0.6, name: 'SERVER' }, { x: 0.8, name: 'HR' }, { x: 2.2, name: 'FINANCE', mine: true },
  { x: 3.6, name: 'PRINT', mine: true }, { x: 5.0, name: 'ENG' }, { x: 6.4, name: 'LEGAL' }];
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12';
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.78, top: '#D97757', legs: LEGS[2] };

const T_SCAN = v(1.8), T_GATE = v(2.0);
const GRANT = { 2: v(8.4), 3: v(9.3) };                       // green lamps: FINANCE, PRINT
const DENY = [[4, v(12.0)], [5, v(12.2)], [0, v(17.27)], [1, v(17.45)]]; // orange flashes
const CAB = [{ y: 0.3 }, { y: 1.3, mine: true }, { y: 2.3 }];     // file cabinets along the side wall
const CABX = WALL_X + .15, T_DRAWER = v(22.9), T_OTHERS = v(25.25);
const BUCKETS = [7.4, 8.3, 9.2, 10.1], BUCK_Y = 1.6, MINE_B = 1;
const BOT = [9.0, 3.6];
const T_ALL = v(26.9), T_KEY = [v(29.7), v(31.5)], T_LEAK = v(32.7), T_SMALL = v(33.7);
const KEYS = [
  [0, 5.6, 8.4], [v(0.05), 5.6, 8.4], [v(1.8), 5.6, 5.8], [v(2.5), 5.6, 5.8], [v(5.3), 5.6, 1.6],
  [v(13.6), 5.6, 1.6], [v(15.7), 2.8, 0.4], [v(19.7), 2.8, 0.4], [v(22.5), -1.0, 1.8], [DUR, -1.0, 1.8]];
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
  [0, 6.0, -1.2, 80], [v(3.2), 5.0, 0.4, 80], [v(7.0), 2.9, 2.2, 66], [v(12.6), 2.9, 2.2, 66],
  [v(14.2), 2.0, 2.4, 74], [v(19.2), 2.0, 2.4, 74], [v(21.4), 0.7, -3.4, 78], [v(25.6), 0.7, -3.4, 78],
  [v(26.6), 5.3, 6.6, 72], [v(34.4), 5.3, 6.6, 72], [v(35.6), 3.4, 2.6, 64], [DUR, 3.4, 2.6, 68]];
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
  { t0: v(0.4), at: v(2.0), lines: [[['answer: ', 'n'], ['least privilege', 'na']]], gap: .25 },
  { t0: v(4.0), at: v(5.4), lines: [[['+ ', 'n'], ['need-to-know', 'na']]], gap: .25 },
  { t0: v(7.6), dy: 95, at: v(10.0), lines: [[['only what the job ', 'n'], ['needs', 'na']], [['not one door more', 'ns']]], l2: v(12.021) },
  { t0: v(14.4), dy: 95, at: v(16.0), lines: [[['finance: ', 'n'], ['yes', 'na']], [['server · HR: no', 'ns']]], l2: v(17.3) },
  { t0: v(20.0), dy: 95, dx: -150, at: v(22.6), lines: [[['need-', 'n'], ['to-know', 'na']], [['only her clients', 'ns']]], l2: v(22.8) },
  { t0: v(26.9), at: v(28.0), lines: [[['not ', 'n'], ['admin', 'na'], [' of all', 'n']]], gap: .25 },
  { t0: v(29.8), at: v(31.0), lines: [[['one ', 'n'], ['bucket', 'na'], [' only', 'n']]], gap: .25 },
  { t0: v(32.8), at: v(33.6), lines: [[['small ', 'n'], ['blast radius', 'na']]], gap: .25 },
  { t0: v(36.0), at: v(40.0), lines: [[['separation of ', 'n'], ['duties', 'na']], [['or single sign-on?', 'ns']]], l2: v(42.05) },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1290;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .12, scale: .74, dv: 1.7, indent: .4 });
  let L = phraseLayout({ ...P, lineGap: 0 });
  if (P.l2) { const end0 = Math.max(...L.filter(c => c.li === 0).map(c => c.tc)); P.lineGap = Math.max(.2, P.l2 - end0); } else P.lineGap = P.gap;
  L = phraseLayout(P);
  iso.cam = camAt(P.at);
  const [x0, x1, y0, y1] = phraseWorld(P, L), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const [tx, ty] = iso.unP(W / 2 + 50 + (P.dx || 0), SCREEN_Y + (P.dy || 0), 0);
  P.x = tx - cx; P.y = ty - cy; P.L = L;
}

// ---------- events (sound) ----------
const EV = [];
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
PART.forEach((t, i) => E(Math.max(0, t - .05), 'chord', { i }));
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
{ let lastStep = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = priyaAt(t); if (!p.walking) continue; const n = Math.floor(phaseAt(t) / Math.PI); if (n !== lastStep) { if (lastStep >= 0) E(t, 'step'); lastStep = n; } } }
E(T_SCAN, 'beep'); E(T_GATE, 'gate');
Object.values(GRANT).forEach(t => { E(t, 'lamp'); E(t + .25, 'tick'); });
DENY.forEach(([, t]) => E(t, 'lock'));
E(T_DRAWER, 'slide'); E(T_OTHERS, 'lock');
E(T_ALL, 'beep'); E(T_KEY[0], 'slide'); E(T_KEY[1], 'lamp'); E(T_LEAK, 'beep'); E(T_SMALL, 'lock');
E(v(40.4), 'tick'); E(v(42.1), 'tick');
EV.sort((a, b) => a.t - b.t);

// ---------- drawing helpers ----------
const FLOOR = '#020403', FLOOR_LINE = '#0B2412', BEYOND = '#000000';
const WALLC = '#0A100C', DOORC = '#00FF66';
function floor(g) {
  { const _g = g.createLinearGradient(0, 0, W * .35, H); _g.addColorStop(0, BEYOND); _g.addColorStop(1, '#00CC54'); g.fillStyle = _g; g.fillRect(0, 0, W, H); }
  const P = (x, y) => iso.P(x, y, 0);
  fillPoly(g, [P(WALL_X, WALL_Y), P(60, WALL_Y), P(60, 60), P(WALL_X, 60)], FLOOR);
  g.save(); g.strokeStyle = FLOOR_LINE; g.lineWidth = 1.5;
  for (let x = WALL_X; x < 40; x += 1.5) { const a = P(x, WALL_Y), b = P(x, 40); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  for (let y = WALL_Y; y < 40; y += 1.5) { const a = P(WALL_X, y), b = P(40, y); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  g.restore();
}
function disc(g, x, y, r, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); }); }
function ring(g, x, y, r, col, a, lw = .07) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.strokeStyle = col; gg.lineWidth = lw; gg.stroke(); }); }

function lampLit(i, t) { return GRANT[i] ? ss(seg(t, GRANT[i], GRANT[i] + .3)) : 0; }
function lampDeny(i, t) { let a = 0; for (const [j, t0] of DENY) if (j === i) a = Math.max(a, ss(seg(t, t0, t0 + .15)) * (1 - ss(seg(t, t0 + 2.4, t0 + 2.8)))); return a; }
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [4.5, 8.5, 12.5]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  DOORS.forEach((D, i) => {
    const lit = lampLit(i, t), den = lampDeny(i, t);
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = D.mine ? GREEN : hex(mix(DARK, GREEN, .45)); gg.fillRect(0, -2.15, 1.2, 2.15);
      gg.fillStyle = DARK; gg.fillRect(1.0, -1.2, .08, .3);
      let col = mix(C.ghost, GREEN, lit); if (den > 0) col = mix(col, C.accent, den);
      gg.beginPath(); gg.arc(.6, -2.42, .11, 0, Math.PI * 2); gg.fillStyle = css(col); gg.fill();
      const glow = Math.max(lit, den);
      if (glow > .01) { gg.globalAlpha = glow * .4; gg.beginPath(); gg.arc(.6, -2.42, .22, 0, Math.PI * 2); gg.fillStyle = den > lit ? C.accent : GREEN; gg.fill(); gg.globalAlpha = 1; }
      if (den > .01) { gg.globalAlpha = den; gg.strokeStyle = C.accent; gg.lineWidth = .1; gg.beginPath(); gg.moveTo(.3, -1.4); gg.lineTo(.9, -.8); gg.moveTo(.9, -1.4); gg.lineTo(.3, -.8); gg.stroke(); gg.globalAlpha = 1; }
      gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center';
      gg.save(); gg.translate(.6, -2.64); gg.scale(.0026, .0026); gg.fillText(D.name, 0, 0); gg.restore();
    });
  });
  // the server rack on the far wall, right of the doors
  onPlane(g, 8.0, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = '#D97757'; gg.fillRect(0, -.24, 2.6, .08); gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center'; gg.save(); gg.translate(1.3, -2.3); gg.scale(.0026, .0026); gg.fillText('CLOUD', 0, 0); gg.restore(); });
}

function props(t) {
  // turnstile
  const open = eio(seg(t, T_GATE, T_GATE + .7)) * (1 - eio(seg(t, v(5.6), v(6.3))));
  POSTS.forEach(x => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#D97757'), { bias: -.5 }));
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(4.85, GATE_Y + .1, .1, leafW, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  const yes = ss(seg(t, T_SCAN + .1, T_SCAN + .35)) * (1 - ss(seg(t, v(5), v(5.4))));
  iso.box(6.38, GATE_Y + .2, 1.0, .19, .22, .06, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .06, 0, Math.PI * 2); gg.fillStyle = css(mix(DARK, GREEN, yes)); gg.fill(); });
  } });
  for (let x = 3.6; x < 4.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 4.6 - x), .2, .9, tri(SUBJ, .25, .2), { bias: -.45 });
  for (let x = 6.6; x < 7.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 7.6 - x), .2, .9, tri(SUBJ, .25, .2), { bias: -.45 });
  // file cabinets along the side wall; only Priya's drawer slides out (need-to-know)
  CAB.forEach((c, i) => {
    iso.box(CABX, c.y, 0, .6, .8, 1.1, tri(DARK, .25, .2), { bias: -.55 });
    const out = c.mine ? eio(seg(t, T_DRAWER, T_DRAWER + .5)) : 0;
    const col = c.mine ? (out > .05 ? GREEN : SUBJ) : SUBJ;
    iso.box(CABX + .6 + out * .35 - .02, c.y + .1, .62, .06, .6, .3, tri(col, .2, .25), { bias: -.6 });
    if (!c.mine) { const no = ss(seg(t, T_OTHERS, T_OTHERS + .2)); if (no > 0) iso.box(CABX + .62, c.y + .32, .3, .04, .16, .16, tri(SUBJ, .3, .2), { bias: -.6 }); }
    if (c.mine && out > .05) iso.box(CABX + .7 + out * .2, c.y + .2, .95, .3, .4, .04, tri('#DFFFE6', .1, .2), { bias: -1, cull: false });
  });
  // the cloud: server box + four buckets, and the backup bot
  iso.box(8.4, -1.1, 0, 1.8, .7, 1.7, tri(DARK, .25, .2), { bias: -.85, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { for (let r = 0; r < 4; r++) for (let k = 0; k < 6; k++) { gg.fillStyle = (r + k + Math.floor(t * 3)) % 4 ? '#0B2412' : GREEN; gg.fillRect(.2 + k * .25, -1.5 + r * .32, .12, .08); } });
  } });
  BUCKETS.forEach((x, i) => {
    const mine = i === MINE_B;
    const c = mine && t > T_KEY[1] ? (t > T_SMALL ? SUBJ : GREEN) : '#1E3A26';
    iso.box(x, BUCK_Y, 0, .5, .5, .6, tri(c, .2, .3), { bias: -.3 });
  });
  if (t > v(26.0)) iso.box(BOT[0], BOT[1], 0, .55, .55, .55 * eo(seg(t, v(26.0), v(26.5))) + .001, tri(t > T_LEAK ? SUBJ : '#D97757', .2, .3), { bias: -.3, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.fillStyle = t > T_LEAK ? '#FFCC66' : GREEN; gg.beginPath(); gg.arc(-.1, 0, .06, 0, Math.PI * 2); gg.arc(.1, 0, .06, 0, Math.PI * 2); gg.fill(); });
  } });
  // the one key flies from the bot to its bucket
  const kf = eio(seg(t, T_KEY[0], T_KEY[1]));
  if (t > T_KEY[0] - .3) {
    const bx = BUCKETS[MINE_B] + .25, kx = lerp(BOT[0] + .2, bx - .1, kf), ky = lerp(BOT[1] + .2, BUCK_Y + .9, kf), kz = .65 + Math.sin(kf * Math.PI) * .6;
    iso.box(kx, ky, kz, .22, .12, .1, tri(t > T_LEAK ? SUBJ : GREEN, .2, .25), { bias: -2, cull: false });
  }
  iso.box(WALL_X + .4, 3.6, 0, .5, .5, .45, tri(DARK), { bias: -.22 });
  iso.cone(WALL_X + .65, 3.85, .45, .38, 1.1, tri(GREEN, .2, .3), { n: 6 });
}

function people(t) {
  iso.bill(7.4, 3.4, 0, gg => drawPerson(gg, GUARD, {}));
  const p = priyaAt(t);
  iso.bill(p.x, p.y, 0, gg => drawPerson(gg, PRIYA, { walking: p.walking, phase: phaseAt(t) }));
}

function marks(g, t) {
  const r2 = ss(seg(t, T_SCAN + .1, T_SCAN + .4)) * (1 - ss(seg(t, T_GATE + 1.6, T_GATE + 2.1)));
  disc(g, 5.6, 5.6, .55, GREEN, r2 * .5); ring(g, 5.6, 5.6, .55, GREEN, r2);
  // finance yes: green ring in front of her door
  const f = ss(seg(t, v(14.5), v(14.8))) * (1 - ss(seg(t, v(19.4), v(19.8))));
  ring(g, 2.8, 0.4, .6, GREEN, f);
  // need-to-know: green ring at her drawer
  const d = ss(seg(t, T_DRAWER, T_DRAWER + .3)) * (1 - ss(seg(t, v(26.0), v(26.4))));
  ring(g, CABX + 1.3, CAB[1].y + .4, .45, GREEN, d);
  // whole cloud admin: orange rings on every bucket, then only one green ring
  const all = ss(seg(t, T_ALL, T_ALL + .3)) * (1 - ss(seg(t, v(29.3), v(29.7))));
  BUCKETS.forEach((x, i) => { if (all > 0) { const pul = .5 + .5 * Math.sin((t - T_ALL) * 5 + i); ring(g, x + .25, BUCK_Y + .25, .5 + .06 * pul, C.accent, all); } });
  const one = ss(seg(t, T_KEY[1], T_KEY[1] + .3)) * (1 - ss(seg(t, v(35.0), v(35.4))));
  if (one > 0) { const bx = BUCKETS[MINE_B] + .25, c = t > T_SMALL ? C.accent : GREEN; const pul = t > T_SMALL ? .5 + .5 * Math.sin((t - T_SMALL) * 6) : 0; ring(g, bx, BUCK_Y + .25, .5 + .08 * pul, c, one); disc(g, bx, BUCK_Y + .25, .5, c, one * .3); }
  // the others stay safe: small green discs after the leak
  const safe = ss(seg(t, T_SMALL + .2, T_SMALL + .5)) * (1 - ss(seg(t, v(35.0), v(35.4))));
  BUCKETS.forEach((x, i) => { if (i !== MINE_B) disc(g, x + .25, BUCK_Y + .25, .45, GREEN, safe * .35); });
  const lk = ss(seg(t, T_LEAK, T_LEAK + .2)) * (1 - ss(seg(t, v(35.0), v(35.4))));
  ring(g, BOT[0] + .27, BOT[1] + .27, .55, C.accent, lk);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 07', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Least privilege and need-to-know', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 07/148', W / 2, 1808); g.letterSpacing = '0px';
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
