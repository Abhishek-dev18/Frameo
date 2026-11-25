// Debug Diaries · Entry 028 "One Regex" (Crashes) — the Cloudflare WAF outage, 2 Jul 2019 (~27 min).
// Facts (Cloudflare blog, John Graham-Cumming: "Cloudflare outage caused by bad software deploy", 2 Jul 2019, and
// "Details of the Cloudflare outage on July 2, 2019", 12 Jul 2019): 13:42 UTC a new WAF Managed Rule (aimed at inline
// JavaScript / XSS) deployed globally via Quicksilver; ~3 min later the first page; visitors got HTTP 502 Bad Gateway;
// traffic dropped 82% at worst; CPU on HTTP/HTTPS machines near 100% worldwide. Early suspicion of an attack; CPU data,
// strace and logs pointed at the WAF. Cause: a regex whose critical part `.*(?:.*=.*)` caused catastrophic backtracking.
// Rule was in "simulate" mode (log, not block) but still ran on every request; the SOP allowed a global push that skipped
// the staged DOG → PIG → Canary rollout; a CPU protection had been removed by mistake weeks earlier. Fix: 14:07 global WAF
// terminate, 14:09 CPU and traffic normal; 14:52 WAF back on with the rule rolled back. Follow-ups: rule performance
// profiling in tests, re2 / Rust regex engine (run-time guarantees), staged rule rollout.
// Backtracking step counts on screen are Cloudflare's own example for `.*.*=.*`. Server bars / CPU %, sites and commands
// are illustrative. Voice: scripts/audio/sarvam_tts.py (calm defaults, pace 0.95), tighten.py defaults. CSS-only transitions.
import React from "react";
import {AbsoluteFill, interpolate, random, useCurrentFrame, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {wipe} from "@remotion/transitions/wipe";
import {flip} from "@remotion/transitions/flip";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Slam} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip, Push} from "./glass";
import {Slab, Shadow} from "./depth";
import {glitch} from "./tseries";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 11.39, 25.05, 40.12, 48.72, 55.83].map(T);
export const E28_TOTAL = T(63.2) + 36;
const TR = 14;
const AMBER = "#FFD27A";
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};

