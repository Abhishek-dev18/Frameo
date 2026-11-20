// Access Granted 10 — "Human vs non-human identities"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 10/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-10/p1..p6.mp3
// Story: quiz answer — a delivery robot next to Priya gets the "non-human" ring. Priya (human) logs in at the badge gate:
// badge, password lamp, MFA approve → gate opens. Machine corner: a CI box, an API key and a chat bot each open their own
// door with no person around; a workload server lights up. Night falls in the lobby: Priya crosses with her badge while the
// robot rolls through with its own key to the SERVER door — both get rings. Tech example: the CI box's secret key leaks to
// an attacker who opens CLOUD; least privilege keeps DATA/CHAT shut and a short-lived timer kills the key.
// Quiz: an OTP phone vs Priya — something you know or something you have?
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 1.0, v = x => x + VO;
const PART = [0.06, 9.25, 18.464, 28.532, 38.879, 53.366].map(v), VEND = v(62.897);
const DUR = +(VEND + 2.0).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.435, 'B, non-human!'], [3.063, "A CI pipeline's service account isn't a person."], [5.993, "Today: human vs non-human identities."],
  [9.25, 'A human identity means'], [10.608, 'a real person,'], [11.946, 'like Priya.'], [12.819, 'She logs in herself,'], [14.378, 'types her password,'], [15.708, 'and approves MFA.'],
  [18.464, 'A non-human identity means a machine:'], [20.813, 'service accounts, API keys,'], [23.323, 'bots and workloads.'], [25.136, 'They take access on their own,'], [26.601, 'with no person involved.'],
  [28.532, 'Think of the office lobby.'], [29.808, 'Priya crosses the gate with her badge.'], [31.897, 'But at night, a delivery robot'], [33.878, 'opens the server room with its own key.'], [36.036, 'Both are identities,'], [37.636, 'both need rules.'],
  [38.879, 'Tech example: a CI pipeline uses a secret key to deploy to the cloud.'], [43.902, 'If that key leaks in code,'], [45.603, 'the attacker gets the same access.'], [46.795, 'So give machine identities least privilege too,'], [51.463, 'and use short-lived tokens.'],
  [53.366, 'Clearance check!'], [54.36, 'An OTP on your phone:'], [55.613, 'which factor is it?'], [56.859, 'A, something you know,'], [58.542, 'or B, something you have?'], [60.455, 'Answer in the next reel.'], [61.635, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3;
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12';
const FDOOR = { x: 1.6, w: 1.8 }, SDOOR = { x: -0.75, w: 1.7 };
const ROOMS = [{ x: 11.4, w: 1.1, n: 'CLOUD' }, { x: 12.75, w: 1.1, n: 'DATA' }, { x: 14.1, w: 1.1, n: 'CHAT' }];
const SRV = { x: 15.7, y: -1.15, w: 1.3, d: .7, h: 1.6 };
const CI = { x: 11.5, y: 0.2 }, KEYS = { x: 12.95, y: 0.35 }, BOT = { x: 14.65, y: 0.6 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.80, top: '#D97757', legs: LEGS[2] };
const ATT = { h: 1.74, top: '#FFFFFF', legs: LEGS[1] };
const PQ = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };

