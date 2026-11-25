// Access Granted 15 — "Brute force vs credential stuffing vs password spraying"
// Debug Diaries · IAM series · Level 02 (Authentication Basics) · reel 15/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-15/p1..p6.mp3
// Story: quiz answer — the B ring lights while Priya walks through her own door with her badge. A row of five account
// doors (priya, ravi, asha, dev, meera) on the lobby wall. Brute force: one attacker hammers the priya door, badges fly
// at its reader and a tries counter races up. Credential stuffing: a LEAK crate from "another site" spills email+password
// cards; a second attacker takes asha's pair and her door opens — REUSED. Spraying: a third attacker walks the whole row
// with one common password, one try per door, each door's lockout meter only reaches 1/5. The guard's FAILED LOGINS board:
// one door = alarm, one try at every door = a pattern only seen across the lobby. DEFENCES board ticks MFA, breached-
// password check, failures tracked across accounts. Quiz: what does account lockout stop best?
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 9.171, 15.795, 25.989, 33.801, 48.826].map(v), VEND = v(58.379);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.341, 'B, no!'], [2.732, 'These are three different attacks.'], [4.116, 'Today: brute force,'], [5.98, 'credential stuffing'], [7.057, 'and password spraying.'],
  [9.171, 'Brute force: trying thousands of passwords on one account.'], [13.041, 'One by one,'], [14.191, 'until one works.'],
  [15.795, 'Credential stuffing: the attacker takes real email + password pairs'], [18.9, 'leaked from some other site,'], [21.6, 'and tries them here.'], [23.397, 'Password reuse'], [24.768, 'is its fuel.'],
  [25.989, 'Password spraying is the reverse:'], [27.578, 'one common password, on thousands of accounts.'], [29.886, 'Just one or two tries per account,'], [32.195, 'so lockout never triggers.'],
  [33.801, 'Think of the office lobby.'], [35.212, 'Wrong badge at the same door again and again? Alarm.'], [38.228, 'But one try at every door?'], [39.6, 'You have to see that pattern across the whole lobby.'],
  [42.661, 'In tech: MFA,'], [44.296, 'a breached-password check,'], [45.84, 'and track login failures across all accounts.'],
  [48.826, 'Clearance check!'], [49.84, 'What does account lockout stop best?'], [52.175, 'A, brute force,'], [53.854, 'or B, password spraying?'], [55.793, 'Answer in the next reel.'], [57.112, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12', WHITE = '#FFFFFF', MUTE = '#6F8F78';
const DOORS = ['priya', 'ravi', 'asha', 'dev', 'meera'].map((n, i) => ({ n, x: -1.0 + i * 2.4, w: 1.6 }));
const dc = i => DOORS[i].x + DOORS[i].w / 2;
const LB = { x: 12.6, w: 3.6 }, DB = { x: 17.0, w: 3.6 }, QB = { x: 22.0, w: 4.2 };
const CRATE = { x: 6.6, y: 1.8 }, DESK = { x: 13.4, y: 1.0 };
const PRIYA = { h: 1.66, top: TOPS[0], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: WHITE, legs: LEGS[2] };
const A1 = { h: 1.78, top: SUBJ, legs: LEGS[1] }, A2 = { h: 1.72, top: SUBJ, legs: LEGS[1], hairLong: true }, A3 = { h: 1.82, top: SUBJ, legs: LEGS[1] };

// beats
const T_B = v(1.341), T_POPEN = v(4.6), T_PSHUT = v(7.4);
const T_BF0 = v(11.0), T_BF1 = v(14.3), T_BFOK = v(14.6);
const T_LEAK = v(17.0), T_PICK = v(21.4), T_AOPEN = v(23.4), T_ASHUT = v(25.6);
const T_SP0 = v(27.4), T_SP1 = v(32.6);
const T_ALARM = v(36.6), T_PAT = v(39.8);
const T_D = [43.47, 44.3, 45.84].map(v);
const T_Q = v(49.84), T_QA = v(52.175), T_QB = v(53.854);

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

// spraying walk: door 5 → door 1 along the wall, a short stop at each door
const SPK = [[0, dc(4) + 1.0, 1.6], [T_SP0 - 1.0, dc(4) + 1.0, 1.6], [T_SP0, dc(4), -.5]];
for (let i = 3; i >= 0; i--) { const tA = lerp(T_SP0 + .3, T_SP1, (4 - i - .5) / 4), tB = lerp(T_SP0 + .3, T_SP1, (4 - i) / 4); SPK.push([tA, dc(i + 1), -.5], [tB, dc(i), -.5]); }
SPK.push([DUR, dc(0), -.5]);
const sprayHit = DOORS.map((_, i) => i === 4 ? T_SP0 + .1 : SPK.find(k => Math.abs(k[1] - dc(i)) < .01 && k[0] > T_SP0)[0] + .05);

const PEOPLE = [
  [PRIYA, walker([[0, dc(1), 3.4], [v(1.2), dc(1), 3.4], [T_POPEN, dc(1), -.3], [v(6.6), dc(1), -1.6], [DUR, dc(1), -9]])],
  [A1, walker([[0, dc(0) + .6, 4.2], [v(9.4), dc(0) + .6, 4.2], [T_BF0 - .1, dc(0) + .4, -.4], [v(16.0), dc(0) + .4, -.4], [v(18.0), -2.2, 1.2], [DUR, -2.2, 1.2]])],
  [A2, walker([[0, CRATE.x + .9, CRATE.y + 1.2], [T_PICK, CRATE.x + .9, CRATE.y + 1.2], [T_AOPEN - .2, dc(2), -.3], [v(24.6), dc(2), -1.6], [DUR, dc(2), -9]])],
  [A3, walker(SPK)],
  [GUARD, walker([[0, DESK.x + .5, DESK.y + 2.2], [v(34.6), DESK.x + .5, DESK.y + 2.2], [v(36.2), DESK.x + 1.6, DESK.y + .3], [DUR, DESK.x + 1.6, DESK.y + .3]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 1.9, -0.2, 78], [v(8.6), 1.9, -0.2, 79], [v(9.6), 1.6, 0.4, 79], [v(15.2), 1.6, 0.6, 79],
  [v(16.4), 2.9, 4.4, 74], [v(25.2), 2.7, 5.0, 76],
  [v(26.4), 3.2, 4.8, 60], [v(33.2), 3.2, 4.8, 60],
  [v(34.4), 7.4, 15.4, 74], [v(41.8), 7.4, 15.6, 76], [v(42.8), 9.4, 19.8, 76], [v(48.2), 9.4, 20.0, 77],
  [v(49.2), 11.6, 25.4, 74], [DUR, 11.6, 25.4, 72]];
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
  { t0: v(0.4), at: v(1.6), lines: [[['answer: ', 'n'], ['B · no', 'na']]] },
  { t0: v(3.0), at: v(4.6), lines: [[['three ', 'n'], ['attacks', 'na']]] },
  { t0: v(9.5), at: v(11.2), lines: [[['one door, ', 'n'], ['many tries', 'na']]] },
  { t0: v(16.6), at: v(18.4), lines: [[['leaked ', 'n'], ['pairs', 'na']]] },
  { t0: v(23.5), at: v(24.8), lines: [[['reuse', 'na'], [' = fuel', 'n']]] },
  { t0: v(26.4), at: v(28.0), lines: [[['one ', 'n'], ['password', 'na']]] },
  { t0: v(29.9), at: v(31.0), lines: [[['every ', 'n'], ['door', 'na']]] },
  { t0: v(32.2), at: v(33.2), lines: [[['under ', 'n'], ['lockout', 'na']]] },
  { t0: v(35.4), at: v(36.8), lines: [[['same door: ', 'n'], ['alarm', 'na']]] },
  { t0: v(39.0), at: v(40.6), lines: [[['see the ', 'n'], ['pattern', 'na']]] },
  { t0: v(43.0), at: v(44.6), lines: [[['MFA', 'na'], [' + checks', 'n']]] },
  { t0: v(50.0), at: v(51.6), lines: [[['lockout ', 'n'], ['stops?', 'na']]] },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; P.gap = .25; });
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
// a floor point under a screen point at time t (for rings)
function under(t, sx, sy) { const keep = iso.cam; iso.cam = camAt(t); const p = iso.unP(sx, sy, 0); iso.cam = keep; return p; }
const RA = under(v(2), 400, 1130), RB = under(v(2), 680, 1130);
const QA = under(v(52), 400, 1150), QBp = under(v(52), 680, 1150);

// ---------- events (sound) ----------
const EV = [];
const E = (t, type, o = {}) => EV.push({ t: +t.toFixed(3), type, ...o });
PART.forEach((t, i) => E(Math.max(0, t - .05), 'chord', { i }));
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
for (const [, w] of PEOPLE) { let last = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = w(t); if (!p.walking) { last = -1; continue; } const n = Math.floor(p.phase / Math.PI); if (n !== last) { if (last >= 0) E(t, 'step'); last = n; } } }
E(T_B, 'lamp'); E(T_POPEN - .1, 'beep'); E(T_POPEN, 'gate'); E(T_PSHUT, 'lock');
for (let t = T_BF0; t < T_BF1; t += .33) E(t, 'tick');
E(T_BFOK, 'beep');
E(T_LEAK, 'deny'); E(T_PICK, 'tick'); E(T_AOPEN - .1, 'beep'); E(T_AOPEN, 'gate'); E(T_AOPEN + .5, 'deny'); E(T_ASHUT, 'lock');
sprayHit.forEach(t => E(t, 'tick'));
E(T_SP1 - .3, 'lamp');
E(T_ALARM, 'deny'); E(T_PAT, 'lamp');
T_D.forEach(t => E(t, 'beep'));
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
function lamp(gg, x, y, lit, col, r = .12) {
  gg.beginPath(); gg.arc(x, y, r, 0, Math.PI * 2); gg.fillStyle = css(mix(C.ghost, col, lit)); gg.fill();
  if (lit > .01) { gg.globalAlpha = lit * .4; gg.beginPath(); gg.arc(x, y, r * 2, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); gg.globalAlpha = 1; }
}
function label(gg, s, x, y, sc = .0026, col = C.ink, al = 'center', fam = 'Newsreader') { gg.fillStyle = col; gg.font = font(600, 100, fam); gg.textAlign = al; gg.save(); gg.translate(x, y); gg.scale(sc, sc); gg.fillText(s, 0, 0); gg.restore(); }
function board(g, B, top, h, fn) { onPlane(g, B.x, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(0, -top, B.w, h); gg.strokeStyle = SUBJ; gg.lineWidth = .06; gg.strokeRect(0, -top, B.w, h); fn(gg); }); }

