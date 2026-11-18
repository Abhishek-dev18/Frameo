// Access Granted 08 — "Separation of Duties (SoD)"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 08/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait, neon green + Claude orange look (lemo/iam-kit/PALETTE.md).
// Voice: content/debug-diaries/iam-08/p1..p6.mp3
// Story: a PAYMENTS vault door with two key lamps: Priya turns hers alone and the door stays shut; only when Arjun adds
// the second key does it glow green. Lobby: the guard prints a visitor pass, but the gate opens only when the host approves.
// Finance: Priya creates a payment slip, Arjun approves it. Tech: a code crate reaches PROD only after a reviewer's lamp;
// a conflicting APPROVER role bounces off the developer. Quiz: three rings of layers around a server (defense in depth vs SSO).
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.8, v = x => x + VO;
const PART = [0.06, 8.148, 15.677, 23.972, 32.128, 41.987].map(v), VEND = v(54.598);
const DUR = +(VEND + 2.5).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz answer:'], [1.471, 'A, separation of duties!'], [3.192, "And today's topic is exactly that:"], [4.862, 'Separation of Duties,'], [6.645, 'or SoD.'],
  [8.148, 'SoD means'], [9.083, 'no critical task'], [9.801, 'can be done start to finish by one person alone.'], [14.119, 'The work is split across two hands.'],
  [15.677, 'Think of the office lobby.'], [17.119, 'The guard makes the visitor pass,'], [18.794, 'but only the host employee approves it.'], [21.721, "The guard alone can't bring anyone in."],
  [23.972, 'In finance:'], [24.872, 'Priya creates a payment,'], [26.521, 'but a different manager approves it.'], [28.876, 'Now fraud needs two people working together.'],
  [32.128, 'In tech:'], [32.94, 'a developer writes the code,'], [34.505, 'but before the merge to production, a different reviewer approves it.'], [38.509, 'IAM tools stop one user from getting conflicting roles.'],
  [41.987, 'Clearance check!'], [42.904, 'Firewall, MFA and least privilege:'], [45.48, 'security layers, one on top of another.'], [47.334, 'What is this called?'],
  [48.267, 'A, defense in depth, or B, single sign-on?'], [50.721, 'Answer in the next reel.'], [51.972, 'Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const GATE_Y = 4.3, POSTS = [-1.4, 0.35];
const SUBJ = '#D97757', GREEN = '#00FF66', DARK = '#0F1A12';
const VAULT = { x: 2.0, w: 2.0 }, PROD = { x: 8.4, w: 1.8 };
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const ARJUN = { h: 1.80, top: TOPS[1], legs: LEGS[2] };
const GUARD = { h: 1.78, top: '#D97757', legs: LEGS[2] };
const HOST = { h: 1.70, top: TOPS[1], legs: LEGS[1], hairLong: true };
const VISIT = { h: 1.72, top: '#FFFFFF', legs: LEGS[3] };
const DEV = { h: 1.74, top: TOPS[1], legs: LEGS[0] };
const REV = { h: 1.68, top: TOPS[1], legs: LEGS[1], hairLong: true };

// vault: [t_on, t_off] for the left (Priya) and right (Arjun) key lamps
const VL = [[v(10.4), v(15.6)], [v(25.9), v(32.3)]], VR = [[v(14.6), v(15.6)], [v(27.6), v(32.3)]];
const V_DENY = v(12.2), V_OPEN = [[v(14.9), v(15.6)], [v(27.9), v(32.3)]];
const T_SLIP = v(25.7), T_APPR = v(27.4), T_TWO = v(29.0);
const T_PASS = v(17.4), T_HOST = v(19.3), T_GATE = v(19.6), T_ALONE = v(22.0);
const T_CODE = v(33.4), T_REV = v(36.3), T_MERGE = v(37.2), T_ROLE1 = v(38.6), T_ROLE2 = v(39.6);
const T_RING = [v(43.2), v(44.1), v(45.0)];

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
  [PRIYA, walker([[0, 2.4, 3.2], [v(8.6), 2.4, 3.2], [v(10.3), 2.4, 0.0], [DUR, 2.4, 0.0]])],
  [ARJUN, walker([[0, 3.6, 4.6], [v(12.4), 3.6, 4.6], [v(14.5), 3.6, 0.0], [DUR, 3.6, 0.0]])],
  [GUARD, walker([[0, 1.3, 3.5], [DUR, 1.3, 3.5]])],
  [HOST, walker([[0, -0.6, 1.4], [v(17.6), -0.6, 1.4], [v(18.9), -0.6, 3.3], [DUR, -0.6, 3.3]])],
  [VISIT, walker([[0, -0.5, 7.0], [T_GATE + .3, -0.5, 7.0], [T_GATE + 2.3, -0.5, 3.9], [DUR, -0.5, 3.9]])],
  [DEV, walker([[0, 8.7, 1.2], [DUR, 8.7, 1.2]])],
  [REV, walker([[0, 10.6, 2.6], [v(34.6), 10.6, 2.6], [v(36.1), 9.9, 0.4], [DUR, 9.9, 0.4]])],
];

