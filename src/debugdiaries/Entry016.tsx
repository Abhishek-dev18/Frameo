// Debug Diaries · Entry 016 "Field 21" — the CrowdStrike outage, 19 Jul 2024.
// Facts (CrowdStrike RCA via Help Net Security / TechTarget; CrowdStrike PIR): a Rapid Response Content update (Channel
// File 291) for the Falcon sensor; the new Template Type defined 21 input fields but the integration code supplied only
// 20 values; reading the 21st → out-of-bounds memory read → crash in kernel → Windows BSOD; ~8.5 million Windows devices.
// Released 04:09 UTC, reverted 05:27 UTC (~78 min). Manual fix: boot to Safe Mode / recovery, delete the channel file.
// Indian airports issued handwritten boarding passes. Fixes: staged content rollout, customer control over updates.
// Voice runs at 1.08×; cue times are raw-voice seconds scaled by R.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow} from "./depth";
import {Scene, OV, TIn, TOut} from "./transitions";

const R = 1.08;
const T = (s: number) => Math.round((s / R) * 30);
const CUTS = [0, 10.92, 23.67, 33.42, 44.81, 56.99].map(T);
export const E16_TOTAL = T(66.21) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const BLUE = "#1060C8";

// a small monitor slab that can blue-screen
const Monitor: React.FC<{blue: boolean; fixed?: boolean; w?: number; ry?: number}> = ({blue, fixed, w = 150, ry = 0}) => (
  <div style={{display: "grid", placeItems: "center"}}>
    <Slab w={w} h={w * 0.66} d={16} rx={-8} ry={ry} color="#1B1D22" radius={8}
      front={<div style={{position: "absolute", inset: 6, borderRadius: 4, background: fixed ? "#16301F" : blue ? BLUE : "#0E1014", display: "grid", placeItems: "center", color: "#fff", fontFamily: SANS, fontWeight: 700, fontSize: w * 0.22}}>{fixed ? <span style={{color: C.g}}>✓</span> : blue ? ":(" : <span style={{fontSize: w * 0.1, color: C.dim, fontFamily: MONO}}>OK</span>}</div>} />
    <div style={{width: w * 0.12, height: w * 0.1, background: "#2A2C31"}} />
    <div style={{width: w * 0.4, height: 6, borderRadius: 3, background: "#2A2C31"}} />
  </div>
);

