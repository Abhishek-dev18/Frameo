// "Liquid glass" visual kit (2025–26 trend): frosted glass cards, drifting spotlight glows, film grain,
// highlighter swipes, masked kinetic text, slow camera push-in, bento tiles. Same brand colours (grey/white/mint/coral).
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, spring} from "remotion";
import {C, MONO, SANS, clamp} from "./cine";

// Background: deep base, two slow-drifting colour glows, faint grid, animated film grain.
export const GlassBg: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <>
      <AbsoluteFill style={{background: "#121316"}} />
      <AbsoluteFill style={{background: `radial-gradient(520px 520px at ${300 + Math.sin(a) * 120}px ${640 + Math.cos(a * 0.8) * 160}px, ${C.g}2E, transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(560px 560px at ${780 + Math.cos(a * 0.9) * 110}px ${1250 + Math.sin(a * 0.7) * 180}px, ${C.bug}26, transparent 70%)`}} />
      <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.018) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.018) 2px, transparent 2px)", backgroundSize: "72px 72px"}} />
    </>
  );
};
export const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: 0.07, mixBlendMode: "overlay", pointerEvents: "none"}}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed={f % 12} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain)" />
    </svg>
  );
};

// Frosted glass card.
export const Glass: React.FC<{style?: React.CSSProperties; glow?: string; children?: React.ReactNode}> = ({style, glow, children}) => (
  <div
    style={{
      position: "relative", borderRadius: 30, padding: "22px 26px",
      background: "linear-gradient(160deg, rgba(255,255,255,.09), rgba(255,255,255,.025))",
      border: "1.5px solid rgba(255,255,255,.14)", backdropFilter: "blur(22px) saturate(140%)",
      boxShadow: `inset 0 1px 0 rgba(255,255,255,.18), 0 30px 70px rgba(0,0,0,.45)${glow ? `, 0 0 60px ${glow}55` : ""}`,
      ...style,
    }}
  >
    {children}
  </div>
);

// Highlighter swipe behind a word.
export const Marker: React.FC<{at: number; color?: string; children: React.ReactNode}> = ({at, color = C.g, children}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 9], [0, 1], clamp);
  return (
    <span style={{position: "relative", display: "inline-block"}}>
      <span style={{position: "absolute", left: -6, right: -6, bottom: "6%", height: "46%", background: color, opacity: 0.38, borderRadius: 6, transformOrigin: "0 50%", transform: `scaleX(${p})`}} />
      <span style={{position: "relative"}}>{children}</span>
    </span>
  );
};

// Masked kinetic line: each word slides up out of its own mask.
export const Reveal: React.FC<{at: number; size: number; color?: string; children: string; mono?: boolean; style?: React.CSSProperties}> = ({at, size, color = C.text, children, mono, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.26}px`, ...style}}>
      {children.split(" ").map((w, i) => {
        const s = spring({frame: f - at - i * 3, fps, config: {damping: 15, mass: 0.6}});
        return (
          <span key={i} style={{display: "inline-block", overflow: "hidden", paddingBottom: size * 0.08}}>
            <span style={{display: "inline-block", transform: `translateY(${(1 - s) * 110}%)`, fontFamily: mono ? MONO : SANS, fontWeight: mono ? 700 : 900, fontStretch: mono ? undefined : "74%", textTransform: mono ? "none" : "uppercase", fontSize: size, lineHeight: 1, color}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

// Slow camera push-in over a scene.
export const Push: React.FC<{len: number; children: React.ReactNode; amount?: number}> = ({len, children, amount = 0.045}) => {
  const f = useCurrentFrame();
  const s = 1 + interpolate(f, [0, len], [0, amount], clamp);
  return <AbsoluteFill style={{transform: `scale(${s})`, transformOrigin: "50% 45%"}}>{children}</AbsoluteFill>;
};

// "Trending" chip with a live dot.
export const LiveChip: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  return (
    <span style={{display: "inline-flex", alignItems: "center", gap: 12, padding: "8px 16px", borderRadius: 999, background: `${C.bug}1F`, border: `1.5px solid ${C.bug}88`, fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.bug}}>
      <span style={{width: 12, height: 12, borderRadius: 6, background: C.bug, boxShadow: `0 0 0 ${4 + (f % 30) / 4}px ${C.bug}${Math.round(60 - (f % 30) * 2).toString(16).padStart(2, "0")}`}} />
      {text}
    </span>
  );
};
