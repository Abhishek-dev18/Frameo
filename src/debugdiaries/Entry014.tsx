// Debug Diaries · Entry 014 "The Forgotten Server" — Knight Capital, 1 Aug 2012.
// Facts (SEC order, Oct 2013): new RLP code deployed to SMARS; one of eight servers never got it (no second technician
// review); that server still had "Power Peg" code, unused since 2003; a repurposed flag that used to trigger Power Peg
// now triggered RLP → the old server ran Power Peg. ~45 minutes; 4 million+ executions in 154 stocks; loss over $460M;
// Knight had to sell itself. SEC penalty $12M.
// Visual: real-geometry 3D server slabs + deploy wave, zombie block, flag diagram, trade counter, P&L strip.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Spin} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 6.41, 16.23, 24.31, 35.03, 44.54].map(T);
export const E14_TOTAL = T(52.6) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const AMBER = "#FFD27A";

// one rack server: solid slab with drive bays + status LED
type SState = "idle" | "new" | "old" | "rogue";
const Server: React.FC<{n: number; state: SState; w?: number; h?: number; ry?: number}> = ({n, state, w = 210, h = 130, ry = 0}) => {
  const f = useCurrentFrame();
  const col = state === "new" ? C.g : state === "old" ? AMBER : state === "rogue" ? C.bug : C.dim;
  const blink = state === "rogue" ? Math.floor(f / 3) % 2 === 0 : true;
  return (
    <div style={{display: "grid", placeItems: "center"}}>
      <Slab w={w} h={h} d={80} rx={-14} ry={ry} color={state === "rogue" ? "#2C1C1C" : "#23262B"} glow={state === "idle" ? undefined : col} radius={12}
        front={<div style={{width: "100%", height: "100%", padding: "14px 16px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <span style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>SRV-{n}</span>
            <span style={{width: 14, height: 14, borderRadius: 7, background: blink ? col : "#333", boxShadow: blink ? `0 0 12px ${col}` : "none"}} />
          </div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6}}>{Array.from({length: 4}).map((_, i) => <div key={i} style={{height: 10, borderRadius: 3, background: "#15161A", boxShadow: "inset 0 1px 2px #000"}} />)}</div>
          <div style={{fontFamily: MONO, fontSize: 19, color: col}}>{state === "new" ? "v2012 ✓" : state === "old" ? "old code" : state === "rogue" ? "POWER PEG ⚠" : "waiting"}</div>
        </div>} />
    </div>
  );
};

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const loss = interpolate(f, [T(1.03), T(3.2)], [0, 460], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="1 AUG 2012 · WALL STREET" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}>
        <Reveal at={-20} size={150}>45 minutes.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 540, opacity: out(f, T(1.0), T(1.3))}}>
        <Glass glow={C.bug}>
          <div style={label}>LOSS</div>
          <div style={{...big(150, C.bug), marginTop: 6}}>−${Math.round(loss)}M</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 900, display: "grid", placeItems: "center", opacity: out(f, T(3.3), T(3.7))}}>
        <div style={{transform: "scale(1.7)", transformOrigin: "50% 0"}}><Server n={8} state="old" ry={Math.sin(f / 30) * 14 - 8} /></div>
        <Shadow w={360} style={{marginTop: 150}} />
      </div>
      {f > T(3.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1370, ...big(60, C.text), opacity: out(f, T(4.0), T(4.3))}}>
          One server they <span style={{color: C.bug}}>forgot to update.</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · setup: 8 servers =================
