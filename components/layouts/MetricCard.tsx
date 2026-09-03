import { Card } from "@/lib/schema";
import { TrendingUp, Users, Zap, Target, Shield } from "lucide-react";

export function MetricCard({ card }: { card?: Card }) {
  const title = card?.title || "Projected Enterprise Impact";
  const subtitle = card?.subtitle || "Key performance indicators following full autonomous integration.";

  const metrics = card?.elements || [
    { id: "1", type: "stat_metric", metricValue: "40%", metricLabel: "Operational Cost Reduction", icon: "TrendingUp" },
    { id: "2", type: "stat_metric", metricValue: "10x", metricLabel: "Workflow Velocity Increase", icon: "Zap" },
    { id: "3", type: "stat_metric", metricValue: "2.5M", metricLabel: "Hours Saved Annually", icon: "Users" }
  ];

  const getIcon = (name: string, colorStyle: React.CSSProperties) => {
    const cls = "w-7 h-7";
    const props = { className: cls, style: colorStyle };
    switch(name) {
      case "TrendingUp": case "trending_up": return <TrendingUp {...props} />;
      case "Zap":        case "zap":         return <Zap {...props} />;
      case "Users":      case "users":       return <Users {...props} />;
      case "Target":     case "target":      return <Target {...props} />;
      case "Shield":     case "shield":      return <Shield {...props} />;
      default:                               return <TrendingUp {...props} />;
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto w-full">
        {metrics.map((el: any, index: number) => {
          const accentVar = accentVars[index % accentVars.length];
          return (
            <div
              key={el.id || index}
              className="flex-1 flex flex-col items-center justify-center rounded-2xl p-8 md:p-10 transition-all duration-300 backdrop-blur-xl hover:-translate-y-1.5 border shadow-2xl"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(var(${accentVar}), 0.12), rgba(var(${accentVar}), 0.03))`,
                borderColor: `rgba(var(${accentVar}), 0.3)`,
                boxShadow: `0 0 35px -8px rgba(var(${accentVar}), 0.3)`,
              }}
            >
              <div
                className="p-3.5 rounded-2xl mb-5 shadow-sm"
                style={{ backgroundColor: `rgba(var(${accentVar}), 0.18)` }}
              >
                {getIcon(el.icon || el.iconName || "TrendingUp", { color: `rgb(var(${accentVar}))` })}
              </div>
              <div
                className="text-5xl md:text-6xl font-black tracking-tight mb-3"
                style={{
                  color: `rgb(var(${accentVar}))`,
                  textShadow: `0 0 25px rgba(var(${accentVar}), 0.4)`,
                }}
              >
                {el.metricValue}
              </div>
              <div
                className="text-sm md:text-base font-semibold text-center uppercase tracking-wider leading-snug"
                style={{ color: `rgb(var(--theme-text))` }}
              >
                {el.metricLabel}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
