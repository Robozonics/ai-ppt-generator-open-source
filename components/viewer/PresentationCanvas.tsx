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
    default:                   return index === 0 ? <TitleCard card={card} /> : null;
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

  return (
    <ThemeProvider
      palette={deck.colorPalette}
      className="h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth flex flex-col items-center gap-24 py-24 relative presentation-track"
    >
      {/* Dynamic background based on the palette */}
      <div
        className="fixed inset-0 -z-10"
        style={{ backgroundColor: `rgb(var(--theme-bg))` }}
      />
      
      {/* Ambient background glow — uses theme colors */}
      <div
        className="fixed top-[20%] left-[15%] w-[35%] h-[35%] rounded-full blur-[150px] pointer-events-none -z-5"
        style={{ backgroundColor: `rgba(var(--theme-primary), 0.08)` }}
      />
      <div
        className="fixed bottom-[15%] right-[10%] w-[30%] h-[30%] rounded-full blur-[120px] pointer-events-none -z-5"
        style={{ backgroundColor: `rgba(var(--theme-secondary), 0.06)` }}
      />

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
            {renderLayout(card, index)}
          </SlideCard>
        ))}
      </div>
    </ThemeProvider>
  );
}
