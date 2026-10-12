// LastBlade.tsx — original anime short: "THE LAST BLADE · Episode 1: Crimson Moon"
// 1080x1920 · 30fps · 25s (750 frames). Letterbox + subtitles. All characters original.

import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const LB_TOTAL = 750;

const C = {
  black: "#000000",
  night: "#07071A",
  indigo: "#14143A",
  moon: "#F43F5E",
  moonCore: "#FFE4E6",
  hill: "#05050F",
  skin: "#F6D3BF",
  skinShade: "#E3A893",
  hair: "#151530",
  hairHi: "#34346B",
  ayaEye: ["#D1FAE5", "#34D399", "#064E3B"],
  rivalEye: ["#FECDD3", "#F43F5E", "#4C0519"],
  white: "#FFFFFF",
  muted: "#A5A6C8",
  petal: "#FBCFE8",
};
const SANS = "Inter, sans-serif";
const JP = "Noto Sans CJK JP, sans-serif";
const MONO = "DejaVu Sans Mono, monospace";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- timeline ----------
const T = {
  open: 0,
  face: 90,
  rival: 185,
  eyes: 260,
  charge: 330,
  impact: 375,
  after: 397,
  slice: 440,
  cut: 480,
  mask: 560,
  end: 652,
};

const subs: [number, string, string][] = [
  [0, "", ""],
  [14, "", "Ten years ago, the Crimson Moon took everything from her."],
  [90, "", ""],
  [128, "AYA", "So... you finally came back."],
  [185, "???", "I came for the blade, Aya."],
  [260, "", ""],
  [330, "", ""],
  [397, "", ""],
  [440, "", "..."],
  [494, "AYA", "...You've gotten faster."],
  [560, "", ""],
  [604, "AYA", "That eye... Brother?"],
  [652, "", ""],
];

// ---------- utils ----------
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const RAIN = (() => {
  const r = rng(3);
  return Array.from({length: 120}, () => ({x: r() * 1300 - 100, y: r() * 1920, l: 40 + r() * 70, s: 38 + r() * 20, o: 0.15 + r() * 0.35}));
})();
const PETALS = (() => {
  const r = rng(11);
  return Array.from({length: 34}, () => ({x: r() * 1080, y: r() * 1920, s: 8 + r() * 10, v: 2 + r() * 3, d: r() * 6, w: 1 + r() * 2}));
})();

const Rain: React.FC<{f: number; o?: number}> = ({f, o = 1}) => (
  <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o}}>
    {RAIN.map((d, i) => {
      const y = ((d.y + f * d.s) % 2100) - 100;
      const x = d.x - (y * 0.18);
      return <line key={i} x1={x} y1={y} x2={x - d.l * 0.18} y2={y + d.l} stroke="#C7D2FE" strokeOpacity={d.o} strokeWidth={2} />;
    })}
  </svg>
);

const Petals: React.FC<{f: number; speed?: number; o?: number}> = ({f, speed = 1, o = 1}) => (
  <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: o}}>
    {PETALS.map((p, i) => {
      const t = f * speed;
      const x = (p.x + t * p.v * 2.2 + Math.sin(t / 20 + p.d) * 60) % 1180 - 50;
      const y = (p.y + t * p.v) % 2000 - 40;
      return <ellipse key={i} cx={x} cy={y} rx={p.s} ry={p.s * 0.5} fill={C.petal} opacity={0.75} transform={`rotate(${t * p.w * 3 + p.d * 60} ${x} ${y})`} />;
    })}
  </svg>
);

