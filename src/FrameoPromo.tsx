// FrameoPromo.tsx — landing-page video: what Frameo is, in 30 seconds.
// 1920x1080 · 30fps · 900 frames. Render: npx remotion render FrameoPromo web/public/promo.mp4
import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {
  bg: "#0E0C0B",
  surface: "#151210",
  surface2: "#1D1916",
  line: "#2A2522",
  line2: "#3A332F",
  ink: "#F3EEE8",
  ink2: "#A39890",
  ink3: "#7A6F69",
  accent: "#FF7A45",
  accentInk: "#1A0E08",
  good: "#6FD39C",
  review: "#F2D16B",
};
const SANS = "'Archivo Variable', Inter, sans-serif";
const MONO = "'JetBrains Mono', 'DejaVu Sans Mono', monospace";
const DISPLAY: React.CSSProperties = {fontFamily: SANS, fontWeight: 900, fontStretch: "66%", textTransform: "uppercase", lineHeight: 0.88, letterSpacing: "0.005em"};

// scene timing [start, length]
const T = {
  hook: [0, 96],
  topics: [96, 120],
  style: [216, 120],
  schedule: [336, 114],
  approve: [450, 114],
  video: [564, 120],
  posted: [684, 102],
  outro: [786, 114],
} as const;
export const PROMO_TOTAL = 900;

const useSpring = (delay = 0, damping = 18) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass: 0.7}});
};
const fadeOut = (f: number, len: number, d = 10) => interpolate(f, [len - d, len], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});

// ---------- shared pieces ----------
const Logo: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <rect width="64" height="64" rx="14" fill={C.accent} />
    <rect x="20" y="10" width="24" height="44" rx="4" fill={C.accentInk} />
    {[16, 26, 36, 46].map((y) => (
      <React.Fragment key={y}>
        <rect x="13" y={y} width="4" height="4" rx="1" fill={C.accentInk} />
        <rect x="47" y={y} width="4" height="4" rx="1" fill={C.accentInk} />
      </React.Fragment>
    ))}
    <rect x="24" y="22" width="16" height="20" rx="2" fill={C.accent} />
  </svg>
);

const Words: React.FC<{text: string; delay?: number; size: number; color?: string; stagger?: number}> = ({text, delay = 0, size, color = C.ink, stagger = 3}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{...DISPLAY, fontSize: size, color, display: "flex", flexWrap: "wrap", gap: `0 ${size * 0.22}px`}}>
      {text.split(" ").map((w, i) => {
        const s = spring({frame: f - delay - i * stagger, fps, config: {damping: 16, mass: 0.6}});
        return (
          <span key={i} style={{display: "inline-block", overflow: "hidden", paddingBottom: size * 0.04}}>
            <span style={{display: "inline-block", transform: `translateY(${(1 - s) * 105}%)`}}>{w}</span>
          </span>
        );
      })}
    </div>
  );
};

const StepHead: React.FC<{n: string; text: string; sub: string}> = ({n, text, sub}) => {
  const f = useCurrentFrame();
  const subIn = interpolate(f, [14, 26], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <div style={{position: "absolute", left: 120, top: 0, bottom: 0, width: 700, display: "flex", flexDirection: "column", justifyContent: "center", gap: 28}}>
      <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.accent, opacity: interpolate(f, [0, 8], [0, 1], {extrapolateRight: "clamp"})}}>STEP {n}</div>
      <Words text={text} size={128} />
      <div style={{fontFamily: SANS, fontSize: 32, color: C.ink2, lineHeight: 1.35, maxWidth: 600, opacity: subIn, transform: `translateY(${(1 - subIn) * 14}px)`}}>{sub}</div>
    </div>
  );
};

