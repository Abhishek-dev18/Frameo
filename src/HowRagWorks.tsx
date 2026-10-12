// HowRagWorks.tsx — "RAG kaise kaam karta hai?" explainer reel
// 1080x1920 · 30fps · 28s (840 frames)
// Preview: npm run dev    Render: npm run render
// Voiceover: drop voice.mp3 in /public and uncomment the <Audio> line below.

import React from "react";
import {
  AbsoluteFill,
  Sequence,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  // Audio, staticFile,
} from "remotion";

// ---------- design tokens ----------
const C = {
  bg: "#050A07", // near-black
  card: "#0B1610", // dark green-black card
  line: "rgba(74,222,128,.35)", // green hairlines
  text: "#FFFFFF",
  muted: "#7FA38C",
  accent: "#4ADE80", // neon green
  warn: "#F87171", // red for wrong answers
  sub: "#D9FBE5", // pale green subtitles
};
const MONO = "DejaVu Sans Mono, JetBrains Mono, monospace";
const SANS = "Inter, sans-serif";

// ---------- timing (frames @30fps) ----------
const S = {
  hook: [0, 105],
  problem: [105, 120],
  index: [225, 180],
  retrieve: [405, 150],
  generate: [555, 150],
  outro: [705, 135],
} as const;
export const TOTAL = 840;

// ---------- helpers ----------
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

const Appear: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number}> = ({
  at,
  children,
  style,
  dy = 40,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - at, fps, config: {damping: 200}});
  return <div style={{...style, opacity: p, transform: `translateY(${(1 - p) * dy}px)`}}>{children}</div>;
};

// Fades a whole scene out over its last 10 frames
const Scene: React.FC<{len: number; children: React.ReactNode}> = ({len, children}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [len - 10, len], [1, 0], clamp);
  return <AbsoluteFill style={{opacity: o, padding: "260px 64px 0"}}>{children}</AbsoluteFill>;
};

const Label: React.FC<{children: React.ReactNode; color?: string; size?: number}> = ({children, color = C.accent, size = 32}) => (
  <div style={{fontFamily: MONO, color, fontSize: size, letterSpacing: 6, textTransform: "uppercase"}}>{children}</div>
);

const Box: React.FC<{children: React.ReactNode; color?: string; glow?: boolean; style?: React.CSSProperties}> = ({
  children,
  color = C.text,
  glow,
  style,
}) => (
  <div
    style={{
      border: `3px solid ${color}`,
      color,
      background: C.card,
      borderRadius: 18,
      padding: "18px 26px",
      fontFamily: MONO,
      fontSize: 34,
      textAlign: "center",
      boxShadow: glow ? `0 0 40px ${color}55` : undefined,
      ...style,
    }}
  >
    {children}
  </div>
);

const VArrow: React.FC<{at: number; h?: number; label?: string}> = ({at, h = 70, label}) => {
  const frame = useCurrentFrame();
  const len = interpolate(frame, [at, at + 12], [0, h], clamp);
  const o = interpolate(frame, [at + 8, at + 16], [0, 1], clamp);
  return (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", height: h + 10, marginBottom: 10, position: "relative"}}>
      <div style={{width: 3, height: len, background: C.line}} />
      <div style={{opacity: o, color: C.line, fontSize: 28, marginTop: -14, fontFamily: SANS}}>▼</div>
      {label ? (
        <div style={{position: "absolute", left: "55%", top: h / 2 - 18, opacity: o, fontFamily: MONO, fontSize: 26, color: C.muted, whiteSpace: "nowrap"}}>
          {label}
        </div>
      ) : null}
    </div>
  );
};

const HArrow: React.FC<{at: number; w?: number}> = ({at, w = 70}) => {
  const frame = useCurrentFrame();
  const len = interpolate(frame, [at, at + 12], [0, w], clamp);
  const o = interpolate(frame, [at + 8, at + 16], [0, 1], clamp);
  return (
    <div style={{display: "flex", alignItems: "center", width: w + 20}}>
      <div style={{height: 3, width: len, background: C.line}} />
      <div style={{opacity: o, color: C.line, fontSize: 26, marginLeft: -6}}>▶</div>
    </div>
  );
};

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{background: C.card, border: `3px solid ${C.line}`, borderRadius: 30, padding: 44, ...style}}>{children}</div>
);

