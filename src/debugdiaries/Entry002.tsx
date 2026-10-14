// Debug Diaries · Entry 002 "The cache that lied" — custom visuals (phone mock, request-flow animation,
// cheat-sheet lesson) in the same brand: grey, white, mint green, coral for bugs. 1080x1920 · 30fps · 24s.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {bg: "#161719", card: "#1D1E21", card2: "#232428", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
// timed to the voiceover: part 1 ≈ 3.8s, part 2 ≈ 8.2s, part 3 ≈ 4.9s
export const E2_TOTAL = 594;
const S2 = 138;
const S3 = 408;
const XF = 10;

const useIn = (at: number, damping = 16) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, mass: 0.7}});
};
const typed = (t: string, f: number, at: number, cps = 50) => t.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));
const lerp = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], {...clamp, easing: Easing.inOut(Easing.cubic)});

const Grid: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.025) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.025) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
);
const Header: React.FC = () => (
  <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
    <span>DEBUG DIARIES · <span style={{color: C.g}}>002</span></span>
    <span style={{letterSpacing: "0.04em"}}>@debugdiaries.io</span>
  </div>
);
const Section: React.FC<{n: string; label: string; top: number; at?: number; instant?: boolean}> = ({n, label, top, at = 0, instant}) => {
  const f = useCurrentFrame();
  const w = instant ? 70 : lerp(f, at, at + 10, 0, 70);
  const text = `${n} / ${label}`;
  return (
    <div style={{position: "absolute", left: 64, top, display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 36, letterSpacing: "0.16em", color: C.g}}>
      <span style={{width: w, height: 4, background: C.g}} />
      <span>{instant ? text : typed(text, f, at + 4, 70)}</span>
    </div>
  );
};
const Scene: React.FC<{len: number; first?: boolean; last?: boolean; children: React.ReactNode}> = ({len, first, last, children}) => {
  const f = useCurrentFrame();
  const fin = first ? 1 : interpolate(f, [0, XF], [0, 1], clamp);
  const fout = last ? 1 : interpolate(f, [len, len + XF], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: Math.min(fin, fout)}}>{children}</AbsoluteFill>;
};

// ================= 1 · THE BUG: Bob's phone shows Alice's profile =================
const Field: React.FC<{k: string; v: string; hot?: boolean}> = ({k, v, hot}) => (
  <div style={{display: "flex", justifyContent: "space-between", padding: "18px 0", borderTop: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 26}}>
    <span style={{color: C.dim}}>{k}</span>
    <span style={{color: hot ? C.bug : C.text}}>{v}</span>
  </div>
);
const TheBug: React.FC = () => {
  const f = useCurrentFrame();
  const glow = 0.5 + 0.5 * Math.sin(f / 6);
  const and = useIn(50);
  const toast = useIn(78, 12);
  return (
    <>
      <Section n="00" label="THE BUG" top={280} instant />
      <div style={{position: "absolute", left: 64, right: 150, top: 360, fontFamily: SANS, fontSize: 60, fontWeight: 800, lineHeight: 1.1}}>
        Bob opened <span style={{color: C.g}}>his</span> profile…
      </div>
      {/* phone */}
      <div style={{position: "absolute", left: 250, top: 480, width: 520, height: 820, borderRadius: 60, border: `6px solid ${C.line}`, background: C.card, overflow: "hidden", boxShadow: "0 30px 80px rgba(0,0,0,.45)"}}>
        <div style={{height: 70, display: "flex", alignItems: "center", justifyContent: "center"}}>
          <div style={{width: 130, height: 26, borderRadius: 13, background: "#0E0F11"}} />
        </div>
        <div style={{padding: "10px 40px 0"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 38}}>My profile</span>
            <span style={{fontFamily: MONO, fontSize: 20, color: C.g, border: `2px solid ${C.g}55`, borderRadius: 999, padding: "6px 14px"}}>logged in: bob</span>
          </div>
          <div style={{marginTop: 40, border: `3px solid ${C.bug}`, borderRadius: 28, padding: "30px 30px 10px", boxShadow: `0 0 ${20 + glow * 30}px ${C.bug}55`}}>
            <div style={{display: "flex", alignItems: "center", gap: 24, marginBottom: 20}}>
              <div style={{width: 110, height: 110, borderRadius: 55, background: `${C.bug}22`, border: `3px solid ${C.bug}`, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 54, color: C.bug}}>A</div>
              <div>
                <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40}}>Alice Sharma</div>
                <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 4}}>alice@•••••.com</div>
              </div>
            </div>
            <Field k="phone" v="+91 98••• ••210" hot />
            <Field k="address" v="Pune, MH" hot />
            <Field k="card" v="•••• 4821" hot />
          </div>
        </div>
        {/* toast */}
        <div style={{position: "absolute", left: 30, right: 30, bottom: 40, background: C.card2, border: `2px solid ${C.bug}`, borderRadius: 22, padding: "20px 24px", fontFamily: MONO, fontSize: 24, color: C.text, opacity: toast, transform: `translateY(${(1 - toast) * 40}px)`}}>
          <span style={{color: C.bug}}>⚠</span> 1,208 users reported this
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1340, fontFamily: SANS, fontSize: 72, fontWeight: 900, fontStretch: "80%", textTransform: "uppercase", opacity: and, transform: `translateY(${(1 - and) * 30}px)`}}>
        …and saw <span style={{color: C.bug}}>Alice's.</span>
      </div>
    </>
  );
};

