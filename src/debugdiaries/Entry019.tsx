// Debug Diaries · Entry 019 "The ID that changed" — a troubleshooting story:
// symptom (404 on an order that exists) → reproduce (works locally: tiny IDs) → logs (sent vs requested ID differ,
// last digits became zeros) → root cause → fix → lesson.
// The bug: 64-bit integer IDs (snowflake-style) sent as JSON numbers; JavaScript's Number is an IEEE-754 double, exact
// only up to 2^53 − 1 (Number.MAX_SAFE_INTEGER = 9007199254740991), so JSON.parse rounds big IDs. Verified in Node:
// JSON.parse('{"id": 1849203776441237507}').id → 1849203776441237500; Number.isSafeInteger(...) → false;
// JSON.parse('{"id": "1849203776441237507"}').id → "1849203776441237507". Fix: serialize IDs as strings, never Number() them.
// IDs, routes and log lines on screen are illustrative.
// Voice: scripts/audio/sarvam_tts.py (shubh_enhi_ads, bulbul:v4-flash, pace 1.1), pauses tightened to ≤0.18s.
// Phrase starts (s): P1 0.06 · 2.26 screen par · 4.41 database · 5.63 payment · 6.62 404
//   P2 7.77 local · 10.26 koi error · 10.92 local DB chhote IDs · 12.89 ek do teen
//   P3 13.98 logs · 14.89 backend ne bheji · 16.2 app ne maangi · 17.84 alag · 18.59 digits same · 20.16 zero
//   P4 22.32 root cause · 23.16 64-bit · 24.71 JS Number · 25.62 53 bits · 28.26 JSON parse · 30.01 round · 31.5 galat order
//   P5 33.99 fix · 34.73 string · 36.68 backend serialize · 38.75 frontend
//   P6 40.58 ID naam hai · 42.6 math · 43.84 string rakho · 44.94 follow (ends 46.54)
// Toolkit: official TransitionSeries (fade, glitch, clock-wipe, slide, flip), CSS-3D Slabs, light leak. No shaders/WebGL.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {fade} from "@remotion/transitions/fade";
import {flip} from "@remotion/transitions/flip";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip} from "./glass";
import {Slab, Shadow} from "./depth";
import {glitch, Leak} from "./tseries";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 7.73, 13.94, 22.28, 33.95, 40.54].map(T);
export const E19_TOTAL = T(46.54) + 12;
const TR = 16;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const AMBER = "#FFD27A";
const BLUE = "#7FA8FF";

const Code: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 30}) => <div style={{fontFamily: MONO, fontSize: size, lineHeight: 1.55, whiteSpace: "pre"}}>{children}</div>;
const k = (t: string) => <span style={{color: "#C792EA"}}>{t}</span>;
const s = (t: string) => <span style={{color: "#C3E88D"}}>{t}</span>;
const cm = (t: string) => <span style={{color: C.dim}}>{t}</span>;

const REAL = "1849203776441237507";
const ROUND = "1849203776441237500";

