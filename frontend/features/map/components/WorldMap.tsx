"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MapControls, Stars, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl, MapControls as MapControlsImpl } from "three-stdlib";

type CameraMode = "free" | "locked";

interface WorldMapProps {
  cameraMode?: CameraMode;
  children?: React.ReactNode;
}

interface NodeProps {
  position: [number, number, number];
  label: string;
  type: "base" | "game" | "resource";
  onClick?: () => void;
  isActive?: boolean;
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const GROUND_Y = -1;
const BASE = process.env.NEXT_PUBLIC_BASE_PATH || "";

function BuildingsGLTF({ path = `${BASE}/buildings/scene.gltf`, scale = 0.005 }: { path?: string; scale?: number }) {
  const gltf = useGLTF(path) as unknown as { scene: THREE.Group };
  useGLTF.preload(path);
  const scene = gltf.scene.clone(true);
  // User requested 90 degree rotation to stand them up
  scene.rotation.set(-Math.PI / 2, 0, 0); 
  scene.updateMatrixWorld(true);
  const bbox = new THREE.Box3().setFromObject(scene);
  const baseOffset = -bbox.min.y;
  return <primitive object={scene} position={[0, GROUND_Y + baseOffset * scale, 0]} scale={scale} />;
}

function Ground1GLTF({ path = `${BASE}/ground1.gltf`, scale = 0.005 }: { path?: string; scale?: number }) {
  const gltf = useGLTF(path) as unknown as { scene: THREE.Group };
  useGLTF.preload(path);
  
  const tiles = useMemo(() => {
    const group = new THREE.Group();
    // Simple 3x3 tiling
    for (let x = -1; x <= 1; x++) {
      for (let z = -1; z <= 1; z++) {
        const tile = gltf.scene.clone(true);
        tile.position.set(x * 10, 0, z * 10); // Adjust spacing based on model size
        group.add(tile);
      }
    }
    return group;
  }, [gltf.scene]);

  return <primitive object={tiles} position={[0, GROUND_Y, 0]} scale={scale} />;
}

function CitySnowGround({ modelPath = `${BASE}/buildings/scene.gltf`, modelScale = 0.03, margin = 0.35, roadWidth = 0.18 }: { modelPath?: string; modelScale?: number; margin?: number; roadWidth?: number }) {
  const gltf = useGLTF(modelPath) as unknown as { scene: THREE.Group };
  useGLTF.preload(modelPath);
  const bbox = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.rotation.set(0, 0, 0);
    s.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(s);
  }, [gltf.scene]);
  const sizeX = (bbox.max.x - bbox.min.x) * modelScale;
  const sizeZ = (bbox.max.z - bbox.min.z) * modelScale;
  const padX = sizeX + margin * 2;
  const padZ = sizeZ + margin * 2;
  const y = GROUND_Y - 0.01;
  const roads = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({ color: "#8e99a8", roughness: 1, metalness: 0 });
    const g: THREE.Group = new THREE.Group();
    const top = new THREE.Mesh(new THREE.PlaneGeometry(padX + roadWidth * 2, roadWidth), m);
    top.rotation.x = -Math.PI / 2;
    top.position.set(0, y, padZ / 2 + roadWidth / 2);
    g.add(top);
    const bottom = new THREE.Mesh(new THREE.PlaneGeometry(padX + roadWidth * 2, roadWidth), m);
    bottom.rotation.x = -Math.PI / 2;
    bottom.position.set(0, y, -padZ / 2 - roadWidth / 2);
    g.add(bottom);
    const left = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, padZ + roadWidth * 2), m);
    left.rotation.x = -Math.PI / 2;
    left.rotation.z = Math.PI / 2;
    left.position.set(-padX / 2 - roadWidth / 2, y, 0);
    g.add(left);
    const right = new THREE.Mesh(new THREE.PlaneGeometry(roadWidth, padZ + roadWidth * 2), m);
    right.rotation.x = -Math.PI / 2;
    right.rotation.z = Math.PI / 2;
    right.position.set(padX / 2 + roadWidth / 2, y, 0);
    g.add(right);
    return g;
  }, [padX, padZ, y, roadWidth]);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
        <planeGeometry args={[padX, padZ]} />
        <meshStandardMaterial color="#f3f6fb" roughness={0.98} metalness={0.02} />
      </mesh>
      <primitive object={roads} />
    </>
  );
}

