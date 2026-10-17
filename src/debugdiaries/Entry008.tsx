// Debug Diaries · Entry 008 "Why Tatkal shows waiting list at 10:00:02" — IRCTC under the hood.
// 6 scenes, each a 3D card (Card3D) with the coral wipe: phone countdown → thundering herd → one seat + DB lock →
// bots vs Aadhaar OTP → waiting room + cache/DB split → pro tip.
// Facts: Tatkal AC opens 10:00; IRCTC deactivated 3 crore+ suspicious IDs (2025–26); Aadhaar OTP mandatory for
// online Tatkal since July 2025. Generic system-design fix (queue/waiting room, cache reads) is presented as the
// pattern, not as IRCTC's internal design.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/008/voice.wav, pauses ≤0.18s); cue times in seconds.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Card, Cut, Card3D} from "./cine";

const T = (s: number) => Math.round(s * 30);
export const S2 = T(6.53);
export const S3 = T(15.85);
export const S4 = T(25.39);
export const S5 = T(35.41);
export const S6 = T(43.51);
export const E8_TOTAL = T(48.89) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const rnd = (i: number, k = 1) => {
  const x = Math.sin(i * 12.9898 * k + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

// ===================== 1 · hook: the phone at 10:00 =====================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f < 30 ? -2 + (f / 30) * 2 : interpolate(f, [30, T(3.84)], [0, 2], clamp);
  const s = Math.floor(sec);
  const clock = s < 0 ? `09:59:${String(60 + s).padStart(2, "0")}` : `10:00:${String(s).padStart(2, "0")}`;
  const tap = T(1.28);
  const wl = T(3.84);
  const flip = interpolate(f, [wl, wl + 10], [0, 180], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const avl = Math.round(interpolate(f, [30, wl], [120, 0], {...clamp, easing: Easing.in(Easing.quad)}));
  const wob = Math.sin(f / 25) * 3;
  const zoom = interpolate(f, [T(4.73), T(6.4)], [1, 1.6], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 268}}>
        <Slam at={-30} size={80}>Clicked at 10:00:00.</Slam>
        <Slam at={wl} size={80} color={C.bug} style={{marginTop: 8}}>Waiting list at :02.</Slam>
      </div>
      {/* 3D phone */}
      <div style={{position: "absolute", left: 110, top: 470, width: 400, height: 780, perspective: 1300}}>
        <div style={{width: "100%", height: "100%", transform: `rotateY(${16 + wob}deg) rotateX(${6 - wob * 0.5}deg)`, transformStyle: "preserve-3d", borderRadius: 60, border: "7px solid #3A3C42", background: "#111214", boxShadow: "-40px 50px 90px rgba(0,0,0,.6)", overflow: "hidden", position: "relative"}}>
          <div style={{position: "absolute", left: 150, top: 16, width: 100, height: 26, borderRadius: 13, background: "#000"}} />
          <div style={{position: "absolute", left: 30, right: 30, top: 70}}>
            <div style={{...label, fontSize: 18}}>TATKAL · AC 3-TIER</div>
            <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 8}}>NDLS → BCT</div>
            <div style={{fontFamily: MONO, fontSize: 70, fontWeight: 700, marginTop: 24, color: s >= 0 ? C.g : C.text, letterSpacing: "-0.03em"}}>{clock}</div>
          </div>
          {/* availability card flips from AVL to WL */}
          <div style={{position: "absolute", left: 30, right: 30, top: 300, height: 170, perspective: 700}}>
            <div style={{position: "relative", width: "100%", height: "100%", transform: `rotateX(${flip}deg)`, transformStyle: "preserve-3d"}}>
              <div style={{position: "absolute", inset: 0, borderRadius: 22, background: "#1C2A21", border: `3px solid ${C.g}`, padding: "18px 22px", backfaceVisibility: "hidden"}}>
                <div style={{...label, fontSize: 18, color: C.g}}>AVAILABLE</div>
                <div style={big(68, C.g)}>AVL {avl}</div>
              </div>
              <div style={{position: "absolute", inset: 0, borderRadius: 22, background: "#2A1D1B", border: `3px solid ${C.bug}`, padding: "18px 22px", transform: "rotateX(180deg)", backfaceVisibility: "hidden"}}>
                <div style={{...label, fontSize: 18, color: C.bug}}>STATUS</div>
                <div style={big(68, C.bug)}>WL 87</div>
              </div>
            </div>
          </div>
          <div style={{position: "absolute", left: 30, right: 30, top: 520, height: 90, borderRadius: 45, display: "grid", placeItems: "center", fontFamily: SANS, fontSize: 30, fontWeight: 800, background: f >= tap + 2 ? "#2C2E33" : C.g, color: f >= tap + 2 ? C.dim : C.bg}}>
            {f >= tap + 2 ? (f >= wl ? "Booking failed" : `Please wait${".".repeat(1 + (Math.floor(f / 6) % 3))}`) : "BOOK NOW"}
          </div>
          {f >= tap + 2 && f < wl ? (
            <svg width={80} height={80} style={{position: "absolute", left: 160, top: 640, transform: `rotate(${f * 14}deg)`}}>
              <circle cx={40} cy={40} r={30} fill="none" stroke={C.line} strokeWidth={8} />
              <path d="M40 10 A30 30 0 0 1 70 40" fill="none" stroke={C.g} strokeWidth={8} strokeLinecap="round" />
            </svg>
          ) : null}
        </div>
      </div>
      {f >= tap && f < tap + 16 ? (
        <div style={{position: "absolute", left: 300 - 70, top: 1035 - 70, width: 140, height: 140, borderRadius: 70, border: `5px solid ${C.bug}`, opacity: 1 - (f - tap) / 16, transform: `scale(${0.3 + (f - tap) / 16})`}} />
      ) : null}
      {/* right: seats draining */}
      <div style={{position: "absolute", left: 600, top: 560, width: 330}}>
        <div style={label}>SEATS LEFT</div>
        <div style={big(150, avl > 0 ? C.text : C.bug)}>{avl}</div>
        <div style={{marginTop: 18, height: 260, width: 70, borderRadius: 16, border: `3px solid ${C.line}`, position: "relative", overflow: "hidden"}}>
          <div style={{position: "absolute", left: 0, right: 0, bottom: 0, height: `${(avl / 120) * 100}%`, background: avl > 30 ? C.g : C.bug}} />
        </div>
        <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 14}}>in ~2 seconds</div>
      </div>
      {/* bottom: why? + 3D server rack the camera dives into */}
      <div style={{position: "absolute", left: 64, top: 1330}}>
        {f > T(4.2) ? <Slam at={T(4.29)} size={120} color={C.bug}>Why?</Slam> : null}
        <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 14}}>{typed("→ inside IRCTC's server", f, T(4.73), 40)}</div>
      </div>
      <div style={{position: "absolute", left: 640, top: 1290, width: 280, height: 300, perspective: 900, opacity: out(f, T(4.6), T(5)), transform: `scale(${zoom})`, transformOrigin: "50% 50%"}}>
        <div style={{transform: "rotateY(-28deg) rotateX(10deg)", transformStyle: "preserve-3d"}}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{height: 62, marginBottom: 10, borderRadius: 10, background: C.card, border: `2.5px solid ${C.line}`, display: "flex", alignItems: "center", gap: 10, padding: "0 16px"}}>
              {[0, 1, 2].map((j) => <span key={j} style={{width: 12, height: 12, borderRadius: 6, background: (Math.floor(f / 4) + i + j) % 3 === 0 ? C.g : "#2E4A36"}} />)}
              <span style={{flex: 1, height: 6, borderRadius: 3, background: "#3A3C42"}} />
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 2 · thundering herd =====================
const HERD = Array.from({length: 110}, (_, i) => ({sx: rnd(i) * 1080, sy: 1560 + rnd(i, 3) * 300, d: rnd(i, 7) * 40}));
const Herd: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const draw = interpolate(f, [L(6.6), L(10.4)], [0, 1], clamp);
  const storm = f >= L(14.17);
  const shake = storm && f < L(14.17) + 18 ? Math.sin(f * 3.1) * 10 : 0;
  // traffic line: flat, then a spike at 10:00
  const W = 860, H = 380;
  const pts: [number, number][] = [];
  for (let i = 0; i <= 100; i++) {
    const x = i / 100;
    const spike = Math.exp(-Math.pow((x - 0.62) / 0.012, 2));
    pts.push([x * W, H - 30 - (8 + Math.sin(i * 1.7) * 4) - spike * 520]);
  }
  const shown = pts.slice(0, Math.max(2, Math.round(draw * 101)));
  const load = interpolate(f, [L(8.2), L(10.9)], [6, 140], clamp);
  return (
    <AbsoluteFill style={{transform: `translateX(${shake}px)`}}>
      <Section text="02 / THUNDERING HERD" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(8.2)} size={78}>Lakhs click. Same second.</Slam>
        {f > L(11.3) ? <Slam at={L(11.44)} size={92} color={C.bug} style={{marginTop: 10}}>Thundering herd.</Slam> : null}
      </div>
      {/* 3D traffic chart */}
      <div style={{position: "absolute", left: 64, top: 560, width: W, height: H + 60, perspective: 1100}}>
        <div style={{position: "relative", width: W, height: H, transform: "rotateX(28deg) rotateY(-10deg)", transformOrigin: "50% 100%", borderRadius: 18, background: C.card, border: `2.5px solid ${C.line}`, overflow: "visible"}}>
          <svg width={W} height={H} style={{overflow: "visible"}}>
            <line x1={0} x2={W} y1={150} y2={150} stroke={C.bug} strokeWidth={3} strokeDasharray="10 10" />
            <text x={W - 10} y={140} textAnchor="end" fill={C.bug} fontFamily={MONO} fontSize={22}>server capacity</text>
            <polyline points={shown.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke={draw > 0.62 ? C.bug : C.g} strokeWidth={6} strokeLinejoin="round" />
            {["06:00", "08:00", "10:00", "12:00", "14:00"].map((t, i) => (
              <text key={t} x={(i / 4) * (W - 80) + 40} y={H - 4} textAnchor="middle" fill={t === "10:00" ? C.bug : C.dim} fontFamily={MONO} fontSize={20}>{t}</text>
            ))}
          </svg>
          {f > L(13.03) ? <div style={{position: "absolute", left: 40, top: H - 110, fontFamily: MONO, fontSize: 24, color: C.g, opacity: out(f, L(13.03), L(13.4))}}>quiet all day</div> : null}
          {storm ? <div style={{position: "absolute", left: W * 0.62 + 24, top: -40, fontFamily: MONO, fontSize: 26, color: C.bug, opacity: out(f, L(14.17), L(14.5))}}>1-second storm ⚡</div> : null}
        </div>
      </div>
      {/* the herd: users rush one server */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {HERD.map((h, i) => {
          const at = L(8.2) + h.d;
          if (f < at) return null;
          const p = Easing.in(Easing.quad)(((f - at) % 34) / 34); // continuous stream into the server
          const tx = 820 + Math.cos(i) * 40 * p, ty = 1250 + Math.sin(i) * 40 * p;
          const x = h.sx + (tx - h.sx) * p, y = h.sy + (ty - h.sy) * p - Math.sin(p * Math.PI) * 120;
          const k = 0.6 + (1 - (y - 1100) / 800) * 0.6;
          return <circle key={i} cx={x} cy={y} r={7 * k} fill={i % 5 === 0 ? C.bug : C.g} opacity={0.8} />;
        })}
      </svg>
      <div style={{position: "absolute", left: 740, top: 1170, width: 170, height: 170, borderRadius: 24, background: load > 100 ? "#2A1D1B" : C.card, border: `3px solid ${load > 100 ? C.bug : C.line}`, display: "grid", placeItems: "center", boxShadow: load > 100 ? `0 0 60px ${C.bug}66` : "none", transform: "perspective(600px) rotateY(-20deg)"}}>
        <span style={{fontFamily: MONO, fontSize: 24, color: C.text}}>SERVER</span>
      </div>
      <div style={{position: "absolute", left: 64, top: 1120, width: 560}}>
        <div style={label}>SERVER LOAD</div>
        <div style={big(110, load > 100 ? C.bug : C.text)}>{Math.round(load)}%</div>
        <div style={{marginTop: 12, height: 22, borderRadius: 11, background: C.line, overflow: "hidden", width: 520}}>
          <div style={{height: "100%", width: `${Math.min(100, load)}%`, background: load > 100 ? C.bug : C.g}} />
        </div>
        {load > 100 ? <div style={{fontFamily: MONO, fontSize: 26, color: C.bug, marginTop: 12}}>OVERLOAD</div> : null}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 3 · one seat, one lock, a long line =====================
const Seat: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const lock = out(f, L(18.16), L(18.7));
  const qn = Math.round(interpolate(f, [L(20.62), L(23.4)], [0, 14], clamp));
  const winner = f > L(22.6);
  const load = interpolate(f, [L(23.9), L(25.3)], [0.1, 0.32], clamp);
  return (
    <AbsoluteFill>
      <Section text="03 / ONE SEAT" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(15.95)} size={84}>1 seat = 1 person.</Slam>
      </div>
      {/* 3D coach, seen from above */}
      <div style={{position: "absolute", left: 64, right: 150, top: 470, height: 360, perspective: 1100}}>
        <div style={{transform: "rotateX(48deg)", transformOrigin: "50% 100%", borderRadius: 26, background: C.card, border: `2.5px solid ${C.line}`, padding: 22, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12, boxShadow: "0 50px 80px rgba(0,0,0,.5)"}}>
          {Array.from({length: 24}).map((_, i) => {
            const last = i === 13;
            return (
              <div key={i} style={{height: 70, borderRadius: 10, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 22, fontWeight: 700, background: last ? (winner ? "#1C2A21" : "#2A2A20") : "#2A1D1B", border: `2.5px solid ${last ? C.g : "#5A2E28"}`, color: last ? C.g : "#9A4E45", boxShadow: last ? `0 0 ${20 + Math.sin(f / 4) * 10}px ${C.g}88` : "none"}}>
                {last ? "32" : i + 1 + (i >= 13 ? 1 : 0)}
              </div>
            );
          })}
        </div>
        {lock > 0 ? (
          <svg width={90} height={110} style={{position: "absolute", left: 455, top: 40, transform: `scale(${1 + (1 - lock) * 1.5})`, opacity: lock}}>
            <path d="M22 50 V32 A23 23 0 0 1 68 32 V50" fill="none" stroke={C.text} strokeWidth={9} />
            <rect x={10} y={48} width={70} height={56} rx={10} fill={C.bug} />
            <circle cx={45} cy={74} r={7} fill={C.bg} />
          </svg>
        ) : null}
      </div>
      <div style={{position: "absolute", left: 64, top: 830, fontFamily: MONO, fontSize: 24, color: C.dim, opacity: out(f, L(16.5), L(17))}}>last seat: <span style={{color: C.g}}>B3 · 32</span> · everything else booked</div>
      <Card title="database" tag={lock > 0 ? "LOCKED" : "TXN"} tagColor={lock > 0 ? C.bug : C.dim} border={lock > 0 ? C.bug : C.line} style={{top: 885}}>
        {typed("BEGIN;", f, L(18.2), 50)}
        {"\n"}
        <span>{typed("SELECT * FROM seats WHERE no = 32", f, L(18.5), 60)}</span>
        <span style={{color: C.bug}}>{typed(" FOR UPDATE;", f, L(19.6), 60)}</span>
      </Card>
      {/* the line of requests, receding in 3D toward the lock */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1110, height: 330, perspective: 900}}>
        <div style={{position: "absolute", left: 64, top: 0, width: 880, height: 300, transform: "rotateX(52deg)", transformOrigin: "50% 0%"}}>
          {Array.from({length: qn}).map((_, i) => {
            const row = Math.floor(i / 7), col = i % 7;
            const win = winner && i === 0;
            return (
              <div key={i} style={{position: "absolute", left: col * 124, top: row * 90, width: 110, height: 70, borderRadius: 12, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 20, background: win ? "#1C2A21" : winner ? "#2A1D1B" : C.card2, border: `2.5px solid ${win ? C.g : winner ? C.bug : C.line}`, color: win ? C.g : winner ? C.bug : C.text}}>
                {win ? "✓ YOU?" : winner ? "SOLD" : `req ${i + 1}`}
              </div>
            );
          })}
        </div>
        {qn > 6 ? <div style={{position: "absolute", right: 150, top: 250, fontFamily: MONO, fontSize: 26, color: C.bug}}>+ thousands waiting…</div> : null}
      </div>
      {/* bottom: what the user feels */}
      {f > L(23.7) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1440, opacity: out(f, L(23.8), L(24.2))}}>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24, color: C.dim}}><span>irctc.co.in</span><span style={{color: C.bug}}>Loading…</span></div>
          <div style={{marginTop: 10, height: 18, borderRadius: 9, background: C.line, overflow: "hidden"}}><div style={{height: "100%", width: `${load * 100}%`, background: C.bug}} /></div>
          <Slam at={L(23.95)} size={60} color={C.bug} style={{marginTop: 14}}>That's the "slow site".</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 4 · bots vs humans, Aadhaar OTP =====================
