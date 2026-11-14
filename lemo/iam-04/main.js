// Access Granted 04 — "401 vs 403: AuthN failed vs AuthZ failed"
// Debug Diaries · IAM series · Level 01 (IAM Foundations) · reel 04/148
// Lemo-Opuscar "Isometric People Scene" style, 1080x1920 portrait. Voice: content/debug-diaries/iam-04/p1..p6.mp3
// Story: Priya's expired badge is refused at the gate (401: who are you?), the kiosk prints a fresh one,
// the gate opens, but the SERVER ROOM door stays locked (403: we know you, not allowed) while her own doors light.
import { iso, W, H, C, TOPS, LEGS, tri, mix, hex, css, clamp, lerp, seg, ss, eo, eio, onPlane, fillPoly,
  phraseLayout, floorType, phraseWorld, drawPerson, font } from './kit.js';

const cv = document.getElementById('c'), g = cv.getContext('2d');
await Promise.all(['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Newsreader`)).concat(
  ['500', '600', '700'].map(w => document.fonts.load(`${w} 40px Inter`))));

// ---------- timeline (voice starts at VO; cue times from scripts/audio/tighten.py) ----------
const VO = 0.3, v = x => x + VO;
const PART = [0.06, 9.8, 17.847, 24.437, 33.799, 45.165].map(v), VEND = v(55.765);
const DUR = +(VEND + 1.25).toFixed(2);
const SUBS = [
  [0.06, 'Last quiz: B, authorization!'],
  [1.24, 'The login worked. Only the permission was missing.'],
  [3.596, 'Today: 401 vs 403,'],
  [7.487, 'two errors that confuse everyone.'],
  [9.8, '401: Unauthorized.'],
  [11.737, "Priya's badge has expired."],
  [14.066, 'The gate asks: who are you?'],
  [16.344, 'Her identity was never proven.'],
  [17.847, 'In tech: the token is missing or expired.'],
  [20.647, 'The server says: log in first.'],
  [22.631, 'Bring a fresh token and the request goes through.'],
  [24.437, '403: Forbidden.'],
  [26.132, 'New badge, and the gate opens.'],
  [28.042, 'The system knows Priya.'],
  [29.871, 'But the server room door: locked.'],
  [31.774, 'Identity confirmed. Permission: no.'],
  [33.799, 'In tech: the token is valid,'],
  [35.194, "but the policy doesn't allow this action."],
  [37.311, 'Logging in again changes nothing.'],
  [39.537, "Fun fact: 401 is called 'Unauthorized',"],
  [42.396, 'but it really means unauthenticated.'],
  [45.165, 'Clearance check!'],
  [46.185, 'Your token is perfectly valid,'],
  [47.529, "but you open an admin page you have no permission for."],
  [50.075, 'Which error comes back?'],
  [51.058, 'A, 401, or B, 403?'],
  [53.302, 'Answer in the next reel. Follow Debug Diaries.'],
].map(([t, text], i, a) => ({ t0: v(t), t1: i + 1 < a.length ? v(a[i + 1][0]) : DUR, text }));

// ---------- the place (metres; x down-right, y down-left) ----------
const WALL_Y = -1.4, WALL_X = -3, WH = 2.8;
const KIOSK = [2.5, 4.9, 0.7, 0.6, 1.15];           // badge printer kiosk, x, y, w, d, h
const GATE_Y = 4.3, POSTS = [4.6, 6.35];
const DOORS = [{ x: 1.4, name: 'TEAM ROOM' }, { x: 5.0, name: 'SERVER ROOM' }, { x: 8.6, name: 'FLOOR 3' }];
const SERVER = [6.7, -1.3, 0.7, 0.75, 1.7];
const SUBJ = '#3D6B59', SUBJ_LT = '#A7C2B2';
const PRIYA = { h: 1.66, top: TOPS[1], legs: LEGS[0], hairLong: true };
const GUARD = { h: 1.78, top: '#4E5A66', legs: LEGS[2] };

