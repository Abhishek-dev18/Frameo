// Debug Diaries · Entry 023 "The Cascade" (Crashes) — Microsoft 365 / Exchange Online outage, 12–13 Nov 2026.
// Facts (Microsoft "Preliminary Post Incident Report for Microsoft 365", EX1550543 / MO1550821, 15 Nov 2026; Al Jazeera,
// Wikipedia, office365itpros): users could not open Outlook mailboxes, mail delayed for hours; impact 16:20 UTC 12 Nov →
// 16:10 UTC 13 Nov (~24 h). Engineers paused deployments, restarted servers; load was "not driven by an increase in
// traffic" but by servers being unexpectedly unavailable; rerouting caused "a cascading failure from server to server";
// at the lowest "more than 80% of servers were unresponsive". Three factors: a latent defect (a Windows change prepared for
// M365 networking gateway servers, deployed from July 2026) causing lock contention in the process that establishes
// connections; Teams traffic failover onto shared gateway front ends; ~14% gateway capacity already out (unrelated issue).
// Fix: reverted the defective change, patched/restarted servers in groups. Preliminary PIR — final due 20 Nov (hedged).
// Not a cyberattack (Microsoft). Server grid and log lines are illustrative; timestamps from the PIR (UTC).
// Voice: scripts/audio/sarvam_tts.py (calm defaults, pace 0.95), tighten.py defaults. CSS-only TransitionSeries.
import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {wipe} from "@remotion/transitions/wipe";
import {fade} from "@remotion/transitions/fade";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Slam} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip, Push} from "./glass";
import {Slab, Shadow} from "./depth";
import {glitch} from "./tseries";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 10.01, 19.7, 29.6, 42.61, 50.75].map(T);
export const E23_TOTAL = T(60.6) + 30;
const TR = 14;
const AMBER = "#FFD27A";
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};

// ---------- isometric server grid with real extrusion ----------
const COLS = 6, ROWS = 5, N = COLS * ROWS;
type St = "ok" | "hot" | "down";
const Tile: React.FC<{st: St; f: number; i: number}> = ({st, f, i}) => {
  const top = st === "ok" ? "#2E3B33" : st === "hot" ? "#5A4A28" : "#4A2420";
  const side = st === "ok" ? "#1B241F" : st === "hot" ? "#3A2F18" : "#2B1412";
  const led = st === "ok" ? C.g : st === "hot" ? AMBER : C.bug;
  const h = st === "down" ? 10 : 34;
  const blink = st === "down" ? (Math.floor((f + i * 3) / 8) % 2 ? 1 : 0.25) : 1;
  return (
    <div style={{position: "relative", width: 120, height: 84, transformStyle: "preserve-3d"}}>
      {Array.from({length: 6}).map((_, k) => (
        <div key={k} style={{position: "absolute", inset: 0, borderRadius: 10, background: side, transform: `translateZ(${(k / 5) * h}px)`}} />
      ))}
      <div style={{position: "absolute", inset: 0, borderRadius: 10, background: top, border: `2px solid ${led}55`, transform: `translateZ(${h + 1}px)`, boxShadow: st === "down" ? `0 0 40px ${C.bug}88` : st === "hot" ? `0 0 30px ${AMBER}66` : "none"}}>
        {[0, 1, 2].map((r) => <div key={r} style={{position: "absolute", left: 14, right: 40, top: 16 + r * 20, height: 6, borderRadius: 3, background: "rgba(255,255,255,.12)"}} />)}
        <div style={{position: "absolute", right: 14, top: 14, width: 14, height: 14, borderRadius: 7, background: led, opacity: blink, boxShadow: `0 0 12px ${led}`}} />
      </div>
    </div>
  );
};
const Grid: React.FC<{state: (i: number) => St; walls?: number; spin?: number}> = ({state, walls = 0, spin = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 1080, height: 760, display: "grid", placeItems: "center", perspective: 2200}}>
      <div style={{transformStyle: "preserve-3d", transform: `rotateX(56deg) rotateZ(${-32 + Math.sin(f / 70) * 4 + spin}deg)`, display: "grid", gridTemplateColumns: `repeat(${COLS}, 120px)`, gap: 22, position: "relative", padding: 26, borderRadius: 26, background: "rgba(255,255,255,.035)", border: "2px solid rgba(255,255,255,.08)"}}>
        {Array.from({length: N}).map((_, i) => <Tile key={i} i={i} st={state(i)} f={f} />)}
        {walls > 0 ? [2, 4].map((c) => (
          <div key={c} style={{position: "absolute", top: 10, bottom: 10, left: 26 + c * 142 - 13, width: 4, background: C.g, boxShadow: `0 0 18px ${C.g}`, transformOrigin: "50% 50%", transform: `translateZ(${walls * 60}px)`, opacity: walls}} />
        )) : null}
      </div>
    </div>
  );
};
// cascade order: distance from the first failing server + jitter; 5 survive (≈83% down)
const ORIGIN = [2, 2];
const order = Array.from({length: N}, (_, i) => {
  const c = i % COLS, r = Math.floor(i / COLS);
  return Math.hypot(c - ORIGIN[0], r - ORIGIN[1]) + random(`cj${i}`) * 0.9;
});
const SURVIVE = new Set([5, 24, 29, 0, 17]);
const downTime = (i: number, start: number, speed: number) => (SURVIVE.has(i) ? Infinity : start + order[i] * speed);

