// Debug Diaries · Entry 005 "₹499 order, ₹998 debited" (UPI double charge → idempotency key).
// Cinematic cut like 004, but the lower half is used too: bank SMS, running totals, "save this".
// Timed to the Hinglish Sarvam voice (content/debug-diaries/005/voice.wav, pauses ≤0.18s), phrase starts (s):
//   P1 0.06 ₹499 order · ~2.7 ₹998 · 3.44 user ne pay · 4.29 do baar dabaya · 5.54 server ne dono baar
//   P2 7.62 slow · 9.0 retry · 10.42 dono requests nayi · 11.93 pata hi nahi · 12.54 same payment
//   P3 14.12 fix · 14.9 idempotency key · 16.02 unique key bhejo · 17.85 same key dobara · 20.69 charge nahi
//   RULE 21.58 · 22.11 jo request · P4 25.0 follow (voice ends 27.43)
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Card, Cut} from "./cine";

export const P2 = 226;
export const P3 = 422;
export const RULE = 645;
export const P4 = 750;
export const E5_TOTAL = 837;

const money = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;

// ---- bits ----
const Sms: React.FC<{at: number; top: number; bad?: boolean; good?: boolean; label?: string}> = ({at, top, bad, good, label}) => {
  const f = useCurrentFrame();
  const s = out(f, at, at + 10);
  const shake = bad && f > at + 6 && f < at + 20 ? Math.sin((f - at) * 2.4) * 8 : 0;
  const border = bad ? C.bug : good ? C.g : C.line;
  return (
    <div style={{position: "absolute", left: 64, right: 150, top, opacity: s, transform: `translate(${shake}px, ${(1 - s) * -40}px)`, display: "flex", gap: 20, alignItems: "center", padding: "18px 22px", borderRadius: 22, background: C.card2, border: `2.5px solid ${border}`, boxShadow: "0 18px 40px rgba(0,0,0,.35)"}}>
      <div style={{width: 64, height: 64, flex: "0 0 64px", borderRadius: 16, background: bad ? `${C.bug}22` : `${C.g}1F`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 20, fontWeight: 700, color: bad ? C.bug : C.g}}>SMS</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.dim}}>
          <span>BANK · UPI</span>
          <span style={{color: bad ? C.bug : C.dim}}>{label || "now"}</span>
        </div>
        <div style={{fontFamily: SANS, fontSize: 29, fontWeight: 600, color: C.text, marginTop: 4}}>
          Rs.499.00 <span style={{color: bad ? C.bug : C.text}}>debited</span> from A/c XX4821
        </div>
      </div>
    </div>
  );
};

const Arrow: React.FC<{y: number; x1: number; x2: number; at: number; color: string; label?: string; dur?: number}> = ({y, x1, x2, at, color, label, dur = 10}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + dur], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  if (p <= 0) return null;
  const dir = Math.sign(x2 - x1);
  const xe = x1 + (x2 - x1) * p;
  return (
    <>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        <line x1={x1} y1={y} x2={xe - dir * 10} y2={y} stroke={color} strokeWidth={5} />
        <polygon points={`${xe},${y} ${xe - dir * 22},${y - 12} ${xe - dir * 22},${y + 12}`} fill={color} />
      </svg>
      {label ? (
        <div style={{position: "absolute", left: Math.min(x1, x2), width: Math.abs(x2 - x1), top: y - 46, textAlign: "center", fontFamily: MONO, fontSize: 23, color, opacity: out(f, at + 4, at + 10)}}>{label}</div>
      ) : null}
    </>
  );
};

const Ripple: React.FC<{x: number; y: number; at: number}> = ({x, y, at}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 16], [0, 1], clamp);
  if (f < at || p >= 1) return null;
  return (
    <>
      <div style={{position: "absolute", left: x - 20, top: y - 20, width: 40, height: 40, borderRadius: 20, background: C.bug, opacity: 1 - p, transform: `scale(${0.6 + p * 0.4})`}} />
      <div style={{position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: 70, border: `4px solid ${C.bug}`, opacity: 1 - p, transform: `scale(${0.3 + p})`}} />
    </>
  );
};

