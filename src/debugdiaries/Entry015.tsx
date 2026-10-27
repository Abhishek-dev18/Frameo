// Debug Diaries · Entry 015 "Wrong Unit" — NASA Mars Climate Orbiter (lost 23 Sep 1999).
// Facts (Mishap Investigation Board Phase I findings): ground software (Small Forces / SM_FORCES, built by the contractor,
// Lockheed Martin) produced thruster impulse in pound-force seconds; the navigation software read the Angular Momentum
// Desaturation file as newton-seconds (per the interface spec) → effect underestimated by 4.45×. Planned insertion
// altitude 226 km; final trajectory ~57 km; survival minimum ~80 km. Navigators noticed a discrepancy; concerns weren't
// acted on (TCM-5 never executed). Spacecraft ~ $125M; launched Dec 1998.
// New this episode: per-cut transitions (zoom-through, card shuffle, glitch, iris, page-flip) via transitions.tsx.
// Voice runs at 1.08×; cue times are raw-voice seconds scaled by R.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow} from "./depth";
import {Scene, OV, TIn, TOut} from "./transitions";

const R = 1.08;
const T = (s: number) => Math.round((s / R) * 30);
const CUTS = [0, 8.59, 16.26, 25.86, 39.15, 54.69].map(T);
export const E15_TOTAL = T(62.34) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const MARS = "#E0703F";
const US = "#7FA8FF";

// ---------- Mars: shaded sphere with drifting surface + atmosphere rim ----------
const Mars: React.FC<{size: number; style?: React.CSSProperties}> = ({size, style}) => {
  const f = useCurrentFrame();
  const drift = (f * 0.6) % size;
  const spots: [number, number, number][] = [[0.2, 0.3, 0.12], [0.55, 0.22, 0.07], [0.7, 0.55, 0.15], [0.35, 0.65, 0.09], [0.85, 0.3, 0.06], [0.1, 0.75, 0.08]];
  return (
    <div style={{width: size, height: size, borderRadius: "50%", position: "relative", overflow: "hidden", boxShadow: `0 0 ${size * 0.18}px ${MARS}55, inset 0 0 ${size * 0.05}px #ffb08a55`, background: `radial-gradient(circle at 35% 30%, #F4B088, ${MARS} 42%, #8A3418 72%, #3A1208)`, ...style}}>
      {[0, size].map((ox) => (
        <div key={ox} style={{position: "absolute", left: ox - drift, top: 0, width: size, height: size}}>
          {spots.map(([x, y, r], i) => <div key={i} style={{position: "absolute", left: x * size, top: y * size, width: r * size, height: r * size * 0.8, borderRadius: "50%", background: "rgba(90,30,12,.45)", boxShadow: "inset 2px 2px 4px rgba(0,0,0,.35)"}} />)}
        </div>
      ))}
      <div style={{position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle at 75% 70%, transparent 35%, rgba(0,0,0,.75) 80%)"}} />
    </div>
  );
};

// ---------- spacecraft: solid body + thin solar-panel slabs ----------
const Craft: React.FC<{ry?: number; scale?: number; burn?: number}> = ({ry = 0, scale = 1, burn = 0}) => (
  <div style={{display: "flex", alignItems: "center", transform: `scale(${scale})`, filter: burn > 0 ? `sepia(${burn}) saturate(${1 + burn * 3}) hue-rotate(-20deg) brightness(${1 + burn})` : undefined}}>
    <Slab w={150} h={56} d={6} rx={-10} ry={ry} color="#2B4A7A" radius={4} front={<div style={{width: "100%", height: "100%", backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "18px 100%"}} />} />
    <Slab w={90} h={90} d={80} rx={-10} ry={ry} color="#B8A06A" radius={8} front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 14, color: "#3a2f18"}}>MCO</div>} />
    <Slab w={150} h={56} d={6} rx={-10} ry={ry} color="#2B4A7A" radius={4} front={<div style={{width: "100%", height: "100%", backgroundImage: "linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)", backgroundSize: "18px 100%"}} />} />
  </div>
);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const travel = interpolate(f, [T(2.83), T(4.5)], [0, 1], {...clamp, easing: ease3});
  const burn = interpolate(f, [T(4.51), T(5.3)], [0, 1], clamp);
  const gone = f > T(5.5);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="NASA · 1999" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={92}>A $125 million</Reveal>
        <Reveal at={T(0.7)} size={92} style={{marginTop: 4}}>spacecraft.</Reveal>
      </div>
      <div style={{position: "absolute", right: 60, top: 760}}><Mars size={420} /></div>
      {!gone ? (
        <div style={{position: "absolute", left: 40 + travel * 470, top: 600 + travel * 300, opacity: 1 - burn * 0.6}}>
          <Craft ry={Math.sin(f / 30) * 20} scale={1 - travel * 0.35} burn={burn} />
        </div>
      ) : (
        <div style={{position: "absolute", left: 560, top: 860}}>
          {Array.from({length: 14}).map((_, i) => {
            const a = (i / 14) * Math.PI * 2, d = (f - T(5.5)) * (3 + (i % 3));
            return <div key={i} style={{position: "absolute", left: Math.cos(a) * d, top: Math.sin(a) * d, width: 10, height: 10, borderRadius: 3, background: i % 2 ? C.bug : "#FFD27A", opacity: Math.max(0, 1 - (f - T(5.5)) / 40)}} />;
          })}
        </div>
      )}
      {burn > 0 && burn < 1 ? <AbsoluteFill style={{background: C.bug, opacity: Math.sin(burn * Math.PI) * 0.4}} /> : null}
      <div style={{position: "absolute", left: 64, top: 1260, opacity: out(f, T(2.83), T(3.2))}}>
        <Glass style={{padding: "12px 20px"}}><span style={{fontFamily: MONO, fontSize: 28}}>🚀 9 months → 🔴 Mars</span></Glass>
      </div>
      {f > T(6.0) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1380, opacity: out(f, T(6.05), T(6.4))}}>
          <Glass glow={C.bug}>
            <div style={label}>THE CAUSE</div>
            <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 900, marginTop: 8}}>{f > T(6.4) ? <>One software sent the <span style={{color: C.bug}}>wrong unit.</span></> : "?"}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · the mission =================
