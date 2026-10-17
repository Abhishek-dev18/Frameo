// Shared pieces for the cinematic Debug Diaries cut (first used in Entry 004):
// kinetic "slam" type, HUD (REC + timecode + progress), perspective floor, flash + coral wipe transitions.
import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

export const C = {bg: "#161719", card: "#1D1E21", card2: "#232428", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
export const MONO = "'JetBrains Mono', monospace";
export const SANS = "'Archivo Variable', Inter, sans-serif";
export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
export const out = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
export const typed = (t: string, f: number, at: number, cps = 55) => t.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));

export const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const off = (f * 0.035) % 1;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const z = 0.6 + (i - off) * 0.55;
    if (z <= 0.35) continue;
    const y = 1080 + 820 / z;
    if (y > 1920) continue;
    lines.push(<line key={`h${i}`} x1={0} x2={1080} y1={y} y2={y} stroke={C.g} strokeOpacity={Math.min(0.14, 0.05 / z + 0.02)} strokeWidth={2} />);
  }
  for (let x = -8; x <= 8; x++) lines.push(<line key={`v${x}`} x1={540 + x * 70} y1={1110} x2={540 + x * 900} y2={1920} stroke={C.g} strokeOpacity={0.06} strokeWidth={2} />);
  return (
    <>
      <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.022) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.022) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <defs>
          <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={C.bg} stopOpacity={1} />
            <stop offset="0.35" stopColor={C.bg} stopOpacity={0} />
          </linearGradient>
        </defs>
        {lines}
        <rect x={0} y={1080} width={1080} height={840} fill="url(#fl)" />
      </svg>
    </>
  );
};

export const Hud: React.FC<{ep: string; total: number; series?: string}> = ({ep, total, series = "DEBUG DIARIES"}) => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const tc = `00:${String(Math.floor(sec)).padStart(2, "0")}.${String(Math.floor((sec % 1) * 100)).padStart(2, "0")}`;
  const b = 46, L = 64;
  const corners: [number, number, number, number][] = [[b, b, 1, 1], [1080 - b, b, -1, 1], [b, 1920 - b, 1, -1], [1080 - b, 1920 - b, -1, -1]];
  return (
    <>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {corners.map(([x, y, sx, sy], i) => <path key={i} d={`M${x} ${y + L * sy} L${x} ${y} L${x + L * sx} ${y}`} stroke={C.line} strokeWidth={4} fill="none" />)}
      </svg>
      <div style={{position: "absolute", left: 64, right: 64, top: 140, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
        <span>{series} · <span style={{color: C.g}}>{ep}</span></span>
        <span style={{display: "flex", alignItems: "center", gap: 14, letterSpacing: "0.06em"}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: C.bug, opacity: Math.floor(f / 15) % 2 ? 1 : 0.3}} />
          REC {tc}
        </span>
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 200, height: 5, background: C.line, borderRadius: 3}}>
        <div style={{width: `${(f / total) * 100}%`, height: "100%", background: C.g, borderRadius: 3}} />
      </div>
    </>
  );
};

export const Section: React.FC<{text: string; at?: number}> = ({text, at = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, top: 262, display: "flex", alignItems: "center", gap: 20, fontFamily: MONO, fontSize: 32, letterSpacing: "0.16em", color: C.g}}>
      <span style={{width: ease(f, at, at + 8) * 60, height: 4, background: C.g}} />
      <span>{typed(text, f, at + 3, 80)}</span>
    </div>
  );
};

// A word that slams in: big and wide-tracked, then settles.
export const Slam: React.FC<{at: number; size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties; origin?: string}> = ({at, size, color = C.text, children, style, origin = "left center"}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, mass: 0.55}});
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: SANS, fontWeight: 900, fontStretch: "74%", textTransform: "uppercase", lineHeight: 0.92, fontSize: size, color,
        transform: `scale(${1 + (1 - s) * 1.3})`, transformOrigin: origin, letterSpacing: `${(1 - s) * 0.25}em`, opacity: o, whiteSpace: "nowrap",
        filter: s < 0.6 ? `blur(${(0.6 - s) * 10}px)` : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
};