const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties; delay?: number}> = ({children, style, delay = 4}) => {
  const s = useSpring(delay, 20);
  return (
    <div
      style={{
        position: "absolute",
        right: 120,
        top: "50%",
        width: 880,
        transform: `translateY(-50%) translateY(${(1 - s) * 60}px)`,
        opacity: s,
        background: C.surface,
        border: `2px solid ${C.line}`,
        borderRadius: 28,
        padding: 40,
        boxShadow: "0 40px 100px rgba(0,0,0,.55)",
        fontFamily: SANS,
        color: C.ink,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const Label: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = C.ink3}) => (
  <div style={{fontFamily: MONO, fontSize: 20, letterSpacing: "0.12em", color, marginBottom: 22}}>{children}</div>
);

const Scene: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const f = useCurrentFrame();
  return <AbsoluteFill style={{opacity: fadeOut(f, len, 8)}}>{children}</AbsoluteFill>;
};

// ---------- scenes ----------
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const strike = interpolate(f, [52, 64], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)});
  return (
    <Scene len={T.hook[1]}>
      <AbsoluteFill style={{padding: "0 140px", justifyContent: "center", gap: 14}}>
        <Words text="Posting every day" size={176} />
        <div style={{position: "relative", alignSelf: "flex-start"}}>
          <Words text="is a full-time job." size={176} color={C.ink3} delay={8} />
          <div style={{position: "absolute", left: 0, top: "46%", height: 14, width: `${strike * 100}%`, background: C.accent, borderRadius: 7}} />
        </div>
        <div style={{marginTop: 40, opacity: interpolate(f, [62, 74], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
          <Words text="Not anymore." size={96} color={C.accent} delay={62} />
        </div>
      </AbsoluteFill>
    </Scene>
  );
};

const TOPICS = ["How RAG works", "Git rebase, explained", "What an API really is", "Why your Wi-Fi is slow", "Docker in 30 seconds"];
const Topics: React.FC = () => {
  const f = useCurrentFrame();
  let t = 14;
  return (
    <Scene len={T.topics[1]}>
      <StepHead n="01" text="Drop in your ideas." sub="One topic per line. Frameo writes the script for each one." />
      <Panel>
        <Label>TOPICS · TECH EXPLAINED</Label>
        <div style={{display: "flex", flexDirection: "column", gap: 14}}>
          {TOPICS.map((topic, i) => {
            const start = t;
            t += topic.length * 0.55 + 6;
            const chars = Math.max(0, Math.min(topic.length, Math.floor((f - start) / 0.55)));
            const typing = chars > 0 && chars < topic.length;
            return (
              <div key={i} style={{display: "flex", gap: 22, alignItems: "center", height: 68, padding: "0 24px", borderRadius: 16, background: chars ? C.surface2 : "transparent", border: `2px solid ${chars ? C.line2 : C.line}`}}>
                <span style={{fontFamily: MONO, fontSize: 22, color: C.ink3, width: 34}}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{fontSize: 34, fontWeight: 600}}>
                  {topic.slice(0, chars)}
                  {typing ? <span style={{display: "inline-block", width: 3, height: 34, background: C.accent, marginLeft: 3, verticalAlign: "-4px"}} /> : null}
                </span>
                {chars === topic.length ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 18, color: C.good}}>EP {i + 1}</span> : null}
              </div>
            );
          })}
        </div>
      </Panel>
    </Scene>
  );
};

