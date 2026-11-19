// Access Granted 09 — "Defense in depth: where IAM fits in security"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 09/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-09/p1..p6.mp3
// Story: three layer rings bloom around Priya (quiz answer). An intruder slips past a failing gate reader but the guard
// stops him (one layer fails, the next holds). Priya walks the lobby: badge gate → guard → floor-door lock → camera, each
// layer lamp lighting in turn. IAM corner: an MFA gate, a row of doors where only one is hers, and a LOGS server.
// Tech example: an attacker with Priya's leaked key is denied at MFA; even after a bypass only one door opens and the
// LOGS alert flashes. Quiz: a CI box holding a badge next to a person (human vs non-human identity).
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 5.315, 12.063, 20.012, 27.186, 37.423].map(v), VEND = v(47.459);
const DUR = +(VEND + 2.5).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.406, 'A, defense in depth!'], [2.813, "Today let's see"], [3.896, 'how it actually works.'],
  [5.315, 'Defense in depth means'], [6.901, 'not one wall of security,'], [8.747, 'but many layers.'], [9.58, 'If one layer fails,'], [10.73, 'the next one stops it.'],
  [12.063, 'Think of the office lobby.'], [13.239, 'First, a badge at the gate,'], [14.389, 'then the guard checks,'], [16.082, 'then every floor door has its own lock,'], [18.089, 'and a camera records everything.'],
  [20.012, 'IAM gives you several layers here:'], [22.095, 'MFA at login,'], [23.462, 'least privilege on the doors,'], [24.987, 'and logs that record every access.'],
  [27.186, 'Tech example:'], [28.262, "Priya's password leaked."], [29.754, 'MFA stopped it.'], [30.927, 'Even if MFA were bypassed,'], [32.391, 'least privilege keeps the damage small,'], [34.904, 'and alerts tell the team.'],
  [37.423, 'Clearance check!'], [38.354, "A CI pipeline's service account:"], [40.277, 'what kind of identity is it?'], [41.665, 'A, human, or B, non-human?'],
  [43.437, 'Answer in the next reel.'], [45.348, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12';
const FDOOR = { x: 1.6, w: 1.8 };
const ROOMS = [{ x: 11.4, w: 1.1, n: 'HR' }, { x: 12.75, w: 1.1, n: 'DOCS' }, { x: 14.1, w: 1.1, n: 'DB' }];
const SRV = { x: 15.7, y: -1.15, w: 1.3, d: .7, h: 1.6 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const INTR = { h: 1.76, top: '#FFFFFF', legs: LEGS[2] };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const ATT = { h: 1.74, top: '#FFFFFF', legs: LEGS[1] };
const DEV = { h: 1.70, top: TOPS[1], legs: LEGS[1] };

// lobby beats
const T_RINGS = [v(1.4), v(1.9), v(2.4)];
const T_FAIL = v(9.7), T_STOP = v(10.9);
const T_L1 = v(13.5), T_L2 = v(14.6), T_L3 = v(16.3), T_DOPEN = v(17.0), T_L4 = v(18.2);
// IAM corner beats
const T_MFA = v(22.2), T_LP = v(23.6), T_LOG = v(25.1);
const T_DENY = v(29.9), T_BYP = v(31.1), T_ONE = v(33.0), T_ALERT = v(35.0);
// quiz
const T_CI = v(38.6), T_BADGE = v(39.4), T_Q = v(41.8);

function walker(keys) {
  return t => {
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, x0, y0] = keys[i], [t1, x1, y1] = keys[i + 1];
      if (t <= t1) {
        const moving = Math.hypot(x1 - x0, y1 - y0) > 0, f = clamp((t - t0) / (t1 - t0));
        const e = moving ? eio(f) : 0;
        const x = lerp(x0, x1, e), y = lerp(y0, y1, e);
        let L = 0; for (let j = 0; j < i; j++) L += Math.hypot(keys[j + 1][1] - keys[j][1], keys[j + 1][2] - keys[j][2]);
        L += Math.hypot(x - x0, y - y0);
        return { x, y, walking: moving && f > 0 && f < 1, phase: L / .72 * Math.PI };
      }
    }
    const k = keys[keys.length - 1]; return { x: k[1], y: k[2], walking: false, phase: 0 };
  };
}
const PEOPLE = [
  [PRIYA, walker([[0, 2.4, 6.4], [v(12.6), 2.4, 6.4], [v(14.4), 2.4, 3.6], [v(15.4), 2.4, 3.6], [v(17.4), 2.4, -0.5], [DUR, 2.4, -0.5]])],
  [GUARD, walker([[0, 1.15, 3.1], [DUR, 1.15, 3.1]])],
  [INTR, walker([[0, 0.1, 7.2], [v(8.3), 0.1, 7.2], [v(10.6), 0.1, 3.6], [DUR, 0.1, 3.6]])],
  [ATT, walker([[0, 12.2, 7.2], [v(27.6), 12.2, 7.2], [v(29.6), 12.2, 5.0], [T_BYP + .5, 12.2, 5.0], [v(33.0), 13.3, 0.5], [DUR, 13.3, 0.5]])],
  [DEV, walker([[0, 23.6, 2.6], [DUR, 23.6, 2.6]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 2.4, -1.6, 80], [v(11.6), 2.4, -1.6, 82], [v(19.4), 2.3, -1.4, 86],
  [v(20.6), 8.3, 11.4, 76], [v(36.8), 8.3, 11.4, 76], [v(38.0), 12.0, 21.0, 86], [DUR, 12.0, 21.0, 82]];
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
  { t0: v(0.4), at: v(2.0), lines: [[['answer: ', 'n'], ['defense', 'na']], [['in depth', 'ns']]], l2: v(2.4) },
  { t0: v(5.4), at: v(7.6), lines: [[['not one wall', 'n']], [['many ', 'ns'], ['layers', 'nsa']]], l2: v(8.8) },
  { t0: v(9.6), at: v(10.8), lines: [[['one fails, next ', 'n'], ['stops', 'na']]], gap: .25 },
  { t0: v(12.2), dy: 90, at: v(14.5), lines: [[['badge', 'na'], [' · guard', 'n']], [['· lock · camera', 'ns']]], l2: v(16.1) },
  { t0: v(20.4), at: v(23.0), lines: [[['IAM', 'na'], [' layers', 'n']], [['MFA · least privilege · logs', 'ns']]], l2: v(22.1) },
  { t0: v(27.3), at: v(29.5), lines: [[['password ', 'n'], ['leaked', 'na']]], gap: .25 },
  { t0: v(30.9), at: v(33.0), lines: [[['MFA bypassed?', 'n']], [['damage stays ', 'ns'], ['small', 'nsa']]], l2: v(32.4) },
  { t0: v(34.9), at: v(35.8), lines: [[['alert', 'na'], [' the team', 'n']]], gap: .25 },
  { t0: v(38.3), at: v(40.0), lines: [[['CI service ', 'n'], ['account', 'na']]], gap: .25 },
  { t0: v(41.6), at: v(43.0), lines: [[['human', 'na'], [' or non-human?', 'n']]], gap: .25 },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1300;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .12, scale: .56, dv: 1.7, indent: .4 });
  let L = phraseLayout({ ...P, lineGap: 0 });
  if (P.l2) { const end0 = Math.max(...L.filter(c => c.li === 0).map(c => c.tc)); P.lineGap = Math.max(.2, P.l2 - end0); } else P.lineGap = P.gap;
  L = phraseLayout(P);
  iso.cam = camAt(P.at);
  const [x0, x1, y0, y1] = phraseWorld(P, L), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const [tx, ty] = iso.unP(W / 2 + (P.dx || 0), SCREEN_Y + (P.dy || 0), 0);
  P.x = tx - cx; P.y = ty - cy; P.L = L;
}