// ---------- anime eye ----------
const Eye: React.FC<{
  id: string;
  cx: number;
  cy: number;
  w: number;
  open: number;
  colors: string[];
  pupil?: number;
  look?: number;
  flip?: boolean;
}> = ({id, cx, cy, w, open, colors, pupil = 0.42, look = 0, flip}) => {
  const h = w * 0.78 * Math.max(open, 0.04);
  const shape = `M ${-w} 6 C ${-w * 0.55} ${-h}, ${w * 0.5} ${-h * 1.08}, ${w} -4 C ${w * 0.55} ${h * 0.62}, ${-w * 0.5} ${h * 0.62}, ${-w} 6 Z`;
  const ir = w * 0.5;
  return (
    <g transform={`translate(${cx} ${cy}) scale(${flip ? -1 : 1} 1)`}>
      <defs>
        <clipPath id={`clip-${id}`}>
          <path d={shape} />
        </clipPath>
        <radialGradient id={`iris-${id}`} cx="0.5" cy="0.7" r="0.65">
          <stop offset="0" stopColor={colors[0]} />
          <stop offset="0.45" stopColor={colors[1]} />
          <stop offset="1" stopColor={colors[2]} />
        </radialGradient>
      </defs>
      <path d={shape} fill="#FFFFFF" />
      <g clipPath={`url(#clip-${id})`}>
        <ellipse cx={look} cy={w * 0.06} rx={ir} ry={ir * 1.22} fill={`url(#iris-${id})`} />
        <ellipse cx={look} cy={w * 0.08} rx={ir * pupil} ry={ir * pupil * 1.35} fill="#05050F" />
        <ellipse cx={look} cy={-w * 0.32} rx={ir * 1.05} ry={ir * 0.5} fill="rgba(0,0,0,.28)" />
        <ellipse cx={look + ir * 0.35} cy={-w * 0.12} rx={ir * 0.26} ry={ir * 0.32} fill="#FFFFFF" />
        <circle cx={look - ir * 0.35} cy={w * 0.3} r={ir * 0.1} fill="#FFFFFF" opacity={0.85} />
      </g>
      {/* lashes */}
      <path
        d={`M ${-w * 1.04} 10 C ${-w * 0.55} ${-h - 4}, ${w * 0.5} ${-h * 1.1 - 4}, ${w * 1.06} -6`}
        stroke={C.hair}
        strokeWidth={w * 0.13}
        fill="none"
        strokeLinecap="round"
      />
      <path d={`M ${w * 0.98} -4 l ${w * 0.22} ${-w * 0.14} M ${w * 0.86} ${-h * 0.45} l ${w * 0.2} ${-w * 0.2}`} stroke={C.hair} strokeWidth={w * 0.07} strokeLinecap="round" />
      <path d={`M ${-w * 0.7} ${h * 0.5} C ${-w * 0.3} ${h * 0.68}, ${w * 0.3} ${h * 0.68}, ${w * 0.75} ${h * 0.42}`} stroke={C.hair} strokeOpacity={0.6} strokeWidth={w * 0.03} fill="none" />
    </g>
  );
};

