// Debug Diaries · Entry 013 "One Command" — the 4 Oct 2021 Facebook / WhatsApp / Instagram outage (~6 hours).
// Facts (Meta Engineering, "More details about the Oct. 4 outage"): during routine maintenance a command meant to assess
// global backbone capacity unintentionally took down all backbone connections; "a bug in that audit tool prevented it from
// properly stopping the command"; DNS servers, unable to reach the data centres, withdrew their BGP advertisements, so the
// internet couldn't find Facebook even though servers were up; normal + out-of-band access depended on the downed network;
// engineers went onsite and physical security slowed entry; services were restored gradually to avoid a load surge.
// Voice is played at 1.08×, so cue times are written in raw-voice seconds and scaled by R.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Spin} from "./depth";

const R = 1.08;
const T = (s: number) => Math.round((s / R) * 30);
const CUTS = [0, 10.03, 24.4, 31.7, 42.93, 54.08].map(T);
export const E13_TOTAL = T(65.83) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);

// app block (generic icons, no real logos)
const App: React.FC<{icon: string; name: string; on: boolean; ry: number; tint: string}> = ({icon, name, on, ry, tint}) => (
  <div style={{display: "grid", placeItems: "center"}}>
    <Slab w={250} h={250} d={64} rx={-10} ry={ry} color={on ? "#23262C" : "#191A1E"} glow={on ? tint : C.bug} radius={44}
      front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
        <div>
          <div style={{fontSize: 84, filter: on ? "none" : "grayscale(1) brightness(.5)"}}>{icon}</div>
          <div style={{fontFamily: SANS, fontSize: 28, fontWeight: 800, color: on ? C.text : C.dim, marginTop: 6}}>{name}</div>
          <div style={{fontFamily: MONO, fontSize: 18, color: on ? C.g : C.bug, marginTop: 4}}>{on ? "● online" : "✕ offline"}</div>
        </div>
      </div>} />
    <Shadow w={250} style={{marginTop: 18}} />
  </div>
);

// data-centre network: small solid nodes joined by backbone links that can snap
const NODES: [number, number][] = [[140, 120], [480, 60], [800, 140], [120, 430], [470, 380], [820, 450]];
const LINKS: [number, number][] = [[0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5], [0, 4], [2, 4]];
const Network: React.FC<{cut: number; dead?: boolean}> = ({cut, dead}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "relative", width: 950, height: 560}}>
      <svg width={950} height={560} style={{position: "absolute", inset: 0}}>
        {LINKS.map(([a, b], i) => {
          const [x1, y1] = NODES[a], [x2, y2] = NODES[b];
          const k = interpolate(f, [cut + i * 2, cut + i * 2 + 8], [0, 1], clamp);
          const pulse = 0.55 + 0.45 * Math.sin(f / 6 + i);
          return k < 1 ? (
            <line key={i} x1={x1 + 60} y1={y1 + 45} x2={x2 + 60} y2={y2 + 45} stroke={k > 0 ? C.bug : C.g} strokeWidth={5} strokeOpacity={(1 - k) * pulse} strokeDasharray={k > 0 ? "10 12" : undefined} style={{filter: `drop-shadow(0 0 8px ${k > 0 ? C.bug : C.g})`}} />
          ) : (
            <line key={i} x1={x1 + 60} y1={y1 + 45} x2={x2 + 60} y2={y2 + 45} stroke={C.bug} strokeWidth={2} strokeOpacity={0.18} strokeDasharray="6 14" />
          );
        })}
      </svg>
      {NODES.map(([x, y], i) => (
        <div key={i} style={{position: "absolute", left: x, top: y}}>
          <Slab w={120} h={90} d={40} rx={-14} ry={Math.sin(f / 40 + i) * 10} color={dead ? "#1B1C20" : "#22262B"} glow={dead ? C.bug : undefined} radius={14}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 40, filter: dead ? "grayscale(1) brightness(.6)" : "none"}}>🏢</div>} />
        </div>
      ))}
    </div>
  );
};

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const gone = f >= T(5.91);
  const sway = Math.sin(f / 40) * 8;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="4 OCT 2021 · ~9 PM IST" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={80}>Three apps vanished</Reveal>
        <Reveal at={T(0.6)} size={80} color={C.bug} style={{marginTop: 4}}>at the same time.</Reveal>
      </div>
      <div style={{position: "absolute", left: 50, right: 100, top: 620, display: "flex", justifyContent: "space-between"}}>
        {([["💬", "WhatsApp", "#25D366", 3.89], ["📸", "Instagram", "#E1306C", 4.54], ["👍", "Facebook", "#4A7BFF", 4.9]] as [string, string, string, number][]).map(([ic, n, tint, at], i) => {
          const p = out(f, T(at), T(at) + 10);
          const drop = gone ? interpolate(f, [T(5.91) + i * 4, T(5.91) + i * 4 + 14], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;
          return (
            <div key={n} style={{opacity: p * (1 - drop * 0.35), transform: `translateY(${(1 - p) * 40 + drop * 30}px) scale(.88)`}}>
              <App icon={ic} name={n} on={!gone} ry={(i - 1) * -14 + sway} tint={tint} />
            </div>
          );
        })}
      </div>
      {f > T(7.2) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", opacity: out(f, T(7.38), T(7.7))}}>
          <span style={{...big(120, C.text)}}>~6 HOURS</span>
          <div style={{...label, marginTop: 10}}>FACEBOOK · WHATSAPP · INSTAGRAM DOWN</div>
        </div>
      ) : null}
      {f > T(8.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1330, opacity: out(f, T(9.06), T(9.4))}}>
          <Glass glow={C.bug} style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontFamily: MONO, fontSize: 48, color: C.bug}}>$_</span>
            <div style={{fontFamily: SANS, fontSize: 52, fontWeight: 900}}>The cause? <span style={{color: C.bug}}>One command.</span></div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · the command =================
