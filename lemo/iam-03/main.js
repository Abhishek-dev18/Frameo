// Access Granted 03 — "The 4 A's: Identification, Authentication, Authorization, Accounting"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 03/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait. Voice: content/debug-diaries/iam-03/p1..p6.mp3
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.3, v = x => x + VO;
const PART = [0.06, 9.604, 16.404, 24.276, 33.321, 41.329].map(v), VEND = v(50.369);
const DUR = +(VEND + 1.25).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz: B, the credential!'],
  [2.003, 'Password leaked? Change the password. Priya stays the same.'],
  [4.631, "Today: the four A's of IAM: Identification, Authentication, Authorization and Accounting."],
  [9.604, 'First A: Identification.'],
  [11.372, "In the lobby, Priya tells the guard: I'm Priya."],
  [13.567, "That's only a claim."],
  [14.536, 'On a login screen, that claim is your username.'],
  [16.404, 'Second A: Authentication.'],
  [17.827, 'The guard says: prove it.'],
  [19.383, 'Priya scans her badge.'],
  [20.916, 'In a system: a password, an OTP or a security key, proof that the claim is true.'],
  [24.276, 'Third A: Authorization.'],
  [26.066, "The gate is open, but Priya can open only her own floor's doors, not the server room."],
  [29.998, 'In the cloud, that is a policy: it decides which actions are allowed.'],
  [33.321, 'Fourth A: Accounting.'],
  [34.964, 'Every badge swipe goes into the register: who, when, where.'],
  [37.656, 'In tech, that is the audit log: after an incident, it shows who did what.'],
  [41.329, 'Clearance check!'],
  [42.118, 'Login worked, but opening the file says: access denied.'],
  [44.659, 'Which A failed? A, authentication, or B, authorization?'],
  [48.246, 'Answer in the next reel. Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const DESK = [3.8, 7.3, 1.0, 1.4, 1.05];            // x, y, w, d, h
const PED = [9.4, 7.0, 0.6, 0.6, 0.95];             // badge pedestal
const GATE_Y = 4.3, POSTS = [4.6, 6.35];            // turnstile posts (x), 0.25 wide
const DOORS = [{ x: 1.4, name: 'FLOOR 3' }, { x: 5.0, name: 'TEAM ROOM' }, { x: 9.6, name: 'SERVER ROOM' }];
const BOARD = [6.5, 9.3];                           // log board on the far wall, x range
const SERVER = [11.4, -1.3, 0.7, 0.75, 1.7];
const SUBJ = '#3D6B59', SUBJ_LT = '#A7C2B2';
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.78, top: '#4E5A66', legs: LEGS[2] };

