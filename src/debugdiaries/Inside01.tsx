// Sunday Inside · EP 01 "Delivery in 27 min — where does that number come from?" — 8 chapters, each a 3D card.
// Method as published by Swiggy (Swiggy Bytes 2019 / 2023): ETA = max(assignment + first mile, prep) + last mile;
// features: restaurant type, items, kitchen load ("stress"), free riders nearby, live GPS speeds; re-predicted at every
// stage; "inaccurate bumps" tracked. Minute values on screen are EXAMPLES (prep 12, rider 9, last mile 15 → 27).
// Timed to the Hinglish Sarvam voice (content/debug-diaries/inside-01/voice.wav, pauses ≤0.18s).
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Cut, Card3D} from "./cine";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 6.69, 15.86, 24.93, 34.54, 43.66, 53.69, 67.64].map(T);
export const I1_TOTAL = T(77.43) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const Note: React.FC<{top: number; text?: string}> = ({top, text = "example numbers"}) => (
  <div style={{position: "absolute", right: 150, top, fontFamily: MONO, fontSize: 19, color: C.dim}}>* {text}</div>
);
const Chip: React.FC<{text: string; color?: string; style?: React.CSSProperties}> = ({text, color = C.g, style}) => (
  <span style={{display: "inline-block", padding: "10px 18px", borderRadius: 14, border: `2.5px solid ${color}`, background: `${color}14`, fontFamily: MONO, fontSize: 28, color, ...style}}>{text}</span>
);

// ===================== 1 · hook =====================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 24) * 3;
  const eta = f >= T(1.12);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 258, padding: "6px 14px", border: `2px solid ${C.g}`, borderRadius: 8, fontFamily: MONO, fontSize: 24, letterSpacing: "0.18em", color: C.g}}>INSIDE · EP 01</div>
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={-30} size={92}>"Arriving in</Slam>
        <Slam at={-30} size={92} color={C.g} style={{marginTop: 6}}>27 min."</Slam>
      </div>
      {/* 3D phone with the food app */}
      <div style={{position: "absolute", left: 90, top: 560, width: 380, height: 700, perspective: 1300}}>
        <div style={{width: "100%", height: "100%", transform: `rotateY(${18 + wob}deg) rotateX(6deg)`, borderRadius: 56, border: "7px solid #3A3C42", background: "#111214", boxShadow: "-40px 50px 90px rgba(0,0,0,.6)", position: "relative", overflow: "hidden"}}>
          <div style={{position: "absolute", left: 140, top: 16, width: 100, height: 26, borderRadius: 13, background: "#000"}} />
          <div style={{position: "absolute", left: 28, right: 28, top: 76}}>
            <div style={{...label, fontSize: 18}}>YOUR ORDER</div>
            <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 800, marginTop: 8}}>Biryani Point</div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>2 × biryani · 1 × cold coffee</div>
            <div style={{marginTop: 24, display: "flex", alignItems: "center", gap: 10, fontFamily: MONO, fontSize: 22, color: C.g}}>✓ Order placed</div>
          </div>
          <div style={{position: "absolute", left: 28, right: 28, top: 330, borderRadius: 24, padding: "20px 22px", background: eta ? "#1C2A21" : C.card, border: `3px solid ${eta ? C.g : C.line}`, transform: `scale(${eta ? 1 + (1 - out(f, T(1.12), T(1.5))) * 0.15 : 1})`}}>
            <div style={{...label, fontSize: 18, color: eta ? C.g : C.dim}}>ARRIVING IN</div>
            <div style={big(110, eta ? C.g : C.dim)}>{eta ? "27" : "--"}<span style={{fontSize: 44}}> min</span></div>
          </div>
          <div style={{position: "absolute", left: 28, right: 28, top: 540, height: 10, borderRadius: 5, background: C.line}}>
            <div style={{width: "8%", height: "100%", borderRadius: 5, background: C.g}} />
          </div>
        </div>
      </div>
      {/* the kitchen hasn't even started */}
      <div style={{position: "absolute", left: 560, top: 640, width: 370, opacity: out(f, T(3.2), T(3.6))}}>
        <div style={{borderRadius: 24, background: C.card, border: `3px solid ${C.bug}`, padding: "20px 22px", transform: "perspective(800px) rotateY(-14deg)"}}>
          <div style={{...label, color: C.bug}}>KITCHEN</div>
          <svg width={150} height={110} style={{marginTop: 10}}>
            <rect x={10} y={50} width={130} height={50} rx={10} fill="none" stroke={C.dim} strokeWidth={5} />
            {[40, 75, 110].map((x) => <circle key={x} cx={x} cy={40} r={10} fill="none" stroke={C.dim} strokeWidth={4} />)}
          </svg>
          <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 800, color: C.bug, marginTop: 8}}>not started</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1320}}>
        {f > T(5.1) ? <Slam at={T(5.21)} size={90} color={C.bug}>So where did</Slam> : null}
        {f > T(5.6) ? <Slam at={T(5.7)} size={90} color={C.bug} style={{marginTop: 6}}>27 come from?</Slam> : null}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 2 · not one guess: 4 predictions + the formula =====================