// beats
const T_RB = v(1.5), T_RP = v(6.2);                       // quiz answer: robot ring, then Priya ring
const T_BADGE = v(13.0), T_PASS = v(14.5), T_MFA = v(16.0), T_GOPEN = v(17.2);
const T_M = [v(20.9), v(22.1), v(23.4)], T_WL = v(24.1), T_AUTO = v(25.3), T_AUTOEND = v(28.0);
const T_P4 = v(29.9), T_FOPEN = v(30.7), T_NIGHT = v(31.9), T_RKEY = v(33.0), T_SOPEN = v(34.4), T_BOTH = v(36.1);
const T_DEPLOY = v(40.6), T_LEAK = v(44.0), T_USE = v(46.0), T_LP = v(47.4), T_SHORT = v(51.5), T_DEAD = v(52.6);
const T_PHONE = v(54.4), T_QA = v(56.9), T_QB = v(58.6);

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
  [PRIYA, walker([[0, 2.4, 6.4], [v(11.8), 2.4, 6.4], [v(12.9), 2.4, 5.1], [T_P4, 2.4, 5.1], [v(32.6), 2.5, 0.1], [DUR, 2.5, 0.1]])],
  [GUARD, walker([[0, 1.15, 3.1], [DUR, 1.15, 3.1]])],
  [ATT, walker([[0, 13.6, 6.8], [v(44.6), 13.6, 6.8], [v(46.2), 12.0, 2.4], [DUR, 12.0, 2.4]])],
  [PQ, walker([[0, 23.6, 2.6], [DUR, 23.6, 2.6]])],
];
const ROBOT = walker([[0, 0.1, 6.7], [T_NIGHT, 0.1, 6.7], [v(32.8), 0.1, 5.2], [v(33.4), 0.1, 5.2], [v(35.6), 0.1, 0.3], [DUR, 0.1, 0.3]]);

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 3.0, -1.6, 74], [v(9.0), 3.0, -1.6, 76], [v(17.6), 2.8, -1.6, 80],
  [v(18.2), 8.3, 11.4, 76], [v(27.8), 8.3, 11.4, 78],
  [v(28.6), 2.8, -1.6, 76], [v(37.8), 2.6, -1.4, 80],
  [v(38.6), 8.3, 11.4, 76], [v(52.8), 8.3, 11.4, 78],
  [v(53.6), 12.0, 21.0, 84], [DUR, 12.0, 21.0, 80]];
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
  { t0: v(0.4), at: v(2.0), lines: [[['answer: ', 'n'], ['non-human', 'na']]], gap: .25 },
  { t0: v(6.0), at: v(7.4), lines: [[['human', 'na'], [' vs', 'n']], [['non-human', 'ns']]], l2: v(7.4) },
  { t0: v(9.4), at: v(11.0), lines: [[['human = a ', 'n'], ['person', 'na']]], gap: .25 },
  { t0: v(12.9), at: v(15.5), lines: [[['badge · password', 'n']], [['· ', 'ns'], ['MFA', 'nsa']]], l2: v(15.8) },
  { t0: v(18.7), at: v(21.0), lines: [[['non-human = ', 'n'], ['machine', 'na']], [['accounts · keys · bots', 'ns']]], l2: v(21.0) },
  { t0: v(25.3), at: v(26.5), lines: [[['no person ', 'n'], ['needed', 'na']]], gap: .25 },
  { t0: v(29.0), at: v(33.5), dy: 60, lines: [[['badge', 'na'], [' · key', 'n']], [['both need rules', 'ns']]], l2: v(36.2) },
  { t0: v(39.0), at: v(41.0), lines: [[['CI holds a ', 'n'], ['secret key', 'na']]], gap: .25 },
  { t0: v(43.9), at: v(45.5), lines: [[['key ', 'n'], ['leaked', 'na']]], gap: .25 },
  { t0: v(46.9), at: v(50.0), lines: [[['least privilege', 'n']], [['short-', 'ns'], ['lived', 'nsa']]], l2: v(51.5) },
  { t0: v(53.8), at: v(57.0), lines: [[['OTP: know', 'n']], [['or ', 'ns'], ['have?', 'nsa']]], l2: v(58.6) },
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
E(T_RB, 'lamp'); E(T_RP, 'lamp');
E(T_BADGE, 'beep'); E(T_PASS, 'tick'); E(T_MFA, 'beep'); E(T_GOPEN, 'gate');
T_M.forEach(t => E(t, 'lamp')); E(T_WL, 'tick'); E(T_AUTO, 'door');
E(T_P4, 'beep'); E(T_FOPEN, 'door'); E(T_NIGHT, 'slide'); E(T_RKEY, 'beep'); E(T_RKEY + .2, 'gate'); E(T_SOPEN, 'door'); E(T_BOTH, 'lamp');
E(T_DEPLOY, 'door'); E(T_LEAK, 'slide'); E(T_USE, 'deny'); E(T_USE + .3, 'door'); E(T_LP, 'lock'); E(T_LP + .3, 'lock'); E(T_SHORT, 'tick'); E(T_DEAD, 'deny'); E(T_DEAD + .3, 'lock');
E(T_PHONE, 'beep'); E(T_QA, 'tick'); E(T_QB, 'tick');
EV.sort((a, b) => a.t - b.t);