// Priya's walk: piecewise along the world axes, ~1.5 m/s, away from the camera
const KEYS = [ // [t, x, y]
  [0, 9.0, 8.0], [v(9.75), 9.0, 8.0], [v(12.05), 5.6, 8.0],
  [v(16.9), 5.6, 8.0], [v(18.85), 5.6, 5.1],
  [v(26.4), 5.6, 5.1], [v(30.2), 5.6, -0.55], [DUR, 5.6, -0.55]];
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
  [0, 9.3, 1.6, 74], [v(4.4), 9.2, 1.6, 78], [v(6.9), 5.6, 2.8, 54], [v(9.5), 5.6, 2.8, 56],
  [v(11.0), 7.4, -0.9, 72], [v(16.4), 7.3, -1.0, 75], [v(18.9), 6.0, 0.6, 74], [v(24.2), 5.9, 0.8, 77],
  [v(26.4), 5.6, 1.6, 70], [v(30.4), 3.3, 5.8, 64], [v(33.3), 3.3, 5.9, 66],
  [v(34.6), 3.5, 7.6, 68], [v(41.1), 3.5, 7.6, 71], [v(42.6), 4.5, 4.6, 54], [DUR, 4.5, 4.6, 57]];
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
  { t0: v(1.157), t1: v(4.9), at: v(2.4), lines: [[['credential', 'na']], [['answer B', 'ns']]], gap: .25 },
  { t0: v(5.399), t1: PART[1] - .3, at: v(7.6), lines: [[['four', 'na'], [" A's", 'n']], [['of IAM', 'ns']]], gap: .2 },
  { t0: v(10.134), t1: PART[2] - .3, at: v(12.2), lines: [[['Identification', 'n']], [['just a ', 'ns'], ['claim', 'nsa']]], l2: v(13.567) },
  { t0: v(16.6), t1: PART[3] - .3, at: v(19.5), lines: [[['Authentication', 'n']], [['prove', 'nsa'], [' it', 'ns']]], l2: v(18.726) },
  { t0: v(24.9), t1: PART[4] - .3, at: v(30.6), lines: [[['Authorization', 'n']], [['policy', 'nsa'], [' decides', 'ns']]], l2: v(29.998) },
  { t0: v(33.9), t1: PART[5] - .3, at: v(36.5), lines: [[['Accounting', 'n']], [['audit ', 'ns'], ['log', 'nsa']]], l2: v(37.656) },
  { t0: v(42.9), t1: DUR + 1, at: v(44.0), lines: [[['access ', 'n'], ['denied', 'na']], [['AuthN or AuthZ?', 'ns']]], l2: v(44.659) },
];
const SCREEN_Y = 1300;
for (const P of PH) {
  Object.assign(P, { x: 0, y: 0, z: 0, step: .12, scale: .78, dv: 1.7, indent: .4 });
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
for (const P of PH) { let last = -1; for (const c of P.L) { const key = c.li + ':' + c.fam + c.size; if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
{ // footsteps
  let lastStep = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = priyaAt(t); if (!p.walking) continue; const n = Math.floor(phaseAt(t) / Math.PI); if (n !== lastStep) { if (lastStep >= 0) E(t, 'step'); lastStep = n; } }
}
const T_BADGE_OUT = v(2.2), T_BADGE_IN = v(3.3), T_SCAN = v(19.75), T_GATE = v(26.15), T_DOOR = v(30.05);
const T_LAMP = [v(27.3), v(27.75)], T_LOCK = v(28.7), T_DENY = v(43.0);
const T_DOTS = [v(6.511), v(7.373), v(8.116), v(9.004)];
const T_LOG = [v(35.2), v(35.7), v(36.2), v(36.7)];
E(T_BADGE_OUT, 'slide'); E(T_BADGE_IN, 'beep');
T_DOTS.forEach(t => E(t, 'lamp'));
E(v(11.9), 'speak'); E(T_SCAN, 'beep'); E(T_SCAN + .25, 'lamp');
E(T_GATE, 'gate'); T_LAMP.forEach(t => E(t, 'lamp')); E(T_LOCK, 'lock'); E(T_DOOR, 'beep'); E(T_DOOR + .1, 'door');
T_LOG.forEach(t => E(t, 'tick')); E(T_DENY, 'deny'); E(T_DENY + .25, 'lock');
EV.sort((a, b) => a.t - b.t);

// ---------- drawing helpers ----------
const FLOOR = '#F2E5CE', FLOOR_LINE = '#E8D8BC', BEYOND = '#E3D5BE';
const WALLC = '#EFE6D6', DOORC = '#C9B79A', SCREEN = '#2F3532';
function floor(g) {
  g.fillStyle = BEYOND; g.fillRect(0, 0, W, H);
  const P = (x, y) => iso.P(x, y, 0);
  fillPoly(g, [P(WALL_X, WALL_Y), P(60, WALL_Y), P(60, 60), P(WALL_X, 60)], FLOOR);
  g.save(); g.strokeStyle = FLOOR_LINE; g.lineWidth = 1.5;
  for (let x = WALL_X; x < 40; x += 1.5) { const a = P(x, WALL_Y), b = P(x, 40); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  for (let y = WALL_Y; y < 40; y += 1.5) { const a = P(WALL_X, y), b = P(40, y); g.beginPath(); g.moveTo(...a); g.lineTo(...b); g.stroke(); }
  g.restore();
  // entrance mat and a lead-in line to the desk
  onPlane(g, 8.2, 9.4, 0, 'xy', gg => { gg.fillStyle = '#E4D2B2'; gg.fillRect(-1.2, -1.2, 2.0, 1.8); });
}
function disc(g, x, y, r, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); }); }
function ring(g, x, y, r, col, a, lw = .07) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.strokeStyle = col; gg.lineWidth = lw; gg.stroke(); }); }