const Mission: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const p = interpolate(f, [L(9.9), L(16.2)], [0.05, 0.9], clamp);
  // quadratic path Earth (120,700) → Mars (860,380)
  const bx = (t: number) => (1 - t) ** 2 * 120 + 2 * (1 - t) * t * 420 + t * t * 860;
  const by = (t: number) => (1 - t) ** 2 * 700 + 2 * (1 - t) * t * 120 + t * t * 380;
  const firing = f > L(12.18) && Math.floor((f - L(12.18)) / 12) % 2 === 0;
  const fires = f > L(12.18) ? Math.min(9, Math.floor((f - L(12.18)) / 12) + 1) : 0;
  return (
    <AbsoluteFill>
      <Section text="02 / THE MISSION" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(8.63)} size={76}>Mars Climate Orbiter</Reveal>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.dim, marginTop: 10, opacity: out(f, L(9.92), L(10.3))}}>launched · December 1998</div>
      </div>
      <div style={{position: "absolute", left: 40, top: 560, width: 1000, height: 820}}>
        <svg width={1000} height={820} style={{position: "absolute", inset: 0}}>
          <path d="M120 700 Q420 120 860 380" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth={3} strokeDasharray="10 12" />
        </svg>
        <div style={{position: "absolute", left: 60, top: 640, width: 120, height: 120, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%, #9fd2ff, #2b6cb0 55%, #0b2747)", boxShadow: "0 0 40px #2b6cb066"}} />
        <div style={{position: "absolute", left: 780, top: 300}}><Mars size={170} /></div>
        <div style={{position: "absolute", left: bx(p) - 110, top: by(p) - 40, transform: "scale(.5)"}}>
          <Craft ry={Math.sin(f / 25) * 25} />
          {firing ? <div style={{position: "absolute", left: 180, top: 110, width: 60, height: 60, borderRadius: "50%", background: "radial-gradient(circle, #fff, #FFD27A 40%, transparent 70%)"}} /> : null}
        </div>
      </div>
      {f > L(12) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1380, opacity: out(f, L(12.18), L(12.5))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontSize: 46}}>🔥</span>
            <div style={{flex: 1}}>
              <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>Small thruster firings</div>
              <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 4}}>{f > L(14.81) ? "to stay on course" : "again and again"}</div>
            </div>
            <span style={{fontFamily: MONO, fontSize: 40, color: "#FFD27A"}}>×{fires}</span>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// a software "machine" card: solid slab with a readout
