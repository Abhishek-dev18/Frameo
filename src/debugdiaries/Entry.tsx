// Debug Diaries — animated entry (minimal theme: grey, white, mint green, coral for bugs).
// 1080x1920 · 30fps · 24s. Content comes from props, so a new entry is just data:
//   npx remotion render src/index.ts DebugDiaries out/entry.mp4 --props=content/debug-diaries/002.json
//
// v2 (after Entry #001 insights: avg watch 9.7s, drop at the first scene change):
//  - the hook is fully on screen from frame 0 (no empty opening)
//  - scenes cross-fade into each other, never through an empty screen
//  - 24s instead of 30s, tighter pacing
import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

// ---------- theme ----------
const C = {bg: "#161719", card: "#1D1E21", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";

// ---------- content ----------
export type EntryProps = {
  n: string;
  handle: string;
  bug: {file: string; time: string; lead: string; headline: string; symptom: string; flow: [string, string, string]; log: string; logCount?: string};
  cause: {file: string; code: string[]; mark: string; compareTitle?: string; symbol?: string; left: [string, string, string]; right: [string, string, string]};
  fix: {minus: string; plus: string};
  lesson: {line1: string; line2: string; word: string; checks: string[]; next: string; nextWord: string};
};
export const ENTRY_001: EntryProps = {
  n: "001",
  handle: "@debugdiaries.io",
  bug: {file: "incident.log", time: "03:12", lead: "Users keep getting", headline: "LOGGED OUT.", symptom: "Login → kicked out in 0.6s", flow: ["user", "auth", "logout"], log: "10,412 users logged out"},
  cause: {file: "session.js", code: ["if (token.exp < Date.now())", "  logout();"], mark: "Date.now()", compareTitle: "two clocks", symbol: "≠", left: ["token.exp", "sec", "1735689600"], right: ["Date.now()", "ms", "1735689600000"]},
  fix: {minus: "token.exp < Date.now()", plus: "token.exp * 1000 < Date.now()"},
  lesson: {line1: "Always check", line2: "your", word: "units.", checks: ["fix deployed", "0 logouts since"], next: "The cache that", nextWord: "lied"},
};
export const ENTRY_002: EntryProps = {
  n: "002",
  handle: "@debugdiaries.io",
  bug: {file: "support.log", time: "18:40", lead: "Users are seeing", headline: "WRONG USER.", symptom: "Open profile → wrong account", flow: ["user", "CDN", "leak"], log: "1,208 users saw others' data"},
  cause: {file: "api/me.js", code: ['res.set("Cache-Control", "public")', "res.json(currentUser);"], mark: "public", compareTitle: "what the CDN did", symbol: "→", left: ["Alice: GET /me", "A", "CDN saves Alice"], right: ["Bob: GET /me", "A", "Bob gets Alice"]},
  fix: {minus: 'Cache-Control: "public"', plus: 'Cache-Control: "private, no-store"'},
  lesson: {line1: "Never cache", line2: "user", word: "data.", checks: ["CDN cache purged", "each user sees only theirs"], next: "The retry that", nextWord: "DDoSed us"},
};

// ---------- timing (frames @30fps) ----------
const S1 = 0; // the bug       0.0s – 8.0s
const S2 = 240; // cause + fix 8.0s – 18.0s
const S3 = 540; // lesson     18.0s – 24.0s
const XF = 10; // cross-fade frames between scenes
export const DD_TOTAL = 720;

// ---------- helpers ----------
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const useIn = (at: number, damping = 18) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, mass: 0.7}});
};
const typed = (text: string, f: number, at: number, cps = 40) => text.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));

const Grid: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.025) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.025) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
);

const Header: React.FC<{n: string; handle: string}> = ({n, handle}) => (
  <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
    <span>DEBUG DIARIES · <span style={{color: C.g}}>{n}</span></span>
    <span style={{letterSpacing: "0.04em"}}>{handle}</span>
  </div>
);

// Section label; `instant` shows it fully from the first frame.
const Section: React.FC<{n: string; label: string; top: number; at: number; instant?: boolean}> = ({n, label, top, at, instant}) => {
  const f = useCurrentFrame();
  const w = instant ? 70 : interpolate(f, [at, at + 10], [0, 70], {...clamp, easing: Easing.out(Easing.cubic)});
  const text = `${n} / ${label}`;
  return (
    <div style={{position: "absolute", left: 64, top, display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 36, letterSpacing: "0.16em", color: C.g}}>
      <span style={{width: w, height: 4, background: C.g}} />
      <span>{instant ? text : typed(text, f, at + 4, 70)}</span>
    </div>
  );
};

