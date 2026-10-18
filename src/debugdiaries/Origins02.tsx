// Weekend Origins · EP 02 "Why 404 means Not Found" — 6 scenes, each a 3D card (Card3D) with the coral wipe.
// Facts: the CERN "room 404" story is a myth (Robert Cailliau: "hogwash", 404 never tied to a room); 3-digit reply
// codes date to early-1970s protocol drafts (FTP, 1972); HTTP formalised in RFC 1945 (1996); 4xx = client error,
// 5xx = server error; 418 "I'm a teapot" = RFC 2324, April Fools' 1998; #save418 (2017).
// Timed to the Hinglish Sarvam voice (content/debug-diaries/origins-02/voice.wav, pauses ≤0.18s).
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Backdrop, Hud, Section, Slam, Cut, Card3D} from "./cine";

const T = (s: number) => Math.round(s * 30);
export const O2_S2 = T(6.08);
export const O2_S3 = T(17.88);
export const O2_S4 = T(29.33);
export const O2_S5 = T(40.79);
export const O2_S6 = T(52.45);
export const O2_TOTAL = T(58.69) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
// extruded 3D text: stacked shadows toward the bottom-right
const extrude = (col: string, depth = 14) => Array.from({length: depth}, (_, i) => `${i + 1}px ${i + 1}px 0 ${col}`).join(", ");

// ===================== 1 · hook: slot-machine 404 =====================
const Reel: React.FC<{stopAt: number; digit: number}> = ({stopAt, digit}) => {
  const f = useCurrentFrame();
  const H = 300;
  const spinning = f < stopAt;
  const pos = spinning ? (f * 0.9) % 10 : digit;
  const settle = spinning ? 0 : interpolate(f, [stopAt, stopAt + 8], [0.35, 0], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <div style={{width: 230, height: H, overflow: "hidden", borderRadius: 28, background: C.card, border: `4px solid ${spinning ? C.line : C.bug}`, position: "relative", boxShadow: spinning ? "none" : `0 0 50px ${C.bug}44`}}>
      <div style={{position: "absolute", left: 0, right: 0, top: -(pos + settle) * H, filter: spinning ? "blur(3px)" : "none"}}>
        {Array.from({length: 11}).map((_, i) => (
          <div key={i} style={{height: H, display: "grid", placeItems: "center", ...big(250, spinning ? C.text : C.bug), textShadow: spinning ? "none" : extrude("#7A3A33", 12)}}>{i % 10}</div>
        ))}
      </div>
    </div>
  );
};
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const tilt = Math.sin(f / 30) * 4;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 258, padding: "6px 14px", border: `2px solid ${C.g}`, borderRadius: 8, fontFamily: MONO, fontSize: 24, letterSpacing: "0.18em", color: C.g}}>ORIGINS · EP 02</div>
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={-30} size={86}>Every developer</Slam>
        <Slam at={-30} size={86} style={{marginTop: 6}}>has seen this.</Slam>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 560, display: "flex", justifyContent: "center", perspective: 1200}}>
        <div style={{display: "flex", gap: 22, transform: `rotateX(14deg) rotateY(${-10 + tilt}deg)`}}>
          <Reel stopAt={14} digit={4} />
          <Reel stopAt={26} digit={0} />
          <Reel stopAt={38} digit={4} />
        </div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 900, textAlign: "center", opacity: out(f, T(2.67), T(3.0))}}>
        <span style={{fontFamily: MONO, fontSize: 52, color: C.text, letterSpacing: "0.1em"}}>NOT FOUND</span>
      </div>
      {/* bottom: the browser + "why not 401?" */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1030, padding: "16px 22px", borderRadius: 18, background: C.card, border: `2.5px solid ${C.line}`, fontFamily: MONO, fontSize: 26, opacity: out(f, 30, 40)}}>
        <span style={{color: C.dim}}>GET</span> /old-page <span style={{color: C.dim}}>→</span> <span style={{color: C.bug}}>404</span>
      </div>
      {f > T(5.0) ? (
        <div style={{position: "absolute", left: 64, top: 1170, display: "flex", gap: 18}}>
          {["401?", "100?", "999?"].map((t, i) => (
            <span key={t} style={{padding: "10px 18px", borderRadius: 14, border: `2.5px solid ${C.line}`, fontFamily: MONO, fontSize: 34, color: C.dim, textDecoration: "line-through", opacity: out(f, T(5.06) + i * 3, T(5.06) + i * 3 + 5)}}>{t}</span>
          ))}
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, top: 1300}}>
        {f > T(5.2) ? <Slam at={T(5.3)} size={110} color={C.bug}>Why 4-0-4?</Slam> : null}
      </div>
    </AbsoluteFill>
  );
};

