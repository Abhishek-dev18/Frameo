// Access Granted 14 — "Modern password rules (NIST 800-63B)"
// Debug Diaries · IAM series · Level 02 (Authentication Basics) · reel 14/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-14/p1..p6.mp3
// Story: quiz answer — the B ring lights, "symbols optional". Lobby RULES board lists the old rules (Aa · 1 · # · every
// 90 days) one by one in orange while Priya's badge tag flips Password1 → Password2. The board turns into a LENGTH meter:
// 15 cells fill green, the old rules are struck out. The guard keeps Priya's badge, checks it against the LEAK LIST board
// (no match), the gate opens and she walks through; Ravi's badge matches a leaked row, it goes orange and the guard hands
// him a fresh green badge. Signup desk: a typed password is compared against a BREACHED box, a key (password manager)
// pastes in, the security-question card is crossed out. Quiz: are brute force and credential stuffing the same attack?
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 9.52, 21.27, 29.63, 39.75, 49.14].map(v), VEND = v(58.243);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.53, 'B, no!'], [2.65, "NIST doesn't require special characters."], [6.73, 'Today:'], [7.47, "NIST's modern password rules."],
  [9.52, 'Remember the old rules?'], [10.81, 'A capital, a number, a symbol,'], [14.14, 'and a new password every 90 days.'], [16.72, 'People just turned Password1'], [18.76, 'into Password2.'],
  [21.27, 'NIST now says: length matters more.'], [23.69, 'If the password is the only factor,'], [25.34, 'at least 15 characters.'], [27.37, "And don't force composition rules."],
  [29.63, 'Think of the office lobby.'], [30.75, "The guard doesn't swap Priya's badge every month."], [34.07, "He just checks it isn't on a stolen list."], [37.15, 'Evidence of a leak?'], [38.6, 'Only then, a new badge.'],
  [39.75, 'Tech example:'], [40.74, 'at signup, compare the new password with a list of breached passwords.'], [44.59, 'Allow password managers and paste.'], [47.19, 'And drop security questions.'],
  [49.14, 'Clearance check!'], [50.23, 'Brute force and credential stuffing:'], [52.82, 'the same attack?'], [53.42, 'A, yes,'], [53.98, 'or B, no?'], [55.06, 'Answer in the next reel.'], [56.94, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 3.0, GX = 2.3;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12', WHITE = '#FFFFFF', MUTE = '#6F8F78';
const FDOOR = { x: 1.6, w: 2.2 };
const RB = { x: -2.7, w: 3.1 };            // RULES board → LENGTH meter → LEAK LIST
const SB = { x: 10.4, w: 5.2 }, QB = { x: 20.4, w: 4.0 };
const BR = { x: 13.6, y: 1.4 }, KIOSK = { x: 11.0, y: 1.6 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const RAVI = { h: 1.76, top: WHITE, legs: LEGS[1] };

// beats
const T_B = v(1.53), T_OPT = v(2.65);
const T_R = [10.81, 12.2, 13.0, 14.14].map(v), T_PW2 = v(18.76);
const T_LEN = v(21.4), T_15 = v(25.34), T_STRIKE = v(27.37);
const T_LIST = v(33.6), T_SCAN = v(34.2), T_GOPEN = v(35.4), T_GSHUT = v(37.9);
const T_LEAK = v(37.3), T_NEW = v(38.6);
const T_TYPE = v(40.74), T_CMP = v(42.4), T_KEY = v(44.59), T_SQ = v(47.19);
const T_Q = v(50.23), T_QA = v(53.42), T_QB = v(53.98);

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
  [PRIYA, walker([[0, 1.2, 6.8], [v(31.0), 1.2, 6.8], [v(33.4), LANE, 4.2], [T_GOPEN + .2, LANE, 4.2], [v(37.6), LANE, 0.0], [DUR, LANE, 0.0]])],
  [GUARD, walker([[0, 0.3, 0.9], [v(37.6), 0.3, 0.9], [v(38.3), 1.4, 3.6], [DUR, 1.4, 3.6]])],
  [RAVI, walker([[0, 5.4, 8.0], [v(35.6), 5.4, 8.0], [v(37.1), LANE, 4.4], [DUR, LANE, 4.4]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 3.6, -1.4, 74], [v(9.0), 3.2, -1.6, 79], [v(21.0), 2.8, -2.2, 79], [v(29.4), 2.8, -2.0, 79], [v(31.0), 3.2, -.8, 76], [v(39.0), 3.4, -.6, 74],
  [v(39.9), 7.2, 9.6, 82], [v(48.6), 7.2, 10.2, 84],
  [v(49.5), 11.4, 21.0, 78], [DUR, 11.4, 21.0, 76]];
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
  { t0: v(0.4), at: v(1.6), lines: [[['answer: ', 'n'], ['B · no', 'na']]], gap: .25 },
  { t0: v(3.0), at: v(5.0), lines: [[['symbols ', 'n'], ['optional', 'na']]], gap: .25 },
  { t0: v(7.0), at: v(8.6), lines: [[['modern ', 'n'], ['rules', 'na']]], gap: .25 },
  { t0: v(10.0), at: v(11.6), lines: [[['the ', 'n'], ['old', 'na'], [' rules', 'n']]], gap: .25 },
  { t0: v(14.3), at: v(16.0), lines: [[['every ', 'n'], ['90 days', 'na']]], gap: .25 },
  { t0: v(17.0), at: v(19.0), lines: [[['Password1 → ', 'n'], ['2', 'na']]], gap: .25 },
  { t0: v(21.5), at: v(23.0), lines: [[['length', 'na'], [' wins', 'n']]], gap: .25 },
  { t0: v(25.4), at: v(27.0), lines: [[['15+', 'na'], [' characters', 'n']]], gap: .25 },
  { t0: v(27.6), at: v(29.0), lines: [[['no forced ', 'n'], ['mix', 'na']]], gap: .25 },
  { t0: v(31.0), at: v(32.6), lines: [[['no ', 'n'], ['monthly', 'na'], [' swap', 'n']]], gap: .25 },
  { t0: v(34.2), at: v(35.6), lines: [[['check the ', 'n'], ['leak list', 'na']]], gap: .25 },
  { t0: v(37.3), at: v(38.8), lines: [[['leaked → ', 'n'], ['new', 'na']]], gap: .25 },
  { t0: v(41.0), at: v(42.8), lines: [[['block ', 'n'], ['breached', 'na']]], gap: .25 },
  { t0: v(44.7), at: v(46.0), lines: [[['allow ', 'n'], ['paste', 'na']]], gap: .25 },
  { t0: v(46.6), at: v(48.0), lines: [[['no ', 'n'], ['secret Qs', 'na']]], gap: .25 },
  { t0: v(50.4), at: v(52.4), lines: [[['same ', 'n'], ['attack?', 'na']]], gap: .25 },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1330;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .11, scale: .56, dv: 1.6, indent: .4 });
  P.lineGap = P.gap;
  const L = phraseLayout(P);
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
E(T_B, 'lamp');
T_R.forEach(t => E(t, 'tick')); E(T_PW2, 'deny');
for (let i = 0; i < 15; i++) if (i % 3 === 0) E(T_LEN + 1.4 + i * .2, 'lamp');
E(T_15, 'beep'); E(T_STRIKE, 'lock');
E(T_SCAN, 'tick'); E(T_GOPEN - .1, 'beep'); E(T_GOPEN, 'gate'); E(T_GSHUT, 'lock');
E(T_LEAK, 'deny'); E(T_NEW, 'beep');
E(T_TYPE, 'tick'); E(T_CMP, 'deny'); E(T_KEY, 'beep'); E(T_SQ, 'lock');
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
function ring(g, x, y, r, col, a, lw = .07) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.strokeStyle = col; gg.lineWidth = lw; gg.stroke(); }); }
function floorLabel(g, x, y, s, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.fillStyle = col; gg.font = font(700, 100); gg.textAlign = 'center'; gg.save(); gg.scale(.0045, .0045); gg.fillText(s, 0, 35); gg.restore(); }); }
const on = (t, ranges) => { let a = 0; for (const [t0, t1] of ranges) a = Math.max(a, ss(seg(t, t0, t0 + .3)) * (1 - ss(seg(t, t1 - .3, t1)))); return a; };
function lamp(gg, x, y, lit, col) {
  gg.beginPath(); gg.arc(x, y, .12, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, col, lit)); gg.fill();
  if (lit > .01) { gg.globalAlpha = lit * .4; gg.beginPath(); gg.arc(x, y, .24, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); gg.globalAlpha = 1; }
}
function label(gg, s, x, y, sc = .0026, col = C.ink, al = 'center', fam = 'Newsreader') { gg.fillStyle = col; gg.font = font(600, 100, fam); gg.textAlign = al; gg.save(); gg.translate(x, y); gg.scale(sc, sc); gg.fillText(s, 0, 0); gg.restore(); }
function board(g, B, top, h, fn) { onPlane(g, B.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(0, -top, B.w, h); gg.strokeStyle = SUBJ; gg.lineWidth = .06; gg.strokeRect(0, -top, B.w, h); fn(gg); }); }