// ---------- drawing helpers ----------
const FLOOR = '#020403', FLOOR_LINE = '#0B2412', BEYOND = '#000000';
const WALLC = '#0A100C', DOORC = '#00FF66';
function floor(g) {
  { const _g = g.createLinearGradient(0, 0, W * .35, H); _g.addColorStop(0, BEYOND); _g.addColorStop(1, '#00CC54'); g.fillStyle = _g; g.fillRect(0, 0, W, H); }
  night(g, TNOW);
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
  // lobby: SERVER door (robot) and FLOOR 3 door (Priya)
  door(g, SDOOR, 'SERVER', on(t, [[T_RKEY, DUR]]), on(t, [[T_SOPEN, DUR]]), 0);
  door(g, FDOOR, 'FLOOR 3', on(t, [[T_P4, DUR]]), on(t, [[T_FOPEN, DUR]]), 0);
  onPlane(g, 4.6, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.2, 1.0); gg.fillStyle = DARK; gg.fillRect(1.07, -2.3, .06, 1.0); label(gg, 'LOBBY', 1.1, -2.55); });
  // machine corner doors
  const auto = on(t, [[T_AUTO, T_AUTOEND]]);
  const cl = Math.max(on(t, [[T_M[0], T_AUTOEND]]), on(t, [[T_DEPLOY, T_DEAD]]));
  const clOpen = Math.max(auto, on(t, [[T_DEPLOY, T_DEPLOY + 2.2]]), on(t, [[T_USE + .3, T_DEAD]]));
  const alert = t > T_USE && t < T_DEAD ? (Math.sin((t - T_USE) * 9) > 0 ? .9 : .3) * on(t, [[T_USE, T_DEAD]]) : 0;
  door(g, ROOMS[0], 'CLOUD', cl, clOpen, alert);
  const lp = on(t, [[T_LP, v(53.0)]]);
  door(g, ROOMS[1], 'DATA', on(t, [[T_M[1], T_AUTOEND]]), auto, lp);
  door(g, ROOMS[2], 'CHAT', on(t, [[T_M[2], T_AUTOEND]]), auto, lp);
  onPlane(g, 8.4, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.0, 1.0); gg.fillStyle = DARK; gg.fillRect(.97, -2.3, .06, 1.0); });
  onPlane(g, SRV.x, WALL_Y + .002, 0, 'xz', gg => { label(gg, 'WORKLOAD', SRV.w / 2, -2.25, .0019); });
}

function key(x, y, z, a, col = SUBJ) { if (a > .01) iso.box(x - .15, y - .05, z, .3, .1, .14 * a, tri(col, .2, .2), { bias: -2, cull: false }); }
function robot(x, y, eye, bias = -.6) { // delivery robot: dark body, orange head, green eye lamp
  iso.box(x - .3, y - .25, .08, .6, .5, .62, tri(DARK, .25, .2), { bias });
  iso.box(x - .24, y - .2, .72, .48, .4, .34, tri(SUBJ), { bias: bias - .05, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, b.z, 'xz', gg => { gg.beginPath(); gg.arc(b.w / 2, -.17, .07, 0, Math.PI * 2); gg.fillStyle = css(mix(DARK, GREEN, eye)); gg.fill(); });
  } });
  iso.box(x - .03, y - .03, 1.06, .06, .06, .22, tri(SUBJ), { bias: bias - .1 });
}
function ciBox(x, y, a, bias = -.5) {
  iso.box(x, y, 0, .9, .9, 1.1 * a + .001, tri(DARK, .25, .2), { bias, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.globalAlpha = a; label(gg, 'CI', b.w / 2, -.55, .0022); gg.fillStyle = GREEN; gg.fillRect(.2, -.35, .5, .06); gg.globalAlpha = 1; });
  } });
}

