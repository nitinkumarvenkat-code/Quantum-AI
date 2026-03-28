import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface ModeCardProps {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
  color: 'purple' | 'blue' | 'cyan' | 'violet';
}

export const ModeCard = ({ title, description, icon: Icon, isActive, onClick, color }: ModeCardProps) => {
  const colorMap = {
    purple: 'from-purple-500/20 to-purple-900/20 border-purple-500/30 text-purple-400',
    blue: 'from-blue-500/20 to-blue-900/20 border-blue-500/30 text-blue-400',
    cyan: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30 text-cyan-400',
    violet: 'from-violet-500/20 to-violet-900/20 border-violet-500/30 text-violet-400',
  };

  const glowMap = {
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
    cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    violet: 'shadow-[0_0_20px_rgba(124,58,237,0.2)]',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-start p-6 rounded-2xl border transition-all duration-500 text-left group overflow-hidden glitch-hover",
        isActive 
          ? `bg-gradient-to-br ${colorMap[color]} border-opacity-100 ${glowMap[color]}`
          : "bg-black/40 border-white/10 hover:border-white/20"
      )}
    >
      {/* Tech Corner Details */}
      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-1 h-1 bg-white/20 rounded-full" />
        <div className="w-1 h-1 bg-white/20 rounded-full" />
      </div>

      <div className={cn(
        "p-3 rounded-xl mb-4 transition-colors duration-500 relative",
        isActive ? "bg-white/10" : "bg-white/5 group-hover:bg-white/10"
      )}>
        <Icon size={24} className={cn(
          "transition-all duration-500",
          isActive ? "text-white scale-110" : "text-white/60 group-hover:text-white"
        )} />
        
        {/* Scanning Line on Icon */}
        <motion.div 
          animate={{ top: ["0%", "100%", "0%"] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[1px] bg-white/20 opacity-0 group-hover:opacity-100"
        />
      </div>
      
      <h3 className={cn(
        "text-lg font-display font-semibold mb-1 transition-colors duration-500",
        isActive ? "text-white" : "text-white/80 group-hover:text-white"
      )}>
        {title}
      </h3>
      
      <p className={cn(
        "text-sm leading-relaxed transition-colors duration-500",
        isActive ? "text-white/70" : "text-white/40 group-hover:text-white/60"
      )}>
        {description}
      </p>

      {/* Animated background glow on hover */}
      <div className={cn(
        "absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500",
        `bg-${color}-500`
      )} />
    </motion.button>
  );
};