const Command: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="02 / THE COMMAND" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(10.07)} size={64}>Routine maintenance.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 440, opacity: out(f, L(13.2), L(13.6))}}>
        <Glass>
          <div style={label}>BACKBONE · MAINTENANCE</div>
          <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10, minHeight: 42}}>{typed("$ assess global backbone capacity", f, L(13.32), 30)}</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 6}}>(illustrative, the real command wasn't published)</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 50, top: 700, opacity: out(f, L(15.3), L(15.8))}}>
        <Network cut={L(21.22)} />
        <div style={{position: "absolute", left: 0, right: 0, top: -50, textAlign: "center", fontFamily: MONO, fontSize: 24, color: f > L(21.2) ? C.bug : C.g}}>{f > L(21.2) ? "backbone links: CUT" : "global backbone · data centres"}</div>
      </div>
      {f > L(18.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1320, ...big(60, C.text), opacity: out(f, L(18.92), L(19.3))}}>
          It accidentally <Marker at={L(21.4)} color={C.bug}><span style={{color: f > L(21.3) ? C.bug : C.text}}>cut every link.</span></Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the audit tool's own bug =================
const Audit: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const broke = f >= L(26.48);
  const crack = interpolate(f, [L(26.6), L(27.4)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Section text="03 / THE SAFETY NET" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(24.44)} size={70}>An audit tool should</Reveal>
        <Reveal at={L(25.1)} size={70} color={C.g} style={{marginTop: 4}}>have stopped it.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 600, display: "grid", placeItems: "center"}}>
        <div style={{position: "relative"}}>
          <Slab w={420} h={420} d={90} rx={-10} ry={Math.sin(f / 35) * 14} color={broke ? "#2A1C1C" : "#1E2A22"} glow={broke ? C.bug : C.g} radius={60}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
              <div>
                <div style={{fontSize: 130}}>{broke ? "🐞" : "🛡️"}</div>
                <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, color: broke ? C.bug : C.g}}>AUDIT TOOL</div>
                <div style={{fontFamily: MONO, fontSize: 24, color: broke ? C.bug : C.dim, marginTop: 6}}>{broke ? "had a bug" : "blocks risky commands"}</div>
              </div>
            </div>} />
          {/* crack lines */}
          <svg width={420} height={420} style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
            <path d="M210 0 L190 120 L240 190 L200 290 L230 420" fill="none" stroke={C.bug} strokeWidth={6} strokeDasharray={600} strokeDashoffset={600 * (1 - crack)} style={{filter: `drop-shadow(0 0 10px ${C.bug})`}} />
          </svg>
          <Shadow w={420} style={{marginTop: 22}} />
        </div>
      </div>
      {broke ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1150, opacity: out(f, L(27.4), L(27.8))}}>
          <Glass glow={C.bug}>
            <div style={{...label, color: C.bug}}>META'S POST-MORTEM</div>
            <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, marginTop: 8, lineHeight: 1.2}}>"a bug in that audit tool prevented it from properly stopping the command"</div>
          </Glass>
        </div>
      ) : null}
      {f > L(29.5) ? <div style={{position: "absolute", left: 64, right: 110, top: 1440, ...big(54, C.bug), opacity: out(f, L(29.67), L(30))}}>Every data centre: cut off from the world.</div> : null}
    </AbsoluteFill>
  );
};

