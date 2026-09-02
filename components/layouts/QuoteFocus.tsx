import { Card } from "@/lib/schema";
import { Quote } from "lucide-react";

export function QuoteFocus({ card }: { card: Card }) {
  const quoteEl = card.elements?.find((el) => el.type === "callout" || el.type === "paragraph");
  
  return (
    <div className="w-full h-full flex flex-col relative z-10 p-12">
      {/* Decorative gradient orbs */}
      <div
        className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full blur-[100px] animate-pulse-glow pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-primary), 0.1)` }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full blur-[80px] animate-pulse-glow pointer-events-none"
        style={{ backgroundColor: `rgba(var(--theme-secondary), 0.1)`, animationDelay: '1.5s' }}
      />

      {/* Minimal Header */}
      <div className="mb-auto">
        <h2
          className="text-lg font-bold tracking-widest uppercase text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))`,
          }}
        >
          {card.title}
        </h2>
      </div>

      {/* Massive Quote */}
      <div className="flex-1 flex flex-col items-center justify-center text-center relative max-w-4xl mx-auto">
        {/* Large decorative gradient quote mark */}
        <div className="absolute -top-8 -left-8 opacity-20">
          <Quote className="w-28 h-28" style={{ color: `rgb(var(--theme-primary))` }} />
        </div>
        
        <h1
          className="text-4xl md:text-5xl font-black leading-tight drop-shadow-lg z-10 text-transparent bg-clip-text"
          style={{
            backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-text)), rgba(var(--theme-primary), 0.8), rgba(var(--theme-secondary), 0.7))`,
          }}
        >
          &ldquo;{quoteEl ? quoteEl.content : card.subtitle}&rdquo;
        </h1>
        
        {quoteEl && card.subtitle && (
          <div className="mt-10 flex items-center gap-4">
            <div
              className="w-16 h-1 rounded-full"
              style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)))` }}
            />
            <p
              className="text-xl font-medium text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, rgba(var(--theme-text), 0.85), rgba(var(--theme-text-muted), 0.9))`,
              }}
            >
              {card.subtitle}
            </p>
          </div>
        )}
      </div>

      {/* Optional Background Image */}
      {card.imageUrl && (
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden opacity-20 mix-blend-overlay">
          <img src={card.imageUrl} className="w-full h-full object-cover" alt="" />
          <div
            className="absolute inset-0 mix-blend-multiply"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(var(--theme-bg), 0.8), rgb(var(--theme-bg)))`,
            }}
          />
        </div>
      )}
    </div>
  );
}
