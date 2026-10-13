// Debug Diaries — "Neon terminal": black + neon green grid, terminal-window cards with
// small diagrams, one second accent colour. Stills for choosing the look.
import React from "react";
import {AbsoluteFill} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

export type Beat = "hook" | "explain" | "end";
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";

export const ACCENTS: Record<string, {a2: string; name: string}> = {
  magenta: {a2: "#FF3DCB", name: "Green + Magenta"},
  cyan: {a2: "#38E1FF", name: "Green + Cyan"},
  amber: {a2: "#FFC53D", name: "Green + Amber"},
};
const G = "#3DFF8F"; // neon green
const BG = "#040706";
const CARD = "rgba(8,18,13,.92)";
const LINE = "rgba(61,255,143,.28)";
const DIM = "#5E8A72";
const TEXT = "#D6F5E3";
const glow = (c: string, r = 18) => `0 0 ${r}px ${c}99, 0 0 ${r * 2}px ${c}44`;

const Grid: React.FC = () => (
  <>
    <AbsoluteFill style={{backgroundImage: `linear-gradient(${LINE.replace(".28", ".07")} 2px, transparent 2px), linear-gradient(90deg, ${LINE.replace(".28", ".07")} 2px, transparent 2px)`, backgroundSize: "60px 60px"}} />
    <AbsoluteFill style={{background: "radial-gradient(900px 900px at 50% 40%, rgba(61,255,143,.10), transparent 70%)"}} />
    <AbsoluteFill style={{backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,.18) 0 2px, transparent 2px 5px)"}} />
    <AbsoluteFill style={{boxShadow: "inset 0 0 260px rgba(0,0,0,.9)"}} />
  </>
);

const Header: React.FC<{a2: string}> = ({a2}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: DIM}}>
    <span>DEBUG DIARIES · <span style={{color: a2, textShadow: glow(a2, 10)}}>001</span></span>
    <span style={{letterSpacing: "0.04em"}}>@debugdiaries</span>
  </div>
);

const Section: React.FC<{n: string; label: string; top: number; a2: string}> = ({n, label, top, a2}) => (
  <div style={{position: "absolute", left: 64, top, display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 36, letterSpacing: "0.16em", color: a2, textShadow: glow(a2, 10)}}>
    <span style={{width: 70, height: 4, background: a2, boxShadow: glow(a2, 8)}} />
    {n} / {label}
  </div>
);