function walls(g, t) {
  // left far wall (faces +x) and back wall (faces +y)
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri(WALLC, .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri(WALLC, .1, .12));
  // windows on the left wall
  for (const y0 of [2, 6, 10, 14]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = '#CFDCD4'; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = '#E9E0CF'; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  // skirting band of the subject hue on the back wall
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ_LT; gg.fillRect(0, -.16, 40, .16); });
  // doors
  DOORS.forEach((D, i) => {
    const open = i === 1 ? eio(seg(t, T_DOOR + .05, T_DOOR + .75)) : 0;
    const lit = i < 2 ? ss(seg(t, T_LAMP[i], T_LAMP[i] + .3)) : 0;
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = '#3B3A36'; gg.fillRect(0, -2.15, 1.2, 2.15);                      // opening
      gg.fillStyle = DOORC; gg.fillRect(-open * 1.1, -2.15, 1.2, 2.15);                // sliding panel
      gg.fillStyle = hex(mix(DOORC, '#5B4434', .25)); gg.fillRect(-open * 1.1 + 1.0, -1.2, .08, .3);
      gg.fillStyle = WALLC; gg.fillRect(-1.25, -2.15, 1.25, 2.15);                      // wall covers the slid panel
      // lamp above the door
      let lamp = mix(C.ghost, C.accent, lit);
      if (i === 2) { const blink = t > T_DENY && t < T_DENY + 1.2 ? (Math.floor((t - T_DENY) / .2) % 2 === 0 ? 1 : 0) : 0; lamp = mix(C.ghost, C.ink, blink); }
      gg.beginPath(); gg.arc(.6, -2.42, .11, 0, Math.PI * 2); gg.fillStyle = css(lamp); gg.fill();
      // sign
      gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center';
      const s = .0024; gg.save(); gg.translate(.6, -2.62); gg.scale(s, s); gg.fillText(D.name, 0, 0); gg.restore();
      // server room: a padlock and a badge reader
      if (i === 2) {
        const a = ss(seg(t, T_LOCK, T_LOCK + .3)), sh = t > T_DENY && t < T_DENY + .6 ? Math.sin((t - T_DENY) * 40) * .03 : 0;
        if (a > 0) {
          gg.save(); gg.globalAlpha = a; gg.translate(.6 + sh, -1.15);
          gg.strokeStyle = C.ink; gg.lineWidth = .045; gg.beginPath(); gg.arc(0, -.1, .1, Math.PI, 0); gg.stroke();
          gg.fillStyle = C.ink; gg.fillRect(-.15, -.1, .3, .24); gg.restore();
        }
      }
    });
    // badge reader beside each door
    onPlane(g, D.x + 1.32, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = '#4A4E4B'; gg.fillRect(0, -1.35, .16, .24); });
  });
  // the log board ("register")
  onPlane(g, BOARD[0], WALL_Y + .002, 0, 'xz', gg => {
    const w = BOARD[1] - BOARD[0];
    gg.fillStyle = SCREEN; gg.fillRect(0, -2.55, w, 1.55);
    gg.fillStyle = '#E9E2D2'; gg.font = font(600, 100, 'Inter'); gg.save(); gg.translate(.14, -2.33); gg.scale(.0016, .0016); gg.fillText('AUDIT LOG', 0, 0); gg.restore();
    const rows = [['09:01', 'priya', 'LOBBY', 'id'], ['09:02', 'priya', 'GATE', 'ok'], ['09:03', 'priya', 'TEAM ROOM', 'ok'], ['09:05', 'priya', 'SERVER ROOM', 'denied']];
    const when = [T_LOG[0], T_LOG[1], T_LOG[2], T_DENY];
    rows.forEach((r, i) => {
      const a = ss(seg(t, when[i], when[i] + .25)); if (a <= 0) return;
      gg.save(); gg.globalAlpha = a; gg.translate(.14, -1.98 + i * .27); gg.scale(.0019, .0019);
      gg.font = font(500, 100, 'Inter'); gg.fillStyle = '#B9B3A5'; gg.fillText(r[0], 0, 0);
      gg.fillStyle = '#E9E2D2'; gg.fillText(r[1], 300, 0); gg.fillText(r[2], 600, 0);
      gg.fillStyle = r[3] === 'denied' ? C.accentLt : '#9FD3B4'; gg.textAlign = 'right'; gg.fillText(r[3], 1290, 0);
      gg.restore();
    });
  });
}

