// Sunday Inside · EP 02 "One grey tick, two, then blue — how does a WhatsApp message actually get delivered?" — 8 chapters.
// Based on the WhatsApp Encryption Overview / Security Whitepaper (long-lived client↔server connection secured with the
// Noise Protocol Framework; Signal protocol end-to-end encryption; public "prekey" bundles fetched from the server to start
// a session; per-device encrypted copies in multi-device), the WhatsApp Privacy Policy (undelivered messages kept
// encrypted on servers up to 30 days; deleted once delivered) and the WhatsApp Help Center on check marks
// (one grey = sent, two grey = delivered, two blue = read; groups turn blue when all participants have read; no blue
// with read receipts off). Flow is SIMPLIFIED on screen (marked). Chat text and ciphertext are illustrative.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/inside-02/voice.wav, repo default pace / pauses).
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, Easing, spring, useVideoConfig} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {flip} from "@remotion/transitions/flip";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {iris} from "@remotion/transitions/iris";
import {fade} from "@remotion/transitions/fade";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal} from "./glass";
import {Slab, Shadow} from "./depth";

const T = (s: number) => Math.round(s * 30);
const PARTS = [0.06, 11.263, 24.199, 35.965, 45.586, 57.521, 71.995, 84.365];
const CUTS = PARTS.map((s, i) => (i === 0 ? 0 : T(s - 0.04)));
export const I2_TOTAL = T(99.36) + 36;
const TR = 16;

const GREY = "#9AA0A8";
const BLUE = "#4FC3F7";
const LILAC = "#C4A7FF";
const ease3 = Easing.inOut(Easing.cubic);

// ---------- shared pieces ----------
const Tick: React.FC<{n: 1 | 2; color: string; size?: number; at?: number}> = ({n, color, size = 60, at = -99}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, mass: 0.5}});
  const w = size * (n === 2 ? 1.45 : 1);
  return (
    <svg width={w} height={size} viewBox={`0 0 ${n === 2 ? 36 : 24} 24`} style={{transform: `scale(${s})`, overflow: "visible"}}>
      <path d="M3 13 L9 19 L21 6" stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {n === 2 ? <path d="M15 19 L33 6" stroke={color} strokeWidth={3.2} fill="none" strokeLinecap="round" /> : null}
    </svg>
  );
};

const Lock: React.FC<{open?: number; size?: number; color?: string}> = ({open = 0, size = 80, color = C.g}) => (
  <svg width={size} height={size * 1.15} viewBox="0 0 40 46" style={{overflow: "visible"}}>
    <path d={`M11 ${20 - open * 8} V13 a9 9 0 0 1 18 0 V20`} transform={`translate(${open * 8} 0)`} stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" />
    <rect x={5} y={20} width={30} height={23} rx={5} fill={color} />
    <circle cx={20} cy={30} r={3.2} fill="#121316" />
    <rect x={18.6} y={31} width={2.8} height={7} rx={1.2} fill="#121316" />
  </svg>
);

// 3D phone: an extruded slab with a chat screen on its face.
const Phone: React.FC<{label: string; ry?: number; dim?: number; children?: React.ReactNode; w?: number; h?: number; glow?: string}> = ({label, ry = 0, dim = 0, children, w = 250, h = 440, glow}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "relative", width: w, height: h + 80}}>
      <div style={{filter: dim ? `grayscale(${dim}) brightness(${1 - dim * 0.45})` : undefined}}>
        <Slab w={w} h={h} d={34} rx={8} ry={ry + Math.sin(f / 40) * 3} radius={38} color="#1B1D22" glow={glow}
          front={<div style={{position: "absolute", inset: 0, padding: "34px 16px 16px"}}>
            <div style={{position: "absolute", left: w / 2 - 34, top: 12, width: 68, height: 14, borderRadius: 7, background: "#000"}} />
            {children}
          </div>} />
      </div>
      <Shadow w={w} style={{marginTop: 18}} />
      <div style={{position: "absolute", left: 0, right: 0, top: h + 30, textAlign: "center", fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>{label}</div>
    </div>
  );
};

