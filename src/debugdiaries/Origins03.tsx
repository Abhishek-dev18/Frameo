// Weekend Origins · EP03 "Why do we call it a bug?"
// Facts (Centre for Computing History / Smithsonian record): 9 Sept 1947, Harvard Mark II (relay-based); a moth found
// stuck in the relays; taped into the logbook beside the 15:45 entry "First actual case of bug being found."
// Grace Hopper was on the Mark II team and helped make the story famous; the Smithsonian notes the logbook was probably
// not hers. Edison used "bug" for a fault in an 1878 letter. The logbook is held by the Smithsonian.
// Visual: real-geometry 3D (relay wall slab, thick logbook, museum case), torch-light reveal, original SVG moth + relay.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Spin} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 6.86, 18.57, 25.61, 37.26, 52.38].map(T);
export const O3_TOTAL = T(62.43) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const HAND: React.CSSProperties = {fontFamily: "Georgia, 'DejaVu Serif', serif", fontStyle: "italic", color: "#2B2A33"};
const PAPER = "#E9E2CF";
const ease3 = Easing.inOut(Easing.cubic);

// original, simple moth drawing (generic insect) with flapping wings
const Moth: React.FC<{size?: number; flap?: boolean; flat?: boolean}> = ({size = 120, flap = true, flat}) => {
  const f = useCurrentFrame();
  const s = flat ? 1 : flap ? 0.55 + 0.45 * Math.abs(Math.sin(f / 3)) : 1;
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 120 96">
      <g transform={`translate(60 48) scale(${s} 1) translate(-60 -48)`}>
        <path d="M58 40 C40 8, 8 6, 6 28 C4 44, 30 50, 58 46 Z" fill="#B59A7A" stroke="#6E5A45" strokeWidth={2} />
        <path d="M62 40 C80 8, 112 6, 114 28 C116 44, 90 50, 62 46 Z" fill="#B59A7A" stroke="#6E5A45" strokeWidth={2} />
        <path d="M58 50 C42 56, 22 76, 34 84 C44 90, 54 70, 58 54 Z" fill="#9C8366" stroke="#6E5A45" strokeWidth={2} />
        <path d="M62 50 C78 56, 98 76, 86 84 C76 90, 66 70, 62 54 Z" fill="#9C8366" stroke="#6E5A45" strokeWidth={2} />
        <circle cx={30} cy={28} r={5} fill="#6E5A45" opacity={0.5} /><circle cx={90} cy={28} r={5} fill="#6E5A45" opacity={0.5} />
      </g>
      <ellipse cx={60} cy={50} rx={6} ry={20} fill="#5E4B39" />
      <path d="M57 32 Q50 18 44 14 M63 32 Q70 18 76 14" stroke="#5E4B39" strokeWidth={2} fill="none" />
    </svg>
  );
};