const PARTS: [string, string, string][] = [["🍳", "PREP", "cook time"], ["🧭", "ASSIGN", "find a rider"], ["🛵", "FIRST MILE", "rider → restaurant"], ["🏠", "LAST MILE", "restaurant → you"]];
const Formula: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="02/08 · NOT ONE GUESS" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(8.45)} size={84}>4 predictions, added up.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 450, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, perspective: 1100}}>
        {PARTS.map(([ic, t, d], i) => {
          const at = L(8.6) + i * 6;
          const p = out(f, at, at + 12);
          return (
            <div key={t} style={{padding: "18px 20px", borderRadius: 22, background: C.card, border: `3px solid ${i === 3 ? C.text : C.g}`, transform: `translateZ(${(1 - p) * 400}px) rotateY(${(1 - p) * (i % 2 ? -40 : 40)}deg)`, opacity: p}}>
              <div style={{fontSize: 48}}>{ic}</div>
              <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 6}}>{t}</div>
              <div style={{fontFamily: SANS, fontSize: 26, color: C.dim}}>{d}</div>
            </div>
          );
        })}
      </div>
      {/* the formula */}
      <div style={{position: "absolute", left: 64, right: 150, top: 900, perspective: 1000, opacity: out(f, L(10.8), L(11.2))}}>
        <div style={{transform: `rotateX(${interpolate(f, [L(10.84), L(11.4)], [70, 8], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%", borderRadius: 24, background: "#1C2A21", border: `3px solid ${C.g}`, padding: "22px 26px", boxShadow: `0 30px 60px rgba(0,0,0,.45)`}}>
          <div style={{display: "flex", justifyContent: "space-between"}}>
            <span style={{...label, color: C.g}}>ETA FORMULA</span>
            <span style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>source: Swiggy Bytes</span>
          </div>
          <div style={{fontFamily: MONO, fontSize: 36, lineHeight: 1.55, marginTop: 12, whiteSpace: "pre", color: C.text}}>
            <span style={{color: C.g}}>{typed("ETA", f, L(11.0), 40)}</span>{typed(" = max(", f, L(11.2), 40)}
            {"\n"}{typed("   assign + first mile,", f, L(12.0), 50)}
            {"\n"}{typed("   prep", f, L(13.1), 50)}
            {"\n"}{typed(") + last mile", f, L(13.5), 50)}
          </div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1380, display: "flex", alignItems: "center", gap: 16, opacity: out(f, L(14.48), L(14.8))}}>
        <span style={{fontFamily: MONO, fontSize: 30, color: C.g}}>let's open each one</span>
        {[0, 1, 2, 3].map((i) => <span key={i} style={{width: 20, height: 20, borderRadius: 10, background: Math.floor((f - L(14.5)) / 6) % 4 === i ? C.g : C.line}} />)}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 3 · prep time =====================
const Prep: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const load = interpolate(f, [L(21.05), L(22.2)], [0.15, 0.82], {...clamp, easing: Easing.out(Easing.cubic)});
  const race = interpolate(f, [L(22.6), L(24.4)], [0, 1], clamp);
  const ang = -180 + load * 180;
  return (
    <AbsoluteFill>
      <Section text="03/08 · PREP TIME" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(16.47)} size={84}>How long to cook?</Slam>
      </div>
      {/* tilted kitchen counter with the order ticket */}
      <div style={{position: "absolute", left: 64, right: 150, top: 450, perspective: 1100}}>
        <div style={{transform: "rotateX(20deg)", transformOrigin: "50% 100%", borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`, padding: "20px 24px", display: "flex", gap: 24}}>
          <div style={{flex: 1}}>
            <div style={label}>THE MODEL LOOKS AT</div>
            {[["restaurant", "Biryani Point", L(19.04)], ["items", "3", L(19.6)], ["kitchen load", load > 0.6 ? "HIGH" : "…", L(21.05)]].map(([k, v, at]) => (
              <div key={k as string} style={{display: "flex", justifyContent: "space-between", marginTop: 14, fontFamily: MONO, fontSize: 28, opacity: out(f, at as number, (at as number) + 6)}}>
                <span style={{color: C.dim}}>{k as string}</span>
                <span style={{color: k === "kitchen load" ? C.bug : C.text}}>{v as string}</span>
              </div>
            ))}
          </div>
          {/* load gauge */}
          <svg width={220} height={140} style={{opacity: out(f, L(20.9), L(21.2))}}>
            <path d="M20 125 A90 90 0 0 1 200 125" fill="none" stroke={C.line} strokeWidth={20} strokeLinecap="round" />
            <path d="M20 125 A90 90 0 0 1 200 125" fill="none" stroke={load > 0.6 ? C.bug : C.g} strokeWidth={20} strokeLinecap="round" strokeDasharray={`${283 * load} 400`} />
            <line x1={110} y1={125} x2={110 + Math.cos((ang * Math.PI) / 180) * 70} y2={125 + Math.sin((ang * Math.PI) / 180) * 70} stroke={C.text} strokeWidth={6} strokeLinecap="round" />
            <text x={110} y={92} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize={18}>LOAD</text>
          </svg>
        </div>
      </div>
      {/* biryani vs cold coffee race */}
      <div style={{position: "absolute", left: 64, right: 150, top: 820, opacity: out(f, L(22.4), L(22.8))}}>
        {[["🍛 Biryani", 18, C.bug], ["☕ Cold coffee", 4, C.g]].map(([n, mins, col]) => (
          <div key={n as string} style={{marginTop: 22}}>
            <div style={{display: "flex", justifyContent: "space-between", fontFamily: SANS, fontSize: 34, fontWeight: 700}}>
              <span>{n as string}</span>
              <span style={{color: col as string, fontFamily: MONO}}>{Math.round((mins as number) * Math.min(1, race * (18 / (mins as number))))} min</span>
            </div>
            <div style={{marginTop: 10, height: 30, borderRadius: 15, background: C.line, overflow: "hidden", transform: "perspective(600px) rotateX(20deg)"}}>
              <div style={{height: "100%", width: `${Math.min(1, race * (18 / (mins as number))) * ((mins as number) / 18) * 100}%`, background: col as string}} />
            </div>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, top: 1180, opacity: out(f, L(23.4), L(23.8))}}>
        <div style={label}>PREDICTED PREP · THIS ORDER</div>
        <div style={big(120, C.g)}>12 min</div>
      </div>
      <Note top={1460} />
    </AbsoluteFill>
  );
};