function props(t) {
  const deskT = tri('#D9C7A6'), subj = tri(SUBJ, .25, .2);
  // guard desk with a subject-hue front band
  const [dx, dy, dw, dd, dh] = DESK;
  iso.box(dx, dy, 0, dw, dd, dh, deskT, { bias: -dh / 2 });
  iso.box(dx + dw - .02, dy, .55, .04, dd, .18, subj, { bias: -.6 });
  // badge pedestal + badges (old badge slides off, new one with an accent band slides in)
  const [px, py, pw, pd, ph] = PED;
  iso.box(px, py, 0, pw, pd, ph, tri('#CDBFA6'), { bias: -ph / 2 });
  const out = eio(seg(t, T_BADGE_OUT, T_BADGE_OUT + .6)), inn = eio(seg(t, T_BADGE_IN - .5, T_BADGE_IN));
  const taken = seg(t, v(9.4), v(9.7));
  if (out < 1) iso.box(px + .08 + out * .5, py + .14, ph, .44, .32, .04, tri('#8F8A80'), { bias: -ph - .1, cull: false });
  if (inn > 0 && taken < 1) {
    iso.box(px + .08, py + .14 - (1 - inn) * .9, ph, .44, .32, .04, tri('#F4EEE2'), { bias: -ph - .05, cull: false, decal: (I, b) => {
      onPlane(g, b.x, b.y, b.z + b.h + .001, 'xy', gg => { gg.globalAlpha = 1 - taken; gg.fillStyle = C.accent; gg.fillRect(-b.d, 0, b.d, .1); });
    } });
  }
  // turnstile: two posts, a sliding glass leaf, low partitions on either side
  const open = eio(seg(t, T_GATE, T_GATE + .7));
  POSTS.forEach((x, i) => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#B8AE9C'), { bias: -.5 }));
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(4.85, GATE_Y + .1, .1, leafW, .06, .8, tri('#C9DAD3', .1, .12), { bias: -.45 });
  const scan = ss(seg(t, T_SCAN + .2, T_SCAN + .45));
  iso.box(6.38, GATE_Y + .2, 1.0, .19, .22, .06, tri('#3E4240'), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .06, 0, Math.PI * 2); gg.fillStyle = css(mix('#6F6A60', C.accent, scan)); gg.fill(); });
  } });
  for (let x = 1.6; x < 4.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 4.6 - x), .2, .9, subj, { bias: -.45 });
  for (let x = 6.6; x < 9.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 9.6 - x), .2, .9, subj, { bias: -.45 });
  // server box by the server room
  const [sx, sy, sw, sd, sh] = SERVER;
  iso.box(sx, sy, 0, sw, sd, sh, tri('#5A605C', .25, .2), { bias: -sh / 2, decal: (I, b) => {
    for (let k = 0; k < 5; k++) onPlane(g, b.x, b.y + b.d + .001, b.z + .3 + k * .26, 'xz', gg => { gg.fillStyle = '#7B827D'; gg.fillRect(.08, -.06, b.w - .16, .05); gg.beginPath(); gg.arc(.14, -.15, .025, 0, 7); gg.fillStyle = '#9FD3B4'; gg.fill(); });
  } });
  // a plant by the left wall
  iso.box(WALL_X + .4, 3.0, 0, .5, .5, .45, tri('#C8B08C'), { bias: -.22 });
  iso.cone(WALL_X + .65, 3.25, .45, .38, 1.1, tri('#6E9886', .2, .2), { n: 6 });
}

