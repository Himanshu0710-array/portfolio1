'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function InterstellarPathway() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 4000;
  const length = 400; // Distance covering both systems

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      // Create a tube/tunnel shape
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 20; // 10 to 30 spread
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = -(Math.random() * length); // Distribute from 0 to -200
      
      const scale = Math.random() * 0.1 + 0.05;
      
      temp.push({ x, y, z, scale });
    }
    return temp;
  }, [count, length]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    // Slow rotation of the entire tunnel
    meshRef.current.rotation.z += delta * 0.05;

    particles.forEach((particle, i) => {
      dummy.position.set(particle.x, particle.y, particle.z);
      dummy.scale.set(particle.scale, particle.scale, particle.scale); // Make them uniform asteroids
      dummy.lookAt(particle.x, particle.y, 0); // Point towards origin
      
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#a78bfa" 
        emissive="#3b82f6"
        emissiveIntensity={0.5}
        transparent 
        opacity={0.4} 
        roughness={0.8}
      />
    </instancedMesh>
  );
}
