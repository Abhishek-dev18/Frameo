// Weekend Origins · EP05 "Where did the @ in email come from?"
// Facts (Computing History UK, Lemelson-MIT, NPR obituary 2016, Multicians / Tom Van Vleck "History of Electronic Mail"):
// Mail between users of ONE time-sharing computer existed before: CTSS MAIL at MIT (1965, Tom Van Vleck & Noel Morris).
// 1971: Ray Tomlinson, engineer at BBN, sent the first networked email between two computers (PDP-10s) side by side in
// the same room, connected over ARPANET, by combining the SNDMSG mail program with the CPYNET file-transfer program.
// He picked @ to separate user from host: it doesn't appear in names, and "user at host" reads naturally.
// Myth-ish: the first message was not a famous phrase; Tomlinson said it was forgettable, probably something like
// "QWERTYUIOP". Visual: real-geometry 3D (@ keycap Slab, mainframe/PDP slabs), bottom history timeline.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/origins-05/voice.wav, calm defaults).
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {flip} from "@remotion/transitions/flip";
import {fade} from "@remotion/transitions/fade";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip, Push} from "./glass";
import {Slab, Shadow} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 7.59, 17.92, 28.5, 36.28, 49.12].map(T);
export const O5_TOTAL = T(59.13) + 15;
const TR = 15;
const AMBER = "#FFB020";

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1.05, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);

// a solid 3D keycap that presses at `at`
const Key: React.FC<{k: string; at: number; w?: number; h?: number; size?: number; glow?: string}> = ({k, at, w = 300, h = 260, size = 170, glow = AMBER}) => {
  const f = useCurrentFrame();
  const down = f < at ? 0 : interpolate(f, [at, at + 4, at + 14], [0, 1, 0.35], clamp);
  const lit = f >= at;
  return (
    <div style={{transform: `translateY(${down * 26}px)`}}>
      <Slab w={w} h={h} d={80 - down * 30} rx={-26} ry={Math.sin(f / 40) * 10} color="#2B2E35" radius={34} glow={lit ? glow : undefined}
        front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: size, color: lit ? glow : C.text}}>{k}</div>} />
      <Shadow w={w} style={{marginTop: 12 - down * 10}} op={0.55 - down * 0.2} />
    </div>
  );
};

// a computer as a solid slab with a little screen
const Machine: React.FC<{name: string; w?: number; lines: React.ReactNode; color?: string; ry?: number}> = ({name, w = 400, lines, color = "#C9C3B4", ry = 0}) => (
  <div>
    <Slab w={w} h={360} d={120} rx={-8} ry={ry} color={color} radius={16}
      front={<div style={{width: "100%", height: "100%", padding: 22, boxSizing: "border-box"}}>
        <div style={{fontFamily: MONO, fontSize: 20, color: "#4A4536", letterSpacing: "0.12em"}}>{name}</div>
        <div style={{marginTop: 10, height: 210, borderRadius: 12, background: "#0A120C", boxShadow: "inset 0 0 30px #000", padding: 16, boxSizing: "border-box", fontFamily: MONO, fontSize: 24, color: C.g, lineHeight: 1.5}}>{lines}</div>
        <div style={{display: "flex", gap: 10, marginTop: 16}}>{[0, 1, 2, 3].map((i) => <div key={i} style={{width: 46, height: 46, borderRadius: 23, background: "#8C8471", border: "3px solid #6E6756"}} />)}</div>
      </div>} />
    <Shadow w={w} style={{marginTop: 18}} />
  </div>
);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="WEEKEND ORIGINS · EP05" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 360, opacity: out(f, 0, 8)}}>
        <Glass style={{padding: "22px 30px"}}>
          <div style={label}>TO</div>
          <div style={{fontFamily: MONO, fontSize: 48, marginTop: 6}}>
            {typed("you", f, 2, 30)}<span style={{color: f >= T(2.4) ? AMBER : "transparent", textShadow: f >= T(2.4) ? `0 0 24px ${AMBER}` : "none"}}>@</span>{f >= T(2.4) ? typed("example.com", f, T(2.55), 40) : null}
          </div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 0, right: 40, top: 590, display: "grid", placeItems: "center"}}>
        <Key k="@" at={T(2.4)} w={340} h={300} size={210} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1060}}>
        <Reveal at={T(4.15)} size={92}>Where did</Reveal>
        <Reveal at={T(5.13)} size={92} color={AMBER} style={{marginTop: 4}}>@ come from?</Reveal>
      </div>
      {f > T(6.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1330, ...big(60, C.text), opacity: out(f, T(6.7), T(7.05))}}>
          And <Marker at={T(6.9)}>who picked it?</Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · 1965 MIT, one machine =================