// ================= 1 · hook: the blue wave =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const wave = (i: number) => T(3.75) + (i % 5) * 3 + Math.floor(i / 5) * 2;
  const n = Math.round(interpolate(f, [T(3.75), T(6.6)], [0, 8500000], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="19 JUL 2024 · ~9:30 AM IST" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={68}>One morning, the world</Reveal>
        <Reveal at={T(3.75)} size={68} color="#5B9BFF" style={{marginTop: 4}}>blue-screened.</Reveal>
      </div>
      <div style={{position: "absolute", left: 40, right: 90, top: 590, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 24}}>
        {Array.from({length: 15}).map((_, i) => <div key={i} style={{transform: "scale(.95)"}}><Monitor blue={f > wave(i)} ry={Math.sin(f / 40 + i) * 12} /></div>)}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1140, opacity: out(f, T(3.9), T(4.3))}}>
        <Glass glow={BLUE}>
          <div style={label}>WINDOWS PCs DOWN</div>
          <div style={{...big(110, "#5B9BFF"), marginTop: 6}}>{n.toLocaleString("en-IN")}</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1420, display: "flex", gap: 14}}>
        {([["✈️", "Airports", 6.99], ["🏦", "Banks", 8.22], ["🏥", "Hospitals", 9.44]] as [string, string, number][]).map(([ic, t, at]) => (
          <div key={t} style={{flex: 1, opacity: out(f, T(at), T(at) + 8), transform: `translateY(${(1 - out(f, T(at), T(at) + 8)) * 30}px)`}}>
            <Glass glow={f > T(10.21) ? C.bug : undefined} style={{textAlign: "center", padding: "16px 10px"}}>
              <div style={{fontSize: 52}}>{ic}</div>
              <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 800, marginTop: 4}}>{t}</div>
              <div style={{fontFamily: MONO, fontSize: 20, color: f > T(10.21) ? C.bug : C.dim, marginTop: 4}}>{f > T(10.21) ? "STOPPED" : "…"}</div>
            </Glass>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

// ================= 2 · who + the kernel =================
const Kernel: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const drop = interpolate(f, [L(21.98), L(23.3)], [-420, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const layers: [string, string, string][] = [["APPS", "Chrome · Excel · your app", "#23262B"], ["WINDOWS", "the operating system", "#1E2433"], ["KERNEL", "the deepest layer · full control", "#2A1F33"]];
  return (
    <AbsoluteFill>
      <Section text="02 / WHO" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(11.86)} size={88}>CrowdStrike.</Reveal>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10, opacity: out(f, L(12.66), L(13))}}>cybersecurity company · "Falcon" sensor</div>
      </div>
      {/* the OS as a stack of solid layers */}
      <div style={{position: "absolute", left: 0, right: 0, top: 560, display: "grid", placeItems: "center", gap: 18}}>
        {layers.map(([t, d, c], i) => {
          const p = out(f, L(14.13) + i * 6, L(14.13) + i * 6 + 10);
          const isK = i === 2;
          return (
            <div key={t} style={{opacity: p, transform: `translateY(${(1 - p) * 40}px)`}}>
              <Slab w={820} h={150} d={60} rx={-14} ry={Math.sin(f / 45) * 6} color={c} glow={isK && f > L(16.78) ? "#B07CFF" : undefined} radius={20}
                front={<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", boxSizing: "border-box"}}>
                  <div>
                    <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, color: isK ? "#C9A8FF" : C.text}}>{t}</div>
                    <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>{d}</div>
                  </div>
                  {isK && f > L(16.78) ? <span style={{padding: "8px 14px", borderRadius: 12, background: "#B07CFF33", border: "1.5px solid #B07CFF", fontFamily: MONO, fontSize: 22, color: "#C9A8FF"}}>🦅 Falcon runs here</span> : null}
                </div>} />
            </div>
          );
        })}
      </div>
      {f > L(18) ? <div style={{position: "absolute", left: 64, right: 110, top: 1150, fontFamily: MONO, fontSize: 28, color: C.g, opacity: out(f, L(18.07), L(18.4)) * (1 - out(f, L(19.3), L(19.6)))}}>🛡️ deep access → catches attacks early</div> : null}
      {f > L(19.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1250, opacity: out(f, L(19.44), L(19.8)), transform: `translateY(${drop * 0.15}px)`}}>
          <Glass glow="#FFD27A" style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontSize: 52}}>📄</span>
            <div>
              <div style={label}>TINY CONTENT UPDATE</div>
              <div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: "#FFD27A", marginTop: 6}}>{f > L(21.9) ? "Channel File 291" : "…"}</div>
            </div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the bug: 21 slots, 20 values =================
