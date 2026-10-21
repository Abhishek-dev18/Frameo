// Debug Diaries · Entry 011 "Lights Out" — Google Cloud europe-west2 (London) "power event", 20 Oct 2026.
// Facts (Tom's Guide live coverage): noticed ~7:08am UK; Google: "elevated errors and intermittent network failures"
// across multiple Google Cloud services, cause "a power event", London region only (not Europe-wide). Hit: Revolut
// (card payments, ATM withdrawals; said money and data safe), Halifax/Lloyds apps, NHS app, Royal Mail tracking,
// Spotify users reported issues. Revolut peaked at 692 Downdetector reports at one point. Most recovering by ~12:50pm.
// Visual: real-geometry 3D (lit building slabs with window grids), glass UI, incident status strip, cube-turn scenes.
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";
import {Slab, Shadow, Spin} from "./depth";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 7.48, 15.69, 27.59, 33.95, 41.9].map(T);
export const E11_TOTAL = T(49.92) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const WARM = "#FFD27A";

// A data-centre building: solid lit slab whose window grid can go dark (with a flicker).
const Building: React.FC<{lit: number; w?: number; h?: number; ry?: number; name?: string; tone?: string; seed?: number}> = ({lit, w = 250, h = 360, ry = 0, name, tone, seed = 1}) => {
  const f = useCurrentFrame();
  const cols = 4, rows = 6;
  const front = (
    <div style={{width: "100%", height: "100%", padding: "26px 22px", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 14}}>
      <div style={{display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, flex: 1}}>
        {Array.from({length: cols * rows}).map((_, i) => {
          const r = Math.sin(i * 12.9898 * seed) * 43758.5453;
          const rnd = r - Math.floor(r);
          const on = lit > 0.5 ? (lit >= 1 ? 1 : (Math.sin(f * 1.7 + i) > 0 ? 1 : 0.2)) * (rnd > 0.15 ? 1 : 0.35) : 0.06;
          return <div key={i} style={{borderRadius: 4, background: on > 0.1 ? (tone ?? WARM) : "#0E0F12", opacity: on, boxShadow: on > 0.5 ? `0 0 12px ${tone ?? WARM}aa` : "none"}} />;
        })}
      </div>
      {name ? <div style={{fontFamily: MONO, fontSize: 20, color: lit > 0.5 ? C.text : C.bug, textAlign: "center"}}>{name}</div> : null}
    </div>
  );
  return (
    <div style={{display: "grid", placeItems: "center"}}>
      <Slab w={w} h={h} d={130} rx={-10} ry={ry} color={lit > 0.5 ? "#252830" : "#1A1B1F"} glow={lit > 0.5 ? undefined : C.bug} radius={14} front={front} />
      <Shadow w={w} style={{marginTop: 22}} />
    </div>
  );
};

// App row that can fail.
const AppRow: React.FC<{icon: string; name: string; what: string; at: number; downAt?: number}> = ({icon, name, what, at, downAt}) => {
  const f = useCurrentFrame();
  const p = out(f, at, at + 10);
  const down = downAt !== undefined && f >= downAt;
  return (
    <div style={{opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <Glass glow={down ? C.bug : undefined} style={{padding: "16px 22px", display: "flex", alignItems: "center", gap: 18}}>
        <span style={{fontSize: 46}}>{icon}</span>
        <div style={{flex: 1}}>
          <div style={{fontFamily: SANS, fontSize: 34, fontWeight: 800}}>{name}</div>
          <div style={{fontFamily: MONO, fontSize: 21, color: C.dim, marginTop: 2}}>{what}</div>
        </div>
        <span style={{padding: "6px 14px", borderRadius: 10, fontFamily: MONO, fontSize: 22, fontWeight: 700, background: down ? `${C.bug}30` : `${C.g}22`, color: down ? C.bug : C.g}}>{down ? "✕ DOWN" : "● OK"}</span>
      </Glass>
    </div>
  );
};

// ================= 1 · hook =================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const lit = f < T(0.9) ? 1 : f < T(1.3) ? 0.6 : 0;
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 250}}><LiveChip text="OUTAGE · 20 OCT 2026" /></div>
      <div style={{position: "absolute", left: 64, right: 110, top: 324}}>
        <Reveal at={-20} size={88}>One data centre</Reveal>
        <Reveal at={T(0.5)} size={88} color={C.bug} style={{marginTop: 4}}>lost power.</Reveal>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 590}}>
        <Building lit={lit} ry={Math.sin(f / 40) * 10 - 8} name={lit ? "data centre" : "⚡ no power"} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1150, display: "grid", gap: 14}}>
        <AppRow icon="🏦" name="Bank app" what="login · balance" at={T(1.53)} downAt={T(4.3)} />
        <AppRow icon="💳" name="Card payments" what="tap to pay" at={T(3.16)} downAt={T(4.3)} />
        <AppRow icon="🏧" name="ATM" what="cash withdrawal" at={T(3.7)} downAt={T(4.3)} />
      </div>
      {f > T(5.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1560, ...big(64, C.text), opacity: out(f, T(5.24), T(5.6))}}>
          Yesterday. <span style={{color: C.bug}}>{f > T(5.8) ? "Google Cloud." : ""}</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 2 · what happened: region map =================
