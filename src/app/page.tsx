'use client';

import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/ui/LoadingScreen';
import HUD from '@/components/ui/HUD';
import SectionPanel from '@/components/ui/SectionPanel';
import CursorTrail from '@/components/ui/CursorTrail';
import DotNav from '@/components/ui/DotNav';
import AudioController from '@/components/scene/AudioController';
import { useSceneStore, Section } from '@/store/useSceneStore';
import { useEffect } from 'react';

// Dynamically import the 3D scene to avoid SSR issues
const Scene = dynamic(() => import('@/components/scene/Scene'), {
  ssr: false,
});

export default function Home() {
  const { activeSection, isLoaded } = useSceneStore();

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      <AudioController />
      <LoadingScreen />
      <CursorTrail />
      <HUD />
      <DotNav />
      <Scene />
      <SectionPanel />
    </main>
  );
}