// Vector database cylinder
const VectorDB: React.FC<{highlight?: boolean}> = ({highlight}) => (
  <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
    <div
      style={{
        width: 300,
        height: 190,
        border: `3px solid ${highlight ? C.accent : C.text}`,
        borderRadius: "150px / 40px",
        background: C.card,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        boxShadow: highlight ? `0 0 50px ${C.accent}55` : undefined,
      }}
    >
      <div style={{fontFamily: MONO, fontSize: 30, color: highlight ? C.accent : C.text}}>vector DB</div>
      <div style={{fontFamily: MONO, fontSize: 22, color: C.muted, marginTop: 6}}>• • • • • •</div>
    </div>
  </div>
);

// ---------- persistent chrome ----------
const steps = [
  {n: "01", name: "INDEX", from: S.index[0], to: S.retrieve[0]},
  {n: "02", name: "RETRIEVE", from: S.retrieve[0], to: S.generate[0]},
  {n: "03", name: "GENERATE", from: S.generate[0], to: S.outro[0]},
];

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const showSteps = interpolate(frame, [S.index[0] - 10, S.index[0]], [0, 1], clamp);
  return (
    <div style={{position: "absolute", top: 70, left: 64, right: 64}}>
      <div style={{display: "flex", justifyContent: "space-between", fontFamily: MONO, color: C.muted, fontSize: 30, letterSpacing: 6}}>
        <span>
          AI SAWAAL · <span style={{color: C.accent}}>002</span>
        </span>
        <span>@yourhandle</span>
      </div>
      <div style={{display: "flex", gap: 14, marginTop: 40, opacity: showSteps}}>
        {steps.map((s) => {
          const active = frame >= s.from && frame < s.to;
          const done = frame >= s.to;
          return (
            <div
              key={s.n}
              style={{
                flex: 1,
                padding: "14px 0",
                textAlign: "center",
                borderRadius: 12,
                fontFamily: MONO,
                fontSize: 24,
                letterSpacing: 3,
                border: `2px solid ${active ? C.accent : C.line}`,
                color: active ? C.bg : done ? C.accent : C.muted,
                background: active ? C.accent : "transparent",
              }}
            >
              {s.n} {s.name}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const subtitles: [number, string][] = [
  [0, "Interview mein pucha: RAG kaise kaam karta hai?"],
  [50, "ChatGPT ko tumhari company ke docs kaise pata?"],
  [105, "Problem: LLM sirf apna purana training data jaanta hai."],
  [165, "Private ya naya data? Woh guess karega. Hallucination!"],
  [225, "Step 1: apne documents ko chhote chunks mein todo."],
  [300, "Har chunk ko embedding banao, yaani numbers ki list."],
  [355, "Sab embeddings vector database mein store karo."],
  [405, "Step 2: user ka question bhi embedding banta hai."],
  [470, "Vector DB sabse similar top 3 chunks dhundta hai."],
  [555, "Step 3: question + chunks, dono LLM ko prompt mein do."],
  [625, "Ab LLM sahi data dekh ke answer deta hai. Source ke saath!"],
  [705, "Yaad rakho: Retrieve karo, phir Generate karo."],
  [790, "Follow karo, next: Vector DB kya hai?"],
];

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const idx = subtitles.findLastIndex(([t]) => frame >= t);
  const [start, text] = subtitles[idx];
  const o = interpolate(frame, [start, start + 6], [0, 1], clamp);
  return (
    <div
      style={{
        position: "absolute",
        bottom: 150,
        left: 70,
        right: 70,
        textAlign: "center",
        fontFamily: SANS,
        fontWeight: 700,
        fontSize: 46,
        lineHeight: 1.3,
        color: C.sub,
        opacity: o,
        textShadow: "0 4px 18px rgba(0,0,0,.6)",
      }}
    >
      {text}
    </div>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  return <div style={{position: "absolute", bottom: 0, left: 0, height: 8, width: `${(frame / TOTAL) * 100}%`, background: C.accent}} />;
};

// ---------- scenes ----------
const Hook: React.FC = () => (
  <Scene len={S.hook[1]}>
    <Appear at={0}>
      <Label>— 00 / the question</Label>
    </Appear>
    <Appear at={8} style={{marginTop: 40}}>
      <Card>
        <Label size={28}>interviewer:</Label>
        <div style={{fontFamily: SANS, fontSize: 52, color: C.text, marginTop: 16}}>Explain karo,</div>
        <div style={{fontFamily: SANS, fontSize: 104, fontWeight: 800, color: C.accent, lineHeight: 1.05, marginTop: 6}}>
          RAG kaise kaam karta hai?
        </div>
      </Card>
    </Appear>
    <Appear at={50} style={{marginTop: 90, fontFamily: SANS, fontSize: 58, color: C.text, lineHeight: 1.35}}>
      ChatGPT ko <span style={{color: C.accent, fontWeight: 700}}>tumhari company ke docs</span> kaise pata chalte hain?
    </Appear>
  </Scene>
);

const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const shake = frame > 60 ? Math.sin(frame * 1.6) * interpolate(frame, [60, 80], [8, 0], clamp) : 0;
  return (
    <Scene len={S.problem[1]}>
      <Appear at={0}>
        <Label color={C.warn}>— the problem</Label>
      </Appear>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 70, transform: "scale(1.3)", transformOrigin: "top center"}}>
        <Appear at={8}>
          <Box>"Hamari leave policy kya hai?"</Box>
        </Appear>
        <VArrow at={20} />
        <Appear at={26}>
          <Box style={{width: 520}}>
            LLM
            <div style={{fontSize: 24, color: C.muted, marginTop: 8}}>training data: public + purana</div>
          </Box>
        </Appear>
        <VArrow at={44} />
        <Appear at={58} style={{transform: `translateX(${shake}px)`}}>
          <Box color={C.warn} glow>
            "Shayad 30 din..." ✗
          </Box>
        </Appear>
        <Appear at={70} style={{marginTop: 50}}>
          <Label color={C.warn}>hallucination</Label>
        </Appear>
      </div>
    </Scene>
  );
};

const Chunks: React.FC<{at: number}> = ({at}) => (
  <div style={{display: "flex", gap: 16}}>
    {[0, 1, 2, 3, 4].map((i) => (
      <Appear key={i} at={at + i * 4} dy={20}>
        <div style={{width: 120, height: 80, border: `3px solid ${C.text}`, borderRadius: 12, background: C.card, padding: 14}}>
          <div style={{height: 6, background: C.line, borderRadius: 3, width: "90%"}} />
          <div style={{height: 6, background: C.line, borderRadius: 3, width: "70%", marginTop: 10}} />
          <div style={{height: 6, background: C.line, borderRadius: 3, width: "80%", marginTop: 10}} />
        </div>
      </Appear>
    ))}
  </div>
);

const Index: React.FC = () => (
  <Scene len={S.index[1]}>
    <Appear at={0}>
      <Label>— 01 / index (ek baar, pehle se)</Label>
    </Appear>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50, transform: "scale(1.28)", transformOrigin: "top center"}}>
      <Appear at={6}>
        <Box>PDFs · Docs · Wiki</Box>
      </Appear>
      <VArrow at={18} label="split" />
      <Chunks at={28} />
      <VArrow at={70} label="embed" />
      <Appear at={80}>
        <Box color={C.accent}>[0.12, -0.83, 0.47, ...]</Box>
      </Appear>
      <VArrow at={120} label="store" />
      <Appear at={130}>
        <VectorDB />
      </Appear>
    </div>
  </Scene>
);