const T_SCAN1 = v(13.6), T_DENY1 = v(13.9), T_PRINT = v(20.6), T_TAKE = v(23.0), T_SCAN2 = v(26.3), T_GATE = v(26.6);
const T_LOCK = v(30.6), T_DENY2 = v(31.15), T_OK = [v(35.6), v(36.1)];
const KEYS = [ // [t, x, y]  ~1.5 m/s, away from the camera
  [0, 5.6, 8.6], [v(10.9), 5.6, 8.6], [v(13.1), 5.6, 5.3],
  [v(18.2), 5.6, 5.3], [v(19.7), 3.5, 5.3],
  [v(23.6), 3.5, 5.3], [v(25.0), 5.6, 5.3],
  [v(26.9), 5.6, 5.3], [v(30.3), 5.6, -0.5], [DUR, 5.6, -0.5]];
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
  [0, 7.4, -2.4, 90], [v(4.0), 7.3, -2.4, 85], [v(9.6), 6.6, -1.2, 73],
  [v(11.4), 6.0, -0.4, 85], [v(13.4), 5.8, 0.2, 95], [v(17.6), 5.8, 0.2, 93],
  [v(19.6), 4.8, -1.6, 90], [v(24.2), 4.8, -1.4, 94],
  [v(26.4), 5.6, 0.4, 85], [v(30.3), 2.9, 5.6, 81], [v(33.6), 2.9, 5.7, 83],
  [v(35.0), 3.3, 5.6, 66], [v(39.3), 3.3, 5.6, 68], [v(40.6), 3.9, 3.6, 76], [v(45.0), 3.9, 3.6, 78],
  [v(46.6), 4.9, 1.0, 67], [DUR, 4.9, 1.0, 71]];
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
  { t0: v(0.5), at: v(1.8), lines: [[['authorization', 'na']], [['answer B', 'ns']]], gap: .25 },
  { t0: v(3.7), at: v(6.0), lines: [[['401', 'na'], [' vs 403', 'n']], [['two errors', 'ns']]], l2: v(7.487) },
  { t0: v(10.0), at: v(12.6), lines: [[['401', 'n']], [['who ', 'ns'], ['are you?', 'nsa']]], l2: v(14.066) },
  { t0: v(18.3), at: v(21.0), lines: [[['log in', 'na'], [' first', 'n']], [['fresh token', 'ns']]], l2: v(22.631) },
  { t0: v(24.7), at: v(29.6), lines: [[['403', 'n']], [['known, ', 'ns'], ['not allowed', 'nsa']]], l2: v(31.774) },
  { t0: v(34.1), at: v(37.0), lines: [[['policy', 'na'], [' says no', 'n']], [['re-login won\'t help', 'ns']]], l2: v(37.311) },
  { t0: v(39.8), at: v(42.5), lines: [[['401', 'n']], [['= ', 'ns'], ['unauthenticated', 'nsa']]], l2: v(42.396) },
  { t0: v(46.4), at: v(50.0), lines: [[['valid token', 'n']], [['401 or ', 'ns'], ['403', 'nsa'], ['?', 'ns']]], l2: v(51.058) },
];
PH.forEach((P, i) => { P.t1 = i + 1 < PH.length ? PH[i + 1].t0 - .35 : DUR + 1; });
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
for (const P of PH) { let last = -1; for (const c of P.L) { if (c.tc - last > .2) { E(c.tc, 'char', { acc: c.col === C.accent, big: c.size > 1 }); last = c.tc; } } }
{ let lastStep = -1; for (let t = 0; t < DUR; t += 1 / 60) { const p = priyaAt(t); if (!p.walking) continue; const n = Math.floor(phaseAt(t) / Math.PI); if (n !== lastStep) { if (lastStep >= 0) E(t, 'step'); lastStep = n; } } }
E(T_SCAN1, 'tick'); E(T_DENY1, 'deny'); E(T_PRINT - .1, 'slide'); E(T_PRINT + .7, 'beep'); E(T_TAKE, 'tick');
E(T_SCAN2, 'beep'); E(T_GATE, 'gate'); E(T_LOCK, 'lock'); E(T_DENY2, 'deny'); T_OK.forEach(t => E(t, 'lamp'));
E(v(51.058), 'tick'); E(v(52.137), 'tick');
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
  onPlane(g, 6.4, 9.6, 0, 'xy', gg => { gg.fillStyle = '#E4D2B2'; gg.fillRect(-1.6, -1.6, 1.6, 1.8); });
}
function disc(g, x, y, r, col, a) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.fillStyle = col; gg.fill(); }); }
function ring(g, x, y, r, col, a, lw = .07) { if (a <= 0) return; onPlane(g, x, y, 0, 'xy', gg => { gg.globalAlpha = a; gg.beginPath(); gg.arc(0, 0, r, 0, Math.PI * 2); gg.strokeStyle = col; gg.lineWidth = lw; gg.stroke(); }); }