const Bots: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const human = interpolate(f, [L(26.6), L(28.6)], [0, 0.3], clamp);
  const bot = interpolate(f, [L(26.6), L(26.9)], [0, 1], clamp);
  const ids = Math.round(interpolate(f, [L(28.84), L(31.7)], [0, 3], {...clamp, easing: Easing.out(Easing.cubic)}) * 100) / 100;
  const otp = Math.floor(interpolate(f, [L(34.0), L(34.9)], [0, 6], clamp));
  return (
    <AbsoluteFill>
      <Section text="04 / BOTS" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(25.45)} size={88} color={C.bug}>Then come the bots.</Slam>
      </div>
      {/* race: human vs bot filling the passenger form */}
      <div style={{position: "absolute", left: 64, right: 150, top: 460, display: "grid", gap: 16}}>
        {[["HUMAN", human, C.g, `${Math.round(human * 100)}% · typing…`], ["BOT", bot, C.bug, bot >= 1 ? "100% · 0.3s ✓" : "…"]].map(([who, p, col, txt]) => (
          <div key={who as string} style={{padding: "18px 22px", borderRadius: 20, background: C.card, border: `2.5px solid ${who === "BOT" && (p as number) >= 1 ? C.bug : C.line}`, transform: `perspective(900px) rotateX(10deg)`, opacity: out(f, L(26.4), L(26.8))}}>
            <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24}}>
              <span style={{color: col as string}}>{who === "BOT" ? "🤖 BOT" : "🙋 HUMAN"}</span>
              <span style={{color: C.dim}}>{txt as string}</span>
            </div>
            <div style={{display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginTop: 12}}>
              {["Name", "Age", "Berth", "Pay"].map((fld, j) => (
                <div key={fld} style={{height: 46, borderRadius: 10, border: `2px solid ${(p as number) * 4 > j ? (col as string) : C.line}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 20, color: (p as number) * 4 > j ? (col as string) : C.dim}}>{fld}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* 3 crore+ IDs blocked: a wall of ID cards flipping */}
      <div style={{position: "absolute", left: 64, right: 150, top: 830, opacity: out(f, L(28.7), L(29.1))}}>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "baseline"}}>
          <div>
            <div style={label}>FAKE IDS BLOCKED</div>
            <div style={big(120, C.bug)}>{ids >= 3 ? "3 crore+" : `${ids.toFixed(1)} cr`}</div>
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, textAlign: "right"}}>IRCTC<br />2025–26</div>
        </div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 8, marginTop: 14, perspective: 800}}>
          {Array.from({length: 30}).map((_, i) => {
            const at = L(29.0) + (i % 10) * 2 + Math.floor(i / 10) * 4;
            const r = interpolate(f, [at, at + 8], [0, 180], clamp);
            return (
              <div key={i} style={{height: 46, borderRadius: 8, transform: `rotateY(${r}deg)`, background: r > 90 ? "#2A1D1B" : C.card2, border: `2px solid ${r > 90 ? C.bug : C.line}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 20, color: C.bug}}>
                <span style={{transform: r > 90 ? "scaleX(-1)" : "none"}}>{r > 90 ? "✕" : ""}</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Aadhaar OTP shield */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1240, height: 330, perspective: 1000, opacity: out(f, L(32.0), L(32.4))}}>
        <div style={{position: "absolute", left: 40, top: 20, width: 470, padding: "22px 26px", borderRadius: 26, background: "#1C2A21", border: `3px solid ${C.g}`, transform: "rotateY(18deg)", boxShadow: `0 0 50px ${C.g}33`}}>
          <div style={{...label, color: C.g}}>TATKAL · AADHAAR OTP</div>
          <div style={{display: "flex", gap: 12, marginTop: 16}}>
            {Array.from({length: 6}).map((_, i) => (
              <div key={i} style={{width: 56, height: 70, borderRadius: 12, border: `2.5px solid ${i < otp ? C.g : C.line}`, display: "grid", placeItems: "center", ...big(40, C.g)}}>{i < otp ? "•" : ""}</div>
            ))}
          </div>
          <div style={{fontFamily: MONO, fontSize: 22, color: C.g, marginTop: 14}}>{otp >= 6 ? "✓ verified human" : "enter OTP"}</div>
        </div>
        {[0, 1, 2].map((i) => {
          const at = L(34.6) + i * 5;
          const p = interpolate(f, [at, at + 10], [0, 1], clamp);
          const b = interpolate(f, [at + 10, at + 20], [0, 1], clamp);
          if (p <= 0) return null;
          return <div key={i} style={{position: "absolute", left: 860 - p * 300 + b * 200, top: 40 + i * 90, fontSize: 52, opacity: 1 - b * 0.8}}>🤖{b > 0 ? <span style={{color: C.bug, fontFamily: MONO, fontSize: 40}}>✕</span> : null}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 5 · the fix: waiting room + cache/db split =====================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const pos = Math.round(interpolate(f, [L(36.7), L(40.4)], [4812, 1], {...clamp, easing: Easing.inOut(Easing.cubic)}));
  const dbLoad = f > L(39.4) ? 70 + Math.sin(f / 5) * 3 : interpolate(f, [L(36.7), L(39.4)], [20, 70], clamp);
  return (
    <AbsoluteFill>
      <Section text="05 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(35.5)} size={92} color={C.g}>Waiting room.</Slam>
      </div>
      {/* 3D lobby → gate → database */}
      <div style={{position: "absolute", left: 64, right: 150, top: 470, height: 420, perspective: 1100}}>
        <div style={{position: "absolute", inset: 0, transform: "rotateX(38deg)", transformOrigin: "50% 100%", borderRadius: 26, background: C.card, border: `2.5px solid ${C.line}`}}>
          <svg width={866} height={420} style={{position: "absolute", inset: 0}}>
            {Array.from({length: 48}).map((_, i) => {
              const row = i % 6, col = Math.floor(i / 6);
              const shift = (f * 1.2) % 60;
              const x = 40 + col * 52 + shift, y = 50 + row * 58;
              const inside = x > 420;
              return x < 470 ? <circle key={i} cx={x} cy={y} r={11} fill={inside ? C.g : C.text} opacity={0.75} /> : null;
            })}
            <rect x={470} y={20} width={22} height={380} rx={8} fill={C.g} opacity={0.9} />
            {[0, 1, 2].map((i) => {
              const t = ((f + i * 14) % 42) / 42;
              return <circle key={i} cx={500 + t * 260} cy={210 + (i - 1) * 50} r={12} fill={C.g} />;
            })}
          </svg>
          <div style={{position: "absolute", left: 30, top: 14, ...label}}>LOBBY</div>
          <div style={{position: "absolute", left: 440, top: -30, ...label, color: C.g}}>GATE</div>
        </div>
        <div style={{position: "absolute", right: 10, top: 120, width: 150, height: 210, transform: "perspective(600px) rotateY(-22deg)"}}>
          <svg width={150} height={210}>
            <ellipse cx={75} cy={30} rx={65} ry={22} fill={C.card2} stroke={C.g} strokeWidth={4} />
            <path d="M10 30 V170 A65 22 0 0 0 140 170 V30" fill={C.card2} stroke={C.g} strokeWidth={4} />
            <path d="M10 80 A65 22 0 0 0 140 80 M10 125 A65 22 0 0 0 140 125" fill="none" stroke={C.g} strokeWidth={3} opacity={0.6} />
          </svg>
          <div style={{textAlign: "center", fontFamily: MONO, fontSize: 20, color: C.g}}>DB · {Math.round(dbLoad)}% ✓</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 900, display: "flex", justifyContent: "space-between", alignItems: "baseline", opacity: out(f, L(36.7), L(37.1))}}>
        <div>
          <div style={label}>YOUR POSITION</div>
          <div style={big(110, pos <= 1 ? C.g : C.text)}>{pos.toLocaleString("en-IN")}</div>
        </div>
        <div style={{fontFamily: MONO, fontSize: 24, color: C.g, textAlign: "right"}}>let in only what<br />the DB can handle</div>
      </div>
      {/* cache vs database split */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1080, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        {[
          ["CACHE", "train schedule", "fast · read by everyone", C.g, L(40.74), "⚡"],
          ["DATABASE", "seats", "locked · booking only", C.bug, L(42.13), "🔒"],
        ].map(([t, what, note, col, at, ic]) => (
          <div key={t as string} style={{padding: "22px 22px", borderRadius: 22, background: C.card, border: `3px solid ${col as string}`, transform: `perspective(800px) rotateY(${(1 - out(f, at as number, (at as number) + 10)) * (t === "CACHE" ? 60 : -60)}deg)`, opacity: out(f, at as number, (at as number) + 6)}}>
            <div style={{fontSize: 44}}>{ic as string}</div>
            <div style={{...label, color: col as string, marginTop: 8}}>{t as string}</div>
            <div style={{fontFamily: SANS, fontSize: 38, fontWeight: 800, marginTop: 4}}>{what as string}</div>
            <div style={{fontFamily: MONO, fontSize: 21, color: C.dim, marginTop: 6}}>{note as string}</div>
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1450, fontFamily: MONO, fontSize: 28, opacity: out(f, L(42.3), L(42.7))}}>
        <span style={{color: C.g}}>reads → cache</span>
        <span style={{color: C.dim}}>  ·  </span>
        <span style={{color: C.bug}}>writes → database</span>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 6 · pro tip + follow =====================
const TIPS: [string, number][] = [["Master list filled", T(43.6)], ["UPI app ready", T(45.2)], ["Logged in before 9:58", T(45.8)]];
const Tip: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const wob = Math.sin(f / 22) * 3;
  return (
    <AbsoluteFill>
      <Section text="06 / PRO TIP" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(43.6)} size={88}>Be ready at 9:58.</Slam>
      </div>
      <div style={{position: "absolute", left: 90, right: 170, top: 470, perspective: 1200}}>
        <div style={{transform: `rotateY(${-12 + wob}deg) rotateX(8deg)`, borderRadius: 26, background: C.card, border: `2.5px solid ${C.line}`, padding: "24px 28px", boxShadow: "30px 50px 80px rgba(0,0,0,.5)"}}>
          <div style={label}>TATKAL CHECKLIST</div>
          {TIPS.map(([t, at]) => {
            const a = at - off;
            const on = f > a;
            return (
              <div key={t} style={{display: "flex", alignItems: "center", gap: 18, marginTop: 20, opacity: out(f, a - 4, a + 4)}}>
                <span style={{width: 50, height: 50, borderRadius: 14, border: `3px solid ${on ? C.g : C.line}`, background: on ? C.g : "transparent", display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700, color: C.bg}}>{on ? "✓" : ""}</span>
                <span style={{fontFamily: SANS, fontSize: 38, fontWeight: 700}}>{t}</span>
              </div>
            );
          })}
        </div>
      </div>
      {f > L(46.2) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 900, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "22px 30px", opacity: out(f, L(46.2), L(46.7)), transform: `translateY(${(1 - out(f, L(46.2), L(46.7))) * 30}px)`}}>
          <div style={{...label, fontSize: 24}}>INDIAN TECH, EXPLAINED</div>
          <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 6}}>More <span style={{color: C.g}}>system design</span> like this</div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, L(46.8), 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1170, display: "flex", alignItems: "center", gap: 18, opacity: out(f, L(44.4), L(44.8))}}>
        <svg width={34} height={44}><path d="M3 3 H31 V41 L17 30 L3 41 Z" fill="none" stroke={C.g} strokeWidth={4} strokeLinejoin="round" /></svg>
        <div>
          <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.g}}>SAVE FOR NEXT TATKAL</div>
          <div style={{fontFamily: SANS, fontSize: 26, color: C.dim}}>send it to that one friend 🚆</div>
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 1320, fontFamily: MONO, fontSize: 21, color: C.dim, opacity: out(f, L(45), L(45.4))}}>facts: Ministry of Railways / IRCTC, 2025–26</div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC<{off: number}>][] = [
  [0, S2, () => <Hook />],
  [S2, S3, Herd],
  [S3, S4, Seat],
  [S4, S5, Bots],
  [S5, S6, Fix],
  [S6, E8_TOTAL, Tip],
];

export const DebugDiaries008: React.FC = () => (
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
    <Hud ep="008" total={E8_TOTAL} />
  </AbsoluteFill>
);
