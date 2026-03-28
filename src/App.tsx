import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Zap, 
  Languages, 
  FileText, 
  Code, 
  Palette, 
  Brain,
  ChevronLeft,
  LayoutDashboard
} from 'lucide-react';
import { Logo, LogoText, VoiceRecognition } from './components/Logo';
import { ModeCard } from './components/ModeCard';
import { AIInterface } from './components/AIInterface';
import { cn } from './lib/utils';

type Mode = 'chat' | 'flash' | 'translator' | 'document' | 'code' | 'creative' | 'knowledge';

const MODES = [
  { id: 'chat', title: 'Real-Time Chat', description: 'Conversational AI with deep context awareness.', icon: Sparkles, color: 'purple' },
  { id: 'flash', title: 'Flash Answer', description: 'Ultra-fast, concise one-line responses.', icon: Zap, color: 'blue' },
  { id: 'translator', title: 'Smart Translator', description: 'Real-time translation across major languages.', icon: Languages, color: 'cyan' },
  { id: 'document', title: 'Doc Assistant', description: 'Summarize, rewrite, and analyze any text.', icon: FileText, color: 'violet' },
  { id: 'code', title: 'Code Assistant', description: 'Generate, debug, and explain complex code.', icon: Code, color: 'purple' },
  { id: 'creative', title: 'Creative Gen', description: 'Generate logos, images, and branding ideas.', icon: Palette, color: 'blue' },
  { id: 'knowledge', title: 'Knowledge Engine', description: 'Structured explanations for complex topics.', icon: Brain, color: 'cyan' },
] as const;

export default function App() {
  const [activeMode, setActiveMode] = useState<Mode | null>(null);
  const [voiceResult, setVoiceResult] = useState<string | null>(null);
  const [pendingVoiceInput, setPendingVoiceInput] = useState<string>("");

  const handleVoiceResult = (text: string) => {
    setVoiceResult(text);
    
    // Intelligent Routing Logic
    const lowerText = text.toLowerCase();
    
    if (activeMode) {
      // If a mode is already active, we could potentially auto-send it
      setPendingVoiceInput(text);
    } else {
      // Route to appropriate mode from dashboard
      setPendingVoiceInput(text);
      if (lowerText.includes('code') || lowerText.includes('program') || lowerText.includes('script')) {
        setActiveMode('code');
      } else if (lowerText.includes('translate') || lowerText.includes('to spanish') || lowerText.includes('to french')) {
        setActiveMode('translator');
      } else if (lowerText.includes('draw') || lowerText.includes('generate image') || lowerText.includes('creative')) {
        setActiveMode('creative');
      } else if (lowerText.includes('summarize') || lowerText.includes('document') || lowerText.includes('analyze')) {
        setActiveMode('document');
      } else if (lowerText.includes('explain') || lowerText.includes('knowledge') || lowerText.includes('what is')) {
        setActiveMode('knowledge');
      } else if (lowerText.includes('fast') || lowerText.includes('quick') || lowerText.includes('flash')) {
        setActiveMode('flash');
      } else {
        setActiveMode('chat');
      }
    }

    setTimeout(() => setVoiceResult(null), 5000);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-quantum-purple/30">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-quantum-purple/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-quantum-blue/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        
        {/* Futuristic HUD Elements */}
        <div className="absolute top-10 left-10 hud-bracket border-t border-l" />
        <div className="absolute top-10 right-10 hud-bracket border-t border-r" />
        <div className="absolute bottom-10 left-10 hud-bracket border-b border-l" />
        <div className="absolute bottom-10 right-10 hud-bracket border-b border-r" />
        
        <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-full" />
          ))}
        </div>

        <div className="absolute top-4 right-20 text-[8px] font-mono text-white/20 tracking-[0.5em] uppercase vertical-text">
          Neural Link: 0x4F2A • Latency: 2ms • Stream: Active
        </div>
      </div>

      <main className="relative z-10 container mx-auto px-6 py-12 min-h-screen flex flex-col">
        {/* Navigation / Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setActiveMode(null)}>
            <Logo size="sm" />
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-xl tracking-wider">QUANTUM AI</h1>
              <div className="flex items-center gap-2">
                <p className="text-[8px] tracking-[0.3em] text-quantum-cyan uppercase">Neural Intelligence</p>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <p className="text-[8px] tracking-[0.3em] text-white/20 uppercase">Owned by Nitin</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeMode && (
              <button 
                onClick={() => setActiveMode(null)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-sm font-medium"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </button>
            )}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-quantum-purple to-quantum-blue p-[1px]">
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Quantum" alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {!activeMode ? (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              <div className="text-center mb-16">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block mb-6"
                >
                  <LogoText align="center" />
                  <div className="mt-12 flex flex-col items-center">
                    <VoiceRecognition onResult={handleVoiceResult} />
                    <AnimatePresence>
                      {voiceResult && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-4 text-quantum-cyan font-mono text-sm uppercase tracking-widest"
                        >
                          Recognized: "{voiceResult}"
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-display font-bold mb-4 tracking-tight"
                >
                  The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-quantum-purple to-quantum-blue">Multitasking</span> AI
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-white/40 text-lg max-w-2xl mx-auto"
                >
                  Chat. Solve. Translate. Create. Instantly. Experience the future of neural intelligence with Quantum AI.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-7xl">
                {MODES.map((mode, index) => (
                  <motion.div
                    key={mode.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <ModeCard
                      {...mode}
                      isActive={false}
                      onClick={() => {
                        setPendingVoiceInput("");
                        setActiveMode(mode.id as Mode);
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="interface"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 flex flex-col"
            >
              <div className="flex items-center gap-4 mb-6">
                <button 
                  onClick={() => setActiveMode(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>
                <div>
                  <h2 className="text-2xl font-display font-bold capitalize">{activeMode} Mode</h2>
                  <p className="text-sm text-white/40">Quantum AI Neural Stream</p>
                </div>
              </div>
              
              <div className="flex-1 min-h-[600px]">
                <AIInterface 
                  mode={activeMode} 
                  initialInput={pendingVoiceInput} 
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-white/20 text-xs uppercase tracking-[0.2em]">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p>© 2026 Quantum Neural Systems. All rights reserved.</p>
            <span className="hidden md:block w-1 h-1 bg-white/10 rounded-full" />
            <p className="text-quantum-cyan/50">Owned by Nitin</p>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-quantum-purple transition-colors">Privacy Protocol</a>
            <a href="#" className="hover:text-quantum-blue transition-colors">Neural Terms</a>
            <a href="#" className="hover:text-quantum-cyan transition-colors">System Status</a>
          </div>
        </footer>
      </main>
    </div>
  );
}
