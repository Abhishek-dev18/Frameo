// Plays any screenplay (see types.ts). Minimal theme: grey, white, mint green, coral for bugs.
// Lessons from Debug Diaries baked in: the first block is on screen at frame 0, scenes cross-fade
// (never through an empty screen), each block animates in, music sits underneath.
import React from "react";
import {AbsoluteFill, Audio, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from "remotion";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/700.css";
import type {Block, Icon, Scene, ScreenplayProps} from "./types";
import {FPS, totalFrames} from "./types";

const C = {bg: "#161719", card: "#1D1E21", card2: "#232428", line: "#2C2E33", dim: "#7C8089", text: "#ECEDEF", g: "#4ADE80", bug: "#FF7A6B"};
const MONO = "'JetBrains Mono', monospace";
const SANS = "'Archivo Variable', Inter, sans-serif";
const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
const XF = 8; // cross-fade frames
const TOP = 360; // where blocks start
const BOTTOM = 1560; // keep clear of the platform caption/buttons
const LEFT = 64;
const RIGHT = 150; // keep clear of the like/comment column

const useSpring = (at: number, damping = 16) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - at, fps, config: {damping, mass: 0.7}});
};
const lerp = (f: number, a: number, b: number) => interpolate(f, [a, b], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
const typed = (t: string, f: number, at: number, cps = 45) => t.slice(0, Math.max(0, Math.floor(((f - at) / FPS) * cps)));

// *word* → green, !word! → coral
const Rich: React.FC<{text: string}> = ({text}) => {
  const parts = String(text || "").split(/(\*[^*]+\*|![^!]+!)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") ? <span key={i} style={{color: C.g}}>{p.slice(1, -1)}</span> : p.startsWith("!") && p.endsWith("!") && p.length > 2 ? <span key={i} style={{color: C.bug}}>{p.slice(1, -1)}</span> : <React.Fragment key={i}>{p}</React.Fragment>,
      )}
    </>
  );
};
const plain = (s: string) => String(s || "").replace(/[*!]/g, "");

const Card: React.FC<{title?: string; tag?: string; tagColor?: string; border?: string; children: React.ReactNode}> = ({title, tag, tagColor = C.dim, border = C.line, children}) => (
  <div style={{background: C.card, border: `2.5px solid ${border}`, borderRadius: 26, overflow: "hidden", boxShadow: "0 24px 60px rgba(0,0,0,.35)"}}>
    {title ? (
      <div style={{display: "flex", alignItems: "center", gap: 12, padding: "16px 24px", borderBottom: `2px solid ${C.line}`, background: "rgba(255,255,255,.02)"}}>
        {[0, 1, 2].map((i) => <span key={i} style={{width: 16, height: 16, borderRadius: 8, background: "#3A3C42"}} />)}
        <span style={{marginLeft: 12, fontFamily: MONO, fontSize: 24, color: C.dim}}>{title}</span>
        {tag ? <span style={{marginLeft: "auto", fontFamily: MONO, fontSize: 22, color: tagColor}}>● {tag}</span> : null}
      </div>
    ) : null}
    <div style={{padding: "24px 30px"}}>{children}</div>
  </div>
);