// ================= 4 · DNS domino =================
const Domino: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const N = 6;
  return (
    <AbsoluteFill>
      <Section text="04 / THE DOMINO EFFECT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(31.74)} size={76}>Then, dominoes.</Reveal>
      </div>
      {/* real 3D dominoes tipping over in sequence */}
      <div style={{position: "absolute", left: 70, right: 110, top: 470, height: 260, display: "flex", alignItems: "flex-end", gap: 56}}>
        {Array.from({length: N}).map((_, i) => {
          const a = L(32.0) + i * 3;
          const rx = interpolate(f, [a, a + 9], [0, 72], {...clamp, easing: Easing.in(Easing.quad)});
          return (
            <div key={i} style={{transformOrigin: "50% 100%"}}>
              <Slab w={86} h={230} d={32} rx={-rx} ry={-24} color={i === N - 1 ? "#2A1C1C" : "#25282E"} glow={i === N - 1 ? C.bug : undefined} radius={8} persp={900}
                front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", gap: 18, alignContent: "center"}}>{[0, 1].map((k) => <div key={k} style={{width: 12, height: 12, borderRadius: 6, background: C.text, opacity: 0.6}} />)}</div>} />
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 760, display: "grid", gap: 14}}>
        <div style={{opacity: out(f, L(33.21), L(33.6))}}>
          <Glass>
            <div style={label}>FACEBOOK'S DNS SERVERS</div>
            <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 8}}>Can't reach the data centres…</div>
            <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 4, color: f > L(35.7) ? C.bug : C.dim}}>{f > L(35.7) ? "→ stop telling the internet where Facebook is." : " "}</div>
          </Glass>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
          <div style={{opacity: out(f, L(39.29), L(39.6))}}><Glass glow={C.g}><div style={label}>SERVERS</div><div style={{...big(56, C.g), marginTop: 8}}>ON ✓</div></Glass></div>
          <div style={{opacity: out(f, L(40.58), L(40.9))}}><Glass glow={C.bug}><div style={label}>ADDRESS</div><div style={{...big(56, C.bug), marginTop: 8}}>GONE ✕</div></Glass></div>
        </div>
      </div>
      {f > L(40.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(41), L(41.4))}}>
          <Glass style={{borderTop: `6px solid ${C.bug}`}}>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.dim}}>🔍 facebook.com</div>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 12}}>This site can't be reached</div>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.bug, marginTop: 6}}>DNS: address not found</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · locked out =================