function walls(g, t) {
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, .25, 60, WH, tri(WALLC, .1, .12));
  iso.boxNow(WALL_X - .25, WALL_Y - .25, 0, 60, .25, WH, tri(WALLC, .1, .12));
  for (const y0 of [2, 6, 10, 14]) onPlane(g, WALL_X + .001, y0, 0, 'yz', gg => { gg.fillStyle = '#CFDCD4'; gg.fillRect(-2.2, -2.3, 2.2, 1.3); gg.fillStyle = '#E9E0CF'; gg.fillRect(-1.15, -2.3, .06, 1.3); });
  onPlane(g, WALL_X, WALL_Y + .001, 0, 'xz', gg => { gg.fillStyle = SUBJ_LT; gg.fillRect(0, -.16, 40, .16); });
  const dark = 1 - ss(seg(t, PART[5] - .4, PART[5] + .2));
  DOORS.forEach((D, i) => {
    const srv = i === 1;
    const lit = !srv ? ss(seg(t, T_OK[i ? 1 : 0], T_OK[i ? 1 : 0] + .3)) * dark : 0;
    onPlane(g, D.x, WALL_Y + .002, 0, 'xz', gg => {
      gg.fillStyle = DOORC; gg.fillRect(0, -2.15, 1.2, 2.15);
      gg.fillStyle = hex(mix(DOORC, '#5B4434', .25)); gg.fillRect(1.0, -1.2, .08, .3);
      let lamp = mix(C.ghost, C.accent, lit);
      if (srv) { const blink = t > T_DENY2 && t < T_DENY2 + 1.4 ? (Math.floor((t - T_DENY2) / .2) % 2 === 0 ? 1 : 0) : 0; lamp = mix(C.ghost, C.ink, blink); }
      gg.beginPath(); gg.arc(.6, -2.42, .11, 0, Math.PI * 2); gg.fillStyle = css(lamp); gg.fill();
      gg.fillStyle = C.ink; gg.font = font(600, 100); gg.textAlign = 'center';
      gg.save(); gg.translate(.6, -2.62); gg.scale(.0024, .0024); gg.fillText(D.name, 0, 0); gg.restore();
      if (srv) {
        const a = ss(seg(t, T_LOCK, T_LOCK + .3)), sh = t > T_DENY2 && t < T_DENY2 + .6 ? Math.sin((t - T_DENY2) * 40) * .03 : 0;
        if (a > 0) {
          gg.save(); gg.globalAlpha = a; gg.translate(.6 + sh, -1.15);
          gg.strokeStyle = C.ink; gg.lineWidth = .045; gg.beginPath(); gg.arc(0, -.1, .1, Math.PI, 0); gg.stroke();
          gg.fillStyle = C.ink; gg.fillRect(-.15, -.1, .3, .24); gg.restore();
        }
        // "403" plate under the lamp after the refusal
        const b = ss(seg(t, T_DENY2 + .2, T_DENY2 + .5)) * dark;
        if (b > 0) { gg.save(); gg.globalAlpha = b; gg.fillStyle = C.ink; gg.fillRect(.25, -1.95, .7, .3); gg.fillStyle = '#F4EEE2'; gg.font = font(700, 100, 'Inter'); gg.textAlign = 'center'; gg.translate(.6, -1.73); gg.scale(.0021, .0021); gg.fillText('403', 0, 0); gg.restore(); }
      }
    });
    onPlane(g, D.x + 1.32, WALL_Y + .002, 0, 'xz', gg => { gg.fillStyle = '#4A4E4B'; gg.fillRect(0, -1.35, .16, .24); });
  });
}

