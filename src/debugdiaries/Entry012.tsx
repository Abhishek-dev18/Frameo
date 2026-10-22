// Debug Diaries · Entry 012 "2,147,483,647" — Gangnam Style vs YouTube's 32-bit view counter (Dec 2014).
// Facts: YouTube stored views as a signed 32-bit int (max 2,147,483,647 ≈ 214 crore). As PSY's Gangnam Style approached
// it, YouTube upgraded to a 64-bit counter (max 9,223,372,036,854,775,807 ≈ 9.2 quintillion). Guinness: "First YouTube
// video to require a 64-bit counter". The counter never actually went negative; that's the hypothetical we explain.
// Visual: real-geometry 3D (lit slabs, odometer drums, flipping bit tiles), glass UI, cube-turn scenes.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Drum, Spin} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 6.27, 19.48, 26.29, 33.94, 44.98].map(T);
export const E12_TOTAL = T(53.3) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const MAX = 2147483647;

// 10-digit view counter on real drums, with comma separators and an optional minus sign.
const Counter: React.FC<{v: number; neg?: boolean; cell?: number}> = ({v, neg, cell = 96}) => {
  const abs = Math.abs(v);
  const s = String(Math.floor(abs)).padStart(10, "0");
  const col = neg ? C.bug : C.text;
  const w = Math.round(cell * 0.66);
  const items: React.ReactNode[] = [];
  for (let i = 0; i < 10; i++) {
    const isOnes = i === 9;
    items.push(<Drum key={`d${i}`} value={isOnes ? abs : Number(s[i])} w={w} cell={cell} color={col} />);
    if (i === 0 || i === 3 || i === 6) items.push(<span key={`c${i}`} style={{fontFamily: MONO, fontSize: cell * 0.5, color: C.dim, margin: "0 -4px", alignSelf: "flex-end"}}>,</span>);
  }
  return (
    <div style={{display: "flex", alignItems: "center", gap: 5, padding: "18px 20px", borderRadius: 24, background: "linear-gradient(#17191D, #0D0F12)", border: `2px solid ${neg ? C.bug : "rgba(255,255,255,.12)"}`, boxShadow: neg ? `0 0 60px ${C.bug}66` : "0 30px 60px rgba(0,0,0,.5)"}}>
      <span style={{fontFamily: MONO, fontWeight: 800, fontSize: cell * 0.7, width: cell * 0.36, textAlign: "center", color: neg ? C.bug : "transparent"}}>−</span>
      {items}
    </div>
  );
};

// One bit tile that physically flips (rotateX) when its value changes; has visible thickness via stacked edge.
const Bit: React.FC<{v: 0 | 1; flipAt?: number; sign?: boolean; size?: number}> = ({v, flipAt, sign, size = 40}) => {
  const f = useCurrentFrame();
  const p = flipAt === undefined ? 0 : interpolate(f, [flipAt, flipAt + 10], [0, 1], {...clamp, easing: ease3});
  const shown = p < 0.5 ? v : (1 - v) as 0 | 1;
  const on = shown === 1;
  const col = sign && on ? C.bug : on ? C.g : "#2A2D33";
  return (
    <div style={{width: size, height: size * 1.3, perspective: 300}}>
      <div style={{width: "100%", height: "100%", transform: `rotateX(${p * 180}deg)`, transformStyle: "preserve-3d"}}>
        <div style={{position: "absolute", inset: 0, borderRadius: 6, background: col, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.55, color: on ? "#0E0F12" : C.dim, boxShadow: `0 5px 0 ${on ? "#0006" : "#0008"}, 0 0 ${on ? 14 : 0}px ${col}88`, transform: p >= 0.5 ? "rotateX(180deg)" : undefined, backfaceVisibility: "hidden"}}>{shown}</div>
        <div style={{position: "absolute", inset: 0, borderRadius: 6, background: col, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.55, color: on ? "#0E0F12" : C.dim, transform: p < 0.5 ? "rotateX(180deg)" : undefined, backfaceVisibility: "hidden"}}>{shown}</div>
      </div>
    </div>
  );
};