const Fields: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const ptr = interpolate(f, [L(30.36), L(32.5)], [0, 20], {...clamp, easing: Easing.inOut(Easing.quad)});
  const miss = f >= L(32.5);
  return (
    <AbsoluteFill>
      <Section text="03 / THE BUG" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, ...big(70, C.text)}}>
        Expected <span style={{color: "#FFD27A"}}>21</span>. Got <span style={{color: C.bug}}>{f > L(28.5) ? "20" : "?"}</span>.
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470, opacity: out(f, L(25.76), L(26.1))}}>
        <div style={label}>TEMPLATE · 21 FIELDS</div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 14, marginTop: 14}}>
          {Array.from({length: 21}).map((_, i) => {
            const filled = i < 20 && f > L(28.59) + i * 1.2;
            const hot = Math.round(ptr) === i && f > L(30.3);
            const last = i === 20;
            return (
              <div key={i} style={{height: 110, borderRadius: 14, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700,
                background: last ? (miss ? `${C.bug}22` : "transparent") : filled ? `${C.g}22` : "rgba(255,255,255,.04)",
                border: last ? `3px dashed ${miss ? C.bug : "rgba(255,255,255,.3)"}` : `2px solid ${filled ? C.g + "88" : "rgba(255,255,255,.1)"}`,
                color: last ? (miss ? C.bug : C.dim) : filled ? C.g : C.dim,
                transform: hot ? "translateY(-10px) scale(1.08)" : "none", boxShadow: hot ? `0 0 26px ${last ? C.bug : C.g}` : "none"}}>
                {last ? (miss ? "✕" : "21") : filled ? "✓" : i + 1}
              </div>
            );
          })}
        </div>
      </div>
      {f > L(26.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1000, opacity: out(f, L(26.99), L(27.3))}}>
          <Glass>
            <div style={label}>THE CODE READING IT</div>
            <div style={{fontFamily: MONO, fontSize: 32, marginTop: 10}}><span style={{color: C.dim}}>values given:</span> <span style={{color: C.g}}>{f > L(28.59) ? "20" : "…"}</span></div>
            <div style={{fontFamily: MONO, fontSize: 32, marginTop: 6}}><span style={{color: C.dim}}>reading field:</span> <span style={{color: miss ? C.bug : "#FFD27A"}}>{f > L(30.36) ? `#${Math.round(ptr) + 1}` : "—"}</span></div>
          </Glass>
        </div>
      ) : null}
      {miss ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1270, ...big(64, C.bug), opacity: out(f, L(32.6), L(32.9))}}>
          Field 21: <Marker at={L(32.8)} color={C.bug}>it wasn't there.</Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · why everything died =================
const Crash: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const loop = f > L(41.1) ? ((f - L(41.1)) * 6) % 360 : 0;
  const stepIdx = f > L(41.1) ? Math.floor(((f - L(41.1)) / 14) % 3) : -1;
  return (
    <AbsoluteFill>
      <Section text="04 / WHY IT KILLED WINDOWS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(33.46)} size={78} color={C.bug}>Out-of-bounds read.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        <div style={{opacity: out(f, L(35.24), L(35.6))}}>
          <Glass>
            <div style={label}>IN A NORMAL APP</div>
            <div style={{fontSize: 70, marginTop: 10}}>🪟💥</div>
            <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 800, marginTop: 6}}>{f > L(36.9) ? "just that app crashes" : "…"}</div>
          </Glass>
        </div>
        <div style={{opacity: out(f, L(38.46), L(38.8))}}>
          <Glass glow={BLUE}>
            <div style={{...label, color: "#5B9BFF"}}>IN THE KERNEL</div>
            <div style={{marginTop: 12}}><Monitor blue w={180} ry={Math.sin(f / 30) * 10} /></div>
            <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 800, marginTop: 6, color: "#5B9BFF"}}>all of Windows goes down</div>
          </Glass>
        </div>
      </div>
      {/* the restart loop */}
      {f > L(41) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 960, display: "grid", placeItems: "center", opacity: out(f, L(41.1), L(41.4))}}>
          <div style={{position: "relative", width: 440, height: 440}}>
            <svg width={440} height={440} style={{position: "absolute", inset: 0, transform: `rotate(${loop}deg)`}}>
              <circle cx={220} cy={220} r={190} fill="none" stroke={C.bug} strokeWidth={8} strokeDasharray="300 98" strokeLinecap="round" />
              <path d="M398 190 L420 225 L380 228 Z" fill={C.bug} />
            </svg>
            {(["🔁 restart", "📄 load file 291", "💥 crash"] as string[]).map((t, i) => {
              const a = (i / 3) * Math.PI * 2 - Math.PI / 2;
              return <div key={t} style={{position: "absolute", left: 220 + Math.cos(a) * 190 - 110, top: 220 + Math.sin(a) * 190 - 26, width: 220, textAlign: "center", padding: "10px 0", borderRadius: 14, background: stepIdx === i ? `${C.bug}33` : "#1A1B1F", border: `2px solid ${stepIdx === i ? C.bug : "rgba(255,255,255,.12)"}`, fontFamily: MONO, fontSize: 24, color: stepIdx === i ? C.text : C.dim}}>{t}</div>;
            })}
            <div style={{position: "absolute", inset: 0, display: "grid", placeItems: "center", ...big(54, C.bug)}}>{f > L(43.66) ? "again." : ""}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the cleanup =================
