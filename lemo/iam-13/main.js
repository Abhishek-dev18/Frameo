// Access Granted 13 — "Why bcrypt/Argon2 beat MD5/SHA (slow hashing)"
// Debug Diaries · IAM series · Level 02 (Authentication Basics) · reel 13/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-13/p1..p6.mp3
// Story: quiz answer — SALT and HASH rings side by side on the floor (stored together, not secret). Lobby: the gate's
// HASH board reads "MD5 · SHA"; a thief at the turnstile fires a stream of fake badges and the guesses-per-second
// counter races to BILLIONS. The board flips to "bcrypt · Argon2", an hourglass sits on the reader, the stream slows to a
// trickle and the COST dial goes 10 → 12. Priya's one badge takes one second, the gate opens, she walks on; a queue of
// thieves forms behind and each one waits a second per badge. Server room: an ARGON2 box fills its memory blocks, the
// GPU box's cores go dark (expensive); the wall board ticks "Argon2id". Quiz: must a password have a special character?
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 15.4, 21.49, 30.24, 40.27, 52.79].map(v), VEND = v(62.179);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [2.2, 'B, no!'], [4.49, 'The salt is stored right next to the hash.'], [7.85, "It isn't a secret."], [10.48, 'Today:'], [12.02, 'why bcrypt and Argon2 beat MD5.'],
  [15.4, 'MD5 and SHA are very fast.'], [17.93, 'A single GPU'], [19.59, 'can try billions of guesses every second.'],
  [21.49, 'For passwords, being fast is the problem.'], [23.77, 'bcrypt and Argon2'], [25.19, 'are slow on purpose,'], [27.5, 'and a cost factor makes them even slower.'],
  [30.24, 'Think of the office lobby.'], [31.5, 'If the guard gives every badge one second,'], [34.61, "Priya doesn't even notice."], [36.37, 'But for a thief with thousands of fake badges,'], [38.97, 'the line never ends.'],
  [40.27, 'Tech example:'], [41.26, 'Argon2 is also memory-hard,'], [43.51, 'so running guesses in parallel on a GPU'], [46.56, 'gets expensive.'], [48.58, 'Today OWASP recommends Argon2id.'],
  [52.79, 'Clearance check!'], [53.76, 'Per NIST,'], [55.16, 'must a password have a special character?'], [57.13, 'A, yes,'], [58.22, 'or B, no?'], [59.02, 'Answer in the next reel.'], [60.88, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 3.0, GX = 2.3;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12', WHITE = '#FFFFFF';
const FDOOR = { x: 1.6, w: 2.2 };
const HB = { x: -2.6, w: 2.8 };            // the gate's HASH board
const OB = { x: 10.6, w: 5.0 }, QB = { x: 20.6, w: 3.6 };
const GPU = { x: 10.9, y: 1.6 }, ARG = { x: 14.0, y: 1.8 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const TH = i => ({ late: i > 0, h: 1.72 + (i % 2) * .06, top: WHITE, legs: LEGS[i % 3] });

// beats
const T_ANS = v(2.2), T_ANS2 = v(4.5);
const T_FAST = v(15.4), T_CNT = v(17.9), T_BIL = v(20.5);
const T_SLOW = v(23.8), T_COST = v(27.6);
const T_PIN = v(33.6), T_GOPEN = v(34.6), T_GSHUT = v(37.4);
const T_Q1 = v(38.9);
const T_MEM = v(41.3), T_GPU = v(43.5), T_EXP = v(46.6), T_OW = v(48.6);
const T_Q = v(53.8), T_QA = v(57.1), T_QB = v(58.2);

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


const LANE = 3.3;
const PEOPLE = [
  [PRIYA, walker([[0, 1.0, 7.8], [v(31.5), 1.0, 7.8], [T_PIN, LANE, 4.2], [T_GOPEN + .2, LANE, 4.2], [v(37.0), LANE, 0.4], [DUR, LANE, 0.4]])],
  [GUARD, walker([[0, 0.3, 0.9], [DUR, 0.3, 0.9]])],
  [TH(0), walker([[0, 4.9, 6.6], [v(14.6), 4.9, 6.6], [v(15.6), LANE, 4.4], [v(30.3), LANE, 4.4], [v(31.2), 4.9, 5.2], [v(36.5), 4.9, 5.2], [v(37.5), LANE, 4.4], [DUR, LANE, 4.4]])],
  [TH(1), walker([[0, LANE, 17.5], [v(35.0), LANE, 17.5], [v(38.6), LANE, 5.3], [DUR, LANE, 5.3]])],
  [TH(2), walker([[0, LANE, 18.5], [v(35.2), LANE, 18.5], [v(38.9), LANE, 6.2], [DUR, LANE, 6.2]])],
  [TH(3), walker([[0, LANE, 19.5], [v(35.4), LANE, 19.5], [v(39.2), LANE, 7.1], [DUR, LANE, 7.1]])],
  [TH(4), walker([[0, LANE, 20.5], [v(35.6), LANE, 20.5], [v(39.5), LANE, 8.0], [DUR, LANE, 8.0]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 3.4, -1.6, 72], [v(15.0), 3.2, -1.2, 74], [v(30.0), 3.2, -1.0, 76], [v(36.0), 3.4, -1.2, 72], [v(39.6), 3.8, -1.8, 68],
  [v(40.6), 7.2, 10.0, 84], [v(51.9), 7.2, 10.4, 86],
  [v(52.9), 11.6, 20.4, 78], [DUR, 11.6, 20.4, 76]];
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
  { t0: v(0.4), at: v(2.2), lines: [[['answer: ', 'n'], ['B · no', 'na']]], gap: .25 },
  { t0: v(4.6), at: v(7.9), lines: [[['salt sits ', 'n'], ['beside', 'na']], [['the hash', 'ns']]], l2: v(6.6) },
  { t0: v(10.6), at: v(12.6), lines: [[['slow', 'na'], [' beats fast', 'n']]], gap: .25 },
  { t0: v(15.6), at: v(17.4), lines: [[['MD5 = ', 'n'], ['fast', 'na']]], gap: .25 },
  { t0: v(18.2), at: v(20.5), lines: [[['billions', 'na']], [['of guesses / sec', 'ns']]], l2: v(19.8) },
  { t0: v(21.7), at: v(24.0), lines: [[['fast = ', 'n'], ['problem', 'na']]], gap: .25 },
  { t0: v(25.3), at: v(27.6), lines: [[['slow on ', 'n'], ['purpose', 'na']], [['cost factor up', 'ns']]], l2: v(27.6) },
  { t0: v(31.6), at: v(34.6), lines: [[['1 second', 'na'], [' a badge', 'n']]], gap: .25 },
  { t0: v(36.4), at: v(39.0), lines: [[['the line ', 'n'], ['never ends', 'na']]], gap: .25 },
  { t0: v(41.4), at: v(43.5), lines: [[['memory', 'na'], ['-hard', 'n']]], gap: .25 },
  { t0: v(44.6), at: v(47.0), lines: [[['GPU guessing', 'n']], [['expensive', 'nsa']]], l2: v(46.6) },
  { t0: v(48.7), at: v(50.5), lines: [[['use ', 'n'], ['Argon2id', 'na']]], gap: .25 },
  { t0: v(53.9), at: v(56.0), lines: [[['special ', 'n'], ['char?', 'na']]], gap: .25 },
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



// ---------- badge stream (thief -> reader) ----------
const SHOTS = [];
for (let t = T_FAST + .3; t < T_SLOW; t += .14) SHOTS.push(t);
for (let t = T_SLOW + .5; t < v(30.0); t += 1.0) SHOTS.push(t);
for (let t = T_Q1; t < v(40.4); t += 1.0) SHOTS.push(t);
const FLY = .35;

// ---------- events (sound) ----------
const EV = [];
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
PART.forEach((t, i) => E(Math.max(0, t - .05), 'chord', { i }));
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
for (const [, w] of PEOPLE) { let last = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = w(t); if (!p.walking) { last = -1; continue; } const n = Math.floor(p.phase / Math.PI); if (n !== last) { if (last >= 0) E(t, 'step'); last = n; } } }
E(T_ANS, 'lamp'); E(T_ANS2, 'lamp');
SHOTS.forEach((t, i) => { if (t < T_SLOW) { if (i % 3 === 0) E(t + FLY, 'tick'); } else E(t + FLY, 'deny'); });
E(T_CNT, 'lamp'); E(T_BIL, 'beep');
E(T_SLOW, 'slide'); E(T_COST, 'tick'); E(T_COST + .25, 'lamp');
E(T_PIN, 'tick'); E(T_GOPEN - .1, 'beep'); E(T_GOPEN, 'gate'); E(T_GSHUT, 'lock');
E(T_MEM, 'lamp'); E(T_MEM + .4, 'lamp'); E(T_MEM + .8, 'lamp'); E(T_GPU, 'tick'); E(T_EXP, 'lock'); E(T_OW, 'beep');
E(T_Q, 'lamp'); E(T_QA, 'tick'); E(T_QB, 'tick');
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
  gg.beginPath(); gg.arc(x, y, .12, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, col, lit)); gg.fill();
  if (lit > .01) { gg.globalAlpha = lit * .4; gg.beginPath(); gg.arc(x, y, .24, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); gg.globalAlpha = 1; }
}
function label(gg, s, x, y, sc = .0026, col = C.ink, al = 'center', fam = 'Newsreader') { gg.fillStyle = col; gg.font = font(600, 100, fam); gg.textAlign = al; gg.save(); gg.translate(x, y); gg.scale(sc, sc); gg.fillText(s, 0, 0); gg.restore(); }
function board(g, B, top, h, fn) { onPlane(g, B.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(0, -top, B.w, h); gg.strokeStyle = SUBJ; gg.lineWidth = .06; gg.strokeRect(0, -top, B.w, h); fn(gg); }); }
function sticker(gg, x, y, col, s = .16, glow = 0) { if (glow > .01) { gg.globalAlpha = glow * .45; gg.fillStyle = col; gg.fillRect(x - s, y - s, s * 2, s * 2); gg.globalAlpha = 1; } gg.fillStyle = col; gg.fillRect(x - s / 2, y - s / 2, s, s); }


