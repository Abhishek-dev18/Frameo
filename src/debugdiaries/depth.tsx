// Real-geometry 3D kit so objects read as solid (not flat cards leaning sideways).
// Slab = extruded box with six lit faces + thickness; Odometer = row of rotating number drums; Spin = cube-face scene turn.
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from "remotion";
import {C, MONO, SANS, clamp} from "./cine";

const RAD = Math.PI / 180;
// fixed light, upper-left toward viewer
const L0 = (() => {const v = [-0.4, -0.6, 0.9]; const n = Math.hypot(...v); return v.map((x) => x / n);})();
const rot = (nx: number, ny: number, nz: number, rx: number, ry: number) => {
  // apply rotateX(rx) rotateY(ry): CSS applies rightmost first → rotateY then rotateX
  const cy = Math.cos(ry * RAD), sy = Math.sin(ry * RAD);
  let x = nx * cy + nz * sy, y = ny, z = -nx * sy + nz * cy;
  const cx = Math.cos(rx * RAD), sx = Math.sin(rx * RAD);
  return [x, y * cx - z * sx, y * sx + z * cx];
};
const shade = (nx: number, ny: number, nz: number, rx: number, ry: number) => {
  const [x, y, z] = rot(nx, ny, nz, rx, ry);
  return 0.3 + 0.7 * Math.max(0, x * L0[0] + y * L0[1] + z * L0[2]);
};