const Cleanup: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const ring = interpolate(f, [L(44.9), L(47.5)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="05 / THE CLEANUP" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, display: "flex", alignItems: "center", gap: 30}}>
        <svg width={190} height={190}>
          <circle cx={95} cy={95} r={80} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={14} />
          <circle cx={95} cy={95} r={80} fill="none" stroke={C.g} strokeWidth={14} strokeLinecap="round" strokeDasharray={`${ring * 503} 503`} transform="rotate(-90 95 95)" />
          <text x={95} y={92} textAnchor="middle" fill={C.text} fontFamily="monospace" fontSize={44} fontWeight={700}>{Math.round(ring * 78)}</text>
          <text x={95} y={124} textAnchor="middle" fill={C.dim} fontFamily="monospace" fontSize={20}>min</text>
        </svg>
        <div>
          <div style={{...big(56, C.g)}}>Update pulled</div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 8}}>04:09 → 05:27 UTC</div>
        </div>
      </div>
      {/* crashed machines get fixed one at a time */}
      <div style={{position: "absolute", left: 40, right: 90, top: 600, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", rowGap: 20, opacity: out(f, L(47.81), L(48.2))}}>
        {Array.from({length: 10}).map((_, i) => <div key={i} style={{transform: "scale(.88)"}}><Monitor blue fixed={f > L(49.86) + i * 9} ry={Math.sin(f / 40 + i) * 10} /></div>)}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 930, display: "grid", gap: 12}}>
        <div style={{opacity: out(f, L(49.86), L(50.2))}}><Glass style={{padding: "14px 20px"}}><span style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>🧑‍🔧 Fixed <span style={{color: "#FFD27A"}}>by hand</span>, one by one</span></Glass></div>
        <div style={{opacity: out(f, L(52.24), L(52.6))}}><Glass style={{padding: "14px 20px"}}><span style={{fontFamily: MONO, fontSize: 30}}><span style={{color: C.g}}>1</span> boot into Safe Mode</span></Glass></div>
        <div style={{opacity: out(f, L(53.48), L(53.8))}}><Glass style={{padding: "14px 20px"}}><span style={{fontFamily: MONO, fontSize: 30}}><span style={{color: C.g}}>2</span> delete the bad file 🗑️</span></Glass></div>
      </div>
      {/* handwritten boarding pass */}
      {f > L(54.5) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1300, display: "grid", placeItems: "center", opacity: out(f, L(54.62), L(55))}}>
          <Slab w={760} h={250} d={14} rx={-10} ry={-8 + Math.sin(f / 30) * 6} color="#EEE7D6" radius={14}
            front={<div style={{width: "100%", height: "100%", display: "flex", boxSizing: "border-box"}}>
              <div style={{flex: 1, padding: "22px 28px", fontFamily: "Georgia, 'DejaVu Serif', serif", fontStyle: "italic", color: "#22324F"}}>
                <div style={{fontFamily: MONO, fontStyle: "normal", fontSize: 20, letterSpacing: "0.14em", color: "#7A6F5A"}}>BOARDING PASS · INDIA · 19 JUL</div>
                <div style={{fontSize: 46, marginTop: 14}}>{typed("Gate 14 · Seat 21A", f, L(55), 30)}</div>
                <div style={{fontSize: 30, marginTop: 10, color: "#5A4E3A"}}>written by hand ✍️</div>
              </div>
              <div style={{width: 160, borderLeft: "3px dashed #CBBFA3", display: "grid", placeItems: "center", fontSize: 60}}>✈️</div>
            </div>} />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lessons =================
