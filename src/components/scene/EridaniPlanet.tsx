'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export default function EridaniPlanet() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const blastRef = useRef<THREE.Mesh>(null);
  
  const [hovered, setHovered] = useState(false);
  const blastTimeRef = useRef(0);
  
  const { setActiveSection, activeSection } = useSceneStore();
  const isFocused = activeSection === 'experience';
  const isAnotherFocused = activeSection !== null && !isFocused;

  // Load texture
  const colorMap = useTexture('/textures/green.png');

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          emissiveMap={colorMap}
          emissive={new THREE.Color('#10b981')}
          emissiveIntensity={0.2}
          metalness={0.4}
          roughness={0.7}
        />
        
        {/* Outer Atmosphere glow */}
        <mesh>
          <sphereGeometry args={[3.2, 64, 64]} />
          <meshBasicMaterial 
            color="#059669" 
            transparent 
            opacity={0.2} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
        
        {/* Inner Cloud swirl approximation */}
        <mesh>
          <sphereGeometry args={[3.05, 64, 64]} />
          <meshBasicMaterial 
            map={colorMap}
            color="#34d399" 
            transparent 
            opacity={0.15} 
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
      </mesh>

      {/* Experience Label */}
      <Html
        position={[0, 4.5, 0]}
        center
        transform
        sprite
        distanceFactor={15}
        wrapperClass="pointer-events-none"
      >
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            setActiveSection('experience');
          }}
          className={`pointer-events-auto cursor-pointer bg-black/80 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full whitespace-nowrap text-white text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 ${isAnotherFocused ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
        >
          Experience
        </div>
      </Html>
    </group>
  );
}
