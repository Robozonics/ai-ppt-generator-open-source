import { Card } from "@/lib/schema";
import { Sparkles } from "lucide-react";

export function TitleCard({ card }: { card?: Card }) {
  const title = card?.title || "The Future of Autonomous AI Agents";
  const subtitle = card?.subtitle || "How reasoning engines will transform enterprise operations by 2026 and beyond.";
  const badge = card?.badgeText || "Q4 2026 Vision";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
      {/* Decorative gradient orbs — uses theme colors */}
      <div
        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse-glow pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-primary), 0.2)` }}
      />
      <div
        className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse-glow pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-secondary), 0.15)`, animationDelay: '1.5s' }}
      />
      <div
        className="absolute top-[30%] right-[20%] w-[25%] h-[25%] rounded-full blur-[80px] animate-pulse-glow pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-accent), 0.1)`, animationDelay: '3s' }}
      />

      {badge && (
        <div
          className="relative inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wider uppercase mb-12 z-10 border"
          style={{
            background: `linear-gradient(to right, rgba(var(--theme-primary), 0.2), rgba(var(--theme-secondary), 0.2))`,
            color: `rgb(var(--theme-primary))`,
            borderColor: `rgba(var(--theme-primary), 0.3)`,
            boxShadow: `0 0 20px -5px rgba(var(--theme-primary), 0.3)`,
          }}
        >
          <Sparkles className="w-4 h-4" style={{ color: `rgb(var(--theme-primary))` }} />
          {badge}
        </div>
      )}

      <h1
        className="text-5xl md:text-6xl font-black tracking-tight mb-8 leading-tight z-10 text-transparent bg-clip-text drop-shadow-lg"
        style={{
          backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-text)), rgba(var(--theme-primary), 0.8), rgba(var(--theme-secondary), 0.7))`,
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className="text-xl leading-relaxed max-w-3xl font-light z-10 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-text), 0.85), rgba(var(--theme-text-muted), 0.9))`,
          }}
        >
          {subtitle}
        </p>
      )}

      {/* Decorative bottom accent line */}
      <div
        className="mt-12 w-32 h-1 rounded-full z-10 animate-gradient-shift"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
          backgroundSize: '200% 100%',
        }}
      />
    </div>
  );
}
