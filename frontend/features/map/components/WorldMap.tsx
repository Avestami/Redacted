"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, MapControls, Stars, Html } from "@react-three/drei";
import * as THREE from "three";

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

// --- Tile Utilities ---
function generateTileCenters(radius: number, tileSize: number) {
  const centers: Array<[number, number]> = [];
  for (let x = -radius; x <= radius; x += tileSize) {
    for (let z = -radius; z <= radius; z += tileSize) {
      if (x * x + z * z <= radius * radius) centers.push([x, z]);
    }
  }
  return centers;
}

function isWithin(target: THREE.Vector3, x: number, z: number, r: number) {
  const dx = x - target.x;
  const dz = z - target.z;
  return dx * dx + dz * dz <= r * r;
}

function CircularTerrain({ radius = 8, cityRadius = 3 }) {
  const geometry = useMemo(() => {
    const seg = 96;
    const geo = new THREE.CircleGeometry(radius, seg);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const rng = mulberry32(1234);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const r = Math.sqrt(x * x + y * y);
      let h = 0;
      if (r > cityRadius) {
        const t = (r - cityRadius) / (radius - cityRadius);
        const ang = Math.atan2(y, x);
        const base = t * 1.6;
        const wav1 = Math.sin(ang * 2.7 + r * 0.22) * 0.7 * t;
        const wav2 = Math.cos(ang * 4.3 + r * 0.18) * 0.5 * t;
        const radial = Math.sin(r * 0.35) * 0.4 * t;
        const noise = (rng() - 0.5) * 0.12 * t;
        h = base + wav1 + wav2 + radial + noise;
      } else {
        h = (rng() - 0.5) * 0.05;
      }
      pos.setZ(i, h - 1.5);
    }
    geo.computeVertexNormals();
    return geo;
  }, [radius, cityRadius]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial color="#f3f6fb" roughness={0.95} metalness={0.05} />
    </mesh>
  );
}

function CityPadSquare({ size = 5.2 }: { size?: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
      <planeGeometry args={[size, size]} />
      <meshStandardMaterial color="#e9edf3" roughness={1} metalness={0} />
    </mesh>
  );
}

function CityBuildingsTiles({ pov, radius = 2.4, tileSize = 1.1, renderRadius = 3.2 }: { pov: React.MutableRefObject<THREE.Vector3>; radius?: number; tileSize?: number; renderRadius?: number }) {
  const centers = useMemo(() => generateTileCenters(radius, tileSize), [radius, tileSize]);
  const rng = useMemo(() => mulberry32(7777), []);
  const tiles = useMemo(() => {
    return centers.map(([cx, cz]) => {
      const count = 1 + Math.floor(rng() * 2);
      const transforms: THREE.Matrix4[] = [];
      for (let i = 0; i < count; i++) {
        const lx = (rng() - 0.5) * tileSize * 0.9;
        const lz = (rng() - 0.5) * tileSize * 0.9;
        const x = cx + lx;
        const z = cz + lz;
        const h = 0.6 + rng() * 1.8;
        const s = 0.32 + rng() * 0.45;
        const m = new THREE.Matrix4();
        const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rng() * Math.PI * 2, 0));
        const v = new THREE.Vector3(x, h * 0.5 - 1, z);
        m.compose(v, q, new THREE.Vector3(s, 1, s));
        transforms.push(m);
      }
      return { center: new THREE.Vector3(cx, -1, cz), transforms };
    });
  }, [centers, rng, tileSize]);

  return (
    <>
      {tiles.map((tile, idx) => {
        const visible = isWithin(pov.current, tile.center.x, tile.center.z, renderRadius);
        const meshRef = useRef<THREE.InstancedMesh>(null);
        useEffect(() => {
          if (!meshRef.current) return;
          tile.transforms.forEach((m, i) => meshRef.current!.setMatrixAt(i, m));
          meshRef.current.instanceMatrix.needsUpdate = true;
        }, [meshRef.current]);
        return (
          <instancedMesh
            key={idx}
            ref={meshRef}
            args={[new THREE.BoxGeometry(0.55, 1.2, 0.55), undefined as unknown as THREE.Material, tile.transforms.length]}
            visible={visible}
          >
            <meshStandardMaterial color="#263142" roughness={0.6} metalness={0.1} />
          </instancedMesh>
        );
      })}
    </>
  );
}

function CityGridRoads({ radius = 2.4, pov, renderRadius = 3.2 }: { radius?: number; pov: React.MutableRefObject<THREE.Vector3>; renderRadius?: number }) {
  const material = useMemo(() => new THREE.MeshStandardMaterial({ color: "#8e99a8", roughness: 1, metalness: 0 }), []);
  const group = useRef<THREE.Group>(null);
  useEffect(() => {
    if (!group.current) return;
    const spacing = 0.6;
    for (let x = -radius; x <= radius; x += spacing) {
      const len = Math.sqrt(radius * radius - x * x) * 2;
      if (len <= 0.2) continue;
      const geo = new THREE.PlaneGeometry(0.05, len);
      const m = new THREE.Mesh(geo, material);
      m.rotation.x = -Math.PI / 2;
      m.position.set(x, -1.48, 0);
      group.current.add(m);
    }
    for (let z = -radius; z <= radius; z += spacing) {
      const len = Math.sqrt(radius * radius - z * z) * 2;
      if (len <= 0.2) continue;
      const geo = new THREE.PlaneGeometry(0.05, len);
      const m = new THREE.Mesh(geo, material);
      m.rotation.x = -Math.PI / 2;
      m.rotation.z = Math.PI / 2;
      m.position.set(0, -1.48, z);
      group.current.add(m);
    }
  }, [material, radius]);
  useFrame(() => {
    if (!group.current) return;
    const r2 = renderRadius * renderRadius;
    group.current.children.forEach((child: any) => {
      const dx = child.position.x - pov.current.x;
      const dz = child.position.z - pov.current.z;
      child.visible = dx * dx + dz * dz <= r2;
    });
  });
  return <group ref={group} />;
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
  const controlsRef = useRef<any>(null);
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
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const drift = useMemo(() => {
    const d = new Float32Array(count);
    for (let i = 0; i < count; i++) d[i] = (Math.random() - 0.5) * 0.02;
    return d;
  }, [count]);
  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.03 + Math.random() * 0.05;
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
    for (let i = 0; i < count; i++) {
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * renderRadius;
      positions[i * 3] = pov.current.x + Math.cos(ang) * r;
      positions[i * 3 + 1] = 2 + Math.random() * 6;
      positions[i * 3 + 2] = pov.current.z + Math.sin(ang) * r;
    }
    const id = setInterval(() => invalidate(), 42);
    return () => clearInterval(id);
  }, [count, positions, pov, renderRadius]);
  useFrame(() => {
    if (!mesh.current) return;
    const pos = (mesh.current.geometry as THREE.BufferGeometry).getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + drift[i];
      let y = pos.getY(i) - speeds[i];
      let z = pos.getZ(i);
      if (y < -1.6) {
        const ang = Math.random() * Math.PI * 2;
        const r = Math.random() * renderRadius;
        x = pov.current.x + Math.cos(ang) * r;
        y = 2 + Math.random() * 6;
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
        map={snowTexture as any}
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
      <CircularTerrain radius={12} cityRadius={3.2} />
      <CityPadSquare size={5.5} />
      <CityGridRoads radius={2.4} pov={pov} renderRadius={3.2} />
      <CityBuildingsTiles pov={pov} radius={2.4} tileSize={1.1} renderRadius={3.2} />
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
