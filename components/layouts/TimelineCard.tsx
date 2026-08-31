import { Card } from "@/lib/schema";
import { CircleDot } from "lucide-react";

export function TimelineCard({ card }: { card?: Card }) {
  const title = card?.title || "Evolution of AI Capabilities";

  const milestones = card?.elements || [
    { id: "1", type: "callout", title: "2023: LLM Emergence", content: "Widespread adoption of conversational interfaces and basic text generation." },
    { id: "2", type: "callout", title: "2024: Agentic Workflows", content: "Introduction of tool-use and multi-agent orchestration." },
    { id: "3", type: "callout", title: "2025: Reliable Reasoning", content: "Models develop robust chain-of-thought capabilities." },
    { id: "4", type: "callout", title: "2026: True Autonomy", content: "End-to-end autonomous digital workers operating independently." }
  ];

  const nodeColors = [
    "bg-indigo-500 shadow-indigo-500/30",
    "bg-emerald-500 shadow-emerald-500/30",
    "bg-amber-500 shadow-amber-500/30",
    "bg-rose-500 shadow-rose-500/30",
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-16 text-center">{title}</h2>

      <div className="relative flex-1 flex flex-col justify-center">
        {/* Horizontal track line */}
        <div className="absolute top-1/2 left-4 right-4 h-[2px] bg-gradient-to-r from-indigo-500/40 via-white/20 to-rose-500/40 -translate-y-1/2" />

        <div className="grid grid-cols-4 gap-12 relative z-10 w-full">
          {milestones.map((el: any, index: number) => (
            <div key={el.id} className="flex flex-col items-center text-center">
              <div className={`flex flex-col items-center ${index % 2 === 0 ? "mb-6" : "mt-20"}`}>
                {index % 2 === 0 && (
                  <div className="mb-6 flex flex-col justify-end">
                    <h3 className="text-lg font-bold text-white mb-2">{el.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{el.content}</p>
                  </div>
                )}

                {/* Node */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${nodeColors[index % nodeColors.length]}`}>
                  <CircleDot className="w-5 h-5 text-white" />
                </div>

                {index % 2 !== 0 && (
                  <div className="mt-6 flex flex-col justify-start">
                    <h3 className="text-lg font-bold text-white mb-2">{el.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{el.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
