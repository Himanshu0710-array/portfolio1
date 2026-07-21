'use client';

import { useSceneStore } from '@/store/useSceneStore';
import { portfolioData } from '@/data/portfolioData';
import { useEffect, useState } from 'react';
import { FaPaperPlane, FaDownload } from 'react-icons/fa';

export default function BlackHoleUI() {
  const { blackHoleProgress, probesFound, setActiveSection } = useSceneStore();
  const [blackOpacity, setBlackOpacity] = useState(0);
  const [whiteOpacity, setWhiteOpacity] = useState(0);
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const showWhiteHoleContent = blackHoleProgress >= 0.98;
  const gamificationComplete = probesFound >= 3;

  useEffect(() => {
    // 0.8 to 0.92: Fade to Black (Event Horizon)
    if (blackHoleProgress >= 0.8 && blackHoleProgress < 0.92) {
      const p = (blackHoleProgress - 0.8) / 0.12;
      setBlackOpacity(Math.min(p, 1));
      setWhiteOpacity(0);
      setActiveSection(null); // Close panels when falling into black hole
    } 
    // 0.92 to 0.94: Pitch Black
    else if (blackHoleProgress >= 0.92 && blackHoleProgress < 0.94) {
      setBlackOpacity(1);
      setWhiteOpacity(0);
    }
    // 0.94 to 0.96: FLASH White (White Hole)
    else if (blackHoleProgress >= 0.94 && blackHoleProgress < 0.96) {
      setBlackOpacity(0);
      setWhiteOpacity(1);
    }
    // 0.96 to 1.0: Fade from White to slightly white/transparent
    else if (blackHoleProgress >= 0.96) {
      const p = (blackHoleProgress - 0.96) / 0.04;
      setBlackOpacity(0);
      setWhiteOpacity(Math.max(1 - p, 0.2)); // Keep 20% white background
    } 
    // Default state
    else {
      setBlackOpacity(0);
      setWhiteOpacity(0);
    }
  }, [blackHoleProgress, setActiveSection]);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "63670d53-725b-4798-adff-045951284648");
    formData.append("subject", "New message from Holographic 3D Portfolio");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus('success');
      } else {
        setFormStatus('idle');
        alert("Transmission failed. Please try again.");
      }
    } catch (err) {
      setFormStatus('idle');
      alert("Transmission failed. Please try again.");
    }
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      {/* Black Hole Fade */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-100"
        style={{ opacity: blackOpacity }} 
      />
      {/* White Hole Flash */}
      <div 
        className="absolute inset-0 bg-white transition-opacity duration-100"
        style={{ opacity: whiteOpacity }} 
      />

      {/* Gamification Overlay */}
      {gamificationComplete && (
        <div className="pointer-events-auto absolute top-6 right-6 bg-blue-900/40 border border-blue-400 backdrop-blur-md p-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] animate-pulse">
          <h3 className="text-white font-bold mb-1">Access Granted</h3>
          <p className="text-blue-200 text-sm mb-3">All 3 Data Probes Recovered.</p>
          <a 
            href="https://portfolio-lake-nu-74.vercel.app/resume%20(3).pdf" 
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-400 text-white text-sm px-4 py-2 rounded-lg transition"
          >
            <FaDownload /> Download Resume
          </a>
        </div>
      )}

      {/* White Hole Contact Hologram */}
      {showWhiteHoleContent && (
        <div 
          className="pointer-events-auto absolute inset-0 flex items-center justify-center animate-fade-in p-3 md:p-8"
        >
          <div 
            className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 md:p-10 rounded-2xl max-w-lg w-full shadow-[0_0_50px_rgba(255,255,255,0.2)] max-h-[85vh] overflow-y-auto custom-scrollbar overscroll-y-contain"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onWheel={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl md:text-4xl font-black text-white text-center mb-1 md:mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">CONTACT</h2>
            <p className="text-xs md:text-base text-gray-300 text-center mb-4 md:mb-8">You have reached the end of the universe. Send a transmission.</p>

            <form onSubmit={handleContactSubmit} className="space-y-2.5 md:space-y-4">
              <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
              <div>
                <input name="name" required placeholder="Your Name" type="text" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder:text-gray-400 focus:outline-none focus:border-white transition" />
              </div>
              <div>
                <input name="email" required placeholder="Your Email" type="email" className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder:text-gray-400 focus:outline-none focus:border-white transition" />
              </div>
              <div>
                <textarea name="message" required placeholder="Message" rows={3} className="w-full bg-white/10 border border-white/20 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder:text-gray-400 focus:outline-none focus:border-white transition resize-none"></textarea>
              </div>
              
              <button 
                type="submit" 
                disabled={formStatus === 'loading' || formStatus === 'success'}
                className="w-full flex items-center justify-center gap-2 py-2.5 md:py-3 bg-white text-black font-bold text-sm md:text-base rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed mt-1"
              >
                {formStatus === 'loading' ? 'Transmitting...' : formStatus === 'success' ? 'Signal Received' : (
                  <>Send Transmission <FaPaperPlane size={14} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
