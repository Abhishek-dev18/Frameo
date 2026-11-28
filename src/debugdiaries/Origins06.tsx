// Weekend Origins · EP06 "Why is JavaScript called JavaScript?"
// Facts (Axel Rauschmayer "Speaking JavaScript" ch.4 / O'Reilly, Red Hat Developer "The browser wars and the birth of
// JavaScript", Okta "25 years of JavaScript and Java", Deno v. Oracle petition coverage 2024):
// May 1995: Brendan Eich, at Netscape, wrote the first prototype in about 10 days. Codename Mocha; shipped as LiveScript
// in the Navigator 2.0 beta (Sept 1995); renamed JavaScript in Dec 1995 (Netscape + Sun announcement, 4 Dec 1995),
// riding the Java hype after Netscape's deal with Sun to support Java in the browser; management wanted syntax that
// looked like Java. The languages are unrelated in design. "JavaScript" is a trademark of Sun, now Oracle (Sun was
// acquired in 2010), so the standard is called ECMAScript (Ecma-262, first edition June 1997).
// Myth busted: JavaScript is not "Java's little brother"; the name was marketing.
// Visual: real-geometry 3D name plates (Slab), generic browser slab, 10-day calendar, rename stamp, bottom timeline.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/origins-06/voice.wav, calm defaults).
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from "remotion";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {slide} from "@remotion/transitions/slide";
import {wipe} from "@remotion/transitions/wipe";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {flip} from "@remotion/transitions/flip";
import {iris} from "@remotion/transitions/iris";
import {C, MONO, SANS, clamp, out, typed, Hud, Section} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, LiveChip, Push} from "./glass";
import {Slab, Shadow} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 9.51, 20.55, 30.07, 41.22, 53.41].map(T);
export const O6_TOTAL = T(61.27) + 20;
const TR = 15;
const AMBER = "#FFB020";

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1.05, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const pop = (f: number, at: number) => interpolate(f, [at, at + 7], [1.8, 1], {...clamp, easing: Easing.out(Easing.back(2))});

// a solid 3D name plate
const Plate: React.FC<{text: string; at: number; color?: string; ry?: number; w?: number; size?: number; sub?: string}> = ({text, at, color = C.text, ry = 0, w = 440, size = 76, sub}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [at, at + 14], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.6))});
  return (
    <div style={{opacity: k, transform: `translateY(${(1 - k) * 120}px)`}}>
      <Slab w={w} h={230} d={70} rx={-18} ry={ry + Math.sin(f / 45) * 8} color="#262931" radius={28}
        front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
          <div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: size, color}}>{text}</div>
            {sub ? <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 6, letterSpacing: "0.1em"}}>{sub}</div> : null}
          </div>
        </div>} />
      <Shadow w={w} style={{marginTop: 14}} />
    </div>
  );
};

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const diff = f >= T(3.19);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="WEEKEND ORIGINS · EP06" /></div>
      <div style={{position: "absolute", left: 30, right: 70, top: 400, display: "flex", justifyContent: "space-between"}}>
        <Plate text="Java" at={2} ry={16} w={420} />
        <Plate text="JavaScript" at={12} ry={-16} w={500} size={70} color={AMBER} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 760, textAlign: "center", ...big(64, C.text), opacity: out(f, T(1.75), T(2.1))}}>
        name: <span style={{color: C.g}}>almost same</span> ≈
      </div>
      {diff ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 860, textAlign: "center", ...big(64, C.bug), transform: `scale(${pop(f, T(3.19))})`}}>
          language: totally different ≠
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1060}}>
        <Reveal at={T(6.1)} size={96}>So why the name</Reveal>
        <Reveal at={T(6.6)} size={96} color={AMBER} style={{marginTop: 4}}>JavaScript?</Reveal>
      </div>
      {f > T(8.6) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1370, ...big(54, C.text), opacity: out(f, T(8.71), T(9))}}>
          <Marker at={T(8.8)}>Story time.</Marker>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · 1995 static web =================
