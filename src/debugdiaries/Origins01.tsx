// Weekend Origins · EP 01 "How UPI was built" — 6 scenes, each a 3D card (Card3D) with the coral wipe.
// Facts (NPCI / RBI / IMF): pilot 11 Apr 2016 by RBI Governor Raghuram Rajan with 21 banks; public launch 25 Aug 2016;
// Aug 2016 ≈ 93,000 transactions; Aug 2026 record 2,451 crore (24.51 bn); 700+ banks (FY26); live in 11 countries;
// ≈49% of global real-time payment volume (IMF, 2025). Demonetisation: 8 Nov 2016.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/origins-01/voice.wav, pauses ≤0.18s).
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Cut, Card3D} from "./cine";

const T = (s: number) => Math.round(s * 30);
export const O1_S2 = T(8.25);
export const O1_S3 = T(15.61);
export const O1_S4 = T(28.14);
export const O1_S5 = T(41.28);
export const O1_S6 = T(51.73);
export const O1_TOTAL = T(60.24) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);

// A 3D box (front + side + top faces) for bars and blocks.
const Box3D: React.FC<{x: number; y: number; w: number; h: number; d?: number; color: string; children?: React.ReactNode}> = ({x, y, w, h, d = 60, color, children}) => (
  <div style={{position: "absolute", left: x, top: y - h, width: w + d, height: h + d}}>
    <div style={{position: "absolute", left: 0, top: d, width: w, height: h, background: `${color}26`, border: `3px solid ${color}`, boxSizing: "border-box"}}>{children}</div>
    <div style={{position: "absolute", left: w, top: d, width: d, height: h, background: `${color}14`, borderTop: `3px solid ${color}`, borderRight: `3px solid ${color}`, borderBottom: `3px solid ${color}`, transform: "skewY(-45deg)", transformOrigin: "0 0", boxSizing: "border-box"}} />
    <div style={{position: "absolute", left: 0, top: 0, width: w, height: d, background: `${color}40`, borderTop: `3px solid ${color}`, borderLeft: `3px solid ${color}`, borderRight: `3px solid ${color}`, transform: `skewX(-45deg) translateX(${d}px)`, transformOrigin: "0 100%", boxSizing: "border-box"}} />
  </div>
);

// ===================== 1 · hook: 93,000 → 2,451 crore =====================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const small = out(f, T(3.0), T(3.6));
  const grow = interpolate(f, [T(5.85), T(7.3)], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const crore = Math.round(2451 * grow);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 258, padding: "6px 14px", border: `2px solid ${C.g}`, borderRadius: 8, fontFamily: MONO, fontSize: 24, letterSpacing: "0.18em", color: C.g}}>ORIGINS · EP 01</div>
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={-30} size={104}>How <span style={{color: C.g}}>UPI</span></Slam>
        <Slam at={-30} size={104} style={{marginTop: 6}}>was built.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, top: 600, ...label}}>UPI TRANSACTIONS · ONE MONTH</div>
      {/* 3D bars on a floor */}
      <div style={{position: "absolute", left: 0, top: 0, width: 1080, height: 1920}}>
        <div style={{position: "absolute", left: 64, right: 150, top: 1300, height: 4, background: C.line}} />
        <div>
          {small > 0 ? <Box3D x={140} y={1300} w={160} h={Math.max(6, 14 * small)} color={C.dim} /> : null}
          <div style={{position: "absolute", left: 120, top: 1320, width: 240, textAlign: "center"}}>
            <div style={{...big(54, C.text), opacity: small}}>93,000</div>
            <div style={{...label, marginTop: 6}}>AUG 2016</div>
          </div>
        </div>
        {grow <= 0 ? (
          <div style={{position: "absolute", left: 470, top: 1320, width: 400, textAlign: "center"}}>
            <div style={big(64, C.dim)}>?</div>
            <div style={{...label, marginTop: 6}}>AUG 2026</div>
          </div>
        ) : null}
        {grow > 0 ? (
          <>
            <Box3D x={560} y={1300} w={180} h={640 * grow} color={C.g} />
            <div style={{position: "absolute", left: 470, top: 1320, width: 400, textAlign: "center"}}>
              <div style={big(64, C.g)}>{crore.toLocaleString("en-IN")} cr</div>
              <div style={{...label, marginTop: 6}}>AUG 2026</div>
            </div>
          </>
        ) : null}
      </div>
      <div style={{position: "absolute", left: 64, top: 1480}}>
        {f > T(7.4) ? <Slam at={T(7.53)} size={110} color={C.bug}>So how?</Slam> : null}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 2 · before UPI =====================
