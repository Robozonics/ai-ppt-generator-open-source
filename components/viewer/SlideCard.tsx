import { Card } from "@/lib/schema";
import { motion } from "framer-motion";
import { paletteToCssVars } from "./ThemeProvider";

interface SlideCardProps {
  card: Card;
  theme?: string;
  isActive?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export function SlideCard({ card, theme, isActive, onClick, children }: SlideCardProps) {
  // If this particular card has its own custom colorPalette override, apply it locally!
  const localPaletteVars = card.colorPalette ? paletteToCssVars(card.colorPalette) : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, margin: "-80px" }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={[
        "slide-card-wrapper", // Used by globals.css print queries
        "w-full max-w-[1120px] aspect-video relative flex flex-col overflow-hidden",
        "rounded-3xl p-14 md:p-16",
        "backdrop-blur-3xl",
        "snap-center shrink-0",
        "transition-all duration-500 cursor-pointer group",
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
      <div className="relative z-10 w-full h-full flex flex-col">
        {children}
      </div>
    </motion.div>
  );
}
