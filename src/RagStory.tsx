// RagStory.tsx — "Tech Kahaani": RAG explained as a tiny animated story
// 1080x1920 · 30fps · 24s (720 frames)
// Characters: "Bot" (the LLM, green) and "Khojee" (the retriever, amber)

import React from "react";
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from "remotion";

export const STORY_TOTAL = 720;

const C = {
  bg: "#050A07",
  ink: "#0B1610",
  line: "rgba(74,222,128,.28)",
  green: "#4ADE80",
  greenDark: "#14532D",
  amber: "#FBBF24",
  amberDark: "#78350F",
  red: "#F87171",
  text: "#FFFFFF",
  muted: "#7FA38C",
  sub: "#D9FBE5",
  bookA: "#1F3A2A",
  bookB: "#24402F",
  bookC: "#2E4A38",
};
const MONO = "DejaVu Sans Mono, monospace";
const SANS = "Inter, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---------- small helpers ----------
const useSp = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (at: number, damping = 14, mass = 0.8) => spring({frame: f - at, fps, config: {damping, mass}});
};
const fadeIO = (f: number, a: number, b: number, d = 8) =>
  Math.min(interpolate(f, [a, a + d], [0, 1], clamp), interpolate(f, [b - d, b], [1, 0], clamp));

// ---------- characters ----------
type Mood = "idle" | "sweat" | "read" | "happy";

