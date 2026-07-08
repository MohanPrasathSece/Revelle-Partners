import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function ChromeMaterial() {
  return (
    <meshStandardMaterial color="#e8e8e8" metalness={1} roughness={0.08} envMapIntensity={1.4} />
  );
}

function ObsidianMaterial() {
  return (
    <meshStandardMaterial color="#0c0c0c" metalness={0.95} roughness={0.18} envMapIntensity={1.1} />
  );
}

function GlassRing({
  position,
  rotation,
  scale = 1,
}: {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
}) {
  return (
    <Float speed={1} rotationIntensity={0.25} floatIntensity={0.7}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <torusGeometry args={[1, 0.28, 48, 96]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.2}
          roughness={0.05}
          ior={1.5}
          color="#ffffff"
          envMapIntensity={1.2}
        />
      </mesh>
    </Float>
  );
}

function Particles({ count = 220 }: { count?: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (points.current) {
      points.current.rotation.y = state.clock.elapsedTime * 0.012;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#d8d8d8"
        transparent
        opacity={0.45}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SceneGroup() {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const { x, y } = state.pointer;
    // Buttery camera-drift + mouse parallax
    const targetY = x * 0.28 + Math.sin(state.clock.elapsedTime * 0.12) * 0.06;
    const targetX = -y * 0.18 + Math.cos(state.clock.elapsedTime * 0.1) * 0.04;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 2.2, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 2.2, delta);
  });

  return (
    <group ref={group}>
      {/* Chrome cylinder */}
      <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.6}>
        <mesh position={[1.4, 1.1, -0.3]} rotation={[0.6, 0.2, -0.5]}>
          <cylinderGeometry args={[0.42, 0.42, 2.6, 64]} />
          <ChromeMaterial />
        </mesh>
      </Float>

      {/* Metallic capsule */}
      <Float speed={1.1} rotationIntensity={0.35} floatIntensity={0.8}>
        <mesh position={[-1.2, -0.9, 0.2]} rotation={[0.3, 0.4, 1.1]}>
          <capsuleGeometry args={[0.38, 1.4, 12, 32]} />
          <ChromeMaterial />
        </mesh>
      </Float>

      {/* Black reflective monolith */}
      <Float speed={0.7} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh position={[0.3, -1.4, -1.6]} rotation={[0.2, 0.7, 0.15]}>
          <boxGeometry args={[0.7, 1.8, 0.7]} />
          <ObsidianMaterial />
        </mesh>
      </Float>

      {/* Slim floating tube */}
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.9}>
        <mesh position={[-0.5, 1.7, -1]} rotation={[1.1, 0.1, 0.8]}>
          <cylinderGeometry args={[0.12, 0.12, 3, 32]} />
          <ObsidianMaterial />
        </mesh>
      </Float>

      {/* Small chrome sphere */}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={1}>
        <mesh position={[2.3, -0.7, -0.4]}>
          <sphereGeometry args={[0.34, 48, 48]} />
          <ChromeMaterial />
        </mesh>
      </Float>

      <GlassRing position={[0.7, 0.3, 0.3]} rotation={[1.2, -0.4, 0.3]} scale={0.8} />
      <GlassRing position={[-2.4, 1.2, -1.4]} rotation={[0.4, 0.9, 0]} scale={0.55} />

      <Particles />
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
      aria-hidden
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-5, -2, 2]} intensity={0.9} color="#e8e8e8" />
      <pointLight position={[0, 3, 3]} intensity={1.4} color="#ffffff" distance={18} />
      <hemisphereLight args={["#ffffff", "#cccccc", 0.5]} />
      <SceneGroup />
      <fog attach="fog" args={["#050505", 9, 18]} />
    </Canvas>
  );
}
