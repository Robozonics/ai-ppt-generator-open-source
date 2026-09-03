import { Card } from "@/lib/schema";
import { CircleDot } from "lucide-react";

export function TimelineCard({ card }: { card?: Card }) {
  const title = card?.title || "Evolution of AI Capabilities";
  const subtitle = card?.subtitle || "Key technological and adoption milestones across the roadmap.";

  const milestones = card?.elements || [
    { id: "1", type: "callout", title: "Phase 1: Foundation", content: "Widespread adoption of foundational language models and basic text automation." },
    { id: "2", type: "callout", title: "Phase 2: Workflows", content: "Introduction of tool-use, multi-agent orchestration, and context expansion." },
    { id: "3", type: "callout", title: "Phase 3: Deep Reasoning", content: "Models develop robust chain-of-thought, self-verification, and planning capabilities." },
    { id: "4", type: "callout", title: "Phase 4: True Autonomy", content: "End-to-end digital workers executing high-complexity tasks reliably." }
  ];

  // Each node uses a different accent from the palette
  const accentVars = ["--theme-accent-1", "--theme-accent-2", "--theme-accent-3", "--theme-accent-4"];

  const colClass = milestones.length === 2 
    ? "grid-cols-1 md:grid-cols-2" 
    : milestones.length === 3 
      ? "grid-cols-1 md:grid-cols-3" 
      : "grid-cols-1 md:grid-cols-4";

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="text-center mb-8">
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))` }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg max-w-2xl mx-auto font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {subtitle}
          </p>
        )}
        <div
          className="mx-auto w-20 h-1 rounded-full mt-4"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-accent-1)), rgb(var(--theme-accent-3)), rgb(var(--theme-accent-4)))`,
          }}
        />
      </div>

      <div className="relative flex-1 flex flex-col justify-center max-w-6xl mx-auto w-full">
        {/* Gradient track line (visible on desktop) */}
        <div
          className="hidden md:block absolute top-1/2 left-8 right-8 h-[3px] -translate-y-1/2 rounded-full pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-accent-1), 0.6), rgba(var(--theme-accent-2), 0.4), rgba(var(--theme-accent-3), 0.4), rgba(var(--theme-accent-4), 0.6))`,
          }}
        />
        {/* Glowing pulse overlay on track */}
        <div
          className="hidden md:block absolute top-1/2 left-8 right-8 h-[3px] -translate-y-1/2 rounded-full animate-pulse-glow pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-accent-1), 0.4), rgba(var(--theme-accent-2), 0.3), rgba(var(--theme-accent-3), 0.3), rgba(var(--theme-accent-4), 0.4))`,
          }}
        />

        <div className={`grid ${colClass} gap-6 md:gap-8 relative z-10 w-full`}>
          {milestones.map((el: any, index: number) => {
            const accentVar = accentVars[index % accentVars.length];
            const isEven = index % 2 === 0;
            return (
              <div key={el.id || index} className="flex flex-col items-center text-center">
                <div className={`flex flex-col items-center w-full ${isEven ? "md:mb-4" : "md:mt-12"}`}>
                  {isEven && (
                    <div
                      className="mb-4 flex flex-col justify-end p-5 rounded-2xl backdrop-blur-md border shadow-lg w-full transition-all duration-300 hover:-translate-y-1"
                      style={{
                        backgroundColor: `rgba(var(--theme-surface), 0.4)`,
                        borderColor: `rgba(var(${accentVar}), 0.3)`,
                      }}
                    >
                      <h3 className="text-base md:text-lg font-bold mb-2" style={{ color: `rgb(var(${accentVar}))` }}>
                        {el.title}
                      </h3>
                      <p className="text-sm leading-relaxed font-light" style={{ color: `rgb(var(--theme-text))` }}>
                        {el.content}
                      </p>
                    </div>
                  )}

                  {/* Glowing Node */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 shrink-0 shadow-lg"
                    style={{
                      backgroundColor: `rgb(var(${accentVar}))`,
                      boxShadow: `0 0 24px rgba(var(${accentVar}), 0.6)`,
                    }}
                  >
                    <CircleDot className="w-6 h-6 text-white" />
                  </div>

                  {!isEven && (
                    <div
                      className="mt-4 flex flex-col justify-start p-5 rounded-2xl backdrop-blur-md border shadow-lg w-full transition-all duration-300 hover:translate-y-1"
                      style={{
                        backgroundColor: `rgba(var(--theme-surface), 0.4)`,
                        borderColor: `rgba(var(${accentVar}), 0.3)`,
                      }}
                    >
                      <h3 className="text-base md:text-lg font-bold mb-2" style={{ color: `rgb(var(${accentVar}))` }}>
                        {el.title}
                      </h3>
                      <p className="text-sm leading-relaxed font-light" style={{ color: `rgb(var(--theme-text))` }}>
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