// state of each door: open amount, lamp colour mix
function doorOpen(i, t) { return i === 1 ? on(t, [[T_POPEN, T_PSHUT]]) : i === 2 ? on(t, [[T_AOPEN, T_ASHUT]]) : 0; }
function sprayed(i, t) { return ss(seg(t, sprayHit[i], sprayHit[i] + .25)); }
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [2.6, 6.6]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  // the five account doors
  const brute = t > T_BF0 && t < T_BF1 ? (Math.sin((t - T_BF0) * Math.PI * 2 / .33) > 0 ? 1 : .3) : 0;
  DOORS.forEach((D, i) => {
    const open = doorOpen(i, t);
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = hex(mix(mix(DARK, GREEN, .28), GREEN, open)); gg.fillRect(0, -2.1, D.w, 2.1);
      gg.strokeStyle = SUBJ; gg.lineWidth = .07; gg.strokeRect(0, -2.1, D.w, 2.1);
      label(gg, D.n, D.w / 2, -2.32, .0022, '#DFFFE6', 'center', 'Inter');
      // door lamp: orange on failed tries, green when it opens
      let col = SUBJ, lit = 0;
      if (i === 0) { lit = Math.max(brute, 0); const ok = on(t, [[T_BFOK, v(15.6)]]); if (ok > .01) { col = GREEN; lit = ok; } }
      if (i === 2) { const op = on(t, [[T_AOPEN - .1, T_ASHUT]]); if (op > .01) { col = GREEN; lit = op; } }
      if (i === 1) { const op = on(t, [[T_POPEN - .1, T_PSHUT]]); if (op > .01) { col = GREEN; lit = op; } }
      const sp = on(t, [[sprayHit[i], sprayHit[i] + .6]]); if (sp > lit && t > T_SP0 - .2) { col = SUBJ; lit = sp; }
      lamp(gg, D.w + .22, -1.25, lit, col, .1);
      // lockout meter: 5 pips under the name; spraying lights only the first
      const show = on(t, [[T_SP0 - .4, v(33.6)]]);
      if (show > .01) { gg.globalAlpha = show; for (let p = 0; p < 5; p++) { gg.fillStyle = css(mix('#0B2412', SUBJ, p === 0 ? sprayed(i, t) : 0)); gg.fillRect(.18 + p * .26, -1.92, .2, .14); }
        label(gg, `${sprayed(i, t) > .5 ? 1 : 0}/5`, D.w / 2, -1.5, .0024, css(mix(MUTE, '#DFFFE6', sprayed(i, t))), 'center', 'Inter'); gg.globalAlpha = 1; }
    });
  });
  // brute-force tries counter above the priya door
  const ca = on(t, [[T_BF0 - .2, v(15.8)]]);
  if (ca > .01) onPlane(g, DOORS[0].x, WALL_Y + .003, 0, 'xz', gg => { gg.globalAlpha = ca;
    const n = Math.floor(9999 * Math.pow(clamp(seg(t, T_BF0, T_BF1)), 1.6));
    gg.fillStyle = 'rgba(4,8,5,.88)'; gg.fillRect(-.1, -1.7, DOORS[0].w + .2, .5);
    label(gg, `tries ${n.toLocaleString('en-US')}`, DOORS[0].w / 2, -1.33, .0022, t > T_BFOK ? GREEN : SUBJ, 'center', 'Inter'); gg.globalAlpha = 1; });
  // FAILED LOGINS board
  board(g, LB, 2.6, 2.2, gg => {
    label(gg, 'FAILED LOGINS', LB.w / 2, -2.22, .0024, SUBJ);
    label(gg, 'one door', LB.w * .25, -.55, .0019, '#DFFFE6', 'center', 'Inter');
    label(gg, 'every door', LB.w * .7, -.55, .0019, '#DFFFE6', 'center', 'Inter');
    for (let p = 0; p < 5; p++) { const a = ss(seg(t, v(35.4) + p * .22, v(35.6) + p * .22)); gg.fillStyle = css(mix('#0B2412', SUBJ, a)); gg.fillRect(LB.w * .25 - .2, -.85 - p * .2, .4, .14); }
    lamp(gg, LB.w * .25, -1.95, on(t, [[T_ALARM, v(39.0)]]) * (.6 + .4 * Math.sin(t * 18)), SUBJ, .1);
    for (let c = 0; c < 5; c++) { const a = ss(seg(t, v(38.4) + c * .2, v(38.6) + c * .2)); gg.fillStyle = css(mix('#0B2412', SUBJ, a)); gg.fillRect(LB.w * .5 + c * .3, -.85, .22, .14); }
    const pa = ss(seg(t, T_PAT, T_PAT + .6));
    if (pa > .01) { gg.strokeStyle = GREEN; gg.lineWidth = .05; gg.beginPath(); gg.moveTo(LB.w * .5 - .05, -1.12); gg.lineTo(LB.w * .5 - .05 + 1.55 * pa, -1.12); gg.stroke(); label(gg, 'pattern', LB.w * .7, -1.3, .0021, GREEN, 'center', 'Inter'); }
  });
  // DEFENCES board
  board(g, DB, 2.6, 2.2, gg => {
    label(gg, 'DEFENCES', DB.w / 2, -2.22, .0026, GREEN);
    ['MFA', 'breached-password check', 'failures across accounts'].forEach((n, i) => { const y = -1.6 + i * .5, a = ss(seg(t, T_D[i], T_D[i] + .3));
      label(gg, n, .3, y, .0019, css(mix(MUTE, '#DFFFE6', a)), 'left', 'Inter');
      label(gg, '✓', DB.w - .3, y, .0026, css(mix(MUTE, GREEN, a)), 'center', 'Inter'); });
  });
  onPlane(g, 21.0 - 1.4, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 1.6, 1.0); gg.fillStyle = DARK; gg.fillRect(.77, -2.3, .06, 1.0); });
  const q = on(t, [[T_Q, DUR]]);
  board(g, QB, 2.5, 1.9, gg => { label(gg, 'ACCOUNT LOCKOUT', QB.w / 2, -2.0, .0026, SUBJ); label(gg, 'stops best?', QB.w / 2, -1.5, .0028, css(mix(MUTE, '#DFFFE6', q)));
    label(gg, 'A  brute force', QB.w / 2, -1.0, .0021, css(mix(MUTE, GREEN, ss(seg(t, T_QA, T_QA + .3)))), 'center', 'Inter');
    label(gg, 'B  spraying', QB.w / 2, -.65, .0021, css(mix(MUTE, SUBJ, ss(seg(t, T_QB, T_QB + .3)))), 'center', 'Inter'); });
}