// ---------- 3D server rack: lit extruded CPU columns ----------
const NB = 12;
const Bars: React.FC<{load: (i: number) => number; tilt?: number}> = ({load, tilt = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{width: 1080, height: 520, display: "grid", placeItems: "center", perspective: 1800}}>
      <div style={{transformStyle: "preserve-3d", transform: `rotateX(58deg) rotateZ(${-28 + Math.sin(f / 60) * 5 + tilt}deg)`, display: "grid", gridTemplateColumns: "repeat(6, 96px)", gap: 30, padding: 30, borderRadius: 26, background: "rgba(255,255,255,.035)", border: "2px solid rgba(255,255,255,.08)"}}>
        {Array.from({length: NB}).map((_, i) => {
          const v = Math.max(0.04, Math.min(1, load(i)));
          const h = 20 + v * 190;
          const col = v > 0.85 ? C.bug : v > 0.6 ? AMBER : C.g;
          const side = v > 0.85 ? "#4A2420" : v > 0.6 ? "#4A3C1E" : "#1E3527";
          return (
            <div key={i} style={{position: "relative", width: 96, height: 96, transformStyle: "preserve-3d"}}>
              {Array.from({length: 8}).map((_, k) => (
                <div key={k} style={{position: "absolute", inset: 0, borderRadius: 12, background: side, transform: `translateZ(${(k / 7) * h}px)`}} />
              ))}
              <div style={{position: "absolute", inset: 0, borderRadius: 12, background: col, opacity: 0.92, transform: `translateZ(${h + 1}px)`, boxShadow: `0 0 34px ${col}99`}} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
const jitter = (i: number, f: number) => (random(`b${i}`) - 0.5) * 0.12 + Math.sin(f / 7 + i) * 0.03;

// ================= 1 · symptom =================
const Symptom: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const err = f > L(5.1);
  const drop = interpolate(f, [L(6.8), L(8.6)], [0, 1], clamp);
  const pts = Array.from({length: 26}, (_, k) => {
    const x = k * 30;
    const base = 150 + Math.sin(k * 1.1) * 10;
    const fall = k > 12 ? Math.min(1, (k - 12) / 3) * 108 * drop : 0;
    return `${k ? "L" : "M"}${x} ${40 + base - 110 + fall}`;
  }).join(" ");
  return (
    <AbsoluteFill>
      <GlassBg />
      <div style={{position: "absolute", left: 64, top: 255}}><LiveChip text="INCIDENT · 2 JUL 2019" /></div>
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(0.1)} size={76}>Websites everywhere…</Reveal>
        {f > L(5.0) ? <Reveal at={L(5.16)} size={76} color={C.bug} style={{marginTop: 6}}>502 Bad Gateway.</Reveal> : null}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 620, display: "grid", placeItems: "center", opacity: out(f, L(1.5), L(2))}}>
        <Slab w={860} h={540} d={44} rx={-9} ry={Math.sin(f / 45) * 8} color="#1A1C21" radius={34} glow={err ? C.bug : undefined}
          front={<div style={{width: "100%", height: "100%", padding: "28px 36px", boxSizing: "border-box"}}>
            <div style={{display: "flex", gap: 12, alignItems: "center"}}>
              {[C.bug, AMBER, C.g].map((c) => <span key={c} style={{width: 18, height: 18, borderRadius: 9, background: c, opacity: 0.7}} />)}
              <div style={{marginLeft: 16, flex: 1, padding: "10px 18px", borderRadius: 14, background: "rgba(255,255,255,.07)", fontFamily: MONO, fontSize: 24, color: C.dim}}>
                https://{["example-shop.in", "news-site.com", "my-saas.app"][Math.floor(f / 20) % 3]}
              </div>
            </div>
            {!err ? (
              <div style={{display: "grid", placeItems: "center", height: 380}}>
                <div style={{width: 100, height: 100, borderRadius: 50, border: `10px solid ${C.line}`, borderTopColor: C.text, transform: `rotate(${(f * 12) % 360}deg)`}} />
              </div>
            ) : (
              <div style={{display: "grid", placeItems: "center", height: 380, textAlign: "center", transform: `scale(${0.88 + 0.12 * out(f, L(5.16), L(5.5))})`}}>
                <div style={{fontFamily: MONO, fontSize: 170, fontWeight: 800, color: C.bug, lineHeight: 1, textShadow: `0 0 50px ${C.bug}88`}}>502</div>
                <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 900}}>Bad Gateway</div>
                <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 6}}>the edge can't serve this page</div>
              </div>
            )}
          </div>} />
        <Shadow w={860} style={{marginTop: 22}} />
      </div>
      {f > L(6.6) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1230, opacity: out(f, L(6.7), L(7.1))}}>
          <Glass glow={drop > 0.5 ? C.bug : undefined}>
            <div style={{display: "flex", alignItems: "center"}}>
              <div style={label}>GLOBAL TRAFFIC</div>
              <div style={{marginLeft: "auto", fontFamily: MONO, fontSize: 52, fontWeight: 800, color: C.bug}}>−{Math.round(82 * drop)}%</div>
            </div>
            <svg width={780} height={170} style={{marginTop: 8}}>
              <path d={pts} stroke={drop > 0.3 ? C.bug : C.g} strokeWidth={6} fill="none" strokeLinejoin="round" />
            </svg>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>82% drop at worst (Cloudflare) · chart illustrative</div>
          </Glass>
        </div>
      ) : null}
      {f > L(9.9) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1000, display: "grid", placeItems: "center"}}>
          <div style={{padding: "18px 40px", borderRadius: 26, background: "rgba(18,19,22,.88)", border: `3px solid ${C.bug}`, boxShadow: `0 0 80px ${C.bug}66`}}>
            <Slam at={L(10.01)} size={120} color={C.bug} origin="center">just 1 regex</Slam>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · investigation =================