const SoftCard: React.FC<{who: string; name: string; value: string; unit: string; tint: string; ry: number; on: boolean}> = ({who, name, value, unit, tint, ry, on}) => (
  <div style={{display: "grid", placeItems: "center"}}>
    <Slab w={420} h={330} d={70} rx={-8} ry={ry} color="#202329" glow={on ? tint : undefined} radius={26}
      front={<div style={{width: "100%", height: "100%", padding: "26px 28px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div>
          <div style={{...label, color: tint}}>{who}</div>
          <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 800, marginTop: 6}}>{name}</div>
        </div>
        <div style={{padding: "14px 18px", borderRadius: 14, background: "#121418", border: `1.5px solid ${tint}55`}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>impulse</div>
          <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, color: C.text}}>{value} <span style={{color: tint}}>{on ? unit : ""}</span></div>
        </div>
      </div>} />
    <Shadow w={420} style={{marginTop: 20}} />
  </div>
);

// ================= 3 · software 1 (ground) =================
const Ground: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="03 / SOFTWARE #1" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(16.3)} size={66}>On the ground, software</Reveal>
        <Reveal at={L(17.2)} size={66} color={C.dim} style={{marginTop: 4}}>measured every firing.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 600, opacity: out(f, L(18.35), L(18.8))}}>
        <SoftCard who="GROUND · LOCKHEED MARTIN" name={f > L(20.6) ? "Small Forces software" : "…"} value="1.00" unit="lbf·s" tint={US} ry={Math.sin(f / 35) * 14 + 10} on={f > L(23.86)} />
      </div>
      {f > L(23.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1110, opacity: out(f, L(23.86), L(24.2))}}>
          <Glass glow={US} style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontSize: 50}}>🇺🇸</span>
            <div>
              <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 900, color: US}}>pound-force</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 4}}>{f > L(24.72) ? "American (imperial) unit" : " "}</div>
            </div>
          </Glass>
        </div>
      ) : null}
      {f > L(22.5) ? <div style={{position: "absolute", left: 64, right: 110, top: 1350, fontFamily: MONO, fontSize: 26, color: C.dim, opacity: out(f, L(22.6), L(23))}}>→ writes the numbers to a file for navigation 📄</div> : null}
    </AbsoluteFill>
  );
};