// one electromechanical relay: coil + clicking arm between two contacts
const Relay: React.FC<{on: boolean; size?: number; jam?: boolean}> = ({on, size = 1, jam}) => (
  <svg width={150 * size} height={110 * size} viewBox="0 0 150 110">
    <rect x={8} y={84} width={134} height={18} rx={4} fill="#2C2F35" />
    <rect x={18} y={40} width={34} height={44} rx={5} fill="#B4733A" />
    {[46, 54, 62, 70, 78].map((y) => <line key={y} x1={18} y1={y} x2={52} y2={y} stroke="#8A5427" strokeWidth={2} />)}
    <circle cx={60} cy={34} r={5} fill="#9AA0A8" />
    <line x1={60} y1={34} x2={132} y2={on ? 22 : 42} stroke={jam ? C.bug : "#C9CED6"} strokeWidth={6} strokeLinecap="round" />
    <rect x={124} y={12} width={18} height={8} rx={2} fill={on ? C.g : "#555"} />
    <rect x={124} y={44} width={18} height={8} rx={2} fill={!on ? "#FFD27A" : "#555"} />
  </svg>
);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const fly = interpolate(f, [T(4.97), T(6.6)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="WEEKEND ORIGINS · EP03" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={92}>Why do we call it</Reveal>
        <Reveal at={T(1.67)} size={120} color={C.bug} style={{marginTop: 6}}>a "bug"?</Reveal>
      </div>
      {/* a code editor with a bug squiggle */}
      <div style={{position: "absolute", left: 64, right: 110, top: 680, opacity: out(f, T(0.6), T(1))}}>
        <Glass>
          <div style={{display: "flex", gap: 8, marginBottom: 14}}>{["#FF5F57", "#FEBC2E", "#28C840"].map((c) => <span key={c} style={{width: 14, height: 14, borderRadius: 7, background: c}} />)}</div>
          {["let total = price * qty;", "if (total = 0) {", "  showFree();", "}"].map((l, i) => (
            <div key={i} style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.6, color: i === 1 ? C.text : C.dim, position: "relative"}}>
              <span style={{color: C.dim, marginRight: 18}}>{i + 1}</span>{l}
              {i === 1 && f > T(1.9) ? <svg width={150} height={10} style={{position: "absolute", left: 210, top: 44}}><path d={Array.from({length: 15}).map((_, k) => `${k === 0 ? "M" : "L"}${k * 10} ${k % 2 ? 8 : 2}`).join(" ")} stroke={C.bug} strokeWidth={3} fill="none" /></svg> : null}
            </div>
          ))}
          {f > T(1.9) ? <div style={{fontFamily: MONO, fontSize: 22, color: C.bug, marginTop: 10}}>🐞 1 bug found</div> : null}
        </Glass>
      </div>
      {f > T(3.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1130, ...big(58, C.text), opacity: out(f, T(3.38), T(3.7))}}>
          Because once, it was <span style={{color: C.bug}}>{f > T(4.9) ? "a real insect." : "…"}</span>
        </div>
      ) : null}
      {f > T(4.9) ? (
        <div style={{position: "absolute", left: 140 + fly * 560, top: 1500 - fly * 220 + Math.sin(f / 5) * 20, transform: `rotate(${Math.sin(f / 9) * 14}deg)`}}>
          <Moth size={170} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · the machine =================
const Machine: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const relayOn = Math.floor(f / 7) % 2 === 0;
  return (
    <AbsoluteFill>
      <Section text="1947 / HARVARD" />
      <div style={{position: "absolute", left: 64, top: 320, display: "flex", gap: 14}}>
        <div style={{opacity: out(f, L(6.9), L(7.3))}}><Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>📅 9 SEP 1947</span></Glass></div>
        <div style={{opacity: out(f, L(8.9), L(9.3))}}><Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>🏛️ HARVARD</span></Glass></div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 440}}>
        <Reveal at={L(9.96)} size={84}>The Mark II.</Reveal>
      </div>
      {/* the machine: a wide solid cabinet full of blinking relays */}
      <div style={{position: "absolute", left: 0, right: 0, top: 600, display: "grid", placeItems: "center", opacity: out(f, L(10.1), L(10.6))}}>
        <Slab w={860} h={430} d={140} rx={-8} ry={Math.sin(f / 50) * 10 - 6} color="#2A2B2F" radius={14}
          front={<div style={{width: "100%", height: "100%", padding: 26, boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: 10}}>
            {Array.from({length: 72}).map((_, i) => {
              const r = Math.sin(i * 91.7) * 1e4; const on = (Math.floor(f / 5 + (r - Math.floor(r)) * 9)) % 3 === 0;
              return <div key={i} style={{borderRadius: 5, background: on ? "#FFD27A" : "#17181B", boxShadow: on ? "0 0 10px #FFD27Aaa" : "inset 0 2px 4px #000"}} />;
            })}
          </div>} />
        <Shadow w={860} style={{marginTop: 24}} />
      </div>
      {f > L(12.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1160, opacity: out(f, L(12.99), L(13.4))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 26}}>
            <Relay on={relayOn} size={1.4} />
            <div>
              <div style={label}>RELAY</div>
              <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800, marginTop: 6}}>a tiny mechanical switch</div>
              <div style={{fontFamily: MONO, fontSize: 30, color: relayOn ? C.g : "#FFD27A", marginTop: 6}}>{relayOn ? "click → ON" : "click → OFF"}</div>
            </div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the problem: torch reveal =================