// ================= 1 · symptom =================
const Symptom: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const spin = (f * 12) % 360;
  const queued = Math.floor(interpolate(f, [L(4.6), L(9.6)], [0, 48210], clamp));
  return (
    <AbsoluteFill>
      <GlassBg />
      <div style={{position: "absolute", left: 64, top: 255}}><LiveChip text="INCIDENT · 12 NOV 2026" /></div>
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(1.1)} size={84}>Outlook won't open.</Reveal>
        {f > L(6) ? <Reveal at={L(6.14)} size={84} color={C.bug} style={{marginTop: 6}}>Email down ~1 day.</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 590, display: "grid", placeItems: "center", opacity: out(f, L(1.2), L(1.7))}}>
        <Slab w={820} h={760} d={44} rx={-9} ry={Math.sin(f / 45) * 8} color="#1A1C21" radius={34} glow={f > L(3.1) ? C.bug : undefined}
          front={<div style={{width: "100%", height: "100%", padding: "34px 40px", boxSizing: "border-box"}}>
            <div style={{display: "flex", alignItems: "center", gap: 16, fontFamily: SANS, fontSize: 34, fontWeight: 800}}>
              <span style={{fontSize: 40}}>✉️</span> Inbox <span style={{marginLeft: "auto", ...label}}>MAIL APP</span>
            </div>
            <div style={{height: 2, background: C.line, margin: "22px 0"}} />
            {f < L(3.1) ? (
              <div style={{display: "grid", placeItems: "center", height: 300}}>
                <div style={{width: 110, height: 110, borderRadius: 55, border: `10px solid ${C.line}`, borderTopColor: C.text, transform: `rotate(${spin}deg)`}} />
                <div style={{fontFamily: MONO, fontSize: 28, color: C.dim}}>Loading mailbox…</div>
              </div>
            ) : (
              <div style={{display: "grid", placeItems: "center", height: 300, textAlign: "center", transform: `scale(${0.9 + 0.1 * out(f, L(3.1), L(3.5))})`}}>
                <div style={{fontSize: 90}}>⚠️</div>
                <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 900, color: C.bug}}>Something went wrong</div>
                <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 8}}>can't reach your mailbox</div>
              </div>
            )}
            <div style={{marginTop: 30, padding: "20px 24px", borderRadius: 20, background: `${AMBER}14`, border: `1.5px solid ${AMBER}55`, opacity: out(f, L(4.6), L(5))}}>
              <div style={{...label, color: AMBER}}>OUTBOX · DELAYED</div>
              <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, color: AMBER, marginTop: 6}}>{queued.toLocaleString("en-US")} <span style={{fontSize: 26}}>mails waiting</span></div>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>(illustrative)</div>
            </div>
          </div>} />
        <Shadow w={820} style={{marginTop: 24}} />
      </div>
    </AbsoluteFill>
  );
};

