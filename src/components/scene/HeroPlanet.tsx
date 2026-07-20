'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export default function HeroStar() {
  const sphereRef = useRef<THREE.Mesh>(null);
  const glowRef1 = useRef<THREE.Mesh>(null);
  const glowRef2 = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const blastRef = useRef<THREE.Mesh>(null);
  
  // Load Sun texture
  const colorMap = useTexture('/textures/sun.jpg');

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
    
    // Constant slow pulsation for the glow
    if (glowRef1.current) {
      glowRef1.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.01);
    }
    if (glowRef2.current) {
      glowRef2.current.scale.setScalar(1 + Math.cos(state.clock.elapsedTime * 1.5) * 0.015);
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group>
        <mesh ref={sphereRef}>
          <sphereGeometry args={[3, 64, 64]} />
          <meshBasicMaterial map={colorMap} />
        </mesh>
        
        {/* Intense Coronal Glow */}
        <mesh ref={glowRef1}>
          <sphereGeometry args={[3.2, 64, 64]} />
          <meshBasicMaterial 
            color="#fbbf24" 
            transparent 
            opacity={0.3} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
        
        <mesh ref={glowRef2}>
          <sphereGeometry args={[3.5, 64, 64]} />
          <meshBasicMaterial 
            color="#f59e0b" 
            transparent 
            opacity={0.15} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        <pointLight ref={lightRef} intensity={3} distance={100} color="#fcd34d" />
      </group>
    </Float>
  );
}