const Setup: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="02 / THE DEPLOY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(7.32)} size={86}>Knight Capital.</Reveal>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10, opacity: out(f, L(8.33), L(8.7))}}>one of America's biggest trading firms</div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 540, opacity: out(f, L(10.26), L(10.6))}}>
        <Glass>
          <div style={label}>DEPLOY · NEW TRADING CODE</div>
          <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10, minHeight: 42}}>{typed("$ deploy smars --release rlp", f, L(10.4), 30)}</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 6}}>(illustrative command)</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 40, right: 90, top: 820, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", rowGap: 40, opacity: out(f, L(12.9), L(13.3))}}>
        {Array.from({length: 8}).map((_, i) => {
          const p = out(f, L(13.05) + i * 2, L(13.05) + i * 2 + 8);
          return <div key={i} style={{opacity: p, transform: `translateY(${(1 - p) * 30}px) scale(.92)`}}><Server n={i + 1} state="idle" ry={Math.sin(f / 40 + i) * 10} /></div>;
        })}
      </div>
      {f > L(13) ? <div style={{position: "absolute", left: 0, right: 0, top: 1240, textAlign: "center", ...big(64, C.text), opacity: out(f, L(13.4), L(13.8))}}>8 servers.</div> : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the miss =================
const Miss: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="03 / THE MISS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(16.27)} size={78}>New code reached 7.</Reveal>
        {f > L(19.6) ? <Reveal at={L(19.8)} size={78} color={C.bug} style={{marginTop: 4}}>Server 8 was missed.</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 40, right: 90, top: 600, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", rowGap: 40}}>
        {Array.from({length: 8}).map((_, i) => {
          const done = i < 7 && f > L(17.69) + i * 5;
          const st: SState = i === 7 ? (f > L(19.8) ? "old" : "idle") : done ? "new" : "idle";
          return <div key={i} style={{transform: `scale(${i === 7 && f > L(19.8) ? 1.0 : 0.92})`}}><Server n={i + 1} state={st} ry={Math.sin(f / 40 + i) * 10} /></div>;
        })}
      </div>
      {/* the deploy wave */}
      <div style={{position: "absolute", left: 64, right: 110, top: 1010, height: 14, borderRadius: 7, background: "rgba(255,255,255,.08)", overflow: "hidden"}}>
        <div style={{width: `${interpolate(f, [L(17.69), L(17.69) + 35], [0, 87.5], clamp)}%`, height: "100%", background: C.g, boxShadow: `0 0 16px ${C.g}`}} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1036, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22}}>
        <span style={{color: C.g}}>7 / 8 updated</span><span style={{color: f > L(19.8) ? C.bug : C.dim}}>SRV-8 ✕</span>
      </div>
      {f > L(21.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1140, opacity: out(f, L(21.22), L(21.6))}}>
          <Glass glow={C.bug} style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontSize: 52}}>👀</span>
            <div>
              <div style={label}>SECOND REVIEW OF THE DEPLOY</div>
              <div style={{...big(56, C.bug), marginTop: 6}}>none.</div>
            </div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · zombie code + reused flag =================
const Zombie: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const awake = f >= L(33.84);
  return (
    <AbsoluteFill>
      <Section text="04 / THE ZOMBIE CODE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(24.35)} size={64}>Server 8 still had old code</Reveal>
        <Reveal at={L(25.6)} size={64} color={C.dim} style={{marginTop: 4}}>switched off since 2003.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 560, display: "grid", placeItems: "center", opacity: out(f, L(28.5), L(28.9))}}>
        <Slab w={600} h={260} d={90} rx={-10} ry={Math.sin(f / 35) * 12} color={awake ? "#2E1B1B" : "#1F2023"} glow={awake ? C.bug : undefined} radius={22}
          front={<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 24, padding: "0 34px", boxSizing: "border-box", filter: awake ? "none" : "grayscale(.6) brightness(.8)"}}>
            <span style={{fontSize: 110, transform: awake ? `translateY(${Math.sin(f / 3) * 4}px)` : "none"}}>🧟</span>
            <div>
              <div style={{fontFamily: SANS, fontSize: 52, fontWeight: 900, color: awake ? C.bug : C.text}}>Power Peg</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: awake ? C.bug : C.dim, marginTop: 6}}>{awake ? "AWAKE · trading" : "unused since 2003 · still on disk"}</div>
            </div>
          </div>} />
        <Shadow w={600} style={{marginTop: 20}} />
      </div>
      {/* one flag, two meanings */}
      <div style={{position: "absolute", left: 64, right: 110, top: 960, opacity: out(f, L(29.35), L(29.8))}}>
        <Glass>
          <div style={label}>ONE FLAG · TWO MEANINGS</div>
          <div style={{display: "grid", gap: 10, marginTop: 14, fontFamily: MONO, fontSize: 30}}>
            <div><span style={{color: AMBER}}>flag</span> <span style={{color: C.dim}}>on old server</span> → <span style={{color: C.bug}}>run Power Peg</span></div>
            <div><span style={{color: AMBER}}>flag</span> <span style={{color: C.dim}}>on new servers</span> → <span style={{color: C.g}}>run new RLP code</span></div>
          </div>
        </Glass>
      </div>
      {awake ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1260, ...big(64, C.bug), opacity: out(f, L(33.84), L(34.1))}}>
          The old code <Marker at={L(34)} color={C.bug}>woke up.</Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the damage =================
