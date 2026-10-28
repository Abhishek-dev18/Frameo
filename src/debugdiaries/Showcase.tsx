// Showcase of the upgraded toolkit (Remotion 4.0.539): real WebGL 3D (@remotion/three), official TransitionSeries
// transitions (clock-wipe, slide, flip), light-leak overlay (@remotion/effects), camera motion blur (@remotion/motion-blur).
// Used to compare against the CSS-only "fake 3D" kit before adopting it in reels.
import React, {useMemo} from "react";
import * as THREE from "three";
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig, Solid, Easing, random} from "remotion";
import {ThreeCanvas} from "@remotion/three";
import {TransitionSeries, linearTiming, springTiming} from "@remotion/transitions";
import {clockWipe} from "@remotion/transitions/clock-wipe";
import {slide} from "@remotion/transitions/slide";
import {lightLeak} from "@remotion/effects/light-leak";
import {CameraMotionBlur} from "@remotion/motion-blur";
import {C, MONO, SANS, clamp} from "./cine";
import {GlassBg, Reveal, Glass} from "./glass";

const big = (size: number, color: string): React.CSSProperties => ({fontFamily: SANS, fontWeight: 900, fontStretch: "76%", fontSize: size, lineHeight: 1, color});

// ---------- scene A: real 3D Mars + orbiting spacecraft, lit by a sun ----------
// procedural Mars surface: deterministic canvas texture (static, so render-safe)
const useMarsTexture = () =>
  useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 512;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, "#B5532F"); grad.addColorStop(0.5, "#C8653A"); grad.addColorStop(1, "#9C4426");
    g.fillStyle = grad; g.fillRect(0, 0, 1024, 512);
    for (let i = 0; i < 900; i++) {
      const x = random(`mx${i}`) * 1024, y = random(`my${i}`) * 512, r = 2 + random(`mr${i}`) ** 3 * 60;
      g.fillStyle = random(`mc${i}`) > 0.5 ? `rgba(80,25,10,${0.08 + random(`ma${i}`) * 0.25})` : `rgba(235,150,100,${0.05 + random(`mb${i}`) * 0.15})`;
      g.beginPath(); g.ellipse(x, y, r * 1.6, r, 0, 0, Math.PI * 2); g.fill();
    }
    for (let i = 0; i < 40; i++) { // craters: dark ring + light rim
      const x = random(`cx${i}`) * 1024, y = 60 + random(`cy${i}`) * 392, r = 6 + random(`cr${i}`) * 22;
      g.strokeStyle = "rgba(60,18,6,.55)"; g.lineWidth = r * 0.35; g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = "rgba(240,170,120,.25)"; g.lineWidth = r * 0.15; g.beginPath(); g.arc(x - r * 0.15, y - r * 0.15, r * 1.05, Math.PI * 0.9, Math.PI * 1.6); g.stroke();
    }
    g.fillStyle = "rgba(255,240,230,.55)"; g.fillRect(0, 0, 1024, 22); // polar cap
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

const Stars: React.FC = () => {
  const pos = useMemo(() => {
    const a = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) { a[i * 3] = (random(`sx${i}`) - 0.5) * 40; a[i * 3 + 1] = (random(`sy${i}`) - 0.5) * 40; a[i * 3 + 2] = -8 - random(`sz${i}`) * 10; }
    return a;
  }, []);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

const Planet: React.FC = () => {
  const f = useCurrentFrame();
  const tex = useMarsTexture();
  const a = f * 0.04 + 0.6;
  return (
    <>
      <Stars />
      <ambientLight intensity={0.12} />
      <directionalLight position={[-6, 3, 5]} intensity={2.6} color="#fff2e0" />
      <mesh rotation={[0.2, f * 0.006, 0.1]}>
        <sphereGeometry args={[1.6, 128, 128]} />
        <meshStandardMaterial map={tex} roughness={0.95} metalness={0} />
      </mesh>
      {/* atmosphere rim */}
      <mesh scale={1.06}>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#FF9A6B" transparent opacity={0.06} side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {/* spacecraft orbiting: passes in front of and behind the planet */}
      <group position={[Math.cos(a) * 2.35, Math.sin(a) * 0.55, Math.sin(a) * 2.35]} rotation={[0.3, -a + 1.2, 0.2]} scale={0.55}>
        <mesh>
          <boxGeometry args={[0.32, 0.32, 0.42]} />
          <meshStandardMaterial color="#D8B66E" metalness={0.8} roughness={0.25} />
        </mesh>
        <mesh position={[0, 0.24, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 8]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} roughness={0.2} />
        </mesh>
        {[-1, 1].map((sd) => (
          <mesh key={sd} position={[sd * 0.55, 0, 0]}>
            <boxGeometry args={[0.7, 0.03, 0.26]} />
            <meshStandardMaterial color="#2B4A9A" metalness={0.5} roughness={0.2} emissive="#0b1a40" />
          </mesh>
        ))}
      </group>
    </>
  );
};