const Bot: React.FC<{x: number; y: number; mood: Mood; f: number; pop: number}> = ({x, y, mood, f, pop}) => {
  const bob = Math.sin(f / 9) * 6;
  const blink = f % 80 < 4 && mood !== "happy";
  const lookY = mood === "read" ? 14 : 0;
  const lookX = mood === "sweat" ? Math.sin(f / 3) * 10 : 0; // nervous darting eyes
  const eyeH = blink ? 4 : 38;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${pop})`}>
      {/* antenna */}
      <line x1={0} y1={-170} x2={0} y2={-215} stroke={C.green} strokeWidth={6} />
      <circle cx={0} cy={-224} r={13} fill={C.green} opacity={0.6 + 0.4 * Math.abs(Math.sin(f / 6))} />
      {/* arms */}
      <rect x={-150} y={-40} width={36} height={110} rx={18} fill={C.green} transform={`rotate(${mood === "happy" ? -35 : 8} -132 -40)`} />
      <rect x={114} y={-40} width={36} height={110} rx={18} fill={C.green} transform={`rotate(${mood === "happy" ? 35 : -8} 132 -40)`} />
      {/* body */}
      <rect x={-120} y={-170} width={240} height={330} rx={60} fill={C.green} />
      {/* face screen */}
      <rect x={-88} y={-138} width={176} height={120} rx={28} fill={C.ink} />
      {mood === "happy" ? (
        <>
          <path d="M -52 -70 q 18 -26 36 0" stroke={C.green} strokeWidth={9} fill="none" strokeLinecap="round" />
          <path d="M 16 -70 q 18 -26 36 0" stroke={C.green} strokeWidth={9} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          <rect x={-46 + lookX} y={-97 + lookY + (38 - eyeH) / 2} width={24} height={eyeH} rx={10} fill={C.green} />
          <rect x={22 + lookX} y={-97 + lookY + (38 - eyeH) / 2} width={24} height={eyeH} rx={10} fill={C.green} />
        </>
      )}
      {/* chest label */}
      <text x={0} y={60} textAnchor="middle" fontFamily={MONO} fontSize={34} fontWeight={700} fill={C.greenDark}>
        LLM
      </text>
      {/* sweat drops */}
      {mood === "sweat"
        ? [0, 1].map((i) => {
            const t = ((f + i * 14) % 28) / 28;
            return (
              <path
                key={i}
                d="M 0 0 q 10 16 0 24 q -10 -8 0 -24 z"
                fill="#93C5FD"
                opacity={1 - t}
                transform={`translate(${i ? 120 : -132} ${-150 + t * 70})`}
              />
            );
          })
        : null}
    </g>
  );
};

const Khojee: React.FC<{x: number; y: number; f: number; scanning: boolean}> = ({x, y, f, scanning}) => {
  const bob = Math.sin(f / 7) * 5;
  const blink = f % 95 < 4;
  return (
    <g transform={`translate(${x} ${y + bob})`}>
      {/* feet */}
      <ellipse cx={-38} cy={98} rx={30} ry={14} fill={C.amber} />
      <ellipse cx={38} cy={98} rx={30} ry={14} fill={C.amber} />
      {/* body */}
      <circle cx={0} cy={0} r={100} fill={C.amber} />
      {/* glasses */}
      <circle cx={-36} cy={-22} r={28} fill={C.text} stroke={C.amberDark} strokeWidth={8} />
      <circle cx={36} cy={-22} r={28} fill={C.text} stroke={C.amberDark} strokeWidth={8} />
      <line x1={-8} y1={-22} x2={8} y2={-22} stroke={C.amberDark} strokeWidth={8} />
      {blink ? null : (
        <>
          <circle cx={-30} cy={-20} r={10} fill={C.amberDark} />
          <circle cx={42} cy={-20} r={10} fill={C.amberDark} />
        </>
      )}
      <path d="M -24 30 q 24 22 48 0" stroke={C.amberDark} strokeWidth={8} fill="none" strokeLinecap="round" />
      {/* magnifier */}
      <g transform={`rotate(${scanning ? -30 + Math.sin(f / 4) * 12 : -20} 90 10)`}>
        <line x1={90} y1={10} x2={150} y2={-60} stroke={C.amberDark} strokeWidth={14} strokeLinecap="round" />
        <circle cx={165} cy={-80} r={34} fill="rgba(255,255,255,.15)" stroke={C.amberDark} strokeWidth={10} />
      </g>
      <text x={0} y={72} textAnchor="middle" fontFamily={MONO} fontSize={22} fontWeight={700} fill={C.amberDark}>
        RETRIEVER
      </text>
    </g>
  );
};

// speech bubble anchored at (x,y) = tail tip
const Bubble: React.FC<{x: number; y: number; w: number; lines: string[]; color?: string; o: number; flip?: boolean}> = ({
  x,
  y,
  w,
  lines,
  color = C.text,
  o,
  flip,
}) => {
  const h = 40 + lines.length * 46;
  const bx = flip ? x - w + 60 : x - 60;
  const by = y - 30 - h;
  return (
    <g opacity={o} transform={`translate(0 ${(1 - o) * 20})`}>
      <rect x={bx} y={by} width={w} height={h} rx={26} fill={C.ink} stroke={color} strokeWidth={4} />
      <path d={`M ${x - 18} ${by + h - 2} L ${x} ${y} L ${x + 18} ${by + h - 2}`} fill={C.ink} stroke={color} strokeWidth={4} strokeLinejoin="round" />
      <rect x={x - 16} y={by + h - 6} width={32} height={8} fill={C.ink} />
      {lines.map((l, i) => (
        <text key={i} x={bx + 30} y={by + 62 + i * 46} fontFamily={SANS} fontSize={36} fontWeight={600} fill={i === 0 ? color : C.muted}>
          {l}
        </text>
      ))}
    </g>
  );
};

const Stamp: React.FC<{x: number; y: number; text: string; color: string; p: number}> = ({x, y, text, color, p}) => {
  const s = interpolate(p, [0, 1], [2.4, 1]);
  return (
    <g opacity={Math.min(1, p * 1.5)} transform={`translate(${x} ${y}) rotate(-12) scale(${s})`}>
      <rect x={-170} y={-55} width={340} height={110} rx={14} fill="none" stroke={color} strokeWidth={10} />
      <text x={0} y={22} textAnchor="middle" fontFamily={MONO} fontSize={62} fontWeight={700} fill={color}>
        {text}
      </text>
    </g>
  );
};

// ---------- bookshelf ----------
const SHELF = {x: 600, w: 410, boards: [700, 880, 1060]};
type Book = {x: number; w: number; h: number; c: string; row: number; target?: string};
const BOOKS: Book[] = (() => {
  const out: Book[] = [];
  const palette = [C.bookA, C.bookB, C.bookC];
  const targets: Record<string, string> = {"0-2": "leave_policy", "1-5": "HR_handbook", "2-3": "FAQ"};
  SHELF.boards.forEach((_, row) => {
    let x = SHELF.x + 18;
    for (let i = 0; i < 8; i++) {
      const key = `${row}-${i}`;
      const w = targets[key] ? 36 : 30 + ((i * 7 + row * 5) % 16);
      const h = targets[key] ? 150 : 110 + ((i * 13 + row * 11) % 36);
      out.push({x, w, h, c: palette[(i + row) % 3], row, target: targets[key]});
      x += w + 8;
    }
  });
  return out;
})();

// ---------- scene timing ----------
const T = {
  hookEnd: 92,
  qIn: 96,
  wrong: 150,
  stamp: 178,
  khojeeIn: 214,
  shelfIn: 222,
  scan: 268,
  found: 312,
  fly: 344,
  read: 418,
  bulb: 438,
  answer: 456,
  ok: 486,
  outro: 560,
};

const subtitles: [number, string][] = [
  [0, "Ek LLM tha. Class ka topper."],
  [48, "Par usne sirf purani, public books padhi thi."],
  [96, "Exam mein aaya: company ki leave policy kya hai?"],
  [150, "Usne guess maar diya. Isse kehte hain hallucination."],
  [214, "Tab aaya Retriever. Uska kaam: sahi books dhundna."],
  [268, "Woh library (vector DB) mein similar pages search karta hai..."],
  [344, "...aur top 3 pages LLM ki desk pe rakh deta hai."],
  [418, "LLM ab padh ke answer deta hai."],
  [486, "Sahi answer, source ke saath!"],
  [560, "Yahi hai RAG: Retrieval Augmented Generation."],
  [650, "Retriever dhundta hai, LLM likhta hai."],
];

// ---------- main ----------
export const RagStory: React.FC = () => {
  const f = useCurrentFrame();
  const sp = useSp();

  // Bot mood timeline
  const mood: Mood = f >= T.answer ? "happy" : f >= T.read ? "read" : f >= T.wrong - 30 && f < T.khojeeIn ? "sweat" : "idle";

  // camera punch-in on the wrong answer
  const cam = interpolate(f, [T.stamp - 12, T.stamp, T.khojeeIn - 10, T.khojeeIn], [1, 1.07, 1.07, 1], clamp);
  const shake = f >= T.stamp && f < T.stamp + 14 ? Math.sin(f * 2.2) * (14 - (f - T.stamp)) : 0;

  // stage dims during outro
  const stageO = interpolate(f, [T.outro, T.outro + 15], [1, 0.12], clamp);

  // Khojee walk-in with hops
  const kx = interpolate(f, [T.khojeeIn, T.khojeeIn + 30], [1300, 820], {...clamp, easing: (t) => 1 - Math.pow(1 - t, 3)});
  const walking = f >= T.khojeeIn && f < T.khojeeIn + 30;
  const ky = 1200 - (walking ? Math.abs(Math.sin((f - T.khojeeIn) / 3)) * 40 : 0);

  const shelfO = interpolate(f, [T.shelfIn, T.shelfIn + 15], [0, 1], clamp);
  const scanX = interpolate(f, [T.scan, T.found - 4], [SHELF.x, SHELF.x + SHELF.w], clamp);
  const scanO = fadeIO(f, T.scan, T.found + 4, 6);
  const glow = f >= T.found ? 0.6 + 0.4 * Math.sin(f / 4) : 0;

  const targets = BOOKS.filter((b) => b.target);
  const deskTopY = 1150;
  const BOT_X = 330;

  return (
    <AbsoluteFill
      style={{
        background: C.bg,
        backgroundImage:
          "linear-gradient(rgba(74,222,128,.045) 2px,transparent 2px),linear-gradient(90deg,rgba(74,222,128,.045) 2px,transparent 2px)",
        backgroundSize: "72px 72px",
      }}
    >
      {/* header */}
      <div style={{position: "absolute", top: 70, left: 64, right: 64, display: "flex", justifyContent: "space-between", fontFamily: MONO, color: C.muted, fontSize: 30, letterSpacing: 6}}>
        <span>
          TECH KAHAANI · <span style={{color: C.green}}>001</span>
        </span>
        <span>@yourhandle</span>
      </div>

      {/* hook text */}
      <div style={{position: "absolute", top: 230, left: 64, right: 64, opacity: interpolate(f, [T.hookEnd - 10, T.hookEnd], [1, 0], clamp)}}>
        {[
          {at: 6, t: "Ek LLM tha.", c: C.text, s: 76},
          {at: 22, t: "Class ka topper.", c: C.green, s: 76},
          {at: 48, t: "Par syllabus purana tha...", c: C.muted, s: 52},
        ].map((l) => {
          const p = sp(l.at, 12);
          return (
            <div key={l.t} style={{fontFamily: SANS, fontWeight: 800, fontSize: l.s, color: l.c, opacity: p, transform: `translateX(${(1 - p) * -60}px)`, lineHeight: 1.25}}>
              {l.t}
            </div>
          );
        })}
      </div>

      {/* question card */}
      <div
        style={{
          position: "absolute",
          top: 200,
          left: 64,
          right: 64,
          opacity: Math.min(sp(T.qIn, 16), interpolate(f, [T.outro, T.outro + 10], [1, 0], clamp)),
          transform: `translateY(${(1 - sp(T.qIn, 16)) * -40}px)`,
          background: C.ink,
          border: `3px solid ${C.line}`,
          borderRadius: 26,
          padding: "26px 34px",
        }}
      >
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: 5, color: C.green}}>EXAM QUESTION</div>
        <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 700, color: C.text, marginTop: 8}}>Company ki leave policy kya hai?</div>
      </div>

      {/* stage */}
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0, opacity: stageO}}>
        <g transform="translate(0 110)">
        <g transform={`translate(${BOT_X + shake} 1050) scale(${cam}) translate(${-BOT_X} -1050)`}>
          {/* floor */}
          <line x1={60} y1={1310} x2={1020} y2={1310} stroke={C.line} strokeWidth={4} />

          {/* bookshelf */}
          <g opacity={shelfO}>
            <rect x={SHELF.x} y={520} width={SHELF.w} height={560} rx={12} fill="none" stroke={C.line} strokeWidth={6} />
            <text x={SHELF.x + SHELF.w / 2} y={505} textAnchor="middle" fontFamily={MONO} fontSize={26} letterSpacing={4} fill={C.muted}>
              LIBRARY = VECTOR DB
            </text>
            {SHELF.boards.map((by) => (
              <rect key={by} x={SHELF.x} y={by} width={SHELF.w} height={10} fill={C.line} />
            ))}
            {BOOKS.map((b, i) => {
              if (b.target && f >= T.fly) return null;
              const by = SHELF.boards[b.row];
              const isT = !!b.target && f >= T.found;
              return (
                <rect
                  key={i}
                  x={b.x}
                  y={by - b.h}
                  width={b.w}
                  height={b.h}
                  rx={5}
                  fill={isT ? C.green : b.c}
                  opacity={isT ? glow : 1}
                  stroke={isT ? C.green : "rgba(255,255,255,.08)"}
                  strokeWidth={3}
                />
              );
            })}
            {/* scan beam */}
            <rect x={scanX - 14} y={530} width={28} height={540} fill={C.amber} opacity={0.25 * scanO} rx={14} />
          </g>

          {/* desk */}
          <rect x={100} y={deskTopY} width={500} height={26} rx={8} fill={C.greenDark} />
          <rect x={130} y={deskTopY + 26} width={18} height={134} fill={C.greenDark} />
          <rect x={552} y={deskTopY + 26} width={18} height={134} fill={C.greenDark} />

          {/* Bot (behind the desk edge) */}
          <Bot x={BOT_X} y={990} mood={mood} f={f} pop={sp(4, 10)} />
          <rect x={100} y={deskTopY} width={500} height={26} rx={8} fill={C.greenDark} />

          {/* flying books → desk pile */}
          {f >= T.fly
            ? targets.map((b, i) => {
                const start = T.fly + i * 10;
                const t = interpolate(f, [start, start + 26], [0, 1], {...clamp, easing: (x) => 1 - Math.pow(1 - x, 2)});
                const sx = b.x + b.w / 2;
                const sy = SHELF.boards[b.row] - b.h / 2;
                const ex = 520;
                const ey = deskTopY - 20 - i * 40;
                const x = interpolate(t, [0, 1], [sx, ex]);
                const y = interpolate(t, [0, 1], [sy, ey]) - Math.sin(Math.PI * t) * 180;
                const r = interpolate(t, [0, 1], [0, 90]);
                return (
                  <g key={b.target} transform={`translate(${x} ${y}) rotate(${r})`}>
                    <rect x={-18} y={-75} width={36} height={150} rx={5} fill={C.green} stroke={C.green} strokeWidth={3} />
                    <text
                      x={0}
                      y={8}
                      textAnchor="middle"
                      transform="rotate(-90)"
                      fontFamily={MONO}
                      fontSize={19}
                      fontWeight={700}
                      fill={C.greenDark}
                      opacity={interpolate(t, [0.7, 1], [0, 1], clamp)}
                    >
                      {b.target}
                    </text>
                  </g>
                );
              })
            : null}

          {/* lightbulb */}
          {f >= T.bulb && f < T.outro ? (
            <g transform={`translate(${BOT_X - 120} 760) scale(${sp(T.bulb, 8)})`} opacity={0.9}>
              <circle cx={0} cy={0} r={34} fill={C.amber} />
              <rect x={-14} y={30} width={28} height={18} rx={4} fill={C.muted} />
              {[0, 1, 2, 3, 4].map((k) => {
                const a = (-150 + k * 30) * (Math.PI / 180);
                return <line key={k} x1={Math.cos(a) * 46} y1={Math.sin(a) * 46} x2={Math.cos(a) * 64} y2={Math.sin(a) * 64} stroke={C.amber} strokeWidth={6} strokeLinecap="round" />;
              })}
            </g>
          ) : null}

          {/* Khojee */}
          {f >= T.khojeeIn ? <Khojee x={kx} y={ky} f={f} scanning={f >= T.scan && f < T.found} /> : null}

          {/* bubbles */}
          <Bubble x={420} y={760} w={420} lines={["Umm... 30 din?", "(pakka pata nahi)"]} o={fadeIO(f, T.wrong, T.khojeeIn - 4)} />
          <Bubble x={820} y={1092} w={410} flip lines={["Ruko! Main", "library dekhta hoon."]} color={C.amber} o={fadeIO(f, T.khojeeIn + 30, T.scan + 4)} />
          <Bubble x={420} y={760} w={480} lines={["24 paid leaves!", "src: leave_policy.pdf"]} color={C.green} o={fadeIO(f, T.answer, T.outro)} />

          {/* stamps */}
          {f >= T.stamp && f < T.khojeeIn ? <Stamp x={540} y={1345} text="GALAT" color={C.red} p={sp(T.stamp, 12)} /> : null}
          {f >= T.ok && f < T.outro ? <Stamp x={540} y={1345} text="SAHI ✓" color={C.green} p={sp(T.ok, 12)} /> : null}
        </g>
        </g>
      </svg>

      {/* outro: R A G */}
      {f >= T.outro ? (
        <AbsoluteFill style={{alignItems: "center", justifyContent: "center", flexDirection: "column", paddingBottom: 200}}>
          <div style={{display: "flex", gap: 40}}>
            {[
              {l: "R", w: "Retrieval", c: C.amber},
              {l: "A", w: "Augmented", c: C.text},
              {l: "G", w: "Generation", c: C.green},
            ].map((x, i) => {
              const p = sp(T.outro + 8 + i * 10, 9);
              return (
                <div key={x.l} style={{textAlign: "center", opacity: Math.min(1, p), transform: `translateY(${(1 - p) * -260}px)`}}>
                  <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 220, color: x.c, lineHeight: 1}}>{x.l}</div>
                  <div style={{fontFamily: MONO, fontSize: 30, color: C.muted, marginTop: 10}}>{x.w}</div>
                </div>
              );
            })}
          </div>
          <div style={{marginTop: 90, textAlign: "center", fontFamily: SANS, fontSize: 52, lineHeight: 1.4, opacity: sp(T.outro + 60, 16)}}>
            <span style={{color: C.amber, fontWeight: 800}}>Retriever</span> <span style={{color: C.text}}>dhundta hai,</span>
            <br />
            <span style={{color: C.green, fontWeight: 800}}>LLM</span> <span style={{color: C.text}}>likhta hai.</span>
          </div>
          <div style={{marginTop: 70, fontFamily: MONO, fontSize: 30, letterSpacing: 5, color: C.muted, opacity: sp(T.outro + 105, 16)}}>
            NEXT KAHAANI → VECTOR DB
          </div>
        </AbsoluteFill>
      ) : null}

      {/* subtitles */}
      {(() => {
        const idx = subtitles.findLastIndex(([t]) => f >= t);
        const [start, text] = subtitles[idx];
        const o = interpolate(f, [start, start + 6], [0, 1], clamp);
        return (
          <div style={{position: "absolute", bottom: 130, left: 70, right: 70, textAlign: "center", fontFamily: SANS, fontWeight: 700, fontSize: 44, lineHeight: 1.3, color: C.sub, opacity: o, textShadow: "0 4px 18px rgba(0,0,0,.8)"}}>
            {text}
          </div>
        );
      })()}

      {/* progress */}
      <div style={{position: "absolute", bottom: 0, left: 0, height: 8, width: `${(f / STORY_TOTAL) * 100}%`, background: C.green}} />
    </AbsoluteFill>
  );
};