const Region: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const dark = f >= L(11.41);
  const sway = Math.sin(f / 45) * 6;
  return (
    <AbsoluteFill>
      <Section text="02 / WHAT HAPPENED" />
      <div style={{position: "absolute", left: 64, top: 320, display: "flex", gap: 14}}>
        <div style={{opacity: out(f, L(7.52), L(7.9))}}><Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>📅 20 OCT</span></Glass></div>
        <div style={{opacity: out(f, L(8.41), L(8.8))}}><Glass style={{padding: "10px 18px"}}><span style={{fontFamily: MONO, fontSize: 30}}>🕖 ~7:08 AM UK</span></Glass></div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 440}}>
        <Reveal at={L(9.82)} size={70}>Google Cloud · London region</Reveal>
      </div>
      {/* three regions as real buildings; London is the one that goes dark */}
      <div style={{position: "absolute", left: 30, right: 60, top: 640, display: "flex", justifyContent: "space-between", alignItems: "flex-end", opacity: out(f, L(9.9), L(10.4))}}>
        <div style={{transform: "scale(.72)", transformOrigin: "50% 100%"}}><Building lit={1} ry={18 + sway} name="us-central1" seed={2} /></div>
        <div style={{transform: "scale(.92)", transformOrigin: "50% 100%"}}><Building lit={dark ? 0 : 1} ry={sway} name={dark ? "europe-west2 ⚡" : "europe-west2"} seed={3} /></div>
        <div style={{transform: "scale(.72)", transformOrigin: "50% 100%"}}><Building lit={1} ry={-18 + sway} name="asia-south1" seed={4} /></div>
      </div>
      {dark ? (
        <div style={{position: "absolute", left: 0, right: 0, top: 1150, textAlign: "center", ...big(78, C.bug), opacity: out(f, L(11.41), L(11.7))}}>
          <Marker at={L(11.6)} color={C.bug}>"a power event"</Marker>
        </div>
      ) : null}
      {f > L(13.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1290, opacity: out(f, L(13.42), L(13.8))}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>GOOGLE CLOUD STATUS</div>
            <div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginTop: 10, minHeight: 80}}>{typed("elevated errors · intermittent network failures", f, L(13.5), 34)}</div>
          </Glass>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ================= 3 · who went down =================