// A generic video player slab (no real logos): coral play button + progress line.
const Player: React.FC<{ry: number; title: string; sub?: string}> = ({ry, title, sub}) => (
  <div style={{display: "grid", placeItems: "center"}}>
    <Slab w={640} h={360} d={60} rx={-8} ry={ry} color="#202227" radius={22}
      front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", position: "relative"}}>
        <div style={{width: 150, height: 104, borderRadius: 30, background: C.bug, display: "grid", placeItems: "center", boxShadow: `0 0 50px ${C.bug}88`}}>
          <div style={{width: 0, height: 0, borderLeft: "46px solid #fff", borderTop: "28px solid transparent", borderBottom: "28px solid transparent", marginLeft: 10}} />
        </div>
        <div style={{position: "absolute", left: 28, right: 28, bottom: 26}}>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>{title}</div>
          {sub ? <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>{sub}</div> : null}
          <div style={{marginTop: 12, height: 6, borderRadius: 3, background: "rgba(255,255,255,.12)"}}><div style={{width: "64%", height: "100%", borderRadius: 3, background: C.bug}} /></div>
        </div>
      </div>} />
    <Shadow w={640} style={{marginTop: 22}} />
  </div>
);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const v = interpolate(f, [0, T(4.6)], [MAX - 9000, MAX - 3], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="INTERNET HISTORY · 2014" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={72}>One song almost broke</Reveal>
        <Reveal at={T(0.6)} size={72} color={C.bug} style={{marginTop: 4}}>YouTube's counter.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 560}}>
        <Player ry={Math.sin(f / 40) * 9 - 6} title={f > T(5.1) ? "Gangnam Style" : "???"} sub={f > T(5.1) ? "PSY · 2012" : "mystery video"} />
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1090, display: "grid", placeItems: "center"}}>
        <Counter v={v} cell={86} />
        <div style={{...label, marginTop: 12}}>VIEWS</div>
      </div>
      {f > T(2.4) && f < T(4.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1360, opacity: out(f, T(2.48), T(2.9))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 16}}>
            <span style={{fontSize: 44}}>👩‍💻</span>
            <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>Engineers had to <span style={{color: C.g}}>change the code.</span></div>
          </Glass>
        </div>
      ) : null}
      {f >= T(4.9) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1370, textAlign: "center"}}>
          <Reveal at={T(5.2)} size={104} color={C.bug} style={{justifyContent: "center"}}>Gangnam Style 🕺</Reveal>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · the counter: int32 =================
const Int32: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const fill = interpolate(f, [L(12.68), L(14.6)], [MAX - 500, MAX], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Section text="02 / THE COUNTER" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(6.31)} size={72}>Views lived in one number.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560, opacity: out(f, L(9.2), L(9.6))}}>
        <Glass>
          <div style={{fontFamily: MONO, fontSize: 40}}><span style={{color: C.dim}}>int</span><span style={{color: f > L(10.37) ? C.g : C.text}}>{f > L(10.37) ? "32" : ""}</span> <span style={{color: C.text}}>views</span><span style={{color: C.dim}}>;</span></div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 6}}>{f > L(10.37) ? "32-bit signed integer" : " "}</div>
        </Glass>
      </div>
      {/* 32 physical bit tiles: 1 sign bit + 31 value bits, all 1s except the sign */}
      <div style={{position: "absolute", left: 64, right: 110, top: 770, opacity: out(f, L(10.4), L(10.8))}}>
        <div style={{display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 8}}>
          {Array.from({length: 32}).map((_, i) => {
            const at = L(10.5) + i * 1.2;
            const shown = f > at ? (i === 0 ? 0 : 1) : 0;
            return <div key={i} style={{transform: `translateY(${f > at ? 0 : 20}px)`, transition: "none"}}><Bit v={shown as 0 | 1} sign={i === 0} size={46} /></div>;
          })}
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 10}}><span style={{color: C.bug}}>↑ sign bit</span><span>31 value bits</span></div>
      </div>
      {f > L(11.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1020, ...big(56, C.text), opacity: out(f, L(11.4), L(11.8))}}>
          …and a <Marker at={L(11.7)} color={C.bug}>limit.</Marker>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 1120, display: "grid", placeItems: "center", opacity: out(f, L(12.5), L(12.9))}}>
        <Counter v={fill} cell={90} />
        <div style={{...label, marginTop: 12}}>MAX INT32</div>
      </div>
      {f > L(17) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1420, textAlign: "center", opacity: out(f, L(17.17), L(17.6))}}>
          <span style={{...big(80, C.g)}}>≈ 214 crore</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · why: +1 → negative =================