// ================= 2 · investigation =================
const Investigate: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const lines: [number, string, string, string][] = [
    [10.1, "19:00", "pause all deployments + config changes", C.text],
    [12.2, "20:30", "restart unresponsive servers", C.text],
  ];
  const chartP = out(f, L(14.6), L(15.6));
  const healthy = interpolate(f, [L(16.1), L(19.6)], [100, 62], clamp);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE INVESTIGATION" />
      <div style={{position: "absolute", left: 64, right: 90, top: 340}}>
        <Glass>
          <div style={label}>INCIDENT LOG · UTC · 12 NOV</div>
          {lines.map(([at, ts, txt, col], i) => f > L(at) ? (
            <div key={i} style={{fontFamily: MONO, fontSize: 30, marginTop: 14, color: col}}><span style={{color: C.dim}}>{ts}</span> {typed(txt, f, L(at), 50)}</div>
          ) : null)}
          {f > L(12.9) ? <div style={{fontFamily: MONO, fontSize: 30, marginTop: 14, color: C.bug}}><span style={{color: C.dim}}>20:31</span> still failing ✗</div> : null}
        </Glass>
      </div>
      {f > L(13.4) ? (
        <div style={{position: "absolute", left: 64, top: 720}}><Slam at={L(13.49)} size={110} color={AMBER}>The clue:</Slam></div>
      ) : null}
      {f > L(14.5) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 870, display: "flex", gap: 28, opacity: chartP}}>
          <Glass style={{flex: 1}}>
            <div style={label}>TRAFFIC</div>
            <svg width={400} height={200} style={{marginTop: 10}}>
              <path d={`M0 120 ${Array.from({length: 20}, (_, k) => `L${k * 21} ${120 + Math.sin(k * 1.3) * 8}`).join(" ")}`} stroke={C.g} strokeWidth={6} fill="none" strokeDasharray={600} strokeDashoffset={600 * (1 - chartP)} />
            </svg>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, color: C.g}}>NOT UP ✓</div>
          </Glass>
          <Glass style={{flex: 1}} glow={f > L(16.1) ? C.bug : undefined}>
            <div style={label}>HEALTHY SERVERS</div>
            <div style={{fontFamily: MONO, fontSize: 110, fontWeight: 800, marginTop: 30, color: healthy < 99 ? C.bug : C.text}}>{Math.round(healthy)}%</div>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, color: C.bug, opacity: out(f, L(16.1), L(16.5))}}>FALLING ↓</div>
          </Glass>
        </div>
      ) : null}
      {f > L(16) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1330, opacity: out(f, L(16.1), L(16.5))}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 58, textTransform: "uppercase", lineHeight: 1.1}}>
            Same load. <Marker at={L(16.9)} color={C.bug}>Servers dying.</Marker>
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 18}}>timestamps: Microsoft preliminary PIR</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · cascade =================
const Cascade: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const st = (i: number): St => {
    const d = i === 14 ? L(19.9) : downTime(i, L(23.0), 9);
    if (f >= d) return "down";
    if (f >= d - 14) return "hot";
    return "ok";
  };
  const downCount = Array.from({length: N}).filter((_, i) => st(i) === "down").length;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="WHAT WAS HAPPENING" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(19.8)} size={70}>One server falls…</Reveal>
        {f > L(21.2) ? <Reveal at={L(21.3)} size={70} color={AMBER} style={{marginTop: 6}}>its traffic moves on.</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 0, top: 560}}><Push len={300} amount={0.06}><Grid state={st} /></Push></div>
      {f > L(24.6) ? <div style={{position: "absolute", left: 0, right: 0, top: 1290, display: "grid", placeItems: "center"}}><Slam at={L(24.74)} size={150} color={C.bug} origin="center">CASCADE</Slam></div> : null}
      <div style={{position: "absolute", left: 64, right: 90, top: 1470, display: "flex", alignItems: "baseline", gap: 20, opacity: out(f, L(22.9), L(23.3))}}>
        <span style={{fontFamily: MONO, fontSize: 84, fontWeight: 800, color: C.bug}}>{f > L(25.95) ? "80%+" : `${Math.round((downCount / N) * 100)}%`}</span>
        <span style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.text}}>servers unresponsive</span>
      </div>
    </AbsoluteFill>
  );
};

