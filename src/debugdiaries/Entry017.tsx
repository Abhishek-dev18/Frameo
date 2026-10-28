// Debug Diaries · Entry 017 "37 Seconds" — Ariane 5 Flight 501, 4 June 1996.
// Facts (Inquiry Board report, 19 Jul 1996): veered ~37 s after H0, broke up ~39 s, self-destruct at ~4 km altitude.
// SRI (inertial reference) software reused from Ariane 4; Operand Error converting a 64-bit float (horizontal bias, BH)
// to a 16-bit signed integer — Ariane 5's faster horizontal velocity pushed BH out of range. Backup SRI 1 failed the
// same way 72 ms earlier. SRI 2's diagnostic pattern was read by the on-board computer as flight data → full nozzle
// deflection → angle of attack > 20° → aerodynamic breakup. The failing alignment function served no purpose after
// liftoff on Ariane 5 (Ariane 4 leftover, ran ~40 s into flight). Payload: four Cluster satellites.
// Toolkit: real WebGL 3D (rocket3d.tsx via @remotion/three), official TransitionSeries (clock-wipe, slide, wipe, iris)
// + custom glitch presentation, light-leak overlay (@remotion/effects), CameraMotionBlur. Render with --gl=angle.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, useVideoConfig, Easing, Solid, random} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {TransitionSeries, linearTiming, springTiming, TransitionPresentationComponentProps} from "@remotion/transitions";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {iris} from "@remotion/transitions/iris";
import {lightLeak} from "@remotion/effects/light-leak";
import {CameraMotionBlur} from "@remotion/motion-blur";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip} from "./glass";
import {Slab, Shadow} from "./depth";
import {Rocket, Pad, Smoke, Explosion, Stars, SkyLights} from "./rocket3d";

const R = 1.08;
const T = (s: number) => Math.round((s / R) * 30);
const CUTS = [0, 10.74, 18.76, 33.99, 41.51, 55.58].map(T);
export const E17_TOTAL = T(64.37) + 12;
const TR = 14;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const AMBER = "#FFD27A";

// ---------- custom glitch presentation for TransitionSeries ----------
const GlitchPres: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress: p}) => {
  const f = useCurrentFrame();
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = 1 - p;
  const s = 14 * k + 1;
  return (
    <AbsoluteFill style={{opacity: p < 0.15 ? p / 0.15 : 1}}>
      <AbsoluteFill style={{transform: `translateX(${(random(`gj${f}`) - 0.5) * 70 * k}px)`, filter: `drop-shadow(${s}px 0 0 rgba(255,40,90,.85)) drop-shadow(${-s}px 0 0 rgba(40,255,220,.85))`}}>{children}</AbsoluteFill>
      {k > 0.1 ? Array.from({length: 7}).map((_, i) => (
        <div key={i} style={{position: "absolute", left: 0, right: 0, top: random(`gy${f}-${i}`) * 1920, height: 8 + random(`gh${f}-${i}`) * 60, background: i % 2 ? "rgba(255,40,90,.35)" : "rgba(40,255,220,.3)", transform: `translateX(${(random(`gx${f}-${i}`) - 0.5) * 220}px)`, mixBlendMode: "screen"}} />
      )) : null}
    </AbsoluteFill>
  );
};

// light leak (WebGL2) — used standalone at the self-destruct
const Leak: React.FC<{hue?: number; seed?: number}> = ({hue = 0, seed = 2}) => {
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  return <Solid width={width} height={height} effects={[lightLeak({seed, hueShift: hue, progress: interpolate(f, [0, durationInFrames - 1], [0, 1], clamp)})]} />;
};

