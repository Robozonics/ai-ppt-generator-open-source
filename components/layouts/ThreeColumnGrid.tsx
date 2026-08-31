import { Card } from "@/lib/schema";
import { Brain, Cpu, Network } from "lucide-react";

export function ThreeColumnGrid({ card }: { card?: Card }) {
  const title = card?.title || "Core Pillars of Autonomy";
  const subtitle = card?.subtitle || "The three essential components required for autonomous task execution.";

  const items = card?.elements || [
    { id: "1", type: "callout", title: "Perception", icon: "Brain", content: "Understanding context through multimodal inputs, parsing unstructured data into structured states." },
    { id: "2", type: "callout", title: "Cognition", icon: "Cpu", content: "Reasoning over the current state, formulating a plan, and evaluating potential outcomes before acting." },
    { id: "3", type: "callout", title: "Actuation", icon: "Network", content: "Executing the plan via tool use, API calls, and interacting directly with digital environments." }
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case "Brain":   return <Brain className="w-10 h-10 text-indigo-400" />;
      case "Cpu":     return <Cpu className="w-10 h-10 text-emerald-400" />;
      case "Network": return <Network className="w-10 h-10 text-rose-400" />;
      default:        return <Brain className="w-10 h-10 text-blue-400" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{title}</h2>
        {subtitle && <p className="text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto">{subtitle}</p>}
      </div>

      <div className="flex-1 grid grid-cols-3 gap-12">
        {items.map((el: any) => (
          <div key={el.id} className="flex flex-col bg-white/[0.04] border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-all duration-300">
            <div className="p-3 bg-white/[0.06] rounded-xl w-fit mb-6">
              {getIcon(el.icon || el.iconName || "Brain")}
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">{el.title || "Feature"}</h3>
            <p className="text-xl leading-relaxed text-slate-300">{el.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
