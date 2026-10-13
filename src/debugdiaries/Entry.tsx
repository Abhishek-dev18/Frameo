// Debug Diaries — animated entry (minimal theme: grey, white, mint green, coral for bugs).
// 1080x1920 · 30fps · 30s. Content comes from props (see ENTRY_001), so new entries are just JSON:
//   npx remotion render src/index.ts DebugDiaries out/entry-002.mp4 --props=entries/002.json
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
  bug: {file: string; time: string; lead: string; headline: string; symptom: string; flow: [string, string, string]; log: string};
  cause: {file: string; code: string[]; mark: string; left: [string, string, string]; right: [string, string, string]};
  fix: {minus: string; plus: string};
  lesson: {line1: string; line2: string; word: string; checks: string[]; next: string; nextWord: string};
};
export const ENTRY_001: EntryProps = {
  n: "001",
  handle: "@debugdiaries.io",
  bug: {file: "incident.log", time: "03:12", lead: "Users keep getting", headline: "LOGGED OUT.", symptom: "Login → kicked out in 0.6s", flow: ["user", "auth", "logout"], log: "10,412 users logged out"},
  cause: {file: "session.js", code: ["if (token.exp < Date.now())", "  logout();"], mark: "Date.now()", left: ["token.exp", "sec", "1735689600"], right: ["Date.now()", "ms", "1735689600000"]},
  fix: {minus: "token.exp < Date.now()", plus: "token.exp * 1000 < Date.now()"},
  lesson: {line1: "Always check", line2: "your", word: "units.", checks: ["fix deployed", "0 logouts since"], next: "The cache that", nextWord: "lied"},
};

// ---------- timing (frames) ----------
const S1 = 0; // the bug
const S2 = 300; // root cause + fix
const S3 = 640; // lesson
export const DD_TOTAL = 900;

// ---------- helpers ----------
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const useIn = (at: number, damping = 18) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, mass: 0.7}});
};
const typed = (text: string, f: number, at: number, cps = 40) => text.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));
const fadeOut = (f: number, end: number, len = 10) => interpolate(f, [end - len, end], [1, 0], clamp);

const Grid: React.FC = () => (
  <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.025) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.025) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
);

const Header: React.FC<{n: string; handle: string}> = ({n, handle}) => {
  const o = interpolate(useCurrentFrame(), [0, 12], [0, 1], clamp);
  return (
    <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim, opacity: o}}>
      <span>DEBUG DIARIES · <span style={{color: C.g}}>{n}</span></span>
      <span style={{letterSpacing: "0.04em"}}>{handle}</span>
    </div>
  );
};