const Server: React.FC<{children?: React.ReactNode; glow?: string; w?: number; h?: number}> = ({children, glow = C.g, w = 380, h = 200}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "relative", width: w}}>
      <Slab w={w} h={h} d={90} rx={-14} ry={Math.sin(f / 50) * 6} radius={18} color="#23262C" glow={glow}
        front={<div style={{position: "absolute", inset: 0, padding: 18}}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{display: "flex", alignItems: "center", gap: 10, height: 20, marginBottom: 10}}>
              <span style={{width: 10, height: 10, borderRadius: 5, background: (Math.floor(f / 8) + i) % 3 ? C.g : "#2E3B33"}} />
              <span style={{flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,.08)"}} />
            </div>
          ))}
          <div style={{position: "absolute", left: 18, bottom: 14, fontFamily: MONO, fontSize: 20, letterSpacing: "0.16em", color: C.dim}}>CHAT SERVER</div>
          {children}
        </div>} />
      <Shadow w={w} style={{marginTop: 30}} op={0.6} />
    </div>
  );
};

const Bubble: React.FC<{text: string; ticks?: React.ReactNode; me?: boolean; style?: React.CSSProperties}> = ({text, ticks, me = true, style}) => (
  <div style={{marginLeft: me ? "auto" : 0, maxWidth: "88%", padding: "12px 14px", borderRadius: 16, background: me ? "#1F4D36" : "#2A2D33", fontFamily: SANS, fontSize: 26, fontWeight: 600, color: C.text, display: "flex", alignItems: "flex-end", gap: 8, ...style}}>
    <span style={{lineHeight: 1.15}}>{text}</span>
    {ticks}
  </div>
);

// glowing packet between two points
const Packet: React.FC<{from: [number, number]; to: [number, number]; a: number; b: number; color?: string; label?: string; locked?: boolean}> = ({from, to, a, b, color = C.g, label, locked}) => {
  const f = useCurrentFrame();
  if (f < a || f > b + 8) return null;
  const p = interpolate(f, [a, b], [0, 1], {...clamp, easing: ease3});
  const x = from[0] + (to[0] - from[0]) * p, y = from[1] + (to[1] - from[1]) * p - Math.sin(p * Math.PI) * 60;
  const o = interpolate(f, [b, b + 8], [1, 0], clamp);
  return (
    <div style={{position: "absolute", left: x - 46, top: y - 30, width: 92, height: 60, borderRadius: 14, background: `${color}26`, border: `3px solid ${color}`, boxShadow: `0 0 40px ${color}aa`, opacity: o, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: MONO, fontSize: 18, fontWeight: 700, color, zIndex: 5}}>
      {locked ? <Lock size={26} color={color} /> : null}{label}
    </div>
  );
};

const Wire: React.FC<{from: [number, number]; to: [number, number]; at: number; color?: string; dashed?: boolean; flow?: boolean}> = ({from, to, at, color = C.g, dashed, flow}) => {
  const f = useCurrentFrame();
  const p = out(f, at, at + 18);
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0, pointerEvents: "none"}}>
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeOpacity={0.25} strokeWidth={16} strokeLinecap="round" strokeDasharray={`${len * p} ${len}`} />
      <line x1={from[0]} y1={from[1]} x2={to[0]} y2={to[1]} stroke={color} strokeWidth={4} strokeLinecap="round"
        strokeDasharray={dashed ? "14 14" : flow ? "4 22" : `${len * p} ${len}`} strokeDashoffset={flow ? -f * 2 : 0} opacity={dashed || flow ? p : 1} />
    </svg>
  );
};

const Chip: React.FC<{text: string; color?: string; at: number; style?: React.CSSProperties}> = ({text, color = C.g, at, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 14, mass: 0.6}});
  return (
    <div style={{position: "absolute", padding: "12px 20px", borderRadius: 16, border: `2.5px solid ${color}`, background: `${color}1A`, fontFamily: MONO, fontSize: 28, color, whiteSpace: "nowrap", opacity: Math.min(1, s * 1.4), transform: `translateY(${(1 - s) * 30}px) scale(${0.85 + s * 0.15})`, ...style}}>{text}</div>
  );
};

const Note: React.FC<{text: string; top?: number}> = ({text, top = 1580}) => (
  <div style={{position: "absolute", left: 64, right: 64, top, fontFamily: MONO, fontSize: 20, color: C.dim, textAlign: "center"}}>* {text}</div>
);

const Head: React.FC<{l1: string; l2?: string; at: number; at2?: number; c2?: string; size?: number}> = ({l1, l2, at, at2, c2 = C.g, size = 84}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 330}}>
    <Reveal at={at} size={size}>{l1}</Reveal>
    {l2 ? <Reveal at={at2 ?? at + 8} size={size} color={c2} style={{marginTop: 4}}>{l2}</Reveal> : null}
  </div>
);

