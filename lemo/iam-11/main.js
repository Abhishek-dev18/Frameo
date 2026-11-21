// Access Granted 11 — "Authentication factors: something you know / have / are"
// Debug Diaries · IAM series · Level 02 (Authentication Basics) · reel 11/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-11/p1..p6.mp3
// Story: quiz answer — an OTP phone on the floor gets the "have" ring. Lobby gate with three checkpoints: a PIN pad (KNOW),
// a badge reader (HAVE) and a face scanner (ARE); the FLOOR 3 door carries three factor lamps. A shoulder-surfer sneaks up
// on the PIN pad (know can be guessed). Priya then passes all three in order, the lamps light, gate + door open.
// Bank hall: door BANK lights PASSWORD (know, orange) + OTP (have, green) and opens = MFA; the door next to it lights
// PASSWORD + QUESTION, both orange "know" — one factor twice, it stays shut. Quiz: password + security question — 2FA? A yes / B no.
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 9.824, 17.188, 27.446, 35.673, 48.53].map(v), VEND = v(57.819);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.597, 'B,'], [2.371, 'something you have!'], [3.988, 'The OTP lands on a phone you own.'], [6.783, 'Today:'], [7.94, 'the three authentication factors.'],
  [9.824, 'Factor one:'], [10.803, 'something you know.'], [11.844, 'Like a password or a PIN.'], [13.283, "It lives in your head,"], [14.616, 'but someone can guess it or steal it.'],
  [17.188, 'Factor two:'], [18.021, 'something you have.'], [19.227, 'Like a phone,'], [20.23, 'an authenticator app or a security key.'], [22.151, 'And factor three:'], [23.318, 'something you are.'], [24.465, 'A fingerprint or your face,'], [26.257, 'your biometrics.'],
  [27.446, 'Think of the office lobby.'], [28.717, 'Priya types a PIN at the gate, taps her badge, and the scanner checks her face.'], [33.061, 'Three different proofs,'], [34.298, 'and only then the gate opens.'],
  [35.673, 'Tech example:'], [36.736, 'you type a password in your bank app,'], [38.526, 'then an OTP arrives on your phone.'], [40.014, 'Those are two different factors.'], [41.637, "That's real MFA."], [43.048, 'But a password plus a security question are both something you know.'], [46.632, 'One factor,'], [47.916, 'twice.'],
  [48.53, 'Clearance check!'], [49.513, 'After the password, it asks a security question.'], [51.67, 'Is that 2FA?'], [52.839, 'A, yes,'], [53.913, 'or B, no?'], [55.058, 'Answer in the next reel.'], [56.544, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12';
const FDOOR = { x: 1.3, w: 2.4 };
const BANK = { x: 11.2, w: 2.0 }, FAKE = { x: 14.4, w: 2.0 }, QDOOR = { x: 21.3, w: 2.0 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const SURF = { h: 1.74, top: '#FFFFFF', legs: LEGS[1] };
const PB = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };

// beats
const T_ANS = v(2.4);
const T_PIN1 = v(11.9), T_SURF = v(14.7);
const T_HAVE = v(18.1), T_ARE = v(23.4);
const T_K = v(29.4), T_H = v(30.6), T_A = v(32.0), T_GOPEN = v(33.2), T_DOPEN = v(34.4);
const T_BPW = v(37.2), T_BOTP = v(39.0), T_BOPEN = v(40.3), T_FPW = v(43.5), T_FQ = v(45.2), T_FDENY = v(46.7);
const T_QPW = v(49.9), T_QQ = v(50.9), T_QA = v(52.9), T_QB = v(53.95);

let TNOW = 0;
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
  [PRIYA, walker([[0, 2.5, 7.6], [v(10.2), 2.5, 7.6], [v(11.6), 2.6, 6.0], [T_DOPEN, 2.6, 6.0], [v(37.0), 2.5, 0.0], [DUR, 2.5, 0.0]])],
  [GUARD, walker([[0, -0.9, 3.0], [DUR, -0.9, 3.0]])],
  [SURF, walker([[0, 0.2, 9.5], [v(13.0), 0.2, 9.5], [v(14.6), 1.3, 6.3], [v(16.6), 1.3, 6.3], [v(18.6), -1.0, 9.6], [DUR, -1.0, 9.6]])],
  [PB, walker([[0, 12.2, 3.2], [v(40.4), 12.2, 3.2], [v(42.2), 12.2, 0.2], [DUR, 12.2, 0.2]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 3.6, -1.8, 74], [v(9.4), 3.6, -1.8, 76], [v(17.0), 3.4, -1.6, 78], [v(27.2), 3.2, -1.6, 80], [v(35.3), 3.0, -1.4, 82],
  [v(36.1), 8.0, 11.4, 76], [v(48.0), 8.0, 11.4, 79],
  [v(48.8), 12.0, 21.0, 80], [DUR, 12.0, 21.0, 78]];
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
  { t0: v(0.4), at: v(2.4), lines: [[['answer: ', 'n'], ['have', 'na']]], gap: .25 },
  { t0: v(6.9), at: v(8.0), lines: [[['three ', 'n'], ['factors', 'na']]], gap: .25 },
  { t0: v(10.0), at: v(11.9), lines: [[['know', 'na'], [' · password', 'n']], [['PIN', 'ns']]], l2: v(12.4) },
  { t0: v(14.5), at: v(15.4), lines: [[['can be ', 'n'], ['guessed', 'na']]], gap: .25 },
  { t0: v(17.6), at: v(19.4), lines: [[['have', 'na'], [' · phone', 'n']], [['app · key', 'ns']]], l2: v(20.6) },
  { t0: v(23.0), at: v(24.6), lines: [[['are', 'na'], [' · face', 'n']], [['fingerprint', 'ns']]], l2: v(24.9) },
  { t0: v(28.8), at: v(32.0), lines: [[['3 ', 'n'], ['proofs', 'na']], [['know · have · are', 'ns']]], l2: v(33.2) },
  { t0: v(36.4), at: v(39.0), lines: [[['password + ', 'n'], ['OTP', 'na']], [['2 factors = MFA', 'ns']]], l2: v(40.2) },
  { t0: v(43.4), at: v(46.0), lines: [[['know + know', 'n']], [['1 ', 'ns'], ['factor', 'nsa']]], l2: v(46.7) },
  { t0: v(49.0), at: v(51.0), lines: [[['pw + question', 'n']], [['= ', 'ns'], ['2FA?', 'nsa']]], l2: v(51.8) },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1320;
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
E(T_ANS, 'beep'); E(T_ANS + .2, 'lamp');
E(T_PIN1, 'tick'); E(T_PIN1 + .25, 'tick'); E(T_PIN1 + .5, 'tick'); E(T_SURF, 'deny');
E(T_HAVE, 'beep'); E(T_ARE, 'slide');
E(T_K, 'tick'); E(T_K + .2, 'lamp'); E(T_H, 'beep'); E(T_H + .2, 'lamp'); E(T_A, 'slide'); E(T_A + .3, 'lamp'); E(T_GOPEN, 'gate'); E(T_DOPEN, 'door');
E(T_BPW, 'tick'); E(T_BPW + .2, 'lamp'); E(T_BOTP, 'beep'); E(T_BOTP + .2, 'lamp'); E(T_BOPEN, 'door');
E(T_FPW, 'tick'); E(T_FPW + .2, 'lamp'); E(T_FQ, 'tick'); E(T_FQ + .2, 'lamp'); E(T_FDENY, 'deny'); E(T_FDENY + .3, 'lock');
E(T_QPW, 'lamp'); E(T_QQ, 'lamp'); E(T_QA, 'tick'); E(T_QB, 'tick');
EV.sort((a, b) => a.t - b.t);

// ---------- drawing helpers ----------
const FLOOR = '#020403', FLOOR_LINE = '#0B2412', BEYOND = '#000000';
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
function floorLabel(g, x, y, s, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.fillStyle = col; gg.font = font(700, 100); gg.textAlign = 'center'; gg.save(); gg.scale(.0045, .0045); gg.fillText(s, 0, 35); gg.restore(); }); }

