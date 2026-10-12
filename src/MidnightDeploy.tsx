// MidnightDeploy.tsx — an anime-style short: "Midnight Deploy · Episode 1: The Expired Token"
// 1080x1920 · 30fps · 23s (690 frames)
// Cinematic letterbox, no header. Handle appears only on the end card.

import React from "react";
import {AbsoluteFill, Audio, getInputProps, interpolate, interpolateColors, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {CHANNEL} from "./channel";

// Values PixelScript passes in for each episode (falls back to the built-in Episode 1).
const INPUT = getInputProps() as {channelName?: string; handle?: string; episodeTitle?: string; episodeNumber?: number; seriesName?: string};
const EP = {
  channel: INPUT.channelName || CHANNEL.name,
  handle: INPUT.handle || CHANNEL.handle,
  title: INPUT.episodeTitle || "The Expired Token",
  number: INPUT.episodeNumber || 1,
  series: (INPUT.seriesName || "Midnight Deploy").toUpperCase(),
};

export const MD_TOTAL = 690;

const C = {
  black: "#000000",
  night: "#030806",
  ink: "#0A120D",
  sil: "#020403",
  green: "#4ADE80",
  greenDark: "#14532D",
  amber: "#FBBF24",
  red: "#F43F5E",
  white: "#FFFFFF",
  muted: "#8FA79A",
};
const SANS = "Inter, sans-serif";
const MONO = "DejaVu Sans Mono, monospace";
const JP = "Noto Sans CJK JP, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- timeline ----------
const T = {
  clock: 12,
  alert: 92,
  byteIn: 104,
  eye: 172,
  code: 244,
  found: 300,
  fix: 362,
  deploy: 420,
  green: 470,
  dawn: 500,
  end: 606,
};

const subs: [number, string, string][] = [
  [0, "", ""],
  [20, "", "Bengaluru. 2:59 AM."],
  [56, "", "Everyone's asleep. Except Kai."],
  [104, "BYTE", "Kai... 10,000 users just got logged out."],
  [172, "KAI", "...Not tonight."],
  [244, "", ""],
  [300, "BYTE", "Found it. exp is in seconds. Date.now() is in milliseconds."],
  [340, "KAI", "So every token looks expired."],
  [362, "KAI", "One line. That's all it takes."],
  [420, "", ""],
  [470, "BYTE", "All 10,000 users are back!"],
  [500, "", "6:02 AM."],
  [526, "BYTE", "You should sleep."],
  [556, "KAI", "Just one more feature..."],
  [586, "BYTE", "-_-"],
  [606, "", ""],
];

// ---------- utils ----------
const rng = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const vis = (f: number, a: number, b: number, d = 6) =>
  Math.min(interpolate(f, [a, a + d], [0, 1], clamp), interpolate(f, [b - d, b], [1, 0], clamp));

// ---------- city ----------
type Bld = {x: number; w: number; h: number; win: {x: number; y: number; c: string}[]};
const makeCity = (seed: number, count: number, hMin: number, hMax: number, lit: number): Bld[] => {
  const r = rng(seed);
  const out: Bld[] = [];
  let x = -20;
  for (let i = 0; i < count && x < 1100; i++) {
    const w = 70 + r() * 70;
    const h = hMin + r() * (hMax - hMin);
    const win: Bld["win"] = [];
    for (let wy = 30; wy < h - 20; wy += 26) {
      for (let wx = 12; wx < w - 14; wx += 20) {
        if (r() < lit) win.push({x: wx, y: wy, c: r() < 0.75 ? C.green : C.amber});
      }
    }
    out.push({x, w, h, win});
    x += w + 4 + r() * 10;
  }
  return out;
};
const BACK = makeCity(7, 18, 380, 760, 0.16);
const FRONT = makeCity(21, 14, 200, 480, 0.1);
const STARS = (() => {
  const r = rng(99);
  return Array.from({length: 70}, () => ({x: r() * 1080, y: 220 + r() * 520, s: 1 + r() * 2.5, p: r() * 6}));
})();
const HORIZON = 1340;

const City: React.FC<{f: number; dawn: number; glow: string}> = ({f, dawn, glow}) => {
  const top = interpolateColors(dawn, [0, 1], ["#020604", "#1E1B4B"]);
  const mid = interpolateColors(dawn, [0, 1], ["#04110A", "#C2410C"]);
  const bot = interpolateColors(dawn, [0, 1], ["#0B2A1A", "#FDBA74"]);
  const winO = interpolate(dawn, [0, 1], [1, 0.25]);
  const drift = f * 0.15;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={top} />
          <stop offset="0.55" stopColor={mid} />
          <stop offset="0.72" stopColor={bot} />
        </linearGradient>
        <radialGradient id="moon">
          <stop offset="0.55" stopColor="#ECFDF5" />
          <stop offset="0.7" stopColor="rgba(236,253,245,.25)" />
          <stop offset="1" stopColor="rgba(236,253,245,0)" />
        </radialGradient>
        <radialGradient id="sun">
          <stop offset="0.4" stopColor="#FEF3C7" />
          <stop offset="0.6" stopColor="rgba(251,191,36,.5)" />
          <stop offset="1" stopColor="rgba(251,191,36,0)" />
        </radialGradient>
        <radialGradient id="laptop">
          <stop offset="0" stopColor={glow} stopOpacity={0.55} />
          <stop offset="1" stopColor={glow} stopOpacity={0} />
        </radialGradient>
      </defs>
      <rect width={1080} height={1920} fill="url(#sky)" />
      {/* stars + moon fade at dawn */}
      <g opacity={1 - dawn}>
        {STARS.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.s} fill="#D1FAE5" opacity={0.4 + 0.6 * Math.abs(Math.sin(f / 14 + s.p))} />
        ))}
        <circle cx={870 - drift} cy={680} r={130} fill="url(#moon)" />
      </g>
      {/* sun */}
      <circle cx={300} cy={interpolate(dawn, [0, 1], [HORIZON + 150, HORIZON - 430])} r={230} fill="url(#sun)" opacity={dawn} />
      {/* back skyline */}
      {BACK.map((b, i) => (
        <g key={i} transform={`translate(${b.x - drift * 0.4} ${HORIZON - b.h})`}>
          <rect width={b.w} height={b.h} fill={interpolateColors(dawn, [0, 1], ["#06120B", "#3B1D2E"])} />
          {b.win.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={8} height={12} fill={w.c} opacity={winO * (0.35 + 0.5 * ((j * 7 + i) % 3) / 2)} />
          ))}
        </g>
      ))}
      {/* front skyline */}
      {FRONT.map((b, i) => (
        <g key={i} transform={`translate(${b.x - drift} ${HORIZON - b.h + 40})`}>
          <rect width={b.w} height={b.h} fill={interpolateColors(dawn, [0, 1], ["#030A06", "#1F0F1A"])} />
          {b.win.map((w, j) => (
            <rect key={j} x={w.x} y={w.y} width={8} height={12} fill={w.c} opacity={winO * 0.8} />
          ))}
        </g>
      ))}
      {/* laptop glow around Kai */}
      <ellipse cx={540} cy={1250} rx={260} ry={200} fill="url(#laptop)" />
    </svg>
  );
};