const SceneA: React.FC = () => {
  const {width, height} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: "#0A0B0E"}}>
      <AbsoluteFill style={{top: 300}}>
        <ThreeCanvas width={width} height={1300} camera={{position: [0, 0.4, 6.2], fov: 42}}>
          <Planet />
        </ThreeCanvas>
      </AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 220}}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.g}}>REAL 3D · WEBGL</div>
        <Reveal at={0} size={88}>Lit spheres, real depth.</Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene B: 3D server rack with real lighting ----------
const Rack: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <>
      <hemisphereLight args={["#9fb4d8", "#1a1410", 1.1]} />
      <directionalLight position={[4, 6, 5]} intensity={2.4} />
      <pointLight position={[-3, 1, 3]} intensity={6} color="#FF7A6B" distance={10} />
      <group rotation={[0.2, -0.6 + f * 0.012, 0]}>
        {Array.from({length: 6}).map((_, i) => {
          const bad = i === 3;
          return (
            <group key={i} position={[0, 1.5 - i * 0.62, 0]}>
              <mesh>
                <boxGeometry args={[2.6, 0.5, 1.4]} />
                <meshStandardMaterial color={bad ? "#6A2E2E" : "#4A5160"} metalness={0.25} roughness={0.45} />
              </mesh>
              <mesh position={[1.1, 0, 0.71]}>
                <boxGeometry args={[0.1, 0.1, 0.02]} />
                <meshStandardMaterial color={bad ? "#FF7A6B" : "#4ADE80"} emissive={bad ? "#FF7A6B" : "#4ADE80"} emissiveIntensity={bad ? (Math.floor(f / 4) % 2 ? 3 : 0.3) : 1.5} />
              </mesh>
            </group>
          );
        })}
      </group>
    </>
  );
};

const SceneB: React.FC = () => {
  const {width} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: "#0E0F12"}}>
      <AbsoluteFill style={{top: 340}}>
        <ThreeCanvas width={width} height={1250} camera={{position: [0, 0, 6], fov: 45}}>
          <Rack />
        </ThreeCanvas>
      </AbsoluteFill>
      <div style={{position: "absolute", left: 64, top: 220}}>
        <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.bug}}>3D SERVER RACK</div>
        <Reveal at={0} size={84}>Metal, light, shadow.</Reveal>
      </div>
    </AbsoluteFill>
  );
};

// ---------- scene C: motion-blurred card fly-in ----------
const Flyer: React.FC = () => {
  const f = useCurrentFrame();
  const x = interpolate(f, [0, 22], [-900, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const r = interpolate(f, [0, 22], [-14, 0], clamp);
  return (
    <AbsoluteFill>
      <div style={{position: "absolute", left: 64 + x, right: 110 - x, top: 760, transform: `rotate(${r}deg)`}}>
        <Glass glow={C.g}>
          <div style={{fontFamily: MONO, fontSize: 24, letterSpacing: "0.14em", color: C.g}}>MOTION BLUR</div>
          <div style={{...big(80, C.text), marginTop: 10}}>Fast moves feel real.</div>
        </Glass>
      </div>
    </AbsoluteFill>
  );
};
const SceneC: React.FC = () => (
  <AbsoluteFill>
    <GlassBg />
    <CameraMotionBlur shutterAngle={240} samples={10}>
      <Flyer />
    </CameraMotionBlur>
  </AbsoluteFill>
);

// light-leak overlay (WebGL2 effect on a Solid)
const Leak: React.FC<{hue?: number; seed?: number}> = ({hue = 0, seed = 0}) => {
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  return <Solid width={width} height={height} effects={[lightLeak({seed, hueShift: hue, progress: interpolate(f, [0, durationInFrames - 1], [0, 1], clamp)})]} />;
};

export const SHOWCASE_TOTAL = 90 + 90 + 60 - 18 - 18;
export const Showcase: React.FC = () => (
  <AbsoluteFill style={{background: "#0A0B0E", color: C.text}}>
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={90}><SceneA /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={clockWipe({width: 1080, height: 1920})} timing={linearTiming({durationInFrames: 18})} />
      <TransitionSeries.Sequence durationInFrames={90}><SceneB /></TransitionSeries.Sequence>
      <TransitionSeries.Transition presentation={slide({direction: "from-bottom"})} timing={springTiming({config: {damping: 200}, durationInFrames: 18})} />
      <TransitionSeries.Sequence durationInFrames={60}><SceneC /></TransitionSeries.Sequence>
    </TransitionSeries>
  </AbsoluteFill>
);

// separate tiny comp to test the light-leak overlay on its own
export const LeakTest: React.FC = () => (
  <AbsoluteFill style={{background: "#121316"}}>
    <AbsoluteFill style={{display: "grid", placeItems: "center", ...big(90, C.text)}}>LIGHT LEAK</AbsoluteFill>
    <Leak hue={0} seed={3} />
  </AbsoluteFill>
);
