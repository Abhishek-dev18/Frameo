// Access Granted 12 — "How passwords are stored: hashing and salting"
// Debug Diaries · IAM series · Level 02 (Authentication Basics) · reel 12/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-12/p1..p6.mp3
// Story: quiz answer — two KNOW marks on the floor (password + question = one factor). Lobby: a HASH machine; Priya's
// password card (with a small salt sticker) slides in, a green code card comes out; it can't go back (one-way).
// At the gate the reader hashes her typed password again, the guard's REGISTER row matches, the gate opens.
// The register holds codes, never words; the salt sticker glows: random per person. Records room: PRIYA and RAHUL share
// a password, different salts, different hashes; a RAINBOW TABLE crate goes dark. Quiz: must the salt be secret? A / B.
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 10.335, 19.931, 26.099, 36.246, 47.426].map(v), VEND = v(54.827);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.359, 'B,'], [2.133, 'no!'], [2.78, 'A password and a security question are both something you know.'], [5.248, 'Today:'], [6.373, 'how a password is stored —'], [8.904, 'hashing and salting.'],
  [10.335, 'A good system never saves your password in plain text.'], [13.672, 'It saves its hash:'], [14.784, 'a one-way function.'], [16.343, "Run it backwards and you don't get the password back."],
  [19.931, 'At login, the password you type'], [21.941, 'is hashed again.'], [23.112, 'If both hashes match,'], [24.882, 'access granted.'],
  [26.099, 'Think of the office lobby.'], [27.478, "The guard's register doesn't hold Priya's secret word,"], [29.997, 'only a code the machine made.'], [31.911, 'And for every person, the machine first adds a random sticker.'], [35.377, "That's the salt."],
  [36.246, 'Tech example:'], [37.218, 'Priya and Rahul have the same password,'], [38.958, 'but different salts,'], [40.085, 'so their hashes look different in the database.'], [42.474, "That makes attackers' precomputed hash tables,"], [45.141, 'the rainbow tables,'], [46.387, 'useless.'],
  [47.426, 'Clearance check!'], [48.421, 'Does the salt have to be kept secret?'], [50.588, 'A, yes,'], [51.469, 'or B, no?'], [52.283, 'Answer in the next reel.'], [53.432, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 3.0;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12', WHITE = '#FFFFFF';
const FDOOR = { x: 1.6, w: 2.2 };
const REG = { x: -2.6, w: 2.6 };
const MX = -0.4, MY = 5.0; // hash machine
const DB = { x: 10.6, w: 5.0 }, QB = { x: 20.6, w: 3.6 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const P2 = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const RAHUL = { h: 1.76, top: WHITE, legs: LEGS[1] };

// beats
const T_ANS = v(1.4), T_ANS2 = v(3.6);
const T_IN = v(13.6), T_OUT = v(14.8), T_BACK = v(16.4);
const T_GH = v(22.0), T_MATCH = v(23.2), T_GOPEN = v(24.9);
const T_REG = v(27.6), T_STK = v(32.3);
const T_S = v(38.95), T_H = v(40.1), T_RB = v(42.5), T_RX = v(46.4);
const T_Q = v(48.4), T_QA = v(50.6), T_QB = v(51.5);

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
  [PRIYA, walker([[0, 3.0, 8.6], [v(10.6), 3.0, 8.6], [v(12.6), 0.9, 6.4], [v(19.9), 0.9, 6.4], [v(21.8), 3.3, 4.2], [T_GOPEN + .2, 3.3, 4.2], [v(28.6), 3.3, 0.3], [DUR, 3.3, 0.3]])],
  [GUARD, walker([[0, 0.3, 0.9], [DUR, 0.3, 0.9]])],
  [P2, walker([[0, 12.0, 4.6], [v(37.0), 12.0, 4.6], [v(38.4), 12.0, 2.6], [DUR, 12.0, 2.6]])],
  [RAHUL, walker([[0, 14.4, 4.8], [v(37.4), 14.4, 4.8], [v(38.8), 14.4, 2.6], [DUR, 14.4, 2.6]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 3.4, -1.6, 72], [v(10.0), 3.4, -1.8, 74], [v(19.6), 3.2, -1.2, 76], [v(25.8), 3.0, -0.6, 78], [v(35.6), 2.8, -0.4, 80],
  [v(36.4), 7.6, 11.2, 86], [v(46.9), 7.6, 11.6, 88],
  [v(47.6), 11.6, 20.4, 78], [DUR, 11.6, 20.4, 76]];
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
  { t0: v(6.4), at: v(8.9), lines: [[['hash', 'na'], [' + salt', 'n']]], gap: .25 },
  { t0: v(10.6), at: v(12.6), lines: [[['never ', 'n'], ['plain', 'na']], [['text', 'ns']]], l2: v(13.2) },
  { t0: v(15.0), at: v(16.4), lines: [[['one-way', 'na']], [['no way back', 'ns']]], l2: v(17.4) },
  { t0: v(20.2), at: v(23.1), lines: [[['hash = ', 'n'], ['hash', 'na']], [['access granted', 'ns']]], l2: v(24.9) },
  { t0: v(27.8), at: v(30.0), lines: [[['code, not ', 'n'], ['word', 'na']]], gap: .25 },
  { t0: v(32.4), at: v(35.4), lines: [[['random ', 'n'], ['salt', 'na']], [['per person', 'ns']]], l2: v(35.4) },
  { t0: v(37.4), at: v(40.1), lines: [[['same password', 'n']], [['different ', 'ns'], ['hash', 'nsa']]], l2: v(40.4) },
  { t0: v(42.6), at: v(45.1), lines: [[['rainbow tables', 'n']], [['useless', 'nsa']]], l2: v(46.4) },
  { t0: v(48.5), at: v(50.0), lines: [[['salt ', 'n'], ['secret?', 'na']]], gap: .25 },
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
E(T_ANS, 'lamp'); E(T_ANS2, 'lamp');
E(T_IN, 'slide'); E(T_OUT - .2, 'tick'); E(T_OUT, 'beep'); E(T_BACK, 'deny');
E(T_GH, 'tick'); E(T_GH + .25, 'tick'); E(T_MATCH, 'beep'); E(T_MATCH + .2, 'lamp'); E(T_GOPEN, 'gate');
E(T_REG, 'lamp'); E(T_STK, 'beep');
E(T_S, 'lamp'); E(T_H, 'lamp'); E(T_H + .3, 'lamp'); E(T_RB, 'slide'); E(T_RX, 'lock');
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

function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [2.6, 6.6]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  // lobby door
  const open = on(t, [[T_GOPEN, DUR]]);
  onPlane(g, FDOOR.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = hex(mix(mix(DARK, GREEN, .3), GREEN, open)); gg.fillRect(0, -2.2, FDOOR.w, 2.2); gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, FDOOR.w, 2.2); label(gg, 'OFFICE', FDOOR.w / 2, -2.45); });
  onPlane(g, 4.8, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  // guard's REGISTER: codes, never words
  const reg = Math.max(on(t, [[T_MATCH + .2, v(26.2)]]), on(t, [[T_REG, v(36.2)]]));
  board(g, REG, 2.5, 1.9, gg => {
    label(gg, 'REGISTER', REG.w / 2, -2.15, .0024, GREEN);
    const rows = [['PRIYA', '71BE·0D', reg], ['AMAN', 'C3F9·A1', 0], ['NEHA', '5D02·EE', 0]];
    rows.forEach(([n, h, lit], i) => { const y = -1.7 + i * .45; label(gg, n, .15, y, .0018, '#DFFFE6', 'left');
      sticker(gg, 1.15, y - .06, i === 0 ? GREEN : i === 1 ? SUBJ : WHITE, .13, i === 0 ? on(t, [[T_STK, v(36.2)]]) : 0);
      label(gg, h, 1.4, y, .0018, css(mix('#6F8F78', GREEN, lit)), 'left', 'Inter'); });
  });
  // records room: DATABASE board — same password, different salt, different hash
  const s = on(t, [[T_S, DUR]]), hh = on(t, [[T_H, DUR]]);
  board(g, DB, 2.6, 2.0, gg => {
    label(gg, 'DATABASE · users', DB.w / 2, -2.2, .0026, GREEN);
    ['USER', 'SALT', 'HASH'].forEach((c, i) => label(gg, c, .2 + [0, 1.6, 2.85][i], -1.75, .0016, '#9FC8AA', 'left', 'Inter'));
    [['PRIYA', GREEN, 'x7Q', '71BE·0D'], ['RAHUL', SUBJ, 'k2P', 'C94A·E3']].forEach(([n, sc, sv, hv], i) => { const y = -1.25 + i * .55;
      label(gg, n, .2, y, .0019, '#DFFFE6', 'left');       sticker(gg, 1.9, y - .07, css(mix(C.ghost, sc, s)), .14, s); label(gg, sv, 2.08, y, .0016, css(mix('#6F8F78', '#DFFFE6', s)), 'left', 'Inter');
      label(gg, hv, 3.05, y, .0021, css(mix('#6F8F78', i ? SUBJ : GREEN, hh)), 'left', 'Inter'); });
  });
  onPlane(g, 16.6, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  // quiz board
  const q = on(t, [[T_Q, DUR]]);
  board(g, QB, 2.5, 1.7, gg => { label(gg, 'SALT', QB.w / 2, -1.85, .0036, SUBJ); label(gg, 'secret?', QB.w / 2, -1.3, .0036, css(mix('#6F8F78', '#DFFFE6', q))); lamp(gg, QB.w / 2, -.95, q, SUBJ); });
}

function card(x, y, z, txt, col, a, stk = 0, glow = 0) { // floating card (billboard)
  if (a <= .01) return;
  iso.bill(x, y, z, gg => { gg.globalAlpha = a; gg.fillStyle = DARK; gg.beginPath(); gg.roundRect(-.55, -.32, 1.1, .4, .06); gg.fill();
    gg.strokeStyle = col; gg.lineWidth = .04; gg.stroke(); label(gg, txt, stk ? -.08 : 0, -.04, .0019, col, 'center', 'Inter');
    if (stk) sticker(gg, .4, -.12, GREEN, .12, glow); gg.globalAlpha = 1; }, { bias: 3, cull: false });
}
function props(t) {
  // hash machine: orange body, green screen
  const run = Math.max(on(t, [[T_IN, T_OUT + .3]]), on(t, [[T_STK, T_STK + 1.2]]));
  iso.box(MX, MY, 0, 1.0, .8, 1.25, tri(SUBJ), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.fillStyle = css(mix(DARK, GREEN, .15 + .5 * run)); gg.fillRect(.12, -1.1, b.w - .24, .5); label(gg, 'HASH', b.w / 2, -.75, .0024, run > .5 ? DARK : GREEN, 'center', 'Inter');
      gg.fillStyle = DARK; gg.fillRect(.2, -.35, b.w - .4, .08); });
  } });
  // password card -> machine -> code card
  const inA = on(t, [[v(11.0), T_IN + .6]]) , slide = eio(seg(t, T_IN, T_IN + .6));
  card(MX + .5 + lerp(-1.1, 0, slide), MY + .4, lerp(1.9, 1.35, slide), 'sunflower', WHITE, inA * (1 - slide * .9), 1, on(t, [[T_STK, v(36)]]));
  const outA = on(t, [[T_OUT, v(20.0)]]), back = on(t, [[T_BACK, v(19.0)]]);
  card(MX + .5 + 1.2, MY + .4, 1.9 + .25 * eo(seg(t, T_OUT, T_OUT + .4)), '71BE·0D', GREEN, outA);
  // part 4: sticker card again above the machine
  const s4 = on(t, [[v(31.6), v(36.0)]]);
  card(MX + .5, MY + .4, 2.0, 'sunflower', WHITE, s4, 1, on(t, [[T_STK, v(36)]]));
  // turnstile gate with a reader that hashes again
  const gx = 2.3;
  iso.box(gx, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  iso.box(gx + 1.9, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  const gop = eio(seg(t, T_GOPEN, T_GOPEN + .5)), lw = 1.65 * (1 - gop);
  if (lw > .02) iso.box(gx + .25, GATE_Y + .1, .1, lw, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  const rd = on(t, [[T_GH, v(26)]]), mt = on(t, [[T_MATCH, v(26)]]);
  iso.box(gx - .05, GATE_Y - .35, 1.0, .35, .3, .08, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .09, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, mix(SUBJ, GREEN, mt), rd)); gg.fill(); });
  } });
  card(gx + 1.1, GATE_Y + .3, 2.2, '71BE·0D', GREEN, on(t, [[T_MATCH, v(26.0)]]));
  iso.box(-1.2, .2, 0, .5, 1.0, .9, tri(DARK, .25, .2), { bias: -.55 }); // guard's desk
  // rainbow-table crate in the records room
  const rb = eo(seg(t, T_RB, T_RB + .5)), dead = ss(seg(t, T_RX, T_RX + .4));
  if (rb > 0) iso.box(16.4, 1.4, 0, .9, .9, .9 * rb + .001, tri(mix(SUBJ, DARK, dead * .7)), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { const cols = [GREEN, SUBJ, WHITE, GREEN]; cols.forEach((c, i) => { gg.fillStyle = css(mix(c, DARK, dead * .8)); gg.fillRect(.1, -.8 + i * .17, b.w - .2, .09); }); });
  } });
}