function badge(x, y, z, col, a, sc = 1, txt) {
  if (a <= .01) return;
  iso.bill(x, y, z, gg => { gg.globalAlpha = a; gg.fillStyle = '#EEC677'; gg.beginPath(); gg.roundRect(-.13 * sc, -.18 * sc, .26 * sc, .2 * sc, .03); gg.fill();
    gg.fillStyle = col; gg.fillRect(-.09 * sc, -.15 * sc, .18 * sc, .05 * sc);
    if (txt) { gg.font = font(600, 100, 'Inter'); gg.save(); gg.scale(.0021, .0021); const tw = gg.measureText(txt).width * .0021; gg.restore();
      gg.fillStyle = 'rgba(4,8,5,.88)'; gg.beginPath(); gg.roundRect(-tw / 2 - .12, -.62, tw + .24, .3, .06); gg.fill(); label(gg, txt, 0, -.41, .0021, col, 'center', 'Inter'); }
    gg.globalAlpha = 1; }, { bias: 3, cull: false });
}
function props(t) {
  // guard's desk + a server box by the wall
  iso.box(DESK.x, DESK.y, 0, 1.0, .5, .9, tri(DARK, .25, .2), { bias: -.55 });
  iso.box(DOORS[4].x + 2.2, WALL_Y + .1, 0, .7, .6, 1.3, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { for (let i = 0; i < 4; i++) { gg.fillStyle = (Math.floor(t * 3 + i) % 3) ? '#0B2412' : GREEN; gg.fillRect(.1, -1.15 + i * .25, .12, .08); } });
  } });
  // Priya's own badge (part 1)
  const pr = PEOPLE[0][1](t);
  badge(pr.x + .3, pr.y - .15, 1.15, GREEN, on(t, [[v(2.6), T_POPEN + .4]]), 1.2, 'priya');
  // brute force: badges fly from the attacker to the priya-door reader
  const a1 = PEOPLE[1][1](t);
  if (t > T_BF0 && t < T_BF1 + .3) for (let k = 0; k < 3; k++) { const f = ((t - T_BF0) / .33 + k / 3) % 1;
    badge(lerp(a1.x + .3, DOORS[0].x + DOORS[0].w + .2, f), lerp(a1.y - .1, WALL_Y + .2, f), 1.15 + Math.sin(f * Math.PI) * .25, SUBJ, (1 - f) * .9 * (t < T_BF1 ? 1 : 0)); }
  // LEAK crate: cards spill out
  const lk = on(t, [[T_LEAK - .3, v(26.0)]]);
  if (t > v(15.6)) iso.box(CRATE.x, CRATE.y, 0, 1.2, .9, .8 * eo(seg(t, v(15.6), v(16.2))) + .001, tri(SUBJ), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.fillStyle = DARK; gg.fillRect(.1, -.66, b.w - .2, .3); label(gg, 'LEAK', b.w / 2, -.45, .0021, '#DFFFE6', 'center', 'Inter'); });
  } });
  if (lk > .01) {
    const pairs = ['asha@mail · sunny12', 'dev@mail · qwerty7', 'ravi@mail · tiger99'];
    pairs.forEach((s, i) => { const rise = eo(seg(t, T_LEAK + i * .25, T_LEAK + .6 + i * .25)), gone = i === 0 ? ss(seg(t, T_PICK, T_PICK + .3)) : 0;
      if (rise > .01 && gone < .99) iso.bill(CRATE.x + .6 + (i - 1) * .1, CRATE.y + .45, .9 + rise * (.5 + i * .42), gg => { gg.globalAlpha = lk * rise * (1 - gone);
        gg.font = font(600, 100, 'Inter'); gg.save(); gg.scale(.0018, .0018); const tw = gg.measureText(s).width * .0018; gg.restore();
        gg.fillStyle = '#EEC677'; gg.beginPath(); gg.roundRect(-tw / 2 - .1, -.3, tw + .2, .27, .04); gg.fill();
        label(gg, s, 0, -.1, .0018, DARK, 'center', 'Inter'); gg.globalAlpha = 1; }, { bias: 3, cull: false }); });
  }
  // stuffing attacker carries asha's pair, door opens: REUSED
  const a2 = PEOPLE[2][1](t);
  badge(a2.x + .3, a2.y - .15, 1.15, t > T_AOPEN ? GREEN : SUBJ, on(t, [[T_PICK, T_AOPEN + 1.4]]), 1.2, t > T_AOPEN + .4 ? 'REUSED' : 'asha · sunny12');
  // spraying attacker: one common password
  const a3 = PEOPLE[3][1](t);
  badge(a3.x + .3, a3.y - .15, 1.15, SUBJ, on(t, [[T_SP0 - .6, v(33.6)]]), 1.2, 'Welcome1');
  // guard's tablet
  const gd = PEOPLE[4][1](t);
  badge(gd.x + .3, gd.y - .15, 1.15, SUBJ, on(t, [[T_ALARM, v(38.4)]]), 1.2, 'ALARM');
}