function props(t) {
  // lobby turnstile: lane 0 robot (key), lane 1 Priya (badge → password → MFA → open)
  gate(t, -1.0, 2, i => {
    if (i === 0) { const o = eio(seg(t, T_RKEY + .2, T_RKEY + .7)) * (1 - eio(seg(t, v(36.0), v(36.6)))); return { open: o, ok: on(t, [[T_RKEY, v(36.4)]]), den: 0 }; }
    const o = eio(seg(t, T_GOPEN, T_GOPEN + .5)) * (1 - eio(seg(t, v(33.2), v(33.8))));
    const ok = Math.max(on(t, [[T_BADGE, T_BADGE + .6]]) * .7, on(t, [[T_PASS, T_PASS + .6]]) * .7, on(t, [[T_MFA, v(33.6)]]));
    return { open: o, ok, den: 0 };
  });
  iso.box(1.55, 2.5, 0, .55, 1.0, .95, tri(DARK, .25, .2), { bias: -.55 }); // guard's desk
  // the robot (lobby)
  const r = ROBOT(t), eye = Math.max(.35, on(t, [[T_RB, v(8.8)], [T_RKEY, DUR]]));
  robot(r.x, r.y, eye);
  key(r.x, r.y, 1.45 + .04 * Math.sin(t * 4), on(t, [[T_RKEY - .4, DUR]]));
  // Priya's badge / MFA glint above her head
  const p = PEOPLE[0][1](t);
  const bA = Math.max(on(t, [[T_BADGE - .3, T_BADGE + .8]]), on(t, [[T_P4 - .3, T_P4 + .9]]));
  if (bA > .01) iso.box(p.x - .15, p.y - .05, 2.0, .3, .1, .2 * bA, tri('#EEC677', .1, .2), { bias: -2, cull: false });
  const mA = on(t, [[T_MFA - .2, T_GOPEN + .4]]);
  if (mA > .01) iso.box(p.x - .1, p.y - .04, 2.0, .2, .08, .36 * mA, tri(GREEN, .1, .2), { bias: -2, cull: false });
  // machine corner: CI box, API key on a stand, chat bot, workload server
  ciBox(CI.x, CI.y, 1);
  iso.box(KEYS.x - .25, KEYS.y - .25, 0, .5, .5, .7, tri(DARK, .25, .2), { bias: -.5 });
  key(KEYS.x, KEYS.y, .74 + .04 * Math.sin(t * 3), 1, t > T_M[1] && t < T_AUTOEND ? GREEN : SUBJ);
  robot(BOT.x, BOT.y, Math.max(.35, on(t, [[T_M[2], T_AUTOEND]])), -.5);
  const al = t > T_WL && t < T_AUTOEND + 1;
  iso.box(SRV.x, SRV.y, 0, SRV.w, SRV.d, SRV.h, tri(DARK, .25, .2), { bias: -.85, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => {
      for (let rr = 0; rr < 3; rr++) for (let k = 0; k < 4; k++) { const live = al && (rr + k + Math.floor(t * 4)) % 3 === 0; gg.fillStyle = live ? GREEN : '#0B2412'; gg.fillRect(.18 + k * .26, -1.2 + rr * .3, .14, .08); }
    });
  } });
  // CI's secret key (above the CI box); leak copy flies to the attacker, short-lived timer kills it
  const ciKey = on(t, [[v(39.4), v(53.0)]]);
  key(CI.x + .45, CI.y + .45, 1.35 + .04 * Math.sin(t * 4), ciKey);
  const at = PEOPLE[2][1](t), lf = eio(seg(t, T_LEAK, T_LEAK + 1.0));
  const leakA = on(t, [[T_LEAK, T_DEAD + .4]]) , dead = ss(seg(t, T_DEAD - .2, T_DEAD + .2));
  if (leakA > .01) key(lerp(CI.x + .45, at.x, lf), lerp(CI.y + .45, at.y, lf), lerp(1.35, 2.05, lf) + .05 * Math.sin(t * 4), leakA, hex(mix(SUBJ, DARK, dead)));
  // quiz: OTP phone standing on the floor
  const ph = eo(seg(t, T_PHONE - .4, T_PHONE));
  if (ph > 0) iso.box(21.0, 0.9, 0, .7, .14, 1.3 * ph + .001, tri(DARK, .25, .2), { bias: -.5, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { gg.globalAlpha = ph; gg.strokeStyle = SUBJ; gg.lineWidth = .05; gg.strokeRect(.06, -1.24, b.w - .12, 1.18); label(gg, 'OTP', b.w / 2, -.85, .0020);
      for (let k = 0; k < 4; k++) { gg.fillStyle = GREEN; gg.fillRect(.12 + k * .13, -.55, .09, .12); } gg.globalAlpha = 1; });
  } });
}