// ================= 1 · symptom =================
const Symptom: React.FC = () => {
  const f = useCurrentFrame();
  const shake = f > T(6.62) && f < T(6.62) + 10 ? Math.sin(f * 3) * 8 : 0;
  return (
    <AbsoluteFill>
      <GlassBg />
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="DEBUG STORY · JSON NUMBERS" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={-15} size={76}>Opened my order.</Reveal>
        {f > T(2.1) ? <Reveal at={T(2.26)} size={76} color={C.bug} style={{marginTop: 4}}>“Order not found.”</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 40, right: 90, top: 560, display: "flex", justifyContent: "space-around", alignItems: "flex-start"}}>
        {/* phone */}
        <div style={{display: "grid", placeItems: "center", transform: `translateX(${shake}px)`}}>
          <Slab w={300} h={560} d={34} rx={-8} ry={18 + Math.sin(f / 40) * 6} color="#16181C" radius={44}
            front={<div style={{width: "100%", height: "100%", padding: "56px 22px", boxSizing: "border-box", textAlign: "center"}}>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>My Orders ›</div>
              <div style={{marginTop: 70, fontSize: 80, opacity: out(f, T(2.26), T(2.6))}}>📦</div>
              <div style={{...big(44, C.bug), marginTop: 14, opacity: out(f, T(2.26), T(2.6))}}>Order not found</div>
              <div style={{...big(110, C.bug), marginTop: 40, opacity: out(f, T(6.62), T(6.9)), transform: `scale(${interpolate(f, [T(6.62), T(6.95)], [2, 1], {...clamp, easing: Easing.out(Easing.back(1.7))})})`}}>404</div>
            </div>} />
          <Shadow w={300} style={{marginTop: 18}} />
        </div>
        {/* DB row says it exists */}
        <div style={{display: "grid", gap: 18, marginTop: 70, width: 400}}>
          <div style={{opacity: out(f, T(4.41), T(4.75)), transform: `translateY(${(1 - out(f, T(4.41), T(4.75))) * 40}px)`}}>
            <Glass glow={C.g} style={{padding: "18px 20px"}}>
              <div style={label}>DATABASE · orders</div>
              <div style={{fontFamily: MONO, fontSize: 24, marginTop: 8}}>id ...<span style={{color: C.g}}>237507</span></div>
              <div style={{fontFamily: MONO, fontSize: 24}}>status <span style={{color: C.g}}>EXISTS ✓</span></div>
            </Glass>
          </div>
          <div style={{opacity: out(f, T(5.63), T(5.95)), transform: `translateY(${(1 - out(f, T(5.63), T(5.95))) * 40}px)`}}>
            <Glass glow={C.g} style={{padding: "18px 20px"}}>
              <div style={label}>PAYMENT</div>
              <div style={{...big(48, C.g), marginTop: 8}}>₹649 PAID ✓</div>
            </Glass>
          </div>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.dim}}>(sample data)</div>
        </div>
      </div>
      {f > T(6.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1330, opacity: out(f, T(6.62), T(6.9))}}>
          <Glass glow={C.bug} style={{padding: "16px 22px"}}>
            <div style={{fontFamily: MONO, fontSize: 28}}><span style={{color: C.bug}}>GET /orders/…</span> → <span style={{color: C.bug}}>404 Not Found</span></div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · reproduce (works locally) =================
const Repro: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const stamp = interpolate(f, [L(10.26), L(10.6)], [2.4, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="STEP 1 / REPRODUCE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(7.8)} size={74}>Tried it locally.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 460, opacity: out(f, L(7.9), L(8.2))}}>
        <Glass>
          <div style={label}>TERMINAL · LOCAL</div>
          <Code size={28}>{typed("$ curl localhost:3000/orders/3", f, L(8.1), 36)}</Code>
          {f > L(9.3) ? <Code size={28}>{s("→ 200 OK  {\"id\": 3, \"status\": \"PAID\"}")}</Code> : null}
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 6}}>illustrative</div>
        </Glass>
      </div>
      {f > L(10.1) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 740, display: "grid", placeItems: "center"}}>
          <div style={{transform: `rotate(-6deg) scale(${stamp})`, border: `8px solid ${C.g}`, borderRadius: 20, padding: "12px 30px", ...big(54, C.g)}}>NO ERROR ✓</div>
        </div>
      ) : null}
      {/* local IDs: tiny blocks vs prod: long */}
      <div style={{position: "absolute", left: 64, right: 110, top: 960, opacity: out(f, L(10.92), L(11.3))}}>
        <div style={{...label, color: AMBER}}>BUT… LOCAL DB IDS</div>
        <div style={{display: "flex", gap: 26, marginTop: 20, alignItems: "flex-end"}}>
          {["1", "2", "3"].map((d, i) => {
            const p = out(f, L(12.89) + i * 6, L(12.89) + i * 6 + 8);
            return (
              <div key={d} style={{opacity: 0.35 + 0.65 * p, transform: `translateY(${(1 - p) * -40}px)`}}>
                <Slab w={120} h={120} d={40} rx={-14} ry={20} color="#22262C" glow={AMBER} radius={16}
                  front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", ...big(70, AMBER)}}>{d}</div>} />
              </div>
            );
          })}
        </div>
        <div style={{...label, marginTop: 50}}>PRODUCTION IDS</div>
        <div style={{fontFamily: MONO, fontSize: 40, marginTop: 10, color: C.text, opacity: out(f, L(11.6), L(12))}}>{REAL}</div>
        <div style={{...big(40, AMBER), marginTop: 18, opacity: out(f, L(12.0), L(12.3))}}>19 digits long.</div>
      </div>
    </AbsoluteFill>
  );
};