const Retrieve: React.FC = () => {
  const frame = useCurrentFrame();
  const hit = frame >= 70;
  return (
    <Scene len={S.retrieve[1]}>
      <Appear at={0}>
        <Label>— 02 / retrieve</Label>
      </Appear>
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50, transform: "scale(1.28)", transformOrigin: "top center"}}>
        <Appear at={6}>
          <Box>"Hamari leave policy kya hai?"</Box>
        </Appear>
        <VArrow at={18} label="embed" />
        <Appear at={28}>
          <Box color={C.accent}>[0.10, -0.79, 0.51, ...]</Box>
        </Appear>
        <VArrow at={44} label="similarity search" />
        <Appear at={54}>
          <VectorDB highlight={hit} />
        </Appear>
        <VArrow at={70} label="top 3" />
        <div style={{display: "flex", gap: 16}}>
          {["leave_policy.pdf", "HR_handbook", "FAQ"].map((t, i) => (
            <Appear key={t} at={80 + i * 6} dy={20}>
              <Box color={C.accent} glow style={{fontSize: 24, padding: "14px 16px"}}>
                {t}
              </Box>
            </Appear>
          ))}
        </div>
      </div>
    </Scene>
  );
};

const Generate: React.FC = () => (
  <Scene len={S.generate[1]}>
    <Appear at={0}>
      <Label>— 03 / generate</Label>
    </Appear>
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: 50, transform: "scale(1.28)", transformOrigin: "top center"}}>
      <Appear at={6} style={{width: 760}}>
        <Card style={{padding: 34}}>
          <Label size={26} color={C.muted}>
            prompt =
          </Label>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.text, marginTop: 14}}>question</div>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.muted, margin: "6px 0"}}>+</div>
          <div style={{fontFamily: MONO, fontSize: 30, color: C.accent}}>top 3 chunks (context)</div>
        </Card>
      </Appear>
      <VArrow at={30} />
      <Appear at={40}>
        <Box style={{width: 420}}>LLM</Box>
      </Appear>
      <VArrow at={60} />
      <Appear at={70} style={{width: 760}}>
        <Card style={{borderColor: C.accent, boxShadow: `0 0 50px ${C.accent}44`, padding: 34}}>
          <div style={{fontFamily: SANS, fontSize: 40, color: C.text, lineHeight: 1.35}}>"Har saal 24 paid leaves milti hain."</div>
          <div style={{fontFamily: MONO, fontSize: 26, color: C.accent, marginTop: 16}}>✓ source: leave_policy.pdf</div>
        </Card>
      </Appear>
    </div>
  </Scene>
);

