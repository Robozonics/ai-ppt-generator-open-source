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

  // Each node uses a different accent from the palette
  const accentVars = ["--theme-accent-1", "--theme-accent-2", "--theme-accent-3", "--theme-accent-4"];

  return (
    <div className="w-full h-full flex flex-col">
      <h2
        className="text-3xl font-bold tracking-tight mb-4 text-center text-transparent bg-clip-text"
        style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.75))` }}
      >
        {title}
      </h2>
      <div
        className="mx-auto w-20 h-1 rounded-full mb-14"
        style={{
          backgroundImage: `linear-gradient(to right, rgb(var(--theme-accent-1)), rgb(var(--theme-accent-3)), rgb(var(--theme-accent-4)))`,
        }}
      />

      <div className="relative flex-1 flex flex-col justify-center">
        {/* Gradient track line */}
        <div
          className="absolute top-1/2 left-4 right-4 h-[3px] -translate-y-1/2 rounded-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-accent-1), 0.6), rgba(var(--theme-accent-2), 0.4), rgba(var(--theme-accent-3), 0.4), rgba(var(--theme-accent-4), 0.6))`,
          }}
        />
        {/* Glowing pulse overlay on track */}
        <div
          className="absolute top-1/2 left-4 right-4 h-[3px] -translate-y-1/2 rounded-full animate-pulse-glow"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-accent-1), 0.3), rgba(var(--theme-accent-2), 0.2), rgba(var(--theme-accent-3), 0.2), rgba(var(--theme-accent-4), 0.3))`,
          }}
        />

        <div className="grid grid-cols-4 gap-8 relative z-10 w-full">
          {milestones.map((el: any, index: number) => {
            const accentVar = accentVars[index % accentVars.length];
            return (
              <div key={el.id || index} className="flex flex-col items-center text-center">
                <div className={`flex flex-col items-center ${index % 2 === 0 ? "mb-6" : "mt-16"}`}>
                  {index % 2 === 0 && (
                    <div
                      className="mb-6 flex flex-col justify-end p-4 rounded-xl backdrop-blur-sm border"
                      style={{
                        backgroundColor: `rgba(var(--theme-text), 0.03)`,
                        borderColor: `rgba(var(${accentVar}), 0.3)`,
                      }}
                    >
                      <h3 className="text-base font-bold mb-2 text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to bottom right, rgb(var(${accentVar})), rgba(var(${accentVar}), 0.7))` }}>
                        {el.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
                        {el.content}
                      </p>
                    </div>
                  )}

                  {/* Glowing Node */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110"
                    style={{
                      backgroundColor: `rgb(var(${accentVar}))`,
                      boxShadow: `0 0 20px rgba(var(${accentVar}), 0.5)`,
                    }}
                  >
                    <CircleDot className="w-6 h-6 text-white" />
                  </div>

                  {index % 2 !== 0 && (
                    <div
                      className="mt-6 flex flex-col justify-start p-4 rounded-xl backdrop-blur-sm border"
                      style={{
                        backgroundColor: `rgba(var(--theme-text), 0.03)`,
                        borderColor: `rgba(var(${accentVar}), 0.3)`,
                      }}
                    >
                      <h3 className="text-base font-bold mb-2 text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to bottom right, rgb(var(${accentVar})), rgba(var(${accentVar}), 0.7))` }}>
                        {el.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
                        {el.content}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