// ===================== 2 · the myth: CERN corridor =====================
const Myth: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const travel = interpolate(f, [L(7.4), L(11.0)], [0, 1], {...clamp, easing: ease3});
  const stamp = out(f, L(12.5), L(12.9));
  const doors = [400, 401, 402, 403];
  return (
    <AbsoluteFill>
      <Section text="02 / THE MYTH" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(6.15)} size={80}>The famous story…</Slam>
      </div>
      {/* 3D corridor: doors fly past, ROOM 404 waits at the end */}
      <div style={{position: "absolute", left: 64, right: 64, top: 450, height: 640, perspective: 700, overflow: "hidden", borderRadius: 26, background: "#121315", border: `2.5px solid ${C.line}`}}>
        <svg width={952} height={640} style={{position: "absolute", inset: 0}}>
          {[0.0, 0.25, 0.5, 0.75].map((k, i) => {
            const z = ((k + travel * 1.2) % 1);
            const s = 0.15 + z * 0.85;
            return <rect key={i} x={476 - 460 * s} y={320 - 300 * s} width={920 * s} height={600 * s} fill="none" stroke={C.line} strokeWidth={2} opacity={0.5 + z * 0.5} />;
          })}
          <line x1={0} y1={0} x2={476} y2={320} stroke={C.line} strokeWidth={2} />
          <line x1={952} y1={0} x2={476} y2={320} stroke={C.line} strokeWidth={2} />
          <line x1={0} y1={640} x2={476} y2={320} stroke={C.line} strokeWidth={2} />
          <line x1={952} y1={640} x2={476} y2={320} stroke={C.line} strokeWidth={2} />
        </svg>
        {doors.map((n, i) => {
          const z = i * 0.22 - travel * 1.1 + 0.3; // 0 = at camera, 1 = far
          if (z < -0.05 || z > 1) return null;
          const s = 1.15 - z;
          const left = i % 2 === 0;
          return (
            <div key={n} style={{position: "absolute", left: left ? 476 - 430 * s : 476 + 270 * s, top: 320 - 200 * s, width: 160 * s, height: 340 * s, borderRadius: 10 * s, background: C.card2, border: `${3 * s}px solid ${C.dim}`, display: "grid", placeItems: "center", opacity: Math.min(1, (1 - z) * 1.5)}}>
              <span style={{fontFamily: MONO, fontSize: 34 * s, color: C.text}}>{n}</span>
            </div>
          );
        })}
        {/* the end door */}
        {(() => {
          const s = 0.35 + travel * 0.55;
          return (
            <div style={{position: "absolute", left: 476 - 140 * s, top: 320 - 230 * s, width: 280 * s, height: 460 * s, borderRadius: 14, background: "#2A2A20", border: `${5 * s}px solid ${C.g}`, boxShadow: `0 0 ${60 * s}px ${C.g}55`, display: "grid", placeItems: "center"}}>
              <div style={{textAlign: "center"}}>
                <div style={{fontFamily: MONO, fontSize: 28 * s, color: C.dim}}>ROOM</div>
                <div style={big(110 * s, C.g)}>404</div>
                <div style={{fontFamily: MONO, fontSize: 22 * s, color: C.dim, marginTop: 8 * s, opacity: out(f, L(10.0), L(10.4))}}>first web server?</div>
              </div>
            </div>
          );
        })()}
        {stamp > 0 ? (
          <div style={{position: "absolute", left: 250, top: 230, padding: "10px 34px", border: `10px solid ${C.bug}`, borderRadius: 18, ...big(140, C.bug), transform: `rotate(-12deg) scale(${1 + (1 - stamp) * 1.4})`, opacity: stamp, background: "#16171ACC"}}>MYTH</div>
        ) : null}
      </div>
      {/* quote card */}
      {f > L(13.0) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1140, perspective: 900}}>
          <div style={{transform: `rotateX(${interpolate(f, [L(13.04), L(13.5)], [90, 0], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%", borderRadius: 24, background: C.card, borderLeft: `8px solid ${C.g}`, padding: "22px 28px"}}>
            <div style={big(80, C.text)}>“Hogwash.”</div>
            <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 700, marginTop: 10}}>Robert Cailliau</div>
            <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 4}}>co-creator of the web, CERN</div>
            <div style={{fontFamily: MONO, fontSize: 26, color: C.g, marginTop: 16}}>{typed("404 was never linked to a room.", f, L(15.73), 45)}</div>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 3 · the real origin: 3D timeline =====================
const MILES: [string, string, string, number][] = [
  ["1972", "FTP drafts", "3-digit reply codes", 17.92],
  ["1991", "Tim Berners-Lee", "the Web at CERN", 25.82],
  ["1996", "RFC 1945", "HTTP/1.0 — 404 Not Found", 28.41],
];
const Origin: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="03 / THE REAL ORIGIN" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(17.95)} size={80}>It starts in <span style={{color: C.g}}>1972.</span></Slam>
      </div>
      {/* timeline ribbon tilted into the screen */}
      <div style={{position: "absolute", left: 0, right: 0, top: 440, height: 620, perspective: 1000}}>
        <div style={{position: "absolute", left: 120, right: 120, top: 0, height: 620, transform: "rotateX(18deg)", transformOrigin: "50% 100%"}}>
          <div style={{position: "absolute", left: "50%", top: 0, bottom: 0, width: 6, marginLeft: -3, background: `linear-gradient(${C.line}, ${C.g})`}} />
          {MILES.map(([y, t, s, at], i) => {
            const a = L(at);
            const o = out(f, a, a + 10);
            const left = i % 2 === 0;
            return (
              <div key={y} style={{position: "absolute", top: 440 - i * 210, left: left ? 0 : "52%", width: "48%", opacity: o, transform: `translateX(${(1 - o) * (left ? -80 : 80)}px)`}}>
                <div style={{borderRadius: 20, background: i === 2 ? "#1C2A21" : C.card, border: `3px solid ${i === 2 ? C.g : C.line}`, padding: "16px 20px"}}>
                  <div style={big(64, i === 2 ? C.g : C.text)}>{y}</div>
                  <div style={{fontFamily: SANS, fontSize: 28, fontWeight: 700, marginTop: 6}}>{t}</div>
                  <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>{s}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* terminal: FTP reply → HTTP status */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1110, borderRadius: 22, background: C.card, border: `2.5px solid ${C.line}`, overflow: "hidden", opacity: out(f, L(22.3), L(22.7))}}>
        <div style={{padding: "12px 20px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 21, color: C.dim}}>terminal</div>
        <div style={{padding: "16px 22px", fontFamily: MONO, fontSize: 28, lineHeight: 1.7, whiteSpace: "pre"}}>
          <div><span style={{color: C.dim}}>ftp&gt; </span>{typed("get report.txt", f, L(22.41), 40)}</div>
          <div style={{color: C.bug}}>{typed("550 File unavailable", f, L(23.6), 40)}</div>
          <div style={{color: C.dim}}>{typed("─ ─ ─ 20 years later ─ ─ ─", f, L(26.0), 60)}</div>
          <div><span style={{color: C.dim}}>GET </span>{typed("/report.txt", f, L(27.0), 40)}</div>
          <div style={{color: C.g}}>{typed("HTTP/1.0 404 Not Found", f, L(28.4), 50)}</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 4 · what the digits mean: a 3D building =====================
const FLOORS: [string, string, string, string, number][] = [
  ["2xx", "SUCCESS", "all good", C.g, 31.23],
  ["3xx", "REDIRECT", "go somewhere else", C.text, 32.83],
  ["4xx", "CLIENT ERROR", "your mistake", C.bug, 34.15],
  ["5xx", "SERVER ERROR", "their mistake", C.bug, 36.45],
];
const Digits: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const split = interpolate(f, [L(39.14), L(39.7)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="04 / WHAT THE DIGITS MEAN" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(29.4)} size={70}>1st digit = whose fault.</Slam>
      </div>
      {/* stacked 3D floors, built bottom-up */}
      <div style={{position: "absolute", left: 90, right: 190, top: 440, height: 680, perspective: 1100}}>
        <div style={{position: "absolute", inset: 0, transform: "rotateX(24deg) rotateY(-18deg)", transformStyle: "preserve-3d"}}>
          {FLOORS.map(([code, name, note, col, at], i) => {
            const a = L(at);
            const drop = interpolate(f, [a, a + 10], [-160, 0], {...clamp, easing: Easing.out(Easing.bounce)});
            const o = out(f, a, a + 4);
            return (
              <div key={code} style={{position: "absolute", left: 0, right: 0, top: 520 - i * 160 + drop, height: 140, borderRadius: 16, background: `${col}1A`, border: `3px solid ${col}`, opacity: o, boxShadow: `14px 14px 0 ${col}33`, display: "flex", alignItems: "center", gap: 26, padding: "0 26px"}}>
                <span style={big(76, col)}>{code}</span>
                <div>
                  <div style={{fontFamily: MONO, fontSize: 26, color: col, letterSpacing: "0.1em"}}>{name}</div>
                  <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 600, color: C.text}}>{note}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* 404 = 4 + 04 */}
      {f > L(39.0) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1180, opacity: out(f, L(39.0), L(39.3))}}>
          <div style={{display: "flex", alignItems: "baseline", gap: 10 + split * 40}}>
            <span style={big(150, C.bug)}>4</span>
            <span style={big(150, C.text)}>04</span>
          </div>
          <div style={{display: "flex", gap: 30, marginTop: 10, opacity: split}}>
            <span style={{fontFamily: MONO, fontSize: 26, color: C.bug}}>↑ client error</span>
            <span style={{fontFamily: MONO, fontSize: 26, color: C.text}}>↑ "not found" slot</span>
          </div>
          <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 700, marginTop: 18, color: C.text, opacity: out(f, L(39.6), L(40.0))}}>You asked for something <span style={{color: C.bug}}>that isn't here.</span></div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 5 · the twist: 418 I'm a teapot =====================
const Teapot: React.FC<{spin: number}> = ({spin}) => (
  <div style={{width: 360, height: 300, perspective: 900, transform: "scale(1.45)", transformOrigin: "50% 30%"}}>
    <svg width={360} height={300} viewBox="0 0 360 300" style={{transform: `rotateY(${spin}deg)`}}>
      <ellipse cx={180} cy={180} rx={110} ry={90} fill="#1C2A21" stroke={C.g} strokeWidth={8} />
      <ellipse cx={180} cy={98} rx={60} ry={16} fill="#1C2A21" stroke={C.g} strokeWidth={8} />
      <circle cx={180} cy={74} r={14} fill={C.g} />
      <path d="M72 160 C 20 150, 18 90, 40 70" fill="none" stroke={C.g} strokeWidth={10} strokeLinecap="round" />
      <path d="M288 140 C 340 140, 345 210, 290 228" fill="none" stroke={C.g} strokeWidth={10} strokeLinecap="round" />
      <text x={180} y={196} textAnchor="middle" fill={C.g} fontFamily="'JetBrains Mono', monospace" fontWeight={700} fontSize={56}>418</text>
    </svg>
  </div>
);
const Twist: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const hearts = Math.floor(interpolate(f, [L(48.4), L(50.5)], [0, 9], clamp));
  const del = f > L(46.6);
  const saved = f > L(50.72);
  return (
    <AbsoluteFill>
      <Section text="05 / THE TWIST" />
      <div style={{position: "absolute", left: 64, top: 330, display: "flex", alignItems: "baseline", gap: 26}}>
        {f > L(41.7) ? <Slam at={L(41.84)} size={130} color={C.g}>418</Slam> : null}
        {f > L(42.7) ? <Slam at={L(42.79)} size={64}>I'm a teapot.</Slam> : null}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 500, display: "flex", justifyContent: "center", opacity: out(f, L(40.9), L(41.3))}}>
        <Teapot spin={Math.sin(f / 18) * 40} />
      </div>
      {f > L(43.6) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 900, perspective: 900}}>
          <div style={{transform: `rotateY(${interpolate(f, [L(43.68), L(44.2)], [80, 0], {...clamp, easing: ease3})}deg)`, borderRadius: 22, background: C.card, border: `2.5px solid ${C.line}`, padding: "18px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.g}}>RFC 2324</div>
              <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 800, marginTop: 4}}>1 April 1998</div>
            </div>
            <div style={{padding: "8px 14px", borderRadius: 12, border: `2px solid ${C.bug}`, fontFamily: MONO, fontSize: 22, color: C.bug}}>APRIL FOOLS 🃏</div>
          </div>
        </div>
      ) : null}
      {/* bottom: delete it? → #save418 */}
      {del ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1060, padding: "16px 22px", borderRadius: 18, border: `2.5px dashed ${C.bug}`, fontFamily: MONO, fontSize: 26, color: C.bug, opacity: out(f, L(46.6), L(47)), textDecoration: saved ? "line-through" : "none"}}>
          proposal: remove 418 from the web
        </div>
      ) : null}
      {f > L(48.1) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1160, perspective: 900}}>
          <div style={{transform: `rotateX(${interpolate(f, [L(48.25), L(48.8)], [90, 0], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%", borderRadius: 24, background: "#1C2A21", border: `3px solid ${C.g}`, padding: "22px 26px"}}>
            <div style={big(76, C.g)}>#save418</div>
            <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 26, marginTop: 10}}>
              <span style={{color: C.text}}>developers, 2017</span>
              <span style={{color: C.bug, letterSpacing: "0.1em"}}>{"♥".repeat(hearts)}</span>
            </div>
          </div>
        </div>
      ) : null}
      {saved ? (
        <div style={{position: "absolute", left: 64, top: 1400}}>
          <Slam at={L(50.8)} size={70} color={C.g}>Still alive. ☕</Slam>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 6 · lesson + follow =====================
const CODES: [string, string, string][] = [["200", "OK", C.g], ["301", "Moved", C.text], ["404", "Not Found", C.bug], ["418", "Teapot", C.g], ["500", "Error", C.bug]];
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={L(53.21)} size={84}>Good design is boring.</Slam>
        <Slam at={L(54.74)} size={84} color={C.g} style={{marginTop: 10}}>It lasts 50 years.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 600, display: "grid", gap: 14, perspective: 1000}}>
        {CODES.map(([c, t, col], i) => {
          const at = L(53.3) + i * 5;
          return (
            <div key={c} style={{display: "flex", alignItems: "center", gap: 24, padding: "14px 22px", borderRadius: 18, background: C.card, border: `2.5px solid ${col}`, transform: `rotateX(${(1 - out(f, at, at + 8)) * 90}deg)`, transformOrigin: "50% 0%", opacity: out(f, at, at + 4)}}>
              <span style={big(64, col)}>{c}</span>
              <span style={{fontFamily: MONO, fontSize: 30, color: C.text}}>{t}</span>
            </div>
          );
        })}
      </div>
      {f > L(55.9) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1180, borderRadius: 24, background: C.card2, borderLeft: `8px solid ${C.g}`, padding: "22px 30px", opacity: out(f, L(55.9), L(56.4)), transform: `translateY(${(1 - out(f, L(55.9), L(56.4))) * 30}px)`}}>
          <div style={{...label, fontSize: 24}}>WEEKEND ORIGINS</div>
          <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 6}}>A new origin story <span style={{color: C.g}}>every weekend</span></div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, L(57.2), 40)}</div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1440, fontFamily: MONO, fontSize: 21, color: C.dim, opacity: out(f, L(56.4), L(56.8))}}>facts: RFC 1945 · RFC 2324 · R. Cailliau (Wired)</div>
    </AbsoluteFill>
  );
};

const SCENES: [number, number, React.FC<{off: number}>][] = [
  [0, O2_S2, () => <Hook />],
  [O2_S2, O2_S3, Myth],
  [O2_S3, O2_S4, Origin],
  [O2_S4, O2_S5, Digits],
  [O2_S5, O2_S6, Twist],
  [O2_S6, O2_TOTAL, Lesson],
];

export const Origins02: React.FC = () => (
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
    <Hud series="ORIGINS" ep="02" total={O2_TOTAL} />
  </AbsoluteFill>
);
