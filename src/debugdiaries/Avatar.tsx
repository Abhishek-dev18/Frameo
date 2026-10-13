// Debug Diaries profile pictures (1080x1080, safe for a circle crop). Same minimal theme as the videos.
import React from "react";
import {AbsoluteFill} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {bg: "#161719", card: "#1D1E21", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";

// A · terminal prompt: dd_ with a green cursor
const Prompt: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, alignItems: "center", justifyContent: "center"}}>
    <div style={{width: 700, height: 560, borderRadius: 64, background: C.card, border: `8px solid ${C.line}`, overflow: "hidden", display: "flex", flexDirection: "column"}}>
      <div style={{height: 110, borderBottom: `8px solid ${C.line}`, display: "flex", alignItems: "center", gap: 26, padding: "0 50px"}}>
        {[0, 1, 2].map((i) => <span key={i} style={{width: 34, height: 34, borderRadius: 17, background: "#3A3C42"}} />)}
      </div>
      <div style={{flex: 1, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: MONO, fontWeight: 700, fontSize: 230, color: C.text, letterSpacing: "-0.04em"}}>
        <span style={{color: C.g, marginRight: 30, fontSize: 170}}>&gt;</span>dd<span style={{display: "inline-block", width: 90, height: 26, background: C.g, marginLeft: 16, marginTop: 150}} />
      </div>
    </div>
  </AbsoluteFill>
);

// B · braces with a coral bug dot inside: { • }
const Braces: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, alignItems: "center", justifyContent: "center"}}>
    <div style={{display: "flex", alignItems: "center", gap: 70, fontFamily: MONO, fontWeight: 700, fontSize: 480, lineHeight: 1, color: C.g, marginTop: -40}}>
      <span>{"{"}</span>
      <span style={{width: 150, height: 150, borderRadius: 75, background: C.bug, boxShadow: `0 0 0 34px ${C.bug}26`}} />
      <span>{"}"}</span>
    </div>
  </AbsoluteFill>
);

// C · diary page: notebook with a green check and a coral bookmark
const Diary: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, alignItems: "center", justifyContent: "center"}}>
    <div style={{position: "relative", width: 560, height: 680, borderRadius: 48, background: C.card, border: `8px solid ${C.line}`}}>
      {/* binding rings */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} style={{position: "absolute", left: -34, top: 90 + i * 120, width: 70, height: 34, borderRadius: 17, border: `8px solid ${C.dim}`, background: C.bg}} />
      ))}
      {/* bookmark */}
      <div style={{position: "absolute", right: 70, top: -8, width: 80, height: 170, background: C.bug, clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)"}} />
      {/* lines */}
      {[0, 1].map((i) => (
        <div key={i} style={{position: "absolute", left: 90, right: i ? 220 : 170, top: 160 + i * 70, height: 22, borderRadius: 11, background: C.line}} />
      ))}
      {/* big check */}
      <svg style={{position: "absolute", left: 100, top: 300}} width="360" height="280" viewBox="0 0 360 280">
        <path d="M30 150 L130 245 L330 40" fill="none" stroke={C.g} strokeWidth="56" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  </AbsoluteFill>
);

// B2 · braces + bug, with ".io" tucked after the closing brace (matches @debugdiaries.io)
const BracesIO: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, alignItems: "center", justifyContent: "center"}}>
    <div style={{display: "flex", alignItems: "center", gap: 40, fontFamily: MONO, fontWeight: 700, fontSize: 330, lineHeight: 1, color: C.g, marginTop: -20, marginLeft: -170}}>
      <span>{"{"}</span>
      <span style={{width: 110, height: 110, borderRadius: 55, background: C.bug, boxShadow: `0 0 0 26px ${C.bug}26`}} />
      <span style={{position: "relative"}}>
        {"}"}
        <span style={{position: "absolute", left: "92%", bottom: 34, fontSize: 110, color: C.text, letterSpacing: "-0.02em"}}>.io</span>
      </span>
    </div>
  </AbsoluteFill>
);

export const AVATARS = {Prompt, Braces, Diary, BracesIO};
