// Access Granted 06 — "Privilege creep and orphan accounts"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 06/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-06/p1..p6.mp3
// Story: Priya walks through the gate to the wall of project doors; each new project lights one more door lamp and a key
// lands on her key stand, none ever goes dark (privilege creep, the stand piles up). Raj fades away but his LAB lamp
// stays lit with an alert ring and a shadow walks towards it (orphan account). An access-review sweep runs along the
// doors: the old lamps go dark together, the key pile drops to two, Raj's lamp goes dark and the shadow fades.
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.3, v = x => x + VO;
const PART = [0.06, 7.839, 15.161, 22.107, 30.584, 41.557].map(v), VEND = v(54.891);
const DUR = +(VEND + 1.25).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.352, 'A, an orphan account!'], [2.903, 'The person left, the account is still alive.'],
  [4.844, "Today's topic:"], [5.747, 'privilege creep'], [6.672, 'and orphan accounts.'],
  [7.839, 'Privilege creep.'], [8.982, 'For every new project, Priya asks for one more door.'], [11.921, 'The new access arrives,'],
  [13.364, 'but the old one never goes back.'],
  [15.161, 'Two years later,'], [16.209, 'her badge opens far more doors than her job needs.'], [18.591, 'Access slowly piled up:'],
  [20.482, 'that is privilege creep.'],
  [22.107, 'And the orphan account.'], [23.446, 'Raj left long ago,'], [24.774, 'but his door lamp is still lit.'],
  [26.669, 'No owner, nobody watching:'], [28.607, 'a perfect way in for an attacker.'],
  [30.584, 'In tech, the fix is the access review.'], [32.917, 'Every quarter, managers confirm who needs what,'],
  [35.747, 'the rest is revoked.'], [36.941, 'And with the HR feed,'], [37.865, "leavers' accounts are disabled automatically."],
  [41.557, 'Clearance check!'], [42.569, 'Priya gets only the access her job needs.'], [46.062, 'What is this principle called?'],
  [48.109, 'A, least privilege,'], [50.367, 'or B, zero trust?'], [52.16, 'Answer in the next reel.'], [53.359, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3, POSTS = [4.6, 6.35];
const DOORS = [{ x: -0.6, name: 'BILLING' }, { x: 0.8, name: 'DATA' }, { x: 2.2, name: 'DEPLOY' }, { x: 3.6, name: 'PAYROLL' },
  { x: 5.0, name: 'ENG' }, { x: 6.4, name: 'BUILD' }, { x: 8.6, name: 'LAB', raj: true }];
const STAND = [6.9, 0.6, 0.5, 0.5, 0.75];            // Priya's key stand: x, y, w, d, h
const SUBJ = '#D97757';
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.78, top: '#D97757', legs: LEGS[2] };
const RAJ = { h: 1.74, top: '#D97757', legs: LEGS[1] };
const SHADOW = { h: 1.76, top: '#0F1A12', legs: '#0F1A12' };