// ---------- camera: keys in (s, d) with X = s + d/2, Y = s - d/2 ----------
const CAM = [ // [t, s, d, k]
  [0, 1.5, 2.6, 96], [v(7.6), 1.4, 2.8, 92], [v(15.0), 1.4, 2.8, 92],
  [v(16.4), 1.5, -3.6, 88], [v(23.2), 1.5, -3.6, 88], [v(24.4), 1.4, 2.8, 96], [v(31.6), 1.4, 2.8, 96],
  [v(32.8), 5.0, 8.6, 88], [v(41.2), 5.0, 8.6, 88], [v(42.4), 6.3, 13.2, 82], [DUR, 6.3, 13.2, 78]];
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
  { t0: v(0.5), dx: -60, at: v(2.0), lines: [[['answer: ', 'n'], ['separation', 'na']], [['of duties', 'ns']]], l2: v(2.2) },
  { t0: v(5.0), at: v(6.6), lines: [[['= ', 'n'], ['SoD', 'na']]], gap: .25 },
  { t0: v(9.1), dy: 95, dx: -130, at: v(11.0), lines: [[['no one finishes ', 'n'], ['alone', 'na']]], gap: .25 },
  { t0: v(14.1), at: v(15.0), lines: [[['two ', 'n'], ['hands', 'na']]], gap: .25 },
  { t0: v(17.2), dy: 95, at: v(19.0), lines: [[['guard ', 'n'], ['makes', 'na']], [['host approves', 'ns']]], l2: v(18.9) },
  { t0: v(21.8), at: v(22.6), lines: [[['alone? ', 'n'], ['no', 'na']]], gap: .25 },
  { t0: v(24.9), dy: 95, at: v(26.5), lines: [[['create ', 'n'], ['≠', 'na'], [' approve', 'n']]], gap: .25 },
  { t0: v(28.9), at: v(30.0), lines: [[['fraud needs ', 'n'], ['two', 'na']]], gap: .25 },
  { t0: v(33.0), dy: 95, at: v(35.0), lines: [[['dev writes', 'n']], [['reviewer ', 'ns'], ['approves', 'nsa']]], l2: v(35.4) },
  { t0: v(38.6), dx: -130, at: v(39.6), lines: [[['conflicting roles: ', 'n'], ['blocked', 'na']]], gap: .25 },
  { t0: v(43.0), at: v(45.5), lines: [[['layers', 'na'], [' on layers', 'n']]], gap: .25 },
  { t0: v(48.2), at: v(49.5), lines: [[['defense in ', 'n'], ['depth', 'na']], [['or single sign-on?', 'ns']]], l2: v(49.9) },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