const on = (t, ranges) => { let a = 0; for (const [t0, t1] of ranges) a = Math.max(a, ss(seg(t, t0, t0 + .3)) * (1 - ss(seg(t, t1 - .3, t1)))); return a; };
function lamp(gg, x, y, lit, col) {
  gg.beginPath(); gg.arc(x, y, .14, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, col, lit)); gg.fill();
  if (lit > .01) { gg.globalAlpha = lit * .4; gg.beginPath(); gg.arc(x, y, .28, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); gg.globalAlpha = 1; }
}
function label(gg, s, x, y, sc = .0026, col = C.ink) { gg.fillStyle = col; gg.font = font(600, 100); gg.textAlign = 'center'; gg.save(); gg.translate(x, y); gg.scale(sc, sc); gg.fillText(s, 0, 0); gg.restore(); }

// door with factor lamps: lamps = [{ lit, col, txt }]
function door(g, D, name, lamps, open, den = 0) {
  onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
    let fill = mix(mix(DARK, GREEN, .3), GREEN, open); if (den > 0) fill = mix(fill, C.accent, den * .6);
    gg.fillStyle = hex(fill); gg.fillRect(0, -2.2, D.w, 2.2);
    gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, D.w, 2.2);
    const n = lamps.length;
    lamps.forEach((L, i) => { const x = D.w * (i + .5) / n; lamp(gg, x, -2.5, L.lit, L.col); label(gg, L.txt, x, -1.95, .0016, L.lit > .5 ? C.ink : '#B8D8C0'); });
    label(gg, name, D.w / 2, -2.85, .0026);
  });
}
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [3.0, 7.0]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  // lobby: FLOOR 3 door with KNOW / HAVE / ARE lamps
  const end = DUR;
  door(g, FDOOR, 'FLOOR 3', [
    { lit: Math.max(on(t, [[T_K + .2, end]]), on(t, [[T_PIN1 + .5, T_HAVE - .4]]) * .6), col: SUBJ, txt: 'KNOW' },
    { lit: Math.max(on(t, [[T_H + .2, end]]), on(t, [[T_HAVE, T_ARE - .3]]) * .6), col: GREEN, txt: 'HAVE' },
    { lit: Math.max(on(t, [[T_A + .3, end]]), on(t, [[T_ARE, v(27.2)]]) * .6), col: GREEN, txt: 'ARE' }], on(t, [[T_DOPEN, end]]));
  onPlane(g, -2.4, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.2, 1.0); gg.fillStyle = DARK; gg.fillRect(1.07, -2.3, .06, 1.0); });
  onPlane(g, 5.0, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.2, 1.0); gg.fillStyle = DARK; gg.fillRect(1.07, -2.3, .06, 1.0); label(gg, 'LOBBY', 1.1, -2.55); });
  // bank hall: BANK (password + OTP) and a second door (password + question)
  door(g, BANK, 'BANK', [{ lit: on(t, [[T_BPW + .2, end]]), col: SUBJ, txt: 'PASSWORD' }, { lit: on(t, [[T_BOTP + .2, end]]), col: GREEN, txt: 'OTP' }], on(t, [[T_BOPEN, end]]));
  const deny = t > T_FDENY ? on(t, [[T_FDENY, v(48.4)]]) * (Math.sin((t - T_FDENY) * 9) > 0 ? 1 : .4) : 0;
  door(g, FAKE, 'BANK 2', [{ lit: on(t, [[T_FPW + .2, end]]), col: SUBJ, txt: 'PASSWORD' }, { lit: on(t, [[T_FQ + .2, end]]), col: SUBJ, txt: 'QUESTION' }], 0, deny);
  onPlane(g, 17.4, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  // quiz door
  door(g, QDOOR, '2FA?', [{ lit: on(t, [[T_QPW, end]]), col: SUBJ, txt: 'PASSWORD' }, { lit: on(t, [[T_QQ, end]]), col: SUBJ, txt: 'QUESTION' }], 0);
}

