// Debug Diaries · Entry 006 "0.1 + 0.2 ≠ 0.3" — money stored as float, invoice short by one paisa.
// 3D pieces: tilted floating invoice, spinning 1-paisa coin, camera dive into the number line, bits on a
// 3D ribbon, the decimal part sliced off and falling, a rising coin stack. Scenes swing in (FlipIn) with the coral wipe.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/006/voice.wav, pauses ≤0.18s), phrase starts (s):
//   P1 0.06 calculator · 1.21 JavaScript tha · 2.03 ek paisa kam · 3.64 hisaab match nahi
//   P2 5.27 0.1+0.2 · 7.62 hota hai 0.3 · 8.69 chhota sa four · 9.76 binary
//   P3 13.31 1.15 × 100 · 15.94 114.999 · 18.44 floor · 19.84 114 paise · 20.71 fix · 21.29 integer paise · 23.01 rule
//   P4 24.85 follow (voice ends 26.46)
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, ease, typed, Backdrop, Hud, Section, Slam, Card, Cut, FlipIn} from "./cine";

export const S2 = 157; // why
export const S3 = 398; // our bug
export const S4 = 619; // fix + rule
export const P4 = 746; // follow
export const E6_TOTAL = 803;

// ---- 3D coin ----
const Coin: React.FC<{x: number; y: number; at: number; fall?: number; size?: number; color?: string}> = ({x, y, at, fall, size = 120, color = C.bug}) => {
  const f = useCurrentFrame();
  const o = out(f, at, at + 8);
  if (o <= 0) return null;
  const spin = (f - at) * 9;
  const fp = fall !== undefined ? interpolate(f, [fall, fall + 30], [0, 1], {...clamp, easing: Easing.in(Easing.quad)}) : 0;
  return (
    <div style={{position: "absolute", left: x - size / 2, top: y - size / 2 + fp * 520, width: size, height: size, perspective: 600, opacity: o * (1 - fp * 0.9)}}>
      <div style={{width: "100%", height: "100%", transform: `rotateY(${spin}deg) rotateX(${fp * 60}deg) scale(${1 - fp * 0.55})`, transformStyle: "preserve-3d"}}>
        <div style={{position: "absolute", inset: 0, borderRadius: "50%", border: `6px solid ${color}`, background: "#26221F", display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.24, color, backfaceVisibility: "hidden", boxShadow: `0 0 40px ${color}55`}}>₹0.01</div>
        <div style={{position: "absolute", inset: 0, borderRadius: "50%", border: `6px solid ${color}`, background: "#26221F", display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: size * 0.22, color, transform: "rotateY(180deg)", backfaceVisibility: "hidden"}}>1p</div>
      </div>
    </div>
  );
};

// ---- scene 1: invoice short by a paisa ----
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const wob = Math.sin(f / 22) * 4;
  const bad = f >= 61;
  const recon = out(f, 109, 150);
  const rows: [string, string, string][] = [
    ["Invoiced", "₹14,92,310.45", C.text],
    ["Received", "₹14,92,297.61", C.text],
    ["Difference", `−₹${(12.84 * recon).toFixed(2)}`, C.bug],
  ];
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 268}}>
        <Slam at={-30} size={92}>Calculator was right.</Slam>
        <Slam at={36} size={92} color={C.bug} style={{marginTop: 10}}>JavaScript wasn't.</Slam>
      </div>
      {/* the floating 3D invoice */}
      <div style={{position: "absolute", left: 130, top: 530, width: 560, height: 560, perspective: 1400}}>
        <div style={{width: "100%", height: "100%", transform: `rotateX(${16 + wob * 0.5}deg) rotateY(${-20 + wob}deg) rotateZ(3deg)`, transformStyle: "preserve-3d", borderRadius: 20, background: "#ECEDEF", color: "#1D1E21", padding: "34px 36px", boxSizing: "border-box", boxShadow: "40px 60px 80px rgba(0,0,0,.55)", fontFamily: MONO}}>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: "0.12em", color: "#55585F"}}>
            <span>TAX INVOICE</span><span>#1043</span>
          </div>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 14}}>Chai &amp; Code Store</div>
          <div style={{borderTop: "2px dashed #B9BBC0", margin: "22px 0"}} />
          {[["1 × Cutting chai", "1.00"], ["GST 15%", "0.15"]].map(([k, v]) => (
            <div key={k} style={{display: "flex", justifyContent: "space-between", fontSize: 26, marginBottom: 10}}><span>{k}</span><span>{v}</span></div>
          ))}
          <div style={{borderTop: "2px dashed #B9BBC0", margin: "16px 0"}} />
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700}}><span>DUE</span><span>₹1.15</span></div>
          <div style={{display: "flex", justifyContent: "space-between", fontSize: 30, fontWeight: 700, marginTop: 10, color: bad ? "#D9473A" : "#1D1E21"}}>
            <span>CHARGED</span><span>₹1.14</span>
          </div>
          {bad ? (
            <div style={{marginTop: 22, display: "inline-block", padding: "8px 16px", border: "4px solid #D9473A", borderRadius: 10, color: "#D9473A", fontSize: 26, fontWeight: 700, transform: `rotate(-6deg) scale(${1 + (1 - out(f, 61, 70)) * 0.8})`, opacity: out(f, 61, 66)}}>SHORT BY 1 PAISA</div>
          ) : null}
        </div>
      </div>
      <Coin x={830} y={720} at={64} fall={92} size={150} />
      {/* bottom: month-end reconciliation */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1200, borderRadius: 24, background: C.card, border: `2.5px solid ${recon > 0.5 ? C.bug : C.line}`, overflow: "hidden"}}>
        <div style={{padding: "14px 24px", borderBottom: `2px solid ${C.line}`, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 22, color: C.dim}}>
          <span>OCTOBER · RECONCILIATION</span>
          <span style={{color: recon > 0.9 ? C.bug : C.dim}}>{recon > 0.9 ? "● NOT MATCHING" : "● CHECKING"}</span>
        </div>
        {rows.map(([k, v, col], i) => (
          <div key={k} style={{display: "flex", justifyContent: "space-between", padding: "14px 24px", borderTop: i ? `2px solid ${C.line}` : "none", fontFamily: MONO, fontSize: 28}}>
            <span style={{color: C.dim}}>{k}</span>
            <span style={{color: col, fontWeight: i === 2 ? 700 : 400, opacity: out(f, 108 + i * 8, 116 + i * 8)}}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, top: 1500, fontFamily: MONO, fontSize: 26, color: C.bug, opacity: out(f, 140, 150)}}>1,284 invoices · each short by 1 paisa</div>
    </AbsoluteFill>
  );
};