// ================= 3 · logs: sent vs requested =================
const Digits: React.FC<{v: string; at: number; diffAt?: number; color: string}> = ({v, at, diffAt, color}) => {
  const f = useCurrentFrame();
  return (
    <div style={{display: "flex", gap: 3}}>
      {v.split("").map((d, i) => {
        const p = out(f, at + i * 1.2, at + i * 1.2 + 6);
        const isDiff = diffAt !== undefined && i >= 17;
        const hl = isDiff && f > diffAt!;
        const same = diffAt !== undefined && !isDiff && f > diffAt! - T(1.5);
        return (
          <div key={i} style={{width: 44, height: 70, borderRadius: 8, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 36, fontWeight: 700,
            background: hl ? `${C.bug}33` : same ? `${C.g}14` : "rgba(255,255,255,.06)", border: `1.5px solid ${hl ? C.bug : "rgba(255,255,255,.1)"}`,
            color: hl ? C.bug : color, opacity: p, transform: `perspective(400px) rotateX(${(1 - p) * 90}deg) scale(${hl ? 1 + 0.12 * Math.max(0, 1 - (f - diffAt!) / 10) : 1})`}}>{d}</div>
        );
      })}
    </div>
  );
};
const Logs: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="STEP 2 / READ THE LOGS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(13.98)} size={74}>Opened the logs.</Reveal>
      </div>
      <div style={{position: "absolute", left: 44, right: 90, top: 470, opacity: out(f, L(14.89), L(15.2))}}>
        <div style={{...label, color: C.g, marginLeft: 20}}>API RESPONSE · backend sent</div>
        <div style={{marginTop: 12}}><Digits v={REAL} at={L(14.95)} color={C.text} /></div>
      </div>
      <div style={{position: "absolute", left: 44, right: 90, top: 680, opacity: out(f, L(16.2), L(16.5))}}>
        <div style={{...label, color: BLUE, marginLeft: 20}}>NEXT REQUEST · app asked for</div>
        <div style={{marginTop: 12}}><Digits v={ROUND} at={L(16.25)} diffAt={L(20.16)} color={C.text} /></div>
      </div>
      {f > L(17.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 900, ...big(64, AMBER), opacity: out(f, L(17.84), L(18.1))}}>They don't match.</div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1020, opacity: out(f, L(18.59), L(18.9))}}>
        <Glass style={{padding: "16px 20px"}}>
          <div style={label}>app.log · illustrative</div>
          <Code size={23}>{cm("12:41:07")} {s("200")} GET /orders/me      id=…237<span style={{color: C.g}}>507</span></Code>
          <Code size={23}>{cm("12:41:08")} <span style={{color: C.bug}}>404</span> GET /orders/…237<span style={{color: C.bug}}>500</span></Code>
        </Glass>
      </div>
      {f > L(20.0) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1270, ...big(58, C.text), opacity: out(f, L(20.16), L(20.5))}}>
          First digits same.<br /><Marker at={L(20.8)} color={C.bug}>Last digits → 00</Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · root cause: 64-bit ID, 53-bit Number =================