// ---------- Aya front close-up ----------
const AyaFace: React.FC<{f: number; open: number; talking: boolean; cut: number; look?: number}> = ({f, open, talking, cut, look = 0}) => {
  const sway = (i: number) => Math.sin(f / 10 + i * 0.8) * 8;
  const tips = [170, 120, 75, 28, -22, -70, -118, -165];
  const tipY = [-58, -110, -36, -96, -22, -104, -44, -76];
  const bangs = [`-190,-150`, `-150,-262`, `0,-296`, `150,-262`, `190,-150`];
  tips.forEach((x, i) => {
    bangs.push(`${x + sway(i)},${tipY[i]}`);
    bangs.push(`${x - 24 + sway(i) * 0.5},${-150}`);
  });
  const mouthOpen = talking && f % 8 < 4;
  return (
    <g transform="translate(540 1000) scale(2.1)">
      {/* back hair */}
      <path d={`M -205 -120 Q -230 -330 0 -330 Q 230 -330 205 -120 L ${225 + sway(2)} 300 L 150 250 L 120 320 L 60 240 L -60 240 L -120 320 L -150 250 L ${-225 + sway(3)} 300 Z`} fill={C.hair} />
      {/* neck */}
      <rect x={-48} y={150} width={96} height={170} fill={C.skinShade} />
      {/* face */}
      <path d="M -160 -130 Q -170 70 -62 178 L 0 214 L 62 178 Q 170 70 160 -130 Q 0 -240 -160 -130 Z" fill={C.skin} />
      <path d="M -160 -130 Q -170 70 -62 178 L 0 214 L -10 190 Q -120 100 -135 -110 Z" fill={C.skinShade} opacity={0.55} />
      {/* blush */}
      <ellipse cx={-98} cy={62} rx={34} ry={14} fill="#F472B6" opacity={0.28} />
      <ellipse cx={98} cy={62} rx={34} ry={14} fill="#F472B6" opacity={0.28} />
      {/* brows */}
      <path d="M -128 -62 Q -80 -84 -36 -70" stroke={C.hair} strokeWidth={7} fill="none" strokeLinecap="round" />
      <path d="M 36 -70 Q 80 -84 128 -62" stroke={C.hair} strokeWidth={7} fill="none" strokeLinecap="round" />
      {/* eyes */}
      <Eye id="ayaL" cx={-80} cy={-6} w={52} open={open} colors={C.ayaEye} look={look} flip />
      <Eye id="ayaR" cx={80} cy={-6} w={52} open={open} colors={C.ayaEye} look={look} />
      {/* nose + mouth */}
      <path d="M 6 60 L 12 84 L 2 86" stroke={C.skinShade} strokeWidth={4} fill="none" strokeLinecap="round" />
      {mouthOpen ? <ellipse cx={0} cy={132} rx={16} ry={10} fill="#7F1D1D" /> : <path d="M -18 132 Q 0 138 18 132" stroke="#9F1239" strokeWidth={4} fill="none" strokeLinecap="round" />}
      {/* cheek cut */}
      {cut > 0 ? (
        <g>
          <line x1={66} y1={40} x2={66 + 70 * cut} y2={40 + 26 * cut} stroke="#BE123C" strokeWidth={5} strokeLinecap="round" />
          <ellipse cx={100} cy={58 + Math.min(1, Math.max(0, cut - 0.6)) * 70} rx={4} ry={7} fill="#BE123C" opacity={cut > 0.6 ? 1 : 0} />
        </g>
      ) : null}
      {/* bangs + side locks */}
      <polygon points={bangs.join(" ")} fill={C.hair} />
      <path d={`M -170 -150 Q -200 40 ${-170 + sway(5)} 230 L -140 120 Q -150 -20 -130 -120 Z`} fill={C.hair} />
      <path d={`M 170 -150 Q 200 40 ${170 + sway(6)} 230 L 140 120 Q 150 -20 130 -120 Z`} fill={C.hair} />
      <path d="M -60 -270 Q 0 -300 70 -268" stroke={C.hairHi} strokeWidth={10} fill="none" strokeLinecap="round" />
      {/* collar */}
      <path d="M -150 330 L -48 250 L 0 300 L 48 250 L 150 330 Z" fill="#1E1B4B" />
      <path d="M -48 250 L 0 300 L 48 250" stroke="#E11D48" strokeWidth={8} fill="none" />
    </g>
  );
};

