// Debug Diaries · Entry 010 "Odometer" — a 37-year-old signed-16-bit counter overflow in OpenBSD's SysV shared memory.
// Educational explainer of an already-patched, publicly-reported bug (The Hacker News, 16 Oct 2026): the shm attach
// counter `shm_nattch` is a signed short (max 32,767); pushing past it wraps to −32,768, which the kernel mishandles,
// freeing memory still in use (use-after-free) → local root. Reported by Calif early 2026; fixed by errata 018 (14 Sep)
// and 026 (30 Sep); apply via syspatch. No in-the-wild exploitation. We explain the WHAT (overflow/odometer analogy),
// not a working exploit. Real-3D kit: solid lit slabs + a rotating odometer drum + cube-face scene turns.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing, spring, useVideoConfig} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Drum, Odometer, Spin} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 9.46, 20.05, 34.16, 51.96, 62.66].map(T);
export const E10_TOTAL = T(71.37) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const spin = interpolate(f, [T(1), T(4)], [-20, 16], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="TRENDING · OCT 2026" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={92}>One line of code</Reveal>
        <Reveal at={T(0.4)} size={92} style={{marginTop: 4}}>from 1988.</Reveal>
        {f > T(5.2) ? <Reveal at={T(5.37)} size={92} color={C.bug} style={{marginTop: 14}}>Root on OpenBSD.</Reveal> : null}
      </div>
      {/* a solid floating "1988" slab turning in space */}
      <div style={{position: "absolute", left: 0, right: 0, top: 820, display: "grid", placeItems: "center"}}>
        <Slab w={560} h={300} d={90} rx={-14} ry={spin} color="#23252B" glow={C.bug}
          front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}>
            <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 150, color: C.text, letterSpacing: "0.04em"}}>1988</div>
          </div>} />
        <Shadow w={560} style={{marginTop: 34, opacity: out(f, 4, 14)}} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, T(6), T(6.5))}}>
        <Glass style={{display: "flex", alignItems: "center", gap: 18}}>
          <span style={{fontSize: 52}}>🛡️</span>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800}}>The OS famous for being <span style={{color: C.g}}>secure by default</span></div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// ================= 2 · setup: shared memory + the counter =================
const Setup: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const procs = Math.round(interpolate(f, [L(11.56), L(14.1)], [0, 4], {...clamp, easing: ease3}));
  const freed = f > L(16.94);
  return (
    <AbsoluteFill>
      <Section text="02 / HOW IT WORKS" />
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={L(9.5)} size={74}>Processes share one memory.</Reveal>
      </div>
      {/* central shared-memory slab with processes attaching */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "grid", placeItems: "center"}}>
        <Slab w={420} h={240} d={110} rx={-16} ry={interpolate(f, [0, L(10)], [40, -14], {...clamp, easing: ease3})} color="#20262B" glow={C.g}
          front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", gap: 6}}>
            <div style={{...label, color: C.g}}>SHARED MEMORY</div>
            <div style={{fontSize: 56}}>🧠</div>
          </div>} />
        <Shadow w={420} style={{marginTop: 26}} />
      </div>
      {/* attach counter */}
      <div style={{position: "absolute", left: 64, right: 110, top: 1060}}>
        <Glass glow={freed ? C.bug : C.g}>
          <div style={label}>KERNEL COUNTS WHO'S ATTACHED</div>
          <div style={{display: "flex", alignItems: "center", gap: 20, marginTop: 14}}>
            <div style={{display: "flex", gap: 10}}>
              {Array.from({length: 4}).map((_, i) => <span key={i} style={{fontSize: 44, opacity: i < procs && !freed ? 1 : 0.18}}>🔗</span>)}
            </div>
            <div style={{marginLeft: "auto", fontFamily: MONO, fontSize: 64, fontWeight: 800, color: freed ? C.bug : C.text}}>{freed ? 0 : procs}</div>
          </div>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 700, marginTop: 14, color: freed ? C.bug : C.text}}>
            {freed ? "count hits 0 → memory freed" : "count = attached processes"}
          </div>
        </Glass>
      </div>
      {f > L(18.3) ? <div style={{position: "absolute", left: 64, top: 1360, ...big(60, C.dim)}}>{typed("so the count must be right…", f, L(18.51), 36)}</div> : null}
    </AbsoluteFill>
  );
};