function typed(t) { // part 5: both type the same password (shown above their heads, never stored)
  const a = on(t, [[v(37.4), v(42.4)]]);
  for (const i of [2, 3]) { const p = PEOPLE[i][1](t); card(p.x, p.y, 2.35, 'sunflower', WHITE, a); }
}
function people(t) { typed(t);
  for (const [pp, w] of PEOPLE) { const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  const a1 = on(t, [[T_ANS, v(10.0)]]), a2 = on(t, [[T_ANS2, v(10.0)]]);
  ring(g, 2.2, 6.9, .6, SUBJ, a1); floorLabel(g, 2.2, 6.9, 'KNOW', SUBJ, a1);
  ring(g, 3.9, 6.9, .6, SUBJ, a2); floorLabel(g, 3.9, 6.9, 'KNOW', SUBJ, a2);
  floorLabel(g, 3.05, 7.9, '= 1 factor', '#DFFFE6', a2);
  const bk = on(t, [[T_BACK, v(19.4)]]);
  if (bk > 0) { disc(g, MX + 1.6, MY + 1.4, .55, C.accent, bk * .25); ring(g, MX + 1.6, MY + 1.4, .55, C.accent, bk); floorLabel(g, MX + 1.6, MY + 1.4, '✕ back', SUBJ, bk); }
  const p = PEOPLE[0][1](t); ring(g, p.x, p.y, .55, GREEN, on(t, [[T_GOPEN, v(27.0)]]));
  const pr = PEOPLE[2][1](t), rh = PEOPLE[3][1](t), sm = on(t, [[T_H, v(47.0)]]);
  ring(g, pr.x, pr.y, .55, GREEN, sm); ring(g, rh.x, rh.y, .55, SUBJ, sm);
  const dn = on(t, [[T_RX, v(47.2)]]); if (dn > 0) { disc(g, 16.85, 2.9, .6, C.accent, dn * .25); ring(g, 16.85, 2.9, .6, C.accent, dn); }
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
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 12', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('How passwords are stored: hashing & salting', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 02 · AUTHENTICATION BASICS · 12/148', W / 2, 1808); g.letterSpacing = '0px';
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

