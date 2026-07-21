'use client';

import { useSceneStore } from '@/store/useSceneStore';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const NAV_SECTIONS = [
  { id: 'solar', label: 'Solar System', offset: 0, color: '#f59e0b' },
  { id: 'eridani', label: 'Eridani System', offset: 0.6, color: '#10b981' },
  { id: 'blackhole', label: 'Black Hole', offset: 1.0, color: '#ef4444' },
];

export default function DotNav() {
  const { blackHoleProgress, scrollElement, isLoaded, activeSection } = useSceneStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const scrollTo = (targetOffset: number) => {
    if (!scrollElement) return;
    const maxScroll = scrollElement.scrollHeight - scrollElement.clientHeight;
    const targetTop = targetOffset * maxScroll;
    scrollElement.scrollTo({
      top: targetTop,
      behavior: 'smooth',
    });
  };

  // Determine which section is currently active based on scroll progress
  const getCurrentSection = () => {
    if (blackHoleProgress < 0.35) return 'solar';
    if (blackHoleProgress < 0.8) return 'eridani';
    return 'blackhole';
  };

  const currentSection = getCurrentSection();

  // Hide when a panel is open or not loaded
  if (!isLoaded || activeSection) return null;

  return (
    <div className="fixed right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 pointer-events-auto flex flex-col items-end gap-3 md:gap-4">
      {NAV_SECTIONS.map((section) => {
        const isActive = currentSection === section.id;
        const isHovered = hoveredId === section.id;

        return (
          <div
            key={section.id}
            className="flex items-center gap-2 md:gap-3 group cursor-pointer"
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => scrollTo(section.offset)}
          >
            {/* Label - appears on hover */}
            <AnimatePresence>
              {(isHovered || isActive) && (
                <motion.span
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="text-[10px] md:text-xs font-medium tracking-wider uppercase whitespace-nowrap"
                  style={{ color: isActive ? section.color : 'rgba(255,255,255,0.6)' }}
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <div className="relative flex items-center justify-center">
              {/* Active ring pulse */}
              {isActive && (
                <motion.div
                  className="absolute rounded-full"
                  style={{ 
                    border: `1px solid ${section.color}`,
                    width: '18px',
                    height: '18px',
                  }}
                  animate={{ 
                    scale: [1, 1.8, 1],
                    opacity: [0.6, 0, 0.6],
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              
              {/* Core dot */}
              <motion.div
                className="rounded-full transition-all duration-300"
                style={{
                  width: isActive ? '10px' : '6px',
                  height: isActive ? '10px' : '6px',
                  backgroundColor: isActive ? section.color : 'rgba(255,255,255,0.3)',
                  boxShadow: isActive ? `0 0 10px ${section.color}, 0 0 20px ${section.color}40` : 'none',
                }}
                whileHover={{ scale: 1.5 }}
              />
            </div>
          </div>
        );
      })}

      {/* Progress line connecting the dots */}
      <div className="absolute right-[2px] md:right-[2px] top-0 bottom-0 w-[2px] -z-10">
        <div className="absolute inset-0 bg-white/10 rounded-full" />
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full"
          style={{
            background: 'linear-gradient(to bottom, #f59e0b, #10b981, #ef4444)',
            height: `${Math.min(blackHoleProgress * 100, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}
