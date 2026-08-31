import { Card } from "@/lib/schema";
import { Sparkles } from "lucide-react";

export function TitleCard({ card }: { card?: Card }) {
  const title = card?.title || "The Future of Autonomous AI Agents";
  const subtitle = card?.subtitle || "How reasoning engines will transform enterprise operations by 2026 and beyond.";
  const badge = card?.badgeText || "Q4 2026 Vision";

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center">
      {badge && (
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-500/15 text-indigo-300 text-sm font-semibold tracking-wider uppercase border border-indigo-400/20 mb-10">
          <Sparkles className="w-4 h-4" />
          {badge}
        </div>
      )}

      <h1 className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-slate-400 mb-8 leading-tight">
        {title}
      </h1>

      {subtitle && (
        <p className="text-xl leading-relaxed text-slate-300 max-w-3xl font-light">
          {subtitle}
        </p>
      )}
    </div>
  );
}