const Problem: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const tx = interpolate(f, [L(20.63), L(22.3), L(23.2)], [180, 760, 540], {...clamp, easing: ease3});
  const ty = interpolate(f, [L(20.63), L(22.3), L(23.2)], [400, 300, 470], {...clamp, easing: ease3});
  const found = f >= L(23.2);
  const blink = Math.floor(f / 6) % 2 === 0;
  return (
    <AbsoluteFill>
      <Section text="THE PROBLEM" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(18.61)} size={72}>The machine kept failing.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, top: 430, display: "flex", alignItems: "center", gap: 12, opacity: out(f, L(18.7), L(19))}}>
        <span style={{width: 18, height: 18, borderRadius: 9, background: blink ? C.bug : "#3a1c1c", boxShadow: blink ? `0 0 16px ${C.bug}` : "none"}} />
        <span style={{fontFamily: MONO, fontSize: 26, color: C.bug}}>ERROR · panel F</span>
      </div>
      {/* dark relay panel, lit only by a torch beam */}
      <div style={{position: "absolute", left: 64, right: 110, top: 520, height: 760, borderRadius: 28, overflow: "hidden", background: "#0B0C0E", border: "1.5px solid rgba(255,255,255,.08)"}}>
        <div style={{position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, padding: 40}}>
          {Array.from({length: 9}).map((_, i) => (
            <div key={i} style={{display: "grid", placeItems: "center", position: "relative"}}>
              <Relay on={i % 2 === 0} jam={i === 4 && found} />
              {i === 4 ? <div style={{position: "absolute", left: "50%", top: "28%", transform: `translate(-10%, -50%) rotate(-18deg) scale(${found ? 1 : 0.85})`}}><Moth size={110} flap={false} flat /></div> : null}
            </div>
          ))}
        </div>
        {/* darkness with a torch hole */}
        <div style={{position: "absolute", inset: 0, background: `radial-gradient(${found ? 260 : 190}px ${found ? 260 : 190}px at ${tx}px ${ty}px, transparent 0%, rgba(5,5,7,.5) 60%, rgba(5,5,7,.84) 100%)`, opacity: out(f, L(20.5), L(20.9))}} />
        {found ? <div style={{position: "absolute", left: tx - 150, top: ty + 130, width: 300, textAlign: "center", fontFamily: MONO, fontSize: 26, color: "#FFD27A", opacity: out(f, L(23.3), L(23.7))}}>a moth, stuck in a relay</div> : null}
      </div>
      {f > L(24.8) ? <div style={{position: "absolute", left: 64, right: 110, top: 1330, ...big(64, C.text), opacity: out(f, L(24.92), L(25.2))}}>A <span style={{color: "#FFD27A"}}>real</span> bug. 🪲</div> : null}
    </AbsoluteFill>
  );
};

