"use client";

import { useDeckStore } from "@/lib/store";
import { SlideCard } from "./SlideCard";
import { ThemeProvider } from "./ThemeProvider";
import { TitleCard } from "../layouts/TitleCard";
import { TwoColumnSplit } from "../layouts/TwoColumnSplit";
import { ThreeColumnGrid } from "../layouts/ThreeColumnGrid";
import { TimelineCard } from "../layouts/TimelineCard";
import { MetricCard } from "../layouts/MetricCard";
import { ComparisonCard } from "../layouts/ComparisonCard";
import { ImageGallery } from "../layouts/ImageGallery";
import { QuoteFocus } from "../layouts/QuoteFocus";
import { BigNumber } from "../layouts/BigNumber";
import { ChartCard } from "../layouts/ChartCard";

function renderLayout(card: any, index: number) {
  const layout = (card.layout || "").toLowerCase().trim();
  switch (layout) {
    case "title_hero":         return <TitleCard card={card} />;
    case "two_column_split":   return <TwoColumnSplit card={card} />;
    case "three_column_grid":  return <ThreeColumnGrid card={card} />;
    case "timeline_flow":      return <TimelineCard card={card} />;
    case "metric_showcase":    return <MetricCard card={card} />;
    case "comparison_matrix":  return <ComparisonCard card={card} />;
    case "image_gallery":      return <ImageGallery card={card} />;
    case "quote_focus":        return <QuoteFocus card={card} />;
    case "big_number":         return <BigNumber card={card} />;
    case "data_chart":
    case "chart_graph":        return <ChartCard card={card} />;
    default:                   return index === 0 ? <TitleCard card={card} /> : <TwoColumnSplit card={card} />;
  }
}
import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2, X, Sparkles, Brain, Zap } from "lucide-react";