// ---------- side-view fighter silhouette ----------
type Pose = "stand" | "dash" | "crouch";
const Fighter: React.FC<{x: number; y: number; facing: 1 | -1; pose: Pose; f: number; eye: string; sword?: "low" | "high"; s?: number}> = ({
  x,
  y,
  facing,
  pose,
  f,
  eye,
  sword = "low",
  s = 1,
}) => {
  const flap = Math.sin(f / 4) * 14;
  const lean = pose === "dash" ? 24 : pose === "crouch" ? 10 : 0;
  const drop = pose === "crouch" ? 40 : 0;
  const legs =
    pose === "dash" ? "M 0 -110 L 70 -20 L 95 0 M 0 -110 L -60 -40 L -110 -30" : pose === "crouch" ? "M 0 -80 L 60 -30 L 60 0 M 0 -80 L -50 -10 L -90 0" : "M 0 -110 L 22 0 M 0 -110 L -22 0";
  const swordPath =
    pose === "dash"
      ? "M 30 -150 L -170 -110"
      : pose === "crouch"
        ? "M 40 -110 L 210 -60"
        : sword === "high"
          ? "M 30 -160 L 120 -320"
          : "M 36 -140 L 190 -80";
  return (
    <g transform={`translate(${x} ${y + drop}) scale(${facing * s} ${s}) rotate(${lean} 0 -110)`} style={{filter: "drop-shadow(0 0 3px rgba(244,63,94,.9)) drop-shadow(0 0 10px rgba(244,63,94,.45))"}}>
      {/* coat tail */}
      <polygon points={`-10,-200 -30,-200 ${-110 - flap},${-70 + flap * 0.5} ${-60 - flap * 0.6},-40 -10,-110`} fill={C.hill} />
      <path d={legs} stroke={C.hill} strokeWidth={20} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M -26 -205 L 26 -205 L 18 -105 L -18 -105 Z" fill={C.hill} />
      <path d="M 10 -190 L 36 -140" stroke={C.hill} strokeWidth={16} strokeLinecap="round" />
      <path d={swordPath} stroke="#E5E7EB" strokeWidth={5} strokeLinecap="round" />
      <circle cx={0} cy={-238} r={30} fill={C.hill} />
      <polygon points={`-20,-262 ${-80 - flap},-250 -28,-236 ${-90 - flap},-224 -26,-214`} fill={C.hill} />
      <ellipse cx={14} cy={-240} rx={7} ry={3} fill={eye} />
    </g>
  );
};

// ---------- backdrops ----------
const Night: React.FC<{f: number; moonSlice?: number}> = ({f, moonSlice = 0}) => {
  const gap = moonSlice * 14;
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <defs>
        <linearGradient id="nsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.night} />
          <stop offset="0.6" stopColor={C.indigo} />
          <stop offset="1" stopColor="#3B0A24" />
        </linearGradient>
        <radialGradient id="mglow">
          <stop offset="0.5" stopColor={C.moon} stopOpacity={0.55} />
          <stop offset="1" stopColor={C.moon} stopOpacity={0} />
        </radialGradient>
        <clipPath id="mtop">
          <polygon points="0,0 1080,0 1080,560 0,880" />
        </clipPath>
        <clipPath id="mbot">
          <polygon points="0,880 1080,560 1080,1920 0,1920" />
        </clipPath>
      </defs>
      <rect width={1080} height={1920} fill="url(#nsky)" />
      <circle cx={540} cy={720} r={420} fill="url(#mglow)" />
      <g clipPath="url(#mtop)" transform={`translate(${-gap} ${-gap * 0.3})`}>
        <circle cx={540} cy={720} r={260} fill={C.moon} />
        <circle cx={500} cy={680} r={190} fill="#FB7185" opacity={0.5} />
      </g>
      <g clipPath="url(#mbot)" transform={`translate(${gap} ${gap * 0.3})`}>
        <circle cx={540} cy={720} r={260} fill={C.moon} />
        <circle cx={500} cy={680} r={190} fill="#FB7185" opacity={0.5} />
      </g>
      {moonSlice > 0 ? <line x1={0} y1={880} x2={1080} y2={560} stroke={C.moonCore} strokeWidth={6 * (1 - moonSlice) + 1} opacity={1 - moonSlice * 0.6} /> : null}
      {/* mountains + field */}
      <path d="M 0 1180 L 160 1040 L 300 1130 L 470 980 L 640 1120 L 820 1010 L 1080 1150 L 1080 1920 L 0 1920 Z" fill="#0B0820" />
      <path d={`M 0 1260 Q 540 ${1225 + Math.sin(f / 30) * 4} 1080 1260 L 1080 1920 L 0 1920 Z`} fill={C.hill} />
      {/* grass blades */}
      {Array.from({length: 40}, (_, i) => {
        const gx = i * 28;
        const bend = Math.sin(f / 8 + i) * 10;
        return <path key={i} d={`M ${gx} 1300 Q ${gx + 4} 1270 ${gx + 12 + bend} 1236`} stroke={C.hill} strokeWidth={6} fill="none" />;
      })}
    </svg>
  );
};

