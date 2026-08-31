"use client";

import { useDeckStore } from "@/lib/store";
import { PresentationCanvas } from "@/components/viewer/PresentationCanvas";
import { AIChatSidebar } from "@/components/editor/AIChatSidebar";
import { PresentationDeck } from "@/lib/schema";
import { Sparkles } from "lucide-react";

export default function DemoPage() {
  const { deck, setDeck, activeCardId, updateCard } = useDeckStore();

  const loadDemoDeck = () => {
    const demoDeck: PresentationDeck = {
      title: "Demo Presentation",
      theme: "nebula_dark",
      cards: [
        { id: "1", order: 1, layout: "title_hero", badgeText: "Q4 2026 Vision", title: "The Future of Autonomous AI Agents", subtitle: "How reasoning engines will transform enterprise operations by 2026 and beyond.", elements: [] },
        { id: "2", order: 2, layout: "two_column_split", title: "Paradigm Shift in Reasoning", elements: [] },
        { id: "3", order: 3, layout: "three_column_grid", title: "Core Pillars of Autonomy", subtitle: "The three essential components required for autonomous task execution.", elements: [] },
        { id: "4", order: 4, layout: "timeline_flow", title: "Evolution of AI Capabilities", elements: [] },
        { id: "5", order: 5, layout: "metric_showcase", title: "Projected Enterprise Impact", subtitle: "Key performance indicators following full autonomous integration.", elements: [] },
        { id: "6", order: 6, layout: "comparison_matrix", title: "Traditional Software vs. AI Agents", elements: [] }
      ]
    };
    setDeck(demoDeck);
  };

  const handleModifyCard = async (instruction: string) => {
    if (!activeCardId || !deck) {
      throw new Error("No card selected.");
    }

    const currentCard = deck.cards.find((c) => c.id === activeCardId);
    if (!currentCard) {
      throw new Error("Selected card not found.");
    }

    const res = await fetch("/api/modify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction, currentCard }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Modification failed.");
    }

    const data = await res.json();
    updateCard(activeCardId, data.modifiedCard);
  };

  if (!deck) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0b0f19] text-white">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Layout Visualizer</h1>
        <p className="text-xl leading-relaxed text-slate-300 mb-10">Preview all 6 presentation card layouts.</p>
        <button
          onClick={loadDemoDeck}
          className="bg-indigo-600 hover:bg-indigo-500 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center gap-3 transition-colors shadow-lg shadow-indigo-900/30"
        >
          Load Demo Layouts <Sparkles className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-[#0b0f19] flex flex-col overflow-hidden">
      <header className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0b0f19]/80 backdrop-blur-md shrink-0 z-50">
        <span className="font-bold text-white tracking-tight">AIPPT / @Robozonics</span>
        <button
          onClick={() => setDeck(null as any)}
          className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
        >
          ← New Presentation
        </button>
      </header>
      <div className="flex-1 overflow-hidden">
        <PresentationCanvas />
      </div>

      {/* Floating AI Sidebar */}
      <AIChatSidebar
        activeCardId={activeCardId}
        onModifyCard={handleModifyCard}
      />
    </div>
  );
}