const Wrap: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const flip = L(23.3);
  const neg = f >= flip + 5;
  const flash = neg ? out(f, flip + 5, flip + 12) * (1 - out(f, flip + 12, flip + 26)) : 0;
  return (
    <AbsoluteFill>
      <Section text="03 / WHY IT'S A LIMIT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(19.52)} size={70}>Nothing bigger fits</Reveal>
        <Reveal at={L(20.69)} size={70} color={C.dim} style={{marginTop: 4}}>in 32 bits.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560}}>
        <div style={{display: "grid", gridTemplateColumns: "repeat(16, 1fr)", gap: 8}}>
          {Array.from({length: 32}).map((_, i) => <Bit key={i} v={(i === 0 ? 0 : 1) as 0 | 1} sign={i === 0} flipAt={flip + (i === 0 ? 0 : (31 - i) * 0.3)} size={46} />)}
        </div>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, marginTop: 10}}><span style={{color: neg ? C.bug : C.dim}}>{neg ? "↑ sign bit = 1 → negative" : "↑ sign bit"}</span><span style={{color: C.dim}}>0111…1 → 1000…0</span></div>
      </div>
      {f > L(22.4) && !neg ? <div style={{position: "absolute", left: 0, right: 0, top: 860, textAlign: "center", ...big(96, C.g), opacity: out(f, L(22.57), L(22.9))}}>+ 1</div> : null}
      <div style={{position: "absolute", left: 0, right: 0, top: 860, display: "grid", placeItems: "center", opacity: neg ? 1 : 0}}>
        <Counter v={-(MAX + 1)} neg cell={90} />
      </div>
      {/* the would-be video meta line */}
      {f > L(25) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1150, opacity: out(f, L(25.22), L(25.6))}}>
          <Glass glow={C.bug}>
            <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>Gangnam Style</div>
            <div style={{fontFamily: MONO, fontSize: 30, color: C.bug, marginTop: 8}}>−2,147,483,648 views 😵</div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 6}}>(what it would have shown)</div>
          </Glass>
        </div>
      ) : null}
      {flash > 0 ? <AbsoluteFill style={{background: C.bug, opacity: flash * 0.45}} /> : null}
    </AbsoluteFill>
  );
};