const SpeedLines: React.FC<{f: number; color: string; cx?: number; cy?: number; inner?: number}> = ({f, color, cx = 540, cy = 960, inner = 320}) => {
  const r = rng(Math.floor(f / 2) + 5);
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      {Array.from({length: 80}, (_, i) => {
        const a = r() * Math.PI * 2;
        const ri = inner + r() * 260;
        const w = 0.008 + r() * 0.016;
        const R = 1500;
        return (
          <polygon
            key={i}
            points={`${cx + Math.cos(a - w) * R},${cy + Math.sin(a - w) * R} ${cx + Math.cos(a + w) * R},${cy + Math.sin(a + w) * R} ${cx + Math.cos(a) * ri},${cy + Math.sin(a) * ri}`}
            fill={color}
          />
        );
      })}
    </svg>
  );
};

// ---------- scenes ----------
const Establish: React.FC<{f: number}> = ({f}) => {
  const zoom = interpolate(f, [0, T.face], [1.15, 1.0], clamp);
  return (
    <AbsoluteFill style={{transform: `scale(${zoom})`}}>
      <Night f={f} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <Fighter x={680} y={1262} facing={-1} pose="stand" f={f} eye="#34D399" s={1.6} />
      </svg>
      <Petals f={f} />
      <Rain f={f} />
    </AbsoluteFill>
  );
};

const FaceShot: React.FC<{f: number; start: number; cutAt?: number}> = ({f, start, cutAt}) => {
  const t = f - start;
  const open = cutAt ? 1 : interpolate(t, [8, 22], [0.05, 1], clamp);
  const blink = t > 60 && t % 70 < 3 ? 0.05 : open;
  const talking = cutAt ? f >= T.cut + 14 && f < T.cut + 40 : f >= start + 38 && f < start + 70;
  const cut = cutAt ? interpolate(f, [cutAt, cutAt + 10, cutAt + 40], [0, 1, 1.6], clamp) : 0;
  const zoom = interpolate(t, [0, 95], [1.0, 1.08], clamp);
  return (
    <AbsoluteFill style={{background: "#1A0B2E"}}>
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 35%, #7F1D4F 0%, #1A0B2E 60%)"}} />
      <Petals f={f} speed={0.6} o={0.7} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 45%"}}>
        <AyaFace f={f} open={blink} talking={talking} cut={cut} look={cutAt ? -6 : 0} />
      </svg>
      <Rain f={f} o={0.6} />
    </AbsoluteFill>
  );
};

const RivalShot: React.FC<{f: number}> = ({f}) => {
  const t = f - T.rival;
  const rise = interpolate(t, [0, 30], [80, 0], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 3)});
  const glow = interpolate(t, [20, 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Night f={f} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {/* low-angle ridge */}
        <path d="M 0 1500 Q 540 1300 1080 1500 L 1080 1920 L 0 1920 Z" fill={C.hill} />
        <g transform={`translate(0 ${rise})`}>
          <Fighter x={540} y={1360} facing={-1} pose="stand" f={f} eye={C.moon} sword="high" s={2.2} />
          {/* mask glint */}
          <ellipse cx={540 - 14 * 2.2} cy={1360 - 240 * 2.2} rx={22 * glow} ry={8 * glow} fill={C.moon} opacity={0.6} />
        </g>
      </svg>
      <Petals f={f} speed={1.4} />
      <Rain f={f} />
    </AbsoluteFill>
  );
};

