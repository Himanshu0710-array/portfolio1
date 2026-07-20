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
  const [blastTime, setBlastTime] = useState(0);
  
  const { setActiveSection, activeSection } = useSceneStore();
  const isFocused = activeSection === 'experience';
  const isAnotherFocused = activeSection !== null && !isFocused;

  // Load texture
  const colorMap = useTexture('/textures/green.png');

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.002;
      
      const targetScale = hovered ? 1.05 : 1;
      sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    
    // Blast Ring Logic
    if (blastTime > 0 && blastRef.current) {
      const elapsed = state.clock.elapsedTime - blastTime;
      if (elapsed < 1.0) {
        // Expand rapidly
        const currentScale = 1 + (elapsed * 5); // scales from 1 to 6
        blastRef.current.scale.set(currentScale, currentScale, currentScale);
        
        // Fade out
        const material = blastRef.current.material as THREE.MeshBasicMaterial;
        material.opacity = Math.max(0, 0.8 - (elapsed * 0.8));
        blastRef.current.visible = true;
      } else {
        blastRef.current.visible = false;
        setBlastTime(0); // Reset blast
      }
    }
  });

  const triggerBlast = () => {
    setBlastTime(-1);
  };

  useFrame((state) => {
    if (blastTime === -1) {
      setBlastTime(state.clock.elapsedTime);
    }
  });

  return (
    <group
      onPointerDown={(e) => {
        e.stopPropagation();
        setActiveSection('experience');
        triggerBlast();
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'auto';
      }}
    >
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

      {/* Blast Effect Ring */}
      <mesh ref={blastRef} visible={false}>
        <sphereGeometry args={[3.1, 64, 64]} />
        <meshBasicMaterial 
          color="#10b981" 
          transparent 
          opacity={0} 
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending} 
        />
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