// ================= 4 · the logbook =================
const Logbook: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const tape = out(f, L(26.6), L(27.2));
  const mothIn = interpolate(f, [L(25.7), L(26.6)], [-300, 0], {...clamp, easing: Easing.out(Easing.back(1.2))});
  return (
    <AbsoluteFill>
      <Section text="THE LOGBOOK" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(25.65)} size={64}>They taped it in the log.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 450, display: "grid", placeItems: "center"}}>
        <Slab w={820} h={760} d={60} rx={-6} ry={Math.sin(f / 50) * 8 - 4} color={PAPER} radius={10}
          front={<div style={{width: "100%", height: "100%", position: "relative", backgroundImage: "repeating-linear-gradient(transparent 0 58px, rgba(60,80,140,.25) 58px 60px)", backgroundPosition: "0 40px"}}>
            <div style={{position: "absolute", left: 70, top: 0, bottom: 0, width: 2, background: "rgba(200,60,60,.35)"}} />
            <div style={{position: "absolute", left: 90, top: 50, ...HAND, fontSize: 34, opacity: 0.55}}>9/9 · Relay calc. tests</div>
            <div style={{position: "absolute", left: 90, top: 110, ...HAND, fontSize: 30, opacity: 0.45}}>1525 · started cosine tape</div>
            {/* the moth + tape */}
            <div style={{position: "absolute", left: 300, top: 220, transform: `translateY(${mothIn}px) rotate(-8deg)`}}>
              <Moth size={200} flap={false} flat />
              <div style={{position: "absolute", left: -30, top: 30, width: 260, height: 46, background: "rgba(255,250,220,.55)", border: "1px solid rgba(0,0,0,.08)", transform: "rotate(10deg)", opacity: tape}} />
              <div style={{position: "absolute", left: -20, top: 110, width: 250, height: 46, background: "rgba(255,250,220,.55)", border: "1px solid rgba(0,0,0,.08)", transform: "rotate(-6deg)", opacity: tape}} />
            </div>
            {f > L(28.8) ? <div style={{position: "absolute", left: 90, top: 470, ...HAND, fontSize: 40, color: "#8A2B2B", opacity: out(f, L(28.88), L(29.3))}}>1545</div> : null}
            <div style={{position: "absolute", left: 200, right: 30, top: 470, ...HAND, fontSize: 40, lineHeight: 1.45}}>{typed("Relay #70 Panel F (moth) in relay.", f, L(29.6), 30)}</div>
            <div style={{position: "absolute", left: 90, right: 30, top: 580, ...HAND, fontSize: 46, lineHeight: 1.3, color: "#1E1D24"}}>{typed("First actual case of bug being found.", f, L(32.12), 18)}</div>
          </div>} />
        <Shadow w={820} style={{marginTop: 22}} />
      </div>
      {f > L(34.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1290, opacity: out(f, L(34.68), L(35))}}>
          <Glass glow={C.g}>
            <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>= "bug का पहला <Marker at={L(36.36)}>असली</Marker> case"</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the twist =================