const EyesSplit: React.FC<{f: number}> = ({f}) => {
  const t = f - T.eyes;
  const top = interpolate(t, [0, 70], [1, 1.12], clamp);
  const bot = interpolate(t, [0, 70], [1.12, 1], clamp);
  const narrow = interpolate(t, [40, 55], [1, 0.62], clamp);
  return (
    <AbsoluteFill style={{background: C.black}}>
      <div style={{position: "absolute", top: 200, height: 755, left: 0, right: 0, overflow: "hidden", background: "#120A24"}}>
        <svg width={1080} height={755} style={{transform: `scale(${top})`}}>
          <rect width={1080} height={755} fill={C.skin} />
          <rect width={1080} height={755} fill="rgba(0,0,0,.15)" />
          <path d="M 120 170 Q 540 70 960 150" stroke={C.hair} strokeWidth={34} fill="none" strokeLinecap="round" />
          <Eye id="bigAya" cx={540} cy={420} w={330} open={narrow} colors={C.ayaEye} />
          <polygon points="0,0 1080,0 1080,90 900,60 700,110 520,50 300,100 120,60 0,95" fill={C.hair} />
        </svg>
      </div>
      <div style={{position: "absolute", top: 965, height: 755, left: 0, right: 0, overflow: "hidden", background: "#E5E7EB"}}>
        <svg width={1080} height={755} style={{transform: `scale(${bot})`}}>
          <rect width={1080} height={755} fill="#D4D4D8" />
          {/* mask surface + slit */}
          <path d="M 0 250 Q 540 200 1080 250" stroke="#A1A1AA" strokeWidth={6} fill="none" />
          <path d="M 120 380 Q 540 300 960 360 Q 540 470 120 380 Z" fill="#18181B" />
          <Eye id="bigRival" cx={540} cy={390} w={250} open={0.55 * narrow} colors={C.rivalEye} pupil={0.26} />
        </svg>
      </div>
      <div style={{position: "absolute", top: 955, height: 10, left: 0, right: 0, background: C.black}} />
    </AbsoluteFill>
  );
};

const Charge: React.FC<{f: number}> = ({f}) => {
  const t = interpolate(f, [T.charge + 6, T.impact], [0, 1], {...clamp, easing: (x) => x * x});
  const ax = interpolate(t, [0, 1], [880, 600]);
  const rx = interpolate(t, [0, 1], [200, 480]);
  return (
    <AbsoluteFill>
      <Night f={f} />
      <SpeedLines f={f} color="rgba(255,255,255,.18)" cy={1150} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {[0.25, 0.5].map((k) => (
          <g key={k} opacity={0.25 / k}>
            <Fighter x={ax + 140 * k} y={1262} facing={-1} pose="dash" f={f} eye="#34D399" s={1.5} />
            <Fighter x={rx - 140 * k} y={1262} facing={1} pose="dash" f={f} eye={C.moon} s={1.5} />
          </g>
        ))}
        <Fighter x={ax} y={1262} facing={-1} pose="dash" f={f} eye="#34D399" s={1.5} />
        <Fighter x={rx} y={1262} facing={1} pose="dash" f={f} eye={C.moon} s={1.5} />
      </svg>
      <Petals f={f} speed={3} />
      <Rain f={f} />
    </AbsoluteFill>
  );
};

const Impact: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const t = f - T.impact;
  const p = spring({frame: t, fps, config: {damping: 9, mass: 0.5}});
  const shake = Math.sin(t * 3) * interpolate(t, [0, 20], [26, 0], clamp);
  const invert = t < 8;
  return (
    <AbsoluteFill style={{background: invert ? C.white : "#0B0B12", transform: `translate(${shake}px, ${-shake * 0.6}px)`}}>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {[0, 1, 2].map((k) => {
          const r = interpolate(t, [k * 3, 20 + k * 3], [0, 900], clamp);
          return <circle key={k} cx={540} cy={1100} r={r} fill="none" stroke={invert ? C.black : C.moon} strokeWidth={14 - k * 4} opacity={interpolate(r, [0, 900], [1, 0])} />;
        })}
        <polygon points={`-100,${1500 - 40} 1180,${600 - 40} 1180,${600 + 6} -100,${1500 + 6}`} fill={C.moon} />
        <g fill={invert ? C.black : C.white}>
          <Fighter x={560} y={1262} facing={1} pose="dash" f={f} eye={C.moon} />
          <Fighter x={520} y={1262} facing={-1} pose="dash" f={f} eye="#34D399" />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          top: 330,
          width: "100%",
          textAlign: "center",
          fontFamily: JP,
          fontWeight: 900,
          fontSize: 360,
          color: invert ? C.black : C.moon,
          transform: `scale(${interpolate(p, [0, 1], [2.4, 1])}) rotate(-8deg)`,
          textShadow: invert ? "none" : `10px 10px 0 ${C.black}`,
        }}
      >
        斬
      </div>
    </AbsoluteFill>
  );
};

