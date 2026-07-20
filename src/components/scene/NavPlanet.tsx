'use client';

import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import { useSceneStore, Section } from '@/store/useSceneStore';
import * as THREE from 'three';

interface NavPlanetProps {
  section: Section;
  radius: number;
  speed: number;
  color: string;
  label: string;
  texture: string;
  size?: number;
  orbitOffset?: number;
  hasRing?: boolean;
  children?: React.ReactNode;
}

export default function NavPlanet({
  section,
  radius,
  speed,
  color,
  label,
  texture,
  size = 0.5,
  orbitOffset = 0,
  hasRing = false,
  children,
}: NavPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRef = useRef<THREE.Mesh>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isVisibleInGalaxy, setIsVisibleInGalaxy] = useState(true);
  const { activeSection, setActiveSection } = useSceneStore();
  const { camera } = useThree();

  const isFocused = activeSection === section;
  const isAnotherFocused = activeSection !== null && !isFocused;

  // Load the unique texture for this specific planet
  const colorMap = useTexture(texture);

  useFrame(() => {
    if (groupRef.current && !activeSection) {
      groupRef.current.rotation.y += speed * 0.002;
    }
    if (planetRef.current) {
      planetRef.current.rotation.y += 0.01;
      
      // Calculate distance to camera to hide tags of other galaxies
      const worldPos = new THREE.Vector3();
      planetRef.current.getWorldPosition(worldPos);
      const dist = camera.position.distanceTo(worldPos);
      
      // If distance is less than 80, we are in the correct galaxy
      const shouldBeVisible = dist < 80;
      if (shouldBeVisible !== isVisibleInGalaxy) {
        setIsVisibleInGalaxy(shouldBeVisible);
      }
    }
  });

  return (
    <group ref={groupRef} rotation={[0, orbitOffset, 0]}>
      {/* Orbit Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius - 0.02, radius + 0.02, 64]} />
        <meshBasicMaterial color="#ffffff" opacity={0.1} transparent side={THREE.DoubleSide} />
      </mesh>

      {/* Planet */}
      <mesh
        ref={planetRef}
        position={[radius, 0, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          setActiveSection(section);
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
        scale={hovered ? 1.2 : 1}
      >
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          metalness={0.1}
          roughness={0.9}
          transparent
          opacity={isAnotherFocused ? 0.2 : 1}
        />

        {/* Atmosphere/Glow */}
        <mesh>
          <sphereGeometry args={[size * 1.12, 32, 32]} />
          <meshBasicMaterial 
            color={color} 
            transparent 
            opacity={hovered ? 0.5 : 0.15} 
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </mesh>
        
        {/* Ring for specific planets */}
        {hasRing && (
          <mesh rotation={[Math.PI / 2.5, 0, 0]}>
            <ringGeometry args={[size * 1.5, size * 2.2, 64]} />
            <meshStandardMaterial 
              color={color} 
              transparent 
              opacity={0.6} 
              side={THREE.DoubleSide} 
              roughness={0.5} 
            />
          </mesh>
        )}

        {/* Label - Only render if we are currently looking at this galaxy */}
        {isVisibleInGalaxy && (
          <Html
            position={[0, size + 1.2, 0]}
            center
            transform
            sprite
            distanceFactor={15}
            wrapperClass="pointer-events-none"
          >
            <div
              onPointerDown={(e) => {
                e.stopPropagation();
                setActiveSection(section);
              }}
              className={`pointer-events-auto cursor-pointer bg-black/80 backdrop-blur-md border border-white/30 px-4 py-1.5 rounded-full whitespace-nowrap text-white text-sm font-bold tracking-widest shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all duration-300 ${isAnotherFocused ? 'opacity-0 scale-90' : 'opacity-100 scale-100'}`}
            >
              {label}
            </div>
          </Html>
        )}

        {children}
      </mesh>
    </group>
  );
}
