'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export default function Asteroids({ count = 500, radius = 15 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate random asteroid positions, rotations, and scales
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = radius + (Math.random() - 0.5) * 5; // Spread
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 2;
      
      const scale = Math.random() * 0.2 + 0.05;
      
      const rotationX = Math.random() * Math.PI;
      const rotationY = Math.random() * Math.PI;
      const rotationZ = Math.random() * Math.PI;

      temp.push({ x, y, z, scale, rotationX, rotationY, rotationZ });
    }
    return temp;
  }, [count, radius]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Slow rotation of the whole belt
    meshRef.current.rotation.y += delta * 0.02;

    particles.forEach((particle, i) => {
      dummy.position.set(particle.x, particle.y, particle.z);
      // Individual tumbling
      particle.rotationX += delta * 0.05;
      particle.rotationY += delta * 0.05;
      
      dummy.rotation.set(particle.rotationX, particle.rotationY, particle.rotationZ);
      dummy.scale.set(particle.scale, particle.scale, particle.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#475569" roughness={0.8} />
    </instancedMesh>
  );
}
