// Access Granted (IAM series) · Level 01 · Reel 01 "What is IAM?"
// Same dark terminal template as Debug Diaries, but the accent is purple; the series name stays Debug Diaries green
// to show the connection. Voice: scripts/audio/sarvam_tts.py (shubh_enhi_ads, bulbul:v4-flash, pace 1.1).
// Account data on screen (rahul.k) is illustrative.
import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {fade} from "@remotion/transitions/fade";
import {C, MONO, SANS, clamp, out, typed} from "./cine";
import {Grain, Glass, Marker, Reveal, Push} from "./glass";
import {Slab, Shadow} from "./depth";
import {glitch} from "./tseries";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 7.45, 15.9, 24.84, 33.43, 43.46].map(T);
export const IAM01_TOTAL = T(49.92) + 15;
const TR = 14;

export const P = "#A78BFA"; // purple accent
const G = C.g; // Debug Diaries green: series name only
const big = (size: number, color: string = C.text): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color, textTransform: "uppercase"});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim};
const pop = (f: number, at: number, fps: number) => spring({frame: f - at, fps, config: {damping: 14, mass: 0.6}});

// purple version of the glass background
const IamBg: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 90;
  return (
    <>
      <AbsoluteFill style={{background: "#121316"}} />
      <AbsoluteFill style={{background: `radial-gradient(540px 540px at ${300 + Math.sin(a) * 120}px ${640 + Math.cos(a * 0.8) * 160}px, ${P}30, transparent 70%)`}} />
      <AbsoluteFill style={{background: `radial-gradient(520px 520px at ${780 + Math.cos(a * 0.9) * 110}px ${1250 + Math.sin(a * 0.7) * 180}px, ${P}1C, transparent 70%)`}} />
      <AbsoluteFill style={{backgroundImage: `linear-gradient(${P}0D 2px, transparent 2px), linear-gradient(90deg, ${P}0D 2px, transparent 2px)`, backgroundSize: "72px 72px"}} />
    </>
  );
};

const SectionP: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, top: 262, display: "flex", alignItems: "center", gap: 20, fontFamily: MONO, fontSize: 30, letterSpacing: "0.16em", color: P}}>
      <span style={{width: out(f, 0, 8) * 60, height: 4, background: P}} />
      <span>{typed(text, f, 3, 80)}</span>
    </div>
  );
};

const IamHud: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const tc = `00:${String(Math.floor(sec)).padStart(2, "0")}.${String(Math.floor((sec % 1) * 100)).padStart(2, "0")}`;
  const b = 46, L = 64;
  const corners: [number, number, number, number][] = [[b, b, 1, 1], [1080 - b, b, -1, 1], [b, 1920 - b, 1, -1], [1080 - b, 1920 - b, -1, -1]];
  return (
    <>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {corners.map(([x, y, sx, sy], i) => <path key={i} d={`M${x} ${y + L * sy} L${x} ${y} L${x + L * sx} ${y}`} stroke={C.line} strokeWidth={4} fill="none" />)}
      </svg>
      <div style={{position: "absolute", left: 64, right: 64, top: 140, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em"}}>
        <span style={{color: G}}>ACCESS GRANTED · <span style={{color: P}}>01</span></span>
        <span style={{display: "flex", alignItems: "center", gap: 14, letterSpacing: "0.06em", color: C.dim}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: P, opacity: Math.floor(f / 15) % 2 ? 1 : 0.3}} />
          REC {tc}
        </span>
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 200, height: 5, background: C.line, borderRadius: 3}}>
        <div style={{width: `${(f / IAM01_TOTAL) * 100}%`, height: "100%", background: P, borderRadius: 3}} />
      </div>
    </>
  );
};