// Extruded slab with genuine thickness and per-face shading.
export const Slab: React.FC<{
  w: number; h: number; d: number; rx?: number; ry?: number; color?: string; glow?: string;
  front?: React.ReactNode; radius?: number; style?: React.CSSProperties; persp?: number;
}> = ({w, h, d, rx = 0, ry = 0, color = "#272A30", glow, front, radius = 20, style, persp = 1500}) => {
  const faces = [
    {n: [0, 0, 1], fw: w, fh: h, t: `translateZ(${d / 2}px)`, main: true},
    {n: [1, 0, 0], fw: d, fh: h, t: `rotateY(90deg) translateZ(${w / 2}px)`},
    {n: [-1, 0, 0], fw: d, fh: h, t: `rotateY(-90deg) translateZ(${w / 2}px)`},
    {n: [0, 1, 0], fw: w, fh: d, t: `rotateX(-90deg) translateZ(${h / 2}px)`},
    {n: [0, -1, 0], fw: w, fh: d, t: `rotateX(90deg) translateZ(${h / 2}px)`},
  ];
  return (
    <div style={{width: w, height: h, perspective: persp, ...style}}>
      <div style={{position: "relative", width: w, height: h, transformStyle: "preserve-3d", transform: `rotateX(${rx}deg) rotateY(${ry}deg)`}}>
        {faces.map((f, i) => {
          const s = shade(f.n[0], f.n[1], f.n[2], rx, ry);
          return (
            <div key={i} style={{position: "absolute", left: (w - f.fw) / 2, top: (h - f.fh) / 2, width: f.fw, height: f.fh, transform: f.t, backfaceVisibility: "hidden", borderRadius: f.main ? radius : 3, overflow: "hidden", background: color, border: f.main ? "1.5px solid rgba(255,255,255,.14)" : "none", boxShadow: f.main && glow ? `0 0 55px ${glow}77, inset 0 0 36px ${glow}1f` : undefined}}>
              <div style={{position: "absolute", inset: 0, background: `rgba(0,0,0,${(1 - s) * 0.82})`}} />
              {f.main ? <div style={{position: "absolute", inset: 0, background: `linear-gradient(145deg, rgba(255,255,255,${0.18 * s}), transparent 55%)`}} /> : null}
              {f.main && front ? <div style={{position: "relative", width: "100%", height: "100%"}}>{front}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const Shadow: React.FC<{w: number; style?: React.CSSProperties; op?: number}> = ({w, style, op = 0.5}) => (
  <div style={{width: w, height: 38, borderRadius: "50%", background: `radial-gradient(closest-side, rgba(0,0,0,${op}), transparent)`, filter: "blur(7px)", ...style}} />
);

// One rotating odometer drum. `value` can be fractional for mid-roll; negatives wrap.
export const Drum: React.FC<{value: number; chars?: string[]; w?: number; cell?: number; color?: string; bg?: string}> = ({value, chars = "0123456789".split(""), w = 96, cell = 132, color = C.text, bg = "#1A1C20"}) => {
  const n = chars.length;
  const step = 360 / n;
  const r = Math.round(cell / 2 / Math.tan(Math.PI / n));
  const idx = ((value % n) + n) % n;
  const angle = -idx * step;
  return (
    <div style={{width: w, height: cell, perspective: 760, position: "relative", borderRadius: 14, background: `linear-gradient(${bg}, #101216)`, border: "1.5px solid rgba(255,255,255,.1)", boxShadow: "inset 0 14px 22px rgba(0,0,0,.6), inset 0 -14px 22px rgba(0,0,0,.6)", overflow: "hidden"}}>
      <div style={{position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `translateZ(-${r}px) rotateX(${angle}deg)`}}>
        {chars.map((c, i) => {
          const face = i * step;
          const vis = Math.cos((face + angle) * RAD);
          return (
            <div key={i} style={{position: "absolute", inset: 0, display: "grid", placeItems: "center", transform: `rotateX(${face}deg) translateZ(${r}px)`, backfaceVisibility: "hidden", fontFamily: MONO, fontWeight: 700, fontSize: cell * 0.6, color, opacity: vis > 0 ? 0.35 + 0.65 * vis : 0, background: `rgba(0,0,0,${vis > 0 ? (1 - vis) * 0.7 : 1})`}}>{c}</div>
          );
        })}
      </div>
      <div style={{position: "absolute", left: 0, right: 0, top: "50%", height: 2, background: "rgba(255,255,255,.08)"}} />
    </div>
  );
};

// A whole signed/decimal odometer that animates from `from` to `to` over [a,b].
export const Odometer: React.FC<{from: number; to: number; a: number; b: number; digits?: number; sign?: boolean}> = ({from, to, a, b, digits = 5, sign = true}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [a, b], [from, to], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const neg = v < 0;
  const abs = Math.abs(v);
  // fractional carry so drums roll like a real odometer
  const drumVal = (place: number) => (abs / Math.pow(10, place));
  return (
    <div style={{display: "flex", alignItems: "center", gap: 10}}>
      {sign ? <div style={{fontFamily: MONO, fontWeight: 800, fontSize: 96, color: neg ? C.bug : C.dim, width: 56, textAlign: "center"}}>{neg ? "−" : "+"}</div> : null}
      {Array.from({length: digits}).map((_, i) => {
        const place = digits - 1 - i;
        return <Drum key={i} value={drumVal(place)} color={neg ? C.bug : C.text} />;
      })}
    </div>
  );
};

// Cube-face scene turn: outgoing face rotates away, incoming rotates in. Use as a transition wrapper per scene.
export const Spin: React.FC<{len: number; children: React.ReactNode; dur?: number; first?: boolean; last?: boolean}> = ({len, children, dur = 10, first, last}) => {
  const f = useCurrentFrame();
  const inA = first ? 0 : interpolate(f, [0, dur], [-90, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const outA = last ? 0 : interpolate(f, [len - dur, len], [0, 90], {...clamp, easing: Easing.in(Easing.cubic)});
  const ry = (first ? 0 : inA) + (last ? 0 : outA);
  const opIn = first ? 1 : interpolate(f, [0, dur], [0, 1], clamp);
  const opOut = last ? 1 : interpolate(f, [len - dur, len], [1, 0], clamp);
  const op = Math.min(opIn, opOut);
  return (
    <AbsoluteFill style={{perspective: 1800}}>
      <AbsoluteFill style={{transformStyle: "preserve-3d", transform: `rotateY(${ry}deg)`, opacity: op, transformOrigin: "50% 50%"}}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};
