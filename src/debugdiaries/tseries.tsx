// Shared helpers for reels built on the official TransitionSeries:
//   GlitchPres — custom RGB-split/slice presentation;  Leak — standalone light-leak overlay (WebGL2, --gl=angle);
//   Clock3D    — real WebGL analog clock (@remotion/three) with a lit face, ticks and hands.
import React from "react";
import * as THREE from "three";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Solid, random} from "remotion";
import type {TransitionPresentationComponentProps} from "@remotion/transitions";
import {lightLeak} from "@remotion/effects/light-leak";
import {clamp} from "./cine";

export const GlitchPres: React.FC<TransitionPresentationComponentProps<Record<string, never>>> = ({children, presentationDirection, presentationProgress: p}) => {
  const f = useCurrentFrame();
  if (presentationDirection === "exiting") return <AbsoluteFill>{children}</AbsoluteFill>;
  const k = 1 - p;
  const s = 14 * k + 1;
  return (
    <AbsoluteFill style={{opacity: p < 0.15 ? p / 0.15 : 1}}>
      <AbsoluteFill style={{transform: `translateX(${(random(`gj${f}`) - 0.5) * 70 * k}px)`, filter: `drop-shadow(${s}px 0 0 rgba(255,40,90,.85)) drop-shadow(${-s}px 0 0 rgba(40,255,220,.85))`}}>{children}</AbsoluteFill>
      {k > 0.1 ? Array.from({length: 7}).map((_, i) => (
        <div key={i} style={{position: "absolute", left: 0, right: 0, top: random(`gy${f}-${i}`) * 1920, height: 8 + random(`gh${f}-${i}`) * 60, background: i % 2 ? "rgba(255,40,90,.35)" : "rgba(40,255,220,.3)", transform: `translateX(${(random(`gx${f}-${i}`) - 0.5) * 220}px)`, mixBlendMode: "screen"}} />
      )) : null}
    </AbsoluteFill>
  );
};
export const glitch = () => ({component: GlitchPres, props: {}});

export const Leak: React.FC<{hue?: number; seed?: number}> = ({hue = 0, seed = 2}) => {
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  return <Solid width={width} height={height} effects={[lightLeak({seed, hueShift: hue, progress: interpolate(f, [0, durationInFrames - 1], [0, 1], clamp)})]} />;
};

// hours/minutes in 12h analog; accent colours the rim + hands glow
export const Clock3D: React.FC<{h: number; m: number; accent: string; position?: [number, number, number]; ry?: number}> = ({h, m, accent, position = [0, 0, 0], ry = 0}) => {
  const ha = -((h % 12) + m / 60) / 12 * Math.PI * 2;
  const ma = -(m / 60) * Math.PI * 2;
  return (
    <group position={position} rotation={[0.12, ry, 0]}>
      {/* body */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.12]}>
        <cylinderGeometry args={[1.25, 1.25, 0.3, 64]} />
        <meshStandardMaterial color="#23262C" metalness={0.5} roughness={0.35} />
      </mesh>
      {/* rim */}
      <mesh position={[0, 0, 0.04]}>
        <torusGeometry args={[1.22, 0.07, 16, 96]} />
        <meshStandardMaterial color={accent} metalness={0.6} roughness={0.25} emissive={accent} emissiveIntensity={0.35} />
      </mesh>
      {/* face */}
      <mesh position={[0, 0, 0.035]}>
        <circleGeometry args={[1.18, 64]} />
        <meshStandardMaterial color="#ECEDEF" roughness={0.7} />
      </mesh>
      {/* ticks */}
      {Array.from({length: 12}).map((_, i) => {
        const a = (i / 12) * Math.PI * 2;
        const big = i % 3 === 0;
        return (
          <mesh key={i} position={[Math.sin(a) * 0.98, Math.cos(a) * 0.98, 0.06]} rotation={[0, 0, -a]}>
            <boxGeometry args={[big ? 0.07 : 0.04, big ? 0.2 : 0.12, 0.03]} />
            <meshStandardMaterial color="#1A1B1F" />
          </mesh>
        );
      })}
      {/* hour hand */}
      <group rotation={[0, 0, ha]} position={[0, 0, 0.09]}>
        <mesh position={[0, 0.3, 0]}><boxGeometry args={[0.09, 0.62, 0.04]} /><meshStandardMaterial color="#121316" /></mesh>
      </group>
      {/* minute hand */}
      <group rotation={[0, 0, ma]} position={[0, 0, 0.12]}>
        <mesh position={[0, 0.42, 0]}><boxGeometry args={[0.06, 0.86, 0.04]} /><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.4} /></mesh>
      </group>
      <mesh position={[0, 0, 0.15]}><sphereGeometry args={[0.07, 24, 24]} /><meshStandardMaterial color={accent} metalness={0.7} roughness={0.2} /></mesh>
      {/* glass */}
      <mesh position={[0, 0, 0.2]}>
        <circleGeometry args={[1.2, 64]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.06} roughness={0} metalness={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
