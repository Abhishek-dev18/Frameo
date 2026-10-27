// Scene-transition kit: each scene declares how it enters and exits. Scenes overlap by OV frames so the outgoing and
// incoming scenes animate together. Kinds:
//   zoom    — camera flies through the outgoing scene (scale up + blur), incoming settles from a far zoom
//   shuffle — outgoing card swipes off sideways with 3D tilt, revealing the next scene underneath
//   flip    — outgoing scene turns away like a page around its left edge
//   glitch  — incoming scene arrives with RGB split, slice offsets and jitter
//   iris    — incoming scene opens from a circle at (ix, iy)
//   none    — no animation (used when the other side does the work)
import React from "react";
import {AbsoluteFill, interpolate, useCurrentFrame, Easing, random} from "remotion";
import {clamp} from "./cine";
import {GlassBg} from "./glass";

export const OV = 12;
export type TIn = "none" | "zoom" | "glitch" | "iris";
export type TOut = "none" | "zoom" | "shuffle" | "flip";

export const Scene: React.FC<{len: number; tin: TIn; tout: TOut; ix?: number; iy?: number; children: React.ReactNode}> = ({len, tin, tout, ix = 540, iy = 960, children}) => {
  const f = useCurrentFrame();
  // len includes the overlap tail
  const pin = interpolate(f, [0, OV], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const pout = interpolate(f, [len - OV, len], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  let tf = "";
  let op = 1;
  let filter = "";
  let clip: string | undefined;
  let origin = "50% 50%";
  let z = 1;

  // ---- entrance
  if (tin === "zoom" && pin < 1) { tf += ` scale(${0.55 + 0.45 * pin})`; op *= pin; filter += ` blur(${(1 - pin) * 14}px)`; }
  if (tin === "iris" && pin < 1) { const r = interpolate(pin, [0, 1], [0, 2300]); clip = `circle(${r}px at ${ix}px ${iy}px)`; }
  if (tin === "glitch" && f < OV) {
    const j = (random(`g${f}`) - 0.5) * 60 * (1 - pin);
    tf += ` translateX(${j}px)`;
    const s = 10 * (1 - pin) + 2;
    filter += ` drop-shadow(${s}px 0 0 rgba(255,40,90,.85)) drop-shadow(${-s}px 0 0 rgba(40,255,220,.85))`;
  }

  // ---- exit
  if (tout === "zoom" && pout > 0) { tf += ` scale(${1 + pout * 2.2})`; op *= 1 - pout; filter += ` blur(${pout * 18}px)`; }
  if (tout === "shuffle" && pout > 0) { tf += ` translateX(${-pout * 1300}px) translateY(${pout * 120}px) rotate(${-pout * 18}deg) rotateY(${pout * 25}deg)`; z = 3; }
  if (tout === "flip" && pout > 0) { tf += ` perspective(1600px) rotateY(${-pout * 105}deg)`; origin = "0% 50%"; z = 3; filter += ` brightness(${1 - pout * 0.5})`; }

  return (
    <AbsoluteFill style={{zIndex: z}}>
      <AbsoluteFill style={{transform: tf || undefined, transformOrigin: origin, opacity: op, filter: filter || undefined, clipPath: clip, borderRadius: pout > 0 && (tout === "shuffle" || tout === "flip") ? 40 : 0, overflow: "hidden", boxShadow: pout > 0 && (tout === "shuffle" || tout === "flip") ? "0 40px 120px rgba(0,0,0,.7)" : undefined}}>
        {tin === "iris" || tin === "glitch" || tout === "shuffle" || tout === "flip" ? <GlassBg /> : null}
        {children}
      </AbsoluteFill>
      {/* glitch slices overlay */}
      {tin === "glitch" && f < OV ? (
        <AbsoluteFill style={{pointerEvents: "none"}}>
          {Array.from({length: 7}).map((_, i) => {
            const y = random(`y${f}-${i}`) * 1920, h = 8 + random(`h${f}-${i}`) * 60;
            return <div key={i} style={{position: "absolute", left: 0, right: 0, top: y, height: h, background: i % 2 ? "rgba(255,40,90,.35)" : "rgba(40,255,220,.3)", transform: `translateX(${(random(`x${f}-${i}`) - 0.5) * 200}px)`, mixBlendMode: "screen"}} />;
          })}
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
