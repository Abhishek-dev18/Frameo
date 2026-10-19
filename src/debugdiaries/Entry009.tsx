// Debug Diaries · Entry 009 "SlugFest" — npm trusted publishing trusted a repo's NAME, not its permanent ID.
// Facts (The Hacker News / Help Net Security, Oct 2026): npm matched the repo slug (owner/repo) and ignored the numeric
// repo ID until the first successful publish → a renamed/deleted, never-published repo's slug could be re-created by an
// attacker to publish. 1,500+ packages, 10M+ downloads. Found by Bloom Security; GitHub fix (2 Oct 2026): bind to the
// immutable repo ID, unvalidated configs expire after 48h. No in-the-wild exploitation reported.
// Visual kit: liquid-glass cards, spotlight glows, grain, highlighter swipes, masked kinetic text, camera push, bento recap,
// 3D card flips between scenes. Timed to the Hinglish Sarvam voice (content/debug-diaries/009/voice.wav).
import React from "react";
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp, out, typed, Hud, Section, Cut, Card3D} from "./cine";
import {GlassBg, Grain, Glass, Marker, Reveal, Push, LiveChip} from "./glass";

const T = (s: number) => Math.round(s * 30);
const CUTS = [0, 9.54, 18.33, 28.14, 39.06, 50.96].map(T);
export const E9_TOTAL = T(59.02) + 12;

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "78%", fontSize: size, lineHeight: 1, color});
const label: React.CSSProperties = {fontFamily: MONO, fontSize: 22, letterSpacing: "0.14em", color: C.dim};
const ease3 = Easing.inOut(Easing.cubic);
const count = (f: number, a: number, b: number, to: number) => Math.round(interpolate(f, [a, b], [0, to], {...clamp, easing: Easing.out(Easing.cubic)}));

// a GitHub-style repo header card
const RepoCard: React.FC<{name: string; owner?: string; tone?: string; style?: React.CSSProperties; caret?: boolean}> = ({name, owner = "acme", tone = C.text, style, caret}) => {
  const f = useCurrentFrame();
  return (
    <Glass style={{padding: "18px 24px", ...style}}>
      <div style={{display: "flex", alignItems: "center", gap: 14, fontFamily: MONO, fontSize: 34}}>
        <svg width={34} height={34} viewBox="0 0 16 16"><path fill={C.dim} d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8ZM5 12.25a.25.25 0 0 1 .25-.25h3.5a.25.25 0 0 1 .25.25v3.25a.25.25 0 0 1-.4.2l-1.45-1.087a.249.249 0 0 0-.3 0L5.4 15.7a.25.25 0 0 1-.4-.2Z" /></svg>
        <span style={{color: C.dim}}>{owner} /</span>
        <span style={{color: tone, fontWeight: 700}}>{name}{caret && Math.floor(f / 8) % 2 ? "|" : ""}</span>
      </div>
    </Glass>
  );
};