// layout anchors (absolute px): server top-centre, you bottom-left, friend bottom-right
const SV: [number, number] = [540, 790];
const YOU: [number, number] = [235, 1190];
const FR: [number, number] = [845, 1190];
const Place: React.FC<{x: number; y: number; children: React.ReactNode}> = ({x, y, children}) => (
  <div style={{position: "absolute", left: x, top: y, transform: "translate(-50%, -50%)"}}>{children}</div>
);

type SP = {off: number};
const useL = (off: number) => (s: number) => T(s) - off;

// ===================== 1 · hook =====================
const Hook: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const stage = f >= L(3.667) ? 3 : f >= L(2.839) ? 2 : f >= L(1.605) ? 1 : 0;
  const tick = stage === 0 ? <span style={{width: 34}} /> : stage === 1 ? <Tick n={1} color={GREY} size={26} at={L(1.605)} /> : <Tick n={2} color={stage === 3 ? BLUE : GREY} size={26} at={L(2.839)} />;
  const words = ["SENT", "DELIVERED", "READ"];
  const {fps} = useVideoConfig();
  const zoom = spring({frame: f - L(4.505), fps, config: {damping: 200}});
  return (
    <AbsoluteFill>
      <GlassBg />
      <div style={{position: "absolute", left: 64, top: 262, padding: "6px 14px", border: `2px solid ${C.g}`, borderRadius: 8, fontFamily: MONO, fontSize: 24, letterSpacing: "0.18em", color: C.g}}>INSIDE · EP 02</div>
      <div style={{position: "absolute", left: 64, right: 64, top: 330}}>
        <Reveal at={0} size={88}>1 message.</Reveal>
        <Reveal at={L(1.605)} size={88} color={C.g} style={{marginTop: 4}}>3 ticks.</Reveal>
      </div>
      <div style={{position: "absolute", left: 540 - 175 - zoom * 300, top: 590}}>
        <Phone label="YOU" ry={-16 + zoom * 26} w={350} h={620}>
          <div style={{fontFamily: MONO, fontSize: 18, color: C.dim, marginBottom: 18, paddingLeft: 6}}>● friend</div>
          <Bubble me={false} text="aaj free?" style={{marginBottom: 12}} />
          <Bubble text="kal milte hain?" ticks={tick} style={{fontSize: 34}} />
        </Phone>
      </div>
      {/* the three states stack in on the right */}
      <div style={{position: "absolute", right: 64, top: 640, display: "flex", flexDirection: "column", gap: 30, alignItems: "flex-start", opacity: interpolate(f, [L(4.3), L(4.7)], [0, 1], clamp)}}>
        {words.map((w, i) => (
          <div key={w} style={{display: "flex", alignItems: "center", gap: 18}}>
            <Tick n={i === 0 ? 1 : 2} color={i === 2 ? BLUE : GREY} size={70} at={L(4.505) + i * 6} />
            <Chip text={w} at={L(4.505) + i * 6} color={i === 2 ? BLUE : GREY} style={{position: "relative", fontSize: 34}} />
          </div>
        ))}
      </div>
      {/* big morphing tick before the list arrives */}
      <div style={{position: "absolute", right: 110, top: 760, opacity: interpolate(f, [L(4.2), L(4.5)], [1, 0], clamp)}}>
        {stage === 1 ? <Tick n={1} color={GREY} size={190} at={L(1.605)} /> : stage >= 2 ? <Tick n={2} color={stage === 3 ? BLUE : GREY} size={190} at={L(2.839)} /> : null}
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 1430}}>
        <Reveal at={L(7.294)} size={66}>How does it</Reveal>
        <Reveal at={L(7.6)} size={66} color={C.g}>actually deliver?</Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 2 · always-on pipe =====================