const STAGES = ["1%", "10%", "50%", "100%"];
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(57.74)} size={82}>Config is code.</Reveal>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10, opacity: out(f, L(58.5), L(58.9))}}>a "small" update can be just as dangerous</div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 540, display: "grid", gap: 16}}>
        <div style={{opacity: out(f, L(61.12), L(61.5))}}><Glass glow={C.g}><span style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>🧪 Test it like code.</span></Glass></div>
        <div style={{opacity: out(f, L(62.07), L(62.4))}}><Glass glow={C.g}><span style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>🚦 Never ship to everyone at once.</span></Glass></div>
      </div>
      {/* staged rollout rings */}
      <div style={{position: "absolute", left: 64, right: 110, top: 900, opacity: out(f, L(63.77), L(64.1))}}>
        <div style={label}>STAGED ROLLOUT</div>
        <div style={{display: "flex", alignItems: "flex-end", gap: 18, marginTop: 16}}>
          {STAGES.map((s, i) => {
            const p = out(f, L(63.9) + i * 6, L(63.9) + i * 6 + 8);
            const h = 60 + i * 60;
            return (
              <div key={s} style={{flex: 1, opacity: p}}>
                <div style={{height: h * p, borderRadius: 12, background: `linear-gradient(${C.g}, ${C.g}55)`, boxShadow: `0 0 20px ${C.g}55`}} />
                <div style={{fontFamily: MONO, fontSize: 28, color: C.g, textAlign: "center", marginTop: 8}}>{s}</div>
              </div>
            );
          })}
        </div>
      </div>
      {f > L(64.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(64.91), L(65.3))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL OUTAGES, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(65), 48)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1520, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(60), L(60.4))}}>source: CrowdStrike root-cause analysis (Aug 2024)</div>
    </AbsoluteFill>
  );
};

// bottom strip: machines down
const Down: React.FC = () => {
  const f = useCurrentFrame();
  const up = f >= T(49.86);
  const v = f < T(3.75) ? 0 : 8.5;
  const col = up ? "#FFD27A" : v ? BLUE : C.dim;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}88`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: v ? (up ? "#FFD27A" : "#5B9BFF") : C.g}} />
      <span style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: C.dim}}>WINDOWS PCs</span>
      <span style={{fontFamily: MONO, fontSize: 26, fontWeight: 700, color: v ? "#5B9BFF" : C.g}}>{v ? "~8.5M crashed" : "all OK"}</span>
      <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: col}}>{up ? "fixing by hand…" : v ? "BSOD" : ""}</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Kernel, Fields, Crash, Cleanup, Lesson];
const TIN: TIn[] = ["none", "bsod", "zoom", "glitch", "none", "none"];
const TOUT: TOut[] = ["none", "zoom", "none", "shuffle", "flip", "none"];

export const DebugDiaries016: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const last = i === COMPS.length - 1;
      const b = last ? E16_TOTAL : CUTS[i + 1] + OV;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Scene len={b - a} tin={TIN[i]} tout={last ? "none" : TOUT[i]}>
            <Push len={b - a}>
              <Comp off={a} />
            </Push>
          </Scene>
        </Sequence>
      );
    })}
    <Down />
    <AbsoluteFill style={{zIndex: 20}}><Hud ep="016" total={E16_TOTAL} /></AbsoluteFill>
    <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
  </AbsoluteFill>
);