// ================= 1 · hook: launch → 37 s → breakup =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const thrust = interpolate(f, [T(1.4), T(2.2)], [0, 1], clamp);
  const alt = interpolate(f, [T(2.29), T(5.79)], [0, 5.2], {...clamp, easing: Easing.in(Easing.quad)});
  const veer = interpolate(f, [T(4.38), T(5.75)], [0, 1.05], {...clamp, easing: Easing.in(Easing.quad)});
  const gim = interpolate(f, [T(4.2), T(4.6)], [0, 0.5], clamp);
  const brk = interpolate(f, [T(5.79), T(6.8)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const boom = interpolate(f, [T(5.79), T(7.6)], [0, 1], clamp);
  const smokeT = (f - T(1.6)) / 30;
  return (
    <AbsoluteFill>
      <GlassBg />
      <AbsoluteFill style={{top: 470}}>
        <ThreeCanvas width={width} height={1150} camera={{position: [0, 2.6, 11], fov: 42}}>
          <SkyLights />
          <Stars />
          <group position={[0, -alt * 0.9, 0]}>
            <Pad />
            <Smoke t={smokeT} />
          </group>
          <group position={[0, alt * 0.35 + 0.2, 0]}>
            <group position={[0, 2.2, 0]} rotation={[0, 0.5, -veer]}>
              <group position={[0, -2.2, 0]}>
                <Rocket thrust={thrust} gimbal={gim} brk={brk} />
              </group>
              <Explosion p={boom} />
            </group>
          </group>
        </ThreeCanvas>
      </AbsoluteFill>
      {/* self-destruct light leak */}
      <Sequence from={T(5.79)} durationInFrames={34} layout="none"><AbsoluteFill style={{mixBlendMode: "screen"}}><Leak hue={10} seed={4} /></AbsoluteFill></Sequence>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="4 JUNE 1996 · ARIANE 5 · FLIGHT 501" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={-15} size={150} color={f > T(5.79) ? C.bug : C.text}>37 seconds.</Reveal>
      </div>
      {f > T(6.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1240, display: "flex", gap: 12, opacity: out(f, T(6.81), T(7.2))}}>
          {[0, 1, 2, 3].map((i) => <Glass key={i} style={{flex: 1, textAlign: "center", padding: "14px 6px"}}><div style={{fontSize: 52, filter: "grayscale(.4)"}}>🛰️</div><div style={{fontFamily: MONO, fontSize: 18, color: C.bug, marginTop: 4}}>LOST</div></Glass>)}
        </div>
      ) : null}
      {f > T(8.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1440, opacity: out(f, T(8.22), T(8.6))}}>
          <Glass glow={C.bug} style={{display: "flex", alignItems: "center", gap: 90}}>
            <div style={{position: "relative", flex: "0 0 120px", width: 120, height: 70, borderRadius: 10, border: `3px solid ${C.dim}`}}>
              <div style={{position: "absolute", left: 6, top: 10, height: 44, width: interpolate(f, [T(8.7), T(9.6)], [40, 168], clamp), borderRadius: 8, background: C.bug, boxShadow: `0 0 18px ${C.bug}`}} />
            </div>
            <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 900}}>{f > T(9.4) ? <>One number <span style={{color: C.bug}}>didn't fit its box.</span></> : "Why?"}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · reused code: Ariane 4 → Ariane 5 =================
const Reuse: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const L = (s: number) => T(s) - off;
  const fly = interpolate(f, [L(13.6), L(15.4)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="02 / REUSED CODE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(10.78)} size={70}>The navigation software</Reveal>
        <Reveal at={L(11.8)} size={70} color={AMBER} style={{marginTop: 4}}>wasn't new.</Reveal>
      </div>
      <AbsoluteFill style={{top: 560}}>
        <ThreeCanvas width={width} height={900} camera={{position: [0, 2.0, 10], fov: 38}}>
          <SkyLights />
          <group position={[-2.1, -0.4, 0]} rotation={[0, f * 0.012, 0]}><Rocket scale={0.72} /></group>
          <group position={[2.1, -0.6, 0]} rotation={[0, -f * 0.012, 0]}><Rocket scale={1} /></group>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.05, 0]}><circleGeometry args={[7, 48]} /><meshStandardMaterial color="#17181C" /></mesh>
        </ThreeCanvas>
      </AbsoluteFill>
      <div style={{position: "absolute", left: 90, top: 1450, width: 380, textAlign: "center"}}>
        <div style={{...big(48, C.text)}}>ARIANE 4</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.g, marginTop: 6, opacity: out(f, L(16.32), L(16.7))}}>flew for years ✓</div>
      </div>
      <div style={{position: "absolute", right: 120, top: 1450, width: 380, textAlign: "center"}}>
        <div style={{...big(48, AMBER)}}>ARIANE 5</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 6}}>new · bigger · faster</div>
      </div>
      {/* the software module being copied across, motion-blurred */}
      {f > L(13.1) ? (
        <CameraMotionBlur shutterAngle={200} samples={8}>
          <SoftChip p={fly} off={off} />
        </CameraMotionBlur>
      ) : null}
    </AbsoluteFill>
  );
};
const SoftChip: React.FC<{p: number; off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const p = interpolate(f, [L(13.6), L(15.4)], [0, 1], {...clamp, easing: ease3});
  const x = 120 + p * 520, y = 820 - Math.sin(p * Math.PI) * 220;
  return (
    <div style={{position: "absolute", left: x, top: y, opacity: out(f, L(13.23), L(13.6))}}>
      <Glass glow={AMBER} style={{padding: "14px 20px"}}>
        <div style={{...label, color: AMBER}}>SRI SOFTWARE</div>
        <div style={{fontFamily: MONO, fontSize: 26, marginTop: 4}}>{p < 1 ? "copying…" : "copied ✓"}</div>
      </Glass>
    </div>
  );
};

