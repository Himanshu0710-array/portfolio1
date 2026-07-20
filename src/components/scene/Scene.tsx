'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ScrollControls, BakeShadows, Preload } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Starfield from './Starfield';
import HeroPlanet from './HeroPlanet';
import NavPlanet from './NavPlanet';
import CameraRig from './CameraRig';
import Asteroids from './Asteroids';
import EasterEggRocket from './EasterEggRocket';
import InterstellarPathway from './InterstellarPathway';
import InterstellarRocket from './InterstellarRocket';
import EridaniPlanet from './EridaniPlanet';
import BlackHoleOverlay from './BlackHoleOverlay';
import DataProbe from './DataProbe';
import { useSceneStore } from '@/store/useSceneStore';
import { Suspense } from 'react';

export default function Scene() {
  const { activeSection } = useSceneStore();

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#050505]">
      {/* 
        This portal container is exactly the same size as the Canvas and sits outside of ScrollControls.
        This prevents HTML tags from being dragged upward when scrolling the 3D scene!
      */}
      <div id="html-portal" className="absolute inset-0 z-50 pointer-events-none" />
      
      <Canvas
        camera={{ position: [0, 5, 20], fov: 45 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={['#020617']} />
        
        <Suspense fallback={null}>
          <ScrollControls pages={4} damping={0.1}>
            <Environment preset="night" />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" castShadow />
            <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

            <Starfield />
            <Asteroids count={500} radius={18} />
            <EasterEggRocket />
            <InterstellarPathway />
            <InterstellarRocket />
            
            <DataProbe id="probe-1" position={[8, 2, 8]} />
            <DataProbe id="probe-2" position={[-12, -3, -40]} />
            <DataProbe id="probe-3" position={[5, 4, -90]} />
            
            <group position={[0, 0, 0]}>
              <HeroPlanet />
              <NavPlanet 
                section="projects" 
                label="Missions" 
                color="#60a5fa" 
                texture="/textures/mars.jpg"
                radius={6} 
                size={0.6} 
                speed={1.5} 
                orbitOffset={0} 
              />
              <NavPlanet 
                section="skills" 
                label="Skills" 
                color="#f472b6" 
                texture="/textures/jupiter.jpg"
                radius={7.5} 
                size={0.5} 
                speed={1.2} 
                orbitOffset={Math.PI / 3}
                hasRing 
              />
              <NavPlanet 
                section="about" 
                label="About Me" 
                color="#a78bfa" 
                texture="/textures/earth.jpg"
                radius={9} 
                size={0.7} 
                speed={0.9} 
                orbitOffset={(Math.PI * 2) / 3} 
              />
            </group>

            <group position={[0, 0, -100]}>
              <EridaniPlanet />
              <pointLight distance={50} intensity={2} color="#fbbf24" />
              <NavPlanet 
                section="experience" 
                label="Experience" 
                radius={9} 
                speed={1.1} 
                color="#8b5cf6" 
                texture="/textures/neptune.jpg"
                orbitOffset={Math.PI / 2} 
                size={0.6}
                hasRing
              />
            </group>

            <group position={[0, 0, -150]}>
              <mesh>
                <torusGeometry args={[6, 0.3, 16, 64]} />
                <meshBasicMaterial color="#f97316" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
              </mesh>
              <mesh rotation={[Math.PI / 4, 0, 0]}>
                <torusGeometry args={[5, 0.15, 16, 64]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
              </mesh>
              <pointLight distance={100} intensity={3} color="#ea580c" />

              <mesh>
                <sphereGeometry args={[15, 32, 32]} />
                <meshBasicMaterial color="#000000" side={THREE.BackSide} />
              </mesh>
              <mesh>
                <sphereGeometry args={[15, 32, 32]} />
                <meshBasicMaterial color="#000000" />
              </mesh>

              <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[8, 32, 32]} />
                <meshBasicMaterial color="#ffffff" side={THREE.BackSide} toneMapped={false} />
              </mesh>
              <mesh position={[0, 0, -5]}>
                <sphereGeometry args={[8, 32, 32]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <pointLight position={[0, 0, -5]} distance={30} intensity={5} color="#ffffff" />
            </group>

            <CameraRig />
            <BlackHoleOverlay />
          </ScrollControls>
          
          <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          </EffectComposer>

          <BakeShadows />
          <Preload all />

          {!activeSection && (
            <OrbitControls
              enablePan={false}
              enableZoom={false}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              autoRotate
              autoRotateSpeed={0.5}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