const Locked: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const walk = interpolate(f, [L(48.67), L(50.3)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="05 / LOCKED OUT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(42.97)} size={64}>The fixing tools ran on</Reveal>
        <Reveal at={L(44.2)} size={64} color={C.bug} style={{marginTop: 4}}>the same broken network.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 540, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14}}>
        <div style={{opacity: out(f, L(44.6), L(45))}}><Glass><div style={label}>INTERNAL TOOLS</div><div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800, marginTop: 8, color: C.bug}}>🛠️ unreachable</div></Glass></div>
        <div style={{opacity: out(f, L(46.87), L(47.2))}}><Glass><div style={label}>REMOTE ACCESS</div><div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800, marginTop: 8, color: C.bug}}>💻 ✕</div></Glass></div>
      </div>
      {/* engineer travels to the data centre door */}
      <div style={{position: "absolute", left: 64, right: 110, top: 780, height: 460, opacity: out(f, L(48.6), L(48.9))}}>
        <div style={{position: "absolute", left: 20 + walk * 330, top: 170, fontSize: 110, transform: `translateY(${Math.abs(Math.sin(f / 4)) * -10 * (walk > 0 && walk < 1 ? 1 : 0)}px)`}}>🧑‍💻</div>
        <div style={{position: "absolute", right: 0, top: 0}}>
          <Slab w={380} h={420} d={110} rx={-8} ry={-22 + Math.sin(f / 40) * 6} color="#22252A" radius={18}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
              <div>
                <div style={{fontSize: 40}}>🏢</div>
                <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 4}}>DATA CENTRE</div>
                <div style={{marginTop: 18, width: 150, height: 200, borderRadius: 12, background: "#15161A", border: `3px solid ${f > L(50.35) ? C.bug : "rgba(255,255,255,.15)"}`, display: "grid", placeItems: "center", marginLeft: "auto", marginRight: "auto"}}>
                  <span style={{fontSize: 56}}>{f > L(50.35) ? "🔒" : "🚪"}</span>
                </div>
              </div>
            </div>} />
        </div>
      </div>
      {f > L(50.2) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1280, opacity: out(f, L(50.35), L(50.7))}}>
          <Glass glow={C.bug}>
            <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800}}>Tight physical security <span style={{color: C.bug}}>slowed getting in.</span></div>
            <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 8}}>{f > L(52.49) ? "⏳ every minute = billions of users offline" : " "}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · recovery + lesson =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const sway = Math.sin(f / 40) * 8;
  return (
    <AbsoluteFill>
      <Section text="06 / BACK ONLINE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(54.12)} size={70} color={C.g}>Brought back slowly,</Reveal>
        <Reveal at={L(56.09)} size={70} style={{marginTop: 4}}>to avoid a traffic surge.</Reveal>
      </div>
      <div style={{position: "absolute", left: 20, right: 70, top: 560, display: "flex", justifyContent: "space-between", transform: "scale(.8)", transformOrigin: "50% 0"}}>
        {([["💬", "WhatsApp", "#25D366"], ["📸", "Instagram", "#E1306C"], ["👍", "Facebook", "#4A7BFF"]] as [string, string, string][]).map(([ic, n, tint], i) => (
          <App key={n} icon={ic} name={n} on={f > L(54.6) + i * 18} ry={(i - 1) * -14 + sway} tint={tint} />
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 900, display: "grid", gap: 14}}>
        <div style={{opacity: out(f, L(58.91), L(59.3))}}>
          <Glass glow={C.g}><div style={{...label, color: C.g}}>LESSON 1</div><div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 6}}>Test your <Marker at={L(59.6)}>safety tools</Marker> too.</div></Glass>
        </div>
        <div style={{opacity: out(f, L(60.78), L(61.2))}}>
          <Glass glow={C.g}><div style={{...label, color: C.g}}>LESSON 2</div><div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 6}}>Don't keep recovery on the system <span style={{color: C.bug}}>that can fail.</span></div></Glass>
        </div>
      </div>
      {f > L(64.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1340, opacity: out(f, L(64.52), L(64.9))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL OUTAGES, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(64.6), 44)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1560, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(58), L(58.4))}}>source: Meta Engineering post-mortem (5 Oct 2021)</div>
    </AbsoluteFill>
  );
};

const Status: React.FC = () => {
  const f = useCurrentFrame();
  const ok = f >= T(54.12);
  const down = f >= T(5.91);
  const col = ok ? C.g : down ? C.bug : C.dim;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20)}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: col, boxShadow: `0 0 0 ${4 + (f % 30) / 4}px ${col}33`}} />
      <span style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.1em", color: col}}>{ok ? "RESTORING" : down ? "OFFLINE" : "ONLINE"}</span>
      <span style={{fontFamily: MONO, fontSize: 22, color: C.dim}}>facebook · whatsapp · instagram</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Command, Audit, Domino, Locked, Lesson];

export const DebugDiaries013: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E13_TOTAL;
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
    <Status />
    <Hud ep="013" total={E13_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