const STYLES = [
  {name: "Midnight Deploy", tag: "Anime office story", a: "#2B1B4F", b: "#0B0A1A", fg: "#B89CFF"},
  {name: "Explainer Cards", tag: "Clean diagrams", a: "#0F3322", b: "#050A07", fg: "#4ADE80"},
  {name: "Kahaani", tag: "Story narration", a: "#4A2412", b: "#140A05", fg: "#FFB27A"},
  {name: "Anime Action", tag: "Battle metaphors", a: "#4A0F1A", b: "#12040A", fg: "#FF6B7F"},
];
const Style: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pick = spring({frame: f - 62, fps, config: {damping: 14}});
  return (
    <Scene len={T.style[1]}>
      <StepHead n="02" text="Pick a look." sub="Anime stories, clean explainers, narrated tales. Every episode keeps the same style." />
      <div style={{position: "absolute", right: 120, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 22}}>
        {STYLES.map((s, i) => {
          const inn = spring({frame: f - 6 - i * 5, fps, config: {damping: 16}});
          const on = i === 0 && pick > 0.05;
          const dim = i !== 0 ? interpolate(pick, [0, 1], [1, 0.45]) : 1;
          return (
            <div key={s.name} style={{width: 222, opacity: inn * dim, transform: `translateY(${(1 - inn) * 80}px) scale(${on ? 1 + pick * 0.06 : 1})`, fontFamily: SANS}}>
              <div style={{position: "relative", height: 396, borderRadius: 22, overflow: "hidden", background: `linear-gradient(170deg, ${s.a}, ${s.b})`, border: `3px solid ${on ? C.accent : C.line2}`, boxShadow: on ? `0 0 0 ${pick * 6}px rgba(255,122,69,.25)` : "none"}}>
                <div style={{position: "absolute", left: 20, right: 20, top: 26, height: 150, borderRadius: 14, border: `2px solid ${s.fg}55`, background: `${s.fg}14`}}>
                  <div style={{position: "absolute", left: "50%", top: "50%", width: 56, height: 56, borderRadius: i === 1 ? 10 : 28, border: `4px solid ${s.fg}`, transform: `translate(-50%,-50%) rotate(${(f - i * 9) * (i === 3 ? 4 : 1)}deg)`}} />
                </div>
                <div style={{position: "absolute", left: 20, right: 20, bottom: 30, display: "flex", flexDirection: "column", gap: 8}}>
                  <div style={{height: 12, borderRadius: 6, background: `${s.fg}cc`, width: "86%"}} />
                  <div style={{height: 12, borderRadius: 6, background: `${s.fg}66`, width: "60%"}} />
                </div>
                {on ? (
                  <div style={{position: "absolute", top: 12, right: 12, width: 42, height: 42, borderRadius: 21, background: C.accent, color: C.accentInk, display: "grid", placeItems: "center", fontSize: 26, fontWeight: 900, transform: `scale(${pick})`}}>✓</div>
                ) : null}
              </div>
              <div style={{fontSize: 26, fontWeight: 800, marginTop: 14, color: C.ink}}>{s.name}</div>
              <div style={{fontSize: 20, color: C.ink2}}>{s.tag}</div>
            </div>
          );
        })}
      </div>
    </Scene>
  );
};

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const PLAN = [
  {d: 0, t: "How RAG works"},
  {d: 2, t: "Git rebase, explained"},
  {d: 4, t: "What an API really is"},
  {d: 5, t: "Why your Wi-Fi is slow"},
];
const Schedule: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <Scene len={T.schedule[1]}>
      <StepHead n="03" text="Choose when it posts." sub="Pick the days and the time. Your calendar fills itself." />
      <Panel style={{width: 940, padding: 0, overflow: "hidden"}}>
        <div style={{display: "grid", gridTemplateColumns: "repeat(7, 1fr)"}}>
          {DAYS.map((d, i) => {
            const ep = PLAN.find((p) => p.d === i);
            const k = ep ? PLAN.indexOf(ep) : 0;
            const s = spring({frame: f - 24 - k * 12, fps, config: {damping: 13}});
            return (
              <div key={d} style={{borderLeft: i ? `2px solid ${C.line}` : "none", height: 470, display: "flex", flexDirection: "column", background: i === 0 ? "rgba(255,122,69,.05)" : "transparent"}}>
                <div style={{padding: "18px 14px", borderBottom: `2px solid ${C.line}`, display: "flex", gap: 8, alignItems: "baseline"}}>
                  <span style={{fontFamily: MONO, fontSize: 16, color: C.ink3}}>{d}</span>
                  <span style={{fontSize: 30, fontWeight: 800, color: i === 0 ? C.accent : C.ink}}>{13 + i}</span>
                </div>
                <div style={{padding: 10}}>
                  {ep ? (
                    <div style={{transform: `scale(${s})`, transformOrigin: "top left", opacity: s, background: k === 0 ? C.accent : C.surface2, color: k === 0 ? C.accentInk : C.ink, border: `2px solid ${k === 0 ? C.accent : C.line2}`, borderRadius: 12, padding: "10px 11px"}}>
                      <div style={{fontFamily: MONO, fontSize: 14, opacity: 0.8}}>7:00 PM</div>
                      <div style={{fontSize: 18, fontWeight: 800, lineHeight: 1.15, marginTop: 4}}>{ep.t}</div>
                      <div style={{fontFamily: MONO, fontSize: 12, marginTop: 6, opacity: 0.75}}>{k === 0 ? "NEXT UP" : "PLANNED"}</div>
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    </Scene>
  );
};

const LINES = ["Your AI doesn't know your docs.", "So it guesses. Confidently.", "RAG finds the right page first,", "then answers from it."];
const Approve: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const press = f >= 70 && f < 76 ? 0.95 : 1;
  const done = spring({frame: f - 76, fps, config: {damping: 14}});
  return (
    <Scene len={T.approve[1]}>
      <StepHead n="04" text="Approve the script." sub="Read it, tweak a line if you like, tap approve. Or let it run on autopilot." />
      <Panel>
        <Label color={C.review}>EPISODE 1 · READY FOR REVIEW</Label>
        <div style={{...DISPLAY, fontSize: 64, marginBottom: 26}}>How RAG works</div>
        <div style={{display: "flex", flexDirection: "column", gap: 12, marginBottom: 34}}>
          {LINES.map((l, i) => {
            const o = interpolate(f, [12 + i * 9, 20 + i * 9], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
            return (
              <div key={i} style={{opacity: o, transform: `translateX(${(1 - o) * 20}px)`, fontSize: 32, color: C.ink2, borderLeft: `4px solid ${C.line2}`, paddingLeft: 20}}>
                {l}
              </div>
            );
          })}
        </div>
        <div style={{display: "flex", gap: 16, alignItems: "center"}}>
          <div style={{transform: `scale(${press})`, height: 76, padding: "0 34px", borderRadius: 16, display: "flex", alignItems: "center", gap: 14, fontSize: 28, fontWeight: 800, background: done > 0.05 ? C.good : C.accent, color: C.accentInk}}>
            {done > 0.05 ? <span style={{transform: `scale(${done})`, display: "inline-block"}}>✓</span> : null}
            {done > 0.05 ? "Approved" : "Approve script"}
          </div>
          <div style={{height: 76, padding: "0 28px", borderRadius: 16, border: `2px solid ${C.line2}`, display: "flex", alignItems: "center", fontSize: 26, fontWeight: 700, color: C.ink2, opacity: 1 - done * 0.6}}>Rewrite</div>
        </div>
      </Panel>
    </Scene>
  );
};

const REEL = ["Your AI doesn't know your docs.", "RAG finds the right page first,", "then answers from it."];
const Video: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = interpolate(f, [10, 62], [0, 100], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.quad)});
  const ready = f >= 64;
  const phoneIn = spring({frame: f - 2, fps, config: {damping: 18}});
  const line = Math.min(REEL.length - 1, Math.max(0, Math.floor((f - 66) / 18)));
  const lineIn = spring({frame: f - 66 - line * 18, fps, config: {damping: 14}});
  return (
    <Scene len={T.video[1]}>
      <StepHead n="05" text="Frameo makes the video." sub="Scenes, motion, subtitles and music, in your style. No editing app." />
      <div style={{position: "absolute", right: 320, top: "47%", transform: `translateY(-50%) translateY(${(1 - phoneIn) * 80}px)`, opacity: phoneIn}}>
        <div style={{width: 392, height: 740, borderRadius: 46, border: `10px solid #2A2522`, background: "#000", overflow: "hidden", position: "relative", boxShadow: "0 50px 120px rgba(0,0,0,.7)"}}>
          <div style={{position: "absolute", inset: 0, background: "linear-gradient(170deg, #2B1B4F, #0B0A1A)", filter: ready ? "none" : `blur(${(100 - p) / 6}px) grayscale(${1 - p / 100})`}}>
            <div style={{position: "absolute", left: 36, right: 36, top: 70, height: 300, borderRadius: 22, border: "3px solid #B89CFF66", background: "#B89CFF14"}}>
              <div style={{position: "absolute", left: "50%", top: "50%", width: 120, height: 120, borderRadius: 60, border: "6px solid #B89CFF", transform: `translate(-50%,-50%) scale(${1 + Math.sin(f / 8) * 0.06})`}} />
              <div style={{position: "absolute", left: "50%", top: "50%", width: 40, height: 40, borderRadius: 20, background: C.accent, transform: "translate(-50%,-50%)"}} />
            </div>
            <div style={{position: "absolute", left: 30, right: 30, bottom: 170, textAlign: "center", fontFamily: SANS, fontSize: 32, fontWeight: 800, lineHeight: 1.15, color: "#fff", opacity: ready ? lineIn : 0, transform: `translateY(${(1 - lineIn) * 16}px)`, textShadow: "0 3px 12px #000"}}>
              {REEL[line]}
            </div>
            <div style={{position: "absolute", left: 0, right: 0, bottom: 70, textAlign: "center", fontFamily: MONO, fontSize: 18, color: "#B89CFF", letterSpacing: "0.1em"}}>EP 1 · HOW RAG WORKS</div>
          </div>
          {!ready ? (
            <div style={{position: "absolute", left: 40, right: 40, top: "50%", transform: "translateY(-50%)", background: "rgba(14,12,11,.88)", borderRadius: 20, padding: "26px 26px", border: `2px solid ${C.line2}`}}>
              <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 20, color: C.ink2, marginBottom: 14}}>
                <span>MAKING VIDEO</span>
                <span style={{color: C.accent}}>{Math.round(p)}%</span>
              </div>
              <div style={{height: 10, borderRadius: 5, background: C.line}}>
                <div style={{height: 10, borderRadius: 5, width: `${p}%`, background: C.accent}} />
              </div>
            </div>
          ) : null}
        </div>
        {ready ? (
          <div style={{position: "absolute", left: "50%", top: -48, transform: "translateX(-50%)", fontFamily: MONO, fontSize: 20, color: C.good, whiteSpace: "nowrap", letterSpacing: "0.1em"}}>✓ READY · 0:30 · 1080×1920</div>
        ) : null}
      </div>
    </Scene>
  );
};