const Pipe: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const pulse = f >= L(22.678) ? 0.5 + 0.5 * Math.sin((f - L(22.678)) / 4) : 0;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="02 · THE ALWAYS-ON PIPE" />
      <Head l1="Always" l2="connected" at={4} />
      <Wire from={[YOU[0], YOU[1] - 250]} to={[SV[0], SV[1] + 60]} at={L(11.9)} flow />
      <Place x={SV[0]} y={SV[1]}><Server /></Place>
      <Place x={YOU[0]} y={YOU[1]}><Phone label="YOU" ry={18} glow={pulse ? C.g : undefined}>
        <Bubble me={false} text="..." />
      </Phone></Place>
      <Chip text="long-lived connection" at={L(12.804)} style={{left: 520, top: 1010}} />
      <div style={{position: "absolute", left: 520, top: 1120, display: "flex", alignItems: "center", gap: 16, opacity: out(f, L(17.038), L(17.4))}}>
        <Lock size={54} />
        <div style={{fontFamily: MONO, fontSize: 26, color: C.text, lineHeight: 1.3}}>encrypted with<br /><span style={{color: C.g}}>Noise protocol</span></div>
      </div>
      <Glass style={{position: "absolute", left: 470, top: 1290, width: 546, opacity: out(f, L(19.263), L(19.7))}}>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, textDecoration: "line-through", textDecorationColor: C.bug}}>connect → handshake → send</div>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 10, opacity: out(f, L(20.983), L(21.3))}}>pipe already open → send</div>
      </Glass>
      <Note text="simplified" />
    </AbsoluteFill>
  );
};

// ===================== 3 · keys + E2E =====================
const CIPH = "9f3a·c1e7·04bd·7e22·a9f0·5c3d";
const Keys: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const plain = "kal milte hain?";
  const enc = interpolate(f, [L(29.137), L(30.6)], [0, 1], clamp);
  const shown = enc === 0 ? plain : enc === 1 ? CIPH : CIPH.slice(0, Math.floor(CIPH.length * enc)) + plain.slice(Math.floor(plain.length * enc));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="03 · LOCKED ON YOUR PHONE" />
      <Head l1="Encrypt" l2="before it leaves" at={4} />
      <Wire from={[YOU[0], YOU[1] - 250]} to={[SV[0] - 100, SV[1] + 60]} at={0} flow />
      <Wire from={[FR[0], FR[1] - 250]} to={[SV[0] + 100, SV[1] + 60]} at={0} flow color={GREY} />
      <Place x={SV[0]} y={SV[1]}><Server glow={f >= L(33.731) ? LILAC : C.g}>
        {f >= L(33.731) ? <div style={{position: "absolute", right: 22, top: 40, transform: `scale(${out(f, L(33.731), L(34.1))})`}}><Lock size={70} color={LILAC} /></div> : null}
      </Server></Place>
      <Place x={YOU[0]} y={YOU[1]}><Phone label="YOU" ry={18}>
        <div style={{fontFamily: MONO, fontSize: 17, color: C.dim, marginBottom: 10}}>typing…</div>
        <div style={{padding: "12px 12px", borderRadius: 14, background: enc > 0 ? "#2B2440" : "#1F4D36", fontFamily: enc > 0 ? MONO : SANS, fontSize: enc > 0 ? 19 : 26, fontWeight: 600, color: enc >= 1 ? LILAC : C.text, wordBreak: "break-all", lineHeight: 1.25}}>{shown}</div>
      </Phone></Place>
      <Place x={FR[0]} y={FR[1]}><Phone label="FRIEND" ry={-18}>
        <div style={{display: "flex", justifyContent: "center", marginTop: 90}}><Lock size={70} open={1} color={GREY} /></div>
      </Phone></Place>
      {/* friend's public key travels via the server to you */}
      <Packet from={[FR[0], FR[1] - 250]} to={[SV[0], SV[1]]} a={L(24.4)} b={L(25.6)} color={GREY} label="key" />
      <Packet from={[SV[0], SV[1]]} to={[YOU[0], YOU[1] - 250]} a={L(25.7)} b={L(27.0)} color={GREY} label="key" />
      <Chip text="friend's PUBLIC keys" at={L(25.236)} color={GREY} style={{left: 590, top: 900}} />
      <div style={{position: "absolute", left: 600, top: 1530, display: "flex", alignItems: "center", gap: 14, opacity: out(f, L(27.865), L(28.2))}}>
        <Lock size={40} open={1} color={GREY} /><span style={{fontFamily: MONO, fontSize: 24, color: GREY}}>= an open padlock</span>
      </div>
      <Chip text="Signal protocol · end-to-end" at={L(32.403)} color={LILAC} style={{left: 64, top: 560}} />
      <Chip text="server sees a locked box" at={L(33.731)} color={LILAC} style={{left: 560, top: 620}} />
      <Note text="simplified · chat text illustrative" top={1600} />
    </AbsoluteFill>
  );
};

