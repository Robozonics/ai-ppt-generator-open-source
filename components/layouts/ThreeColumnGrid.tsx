import { Card } from "@/lib/schema";
import { Brain, Cpu, Network, Shield, Zap, Target, Users } from "lucide-react";

export function ThreeColumnGrid({ card }: { card?: Card }) {
  const title = card?.title || "Core Pillars of Autonomy";
  const subtitle = card?.subtitle || "The three essential components required for autonomous task execution.";

  const items = card?.elements || [
    { id: "1", type: "callout", title: "Perception", icon: "Brain", content: "Understanding context through multimodal inputs, parsing unstructured data into structured states." },
    { id: "2", type: "callout", title: "Cognition", icon: "Cpu", content: "Reasoning over the current state, formulating a plan, and evaluating potential outcomes before acting." },
    { id: "3", type: "callout", title: "Actuation", icon: "Network", content: "Executing the plan via tool use, API calls, and interacting directly with digital environments." }
  ];

  const getIcon = (name: string, colorStyle: React.CSSProperties) => {
    const cls = "w-7 h-7";
    const props = { className: cls, style: colorStyle };
    switch(name) {
      case "Brain":   case "brain":   return <Brain {...props} />;
      case "Cpu":     case "cpu":     return <Cpu {...props} />;
      case "Network": case "network": return <Network {...props} />;
      case "Shield":  case "shield":  return <Shield {...props} />;
      case "Zap":     case "zap":     return <Zap {...props} />;
      case "Target":  case "target":  return <Target {...props} />;
      case "Users":   case "users":   return <Users {...props} />;
      default:                        return <Brain {...props} />;
    }
  };

  // Each column uses a different accent from the theme's accent palette
  const accentVars = ["--theme-accent-1", "--theme-accent-2", "--theme-accent-3"];

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="mb-8 text-center">
        <h2
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.85))` }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-base md:text-lg max-w-3xl mx-auto font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
            {subtitle}
          </p>
        )}
        <div
          className="mt-4 mx-auto w-20 h-1 rounded-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgb(var(--theme-accent-1)), rgb(var(--theme-accent-2)), rgb(var(--theme-accent-3)))`,
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
        {items.map((el: any, idx: number) => {
          const accentVar = accentVars[idx % accentVars.length];
          return (
            <div
              key={el.id || idx}
              className="flex flex-col rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1.5 border backdrop-blur-md shadow-xl"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(var(${accentVar}), 0.12), rgba(var(${accentVar}), 0.03))`,
                borderColor: `rgba(var(${accentVar}), 0.3)`,
                boxShadow: `0 0 30px -8px rgba(var(${accentVar}), 0.25)`,
              }}
            >
              <div
                className="p-3 rounded-xl w-fit mb-5 shadow-sm"
                style={{ backgroundColor: `rgba(var(${accentVar}), 0.18)` }}
              >
                {getIcon(el.icon || el.iconName || "Brain", { color: `rgb(var(${accentVar}))` })}
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: `rgb(var(--theme-text))` }}>
                {el.title || el.content?.slice(0, 30) || "Feature"}
              </h3>
              <p className="text-base leading-relaxed font-light" style={{ color: `rgb(var(--theme-text-muted))` }}>
                {el.content}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