const Posted: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const views = Math.round(interpolate(f, [30, 96], [0, 12400], {extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic)}));
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));
  const cards = [
    {p: "IG", name: "Instagram Reels", color: "#F59BC6", v: views},
    {p: "YT", name: "YouTube Shorts", color: "#F69A8A", v: Math.round(views * 0.64)},
  ];
  return (
    <Scene len={T.posted[1]}>
      <StepHead n="06" text="It posts. You sleep." sub="Right on time, to Instagram and YouTube. Captions and hashtags included." />
      <div style={{position: "absolute", right: 120, top: "50%", transform: "translateY(-50%)", display: "flex", flexDirection: "column", gap: 24, width: 820}}>
        {cards.map((c, i) => {
          const s = spring({frame: f - 6 - i * 10, fps, config: {damping: 16}});
          return (
            <div key={c.p} style={{opacity: s, transform: `translateX(${(1 - s) * 80}px)`, display: "flex", alignItems: "center", gap: 28, background: C.surface, border: `2px solid ${C.line}`, borderRadius: 24, padding: "30px 34px", fontFamily: SANS, color: C.ink}}>
              <div style={{width: 76, height: 58, borderRadius: 12, border: `3px solid ${c.color}88`, color: c.color, fontFamily: MONO, fontWeight: 700, fontSize: 26, display: "grid", placeItems: "center"}}>{c.p}</div>
              <div style={{flex: 1}}>
                <div style={{fontSize: 32, fontWeight: 800}}>{c.name}</div>
                <div style={{fontFamily: MONO, fontSize: 19, color: C.good, marginTop: 4, letterSpacing: "0.08em"}}>✓ POSTED · MON 7:00 PM</div>
              </div>
              <div style={{textAlign: "right"}}>
                <div style={{...DISPLAY, fontSize: 64, color: C.accent}}>{fmt(c.v)}</div>
                <div style={{fontFamily: MONO, fontSize: 16, color: C.ink3, letterSpacing: "0.12em"}}>VIEWS</div>
              </div>
            </div>
          );
        })}
        <div style={{fontFamily: MONO, fontSize: 18, color: C.ink3, letterSpacing: "0.1em", opacity: interpolate(f, [40, 52], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>NEXT EPISODE · WED 7:00 PM · GIT REBASE, EXPLAINED</div>
      </div>
    </Scene>
  );
};

const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: f - 2, fps, config: {damping: 12}});
  const cta = interpolate(f, [44, 58], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", gap: 34}}>
      <div style={{transform: `scale(${logo}) rotate(${(1 - logo) * -12}deg)`}}>
        <Logo size={150} />
      </div>
      <div style={{textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: 10}}>
        <Words text="Your channel posts" size={120} delay={10} />
        <Words text="while you sleep." size={120} delay={16} color={C.accent} />
      </div>
      <div style={{opacity: cta, transform: `translateY(${(1 - cta) * 16}px)`, display: "flex", alignItems: "center", gap: 26}}>
        <span style={{...DISPLAY, fontSize: 64, color: C.ink}}>Frameo</span>
        <span style={{height: 66, padding: "0 30px", borderRadius: 16, background: C.accent, color: C.accentInk, fontFamily: SANS, fontWeight: 800, fontSize: 28, display: "flex", alignItems: "center"}}>Start free · 30 credits</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- chrome: logo + step progress ----------
const STEP_SCENES = [T.topics, T.style, T.schedule, T.approve, T.video, T.posted];
const STEP_NAMES = ["IDEAS", "STYLE", "SCHEDULE", "APPROVE", "VIDEO", "POSTED"];
const Chrome: React.FC = () => {
  const f = useCurrentFrame();
  const vis = interpolate(f, [T.topics[0] - 6, T.topics[0] + 6, T.outro[0] - 6, T.outro[0]], [0, 1, 1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      <div style={{position: "absolute", left: 120, top: 64, display: "flex", alignItems: "center", gap: 16, opacity: interpolate(f, [T.outro[0] - 6, T.outro[0]], [1, 0], {extrapolateLeft: "clamp", extrapolateRight: "clamp"})}}>
        <Logo size={46} />
        <span style={{...DISPLAY, fontSize: 40, color: C.ink}}>Frameo</span>
      </div>
      <div style={{position: "absolute", left: 120, right: 120, bottom: 64, display: "flex", gap: 14, opacity: vis}}>
        {STEP_SCENES.map(([s, len], i) => {
          const p = interpolate(f, [s, s + len], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
          const on = f >= s && f < s + len;
          return (
            <div key={i} style={{flex: 1}}>
              <div style={{height: 5, borderRadius: 3, background: C.line}}>
                <div style={{height: 5, borderRadius: 3, width: `${p * 100}%`, background: C.accent}} />
              </div>
              <div style={{fontFamily: MONO, fontSize: 16, letterSpacing: "0.12em", marginTop: 12, color: on ? C.ink : C.ink3}}>
                {String(i + 1).padStart(2, "0")} {STEP_NAMES[i]}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

export const FrameoPromo: React.FC = () => (
  <AbsoluteFill style={{background: C.bg}}>
    <AbsoluteFill style={{background: "radial-gradient(1200px 700px at 78% 50%, rgba(255,122,69,.09), transparent 70%)"}} />
    <Sequence from={T.hook[0]} durationInFrames={T.hook[1]}><Hook /></Sequence>
    <Sequence from={T.topics[0]} durationInFrames={T.topics[1]}><Topics /></Sequence>
    <Sequence from={T.style[0]} durationInFrames={T.style[1]}><Style /></Sequence>
    <Sequence from={T.schedule[0]} durationInFrames={T.schedule[1]}><Schedule /></Sequence>
    <Sequence from={T.approve[0]} durationInFrames={T.approve[1]}><Approve /></Sequence>
    <Sequence from={T.video[0]} durationInFrames={T.video[1]}><Video /></Sequence>
    <Sequence from={T.posted[0]} durationInFrames={T.posted[1]}><Posted /></Sequence>
    <Sequence from={T.outro[0]} durationInFrames={T.outro[1]}><Outro /></Sequence>
    <Chrome />
  </AbsoluteFill>
);