const StaticWeb: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const need = f >= L(16.1);
  return (
    <AbsoluteFill>
      <Section text="1995 / NETSCAPE" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(9.6)} size={120} color={AMBER}>1995.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 40, top: 500, display: "grid", placeItems: "center", opacity: out(f, L(11.0), L(11.5))}}>
        <Slab w={860} h={520} d={70} rx={-10} ry={Math.sin(f / 50) * 8} color="#C9C3B4" radius={18}
          front={<div style={{width: "100%", height: "100%", padding: 20, boxSizing: "border-box"}}>
            <div style={{display: "flex", gap: 10, alignItems: "center"}}>
              {[C.bug, AMBER, C.g].map((c) => <div key={c} style={{width: 22, height: 22, borderRadius: 11, background: c}} />)}
              <div style={{flex: 1, marginLeft: 12, height: 40, borderRadius: 10, background: "#EDE8DC", fontFamily: MONO, fontSize: 22, color: "#4A4536", display: "flex", alignItems: "center", paddingLeft: 14}}>http://home-page.html</div>
            </div>
            <div style={{marginTop: 16, height: 390, borderRadius: 10, background: "#F7F4EC", padding: 24, boxSizing: "border-box", fontFamily: "Times New Roman, serif", color: "#222"}}>
              <div style={{fontSize: 44, fontWeight: 700}}>Welcome to my page</div>
              <div style={{fontSize: 26, marginTop: 12, color: "#2235C0", textDecoration: "underline"}}>click here · links · guestbook</div>
              {[0, 1, 2, 3].map((i) => <div key={i} style={{height: 14, borderRadius: 7, background: "#D9D4C8", marginTop: 20, width: `${90 - i * 12}%`}} />)}
              {f > L(13.9) ? <div style={{marginTop: 26, fontFamily: MONO, fontSize: 30, color: C.bug, fontWeight: 700, opacity: out(f, L(13.94), L(14.3))}}>STATIC · nothing moves</div> : null}
            </div>
          </div>} />
        <Shadow w={860} style={{marginTop: 16}} />
      </div>
      {need ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1150, opacity: out(f, L(16.14), L(16.5))}}>
          <Glass glow={C.g}>
            <div style={{...label, color: C.g}}>NEEDED</div>
            <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 8}}>a <Marker at={L(17.0)}>tiny scripting language</Marker></div>
          </Glass>
        </div>
      ) : null}
      {f > L(18.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1400, fontFamily: MONO, fontSize: 40, color: C.g, opacity: out(f, L(18.77), L(19.1))}}>
          {typed("<script> …runs inside the page", f, L(18.8), 30)}
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · ten days: Mocha → LiveScript =================
const TenDays: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const days = interpolate(f, [L(24.3), L(25.6)], [0, 10], clamp);
  return (
    <AbsoluteFill>
      <Section text="MAY 1995 / 10 DAYS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, opacity: out(f, L(20.6), L(21))}}>
        <Glass style={{display: "flex", alignItems: "center", gap: 24, padding: "20px 28px"}}>
          <div style={{width: 76, height: 76, borderRadius: 38, background: "#2E323A", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: AMBER}}>BE</div>
          <div>
            <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>Brendan Eich</div>
            <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 4}}>engineer · Netscape</div>
          </div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 520, display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, opacity: out(f, L(22.2), L(22.7))}}>
        {Array.from({length: 10}).map((_, i) => {
          const on = days > i;
          return (
            <div key={i} style={{transform: `translateY(${on ? 0 : 10}px)`}}>
              <Slab w={160} h={130} d={30} rx={-20} ry={0} color={on ? "#3A3220" : "#262931"} radius={16} glow={on ? AMBER : undefined}
                front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
                  <div><div style={{fontFamily: MONO, fontSize: 18, color: C.dim}}>DAY</div><div style={{fontFamily: SANS, fontWeight: 900, fontSize: 52, color: on ? AMBER : C.text}}>{i + 1}</div></div>
                </div>} />
            </div>
          );
        })}
      </div>
      {f > L(24.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 880, ...big(70, AMBER), transform: `scale(${pop(f, L(24.3))})`, transformOrigin: "left center"}}>first prototype: ~10 days</div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1060, display: "flex", alignItems: "center", gap: 30}}>
        {f > L(25.7) ? (
          <div style={{flex: 1, opacity: out(f, L(25.75), L(26.1)), transform: `translateY(${(1 - out(f, L(25.75), L(26.1))) * 40}px)`}}>
            <Glass style={{textAlign: "center"}}>
              <div style={label}>CODENAME</div>
              <div style={{fontFamily: SANS, fontSize: 64, fontWeight: 900, marginTop: 8, color: f > L(27.1) ? C.dim : C.text, textDecoration: f > L(27.1) ? "line-through" : "none"}}>Mocha</div>
            </Glass>
          </div>
        ) : null}
        {f > L(27.1) ? <div style={{...big(80, AMBER), opacity: out(f, L(27.14), L(27.4))}}>→</div> : null}
        {f > L(28.4) ? (
          <div style={{flex: 1.3, opacity: out(f, L(28.5), L(28.9)), transform: `translateY(${(1 - out(f, L(28.5), L(28.9))) * 40}px)`}}>
            <Glass glow={C.g} style={{textAlign: "center"}}>
              <div style={{...label, color: C.g}}>BETA · SEP 1995</div>
              <div style={{fontFamily: SANS, fontSize: 64, fontWeight: 900, marginTop: 8}}>LiveScript</div>
            </Glass>
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};

// ================= 4 · the hype + the rename =================
const Rename: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const hype = interpolate(f, [L(30.3), L(31.8)], [0, 1], {...clamp, easing: ease3});
  const renamed = f >= L(39.0);
  return (
    <AbsoluteFill>
      <Section text="DEC 1995 / THE RENAME" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, opacity: out(f, L(30.1), L(30.5))}}>
        <Glass>
          <div style={label}>1995 HYPE METER</div>
          <div style={{display: "flex", alignItems: "center", gap: 20, marginTop: 14}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 48, width: 160}}>Java</div>
            <div style={{flex: 1, height: 36, borderRadius: 18, background: "rgba(255,255,255,.08)", overflow: "hidden"}}>
              <div style={{width: `${hype * 100}%`, height: "100%", borderRadius: 18, background: `linear-gradient(90deg, ${AMBER}, ${C.bug})`, boxShadow: `0 0 20px ${AMBER}`}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 30, color: AMBER, width: 90}}>{hype > 0.95 ? "MAX" : ""}</div>
          </div>
        </Glass>
      </div>
      {f > L(31.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 560, display: "flex", alignItems: "center", justifyContent: "center", gap: 26, opacity: out(f, L(31.96), L(32.4))}}>
          <Plate text="Netscape" at={L(31.96)} w={380} size={56} ry={12} />
          <div style={{...big(70, C.g)}}>+</div>
          <Plate text="Sun" at={L(32.6)} w={300} size={60} ry={-12} sub="maker of Java" />
        </div>
      ) : null}
      {f > L(33.8) && !renamed ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 940, opacity: out(f, L(33.91), L(34.3))}}>
          <Glass>
            <div style={label}>MANAGEMENT: MAKE IT LOOK LIKE JAVA</div>
            <div style={{fontFamily: MONO, fontSize: 36, marginTop: 12, lineHeight: 1.5}}>
              <span style={{color: AMBER}}>if</span> (x {"{"}<br />
              &nbsp;&nbsp;{typed("doThis();", f, L(35), 20)}<br />{"}"}
            </div>
            <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 8}}>illustrative · C/Java-style braces</div>
          </Glass>
        </div>
      ) : null}
      {f > L(36.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: renamed ? 940 : 1290, textAlign: "center", opacity: out(f, L(36.88), L(37.2))}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 80, color: renamed ? C.dim : C.text, textDecoration: renamed ? "line-through" : "none", textDecorationColor: C.bug}}>LiveScript</div>
          {renamed ? <div style={{...big(120, AMBER), marginTop: 10, transform: `scale(${pop(f, L(39.0))})`, textShadow: `0 0 40px ${AMBER}66`}}>JavaScript</div> : null}
        </div>
      ) : null}
      {f > L(40.4) ? (
        <div style={{position: "absolute", left: 0, right: 40, top: 1300, display: "grid", placeItems: "center"}}>
          <div style={{border: `8px solid ${C.bug}`, borderRadius: 18, padding: "12px 34px", ...big(84, C.bug), transform: `rotate(-6deg) scale(${pop(f, L(40.44))})`}}>PURE MARKETING</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · unrelated + trademark → ECMAScript =================
const Standard: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const rows: [string, string][] = [["compiled → JVM", "runs in the browser"], ["classes first", "prototypes"], ["static types", "dynamic types"]];
  return (
    <AbsoluteFill>
      <Section text="NOT RELATED" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, opacity: out(f, L(41.3), L(41.7))}}>
        <Glass>
          <div style={{display: "flex", fontFamily: SANS, fontWeight: 900, fontSize: 40}}>
            <div style={{flex: 1}}>Java</div><div style={{flex: 1, color: AMBER}}>JavaScript</div>
          </div>
          {rows.map(([a, b], i) => (
            <div key={i} style={{display: "flex", fontFamily: MONO, fontSize: 28, marginTop: 14, opacity: out(f, L(41.6) + i * 8, L(41.6) + i * 8 + 8)}}>
              <div style={{flex: 1, color: C.dim}}>{a}</div><div style={{flex: 1}}>{b}</div>
            </div>
          ))}
        </Glass>
      </div>
      {f > L(43.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 720, display: "flex", alignItems: "center", gap: 20, opacity: out(f, L(43.21), L(43.6))}}>
          <div style={{flex: 1}}><Glass style={{textAlign: "center"}}><div style={label}>TRADEMARK ™</div><div style={{fontFamily: SANS, fontSize: 54, fontWeight: 900, marginTop: 6}}>Sun</div></Glass></div>
          <div style={{...big(70, AMBER), opacity: out(f, L(45.18), L(45.5))}}>→</div>
          <div style={{flex: 1, opacity: out(f, L(45.18), L(45.6))}}><Glass glow={C.bug} style={{textAlign: "center"}}><div style={label}>SINCE 2010</div><div style={{fontFamily: SANS, fontSize: 54, fontWeight: 900, marginTop: 6}}>Oracle</div></Glass></div>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 990}}>
        <Reveal at={L(48.16)} size={60}>So the official standard:</Reveal>
      </div>
      {f > L(52.1) ? (
        <div style={{position: "absolute", left: 0, right: 40, top: 1110, display: "grid", placeItems: "center"}}>
          <Plate text="ECMAScript" at={L(52.2)} w={760} size={110} color={AMBER} sub="ECMA-262 · 1997" />
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · myth bust + follow =================
const Myth: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="MYTH BUSTED" />
      <div style={{position: "absolute", left: 64, right: 110, top: 330, opacity: out(f, L(53.5), L(53.9))}}>
        <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
          <div style={label}>SOMEONE SAYS</div>
          <div style={{fontFamily: SANS, fontSize: 52, fontWeight: 800, marginTop: 10}}>“JavaScript is Java's <span style={{color: C.bug}}>little brother</span>”</div>
        </Glass>
      </div>
      {f > L(56.0) ? (
        <div style={{position: "absolute", left: 0, right: 40, top: 640, display: "grid", placeItems: "center"}}>
          <div style={{border: `8px solid ${C.bug}`, borderRadius: 18, padding: "10px 40px", ...big(110, C.bug), transform: `rotate(-5deg) scale(${pop(f, L(56.07))})`}}>MYTH ✕</div>
        </div>
      ) : null}
      {f > L(58.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 900, textAlign: "center", ...big(78, C.g), transform: `scale(${pop(f, L(58.36))})`}}>
          just a <Marker at={L(58.9)}>marketing name.</Marker>
        </div>
      ) : null}
      {f > L(59.7) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1280, opacity: out(f, L(59.8), L(60.1))}}>
          <Glass style={{borderLeft: `8px solid ${C.g}`}}>
            <div style={label}>WEEKEND ORIGINS</div>
            <div style={{fontFamily: MONO, fontSize: 34, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(59.9), 40)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1600, fontFamily: MONO, fontSize: 19, color: C.dim, opacity: out(f, L(54), L(54.4))}}>sources: Speaking JavaScript (O'Reilly) · Red Hat Developer · Ecma-262</div>
    </AbsoluteFill>
  );
};

