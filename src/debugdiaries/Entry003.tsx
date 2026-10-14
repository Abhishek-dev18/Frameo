// Debug Diaries · Entry 003 "The retry that DDoSed us" — timed to the voiceover.
// Voice: part 1 0.25–5.8s · part 2 5.9–19.9s (fix ≈13.1s, "1,2,4" ≈15–18s) · part 3 20.0–26.3s.
// Visuals: crash-loop traffic chart → retry storm → backoff timeline → cheat sheet.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {bg: "#161719", card: "#1D1E21", card2: "#232428", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const E3_TOTAL = 810;
const S2 = 174; // 5.8s
const S3 = 598; // 19.95s
const XF = 8;

const useIn = (at: number, damping = 16) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, mass: 0.7}});
};
const lerp = (f: number, a: number, b: number, from = 0, to = 1) => interpolate(f, [a, b], [from, to], {...clamp, easing: Easing.inOut(Easing.cubic)});
const typed = (t: string, f: number, at: number, cps = 50) => t.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));

const Grid: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.025) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.025) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
);
const Header: React.FC = () => (
  <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
    <span>DEBUG DIARIES · <span style={{color: C.g}}>003</span></span>
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
const Panel: React.FC<{top: number; height?: number; title: string; tag?: string; tagColor?: string; border?: string; children: React.ReactNode; o?: number}> = ({top, height, title, tag, tagColor = C.dim, border = C.line, children, o = 1}) => (
  <div style={{position: "absolute", left: 64, right: 150, top, height, borderRadius: 26, border: `2.5px solid ${border}`, background: C.card, overflow: "hidden", opacity: o, boxShadow: "0 24px 60px rgba(0,0,0,.35)"}}>
    <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${C.line}`}}>
      {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 8, background: "#3A3C42"}} />)}
      <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: C.dim}}>{title}</span>
      {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: tagColor}}>● {tag}</span> : null}
    </div>
    <div style={{position: "relative", padding: "24px 30px"}}>{children}</div>
  </div>
);

// ================= 1 · THE BUG: crash loop on a traffic chart =================
// A traffic line that spikes and drops to zero three times. Drawn progressively, but the first crash is visible at frame 0.
const W = 806, H = 420;
const crashPoints = (n: number) => {
  // x from 0..W ; baseline normal traffic, crash windows, spike after each recovery
  const pts: [number, number][] = [];
  for (let i = 0; i <= n; i++) {
    const x = (i / n) * W;
    const t = i / n;
    let y = 0.32 + 0.03 * Math.sin(i * 1.7);
    const crashes = [0.18, 0.46, 0.74];
    for (const c of crashes) {
      if (t > c && t < c + 0.1) y = 0.0; // down
      if (t >= c + 0.1 && t < c + 0.15) y = 0.95; // retry spike
    }
    pts.push([x, H - y * H * 0.9 - 20]);
  }
  return pts;
};
const PTS = crashPoints(160);
const TheBug: React.FC = () => {
  const f = useCurrentFrame();
  const drawn = interpolate(f, [0, 150], [0.3, 1], clamp);
  const n = Math.floor(drawn * (PTS.length - 1));
  const path = PTS.slice(0, n + 1).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const crashes = [0.18, 0.46, 0.74].filter((c) => drawn > c + 0.02).length;
  const down = (() => {
    const t = drawn;
    return [0.18, 0.46, 0.74].some((c) => t > c && t < c + 0.1);
  })();
  const big = useIn(-20);
  return (
    <>
      <Section n="00" label="THE BUG" top={280} instant />
      <div style={{position: "absolute", left: 64, right: 150, top: 360, fontFamily: SANS, fontWeight: 900, fontStretch: "80%", textTransform: "uppercase", fontSize: 84, lineHeight: 0.95, opacity: big}}>
        Server came back… <span style={{color: C.bug}}>and died again.</span>
      </div>
      <Panel top={640} title="requests / sec · api" tag={down ? "DOWN" : "UP"} tagColor={down ? C.bug : C.g}>
        <svg width={W} height={H} style={{display: "block"}}>
          {[0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={W} y1={H * g} y2={H * g} stroke={C.line} strokeWidth={2} />)}
          {[0.18, 0.46, 0.74].map((c) => (drawn > c ? <rect key={c} x={c * W} y={0} width={0.1 * W} height={H} fill={`${C.bug}14`} /> : null))}
          <path d={path} fill="none" stroke={C.g} strokeWidth={6} strokeLinejoin="round" />
          {[0.18, 0.46, 0.74].map((c, i) => (drawn > c + 0.1 ? <text key={c} x={(c + 0.12) * W} y={40} fill={C.bug} fontFamily={MONO} fontSize={26} textAnchor="middle">spike</text> : null))}
        </svg>
      </Panel>
      <div style={{position: "absolute", left: 64, right: 150, top: 1190, display: "flex", gap: 18}}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{flex: 1, borderRadius: 22, border: `2.5px solid ${i <= crashes ? C.bug : C.line}`, background: i <= crashes ? `${C.bug}14` : C.card, padding: "20px 0", textAlign: "center", fontFamily: MONO, fontSize: 30, color: i <= crashes ? C.bug : C.dim}}>
            crash #{i}
          </div>
        ))}
      </div>
    </>
  );
};

// ================= 2 · ROOT CAUSE: retry storm → FIX: backoff + jitter =================
const N = 48; // phones in the storm
const Storm: React.FC<{f: number}> = ({f}) => {
  // all phones fire at the same instant (local frame 40), then again at 100
  const fire = (at: number) => interpolate(f, [at, at + 22], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const waves = [fire(40), fire(110)];
  const hit = f > 62 && f < 84 || f > 132;
  const shake = hit ? Math.sin(f * 3) * 6 : 0;
  return (
    <div style={{position: "relative", height: 470}}>
      {/* phones */}
      <div style={{position: "absolute", left: 0, top: 10, width: 330, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 10}}>
        {Array.from({length: N}).map((_, i) => (
          <div key={i} style={{width: 30, height: 50, borderRadius: 7, border: `3px solid ${f > 36 ? C.bug : C.g}`}} />
        ))}
      </div>
      {/* request dots flying right */}
      {waves.map((p, wi) =>
        p > 0 && p < 1
          ? Array.from({length: 12}).map((_, i) => (
              <div key={`${wi}-${i}`} style={{position: "absolute", left: 340 + p * 300, top: 20 + i * 34, width: 14, height: 14, borderRadius: 7, background: C.bug, opacity: 0.9}} />
            ))
          : null,
      )}
      {/* server */}
      <div style={{position: "absolute", right: 0, top: 70, width: 160, height: 240, borderRadius: 22, border: `4px solid ${hit ? C.bug : C.g}`, background: hit ? `${C.bug}1A` : "transparent", transform: `translateX(${shake}px)`, display: "flex", flexDirection: "column", justifyContent: "space-evenly", padding: "0 20px"}}>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{display: "flex", alignItems: "center", gap: 12}}>
            <span style={{width: 14, height: 14, borderRadius: 7, background: hit ? C.bug : C.g}} />
            <span style={{flex: 1, height: 4, background: hit ? `${C.bug}88` : `${C.g}88`}} />
          </div>
        ))}
      </div>
      <div style={{position: "absolute", right: 0, top: 330, width: 160, textAlign: "center", fontFamily: MONO, fontSize: 26, color: hit ? C.bug : C.text}}>{hit ? "overloaded" : "server"}</div>
      <div style={{position: "absolute", left: 0, top: 360, fontFamily: MONO, fontSize: 26, color: C.dim}}>every app, retrying <span style={{color: C.bug}}>at the same instant</span></div>
    </div>
  );
};
const Timeline: React.FC<{f: number; fixAt: number}> = ({f, fixAt}) => {
  // top: no backoff → one tall stack at t=0 ; bottom: backoff+jitter → spread bars around 1s,2s,4s
  const L = 230, R = 740, Y1 = 150, Y2 = 330;
  const x = (s: number) => L + (s / 5) * (R - L);
  const show = (at: number) => interpolate(f, [at, at + 10], [0, 1], clamp);
  const spread = [
    {s: 1, at: fixAt + 62},
    {s: 2, at: fixAt + 90},
    {s: 4, at: fixAt + 118},
  ];
  const jitter = (s: number, k: number) => s + (((k * 37) % 10) / 10 - 0.5) * 0.7;
  return (
    <svg width={806} height={420} style={{display: "block"}}>
      {/* axis */}
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <g key={s}>
          <line x1={x(s)} x2={x(s)} y1={40} y2={380} stroke={C.line} strokeWidth={2} />
          <text x={x(s)} y={410} fill={C.dim} fontFamily={MONO} fontSize={24} textAnchor="middle">{s}s</text>
        </g>
      ))}
      <text x={0} y={Y1 - 40} fill={C.bug} fontFamily={MONO} fontSize={24}>no backoff</text>
      <text x={0} y={Y2 - 40} fill={C.g} fontFamily={MONO} fontSize={24}>backoff + jitter</text>
      {/* the stack: everything at 0s */}
      <rect x={x(0) - 22} y={Y1 - 30 - 90 * show(fixAt + 20)} width={44} height={90 * show(fixAt + 20) + 30} rx={8} fill={C.bug} opacity={0.9} />
      {/* spread retries */}
      {spread.flatMap(({s, at}) =>
        [0, 1, 2, 3, 4].map((k) => {
          const o = show(at + k * 2);
          return <rect key={`${s}-${k}`} x={x(jitter(s, k + s)) - 8} y={Y2 + 20 - 50 * o} width={16} height={50 * o + 2} rx={5} fill={C.g} opacity={o} />;
        }),
      )}
      {spread.map(({s, at}) => (
        <text key={s} x={x(s)} y={Y2 - 50} fill={C.g} fontFamily={MONO} fontSize={22} textAnchor="middle" opacity={show(at)}>wait {s}</text>
      ))}
    </svg>
  );
};
const Cause: React.FC = () => {
  const f = useCurrentFrame();
  const fixAt = 218; // ≈ "fix है exponential backoff" in the voice
  const counter = Math.round(interpolate(f, [44, 70], [0, 100000], clamp));
  const ddos = useIn(150, 12);
  const storm = interpolate(f, [fixAt - 10, fixAt], [1, 0], clamp);
  const fixPanel = interpolate(f, [fixAt, fixAt + 10], [0, 1], clamp);
  const jit = useIn(fixAt + 150, 14);
  return (
    <>
      <Section n={f < fixAt ? "01" : "02"} label={f < fixAt ? "ROOT CAUSE" : "THE FIX"} top={280} />
      {/* storm */}
      <div style={{opacity: storm}}>
        <Panel top={370} title="what happened at 10s" tag={f > 62 ? "OVERLOAD" : "RECOVERING"} tagColor={f > 62 ? C.bug : C.g}>
          <Storm f={f} />
        </Panel>
        <div style={{position: "absolute", left: 64, right: 150, top: 1000, fontFamily: SANS, fontWeight: 900, fontStretch: "80%", fontSize: 130, lineHeight: 0.9, color: C.bug}}>
          {counter.toLocaleString("en-IN")}
        </div>
        <div style={{position: "absolute", left: 64, right: 150, top: 1130, fontFamily: MONO, fontSize: 32, color: C.text}}>requests in <span style={{color: C.bug}}>1 second</span></div>
        <div style={{position: "absolute", left: 64, right: 150, top: 1210, fontFamily: SANS, fontSize: 52, fontWeight: 800, opacity: ddos, transform: `translateY(${(1 - ddos) * 30}px)`}}>
          We <span style={{color: C.bug}}>DDoSed ourselves.</span>
        </div>
      </div>
      {/* fix */}
      <div style={{opacity: fixPanel}}>
        <div style={{position: "absolute", left: 64, right: 150, top: 370, fontFamily: SANS, fontWeight: 900, fontStretch: "80%", textTransform: "uppercase", fontSize: 84, lineHeight: 0.95}}>
          Exponential backoff <span style={{color: C.g}}>+ jitter</span>
        </div>
        <Panel top={580} title="retries over time" tag={f > fixAt + 100 ? "SPREAD OUT" : "CLUMPED"} tagColor={f > fixAt + 100 ? C.g : C.bug}>
          <Timeline f={f} fixAt={fixAt} />
        </Panel>
        <div style={{position: "absolute", left: 64, right: 150, top: 1130, borderRadius: 22, background: C.card, border: `2.5px solid ${C.g}`, padding: "22px 28px", fontFamily: MONO, fontSize: 30, lineHeight: 1.6, opacity: jit, transform: `translateY(${(1 - jit) * 30}px)`}}>
          <div style={{color: C.dim}}>// wait longer each time, plus a random bit</div>
          <div>delay = <span style={{color: C.g}}>2 ** attempt</span> + <span style={{color: C.g}}>random()</span></div>
        </div>
      </div>
    </>
  );
};

// ================= 3 · LESSON =================
const Lesson: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rows: [string, string][] = [
    ["attempt 1", "wait 1s ± random"],
    ["attempt 2", "wait 2s ± random"],
    ["attempt 3", "wait 4s ± random"],
    ["cap", "never wait > 30s"],
    ["give up", "after 5 tries"],
  ];
  const next = useIn(120, 14);
  return (
    <>
      <Section n="03" label="LESSON" top={280} />
      <div style={{position: "absolute", left: 64, right: 150, top: 370, fontFamily: SANS, fontWeight: 900, fontStretch: "72%", textTransform: "uppercase", fontSize: 118, lineHeight: 0.92}}>
        {["Retry,", "but wait.", "Spread it out."].map((l, i) => {
          const s = spring({frame: f - 2 - i * 6, fps, config: {damping: 16, mass: 0.6}});
          return (
            <div key={i} style={{overflow: "hidden", paddingBottom: 6}}>
              <div style={{transform: `translateY(${(1 - s) * 105}%)`, color: i === 2 ? C.g : C.text}}>{l}</div>
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 790, borderRadius: 26, border: `2.5px solid ${C.line}`, background: C.card, overflow: "hidden", opacity: lerp(f, 24, 34)}}>
        <div style={{padding: "16px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 24, color: C.dim}}>retry cheat sheet · save this</div>
        {rows.map(([k, v], i) => (
          <div key={k} style={{display: "flex", justifyContent: "space-between", padding: "16px 28px", borderTop: i ? `2px solid ${C.line}` : "none", opacity: lerp(f, 34 + i * 8, 40 + i * 8)}}>
            <span style={{fontFamily: MONO, fontSize: 28, color: C.g}}>{k}</span>
            <span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1310, borderRadius: 26, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "22px 30px", opacity: next, transform: `translateY(${(1 - next) * 30}px)`}}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>NEXT ENTRY · 004</div>
        <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 800, marginTop: 6}}>The index <span style={{color: C.bug}}>nobody used</span></div>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, 132, 40)}</div>
      </div>
    </>
  );
};

export const DebugDiaries003: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text, fontFamily: SANS}}>
    <Grid />
    <Header />
    <Sequence from={0} durationInFrames={S2 + XF}><Scene len={S2} first><TheBug /></Scene></Sequence>
    <Sequence from={S2} durationInFrames={S3 - S2 + XF}><Scene len={S3 - S2}><Cause /></Scene></Sequence>
    <Sequence from={S3} durationInFrames={E3_TOTAL - S3}><Scene len={E3_TOTAL - S3} last><Lesson /></Scene></Sequence>
  </AbsoluteFill>
);
