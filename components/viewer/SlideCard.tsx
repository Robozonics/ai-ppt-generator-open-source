import { Card } from "@/lib/schema";
import { motion } from "framer-motion";

interface SlideCardProps {
  card: Card;
  theme?: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function SlideCard({ card, theme, isActive, onClick, children }: SlideCardProps) {
  
  // Dynamic Glassmorphism colors based on Theme
  const getThemeClasses = () => {
    switch(theme) {
      case "cyber_obsidian":
        return "bg-black/40 border-green-500/20 shadow-[0_0_50px_-12px_rgba(0,255,100,0.15)]";
      case "aurora_glass":
        return "bg-emerald-900/10 border-teal-500/20 shadow-[0_0_50px_-12px_rgba(0,200,150,0.15)]";
      case "minimal_light":
        return "bg-white/80 border-slate-200 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] text-slate-900";
      case "editorial_serif":
        return "bg-[#faf9f6]/90 border-amber-900/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] text-amber-950";
      case "nebula_dark":
      default:
        return "bg-white/5 border-white/10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]";
    }
  };

  const getRingClasses = () => {
    if (!isActive) return "hover:ring-1 hover:ring-white/20 hover:ring-offset-2 hover:ring-offset-transparent";
    switch(theme) {
      case "cyber_obsidian": return "ring-2 ring-green-500 ring-offset-4 ring-offset-black";
      case "aurora_glass": return "ring-2 ring-teal-500 ring-offset-4 ring-offset-slate-900";
      case "minimal_light": return "ring-2 ring-indigo-500 ring-offset-4 ring-offset-slate-100";
      case "editorial_serif": return "ring-2 ring-amber-700 ring-offset-4 ring-offset-[#f0ede6]";
      case "nebula_dark":
      default: return "ring-2 ring-indigo-500 ring-offset-4 ring-offset-[#0b0f19]";
    }
  };

  const getBadgeClasses = () => {
    switch(theme) {
      case "cyber_obsidian": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "aurora_glass": return "bg-teal-500/20 text-teal-300 border-teal-500/30";
      case "minimal_light": return "bg-slate-200 text-slate-600 border-slate-300";
      case "editorial_serif": return "bg-amber-900/10 text-amber-800 border-amber-900/20";
      case "nebula_dark":
      default: return "bg-indigo-500/20 text-indigo-300 border-indigo-500/30";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-100px" }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onClick={onClick}
      className={[
        "slide-card-wrapper", // Used by globals.css print queries
        "w-full max-w-[1100px] aspect-video relative flex flex-col overflow-hidden",
        "rounded-3xl p-16",
        "backdrop-blur-3xl",
        "snap-center shrink-0",
        "transition-all duration-300 cursor-pointer",
        getThemeClasses(),
        getRingClasses()
      ].join(" ")}
    >
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      {/* Optional Badge */}
      {card.badgeText && (
        <div className={`absolute top-8 right-8 z-20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase border ${getBadgeClasses()}`}>
          {card.badgeText}
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