// bottom history timeline
const YEARS: [string, number][] = [["MAY 95", 0.04], ["SEP 95", 0.27], ["DEC 95", 0.5], ["1997", 0.73], ["TODAY", 0.96]];
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const marks = [CUTS[2], T(28.5), T(39.0), T(52.2), CUTS[5]];
  let cur = 0;
  marks.forEach((m, i) => { if (f >= m - 4) cur = i; });
  if (f < CUTS[2]) cur = -1;
  const pts = YEARS.map(([, p]) => p);
  const x = interpolate(f, [0, marks[0], marks[1], marks[2], marks[3], marks[4]], [0, pts[0], pts[1], pts[2], pts[3], pts[4]], {...clamp, easing: ease3});
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 90, borderRadius: 20, background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)", opacity: out(f, 8, 20), zIndex: 10}}>
      <div style={{position: "absolute", left: 30, right: 30, top: 30, height: 4, borderRadius: 2, background: "rgba(255,255,255,.12)"}}>
        <div style={{position: "absolute", left: 0, width: `${x * 100}%`, height: 4, borderRadius: 2, background: AMBER}} />
      </div>
      {YEARS.map(([y, p], i) => (
        <div key={y} style={{position: "absolute", left: `calc(30px + ${p} * (100% - 60px))`, top: 20, transform: "translateX(-50%)", textAlign: "center"}}>
          <div style={{width: 24, height: 24, borderRadius: 12, margin: "0 auto", background: i === cur ? AMBER : i < cur ? "#6B5A2E" : "#2A2D33", boxShadow: i === cur ? `0 0 16px ${AMBER}` : "none"}} />
          <div style={{fontFamily: MONO, fontSize: 20, color: i === cur ? C.text : C.dim, marginTop: 6, whiteSpace: "nowrap"}}>{y}</div>
        </div>
      ))}
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, StaticWeb, TenDays, Rename, Standard, Myth];

export const Origins06: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : O6_TOTAL - CUTS[i]));
  const pres = [
    slide({direction: "from-bottom"}),
    clockWipe({width: 1080, height: 1920}),
    wipe({direction: "from-right"}),
    flip({direction: "from-left"}),
    iris({width: 1080, height: 1920}),
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
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 3 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Timeline />
      <AbsoluteFill style={{zIndex: 20}}><Hud series="ORIGINS" ep="06" total={O6_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