const OneMachine: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const users = ["alice", "bob", "carol", "dave"];
  const blocked = f >= L(15.14);
  const fly = (i: number) => interpolate(f, [L(10.5) + i * 12, L(10.5) + i * 12 + 30], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <Section text="1965 / MIT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(7.63)} size={80}>Email already existed.</Reveal>
        <Reveal at={L(9.05)} size={110} color={AMBER} style={{marginTop: 6}}>1965.</Reveal>
      </div>
      {/* one shared mainframe with users around it */}
      <div style={{position: "absolute", left: 64, top: 640, width: 560, opacity: out(f, L(10.2), L(10.6))}}>
        <Slab w={480} h={560} d={160} rx={-6} ry={Math.sin(f / 50) * 8 + 10} color="#3A3F4A" radius={14}
          front={<div style={{width: "100%", height: "100%", padding: 26, boxSizing: "border-box"}}>
            <div style={{fontFamily: MONO, fontSize: 22, color: "#AEB6C4", letterSpacing: "0.12em"}}>SHARED COMPUTER</div>
            <div style={{display: "flex", gap: 30, marginTop: 30, justifyContent: "center"}}>
              {[0, 1].map((r) => <div key={r} style={{width: 150, height: 150, borderRadius: 75, border: "10px solid #23262D", background: "#2C3039", transform: `rotate(${f * (r ? -4 : 5)}deg)`, boxSizing: "border-box", position: "relative"}}><div style={{position: "absolute", left: 50, top: 50, width: 30, height: 30, borderRadius: 15, background: "#555B66"}} /></div>)}
            </div>
            {Array.from({length: 6}).map((_, i) => <div key={i} style={{height: 12, borderRadius: 6, marginTop: 18, background: i % 2 ? "#2B2F37" : "#4A505C"}} />)}
            <div style={{display: "flex", gap: 10, marginTop: 20}}>{[0, 1, 2, 3, 4].map((i) => <div key={i} style={{width: 18, height: 18, borderRadius: 9, background: Math.floor(f / 6 + i) % 3 === 0 ? C.g : "#2A5"}} />)}</div>
          </div>} />
        <Shadow w={480} style={{marginTop: 18}} />
      </div>
      <div style={{position: "absolute", left: 620, right: 110, top: 660, display: "flex", flexDirection: "column", gap: 18}}>
        {users.map((u, i) => (
          <div key={u} style={{opacity: out(f, L(10.3) + i * 4, L(10.3) + i * 4 + 10)}}>
            <Glass style={{padding: "14px 18px", display: "flex", alignItems: "center", gap: 14}}>
              <div style={{fontSize: 30, transform: `translateX(${(1 - fly(i)) * -40}px)`, opacity: fly(i)}}>✉</div>
              <div style={{fontFamily: MONO, fontSize: 28}}>{u}</div>
            </Glass>
          </div>
        ))}
      </div>
      {f > L(12.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(12.72), L(13.1))}}>
          <Glass style={{borderLeft: `8px solid ${C.g}`}}>
            <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>Only users of <Marker at={L(13.5)}>the same machine.</Marker></div>
          </Glass>
        </div>
      ) : null}
      {blocked ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1470, ...big(54, C.text), opacity: out(f, L(15.14), L(15.5))}}>
          Another computer? <span style={{color: C.bug}}>{f > L(16.8) ? "No road. ✕" : "…"}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · 1971 two machines =================
