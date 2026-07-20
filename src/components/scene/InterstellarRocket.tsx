'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';

export default function InterstellarRocket() {
  const groupRef = useRef<THREE.Group>(null);
  const exhaustRef = useRef<THREE.Mesh>(null);
  const scroll = useScroll();
  const { camera } = useThree();

  useFrame((state, delta) => {
    if (!scroll || !groupRef.current) return;
    
    const offset = scroll.offset;
    const time = state.clock.elapsedTime;

    // Rocket appears when leaving the solar system (offset > 0.15)
    // It follows the camera during travel, then parks at the Eridani system
    const isVisible = offset > 0.12;
    const isTraveling = offset > 0.12 && offset < 0.55;
    const isParked = offset >= 0.55 && offset < 0.75;

    // Scale up the rocket when visible, hide when not
    const targetScale = isVisible ? 1 : 0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

    if (isTraveling) {
      // Follow the camera during travel
      groupRef.current.position.z = camera.position.z - 5;
      groupRef.current.position.y = camera.position.y - 1.5 + Math.sin(time * 2) * 0.1;
      groupRef.current.position.x = camera.position.x + Math.sin(time * 1.5) * 0.1;
      groupRef.current.rotation.z = Math.sin(time) * 0.05;
      groupRef.current.rotation.x = Math.cos(time * 2) * 0.05 + 0.1;
    } else if (isParked) {
      // Park beside the Eridani system at a fixed position
      const parkTarget = new THREE.Vector3(12, 2, -95);
      groupRef.current.position.lerp(parkTarget, 0.05);
      // Gentle idle bobbing while parked
      groupRef.current.position.y += Math.sin(time * 0.8) * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.5) * 0.02;
      groupRef.current.rotation.x = 0.2;
    } else if (offset >= 0.75) {
      // Fade out as user approaches the black hole
      groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.05);
    }

    // Animate exhaust - dimmer when parked
    if (exhaustRef.current) {
      const exhaustIntensity = isTraveling ? 1 : 0.3;
      exhaustRef.current.scale.y = exhaustIntensity * (1 + Math.sin(time * 20) * 0.2);
      exhaustRef.current.scale.x = 1 + Math.random() * 0.1;
      exhaustRef.current.scale.z = 1 + Math.random() * 0.1;
      (exhaustRef.current.material as THREE.MeshBasicMaterial).opacity = (isTraveling ? 0.5 : 0.15) + Math.random() * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1, -5]} scale={0}>
      <pointLight color="#f97316" intensity={2} distance={10} position={[0, 0, 2]} />
      
      {/* Rocket Body */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.4, 1.5, 32]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rocket Nose Cone */}
      <mesh position={[0, 0, -1]}>
        <coneGeometry args={[0.2, 0.6, 32]} />
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
      </mesh>
      
      {/* Rocket Fins */}
      <group position={[0, 0, 0.5]}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[0, 0, (i * Math.PI * 2) / 3]}>
            <boxGeometry args={[0.1, 1.2, 0.5]} />
            <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Engine Thruster Base */}
      <mesh position={[0, 0, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.2, 32]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Thruster Exhaust Flame */}
      <mesh ref={exhaustRef} position={[0, 0, 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.3, 1.5, 16]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh position={[0, 0, 1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.15, 0.8, 16]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.9} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}