// ================= 4 · root cause =================
const Root: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const factors: [number, string, string, string][] = [
    [30.71, "01", "Latent bug", "gateway servers · deployed since Jul 2026"],
    [34.7, "02", "Teams failover", "extra traffic onto the same front ends"],
    [36.55, "03", "~14% capacity out", "an unrelated issue, the day before"],
  ];
  const lockP = out(f, L(38.6), L(39.1));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="ROOT CAUSE" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(29.7)} size={76}>3 things. Same day.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 90, top: 470, display: "flex", flexDirection: "column", gap: 26}}>
        {factors.map(([at, n, t, sub], i) => {
          const p = out(f, L(at), L(at) + 12);
          return f > L(at) - 1 ? (
            <div key={i} style={{transform: `translateY(${(1 - p) * 80}px)`, opacity: p}}>
              <Slab w={952} h={150} d={40} rx={-10} ry={Math.sin(f / 40 + i) * 5} color="#20232A" radius={22} glow={i === 0 ? C.bug : undefined}
                front={<div style={{display: "flex", alignItems: "center", gap: 28, height: "100%", padding: "0 34px"}}>
                  <span style={{fontFamily: MONO, fontSize: 56, fontWeight: 800, color: i === 0 ? C.bug : AMBER}}>{n}</span>
                  <div>
                    <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 900}}>{t}</div>
                    <div style={{fontFamily: MONO, fontSize: 25, color: "#A3A7B0", marginTop: 4}}>{sub}</div>
                  </div>
                </div>} />
            </div>
          ) : null;
        })}
      </div>
      {f > L(38.5) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1060, opacity: lockP, transform: `scale(${0.92 + 0.08 * lockP})`}}>
          <Glass glow={C.bug} style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>INSIDE EACH GATEWAY SERVER</div>
            <div style={{display: "flex", alignItems: "center", gap: 22, marginTop: 18, fontFamily: MONO, fontSize: 30}}>
              <span style={{padding: "10px 16px", borderRadius: 14, background: "rgba(255,255,255,.07)"}}>connection process</span>
              <span style={{color: C.dim}}>→</span>
              <span style={{fontSize: 52, transform: `rotate(${f > L(40.9) ? Math.sin(f / 2) * 8 : 0}deg)`}}>🔒</span>
              <span style={{color: C.bug, fontWeight: 800}}>{typed("lock contention", f, L(40.92), 40)}</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 18}}>{f > L(41.4) ? "→ CPU + memory exhausted → no response" : ""}</div>
          </Glass>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.dim, marginTop: 16}}>per Microsoft's preliminary PIR · final report pending</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · fix =================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const st = (i: number): St => {
    if (SURVIVE.has(i)) return "ok";
    const grp = i % 3; // patch in groups
    return f >= L(45.6) + grp * 24 ? "ok" : "down";
  };
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE FIX" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Glass style={{opacity: out(f, L(43.4), L(43.8))}}>
          <div style={{fontFamily: MONO, fontSize: 32}}>
            <span style={{color: C.g}}>$</span> {typed("revert defective-change", f, L(43.45), 45)}
          </div>
          {f > L(44.6) ? <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 10}}>✓ connection code path → last known good</div> : null}
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 8}}>(illustrative command)</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 0, top: 560}}><Grid state={st} spin={interpolate(f, [0, 240], [0, 10], clamp)} /></div>
      {f > L(45.4) ? <div style={{position: "absolute", left: 64, top: 1290, fontFamily: MONO, fontSize: 32, color: C.g, opacity: out(f, L(45.45), L(45.8))}}>patch → restart → return · group by group</div> : null}
      {f > L(48.1) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1370}}>
          <Slam at={L(48.17)} size={96} color={C.g}>~24 hours</Slam>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 12, opacity: out(f, L(48.6), L(49))}}>12 Nov 16:20 → 13 Nov 16:10 UTC</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lesson =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const walls = out(f, L(55.1), L(55.6));
  const st = (i: number): St => {
    const c = i % COLS;
    if (c >= 2) return "ok";
    return f >= L(56.3) + (i % 2) * 6 ? "down" : "ok";
  };
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(51.5)} size={66}>Failover needs headroom.</Reveal>
        {f > L(55) ? <Reveal at={L(55.12)} size={66} color={C.g} style={{marginTop: 8}}>Bulkheads stop cascades.</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 0, top: 560, opacity: out(f, L(52.4), L(53))}}><Grid state={st} walls={walls} /></div>
      {f > L(56.6) ? <div style={{position: "absolute", left: 64, right: 90, top: 1290, fontFamily: MONO, fontSize: 30, color: C.text, opacity: out(f, L(56.7), L(57.1))}}>one partition fails · <span style={{color: C.g}}>the rest stay up</span></div> : null}
      {f > L(58.6) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1380, opacity: out(f, L(58.78), L(59.1))}}>
          <Glass style={{borderLeft: `8px solid ${C.g}`}}>
            <div style={label}>REAL OUTAGES, DEBUGGED</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(58.85), 60)}</div>
          </Glass>
          <div style={{fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 14}}>Source: Microsoft preliminary Post Incident Report (15 Nov 2026)</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// bottom status strip: incident → restored