const slowM = t => ss(seg(t, T_SLOW, T_SLOW + .4));
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [2.6, 6.6]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  const open = on(t, [[T_GOPEN, T_GSHUT]]);
  onPlane(g, FDOOR.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = hex(mix(mix(DARK, GREEN, .3), GREEN, open)); gg.fillRect(0, -2.2, FDOOR.w, 2.2); gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, FDOOR.w, 2.2); label(gg, 'OFFICE', FDOOR.w / 2, -2.45); });
  onPlane(g, 4.8, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  // the gate's HASH board: algorithm, speed, cost
  const sl = slowM(t);
  board(g, HB, 2.5, 2.0, gg => {
    label(gg, sl < .5 ? 'MD5 · SHA' : 'bcrypt · Argon2', HB.w / 2, -2.12, .0026, sl < .5 ? SUBJ : GREEN);
    label(gg, 'guesses / s', .15, -1.62, .0016, '#9FC8AA', 'left', 'Inter');
    const steps = ['—', '1K', '1M', '1B', 'BILLIONS'], k = clamp(Math.floor(seg(t, T_CNT, T_BIL) * 4 + (t >= T_CNT ? 1 : 0)), 0, 4);
    const sp = sl > .5 ? 'a few' : steps[t >= T_BIL ? 4 : k];
    label(gg, sp, HB.w - .15, -1.62, .0021, sl > .5 ? GREEN : SUBJ, 'right', 'Inter');
    // speed bar
    const fill = sl > .5 ? .06 : (t < T_FAST ? 0 : .25 + .75 * ss(seg(t, T_CNT, T_BIL)));
    gg.fillStyle = '#0B2412'; gg.fillRect(.15, -1.38, HB.w - .3, .16);
    gg.fillStyle = sl > .5 ? GREEN : SUBJ; gg.fillRect(.15, -1.38, (HB.w - .3) * fill, .16);
    label(gg, 'cost', .15, -.82, .0016, '#9FC8AA', 'left', 'Inter');
    const cst = sl < .5 ? '—' : t < T_COST ? '10' : '12';
    label(gg, cst, HB.w - .15, -.82, .0026, css(mix('#6F8F78', GREEN, sl)), 'right', 'Inter');
    lamp(gg, 1.4, -.9, on(t, [[T_COST, T_COST + 1.2]]), GREEN);
  });
  // server room: OWASP board
  const ow = on(t, [[T_OW, DUR]]), mm = on(t, [[T_MEM, DUR]]);
  board(g, OB, 2.6, 2.0, gg => {
    label(gg, 'PASSWORD HASHING', OB.w / 2, -2.2, .0026, GREEN);
    [['Argon2id', GREEN, ow], ['scrypt · bcrypt', '#DFFFE6', ow * .7], ['MD5 · SHA alone', SUBJ, 0]].forEach(([n, c, a], i) => { const y = -1.6 + i * .5;
      label(gg, n, .3, y, .0021, css(mix('#6F8F78', c, i === 2 ? mm : a)), 'left', 'Inter');
      label(gg, i === 2 ? '✕' : '✓', OB.w - .4, y, .0026, css(mix('#6F8F78', i === 2 ? SUBJ : GREEN, i === 2 ? mm : a)), 'center', 'Inter'); });
  });
  onPlane(g, 16.6, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  const q = on(t, [[T_Q, DUR]]);
  board(g, QB, 2.5, 1.7, gg => { label(gg, 'SPECIAL CHAR', QB.w / 2, -1.85, .0030, SUBJ); label(gg, 'required?', QB.w / 2, -1.3, .0036, css(mix('#6F8F78', '#DFFFE6', q))); lamp(gg, QB.w / 2, -.95, q, SUBJ); });
}

function badge(x, y, z, col, a, sc = 1) {
  if (a <= .01) return;
  iso.bill(x, y, z, gg => { gg.globalAlpha = a; gg.fillStyle = '#EEC677'; gg.beginPath(); gg.roundRect(-.13 * sc, -.18 * sc, .26 * sc, .2 * sc, .03); gg.fill();
    gg.fillStyle = col; gg.fillRect(-.09 * sc, -.15 * sc, .18 * sc, .05 * sc); gg.globalAlpha = 1; }, { bias: 3, cull: false });
}
function props(t) {
  const sl = slowM(t);
  // turnstile gate + reader with hourglass
  iso.box(GX, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  iso.box(GX + 1.9, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  const gop = eio(seg(t, T_GOPEN, T_GOPEN + .5)) * (1 - eio(seg(t, T_GSHUT, T_GSHUT + .5))), lw = 1.65 * (1 - gop);
  if (lw > .02) iso.box(GX + .25, GATE_Y + .1, .1, lw, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  let hit = 0; for (const s of SHOTS) { const d = t - (s + FLY); if (d >= 0 && d < .25) hit = 1 - d / .25; }
  const ok = on(t, [[T_GOPEN - .1, T_GOPEN + 1.2]]);
  iso.box(GX + 1.85, GATE_Y + .25, 1.0, .35, .3, .08, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .09, 0, Math.PI * 2); gg.fillStyle = css(mix(mix(C.ghost, SUBJ, hit), GREEN, ok)); gg.fill(); });
  } });
  if (sl > .01) iso.bill(GX + 2.0, GATE_Y + .4, 1.55, gg => { gg.globalAlpha = sl; const fl = ((t - T_SLOW) % 2) < 1;
    gg.fillStyle = SUBJ; gg.beginPath(); gg.moveTo(-.14, -.42); gg.lineTo(.14, -.42); gg.lineTo(0, -.22); gg.lineTo(.14, -.02); gg.lineTo(-.14, -.02); gg.lineTo(0, -.22); gg.closePath(); gg.fill();
    gg.fillStyle = '#F1C474'; gg.beginPath(); if (fl) { gg.moveTo(-.07, -.06); gg.lineTo(.07, -.06); gg.lineTo(0, -.18); } else { gg.moveTo(-.08, -.38); gg.lineTo(.08, -.38); gg.lineTo(0, -.26); } gg.closePath(); gg.fill(); gg.globalAlpha = 1; }, { bias: 3, cull: false });
  // badge stream from the front thief to the reader
  const th = PEOPLE[2][1](t);
  for (const s of SHOTS) { const f = (t - s) / FLY; if (f < 0 || f > 1) continue; const e = eo(f);
    badge(lerp(th.x - .1, GX + 2.0, e), lerp(th.y - .3, GATE_Y + .4, e), 1.25 + Math.sin(f * Math.PI) * .3 - .1 * e, SUBJ, 1 - ss(seg(f, .85, 1))); }
  // thief's stack of badges (part 2-3)
  const stk = on(t, [[v(14.8), v(30.2)]]);
  for (let i = 0; i < 4; i++) badge(th.x + .28, th.y - .1, 1.0 + i * .05, i % 2 ? GREEN : SUBJ, stk, .9);
  // Priya's single badge
  const pb = on(t, [[v(32.0), T_GOPEN + .6]]), pp = PEOPLE[0][1](t);
  badge(pp.x + .3, pp.y - .15, 1.15, GREEN, pb, 1.2);
  iso.box(-1.2, .2, 0, .5, 1.0, .9, tri(DARK, .25, .2), { bias: -.55 }); // guard's desk
  // server room: GPU box (many small cores) and ARGON2 box (memory blocks)
  const gpuOn = ss(seg(t, T_GPU, T_GPU + .8)), exp = ss(seg(t, T_EXP, T_EXP + .6));
  iso.box(GPU.x, GPU.y, 0, 1.6, 1.0, .9, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y, b.z + b.h + .001, 'xy', gg => { for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) { const lit = gpuOn * (1 - exp * ((i * 4 + j) % 5 !== 0 ? 1 : .2));
      gg.fillStyle = css(mix('#0B2412', exp > .5 ? SUBJ : GREEN, lit)); gg.fillRect(.12 + i * .24, .12 + j * .2, .16, .13); } });
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => label(gg, 'GPU', b.w / 2, -.35, .0026, SUBJ, 'center', 'Inter'));
  } });
  const mf = ss(seg(t, T_MEM, T_MEM + 1.2));
  iso.box(ARG.x, ARG.y, 0, 1.4, 1.0, 1.3, tri(SUBJ), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(.1, -1.22, b.w - .2, .32); label(gg, 'ARGON2', b.w / 2, -.98, .0024, GREEN, 'center', 'Inter');
      for (let i = 0; i < 6; i++) { gg.fillStyle = css(mix(DARK, GREEN, clamp(mf * 6 - i))); gg.fillRect(.12 + i * .2, -.75, .14, .5); }
      label(gg, 'MEMORY', b.w / 2, -.08, .0015, DARK, 'center', 'Inter'); });
  } });
}