const Damage: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const trades = Math.round(interpolate(f, [L(35.1), L(37.6)], [0, 4000000], {...clamp, easing: Easing.out(Easing.cubic)}));
  const stamp = f >= L(42.99);
  const sp = interpolate(f, [L(42.99), L(43.3)], [2.2, 1], {...clamp, easing: Easing.out(Easing.back(1.5))});
  return (
    <AbsoluteFill>
      <Section text="05 / THE DAMAGE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(35.07)} size={70}>In 45 minutes it made</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 430}}>
        <Glass glow={C.bug}>
          <div style={label}>EXECUTIONS</div>
          <div style={{...big(120, C.text), marginTop: 6}}>{trades.toLocaleString("en-IN")}{trades >= 4000000 ? "+" : ""}</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 6, opacity: out(f, L(37.75), L(38.1))}}>across 154 stocks</div>
        </Glass>
      </div>
      {/* falling trade tickets */}
      <div style={{position: "absolute", left: 64, right: 110, top: 700, height: 360, overflow: "hidden"}}>
        {Array.from({length: 16}).map((_, i) => {
          const lane = i % 4, k = Math.floor(i / 4);
          const y = ((f * 9 + k * 105 + lane * 52) % 420) - 60;
          return <div key={i} style={{position: "absolute", left: `${lane * 25}%`, top: y, padding: "4px 10px", borderRadius: 8, background: (i + k) % 3 ? "rgba(255,255,255,.05)" : `${C.bug}22`, fontFamily: MONO, fontSize: 22, color: (i + k) % 3 ? C.dim : C.bug, opacity: f > L(35.3) ? 0.85 : 0}}>{(i + k) % 2 ? "BUY" : "SELL"} {["IBM", "XOM", "F", "GE", "BAC", "C", "T"][(i + k * 3) % 7]}</div>;
        })}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1080, opacity: out(f, L(38.99), L(39.3))}}>
        <Glass glow={C.bug}>
          <div style={label}>KNIGHT'S LOSS</div>
          <div style={{...big(96, C.bug), marginTop: 6}}>over $460M</div>
        </Glass>
      </div>
      {stamp ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1320, display: "grid", placeItems: "center"}}>
          <div style={{transform: `scale(${sp}) rotate(-8deg)`, border: `8px solid ${C.bug}`, borderRadius: 18, padding: "10px 34px", ...big(84, C.bug)}}>FIRM SOLD</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lessons =================
const LESSONS: [string, string, number][] = [["🗑️", "Delete dead code.", 45.29], ["🚩", "Never reuse old flags.", 46.87], ["👀", "Get a second review on every deploy.", 48.68]];
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(44.58)} size={90} color={C.g}>The lessons.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470, display: "grid", gap: 22}}>
        {LESSONS.map(([ic, t, at], i) => {
          const p = out(f, L(at), L(at) + 10);
          return (
            <div key={i} style={{opacity: p, transform: `perspective(900px) rotateX(${(1 - p) * 70}deg)`, transformOrigin: "50% 0"}}>
              <Slab w={906} h={150} d={50} rx={-6} ry={0} color="#1F2A23" glow={C.g} radius={22}
                front={<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 24, padding: "0 30px", boxSizing: "border-box"}}>
                  <span style={{fontSize: 64}}>{ic}</span>
                  <span style={{fontFamily: SANS, fontSize: 44, fontWeight: 800}}>{t}</span>
                </div>} />
            </div>
          );
        })}
      </div>
      {f > L(50.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1080, opacity: out(f, L(51.1), L(51.5))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL BUGS, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(51.2), 50)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1300, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(47), L(47.4))}}>source: SEC order on Knight Capital (Oct 2013)</div>
    </AbsoluteFill>
  );
};

// bottom P&L strip
const PnL: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [T(35.07), T(40)], [0, -460], {...clamp, easing: Easing.in(Easing.quad)});
  const bad = v < -1;
  const col = bad ? C.bug : C.g;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20)}}>
      <span style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.1em", color: C.dim}}>KNIGHT P&amp;L</span>
      <span style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: col}}>{bad ? `−$${Math.round(-v)}M${v <= -460 ? "+" : ""}` : "$0 · normal day"}</span>
      <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: col}}>{bad ? "▼▼▼" : "▲"}</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Setup, Miss, Zombie, Damage, Lesson];

export const DebugDiaries014: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E14_TOTAL;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Spin len={b - a} first={i === 0} last={i === COMPS.length - 1}>
            <Push len={b - a}>
              <Comp off={a} />
            </Push>
          </Spin>
        </Sequence>
      );
    })}
    {CUTS.slice(1).map((a) => <Cut key={a} at={a} />)}
    <PnL />
    <Hud ep="014" total={E14_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