const Status: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const healthy = t < 16 ? 100 : t < 27 ? interpolate(t, [16, 27], [100, 17]) : t < 45.6 ? 17 : interpolate(t, [45.6, 48.2], [17, 100], clamp);
  const restored = t >= 48.17;
  const col = restored ? C.g : healthy < 99 ? C.bug : AMBER;
  return (
    <div style={{position: "absolute", left: 64, right: 90, top: 1670, height: 80, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}55`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10, fontFamily: MONO, fontSize: 21}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: col, opacity: restored ? 1 : Math.floor(f / 12) % 2 ? 1 : 0.35}} />
      <span style={{color: col, fontWeight: 800, letterSpacing: "0.1em"}}>{restored ? "RESTORED" : "INCIDENT"}</span>
      <span style={{color: C.dim}}>{restored ? "13 NOV 16:10 UTC" : "12 NOV 16:20 UTC"}</span>
      <span style={{marginLeft: "auto", color: C.dim}}>servers</span>
      <div style={{width: 120, height: 12, borderRadius: 6, background: C.line, overflow: "hidden"}}><div style={{width: `${healthy}%`, height: "100%", background: col}} /></div>
      <span style={{color: col, width: 64, textAlign: "right"}}>{Math.round(healthy)}%</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [Symptom, Investigate, Cascade, Root, Fix, Lesson];

export const DebugDiaries023: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : E23_TOTAL - CUTS[i]));
  const pres = [slide({direction: "from-right"}), glitch(), clockWipe({width: 1080, height: 1920}), wipe({direction: "from-bottom"}), fade()];
  return (
    <AbsoluteFill style={{background: "#121316", color: C.text}}>
      <TransitionSeries>
        {COMPS.map((Comp, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}>
              <Comp off={CUTS[i]} />
            </TransitionSeries.Sequence>
            {i + 1 < COMPS.length ? (
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 0 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR, easing: Easing.inOut(Easing.cubic)})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Status />
      <AbsoluteFill style={{zIndex: 20}}><Hud ep="023" total={E23_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
