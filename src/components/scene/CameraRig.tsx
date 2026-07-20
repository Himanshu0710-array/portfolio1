'use client';

import { useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import * as THREE from 'three';
import { useSceneStore } from '@/store/useSceneStore';

export default function CameraRig() {
  const { camera } = useThree();
  const scroll = useScroll();
  const { setActiveSection, activeSection, setBlackHoleProgress } = useSceneStore();
  const controlsTarget = useRef(new THREE.Vector3(0, 0, 0));
  const hasTriggeredContact = useRef(false);
  
  // To avoid constant state updates, keep track of current active section locally
  const currentSection = useRef(activeSection);

  useEffect(() => {
    currentSection.current = activeSection;
  }, [activeSection]);

  // Make Camera Responsive for Mobile (Phones)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      // On narrow screens (phones), use a much wider field-of-view (FOV) so the outer planets don't get cropped
      (camera as THREE.PerspectiveCamera).fov = isMobile ? 80 : 45;
      camera.updateProjectionMatrix();
    };

    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [camera]);

  useFrame((state, delta) => {
    if (!scroll) return;

    // scroll.offset goes from 0 (top) to 1 (bottom)
    const offset = scroll.offset;
    setBlackHoleProgress(offset);

    // Calculate intended camera Z position
    // Solar system is at Z=0 (we start camera at Z=20)
    // Eridani system is at Z=-100
    // Black Hole center is at Z=-150, white hole inside at Z=-155
    // Camera ends at Z=-170 (fully through the white hole)
    const targetZ = THREE.MathUtils.lerp(20, -170, offset);
    
    // Smoothly interpolate camera position
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
    
    // Add slight XY drift based on offset for cinematic feel
    // But straighten out when approaching the black hole for dramatic dive
    const bhProximity = Math.max(0, Math.min(1, (offset - 0.7) / 0.3));
    const targetX = Math.sin(offset * Math.PI) * 5 * (1 - bhProximity);
    const targetY = 5 + Math.cos(offset * Math.PI * 2) * 2 * (1 - bhProximity);
    
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.1);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.1);

    // Camera looks slightly ahead of itself
    controlsTarget.current.set(0, 0, camera.position.z - 20);
    camera.lookAt(controlsTarget.current);

    // Auto-trigger the contact panel when camera emerges from white hole
    const z = camera.position.z;
    if (z < -160 && !hasTriggeredContact.current) {
      setActiveSection('contact');
      hasTriggeredContact.current = true;
    } else if (z > -140 && hasTriggeredContact.current) {
      setActiveSection(null);
      hasTriggeredContact.current = true; // Wait, if it crosses back up, we want to reset it so it can trigger again.
      hasTriggeredContact.current = false;
    }
  });

  return null;
}