// ---------- events (sound) ----------
const EV = [];
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
PART.forEach((t, i) => E(Math.max(0, t - .05), 'chord', { i }));
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
for (const [, w] of PEOPLE) { let last = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = w(t); if (!p.walking) { last = -1; continue; } const n = Math.floor(p.phase / Math.PI); if (n !== last) { if (last >= 0) E(t, 'step'); last = n; } } }
T_RINGS.forEach(t => E(t, 'lamp'));
E(T_FAIL, 'deny'); E(T_FAIL + .3, 'gate'); E(T_STOP, 'lock');
E(T_L1, 'beep'); E(T_L1 + .1, 'gate'); E(T_L2, 'lamp'); E(T_L3, 'beep'); E(T_DOPEN, 'door'); E(T_L4, 'lamp');
E(T_MFA, 'beep'); E(T_LP, 'lamp'); E(T_LOG, 'tick');
E(T_DENY, 'deny'); E(T_BYP, 'gate'); E(T_ONE, 'lamp'); E(T_ONE + .3, 'lock'); E(T_ALERT, 'deny'); E(T_ALERT + .6, 'deny');
E(T_CI, 'slide'); E(T_BADGE, 'beep'); E(T_Q, 'tick'); E(T_Q + .6, 'tick');
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

const on = (t, ranges) => { let a = 0; for (const [t0, t1] of ranges) a = Math.max(a, ss(seg(t, t0, t0 + .3)) * (1 - ss(seg(t, t1 - .3, t1)))); return a; };
function lamp(gg, x, y, lit, den) {
  let col = mix(C.ghost, GREEN, lit); if (den > 0) col = mix(col, C.accent, den);
  gg.beginPath(); gg.arc(x, y, .13, 0, Math.PI * 2); gg.fillStyle = css(col); gg.fill();
  const glow = Math.max(lit, den);
  if (glow > .01) { gg.globalAlpha = glow * .4; gg.beginPath(); gg.arc(x, y, .26, 0, Math.PI * 2); gg.fillStyle = den > lit ? C.accent : GREEN; gg.fill(); gg.globalAlpha = 1; }
}
function label(gg, s, x, y, sc = .0026) { gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center'; gg.save(); gg.translate(x, y); gg.scale(sc, sc); gg.fillText(s, 0, 0); gg.restore(); }

function door(g, D, name, lit, open, den, col = GREEN) {
  onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
    gg.fillStyle = hex(mix(mix(DARK, col, .3), col, open)); gg.fillRect(0, -2.2, D.w, 2.2);
    gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, D.w, 2.2);
    lamp(gg, D.w / 2, -2.5, lit, den);
    label(gg, name, D.w / 2, -2.78, D.w < 1.5 ? .0022 : .0026);
  });
}
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [3.0, 7.0]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  // lobby floor door (layer 3)
  door(g, FDOOR, 'FLOOR 3', on(t, [[T_L3, DUR]]), on(t, [[T_DOPEN, DUR]]), 0);
  onPlane(g, 4.6, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.2, 1.0); gg.fillStyle = DARK; gg.fillRect(1.07, -2.3, .06, 1.0); label(gg, 'LOBBY', 1.1, -2.55); });
  // IAM corner: least privilege rooms
  const lp = on(t, [[T_LP, DUR]]), one = on(t, [[T_ONE, DUR]]);
  const pul = t > T_ONE ? .5 + .5 * Math.sin((t - T_ONE) * 6) : 1;
  ROOMS.forEach((R, i) => {
    if (i === 1) door(g, R, R.n, Math.max(lp * .6, one), one * .8, 0);
    else door(g, R, R.n, 0, 0, lp * (t > T_ONE ? .55 + .45 * pul : 1));
  });
  onPlane(g, 8.4, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  onPlane(g, SRV.x, WALL_Y + .002, 0, 'xz', gg => { label(gg, 'LOGS', SRV.w / 2, -2.25); });
}