function people(t) {
  for (const [pp, w] of PEOPLE) { if (pp === A2 && t < v(15.8)) continue; const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  const endP1 = v(9.0);
  const aA = on(t, [[v(.9), endP1]]), aB = on(t, [[T_B, endP1]]);
  ring(g, RA[0], RA[1], .5, MUTE, aA); floorLabel(g, RA[0], RA[1], 'A', MUTE, aA);
  ring(g, RB[0], RB[1], .5, GREEN, aB); floorLabel(g, RB[0], RB[1], 'B', GREEN, aB);
  const a1 = PEOPLE[1][1](t); ring(g, a1.x, a1.y, .55, SUBJ, on(t, [[v(10.0), v(15.6)]]));
  const a2 = PEOPLE[2][1](t); ring(g, a2.x, a2.y, .55, SUBJ, on(t, [[T_PICK, v(25.4)]]));
  const a3 = PEOPLE[3][1](t); ring(g, a3.x, a3.y, .55, SUBJ, on(t, [[T_SP0 - .6, v(33.4)]]));
  const endA = 1 - ss(seg(t, DUR - 1.2, DUR - .6));
  const qa = ss(seg(t, T_QA, T_QA + .3)) * endA, qb = ss(seg(t, T_QB, T_QB + .3)) * endA;
  ring(g, QA[0], QA[1], .5, GREEN, qa); floorLabel(g, QA[0], QA[1], 'A', GREEN, qa);
  ring(g, QBp[0], QBp[1], .5, C.accent, qb); floorLabel(g, QBp[0], QBp[1], 'B', C.accent, qb);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 15', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Brute force vs credential stuffing vs spraying', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 02 · AUTHENTICATION BASICS · 15/148', W / 2, 1808); g.letterSpacing = '0px';
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
