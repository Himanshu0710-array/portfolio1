import { create } from 'zustand';

export type Section = null | 'projects' | 'skills' | 'about' | 'experience' | 'contact';

interface SceneState {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  blackHoleProgress: number;
  setBlackHoleProgress: (progress: number) => void;
  isLoaded: boolean;
  setIsLoaded: (loaded: boolean) => void;
  probesFound: number;
  collectedProbeIds: string[];
  collectProbe: (id: string) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  activeSection: null,
  setActiveSection: (section) => set({ activeSection: section }),
  isAudioEnabled: false,
  toggleAudio: () => set((state) => ({ isAudioEnabled: !state.isAudioEnabled })),
  blackHoleProgress: 0,
  setBlackHoleProgress: (progress) => set({ blackHoleProgress: progress }),
  isLoaded: false,
  setIsLoaded: (loaded) => set({ isLoaded: loaded }),
  probesFound: 0,
  collectedProbeIds: [],
  collectProbe: (id: string) => set((state) => {
    if (state.collectedProbeIds.includes(id)) return state;
    return {
      collectedProbeIds: [...state.collectedProbeIds, id],
      probesFound: state.probesFound + 1
    };
  })
}));