function phoneBox(x, y, a, lit, bias = -.5) { // standing phone with OTP digits
  if (a <= 0) return;
  iso.box(x, y, 0, .6, .14, 1.15 * a + .001, tri(DARK, .25, .2), { bias, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.globalAlpha = a; gg.strokeStyle = SUBJ; gg.lineWidth = .05; gg.strokeRect(.05, -1.1, b.w - .1, 1.04); label(gg, 'OTP', b.w / 2, -.75, .0018);
      for (let k = 0; k < 4; k++) { gg.fillStyle = css(mix(C.ghost, GREEN, lit)); gg.fillRect(.08 + k * .12, -.5, .08, .12); } gg.globalAlpha = 1; });
  } });
}
function key(x, y, z, a, col = SUBJ) { if (a > .01) iso.box(x - .15, y - .05, z, .3, .1, .14 * a, tri(col, .2, .2), { bias: -2, cull: false }); }

function props(t) {
  // lobby gate: one lane; left post = PIN pad (KNOW), right post = badge reader (HAVE); face scanner pole (ARE)
  const gx = 1.5;
  iso.box(gx, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  iso.box(gx + 2.0, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  const open = eio(seg(t, T_GOPEN, T_GOPEN + .5)), lw = 1.7 * (1 - open);
  if (lw > .02) iso.box(gx + .25, GATE_Y + .1, .1, lw, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  const pin = Math.max(on(t, [[T_PIN1, T_PIN1 + 1.0]]), on(t, [[T_K, T_K + .9]])), surf = on(t, [[T_SURF, v(17.0)]]);
  iso.box(gx - .05, GATE_Y - .35, 1.0, .35, .3, .08, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => {
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { gg.fillStyle = css(mix(mix(C.ghost, SUBJ, pin), '#FFFFFF', surf * ((r + c) % 2))); gg.fillRect(-.12 + c * .085, -.1 + r * .075, .06, .05); }
    });
  } });
  const bdg = Math.max(on(t, [[T_HAVE, T_HAVE + 1.2]]), on(t, [[T_H, T_H + .9]]));
  iso.box(gx + 2.0, GATE_Y - .35, 1.0, .25, .3, .08, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .08, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, GREEN, bdg)); gg.fill(); });
  } });
  // face scanner pole with a lens and a sweeping scan bar
  const sc = Math.max(on(t, [[T_ARE, v(27.0)]]), on(t, [[T_A, T_A + 1.0]]));
  iso.box(gx + 2.6, GATE_Y - .2, 0, .18, .18, 1.9, tri(SUBJ), { bias: -.5 });
  iso.box(gx + 2.5, GATE_Y - .05, 1.75, .38, .1, .45, tri(DARK, .25, .2), { bias: -.6, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, b.z, 'xz', gg => {
      gg.beginPath(); gg.arc(b.w / 2, -.25, .1, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, GREEN, sc)); gg.fill();
      if (sc > .05) { gg.globalAlpha = sc; gg.fillStyle = GREEN; gg.fillRect(.03, -.42 + .34 * (.5 + .5 * Math.sin(t * 6)), b.w - .06, .03); gg.globalAlpha = 1; }
    });
  } });
  iso.box(-1.5, 2.5, 0, .55, 1.0, .95, tri(DARK, .25, .2), { bias: -.55 }); // guard's desk
  // quiz answer: OTP phone on the floor (part 1) and next to Priya (part 2 "have")
  const ph1 = eo(seg(t, v(1.4), v(2.0))) * (1 - eo(seg(t, v(9.0), v(9.5))));
  phoneBox(3.6, 6.4, ph1, on(t, [[T_ANS, v(9.2)]]));
  const p = PEOPLE[0][1](t);
  // "have": badge + key glint above Priya
  const hv = on(t, [[T_HAVE, v(22.0)]]);
  if (hv > .01) { iso.box(p.x - .32, p.y - .05, 2.0, .3, .1, .2 * hv, tri('#EEC677', .1, .2), { bias: -2, cull: false }); key(p.x + .25, p.y, 2.05 + .04 * Math.sin(t * 4), hv, GREEN); }
  const b4 = on(t, [[T_H - .3, T_H + .9]]);
  if (b4 > .01) iso.box(p.x - .15, p.y - .05, 2.0, .3, .1, .2 * b4, tri('#EEC677', .1, .2), { bias: -2, cull: false });
  // bank hall: phone that receives the OTP
  phoneBox(13.4, 3.0, eo(seg(t, v(37.6), v(38.4))), on(t, [[T_BOTP, DUR]]));
  // security-question card next to BANK 2
  const qa = eo(seg(t, T_FQ - .4, T_FQ));
  if (qa > 0) iso.box(15.6, 1.9, 0, .7, .14, .9 * qa + .001, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.globalAlpha = qa; label(gg, '?', b.w / 2, -.3, .005, SUBJ); gg.globalAlpha = 1; });
  } });
}