// ================= 3 · the bug: the odometer =================
const Bug: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const overflow = f >= L(26.43);
  // digit values for the live odometer
  const climb = interpolate(f, [L(22.3), L(25.2)], [32760, 32767], {...clamp, easing: ease3});
  const base = overflow ? 32768 : climb; // magnitude; after overflow the sign is negative
  // only the ones wheel rolls continuously; higher wheels snap to clean digits (like a real odometer)
  const dig = (place: number) => (place === 0 ? Math.abs(base) : Math.floor(Math.abs(base) / Math.pow(10, place)) % 10);
  const flash = overflow ? out(f, L(26.43), L(26.43) + 8) * (1 - out(f, L(26.43) + 8, L(26.43) + 22)) : 0;
  return (
    <AbsoluteFill>
      <Section text="03 / THE BUG" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320, ...big(70, C.text)}}>
        THE COUNTER WAS A <Marker at={L(21)} color={C.bug}><span style={{color: C.bug}}>16-BIT SHORT.</span></Marker>
      </div>
      {/* the odometer: five real rotating drums + a sign drum */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "grid", placeItems: "center"}}>
        <div style={{display: "flex", alignItems: "center", gap: 12, padding: "26px 30px", borderRadius: 26, background: "linear-gradient(#17191D, #0D0F12)", border: `2px solid ${overflow ? C.bug : "rgba(255,255,255,.12)"}`, boxShadow: overflow ? `0 0 70px ${C.bug}66` : "0 30px 60px rgba(0,0,0,.5)"}}>
          <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 120, width: 66, textAlign: "center", color: overflow ? C.bug : C.dim}}>{overflow ? "−" : "+"}</div>
          {[4, 3, 2, 1, 0].map((p) => <Drum key={p} value={dig(p)} color={overflow ? C.bug : C.text} />)}
        </div>
        <div style={{marginTop: 20, fontFamily: MONO, fontSize: 30, color: C.dim}}>max value: 32,767</div>
      </div>
      {/* +1 trigger */}
      {f > L(25.4) && !overflow ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1140, textAlign: "center", ...big(80, C.g), opacity: out(f, L(25.4), L(25.7))}}>+ 1</div>
      ) : null}
      {overflow ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1120, textAlign: "center"}}>
          <Reveal at={L(26.43)} size={82} color={C.bug}>Flips to −32,768.</Reveal>
        </div>
      ) : null}
      {/* odometer analogy */}
      {f > L(30) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1320, opacity: out(f, L(30.24), L(30.7))}}>
          <Glass>
            <div style={{display: "flex", alignItems: "center", gap: 18}}>
              <span style={{fontSize: 52}}>🚗</span>
              <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 700}}>Like an old car meter: after <span style={{color: C.g}}>99,999</span> → back to <span style={{color: C.bug}}>zero</span></div>
            </div>
          </Glass>
        </div>
      ) : null}
      {flash > 0 ? <AbsoluteFill style={{background: C.bug, opacity: flash * 0.5}} /> : null}
    </AbsoluteFill>
  );
};