function LargeSnowTerrain({
  modelPath = `${BASE}/buildings/scene.gltf`,
  modelScale = 0.03,
  extendX = 18,
  extendZ = 18,
  peak = 0.6,
}: {
  modelPath?: string;
  modelScale?: number;
  extendX?: number;
  extendZ?: number;
  peak?: number;
}) {
  const gltf = useGLTF(modelPath) as unknown as { scene: THREE.Group };
  useGLTF.preload(modelPath);
  const bbox = useMemo(() => {
    const s = gltf.scene.clone(true);
    s.rotation.set(0, 0, 0);
    s.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(s);
  }, [gltf.scene]);
  const sizeX = (bbox.max.x - bbox.min.x) * modelScale;
  const sizeZ = (bbox.max.z - bbox.min.z) * modelScale;
  const padX = sizeX + 0.35 * 2;
  const padZ = sizeZ + 0.35 * 2;
  const width = padX + extendX * 2;
  const height = padZ + extendZ * 2;
  const segmentsX = Math.max(128, Math.floor(width * 32));
  const segmentsZ = Math.max(128, Math.floor(height * 32));
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segmentsX, segmentsZ);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const rng = mulberry32(1337);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i);
      let h = -0.05;
      const insidePad = Math.abs(x) <= padX / 2 && Math.abs(z) <= padZ / 2;
      if (!insidePad) {
        const nx = x * 0.12;
        const nz = z * 0.12;
        const wav1 = Math.sin(nx * 0.8) * 0.25 + Math.cos(nz * 1.1) * 0.2;
        const wav2 = Math.sin((nx + nz) * 0.5) * 0.15;
        const radial = Math.sin(Math.hypot(x, z) * 0.08) * 0.22;
        const noise = (rng() - 0.5) * 0.25;
        const dx = Math.max(0, Math.abs(x) - padX / 2);
        const dz = Math.max(0, Math.abs(z) - padZ / 2);
        const edge = Math.sqrt(dx * dx + dz * dz);
        const t = Math.min(1, edge / 1.2);
        h = (wav1 + wav2 + radial + noise) * peak * t;
      }
      pos.setZ(i, h);
    }
    geo.computeVertexNormals();
    return geo;
  }, [width, height, segmentsX, segmentsZ, padX, padZ, peak]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, GROUND_Y, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial color="#f3f6fb" roughness={0.98} metalness={0.02} />
    </mesh>
  );
}

function GameNode({ position, label, onClick, isActive }: NodeProps) {
  return (
    <group position={position}>
      <mesh onClick={onClick}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 6]} />
        <meshStandardMaterial color={isActive ? "#dc2626" : "#0ea5e9"} />
      </mesh>
      <Html position={[0, 0.8, 0]} center distanceFactor={14} style={{ pointerEvents: "none" }}>
        <div className={isActive ? "text-accent font-mono text-xs" : "text-primary font-mono text-xs"}>{label}</div>
      </Html>
    </group>
  );
}

function CameraController({ mode, radius = 8, pov }: { mode: CameraMode; radius?: number; pov: React.MutableRefObject<THREE.Vector3> }) {
  const controlsRef = useRef<OrbitControlsImpl | MapControlsImpl | null>(null);
  const { camera, invalidate } = useThree();

  useFrame(() => {
    if (!controlsRef.current) return;
    const t = controlsRef.current.target;
    const r = Math.hypot(t.x, t.z);
    if (r > radius - 0.3) {
      const ang = Math.atan2(t.z, t.x);
      t.x = Math.cos(ang) * (radius - 0.3);
      t.z = Math.sin(ang) * (radius - 0.3);
    }
    controlsRef.current.update();
    pov.current.copy(t);
  });

  useEffect(() => {
    if (mode !== "locked") return;
    const keys: Record<string, boolean> = { w: false, a: false, s: false, d: false };
    const down = (e: KeyboardEvent) => { if (e.key in keys) keys[e.key] = true; };
    const up = (e: KeyboardEvent) => { if (e.key in keys) keys[e.key] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    const id = setInterval(() => {
      if (!controlsRef.current) return;
      const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
      forward.y = 0; forward.normalize();
      const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
      right.y = 0; right.normalize();
      const move = new THREE.Vector3();
      if (keys.w) move.add(forward);
      if (keys.s) move.sub(forward);
      if (keys.d) move.add(right);
      if (keys.a) move.sub(right);
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(0.18);
        const tx = controlsRef.current.target.x + move.x;
        const tz = controlsRef.current.target.z + move.z;
        const tr = Math.hypot(tx, tz);
        if (tr < radius - 0.3) {
          camera.position.x += move.x;
          camera.position.z += move.z;
          controlsRef.current.target.x += move.x;
          controlsRef.current.target.z += move.z;
          controlsRef.current.update();
          invalidate();
        }
      }
    }, 16);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); clearInterval(id); };
  }, [mode, camera, radius, invalidate]);

  if (mode === "locked") {
    return (
      <MapControls
        ref={controlsRef}
        enableRotate={false}
        enablePan
        enableZoom
        maxPolarAngle={Math.PI / 4}
        minDistance={2.6}
        maxDistance={7.5}
        dampingFactor={0.32}
        onChange={() => invalidate()}
      />
    );
  }
  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom
      enableRotate
      maxPolarAngle={Math.PI / 2.2}
      minDistance={3.2}
      maxDistance={9}
      target={[0, 0, 0]}
      onChange={() => invalidate()}
    />
  );
}

