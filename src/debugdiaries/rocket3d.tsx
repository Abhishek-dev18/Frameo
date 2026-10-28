// Real WebGL 3D rocket kit (@remotion/three): launcher with core + two boosters, gimballing nozzles, flame plumes,
// launch pad, ground smoke, breakup + explosion. Everything is driven by props computed from useCurrentFrame() in the
// caller (no useFrame), so renders are deterministic.
import React, {useMemo} from "react";
import * as THREE from "three";
import {random, useCurrentFrame} from "remotion";

const WHITE = "#E9ECEF";

const Plume: React.FC<{len: number; r: number; on: number}> = ({len, r, on}) => {
  const f = useCurrentFrame();
  if (on <= 0) return null;
  const fl = 1 + 0.12 * Math.sin(f * 1.9) + 0.06 * Math.sin(f * 3.3);
  return (
    <group position={[0, -len * fl * on * 0.5, 0]} scale={[1, fl * on, 1]}>
      <mesh rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[r, len, 24, 1, true]} />
        <meshBasicMaterial color="#FF9A3C" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh rotation={[Math.PI, 0, 0]} position={[0, len * 0.18, 0]} scale={[0.5, 0.6, 0.5]}>
        <coneGeometry args={[r, len, 24, 1, true]} />
        <meshBasicMaterial color="#FFF3C4" transparent opacity={0.95} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};

export const Rocket: React.FC<{thrust?: number; gimbal?: number; brk?: number; label?: string; scale?: number}> = ({thrust = 0, gimbal = 0, brk = 0, scale = 1}) => {
  const b = brk;
  return (
    <group scale={scale}>
      {/* core stage */}
      <group position={[b * 0.4, b * 1.2, 0]} rotation={[0, 0, b * 0.9]}>
        <mesh position={[0, 1.8, 0]}>
          <cylinderGeometry args={[0.36, 0.36, 3.6, 48]} />
          <meshStandardMaterial color={WHITE} metalness={0.15} roughness={0.45} />
        </mesh>
        {/* interstage band */}
        <mesh position={[0, 2.9, 0]}>
          <cylinderGeometry args={[0.365, 0.365, 0.16, 48]} />
          <meshStandardMaterial color="#2B2E35" metalness={0.4} roughness={0.5} />
        </mesh>
        {/* fairing / nose */}
        <group position={[b * 0.8, b * 2.4, 0]} rotation={[0, 0, -b * 1.6]}>
          <mesh position={[0, 3.6 + 0.45, 0]}>
            <coneGeometry args={[0.36, 0.9, 48]} />
            <meshStandardMaterial color={WHITE} metalness={0.15} roughness={0.4} />
          </mesh>
        </group>
        {/* Vulcain nozzle, gimballed */}
        <group position={[0, -0.02, 0]} rotation={[0, 0, gimbal]}>
          <mesh position={[0, -0.2, 0]}>
            <cylinderGeometry args={[0.14, 0.24, 0.4, 24, 1, true]} />
            <meshStandardMaterial color="#5A5F68" metalness={0.8} roughness={0.3} side={THREE.DoubleSide} />
          </mesh>
          <group position={[0, -0.4, 0]}><Plume len={1.7} r={0.24} on={thrust * (1 - b)} /></group>
        </group>
      </group>
      {/* boosters */}
      {[-1, 1].map((s) => (
        <group key={s} position={[s * (0.62 + b * 2.6), -b * 0.8, 0]} rotation={[0, 0, s * b * 2.1]}>
          <mesh position={[0, 1.4, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 2.8, 32]} />
            <meshStandardMaterial color="#D9DCE0" metalness={0.2} roughness={0.5} />
          </mesh>
          <mesh position={[0, 2.8 + 0.22, 0]}>
            <coneGeometry args={[0.2, 0.44, 32]} />
            <meshStandardMaterial color="#C9CDD2" metalness={0.2} roughness={0.5} />
          </mesh>
          <group position={[0, 0, 0]} rotation={[0, 0, gimbal * 1.1]}>
            <mesh position={[0, -0.14, 0]}>
              <cylinderGeometry args={[0.1, 0.17, 0.28, 20, 1, true]} />
              <meshStandardMaterial color="#4A4E56" metalness={0.8} roughness={0.35} side={THREE.DoubleSide} />
            </mesh>
            <group position={[0, -0.28, 0]}><Plume len={2.4} r={0.2} on={thrust * (1 - b)} /></group>
          </group>
        </group>
      ))}
      {/* engine glow lighting the rocket base */}
      {thrust > 0 && b < 1 ? <pointLight position={[0, -0.8, 0.6]} intensity={6 * thrust * (1 - b)} distance={6} color="#FFA552" /> : null}
    </group>
  );
};