const Card: React.FC<{top: number; at: number; left?: number; right?: number; title?: string; tag?: string; tagColor?: string; strong?: string; children: React.ReactNode}> = ({top, at, left = 64, right = 150, title, tag, tagColor = C.g, strong, children}) => {
  const s = useIn(at);
  return (
    <div style={{position: "absolute", top, left, right, background: C.card, border: `2.5px solid ${strong || C.line}`, borderRadius: 26, boxShadow: "0 24px 60px rgba(0,0,0,.35)", overflow: "hidden", opacity: s, transform: `translateY(${(1 - s) * 50}px)`}}>
      {title ? (
        <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${C.line}`, background: "rgba(255,255,255,.02)"}}>
          {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 8, background: "#3A3C42"}} />)}
          <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: C.dim}}>{title}</span>
          {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: tagColor}}>● {tag}</span> : null}
        </div>
      ) : null}
      <div style={{padding: "26px 30px"}}>{children}</div>
    </div>
  );
};

// Scene wrapper: fades in over XF frames (unless first) and fades out over the XF frames after its end,
// so two scenes overlap briefly instead of passing through an empty screen.
const Scene: React.FC<{len: number; first?: boolean; last?: boolean; children: React.ReactNode}> = ({len, first, last, children}) => {
  const f = useCurrentFrame();
  const fin = first ? 1 : interpolate(f, [0, XF], [0, 1], clamp);
  const fout = last ? 1 : interpolate(f, [len, len + XF], [1, 0], clamp);
  const lift = last ? 0 : interpolate(f, [len, len + XF], [0, -30], clamp);
  return <AbsoluteFill style={{opacity: Math.min(fin, fout), transform: `translateY(${lift}px)`}}>{children}</AbsoluteFill>;
};

// ---------- diagram pieces ----------
const Phone: React.FC<{c: string}> = ({c}) => (
  <div style={{width: 76, height: 130, border: `4px solid ${c}`, borderRadius: 16, position: "relative"}}>
    <div style={{position: "absolute", inset: "12px 10px 26px", background: `${c}33`, borderRadius: 4}} />
    <div style={{position: "absolute", bottom: 9, left: "50%", width: 22, height: 4, marginLeft: -11, background: c, borderRadius: 2}} />
  </div>
);
const Server: React.FC<{c: string}> = ({c}) => (
  <div style={{width: 150, height: 120, border: `4px solid ${c}`, borderRadius: 16, display: "flex", flexDirection: "column"}}>
    {[0, 1].map((i) => (
      <div key={i} style={{flex: 1, borderTop: i ? `3px solid ${c}` : "none", display: "flex", alignItems: "center", gap: 14, padding: "0 16px"}}>
        <span style={{width: 14, height: 14, borderRadius: 7, background: c}} />
        <span style={{flex: 1, height: 4, background: `${c}88`, borderRadius: 2}} />
      </div>
    ))}
  </div>
);
const Cross: React.FC<{c: string; s: number}> = ({c, s}) => (
  <div style={{width: 130, height: 130, borderRadius: 24, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 70, fontWeight: 700, color: c, transform: `scale(${0.6 + s * 0.4})`, opacity: Math.max(0.15, s)}}>✕</div>
);
const Labeled: React.FC<{label: string; children: React.ReactNode; o?: number}> = ({label, children, o = 1}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 180, opacity: o}}>
    {children}
    <span style={{fontFamily: MONO, fontSize: 28, color: C.text, whiteSpace: "nowrap"}}>{label}</span>
  </div>
);
const Flow: React.FC<{c: string; p: number; loop?: number}> = ({c, p, loop = -1}) => (
  <div style={{flex: 1, height: 4, position: "relative", marginBottom: 46, background: C.line}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: c}} />
    {p >= 1 ? <div style={{position: "absolute", right: -2, top: -9, width: 0, height: 0, borderLeft: `18px solid ${c}`, borderTop: "11px solid transparent", borderBottom: "11px solid transparent"}} /> : null}
    {loop >= 0 ? <div style={{position: "absolute", top: -6, left: `calc(${loop * 100}% - 8px)`, width: 16, height: 16, borderRadius: 8, background: c}} /> : null}
  </div>
);
const Badge: React.FC<{c: string; text: string; s: number}> = ({c, text, s}) => (
  <div style={{width: 130, height: 130, borderRadius: 65, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700, color: c, transform: `scale(${s})`}}>{text}</div>
);

// ---------- scenes ----------
const TheBug: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const a1 = interpolate(f, [40, 60], [0, 1], clamp);
  const a2 = interpolate(f, [62, 82], [0, 1], clamp);
  const x = useIn(82, 11);
  const loop = f > 64 ? ((f - 64) % 36) / 36 : -1;
  const pulse = 1 + Math.max(0, Math.sin(f / 5)) * 0.03 * interpolate(f, [0, 40], [1, 0], clamp);
  return (
    <>
      <Section n="00" label="THE BUG" top={280} at={0} instant />
      {/* hook: fully visible from frame 0 */}
      <Card top={370} at={-30} left={190} right={190} title={e.bug.file} tag={e.bug.time} tagColor={C.bug}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>ON-CALL:</div>
        <div style={{fontSize: 40, fontWeight: 600, marginTop: 10, fontFamily: SANS}}>{e.bug.lead}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "80%", fontSize: 92, lineHeight: 1, color: C.bug, marginTop: 6, transform: `scale(${pulse})`, transformOrigin: "left center"}}>{e.bug.headline}</div>
      </Card>
      <Card top={790} at={18} title="what we see" tag="LIVE">
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.dim}}>SYMPTOM</div>
        <div style={{fontSize: 50, fontWeight: 800, marginTop: 6, fontFamily: SANS}}>{e.bug.symptom}</div>
        <div style={{display: "flex", alignItems: "flex-end", gap: 6, marginTop: 34}}>
          <Labeled label={e.bug.flow[0]}><Phone c={C.g} /></Labeled>
          <Flow c={C.g} p={a1} loop={loop} />
          <Labeled label={e.bug.flow[1]} o={interpolate(f, [48, 60], [0.3, 1], clamp)}><Server c={C.g} /></Labeled>
          <Flow c={C.bug} p={a2} />
          <Labeled label={e.bug.flow[2]}><Cross c={C.bug} s={x} /></Labeled>
        </div>
      </Card>
      <Card top={1290} at={110} title="prod — logs">
        <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.6}}>
          <div>
            <span style={{color: C.dim}}>[{e.bug.time}:42]</span> <span style={{color: C.bug}}>ERROR</span> {typed(e.bug.log, f, 120, 60)}
          </div>
          <div style={{opacity: interpolate(f, [175, 180], [0, 1], clamp)}}>
            <span style={{color: C.g}}>$</span> {typed("why", f, 182, 10)}
            <span style={{background: C.g, color: C.bg, opacity: Math.floor(f / 12) % 2 ? 1 : 0}}> </span>
          </div>
        </div>
      </Card>
    </>
  );
};

const CauseAndFix: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const line0 = e.cause.code[0];
  const idx = line0.indexOf(e.cause.mark);
  const before = idx >= 0 ? line0.slice(0, idx) : line0;
  const after = idx >= 0 ? line0.slice(idx + e.cause.mark.length) : "";
  const typedDone = 6 + (before.length / 70) * 30;
  const ring = interpolate(f, [42, 54], [0, 1], clamp);
  const c1 = useIn(72, 12);
  const c2 = useIn(84, 12);
  const sym = useIn(96, 10);
  const minus = interpolate(f, [180, 188], [0, 1], clamp);
  const strike = interpolate(f, [200, 212], [0, 100], clamp);
  const plus = useIn(212, 14);
  const fixed = f > 216;
  return (
    <>
      <Section n="01" label="ROOT CAUSE" top={280} at={0} />
      <Card top={370} at={-6} title={e.cause.file} tag="BUG" tagColor={C.bug}>
        <div style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.7, color: C.text, whiteSpace: "pre"}}>
          <div>
            {typed(before, f, 6, 70)}
            {f > typedDone && idx >= 0 ? (
              <span style={{position: "relative", color: ring > 0.5 ? C.bug : C.text}}>
                {e.cause.mark}
                <span style={{position: "absolute", inset: "-6px -12px", border: `4px solid ${C.bug}`, borderRadius: 40, opacity: ring, transform: `scale(${1.3 - ring * 0.3})`}} />
              </span>
            ) : null}
            {f > typedDone ? after : null}
          </div>
          <div style={{color: C.dim, opacity: interpolate(f, [30, 36], [0, 1], clamp)}}>{e.cause.code[1]}</div>
        </div>
      </Card>
      <Card top={700} at={62} title={e.cause.compareTitle || "compare"}>
        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-around"}}>
          <Labeled label={e.cause.left[0]}><Badge c={C.g} text={e.cause.left[1]} s={c1} /></Labeled>
          <div style={{fontFamily: MONO, fontSize: 64, color: C.bug, marginBottom: 80, transform: `scale(${sym})`}}>{e.cause.symbol || "≠"}</div>
          <Labeled label={e.cause.right[0]}><Badge c={C.bug} text={e.cause.right[1]} s={c2} /></Labeled>
        </div>
        <div style={{textAlign: "center", fontFamily: MONO, fontSize: 30, marginTop: 24, opacity: interpolate(f, [104, 112], [0, 1], clamp)}}>
          <span style={{color: C.g}}>{e.cause.left[2]}</span> <span style={{color: C.dim}}>→</span> <span style={{color: C.bug}}>{e.cause.right[2]}</span>
        </div>
      </Card>
      <Section n="02" label="THE FIX" top={1170} at={164} />
      <Card top={1250} at={172} title="git diff" tag={fixed ? "FIXED" : "EDITING"} tagColor={fixed ? C.g : C.dim} strong={fixed ? C.g : undefined}>
        <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.7, whiteSpace: "pre"}}>
          <div style={{color: C.bug, background: `${C.bug}1A`, margin: "0 -30px", padding: "0 30px", opacity: minus, position: "relative"}}>
            - {e.fix.minus}
            <span style={{position: "absolute", left: 60, top: "50%", height: 3, width: `calc(${strike}% - 90px)`, background: C.bug, opacity: 0.7}} />
          </div>
          <div style={{color: C.g, background: `${C.g}1F`, margin: "0 -30px", padding: "0 30px", opacity: plus, transform: `translateX(${(1 - plus) * 40}px)`}}>+ {e.fix.plus}</div>
        </div>
      </Card>
    </>
  );
};

const Lesson: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <>
      <Section n="03" label="LESSON" top={280} at={0} />
      <div style={{position: "absolute", left: 64, right: 150, top: 380, fontFamily: SANS, fontWeight: 900, fontStretch: "72%", textTransform: "uppercase", fontSize: 150, lineHeight: 0.9}}>
        {[[e.lesson.line1], [e.lesson.line2, e.lesson.word]].map((line, li) => (
          <div key={li} style={{display: "flex", gap: 34}}>
            {line.map((w, wi) => {
              const k = li * 2 + wi;
              const s = spring({frame: f - 4 - k * 6, fps, config: {damping: 16, mass: 0.6}});
              const isWord = li === 1 && wi === 1;
              return (
                <span key={wi} style={{display: "inline-block", overflow: "hidden", paddingBottom: 8}}>
                  <span style={{display: "inline-block", transform: `translateY(${(1 - s) * 105}%)`, color: isWord ? C.g : C.text}}>{w}</span>
                </span>
              );
            })}
          </div>
        ))}
      </div>
      <Card top={860} at={30} title="deploy.log" tag="OK">
        <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.7}}>
          {e.lesson.checks.map((c, i) => (
            <div key={c} style={{opacity: interpolate(f, [44 + i * 12, 50 + i * 12], [0, 1], clamp)}}>
              <span style={{color: C.g}}>✓</span> {c}
            </div>
          ))}
        </div>
      </Card>
      <Card top={1150} at={74}>
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.dim}}>NEXT ENTRY · {String(Number(e.n) + 1).padStart(3, "0")}</div>
        <div style={{fontSize: 56, fontWeight: 800, marginTop: 8, fontFamily: SANS}}>
          {e.lesson.next} <span style={{color: C.bug}}>{e.lesson.nextWord}</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 20}}>
          {typed(`follow ${e.handle}`, f, 96, 40)}
          <span style={{background: C.g, opacity: Math.floor(f / 12) % 2 ? 1 : 0}}>&nbsp;</span>
        </div>
      </Card>
    </>
  );
};

export const DebugDiariesEntry: React.FC<Partial<EntryProps>> = (props) => {
  const e = {...ENTRY_001, ...props} as EntryProps;
  return (
    <AbsoluteFill style={{background: C.bg, color: C.text, fontFamily: SANS}}>
      <Grid />
      <Header n={e.n} handle={e.handle} />
      <Sequence from={S1} durationInFrames={S2 - S1 + XF}><Scene len={S2 - S1} first><TheBug e={e} /></Scene></Sequence>
      <Sequence from={S2} durationInFrames={S3 - S2 + XF}><Scene len={S3 - S2}><CauseAndFix e={e} /></Scene></Sequence>
      <Sequence from={S3} durationInFrames={DD_TOTAL - S3}><Scene len={DD_TOTAL - S3} last><Lesson e={e} /></Scene></Sequence>
    </AbsoluteFill>
  );
};
