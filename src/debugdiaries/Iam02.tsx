// Access Granted (IAM series) · Level 01 · Reel 02 "Identity vs account vs credential"
// Template copied from Iam01 (purple accent, green series name). Voice: scripts/audio/sarvam_tts.py (shubh_enhi_ads).
// Names (Priya), account IDs and the terminal output are illustrative.
import React from "react";
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {flip} from "@remotion/transitions/flip";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {C, MONO, SANS, out, typed} from "./cine";
import {Grain, Glass, Marker, Reveal, Push} from "./glass";
import {Slab, Shadow} from "./depth";
import {glitch} from "./tseries";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 10.15, 17.28, 24.02, 33.76, 44.08].map(T);
export const IAM02_TOTAL = T(51.43) + 15;
const TR = 14;

export const P = "#A78BFA";
const G = C.g;
const big = (size: number, color: string = C.text): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color, textTransform: "uppercase"});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim};
const pop = (f: number, at: number, fps: number) => spring({frame: f - at, fps, config: {damping: 14, mass: 0.6}});

const PersonIcon: React.FC<{s?: number; c?: string}> = ({s = 60, c = P}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>;
const GearIcon: React.FC<{s?: number; c?: string}> = ({s = 60, c = P}) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth={2}><circle cx="12" cy="12" r="3.2" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></svg>;
const Badge: React.FC<{name: string; c?: string; tag?: string}> = ({name, c = P, tag = "EMP"}) => (
  <div style={{height: "100%", display: "flex", gap: 18, alignItems: "center", padding: 22, boxSizing: "border-box"}}>
    <div style={{width: 84, height: 100, borderRadius: 14, background: `${c}33`, border: `2px solid ${c}`, display: "grid", placeItems: "center"}}><PersonIcon s={56} c={c} /></div>
    <div>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 40, color: C.text}}>{name}</div>
      <div style={{fontFamily: MONO, fontSize: 22, color: c, marginTop: 8}}>{tag}</div>
    </div>
  </div>
);

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
        <span style={{color: G}}>ACCESS GRANTED · <span style={{color: P}}>02</span></span>
        <span style={{display: "flex", alignItems: "center", gap: 14, letterSpacing: "0.06em", color: C.dim}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: P, opacity: Math.floor(f / 15) % 2 ? 1 : 0.3}} />
          REC {tc}
        </span>
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 200, height: 5, background: C.line, borderRadius: 3}}>
        <div style={{width: `${(f / IAM02_TOTAL) * 100}%`, height: "100%", background: P, borderRadius: 3}} />
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
          <span key={i} style={{flex: 1, height: 12, borderRadius: 6, background: i === 1 ? P : "rgba(255,255,255,.1)", boxShadow: i === 1 ? `0 0 14px ${P}88` : undefined}} />
        ))}
      </div>
      <span style={{fontFamily: MONO, fontSize: 21, color: C.dim, whiteSpace: "nowrap"}}>02/148</span>
    </div>
  );
};

// ================= 1 · quiz answer + hook =================
const Hook: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const ans = pop(f, at(1.14), fps);
  const today = f >= at(5.18);
  const words: [string, number][] = [["Identity", 6.18], ["Account", 6.6], ["Credential", 7.05]];
  return (
    <AbsoluteFill>
      <IamBg />
      <Push len={320}>
        <div style={{opacity: today ? 1 - out(f, at(5.18), at(5.18) + 8) : 1}}>
          <div style={{position: "absolute", left: 64, top: 300, ...label, color: P}}>Q01 · ANSWER</div>
          <div style={{position: "absolute", left: 64, right: 110, top: 350, fontFamily: SANS, fontWeight: 800, fontSize: 50, lineHeight: 1.2, opacity: out(f, 0, 8)}}>Showing your badge to the guard is...</div>
          {f >= at(1.14) ? (
            <div style={{position: "absolute", left: 0, right: 0, top: 620, display: "grid", placeItems: "center", transform: `scale(${0.5 + 0.5 * ans})`, opacity: Math.min(1, ans * 2)}}>
              <Slab w={760} h={240} d={50} rx={-8} ry={-12 + Math.sin(f / 20) * 8} color="#1B1A24" glow={P} radius={36}
                front={<div style={{height: "100%", display: "flex", alignItems: "center", gap: 26, padding: "0 40px"}}><span style={{width: 96, height: 96, borderRadius: 48, background: P, display: "grid", placeItems: "center", color: "#121316", fontSize: 60, fontWeight: 900}}>✓</span><span style={{...big(66), whiteSpace: "nowrap"}}>A · Authentication</span></div>} />
              <Shadow w={620} style={{marginTop: 34}} />
            </div>
          ) : null}
          {f >= at(1.78) ? (
            <div style={{position: "absolute", left: 64, right: 110, top: 1060, opacity: out(f, at(1.78), at(1.78) + 8)}}>
              <Glass glow={P} style={{padding: "28px 32px", fontFamily: MONO, fontSize: 34, lineHeight: 1.5}}>
                guard <span style={{color: P}}>verifies</span> you are<br />who you <Marker at={at(3.4)} color={P}>claim to be</Marker>
              </Glass>
            </div>
          ) : null}
        </div>
        {today ? (
          <div style={{position: "absolute", left: 64, right: 110, top: 330}}>
            <div style={{...label, color: P, opacity: out(f, at(5.18), at(5.18) + 6)}}>TODAY · 3 WORDS</div>
            {words.map(([w, t], i) => {
              if (f < at(t)) return null;
              const s = pop(f, at(t), fps);
              const neq = f >= at(9.53);
              return (
                <div key={w} style={{marginTop: i === 0 ? 40 : 0}}>
                  <div style={{...big(150, i === 1 ? P : C.text), transform: `translateX(${(1 - s) * -200}px) skewX(${(1 - s) * -12}deg)`, opacity: Math.min(1, s * 2)}}>{w}</div>
                  {i < 2 ? <div style={{...big(90, neq ? C.bug : C.dim), margin: "6px 0 10px 10px", opacity: out(f, at(8.11) + i * 4, at(8.11) + i * 4 + 6)}}>{neq ? "≠" : "="}</div> : null}
                </div>
              );
            })}
            {f >= at(9.53) ? <div style={{marginTop: 50}}><Reveal at={at(9.53)} size={60} color={C.bug}>not the same thing</Reveal></div> : null}
          </div>
        ) : null}
      </Push>
    </AbsoluteFill>
  );
};

