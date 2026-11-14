// Weekend Origins · EP04 "Why Ctrl+Alt+Del?"
// Facts (Mental Floss, ABC News, Engadget, The Register): David Bradley, an IBM engineer on the original IBM PC (1981),
// wrote the Ctrl+Alt+Del soft reboot so developers could restart without powering off; it took him minutes to code;
// the keys were chosen so they can't be hit by accident with one hand. Meant for developers, it spread to users.
// Windows NT (1993) made it the secure attention sequence for logon: apps can't intercept it, so a fake logon screen
// can't capture it. Myth: Bill Gates did not invent it. 2001 (IBM PC 20th anniversary panel) Bradley: "I may have
// invented it, but I think Bill made it famous." Sept 2013 (Harvard event) Gates: "it was a mistake", he wanted a
// single button. Visual: real-geometry 3D keycaps (Slab), generic beige PC, bottom history timeline.
// Timed to the Hinglish Sarvam voice (content/debug-diaries/origins-04/voice.wav, calm defaults).
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
const CUTS = [0, 12.1, 22.11, 32.07, 42.13, 50.6].map(T);
export const O4_TOTAL = T(62.714) + 15;
const TR = 15;
const AMBER = "#FFB020";

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1.05, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);

// a solid 3D keycap that presses down at `at` (local frame)
const Key: React.FC<{k: string; at: number; w?: number; color?: string; glow?: string; hold?: boolean}> = ({k, at, w = 250, color = "#2B2E35", glow, hold = true}) => {
  const f = useCurrentFrame();
  const down = f < at ? 0 : hold ? out(f, at, at + 4) : interpolate(f, [at, at + 4, at + 12], [0, 1, 0], clamp);
  const lit = f >= at;
  return (
    <div style={{transform: `translateY(${down * 26}px)`}}>
      <Slab w={w} h={210} d={70 - down * 30} rx={-28} ry={0} color={color} radius={26} glow={lit ? glow : undefined}
        front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 800, fontSize: 64, color: lit ? (glow || C.text) : C.text}}>{k}</div>} />
      <Shadow w={w} style={{marginTop: 10 - down * 10}} op={0.55 - down * 0.2} />
    </div>
  );
};

const Combo: React.FC<{at: number[]; scale?: number; glow?: string}> = ({at, scale = 1, glow = AMBER}) => (
  <div style={{display: "flex", gap: 34 * scale, justifyContent: "center", transform: `scale(${scale})`}}>
    <Key k="Ctrl" at={at[0]} glow={glow} />
    <Key k="Alt" at={at[1]} glow={glow} w={220} />
    <Key k="Del" at={at[2]} glow={glow} w={220} />
  </div>
);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const stamp = interpolate(f, [T(8.7), T(8.7) + 6], [2.2, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="WEEKEND ORIGINS · EP04" /></div>
      <div style={{position: "absolute", left: 0, right: 40, top: 400}}>
        <Combo at={[T(0.06), T(0.98), T(1.68)]} scale={0.95} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 760}}>
        <Reveal at={T(3.39)} size={86}>Where did this</Reveal>
        <Reveal at={T(4.1)} size={86} color={AMBER} style={{marginTop: 4}}>come from?</Reveal>
      </div>
      {f > T(5.85) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1040, opacity: out(f, T(5.93), T(6.3))}}>
          <Glass style={{position: "relative"}}>
            <div style={label}>POPULAR BELIEF</div>
            <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 800, marginTop: 10, textDecoration: f > T(8.7) ? `line-through 6px ${C.bug}` : "none"}}>“Bill Gates invented it.”</div>
            {f > T(8.65) ? (
              <div style={{position: "absolute", right: 30, top: -40, transform: `rotate(-10deg) scale(${stamp})`, border: `6px solid ${C.bug}`, borderRadius: 14, padding: "6px 22px", ...big(64, C.bug), background: "rgba(18,19,22,.85)"}}>MYTH</div>
            ) : null}
          </Glass>
        </div>
      ) : null}
      {f > T(9.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1330, ...big(54, C.text), opacity: out(f, T(9.9), T(10.3))}}>
          The story of the world's most <span style={{color: AMBER}}>famous shortcut.</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · 1981 =================