function people(t) {
  for (const [pp, w] of PEOPLE) { const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  ring(g, 3.9, 6.47, .7, GREEN, on(t, [[T_ANS, v(9.2)]]));
  floorLabel(g, 3.9, 7.5, 'B · HAVE', GREEN, on(t, [[T_ANS, v(9.2)]]));
  const s = PEOPLE[2][1](t); ring(g, s.x, s.y, .55, C.accent, on(t, [[T_SURF, v(17.2)]]));
  const p = PEOPLE[0][1](t);
  ring(g, p.x, p.y, .55, GREEN, on(t, [[T_GOPEN, v(35.4)]]));
  const pb = PEOPLE[3][1](t); ring(g, pb.x, pb.y, .55, GREEN, on(t, [[T_BOPEN, v(43.0)]]));
  const dn = on(t, [[T_FDENY, v(48.4)]]); if (dn > 0) { disc(g, FAKE.x + 1.0, .2, .8, C.accent, dn * .25); ring(g, FAKE.x + 1.0, .2, .8, C.accent, dn); }
  // quiz: A and B rings in front of the quiz door
  const endA = 1 - ss(seg(t, DUR - 1.2, DUR - .6));
  ring(g, 21.6, 1.4, .55, GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA); floorLabel(g, 21.6, 1.4, 'A', GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA);
  ring(g, 23.0, 1.4, .55, C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA); floorLabel(g, 23.0, 1.4, 'B', C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 11', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Authentication factors: know · have · are', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 02 · AUTHENTICATION BASICS · 11/148', W / 2, 1808); g.letterSpacing = '0px';
  g.restore();
}

function render(g, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; TNOW = t;
  iso.g = g; iso.cam = camAt(t);
  floor(g);
  marks(g, t);
  for (const P of PH) floorType(g, t, P, P.L);
  walls(g, t);
  props(t); people(t); iso.flush();
  overlay(g, t);
}

window.DUR = DUR; window.EV = EV;
window.render = t => { render(g, t);
  if (!window.__bc) { window.__bc = document.createElement('canvas'); window.__bc.width = W; window.__bc.height = H; }
  const bx = window.__bc.getContext('2d'); bx.clearRect(0, 0, W, H);
  bx.filter = 'blur(12px)'; bx.drawImage(cv, 0, 0); bx.filter = 'none';
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .75; g.drawImage(window.__bc, 0, 0); g.restore(); };
window.READY = true;