// ---- scene 1: the double debit ----
const TAP1 = 129, TAP2 = 139, SMS1 = 168, SMS2 = 198;
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const processing = f >= TAP1 + 2;
  const total = f < SMS1 ? 0 : f < SMS2 ? 499 * out(f, SMS1, SMS1 + 8) : 499 + 499 * out(f, SMS2, SMS2 + 8);
  const btnY = 1035;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 268}}>
        <Slam at={-30} size={100}>₹499 order.</Slam>
        <Slam at={78} size={100} color={C.bug} style={{marginTop: 10}}>₹998 debited.</Slam>
      </div>

      {/* request log, left of the phone */}
      <div style={{position: "absolute", left: 64, top: 640, width: 250, fontFamily: MONO, fontSize: 21, lineHeight: 1.5, color: C.dim}}>
        <div style={{letterSpacing: "0.14em", marginBottom: 10}}>REQUESTS</div>
        {[[TAP1, "10:42:01.204", C.text], [TAP2, "10:42:01.611", C.bug]].map(([at, t, col], i) => (
          <div key={i} style={{opacity: out(f, (at as number) + 2, (at as number) + 8), marginBottom: 14}}>
            <div style={{color: col as string}}>POST /pay</div>
            <div>{t as string}</div>
          </div>
        ))}
      </div>

      {/* the phone */}
      <div style={{position: "absolute", left: 340, top: 520, width: 400, height: 640, borderRadius: 58, border: `6px solid #3A3C42`, background: "#111214", boxShadow: "0 40px 80px rgba(0,0,0,.5)", overflow: "hidden"}}>
        <div style={{position: "absolute", left: 150, top: 16, width: 100, height: 26, borderRadius: 13, background: "#000"}} />
        <div style={{position: "absolute", left: 34, right: 34, top: 90, fontFamily: SANS}}>
          <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: "0.12em", color: C.dim}}>PAYING</div>
          <div style={{fontSize: 30, fontWeight: 700, marginTop: 8, color: C.text}}>Chai &amp; Code Store</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>chaicode@upi</div>
          <div style={{fontSize: 104, fontWeight: 900, fontStretch: "80%", marginTop: 40, color: C.text}}>₹499</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>1 × Debug Mug</div>
        </div>
        <div style={{position: "absolute", left: 34, right: 34, top: 470, height: 84, borderRadius: 42, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 30, fontWeight: 800, background: processing ? "#2C2E33" : C.g, color: processing ? C.dim : C.bg, transform: `scale(${f >= TAP1 && f < TAP1 + 4 ? 0.95 : f >= TAP2 && f < TAP2 + 4 ? 0.95 : 1})`}}>
          {processing ? `Processing${".".repeat(1 + (Math.floor(f / 6) % 3))}` : "PAY ₹499"}
        </div>
      </div>
      <Ripple x={540} y={btnY} at={TAP1} />
      <Ripple x={560} y={btnY + 6} at={TAP2} />
      {f > TAP2 + 2 ? (
        <div style={{position: "absolute", left: 770, top: 930}}>
          <Slam at={TAP2 + 3} size={110} color={C.bug}>×2</Slam>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.bug, marginTop: 6, opacity: out(f, TAP2 + 8, TAP2 + 14)}}>TAPS</div>
        </div>
      ) : null}

      {/* bottom: bank SMS + running total */}
      {f >= SMS1 ? <Sms at={SMS1} top={1200} /> : null}
      {f >= SMS2 ? <Sms at={SMS2} top={1330} bad label="again" /> : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1480, display: "flex", alignItems: "baseline", justifyContent: "space-between"}}>
        <div>
          <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim}}>TOTAL DEBITED</div>
          <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 110, lineHeight: 1, color: total > 600 ? C.bug : C.text}}>{money(total)}</div>
        </div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, textAlign: "right"}}>expected<br /><span style={{color: C.g, fontSize: 30}}>₹499</span></div>
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 2: what happened (sequence diagram) ----
const LANES = [{x: 190, name: "APP"}, {x: 540, name: "SERVER"}, {x: 860, name: "BANK"}];
const Cause: React.FC = () => {
  const f = useCurrentFrame();
  const slow = interpolate(f, [18, 46], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Section text="02 / WHAT HAPPENED" />
      {LANES.map((l, i) => (
        <React.Fragment key={l.name}>
          <div style={{position: "absolute", left: l.x - 105, top: 330, width: 210, padding: "14px 0", textAlign: "center", borderRadius: 16, background: C.card, border: `2.5px solid ${C.line}`, fontFamily: MONO, fontSize: 26, color: C.text, opacity: out(f, i * 3, i * 3 + 8)}}>{l.name}</div>
          <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
            <line x1={l.x} y1={410} x2={l.x} y2={410 + 920 * out(f, i * 3, i * 3 + 20)} stroke={C.line} strokeWidth={3} strokeDasharray="10 10" />
          </svg>
        </React.Fragment>
      ))}
      <Arrow y={480} x1={190} x2={540} at={4} color={C.g} label="POST /pay ₹499" />
      <Arrow y={560} x1={540} x2={860} at={14} color={C.g} label="debit ₹499" />
      {/* the slow call */}
      <div style={{position: "absolute", left: 856, top: 575, width: 8, height: 130 * slow, background: C.bug, borderRadius: 4, opacity: 0.85}} />
      <div style={{position: "absolute", left: 580, top: 610, fontFamily: MONO, fontSize: 23, color: C.bug, opacity: out(f, 20, 28)}}>bank is slow… {(slow * 4.2).toFixed(1)}s</div>
      <div style={{position: "absolute", left: 82, top: 650, padding: "8px 16px", borderRadius: 12, border: `2px solid ${C.bug}`, fontFamily: MONO, fontSize: 23, color: C.bug, opacity: out(f, 42, 48)}}>timeout → retry</div>
      <Arrow y={760} x1={190} x2={540} at={50} color={C.bug} label="POST /pay ₹499 (again)" />
      {[[90, "req #1 · new ✓", 830], [102, "req #2 · new ✓", 885]].map(([at, t, y]) => (
        <div key={t as string} style={{position: "absolute", left: 420, width: 240, top: y as number, textAlign: "center", padding: "6px 0", borderRadius: 12, background: C.card, border: `2px solid ${(at as number) === 102 ? C.bug : C.line}`, fontFamily: MONO, fontSize: 22, color: (at as number) === 102 ? C.bug : C.text, opacity: out(f, at as number, (at as number) + 6)}}>{t as string}</div>
      ))}
      <Arrow y={990} x1={540} x2={860} at={112} color={C.bug} label="debit ₹499 (again)" />
      <Arrow y={1080} x1={860} x2={190} at={122} color={C.dim} label="✓ ₹499" dur={14} />
      <Arrow y={1170} x1={860} x2={190} at={128} color={C.bug} label="✓ ₹499" dur={14} />
      <div style={{position: "absolute", left: 64, top: 1300}}>
        <Slam at={132} size={76}>Server had no idea</Slam>
        <Slam at={160} size={76} color={C.bug} style={{marginTop: 10}}>it's the same payment.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1510, fontFamily: MONO, fontSize: 28, color: C.text, opacity: out(f, 174, 182)}}>
        2 requests · 2 charges · 1 angry customer
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 3: idempotency key ----
const R1 = 90, R2 = 116, HIT = 152, BACK = 170, NOCHARGE = 186;
const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const pill = (at: number, y: number, n: number) => {
    const p = interpolate(f, [at, at + 16], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return (
      <div style={{position: "absolute", left: 64, top: y, width: 250, padding: "12px 16px", borderRadius: 16, background: C.card2, border: `2.5px solid ${n === 2 ? C.bug : C.line}`, fontFamily: MONO, fontSize: 22, opacity: out(f, at - 6, at), transform: `translateX(${p * 20}px)`}}>
        <div style={{color: n === 2 ? C.bug : C.text}}>req #{n}</div>
        <div style={{color: C.g}}>key 7f3a-91c2</div>
      </div>
    );
  };
  const hit = f >= HIT && f < HIT + 30;
  const total = f >= BACK + 14;
  return (
    <AbsoluteFill>
      <Section text="03 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={24} size={100} color={C.g}>Idempotency</Slam>
        <Slam at={36} size={100} style={{marginTop: 8}}>key.</Slam>
      </div>
      <Card title="app → server" tag={f > 96 ? "1 KEY PER PAYMENT" : "TYPING"} tagColor={f > 96 ? C.g : C.dim} border={f > 96 ? C.g : C.line} style={{top: 560}}>
        {typed("POST /pay  {amount: 499}", f, 56, 60)}
        {"\n"}
        <span>{typed("Idempotency-Key: ", f, 72, 60)}</span>
        <span style={{color: C.g}}>{typed("7f3a-91c2", f, 86, 60)}</span>
      </Card>

      {/* requests → key store → bank */}
      {pill(R1, 800, 1)}
      {f >= R2 - 6 ? pill(R2, 920, 2) : null}
      <div style={{position: "absolute", left: 380, top: 790, width: 330, height: 230, borderRadius: 20, background: C.card, border: `2.5px solid ${hit ? C.g : C.line}`, opacity: out(f, R1 - 10, R1)}}>
        <div style={{padding: "12px 18px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 22, color: C.dim, letterSpacing: "0.1em"}}>KEY STORE</div>
        <div style={{padding: "14px 18px", fontFamily: MONO, fontSize: 21, lineHeight: 1.5, opacity: out(f, R1 + 14, R1 + 20), background: hit ? `${C.g}22` : "transparent"}}>
          <div style={{color: C.g}}>7f3a-91c2</div>
          <div style={{color: C.text}}>→ charged ₹499</div>
        </div>
        {hit ? <div style={{position: "absolute", right: 14, top: 12, fontFamily: MONO, fontSize: 22, color: C.g}}>HIT ✓</div> : null}
      </div>
      <Arrow y={835} x1={334} x2={380} at={R1 + 8} color={C.dim} dur={6} />
      <Arrow y={955} x1={334} x2={380} at={R2 + 10} color={C.bug} dur={6} />
      <div style={{position: "absolute", left: 770, top: 820, width: 160, padding: "16px 0", textAlign: "center", borderRadius: 16, background: C.card, border: `2.5px solid ${C.line}`, fontFamily: MONO, fontSize: 24, color: C.text, opacity: out(f, R1, R1 + 8)}}>BANK</div>
      <Arrow y={870} x1={710} x2={770} at={R1 + 20} color={C.g} dur={6} label="" />
      {f > R1 + 26 ? <div style={{position: "absolute", left: 770, width: 160, top: 900, textAlign: "center", fontFamily: MONO, fontSize: 22, color: C.g}}>✓ 1 charge</div> : null}
      {/* second request never reaches the bank */}
      {f > NOCHARGE ? <div style={{position: "absolute", left: 726, top: 960, fontFamily: MONO, fontSize: 46, fontWeight: 700, color: C.bug, opacity: out(f, NOCHARGE, NOCHARGE + 6)}}>✕</div> : null}
      <Arrow y={1060} x1={545} x2={190} at={BACK} color={C.g} label="↩ same result, no charge" dur={14} />

      {/* bottom: what the customer sees now */}
      {f >= R1 + 26 ? <Sms at={R1 + 26} top={1150} good /> : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1310, display: "flex", alignItems: "baseline", justifyContent: "space-between", opacity: out(f, R1 + 30, R1 + 38)}}>
        <div>
          <div style={{fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim}}>TOTAL DEBITED</div>
          <div style={{display: "flex", alignItems: "baseline", gap: 24}}>
            <span style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 110, lineHeight: 1, color: C.g}}>₹499</span>
            {total ? <span style={{fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: 54, color: C.bug, textDecoration: "line-through", opacity: out(f, BACK + 14, BACK + 20)}}>₹998</span> : null}
          </div>
        </div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.g, textAlign: "right", opacity: total ? 1 : 0}}>taps: 2<br />charges: 1</div>
      </div>
      {total ? (
        <div style={{position: "absolute", left: 64, top: 1480}}>
          <Slam at={BACK + 18} size={60} color={C.g}>Tap twice. Pay once.</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- scene 4: the rule ----
const ROWS: [string, string][] = [["Pay button", "disable after 1st tap"], ["Client", "send an Idempotency-Key"], ["Server", "save key + result"], ["Retry", "same key, every time"]];
const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const n = P4 - RULE;
  return (
    <AbsoluteFill>
      <Section text="04 / THE RULE" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={14} size={96}>If a request</Slam>
        <Slam at={32} size={96} style={{marginTop: 8}}>can come twice,</Slam>
        <Slam at={62} size={96} color={C.bug} style={{marginTop: 8}}>it will.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 690, borderRadius: 24, background: C.card, border: `2.5px solid ${C.line}`, overflow: "hidden", opacity: out(f, 72, 80)}}>
        <div style={{padding: "14px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 22, color: C.dim}}>payments cheat sheet · save this</div>
        {ROWS.map(([k, v], i) => (
          <div key={k} style={{display: "flex", justifyContent: "space-between", gap: 20, padding: "18px 24px", borderTop: i ? `2px solid ${C.line}` : "none", opacity: out(f, 78 + i * 6, 86 + i * 6)}}>
            <span style={{fontFamily: MONO, fontSize: 27, color: C.g}}>{k}</span>
            <span style={{fontFamily: SANS, fontSize: 29, color: C.text}}>{v}</span>
          </div>
        ))}
      </div>
      {f > n - 4 ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1130, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "22px 30px", opacity: out(f, n - 4, n + 6), transform: `translateY(${(1 - out(f, n - 4, n + 6)) * 30}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>NEXT · 006</div>
          <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 6, color: C.text}}>Another bug you've <span style={{color: C.bug}}>probably shipped</span></div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, n + 10, 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1420, display: "flex", alignItems: "center", gap: 18, opacity: out(f, 96, 106)}}>
        <svg width={34} height={44}><path d="M3 3 H31 V41 L17 30 L3 41 Z" fill="none" stroke={C.g} strokeWidth={4} strokeLinejoin="round" /></svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.g}}>SAVE FOR LATER</div>
          <div style={{fontFamily: SANS, fontSize: 26, color: C.dim}}>before your next payment integration</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const DebugDiaries005: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <Backdrop />
    <Sequence durationInFrames={P2}><Hook /></Sequence>
    <Sequence from={P2} durationInFrames={P3 - P2}><Cause /></Sequence>
    <Sequence from={P3} durationInFrames={RULE - P3}><Fix /></Sequence>
    <Sequence from={RULE} durationInFrames={E5_TOTAL - RULE}><Rule /></Sequence>
    {[P2, P3, RULE].map((c) => <Cut key={c} at={c} />)}
    <Hud ep="005" total={E5_TOTAL} />
  </AbsoluteFill>
);