// ===================== 1 · hook =====================
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  // rename: "ui-kit" → backspace → "ui-kit-v2"
  const r0 = T(0.5), r1 = T(1.1), r2 = T(1.6);
  const nm = f < r0 ? "ui-kit" : f < r1 ? "ui-kit".slice(0, Math.max(0, 6 - Math.floor((f - r0) / 2))) : f < r2 ? typed("ui-kit-v2", f, r1, 40) : "ui-kit-v2";
  const ghost = out(f, T(1.6), T(2.2));
  const thief = out(f, T(2.24), T(2.9));
  const pk = count(f, T(5.63), T(6.6), 1500);
  const dl = count(f, T(7.23), T(8.2), 1);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 258}}><LiveChip text="TRENDING · OCT 2026" /></div>
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Reveal at={-30} size={90}>You renamed a repo.</Reveal>
        {f > T(2.1) ? <Reveal at={T(2.24)} size={90} color={C.bug} style={{marginTop: 8}}>Someone else could publish.</Reveal> : null}
      </div>
      {/* your repo, renamed */}
      <div style={{position: "absolute", left: 64, right: 150, top: 640, perspective: 1200}}>
        <div style={{transform: "rotateX(10deg) rotateY(-8deg)"}}>
          <div style={{...label, marginBottom: 10}}>YOUR REPO</div>
          <RepoCard name={nm} caret={f >= r0 && f < r2 + 10} />
        </div>
      </div>
      {/* the old name, now free… and the stranger who takes it */}
      {ghost > 0 ? (
        <div style={{position: "absolute", left: 64 + thief * 260, top: 860 + ghost * 60, width: 520, perspective: 1000, transform: `rotate(${(1 - thief) * -3}deg)`}}>
          <div style={{transform: `rotateY(${-14 + thief * 10}deg)`, opacity: ghost}}>
            <div style={{border: `2px dashed ${thief > 0.5 ? C.bug : C.dim}`, borderRadius: 30, padding: 4}}>
              <RepoCard name="ui-kit" owner={thief > 0.5 ? "acme" : "acme"} tone={thief > 0.5 ? C.bug : C.dim} style={{background: thief > 0.5 ? `${C.bug}14` : undefined}} />
            </div>
            <div style={{fontFamily: MONO, fontSize: 24, color: thief > 0.5 ? C.bug : C.dim, marginTop: 10}}>{thief > 0.5 ? "🥷 claimed by a stranger" : "old name · now free"}</div>
          </div>
        </div>
      ) : null}
      {/* bottom: the scale */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1200, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18}}>
        <Glass style={{opacity: out(f, T(5.5), T(5.9))}}>
          <div style={label}>PACKAGES</div>
          <div style={big(92, C.text)}>{pk.toLocaleString("en-IN")}+</div>
        </Glass>
        <Glass style={{opacity: out(f, T(7.1), T(7.5))}}>
          <div style={label}>DOWNLOADS</div>
          <div style={big(92, C.text)}>{dl} crore+</div>
        </Glass>
      </div>
      {f > T(8.7) ? (
        <div style={{position: "absolute", left: 64, top: 1430, ...big(84, C.bug)}}><Marker at={T(8.81)} color={C.bug}>ALL AT RISK.</Marker></div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 2 · trusted publishing =====================
const Trusted: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const tok = interpolate(f, [L(11.6), L(14.0)], [0, 1], {...clamp, easing: ease3});
  const nodes: [string, string, string][] = [["⚙️", "GitHub Actions", "builds your package"], ["🎫", "OIDC token", "short-lived, no secret"], ["📦", "npm registry", "publishes it"]];
  return (
    <AbsoluteFill>
      <Section text="02 / TRUSTED PUBLISHING" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Reveal at={L(9.6)} size={84}>No password.</Reveal>
        <Reveal at={L(11.38)} size={84} color={C.g} style={{marginTop: 6}}>Just a token.</Reveal>
      </div>
      {/* 3D pipeline receding into depth */}
      <div style={{position: "absolute", left: 64, right: 150, top: 560, height: 520, perspective: 1100}}>
        <div style={{position: "absolute", inset: 0, transform: "rotateX(32deg) rotateY(-14deg)", transformStyle: "preserve-3d"}}>
          {nodes.map(([ic, t, d], i) => (
            <div key={t} style={{position: "absolute", left: i * 200, top: 20 + i * 150, width: 440, opacity: out(f, L(9.7) + i * 6, L(10.1) + i * 6)}}>
              <Glass glow={i === 2 && tok >= 1 ? C.g : undefined}>
                <div style={{display: "flex", alignItems: "center", gap: 16}}>
                  <span style={{fontSize: 60}}>{ic}</span>
                  <div>
                    <div style={{fontFamily: SANS, fontSize: 40, fontWeight: 800}}>{t}</div>
                    <div style={{fontFamily: MONO, fontSize: 24, color: C.dim}}>{d}</div>
                  </div>
                </div>
              </Glass>
            </div>
          ))}
          {/* the token travelling */}
          {tok > 0 && tok < 1 ? <div style={{position: "absolute", left: 160 + tok * 420, top: 90 + tok * 300, fontSize: 64, filter: `drop-shadow(0 0 20px ${C.g})`}}>🎫</div> : null}
        </div>
      </div>
      <div style={{position: "absolute", left: 64, top: 1060, opacity: out(f, L(13.6), L(14.0))}}>
        <span style={{padding: "10px 18px", borderRadius: 14, border: `2px solid ${C.g}`, fontFamily: MONO, fontSize: 26, color: C.g}}>no stored password ✓</span>
      </div>
      {/* npm's one question */}
      {f > L(14.7) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1170, perspective: 1000}}>
          <div style={{transform: `rotateX(${interpolate(f, [L(14.87), L(15.4)], [70, 0], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%"}}>
            <Glass glow={C.g}>
              <div style={{...label, color: C.g}}>NPM CHECKS ONE THING</div>
              <div style={{fontFamily: SANS, fontSize: 52, fontWeight: 900, marginTop: 10}}>
                {f > L(16.6) ? <>"Which <Marker at={L(16.8)}>repo</Marker> sent this?"</> : "…"}
              </div>
            </Glass>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 3 · the bug: name, not ID =====================
const Bug: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const wob = Math.sin(f / 26) * 3;
  const lockOpen = f > L(24.47);
  const prog = interpolate(f, [L(26.63), L(27.9)], [0, 1], {...clamp, easing: ease3});
  return (
    <AbsoluteFill>
      <Section text="03 / THE BUG" />
      <div style={{position: "absolute", left: 64, top: 330, ...big(84, C.text)}}>
        NPM CHECKED THE {f > L(19.2) ? <Marker at={L(19.3)} color={C.bug}><span style={{color: C.bug}}>NAME.</span></Marker> : "…"}
      </div>
      {/* the repo's ID card, tilted */}
      <div style={{position: "absolute", left: 80, right: 170, top: 470, perspective: 1200}}>
        <div style={{transform: `rotateY(${-12 + wob}deg) rotateX(8deg)`}}>
          <Glass style={{padding: "26px 30px"}}>
            <div style={{display: "flex", justifyContent: "space-between"}}><span style={label}>REPO IDENTITY</span><span style={{fontSize: 34}}>🪪</span></div>
            <div style={{marginTop: 20, fontFamily: MONO, fontSize: 32}}>
              <div style={{display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1.5px solid rgba(255,255,255,.1)"}}>
                <span style={{color: C.dim}}>name</span>
                <span style={{color: C.bug}}>{f > L(21.6) ? <Marker at={L(21.7)} color={C.bug}>acme/ui-kit</Marker> : "acme/ui-kit"}</span>
              </div>
              {f > L(21.9) ? <div style={{textAlign: "right", fontSize: 22, color: C.bug, marginTop: 6, opacity: out(f, L(21.9), L(22.2))}}>↑ npm checks THIS</div> : null}
              <div style={{display: "flex", justifyContent: "space-between", padding: "14px 0", marginTop: 8}}>
                <span style={{color: C.dim}}>repo_id</span>
                <span style={{color: C.dim, textDecoration: f > L(22.95) ? "line-through" : "none"}}>7319 0425</span>
              </div>
              {f > L(23.1) ? <div style={{textAlign: "right", fontSize: 22, color: C.dim, opacity: out(f, L(23.1), L(23.4))}}>↑ the permanent one… ignored</div> : null}
            </div>
          </Glass>
        </div>
      </div>
      {/* open padlock */}
      <svg width={170} height={200} style={{position: "absolute", left: 455, top: 960, opacity: out(f, L(24.3), L(24.7))}}>
        <path d={lockOpen ? "M45 95 V60 A40 40 0 0 1 125 60 V40" : "M45 95 V60 A40 40 0 0 1 125 60 V95"} fill="none" stroke={C.bug} strokeWidth={14} strokeLinecap="round" style={{transform: `translateY(${lockOpen ? -14 : 0}px)`}} />
        <rect x={25} y={92} width={120} height={96} rx={18} fill={`${C.bug}33`} stroke={C.bug} strokeWidth={6} />
        <circle cx={85} cy={136} r={11} fill={C.bug} />
      </svg>
      {lockOpen ? <div style={{position: "absolute", left: 64, right: 150, top: 1170, textAlign: "center", fontFamily: MONO, fontSize: 28, color: C.bug, opacity: out(f, L(24.5), L(24.9))}}>ID not locked…</div> : null}
      {/* timeline: the ID locks only at first publish */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1250, opacity: out(f, L(26.4), L(26.8))}}>
        <Glass>
          <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24}}>
            <span style={{color: C.text}}>setup</span><span style={{color: C.bug}}>no publish yet</span><span style={{color: C.g}}>first publish 🔒</span>
          </div>
          <div style={{marginTop: 14, height: 14, borderRadius: 7, background: "rgba(255,255,255,.08)", position: "relative"}}>
            <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 7, background: `linear-gradient(90deg, ${C.bug}, ${C.g})`}} />
          </div>
          <div style={{fontFamily: SANS, fontSize: 30, fontWeight: 700, marginTop: 14}}>until then: <span style={{color: C.bug}}>name = identity</span></div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 4 · the attack, step by step =====================
const STEPS: [string, string, string, number][] = [
  ["you", "set up trusted publishing", C.text, 28.18],
  ["you", "rename repo · never published", C.text, 31.04],
  ["🥷 attacker", "creates acme/ui-kit", C.bug, 33.16],
  ["npm", "name matches ✓", C.bug, 35.62],
  ["🥷 attacker", "gets the publish key 🔑", C.bug, 37.14],
];
const Attack: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const drop = interpolate(f, [L(37.5), L(38.4)], [-260, 0], {...clamp, easing: Easing.out(Easing.bounce)});
  return (
    <AbsoluteFill>
      <Section text="04 / THE ATTACK" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Reveal at={L(28.2)} size={80}>Same name. New owner.</Reveal>
      </div>
      {/* stacked 3D step cards */}
      <div style={{position: "absolute", left: 64, right: 150, top: 450, perspective: 1300}}>
        <div style={{transform: "rotateX(16deg) rotateY(-10deg)", display: "grid", gap: 14}}>
          {STEPS.map(([who, what, col, at], i) => {
            const a = L(at);
            const p = out(f, a, a + 10);
            return (
              <div key={i} style={{opacity: p, transform: `translateX(${(1 - p) * 120}px) translateZ(${(1 - p) * 200}px)`}}>
                <Glass glow={i >= 3 && p > 0.9 ? C.bug : undefined} style={{padding: "16px 22px", display: "flex", alignItems: "center", gap: 18}}>
                  <span style={{width: 50, height: 50, flex: "0 0 50px", borderRadius: 25, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 24, fontWeight: 700, background: col === C.bug ? `${C.bug}33` : "rgba(255,255,255,.08)", color: col}}>{i + 1}</span>
                  <div>
                    <div style={{fontFamily: MONO, fontSize: 20, color: C.dim}}>{who}</div>
                    <div style={{fontFamily: SANS, fontSize: 32, fontWeight: 700, color: col}}>{what}</div>
                  </div>
                </Glass>
              </div>
            );
          })}
        </div>
      </div>
      {/* npm registry shelf: a poisoned version drops in */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1240, opacity: out(f, L(36.8), L(37.2))}}>
        <div style={label}>NPM REGISTRY · acme/ui-kit</div>
        <div style={{display: "flex", alignItems: "flex-end", gap: 14, marginTop: 14, height: 150, borderBottom: "4px solid rgba(255,255,255,.15)"}}>
          {["1.4.0", "1.5.0", "2.0.0"].map((v) => (
            <div key={v} style={{width: 150, height: 110, borderRadius: 16, background: "rgba(255,255,255,.06)", border: "1.5px solid rgba(255,255,255,.14)", display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 26, color: C.dim}}>{v}</div>
          ))}
          {f > L(37.4) ? (
            <div style={{width: 190, height: 130, borderRadius: 16, background: `${C.bug}26`, border: `3px solid ${C.bug}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 28, color: C.bug, transform: `translateY(${drop}px)`, boxShadow: `0 0 40px ${C.bug}66`}}>⚠️ 2.0.1</div>
          ) : null}
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ===================== 5 · the fix =====================
const Fix: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const left = interpolate(f, [L(45.9), L(47.6)], [48 * 3600, 0], {...clamp, easing: Easing.in(Easing.quad)});
  const hh = String(Math.floor(left / 3600)).padStart(2, "0"), mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0"), ss = String(Math.floor(left % 60)).padStart(2, "0");
  const ring = 1 - left / (48 * 3600);
  const R = 92, CIRC = 2 * Math.PI * R;
  return (
    <AbsoluteFill>
      <Section text="05 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Reveal at={L(39.12)} size={70}>Found by Bloom Security.</Reveal>
        <Reveal at={L(40.6)} size={70} color={C.g} style={{marginTop: 6}}>Fixed by GitHub.</Reveal>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 540, perspective: 1100, opacity: out(f, L(41.7), L(42.1))}}>
        <div style={{transform: `rotateX(${interpolate(f, [L(41.87), L(42.4)], [60, 6], {...clamp, easing: ease3})}deg)`, transformOrigin: "50% 0%"}}>
          <Glass glow={C.g}>
            <div style={{...label, color: C.g}}>NPM NOW CHECKS</div>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: 16, fontFamily: MONO, fontSize: 34}}>
              <span style={{color: C.dim, textDecoration: "line-through"}}>name</span>
              <span style={{color: C.g}}><Marker at={L(42.6)}>repo_id 🔒</Marker></span>
            </div>
            <div style={{fontFamily: SANS, fontSize: 28, color: C.text, marginTop: 10}}>the permanent ID, which never changes</div>
          </Glass>
        </div>
      </div>
      {/* 48h expiry ring */}
      <div style={{position: "absolute", left: 64, right: 150, top: 880, display: "flex", alignItems: "center", gap: 34, opacity: out(f, L(44.2), L(44.6))}}>
        <svg width={220} height={220} style={{transform: "perspective(600px) rotateX(16deg)"}}>
          <circle cx={110} cy={110} r={R} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={18} />
          <circle cx={110} cy={110} r={R} fill="none" stroke={C.bug} strokeWidth={18} strokeLinecap="round" strokeDasharray={`${CIRC * ring} ${CIRC}`} transform="rotate(-90 110 110)" />
          <text x={110} y={104} textAnchor="middle" fill={C.text} fontFamily={MONO} fontSize={30}>{hh}:{mm}</text>
          <text x={110} y={140} textAnchor="middle" fill={C.dim} fontFamily={MONO} fontSize={22}>:{ss}</text>
        </svg>
        <div>
          <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800}}>Setup without a publish?</div>
          <div style={{fontFamily: MONO, fontSize: 28, color: left <= 0 ? C.bug : C.dim, marginTop: 8}}>{left <= 0 ? "expired after 48h ✕" : "expires in 48h"}</div>
        </div>
      </div>
      {/* disclosure timeline */}
      <div style={{position: "absolute", left: 64, right: 150, top: 1420, opacity: out(f, L(40.7), L(41.1))}}>
        <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 24}}>
          <span style={{color: C.bug}}>● reported · 6 Jun 2026</span><span style={{color: C.g}}>fixed · 2 Oct 2026 ●</span>
        </div>
        <div style={{marginTop: 12, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${C.bug}, ${C.g})`, transformOrigin: "0 50%", transform: `scaleX(${interpolate(f, [L(40.7), L(41.8)], [0, 1], {...clamp, easing: ease3})})`}} />
      </div>
      {/* good news */}
      {f > L(48.6) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1180, perspective: 1000}}>
          <div style={{transform: `rotateY(${interpolate(f, [L(48.73), L(49.3)], [70, 0], {...clamp, easing: ease3})}deg)`}}>
            <Glass glow={C.g} style={{display: "flex", alignItems: "center", gap: 22}}>
              <span style={{fontSize: 64}}>🛡️</span>
              <div>
                <div style={{...label, color: C.g}}>GOOD NEWS</div>
                <div style={{fontFamily: SANS, fontSize: 36, fontWeight: 800, marginTop: 4}}>No real-world attacks reported</div>
              </div>
            </Glass>
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ===================== 6 · rule: bento recap =====================
const Rule: React.FC<{off: number}> = ({off}) => {
  const f = useCurrentFrame();
  const L = (s: number) => T(s) - off;
  const tile = (i: number, node: React.ReactNode, style: React.CSSProperties, glow?: string) => {
    const at = L(52.0) + i * 4;
    const p = out(f, at, at + 10);
    return (
      <div style={{...style, opacity: p, transform: `perspective(900px) rotateX(${(1 - p) * 50}deg) translateY(${(1 - p) * 40}px)`}}>
        <Glass glow={glow} style={{height: "100%", boxSizing: "border-box"}}>{node}</Glass>
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Section text="06 / THE RULE" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Reveal at={L(51.05)} size={78}>Identify by ID,</Reveal>
        <Reveal at={L(52.3)} size={78} color={C.g} style={{marginTop: 4}}>not by name.</Reveal>
      </div>
      {/* bento grid */}
      <div style={{position: "absolute", left: 64, right: 150, top: 560, height: 640, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr 1fr", gap: 16}}>
        {tile(0, <><div style={label}>NAMES CHANGE</div><div style={{...big(64, C.bug), marginTop: 10}}>{f > L(53.91) ? "acme/ui-kit → ?" : ""}</div></>, {gridColumn: "1 / 3"}, f > L(53.91) ? C.bug : undefined)}
        {tile(1, <><div style={label}>USER</div><div style={{fontFamily: MONO, fontSize: 30, color: C.g, marginTop: 10}}>user_id</div></>, {})}
        {tile(2, <><div style={label}>REPO</div><div style={{fontFamily: MONO, fontSize: 30, color: C.g, marginTop: 10}}>repo_id</div></>, {})}
        {tile(3, <><div style={label}>FILE</div><div style={{fontFamily: MONO, fontSize: 30, color: C.g, marginTop: 10}}>content hash</div></>, {})}
        {tile(4, <><div style={label}>IDS DON'T</div><div style={{...big(64, C.g), marginTop: 10}}>{f > L(54.79) ? "7319 0425 ✓" : ""}</div></>, {}, f > L(54.79) ? C.g : undefined)}
      </div>
      {f > L(55.3) ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1230, opacity: out(f, L(55.3), L(55.8)), transform: `translateY(${(1 - out(f, L(55.3), L(55.8))) * 30}px)`}}>
          <Glass style={{borderLeft: `8px solid ${C.bug}`}}>
            <div style={label}>TRENDING BUGS, EXPLAINED</div>
            <div style={{fontFamily: SANS, fontSize: 42, fontWeight: 800, marginTop: 6}}>Fresh from <span style={{color: C.bug}}>this week's</span> news</div>
            <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 10}}>{typed("follow @debugdiaries.io", f, L(57.4), 40)}</div>
          </Glass>
        </div>
      ) : null}
      <div style={{position: "absolute", left: 64, right: 150, top: 1480, fontFamily: MONO, fontSize: 20, color: C.dim, opacity: out(f, L(55.6), L(56))}}>source: The Hacker News · Help Net Security (Oct 2026)</div>
    </AbsoluteFill>
  );
};

// bottom news ticker (persistent, trending "breaking" strip)
const TICK = "SLUGFEST  ✦  NPM TRUSTED PUBLISHING  ✦  1,500+ PACKAGES  ✦  10M+ DOWNLOADS  ✦  NAME ≠ IDENTITY  ✦  FIXED BY GITHUB  ✦  ";
const Ticker: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, right: 150, top: 1650, height: 74, borderRadius: 22, overflow: "hidden", display: "flex", alignItems: "center", background: "rgba(255,255,255,.05)", border: "1.5px solid rgba(255,255,255,.12)", backdropFilter: "blur(18px)", opacity: out(f, 6, 20)}}>
      <div style={{flex: "0 0 auto", height: "100%", display: "flex", alignItems: "center", padding: "0 20px", background: C.bug, color: "#121316", fontFamily: MONO, fontWeight: 700, fontSize: 24, letterSpacing: "0.12em", zIndex: 1}}>LIVE</div>
      <div style={{whiteSpace: "nowrap", fontFamily: MONO, fontSize: 26, letterSpacing: "0.1em", color: C.dim, transform: `translateX(${-((f * 3) % (TICK.length * 26 * 0.7))}px)`, paddingLeft: 24}}>{TICK + TICK + TICK}</div>
    </div>
  );
};

const COMPS: React.FC<{off: number}>[] = [() => <Hook />, Trusted, Bug, Attack, Fix, Rule];

export const DebugDiaries009: React.FC = () => (
  <AbsoluteFill style={{background: "#121316", color: C.text}}>
    <GlassBg />
    {COMPS.map((Comp, i) => {
      const a = CUTS[i];
      const b = i + 1 < CUTS.length ? CUTS[i + 1] : E9_TOTAL;
      return (
        <Sequence key={i} from={a} durationInFrames={b - a}>
          <Card3D len={b - a} first={i === 0} last={i === COMPS.length - 1}>
            <Push len={b - a}>
              <Comp off={a} />
            </Push>
          </Card3D>
        </Sequence>
      );
    })}
    {CUTS.slice(1).map((a) => <Cut key={a} at={a} />)}
    <Ticker />
    <Hud ep="009" total={E9_TOTAL} />
    <Grain />
  </AbsoluteFill>
);