// which face the lobby board shows: 0 rules, 1 length, 2 leak list
function rbMode(t) { return t < T_LEN ? 0 : t < v(31.0) ? 1 : 2; }
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [2.6, 6.6]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  const open = on(t, [[T_GOPEN, T_GSHUT]]);
  onPlane(g, FDOOR.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = hex(mix(mix(DARK, GREEN, .3), GREEN, open)); gg.fillRect(0, -2.2, FDOOR.w, 2.2); gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, FDOOR.w, 2.2); label(gg, 'OFFICE', FDOOR.w / 2, -2.45); });
  onPlane(g, 4.8, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  // lobby board
  const m = rbMode(t);
  board(g, RB, 2.55, 2.2, gg => {
    if (m === 0) {
      label(gg, 'PASSWORD RULES', RB.w / 2, -2.18, .0024, SUBJ);
      [['Aa', 'a capital'], ['1', 'a number'], ['#', 'a symbol'], ['90', 'days, then change']].forEach(([a, b], i) => {
        const lit = ss(seg(t, T_R[i], T_R[i] + .3)), y = -1.7 + i * .42;
        label(gg, a, .32, y, .0024, css(mix(MUTE, SUBJ, lit)), 'center', 'Inter');
        label(gg, b, .65, y, .0019, css(mix(MUTE, '#DFFFE6', lit)), 'left', 'Inter');
        lamp(gg, RB.w - .3, y - .07, lit, SUBJ);
      });
    } else if (m === 1) {
      label(gg, 'LENGTH', RB.w / 2, -2.18, .0026, GREEN);
      for (let i = 0; i < 15; i++) { const lit = ss(seg(t, T_LEN + 1.4 + i * .2, T_LEN + 1.6 + i * .2)), cw = (RB.w - .4) / 15;
        gg.fillStyle = css(mix('#0B2412', GREEN, lit)); gg.fillRect(.2 + i * cw + .02, -1.85, cw - .04, .42); }
      label(gg, '15+', RB.w / 2, -1.05, .0036, css(mix(MUTE, GREEN, ss(seg(t, T_15, T_15 + .3)))), 'center', 'Inter');
      const st = ss(seg(t, T_STRIKE, T_STRIKE + .3));
      label(gg, 'Aa  1  #  90d', RB.w / 2, -.5, .0022, css(mix('#DFFFE6', SUBJ, st)), 'center', 'Inter');
      if (st > .01) { gg.strokeStyle = SUBJ; gg.lineWidth = .06; gg.beginPath(); gg.moveTo(.6, -.57); gg.lineTo(.6 + (RB.w - 1.2) * st, -.57); gg.stroke(); }
    } else {
      label(gg, 'LEAK LIST', RB.w / 2, -2.18, .0026, SUBJ);
      const hitP = on(t, [[T_SCAN, T_GOPEN + .8]]), hitR = on(t, [[T_LEAK, DUR]]);
      ['K7-QX', 'M2-ZA', 'R4-TB', 'P9-LC'].forEach((s, i) => { const y = -1.7 + i * .42, h = i === 2 ? hitR : 0;
        if (h > .01) { gg.globalAlpha = h * .5; gg.fillStyle = SUBJ; gg.fillRect(.15, y - .3, RB.w - .3, .38); gg.globalAlpha = 1; }
        label(gg, s, .4, y, .0021, css(mix(MUTE, '#DFFFE6', .6 + .4 * h)), 'left', 'Inter'); });
      label(gg, 'Priya: no match', RB.w - .2, -.25, .0015, css(mix(MUTE, GREEN, hitP)), 'right', 'Inter');
      lamp(gg, .35, -.3, hitP, GREEN);
    }
  });
  // signup board
  board(g, SB, 2.6, 2.0, gg => {
    label(gg, 'SIGNUP CHECKS', SB.w / 2, -2.2, .0026, GREEN);
    [['vs breached list', T_CMP, true], ['managers + paste', T_KEY, true], ['security questions', T_SQ, false]].forEach(([n, tt, ok], i) => { const y = -1.6 + i * .5, a = ss(seg(t, tt, tt + .3));
      label(gg, n, .3, y, .0021, css(mix(MUTE, ok ? '#DFFFE6' : SUBJ, a)), 'left', 'Inter');
      label(gg, ok ? '✓' : '✕', SB.w - .4, y, .0026, css(mix(MUTE, ok ? GREEN : SUBJ, a)), 'center', 'Inter'); });
  });
  onPlane(g, 16.6, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  const q = on(t, [[T_Q, DUR]]);
  board(g, QB, 2.5, 1.8, gg => { label(gg, 'BRUTE FORCE', QB.w / 2, -1.95, .0026, SUBJ); label(gg, '= ?', QB.w / 2, -1.4, .0034, css(mix(MUTE, '#DFFFE6', q))); label(gg, 'CRED STUFFING', QB.w / 2, -.9, .0026, SUBJ); lamp(gg, QB.w / 2, -.45, q, SUBJ); });
}

function badge(x, y, z, col, a, sc = 1, txt) {
  if (a <= .01) return;
  iso.bill(x, y, z, gg => { gg.globalAlpha = a; gg.fillStyle = '#EEC677'; gg.beginPath(); gg.roundRect(-.13 * sc, -.18 * sc, .26 * sc, .2 * sc, .03); gg.fill();
    gg.fillStyle = col; gg.fillRect(-.09 * sc, -.15 * sc, .18 * sc, .05 * sc);
    if (txt) { gg.fillStyle = 'rgba(4,8,5,.88)'; gg.beginPath(); gg.roundRect(-.55, -.62, 1.1, .3, .06); gg.fill(); label(gg, txt, 0, -.41, .0021, col, 'center', 'Inter'); }
    gg.globalAlpha = 1; }, { bias: 3, cull: false });
}
function props(t) {
  // turnstile gate + reader
  iso.box(GX, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  iso.box(GX + 1.9, GATE_Y - .1, 0, .25, .5, 1.0, tri(SUBJ), { bias: -.5 });
  const gop = eio(seg(t, T_GOPEN, T_GOPEN + .5)) * (1 - eio(seg(t, T_GSHUT, T_GSHUT + .5))), lw = 1.65 * (1 - gop);
  if (lw > .02) iso.box(GX + .25, GATE_Y + .1, .1, lw, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  const ok = on(t, [[T_GOPEN - .1, T_GOPEN + 1.2]]), bad = on(t, [[T_LEAK, T_NEW]]);
  iso.box(GX + 1.85, GATE_Y + .25, 1.0, .35, .3, .08, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .09, 0, Math.PI * 2); gg.fillStyle = css(mix(mix(C.ghost, GREEN, ok), SUBJ, bad)); gg.fill(); });
  } });
  iso.box(-1.2, .2, 0, .5, 1.0, .9, tri(DARK, .25, .2), { bias: -.55 }); // guard's desk
  // Priya's badge with a name tag (part 2), then her same badge at the gate (part 4)
  const pp = PEOPLE[0][1](t);
  const tagA = on(t, [[v(16.4), v(21.2)]]), pw = t < T_PW2 ? 'Password1' : 'Password2';
  badge(pp.x + .3, pp.y - .15, 1.15, t < T_PW2 ? GREEN : SUBJ, Math.max(tagA, on(t, [[v(31.2), T_GOPEN + .6]])), 1.2, tagA > .01 ? pw : null);
  // Ravi's badge: leaked (orange) → fresh one from the guard (green)
  const rv = PEOPLE[2][1](t);
  badge(rv.x + .3, rv.y - .15, 1.15, SUBJ, on(t, [[v(36.6), T_NEW]]), 1.2, t >= T_LEAK ? 'LEAKED' : null);
  const gd = PEOPLE[1][1](t), fl = seg(t, T_NEW - .5, T_NEW);
  if (t > T_NEW - .5 && t < DUR) badge(lerp(gd.x + .3, rv.x + .3, eo(fl)), lerp(gd.y, rv.y - .15, eo(fl)), 1.15 + Math.sin(fl * Math.PI) * .3, GREEN, on(t, [[T_NEW - .5, v(39.6)]]), 1.2, fl >= 1 ? 'NEW' : null);
  // signup kiosk with a password field
  const ty = clamp(seg(t, T_TYPE, T_TYPE + 1.4));
  iso.box(KIOSK.x, KIOSK.y, 0, .8, .6, 1.1, tri(SUBJ), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(.08, -1.0, b.w - .16, .36);
      gg.fillStyle = css(mix(GREEN, SUBJ, on(t, [[T_CMP, T_KEY]]))); const n = Math.floor(ty * 8); for (let i = 0; i < n; i++) { gg.beginPath(); gg.arc(.16 + i * .075, -.82, .025, 0, Math.PI * 2); gg.fill(); } });
  } });
  // BREACHED box: stacked list rows; a compare beam from the kiosk
  const cmp = on(t, [[T_CMP - .4, T_CMP + 1.4]]);
  iso.box(BR.x, BR.y, 0, 1.3, .9, 1.4, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { label(gg, 'BREACHED', b.w / 2, -1.18, .0021, SUBJ, 'center', 'Inter');
      for (let i = 0; i < 5; i++) { gg.fillStyle = css(mix('#0B2412', SUBJ, i === 2 ? cmp : .35)); gg.fillRect(.15, -1.0 + i * .18, b.w - .3, .1); } });
  } });
  if (cmp > .01) iso.bill((KIOSK.x + BR.x + 1.0) / 2, KIOSK.y + .8, 1.0, gg => { gg.globalAlpha = cmp; gg.strokeStyle = SUBJ; gg.lineWidth = .05; gg.setLineDash([.12, .08]); gg.beginPath(); gg.moveTo(-1.1, 0); gg.lineTo(1.1, 0); gg.stroke(); gg.setLineDash([]); gg.globalAlpha = 1; }, { bias: 3, cull: false });
  // password-manager key flies into the kiosk
  const kf = seg(t, T_KEY - .2, T_KEY + .6), ka = on(t, [[T_KEY - .2, v(48.9)]]);
  if (ka > .01) iso.bill(lerp(KIOSK.x - 1.2, KIOSK.x + .4, eo(kf)), KIOSK.y + 1.2, 1.4 + .2 * Math.sin(kf * Math.PI), gg => { gg.globalAlpha = ka;
    gg.fillStyle = '#F1C474'; gg.beginPath(); gg.arc(-.12, -.1, .1, 0, Math.PI * 2); gg.fill(); gg.fillRect(-.04, -.13, .3, .06); gg.fillRect(.16, -.1, .04, .08); gg.fillRect(.08, -.1, .04, .06);
    gg.fillStyle = DARK; gg.beginPath(); gg.arc(-.12, -.1, .04, 0, Math.PI * 2); gg.fill(); gg.globalAlpha = 1; }, { bias: 3, cull: false });
  // security-question card, crossed out
  const sq = on(t, [[v(45.8), v(49.4)]]), sx = ss(seg(t, T_SQ, T_SQ + .4));
  if (sq > .01) iso.bill(BR.x + 2.2, BR.y + 1.4, 1.1, gg => { gg.globalAlpha = sq; gg.fillStyle = '#EEC677'; gg.beginPath(); gg.roundRect(-.45, -.6, .9, .55, .05); gg.fill();
    label(gg, "pet's name?", 0, -.27, .0019, DARK, 'center', 'Inter');
    if (sx > .01) { gg.strokeStyle = SUBJ; gg.lineWidth = .07; gg.beginPath(); gg.moveTo(-.4, -.55); gg.lineTo(-.4 + .8 * sx, -.1); gg.moveTo(.4, -.55); gg.lineTo(.4 - .8 * sx, -.1); gg.stroke(); }
    gg.globalAlpha = 1; }, { bias: 3, cull: false });
}