// ---- scene 2: why (number line dive + bits) ----
const BITS = "0.0001100110011001100110011001100110011001100110011010";
const Why: React.FC = () => {
  const f = useCurrentFrame();
  const z = ease(f, 72, 128); // camera dive
  const scale = 1600 * Math.pow(10, 15.6 * z); // px per unit; at the end 0.3 and 0.1+0.2 sit ~360px apart
  const D = 5.551115123125783e-17; // (0.1 + 0.2) - 0.3 in real doubles
  const g = D * scale;
  const x0 = 540 - (g / 2) * Math.min(1, g / 360);
  const X = (v: number) => x0 + (v - 0.3) * scale;
  const x1 = x0 + g;
  const tail = f >= 104;
  const ribbon = interpolate(f, [136, 200], [0, -1520], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <Section text="02 / WHY" />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "baseline", gap: 28}}>
        <Slam at={4} size={120}>0.1 + 0.2</Slam>
        {f > 44 ? <Slam at={46} size={120} color={C.bug}>≠ 0.3</Slam> : null}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 500, fontFamily: MONO, fontWeight: 700, fontSize: 58, letterSpacing: "-0.02em", opacity: out(f, 70, 76)}}>
        <span style={{color: C.text}}>{typed("0.3000000000000000", f, 72, 90)}</span>
        <span style={{color: C.bug, textShadow: tail ? `0 0 30px ${C.bug}` : "none", display: "inline-block", transform: `scale(${tail ? 1 + (1 - out(f, 104, 112)) * 1.2 : 1})`}}>{f >= 100 ? "4" : ""}</span>
      </div>
      {/* the number line, tilted into the screen; the camera dives toward 0.3 */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, height: 460, perspective: 900, opacity: out(f, 60, 72)}}>
        <svg width={1080} height={460} style={{transform: "rotateX(48deg)", transformOrigin: "50% 60%", overflow: "visible"}}>
          <line x1={-400} x2={1480} y1={260} y2={260} stroke={C.dim} strokeWidth={4} />
          {[0, 0.1, 0.2, 0.3, 0.4, 0.5].map((v) => {
            const x = X(v);
            if (x < -300 || x > 1380 || v === 0.3 || z > 0.12) return null;
            return (
              <g key={v}>
                <line x1={x} x2={x} y1={230} y2={290} stroke={C.text} strokeWidth={4} />
                <text x={x} y={350} fill={C.text} fontFamily={MONO} fontSize={40} textAnchor="middle">{v.toFixed(1)}</text>
              </g>
            );
          })}
          <line x1={x0} x2={x0} y1={200} y2={300} stroke={C.g} strokeWidth={6} />
          <text x={g > 120 ? x0 - 14 : x0} y={g > 120 ? 170 : 350} fill={g > 120 ? C.g : C.text} fontFamily={MONO} fontSize={38} textAnchor={g > 120 ? "end" : "middle"}>0.3</text>
          {g > 120 ? (
            <>
              <line x1={x1} x2={x1} y1={200} y2={300} stroke={C.bug} strokeWidth={6} />
              <text x={x1 + 14} y={170} fill={C.bug} fontFamily={MONO} fontSize={34} textAnchor="start">0.1 + 0.2</text>
              <line x1={x0} x2={x1} y1={330} y2={330} stroke={C.bug} strokeWidth={3} strokeDasharray="8 8" opacity={out(f, 120, 128)} />
              <text x={(x0 + x1) / 2} y={380} fill={C.bug} fontFamily={MONO} fontSize={30} textAnchor="middle" opacity={out(f, 120, 128)}>gap ≈ 0.00000000000000006</text>
            </>
          ) : null}
        </svg>
      </div>
      <div style={{position: "absolute", right: 150, top: 640, fontFamily: MONO, fontSize: 22, color: C.dim, opacity: out(f, 72, 78)}}>ZOOM ×10<sup>{Math.round(16 * z)}</sup></div>
      {/* bottom: 0.1 in binary on a 3D ribbon, cut at 52 bits */}
      <div style={{position: "absolute", left: 64, top: 1150, fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim, opacity: out(f, 134, 140)}}>0.1 IN BINARY · NEVER ENDS</div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1200, height: 200, perspective: 700, overflow: "hidden", opacity: out(f, 136, 146)}}>
        <div style={{position: "absolute", left: 64, top: 40, transform: `rotateY(-24deg) rotateX(12deg) translateX(${ribbon}px)`, transformOrigin: "0% 50%", whiteSpace: "nowrap", fontFamily: MONO, fontSize: 64, fontWeight: 700, color: C.g}}>
          {BITS}
          <span style={{color: C.bug}}>{"│"}</span>
          <span style={{color: C.dim, opacity: 0.5}}>011001100110011…</span>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1420, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, opacity: out(f, 170, 180)}}>
        <span style={{color: C.bug}}>✂ cut after 52 bits</span>
        <span style={{color: C.dim}}>the rest is lost</span>
      </div>
      <div style={{position: "absolute", left: 64, top: 1500}}>
        {f > 186 ? <Slam at={188} size={58}>So 0.1 is never exactly 0.1.</Slam> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 3: our bug (decimal sliced off) ----
const CUTF = 155;
const Bug: React.FC = () => {
  const f = useCurrentFrame();
  const fallP = interpolate(f, [CUTF + 4, CUTF + 34], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const blade = interpolate(f, [CUTF - 4, CUTF + 6], [-120, 260], clamp);
  return (
    <AbsoluteFill>
      <Section text="03 / OUR BUG" />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "baseline", gap: 24}}>
        <Slam at={4} size={110}>₹1.15 × 100</Slam>
      </div>
      <Card title="invoice.js" tag={f > CUTF ? "BUG" : "RUNNING"} tagColor={f > CUTF ? C.bug : C.dim} border={f > CUTF ? C.bug : C.line} style={{top: 480}}>
        {typed("const paise = ", f, 14, 60)}
        <span style={{color: f > CUTF ? C.bug : C.text}}>{typed("Math.floor", f, 26, 60)}</span>
        {typed("(price * 100);", f, 36, 60)}
      </Card>
      {/* the result, then the decimal part is sliced off and falls in 3D */}
      <div style={{position: "absolute", left: 64, top: 690, fontFamily: MONO, fontSize: 26, letterSpacing: "0.14em", color: C.dim, opacity: out(f, 76, 82)}}>1.15 * 100 =</div>
      <div style={{position: "absolute", left: 64, right: 0, top: 740, height: 220, perspective: 900, display: "flex", alignItems: "baseline", fontFamily: MONO, fontWeight: 700, fontSize: 92, letterSpacing: "-0.03em", opacity: out(f, 78, 84)}}>
        <span style={{color: f > CUTF ? C.bug : C.text, fontSize: f > CUTF ? interpolate(f, [CUTF + 30, CUTF + 42], [92, 150], clamp) : 92}}>114</span>
        <span style={{display: "inline-block", color: C.text, transformOrigin: "0% 50%", transform: `translateY(${fallP * 620}px) rotateX(${fallP * 110}deg) rotateZ(${fallP * 28}deg)`, opacity: 1 - fallP}}>{typed(".99999999999999", f, 82, 70)}</span>
      </div>
      {f > CUTF - 4 && f < CUTF + 10 ? (
        <div style={{position: "absolute", left: 64 + 3 * 55 + 4, top: 700 + blade, width: 10, height: 140, background: C.bug, boxShadow: `0 0 40px ${C.bug}`, transform: "skewX(-18deg)"}} />
      ) : null}
      {f > CUTF ? <div style={{position: "absolute", left: 300, top: 930, fontFamily: MONO, fontSize: 26, color: C.bug, opacity: out(f, CUTF, CUTF + 8)}}>Math.floor chops it ↓</div> : null}
      <Coin x={760} y={1060} at={CUTF + 40} fall={CUTF + 56} size={130} />
      {/* bottom: what the customer was charged */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1240, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, opacity: out(f, 100, 110)}}>
        {[["EXPECTED", "115 p", C.g, 100], ["GOT", f > CUTF + 40 ? "114 p" : "…", C.bug, 100], ["LOST", f > CUTF + 44 ? "1 p" : "…", C.bug, 100]].map(([k, v, col]) => (
          <div key={k as string} style={{padding: "16px 18px", borderRadius: 18, background: C.card, border: `2.5px solid ${C.line}`}}>
            <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: "0.14em", color: C.dim}}>{k as string}</div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 68, color: col as string}}>{v as string}</div>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, top: 1430}}>
        {f > CUTF + 42 ? <Slam at={CUTF + 44} size={60} color={C.bug}>Every invoice. Every day.</Slam> : null}
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 4: fix + rule ----
const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const n = P4 - S4;
  const coins = 9;
  return (
    <AbsoluteFill>
      <Section text="04 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={2} size={92}>Store money</Slam>
        <Slam at={20} size={92} color={C.g} style={{marginTop: 8}}>in paise.</Slam>
      </div>
      <Card title="invoice.js" tag={f > 50 ? "FIXED" : "EDITING"} tagColor={f > 50 ? C.g : C.dim} border={f > 50 ? C.g : C.line} style={{top: 560}}>
        <span style={{color: C.bug}}>{typed("- price = 1.15        // float", f, 20, 70)}</span>
        {"\n"}
        <span style={{color: C.g}}>{typed("+ paise = 115         // integer", f, 34, 70)}</span>
      </Card>
      {/* 3D coin stack rising: integers add up exactly */}
      <div style={{position: "absolute", left: 120, top: 760, width: 200, height: 360, perspective: 700}}>
        <div style={{position: "absolute", inset: 0, transform: "rotateX(58deg)", transformStyle: "preserve-3d"}}>
          {Array.from({length: coins}).map((_, i) => {
            const at = 40 + i * 3;
            const p = out(f, at, at + 8);
            return <div key={i} style={{position: "absolute", left: 20, bottom: 40, width: 160, height: 160, borderRadius: "50%", border: `5px solid ${C.g}`, background: "#1C2A21", transform: `translateZ(${i * 22 + (1 - p) * 300}px)`, opacity: p}} />;
          })}
        </div>
      </div>
      <div style={{position: "absolute", left: 380, top: 820, opacity: out(f, 60, 70)}}>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.dim}}>115 + 0 + 0 …</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 120, lineHeight: 1, color: C.g}}>115 p ✓</div>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.g, marginTop: 8}}>exact, every time</div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 14}}>show ₹ only on screen: (paise / 100).toFixed(2)</div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1150}}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.16em", color: C.dim, opacity: out(f, 70, 76)}}>RULE</div>
        <Slam at={72} size={70} color={C.bug} style={{marginTop: 8}}>Money never goes</Slam>
        <Slam at={86} size={70} color={C.bug} style={{marginTop: 6}}>in a float.</Slam>
      </div>
      {f > n - 4 ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1370, borderRadius: 22, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "18px 26px", opacity: out(f, n - 4, n + 6), transform: `translateY(${(1 - out(f, n - 4, n + 6)) * 30}px)`}}>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, color: C.text}}>Follow for the next bug 🐞</div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 8}}>{typed("@debugdiaries.io", f, n + 8, 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, top: 1560, display: "flex", alignItems: "center", gap: 16, opacity: out(f, 100, 110)}}>
        <svg width={30} height={40}><path d="M3 3 H27 V37 L15 27 L3 37 Z" fill="none" stroke={C.g} strokeWidth={4} strokeLinejoin="round" /></svg>
        <span style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.16em", color: C.g}}>SAVE FOR YOUR NEXT BILLING CODE</span>
      </div>
    </AbsoluteFill>
  );
};

export const DebugDiaries006: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <Backdrop />
    <Sequence durationInFrames={S2}><Hook /></Sequence>
    <Sequence from={S2} durationInFrames={S3 - S2}><FlipIn><Why /></FlipIn></Sequence>
    <Sequence from={S3} durationInFrames={S4 - S3}><FlipIn><Bug /></FlipIn></Sequence>
    <Sequence from={S4} durationInFrames={E6_TOTAL - S4}><FlipIn><Fix /></FlipIn></Sequence>
    {[S2, S3, S4].map((c) => <Cut key={c} at={c} />)}
    <Hud ep="006" total={E6_TOTAL} />
  </AbsoluteFill>
);