// ================= 4 · 2014: close to the limit =================
const Close: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const prog = interpolate(f, [L(31.17), L(33.3)], [0, 0.985], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Section text="04 / 2014" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(26.33)} size={60}>Nobody expected one video</Reveal>
        <Reveal at={L(27.3)} size={60} color={C.dim} style={{marginTop: 4}}>to get that many views.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 620, opacity: out(f, L(29.08), L(29.5))}}>
        <Player ry={Math.sin(f / 40) * 9 + 6} title="Gangnam Style" sub="2014 · most-viewed video" />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1120, opacity: out(f, L(31), L(31.4))}}>
        <Glass glow={prog > 0.9 ? C.bug : undefined}>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24}}>
            <span style={{color: C.text}}>views: 200 crore+</span><span style={{color: C.bug}}>limit: 214 crore</span>
          </div>
          <div style={{marginTop: 14, height: 22, borderRadius: 11, background: "rgba(255,255,255,.08)", overflow: "hidden"}}>
            <div style={{width: `${prog * 100}%`, height: "100%", borderRadius: 11, background: `linear-gradient(90deg, ${C.g}, ${C.bug})`}} />
          </div>
          <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, marginTop: 14, color: prog > 0.9 ? C.bug : C.text}}>{prog > 0.9 ? "Right at the edge." : "Climbing…"}</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// ================= 5 · the fix: 64-bit =================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const grow = interpolate(f, [L(34.5), L(36.5)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="05 / THE FIX" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(33.98)} size={76} color={C.g}>Upgraded to 64-bit.</Reveal>
      </div>
      {/* two solid bars: 32-bit vs 64-bit */}
      <div style={{position: "absolute", left: 64, top: 480, display: "grid", gap: 26}}>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <span style={{fontFamily: MONO, fontSize: 26, color: C.dim, width: 90}}>int32</span>
          <Slab w={300} h={70} d={40} rx={-14} ry={-10} color="#2A2D33" radius={10} />
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 20}}>
          <span style={{fontFamily: MONO, fontSize: 26, color: C.g, width: 90}}>int64</span>
          <Slab w={300 + grow * 520} h={70} d={40} rx={-14} ry={-10} color="#1E3326" glow={C.g} radius={10} />
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 760, opacity: out(f, L(37.6), L(38))}}>
        <Glass glow={C.g}>
          <div style={label}>NEW LIMIT</div>
          <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.g, marginTop: 10, wordBreak: "break-all"}}>{typed("9,223,372,036,854,775,807", f, L(37.7), 26)}</div>
          {f > L(39.2) ? <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 10, opacity: out(f, L(39.32), L(39.7))}}>≈ 9.2 quintillion views</div> : null}
        </Glass>
      </div>
      {f > L(40.2) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1080, display: "grid", placeItems: "center", opacity: out(f, L(40.32), L(40.8))}}>
          <Slab w={760} h={240} d={70} rx={-10} ry={Math.sin(f / 40) * 8} color="#2A2618" glow="#FFD27A" radius={22}
            front={<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", gap: 22, padding: "0 34px", boxSizing: "border-box"}}>
              <span style={{fontSize: 90}}>🏆</span>
              <div>
                <div style={{...label, color: "#FFD27A"}}>GUINNESS WORLD RECORD</div>
                <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800, marginTop: 8, lineHeight: 1.15}}>First YouTube video to require a 64-bit counter</div>
              </div>
            </div>} />
          <Shadow w={760} style={{marginTop: 22}} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lesson + CTA =================
const TYPES: [string, string][] = [["int8", "127"], ["int16", "32,767"], ["int32", "2,147,483,647"], ["int64", "9.2 quintillion"]];
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(45.79)} size={76}>Today's "never"</Reveal>
        <Reveal at={L(47.82)} size={76} color={C.bug} style={{marginTop: 4}}>is tomorrow's limit.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        {TYPES.map(([t, m], i) => {
          const at = L(48.81) + i * 4;
          const p = out(f, at, at + 10);
          return (
            <div key={t} style={{opacity: p, transform: `perspective(900px) rotateX(${(1 - p) * 60}deg)`}}>
              <Glass glow={i === 3 && p > 0.9 ? C.g : undefined}>
                <div style={{fontFamily: MONO, fontSize: 30, color: i === 3 ? C.g : C.text}}>{t}</div>
                <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 6}}>max {m}</div>
              </Glass>
            </div>
          );
        })}
      </div>
      {f > L(48.7) ? <div style={{position: "absolute", left: 64, right: 110, top: 870, ...big(52, C.text), opacity: out(f, L(48.81), L(49.2))}}>Pick your number size <span style={{color: C.g}}>on purpose.</span></div> : null}
      {f > L(50.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1050, opacity: out(f, L(50.89), L(51.3)), transform: `translateY(${(1 - out(f, L(50.89), L(51.3))) * 30}px)`}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>BUGS, EXPLAINED</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(51.2), 40)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1290, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(49), L(49.4))}}>source: Guinness World Records · BBC (Dec 2014)</div>
    </AbsoluteFill>
  );
};

// persistent bottom strip: the counter's type
const TypeStrip: React.FC = () => {
  const f = useCurrentFrame();
  const up = f >= T(33.98);
  const col = up ? C.g : C.bug;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20)}}>
      <span style={{fontSize: 26}}>▶</span>
      <span style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>view_count :</span>
      <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: col}}>{up ? "int64 ✓" : "int32"}</span>
      <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: C.dim}}>{up ? "max ≈ 9.2 quintillion" : "max 2,147,483,647"}</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Int32, Wrap, Close, Fix, Lesson];

export const DebugDiaries012: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E12_TOTAL;
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
    <TypeStrip />
    <Hud ep="012" total={E12_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