const Investigate: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const rise = interpolate(f, [L(12.7), L(15.6)], [0.3, 1], clamp);
  const prof: [string, number, string][] = [["WAF · regex match", 94, C.bug], ["TLS", 3, C.dim], ["cache", 2, C.dim]];
  const profP = out(f, L(18.1), L(19.2));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE INVESTIGATION" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(11.45)} size={74}>CPU, worldwide:</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, top: 580}}><Push len={240} amount={0.05}><Bars load={(i) => rise + jitter(i, f) * (rise > 0.95 ? 0.2 : 1)} /></Push></div>
      <div style={{position: "absolute", right: 90, top: 326, fontFamily: MONO, fontSize: 76, fontWeight: 800, color: rise > 0.9 ? C.bug : AMBER}}>{Math.round(rise * 100) >= 99 ? "~100%" : `${Math.round(rise * 100)}%`}</div>
      {f > L(15.8) ? (
        <div style={{position: "absolute", left: 64, top: 1020, display: "flex", alignItems: "center", gap: 26, opacity: out(f, L(15.9), L(16.3))}}>
          <Slam at={L(16.79)} size={92} color={AMBER}>Attack?</Slam>
          {f > L(18.0) ? <span style={{fontFamily: SANS, fontSize: 52, fontWeight: 900, color: C.dim, opacity: out(f, L(18.04), L(18.4))}}>→ no.</span> : null}
        </div>
      ) : null}
      {f > L(18.0) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1150, opacity: profP, transform: `translateY(${(1 - profP) * 40}px)`}}>
          <Glass>
            <div style={label}>CPU PROFILE · WHERE TIME GOES</div>
            {prof.map(([n, v, c], i) => (
              <div key={n} style={{marginTop: 16}}>
                <div style={{display: "flex", fontFamily: MONO, fontSize: 28, color: c === C.dim ? "#A3A7B0" : c}}><span>{n}</span><span style={{marginLeft: "auto"}}>{Math.round(v * profP)}%</span></div>
                <div style={{height: 18, marginTop: 6, borderRadius: 9, background: C.line}}><div style={{width: `${v * interpolate(f, [L(19.2) + i * 4, L(20.6) + i * 4], [0, 1], clamp)}%`, height: "100%", borderRadius: 9, background: c, boxShadow: i === 0 ? `0 0 20px ${C.bug}` : "none"}} /></div>
              </div>
            ))}
            <div style={{fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 12}}>(illustrative profile)</div>
          </Glass>
        </div>
      ) : null}
      {f > L(21.6) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1540, fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 60, textTransform: "uppercase", lineHeight: 1.1, opacity: out(f, L(21.7), L(22))}}>
          <Marker at={L(21.8)} color={C.bug}>WAF</Marker> <span style={{fontSize: 40, color: "#A3A7B0"}}>{typed("= Web Application Firewall", f, L(22.6), 40)}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · root cause: the regex + backtracking =================
