import { Card } from "@/lib/schema";
import { Check, X } from "lucide-react";

export function ComparisonCard({ card }: { card?: Card }) {
  const title = card?.title || "Traditional Software vs. AI Agents";

  // Try to extract comparison data from card elements
  const comparisonElements = card?.elements?.filter((el: any) => el.type === "bullet_list" || el.type === "callout") || [];

  const features = [
    { name: "Deterministic Logic",         traditional: true,  agents: false },
    { name: "Self-Correction",             traditional: false, agents: true  },
    { name: "Dynamic Planning",            traditional: false, agents: true  },
    { name: "Unstructured Data Handling",   traditional: false, agents: true  },
    { name: "Predictable Execution Paths", traditional: true,  agents: false },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="text-center mb-10">
        <h2
          className="text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.75))` }}
        >
          {title}
        </h2>
        <div
          className="mx-auto w-20 h-1 rounded-full"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-accent)), rgb(var(--theme-primary)))` }}
        />
      </div>

      <div className="flex-1 flex justify-center items-center">
        <div
          className="w-full rounded-2xl overflow-hidden border"
          style={{
            borderColor: `rgba(var(--theme-text), 0.1)`,
            boxShadow: `0 0 40px -10px rgba(var(--theme-primary), 0.1)`,
          }}
        >
          {/* Header Row */}
          <div
            className="grid grid-cols-3"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(var(--theme-text), 0.06), rgba(var(--theme-text), 0.04), rgba(var(--theme-primary), 0.08))`,
              borderBottom: `1px solid rgba(var(--theme-text), 0.1)`,
            }}
          >
            <div className="p-5 font-semibold text-base uppercase tracking-wider text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
              Capability
            </div>
            <div
              className="p-5 text-lg font-bold uppercase tracking-wider text-transparent bg-clip-text"
              style={{ backgroundImage: `linear-gradient(to bottom right, rgb(var(--theme-accent)), rgba(var(--theme-accent), 0.7))`, borderLeft: `1px solid rgba(var(--theme-text), 0.1)` }}
            >
              Traditional
            </div>
            <div
              className="p-5 text-lg font-bold uppercase tracking-wider text-transparent bg-clip-text"
              style={{
                backgroundImage: `linear-gradient(to right, rgb(var(--theme-primary)), rgba(var(--theme-primary), 0.7))`,
                borderLeft: `1px solid rgba(var(--theme-text), 0.1)`,
                backgroundColor: `rgba(var(--theme-primary), 0.06)`,
              }}
            >
              AI Agents
            </div>
          </div>

          {/* Feature Rows */}
          <div className="flex flex-col">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 transition-colors"
                style={{
                  backgroundColor: idx % 2 === 0 ? `rgba(var(--theme-text), 0.02)` : 'transparent',
                  borderBottom: idx < features.length - 1 ? `1px solid rgba(var(--theme-text), 0.06)` : 'none',
                }}
              >
                <div className="p-5 font-medium text-lg flex items-center text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
                  {feature.name}
                </div>

                <div className="p-5 flex items-center justify-center" style={{ borderLeft: `1px solid rgba(var(--theme-text), 0.1)` }}>
                  {feature.traditional ?
                    <div className="p-1 rounded-full" style={{ backgroundColor: `rgba(var(--theme-accent), 0.15)` }}>
                      <Check className="w-6 h-6" style={{ color: `rgb(var(--theme-accent))` }} />
                    </div> :
                    <div className="p-1 rounded-full" style={{ backgroundColor: `rgba(var(--theme-text-muted), 0.1)` }}>
                      <X className="w-6 h-6" style={{ color: `rgba(var(--theme-text-muted), 0.4)` }} />
                    </div>
                  }
                </div>

                <div
                  className="p-5 flex items-center justify-center"
                  style={{
                    borderLeft: `1px solid rgba(var(--theme-text), 0.1)`,
                    backgroundColor: `rgba(var(--theme-primary), 0.03)`,
                  }}
                >
                  {feature.agents ?
                    <div
                      className="p-1 rounded-full"
                      style={{
                        backgroundColor: `rgba(var(--theme-primary), 0.15)`,
                        boxShadow: `0 0 12px rgba(var(--theme-primary), 0.3)`,
                      }}
                    >
                      <Check className="w-6 h-6" style={{ color: `rgb(var(--theme-primary))` }} />
                    </div> :
                    <div className="p-1 rounded-full" style={{ backgroundColor: `rgba(var(--theme-text-muted), 0.1)` }}>
                      <X className="w-6 h-6" style={{ color: `rgba(var(--theme-text-muted), 0.4)` }} />
                    </div>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