const Section: React.FC<{n: string; label: string; top: number; at: number}> = ({n, label, top, at}) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [at, at + 12], [0, 70], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <div style={{position: "absolute", left: 64, top, display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 36, letterSpacing: "0.16em", color: C.g}}>
      <span style={{width: w, height: 4, background: C.g}} />
      <span>{typed(`${n} / ${label}`, f, at + 6, 60)}</span>
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
  <div style={{width: 130, height: 130, borderRadius: 24, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 70, fontWeight: 700, color: c, transform: `scale(${0.6 + s * 0.4})`, opacity: s}}>✕</div>
);
const Labeled: React.FC<{label: string; children: React.ReactNode; o?: number}> = ({label, children, o = 1}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 180, opacity: o}}>
    {children}
    <span style={{fontFamily: MONO, fontSize: 28, color: C.text}}>{label}</span>
  </div>
);
// arrow that draws itself, with a dot travelling along it
const Flow: React.FC<{c: string; p: number; loop?: number}> = ({c, p, loop = -1}) => (
  <div style={{flex: 1, height: 4, position: "relative", marginBottom: 46, background: C.line}}>
    <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${p * 100}%`, background: c}} />
    {p >= 1 ? <div style={{position: "absolute", right: -2, top: -9, width: 0, height: 0, borderLeft: `18px solid ${c}`, borderTop: "11px solid transparent", borderBottom: "11px solid transparent"}} /> : null}
    {loop >= 0 ? <div style={{position: "absolute", top: -6, left: `calc(${loop * 100}% - 8px)`, width: 16, height: 16, borderRadius: 8, background: c}} /> : null}
  </div>
);
const Clock: React.FC<{c: string; text: string; s: number}> = ({c, text, s}) => (
  <div style={{width: 130, height: 130, borderRadius: 65, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 30, fontWeight: 700, color: c, transform: `scale(${s})`}}>{text}</div>
);

// ---------- scenes ----------
const TheBug: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const head = useIn(26, 12);
  const a1 = interpolate(f, [100, 125], [0, 1], clamp);
  const a2 = interpolate(f, [130, 155], [0, 1], clamp);
  const x = useIn(155, 11);
  const loop = f > 160 ? ((f - 160) % 40) / 40 : -1;
  return (
    <AbsoluteFill style={{opacity: fadeOut(f, S2 - S1)}}>
      <Section n="00" label="THE BUG" top={280} at={4} />
      <Card top={370} at={14} left={190} right={190} title={e.bug.file} tag={e.bug.time} tagColor={C.bug}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>ON-CALL:</div>
        <div style={{fontSize: 40, fontWeight: 600, marginTop: 10, fontFamily: SANS}}>{e.bug.lead}</div>
        <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "80%", fontSize: 92, lineHeight: 1, color: C.bug, marginTop: 6, transform: `scale(${0.8 + head * 0.2})`, transformOrigin: "left center", opacity: head}}>{e.bug.headline}</div>
      </Card>
      <Card top={790} at={70} title="what we see" tag="LIVE">
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.dim}}>SYMPTOM</div>
        <div style={{fontSize: 52, fontWeight: 800, marginTop: 6, fontFamily: SANS}}>{e.bug.symptom}</div>
        <div style={{display: "flex", alignItems: "flex-end", gap: 6, marginTop: 34}}>
          <Labeled label={e.bug.flow[0]}><Phone c={C.g} /></Labeled>
          <Flow c={C.g} p={a1} loop={f > 160 ? loop : -1} />
          <Labeled label={e.bug.flow[1]} o={interpolate(f, [110, 125], [0.25, 1], clamp)}><Server c={C.g} /></Labeled>
          <Flow c={C.bug} p={a2} />
          <Labeled label={e.bug.flow[2]}><Cross c={C.bug} s={x} /></Labeled>
        </div>
      </Card>
      <Card top={1290} at={190} title="prod — auth-service">
        <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.6}}>
          <div style={{opacity: interpolate(f, [205, 210], [0, 1], clamp)}}>
            <span style={{color: C.dim}}>[03:12:42]</span> <span style={{color: C.bug}}>ERROR</span> {typed(e.bug.log, f, 210, 50)}
          </div>
          <div style={{opacity: interpolate(f, [245, 250], [0, 1], clamp)}}>
            <span style={{color: C.g}}>$</span> {typed("why", f, 252, 8)}
            <span style={{background: C.g, color: C.bg, opacity: Math.floor(f / 15) % 2 ? 1 : 0}}> </span>
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const CauseAndFix: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const [before, after] = e.cause.code[0].split(e.cause.mark);
  const ring = interpolate(f, [60, 75], [0, 1], clamp);
  const c1 = useIn(110, 12);
  const c2 = useIn(122, 12);
  const neq = useIn(140, 10);
  const minus = interpolate(f, [215, 225], [0, 1], clamp);
  const strike = interpolate(f, [240, 256], [0, 100], clamp);
  const plus = useIn(258, 14);
  return (
    <AbsoluteFill style={{opacity: fadeOut(f, S3 - S2)}}>
      <Section n="01" label="ROOT CAUSE" top={280} at={2} />
      <Card top={370} at={10} title={e.cause.file} tag="BUG" tagColor={C.bug}>
        <div style={{fontFamily: MONO, fontSize: 34, lineHeight: 1.7, color: C.text, whiteSpace: "pre"}}>
          <div>
            {typed(before, f, 18, 45)}
            {f > 18 + (before.length / 45) * 30 ? (
              <span style={{position: "relative", color: ring > 0.5 ? C.bug : C.text}}>
                {e.cause.mark}
                <span style={{position: "absolute", inset: "-6px -12px", border: `4px solid ${C.bug}`, borderRadius: 40, opacity: ring, transform: `scale(${1.3 - ring * 0.3})`}} />
              </span>
            ) : null}
            {f > 18 + (before.length / 45) * 30 ? after : null}
          </div>
          <div style={{color: C.dim, opacity: interpolate(f, [50, 56], [0, 1], clamp)}}>{e.cause.code[1]}</div>
        </div>
      </Card>
      <Card top={700} at={95} title="two clocks">
        <div style={{display: "flex", alignItems: "flex-end", justifyContent: "space-around"}}>
          <Labeled label={e.cause.left[0]}><Clock c={C.g} text={e.cause.left[1]} s={c1} /></Labeled>
          <div style={{fontFamily: MONO, fontSize: 64, color: C.bug, marginBottom: 80, transform: `scale(${neq})`}}>≠</div>
          <Labeled label={e.cause.right[0]}><Clock c={C.bug} text={e.cause.right[1]} s={c2} /></Labeled>
        </div>
        <div style={{textAlign: "center", fontFamily: MONO, fontSize: 30, marginTop: 24, opacity: interpolate(f, [150, 160], [0, 1], clamp)}}>
          <span style={{color: C.g}}>{e.cause.left[2]}</span> <span style={{color: C.dim}}>vs</span> <span style={{color: C.bug}}>{e.cause.right[2]}</span>
        </div>
      </Card>
      <Section n="02" label="THE FIX" top={1170} at={195} />
      <Card top={1250} at={205} title="git diff" tag={f > 262 ? "FIXED" : "EDITING"} tagColor={f > 262 ? C.g : C.dim} strong={f > 262 ? C.g : undefined}>
        <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.7}}>
          <div style={{color: C.bug, background: `${C.bug}1A`, margin: "0 -30px", padding: "0 30px", opacity: minus, position: "relative"}}>
            - {e.fix.minus}
            <span style={{position: "absolute", left: 60, top: "50%", height: 3, width: `calc(${strike}% - 90px)`, background: C.bug, opacity: 0.7}} />
          </div>
          <div style={{color: C.g, background: `${C.g}1F`, margin: "0 -30px", padding: "0 30px", opacity: plus, transform: `translateX(${(1 - plus) * 40}px)`}}>+ {e.fix.plus}</div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

const Lesson: React.FC<{e: EntryProps}> = ({e}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill>
      <Section n="03" label="LESSON" top={280} at={2} />
      <div style={{position: "absolute", left: 64, right: 150, top: 380, fontFamily: SANS, fontWeight: 900, fontStretch: "72%", textTransform: "uppercase", fontSize: 150, lineHeight: 0.9}}>
        {[[e.lesson.line1], [e.lesson.line2, e.lesson.word]].map((line, li) => (
          <div key={li} style={{display: "flex", gap: 34}}>
            {line.map((w, wi) => {
              const k = li * 2 + wi;
              const s = spring({frame: f - 10 - k * 8, fps, config: {damping: 16, mass: 0.6}});
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
      <Card top={860} at={50} title="deploy.log" tag="OK">
        <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.7}}>
          {e.lesson.checks.map((c, i) => (
            <div key={c} style={{opacity: interpolate(f, [70 + i * 14, 78 + i * 14], [0, 1], clamp)}}>
              <span style={{color: C.g}}>✓</span> {c}
            </div>
          ))}
        </div>
      </Card>
      <Card top={1150} at={110}>
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.16em", color: C.dim}}>NEXT ENTRY · {String(Number(e.n) + 1).padStart(3, "0")}</div>
        <div style={{fontSize: 56, fontWeight: 800, marginTop: 8, fontFamily: SANS}}>
          {e.lesson.next} <span style={{color: C.bug}}>{e.lesson.nextWord}</span>
        </div>
        <div style={{fontFamily: MONO, fontSize: 32, color: C.g, marginTop: 20}}>
          {typed(`follow ${e.handle}`, f, 140, 30)}
          <span style={{background: C.g, opacity: Math.floor(f / 15) % 2 ? 1 : 0}}>&nbsp;</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

export const DebugDiariesEntry: React.FC<Partial<EntryProps>> = (props) => {
  const e = {...ENTRY_001, ...props} as EntryProps;
  return (
    <AbsoluteFill style={{background: C.bg, color: C.text, fontFamily: SANS}}>
      <Grid />
      <Header n={e.n} handle={e.handle} />
      <Sequence from={S1} durationInFrames={S2 - S1}><TheBug e={e} /></Sequence>
      <Sequence from={S2} durationInFrames={S3 - S2}><CauseAndFix e={e} /></Sequence>
      <Sequence from={S3} durationInFrames={DD_TOTAL - S3}><Lesson e={e} /></Sequence>
    </AbsoluteFill>
  );
};