const Cause: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const fill = interpolate(f, [L(25.62), L(26.8)], [0, 53], {...clamp, easing: ease3});
  const lost = f > L(26.44);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="STEP 3 / ROOT CAUSE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(22.36)} size={80} color={AMBER}>Root cause.</Reveal>
        {f > L(23.0) ? <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 10, opacity: out(f, L(23.16), L(23.5))}}>DB ID: 64-bit integer.</div> : null}
        {f > L(24.5) ? <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 6, color: C.bug, opacity: out(f, L(24.71), L(25))}}>JS Number: exact to 53 bits.</div> : null}
      </div>
      {/* a solid 64-cell bit ruler */}
      <div style={{position: "absolute", left: 0, right: 0, top: 600, display: "grid", placeItems: "center", opacity: out(f, L(23.16), L(23.5))}}>
        <Slab w={920} h={200} d={50} rx={-16} ry={Math.sin(f / 40) * 8} color="#22262C" radius={18} glow={lost ? C.bug : undefined}
          front={<div style={{width: "100%", height: "100%", padding: "22px 22px", boxSizing: "border-box"}}>
            <div style={{display: "grid", gridTemplateColumns: "repeat(32, 1fr)", gap: 4}}>
              {Array.from({length: 64}).map((_, i) => {
                const safe = i < fill;
                const bad = i >= 53 && lost;
                return <div key={i} style={{height: 50, borderRadius: 4, background: bad ? C.bug : safe ? C.g : "rgba(255,255,255,.1)", boxShadow: bad ? `0 0 10px ${C.bug}` : undefined, opacity: bad ? 0.6 + 0.4 * Math.sin(f / 3 + i) : 1}} />;
              })}
            </div>
            <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, marginTop: 12}}>
              <span style={{color: C.g}}>53 bits exact</span><span style={{color: lost ? C.bug : C.dim}}>11 bits → rounded</span>
            </div>
          </div>} />
        <Shadow w={920} style={{marginTop: 20}} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 900, opacity: out(f, L(26.44), L(26.8))}}>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim}}>Number.MAX_SAFE_INTEGER = <span style={{color: C.g}}>9007199254740991</span></div>
      </div>
      {f > L(28.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1000, opacity: out(f, L(28.26), L(28.6))}}>
          <Glass glow={C.bug}>
            <div style={label}>app · api.js</div>
            <Code size={27}>{k("const")} order = <Marker at={L(28.9)} color={AMBER}><span style={{color: C.bug}}>JSON.parse</span></Marker>(body);</Code>
            <Code size={27}>{cm("// body: ")}{s(`{"id": ${REAL}}`)}</Code>
            {f > L(30.01) ? <Code size={27}>order.id {cm("→")} <span style={{color: C.bug}}>1849203776441237<b>500</b></span> ✕</Code> : null}
            {f > L(31.5) ? <Code size={27}>fetch(`/orders/${"${order.id}"}`) {cm("→")} <span style={{color: C.bug}}>404</span></Code> : null}
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1450, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(30.2), L(30.5))}}>verified in Node · ID is illustrative</div>
    </AbsoluteFill>
  );
};

