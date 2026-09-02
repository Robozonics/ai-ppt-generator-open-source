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
        isActive
          ? "ring-2 ring-offset-4"
          : "hover:ring-1 hover:ring-offset-2 hover:ring-offset-transparent",
      ].join(" ")}
      style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.06), rgba(var(--theme-surface), 0.3), rgba(var(--theme-primary), 0.06))`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: `rgba(var(--theme-primary), 0.15)`,
        boxShadow: `0 0 60px -12px rgba(var(--theme-primary), 0.1)`,
        ...(isActive ? {
          ringColor: `rgb(var(--theme-primary))`,
          outlineColor: `rgb(var(--theme-primary))`,
          outline: `2px solid rgb(var(--theme-primary))`,
          outlineOffset: '4px',
        } : {}),
      }}
    >
      {/* Richer gradient overlay for depth */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-text), 0.04), transparent, rgba(var(--theme-text), 0.02))`,
      }} />
      
      {/* Subtle top border highlight */}
      <div
        className="absolute top-0 left-[10%] right-[10%] h-[1px] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, rgba(var(--theme-text), 0.2), transparent)`,
        }}
      />

      {/* Optional Badge */}
      {card.badgeText && (
        <div
          className="absolute top-8 right-8 z-20 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase border"
          style={{
            backgroundColor: `rgba(var(--theme-primary), 0.2)`,
            color: `rgb(var(--theme-primary))`,
            borderColor: `rgba(var(--theme-primary), 0.3)`,
          }}
        >
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