// ===================== 4 · one tick =====================
const OneTick: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const acked = f >= L(39.0);
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="04 · ONE GREY TICK" />
      <Wire from={[YOU[0], YOU[1] - 250]} to={[SV[0], SV[1] + 60]} at={0} flow />
      <Wire from={[FR[0] - 10, FR[1] - 250]} to={[SV[0] + 60, SV[1] + 60]} at={L(42.316)} dashed color={C.bug} />
      <Place x={SV[0]} y={SV[1]}><Server /></Place>
      <Place x={YOU[0]} y={YOU[1]}><Phone label="YOU" ry={18}>
        <Bubble text="kal milte hain?" ticks={acked ? <Tick n={1} color={GREY} size={24} at={L(39.0)} /> : <span style={{fontFamily: MONO, fontSize: 18, color: C.dim}}>⏱</span>} />
      </Phone></Place>
      <Place x={FR[0]} y={FR[1]}><Phone label="FRIEND" ry={-18} dim={0.6}>
        <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, textAlign: "center", marginTop: 110}}>nothing yet</div>
      </Phone></Place>
      <Packet from={[YOU[0], YOU[1] - 250]} to={[SV[0], SV[1]]} a={L(36.0)} b={L(37.6)} locked />
      <Packet from={[SV[0], SV[1]]} to={[YOU[0], YOU[1] - 250]} a={L(38.267) - 6} b={L(39.0)} label="ACK" color={C.g} />
      <Chip text="server: got it ✓" at={L(38.267)} style={{left: 620, top: 900}} />
      {/* the big tick */}
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "center", gap: 30}}>
        <Tick n={1} color={GREY} size={170} at={L(39.718)} />
        <div style={{opacity: out(f, L(41.596), L(41.9))}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 110, color: C.text, lineHeight: 1}}>SENT</div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.dim, marginTop: 8}}>= reached the server</div>
        </div>
      </div>
      <Chip text="not on friend's phone yet" at={L(43.087)} color={C.bug} style={{left: 520, top: 1470}} />
    </AbsoluteFill>
  );
};

// ===================== 5 · offline queue =====================
const Queue: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const qIn = out(f, L(47.035), L(48.0));
  const ring = f >= L(48.933) ? Math.sin((f - L(48.933)) / 2.2) * 14 * interpolate(f, [L(48.933), L(51.5)], [1, 0.2], clamp) : 0;
  const days = Math.round(interpolate(f, [L(54.68), L(56.2)], [0, 30], {...clamp, easing: Easing.out(Easing.quad)}));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="05 · FRIEND IS OFFLINE" />
      <Head l1="Offline?" l2="it waits" at={4} at2={L(47.035)} />
      <Wire from={[FR[0] - 10, FR[1] - 250]} to={[SV[0] + 60, SV[1] + 60]} at={0} dashed color={C.bug} />
      <Place x={SV[0]} y={SV[1]}><Server /></Place>
      {/* queue: stacked 3D slabs beside the server */}
      <div style={{position: "absolute", left: 120, top: 640}}>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, letterSpacing: "0.14em", marginBottom: 10, opacity: qIn}}>QUEUE</div>
        {[0, 1, 2].map(i => (
          <div key={i} style={{marginTop: i ? -40 : 0, opacity: i === 2 ? qIn : 0.55, transform: `translateY(${i === 2 ? (1 - qIn) * -120 : 0}px)`}}>
            <Slab w={150} h={60} d={30} rx={-30} ry={20} radius={10} color={i === 2 ? "#2B2440" : "#24262B"} glow={i === 2 ? LILAC : undefined}
              front={<div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "100%"}}><Lock size={24} color={i === 2 ? LILAC : GREY} /></div>} />
          </div>
        ))}
      </div>
      <Place x={FR[0]} y={FR[1]}>
        <div style={{transform: `rotate(${ring}deg)`}}>
          <Phone label="FRIEND · OFFLINE" ry={-18} dim={0.7}>
            <div style={{opacity: out(f, L(48.933), L(49.3)), margin: "60px 4px 0", padding: 12, borderRadius: 14, background: "#2A2D33", fontFamily: MONO, fontSize: 17, color: C.text}}>🔔 new message</div>
          </Phone>
        </div>
      </Place>
      <Packet from={[SV[0] + 60, SV[1]]} to={[FR[0], FR[1] - 250]} a={L(48.933)} b={L(50.0)} color={C.bug} label="PUSH" />
      <Chip text="push notification → wake up" at={L(49.601)} color={C.bug} style={{left: 64, top: 1480}} />
      <Glass style={{position: "absolute", left: 64, top: 1010, width: 400, opacity: out(f, L(52.156), L(52.6))}} glow={LILAC}>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim}}>undelivered, kept encrypted</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 92, color: LILAC, lineHeight: 1.05}}>≤ {days} DAYS</div>
        <div style={{fontFamily: MONO, fontSize: 18, color: C.dim}}>WhatsApp Privacy Policy</div>
      </Glass>
    </AbsoluteFill>
  );
};