// ================= 5 · fix =================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const ok = f >= L(39.6);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="STEP 4 / THE FIX" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(34.0)} size={80} color={C.g}>The fix.</Reveal>
        {f > L(34.6) ? <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 10, opacity: out(f, L(34.73), L(35.1))}}>Send big IDs as <Marker at={L(35.6)}>strings</Marker>.</div> : null}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 540, opacity: out(f, L(34.9), L(35.2))}}>
        <Glass>
          <div style={{...label, color: C.bug}}>BEFORE</div>
          <Code size={28}>{s("{")}"id": <span style={{color: C.bug}}>{REAL}</span>{s("}")}</Code>
          <div style={{...label, color: C.g, marginTop: 10}}>AFTER</div>
          <Code size={28}>{s("{")}"id": <span style={{color: C.g}}>"{REAL}"</span>{s("}")}</Code>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 850, opacity: out(f, L(36.68), L(37))}}>
        <Glass glow={C.g}>
          <div style={{...label, color: C.g}}>1 · BACKEND: SERIALIZE AS STRING</div>
          <Code size={27}>res.json({"{"} id: order.id.<Marker at={L(37.6)}>{s("toString()")}</Marker> {"}"});</Code>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1070, opacity: out(f, L(38.75), L(39.05))}}>
        <Glass glow={C.g}>
          <div style={{...label, color: C.g}}>2 · FRONTEND: KEEP IT A STRING</div>
          <Code size={27}>fetch(`/orders/${"${order.id}"}`) {cm("// no Number(id)")}</Code>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1310, display: "grid", placeItems: "center"}}>
        <div style={{perspective: 900}}>
          <div style={{transform: `rotateX(${interpolate(f, [L(39.6), L(40.1)], [0, 360], {...clamp, easing: ease3})}deg)`, padding: "16px 34px", borderRadius: 18, background: ok ? `${C.g}22` : `${C.bug}22`, border: `3px solid ${ok ? C.g : C.bug}`, ...big(58, ok ? C.g : C.bug)}}>
            {interpolate(f, [L(39.6), L(39.85)], [0, 1], clamp) > 0.5 ? "200 · ORDER FOUND ✓" : "404 · NOT FOUND ✕"}
          </div>
        </div>
      </div>
      <Sequence from={L(39.6)} durationInFrames={30} layout="none"><AbsoluteFill style={{mixBlendMode: "screen", opacity: 0.8}}><Leak hue={110} seed={7} /></AbsoluteFill></Sequence>
    </AbsoluteFill>
  );
};

// ================= 6 · lesson =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}>
        <Reveal at={L(40.62)} size={70}>An ID is a name,</Reveal>
        {f > L(41.4) ? <Reveal at={L(41.55)} size={70} color={AMBER} style={{marginTop: 10}}>not a number.</Reveal> : null}
      </div>
      {f > L(42.45) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "grid", placeItems: "center", opacity: out(f, L(42.6), L(43))}}>
          <Slab w={906} h={300} d={60} rx={-8} ry={Math.sin(f / 40) * 6} color="#22262C" glow={C.g} radius={24}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
              <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 900, lineHeight: 1.3}}>No math on it?<br /><span style={{color: C.g}}>{f > L(43.84) ? "Keep it a string." : "…"}</span></div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>IDs · phone numbers · PIN codes</div>
            </div>} />
          <Shadow w={906} style={{marginTop: 24}} />
        </div>
      ) : null}
      {f > L(44.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1130, opacity: out(f, L(44.94), L(45.2))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL BUGS, DEBUGGED</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(44.98), 60)}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const STEPS = ["Symptom", "Reproduce", "Logs", "Root cause", "Fix"];
const Checklist: React.FC = () => {
  const f = useCurrentFrame();
  const idx = f < CUTS[1] ? 0 : f < CUTS[2] ? 1 : f < CUTS[3] ? 2 : f < CUTS[4] ? 3 : 4;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 76, borderRadius: 20, display: "flex", alignItems: "center", gap: 8, padding: "0 16px", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      {STEPS.map((st, i) => {
        const done = i < idx || (i === 4 && f >= T(39.6));
        const cur = i === idx && !done;
        return (
          <React.Fragment key={st}>
            <span style={{fontFamily: MONO, fontSize: 20, padding: "6px 10px", borderRadius: 10, whiteSpace: "nowrap", color: done ? C.g : cur ? AMBER : C.dim, background: cur ? `${AMBER}1f` : "transparent", border: cur ? `1.5px solid ${AMBER}66` : "1.5px solid transparent"}}>{done ? "✓ " : cur ? "● " : ""}{st}</span>
            {i < STEPS.length - 1 ? <span style={{color: C.dim, fontSize: 18}}>›</span> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Symptom />, Repro, Logs, Cause, Fix, Lesson];

export const DebugDiaries019: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : E19_TOTAL - CUTS[i]));
  const pres = [
    fade(),
    glitch(),
    clockWipe({width: 1080, height: 1920}),
    flip({direction: "from-right"}),
    slide({direction: "from-bottom"}),
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
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 3 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Checklist />
      <AbsoluteFill style={{zIndex: 20}}><Hud ep="019" total={E19_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