const Regex: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const toks: [string, number][] = [[".*", 30.55], [".*", 31.58], ["=", 32.65], [".*", 33.55]];
  const shown = (at: number) => f > L(at) - 2;
  // backtracking visual: a cursor tries every split of the input
  const tryP = interpolate(f, [L(34.4), L(39.9)], [0, 1], clamp);
  const steps = Math.round(interpolate(tryP, [0, 1], [0, 4067], {easing: Easing.in(Easing.quad)}));
  const INPUT = "xxxxxxxxxxxxxxxxxxxx";
  const a = Math.floor((f * 1.7) % 20), b = Math.floor((f * 5.3) % 20);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="ROOT CAUSE" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Reveal at={L(25.1)} size={64}>3 min earlier: new WAF rule</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 470, display: "grid", placeItems: "center", opacity: out(f, L(27.1), L(27.6))}}>
        <Slab w={950} h={330} d={40} rx={-8} ry={Math.sin(f / 40) * 7} color="#1C1E24" radius={28} glow={f > L(30.5) ? C.bug : undefined}
          front={<div style={{padding: "26px 34px", height: "100%", boxSizing: "border-box"}}>
            <div style={label}>WAF MANAGED RULE · CRITICAL PART</div>
            <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 14, whiteSpace: "nowrap", overflow: "hidden"}}>{"…(?:\\\"|'|\\]|\\}|\\\\|\\d|(?:nan|infinity…"}</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 4, marginTop: 18, fontFamily: MONO, fontSize: 104, fontWeight: 800}}>
              <span style={{color: shown(30.55) ? C.bug : C.text, textShadow: shown(30.55) ? `0 0 30px ${C.bug}` : "none"}}>.*</span>
              <span style={{color: C.dim}}>(?:</span>
              {toks.slice(1).map(([t, at], i) => (
                <span key={i} style={{color: shown(at) ? (t === "=" ? AMBER : C.bug) : C.text, transform: `translateY(${shown(at) ? -8 * (1 - out(f, L(at), L(at) + 8)) : 0}px)`, display: "inline-block", textShadow: shown(at) ? `0 0 30px ${t === "=" ? AMBER : C.bug}` : "none"}}>{t}</span>
              ))}
              <span style={{color: C.dim}}>)</span>
            </div>
          </div>} />
      </div>
      {f > L(34.3) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 880, opacity: out(f, L(34.4), L(34.8))}}>
          <Glass glow={tryP > 0.6 ? C.bug : undefined}>
            <div style={label}>.*.*=.* vs 20 x's, no "=" · engine tries every split</div>
            <div style={{fontFamily: MONO, fontSize: 40, marginTop: 18, letterSpacing: "0.06em", display: "flex"}}>
              {INPUT.split("").map((c, i) => (
                <span key={i} style={{color: i <= Math.min(a, b) ? C.bug : i <= Math.max(a, b) ? AMBER : "#A3A7B0", borderRight: i === a || i === b ? `3px solid ${C.text}` : "3px solid transparent"}}>{c}</span>
              ))}
            </div>
            <div style={{display: "flex", alignItems: "baseline", gap: 18, marginTop: 18}}>
              <span style={{fontFamily: MONO, fontSize: 92, fontWeight: 800, color: tryP > 0.5 ? C.bug : AMBER}}>{steps.toLocaleString("en-US")}</span>
              <span style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>steps → no match</span>
            </div>
            <div style={{fontFamily: MONO, fontSize: 24, color: "#A3A7B0", marginTop: 6}}>"x=x" takes 23 · 20 chars take 4,067</div>
            <div style={{fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 8}}>step counts: Cloudflare's own example</div>
          </Glass>
        </div>
      ) : null}
      {f > L(38.4) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1370, display: "grid", placeItems: "center"}}>
          <div style={{textAlign: "center", fontFamily: SANS, fontWeight: 900, fontStretch: "74%", lineHeight: 0.95}}>
            <Slam at={L(38.53)} size={96} color={C.bug} origin="center">CATASTROPHIC</Slam>
            <Slam at={L(39.0)} size={96} color={C.text} origin="center">BACKTRACKING</Slam>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · why everywhere at once =================