export const Card: React.FC<{title: string; tag?: string; tagColor?: string; border?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({title, tag, tagColor = C.dim, border = C.line, style, children}) => (
  <div style={{position: "absolute", left: 64, right: 150, background: C.card, border: `2.5px solid ${border}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.4)", ...style}}>
    <div style={{display: "flex", alignItems: "center", gap: 11, padding: "14px 22px", borderBottom: `2px solid ${C.line}`}}>
      {[0, 1, 2].map((i) => <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: "#3A3C42"}} />)}
      <span style={{marginLeft: 10, fontFamily: MONO, fontSize: 22, color: C.dim}}>{title}</span>
      {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 21, color: tagColor}}>● {tag}</span> : null}
    </div>
    <div style={{padding: "18px 26px", fontFamily: MONO, fontSize: 27, lineHeight: 1.6, whiteSpace: "pre"}}>{children}</div>
  </div>
);

// Cut transition: a white flash plus a skewed coral band that sweeps across.
export const Cut: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  if (f < at - 6 || f > at + 6) return null;
  const x = interpolate(f, [at - 6, at + 6], [-700, 1500], {...clamp, easing: Easing.inOut(Easing.quad)});
  const flash = f >= at ? interpolate(f, [at, at + 5], [0.22, 0], clamp) : 0;
  return (
    <>
      <div style={{position: "absolute", top: -200, bottom: -200, left: x, width: 150, background: C.bug, transform: "skewX(-14deg)", opacity: 0.92, boxShadow: `0 0 80px ${C.bug}`}} />
      <div style={{position: "absolute", top: -200, bottom: -200, left: x - 60, width: 24, background: C.bug, transform: "skewX(-14deg)", opacity: 0.5}} />
      {flash > 0 ? <AbsoluteFill style={{background: "#ffffff", opacity: flash}} /> : null}
    </>
  );
};

// 3D transition: the new scene swings in like a card turning on its left edge.
export const FlipIn: React.FC<{children: React.ReactNode; dur?: number}> = ({children, dur = 12}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  if (p >= 1) return <AbsoluteFill>{children}</AbsoluteFill>;
  return (
    <AbsoluteFill style={{perspective: 1600, perspectiveOrigin: "0% 50%"}}>
      <AbsoluteFill style={{transformOrigin: "0% 50%", transform: `rotateY(${(1 - p) * 75}deg) translateZ(${(1 - p) * -200}px)`, opacity: Math.min(1, p * 1.6)}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

// 3D card transition: the scene is a card; it flips in from edge-on and flips out at its end.
// Used per scene with its own length, so the old card turns away and the next one turns in.
export const Card3D: React.FC<{len: number; children: React.ReactNode; first?: boolean; last?: boolean; dur?: number}> = ({len, children, first, last, dur = 9}) => {
  const f = useCurrentFrame();
  const qin = first ? 0 : 1 - interpolate(f, [0, dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const qout = last ? 0 : interpolate(f, [len - dur, len], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const q = Math.max(qin, qout);
  if (q <= 0) return <AbsoluteFill>{children}</AbsoluteFill>;
  const angle = qin > 0 ? -88 * qin : 88 * qout;
  return (
    <AbsoluteFill style={{perspective: 2200}}>
      <AbsoluteFill
        style={{
          transform: `rotateY(${angle}deg) scale(${1 - 0.16 * Math.sin(q * Math.PI / 2)}) translateZ(${-260 * q}px)`,
          borderRadius: 56 * Math.min(1, q * 3), overflow: "hidden", background: C.bg,
          boxShadow: `0 0 0 4px ${C.line}, 0 40px 120px rgba(0,0,0,.6)`,
        }}
      >
        {children}
        <AbsoluteFill style={{background: "#000", opacity: q * 0.45}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