function badge(x, y, z, col, band, alpha = 1) {
  iso.box(x, y, z, .44, .32, .04, tri(col), { bias: -z - .1, cull: false, decal: (I, b) => {
    onPlane(g, b.x, b.y, b.z + b.h + .001, 'xy', gg => { gg.globalAlpha = alpha; gg.fillStyle = band; gg.fillRect(-b.d, 0, b.d, .1); });
  } });
}
function props(t) {
  const subj = tri(SUBJ, .25, .2);
  // badge kiosk: a printer box with a small screen, the new badge slides out of its slot
  const [kx, ky, kw, kd, kh] = KIOSK;
  iso.box(kx, ky, 0, kw, kd, kh, tri('#CDBFA6'), { bias: -kh / 2, decal: (I, b) => {
    onPlane(g, b.x + b.w + .001, b.y + b.d, b.z + .75, 'yz', gg => { gg.fillStyle = SCREEN; gg.fillRect(-.5, -.3, .4, .25); });
  } });
  const out = eio(seg(t, T_PRINT, T_PRINT + .8)), taken = seg(t, T_TAKE, T_TAKE + .3);
  if (out > 0 && taken < 1) badge(kx + .14 + out * .2, ky + .14, kh, '#F4EEE2', C.accent);
  // turnstile with a reader that refuses (ink) then accepts (accent)
  const open = eio(seg(t, T_GATE, T_GATE + .7));
  POSTS.forEach(x => iso.box(x, GATE_Y - .1, 0, .25, .5, 1.0, tri('#B8AE9C'), { bias: -.5 }));
  const shake = t > T_DENY1 && t < T_DENY1 + .5 ? Math.sin((t - T_DENY1) * 45) * .04 : 0;
  const leafW = 1.5 * (1 - open);
  if (leafW > .02) iso.box(4.85 + shake, GATE_Y + .1, .1, leafW, .06, .8, tri('#C9DAD3', .1, .12), { bias: -.45 });
  const no = t > T_DENY1 && t < T_DENY1 + 1.6 ? (Math.floor((t - T_DENY1) / .2) % 2 === 0 ? 1 : 0) : 0;
  const yes = ss(seg(t, T_SCAN2 + .1, T_SCAN2 + .35));
  iso.box(6.38, GATE_Y + .2, 1.0, .19, .22, .06, tri('#3E4240'), { bias: -1.05, decal: (I, b) => {
    onPlane(g, b.x + b.w / 2, b.y + b.d / 2, b.z + b.h + .001, 'xy', gg => { gg.beginPath(); gg.arc(0, 0, .06, 0, Math.PI * 2); gg.fillStyle = css(mix(mix('#6F6A60', C.ink, no), C.accent, yes)); gg.fill(); });
  } });
  for (let x = 0.6; x < 4.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 4.6 - x), .2, .9, subj, { bias: -.45 });
  for (let x = 6.6; x < 10.6; x += 1) iso.box(x, GATE_Y + .05, 0, Math.min(1, 10.6 - x), .2, .9, subj, { bias: -.45 });
  // server box beside the server room
  const [sx, sy, sw, sd, sh] = SERVER;
  iso.box(sx, sy, 0, sw, sd, sh, tri('#5A605C', .25, .2), { bias: -sh / 2, decal: (I, b) => {
    for (let k = 0; k < 5; k++) onPlane(g, b.x, b.y + b.d + .001, b.z + .3 + k * .26, 'xz', gg => { gg.fillStyle = '#7B827D'; gg.fillRect(.08, -.06, b.w - .16, .05); gg.beginPath(); gg.arc(.14, -.15, .025, 0, 7); gg.fillStyle = '#9FD3B4'; gg.fill(); });
  } });
  iso.box(WALL_X + .4, 1.0, 0, .5, .5, .45, tri('#C8B08C'), { bias: -.22 });
  iso.cone(WALL_X + .65, 1.25, .45, .38, 1.1, tri('#6E9886', .2, .2), { n: 6 });
}

function people(t) {
  iso.bill(7.4, 3.4, 0, gg => drawPerson(gg, GUARD, {}));
  const p = priyaAt(t);
  iso.bill(p.x, p.y, 0, gg => drawPerson(gg, PRIYA, { walking: p.walking, phase: phaseAt(t) }));
  // the expired badge in hand: grey card that fades when she reaches the kiosk
}

// floor marks: an ink ring at the gate after the 401, an accent ring when it lets her through
function marks(g, t) {
  const r1 = ss(seg(t, T_DENY1, T_DENY1 + .3)) * (1 - ss(seg(t, PART[2] + 1.5, PART[2] + 2)));
  ring(g, 5.6, 5.3, .55, C.ink, r1 * .8);
  const r2 = ss(seg(t, T_SCAN2 + .1, T_SCAN2 + .4)) * (1 - ss(seg(t, T_GATE + 1.6, T_GATE + 2.1)));
  disc(g, 5.6, 5.3, .55, C.accentLt, r2 * .8); ring(g, 5.6, 5.3, .55, C.accent, r2);
  const r3 = ss(seg(t, T_DENY2, T_DENY2 + .3)) * (1 - ss(seg(t, PART[4] + 1, PART[4] + 1.5)));
  ring(g, 5.6, -0.5, .55, C.ink, r3 * .8);
}

// ---------- screen overlay ----------
function wrap(g, s, maxW) { const out = []; let line = ''; for (const w of s.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; } if (line) out.push(line); return out; }
function overlay(g, t) {
  g.save();
  // header
  g.fillStyle = 'rgba(250,245,236,.93)'; g.beginPath(); g.roundRect(40, 56, W - 80, 128, 22); g.fill();
  g.textBaseline = 'alphabetic'; g.font = font(700, 46); g.fillStyle = '#1F9D55'; g.fillText('ACCESS GRANTED', 76, 118);
  const w1 = g.measureText('ACCESS GRANTED ').width; g.fillStyle = C.accent; g.fillText('· 04', 76 + w1, 118);
  g.font = font(500, 27); g.fillStyle = '#4A4A42'; g.fillText('401 vs 403: AuthN failed vs AuthZ failed', 78, 158);
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
  g.font = font(600, 22, 'Inter'); g.fillStyle = '#6B675E'; g.letterSpacing = '2px'; g.fillText('LVL 01 · IAM FOUNDATIONS · 04/148', W / 2, 1808); g.letterSpacing = '0px';
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
window.render = t => render(g, t);
window.READY = true;