const SCREEN_Y = 1290;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .12, scale: .58, dv: 1.7, indent: .4 });
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
for (const [, w] of PEOPLE) { let last = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = w(t); if (!p.walking) { last = -1; continue; } const n = Math.floor(p.phase / Math.PI); if (n !== last) { if (last >= 0) E(t, 'step'); last = n; } } }
VL.concat(VR).forEach(([t]) => { E(t, 'lamp'); });
E(V_DENY, 'deny'); V_OPEN.forEach(([t]) => E(t, 'door'));
E(T_PASS, 'slide'); E(T_HOST, 'beep'); E(T_GATE, 'gate'); E(T_ALONE, 'lock');
E(T_SLIP, 'slide'); E(T_APPR, 'beep'); E(T_TWO, 'tick');
E(T_CODE, 'slide'); E(T_REV, 'lamp'); E(T_MERGE, 'door'); E(T_ROLE1, 'beep'); E(T_ROLE2, 'deny');
T_RING.forEach(t => E(t, 'lamp'));
E(v(48.4), 'tick'); E(v(49.9), 'tick');
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
function twoKeyDoor(g, D, name, lit1, lit2, open, den) {
  onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
    gg.fillStyle = hex(mix(mix(DARK, GREEN, .3), GREEN, open)); gg.fillRect(0, -2.2, D.w, 2.2);
    gg.fillStyle = DARK; gg.fillRect(D.w / 2 - .03, -2.2, .06, 2.2);
    gg.strokeStyle = SUBJ; gg.lineWidth = .08; gg.strokeRect(0, -2.2, D.w, 2.2);
    lamp(gg, D.w * .28, -2.5, lit1, 0); lamp(gg, D.w * .72, -2.5, lit2, den);
    label(gg, name, D.w / 2, -2.78);
    if (den > .01) { gg.globalAlpha = den; gg.strokeStyle = C.accent; gg.lineWidth = .1; const c = D.w / 2; gg.beginPath(); gg.moveTo(c - .3, -1.4); gg.lineTo(c + .3, -.8); gg.moveTo(c + .3, -1.4); gg.lineTo(c - .3, -.8); gg.stroke(); gg.globalAlpha = 1; }
  });
}
function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri('#0A100C', .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri('#0A100C', .1, .12));
  for (const y0 of [4.5, 8.5, 12.5]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = GREEN; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = DARK; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.16, 40, .16); });
  const den = ss(seg(t, V_DENY, V_DENY + .15)) * (1 - ss(seg(t, V_DENY + 1.8, V_DENY + 2.2)));
  twoKeyDoor(g, VAULT, 'PAYMENTS', on(t, VL), on(t, VR), on(t, V_OPEN), den);
  const r1 = on(t, [[T_CODE, v(41.5)]]), r2 = on(t, [[T_REV, v(41.5)]]), op = on(t, [[T_MERGE, v(41.5)]]);
  twoKeyDoor(g, PROD, 'PROD', r1, r2, op, 0);
  // little window sign between, and the server label far right
  onPlane(g, 5.0, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = GREEN; gg.fillRect(0, -2.3, 2.2, 1.0); gg.fillStyle = DARK; gg.fillRect(1.07, -2.3, .06, 1.0); label(gg, 'LOBBY', 1.1, -2.55); });
  onPlane(g, 12.0, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = SUBJ; gg.fillRect(0, -.24, 2.4, .08); label(gg, 'SERVER', 1.2, -2.3); });
}

function props(t) {
  // turnstile; opens when the host approves
  const open = eio(seg(t, T_GATE, T_GATE + .7)) * (1 - eio(seg(t, v(22.6), v(23.3))));
  POSTS.forEach(x => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#D97757'), { bias: -.5 }));
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(-1.15, GATE_Y + .1, .1, leafW, .06, .8, tri(GREEN, .1, .12), { bias: -.45 });
  const yes = ss(seg(t, T_HOST, T_HOST + .25)) * (1 - ss(seg(t, v(22.6), v(23)))), pend = ss(seg(t, T_PASS, T_PASS + .3)) * (1 - yes);
  iso.box(-1.57, GATE_Y - .3, 1.0, .19, .22, .06, tri(DARK), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .07, 0, Math.PI * 2); gg.fillStyle = css(mix(mix(DARK, C.accent, pend), GREEN, yes)); gg.fill(); });
  } });
    for (let x = 0.6; x < 1.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 1.6 - x), .2, .9, tri(SUBJ, .25, .2), { bias: -.45 });
  // guard desk + printed visitor pass (orange until the host approves, then green)
  iso.box(1.9, 3.1, 0, .6, 1.1, .95, tri(DARK, .25, .2), { bias: -.55 });
  const pz = ss(seg(t, T_PASS, T_PASS + .4));
  if (pz > 0) iso.box(2.05, 3.4, .95, .3, .42, .03 + .02 * pz, tri(yes > .5 ? GREEN : SUBJ, .1, .2), { bias: -1, cull: false });
  // payment kiosk between Priya and Arjun; slip pending (orange) → approved (green)
  iso.box(2.85, -.05, 0, .55, .45, .9, tri(DARK, .25, .2), { bias: -.55 });
  const sl = ss(seg(t, T_SLIP, T_SLIP + .35)) * (1 - ss(seg(t, v(32.0), v(32.4))));
  if (sl > .01) iso.box(2.95, .0, .9 + .25 * (1 - sl), .34, .32, .04, tri(t > T_APPR ? GREEN : SUBJ, .1, .2), { bias: -1, cull: false });
  // code crate rolls into PROD on merge
  const cz = ss(seg(t, T_CODE - .3, T_CODE)), mv = eio(seg(t, T_MERGE, T_MERGE + 1.2));
  if (cz > 0 && mv < .98) iso.box(9.0, lerp(0.2, -1.0, mv), 0, .6, .6, .5 * cz + .001, tri(t > T_REV ? GREEN : SUBJ, .2, .3), { bias: -.3 });
  // role badges for the developer: DEVELOPER lands (green), APPROVER bounces (orange)
  const b1 = eio(seg(t, T_ROLE1 - .6, T_ROLE1)), b2 = seg(t, T_ROLE2 - .6, T_ROLE2 + .8);
  if (t > T_ROLE1 - .6 && t < v(41.6)) iso.box(lerp(8.2, 8.75, b1), lerp(2.4, 1.25, b1), lerp(2.2, 1.95, b1), .3, .2, .05, tri(GREEN, .1, .2), { bias: -2, cull: false });
  if (b2 > 0 && b2 < 1) { const f = b2 < .43 ? eio(b2 / .43) : 1 - eio((b2 - .43) / .57) * .9; iso.box(lerp(10.2, 9.1, f), lerp(2.0, 1.35, f), lerp(2.3, 2.0, f), .3, .2, .05, tri(SUBJ, .1, .2), { bias: -2, cull: false }); }
  // server box with three rings of layers (quiz)
  iso.box(12.4, -1.0, 0, 1.6, .7, 1.7, tri(DARK, .25, .2), { bias: -.85, decal: (I, b) => {
    onPlane(g, b.x, b.y + b.d + .001, 0, 'xz', gg => { for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { gg.fillStyle = (r + k + Math.floor(t * 3)) % 4 ? '#0B2412' : GREEN; gg.fillRect(.2 + k * .26, -1.5 + r * .32, .12, .08); } });
  } });
  iso.box(WALL_X + .4, 3.6, 0, .5, .5, .45, tri(DARK), { bias: -.22 });
  iso.cone(WALL_X + .65, 3.85, .45, .38, 1.1, tri(GREEN, .2, .3), { n: 6 });
}