function camera(t) { // wall-mounted camera on a post, layer 4
  const x = -0.9, y = 0.4;
  iso.box(x, y, 0, .16, .16, 2.1, tri(SUBJ), { bias: -.4 });
  iso.box(x - .1, y - .2, 2.1, .36, .5, .24, tri(DARK, .25, .2), { bias: -1.2 });
  const a = on(t, [[T_L4, DUR]]);
  if (a > 0) { const pul = .6 + .4 * Math.sin((t - T_L4) * 5); disc(g, x + .9, y + .9, 1.0, GREEN, a * .18 * pul); ring(g, x + .9, y + .9, 1.0, GREEN, a * .7); }
}

function gate(t, x0, lanes, reader) { // posts at x0 + lane*2.0, leaves between; reader(lane) → {open, ok, den}
  for (let i = 0; i <= lanes; i++) iso.box(x0 + i * 2.0, GATE_Y - .1, 0, .25, .5, 1.0, tri('#D97757'), { bias: -.5 });
  for (let i = 0; i < lanes; i++) {
    const r = reader(i), lw = 1.7 * (1 - r.open);
    if (lw > .02) iso.box(x0 + i * 2.0 + .25, GATE_Y + .1, .1, lw, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
    iso.box(x0 + i * 2.0 + .03, GATE_Y - .3, 1.0, .19, .22, .06, tri(DARK), { bias: -1.05, decal: (I, b) => {
      onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .07, 0, Math.PI * 2); gg.fillStyle = css(mix(mix(DARK, GREEN, r.ok), C.accent, r.den)); gg.fill(); });
    } });
  }
}