// ================= 2 · ROOT CAUSE: request flow through the CDN =================
const Mini: React.FC<{label: string; c: string; fill?: string; letter?: string}> = ({label, c, fill, letter}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 140}}>
    <div style={{width: 84, height: 140, borderRadius: 18, border: `4px solid ${c}`, display: "grid", placeItems: "center", background: fill || "transparent"}}>
      {letter ? <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, color: c}}>{letter}</span> : null}
    </div>
    <span style={{fontFamily: MONO, fontSize: 26, color: C.text}}>{label}</span>
  </div>
);
const Packet: React.FC<{x: number; y: number; c: string; text: string; o?: number}> = ({x, y, c, text, o = 1}) => (
  <div style={{position: "absolute", left: x - 34, top: y - 34, width: 68, height: 68, borderRadius: 16, background: c, color: C.bg, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 36, opacity: o, boxShadow: `0 0 24px ${c}88`}}>{text}</div>
);
const Wire: React.FC<{x1: number; x2: number; y: number; on: number; c: string; label?: string}> = ({x1, x2, y, on, c, label}) => (
  <>
    <div style={{position: "absolute", left: Math.min(x1, x2), top: y - 2, width: Math.abs(x2 - x1), height: 4, background: C.line}} />
    <div style={{position: "absolute", left: x1 < x2 ? x1 : x1 - Math.abs(x2 - x1) * on, top: y - 2, width: Math.abs(x2 - x1) * on, height: 4, background: c}} />
    {label ? <div style={{position: "absolute", left: Math.min(x1, x2), width: Math.abs(x2 - x1), top: y - 44, textAlign: "center", fontFamily: MONO, fontSize: 22, color: C.dim, opacity: on > 0 ? 1 : 0}}>{label}</div> : null}
  </>
);
const Cause: React.FC = () => {
  const f = useCurrentFrame();
  // geometry
  const AX = 150, CX = 520, SX = 860, YA = 520, YB = 920;
  // timeline (local frames)
  const reqA = lerp(f, 6, 30); // Alice → CDN
  const reqS = lerp(f, 30, 50); // CDN → Server
  const back = lerp(f, 56, 86); // Server → CDN (packet A)
  const header = useIn(62, 12);
  const store = lerp(f, 86, 96);
  const toAlice = lerp(f, 96, 116);
  const reqB = lerp(f, 124, 146); // Bob → CDN
  const toBob = lerp(f, 150, 176); // CDN → Bob (stale A)
  const bobHit = f > 176;
  const fixAt = 192;
  const minus = lerp(f, fixAt + 8, fixAt + 14);
  const strike = lerp(f, fixAt + 24, fixAt + 36, 0, 100);
  const plus = useIn(fixAt + 36, 14);
  const fixed = f > fixAt + 40;
  return (
    <>
      <Section n="01" label="ROOT CAUSE" top={280} />
      {/* panel */}
      <div style={{position: "absolute", left: 64, right: 150, top: 370, height: 720, borderRadius: 26, border: `2.5px solid ${C.line}`, background: C.card}} />
      <div style={{position: "absolute", left: 64, right: 150, top: 370}}>
        <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${C.line}`}}>
          {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 8, background: "#3A3C42"}} />)}
          <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: C.dim}}>GET /api/me</span>
          <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: bobHit ? C.bug : C.dim}}>● {bobHit ? "CACHE HIT" : "LIVE"}</span>
        </div>
      </div>
      {/* wires */}
      <Wire x1={AX + 60} x2={CX - 90} y={YA} on={Math.max(reqA, toAlice)} c={C.g} label="GET /me" />
      <Wire x1={CX + 90} x2={SX - 60} y={YA} on={Math.max(reqS, back)} c={C.g} />
      <Wire x1={AX + 60} x2={CX - 90} y={YB} on={Math.max(reqB, toBob)} c={toBob > 0 ? C.bug : C.g} label="GET /me" />
      {/* nodes */}
      <div style={{position: "absolute", left: AX - 70, top: YA - 80}}><Mini label="Alice" c={C.g} letter={toAlice >= 1 ? "A" : ""} /></div>
      <div style={{position: "absolute", left: AX - 70, top: YB - 80}}><Mini label="Bob" c={bobHit ? C.bug : C.g} letter={bobHit ? "A" : ""} fill={bobHit ? `${C.bug}22` : undefined} /></div>
      <div style={{position: "absolute", left: SX - 70, top: YA - 80}}><Mini label="server" c={C.g} /></div>
      {/* CDN box with cache slot */}
      <div style={{position: "absolute", left: CX - 90, top: YA - 100, width: 180, height: YB - YA + 200, borderRadius: 24, border: `4px solid ${store > 0 ? C.bug : C.g}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 0"}}>
        <span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>CDN</span>
        <div style={{width: 110, height: 110, borderRadius: 18, border: `3px dashed ${store > 0 ? C.bug : C.line}`, display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 52, color: C.bug, background: store > 0 ? `${C.bug}1A` : "transparent"}}>
          {store > 0 ? "A" : ""}
        </div>
        <span style={{fontFamily: MONO, fontSize: 20, color: store > 0 ? C.bug : C.dim}}>{store > 0 ? "saved: Alice" : "cache: empty"}</span>
      </div>
      {/* moving packets */}
      {reqA > 0 && reqA < 1 ? <Packet x={AX + 60 + (CX - 90 - AX - 60) * reqA} y={YA} c={C.g} text="?" /> : null}
      {reqS > 0 && reqS < 1 ? <Packet x={CX + 90 + (SX - 60 - CX - 90) * reqS} y={YA} c={C.g} text="?" /> : null}
      {back > 0 && back < 1 ? <Packet x={SX - 60 - (SX - 60 - CX - 90) * back} y={YA} c={C.g} text="A" /> : null}
      {toAlice > 0 && toAlice < 1 ? <Packet x={CX - 90 - (CX - 90 - AX - 60) * toAlice} y={YA} c={C.g} text="A" /> : null}
      {reqB > 0 && reqB < 1 ? <Packet x={AX + 60 + (CX - 90 - AX - 60) * reqB} y={YB} c={C.g} text="?" /> : null}
      {toBob > 0 && toBob < 1 ? <Packet x={CX - 90 - (CX - 90 - AX - 60) * toBob} y={YB} c={C.bug} text="A" /> : null}
      {/* the header that caused it */}
      <div style={{position: "absolute", left: CX + 115, top: YA + 125, fontFamily: MONO, fontSize: 24, color: C.bug, border: `2.5px solid ${C.bug}`, borderRadius: 14, padding: "10px 16px", background: C.card2, opacity: header, transform: `scale(${0.8 + header * 0.2})`, transformOrigin: "left top"}}>
        Cache-Control:<br />public
      </div>
      <div style={{position: "absolute", left: CX + 115, top: YB - 30, width: 250, fontFamily: MONO, fontSize: 24, lineHeight: 1.4, color: C.text, opacity: lerp(f, 178, 188)}}>
        Bob gets <span style={{color: C.bug}}>Alice's</span> saved copy
      </div>
      {/* fix */}
      <Section n="02" label="THE FIX" top={1150} at={fixAt} />
      <div style={{position: "absolute", left: 64, right: 150, top: 1230, borderRadius: 26, border: `2.5px solid ${fixed ? C.g : C.line}`, background: C.card, overflow: "hidden", opacity: lerp(f, fixAt + 4, fixAt + 12)}}>
        <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${C.line}`}}>
          {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 8, background: "#3A3C42"}} />)}
          <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: C.dim}}>api/me.js</span>
          <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: fixed ? C.g : C.dim}}>● {fixed ? "FIXED" : "EDITING"}</span>
        </div>
        <div style={{padding: "22px 30px", fontFamily: MONO, fontSize: 30, lineHeight: 1.7, whiteSpace: "pre"}}>
          <div style={{color: C.bug, background: `${C.bug}1A`, margin: "0 -30px", padding: "0 30px", opacity: minus, position: "relative"}}>
            - Cache-Control: public
            <span style={{position: "absolute", left: 60, top: "50%", height: 3, width: `calc(${strike}% - 90px)`, background: C.bug, opacity: 0.7}} />
          </div>
          <div style={{color: C.g, background: `${C.g}1F`, margin: "0 -30px", padding: "0 30px", opacity: plus, transform: `translateX(${(1 - plus) * 40}px)`}}>+ Cache-Control: private, no-store</div>
        </div>
      </div>
    </>
  );
};

// ================= 3 · LESSON: cheat sheet =================
const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows: [string, string, string][] = [
    ["public, max-age=…", "logos, CSS, images", C.g],
    ["private", "browser only", C.text],
    ["no-store", "anything with a user in it", C.bug],
  ];
  const next = useIn(96, 14);
  return (
    <>
      <Section n="03" label="LESSON" top={280} />
      <div style={{position: "absolute", left: 64, right: 150, top: 370, fontFamily: MONO, fontSize: 30, color: C.dim, opacity: lerp(f, 2, 10)}}>// rule #002</div>
      <div style={{position: "absolute", left: 64, right: 150, top: 420, fontFamily: SANS, fontWeight: 900, fontStretch: "72%", textTransform: "uppercase", fontSize: 128, lineHeight: 0.92}}>
        {["If it says", "“Hi, Alice”,", "don't cache it."].map((l, i) => {
          const s = spring({frame: f - 4 - i * 6, fps, config: {damping: 16, mass: 0.6}});
          return (
            <div key={i} style={{overflow: "hidden", paddingBottom: 6}}>
              <div style={{transform: `translateY(${(1 - s) * 105}%)`, color: i === 1 ? C.bug : i === 2 ? C.g : C.text}}>{l}</div>
            </div>
          );
        })}
      </div>
      {/* cheat sheet */}
      <div style={{position: "absolute", left: 64, right: 150, top: 900, borderRadius: 26, border: `2.5px solid ${C.line}`, background: C.card, overflow: "hidden", opacity: lerp(f, 30, 40)}}>
        <div style={{padding: "16px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 24, color: C.dim}}>Cache-Control cheat sheet · save this</div>
        {rows.map(([k, v, c], i) => (
          <div key={k} style={{display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, padding: "20px 28px", borderTop: i ? `2px solid ${C.line}` : "none", opacity: lerp(f, 40 + i * 10, 48 + i * 10)}}>
            <span style={{fontFamily: MONO, fontSize: 30, color: c}}>{k}</span>
            <span style={{fontFamily: SANS, fontSize: 30, color: C.text, textAlign: "right"}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1290, borderRadius: 26, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "24px 30px", opacity: next, transform: `translateY(${(1 - next) * 30}px)`}}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>NEXT ENTRY · 003</div>
        <div style={{fontFamily: SANS, fontSize: 50, fontWeight: 800, marginTop: 6}}>The retry that <span style={{color: C.bug}}>DDoSed us</span></div>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, 110, 40)}</div>
      </div>
    </>
  );
};

export const DebugDiaries002: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text, fontFamily: SANS}}>
    <Grid />
    <Header />
    <Sequence from={0} durationInFrames={S2 + XF}><Scene len={S2} first><TheBug /></Scene></Sequence>
    <Sequence from={S2} durationInFrames={S3 - S2 + XF}><Scene len={S3 - S2}><Cause /></Scene></Sequence>
    <Sequence from={S3} durationInFrames={E2_TOTAL - S3}><Scene len={E2_TOTAL - S3} last><Lesson /></Scene></Sequence>
  </AbsoluteFill>
);