function people(t) {
  for (const [p, w] of PEOPLE) { const s = w(t); iso.bill(s.x, s.y, 0, gg => drawPerson(gg, p, { walking: s.walking, phase: s.phase })); }
}

function marks(g, t) {
  // vault keys: green ring under each key-holder when their lamp lights; orange under Priya when denied
  const p1 = on(t, VL), p2 = on(t, VR);
  ring(g, 2.4, 0.0, .5, GREEN, p1); ring(g, 3.6, 0.0, .5, GREEN, p2);
  const dn = ss(seg(t, V_DENY, V_DENY + .2)) * (1 - ss(seg(t, V_DENY + 1.8, V_DENY + 2.2)));
  ring(g, 2.4, 0.0, .62, C.accent, dn);
  // fraud needs two: both get a pulsing orange ring
  const two = ss(seg(t, T_TWO, T_TWO + .3)) * (1 - ss(seg(t, v(32.0), v(32.4))));
  if (two > 0) { const pul = .5 + .5 * Math.sin((t - T_TWO) * 5); ring(g, 2.4, 0, .7 + .06 * pul, C.accent, two); ring(g, 3.6, 0, .7 + .06 * pul, C.accent, two); }
  // lobby: host approval disc, guard alone = orange ring on the guard
  const h = ss(seg(t, T_HOST, T_HOST + .3)) * (1 - ss(seg(t, v(21.5), v(21.9))));
  disc(g, -0.6, 3.3, .5, GREEN, h * .4); ring(g, -0.6, 3.3, .5, GREEN, h);
  const al = ss(seg(t, T_ALONE, T_ALONE + .3)) * (1 - ss(seg(t, v(23.6), v(24))));
  ring(g, 1.3, 3.5, .55, C.accent, al);
  // reviewer approves; conflicting role bounce
  const rv = ss(seg(t, T_REV, T_REV + .3)) * (1 - ss(seg(t, v(38.2), v(38.6))));
  ring(g, 9.9, 0.4, .5, GREEN, rv);
  const cf = ss(seg(t, T_ROLE2, T_ROLE2 + .2)) * (1 - ss(seg(t, v(41.2), v(41.6))));
  ring(g, 8.7, 1.2, .6, C.accent, cf);
  // layers around the server
  T_RING.forEach((t0, i) => { const a = ss(seg(t, t0, t0 + .35)) * (1 - ss(seg(t, DUR - 1.2, DUR - .6))); const c = i === 2 ? GREEN : (i === 1 ? C.accent : GREEN); ring(g, 13.2, -.3, 1.3 + i * .7, c, a, .09); });
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(4,8,5,.88)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#34D399'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 08', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#DFFFE6'; g.fillText('Separation of Duties (SoD)', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#DFFFE6'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 08/148', W / 2, 1808); g.letterSpacing = '0px';
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
