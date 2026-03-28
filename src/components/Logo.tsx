import React, { useEffect, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export const Logo = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
      setTimeout(triggerGlitch, Math.random() * 5000 + 2000);
    };
    const timeout = setTimeout(triggerGlitch, 3000);
    return () => clearTimeout(timeout);
  }, []);

  const dimensions = {
    sm: "w-12 h-12",
    md: "w-32 h-32",
    lg: "w-64 h-64"
  }[size];

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, perspective: 1000 }}
      className={cn("relative flex items-center justify-center group cursor-crosshair", dimensions)}
    >
      {/* Neural Data Streams (Background to Core) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() > 0.5 ? -100 : 100, 
              y: Math.random() * 200 - 100,
              opacity: 0,
              scale: 0.5
            }}
            animate={{ 
              x: 0, 
              y: 0, 
              opacity: [0, 0.5, 0],
              scale: [0.5, 1, 0.2]
            }}
            transition={{ 
              duration: 2 + Math.random() * 2, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "easeIn"
            }}
            className="absolute w-1 h-[1px] bg-quantum-cyan blur-[1px]"
            style={{ 
              left: "50%", 
              top: "50%",
              transformOrigin: "center"
            }}
          />
        ))}
      </div>

      {/* Neural Constellation Background */}
      <motion.div
        style={{ 
          rotateX: useTransform(mouseY, [-0.5, 0.5], [10, -10]),
          rotateY: useTransform(mouseX, [-0.5, 0.5], [-10, 10]),
          z: -100
        }}
        className="absolute inset-[-100%] opacity-20 pointer-events-none"
      >
        <div className="w-full h-full relative">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-quantum-cyan rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          <svg className="w-full h-full opacity-30">
            <defs>
              <pattern id="constellation" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.5" fill="#06b6d4" />
                <circle cx="90" cy="90" r="0.5" fill="#06b6d4" />
                <line x1="10" y1="10" x2="90" y2="90" stroke="#06b6d4" strokeWidth="0.1" />
              </pattern>
              <mask id="pulse-mask">
                <motion.rect
                  x="0"
                  y="0"
                  width="100%"
                  height="100%"
                  fill="white"
                  animate={{ opacity: [0.1, 0.5, 0.1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="url(#constellation)" mask="url(#pulse-mask)" />
          </svg>
        </div>
      </motion.div>

      {/* Neural Pulse Wave */}
      <motion.div
        animate={{ 
          scale: [1, 2.5],
          opacity: [0.3, 0],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          ease: "easeOut" 
        }}
        className="absolute w-32 h-32 border border-quantum-cyan/30 rounded-full pointer-events-none"
      />

      {/* Liquid Energy Halo */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-[2px] border-transparent border-t-quantum-cyan/20 border-l-quantum-purple/20 blur-[2px] scale-110"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 rounded-full border-[1px] border-transparent border-b-quantum-blue/20 border-r-quantum-cyan/20 blur-[1px] scale-105"
      />

      {/* HUD Brackets with Animated Bars */}
      <div className="absolute -inset-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-quantum-cyan/40" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-quantum-cyan/40" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-quantum-cyan/40" />
        <div className="absolute bottom-0 right-8 w-8 h-8 border-b-2 border-r-2 border-quantum-cyan/40" />
        
        {/* Coordinate Axes (HUD) */}
        <motion.div 
          animate={{ rotateY: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10"
        >
          <div className="absolute top-1/2 left-0 right-0 h-[0.5px] bg-quantum-cyan" />
          <div className="absolute left-1/2 top-0 bottom-0 w-[0.5px] bg-quantum-cyan" />
        </motion.div>

        {/* Frequency Visualizer Bars */}
        <div className="absolute top-0 left-12 flex gap-0.5 items-end h-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [2, 8, 4, 6, 2] }}
              transition={{ duration: 0.5 + i * 0.1, repeat: Infinity }}
              className="w-0.5 bg-quantum-cyan/40"
            />
          ))}
        </div>

        {/* Tech Readouts */}
        <div className="absolute top-0 left-10 text-[6px] font-mono text-quantum-cyan/40 uppercase tracking-widest translate-y-[-12px]">
          Neural Link: <motion.span animate={{ opacity: [1, 0.5, 1] }} transition={{ duration: 0.1, repeat: Infinity }}>0x4F2A</motion.span>
        </div>
        <div className="absolute bottom-0 right-10 text-[6px] font-mono text-quantum-cyan/40 uppercase tracking-widest translate-y-[12px]">
          Core: <motion.span animate={{ opacity: [1, 0.8, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>100% Stable</motion.span>
        </div>
        
        {/* Shifting Hex Codes (HUD) */}
        <div className="absolute top-1/2 right-[-20px] translate-y-[-50%] flex flex-col gap-1 text-[4px] font-mono text-quantum-cyan/20">
          {[...Array(4)].map((_, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.1, 0.3, 0.1], x: [0, 2, 0] }}
              transition={{ duration: 1 + i, repeat: Infinity }}
            >
              {Math.random().toString(16).slice(2, 8).toUpperCase()}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Energy Arcs (Glitch only) */}
      <AnimatePresence>
        {isGlitching && (
          <svg className="absolute inset-[-50%] w-[200%] h-[200%] pointer-events-none z-50 overflow-visible">
            {[...Array(3)].map((_, i) => (
              <motion.path
                key={i}
                d={`M ${50 + Math.random() * 20 - 10},${50 + Math.random() * 20 - 10} L ${Math.random() * 100},${Math.random() * 100}`}
                stroke="#06b6d4"
                strokeWidth="0.5"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </svg>
        )}
      </AnimatePresence>

      {/* Rotating Outer Rings */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-dashed border-quantum-purple/10 rounded-full scale-150"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-dotted border-quantum-blue/10 rounded-[45%] scale-125"
      />

      {/* Hexagonal Frame with Path Animation */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M 50,2 L 95,25 L 95,75 L 50,98 L 5,75 L 5,25 Z"
            fill="none"
            stroke="url(#grad1)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: 1, 
              opacity: isGlitching ? [0.8, 0.2, 0.8] : 0.3,
              x: isGlitching ? [-2, 2, 0] : 0
            }}
            transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
          />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Core Neural Sphere */}
      <motion.div
        animate={{
          scale: isGlitching ? [1, 1.1, 0.9, 1] : [1, 1.03, 1],
          boxShadow: [
            "0 0 40px rgba(168,85,247,0.2)",
            "0 0 80px rgba(168,85,247,0.4)",
            "0 0 40px rgba(168,85,247,0.2)"
          ],
          x: isGlitching ? [-5, 5, -2, 0] : 0
        }}
        transition={{ duration: isGlitching ? 0.15 : 5, repeat: isGlitching ? 0 : Infinity, ease: "easeInOut" }}
        className="absolute w-2/3 h-2/3 rounded-3xl z-10 flex items-center justify-center overflow-hidden bg-black border border-white/5"
      >
        {/* Animated Background Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-quantum-purple/10 via-transparent to-quantum-blue/10" />
        
        {/* Digital Matrix Grid */}
        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:8px_8px]" />
        
        {/* Digital Rain Particles */}
        <div className="absolute inset-0 pointer-events-none opacity-30">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 100, opacity: [0, 1, 0] }}
              transition={{ 
                duration: 1 + Math.random() * 2, 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="absolute w-[1px] h-4 bg-quantum-cyan"
              style={{ left: `${Math.random() * 100}%` }}
            />
          ))}
        </div>

        {/* Plasma Glow */}
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: 360
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full bg-gradient-to-r from-quantum-purple/20 to-quantum-blue/20 blur-3xl rounded-full"
        />

        {/* Neural Sparkle Core (AI Assistant Style) */}
        <div className="relative z-20 w-3/4 h-3/4 flex items-center justify-center">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_20px_rgba(255,255,255,0.6)]">
            {/* Main Sparkle Body */}
            <motion.path
              d="M 50,10 L 58,42 L 90,50 L 58,58 L 50,90 L 42,58 L 10,50 L 42,42 Z"
              fill="white"
              initial={{ scale: 0, rotate: -45 }}
              animate={{ 
                scale: isGlitching ? [1, 1.2, 0.9, 1] : 1,
                rotate: isGlitching ? [0, 90, -10, 0] : 0,
                filter: isGlitching ? "blur(2px)" : "blur(0px)"
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
            
            {/* Internal Geometric Detail */}
            <motion.path
              d="M 50,25 L 55,45 L 75,50 L 55,55 L 50,75 L 45,55 L 25,50 L 45,45 Z"
              fill="none"
              stroke="url(#grad1)"
              strokeWidth="2"
              animate={{ opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Glitch Layers (Chromatic Aberration) */}
            <motion.path
              d="M 50,10 L 58,42 L 90,50 L 58,58 L 50,90 L 42,58 L 10,50 L 42,42 Z"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="2"
              className="opacity-40"
              animate={{ 
                x: isGlitching ? [-4, 4, -2] : [-1, 1, -1], 
                y: isGlitching ? [2, -2, 1] : [1, -1, 1],
                opacity: isGlitching ? 0.8 : 0.2
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
            />
            <motion.path
              d="M 50,10 L 58,42 L 90,50 L 58,58 L 50,90 L 42,58 L 10,50 L 42,42 Z"
              fill="none"
              stroke="#a855f7"
              strokeWidth="2"
              className="opacity-40"
              animate={{ 
                x: isGlitching ? [4, -4, 2] : [1, -1, 1], 
                y: isGlitching ? [-2, 2, -1] : [-1, 1, -1],
                opacity: isGlitching ? 0.8 : 0.2
              }}
              transition={{ duration: 0.1, repeat: Infinity }}
            />

            {/* High-Intensity Intelligence Core Point */}
            <motion.circle
              cx="50"
              cy="50"
              r="2"
              fill="white"
              animate={{ 
                scale: [1, 2, 1],
                opacity: [0.5, 1, 0.5],
                filter: ["blur(0px)", "blur(4px)", "blur(0px)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </svg>
        </div>

        {/* Neural Connectors (Pulsating Lines) */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-[1px] bg-gradient-to-r from-white to-transparent origin-left"
              style={{ rotate: i * 90 }}
              animate={{ 
                width: [0, 100, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.5,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>

        {/* Data Stream Fragments (Binary/Hex) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
          <AnimatePresence>
            {isGlitching && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                exit={{ opacity: 0 }}
                className="text-[8px] font-mono text-quantum-cyan whitespace-pre leading-none"
              >
                {`01011010\n0x4F2A\nSYNC_OK\n1100101`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Scanning Line */}
        <motion.div
          animate={{ top: ["-20%", "120%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-quantum-cyan to-transparent z-30 opacity-60 shadow-[0_0_15px_#06b6d4]"
        />
      </motion.div>

      {/* Global Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

      {/* Orbiting Tech Nodes */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 15 + i * 5, repeat: Infinity, ease: "linear" }}
          className="absolute w-full h-full pointer-events-none"
        >
          <div 
            className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-quantum-cyan rounded-full shadow-[0_0_8px_#06b6d4]" 
            style={{ transform: `scale(${1 - i * 0.15})` }}
          />
          {/* Connection Line to Core */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[0.5px] h-1/2 bg-gradient-to-b from-quantum-cyan/20 to-transparent origin-top" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export const LogoText = ({ align = "center" }: { align?: "left" | "center" | "right" }) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 150);
      setTimeout(triggerGlitch, Math.random() * 8000 + 3000);
    };
    const timeout = setTimeout(triggerGlitch, 4000);
    return () => clearTimeout(timeout);
  }, []);

  const shimmerX = useSpring(useTransform(mouseX, [0, 1], [-50, 150]), { damping: 20 });

  const alignmentClasses = {
    left: "items-start text-left",
    center: "items-center text-center",
    right: "items-end text-right"
  }[align];

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("flex flex-col mt-8 relative group", alignmentClasses)}
    >
      {/* Digital Interference Overlay */}
      <AnimatePresence>
        {isGlitching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-[-20px] bg-quantum-cyan/10 mix-blend-screen pointer-events-none z-50"
            style={{
              clipPath: `polygon(0 10%, 100% 10%, 100% 15%, 0 15%, 0 40%, 100% 40%, 100% 45%, 0 45%)`
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          x: isGlitching ? [-2, 2, 0] : 0
        }}
        transition={{ duration: 1.2 }}
        className={cn("flex flex-col", alignmentClasses)}
      >
        <div className="relative flex items-center gap-8">
          {/* "Quantum" Text */}
          <div className="relative">
            <h1 className={cn(
              "text-6xl font-display font-black tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-quantum-purple via-white to-white drop-shadow-[0_0_40px_rgba(168,85,247,0.6)] uppercase italic transition-all relative overflow-hidden",
              isGlitching && "skew-x-12 blur-[1px]"
            )}>
              Quantum
              <motion.div 
                style={{ left: shimmerX.get() + "%" }}
                className="absolute top-0 bottom-0 w-12 bg-white/20 skew-x-[-20deg] blur-xl pointer-events-none"
              />
            </h1>
            <h1 className={cn(
              "absolute inset-0 text-6xl font-display font-black tracking-[0.15em] text-red-500/30 blur-[2px] uppercase italic pointer-events-none transition-transform",
              isGlitching ? "translate-x-2 -translate-y-1 opacity-100" : "opacity-0"
            )}>
              Quantum
            </h1>
          </div>

          {/* Logo in the Middle */}
          <div className="relative z-50 scale-75">
            <Logo size="md" />
          </div>

          {/* "AI" Text */}
          <div className="relative">
            <h1 className={cn(
              "text-6xl font-display font-black tracking-[0.15em] bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-quantum-blue drop-shadow-[0_0_40px_rgba(59,130,246,0.6)] uppercase italic transition-all relative overflow-hidden",
              isGlitching && "skew-x-12 blur-[1px]"
            )}>
              AI
              <motion.div 
                style={{ left: shimmerX.get() + "%" }}
                className="absolute top-0 bottom-0 w-12 bg-white/20 skew-x-[-20deg] blur-xl pointer-events-none"
              />
            </h1>
            <h1 className={cn(
              "absolute inset-0 text-6xl font-display font-black tracking-[0.15em] text-quantum-cyan opacity-20 blur-[2px] -translate-x-1 translate-y-1 uppercase italic pointer-events-none",
              isGlitching && "translate-x-[-3px] translate-y-[2px]"
            )}>
              AI
            </h1>
          </div>
        </div>

        {/* Aura Intelligence & Credit */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className={cn("flex flex-col mt-4 mb-4", alignmentClasses)}
        >
          <h2 className="text-xl font-display font-bold tracking-[0.3em] text-quantum-cyan uppercase italic opacity-80">
            Aura Intelligence
          </h2>
          <div className="flex items-center gap-3 mt-1">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-white/20" />
            <span className="text-[10px] font-mono text-white/60 tracking-[0.4em] uppercase">
              Owned by Nitin
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-white/20" />
          </div>
        </motion.div>
        
        <div className="flex items-center gap-4 mt-4">
          <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-mono text-quantum-cyan tracking-[0.6em] uppercase font-bold animate-pulse">
              Neural Core v4.0.2
            </span>
            {/* Neural Sync Progress Bar */}
            <div className="w-32 h-[2px] bg-white/5 rounded-full overflow-hidden relative">
              <motion.div
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-quantum-cyan to-transparent"
              />
            </div>
          </div>
          <div className="h-[1px] w-16 bg-gradient-to-l from-transparent via-white/20 to-transparent" />
        </div>
        
        <div className="mt-4 flex gap-8 text-[8px] font-mono text-white/20 uppercase tracking-[0.4em]">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-green-500 rounded-full animate-ping" />
            Status: Optimal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 bg-quantum-cyan rounded-full" />
            Sync: 100%
          </span>
          <span className="flex items-center gap-1 opacity-50">
            Latency: 0.001ms
          </span>
        </div>
      </motion.div>
    </div>
  );
};

export const VoiceRecognition = ({ onResult }: { onResult: (text: string) => void }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onResult]);

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={startListening}
        disabled={isListening}
        className={cn(
          "relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden group",
          isListening 
            ? "bg-quantum-purple shadow-[0_0_30px_rgba(168,85,247,0.5)]" 
            : "bg-white/5 border border-white/10 hover:border-quantum-cyan/50"
        )}
      >
        {/* Animated Background for Listening State */}
        {isListening && (
          <motion.div
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-quantum-purple blur-xl"
          />
        )}

        <div className="relative z-10">
          {isListening ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : (
            <Mic className="w-8 h-8 text-quantum-cyan group-hover:text-white transition-colors" />
          )}
        </div>

        {/* Ripple Effect */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 border-2 border-quantum-purple rounded-full"
            />
          )}
        </AnimatePresence>
      </motion.button>

      <div className="flex flex-col items-center">
        <span className={cn(
          "text-[10px] font-mono uppercase tracking-[0.3em] transition-colors",
          isListening ? "text-quantum-purple animate-pulse" : "text-white/40"
        )}>
          {isListening ? "Listening..." : "Voice Command"}
        </span>
        {!isListening && (
          <span className="text-[6px] font-mono text-white/20 mt-1 uppercase tracking-[0.5em]">
            Quantum Link • Owned by Nitin
          </span>
        )}
        {error && (
          <span className="text-[8px] font-mono text-red-500 mt-1 uppercase tracking-widest">
            {error}
          </span>
        )}
      </div>
    </div>
  );
};
