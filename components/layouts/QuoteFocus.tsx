import { Card } from "@/lib/schema";
import { Quote } from "lucide-react";

export function QuoteFocus({ card }: { card: Card }) {
  const quoteEl = card.elements?.find((el) => el.type === "callout" || el.type === "paragraph");
  
  return (
    <div className="w-full h-full flex flex-col relative z-10 p-12">
      {/* Minimal Header */}
      <div className="mb-auto">
        <h2 className="text-xl font-bold tracking-widest text-indigo-400 uppercase">{card.title}</h2>
      </div>

      {/* Massive Quote */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative max-w-4xl mx-auto">
        <Quote className="w-24 h-24 text-white/10 absolute -top-12 -left-12 -rotate-12" />
        
        <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-slate-400 leading-tight drop-shadow-lg z-10">
          "{quoteEl ? quoteEl.content : card.subtitle}"
        </h1>
        
        {quoteEl && card.subtitle && (
          <div className="mt-12 flex items-center gap-4">
            <div className="w-12 h-1 bg-indigo-500 rounded-full" />
            <p className="text-2xl font-medium text-slate-300">{card.subtitle}</p>
          </div>
        )}
      </div>

      {/* Optional Background Image */}
      {card.imageUrl && (
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden opacity-30 mix-blend-overlay">
          <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0b0f19]/80 to-[#0b0f19] mix-blend-multiply" />
        </div>
      )}
    </div>
  );
}