const Beige: React.FC<{hang: boolean; f: number}> = ({hang, f}) => (
  <Slab w={620} h={460} d={150} rx={-8} ry={Math.sin(f / 50) * 10 - 8} color="#CFC6AE" radius={18}
    front={<div style={{width: "100%", height: "100%", padding: 34, boxSizing: "border-box"}}>
      <div style={{width: "100%", height: 330, borderRadius: 16, background: "#0A120C", boxShadow: "inset 0 0 40px #000", padding: 24, boxSizing: "border-box", fontFamily: MONO, fontSize: 28, color: hang ? C.bug : C.g, lineHeight: 1.5}}>
        <div>A&gt; RUN TEST.EXE</div>
        <div>{hang ? "▌ (no response)" : "running…"}</div>
        {hang ? <div style={{marginTop: 18, fontSize: 40, fontWeight: 800}}>SYSTEM HUNG</div> : null}
      </div>
      <div style={{display: "flex", justifyContent: "space-between", marginTop: 20}}>
        <div style={{width: 160, height: 14, borderRadius: 7, background: "#B3A98F"}} />
        <div style={{width: 18, height: 18, borderRadius: 9, background: hang ? C.bug : C.g}} />
      </div>
    </div>} />
);

const Year1981: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const hang = f >= L(17.77);
  const sw = f >= L(19.98) ? Math.floor((f - L(19.98)) / 9) % 2 === 0 : true;
  const resets = f >= L(19.98) ? Math.min(9, 1 + Math.floor((f - L(19.98)) / 18)) : 0;
  return (
    <AbsoluteFill>
      <Section text="1981 / IBM" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(12.14)} size={110} color={AMBER}>1981.</Reveal>
      </div>
      {f > L(13.2) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 470, opacity: out(f, L(13.31), L(13.7))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 24, padding: "20px 28px"}}>
            <div style={{width: 76, height: 76, borderRadius: 38, background: "#2E323A", display: "grid", placeItems: "center", fontFamily: SANS, fontWeight: 900, fontSize: 34, color: AMBER}}>DB</div>
            <div>
              <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800}}>David Bradley</div>
              <div style={{fontFamily: MONO, fontSize: 24, color: C.dim, marginTop: 4}}>engineer · original IBM PC team</div>
            </div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 0, right: 40, top: 690, display: "grid", placeItems: "center", opacity: out(f, L(15.3), L(15.8))}}>
        <Beige hang={hang} f={f} />
        <Shadow w={620} style={{marginTop: 26}} />
      </div>
      {f > L(19.9) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(19.98), L(20.3))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 30}}>
            <div style={{width: 70, height: 120, borderRadius: 14, background: "#1A1B1F", border: "2px solid #3A3D44", position: "relative"}}>
              <div style={{position: "absolute", left: 8, right: 8, height: 50, top: sw ? 8 : 60, borderRadius: 10, background: sw ? C.bug : "#555", transition: "none"}} />
            </div>
            <div>
              <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800}}>Power <span style={{color: C.bug}}>OFF</span> → <span style={{color: C.g}}>ON</span>…</div>
              <div style={{fontFamily: MONO, fontSize: 28, color: C.dim, marginTop: 6}}>again. ×{resets}</div>
            </div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the shortcut =================