const Card: React.FC<{top: number; left?: number; right?: number; height?: number; title?: string; tag?: string; color?: string; children: React.ReactNode}> = ({top, left = 64, right = 150, height, title, tag, color = G, children}) => (
  <div style={{position: "absolute", top, left, right, height, background: CARD, border: `2.5px solid ${color}`, borderRadius: 26, boxShadow: `${glow(color, 14)}, inset 0 0 40px ${color}14`, overflow: "hidden"}}>
    {title ? (
      <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${color}55`, background: "rgba(0,0,0,.35)"}}>
        {["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{width: 16, height: 16, borderRadius: 8, background: c}} />)}
        <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: DIM}}>{title}</span>
        {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color, textShadow: glow(color, 8)}}>● {tag}</span> : null}
      </div>
    ) : null}
    <div style={{padding: "26px 30px"}}>{children}</div>
  </div>
);

const Node: React.FC<{label: string; color: string; kind: "phone" | "server" | "x" | "clock"; text?: string}> = ({label, color, kind, text}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 180}}>
    {kind === "phone" ? (
      <div style={{width: 76, height: 130, border: `4px solid ${color}`, borderRadius: 16, boxShadow: glow(color, 12), position: "relative"}}>
        <div style={{position: "absolute", inset: "12px 10px 26px", background: `${color}33`, borderRadius: 4}} />
        <div style={{position: "absolute", bottom: 9, left: "50%", width: 22, height: 4, marginLeft: -11, background: color, borderRadius: 2}} />
      </div>
    ) : kind === "server" ? (
      <div style={{width: 150, height: 120, border: `4px solid ${color}`, borderRadius: 16, boxShadow: glow(color, 12), display: "flex", flexDirection: "column"}}>
        {[0, 1].map((i) => (
          <div key={i} style={{flex: 1, borderTop: i ? `3px solid ${color}` : "none", display: "flex", alignItems: "center", gap: 14, padding: "0 16px"}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: color, boxShadow: glow(color, 8)}} />
            <span style={{flex: 1, height: 4, background: `${color}88`, borderRadius: 2}} />
          </div>
        ))}
      </div>
    ) : kind === "clock" ? (
      <div style={{width: 130, height: 130, borderRadius: 65, border: `4px solid ${color}`, boxShadow: glow(color, 12), display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700, color, textShadow: glow(color, 8)}}>{text}</div>
    ) : (
      <div style={{width: 130, height: 130, borderRadius: 24, border: `4px solid ${color}`, boxShadow: glow(color, 14), display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 70, fontWeight: 700, color, textShadow: glow(color, 10)}}>✕</div>
    )}
    <span style={{fontFamily: MONO, fontSize: 28, color: TEXT}}>{label}</span>
  </div>
);
const Arrow: React.FC<{color: string}> = ({color}) => (
  <div style={{flex: 1, height: 4, background: `linear-gradient(90deg, ${color}22, ${color})`, position: "relative", marginBottom: 46, boxShadow: glow(color, 6)}}>
    <div style={{position: "absolute", right: -2, top: -9, width: 0, height: 0, borderLeft: `18px solid ${color}`, borderTop: "11px solid transparent", borderBottom: "11px solid transparent"}} />
  </div>
);

export const Neon: React.FC<{beat: Beat; accent?: string}> = ({beat, accent = "magenta"}) => {
  const a2 = ACCENTS[accent].a2;
  return (
    <AbsoluteFill style={{background: BG, color: TEXT, fontFamily: SANS}}>
      <Grid />
      <Header a2={a2} />
      {beat === "hook" ? (
        <>
          <Section n="00" label="THE BUG" top={280} a2={a2} />
          {/* question card */}
          <Card top={370} left={190} right={190} title="incident.log" tag="03:12" color={a2}>
            <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: a2, textShadow: glow(a2, 8)}}>ON-CALL:</div>
            <div style={{fontSize: 40, fontWeight: 600, marginTop: 10}}>Users keep getting</div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "80%", fontSize: 92, lineHeight: 1, color: G, textShadow: glow(G, 16), marginTop: 6}}>LOGGED OUT.</div>
          </Card>
          {/* symptom diagram */}
          <Card top={790} title="what we see" tag="LIVE">
            <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: DIM}}>SYMPTOM</div>
            <div style={{fontSize: 52, fontWeight: 800, marginTop: 6}}>Login → kicked out in 0.6s</div>
            <div style={{display: "flex", alignItems: "flex-end", gap: 6, marginTop: 34}}>
              <Node label="user" color={G} kind="phone" />
              <Arrow color={G} />
              <Node label="auth" color={G} kind="server" />
              <Arrow color={a2} />
              <Node label="logout" color={a2} kind="x" />
            </div>
          </Card>
          <Card top={1290} title="prod — auth-service">
            <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.6}}>
              <div><span style={{color: DIM}}>[03:12:42]</span> <span style={{color: a2, textShadow: glow(a2, 6)}}>ERROR</span> 10,412 users logged out</div>
              <div><span style={{color: G}}>$</span> why<span style={{background: G, color: BG, boxShadow: glow(G, 8)}}> </span></div>
            </div>
          </Card>
        </>
      ) : beat === "explain" ? (
        <>
          <Section n="01" label="ROOT CAUSE" top={280} a2={a2} />
          <Card top={370} title="session.js" tag="BUG">
            <div style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.7}}>
              <div><span style={{color: DIM}}>if</span> (token.exp &lt; Date.now())</div>
              <div style={{color: DIM}}>&nbsp;&nbsp;logout();</div>
            </div>
          </Card>
          <Card top={700} title="two clocks">
            <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-around"}}>
              <Node label="token.exp" color={G} kind="clock" text="sec" />
              <div style={{fontFamily: MONO, fontSize: 64, color: a2, textShadow: glow(a2, 12), marginBottom: 80}}>≠</div>
              <Node label="Date.now()" color={a2} kind="clock" text="ms" />
            </div>
            <div style={{textAlign: "center", fontFamily: MONO, fontSize: 30, marginTop: 24}}>
              <span style={{color: G}}>1735689600</span> <span style={{color: DIM}}>vs</span> <span style={{color: a2}}>1735689600000</span>
            </div>
          </Card>
          <Section n="02" label="THE FIX" top={1170} a2={a2} />
          <Card top={1250} title="git diff" tag="FIXED">
            <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.7}}>
              <div style={{color: "#FF7A90", background: "rgba(255,80,110,.10)", margin: "0 -30px", padding: "0 30px"}}>- token.exp &lt; Date.now()</div>
              <div style={{color: G, background: "rgba(61,255,143,.12)", margin: "0 -30px", padding: "0 30px", textShadow: glow(G, 6)}}>+ token.exp * 1000 &lt; Date.now()</div>
            </div>
          </Card>
        </>
      ) : (
        <>
          <Section n="03" label="LESSON" top={280} a2={a2} />
          <div style={{position: "absolute", left: 64, right: 150, top: 380, fontWeight: 900, fontStretch: "72%", textTransform: "uppercase", fontSize: 150, lineHeight: 0.9}}>
            Always check<br />your <span style={{color: G, textShadow: glow(G, 20)}}>units.</span>
          </div>
          <Card top={860} title="deploy.log" tag="OK">
            <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.7}}>
              <div><span style={{color: G}}>✓</span> fix deployed</div>
              <div><span style={{color: G}}>✓</span> 0 logouts since</div>
            </div>
          </Card>
          <Card top={1150} color={a2}>
            <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: DIM}}>NEXT ENTRY · 002</div>
            <div style={{fontSize: 56, fontWeight: 800, marginTop: 8}}>The cache that <span style={{color: a2, textShadow: glow(a2, 12)}}>lied</span></div>
            <div style={{fontFamily: MONO, fontSize: 32, color: G, marginTop: 20}}>follow @debugdiaries<span style={{background: G, color: BG}}> </span></div>
          </Card>
        </>
      )}
    </AbsoluteFill>
  );
};