const Aftermath: React.FC<{f: number}> = ({f}) => {
  const slice = interpolate(f, [T.slice, T.slice + 24], [0, 1], clamp);
  const slow = interpolate(f, [T.after, T.after + 20], [1, 0.25], clamp);
  return (
    <AbsoluteFill>
      <Night f={f} moonSlice={slice} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <Fighter x={230} y={1262} facing={1} pose="crouch" f={0} eye="#34D399" s={1.45} />
        <Fighter x={850} y={1262} facing={-1} pose="crouch" f={0} eye={C.moon} s={1.45} />
      </svg>
      <Petals f={T.after + (f - T.after) * slow} />
    </AbsoluteFill>
  );
};

const MaskShot: React.FC<{f: number}> = ({f}) => {
  const t = f - T.mask;
  const crack = interpolate(t, [12, 30], [0, 1], clamp);
  const fall = interpolate(t, [40, 70], [0, 1], {...clamp, easing: (x) => x * x});
  const zoom = interpolate(t, [0, 92], [1, 1.1], clamp);
  return (
    <AbsoluteFill style={{background: "#0A0614"}}>
      <AbsoluteFill style={{background: "radial-gradient(circle at 50% 45%, #4C0519 0%, #0A0614 65%)"}} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, transform: `scale(${zoom})`, transformOrigin: "50% 50%"}}>
        <defs>
          <clipPath id="maskL">
            <polygon points="0,0 560,0 520,700 580,980 470,1300 0,1920" />
          </clipPath>
          <clipPath id="maskR">
            <polygon points="560,0 1080,0 1080,1920 470,1300 580,980 520,700" />
          </clipPath>
        </defs>
        {/* hood */}
        <path d="M 160 1600 Q 120 520 540 420 Q 960 520 920 1600 Z" fill="#0F0A1E" />
        {/* face under mask */}
        <ellipse cx={540} cy={1000} rx={280} ry={360} fill={C.skinShade} />
        <ellipse cx={540} cy={1000} rx={280} ry={360} fill={C.skin} opacity={0.7} />
        <path d="M 330 830 Q 410 800 490 828" stroke={C.hair} strokeWidth={16} fill="none" strokeLinecap="round" />
        <polygon points="250,760 330,620 400,720 460,600 520,700 560,640 560,760 250,860" fill={C.hair} />
        <Eye id="brotherEye" cx={420} cy={930} w={90} open={interpolate(t, [50, 62], [0.2, 1], clamp)} colors={C.ayaEye} flip />
        {/* mask: right half stays */}
        <g clipPath="url(#maskR)">
          <ellipse cx={540} cy={1000} rx={300} ry={380} fill="#E4E4E7" />
          <path d="M 590 930 Q 660 900 730 935 Q 660 955 590 930 Z" fill={C.moon} />
        </g>
        {/* mask: left half falls */}
        <g clipPath="url(#maskL)" transform={`translate(${-fall * 140} ${fall * 900}) rotate(${-fall * 35} 400 1000)`} opacity={1 - fall * 0.3}>
          <ellipse cx={540} cy={1000} rx={300} ry={380} fill="#E4E4E7" />
          <path d="M 350 935 Q 420 900 490 930 Q 420 955 350 935 Z" fill={C.moon} />
        </g>
        {/* crack */}
        <polyline points="560,640 520,700 580,980 470,1300" fill="none" stroke="#18181B" strokeWidth={8} strokeDasharray={900} strokeDashoffset={900 * (1 - crack)} opacity={1 - fall} />
      </svg>
      <Rain f={f} o={0.7} />
    </AbsoluteFill>
  );
};

