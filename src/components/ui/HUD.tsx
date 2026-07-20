'use client';

import { useSceneStore } from '@/store/useSceneStore';
import { portfolioData } from '@/data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function HUD() {
  const { activeSection, isLoaded, isAudioEnabled, toggleAudio } = useSceneStore();

  return (
    <AnimatePresence>
      {isLoaded && !activeSection && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-between p-4 md:p-8"
        >
          {/* Header */}
          <div className="text-center pt-8 md:pt-10">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {portfolioData.hero.name}
            </h1>
            <p className="mt-3 md:mt-4 text-lg md:text-2xl text-blue-200 font-light">
              {portfolioData.hero.title}
            </p>
            <p className="mt-2 text-xs md:text-base text-gray-400 max-w-sm md:max-w-none mx-auto">
              {portfolioData.hero.subtitle}
            </p>
          </div>

          {/* Bottom Controls */}
          <div className="flex w-full items-center justify-between pb-6 md:pb-10 px-2 md:px-0">
            <button
              onClick={toggleAudio}
              className="pointer-events-auto flex items-center justify-center rounded-full bg-white/10 p-2 md:p-3 backdrop-blur-md transition-colors hover:bg-white/20 text-white"
              aria-label="Toggle Audio"
            >
              {isAudioEnabled ? <FaVolumeUp size={16} className="md:w-5 md:h-5" /> : <FaVolumeMute size={16} className="md:w-5 md:h-5" />}
            </button>

            <div className="flex flex-col items-center animate-pulse">
              <span className="text-[10px] md:text-sm font-medium tracking-widest text-white/70 uppercase">
                Click a planet to explore
              </span>
              <div className="mt-2 h-8 md:h-10 w-[1px] bg-gradient-to-b from-white/50 to-transparent" />
            </div>

            <a
              href="https://portfolio-lake-nu-74.vercel.app/resume%20(3).pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto rounded-full border border-white/30 bg-white/10 px-4 md:px-6 py-1.5 md:py-2 text-sm md:text-base backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/60 text-white font-medium"
            >
              Resume
            </a>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
