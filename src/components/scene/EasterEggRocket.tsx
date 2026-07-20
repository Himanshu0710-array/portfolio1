'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';
import { Float } from '@react-three/drei';

export default function EasterEggRocket() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Orbit around the sun but very far and slow
      meshRef.current.position.x = Math.cos(state.clock.elapsedTime * 0.1) * 25;
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.1) * 25;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 5;
      
      meshRef.current.lookAt(0, 0, 0);
      meshRef.current.rotateY(Math.PI / 2); // Point forward along orbit
    }
  });

  return (
    <Float floatIntensity={2} speed={3}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => {
          setHovered(false);
        }}
        scale={hovered ? 1.5 : 1}
      >
        <coneGeometry args={[0.5, 2, 8]} />
        <meshStandardMaterial color={hovered ? "#fbbf24" : "#cbd5e1"} emissive={hovered ? "#d97706" : "#000000"} />
      </mesh>
    </Float>
  );
}
