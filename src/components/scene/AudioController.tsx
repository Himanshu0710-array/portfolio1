'use client';

import { useEffect, useRef } from 'react';
import { useSceneStore } from '@/store/useSceneStore';

export default function AudioController() {
  const { isAudioEnabled, activeSection, probesFound } = useSceneStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
  // Track previous states to detect changes for sound effects
  const prevSectionRef = useRef(activeSection);
  const prevProbesRef = useRef(probesFound);

  useEffect(() => {
    // Initialize background audio element
    const audio = new Audio('/theme.mp3');
    audio.loop = true;
    audio.volume = 0.3; // Lower volume to hear SFX better
    audioRef.current = audio;

    // Initialize Web Audio API for synthetic SFX
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
    }

    return () => {
      audio.pause();
      audioRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isAudioEnabled) {
      audioRef.current.play().catch(e => {
        console.log('Audio play failed (maybe no theme.mp3 in public folder?):', e);
      });
      // Resume audio context if it was suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    } else {
      audioRef.current.pause();
    }
  }, [isAudioEnabled]);

  // Play synthetic sound effects
  const playSound = (type: 'ui_open' | 'ui_close' | 'probe_collect') => {
    if (!isAudioEnabled || !audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'ui_open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'ui_close') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.15);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.1, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'probe_collect') {
      // Sci-fi chime
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(1108.73, now + 0.1);
      osc.frequency.setValueAtTime(1318.51, now + 0.2);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
      osc.start(now);
      osc.stop(now + 0.5);
    }
  };

  // Trigger sounds on state changes
  useEffect(() => {
    if (activeSection !== prevSectionRef.current) {
      if (activeSection !== null) {
        playSound('ui_open');
      } else if (prevSectionRef.current !== null) {
        playSound('ui_close');
      }
      prevSectionRef.current = activeSection;
    }
  }, [activeSection, isAudioEnabled]);

  useEffect(() => {
    if (probesFound > prevProbesRef.current) {
      playSound('probe_collect');
      prevProbesRef.current = probesFound;
    }
  }, [probesFound, isAudioEnabled]);

  return null;
}