function people(t) {
  for (const [pp, w] of PEOPLE) { if (pp === ATT && t < v(38.4)) continue; const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, pp, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  // quiz answer: B ring under the robot, then human ring under Priya
  const r = ROBOT(t), p = PEOPLE[0][1](t);
  ring(g, r.x, r.y, .6, GREEN, on(t, [[T_RB, v(8.8)]]));
  ring(g, p.x, p.y, .55, C.accent, on(t, [[T_RP, v(8.8)]]));
  // machine corner: rings under each machine as its door lights
  [[CI.x + .45, CI.y + .45], [KEYS.x, KEYS.y], [BOT.x, BOT.y]].forEach(([x, y], i) => ring(g, x, y, .62, GREEN, on(t, [[T_M[i], T_AUTOEND]])));
  // both identities need rules
  const b = on(t, [[T_BOTH, v(38.2)]]);
  ring(g, p.x, p.y, .55, GREEN, b); ring(g, r.x, r.y, .6, GREEN, b);
  // attacker: orange ring when using the key, then short-lived timer shrinks around him
  const at = PEOPLE[2][1](t);
  ring(g, at.x, at.y, .6, C.accent, on(t, [[T_USE, T_SHORT]]));
  if (t > T_SHORT && t < T_DEAD + .6) { const f = clamp((t - T_SHORT) / (T_DEAD - T_SHORT)); ring(g, at.x, at.y, .9 * (1 - f) + .05, GREEN, 1 - ss(seg(t, T_DEAD, T_DEAD + .6)), .09); }
  const dn = on(t, [[T_DEAD, v(53.4)]]); if (dn > 0) { disc(g, at.x, at.y, .6, C.accent, dn * .3); ring(g, at.x, at.y, .6, C.accent, dn); }
  // quiz rings: A under Priya (know), B around the phone (have)
  const end = 1 - ss(seg(t, DUR - 1.2, DUR - .6));
  ring(g, 23.6, 2.6, .55, GREEN, ss(seg(t, T_QA, T_QA + .3)) * end);
  ring(g, 21.35, 1.15, .75, C.accent, ss(seg(t, T_QB, T_QB + .3)) * end);
}

function night(g, t) { // lobby dims at night (beyond the room only)
  const n = on(t, [[T_NIGHT, v(38.4)]]) * .65; if (n <= 0) return;
  g.save(); g.globalAlpha = n; g.fillStyle = '#000000'; g.fillRect(0, 0, W, H); g.restore();
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

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 10', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Human vs non-human identities', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 10/148', W / 2, 1808); g.letterSpacing = '0px';
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