const T_SCAN = v(5.0), T_GATE = v(5.25);
const T_REVOKE = v(35.75), T_RAJOFF = v(38.6), T_RAJGONE = v(23.8);
const SWEEP = [v(33.0), v(35.6)];
// lamp windows per door: [on, off]
const LAMPS = [
  [[v(9.6), T_REVOKE]], [[v(10.8), T_REVOKE]], [[v(12.1), T_REVOKE]], [[v(16.4), T_REVOKE]],
  [[v(17.2), 999]], [[v(18.0), 999]], [[0, T_RAJOFF]],
];
const KEYS = [ // [t, x, y]  ~1.5 m/s, away from the camera
  [0, 5.6, 8.6], [v(2.6), 5.6, 8.6], [v(4.8), 5.6, 5.6],
  [v(5.6), 5.6, 5.6], [v(8.4), 5.6, 1.2], [v(9.2), 5.6, 1.2], [v(10.6), 3.6, 1.0],
  [v(16.0), 3.6, 1.0], [v(17.5), 6.0, 1.2], [DUR, 6.0, 1.2]];
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
  [0, 6.0, -1.2, 80], [v(4.6), 5.0, 0.4, 82], [v(8.6), 3.6, 3.2, 76],
  [v(14.6), 3.4, 2.6, 74], [v(20.6), 3.4, 3.4, 70], [v(22.8), 4.2, 8.6, 78],
  [v(29.8), 4.2, 9.0, 80], [v(31.6), 3.6, 4.4, 70], [v(40.8), 3.6, 4.6, 70], [v(43.0), 3.6, 4.0, 72], [DUR, 3.6, 4.0, 76]];
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
  { t0: v(0.4), at: v(2.0), lines: [[['answer: ', 'n'], ['orphan', 'na']]], gap: .25 },
  { t0: v(4.9), at: v(6.6), lines: [[['privilege ', 'n'], ['creep', 'na']], [['& orphan accounts', 'ns']]], l2: v(6.672) },
  { t0: v(8.0), at: v(11.5), lines: [[['new door, ', 'n'], ['yes', 'na']]], gap: .25 },
  { t0: v(13.4), at: v(14.2), lines: [[['old door never back', 'ns']]], gap: .25 },
  { t0: v(15.3), at: v(19.0), lines: [[['access ', 'n'], ['piles up', 'na']], [['= privilege creep', 'ns']]], l2: v(20.482) },
  { t0: v(22.3), at: v(25.5), lines: [[['owner ', 'n'], ['gone', 'na']], [['lamp still on', 'ns']]], l2: v(24.9) },
  { t0: v(28.6), at: v(29.4), lines: [[['perfect ', 'n'], ['entry', 'na']]], gap: .25 },
  { t0: v(30.7), at: v(34.0), lines: [[['access ', 'n'], ['review', 'na']], [['keep what is needed', 'ns']]], l2: v(32.917) },
  { t0: v(37.0), at: v(39.0), lines: [[['leaver = ', 'n'], ['disabled', 'na']]], gap: .25 },
  { t0: v(41.7), at: v(47.0), lines: [[['least ', 'n'], ['privilege', 'na']], [['or zero trust?', 'ns']]], l2: v(50.367) },
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
E(T_SCAN, 'beep'); E(T_GATE, 'gate');
LAMPS.forEach(ws => ws.forEach(([on]) => { if (on > 0.5 && on < 900) { E(on, 'lamp'); E(on + .25, 'tick'); } }));
E(v(24.8), 'beep'); E(v(28.7), 'step'); E(v(29.3), 'step');
E(SWEEP[0], 'slide'); E(T_REVOKE, 'lock'); E(T_RAJOFF, 'lock');
E(v(48.723), 'tick'); E(v(51.059), 'tick');
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

function lampLit(i, t) { let a = 0; for (const [on, off] of LAMPS[i]) a = Math.max(a, (on < .5 ? 1 : ss(seg(t, on, on + .3))) * (1 - ss(seg(t, off, off + .25)))); return a; }
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri(WALLC, .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri(WALLC, .1, .12));
  for (const y0 of [2, 6, 10, 14]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = '#00FF66'; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = '#0F1A12'; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  // the review sweep: a green bar travelling along the door row
  const sw = seg(t, SWEEP[0], SWEEP[1]);
  DOORS.forEach((D, i) => {
    const lit = lampLit(i, t);
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = D.raj ? hex(mix('#0F1A12', DOORC, .55)) : DOORC; gg.fillRect(0, -2.15, 1.2, 2.15);
      gg.fillStyle = '#0F1A12'; gg.fillRect(1.0, -1.2, .08, .3);
      const lc = D.raj ? C.accent : '#00FF66';
      gg.beginPath(); gg.arc(.6, -2.42, .11, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, lc, lit)); gg.fill();
      if (lit > .01) { gg.globalAlpha = lit * .4; gg.beginPath(); gg.arc(.6, -2.42, .22, 0, Math.PI * 2); gg.fillStyle = lc; gg.fill(); gg.globalAlpha = 1; }
      gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center';
      gg.save(); gg.translate(.6, -2.64); gg.scale(.0026, .0026); gg.fillText(D.name, 0, 0); gg.restore();
    });
  });
  if (sw > 0 && sw < 1) { const x = lerp(-1.0, 7.8, eio(sw)); onPlane(g, x, WALL_Y + .003, 0, 'xz', gg => { gg.globalAlpha = .85; gg.fillStyle = '#00FF66'; gg.fillRect(-.05, -2.8, .1, 2.8); }); }
}