export function PresentationCanvas({ isPresentMode = false }: { isPresentMode?: boolean }) {
  const { deck, activeCardId, setActiveCard } = useDeckStore();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalCards = deck?.cards?.length || 0;

  // Track active slide based on scroll position in presentation mode
  useEffect(() => {
    const handleScroll = () => {
      const container = document.querySelector(".presentation-track");
      if (!container || totalCards === 0) return;

      const scrollTop = container.scrollTop;
      const cardHeight = window.innerHeight;
      const index = Math.round(scrollTop / cardHeight);
      setCurrentSlideIndex(Math.min(Math.max(0, index), totalCards - 1));
    };

    const container = document.querySelector(".presentation-track");
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true });
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [totalCards]);

  const scrollToSlide = (index: number) => {
    const container = document.querySelector(".presentation-track");
    if (!container) return;
    const targetY = index * window.innerHeight;
    container.scrollTo({ top: targetY, behavior: "smooth" });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
    }
  };

  const exitPresentation = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log(err));
    }
    const escEvent = new KeyboardEvent("keydown", { key: "Escape", code: "Escape", bubbles: true });
    document.dispatchEvent(escEvent);
  };

  if (!deck) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-slate-500 bg-[#0b0f19]">
        <p className="text-xl leading-relaxed text-slate-300">No deck loaded.</p>
      </div>
    );
  }

  return (
    <ThemeProvider
      palette={deck.colorPalette}
      className={`h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth flex flex-col items-center relative presentation-track ${
        isPresentMode ? "py-0 gap-0 overflow-x-hidden" : "py-20 gap-20"
      }`}
    >
      {/* Top Animated Progress Bar in Presentation Mode */}
      {isPresentMode && totalCards > 0 && (
        <div className="fixed top-0 left-0 right-0 h-1.5 z-50 bg-black/40 backdrop-blur-sm no-print">
          <div
            className="h-full transition-all duration-400 ease-out shadow-lg"
            style={{
              width: `${((currentSlideIndex + 1) / totalCards) * 100}%`,
              backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgb(var(--theme-secondary)), rgb(var(--theme-accent)))`,
              boxShadow: `0 0 16px rgba(var(--theme-primary), 0.9)`,
            }}
          />
        </div>
      )}

      {/* Dynamic Background Surface */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: `rgb(var(--theme-bg))` }}
      />

      {/* Dynamic Ambient Background Lights with Subtle Fluid Movement */}
      <div
        className="fixed top-[-10%] left-[-5%] w-[45vw] h-[45vw] rounded-full blur-[140px] pointer-events-none -z-5 opacity-40 animate-pulse-glow"
        style={{ backgroundColor: `rgb(var(--theme-primary))` }}
      />
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full blur-[140px] pointer-events-none -z-5 opacity-30 animate-pulse-glow"
        style={{
          backgroundColor: `rgb(var(--theme-secondary))`,
          animationDelay: "1.5s",
        }}
      />
      <div
        className="fixed top-[40%] right-[20%] w-[25vw] h-[25vw] rounded-full blur-[120px] pointer-events-none -z-5 opacity-20 animate-float"
        style={{ backgroundColor: `rgb(var(--theme-accent))` }}
      />

      {/* Slide Cards Container */}
      <div
        className={`z-10 flex flex-col items-center w-full ${
          isPresentMode ? "px-0 gap-0" : "px-4 md:px-8 gap-20"
        }`}
      >
        {deck.cards.map((card, index) => (
          <div
            key={card.id || index}
            className={
              isPresentMode
                ? "w-full h-screen flex items-center justify-center snap-center shrink-0 overflow-hidden"
                : "w-full flex justify-center snap-center shrink-0"
            }
          >
            <SlideCard
              card={card}
              theme={deck.theme}
              isActive={activeCardId === card.id}
              isPresentMode={isPresentMode}
              onClick={() => {
                if (isPresentMode) {
                  // In presentation mode, clicking advances to the next slide
                  if (currentSlideIndex < totalCards - 1) {
                    scrollToSlide(currentSlideIndex + 1);
                  }
                } else {
                  setActiveCard(activeCardId === card.id ? null : card.id);
                }
              }}
            >
              {renderLayout(card, index)}
            </SlideCard>
          </div>
        ))}

        {/* Non-intrusive Canvas Footer Branding (Visible when scrolling in Editor mode) */}
        {!isPresentMode && (
          <div className="w-full max-w-4xl py-12 flex flex-col items-center text-center space-y-4 no-print border-t border-white/10 mt-8">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-lg shadow-pink-500/10">
              <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
              <span className="text-xs font-bold tracking-widest uppercase text-pink-300">
                A product of <span className="text-white font-black drop-shadow">Robozonics</span>
              </span>
            </div>

            <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#FF007A] via-[#A855F7] via-[#00F0FF] to-[#FF3366] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(255,0,122,0.4)]">
              Crafted &amp; Developed by Rehan RS
            </h2>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/15 border border-purple-500/30 backdrop-blur-md">
              <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="text-xs md:text-sm font-semibold text-slate-200">
                Powered by the <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent font-bold">Brain of Gemini</span>
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline-block ml-1" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Floating Presentation Controls (HUD) */}
      {isPresentMode && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center items-center pointer-events-none z-50 no-print">
          <div className="pointer-events-auto flex items-center gap-3 bg-black/75 backdrop-blur-2xl border border-white/15 px-5 py-2.5 rounded-full shadow-2xl transition-all duration-300 hover:bg-black/90 hover:border-white/30">
            <button
              onClick={() => scrollToSlide(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
              title="Previous Slide (← / Up)"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-bold tracking-wider text-slate-200 px-3 min-w-[70px] text-center font-mono">
              {currentSlideIndex + 1} / {totalCards}
            </span>

            <button
              onClick={() => scrollToSlide(Math.min(totalCards - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex >= totalCards - 1}
              className="p-1.5 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-white transition-colors"
              title="Next Slide (→ / Down / Space / Click)"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="w-px h-4 bg-white/20 mx-1" />

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            <button
              onClick={exitPresentation}
              className="p-1.5 rounded-full hover:bg-white/10 text-rose-400 hover:text-rose-300 transition-colors"
              title="Exit Presentation (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ThemeProvider>
  );
}

