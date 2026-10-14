// Debug Diaries · Entry 004 "The index nobody used" — cinematic cut (kinetic type, 3D point cloud, HUD, flash cuts).
// Timed to estimated voice parts; re-time P2/P3/RULE/P4/E4_TOTAL once the Sarvam audio is in.
//   P1 hook  "We added an index on email. Postgres ignored it, and scanned all four point eight million rows. Every single login."
//   P2 cause "The query said lower of email. The index only knows email. Wrap a column in a function, and the index can't see it."
//   P3 fix   "Fix: index the expression itself. Create index on lower of email. Two point four seconds became three milliseconds.
//            Rule: index exactly what your WHERE clause says."
//   P4 outro "Follow Debug Diaries for entry five."
import React from "react";
import {AbsoluteFill, Sequence, interpolate, spring, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";

const C = {bg: "#161719", card: "#1D1E21", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;

// ---- timing (frames @30fps) ----
export const P2 = 192; // cause starts
export const P3 = 435; // fix starts
export const RULE = 627; // "Rule: ..."
export const P4 = 723; // outro
export const E4_TOTAL = 825;

const ease = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const out = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
const typed = (t: string, f: number, at: number, cps = 55) => t.slice(0, Math.max(0, Math.floor(((f - at) / 30) * cps)));

// ---- 3D helpers ----
type V3 = [number, number, number];
const rot = ([x, y, z]: V3, ax: number, ay: number): V3 => {
  let c = Math.cos(ay), s = Math.sin(ay);
  [x, z] = [x * c + z * s, -x * s + z * c];
  c = Math.cos(ax); s = Math.sin(ax);
  [y, z] = [y * c - z * s, y * s + z * c];
  return [x, y, z];
};
const proj = ([x, y, z]: V3, cx: number, cy: number, cam = 4.4, f = 900): [number, number, number] => {
  const k = f / ((z + cam) * 300);
  return [cx + x * 300 * k, cy + y * 300 * k, k];
};

const N = 8;
const CUBE: V3[] = [];
for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) for (let k = 0; k < N; k++) CUBE.push([(i / (N - 1)) * 2 - 1, (j / (N - 1)) * 2 - 1, (k / (N - 1)) * 2 - 1]);

// B-tree layout: 1 root, 3, 9, 27 leaves; every other point becomes a row under a leaf.
const TREE: {pos: V3; kind: "node" | "row"; level: number; idx: number; leaf?: number; depth?: number}[] = [];
{
  const levels = [1, 3, 9, 27];
  const ys = [-1, -0.62, -0.24, 0.14];
  let p = 0;
  levels.forEach((n, l) => {
    for (let i = 0; i < n; i++) TREE.push({pos: [((i + 0.5) / n) * 2 - 1, ys[l], 0], kind: "node", level: l, idx: i}), p++;
  });
  for (let r = p; r < CUBE.length; r++) {
    const q = r - p;
    const leaf = q % 27;
    const depth = Math.floor(q / 27);
    TREE.push({pos: [((leaf + 0.5) / 27) * 2 - 1, 0.3 + depth * 0.052, 0], kind: "row", level: 4, idx: q, leaf, depth});
  }
}
const PATH = {l1: 1, l2: 4, leaf: 13, depth: 8};
const nodeIndex = (level: number, idx: number) => [0, 1, 4, 13][level] + idx;

// ---- shared bits ----
const Floor: React.FC = () => {
  const f = useCurrentFrame();
  const off = (f * 0.035) % 1;
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 14; i++) {
    const z = 0.6 + (i - off) * 0.55;
    if (z <= 0.35) continue;
    const y = 1080 + 820 / z;
    if (y > 1920) continue;
    lines.push(<line key={`h${i}`} x1={0} x2={1080} y1={y} y2={y} stroke={C.g} strokeOpacity={Math.min(0.14, 0.05 / z + 0.02)} strokeWidth={2} />);
  }
  for (let x = -8; x <= 8; x++) lines.push(<line key={`v${x}`} x1={540 + x * 70} y1={1110} x2={540 + x * 900} y2={1920} stroke={C.g} strokeOpacity={0.06} strokeWidth={2} />);
  return (
    <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
      <defs>
        <linearGradient id="fl" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.bg} stopOpacity={1} />
          <stop offset="0.35" stopColor={C.bg} stopOpacity={0} />
        </linearGradient>
      </defs>
      {lines}
      <rect x={0} y={1080} width={1080} height={840} fill="url(#fl)" />
    </svg>
  );
};