// ================= 2 · identity =================
const Identity: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const card = (t: number, icon: React.ReactNode, title: string, sub: string, x: number) => {
    if (f < at(t)) return null;
    const s = pop(f, at(t), fps);
    return (
      <div style={{position: "absolute", left: x, top: 520, width: 420, transform: `translateY(${(1 - s) * 120}px)`, opacity: Math.min(1, s * 1.6)}}>
        <Glass glow={P} style={{padding: "30px 28px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16}}>
          {icon}
          <div style={{...big(52, P)}}>{title}</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim}}>{sub}</div>
        </Glass>
      </div>
    );
  };
  const priya = f >= at(13.45);
  const ps = pop(f, at(13.45), fps);
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="01 / IDENTITY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}><Reveal at={4} size={84}>Identity = you</Reveal></div>
      {card(11.57, <PersonIcon s={110} />, "Human", "a real person", 64)}
      {card(12.53, <GearIcon s={110} />, "Service", "an app or bot", 560)}
      {priya ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 960, display: "grid", placeItems: "center", transform: `scale(${0.5 + 0.5 * ps})`, opacity: Math.min(1, ps * 2)}}>
          <Slab w={560} h={230} d={40} rx={-12} ry={18 + Math.sin(f / 22) * 10} color="#1E1D28" glow={P} radius={28} front={<Badge name="Priya" tag="identity · illustrative" />} />
          <Shadow w={460} style={{marginTop: 30}} />
        </div>
      ) : null}
      {f >= at(15.65) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1360, textAlign: "center", opacity: out(f, at(15.65), at(15.65) + 6)}}>
          <span style={{...big(66)}}>1 person = <Marker at={at(16.1)} color={P}>1 identity</Marker></span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · accounts =================
const Accounts: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const accs: [string, string, number][] = [["Email", "priya@corp", 19.5], ["HR app", "EMP-2041", 20.4], ["Cloud", "priya.dev", 21.3]];
  const cx = 540, cy = 640;
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="02 / ACCOUNT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}><Reveal at={at(17.99)} size={64}>A record inside one system</Reveal></div>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {accs.map(([, , t], i) => {
          const k = out(f, at(t), at(t) + 10);
          const x2 = 200 + i * 340, y2 = 1060;
          return <line key={i} x1={cx} y1={cy + 90} x2={cx + (x2 - cx) * k} y2={cy + 90 + (y2 - cy - 90) * k} stroke={P} strokeOpacity={0.6} strokeWidth={4} strokeDasharray="12 10" strokeDashoffset={-f} />;
        })}
      </svg>
      <div style={{position: "absolute", left: cx - 110, top: cy - 110, width: 220, height: 220, borderRadius: 110, background: "#1B1A24", border: `3px solid ${P}`, boxShadow: `0 0 60px ${P}66`, display: "grid", placeItems: "center", transform: `scale(${pop(f, 6, fps)})`}}>
        <div style={{textAlign: "center"}}><PersonIcon s={84} /><div style={{fontFamily: MONO, fontSize: 24, color: C.text}}>Priya</div></div>
      </div>
      {accs.map(([n, id, t], i) => {
        if (f < at(t)) return null;
        const s = pop(f, at(t), fps);
        return (
          <div key={n} style={{position: "absolute", left: 200 + i * 340 - 150, top: 1030, width: 300, transform: `scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * 10}deg)`, opacity: Math.min(1, s * 2)}}>
            <Glass style={{padding: "26px 22px"}}>
              <div style={{...label, color: P}}>ACCOUNT</div>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 46, marginTop: 10}}>{n}</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 8}}>{id}</div>
            </Glass>
          </div>
        );
      })}
      {f >= at(22.4) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1380, textAlign: "center", opacity: out(f, at(22.4), at(22.4) + 6)}}>
          <span style={{...big(68)}}>1 identity → <Marker at={at(23.37)} color={P}>many accounts</Marker></span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · credentials =================