// ===================== 4 · rider + first mile =====================
const RIDERS = [[120, 140], [640, 90], [760, 360], [260, 420], [520, 520], [90, 300]];
const Rider: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const assigned = f >= L(25.61);
  const go = interpolate(f, [L(26.94), L(29.0)], [0, 1], {...clamp, easing: ease3});
  const R0 = RIDERS[3], REST = [470, 230];
  return (
    <AbsoluteFill>
      <Section text="04/08 · RIDER + FIRST MILE" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(25.61)} size={84}>Who picks it up?</Slam>
      </div>
      {/* 3D city grid */}
      <div style={{position: "absolute", left: 64, right: 150, top: 450, height: 640, perspective: 1000}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 866, height: 620, transform: "rotateX(48deg)", transformOrigin: "50% 100%", borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`, overflow: "hidden"}}>
          <svg width={866} height={620}>
            {[1, 2, 3, 4, 5].map((i) => <line key={`h${i}`} x1={0} x2={866} y1={i * 105} y2={i * 105} stroke="#2E3035" strokeWidth={14} />)}
            {[1, 2, 3, 4, 5, 6].map((i) => <line key={`v${i}`} y1={0} y2={620} x1={i * 125} x2={i * 125} stroke="#2E3035" strokeWidth={14} />)}
            {/* restaurant pin */}
            <circle cx={REST[0]} cy={REST[1]} r={26} fill={C.bug} />
            <text x={REST[0]} y={REST[1] + 8} textAnchor="middle" fontSize={26}>🍳</text>
            {RIDERS.map(([x, y], i) => {
              const me = i === 3;
              const wob = Math.sin(f / 10 + i) * 8;
              const cx = me ? x + (REST[0] - x) * go : x + wob;
              const cy = me ? y + (REST[1] - y) * go : y + Math.cos(f / 12 + i) * 6;
              const showSpeed = f > L(31.51) && !me;
              return (
                <g key={i} opacity={out(f, L(29.0) - (me ? 120 : 0), L(29.4) - (me ? 120 : 0))}>
                  {me && assigned && go < 1 ? <circle cx={cx} cy={cy} r={30 + (f % 20)} fill="none" stroke={C.g} strokeWidth={4} opacity={1 - (f % 20) / 20} /> : null}
                  <circle cx={cx} cy={cy} r={me ? 18 : 13} fill={me && assigned ? C.g : C.text} />
                  {showSpeed ? <text x={cx + 18} y={cy - 16} fill={C.dim} fontFamily={MONO} fontSize={20}>{18 + i * 3} km/h</text> : null}
                </g>
              );
            })}
            {go > 0 ? <line x1={R0[0]} y1={R0[1]} x2={R0[0] + (REST[0] - R0[0]) * go} y2={R0[1] + (REST[1] - R0[1]) * go} stroke={C.g} strokeWidth={6} strokeDasharray="12 10" /> : null}
          </svg>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1110, display: "flex", gap: 14, flexWrap: "wrap"}}>
        {f > L(29.14) ? <Chip text="free riders nearby: 6" color={C.text} style={{opacity: out(f, L(29.14), L(29.5))}} /> : null}
        {f > L(31.51) ? <Chip text="live GPS speeds" style={{opacity: out(f, L(31.51), L(31.9))}} /> : null}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1230, display: "flex", alignItems: "baseline", gap: 18, opacity: out(f, L(33.3), L(33.7))}}>
        <span style={{fontFamily: MONO, fontSize: 30, color: C.dim}}>assign 2 + first mile 7 =</span>
        <span style={big(110, C.g)}>9 min</span>
      </div>
      <Note top={1460} />
    </AbsoluteFill>
  );
};

// ===================== 5 · the smart trick: max(), not + =====================
const Trick: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const grow = interpolate(f, [L(37.1), L(39.2)], [0, 1], {...clamp, easing: ease3});
  const wrong = f > L(39.6);
  const right = f > L(41.23);
  const W = 760;
  return (
    <AbsoluteFill>
      <Section text="05/08 · THE SMART TRICK" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(34.6)} size={88} color={C.g}>Parallel, not plus.</Slam>
      </div>
      {/* two 3D gantt bars starting together */}
      <div style={{position: "absolute", left: 64, right: 150, top: 480, perspective: 1000}}>
        <div style={{transform: "rotateX(24deg) rotateY(-8deg)", transformOrigin: "50% 100%"}}>
          <div style={{display: "flex", justifyContent: "space-between", ...label}}><span>0 min</span><span>12 min</span></div>
          {[["🍳 PREP (kitchen)", 12, C.g], ["🛵 RIDER (assign + first mile)", 9, C.text]].map(([n, m, col]) => {
            const winner = (m as number) === 12;
            const dim = right && !winner;
            return (
              <div key={n as string} style={{marginTop: 26, opacity: dim ? 0.35 : 1}}>
                <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 700, marginBottom: 10}}>{n as string}</div>
                <div style={{height: 70, width: W, borderRadius: 14, background: C.line, position: "relative"}}>
                  <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: W * ((m as number) / 12) * grow, borderRadius: 14, background: col as string, boxShadow: right && winner ? `0 0 40px ${C.g}` : "none", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 16, boxSizing: "border-box", fontFamily: MONO, fontSize: 28, color: C.bg, fontWeight: 700}}>{grow > 0.8 ? `${m} min` : ""}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 940, fontFamily: MONO, fontSize: 28, color: C.dim, opacity: out(f, L(38.08), L(38.4))}}>both happen at the same time ↑</div>
      {wrong ? (
        <div style={{position: "absolute", left: 64, top: 1030, display: "flex", alignItems: "baseline", gap: 18, opacity: out(f, L(39.6), L(39.9))}}>
          <span style={{...big(84, C.bug), textDecoration: "line-through"}}>12 + 9 = 21</span>
          <span style={big(70, C.bug)}>✕</span>
        </div>
      ) : null}
      {right ? (
        <div style={{position: "absolute", left: 64, top: 1160}}>
          <Slam at={L(41.25)} size={100} color={C.g} style={{textTransform: "none", fontFamily: MONO, fontWeight: 700}}>max(12, 9) = 12</Slam>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.text, marginTop: 18, opacity: out(f, L(42.0), L(42.4))}}>kitchen cooks while the rider rides</div>
        </div>
      ) : null}
      <Note top={1460} />
    </AbsoluteFill>
  );
};

// ===================== 6 · last mile =====================
const ROUTE: [number, number][] = [[90, 520], [250, 520], [250, 360], [470, 360], [470, 200], [700, 200], [760, 90]];
const SEGCOL = [C.g, C.g, "#F5B544", C.bug, C.g, C.g];
const LastMile: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const draw = interpolate(f, [L(44.7), L(46.6)], [0, 1], clamp);
  const traffic = f > L(46.73);
  const ride = interpolate(f, [L(46.8), L(51.4)], [0, 1], clamp);
  // position along route
  const segs = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
  const total = segs.reduce((a, b) => a + b, 0);
  let d = ride * total, pos = ROUTE[0];
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) { pos = [ROUTE[i][0] + (ROUTE[i + 1][0] - ROUTE[i][0]) * (d / segs[i]), ROUTE[i][1] + (ROUTE[i + 1][1] - ROUTE[i][1]) * (d / segs[i])]; break; }
    d -= segs[i];
  }
  const gate = Math.floor(interpolate(f, [L(48.8), L(52.4)], [0, 3.99], clamp));
  return (
    <AbsoluteFill>
      <Section text="06/08 · LAST MILE" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(44.66)} size={80}>Restaurant → your door.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 440, height: 640, perspective: 1000}}>
        <div style={{position: "absolute", left: 0, top: 0, width: 866, height: 620, transform: "rotateX(44deg) rotateZ(-4deg)", transformOrigin: "50% 100%", borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`}}>
          <svg width={866} height={620}>
            {ROUTE.slice(1).map((p, i) => {
              const a = ROUTE[i];
              const segDraw = Math.min(1, Math.max(0, draw * segs.length - i));
              return segDraw > 0 ? <line key={i} x1={a[0]} y1={a[1]} x2={a[0] + (p[0] - a[0]) * segDraw} y2={a[1] + (p[1] - a[1]) * segDraw} stroke={traffic ? SEGCOL[i] : C.text} strokeWidth={16} strokeLinecap="round" /> : null;
            })}
            <circle cx={ROUTE[0][0]} cy={ROUTE[0][1]} r={24} fill={C.bug} />
            <text x={ROUTE[0][0]} y={ROUTE[0][1] + 9} textAnchor="middle" fontSize={24}>🍳</text>
            <circle cx={ROUTE[6][0]} cy={ROUTE[6][1]} r={26} fill={C.g} />
            <text x={ROUTE[6][0]} y={ROUTE[6][1] + 9} textAnchor="middle" fontSize={26}>🏠</text>
            {ride > 0 ? <circle cx={pos[0]} cy={pos[1]} r={16} fill={C.text} stroke={C.g} strokeWidth={5} /> : null}
          </svg>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1080, display: "flex", gap: 14, flexWrap: "wrap"}}>
        {f > L(46.11) ? <Chip text="4.2 km" color={C.text} style={{opacity: out(f, L(46.11), L(46.4))}} /> : null}
        {traffic ? <Chip text="traffic" color={C.bug} style={{opacity: out(f, L(46.73), L(47))}} /> : null}
        {f > L(47.6) ? <Chip text="live rider speed" style={{opacity: out(f, L(47.6), L(47.9))}} /> : null}
      </div>
      {/* the last last mile */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1190, display: "flex", alignItems: "center", gap: 12, opacity: out(f, L(48.6), L(49))}}>
        {["🚧 gate", "📝 entry", "🛗 lift", "🚪 door"].map((s, i) => (
          <React.Fragment key={s}>
            <span style={{padding: "12px 14px", borderRadius: 14, border: `2.5px solid ${i <= gate ? C.bug : C.line}`, fontFamily: MONO, fontSize: 24, color: i <= gate ? C.text : C.dim}}>{s}</span>
            {i < 3 ? <span style={{color: C.dim, fontSize: 26}}>→</span> : null}
          </React.Fragment>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1300, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: out(f, L(51.5), L(51.9))}}>
        <span style={{fontFamily: MONO, fontSize: 28, color: C.bug}}>gate → door adds minutes</span>
        <span style={big(100, C.g)}>15 min</span>
      </div>
      <Note top={1460} />
    </AbsoluteFill>
  );
};