const TwoMachines: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const cable = out(f, L(22.03), L(23.2));
  const q = f >= L(24.2);
  const pulse = q ? (Math.sin((f - L(24.2)) / 4) + 1) / 2 : 0;
  return (
    <AbsoluteFill>
      <Section text="1971 / BBN" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(17.96)} size={110} color={AMBER}>1971.</Reveal>
      </div>
      {f > L(19.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 470, opacity: out(f, L(19.39), L(19.8))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 24, padding: "20px 28px"}}>
            <div style={{width: 76, height: 76, borderRadius: 38, background: "#2E323A", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: AMBER}}>RT</div>
            <div>
              <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>Ray Tomlinson</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 4}}>engineer · BBN</div>
            </div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 40, right: 80, top: 720, display: "flex", justifyContent: "space-between", opacity: out(f, L(20.8), L(21.3))}}>
        <Machine name="MACHINE A" lines={<div>@ ready_</div>} ry={14} />
        <Machine name="MACHINE B" lines={<div>{q ? <span style={{color: C.bug}}>inbox: ?</span> : "idle_"}</div>} ry={-14} />
      </div>
      <svg width={1080} height={120} style={{position: "absolute", left: 0, top: 1150}}>
        <path d={`M 250 20 Q 540 ${100} ${250 + 580 * cable} 20`} stroke={C.g} strokeWidth={6} fill="none" strokeDasharray="16 10" opacity={cable} />
        <text x={540} y={110} textAnchor="middle" fill={C.g} opacity={cable} style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.12em"}}>ARPANET · SAME ROOM</text>
      </svg>
      {q ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1320, opacity: out(f, L(24.22), L(24.6))}}>
          <Glass glow={AMBER} style={{boxShadow: `0 0 ${30 * pulse}px ${AMBER}66`}}>
            <div style={{...label, color: AMBER}}>THE PROBLEM</div>
            <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 8}}>{f > L(25.4) ? <>How does mail reach <span style={{color: AMBER}}>machine B?</span></> : "…"}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · mail + file transfer =================
const Combine: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const join = interpolate(f, [L(30.1), L(31.2)], [0, 1], {...clamp, easing: ease3});
  const slot = (at: number) => out(f, at, at + 8);
  return (
    <AbsoluteFill>
      <Section text="THE HACK" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, display: "flex", alignItems: "center", justifyContent: "center", gap: 20 - 0 * join}}>
        <div style={{transform: `translateX(${join * 30}px) rotateY(${(1 - join) * 18}deg)`, opacity: out(f, L(28.54), L(28.9))}}>
          <Slab w={380} h={220} d={50} rx={-12} ry={12} color="#24262C" radius={20}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}><div><div style={{fontSize: 60}}>✉</div><div style={{fontFamily: MONO, fontSize: 26, color: C.text}}>MAIL PROGRAM</div></div></div>} />
        </div>
        <div style={{...big(80, AMBER), opacity: out(f, L(30.08), L(30.4))}}>+</div>
        <div style={{transform: `translateX(${-join * 30}px)`, opacity: out(f, L(30.08), L(30.5))}}>
          <Slab w={380} h={220} d={50} rx={-12} ry={-12} color="#24262C" radius={20}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}><div><div style={{fontSize: 60}}>⇄</div><div style={{fontFamily: MONO, fontSize: 26, color: C.text}}>FILE TRANSFER</div></div></div>} />
        </div>
      </div>
      {f > L(31.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 640, ...big(56, C.g), opacity: out(f, L(31.2), L(31.6))}}>= mail that travels. ✓</div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 800}}>
        <Reveal at={L(31.96)} size={64}>An address now needs two parts:</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1000, display: "flex", gap: 24, alignItems: "stretch"}}>
        <div style={{flex: 1, opacity: slot(L(33.95)), transform: `translateY(${(1 - slot(L(33.95))) * 40}px)`}}>
          <Glass glow={C.g} style={{textAlign: "center"}}>
            <div style={{...label, color: C.g}}>WHO</div>
            <div style={{fontFamily: MONO, fontSize: 52, marginTop: 10}}>user</div>
          </Glass>
        </div>
        <div style={{width: 120, display: "grid", placeItems: "center", ...big(110, f > L(35.4) ? AMBER : "#555"), fontFamily: MONO}}>?</div>
        <div style={{flex: 1, opacity: slot(L(34.95)), transform: `translateY(${(1 - slot(L(34.95))) * 40}px)`}}>
          <Glass glow={C.g} style={{textAlign: "center"}}>
            <div style={{...label, color: C.g}}>WHERE</div>
            <div style={{fontFamily: MONO, fontSize: 52, marginTop: 10}}>host</div>
          </Glass>
        </div>
      </div>
      {f > L(35.3) ? <div style={{position: "absolute", left: 64, right: 110, top: 1300, ...big(50, C.text), opacity: out(f, L(35.4), L(35.8))}}>But what goes <span style={{color: AMBER}}>in between?</span></div> : null}
    </AbsoluteFill>
  );
};