const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const sec = f / 30;
  const tc = `00:${String(Math.floor(sec)).padStart(2, "0")}.${String(Math.floor((sec % 1) * 100)).padStart(2, "0")}`;
  const b = 46, L = 64;
  const corners: [number, number, number, number][] = [[b, b, 1, 1], [1080 - b, b, -1, 1], [b, 1920 - b, 1, -1], [1080 - b, 1920 - b, -1, -1]];
  return (
    <>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {corners.map(([x, y, sx, sy], i) => <path key={i} d={`M${x} ${y + L * sy} L${x} ${y} L${x + L * sx} ${y}`} stroke={C.line} strokeWidth={4} fill="none" />)}
      </svg>
      <div style={{position: "absolute", left: 64, right: 64, top: 140, display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
        <span>DEBUG DIARIES · <span style={{color: C.g}}>004</span></span>
        <span style={{display: "flex", alignItems: "center", gap: 14, letterSpacing: "0.06em"}}>
          <span style={{width: 16, height: 16, borderRadius: 8, background: C.bug, opacity: Math.floor(f / 15) % 2 ? 1 : 0.3}} />
          REC {tc}
        </span>
      </div>
      <div style={{position: "absolute", left: 64, right: 64, top: 200, height: 5, background: C.line, borderRadius: 3}}>
        <div style={{width: `${(f / E4_TOTAL) * 100}%`, height: "100%", background: C.g, borderRadius: 3}} />
      </div>
    </>
  );
};

const Section: React.FC<{text: string; at?: number}> = ({text, at = 0}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", left: 64, top: 262, display: "flex", alignItems: "center", gap: 20, fontFamily: MONO, fontSize: 32, letterSpacing: "0.16em", color: C.g}}>
      <span style={{width: ease(f, at, at + 8) * 60, height: 4, background: C.g}} />
      <span>{typed(text, f, at + 3, 80)}</span>
    </div>
  );
};

// A word that slams in: big and wide-tracked, then settles.
const Slam: React.FC<{at: number; size: number; color?: string; children: React.ReactNode; style?: React.CSSProperties}> = ({at, size, color = C.text, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 13, mass: 0.55}});
  const o = interpolate(f, [at, at + 4], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: SANS, fontWeight: 900, fontStretch: "74%", textTransform: "uppercase", lineHeight: 0.92, fontSize: size, color,
        transform: `scale(${1 + (1 - s) * 1.3})`, transformOrigin: "left center", letterSpacing: `${(1 - s) * 0.25}em`, opacity: o, whiteSpace: "nowrap",
        filter: s < 0.6 ? `blur(${(0.6 - s) * 10}px)` : undefined, ...style,
      }}
    >
      {children}
    </div>
  );
};