function people(t) {
  for (const [pp, w] of PEOPLE) { const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  const endP1 = v(9.3);
  const aA = on(t, [[v(.9), endP1]]), aB = on(t, [[T_B, endP1]]);
  ring(g, 1.0, 8.6, .55, MUTE, aA); floorLabel(g, 1.0, 8.6, 'A', MUTE, aA);
  ring(g, 2.6, 8.6, .55, GREEN, aB); floorLabel(g, 2.6, 8.6, 'B', GREEN, aB);
  const p = PEOPLE[0][1](t);
  ring(g, p.x, p.y, .55, SUBJ, on(t, [[v(16.4), v(21.2)]]));
  ring(g, p.x, p.y, .55, GREEN, on(t, [[T_SCAN, v(37.8)]]));
  const r = PEOPLE[2][1](t); ring(g, r.x, r.y, .55, SUBJ, on(t, [[T_LEAK, T_NEW]])); ring(g, r.x, r.y, .55, GREEN, on(t, [[T_NEW, v(39.6)]]));
  const endA = 1 - ss(seg(t, DUR - 1.2, DUR - .6));
  ring(g, 21.4, 1.6, .55, GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA); floorLabel(g, 21.4, 1.6, 'A', GREEN, ss(seg(t, T_QA, T_QA + .3)) * endA);
  ring(g, 23.0, 1.6, .55, C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA); floorLabel(g, 23.0, 1.6, 'B', C.accent, ss(seg(t, T_QB, T_QB + .3)) * endA);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 14', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Modern password rules (NIST 800-63B)', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 02 · AUTHENTICATION BASICS · 14/148', W / 2, 1808); g.letterSpacing = '0px';
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
window.render = t => { render(g, t);
  if (!window.__bc) { window.__bc = document.createElement('canvas'); window.__bc.width = W; window.__bc.height = H; }
  const bx = window.__bc.getContext('2d'); bx.clearRect(0, 0, W, H);
  bx.filter = 'blur(12px)'; bx.drawImage(cv, 0, 0); bx.filter = 'none';
  g.save(); g.globalCompositeOperation = 'screen'; g.globalAlpha = .75; g.drawImage(window.__bc, 0, 0); g.restore(); };
window.READY = true;