const Everywhere: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const stages = ["DOG", "PIG", "CANARY", "GLOBAL"];
  const hit = (i: number) => f > L(45.4) + random(`p${i}`) * 10;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="WHY EVERYWHERE?" />
      <div style={{position: "absolute", left: 64, right: 90, top: 340, opacity: out(f, L(40.2), L(40.6))}}>
        <Glass>
          <div style={{display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 34}}>
            <span style={{color: C.dim}}>mode:</span>
            <span style={{padding: "8px 18px", borderRadius: 12, background: `${AMBER}22`, color: AMBER, fontWeight: 800}}>SIMULATE</span>
            <span style={{color: "#A3A7B0", fontSize: 28}}>{f > L(42.5) ? "log ✓ · block ✗" : ""}</span>
          </div>
          {f > L(43.3) ? (
            <div style={{fontFamily: MONO, fontSize: 32, marginTop: 18, color: C.bug}}>{typed("but the regex still ran on EVERY request", f, L(43.37), 55)}</div>
          ) : null}
        </Glass>
      </div>
      {f > L(45.1) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 690, opacity: out(f, L(45.2), L(45.6))}}>
          <div style={label}>NORMAL SOFTWARE ROLLOUT</div>
          <div style={{display: "flex", alignItems: "center", gap: 12, marginTop: 16}}>
            {stages.map((s, i) => (
              <React.Fragment key={s}>
                <div style={{flex: 1, textAlign: "center", padding: "18px 0", borderRadius: 16, fontFamily: MONO, fontSize: 26, fontWeight: 800, background: i === 3 ? `${C.bug}26` : "rgba(255,255,255,.05)", color: i === 3 ? C.bug : C.dim, border: `2px solid ${i === 3 ? C.bug : C.line}`, textDecoration: i < 3 && f > L(47.5) ? "line-through" : "none"}}>{s}</div>
                {i < 3 ? <span style={{color: C.dim, fontSize: 26}}>›</span> : null}
              </React.Fragment>
            ))}
          </div>
          <div style={{fontFamily: MONO, fontSize: 24, color: "#A3A7B0", marginTop: 12}}>{f > L(47.4) ? "WAF rules: straight to GLOBAL, in seconds" : ""}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 0, top: 930, opacity: out(f, L(45.2), L(45.7))}}>
        <Bars tilt={8} load={(i) => (hit(i) ? 0.97 + jitter(i, f) * 0.1 : 0.3 + jitter(i, f))} />
      </div>
      {f > L(47.4) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1460}}>
          <Slam at={L(47.49)} size={78} color={C.bug}>No staged rollout.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · fix =================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const cool = interpolate(f, [L(51.6), L(52.6)], [1, 0], clamp);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE FIX" />
      <div style={{position: "absolute", left: 64, right: 90, top: 330}}>
        <Glass style={{opacity: out(f, L(48.8), L(49.2))}}>
          <div style={{fontFamily: MONO, fontSize: 34}}>
            <span style={{color: C.g}}>$</span> {typed("waf --global-terminate", f, L(49.52), 45)}
          </div>
          {f > L(51.4) ? <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 10}}>✓ WAF off on every server · 14:07 UTC</div> : null}
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 8}}>(illustrative command)</div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 0, top: 560}}><Bars tilt={-6} load={(i) => 0.3 + 0.67 * cool + jitter(i, f) * (0.4 + cool)} /></div>
      {f > L(52.3) ? <div style={{position: "absolute", left: 64, top: 1110, fontFamily: SANS, fontSize: 52, fontWeight: 900, color: C.g, opacity: out(f, L(52.4), L(52.8))}}>CPU → normal ✓</div> : null}
      {f > L(53.8) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1240}}>
          <Slam at={L(53.91)} size={150} color={C.g}>~27 min</Slam>
          <div style={{fontFamily: MONO, fontSize: 26, color: "#A3A7B0", marginTop: 12, opacity: out(f, L(54.3), L(54.7))}}>13:42 → 14:09 UTC · rule rolled back, WAF on at 14:52</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lesson =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (x: number) => T(x) - off;
  const cards: [number, string, string, string][] = [
    [56.57, "01", "Regex is code", "test its CPU cost, not just its matches"],
    [59.75, "02", "Config is code", "roll it out in stages, like a deploy"],
  ];
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 90, top: 340, display: "flex", flexDirection: "column", gap: 34}}>
        {cards.map(([at, n, t, sub], i) => {
          const p = out(f, L(at), L(at) + 12);
          return f > L(at) - 1 ? (
            <div key={i} style={{transform: `translateY(${(1 - p) * 80}px)`, opacity: p}}>
              <Slab w={952} h={190} d={42} rx={-10} ry={Math.sin(f / 40 + i) * 6} color="#20232A" radius={24} glow={C.g}
                front={<div style={{display: "flex", alignItems: "center", gap: 30, height: "100%", padding: "0 36px"}}>
                  <span style={{fontFamily: MONO, fontSize: 64, fontWeight: 800, color: C.g}}>{n}</span>
                  <div>
                    <div style={{fontFamily: SANS, fontSize: 56, fontWeight: 900}}>{t}</div>
                    <div style={{fontFamily: MONO, fontSize: 26, color: "#A3A7B0", marginTop: 6}}>{sub}</div>
                  </div>
                </div>} />
            </div>
          ) : null;
        })}
      </div>
      {f > L(57.5) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 860, opacity: out(f, L(57.6), L(58))}}>
          <Glass>
            <div style={label}>CLOUDFLARE'S FOLLOW-UPS</div>
            {["profile every rule's CPU in tests", "move to re2 / Rust regex: run-time guarantees", "staged rollout for rule changes"].map((s, i) => (
              <div key={i} style={{fontFamily: MONO, fontSize: 28, marginTop: 14, opacity: out(f, L(57.8) + i * 10, L(58.1) + i * 10)}}><span style={{color: C.g}}>✓</span> {s}</div>
            ))}
          </Glass>
        </div>
      ) : null}
      {f > L(61.8) ? (
        <div style={{position: "absolute", left: 64, right: 90, top: 1300, opacity: out(f, L(61.91), L(62.2))}}>
          <Glass style={{borderLeft: `8px solid ${C.g}`}}>
            <div style={label}>REAL OUTAGES, DEBUGGED</div>
            <div style={{fontFamily: MONO, fontSize: 34, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(61.95), 60)}</div>
          </Glass>
          <div style={{fontFamily: MONO, fontSize: 19, color: C.dim, marginTop: 14}}>Source: Cloudflare blog, "Details of the Cloudflare outage on July 2, 2019"</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// bottom status strip: incident → restored, global CPU meter
const Status: React.FC = () => {
  const f = useCurrentFrame();
  const t = f / 30;
  const cpu = t < 12.6 ? 30 : t < 15.6 ? interpolate(t, [12.6, 15.6], [30, 99]) : t < 51.6 ? 99 : interpolate(t, [51.6, 52.6], [99, 30], clamp);
  const restored = t >= 52.4;
  const col = restored ? C.g : t > 5.1 ? C.bug : AMBER;
  return (
    <div style={{position: "absolute", left: 64, right: 90, top: 1670, height: 80, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}55`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10, fontFamily: MONO, fontSize: 21}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: col, opacity: restored ? 1 : Math.floor(f / 12) % 2 ? 1 : 0.35}} />
      <span style={{color: col, fontWeight: 800, letterSpacing: "0.1em"}}>{restored ? "RESTORED" : "INCIDENT"}</span>
      <span style={{color: C.dim}}>{restored ? "14:09 UTC" : "13:42 UTC"}</span>
      <span style={{marginLeft: "auto", color: C.dim}}>edge CPU</span>
      <div style={{width: 120, height: 12, borderRadius: 6, background: C.line, overflow: "hidden"}}><div style={{width: `${cpu}%`, height: "100%", background: cpu > 85 ? C.bug : C.g}} /></div>
      <span style={{color: cpu > 85 ? C.bug : C.g, width: 64, textAlign: "right"}}>{Math.round(cpu)}%</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [Symptom, Investigate, Regex, Everywhere, Fix, Lesson];

export const DebugDiaries028: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : E28_TOTAL - CUTS[i]));
  const pres = [glitch(), slide({direction: "from-right"}), flip({direction: "from-left"}), clockWipe({width: 1080, height: 1920}), wipe({direction: "from-bottom"})];
  return (
    <AbsoluteFill style={{background: "#121316", color: C.text}}>
      <TransitionSeries>
        {COMPS.map((Comp, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}>
              <Comp off={CUTS[i]} />
            </TransitionSeries.Sequence>
            {i + 1 < COMPS.length ? (
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 1 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR, easing: Easing.inOut(Easing.cubic)})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Status />
      <AbsoluteFill style={{zIndex: 20}}><Hud ep="028" total={E28_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