// ================= 3 · the bug: 64-bit into 16-bit =================
const BAR_X = 64;
const Bug: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="03 / THE BUG" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(18.8)} size={62}>One number: horizontal speed</Reveal>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 10, opacity: out(f, L(19.6), L(20))}}>variable "BH" · horizontal bias</div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 520, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16}}>
        <div style={{opacity: out(f, L(22.1), L(22.5))}}><Glass><div style={label}>FROM</div><div style={{...big(56, AMBER), marginTop: 6}}>64-bit</div><div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>floating point</div></Glass></div>
        <div style={{opacity: out(f, L(23.53), L(23.9))}}><Glass><div style={label}>INTO</div><div style={{...big(56, C.text), marginTop: 6}}>16-bit</div><div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>integer · max 32,767</div></Glass></div>
      </div>
      {/* Ariane 4 run: small value fits */}
      <Lane off={off} y={820} name="ARIANE 4 · slower" at={L(25.3)} len={260} ok />
      {/* Ariane 5 run: value too large → slam */}
      {f > L(28) ? (
        <CameraMotionBlur shutterAngle={220} samples={8}>
          <Lane off={off} y={1100} name="ARIANE 5 · much faster" at={L(28.14)} len={760} />
        </CameraMotionBlur>
      ) : null}
      {f > L(32.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1390, opacity: out(f, L(32.82), L(33.1))}}>
          <Glass glow={C.bug} style={{display: "flex", alignItems: "center", gap: 18}}>
            <span style={{fontSize: 52}}>💥</span>
            <div><div style={{...label, color: C.bug}}>CONVERSION FAILED</div><div style={{fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.bug, marginTop: 4}}>OPERAND ERROR</div></div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, top: 1590, fontFamily: MONO, fontSize: 18, color: C.dim}}>bar lengths illustrative</div>
    </AbsoluteFill>
  );
};
// one "run": a 64-bit value bar slides into a 16-bit box
const Lane: React.FC<{off: number; y: number; name: string; at: number; len: number; ok?: boolean}> = ({y, name, at, len, ok}) => {
  const f = useCurrentFrame();
  const BOX = 380;
  const grow = interpolate(f, [at, at + 30], [60, len], {...clamp, easing: Easing.out(Easing.cubic)});
  const slide = interpolate(f, [at + 34, at + 52], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  const hit = !ok && slide >= 1;
  const shake = hit ? Math.sin(f * 2.3) * Math.max(0, 10 - (f - at - 52)) : 0;
  const boxL = 560;
  const barL = BAR_X + slide * (boxL + 10 - BAR_X);
  return (
    <div style={{position: "absolute", left: 0, right: 0, top: y, height: 220, opacity: out(f, at, at + 8)}}>
      <div style={{position: "absolute", left: 64, top: 0, fontFamily: MONO, fontSize: 24, color: ok ? C.g : AMBER}}>{name}</div>
      {/* the 16-bit box */}
      <div style={{position: "absolute", left: boxL, top: 50, width: BOX, height: 120, borderRadius: 18, border: `4px solid ${hit ? C.bug : ok && slide >= 1 ? C.g : "rgba(255,255,255,.35)"}`, transform: `translateX(${shake}px)`, boxShadow: hit ? `0 0 40px ${C.bug}88` : ok && slide >= 1 ? `0 0 30px ${C.g}66` : "none"}}>
        <div style={{position: "absolute", right: 12, top: -34, fontFamily: MONO, fontSize: 20, color: C.dim}}>16-bit box</div>
        {hit ? <svg width={BOX} height={120} style={{position: "absolute", inset: 0}}><path d="M40 0 L80 50 L60 70 L110 120 M260 0 L240 40 L290 80 L270 120" stroke={C.bug} strokeWidth={5} fill="none" /></svg> : null}
      </div>
      {/* the value bar (solid slab) */}
      <div style={{position: "absolute", left: barL, top: 62, transform: `translateX(${hit ? -12 : 0}px)`}}>
        <Slab w={Math.round(grow)} h={96} d={40} rx={-12} ry={-6} color={ok ? "#1E3326" : "#3A2418"} glow={ok ? C.g : hit ? C.bug : AMBER} radius={12}
          front={<div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", paddingLeft: 18, fontFamily: MONO, fontSize: 26, color: ok ? C.g : AMBER, whiteSpace: "nowrap", overflow: "hidden"}}>{ok ? "BH ✓ fits" : "BH ↑ too big"}</div>} />
      </div>
    </div>
  );
};

// ================= 4 · the backup =================
const Computer: React.FC<{name: string; role: string; dead: boolean; ry: number}> = ({name, role, dead, ry}) => (
  <div style={{display: "grid", placeItems: "center"}}>
    <Slab w={400} h={340} d={110} rx={-10} ry={ry} color={dead ? "#2E1B1B" : "#22262C"} glow={dead ? C.bug : C.g} radius={22}
      front={<div style={{width: "100%", height: "100%", padding: "24px 26px", boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
        <div>
          <div style={{...label, color: dead ? C.bug : C.g}}>{role}</div>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, marginTop: 6}}>{name}</div>
        </div>
        <div style={{padding: "10px 14px", borderRadius: 12, background: "#121418", fontFamily: MONO, fontSize: 22, color: AMBER}}>same software</div>
        <div style={{fontFamily: MONO, fontSize: 34, fontWeight: 700, color: dead ? C.bug : C.g}}>{dead ? "✕ STOPPED" : "● RUNNING"}</div>
      </div>} />
    <Shadow w={400} style={{marginTop: 20}} />
  </div>
);
const Backup: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const d1 = f >= L(37.6);
  const ms = Math.round(interpolate(f, [L(39.66), L(40.8)], [0, 72], clamp));
  const d2 = f >= L(40.8);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="04 / THE BACKUP" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(34.03)} size={70}>There was a backup…</Reveal>
        <Reveal at={L(36.58)} size={70} color={C.bug} style={{marginTop: 4}}>running the same code.</Reveal>
      </div>
      <div style={{position: "absolute", left: 20, right: 60, top: 600, display: "flex", justifyContent: "space-between", transform: "scale(.86)", transformOrigin: "50% 0"}}>
        <Computer name="SRI 1" role="BACKUP" dead={d1} ry={16 + Math.sin(f / 40) * 6} />
        <Computer name="SRI 2" role="ACTIVE" dead={d2} ry={-16 + Math.sin(f / 40) * 6} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1130, opacity: out(f, L(39.5), L(39.9))}}>
        <Glass glow={C.bug} style={{display: "flex", alignItems: "center", gap: 26}}>
          <div style={{...big(96, C.bug), width: 330, whiteSpace: "nowrap"}}>{ms} ms</div>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>Backup died first,<br /><span style={{color: C.dim}}>then the active one.</span></div>
        </Glass>
      </div>
      {d2 ? <div style={{position: "absolute", left: 64, right: 110, top: 1430, ...big(60, C.bug), opacity: out(f, L(40.9), L(41.2))}}>No navigation left.</div> : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the breakup (replay) =================
const Breakup: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {width} = useVideoConfig();
  const L = (s: number) => T(s) - off;
  const gim = interpolate(f, [L(46.18), L(46.9)], [0, 0.62], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const veer = interpolate(f, [L(47.63), L(49)], [0.12, 1.25], {...clamp, easing: Easing.in(Easing.quad)});
  const brk = interpolate(f, [L(49.4), L(50.4)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shake = f > L(48.68) && f < L(50.1) ? Math.sin(f * 2.7) * 0.06 : 0;
  const boom = interpolate(f, [L(50.09), L(51.8)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="05 / THE BREAKUP" />
      <AbsoluteFill style={{top: 380}}>
        <ThreeCanvas width={width} height={1150} camera={{position: [0, 2.2, 9.5], fov: 44}}>
          <SkyLights />
          <Stars n={900} />
          <group position={[shake, 0.2, 0]} rotation={[0, 0.4, -veer]}>
            <group position={[0, -2.2, 0]}>
              <Rocket thrust={1} gimbal={gim} brk={brk} />
            </group>
            <Explosion p={boom} />
          </group>
        </ThreeCanvas>
      </AbsoluteFill>
      <Sequence from={L(50.09)} durationInFrames={36} layout="none"><AbsoluteFill style={{mixBlendMode: "screen"}}><Leak hue={0} seed={7} /></AbsoluteFill></Sequence>
      <div style={{position: "absolute", left: 64, right: 110, top: 320, display: "grid", gap: 12}}>
        <div style={{opacity: out(f, L(41.55), L(41.9))}}><Glass style={{padding: "14px 20px"}}><span style={{fontFamily: MONO, fontSize: 28}}>SRI 2 → <span style={{color: C.bug}}>error/diagnostic data</span></span></Glass></div>
        <div style={{opacity: out(f, L(43.69), L(44))}}><Glass glow={C.bug} style={{padding: "14px 20px"}}><span style={{fontFamily: MONO, fontSize: 28}}>on-board computer: <span style={{color: C.bug}}>"that's flight data" ✕</span></span></Glass></div>
      </div>
      {f > L(46) && f < L(51.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1420, ...big(58, C.bug), opacity: out(f, L(46.18), L(46.5))}}>
          {f < L(47.6) ? "Nozzles: full deflection" : f < L(50) ? "Angle of attack > 20°" : "Self-destruct."}
        </div>
      ) : null}
      {f > L(51.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1290, opacity: out(f, L(51.7), L(52))}}>
          <Glass glow={AMBER}>
            <div style={{...label, color: AMBER}}>THE IRONY</div>
            <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, marginTop: 8, lineHeight: 1.2}}>{f > L(52.75) ? <>The code that crashed <Marker at={L(54.2)} color={AMBER}>wasn't needed after liftoff.</Marker></> : "…"}</div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 8}}>{f > L(54.09) ? "an Ariane 4 leftover, still running ~40 s into flight" : " "}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lesson =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(56.27)} size={74}>Old code, new place?</Reveal>
        <Reveal at={L(57.87)} size={74} color={C.g} style={{marginTop: 4}}>Test it again.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560, display: "grid", gap: 12}}>
        {[["faster rocket", 58.3], ["new trajectory", 58.8], ["bigger numbers", 59.3]].map(([t, at]) => (
          <div key={t as string} style={{opacity: out(f, L(at as number), L(at as number) + 8)}}><Glass style={{padding: "14px 20px"}}><span style={{fontFamily: MONO, fontSize: 30}}><span style={{color: C.g}}>✓</span> re-check: {t}</span></Glass></div>
        ))}
      </div>
      {f > L(59.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 890, opacity: out(f, L(59.99), L(60.4))}}>
          <Slab w={906} h={220} d={60} rx={-8} ry={Math.sin(f / 40) * 6} color="#22262C" glow={C.bug} radius={24}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
              <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 900, lineHeight: 1.25}}>"It worked before"<br /><span style={{color: C.bug}}>{f > L(61.27) ? "≠ it works now." : ""}</span></div>
            </div>} />
        </div>
      ) : null}
      {f > L(62.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1200, opacity: out(f, L(63.07), L(63.4))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL BUGS, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(63.1), 50)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1440, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(58), L(58.4))}}>source: Ariane 5 Flight 501 Inquiry Board report (Jul 1996)</div>
    </AbsoluteFill>
  );
};

