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
    const cls = "w-8 h-8";
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
    <div className="w-full h-full flex flex-col">
      <div className="mb-10 text-center">
        <h2
          className="text-3xl font-bold tracking-tight mb-3 text-transparent bg-clip-text"
          style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text)), rgba(var(--theme-text), 0.75))` }}
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-lg leading-relaxed max-w-3xl mx-auto text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}>
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

      <div className="flex-1 flex items-center justify-center gap-8">
        {metrics.map((el: any, index: number) => {
          const accentVar = accentVars[index % accentVars.length];
          return (
            <div
              key={el.id || index}
              className="flex-1 flex flex-col items-center justify-center rounded-2xl p-10 transition-all duration-300 backdrop-blur-md hover:-translate-y-1 border"
              style={{
                backgroundImage: `linear-gradient(to bottom, rgba(var(${accentVar}), 0.12), rgba(var(${accentVar}), 0.04))`,
                borderColor: `rgba(var(${accentVar}), 0.2)`,
                boxShadow: `0 0 30px -8px rgba(var(${accentVar}), 0.25)`,
              }}
            >
              <div
                className="p-3 rounded-xl mb-6"
                style={{ backgroundColor: `rgba(var(${accentVar}), 0.15)` }}
              >
                {getIcon(el.icon || el.iconName || "TrendingUp", { color: `rgb(var(${accentVar}))` })}
              </div>
              <div
                className="text-5xl font-black tracking-tight mb-3 text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(var(${accentVar}), 0.9), rgb(var(${accentVar})))`,
                }}
              >
                {el.metricValue}
              </div>
              <div
                className="text-sm leading-relaxed font-semibold text-center uppercase tracking-wider text-transparent bg-clip-text"
                style={{ backgroundImage: `linear-gradient(to right, rgb(var(--theme-text-muted)), rgba(var(--theme-text-muted), 0.7))` }}
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
