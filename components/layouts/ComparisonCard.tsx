import { Card } from "@/lib/schema";
import { Check, X } from "lucide-react";

export function ComparisonCard({ card }: { card?: Card }) {
  const title = card?.title || "Traditional Software vs. AI Agents";

  const features = [
    { name: "Deterministic Logic",         traditional: true,  agents: false },
    { name: "Self-Correction",             traditional: false, agents: true  },
    { name: "Dynamic Planning",            traditional: false, agents: true  },
    { name: "Unstructured Data Handling",   traditional: false, agents: true  },
    { name: "Predictable Execution Paths", traditional: true,  agents: false },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-3xl font-bold tracking-tight text-white mb-12 text-center">{title}</h2>

      <div className="flex-1 flex justify-center items-center">
        <div className="w-full bg-white/[0.03] rounded-2xl overflow-hidden border border-white/10">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-white/[0.04] border-b border-white/10">
            <div className="p-5 font-semibold text-slate-400 text-lg">Capability</div>
            <div className="p-5 font-bold text-white text-lg text-center border-l border-white/10">Traditional Software</div>
            <div className="p-5 font-bold text-indigo-300 text-lg text-center border-l border-white/10 bg-indigo-500/[0.06]">Autonomous Agents</div>
          </div>

          {/* Feature Rows */}
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {features.map((feature, idx) => (
              <div key={idx} className="grid grid-cols-3 hover:bg-white/[0.04] transition-colors">
                <div className="p-5 font-medium text-xl leading-relaxed text-slate-300 flex items-center">{feature.name}</div>

                <div className="p-5 flex items-center justify-center border-l border-white/10">
                  {feature.traditional ?
                    <Check className="w-7 h-7 text-emerald-500" /> :
                    <X className="w-7 h-7 text-slate-600" />
                  }
                </div>

                <div className="p-5 flex items-center justify-center border-l border-white/10 bg-indigo-500/[0.03]">
                  {feature.agents ?
                    <Check className="w-7 h-7 text-indigo-400" /> :
                    <X className="w-7 h-7 text-slate-600" />
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