function people(t) {
  // guard behind the desk (the desk hides his legs)
  iso.bill(3.2, 8.0, 0, gg => drawPerson(gg, GUARD, {}));
  const p = priyaAt(t);
  iso.bill(p.x, p.y, 0, gg => drawPerson(gg, PRIYA, { walking: p.walking, phase: phaseAt(t) }));
}

// station discs: the four A's light up in order (part 1), then the swipes light up again with the log (part 5)
const STATIONS = [[5.6, 8.0], [5.6, 5.1], [5.6, -0.55], [7.9, -0.75]];
function stations(g, t) {
  STATIONS.forEach(([x, y], i) => {
    const a1 = ss(seg(t, T_DOTS[i], T_DOTS[i] + .3)) * (1 - ss(seg(t, PART[1] - .2, PART[1] + .4)));
    const a2 = i < 3 ? ss(seg(t, T_LOG[i], T_LOG[i] + .3)) * (1 - ss(seg(t, PART[5] - .3, PART[5] + .2))) : 0;
    const a = Math.max(a1, a2); if (a <= 0) return;
    disc(g, x, y, .5, C.accentLt, a * .85); ring(g, x, y, .5, C.accent, a);
    if (a1 > 0) { // the A's letter on its disc
      onPlane(g, x + .22, y + .2, 0, 'xy', gg => { gg.globalAlpha = a1; gg.font = font(700, 100); gg.fillStyle = C.accent; gg.save(); gg.scale(.006, .006); gg.fillText('A', 0, 0); gg.restore(); });
    }
  });
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(250,245,236,.93)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#1F9D55'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 03', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#4A4A42'; g.fillText("The 4 A's: Identification, Authentication, Authorization, Accounting", 78, 158);
  g.font = font(600, 21, 'Inter'); g.fillStyle = '#6B675E'; g.textAlign = 'right'; g.letterSpacing = '3px'; g.fillText('DEBUG DIARIES', W - 72, 112); g.letterSpacing = '0px';
  // subtitles: one cue at a time, hard switch
  g.textAlign = 'center';
  for (const s of SUBS) {
    if (t < s.t0 || t >= s.t1) continue;
    g.font = font(600, 42); const lines = wrap(g, s.text, 880), lh = 54, bottom = 1720, padY = 22;
    const tw = Math.max(...lines.map(l => g.measureText(l).width));
    const top = bottom - lines.length * lh - padY * 2 + 8;
    g.fillStyle = 'rgba(250,245,236,.9)'; g.beginPath(); g.roundRect(W / 2 - tw / 2 - 30, top, tw + 60, bottom - top, 18); g.fill();
    g.fillStyle = C.ink; lines.forEach((l, i) => g.fillText(l, W / 2, top + padY + 38 + i * lh));
  }
  // footer
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#6B675E'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 03/148', W / 2, 1808); g.letterSpacing = '0px';
  g.restore();
}

function render(g, t) {
  g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
  iso.g = g; iso.cam = camAt(t);
  floor(g);
  stations(g, t);
  for (const P of PH) floorType(g, t, P, P.L);
  walls(g, t);
  props(t); people(t); iso.flush();
  overlay(g, t);
}

window.DUR = DUR; window.EV = EV;
window.render = t => render(g, t);
window.READY = true;