// bottom mission clock
const Clock: React.FC = () => {
  const f = useCurrentFrame();
  const lost = (f >= T(5.79) && f < T(41.55)) || f >= T(50.09);
  const replay = f >= T(41.55) && f < T(50.09);
  let tp: number;
  if (f < T(2.29)) tp = -3 + (f / T(2.29)) * 3;
  else if (f < T(4.38)) tp = interpolate(f, [T(2.29), T(4.38)], [0, 37]);
  else if (f < T(5.79)) tp = interpolate(f, [T(4.38), T(5.79)], [37, 39]);
  else if (replay) tp = interpolate(f, [T(41.55), T(50.09)], [36.7, 39]);
  else tp = 39;
  const altKm = Math.max(0, (tp / 39) ** 2 * 4);
  const col = lost ? C.bug : C.g;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <span style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.1em", color: C.dim}}>{replay ? "REPLAY" : "FLIGHT 501"}</span>
      <span style={{fontFamily: MONO, fontSize: 30, fontWeight: 700, color: col}}>T{tp < 0 ? "−" : "+"}{Math.abs(tp).toFixed(1).padStart(4, "0")}s</span>
      <span style={{fontFamily: MONO, fontSize: 22, color: C.dim}}>alt ~{altKm.toFixed(1)} km</span>
      <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: col}}>{lost ? "VEHICLE LOST" : tp < 0 ? "COUNTDOWN" : "NOMINAL"}</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Reuse, Bug, Backup, Breakup, Lesson];

export const DebugDiaries017: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : E17_TOTAL - CUTS[i]));
  const pres = [
    clockWipe({width: 1080, height: 1920}),
    slide({direction: "from-right"}),
    {component: GlitchPres, props: {}},
    wipe({direction: "from-top-left"}),
    iris({width: 1080, height: 1920}),
  ];
  return (
    <AbsoluteFill style={{background: "#121316", color: C.text}}>
      <TransitionSeries>
        {COMPS.map((Comp, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}>
              <Comp off={CUTS[i]} />
            </TransitionSeries.Sequence>
            {i + 1 < COMPS.length ? (
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 1 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Clock />
      <AbsoluteFill style={{zIndex: 20}}><Hud ep="017" total={E17_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
