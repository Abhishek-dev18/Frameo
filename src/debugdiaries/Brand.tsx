// Debug Diaries brand assets: YouTube banner and Instagram highlight covers.
import React from "react";
import {AbsoluteFill} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {bg: "#161719", card: "#1D1E21", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const grid = {backgroundImage: "linear-gradient(rgba(255,255,255,.03) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.03) 2px, transparent 2px)", backgroundSize: "64px 64px"};

const Mark: React.FC<{size: number}> = ({size}) => (
  <div style={{display: "flex", alignItems: "center", gap: size * 0.14, fontFamily: MONO, fontWeight: 700, fontSize: size, lineHeight: 1, color: C.g}}>
    <span>{"{"}</span>
    <span style={{width: size * 0.32, height: size * 0.32, borderRadius: size, background: C.bug, boxShadow: `0 0 0 ${size * 0.07}px ${C.bug}26`}} />
    <span>{"}"}</span>
  </div>
);

// YouTube banner 2560x1440. Everything important sits in the 1546x423 centre safe area.
export const Banner: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, ...grid}}>
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center"}}>
      <div style={{width: 1546, height: 423, display: "flex", alignItems: "center", gap: 70}}>
        <Mark size={250} />
        <div style={{display: "flex", flexDirection: "column", gap: 14}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "72%", fontSize: 150, lineHeight: 0.9, color: C.text, textTransform: "uppercase"}}>
            Debug <span style={{color: C.g}}>Diaries</span>
          </div>
          <div style={{fontFamily: MONO, fontSize: 40, color: C.text}}>
            Real bugs. Real fixes. <span style={{color: C.g}}>30 seconds</span> each.
          </div>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.dim, letterSpacing: "0.06em"}}>
            NEW ENTRY EVERY WEEK · @debugdiaries.io
          </div>
        </div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>
);

// Instagram highlight covers (1080x1920; Instagram shows the centre as a circle).
const ICONS: Record<string, React.ReactNode> = {
  bugs: <span style={{width: 220, height: 220, borderRadius: 110, background: C.bug, boxShadow: `0 0 0 50px ${C.bug}26`}} />,
  fixes: (
    <svg width="330" height="260" viewBox="0 0 360 280">
      <path d="M30 150 L130 245 L330 40" fill="none" stroke={C.g} strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  series: <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 300, color: C.g, lineHeight: 1}}>#</span>,
  basics: <span style={{fontFamily: MONO, fontWeight: 700, fontSize: 230, color: C.g, lineHeight: 1}}>&gt;_</span>,
};
export const HIGHLIGHTS = Object.keys(ICONS);
export const Highlight: React.FC<{kind: string}> = ({kind}) => (
  <AbsoluteFill style={{background: C.bg, alignItems: "center", justifyContent: "center"}}>
    <div style={{width: 620, height: 620, borderRadius: 310, background: C.card, border: `8px solid ${C.line}`, display: "grid", placeItems: "center"}}>{ICONS[kind]}</div>
  </AbsoluteFill>
);