// ===================== 6 · two grey ticks =====================
const Delivered: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const dec = interpolate(f, [L(60.701), L(61.8)], [0, 1], clamp);
  const plain = "kal milte hain?";
  const shown = dec === 0 ? CIPH : dec === 1 ? plain : plain.slice(0, Math.floor(plain.length * dec)) + CIPH.slice(Math.floor(CIPH.length * dec));
  const got = f >= L(64.0);
  const multi = out(f, L(66.03), L(66.8));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="06 · TWO GREY TICKS" />
      <Wire from={[YOU[0], YOU[1] - 250]} to={[SV[0], SV[1] + 60]} at={0} flow />
      <Wire from={[FR[0], FR[1] - 250]} to={[SV[0] + 60, SV[1] + 60]} at={L(57.6)} flow />
      <Place x={SV[0]} y={SV[1]}><Server /></Place>
      <Place x={YOU[0]} y={YOU[1]}><Phone label="YOU" ry={18}>
        <Bubble text="kal milte hain?" ticks={got ? <Tick n={2} color={GREY} size={24} at={L(64.0)} /> : <Tick n={1} color={GREY} size={24} />} />
      </Phone></Place>
      <Place x={FR[0] - multi * 60} y={FR[1]}>
        <div style={{position: "relative"}}>
          {/* extra devices fan out behind */}
          {[1, 2].map(i => (
            <div key={i} style={{position: "absolute", left: i * 70 * multi, top: -i * 40 * multi, opacity: multi * 0.9, zIndex: -i}}>
              <Slab w={250} h={440} d={34} rx={8} ry={-18} radius={38} color="#202329" glow={LILAC}
                front={<div style={{padding: "60px 14px", fontFamily: MONO, fontSize: 18, color: LILAC}}>copy {i + 1} 🔒</div>} />
            </div>
          ))}
          <Phone label="FRIEND · ONLINE" ry={-18} glow={C.g}>
            <div style={{padding: "12px 12px", borderRadius: 14, background: dec < 1 ? "#2B2440" : "#2A2D33", fontFamily: dec < 1 ? MONO : SANS, fontSize: dec < 1 ? 19 : 26, fontWeight: 600, color: dec < 1 ? LILAC : C.text, wordBreak: "break-all", lineHeight: 1.25, opacity: out(f, L(59.6), L(60.0))}}>{shown}</div>
          </Phone>
        </div>
      </Place>
      <Packet from={[SV[0], SV[1]]} to={[FR[0], FR[1] - 250]} a={L(59.244)} b={L(60.4)} locked color={LILAC} />
      <Packet from={[FR[0], FR[1] - 250]} to={[SV[0], SV[1]]} a={L(62.098)} b={L(63.0)} label="RCPT" />
      <Packet from={[SV[0], SV[1]]} to={[YOU[0], YOU[1] - 250]} a={L(63.0)} b={L(64.0)} label="RCPT" />
      <Chip text="decrypt on device" at={L(60.701)} color={LILAC} style={{left: 600, top: 880}} />
      <Chip text="← delivery receipt" at={L(62.098)} style={{left: 64, top: 880}} />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "center", gap: 30}}>
        <Tick n={2} color={GREY} size={150} at={L(64.493)} />
        <div style={{opacity: out(f, L(64.493), L(64.9))}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 100, color: C.text, lineHeight: 1}}>DELIVERED</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 8}}>= reached their phone</div>
        </div>
      </div>
      <Chip text="multi-device: 1 encrypted copy per device" at={L(66.03)} color={LILAC} style={{left: 64, top: 1500}} />
    </AbsoluteFill>
  );
};