export const Pad: React.FC = () => (
  <group>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.45, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#1A1B1F" roughness={1} />
    </mesh>
    <mesh position={[0, -0.42, 0]}>
      <cylinderGeometry args={[1.4, 1.6, 0.08, 48]} />
      <meshStandardMaterial color="#2C2F36" roughness={0.8} />
    </mesh>
    {/* service tower */}
    <group position={[-1.7, 0, -0.4]}>
      <mesh position={[0, 2.4, 0]}>
        <boxGeometry args={[0.5, 5.6, 0.5]} />
        <meshStandardMaterial color="#5B4B3A" metalness={0.5} roughness={0.6} wireframe />
      </mesh>
      {[1, 2, 3, 4].map((y) => (
        <mesh key={y} position={[0.55, y * 1.05, 0]}>
          <boxGeometry args={[0.7, 0.06, 0.12]} />
          <meshStandardMaterial color="#7A6650" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  </group>
);

// billowing ground smoke after ignition; t = seconds of burn
export const Smoke: React.FC<{t: number}> = ({t}) => {
  const puffs = useMemo(() => Array.from({length: 36}).map((_, i) => ({a: random(`sa${i}`) * Math.PI * 2, d: 0.6 + random(`sd${i}`) * 2.6, s: 0.4 + random(`ss${i}`) * 0.7, y: random(`sy${i}`) * 0.5})), []);
  if (t <= 0) return null;
  return (
    <group position={[0, -0.35, 0]}>
      {puffs.map((p, i) => {
        const k = Math.min(1, t / 1.6);
        return (
          <mesh key={i} position={[Math.cos(p.a) * p.d * k * 1.4, p.y + k * 0.3, Math.sin(p.a) * p.d * k * 0.6]} scale={p.s * (0.3 + k)}>
            <sphereGeometry args={[0.6, 16, 16]} />
            <meshStandardMaterial color="#C9C6C0" roughness={1} transparent opacity={0.55 * (1 - Math.max(0, t - 3) / 4)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

// fireball + debris; p = 0..1 progress
export const Explosion: React.FC<{p: number}> = ({p}) => {
  const bits = useMemo(() => Array.from({length: 28}).map((_, i) => ({x: random(`ex${i}`) - 0.5, y: random(`ey${i}`) - 0.3, z: random(`ez${i}`) - 0.5, r: random(`er${i}`)})), []);
  if (p <= 0) return null;
  return (
    <group>
      <mesh scale={0.4 + p * 3.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#FF8A3C" transparent opacity={Math.max(0, 0.85 - p * 0.8)} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh scale={0.3 + p * 1.8}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#FFF1B0" transparent opacity={Math.max(0, 0.9 - p * 1.1)} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {bits.map((b, i) => (
        <mesh key={i} position={[b.x * p * 9, b.y * p * 7 - p * p * 2, b.z * p * 6]} rotation={[p * 8 * b.r, p * 6, p * 5 * b.r]}>
          <boxGeometry args={[0.12 + b.r * 0.2, 0.06, 0.18]} />
          <meshStandardMaterial color={i % 3 ? "#DADDE1" : "#3A3D44"} metalness={0.4} roughness={0.5} emissive={i % 4 === 0 ? "#FF6A2A" : "#000000"} emissiveIntensity={1.5 * (1 - p)} />
        </mesh>
      ))}
      <pointLight intensity={30 * (1 - p)} distance={14} color="#FF9A4C" />
    </group>
  );
};

export const Stars: React.FC<{n?: number}> = ({n = 700}) => {
  const pos = useMemo(() => {
    const a = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { a[i * 3] = (random(`tx${i}`) - 0.5) * 50; a[i * 3 + 1] = (random(`ty${i}`) - 0.5) * 60; a[i * 3 + 2] = -10 - random(`tz${i}`) * 10; }
    return a;
  }, [n]);
  return (
    <points>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" sizeAttenuation transparent opacity={0.8} />
    </points>
  );
};

export const SkyLights: React.FC = () => (
  <>
    <hemisphereLight args={["#AFC3E8", "#1a1612", 0.9]} />
    <directionalLight position={[5, 8, 6]} intensity={2.2} color="#FFF3E2" />
    <directionalLight position={[-6, 2, -3]} intensity={0.5} color="#7FA8FF" />
  </>
);