const Fallout: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const reps = Math.round(interpolate(f, [L(24.82), L(26.2)], [0, 692], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <AbsoluteFill>
      <Section text="03 / THE FALLOUT" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(15.73)} size={60}>Everything on that region</Reveal>
        <Reveal at={L(16.6)} size={60} color={C.bug} style={{marginTop: 4}}>shook.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 590, display: "grid", gap: 14}}>
        <AppRow icon="💳" name="Revolut" what="card payments · ATM withdrawals" at={L(18.09)} downAt={L(18.6)} />
        <AppRow icon="🏦" name="Halifax · Lloyds" what="apps and website" at={L(21.03)} downAt={L(21.5)} />
        <AppRow icon="🏥" name="NHS app" what="some users affected" at={L(22.68)} downAt={L(23.1)} />
        <AppRow icon="📦" name="Royal Mail" what="parcel tracking" at={L(23.51)} downAt={L(23.9)} />
        <AppRow icon="🎧" name="Spotify" what="users reported issues" at={L(25.59)} downAt={L(26.0)} />
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1430, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, opacity: out(f, L(24.7), L(25.1))}}>
        <Glass>
          <div style={label}>REVOLUT · PEAK</div>
          <div style={{...big(84, C.bug), marginTop: 6}}>{reps}</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>Downdetector reports</div>
        </Glass>
        <Glass>
          <div style={label}>SCOPE</div>
          <div style={{...big(52, C.text), marginTop: 10}}>1 region</div>
          <div style={{fontFamily: MONO, fontSize: 20, color: C.dim, marginTop: 4}}>not Europe-wide</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// ================= 4 · why one region matters =================
const Why: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const dark = f >= L(33.08);
  return (
    <AbsoluteFill>
      <Section text="04 / WHY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(27.63)} size={84}>The cloud isn't magic.</Reveal>
        <Reveal at={L(28.88)} size={84} color={C.g} style={{marginTop: 4}}>It's buildings.</Reveal>
      </div>
      {/* app → one region, wired */}
      <div style={{position: "absolute", left: 0, right: 0, top: 640, display: "flex", alignItems: "center", justifyContent: "center", gap: 0}}>
        <div style={{opacity: out(f, L(30.25), L(30.6))}}>
          <Slab w={220} h={220} d={70} rx={-8} ry={24 + Math.sin(f / 40) * 6} color={dark ? "#2A1C1C" : "#1E2A22"} glow={dark ? C.bug : C.g}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center", textAlign: "center"}}>
              <div><div style={{fontSize: 64}}>{dark ? "💥" : "📱"}</div><div style={{fontFamily: MONO, fontSize: 22, color: dark ? C.bug : C.g, marginTop: 6}}>{dark ? "app down" : "your app"}</div></div>
            </div>} />
        </div>
        <div style={{width: 150, height: 6, borderRadius: 3, background: dark ? C.bug : C.g, opacity: out(f, L(30.6), L(31)), boxShadow: `0 0 18px ${dark ? C.bug : C.g}`}} />
        <div style={{opacity: out(f, L(30.4), L(30.8))}}>
          <Building lit={dark ? 0 : 1} w={220} h={320} ry={-20 + Math.sin(f / 40) * 6} name="one region" seed={5} />
        </div>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 1180, opacity: out(f, L(30.25), L(30.7))}}>
        <Glass glow={dark ? C.bug : undefined}>
          <div style={label}>SINGLE REGION</div>
          <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800, marginTop: 8}}>
            {dark ? <>Region loses power → <span style={{color: C.bug}}>you lose service.</span></> : "Everything runs in one place."}
          </div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// ================= 5 · recovery =================