const Card: React.FC<{title: string; tag?: string; tagColor?: string; border?: string; style?: React.CSSProperties; children: React.ReactNode}> = ({title, tag, tagColor = C.dim, border = C.line, style, children}) => (
  <div style={{position: "absolute", left: 64, right: 150, background: C.card, border: `2.5px solid ${border}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.4)", ...style}}>
    <div style={{display: "flex", alignItems: "center", gap: 11, padding: "14px 22px", borderBottom: `2px solid ${C.line}`}}>
      {[0, 1, 2].map((i) => <span key={i} style={{width: 14, height: 14, borderRadius: 7, background: "#3A3C42"}} />)}
      <span style={{marginLeft: 10, fontFamily: MONO, fontSize: 22, color: C.dim}}>{title}</span>
      {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 21, color: tagColor}}>● {tag}</span> : null}
    </div>
    <div style={{padding: "18px 26px", fontFamily: MONO, fontSize: 27, lineHeight: 1.6, whiteSpace: "pre"}}>{children}</div>
  </div>
);

// ---- scene 1: hook + table scan ----
const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const ax = -0.42, ay = 0.6 + f * 0.012;
  const sweep = interpolate(f, [104, 172], [-1.05, 1.05], clamp);
  const pts = CUBE.map((p) => {
    const r = rot(p, ax, ay);
    const [x, y, k] = proj(r, 540, 860);
    const scanned = p[0] < sweep;
    const near = Math.abs(p[0] - sweep) < 0.16;
    return {x, y, z: r[2], k, scanned, near};
  }).sort((a, b) => b.z - a.z);
  // the scan plane: the slice of the cube at x = sweep
  const plane = ([[-1, -1], [-1, 1], [1, 1], [1, -1]] as const).map(([y, z]) => proj(rot([sweep, y, z], ax, ay), 540, 860));
  const scanning = f >= 104 && f <= 172;
  const rows = Math.round(4812330 * interpolate(f, [104, 172], [0, 1], clamp));
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 268}}>
        <Slam at={-30} size={94}>We added an index.</Slam>
        <Slam at={64} size={94} color={C.bug} style={{marginTop: 10}}>Postgres ignored it.</Slam>
      </div>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={(p.near && scanning ? 7 : 4.4) * p.k} fill={p.scanned ? C.bug : C.g} opacity={(p.scanned ? 0.85 : 0.5) * Math.min(1, 0.35 + p.k * 0.55)} />
        ))}
        {scanning ? <polygon points={plane.map((q) => `${q[0]},${q[1]}`).join(" ")} fill={C.bug} fillOpacity={0.08} stroke={C.bug} strokeWidth={3} strokeOpacity={0.9} /> : null}
      </svg>
      <div style={{position: "absolute", right: 150, top: 1050, fontFamily: MONO, fontSize: 24, color: C.dim, textAlign: "right", opacity: out(f, 104, 112)}}>
        TABLE users<br />
        <span style={{color: C.bug, fontSize: 30}}>{rows.toLocaleString("en-US")}</span> rows read
      </div>
      {f > 160 ? (
        <div style={{position: "absolute", left: 64, top: 1060}}>
          <Slam at={162} size={46} color={C.bug}>× every single login</Slam>
        </div>
      ) : null}
      <Card title="psql — prod" tag={f > 108 ? "SEQ SCAN" : "QUERY"} tagColor={f > 108 ? C.bug : C.dim} style={{top: 1150}}>
        <span style={{color: C.dim}}>{"> "}</span>
        {typed("SELECT * FROM users", f, -10, 60)}
        {"\n  "}
        {typed("WHERE lower(email) = $1;", f, 14, 60)}
        {"\n"}
        <span style={{color: C.bug, opacity: f > 108 ? 1 : 0}}>{"Seq Scan on users"}</span>
        <span style={{color: C.dim, opacity: f > 170 ? 1 : 0}}>{"  2,431 ms"}</span>
      </Card>
    </AbsoluteFill>
  );
};

// ---- scene 2: the cause ----
const Cause: React.FC = () => {
  const f = useCurrentFrame();
  const close = out(f, 150, 166); // lower( ) wraps around email
  const arrow = interpolate(f, [176, 198], [0, 1], {...clamp, easing: Easing.in(Easing.quad)});
  const bounce = f > 198 ? interpolate(f, [198, 214], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  const ax = 40 + arrow * 180 - bounce * 110;
  return (
    <AbsoluteFill>
      <Section text="02 / THE CAUSE" />
      <div style={{position: "absolute", left: 64, top: 360}}>
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.14em", color: C.dim, opacity: out(f, 14, 20)}}>THE QUERY ASKS FOR</div>
        <Slam at={18} size={110} color={C.bug} style={{marginTop: 8, textTransform: "none", fontFamily: MONO, fontWeight: 700, letterSpacing: "-0.02em"}}>lower(email)</Slam>
        <div style={{fontFamily: MONO, fontSize: 26, letterSpacing: "0.14em", color: C.dim, marginTop: 50, opacity: out(f, 80, 86)}}>THE INDEX ONLY KNOWS</div>
        <Slam at={84} size={110} color={C.g} style={{marginTop: 8, textTransform: "none", fontFamily: MONO, fontWeight: 700}}>email</Slam>
      </div>
      <div style={{position: "absolute", right: 170, top: 540}}>
        <Slam at={120} size={210} color={C.bug} style={{transformOrigin: "center"}}>≠</Slam>
      </div>
      {/* the wrapper: index arrow can't get inside lower( ) */}
      <div style={{position: "absolute", left: 64, right: 150, top: 900, height: 250, border: `2.5px solid ${C.line}`, borderRadius: 24, background: C.card, opacity: out(f, 140, 150), overflow: "hidden"}}>
        <div style={{position: "absolute", left: ax, top: 104, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 26, color: C.g, opacity: f > 172 ? 1 : 0}}>
          idx_email <span style={{display: "inline-block", width: 70, height: 4, background: C.g, margin: "0 0 0 12px"}} />▶
        </div>
        <div style={{position: "absolute", left: 400, top: 82, display: "flex", alignItems: "center", fontFamily: MONO, fontSize: 54, fontWeight: 700}}>
          <span style={{color: C.bug, transform: `translateX(${(1 - close) * -120}px)`, opacity: close}}>lower(</span>
          <span style={{color: C.g, padding: "0 6px"}}>email</span>
          <span style={{color: C.bug, transform: `translateX(${(1 - close) * 120}px)`, opacity: close}}>)</span>
        </div>
        {f > 198 ? <div style={{position: "absolute", left: 350, top: 40, fontFamily: MONO, fontSize: 40, fontWeight: 700, color: C.bug, opacity: 1 - out(f, 226, 240) * 0.3}}>✕</div> : null}
      </div>
      <div style={{position: "absolute", left: 64, top: 1200}}>
        <Slam at={150} size={60}>Function on the column</Slam>
        <Slam at={196} size={60} color={C.bug} style={{marginTop: 8}}>= index can't see it.</Slam>
      </div>
    </AbsoluteFill>
  );
};

// ---- scene 3: the fix, the cloud becomes a B-tree ----
const Fix: React.FC = () => {
  const f = useCurrentFrame();
  const m = ease(f, 70, 118);
  const ax = -0.42 * (1 - m), ay = (0.6 + (P3 + f) * 0.012) * (1 - m);
  const cx = 540, cy = 1050, R = 0.98;
  const pts = CUBE.map((p, i) => {
    const t = TREE[i];
    const a = rot(p, ax, ay);
    const pos: V3 = [a[0] + (t.pos[0] * 1.45 - a[0]) * m, a[1] + (t.pos[1] * 1.05 - a[1]) * m, a[2] * (1 - m)];
    const [x, y, k] = proj([pos[0] * R, pos[1] * R, pos[2] * R], cx, cy);
    return {x, y, z: pos[2], k, t, i};
  });
  const by = [...pts].sort((a, b) => b.z - a.z);
  const P = (level: number, idx: number) => pts[nodeIndex(level, idx)];
  const edges = out(f, 112, 128);
  const lit = (step: number) => f > 128 + step * 7;
  const pathEdges: [number, number, number, number][] = [[0, 0, 1, PATH.l1], [1, PATH.l1, 2, PATH.l2], [2, PATH.l2, 3, PATH.leaf]];
  const rowHit = pts.find((p) => p.t.kind === "row" && p.t.leaf === PATH.leaf && p.t.depth === PATH.depth);
  const ms = Math.round(interpolate(f, [140, 168], [2431, 3], {...clamp, easing: Easing.out(Easing.cubic)}));
  return (
    <AbsoluteFill>
      <Section text="03 / THE FIX" />
      <div style={{position: "absolute", left: 64, top: 330}}>
        <Slam at={2} size={88}>Index the</Slam>
        <Slam at={10} size={88} color={C.g} style={{marginTop: 6}}>expression.</Slam>
      </div>
      <Card title="migration.sql" tag={f > 130 ? "INDEX SCAN · 4 HOPS" : f > 118 ? "FIX" : "TYPING"} tagColor={f > 118 ? C.g : C.dim} border={f > 118 ? C.g : C.line} style={{top: 555}}>
        {typed("CREATE INDEX ON users", f, 66, 50)}
        {"\n  "}
        <span>{typed("(", f, 88, 50)}</span>
        <span style={{color: C.g}}>{typed("lower(email)", f, 90, 50)}</span>
        <span>{typed(");", f, 104, 50)}</span>
      </Card>
      <svg width={1080} height={1920} style={{position: "absolute", inset: 0}}>
        {edges > 0
          ? TREE.filter((t) => t.kind === "node" && t.level > 0).map((t, j) => {
              const child = P(t.level, t.idx);
              const parent = P(t.level - 1, Math.floor(t.idx / 3));
              const onPath = pathEdges.some(([pl, pi, cl, ci]) => pl === t.level - 1 && pi === Math.floor(t.idx / 3) && cl === t.level && ci === t.idx);
              const isLit = onPath && lit(t.level);
              return <line key={j} x1={parent.x} y1={parent.y} x2={child.x} y2={child.y} stroke={isLit ? C.g : C.line} strokeWidth={isLit ? 5 : 2.5} opacity={edges} />;
            })
          : null}
        {by.map((p) => {
          const node = p.t.kind === "node";
          const onPath = node && ((p.t.level === 0) || (p.t.level === 1 && p.t.idx === PATH.l1) || (p.t.level === 2 && p.t.idx === PATH.l2) || (p.t.level === 3 && p.t.idx === PATH.leaf));
          const isLit = onPath && lit(p.t.level);
          const color = m < 0.5 ? C.bug : node ? (isLit ? C.g : C.text) : C.dim;
          const r = m < 0.5 ? 4.4 * p.k : node ? (isLit ? 11 : 7.5) : 2.6;
          return <circle key={p.i} cx={p.x} cy={p.y} r={r} fill={node && m > 0.5 && !isLit ? C.card : color} stroke={node && m > 0.5 ? color : "none"} strokeWidth={3} opacity={m < 0.5 ? 0.55 : node ? 1 : 0.55} />;
        })}
        {rowHit && f > 156 ? <circle cx={rowHit.x} cy={rowHit.y} r={9 + Math.sin(f / 3) * 2} fill={C.g} /> : null}
      </svg>
      {f > 136 ? (
        <div style={{position: "absolute", left: 64, top: 1345, display: "flex", alignItems: "baseline", gap: 26, fontFamily: SANS, fontWeight: 900, fontStretch: "78%"}}>
          <span style={{fontSize: 54, color: C.bug, textDecoration: f > 168 ? "line-through" : "none", opacity: 0.85}}>2,431 ms</span>
          <span style={{fontSize: 40, color: C.dim}}>→</span>
          <span style={{fontSize: 120, color: C.g, lineHeight: 1}}>{f > 168 ? "3" : ms.toLocaleString("en-US")} ms</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

// ---- scene 4: the rule + next ----
const Rule: React.FC = () => {
  const f = useCurrentFrame();
  const n = P4 - RULE; // outro starts here
  return (
    <AbsoluteFill>
      <Section text="04 / THE RULE" />
      <div style={{position: "absolute", left: 64, top: 340}}>
        <Slam at={2} size={104}>Index exactly</Slam>
        <Slam at={14} size={104} style={{marginTop: 8}}>what your</Slam>
        <Slam at={28} size={104} color={C.g} style={{marginTop: 8}}>where says.</Slam>
      </div>
      <div style={{position: "absolute", left: 64, right: 150, top: 760, display: "grid", gap: 14, fontFamily: MONO, fontSize: 30}}>
        {[
          ["WHERE", "lower(email) = $1", 40],
          ["INDEX", "(lower(email))", 52],
        ].map(([k, v, at]) => (
          <div key={k as string} style={{display: "flex", gap: 22, padding: "18px 24px", borderRadius: 18, background: C.card, border: `2px solid ${C.line}`, opacity: out(f, at as number, (at as number) + 8), transform: `translateX(${(1 - out(f, at as number, (at as number) + 8)) * 40}px)`}}>
            <span style={{color: C.dim, width: 110}}>{k}</span>
            <span style={{color: C.g}}>{v}</span>
            {k === "INDEX" && f > 64 ? <span style={{marginLeft: "auto", color: C.g}}>✓ match</span> : null}
          </div>
        ))}
      </div>
      {f > n - 4 ? (
        <div style={{position: "absolute", left: 64, right: 150, top: 1060, borderRadius: 24, background: "#232428", borderLeft: `8px solid ${C.bug}`, padding: "22px 30px", opacity: out(f, n - 4, n + 6), transform: `translateY(${(1 - out(f, n - 4, n + 6)) * 30}px)`}}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>NEXT · 005</div>
          <div style={{fontFamily: SANS, fontSize: 48, fontWeight: 800, marginTop: 6, color: C.text}}>
            The <span style={{color: C.bug}}>N+1 query</span> your ORM hid
          </div>
          <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed("follow @debugdiaries.io", f, n + 10, 40)}</div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

const Flash: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [at, at + 5], [0.22, 0], clamp);
  return f >= at && f < at + 5 ? <AbsoluteFill style={{background: "#ffffff", opacity: a}} /> : null;
};

export const DebugDiaries004: React.FC = () => (
  <AbsoluteFill style={{background: C.bg, color: C.text}}>
    <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.022) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.022) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
    <Floor />
    <Sequence durationInFrames={P2}><Hook /></Sequence>
    <Sequence from={P2} durationInFrames={P3 - P2}><Cause /></Sequence>
    <Sequence from={P3} durationInFrames={RULE - P3}><Fix /></Sequence>
    <Sequence from={RULE} durationInFrames={E4_TOTAL - RULE}><Rule /></Sequence>
    {[P2, P3, RULE].map((c) => <Flash key={c} at={c} />)}
    <Hud />
  </AbsoluteFill>
);