// ===================== 7 · blue =====================
const Read: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const blue = f >= L(75.2);
  const toggle = out(f, L(77.087), L(77.5));
  const g = (i: number) => f >= L(80.075) + 12 + i * 10;
  const all = f >= L(80.075) + 12 + 3 * 10 + 6;
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="07 · BLUE = READ" />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "center", gap: 30}}>
        <Tick n={2} color={blue ? BLUE : GREY} size={150} at={L(75.2)} />
        <div style={{opacity: out(f, L(75.478), L(75.8))}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 110, color: BLUE, lineHeight: 1}}>READ</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.dim, marginTop: 8}}>= one more receipt</div>
        </div>
      </div>
      {/* receipt flight: friend → you */}
      <div style={{position: "absolute", left: 100, top: 660, width: 880, height: 170, }}>
        <div style={{position: "absolute", left: 0, top: 30, fontFamily: MONO, fontSize: 24, color: C.dim}}>YOU</div>
        <div style={{position: "absolute", right: 0, top: 30, fontFamily: MONO, fontSize: 24, color: C.dim}}>FRIEND 👁</div>
        <div style={{position: "absolute", left: 80, right: 150, top: 44, height: 4, background: C.line}} />
        <div style={{position: "absolute", top: 12, left: interpolate(f, [L(73.835), L(75.2)], [640, 80], {...clamp, easing: ease3}), padding: "10px 16px", borderRadius: 12, border: `3px solid ${BLUE}`, background: `${BLUE}22`, fontFamily: MONO, fontSize: 22, color: BLUE, opacity: f >= L(73.835) ? 1 : 0}}>read ✓✓</div>
      </div>
      {/* receipts off toggle */}
      <Glass style={{position: "absolute", left: 64, top: 880, width: 952, opacity: toggle, transform: `translateY(${(1 - toggle) * 30}px)`}}>
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
          <span style={{fontFamily: MONO, fontSize: 30, color: C.text}}>Read receipts</span>
          <span style={{width: 110, height: 58, borderRadius: 29, background: "#3A3C42", position: "relative"}}>
            <span style={{position: "absolute", left: 6, top: 6, width: 46, height: 46, borderRadius: 23, background: GREY}} />
          </span>
        </div>
        <div style={{display: "flex", alignItems: "center", gap: 16, marginTop: 14, opacity: out(f, L(78.316), L(78.7))}}>
          <span style={{fontFamily: MONO, fontSize: 26, color: C.bug}}>OFF →</span><Tick n={2} color={GREY} size={34} /><span style={{fontFamily: MONO, fontSize: 26, color: C.dim}}>no blue</span>
        </div>
      </Glass>
      {/* group: blue only when everyone has read */}
      <Glass style={{position: "absolute", left: 64, top: 1190, width: 952, opacity: out(f, L(80.075), L(80.5))}} glow={all ? BLUE : undefined}>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginBottom: 18}}>GROUP · 4 members</div>
        <div style={{display: "flex", gap: 26, alignItems: "center"}}>
          {["A", "B", "C", "D"].map((n, i) => (
            <div key={n} style={{width: 130, height: 130, borderRadius: 65, background: g(i) ? `${BLUE}33` : "#2A2D33", border: `3px solid ${g(i) ? BLUE : C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: SANS, fontWeight: 800, fontSize: 40, color: g(i) ? BLUE : C.dim}}>{g(i) ? "👁" : n}</div>
          ))}
          <div style={{marginLeft: "auto"}}><Tick n={2} color={all ? BLUE : GREY} size={70} at={all ? L(80.075) + 48 : -99} /></div>
        </div>
        <div style={{fontFamily: MONO, fontSize: 24, color: all ? BLUE : C.dim, marginTop: 16}}>{all ? "everyone read → blue" : "waiting for everyone…"}</div>
      </Glass>
    </AbsoluteFill>
  );
};

// ===================== 8 · recap =====================
const Recap: React.FC<SP> = ({off}) => {
  const f = useCurrentFrame();
  const L = useL(off);
  const rows: [React.ReactNode, string, number, string][] = [
    [<Tick key="a" n={1} color={GREY} size={70} at={L(84.4)} />, "server", 84.4, GREY],
    [<Tick key="b" n={2} color={GREY} size={70} at={L(86.511)} />, "phone", 86.511, GREY],
    [<Tick key="c" n={2} color={BLUE} size={70} at={L(87.982)} />, "eyes", 87.982, BLUE],
  ];
  const cta = out(f, L(97.525), L(98.0));
  return (
    <AbsoluteFill>
      <GlassBg />
      <Section text="08 · THE WHOLE TRIP" />
      <div style={{position: "absolute", left: 64, right: 64, top: 340, display: "flex", flexDirection: "column", gap: 26}}>
        {rows.map(([icon, word, at, col], i) => {
          const o = out(f, L(at), L(at) + 8);
          return (
            <div key={i} style={{opacity: o, transform: `translateX(${(1 - o) * -60}px)`}}>
              <Slab w={952} h={150} d={40} rx={10} ry={-6} radius={26} color="#1F2126" glow={i === 2 ? BLUE : undefined}
                front={<div style={{display: "flex", alignItems: "center", height: "100%", padding: "0 40px", gap: 40}}>
                  <div style={{width: 120}}>{icon}</div>
                  <span style={{fontFamily: MONO, fontSize: 34, color: C.dim}}>=</span>
                  <span style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 80, textTransform: "uppercase", color: col === BLUE ? BLUE : C.text}}>{word}</span>
                </div>} />
            </div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 940, opacity: out(f, L(89.374), L(89.8))}}>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.text, lineHeight: 1.15}}>
          every step = a tiny <Marker at={L(89.9)}>ACK</Marker>,
        </div>
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 52, color: C.g, lineHeight: 1.15, opacity: out(f, L(91.817), L(92.2))}}>flowing back to you ←</div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1150, fontFamily: MONO, fontSize: 24, color: C.dim, opacity: out(f, L(93.662), L(94.0))}}>* simplified view</div>
      <div style={{position: "absolute", left: 64, right: 64, top: 1240, opacity: cta, transform: `scale(${0.9 + cta * 0.1})`, transformOrigin: "0 50%"}}>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.dim, letterSpacing: "0.12em"}}>FOLLOW</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "74%", fontSize: 104, color: C.g, lineHeight: 1}}>DEBUG DIARIES</div>
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 1560, fontFamily: MONO, fontSize: 18, color: C.dim, lineHeight: 1.4}}>Sources: WhatsApp Encryption Overview / Security Whitepaper · WhatsApp Privacy Policy · WhatsApp Help Center</div>
    </AbsoluteFill>
  );
};

// ===================== bottom chapter-progress strip =====================
const CH = ["HOOK", "PIPE", "KEYS", "SENT", "QUEUE", "DELIV", "READ", "RECAP"];
const Strip: React.FC = () => {
  const f = useCurrentFrame();
  let idx = 0;
  CUTS.forEach((c, i) => { if (f >= c) idx = i; });
  const end = idx + 1 < CUTS.length ? CUTS[idx + 1] : I2_TOTAL;
  const p = (f - CUTS[idx]) / (end - CUTS[idx]);
  return (
    <div style={{position: "absolute", left: 64, right: 64, top: 1660}}>
      <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", marginBottom: 12}}>
        <span style={{color: C.g}}>{String(idx + 1).padStart(2, "0")}/08 · {CH[idx]}</span>
        <span style={{color: C.dim}}>INSIDE</span>
      </div>
      <div style={{display: "flex", gap: 8}}>
        {CH.map((c, i) => (
          <div key={c} style={{flex: 1, height: 10, borderRadius: 5, background: C.line, overflow: "hidden"}}>
            <div style={{height: "100%", width: `${i < idx ? 100 : i === idx ? p * 100 : 0}%`, background: i === 6 || (i === 7 && idx === 7) ? BLUE : C.g}} />
          </div>
        ))}
      </div>
    </div>
  );
};

const COMPS: React.FC<SP>[] = [Hook, Pipe, Keys, OneTick, Queue, Delivered, Read, Recap];

export const Inside02: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : I2_TOTAL - CUTS[i]));
  const pres = [
    fade(),
    slide({direction: "from-right"}),
    wipe({direction: "from-bottom-left"}),
    flip({direction: "from-right"}),
    clockWipe({width: 1080, height: 1920}),
    iris({width: 1080, height: 1920}),
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
      <AbsoluteFill style={{zIndex: 15}}><Strip /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 20}}><Hud ep="02" series="INSIDE" total={I2_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
