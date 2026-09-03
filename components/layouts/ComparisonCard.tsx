import { Card } from "@/lib/schema";
import { Check, X, ArrowRight } from "lucide-react";

export function ComparisonCard({ card }: { card?: Card }) {
  const title = card?.title || "Comparative Analysis";
  const subtitle = card?.subtitle || "Key capability and architectural differences";

  // Try to determine column headers from subtitle or title (e.g. "Traditional vs Modern")
  let colA = "Standard";
  let colB = "Advanced";

  const vsMatch = (subtitle + " " + title).match(/([A-Za-z0-9\s]{3,20})\s+(?:vs\.?|versus)\s+([A-Za-z0-9\s]{3,20})/i);
  if (vsMatch) {
    colA = vsMatch[1].trim();
    colB = vsMatch[2].trim();
  }

  // Parse rows dynamically from card.elements
  const elements = card?.elements || [];
  
  const parsedRows = elements.map((el: any, idx: number) => {
    const rawTitle = el.title || `Capability ${idx + 1}`;
    const rawContent = el.content || (Array.isArray(el.items) ? el.items.join(" vs ") : "");

    // Check if content has "vs", "|", or ":" separator
    let valA = "Standard";
    let valB = "Optimized";
    let isBooleanA: boolean | null = null;
    let isBooleanB: boolean | null = null;

    if (rawContent.includes(" vs ") || rawContent.includes(" vs. ")) {
      const parts = rawContent.split(/\s+vs\.?\s+/i);
      valA = parts[0]?.trim() || valA;
      valB = parts[1]?.trim() || valB;
    } else if (rawContent.includes(" | ")) {
      const parts = rawContent.split(" | ");
      valA = parts[0]?.trim() || valA;
      valB = parts[1]?.trim() || valB;
    } else if (rawContent.includes(" : ")) {
      const parts = rawContent.split(" : ");
      valA = parts[0]?.trim() || valA;
      valB = parts[1]?.trim() || valB;
    } else if (Array.isArray(el.items) && el.items.length >= 2) {
      valA = el.items[0];
      valB = el.items[1];
    } else if (rawContent) {
      valA = "Baseline";
      valB = rawContent;
    }

    // Detect boolean indicators
    const lowerA = valA.toLowerCase();
    const lowerB = valB.toLowerCase();
    if (lowerA === "no" || lowerA === "false" || lowerA === "none" || lowerA === "manual" || lowerA === "limited") {
      isBooleanA = false;
    } else if (lowerA === "yes" || lowerA === "true" || lowerA === "full" || lowerA === "automated" || lowerA === "high") {
      isBooleanA = true;
    }

    if (lowerB === "no" || lowerB === "false" || lowerB === "none" || lowerB === "manual" || lowerB === "limited") {
      isBooleanB = false;
    } else if (lowerB === "yes" || lowerB === "true" || lowerB === "full" || lowerB === "automated" || lowerB === "high") {
      isBooleanB = true;
    }

    return {
      feature: rawTitle,
      valA,
      valB,
      isBooleanA,
      isBooleanB,
    };
  });

  // Fallback rows only if no elements exist
  const rows = parsedRows.length > 0 ? parsedRows : [
    { feature: "Execution Speed", valA: "Sequential (Slow)", valB: "Real-time Parallel", isBooleanA: false, isBooleanB: true },
    { feature: "Adaptive Decision Making", valA: "Static Rules", valB: "Autonomous Planning", isBooleanA: false, isBooleanB: true },
    { feature: "Multimodal Processing", valA: "Text Only", valB: "Vision, Audio & Data", isBooleanA: false, isBooleanB: true },
    { feature: "Self-Correction", valA: "Manual Intervention", valB: "Automated Feedback Loops", isBooleanA: false, isBooleanB: true },
    { feature: "Scalability", valA: "Linear Overhead", valB: "Elastic Cloud Scaling", isBooleanA: false, isBooleanB: true },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      {/* Header */}
      <div className="text-center mb-8">
        <h2
          className="text-3xl md:text-4xl font-black tracking-tight mb-3 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.8))` }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg max-w-2xl mx-auto text-slate-300 font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {subtitle}
          </p>
        )}
        <div
          className="mx-auto w-20 h-1 rounded-full mt-4"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-accent)), rgb(var(--theme-primary)))` }}
        />
      </div>

      {/* Comparison Grid */}
      <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden border backdrop-blur-xl shadow-2xl"
        style={{
          borderColor: `rgba(var(--theme-primary), 0.25)`,
          backgroundColor: `rgba(var(--theme-surface), 0.4)`,
        }}
      >
        {/* Table Header */}
        <div
          className="grid grid-cols-12 text-sm md:text-base font-bold uppercase tracking-wider py-4 px-6 border-b"
          style={{
            borderColor: `rgba(var(--theme-primary), 0.2)`,
            backgroundImage: `linear-gradient(to right, rgba(var(--theme-primary), 0.15), rgba(var(--theme-secondary), 0.15))`,
          }}
        >
          <div className="col-span-5 text-slate-200" style={{ color: `rgb(var(--theme-text))` }}>
            Feature / Metric
          </div>
          <div className="col-span-3 text-center text-slate-300 border-l border-white/10" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {colA}
          </div>
          <div className="col-span-4 text-center font-extrabold border-l border-white/10" style={{ color: `rgb(var(--theme-primary))` }}>
            {colB}
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-white/5">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-12 items-center py-3.5 px-6 transition-colors hover:bg-white/[0.02]"
              style={{
                backgroundColor: idx % 2 === 0 ? `rgba(var(--theme-primary), 0.03)` : 'transparent',
              }}
            >
              {/* Feature Name */}
              <div className="col-span-5 font-semibold text-sm md:text-base" style={{ color: `rgb(var(--theme-text))` }}>
                {row.feature}
              </div>

              {/* Column A */}
              <div className="col-span-3 text-center text-sm md:text-base px-2 border-l border-white/5 flex items-center justify-center" style={{ color: `rgb(var(--theme-text-muted))` }}>
                {row.isBooleanA === true && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold text-xs border border-emerald-500/20">
                    <Check className="w-3.5 h-3.5" /> Yes
                  </span>
                )}
                {row.isBooleanA === false && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 font-semibold text-xs border border-rose-500/20">
                    <X className="w-3.5 h-3.5" /> No
                  </span>
                )}
                {row.isBooleanA === null && (
                  <span>{row.valA}</span>
                )}
              </div>

              {/* Column B (Highlighted / Primary) */}
              <div
                className="col-span-4 text-center font-bold text-sm md:text-base px-3 py-1.5 rounded-xl border-l border-white/5 flex items-center justify-center"
                style={{
                  backgroundColor: `rgba(var(--theme-primary), 0.08)`,
                  color: `rgb(var(--theme-text))`,
                }}
              >
                {row.isBooleanB === true && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs border border-emerald-500/40 shadow-sm">
                    <Check className="w-3.5 h-3.5" /> Yes
                  </span>
                )}
                {row.isBooleanB === false && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs border border-rose-500/40 shadow-sm">
                    <X className="w-3.5 h-3.5" /> No
                  </span>
                )}
                {row.isBooleanB === null && (
                  <span className="flex items-center gap-1.5 text-white">
                    <ArrowRight className="w-3.5 h-3.5 text-teal-400 shrink-0" style={{ color: `rgb(var(--theme-primary))` }} />
                    {row.valB}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