// ================= 5 · picking @ =================
const ROW = ["!", "\"", "#", "$", "%", "&", "*", "+", "=", "@", ":", "?"];
const Pick: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const scan = interpolate(f, [L(38.3), L(39.5)], [0, 9], {...clamp, easing: ease3});
  const chosen = f >= L(39.5);
  return (
    <AbsoluteFill>
      <Section text="1971 / THE CHOICE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(36.32)} size={74}>Needed: a separator.</Reveal>
      </div>
      {/* teletype-style symbol row */}
      <div style={{position: "absolute", left: 0, right: 40, top: 470, display: "grid", placeItems: "center", opacity: out(f, L(38.2), L(38.6))}}>
        <Slab w={900} h={200} d={60} rx={-16} ry={Math.sin(f / 40) * 5} color="#24262C" radius={18}
          front={<div style={{width: "100%", height: "100%", padding: 24, boxSizing: "border-box", display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10}}>
            {ROW.map((k, i) => {
              const at = Math.round(scan) === i && !chosen;
              const hot = chosen && k === "@";
              return <div key={i} style={{borderRadius: 10, background: hot ? `${AMBER}44` : at ? "#4A4E58" : "#33363E", border: `2px solid ${hot ? AMBER : "#3D4048"}`, fontFamily: MONO, fontSize: 36, color: hot ? AMBER : C.text, display: "grid", placeItems: "center", transform: `translateY(${hot ? 6 : 0}px)`, boxShadow: hot ? `0 0 24px ${AMBER}` : "none", opacity: chosen && !hot ? 0.35 : 1}}>{k}</div>;
            })}
          </div>} />
        <Shadow w={900} style={{marginTop: 16}} />
      </div>
      {f > L(40.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 800, opacity: out(f, L(40.62), L(41))}}>
          <Glass style={{borderLeft: `8px solid ${C.g}`}}>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800}}>✓ Never appears <Marker at={L(41.3)}>in a name</Marker></div>
            {f > L(42.2) ? <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 12, opacity: out(f, L(42.31), L(42.7))}}>✓ Reads like <Marker at={L(43.3)}>English</Marker></div> : null}
          </Glass>
        </div>
      ) : null}
      {f > L(43.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1080, textAlign: "center", opacity: out(f, L(43.7), L(44.1))}}>
          <div style={{fontFamily: MONO, fontSize: 84, fontWeight: 700}}>user<span style={{color: AMBER}}>@</span>host</div>
          <div style={{fontFamily: MONO, fontSize: 40, color: C.dim, marginTop: 14}}>{f > L(45.8) ? <>this user <span style={{color: AMBER}}>at</span> that machine</> : <>user <span style={{color: AMBER}}>at</span> host</>}</div>
        </div>
      ) : null}
      {f > L(47.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1380, textAlign: "center", ...big(96, C.g), transform: `scale(${interpolate(f, [L(47.97), L(47.97) + 7], [1.8, 1], {...clamp, easing: Easing.out(Easing.back(2))})})`}}>Perfect choice.</div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · first message + today =================