// ---------- icons ----------
const IconShape: React.FC<{icon: Icon; c: string; s?: number}> = ({icon, c, s = 1}) => {
  const box = {transform: `scale(${s})`, opacity: Math.min(1, s * 1.2)} as React.CSSProperties;
  switch (icon) {
    case "phone":
      return <div style={{...box, width: 72, height: 120, border: `4px solid ${c}`, borderRadius: 15, position: "relative"}}><div style={{position: "absolute", inset: "11px 9px 24px", background: `${c}33`, borderRadius: 4}} /></div>;
    case "user":
      return (
        <div style={{...box, width: 110, height: 120, display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
          <div style={{width: 46, height: 46, borderRadius: 23, border: `4px solid ${c}`}} />
          <div style={{width: 86, height: 50, borderRadius: "43px 43px 10px 10px", border: `4px solid ${c}`}} />
        </div>
      );
    case "db":
      return (
        <div style={{...box, width: 110, height: 120, position: "relative"}}>
          <div style={{position: "absolute", inset: "14px 0 14px", borderLeft: `4px solid ${c}`, borderRight: `4px solid ${c}`}} />
          {[0, 46, 92].map((y, i) => <div key={i} style={{position: "absolute", left: 0, right: 0, top: y, height: 28, borderRadius: "50%", border: `4px solid ${c}`, background: i === 0 ? C.card : "transparent"}} />)}
        </div>
      );
    case "cloud":
      return (
        <div style={{...box, width: 140, height: 120, position: "relative"}}>
          <div style={{position: "absolute", left: 10, right: 10, bottom: 20, height: 52, borderRadius: 26, border: `4px solid ${c}`}} />
          <div style={{position: "absolute", left: 40, bottom: 44, width: 64, height: 64, borderRadius: 32, border: `4px solid ${c}`, borderBottomColor: "transparent", borderRightColor: "transparent", transform: "rotate(45deg)"}} />
        </div>
      );
    case "cache":
      return <div style={{...box, width: 120, height: 110, borderRadius: 18, border: `4px dashed ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 26, color: c}}>cache</div>;
    case "x":
      return <div style={{...box, width: 120, height: 120, borderRadius: 24, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 64, fontWeight: 700, color: c}}>✕</div>;
    case "check":
      return <div style={{...box, width: 120, height: 120, borderRadius: 24, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 64, fontWeight: 700, color: c}}>✓</div>;
    default: // server
      return (
        <div style={{...box, width: 140, height: 112, border: `4px solid ${c}`, borderRadius: 16, display: "flex", flexDirection: "column"}}>
          {[0, 1].map((i) => (
            <div key={i} style={{flex: 1, borderTop: i ? `3px solid ${c}` : "none", display: "flex", alignItems: "center", gap: 12, padding: "0 14px"}}>
              <span style={{width: 13, height: 13, borderRadius: 7, background: c}} />
              <span style={{flex: 1, height: 4, background: `${c}88`, borderRadius: 2}} />
            </div>
          ))}
        </div>
      );
  }
};

// ---------- blocks ----------
type BP<T> = {b: T; at: number; len: number};

const Headline: React.FC<BP<Extract<Block, {type: "headline"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = String(b.text || "").split(" ");
  // keep highlight markers attached to words
  return (
    <div>
      {b.lead ? <div style={{fontFamily: SANS, fontSize: 46, fontWeight: 700, color: C.text, marginBottom: 12, opacity: lerp(f, at - 6, at + 4)}}><Rich text={b.lead} /></div> : null}
      <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "76%", textTransform: "uppercase", fontSize: 104, lineHeight: 0.92, display: "flex", flexWrap: "wrap", gap: "0 24px"}}>
        {words.map((w, i) => {
          const s = spring({frame: f - at - i * 3, fps, config: {damping: 16, mass: 0.6}});
          return (
            <span key={i} style={{display: "inline-block", overflow: "hidden", paddingBottom: 8}}>
              <span style={{display: "inline-block", transform: `translateY(${(1 - s) * 105}%)`}}><Rich text={w} /></span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

const Flow: React.FC<BP<Extract<Block, {type: "flow"}>>> = ({b, at, len}) => {
  const f = useCurrentFrame();
  const nodes = (b.nodes || []).slice(0, 4);
  const bad = typeof b.bad === "number" ? b.bad : -1;
  const step = Math.min(16, (len * 0.5) / Math.max(1, nodes.length));
  return (
    <Card title={b.title || "flow"} tag={bad >= 0 && f > at + step * nodes.length ? "BROKEN" : "LIVE"} tagColor={bad >= 0 && f > at + step * nodes.length ? C.bug : C.g}>
      <div style={{display: "flex", alignItems: "flex-end", gap: 6, paddingTop: 6}}>
        {nodes.map((n, i) => {
          const c = bad >= 0 && i >= bad ? C.bug : C.g;
          const s = interpolate(f, [at + i * step, at + i * step + 8], [0.4, 1], clamp);
          const arrow = i < nodes.length - 1 ? lerp(f, at + i * step + 4, at + (i + 1) * step) : 0;
          const ac = bad >= 0 && i + 1 >= bad ? C.bug : C.g;
          const loop = f > at + nodes.length * step ? ((f - at) % 40) / 40 : -1;
          return (
            <React.Fragment key={i}>
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 130}}>
                <IconShape icon={n.icon} c={c} s={s} />
                <span style={{fontFamily: MONO, fontSize: 26, color: C.text, whiteSpace: "nowrap", opacity: s}}>{plain(n.label).slice(0, 14)}</span>
              </div>
              {i < nodes.length - 1 ? (
                <div style={{flex: 1, height: 4, position: "relative", marginBottom: 52, background: C.line}}>
                  <div style={{position: "absolute", left: 0, top: 0, bottom: 0, width: `${arrow * 100}%`, background: ac}} />
                  {arrow >= 1 ? <div style={{position: "absolute", right: -2, top: -9, width: 0, height: 0, borderLeft: `18px solid ${ac}`, borderTop: "11px solid transparent", borderBottom: "11px solid transparent"}} /> : null}
                  {loop >= 0 ? <div style={{position: "absolute", top: -6, left: `calc(${loop * 100}% - 8px)`, width: 16, height: 16, borderRadius: 8, background: ac}} /> : null}
                </div>
              ) : null}
            </React.Fragment>
          );
        })}
      </div>
    </Card>
  );
};

const Code: React.FC<BP<Extract<Block, {type: "code"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const lines = (b.lines || []).slice(0, 6);
  let t = at + 2;
  const tag = b.tag || "INFO";
  const tagColor = tag === "BUG" ? C.bug : tag === "FIX" ? C.g : C.dim;
  return (
    <Card title={b.file || "code"} tag={tag} tagColor={tagColor} border={tag === "FIX" ? C.g : C.line}>
      <div style={{fontFamily: MONO, fontSize: 32, lineHeight: 1.65, whiteSpace: "pre", overflow: "hidden"}}>
        {lines.map((l, i) => {
          const start = t;
          t += Math.max(6, (l.length / 70) * FPS);
          const shown = typed(l, f, start, 70);
          const done = shown.length >= l.length;
          const idx = b.mark ? l.indexOf(b.mark) : -1;
          if (done && idx >= 0) {
            const ring = lerp(f, t + 2, t + 12);
            return (
              <div key={i}>
                {l.slice(0, idx)}
                <span style={{position: "relative", color: ring > 0.5 ? (tag === "FIX" ? C.g : C.bug) : C.text}}>
                  {b.mark}
                  <span style={{position: "absolute", inset: "-6px -12px", border: `4px solid ${tag === "FIX" ? C.g : C.bug}`, borderRadius: 40, opacity: ring, transform: `scale(${1.3 - ring * 0.3})`}} />
                </span>
                {l.slice(idx + b.mark!.length)}
              </div>
            );
          }
          return <div key={i} style={{color: l.trim().startsWith("//") ? C.dim : C.text}}>{shown || " "}</div>;
        })}
      </div>
    </Card>
  );
};

const Compare: React.FC<BP<Extract<Block, {type: "compare"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const l = useSpring(at + 2, 12);
  const r = useSpring(at + 12, 12);
  const sym = useSpring(at + 22, 10);
  const Side: React.FC<{d: {label: string; value: string; note?: string}; c: string; s: number}> = ({d, c, s}) => (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 14, width: 280, opacity: s}}>
      <div style={{minWidth: 140, height: 140, padding: "0 20px", borderRadius: 70, border: `4px solid ${c}`, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 34, fontWeight: 700, color: c, transform: `scale(${s})`}}>{plain(d.value).slice(0, 10)}</div>
      <span style={{fontFamily: MONO, fontSize: 28, color: C.text, textAlign: "center"}}>{plain(d.label).slice(0, 18)}</span>
      {d.note ? <span style={{fontFamily: MONO, fontSize: 22, color: C.dim, textAlign: "center"}}>{plain(d.note).slice(0, 22)}</span> : null}
    </div>
  );
  return (
    <Card title={b.title || "compare"}>
      <div style={{display: "flex", alignItems: "center", justifyContent: "space-around"}}>
        <Side d={b.left} c={C.g} s={l} />
        <div style={{fontFamily: MONO, fontSize: 64, color: C.bug, transform: `scale(${sym})`, marginBottom: 60}}>{b.symbol || "≠"}</div>
        <Side d={b.right} c={C.bug} s={r} />
      </div>
      <div style={{height: 4, opacity: f > 0 ? 0 : 0}} />
    </Card>
  );
};

const Diff: React.FC<BP<Extract<Block, {type: "diff"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const minus = lerp(f, at, at + 6);
  const strike = interpolate(f, [at + 14, at + 26], [0, 100], clamp);
  const plus = useSpring(at + 26, 14);
  const fixed = f > at + 30;
  return (
    <Card title={b.file || "git diff"} tag={fixed ? "FIXED" : "EDITING"} tagColor={fixed ? C.g : C.dim} border={fixed ? C.g : C.line}>
      <div style={{fontFamily: MONO, fontSize: 30, lineHeight: 1.7, whiteSpace: "pre", overflow: "hidden"}}>
        <div style={{color: C.bug, background: `${C.bug}1A`, margin: "0 -30px", padding: "0 30px", opacity: minus, position: "relative"}}>
          - {b.minus}
          <span style={{position: "absolute", left: 60, top: "50%", height: 3, width: `calc(${strike}% - 90px)`, background: C.bug, opacity: 0.7}} />
        </div>
        <div style={{color: C.g, background: `${C.g}1F`, margin: "0 -30px", padding: "0 30px", opacity: plus, transform: `translateX(${(1 - plus) * 40}px)`}}>+ {b.plus}</div>
      </div>
    </Card>
  );
};

const Stat: React.FC<BP<Extract<Block, {type: "stat"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const raw = String(b.value || "");
  const m = raw.match(/^([^\d]*)([\d,.]+)(.*)$/);
  let shown = raw;
  if (m) {
    const target = Number(m[2].replace(/,/g, ""));
    if (Number.isFinite(target)) {
      const v = target * interpolate(f, [at, at + 24], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
      const dec = (m[2].split(".")[1] || "").length;
      shown = `${m[1]}${dec ? v.toFixed(dec) : Math.round(v).toLocaleString("en-IN")}${m[3]}`;
    }
  }
  const c = b.tone === "good" ? C.g : C.bug;
  return (
    <div style={{opacity: lerp(f, at - 4, at + 4)}}>
      <div style={{fontFamily: SANS, fontWeight: 900, fontStretch: "80%", fontSize: 140, lineHeight: 0.9, color: c}}>{shown}</div>
      <div style={{fontFamily: MONO, fontSize: 32, color: C.text, marginTop: 10}}><Rich text={b.label} /></div>
    </div>
  );
};

const Steps: React.FC<BP<Extract<Block, {type: "steps"}>>> = ({b, at, len}) => {
  const f = useCurrentFrame();
  const items = (b.items || []).slice(0, 5);
  const gap = Math.min(20, (len * 0.6) / Math.max(1, items.length));
  return (
    <Card title={b.title || "steps"}>
      <div style={{display: "flex", flexDirection: "column", gap: 18}}>
        {items.map((it, i) => {
          const s = lerp(f, at + i * gap, at + i * gap + 8);
          const active = f >= at + i * gap && (i === items.length - 1 || f < at + (i + 1) * gap);
          return (
            <div key={i} style={{display: "flex", alignItems: "center", gap: 20, opacity: Math.max(0.15, s), transform: `translateX(${(1 - s) * 30}px)`}}>
              <span style={{width: 52, height: 52, flex: "0 0 52px", borderRadius: 26, display: "grid", placeItems: "center", fontFamily: MONO, fontSize: 24, fontWeight: 700, background: active ? C.g : "transparent", color: active ? C.bg : C.g, border: `3px solid ${C.g}`}}>{i + 1}</span>
              <span style={{fontFamily: SANS, fontSize: 36, fontWeight: 600, color: C.text}}><Rich text={it} /></span>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Cheatsheet: React.FC<BP<Extract<Block, {type: "cheatsheet"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const rows = (b.rows || []).slice(0, 6);
  return (
    <div style={{background: C.card, border: `2.5px solid ${C.line}`, borderRadius: 26, overflow: "hidden"}}>
      <div style={{padding: "16px 24px", borderBottom: `2px solid ${C.line}`, fontFamily: MONO, fontSize: 24, color: C.dim}}>{plain(b.title || "cheat sheet")} · save this</div>
      {rows.map((r, i) => (
        <div key={i} style={{display: "flex", justifyContent: "space-between", gap: 24, padding: "18px 28px", borderTop: i ? `2px solid ${C.line}` : "none", opacity: lerp(f, at + 4 + i * 7, at + 10 + i * 7)}}>
          <span style={{fontFamily: MONO, fontSize: 29, color: C.g}}>{plain(r.k)}</span>
          <span style={{fontFamily: SANS, fontSize: 30, color: C.text, textAlign: "right"}}>{plain(r.v)}</span>
        </div>
      ))}
    </div>
  );
};

const Log: React.FC<BP<Extract<Block, {type: "log"}>>> = ({b, at}) => {
  const f = useCurrentFrame();
  const lines = (b.lines || []).slice(0, 5);
  return (
    <Card title={b.title || "prod — logs"} tag={lines.some((l) => /error|fail/i.test(l)) ? "ERROR" : "LIVE"} tagColor={lines.some((l) => /error|fail/i.test(l)) ? C.bug : C.g}>
      <div style={{fontFamily: MONO, fontSize: 28, lineHeight: 1.6}}>
        {lines.map((l, i) => {
          const start = at + i * 10;
          const m = l.match(/^(ERROR|WARN|INFO|OK)\b\s*(.*)$/i);
          const lvl = m ? m[1].toUpperCase() : "";
          const color = lvl === "ERROR" ? C.bug : lvl === "WARN" ? "#F5B544" : C.g;
          return (
            <div key={i} style={{opacity: f >= start ? 1 : 0}}>
              {lvl ? <span style={{color}}>{lvl} </span> : <span style={{color: C.g}}>$ </span>}
              {typed(m ? m[2] : l, f, start, 60)}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

const Next: React.FC<BP<Extract<Block, {type: "next"}>> & {handle: string; n: number}> = ({b, at, handle, n}) => {
  const f = useCurrentFrame();
  const s = useSpring(at, 14);
  return (
    <div style={{borderRadius: 26, background: C.card2, borderLeft: `8px solid ${C.bug}`, padding: "24px 30px", opacity: s, transform: `translateY(${(1 - s) * 30}px)`}}>
      <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.dim}}>NEXT{n ? ` · ${String(n + 1).padStart(3, "0")}` : ""}</div>
      <div style={{fontFamily: SANS, fontSize: 50, fontWeight: 800, marginTop: 6}}><Rich text={b.text} /></div>
      {handle ? <div style={{fontFamily: MONO, fontSize: 28, color: C.g, marginTop: 12}}>{typed(`follow ${handle}`, f, at + 12, 40)}</div> : null}
    </div>
  );
};

// rough height of each block, used to scale a crowded scene down so it never overflows
const estimate = (b: Block): number => {
  switch (b.type) {
    case "headline": return (b.lead ? 70 : 0) + Math.ceil(plain(b.text).length / 14) * 96;
    case "flow": return 300;
    case "code": return 90 + Math.min(6, b.lines?.length || 1) * 53 + 50;
    case "compare": return 380;
    case "diff": return 90 + 2 * 51 + 50;
    case "stat": return 190;
    case "steps": return 90 + Math.min(5, b.items?.length || 1) * 72 + 30;
    case "cheatsheet": return 70 + Math.min(6, b.rows?.length || 1) * 72;
    case "log": return 90 + Math.min(5, b.lines?.length || 1) * 45 + 50;
    case "next": return 200;
    default: return 200;
  }
};

const SceneView: React.FC<{scene: Scene; first: boolean; last: boolean; handle: string; n: number}> = ({scene, first, last, handle, n}) => {
  const f = useCurrentFrame();
  const len = Math.round(scene.seconds * FPS);
  const blocks = (scene.blocks || []).slice(0, 3);
  const fin = first ? 1 : interpolate(f, [0, XF], [0, 1], clamp);
  const fout = last ? 1 : interpolate(f, [len, len + XF], [1, 0], clamp);
  const gap = 34;
  const need = blocks.reduce((s, b) => s + estimate(b), 0) + gap * Math.max(0, blocks.length - 1);
  const scale = Math.min(1, (BOTTOM - TOP) / need);
  const stagger = Math.min(18, (len * 0.35) / Math.max(1, blocks.length));
  const sectionW = first ? 70 : lerp(f, 0, 10) * 70;
  return (
    <AbsoluteFill style={{opacity: Math.min(fin, fout)}}>
      <div style={{position: "absolute", left: LEFT, top: 280, display: "flex", alignItems: "center", gap: 22, fontFamily: MONO, fontSize: 36, letterSpacing: "0.16em", color: C.g, textTransform: "uppercase"}}>
        <span style={{width: sectionW, height: 4, background: C.g}} />
        <span>{first ? plain(scene.section) : typed(plain(scene.section), f, 4, 70)}</span>
      </div>
      <div style={{position: "absolute", left: LEFT, top: TOP, width: (1080 - LEFT - RIGHT) / scale, height: (BOTTOM - 120 - TOP) / scale, transform: `scale(${scale})`, transformOrigin: "top left", display: "flex", flexDirection: "column", justifyContent: need * scale < (BOTTOM - 120 - TOP) * 0.55 ? "flex-start" : "center", paddingTop: need * scale < (BOTTOM - 120 - TOP) * 0.55 ? 120 / scale : 0, boxSizing: "border-box", gap}}>
        {blocks.map((b, i) => {
          // the very first block of the video is fully visible at frame 0
          const at = first && i === 0 ? -30 : 4 + i * stagger;
          const s = interpolate(f, [at, at + 10], [0, 1], clamp);
          const props = {at, len};
          const body =
            b.type === "headline" ? <Headline b={b} {...props} /> :
            b.type === "flow" ? <Flow b={b} {...props} /> :
            b.type === "code" ? <Code b={b} {...props} /> :
            b.type === "compare" ? <Compare b={b} {...props} /> :
            b.type === "diff" ? <Diff b={b} {...props} /> :
            b.type === "stat" ? <Stat b={b} {...props} /> :
            b.type === "steps" ? <Steps b={b} {...props} /> :
            b.type === "cheatsheet" ? <Cheatsheet b={b} {...props} /> :
            b.type === "log" ? <Log b={b} {...props} /> :
            b.type === "next" ? <Next b={b} {...props} handle={handle} n={n} /> : null;
          return <div key={i} style={{opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>{body}</div>;
        })}
      </div>
    </AbsoluteFill>
  );
};

export const Screenplay: React.FC<ScreenplayProps> = ({screenplay, channelName = "", handle = "", episodeNumber = 0, music = 0}) => {
  const f = useCurrentFrame();
  const total = totalFrames(screenplay);
  let from = 0;
  return (
    <AbsoluteFill style={{background: C.bg, color: C.text, fontFamily: SANS}}>
      <AbsoluteFill style={{backgroundImage: "linear-gradient(rgba(255,255,255,.025) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,.025) 2px, transparent 2px)", backgroundSize: "60px 60px"}} />
      <div style={{position: "absolute", left: 64, right: 64, top: 150, display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 32, letterSpacing: "0.12em", color: C.dim}}>
        <span>{(channelName || screenplay.title).toUpperCase().slice(0, 22)}{episodeNumber ? <> · <span style={{color: C.g}}>{String(episodeNumber).padStart(3, "0")}</span></> : null}</span>
        <span style={{letterSpacing: "0.04em"}}>{handle}</span>
      </div>
      {screenplay.scenes.map((sc, i) => {
        const len = Math.round(sc.seconds * FPS);
        const start = from;
        from += len;
        const last = i === screenplay.scenes.length - 1;
        return (
          <Sequence key={i} from={start} durationInFrames={last ? len : len + XF}>
            <SceneView scene={sc} first={i === 0} last={last} handle={handle} n={episodeNumber} />
          </Sequence>
        );
      })}
      {music >= 0 ? (
        <Audio src={staticFile(`music/bed-${music % 3}.mp3`)} volume={() => interpolate(f, [0, 15, total - 45, total], [0, 0.55, 0.55, 0], clamp)} />
      ) : null}
    </AbsoluteFill>
  );
};