const Recover: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const prog = interpolate(f, [L(34), L(36)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="05 / RECOVERY" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(33.99)} size={76} color={C.g}>Back by the afternoon.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 110, top: 470}}>
        <Glass>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24}}>
            <span style={{color: C.bug}}>~7:08 AM down</span><span style={{color: C.g}}>~12:50 PM most recovering</span>
          </div>
          <div style={{marginTop: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,.08)", overflow: "hidden"}}>
            <div style={{width: `${prog * 100}%`, height: "100%", background: `linear-gradient(90deg, ${C.bug}, ${C.g})`}} />
          </div>
        </Glass>
      </div>
      {f > L(36.1) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 680, opacity: out(f, L(36.27), L(36.7))}}>
          <Glass glow={C.g}>
            <div style={{...label, color: C.g}}>REVOLUT SAID</div>
            <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 800, marginTop: 10, lineHeight: 1.15}}>
              {f > L(38.2) ? <>Customers' <Marker at={L(38.4)}>money and data</Marker> are safe.</> : "…"}
            </div>
          </Glass>
        </div>
      ) : null}
      {/* outage vs hack, as two solid tiles */}
      <div style={{position: "absolute", left: 0, right: 0, top: 1050, display: "flex", justifyContent: "center", gap: 40}}>
        <div style={{opacity: out(f, L(40.34), L(40.7))}}>
          <Slab w={330} h={220} d={70} rx={-10} ry={14 + Math.sin(f / 40) * 5} color="#1E2A22" glow={C.g}
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}><div style={{...big(64, C.g)}}>OUTAGE ✓</div></div>} />
        </div>
        <div style={{opacity: out(f, L(41.31), L(41.6))}}>
          <Slab w={330} h={220} d={70} rx={-10} ry={-14 + Math.sin(f / 40) * 5} color="#1F2024"
            front={<div style={{width: "100%", height: "100%", display: "grid", placeItems: "center"}}><div style={{...big(64, C.dim), textDecoration: "line-through"}}>HACK</div></div>} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ================= 6 · lesson + CTA =================
const Lesson: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const fail = f >= L(43.4);
  const sway = Math.sin(f / 45) * 6;
  return (
    <AbsoluteFill>
      <Section text="06 / THE LESSON" />
      <div style={{position: "absolute", left: 64, right: 110, top: 320}}>
        <Reveal at={L(42.57)} size={80}>Keep a backup region.</Reveal>
      </div>
      {/* failover: primary goes dark, traffic hops to the backup */}
      <div style={{position: "absolute", left: 30, right: 60, top: 520, display: "flex", justifyContent: "space-around", alignItems: "flex-end"}}>
        <div style={{transform: "scale(.78)", transformOrigin: "50% 100%"}}><Building lit={fail ? 0 : 1} ry={16 + sway} name={fail ? "primary ⚡" : "primary"} seed={6} /></div>
        <div style={{transform: "scale(.78)", transformOrigin: "50% 100%"}}><Building lit={1} tone={C.g} ry={-16 + sway} name="backup" seed={7} /></div>
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: 1060, textAlign: "center", fontFamily: MONO, fontSize: 32, color: fail ? C.g : C.dim}}>
        {fail ? "traffic → backup ✓  app stays up" : "📱 traffic → primary"}
      </div>
      {f > L(44.5) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1150, ...big(54, C.text), opacity: out(f, L(44.64), L(45))}}>
          Don't run a business <span style={{color: C.bug}}>from one building.</span>
        </div>
      ) : null}
      {f > L(46.3) ? (
        <div style={{position: "absolute", left: 64, right: 110, top: 1320, opacity: out(f, L(46.46), L(46.9)), transform: `translateY(${(1 - out(f, L(46.46), L(46.9))) * 30}px)`}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>REAL OUTAGES, BROKEN DOWN</div>
            <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(47.2), 40)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 110, top: 1530, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(45), L(45.4))}}>source: Tom's Guide live coverage · Google Cloud status (20 Oct 2026)</div>
    </AbsoluteFill>
  );
};

// persistent incident strip along the bottom
const Status: React.FC = () => {
  const f = useCurrentFrame();
  const ok = f >= T(33.99);
  const col = ok ? C.g : C.bug;
  return (
    <div style={{position: "absolute", left: 64, right: 110, top: 1670, height: 72, borderRadius: 20, display: "flex", alignItems: "center", gap: 16, padding: "0 22px", background: "rgba(255,255,255,.05)", border: `1.5px solid ${col}66`, backdropFilter: "blur(18px)", opacity: out(f, 8, 20)}}>
      <span style={{width: 14, height: 14, borderRadius: 7, background: col, boxShadow: `0 0 0 ${4 + (f % 30) / 4}px ${col}33`}} />
      <span style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.1em", color: col}}>{ok ? "RECOVERING" : "INCIDENT"}</span>
      <span style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>europe-west2 · power event</span>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Region, Fallout, Why, Recover, Lesson];

export const DebugDiaries011: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E11_TOTAL;
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
    <Status />
    <Hud ep="011" total={E11_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