const Today: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const n = interpolate(f, [L(54.9), L(57.2)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="THE FIRST MESSAGE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(49.16)} size={80}>The first message?</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470, opacity: out(f, L(50.3), L(50.7))}}>
        <Glass>
          <div style={label}>RAY TOMLINSON · “FORGETTABLE”</div>
          <div style={{fontFamily: MONO, fontSize: 56, marginTop: 14, color: AMBER, letterSpacing: "0.06em"}}>{typed("QWERTYUIOP", f, L(51.8), 30)}<span style={{opacity: Math.floor(f / 8) % 2}}>▌</span></div>
          <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 10}}>probably something like this · he didn't record it</div>
        </Glass>
      </div>
      {f > L(54.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 840, opacity: out(f, L(54.9), L(55.3))}}>
          <div style={{...big(60, C.text)}}>One tiny choice →</div>
          <div style={{display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: 10, marginTop: 24}}>
            {Array.from({length: 40}).map((_, i) => {
              const r = Math.sin(i * 51.7) * 1e4; const d = (r - Math.floor(r)) * 0.9;
              const on = n > d;
              return <div key={i} style={{height: 56, borderRadius: 10, background: on ? "rgba(255,176,32,.16)" : "rgba(255,255,255,.04)", border: `1.5px solid ${on ? AMBER : "rgba(255,255,255,.08)"}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 26, color: AMBER, transform: `scale(${on ? 1 : 0.8})`}}>{on ? "@" : ""}</div>;
            })}
          </div>
          <div style={{...big(56, AMBER), marginTop: 24, opacity: out(f, L(56.3), L(56.7))}}>every inbox, today.</div>
        </div>
      ) : null}
      {f > L(57.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1390, opacity: out(f, L(57.8), L(58.1))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>WEEKEND ORIGINS</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(57.9), 50)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1600, fontFamily: MONO, fontSize: 19, color: C.dim, opacity: out(f, L(50), L(50.4))}}>sources: Computing History UK · Lemelson-MIT · NPR · multicians.org</div>
    </AbsoluteFill>
  );
};

// bottom history timeline
const YEARS: [string, number][] = [["1965", 0.04], ["1971", 0.42], ["TODAY", 0.96]];
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < CUTS[2] ? 0 : f < T(54.9) ? 1 : 2;
  const x = interpolate(f, [CUTS[2] - 10, CUTS[2] + 10, T(54.8), T(55.6)], [0.04, 0.42, 0.42, 0.96], {...clamp, easing: ease3});
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 90, borderRadius: 20, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <div style={{position: "absolute", left: 30, right: 30, top: 30, height: 4, borderRadius: 2, background: "rgba(255,255,255,.12)"}}>
        <div style={{position: "absolute", left: 0, width: `${x * 100}%`, height: 4, borderRadius: 2, background: AMBER}} />
      </div>
      {YEARS.map(([y, p], i) => (
        <div key={y} style={{position: "absolute", left: `calc(30px + ${p} * (100% - 60px))`, top: 20, transform: "translateX(-50%)", textAlign: "center"}}>
          <div style={{width: 24, height: 24, borderRadius: 12, margin: "0 auto", background: i === cur ? AMBER : "#2A2D33", boxShadow: i === cur ? `0 0 16px ${AMBER}` : "none"}} />
          <div style={{fontFamily: MONO, fontSize: 20, color: i === cur ? C.text : C.dim, marginTop: 6}}>{y}</div>
        </div>
      ))}
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, OneMachine, TwoMachines, Combine, Pick, Today];

export const Origins05: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : O5_TOTAL - CUTS[i]));
  const pres = [
    wipe({direction: "from-left"}),
    slide({direction: "from-right"}),
    flip({direction: "from-bottom"}),
    clockWipe({width: 1080, height: 1920}),
    fade(),
  ];
  return (
    <AbsoluteFill style={{background: "#121316", color: C.text}}>
      <GlassBg />
      <TransitionSeries>
        {COMPS.map((Comp, i) => (
          <React.Fragment key={i}>
            <TransitionSeries.Sequence durationInFrames={durs[i]}>
              <AbsoluteFill style={{background: "#121316"}}>
                <GlassBg />
                <Push len={durs[i]}><Comp off={CUTS[i]} /></Push>
              </AbsoluteFill>
            </TransitionSeries.Sequence>
            {i + 1 < COMPS.length ? (
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 2 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Timeline />
      <AbsoluteFill style={{zIndex: 20}}><Hud series="ORIGINS" ep="05" total={O5_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