// Kai, seen from behind, sitting on the rooftop ledge
const Kai: React.FC<{f: number; lean?: number}> = ({f, lean = 0}) => {
  const spikes = Array.from({length: 11}, (_, i) => {
    const a = (200 + i * 14) * (Math.PI / 180);
    const r = i % 2 === 0 ? 112 : 78;
    const sway = Math.sin(f / 9 + i) * 7;
    return `${540 + Math.cos(a) * r + sway},${1075 + Math.sin(a) * r}`;
  });
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <g transform={`rotate(${lean} 540 1340)`}>
        {/* hoodie body */}
        <path d="M 420 1345 Q 425 1185 495 1150 L 585 1150 Q 655 1185 660 1345 Z" fill={C.sil} />
        {/* hood fold */}
        <path d="M 478 1158 Q 540 1205 602 1158" stroke="#0D1A12" strokeWidth={8} fill="none" />
        {/* head + hair */}
        <circle cx={540} cy={1080} r={74} fill={C.sil} />
        <polygon points={`${spikes.join(" ")} 640,1085 440,1085`} fill={C.sil} />
        {/* rim light */}
        <path d="M 470 1060 Q 480 990 545 985" stroke={C.green} strokeOpacity={0.35} strokeWidth={4} fill="none" />
      </g>
      {/* rooftop ledge */}
      <rect x={0} y={1340} width={1080} height={400} fill="#010302" />
      <rect x={0} y={1340} width={1080} height={6} fill={C.green} opacity={0.25} />
    </svg>
  );
};