const Creds: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const at = (s: number) => T(s) - off;
  const items: [string, string, number][] = [["Password", "something you know", 26.77], ["OTP", "one-time code", 27.37], ["Security key", "hardware key", 27.96], ["API token", "for services", 28.82]];
  const swap = f >= at(31.37);
  const lost = out(f, at(31.37), at(31.37) + 14);
  const nb = pop(f, at(32.21), fps);
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="03 / CREDENTIAL" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}><Reveal at={4} size={70}>The proof you log in with</Reveal></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 520, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, opacity: swap ? 1 - 0.6 * lost : 1}}>
        {items.map(([n, sub, t]) => {
          if (f < at(t)) return <div key={n} style={{height: 150}} />;
          const s = pop(f, at(t), fps);
          return (
            <div key={n} style={{height: 150, borderRadius: 24, background: `${P}14`, border: `2px solid ${P}66`, padding: "22px 26px", boxSizing: "border-box", transform: `translateY(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 1.6)}}>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 44}}>{n}</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 10}}>{sub}</div>
            </div>
          );
        })}
      </div>
      {f >= at(29.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 900, ...label, color: P, fontSize: 30, opacity: out(f, at(29.9), at(29.9) + 6)}}>IN THE OFFICE = YOUR BADGE</div>
      ) : null}
      {f >= at(29.9) ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 980, height: 300}}>
          <div style={{position: "absolute", left: 90, top: 0, transform: `translate(${lost * -60}px, ${lost * 160}px) rotate(${lost * -18}deg)`, opacity: 1 - lost * 0.7}}>
            <Slab w={420} h={190} d={32} rx={-10} ry={20} color="#1E1D28" glow={swap ? C.bug : P} radius={24} front={<Badge name="Badge #1" c={swap ? C.bug : P} tag={swap ? "LOST · revoked" : "credential"} />} />
          </div>
          {f >= at(32.21) ? (
            <div style={{position: "absolute", right: 90, top: 0, transform: `scale(${0.5 + 0.5 * nb}) translateY(${(1 - nb) * -120}px)`, opacity: Math.min(1, nb * 2)}}>
              <Slab w={420} h={190} d={32} rx={-10} ry={-20 + Math.sin(f / 20) * 6} color="#1E1D28" glow={P} radius={24} front={<Badge name="Badge #2" tag="new credential" />} />
            </div>
          ) : null}
        </div>
      ) : null}
      {f >= at(32.96) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1350, textAlign: "center", opacity: out(f, at(32.96), at(32.96) + 6)}}>
          <span style={{...big(64)}}>Priya stays <Marker at={at(33.2)} color={P}>Priya</Marker></span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · terminal =================
const Term: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const at = (s: number) => T(s) - off;
  const line = (t: number, children: React.ReactNode) => (f >= at(t) ? <div style={{opacity: out(f, at(t), at(t) + 5)}}>{children}</div> : null);
  const disabled = f >= at(41.77);
  const rotated = f >= at(39.86);
  const st = (on: boolean) => <span style={{color: on ? C.bug : P}}>{on ? "● disabled" : "● active"}</span>;
  return (
    <AbsoluteFill>
      <IamBg />
      <SectionP text="04 / IN A REAL SYSTEM" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330}}>
        <Glass style={{padding: 0, overflow: "hidden"}}>
          <div style={{display: "flex", alignItems: "center", gap: 11, padding: "14px 22px", borderBottom: `2px solid ${C.line}`}}>
            {[0, 1, 2].map((i) => <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: "#3A3C42"}} />)}
            <span style={{marginLeft: 10, fontFamily: MONO, fontSize: 22, color: C.dim}}>directory · illustrative</span>
          </div>
          <div style={{padding: "22px 28px", fontFamily: MONO, fontSize: 28, lineHeight: 1.65, whiteSpace: "pre"}}>
            <div><span style={{color: P}}>$</span> {typed("iam show priya", f, 4, 40)}</div>
            {line(34.7, <div>identity  <span style={{color: P}}>uid-7f3a</span>  (Priya)</div>)}
            {line(35.84, <div style={{marginTop: 8}}>├─ account  email   {st(disabled)}</div>)}
            {line(36.3, <div>├─ account  cloud   {st(disabled)}</div>)}
            {line(37.13, <div>│   cred: password  {rotated ? <span style={{color: P}}>↻ rotated</span> : <span style={{color: C.dim}}>set</span>}</div>)}
            {line(37.6, <div>│   cred: api-token <span style={{color: C.dim}}>••••</span></div>)}
          </div>
        </Glass>
      </div>
      {f >= at(38.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 960, display: "flex", flexDirection: "column", gap: 24}}>
          <div style={{display: "flex", alignItems: "center", gap: 22, padding: "24px 28px", borderRadius: 22, background: `${C.bug}14`, border: `2px solid ${C.bug}66`, opacity: out(f, at(38.9), at(38.9) + 6)}}>
            <span style={{fontFamily: MONO, fontSize: 30, color: C.bug, width: 300}}>password leak</span>
            {rotated ? <span style={{...big(50, P)}}>→ rotate credential</span> : null}
          </div>
          {f >= at(40.87) ? (
            <div style={{display: "flex", alignItems: "center", gap: 22, padding: "24px 28px", borderRadius: 22, background: `${C.bug}14`, border: `2px solid ${C.bug}66`, opacity: out(f, at(40.87), at(40.87) + 6)}}>
              <span style={{fontFamily: MONO, fontSize: 30, color: C.bug, width: 300}}>employee left</span>
              {disabled ? <span style={{...big(50, P)}}>→ disable identity</span> : null}
            </div>
          ) : null}
          {f >= at(42.82) ? <div style={{...label, color: P, fontSize: 28, opacity: out(f, at(42.82), at(42.82) + 6)}}>linked accounts (via SSO / IdP) all go off</div> : null}
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
    if (f < at(t)) return null;
    const s = pop(f, at(t), fps);
    return (
      <div style={{position: "absolute", left: 64, right: 110, top, height: 120, display: "flex", alignItems: "center", gap: 26, padding: "0 30px", borderRadius: 24, background: C.card, border: `2.5px solid ${P}77`, transform: `scale(${0.85 + 0.15 * s})`, opacity: Math.min(1, s * 2)}}>
        <span style={{...big(56, P)}}>{k}</span>
        <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 52}}>{txt}</span>
      </div>
    );
  };
  const end = f >= at(50.27);
  return (
    <AbsoluteFill>
      <IamBg />
      <div style={{position: "absolute", left: 64, top: 290}}><Reveal at={0} size={88} color={P}>Clearance check</Reveal></div>
      <div style={{position: "absolute", left: 64, top: 400, ...label}}>Q02</div>
      {f >= at(44.94) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 480, fontFamily: SANS, fontWeight: 800, fontSize: 58, lineHeight: 1.2, opacity: out(f, at(44.94), at(44.94) + 8)}}>
          Your password leaked. <span style={{color: C.bug}}>What do you change?</span>
        </div>
      ) : null}
      {opt(46.7, "A", "Identity", 760)}
      {opt(47.6, "B", "Credential", 910)}
      {f >= at(48.37) ? <div style={{position: "absolute", left: 64, right: 110, top: 1090, ...label, color: P, fontSize: 30, opacity: out(f, at(48.37), at(48.37) + 6)}}>answer in reel 03 →</div> : null}
      {end ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1230, padding: "26px 30px", borderRadius: 26, background: "#152018", border: `2.5px solid ${G}`, display: "flex", alignItems: "center", gap: 22, transform: `translateY(${(1 - pop(f, at(50.27), fps)) * 80}px)`}}>
          <span style={{fontFamily: MONO, fontSize: 30, color: G}}>Follow</span>
          <span style={{fontFamily: MONO, fontSize: 38, fontWeight: 700, color: C.text}}>@debugdiaries.io</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const COMPS: React.FC<{off: number}>[] = [Hook, Identity, Accounts, Creds, Term, Quiz];

export const Iam02: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : IAM02_TOTAL - CUTS[i]));
  const pres = [slide({direction: "from-left"}), flip({direction: "from-right"}), wipe({direction: "from-top"}), glitch(), clockWipe({width: 1080, height: 1920})];
  return (
    <AbsoluteFill style={{background: "#121316", color: C.text}}>
      <TransitionSeries>
        {COMPS.map((Comp, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}>
              <Comp off={CUTS[i]} />
            </TransitionSeries.Sequence>
            {i + 1 < COMPS.length ? (
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 2 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
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
