'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useScroll, Html } from '@react-three/drei';
import * as THREE from 'three';

interface WarpNodeProps {
  position: [number, number, number];
  targetOffset: number;
  label: string;
  color?: string;
}

export default function WarpNode({ position, targetOffset, label, color = '#3b82f6' }: WarpNodeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const scroll = useScroll();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x -= delta * 0.8;
      ringRef.current.rotation.y += delta * 1.2;
    }
  });

  const handleWarp = (e: any) => {
    e.stopPropagation();
    if (scroll && scroll.el) {
      const maxScroll = scroll.el.scrollHeight - scroll.el.clientHeight;
      const targetTop = targetOffset * maxScroll;
      
      // Smoothly scroll to the target
      scroll.el.scrollTo({
        top: targetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <group ref={groupRef} position={position}>
      <mesh
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleWarp}
        scale={hovered ? 1.2 : 1}
      >
        {/* Outer Torus */}
        <torusGeometry args={[1.5, 0.1, 16, 64]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={hovered ? 0.8 : 0.4} 
          blending={THREE.AdditiveBlending}
        />
        
        {/* Inner spinning ring */}
        <mesh ref={ringRef}>
          <torusGeometry args={[1.2, 0.05, 16, 64]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={hovered ? 1 : 0.5} 
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Center Glow */}
        <mesh>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={hovered ? 0.3 : 0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </mesh>

      <pointLight distance={10} intensity={hovered ? 2 : 1} color={color} />

      <Html position={[0, 2.5, 0]} center className="pointer-events-none">
        <div className={`transition-opacity duration-300 ${hovered ? 'opacity-100' : 'opacity-80'}`}>
          <div 
            className="px-4 py-2 rounded-full text-xs md:text-sm font-bold whitespace-nowrap backdrop-blur-md shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              border: `1px solid ${color}`,
              color: '#ffffff'
            }}
          >
            {label}
          </div>
        </div>
      </Html>
    </group>
  );
}