function props(t) {
  // lobby turnstile: lane 0 (intruder) reader glitches and the leaf swings anyway; lane 1 (Priya) badge → open
  gate(t, -1.0, 2, i => {
    if (i === 0) { const f = ss(seg(t, T_FAIL, T_FAIL + .2)); const fl = f * (Math.sin((t - T_FAIL) * 18) > 0 ? 1 : .3) * (1 - ss(seg(t, v(12.0), v(12.4))));
      return { open: eio(seg(t, T_FAIL + .3, T_FAIL + .9)) * (1 - eio(seg(t, v(11.6), v(12.2)))), ok: 0, den: fl }; }
    const o = eio(seg(t, T_L1 + .1, T_L1 + .6)) * (1 - eio(seg(t, v(19.0), v(19.6))));
    return { open: o, ok: on(t, [[T_L1, v(19.4)]]), den: 0 };
  });
  // guard's desk (layer 2)
  iso.box(1.55, 2.5, 0, .55, 1.0, .95, tri(DARK, .25, .2), { bias: -.55 });
  camera(t);
  // IAM corner: MFA gate (one lane, x 11.2–13.2)
  gate(t, 11.2, 1, () => {
    const okA = on(t, [[T_MFA, v(26.6)]]) * (.6 + .4 * Math.sin((t - T_MFA) * 8));
    const den = on(t, [[T_DENY, T_BYP + .2]]);
    return { open: eio(seg(t, T_BYP, T_BYP + .6)), ok: okA * (1 - den), den };
  });
  onPlane(g, 11.2, GATE_Y - .1, 0, 'xz', () => {});
  // MFA label on the floor-standing sign
  iso.box(10.4, GATE_Y - .2, 0, .5, .12, 1.5, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { label(gg, 'MFA', b.w / 2, -1.15, .0016); gg.fillStyle = t > T_MFA ? GREEN : '#0B2412'; gg.fillRect(.1, -.9, b.w - .2, .08); });
  } });
  // LOGS server with alert lamp
  const al = t > T_ALERT ? (Math.sin((t - T_ALERT) * 9) > 0 ? 1 : .25) : 0;
  iso.box(SRV.x, SRV.y, 0, SRV.w, SRV.d, SRV.h, tri(DARK, .25, .2), { bias: -.85, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => {
      for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const live = t > T_LOG && (r + k + Math.floor(t * 4)) % 3 === 0; gg.fillStyle = live ? GREEN : '#0B2412'; gg.fillRect(.18 + k * .26, -1.2 + r * .3, .14, .08); }
      if (al > 0) { gg.fillStyle = C.accent; gg.globalAlpha = al; gg.beginPath(); gg.arc(b.w / 2, -1.42, .1, 0, Math.PI * 2); gg.fill(); gg.globalAlpha = 1; }
    });
  } });
  // attacker's leaked key (orange) floats above his head
  const ka = ss(seg(t, v(28.2), v(28.6))) * (1 - ss(seg(t, v(36.6), v(37)))), at = PEOPLE[3][1](t);
  if (ka > .01) iso.box(at.x - .15, at.y - .05, 2.05 + .05 * Math.sin(t * 4), .3, .1, .14 * ka, tri(SUBJ, .2, .2), { bias: -2, cull: false });
  // quiz: CI box with a badge
  const ci = eo(seg(t, T_CI - .4, T_CI));
  if (ci > 0) iso.box(21.0, 0.9, 0, .9, .9, 1.1 * ci + .001, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.globalAlpha = ci; label(gg, 'CI', b.w / 2, -.55, .0022); gg.fillStyle = GREEN; gg.fillRect(.2, -.35, .5, .06); gg.globalAlpha = 1; });
  } });
  const bd = eio(seg(t, T_BADGE - .5, T_BADGE));
  if (t > T_BADGE - .5) iso.box(21.3, lerp(2.4, 1.2, bd), lerp(2.2, 1.12, bd), .3, .22, .05, tri('#EEC677', .1, .2), { bias: -2, cull: false });
}

