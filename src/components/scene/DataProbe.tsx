'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useSceneStore } from '@/store/useSceneStore';
import * as THREE from 'three';
import { Html } from '@react-three/drei';

interface DataProbeProps {
  id: string;
  position: [number, number, number];
}

export default function DataProbe({ id, position }: DataProbeProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { collectedProbeIds, collectProbe } = useSceneStore();
  
  const isCollected = collectedProbeIds.includes(id);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.rotation.x += 0.005;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  if (isCollected) return null;

  return (
    <group ref={meshRef} position={position}>
      <mesh
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={() => {
          collectProbe(id);
          document.body.style.cursor = 'auto';
        }}
      >
        <octahedronGeometry args={[0.5]} />
        <meshStandardMaterial 
          color={hovered ? "#3b82f6" : "#60a5fa"} 
          emissive={hovered ? "#3b82f6" : "#2563eb"}
          emissiveIntensity={hovered ? 2 : 1}
          wireframe
        />
      </mesh>
      
      {/* Inner glowing core */}
      <mesh>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      <Html
        position={[0, 0.8, 0]}
        center
        transform
        sprite
        distanceFactor={15}
        portal={{ current: document.getElementById('html-portal') as HTMLElement }}
        wrapperClass="pointer-events-none"
      >
        <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="bg-blue-900/80 border border-blue-400 text-blue-100 px-3 py-1 rounded-md text-xs whitespace-nowrap backdrop-blur-sm">
            [ Collect Data Probe ]
          </div>
        </div>
      </Html>
      
      {/* Small light source */}
      <pointLight distance={3} intensity={1} color="#3b82f6" />
    </group>
  );
}