// bottom strip: where this reel sits in the 148-reel curriculum
const LevelStrip: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 76, borderRadius: 20, display: "flex", alignItems: "center", gap: 18, padding: "0 22px", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <span style={{fontFamily: MONO, fontSize: 21, color: P, letterSpacing: "0.1em", whiteSpace: "nowrap"}}>LVL 01 · FOUNDATIONS</span>
      <div style={{display: "flex", gap: 8, flex: 1}}>
        {Array.from({length: 10}).map((_, i) => (
          <span key={i} style={{flex: 1, height: 12, borderRadius: 6, background: i === 0 ? P : "rgba(255,255,255,.1)", boxShadow: i === 0 ? `0 0 14px ${P}88` : undefined}} />
        ))}
      </div>
      <span style={{fontFamily: MONO, fontSize: 21, color: C.dim, whiteSpace: "nowrap"}}>01/148</span>
    </div>
  );
};

// ================= 1 · hook =================
const Hook: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const people = Array.from({length: 48});
  const apps = Array.from({length: 16});
  const net = out(f, at(2.8), at(5.2));
  const iam = f >= at(6.55);
  const s = pop(f, at(6.55), fps);
  const pairs = Array.from({length: 60}).map((_, i) => [(i * 37) % 48, (i * 11 + 3) % 16]);
  return (
    <AbsoluteFill>
      <IamBg />
      <Push len={240}>
        <div style={{position: "absolute", left: 64, right: 110, top: 300}}>
          <Reveal at={at(0.99)} size={84}>10,000 employees</Reveal>
          {f >= at(2.0) ? <Reveal at={at(2.0)} size={84} color={P} style={{marginTop: 6}}>500 apps</Reveal> : null}
        </div>
        <div style={{position: "absolute", left: 64, right: 64, top: 560, height: 760, opacity: iam ? 1 - out(f, at(6.55), at(6.55) + 8) : out(f, 0, 12)}}>
          <svg width={952} height={760} style={{position: "absolute", inset: 0}}>
            {pairs.map(([p, a], i) => {
              const k = Math.max(0, Math.min(1, net * 60 - i));
              if (k <= 0) return null;
              const x1 = 70 + (p % 6) * 52, y1 = 60 + Math.floor(p / 6) * 82;
              const x2 = 640 + (a % 4) * 82, y2 = 90 + Math.floor(a / 4) * 170;
              return <line key={i} x1={x1} y1={y1} x2={x1 + (x2 - x1) * k} y2={y1 + (y2 - y1) * k} stroke={i % 5 === 0 ? C.bug : P} strokeOpacity={0.35} strokeWidth={2} />;
            })}
            {people.map((_, i) => <circle key={i} cx={70 + (i % 6) * 52} cy={60 + Math.floor(i / 6) * 82} r={14 * out(f, i * 0.4, i * 0.4 + 8)} fill={C.text} fillOpacity={0.85} />)}
            {apps.map((_, i) => {
              const k = out(f, at(2.0) + i, at(2.0) + i + 8);
              return <rect key={i} x={640 + (i % 4) * 82 - 28 * k} y={90 + Math.floor(i / 4) * 170 - 28 * k} width={56 * k} height={56 * k} rx={12} fill={C.card2} stroke={P} strokeWidth={2.5} />;
            })}
          </svg>
          {f >= at(3.67) ? (
            <div style={{position: "absolute", left: 0, right: 0, top: 690, textAlign: "center"}}>
              <span style={{...big(56), background: "#121316ee", padding: "10px 24px", borderRadius: 14, opacity: out(f, at(3.67), at(3.67) + 6)}}>
                Who opens <Marker at={at(4.4)} color={P}>what?</Marker>
              </span>
            </div>
          ) : null}
          {f >= at(5.19) ? (
            <div style={{position: "absolute", left: 0, right: 0, top: -40, textAlign: "center", ...label, color: C.bug, opacity: out(f, at(5.19), at(5.19) + 6)}}>WHO DECIDES?</div>
          ) : null}
        </div>
        {iam ? (
          <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "grid", placeItems: "center", transform: `scale(${0.4 + 0.6 * s})`, opacity: Math.min(1, s * 2)}}>
            <Slab w={560} h={360} d={60} rx={-10} ry={-14 + Math.sin(f / 18) * 8} color="#1B1A24" glow={P} radius={44}
              front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}><span style={{...big(190, P), letterSpacing: "0.04em"}}>IAM</span></div>} />
            <Shadow w={460} style={{marginTop: 40}} />
          </div>
        ) : null}
      </Push>
    </AbsoluteFill>
  );
};