function people(t) {
  for (const [p, w] of PEOPLE) { if (p === ATT && t < v(20)) continue; const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, p, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  // quiz answer: three layer rings around Priya
  T_RINGS.forEach((t0, i) => { const a = ss(seg(t, t0, t0 + .35)) * (1 - ss(seg(t, v(4.8), v(5.3)))); ring(g, 2.4, 6.4, .6 + i * .45, i === 1 ? C.accent : GREEN, a, .08); });
  // intruder: gate fails (orange), guard stops him (orange ring), guard green
  const st = on(t, [[T_STOP, v(12.4)]]);
  ring(g, 0.1, 3.6, .55, C.accent, st); ring(g, 1.15, 3.1, .5, GREEN, st);
  // Priya's layers
  ring(g, 2.4, 3.6, .5, GREEN, on(t, [[T_L2, v(15.6)]]));
  // MFA deny on the attacker, damage small, alert
  ring(g, 12.2, 5.0, .55, C.accent, on(t, [[T_DENY, T_BYP + .3]]));
  const sm = on(t, [[T_ONE, v(37.0)]]);
  disc(g, 13.3, 0.5, .5, GREEN, sm * .25); ring(g, 13.3, 0.5, .5, GREEN, sm);
  const al = on(t, [[T_ALERT, v(37.0)]]);
  if (al > 0) { const pul = .5 + .5 * Math.sin((t - T_ALERT) * 6); ring(g, 13.3, 0.5, .75 + .08 * pul, C.accent, al); ring(g, SRV.x + SRV.w / 2, SRV.y + SRV.d + .3, .9, C.accent, al * pul); }
  // quiz rings: A under the person, B under the CI box
  const q = ss(seg(t, T_Q, T_Q + .3)) * (1 - ss(seg(t, DUR - 1.2, DUR - .6)));
  ring(g, 23.6, 2.6, .55, GREEN, q); ring(g, 21.45, 1.35, .85, C.accent, ss(seg(t, T_Q + .6, T_Q + .9)) * (1 - ss(seg(t, DUR - 1.2, DUR - .6))));
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 09', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Defense in depth: where IAM fits', 78, 158);
  g.font = font(600, 21, 'Inter'); g.fillStyle = '#DFFFE6'; g.textAlign = 'right'; g.letterSpacing = '3px'; g.fillText('DEBUG DIARIES', W - 72, 112); g.letterSpacing = '0px';
  g.textAlign = 'center';
  for (const s of SUBS) {
    if (t < s.t0 || t >= s.t1) continue;
    g.font = font(600, 42); const lines = wrap(g, s.text, 880), lh = 54, bottom = 1720, padY = 22;
    const tw = Math.max(...lines.map(l => g.measureText(l).width));
    const top = bottom - lines.length * lh - padY * 2 + 8;
    g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(W / 2 - tw / 2 - 30, top, tw + 60, bottom - top, 18); g.fill();
    g.fillStyle = '#DFFFE6'; lines.forEach((l, i) => g.fillText(l, W / 2, top + padY + 38 + i * lh));
  }
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 09/148', W / 2, 1808); g.letterSpacing = '0px';
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
