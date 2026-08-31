"use client";

import { useDeckStore } from "@/lib/store";
import { SlideCard } from "./SlideCard";
import { TitleCard } from "../layouts/TitleCard";
import { TwoColumnSplit } from "../layouts/TwoColumnSplit";
import { ThreeColumnGrid } from "../layouts/ThreeColumnGrid";
import { TimelineCard } from "../layouts/TimelineCard";
import { MetricCard } from "../layouts/MetricCard";
import { ComparisonCard } from "../layouts/ComparisonCard";
import { ImageGallery } from "../layouts/ImageGallery";
import { QuoteFocus } from "../layouts/QuoteFocus";
import { BigNumber } from "../layouts/BigNumber";

function renderLayout(card: any) {
  switch (card.layout) {
    case "title_hero":         return <TitleCard card={card} />;
    case "two_column_split":   return <TwoColumnSplit card={card} />;
    case "three_column_grid":  return <ThreeColumnGrid card={card} />;
    case "timeline_flow":      return <TimelineCard card={card} />;
    case "metric_showcase":    return <MetricCard card={card} />;
    case "comparison_matrix":  return <ComparisonCard card={card} />;
    case "image_gallery":      return <ImageGallery card={card} />;
    case "quote_focus":        return <QuoteFocus card={card} />;
    case "big_number":         return <BigNumber card={card} />;
    default:                   return null;
  }
}

export function PresentationCanvas() {
  const { deck, activeCardId, setActiveCard } = useDeckStore();

  if (!deck) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-slate-500 bg-[#0b0f19]">
        <p className="text-xl leading-relaxed text-slate-300">No deck loaded.</p>
      </div>
    );
  }

  // Dynamic Canvas Background based on Theme
  const getCanvasBackground = () => {
    switch(deck.theme) {
      case "cyber_obsidian":
        return "bg-black selection:bg-green-500/30";
      case "aurora_glass":
        return "bg-slate-900 selection:bg-teal-500/30";
      case "minimal_light":
        return "bg-slate-100 selection:bg-indigo-500/30";
      case "editorial_serif":
        return "bg-[#f0ede6] selection:bg-amber-900/30";
      case "nebula_dark":
      default:
        return "bg-[#0b0f19] selection:bg-pink-500/30";
    }
  };

  return (
    <div className={`h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth flex flex-col items-center gap-24 py-24 relative presentation-track ${getCanvasBackground()}`}>
      
      {/* Ambient background glows for specific themes */}
      {deck.theme === "cyber_obsidian" && (
        <div className="absolute top-[20%] left-[10%] w-[40%] h-[40%] bg-green-900/10 blur-[150px] rounded-full pointer-events-none fixed" />
      )}
      {deck.theme === "aurora_glass" && (
        <>
          <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-teal-600/10 blur-[120px] rounded-full pointer-events-none fixed" />
          <div className="absolute bottom-[20%] right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none fixed" />
        </>
      )}
      {(deck.theme === "nebula_dark" || !deck.theme) && (
        <div className="absolute top-[30%] left-[30%] w-[30%] h-[30%] bg-indigo-900/20 blur-[120px] rounded-full pointer-events-none fixed" />
      )}

      {/* Slide Cards */}
      <div className="z-10 flex flex-col items-center gap-24 w-full px-6">
        {deck.cards.map((card, index) => (
          <SlideCard
            key={card.id || index}
            card={card}
            theme={deck.theme}
            isActive={activeCardId === card.id}
            onClick={() => setActiveCard(activeCardId === card.id ? null : card.id)}
          >
            {renderLayout(card)}
          </SlideCard>
        ))}
      </div>
    </div>
  );
}