// Byte — tiny floating drone companion
type ByteMood = "normal" | "alarm" | "happy" | "flat";
const Byte: React.FC<{x: number; y: number; f: number; mood: ByteMood; s?: number}> = ({x, y, f, mood, s = 1}) => {
  const bob = Math.sin(f / 7) * 10;
  const ring = mood === "alarm" ? C.red : C.green;
  const blink = f % 70 < 3 && mood === "normal";
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`}>
      <path d={`M -14 50 L 0 ${78 + Math.sin(f) * 8} L 14 50 Z`} fill={C.amber} opacity={0.8} />
      <polygon points="-58,-6 -78,-26 -60,14" fill={ring} />
      <polygon points="58,-6 78,-26 60,14" fill={ring} />
      <circle r={52} fill="none" stroke={ring} strokeWidth={6} opacity={0.9} />
      <circle r={44} fill={C.ink} />
      {mood === "happy" ? (
        <path d="M -16 6 Q 0 -18 16 6" stroke={C.green} strokeWidth={8} fill="none" strokeLinecap="round" />
      ) : mood === "flat" ? (
        <line x1={-18} y1={0} x2={18} y2={0} stroke={C.green} strokeWidth={8} strokeLinecap="round" />
      ) : (
        <>
          <ellipse rx={mood === "alarm" ? 20 : 16} ry={blink ? 3 : mood === "alarm" ? 26 : 22} fill={ring} />
          {blink ? null : <circle cx={6} cy={-9} r={6} fill={C.white} />}
        </>
      )}
    </g>
  );
};

// anime speed lines (radial), re-randomized every 2 frames
const SpeedLines: React.FC<{f: number; color: string; o: number; inner?: number}> = ({f, color, o, inner = 300}) => {
  const r = rng(Math.floor(f / 2) + 7);
  const lines = Array.from({length: 70}, () => {
    const a = r() * Math.PI * 2;
    const ri = inner + r() * 240;
    const w = 0.01 + r() * 0.018;
    return {a, ri, w};
  });
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o}}>
      {lines.map((l, i) => {
        const R = 1400;
        const p1 = `${540 + Math.cos(l.a - l.w) * R},${960 + Math.sin(l.a - l.w) * R}`;
        const p2 = `${540 + Math.cos(l.a + l.w) * R},${960 + Math.sin(l.a + l.w) * R}`;
        const p3 = `${540 + Math.cos(l.a) * l.ri},${960 + Math.sin(l.a) * l.ri}`;
        return <polygon key={i} points={`${p1} ${p2} ${p3}`} fill={color} />;
      })}
    </svg>
  );
};

// Huge skewed impact word
const Slam: React.FC<{f: number; at: number; until: number; text: string; color: string}> = ({f, at, until, text, color}) => {
  const {fps} = useVideoConfig();
  if (f < at || f >= until) return null;
  const p = spring({frame: f - at, fps, config: {damping: 11, mass: 0.6}});
  const o = interpolate(f, [until - 6, until], [1, 0], clamp);
  return (
    <div
      style={{
        position: "absolute",
        top: 330,
        width: "100%",
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 900,
        fontStyle: "italic",
        fontSize: 190,
        color,
        letterSpacing: -4,
        opacity: o,
        transform: `scale(${interpolate(p, [0, 1], [2.2, 1])}) skewX(-10deg)`,
        textShadow: `8px 8px 0 ${C.black}`,
      }}
    >
      {text}
    </div>
  );
};

// ---------- scenes ----------
const EyeShot: React.FC<{f: number}> = ({f}) => {
  const t = f - T.eye;
  const open = interpolate(t, [0, 10, 18], [0.55, 0.55, 1], clamp);
  const pupil = interpolate(t, [10, 18], [92, 34], clamp);
  const zoom = interpolate(t, [0, 72], [1, 1.12], clamp);
  const shake = t > 10 && t < 22 ? Math.sin(t * 3) * 10 : 0;
  const ux = 360;
  const uy = 230 * open;
  const ly = 170 * open;
  const eyePath = `M ${-ux} 0 Q 0 ${-uy * 1.15} ${ux} ${-10} Q 0 ${ly} ${-ux} 0 Z`;
  return (
    <AbsoluteFill style={{background: "#140308"}}>
      <SpeedLines f={f} color="rgba(244,63,94,.18)" o={t > 10 ? 1 : 0} inner={420} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <defs>
          <clipPath id="eyeclip">
            <path d={eyePath} />
          </clipPath>
          <radialGradient id="iris" cx="0.5" cy="0.6" r="0.6">
            <stop offset="0" stopColor="#BBF7D0" />
            <stop offset="0.45" stopColor={C.green} />
            <stop offset="1" stopColor="#052E16" />
          </radialGradient>
        </defs>
        <g transform={`translate(${540 + shake} 960) scale(${zoom})`}>
          {/* brow */}
          <path d={`M -330 ${-uy - 120} Q 0 ${-uy - 210} 340 ${-uy - 150}`} stroke={C.sil} strokeWidth={34} fill="none" strokeLinecap="round" opacity={0.9} />
          <path d={eyePath} fill="#F1F5F9" />
          <g clipPath="url(#eyeclip)">
            <circle cx={0} cy={10} r={175} fill="url(#iris)" />
            <circle cx={0} cy={10} r={pupil} fill="#020403" />
            {/* reflection of the error */}
            <g opacity={0.85}>
              <rect x={-120} y={50} width={110} height={40} rx={6} fill={C.red} opacity={0.5 + 0.5 * Math.abs(Math.sin(f / 2))} />
              <text x={-65} y={78} textAnchor="middle" fontFamily={MONO} fontSize={20} fill={C.white}>
                401
              </text>
            </g>
            <circle cx={70} cy={-60} r={34} fill={C.white} />
            <circle cx={-60} cy={70} r={14} fill={C.white} opacity={0.8} />
            {/* upper lid shadow */}
            <path d={`M ${-ux} 0 Q 0 ${-uy * 1.15} ${ux} -10 L ${ux} -400 L ${-ux} -400 Z`} fill="rgba(0,0,0,.25)" transform="translate(0 40)" />
          </g>
          {/* lashes */}
          <path d={`M ${-ux - 20} 10 Q 0 ${-uy * 1.15 - 8} ${ux + 30} -20`} stroke={C.sil} strokeWidth={26} fill="none" strokeLinecap="round" />
          <path d={`M ${ux + 10} -16 l 60 -36 M ${ux - 20} -40 l 50 -50`} stroke={C.sil} strokeWidth={16} strokeLinecap="round" />
          <path d={`M ${-ux + 40} 18 Q 0 ${ly + 8} ${ux - 30} 0`} stroke={C.sil} strokeWidth={6} fill="none" opacity={0.6} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const CODE_BUG = "return token.exp < Date.now();";
const CODE_FIX = "return token.exp * 1000 < Date.now();";

const CodeShot: React.FC<{f: number}> = ({f}) => {
  const t = f - T.code;
  const fixed = f >= T.fix + 8;
  const typed = fixed ? CODE_FIX.slice(0, Math.floor(interpolate(f, [T.fix + 8, T.fix + 30], [7, CODE_FIX.length], clamp))) : CODE_BUG;
  const scanY = interpolate(t, [10, 50], [0, 360], clamp);
  const hi = f >= T.found;
  const lineColor = fixed ? C.green : hi ? C.red : C.white;
  const tilt = interpolate(t, [0, 170], [-5, -2], clamp);
  return (
    <AbsoluteFill style={{background: C.night}}>
      <SpeedLines f={f} color={fixed ? "rgba(74,222,128,.16)" : "rgba(255,255,255,.08)"} o={1} inner={460} />
      <div
        style={{
          position: "absolute",
          top: 640,
          left: 60,
          right: 60,
          transform: `rotate(${tilt}deg)`,
          background: "rgba(10,18,13,.95)",
          border: `4px solid ${lineColor}`,
          borderRadius: 24,
          padding: "34px 34px 40px",
          boxShadow: `0 0 80px ${lineColor}44`,
          fontFamily: MONO,
          fontSize: 34,
          lineHeight: 1.7,
          color: C.muted,
        }}
      >
        <div style={{color: C.muted}}>// auth/session.js</div>
        <div>
          <span style={{color: C.amber}}>function</span> <span style={{color: C.white}}>isExpired</span>(token) {"{"}
        </div>
        <div style={{position: "relative", paddingLeft: 40, color: lineColor, background: hi ? `${lineColor}22` : "transparent", borderRadius: 8}}>
          {typed}
          {fixed && typed.length < CODE_FIX.length ? <span style={{color: C.green}}>▌</span> : null}
        </div>
        <div>{"}"}</div>
        {/* Byte's scan beam */}
        {t >= 10 && t < 56 ? <div style={{position: "absolute", left: 0, right: 0, top: scanY, height: 8, background: C.green, opacity: 0.7, boxShadow: `0 0 30px ${C.green}`}} /> : null}
      </div>
      {/* unit callouts */}
      {f >= T.found + 6 && !fixed ? (
        <div style={{position: "absolute", top: 1060, left: 100, right: 100, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32}}>
          <div style={{color: C.amber, opacity: vis(f, T.found + 6, T.fix)}}>
            ↑ token.exp
            <br />
            <b>seconds</b>
          </div>
          <div style={{color: C.amber, textAlign: "right", opacity: vis(f, T.found + 14, T.fix)}}>
            Date.now() ↑
            <br />
            <b>milliseconds</b>
          </div>
        </div>
      ) : null}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <Byte x={880} y={540} f={f} mood={fixed ? "happy" : "normal"} s={0.9} />
      </svg>
      <Slam f={f} at={T.code} until={T.code + 34} text="TRACE." color={C.white} />
      <Slam f={f} at={T.found} until={T.found + 28} text="FOUND IT." color={C.red} />
      <Slam f={f} at={T.fix} until={T.fix + 30} text="FIX." color={C.green} />
    </AbsoluteFill>
  );
};

const DeployShot: React.FC<{f: number}> = ({f}) => {
  const ok = f >= T.green;
  const prog = interpolate(f, [T.deploy + 10, T.green - 4], [0, 100], clamp);
  const users = Math.round(interpolate(f, [T.green, T.green + 22], [0, 10000], clamp));
  const cmd = "git push origin main";
  const typed = cmd.slice(0, Math.floor(interpolate(f, [T.deploy, T.deploy + 14], [0, cmd.length], clamp)));
  return (
    <AbsoluteFill style={{background: ok ? "#03150A" : C.night}}>
      {ok ? <SpeedLines f={f} color="rgba(74,222,128,.2)" o={vis(f, T.green, T.dawn)} inner={380} /> : null}
      <div style={{position: "absolute", top: 560, left: 80, right: 80, fontFamily: MONO, fontSize: 38, color: C.white}}>
        <div>
          <span style={{color: C.green}}>$</span> {typed}
          {f % 16 < 8 ? "▌" : ""}
        </div>
        <div style={{marginTop: 50, height: 34, border: `3px solid ${C.green}`, borderRadius: 17, overflow: "hidden"}}>
          <div style={{height: "100%", width: `${prog}%`, background: C.green}} />
        </div>
        <div style={{marginTop: 16, fontSize: 28, color: C.muted}}>deploying… {Math.round(prog)}%</div>
      </div>
      {ok ? (
        <div style={{position: "absolute", top: 900, width: "100%", textAlign: "center"}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStyle: "italic", fontSize: 92, color: C.green, transform: "skewX(-8deg)", textShadow: `6px 6px 0 ${C.black}`}}>
            ALL SYSTEMS
            <br />
            NORMAL
          </div>
          <div style={{fontFamily: MONO, fontSize: 40, color: C.white, marginTop: 30}}>{users.toLocaleString("en-US")} users online</div>
        </div>
      ) : null}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <Byte x={540} y={ok ? 1380 - Math.abs(Math.sin(f / 4)) * 50 : 1380} f={f} mood={ok ? "happy" : "normal"} s={1.1} />
      </svg>
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const p = spring({frame: f - T.end - 6, fps, config: {damping: 14}});
  const stroke = interpolate(f, [T.end + 4, T.end + 24], [0, 860], clamp);
  return (
    <AbsoluteFill style={{background: C.black, alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: JP, fontSize: 64, color: C.green, opacity: p, letterSpacing: 10}}>第{EP.number}話</div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontStyle: "italic",
          fontSize: 120,
          lineHeight: 0.95,
          textAlign: "center",
          color: C.white,
          marginTop: 30,
          transform: `scale(${interpolate(p, [0, 1], [1.3, 1])}) skewX(-8deg)`,
          opacity: p,
        }}
      >
        {EP.series.split(" ").length > 1 ? (
          <>
            {EP.series.split(" ")[0]}
            <br />
            {EP.series.split(" ").slice(1).join(" ")}
          </>
        ) : (
          EP.series
        )}
      </div>
      <div style={{width: stroke, height: 10, background: C.green, marginTop: 30, transform: "skewX(-30deg)"}} />
      <div style={{fontFamily: SANS, fontSize: 40, color: C.muted, marginTop: 34, opacity: interpolate(f, [T.end + 20, T.end + 32], [0, 1], clamp)}}>
        Episode {EP.number} · {EP.title}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 560,
          right: 80,
          fontFamily: SANS,
          fontStyle: "italic",
          fontWeight: 800,
          fontSize: 44,
          color: C.amber,
          opacity: interpolate(f, [T.end + 40, T.end + 50], [0, 1], clamp),
          transform: "skewX(-8deg)",
        }}
      >
        To be continued ➜
      </div>
      <div style={{position: "absolute", bottom: 490, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 26, color: C.muted, letterSpacing: 4, opacity: interpolate(f, [T.end + 46, T.end + 56], [0, 1], clamp)}}>
        a {EP.channel} story · {EP.handle}
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const MidnightDeploy: React.FC = () => {
  const f = useCurrentFrame();
  const inCity = f < T.eye || (f >= T.dawn && f < T.end);
  const alert = f >= T.alert && f < T.eye;
  const dawn = interpolate(f, [T.dawn, T.dawn + 70], [0, 1], clamp);
  const glow = alert ? C.red : C.green;
  const shake = alert && f < T.alert + 16 ? Math.sin(f * 2.4) * 16 : 0;
  // impact flash frames
  const flash = [T.alert, T.eye + 10, T.fix, T.green].some((a) => f >= a && f < a + 2);

  const [, who, line] = subs[subs.findLastIndex(([t]) => f >= t)];

  return (
    <AbsoluteFill style={{background: C.black}}>
      {CHANNEL.music ? <Audio src={staticFile(CHANNEL.music)} volume={CHANNEL.musicVolume} /> : null}
      {inCity ? (
        <AbsoluteFill style={{transform: `translateX(${shake}px) scale(${interpolate(f, [0, T.eye], [1.08, 1], clamp)})`}}>
          <City f={f} dawn={dawn} glow={glow} />
          <Kai f={f} lean={interpolate(dawn, [0.3, 1], [0, -6], clamp)} />
          <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
            {f >= T.byteIn ? (
              <Byte
                x={interpolate(f, [T.byteIn, T.byteIn + 14], [1250, 780], clamp)}
                y={1050}
                f={f}
                mood={f >= T.dawn ? (f >= 586 ? "flat" : "normal") : "alarm"}
              />
            ) : null}
          </svg>
          {/* clock text */}
          {f < T.alert ? (
            <div style={{position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 200, fontSize: 150, color: C.white, opacity: vis(f, T.clock, T.alert), letterSpacing: 6}}>
              2<span style={{opacity: f % 30 < 15 ? 1 : 0.2}}>:</span>59
            </div>
          ) : null}
          {f >= T.dawn ? (
            <div style={{position: "absolute", top: 300, width: "100%", textAlign: "center", fontFamily: SANS, fontWeight: 200, fontSize: 150, color: C.white, opacity: vis(f, T.dawn + 4, T.dawn + 60, 10), letterSpacing: 6}}>
              6:02
            </div>
          ) : null}
          {/* alert glitch */}
          {alert ? (
            <>
              <AbsoluteFill style={{background: C.red, opacity: f % 8 < 4 ? 0.18 : 0.06, mixBlendMode: "screen"}} />
              <AbsoluteFill style={{backgroundImage: "repeating-linear-gradient(0deg, rgba(0,0,0,.25) 0 2px, transparent 2px 6px)"}} />
              <div
                style={{
                  position: "absolute",
                  top: 380,
                  width: "100%",
                  textAlign: "center",
                  fontFamily: MONO,
                  fontWeight: 700,
                  fontSize: 64,
                  color: C.red,
                  transform: `translateX(${f % 6 < 2 ? 8 : 0}px)`,
                  textShadow: `4px 0 0 rgba(74,222,128,.6), -4px 0 0 rgba(59,130,246,.6)`,
                }}
              >
                ⚠ PRODUCTION DOWN
                <div style={{fontSize: 34, color: C.white, marginTop: 14}}>401 Unauthorized ×10,000</div>
              </div>
            </>
          ) : null}
        </AbsoluteFill>
      ) : null}

      {f >= T.eye && f < T.code ? <EyeShot f={f} /> : null}
      {f >= T.code && f < T.deploy ? <CodeShot f={f} /> : null}
      {f >= T.deploy && f < T.dawn ? <DeployShot f={f} /> : null}
      {f >= T.end ? <EndCard f={f} /> : null}

      {flash ? <AbsoluteFill style={{background: C.white}} /> : null}

      {/* cinematic letterbox + fansub subtitles */}
      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 200, background: C.black}} />
      {/* bottom bar is 420px: subtitles sit in its top 120px, the rest stays clear for Instagram's caption overlay */}
      <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 420, background: C.black}} />
      <div style={{position: "absolute", top: 1500, left: 0, right: 0, height: 120, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 70px"}}>
        {line ? (
          <div style={{textAlign: "center", fontFamily: SANS, fontSize: 40, fontWeight: 600, lineHeight: 1.25, color: C.white}}>
            {who ? <span style={{color: who === "BYTE" ? C.green : C.amber, fontWeight: 800, marginRight: 14}}>{who}</span> : null}
            {line}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