// ================= 4 · software 2 (navigation) =================
const Nav: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const tilt = interpolate(f, [L(31.45), L(33.4)], [0, -14], {...clamp, easing: Easing.out(Easing.back(1.4))});
  return (
    <AbsoluteFill>
      <Section text="04 / SOFTWARE #2" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(25.9)} size={56}>NASA's navigation read</Reveal>
        <Reveal at={L(28.16)} size={56} color={C.g} style={{marginTop: 4}}>the same numbers as newtons.</Reveal>
      </div>
      {/* face-off: same value, two meanings */}
      <div style={{position: "absolute", left: 20, right: 60, top: 570, display: "flex", justifyContent: "space-between", transform: "scale(.78)", transformOrigin: "50% 0"}}>
        <SoftCard who="GROUND" name="sends" value="1.00" unit="lbf·s" tint={US} ry={18 + Math.sin(f / 35) * 6} on />
        <div style={{alignSelf: "center", ...big(100, C.bug), opacity: out(f, L(30), L(30.4))}}>≠</div>
        <SoftCard who="NASA NAV" name="reads" value="1.00" unit="N·s" tint={C.g} ry={-18 + Math.sin(f / 35) * 6} on={f > L(28.16)} />
      </div>
      {/* the 4.45 balance */}
      <div style={{position: "absolute", left: 64, right: 110, top: 1020, opacity: out(f, L(31.3), L(31.7))}}>
        <Glass>
          <div style={label}>THE CONVERSION THEY MISSED</div>
          <div style={{position: "relative", height: 150, marginTop: 10}}>
            <div style={{position: "absolute", left: "50%", top: 30, width: 0, height: 110, borderLeft: "4px solid rgba(255,255,255,.3)"}} />
            <div style={{position: "absolute", left: "8%", right: "8%", top: 30, height: 6, borderRadius: 3, background: "#C9CED6", transform: `rotate(${tilt}deg)`}}>
              <div style={{position: "absolute", left: -10, top: 10, fontFamily: MONO, fontSize: 34, color: US}}>1 lbf</div>
              <div style={{position: "absolute", right: -10, top: 10, fontFamily: MONO, fontSize: 34, color: C.g}}>= 4.45 N</div>
            </div>
          </div>
        </Glass>
      </div>
      {f > L(35) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(35.22), L(35.6))}}>
          <Glass glow={C.bug}>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800}}>Every firing's effect: <Marker at={L(36.9)} color={C.bug}><span style={{color: C.bug}}>4.45× too small</span></Marker></div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the drift =================