function people(t) {
  for (const [pp, w] of PEOPLE) { if (pp.late && t < v(35.0)) continue; const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  const endP1 = v(15.2);
  const a1 = on(t, [[T_ANS2 - .4, endP1]]), a2 = on(t, [[T_ANS2, endP1]]);
  ring(g, 2.4, 8.4, .6, GREEN, a2); floorLabel(g, 2.4, 8.4, 'HASH', GREEN, a2);
  ring(g, 3.9, 8.4, .6, SUBJ, a1); floorLabel(g, 3.9, 8.4, 'SALT', SUBJ, a1);
  floorLabel(g, 3.15, 9.4, 'stored together', '#DFFFE6', on(t, [[v(7.9), endP1]]));
  const fast = on(t, [[T_FAST, T_SLOW]]), th = PEOPLE[2][1](t);
  ring(g, th.x, th.y, .55, SUBJ, fast);
  const p = PEOPLE[0][1](t); ring(g, p.x, p.y, .55, GREEN, on(t, [[T_GOPEN, v(38.0)]]));
  for (let i = 2; i < 7; i++) { const q = PEOPLE[i][1](t); ring(g, q.x, q.y, .5, SUBJ, on(t, [[v(39.0) + (i - 2) * .15, v(40.6)]])); }
  const ex = on(t, [[T_EXP, v(52.4)]]); if (ex > 0) { disc(g, GPU.x + .8, GPU.y + 1.9, .6, C.accent, ex * .25); ring(g, GPU.x + .8, GPU.y + 1.9, .6, C.accent, ex); floorLabel(g, GPU.x + .8, GPU.y + 1.9, '$$$', SUBJ, ex); }
  const mm = on(t, [[T_MEM + 1.0, v(52.4)]]); ring(g, ARG.x + .7, ARG.y + 1.9, .6, GREEN, mm); floorLabel(g, ARG.x + .7, ARG.y + 1.9, 'RAM', GREEN, mm);
  const endA = 1 - ss(seg(t, DUR - 1.2, DUR - .6));
  ring(g, 21.6, 1.5, .55, GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA); floorLabel(g, 21.6, 1.5, 'A', GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA);
  ring(g, 23.2, 1.5, .55, C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA); floorLabel(g, 23.2, 1.5, 'B', C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 13', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Why bcrypt & Argon2 beat MD5 / SHA', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 02 · AUTHENTICATION BASICS · 13/148', W / 2, 1808); g.letterSpacing = '0px';
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