const Twist: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="THE TWIST" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, ...big(70, C.text)}}>
        Why write "<Marker at={L(38.4)} color={C.bug}><span style={{color: C.bug}}>actual</span></Marker>"?
      </div>
      {f > L(40.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 440, opacity: out(f, L(40.67), L(41))}}>
          <Glass><div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800}}>Engineers <span style={{color: C.g}}>already</span> called glitches "bugs".</div></Glass>
        </div>
      ) : null}
      {/* Edison 1878: an aged letter slab */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "grid", placeItems: "center", opacity: out(f, L(43.8), L(44.2))}}>
        <Slab w={700} h={380} d={34} rx={-8} ry={14 + Math.sin(f / 45) * 6} color="#D9C9A3" radius={8}
          front={<div style={{width: "100%", height: "100%", padding: "36px 44px", boxSizing: "border-box", background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,.25), transparent 60%), radial-gradient(circle at 80% 90%, rgba(120,80,30,.25), transparent 50%)"}}>
            <div style={{fontFamily: MONO, fontSize: 24, color: "#6B5532", letterSpacing: "0.12em"}}>1878 · A LETTER</div>
            <div style={{...HAND, fontSize: 46, marginTop: 18, color: "#3A2E1F"}}>Thomas Edison</div>
            <div style={{...HAND, fontSize: 36, marginTop: 18, color: "#3A2E1F", lineHeight: 1.4}}>calls small faults <Marker at={L(45.4)} color={C.bug}>"bugs"</Marker></div>
          </div>} />
        <Shadow w={700} style={{marginTop: 20}} />
      </div>
      {f > L(48.2) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1150, opacity: out(f, L(48.32), L(48.7))}}>
          <Glass glow={C.g}>
            <div style={{...label, color: C.g}}>GRACE HOPPER</div>
            <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, marginTop: 8}}>On the Mark II team. <span style={{color: C.g}}>Made the story famous.</span></div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 10}}>(the logbook probably wasn't hers, per the Smithsonian)</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · today =================
const Today: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="TODAY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(52.42)} size={58}>The logbook, moth and all,</Reveal>
        <Reveal at={L(54.19)} size={58} color={C.g} style={{marginTop: 4}}>is at the Smithsonian.</Reveal>
      </div>
      {/* museum case: plinth slab + glass box holding the book */}
      <div style={{position: "absolute", left: 0, right: 0, top: 560, display: "grid", placeItems: "center"}}>
        <div style={{position: "relative", width: 520, height: 420}}>
          <div style={{position: "absolute", left: 60, top: 70}}>
            <Slab w={400} h={300} d={40} rx={-14} ry={Math.sin(f / 50) * 10} color={PAPER} radius={6}
              front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}><Moth size={150} flap={false} flat /></div>} />
          </div>
          <div style={{position: "absolute", inset: 0, borderRadius: 18, border: "2px solid rgba(255,255,255,.25)", background: "linear-gradient(135deg, rgba(255,255,255,.14), rgba(255,255,255,.02) 40%, rgba(255,255,255,.08))", boxShadow: "0 0 60px rgba(255,210,122,.15)"}} />
        </div>
        <Slab w={600} h={70} d={120} rx={-20} ry={0} color="#2A2B30" radius={8} />
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 16}}>LOG BOOK WITH COMPUTER BUG · 1947</div>
      </div>
      {f > L(56) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1180, ...big(50, C.text), opacity: out(f, L(56.19), L(56.6))}}>
          Next time you debug… <span style={{color: "#FFD27A"}}>{f > L(57.9) ? "it once meant removing a real bug. 🪲" : ""}</span>
        </div>
      ) : null}
      {f > L(61) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1360, opacity: out(f, L(61.2), L(61.6))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>WEEKEND ORIGINS</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(61.3), 50)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1580, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(55), L(55.4))}}>source: Smithsonian · Centre for Computing History</div>
    </AbsoluteFill>
  );
};

// bottom history ribbon: 1878 → 1947 → today
const Ribbon: React.FC = () => {
  const f = useCurrentFrame();
  const pos = f < T(43.88) ? (f < T(6.86) ? 0.5 : 0.5) : f < T(48.32) ? 0.08 : f < T(52.38) ? 0.5 : 0.92;
  const x = interpolate(f, [0, 1], [pos, pos]);
  const marks: [number, string][] = [[0.08, "1878"], [0.5, "1947"], [0.92, "TODAY"]];
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1690, height: 60, opacity: out(f, 8, 20)}}>
      <div style={{position: "absolute", left: 0, right: 0, top: 18, height: 4, borderRadius: 2, background: "rgba(255,255,255,.12)"}} />
      {marks.map(([p, t]) => (
        <div key={t} style={{position: "absolute", left: `${p * 100}%`, top: 8, transform: "translateX(-50%)", textAlign: "center"}}>
          <div style={{width: 24, height: 24, borderRadius: 12, margin: "0 auto", background: Math.abs(p - x) < 0.01 ? C.bug : "#2A2D33", boxShadow: Math.abs(p - x) < 0.01 ? `0 0 16px ${C.bug}` : "none"}} />
          <div style={{fontFamily: MONO, fontSize: 20, color: Math.abs(p - x) < 0.01 ? C.text : C.dim, marginTop: 6}}>{t}</div>
        </div>
      ))}
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Machine, Problem, Logbook, Twist, Today];

export const Origins03: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : O3_TOTAL;
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
    <Ribbon />
    <Hud series="ORIGINS" ep="03" total={O3_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