const Drift: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const dev = interpolate(f, [L(39.19), L(48.6)], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const alt = Math.round(interpolate(f, [L(46.48), L(48.54) + 20], [226, 57], {...clamp, easing: ease3}));
  const lost = f >= L(52.9);
  // Mars centre (540, 1500) r=330; planned path skims at 226km, actual dips lower as dev grows
  const path = (depth: number) => `M -40 760 Q 540 ${1060 + depth} 1120 760`;
  return (
    <AbsoluteFill>
      <Section text="05 / THE DRIFT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(39.19)} size={66}>Month after month,</Reveal>
        <Reveal at={L(40.1)} size={66} color={C.bug} style={{marginTop: 4}}>the error added up.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920}}>
        <div style={{position: "absolute", left: 210, top: 1170}}><Mars size={660} /></div>
        <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
          <path d={path(0)} fill="none" stroke={C.g} strokeWidth={4} strokeDasharray="12 12" opacity={0.8} />
          <path d={path(dev * 150)} fill="none" stroke={C.bug} strokeWidth={6} style={{filter: `drop-shadow(0 0 10px ${C.bug})`}} />
          <text x={800} y={1010} fill={C.g} fontFamily="monospace" fontSize={26}>– – planned</text>
          <text x={800} y={1056} fill={C.bug} fontFamily="monospace" fontSize={26} opacity={dev > 0.2 ? 1 : 0}>—— actual</text>
        </svg>
      </div>
      {f > L(41) && f < L(46.4) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 520, opacity: out(f, L(41.08), L(41.4))}}>
          <Glass glow="#FFD27A">
            <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>⚠️ Navigators noticed something off…</div>
            <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 6}}>{f > L(42.93) ? "…but it wasn't acted on." : " "}</div>
          </Glass>
        </div>
      ) : null}
      {f > L(46.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 520, opacity: out(f, L(46.48), L(46.8))}}>
          <Glass glow={alt < 80 ? C.bug : undefined}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
              <div>
                <div style={label}>CLOSEST APPROACH</div>
                <div style={{...big(110, alt < 80 ? C.bug : C.text), marginTop: 6}}>{alt} km</div>
              </div>
              <div style={{fontFamily: MONO, fontSize: 22, textAlign: "right", lineHeight: 1.6}}>
                <div style={{color: C.g}}>planned 226 km</div>
                <div style={{color: f > L(50.9) ? C.bug : C.dim}}>survival min 80 km</div>
              </div>
            </div>
            <div style={{position: "relative", height: 14, marginTop: 14, borderRadius: 7, background: "rgba(255,255,255,.08)"}}>
              <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${(alt / 226) * 100}%`, borderRadius: 7, background: alt < 80 ? C.bug : C.g}} />
              <div style={{position: "absolute", left: `${(80 / 226) * 100}%`, top: -8, bottom: -8, width: 3, background: f > L(50.9) ? C.bug : "rgba(255,255,255,.5)"}} />
            </div>
          </Glass>
        </div>
      ) : null}
      {lost ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 900, opacity: out(f, L(52.9), L(53.2))}}>
          <Glass glow={C.bug}>
            <div style={{...label, color: C.bug}}>23 SEP 1999 · LOSS OF SIGNAL</div>
            <svg width={900} height={80} style={{marginTop: 10}}>
              <path d={`M0 40 L180 40 L210 10 L240 70 L270 40 L${Math.min(900, 300 + (f - L(52.9)) * 30)} 40`} fill="none" stroke={C.bug} strokeWidth={4} />
            </svg>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lessons =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(54.73)} size={92} color={C.g}>The lessons.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 480, opacity: out(f, L(55.42), L(55.8)), transform: `perspective(900px) rotateX(${(1 - out(f, L(55.42), L(55.8))) * 60}deg)`, transformOrigin: "50% 0"}}>
        <Glass glow={C.g}>
          <div style={{...label, color: C.g}}>LESSON 1</div>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 6}}>Every number carries its unit.</div>
          <div style={{fontFamily: MONO, fontSize: 30, marginTop: 14}}><span style={{color: C.dim, textDecoration: "line-through"}}>impulse = 1.00</span>  <span style={{color: C.g}}>impulse = 1.00 N·s</span></div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 780, opacity: out(f, L(57.09), L(57.5)), transform: `perspective(900px) rotateX(${(1 - out(f, L(57.09), L(57.5))) * 60}deg)`, transformOrigin: "50% 0"}}>
        <Glass glow={C.g}>
          <div style={{...label, color: C.g}}>LESSON 2</div>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 6}}>Test the interface between systems.</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10}}>ground → 📄 → navigation ✓</div>
        </Glass>
      </div>
      {f > L(59.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1080, opacity: out(f, L(60.15), L(60.5))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL BUGS, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(60.2), 46)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1300, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(57), L(57.4))}}>source: NASA Mars Climate Orbiter Mishap Investigation Board (1999)</div>
    </AbsoluteFill>
  );
};

// bottom units-check strip
const Units: React.FC = () => {
  const f = useCurrentFrame();
  const g = f >= T(23.86), n = f >= T(28.16);
  const clash = g && n;
  const col = clash ? C.bug : C.dim;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <span style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: C.dim}}>UNITS CHECK</span>
      <span style={{fontFamily: MONO, fontSize: 24, color: g ? US : C.dim}}>ground: {g ? "lbf·s" : "—"}</span>
      <span style={{fontFamily: MONO, fontSize: 24, color: n ? C.g : C.dim}}>nav: {n ? "N·s" : "—"}</span>
      <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 26, fontWeight: 700, color: col}}>{clash ? "✕ MISMATCH" : "…"}</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Mission, Ground, Nav, Drift, Lesson];
// per-scene entrance/exit pairing for the five cuts
const TIN: TIn[] = ["none", "zoom", "none", "glitch", "iris", "none"];
const TOUT: TOut[] = ["zoom", "shuffle", "none", "none", "flip", "none"];

export const DebugDiaries015: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const last = i === COMPS.length - 1;
      const b = last ? E15_TOTAL : CUTS[i + 1] + OV;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Scene len={b - a} tin={TIN[i]} tout={last ? "none" : TOUT[i]} ix={540} iy={1500}>
            <Push len={b - a}>
              <Comp off={a} />
            </Push>
          </Scene>
        </Sequence>
      );
    })}
    <Units />
    <AbsoluteFill style={{zIndex: 20}}><Hud ep="015" total={E15_TOTAL} /></AbsoluteFill>
    <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
  </AbsoluteFill>
);
