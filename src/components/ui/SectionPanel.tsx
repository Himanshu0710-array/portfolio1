'use client';

import { useState } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { portfolioData } from '@/data/portfolioData';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaGithub, FaExternalLinkAlt, FaPaperPlane } from 'react-icons/fa';

export default function SectionPanel() {
  const { activeSection, setActiveSection } = useSceneStore();
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleBack = () => setActiveSection(null);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('loading');
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "63670d53-725b-4798-adff-045951284648");
    formData.append("subject", "New message from 3D Portfolio Space");

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setFormStatus('success');
      } else {
        setFormStatus('error');
      }
    } catch (err) {
      setFormStatus('error');
    }
  };

  const glitchVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    },
    glitch: {
      x: [0, -5, 5, -2, 2, 0],
      opacity: [1, 0.8, 1, 0.9, 1],
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'projects':
        return (
          <div className="space-y-8">
            <motion.h2 
              variants={glitchVariants} 
              initial="hidden" 
              animate={["visible", "glitch"]} 
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              Missions (Projects)
            </motion.h2>
            
            <div className="space-y-12">
              {portfolioData.projects.map((project) => (
                <div 
                  key={project.id} 
                  className={`border border-white/10 rounded-xl p-6 transition ${
                    project.isCaseStudy 
                      ? 'bg-blue-900/20 shadow-[0_0_30px_rgba(59,130,246,0.15)] border-blue-500/30' 
                      : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold ${project.isCaseStudy ? 'text-xl md:text-2xl text-blue-400' : 'text-lg md:text-xl text-blue-300'}`}>
                      {project.title}
                    </h3>
                    <div className="flex gap-4">
                      {project.github !== '#' && (
                        <a href={project.github} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                          <FaGithub size={20} />
                        </a>
                      )}
                      {project.live !== '#' && (
                        <a href={project.live} target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white transition">
                          <FaExternalLinkAlt size={18} />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mt-3 text-sm md:text-base leading-relaxed">{project.description}</p>
                  
                  {project.isCaseStudy && (
                    <div className="mt-6 space-y-4 text-sm bg-black/40 p-5 rounded-lg border border-white/5">
                      <div>
                        <h4 className="text-blue-200 font-semibold mb-1">Problem Statement</h4>
                        <p className="text-gray-400">{(project as any).problem}</p>
                      </div>
                      <div>
                        <h4 className="text-blue-200 font-semibold mb-1">Approach & Architecture</h4>
                        <p className="text-gray-400">{(project as any).approach}</p>
                      </div>
                      <div>
                        <h4 className="text-green-300 font-semibold mb-1">Outcome & Impact</h4>
                        <p className="text-green-100/70">{(project as any).outcome}</p>
                      </div>
                    </div>
                  )}

                  {!project.isCaseStudy && (project as any).impact && (
                    <div className="mt-4 p-3 bg-blue-500/10 border-l-2 border-blue-400 rounded-r-md">
                      <p className="text-sm text-blue-100">{(project as any).impact}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mt-6">
                    {project.techStack.map(tech => (
                      <span key={tech} className={`text-xs px-2.5 py-1 rounded-md ${
                        project.isCaseStudy ? 'bg-blue-600/30 text-blue-100' : 'bg-blue-900/30 text-blue-200'
                      }`}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'skills':
        return (
          <div className="space-y-6">
            <motion.h2 
              variants={glitchVariants} 
              initial="hidden" 
              animate={["visible", "glitch"]} 
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              Skill Constellation
            </motion.h2>
            <div className="space-y-8">
              {portfolioData.skills.map((skillGroup) => {
                const isHighlight = skillGroup.category === "AI/ML" || skillGroup.category === "Web Development";
                return (
                  <div key={skillGroup.category}>
                    <h3 className={`text-lg font-medium mb-4 ${isHighlight ? 'text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]' : 'text-gray-300'}`}>
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {skillGroup.items.map(skill => (
                        <span 
                          key={skill} 
                          className={`px-4 py-2 rounded-lg text-sm transition-all ${
                            isHighlight 
                              ? 'bg-blue-900/40 border border-blue-500/50 text-blue-100 shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:bg-blue-800/60' 
                              : 'bg-white/5 border border-white/10 text-gray-300 shadow-[0_0_10px_rgba(255,255,255,0.05)] hover:bg-white/10'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-6">
            <motion.h2 
              variants={glitchVariants} 
              initial="hidden" 
              animate={["visible", "glitch"]} 
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              About Me
            </motion.h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-gray-300 leading-relaxed">{portfolioData.about.bio}</p>
              
              <div className="mt-8 p-6 bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                <p className="text-blue-100 italic">&quot;{portfolioData.about.themeContext}&quot;</p>
              </div>

              <div className="mt-10 space-y-6">
                <h3 className="text-xl font-semibold text-white">Developer Activity</h3>
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl">
                  {/* LeetCode Heatmap via leetcard.jacoblin.cool */}
                  <img 
                    src="https://leetcard.jacoblin.cool/Himanshu1007?theme=dark&font=Inter&ext=heatmap" 
                    alt="LeetCode Stats" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl overflow-hidden">
                  <h4 className="text-sm text-gray-400 mb-2">GitHub Contributions</h4>
                  {/* GitHub Heatmap via ghchart.rshah.org */}
                  <img 
                    src="https://ghchart.rshah.org/3b82f6/Himanshu0710-array" 
                    alt="GitHub Graph" 
                    className="w-full opacity-80 mix-blend-screen"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 'experience':
        return (
          <div className="space-y-8">
            <div>
              <motion.h2 
                variants={glitchVariants} 
                initial="hidden" 
                animate={["visible", "glitch"]} 
                className="text-2xl md:text-3xl font-bold text-white mb-6"
              >
                Experience
              </motion.h2>
              <div className="space-y-6">
                {portfolioData.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-blue-500 pl-6 py-2 relative">
                    <div className="absolute w-4 h-4 bg-blue-500 rounded-full -left-[9px] top-4 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-sm text-blue-300 mb-2">
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span>{exp.duration}</span>
                    </div>
                    <p className="text-gray-300">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-6">
              <h2 className="text-2xl font-bold text-white mb-6">Certifications</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {portfolioData.certifications.map((cert, idx) => (
                  <a 
                    key={idx} 
                    href={(cert as any).link || '#'} 
                    target="_blank" 
                    rel="noreferrer"
                    className="bg-white/5 rounded-lg p-4 border border-white/10 flex flex-col justify-center transition hover:bg-blue-900/40 hover:border-blue-500/50 cursor-pointer block group"
                  >
                    <h4 className="font-semibold text-white text-sm group-hover:text-blue-300 transition">{cert.title}</h4>
                    <span className="text-xs text-gray-400 mt-1">{cert.issuer} • {cert.date}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-6 flex flex-col h-full">
            <motion.h2 
              variants={glitchVariants} 
              initial="hidden" 
              animate={["visible", "glitch"]} 
              className="text-2xl md:text-3xl font-bold text-white mb-6"
            >
              Communicate
            </motion.h2>
            <p className="text-gray-300 mb-6">
              Open for opportunities in ML Engineering and Full-Stack Development. Let&apos;s build the future!
            </p>
            
            <div className="w-full max-w-md bg-white/5 border border-white/10 p-6 rounded-xl">
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <input type="checkbox" name="botcheck" className="hidden" style={{ display: 'none' }} />
                <div>
                  <label htmlFor="name" className="block text-sm text-gray-400 mb-1">Name</label>
                  <input required type="text" id="name" name="name" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm text-gray-400 mb-1">Email</label>
                  <input required type="email" id="email" name="email" className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm text-gray-400 mb-1">Message</label>
                  <textarea required id="message" name="message" rows={4} className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition resize-none"></textarea>
                </div>
                
                <button 
                  type="submit" 
                  disabled={formStatus === 'loading' || formStatus === 'success'}
                  className={`w-full flex items-center justify-center gap-2 py-3 font-bold rounded-lg transition disabled:cursor-not-allowed ${
                    formStatus === 'error' ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {formStatus === 'loading' ? 'Transmitting...' : 
                   formStatus === 'success' ? 'Message Sent!' : 
                   formStatus === 'error' ? 'Error Sending' : (
                    <>Send Transmission <FaPaperPlane size={14} /></>
                  )}
                </button>
                {formStatus === 'success' && (
                  <p className="text-green-400 text-sm text-center mt-2">Signal received. I will reply shortly via Gmail.</p>
                )}
                {formStatus === 'error' && (
                  <p className="text-red-400 text-sm text-center mt-2">Connection failed. Please try again.</p>
                )}
              </form>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4 w-full max-w-md">
              <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/20 text-white rounded-lg hover:bg-white/10 transition">
                <FaGithub size={18} /> GitHub
              </a>
              <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-[#0A66C2]/20 border border-[#0A66C2]/50 text-white rounded-lg hover:bg-[#0A66C2]/40 transition">
                LinkedIn
              </a>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {activeSection && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="pointer-events-auto absolute right-0 top-0 h-full w-full md:w-[600px] bg-black/60 backdrop-blur-xl border-l border-white/10 z-20 overflow-y-auto custom-scrollbar overscroll-y-contain"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div className="p-5 md:p-8 min-h-full">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8 md:mb-10 group text-sm md:text-base"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Return to orbit
            </button>
            
            <div className="pb-24 md:pb-20">
              {renderContent()}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