const EndCard: React.FC<{f: number}> = ({f}) => {
  const {fps} = useVideoConfig();
  const t = f - T.end;
  const p = spring({frame: t - 4, fps, config: {damping: 14}});
  const bar = interpolate(t, [4, 24], [0, 820], clamp);
  return (
    <AbsoluteFill style={{background: C.black, alignItems: "center", justifyContent: "center"}}>
      <div style={{fontFamily: JP, fontSize: 60, color: C.moon, opacity: p, letterSpacing: 10}}>第1話</div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontStyle: "italic", fontSize: 128, lineHeight: 0.95, textAlign: "center", color: C.white, marginTop: 26, transform: `scale(${interpolate(p, [0, 1], [1.3, 1])}) skewX(-8deg)`, opacity: p}}>
        THE LAST
        <br />
        BLADE
      </div>
      <div style={{width: bar, height: 10, background: C.moon, marginTop: 30, transform: "skewX(-30deg)"}} />
      <div style={{fontFamily: SANS, fontSize: 40, color: C.muted, marginTop: 34, opacity: interpolate(t, [20, 32], [0, 1], clamp)}}>Episode 1 · Crimson Moon</div>
      <div style={{position: "absolute", bottom: 300, right: 80, fontFamily: SANS, fontStyle: "italic", fontWeight: 800, fontSize: 44, color: C.moon, opacity: interpolate(t, [40, 50], [0, 1], clamp), transform: "skewX(-8deg)"}}>
        To be continued ➜
      </div>
      <div style={{position: "absolute", bottom: 240, left: 0, right: 0, textAlign: "center", fontFamily: MONO, fontSize: 26, color: C.muted, letterSpacing: 4, opacity: interpolate(t, [46, 56], [0, 1], clamp)}}>
        a story by @yourhandle
      </div>
    </AbsoluteFill>
  );
};

// ---------- composition ----------
export const LastBlade: React.FC = () => {
  const f = useCurrentFrame();
  const flash = [T.charge, T.impact - 2, T.slice].some((a) => f >= a && f < a + 2);
  const [, who, line] = subs[subs.findLastIndex(([t]) => f >= t)];
  const scene =
    f < T.face ? <Establish f={f} />
    : f < T.rival ? <FaceShot f={f} start={T.face} />
    : f < T.eyes ? <RivalShot f={f} />
    : f < T.charge ? <EyesSplit f={f} />
    : f < T.impact ? <Charge f={f} />
    : f < T.after ? <Impact f={f} />
    : f < T.cut ? <Aftermath f={f} />
    : f < T.mask ? <FaceShot f={f} start={T.cut} cutAt={T.cut + 8} />
    : f < T.end ? <MaskShot f={f} />
    : <EndCard f={f} />;
  return (
    <AbsoluteFill style={{background: C.black}}>
      {scene}
      {flash ? <AbsoluteFill style={{background: C.white}} /> : null}
      <div style={{position: "absolute", top: 0, left: 0, right: 0, height: 200, background: C.black}} />
      <div style={{position: "absolute", bottom: 0, left: 0, right: 0, height: 210, background: C.black, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 60px"}}>
        {line ? (
          <div style={{textAlign: "center", fontFamily: SANS, fontSize: 42, fontWeight: 600, lineHeight: 1.3, color: C.white, fontStyle: who ? "normal" : "italic"}}>
            {who ? <span style={{color: who === "AYA" ? "#34D399" : C.moon, fontWeight: 800, marginRight: 14}}>{who}</span> : null}
            {line}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