const Before: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const wob = Math.sin(f / 24) * 3;
  const batch = Math.floor(interpolate(f, [L(11.9), L(13.2)], [0, 4], clamp));
  const send = interpolate(f, [L(13.6), L(14.4)], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const bounce = f > L(14.4) ? out(f, L(14.4), L(14.9)) : 0;
  return (
    <AbsoluteFill>
      <Section text="02 / BEFORE 2016" />
      {/* the old "send money" form */}
      <div style={{position: "absolute", left: 90, right: 170, top: 330, perspective: 1200}}>
        <div style={{transform: `rotateY(${-14 + wob}deg) rotateX(8deg)`, borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`, padding: "22px 26px", boxShadow: "30px 40px 70px rgba(0,0,0,.5)"}}>
          <div style={label}>SEND MONEY · 2015</div>
          {[["Account no.", "0012 3456 7890 1234", L(8.4)], ["IFSC", "SBIN0001234", L(9.6)], ["Beneficiary", "add & wait for approval", L(10.6)]].map(([k, v, at]) => (
            <div key={k as string} style={{marginTop: 16}}>
              <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>{k as string}</div>
              <div style={{marginTop: 6, padding: "12px 16px", borderRadius: 12, border: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 28, color: C.text, minHeight: 36}}>{typed(v as string, f, at as number, 40)}</div>
            </div>
          ))}
        </div>
      </div>
      {f > L(11.0) ? <div style={{position: "absolute", left: 64, top: 790, fontFamily: MONO, fontSize: 26, color: C.bug, opacity: out(f, L(11.0), L(11.4))}}>16 digits + IFSC, every single time 😩</div> : null}
      {/* NEFT batches */}
      <div style={{position: "absolute", left: 64, right: 150, top: 860, display: "flex", alignItems: "center", gap: 24, opacity: out(f, L(11.85), L(12.2))}}>
        <svg width={150} height={150}>
          <circle cx={75} cy={75} r={62} fill="none" stroke={C.line} strokeWidth={10} />
          {[0, 1, 2, 3].map((i) => (
            <path key={i} d={`M75 13 A62 62 0 0 1 ${75 + 62 * Math.sin(Math.PI / 2)} 75`} fill="none" stroke={i < batch ? C.bug : "transparent"} strokeWidth={10} transform={`rotate(${i * 90} 75 75)`} />
          ))}
          <text x={75} y={84} textAnchor="middle" fill={C.text} fontFamily={MONO} fontSize={26}>NEFT</text>
        </svg>
        <div>
          <div style={big(52, C.text)}>Moves in batches</div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 6}}>{typed("waiting for the next batch…", f, L(12.3), 40)}</div>
        </div>
      </div>
      {/* wallets that can't talk */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1080, height: 300, opacity: out(f, L(13.2), L(13.5))}}>
        <div style={{position: "absolute", left: 0, top: 40, width: 280, padding: "20px 22px", borderRadius: 20, background: C.card2, border: `2.5px solid ${C.line}`, transform: "perspective(700px) rotateY(18deg)"}}>
          <div style={label}>WALLET A</div>
          <div style={big(60, C.text)}>₹500</div>
        </div>
        <div style={{position: "absolute", right: 0, top: 40, width: 280, padding: "20px 22px", borderRadius: 20, background: C.card2, border: `2.5px solid ${C.line}`, transform: "perspective(700px) rotateY(-18deg)"}}>
          <div style={label}>WALLET B</div>
          <div style={big(60, C.dim)}>₹0</div>
        </div>
        {/* brick wall */}
        <div style={{position: "absolute", left: 395, top: 0, width: 70, height: 260, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4}}>
          {Array.from({length: 16}).map((_, i) => <div key={i} style={{background: "#5A2E28", border: `2px solid ${C.bug}`, borderRadius: 3}} />)}
        </div>
        <div style={{position: "absolute", left: 300 + send * 80 - bounce * 120, top: 100, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.g, opacity: send > 0 ? 1 - bounce * 0.6 : 0}}>₹ →</div>
        {bounce > 0 ? <div style={{position: "absolute", left: 404, top: 270, ...big(52, C.bug)}}>✕</div> : null}
      </div>
      {f > L(14.6) ? (
        <div style={{position: "absolute", left: 64, top: 1430}}>
          <Slam at={L(14.7)} size={52} color={C.bug}>Nothing talked to anything.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 3 · the idea: one network, one ID, the pilot =====================
const NODES = ["SBI", "HDFC", "ICICI", "Axis", "PNB", "Kotak", "app", "app", "app", "app"];
const Idea: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const link = interpolate(f, [L(17.3), L(19.0)], [0, 1], clamp);
  const ang = f * 0.01;
  const morph = interpolate(f, [L(19.5), L(21.2)], [0, 1], clamp);
  const ACC = "0012 3456 7890 1234";
  const VPA = "name@bank";
  const scramble = (a: string, b: string, p: number) => {
    const n = Math.round(a.length + (b.length - a.length) * p);
    let s = "";
    for (let i = 0; i < n; i++) {
      const settle = p * n > i + 2;
      s += settle ? b[i] ?? "" : "0123456789abcdef@"[(i * 7 + Math.floor(f / 2)) % 17];
    }
    return p >= 1 ? b : p <= 0 ? a : s;
  };
  const flip = interpolate(f, [L(22.56), L(23.1)], [90, 0], {...clamp, easing: ease3});
  const banks = Math.round(interpolate(f, [L(25.17), L(25.9)], [0, 21], clamp));
  return (
    <AbsoluteFill>
      <Section text="03 / THE IDEA" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(17.31)} size={74}>Every bank. Every app.</Slam>
        <Slam at={L(18.5)} size={74} color={C.g} style={{marginTop: 8}}>One network.</Slam>
      </div>
      {/* 3D ring of banks + apps around NPCI */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {NODES.map((n, i) => {
          const a = ang + (i / NODES.length) * Math.PI * 2;
          const x = 540 + Math.cos(a) * 340, z = Math.sin(a);
          const y = 790 + z * 110;
          const k = 0.75 + (z + 1) * 0.2;
          const lp = Math.min(1, Math.max(0, link * NODES.length - i));
          return (
            <g key={i} opacity={out(f, L(15.8) + i, L(16.2) + i)}>
              {lp > 0 ? <line x1={540} y1={790} x2={540 + (x - 540) * lp} y2={790 + (y - 790) * lp} stroke={C.g} strokeWidth={3} opacity={0.7} /> : null}
              <rect x={x - 60 * k} y={y - 26 * k} width={120 * k} height={52 * k} rx={12} fill={C.card} stroke={n === "app" ? C.text : C.g} strokeWidth={3} />
              <text x={x} y={y + 9 * k} textAnchor="middle" fill={n === "app" ? C.text : C.g} fontFamily={MONO} fontSize={24 * k}>{n}</text>
            </g>
          );
        })}
        <circle cx={540} cy={790} r={68 + (link >= 1 ? Math.sin(f / 5) * 4 : 0)} fill="#1C2A21" stroke={C.g} strokeWidth={5} />
        <text x={540} y={800} textAnchor="middle" fill={C.g} fontFamily={MONO} fontWeight={700} fontSize={30}>NPCI</text>
      </svg>
      {/* account number → ID */}
      <div style={{position: "absolute", left: 64, right: 150, top: 980, opacity: out(f, L(19.3), L(19.6))}}>
        <div style={label}>INSTEAD OF ACCOUNT NO. + IFSC</div>
        <div style={{fontFamily: MONO, fontWeight: 700, fontSize: morph > 0.6 ? 76 : 56, color: morph >= 1 ? C.g : C.text, marginTop: 8}}>{scramble(ACC, VPA, morph)}</div>
      </div>
      {/* the pilot launch card */}
      {f > L(22.4) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1150, perspective: 900}}>
          <div style={{transform: `rotateX(${flip}deg)`, transformOrigin: "50% 0%", borderRadius: 24, background: C.card2, border: `3px solid ${C.g}`, padding: "22px 28px"}}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
              <div style={big(64, C.text)}>11 Apr 2016</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.g}}>PILOT</div>
            </div>
            <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 600, marginTop: 10, color: C.text, opacity: out(f, L(24.18), L(24.6))}}>launched by RBI Governor Raghuram Rajan</div>
            <div style={{display: "flex", alignItems: "baseline", gap: 16, marginTop: 14, opacity: out(f, L(25.1), L(25.4))}}>
              <span style={big(90, C.g)}>{banks}</span>
              <span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>banks</span>
              {f > L(26.17) ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 28, color: C.g}}>pilot ✓</span> : null}
            </div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 4 · how a payment works =====================
const P = {phone: [540, 470], npci: [540, 720], mine: [250, 960], theirs: [830, 960]} as const;
const How: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  // packet path segments
  const seg = (a: readonly [number, number], b: readonly [number, number], s: number, e: number) => {
    const p = interpolate(f, [L(s), L(e)], [0, 1], {...clamp, easing: ease3});
    return {p, x: a[0] + (b[0] - a[0]) * p, y: a[1] + (b[1] - a[1]) * p, on: f >= L(s) && f <= L(e) + 2};
  };
  const s1 = seg(P.phone, P.npci, 29.3, 31.0);
  const s2 = seg(P.npci, P.mine, 31.4, 32.6);
  const s3 = seg(P.mine, P.npci, 32.7, 33.6);
  const s4 = seg(P.npci, P.theirs, 33.7, 34.8);
  const s5 = seg(P.theirs, P.phone, 35.2, 36.4);
  const pkt = [s1, s2, s3, s4, s5].find((s) => s.on);
  const debited = f > L(32.4), credited = f > L(34.6), done = f > L(36.3);
  const pin = Math.floor(interpolate(f, [L(37.3), L(38.2)], [0, 4], clamp));
  const enc = interpolate(f, [L(39.6), L(40.8)], [0, 1], {...clamp, easing: ease3});
  const node = (xy: readonly [number, number], title: string, sub: string, col: string, lit: boolean) => (
    <div style={{position: "absolute", left: xy[0] - 140, top: xy[1] - 62, width: 280, height: 124, borderRadius: 22, background: lit ? `${col}1F` : C.card, border: `3px solid ${lit ? col : C.line}`, display: "grid", placeItems: "center", textAlign: "center", transform: "perspective(800px) rotateX(14deg)", boxShadow: lit ? `0 0 40px ${col}44` : "0 20px 40px rgba(0,0,0,.4)"}}>
      <div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, letterSpacing: "0.12em"}}>{title}</div>
        <div style={{...big(44, lit ? col : C.text), marginTop: 4}}>{sub}</div>
      </div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Section text="04 / HOW A PAYMENT WORKS" />
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: out(f, L(28.2), L(28.8))}}>
        {[[P.phone, P.npci], [P.npci, P.mine], [P.npci, P.theirs]].map(([a, b], i) => <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={C.line} strokeWidth={5} strokeDasharray="12 12" />)}
      </svg>
      <div style={{opacity: out(f, L(28.2), L(28.8))}}>
        {node(P.phone, "YOU · APP", done ? "Paid ✓" : "Pay ₹100", C.g, done)}
        {node(P.npci, "NPCI SWITCH", "routes it", C.g, !!pkt)}
        {node(P.mine, "YOUR BANK", debited ? "−₹100" : "₹ ₹ ₹", C.bug, debited)}
        {node(P.theirs, "THEIR BANK", credited ? "+₹100" : "₹", C.g, credited)}
      </div>
      {pkt ? <div style={{position: "absolute", left: pkt.x - 18, top: pkt.y - 18, width: 36, height: 36, borderRadius: 18, background: C.g, boxShadow: `0 0 30px ${C.g}`}} /> : null}
      {f > L(35.0) ? (
        <div style={{position: "absolute", right: 150, top: 1080, textAlign: "right", opacity: out(f, L(35.1), L(35.5))}}>
          <div style={label}>TIME TAKEN</div>
          <div style={big(84, C.g)}>{interpolate(f, [L(35.15), L(36.4)], [0, 2.1], clamp).toFixed(1)}s</div>
        </div>
      ) : null}
      {/* the PIN never touches the app */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1220, height: 330, opacity: out(f, L(37.1), L(37.5))}}>
        <div style={label}>YOUR UPI PIN</div>
        <div style={{display: "flex", gap: 14, marginTop: 12}}>
          {[0, 1, 2, 3].map((i) => <div key={i} style={{width: 70, height: 84, borderRadius: 14, border: `3px solid ${i < pin ? C.g : C.line}`, display: "grid", placeItems: "center", ...big(50, C.g)}}>{i < pin ? "•" : ""}</div>)}
        </div>
        <div style={{position: "absolute", left: 0, top: 200, padding: "12px 18px", borderRadius: 14, border: `2.5px solid ${f > L(38.49) ? C.bug : C.line}`, fontFamily: MONO, fontSize: 24, color: f > L(38.49) ? C.bug : C.text, opacity: out(f, L(38.4), L(38.8))}}>app: can't see it ✕</div>
        <div style={{position: "absolute", left: 360 + enc * 360, top: 30, fontFamily: MONO, fontSize: 26, color: C.g, opacity: f > L(39.5) ? 1 : 0}}>🔒 a9f3c…</div>
        <div style={{position: "absolute", right: 0, top: 150, width: 210, padding: "14px 16px", borderRadius: 16, background: enc >= 1 ? "#1C2A21" : C.card, border: `2.5px solid ${enc >= 1 ? C.g : C.line}`, textAlign: "center", opacity: out(f, L(39.4), L(39.8))}}>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>YOUR BANK</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 4}}>{enc >= 1 ? "verified ✓" : "…"}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 5 · the twist + today =====================
const Twist: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const cal = interpolate(f, [L(41.35), L(41.9)], [-90, 0], {...clamp, easing: ease3});
  const cashGone = out(f, L(43.5), L(44.6));
  const phones = Math.round(interpolate(f, [L(43.6), L(45.4)], [0, 24], clamp));
  const donut = interpolate(f, [L(48.3), L(50.6)], [0, 0.49], {...clamp, easing: Easing.out(Easing.cubic)});
  const R = 84, CIRC = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Section text="05 / THE TWIST" />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "center", gap: 30}}>
        <div style={{perspective: 800}}>
          <div style={{width: 230, borderRadius: 20, overflow: "hidden", border: `3px solid ${C.bug}`, transform: `rotateX(${cal}deg)`, transformOrigin: "50% 0%", background: C.card}}>
            <div style={{background: C.bug, color: C.bg, textAlign: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, padding: "8px 0"}}>NOV 2016</div>
            <div style={{textAlign: "center", ...big(110, C.text), padding: "10px 0 14px"}}>8</div>
          </div>
        </div>
        {f > L(42.7) ? <Slam at={L(42.84)} size={96} color={C.bug}>Notebandi.</Slam> : null}
      </div>
      {/* cash disappears, UPI phones multiply */}
      <div style={{position: "absolute", left: 64, right: 150, top: 620, height: 300}}>
        {Array.from({length: 6}).map((_, i) => (
          <div key={i} style={{position: "absolute", left: i * 130, top: 20 + (i % 2) * 40 + cashGone * 160, width: 150, height: 74, borderRadius: 8, border: `3px solid ${C.dim}`, background: "#26272B", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: C.dim, transform: `rotate(${(i % 2 ? 1 : -1) * (8 + cashGone * 30)}deg)`, opacity: (1 - cashGone) * out(f, L(41.6), L(42.2))}}>₹500</div>
        ))}
        <div style={{position: "absolute", left: 0, top: 0, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 14, width: "100%"}}>
          {Array.from({length: phones}).map((_, i) => (
            <div key={i} style={{height: 80, borderRadius: 14, border: `3px solid ${C.g}`, background: "#1C2A21", display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 22, color: C.g, transform: `perspective(400px) rotateY(${(1 - out(f, L(43.6) + i, L(43.6) + i + 6)) * 90}deg)`}}>UPI</div>
          ))}
        </div>
      </div>
      {/* today: three 3D tiles */}
      <div style={{position: "absolute", left: 64, right: 150, top: 960, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        {[["700+", "banks", L(45.8)], ["11", "countries", L(47.46)]].map(([n, t, at]) => (
          <div key={t as string} style={{padding: "22px 24px", borderRadius: 22, background: C.card, border: `3px solid ${C.g}`, transform: `perspective(800px) rotateY(${(1 - out(f, at as number, (at as number) + 10)) * 80}deg)`, opacity: out(f, at as number, (at as number) + 4)}}>
            <div style={big(96, C.g)}>{n as string}</div>
            <div style={{fontFamily: MONO, fontSize: 26, color: C.text, marginTop: 6}}>{t as string}</div>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1220, display: "flex", alignItems: "center", gap: 30, opacity: out(f, L(48.2), L(48.6))}}>
        <svg width={220} height={220} style={{transform: "perspective(600px) rotateX(20deg)"}}>
          <circle cx={110} cy={110} r={R} fill="none" stroke={C.line} strokeWidth={34} />
          <circle cx={110} cy={110} r={R} fill="none" stroke={C.g} strokeWidth={34} strokeDasharray={`${CIRC * donut} ${CIRC}`} transform="rotate(-90 110 110)" />
          <text x={110} y={124} textAnchor="middle" fill={C.text} fontFamily={SANS} fontWeight={900} fontSize={46}>{Math.round(donut * 100)}%</text>
        </svg>
        <div>
          <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, color: C.text}}>of the world's real-time payments</div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 8}}>IMF, 2025</div>
        </div>
      </div>
      {f > L(50.9) ? (
        <div style={{position: "absolute", left: 64, top: 1480}}>
          <Slam at={L(51.08)} size={80} color={C.g}>Only UPI.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 6 · the lesson + follow =====================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const link = interpolate(f, [L(55.3), L(56.2)], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(52.33)} size={72}>The biggest system</Slam>
        <Slam at={L(53.2)} size={72} style={{marginTop: 6}}>isn't the most complex.</Slam>
        <Slam at={L(54.0)} size={72} color={C.g} style={{marginTop: 18}}>It's the one that</Slam>
        <Slam at={L(55.38)} size={72} color={C.g} style={{marginTop: 6}}>connects everyone.</Slam>
      </div>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {Array.from({length: 12}).map((_, i) => {
          const a = (i / 12) * Math.PI * 2 + f * 0.008;
          const x = 540 + Math.cos(a) * 300, y = 1000 + Math.sin(a) * 110;
          return (
            <g key={i}>
              <line x1={540} y1={1000} x2={540 + (x - 540) * link} y2={1000 + (y - 1000) * link} stroke={C.g} strokeWidth={3} opacity={0.6} />
              <circle cx={x} cy={y} r={14} fill={link > 0.9 ? C.g : C.line} />
            </g>
          );
        })}
        <circle cx={540} cy={1000} r={30} fill={C.g} opacity={0.3 + link * 0.7} />
      </svg>
      {f > L(56.0) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1200, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.g}`, padding: "22px 30px", opacity: out(f, L(56.0), L(56.5)), transform: `translateY(${(1 - out(f, L(56.0), L(56.5))) * 30}px)`}}>
          <div style={{...label, fontSize: 24}}>WEEKEND ORIGINS</div>
          <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 6}}>A new origin story <span style={{color: C.g}}>every weekend</span></div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, L(57.3), 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1460, fontFamily: MONO, fontSize: 21, color: C.dim, opacity: out(f, L(56.5), L(57))}}>facts: NPCI · RBI · IMF (2016–2026)</div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC<{off: number}>][] = [
  [0, O1_S2, () => <Hook />],
  [O1_S2, O1_S3, Before],
  [O1_S3, O1_S4, Idea],
  [O1_S4, O1_S5, How],
  [O1_S5, O1_S6, Twist],
  [O1_S6, O1_TOTAL, Lesson],
];

export const Origins01: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <Backdrop />
    {SCENES.map(([a, b, Comp], i) => (
      <Sequence key={i} from={a} durationInFrames={b - a}>
        <Card3D len={b - a} first={i === 0} last={i === SCENES.length - 1}>
          <Comp off={a} />
        </Card3D>
      </Sequence>
    ))}
    {SCENES.slice(1).map(([a]) => <Cut key={a} at={a} />)}
    <Hud series="ORIGINS" ep="01" total={O1_TOTAL} />
  </AbsoluteFill>
);