// ===================== 7 · live re-prediction =====================
const STAGES = ["placed", "assigned", "picked up", "on the way"];
const Live: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const stage = Math.floor(interpolate(f, [L(54.0), L(57.0)], [0, 3.99], clamp));
  const eta = f < L(57.09) ? 27 : f < L(58.2) ? 29 : 35;
  const flipKey = f < L(57.09) ? 0 : f < L(58.2) ? 1 : 2;
  const flipStart = [0, L(57.09), L(58.2)][flipKey];
  const flip = interpolate(f, [flipStart, flipStart + 8], [90, 0], {...clamp, easing: ease3});
  const pts = [27, 27, 29, 29, 35, 34, 34, 33];
  const shown = Math.floor(interpolate(f, [L(61.15), L(63.5)], [1, pts.length], clamp));
  return (
    <AbsoluteFill>
      <Section text="07/08 · LIVE UPDATES" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(53.75)} size={72}>Re-predicted at</Slam>
        <Slam at={L(54.4)} size={72} style={{marginTop: 6}}>every stage.</Slam>
      </div>
      {/* stage rail */}
      <div style={{position: "absolute", left: 64, right: 150, top: 540, perspective: 900}}>
        <div style={{transform: "rotateX(30deg)", display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative"}}>
          <div style={{position: "absolute", left: 30, right: 30, top: 28, height: 6, background: C.line}} />
          <div style={{position: "absolute", left: 30, top: 28, height: 6, width: `${(stage / 3) * 92}%`, background: C.g}} />
          {STAGES.map((s, i) => (
            <div key={s} style={{position: "relative", textAlign: "center", width: 160}}>
              <div style={{width: 60, height: 60, margin: "0 auto", borderRadius: 30, background: i <= stage ? C.g : C.card, border: `4px solid ${i <= stage ? C.g : C.line}`}} />
              <div style={{fontFamily: MONO, fontSize: 22, color: i <= stage ? C.text : C.dim, marginTop: 10}}>{s}</div>
            </div>
          ))}
        </div>
      </div>
      {/* ETA chip flipping */}
      <div style={{position: "absolute", left: 64, top: 730, display: "flex", alignItems: "center", gap: 30}}>
        <div style={{perspective: 800}}>
          <div style={{transform: `rotateX(${flip}deg)`, padding: "16px 28px", borderRadius: 22, background: eta > 27 ? "#2A1D1B" : "#1C2A21", border: `4px solid ${eta > 27 ? C.bug : C.g}`}}>
            <div style={{...label, color: eta > 27 ? C.bug : C.g}}>ETA</div>
            <div style={big(120, eta > 27 ? C.bug : C.g)}>{eta}<span style={{fontSize: 44}}> min</span></div>
          </div>
        </div>
        <div style={{display: "grid", gap: 12}}>
          {f > L(59.44) ? <Chip text="rider late" color={C.bug} style={{opacity: out(f, L(59.44), L(59.7))}} /> : null}
          {f > L(60.24) ? <Chip text="kitchen busy" color={C.bug} style={{opacity: out(f, L(60.24), L(60.5))}} /> : null}
        </div>
      </div>
      {/* ETA over time with "bumps" */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1010, borderRadius: 22, background: C.card, border: `2.5px solid ${C.line}`, padding: "16px 20px", opacity: out(f, L(61.0), L(61.4))}}>
        <div style={{display: "flex", justifyContent: "space-between"}}><span style={label}>ETA OVER TIME</span><span style={{fontFamily: MONO, fontSize: 22, color: C.bug}}>bumps tracked: {pts.slice(0, shown).filter((p, i) => i && Math.abs(p - pts[i - 1]) >= 2).length}</span></div>
        <svg width={826} height={220} style={{marginTop: 8}}>
          <polyline points={pts.slice(0, shown).map((p, i) => `${30 + i * 110},${200 - (p - 24) * 14}`).join(" ")} fill="none" stroke={C.g} strokeWidth={6} strokeLinejoin="round" />
          {pts.slice(0, shown).map((p, i) => (i && Math.abs(p - pts[i - 1]) >= 2 ? <circle key={i} cx={30 + i * 110} cy={200 - (p - 24) * 14} r={14} fill="none" stroke={C.bug} strokeWidth={5} /> : null))}
        </svg>
      </div>
      {f > L(64.8) ? (
        <div style={{position: "absolute", left: 64, top: 1330}}>
          <Slam at={L(64.86)} size={62}>A jumping ETA</Slam>
          <Slam at={L(66.58)} size={62} color={C.bug} style={{marginTop: 6}}>breaks trust.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 8 · recap + follow =====================
const Recap: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const piece = (at: number, node: React.ReactNode) => <span style={{display: "inline-block", opacity: out(f, L(at), L(at) + 6), transform: `translateY(${(1 - out(f, L(at), L(at) + 6)) * 30}px)`}}>{node}</span>;
  return (
    <AbsoluteFill>
      <Section text="08/08 · RECAP" />
      <div style={{position: "absolute", left: 64, right: 150, top: 330, perspective: 1100}}>
        <div style={{transform: `rotateX(${interpolate(f, [0, 12], [60, 10], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%", borderRadius: 26, background: C.card, border: `3px solid ${C.g}`, padding: "26px 28px", boxShadow: "0 40px 80px rgba(0,0,0,.5)"}}>
          <div style={{...label, color: C.g}}>27 MIN, DECODED · SAVE THIS</div>
          <div style={{display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 12, marginTop: 18, fontFamily: MONO, fontSize: 44, color: C.text}}>
            {piece(68.0, <span>max(</span>)}
            {piece(69.17, <span style={{color: C.g}}>🍳12</span>)}
            {piece(69.4, <span>,</span>)}
            {piece(69.6, <span style={{color: C.text}}>🛵9</span>)}
            {piece(70.32, <span>)</span>)}
            {piece(71.43, <span>+</span>)}
            {piece(71.94, <span style={{color: C.g}}>🏠15</span>)}
          </div>
          <div style={{marginTop: 18, opacity: out(f, L(72.2), L(72.6))}}><span style={big(110, C.g)}>= 27 min</span></div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 820}}>
        <Slam at={L(72.65)} size={70}>Not a guess.</Slam>
        <Slam at={L(73.69)} size={70} color={C.g} style={{marginTop: 6}}>A team of models.</Slam>
      </div>
      {f > L(74.7) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1030, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.g}`, padding: "22px 30px", opacity: out(f, L(74.7), L(75.2)), transform: `translateY(${(1 - out(f, L(74.7), L(75.2))) * 30}px)`}}>
          <div style={{...label, fontSize: 24}}>SUNDAY INSIDE</div>
          <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 6}}>One app, opened up, <span style={{color: C.g}}>every Sunday</span></div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, L(76.3), 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1290, display: "flex", alignItems: "center", gap: 18, opacity: out(f, L(73.0), L(73.4))}}>
        <svg width={34} height={44}><path d="M3 3 H31 V41 L17 30 L3 41 Z" fill="none" stroke={C.g} strokeWidth={4} strokeLinejoin="round" /></svg>
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.g}}>SAVE FOR YOUR NEXT SYSTEM DESIGN ROUND</div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1420, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(73.5), L(74))}}>method: Swiggy Bytes (2019, 2023) · minutes are examples</div>
    </AbsoluteFill>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Formula, Prep, Rider, Trick, LastMile, Live, Recap];

export const Inside01: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <Backdrop />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : I1_TOTAL;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Card3D len={b - a} first={i === 0} last={i === COMPS.length - 1}>
            <Comp off={a} />
          </Card3D>
        </Sequence>
      );
    })}
    {CUTS.slice(1).map((a) => <Cut key={a} at={a} />)}
    <Hud series="INSIDE" ep="01" total={I1_TOTAL} />
  </AbsoluteFill>
);