function props(t) {
  // turnstile
  const open = eio(seg(t, T_GATE, T_GATE + .7)) * (1 - eio(seg(t, v(8.6), v(9.3))));
  POSTS.forEach(x => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#D97757'), { bias: -.5 }));
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(4.85, GATE_Y + .1, .1, leafW, .06, .8, tri('#00FF66', .1, .12), { bias: -.45 });
  const yes = ss(seg(t, T_SCAN + .1, T_SCAN + .35)) * (1 - ss(seg(t, v(8), v(8.4))));
  iso.box(6.38, GATE_Y + .2, 1.0, .19, .22, .06, tri('#0F1A12'), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .06, 0, Math.PI * 2); gg.fillStyle = css(mix('#0F1A12', '#00FF66', yes)); gg.fill(); });
  } });
  for (let x = 0.6; x < 4.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 4.6 - x), .2, .9, tri(SUBJ, .25, .2), { bias: -.45 });
  for (let x = 6.6; x < 9.0; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 9.0 - x), .2, .9, tri(SUBJ, .25, .2), { bias: -.45 });
  // Priya's key stand: one key tag per lit door of hers; the pile grows, then drops to two at the review
  const [kx, ky, kw, kd, kh] = STAND;
  iso.box(kx, ky, 0, kw, kd, kh, tri('#0F1A12', .25, .2), { bias: -kh / 2 });
  let z = kh;
  for (let i = 0; i < 6; i++) {
    const a = lampLit(i, t); if (a <= .02) continue;
    const hgt = .11 * a;
    iso.box(kx + .06 + (i % 2) * .04, ky + .06, z, .38, .34, hgt, tri(i < 4 ? '#D97757' : '#EEC677', .2, .25), { bias: -z - .2, cull: false });
    z += hgt + .015;
  }
  // a plant by the side wall
  iso.box(WALL_X + .4, 1.0, 0, .5, .5, .45, tri('#0F1A12'), { bias: -.22 });
  iso.cone(WALL_X + .65, 1.25, .45, .38, 1.1, tri('#00FF66', .2, .3), { n: 6 });
}

function people(t) {
  iso.bill(7.4, 3.4, 0, gg => drawPerson(gg, GUARD, {}));
  const ra = 1 - ss(seg(t, T_RAJGONE, T_RAJGONE + .8));
  if (ra > 0) iso.bill(9.2, 0.6, 0, gg => { gg.globalAlpha = ra; drawPerson(gg, RAJ, {}); });
  // the shadow walks towards the orphan door, then fades when the lamp goes dark
  const sa = ss(seg(t, v(28.0), v(28.6))) * (1 - ss(seg(t, T_RAJOFF, T_RAJOFF + .6)));
  if (sa > 0) { const f = eio(seg(t, v(28.4), v(30.2))); iso.bill(lerp(11.2, 9.6, f), lerp(3.4, 0.8, f), 0, gg => { gg.globalAlpha = sa * .9; drawPerson(gg, SHADOW, { walking: f > 0 && f < 1, phase: t * 8 }); }); }
  const p = priyaAt(t);
  iso.bill(p.x, p.y, 0, gg => drawPerson(gg, PRIYA, { walking: p.walking, phase: phaseAt(t) }));
}

// floor marks: green ring at the gate, orange alert ring under the orphan door, green ring at the key stand after review
function marks(g, t) {
  const r2 = ss(seg(t, T_SCAN + .1, T_SCAN + .4)) * (1 - ss(seg(t, T_GATE + 1.6, T_GATE + 2.1)));
  disc(g, 5.6, 5.6, .55, '#00FF66', r2 * .5); ring(g, 5.6, 5.6, .55, '#00FF66', r2);
  const o = ss(seg(t, v(24.8), v(25.2))) * (1 - ss(seg(t, T_RAJOFF, T_RAJOFF + .4)));
  if (o > 0) { const pul = .5 + .5 * Math.sin((t - v(24.8)) * 5); ring(g, 9.2, -0.5, .45 + .08 * pul, C.accent, o); disc(g, 9.2, -0.5, .45, C.accent, o * .35); }
  const k = ss(seg(t, T_REVOKE + .3, T_REVOKE + .6));
  ring(g, 7.15, 0.85, .6, '#00FF66', k);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 06', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Privilege creep and orphan accounts', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 06/148', W / 2, 1808); g.letterSpacing = '0px';
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