// ================= 4 · the attack (conceptual chain) =================
const STEPS: [string, string, number][] = [
  ["push the counter past its max", "127 segments · 259 processes", 36.57],
  ["counter wraps negative", "kernel miscounts who's attached", 41.84],
  ["frees memory still in use", "use-after-free", 44.29],
  ["writes into freed kernel memory", "second bug in the chain", 46.48],
  ["gains root", "local privilege escalation", 48.21],
];
const Attack: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="04 / THE ATTACK" />
      <div style={{position: "absolute", left: 64, right: 110, top: 316}}>
        <Reveal at={L(34.2)} size={64}>Researchers at Calif chained it.</Reveal>
      </div>
      {/* stacked solid slabs, each dropping in with depth */}
      <div style={{position: "absolute", left: 64, right: 110, top: 470, display: "grid", gap: 16}}>
        {STEPS.map(([t, d, at], i) => {
          const a = L(at);
          const p = out(f, a, a + 10);
          const danger = i >= 1;
          return (
            <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 90}px)`, perspective: 1200}}>
              <div style={{transform: `rotateY(${(1 - p) * -24}deg)`, transformOrigin: "0 50%"}}>
                <Glass glow={danger && p > 0.9 ? C.bug : undefined} style={{padding: "16px 22px", display: "flex", alignItems: "center", gap: 18}}>
                  <span style={{width: 52, height: 52, flex: "0 0 52px", borderRadius: 14, display: "grid", placeItems: "center", fontFamily: MONO, fontWeight: 700, fontSize: 26, background: danger ? `${C.bug}2e` : "rgba(255,255,255,.08)", color: danger ? C.bug : C.text}}>{i + 1}</span>
                  <div>
                    <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, color: danger ? C.bug : C.text}}>{t}</div>
                    <div style={{fontFamily: MONO, fontSize: 22, color: C.dim, marginTop: 2}}>{d}</div>
                  </div>
                </Glass>
              </div>
            </div>
          );
        })}
      </div>
      {f > L(50) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(50.2), L(50.6))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 900, color: C.bug}}># </div>
            <div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginTop: 2}}>{typed("got a root shell — KARL, SMAP, SMEP and all", f, L(50.2), 34)}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 5 · the fix =================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const {fps} = useVideoConfig();
  const sp = spring({frame: f - L(52), fps, config: {damping: 14}});
  return (
    <AbsoluteFill>
      <Section text="05 / THE FIX" />
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={L(52)} size={78} color={C.g}>Patched in September.</Reveal>
      </div>
      {/* two errata slabs, solid */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "flex", justifyContent: "center", gap: 40}}>
        {[["errata 018", "14 Sep", -18], ["errata 026", "30 Sep", 18]].map(([e, dt, ry], i) => (
          <div key={i} style={{display: "grid", placeItems: "center", opacity: out(f, L(55) + i * 6, L(55.4) + i * 6)}}>
            <Slab w={300} h={300} d={70} rx={-12} ry={ry as number} color="#1E2A22" glow={C.g}
              front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", gap: 10}}>
                <span style={{fontSize: 54}}>✅</span>
                <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800, color: C.g}}>{e}</div>
                <div style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>{dt}</div>
              </div>} />
            <Shadow w={300} style={{marginTop: 24}} />
          </div>
        ))}
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1080, transform: `scale(${0.9 + sp * 0.1})`}}>
        <Glass glow={C.g}>
          <div style={label}>ONE COMMAND</div>
          <div style={{fontFamily: MONO, fontSize: 46, fontWeight: 700, color: C.g, marginTop: 8}}># syspatch</div>
        </Glass>
      </div>
      {f > L(59) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1300, opacity: out(f, L(59.4), L(59.9))}}>
          <Glass style={{display: "flex", alignItems: "center", gap: 16}}>
            <span style={{fontSize: 46}}>🙂</span>
            <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>No real-world attacks reported</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 6 · lesson + CTA =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 360}}>
        <Reveal at={L(62.7)} size={92}>Small type,</Reveal>
        <Reveal at={L(63.65)} size={92} color={C.bug} style={{marginTop: 4}}>big bug.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 700, display: "grid", placeItems: "center"}}>
        <Slab w={600} h={200} d={70} rx={-10} ry={interpolate(f, [0, 60], [20, -10], {...clamp, easing: ease3})} color="#23252B"
          front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}>
            <div style={{fontFamily: MONO, fontSize: 40, color: C.text}}>short → <span style={{color: C.g}}>int</span></div>
          </div>} />
        <Shadow w={600} style={{marginTop: 28}} />
      </div>
      {f > L(65.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1040, ...big(58, C.dim), opacity: out(f, L(65.69), L(66.1))}}>
          Code can be 37 years old. So can the bug.
        </div>
      ) : null}
      {f > L(67.8) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1240, opacity: out(f, L(67.95), L(68.4)), transform: `translateY(${(1 - out(f, L(67.95), L(68.4))) * 30}px)`}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>TRENDING BUGS, EXPLAINED</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(68.57), 40)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1480, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(66), L(66.4))}}>source: The Hacker News · calif.io (Oct 2026)</div>
    </AbsoluteFill>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Setup, Bug, Attack, Fix, Lesson];

export const DebugDiaries010: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E10_TOTAL;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Spin len={b - a} first={i === 0} last={i === COMPS.length - 1}>
            <Push len={b - a}>
              <Comp off={a} />
            </Push>
          </Spin>
        </Sequence>
      );
    })}
    {CUTS.slice(1).map((a) => <Cut key={a} at={a} />)}
    <Hud ep="010" total={E10_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
