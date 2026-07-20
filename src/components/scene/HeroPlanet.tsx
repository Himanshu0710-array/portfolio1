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
  
  const [hovered, setHovered] = useState(false);
  const blastTimeRef = useRef(0);

  // Load Sun texture
  const colorMap = useTexture('/textures/sun.jpg');

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
    
    // Interactive Pulsation Logic
    const targetScale = hovered ? 1.05 : 1;
    const targetIntensity = hovered ? 5 : 3;
    
    if (sphereRef.current) {
      sphereRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (glowRef1.current) {
      glowRef1.current.scale.lerp(new THREE.Vector3(targetScale + (Math.sin(state.clock.elapsedTime * 4) * 0.02 * (hovered ? 2 : 1)), targetScale, targetScale), 0.1);
    }
    if (glowRef2.current) {
      glowRef2.current.scale.lerp(new THREE.Vector3(targetScale + (Math.cos(state.clock.elapsedTime * 3) * 0.03 * (hovered ? 2 : 1)), targetScale, targetScale), 0.1);
    }
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, 0.1);
    }

    // Initialize blast time
    if (blastTimeRef.current === -1) {
      blastTimeRef.current = state.clock.elapsedTime;
    }

    // Blast Ring Logic
    if (blastTimeRef.current > 0 && blastRef.current) {
      const elapsed = state.clock.elapsedTime - blastTimeRef.current;
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
        blastTimeRef.current = 0; // Reset blast
      }
    }
  });

  const triggerBlast = () => {
    blastTimeRef.current = -1; // special flag
  };

  return (
    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
          setHovered(true);
          triggerBlast();
        }}
      >
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
            opacity={hovered ? 0.5 : 0.3} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>
        
        <mesh ref={glowRef2}>
          <sphereGeometry args={[3.5, 64, 64]} />
          <meshBasicMaterial 
            color="#f59e0b" 
            transparent 
            opacity={hovered ? 0.3 : 0.15} 
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        {/* Blast Effect Ring */}
        <mesh ref={blastRef} visible={false}>
          <sphereGeometry args={[3.1, 64, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0} 
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending} 
          />
        </mesh>

        <pointLight ref={lightRef} intensity={3} distance={100} color="#fcd34d" />
      </group>
    </Float>
  );
}