function SnowParticles({ pov, count = 120, renderRadius = 5.5 }: { pov: React.MutableRefObject<THREE.Vector3>; count?: number; renderRadius?: number }) {
  const mesh = useRef<THREE.Points>(null);
  const respawnRng = useMemo(() => mulberry32(20241229 + count), [count]);
  const positions = useMemo(() => {
    const rng = mulberry32(20241229 + 1000 + count);
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const ang = rng() * Math.PI * 2;
      const r = rng() * renderRadius;
      p[i * 3] = Math.cos(ang) * r;
      p[i * 3 + 1] = 2 + rng() * 6;
      p[i * 3 + 2] = Math.sin(ang) * r;
    }
    return p;
  }, [count, renderRadius]);
  const drift = useMemo(() => {
    const rng = mulberry32(20241229 + 2000 + count);
    const d = new Float32Array(count);
    for (let i = 0; i < count; i++) d[i] = (rng() - 0.5) * 0.02;
    return d;
  }, [count]);
  const speeds = useMemo(() => {
    const rng = mulberry32(20241229 + 3000 + count);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.03 + rng() * 0.05;
    return s;
  }, [count]);
  const { invalidate } = useThree();
  const snowTexture = useMemo(() => {
    const size = 32;
    const canvas = document.createElement("canvas");
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const grd = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
    grd.addColorStop(0, "rgba(255,255,255,0.9)");
    grd.addColorStop(0.6, "rgba(255,255,255,0.6)");
    grd.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(size/2, size/2, size/2, 0, Math.PI*2); ctx.fill();
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    tex.minFilter = THREE.LinearFilter;
    return tex;
  }, []);
  useEffect(() => {
    const id = setInterval(() => invalidate(), 42);
    return () => clearInterval(id);
  }, [invalidate]);
  useFrame(() => {
    if (!mesh.current) return;
    const pos = (mesh.current.geometry as THREE.BufferGeometry).getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + drift[i];
      let y = pos.getY(i) - speeds[i];
      let z = pos.getZ(i);
      if (y < -1.6) {
        const ang = respawnRng() * Math.PI * 2;
        const r = respawnRng() * renderRadius;
        x = pov.current.x + Math.cos(ang) * r;
        y = 2 + respawnRng() * 6;
        z = pov.current.z + Math.sin(ang) * r;
      }
      pos.setXYZ(i, x, y, z);
    }
    pos.needsUpdate = true;
  });
  return (
    <points ref={mesh} frustumCulled>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        map={snowTexture}
        alphaTest={0.2}
      />
    </points>
  );
}

function SceneContent({ cameraMode, children }: { cameraMode: CameraMode; children?: React.ReactNode }) {
  const pov = useRef(new THREE.Vector3(0, 0, 0));
  return (
    <>
      <perspectiveCamera args={[55, 1, 0.1, 60]} position={[14, 14, 14]} />
      <CameraController mode={cameraMode} radius={8} pov={pov} />
      <color attach="background" args={["#0b1220"]} />
      <fog attach="fog" args={["#0b1220", 8, 40]} />
      <Stars radius={40} depth={20} count={800} factor={3} saturation={0} fade />
      <ambientLight intensity={0.25} color={"#9fb0c4"} />
      <directionalLight position={[-10, 18, 8]} intensity={0.9} color={"#e5eef8"} />
      <Ground1GLTF path={`${BASE}/ground1.gltf`} scale={0.005} />
      <BuildingsGLTF path={`${BASE}/buildings/scene.gltf`} scale={0.005} />
      <SnowParticles pov={pov} count={120} renderRadius={5.5} />
      {children}
    </>
  );
}

export default function WorldMap({ cameraMode = "free", children }: WorldMapProps) {
  return (
    <div className="fixed inset-0 w-full h-full bg-slate-950 z-0">
      <Canvas frameloop="demand" shadows={false} dpr={[1, 1]} gl={{ antialias: false, powerPreference: "high-performance" }}>
        <SceneContent cameraMode={cameraMode}>{children}</SceneContent>
      </Canvas>
    </div>
  );
}

export { GameNode };
