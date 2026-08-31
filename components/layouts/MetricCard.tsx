import { Card } from "@/lib/schema";
import { TrendingUp, Users, Zap } from "lucide-react";

export function MetricCard({ card }: { card?: Card }) {
  const title = card?.title || "Projected Enterprise Impact";
  const subtitle = card?.subtitle || "Key performance indicators following full autonomous integration.";

  const metrics = card?.elements || [
    { id: "1", type: "stat_metric", metricValue: "40%", metricLabel: "Operational Cost Reduction", icon: "TrendingUp" },
    { id: "2", type: "stat_metric", metricValue: "10x", metricLabel: "Workflow Velocity Increase", icon: "Zap" },
    { id: "3", type: "stat_metric", metricValue: "2.5M", metricLabel: "Hours Saved Annually", icon: "Users" }
  ];

  const getIcon = (name: string) => {
    switch(name) {
      case "TrendingUp": return <TrendingUp className="w-10 h-10 text-emerald-400" />;
      case "Zap":        return <Zap className="w-10 h-10 text-amber-400" />;
      case "Users":      return <Users className="w-10 h-10 text-blue-400" />;
      default:           return <TrendingUp className="w-10 h-10 text-indigo-400" />;
    }
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-white mb-4">{title}</h2>
        {subtitle && <p className="text-xl leading-relaxed text-slate-300 max-w-3xl mx-auto">{subtitle}</p>}
      </div>

      <div className="flex-1 flex items-center justify-center gap-12">
        {metrics.map((el: any) => (
          <div key={el.id} className="flex-1 flex flex-col items-center justify-center bg-white/[0.04] border border-white/10 rounded-2xl p-10 hover:bg-white/[0.08] transition-all duration-300 backdrop-blur-md">
            <div className="p-3 bg-white/[0.06] rounded-xl mb-6">
              {getIcon(el.icon || el.iconName || "TrendingUp")}
            </div>
            <div className="text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-3">
              {el.metricValue}
            </div>
            <div className="text-xl leading-relaxed text-slate-300 font-medium text-center uppercase tracking-wider">
              {el.metricLabel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