const Outro: React.FC = () => (
  <Scene len={S.outro[1]}>
    <Appear at={0}>
      <Label>— interview mein bolo</Label>
    </Appear>
    <Appear at={8} style={{marginTop: 40}}>
      <Card style={{borderColor: C.accent}}>
        <div style={{fontFamily: SANS, fontSize: 64, color: C.text, lineHeight: 1.3}}>
          RAG = <span style={{color: C.accent, fontWeight: 800}}>Retrieve</span> relevant data, phir LLM se{" "}
          <span style={{color: C.accent, fontWeight: 800}}>Generate</span> karo.
        </div>
        <div style={{fontFamily: MONO, fontSize: 34, color: C.muted, marginTop: 34, lineHeight: 1.7}}>
          ✓ fresh data &nbsp; ✓ private docs
          <br />✓ kam hallucination &nbsp; ✓ no retraining
        </div>
      </Card>
    </Appear>
    <Appear at={85} style={{marginTop: 120, textAlign: "center"}}>
      <Label color={C.muted} size={30}>
        next →
      </Label>
      <div style={{fontFamily: SANS, fontSize: 80, fontWeight: 800, color: C.text, marginTop: 16}}>Vector DB kya hai?</div>
    </Appear>
  </Scene>
);

// ---------- composition ----------
export const HowRagWorks: React.FC = () => {
  const grid =
    "linear-gradient(rgba(74,222,128,.05) 2px,transparent 2px),linear-gradient(90deg,rgba(74,222,128,.05) 2px,transparent 2px)";
  return (
    <AbsoluteFill style={{background: C.bg, backgroundImage: grid, backgroundSize: "72px 72px"}}>
      {/* <Audio src={staticFile("voice.mp3")} /> */}
      <Sequence from={S.hook[0]} durationInFrames={S.hook[1]}><Hook /></Sequence>
      <Sequence from={S.problem[0]} durationInFrames={S.problem[1]}><Problem /></Sequence>
      <Sequence from={S.index[0]} durationInFrames={S.index[1]}><Index /></Sequence>
      <Sequence from={S.retrieve[0]} durationInFrames={S.retrieve[1]}><Retrieve /></Sequence>
      <Sequence from={S.generate[0]} durationInFrames={S.generate[1]}><Generate /></Sequence>
      <Sequence from={S.outro[0]} durationInFrames={S.outro[1]}><Outro /></Sequence>
      <Header />
      <Subtitle />
      <ProgressBar />
    </AbsoluteFill>
  );
};
