import { Card } from "@/lib/schema";
import { motion } from "framer-motion";
import { paletteToCssVars } from "./ThemeProvider";
import { useDeckStore } from "@/lib/store";

interface SlideCardProps {
  card: Card;
  theme?: string;
  isActive?: boolean;
  isPresentMode?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function SlideCard({ card, theme, isActive, isPresentMode = false, onClick, children }: SlideCardProps) {
  const animationsEnabled = useDeckStore((s) => s.animationsEnabled);
  // If this particular card has its own custom colorPalette override, apply it locally!
  const localPaletteVars = card.colorPalette ? paletteToCssVars(card.colorPalette) : {};

  if (isPresentMode) {
    return (
      <motion.div
        initial={animationsEnabled ? { opacity: 0, scale: 0.97 } : false}
        animate={{ opacity: 1, scale: 1 }}
        exit={animationsEnabled ? { opacity: 0, scale: 1.02 } : undefined}
        transition={animationsEnabled ? { duration: 0.45, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
        className="w-full h-screen max-w-none relative flex flex-col justify-center overflow-hidden p-8 md:p-16 lg:p-24 select-none"
        style={{
          ...localPaletteVars,
          backgroundColor: `rgb(var(--theme-bg))`,
        }}
      >
        {/* Dynamic ambient lights spanning entire screen */}
        <div
          className={`absolute -top-40 -right-40 w-[55vw] h-[55vw] rounded-full blur-[140px] pointer-events-none opacity-30 ${
            animationsEnabled ? "animate-pulse-glow" : ""
          }`}
          style={{ backgroundColor: `rgb(var(--theme-secondary))` }}
        />
        <div
          className={`absolute -bottom-40 -left-40 w-[55vw] h-[55vw] rounded-full blur-[140px] pointer-events-none opacity-25 ${
            animationsEnabled ? "animate-pulse-glow" : ""
          }`}
          style={{ backgroundColor: `rgb(var(--theme-primary))` }}
        />

        {/* Optional Badge */}
        {card.badgeText && (
          <div
            className="absolute top-8 right-12 z-20 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border shadow-lg backdrop-blur-md"
            style={{
              backgroundColor: `rgba(var(--theme-primary), 0.15)`,
              color: `rgb(var(--theme-primary))`,
              borderColor: `rgba(var(--theme-primary), 0.4)`,
              boxShadow: `0 0 25px rgba(var(--theme-primary), 0.25)`,
            }}
          >
            {card.badgeText}
          </div>
        )}

        {/* Full-screen content canvas */}
        <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
          {children}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={animationsEnabled ? { opacity: 0, y: 40, scale: 0.96 } : false}
      whileInView={animationsEnabled ? { opacity: 1, y: 0, scale: 1 } : undefined}
      viewport={{ once: false, margin: "-80px" }}
      transition={animationsEnabled ? { duration: 0.55, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
      onClick={onClick}
      className={[
        "slide-card-wrapper", // Used by globals.css print queries
        "w-full max-w-[1120px] aspect-video relative flex flex-col overflow-hidden",
        "rounded-3xl p-10 md:p-14",
        "backdrop-blur-3xl",
        "snap-center shrink-0",
        animationsEnabled ? "transition-all duration-500 cursor-pointer group" : "cursor-pointer group",
        isActive
          ? "ring-2 ring-offset-4 ring-offset-[#0b0f19]"
          : "hover:scale-[1.01] hover:shadow-2xl",
      ].join(" ")}
      style={{
        ...localPaletteVars,
        backgroundImage: `linear-gradient(to bottom right, rgba(var(--theme-primary), 0.08), rgba(var(--theme-surface), 0.35), rgba(var(--theme-primary), 0.04))`,
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isActive
          ? `rgba(var(--theme-primary), 0.5)`
          : `rgba(var(--theme-primary), 0.18)`,
        boxShadow: isActive
          ? `0 0 80px -10px rgba(var(--theme-primary), 0.3)`
          : `0 0 60px -15px rgba(var(--theme-primary), 0.12)`,
        ...(isActive
          ? {
              ringColor: `rgb(var(--theme-primary))`,
              outlineColor: `rgb(var(--theme-primary))`,
              outline: `2px solid rgb(var(--theme-primary))`,
              outlineOffset: "4px",
            }
          : {}),
      }}
    >
      {/* Dynamic ambient card glow that subtly shifts */}
      <div
        className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-700"
        style={{ backgroundColor: `rgb(var(--theme-secondary))` }}
      />
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-25 group-hover:opacity-45 transition-opacity duration-700"
        style={{ backgroundColor: `rgb(var(--theme-primary))` }}
      />

      {/* Subtle top border highlight line */}
      <div
        className="absolute top-0 left-[8%] right-[8%] h-[1px] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, transparent, rgba(var(--theme-primary), 0.4), rgba(var(--theme-text), 0.3), transparent)`,
        }}
      />

      {/* Optional Badge */}
      {card.badgeText && (
        <div
          className="absolute top-8 right-8 z-20 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border shadow-sm backdrop-blur-md"
          style={{
            backgroundColor: `rgba(var(--theme-primary), 0.15)`,
            color: `rgb(var(--theme-primary))`,
            borderColor: `rgba(var(--theme-primary), 0.35)`,
          }}
        >
          {card.badgeText}
        </div>
      )}

      {/* Content layer */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center">
        {children}
      </div>
    </motion.div>
  );
}
