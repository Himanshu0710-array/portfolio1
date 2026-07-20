'use client';

import { useProgress } from '@react-three/drei';
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const { progress } = useProgress();
  const { isLoaded, setIsLoaded } = useSceneStore();

  useEffect(() => {
    if (progress === 100) {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => setIsLoaded(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, setIsLoaded]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black"
        >
          <div className="flex flex-col items-center space-y-6 w-64">
            <h2 className="text-xl tracking-[0.3em] text-blue-400 uppercase font-light">
              Mission Control
            </h2>
            
            <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: 'linear', duration: 0.2 }}
              />
            </div>
            
            <div className="flex w-full justify-between text-xs text-gray-500 font-mono">
              <span>INITIALIZING</span>
              <span>{Math.round(progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