const KB_ROW = ["Ctrl", "A", "S", "D", "F", "G", "H", "J", "K", "L", "Del"];
const Shortcut: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const far = out(f, L(27.78), L(28.5));
  return (
    <AbsoluteFill>
      <Section text="THE SHORTCUT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(22.15)} size={80}>A soft reboot.</Reveal>
        <Reveal at={L(23.62)} size={56} color={C.g} style={{marginTop: 8}}>Restart without switching off.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560, opacity: out(f, L(23.7), L(24.1))}}>
        <Glass>
          <div style={label}>ILLUSTRATIVE · KEYBOARD HANDLER</div>
          <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.6, marginTop: 10}}>
            <div style={{color: C.dim}}>{typed("if (ctrl && alt && del)", f, L(24), 40)}</div>
            <div style={{color: C.g}}>&nbsp;&nbsp;{typed("reboot();  // no power cycle", f, L(24.8), 40)}</div>
          </div>
          {f > L(26) ? <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, marginTop: 14, opacity: out(f, L(26.03), L(26.4))}}>Time to write it: <Marker at={L(26.6)}>a few minutes</Marker></div> : null}
        </Glass>
      </div>
      {/* schematic keyboard: Ctrl+Alt on the left, Del far right */}
      <div style={{position: "absolute", left: 0, right: 40, top: 960, display: "grid", placeItems: "center", opacity: out(f, L(27.7), L(28.1))}}>
        <Slab w={880} h={250} d={60} rx={-14} ry={Math.sin(f / 40) * 6} color="#24262C" radius={18}
          front={<div style={{width: "100%", height: "100%", padding: 22, boxSizing: "border-box"}}>
            {[0, 1, 2].map((r) => (
              <div key={r} style={{display: "flex", gap: 8, marginBottom: 8}}>
                {KB_ROW.map((k, i) => {
                  const hot = (r === 2 && i === 0) || (r === 1 && i === 0) || (r === 0 && i === KB_ROW.length - 1);
                  const txt = r === 2 && i === 0 ? "Ctrl" : r === 1 && i === 0 ? "Alt" : r === 0 && i === KB_ROW.length - 1 ? "Del" : "";
                  return <div key={i} style={{flex: i === 0 || i === KB_ROW.length - 1 ? 1.6 : 1, height: 56, borderRadius: 8, background: hot ? `${AMBER}33` : "#33363E", border: hot ? `2px solid ${AMBER}` : "2px solid #3D4048", fontFamily: MONO, fontSize: 18, color: AMBER, display: "grid", placeItems: "center"}}>{txt}</div>;
                })}
              </div>
            ))}
          </div>} />
        <Shadow w={880} style={{marginTop: 20}} />
        <svg width={880} height={90} style={{marginTop: -10, opacity: far}}>
          <path d={`M 80 40 L ${80 + 720 * far} 40`} stroke={AMBER} strokeWidth={5} strokeDasharray="14 10" />
          <text x={440} y={82} textAnchor="middle" fill={AMBER} style={{fontFamily: MONO, fontSize: 26}}>FAR APART · ON PURPOSE</text>
        </svg>
      </div>
      {f > L(29.4) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1440, ...big(52, C.text), opacity: out(f, L(29.47), L(29.9))}}>
          No <span style={{color: C.bug}}>one-hand accident.</span> ✋
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 4 · the secret got out =================
const Secret: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const spread = out(f, L(38.3), L(41.2));
  return (
    <AbsoluteFill>
      <Section text="THE SECRET" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, opacity: out(f, L(32.12), L(32.5))}}>
        <Glass style={{borderLeft: `8px solid ${C.g}`}}>
          <div style={{...label, color: C.g}}>🔒 FOR DEVELOPERS</div>
          <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 800, marginTop: 8}}>Not meant for <Marker at={L(34.2)} color={C.bug}>users.</Marker></div>
        </Glass>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 560}}>
        <Reveal at={L(35.2)} size={84}>Computer stuck?</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 40, top: 720}}>
        <Combo at={[L(36.26), L(36.6), L(36.95)]} scale={0.85} glow={C.g} />
      </div>
      {/* the habit spreads: a grid of tiny screens all pressing the combo */}
      <div style={{position: "absolute", left: 64, right: 110, top: 1080, display: "grid", gridTemplateColumns: "repeat(8, 1fr)", gap: 12}}>
        {Array.from({length: 32}).map((_, i) => {
          const r = Math.sin(i * 77.3) * 1e4; const d = (r - Math.floor(r)) * 0.9;
          const on = spread > d;
          return <div key={i} style={{height: 64, borderRadius: 10, background: on ? "rgba(255,176,32,.16)" : "rgba(255,255,255,.04)", border: `1.5px solid ${on ? AMBER : "rgba(255,255,255,.08)"}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 13, color: AMBER, transform: `scale(${on ? 1 : 0.8})`}}>{on ? "C·A·D" : ""}</div>;
        })}
      </div>
      {f > L(39.4) ? <div style={{position: "absolute", left: 64, right: 110, top: 1440, ...big(50, C.text), opacity: out(f, L(39.49), L(39.9))}}>Then <span style={{color: AMBER}}>everyone</span> used it.</div> : null}
    </AbsoluteFill>
  );
};

// ================= 5 · Windows NT login =================
const Login: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const fake = f >= L(47.94);
  const x = out(f, L(48.9), L(49.4));
  return (
    <AbsoluteFill>
      <Section text="1993 / WINDOWS NT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(42.17)} size={74}>It became the login key.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 40, top: 470, display: "grid", placeItems: "center", opacity: out(f, L(43.8), L(44.3))}}>
        <Slab w={760} h={340} d={50} rx={-6} ry={Math.sin(f / 45) * 8 - 6} color="#1E3A5F" radius={16}
          front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
            <div>
              <div style={{fontFamily: SANS, fontSize: 30, color: "#B8C7DA"}}>Welcome</div>
              <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800, marginTop: 14, color: "#fff"}}>Press <span style={{color: AMBER}}>Ctrl+Alt+Del</span></div>
              <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800, color: "#fff"}}>to log on</div>
            </div>
          </div>} />
        <Shadow w={760} style={{marginTop: 20}} />
      </div>
      {f > L(46) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 940, opacity: out(f, L(46.08), L(46.5))}}>
          <Glass glow={C.g}>
            <div style={{...label, color: C.g}}>🛡 SECURE ATTENTION SEQUENCE</div>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 8}}>Apps <span style={{color: C.g}}>can't intercept it.</span> Only the OS answers.</div>
          </Glass>
        </div>
      ) : null}
      {fake ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1200, opacity: out(f, L(47.94), L(48.3))}}>
          <Glass style={{position: "relative", borderLeft: `8px solid ${C.bug}`}}>
            <div style={{...label, color: C.bug}}>FAKE LOGIN SCREEN</div>
            <div style={{fontFamily: MONO, fontSize: 30, marginTop: 10, color: C.dim}}>password: ••••••••</div>
            <svg width={300} height={140} style={{position: "absolute", right: 30, top: 10, opacity: x}}>
              <path d={`M 20 20 L ${20 + 260 * x} ${20 + 100 * x} M 280 20 L ${280 - 260 * x} ${20 + 100 * x}`} stroke={C.bug} strokeWidth={12} strokeLinecap="round" />
            </svg>
          </Glass>
          <div style={{...big(46, C.text), marginTop: 22, opacity: out(f, L(49), L(49.4))}}>Your password stays <span style={{color: C.g}}>safe.</span></div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · the confession =================
const Mistake: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const one = out(f, L(56.08), L(56.5));
  return (
    <AbsoluteFill>
      <Section text="2013 / HARVARD" />
      <div style={{position: "absolute", left: 64, top: 320, display: "flex", gap: 14, opacity: out(f, L(50.64), L(51))}}>
        <Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>📅 2013</span></Glass>
        {f > L(51.8) ? <Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>🎓 HARVARD EVENT</span></Glass> : null}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 440, opacity: out(f, L(53.58), L(53.9))}}>
        <Glass>
          <div style={label}>BILL GATES</div>
          <div style={{fontFamily: SANS, fontSize: 52, fontWeight: 800, marginTop: 8}}>“It was a <Marker at={L(54.84)} color={C.bug}>mistake</Marker>.”</div>
          <div style={{display: "flex", alignItems: "center", gap: 26, marginTop: 18, opacity: one}}>
            <div style={{transform: `scale(${0.5 + 0.1 * one})`, transformOrigin: "left center", width: 150, height: 150}}><Key k="⏻" at={L(56.4)} w={240} glow={C.g} /></div>
            <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>should have been <span style={{color: C.g}}>one button</span></div>
          </div>
        </Glass>
      </div>
      {f > L(57.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 900, opacity: out(f, L(57.58), L(58))}}>
          <Glass glow={AMBER}>
            <div style={{...label, color: AMBER}}>DAVID BRADLEY · 2001, PC 20TH ANNIVERSARY</div>
            <div style={{fontFamily: SANS, fontSize: 44, fontWeight: 800, marginTop: 10, lineHeight: 1.25}}>
              “I may have <span style={{color: AMBER}}>invented</span> it,{f > L(60.3) ? <> but Bill made it <span style={{color: C.g}}>famous</span>.”</> : null}
            </div>
          </Glass>
        </div>
      ) : null}
      {f > L(61.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1280, opacity: out(f, L(61.44), L(61.8))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>WEEKEND ORIGINS</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(61.5), 50)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1580, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(52), L(52.4))}}>sources: ABC News · Engadget · Mental Floss · The Register</div>
    </AbsoluteFill>
  );
};

// bottom history timeline
const YEARS: [string, number][] = [["1981", 0.04], ["1993", 0.36], ["2001", 0.66], ["2013", 0.96]];
const Timeline: React.FC = () => {
  const f = useCurrentFrame();
  const cur = f < CUTS[4] ? 0 : f < CUTS[5] ? 1 : f < T(57.58) ? 3 : 2;
  const x = interpolate(f, [CUTS[4] - 10, CUTS[4] + 10, CUTS[5] - 10, CUTS[5] + 10, T(57.4), T(57.8)], [0.04, 0.36, 0.36, 0.96, 0.96, 0.66], {...clamp, easing: ease3});
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

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Year1981, Shortcut, Secret, Login, Mistake];

export const Origins04: React.FC = () => {
  const durs = COMPS.map((_, i) => (i + 1 < CUTS.length ? CUTS[i + 1] - CUTS[i] + TR : O4_TOTAL - CUTS[i]));
  const pres = [
    slide({direction: "from-right"}),
    wipe({direction: "from-left"}),
    clockWipe({width: 1080, height: 1920}),
    flip({direction: "from-bottom"}),
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
              <TransitionSeries.Transition presentation={pres[i] as never} timing={i === 3 ? springTiming({config: {damping: 200}, durationInFrames: TR}) : linearTiming({durationInFrames: TR})} />
            ) : null}
          </React.Fragment>
        ))}
      </TransitionSeries>
      <Timeline />
      <AbsoluteFill style={{zIndex: 20}}><Hud series="ORIGINS" ep="04" total={O4_TOTAL} /></AbsoluteFill>
      <AbsoluteFill style={{zIndex: 30, pointerEvents: "none"}}><Grain /></AbsoluteFill>
    </AbsoluteFill>
  );
};
