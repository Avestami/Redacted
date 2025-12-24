"use client";

import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function AiCore() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.getElapsedTime();
      meshRef.current.rotation.x = t * 0.1;
      meshRef.current.rotation.y = t * 0.2;
      meshRef.current.scale.setScalar(1 + Math.sin(t * 1) * 0.05);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
       <MeshDistortMaterial
        color="#dc2626" 
        attach="material"
        distort={0.8}
        speed={1}
        roughness={0.4}
        metalness={0.9}
        wireframe
        opacity={0.8}
        transparent
      />
    </Sphere>
  );
}

function Particles() {
    const ref = useRef<THREE.Points>(null);
    const count = 300;
    const [positions] = useState(() => {
        const pos = new Float32Array(count * 3);
        for(let i=0; i<count; i++) {
            pos[i*3] = (Math.random() - 0.5) * 8;
            pos[i*3+1] = (Math.random() - 0.5) * 8;
            pos[i*3+2] = (Math.random() - 0.5) * 8;
        }
        return pos;
    });

    useFrame((state) => {
        if(ref.current) {
            ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#ffffff"
                size={0.03}
                sizeAttenuation={true}
                depthWrite={false}
                opacity={0.5}
            />
        </Points>
    );
}

export default function AiVisualizer() {
  return (
    <div className="w-full h-full min-h-[150px] relative">
      <Canvas camera={{ position: [0, 0, 4] }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <pointLight position={[-10, -5, 5]} intensity={2} color="#dc2626" />
        <AiCore />
        <Particles />
      </Canvas>
    </div>
  );
}