// ================= 2 · definition =================
const Define: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const words: [string, string][] = [["I", "dentity"], ["A", "ccess"], ["M", "anagement"]];
  const Row: React.FC<{t: number; icon: React.ReactNode; title: string; sub: string; top: number}> = ({t, icon, title, sub, top}) => {
    const s = pop(f, t, fps);
    return (
      <div style={{position: "absolute", left: 64, right: 110, top, transform: `translateX(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.5)}}>
        <Glass glow={P} style={{display: "flex", alignItems: "center", gap: 30, padding: "30px 34px"}}>
          <div style={{width: 110, height: 110, borderRadius: 26, background: `${P}22`, border: `2px solid ${P}88`, display: "grid", placeItems: "center"}}>{icon}</div>
          <div>
            <div style={{...big(60, P)}}>{title}</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.text, marginTop: 10}}>{sub}</div>
          </div>
        </Glass>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="01 / DEFINITION" />
      <div style={{position: "absolute", left: 64, top: 350, display: "flex", flexDirection: "column", gap: 4}}>
        {words.map(([a, rest], i) => {
          const k = out(f, 4 + i * 10, 18 + i * 10);
          return (
            <div key={a} style={{display: "flex", alignItems: "baseline"}}>
              <span style={{...big(104, P)}}>{a}</span>
              <span style={{...big(104), display: "inline-block", overflow: "hidden", whiteSpace: "nowrap", maxWidth: k * 760, opacity: k}}>{rest}</span>
              {i === 0 ? <span style={{...big(104, C.dim), marginLeft: 20, opacity: out(f, 14, 22)}}>&amp;</span> : null}
            </div>
          );
        })}
      </div>
      {f >= at(10.28) ? <Row t={at(10.28)} top={760} title="Identity" sub="who are you?" icon={<svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>} /> : null}
      {f >= at(12.53) ? <Row t={at(12.53)} top={1010} title="Access" sub="what can you open?" icon={<svg width={60} height={60} viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth={2}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0" /></svg>} /> : null}
      {f >= at(14.58) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1290, display: "flex", alignItems: "center", gap: 18, opacity: out(f, at(14.58), at(14.58) + 8)}}>
          <span style={{...label, color: C.text, fontSize: 30, letterSpacing: "0.06em"}}>IAM manages</span>
          <span style={{...big(56)}}><Marker at={at(14.9)} color={P}>both</Marker></span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · office analogy =================
const Analogy: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const rows = [
    {t: at(17.03), eq: at(18.26), what: "ID badge", is: "Identity", front: (
      <div style={{padding: 18, display: "flex", gap: 14, alignItems: "center", height: "100%", boxSizing: "border-box"}}>
        <div style={{width: 64, height: 78, borderRadius: 10, background: P}} />
        <div style={{flex: 1}}><div style={{height: 12, background: "#ffffff55", borderRadius: 6, marginBottom: 10}} /><div style={{height: 12, width: "60%", background: "#ffffff33", borderRadius: 6}} /></div>
      </div>
    )},
    {t: at(19.36), eq: at(21.05), what: "Guard checks it", is: "Authentication", front: (
      <div style={{height: "100%", display: "grid", placeItems: "center"}}>
        <svg width={92} height={92} viewBox="0 0 24 24" fill="none" stroke={P} strokeWidth={1.8}><path d="M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z" /><path d="M8.5 12l2.5 2.5 4.5-5" /></svg>
      </div>
    )},
    {t: at(22.04), eq: at(23.91), what: "Floors it opens", is: "Authorization", front: (
      <div style={{height: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, padding: 20, boxSizing: "border-box"}}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const ok = n <= 2 || n === 4;
          const lit = f > at(22.6) + n * 3;
          return <div key={n} style={{borderRadius: 10, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 24, fontWeight: 700, background: lit ? (ok ? `${P}55` : `${C.bug}33`) : "#ffffff10", color: lit ? (ok ? C.text : C.bug) : C.dim}}>{lit && !ok ? "✕" : n}</div>;
        })}
      </div>
    )},
  ];
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="02 / OFFICE ANALOGY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}><Reveal at={4} size={72}>Think of an office</Reveal></div>
      {rows.map((r, i) => {
        if (f < r.t) return null;
        const s = pop(f, r.t, fps);
        return (
          <div key={i} style={{position: "absolute", left: 64, right: 80, top: 500 + i * 380, height: 330, display: "flex", alignItems: "center", gap: 40}}>
            <div style={{transform: `scale(${0.5 + 0.5 * s})`, opacity: Math.min(1, s * 2)}}>
              <Slab w={300} h={210} d={34} rx={-10} ry={22 + Math.sin((f + i * 20) / 30) * 6} color="#1E1D28" glow={f >= r.eq ? P : undefined} radius={26} front={r.front} />
            </div>
            <div>
              <div style={{fontFamily: MONO, fontSize: 30, color: C.dim, opacity: Math.min(1, s * 2)}}>{r.what}</div>
              {f >= r.eq ? <div style={{marginTop: 12}}><Reveal at={r.eq} size={62} color={P}>{`= ${r.is}`}</Reveal></div> : null}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ================= 4 · why it matters =================
const Danger: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (s: number) => T(s) - off;
  const blink = Math.floor(f / 8) % 2 ? 1 : 0.35;
  const line = (t: number, children: React.ReactNode) => (f >= t ? <div style={{opacity: out(f, t, t + 5)}}>{children}</div> : null);
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="03 / WHY IT MATTERS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}><Reveal at={at(25.61)} size={68}>Employee leaves...</Reveal></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470}}>
        <Glass style={{padding: 0, overflow: "hidden"}}>
          <div style={{display: "flex", alignItems: "center", gap: 11, padding: "14px 22px", borderBottom: `2px solid ${C.line}`}}>
            {[0, 1, 2].map((i) => <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: "#3A3C42"}} />)}
            <span style={{marginLeft: 10, fontFamily: MONO, fontSize: 22, color: C.dim}}>hr-sync · illustrative</span>
          </div>
          <div style={{padding: "22px 28px", fontFamily: MONO, fontSize: 30, lineHeight: 1.7, whiteSpace: "pre"}}>
            <div><span style={{color: P}}>$</span> {typed("iam status rahul.k", f, at(25.9), 40)}</div>
            {line(at(26.4), <div>employee : <span style={{color: C.dim}}>LEFT company</span></div>)}
            {line(at(27.16), <div>account  : <span style={{color: C.bug, opacity: blink}}>● ACTIVE</span></div>)}
            {line(at(28.41), <div style={{marginTop: 10}}><span style={{color: P}}>$</span> {typed("login rahul.k  (from home)", f, at(28.41), 40)}</div>)}
            {line(at(29.2), <div><span style={{color: C.bug}}>✓ access granted</span></div>)}
            {line(at(29.6), <div style={{color: C.dim}}>opened  payroll.xlsx</div>)}
            {line(at(29.9), <div style={{color: C.dim}}>opened  customers.csv</div>)}
          </div>
        </Glass>
      </div>
      {f >= at(30.34) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1180}}>
          <div style={{...label, color: C.bug, marginBottom: 14, opacity: out(f, at(30.34), at(30.34) + 6)}}>MOST BREACHES START WITH</div>
          <Reveal at={at(30.6)} size={78}>Bad or stolen</Reveal>
          <div style={{...big(78, C.bug), marginTop: 6, opacity: out(f, at(31.4), at(31.4) + 6)}}><Marker at={at(31.6)} color={C.bug}>credentials</Marker></div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · what IAM covers =================
const Covers: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const items: [string, number][] = [["Login", 34.67], ["MFA", 35.36], ["Single sign-on", 36.37], ["Roles & permissions", 37.41], ["Onboarding access", 38.89], ["Offboarding access", 40.13], ["Audit", 40.93]];
  const fin = f >= at(41.82);
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="04 / WHAT IAM COVERS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 340, display: "flex", flexDirection: "column", gap: 18, opacity: fin ? 1 - 0.55 * out(f, at(41.82), at(41.82) + 10) : 1}}>
        {items.map(([t, s]) => {
          if (f < at(s)) return <div key={t} style={{height: 92}} />;
          const k = pop(f, at(s), fps);
          return (
            <div key={t} style={{height: 92, display: "flex", alignItems: "center", gap: 24, padding: "0 28px", borderRadius: 22, background: `${P}14`, border: `2px solid ${P}55`, transform: `translateX(${(1 - k) * 160}px)`, opacity: Math.min(1, k * 1.6)}}>
              <span style={{width: 44, height: 44, borderRadius: 12, background: P, display: "grid", placeItems: "center", color: "#121316", fontSize: 28, fontWeight: 900}}>✓</span>
              <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 44, color: C.text}}>{t}</span>
            </div>
          );
        })}
      </div>
      {fin ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1180, padding: "30px 34px", borderRadius: 28, background: "#1B1A24", border: `2.5px solid ${P}`, boxShadow: `0 0 60px ${P}55`, transform: `scale(${0.7 + 0.3 * pop(f, at(41.82), fps)})`}}>
          <div style={{...label, color: P}}>THIS SERIES</div>
          <div style={{...big(84), marginTop: 10}}>18 levels · 148 reels</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · clearance check =================
const Quiz: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const opt = (t: number, k: string, txt: string, top: number) => {
    if (f < t) return null;
    const s = pop(f, t, fps);
    return (
      <div style={{position: "absolute", left: 64, right: 110, top, height: 120, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", borderRadius: 24, background: C.card, border: `2.5px solid ${P}77`, transform: `scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2)}}>
        <span style={{...big(56, P)}}>{k}</span>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52}}>{txt}</span>
      </div>
    );
  };
  const end = f >= at(48.8);
  return (
    <AbsoluteFill>
      <IamBg />
      <div style={{position: "absolute", left: 64, top: 290}}><Reveal at={0} size={88} color={P}>Clearance check</Reveal></div>
      <div style={{position: "absolute", left: 64, top: 400, ...label}}>Q01</div>
      {f >= at(44.26) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 480, fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.2, opacity: out(f, at(44.26), at(44.26) + 8)}}>
          Showing your badge to the guard is...
        </div>
      ) : null}
      {opt(at(45.93), "A", "Authentication", 760)}
      {opt(at(46.9), "B", "Authorization", 910)}
      {f >= at(47.89) ? <div style={{position: "absolute", left: 64, right: 110, top: 1090, ...label, color: P, fontSize: 30, opacity: out(f, at(47.89), at(47.89) + 6)}}>answer in reel 02 →</div> : null}
      {end ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1230, padding: "26px 30px", borderRadius: 26, background: "#152018", border: `2.5px solid ${G}`, display: "flex", alignItems: "center", gap: 22, transform: `translateY(${(1 - pop(f, at(48.8), fps)) * 80}px)`}}>
          <span style={{fontFamily: MONO, fontSize: 30, color: G}}>Follow</span>
          <span style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.text}}>@debugdiaries.io</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const COMPS: React.FC<{off: number}>[] = [Hook, Define, Analogy, Danger, Covers, Quiz];

export const Iam01: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : IAM01_TOTAL - CUTS[i]));
  const pres = [glitch(), slide({direction: "from-right"}), wipe({direction: "from-bottom"}), clockWipe({width: 1080, height: 1920}), fade()];
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
      <LevelStrip />
      <AbsoluteFill style={{zIndex: 20}}><IamHud /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
